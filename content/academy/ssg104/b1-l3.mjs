/**
 * Buổi 1 · Bài 3 — The Psychology of Groups (22 slide).
 *
 * Bám bộ slide "Session 1_..._Lesson 3_The Psychology of Groups.pptx".
 * Đây là bài chứa Tuckman, social loafing, group polarization, hidden profile
 * và groupthink. Bản Academy cũ chỉ có 4 giai đoạn Tuckman và KHÔNG nhắc
 * groupthink lần nào, dù syllabus hỏi thẳng "triệu chứng của groupthink".
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's1-l3';

export const b1l3 = [
  walkHead(D, 1, 22,
    'The densest deck of Session I. Four things here are near-certain exam material: Tuckman\'s five stages, social loafing, the common knowledge effect, and the four causes of groupthink.',
    'Bộ slide nặng nhất của Buổi I. Bốn thứ ở đây gần như chắc chắn vào đề: năm giai đoạn Tuckman, social loafing, hiệu ứng tri thức chung, và bốn nguyên nhân gây groupthink.'),

  slide(D, 1, 'Communication and In-group Working Skills (cont.)',
    `<p class="y-chinh">🎯 Title slide continuing Session I.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề, tiếp nối Buổi I.</p>`),

  slide(D, 2, 'Chapter outline',
    `<p class="y-chinh">🎯 Outline slide — the lesson runs from "why we join groups" to "why groups sometimes decide badly".</p>`,
    `<p class="y-chinh">🎯 Slide mục lục — bài đi từ "vì sao ta gia nhập nhóm" tới "vì sao có lúc nhóm quyết định tồi".</p>`),

  slide(D, 3, 'Learning objectives (4)',
    `<p class="y-chinh">🎯 Four objectives, and each maps to a specific slide later in this deck.</p>
     <ol>
       <li>Review the evidence that humans have a fundamental <strong>need to belong</strong> (slides 6–7).</li>
       <li>Compare the <strong>sociometer model</strong> of self-esteem with the traditional view (discussion Q2, slide 20).</li>
       <li>Describe how groups <strong>change over time</strong> (Tuckman, slides 12–13).</li>
       <li>Apply the theory of <strong>groupthink</strong> to a well-known decision-making group (slides 17–19, discussion Q6 on slide 21).</li>
     </ol>
     <p class="meo">💡 Objective 4 says "apply", not "define". Expect a case, not a definition question.</p>`,
    `<p class="y-chinh">🎯 Bốn mục tiêu, mỗi cái ứng với một slide cụ thể phía sau.</p>
     <ol>
       <li>Xem lại bằng chứng cho thấy con người có <strong>nhu cầu thuộc về</strong> mang tính nền tảng (slide 6–7).</li>
       <li>So sánh <strong>mô hình sociometer</strong> về lòng tự trọng với quan niệm truyền thống (câu thảo luận 2, slide 20).</li>
       <li>Mô tả nhóm <strong>thay đổi theo thời gian</strong> ra sao (Tuckman, slide 12–13).</li>
       <li>Áp dụng lý thuyết <strong>groupthink</strong> vào một nhóm ra quyết định nổi tiếng (slide 17–19, câu thảo luận 6 ở slide 21).</li>
     </ol>
     <p class="meo">💡 Mục tiêu 4 nói "áp dụng", không phải "định nghĩa". Hãy chờ một tình huống, đừng chờ câu hỏi định nghĩa.</p>`),

  slide(D, 4, 'The Psychology of Groups',
    `<p class="y-chinh">🎯 Section divider with the thesis of the lesson.</p>
     <p>"Most of us live out our lives in groups, and these groups have a profound impact on our thoughts, feelings, and actions."</p>
     <p class="meo">💡 Note the three targets: thoughts, feelings, actions. The rest of the deck gives one mechanism for each.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục, mang luôn luận điểm của bài.</p>
     <p>"Phần lớn chúng ta sống đời mình trong các nhóm, và những nhóm ấy tác động sâu sắc tới suy nghĩ, cảm xúc và hành động của ta."</p>
     <p class="meo">💡 Để ý ba đích ngắm: suy nghĩ, cảm xúc, hành động. Phần còn lại của bộ slide đưa ra một cơ chế cho mỗi đích.</p>`),

  slide(D, 5, 'What is the psychological significance of groups?',
    `<p class="y-chinh">🎯 The slide sets up a tension with an Emerson quotation.</p>
     <ul>
       <li><span class="nhan">One side</span> — "I must be myself… I will seek my own": people <em>can</em> live separate and apart from others.</li>
       <li><span class="nhan">Other side</span> — yet they join with others anyway, because groups meet their psychological and social needs.</li>
     </ul>
     <p class="meo">💡 The question the lesson answers is therefore not "can we live alone" but "why don't we".</p>`,
    `<p class="y-chinh">🎯 Slide dựng một mâu thuẫn bằng câu trích của Emerson.</p>
     <ul>
       <li><span class="nhan">Một bên</span> — "Tôi phải là chính tôi… tôi sẽ đi tìm cái của riêng mình": con người <em>có thể</em> sống tách biệt khỏi người khác.</li>
       <li><span class="nhan">Bên kia</span> — vậy mà họ vẫn gia nhập cùng người khác, vì nhóm đáp ứng nhu cầu tâm lý và xã hội của họ.</li>
     </ul>
     <p class="meo">💡 Nên câu hỏi bài này trả lời không phải "ta có sống một mình được không" mà là "vì sao ta không sống thế".</p>`),

  slide(D, 6, 'The need to belong — the numbers',
    `<p class="y-chinh">🎯 Two survey findings used as evidence, with their sources.</p>
     <ul>
       <li><span class="nhan">87.3%</span> of Americans reported living with other people — family, partners, roommates (Davis & Smith, 2007).</li>
       <li><span class="nhan">50–80%</span> reported regularly doing things in groups: attending a sports event, visiting for an evening, sharing a meal, going out to a film (Putnam, 2000).</li>
     </ul>
     <p class="meo">💡 Keep the citation with the number. A statistic without its source is worth nothing in a written assignment, and this course grades two written assignments.</p>`,
    `<p class="y-chinh">🎯 Hai kết quả khảo sát dùng làm bằng chứng, kèm nguồn.</p>
     <ul>
       <li><span class="nhan">87,3%</span> người Mỹ cho biết họ sống cùng người khác — gia đình, bạn đời, bạn cùng phòng (Davis & Smith, 2007).</li>
       <li><span class="nhan">50–80%</span> cho biết thường xuyên làm việc gì đó theo nhóm: đi xem thể thao, sang nhà nhau chơi buổi tối, ăn chung, rủ nhau đi xem phim (Putnam, 2000).</li>
     </ul>
     <p class="meo">💡 Nhớ giữ nguồn đi kèm con số. Một con số không nguồn thì vô giá trị trong bài viết, mà môn này chấm hai bài viết.</p>`),

  slide(D, 7, 'Affiliation in groups',
    `<p class="y-chinh">🎯 Two reasons people affiliate, the second one named after its author.</p>
     <ul>
       <li>Groups give members <strong>information, assistance and social support</strong>.</li>
       <li><span class="nhan">Festinger's theory of social comparison</span> (1950, 1954) — in many cases people join others to <em>evaluate the accuracy of their own beliefs and attitudes</em>.</li>
     </ul>
     <p class="meo">💡 Lesson 4 is built entirely on this second idea, so learn the name Festinger here and you get the next lesson for free.</p>`,
    `<p class="y-chinh">🎯 Hai lý do người ta kết giao, lý do thứ hai mang tên tác giả của nó.</p>
     <ul>
       <li>Nhóm mang lại cho thành viên <strong>thông tin, sự trợ giúp và chỗ dựa xã hội</strong>.</li>
       <li><span class="nhan">Lý thuyết so sánh xã hội của Festinger</span> (1950, 1954) — nhiều khi người ta nhập nhóm để <em>kiểm chứng xem niềm tin và thái độ của mình có đúng không</em>.</li>
     </ul>
     <p class="meo">💡 Bài 4 dựng hoàn toàn trên ý thứ hai này, nên nhớ cái tên Festinger ngay tại đây là bạn được không bài sau.</p>`),

  slide(D, 8, 'Identity and membership — the self is also a "we"',
    `<p class="y-chinh">🎯 Groups answer the question "Who am I?".</p>
     <ul>
       <li>People are defined not only by traits, preferences, interests, likes and dislikes…</li>
       <li>…but also by friendships, social roles, family connections and group memberships.</li>
       <li>So the self is not just a "me", it is also a <strong>"we"</strong>.</li>
     </ul>
     <p class="meo">💡 This is why criticism of your team feels personal: an attack on the "we" lands on the "me".</p>`,
    `<p class="y-chinh">🎯 Nhóm trả lời câu hỏi "Tôi là ai?".</p>
     <ul>
       <li>Con người được định nghĩa không chỉ bằng tính cách, sở thích, mối quan tâm, thích và ghét…</li>
       <li>…mà còn bằng tình bạn, vai trò xã hội, quan hệ gia đình và tư cách thành viên các nhóm.</li>
       <li>Nên cái tôi không chỉ là "tôi", nó còn là <strong>"chúng ta"</strong>.</li>
     </ul>
     <p class="meo">💡 Đây là lý do lời chê nhóm bạn lại thấy như chê chính bạn: đòn đánh vào "chúng ta" rơi trúng "tôi".</p>`),

  slide(D, 9, 'Evolutionary advantages of group living',
    `<p class="y-chinh">🎯 The functional argument: groups are useful, not merely pleasant.</p>
     <ul>
       <li>Groups may be humans' most useful invention — they let us reach goals that would elude us alone.</li>
       <li><span class="nhan">Theory of social integration</span> (Moreland): "people become dependent on one another for the satisfaction of their needs".</li>
     </ul>
     <p class="meo">💡 That dependence is exactly the "interdependence" characteristic from Lesson 1 slide 19, seen from the psychology side.</p>`,
    `<p class="y-chinh">🎯 Lập luận công năng: nhóm hữu ích, không chỉ dễ chịu.</p>
     <ul>
       <li>Nhóm có thể là phát minh hữu dụng nhất của loài người — nó cho ta đạt những mục tiêu mà một mình thì chịu.</li>
       <li><span class="nhan">Lý thuyết hoà nhập xã hội</span> (Moreland): "con người trở nên phụ thuộc lẫn nhau để thoả mãn nhu cầu của mình".</li>
     </ul>
     <p class="meo">💡 Sự phụ thuộc đó chính là đặc điểm "phụ thuộc lẫn nhau" ở slide 19 Bài 1, nhìn từ phía tâm lý học.</p>`),

  slide(D, 10, 'Motivation and performance — facilitation vs loafing',
    `<p class="y-chinh">🎯 Two opposite group effects on effort, on one slide.</p>
     <ul>
       <li><span class="nhan">Social facilitation</span> — does a person perform better alone or as part of a group? Presence of others can raise performance.</li>
       <li><span class="nhan">Social loafing</span> — groups usually outperform individuals ("many hands make light the work", Littlepage 1991; Steiner 1972) <strong>but</strong> individual effort can drop when it is hidden in the total.</li>
     </ul>
     <p><span class="nhan">The remedy the slide gives</span> — recognise that <em>each</em> member has an important part to play in the group's success.</p>
     <p class="pitfall co-tieu-de"><strong>Áp dụng ngay:</strong> in your 30% group project, loafing is prevented by making each person's part visible and named, not by asking people to try harder.</p>`,
    `<p class="y-chinh">🎯 Hai hiệu ứng trái ngược của nhóm lên nỗ lực, gói trong một slide.</p>
     <ul>
       <li><span class="nhan">Thúc đẩy xã hội (social facilitation)</span> — một người làm tốt hơn khi ở một mình hay khi ở trong nhóm? Sự có mặt của người khác có thể nâng hiệu suất.</li>
       <li><span class="nhan">Ăn theo (social loafing)</span> — nhóm thường làm tốt hơn cá nhân ("lắm tay thì việc nhẹ", Littlepage 1991; Steiner 1972) <strong>nhưng</strong> nỗ lực cá nhân có thể tụt khi nó bị giấu trong tổng thể.</li>
     </ul>
     <p><span class="nhan">Cách chữa slide đưa ra</span> — thừa nhận rằng <em>mỗi</em> thành viên đều có một phần quan trọng trong thành công của nhóm.</p>
     <p class="pitfall co-tieu-de"><strong>Áp dụng ngay:</strong> trong dự án nhóm 30% của bạn, chặn ăn theo bằng cách làm phần việc của từng người hiện rõ và gắn tên, chứ không phải bằng cách kêu gọi mọi người cố gắng hơn.</p>`),

  slide(D, 11, 'Teamwork — two key ingredients',
    `<p class="y-chinh">🎯 Research names exactly two ingredients for effective teamwork.</p>
     <ol>
       <li>A <strong>shared mental representation of the task</strong> — everyone picturing the same job.</li>
       <li><strong>Group unity</strong>.</li>
     </ol>
     <p>Teams improve over time as they build a shared understanding of the team and of the tasks they attempt.</p>
     <p class="meo">💡 "Shared mental representation" is testable: ask two members separately what "done" means for the current task. Different answers = you do not have it yet.</p>`,
    `<p class="y-chinh">🎯 Nghiên cứu chỉ ra đúng hai thành tố cho làm việc đội hiệu quả.</p>
     <ol>
       <li><strong>Hình dung chung về nhiệm vụ</strong> — mọi người cùng vẽ trong đầu một công việc giống nhau.</li>
       <li><strong>Sự thống nhất của nhóm</strong>.</li>
     </ol>
     <p>Đội tiến bộ dần theo thời gian khi xây được cách hiểu chung về đội và về những việc họ đang làm.</p>
     <p class="meo">💡 "Hình dung chung" là thứ kiểm được: hỏi riêng hai thành viên xem "xong" nghĩa là gì với nhiệm vụ hiện tại. Trả lời khác nhau = bạn chưa có nó.</p>`),

  slide(D, 12, "Tuckman's group development stages",
    `<p class="y-chinh">🎯 Five stages, in order, drawn as a staircase — each step carries its own one-line description.</p>
     <ol>
       <li><span class="nhan">01 Forming</span> — "Beginning of the group. Members know each other and plan for the forming of the group."</li>
       <li><span class="nhan">02 Storming</span> — "Group members start working and engage each other and struggle for status in the group."</li>
       <li><span class="nhan">03 Norming</span> — "Members of the group establish rules about how they will achieve their goals."</li>
       <li><span class="nhan">04 Performing</span> — "Group members reach the decision and decide to implement the plan and to achieve the objective."</li>
       <li><span class="nhan">05 Adjourning</span> — "As the group project ends, the group dissolves in this phase."</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Trap:</strong> many students list only four stages. Adjourning was added later and is the one most often forgotten — and it is exactly the stage your project group reaches at the end of the term.</p>
     <p class="meo">💡 Storming is not failure. A group that never storms usually norms around whatever the loudest member said first.</p>`,
    `<p class="y-chinh">🎯 Năm giai đoạn, theo thứ tự, vẽ như bậc thang — mỗi bậc có một dòng mô tả riêng.</p>
     <ol>
       <li><span class="nhan">01 Forming — hình thành</span>: "Nhóm mới bắt đầu. Các thành viên làm quen và lên kế hoạch lập nhóm."</li>
       <li><span class="nhan">02 Storming — sóng gió</span>: "Các thành viên bắt tay làm, va chạm với nhau và tranh giành vị thế trong nhóm."</li>
       <li><span class="nhan">03 Norming — định chuẩn</span>: "Các thành viên đặt ra quy tắc về cách cả nhóm sẽ đạt mục tiêu."</li>
       <li><span class="nhan">04 Performing — vận hành</span>: "Các thành viên đi tới quyết định, triển khai kế hoạch và đạt mục tiêu."</li>
       <li><span class="nhan">05 Adjourning — giải thể</span>: "Khi dự án nhóm kết thúc, nhóm giải tán ở giai đoạn này."</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> nhiều sinh viên chỉ kể bốn giai đoạn. Adjourning được bổ sung về sau và là cái hay bị quên nhất — mà đó đúng là giai đoạn nhóm dự án của bạn sẽ tới vào cuối kỳ.</p>
     <p class="meo">💡 Sóng gió không phải là thất bại. Nhóm không bao giờ sóng gió thường định chuẩn theo đúng câu người nói to nhất phát ra đầu tiên.</p>`),

  slide(D, 13, "Tuckman's stages — the picture version",
    `<p class="y-chinh">🎯 The same five stages as slide 12, drawn as a rising line of cartoon characters so you can recognise each stage by what the group is <em>doing</em>.</p>
     <ul>
       <li><span class="nhan">forming</span> — a pile of characters crowding together, still a heap rather than a team.</li>
       <li><span class="nhan">storming</span> — some stand around, others kick and wrestle each other.</li>
       <li><span class="nhan">norming</span> — three stand side by side and talk calmly.</li>
       <li><span class="nhan">performing</span> — one in a hard hat reads a plan while the others work beside him.</li>
       <li><span class="nhan">adjourning</span> — a farewell picture: "GOOD BYE CARO! WE WILL MISS U!".</li>
     </ul>
     <p class="meo">💡 Exam questions usually describe behaviour, not the stage name ("members argue about who decides…"). Practise naming the stage from the behaviour, exactly as this picture asks you to.</p>`,
    `<p class="y-chinh">🎯 Vẫn năm giai đoạn của slide 12, nhưng vẽ thành một dãy nhân vật hoạt hình đi lên dần, để bạn nhận ra mỗi giai đoạn qua việc nhóm đang <em>làm</em>.</p>
     <ul>
       <li><span class="nhan">forming</span> — một đống nhân vật xúm lại với nhau, vẫn là một đám chứ chưa thành đội.</li>
       <li><span class="nhan">storming</span> — vài người đứng nhìn, mấy người khác đá nhau, vật nhau.</li>
       <li><span class="nhan">norming</span> — ba người đứng cạnh nhau, nói chuyện bình tĩnh.</li>
       <li><span class="nhan">performing</span> — một người đội mũ bảo hộ đọc bản kế hoạch, những người khác làm việc bên cạnh.</li>
       <li><span class="nhan">adjourning</span> — bức ảnh chia tay: "GOOD BYE CARO! WE WILL MISS U!".</li>
     </ul>
     <p class="meo">💡 Câu hỏi thi thường mô tả hành vi chứ không gọi tên giai đoạn ("các thành viên cãi nhau xem ai được quyết…"). Hãy tập gọi tên giai đoạn từ hành vi, đúng như bức tranh này bắt bạn làm.</p>`),

  slide(D, 14, 'Making decisions in groups — the promise',
    `<p class="y-chinh">🎯 Three arguments for deciding as a group, and one warning.</p>
     <ul>
       <li>Groups can draw on more resources than a lone individual.</li>
       <li>Discussion produces more ideas and more possible solutions.</li>
       <li>So a group's decision <em>should</em> be superior to an individual's.</li>
       <li><span class="nhan">However</span> — groups do not always make good decisions.</li>
     </ul>
     <p class="meo">💡 The rest of the deck names three ways that promise breaks: group polarization (slide 15), the common knowledge effect (slide 16) and groupthink (slides 17–19).</p>`,
    `<p class="y-chinh">🎯 Ba lập luận ủng hộ quyết định theo nhóm, và một lời cảnh báo.</p>
     <ul>
       <li>Nhóm huy động được nhiều nguồn lực hơn một cá nhân đơn lẻ.</li>
       <li>Thảo luận đẻ ra nhiều ý tưởng và nhiều phương án hơn.</li>
       <li>Nên quyết định của nhóm <em>lẽ ra</em> phải tốt hơn quyết định cá nhân.</li>
       <li><span class="nhan">Tuy nhiên</span> — nhóm không phải lúc nào cũng quyết định đúng.</li>
     </ul>
     <p class="meo">💡 Phần còn lại của bộ slide gọi tên ba cách lời hứa đó bị vỡ: phân cực nhóm (slide 15), hiệu ứng tri thức chung (slide 16) và groupthink (slide 17–19).</p>`),

  slide(D, 15, 'Group polarization',
    `<p class="y-chinh">🎯 Common sense says groups moderate their members. The evidence says the opposite.</p>
     <p>Many groups shift toward <strong>more extreme</strong> decisions after group interaction, not less extreme ones.</p>
     <p><span class="nhan">The slide's own example</span> — a member suggests showing a short video that is amusing but contains provocative images. You first think it is inappropriate, then change your mind as the group discusses it.</p>
     <p class="meo">💡 Mechanism worth knowing: hearing arguments on one side and wanting to fit the group's direction both push the same way, so the average moves outward instead of inward.</p>`,
    `<p class="y-chinh">🎯 Cảm quan thông thường bảo nhóm sẽ làm dịu các thành viên. Bằng chứng lại nói ngược.</p>
     <p>Nhiều nhóm sau khi thảo luận thì dịch về phía quyết định <strong>cực đoan hơn</strong>, chứ không ôn hoà hơn.</p>
     <p><span class="nhan">Chính ví dụ trên slide</span> — một thành viên đề nghị chiếu đoạn video vui nhưng có hình ảnh gây tranh cãi. Ban đầu bạn thấy không phù hợp, rồi đổi ý dần khi cả nhóm bàn về nó.</p>
     <p class="meo">💡 Cơ chế đáng nhớ: nghe lập luận nghiêng về một phía, cộng với việc muốn hoà theo hướng của nhóm, cả hai cùng đẩy về một bên, nên trung bình dịch ra ngoài chứ không dịch vào trong.</p>`),

  slide(D, 16, 'Common knowledge effect / shared information bias',
    `<p class="y-chinh">🎯 Researchers study this with the <strong>hidden profile task</strong>, and the design is the whole point.</p>
     <ul>
       <li>Information known to <em>many</em> members suggests Option A is best.</li>
       <li>Option B is definitely better — but the facts supporting B are held by <em>individual</em> members only.</li>
       <li>The group spends most of its time reviewing what favours A, and never discovers A's drawbacks.</li>
     </ul>
     <p><span class="nhan">Consequence</span> — groups perform poorly on problems whose solution is non-obvious and can only be found by extensive information sharing.</p>
     <p class="meo">💡 Practical counter-move: before discussing, ask every member to write down what only they know. Discussion naturally gravitates to what everyone already has.</p>`,
    `<p class="y-chinh">🎯 Các nhà nghiên cứu dùng <strong>nhiệm vụ hồ sơ ẩn (hidden profile)</strong> để nghiên cứu chuyện này, và chính thiết kế ấy mới là điểm mấu chốt.</p>
     <ul>
       <li>Thông tin mà <em>nhiều</em> thành viên cùng biết thì gợi ý Phương án A là tốt nhất.</li>
       <li>Phương án B mới thực sự tốt hơn — nhưng các dữ kiện ủng hộ B lại chỉ nằm ở <em>từng</em> cá nhân.</li>
       <li>Nhóm dành phần lớn thời gian mổ xẻ những thứ ủng hộ A, và không bao giờ phát hiện ra nhược điểm của A.</li>
     </ul>
     <p><span class="nhan">Hệ quả</span> — nhóm làm kém với những bài toán mà lời giải không hiển nhiên, chỉ tìm ra được nếu chia sẻ thông tin thật rộng.</p>
     <p class="meo">💡 Nước đi hoá giải: trước khi thảo luận, yêu cầu mỗi người viết ra thứ chỉ mình biết. Thảo luận tự nhiên sẽ trôi về phía ai cũng đã biết.</p>`),

  slide(D, 17, 'Groupthink — what it is',
    `<p class="y-chinh">🎯 A cartoon meeting plus the definition of groupthink.</p>
     <p>Around the table the chair asks <em>"So, do we agree?"</em> and every speech bubble says "Yes" or "Agree". But the thought bubbles under the table say <strong>"No"</strong>, <strong>"We're doomed!"</strong>, <strong>"No"</strong>, <strong>"Bad idea!"</strong>.</p>
     <p><span class="nhan">Definition on the slide</span> — "Groupthink is a phenomenon where people tend to conform with group decisions to avoid feeling outcast, leading to errors in decision making." (the slide prints "confirm"; the intended word is <em>conform</em>, to go along with.)</p>
     <p class="meo">💡 The gap between what is said aloud and what is thought silently <em>is</em> groupthink. Nobody in the picture is stupid; each one stays quiet to avoid being the odd one out.</p>`,
    `<p class="y-chinh">🎯 Một cuộc họp vẽ hoạt hình, kèm định nghĩa groupthink.</p>
     <p>Quanh bàn, người chủ trì hỏi <em>"So, do we agree?"</em> (Vậy ta đồng ý chứ?) và bong bóng lời nói nào cũng là "Yes" hay "Agree". Nhưng bong bóng suy nghĩ dưới gầm bàn lại là <strong>"No"</strong>, <strong>"We're doomed!"</strong> (Toi rồi!), <strong>"No"</strong>, <strong>"Bad idea!"</strong> (Ý tồi!).</p>
     <p><span class="nhan">Định nghĩa trên slide</span> — "Groupthink là hiện tượng người ta có xu hướng xuôi theo quyết định của nhóm để khỏi cảm thấy bị gạt ra ngoài, dẫn tới sai lầm khi ra quyết định." (slide in chữ "confirm"; ý đúng là <em>conform</em> — xuôi theo.)</p>
     <p class="meo">💡 Khoảng cách giữa điều nói ra và điều nghĩ thầm <em>chính là</em> groupthink. Không ai trong tranh ngốc cả; ai cũng im lặng để khỏi thành người lạc loài.</p>`),

  slide(D, 18, 'Groupthink — the four group-level causes',
    `<p class="y-chinh">🎯 "Groups sometimes make spectacularly bad decisions." Four group-level factors combine to cause groupthink.</p>
     <ol>
       <li><span class="nhan">Cohesion</span> — the group values agreement more than accuracy.</li>
       <li><span class="nhan">Isolation</span> — no outside information or challenge reaches it.</li>
       <li><span class="nhan">Biased leadership</span> — the leader states a preference first and the rest align.</li>
       <li><span class="nhan">Decisional stress</span> — time pressure and high stakes cut the search for alternatives short.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Trap:</strong> cohesion appears in this course twice with opposite signs — it is part of the definition of a team (Lesson 1 slide 17) and the first cause of groupthink here. Both are true: cohesion without dissent is the dangerous version.</p>
     <p class="meo">💡 Objective 4 asks you to <em>apply</em> this to a well-known group. Classic cases: the Bay of Pigs decision, the Challenger launch decision.</p>`,
    `<p class="y-chinh">🎯 "Có lúc nhóm ra những quyết định tồi đến kinh ngạc." Bốn yếu tố cấp nhóm cộng lại gây ra groupthink.</p>
     <ol>
       <li><span class="nhan">Cohesion — gắn kết</span>: nhóm coi trọng sự đồng thuận hơn sự chính xác.</li>
       <li><span class="nhan">Isolation — biệt lập</span>: không có thông tin hay phản biện nào từ bên ngoài lọt vào.</li>
       <li><span class="nhan">Biased leadership — lãnh đạo thiên lệch</span>: người đứng đầu nêu ý muốn trước, phần còn lại đi theo.</li>
       <li><span class="nhan">Decisional stress — áp lực ra quyết định</span>: gấp gáp và đặt cược lớn khiến việc tìm phương án bị cắt ngắn.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> "gắn kết" xuất hiện hai lần trong môn này với hai dấu ngược nhau — nó nằm trong định nghĩa của đội (Bài 1 slide 17) và là nguyên nhân đầu tiên gây groupthink ở đây. Cả hai đều đúng: gắn kết mà không có tiếng nói trái chiều mới là phiên bản nguy hiểm.</p>
     <p class="meo">💡 Mục tiêu 4 yêu cầu bạn <em>áp dụng</em> vào một nhóm nổi tiếng. Ca kinh điển: quyết định đổ bộ Vịnh Con Lợn, quyết định phóng tàu Challenger.</p>`),

  slide(D, 19, 'Groupthink vs breaking groupthink',
    `<p class="y-chinh">🎯 Two drawings side by side: a closed circle on the left, an open circle on the right.</p>
     <ul>
       <li><span class="nhan">Groupthink</span> (solid circle, four people) — "I have an idea!", "I was thinking the same thing", "That was my idea…", "No, it was mine!". Everyone echoes and argues about <em>whose</em> idea it is; nothing new gets in.</li>
       <li><span class="nhan">Breaking groupthink</span> (dashed circle) — an outsider asks <em>"Did you know about…?"</em> and an arrow carries the new information inside. Reactions: "Thanks, now I got a better idea!", "That's a good one…", "Why didn't we think of that before?", "Where did that come from?".</li>
     </ul>
     <p class="meo">💡 The dashed line is the remedy for cause no. 2 (isolation): let outside information and outside people in. In a student project that means showing the draft to another group or to the lecturer <em>before</em> the deadline, not after.</p>`,
    `<p class="y-chinh">🎯 Hai hình đặt cạnh nhau: bên trái một vòng tròn kín, bên phải một vòng tròn hở.</p>
     <ul>
       <li><span class="nhan">Groupthink</span> (vòng liền, bốn người) — "Tôi có ý này!", "Tôi cũng đang nghĩ y vậy", "Ý đó của tôi mà…", "Không, của tôi chứ!". Ai cũng nói theo và cãi nhau xem ý là <em>của ai</em>; không có gì mới lọt vào.</li>
       <li><span class="nhan">Breaking groupthink — phá groupthink</span> (vòng nét đứt) — một người ngoài hỏi <em>"Did you know about…?"</em> (Các bạn có biết về… không?) và một mũi tên đưa thông tin mới vào trong. Phản ứng: "Cảm ơn, giờ tôi có ý hay hơn!", "Ý đó hay đấy…", "Sao trước giờ mình không nghĩ ra nhỉ?", "Ý đó ở đâu ra vậy?".</li>
     </ul>
     <p class="meo">💡 Nét đứt chính là thuốc chữa nguyên nhân số 2 (biệt lập): mở cửa cho thông tin và người bên ngoài. Với dự án sinh viên, nghĩa là đưa bản nháp cho nhóm khác hoặc giảng viên xem <em>trước</em> hạn nộp, chứ không phải sau.</p>`),

  slide(D, 20, 'You and your groups — discussion questions 1–3',
    `<p class="y-chinh">🎯 Three questions; here is the material each one wants.</p>
     <p><span class="nhan">1. What are the advantages and disadvantages of sociality? Why do people often join groups?</span> Use slides 6–9 for the advantages and slide 10 (loafing) plus slides 15–19 for the costs.</p>
     <p><span class="nhan">2. Is self-esteem shaped by your personality qualities or by the value and qualities of the groups to which you belong?</span> This is the sociometer question from objective 2: the sociometer model treats self-esteem as a <em>gauge of social acceptance</em> rather than a fixed inner trait.</p>
     <p><span class="nhan">3. In what ways does membership in a group change a person's self-concept and social identity?</span> Slide 8 — the self becomes a "we".</p>`,
    `<p class="y-chinh">🎯 Ba câu hỏi; đây là phần kiến thức mà mỗi câu đang đòi.</p>
     <p><span class="nhan">1. Lợi và hại của tính xã hội là gì? Vì sao người ta hay gia nhập nhóm?</span> Dùng slide 6–9 cho phần lợi, slide 10 (ăn theo) cùng slide 15–19 cho phần giá phải trả.</p>
     <p><span class="nhan">2. Lòng tự trọng do phẩm chất tính cách của bạn hay do giá trị và phẩm chất của các nhóm bạn thuộc về định hình?</span> Đây chính là câu hỏi sociometer ở mục tiêu 2: mô hình sociometer coi lòng tự trọng như một <em>đồng hồ đo mức được chấp nhận</em>, chứ không phải một phẩm chất bên trong cố định.</p>
     <p><span class="nhan">3. Tư cách thành viên trong nhóm thay đổi hình ảnh bản thân và bản sắc xã hội của một người theo những cách nào?</span> Slide 8 — cái tôi trở thành "chúng ta".</p>`),

  slide(D, 21, 'You and your groups — discussion questions 4–6',
    `<p class="y-chinh">🎯 Three more questions — the last two close the loop back to your own project.</p>
     <p><span class="nhan">4. What steps would you take to base a self-esteem enrichment program in schools on the sociometer model of self-worth?</span> If the gauge reads acceptance, then the program must change real inclusion (who gets picked, who gets heard), not repeat affirmations.</p>
     <p><span class="nhan">5. What are the key ingredients to transforming a working group into a true team?</span> Slide 11 gives the two ingredients — a shared mental representation of the task, and group unity — and Lesson 1 slide 19 adds interdependence.</p>
     <p><span class="nhan">6. Have you ever been part of a group that made a poor decision — were any symptoms of groupthink present?</span> Check the four causes from slide 18 one by one, and ask whether anyone said "yes" aloud while thinking "no" (slide 17).</p>
     <p class="meo">💡 These questions are exactly the shape of the Activity component (15%): answered aloud, in your group, during class. Write one sentence per question before class — Participation (10%) is graded on what you say, not on what you thought.</p>`,
    `<p class="y-chinh">🎯 Thêm ba câu nữa — hai câu cuối khép vòng trở lại chính dự án của bạn.</p>
     <p><span class="nhan">4. Nếu dựa trên mô hình sociometer để làm một chương trình nâng lòng tự trọng cho trường học, bạn sẽ làm những bước nào?</span> Nếu đồng hồ đo mức được chấp nhận, thì chương trình phải thay đổi sự hoà nhập thật (ai được chọn, ai được lắng nghe), chứ không phải lặp lại mấy câu động viên.</p>
     <p><span class="nhan">5. Thành tố then chốt nào biến một nhóm làm việc thành một đội thực thụ?</span> Slide 11 cho hai thành tố — hình dung chung về nhiệm vụ và sự thống nhất — còn slide 19 Bài 1 thêm yếu tố phụ thuộc lẫn nhau.</p>
     <p><span class="nhan">6. Bạn từng ở trong nhóm ra quyết định tồi chưa — có triệu chứng groupthink nào không?</span> Soi lần lượt bốn nguyên nhân ở slide 18, và tự hỏi có ai nói "đồng ý" thành tiếng trong khi nghĩ "không" (slide 17) không.</p>
     <p class="meo">💡 Những câu hỏi này đúng dạng của cột Activity (15%): trả lời miệng, trong nhóm, ngay trong giờ. Viết sẵn mỗi câu một dòng trước khi lên lớp — Participation (10%) chấm theo cái bạn nói ra, không theo cái bạn nghĩ.</p>`),

  slide(D, 22, "It's Q&A time!",
    `<p class="y-chinh">🎯 Closing slide — time for your questions. Self-check before you leave:</p>
     <ol>
       <li>Five Tuckman stages, in order, adjourning included?</li>
       <li>Difference between social facilitation and social loafing?</li>
       <li>Why does the hidden profile task defeat groups?</li>
       <li>Definition of groupthink, and its four causes?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết — giờ hỏi đáp. Tự kiểm trước khi rời lớp:</p>
     <ol>
       <li>Năm giai đoạn Tuckman, đúng thứ tự, có cả adjourning chứ?</li>
       <li>Khác nhau giữa social facilitation và social loafing?</li>
       <li>Vì sao nhiệm vụ hồ sơ ẩn đánh bại được nhóm?</li>
       <li>Định nghĩa groupthink, và bốn nguyên nhân của nó?</li>
     </ol>`),

  books([
    ['piercy', 'chương "The Psychology of Groups" — need to belong, groupthink', 'chương "The Psychology of Groups" — nhu cầu thuộc về, groupthink'],
    ['wig', 'Chapter 3 — group development and decision making', 'Chương 3 — phát triển nhóm và ra quyết định'],
  ]),

  bi(
    `<h3>✅ Why this lesson matters for the exam</h3>
     <p>The syllabus check questions name groupthink, group polarization, the common knowledge effect, social loafing and the sociometer model — together with Tuckman's five stages, they are the core of this lesson. Learn each one with its definition and one example.</p>`,
    `<h3>✅ Vì sao bài này quan trọng cho bài thi</h3>
     <p>Câu hỏi ôn của syllabus gọi tên groupthink, phân cực nhóm, hiệu ứng tri thức chung, social loafing và mô hình sociometer — cùng với năm giai đoạn Tuckman, đó là lõi của bài này. Học mỗi khái niệm kèm định nghĩa và một ví dụ.</p>`),
].join('\n');
