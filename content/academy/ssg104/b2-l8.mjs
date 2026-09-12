/**
 * Buổi 2 · Bài 8 — Critical Thinking Skills (24 slide).
 *
 * Bám bộ slide "Session 2_..._Lesson 8_Critical Thinking Skills.pptx".
 * Cặp đôi với Bài 5–6: sáng tạo SINH ra phương án, phản biện PHÁN XÉT chúng.
 * Bản Academy cũ chỉ có đúng một mệnh đề "critical thinking (đánh giá trung
 * thực)" — không có sáu câu hỏi logic, không có bảng IS/IS NOT, không có
 * checklist giải quyết vấn đề.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's2-l8';

export const b2l8 = [
  walkHead(D, 1, 24,
    'The six questions of logic (slide 9) and the IS / IS NOT table (slide 6) are the two things to memorise; the problem-solving checklist (slide 12) is the one to keep beside you during the project.',
    'Sáu câu hỏi logic (slide 9) và bảng LÀ / KHÔNG PHẢI (slide 6) là hai thứ cần thuộc; bảng kiểm giải quyết vấn đề (slide 12) là thứ nên để cạnh mình khi làm dự án.'),

  slide(D, 1, 'Thinking and Analysis (cont.)',
    `<p class="y-chinh">🎯 Title slide — final lesson of Session II.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề — bài cuối của Buổi II.</p>`),

  slide(D, 2, 'Chapter outlines — critical thinking skills',
    `<p class="y-chinh">🎯 One topic in this deck: critical thinking.</p>
     <p class="meo">💡 Session II's arc in one line: think in levels (Bloom) → generate (creative) → propose (proposal) → judge (critical).</p>`,
    `<p class="y-chinh">🎯 Một chủ đề duy nhất trong bộ này: tư duy phản biện.</p>
     <p class="meo">💡 Mạch của Buổi II gói trong một dòng: tư duy theo bậc (Bloom) → sinh ý (sáng tạo) → đề xuất (proposal) → phán xét (phản biện).</p>`),

  slide(D, 3, 'Opening quotation',
    `<p class="y-chinh">🎯 "The essence of the independent mind lies not in what it thinks, but in <em>how</em> it thinks." — Christopher Hitchens.</p>
     <p class="meo">💡 The whole lesson is in that emphasis: critical thinking is a method, not a set of opinions.</p>`,
    `<p class="y-chinh">🎯 "Cốt lõi của một trí óc độc lập không nằm ở việc nó nghĩ gì, mà ở việc nó nghĩ <em>như thế nào</em>." — Christopher Hitchens.</p>
     <p class="meo">💡 Cả bài nằm trong chỗ nhấn mạnh đó: tư duy phản biện là một phương pháp, không phải một tập hợp quan điểm.</p>`),

  slide(D, 4, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives.</p>
     <ol>
       <li>Define critical thinking.</li>
       <li>Describe the role logic plays in critical thinking.</li>
       <li>Describe how critical thinking skills can be used to <strong>problem-solve</strong>.</li>
       <li>Describe how they can be used to <strong>evaluate information</strong>.</li>
       <li>Identify strategies for developing yourself as a critical thinker.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm mục tiêu.</p>
     <ol>
       <li>Định nghĩa tư duy phản biện.</li>
       <li>Mô tả vai trò của logic trong tư duy phản biện.</li>
       <li>Mô tả cách dùng tư duy phản biện để <strong>giải quyết vấn đề</strong>.</li>
       <li>Mô tả cách dùng nó để <strong>đánh giá thông tin</strong>.</li>
       <li>Chỉ ra các chiến lược tự rèn mình thành người tư duy phản biện.</li>
     </ol>`),

  slide(D, 5, 'What is critical thinking?',
    `<p class="y-chinh">🎯 The definition, word for word.</p>
     <p>Critical thinking is <strong>clear, reasonable, reflective thinking focused on deciding what to believe or do</strong>.</p>
     <ul>
       <li>It involves being sceptical and challenging assumptions — rather than memorising facts or blindly accepting what you hear or read.</li>
       <li>It asks probing questions: "How do we know?" · "Is this true in every case or just in this instance?"</li>
     </ul>
     <p class="meo">💡 Note the purpose clause: "deciding what to believe <em>or do</em>". Critical thinking that never changes a decision is just commentary.</p>`,
    `<p class="y-chinh">🎯 Định nghĩa, nguyên văn.</p>
     <p>Tư duy phản biện là <strong>lối nghĩ rõ ràng, hợp lý, có suy xét, hướng tới việc quyết định nên tin gì hoặc làm gì</strong>.</p>
     <ul>
       <li>Nó bao gồm việc hoài nghi và chất vấn các giả định — thay vì học thuộc dữ kiện hay nhắm mắt chấp nhận điều nghe được, đọc được.</li>
       <li>Nó đặt những câu hỏi truy xét: "Làm sao ta biết?" · "Điều này đúng trong mọi trường hợp hay chỉ đúng ở ca này?"</li>
     </ul>
     <p class="meo">💡 Để ý mệnh đề mục đích: "quyết định nên tin gì <em>hoặc làm gì</em>". Tư duy phản biện mà không bao giờ làm đổi một quyết định nào thì chỉ là bình luận.</p>`),

  slide(D, 6, 'Critical thinking IS / IS NOT',
    `<p class="y-chinh">🎯 A four-by-three contrast table — the fastest revision card in this lesson.</p>
     <p><span class="nhan">IS</span></p>
     <ul>
       <li>Scepticism</li>
       <li>Examining assumptions</li>
       <li>Challenging reasoning</li>
       <li>Uncovering biases</li>
     </ul>
     <p><span class="nhan">IS NOT</span></p>
     <ul>
       <li>Memorising</li>
       <li><strong>Group thinking</strong></li>
       <li>Blind acceptance of authority</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Nối với Bài 3:</strong> "group thinking" here is the groupthink of Lesson 3 slide 17. This subject teaches you to work in groups <em>and</em> warns you that agreement is not evidence.</p>`,
    `<p class="y-chinh">🎯 Bảng đối chiếu bốn-ba — tấm thẻ ôn nhanh nhất của bài này.</p>
     <p><span class="nhan">LÀ</span></p>
     <ul>
       <li>Hoài nghi</li>
       <li>Xem xét các giả định</li>
       <li>Chất vấn lập luận</li>
       <li>Phơi bày thiên kiến</li>
     </ul>
     <p><span class="nhan">KHÔNG PHẢI</span></p>
     <ul>
       <li>Học thuộc</li>
       <li><strong>Nghĩ theo đám đông</strong></li>
       <li>Chấp nhận mù quáng quyền uy</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Nối với Bài 3:</strong> "nghĩ theo đám đông" ở đây chính là groupthink ở slide 17 Bài 3. Môn này vừa dạy bạn làm việc nhóm <em>vừa</em> cảnh báo rằng sự đồng thuận không phải bằng chứng.</p>`),

  slide(D, 7, 'Activity — self-assess your critical thinking strategies',
    `<p class="y-chinh">🎯 A graded activity with a pass mark.</p>
     <ul>
       <li><span class="nhan">Tool</span> — the Quia Critical Thinking Quiz (click Start Now, no name needed).</li>
       <li><span class="nhan">Pass</span> — 70% or better is considered passing.</li>
       <li><span class="nhan">Reflection</span> — do you use good critical thinking strategies in college, and how might you improve?</li>
     </ul>
     <p class="meo">💡 The reflection is the graded part, not the score. Write two concrete habits you will change, not a general promise.</p>`,
    `<p class="y-chinh">🎯 Hoạt động tính điểm, có ngưỡng đạt.</p>
     <ul>
       <li><span class="nhan">Công cụ</span> — bài Quia Critical Thinking Quiz (bấm Start Now, không cần nhập tên).</li>
       <li><span class="nhan">Đạt</span> — từ 70% trở lên được coi là đạt.</li>
       <li><span class="nhan">Phần suy ngẫm</span> — bạn có đang dùng chiến lược tư duy phản biện tốt ở đại học không, và có thể cải thiện thế nào?</li>
     </ul>
     <p class="meo">💡 Phần suy ngẫm mới là phần được chấm, không phải điểm số. Hãy viết hai thói quen cụ thể bạn sẽ thay đổi, đừng hứa chung chung.</p>`),

  slide(D, 8, 'Critical thinking and logic',
    `<p class="y-chinh">🎯 Critical thinking is fundamentally a <strong>process of questioning information and data</strong>.</p>
     <ul>
       <li>You may question a textbook, a politician, a professor, a classmate.</li>
       <li>You may question a commonly held belief or a brand-new idea.</li>
       <li>Anything and everything is subject to question and examination — for the purpose of <em>logically constructing reasoned perspectives</em>.</li>
     </ul>
     <p class="meo">💡 The purpose clause matters again: questioning is not the destination. You question in order to build a position you can defend.</p>`,
    `<p class="y-chinh">🎯 Tư duy phản biện về bản chất là <strong>quá trình chất vấn thông tin và dữ liệu</strong>.</p>
     <ul>
       <li>Bạn có thể chất vấn một cuốn giáo trình, một chính trị gia, một giảng viên, một bạn cùng lớp.</li>
       <li>Bạn có thể chất vấn một niềm tin phổ biến hay một ý tưởng mới toanh.</li>
       <li>Mọi thứ đều có thể bị đặt câu hỏi và soi xét — nhằm mục đích <em>dựng nên những góc nhìn có lý lẽ một cách logic</em>.</li>
     </ul>
     <p class="meo">💡 Mệnh đề mục đích lại quan trọng: chất vấn không phải đích đến. Bạn chất vấn để dựng được một lập trường bảo vệ được.</p>`),

  slide(D, 9, 'What is logic, and why does it matter?',
    `<p class="y-chinh">🎯 Definition and use.</p>
     <ul>
       <li>"Logic" comes from Ancient Greek <em>logike</em> — the science or art of reasoning.</li>
       <li>Using logic a person evaluates arguments and reasoning, and strives to distinguish good from bad reasoning, truth from falsehood.</li>
       <li>With it you can evaluate claims, make good decisions, and form sound beliefs about the world.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Định nghĩa và công dụng.</p>
     <ul>
       <li>"Logic" đến từ tiếng Hy Lạp cổ <em>logike</em> — khoa học hoặc nghệ thuật lập luận.</li>
       <li>Dùng logic, người ta đánh giá lập luận và cố phân biệt lập luận tốt với lập luận tồi, sự thật với điều sai.</li>
       <li>Nhờ nó bạn đánh giá được các khẳng định, ra quyết định tốt, và hình thành niềm tin vững về thế giới.</li>
     </ul>`),

  slide(D, 10, 'The six questions of logic in critical thinking',
    `<p class="y-chinh">🎯 Six questions, in order. This is the most portable tool in the lesson.</p>
     <ol>
       <li><span class="nhan">What's happening?</span> Gather the basic information and start forming questions.</li>
       <li><span class="nhan">Why is it important?</span> Ask why it is significant and whether you agree.</li>
       <li><span class="nhan">What don't I see?</span> Is anything important missing?</li>
       <li><span class="nhan">How do I know?</span> Where did the information come from and how was it constructed?</li>
       <li><span class="nhan">Who is saying it?</span> What is the speaker's position and what influences them?</li>
       <li><span class="nhan">What else? What if?</span> What other ideas and possibilities exist?</li>
     </ol>
     <p class="meo">💡 Questions 3 and 4 are the ones people skip, and they are the two that catch the hidden-profile trap from Lesson 3 slide 16.</p>`,
    `<p class="y-chinh">🎯 Sáu câu hỏi, theo thứ tự. Đây là công cụ dễ mang theo nhất của bài.</p>
     <ol>
       <li><span class="nhan">Chuyện gì đang xảy ra?</span> Thu thập thông tin cơ bản và bắt đầu đặt câu hỏi.</li>
       <li><span class="nhan">Vì sao nó quan trọng?</span> Tự hỏi nó có ý nghĩa gì và mình có đồng ý không.</li>
       <li><span class="nhan">Mình chưa nhìn thấy gì?</span> Có gì quan trọng đang thiếu không?</li>
       <li><span class="nhan">Làm sao mình biết?</span> Thông tin này từ đâu ra và được dựng lên thế nào?</li>
       <li><span class="nhan">Ai đang nói điều đó?</span> Vị thế của người nói là gì và điều gì chi phối họ?</li>
       <li><span class="nhan">Còn gì nữa? Nếu như…?</span> Còn ý tưởng và khả năng nào khác?</li>
     </ol>
     <p class="meo">💡 Câu 3 và 4 là hai câu người ta hay bỏ qua, và đúng là hai câu bắt được cái bẫy hồ sơ ẩn ở slide 16 Bài 3.</p>`),

  slide(D, 11, 'Problem-solving with critical thinking',
    `<p class="y-chinh">🎯 Critical thinking and problem-solving go hand in hand: using <strong>knowledge, facts and data</strong> to solve problems effectively.</p>
     <p class="meo">💡 Compare with Lesson 5–6 slide 33: creative problem-solving invents options, critical problem-solving chooses between them on evidence. Your project needs both, in that order.</p>`,
    `<p class="y-chinh">🎯 Tư duy phản biện và giải quyết vấn đề đi liền nhau: dùng <strong>kiến thức, dữ kiện và dữ liệu</strong> để giải quyết vấn đề một cách hiệu quả.</p>
     <p class="meo">💡 So với slide 33 Bài 5–6: giải quyết vấn đề sáng tạo đẻ ra phương án, giải quyết vấn đề phản biện chọn giữa chúng dựa trên bằng chứng. Dự án của bạn cần cả hai, theo đúng thứ tự đó.</p>`),

  slide(D, 12, 'Three examples of critical thinking to solve a problem',
    `<p class="y-chinh">🎯 The deck's own three cases, and each shows a different move.</p>
     <ul>
       <li><span class="nhan">A classmate says unkind words</span> — you look <em>through</em> the angry behaviour to work out how best to support them and repair the relationship. Move: separate behaviour from cause.</li>
       <li><span class="nhan">A campus club is languishing</span> — the new president, a marketing major, identifies strategies to attract members. Move: bring in expertise from another domain.</li>
       <li><span class="nhan">A maths class is not grasping a concept</span> — the teacher uses clever questioning to dispel anxiety and guide students to understanding. Move: diagnose before explaining again.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Ba tình huống ngay trên slide, mỗi cái cho thấy một nước đi khác nhau.</p>
     <ul>
       <li><span class="nhan">Bạn cùng lớp buông lời khó nghe</span> — bạn nhìn <em>xuyên qua</em> hành vi giận dữ để tìm cách hỗ trợ họ và hàn gắn quan hệ. Nước đi: tách hành vi khỏi nguyên nhân.</li>
       <li><span class="nhan">Câu lạc bộ trong trường đang lụi dần</span> — chủ nhiệm mới, sinh viên ngành marketing, tìm ra cách thu hút thành viên. Nước đi: mang chuyên môn từ lĩnh vực khác vào.</li>
       <li><span class="nhan">Lớp toán không nắm được một khái niệm</span> — cô giáo dùng cách hỏi khéo để xua lo lắng và dẫn sinh viên tới chỗ hiểu. Nước đi: chẩn đoán trước khi giảng lại.</li>
     </ul>`),

  slide(D, 13, 'Problem-solving action checklist',
    `<p class="y-chinh">🎯 Three strategies, each with its own actions. Keep this beside your project notes.</p>
     <p><span class="nhan">1. Define the problem</span></p>
     <ul>
       <li>Identify the problem · provide as many supporting details as possible · provide examples · organise the information logically.</li>
     </ul>
     <p><span class="nhan">2. Identify available solutions</span></p>
     <ul>
       <li>Use logic to identify your most important goals · identify implications and consequences · identify facts · compare and contrast possible solutions.</li>
     </ul>
     <p><span class="nhan">3. Select your solution</span></p>
     <ul>
       <li>Use gathered facts and relevant evidence · support and defend solutions considered valid · defend your solution.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy quen thuộc:</strong> groups jump to step 3 in the first ten minutes. The step that decides quality is step 1 — a problem stated vaguely can be "solved" by anything.</p>`,
    `<p class="y-chinh">🎯 Ba chiến lược, mỗi cái kèm hành động cụ thể. Hãy để bảng này cạnh sổ ghi dự án.</p>
     <p><span class="nhan">1. Xác định vấn đề</span></p>
     <ul>
       <li>Gọi tên vấn đề · đưa càng nhiều chi tiết chống lưng càng tốt · đưa ví dụ · sắp xếp thông tin theo trật tự logic.</li>
     </ul>
     <p><span class="nhan">2. Tìm các phương án sẵn có</span></p>
     <ul>
       <li>Dùng logic xác định mục tiêu quan trọng nhất · nêu hệ quả và hệ luỵ · xác định dữ kiện · so sánh, đối chiếu các phương án.</li>
     </ul>
     <p><span class="nhan">3. Chọn phương án</span></p>
     <ul>
       <li>Dùng dữ kiện đã thu thập và bằng chứng liên quan · ủng hộ và bảo vệ những phương án được coi là hợp lệ · bảo vệ lựa chọn của bạn.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy quen thuộc:</strong> nhóm nhảy thẳng tới bước 3 trong mười phút đầu. Bước quyết định chất lượng là bước 1 — một vấn đề phát biểu mơ hồ thì cái gì cũng "giải" được nó.</p>`),

  slide(D, 14, 'Evaluating information with critical thinking — four strategies',
    `<p class="y-chinh">🎯 Evaluating information is one of the most complex tasks; four strategies make it tractable.</p>
     <ol>
       <li>Read for understanding by using <strong>text coding</strong>.</li>
       <li><strong>Examine arguments</strong>.</li>
       <li><strong>Clarify thinking</strong>.</li>
       <li>Cultivate <strong>"habits of mind"</strong>.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Đánh giá thông tin là một trong những việc phức tạp nhất; bốn chiến lược làm nó khả thi.</p>
     <ol>
       <li>Đọc để hiểu bằng <strong>mã hoá văn bản (text coding)</strong>.</li>
       <li><strong>Soi xét lập luận</strong>.</li>
       <li><strong>Làm rõ suy nghĩ</strong>.</li>
       <li>Nuôi dưỡng <strong>"thói quen của trí óc"</strong>.</li>
     </ol>`),

  slide(D, 15, 'A. Read for understanding using text coding',
    `<p class="y-chinh">🎯 Text coding is a way of <strong>tracking your thinking while reading</strong>.</p>
     <p>With text coding you mark important arguments and key facts as you go.</p>
     <p class="meo">💡 A simple working scheme: ✓ I already knew this · ! surprising · ? I do not follow · ★ use this in the proposal. The point is not the symbols, it is that you must decide something about every paragraph.</p>`,
    `<p class="y-chinh">🎯 Mã hoá văn bản là cách <strong>theo dấu suy nghĩ của chính mình trong lúc đọc</strong>.</p>
     <p>Khi mã hoá, bạn đánh dấu ngay các lập luận quan trọng và dữ kiện then chốt.</p>
     <p class="meo">💡 Một bộ ký hiệu đơn giản dùng được: ✓ điều này mình đã biết · ! bất ngờ · ? chưa hiểu · ★ dùng cho bản đề xuất. Điểm mấu chốt không nằm ở ký hiệu, mà ở chỗ bạn buộc phải quyết định điều gì đó với mỗi đoạn văn.</p>`),

  slide(D, 16, 'B. Examine arguments — the spectrum of authority',
    `<p class="y-chinh">🎯 Use the <strong>spectrum of authority</strong> strategy to weigh a source.</p>
     <p><span class="nhan">What the spectrum asks</span> — how close is this source to the evidence? A researcher who ran the study, a journalist reporting it, and a stranger summarising the journalist are not interchangeable.</p>
     <p class="meo">💡 Connects to question 5 of slide 10 ("Who is saying it?"). Authority is not a yes/no property; it is a distance.</p>`,
    `<p class="y-chinh">🎯 Dùng chiến lược <strong>phổ quyền uy (spectrum of authority)</strong> để cân một nguồn tin.</p>
     <p><span class="nhan">Phổ ấy hỏi gì</span> — nguồn này ở gần bằng chứng tới đâu? Nhà nghiên cứu trực tiếp làm thí nghiệm, nhà báo tường thuật lại, và một người lạ tóm tắt bài báo là ba thứ không thay thế cho nhau được.</p>
     <p class="meo">💡 Nối với câu 5 ở slide 10 ("Ai đang nói điều đó?"). Quyền uy không phải thuộc tính có/không; nó là một khoảng cách.</p>`),

  slide(D, 17, 'C. Clarify thinking (part 1)',
    `<p class="y-chinh">🎯 Four questions to make your own reasoning visible — to yourself and to others.</p>
     <ul>
       <li>What is the purpose?</li>
       <li>What question are we trying to answer?</li>
       <li>What point of view is being expressed?</li>
       <li>What assumptions are we — or others — making?</li>
     </ul>
     <p class="meo">💡 Ask the second one out loud in any stuck meeting. Half of stuck meetings are two people answering different questions.</p>`,
    `<p class="y-chinh">🎯 Bốn câu hỏi làm lập luận của chính bạn hiện rõ — với bản thân và với người khác.</p>
     <ul>
       <li>Mục đích là gì?</li>
       <li>Chúng ta đang cố trả lời câu hỏi nào?</li>
       <li>Góc nhìn nào đang được trình bày?</li>
       <li>Chúng ta — hoặc người khác — đang giả định những gì?</li>
     </ul>
     <p class="meo">💡 Hãy hỏi to câu thứ hai trong bất kỳ cuộc họp nào đang tắc. Một nửa số cuộc họp tắc là do hai người đang trả lời hai câu hỏi khác nhau.</p>`),

  slide(D, 18, 'C. Clarify thinking (part 2)',
    `<p class="y-chinh">🎯 Four more clarifying questions.</p>
     <ul>
       <li>What are the facts and data we know, and <em>how</em> do we know them?</li>
       <li>What are the concepts we are working with?</li>
       <li>What are the conclusions, and do they make sense?</li>
       <li>What are the implications?</li>
     </ul>
     <p class="meo">💡 "What are the concepts we are working with" is the one that prevents a group arguing for an hour over a word both sides define differently.</p>`,
    `<p class="y-chinh">🎯 Bốn câu làm rõ nữa.</p>
     <ul>
       <li>Ta biết những dữ kiện và dữ liệu nào, và <em>bằng cách nào</em> ta biết chúng?</li>
       <li>Ta đang làm việc với những khái niệm nào?</li>
       <li>Kết luận là gì, và chúng có hợp lý không?</li>
       <li>Hệ luỵ là gì?</li>
     </ul>
     <p class="meo">💡 Câu "ta đang làm việc với những khái niệm nào" chính là câu ngăn một nhóm cãi nhau cả tiếng về một từ mà hai bên định nghĩa khác nhau.</p>`),

  slide(D, 19, 'D. Cultivate "habits of mind"',
    `<p class="y-chinh">🎯 "Habits of mind" are the personal commitments, values and standards you hold about the principle of good thinking.</p>
     <p>The slide asks directly: do you approach problems with an open mind, a respect for truth, and an inquiring attitude?</p>
     <p class="meo">💡 This is the affective domain from Lesson 5–6 slide 7 — what you should <em>care about</em>. It is graded through participation and activities, not through the written exam.</p>`,
    `<p class="y-chinh">🎯 "Thói quen của trí óc" là những cam kết, giá trị và chuẩn mực cá nhân bạn giữ về nguyên tắc tư duy đúng đắn.</p>
     <p>Slide hỏi thẳng: bạn tiếp cận vấn đề với đầu óc cởi mở, với sự tôn trọng sự thật và thái độ ham tìm hiểu không?</p>
     <p class="meo">💡 Đây chính là miền thái độ ở slide 7 Bài 5–6 — thứ bạn phải <em>quan tâm</em>. Nó được chấm qua participation và activity, chứ không qua bài thi viết.</p>`),

  slide(D, 20, 'Habits to work into daily life (part 1)',
    `<p class="y-chinh">🎯 Four qualities.</p>
     <ul>
       <li>Being receptive to having your opinions changed.</li>
       <li>Having respect for others.</li>
       <li>Being independent.</li>
       <li>Not accepting something as true until you have had time to examine the available evidence.</li>
     </ul>
     <p class="meo">💡 The first one is the hardest to practise in a group, because changing your mind in public looks like losing. Naming that cost is part of doing it anyway.</p>`,
    `<p class="y-chinh">🎯 Bốn phẩm chất.</p>
     <ul>
       <li>Sẵn lòng để quan điểm của mình bị thay đổi.</li>
       <li>Tôn trọng người khác.</li>
       <li>Độc lập.</li>
       <li>Chưa nhận điều gì là đúng cho tới khi có thời gian xem xét bằng chứng hiện có.</li>
     </ul>
     <p class="meo">💡 Điều đầu tiên khó luyện nhất khi ở trong nhóm, vì đổi ý trước mặt mọi người trông như thua cuộc. Gọi tên cái giá đó là một phần của việc vẫn cứ làm.</p>`),

  slide(D, 21, 'Habits to work into daily life (part 2)',
    `<p class="y-chinh">🎯 Five more.</p>
     <ul>
       <li>Being fair-minded.</li>
       <li>Having respect for a reason.</li>
       <li>Having an inquiring mind.</li>
       <li>Not making assumptions.</li>
       <li><strong>Questioning your own conclusions.</strong></li>
     </ul>
     <p class="meo">💡 The last one is the test of the whole lesson: applying scepticism outward is easy, applying it to your own conclusion is the skill.</p>`,
    `<p class="y-chinh">🎯 Năm phẩm chất nữa.</p>
     <ul>
       <li>Công tâm.</li>
       <li>Tôn trọng lý lẽ.</li>
       <li>Giữ đầu óc ham hỏi.</li>
       <li>Không đặt giả định bừa.</li>
       <li><strong>Chất vấn chính kết luận của mình.</strong></li>
     </ul>
     <p class="meo">💡 Cái cuối là phép thử của cả bài: hoài nghi hướng ra ngoài thì dễ, hoài nghi chính kết luận của mình mới là kỹ năng.</p>`),

  slide(D, 22, 'Developing yourself as a critical thinker',
    `<p class="y-chinh">🎯 Six practices.</p>
     <ul>
       <li>Reflect and practise.</li>
       <li>Use wasted time.</li>
       <li>Redefine the way you see things.</li>
       <li>Analyse the influences on your thinking and in your life.</li>
       <li>Express yourself.</li>
       <li>Enhance your wellness.</li>
     </ul>
     <p class="meo">💡 "Express yourself" is not decoration: a thought you have never had to state is a thought you have never had to defend.</p>`,
    `<p class="y-chinh">🎯 Sáu cách rèn.</p>
     <ul>
       <li>Suy ngẫm và luyện tập.</li>
       <li>Tận dụng thời gian chết.</li>
       <li>Định nghĩa lại cách bạn nhìn sự vật.</li>
       <li>Phân tích những thứ đang chi phối suy nghĩ và cuộc sống của bạn.</li>
       <li>Thể hiện bản thân.</li>
       <li>Chăm sóc sức khoẻ thể chất, tinh thần.</li>
     </ul>
     <p class="meo">💡 "Thể hiện bản thân" không phải lời trang trí: một ý nghĩ chưa bao giờ phải nói ra là ý nghĩ chưa bao giờ phải tự bảo vệ.</p>`),

  slide(D, 23, 'Practice — evaluate the other groups\' social initiative ideas',
    `<p class="y-chinh">🎯 The closing activity, and it deliberately turns the lesson on your classmates' work.</p>
     <ul>
       <li>Use critical thinking skills to challenge other groups' social initiative ideas (from the activity in Lesson 5–6).</li>
       <li>Point out weaknesses and difficulties in implementing the ideas in real life.</li>
     </ul>
     <p class="meo">💡 Do it with slide 10's six questions, especially "What don't I see?" and "How do I know?". Challenge the reasoning, never the person — "respect for others" is on the habits list you just read.</p>`,
    `<p class="y-chinh">🎯 Hoạt động khép lại, và nó cố ý hướng bài học vào chính sản phẩm của các nhóm bạn.</p>
     <ul>
       <li>Dùng kỹ năng tư duy phản biện để chất vấn ý tưởng sáng kiến xã hội của các nhóm khác (từ hoạt động ở Bài 5–6).</li>
       <li>Chỉ ra điểm yếu và những khó khăn khi triển khai ý tưởng đó vào đời thực.</li>
     </ul>
     <p class="meo">💡 Hãy làm bằng sáu câu hỏi ở slide 10, nhất là "Mình chưa nhìn thấy gì?" và "Làm sao mình biết?". Chất vấn lập luận, đừng chất vấn con người — "tôn trọng người khác" nằm ngay trong danh sách thói quen bạn vừa đọc.</p>`),

  slide(D, 24, 'End of Session II',
    `<p class="y-chinh">🎯 Session II complete.</p>
     <ol>
       <li>Bloom gives you six levels of thinking (Lesson 5–6).</li>
       <li>Creative thinking generates options, and structure helps it (Lesson 5–6).</li>
       <li>A proposal has ten sections and three appeals (Lesson 7).</li>
       <li>Critical thinking judges what creativity produced, using six questions and a three-step checklist (this lesson).</li>
     </ol>`,
    `<p class="y-chinh">🎯 Buổi II hoàn tất.</p>
     <ol>
       <li>Bloom cho bạn sáu bậc tư duy (Bài 5–6).</li>
       <li>Tư duy sáng tạo sinh ra phương án, và cấu trúc giúp nó (Bài 5–6).</li>
       <li>Một đề xuất có mười mục và ba phương thức thuyết phục (Bài 7).</li>
       <li>Tư duy phản biện phán xét thứ sáng tạo vừa đẻ ra, bằng sáu câu hỏi và bảng kiểm ba bước (bài này).</li>
     </ol>`),

  books([
    ['lumen', 'chương Critical Thinking Skills', 'chương Critical Thinking Skills'],
    ['piercy', 'chương về đánh giá lập luận trong nhóm', 'chương về đánh giá lập luận trong nhóm'],
  ]),

  bi(
    `<h3>✅ What the old course was missing here</h3>
     <p>Critical thinking used to appear in this Academy course as four words inside one sentence. The six questions of logic, the IS / IS NOT contrast, the problem-solving checklist and the four information-evaluation strategies were all absent.</p>`,
    `<h3>✅ Khoá cũ thiếu gì ở chỗ này</h3>
     <p>Tư duy phản biện trước đây xuất hiện trong khoá học này đúng bằng bốn chữ nằm trong một câu. Sáu câu hỏi logic, bảng đối chiếu LÀ / KHÔNG PHẢI, bảng kiểm giải quyết vấn đề và bốn chiến lược đánh giá thông tin đều không có.</p>`),
].join('\n');
