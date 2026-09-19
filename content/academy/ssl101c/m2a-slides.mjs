/**
 * SSL101c · Mooc 2 (deck 'ssl2') — slide 1–25, học theo từng slide.
 *
 * ⚠️ NGUỒN: bộ slide này là ẢNH TOÀN TRANG (bản gốc University of Sydney, nền
 * đỏ). Lớp text của .pptx RỖNG — /tmp/ssl101c-text/ssl2.txt chỉ có đúng hai chữ
 * "MOOC 2" ở slide 1, còn lại 100 slide ghi "(không có chữ)". Toàn bộ 25 slide
 * dưới đây đã được ĐỌC THẲNG TỪ ẢNH /tmp/ssl101c-slides/ssl2/001.webp …
 * 025.webp, từng cái một, không suy đoán.
 *
 * NỘI DUNG THẬT của slide 1–25 (KHÁC với phỏng đoán ban đầu "nhận diện vấn đề &
 * đặt mục tiêu" — trong 25 slide này KHÔNG có một chữ nào về đặt mục tiêu/SMART):
 *   · 1      Slide bìa "MOOC 2" (slide TRẮNG duy nhất của cả deck)
 *   · 2      2.1a Defining Problems — 4 dòng mục tiêu
 *   · 3      Sơ đồ định nghĩa vấn đề: Initial State → Solution Path → Goal
 *   · 4–9    SÁU loại vấn đề theo BA cặp: knowledge-lean/rich ·
 *            well-/ill-defined · semantically rich/lean
 *   · 10     Insight Problems — loại thứ BẢY, là TẬP CON của sáu loại trên
 *   · 11     2.1d Examples of different problems in different fields (mục tiêu)
 *   · 12–14  2.2a Descriptive Tasks and Problems + 6 động từ + phân biệt
 *            "task" (TRƯNG ra) với "(simple) problem" (DÙNG để giải)
 *   · 15–17  2.3a Analytical Tasks + 8 động từ + bản chất nhiệm vụ phân tích
 *   · 18–23  2.3b Analytical Problems: 4 đặc điểm + quy trình BA bước của Brick
 *            (identify the problem · identify the solutions · evaluate the
 *            solution) + slide tóm tắt
 *   · 24–25  2.4a The Problem-Solving Process + BỐN bước của Pólya (1957)
 *
 * Chỗ deck gốc LẶP / LỆCH / THIẾU — nêu thẳng, không im lặng chép, không tự sửa:
 *   · slide 11 (2.1d) chép NGUYÊN BỐN dòng mục tiêu của slide 2 (2.1a) rồi
 *     thêm một dòng thứ năm. Mục 2.1b và 2.1c KHÔNG có trong bản review này.
 *   · slide 18 (2.3b "Analytical Problems") có BA dòng mục tiêu GIỐNG HỆT slide
 *     15 (2.3a "Analytical Tasks") — kể cả chữ "task" trong cả ba dòng.
 *   · slide 23 ("Summary: Analytical Problems") chép NGUYÊN slide 19.
 *   · slide 7 (Ill-Defined) viết "may need to be JUSTIFIED"; slide 19 và 23
 *     (Analytical Problems) viết "may need to be DEFINED" — khác chữ thật trên
 *     ảnh, không phải gõ nhầm.
 *   · slide 3 ghi "Adapted from: Robertson, 2011" trong khi slide 4–9 đều ghi
 *     "Robertson, 2001". Một trong hai năm sai, deck không tự sửa.
 *   · "Describe" nằm trong danh sách ĐỘNG TỪ PHÂN TÍCH (slide 16), KHÔNG nằm
 *     trong danh sách động từ mô tả (slide 13). Đây là bẫy nặng nhất của khối.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'ssl2';

export default {
  title: '2.0a — Slide by slide: What a problem is, the seven problem types, descriptive vs analytical tasks, and Pólya (slides 1–25)|||2.0a — Slide bài giảng: Vấn đề là gì, bảy loại vấn đề, nhiệm vụ mô tả & phân tích, và bốn bước Pólya (slide 1–25)',
  slug: 'ssl101c-2-0a-slides-loai-van-de-nhiem-vu-mo-ta-phan-tich-polya',
  type: 'DOCUMENT',
  description: 'Một phần tư đầu của Mooc 2 (25 slide, đọc thẳng từ ảnh slide gốc University of Sydney). Đi từ định nghĩa "vấn đề" bằng sơ đồ Initial State → Solution Path → Goal, qua BA CẶP phân loại độc lập nhau (knowledge-lean/rich · well-/ill-defined · semantically rich/lean) cộng loại thứ bảy là Insight, sang ngôn ngữ đề bài ở đại học (6 động từ MÔ TẢ so với 8 động từ PHÂN TÍCH, trong đó "Describe" nằm ở phía phân tích chứ không phải phía mô tả), rồi quy trình BA bước giải vấn đề phân tích của Brick và khép lại bằng BỐN bước của Pólya. Mọi khung đều được chạy trọn trên một tình huống thật: nhóm SWP391 trễ tiến độ hai tuần vì một thành viên không nộp phần việc — kèm 5 Whys và biểu đồ xương cá để tìm nguyên nhân gốc, và một mục tiêu SMART được sửa dần từ bản tồi.',
  content: [
    walkHead(D, 1, 25),
    walk(D, [

      [1, 'MOOC 2 — title slide',
        `<p class="y-chinh">🎯 The cover slide of the whole module: two words, <strong>MOOC 2</strong>, black on white. It is also the <strong>only white slide in the entire 101-slide deck</strong> — every other slide is the red University of Sydney template, which is a quick way to tell you have the right file open.</p>
<ul>
<li><strong>What MOOC 2 is actually about.</strong> MOOC 1 was information literacy — finding, evaluating and managing sources. MOOC 2 turns to <em>problem solving and creativity</em>: what counts as a problem, which kinds of problem university actually sets you, what the wording of an assessment task is telling you to do, and which processes carry you from a confused starting point to a defensible answer.</li>
<li><strong>Why the first 25 slides matter more than their number suggests.</strong> They are almost entirely <em>definitions and named lists</em> — six problem types plus a seventh, six descriptive verbs, eight analytical verbs, a three-step process and a four-step process. That is exactly the material a 60-minute multiple-choice exam can test cleanly, so this block is dense with likely questions.</li>
<li><strong>How SSL101c is assessed, and what follows from it.</strong> 100% of the subject mark is one multiple-choice paper taken at FPTU, covering all five MOOCs; you need the certificate from all five before you may sit it, and finishing every MOOC before the deadline earns a bonus mark. So the goal while reading these slides is not "get the gist" — it is <em>remember the exact names, and the exact counts</em>.</li>
<li><strong>The route through slides 1–25.</strong> 2 objectives → 3 the definition → 4–10 the seven types → 11 a second objectives slide → 12–14 descriptive tasks → 15–23 analytical tasks and problems → 24–25 Pólya's four steps. Two big ideas, one small: <em>what kind of problem is this</em>, and <em>what is the task word telling me to do</em>.</li>
</ul>
<p class="meo">💡 Carry four numbers out of this block and most of the recall questions are already answered: <strong>7</strong> problem types · <strong>6</strong> descriptive verbs · <strong>8</strong> analytical verbs · <strong>4</strong> Pólya steps (and <strong>3</strong> Brick steps inside the analytical section).</p>`,
        `<p class="y-chinh">🎯 Slide bìa của cả module: đúng hai chữ <strong>MOOC 2</strong>, chữ đen nền trắng. Nó cũng là <strong>slide TRẮNG duy nhất trong cả bộ 101 slide</strong> — mọi slide còn lại đều là mẫu nền đỏ của University of Sydney, nên đây là cách nhanh nhất để biết bạn đang mở đúng file.</p>
<ul>
<li><strong>MOOC 2 thật ra nói về cái gì.</strong> MOOC 1 là năng lực thông tin — tìm, đánh giá và quản lý nguồn. MOOC 2 quay sang <em>giải quyết vấn đề và sáng tạo</em>: thế nào thì được gọi là một "vấn đề", đại học thường ra cho bạn những loại vấn đề nào, chữ nghĩa trong đề bài đang bảo bạn làm gì, và quy trình nào đưa bạn từ một điểm xuất phát mù mờ tới một câu trả lời bảo vệ được.</li>
<li><strong>Vì sao 25 slide đầu quan trọng hơn con số của nó.</strong> Chúng gần như toàn <em>định nghĩa và danh sách có tên</em> — sáu loại vấn đề cộng loại thứ bảy, sáu động từ mô tả, tám động từ phân tích, một quy trình ba bước và một quy trình bốn bước. Đó đúng là loại nội dung mà một bài trắc nghiệm 60 phút hỏi được gọn gàng nhất, nên khối này dày đặc câu hỏi tiềm năng.</li>
<li><strong>SSL101c chấm điểm thế nào, và kéo theo điều gì.</strong> 100% điểm môn nằm ở MỘT bài trắc nghiệm thi tại trường, phủ cả năm MOOC; phải có chứng chỉ đủ năm MOOC mới được thi, và hoàn thành mọi MOOC trước hạn thì được cộng 1 điểm thưởng. Vậy nên mục tiêu khi đọc mấy slide này không phải "nắm ý chung" — mà là <em>nhớ đúng TÊN và nhớ đúng SỐ LƯỢNG</em>.</li>
<li><strong>Lộ trình slide 1–25.</strong> 2 mục tiêu → 3 định nghĩa → 4–10 bảy loại vấn đề → 11 một slide mục tiêu nữa → 12–14 nhiệm vụ mô tả → 15–23 nhiệm vụ và vấn đề phân tích → 24–25 bốn bước Pólya. Hai câu hỏi lớn, một câu nhỏ: <em>đây là loại vấn đề gì</em>, và <em>động từ trong đề đang bảo tôi làm gì</em>.</li>
</ul>
<p class="meo">💡 Mang bốn con số ra khỏi khối này là trả lời được phần lớn câu hỏi ghi nhớ: <strong>7</strong> loại vấn đề · <strong>6</strong> động từ mô tả · <strong>8</strong> động từ phân tích · <strong>4</strong> bước Pólya (và <strong>3</strong> bước của Brick nằm trong mục phân tích).</p>`],

      [2, '2.1a Defining Problems — learning outcomes (four bullets, three pairs)',
        `<p class="y-chinh">🎯 The objectives slide for section 2.1a, and it is really a table of contents: <strong>define what a "problem" is</strong>, then recognise the difference within <strong>three pairs</strong> — ill- vs well-defined, semantically lean vs semantically rich, knowledge-lean vs knowledge-rich.</p>
<table>
<tr><th>Pair</th><th>The question it answers</th><th>Depends on…</th></tr>
<tr><td>Well-defined ↔ <strong>Ill</strong>-defined</td><td>Is the path and the goal clear?</td><td>The <strong>problem</strong> itself</td></tr>
<tr><td>Semantically rich ↔ <strong>lean</strong></td><td>Have I met this <em>type</em> of problem before?</td><td>The <strong>solver</strong></td></tr>
<tr><td>Knowledge-rich ↔ <strong>lean</strong></td><td>Does solving it need prior subject knowledge?</td><td>The <strong>field</strong></td></tr>
</table>
<ul>
<li><strong>The three pairs are independent axes, not three names for one thing.</strong> This is the single most useful idea in section 2.1. One problem can be ill-defined <em>and</em> knowledge-rich <em>and</em> semantically lean all at once — the labels stack, they do not compete.</li>
<li><strong>Note the order the objectives use, because the deck then breaks it.</strong> Objectives say ill/well → semantic → knowledge. Slides 4–9 present them as knowledge (4–5) → defined (6–7) → semantic (8–9). Learn the pairs, not the running order, or a reordered exam option will throw you.</li>
<li><strong>Why "define what a problem is" comes first.</strong> Most students use "problem" to mean "something annoying". Slide 3 will give it a technical meaning — a gap between a state you are in and a state you want — and every later distinction hangs off that definition.</li>
<li><strong>At FPTU.</strong> Take the case we will use all the way through: <em>the SWP391 group is two weeks behind schedule and one member has not submitted their part</em>. By the end of slide 9 you will be able to label it on all three axes, and each label tells you something different about what to do next.</li>
</ul>
<p class="meo">💡 Remember it as <strong>3 pairs = 6 types</strong>, plus Insight on slide 10 = <strong>7</strong>. And remember which side of each pair is "hard": ill-defined, semantically <em>lean</em>, knowledge-<em>rich</em>. Two "leans" are easy-side, one "lean" is hard-side — that asymmetry is exactly what gets tested.</p>
<p class="pitfall">⚠️ Do not read "lean" as always meaning easy. <strong>Knowledge-lean = easier</strong> (little prior knowledge needed), but <strong>semantically lean = harder</strong> (you have never seen this type before). Same adjective, opposite difficulty.</p>`,
        `<p class="y-chinh">🎯 Slide mục tiêu của mục 2.1a, và thực chất nó là một mục lục: <strong>định nghĩa "vấn đề" là gì</strong>, rồi nhận ra khác biệt trong <strong>BA CẶP</strong> — ill- so với well-defined, semantically lean so với semantically rich, knowledge-lean so với knowledge-rich.</p>
<table>
<tr><th>Cặp</th><th>Nó trả lời câu hỏi nào</th><th>Phụ thuộc vào…</th></tr>
<tr><td>Well-defined ↔ <strong>Ill</strong>-defined<br/>(rõ ràng ↔ chưa rõ ràng)</td><td>Đường đi và đích đến có rõ không?</td><td>Bản thân <strong>VẤN ĐỀ</strong></td></tr>
<tr><td>Semantically rich ↔ <strong>lean</strong><br/>(quen dạng ↔ lạ dạng)</td><td>Tôi đã gặp <em>DẠNG</em> này bao giờ chưa?</td><td><strong>NGƯỜI GIẢI</strong></td></tr>
<tr><td>Knowledge-rich ↔ <strong>lean</strong><br/>(nặng ↔ nhẹ kiến thức nền)</td><td>Giải nó có cần kiến thức chuyên ngành không?</td><td><strong>NGÀNH</strong> học</td></tr>
</table>
<ul>
<li><strong>Ba cặp là BA TRỤC ĐỘC LẬP, không phải ba cách gọi một thứ.</strong> Đây là ý hữu dụng nhất của cả mục 2.1. Một vấn đề có thể VỪA ill-defined VỪA knowledge-rich VỪA semantically lean cùng lúc — các nhãn CHỒNG lên nhau chứ không loại trừ nhau.</li>
<li><strong>Để ý thứ tự trong mục tiêu, vì ngay sau đó deck phá vỡ nó.</strong> Mục tiêu ghi ill/well → ngữ nghĩa → kiến thức. Nhưng slide 4–9 trình bày theo kiến thức (4–5) → rõ/chưa rõ (6–7) → ngữ nghĩa (8–9). Hãy thuộc CẶP, đừng thuộc thứ tự, không thì một phương án đảo thứ tự sẽ làm bạn lúng túng.</li>
<li><strong>Vì sao "định nghĩa vấn đề là gì" đứng đầu.</strong> Phần lớn sinh viên dùng chữ "vấn đề" với nghĩa "chuyện phiền phức". Slide 3 sẽ cho nó một nghĩa kỹ thuật — KHOẢNG CÁCH giữa trạng thái bạn đang ở và trạng thái bạn muốn tới — và mọi phân biệt về sau đều treo vào định nghĩa đó.</li>
<li><strong>Ở FPTU.</strong> Lấy luôn tình huống ta sẽ dùng xuyên suốt: <em>nhóm SWP391 trễ tiến độ hai tuần, một thành viên không nộp phần việc</em>. Tới hết slide 9 bạn sẽ dán được nhãn cho nó trên cả ba trục, và mỗi nhãn nói cho bạn một điều khác nhau về việc phải làm tiếp.</li>
</ul>
<p class="meo">💡 Nhớ thành <strong>3 cặp = 6 loại</strong>, cộng Insight ở slide 10 = <strong>7</strong>. Và nhớ bên nào của mỗi cặp là bên "khó": ill-defined, semantically <em>lean</em>, knowledge-<em>rich</em>. Hai chữ "lean" nằm ở bên dễ, một chữ "lean" nằm ở bên khó — chính chỗ bất đối xứng đó là chỗ đề thi nhắm vào.</p>
<p class="pitfall">⚠️ Đừng hiểu "lean" lúc nào cũng là dễ. <strong>Knowledge-lean = dễ hơn</strong> (cần ít kiến thức nền), nhưng <strong>semantically lean = KHÓ hơn</strong> (bạn chưa từng gặp dạng này). Cùng một tính từ, ngược nhau về độ khó.</p>`],

      [3, 'What is a problem? — Initial State → Solution Path → Goal',
        `<p class="y-chinh">🎯 One diagram, three labels, and it is the definition the whole module rests on: a problem is an <strong>Initial State</strong>, a <strong>Goal</strong>, and a <strong>Solution Path</strong> of arrows running from one to the other (<em>Adapted from: Robertson, 2011</em>).</p>
<table>
<tr><th>Element</th><th>Plain meaning</th><th>SWP391 example</th></tr>
<tr><td><strong>Initial State</strong></td><td>Where you are now, stated factually</td><td>Sprint 2 ended with 4 of 9 user stories done; one member has submitted nothing for 12 days</td></tr>
<tr><td><strong>Solution Path</strong></td><td>The sequence of moves between the two</td><td>Unknown — this is what has to be worked out</td></tr>
<tr><td><strong>Goal</strong></td><td>The state you want, stated so you can tell when you reach it</td><td>All 9 stories demoed and merged by the review date, with an evidenced record of who did what</td></tr>
</table>
<ul>
<li><strong>A problem is a GAP, not a feeling.</strong> If there is no gap between initial state and goal, there is no problem — only a situation. And if you cannot say what the goal state is, you have no way to recognise a solution when you produce one; the diagram makes that failure visible.</li>
<li><strong>Three things can be unknown, and which one is unknown decides the type.</strong> Unknown path only → a well-defined problem (slide 6). Unknown goal, or unknown path <em>and</em> goal → ill-defined (slide 7). That single observation is what slides 6 and 7 are about.</li>
<li><strong>Where students actually go wrong.</strong> They state the initial state as a complaint ("the group is a mess") rather than as facts, and they state the goal as a mood ("everything runs smoothly") rather than as an observable condition. Both make the path unfindable, because there is nothing to navigate between.</li>
<li><strong>Use the diagram as a one-minute drill.</strong> Before starting any assignment, write three lines: where am I, where must I be, what is between them. If the middle line is empty you have a real problem to solve; if the middle line is obvious you have a task to execute, not a problem.</li>
</ul>
<p class="dap-an">✅ Apply it: "Explain how you would advise a local government to address obesity." Initial state = a population with a given obesity rate and existing policies; Goal = <em>not stated</em> — you must define what "address" means; Path = not given. Because the goal is unstated, this is ill-defined — and slide 7 uses this very example.</p>
<p class="pitfall">⚠️ Citation drift worth noticing: this slide credits <strong>Robertson, 2011</strong>, while slides 4–9 all credit <strong>Robertson, 2001</strong> for the same framework. One of the two years is a typo in the original deck. Learn the model, not the year.</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ, ba nhãn, và đó là định nghĩa mà cả module này đứng lên: một vấn đề gồm <strong>Initial State</strong> (trạng thái ban đầu), <strong>Goal</strong> (đích), và <strong>Solution Path</strong> (đường giải) là dãy mũi tên chạy từ cái nọ sang cái kia (<em>Adapted from: Robertson, 2011</em>).</p>
<table>
<tr><th>Thành phần</th><th>Nghĩa trần trụi</th><th>Ví dụ SWP391</th></tr>
<tr><td><strong>Initial State</strong></td><td>Bạn đang ở đâu, nói bằng SỰ KIỆN</td><td>Hết Sprint 2 mới xong 4/9 user story; một thành viên 12 ngày không nộp gì</td></tr>
<tr><td><strong>Solution Path</strong></td><td>Chuỗi bước đi giữa hai đầu</td><td>Chưa biết — đây chính là thứ phải nghĩ ra</td></tr>
<tr><td><strong>Goal</strong></td><td>Trạng thái bạn muốn, nói sao cho BIẾT LÚC NÀO ĐÃ TỚI</td><td>Cả 9 story demo và merge xong trước ngày review, có bằng chứng ai làm gì</td></tr>
</table>
<ul>
<li><strong>Vấn đề là một KHOẢNG CÁCH, không phải một cảm xúc.</strong> Không có khoảng cách giữa trạng thái đầu và đích thì không có vấn đề — chỉ có một tình cảnh. Và nếu bạn không nói được trạng thái đích là gì thì bạn không có cách nào NHẬN RA lời giải khi đã tạo ra nó; sơ đồ làm cho thất bại đó hiện hình.</li>
<li><strong>Ba thứ có thể bị khuyết, và thứ nào khuyết sẽ quyết định LOẠI.</strong> Chỉ khuyết đường đi → vấn đề rõ ràng (slide 6). Khuyết đích, hoặc khuyết CẢ đường lẫn đích → chưa rõ ràng (slide 7). Đúng một nhận xét đó là toàn bộ nội dung slide 6 và 7.</li>
<li><strong>Sinh viên hay sai ở đâu.</strong> Họ viết trạng thái ban đầu thành lời than ("nhóm loạn hết rồi") thay vì viết bằng sự kiện, và viết đích thành một tâm trạng ("mọi thứ trôi chảy") thay vì một điều kiện QUAN SÁT ĐƯỢC. Cả hai làm cho đường đi không tìm nổi, vì chẳng có hai điểm nào để đi giữa chúng.</li>
<li><strong>Dùng sơ đồ như một bài tập một phút.</strong> Trước khi bắt đầu bất kỳ bài tập nào, viết ba dòng: tôi đang ở đâu, tôi phải tới đâu, giữa chúng là gì. Dòng giữa trống → bạn đang có một vấn đề thật để giải; dòng giữa hiển nhiên → bạn chỉ có một việc để làm, không phải vấn đề.</li>
</ul>
<p class="dap-an">✅ Áp thử: "Hãy tư vấn cho chính quyền một thành phố cách xử lý nạn béo phì." Trạng thái đầu = dân số với một tỉ lệ béo phì và các chính sách đang có; Đích = <em>KHÔNG được nêu</em> — bạn phải tự định nghĩa "xử lý" nghĩa là gì; Đường đi = không cho. Vì đích không được nêu, đây là vấn đề chưa rõ ràng — và slide 7 dùng đúng ví dụ này.</p>
<p class="pitfall">⚠️ Một chỗ lệch trích dẫn đáng để ý: slide này ghi <strong>Robertson, 2011</strong>, trong khi slide 4–9 đều ghi <strong>Robertson, 2001</strong> cho cùng một khung. Một trong hai năm là lỗi gõ của deck gốc. Hãy thuộc mô hình, đừng thuộc năm.</p>`],

      [4, 'Knowledge-Lean Problems — little prior knowledge needed',
        `<p class="y-chinh">🎯 <strong>"Problems where little prior knowledge is needed to solve them" (Robertson, 2001, p.14)</strong>. Three supporting bullets: e.g. thought problems, puzzles, brain teasers · do not require additional resources · <strong>all the information is given to you in the problem</strong>.</p>
<ul>
<li><strong>The defining test is self-containment.</strong> Everything you need is inside the question. You do not go to the library, you do not look anything up — you reason with what is on the page. That is why puzzles and brain teasers are the slide's examples.</li>
<li><strong>"Little prior knowledge" is not "no intelligence".</strong> Knowledge-lean problems can be brutally hard; river-crossing puzzles and the classic nine-dot problem need no subject knowledge at all and still defeat most people. The axis measures <em>what you must know</em>, not <em>how hard it is</em>.</li>
<li><strong>Why the course bothers with this category.</strong> Because almost nothing at university is knowledge-lean, and knowing that changes how you attack assignments. If you are stuck on a university problem, "think harder" is usually the wrong move; "go and read the right source" is usually the right one.</li>
<li><strong>At FPTU the clean examples are in interviews and aptitude tests.</strong> A logic puzzle in a recruitment round, a "how many ways can you…" brainteaser, an algorithm riddle stated fully in its own text. Contrast with a PRF192 assignment, which assumes you know loops, arrays and C syntax before you start.</li>
<li><strong>Careful with LeetCode-style problems.</strong> The statement is self-contained (knowledge-lean in appearance), but solving it efficiently needs data structures, complexity analysis and language knowledge (knowledge-rich in fact). The stated information is complete; the required knowledge is not. Judge by <em>what you must bring</em>.</li>
</ul>
<p class="meo">💡 Three-word handle: knowledge-lean = <strong>self-contained</strong>. The slide's own phrase "all the information is given to you in the problem" is the exam-friendly wording — it appears almost verbatim in the well-defined definition on slide 6, which is why those two get confused.</p>
<p class="pitfall">⚠️ Knowledge-lean ≠ well-defined. "All the information is given" (knowledge) and "the path and goal are clear" (definition) are different claims. A riddle can give you every fact and still hide both the path and what counts as an answer.</p>`,
        `<p class="y-chinh">🎯 <strong>"Những vấn đề mà giải chúng chỉ cần rất ít kiến thức có sẵn" (Robertson, 2001, tr.14)</strong>. Ba gạch đầu dòng đỡ theo: ví dụ là câu đố tư duy, puzzle, brain teaser · không cần thêm tài nguyên nào · <strong>toàn bộ thông tin đã được trao cho bạn ngay trong đề</strong>.</p>
<ul>
<li><strong>Phép thử để nhận dạng là TÍNH TỰ CHỨA.</strong> Mọi thứ bạn cần nằm bên trong câu hỏi. Bạn không phải ra thư viện, không phải tra cứu gì — bạn lập luận với những gì có trên giấy. Vì thế ví dụ của slide là puzzle và brain teaser.</li>
<li><strong>"Ít kiến thức nền" KHÔNG phải "không cần nghĩ".</strong> Vấn đề knowledge-lean có thể khó tàn nhẫn; bài qua sông hay bài chín chấm kinh điển chẳng cần kiến thức chuyên ngành nào mà vẫn hạ gục phần lớn người ta. Trục này đo <em>bạn PHẢI BIẾT gì</em>, không đo <em>nó KHÓ tới đâu</em>.</li>
<li><strong>Vì sao môn học vẫn dạy loại này.</strong> Vì ở đại học gần như KHÔNG có gì là knowledge-lean cả, và biết điều đó làm đổi cách bạn xông vào bài tập. Bí ở một bài đại học thì "cố nghĩ thêm" thường là nước đi sai; "đi đọc đúng nguồn" thường là nước đi đúng.</li>
<li><strong>Ở FPTU ví dụ sạch nhất nằm trong phỏng vấn và bài test đầu vào.</strong> Một câu đố logic vòng tuyển dụng, một bài "có bao nhiêu cách…", một câu đố thuật toán được phát biểu trọn vẹn trong chính đề. Đối lập với bài tập PRF192, vốn mặc định bạn đã biết vòng lặp, mảng và cú pháp C trước khi bắt đầu.</li>
<li><strong>Cẩn thận với bài kiểu LeetCode.</strong> Đề tự chứa (NHÌN thì knowledge-lean), nhưng giải cho tối ưu thì cần cấu trúc dữ liệu, phân tích độ phức tạp và kiến thức ngôn ngữ (THẬT ra là knowledge-rich). Thông tin ĐƯỢC NÊU thì đủ; kiến thức ĐƯỢC ĐÒI thì không. Hãy phán theo <em>thứ bạn phải mang tới</em>.</li>
</ul>
<p class="meo">💡 Móc nhớ: knowledge-lean = <strong>TỰ CHỨA</strong>. Chính câu của slide — "toàn bộ thông tin đã được trao cho bạn ngay trong đề" — là cách diễn đạt hay xuất hiện trong đề thi, và nó gần như trùng với định nghĩa well-defined ở slide 6, nên hai cái này mới hay bị lẫn.</p>
<p class="pitfall">⚠️ Knowledge-lean ≠ well-defined. "Đã cho đủ thông tin" (trục KIẾN THỨC) và "đường đi với đích đều rõ" (trục ĐỊNH NGHĨA) là hai khẳng định khác nhau. Một câu đố có thể cho bạn đủ mọi dữ kiện mà vẫn giấu cả đường đi lẫn cái gì mới được tính là đáp án.</p>`],

      [5, 'Knowledge-Rich Problems — lots of prior knowledge required',
        `<p class="y-chinh">🎯 The mirror image: <strong>"Problems where lots of prior knowledge is usually required" (Robertson, 2001, p.14)</strong> — e.g. complex mathematical problems, analytical essay questions, new scientific hypotheses — needing <strong>specific knowledge in your field: vocabulary, formulas, theories, concepts</strong>.</p>
<table>
<tr><th>The slide's four kinds of field knowledge</th><th>In a Software Engineering degree</th></tr>
<tr><td><strong>Vocabulary</strong></td><td>coupling, idempotent, regression testing, race condition</td></tr>
<tr><td><strong>Formulas</strong></td><td>Big-O bounds, cyclomatic complexity, defect density</td></tr>
<tr><td><strong>Theories</strong></td><td>normalisation, CAP theorem, SOLID, Conway's law</td></tr>
<tr><td><strong>Concepts</strong></td><td>abstraction, separation of concerns, technical debt</td></tr>
</table>
<ul>
<li><strong>Memorise that four-item sub-list — it is exactly the kind of thing a multiple-choice item asks.</strong> Vocabulary · formulas · theories · concepts. Note the order runs from the smallest unit (a word) to the largest (a whole way of seeing), which is a usable mnemonic.</li>
<li><strong>Almost all university assessment is knowledge-rich, and that is the point of the slide.</strong> The three examples given — complex maths, analytical essays, new hypotheses — are the three dominant assessment shapes across faculties. If you feel unable to start an assignment, the first hypothesis should be a knowledge gap, not a thinking failure.</li>
<li><strong>It gives you a diagnosis you can act on.</strong> Stuck on a knowledge-rich problem → identify which of the four you are missing, then go get that specific thing. "I don't understand the question" is usually "I do not own the vocabulary in the question".</li>
<li><strong>SWP391 case.</strong> "The group is two weeks behind" is knowledge-rich in a way students underestimate: to solve it properly you need vocabulary (velocity, scope, critical path), a formula-ish tool (remaining work ÷ realistic velocity), and a theory (Brooks's law: adding people to a late project makes it later). Without those you will reach for the intuitive fix — "everyone just works harder" — which the theory says will fail.</li>
</ul>
<p class="meo">💡 Pair the two definitions by their quantifier: knowledge-<strong>lean</strong> = "<em>little</em> prior knowledge is needed"; knowledge-<strong>rich</strong> = "<em>lots</em> of prior knowledge is <em>usually</em> required". The hedge word "usually" is in the rich definition only.</p>
<p class="pitfall">⚠️ Knowledge-rich is about what the <em>field</em> demands, not about you personally. Whether <em>you</em> happen to have met this problem type before is the <strong>semantic</strong> axis (slides 8–9). Two different questions, and the exam loves to swap them.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương: <strong>"Những vấn đề mà thường đòi RẤT NHIỀU kiến thức có sẵn" (Robertson, 2001, tr.14)</strong> — ví dụ bài toán phức tạp, câu hỏi tiểu luận phân tích, giả thuyết khoa học mới — cần <strong>kiến thức riêng của ngành: thuật ngữ, công thức, lý thuyết, khái niệm</strong>.</p>
<table>
<tr><th>Bốn loại kiến thức ngành theo slide</th><th>Trong ngành Kỹ thuật phần mềm</th></tr>
<tr><td><strong>Thuật ngữ</strong></td><td>coupling, idempotent, kiểm thử hồi quy, race condition</td></tr>
<tr><td><strong>Công thức</strong></td><td>cận Big-O, độ phức tạp chu trình, mật độ lỗi</td></tr>
<tr><td><strong>Lý thuyết</strong></td><td>chuẩn hoá CSDL, định lý CAP, SOLID, luật Conway</td></tr>
<tr><td><strong>Khái niệm</strong></td><td>trừu tượng hoá, tách mối quan tâm, nợ kỹ thuật</td></tr>
</table>
<ul>
<li><strong>Thuộc cái danh sách con BỐN mục này — nó đúng là thứ trắc nghiệm hay hỏi.</strong> Thuật ngữ · công thức · lý thuyết · khái niệm. Để ý thứ tự chạy từ đơn vị nhỏ nhất (một CHỮ) tới đơn vị lớn nhất (một CÁCH NHÌN), đó là mẹo nhớ dùng được.</li>
<li><strong>Gần như MỌI bài kiểm tra ở đại học đều knowledge-rich, và đó mới là ý của slide.</strong> Ba ví dụ được nêu — toán phức tạp, tiểu luận phân tích, giả thuyết mới — chính là ba hình dạng bài tập thống trị ở mọi khoa. Nếu bạn thấy không khởi động nổi một bài tập, giả thuyết đầu tiên nên là THIẾU KIẾN THỨC, không phải kém tư duy.</li>
<li><strong>Nó cho bạn một chẩn đoán hành động được.</strong> Bí ở một bài knowledge-rich → xác định bạn đang thiếu cái nào trong bốn thứ trên, rồi đi lấy đúng cái đó. "Em không hiểu đề" thường thật ra là "em chưa sở hữu thuật ngữ nằm trong đề".</li>
<li><strong>Tình huống SWP391.</strong> "Nhóm trễ hai tuần" là một vấn đề knowledge-rich theo cách sinh viên hay coi thường: muốn giải tử tế, bạn cần thuật ngữ (velocity, phạm vi, đường găng), một công cụ kiểu công thức (khối lượng còn lại ÷ velocity thực tế), và một lý thuyết (luật Brooks: thêm người vào dự án đang trễ sẽ làm nó trễ hơn). Không có mấy thứ đó, bạn sẽ với lấy cách sửa theo trực giác — "cả nhóm cố hơn đi" — mà lý thuyết bảo là sẽ hỏng.</li>
</ul>
<p class="meo">💡 Ghép hai định nghĩa theo TỪ CHỈ LƯỢNG: knowledge-<strong>lean</strong> = "cần <em>ít</em> kiến thức nền"; knowledge-<strong>rich</strong> = "<em>thường</em> đòi <em>rất nhiều</em> kiến thức nền". Chữ rào đón "usually/thường" chỉ có ở định nghĩa rich.</p>
<p class="pitfall">⚠️ Knowledge-rich nói về thứ <em>NGÀNH</em> đòi hỏi, không nói về cá nhân bạn. Việc <em>BẠN</em> đã gặp dạng bài này chưa là trục <strong>NGỮ NGHĨA</strong> (slide 8–9). Hai câu hỏi khác nhau, và đề thi rất thích tráo chúng cho nhau.</p>`],

      [6, 'Well-defined Problems — clear path, clear goal, clear finish',
        `<p class="y-chinh">🎯 <strong>"Problems where all the information needed…is given or can be inferred" (Robertson, 2001, p.14)</strong>, plus three consequences: <strong>clear solution paths and goals</strong> · <strong>often use basic concepts or formulas</strong> · <strong>clear when a solution has been found</strong>.</p>
<table>
<tr><th>Diagram element (slide 3)</th><th>In a well-defined problem</th></tr>
<tr><td>Initial State</td><td>Given</td></tr>
<tr><td>Solution Path</td><td>Clear, or reachable by a standard method</td></tr>
<tr><td>Goal</td><td>Given, and <strong>recognisable when reached</strong></td></tr>
</table>
<ul>
<li><strong>The third bullet is the real test, and it is the one students skip.</strong> "Clear when a solution has been found" means there is a stopping rule. If you cannot say in advance how you would know you are done, the problem is not well-defined, no matter how tidy the wording looks.</li>
<li><strong>Note the phrase "or can be inferred".</strong> Well-defined does not require that every number be printed on the page — only that anything missing follows from what is there. A physics question that expects you to supply <em>g</em> = 9.8 is still well-defined.</li>
<li><strong>"Often use basic concepts or formulas" is a hint about method, not a definition.</strong> The word is <em>often</em>, so a problem does not stop being well-defined just because no formula applies. Watch for exam options that harden "often" into "always".</li>
<li><strong>At FPTU, the clean examples are labs and exam exercises.</strong> "Write a C function that returns the n-th Fibonacci number" — inputs given, output specified, a test tells you when you are finished. "Normalise this table to 3NF" — the rules define both the path and the endpoint.</li>
<li><strong>Well-defined problems are not always easy.</strong> A hard integral or a proof from DSA can be fully well-defined and still take hours. Definedness measures <em>clarity</em>, difficulty measures <em>effort</em>. The two are independent.</li>
</ul>
<p class="dap-an">✅ Self-check on the running case: is "the SWP391 group is two weeks behind" well-defined? <strong>No.</strong> The initial state is knowable, but the goal is not stated (ship everything? cut scope? save the mark? save the team?) and there is no stopping rule. Slide 7 gives it its proper name.</p>
<p class="meo">💡 Compress to three C's: well-defined = <strong>Clear path · Clear goal · Clear finish</strong>. If any one of the three is missing, you are on slide 7.</p>`,
        `<p class="y-chinh">🎯 <strong>"Những vấn đề mà mọi thông tin cần thiết… đều đã được cho hoặc SUY RA ĐƯỢC" (Robertson, 2001, tr.14)</strong>, kèm ba hệ quả: <strong>đường giải và đích đều rõ</strong> · <strong>thường dùng khái niệm hoặc công thức cơ bản</strong> · <strong>rõ ràng khi nào thì đã tìm ra lời giải</strong>.</p>
<table>
<tr><th>Thành phần sơ đồ (slide 3)</th><th>Trong vấn đề RÕ RÀNG</th></tr>
<tr><td>Trạng thái ban đầu</td><td>Đã cho</td></tr>
<tr><td>Đường giải</td><td>Rõ, hoặc tới được bằng một phương pháp chuẩn</td></tr>
<tr><td>Đích</td><td>Đã cho, và <strong>NHẬN RA ĐƯỢC khi chạm tới</strong></td></tr>
</table>
<ul>
<li><strong>Gạch đầu dòng thứ ba mới là phép thử thật, và nó là cái sinh viên hay bỏ qua.</strong> "Rõ khi nào đã tìm ra lời giải" nghĩa là có một LUẬT DỪNG. Nếu bạn không nói trước được làm sao biết mình đã xong, thì vấn đề đó KHÔNG rõ ràng, dù câu chữ có gọn gàng tới đâu.</li>
<li><strong>Để ý cụm "hoặc suy ra được".</strong> Rõ ràng KHÔNG đòi mọi con số phải in trên giấy — chỉ đòi cái thiếu phải SUY RA được từ cái có. Một bài vật lý mặc định bạn tự lấy <em>g</em> = 9,8 vẫn là vấn đề rõ ràng.</li>
<li><strong>"Thường dùng khái niệm hoặc công thức cơ bản" là gợi ý về PHƯƠNG PHÁP, không phải định nghĩa.</strong> Chữ là <em>thường</em>, nên một vấn đề không mất tư cách rõ ràng chỉ vì chẳng công thức nào áp được. Coi chừng phương án thi hoá cứng chữ "thường" thành "luôn luôn".</li>
<li><strong>Ở FPTU, ví dụ sạch nhất là bài lab và bài tập thi.</strong> "Viết hàm C trả về số Fibonacci thứ n" — đầu vào cho, đầu ra quy định, một bộ test báo cho bạn biết lúc nào xong. "Chuẩn hoá bảng này về 3NF" — luật định nghĩa cả đường đi lẫn điểm kết thúc.</li>
<li><strong>Vấn đề rõ ràng KHÔNG đồng nghĩa với dễ.</strong> Một tích phân khó hay một phép chứng minh trong DSA có thể rõ ràng hoàn toàn mà vẫn ngốn hàng giờ. Độ rõ ràng đo <em>SỰ MINH BẠCH</em>, độ khó đo <em>CÔNG SỨC</em>. Hai thứ độc lập.</li>
</ul>
<p class="dap-an">✅ Tự kiểm với tình huống xuyên suốt: "nhóm SWP391 trễ hai tuần" có phải vấn đề rõ ràng không? <strong>KHÔNG.</strong> Trạng thái đầu thì biết được, nhưng đích không được nêu (giao đủ mọi thứ? cắt phạm vi? cứu điểm? cứu tình đồng đội?) và không có luật dừng. Slide 7 sẽ gọi đúng tên nó.</p>
<p class="meo">💡 Nén thành ba chữ RÕ: rõ ràng = <strong>RÕ đường · RÕ đích · RÕ lúc xong</strong>. Thiếu một trong ba là bạn đang ở slide 7.</p>`],

      [7, 'Ill-Defined Problems — the kind university actually sets you',
        `<p class="y-chinh">🎯 Five bullets, and no quotation this time — the slide defines ill-defined by what it <em>lacks</em>: <strong>cannot be solved using a basic formula or concept</strong> · <strong>solution path or goal is undefined and uncertain</strong> · <strong>the solution may not be obvious and may need to be justified</strong> · e.g. <em>"Fix my computer"</em> · e.g. <em>"Explain how you would advise a local government in an Australian city to address the problem of obesity within their community"</em>.</p>
<table>
<tr><th>Well-defined (slide 6)</th><th>Ill-defined (slide 7)</th></tr>
<tr><td>Information given or inferable</td><td>Cannot be solved by a basic formula or concept</td></tr>
<tr><td>Clear path AND clear goal</td><td>Path <strong>or</strong> goal undefined and uncertain</td></tr>
<tr><td>Clear when a solution is found</td><td>Solution not obvious — and must be <strong>justified</strong></td></tr>
</table>
<ul>
<li><strong>Read the connective in bullet 2 carefully: it is "path OR goal".</strong> Only one of the two needs to be missing. That is why "Fix my computer" qualifies — the goal is vaguely clear (it works again) but the path is unknown, and "works" is never defined.</li>
<li><strong>The two examples are deliberately at opposite ends.</strong> "Fix my computer" is everyday, three words long, and under-specified; the obesity question is academic, fully-sentenced, and still under-specified. Length and formality have nothing to do with it — <em>specification</em> does.</li>
<li><strong>"May need to be justified" is the bullet that describes university assessment.</strong> In an ill-defined problem there is no answer key; a solution earns its marks through the argument attached to it. That is why analytical assignments ask for evidence and reasoning, not just a conclusion.</li>
<li><strong>The FPTU translation of "Fix my computer".</strong> A ticket that says "the app is slow". Slow where, for whom, since when, compared with what, and how fast is fast enough? Until those are answered there is no solvable problem — only a complaint. Your first job on an ill-defined problem is to <em>convert it into a well-defined one</em>.</li>
<li><strong>Doing that conversion on the running case.</strong> "The SWP391 group is two weeks behind and one member has not submitted" → define the goal (all 9 stories demoed by the review date, contribution evidenced in git), define the constraints (3 weeks left, 4 working members, no scope authority), define the stopping rule (supervisor signs the demo off). Now there is a path to look for.</li>
</ul>
<p class="dap-an">✅ Classify quickly: (a) "Sort this array ascending" → well-defined. (b) "Improve our team's code quality" → ill-defined, no goal state. (c) "Design a database for a bookshop" → ill-defined, because "good design" is not specified. (d) "Convert this ER diagram to 3NF" → well-defined, the rules decide.</p>
<p class="pitfall">⚠️ Wording trap between slides. Here bullet 3 says the solution "may need to be <strong>justified</strong>". On slides 19 and 23 the same-looking bullet says "may need to be <strong>defined</strong>". Both wordings are genuinely on the images — if an exam option quotes one, do not assume the other is a misprint.</p>`,
        `<p class="y-chinh">🎯 Năm gạch đầu dòng, lần này KHÔNG có câu trích — slide định nghĩa "chưa rõ ràng" bằng những thứ nó <em>THIẾU</em>: <strong>không giải được bằng một công thức hay khái niệm cơ bản</strong> · <strong>đường giải HOẶC đích chưa được định nghĩa và không chắc chắn</strong> · <strong>lời giải có thể không hiển nhiên và có thể phải được BIỆN MINH</strong> · ví dụ <em>"Sửa cái máy tính của tôi"</em> · ví dụ <em>"Hãy trình bày cách bạn tư vấn cho chính quyền một thành phố ở Úc để xử lý nạn béo phì trong cộng đồng của họ"</em>.</p>
<table>
<tr><th>Rõ ràng (slide 6)</th><th>Chưa rõ ràng (slide 7)</th></tr>
<tr><td>Thông tin đã cho hoặc suy ra được</td><td>Không giải được bằng công thức/khái niệm cơ bản</td></tr>
<tr><td>Rõ đường VÀ rõ đích</td><td>Đường <strong>HOẶC</strong> đích chưa định nghĩa, không chắc chắn</td></tr>
<tr><td>Rõ khi nào tìm ra lời giải</td><td>Lời giải không hiển nhiên — và phải <strong>biện minh</strong></td></tr>
</table>
<ul>
<li><strong>Đọc kỹ liên từ ở gạch thứ 2: là "đường HOẶC đích".</strong> Chỉ cần MỘT trong hai thiếu là đủ. Vì thế "Sửa cái máy tính của tôi" mới lọt vào — đích thì lờ mờ rõ (nó chạy lại được) nhưng đường thì chưa biết, mà "chạy được" thì chưa bao giờ được định nghĩa.</li>
<li><strong>Hai ví dụ được đặt ở hai cực, có chủ ý.</strong> "Sửa máy tính" là đời thường, dài ba chữ, và thiếu đặc tả; câu hỏi béo phì là học thuật, câu cú đầy đủ, và VẪN thiếu đặc tả. Độ dài và độ trang trọng chẳng liên quan gì — thứ liên quan là <em>ĐẶC TẢ</em>.</li>
<li><strong>Gạch "phải được biện minh" chính là câu mô tả cách đại học chấm bài.</strong> Ở vấn đề chưa rõ ràng không có đáp án mẫu; một lời giải kiếm điểm bằng LẬP LUẬN gắn theo nó. Đó là lý do bài tập phân tích đòi bằng chứng và lý lẽ, chứ không chỉ đòi một kết luận.</li>
<li><strong>Bản dịch FPTU của "Sửa máy tính của tôi".</strong> Một ticket ghi "app chạy chậm". Chậm ở đâu, với ai, từ bao giờ, so với cái gì, và nhanh tới mức nào thì đủ nhanh? Chưa trả lời mấy câu đó thì chưa có vấn đề giải được — mới chỉ có một lời than. Việc đầu tiên của bạn với một vấn đề chưa rõ ràng là <em>BIẾN NÓ THÀNH vấn đề rõ ràng</em>.</li>
<li><strong>Làm phép biến đổi đó trên tình huống xuyên suốt.</strong> "Nhóm SWP391 trễ hai tuần, một thành viên không nộp" → định nghĩa ĐÍCH (cả 9 story demo xong trước ngày review, đóng góp có bằng chứng trong git), định nghĩa RÀNG BUỘC (còn 3 tuần, 4 người thật sự làm, không có quyền cắt phạm vi), định nghĩa LUẬT DỪNG (giảng viên hướng dẫn ký nghiệm thu buổi demo). Bây giờ mới có một con đường để đi tìm.</li>
</ul>
<p class="dap-an">✅ Phân loại nhanh: (a) "Sắp xếp mảng này tăng dần" → rõ ràng. (b) "Cải thiện chất lượng mã của nhóm" → chưa rõ ràng, không có trạng thái đích. (c) "Thiết kế CSDL cho một hiệu sách" → chưa rõ ràng, vì "thiết kế tốt" không được đặc tả. (d) "Đưa sơ đồ ER này về 3NF" → rõ ràng, luật quyết định hết.</p>
<p class="pitfall">⚠️ Bẫy CHỮ giữa các slide. Ở đây gạch thứ 3 ghi lời giải "có thể phải được <strong>BIỆN MINH</strong> (justified)". Còn ở slide 19 và 23, gạch trông y hệt lại ghi "có thể phải được <strong>ĐỊNH NGHĨA</strong> (defined)". Cả hai cách viết đều có thật trên ảnh — nếu đề thi trích một trong hai, đừng vội cho rằng cái kia là lỗi in.</p>`],

      [8, 'Semantically Rich Problems — the solver has met this type before',
        `<p class="y-chinh">🎯 Three short bullets: <strong>solver has a lot of experience with the problem type</strong> · e.g. <strong>333 + 334 = ? → 333 + 334 = 667</strong> · <strong>relatively simple, even if you have to check a calculator</strong> (Robertson, 2001).</p>
<ul>
<li><strong>The key word is "type", not "problem".</strong> You have almost certainly never added 333 and 334 before in your life — yet the sum is easy, because you have added thousands of pairs of three-digit numbers. Experience transfers at the level of the <em>pattern</em>, which is what makes this axis worth having.</li>
<li><strong>The third bullet is doing quiet work.</strong> "Even if you have to check a calculator" tells you semantic richness is not about being able to do it in your head. Needing a tool does not make a problem semantically lean; only unfamiliarity with the <em>type</em> does.</li>
<li><strong>Semantic richness is what expertise actually feels like from the inside.</strong> The expert is not thinking faster; they are recognising a shape they have seen before and replaying a known path. That is why "have I seen anything like this?" is the highest-value first question on any assignment.</li>
<li><strong>Turn it into study technique.</strong> Doing past papers works precisely because it converts a semantically lean subject into a semantically rich one — you stop meeting new <em>types</em> in the exam room. For PRF192 or MAD101 this is the single cheapest improvement available: solve by type, not by individual question.</li>
<li><strong>SWP391 case.</strong> For a fourth-year student who has run three group projects, "a member is not delivering" is semantically rich — they immediately reach for a known path (talk privately, re-scope, escalate with evidence). For a first-year it is semantically lean, and the panic is not a character flaw, it is missing pattern experience.</li>
</ul>
<p class="meo">💡 Anchor the pair to the two numbers on the slides: <strong>333 + 334 = rich</strong> (an adult), <strong>3 + 4 = lean</strong> (a four-year-old). The bigger numbers being the <em>easier</em> case is a deliberate joke by the deck — and it makes it impossible to forget which is which.</p>
<p class="pitfall">⚠️ Semantically rich ≠ knowledge-rich. <em>Semantically</em> rich is about <strong>your experience of this problem type</strong>; <em>knowledge</em>-rich is about <strong>how much field knowledge the problem demands</strong>. The same adjective on two different axes is the most-tested confusion in section 2.1.</p>`,
        `<p class="y-chinh">🎯 Ba gạch ngắn: <strong>người giải đã có NHIỀU kinh nghiệm với DẠNG vấn đề này</strong> · ví dụ <strong>333 + 334 = ? → 333 + 334 = 667</strong> · <strong>tương đối đơn giản, kể cả khi bạn phải bấm máy tính để kiểm lại</strong> (Robertson, 2001).</p>
<ul>
<li><strong>Chữ then chốt là "DẠNG", không phải "vấn đề".</strong> Gần như chắc chắn cả đời bạn chưa từng cộng 333 với 334 — thế mà phép cộng ấy vẫn dễ, vì bạn đã cộng hàng nghìn cặp số ba chữ số. Kinh nghiệm chuyển giao ở tầng <em>KHUÔN MẪU</em>, và đó là điều làm trục này đáng có.</li>
<li><strong>Gạch thứ ba đang âm thầm làm việc.</strong> "Kể cả khi phải bấm máy tính" cho biết độ giàu ngữ nghĩa KHÔNG phải chuyện làm nhẩm được hay không. Cần tới công cụ không biến một vấn đề thành semantically lean; chỉ có sự LẠ DẠNG mới làm được điều đó.</li>
<li><strong>Độ giàu ngữ nghĩa chính là cảm giác "thành thạo" nhìn từ bên trong.</strong> Chuyên gia không nghĩ nhanh hơn; họ NHẬN RA một hình dạng đã gặp và tua lại một con đường đã biết. Vì thế "mình đã gặp cái gì giống thế này chưa?" là câu hỏi đầu tiên có giá trị cao nhất với mọi bài tập.</li>
<li><strong>Biến nó thành kỹ thuật ôn thi.</strong> Làm đề cũ có tác dụng chính vì nó biến một môn semantically lean thành semantically rich — bạn thôi gặp <em>DẠNG</em> mới ngay trong phòng thi. Với PRF192 hay MAD101, đây là cách cải thiện rẻ nhất: luyện theo DẠNG, đừng luyện theo từng câu rời.</li>
<li><strong>Tình huống SWP391.</strong> Với sinh viên năm tư đã qua ba đồ án nhóm, "một thành viên không giao việc" là semantically rich — họ với ngay một con đường đã biết (nói riêng, cắt lại phạm vi, báo lên kèm bằng chứng). Với sinh viên năm nhất thì nó semantically lean, và sự hoảng loạn không phải khuyết điểm tính cách, mà là thiếu kinh nghiệm khuôn mẫu.</li>
</ul>
<p class="meo">💡 Neo cặp này vào đúng hai con số của slide: <strong>333 + 334 = rich</strong> (người lớn), <strong>3 + 4 = lean</strong> (đứa bé bốn tuổi). Số TO LẠI LÀ CA DỄ — đó là trò đùa có chủ ý của deck, và nó làm bạn không thể quên cái nào là cái nào.</p>
<p class="pitfall">⚠️ Semantically rich ≠ knowledge-rich. <em>Semantically</em> rich nói về <strong>kinh nghiệm CỦA BẠN với dạng bài này</strong>; <em>knowledge</em>-rich nói về <strong>lượng kiến thức ngành mà BÀI ĐÓ đòi</strong>. Cùng một tính từ trên hai trục khác nhau — đây là chỗ lẫn bị hỏi nhiều nhất của mục 2.1.</p>`],

      [9, 'Semantically Lean Problems — entirely solver-dependent',
        `<p class="y-chinh">🎯 The mirror: <strong>solver has not encountered the problem type before</strong>; <strong>a four year old might struggle with 3 + 4</strong> — they know what "3" and "4" are, they <em>do not know what "+" means</em>; and the line that matters most: <strong>whether a problem is semantically lean or rich is entirely solver-dependent</strong> (Robertson, 2001).</p>
<ul>
<li><strong>"Entirely solver-dependent" is the examinable sentence on this slide.</strong> The same problem is lean for one person and rich for another at the same moment. No other axis in section 2.1 has this property — well/ill-defined belongs to the problem, knowledge-lean/rich belongs to the field.</li>
<li><strong>The child example is chosen very precisely.</strong> The child has the <em>objects</em> (3, 4) but not the <em>operation</em> (+). That is the general shape of a semantically lean problem: you recognise every term and still cannot see what you are being asked to do with them.</li>
<li><strong>You have felt this exact thing.</strong> "Critically evaluate the trade-offs in the proposed architecture" — every word is familiar, and the task is still opaque, because you have not met the <em>type</em>. That is not stupidity; it is the operation being unfamiliar, exactly like the "+".</li>
<li><strong>What to do about it, since the cure is known.</strong> Find one worked example of the <em>type</em> and study the moves rather than the answer. One worked past-paper question moves you from lean to rich for that entire question family — which is why sample solutions are worth more than extra readings when you are stuck.</li>
<li><strong>Where the axis bites at FPTU.</strong> Transfer subjects and new formats: your first SWT301 test-case design, your first SWR302 SRS, your first PE exam in a new IDE. The content is often easy; the <em>format</em> is the lean part. Sit one mock in the real format and most of the difficulty evaporates.</li>
</ul>
<p class="dap-an">✅ Self-check: a student fails a MAD101 proof-by-induction question while solving harder algebra fine. Which axis explains it? <strong>Semantic</strong> — induction is an unfamiliar problem <em>type</em> for them, so the problem is semantically lean, even though the algebra knowledge is present.</p>
<p class="meo">💡 One sentence for all three axes: <strong>well/ill-defined = about the PROBLEM · semantically lean/rich = about the SOLVER · knowledge-lean/rich = about the FIELD.</strong> If you can say which of PROBLEM / SOLVER / FIELD a question is testing, you can answer it.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương: <strong>người giải CHƯA từng gặp dạng vấn đề này</strong>; <strong>một đứa bé bốn tuổi có thể vật lộn với 3 + 4</strong> — nó biết "3" và "4" là gì, nhưng <em>không biết dấu "+" nghĩa là gì</em>; và câu quan trọng nhất: <strong>một vấn đề là semantically lean hay rich HOÀN TOÀN phụ thuộc vào NGƯỜI GIẢI</strong> (Robertson, 2001).</p>
<ul>
<li><strong>"Hoàn toàn phụ thuộc người giải" là câu dễ ra đề nhất của slide này.</strong> Cùng một vấn đề, cùng một thời điểm, lean với người này và rich với người kia. Không trục nào khác trong mục 2.1 có tính chất đó — rõ/chưa rõ thuộc về VẤN ĐỀ, nhẹ/nặng kiến thức thuộc về NGÀNH.</li>
<li><strong>Ví dụ đứa bé được chọn rất chính xác.</strong> Đứa bé có <em>ĐỐI TƯỢNG</em> (3, 4) nhưng không có <em>PHÉP TOÁN</em> (+). Đó chính là hình dạng chung của vấn đề semantically lean: bạn nhận ra từng thuật ngữ mà vẫn không thấy người ta đang bảo mình LÀM GÌ với chúng.</li>
<li><strong>Bạn đã nếm đúng cảm giác này.</strong> "Hãy đánh giá phản biện các đánh đổi trong kiến trúc được đề xuất" — chữ nào cũng quen, mà nhiệm vụ vẫn mờ tịt, vì bạn chưa gặp <em>DẠNG</em> đó. Đấy không phải dốt; đấy là phép toán còn lạ, y hệt dấu "+" kia.</li>
<li><strong>Phải làm gì, vì thuốc chữa đã biết.</strong> Tìm MỘT ví dụ đã giải mẫu của đúng <em>DẠNG</em> đó, rồi học các NƯỚC ĐI chứ đừng học đáp án. Một câu đề cũ có lời giải mẫu đưa bạn từ lean sang rich cho cả họ câu hỏi đó — vì thế lúc đang bí, bài giải mẫu đáng giá hơn đọc thêm tài liệu.</li>
<li><strong>Trục này cắn ở đâu tại FPTU.</strong> Ở môn chuyển tiếp và ở định dạng mới: bài thiết kế test case SWT301 đầu tiên, bản SRS SWR302 đầu tiên, kỳ thi PE đầu tiên trên một IDE lạ. Nội dung thường dễ; phần "lean" nằm ở <em>ĐỊNH DẠNG</em>. Làm một buổi thi thử đúng định dạng thật là phần lớn cái khó bay mất.</li>
</ul>
<p class="dap-an">✅ Tự kiểm: một sinh viên trượt câu quy nạp toán học của MAD101 trong khi vẫn giải ngon các bài đại số khó hơn. Trục nào giải thích? <strong>NGỮ NGHĨA</strong> — quy nạp là một <em>DẠNG</em> bài lạ với bạn ấy, nên bài đó semantically lean, dù kiến thức đại số thì có đủ.</p>
<p class="meo">💡 Một câu cho cả ba trục: <strong>rõ/chưa rõ = nói về VẤN ĐỀ · lean/rich ngữ nghĩa = nói về NGƯỜI GIẢI · lean/rich kiến thức = nói về NGÀNH.</strong> Nói được câu hỏi đang kiểm VẤN ĐỀ / NGƯỜI GIẢI / NGÀNH là bạn trả lời được nó.</p>`],
      [10, 'Insight Problems — the seventh type, a subset of the other six',
        `<p class="y-chinh">🎯 Four bullets: <strong>most difficult to define</strong> · <strong>a subset of any of the previous six types</strong> · <strong>appear to have a particular solution path, but actually require a new approach</strong> · <strong>the answer "suddenly becomes obvious"</strong> (Adapted from: Dow &amp; Mayer, 2004; Robertson, 2001).</p>
<table>
<tr><th>Ordinary problem</th><th>Insight problem</th></tr>
<tr><td>You do not know the path</td><td>You think you know the path — and it is <strong>wrong</strong></td></tr>
<tr><td>Progress feels gradual</td><td>Progress feels like nothing, then everything at once</td></tr>
<tr><td>Solved by working harder</td><td>Solved by <strong>re-framing</strong>, then working normally</td></tr>
</table>
<ul>
<li><strong>Bullet 2 is the one most likely to appear in the exam, and it is easy to misread.</strong> Insight problems are <em>not</em> a seventh category alongside the other six — they are a <strong>subset of any of them</strong>. So the arithmetic is: 3 pairs = 6 types, plus insight as a cross-cutting seventh label = <strong>7 names to remember, 6 categories</strong>.</li>
<li><strong>The mechanism is a wrong assumption you did not know you made.</strong> "Appear to have a particular solution path" means your brain has already committed to a frame. The classic nine-dot puzzle is insoluble only because people silently assume the lines must stay inside the square — nobody said that.</li>
<li><strong>Why "suddenly becomes obvious" is in scare quotes on the slide.</strong> The suddenness is real as an experience but misleading as an explanation: the preparation was gradual and invisible. That is also why stepping away from a stuck problem genuinely helps — it lets the wrong frame decay.</li>
<li><strong>The practical move when you suspect an insight problem.</strong> Stop generating attempts and start listing <em>assumptions</em>: what am I treating as fixed that was never stated? Write them down and negate each one in turn. That is a technique, not luck.</li>
<li><strong>SWP391 case.</strong> The group frames it as "we must make the missing member work". Every attempt fails. The re-frame: the goal is a working demo and a defensible contribution record, not a reformed teammate — so redistribute the two smallest stories, cut one nice-to-have with the supervisor's agreement, and document the gap with git evidence. The path was blocked only by the assumed goal.</li>
</ul>
<p class="meo">💡 Remember the number and the relationship together: <strong>6 types + insight (a SUBSET of the six) = 7 labels</strong>. An option saying "insight problems are a seventh, separate category" is wrong; an option saying "insight problems can be knowledge-lean or knowledge-rich" is right.</p>
<p class="pitfall">⚠️ Do not equate insight with creativity or with being clever. The slide defines it structurally — an apparent path that turns out to need a new approach. A very ordinary person hits insight problems daily; a very clever one can be trapped by a wrong frame for hours.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch: <strong>khó định nghĩa nhất</strong> · <strong>là TẬP CON của bất kỳ loại nào trong sáu loại trước</strong> · <strong>trông như có sẵn một con đường giải cụ thể, nhưng thật ra đòi một cách tiếp cận MỚI</strong> · <strong>đáp án "bỗng nhiên trở nên hiển nhiên"</strong> (Phỏng theo: Dow &amp; Mayer, 2004; Robertson, 2001).</p>
<table>
<tr><th>Vấn đề thường</th><th>Vấn đề đốn ngộ (insight)</th></tr>
<tr><td>Bạn KHÔNG biết đường đi</td><td>Bạn TƯỞNG mình biết đường — và nó <strong>SAI</strong></td></tr>
<tr><td>Tiến triển cảm thấy từ từ</td><td>Cảm thấy không nhúc nhích, rồi xong hết cùng lúc</td></tr>
<tr><td>Giải được bằng cách cố hơn</td><td>Giải được bằng cách <strong>ĐẶT LẠI KHUNG</strong>, rồi làm bình thường</td></tr>
</table>
<ul>
<li><strong>Gạch số 2 là gạch dễ ra đề nhất, và cũng dễ đọc nhầm nhất.</strong> Vấn đề insight <em>KHÔNG</em> phải loại thứ bảy đứng ngang hàng sáu loại kia — nó là <strong>TẬP CON của bất kỳ loại nào</strong> trong sáu loại. Nên phép tính là: 3 cặp = 6 loại, cộng insight như một nhãn cắt ngang = <strong>7 cái tên phải nhớ, 6 phạm trù</strong>.</li>
<li><strong>Cơ chế của nó là một GIẢ ĐỊNH SAI mà bạn không biết mình đang có.</strong> "Trông như có một con đường cụ thể" nghĩa là não bạn đã trót cam kết vào một cái khung. Bài chín chấm kinh điển chỉ bất khả vì người ta ngầm giả định các nét vẽ phải nằm trong hình vuông — chẳng ai nói thế cả.</li>
<li><strong>Vì sao slide đặt "bỗng nhiên hiển nhiên" trong ngoặc kép.</strong> Sự đột ngột là thật với tư cách TRẢI NGHIỆM nhưng gây hiểu lầm với tư cách GIẢI THÍCH: phần chuẩn bị đã diễn ra từ từ và vô hình. Đó cũng là lý do rời khỏi bài đang bí thật sự có tác dụng — nó để cái khung sai tự rã ra.</li>
<li><strong>Nước đi thực dụng khi nghi ngờ gặp bài insight.</strong> Ngừng đẻ thêm phương án, chuyển sang liệt kê <em>GIẢ ĐỊNH</em>: mình đang coi cái gì là cố định mà đề chưa hề nói? Viết chúng ra rồi phủ định từng cái một. Đó là kỹ thuật, không phải may rủi.</li>
<li><strong>Tình huống SWP391.</strong> Nhóm đóng khung bài toán thành "phải bắt bạn kia làm việc". Mọi cố gắng đều thất bại. Đặt lại khung: đích là MỘT BUỔI DEMO CHẠY ĐƯỢC và MỘT HỒ SƠ ĐÓNG GÓP BẢO VỆ ĐƯỢC, chứ không phải một đồng đội đã cải tà quy chính — vậy thì chia lại hai story nhỏ nhất, cắt một mục "có thì tốt" sau khi xin ý kiến giảng viên, và ghi nhận phần khuyết bằng bằng chứng git. Con đường bị chặn chỉ bởi cái đích tự giả định.</li>
</ul>
<p class="meo">💡 Nhớ con số CÙNG với quan hệ: <strong>6 loại + insight (là TẬP CON của sáu loại) = 7 nhãn</strong>. Phương án nói "insight là phạm trù thứ bảy tách riêng" là SAI; phương án nói "một bài insight có thể vừa là knowledge-lean vừa là knowledge-rich" là ĐÚNG.</p>
<p class="pitfall">⚠️ Đừng đánh đồng insight với sáng tạo hay với thông minh. Slide định nghĩa nó bằng CẤU TRÚC — một con đường tưởng có sẵn hoá ra cần cách tiếp cận mới. Người rất bình thường vẫn gặp bài insight mỗi ngày; người rất thông minh vẫn bị một cái khung sai giam hàng giờ.</p>`],

      [11, '2.1d Examples of different problems in different fields — objectives (four repeated + one new)',
        `<p class="y-chinh">🎯 A second objectives slide. Four of its five bullets are <strong>copied verbatim from slide 2 (2.1a)</strong>; the new one is the fifth: <strong>describe the kinds of problems most common at university</strong>. Note also that sections <strong>2.1b and 2.1c do not appear at all</strong> in this review deck — it jumps from 2.1a straight to 2.1d.</p>
<table>
<tr><th>Bullet</th><th>On slide 2?</th></tr>
<tr><td>define what a "problem" is</td><td>Yes</td></tr>
<tr><td>ill- vs well-defined</td><td>Yes</td></tr>
<tr><td>semantically lean vs rich</td><td>Yes</td></tr>
<tr><td>knowledge-lean vs rich</td><td>Yes</td></tr>
<tr><td><strong>describe the kinds of problems most common at university</strong></td><td><strong>NO — new here</strong></td></tr>
</table>
<ul>
<li><strong>Say plainly what is on the image and what is not.</strong> This slide gives the objectives only; it does not itself list the field examples its title promises. Anything beyond these five lines has to come from the Coursera module, not from this deck.</li>
<li><strong>The fifth bullet is answered later, not here — and the answer is worth pre-loading.</strong> Slide 19 will state that analytical problems (the dominant university kind) are <strong>ill-defined in some way</strong>, cannot be solved by a basic formula, and have an undefined path or goal. Combine that with slide 5 and the profile of the typical university problem is: <em>ill-defined + knowledge-rich</em>, and semantically lean while you are still new to the field.</li>
<li><strong>Why a repeated objectives slide is a signal, not padding.</strong> In a review deck, repetition marks weight. These four distinctions get stated twice within ten slides, which is the clearest possible hint about what the question writer considered core.</li>
<li><strong>"In different fields" is the part you supply yourself.</strong> Law: apply a rule to facts with a contested boundary. Medicine: diagnose from incomplete symptoms. Engineering: satisfy conflicting constraints with no optimum. Software: build the right thing from a stakeholder's vague wish. All four are ill-defined and knowledge-rich — which is exactly the point the title is making.</li>
</ul>
<p class="meo">💡 If an exam item asks "what kinds of problems are most common at university?", answer with the pair the deck actually supports: <strong>ill-defined</strong> and <strong>knowledge-rich</strong> (and specifically <em>analytical</em>, per slide 19).</p>
<p class="pitfall">⚠️ Do not try to remember a distinct "2.1d list" — there isn't one on this image. The repetition of 2.1a's bullets is genuine and deliberate in the original deck; treat the slide as a checkpoint, not as new material.</p>`,
        `<p class="y-chinh">🎯 Một slide mục tiêu nữa. Bốn trong năm gạch của nó <strong>được chép NGUYÊN VĂN từ slide 2 (2.1a)</strong>; cái mới là gạch thứ năm: <strong>mô tả những loại vấn đề phổ biến nhất ở đại học</strong>. Cũng lưu ý là mục <strong>2.1b và 2.1c hoàn toàn KHÔNG xuất hiện</strong> trong bộ review này — nó nhảy thẳng từ 2.1a sang 2.1d.</p>
<table>
<tr><th>Gạch đầu dòng</th><th>Có ở slide 2 không?</th></tr>
<tr><td>định nghĩa "vấn đề" là gì</td><td>Có</td></tr>
<tr><td>ill- so với well-defined</td><td>Có</td></tr>
<tr><td>semantically lean so với rich</td><td>Có</td></tr>
<tr><td>knowledge-lean so với rich</td><td>Có</td></tr>
<tr><td><strong>mô tả các loại vấn đề phổ biến nhất ở đại học</strong></td><td><strong>KHÔNG — mới ở đây</strong></td></tr>
</table>
<ul>
<li><strong>Nói thẳng cái gì có trên ảnh và cái gì không.</strong> Slide này chỉ cho mục tiêu; bản thân nó KHÔNG liệt kê các ví dụ theo ngành như tiêu đề hứa. Mọi thứ ngoài năm dòng này phải lấy từ module trên Coursera, không lấy từ deck.</li>
<li><strong>Gạch thứ năm được trả lời ở SAU, không ở đây — và đáng nạp trước câu trả lời.</strong> Slide 19 sẽ nói rằng vấn đề phân tích (loại thống trị ở đại học) là <strong>ill-defined theo một kiểu nào đó</strong>, không giải được bằng công thức cơ bản, và có đường đi hoặc đích chưa xác định. Ghép với slide 5 thì chân dung vấn đề đại học điển hình là: <em>chưa rõ ràng + nặng kiến thức nền</em>, và còn semantically lean chừng nào bạn còn mới với ngành.</li>
<li><strong>Vì sao một slide mục tiêu bị lặp là TÍN HIỆU, không phải độn trang.</strong> Trong một bộ ôn tập, lặp lại tức là đánh dấu TRỌNG SỐ. Bốn phân biệt này được nêu HAI lần trong vòng mười slide — đó là gợi ý rõ nhất về thứ người ra đề coi là cốt lõi.</li>
<li><strong>Phần "ở các ngành khác nhau" là phần bạn tự bổ sung.</strong> Luật: áp một quy tắc vào sự kiện có ranh giới còn tranh cãi. Y: chẩn đoán từ triệu chứng không đầy đủ. Kỹ thuật: thoả mãn các ràng buộc xung đột mà không có tối ưu. Phần mềm: dựng đúng thứ cần dựng từ một mong muốn mơ hồ của khách hàng. Cả bốn đều chưa rõ ràng và nặng kiến thức — đúng điều tiêu đề muốn nói.</li>
</ul>
<p class="meo">💡 Nếu đề hỏi "loại vấn đề nào phổ biến nhất ở đại học?", hãy trả lời bằng đúng cặp mà deck đỡ được: <strong>ill-defined (chưa rõ ràng)</strong> và <strong>knowledge-rich (nặng kiến thức)</strong> — cụ thể là <em>vấn đề PHÂN TÍCH</em>, theo slide 19.</p>
<p class="pitfall">⚠️ Đừng cố nhớ một "danh sách 2.1d" riêng — trên ảnh không có. Việc lặp lại các gạch của 2.1a là có thật và có chủ ý trong deck gốc; hãy coi slide này là một chốt kiểm, không phải tài liệu mới.</p>`],

      [12, '2.2a Descriptive Tasks and Problems — three objectives in a fixed shape',
        `<p class="y-chinh">🎯 The objectives for section 2.2a, in a three-part shape the deck now reuses for every task family: <strong>recognise a simple problem or descriptive problem or task</strong> · <strong>recognise the language associated with it</strong> · <strong>describe the type of response required</strong>.</p>
<table>
<tr><th>Objective</th><th>The question you must be able to answer</th></tr>
<tr><td>Recognise the task/problem</td><td>What <em>kind</em> of thing is this assessment?</td></tr>
<tr><td>Recognise the <strong>language</strong></td><td>Which verb is in the instruction?</td></tr>
<tr><td>Describe the <strong>response</strong> required</td><td>What shape must my answer have?</td></tr>
</table>
<ul>
<li><strong>Memorise the shape, because slides 15 and 18 repeat it word-for-word for analytical work.</strong> Recognise the thing → recognise the language → describe the response. Once you see the template, the whole of sections 2.2 and 2.3 collapses into one idea: <em>the verb in the instruction tells you what sort of answer earns marks</em>.</li>
<li><strong>Note the three-way naming in the first bullet: "a simple problem or descriptive problem or task".</strong> The deck treats <em>simple problem</em> and <em>descriptive problem</em> as the same thing (slide 14 confirms it by writing "Descriptive (simple) problems"), and keeps <em>task</em> separate. So there are two ideas here, not three.</li>
<li><strong>"The language associated with" is the phrase to watch for in the exam.</strong> It means the instruction verbs — Define, Outline, Explain… on slide 13. Exam items typically show you a verb and ask what kind of response it calls for; that is this objective, tested directly.</li>
<li><strong>At FPTU this is worth real marks.</strong> Students routinely lose marks by answering the wrong verb: writing three pages of critique where the question said "Outline", or listing definitions where it said "Evaluate". Reading the verb first, before the topic, costs five seconds and protects the whole answer.</li>
</ul>
<p class="meo">💡 Three objectives, three families, one template. Expect to see "recognise the language associated with X" three times across slides 12, 15 and 18 — if you remember the template you can reconstruct any of them from the section title alone.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu của mục 2.2a, theo một khuôn BA PHẦN mà từ đây deck dùng lại cho mọi họ nhiệm vụ: <strong>nhận ra một vấn đề đơn giản / vấn đề mô tả / nhiệm vụ mô tả</strong> · <strong>nhận ra NGÔN NGỮ gắn với nó</strong> · <strong>mô tả KIỂU CÂU TRẢ LỜI mà nó đòi</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Câu hỏi bạn phải trả lời được</th></tr>
<tr><td>Nhận ra nhiệm vụ/vấn đề</td><td>Bài kiểm tra này thuộc <em>LOẠI</em> gì?</td></tr>
<tr><td>Nhận ra <strong>NGÔN NGỮ</strong></td><td>Trong đề đang dùng ĐỘNG TỪ nào?</td></tr>
<tr><td>Mô tả <strong>CÂU TRẢ LỜI</strong> được đòi</td><td>Bài làm của tôi phải có HÌNH DẠNG gì?</td></tr>
</table>
<ul>
<li><strong>Thuộc cái khuôn này, vì slide 15 và 18 chép lại y nguyên từng chữ cho phần phân tích.</strong> Nhận ra thứ đó → nhận ra ngôn ngữ → mô tả câu trả lời. Thấy được cái khuôn rồi thì cả mục 2.2 lẫn 2.3 co lại thành một ý duy nhất: <em>động từ trong đề nói cho bạn biết kiểu bài làm nào mới ăn điểm</em>.</li>
<li><strong>Để ý cách gọi ba tên ở gạch đầu: "simple problem or descriptive problem or task".</strong> Deck coi <em>vấn đề đơn giản</em> và <em>vấn đề mô tả</em> là MỘT (slide 14 xác nhận bằng cách viết "Descriptive (simple) problems"), và tách riêng <em>nhiệm vụ (task)</em>. Vậy ở đây có HAI ý, không phải ba.</li>
<li><strong>Cụm "ngôn ngữ gắn với" là cụm cần canh trong đề thi.</strong> Nó chỉ các ĐỘNG TỪ ra lệnh — Define, Outline, Explain… ở slide 13. Câu hỏi thi thường đưa cho bạn một động từ rồi hỏi nó đòi kiểu bài làm nào; đó chính là mục tiêu này, được kiểm trực tiếp.</li>
<li><strong>Ở FPTU điều này quy ra điểm thật.</strong> Sinh viên mất điểm đều đặn vì trả lời SAI ĐỘNG TỪ: viết ba trang phản biện trong khi đề ghi "Outline", hoặc liệt kê định nghĩa trong khi đề ghi "Evaluate". Đọc động từ TRƯỚC, trước cả chủ đề, tốn năm giây và cứu cả bài.</li>
</ul>
<p class="meo">💡 Ba mục tiêu, ba họ nhiệm vụ, một khuôn. Bạn sẽ gặp câu "nhận ra ngôn ngữ gắn với X" ba lần ở slide 12, 15 và 18 — nhớ cái khuôn là dựng lại được bất kỳ cái nào chỉ từ tiêu đề mục.</p>`],

      [13, 'Descriptive tasks — facts, figures or knowledge, and SIX instruction words',
        `<p class="y-chinh">🎯 Descriptive tasks are about <strong>facts, figures or knowledge</strong>, and they <strong>use words such as</strong> — here is the list to memorise, exactly six of them: <strong>Define · Outline · Explain · State · Summarise · Illustrate</strong> (Brick, 2014).</p>
<table>
<tr><th>Verb</th><th>What the marker expects</th><th>FPTU example</th></tr>
<tr><td><strong>Define</strong></td><td>A precise meaning, usually one or two sentences</td><td>"Define regression testing" (SWT301)</td></tr>
<tr><td><strong>Outline</strong></td><td>The main points, briefly, in order — no detail</td><td>"Outline the phases of the SDLC"</td></tr>
<tr><td><strong>Explain</strong></td><td>How or why something works, made clear</td><td>"Explain how an index speeds up a query"</td></tr>
<tr><td><strong>State</strong></td><td>Say it plainly, no elaboration at all</td><td>"State the three normal forms"</td></tr>
<tr><td><strong>Summarise</strong></td><td>Condense a larger body to its essentials</td><td>"Summarise the SRS in one page"</td></tr>
<tr><td><strong>Illustrate</strong></td><td>Make it concrete with an example or a diagram</td><td>"Illustrate coupling with a code sample"</td></tr>
</table>
<ul>
<li><strong>Count them: six.</strong> This is exactly the kind of list a multiple-choice paper counts on, and it is the list most easily contaminated — the neighbouring analytical list on slide 16 has eight, and one of them (<em>Describe</em>) looks like it belongs here and does not.</li>
<li><strong>The common thread is that none of them asks for a judgement.</strong> All six ask you to <em>reproduce or clarify</em> knowledge that already exists. Nowhere do they ask whether something is good, better, or justified — that is the entire difference from slide 16.</li>
<li><strong>"Facts, figures or knowledge" is the category phrase.</strong> Learn it as a unit; slide 14 reuses it verbatim for both descriptive tasks (<em>display</em> facts, figures or knowledge) and descriptive problems (<em>use</em> facts, figures or knowledge), and the verb difference between display and use is the whole of slide 14.</li>
<li><strong>Practical value at FPTU: budget your words by verb.</strong> "State" and "Define" deserve one or two sentences; "Explain" and "Illustrate" deserve a paragraph with a mechanism or an example. Writing a page for a "State" question wastes exam minutes you will need elsewhere and earns nothing extra.</li>
</ul>
<p class="dap-an">✅ Which of these is <em>not</em> on the descriptive list? Define · Outline · <strong>Describe</strong> · State · Summarise · Illustrate. Answer: <strong>Describe</strong> — the deck files it under <em>analytical</em> tasks on slide 16, alongside Compare and Evaluate.</p>
<p class="meo">💡 Mnemonic for the six, in the slide's own order: <strong>D-O-E-S-S-I</strong> — Define, Outline, Explain, State, Summarise, Illustrate. "DOES SI" — a descriptive task just <em>does</em>, it does not judge.</p>`,
        `<p class="y-chinh">🎯 Nhiệm vụ MÔ TẢ xoay quanh <strong>dữ kiện, số liệu hoặc kiến thức</strong>, và chúng <strong>dùng những chữ như</strong> — đây là danh sách phải thuộc, đúng SÁU chữ: <strong>Define · Outline · Explain · State · Summarise · Illustrate</strong> (Brick, 2014).</p>
<table>
<tr><th>Động từ</th><th>Người chấm mong gì</th><th>Ví dụ ở FPTU</th></tr>
<tr><td><strong>Define</strong> — Định nghĩa</td><td>Một nghĩa chính xác, thường 1–2 câu</td><td>"Define regression testing" (SWT301)</td></tr>
<tr><td><strong>Outline</strong> — Phác ý chính</td><td>Các ý chính, NGẮN, có thứ tự — không đi vào chi tiết</td><td>"Outline các pha của SDLC"</td></tr>
<tr><td><strong>Explain</strong> — Giải thích</td><td>Nó hoạt động RA SAO hoặc VÌ SAO, nói cho sáng</td><td>"Explain vì sao index làm truy vấn nhanh hơn"</td></tr>
<tr><td><strong>State</strong> — Nêu</td><td>Nói trần ra, không bình luận gì thêm</td><td>"State ba dạng chuẩn hoá"</td></tr>
<tr><td><strong>Summarise</strong> — Tóm tắt</td><td>Nén một khối lớn về phần cốt yếu</td><td>"Summarise bản SRS trong một trang"</td></tr>
<tr><td><strong>Illustrate</strong> — Minh hoạ</td><td>Làm cho cụ thể bằng ví dụ hoặc sơ đồ</td><td>"Illustrate coupling bằng một đoạn mã"</td></tr>
</table>
<ul>
<li><strong>Đếm đi: SÁU.</strong> Đây đúng là loại danh sách mà đề trắc nghiệm trông cậy vào, và cũng là danh sách dễ bị nhiễm nhất — danh sách phân tích nằm ngay cạnh ở slide 16 có TÁM chữ, và một trong số đó (<em>Describe</em>) trông như thuộc về đây mà thật ra không phải.</li>
<li><strong>Sợi chỉ chung: KHÔNG chữ nào đòi bạn PHÁN XÉT.</strong> Cả sáu chỉ bảo bạn <em>tái hiện hoặc làm sáng tỏ</em> kiến thức đã có sẵn. Không chỗ nào hỏi cái gì tốt hơn, hay hơn, hay có chính đáng không — đó chính là toàn bộ khác biệt với slide 16.</li>
<li><strong>"Dữ kiện, số liệu hoặc kiến thức" là CỤM PHÂN LOẠI.</strong> Thuộc nó thành một khối; slide 14 dùng lại y nguyên cụm này cho cả nhiệm vụ mô tả (<em>TRƯNG RA</em> dữ kiện, số liệu, kiến thức) lẫn vấn đề mô tả (<em>DÙNG</em> dữ kiện, số liệu, kiến thức), và khác biệt giữa "trưng ra" với "dùng" chính là toàn bộ slide 14.</li>
<li><strong>Giá trị thực dụng ở FPTU: phân bổ chữ theo ĐỘNG TỪ.</strong> "State" và "Define" xứng đáng 1–2 câu; "Explain" và "Illustrate" xứng đáng một đoạn có cơ chế hoặc ví dụ. Viết cả trang cho câu "State" là phí phút thi mà bạn sẽ cần ở chỗ khác, và không được thêm điểm nào.</li>
</ul>
<p class="dap-an">✅ Chữ nào KHÔNG nằm trong danh sách mô tả? Define · Outline · <strong>Describe</strong> · State · Summarise · Illustrate. Đáp án: <strong>Describe</strong> — deck xếp nó vào nhiệm vụ <em>PHÂN TÍCH</em> ở slide 16, đứng cạnh Compare và Evaluate.</p>
<p class="meo">💡 Mẹo nhớ sáu chữ theo đúng thứ tự slide: <strong>D-O-E-S-S-I</strong> — Define, Outline, Explain, State, Summarise, Illustrate. "DOES SI" — nhiệm vụ mô tả chỉ <em>LÀM</em> (does), nó không phán xét.</p>`],

      [14, 'Descriptive tasks vs Descriptive (simple) problems — DISPLAY versus USE',
        `<p class="y-chinh">🎯 Two headings on one slide, and the whole distinction is one verb. <strong>Descriptive tasks: display facts, figures or knowledge.</strong> <strong>Descriptive (simple) problems: use facts, figures or knowledge — confirm ability to apply "basic concepts" and "straightforward tools" in a simple way</strong> (Brick, 2014).</p>
<table>
<tr><th></th><th>Descriptive <strong>task</strong></th><th>Descriptive (simple) <strong>problem</strong></th></tr>
<tr><td>The verb</td><td><strong>DISPLAY</strong> facts, figures or knowledge</td><td><strong>USE</strong> facts, figures or knowledge</td></tr>
<tr><td>What is being checked</td><td>That you <em>know</em> it</td><td>That you can <em>apply</em> it</td></tr>
<tr><td>Tools involved</td><td>None — it is recall and clarification</td><td>"Basic concepts" and "straightforward tools"</td></tr>
<tr><td>SWT301 example</td><td>"Define boundary value analysis"</td><td>"Given this input range, derive the boundary test cases"</td></tr>
</table>
<ul>
<li><strong>Display versus use — that is the whole exam answer.</strong> A task asks you to show that the knowledge is in your head; a simple problem asks you to put that knowledge to work on a specific instance. Both stay at the "basic" level; neither asks for judgement.</li>
<li><strong>The word "confirm" tells you the purpose of these items.</strong> Simple problems exist to <em>confirm ability</em> — they are competence checks, which is why they are often worth few marks and are marked almost mechanically. Do them fast and correctly; do not decorate them.</li>
<li><strong>Two phrases are in quotation marks on the slide, and that is deliberate.</strong> "Basic concepts" and "straightforward tools" are quoted from Brick — meaning the tools are ones you have already been given, not ones you must go and find. The moment a problem needs a tool you must choose or justify, you have left 2.2 and entered the analytical section.</li>
<li><strong>Applying it at FPTU.</strong> "Define 3NF" = descriptive task. "Normalise this table to 3NF" = descriptive (simple) problem — you use the rule on a given instance. "Argue whether normalising this table to 3NF is appropriate for our workload" = neither; that is analytical, and slide 19 will define it.</li>
<li><strong>Why this distinction is worth marks in practice.</strong> Students often answer a simple problem with a definition — restating the rule instead of applying it to the data given. The rule earns nothing here; the applied result does.</li>
</ul>
<p class="dap-an">✅ Classify: (a) "State the four pillars of OOP" → descriptive task. (b) "Refactor this class so it obeys the single-responsibility principle" → descriptive (simple) problem if the rule is given and mechanical. (c) "Evaluate whether inheritance or composition suits this design" → analytical, not descriptive at all.</p>
<p class="meo">💡 One-word mnemonic pair: <strong>task = DISPLAY · problem = USE</strong>. Everything else on this slide hangs off those two verbs, and the deck has kindly put them in the same grammatical slot so the contrast is visible at a glance.</p>`,
        `<p class="y-chinh">🎯 Hai tiêu đề trên một slide, và toàn bộ sự phân biệt nằm ở MỘT ĐỘNG TỪ. <strong>Nhiệm vụ mô tả: TRƯNG RA (display) dữ kiện, số liệu hoặc kiến thức.</strong> <strong>Vấn đề mô tả (đơn giản): DÙNG (use) dữ kiện, số liệu hoặc kiến thức — xác nhận khả năng áp dụng "các khái niệm cơ bản" và "công cụ thẳng thớm" theo cách đơn giản</strong> (Brick, 2014).</p>
<table>
<tr><th></th><th><strong>Nhiệm vụ</strong> mô tả</th><th><strong>Vấn đề</strong> mô tả (đơn giản)</th></tr>
<tr><td>Động từ</td><td><strong>TRƯNG RA</strong> dữ kiện, số liệu, kiến thức</td><td><strong>DÙNG</strong> dữ kiện, số liệu, kiến thức</td></tr>
<tr><td>Đang kiểm cái gì</td><td>Rằng bạn <em>BIẾT</em> nó</td><td>Rằng bạn <em>ÁP DỤNG</em> được nó</td></tr>
<tr><td>Công cụ liên quan</td><td>Không — chỉ là nhớ lại và làm sáng tỏ</td><td>"Khái niệm cơ bản" và "công cụ thẳng thớm"</td></tr>
<tr><td>Ví dụ SWT301</td><td>"Định nghĩa phân tích giá trị biên"</td><td>"Cho khoảng đầu vào này, hãy suy ra các ca kiểm thử biên"</td></tr>
</table>
<ul>
<li><strong>Trưng ra so với DÙNG — đó là cả câu trả lời thi.</strong> Nhiệm vụ đòi bạn chứng tỏ kiến thức nằm trong đầu bạn; vấn đề đơn giản đòi bạn đem kiến thức đó ra làm việc trên một trường hợp cụ thể. Cả hai đều ở mức "cơ bản"; không cái nào đòi phán xét.</li>
<li><strong>Chữ "xác nhận" (confirm) nói cho bạn biết mục đích của loại câu này.</strong> Vấn đề đơn giản tồn tại để <em>xác nhận năng lực</em> — chúng là bài kiểm tra tay nghề, nên thường ít điểm và được chấm gần như máy móc. Làm nhanh và đúng; đừng trang trí thêm.</li>
<li><strong>Hai cụm được đặt trong ngoặc kép trên slide, và đó là có chủ ý.</strong> "Basic concepts" và "straightforward tools" là trích từ Brick — nghĩa là công cụ đã được TRAO cho bạn, không phải công cụ bạn phải đi tìm. Ngay khi một bài đòi công cụ mà bạn phải CHỌN hoặc phải BIỆN MINH, bạn đã rời mục 2.2 và bước vào phần phân tích.</li>
<li><strong>Áp vào FPTU.</strong> "Định nghĩa 3NF" = nhiệm vụ mô tả. "Chuẩn hoá bảng này về 3NF" = vấn đề mô tả (đơn giản) — bạn dùng quy tắc lên một trường hợp cho sẵn. "Hãy lập luận xem chuẩn hoá bảng này về 3NF có phù hợp với tải của hệ thống không" = không thuộc loại nào ở đây; đó là PHÂN TÍCH, và slide 19 sẽ định nghĩa nó.</li>
<li><strong>Vì sao phân biệt này quy ra điểm thật.</strong> Sinh viên hay trả lời vấn đề đơn giản bằng một ĐỊNH NGHĨA — chép lại quy tắc thay vì áp nó vào dữ liệu đã cho. Ở đây quy tắc không được điểm nào; KẾT QUẢ ÁP DỤNG mới được.</li>
</ul>
<p class="dap-an">✅ Phân loại: (a) "Nêu bốn trụ cột của OOP" → nhiệm vụ mô tả. (b) "Refactor lớp này cho tuân thủ nguyên tắc đơn trách nhiệm" → vấn đề mô tả (đơn giản) nếu quy tắc đã cho và thao tác mang tính máy móc. (c) "Đánh giá xem kế thừa hay kết hợp phù hợp với thiết kế này" → phân tích, hoàn toàn không phải mô tả.</p>
<p class="meo">💡 Cặp mẹo nhớ một chữ: <strong>nhiệm vụ = TRƯNG RA · vấn đề = DÙNG</strong>. Mọi thứ còn lại trên slide đều treo vào hai động từ đó, và deck đã tử tế đặt chúng vào cùng một vị trí ngữ pháp để sự tương phản nhìn phát thấy ngay.</p>`],

      [15, '2.3a Analytical Tasks — objectives (the same three-part template)',
        `<p class="y-chinh">🎯 The objectives for section 2.3a, in exactly the template of slide 12: <strong>recognise an analytical problem</strong> · <strong>recognise the language associated with an analytical task</strong> · <strong>describe the type of response required for an analytical task</strong>.</p>
<ul>
<li><strong>Notice the wobble in the first bullet, because it is on the image.</strong> The section is titled "Analytical <em>Tasks</em>", but bullet 1 says "recognise an analytical <strong>problem</strong>". The deck uses the two words loosely here; slide 18 repeats the identical three bullets under the title "Analytical <strong>Problems</strong>". Learn the content, and expect the exam to use either word.</li>
<li><strong>The template is now confirmed: recognise the thing → recognise the language → describe the response.</strong> Three sections, one shape. That consistency is itself worth remembering, because a question may ask what the learning outcomes of a section are.</li>
<li><strong>"Analytical" is the level above "descriptive", not a different topic.</strong> Descriptive work displays or uses knowledge; analytical work interrogates it — compares, weighs, judges and argues. Section 2.3 is where university assessment actually lives.</li>
<li><strong>What the response must look like, previewed.</strong> For an analytical task, a list of facts is never a complete answer. The response needs a position, reasons for it, evidence attached to the reasons, and acknowledgement of the alternative. Slide 17 will state the underlying idea — interpretation and creation of knowledge, opinion based on critical thought.</li>
<li><strong>At FPTU.</strong> The SWP391 report's "Design rationale" section, an SWR302 requirements trade-off discussion, and almost every essay-form question in a PE paper are analytical. If you answer them descriptively you can be entirely correct and still score in the lower band.</li>
</ul>
<p class="meo">💡 The three objectives of 2.2a, 2.3a and 2.3b are the SAME three sentences with the family name swapped. If you can recite the template once, you have all three — that is nine bullets for the price of three.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu của mục 2.3a, theo đúng khuôn của slide 12: <strong>nhận ra một vấn đề phân tích</strong> · <strong>nhận ra NGÔN NGỮ gắn với một nhiệm vụ phân tích</strong> · <strong>mô tả KIỂU CÂU TRẢ LỜI mà một nhiệm vụ phân tích đòi</strong>.</p>
<ul>
<li><strong>Để ý chỗ chệch ở gạch đầu, vì nó có thật trên ảnh.</strong> Mục tên là "Analytical <em>Tasks</em>" (nhiệm vụ), nhưng gạch 1 lại ghi "nhận ra một <strong>vấn đề</strong> phân tích". Ở đây deck dùng hai chữ khá lỏng; slide 18 chép lại ĐÚNG ba gạch này dưới tiêu đề "Analytical <strong>Problems</strong>". Hãy thuộc nội dung, và lường trước đề thi dùng chữ nào cũng được.</li>
<li><strong>Cái khuôn giờ đã được xác nhận: nhận ra thứ đó → nhận ra ngôn ngữ → mô tả câu trả lời.</strong> Ba mục, một hình dạng. Chính sự nhất quán đó cũng đáng nhớ, vì đề có thể hỏi một mục có những chuẩn đầu ra nào.</li>
<li><strong>"Phân tích" là TẦNG TRÊN của "mô tả", không phải một chủ đề khác.</strong> Việc mô tả thì trưng ra hoặc dùng kiến thức; việc phân tích thì CHẤT VẤN nó — so sánh, cân đo, phán xét và lập luận. Mục 2.3 mới là nơi việc đánh giá ở đại học thật sự diễn ra.</li>
<li><strong>Câu trả lời phải trông như thế nào — xem trước.</strong> Với một nhiệm vụ phân tích, một danh sách dữ kiện KHÔNG BAO GIỜ là câu trả lời hoàn chỉnh. Bài làm cần một LẬP TRƯỜNG, các LÝ DO cho nó, BẰNG CHỨNG gắn vào lý do, và sự thừa nhận phương án ĐỐI LẬP. Slide 17 sẽ nói ý nền: diễn giải và tạo ra tri thức, ý kiến dựa trên tư duy phản biện.</li>
<li><strong>Ở FPTU.</strong> Mục "Design rationale" trong báo cáo SWP391, phần bàn về đánh đổi yêu cầu của SWR302, và gần như mọi câu tự luận trong bài PE đều là phân tích. Trả lời chúng theo lối mô tả thì bạn có thể đúng hoàn toàn mà vẫn nằm ở thang điểm thấp.</li>
</ul>
<p class="meo">💡 Ba mục tiêu của 2.2a, 2.3a và 2.3b là CÙNG ba câu, chỉ thay tên họ nhiệm vụ. Thuộc cái khuôn một lần là có cả ba — chín gạch đầu dòng với giá của ba.</p>`],

      [16, 'Analytical tasks — EIGHT instruction words (and "Describe" lives here)',
        `<p class="y-chinh">🎯 The counterpart list to slide 13, and it has <strong>eight</strong> words: <strong>Compare · Analyse · Contrast · Criticise · Discuss · Examine · Describe · Evaluate</strong> (Brick, 2014, p.29).</p>
<table>
<tr><th>Verb</th><th>What the answer must contain</th><th>FPTU example</th></tr>
<tr><td><strong>Compare</strong></td><td>Similarities <em>and</em> differences against stated criteria</td><td>"Compare REST and GraphQL for this API"</td></tr>
<tr><td><strong>Analyse</strong></td><td>Break into parts and show how the parts relate</td><td>"Analyse the causes of the sprint slippage"</td></tr>
<tr><td><strong>Contrast</strong></td><td>Differences specifically, made to matter</td><td>"Contrast unit and integration testing"</td></tr>
<tr><td><strong>Criticise</strong></td><td>Reasoned judgement of strengths and weaknesses</td><td>"Criticise this class diagram"</td></tr>
<tr><td><strong>Discuss</strong></td><td>Several viewpoints, weighed, then a position</td><td>"Discuss whether pair programming suits our team"</td></tr>
<tr><td><strong>Examine</strong></td><td>Look closely and report what the inspection shows</td><td>"Examine the defect log for patterns"</td></tr>
<tr><td><strong>Describe</strong></td><td>A full, structured account — filed here, not with the descriptive verbs</td><td>"Describe the deployment architecture"</td></tr>
<tr><td><strong>Evaluate</strong></td><td>A judgement against criteria, with evidence</td><td>"Evaluate the chosen database for this workload"</td></tr>
</table>
<ul>
<li><strong>Count them: eight, against six on slide 13.</strong> The two counts are the cleanest fact in this whole section and the easiest thing to be tested on. <strong>6 descriptive · 8 analytical.</strong></li>
<li><strong>"Describe" in the analytical list is the deck's biggest trap.</strong> Everything in you says it belongs with Define and Outline. On the image it is the seventh word of the analytical list. If an exam item asks which list "Describe" belongs to, the deck's answer is <strong>analytical</strong>.</li>
<li><strong>What unites the other seven is judgement.</strong> Compare, Contrast, Criticise, Discuss, Examine, Evaluate and Analyse all require you to weigh something and take a position. That is the practical test if you ever meet a verb that is not on either list: <em>does answering it require me to judge?</em></li>
<li><strong>Beware the two that students collapse into one.</strong> <em>Compare</em> demands similarities <strong>and</strong> differences; <em>Contrast</em> demands differences. Answering a "Compare" with only differences throws away half the marks, and it is the single most common verb mistake in written exams.</li>
<li><strong>Every analytical verb needs criteria — that is the practical skill.</strong> "Compare REST and GraphQL" is unanswerable until you name the criteria (latency, over-fetching, tooling, team familiarity, caching). Stating your criteria in the first sentence is the fastest way to lift an analytical answer.</li>
</ul>
<p class="dap-an">✅ Quick test: which of Define / Discuss / State / Summarise is analytical? <strong>Discuss.</strong> The other three are on the descriptive list of slide 13.</p>
<p class="meo">💡 Remember it as <strong>6 + 8</strong>, and remember the one defector: <strong>"Describe" sits with the analytical eight.</strong> If you can only carry one fact from slides 13 and 16 into the exam, carry that one.</p>`,
        `<p class="y-chinh">🎯 Danh sách đối ứng với slide 13, và nó có <strong>TÁM</strong> chữ: <strong>Compare · Analyse · Contrast · Criticise · Discuss · Examine · Describe · Evaluate</strong> (Brick, 2014, tr.29).</p>
<table>
<tr><th>Động từ</th><th>Bài làm phải có gì</th><th>Ví dụ ở FPTU</th></tr>
<tr><td><strong>Compare</strong> — So sánh</td><td>Điểm GIỐNG <em>và</em> điểm khác, theo tiêu chí đã nêu</td><td>"So sánh REST và GraphQL cho API này"</td></tr>
<tr><td><strong>Analyse</strong> — Phân tích</td><td>Chẻ thành các phần và chỉ ra chúng liên hệ ra sao</td><td>"Phân tích nguyên nhân trễ sprint"</td></tr>
<tr><td><strong>Contrast</strong> — Đối chiếu</td><td>Riêng điểm KHÁC, và làm cho nó có ý nghĩa</td><td>"Đối chiếu kiểm thử đơn vị và tích hợp"</td></tr>
<tr><td><strong>Criticise</strong> — Phê phán</td><td>Phán xét có lý lẽ về điểm mạnh và điểm yếu</td><td>"Phê phán sơ đồ lớp này"</td></tr>
<tr><td><strong>Discuss</strong> — Bàn luận</td><td>Nhiều góc nhìn, cân đo, rồi chốt lập trường</td><td>"Bàn xem lập trình cặp có hợp nhóm mình không"</td></tr>
<tr><td><strong>Examine</strong> — Khảo sát</td><td>Soi kỹ và báo cáo phép soi đó cho thấy gì</td><td>"Khảo sát log lỗi để tìm quy luật"</td></tr>
<tr><td><strong>Describe</strong> — Trình bày</td><td>Một tường thuật đầy đủ, có cấu trúc — xếp ở ĐÂY, không xếp cùng nhóm mô tả</td><td>"Trình bày kiến trúc triển khai"</td></tr>
<tr><td><strong>Evaluate</strong> — Đánh giá</td><td>Phán xét theo TIÊU CHÍ, kèm bằng chứng</td><td>"Đánh giá CSDL đã chọn với tải này"</td></tr>
</table>
<ul>
<li><strong>Đếm đi: TÁM, so với SÁU ở slide 13.</strong> Hai con số này là sự kiện gọn nhất của cả mục và cũng là thứ dễ bị hỏi nhất. <strong>6 mô tả · 8 phân tích.</strong></li>
<li><strong>"Describe" nằm trong danh sách phân tích là cái bẫy lớn nhất của deck.</strong> Mọi bản năng trong bạn bảo nó phải đứng cùng Define và Outline. Trên ảnh, nó là chữ THỨ BẢY của danh sách phân tích. Nếu đề hỏi "Describe" thuộc danh sách nào, câu trả lời theo deck là <strong>PHÂN TÍCH</strong>.</li>
<li><strong>Thứ nối bảy chữ còn lại là PHÁN XÉT.</strong> Compare, Contrast, Criticise, Discuss, Examine, Evaluate và Analyse đều buộc bạn cân đo cái gì đó và chọn một lập trường. Đó cũng là phép thử thực dụng khi gặp một động từ không có trong hai danh sách: <em>trả lời nó có buộc mình phán xét không?</em></li>
<li><strong>Coi chừng hai chữ sinh viên hay gộp làm một.</strong> <em>Compare</em> đòi điểm giống <strong>VÀ</strong> điểm khác; <em>Contrast</em> đòi điểm khác. Trả lời một câu "Compare" mà chỉ nêu điểm khác là vứt đi một nửa số điểm, và đó là lỗi động từ phổ biến nhất trong thi tự luận.</li>
<li><strong>Mọi động từ phân tích đều cần TIÊU CHÍ — đó là kỹ năng thực dụng.</strong> "So sánh REST và GraphQL" là câu không trả lời được cho tới khi bạn nêu tiêu chí (độ trễ, lấy thừa dữ liệu, công cụ, độ quen của nhóm, khả năng cache). Nêu tiêu chí ngay câu đầu tiên là cách nhanh nhất để nâng chất lượng một bài phân tích.</li>
</ul>
<p class="dap-an">✅ Kiểm nhanh: trong Define / Discuss / State / Summarise, chữ nào là phân tích? <strong>Discuss.</strong> Ba chữ còn lại nằm trong danh sách mô tả ở slide 13.</p>
<p class="meo">💡 Nhớ thành <strong>6 + 8</strong>, và nhớ kẻ đào ngũ: <strong>"Describe" ngồi cùng nhóm TÁM chữ phân tích.</strong> Nếu chỉ mang được một sự kiện từ slide 13 và 16 vào phòng thi, hãy mang cái đó.</p>`],

      [17, 'Analytical tasks — theoretical underpinnings, interpretation, and opinion based on critical thought',
        `<p class="y-chinh">🎯 What an analytical task actually <em>is</em>, in three lines: <strong>in-depth exploration and evaluation of a topic in terms of theoretical underpinnings</strong> · <strong>interpretation and creation of knowledge</strong> · and, nested under it, <strong>opinion based on critical thought</strong>.</p>
<table>
<tr><th>Descriptive (slides 13–14)</th><th>Analytical (this slide)</th></tr>
<tr><td>Facts, figures or knowledge</td><td>Theoretical underpinnings</td></tr>
<tr><td>Display or use existing knowledge</td><td><strong>Interpretation and CREATION</strong> of knowledge</td></tr>
<tr><td>No opinion required</td><td><strong>Opinion based on critical thought</strong></td></tr>
</table>
<ul>
<li><strong>"In terms of theoretical underpinnings" is the phrase that separates analysis from opinion-having.</strong> You are not asked what you feel; you are asked to judge the topic <em>through a theory</em>. Naming the theory you are judging by is what makes an answer analytical rather than chatty.</li>
<li><strong>"Creation of knowledge" is a strong claim, and it is meant literally.</strong> When you compare two options against criteria and reach a conclusion nobody handed you, you have produced something that was not in the sources. That is why analytical answers cannot be copied out of a textbook — and why they are the ones that carry the marks.</li>
<li><strong>The nesting matters: "opinion based on critical thought" sits UNDER "interpretation and creation of knowledge".</strong> Opinion is a <em>product</em> of the interpretation, not a starting point. An answer that opens with a verdict and then hunts for support has the arrow backwards.</li>
<li><strong>A four-move shape for any analytical answer.</strong> (1) name the criteria, (2) apply the theory or evidence to each option, (3) state the position that follows, (4) concede what the strongest counter-case is. That shape works for an essay paragraph, a design rationale and a viva answer alike.</li>
<li><strong>SWP391 case.</strong> "Should we cut scope or extend hours?" is analytical. The theoretical underpinning is available — Brooks's law, the iron triangle of scope/time/quality — and the answer is: with fixed time and fixed people, the only remaining variable is scope, so cut scope and say explicitly which quality attributes you are protecting. That is an opinion, arrived at through a theory, which is exactly what the slide describes.</li>
</ul>
<p class="meo">💡 Three-word summary of the whole descriptive/analytical divide: descriptive = <strong>REPORT</strong>, analytical = <strong>JUDGE</strong>. The slide's fancier wording — interpretation, creation, critical thought — all unpacks that one verb.</p>
<p class="pitfall">⚠️ "Opinion" here does not license unsupported assertion. The slide qualifies it immediately: <em>based on critical thought</em>. An analytical answer with a position and no reasoning scores no better than a descriptive answer — often worse, because it looks like a guess.</p>`,
        `<p class="y-chinh">🎯 Một nhiệm vụ phân tích thật ra <em>LÀ</em> cái gì, trong ba dòng: <strong>khám phá và đánh giá SÂU một chủ đề TRÊN NỀN CÁC LÝ THUYẾT</strong> · <strong>diễn giải và TẠO RA tri thức</strong> · và, lồng bên dưới, <strong>ý kiến dựa trên tư duy phản biện</strong>.</p>
<table>
<tr><th>Mô tả (slide 13–14)</th><th>Phân tích (slide này)</th></tr>
<tr><td>Dữ kiện, số liệu hoặc kiến thức</td><td>Nền tảng lý thuyết</td></tr>
<tr><td>Trưng ra hoặc dùng kiến thức có sẵn</td><td><strong>Diễn giải và TẠO RA</strong> tri thức</td></tr>
<tr><td>Không đòi ý kiến</td><td><strong>Ý kiến dựa trên tư duy phản biện</strong></td></tr>
</table>
<ul>
<li><strong>Cụm "trên nền các lý thuyết" là cụm tách phân tích ra khỏi việc "có ý kiến".</strong> Người ta không hỏi bạn CẢM THẤY gì; người ta bắt bạn phán xét chủ đề <em>QUA MỘT LÝ THUYẾT</em>. Gọi tên cái lý thuyết mà bạn đang lấy làm thước đo chính là thứ biến một bài thành phân tích thay vì tán gẫu.</li>
<li><strong>"Tạo ra tri thức" là một khẳng định mạnh, và nó được nói theo nghĩa đen.</strong> Khi bạn so hai phương án theo tiêu chí và đi tới một kết luận không ai trao cho bạn, bạn đã tạo ra thứ không có sẵn trong các nguồn. Vì thế bài phân tích không thể chép từ giáo trình ra — và cũng vì thế chúng mới là chỗ chứa điểm.</li>
<li><strong>Chỗ LỒNG NHAU có ý nghĩa: "ý kiến dựa trên tư duy phản biện" nằm DƯỚI "diễn giải và tạo ra tri thức".</strong> Ý kiến là SẢN PHẨM của việc diễn giải, không phải điểm xuất phát. Một bài mở đầu bằng phán quyết rồi đi lùng bằng chứng đỡ cho nó là bài bị ngược mũi tên.</li>
<li><strong>Một khung BỐN NƯỚC cho mọi bài phân tích.</strong> (1) nêu TIÊU CHÍ, (2) áp lý thuyết hoặc bằng chứng lên từng phương án, (3) nêu lập trường RÚT RA, (4) nhượng bộ cái phản biện mạnh nhất. Khung này dùng được cho một đoạn tiểu luận, một mục design rationale, lẫn một câu trả lời khi vấn đáp.</li>
<li><strong>Tình huống SWP391.</strong> "Nên cắt phạm vi hay tăng giờ làm?" là câu phân tích. Nền lý thuyết đã có sẵn — luật Brooks, tam giác sắt phạm vi/thời gian/chất lượng — và câu trả lời là: thời gian cố định, nhân sự cố định, thì biến duy nhất còn lại là PHẠM VI, nên hãy cắt phạm vi và nói rõ bạn đang bảo vệ những thuộc tính chất lượng nào. Đó là một ý kiến, đi tới bằng một lý thuyết, đúng như slide mô tả.</li>
</ul>
<p class="meo">💡 Tóm cả ranh giới mô tả/phân tích bằng hai chữ: mô tả = <strong>BÁO CÁO</strong>, phân tích = <strong>PHÁN XÉT</strong>. Những chữ hoa mỹ của slide — diễn giải, tạo ra, tư duy phản biện — đều mở ra từ đúng một động từ đó.</p>
<p class="pitfall">⚠️ Chữ "ý kiến" ở đây KHÔNG cho phép khẳng định suông. Slide rào ngay lập tức: <em>dựa trên tư duy phản biện</em>. Một bài phân tích có lập trường mà không có lập luận thì chấm không hơn một bài mô tả — thường còn thấp hơn, vì nó trông như đoán bừa.</p>`],
      [18, '2.3b Analytical Problems — objectives IDENTICAL to slide 15',
        `<p class="y-chinh">🎯 A new section number, a new title — <strong>2.3b Analytical <em>Problems</em></strong> — and <strong>three bullets that are word-for-word identical to slide 15</strong>, including the word "task" in all three: recognise an analytical problem · recognise the language associated with an analytical <em>task</em> · describe the type of response required for an analytical <em>task</em>.</p>
<table>
<tr><th>Slide 15 — "Analytical Tasks"</th><th>Slide 18 — "Analytical Problems"</th></tr>
<tr><td>recognise an analytical problem</td><td>recognise an analytical problem</td></tr>
<tr><td>recognise the language associated with an analytical task</td><td>recognise the language associated with an analytical task</td></tr>
<tr><td>describe the type of response required for an analytical task</td><td>describe the type of response required for an analytical task</td></tr>
</table>
<ul>
<li><strong>Say it plainly rather than pretending the slides differ.</strong> The two objective slides are the same three sentences. Only the heading changed from <em>Tasks</em> to <em>Problems</em>. Do not waste revision time hunting for a distinction between "the outcomes of 2.3a" and "the outcomes of 2.3b" — there isn't one on the images.</li>
<li><strong>The real task/problem distinction is the one from slide 14, carried upward.</strong> Task = what the instruction asks you to do with knowledge; problem = the thing to be solved. Applied here: an analytical <em>task</em> is the instruction verb (Evaluate, Discuss); an analytical <em>problem</em> is the ill-defined situation the instruction points at. Slides 19–22 deal with the problem; slides 16–17 dealt with the task.</li>
<li><strong>Why the repetition still tells you something.</strong> This is now the third appearance of the same three-part template (12, 15, 18). In an exam built from these slides, "recognise the language associated with…" is close to guaranteed to appear in some form.</li>
<li><strong>What changes after this slide, and it is a lot.</strong> Slides 19–23 stop describing and start prescribing: four characteristics of an analytical problem, then a three-step process for solving one. That process is the first genuinely procedural content of MOOC 2.</li>
</ul>
<p class="meo">💡 Tally of repeated slides in this block, so nothing surprises you: <strong>slide 11 repeats slide 2</strong> (plus one new bullet), <strong>slide 18 repeats slide 15</strong> (exactly), and <strong>slide 23 repeats slide 19</strong> (exactly). Three repeats in twenty-five slides — the deck is signalling weight, not making mistakes.</p>`,
        `<p class="y-chinh">🎯 Một số mục mới, một tiêu đề mới — <strong>2.3b Analytical <em>Problems</em></strong> — và <strong>ba gạch đầu dòng GIỐNG HỆT từng chữ với slide 15</strong>, kể cả chữ "task" ở cả ba dòng: nhận ra một vấn đề phân tích · nhận ra ngôn ngữ gắn với một <em>nhiệm vụ</em> phân tích · mô tả kiểu câu trả lời mà một <em>nhiệm vụ</em> phân tích đòi.</p>
<table>
<tr><th>Slide 15 — "Analytical Tasks"</th><th>Slide 18 — "Analytical Problems"</th></tr>
<tr><td>nhận ra một vấn đề phân tích</td><td>nhận ra một vấn đề phân tích</td></tr>
<tr><td>nhận ra ngôn ngữ gắn với một nhiệm vụ phân tích</td><td>nhận ra ngôn ngữ gắn với một nhiệm vụ phân tích</td></tr>
<tr><td>mô tả kiểu câu trả lời mà một nhiệm vụ phân tích đòi</td><td>mô tả kiểu câu trả lời mà một nhiệm vụ phân tích đòi</td></tr>
</table>
<ul>
<li><strong>Nói thẳng ra chứ đừng giả vờ hai slide khác nhau.</strong> Hai slide mục tiêu là CÙNG ba câu. Chỉ tiêu đề đổi từ <em>Tasks</em> sang <em>Problems</em>. Đừng phí thời gian ôn tập đi lùng sự khác nhau giữa "chuẩn đầu ra của 2.3a" và "của 2.3b" — trên ảnh không có.</li>
<li><strong>Phân biệt nhiệm vụ/vấn đề THẬT là cái đã có ở slide 14, nâng lên một tầng.</strong> Nhiệm vụ = thứ đề bảo bạn LÀM với kiến thức; vấn đề = thứ cần được GIẢI. Áp vào đây: <em>nhiệm vụ</em> phân tích là động từ trong đề (Evaluate, Discuss); <em>vấn đề</em> phân tích là cái tình huống chưa rõ ràng mà đề đang trỏ tới. Slide 19–22 lo phần vấn đề; slide 16–17 đã lo phần nhiệm vụ.</li>
<li><strong>Vì sao sự lặp lại vẫn nói cho bạn điều gì đó.</strong> Đây là lần XUẤT HIỆN THỨ BA của cùng một khuôn ba phần (12, 15, 18). Trong một đề thi dựng từ bộ slide này, câu "nhận ra ngôn ngữ gắn với…" gần như chắc chắn sẽ xuất hiện dưới dạng nào đó.</li>
<li><strong>Cái thay đổi sau slide này thì nhiều.</strong> Slide 19–23 thôi MÔ TẢ và bắt đầu KÊ ĐƠN: bốn đặc điểm của vấn đề phân tích, rồi một quy trình BA BƯỚC để giải nó. Quy trình đó là nội dung thật sự mang tính thủ tục đầu tiên của MOOC 2.</li>
</ul>
<p class="meo">💡 Kiểm kê các slide bị lặp trong khối này để không bị bất ngờ: <strong>slide 11 lặp slide 2</strong> (cộng một gạch mới), <strong>slide 18 lặp slide 15</strong> (y hệt), và <strong>slide 23 lặp slide 19</strong> (y hệt). Ba lần lặp trong hai mươi lăm slide — deck đang báo hiệu TRỌNG SỐ, không phải làm ẩu.</p>`],

      [19, 'Analytical Problems — four characteristics (and the word that changed)',
        `<p class="y-chinh">🎯 Four bullets that define the kind of problem university actually sets: <strong>ill-defined in some way</strong> · <strong>cannot be solved using a basic formula or concept</strong> · <strong>solution path or the goal is undefined or uncertain</strong> · <strong>the solution may not be obvious and may need to be defined</strong>.</p>
<table>
<tr><th>Slide 7 — Ill-Defined Problems</th><th>Slide 19 — Analytical Problems</th></tr>
<tr><td>Cannot be solved using a basic formula or concept</td><td>Same</td></tr>
<tr><td>Solution path or goal is undefined <strong>and</strong> uncertain</td><td>Solution path or the goal is undefined <strong>or</strong> uncertain</td></tr>
<tr><td>The solution may not be obvious and may need to be <strong>JUSTIFIED</strong></td><td>The solution may not be obvious and may need to be <strong>DEFINED</strong></td></tr>
<tr><td>—</td><td><strong>Ill-defined in some way</strong> (new first bullet)</td></tr>
</table>
<ul>
<li><strong>This slide is the answer to the unanswered objective from slide 11.</strong> "Describe the kinds of problems most common at university" — they are <em>analytical</em>, and analytical means <em>ill-defined in some way</em>. That link is worth writing down, because the two slides are eight apart and the exam will not put them side by side.</li>
<li><strong>Read "in some way" as a deliberate softener.</strong> Not everything about an analytical problem is vague — the topic is usually clear, the deadline is certain, the format is specified. What is ill-defined is the path, the goal, or the standard of a good answer. Usually all three.</li>
<li><strong>Bullet 3 is the diagnostic you can run in ten seconds.</strong> Ask: do I know exactly what to do (path)? do I know exactly what the finished thing looks like (goal)? If either answer is no, you are holding an analytical problem and a formula will not rescue you.</li>
<li><strong>The consequence for how you work.</strong> Because there is no formula, your first move is not to compute but to <em>define</em>: pin the goal, name the criteria, choose the theory or method. Slide 20 makes that the explicit first step of a three-step process.</li>
<li><strong>SWP391 case, labelled with this slide's words.</strong> Ill-defined in some way ✔ (what counts as "back on track"?). No basic formula ✔ (no equation converts a missing teammate into a delivered sprint). Path or goal undefined ✔ (both). Solution not obvious and must be defined ✔ — which is precisely why the group argues in circles until somebody writes the goal down.</li>
</ul>
<p class="pitfall">⚠️ The word change is real and on the images: slide 7 says the solution "may need to be <strong>justified</strong>"; slides 19 and 23 say "may need to be <strong>defined</strong>". Both are true of analytical work, but they are different claims — <em>defined</em> = you must decide what a solution even is; <em>justified</em> = you must argue that yours is good. Expect either wording in an option.</p>
<p class="meo">💡 Four characteristics, and the first one contains the other three: <strong>ill-defined ⊃ no formula · path or goal missing · solution must be defined</strong>. If you remember "analytical = ill-defined", you can reconstruct the rest from slide 7.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch định nghĩa đúng loại vấn đề mà đại học thật sự ra cho bạn: <strong>ill-defined theo một kiểu nào đó</strong> · <strong>không giải được bằng một công thức hay khái niệm cơ bản</strong> · <strong>đường giải HOẶC đích chưa được định nghĩa hoặc không chắc chắn</strong> · <strong>lời giải có thể không hiển nhiên và có thể phải được ĐỊNH NGHĨA</strong>.</p>
<table>
<tr><th>Slide 7 — Ill-Defined Problems</th><th>Slide 19 — Analytical Problems</th></tr>
<tr><td>Không giải được bằng công thức/khái niệm cơ bản</td><td>Giống hệt</td></tr>
<tr><td>Đường giải hoặc đích chưa định nghĩa <strong>VÀ</strong> không chắc chắn</td><td>Đường giải hoặc đích chưa định nghĩa <strong>HOẶC</strong> không chắc chắn</td></tr>
<tr><td>Lời giải có thể không hiển nhiên và có thể phải được <strong>BIỆN MINH</strong></td><td>Lời giải có thể không hiển nhiên và có thể phải được <strong>ĐỊNH NGHĨA</strong></td></tr>
<tr><td>—</td><td><strong>Ill-defined theo một kiểu nào đó</strong> (gạch đầu MỚI)</td></tr>
</table>
<ul>
<li><strong>Slide này chính là câu trả lời cho mục tiêu còn bỏ ngỏ ở slide 11.</strong> "Mô tả các loại vấn đề phổ biến nhất ở đại học" — đó là vấn đề <em>PHÂN TÍCH</em>, và phân tích nghĩa là <em>chưa rõ ràng theo một kiểu nào đó</em>. Mối nối này đáng ghi lại, vì hai slide cách nhau tám bậc và đề thi sẽ không đặt chúng cạnh nhau.</li>
<li><strong>Đọc "theo một kiểu nào đó" như một chữ RÀO có chủ ý.</strong> Không phải mọi thứ trong một vấn đề phân tích đều mơ hồ — chủ đề thường rõ, hạn nộp chắc chắn, định dạng đã quy định. Thứ chưa rõ là ĐƯỜNG ĐI, ĐÍCH, hoặc CHUẨN của một bài làm tốt. Thường là cả ba.</li>
<li><strong>Gạch số 3 là phép chẩn đoán chạy được trong mười giây.</strong> Hỏi: mình có biết chính xác phải làm gì không (đường)? mình có biết chính xác thứ hoàn thành trông thế nào không (đích)? Một trong hai trả lời là "không" thì bạn đang cầm một vấn đề phân tích, và công thức sẽ không cứu bạn.</li>
<li><strong>Hệ quả cho cách làm việc.</strong> Vì không có công thức, nước đi đầu tiên của bạn không phải TÍNH mà là <em>ĐỊNH NGHĨA</em>: ghim đích, nêu tiêu chí, chọn lý thuyết hoặc phương pháp. Slide 20 sẽ biến chính điều đó thành bước một của một quy trình ba bước.</li>
<li><strong>Tình huống SWP391, dán nhãn bằng đúng chữ của slide.</strong> Chưa rõ ràng theo một kiểu nào đó ✔ (thế nào mới gọi là "đã bắt kịp tiến độ"?). Không có công thức cơ bản ✔ (không phương trình nào biến một đồng đội mất tích thành một sprint đã giao). Đường hoặc đích chưa định nghĩa ✔ (cả hai). Lời giải không hiển nhiên và phải được định nghĩa ✔ — đúng là lý do cả nhóm cãi vòng quanh cho tới khi có người CHỊU VIẾT CÁI ĐÍCH RA GIẤY.</li>
</ul>
<p class="pitfall">⚠️ Chỗ đổi chữ là có thật và nằm trên ảnh: slide 7 ghi lời giải "có thể phải được <strong>BIỆN MINH</strong> (justified)"; slide 19 và 23 ghi "có thể phải được <strong>ĐỊNH NGHĨA</strong> (defined)". Cả hai đều đúng với công việc phân tích, nhưng là hai khẳng định KHÁC nhau — <em>định nghĩa</em> = bạn phải quyết xem thế nào MỚI LÀ một lời giải; <em>biện minh</em> = bạn phải lập luận rằng lời giải của bạn tốt. Hãy lường trước đề dùng cách nào cũng được.</p>
<p class="meo">💡 Bốn đặc điểm, và cái đầu tiên CHỨA ba cái còn lại: <strong>chưa rõ ràng ⊃ không công thức · thiếu đường hoặc đích · lời giải phải được định nghĩa</strong>. Nhớ "phân tích = chưa rõ ràng" là dựng lại được phần còn lại từ slide 7.</p>`],

      [20, 'Analytical Problems, step 1 — "Identify the problem" (Brick, 2014, p.32)',
        `<p class="y-chinh">🎯 The first of three numbered steps: <strong>1) "Identify the problem" (Brick, 2014, p. 32)</strong> — with three sub-moves: <strong>important features</strong> · <strong>what information is missing?</strong> · <strong>decide on a theory, concept or method</strong>.</p>
<ul>
<li><strong>Step 1 is not "read the question"; it is three separate acts.</strong> Separate the important features from the noise, audit what you have <em>not</em> been told, and commit to the lens you will use. Most students skip the second and third and go straight to writing.</li>
<li><strong>"What information is missing?" is the step that converts ill-defined to well-defined.</strong> Since analytical problems are ill-defined by slide 19, something is always missing — the goal, a criterion, a constraint, a number. Listing the gaps tells you exactly what to ask your supervisor or go and research.</li>
<li><strong>"Decide on a theory, concept or method" — decide, before you start.</strong> Choosing the lens up front is what makes the rest of the work coherent; choosing it afterwards produces an answer that wanders. Note the echo of slide 17: analysis happens "in terms of theoretical underpinnings".</li>
<li><strong>Finding the root cause is part of "important features", and there are two standard tools for it.</strong> Neither is on the slide, but both do exactly the job step 1 describes, and both are usable on the SWP391 case below.</li>
</ul>
<p class="nhan">📐 <strong>Tool A — 5 Whys.</strong> Ask "why?" five times, each answer becoming the next question, until you reach a cause you can actually act on.</p>
<table>
<tr><th>#</th><th>Question</th><th>Answer</th></tr>
<tr><td>1</td><td>Why is the group two weeks behind?</td><td>Four of nine stories are unfinished.</td></tr>
<tr><td>2</td><td>Why are they unfinished?</td><td>Three of them depend on one member's module, which was never delivered.</td></tr>
<tr><td>3</td><td>Why was it never delivered?</td><td>He got stuck on the authentication library in week 2 and said nothing.</td></tr>
<tr><td>4</td><td>Why did he say nothing?</td><td>There was no point at which anyone had to report progress.</td></tr>
<tr><td>5</td><td><strong>Why was there no such point?</strong></td><td><strong>The team never agreed a check-in ritual or a definition of done.</strong></td></tr>
</table>
<p class="dap-an">✅ Root cause: <strong>no progress-visibility mechanism</strong> — not "a lazy teammate". That matters, because the actionable fix (a 10-minute stand-up plus a shared board, and splitting the blocked module) addresses the cause; blaming the person does not, and would leave the same failure available to any other member next sprint.</p>
<p class="nhan">📐 <strong>Tool B — Ishikawa (fishbone) diagram.</strong> Sort candidate causes into categories, then test each against evidence instead of arguing about them. Six classic categories, adapted for a student project:</p>
<table>
<tr><th>Category (bone)</th><th>Candidate cause in SWP391</th><th>Evidence to check</th></tr>
<tr><td><strong>People</strong></td><td>One member overloaded with a part-time job</td><td>Ask; check his commit timestamps</td></tr>
<tr><td><strong>Process</strong></td><td>No stand-up, no definition of done</td><td>Is there a board? any written agreement?</td></tr>
<tr><td><strong>Tools</strong></td><td>Auth library undocumented; local env breaks</td><td>Setup time for a new machine</td></tr>
<tr><td><strong>Communication</strong></td><td>Chat only, no agreed response time</td><td>Gap between messages and replies</td></tr>
<tr><td><strong>Planning</strong></td><td>Sprint sized on optimism, not velocity</td><td>Planned vs completed points, sprint 1</td></tr>
<tr><td><strong>Environment</strong></td><td>Three other subjects with deadlines the same week</td><td>The group's shared calendar</td></tr>
</table>
<p class="meo">💡 Remember step 1 as three moves: <strong>features → gaps → lens</strong>. And remember that 5 Whys goes <em>deep</em> on one chain while a fishbone goes <em>wide</em> across categories — use the fishbone first when you do not yet know which chain to follow.</p>
<p class="pitfall">⚠️ Do not stop the 5 Whys at a person ("because he is lazy"). A cause you cannot act on systemically is a dead end; keep asking until you reach a missing mechanism, which is something the team can actually install.</p>`,
        `<p class="y-chinh">🎯 Bước đầu tiên trong ba bước được đánh số: <strong>1) "Nhận diện vấn đề" (Brick, 2014, tr. 32)</strong> — kèm ba nước đi con: <strong>các đặc điểm quan trọng</strong> · <strong>thông tin nào đang thiếu?</strong> · <strong>chọn lấy một lý thuyết, khái niệm hoặc phương pháp</strong>.</p>
<ul>
<li><strong>Bước 1 không phải "đọc đề"; nó là BA hành động tách bạch.</strong> Tách các đặc điểm quan trọng ra khỏi nhiễu, kiểm kê thứ bạn <em>CHƯA</em> được cho, và cam kết vào cái lăng kính sẽ dùng. Phần lớn sinh viên bỏ qua hành động thứ hai và thứ ba rồi lao thẳng vào viết.</li>
<li><strong>"Thông tin nào đang thiếu?" là bước biến chưa-rõ-ràng thành rõ-ràng.</strong> Vì theo slide 19 vấn đề phân tích vốn chưa rõ ràng, nên luôn có thứ bị thiếu — cái đích, một tiêu chí, một ràng buộc, một con số. Liệt kê các lỗ hổng cho bạn biết chính xác phải hỏi giảng viên cái gì, hoặc phải đi tra cứu cái gì.</li>
<li><strong>"Chọn lấy một lý thuyết, khái niệm hoặc phương pháp" — CHỌN, trước khi bắt đầu.</strong> Chọn lăng kính ngay từ đầu là thứ làm cả phần việc còn lại mạch lạc; chọn sau khi làm thì ra một bài lan man. Để ý tiếng vọng từ slide 17: phân tích diễn ra "trên nền các lý thuyết".</li>
<li><strong>Tìm NGUYÊN NHÂN GỐC là một phần của "đặc điểm quan trọng", và có hai công cụ chuẩn cho việc đó.</strong> Cả hai đều không có trên slide, nhưng cả hai làm đúng việc mà bước 1 mô tả, và cả hai đều dùng được cho tình huống SWP391 dưới đây.</li>
</ul>
<p class="nhan">📐 <strong>Công cụ A — 5 Whys (Năm lần hỏi "vì sao").</strong> Hỏi "vì sao?" năm lần, mỗi câu trả lời trở thành câu hỏi kế tiếp, cho tới khi chạm một nguyên nhân bạn THẬT SỰ tác động được.</p>
<table>
<tr><th>#</th><th>Câu hỏi</th><th>Trả lời</th></tr>
<tr><td>1</td><td>Vì sao nhóm trễ hai tuần?</td><td>Bốn trên chín story chưa xong.</td></tr>
<tr><td>2</td><td>Vì sao chúng chưa xong?</td><td>Ba trong số đó phụ thuộc module của một bạn, mà module đó chưa từng được nộp.</td></tr>
<tr><td>3</td><td>Vì sao nó chưa từng được nộp?</td><td>Bạn ấy kẹt ở thư viện xác thực từ tuần 2 và không nói gì.</td></tr>
<tr><td>4</td><td>Vì sao bạn ấy không nói gì?</td><td>Không có thời điểm nào bắt buộc ai đó phải báo tiến độ.</td></tr>
<tr><td>5</td><td><strong>Vì sao không có thời điểm như vậy?</strong></td><td><strong>Nhóm chưa bao giờ thống nhất một nhịp check-in hay một "định nghĩa hoàn thành".</strong></td></tr>
</table>
<p class="dap-an">✅ Nguyên nhân gốc: <strong>thiếu cơ chế làm tiến độ HIỆN HÌNH</strong> — không phải "có một đứa lười". Điều đó quan trọng, vì cách sửa hành động được (stand-up 10 phút cộng một bảng việc chung, và chẻ nhỏ module đang kẹt) chạm vào đúng nguyên nhân; còn đổ lỗi cho một người thì không, và sẽ để nguyên cái lỗ hổng đó cho bất kỳ thành viên nào khác rơi vào ở sprint sau.</p>
<p class="nhan">📐 <strong>Công cụ B — Biểu đồ xương cá (Ishikawa).</strong> Xếp các nguyên nhân khả dĩ vào từng nhóm, rồi ĐỐI CHIẾU từng cái với bằng chứng thay vì ngồi cãi nhau. Sáu nhóm kinh điển, chỉnh cho đồ án sinh viên:</p>
<table>
<tr><th>Nhóm (xương)</th><th>Nguyên nhân khả dĩ trong SWP391</th><th>Bằng chứng cần kiểm</th></tr>
<tr><td><strong>Con người</strong></td><td>Một bạn quá tải vì đi làm thêm</td><td>Hỏi thẳng; xem dấu thời gian các commit</td></tr>
<tr><td><strong>Quy trình</strong></td><td>Không stand-up, không "định nghĩa hoàn thành"</td><td>Có bảng việc không? có thoả thuận viết ra không?</td></tr>
<tr><td><strong>Công cụ</strong></td><td>Thư viện auth không tài liệu; môi trường local hay vỡ</td><td>Thời gian dựng môi trường trên một máy mới</td></tr>
<tr><td><strong>Giao tiếp</strong></td><td>Chỉ chat, không cam kết thời gian phản hồi</td><td>Khoảng cách giữa tin nhắn và câu trả lời</td></tr>
<tr><td><strong>Kế hoạch</strong></td><td>Sprint được ước lượng theo lạc quan, không theo velocity</td><td>Điểm kế hoạch so với điểm hoàn thành, sprint 1</td></tr>
<tr><td><strong>Bối cảnh</strong></td><td>Ba môn khác cùng deadline trong một tuần</td><td>Lịch chung của nhóm</td></tr>
</table>
<p class="meo">💡 Nhớ bước 1 thành ba nước: <strong>đặc điểm → lỗ hổng → lăng kính</strong>. Và nhớ rằng 5 Whys đào <em>SÂU</em> theo một chuỗi, còn xương cá quét <em>RỘNG</em> qua các nhóm — hãy dùng xương cá trước khi bạn còn chưa biết nên đào theo chuỗi nào.</p>
<p class="pitfall">⚠️ Đừng dừng 5 Whys ở một CON NGƯỜI ("vì nó lười"). Một nguyên nhân mà bạn không tác động được về mặt hệ thống là ngõ cụt; hãy hỏi tiếp cho tới khi chạm một CƠ CHẾ CÒN THIẾU — thứ mà nhóm thật sự lắp vào được.</p>`],

      [21, 'Analytical Problems, step 2 — "Identify the solutions" (Brick, 2014, p.33)',
        `<p class="y-chinh">🎯 Step two, and note the plural: <strong>2) "Identify the solutionS" (Brick, 2014, p. 33)</strong> — <strong>determine how the method, concept or theory relates to the problem</strong> · <strong>decide upon the solution that the concept, theory or method suggests</strong> · <strong>find and understand how to use data to support your solution</strong>.</p>
<table>
<tr><th>Sub-move</th><th>What you are actually doing</th><th>SWP391</th></tr>
<tr><td>Relate the lens to the problem</td><td>Check the theory chosen in step 1 actually applies here</td><td>Iron triangle: time and people are fixed, so scope is the only free variable</td></tr>
<tr><td>Decide the solution it suggests</td><td>Let the theory generate the option, not your mood</td><td>Cut scope: defer 2 nice-to-have stories, keep the 7 that the rubric marks</td></tr>
<tr><td>Find data to support it</td><td>Attach evidence before you commit</td><td>Sprint 1 velocity = 3 stories/2 weeks → 7 stories in 3 weeks is only just feasible</td></tr>
</table>
<ul>
<li><strong>The plural is doing real work: generate options before you choose one.</strong> A single idea is not a solution set. Write down three or four candidates — cut scope · redistribute the blocked module · escalate to the supervisor · reduce quality on a non-marked attribute — then judge them. Committing to the first idea is the most common failure in group projects.</li>
<li><strong>"Determine how the method, concept or theory relates" is a checkpoint, not a formality.</strong> The lens you picked in step 1 might not fit. If your theory cannot generate at least one candidate solution, that is evidence you chose the wrong theory — go back to step 1 rather than forcing it.</li>
<li><strong>"Decide upon the solution that the theory suggests" is the sentence that keeps you honest.</strong> The solution is supposed to come <em>out</em> of the analysis. If you already knew the answer and then went looking for a theory that agrees, you have written an opinion piece — the thing slide 17 warned against.</li>
<li><strong>The third sub-move is where most student answers thin out.</strong> "Find and understand how to use data" — not just cite a number, but know what the number licenses you to claim. Velocity of 3 stories per 2 weeks supports "7 in 3 weeks is tight"; it does not support "we will definitely finish".</li>
<li><strong>At FPTU this is exactly the "Design rationale" section.</strong> Options considered, criteria applied, option chosen, evidence attached. Write it in that order and the section writes itself; write the conclusion first and you will spend the evening reverse-engineering reasons.</li>
</ul>
<p class="meo">💡 Step 2 in three words: <strong>relate → decide → evidence</strong>. And remember the plural "solutions" — an exam option that describes step 2 as "choose the solution" has dropped the generation stage that the heading insists on.</p>`,
        `<p class="y-chinh">🎯 Bước hai, và chú ý số NHIỀU: <strong>2) "Nhận diện các LỜI GIẢI" (Brick, 2014, tr. 33)</strong> — <strong>xác định phương pháp/khái niệm/lý thuyết liên hệ với vấn đề ra sao</strong> · <strong>quyết định lấy lời giải mà khái niệm, lý thuyết hay phương pháp đó GỢI RA</strong> · <strong>tìm và hiểu cách dùng DỮ LIỆU để đỡ cho lời giải của bạn</strong>.</p>
<table>
<tr><th>Nước đi con</th><th>Thật ra bạn đang làm gì</th><th>SWP391</th></tr>
<tr><td>Nối lăng kính với vấn đề</td><td>Kiểm xem lý thuyết chọn ở bước 1 có áp được vào đây thật không</td><td>Tam giác sắt: thời gian và nhân sự cố định, nên PHẠM VI là biến tự do duy nhất</td></tr>
<tr><td>Quyết lời giải mà nó gợi ra</td><td>Để LÝ THUYẾT đẻ ra phương án, chứ không phải tâm trạng bạn</td><td>Cắt phạm vi: hoãn 2 story "có thì tốt", giữ 7 story mà rubric chấm</td></tr>
<tr><td>Tìm dữ liệu đỡ cho nó</td><td>Gắn bằng chứng TRƯỚC khi cam kết</td><td>Velocity sprint 1 = 3 story/2 tuần → 7 story trong 3 tuần chỉ vừa đủ khả thi</td></tr>
</table>
<ul>
<li><strong>Số nhiều đang làm việc thật: SINH RA nhiều phương án trước khi chọn một.</strong> Một ý tưởng đơn lẻ không phải một tập lời giải. Viết ra ba bốn ứng viên — cắt phạm vi · chia lại module đang kẹt · báo lên giảng viên · hạ chất lượng ở một thuộc tính không bị chấm — rồi mới phán xét chúng. Chốt ngay ý đầu tiên là thất bại phổ biến nhất trong đồ án nhóm.</li>
<li><strong>"Xác định lý thuyết liên hệ ra sao" là một CHỐT KIỂM, không phải thủ tục.</strong> Cái lăng kính bạn chọn ở bước 1 có thể không vừa. Nếu lý thuyết của bạn không sinh nổi ít nhất một phương án, đó là bằng chứng bạn chọn sai lý thuyết — hãy quay lại bước 1 thay vì gò ép.</li>
<li><strong>"Quyết lấy lời giải mà lý thuyết GỢI RA" là câu giữ cho bạn trung thực.</strong> Lời giải lẽ ra phải đi RA TỪ phân tích. Nếu bạn đã biết đáp án rồi mới đi tìm một lý thuyết đồng tình, bạn đã viết một bài xã luận — đúng thứ slide 17 cảnh báo.</li>
<li><strong>Nước đi con thứ ba là chỗ phần lớn bài làm của sinh viên mỏng đi.</strong> "Tìm và HIỂU cách dùng dữ liệu" — không chỉ trích một con số, mà biết con số đó cho phép bạn khẳng định tới đâu. Velocity 3 story/2 tuần đỡ được cho câu "7 story trong 3 tuần là căng"; nó KHÔNG đỡ được cho câu "chúng tôi chắc chắn sẽ xong".</li>
<li><strong>Ở FPTU đây đúng là mục "Design rationale".</strong> Các phương án đã cân nhắc, tiêu chí đã áp, phương án được chọn, bằng chứng kèm theo. Viết theo đúng thứ tự đó thì mục tự viết ra; viết kết luận trước thì bạn sẽ mất cả tối để dựng ngược lý do.</li>
</ul>
<p class="meo">💡 Bước 2 trong ba chữ: <strong>NỐI → QUYẾT → BẰNG CHỨNG</strong>. Và nhớ chữ số nhiều "các lời giải" — một phương án thi mô tả bước 2 thành "chọn lấy lời giải" là đã đánh rơi giai đoạn SINH phương án mà chính tiêu đề nhấn mạnh.</p>`],
      [22, 'Analytical Problems, step 3 — "Evaluate the solution" (Brick, 2014, p.33)',
        `<p class="y-chinh">🎯 The shortest step and the one most often skipped: <strong>3) "Evaluate the solution" (Brick, 2014, p. 33)</strong> — just two questions: <strong>Why is your solution the best?</strong> and <strong>Does it contradict or confirm the research?</strong></p>
<table>
<tr><th>Question</th><th>What a complete answer contains</th><th>SWP391</th></tr>
<tr><td><strong>Why is yours the best?</strong></td><td>Criteria, plus what the rejected options cost</td><td>Cutting scope protects the 7 marked stories; extending hours risks three other subjects and, per Brooks, adding a person now would slow us further</td></tr>
<tr><td><strong>Contradict or confirm the research?</strong></td><td>An explicit link back to the theory used in step 1</td><td>Confirms the iron triangle; consistent with Brooks's law rather than against it</td></tr>
</table>
<ul>
<li><strong>"Best" is a comparative, so it needs comparators.</strong> You cannot answer "why is it best" if you only ever had one option — which is why step 2 insisted on the plural. Steps 2 and 3 are joined: generate several, then justify the winner against the losers.</li>
<li><strong>The second question is what makes this academic rather than practical.</strong> Asking whether your solution <em>contradicts or confirms</em> the research forces your private reasoning back into the public conversation of the field. A solution that contradicts established research is allowed — but it must be flagged and defended, not ignored.</li>
<li><strong>Note that "contradict" comes first in the slide's wording.</strong> The deck is signalling that contradiction is the interesting case. A finding that merely confirms adds little; a finding that conflicts either reveals a flaw in your reasoning or a limit on the theory, and either is worth a paragraph.</li>
<li><strong>This is the step that converts a pass into a good mark.</strong> Most students stop when they have <em>a</em> solution. The marks for "critical" and "evaluative" in every rubric live in step 3 — in the sentence that says why the alternatives were worse and how the answer sits relative to the literature.</li>
<li><strong>Do it before you submit, not after you get the mark.</strong> Two questions, five minutes: why is this best, and what does the theory say about it. That is the cheapest quality gate available on any analytical assignment.</li>
</ul>
<p class="dap-an">✅ Full three-step run on the case: <strong>(1) Identify</strong> — features: 4/9 stories done, 3 blocked on one module, 3 weeks left; missing: what counts as "back on track"; lens: the iron triangle. <strong>(2) Identify solutions</strong> — cut scope · redistribute · escalate · add a person; theory picks "cut scope + redistribute"; data: velocity 3 stories/2 weeks. <strong>(3) Evaluate</strong> — best because it protects the marked stories under fixed time and people; confirms the iron triangle and Brooks's law rather than contradicting them.</p>
<p class="meo">💡 Remember Brick's process as <strong>THREE steps, in the order problem → solutions → evaluation</strong>, and remember step 3 is <em>two questions</em>. Do not confuse this three-step process with Pólya's four steps on slide 25 — the deck presents both, and an exam item can ask which belongs to whom.</p>`,
        `<p class="y-chinh">🎯 Bước ngắn nhất và cũng là bước hay bị bỏ nhất: <strong>3) "Đánh giá lời giải" (Brick, 2014, tr. 33)</strong> — chỉ hai câu hỏi: <strong>Vì sao lời giải của bạn là TỐT NHẤT?</strong> và <strong>Nó MÂU THUẪN hay XÁC NHẬN các nghiên cứu đã có?</strong></p>
<table>
<tr><th>Câu hỏi</th><th>Câu trả lời đầy đủ phải có gì</th><th>SWP391</th></tr>
<tr><td><strong>Vì sao của bạn là tốt nhất?</strong></td><td>TIÊU CHÍ, cộng cái giá của các phương án bị loại</td><td>Cắt phạm vi bảo vệ được 7 story bị chấm; tăng giờ làm thì đánh đổi ba môn khác, và theo Brooks, thêm người lúc này còn làm chậm hơn</td></tr>
<tr><td><strong>Mâu thuẫn hay xác nhận nghiên cứu?</strong></td><td>Một mối nối TƯỜNG MINH về lý thuyết đã dùng ở bước 1</td><td>Xác nhận tam giác sắt; nhất quán với luật Brooks chứ không chống lại nó</td></tr>
</table>
<ul>
<li><strong>"Tốt nhất" là một so sánh, nên nó cần thứ để SO.</strong> Bạn không trả lời được "vì sao tốt nhất" nếu từ đầu tới cuối chỉ có một phương án — đó là lý do bước 2 khăng khăng dùng số nhiều. Bước 2 và 3 dính nhau: sinh ra nhiều, rồi biện minh cho kẻ thắng trước những kẻ thua.</li>
<li><strong>Câu hỏi thứ hai mới là thứ làm việc này mang tính HỌC THUẬT chứ không chỉ thực dụng.</strong> Hỏi xem lời giải của bạn <em>mâu thuẫn hay xác nhận</em> nghiên cứu là ép lập luận riêng tư của bạn quay lại cuộc trò chuyện chung của ngành. Một lời giải trái với nghiên cứu đã có thì vẫn được phép — nhưng phải được NÊU RA và bảo vệ, không được lờ đi.</li>
<li><strong>Để ý chữ "mâu thuẫn" đứng TRƯỚC trong câu của slide.</strong> Deck đang ngầm báo rằng chỗ mâu thuẫn mới là chỗ thú vị. Một kết quả chỉ xác nhận thì thêm được ít; một kết quả xung đột thì hoặc lộ ra lỗi trong lập luận của bạn, hoặc lộ ra giới hạn của lý thuyết — cái nào cũng đáng một đoạn văn.</li>
<li><strong>Đây là bước biến một bài "qua môn" thành một bài điểm cao.</strong> Phần lớn sinh viên dừng lại khi đã có MỘT lời giải. Điểm dành cho "phản biện" và "đánh giá" trong mọi rubric đều nằm ở bước 3 — ở đúng cái câu nói vì sao các phương án khác tệ hơn và bài này đứng ở đâu so với tài liệu.</li>
<li><strong>Làm nó TRƯỚC khi nộp, đừng làm sau khi nhận điểm.</strong> Hai câu hỏi, năm phút: vì sao cái này tốt nhất, và lý thuyết nói gì về nó. Đó là cái chốt chất lượng rẻ nhất mà mọi bài tập phân tích đều dùng được.</li>
</ul>
<p class="dap-an">✅ Chạy trọn ba bước trên tình huống: <strong>(1) Nhận diện</strong> — đặc điểm: 4/9 story xong, 3 story kẹt vào một module, còn 3 tuần; thiếu: thế nào mới gọi là "bắt kịp"; lăng kính: tam giác sắt. <strong>(2) Nhận diện các lời giải</strong> — cắt phạm vi · chia lại việc · báo lên · thêm người; lý thuyết chọn "cắt phạm vi + chia lại việc"; dữ liệu: velocity 3 story/2 tuần. <strong>(3) Đánh giá</strong> — tốt nhất vì nó bảo vệ các story bị chấm trong điều kiện thời gian và nhân sự cố định; nó XÁC NHẬN tam giác sắt và luật Brooks chứ không mâu thuẫn.</p>
<p class="meo">💡 Nhớ quy trình của Brick là <strong>BA bước, theo thứ tự vấn đề → các lời giải → đánh giá</strong>, và nhớ bước 3 gồm <em>HAI câu hỏi</em>. Đừng lẫn quy trình ba bước này với BỐN bước của Pólya ở slide 25 — deck trình bày cả hai, và đề thi hoàn toàn có thể hỏi cái nào là của ai.</p>`],

      [23, 'Summary: Analytical Problems — a verbatim repeat of slide 19',
        `<p class="y-chinh">🎯 The section's closing slide, and it is <strong>slide 19 reprinted word for word</strong>: ill-defined in some way · cannot be solved using a basic formula or concept · solution path or the goal is undefined or uncertain · the solution may not be obvious and may need to be defined (Brick, 2014).</p>
<ul>
<li><strong>Say what it is: a repeat, not new content.</strong> Nothing was added, nothing reworded. In a review deck that is a deliberate emphasis — of everything in section 2.3, these four lines are what the course wants you to leave with.</li>
<li><strong>Use the repetition as a self-test rather than re-reading it.</strong> Cover the slide and recite: how many characteristics (four), what is the first one (ill-defined in some way), what cannot solve it (a basic formula or concept), what is missing (path or goal), what must be done to the solution (defined). If any of the five comes out slowly, that is where to revise.</li>
<li><strong>Notice what the summary leaves OUT, because that is informative too.</strong> It does not summarise slides 20–22 — Brick's three-step process is not on this slide at all. So the summary is of the <em>nature</em> of analytical problems, not of how to solve them. The process is still examinable; it simply is not repeated.</li>
<li><strong>Hold the whole of sections 2.2–2.3 in one frame before moving on.</strong> Descriptive task = display · descriptive (simple) problem = use · analytical task = judge (8 verbs) · analytical problem = an ill-defined situation solved by Brick's three steps. Four ideas, and the exam can ask you to sort an example into any of them.</li>
<li><strong>At FPTU, this is the checklist for reading an assignment brief.</strong> If the brief has no fixed answer, no formula, an unclear endpoint and requires you to define what "good" means — it is an analytical problem, and it should be planned with steps 1–3 before a single word is written.</li>
</ul>
<p class="meo">💡 The deck has now repeated three slides (11 ≈ 2, 18 = 15, 23 = 19). Treat every repeat as the course underlining the line — those are the highest-probability exam items in the whole block.</p>
<p class="pitfall">⚠️ Because slide 23 copies slide 19, it inherits the wording <em>"may need to be defined"</em>, which differs from slide 7's <em>"may need to be justified"</em>. Two of the three slides say "defined", so if an exam option forces a choice, "defined" is the wording the deck states more often.</p>`,
        `<p class="y-chinh">🎯 Slide đóng mục, và nó là <strong>slide 19 in lại từng chữ</strong>: chưa rõ ràng theo một kiểu nào đó · không giải được bằng công thức hay khái niệm cơ bản · đường giải hoặc đích chưa xác định hoặc không chắc chắn · lời giải có thể không hiển nhiên và có thể phải được ĐỊNH NGHĨA (Brick, 2014).</p>
<ul>
<li><strong>Nói thẳng nó là gì: một bản LẶP, không phải nội dung mới.</strong> Không thêm gì, không sửa chữ nào. Trong một bộ ôn tập thì đó là sự nhấn mạnh có chủ ý — trong cả mục 2.3, bốn dòng này là thứ môn học muốn bạn mang đi.</li>
<li><strong>Hãy dùng sự lặp lại như một bài tự kiểm thay vì đọc lại.</strong> Che slide đi và đọc thuộc: có mấy đặc điểm (bốn), cái đầu tiên là gì (chưa rõ ràng theo một kiểu nào đó), cái gì KHÔNG giải được nó (công thức/khái niệm cơ bản), cái gì đang thiếu (đường hoặc đích), phải làm gì với lời giải (định nghĩa nó). Năm ý đó, ý nào bật ra chậm thì đó là chỗ cần ôn.</li>
<li><strong>Để ý thứ slide tóm tắt BỎ RA, vì nó cũng nói lên điều gì đó.</strong> Nó KHÔNG tóm tắt slide 20–22 — quy trình ba bước của Brick hoàn toàn không có trên slide này. Vậy bản tóm tắt là về BẢN CHẤT của vấn đề phân tích, không phải về cách giải nó. Quy trình vẫn nằm trong phạm vi thi; nó chỉ không được nhắc lại.</li>
<li><strong>Giữ toàn bộ mục 2.2–2.3 trong một khung trước khi đi tiếp.</strong> Nhiệm vụ mô tả = TRƯNG RA · vấn đề mô tả (đơn giản) = DÙNG · nhiệm vụ phân tích = PHÁN XÉT (8 động từ) · vấn đề phân tích = một tình huống chưa rõ ràng, giải bằng ba bước của Brick. Bốn ý, và đề thi có thể bắt bạn xếp một ví dụ vào bất kỳ ý nào.</li>
<li><strong>Ở FPTU, đây là bảng kiểm khi đọc đề bài tập lớn.</strong> Nếu đề không có đáp án cố định, không có công thức, điểm kết thúc mờ, và bắt bạn tự định nghĩa thế nào là "tốt" — thì đó là vấn đề phân tích, và phải lên kế hoạch bằng bước 1–3 trước khi viết một chữ nào.</li>
</ul>
<p class="meo">💡 Tới đây deck đã lặp ba slide (11 ≈ 2, 18 = 15, 23 = 19). Hãy coi mỗi lần lặp là môn học đang gạch chân dòng đó — đó là những câu có xác suất ra thi cao nhất của cả khối.</p>
<p class="pitfall">⚠️ Vì slide 23 chép slide 19, nó thừa hưởng luôn cách viết <em>"phải được ĐỊNH NGHĨA"</em>, khác với <em>"phải được BIỆN MINH"</em> ở slide 7. Hai trong ba slide ghi "định nghĩa", nên nếu đề ép phải chọn, "định nghĩa" là cách viết deck nói nhiều lần hơn.</p>`],

      [24, '2.4a The Problem-Solving Process — objectives, and the number FOUR appears twice',
        `<p class="y-chinh">🎯 Three objectives, and two of them name the same number: <strong>articulate the importance of accurately defining a problem</strong> · <strong>describe the FOUR-STEP process of defining a problem</strong> · <strong>apply and evaluate the four-step process</strong>.</p>
<table>
<tr><th>Objective</th><th>The verb level it demands</th></tr>
<tr><td>Articulate why accurate definition matters</td><td>Understand — explain the reason</td></tr>
<tr><td><strong>Describe</strong> the four-step process</td><td>Recall — name the four steps in order</td></tr>
<tr><td><strong>Apply and evaluate</strong> it</td><td>Use it on a real case, then judge how it went</td></tr>
</table>
<ul>
<li><strong>"Four-step" is stated twice on one slide, which is as loud a hint as a deck can give.</strong> Slide 25 names the four; learn them in order, because "which is step 3 of Pólya's process?" is an easy multiple-choice item to write.</li>
<li><strong>Watch a small wording slip that could cost you a mark.</strong> Bullet 2 calls it "the four-step process of <em>defining</em> a problem", but slide 25 presents Pólya's four steps as the process of <em>solving</em> one — only step 1 is about understanding it. Learn the four steps by their own names, not by this slide's description.</li>
<li><strong>"Articulate the importance of accurately defining a problem" is the thesis of the whole MOOC.</strong> Everything since slide 3 has been building it: a problem is a gap between states, an ill-defined problem hides one end of the gap, and the fix is always to define before you solve. A wrongly defined problem cannot be solved correctly by any amount of effort.</li>
<li><strong>"Apply and evaluate" is the highest verb in this block.</strong> It expects you to run the process on your own situation and then judge the process itself — did it help, where did it fail, what would you change. That is the reflective habit the whole subject is trying to install.</li>
</ul>
<p class="nhan">📐 <strong>Defining accurately, in practice: the SMART goal.</strong> The deck does not use the word SMART in these 25 slides, but "accurately defining" is exactly what it produces, and a SMART goal is what fills the "Goal" box of slide 3. Watch a bad goal become a usable one.</p>
<table>
<tr><th>Version</th><th>Wording</th><th>What was fixed</th></tr>
<tr><td>Bad</td><td>"Get the group back on track."</td><td>—</td></tr>
<tr><td>+ <strong>S</strong>pecific</td><td>"Finish the unfinished SWP391 user stories."</td><td>Names the actual object of work</td></tr>
<tr><td>+ <strong>M</strong>easurable</td><td>"Finish the 7 marked user stories and merge them to main."</td><td>Adds a count and an observable end state</td></tr>
<tr><td>+ <strong>A</strong>chievable</td><td>"…7 stories, given a measured velocity of 3 per 2 weeks and 4 active members."</td><td>Checks the target against real capacity</td></tr>
<tr><td>+ <strong>R</strong>elevant</td><td>"…the 7 that the rubric marks; the 2 nice-to-have stories are formally deferred."</td><td>Ties the target to the mark, drops the rest</td></tr>
<tr><td>+ <strong>T</strong>ime-bound</td><td>"…demoed and signed off by the supervisor at the review on 10 October."</td><td>Gives a deadline and a stopping rule</td></tr>
</table>
<p class="dap-an">✅ Final SMART goal: <em>"By the review on 10 October, the 7 rubric-marked SWP391 user stories are merged to main and demoed to the supervisor, with the 2 nice-to-have stories formally deferred and each member's contribution visible in the git history."</em> Every word of it is checkable — which is exactly what slide 6 meant by "clear when a solution has been found".</p>
<p class="meo">💡 Two processes, two numbers, do not mix them: <strong>Brick = 3 steps</strong> (identify the problem · identify the solutions · evaluate the solution), <strong>Pólya = 4 steps</strong> (slide 25). This slide belongs to Pólya.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu, và hai trong số đó gọi tên cùng một con số: <strong>nói rõ được vì sao ĐỊNH NGHĨA CHÍNH XÁC một vấn đề lại quan trọng</strong> · <strong>mô tả quy trình BỐN BƯỚC để định nghĩa một vấn đề</strong> · <strong>áp dụng và đánh giá quy trình bốn bước đó</strong>.</p>
<table>
<tr><th>Mục tiêu</th><th>Mức động từ nó đòi</th></tr>
<tr><td>Nói rõ vì sao định nghĩa chính xác lại quan trọng</td><td>HIỂU — giải thích được lý do</td></tr>
<tr><td><strong>Mô tả</strong> quy trình bốn bước</td><td>NHỚ — gọi đúng tên bốn bước, đúng thứ tự</td></tr>
<tr><td><strong>Áp dụng và đánh giá</strong> nó</td><td>DÙNG nó trên một ca thật, rồi phán xét kết quả</td></tr>
</table>
<ul>
<li><strong>"Bốn bước" được nêu HAI lần trên một slide, đó là gợi ý to nhất mà một bộ slide có thể đưa ra.</strong> Slide 25 sẽ gọi tên bốn bước đó; hãy thuộc theo ĐÚNG THỨ TỰ, vì "bước 3 trong quy trình của Pólya là gì?" là một câu trắc nghiệm rất dễ ra.</li>
<li><strong>Coi chừng một chỗ chệch chữ nhỏ có thể làm mất điểm.</strong> Gạch 2 gọi nó là "quy trình bốn bước để <em>ĐỊNH NGHĨA</em> một vấn đề", nhưng slide 25 trình bày bốn bước của Pólya như quy trình để <em>GIẢI</em> một vấn đề — chỉ bước 1 là về việc hiểu nó. Hãy thuộc bốn bước bằng chính tên của chúng, đừng thuộc theo mô tả của slide này.</li>
<li><strong>"Nói rõ vì sao định nghĩa chính xác lại quan trọng" là luận điểm của cả MOOC.</strong> Mọi thứ từ slide 3 tới giờ đều đang dựng nó: vấn đề là khoảng cách giữa hai trạng thái, vấn đề chưa rõ ràng thì giấu mất một đầu của khoảng cách đó, và cách sửa luôn là ĐỊNH NGHĨA TRƯỚC KHI GIẢI. Một vấn đề bị định nghĩa sai thì bao nhiêu công sức cũng không giải đúng được.</li>
<li><strong>"Áp dụng và đánh giá" là động từ ở mức cao nhất của cả khối này.</strong> Nó chờ bạn chạy quy trình trên tình huống của chính mình rồi phán xét chính cái quy trình đó — nó có giúp không, nó hỏng ở đâu, bạn sẽ đổi gì. Đó là thói quen phản tư mà cả môn học đang cố cài vào bạn.</li>
</ul>
<p class="nhan">📐 <strong>"Định nghĩa chính xác" trong thực tế: MỤC TIÊU SMART.</strong> Trong 25 slide này deck không dùng chữ SMART, nhưng "định nghĩa chính xác" đúng là thứ nó tạo ra, và một mục tiêu SMART chính là thứ điền vào ô "Goal" của slide 3. Xem một mục tiêu tồi được sửa dần thành dùng được.</p>
<table>
<tr><th>Phiên bản</th><th>Câu chữ</th><th>Đã sửa gì</th></tr>
<tr><td>Tồi</td><td>"Đưa nhóm về lại đúng tiến độ."</td><td>—</td></tr>
<tr><td>+ <strong>S</strong>pecific — cụ thể</td><td>"Hoàn thành các user story SWP391 còn dang dở."</td><td>Gọi tên đúng ĐỐI TƯỢNG công việc</td></tr>
<tr><td>+ <strong>M</strong>easurable — đo được</td><td>"Hoàn thành 7 user story bị chấm và merge vào nhánh main."</td><td>Thêm CON SỐ và một trạng thái kết thúc QUAN SÁT ĐƯỢC</td></tr>
<tr><td>+ <strong>A</strong>chievable — khả thi</td><td>"…7 story, với velocity đo được là 3 story/2 tuần và 4 thành viên còn hoạt động."</td><td>Đối chiếu chỉ tiêu với NĂNG LỰC THẬT</td></tr>
<tr><td>+ <strong>R</strong>elevant — đúng việc</td><td>"…đúng 7 story mà rubric chấm; 2 story 'có thì tốt' được hoãn chính thức."</td><td>Nối chỉ tiêu với ĐIỂM SỐ, bỏ phần còn lại</td></tr>
<tr><td>+ <strong>T</strong>ime-bound — có hạn</td><td>"…demo và được giảng viên nghiệm thu tại buổi review ngày 10/10."</td><td>Cho một HẠN CHÓT và một LUẬT DỪNG</td></tr>
</table>
<p class="dap-an">✅ Mục tiêu SMART cuối cùng: <em>"Trước buổi review ngày 10/10, 7 user story SWP391 nằm trong rubric đã được merge vào main và demo cho giảng viên, 2 story 'có thì tốt' được hoãn chính thức, và đóng góp của từng thành viên nhìn thấy được trong lịch sử git."</em> Từng chữ trong đó đều kiểm được — đúng thứ slide 6 gọi là "rõ khi nào thì đã tìm ra lời giải".</p>
<p class="meo">💡 Hai quy trình, hai con số, đừng trộn: <strong>Brick = 3 bước</strong> (nhận diện vấn đề · nhận diện các lời giải · đánh giá lời giải), <strong>Pólya = 4 bước</strong> (slide 25). Slide này thuộc về Pólya.</p>`],

      [25, 'Pólya’s Four Step Process — Understand · Plan · Carry out · Look back',
        `<p class="y-chinh">🎯 The named process the whole section has been pointing at: <strong>1. Understand the problem · 2. Devise a plan · 3. Carry out the plan · 4. Look back</strong> (Pólya, 1957).</p>
<table>
<tr><th>Step</th><th>The question it answers</th><th>SWP391, run end to end</th></tr>
<tr><td><strong>1. Understand the problem</strong></td><td>What is given, what is sought, what is the condition?</td><td>Given: 4/9 stories done, 3 blocked on one member's module, 3 weeks left, 4 active members, velocity 3 per 2 weeks. Sought: the SMART goal from slide 24. Condition: no scope change without the supervisor.</td></tr>
<tr><td><strong>2. Devise a plan</strong></td><td>Have I seen a related problem? What is the strategy?</td><td>Split the blocked module into two thin slices; reassign them; defer the 2 unmarked stories with written approval; install a 10-minute daily stand-up and a definition of done.</td></tr>
<tr><td><strong>3. Carry out the plan</strong></td><td>Execute, checking each step as you go</td><td>Week 1: slices merged. Week 2: 3 stories demoed internally. Week 3: freeze, regression pass, rehearse the demo. Check the board daily against the plan.</td></tr>
<tr><td><strong>4. Look back</strong></td><td>Is the result right? Could the method be reused?</td><td>7/7 marked stories merged; the root cause (no visibility mechanism) is gone because stand-ups persist; the reusable lesson: measure velocity in sprint 1 and size sprint 2 from it.</td></tr>
</table>
<ul>
<li><strong>Step 1 is a third of the work, and the deck has spent twenty slides preparing you for it.</strong> Pólya's own step 1 asks: what is the unknown, what is the data, what is the condition. That is slide 3's diagram in different words — goal, initial state, constraints.</li>
<li><strong>Step 2's real content is analogy, and it is the same idea as slide 8.</strong> Pólya's central question is "do you know a related problem?" — which is a direct appeal to semantic richness. Building a stock of solved problem <em>types</em> is what makes step 2 fast.</li>
<li><strong>Step 3 is not "just do it"; Pólya insists you check each step as you make it.</strong> Executing without checking is how a group discovers in week 3 that week 1's work does not integrate. The plan tells you what to check against.</li>
<li><strong>Step 4 is the step everybody skips and the only one that compounds.</strong> "Look back" asks two things: is this answer actually right, and can the method be reused. Skipping it means solving the same problem again next semester — for the SWP391 group, it is the difference between surviving one sprint and never repeating the mistake.</li>
<li><strong>Map the two processes onto each other and you have to remember only one shape.</strong> Brick 1 (identify the problem) ↔ Pólya 1. Brick 2 (identify the solutions) ↔ Pólya 2. Pólya 3 (carry out) has no Brick equivalent — Brick is about writing an answer, not executing it. Brick 3 (evaluate) ↔ Pólya 4 (look back).</li>
</ul>
<p class="dap-an">✅ Self-check: which step contains "do you know a related problem?" — <strong>step 2, devise a plan</strong>. Which step asks whether the result is correct and the method reusable — <strong>step 4, look back</strong>. Which is the step most students omit — <strong>step 4</strong>.</p>
<p class="meo">💡 Four steps, four words: <strong>UNDERSTAND · PLAN · DO · REVIEW</strong>, credited to <strong>Pólya, 1957</strong>. Keep the number and the author together — a distractor that offers "Pólya's five-step process" or credits the four steps to Brick is testing exactly that pairing.</p>
<p class="pitfall">⚠️ Two counts, two authors, and the exam can swap them: <strong>Brick (2014) = THREE steps</strong> for analytical problems; <strong>Pólya (1957) = FOUR steps</strong> for problem solving. Also note slide 24 called Pólya's a process of "defining" a problem while Pólya himself covers defining <em>and</em> solving — only step 1 is definition.</p>`,
        `<p class="y-chinh">🎯 Quy trình có tên mà cả mục này nhắm tới: <strong>1. Hiểu vấn đề · 2. Vạch kế hoạch · 3. Thực hiện kế hoạch · 4. Nhìn lại</strong> (Pólya, 1957).</p>
<table>
<tr><th>Bước</th><th>Nó trả lời câu hỏi nào</th><th>SWP391, chạy trọn từ đầu tới cuối</th></tr>
<tr><td><strong>1. Hiểu vấn đề</strong></td><td>Cái gì được cho, cái gì phải tìm, ràng buộc là gì?</td><td>Cho: 4/9 story xong, 3 story kẹt vào module của một bạn, còn 3 tuần, 4 thành viên còn hoạt động, velocity 3 story/2 tuần. Phải tìm: mục tiêu SMART ở slide 24. Ràng buộc: không đổi phạm vi nếu không có giảng viên đồng ý.</td></tr>
<tr><td><strong>2. Vạch kế hoạch</strong></td><td>Mình đã gặp bài nào GIỐNG chưa? Chiến lược là gì?</td><td>Chẻ module đang kẹt thành hai lát mỏng; giao lại cho người khác; hoãn 2 story không bị chấm, có phê duyệt bằng văn bản; cài một stand-up 10 phút mỗi ngày và một "định nghĩa hoàn thành".</td></tr>
<tr><td><strong>3. Thực hiện kế hoạch</strong></td><td>Làm, và KIỂM từng bước ngay khi làm</td><td>Tuần 1: hai lát merge xong. Tuần 2: demo nội bộ 3 story. Tuần 3: đóng băng mã, chạy hồi quy, tập demo. Mỗi ngày đối chiếu bảng việc với kế hoạch.</td></tr>
<tr><td><strong>4. Nhìn lại</strong></td><td>Kết quả có ĐÚNG không? Cách làm có DÙNG LẠI được không?</td><td>7/7 story bị chấm đã merge; nguyên nhân gốc (thiếu cơ chế hiện hình tiến độ) đã mất vì stand-up được giữ lại; bài học dùng lại được: đo velocity ở sprint 1 rồi mới ước lượng sprint 2 theo nó.</td></tr>
</table>
<ul>
<li><strong>Bước 1 chiếm một phần ba công việc, và deck đã dành hai mươi slide chuẩn bị cho bạn làm nó.</strong> Bước 1 của chính Pólya hỏi: ẩn số là gì, dữ kiện là gì, điều kiện là gì. Đó chính là sơ đồ ở slide 3 nói bằng chữ khác — đích, trạng thái ban đầu, ràng buộc.</li>
<li><strong>Nội dung thật của bước 2 là PHÉP TƯƠNG TỰ, và nó trùng ý với slide 8.</strong> Câu hỏi trung tâm của Pólya là "bạn có biết một bài nào liên quan không?" — đó là lời kêu gọi thẳng vào độ giàu ngữ nghĩa. Tích một kho các <em>DẠNG</em> bài đã giải là thứ làm bước 2 diễn ra nhanh.</li>
<li><strong>Bước 3 không phải "cứ làm đi"; Pólya nhấn mạnh phải KIỂM từng bước ngay khi thực hiện.</strong> Làm mà không kiểm chính là cách một nhóm tới tuần 3 mới phát hiện phần việc tuần 1 không ráp được vào đâu. Bản kế hoạch cho bạn thứ để đối chiếu.</li>
<li><strong>Bước 4 là bước ai cũng bỏ và là bước duy nhất sinh LÃI KÉP.</strong> "Nhìn lại" hỏi hai điều: câu trả lời này có thật sự đúng không, và cách làm có tái sử dụng được không. Bỏ nó nghĩa là kỳ sau lại giải đúng bài đó — với nhóm SWP391, nó là khác biệt giữa "sống sót một sprint" và "không bao giờ lặp lại sai lầm".</li>
<li><strong>Ánh xạ hai quy trình vào nhau thì bạn chỉ phải nhớ MỘT hình dạng.</strong> Brick 1 (nhận diện vấn đề) ↔ Pólya 1. Brick 2 (nhận diện các lời giải) ↔ Pólya 2. Pólya 3 (thực hiện) KHÔNG có cái tương ứng ở Brick — Brick nói về việc VIẾT một câu trả lời, không nói về thi công. Brick 3 (đánh giá) ↔ Pólya 4 (nhìn lại).</li>
</ul>
<p class="dap-an">✅ Tự kiểm: bước nào chứa câu "bạn có biết một bài nào liên quan không?" — <strong>bước 2, vạch kế hoạch</strong>. Bước nào hỏi kết quả có đúng không và cách làm có dùng lại được không — <strong>bước 4, nhìn lại</strong>. Bước nào sinh viên hay bỏ nhất — <strong>bước 4</strong>.</p>
<p class="meo">💡 Bốn bước, bốn chữ: <strong>HIỂU · LÊN KẾ HOẠCH · LÀM · NHÌN LẠI</strong>, của <strong>Pólya, 1957</strong>. Giữ con số đi liền với tác giả — một mồi nhử kiểu "quy trình NĂM bước của Pólya" hoặc gán bốn bước cho Brick là đang kiểm đúng cặp đó.</p>
<p class="pitfall">⚠️ Hai con số, hai tác giả, và đề thi có thể tráo: <strong>Brick (2014) = BA bước</strong> cho vấn đề phân tích; <strong>Pólya (1957) = BỐN bước</strong> cho giải quyết vấn đề. Cũng lưu ý slide 24 gọi quy trình của Pólya là quy trình "định nghĩa" một vấn đề, trong khi bản thân Pólya bao cả định nghĩa <em>lẫn</em> giải — chỉ bước 1 là phần định nghĩa.</p>`],
    ]),
  ].join('\n'),
};
