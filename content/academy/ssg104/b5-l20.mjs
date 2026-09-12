/**
 * Buổi 5 · Bài 20 — Career development & career skills (16 slide).
 *
 * Bám bộ "Session 5_Career exploration_Lesson 20_...". Syllabus hỏi CQ15.7 về
 * PDCA; bản Academy cũ chỉ có một đoạn "những kỹ năng này là sự nghiệp của
 * bạn" và 0 lần nhắc PDCA hay năm giai đoạn phát triển nghề nghiệp.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's5-l20';

export const b5l20 = [
  walkHead(D, 1, 16,
    'Session V turns the course outward. Two frameworks carry the exam weight: the five stages of career development (slide 5) and PDCA (slides 7–8, this is CQ15.7).',
    'Buổi V hướng cả môn học ra bên ngoài. Hai khung khái niệm gánh trọng số thi: năm giai đoạn phát triển nghề nghiệp (slide 5) và PDCA (slide 7–8, chính là CQ15.7).'),

  slide(D, 1, 'Session V — Career Exploration',
    `<p class="y-chinh">🎯 Title slide for the final session, which has three lessons: career development, résumé and cover letter, job interview preparation.</p>
     <p class="meo">💡 Group Assignment 2 (10%) is a job interview, run at sessions 50–51. Everything in Session V feeds it.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề của buổi cuối, gồm ba bài: phát triển nghề nghiệp, CV và thư xin việc, chuẩn bị phỏng vấn.</p>
     <p class="meo">💡 Group Assignment 2 (10%) chính là một buổi phỏng vấn xin việc, tổ chức ở buổi 50–51. Mọi thứ trong Buổi V đều phục vụ nó.</p>`),

  slide(D, 2, 'Learning objectives (2)',
    `<p class="y-chinh">🎯 Two objectives.</p>
     <ol>
       <li>Describe the stages of career development, and <strong>identify the stage you are currently in</strong>.</li>
       <li>Identify career development resources in your school, community and beyond.</li>
     </ol>
     <p class="meo">💡 Objective 1 asks you to place yourself, not just recite. Most university students are in stage 2, and knowing that changes what is worth doing this year.</p>`,
    `<p class="y-chinh">🎯 Hai mục tiêu.</p>
     <ol>
       <li>Mô tả các giai đoạn phát triển nghề nghiệp, và <strong>xác định bạn đang ở giai đoạn nào</strong>.</li>
       <li>Chỉ ra các nguồn lực phát triển nghề nghiệp trong trường, trong cộng đồng và xa hơn.</li>
     </ol>
     <p class="meo">💡 Mục tiêu 1 yêu cầu bạn tự định vị mình, không chỉ đọc thuộc. Phần lớn sinh viên đại học đang ở giai đoạn 2, và biết điều đó sẽ đổi việc gì đáng làm trong năm nay.</p>`),

  slide(D, 3, 'Opening quotation',
    `<p class="y-chinh">🎯 "Desire! That's the one secret of every man's career." — Johnny Carson.</p>
     <p class="meo">💡 Read it beside the frameworks that follow: desire decides whether you start, the frameworks decide whether the effort compounds.</p>`,
    `<p class="y-chinh">🎯 "Khát khao! Đó là bí mật duy nhất trong sự nghiệp của mỗi người." — Johnny Carson.</p>
     <p class="meo">💡 Hãy đọc nó cạnh các khung khái niệm phía sau: khát khao quyết định bạn có bắt đầu hay không, còn khung khái niệm quyết định công sức ấy có tích luỹ lại được không.</p>`),

  slide(D, 4, 'What is career development?',
    `<p class="y-chinh">🎯 The definition.</p>
     <ul>
       <li>It is a <strong>lifelong process</strong> in which we become aware of, interested in, knowledgeable about, and skilled in a career.</li>
       <li>It is a key part of human development, as our identity forms and our life unfolds.</li>
     </ul>
     <p class="meo">💡 Note the four verbs in order: aware → interested → knowledgeable → skilled. You cannot skip to the fourth, which is why "I'll learn it when I get the job" rarely works.</p>`,
    `<p class="y-chinh">🎯 Định nghĩa.</p>
     <ul>
       <li>Đó là một <strong>quá trình suốt đời</strong>, trong đó ta dần biết tới, quan tâm, hiểu biết, rồi thành thạo một nghề.</li>
       <li>Nó là phần cốt lõi của sự phát triển con người, khi bản sắc hình thành và cuộc đời mở ra.</li>
     </ul>
     <p class="meo">💡 Để ý bốn động từ theo thứ tự: biết tới → quan tâm → hiểu biết → thành thạo. Không nhảy thẳng tới cái thứ tư được, nên câu "đi làm rồi học" hiếm khi có tác dụng.</p>`),

  slide(D, 5, 'Stages of career development (5)',
    `<p class="y-chinh">🎯 Five stages, in order.</p>
     <ol>
       <li><span class="nhan">Growing</span> — forming a first picture of what work is.</li>
       <li><span class="nhan">Exploring</span> — trying options, narrowing them. <strong>Where most university students are.</strong></li>
       <li><span class="nhan">Establishing</span> — building a position in a chosen field.</li>
       <li><span class="nhan">Maintaining</span> — holding and deepening it.</li>
       <li><span class="nhan">Reinventing</span> — changing direction, often more than once.</li>
     </ol>
     <p class="meo">💡 The fifth stage is the modern addition and the reason objective 1 matters: a career is now expected to cycle, not to end.</p>`,
    `<p class="y-chinh">🎯 Năm giai đoạn, theo thứ tự.</p>
     <ol>
       <li><span class="nhan">Hình thành</span> — dựng hình dung đầu tiên về chuyện đi làm.</li>
       <li><span class="nhan">Khám phá</span> — thử các hướng, thu hẹp dần. <strong>Chỗ phần lớn sinh viên đại học đang đứng.</strong></li>
       <li><span class="nhan">Xác lập</span> — dựng chỗ đứng trong lĩnh vực đã chọn.</li>
       <li><span class="nhan">Duy trì</span> — giữ và đào sâu chỗ đứng đó.</li>
       <li><span class="nhan">Tái tạo</span> — đổi hướng, thường là hơn một lần.</li>
     </ol>
     <p class="meo">💡 Giai đoạn thứ năm là phần bổ sung của thời hiện đại, và là lý do mục tiêu 1 quan trọng: sự nghiệp bây giờ được trông đợi sẽ quay vòng, chứ không kết thúc.</p>`),

  slide(D, 6, 'Career roadmap — four cyclical steps',
    `<p class="y-chinh">🎯 The road map identifies four <strong>cyclical</strong> steps.</p>
     <ol>
       <li><span class="nhan">Know yourself</span></li>
       <li><span class="nhan">Explore and choose options</span></li>
       <li><span class="nhan">Gain knowledge and experience</span></li>
       <li><span class="nhan">Put it all together: the job search process</span></li>
     </ol>
     <p class="meo">💡 "Cyclical" means step 4 returns to step 1. Every job you hold teaches you something about yourself that changes what you should explore next.</p>`,
    `<p class="y-chinh">🎯 Bản đồ nghề nghiệp nêu bốn bước có tính <strong>chu kỳ</strong>.</p>
     <ol>
       <li><span class="nhan">Hiểu chính mình</span></li>
       <li><span class="nhan">Khám phá và chọn phương án</span></li>
       <li><span class="nhan">Tích luỹ kiến thức và kinh nghiệm</span></li>
       <li><span class="nhan">Ghép tất cả lại: quá trình tìm việc</span></li>
     </ol>
     <p class="meo">💡 "Chu kỳ" nghĩa là bước 4 quay về bước 1. Mỗi công việc bạn làm đều dạy bạn điều gì đó về chính mình, và điều đó đổi thứ bạn nên khám phá tiếp theo.</p>`),

  slide(D, 7, 'Plan, Do, Check, Act',
    `<p class="y-chinh">🎯 Divider for PDCA — the framework CQ15.7 asks about.</p>
     <p class="meo">💡 PDCA comes from quality management and is applied here to a career. The point of borrowing it is that a career, like a process, improves by measured iteration rather than by one big decision.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục cho PDCA — khung khái niệm mà CQ15.7 hỏi tới.</p>
     <p class="meo">💡 PDCA vốn từ quản trị chất lượng, ở đây được áp vào sự nghiệp. Ý nghĩa của việc mượn nó là: sự nghiệp, cũng như một quy trình, tiến bộ nhờ lặp lại có đo lường chứ không nhờ một quyết định lớn duy nhất.</p>`),

  slide(D, 8, 'PDCA explained',
    `<p class="y-chinh">🎯 Four steps, with the slide's own wording.</p>
     <ul>
       <li><span class="nhan">PLAN</span> — what are your goals and objectives? What process will you use to reach your targets? <strong>Plan smaller to begin with and test possible effects.</strong></li>
       <li><span class="nhan">DO</span> — implement your plan. Sell your product, which is <em>you</em>: your skills, talents, energy and enthusiasm.</li>
       <li><span class="nhan">CHECK</span> — look at results so far. Are you happy with your job, or wherever you are in the process? How does actual accomplishment measure up next to your intentions?</li>
       <li><span class="nhan">ACT</span> — how should you act going forward? What changes in planning, doing and checking do you want to make?</li>
     </ul>
     <p><strong>PDCA is an ongoing process; the goal is continuous improvement.</strong></p>
     <p class="meo">💡 The most usable part is "plan smaller to begin with": a two-week experiment that tells you something true beats a five-year plan built on guesses.</p>`,
    `<p class="y-chinh">🎯 Bốn bước, dùng đúng chữ của slide.</p>
     <ul>
       <li><span class="nhan">PLAN — hoạch định</span>: mục tiêu của bạn là gì? Bạn sẽ dùng quy trình nào để tới đích? <strong>Hãy lập kế hoạch nhỏ trước và thử xem tác động ra sao.</strong></li>
       <li><span class="nhan">DO — thực hiện</span>: triển khai kế hoạch. Hãy bán thứ sản phẩm là <em>chính bạn</em>: kỹ năng, tài năng, năng lượng và nhiệt huyết.</li>
       <li><span class="nhan">CHECK — kiểm tra</span>: nhìn lại kết quả tới lúc này. Bạn có hài lòng với công việc, hay với chỗ mình đang đứng không? Thành quả thực tế so với ý định ban đầu ra sao?</li>
       <li><span class="nhan">ACT — hành động</span>: tiếp theo nên làm gì? Muốn đổi gì trong khâu hoạch định, thực hiện và kiểm tra?</li>
     </ul>
     <p><strong>PDCA là quá trình liên tục; đích đến là cải tiến không ngừng.</strong></p>
     <p class="meo">💡 Phần dùng được nhất là "lập kế hoạch nhỏ trước": một thử nghiệm hai tuần cho bạn một điều đúng còn hơn kế hoạch năm năm dựng trên phỏng đoán.</p>`),

  slide(D, 9, 'Analyzing your qualifications and job preferences',
    `<p class="y-chinh">🎯 Five things to write down about yourself before applying anywhere.</p>
     <ul>
       <li><span class="nhan">Individual profile</span></li>
       <li><span class="nhan">Education</span></li>
       <li><span class="nhan">Experience</span></li>
       <li><span class="nhan">References</span></li>
       <li><span class="nhan">Job preferences</span></li>
     </ul>
     <p class="meo">💡 These five are exactly the raw material for the résumé in Lesson 21–22. Doing this slide properly means the résumé is assembly, not invention.</p>`,
    `<p class="y-chinh">🎯 Năm thứ cần viết ra về bản thân trước khi nộp đơn đi đâu.</p>
     <ul>
       <li><span class="nhan">Hồ sơ cá nhân</span></li>
       <li><span class="nhan">Học vấn</span></li>
       <li><span class="nhan">Kinh nghiệm</span></li>
       <li><span class="nhan">Người tham chiếu</span></li>
       <li><span class="nhan">Nguyện vọng công việc</span></li>
     </ul>
     <p class="meo">💡 Năm thứ này đúng là nguyên liệu thô cho bản CV ở Bài 21–22. Làm slide này cho tử tế thì viết CV chỉ còn là lắp ghép, không phải nghĩ ra từ đầu.</p>`),

  slide(D, 10, 'Resources for the job search (1)',
    `<p class="y-chinh">🎯 Three resources, in the order the slide gives them.</p>
     <ul>
       <li><span class="nhan">Campus career centres</span></li>
       <li><span class="nhan">Networking contacts</span></li>
       <li><span class="nhan">The Internet</span></li>
     </ul>
     <p class="meo">💡 The order is not accidental: the campus centre already exists and is paid for, and networking reaches jobs before they are advertised online.</p>`,
    `<p class="y-chinh">🎯 Ba nguồn lực, theo đúng thứ tự slide nêu.</p>
     <ul>
       <li><span class="nhan">Trung tâm hướng nghiệp của trường</span></li>
       <li><span class="nhan">Mạng lưới quan hệ</span></li>
       <li><span class="nhan">Internet</span></li>
     </ul>
     <p class="meo">💡 Thứ tự này không ngẫu nhiên: trung tâm của trường thì đã có sẵn và học phí đã trả rồi, còn mạng lưới quan hệ chạm tới công việc trước khi nó được đăng tuyển trên mạng.</p>`),

  slide(D, 11, 'Resources for the job search (2)',
    `<p class="y-chinh">🎯 Four more resources.</p>
     <ul>
       <li>Newspaper and journal advertisements</li>
       <li>Private or government employment agencies</li>
       <li><span class="nhan">Web page profile</span></li>
       <li>Job and career fairs</li>
     </ul>
     <p class="meo">💡 "Web page profile" is the one that works while you sleep: a public profile is the only resource on this list that employers can find without you applying first.</p>`,
    `<p class="y-chinh">🎯 Bốn nguồn nữa.</p>
     <ul>
       <li>Quảng cáo trên báo và tạp chí</li>
       <li>Trung tâm giới thiệu việc làm tư nhân hoặc nhà nước</li>
       <li><span class="nhan">Hồ sơ cá nhân trên web</span></li>
       <li>Ngày hội việc làm</li>
     </ul>
     <p class="meo">💡 "Hồ sơ trên web" là thứ làm việc cả khi bạn ngủ: đó là nguồn duy nhất trong danh sách này mà nhà tuyển dụng tìm thấy bạn trước khi bạn kịp nộp đơn.</p>`),

  slide(D, 12, 'Top skills for the post-COVID era',
    `<p class="y-chinh">🎯 A slide on which skills the labour market is moving toward.</p>
     <p class="meo">💡 Whatever the specific list, note what this course has spent ten weeks on: working in groups, communicating, resolving conflict, presenting and writing. Those are the skills that survive changes in technology, which is the argument for a subject like SSG104 existing at all.</p>`,
    `<p class="y-chinh">🎯 Slide về những kỹ năng mà thị trường lao động đang hướng tới.</p>
     <p class="meo">💡 Danh sách cụ thể là gì đi nữa, hãy để ý mười tuần qua môn này dạy gì: làm việc nhóm, giao tiếp, hoá giải xung đột, thuyết trình và viết. Đó là những kỹ năng sống sót qua các đợt đổi thay công nghệ — và cũng là lý do tồn tại của một môn như SSG104.</p>`),

  slide(D, 13, 'A holistic approach to the labour market',
    `<p class="y-chinh">🎯 The quotation on the slide.</p>
     <p>"To address the substantial challenges facing the labour market today, governments must pursue a holistic approach, creating active linkages and coordination between education providers, skills, workers and employers, and ensuring effective collaboration between employment agencies, regional governments and national governments."</p>
     <p class="meo">💡 Read as a student, the useful part is the phrase "linkages between education providers and employers" — that is what internships, OJT and campus career fairs are, and they are the parts of your degree that convert directly into a first job.</p>`,
    `<p class="y-chinh">🎯 Câu trích trên slide.</p>
     <p>"Để giải quyết những thách thức lớn mà thị trường lao động đang đối mặt, các chính phủ phải theo đuổi cách tiếp cận tổng thể, tạo ra sự kết nối và phối hợp chủ động giữa các cơ sở đào tạo, kỹ năng, người lao động và người sử dụng lao động, đồng thời bảo đảm sự hợp tác hiệu quả giữa các trung tâm việc làm, chính quyền địa phương và chính quyền trung ương."</p>
     <p class="meo">💡 Đọc dưới góc nhìn sinh viên, phần dùng được là cụm "kết nối giữa cơ sở đào tạo và nhà tuyển dụng" — đó chính là thực tập, OJT và ngày hội việc làm ở trường, những phần của tấm bằng chuyển thẳng thành công việc đầu tiên.</p>`),

  slide(D, 14, 'Activity — campus to career',
    `<p class="y-chinh">🎯 Examine two critical questions about developing your career while still in college.</p>
     <ol>
       <li><strong>How do I prepare myself for a career while I am in college?</strong></li>
       <li><strong>How do I position myself to get ahead?</strong></li>
     </ol>
     <p class="meo">💡 Answer question 1 with the career roadmap (slide 6) and question 2 with PDCA (slide 8): position yourself by running small experiments now and checking the results, rather than waiting for graduation to start.</p>`,
    `<p class="y-chinh">🎯 Xem xét hai câu hỏi then chốt về phát triển sự nghiệp khi còn đi học.</p>
     <ol>
       <li><strong>Còn đang học đại học thì chuẩn bị cho sự nghiệp bằng cách nào?</strong></li>
       <li><strong>Định vị bản thân thế nào để tiến lên phía trước?</strong></li>
     </ol>
     <p class="meo">💡 Trả lời câu 1 bằng bản đồ nghề nghiệp (slide 6) và câu 2 bằng PDCA (slide 8): định vị bằng cách chạy những thử nghiệm nhỏ ngay bây giờ rồi kiểm kết quả, thay vì chờ tốt nghiệp mới bắt đầu.</p>`),

  slide(D, 15, 'Discussion continued',
    `<p class="y-chinh">🎯 Space for the group discussion of the two questions.</p>
     <p class="meo">💡 A concrete answer beats an ambitious one. "Join one project outside my coursework this semester and ask for feedback at the end" is a PDCA cycle; "work harder" is not.</p>`,
    `<p class="y-chinh">🎯 Chỗ dành cho phần thảo luận nhóm về hai câu hỏi.</p>
     <p class="meo">💡 Câu trả lời cụ thể hơn hẳn câu trả lời đầy tham vọng. "Kỳ này tham gia một dự án ngoài chương trình học và cuối kỳ xin nhận xét" là một vòng PDCA; "cố gắng hơn" thì không.</p>`),

  slide(D, 16, 'End of Lesson 20',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Five stages of career development — which one are you in?</li>
       <li>Four steps of the career roadmap, and why they are cyclical?</li>
       <li>PDCA — what does "check" actually compare?</li>
       <li>Three job-search resources you have not used yet?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Năm giai đoạn phát triển nghề nghiệp — bạn đang ở giai đoạn nào?</li>
       <li>Bốn bước của bản đồ nghề nghiệp, và vì sao chúng có tính chu kỳ?</li>
       <li>PDCA — bước "kiểm tra" thực chất đang so cái gì với cái gì?</li>
       <li>Ba nguồn tìm việc mà bạn chưa dùng tới?</li>
     </ol>`),

  books([
    ['lumen', 'chương Career Development — stages, roadmap, resources', 'chương Career Development — các giai đoạn, bản đồ, nguồn lực'],
    ['bc7', 'chương về career skills và employment communication', 'chương về kỹ năng nghề nghiệp và giao tiếp tuyển dụng'],
  ]),

  bi(
    `<h3>✅ What this adds</h3>
     <p>The syllabus gives session 45 to career development and skills, and asks CQ15.7 about PDCA. The old Academy course had one paragraph saying these skills are your career, with no stages, no roadmap and no PDCA at all.</p>`,
    `<h3>✅ Bài này bù thêm gì</h3>
     <p>Syllabus dành buổi 45 cho phát triển nghề nghiệp và kỹ năng nghề, và hỏi CQ15.7 về PDCA. Khoá Academy cũ chỉ có một đoạn nói rằng những kỹ năng này chính là sự nghiệp của bạn, không có giai đoạn, không có bản đồ, và hoàn toàn không có PDCA.</p>`),
].join('\n');
