/**
 * Buổi 1 · Bài 1 — Defining Teams and Groups (41 slide).
 *
 * Bám đúng bộ slide "Session 1_Group _ Team Overview_Lesson 1_Defining Teams
 * and Groups.pptx" của trường. Bốn ACTIVITY trên lớp được giữ nguyên vị trí
 * và có gợi ý trả lời, vì Activity chiếm 15% điểm môn này — bỏ qua chúng là
 * bỏ qua phần điểm sinh viên thật sự phải làm.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's1-l1';

export const b1l1 = [
  walkHead(D, 1, 41,
    'This first deck also carries the course rules and the grading table, so read slides 2–7 even if you think you know them: 15% of the final mark is decided in the first minutes of each class.',
    'Bộ slide đầu tiên này gánh luôn nội quy lớp và bảng điểm, nên đừng bỏ qua slide 2–7: 15% điểm cuối kỳ được quyết trong vài phút đầu mỗi buổi học.'),

  slide(D, 1, 'Communication and In-group Working Skills',
    `<p class="y-chinh">🎯 The subject has two halves, and the title says both: <strong>communication</strong> and <strong>working inside a group</strong>.</p>
     <ul>
       <li><span class="nhan">Half one</span> — how people exchange meaning: speaking, listening, writing, body language.</li>
       <li><span class="nhan">Half two</span> — what happens when several people must produce one result together.</li>
     </ul>
     <p class="meo">💡 Every assessment in this course tests the two halves at once. You never present alone, and you never write alone.</p>`,
    `<p class="y-chinh">🎯 Môn này có hai nửa, và cái tên đã nói cả hai: <strong>giao tiếp</strong> và <strong>làm việc trong nhóm</strong>.</p>
     <ul>
       <li><span class="nhan">Nửa thứ nhất</span> — cách con người trao đổi ý nghĩa: nói, nghe, viết, ngôn ngữ cơ thể.</li>
       <li><span class="nhan">Nửa thứ hai</span> — chuyện gì xảy ra khi nhiều người phải cùng làm ra một kết quả.</li>
     </ul>
     <p class="meo">💡 Mọi bài đánh giá của môn đều kiểm tra cả hai nửa cùng lúc. Bạn không bao giờ thuyết trình một mình, cũng không bao giờ viết một mình.</p>`),

  slide(D, 2, 'Working rules — be active, prepare, avoid distraction',
    `<p class="y-chinh">🎯 Four classroom rules, and they are the ones that feed the Participation mark (10%).</p>
     <ul>
       <li><span class="nhan">Be active</span> — speaking in class is the evidence of participation, not attendance alone.</li>
       <li><span class="nhan">Prepare yourself</span> — read the material before class; discussion-based sessions collapse when nobody has read.</li>
       <li><span class="nhan">Be on time</span> — attendance is checked 10 minutes after the start (slide 3).</li>
       <li><span class="nhan">Avoid distraction</span> — silent phone, no personal chat, no social media.</li>
     </ul>
     <p class="meo">💡 Read this slide as a grading rule, not as good manners.</p>`,
    `<p class="y-chinh">🎯 Bốn nội quy lớp học, và chúng chính là thứ nuôi cột điểm Participation (10%).</p>
     <ul>
       <li><span class="nhan">Chủ động</span> — phát biểu mới là bằng chứng tham gia, chỉ có mặt thì chưa đủ.</li>
       <li><span class="nhan">Chuẩn bị trước</span> — đọc tài liệu trước khi lên lớp; buổi học kiểu thảo luận sẽ chết nếu không ai đọc.</li>
       <li><span class="nhan">Đúng giờ</span> — điểm danh sau khi vào lớp 10 phút (slide 3).</li>
       <li><span class="nhan">Không phân tâm</span> — tắt chuông, không tán gẫu riêng, không mạng xã hội.</li>
     </ul>
     <p class="meo">💡 Hãy đọc slide này như một quy tắc chấm điểm, đừng đọc như lời khuyên lịch sự.</p>`),

  slide(D, 3, 'Class rules — attendance, deadlines, respect, attitude',
    `<p class="y-chinh">🎯 Five rules; two of them can cost you the subject outright.</p>
     <ol>
       <li>Attendance checked 10′ after class starts.</li>
       <li>Submit assignments on time.</li>
       <li>Respect — yourself and others.</li>
       <li>No personal activities during class.</li>
       <li>Right attitude.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> ≥80% attendance is a condition in the syllabus. Miss more than 20% of sessions and the mark you earned elsewhere no longer saves you.</p>`,
    `<p class="y-chinh">🎯 Năm quy tắc; hai trong số đó có thể khiến bạn trượt thẳng.</p>
     <ol>
       <li>Điểm danh sau khi bắt đầu 10 phút.</li>
       <li>Nộp bài đúng hạn.</li>
       <li>Tôn trọng — chính mình và người khác.</li>
       <li>Không làm việc riêng trong giờ.</li>
       <li>Thái độ đúng mực.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> Syllabus yêu cầu dự học ≥80%. Vắng quá 20% số buổi thì điểm kiếm được ở chỗ khác cũng không cứu được bạn.</p>`),

  slide(D, 4, 'Course syllabus',
    `<p class="y-chinh">🎯 Section divider: everything after this slide is the official syllabus, not the lecturer's preference.</p>
     <p>Two slides follow — the course description and the assessment table. They are the two things worth photographing.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục: mọi thứ sau slide này là syllabus chính thức, không phải ý riêng của giảng viên.</p>
     <p>Hai slide tiếp theo — mô tả môn học và bảng điểm. Đó là hai thứ đáng chụp lại nhất.</p>`),

  slide(D, 5, 'Syllabus — course description',
    `<p class="y-chinh">🎯 The description names both the theory and the practice side, and the exam follows that split.</p>
     <ul>
       <li><span class="nhan">"How groups work"</span> — classic and current theories of group communication and team work.</li>
       <li><span class="nhan">"How to work in groups"</span> — practical strategies and skills.</li>
     </ul>
     <p class="meo">💡 When a question asks "why", it is testing the first half; when it asks "what would you do", the second.</p>`,
    `<p class="y-chinh">🎯 Phần mô tả nêu cả mặt lý thuyết lẫn mặt thực hành, và đề thi cũng chia theo đúng thế.</p>
     <ul>
       <li><span class="nhan">"Nhóm vận hành ra sao"</span> — các lý thuyết kinh điển và hiện đại về giao tiếp nhóm, làm việc đội.</li>
       <li><span class="nhan">"Làm việc nhóm thế nào"</span> — chiến lược và kỹ năng thực hành.</li>
     </ul>
     <p class="meo">💡 Câu hỏi "vì sao" là đang kiểm nửa đầu; câu hỏi "bạn sẽ làm gì" là nửa sau.</p>`),

  slide(D, 6, 'Assessments (marks) — the six components',
    `<p class="y-chinh">🎯 Six components, and two conditions that override the total.</p>
     <ul>
       <li><span class="nhan">Group Project 30%</span> — the largest single block, run across weeks 1–10 in three parts.</li>
       <li><span class="nhan">Group Assignments 20%</span> — two of them, 10% each.</li>
       <li><span class="nhan">Activities 15%</span> — three, 5% each, done in class.</li>
       <li><span class="nhan">Final exam 20%</span> · <span class="nhan">Participation 10%</span> · <span class="nhan">Quiz 5%</span>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Conditions to pass:</strong> Final exam ≥ 4 <em>and</em> grade average ≥ 5/10. A 9 in the group project cannot rescue a 3 in the final.</p>
     <p class="meo">💡 65% of the mark (project + assignments + activities) is earned <em>with other people</em>. Choosing your group is an academic decision, not a social one.</p>`,
    `<p class="y-chinh">🎯 Sáu thành phần điểm, và hai điều kiện đứng trên tổng điểm.</p>
     <ul>
       <li><span class="nhan">Group Project 30%</span> — khối lớn nhất, chạy suốt tuần 1–10, chia ba phần.</li>
       <li><span class="nhan">Group Assignments 20%</span> — hai bài, mỗi bài 10%.</li>
       <li><span class="nhan">Activities 15%</span> — ba hoạt động, mỗi cái 5%, làm ngay trên lớp.</li>
       <li><span class="nhan">Thi cuối kỳ 20%</span> · <span class="nhan">Participation 10%</span> · <span class="nhan">Quiz 5%</span>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Điều kiện qua môn:</strong> thi cuối kỳ ≥ 4 <em>và</em> trung bình ≥ 5/10. Dự án nhóm 9 điểm cũng không cứu nổi bài thi 3 điểm.</p>
     <p class="meo">💡 65% điểm (dự án + assignment + activity) kiếm được <em>cùng người khác</em>. Chọn nhóm là quyết định học thuật, không phải chuyện chơi với ai.</p>`),

  slide(D, 7, 'Activity — forming groups (5–7 members)',
    `<p class="y-chinh">🎯 The group you form in the first class is the group you keep for the whole course.</p>
     <ul>
       <li><span class="nhan">Size</span> — 5 to 7 members. Slide 29 explains why that number and not 15.</li>
       <li><span class="nhan">Task now</span> — introduce yourselves and actually get to know each other.</li>
       <li><span class="nhan">Consequence</span> — this same group carries the 30% project and both 10% assignments.</li>
     </ul>
     <p class="meo">💡 Pick for reliability and different skills, not for friendship. Slide 24 lists "a broad range of competences" as a reason to build a team at all.</p>`,
    `<p class="y-chinh">🎯 Nhóm bạn lập trong buổi đầu chính là nhóm đi cùng bạn cả môn.</p>
     <ul>
       <li><span class="nhan">Quy mô</span> — 5 đến 7 người. Slide 29 giải thích vì sao là con số này chứ không phải 15.</li>
       <li><span class="nhan">Việc ngay lúc này</span> — giới thiệu và thật sự tìm hiểu nhau.</li>
       <li><span class="nhan">Hệ quả</span> — chính nhóm này gánh dự án 30% và cả hai assignment 10%.</li>
     </ul>
     <p class="meo">💡 Hãy chọn theo mức độ đáng tin cậy và sự khác nhau về kỹ năng, đừng chọn theo tình bạn. Slide 24 nói rõ "dải năng lực rộng" mới là lý do phải lập đội.</p>`),

  slide(D, 8, 'Session I — Group and Team Overview',
    `<p class="y-chinh">🎯 Divider for Session I. Four lessons sit under it: defining teams and groups, cooperation, the psychology of groups, social comparison.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục Buổi I. Bốn bài nằm dưới nó: định nghĩa nhóm/đội, hợp tác, tâm lý học nhóm, so sánh xã hội.</p>`),

  slide(D, 9, 'Learning objectives (5)',
    `<p class="y-chinh">🎯 Five objectives — they map one-to-one onto the four lessons of Session I.</p>
     <ol>
       <li>Define teams and groups.</li>
       <li>Define "cooperation".</li>
       <li>Distinguish between different social value orientations.</li>
       <li>Name the influences on cooperation.</li>
       <li>Explain the methods psychologists use to research cooperation.</li>
     </ol>
     <p class="meo">💡 Objectives 2–5 belong to Lesson 2 and Lesson 3; this deck only completes objective 1.</p>`,
    `<p class="y-chinh">🎯 Năm mục tiêu — chúng ứng một-một với bốn bài của Buổi I.</p>
     <ol>
       <li>Định nghĩa đội và nhóm.</li>
       <li>Định nghĩa "hợp tác".</li>
       <li>Phân biệt các định hướng giá trị xã hội.</li>
       <li>Nêu các yếu tố ảnh hưởng tới hợp tác.</li>
       <li>Giải thích cách nhà tâm lý học nghiên cứu hợp tác.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 2–5 thuộc Bài 2 và Bài 3; bộ slide này chỉ hoàn thành mục tiêu 1.</p>`),

  slide(D, 10, '1. Defining teams and groups',
    `<p class="y-chinh">🎯 Sub-divider. From here to slide 29 the deck builds one distinction: every team is a group, but not every group is a team.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục nhỏ. Từ đây tới slide 29, bộ slide xây đúng một ranh giới: mọi đội đều là nhóm, nhưng không phải nhóm nào cũng là đội.</p>`),

  slide(D, 11, 'What is a group?',
    `<p class="y-chinh">🎯 Open question thrown to the class before any definition is given.</p>
     <p><span class="nhan">Working answer</span> — a group is any set of people who are aware of one another and interact, however loosely.</p>
     <p class="meo">💡 Note what is <em>not</em> required yet: a shared goal, interdependence, or a joint product. Those arrive with the word "team".</p>`,
    `<p class="y-chinh">🎯 Câu hỏi mở ném cho lớp trước khi đưa ra bất kỳ định nghĩa nào.</p>
     <p><span class="nhan">Câu trả lời tạm</span> — nhóm là tập hợp những người biết đến nhau và có tương tác, dù lỏng lẻo tới đâu.</p>
     <p class="meo">💡 Để ý cái <em>chưa</em> bị đòi hỏi: mục tiêu chung, sự phụ thuộc lẫn nhau, hay một sản phẩm chung. Những thứ đó chỉ xuất hiện cùng chữ "đội".</p>`),

  slide(D, 12, 'Formal groups are used to… (7 uses)',
    `<p class="y-chinh">🎯 A formal group is one the organisation creates on purpose, and it exists to do seven things.</p>
     <ol class="hai-cot">
       <li>Organise and distribute work</li>
       <li>Pool information</li>
       <li>Devise plans</li>
       <li>Coordinate activities</li>
       <li>Increase commitment</li>
       <li>Negotiate</li>
       <li>Resolve conflicts and conduct inquests</li>
     </ol>
     <p class="meo">💡 "Conduct inquests" = formally examining what went wrong after a failure — a post-mortem.</p>`,
    `<p class="y-chinh">🎯 Nhóm chính thức là nhóm do tổ chức cố ý lập ra, và nó tồn tại để làm bảy việc.</p>
     <ol class="hai-cot">
       <li>Tổ chức và phân chia công việc</li>
       <li>Gom góp thông tin</li>
       <li>Lập kế hoạch</li>
       <li>Điều phối hoạt động</li>
       <li>Tăng cam kết</li>
       <li>Thương lượng</li>
       <li>Giải quyết xung đột và điều tra sự việc</li>
     </ol>
     <p class="meo">💡 "Conduct inquests" = xem xét chính thức xem đã sai ở đâu sau một thất bại — họp mổ xẻ.</p>`),

  slide(D, 13, 'Formal vs informal groups',
    `<p class="y-chinh">🎯 The same slide now puts the two kinds side by side — that contrast is exam material.</p>
     <p><span class="nhan">Formal</span> — created by the organisation, for the seven work purposes of slide 12.</p>
     <p><span class="nhan">Informal</span> — created by the people themselves, to:</p>
     <ul>
       <li>satisfy the need of affiliation (belonging);</li>
       <li>act as a forum for exploring self-concept and gaining support;</li>
       <li>and — the part people underestimate — <strong>affect formal work tasks</strong>.</li>
     </ul>
     <p class="meo">💡 The slide's own example of that effect: subtle pressure on members to conform to a particular work rate, and being the place where news and gossip travel.</p>`,
    `<p class="y-chinh">🎯 Cũng slide đó giờ đặt hai loại cạnh nhau — chỗ đối chiếu này hay ra đề.</p>
     <p><span class="nhan">Chính thức</span> — do tổ chức lập, phục vụ bảy mục đích công việc ở slide 12.</p>
     <p><span class="nhan">Phi chính thức</span> — do chính con người tự lập, để:</p>
     <ul>
       <li>thoả mãn nhu cầu thuộc về một chỗ nào đó;</li>
       <li>làm nơi khám phá bản thân và tìm chỗ dựa;</li>
       <li>và — phần người ta hay coi nhẹ — <strong>tác động lên chính công việc chính thức</strong>.</li>
     </ul>
     <p class="meo">💡 Ví dụ ngay trên slide: gây sức ép ngầm buộc thành viên theo một nhịp làm việc nhất định, và là nơi tin tức, chuyện phiếm lan đi.</p>`),

  slide(D, 14, 'What is a team?',
    `<p class="y-chinh">🎯 The second open question. Hold your answer against the definition on slide 17.</p>
     <p class="meo">💡 Most first answers describe a <em>group</em>. The word that is usually missing is "interdependence".</p>`,
    `<p class="y-chinh">🎯 Câu hỏi mở thứ hai. Hãy giữ câu trả lời của bạn để đối chiếu với định nghĩa ở slide 17.</p>
     <p class="meo">💡 Phần lớn câu trả lời đầu tiên thật ra đang mô tả <em>nhóm</em>. Chữ hay bị thiếu là "phụ thuộc lẫn nhau".</p>`),

  slide(D, 15, 'What is a team? (picture slide)',
    `<p class="y-chinh">🎯 Image prompt, no new text. Use it to collect the class's words before the formal definition lands.</p>`,
    `<p class="y-chinh">🎯 Slide hình gợi ý, không có chữ mới. Dùng để gom từ ngữ của lớp trước khi định nghĩa chính thức xuất hiện.</p>`),

  slide(D, 16, 'ACTIVITY 1',
    `<p class="y-chinh">🎯 First of the four in-class activities in this deck.</p>
     <p><span class="nhan">Task</span> — in your new group, agree on one sentence that separates a team from a group, and be ready to defend it.</p>
     <p class="meo">💡 A defensible sentence names at least one of: shared purpose, interdependence, or joint accountability.</p>`,
    `<p class="y-chinh">🎯 Hoạt động đầu trong bốn hoạt động trên lớp của bộ slide này.</p>
     <p><span class="nhan">Việc cần làm</span> — trong nhóm mới lập, thống nhất một câu phân biệt đội với nhóm, và sẵn sàng bảo vệ câu đó.</p>
     <p class="meo">💡 Câu bảo vệ được phải nêu ít nhất một trong: mục tiêu chung, phụ thuộc lẫn nhau, hoặc cùng chịu trách nhiệm.</p>`),

  slide(D, 17, 'A team: a particularly cohesive and purposeful type of work group',
    `<p class="y-chinh">🎯 The course's official definition, and it is deliberately built on top of "group".</p>
     <p>Read it as: <strong>team = work group + cohesion + purpose</strong>.</p>
     <ul>
       <li><span class="nhan">Cohesive</span> — the members hold together; leaving costs something.</li>
       <li><span class="nhan">Purposeful</span> — there is a result the group is answerable for.</li>
     </ul>
     <p class="meo">💡 That is why "every team is a group but not every group is a team" is true by definition, not by opinion.</p>`,
    `<p class="y-chinh">🎯 Định nghĩa chính thức của môn, và nó cố ý được dựng chồng lên chữ "nhóm".</p>
     <p>Hãy đọc là: <strong>đội = nhóm làm việc + gắn kết + có mục đích</strong>.</p>
     <ul>
       <li><span class="nhan">Gắn kết</span> — các thành viên dính vào nhau; rời đi là mất mát gì đó.</li>
       <li><span class="nhan">Có mục đích</span> — có một kết quả mà cả nhóm phải chịu trách nhiệm.</li>
     </ul>
     <p class="meo">💡 Vì thế câu "mọi đội đều là nhóm nhưng không phải nhóm nào cũng là đội" đúng theo định nghĩa, không phải theo quan điểm.</p>`),

  slide(D, 18, 'Team characteristics (1–3)',
    `<p class="y-chinh">🎯 Seven characteristics in total; the first three are about identity.</p>
     <ul>
       <li><span class="nhan">A definable membership</span> — three or more people identifiable by name or type.</li>
       <li><span class="nhan">A group consciousness or identity</span> — the members think of themselves as a group.</li>
       <li><span class="nhan">A sense of shared purpose</span> — common task, goals or interests.</li>
     </ul>
     <p class="meo">💡 "Three or more" is the floor: two people are a pair, and pair dynamics (no majority, no coalition) behave differently.</p>`,
    `<p class="y-chinh">🎯 Tổng cộng bảy đặc điểm; ba cái đầu nói về bản sắc.</p>
     <ul>
       <li><span class="nhan">Thành viên xác định được</span> — từ ba người trở lên, gọi được tên hoặc nêu được loại.</li>
       <li><span class="nhan">Có ý thức/bản sắc nhóm</span> — các thành viên tự coi mình là một nhóm.</li>
       <li><span class="nhan">Cảm nhận về mục đích chung</span> — cùng nhiệm vụ, mục tiêu hoặc mối quan tâm.</li>
     </ul>
     <p class="meo">💡 "Từ ba người" là mức sàn: hai người là một cặp, mà động lực của cặp (không có đa số, không có liên minh) vận hành khác hẳn.</p>`),

  slide(D, 19, 'Team characteristics (4–7)',
    `<p class="y-chinh">🎯 The remaining four are about behaviour — this is where a team stops being a label.</p>
     <ul>
       <li><span class="nhan">Interdependence</span> — members need one another to reach the purpose.</li>
       <li><span class="nhan">Interaction</span> — they communicate with, influence and react to one another.</li>
       <li><span class="nhan">Sustainability</span> — the team periodically reviews its own effectiveness.</li>
       <li><span class="nhan">An ability to act together</span>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> "Interdependence" is the single characteristic most often missing in student answers, and it is the one that does the real separating work.</p>`,
    `<p class="y-chinh">🎯 Bốn đặc điểm còn lại nói về hành vi — đây mới là chỗ chữ "đội" thôi là cái nhãn.</p>
     <ul>
       <li><span class="nhan">Phụ thuộc lẫn nhau</span> — cần nhau mới đạt được mục đích.</li>
       <li><span class="nhan">Tương tác</span> — trao đổi, ảnh hưởng và phản ứng qua lại.</li>
       <li><span class="nhan">Bền vững</span> — định kỳ tự xem lại mình làm việc hiệu quả tới đâu.</li>
       <li><span class="nhan">Khả năng hành động cùng nhau</span>.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> "Phụ thuộc lẫn nhau" là đặc điểm hay bị thiếu nhất trong bài làm của sinh viên, mà nó lại chính là cái phân biệt thật sự.</p>`),

  slide(D, 20, 'ACTIVITY 2 — choose the characteristics that fit your team',
    `<p class="y-chinh">🎯 Apply the seven characteristics to the group you formed twenty minutes ago.</p>
     <p><span class="nhan">Task</span> — pick the characteristics your group already has, and explain why.</p>
     <p class="meo">💡 Honest answer for a brand-new group: membership and interaction yes; interdependence and sustainability not yet. Saying so is a better answer than claiming all seven.</p>`,
    `<p class="y-chinh">🎯 Áp bảy đặc điểm vào chính nhóm bạn vừa lập hai mươi phút trước.</p>
     <p><span class="nhan">Việc cần làm</span> — chọn những đặc điểm nhóm bạn đã có, và giải thích vì sao.</p>
     <p class="meo">💡 Câu trả lời trung thực cho một nhóm mới toanh: có thành viên và có tương tác; chưa có phụ thuộc lẫn nhau và chưa có tính bền vững. Nói thẳng thế còn hay hơn là nhận đủ cả bảy.</p>`),

  slide(D, 21, '"People are more willing to support and defend work they helped create"',
    `<p class="y-chinh">🎯 One-line principle, and it is the reason the whole course is built on group work.</p>
     <p><span class="nhan">Consequence for your project</span> — a plan written by one member at 2 a.m. and announced to the rest will be defended by exactly one person.</p>
     <p class="meo">💡 This sentence reappears in Lesson 16 (Meetings) as the argument for letting everyone speak before a decision closes.</p>`,
    `<p class="y-chinh">🎯 Một câu nguyên lý, và đó là lý do cả môn học này dựng trên làm việc nhóm.</p>
     <p><span class="nhan">Hệ quả cho dự án của bạn</span> — bản kế hoạch do một người viết lúc 2 giờ sáng rồi thông báo cho cả nhóm sẽ chỉ có đúng một người bảo vệ nó.</p>
     <p class="meo">💡 Câu này quay lại ở Bài 16 (Cuộc họp) với vai trò lập luận vì sao phải để mọi người nói trước khi chốt quyết định.</p>`),

  slide(D, 22, 'ACTIVITY 3 — risks of working in teams',
    `<p class="y-chinh">🎯 Deliberate counterweight: the deck has just sold teamwork, now it asks what it costs.</p>
     <p><span class="nhan">Risks worth naming</span></p>
     <ul>
       <li>Slower decisions — consensus takes time (slide 23 lists speed as a reason to work alone).</li>
       <li>Social loafing — effort hides inside a group.</li>
       <li>Groupthink — cohesion silences dissent (Lesson 3 covers it).</li>
       <li>Conflict between members' interests (slide 23 again).</li>
       <li>Unequal marks for unequal effort — your 30% project has this risk built in.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Đối trọng có chủ ý: bộ slide vừa ca ngợi làm việc đội xong liền hỏi cái giá phải trả.</p>
     <p><span class="nhan">Những rủi ro đáng gọi tên</span></p>
     <ul>
       <li>Quyết định chậm hơn — đồng thuận thì tốn thời gian (slide 23 xếp tốc độ vào lý do làm một mình).</li>
       <li>Ăn theo (social loafing) — công sức bị giấu vào trong nhóm.</li>
       <li>Tư duy tập thể (groupthink) — gắn kết làm tắt tiếng nói trái chiều (Bài 3 sẽ dạy).</li>
       <li>Xung đột lợi ích giữa các thành viên (lại là slide 23).</li>
       <li>Điểm như nhau cho công sức khác nhau — dự án 30% của bạn mang sẵn rủi ro này.</li>
     </ul>`),

  slide(D, 23, 'When to work alone or in groups',
    `<p class="y-chinh">🎯 Eight conditions that argue <em>against</em> building a team.</p>
     <ul class="hai-cot">
       <li>Simple tasks or problems</li>
       <li>Cooperation is sufficient</li>
       <li>Minimum discretion required</li>
       <li>Fast decisions are needed</li>
       <li>Few competences are required</li>
       <li>Members' interests differ or conflict</li>
       <li>The organisation credits individuals for operational outputs</li>
       <li>Innovative responses are sought</li>
     </ul>
     <p class="meo">💡 The last one surprises people: for genuinely novel ideas, individuals first, group afterwards — group pressure narrows early thinking (Lesson 5–6 on brainstorming says the same).</p>`,
    `<p class="y-chinh">🎯 Tám điều kiện lập luận <em>chống lại</em> việc lập đội.</p>
     <ul class="hai-cot">
       <li>Nhiệm vụ hoặc vấn đề đơn giản</li>
       <li>Chỉ cần hợp tác là đủ</li>
       <li>Cần rất ít quyền tự quyết</li>
       <li>Cần quyết định nhanh</li>
       <li>Cần ít năng lực khác nhau</li>
       <li>Lợi ích các thành viên khác nhau hoặc xung đột</li>
       <li>Tổ chức ghi công cá nhân cho kết quả vận hành</li>
       <li>Đang tìm phản hồi sáng tạo</li>
     </ul>
     <p class="meo">💡 Cái cuối làm nhiều người ngạc nhiên: muốn ý tưởng thật mới thì cá nhân nghĩ trước, nhóm bàn sau — áp lực nhóm bóp hẹp tư duy ở giai đoạn đầu (Bài 5–6 về brainstorming nói y như vậy).</p>`),

  slide(D, 24, 'When to build teams',
    `<p class="y-chinh">🎯 The mirror list — eight conditions that argue <em>for</em> a team.</p>
     <ul class="hai-cot">
       <li>Highly complex tasks or problems</li>
       <li>Decisions by consensus are essential</li>
       <li>High level of choice and uncertainty</li>
       <li>High commitment is needed</li>
       <li>A broad range of competences and different skills</li>
       <li>Members' objectives can be brought together</li>
       <li>The organisation rewards team results</li>
       <li>Balanced views are sought</li>
     </ul>
     <p class="meo">💡 Learn slides 23 and 24 as one pair. An exam question gives you a situation and asks which side it falls on.</p>`,
    `<p class="y-chinh">🎯 Danh sách đối xứng — tám điều kiện lập luận <em>ủng hộ</em> lập đội.</p>
     <ul class="hai-cot">
       <li>Nhiệm vụ hoặc vấn đề rất phức tạp</li>
       <li>Bắt buộc phải quyết định bằng đồng thuận</li>
       <li>Mức lựa chọn và bất định cao</li>
       <li>Cần cam kết cao</li>
       <li>Cần dải năng lực rộng và kỹ năng khác nhau</li>
       <li>Mục tiêu các thành viên gom về một mối được</li>
       <li>Tổ chức thưởng theo kết quả của đội</li>
       <li>Đang tìm góc nhìn cân bằng</li>
     </ul>
     <p class="meo">💡 Học slide 23 và 24 như một cặp. Đề thi sẽ đưa một tình huống và hỏi nó rơi vào bên nào.</p>`),

  slide(D, 25, 'Elements of a hierarchical structure (diagram)',
    `<p class="y-chinh">🎯 Diagram slide introducing the five layers explained on slides 26–28.</p>
     <p class="meo">💡 The placeholder Latin ("Vestibulum congue") is template text the lecturer left in; read the labels, ignore the filler.</p>`,
    `<p class="y-chinh">🎯 Slide sơ đồ, giới thiệu năm tầng sẽ được giải thích ở slide 26–28.</p>
     <p class="meo">💡 Mấy chữ Latin ("Vestibulum congue") là chữ mẫu của template còn sót lại; đọc phần nhãn, bỏ qua chữ chèn.</p>`),

  slide(D, 26, 'Traditional hierarchical structure — the five layers',
    `<p class="y-chinh">🎯 Five layers, each defined by who it reports to.</p>
     <ol>
       <li><span class="nhan">Staff performing similar tasks</span> — grouped together under a single supervisor.</li>
       <li><span class="nhan">Junior managers</span> — responsible for several supervisors and their groups.</li>
       <li><span class="nhan">Groups of junior managers</span> — reporting to departmental heads.</li>
       <li><span class="nhan">Departmental heads</span> — reporting to senior managers responsible for wide functions (manufacturing, finance, HR, marketing).</li>
       <li><span class="nhan">Senior managers</span> — reporting to the managing director, who may report to the Board.</li>
     </ol>
     <p class="meo">💡 Why a communication course teaches an org chart: the chart <em>is</em> the default communication path. Every extra layer is one more place a message can be reshaped or stopped.</p>`,
    `<p class="y-chinh">🎯 Năm tầng, mỗi tầng được định nghĩa bằng việc nó báo cáo cho ai.</p>
     <ol>
       <li><span class="nhan">Nhân viên làm việc tương tự nhau</span> — gom lại dưới một người giám sát.</li>
       <li><span class="nhan">Quản lý cấp cơ sở</span> — phụ trách nhiều giám sát viên và các nhóm của họ.</li>
       <li><span class="nhan">Cụm quản lý cấp cơ sở</span> — báo cáo lên trưởng bộ phận.</li>
       <li><span class="nhan">Trưởng bộ phận</span> — báo cáo lên quản lý cấp cao phụ trách các mảng lớn (sản xuất, tài chính, nhân sự, marketing).</li>
       <li><span class="nhan">Quản lý cấp cao</span> — báo cáo lên tổng giám đốc, người có thể báo cáo tiếp lên Hội đồng.</li>
     </ol>
     <p class="meo">💡 Vì sao môn giao tiếp lại dạy sơ đồ tổ chức: sơ đồ đó <em>chính là</em> đường đi mặc định của thông tin. Mỗi tầng thêm vào là thêm một chỗ thông điệp có thể bị nắn lại hoặc chặn lại.</p>`),

  slide(D, 27, 'The same five layers, numbered top-down',
    `<p class="y-chinh">🎯 Same content as slide 26, redrawn from the top down (1 = senior managers).</p>
     <p class="meo">💡 Useful for the exam: be able to recite the chain in both directions. "Who reports to whom" and "who is responsible for whom" are the same chain read two ways.</p>`,
    `<p class="y-chinh">🎯 Vẫn nội dung slide 26 nhưng vẽ lại từ trên xuống (1 = quản lý cấp cao).</p>
     <p class="meo">💡 Hữu ích khi thi: đọc được chuỗi này theo cả hai chiều. "Ai báo cáo cho ai" và "ai chịu trách nhiệm về ai" chỉ là một chuỗi đọc theo hai hướng.</p>`),

  slide(D, 28, 'Hierarchy worked example — Manufacturing / Engineering',
    `<p class="y-chinh">🎯 The abstract layers filled in with a real company shape.</p>
     <ul>
       <li>Managing Director → Head of Manufacturing, Head of Engineering</li>
       <li>→ Manager: Widget Production</li>
       <li>→ Manager: Assembly, Manager: Packing</li>
       <li>→ Day-shift supervisor, night-shift supervisor → line operators</li>
     </ul>
     <p class="meo">💡 Count the steps from a line operator to the Managing Director: five. That is why a problem seen on the line takes days to reach a decision-maker — and why teams are created to short-circuit it.</p>`,
    `<p class="y-chinh">🎯 Các tầng trừu tượng giờ được điền bằng hình dạng của một công ty thật.</p>
     <ul>
       <li>Tổng giám đốc → Trưởng khối Sản xuất, Trưởng khối Kỹ thuật</li>
       <li>→ Quản lý: Sản xuất Widget</li>
       <li>→ Quản lý: Lắp ráp, Quản lý: Đóng gói</li>
       <li>→ Giám sát ca ngày, giám sát ca đêm → công nhân dây chuyền</li>
     </ul>
     <p class="meo">💡 Đếm số bước từ công nhân dây chuyền lên tổng giám đốc: năm. Đó là lý do một vấn đề thấy ở dây chuyền mất mấy ngày mới tới người quyết được — và là lý do người ta lập đội để đi tắt.</p>`),

  slide(D, 29, 'Team size vs group size',
    `<p class="y-chinh">🎯 The numbers the course uses: <strong>team = 5–7 people · group = 10–20 people</strong>.</p>
     <p><span class="nhan">Why the ceiling</span> — every extra member adds communication links faster than it adds output. Five people hold 10 pairs; ten people hold 45.</p>
     <p class="meo">💡 This is exactly why your project group was capped at 5–7 on slide 7. The syllabus number is not arbitrary.</p>`,
    `<p class="y-chinh">🎯 Con số môn học dùng: <strong>đội = 5–7 người · nhóm = 10–20 người</strong>.</p>
     <p><span class="nhan">Vì sao có trần</span> — mỗi người thêm vào làm số kênh giao tiếp tăng nhanh hơn phần việc tăng thêm. Năm người có 10 cặp; mười người có 45 cặp.</p>
     <p class="meo">💡 Đây đúng là lý do nhóm dự án của bạn bị chặn ở 5–7 người từ slide 7. Con số trong syllabus không phải tuỳ tiện.</p>`),

  slide(D, 30, 'The functional team',
    `<p class="y-chinh">🎯 First of five team models. <strong>Functional</strong> = organised along functional lines.</p>
     <ul>
       <li>People working together carry out the same or similar functions.</li>
       <li>A functional team is a team whose work happens inside such a functionally organised group.</li>
     </ul>
     <p class="meo">💡 Example: the whole QA department working as one unit. Deep skill in one area, weak visibility of the other areas.</p>`,
    `<p class="y-chinh">🎯 Mô hình đội thứ nhất trong năm. <strong>Chức năng</strong> = tổ chức theo tuyến chức năng.</p>
     <ul>
       <li>Những người làm cùng nhau đảm nhiệm cùng một hoặc các chức năng tương tự.</li>
       <li>Đội chức năng là đội mà công việc diễn ra bên trong một nhóm tổ chức theo chức năng như thế.</li>
     </ul>
     <p class="meo">💡 Ví dụ: cả phòng QA làm việc như một đơn vị. Rất sâu về một mảng, nhưng nhìn các mảng khác thì mờ.</p>`),

  slide(D, 31, 'The project (single) team',
    `<p class="y-chinh">🎯 Model 2 — people from anywhere, pulled together as one organisational unit for a project.</p>
     <ul>
       <li>Often led by a project manager…</li>
       <li>…though self-managing and self-organising arrangements also exist (slide 37–38).</li>
     </ul>
     <p class="meo">💡 Your SSG104 group project is exactly this model: a distinct unit, one product, disbanding when the project ends.</p>`,
    `<p class="y-chinh">🎯 Mô hình 2 — người từ khắp nơi được kéo về thành một đơn vị tổ chức riêng cho một dự án.</p>
     <ul>
       <li>Thường do một quản lý dự án dẫn dắt…</li>
       <li>…dù cũng có kiểu tự quản và tự tổ chức (slide 37–38).</li>
     </ul>
     <p class="meo">💡 Dự án nhóm SSG104 của bạn chính là mô hình này: một đơn vị riêng, một sản phẩm, xong dự án thì giải tán.</p>`),

  slide(D, 32, 'The matrix team',
    `<p class="y-chinh">🎯 Model 3 — staff report to <strong>different managers for different aspects</strong> of their work.</p>
     <ul>
       <li>Common in projects, and more common in large and multinational organisations.</li>
       <li>Typical split: a functional manager owns "how well you do your craft", a project manager owns "what you deliver this quarter".</li>
     </ul>`,
    `<p class="y-chinh">🎯 Mô hình 3 — nhân sự báo cáo cho <strong>những người quản lý khác nhau ở những khía cạnh khác nhau</strong> của công việc.</p>
     <ul>
       <li>Hay gặp trong dự án, và càng phổ biến ở tổ chức lớn, đa quốc gia.</li>
       <li>Kiểu chia điển hình: quản lý chức năng lo "bạn làm nghề giỏi tới đâu", quản lý dự án lo "quý này bạn giao được cái gì".</li>
     </ul>`),

  slide(D, 33, 'The matrix team — the "two-boss" problem',
    `<p class="y-chinh">🎯 The named weakness of the matrix model, and the slide gives the remedy.</p>
     <p><span class="nhan">Problem</span> — dual reporting lines: two bosses, two sets of priorities, one person.</p>
     <p><span class="nhan">Remedy on the slide</span> — build good interpersonal relationships with team members, plus regular and effective communication.</p>
     <p class="meo">💡 Note the shape of the answer: a structural problem is solved by communication behaviour. That is the thesis of this whole subject.</p>`,
    `<p class="y-chinh">🎯 Điểm yếu được gọi tên của mô hình ma trận, và slide cũng đưa luôn cách chữa.</p>
     <p><span class="nhan">Vấn đề</span> — hai tuyến báo cáo: hai sếp, hai bộ ưu tiên, một con người.</p>
     <p><span class="nhan">Cách chữa ghi trên slide</span> — xây quan hệ tốt với các thành viên, cộng với giao tiếp đều đặn và hiệu quả.</p>
     <p class="meo">💡 Để ý hình dạng của câu trả lời: một vấn đề thuộc về cấu trúc lại được chữa bằng hành vi giao tiếp. Đó chính là luận điểm của cả môn học này.</p>`),

  slide(D, 34, 'The contract team',
    `<p class="y-chinh">🎯 Model 4 — brought in from outside to do the project work.</p>
     <ul>
       <li>The <strong>client</strong> judges whether the project succeeded.</li>
       <li>Variant: the "outsourced supply team", physically located away from the project manager.</li>
     </ul>
     <p class="meo">💡 Distance plus an external judge is the hardest communication setting in this list — everything must be written down, because nothing can be settled by walking over.</p>`,
    `<p class="y-chinh">🎯 Mô hình 4 — được đưa từ bên ngoài vào để làm phần việc dự án.</p>
     <ul>
       <li><strong>Khách hàng</strong> mới là người phán xét dự án thành công hay không.</li>
       <li>Biến thể: "đội cung ứng thuê ngoài", ngồi ở nơi cách xa quản lý dự án.</li>
     </ul>
     <p class="meo">💡 Xa cách cộng với người phán xét ở bên ngoài là bối cảnh giao tiếp khó nhất trong danh sách này — mọi thứ phải viết ra, vì không thể đi bộ sang bàn bên để chốt.</p>`),

  slide(D, 35, 'The mixed-structure team',
    `<p class="y-chinh">🎯 Model 5 — the one real organisations actually have.</p>
     <ul>
       <li>Some members full time, others part time.</li>
       <li>Some inside a matrix arrangement.</li>
       <li>Some inside a functional hierarchy.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> in a mixed team, "everyone is in the meeting" is false by construction — the part-timers are not. Decide in writing, not only in the room.</p>`,
    `<p class="y-chinh">🎯 Mô hình 5 — cái mà tổ chức thật ngoài đời thực sự có.</p>
     <ul>
       <li>Một số thành viên toàn thời gian, số khác bán thời gian.</li>
       <li>Một số nằm trong sắp xếp ma trận.</li>
       <li>Một số nằm trong hệ thống phân cấp chức năng.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy:</strong> trong đội hỗn hợp, câu "cả nhóm đều có mặt trong buổi họp" sai ngay từ cấu trúc — người bán thời gian không có mặt. Hãy chốt bằng văn bản, đừng chỉ chốt trong phòng họp.</p>`),

  slide(D, 36, 'ACTIVITY 4 — discussion on team models',
    `<p class="y-chinh">🎯 Three questions, and the deck has already given you the material to answer all three.</p>
     <p><span class="nhan">Which model suits a large, complex problem?</span> Project or matrix — they assemble a broad range of competences, which slide 24 names as the condition for building a team.</p>
     <p><span class="nhan">Which is normal for a straightforward task?</span> Functional — slide 23: simple tasks, few competences, fast decisions.</p>
     <p><span class="nhan">Benefits and drawbacks?</span></p>
     <ul>
       <li>Functional — deep expertise, weak cross-function view.</li>
       <li>Project — focus and commitment, but the team dissolves and its knowledge leaves with it.</li>
       <li>Matrix — flexible use of scarce skills, but the two-boss problem (slide 33).</li>
       <li>Contract — brings capacity fast, but success is judged by an outsider.</li>
       <li>Mixed — realistic, hardest to coordinate.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Ba câu hỏi, và bộ slide đã đưa đủ nguyên liệu để trả lời cả ba.</p>
     <p><span class="nhan">Mô hình nào hợp bài toán lớn và phức tạp?</span> Dự án hoặc ma trận — chúng gom được dải năng lực rộng, đúng điều kiện lập đội mà slide 24 nêu.</p>
     <p><span class="nhan">Mô hình nào là bình thường với việc đơn giản?</span> Chức năng — theo slide 23: việc đơn giản, cần ít năng lực, cần quyết nhanh.</p>
     <p><span class="nhan">Lợi và hại?</span></p>
     <ul>
       <li>Chức năng — chuyên môn sâu, nhưng nhìn liên phòng ban thì kém.</li>
       <li>Dự án — tập trung và cam kết cao, nhưng đội tan thì tri thức đi theo.</li>
       <li>Ma trận — dùng linh hoạt kỹ năng hiếm, nhưng dính vấn đề hai sếp (slide 33).</li>
       <li>Hợp đồng — bổ sung năng lực nhanh, nhưng người phán xét thành công lại ở ngoài.</li>
       <li>Hỗn hợp — sát thực tế nhất, khó điều phối nhất.</li>
     </ul>`),

  slide(D, 37, 'The modern teams — three other important types',
    `<p class="y-chinh">🎯 Three newer forms the deck singles out.</p>
     <ul>
       <li><span class="nhan">Self-managed teams</span></li>
       <li><span class="nhan">Self-organizing teams</span></li>
       <li><span class="nhan">Dispersed virtual teams</span></li>
     </ul>
     <p class="meo">💡 The next slide compares the first two in detail; the third is the one you already live in whenever a group project runs over chat and shared documents.</p>`,
    `<p class="y-chinh">🎯 Ba dạng mới hơn mà bộ slide tách riêng ra.</p>
     <ul>
       <li><span class="nhan">Đội tự quản (self-managed)</span></li>
       <li><span class="nhan">Đội tự tổ chức (self-organizing)</span></li>
       <li><span class="nhan">Đội ảo phân tán (dispersed virtual)</span></li>
     </ul>
     <p class="meo">💡 Slide sau so sánh kỹ hai dạng đầu; dạng thứ ba là thứ bạn đang sống trong đó mỗi khi dự án nhóm chạy qua chat và tài liệu chung.</p>`),

  slide(D, 38, 'Self-managed vs self-organizing teams (comparison table)',
    `<p class="y-chinh">🎯 Six rows of contrast. The dividing question is: <em>who decides the team's boundaries?</em></p>
     <ul>
       <li><span class="nhan">Reporting structure</span> — self-managed: inside the formal one · self-organizing: outside it.</li>
       <li><span class="nhan">Members</span> — selected by management · self-selected volunteers.</li>
       <li><span class="nhan">Style</span> — informal in both.</li>
       <li><span class="nhan">Control</span> — indirectly controlled by senior management · senior management influences only the boundaries.</li>
       <li><span class="nhan">Leadership</span> — usually a permanent leader (may change) · variable: one, changing, or shared.</li>
       <li><span class="nhan">Empowerment</span> — empowered by senior management · empowered by the members plus a supportive culture.</li>
     </ul>
     <p class="meo">💡 Memory hook: self-<strong>managed</strong> = management still holds the frame; self-<strong>organizing</strong> = the members hold it.</p>`,
    `<p class="y-chinh">🎯 Sáu dòng đối chiếu. Câu hỏi phân định là: <em>ai quyết định ranh giới của đội?</em></p>
     <ul>
       <li><span class="nhan">Cấu trúc báo cáo</span> — tự quản: nằm trong hệ thống chính thức · tự tổ chức: nằm ngoài.</li>
       <li><span class="nhan">Thành viên</span> — do quản lý chọn · người tự nguyện tự chọn.</li>
       <li><span class="nhan">Phong cách</span> — cả hai đều phi chính thức.</li>
       <li><span class="nhan">Kiểm soát</span> — cấp trên kiểm soát gián tiếp · cấp trên chỉ tác động vào ranh giới của đội.</li>
       <li><span class="nhan">Lãnh đạo</span> — thường có người dẫn dắt cố định (có thể đổi) · thay đổi: một người, luân phiên, hoặc chia sẻ.</li>
       <li><span class="nhan">Trao quyền</span> — do cấp trên trao · do chính thành viên cộng với văn hoá hỗ trợ tạo ra.</li>
     </ul>
     <p class="meo">💡 Cách nhớ: tự-<strong>quản</strong> = cấp quản lý vẫn giữ cái khung; tự-<strong>tổ chức</strong> = thành viên giữ cái khung.</p>`),

  slide(D, 39, 'Why do (only some) teams succeed?',
    `<p class="y-chinh">🎯 Transition question. The word in brackets is the point: being a team is not the same as being effective.</p>
     <p class="meo">💡 Everything you have learned so far describes <em>structure</em>. The next slide moves to <em>effectiveness</em>, which structure alone does not deliver.</p>`,
    `<p class="y-chinh">🎯 Câu hỏi chuyển ý. Chữ trong ngoặc mới là điểm nhấn: là một đội không đồng nghĩa với làm việc hiệu quả.</p>
     <p class="meo">💡 Mọi thứ học tới đây đều mô tả <em>cấu trúc</em>. Slide sau chuyển sang <em>hiệu quả</em>, thứ mà riêng cấu trúc không mang lại được.</p>`),

  slide(D, 40, 'Systems map of the components influencing team effectiveness',
    `<p class="y-chinh">🎯 A systems map: effectiveness is not one cause but a web of interacting components.</p>
     <p><span class="nhan">How to read a systems map</span></p>
     <ul>
       <li>Each node is a factor (task, size, skills, leadership, environment…).</li>
       <li>Each arrow is an influence, and influences run in loops, not straight lines.</li>
       <li>So a single fix — "get a better leader" — rarely moves the outcome by itself.</li>
     </ul>
     <p class="meo">💡 This is the honest answer to slide 39: teams succeed when several components line up, which is why the course spends five sessions on different components instead of one rule.</p>`,
    `<p class="y-chinh">🎯 Một bản đồ hệ thống: hiệu quả không đến từ một nguyên nhân mà từ một mạng lưới các thành phần tác động lẫn nhau.</p>
     <p><span class="nhan">Cách đọc bản đồ hệ thống</span></p>
     <ul>
       <li>Mỗi nút là một yếu tố (nhiệm vụ, quy mô, kỹ năng, lãnh đạo, môi trường…).</li>
       <li>Mỗi mũi tên là một ảnh hưởng, và ảnh hưởng chạy thành vòng lặp chứ không thành đường thẳng.</li>
       <li>Nên một cú sửa đơn lẻ — "đổi lấy người lãnh đạo giỏi hơn" — hiếm khi tự nó làm kết quả đổi.</li>
     </ul>
     <p class="meo">💡 Đây là câu trả lời trung thực cho slide 39: đội thành công khi nhiều thành phần cùng khớp, và đó là lý do môn học dành năm buổi cho các thành phần khác nhau thay vì đưa một quy tắc.</p>`),

  slide(D, 41, 'Q&A',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Check yourself before leaving</span></p>
     <ol>
       <li>Can you state the definition of a team in one sentence (slide 17)?</li>
       <li>Can you list the seven team characteristics, including interdependence (slides 18–19)?</li>
       <li>Can you decide "alone or team?" for a given situation (slides 23–24)?</li>
       <li>Can you name the five team models and the weakness of each (slides 30–35)?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm trước khi rời lớp</span></p>
     <ol>
       <li>Bạn phát biểu được định nghĩa đội trong một câu chưa (slide 17)?</li>
       <li>Bạn liệt kê được bảy đặc điểm của đội, có cả "phụ thuộc lẫn nhau" không (slide 18–19)?</li>
       <li>Bạn quyết được "làm một mình hay lập đội?" cho một tình huống cho trước chưa (slide 23–24)?</li>
       <li>Bạn gọi tên được năm mô hình đội và điểm yếu của từng cái chưa (slide 30–35)?</li>
     </ol>`),

  books([
    ['wig', 'Chapter 1 — groups vs teams, team characteristics', 'Chương 1 — nhóm vs đội, đặc điểm của đội'],
    ['piercy', 'Chapter 1 — what a group is and why we study groups', 'Chương 1 — nhóm là gì và vì sao phải nghiên cứu nhóm'],
  ]),

  bi(
    `<h3>✅ What this lesson is worth in marks</h3>
     <p>Four in-class activities live in this deck (slides 16, 20, 22, 36). The Activity component is 15% of the subject, and it is graded on participation in the moment — it cannot be submitted late.</p>`,
    `<h3>✅ Bài này đáng bao nhiêu điểm</h3>
     <p>Bốn hoạt động trên lớp nằm trong bộ slide này (slide 16, 20, 22, 36). Cột Activity chiếm 15% điểm môn, và nó chấm theo việc bạn tham gia ngay tại chỗ — không nộp bù được.</p>`),
].join('\n');
