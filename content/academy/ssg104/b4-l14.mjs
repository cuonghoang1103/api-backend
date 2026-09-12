/**
 * Buổi 4 · Bài 14 — Nonverbal communication / Nonverbal delivery (23 slide).
 *
 * Bám bộ "Session 4_Groups _ Teams in Action_Lesson 14_Nonverbal
 * communication.pptx". Syllabus hỏi CQ11.1 về phân loại giao tiếp phi ngôn
 * ngữ; bản Academy cũ chỉ liệt kê các kênh trong đúng một dòng, không có tám
 * loại, không có tam giác sân khấu, không có tiêu chí làm slide.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l14';

export const b4l14 = [
  walkHead(D, 1, 23,
    'Session IV turns theory into performance. Eight types of nonverbal communication (slide 6) is the memorisation item; the visual-aid criteria (slide 16) are what your own presentation will be marked against.',
    'Buổi IV chuyển lý thuyết thành phần trình diễn. Tám loại giao tiếp phi ngôn ngữ (slide 6) là mục cần thuộc; bộ tiêu chí làm slide (slide 16) chính là thứ bài thuyết trình của bạn sẽ bị chấm theo.'),

  slide(D, 1, 'Nonverbal delivery — Session IV',
    `<p class="y-chinh">🎯 Title slide. Session IV covers nonverbal delivery, persuasive presentation, meetings, professional writing, email and letters, and reports.</p>
     <p class="meo">💡 Everything in this session is assessed: Group Assignment 1 is a persuasive presentation, and the group project ends in a presentation and a report.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề. Buổi IV gồm: trình bày phi ngôn ngữ, thuyết trình thuyết phục, cuộc họp, viết chuyên nghiệp, email và thư, báo cáo.</p>
     <p class="meo">💡 Mọi thứ trong buổi này đều được chấm: Group Assignment 1 là một bài thuyết trình thuyết phục, còn dự án nhóm kết thúc bằng thuyết trình và báo cáo.</p>`),

  slide(D, 2, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives, all beginning with "demonstrate" — this lesson is graded by doing, not by explaining.</p>
     <ol>
       <li>Demonstrate how to use <strong>movement</strong> to increase the effectiveness of your presentation.</li>
       <li>Demonstrate how to use <strong>visual aids</strong> effectively.</li>
       <li>Demonstrate <strong>three ways to improve</strong> nonverbal communication.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu, đều bắt đầu bằng "thể hiện được" — bài này chấm bằng việc làm, không phải bằng việc giải thích.</p>
     <ol>
       <li>Thể hiện được cách dùng <strong>chuyển động</strong> để tăng hiệu quả bài thuyết trình.</li>
       <li>Thể hiện được cách dùng <strong>công cụ trực quan</strong> hiệu quả.</li>
       <li>Thể hiện được <strong>ba cách cải thiện</strong> giao tiếp phi ngôn ngữ.</li>
     </ol>`),

  slide(D, 3, 'Chapter outline (5 parts)',
    `<p class="y-chinh">🎯 Five parts.</p>
     <ol>
       <li>Nonverbal communication definition</li>
       <li>Types of nonverbal communication</li>
       <li>Movement in your speech</li>
       <li>Visual aids</li>
       <li>Nonverbal strategies for success with your audience</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm phần.</p>
     <ol>
       <li>Định nghĩa giao tiếp phi ngôn ngữ</li>
       <li>Các loại giao tiếp phi ngôn ngữ</li>
       <li>Chuyển động trong bài nói</li>
       <li>Công cụ trực quan</li>
       <li>Chiến lược phi ngôn ngữ để thành công với khán giả</li>
     </ol>`),

  slide(D, 4, 'Nonverbal communication is fluid',
    `<p class="y-chinh">🎯 <strong>Nonverbal communication is the process of conveying a message without the use of words.</strong></p>
     <p><span class="nhan">It includes</span> gestures · facial expressions · tone of voice · timing · posture · and where you stand as you communicate.</p>
     <p class="meo">💡 "Fluid" is the operative word: unlike a sentence, you cannot stop sending nonverbal signals. Standing still and saying nothing is still a message.</p>`,
    `<p class="y-chinh">🎯 <strong>Giao tiếp phi ngôn ngữ là quá trình truyền đi một thông điệp mà không dùng lời.</strong></p>
     <p><span class="nhan">Nó bao gồm</span> cử chỉ · nét mặt · giọng điệu · nhịp thời gian · dáng đứng · và cả chỗ bạn đứng khi giao tiếp.</p>
     <p class="meo">💡 Chữ "trôi chảy, không ngắt" mới là mấu chốt: khác với một câu nói, bạn không thể ngừng phát tín hiệu phi ngôn ngữ. Đứng im và không nói gì vẫn là một thông điệp.</p>`),

  slide(D, 5, 'Eight types of nonverbal communication',
    `<p class="y-chinh">🎯 The list to memorise — this is CQ11.1 in the syllabus.</p>
     <ol class="hai-cot">
       <li><span class="nhan">Space</span> — distance and territory</li>
       <li><span class="nhan">Time</span> — punctuality, pace, waiting</li>
       <li><span class="nhan">Physical characteristics</span></li>
       <li><span class="nhan">Body movements</span> — gestures, posture</li>
       <li><span class="nhan">Touch</span></li>
       <li><span class="nhan">Paralanguage</span> — how the voice sounds, not what it says</li>
       <li><span class="nhan">Artifacts</span> — clothing, objects, what you carry</li>
       <li><span class="nhan">Environment</span> — the room itself</li>
     </ol>
     <p class="meo">💡 Two of these are usually forgotten: paralanguage (tone, pitch, pace, pauses) and artifacts. Both are decided before you open your mouth.</p>`,
    `<p class="y-chinh">🎯 Danh sách cần thuộc — đây chính là CQ11.1 trong syllabus.</p>
     <ol class="hai-cot">
       <li><span class="nhan">Không gian</span> — khoảng cách và lãnh thổ</li>
       <li><span class="nhan">Thời gian</span> — đúng giờ, nhịp độ, bắt chờ</li>
       <li><span class="nhan">Đặc điểm cơ thể</span></li>
       <li><span class="nhan">Chuyển động cơ thể</span> — cử chỉ, dáng điệu</li>
       <li><span class="nhan">Đụng chạm</span></li>
       <li><span class="nhan">Cận ngôn (paralanguage)</span> — giọng nghe thế nào, không phải nói gì</li>
       <li><span class="nhan">Vật phẩm</span> — quần áo, đồ vật, thứ bạn mang theo</li>
       <li><span class="nhan">Môi trường</span> — bản thân căn phòng</li>
     </ol>
     <p class="meo">💡 Hai loại hay bị quên nhất: cận ngôn (giọng điệu, cao độ, tốc độ, quãng ngắt) và vật phẩm. Cả hai đều được quyết trước khi bạn mở miệng.</p>`),

  slide(D, 6, 'Space',
    `<p class="y-chinh">🎯 Illustration of the first type.</p>
     <p class="meo">💡 For a presentation, space is a tool: stepping closer signals importance, stepping back gives the audience room to think. Standing in exactly one spot for ten minutes wastes the tool.</p>`,
    `<p class="y-chinh">🎯 Minh hoạ cho loại thứ nhất.</p>
     <p class="meo">💡 Với một bài thuyết trình, không gian là công cụ: bước tới gần báo hiệu điều quan trọng, lùi lại cho khán giả khoảng trống để nghĩ. Đứng đúng một chỗ suốt mười phút là phí công cụ đó.</p>`),

  slide(D, 7, 'Environment',
    `<p class="y-chinh">🎯 Environment involves the <strong>physical and psychological</strong> aspects of the communication context.</p>
     <ul>
       <li>The perception of one's environment influences one's reaction to it.</li>
       <li>Results produced in an environment designed to facilitate creativity, interaction and collaboration are worth the effort.</li>
     </ul>
     <p class="meo">💡 Practical version for a group meeting: a room where everyone can see each other's faces produces different discussion from a row of seats facing one screen.</p>`,
    `<p class="y-chinh">🎯 Môi trường bao gồm các khía cạnh <strong>vật lý và tâm lý</strong> của bối cảnh giao tiếp.</p>
     <ul>
       <li>Cách một người cảm nhận môi trường sẽ chi phối phản ứng của họ với nó.</li>
       <li>Những kết quả tạo ra trong môi trường được thiết kế để khuyến khích sáng tạo, tương tác và cộng tác là xứng đáng với công sức bỏ ra.</li>
     </ul>
     <p class="meo">💡 Phiên bản thực dụng cho một buổi họp nhóm: căn phòng mà ai cũng nhìn thấy mặt nhau sinh ra kiểu thảo luận khác hẳn dãy ghế cùng quay về một màn hình.</p>`),

  slide(D, 8, 'Movement in your speech — behaviours to avoid',
    `<p class="y-chinh">🎯 The slide asks you to choose between two speakers.</p>
     <ul>
       <li>One who <strong>moves confidently</strong> across the stage — or one who <strong>hides behind the podium</strong>.</li>
       <li>One who expresses herself nonverbally with purpose and meaning — or one who <strong>crosses his arms or clings to the lectern</strong>.</li>
     </ul>
     <p>Audiences respond most positively to open, dynamic speakers who convey the feeling of being at ease with their bodies.</p>
     <p class="meo">💡 Note the three named faults: hiding behind furniture, crossed arms, gripping the lectern. All three are things nervous speakers do to hold still — and all three read as closed.</p>`,
    `<p class="y-chinh">🎯 Slide bắt bạn chọn giữa hai kiểu người nói.</p>
     <ul>
       <li>Người <strong>di chuyển tự tin</strong> trên sân khấu — hay người <strong>nấp sau bục</strong>.</li>
       <li>Người biểu đạt phi ngôn ngữ có chủ đích và có ý nghĩa — hay người <strong>khoanh tay hoặc bám chặt vào bục</strong>.</li>
     </ul>
     <p>Khán giả phản ứng tích cực nhất với người nói cởi mở, sinh động, toát ra vẻ thoải mái với cơ thể mình.</p>
     <p class="meo">💡 Để ý ba lỗi được gọi tên: nấp sau đồ đạc, khoanh tay, bấu vào bục. Cả ba đều là thứ người hồi hộp làm để giữ mình đứng yên — và cả ba đều bị đọc thành sự khép kín.</p>`),

  slide(D, 9, "Positions on the stage — the speaker's triangle",
    `<p class="y-chinh">🎯 A movement pattern you can plan in advance.</p>
     <ol>
       <li>Start at position 1 for the introduction.</li>
       <li>Move to position 2 for the first point.</li>
       <li>Move across for the second point.</li>
       <li>Return to the original position for the third point and the conclusion.</li>
     </ol>
     <p class="meo">💡 Why it works: movement marks structure. The audience sees the transition before they hear it, and returning to the start signals "we are closing".</p>`,
    `<p class="y-chinh">🎯 Một mô hình di chuyển bạn có thể tính trước.</p>
     <ol>
       <li>Bắt đầu ở vị trí 1 khi mở bài.</li>
       <li>Bước sang vị trí 2 cho ý thứ nhất.</li>
       <li>Bước ngang sang cho ý thứ hai.</li>
       <li>Quay lại vị trí ban đầu cho ý thứ ba và phần kết.</li>
     </ol>
     <p class="meo">💡 Vì sao hiệu quả: di chuyển đánh dấu cấu trúc. Khán giả nhìn thấy sự chuyển ý trước khi nghe thấy nó, và việc quay về chỗ xuất phát báo hiệu "ta đang khép lại".</p>`),

  slide(D, 10, 'Gestures — the three steps',
    `<p class="y-chinh">🎯 Gestures involve using your arms and hands while communicating, in three steps.</p>
     <ol>
       <li><span class="nhan">Anticipation</span> — leading up to a main point, raise your hand slightly, perhaps waist high.</li>
       <li><span class="nhan">Implementation</span> — use your arms and hands <strong>above your waist</strong>.</li>
       <li><span class="nhan">Relaxation</span> — the letting-go motion complements your residual message and concludes the motion.</li>
     </ol>
     <p class="meo">💡 The rule hidden in step 2: gestures below the waist are not seen by the back rows, so they cost energy and deliver nothing.</p>`,
    `<p class="y-chinh">🎯 Cử chỉ là việc dùng tay và cánh tay khi giao tiếp, theo ba bước.</p>
     <ol>
       <li><span class="nhan">Chuẩn bị</span> — khi dẫn tới một ý chính, nâng tay lên chút, cỡ ngang thắt lưng.</li>
       <li><span class="nhan">Thực hiện</span> — dùng tay và cánh tay <strong>ở phía trên thắt lưng</strong>.</li>
       <li><span class="nhan">Buông</span> — động tác thả tay bổ trợ cho dư âm thông điệp và khép lại chuyển động.</li>
     </ol>
     <p class="meo">💡 Quy tắc ẩn trong bước 2: cử chỉ dưới thắt lưng thì hàng ghế cuối không thấy, nên tốn sức mà chẳng truyền được gì.</p>`),

  slide(D, 11, 'Facial gestures and eye contact',
    `<p class="y-chinh">🎯 Facial gestures use your face to display feelings and attitudes nonverbally.</p>
     <ul>
       <li>They may <strong>reinforce or contradict</strong> the spoken word, and their impact cannot be underestimated.</li>
       <li>They should reflect the tone and emotion of your verbal communication.</li>
       <li><span class="nhan">Eye contact</span> — <strong>the single most important facial gesture</strong>: the speaker's gaze that engages audience members.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Khi lời và mặt mâu thuẫn:</strong> the audience believes the face. Saying "we are confident about this timeline" while grimacing tells them the opposite, and they will act on what they saw.</p>`,
    `<p class="y-chinh">🎯 Cử chỉ khuôn mặt là việc dùng nét mặt để bộc lộ cảm xúc và thái độ mà không cần lời.</p>
     <ul>
       <li>Chúng có thể <strong>củng cố hoặc mâu thuẫn</strong> với lời nói, và sức tác động thì không thể xem nhẹ.</li>
       <li>Chúng phải phản ánh đúng giọng điệu và cảm xúc của phần lời.</li>
       <li><span class="nhan">Giao tiếp bằng mắt</span> — <strong>cử chỉ khuôn mặt quan trọng nhất</strong>: ánh nhìn của người nói cuốn lấy người nghe.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Khi lời và mặt mâu thuẫn:</strong> khán giả tin khuôn mặt. Nói "chúng tôi tự tin về tiến độ này" trong khi mặt nhăn lại là đang nói với họ điều ngược lại, và họ sẽ hành động theo thứ họ nhìn thấy.</p>`),

  slide(D, 12, 'Visual aids',
    `<p class="y-chinh">🎯 Visual aids are an important nonverbal aspect of your speech <strong>that you can control</strong>.</p>
     <p>They include handouts, overhead transparencies, drawings on the whiteboard, PowerPoint slides and many other props.</p>
     <p class="meo">💡 "That you can control" is the argument of this whole section: nerves are hard to control, slides are not. Preparation moves the marks you can still earn.</p>`,
    `<p class="y-chinh">🎯 Công cụ trực quan là một phần phi ngôn ngữ quan trọng của bài nói <strong>mà bạn kiểm soát được</strong>.</p>
     <p>Chúng gồm tài liệu phát tay, phim trong, hình vẽ trên bảng trắng, slide PowerPoint và nhiều đạo cụ khác.</p>
     <p class="meo">💡 Cụm "mà bạn kiểm soát được" chính là lập luận của cả phần này: hồi hộp thì khó điều khiển, còn slide thì không. Chuẩn bị là cách dịch chuyển phần điểm bạn vẫn còn kiếm được.</p>`),

  slide(D, 13, 'What visual aids accomplish (6 goals)',
    `<p class="y-chinh">🎯 Six things a good visual aid does.</p>
     <ul>
       <li>Make your speech more interesting.</li>
       <li>Enhance your credibility as a speaker.</li>
       <li>Serve as guides to transitions, helping the audience stay on track.</li>
       <li>Communicate complex or intriguing information in a short time.</li>
       <li>Reinforce your verbal message.</li>
       <li>Help the audience use and retain the information.</li>
     </ul>
     <p class="meo">💡 Test any slide against this list. A slide that does none of the six is decoration, and decoration competes with you for attention.</p>`,
    `<p class="y-chinh">🎯 Sáu việc mà một công cụ trực quan tốt làm được.</p>
     <ul>
       <li>Làm bài nói thú vị hơn.</li>
       <li>Tăng độ tin cậy của người nói.</li>
       <li>Làm mốc chuyển ý, giúp khán giả bám được mạch.</li>
       <li>Truyền đạt thông tin phức tạp hoặc hấp dẫn trong thời gian ngắn.</li>
       <li>Củng cố thông điệp bằng lời.</li>
       <li>Giúp khán giả sử dụng và ghi nhớ thông tin.</li>
     </ul>
     <p class="meo">💡 Hãy thử mọi slide bằng danh sách này. Slide không làm được cái nào trong sáu việc đó là đồ trang trí, mà đồ trang trí thì tranh sự chú ý với chính bạn.</p>`),

  slide(D, 14, 'Purpose, emphasis, support and clarity',
    `<p class="y-chinh">🎯 Two requirements.</p>
     <ul>
       <li>The purpose of each visual aid should be clear and <strong>almost speak for itself</strong>.</li>
       <li>Visual aids provide necessary support for your position, illustrate relationships, and demonstrate trends.</li>
     </ul>
     <p class="meo">💡 "Almost speak for itself" is a usable test: show the slide to someone for five seconds and ask what it claims. If they cannot say, the slide is not finished.</p>`,
    `<p class="y-chinh">🎯 Hai yêu cầu.</p>
     <ul>
       <li>Mục đích của mỗi công cụ trực quan phải rõ, và <strong>gần như tự nó nói lên được</strong>.</li>
       <li>Công cụ trực quan cung cấp chỗ dựa cần thiết cho lập trường của bạn, minh hoạ các mối quan hệ và cho thấy xu hướng.</li>
     </ul>
     <p class="meo">💡 "Gần như tự nó nói lên được" là một phép thử dùng được: đưa slide cho ai đó xem năm giây rồi hỏi nó đang khẳng định điều gì. Nếu họ không nói được thì slide chưa xong.</p>`),

  slide(D, 15, 'Methods and materials',
    `<p class="y-chinh">🎯 Match the medium to the message.</p>
     <ul>
       <li><span class="nhan">Chart or diagram</span> — to show a timeline of events to date.</li>
       <li><span class="nhan">Bar or pie graph</span> — to show percentages.</li>
       <li>Pictures · map · sound and music · video clips · flip charts · handouts · transparencies and slides.</li>
     </ul>
     <p class="meo">💡 The first two lines are a rule, not examples: time goes on a timeline, proportion goes on a bar or pie. Choosing the wrong one forces the audience to do work you should have done.</p>`,
    `<p class="y-chinh">🎯 Chọn phương tiện hợp với thông điệp.</p>
     <ul>
       <li><span class="nhan">Sơ đồ hoặc biểu đồ</span> — để trình bày dòng thời gian các sự kiện đã diễn ra.</li>
       <li><span class="nhan">Biểu đồ cột hoặc tròn</span> — để thể hiện tỷ lệ phần trăm.</li>
       <li>Hình ảnh · bản đồ · âm thanh và nhạc · đoạn video · bảng lật · tài liệu phát tay · phim trong và slide.</li>
     </ul>
     <p class="meo">💡 Hai dòng đầu là một quy tắc chứ không phải ví dụ: thời gian thì vẽ lên trục thời gian, tỷ lệ thì vẽ bằng cột hoặc hình tròn. Chọn sai là bắt khán giả làm phần việc lẽ ra của bạn.</p>`),

  slide(D, 16, 'Preparing visual aids — the four criteria',
    `<p class="y-chinh">🎯 Four criteria, and they are the marking sheet for your slides.</p>
     <ul>
       <li><span class="nhan">Big</span> — legible for everyone; "back row certified".</li>
       <li><span class="nhan">Clear</span> — the audience should get it the first time they see it.</li>
       <li><span class="nhan">Simple</span> — they should <em>simplify</em> the concepts they illustrate.</li>
       <li><span class="nhan">Consistent</span> — reinforce continuity by using the same visual style.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy phổ biến nhất:</strong> a slide that is correct but dense fails "clear" and "simple" at once. Cutting content is the fix; shrinking the font is not.</p>`,
    `<p class="y-chinh">🎯 Bốn tiêu chí, và đó chính là phiếu chấm cho slide của bạn.</p>
     <ul>
       <li><span class="nhan">To</span> — ai cũng đọc được; đạt chuẩn "nhìn từ hàng ghế cuối".</li>
       <li><span class="nhan">Rõ</span> — khán giả phải hiểu ngay lần nhìn đầu tiên.</li>
       <li><span class="nhan">Đơn giản</span> — slide phải <em>làm đơn giản hoá</em> khái niệm mà nó minh hoạ.</li>
       <li><span class="nhan">Nhất quán</span> — củng cố mạch liên tục bằng cách dùng chung một phong cách hình ảnh.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy phổ biến nhất:</strong> một slide đúng nhưng dày đặc chữ là trượt cả "rõ" lẫn "đơn giản" cùng lúc. Cách chữa là bớt nội dung, không phải thu nhỏ cỡ chữ.</p>`),

  slide(D, 17, 'Using visual aids — three dos and don\'ts',
    `<p class="y-chinh">🎯 Three rules for the moment of delivery.</p>
     <ol>
       <li><span class="nhan">Do</span> make a clear connection between your words and the visual aid.</li>
       <li><span class="nhan">Do not</span> distract the audience with it — blocking their view of you, or adjusting it repeatedly while trying to speak.</li>
       <li><span class="nhan">Do</span> speak to your <strong>audience</strong> — not to the whiteboard, the video, or the other visual aids.</li>
     </ol>
     <p class="meo">💡 Rule 3 is the most broken rule in student presentations, and the easiest to fix: glance at the slide, then turn back before you speak.</p>`,
    `<p class="y-chinh">🎯 Ba quy tắc cho lúc trình bày.</p>
     <ol>
       <li><span class="nhan">Nên</span> nối rõ ràng giữa lời bạn nói và công cụ trực quan.</li>
       <li><span class="nhan">Không nên</span> làm khán giả phân tâm vì nó — che mất tầm nhìn về phía bạn, hay chỉnh tới chỉnh lui trong lúc đang nói.</li>
       <li><span class="nhan">Nên</span> nói với <strong>khán giả</strong> — đừng nói với bảng trắng, với video hay với đống công cụ trực quan.</li>
     </ol>
     <p class="meo">💡 Quy tắc 3 bị vi phạm nhiều nhất trong bài thuyết trình của sinh viên, và cũng dễ sửa nhất: liếc slide, rồi quay lại phía khán giả mới nói.</p>`),

  slide(D, 18, 'Using PowerPoint as a visual aid',
    `<p class="y-chinh">🎯 "How you prepare your slides and use the tool will determine your effectiveness."</p>
     <p class="meo">💡 The sentence puts preparation and use on the same line. A perfect deck used badly and a poor deck used well both underperform.</p>`,
    `<p class="y-chinh">🎯 "Cách bạn chuẩn bị slide và cách bạn dùng công cụ sẽ quyết định hiệu quả của bạn."</p>
     <p class="meo">💡 Câu này đặt việc chuẩn bị và việc sử dụng lên cùng một hàng. Bộ slide hoàn hảo mà dùng dở, hay bộ slide dở mà dùng khéo, đều không đạt.</p>`),

  slide(D, 19, 'Use of colour',
    `<p class="y-chinh">🎯 Colour has two edges.</p>
     <ul>
       <li>People love colour and appreciate the visual stimulation of a colourful presentation.</li>
       <li>Colour can also <strong>distract and turn off</strong> an audience.</li>
       <li>You will be selecting which colours to use for headers and key words, and how they relate to the colours in your images.</li>
     </ul>
     <p class="meo">💡 A workable limit: one accent colour for emphasis, one neutral for text. Every extra colour has to earn its place by carrying meaning.</p>`,
    `<p class="y-chinh">🎯 Màu sắc là con dao hai lưỡi.</p>
     <ul>
       <li>Người ta thích màu và hưởng ứng sự kích thích thị giác của một bài trình bày nhiều màu.</li>
       <li>Màu cũng có thể <strong>làm phân tâm và khiến khán giả quay lưng</strong>.</li>
       <li>Bạn sẽ phải chọn màu cho tiêu đề và từ khoá, và chọn sao cho ăn với màu trong hình ảnh.</li>
     </ul>
     <p class="meo">💡 Một giới hạn dùng được: một màu nhấn để làm nổi, một màu trung tính cho chữ. Mỗi màu thêm vào phải tự chứng minh chỗ đứng bằng việc mang một ý nghĩa.</p>`),

  slide(D, 20, 'Helpful hints for visual aids',
    `<p class="y-chinh">🎯 Ten practical rules.</p>
     <ul class="hai-cot">
       <li>Keep visual aids simple</li>
       <li>One key idea per slide</li>
       <li>Avoid clutter and overwhelming slides</li>
       <li>Large, bold fonts readable from twenty feet</li>
       <li>Contrasting colours for a dynamic effect</li>
       <li>Analogous colours to unify</li>
       <li>Clip art with permission and sparingly</li>
       <li>Edit and proofread every slide</li>
       <li>Handouts of your visuals afterwards</li>
       <li>Check the room beforehand · have a backup plan</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hai mục cuối là bảo hiểm:</strong> checking the room and having a backup are the only two items that protect you when the projector fails five minutes before a graded presentation.</p>`,
    `<p class="y-chinh">🎯 Mười quy tắc thực dụng.</p>
     <ul class="hai-cot">
       <li>Giữ slide đơn giản</li>
       <li>Mỗi slide một ý chính</li>
       <li>Tránh rối rắm, tránh slide quá tải</li>
       <li>Chữ to, đậm, đọc được từ khoảng 6 mét</li>
       <li>Màu tương phản để tạo hiệu ứng sinh động</li>
       <li>Màu tương đồng để tạo sự thống nhất</li>
       <li>Dùng clip art có phép và dùng ít thôi</li>
       <li>Soát và sửa lỗi từng slide</li>
       <li>Phát bản in slide sau khi trình bày</li>
       <li>Kiểm tra phòng trước · có phương án dự phòng</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hai mục cuối là bảo hiểm:</strong> kiểm tra phòng và có phương án dự phòng là hai thứ duy nhất cứu bạn khi máy chiếu chết năm phút trước một bài thuyết trình tính điểm.</p>`),

  slide(D, 21, 'Nonverbal strategies for success with your audience',
    `<p class="y-chinh">🎯 Three strategies — and these are objective 3 of the lesson.</p>
     <ul>
       <li><span class="nhan">Watch reactions</span> — read the audience while you speak and adjust.</li>
       <li><span class="nhan">Enrol an observer</span> — ask someone to watch you specifically and report back.</li>
       <li><span class="nhan">Focus on a specific type of nonverbal communication</span> — improve one channel at a time.</li>
     </ul>
     <p class="meo">💡 Strategy 3 is why the eight types on slide 5 matter practically: "be better at body language" is not actionable; "keep gestures above the waist this week" is.</p>`,
    `<p class="y-chinh">🎯 Ba chiến lược — và đây chính là mục tiêu 3 của bài.</p>
     <ul>
       <li><span class="nhan">Quan sát phản ứng</span> — đọc khán giả ngay khi đang nói và điều chỉnh.</li>
       <li><span class="nhan">Nhờ một người quan sát</span> — nhờ ai đó chuyên nhìn bạn rồi phản hồi lại.</li>
       <li><span class="nhan">Tập trung vào một loại phi ngôn ngữ cụ thể</span> — cải thiện từng kênh một.</li>
     </ul>
     <p class="meo">💡 Chiến lược 3 là lý do tám loại ở slide 5 có giá trị thực tế: "cải thiện ngôn ngữ cơ thể" thì không làm được; "tuần này giữ cử chỉ trên thắt lưng" thì làm được.</p>`),

  slide(D, 22, 'Exercises (3)',
    `<p class="y-chinh">🎯 Three exercises, each isolating one variable.</p>
     <ol>
       <li><span class="nhan">Watch a TV programme with the sound off.</span> Can you understand it? Write what was easy and what was a challenge, and present it to the class.</li>
       <li><span class="nhan">Observe communication around you</span> — focus on specific actions such as face touching, blink rate or head nodding, and write a brief description.</li>
       <li><span class="nhan">Interview someone from a different culture</span> and ask for a specific cultural difference in nonverbal communication — for example a gesture not used in polite company.</li>
     </ol>
     <p class="meo">💡 Exercise 3 links straight back to Lesson 11: a gesture is only meaningful inside a culture, which is why the six dimensions and this lesson belong to the same course.</p>`,
    `<p class="y-chinh">🎯 Ba bài tập, mỗi bài cô lập một biến.</p>
     <ol>
       <li><span class="nhan">Xem một chương trình truyền hình tắt tiếng.</span> Bạn hiểu được không? Viết ra cái gì dễ hiểu, cái gì là thách thức, rồi trình bày trước lớp.</li>
       <li><span class="nhan">Quan sát giao tiếp quanh bạn</span> — tập trung vào hành vi cụ thể như đưa tay lên mặt, tần suất chớp mắt hay gật đầu, và viết mô tả ngắn.</li>
       <li><span class="nhan">Phỏng vấn một người thuộc nền văn hoá khác</span> và hỏi về một khác biệt phi ngôn ngữ cụ thể — ví dụ một cử chỉ không được dùng ở nơi lịch sự.</li>
     </ol>
     <p class="meo">💡 Bài tập 3 nối thẳng về Bài 11: một cử chỉ chỉ có nghĩa bên trong một nền văn hoá, và đó là lý do sáu chiều văn hoá cùng bài này nằm chung một môn học.</p>`),

  slide(D, 23, 'End of Lesson 14',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Eight types of nonverbal communication?</li>
       <li>The three steps of a gesture, and where your hands belong?</li>
       <li>The four criteria for a visual aid?</li>
       <li>Which facial gesture is the single most important?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Tám loại giao tiếp phi ngôn ngữ?</li>
       <li>Ba bước của một cử chỉ, và tay phải ở đâu?</li>
       <li>Bốn tiêu chí cho một công cụ trực quan?</li>
       <li>Cử chỉ khuôn mặt nào là quan trọng nhất?</li>
     </ol>`),

  books([
    ['bcs', 'chương Nonverbal Delivery — movement, gestures, visual aids', 'chương Nonverbal Delivery — chuyển động, cử chỉ, công cụ trực quan'],
    ['bc7', 'chương về nonverbal communication trong kinh doanh', 'chương về giao tiếp phi ngôn ngữ trong kinh doanh'],
  ]),

  bi(
    `<h3>✅ What the old course had here</h3>
     <p>One line listing the channels of communication. The eight types (CQ11.1), the speaker's triangle, the three-step gesture and the four visual-aid criteria were all absent — even though a graded presentation is 10% of this subject.</p>`,
    `<h3>✅ Khoá cũ có gì ở chỗ này</h3>
     <p>Đúng một dòng liệt kê các kênh giao tiếp. Tám loại phi ngôn ngữ (CQ11.1), tam giác sân khấu, cử chỉ ba bước và bốn tiêu chí công cụ trực quan đều không có — dù một bài thuyết trình tính điểm chiếm 10% điểm môn.</p>`),
].join('\n');
