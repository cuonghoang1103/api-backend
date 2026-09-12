/**
 * Buổi 2 · Bài 5–6 — Patterns of Thought & Creative Thinking (36 slide).
 *
 * Bám bộ slide "Session 2_Thinking _ Analysis_Lesson 5 _ 6_...". Chứa Bloom's
 * taxonomy (CQ4.3 của syllabus) và quy tắc brainstorming (CQ4.4) — hai thứ bản
 * Academy cũ có 0 lần nhắc: chữ "Bloom" xuất hiện 0 lần, brainstorming chỉ là
 * một mệnh đề phụ trong một câu.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's2-l5-6';

export const b2l56 = [
  walkHead(D, 1, 36,
    'Two lessons in one deck. Bloom\'s six levels (slides 9–11) are the part that shows up in exam questions; the brainstorming technique (slide 36) is the part you will actually use in the group project.',
    'Hai bài trong một bộ slide. Sáu bậc Bloom (slide 9–11) là phần hay vào đề; kỹ thuật brainstorming (slide 36) là phần bạn thật sự dùng trong dự án nhóm.'),

  slide(D, 1, 'Thinking and Analysis',
    `<p class="y-chinh">🎯 Title slide for Session II.</p>
     <p>Session II has four lessons: patterns of thought, creative thinking, the business proposal, and critical thinking.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề Buổi II.</p>
     <p>Buổi II có bốn bài: lối tư duy, tư duy sáng tạo, đề xuất kinh doanh, và tư duy phản biện.</p>`),

  slide(D, 2, 'Chapter outlines',
    `<p class="y-chinh">🎯 Two topics in this deck: 1. Patterns of thought · 2. Creative thinking skills.</p>`,
    `<p class="y-chinh">🎯 Hai chủ đề trong bộ này: 1. Lối tư duy · 2. Kỹ năng tư duy sáng tạo.</p>`),

  slide(D, 3, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives; note that three of them are about creativity, not about thinking in general.</p>
     <ol>
       <li>Identify different patterns of thought, such as those in <strong>Bloom's taxonomy</strong>.</li>
       <li>Discuss the relationship of each thought pattern to education.</li>
       <li>Define creative thinking.</li>
       <li>Identify the value of creative thinking in education.</li>
       <li>Describe the impact of limitations (such as rules) on creative thinking.</li>
     </ol>
     <p class="meo">💡 Objective 5 is the counter-intuitive one, and slide 31 answers it: structure <em>helps</em> creativity.</p>`,
    `<p class="y-chinh">🎯 Năm mục tiêu; để ý ba trong số đó nói về sáng tạo chứ không phải tư duy nói chung.</p>
     <ol>
       <li>Nhận diện các lối tư duy khác nhau, ví dụ như trong <strong>thang Bloom</strong>.</li>
       <li>Bàn về quan hệ của từng lối tư duy với việc học.</li>
       <li>Định nghĩa tư duy sáng tạo.</li>
       <li>Chỉ ra giá trị của tư duy sáng tạo trong học tập.</li>
       <li>Mô tả tác động của các giới hạn (như luật lệ) lên tư duy sáng tạo.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 5 là cái ngược trực giác, và slide 31 trả lời: cấu trúc <em>giúp</em> sáng tạo.</p>`),

  slide(D, 4, '1. Patterns of thought',
    `<p class="y-chinh">🎯 Section divider for the first half.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục cho nửa đầu.</p>`),

  slide(D, 5, 'What is thought? — the opening quotation',
    `<p class="y-chinh">🎯 "We exist, and we are aware that we exist, because we think. Without thought or the ability to think, we don't exist."</p>
     <p class="meo">💡 Rhetorical opener, not a definition. The working definition is on the next slide — that is the one to write down.</p>`,
    `<p class="y-chinh">🎯 "Ta tồn tại, và ta ý thức được rằng mình tồn tại, bởi ta tư duy. Không có tư duy hay khả năng tư duy, ta không tồn tại."</p>
     <p class="meo">💡 Câu mở đầu mang tính tu từ, không phải định nghĩa. Định nghĩa làm việc nằm ở slide sau — đó mới là thứ cần chép.</p>`),

  slide(D, 6, 'What is thought? — the working definition',
    `<p class="y-chinh">🎯 Thinking is the mental process you use to form associations and models of the world.</p>
     <ul>
       <li>When you think, you <strong>manipulate information</strong> to form concepts, solve problems, reason, and make decisions.</li>
       <li>Thought is the act of thinking that produces thoughts — which arise as ideas, images, sounds, or even emotions.</li>
       <li>"Cogito ergo sum" — "I think, therefore I am" (Descartes, early 1600s).</li>
     </ul>
     <p class="meo">💡 The four verbs — form concepts, solve problems, reason, decide — are exactly what the group project will ask of you.</p>`,
    `<p class="y-chinh">🎯 Tư duy là quá trình tinh thần bạn dùng để tạo liên kết và dựng mô hình về thế giới.</p>
     <ul>
       <li>Khi tư duy, bạn <strong>thao tác trên thông tin</strong> để hình thành khái niệm, giải quyết vấn đề, lập luận và ra quyết định.</li>
       <li>Tư duy là hành động nghĩ, sinh ra các ý nghĩ — hiện lên dưới dạng ý tưởng, hình ảnh, âm thanh, hay thậm chí cảm xúc.</li>
       <li>"Cogito ergo sum" — "Tôi tư duy, nên tôi tồn tại" (Descartes, đầu thế kỷ 17).</li>
     </ul>
     <p class="meo">💡 Bốn động từ — hình thành khái niệm, giải quyết vấn đề, lập luận, ra quyết định — đúng là những thứ dự án nhóm sẽ đòi ở bạn.</p>`),

  slide(D, 7, 'What are learning objectives? The three domains',
    `<p class="y-chinh">🎯 Learning objectives specify what someone will know, care about, or be able to do after a learning experience.</p>
     <ul>
       <li><span class="nhan">Cognitive domain</span> — what you should <strong>know</strong>.</li>
       <li><span class="nhan">Affective domain</span> — what you should <strong>care about</strong>.</li>
       <li><span class="nhan">Psychomotor domain</span> — what you should be <strong>able to do</strong>.</li>
     </ul>
     <p class="meo">💡 This matters for reading your own syllabus: the 12 CLOs of SSG104 mix all three domains, which is why some are graded by a written exam and others only by an in-class activity.</p>`,
    `<p class="y-chinh">🎯 Mục tiêu học tập nêu rõ sau quá trình học, người học sẽ biết gì, quan tâm điều gì, hoặc làm được gì.</p>
     <ul>
       <li><span class="nhan">Miền nhận thức</span> — thứ bạn phải <strong>biết</strong>.</li>
       <li><span class="nhan">Miền cảm xúc/thái độ</span> — thứ bạn phải <strong>quan tâm</strong>.</li>
       <li><span class="nhan">Miền tâm vận động</span> — thứ bạn phải <strong>làm được</strong>.</li>
     </ul>
     <p class="meo">💡 Điều này quan trọng khi đọc chính syllabus của bạn: 12 CLO của SSG104 pha cả ba miền, nên có CLO chấm bằng bài thi viết, có CLO chỉ chấm được qua hoạt động trên lớp.</p>`),

  slide(D, 8, "The cognitive domain — Bloom's taxonomy (new version)",
    `<p class="y-chinh">🎯 The pyramid the next three slides unpack. Six levels, from remembering at the base to creating at the top.</p>
     <p class="meo">💡 "New version" matters: the revised taxonomy uses verbs (remembering, understanding…) and puts <em>creating</em> above <em>evaluating</em>. The old version used nouns and ended at "evaluation".</p>`,
    `<p class="y-chinh">🎯 Kim tự tháp mà ba slide sau sẽ mổ xẻ. Sáu bậc, từ ghi nhớ ở đáy tới sáng tạo ở đỉnh.</p>
     <p class="meo">💡 Chữ "bản mới" có ý nghĩa: thang sửa đổi dùng động từ (ghi nhớ, hiểu…) và xếp <em>sáng tạo</em> trên <em>đánh giá</em>. Bản cũ dùng danh từ và dừng ở "đánh giá".</p>`),

  slide(D, 9, "Bloom's taxonomy — remembering, understanding, applying",
    `<p class="y-chinh">🎯 The first three levels, with the deck's own definitions.</p>
     <ul>
       <li><span class="nhan">Remembering</span> — recognise or recall knowledge already gained; produce, retrieve or recite definitions, facts and lists.</li>
       <li><span class="nhan">Understanding</span> — grasp or construct meaning from oral, written and graphic messages.</li>
       <li><span class="nhan">Applying</span> — use learned material in <strong>new and concrete</strong> situations.</li>
     </ul>
     <p class="meo">💡 The jump from understanding to applying is where most study effort stops too early: being able to explain groupthink is not the same as spotting it in your own group.</p>`,
    `<p class="y-chinh">🎯 Ba bậc đầu, dùng đúng định nghĩa của bộ slide.</p>
     <ul>
       <li><span class="nhan">Ghi nhớ</span> — nhận ra hoặc nhớ lại kiến thức đã có; đọc lại, truy xuất, nhắc lại định nghĩa, dữ kiện, danh sách.</li>
       <li><span class="nhan">Hiểu</span> — nắm được hoặc dựng được ý nghĩa từ thông điệp nói, viết và hình ảnh.</li>
       <li><span class="nhan">Áp dụng</span> — dùng kiến thức đã học vào tình huống <strong>mới và cụ thể</strong>.</li>
     </ul>
     <p class="meo">💡 Bước nhảy từ hiểu sang áp dụng là chỗ phần lớn công sức ôn tập dừng lại quá sớm: giải thích được groupthink không giống với nhận ra nó trong chính nhóm mình.</p>`),

  slide(D, 10, "Bloom's taxonomy — analyzing, evaluating, creating",
    `<p class="y-chinh">🎯 The top three levels.</p>
     <ul>
       <li><span class="nhan">Analyzing</span> — break material into components so its organisational structure is better understood.</li>
       <li><span class="nhan">Evaluating</span> — judge, check and critique the value of material for a given purpose.</li>
       <li><span class="nhan">Creating</span> — put parts together into a coherent or unique new whole; reorganise elements into a new pattern through generating, planning or producing.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ chữ "for a given purpose":</strong> evaluating is never "is this good?" in the abstract — it is "is this good <em>for this purpose</em>?". That phrase is what makes an evaluation defensible.</p>`,
    `<p class="y-chinh">🎯 Ba bậc trên cùng.</p>
     <ul>
       <li><span class="nhan">Phân tích</span> — tách tài liệu thành các bộ phận để hiểu rõ hơn cấu trúc tổ chức của nó.</li>
       <li><span class="nhan">Đánh giá</span> — phán xét, kiểm tra, phê bình giá trị của tài liệu cho một mục đích cho trước.</li>
       <li><span class="nhan">Sáng tạo</span> — ghép các phần thành một chỉnh thể mới mạch lạc hoặc độc đáo; sắp xếp lại các thành tố thành mô thức mới thông qua việc sinh ra, lập kế hoạch hoặc tạo ra sản phẩm.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ cụm "cho một mục đích cho trước":</strong> đánh giá không bao giờ là "cái này tốt không?" chung chung — mà là "cái này tốt <em>cho mục đích này</em> không?". Chính cụm đó làm một đánh giá đứng vững được.</p>`),

  slide(D, 11, "Bloom's taxonomy — the table continued",
    `<p class="y-chinh">🎯 Continuation of the descriptions table.</p>
     <p class="meo">💡 Exam tip: you are as likely to be asked "which level is this task?" as "list the levels". Practise by labelling the SSG104 assessments — the quiz sits at remembering/understanding, the group project at creating.</p>`,
    `<p class="y-chinh">🎯 Phần tiếp của bảng mô tả.</p>
     <p class="meo">💡 Mẹo thi: câu "nhiệm vụ này thuộc bậc nào?" dễ ra ngang với câu "liệt kê các bậc". Luyện bằng cách gán nhãn cho chính các bài đánh giá của SSG104 — bài quiz nằm ở bậc ghi nhớ/hiểu, còn dự án nhóm nằm ở bậc sáng tạo.</p>`),

  slide(D, 12, '2. Creative thinking skills',
    `<p class="y-chinh">🎯 Second half of the deck.</p>
     <p>"Everybody has a creative potential and from the moment you can express this creative potential, you can start changing the world." — Paulo Coelho.</p>`,
    `<p class="y-chinh">🎯 Nửa sau của bộ slide.</p>
     <p>"Ai cũng có tiềm năng sáng tạo, và từ khoảnh khắc bạn biểu đạt được tiềm năng ấy, bạn có thể bắt đầu thay đổi thế giới." — Paulo Coelho.</p>`),

  slide(D, 13, 'Creative thinking — creativity as a skill',
    `<p class="y-chinh">🎯 The claim that makes this teachable.</p>
     <ul>
       <li>Everyone has creative abilities — those who express them fully and those who express them barely at all.</li>
       <li>All humans are innately creative, <strong>especially if creativity is understood as a problem-solving skill</strong>.</li>
       <li>Creativity is inspired when there is a problem to solve.</li>
       <li>As a creative thinker you are curious, optimistic and imaginative.</li>
     </ul>
     <p class="meo">💡 The consequence stated on the slide: creativity is a <em>skill</em> that can be taught and learned, not an inborn gift. Everything after this slide is technique.</p>`,
    `<p class="y-chinh">🎯 Khẳng định làm cho thứ này dạy được.</p>
     <ul>
       <li>Ai cũng có năng lực sáng tạo — cả người bộc lộ trọn vẹn lẫn người gần như không bộc lộ.</li>
       <li>Mọi con người đều sáng tạo bẩm sinh, <strong>nhất là khi hiểu sáng tạo như một kỹ năng giải quyết vấn đề</strong>.</li>
       <li>Sáng tạo được khơi lên khi có một vấn đề cần giải.</li>
       <li>Là người tư duy sáng tạo, bạn tò mò, lạc quan và giàu tưởng tượng.</li>
     </ul>
     <p class="meo">💡 Hệ quả ghi thẳng trên slide: sáng tạo là <em>kỹ năng</em> dạy được và học được, không phải năng khiếu trời cho. Mọi thứ sau slide này đều là kỹ thuật.</p>`),

  slide(D, 14, 'Activity — assess your creative problem-solving skills',
    `<p class="y-chinh">🎯 A graded in-class activity with a concrete procedure.</p>
     <ul>
       <li><span class="nhan">Objective</span> — evaluate your attitude toward problem-solving.</li>
       <li><span class="nhan">Tool</span> — Psychology Today's Creative Problem-Solving Test.</li>
       <li><span class="nhan">Shape</span> — 20 questions, roughly 10 minutes, then a Snapshot Report with a graph and an interpretation.</li>
     </ul>
     <p class="meo">💡 The introductory text is worth reading: it links creativity to flexibility and tolerance of ambiguity — two qualities the group project will test far harder than any test will.</p>`,
    `<p class="y-chinh">🎯 Một hoạt động tính điểm trên lớp, có quy trình cụ thể.</p>
     <ul>
       <li><span class="nhan">Mục tiêu</span> — đánh giá thái độ của bạn với việc giải quyết vấn đề.</li>
       <li><span class="nhan">Công cụ</span> — bài test Creative Problem-Solving của Psychology Today.</li>
       <li><span class="nhan">Hình thức</span> — 20 câu, khoảng 10 phút, sau đó nhận Snapshot Report có biểu đồ và phần diễn giải.</li>
     </ul>
     <p class="meo">💡 Phần dẫn nhập đáng đọc: nó nối sáng tạo với sự linh hoạt và khả năng chịu đựng mơ hồ — hai phẩm chất mà dự án nhóm sẽ thử thách mạnh hơn bất kỳ bài test nào.</p>`),

  slide(D, 15, 'Creative thinking in education (part 1)',
    `<p class="y-chinh">🎯 Seven ordinary college activities that are creative work in disguise.</p>
     <ul>
       <li>Design sample exam questions to test your own knowledge while revising.</li>
       <li>Devise a social media strategy for a campus club.</li>
       <li>Propose an education plan for a major you design yourself.</li>
       <li>Prepare a speech for a debate in your course.</li>
       <li>Develop a pattern for a costume in a theatrical production.</li>
       <li>Arrange audience seats to maximise attention during your presentation.</li>
       <li>Arrange an eye-catching holiday display in your dormitory.</li>
     </ul>
     <p class="meo">💡 The first one is the cheapest study upgrade in this whole course: writing exam questions forces you up Bloom's ladder from remembering to creating.</p>`,
    `<p class="y-chinh">🎯 Bảy hoạt động sinh viên rất đỗi bình thường nhưng thực chất là việc sáng tạo trá hình.</p>
     <ul>
       <li>Tự soạn câu hỏi thi để kiểm tra kiến thức của chính mình khi ôn.</li>
       <li>Nghĩ chiến lược mạng xã hội cho một câu lạc bộ trong trường.</li>
       <li>Đề xuất kế hoạch học tập cho một chuyên ngành do chính bạn thiết kế.</li>
       <li>Chuẩn bị bài nói cho một buổi tranh biện trong môn học.</li>
       <li>Dựng mẫu phục trang cho một vở diễn.</li>
       <li>Sắp lại chỗ ngồi khán giả để giữ chú ý tối đa khi bạn thuyết trình.</li>
       <li>Bày một góc trang trí lễ hội bắt mắt ở ký túc xá.</li>
     </ul>
     <p class="meo">💡 Cái đầu tiên là cách nâng cấp việc học rẻ nhất trong cả môn này: tự viết câu hỏi thi ép bạn leo thang Bloom từ ghi nhớ lên sáng tạo.</p>`),

  slide(D, 16, 'Creative thinking in education (part 2)',
    `<p class="y-chinh">🎯 Five more, and they are all group activities.</p>
     <ul>
       <li>Join a brainstorming session with fellow musicians on writing a composition together.</li>
       <li>Draft a script for a video shown to college administrators.</li>
       <li>Compose requests and recommendations for a campus office to improve its service.</li>
       <li>Develop a marketing pitch for a mock business.</li>
       <li>Develop a comprehensive energy-reduction plan for your co-housing arrangement.</li>
     </ul>
     <p class="meo">💡 Notice the pattern: every one of them has a real audience. That is what separates a creative task from a fantasy.</p>`,
    `<p class="y-chinh">🎯 Năm cái nữa, và tất cả đều là hoạt động nhóm.</p>
     <ul>
       <li>Tham gia một buổi brainstorming với bạn chơi nhạc để cùng viết một tác phẩm.</li>
       <li>Viết kịch bản cho video trình chiếu trước ban giám hiệu.</li>
       <li>Soạn kiến nghị và đề xuất để một phòng ban trong trường cải thiện dịch vụ.</li>
       <li>Xây bài chào hàng cho một doanh nghiệp giả định.</li>
       <li>Lập kế hoạch tiết giảm năng lượng toàn diện cho khu nhà ở chung.</li>
     </ul>
     <p class="meo">💡 Để ý điểm chung: cái nào cũng có người nhận thật. Đó là thứ tách một nhiệm vụ sáng tạo khỏi một giấc mơ.</p>`),

  slide(D, 17, 'How to stimulate creative thinking (1–3)',
    `<p class="y-chinh">🎯 Three research-backed methods.</p>
     <ol>
       <li><span class="nhan">Sleep on it</span> — the REM cycle boosts creativity and problem-solving. Keep pen and paper by the bed for nocturnal insights.</li>
       <li><span class="nhan">Exercise</span> — studies indicate exercise stimulates creative thinking, and the boost lasts a few hours.</li>
       <li><span class="nhan">Let your mind wander daily</span> — daydreaming is an essential part of generating new ideas; when stuck, think about something else for a while.</li>
     </ol>
     <p class="meo">💡 All three work by the same mechanism: they stop the deliberate search, which is what lets a different association surface.</p>`,
    `<p class="y-chinh">🎯 Ba phương pháp có nghiên cứu chống lưng.</p>
     <ol>
       <li><span class="nhan">Ngủ một giấc đã</span> — chu kỳ REM làm tăng khả năng sáng tạo và giải quyết vấn đề. Để sẵn giấy bút cạnh giường cho những ý chợt đến lúc nửa đêm.</li>
       <li><span class="nhan">Vận động</span> — nhiều nghiên cứu cho thấy tập thể dục kích thích tư duy sáng tạo, hiệu ứng kéo dài vài giờ.</li>
       <li><span class="nhan">Cho đầu óc lang thang mỗi ngày</span> — mơ màng là phần thiết yếu của việc sinh ý tưởng mới; bí thì nghĩ sang chuyện khác một lúc.</li>
     </ol>
     <p class="meo">💡 Cả ba cùng một cơ chế: chúng ngắt việc tìm kiếm có chủ ý, và chính lúc đó một liên tưởng khác mới nổi lên được.</p>`),

  slide(D, 18, 'How to stimulate creative thinking (4–6)',
    `<p class="y-chinh">🎯 Three more, and the middle one is uncomfortable on purpose.</p>
     <ol start="4">
       <li><span class="nhan">Keep learning</span> — studying something far from your expertise is especially effective at producing new ways of thinking.</li>
       <li><span class="nhan">Put yourself in nerve-racking situations occasionally</span> — fear and frustration can trigger innovative thinking.</li>
       <li><span class="nhan">Keep a notebook</span> — record fleeting thoughts; they are sometimes the best ideas of all.</li>
     </ol>
     <p class="meo">💡 Point 4 is why this subject sits in a software engineering curriculum at all: distance from your field is the source, not a distraction from it.</p>`,
    `<p class="y-chinh">🎯 Ba cái nữa, và cái ở giữa gây khó chịu một cách có chủ ý.</p>
     <ol start="4">
       <li><span class="nhan">Học thêm thứ mới</span> — học cái gì đó thật xa chuyên môn của bạn đặc biệt hiệu quả trong việc tạo ra lối nghĩ mới.</li>
       <li><span class="nhan">Thỉnh thoảng tự đặt mình vào tình huống căng thẳng</span> — sợ hãi và bức bối có thể kích hoạt tư duy đột phá.</li>
       <li><span class="nhan">Luôn mang theo sổ</span> — ghi lại những ý thoáng qua; đôi khi chúng lại là ý hay nhất.</li>
     </ol>
     <p class="meo">💡 Ý số 4 chính là lý do môn này có mặt trong chương trình kỹ thuật phần mềm: khoảng cách với ngành của bạn là nguồn sáng tạo, không phải thứ làm bạn xao nhãng.</p>`),

  slide(D, 19, 'A brainstorm of tips — "have lots of ideas"',
    `<p class="y-chinh">🎯 "The best way to have a good idea is to have lots of ideas." — Linus Pauling, double Nobel laureate.</p>
     <p class="meo">💡 This is the quantity-before-quality rule that the brainstorming technique on slide 36 is built on: generate first, judge later.</p>`,
    `<p class="y-chinh">🎯 "Cách tốt nhất để có một ý hay là có thật nhiều ý." — Linus Pauling, hai lần Nobel.</p>
     <p class="meo">💡 Đây là quy tắc số lượng trước chất lượng, nền tảng của kỹ thuật brainstorming ở slide 36: sinh ý trước, phán xét sau.</p>`),

  slide(D, 20, 'Tips — sensing and thinking',
    `<p class="y-chinh">🎯 Two of the seven tip families.</p>
     <p><span class="nhan">Sensing</span></p>
     <ul>
       <li>Use all your senses — see, taste, smell, touch, hear, think, speak.</li>
       <li>Be a good observer of people, nature and events around you.</li>
     </ul>
     <p><span class="nhan">Thinking</span></p>
     <ul>
       <li>Engage right-brain thinking: intuition, open-mindedness, visual perception, rhythm.</li>
       <li>Change your interpretation of an event, situation, behaviour, person or object.</li>
       <li>Allow ideas to incubate; be open to insight as ideas pop into your mind.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Hai trong bảy nhóm mẹo.</p>
     <p><span class="nhan">Cảm nhận</span></p>
     <ul>
       <li>Dùng mọi giác quan — nhìn, nếm, ngửi, chạm, nghe, nghĩ, nói.</li>
       <li>Quan sát kỹ con người, thiên nhiên và sự việc quanh mình.</li>
     </ul>
     <p><span class="nhan">Tư duy</span></p>
     <ul>
       <li>Huy động lối nghĩ bán cầu phải: trực giác, cởi mở, tri giác thị giác, nhịp điệu.</li>
       <li>Đổi cách diễn giải của bạn về một sự kiện, tình huống, hành vi, con người hay đồ vật.</li>
       <li>Để ý tưởng ủ men; cởi mở với tia sáng khi nó bật lên trong đầu.</li>
     </ul>`),

  slide(D, 21, 'Tips — imagining',
    `<p class="y-chinh">🎯 Five prompts for the imagining stage.</p>
     <ul>
       <li>Brainstorm by generating ideas with a group of people.</li>
       <li>Ask "What would happen if…".</li>
       <li>Ask "In how many different ways…".</li>
       <li>Develop ideas and expand their possibilities.</li>
       <li>Envision the future.</li>
     </ul>
     <p class="meo">💡 The two questions are worth memorising verbatim — they are the fastest way to restart a stalled group discussion.</p>`,
    `<p class="y-chinh">🎯 Năm câu gợi mở cho giai đoạn tưởng tượng.</p>
     <ul>
       <li>Brainstorm bằng cách cùng một nhóm người sinh ý tưởng.</li>
       <li>Hỏi "Chuyện gì xảy ra nếu…".</li>
       <li>Hỏi "Có bao nhiêu cách khác nhau để…".</li>
       <li>Phát triển ý tưởng và mở rộng khả năng của nó.</li>
       <li>Hình dung tương lai.</li>
     </ul>
     <p class="meo">💡 Hai câu hỏi đó đáng thuộc nguyên văn — chúng là cách nhanh nhất để khởi động lại một buổi thảo luận nhóm đang tắc.</p>`),

  slide(D, 22, 'Tips — speaking and writing',
    `<p class="y-chinh">🎯 Four tips, and the second one is a direct instruction for your assignments.</p>
     <ul>
       <li>Use your own words and your own "voice" when conveying original ideas.</li>
       <li><strong>Avoid clichés</strong> and overly familiar responses to questions or problems.</li>
       <li>Explain how your ideas move beyond the status quo and contribute to a discussion.</li>
       <li>Take notes.</li>
     </ul>
     <p class="meo">💡 Third bullet is a marking criterion in disguise: an idea that does not say what it changes reads as filler.</p>`,
    `<p class="y-chinh">🎯 Bốn mẹo, và cái thứ hai là chỉ dẫn trực tiếp cho bài tập của bạn.</p>
     <ul>
       <li>Dùng chữ của chính bạn và "giọng" của chính bạn khi truyền đạt ý tưởng riêng.</li>
       <li><strong>Tránh sáo ngữ</strong> và những câu trả lời quá quen thuộc.</li>
       <li>Giải thích ý tưởng của bạn vượt khỏi hiện trạng ra sao và đóng góp gì cho cuộc thảo luận.</li>
       <li>Ghi chép.</li>
     </ul>
     <p class="meo">💡 Gạch đầu dòng thứ ba là tiêu chí chấm điểm trá hình: một ý không nói được nó thay đổi cái gì thì đọc lên chỉ như chữ độn.</p>`),

  slide(D, 23, 'Tips — drawing',
    `<p class="y-chinh">🎯 Two visual techniques, both named.</p>
     <ul>
       <li><span class="nhan">Mind-mapping</span> — start with a key concept in the centre of the page, then radiate connecting lines and write down every related idea that comes.</li>
       <li><span class="nhan">Rich pictures</span> — draw the situation to show it in a different way.</li>
     </ul>
     <p class="meo">💡 Mind-mapping is the technique to use when your group's proposal (Lesson 7) has too many half-ideas and no structure yet.</p>`,
    `<p class="y-chinh">🎯 Hai kỹ thuật hình ảnh, đều có tên gọi.</p>
     <ul>
       <li><span class="nhan">Sơ đồ tư duy</span> — đặt khái niệm chính giữa trang, rồi toả các đường nối ra và ghi mọi ý liên quan chợt đến.</li>
       <li><span class="nhan">Bức tranh giàu chi tiết (rich picture)</span> — vẽ lại tình huống để nhìn nó theo cách khác.</li>
     </ul>
     <p class="meo">💡 Sơ đồ tư duy là kỹ thuật nên dùng khi bản đề xuất của nhóm (Bài 7) có quá nhiều ý dở dang mà chưa có cấu trúc.</p>`),

  slide(D, 24, 'Tips — learning, moving, resting',
    `<p class="y-chinh">🎯 The last three families, and the shortest one is the most ignored.</p>
     <ul>
       <li><span class="nhan">Learning</span> — find ways to show your personal investment in projects; gather knowledge and do research; have more fun learning.</li>
       <li><span class="nhan">Moving</span> — do physical activity to engage the creative areas of the brain.</li>
       <li><span class="nhan">Resting</span> — take breaks.</li>
     </ul>
     <p class="meo">💡 "Take breaks" is two words with research behind it (slide 17, point 3). Treat it as method, not as permission.</p>`,
    `<p class="y-chinh">🎯 Ba nhóm cuối, và nhóm ngắn nhất lại là nhóm bị phớt lờ nhiều nhất.</p>
     <ul>
       <li><span class="nhan">Học</span> — tìm cách thể hiện sự đầu tư cá nhân vào dự án; thu thập kiến thức và nghiên cứu; học vui hơn.</li>
       <li><span class="nhan">Vận động</span> — hoạt động thể chất để đánh thức các vùng sáng tạo của não.</li>
       <li><span class="nhan">Nghỉ</span> — nghỉ giải lao.</li>
     </ul>
     <p class="meo">💡 "Nghỉ giải lao" chỉ hai chữ nhưng có nghiên cứu đứng sau (slide 17, ý 3). Hãy coi đó là phương pháp, không phải lời cho phép.</p>`),

  slide(D, 25, 'Creative thinking — fiction and facts',
    `<p class="y-chinh">🎯 Divider for four myths about creativity, each answered on its own slide.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục cho bốn ngộ nhận về sáng tạo, mỗi cái được trả lời ở một slide riêng.</p>`),

  slide(D, 26, 'Myth 1 — "every problem has only one right answer"',
    `<p class="y-chinh">🎯 Fiction vs facts, first pair.</p>
     <p><span class="nhan">Fiction</span> — every problem has only one solution, one right answer.</p>
     <p><span class="nhan">Facts</span></p>
     <ul>
       <li>Most problems can be solved in any number of ways.</li>
       <li>If you discover a solution that works, it is a good solution.</li>
       <li>Other people may think up different solutions — that does not make yours wrong or unimportant.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Ngộ nhận và sự thật, cặp thứ nhất.</p>
     <p><span class="nhan">Ngộ nhận</span> — mỗi vấn đề chỉ có một lời giải, một đáp án đúng.</p>
     <p><span class="nhan">Sự thật</span></p>
     <ul>
       <li>Phần lớn vấn đề giải được bằng vô số cách.</li>
       <li>Nếu bạn tìm ra một lời giải chạy được, đó là một lời giải tốt.</li>
       <li>Người khác có thể nghĩ ra lời giải khác — điều đó không làm lời giải của bạn sai hay kém quan trọng.</li>
     </ul>`),

  slide(D, 27, 'Myth 2 — "the best method has already been discovered"',
    `<p class="y-chinh">🎯 Second pair, answered with a history lesson.</p>
     <p><span class="nhan">Facts</span> — look at the history of any solution and you will see that improvements and new right answers keep being found.</p>
     <p>The deck's own chain: <em>the ox or horse → the cart → the wagon → the train → the car → the airplane → the jet → the space shuttle</em>. What is the best and last?</p>
     <p class="meo">💡 The rhetorical question has no answer, and that is the point.</p>`,
    `<p class="y-chinh">🎯 Cặp thứ hai, trả lời bằng một bài học lịch sử.</p>
     <p><span class="nhan">Sự thật</span> — nhìn vào lịch sử của bất kỳ giải pháp nào, bạn sẽ thấy cải tiến và đáp án đúng mới vẫn liên tục xuất hiện.</p>
     <p>Chuỗi ngay trên slide: <em>bò hoặc ngựa → xe kéo → xe thồ → tàu hoả → ô tô → máy bay → phản lực → tàu con thoi</em>. Cái nào là tốt nhất và cuối cùng?</p>
     <p class="meo">💡 Câu hỏi tu từ ấy không có đáp án, và đó chính là điều muốn nói.</p>`),

  slide(D, 28, 'Myth 3 — "creative answers are technologically complex"',
    `<p class="y-chinh">🎯 Third pair.</p>
     <p><span class="nhan">Facts</span></p>
     <ul>
       <li>Only a few problems require complex technological solutions.</li>
       <li>Most problems need only a thoughtful solution involving personal action and perhaps a few simple tools.</li>
       <li>Even many problems that <em>seem</em> to need technology can be addressed in other ways.</li>
     </ul>
     <p class="meo">💡 Useful check for a software student: before designing a system, ask whether the problem is actually about behaviour, agreement or information flow.</p>`,
    `<p class="y-chinh">🎯 Cặp thứ ba.</p>
     <p><span class="nhan">Sự thật</span></p>
     <ul>
       <li>Chỉ một số ít vấn đề cần tới giải pháp công nghệ phức tạp.</li>
       <li>Phần lớn vấn đề chỉ cần một lời giải chín chắn, bằng hành động cá nhân và có lẽ vài công cụ đơn giản.</li>
       <li>Ngay cả nhiều vấn đề <em>trông như</em> cần công nghệ vẫn xử lý được bằng cách khác.</li>
     </ul>
     <p class="meo">💡 Phép thử hữu ích cho sinh viên phần mềm: trước khi thiết kế hệ thống, hãy hỏi vấn đề này thực ra có phải chuyện hành vi, chuyện thoả thuận hay chuyện luồng thông tin không.</p>`),

  slide(D, 29, 'Myth 4 — "ideas either come or they don\'t; structure cannot help"',
    `<p class="y-chinh">🎯 Fourth pair — and this is objective 5 of the lesson being answered directly.</p>
     <p><span class="nhan">Facts</span></p>
     <ul>
       <li>There are many successful techniques for generating ideas, and one important technique is to <strong>include structure</strong>.</li>
       <li>Create guidelines, limiting parameters and concrete goals for yourself that stimulate and shape your creativity.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Ghi nhớ cho đề thi:</strong> limitations do not kill creativity — they focus it. "Design anything" produces less than "design something a first-year student can use in five minutes".</p>`,
    `<p class="y-chinh">🎯 Cặp thứ tư — và đây chính là mục tiêu 5 của bài đang được trả lời thẳng.</p>
     <p><span class="nhan">Sự thật</span></p>
     <ul>
       <li>Có nhiều kỹ thuật sinh ý tưởng hiệu quả, và một kỹ thuật quan trọng là <strong>đưa cấu trúc vào</strong>.</li>
       <li>Hãy tự đặt ra nguyên tắc, tham số giới hạn và mục tiêu cụ thể để kích thích và định hình sáng tạo của chính mình.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Nhớ cho đề thi:</strong> giới hạn không giết sáng tạo — nó hội tụ sáng tạo. "Thiết kế cái gì cũng được" cho ra ít hơn "thiết kế thứ mà sinh viên năm nhất dùng được trong năm phút".</p>`),

  slide(D, 30, 'Thinking and Analysis (cont.)',
    `<p class="y-chinh">🎯 Title slide for the continuation of Lesson 6.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề cho phần tiếp của Bài 6.</p>`),

  slide(D, 31, 'Chapter outlines — creative thinking skills (cont.)',
    `<p class="y-chinh">🎯 The second half of the creativity lesson turns to technology and online learning.</p>`,
    `<p class="y-chinh">🎯 Nửa sau của bài sáng tạo chuyển sang công nghệ và học trực tuyến.</p>`),

  slide(D, 32, 'Learning objectives for the continuation (5)',
    `<p class="y-chinh">🎯 Five more objectives.</p>
     <ol>
       <li>Describe the role of creative thinking skills in problem-solving.</li>
       <li>Identify technology tools that enhance our learning.</li>
       <li>Explain how technology skills relate to critical and creative thinking skills.</li>
       <li>Examine online learning in terms of organising, communicating, reading and researching online.</li>
       <li>Assess our readiness to use technology.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm mục tiêu nữa.</p>
     <ol>
       <li>Mô tả vai trò của kỹ năng tư duy sáng tạo trong giải quyết vấn đề.</li>
       <li>Nhận diện các công cụ công nghệ giúp việc học.</li>
       <li>Giải thích kỹ năng công nghệ liên hệ thế nào với tư duy phản biện và sáng tạo.</li>
       <li>Xem xét việc học trực tuyến ở các mặt: tổ chức, giao tiếp, đọc và tra cứu trên mạng.</li>
       <li>Tự đánh giá mức sẵn sàng dùng công nghệ của bản thân.</li>
     </ol>`),

  slide(D, 33, 'Problem-solving with creative thinking',
    `<p class="y-chinh">🎯 The clean separation between the two thinking modes this session teaches.</p>
     <ul>
       <li>Creative problem-solving searches for <strong>new and novel</strong> solutions.</li>
       <li><span class="nhan">Critical thinking</span> scrutinises assumptions and uses reasoning.</li>
       <li><span class="nhan">Creative thinking</span> generates alternative ideas, practices and solutions that are unique and effective.</li>
       <li>It means facing muddy, unclear problems and seeing how things could be done differently.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy thi:</strong> creative ≠ critical. Creative <em>generates</em>; critical <em>judges</em>. Lesson 8 covers the critical half, and a good group uses them in that order.</p>`,
    `<p class="y-chinh">🎯 Ranh giới rành mạch giữa hai lối tư duy mà buổi này dạy.</p>
     <ul>
       <li>Giải quyết vấn đề sáng tạo là đi tìm lời giải <strong>mới và khác lạ</strong>.</li>
       <li><span class="nhan">Tư duy phản biện</span> soi xét các giả định và dùng lập luận.</li>
       <li><span class="nhan">Tư duy sáng tạo</span> sinh ra ý tưởng, cách làm và giải pháp thay thế vừa độc đáo vừa hiệu quả.</li>
       <li>Nó là việc đối diện những vấn đề mù mờ, chưa rõ ràng và nhìn ra cách làm khác đi.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy thi:</strong> sáng tạo ≠ phản biện. Sáng tạo <em>sinh ra</em>; phản biện <em>phán xét</em>. Bài 8 dạy nửa phản biện, và nhóm làm việc tốt sẽ dùng chúng đúng thứ tự đó.</p>`),

  slide(D, 34, 'Activity — brainstorming a social initiative',
    `<p class="y-chinh">🎯 A graded group activity, and it rehearses the group project.</p>
     <p><span class="nhan">Task</span> — "Project start-up: Social initiative". In small groups, propose a creative social initiative that solves some problem in our society.</p>
     <p class="meo">💡 Run it with the technique on the next slide, not as a free-for-all discussion. The difference in output is visible within ten minutes.</p>`,
    `<p class="y-chinh">🎯 Một hoạt động nhóm tính điểm, và nó là buổi tập dượt cho dự án nhóm.</p>
     <p><span class="nhan">Đề bài</span> — "Khởi động dự án: Sáng kiến xã hội". Theo nhóm nhỏ, đề xuất một sáng kiến xã hội sáng tạo giải quyết một vấn đề nào đó của xã hội.</p>
     <p class="meo">💡 Hãy chạy nó bằng kỹ thuật ở slide sau, đừng thảo luận tự do. Khác biệt về kết quả lộ ra chỉ sau mười phút.</p>`),

  slide(D, 35, 'Brainstorming technique — the six steps',
    `<p class="y-chinh">🎯 The loop, exactly as drawn: <strong>Start → Ideas generation → Ideas combination → Evaluation & validation → Selection of best ideas → Generate new ideas → End</strong>.</p>
     <ul>
       <li><span class="nhan">Generation</span> — quantity first (slide 19: "have lots of ideas"). No judging here.</li>
       <li><span class="nhan">Combination</span> — merge and build on ideas rather than defending single ones.</li>
       <li><span class="nhan">Evaluation & validation</span> — only now does critical thinking enter.</li>
       <li><span class="nhan">Selection</span> — pick the best.</li>
       <li><span class="nhan">Generate new ideas</span> — the arrow loops back; one pass is rarely enough.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Lỗi phổ biến nhất:</strong> evaluating during generation. It stops the flow and, per group polarization (Lesson 3 slide 15), the discussion converges on whoever spoke first.</p>`,
    `<p class="y-chinh">🎯 Vòng lặp, đúng như hình vẽ: <strong>Bắt đầu → Sinh ý tưởng → Kết hợp ý tưởng → Đánh giá & thẩm định → Chọn ý tốt nhất → Sinh ý mới</strong>.</p>
     <ul>
       <li><span class="nhan">Sinh ý</span> — số lượng trước đã (slide 19: "có thật nhiều ý"). Tuyệt đối không phán xét ở bước này.</li>
       <li><span class="nhan">Kết hợp</span> — ghép và bồi đắp ý tưởng, thay vì bảo vệ từng ý riêng lẻ.</li>
       <li><span class="nhan">Đánh giá & thẩm định</span> — tới lúc này tư duy phản biện mới được vào.</li>
       <li><span class="nhan">Chọn lọc</span> — lấy ý tốt nhất.</li>
       <li><span class="nhan">Sinh ý mới</span> — mũi tên quay vòng; hiếm khi một lượt là đủ.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Lỗi phổ biến nhất:</strong> vừa sinh ý vừa phán xét. Nó chặn dòng chảy, và theo hiệu ứng phân cực nhóm (Bài 3 slide 15), cả buổi sẽ hội tụ về ý của người nói đầu tiên.</p>`),

  slide(D, 36, 'End of the brainstorming diagram',
    `<p class="y-chinh">🎯 Closing slide of the deck.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Six Bloom levels in order, and one task placed at each?</li>
       <li>Why is creativity called a skill rather than a gift (slide 13)?</li>
       <li>What does structure do to creativity (slide 29)?</li>
       <li>Which brainstorming step must contain no judgement (slide 35)?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết của bộ này.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Sáu bậc Bloom theo đúng thứ tự, mỗi bậc gán được một nhiệm vụ chứ?</li>
       <li>Vì sao sáng tạo được gọi là kỹ năng chứ không phải năng khiếu (slide 13)?</li>
       <li>Cấu trúc làm gì với sáng tạo (slide 29)?</li>
       <li>Bước nào của brainstorming tuyệt đối không được có phán xét (slide 35)?</li>
     </ol>`),

  books([
    ['lumen', 'chương Thinking — Bloom\'s taxonomy, creative thinking', 'chương Thinking — thang Bloom, tư duy sáng tạo'],
    ['piercy', 'chương về problem solving trong nhóm', 'chương về giải quyết vấn đề trong nhóm'],
  ]),

  bi(
    `<h3>✅ What the old course was missing here</h3>
     <p>The syllabus asks about Bloom's taxonomy (CQ4.3) and the rules of brainstorming (CQ4.4). In the previous version of this Academy course the word "Bloom" appeared zero times, and creative thinking was a single parenthetical clause inside one sentence.</p>`,
    `<h3>✅ Khoá cũ thiếu gì ở chỗ này</h3>
     <p>Syllabus hỏi về thang Bloom (CQ4.3) và quy tắc brainstorming (CQ4.4). Ở phiên bản cũ của khoá học này, chữ "Bloom" xuất hiện đúng 0 lần, còn tư duy sáng tạo chỉ là một mệnh đề trong ngoặc nằm trong đúng một câu.</p>`),
].join('\n');
