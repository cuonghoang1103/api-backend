/**
 * Buổi 3 · Bài 10–11 — Leadership & Working in Diverse Teams (36 slide).
 *
 * Bám bộ "Session 3_..._Lesson 10 _ 11_Leadership _ Working in Diverse Teams".
 * Hai bài trong một bộ: nửa đầu về bản chất lãnh đạo (leader vs manager,
 * designated vs emergent, lãnh đạo như thực thi ảnh hưởng), nửa sau về đội đa
 * văn hoá và SÁU chiều văn hoá Hofstede — syllabus hỏi CQ9.1 đúng chỗ này, và
 * bản Academy cũ có 0 lần nhắc "cultur"/"Hofstede".
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's3-l10-11';

export const b3l1011 = [
  walkHead(D, 1, 36,
    'Two lessons, one deck. Leader vs manager (slides 5–8) and the six cultural dimensions (slides 28–34) are the two blocks worth memorising; the homework list on slide 21 names five leadership theories the syllabus expects you to have read.',
    'Hai bài trong một bộ slide. Lãnh đạo vs quản lý (slide 5–8) và sáu chiều văn hoá (slide 28–34) là hai khối đáng thuộc; danh sách bài về nhà ở slide 21 gọi tên năm lý thuyết lãnh đạo mà syllabus trông đợi bạn đã đọc.'),

  slide(D, 1, 'Session III — Group & Team Theory (cont.)',
    `<p class="y-chinh">🎯 Title slide continuing Session III.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề, tiếp nối Buổi III.</p>`),

  slide(D, 2, 'Two lessons: 2. Leadership · 3. Working in Diverse Teams',
    `<p class="y-chinh">🎯 The deck covers both lessons, in that order.</p>
     <p class="meo">💡 They belong together: the hardest leadership problem in this course is leading people who do not share your assumptions.</p>`,
    `<p class="y-chinh">🎯 Bộ slide này phủ cả hai bài, theo đúng thứ tự đó.</p>
     <p class="meo">💡 Chúng đi liền nhau có lý: bài toán lãnh đạo khó nhất trong môn này là dẫn dắt những người không chia sẻ cùng giả định với bạn.</p>`),

  slide(D, 3, '2. Leadership',
    `<p class="y-chinh">🎯 Section divider.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục.</p>`),

  slide(D, 4, 'The nature of leadership — the question',
    `<p class="y-chinh">🎯 "What is the nature of leadership and the leadership process?"</p>
     <p class="meo">💡 Note it asks about a <em>process</em>, not a person. That framing decides everything that follows.</p>`,
    `<p class="y-chinh">🎯 "Bản chất của lãnh đạo và quá trình lãnh đạo là gì?"</p>
     <p class="meo">💡 Để ý câu hỏi nói về một <em>quá trình</em>, không phải một con người. Cách đặt vấn đề đó quyết định mọi thứ phía sau.</p>`),

  slide(D, 5, 'Leadership — the definition',
    `<p class="y-chinh">🎯 Leadership is frequently defined as a <strong>social (interpersonal) influence relationship</strong> between two or more persons who depend on each other to attain certain mutual goals in a group situation.</p>
     <ul>
       <li><span class="nhan">Relationship</span> — not a title, not a trait.</li>
       <li><span class="nhan">Depend on each other</span> — the interdependence from Lesson 1 again.</li>
       <li><span class="nhan">Mutual goals</span> — if the goals are not shared, what you have is power-over, not leadership.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Lãnh đạo thường được định nghĩa là <strong>mối quan hệ ảnh hưởng xã hội (liên cá nhân)</strong> giữa hai hoặc nhiều người phụ thuộc lẫn nhau để đạt những mục tiêu chung trong bối cảnh nhóm.</p>
     <ul>
       <li><span class="nhan">Mối quan hệ</span> — không phải chức danh, cũng không phải phẩm chất.</li>
       <li><span class="nhan">Phụ thuộc lẫn nhau</span> — lại chính là yếu tố ở Bài 1.</li>
       <li><span class="nhan">Mục tiêu chung</span> — nếu mục tiêu không chung, thứ bạn có là quyền lực áp đặt, không phải lãnh đạo.</li>
     </ul>`),

  slide(D, 6, 'Leader vs manager — not interchangeable',
    `<p class="y-chinh">🎯 The two pairs — leader/manager and leadership/management — are neither interchangeable nor redundant.</p>
     <p>In many instances, to be a good manager one needs to be an effective leader. Effective leadership often requires the ability to manage: set goals; plan, devise and implement strategy; make decisions and solve problems; organise and control.</p>
     <p class="meo">💡 So the relationship is overlap, not opposition. Slogans like "managers do things right, leaders do the right thing" oversimplify what this slide says.</p>`,
    `<p class="y-chinh">🎯 Hai cặp khái niệm — người lãnh đạo/người quản lý và lãnh đạo/quản lý — không thể thay thế nhau, cũng không thừa.</p>
     <p>Nhiều khi, muốn là người quản lý giỏi thì phải là người lãnh đạo hiệu quả. Ngược lại, lãnh đạo hiệu quả thường đòi khả năng quản lý: đặt mục tiêu; lập kế hoạch, vạch và triển khai chiến lược; ra quyết định và giải quyết vấn đề; tổ chức và kiểm soát.</p>
     <p class="meo">💡 Vậy quan hệ giữa chúng là giao nhau, không phải đối lập. Những câu khẩu hiệu kiểu "quản lý làm đúng cách, lãnh đạo làm đúng việc" đơn giản hoá quá mức điều slide này nói.</p>`),

  slide(D, 7, 'Leader vs manager — the two definitions',
    `<p class="y-chinh">🎯 Defined side by side.</p>
     <ul>
       <li><span class="nhan">Management</span> — a process consisting of planning, organising, directing and controlling.</li>
       <li><span class="nhan">Leadership</span> — a social (interpersonal) influence relationship between two or more people who depend on each other for goal attainment.</li>
     </ul>
     <p class="meo">💡 One is a list of functions; the other is a relationship. That difference is the answer to "are they the same?".</p>`,
    `<p class="y-chinh">🎯 Đặt cạnh nhau để định nghĩa.</p>
     <ul>
       <li><span class="nhan">Quản lý</span> — một quá trình gồm hoạch định, tổ chức, điều hành và kiểm soát.</li>
       <li><span class="nhan">Lãnh đạo</span> — mối quan hệ ảnh hưởng xã hội giữa hai hay nhiều người phụ thuộc lẫn nhau để đạt mục tiêu.</li>
     </ul>
     <p class="meo">💡 Một bên là danh sách chức năng; bên kia là một mối quan hệ. Chính khác biệt đó là câu trả lời cho "hai thứ có giống nhau không?".</p>`),

  slide(D, 8, 'Leader vs manager — how they reach the position',
    `<p class="y-chinh">🎯 They differ in the process by which they arrive.</p>
     <ul>
       <li><span class="nhan">Managers</span> are generally <strong>appointed</strong> to their role.</li>
       <li><span class="nhan">Leadership</span> is a relationship that revolves around the followers' <strong>acceptance or rejection</strong> of the leader. Leaders often emerge out of events that unfold among members of a group.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hệ quả:</strong> appointment can be announced; acceptance cannot. Being named team leader in week 1 does not make you the leader in week 4.</p>`,
    `<p class="y-chinh">🎯 Họ khác nhau ở con đường đi tới vị trí đó.</p>
     <ul>
       <li><span class="nhan">Người quản lý</span> thường được <strong>bổ nhiệm</strong> vào vai trò.</li>
       <li><span class="nhan">Lãnh đạo</span> là mối quan hệ xoay quanh việc người theo <strong>chấp nhận hay từ chối</strong> người dẫn dắt. Người lãnh đạo thường nổi lên từ chính những sự việc diễn ra giữa các thành viên trong nhóm.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hệ quả:</strong> bổ nhiệm thì tuyên bố được; sự chấp nhận thì không. Được gọi là nhóm trưởng ở tuần 1 không có nghĩa bạn là người lãnh đạo ở tuần 4.</p>`),

  slide(D, 9, 'Leader vs manager — where the power comes from',
    `<p class="y-chinh">🎯 They differ in the type and source of power they exercise.</p>
     <ul>
       <li><span class="nhan">Managers</span> commonly derive power from the larger organisation — legitimate power (Lesson 9 slide 16).</li>
       <li><span class="nhan">Leaders</span> can use carrots and sticks too, but it is far more common for them to derive power from followers' perception of their <strong>knowledge, personality and attractiveness</strong>, and from the working relationship that has developed.</li>
     </ul>
     <p class="meo">💡 Read that as expert power plus referent power. Lesson 9 and Lesson 10 are the same map drawn twice.</p>`,
    `<p class="y-chinh">🎯 Họ khác nhau ở loại quyền lực và nguồn gốc quyền lực.</p>
     <ul>
       <li><span class="nhan">Người quản lý</span> thường lấy quyền lực từ tổ chức lớn hơn — tức quyền lực chính danh (slide 16 Bài 9).</li>
       <li><span class="nhan">Người lãnh đạo</span> cũng dùng được củ cà rốt và cây gậy, nhưng phổ biến hơn nhiều là lấy quyền lực từ cách người theo nhìn nhận <strong>kiến thức, tính cách và sức hút</strong> của họ, cùng mối quan hệ làm việc đã hình thành.</li>
     </ul>
     <p class="meo">💡 Hãy đọc đó là quyền lực chuyên môn cộng quyền lực nể phục. Bài 9 và Bài 10 là cùng một tấm bản đồ được vẽ hai lần.</p>`),

  slide(D, 10, 'The leadership process — five components',
    `<p class="y-chinh">🎯 Leadership is a process: a complex, dynamic exchange relationship built <strong>over time</strong> between leader and follower, and between leader and the group of followers.</p>
     <p><span class="nhan">Five key components of this working relationship</span></p>
     <ol>
       <li>The leader</li>
       <li>The followers</li>
       <li>The context (situation)</li>
       <li>The leadership process itself</li>
       <li>The consequences (outcomes)</li>
     </ol>
     <p class="meo">💡 Any explanation of a leadership failure that names only component 1 is incomplete by this model.</p>`,
    `<p class="y-chinh">🎯 Lãnh đạo là một quá trình: mối quan hệ trao đổi phức tạp, động, được dựng <strong>theo thời gian</strong> giữa người dẫn dắt và người theo, và giữa người dẫn dắt với cả nhóm.</p>
     <p><span class="nhan">Năm thành phần then chốt của mối quan hệ làm việc này</span></p>
     <ol>
       <li>Người lãnh đạo</li>
       <li>Những người theo</li>
       <li>Bối cảnh (tình huống)</li>
       <li>Bản thân quá trình lãnh đạo</li>
       <li>Hệ quả (kết quả)</li>
     </ol>
     <p class="meo">💡 Mọi lời giải thích cho một thất bại lãnh đạo mà chỉ nêu thành phần số 1 đều là thiếu, theo mô hình này.</p>`),

  slide(D, 11, 'The leader',
    `<p class="y-chinh">🎯 Leaders are people who <strong>take charge of or guide</strong> the activities of others.</p>
     <p class="meo">💡 "Take charge of <em>or</em> guide" — the definition deliberately admits both the directive and the facilitative version, which is why the styles on the homework list differ so much.</p>`,
    `<p class="y-chinh">🎯 Người lãnh đạo là người <strong>đứng ra cầm trịch hoặc dẫn dắt</strong> hoạt động của người khác.</p>
     <p class="meo">💡 "Cầm trịch <em>hoặc</em> dẫn dắt" — định nghĩa cố ý chấp nhận cả phiên bản ra lệnh lẫn phiên bản hỗ trợ, và đó là lý do các phong cách trong danh sách bài về nhà khác nhau tới vậy.</p>`),

  slide(D, 12, 'The context, the process, the consequences',
    `<p class="y-chinh">🎯 Three of the five components defined.</p>
     <ul>
       <li><span class="nhan">The context</span> — the situation that surrounds the leader and the followers.</li>
       <li><span class="nhan">The process</span> — a complex, interactive, dynamic working relationship between leader and followers.</li>
       <li><span class="nhan">The consequences</span> — two outcomes matter: (1) have the group's <strong>maintenance</strong> needs been fulfilled? (2) have the group's <strong>task</strong> needs been met?</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hai loại nhu cầu này hay ra đề:</strong> task needs = getting the work done; maintenance needs = keeping the group able to keep working. A leader who delivers the product and destroys the team has met one of two.</p>`,
    `<p class="y-chinh">🎯 Ba trong năm thành phần được định nghĩa.</p>
     <ul>
       <li><span class="nhan">Bối cảnh</span> — tình huống bao quanh người lãnh đạo và những người theo.</li>
       <li><span class="nhan">Quá trình</span> — mối quan hệ làm việc phức tạp, tương tác, luôn động giữa người lãnh đạo và người theo.</li>
       <li><span class="nhan">Hệ quả</span> — hai kết quả quan trọng: (1) nhu cầu <strong>duy trì</strong> của nhóm đã được đáp ứng chưa? (2) nhu cầu <strong>nhiệm vụ</strong> của nhóm đã được đáp ứng chưa?</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cặp nhu cầu này hay vào đề:</strong> nhu cầu nhiệm vụ = làm xong việc; nhu cầu duy trì = giữ cho nhóm còn đủ sức làm tiếp. Người lãnh đạo giao được sản phẩm mà phá nát đội thì mới đạt một trên hai.</p>`),

  slide(D, 13, 'Leader emergence — formal and informal leaders',
    `<p class="y-chinh">🎯 Organisations have two kinds of leaders.</p>
     <ul>
       <li><span class="nhan">Formal leader</span> — the individual recognised by those <em>outside</em> the group as the official leader of the group.</li>
       <li><span class="nhan">Informal leader</span> — not assigned by the organisation; the individual whom <em>members of the group</em> acknowledge as their leader.</li>
     </ul>
     <p class="meo">💡 The two can be different people, and in student projects they often are. Knowing which you are changes what you should do.</p>`,
    `<p class="y-chinh">🎯 Tổ chức nào cũng có hai loại người lãnh đạo.</p>
     <ul>
       <li><span class="nhan">Người lãnh đạo chính thức</span> — người được những ai <em>bên ngoài</em> nhóm công nhận là thủ lĩnh chính thức.</li>
       <li><span class="nhan">Người lãnh đạo phi chính thức</span> — không do tổ chức chỉ định; là người mà <em>chính các thành viên</em> thừa nhận là thủ lĩnh của mình.</li>
     </ul>
     <p class="meo">💡 Hai người này có thể là hai người khác nhau, và trong dự án sinh viên thì thường là thế. Biết mình đang là loại nào sẽ đổi cách bạn nên hành xử.</p>`),

  slide(D, 14, 'Paths to leadership — designated and emergent',
    `<p class="y-chinh">🎯 People reach leadership through two dynamics.</p>
     <ul>
       <li><span class="nhan">Designated leaders</span> — put into the position by forces outside the group (here designated and formal leader are the same person).</li>
       <li><span class="nhan">Emergent leaders</span> — arise from the dynamics and processes that unfold within a group as it tries to achieve a collective goal.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Người ta tới vị trí lãnh đạo theo hai động lực.</p>
     <ul>
       <li><span class="nhan">Người lãnh đạo được chỉ định</span> — do lực lượng bên ngoài nhóm đặt vào vị trí (ở đây người được chỉ định và người lãnh đạo chính thức là một).</li>
       <li><span class="nhan">Người lãnh đạo nổi lên</span> — hình thành từ chính những chuyển động và quá trình diễn ra bên trong nhóm khi nhóm cố đạt mục tiêu chung.</li>
     </ul>`),

  slide(D, 15, 'Designated vs emergent — strengths and warnings',
    `<p class="y-chinh">🎯 The two paths compared directly.</p>
     <p><span class="nhan">Designated (formal) leaders</span></p>
     <ul>
       <li>Selected by group members or an outside authority.</li>
       <li><strong>Being designated is no guarantee of leadership ability</strong> unless the leader's skills match the group's needs.</li>
     </ul>
     <p><span class="nhan">Emergent (informal) leaders</span></p>
     <ul>
       <li>Gradually achieve leadership by helping the group achieve its goals.</li>
       <li>Emerging from within has the advantage of relying on <strong>expert or referent power</strong>.</li>
     </ul>
     <p class="meo">💡 Practical reading for your project: if you were appointed, your first job is to earn the two bases the emergent leader already has.</p>`,
    `<p class="y-chinh">🎯 Hai con đường đặt cạnh nhau.</p>
     <p><span class="nhan">Người lãnh đạo được chỉ định (chính thức)</span></p>
     <ul>
       <li>Do thành viên nhóm hoặc một thẩm quyền bên ngoài chọn.</li>
       <li><strong>Được chỉ định không bảo đảm có năng lực lãnh đạo</strong>, trừ khi kỹ năng của người đó khớp với nhu cầu của nhóm.</li>
     </ul>
     <p><span class="nhan">Người lãnh đạo nổi lên (phi chính thức)</span></p>
     <ul>
       <li>Dần dần có vị thế lãnh đạo nhờ giúp nhóm đạt mục tiêu.</li>
       <li>Nổi lên từ bên trong có lợi thế là dựa vào <strong>quyền lực chuyên môn hoặc nể phục</strong>.</li>
     </ul>
     <p class="meo">💡 Cách đọc thực dụng cho dự án của bạn: nếu bạn được chỉ định, việc đầu tiên là kiếm cho được hai nền tảng quyền lực mà người lãnh đạo nổi lên đã có sẵn.</p>`),

  slide(D, 16, 'Leadership as an exercise of influence',
    `<p class="y-chinh">🎯 How the two lessons of this session connect.</p>
     <ul>
       <li>Leadership is the exercise of influence over those who depend on one another for a mutual goal.</li>
       <li><span class="nhan">Social influence</span> = the ability to effect a change in the <strong>motivation, attitudes and/or behaviours</strong> of others.</li>
       <li><strong>Power answers the "how" question</strong>: how do leaders influence their followers? A leader's social influence is the source of their power.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Chỗ nối hai bài của buổi này.</p>
     <ul>
       <li>Lãnh đạo là việc thực thi ảnh hưởng lên những người phụ thuộc lẫn nhau vì một mục tiêu chung.</li>
       <li><span class="nhan">Ảnh hưởng xã hội</span> = khả năng tạo ra thay đổi trong <strong>động lực, thái độ và/hoặc hành vi</strong> của người khác.</li>
       <li><strong>Quyền lực trả lời câu hỏi "bằng cách nào"</strong>: người lãnh đạo tác động tới người theo bằng cách nào? Ảnh hưởng xã hội của họ chính là nguồn quyền lực.</li>
     </ul>`),

  slide(D, 17, 'The leader–follower power relationship',
    `<p class="y-chinh">🎯 A three-column model: leader → follower compliance → group effectiveness.</p>
     <ul>
       <li><span class="nhan">Leader</span> — influence or power tactic (e.g. use of rationality).</li>
       <li><span class="nhan">Follower compliance</span>, in rising order: alienation and resistance → calculative compliance → identification → <strong>internalisation / commitment</strong>.</li>
       <li><span class="nhan">Group effectiveness</span> — follower satisfaction, motivation, performance.</li>
     </ul>
     <p><strong>Effective leadership is more likely when the leader's influence flows out of rationality, expertise, moralistic appeal and/or referent power.</strong></p>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ thang tuân thủ:</strong> calculative compliance ("I do it because I am counted") gets the task done and nothing more. Internalisation is when the follower holds the goal themselves — the only level that survives the leader leaving the room.</p>`,
    `<p class="y-chinh">🎯 Mô hình ba cột: người lãnh đạo → mức tuân thủ của người theo → hiệu quả của nhóm.</p>
     <ul>
       <li><span class="nhan">Người lãnh đạo</span> — chiến thuật ảnh hưởng hoặc quyền lực (ví dụ dùng lý lẽ).</li>
       <li><span class="nhan">Mức tuân thủ</span>, theo thang tăng dần: xa lánh và kháng cự → tuân thủ tính toán → đồng nhất → <strong>nội hoá / cam kết</strong>.</li>
       <li><span class="nhan">Hiệu quả nhóm</span> — sự hài lòng, động lực và hiệu suất của thành viên.</li>
     </ul>
     <p><strong>Lãnh đạo hiệu quả dễ xảy ra hơn khi ảnh hưởng của người dẫn dắt đến từ lý lẽ, chuyên môn, sức thuyết phục đạo lý và/hoặc quyền lực nể phục.</strong></p>
     <p class="pitfall co-tieu-de"><strong>Đọc kỹ thang tuân thủ:</strong> tuân thủ tính toán ("tôi làm vì có người đếm") thì xong việc, hết. Nội hoá là khi người theo tự mang lấy mục tiêu — mức duy nhất còn sống sót khi người lãnh đạo rời khỏi phòng.</p>`),

  slide(D, 18, 'Discussion — leadership needs in the 21st century',
    `<p class="y-chinh">🎯 Class discussion: how do different approaches and styles of leadership affect what is needed now?</p>
     <p class="meo">💡 Answer with the five components from slide 10: what changed is mostly the <em>context</em> — distributed teams, faster information, followers with more outside options — which changes which style fits.</p>`,
    `<p class="y-chinh">🎯 Thảo luận trên lớp: các cách tiếp cận và phong cách lãnh đạo khác nhau ảnh hưởng thế nào tới thứ đang cần hiện nay?</p>
     <p class="meo">💡 Hãy trả lời bằng năm thành phần ở slide 10: cái thay đổi chủ yếu là <em>bối cảnh</em> — đội ngũ phân tán, thông tin nhanh hơn, người theo có nhiều lựa chọn bên ngoài hơn — và điều đó làm đổi phong cách nào là phù hợp.</p>`),

  slide(D, 19, 'Homework — five leadership perspectives',
    `<p class="y-chinh">🎯 Read and write a reflective essay on <em>one</em> of these five topics.</p>
     <ol>
       <li><span class="nhan">The trait approach</span> — what are the trait perspectives on leadership?</li>
       <li><span class="nhan">Behavioural approaches</span> — what are the behavioural perspectives?</li>
       <li><span class="nhan">Situational (contingency) approaches</span> — what are the situational perspectives?</li>
       <li><span class="nhan">Substitutes for and neutralizers of leadership</span> — what does "substitute for leadership" mean?</li>
       <li><span class="nhan">Transformational, visionary and charismatic leadership</span> — characteristics of transactional, transformational and charismatic leadership.</li>
     </ol>
     <p class="meo">💡 Topic 4 is the one most students skip and the one most worth reading: a well-designed process, clear standards and an experienced team can <em>substitute</em> for leadership — which explains why some groups work fine with no leader at all.</p>`,
    `<p class="y-chinh">🎯 Đọc và viết một bài luận suy ngẫm về <em>một</em> trong năm chủ đề sau.</p>
     <ol>
       <li><span class="nhan">Tiếp cận theo phẩm chất</span> — các góc nhìn trait về lãnh đạo là gì?</li>
       <li><span class="nhan">Tiếp cận theo hành vi</span> — các góc nhìn hành vi là gì?</li>
       <li><span class="nhan">Tiếp cận theo tình huống (contingency)</span> — các góc nhìn tình huống là gì?</li>
       <li><span class="nhan">Thứ thay thế và thứ vô hiệu hoá lãnh đạo</span> — "substitute for leadership" nghĩa là gì?</li>
       <li><span class="nhan">Lãnh đạo chuyển hoá, tầm nhìn và sức hút</span> — đặc điểm của lãnh đạo giao dịch, chuyển hoá và sức hút.</li>
     </ol>
     <p class="meo">💡 Chủ đề 4 là cái nhiều sinh viên bỏ qua nhất và cũng đáng đọc nhất: một quy trình thiết kế tốt, chuẩn mực rõ ràng và một đội giàu kinh nghiệm có thể <em>thay thế</em> cho lãnh đạo — điều đó giải thích vì sao có nhóm chẳng cần thủ lĩnh nào vẫn chạy tốt.</p>`),

  slide(D, 20, '3. Working in Diverse Teams',
    `<p class="y-chinh">🎯 Second lesson of the deck begins here.</p>`,
    `<p class="y-chinh">🎯 Bài thứ hai của bộ slide bắt đầu từ đây.</p>`),

  slide(D, 21, 'Learning objectives — diversity and conflict',
    `<p class="y-chinh">🎯 Six objectives, and the last four belong to Lesson 12 on conflict.</p>
     <ol>
       <li>Describe how diversity can enhance decision-making and problem-solving.</li>
       <li>Identify challenges and best practices for working with multicultural teams.</li>
       <li>Define conflict.</li>
       <li>Differentiate between functional and dysfunctional conflict.</li>
       <li>Recognise various types of conflict in groups; describe the conflict process.</li>
       <li>Identify and apply strategies for preventing or reducing conflict.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Sáu mục tiêu, và bốn cái cuối thuộc về Bài 12 nói về xung đột.</p>
     <ol>
       <li>Mô tả sự đa dạng giúp ra quyết định và giải quyết vấn đề ra sao.</li>
       <li>Chỉ ra thách thức và thực hành tốt khi làm việc trong đội đa văn hoá.</li>
       <li>Định nghĩa xung đột.</li>
       <li>Phân biệt xung đột chức năng và xung đột phi chức năng.</li>
       <li>Nhận diện các loại xung đột trong nhóm; mô tả quá trình xung đột.</li>
       <li>Xác định và áp dụng chiến lược ngăn ngừa hoặc giảm xung đột.</li>
     </ol>`),

  slide(D, 22, 'Does team diversity enhance decision-making?',
    `<p class="y-chinh">🎯 The claim, stated plainly: teams made up of <strong>diverse members tend to perform better</strong> than teams of similar backgrounds.</p>
     <p class="meo">💡 Why, mechanically: diverse teams are less likely to fall into the common knowledge effect from Lesson 3 slide 16, because fewer facts are already shared by everyone.</p>`,
    `<p class="y-chinh">🎯 Khẳng định, nói thẳng: đội gồm <strong>thành viên đa dạng thường làm tốt hơn</strong> đội có nền tảng giống nhau.</p>
     <p class="meo">💡 Vì sao, xét theo cơ chế: đội đa dạng ít rơi vào hiệu ứng tri thức chung ở slide 16 Bài 3 hơn, vì có ít dữ kiện được tất cả cùng biết sẵn.</p>`),

  slide(D, 23, 'High context vs low context communication',
    `<p class="y-chinh">🎯 A continuum, not two boxes.</p>
     <ul>
       <li><span class="nhan">Low-context communication</span> — more direct and explicit.</li>
       <li><span class="nhan">High-context communication</span> — more indirect; people <em>ask questions</em> rather than pointing out problems.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy thực tế:</strong> in a mixed team, "Do we have enough time for this?" can be a genuine question or a polite way of saying "this will not work". Missing that is the single most common cross-cultural failure in a student project.</p>`,
    `<p class="y-chinh">🎯 Một dải liên tục, không phải hai cái hộp.</p>
     <ul>
       <li><span class="nhan">Giao tiếp ngữ cảnh thấp</span> — trực tiếp và tường minh hơn.</li>
       <li><span class="nhan">Giao tiếp ngữ cảnh cao</span> — gián tiếp hơn; người ta <em>đặt câu hỏi</em> thay vì chỉ thẳng ra vấn đề.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy ngoài đời:</strong> trong một đội pha trộn, câu "mình có đủ thời gian cho việc này không?" có thể là câu hỏi thật, cũng có thể là cách nói lịch sự của "cái này không xong được đâu". Không bắt được điều đó là kiểu hỏng liên văn hoá phổ biến nhất trong dự án sinh viên.</p>`),

  slide(D, 24, 'Developing cultural intelligence',
    `<p class="y-chinh">🎯 <strong>Cultural intelligence</strong> is a competency and a skill that enables individuals to function effectively in cross-cultural environments.</p>
     <p>It develops as people become more aware of the influence of culture and more capable of <strong>adapting their behaviour</strong> to the norms of other cultures.</p>
     <p class="meo">💡 Note it is called a skill — like creativity in Lesson 5–6, that word means it is trainable, and the next two slides say how.</p>`,
    `<p class="y-chinh">🎯 <strong>Trí thông minh văn hoá</strong> là năng lực và kỹ năng giúp một người vận hành hiệu quả trong môi trường đa văn hoá.</p>
     <p>Nó phát triển khi người ta ý thức hơn về ảnh hưởng của văn hoá và có khả năng <strong>điều chỉnh hành vi</strong> theo chuẩn mực của nền văn hoá khác.</p>
     <p class="meo">💡 Để ý nó được gọi là kỹ năng — giống chữ "kỹ năng" ở Bài 5–6, chữ đó nghĩa là rèn được, và hai slide sau nói rèn bằng cách nào.</p>`),

  slide(D, 25, 'Best practices for honing cross-cultural skills',
    `<p class="y-chinh">🎯 Two recommendations.</p>
     <ul>
       <li><span class="nhan">"Broaden your mind"</span> — expand your own cultural channels (travel, films, books) and surround yourself with people from other cultures.</li>
       <li><span class="nhan">"Develop your cross-cultural skills through practice"</span> — and through experiential learning.</li>
     </ul>
     <p class="meo">💡 Both are about exposure before theory. You cannot read your way to cultural intelligence any more than you can read your way to swimming.</p>`,
    `<p class="y-chinh">🎯 Hai khuyến nghị.</p>
     <ul>
       <li><span class="nhan">"Mở rộng đầu óc"</span> — mở rộng kênh văn hoá của chính bạn (đi đây đó, phim, sách) và sống giữa những người thuộc nền văn hoá khác.</li>
       <li><span class="nhan">"Rèn kỹ năng liên văn hoá qua thực hành"</span> — và qua học bằng trải nghiệm.</li>
     </ul>
     <p class="meo">💡 Cả hai đều đặt việc tiếp xúc trước lý thuyết. Bạn không thể đọc sách mà có được trí thông minh văn hoá, cũng như không thể đọc sách mà biết bơi.</p>`),

  slide(D, 26, 'Three sources of cultural intelligence — head, body, heart',
    `<p class="y-chinh">🎯 Mosakowski (2004) names three components.</p>
     <ul>
       <li><span class="nhan">HEAD</span> — you first learn the beliefs, customs and taboos of a foreign culture. The <em>cognitive</em> component.</li>
       <li><span class="nhan">BODY</span> — commitment and experimentation with the new culture: demeanour, eye contact, posture, accent. A deeper level of understanding, shown physically.</li>
       <li><span class="nhan">HEART</span> — your own <em>confidence</em> in your ability to adapt and deal well with other cultures; emotional commitment and motivation.</li>
     </ul>
     <p class="meo">💡 Most people stop at head. Head alone produces a person who knows the facts about a culture and still cannot work inside it.</p>`,
    `<p class="y-chinh">🎯 Mosakowski (2004) gọi tên ba thành phần.</p>
     <ul>
       <li><span class="nhan">ĐẦU</span> — trước hết học niềm tin, phong tục và điều cấm kỵ của nền văn hoá khác. Thành phần <em>nhận thức</em>.</li>
       <li><span class="nhan">THÂN</span> — sự dấn thân và thử nghiệm với văn hoá mới: cách cư xử, ánh mắt, dáng đứng, giọng nói. Mức hiểu sâu hơn, biểu hiện ra bằng cơ thể.</li>
       <li><span class="nhan">TIM</span> — sự <em>tự tin</em> của chính bạn vào khả năng thích nghi và xoay xở tốt với văn hoá khác; là cam kết cảm xúc và động lực.</li>
     </ul>
     <p class="meo">💡 Phần lớn người ta dừng ở phần đầu. Chỉ có "đầu" sẽ tạo ra một người thuộc làu dữ kiện về một nền văn hoá mà vẫn không làm việc được bên trong nó.</p>`),

  slide(D, 27, 'Divergent cultural dimensions — the six',
    `<p class="y-chinh">🎯 Six dimensions, each with its own slide and a four-country chart.</p>
     <ol>
       <li>Power distance</li>
       <li>Individualism</li>
       <li>Masculinity</li>
       <li>Uncertainty avoidance</li>
       <li>Long-term orientation</li>
       <li>Time orientation</li>
     </ol>
     <p class="meo">💡 This is CQ9.1 in the syllabus. Learn the six names first; the country numbers are illustrations, not the point.</p>`,
    `<p class="y-chinh">🎯 Sáu chiều, mỗi chiều một slide kèm biểu đồ bốn quốc gia.</p>
     <ol>
       <li>Khoảng cách quyền lực</li>
       <li>Chủ nghĩa cá nhân</li>
       <li>Tính nam</li>
       <li>Né tránh bất định</li>
       <li>Định hướng dài hạn</li>
       <li>Định hướng thời gian</li>
     </ol>
     <p class="meo">💡 Đây chính là CQ9.1 trong syllabus. Hãy thuộc sáu cái tên trước; các con số theo quốc gia chỉ là minh hoạ, không phải trọng tâm.</p>`),

  slide(D, 28, 'Power distance',
    `<p class="y-chinh">🎯 How far a culture accepts unequal distribution of power (Hofstede).</p>
     <ul>
       <li><span class="nhan">Low power distance</span> — people relate more as equals and less as dominant/subordinate roles, regardless of their actual formal roles.</li>
       <li><span class="nhan">High power distance</span> — people are less likely to challenge a decision, propose an alternative or give input. Less powerful people accept decisions without comment <em>even when they know there is a significant problem</em>.</li>
     </ul>
     <p>Chart: Brazil 69 · China 80 · Germany 35 · United States 40.</p>
     <p class="pitfall co-tieu-de"><strong>Hệ quả cho nhóm:</strong> silence is not agreement. In a high-power-distance setting the leader must ask for objections explicitly, and in private, or the problem simply does not surface.</p>`,
    `<p class="y-chinh">🎯 Mức một nền văn hoá chấp nhận sự phân bố quyền lực không đồng đều (Hofstede).</p>
     <ul>
       <li><span class="nhan">Khoảng cách quyền lực thấp</span> — người ta đối đãi nhau như những người ngang hàng nhiều hơn, ít theo vai trên–dưới, bất kể vai trò chính thức thực tế là gì.</li>
       <li><span class="nhan">Khoảng cách quyền lực cao</span> — người ta ít chất vấn quyết định, ít đề xuất phương án khác, ít góp ý. Người ít quyền lực chấp nhận quyết định mà không nói gì, <em>ngay cả khi họ biết có vấn đề nghiêm trọng</em>.</li>
     </ul>
     <p>Biểu đồ: Brazil 69 · Trung Quốc 80 · Đức 35 · Mỹ 40.</p>
     <p class="pitfall co-tieu-de"><strong>Hệ quả cho nhóm:</strong> im lặng không phải là đồng ý. Trong môi trường khoảng cách quyền lực cao, người dẫn dắt phải hỏi thẳng xem có ai phản đối không, và hỏi riêng, nếu không thì vấn đề đơn giản là không nổi lên.</p>`),

  slide(D, 29, 'Individualism',
    `<p class="y-chinh">🎯 Individual freedom versus the needs of the group.</p>
     <ul>
       <li><span class="nhan">Individualistic cultures</span> value personal independence. People perceive the world primarily from their own viewpoint, see themselves as empowered individuals capable of making their own decisions and affecting their own lives.</li>
       <li><span class="nhan">Collectivist cultures</span> — many in Asia and South America — focus on the needs of the nation, community, family or group of workers.</li>
     </ul>
     <p>Chart: Brazil 38 · China 20 · Germany 67 · United States 91 (Hofstede, 1982).</p>
     <p class="meo">💡 Connects to Lesson 3 slide 8: the self as "me" versus the self as "we" is this dimension seen from the inside.</p>`,
    `<p class="y-chinh">🎯 Tự do cá nhân so với nhu cầu của tập thể.</p>
     <ul>
       <li><span class="nhan">Văn hoá đề cao cá nhân</span> coi trọng sự độc lập cá nhân. Người ta nhìn thế giới chủ yếu từ góc nhìn của mình, tự thấy mình là cá nhân có quyền, tự ra quyết định được và tác động được lên đời mình.</li>
       <li><span class="nhan">Văn hoá tập thể</span> — nhiều nước ở châu Á và Nam Mỹ — hướng vào nhu cầu của quốc gia, cộng đồng, gia đình hoặc tập thể lao động.</li>
     </ul>
     <p>Biểu đồ: Brazil 38 · Trung Quốc 20 · Đức 67 · Mỹ 91 (Hofstede, 1982).</p>
     <p class="meo">💡 Nối với slide 8 Bài 3: cái tôi là "tôi" hay cái tôi là "chúng ta" chính là chiều này nhìn từ bên trong.</p>`),

  slide(D, 30, 'Masculinity',
    `<p class="y-chinh">🎯 The extent to which a culture values traits considered masculine or feminine (Hofstede, 2009).</p>
     <ul>
       <li>"The assertive pole has been called <em>masculine</em> and the modest, caring pole <em>feminine</em>."</li>
       <li>In feminine countries women hold the same modest, caring values as men.</li>
       <li>In masculine countries women are somewhat assertive and competitive but less so than men — so those countries show a <strong>gap between men's and women's values</strong>.</li>
     </ul>
     <p>Chart: Brazil 49 · China 66 · Germany 66 · United States 62.</p>
     <p class="meo">💡 The measurable definition is that gap, not a stereotype about behaviour.</p>`,
    `<p class="y-chinh">🎯 Mức một nền văn hoá coi trọng những phẩm chất được xem là nam tính hay nữ tính (Hofstede, 2009).</p>
     <ul>
       <li>"Cực quyết đoán được gọi là <em>nam tính</em>, còn cực khiêm nhường, quan tâm chăm sóc được gọi là <em>nữ tính</em>."</li>
       <li>Ở các nước "nữ tính", phụ nữ mang cùng những giá trị khiêm nhường, chăm sóc như nam giới.</li>
       <li>Ở các nước "nam tính", phụ nữ cũng có phần quyết đoán và cạnh tranh nhưng ít hơn nam giới — nên các nước đó lộ ra <strong>khoảng cách giữa giá trị của nam và của nữ</strong>.</li>
     </ul>
     <p>Biểu đồ: Brazil 49 · Trung Quốc 66 · Đức 66 · Mỹ 62.</p>
     <p class="meo">💡 Định nghĩa đo được nằm ở cái khoảng cách ấy, không nằm ở định kiến về hành vi.</p>`),

  slide(D, 31, 'Uncertainty avoidance',
    `<p class="y-chinh">🎯 How far a culture tolerates surprise.</p>
     <ul>
       <li>The United States and Britain are highly tolerant of uncertainty.</li>
       <li>Cultures in the Arab world are high in uncertainty avoidance: resistant to change and reluctant to take risks.</li>
       <li><span class="nhan">The slide's example</span> — a US negotiator might enthusiastically agree to try a new procedure, while the Egyptian counterpart would refuse to get involved until all the details are worked out.</li>
     </ul>
     <p>Chart: Brazil 76 · China 30 · Germany 65 · United States 46.</p>
     <p class="meo">💡 Neither is caution nor recklessness — each is rational under a different assumption about what an unplanned detail costs.</p>`,
    `<p class="y-chinh">🎯 Mức một nền văn hoá chịu được sự bất ngờ tới đâu.</p>
     <ul>
       <li>Mỹ và Anh chịu đựng sự bất định rất tốt.</li>
       <li>Các nền văn hoá thuộc thế giới Ả Rập có mức né tránh bất định cao: ngại thay đổi và dè dặt với rủi ro.</li>
       <li><span class="nhan">Ví dụ trên slide</span> — một nhà đàm phán Mỹ có thể hào hứng đồng ý thử quy trình mới, trong khi đối tác Ai Cập sẽ không tham gia cho tới khi mọi chi tiết được chốt xong.</li>
     </ul>
     <p>Biểu đồ: Brazil 76 · Trung Quốc 30 · Đức 65 · Mỹ 46.</p>
     <p class="meo">💡 Không bên nào là thận trọng hay liều lĩnh — mỗi bên đều hợp lý dưới một giả định khác nhau về cái giá của một chi tiết chưa được tính trước.</p>`),

  slide(D, 32, 'Long-term orientation',
    `<p class="y-chinh">🎯 What a culture emphasises across time.</p>
     <ul>
       <li><span class="nhan">Short-term oriented</span> — greater emphasis on reciprocating greetings, gifts and rewards; respect for tradition alongside personal representation and honour; personal stability and consistency, producing predictability and familiarity.</li>
       <li><span class="nhan">Long-term oriented</span> — persistence, thrift and frugality; relationships ordered by age and status; a sense of shame for family and community observed across generations, where what an individual does reflects on the family.</li>
     </ul>
     <p>Chart: Brazil 44 · China 87 · Germany 83 · United States 26.</p>`,
    `<p class="y-chinh">🎯 Nền văn hoá đặt trọng tâm vào đâu khi nhìn theo thời gian.</p>
     <ul>
       <li><span class="nhan">Định hướng ngắn hạn</span> — coi trọng việc đáp lễ trong chào hỏi, quà cáp, tưởng thưởng; vừa tôn trọng truyền thống vừa đề cao thể diện và danh dự cá nhân; coi trọng sự ổn định và nhất quán của cá nhân, tạo ra cảm giác dễ đoán, quen thuộc.</li>
       <li><span class="nhan">Định hướng dài hạn</span> — bền bỉ, tiết kiệm, cần kiệm; quan hệ sắp theo tuổi tác và địa vị; ý thức về cái nhục của gia đình và cộng đồng truyền qua nhiều thế hệ, nơi việc một cá nhân làm sẽ phản chiếu lên cả gia đình.</li>
     </ul>
     <p>Biểu đồ: Brazil 44 · Trung Quốc 87 · Đức 83 · Mỹ 26.</p>`),

  slide(D, 33, 'Time orientation — monochronic and polychronic',
    `<p class="y-chinh">🎯 Hall & Hall (1987).</p>
     <ul>
       <li><span class="nhan">Monochronic</span> — one thing at a time; interruptions are avoided; everything has its own specific time. The US, Germany and Switzerland are often cited.</li>
       <li><span class="nhan">Polychronic</span> — many things scheduled at once and time treated more fluidly; business and family mix with dinner and dancing. Greece, Italy, Chile and Saudi Arabia are cited — a meeting may be scheduled at a fixed time, but when it actually begins is another story.</li>
     </ul>
     <p>Chart: Brazil 59 · China 24 · Germany 40 · United States 68.</p>
     <p class="pitfall co-tieu-de"><strong>Trong nhóm sinh viên:</strong> "we start at 7" means two different things to two members, and both believe they are being reasonable. Agree explicitly instead of assuming.</p>`,
    `<p class="y-chinh">🎯 Hall & Hall (1987).</p>
     <ul>
       <li><span class="nhan">Đơn tuyến (monochronic)</span> — làm từng việc một; tránh bị ngắt quãng; mọi thứ có giờ riêng của nó. Mỹ, Đức và Thuỵ Sĩ hay được nêu.</li>
       <li><span class="nhan">Đa tuyến (polychronic)</span> — xếp nhiều việc cùng lúc và coi thời gian uyển chuyển hơn; công việc và gia đình trộn lẫn với bữa tối và tiệc tùng. Hy Lạp, Ý, Chile và Ả Rập Xê Út được nêu — cuộc họp có thể ấn định giờ cố định, nhưng thực sự bắt đầu lúc nào lại là chuyện khác.</li>
     </ul>
     <p>Biểu đồ: Brazil 59 · Trung Quốc 24 · Đức 40 · Mỹ 68.</p>
     <p class="pitfall co-tieu-de"><strong>Trong nhóm sinh viên:</strong> "7 giờ mình bắt đầu" mang hai nghĩa khác nhau với hai thành viên, mà cả hai đều tin mình đang hợp lý. Hãy thống nhất rõ ràng thay vì mặc định.</p>`),

  slide(D, 34, 'Homework — reading the five dimension pairs',
    `<p class="y-chinh">🎯 Reading assignment, listed as pairs.</p>
     <ul>
       <li>Low-power versus high-power distance</li>
       <li>Masculine versus feminine orientation</li>
       <li>Uncertainty-accepting versus uncertainty-rejecting cultures</li>
       <li>Short-term versus long-term orientation</li>
       <li>Time orientation</li>
     </ul>
     <p class="meo">💡 Reading them as pairs is the right way: each dimension is a spectrum with two named ends, and the exam usually asks you to place a behaviour on one.</p>`,
    `<p class="y-chinh">🎯 Bài đọc ở nhà, liệt kê theo từng cặp.</p>
     <ul>
       <li>Khoảng cách quyền lực thấp so với cao</li>
       <li>Định hướng nam tính so với nữ tính</li>
       <li>Văn hoá chấp nhận bất định so với văn hoá né tránh bất định</li>
       <li>Định hướng ngắn hạn so với dài hạn</li>
       <li>Định hướng thời gian</li>
     </ul>
     <p class="meo">💡 Đọc theo cặp là cách đúng: mỗi chiều là một dải có hai đầu được gọi tên, và đề thi thường yêu cầu bạn đặt một hành vi vào đúng chỗ trên dải đó.</p>`),

  slide(D, 35, 'Review & reflection questions',
    `<p class="y-chinh">🎯 Four questions, with where each answer lives.</p>
     <ul>
       <li><span class="nhan">Why are diverse teams better at decision-making?</span> Slide 22, plus the common knowledge effect from Lesson 3.</li>
       <li><span class="nhan">What challenges do multicultural teams face?</span> Slide 23 (high/low context) and slides 28–33 (the six dimensions).</li>
       <li><span class="nhan">How might you cultivate your own cultural intelligence?</span> Slides 25–26 — head, body, heart.</li>
       <li><span class="nhan">What are potential points of divergence between cultures?</span> The six dimensions, named.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Bốn câu hỏi, kèm chỗ chứa đáp án.</p>
     <ul>
       <li><span class="nhan">Vì sao đội đa dạng ra quyết định tốt hơn?</span> Slide 22, cộng hiệu ứng tri thức chung ở Bài 3.</li>
       <li><span class="nhan">Đội đa văn hoá gặp thách thức gì?</span> Slide 23 (ngữ cảnh cao/thấp) và slide 28–33 (sáu chiều văn hoá).</li>
       <li><span class="nhan">Làm sao nuôi trí thông minh văn hoá của chính mình?</span> Slide 25–26 — đầu, thân, tim.</li>
       <li><span class="nhan">Các điểm khác biệt tiềm tàng giữa các nền văn hoá?</span> Chính sáu chiều, gọi đúng tên.</li>
     </ul>`),

  slide(D, 36, 'End of Lessons 10–11',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Three differences between a leader and a manager (how they arrive, where power comes from, what they are defined as)?</li>
       <li>Designated versus emergent leader — which relies on expert and referent power?</li>
       <li>The four levels of follower compliance, in order?</li>
       <li>The six cultural dimensions, by name?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Ba khác biệt giữa người lãnh đạo và người quản lý (tới vị trí bằng cách nào, quyền lực từ đâu, được định nghĩa là gì)?</li>
       <li>Lãnh đạo được chỉ định so với lãnh đạo nổi lên — bên nào dựa vào quyền lực chuyên môn và nể phục?</li>
       <li>Bốn mức tuân thủ của người theo, theo thứ tự?</li>
       <li>Sáu chiều văn hoá, gọi đúng tên?</li>
     </ol>`),

  books([
    ['wig', 'Chapter 6 — leadership in groups', 'Chương 6 — lãnh đạo trong nhóm'],
    ['bcs', 'chương Intercultural Communication — Hofstede dimensions', 'chương Giao tiếp liên văn hoá — các chiều Hofstede'],
  ]),

  bi(
    `<h3>✅ The gap this closes</h3>
     <p>The syllabus gives session 25 to "Working in diverse teams" and asks CQ9.1 about cultural dimensions. In the previous Academy course the strings "cultur" and "Hofstede" appeared zero times, and leadership was three styles in one box.</p>`,
    `<h3>✅ Lỗ hổng được lấp ở đây</h3>
     <p>Syllabus dành buổi 25 cho "Làm việc trong đội đa dạng" và hỏi CQ9.1 về các chiều văn hoá. Ở khoá Academy cũ, chuỗi "cultur" và "Hofstede" xuất hiện đúng 0 lần, còn lãnh đạo chỉ gói trong ba phong cách nằm trong một cái khung.</p>`),
].join('\n');
