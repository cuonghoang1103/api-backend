/**
 * Buổi 1 · Bài 2 — Cooperation (12 slide).
 *
 * Bám bộ slide "Session 1_..._Lesson 2_Cooperation.pptx". Đây là bài trả lời
 * cho mục tiêu 2–4 của Buổi 1 (định nghĩa hợp tác, phân biệt social value
 * orientation, các yếu tố ảnh hưởng tới hợp tác) — cả ba đều nằm trong 80 câu
 * hỏi ôn tập của syllabus và trước đây Academy KHÔNG có chữ nào về chúng.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's1-l2';

export const b1l2 = [
  walkHead(D, 1, 12,
    'Short deck, heavy content: the Prisoner\'s Dilemma and Social Value Orientation are the two things the exam asks about from this lesson.',
    'Bộ slide ngắn nhưng nặng: Thế lưỡng nan của người tù và Định hướng giá trị xã hội là hai thứ đề thi hỏi từ bài này.'),

  slide(D, 1, 'Communication and In-group Working Skills (cont.)',
    `<p class="y-chinh">🎯 Title slide — this deck continues Session I, so the learning objectives from Lesson 1 slide 9 still apply.</p>
     <p>This lesson covers objectives 2, 3 and 4: define cooperation, distinguish social value orientations, name the influences on cooperation.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề — bộ này tiếp nối Buổi I, nên các mục tiêu học tập ở slide 9 của Bài 1 vẫn còn hiệu lực.</p>
     <p>Bài này phủ mục tiêu 2, 3 và 4: định nghĩa hợp tác, phân biệt các định hướng giá trị xã hội, gọi tên các yếu tố ảnh hưởng tới hợp tác.</p>`),

  slide(D, 2, '2. Cooperation',
    `<p class="y-chinh">🎯 Section divider.</p>
     <p><span class="nhan">Working definition</span> — cooperation is acting together so that the <strong>combined</strong> outcome improves, even when acting alone would give you more in the short run.</p>
     <p class="meo">💡 Hold on to the phrase "even when acting alone would give you more". The next four slides are built entirely on that tension.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục.</p>
     <p><span class="nhan">Định nghĩa làm việc</span> — hợp tác là cùng hành động sao cho kết quả <strong>chung</strong> tốt lên, ngay cả khi làm một mình thì trước mắt bạn được nhiều hơn.</p>
     <p class="meo">💡 Hãy giữ lấy vế "ngay cả khi làm một mình thì được nhiều hơn". Bốn slide tiếp theo dựng hoàn toàn trên mâu thuẫn đó.</p>`),

  slide(D, 3, "The Prisoner's Dilemma",
    `<p class="y-chinh">🎯 The classic experiment that makes cooperation measurable instead of moral.</p>
     <p class="meo">💡 Its name comes from the original story of two arrested suspects questioned separately; this deck uses the money version, which is the same structure.</p>`,
    `<p class="y-chinh">🎯 Thí nghiệm kinh điển biến hợp tác thành thứ đo được, thay vì chuyện đạo đức.</p>
     <p class="meo">💡 Tên gọi đến từ câu chuyện gốc về hai nghi phạm bị hỏi cung riêng; bộ slide này dùng phiên bản tiền bạc, cấu trúc vẫn y hệt.</p>`),

  slide(D, 4, 'The setup — two players, separate rooms, never meet',
    `<p class="y-chinh">🎯 The three rules that make the dilemma work.</p>
     <ul>
       <li>You play with another person in a <strong>separate room</strong>.</li>
       <li>The two of you will <strong>never meet</strong>.</li>
       <li>There is money on the table.</li>
     </ul>
     <p class="meo">💡 Every rule removes one tool you normally rely on: no discussion, no reputation, no chance to retaliate later. What remains is bare incentive.</p>`,
    `<p class="y-chinh">🎯 Ba luật chơi làm nên thế lưỡng nan.</p>
     <ul>
       <li>Bạn chơi với một người ở <strong>phòng riêng biệt</strong>.</li>
       <li>Hai người <strong>sẽ không bao giờ gặp nhau</strong>.</li>
       <li>Có tiền đặt trên bàn.</li>
     </ul>
     <p class="meo">💡 Mỗi luật lấy đi một công cụ bạn vẫn quen dùng: không bàn bạc được, không có danh tiếng, không có cơ hội trả đũa về sau. Còn lại chỉ là động cơ lợi ích trần trụi.</p>`),

  slide(D, 5, 'Cooperate or defect',
    `<p class="y-chinh">🎯 The choice, stated exactly as on the slide.</p>
     <ul>
       <li><span class="nhan">Cooperate</span> — maximise the <strong>combined</strong> reward.</li>
       <li><span class="nhan">Defect</span> (not cooperate) — maximise <strong>your individual</strong> reward.</li>
     </ul>
     <p>Your choice and the other player's produce one of three outcomes: both cooperate (good for both), one defects (great for the defector, bad for the other), both defect (bad for both).</p>
     <p class="pitfall co-tieu-de"><strong>Cốt lõi:</strong> defecting is the better move whatever the other person does — and if both reason that way, both end up worse off than if both had cooperated. That is the dilemma, and it is a structural fact, not a character flaw.</p>`,
    `<p class="y-chinh">🎯 Lựa chọn, nêu đúng như trên slide.</p>
     <ul>
       <li><span class="nhan">Hợp tác</span> — tối đa hoá phần thưởng <strong>chung</strong>.</li>
       <li><span class="nhan">Phản bội</span> (không hợp tác) — tối đa hoá phần thưởng <strong>riêng của bạn</strong>.</li>
     </ul>
     <p>Lựa chọn của bạn cộng với lựa chọn của người kia cho ra một trong ba kết cục: cả hai hợp tác (tốt cho cả hai), một người phản bội (rất lợi cho kẻ phản bội, thiệt cho người kia), cả hai phản bội (tệ cho cả hai).</p>
     <p class="pitfall co-tieu-de"><strong>Cốt lõi:</strong> phản bội luôn là nước đi có lợi hơn bất kể người kia làm gì — và nếu cả hai đều nghĩ thế thì cả hai cùng thiệt hơn so với khi cùng hợp tác. Đó chính là thế lưỡng nan, và nó là sự thật về cấu trúc chứ không phải lỗi nhân cách.</p>`),

  slide(D, 6, 'Which strategy would you choose?',
    `<p class="y-chinh">🎯 Question thrown to the class.</p>
     <p><span class="nhan">The answer that earns marks</span> — "it depends on whether the game is played once or repeatedly".</p>
     <ul>
       <li><span class="nhan">One round</span> — defection is individually rational, and that is exactly why the outcome is poor.</li>
       <li><span class="nhan">Repeated rounds</span> — cooperation pays, because the other player can respond next time.</li>
     </ul>
     <p class="meo">💡 Your group project is a repeated game: ten weeks, the same people, every defection visible. That is why free-riding is a bad strategy here even on selfish grounds.</p>`,
    `<p class="y-chinh">🎯 Câu hỏi ném cho lớp.</p>
     <p><span class="nhan">Câu trả lời được điểm</span> — "còn tuỳ chơi một lần hay chơi lặp lại".</p>
     <ul>
       <li><span class="nhan">Một vòng</span> — phản bội là hợp lý với cá nhân, và chính vì thế kết cục mới tệ.</li>
       <li><span class="nhan">Lặp nhiều vòng</span> — hợp tác mới có lời, vì lần sau người kia còn đáp trả được.</li>
     </ul>
     <p class="meo">💡 Dự án nhóm của bạn là một ván chơi lặp: mười tuần, vẫn những con người đó, mọi lần "ăn theo" đều bị thấy. Nên ăn theo là chiến lược tồi ngay cả khi xét theo lợi ích ích kỷ.</p>`),

  slide(D, 7, 'Social Value Orientation (SVO) — three orientations',
    `<p class="y-chinh">🎯 People differ in how they weigh their own outcome against other people's. The course names three types.</p>
     <ol>
       <li><span class="nhan">Cooperative orientation</span> — wants positive outcomes for <em>all</em>.</li>
       <li><span class="nhan">Individualistic orientation</span> — less concerned about others' outcomes (not hostile — simply indifferent).</li>
       <li><span class="nhan">Competitive orientation</span> — seeks to <em>undermine</em> others in order to get ahead.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy thi:</strong> individualistic ≠ competitive. The individualist ignores your result; the competitor wants your result to be worse. Mixing these two is the most common error on this topic.</p>`,
    `<p class="y-chinh">🎯 Con người khác nhau ở chỗ cân kết quả của mình với kết quả của người khác ra sao. Môn học gọi tên ba kiểu.</p>
     <ol>
       <li><span class="nhan">Định hướng hợp tác</span> — muốn kết quả tốt cho <em>tất cả</em>.</li>
       <li><span class="nhan">Định hướng cá nhân</span> — ít bận tâm tới kết quả của người khác (không thù địch — chỉ là dửng dưng).</li>
       <li><span class="nhan">Định hướng cạnh tranh</span> — tìm cách <em>kéo người khác xuống</em> để mình vượt lên.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy đề thi:</strong> cá nhân ≠ cạnh tranh. Người theo định hướng cá nhân mặc kệ kết quả của bạn; người cạnh tranh thì muốn kết quả của bạn tệ đi. Lẫn hai cái này là lỗi phổ biến nhất ở chủ đề này.</p>`),

  slide(D, 8, 'How the three orientations split resources',
    `<p class="y-chinh">🎯 The same three types drawn as resource splits between "me" and "an OTHER".</p>
     <ul>
       <li><span class="nhan">Cooperative</span> — takes the split that raises the joint total.</li>
       <li><span class="nhan">Individualistic</span> — takes the split with the biggest number for me, regardless of the other column.</li>
       <li><span class="nhan">Competitive</span> — takes the split with the biggest <em>gap</em> in my favour, even when my own amount is smaller.</li>
     </ul>
     <p class="meo">💡 That last line is the test for competitiveness: accepting less for yourself to widen the gap.</p>`,
    `<p class="y-chinh">🎯 Vẫn ba kiểu đó, vẽ dưới dạng cách chia tài nguyên giữa "tôi" và "NGƯỜI KHÁC".</p>
     <ul>
       <li><span class="nhan">Hợp tác</span> — chọn cách chia làm tổng chung lớn nhất.</li>
       <li><span class="nhan">Cá nhân</span> — chọn cách chia cho mình số lớn nhất, mặc kệ cột bên kia.</li>
       <li><span class="nhan">Cạnh tranh</span> — chọn cách chia có <em>khoảng cách</em> nghiêng về mình lớn nhất, kể cả khi phần mình nhỏ hơn.</li>
     </ul>
     <p class="meo">💡 Vế cuối chính là phép thử tính cạnh tranh: chịu nhận ít hơn cho bản thân để nới rộng khoảng cách.</p>`),

  slide(D, 9, 'Empathic ability',
    `<p class="y-chinh">🎯 The second individual difference: empathy — the ability to feel and understand another's emotional experience.</p>
     <p>When we empathise we take the other person's perspective, imagine the world from their point of view, and vicariously experience their emotions (Davis 1994; Goetz, Keltner & Simon-Thomas 2010).</p>
     <p class="meo">💡 Why it belongs in a cooperation lesson: empathy changes what you <em>see</em> in the payoff table. If the other person's loss feels like a cost to you, defecting stops looking free.</p>`,
    `<p class="y-chinh">🎯 Khác biệt cá nhân thứ hai: đồng cảm — khả năng cảm nhận và hiểu trải nghiệm cảm xúc của người khác.</p>
     <p>Khi đồng cảm, ta đặt mình vào góc nhìn của người kia, hình dung thế giới theo mắt họ, và nếm trải gián tiếp cảm xúc của họ (Davis 1994; Goetz, Keltner & Simon-Thomas 2010).</p>
     <p class="meo">💡 Vì sao nó nằm trong bài về hợp tác: đồng cảm làm đổi thứ bạn <em>nhìn thấy</em> trong bảng lợi ích. Nếu mất mát của người kia cũng là cái giá với bạn, thì phản bội thôi trông có vẻ miễn phí.</p>`),

  slide(D, 10, 'Situational influences on cooperation (5)',
    `<p class="y-chinh">🎯 Beyond personality, five features of the <em>situation</em> push cooperation up or down.</p>
     <ul>
       <li><span class="nhan">Communication</span> — being able to talk before choosing raises cooperation sharply. In the dilemma it was deliberately removed.</li>
       <li><span class="nhan">Commitment</span> — a promise made out loud is harder to break.</li>
       <li><span class="nhan">Trust</span> — the expectation that the other will not exploit you.</li>
       <li><span class="nhan">Group identification</span> — "we" behaves differently from "you and I".</li>
       <li><span class="nhan">Culture</span> — norms about sharing and obligation differ across cultures (Lesson 11 develops this).</li>
     </ul>
     <p class="meo">💡 Four of the five are things a team can deliberately build in week one. That is the practical payoff of this lesson.</p>`,
    `<p class="y-chinh">🎯 Ngoài tính cách, năm đặc điểm của <em>tình huống</em> đẩy mức hợp tác lên hoặc xuống.</p>
     <ul>
       <li><span class="nhan">Giao tiếp</span> — được nói chuyện trước khi chọn làm mức hợp tác tăng vọt. Trong thế lưỡng nan, thứ này bị cố ý lấy đi.</li>
       <li><span class="nhan">Cam kết</span> — lời hứa nói thành tiếng thì khó nuốt lời hơn.</li>
       <li><span class="nhan">Niềm tin</span> — kỳ vọng rằng người kia sẽ không lợi dụng mình.</li>
       <li><span class="nhan">Đồng nhất với nhóm</span> — "chúng ta" hành xử khác hẳn "bạn và tôi".</li>
       <li><span class="nhan">Văn hoá</span> — chuẩn mực về chia sẻ và nghĩa vụ khác nhau giữa các nền văn hoá (Bài 11 sẽ khai triển).</li>
     </ul>
     <p class="meo">💡 Bốn trong năm thứ này là những cái một đội có thể chủ động dựng lên ngay tuần đầu. Đó là phần dùng được ngay của bài học này.</p>`),

  slide(D, 11, 'Discussion questions (3)',
    `<p class="y-chinh">🎯 Three questions; here is how to answer each so it uses the lesson rather than personal opinion.</p>
     <p><span class="nhan">1. Which groups do you identify with?</span> Name them, then use <em>group identification</em> from slide 10: identification raises cooperation inside the group and can lower it towards competing groups. That second half is the part worth marks.</p>
     <p><span class="nhan">2. Which human achievement required the most cooperation?</span> Any answer works if you justify it with scale, duration and the number of people who had to keep a commitment without ever meeting.</p>
     <p><span class="nhan">3. Your own group projects?</span> Map what you saw onto the five situational influences — the usual honest finding is that trust and communication were missing, not effort.</p>`,
    `<p class="y-chinh">🎯 Ba câu hỏi; đây là cách trả lời để bài dùng kiến thức của bài học chứ không chỉ là cảm nghĩ.</p>
     <p><span class="nhan">1. Bạn thấy mình thuộc về nhóm nào?</span> Kể tên, rồi dùng <em>đồng nhất với nhóm</em> ở slide 10: sự đồng nhất làm tăng hợp tác bên trong nhóm và có thể làm giảm hợp tác với nhóm đối thủ. Vế sau mới là chỗ được điểm.</p>
     <p><span class="nhan">2. Thành tựu nào của loài người cần nhiều hợp tác nhất?</span> Đáp án nào cũng được, miễn là biện minh bằng quy mô, thời gian kéo dài và số người phải giữ cam kết dù chưa từng gặp nhau.</p>
     <p><span class="nhan">3. Dự án nhóm của chính bạn?</span> Hãy chiếu điều bạn thấy vào năm yếu tố tình huống — phát hiện trung thực thường gặp là thiếu niềm tin và thiếu giao tiếp, chứ không phải thiếu nỗ lực.</p>`),

  slide(D, 12, 'End of Lesson 2',
    `<p class="y-chinh">🎯 Self-check before moving on.</p>
     <ol>
       <li>Can you state why defecting is rational in one round yet bad for everyone (slide 5)?</li>
       <li>Can you separate individualistic from competitive orientation (slide 7)?</li>
       <li>Can you list the five situational influences (slide 10)?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Tự kiểm trước khi sang bài mới.</p>
     <ol>
       <li>Bạn nói được vì sao phản bội là hợp lý trong một vòng mà vẫn tệ cho tất cả không (slide 5)?</li>
       <li>Bạn tách được định hướng cá nhân khỏi định hướng cạnh tranh chưa (slide 7)?</li>
       <li>Bạn liệt kê được năm yếu tố tình huống chưa (slide 10)?</li>
     </ol>`),

  books([
    ['piercy', 'chương về cooperation & social dilemmas', 'chương về hợp tác và thế lưỡng nan xã hội'],
    ['wig', 'Chapter 2 — group membership and cohesion', 'Chương 2 — tư cách thành viên và sự gắn kết nhóm'],
  ]),

  bi(
    `<h3>✅ Why this lesson used to be missing</h3>
     <p>The syllabus lists "Cooperation" as its own session and asks about the Prisoner's Dilemma and Social Value Orientation in the check questions. Until this rebuild, the Academy course mentioned neither — the words "prisoner" and "cooperation" appeared zero times.</p>`,
    `<h3>✅ Vì sao trước đây bài này bị thiếu</h3>
     <p>Syllabus xếp "Cooperation" thành một buổi riêng và hỏi về Thế lưỡng nan của người tù cùng Định hướng giá trị xã hội trong phần câu hỏi ôn. Trước đợt dựng lại này, khoá học trên Academy không nhắc tới cả hai — chữ "prisoner" và "cooperation" xuất hiện đúng 0 lần.</p>`),
].join('\n');
