/**
 * Buổi 3 · Bài 12 — Conflict and Cohesion in Groups (24 slide).
 *
 * Bám bộ "Session 3_..._Lesson 12_Conflict and Negotiation.pptx". Bài cũ trên
 * Academy có phần xung đột khá nhất môn (nguồn gốc + Thomas-Kilmann), nhưng
 * 0 lần nhắc "negotiation" và không có mô hình 4 giai đoạn, không có 4 chiến
 * lược phòng ngừa + 9 chiến lược giảm xung đột. Bộ này bù đúng những chỗ đó.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's3-l12';

export const b3l12 = [
  walkHead(D, 1, 24,
    'The definition on slide 3 has three conditions — all three must hold before something counts as conflict. The four-stage model (slides 8–12) and the 4+9 strategies (slides 15–23) are the rest of the lesson.',
    'Định nghĩa ở slide 3 có ba điều kiện — phải đủ cả ba mới gọi là xung đột. Mô hình bốn giai đoạn (slide 8–12) và bộ 4+9 chiến lược (slide 15–23) là phần còn lại của bài.'),

  slide(D, 1, 'Session III — Group & Team Theory (cont.)',
    `<p class="y-chinh">🎯 Title slide.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>`),

  slide(D, 2, '4. Conflict and Cohesion in Groups',
    `<p class="y-chinh">🎯 Section divider. Note the pairing in the title: conflict and <em>cohesion</em> are treated as two sides of the same subject, not as opposites.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục. Để ý cặp từ trong tiêu đề: xung đột và <em>gắn kết</em> được coi là hai mặt của cùng một chủ đề, không phải hai thứ đối lập.</p>`),

  slide(D, 3, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives.</p>
     <ol>
       <li>Define conflict.</li>
       <li>Differentiate between <strong>functional and dysfunctional</strong> conflict.</li>
       <li>Recognise various types of conflict in groups.</li>
       <li>Describe the conflict process.</li>
       <li>Identify and apply strategies for preventing or reducing conflict.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm mục tiêu.</p>
     <ol>
       <li>Định nghĩa xung đột.</li>
       <li>Phân biệt xung đột <strong>chức năng và phi chức năng</strong>.</li>
       <li>Nhận diện các loại xung đột trong nhóm.</li>
       <li>Mô tả quá trình xung đột.</li>
       <li>Xác định và áp dụng chiến lược ngăn ngừa hoặc giảm xung đột.</li>
     </ol>`),

  slide(D, 4, 'Definition of conflict — the three conditions',
    `<p class="y-chinh">🎯 Conflict is an <strong>expressed struggle between interdependent parties</strong> over goals they perceive as incompatible, or resources they perceive to be insufficient (Hocker & Wilmot, 2001).</p>
     <ul>
       <li><span class="nhan">First</span> — conflict must be <strong>expressed</strong>. Silent disagreement is not yet conflict.</li>
       <li><span class="nhan">Second</span> — it happens between parties who are <strong>interdependent</strong>, who need each other to accomplish something.</li>
       <li><span class="nhan">Third</span> — it involves clashes over <strong>what people want</strong>, or over the means of achieving it.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ chữ "perceive":</strong> goals only have to be <em>seen</em> as incompatible. Many group conflicts dissolve the moment someone checks whether the goals really do clash.</p>`,
    `<p class="y-chinh">🎯 Xung đột là <strong>cuộc giằng co được bộc lộ giữa các bên phụ thuộc lẫn nhau</strong> về những mục tiêu họ cho là không tương thích, hoặc những nguồn lực họ cho là không đủ (Hocker & Wilmot, 2001).</p>
     <ul>
       <li><span class="nhan">Thứ nhất</span> — xung đột phải được <strong>bộc lộ</strong>. Bất đồng trong im lặng chưa phải xung đột.</li>
       <li><span class="nhan">Thứ hai</span> — nó xảy ra giữa các bên <strong>phụ thuộc lẫn nhau</strong>, những người cần nhau mới làm được việc.</li>
       <li><span class="nhan">Thứ ba</span> — nó là va chạm về <strong>thứ người ta muốn</strong>, hoặc về cách thức để đạt được thứ đó.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ chữ "cho là":</strong> mục tiêu chỉ cần <em>bị nhìn</em> như không tương thích. Nhiều xung đột nhóm tan biến ngay khi có người chịu kiểm tra xem mục tiêu có thực sự chọi nhau không.</p>`),

  slide(D, 5, 'The positive side of conflict',
    `<p class="y-chinh">🎯 Conflict is not automatically damaging.</p>
     <ul>
       <li>Conflict can <strong>stimulate innovation and change</strong>.</li>
       <li>Conflict can help individuals and group members <strong>grow and develop self-identities</strong>.</li>
     </ul>
     <p>The accompanying graph (Brown, 1986) plots conflict intensity against outcomes: too little conflict and too much conflict both produce poor results.</p>
     <p class="meo">💡 That inverted-U is the answer to "is conflict good or bad?" — neither; there is an amount that is right, and zero is not it.</p>`,
    `<p class="y-chinh">🎯 Xung đột không đương nhiên là tai hại.</p>
     <ul>
       <li>Xung đột có thể <strong>kích thích đổi mới và thay đổi</strong>.</li>
       <li>Xung đột có thể giúp cá nhân và thành viên nhóm <strong>trưởng thành và hình thành bản sắc</strong>.</li>
     </ul>
     <p>Biểu đồ đi kèm (Brown, 1986) vẽ cường độ xung đột theo kết quả: quá ít xung đột và quá nhiều xung đột đều cho kết quả tồi.</p>
     <p class="meo">💡 Đường hình chữ U ngược đó chính là đáp án cho câu "xung đột tốt hay xấu?" — không cái nào cả; có một mức vừa đủ, và mức đó không phải là con số không.</p>`),

  slide(D, 6, 'Conflict as a stabilising mechanism',
    `<p class="y-chinh">🎯 Four claims about what conflict does <em>for</em> a relationship.</p>
     <ul>
       <li>Conflict aimed at resolving tension between antagonists is likely to have <strong>stabilising and integrative functions</strong> for the relationship.</li>
       <li>By permitting immediate and direct expression of rival claims, social systems can readjust their structures by <strong>eliminating the sources of dissatisfaction</strong>.</li>
       <li>The multiple conflicts they experience may eliminate the causes of dissociation and <strong>re-establish unity</strong>.</li>
       <li>Through toleration and institutionalisation of conflict, such systems gain an important stabilising mechanism.</li>
     </ul>
     <p class="meo">💡 "Institutionalisation" in a student team means having an agreed way to disagree — a retrospective, a decision rule — before you need one.</p>`,
    `<p class="y-chinh">🎯 Bốn khẳng định về việc xung đột làm gì <em>cho</em> một mối quan hệ.</p>
     <ul>
       <li>Xung đột nhằm hoá giải căng thẳng giữa các bên đối kháng thường mang <strong>chức năng ổn định và gắn kết</strong> cho mối quan hệ.</li>
       <li>Nhờ cho phép bộc lộ trực tiếp và tức thì các yêu sách đối chọi, hệ thống xã hội có thể tự chỉnh lại cấu trúc bằng cách <strong>loại bỏ nguồn gốc của sự bất mãn</strong>.</li>
       <li>Nhiều lần xung đột có thể xoá đi nguyên nhân gây chia rẽ và <strong>tái lập sự thống nhất</strong>.</li>
       <li>Nhờ dung nạp và thể chế hoá xung đột, hệ thống có được một cơ chế ổn định quan trọng.</li>
     </ul>
     <p class="meo">💡 "Thể chế hoá" trong một nhóm sinh viên nghĩa là có sẵn một cách bất đồng đã được thống nhất — buổi rút kinh nghiệm, một quy tắc ra quyết định — trước khi cần tới nó.</p>`),

  slide(D, 7, 'Types of conflict (5)',
    `<p class="y-chinh">🎯 Five types, and telling them apart decides which strategy will work.</p>
     <ul>
       <li><span class="nhan">Conflicts of substance</span> — about facts, content, what is true.</li>
       <li><span class="nhan">Conflicts of value</span> — about what matters, what is right.</li>
       <li><span class="nhan">Conflicts of process</span> — about how the work should be done.</li>
       <li><span class="nhan">Conflicts of misperceived differences</span> — the parties actually agree but believe they do not.</li>
       <li><span class="nhan">Relationship conflicts</span> — about the people, not the work.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy lớn nhất của làm việc nhóm:</strong> a process conflict left unresolved turns into a relationship conflict. Once it does, no amount of evidence settles it — which is why you fix process disputes early, in writing.</p>`,
    `<p class="y-chinh">🎯 Năm loại, và phân biệt được chúng mới biết chiến lược nào có tác dụng.</p>
     <ul>
       <li><span class="nhan">Xung đột về nội dung</span> — về dữ kiện, về nội dung, về cái gì là đúng.</li>
       <li><span class="nhan">Xung đột về giá trị</span> — về cái gì quan trọng, cái gì là phải.</li>
       <li><span class="nhan">Xung đột về quy trình</span> — về việc nên làm theo cách nào.</li>
       <li><span class="nhan">Xung đột do hiểu lầm khác biệt</span> — thực ra các bên đồng ý nhau nhưng lại tưởng là không.</li>
       <li><span class="nhan">Xung đột quan hệ</span> — về con người, không phải về công việc.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cái bẫy lớn nhất của làm việc nhóm:</strong> xung đột quy trình để lâu không giải sẽ hoá thành xung đột quan hệ. Khi đã thành, bao nhiêu bằng chứng cũng không dàn xếp nổi — nên phải xử lý bất đồng về quy trình từ sớm, và bằng văn bản.</p>`),

  slide(D, 8, 'A model of the conflict process — four stages',
    `<p class="y-chinh">🎯 Four stages, in order: <strong>Frustration → Conceptualization → Behavior → Outcome</strong>.</p>
     <p class="meo">💡 The value of the model is that it tells you <em>where</em> you are. Most failed interventions are attempts to fix stage 3 while the real problem sits in stage 1.</p>`,
    `<p class="y-chinh">🎯 Bốn giai đoạn, theo thứ tự: <strong>Bức bối → Định hình nhận thức → Hành vi → Kết cục</strong>.</p>
     <p class="meo">💡 Giá trị của mô hình nằm ở chỗ nó cho biết bạn <em>đang ở đâu</em>. Phần lớn các can thiệp thất bại là vì cố sửa giai đoạn 3 trong khi vấn đề thật nằm ở giai đoạn 1.</p>`),

  slide(D, 9, 'The conflict process (diagram)',
    `<p class="y-chinh">🎯 The same four stages drawn as a flow.</p>
     <p class="meo">💡 Note it is a chain, not a loop — but stage 4 feeds the next episode, as slide 12 explains.</p>`,
    `<p class="y-chinh">🎯 Vẫn bốn giai đoạn đó, vẽ thành dòng chảy.</p>
     <p class="meo">💡 Để ý nó là một chuỗi, không phải vòng lặp — nhưng giai đoạn 4 lại nuôi đợt xung đột tiếp theo, như slide 12 giải thích.</p>`),

  slide(D, 10, 'Stage 1 — Frustration',
    `<p class="y-chinh">🎯 Conflict situations originate when an individual or group feels <strong>frustration in the pursuit of important goals</strong>.</p>
     <ul>
       <li>Causes are varied: disagreement over performance goals, failure to get a promotion or pay rise, a fight over scarce economic resources, new rules or policies.</li>
       <li>In fact conflict can be traced to frustration over <em>almost anything a group or individual cares about</em>.</li>
     </ul>
     <p class="meo">💡 Practical use: when a conflict seems disproportionate, ask what goal was blocked. The visible argument is rarely the frustration.</p>`,
    `<p class="y-chinh">🎯 Tình huống xung đột khởi phát khi một cá nhân hoặc một nhóm thấy <strong>bức bối trong lúc theo đuổi những mục tiêu quan trọng</strong>.</p>
     <ul>
       <li>Nguyên nhân rất đa dạng: bất đồng về chỉ tiêu công việc, trượt thăng chức hay tăng lương, tranh giành nguồn lực khan hiếm, quy định hay chính sách mới.</li>
       <li>Thực tế, xung đột có thể truy về sự bức bối với <em>gần như bất cứ thứ gì mà nhóm hay cá nhân coi trọng</em>.</li>
     </ul>
     <p class="meo">💡 Cách dùng thực tế: khi một xung đột có vẻ to hơn nguyên cớ, hãy hỏi mục tiêu nào đang bị chặn. Cuộc cãi vã nhìn thấy được hiếm khi chính là nỗi bức bối.</p>`),

  slide(D, 11, 'Stage 2 — Conceptualization',
    `<p class="y-chinh">🎯 The parties try to understand four things at once.</p>
     <ul>
       <li>The nature of the problem.</li>
       <li>What they themselves want as a resolution.</li>
       <li>What they think their opponents want.</li>
       <li>The strategies each side may employ.</li>
     </ul>
     <p>This stage is really the <strong>problem-solving and strategy phase</strong>.</p>
     <p class="pitfall co-tieu-de"><strong>Chỗ hỏng hay gặp:</strong> the third item is guessed, never asked. A wrong guess about what the other side wants turns a conflict of substance into a conflict of misperceived differences.</p>`,
    `<p class="y-chinh">🎯 Các bên cùng lúc cố hiểu bốn thứ.</p>
     <ul>
       <li>Bản chất của vấn đề.</li>
       <li>Bản thân mình muốn cách giải quyết nào.</li>
       <li>Mình nghĩ đối phương muốn gì.</li>
       <li>Mỗi bên có thể dùng những chiến lược nào.</li>
     </ul>
     <p>Giai đoạn này thực chất là <strong>pha giải quyết vấn đề và hoạch định chiến lược</strong>.</p>
     <p class="pitfall co-tieu-de"><strong>Chỗ hay hỏng:</strong> mục thứ ba thường bị đoán chứ không bao giờ được hỏi. Đoán sai thứ bên kia muốn sẽ biến xung đột nội dung thành xung đột do hiểu lầm khác biệt.</p>`),

  slide(D, 12, 'Stage 3 — Behavior',
    `<p class="y-chinh">🎯 The parties implement their resolution mode — competing or accommodating — in the hope of resolving the problem.</p>
     <ul>
       <li>The major task is deciding how best to proceed strategically: which tactics to use.</li>
       <li>Thomas identified <strong>five modes of conflict resolution</strong>: competing · collaborating · compromising · avoiding · accommodating.</li>
     </ul>
     <p class="meo">💡 These five are the Thomas-Kilmann grid: each mode is a position on two axes — how much you pursue your own concern, and how much you pursue the other party's.</p>`,
    `<p class="y-chinh">🎯 Các bên bắt đầu thi hành cách giải quyết của mình — cạnh tranh hay nhượng bộ — với hy vọng xử lý được vấn đề.</p>
     <ul>
       <li>Nhiệm vụ chính là quyết xem đi tiếp theo chiến lược nào: dùng chiến thuật gì.</li>
       <li>Thomas nêu <strong>năm cách giải quyết xung đột</strong>: cạnh tranh · cộng tác · thoả hiệp · né tránh · nhượng bộ.</li>
     </ul>
     <p class="meo">💡 Năm cách này chính là lưới Thomas-Kilmann: mỗi cách là một vị trí trên hai trục — bạn theo đuổi mối quan tâm của mình tới đâu, và theo đuổi mối quan tâm của bên kia tới đâu.</p>`),

  slide(D, 13, 'Stage 4 — Outcome',
    `<p class="y-chinh">🎯 Both sides judge how far a satisfactory resolution has been achieved — and the slide's warning is the important part.</p>
     <ul>
       <li>Where one party is not satisfied, or only partially satisfied, <strong>the seeds of discontent are sown for a later conflict</strong>.</li>
       <li>One unresolved episode easily sets the stage for a second.</li>
       <li>Quick and satisfactory resolution is vital; failing to act leaves the <em>probability</em> — not merely the possibility — that new conflicts emerge.</li>
     </ul>
     <p class="meo">💡 This is why "we just moved on" is not a resolution. Unfinished stage 4 is the frustration that starts the next episode's stage 1.</p>`,
    `<p class="y-chinh">🎯 Hai bên đánh giá xem đã đạt được cách giải quyết thoả đáng tới đâu — và lời cảnh báo trên slide mới là phần quan trọng.</p>
     <ul>
       <li>Nếu một bên không thoả mãn, hoặc chỉ thoả mãn một phần, thì <strong>mầm bất mãn đã được gieo cho một xung đột về sau</strong>.</li>
       <li>Một đợt xung đột chưa giải quyết rất dễ dựng sân khấu cho đợt thứ hai.</li>
       <li>Giải quyết nhanh và thoả đáng là thiết yếu; không hành động thì để lại <em>xác suất cao</em> — chứ không chỉ là khả năng — rằng xung đột mới sẽ nổ ra.</li>
     </ul>
     <p class="meo">💡 Vì thế câu "thôi bỏ qua đi" không phải là giải quyết. Giai đoạn 4 dở dang chính là nỗi bức bối khởi động giai đoạn 1 của đợt sau.</p>`),

  slide(D, 14, 'Five modes of resolving conflict',
    `<p class="y-chinh">🎯 The five modes, with when each is the right choice.</p>
     <ul>
       <li><span class="nhan">Competing</span> — high concern for self, low for the other. Right when the decision is urgent or a principle cannot be traded.</li>
       <li><span class="nhan">Collaborating</span> — high for both. Right when the issue matters to everyone and there is time to find a solution that serves both.</li>
       <li><span class="nhan">Compromising</span> — middling on both. Right when the parties have equal power and a workable answer beats a perfect one.</li>
       <li><span class="nhan">Avoiding</span> — low on both. Right when the issue is trivial, or emotions must cool first.</li>
       <li><span class="nhan">Accommodating</span> — low for self, high for the other. Right when you are wrong, or the relationship matters more than this issue.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Không có ô "tốt nhất":</strong> the mistake is having only one mode. A person who always accommodates and a person who always competes both damage the group, in opposite directions.</p>`,
    `<p class="y-chinh">🎯 Năm cách, kèm lúc nào chọn cái nào là đúng.</p>
     <ul>
       <li><span class="nhan">Cạnh tranh</span> — quan tâm mình cao, quan tâm bên kia thấp. Hợp khi quyết định gấp hoặc có nguyên tắc không thể đem ra đổi chác.</li>
       <li><span class="nhan">Cộng tác</span> — quan tâm cả hai đều cao. Hợp khi vấn đề quan trọng với mọi bên và còn thời gian tìm lời giải phục vụ cả hai.</li>
       <li><span class="nhan">Thoả hiệp</span> — cả hai ở mức trung bình. Hợp khi hai bên ngang sức và một đáp án dùng được còn hơn một đáp án hoàn hảo.</li>
       <li><span class="nhan">Né tránh</span> — cả hai đều thấp. Hợp khi chuyện nhỏ, hoặc khi cần để cảm xúc nguội xuống trước.</li>
       <li><span class="nhan">Nhượng bộ</span> — quan tâm mình thấp, quan tâm bên kia cao. Hợp khi bạn sai, hoặc khi mối quan hệ quan trọng hơn vấn đề này.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Không có ô nào là "tốt nhất":</strong> sai lầm là chỉ có đúng một chế độ. Người lúc nào cũng nhượng bộ và người lúc nào cũng cạnh tranh đều làm hại nhóm, theo hai chiều ngược nhau.</p>`),

  slide(D, 15, 'Preventing and reducing conflict',
    `<p class="y-chinh">🎯 Divider: 4 strategies for prevention, 9 for reduction.</p>
     <p class="meo">💡 The asymmetry is the message — prevention is cheap and short, reduction is long and expensive. That is the argument for doing the four first.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục: 4 chiến lược phòng ngừa, 9 chiến lược làm giảm.</p>
     <p class="meo">💡 Chính sự chênh lệch đó là thông điệp — phòng ngừa thì rẻ và ngắn, giảm thiểu thì dài và tốn kém. Đó là lý lẽ để làm bốn cái kia trước.</p>`),

  slide(D, 16, 'Prevention 1–2 — group goals and stable tasks',
    `<p class="y-chinh">🎯 Two of the four preventive strategies.</p>
     <ul>
       <li><span class="nhan">1. Emphasise group goals and effectiveness</span> — focusing on shared goals should prevent goal conflict. If larger goals are emphasised, members are more likely to see the big picture and work together.</li>
       <li><span class="nhan">2. Provide stable, well-structured tasks</span> — when work is clearly defined, understood and accepted, conflict is less likely. Conflict is most likely when <strong>task uncertainty is high</strong>; specifying roles and tasks minimises ambiguity.</li>
     </ul>
     <p class="meo">💡 Strategy 2 is the one a student group can apply this week: write down who owns what, and what "finished" means for each part.</p>`,
    `<p class="y-chinh">🎯 Hai trong bốn chiến lược phòng ngừa.</p>
     <ul>
       <li><span class="nhan">1. Nhấn mạnh mục tiêu chung và hiệu quả của nhóm</span> — tập trung vào mục tiêu chung sẽ ngăn xung đột mục tiêu. Khi mục tiêu lớn được nhấn mạnh, thành viên dễ thấy bức tranh tổng thể và cùng làm hơn.</li>
       <li><span class="nhan">2. Giao việc ổn định, có cấu trúc rõ</span> — khi công việc được định nghĩa rõ, được hiểu và được chấp nhận, xung đột ít xảy ra hơn. Xung đột dễ nổ nhất khi <strong>mức bất định của nhiệm vụ cao</strong>; quy định rõ vai trò và phần việc sẽ giảm sự mơ hồ.</li>
     </ul>
     <p class="meo">💡 Chiến lược 2 là thứ một nhóm sinh viên áp dụng được ngay tuần này: ghi ra ai phụ trách phần nào, và "xong" nghĩa là gì với từng phần.</p>`),

  slide(D, 17, 'Prevention 3–4 — dialogue and avoiding win-lose',
    `<p class="y-chinh">🎯 The other two.</p>
     <ul>
       <li><span class="nhan">3. Facilitate dialogue</span> — misperception of others' abilities, goals and motivations often causes conflict, so increasing dialogue and sharing information helps eliminate it. As members learn more about one another, suspicions diminish and teamwork becomes possible.</li>
       <li><span class="nhan">4. Avoid win-lose situations</span> — where win-lose framings are avoided, there is less potential for conflict.</li>
     </ul>
     <p class="meo">💡 Strategy 4 is structural: if only one person's design can be used, you have built a win-lose. Splitting the decision into parts each person owns removes the frame.</p>`,
    `<p class="y-chinh">🎯 Hai chiến lược còn lại.</p>
     <ul>
       <li><span class="nhan">3. Tạo điều kiện đối thoại</span> — hiểu sai về năng lực, mục tiêu và động cơ của người khác thường gây xung đột, nên tăng đối thoại và chia sẻ thông tin sẽ giúp dẹp bớt. Khi các thành viên hiểu nhau hơn, nghi ngại giảm đi và làm việc chung trở nên khả thi.</li>
       <li><span class="nhan">4. Tránh tình huống được-mất</span> — chỗ nào tránh được khung "một bên thắng, một bên thua" thì chỗ đó ít nguy cơ xung đột hơn.</li>
     </ul>
     <p class="meo">💡 Chiến lược 4 mang tính cấu trúc: nếu chỉ một người có thiết kế được dùng thì bạn đã tự dựng nên thế được-mất. Chia quyết định thành các phần mà mỗi người phụ trách một phần sẽ gỡ bỏ cái khung đó.</p>`),

  slide(D, 18, 'Reduction 1–2 — separation and rules',
    `<p class="y-chinh">🎯 The first two of nine, and the slide is honest about their limits.</p>
     <ul>
       <li><span class="nhan">1. Physical separation</span> — useful when the conflicting parties are not working on a joint task or do not need much interaction. It does <strong>not</strong> change attitudes, but it buys time to find a better accommodation.</li>
       <li><span class="nhan">2. Use of rules and regulations</span> — conflict can be reduced by specifying rules, regulations and procedures. Again, <strong>basic attitudes are not modified</strong>.</li>
     </ul>
     <p class="meo">💡 Both are containment, not repair. Useful when a deadline is close and the relationship can be dealt with afterwards.</p>`,
    `<p class="y-chinh">🎯 Hai trong chín cách, và slide rất thật thà về giới hạn của chúng.</p>
     <ul>
       <li><span class="nhan">1. Tách về mặt vật lý</span> — hữu ích khi các bên xung đột không cùng làm một nhiệm vụ hoặc không cần tương tác nhiều. Nó <strong>không</strong> làm đổi thái độ, nhưng mua được thời gian để tìm cách dàn xếp tốt hơn.</li>
       <li><span class="nhan">2. Dùng quy định và quy tắc</span> — xung đột giảm được nhờ quy định rõ luật lệ, quy chế, quy trình. Nhưng một lần nữa, <strong>thái độ cơ bản không hề thay đổi</strong>.</li>
     </ul>
     <p class="meo">💡 Cả hai đều là ngăn chặn, không phải hàn gắn. Hữu ích khi hạn chót cận kề và chuyện quan hệ để xử lý sau.</p>`),

  slide(D, 19, 'Reduction 3–4 — integrators and limited interaction',
    `<p class="y-chinh">🎯 Two more.</p>
     <ul>
       <li><span class="nhan">3. Use of integrators</span> — an integrator is assigned a boundary-spanning role between two people or groups, often taking a "shuttle diplomacy" approach: moving between the parties, identifying areas of agreement, and looking for future cooperation.</li>
       <li><span class="nhan">4. Limit intergroup interaction</span> — restrict contact to issues involving common goals. Where groups agree on a goal, cooperation becomes easier.</li>
     </ul>
     <p class="meo">💡 An integrator inside a five-person student team is usually the member both sides still talk to. Naming that role openly makes it a method instead of an accident.</p>`,
    `<p class="y-chinh">🎯 Hai cách nữa.</p>
     <ul>
       <li><span class="nhan">3. Dùng người nối nhịp (integrator)</span> — người này được giao vai bắc cầu giữa hai người hoặc hai nhóm, thường theo lối "ngoại giao con thoi": đi lại giữa các bên, tìm ra những điểm đã đồng thuận, và tìm chỗ hợp tác trong tương lai.</li>
       <li><span class="nhan">4. Hạn chế tương tác giữa các nhóm</span> — chỉ tiếp xúc quanh những vấn đề có mục tiêu chung. Chỗ nào các nhóm cùng thống nhất mục tiêu thì hợp tác dễ hơn.</li>
     </ul>
     <p class="meo">💡 Trong nhóm sinh viên năm người, người nối nhịp thường là thành viên mà cả hai phía vẫn còn nói chuyện. Gọi tên vai trò đó ra sẽ biến nó thành phương pháp thay vì chuyện tình cờ.</p>`),

  slide(D, 20, 'Reduction 5 — confrontation and negotiation',
    `<p class="y-chinh">🎯 The first strategy that actually addresses the disagreement itself.</p>
     <ul>
       <li>Competing parties are brought together <strong>face to face</strong> to discuss their basic areas of disagreement.</li>
       <li>The hope is that open discussion and negotiation find means to work out the problems.</li>
       <li>Contract negotiations between a union and management are one example.</li>
       <li>If a <strong>win-win</strong> solution can be identified, the chances of an acceptable resolution increase.</li>
     </ul>
     <p class="meo">💡 This is the "negotiation" half of the lesson title — the word that appeared zero times in the old version of this course.</p>`,
    `<p class="y-chinh">🎯 Chiến lược đầu tiên thực sự động tới chính bất đồng.</p>
     <ul>
       <li>Các bên đối chọi được đưa lại <strong>đối diện nhau</strong> để bàn về những chỗ bất đồng gốc rễ.</li>
       <li>Kỳ vọng là qua thảo luận cởi mở và thương lượng, hai bên tìm được cách gỡ vấn đề.</li>
       <li>Đàm phán hợp đồng giữa công đoàn và ban quản lý là một ví dụ.</li>
       <li>Nếu tìm ra được giải pháp <strong>đôi bên cùng thắng</strong>, khả năng đạt một kết cục chấp nhận được sẽ tăng lên.</li>
     </ul>
     <p class="meo">💡 Đây chính là nửa "thương lượng" trong tên bài — từ mà phiên bản cũ của khoá học này nhắc tới đúng 0 lần.</p>`),

  slide(D, 21, 'Reduction 6–7 — third parties and superordinate goals',
    `<p class="y-chinh">🎯 Two more.</p>
     <ul>
       <li><span class="nhan">6. Third-party consultation</span> — bring in an outside consultant who understands human behaviour. They serve as a go-between and can <strong>speak more directly to the issues, because they are not a member of the group</strong>.</li>
       <li><span class="nhan">7. Identify interdependent tasks and superordinate goals</span> — establish goals that require the groups to work together to succeed at all.</li>
     </ul>
     <p class="meo">💡 A superordinate goal is one neither side can reach alone. It is the strongest tool on this list because it changes the structure, not the mood.</p>`,
    `<p class="y-chinh">🎯 Hai cách nữa.</p>
     <ul>
       <li><span class="nhan">6. Mời bên thứ ba tư vấn</span> — đưa vào một chuyên gia bên ngoài am hiểu hành vi con người. Họ vừa làm trung gian vừa có thể <strong>nói thẳng vào vấn đề, chính vì họ không phải thành viên của nhóm</strong>.</li>
       <li><span class="nhan">7. Xác lập nhiệm vụ phụ thuộc lẫn nhau và mục tiêu cấp cao hơn</span> — đặt ra những mục tiêu buộc các nhóm phải cùng làm mới thành công nổi.</li>
     </ul>
     <p class="meo">💡 Mục tiêu cấp cao hơn là mục tiêu mà không bên nào tự với tới được. Đây là công cụ mạnh nhất trong danh sách vì nó thay đổi cấu trúc, không phải thay đổi tâm trạng.</p>`),

  slide(D, 22, 'Reduction 8 — rotation of members',
    `<p class="y-chinh">🎯 By rotating between groups, individuals come to understand the frames of reference, values and attitudes of other members, so communication increases.</p>
     <ul>
       <li>When those rotated are accepted by the receiving group, change in <strong>attitudes as well as behaviour</strong> becomes possible.</li>
       <li>This is clearly a <strong>long-term</strong> technique: it takes time to develop good interpersonal relations and understanding.</li>
     </ul>
     <p class="meo">💡 It is one of only two strategies on this list that changes attitudes rather than containing behaviour — which is exactly why it is slow.</p>`,
    `<p class="y-chinh">🎯 Nhờ luân chuyển qua lại giữa các nhóm, mỗi người hiểu được hệ quy chiếu, giá trị và thái độ của thành viên nhóm khác, nên giao tiếp tăng lên.</p>
     <ul>
       <li>Khi người được luân chuyển được nhóm tiếp nhận chấp nhận, việc thay đổi <strong>cả thái độ lẫn hành vi</strong> mới trở nên khả thi.</li>
       <li>Đây rõ ràng là kỹ thuật <strong>dài hạn</strong>: cần thời gian mới dựng được quan hệ và sự thấu hiểu giữa người với người.</li>
     </ul>
     <p class="meo">💡 Nó là một trong hai chiến lược duy nhất của danh sách này làm đổi thái độ chứ không chỉ kìm hành vi — và đó chính là lý do nó chậm.</p>`),

  slide(D, 23, 'Reduction 9 — training',
    `<p class="y-chinh">🎯 The final technique on the continuum.</p>
     <ul>
       <li>Outside training experts are retained on a <strong>long-term basis</strong> to help groups develop relatively permanent mechanisms for working together.</li>
       <li>Structured workshops and training programmes can forge more favourable intergroup attitudes and, as a result, more constructive group behaviour.</li>
     </ul>
     <p class="meo">💡 Notice the ordering of all nine: they run from cheapest and most superficial (separation) to most expensive and most lasting (training). That continuum is the answer to "which strategy should we use?" — the cheapest one that actually reaches the cause.</p>`,
    `<p class="y-chinh">🎯 Kỹ thuật cuối cùng trên dải liên tục.</p>
     <ul>
       <li>Mời chuyên gia đào tạo bên ngoài theo hợp đồng <strong>dài hạn</strong> để giúp các nhóm xây dựng cơ chế làm việc chung tương đối bền.</li>
       <li>Các buổi tập huấn có cấu trúc và chương trình đào tạo có thể rèn nên thái độ liên nhóm tích cực hơn, và nhờ đó hành vi nhóm mang tính xây dựng hơn.</li>
     </ul>
     <p class="meo">💡 Để ý trật tự của cả chín cách: chúng chạy từ rẻ nhất và hời hợt nhất (tách nhau ra) tới đắt nhất và bền nhất (đào tạo). Chính dải đó là câu trả lời cho "nên dùng chiến lược nào?" — cái rẻ nhất mà vẫn chạm được tới nguyên nhân.</p>`),

  slide(D, 24, 'Review & reflection questions',
    `<p class="y-chinh">🎯 Five questions, and where the answers live.</p>
     <ul>
       <li><span class="nhan">Is conflict in groups good or bad? Why?</span> Slide 5 — the inverted-U: both too little and too much harm outcomes.</li>
       <li><span class="nhan">Identify the types of conflict with examples.</span> Slide 7 — five types.</li>
       <li><span class="nhan">Which resolution mode do you use?</span> Slide 14 — and notice whether you have more than one.</li>
       <li><span class="nhan">Which modes have you observed in your current group?</span> Look for avoiding: it is the most common and the least visible.</li>
       <li><span class="nhan">Which strategies could you use in your group?</span> Prevention 2 and 4 first — they are free and they are structural.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Năm câu hỏi, kèm chỗ chứa câu trả lời.</p>
     <ul>
       <li><span class="nhan">Xung đột trong nhóm tốt hay xấu? Vì sao?</span> Slide 5 — đường chữ U ngược: quá ít và quá nhiều đều hại kết quả.</li>
       <li><span class="nhan">Nêu các loại xung đột kèm ví dụ.</span> Slide 7 — năm loại.</li>
       <li><span class="nhan">Bạn hay dùng cách giải quyết nào?</span> Slide 14 — và để ý xem bạn có nhiều hơn một cách không.</li>
       <li><span class="nhan">Bạn quan sát thấy những cách nào trong nhóm hiện tại?</span> Hãy tìm kiểu né tránh: nó phổ biến nhất và khó thấy nhất.</li>
       <li><span class="nhan">Nhóm bạn có thể dùng chiến lược nào?</span> Phòng ngừa số 2 và số 4 trước — chúng không tốn gì và mang tính cấu trúc.</li>
     </ul>`),

  books([
    ['wig', 'Chapter 7 — conflict and cohesion in groups', 'Chương 7 — xung đột và gắn kết trong nhóm'],
    ['piercy', 'chương về conflict management', 'chương về quản lý xung đột'],
  ]),

  bi(
    `<h3>✅ What this adds to the old lesson</h3>
     <p>The old Academy lesson handled sources of conflict and the Thomas-Kilmann modes reasonably well, but the word "negotiation" appeared zero times, and neither the four-stage conflict process nor the 4 prevention / 9 reduction strategies were present.</p>`,
    `<h3>✅ Bài này bù thêm gì so với bài cũ</h3>
     <p>Bài cũ trên Academy xử lý phần nguồn gốc xung đột và các chế độ Thomas-Kilmann khá ổn, nhưng chữ "thương lượng" xuất hiện đúng 0 lần, và không có cả mô hình xung đột bốn giai đoạn lẫn bộ 4 chiến lược phòng ngừa / 9 chiến lược giảm thiểu.</p>`),
].join('\n');
