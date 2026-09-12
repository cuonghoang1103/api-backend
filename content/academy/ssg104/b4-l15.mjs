/**
 * Buổi 4 · Bài 15 — Persuasive presentation (20 slide).
 *
 * Bám bộ "Session 4_..._Lesson 14_Persuasive presentation.pptx" (trường đánh
 * nhầm số 14; theo thứ tự buổi thì đây là bài 15). Syllabus hỏi CQ12.1 về
 * elevator speech — bản Academy cũ có 0 lần nhắc cụm này, và cũng không có
 * mười một điều cấm khi nói thuyết phục.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l15';

export const b4l15 = [
  walkHead(D, 1, 20,
    'Two blocks matter most: the eleven ethical prohibitions (slides 10–11), which are the boundary of what you may do to persuade, and the elevator speech structure (slides 13–15), which the syllabus asks about directly.',
    'Hai khối quan trọng nhất: mười một điều cấm về đạo đức (slide 10–11) — ranh giới của những gì bạn được phép làm khi thuyết phục, và cấu trúc elevator speech (slide 13–15) — thứ syllabus hỏi thẳng.'),

  slide(D, 1, 'Persuasive Presentations — Session IV',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 This lesson feeds Group Assignment 1, which the syllabus places at sessions 35–36 and weights at 10%.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Bài này nuôi cho Group Assignment 1, mà syllabus xếp ở buổi 35–36 với trọng số 10%.</p>`),

  slide(D, 2, 'Chapter outline (4 parts)',
    `<p class="y-chinh">🎯 Four parts.</p>
     <ol>
       <li>What is persuasion?</li>
       <li>Meeting the listener's basic needs</li>
       <li>Speaking ethically</li>
       <li>Elevator speech</li>
     </ol>
     <p class="meo">💡 Note the order: what it is → who you are speaking to → what you may not do → a practised format. Ethics sits <em>before</em> technique on purpose.</p>`,
    `<p class="y-chinh">🎯 Bốn phần.</p>
     <ol>
       <li>Thuyết phục là gì?</li>
       <li>Đáp ứng nhu cầu cơ bản của người nghe</li>
       <li>Nói có đạo đức</li>
       <li>Elevator speech</li>
     </ol>
     <p class="meo">💡 Để ý thứ tự: nó là gì → bạn đang nói với ai → bạn không được làm gì → một khuôn mẫu để luyện. Phần đạo đức đứng <em>trước</em> phần kỹ thuật là có chủ ý.</p>`),

  slide(D, 3, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives.</p>
     <ol>
       <li>Demonstrate an understanding of the importance of persuasion.</li>
       <li>Describe similarities and differences between <strong>persuasion and motivation</strong>.</li>
       <li>Identify basic needs people seek to fulfil when they communicate.</li>
       <li>Demonstrate the importance of <strong>ethics</strong> as part of the persuasion process.</li>
       <li>Discuss the basic parts of an <strong>elevator speech</strong>.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm mục tiêu.</p>
     <ol>
       <li>Thể hiện được sự hiểu về tầm quan trọng của thuyết phục.</li>
       <li>Mô tả điểm giống và khác giữa <strong>thuyết phục và tạo động lực</strong>.</li>
       <li>Nhận diện những nhu cầu cơ bản con người muốn thoả mãn khi giao tiếp.</li>
       <li>Thể hiện được tầm quan trọng của <strong>đạo đức</strong> trong quá trình thuyết phục.</li>
       <li>Bàn về các phần cơ bản của một <strong>elevator speech</strong>.</li>
     </ol>`),

  slide(D, 4, 'What is persuasion?',
    `<p class="y-chinh">🎯 <strong>Persuasion is an act or process of presenting arguments to move, motivate, or change your audience.</strong></p>
     <ul>
       <li>It can be <strong>implicit or explicit</strong>.</li>
       <li>It can have both <strong>positive and negative</strong> effects.</li>
     </ul>
     <p class="meo">💡 The definition contains no promise that persuasion is good. That is why the ethics section exists, and why objective 4 is phrased as a demonstration.</p>`,
    `<p class="y-chinh">🎯 <strong>Thuyết phục là hành động hoặc quá trình đưa ra lập luận nhằm lay chuyển, thúc đẩy hoặc thay đổi người nghe.</strong></p>
     <ul>
       <li>Nó có thể <strong>ngầm ẩn hoặc công khai</strong>.</li>
       <li>Nó có thể mang lại tác động <strong>tích cực lẫn tiêu cực</strong>.</li>
     </ul>
     <p class="meo">💡 Định nghĩa không hề hứa rằng thuyết phục là điều tốt. Vì thế mới có phần đạo đức, và vì thế mục tiêu 4 mới được viết dưới dạng "thể hiện được".</p>`),

  slide(D, 5, 'Reasons for engaging in communication',
    `<p class="y-chinh">🎯 Four reasons people communicate at all.</p>
     <ul>
       <li>Gain information.</li>
       <li>Understand communication contexts.</li>
       <li>Understand our identity.</li>
       <li>Meet our needs.</li>
     </ul>
     <p class="meo">💡 Persuasion works by attaching your request to one of these four. A message that serves none of them is background noise to the listener.</p>`,
    `<p class="y-chinh">🎯 Bốn lý do khiến con người giao tiếp.</p>
     <ul>
       <li>Thu thập thông tin.</li>
       <li>Hiểu bối cảnh giao tiếp.</li>
       <li>Hiểu bản sắc của chính mình.</li>
       <li>Đáp ứng nhu cầu của mình.</li>
     </ul>
     <p class="meo">💡 Thuyết phục vận hành bằng cách gắn điều bạn muốn vào một trong bốn thứ đó. Thông điệp không phục vụ cái nào trong số đó chỉ là tiếng ồn nền với người nghe.</p>`),

  slide(D, 6, "Meeting the listener's basic needs",
    `<p class="y-chinh">🎯 Getting someone to <em>listen</em> takes a measure of persuasion; getting them to <em>act</em> may take considerable skill.</p>
     <p class="meo">💡 The sentence separates two jobs that students often merge. Attention is the first sale; action is the second, and it is the harder one.</p>`,
    `<p class="y-chinh">🎯 Khiến ai đó chịu <em>nghe</em> đã cần một mức thuyết phục; khiến họ <em>hành động</em> có thể cần kỹ năng đáng kể.</p>
     <p class="meo">💡 Câu này tách hai việc mà sinh viên hay gộp làm một. Sự chú ý là lần "bán" thứ nhất; hành động là lần thứ hai, và khó hơn nhiều.</p>`),

  slide(D, 7, 'Measurable gain',
    `<p class="y-chinh">🎯 <strong>Measurable gain</strong> assesses audience response to a persuasive message.</p>
     <p class="meo">💡 The practical question it forces: what would count as evidence that this presentation worked? If the answer is "people nodded", you have no measure. If it is "three groups signed up", you do.</p>`,
    `<p class="y-chinh">🎯 <strong>Mức thu được đo lường được</strong> là cách đánh giá phản ứng của khán giả trước một thông điệp thuyết phục.</p>
     <p class="meo">💡 Câu hỏi thực tế nó buộc bạn phải trả lời: cái gì được tính là bằng chứng rằng bài này có tác dụng? Nếu đáp án là "mọi người gật đầu" thì bạn chẳng có thước đo nào. Nếu là "ba nhóm đã đăng ký" thì có.</p>`),

  slide(D, 8, "Maslow's hierarchy",
    `<p class="y-chinh">🎯 The needs model used to target a persuasive appeal.</p>
     <p><span class="nhan">The five levels</span> — physiological · safety · belonging and love · esteem · self-actualisation.</p>
     <p class="meo">💡 How to use it in a speech: identify which level your listener is currently occupied with. An argument aimed at self-actualisation lands badly on someone worried about safety.</p>`,
    `<p class="y-chinh">🎯 Mô hình nhu cầu dùng để nhắm đúng đích khi thuyết phục.</p>
     <p><span class="nhan">Năm bậc</span> — nhu cầu sinh lý · an toàn · thuộc về và được yêu thương · được tôn trọng · tự thể hiện bản thân.</p>
     <p class="meo">💡 Cách dùng trong một bài nói: xác định người nghe đang bận tâm ở bậc nào. Lập luận nhắm vào nhu cầu tự thể hiện sẽ rơi hỏng với người đang lo chuyện an toàn.</p>`),

  slide(D, 9, 'Social penetration theory — the onion model',
    `<p class="y-chinh">🎯 Altman & Taylor (1973): how we move from <strong>superficial talk to intimate and revealing talk</strong>.</p>
     <ul>
       <li>The "onion model": we start on a superficial level, and as layers are peeled away we gain knowledge of the other person.</li>
       <li>That knowledge has both <strong>breadth</strong> (how many topics) and <strong>depth</strong> (how personal).</li>
     </ul>
     <p class="meo">💡 Relevance to persuasion: you cannot open at the centre of the onion. A request that assumes more closeness than exists reads as presumptuous and gets refused on tone alone.</p>`,
    `<p class="y-chinh">🎯 Altman & Taylor (1973): cách con người đi từ <strong>chuyện phiếm bề mặt tới những lời thân mật, cởi mở</strong>.</p>
     <ul>
       <li>"Mô hình củ hành": ta bắt đầu ở lớp ngoài cùng, và khi bóc dần từng lớp thì hiểu thêm về người kia.</li>
       <li>Sự hiểu ấy có cả <strong>bề rộng</strong> (bao nhiêu chủ đề) lẫn <strong>chiều sâu</strong> (riêng tư tới đâu).</li>
     </ul>
     <p class="meo">💡 Liên quan tới thuyết phục: bạn không thể mở lời ngay ở lõi củ hành. Một lời đề nghị giả định mức thân thiết cao hơn thực tế sẽ bị đọc là suồng sã và bị từ chối chỉ vì giọng điệu.</p>`),

  slide(D, 10, 'Speaking ethically and avoiding fallacies — seven concepts',
    `<p class="y-chinh">🎯 Seven words that frame the ethics of persuasion.</p>
     <ul class="hai-cot">
       <li>Fairness</li>
       <li>Freedom</li>
       <li>Ethics</li>
       <li>Manipulation</li>
       <li>Deception</li>
       <li>Bias</li>
       <li>Bribery</li>
     </ul>
     <p class="meo">💡 Read them as a pair of columns: the first three are what persuasion must preserve; the last four are what it must not become.</p>`,
    `<p class="y-chinh">🎯 Bảy khái niệm khuôn định đạo đức của việc thuyết phục.</p>
     <ul class="hai-cot">
       <li>Công bằng</li>
       <li>Tự do</li>
       <li>Đạo đức</li>
       <li>Thao túng</li>
       <li>Lừa dối</li>
       <li>Thiên kiến</li>
       <li>Hối lộ</li>
     </ul>
     <p class="meo">💡 Hãy đọc chúng thành hai cột: ba cái đầu là thứ việc thuyết phục phải giữ gìn; bốn cái sau là thứ nó không được biến thành.</p>`),

  slide(D, 11, 'Eleven points for speaking ethically (1–5)',
    `<p class="y-chinh">🎯 A list of prohibitions. <strong>Do not:</strong></p>
     <ol>
       <li>Use false, fabricated, misrepresented, distorted or irrelevant evidence to support arguments or claims.</li>
       <li>Intentionally use unsupported, misleading or illogical reasoning.</li>
       <li>Represent yourself as informed or an "expert" on a subject when you are not.</li>
       <li>Use irrelevant appeals to divert attention from the issue at hand.</li>
       <li>Ask your audience to link your idea to emotion-laden values, motives or goals to which it is actually not related.</li>
     </ol>
     <p class="meo">💡 Point 5 is the most common one in student presentations: attaching an ordinary proposal to a big emotive cause it has nothing to do with.</p>`,
    `<p class="y-chinh">🎯 Một danh sách những điều cấm. <strong>Không được:</strong></p>
     <ol>
       <li>Dùng bằng chứng sai, bịa, xuyên tạc, bóp méo hoặc không liên quan để chống lưng cho lập luận.</li>
       <li>Cố tình dùng lập luận không có căn cứ, gây hiểu lầm hoặc phi logic.</li>
       <li>Tự nhận là am hiểu hay "chuyên gia" về một chủ đề trong khi không phải.</li>
       <li>Dùng những lời kêu gọi không liên quan để đánh lạc hướng khỏi vấn đề đang bàn.</li>
       <li>Bắt khán giả nối ý tưởng của bạn với những giá trị, động cơ hay mục tiêu đầy cảm xúc mà thực ra chẳng liên quan gì.</li>
     </ol>
     <p class="meo">💡 Điều 5 hay gặp nhất trong bài thuyết trình sinh viên: gắn một đề xuất bình thường vào một lý tưởng lớn lao chẳng dính dáng gì tới nó.</p>`),

  slide(D, 12, 'Eleven points for speaking ethically (6–11)',
    `<p class="y-chinh">🎯 The remaining six prohibitions. <strong>Do not:</strong></p>
     <ol start="6">
       <li>Deceive your audience by concealing your real purpose, your self-interest, the group you represent, or your position as an advocate.</li>
       <li>Distort, hide or misrepresent the number, scope, intensity or undesirable features of consequences.</li>
       <li>Use emotional appeals that lack a supporting basis of evidence or reasoning.</li>
       <li>Oversimplify complex, gradation-laden situations into two-valued, either-or views.</li>
       <li>Pretend certainty where tentativeness and degrees of probability would be more accurate.</li>
       <li><strong>Advocate something which you yourself do not believe in.</strong></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Điều 10 là điều dễ vi phạm nhất mà không ai để ý:</strong> saying "this will work" when the honest claim is "this is likely to work" is listed here as an ethical failure, not a stylistic one.</p>`,
    `<p class="y-chinh">🎯 Sáu điều cấm còn lại. <strong>Không được:</strong></p>
     <ol start="6">
       <li>Lừa người nghe bằng cách giấu mục đích thật, giấu lợi ích riêng, giấu nhóm mà mình đại diện, hoặc giấu việc mình đang vận động cho một quan điểm.</li>
       <li>Bóp méo, giấu hoặc trình bày sai về số lượng, phạm vi, mức độ hay những hệ quả bất lợi.</li>
       <li>Dùng lời kêu gọi cảm xúc mà không có bằng chứng hay lập luận chống đỡ.</li>
       <li>Giản lược những tình huống phức tạp, nhiều sắc độ thành lối nhìn nhị nguyên "hoặc thế này hoặc thế kia".</li>
       <li>Giả vờ chắc chắn ở chỗ mà nói dè dặt, nói theo mức xác suất mới là chính xác.</li>
       <li><strong>Đi vận động cho điều chính mình không tin.</strong></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Điều 10 bị vi phạm nhiều nhất mà chẳng ai để ý:</strong> nói "cái này chắc chắn chạy" trong khi phát biểu trung thực phải là "cái này nhiều khả năng chạy" được liệt ở đây như một lỗi đạo đức, không phải lỗi văn phong.</p>`),

  slide(D, 13, 'Elevator speech — the definition',
    `<p class="y-chinh">🎯 A presentation that persuades the listener in <strong>less than thirty seconds, or around a hundred words</strong>.</p>
     <p>The name comes from the idea that during a short elevator ride — perhaps ten floors — carefully chosen words can make a difference.</p>
     <p class="meo">💡 Two hard numbers: 30 seconds, ~100 words. Write it out and count. Most first drafts are three times too long.</p>`,
    `<p class="y-chinh">🎯 Một bài trình bày thuyết phục người nghe trong <strong>dưới ba mươi giây, tức khoảng một trăm từ</strong>.</p>
     <p>Tên gọi đến từ ý tưởng rằng trong một chuyến thang máy ngắn — cỡ mười tầng — vài câu chọn lọc kỹ có thể tạo ra khác biệt.</p>
     <p class="meo">💡 Hai con số cứng: 30 giây, khoảng 100 từ. Hãy viết ra và đếm. Phần lớn bản nháp đầu tiên dài gấp ba.</p>`),

  slide(D, 14, 'Creating an elevator speech — five questions',
    `<p class="y-chinh">🎯 Answer these five before you write a single sentence.</p>
     <ol>
       <li>What is the topic, product or service?</li>
       <li>Who are you?</li>
       <li>Who is the target market (if applicable)?</li>
       <li>What is the revenue model (if applicable)?</li>
       <li>What or who is the competition, and what are your advantages?</li>
     </ol>
     <p class="meo">💡 These are the same questions as the proposal in Lesson 7, compressed. If you have written the proposal, the elevator speech is an extraction job, not a new piece of writing.</p>`,
    `<p class="y-chinh">🎯 Trả lời năm câu này trước khi viết bất kỳ câu nào.</p>
     <ol>
       <li>Chủ đề, sản phẩm hay dịch vụ là gì?</li>
       <li>Bạn là ai?</li>
       <li>Thị trường mục tiêu là ai (nếu có)?</li>
       <li>Mô hình doanh thu là gì (nếu có)?</li>
       <li>Đối thủ là ai/là gì, và lợi thế của bạn là gì?</li>
     </ol>
     <p class="meo">💡 Đây chính là các câu hỏi của bản đề xuất ở Bài 7, nén lại. Nếu bạn đã viết bản đề xuất thì elevator speech là việc rút gọn, không phải viết mới.</p>`),

  slide(D, 15, 'Parts of an elevator speech',
    `<p class="y-chinh">🎯 Five speech components mapped onto the thirty seconds.</p>
     <ul>
       <li><span class="nhan">Attention statement</span> → hook + information about you.</li>
       <li><span class="nhan">Introduction</span> → what you offer.</li>
       <li><span class="nhan">Body</span> → benefits; what is in it for the listener.</li>
       <li><span class="nhan">Conclusion</span> → an example that sums it up.</li>
       <li><span class="nhan">Residual message</span> → <strong>call for action</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phần hay bị bỏ nhất là phần cuối:</strong> without a call for action the listener has nothing to do, and a speech that asks for nothing gets nothing.</p>`,
    `<p class="y-chinh">🎯 Năm thành phần của một bài nói, ánh xạ vào ba mươi giây.</p>
     <ul>
       <li><span class="nhan">Câu gây chú ý</span> → móc câu + thông tin về bạn.</li>
       <li><span class="nhan">Mở đầu</span> → bạn chào cái gì.</li>
       <li><span class="nhan">Thân</span> → lợi ích; người nghe được gì.</li>
       <li><span class="nhan">Kết</span> → một ví dụ gói lại toàn bộ.</li>
       <li><span class="nhan">Dư âm</span> → <strong>lời kêu gọi hành động</strong>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phần hay bị bỏ nhất là phần cuối:</strong> không có lời kêu gọi hành động thì người nghe chẳng có việc gì để làm, và bài nói không xin gì thì không nhận được gì.</p>`),

  slide(D, 16, 'Example elevator speech',
    `<p class="y-chinh">🎯 The deck's own worked example, and it is worth dissecting.</p>
     <p><em>"How are you doing?" — "Great! Glad you asked. I'm with (X Company) and we just received this new (product X) — it is amazing. It beats the competition hands down for a third of the price. Smaller, faster, and less expensive make it a winner. It's already a sales leader. Hey, if you know anyone who might be interested, call me!"</em> (hands over a business card as a visual aid)</p>
     <p><span class="nhan">Mapping</span> — "Glad you asked, I'm with X" = attention + you · "we just received product X" = what you offer · "beats the competition for a third of the price" = benefit · "already a sales leader" = example · "call me" + card = call for action.</p>
     <p class="meo">💡 Note the card: even a thirty-second speech uses a visual aid, and it is the thing the listener still holds afterwards.</p>`,
    `<p class="y-chinh">🎯 Ví dụ hoàn chỉnh ngay trên slide, và rất đáng mổ xẻ.</p>
     <p><em>"Dạo này thế nào?" — "Tuyệt! May quá bạn hỏi. Mình đang làm ở (công ty X), bọn mình vừa nhận (sản phẩm X) mới — hay lắm. Nó đè bẹp đối thủ mà giá chỉ bằng một phần ba. Nhỏ hơn, nhanh hơn, rẻ hơn, thế là thắng. Giờ đã dẫn đầu doanh số rồi. À, nếu bạn biết ai quan tâm thì gọi mình nhé!"</em> (đưa danh thiếp như một công cụ trực quan)</p>
     <p><span class="nhan">Đối chiếu</span> — "may quá bạn hỏi, mình làm ở X" = gây chú ý + giới thiệu bản thân · "vừa nhận sản phẩm X" = chào cái gì · "đè bẹp đối thủ, giá bằng một phần ba" = lợi ích · "đã dẫn đầu doanh số" = ví dụ · "gọi mình nhé" + danh thiếp = kêu gọi hành động.</p>
     <p class="meo">💡 Để ý tấm danh thiếp: ngay cả bài nói ba mươi giây cũng dùng công cụ trực quan, và đó là thứ người nghe còn cầm trong tay sau đó.</p>`),

  slide(D, 17, 'Activity — prepare and present your elevator speech',
    `<p class="y-chinh">🎯 Prepare an elevator speech of no more than thirty seconds and present it to the class.</p>
     <p class="meo">💡 Rehearse against a clock, out loud. Reading it silently always fits; speaking it rarely does.</p>`,
    `<p class="y-chinh">🎯 Chuẩn bị một elevator speech không quá ba mươi giây và trình bày trước lớp.</p>
     <p class="meo">💡 Hãy tập có bấm giờ, và tập nói thành tiếng. Đọc thầm thì lúc nào cũng vừa; nói ra thì hiếm khi vừa.</p>`),

  slide(D, 18, 'Key takeaways (4)',
    `<p class="y-chinh">🎯 The lesson in four sentences.</p>
     <ol>
       <li>Persuasion is presenting arguments for change; <strong>motivation is the force that brings change about</strong>. Measurable gain assesses the audience's response.</li>
       <li>We communicate to gain information, get to know one another, understand our situation, come to know our identity, and meet interpersonal needs.</li>
       <li>Speaking to persuade <strong>should not involve manipulation, coercion, false logic</strong> or other unethical techniques.</li>
       <li>You rarely know when the opportunity to inform or persuade will appear — with an elevator speech, you are prepared.</li>
     </ol>
     <p class="meo">💡 Takeaway 1 answers objective 2: persuasion is the argument, motivation is the force. They are related, not identical.</p>`,
    `<p class="y-chinh">🎯 Cả bài gói trong bốn câu.</p>
     <ol>
       <li>Thuyết phục là đưa ra lập luận cho sự thay đổi; <strong>tạo động lực là lực làm cho thay đổi ấy xảy ra</strong>. Mức thu được đo lường được là thước đo phản ứng của khán giả.</li>
       <li>Ta giao tiếp để lấy thông tin, để hiểu nhau, để hiểu hoàn cảnh, để nhận ra bản sắc của mình, và để đáp ứng các nhu cầu liên cá nhân.</li>
       <li>Nói để thuyết phục <strong>không được dính tới thao túng, cưỡng ép, nguỵ biện</strong> hay những kỹ thuật phi đạo đức khác.</li>
       <li>Bạn hiếm khi biết trước lúc nào cơ hội thông tin hay thuyết phục xuất hiện — có sẵn elevator speech là có sẵn sự chuẩn bị.</li>
     </ol>
     <p class="meo">💡 Ý số 1 trả lời mục tiêu 2: thuyết phục là lập luận, tạo động lực là lực đẩy. Chúng liên quan nhau, không đồng nhất.</p>`),

  slide(D, 19, 'Exercises (2)',
    `<p class="y-chinh">🎯 Two exercises.</p>
     <ul>
       <li><span class="nhan">1. Pick an online advertisement</span> you find particularly effective or ineffective. Why does it succeed or fail in persuading you? Discuss with classmates.</li>
       <li><span class="nhan">2. Consider your life against Maslow's hierarchy.</span> Which levels have you attained? Were you at the same level two or three years ago? How do you expect it to change?</li>
     </ul>
     <p class="meo">💡 For exercise 1, answer with the eleven ethical points: many ads that "work" do so by breaking point 5 or point 9, and naming which one is the graded insight.</p>`,
    `<p class="y-chinh">🎯 Hai bài tập.</p>
     <ul>
       <li><span class="nhan">1. Chọn một quảng cáo trên mạng</span> mà bạn thấy đặc biệt hiệu quả hoặc đặc biệt dở. Vì sao nó thuyết phục được bạn, hoặc vì sao không? Thảo luận với bạn học.</li>
       <li><span class="nhan">2. Soi đời mình theo thang nhu cầu Maslow.</span> Bạn đã đạt tới những bậc nào? Hai ba năm trước bạn có ở cùng bậc đó không? Bạn nghĩ nó sẽ đổi thế nào?</li>
     </ul>
     <p class="meo">💡 Với bài 1, hãy trả lời bằng mười một điều đạo đức: nhiều quảng cáo "ăn khách" chính là nhờ vi phạm điều 5 hoặc điều 9, và gọi được tên điều nào mới là phần được chấm.</p>`),

  slide(D, 20, 'End of Lesson 15',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Difference between persuasion and motivation?</li>
       <li>Three of the eleven ethical prohibitions, from memory?</li>
       <li>The five parts of an elevator speech, ending with what?</li>
       <li>What does "measurable gain" ask you to define?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Khác nhau giữa thuyết phục và tạo động lực?</li>
       <li>Nhớ được ba trong mười một điều cấm về đạo đức chứ?</li>
       <li>Năm phần của elevator speech, kết bằng cái gì?</li>
       <li>"Mức thu được đo lường được" buộc bạn phải định nghĩa điều gì?</li>
     </ol>`),

  books([
    ['bcs', 'chương Presentations to Persuade — ethics, elevator speech', 'chương Presentations to Persuade — đạo đức, elevator speech'],
    ['bc7', 'chương về persuasive messages', 'chương về thông điệp thuyết phục'],
  ]),

  bi(
    `<h3>✅ The gap this fills</h3>
     <p>The syllabus asks about the elevator speech (CQ12.1). In the old Academy course the phrase appeared zero times, persuasion theory was absent, and the eleven ethical prohibitions — the boundary of what you may do to an audience — were nowhere in the material.</p>`,
    `<h3>✅ Lỗ hổng được lấp</h3>
     <p>Syllabus hỏi về elevator speech (CQ12.1). Ở khoá Academy cũ, cụm này xuất hiện đúng 0 lần, phần lý thuyết thuyết phục thì không có, còn mười một điều cấm về đạo đức — ranh giới của những gì bạn được phép làm với người nghe — cũng không có mặt trong tài liệu.</p>`),
].join('\n');
