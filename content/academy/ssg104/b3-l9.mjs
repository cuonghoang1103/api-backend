/**
 * Buổi 3 · Bài 9 — Power in Teams and Groups (31 slide).
 *
 * Bám bộ "Session 3_Group _ Team Theory_Lesson 9_Power in Teams and Groups".
 * Syllabus hỏi CQ8.2 "ai dễ bị tác động bởi quyền lực" và CQ8.3 "phát triển
 * quyền lực" — bản Academy cũ chỉ có một bảng 4 dòng về các loại quyền lực,
 * không có power-over/from-within/with, không có power dependencies, không có
 * hướng dẫn dùng quyền lực có đạo đức.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's3-l9';

export const b3l9 = [
  walkHead(D, 1, 31,
    'Two frameworks to keep apart: Starhawk\'s three kinds of power (slides 6–9) and French & Raven\'s five bases of power (slides 13–18). Exam questions usually target the five bases.',
    'Hai khung khái niệm cần tách bạch: ba dạng quyền lực của Starhawk (slide 6–9) và năm nền tảng quyền lực kiểu French & Raven (slide 13–18). Đề thi thường nhắm vào năm nền tảng.'),

  slide(D, 1, 'Session III — Group & Team Theory',
    `<p class="y-chinh">🎯 Title slide for Session III, which has four lessons: power, leadership and diverse teams, conflict and negotiation, handling stress.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề Buổi III, gồm bốn bài: quyền lực, lãnh đạo và đội đa dạng, xung đột và thương lượng, xử lý căng thẳng.</p>`),

  slide(D, 2, '1. Power in Teams and Groups',
    `<p class="y-chinh">🎯 Section divider.</p>
     <p class="meo">💡 Power comes before leadership in this session on purpose: leadership is one way power gets exercised, not a separate thing.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục.</p>
     <p class="meo">💡 Quyền lực được xếp trước lãnh đạo trong buổi này là có chủ ý: lãnh đạo là một cách quyền lực được thực thi, không phải một thứ tách rời.</p>`),

  slide(D, 3, 'Learning objectives (part 1)',
    `<p class="y-chinh">🎯 Four objectives on power and status.</p>
     <ol>
       <li>Explain different conceptualisations of power.</li>
       <li>Discuss behaviours associated with <strong>high status</strong> in a group.</li>
       <li>Differentiate between the common <strong>power bases</strong> in groups.</li>
       <li>Explain the nature of leadership and the leadership process.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Bốn mục tiêu về quyền lực và địa vị.</p>
     <ol>
       <li>Giải thích các cách quan niệm khác nhau về quyền lực.</li>
       <li>Bàn về những hành vi gắn với <strong>địa vị cao</strong> trong nhóm.</li>
       <li>Phân biệt các <strong>nền tảng quyền lực</strong> thường gặp trong nhóm.</li>
       <li>Giải thích bản chất của lãnh đạo và quá trình lãnh đạo.</li>
     </ol>`),

  slide(D, 4, 'Learning objectives (part 2)',
    `<p class="y-chinh">🎯 Three more, and they hand over to Lesson 10–11.</p>
     <ol start="5">
       <li>How do leaders influence and move their followers to action?</li>
       <li>What are the trait perspectives on leadership?</li>
       <li>How do different approaches and styles of leadership affect what is needed now?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu nữa, và chúng bàn giao sang Bài 10–11.</p>
     <ol start="5">
       <li>Người lãnh đạo tác động và thúc đẩy người theo mình hành động ra sao?</li>
       <li>Các góc nhìn theo phẩm chất (trait) về lãnh đạo là gì?</li>
       <li>Các cách tiếp cận và phong cách lãnh đạo khác nhau ảnh hưởng thế nào tới thứ đang cần lúc này?</li>
     </ol>`),

  slide(D, 5, 'Power in teams and groups',
    `<p class="y-chinh">🎯 Divider before the definitions.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục trước phần định nghĩa.</p>`),

  slide(D, 6, 'Defining power — three kinds',
    `<p class="y-chinh">🎯 The organising quotation: <strong>"Power lives in relationships, not in people."</strong></p>
     <ul>
       <li>Power-over</li>
       <li>Power-from-within</li>
       <li>Power-with</li>
     </ul>
     <p class="meo">💡 Take the quotation literally. It means you cannot describe someone's power without naming who they have it over, or with.</p>`,
    `<p class="y-chinh">🎯 Câu trích làm trục: <strong>"Quyền lực sống trong các mối quan hệ, không nằm trong con người."</strong></p>
     <ul>
       <li>Quyền lực áp đặt (power-over)</li>
       <li>Quyền lực tự thân (power-from-within)</li>
       <li>Quyền lực cùng nhau (power-with)</li>
     </ul>
     <p class="meo">💡 Hãy hiểu câu trích theo nghĩa đen. Nó nói rằng bạn không mô tả được quyền lực của ai đó nếu không nêu họ có quyền lực <em>với ai</em> hoặc <em>cùng ai</em>.</p>`),

  slide(D, 7, 'Power-over',
    `<p class="y-chinh">🎯 If you associate power with control or dominance, that is power-over.</p>
     <p>Starhawk (1987): power-over "enables one individual or group to make the decisions that affect others, and to enforce control".</p>
     <p class="meo">💡 Two verbs, and both are needed: <em>decide for others</em> and <em>enforce</em>. Deciding without the means to enforce is just an opinion.</p>`,
    `<p class="y-chinh">🎯 Nếu bạn gắn quyền lực với kiểm soát hay thống trị, đó là quyền lực áp đặt.</p>
     <p>Starhawk (1987): quyền lực áp đặt "cho phép một cá nhân hoặc một nhóm ra những quyết định ảnh hưởng tới người khác, và cưỡng chế sự kiểm soát".</p>
     <p class="meo">💡 Hai động từ, và cần cả hai: <em>quyết thay người khác</em> và <em>cưỡng chế</em>. Quyết mà không có phương tiện cưỡng chế thì chỉ là ý kiến.</p>`),

  slide(D, 8, 'Power-from-within',
    `<p class="y-chinh">🎯 A more personal sense of strength or agency.</p>
     <ul>
       <li>It shows when we can stand, walk and speak "words that convey our needs and thoughts" (Starhawk, 1987).</li>
       <li>In groups this power "arises from our sense of connection, our bonding with other human beings, and with the environment".</li>
     </ul>
     <p class="meo">💡 This is the power a quiet member has and often does not use: the ability to say plainly what they need. It grows from connection, which is why it appears after a group has formed, not before.</p>`,
    `<p class="y-chinh">🎯 Một cảm thức cá nhân hơn về sức mạnh và khả năng tự chủ.</p>
     <ul>
       <li>Nó hiện ra khi ta đứng được, đi được và nói được "những lời chuyển tải nhu cầu và suy nghĩ của mình" (Starhawk, 1987).</li>
       <li>Trong nhóm, dạng quyền lực này "nảy sinh từ cảm thức kết nối, từ sự gắn bó với những con người khác và với môi trường".</li>
     </ul>
     <p class="meo">💡 Đây là thứ quyền lực mà thành viên trầm lặng vẫn có nhưng thường không dùng: khả năng nói thẳng điều mình cần. Nó lớn lên từ sự kết nối, nên xuất hiện sau khi nhóm đã hình thành chứ không phải trước đó.</p>`),

  slide(D, 9, 'Power-with — and its two conditions',
    `<p class="y-chinh">🎯 "The power of a strong individual in a group of equals — the power not to command, but to suggest and be listened to, to begin something and see it happen" (Starhawk, 1987).</p>
     <p><span class="nhan">For this to work in a team, two qualities must be present</span></p>
     <ol>
       <li>All group members communicate <strong>respect and equality</strong> for one another.</li>
       <li>The leader must <strong>not abuse power-with</strong> and try to turn it into power-over.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Đây là câu dễ ra đề:</strong> power-with is the only one of the three that has stated preconditions. Learn both.</p>`,
    `<p class="y-chinh">🎯 "Sức mạnh của một cá nhân mạnh mẽ trong một nhóm những người ngang hàng — quyền lực không phải để ra lệnh, mà để đề nghị và được lắng nghe, để khởi xướng một điều gì đó và thấy nó thành hiện thực" (Starhawk, 1987).</p>
     <p><span class="nhan">Để nó vận hành trong một đội, phải có hai phẩm chất</span></p>
     <ol>
       <li>Mọi thành viên đều thể hiện <strong>sự tôn trọng và bình đẳng</strong> với nhau.</li>
       <li>Người dẫn dắt <strong>không được lạm dụng power-with</strong> để biến nó thành power-over.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Đây là chỗ dễ ra đề:</strong> power-with là dạng duy nhất trong ba dạng có điều kiện tiên quyết được nêu rõ. Hãy thuộc cả hai.</p>`),

  slide(D, 10, 'Understanding power and oppression',
    `<p class="y-chinh">🎯 Power and oppression can be described as mirror reflections of one another — two sides of the same coin.</p>
     <p class="meo">💡 The claim is about power-over specifically: where one party decides and enforces, the other party experiences that as constraint. Power-with does not produce the mirror.</p>`,
    `<p class="y-chinh">🎯 Quyền lực và sự áp bức có thể xem như hai hình phản chiếu của nhau — hai mặt của cùng một đồng xu.</p>
     <p class="meo">💡 Khẳng định này nói riêng về power-over: chỗ nào một bên quyết và cưỡng chế thì bên kia trải nghiệm điều đó như một sự trói buộc. Power-with không tạo ra hình phản chiếu ấy.</p>`),

  slide(D, 11, 'Status',
    `<p class="y-chinh">🎯 <strong>Status</strong> = a person's perceived level of importance or significance within a particular context.</p>
     <p class="meo">💡 Two words do the work: <em>perceived</em> (it lives in other people's heads) and <em>context</em> (it does not travel — high status in the lab can be zero status in the meeting).</p>`,
    `<p class="y-chinh">🎯 <strong>Địa vị</strong> = mức độ quan trọng hoặc đáng kể của một người <em>được nhìn nhận</em> trong một bối cảnh cụ thể.</p>
     <p class="meo">💡 Hai chữ gánh toàn bộ ý: <em>được nhìn nhận</em> (nó sống trong đầu người khác) và <em>bối cảnh</em> (nó không đi theo người — địa vị cao trong phòng lab có thể bằng không trong phòng họp).</p>`),

  slide(D, 12, 'The relationship between power and status',
    `<p class="y-chinh">🎯 Members with higher status are apt to command greater respect, and to possess more prestige and power, than those with lower status.</p>
     <p class="meo">💡 "Apt to" is doing careful work: status <em>tends</em> to bring power, it does not define it. A high-status member with no expertise and no control of rewards has influence that evaporates on the first hard question.</p>`,
    `<p class="y-chinh">🎯 Thành viên có địa vị cao hơn thường được nể trọng hơn, có uy tín và quyền lực nhiều hơn so với người địa vị thấp.</p>
     <p class="meo">💡 Cụm "thường" được dùng rất cẩn thận: địa vị <em>có xu hướng</em> kéo theo quyền lực, chứ không định nghĩa quyền lực. Người địa vị cao mà không có chuyên môn, không nắm phần thưởng nào thì ảnh hưởng bốc hơi ngay ở câu hỏi khó đầu tiên.</p>`),

  slide(D, 13, 'Bases of power in groups — the five',
    `<p class="y-chinh">🎯 Five bases, each unpacked on its own slide. This is the list to memorise.</p>
     <ol>
       <li>Referent power</li>
       <li>Expert power</li>
       <li>Legitimate power</li>
       <li>Coercive power</li>
       <li>Reward power</li>
     </ol>
     <p class="meo">💡 Memory hook — <strong>RELCR</strong>: two personal (referent, expert), one positional (legitimate), two transactional (coercive, reward).</p>`,
    `<p class="y-chinh">🎯 Năm nền tảng, mỗi cái một slide riêng. Đây là danh sách cần thuộc.</p>
     <ol>
       <li>Quyền lực nể phục (referent)</li>
       <li>Quyền lực chuyên môn (expert)</li>
       <li>Quyền lực chính danh (legitimate)</li>
       <li>Quyền lực cưỡng chế (coercive)</li>
       <li>Quyền lực tưởng thưởng (reward)</li>
     </ol>
     <p class="meo">💡 Cách nhớ: hai cái thuộc về con người (nể phục, chuyên môn), một cái thuộc về vị trí (chính danh), hai cái mang tính đổi chác (cưỡng chế, tưởng thưởng).</p>`),

  slide(D, 14, 'Referent power',
    `<p class="y-chinh">🎯 Person B looks up to or admires person A, and follows A largely because of A's personal qualities, characteristics or reputation.</p>
     <ul>
       <li>A can use referent power to influence B.</li>
       <li>Also called <strong>charismatic power</strong>, because allegiance rests on interpersonal attraction.</li>
     </ul>
     <p class="meo">💡 It is the only base that cannot be assigned. A team can give someone authority; it cannot give them admiration.</p>`,
    `<p class="y-chinh">🎯 Người B ngưỡng mộ hoặc kính nể người A, và đi theo A chủ yếu vì phẩm chất, đặc điểm hay danh tiếng cá nhân của A.</p>
     <ul>
       <li>A có thể dùng quyền lực nể phục để tác động tới B.</li>
       <li>Còn gọi là <strong>quyền lực sức hút (charismatic)</strong>, vì sự đi theo dựa trên sức hấp dẫn giữa người với người.</li>
     </ul>
     <p class="meo">💡 Đây là nền tảng duy nhất không thể phân công được. Nhóm có thể trao cho ai đó thẩm quyền; nhưng không trao được sự ngưỡng mộ.</p>`),

  slide(D, 15, 'Expert power',
    `<p class="y-chinh">🎯 Person A gains power because A has knowledge or expertise relevant to B.</p>
     <ul>
       <li>Professors have power in the classroom because of mastery of a subject.</li>
       <li>The credibility is in a <strong>particular and narrow area</strong>, earned through experience and expertise, and it gives power <em>in that domain</em>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy quen thuộc:</strong> expert power does not transfer. A brilliant programmer's opinion on the budget carries no expert power — though people often grant it anyway, which is worth noticing in your own group.</p>`,
    `<p class="y-chinh">🎯 Người A có quyền lực vì A nắm kiến thức hoặc chuyên môn liên quan tới B.</p>
     <ul>
       <li>Giảng viên có quyền lực trên lớp nhờ làm chủ môn học.</li>
       <li>Uy tín ấy nằm ở <strong>một lĩnh vực cụ thể và hẹp</strong>, có được nhờ kinh nghiệm và chuyên môn, và nó cho quyền lực <em>trong đúng lĩnh vực đó</em>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy quen thuộc:</strong> quyền lực chuyên môn không chuyển nhượng được. Ý kiến của một lập trình viên giỏi về ngân sách chẳng mang quyền lực chuyên môn nào — dù người ta vẫn hay trao cho nó, và điều đó đáng để bạn để ý trong chính nhóm mình.</p>`),

  slide(D, 16, 'Legitimate power',
    `<p class="y-chinh">🎯 Person B submits to A because B feels A has a <strong>right</strong> to exert power in a certain domain (Tjosvold, 1985).</p>
     <ul>
       <li>Legitimate power is really another name for <strong>authority</strong>.</li>
       <li>It differs from reward and coercive power because it depends on the <strong>official position</strong> a person holds, not on their relationship with others.</li>
     </ul>
     <p class="meo">💡 That is why it survives a change of personality but dies the moment the position ends.</p>`,
    `<p class="y-chinh">🎯 Người B phục tùng A vì B cảm thấy A có <strong>quyền</strong> thực thi quyền lực trong một phạm vi nhất định (Tjosvold, 1985).</p>
     <ul>
       <li>Quyền lực chính danh thực chất là tên gọi khác của <strong>thẩm quyền</strong>.</li>
       <li>Nó khác quyền lực tưởng thưởng và cưỡng chế ở chỗ dựa vào <strong>vị trí chính thức</strong> mà người đó nắm, chứ không dựa vào quan hệ với người khác.</li>
     </ul>
     <p class="meo">💡 Vì thế nó sống sót qua việc đổi tính cách, nhưng chết ngay khoảnh khắc cái ghế không còn.</p>`),

  slide(D, 17, 'Coercive power',
    `<p class="y-chinh">🎯 Based primarily on <strong>fear</strong>: A has power over B because A can administer some form of punishment. Also called punishment power.</p>
     <p><span class="nhan">It does not have to rest on violence</span> — Kipnis (1976): individuals exercise coercive power through "physical strength, verbal facility, or the ability to grant or withhold emotional support", giving them the means to "physically harm, bully, humiliate, or deny love to others".</p>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ:</strong> "withholding emotional support" counts as coercion. In a student team this is the silent treatment, or excluding someone from the group chat — coercive power without anyone raising their voice.</p>`,
    `<p class="y-chinh">🎯 Chủ yếu dựa trên <strong>sợ hãi</strong>: A có quyền lực với B vì A có thể giáng xuống một hình thức trừng phạt nào đó. Còn gọi là quyền lực trừng phạt.</p>
     <p><span class="nhan">Nó không nhất thiết dựa trên bạo lực</span> — Kipnis (1976): người ta thực thi quyền lực cưỡng chế qua "sức mạnh thể chất, tài ăn nói, hoặc khả năng ban phát hay rút lại chỗ dựa tinh thần", tạo ra phương tiện để "làm tổn thương thân thể, bắt nạt, hạ nhục, hoặc chối bỏ tình cảm với người khác".</p>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ:</strong> "rút lại chỗ dựa tinh thần" cũng được tính là cưỡng chế. Trong nhóm sinh viên, đó là chiêu im lặng phớt lờ, hoặc gạt ai đó khỏi nhóm chat — quyền lực cưỡng chế mà chẳng ai phải to tiếng.</p>`),

  slide(D, 18, 'Reward power',
    `<p class="y-chinh">🎯 A has power over B because A controls rewards that B wants.</p>
     <p>Research indicates reward power often raises job performance, as employees see a strong performance-reward contingency (Shetty, 1978).</p>
     <p class="meo">💡 "Contingency" is the key word: the reward must visibly depend on the performance. A reward everyone gets regardless produces no power and no performance.</p>`,
    `<p class="y-chinh">🎯 A có quyền lực với B vì A nắm những phần thưởng mà B muốn.</p>
     <p>Nghiên cứu cho thấy quyền lực tưởng thưởng thường làm tăng hiệu suất công việc, vì nhân viên thấy rõ mối ràng buộc giữa kết quả và phần thưởng (Shetty, 1978).</p>
     <p class="meo">💡 Chữ then chốt là "ràng buộc": phần thưởng phải phụ thuộc một cách nhìn thấy được vào kết quả. Phần thưởng ai cũng có bất kể làm gì thì không tạo ra quyền lực, cũng không tạo ra hiệu suất.</p>`),

  slide(D, 19, 'Consequences of power — power dependencies',
    `<p class="y-chinh">🎯 Any situation involving power has at least two parties.</p>
     <ol>
       <li>The person attempting to influence others.</li>
       <li>The target or targets of that influence.</li>
     </ol>
     <p><strong>All people are not subject to — or dependent upon — the same bases of power.</strong></p>
     <p class="meo">💡 That sentence is the answer to CQ8.2. The next three slides give the three reasons why.</p>`,
    `<p class="y-chinh">🎯 Mọi tình huống có quyền lực đều có ít nhất hai bên.</p>
     <ol>
       <li>Người đang cố tác động tới người khác.</li>
       <li>Đối tượng hoặc những đối tượng của tác động đó.</li>
     </ol>
     <p><strong>Không phải ai cũng chịu tác động — hay phụ thuộc vào — cùng những nền tảng quyền lực như nhau.</strong></p>
     <p class="meo">💡 Câu đó chính là đáp án cho CQ8.2. Ba slide tiếp theo đưa ra ba lý do.</p>`),

  slide(D, 20, "Vulnerability 1 — the subordinate's values",
    `<p class="y-chinh">🎯 Person B's values influence how susceptible B is.</p>
     <p><span class="nhan">The slide's example</span> — if an employee places a high value on money and believes the supervisor actually controls pay raises, we expect that employee to be highly susceptible to the supervisor's influence.</p>
     <p class="meo">💡 Two conditions, both required: B must <em>want</em> the thing, and B must <em>believe</em> A controls it. Break either and reward power evaporates.</p>`,
    `<p class="y-chinh">🎯 Giá trị của người B quyết định B dễ bị tác động tới đâu.</p>
     <p><span class="nhan">Ví dụ ngay trên slide</span> — nếu một nhân viên coi trọng tiền bạc và tin rằng sếp thực sự nắm quyền tăng lương, ta trông đợi nhân viên đó rất dễ chịu tác động từ sếp.</p>
     <p class="meo">💡 Hai điều kiện, cần cả hai: B phải <em>muốn</em> thứ đó, và B phải <em>tin</em> rằng A nắm nó. Phá vỡ một trong hai là quyền lực tưởng thưởng bốc hơi.</p>`),

  slide(D, 21, 'Vulnerability 2 — the nature of the relationship',
    `<p class="y-chinh">🎯 The relationship between A and B is itself a factor.</p>
     <ul>
       <li>Are A and B peers, or superior and subordinate?</li>
       <li>Is the job permanent or temporary?</li>
     </ul>
     <p>A person on a temporary job may feel less need to acquiesce, because they will not hold the position for long.</p>
     <p class="meo">💡 Applies directly to a ten-week student project: everyone knows the group dissolves in week 10, which quietly weakens every base of power except referent and expert.</p>`,
    `<p class="y-chinh">🎯 Bản thân mối quan hệ giữa A và B cũng là một yếu tố.</p>
     <ul>
       <li>A và B ngang hàng, hay là cấp trên với cấp dưới?</li>
       <li>Công việc là lâu dài hay tạm thời?</li>
     </ul>
     <p>Người làm công việc tạm thời có thể ít thấy cần phải nhượng bộ, vì họ sẽ không giữ vị trí đó lâu.</p>
     <p class="meo">💡 Áp thẳng vào dự án sinh viên mười tuần: ai cũng biết nhóm sẽ tan ở tuần 10, và điều đó lặng lẽ làm yếu mọi nền tảng quyền lực, trừ nể phục và chuyên môn.</p>`),

  slide(D, 22, 'Vulnerability 3 — counterpower',
    `<p class="y-chinh">🎯 B has other sources of power that buffer the effects of A's power.</p>
     <p><span class="nhan">The slide's example</span> — if B is unionised, the union's power may negate A's influence attempts.</p>
     <p class="meo">💡 This is the answer to CQ8.3 in practice: you develop power not only by acquiring a base of your own, but by reducing your dependence on someone else's.</p>`,
    `<p class="y-chinh">🎯 B có những nguồn quyền lực khác làm đệm trước quyền lực của A.</p>
     <p><span class="nhan">Ví dụ trên slide</span> — nếu B có công đoàn, sức mạnh công đoàn có thể vô hiệu hoá các nỗ lực tác động của A.</p>
     <p class="meo">💡 Đây là đáp án thực dụng cho CQ8.3: bạn phát triển quyền lực không chỉ bằng cách tự tạo ra một nền tảng cho mình, mà còn bằng cách giảm sự phụ thuộc vào nền tảng của người khác.</p>`),

  slide(D, 23, 'Uses of power — seven common power tactics',
    `<p class="y-chinh">🎯 Seven tactics used to influence others in organisations.</p>
     <ul class="hai-cot">
       <li>Controlling access to information</li>
       <li>Controlling access to persons</li>
       <li>Selective use of objective criteria</li>
       <li>Controlling the agenda</li>
       <li>Bureaucratic gamesmanship</li>
       <li>Using outside experts</li>
       <li>Coalitions and alliances</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đáng để ý:</strong> "controlling the agenda" and "selective use of objective criteria" look neutral and are the two most common in student groups — whoever writes the meeting list decides what gets discussed, and whoever picks the criteria has already picked the winner.</p>`,
    `<p class="y-chinh">🎯 Bảy chiến thuật được dùng để tác động tới người khác trong tổ chức.</p>
     <ul class="hai-cot">
       <li>Kiểm soát đường tiếp cận thông tin</li>
       <li>Kiểm soát đường tiếp cận con người</li>
       <li>Dùng tiêu chí khách quan một cách chọn lọc</li>
       <li>Kiểm soát chương trình nghị sự</li>
       <li>Lách thủ tục hành chính</li>
       <li>Mượn chuyên gia bên ngoài</li>
       <li>Liên minh và kết phe</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Đáng để ý:</strong> "kiểm soát chương trình nghị sự" và "dùng tiêu chí khách quan một cách chọn lọc" trông rất trung tính và lại là hai chiêu phổ biến nhất trong nhóm sinh viên — ai viết danh mục họp là người quyết cái gì được bàn, còn ai chọn tiêu chí thì đã chọn luôn người thắng.</p>`),

  slide(D, 24, 'Ethical use of referent power',
    `<p class="y-chinh">🎯 Guidelines for using referent power well.</p>
     <ul>
       <li>Treat subordinates fairly.</li>
       <li>Defend subordinates' interests.</li>
       <li>Be sensitive to their needs and feelings.</li>
       <li>Select subordinates similar to oneself.</li>
       <li>Engage in role modelling.</li>
     </ul>
     <p class="meo">💡 The fourth guideline sits awkwardly against Lesson 11 on diverse teams — similarity strengthens referent power but narrows the range of views. Both are true, and a good leader trades them consciously.</p>`,
    `<p class="y-chinh">🎯 Nguyên tắc dùng quyền lực nể phục cho đúng.</p>
     <ul>
       <li>Đối xử công bằng với cấp dưới.</li>
       <li>Bảo vệ lợi ích của cấp dưới.</li>
       <li>Nhạy cảm với nhu cầu và cảm xúc của họ.</li>
       <li>Chọn cấp dưới giống mình.</li>
       <li>Làm gương.</li>
     </ul>
     <p class="meo">💡 Nguyên tắc thứ tư nằm hơi gượng cạnh Bài 11 về đội đa dạng — sự giống nhau làm mạnh quyền lực nể phục nhưng thu hẹp phổ góc nhìn. Cả hai đều đúng, và người lãnh đạo giỏi đánh đổi chúng một cách có ý thức.</p>`),

  slide(D, 25, 'Ethical use of expert power',
    `<p class="y-chinh">🎯 Six guidelines.</p>
     <ul>
       <li>Promote the image of expertise.</li>
       <li>Maintain credibility.</li>
       <li>Act confident and decisive.</li>
       <li>Keep informed.</li>
       <li>Recognise employee concerns.</li>
       <li>Avoid threatening subordinates' self-esteem.</li>
     </ul>
     <p class="meo">💡 The last one connects straight back to SEM (Lesson 4 slide 11): expertise displayed badly reads as a threat, and threatened people stop bringing you information.</p>`,
    `<p class="y-chinh">🎯 Sáu nguyên tắc.</p>
     <ul>
       <li>Gây dựng hình ảnh chuyên môn.</li>
       <li>Giữ uy tín.</li>
       <li>Hành xử tự tin và dứt khoát.</li>
       <li>Luôn cập nhật thông tin.</li>
       <li>Ghi nhận mối bận tâm của nhân viên.</li>
       <li>Tránh làm tổn thương lòng tự trọng của cấp dưới.</li>
     </ul>
     <p class="meo">💡 Điều cuối nối thẳng về mô hình SEM (slide 11 Bài 4): chuyên môn phô ra không khéo sẽ bị đọc thành mối đe doạ, mà người đang thấy bị đe doạ thì thôi mang thông tin đến cho bạn.</p>`),

  slide(D, 26, 'Ethical use of legitimate power',
    `<p class="y-chinh">🎯 Nine guidelines — the longest list, because authority is the easiest base to misuse.</p>
     <ul class="hai-cot">
       <li>Be cordial and polite</li>
       <li>Be confident</li>
       <li>Be clear and follow up to verify understanding</li>
       <li>Make sure the request is appropriate</li>
       <li>Explain the reasons for the request</li>
       <li>Follow proper channels</li>
       <li>Exercise power regularly</li>
       <li>Enforce compliance</li>
       <li>Be sensitive to subordinates' concerns</li>
     </ul>
     <p class="meo">💡 "Exercise power regularly" surprises people: authority never used is quietly assumed not to exist, and the first time you use it then feels like an escalation.</p>`,
    `<p class="y-chinh">🎯 Chín nguyên tắc — danh sách dài nhất, vì thẩm quyền là nền tảng dễ bị lạm dụng nhất.</p>
     <ul class="hai-cot">
       <li>Lịch thiệp, nhã nhặn</li>
       <li>Tự tin</li>
       <li>Nói rõ và kiểm lại xem người kia đã hiểu chưa</li>
       <li>Bảo đảm yêu cầu đưa ra là phù hợp</li>
       <li>Giải thích lý do của yêu cầu</li>
       <li>Đi đúng kênh, đúng quy trình</li>
       <li>Thực thi quyền lực đều đặn</li>
       <li>Bảo đảm việc tuân thủ</li>
       <li>Nhạy cảm với mối bận tâm của cấp dưới</li>
     </ul>
     <p class="meo">💡 "Thực thi quyền lực đều đặn" làm nhiều người ngạc nhiên: thẩm quyền không bao giờ dùng tới sẽ ngầm bị coi là không tồn tại, và lần đầu bạn dùng nó sẽ bị cảm nhận như một cú leo thang.</p>`),

  slide(D, 27, 'Ethical use of reward power',
    `<p class="y-chinh">🎯 Five guidelines.</p>
     <ul>
       <li>Verify compliance.</li>
       <li>Make feasible, reasonable requests.</li>
       <li>Make only ethical, proper requests.</li>
       <li>Offer rewards desired by subordinates.</li>
       <li>Offer only <strong>credible</strong> rewards.</li>
     </ul>
     <p class="meo">💡 "Credible" means you can actually deliver it. One undelivered reward destroys the contingency from slide 18 for everything you promise afterwards.</p>`,
    `<p class="y-chinh">🎯 Năm nguyên tắc.</p>
     <ul>
       <li>Kiểm tra việc thực hiện.</li>
       <li>Đưa yêu cầu khả thi, hợp lý.</li>
       <li>Chỉ đưa những yêu cầu đúng đắn về đạo đức.</li>
       <li>Trao phần thưởng mà cấp dưới thực sự muốn.</li>
       <li>Chỉ hứa những phần thưởng <strong>đáng tin</strong>.</li>
     </ul>
     <p class="meo">💡 "Đáng tin" nghĩa là bạn thực sự trao được. Một lời hứa thưởng không thực hiện sẽ phá huỷ mối ràng buộc ở slide 18 cho mọi thứ bạn hứa về sau.</p>`),

  slide(D, 28, 'Ethical use of coercive power',
    `<p class="y-chinh">🎯 Seven guidelines, and they read as constraints rather than techniques.</p>
     <ul>
       <li>Inform subordinates of rules and penalties.</li>
       <li>Warn before punishing.</li>
       <li>Administer punishment consistently and uniformly.</li>
       <li>Understand the situation before acting.</li>
       <li>Maintain credibility.</li>
       <li>Fit the punishment to the infraction.</li>
       <li><strong>Punish in private.</strong></li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Ghi nhớ cặp này:</strong> praise in public, punish in private. Public punishment adds humiliation to the penalty, which is the coercion Kipnis warned about on slide 17.</p>`,
    `<p class="y-chinh">🎯 Bảy nguyên tắc, và chúng đọc lên giống ràng buộc hơn là kỹ thuật.</p>
     <ul>
       <li>Cho cấp dưới biết rõ quy định và chế tài.</li>
       <li>Cảnh báo trước khi phạt.</li>
       <li>Thi hành hình phạt nhất quán và đồng đều.</li>
       <li>Hiểu tình huống trước khi hành động.</li>
       <li>Giữ uy tín.</li>
       <li>Phạt tương xứng với lỗi.</li>
       <li><strong>Phạt kín.</strong></li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Nhớ theo cặp:</strong> khen nơi đông người, phạt chỗ riêng tư. Phạt công khai là cộng thêm sự hạ nhục vào hình phạt — đúng thứ cưỡng chế mà Kipnis cảnh báo ở slide 17.</p>`),

  slide(D, 29, 'Reflection question',
    `<p class="y-chinh">🎯 Two questions about your own group.</p>
     <ul>
       <li>When you first joined your group, what assumptions did you make about the <strong>status</strong> of different members?</li>
       <li><strong>Where did those assumptions come from?</strong></li>
     </ul>
     <p class="meo">💡 The second question is the real one. Typical honest sources: who spoke first, who is loudest, who already knows someone, appearance, year of study — none of which is expertise.</p>`,
    `<p class="y-chinh">🎯 Hai câu hỏi về chính nhóm bạn.</p>
     <ul>
       <li>Khi mới vào nhóm, bạn đã giả định gì về <strong>địa vị</strong> của từng thành viên?</li>
       <li><strong>Những giả định đó đến từ đâu?</strong></li>
     </ul>
     <p class="meo">💡 Câu thứ hai mới là câu chính. Những nguồn trung thực thường gặp: ai nói trước, ai nói to nhất, ai quen sẵn người nào, ngoại hình, học năm mấy — không cái nào là chuyên môn cả.</p>`),

  slide(D, 30, 'Reflection (cont.)',
    `<p class="y-chinh">🎯 Space for the group discussion.</p>
     <p class="meo">💡 Useful follow-up for a team: which base of power does each member actually hold? Most student groups find expert power spread wide and legitimate power held by nobody, which is exactly why role assignment matters.</p>`,
    `<p class="y-chinh">🎯 Chỗ dành cho phần thảo luận nhóm.</p>
     <p class="meo">💡 Câu hỏi nối tiếp hữu ích cho nhóm: thực tế mỗi thành viên đang nắm nền tảng quyền lực nào? Phần lớn nhóm sinh viên sẽ thấy quyền lực chuyên môn rải đều còn quyền lực chính danh chẳng thuộc về ai — và đó đúng là lý do phải phân vai rõ ràng.</p>`),

  slide(D, 31, 'Q&A',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Three kinds of power, and the two conditions power-with requires?</li>
       <li>Five bases of power, with one example each?</li>
       <li>Three reasons one person is more vulnerable to power than another?</li>
       <li>Why "punish in private"?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Ba dạng quyền lực, và hai điều kiện mà power-with đòi hỏi?</li>
       <li>Năm nền tảng quyền lực, mỗi cái một ví dụ?</li>
       <li>Ba lý do khiến người này dễ chịu tác động của quyền lực hơn người kia?</li>
       <li>Vì sao phải "phạt chỗ riêng tư"?</li>
     </ol>`),

  books([
    ['wig', 'Chapter 5 — power, status and influence in groups', 'Chương 5 — quyền lực, địa vị và ảnh hưởng trong nhóm'],
    ['piercy', 'chương về power trong nhóm nhỏ', 'chương về quyền lực trong nhóm nhỏ'],
  ]),

  bi(
    `<h3>✅ What this replaces</h3>
     <p>The old Academy lesson covered power with a four-row table and stopped there. The syllabus check questions ask who is vulnerable to power attempts (CQ8.2) and how power is developed (CQ8.3) — answered here on slides 19–22.</p>`,
    `<h3>✅ Bài này thay cho cái gì</h3>
     <p>Bài cũ trên Academy nói về quyền lực bằng đúng một bảng bốn dòng rồi dừng. Câu hỏi ôn của syllabus hỏi ai dễ bị tác động bởi quyền lực (CQ8.2) và phát triển quyền lực ra sao (CQ8.3) — được trả lời ở slide 19–22 tại đây.</p>`),
].join('\n');
