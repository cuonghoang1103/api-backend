/**
 * Buổi 5 · Bài 23 — Job Interview Preparation (19 slide).
 *
 * Bám bộ "Session 5_..._Lesson 23_Job Interview Preparation.pptx". Syllabus
 * hỏi CQ17.1–17.6 về các kiểu phỏng vấn và loại câu hỏi; bản Academy cũ chỉ
 * nhắc chữ "interview" đúng một lần trong câu "phỏng vấn nào cũng hỏi về làm
 * việc nhóm". Đây cũng là tài liệu cho Group Assignment 2 (10%).
 *
 * Slide 16 (câu hỏi không được phép hỏi) là phần đáng giá nhất: nó bảo vệ
 * chính người đi phỏng vấn.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's5-l23';

export const b5l23 = [
  walkHead(D, 1, 19,
    'The last lesson of the course, and the most immediately usable. Three lists: seven interview types (slide 9), three question categories (slides 12–16), and the nine questions you will actually be asked (slide 17).',
    'Bài cuối của môn, và cũng là bài dùng được ngay nhất. Ba danh sách: bảy kiểu phỏng vấn (slide 9), ba nhóm câu hỏi (slide 12–16), và chín câu bạn thật sự sẽ bị hỏi (slide 17).'),

  slide(D, 1, 'Job Interview Preparation — Session V',
    `<p class="y-chinh">🎯 Title slide of the final lesson.</p>
     <p class="meo">💡 The syllabus runs Group Assignment 2 — a job interview — at sessions 50–51, worth 10%. This deck is the preparation for it.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề của bài cuối cùng.</p>
     <p class="meo">💡 Syllabus tổ chức Group Assignment 2 — một buổi phỏng vấn xin việc — ở buổi 50–51, trọng số 10%. Bộ slide này chính là phần chuẩn bị cho nó.</p>`),

  slide(D, 2, 'Chapter outline (3 parts)',
    `<p class="y-chinh">🎯 Three parts.</p>
     <ol>
       <li>Preparing effectively for a job interview</li>
       <li>Job interview types and techniques</li>
       <li>Interview questions</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba phần.</p>
     <ol>
       <li>Chuẩn bị hiệu quả cho một buổi phỏng vấn</li>
       <li>Các kiểu phỏng vấn và kỹ thuật tương ứng</li>
       <li>Câu hỏi phỏng vấn</li>
     </ol>`),

  slide(D, 3, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives.</p>
     <ol>
       <li>Describe effective strategies to <strong>prepare</strong> for an interview.</li>
       <li>Differentiate between different <strong>types</strong> of interview situations and identify appropriate techniques for each.</li>
       <li>Analyse different <strong>question types</strong> common in interviews.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu.</p>
     <ol>
       <li>Mô tả các chiến lược <strong>chuẩn bị</strong> hiệu quả cho buổi phỏng vấn.</li>
       <li>Phân biệt các <strong>kiểu</strong> tình huống phỏng vấn và chỉ ra kỹ thuật phù hợp cho từng kiểu.</li>
       <li>Phân tích các <strong>loại câu hỏi</strong> thường gặp trong phỏng vấn.</li>
     </ol>`),

  slide(D, 4, 'Opening quotation',
    `<p class="y-chinh">🎯 "One important key to success is <strong>self-confidence</strong>. An important key to self-confidence is <strong>preparation</strong>." — Arthur Ashe.</p>
     <p class="meo">💡 The chain matters for an interview specifically: you cannot decide to feel confident, but you can decide to prepare, and confidence follows from that.</p>`,
    `<p class="y-chinh">🎯 "Một chìa khoá quan trọng của thành công là <strong>sự tự tin</strong>. Một chìa khoá quan trọng của sự tự tin là <strong>sự chuẩn bị</strong>." — Arthur Ashe.</p>
     <p class="meo">💡 Chuỗi này đặc biệt đúng với phỏng vấn: bạn không thể quyết định mình sẽ thấy tự tin, nhưng bạn quyết định được việc chuẩn bị, và sự tự tin đi ra từ đó.</p>`),

  slide(D, 5, 'Preparing effectively for a job interview',
    `<p class="y-chinh">🎯 If your résumé and cover letter have served their purposes well, you will be invited to an interview with the company you are interested in.</p>
     <p class="meo">💡 Note the dependency: the interview is what the previous lesson's two documents were for. Each stage exists to earn the next one.</p>`,
    `<p class="y-chinh">🎯 Nếu CV và thư xin việc của bạn làm tròn nhiệm vụ, bạn sẽ được mời tới phỏng vấn ở nơi bạn nhắm tới.</p>
     <p class="meo">💡 Để ý quan hệ phụ thuộc: buổi phỏng vấn chính là thứ mà hai văn bản ở bài trước nhắm tới. Mỗi chặng tồn tại để giành lấy chặng kế tiếp.</p>`),

  slide(D, 6, 'Interviewing for a job — three headings',
    `<p class="y-chinh">🎯 The lesson's structure in three words.</p>
     <ul>
       <li><span class="nhan">Preparation</span> — before.</li>
       <li><span class="nhan">Participation</span> — during.</li>
       <li><span class="nhan">Types of interviews</span> — what you might walk into.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Cấu trúc bài gói trong ba từ.</p>
     <ul>
       <li><span class="nhan">Chuẩn bị</span> — trước buổi phỏng vấn.</li>
       <li><span class="nhan">Tham gia</span> — trong buổi phỏng vấn.</li>
       <li><span class="nhan">Các kiểu phỏng vấn</span> — thứ bạn có thể bước vào.</li>
     </ul>`),

  slide(D, 7, 'Steps for preparing effectively (6)',
    `<p class="y-chinh">🎯 Six preparation steps.</p>
     <ul>
       <li><span class="nhan">Review the job description</span> — it tells you which of your qualities to lead with.</li>
       <li><span class="nhan">Research the company or organisation</span>.</li>
       <li><span class="nhan">Practise answering common questions</span>.</li>
       <li><span class="nhan">Plan to dress appropriately</span>.</li>
       <li><span class="nhan">Come prepared</span> — bring what you need.</li>
       <li><span class="nhan">Be confident</span>.</li>
     </ul>
     <p class="meo">💡 Steps 1 and 2 are the ones that separate candidates: everyone practises answers, few can name what the company actually does and why this role exists.</p>`,
    `<p class="y-chinh">🎯 Sáu bước chuẩn bị.</p>
     <ul>
       <li><span class="nhan">Đọc kỹ mô tả công việc</span> — nó cho biết nên đưa phẩm chất nào của bạn lên trước.</li>
       <li><span class="nhan">Tìm hiểu về công ty hoặc tổ chức</span>.</li>
       <li><span class="nhan">Luyện trả lời các câu hỏi thường gặp</span>.</li>
       <li><span class="nhan">Chuẩn bị trang phục phù hợp</span>.</li>
       <li><span class="nhan">Đến nơi với sự chuẩn bị đầy đủ</span> — mang theo thứ cần mang.</li>
       <li><span class="nhan">Giữ sự tự tin</span>.</li>
     </ul>
     <p class="meo">💡 Bước 1 và 2 mới là chỗ phân loại ứng viên: ai cũng luyện câu trả lời, nhưng ít người nói được công ty đó thực sự làm gì và vì sao có vị trí này.</p>`),

  slide(D, 8, 'Participating in an interview (9 moves)',
    `<p class="y-chinh">🎯 The interview from door to door.</p>
     <ol class="hai-cot">
       <li>Greet the interviewer</li>
       <li>Shake hands</li>
       <li>Sit when asked</li>
       <li>Respond in a businesslike manner</li>
       <li>Maintain eye contact</li>
       <li>Be alert to signals the interview is ending</li>
       <li>Express appreciation for the time</li>
       <li><strong>Ask when you will receive notice of the decision</strong></li>
       <li>Shake hands</li>
     </ol>
     <p class="meo">💡 Items 5 and 6 are Lesson 14 in action: eye contact is the single most important facial gesture, and the closing signals are nonverbal before they are verbal.</p>`,
    `<p class="y-chinh">🎯 Buổi phỏng vấn từ lúc vào cửa tới lúc ra cửa.</p>
     <ol class="hai-cot">
       <li>Chào người phỏng vấn</li>
       <li>Bắt tay</li>
       <li>Ngồi khi được mời</li>
       <li>Trả lời theo phong thái công việc</li>
       <li>Giữ giao tiếp bằng mắt</li>
       <li>Để ý các dấu hiệu buổi phỏng vấn sắp kết thúc</li>
       <li>Cảm ơn vì đã dành thời gian</li>
       <li><strong>Hỏi khi nào sẽ có kết quả</strong></li>
       <li>Bắt tay</li>
     </ol>
     <p class="meo">💡 Mục 5 và 6 chính là Bài 14 đem ra dùng: giao tiếp bằng mắt là cử chỉ khuôn mặt quan trọng nhất, và tín hiệu kết thúc xuất hiện bằng phi ngôn ngữ trước khi thành lời.</p>`),

  slide(D, 9, 'Job interview types (7)',
    `<p class="y-chinh">🎯 Seven types — this is CQ17.1 territory.</p>
     <ul>
       <li><span class="nhan">Screening interviews</span> — a first filter, often short and factual.</li>
       <li><span class="nhan">Phone or web conference interviews</span> — no full nonverbal channel; voice carries everything.</li>
       <li><span class="nhan">One-on-one interviews</span> — the standard format.</li>
       <li><span class="nhan">Panel interviews</span> — several interviewers at once.</li>
       <li><span class="nhan">Serial interviews</span> — several interviews in sequence, often the same day.</li>
       <li><span class="nhan">Lunch interviews</span> — assessed while the setting looks social.</li>
       <li><span class="nhan">Group interviews</span> — several candidates together.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hai kiểu dễ bị đánh giá thấp:</strong> the lunch interview (you are being assessed the whole time, however relaxed it feels) and the group interview (how you treat the other candidates is part of the test — see Lesson 1 on teamwork).</p>`,
    `<p class="y-chinh">🎯 Bảy kiểu — chính là phạm vi CQ17.1.</p>
     <ul>
       <li><span class="nhan">Phỏng vấn sàng lọc</span> — vòng lọc đầu, thường ngắn và thiên về dữ kiện.</li>
       <li><span class="nhan">Phỏng vấn qua điện thoại hoặc trực tuyến</span> — không có đủ kênh phi ngôn ngữ; giọng nói gánh tất.</li>
       <li><span class="nhan">Phỏng vấn một-một</span> — hình thức chuẩn.</li>
       <li><span class="nhan">Phỏng vấn hội đồng</span> — nhiều người phỏng vấn cùng lúc.</li>
       <li><span class="nhan">Phỏng vấn nối tiếp</span> — nhiều vòng liên tiếp, thường trong cùng một ngày.</li>
       <li><span class="nhan">Phỏng vấn qua bữa trưa</span> — vẫn đang bị đánh giá dù khung cảnh trông như xã giao.</li>
       <li><span class="nhan">Phỏng vấn theo nhóm</span> — nhiều ứng viên cùng lúc.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Hai kiểu hay bị coi nhẹ:</strong> phỏng vấn bữa trưa (bạn bị đánh giá suốt, dù không khí có thoải mái tới đâu) và phỏng vấn nhóm (cách bạn đối xử với ứng viên khác cũng là một phần bài kiểm — xem lại Bài 1 về làm việc đội).</p>`),

  slide(D, 10, 'Activity — what makes you a great fit?',
    `<p class="y-chinh">🎯 Five questions to answer in writing before any interview.</p>
     <ol>
       <li>What is your job title and what are you responsible for executing?</li>
       <li>What is the name of the company or organisation? What is its function?</li>
       <li>Identify the <strong>top three reasons</strong> you are a great fit for this job.</li>
       <li>What sets you apart from the competition?</li>
       <li>List the qualities, skills and values you have that match the job requirements. <strong>Provide examples</strong> to support your answers, and connect your values to the company's values.</li>
     </ol>
     <p class="meo">💡 Question 5 is the whole activity: an unexampled claim ("I am a good team player") is worth nothing, and this is the sentence in the deck that says so.</p>`,
    `<p class="y-chinh">🎯 Năm câu cần trả lời bằng chữ trước bất kỳ buổi phỏng vấn nào.</p>
     <ol>
       <li>Chức danh của bạn là gì và bạn chịu trách nhiệm thực hiện những việc gì?</li>
       <li>Tên công ty hoặc tổ chức là gì? Nó hoạt động trong lĩnh vực nào?</li>
       <li>Nêu <strong>ba lý do hàng đầu</strong> khiến bạn hợp với công việc này.</li>
       <li>Điều gì khiến bạn khác với các ứng viên còn lại?</li>
       <li>Liệt kê những phẩm chất, kỹ năng, giá trị của bạn khớp với yêu cầu công việc. <strong>Đưa ví dụ</strong> chống lưng cho từng câu trả lời, và nối giá trị của bạn với giá trị của công ty.</li>
     </ol>
     <p class="meo">💡 Câu 5 chính là toàn bộ ý nghĩa của hoạt động này: một lời khẳng định không có ví dụ ("em là người làm việc nhóm tốt") thì chẳng có giá trị gì, và đây là câu trong bộ slide nói thẳng điều đó.</p>`),

  slide(D, 11, 'Interview questions — the three-step approach',
    `<p class="y-chinh">🎯 Three things to do about questions.</p>
     <ul>
       <li>Know the common questions to expect, and <strong>understand the intention behind each</strong>.</li>
       <li>Strategically craft a great answer for each question.</li>
       <li>Practise interviewing until you are as strong as possible.</li>
     </ul>
     <p class="meo">💡 The middle clause of the first point is the skill: "What is your greatest weakness?" is not asking for a weakness, it is testing self-awareness and honesty at the same time.</p>`,
    `<p class="y-chinh">🎯 Ba việc cần làm với các câu hỏi.</p>
     <ul>
       <li>Biết trước những câu hỏi thường gặp, và <strong>hiểu dụng ý đằng sau từng câu</strong>.</li>
       <li>Soạn sẵn một câu trả lời tốt cho mỗi câu hỏi, một cách có chiến lược.</li>
       <li>Luyện phỏng vấn cho tới khi bạn ở trạng thái mạnh nhất có thể.</li>
     </ul>
     <p class="meo">💡 Vế giữa của ý đầu tiên mới là kỹ năng: "Điểm yếu lớn nhất của bạn là gì?" không phải đang hỏi một điểm yếu, nó đang kiểm tra cùng lúc khả năng tự nhận thức và sự trung thực.</p>`),

  slide(D, 12, 'Three categories of question',
    `<p class="y-chinh">🎯 Be ready for three kinds.</p>
     <ul>
       <li><span class="nhan">Traditional questions</span></li>
       <li><span class="nhan">Behavioural interview questions</span></li>
       <li><span class="nhan">Unacceptable questions</span></li>
     </ul>
     <p class="meo">💡 The third category is unusual for a course to teach and the most valuable: knowing which questions are improper is what lets you handle one calmly instead of freezing.</p>`,
    `<p class="y-chinh">🎯 Hãy sẵn sàng cho ba loại.</p>
     <ul>
       <li><span class="nhan">Câu hỏi truyền thống</span></li>
       <li><span class="nhan">Câu hỏi theo hành vi</span></li>
       <li><span class="nhan">Câu hỏi không được phép hỏi</span></li>
     </ul>
     <p class="meo">💡 Loại thứ ba hiếm khi được dạy trong một môn học, mà lại giá trị nhất: biết câu nào là không đúng mực chính là thứ giúp bạn xử lý bình tĩnh thay vì đơ người.</p>`),

  slide(D, 13, 'Traditional questions (5)',
    `<p class="y-chinh">🎯 Five classic questions, with what each is really testing.</p>
     <ol>
       <li><span class="nhan">Tell me about yourself.</span> Tests whether you can summarise relevantly — this is your elevator speech from Lesson 15.</li>
       <li><span class="nhan">Your greatest strength? Your greatest weakness?</span> Tests self-awareness and honesty.</li>
       <li><span class="nhan">Tell me about your course work. Which courses did you like best? Least?</span> Tests motivation and fit.</li>
       <li><span class="nhan">Tell me about your extracurricular activities.</span> Tests initiative and teamwork outside requirements.</li>
       <li><span class="nhan">What job-related skills have you developed that are crucial to this job?</span> Tests whether you read the job description.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Năm câu kinh điển, kèm thứ mà mỗi câu thật sự đang kiểm.</p>
     <ol>
       <li><span class="nhan">Hãy giới thiệu về bản thân.</span> Kiểm xem bạn có tóm tắt đúng trọng tâm được không — chính là elevator speech ở Bài 15.</li>
       <li><span class="nhan">Điểm mạnh lớn nhất? Điểm yếu lớn nhất?</span> Kiểm khả năng tự nhận thức và sự trung thực.</li>
       <li><span class="nhan">Kể về các môn bạn đã học. Môn nào thích nhất? Ghét nhất?</span> Kiểm động lực và mức độ phù hợp.</li>
       <li><span class="nhan">Kể về hoạt động ngoại khoá của bạn.</span> Kiểm tinh thần chủ động và làm việc nhóm ngoài phạm vi bắt buộc.</li>
       <li><span class="nhan">Bạn đã phát triển kỹ năng nghề nào thiết yếu với công việc này?</span> Kiểm xem bạn có đọc mô tả công việc không.</li>
     </ol>`),

  slide(D, 14, 'Behavioural questions (5)',
    `<p class="y-chinh">🎯 Five behavioural questions, and every one of them is about a group.</p>
     <ol>
       <li>What major problem have you faced in <strong>group projects</strong> and how did you deal with it?</li>
       <li>Describe a situation in which you were successful — or unsuccessful — in <strong>motivating someone</strong>.</li>
       <li>Describe a situation at work or school where you <strong>took the initiative</strong>. What was the result? How did you feel?</li>
       <li>Describe the <strong>most difficult person</strong> you have worked with. How did you handle it?</li>
       <li>Give an example of a <strong>time management</strong> skill you learned and applied.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Đây là lý do SSG104 tồn tại:</strong> all five are answered from your group project in this very course — conflict (Lesson 12), leadership and motivation (Lesson 10), and the ten-week schedule. Keep notes while the project runs; you will need them at an interview.</p>`,
    `<p class="y-chinh">🎯 Năm câu hỏi theo hành vi, và cả năm đều xoay quanh chuyện nhóm.</p>
     <ol>
       <li>Vấn đề lớn nhất bạn gặp trong <strong>dự án nhóm</strong> là gì và bạn xử lý ra sao?</li>
       <li>Kể một tình huống bạn đã thành công — hoặc thất bại — trong việc <strong>tạo động lực cho người khác</strong>.</li>
       <li>Kể một tình huống ở nơi làm hoặc ở trường mà bạn <strong>chủ động đứng ra làm</strong>. Kết quả thế nào? Bạn cảm thấy ra sao?</li>
       <li>Kể về <strong>người khó làm việc cùng nhất</strong> mà bạn từng gặp. Bạn đã xoay xở thế nào?</li>
       <li>Cho một ví dụ về kỹ năng <strong>quản lý thời gian</strong> bạn học được và đã áp dụng.</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Đây chính là lý do môn SSG104 tồn tại:</strong> cả năm câu đều trả lời được bằng chính dự án nhóm của môn này — xung đột (Bài 12), lãnh đạo và tạo động lực (Bài 10), và lịch mười tuần. Hãy ghi chép trong lúc làm dự án; bạn sẽ cần tới chúng khi đi phỏng vấn.</p>`),

  slide(D, 15, 'Unacceptable questions (4)',
    `<p class="y-chinh">🎯 Four questions an interviewer should not ask.</p>
     <ol>
       <li>"You don't look like a native of this country. Where were you born?"</li>
       <li>"Do you have any disabilities?"</li>
       <li>"Where do you attend church?"</li>
       <li>"Do you have adequate child care? Who will look after your children while you work?"</li>
     </ol>
     <p><span class="nhan">What they have in common</span> — each asks about a characteristic that a hiring decision must not be based on: national origin, disability, religion, family status.</p>
     <p class="meo">💡 Same principle as the résumé prohibitions in Lesson 21–22 slide 15. If the information must not affect the decision, it should not be asked for — and a calm redirection ("I am confident I can meet the schedule this role requires") answers the legitimate concern without answering the improper question.</p>`,
    `<p class="y-chinh">🎯 Bốn câu mà người phỏng vấn không nên hỏi.</p>
     <ol>
       <li>"Trông bạn không giống người bản xứ. Bạn sinh ra ở đâu?"</li>
       <li>"Bạn có khuyết tật gì không?"</li>
       <li>"Bạn đi lễ ở đâu?"</li>
       <li>"Bạn thu xếp người trông con ổn chưa? Ai trông con khi bạn đi làm?"</li>
     </ol>
     <p><span class="nhan">Điểm chung của chúng</span> — mỗi câu đều hỏi về một đặc điểm mà quyết định tuyển dụng không được phép dựa vào: nguồn gốc quốc gia, tình trạng khuyết tật, tôn giáo, hoàn cảnh gia đình.</p>
     <p class="meo">💡 Cùng nguyên tắc với danh sách cấm trên CV ở slide 15 Bài 21–22. Nếu thông tin đó không được phép ảnh hưởng tới quyết định thì cũng không nên bị hỏi — và một câu chuyển hướng bình tĩnh ("Tôi tự tin đáp ứng được lịch làm việc mà vị trí này yêu cầu") trả lời đúng mối bận tâm chính đáng mà không trả lời câu hỏi không đúng mực.</p>`),

  slide(D, 16, 'Discussion — how to answer the nine questions',
    `<p class="y-chinh">🎯 Nine questions to work through in class.</p>
     <ol class="hai-cot">
       <li>Tell me about yourself</li>
       <li>Describe your current or most recent position</li>
       <li>Why are you looking for a new opportunity now?</li>
       <li>What are your strengths?</li>
       <li>What is your greatest weakness?</li>
       <li>Why do you want to work here?</li>
       <li>Where do you see yourself in five years?</li>
       <li>Why should we hire you?</li>
       <li><strong>Do you have any questions for me?</strong></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Câu số 9 không phải câu lịch sự:</strong> having no questions reads as having no interest. Prepare two, and make at least one about the work itself rather than about conditions.</p>`,
    `<p class="y-chinh">🎯 Chín câu hỏi để cùng mổ xẻ trên lớp.</p>
     <ol class="hai-cot">
       <li>Hãy giới thiệu về bản thân</li>
       <li>Mô tả công việc hiện tại hoặc gần nhất của bạn</li>
       <li>Vì sao lúc này bạn tìm cơ hội mới?</li>
       <li>Điểm mạnh của bạn là gì?</li>
       <li>Điểm yếu lớn nhất của bạn?</li>
       <li>Vì sao bạn muốn làm ở đây?</li>
       <li>Năm năm nữa bạn thấy mình ở đâu?</li>
       <li>Vì sao chúng tôi nên tuyển bạn?</li>
       <li><strong>Bạn có câu hỏi nào cho tôi không?</strong></li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Câu số 9 không phải câu hỏi xã giao:</strong> không có câu hỏi nào sẽ bị đọc thành không có hứng thú. Hãy chuẩn bị hai câu, và ít nhất một câu phải về chính công việc chứ không phải về chế độ.</p>`),

  slide(D, 17, 'Purpose of other employment communication (7)',
    `<p class="y-chinh">🎯 Seven other letters you will write around a job.</p>
     <ul>
       <li>Following up on an application</li>
       <li>Accepting an interview invitation</li>
       <li><strong>Following up an interview</strong></li>
       <li>Accepting employment</li>
       <li>Rejecting employment</li>
       <li>Expressing appreciation to references and others</li>
       <li>Resigning from a job</li>
     </ul>
     <p class="meo">💡 The third is the one candidates skip and the cheapest advantage available: a short thank-you note after the interview reaches a decision-maker while they are still deciding.</p>`,
    `<p class="y-chinh">🎯 Bảy loại thư khác bạn sẽ viết quanh chuyện việc làm.</p>
     <ul>
       <li>Hỏi thăm tiến độ sau khi nộp hồ sơ</li>
       <li>Nhận lời mời phỏng vấn</li>
       <li><strong>Gửi thư sau buổi phỏng vấn</strong></li>
       <li>Nhận lời mời làm việc</li>
       <li>Từ chối lời mời làm việc</li>
       <li>Cảm ơn người tham chiếu và những người đã giúp</li>
       <li>Xin nghỉ việc</li>
     </ul>
     <p class="meo">💡 Loại thứ ba là thứ ứng viên hay bỏ qua và cũng là lợi thế rẻ nhất có thể có: một lá thư cảm ơn ngắn sau phỏng vấn tới tay người quyết định đúng lúc họ còn đang cân nhắc.</p>`),

  slide(D, 18, 'Key takeaways (4)',
    `<p class="y-chinh">🎯 Four rules covering every document and conversation in Session V.</p>
     <ul>
       <li>Use <strong>simple, clear and direct</strong> language; get to the point immediately.</li>
       <li>Focus on <strong>the employer's needs</strong>.</li>
       <li>Maintain a balance between <strong>professionalism and friendliness</strong>.</li>
       <li>Demonstrate enthusiasm and confidence, <strong>but don't be presumptuous</strong>.</li>
     </ul>
     <p class="meo">💡 Rule 2 is the one that changes answers: "I want this job because it suits my goals" is about you; "your team is expanding into X and I have done Y" is about them.</p>`,
    `<p class="y-chinh">🎯 Bốn nguyên tắc phủ mọi văn bản và mọi cuộc trò chuyện trong Buổi V.</p>
     <ul>
       <li>Dùng ngôn ngữ <strong>đơn giản, rõ ràng, trực tiếp</strong>; vào thẳng vấn đề.</li>
       <li>Tập trung vào <strong>nhu cầu của nhà tuyển dụng</strong>.</li>
       <li>Giữ cân bằng giữa <strong>chuyên nghiệp và thân thiện</strong>.</li>
       <li>Thể hiện nhiệt huyết và tự tin, <strong>nhưng đừng tự cho là mình đã trúng tuyển</strong>.</li>
     </ul>
     <p class="meo">💡 Nguyên tắc 2 là thứ làm đổi cả câu trả lời: "em muốn công việc này vì nó hợp mục tiêu của em" là nói về mình; "đội của anh chị đang mở rộng sang mảng X và em từng làm Y" là nói về họ.</p>`),

  slide(D, 19, 'End of the course',
    `<p class="y-chinh">🎯 Final slide of SSG104.</p>
     <p><span class="nhan">The five sessions, in five lines</span></p>
     <ol>
       <li>A team is a cohesive, purposeful group, and cooperation is rational when the game repeats.</li>
       <li>Creative thinking generates; critical thinking judges; a proposal carries the result.</li>
       <li>Power lives in relationships, leadership is a relationship, and conflict has a process you can name.</li>
       <li>Presenting, meeting and writing are how group work reaches anyone outside the group.</li>
       <li>Your career is a cycle, and the interview questions you will face are about the group work you just did.</li>
     </ol>
     <p class="meo">💡 That last line is the argument of the whole subject: the group project was never only an assignment — it is the evidence you will be asked for.</p>`,
    `<p class="y-chinh">🎯 Slide cuối cùng của SSG104.</p>
     <p><span class="nhan">Năm buổi học, gói trong năm dòng</span></p>
     <ol>
       <li>Đội là nhóm gắn kết và có mục đích, và hợp tác là hợp lý khi ván chơi còn lặp lại.</li>
       <li>Tư duy sáng tạo sinh ra ý; tư duy phản biện phán xét; bản đề xuất chở kết quả đi.</li>
       <li>Quyền lực sống trong quan hệ, lãnh đạo là một mối quan hệ, và xung đột có một quy trình gọi tên được.</li>
       <li>Thuyết trình, họp hành và viết lách là cách công việc nhóm chạm tới người ngoài nhóm.</li>
       <li>Sự nghiệp của bạn là một vòng lặp, và những câu hỏi phỏng vấn bạn sắp gặp chính là về công việc nhóm bạn vừa làm.</li>
     </ol>
     <p class="meo">💡 Dòng cuối là luận điểm của cả môn học: dự án nhóm chưa bao giờ chỉ là một bài tập — nó là bằng chứng mà người ta sẽ hỏi bạn.</p>`),

  books([
    ['bcs', 'chương Interviewing for a Job — types, questions, follow-up', 'chương Interviewing for a Job — các kiểu, câu hỏi, thư theo sau'],
    ['lumen', 'chương Job Search — interview preparation', 'chương Job Search — chuẩn bị phỏng vấn'],
  ]),

  bi(
    `<h3>✅ The last gap, and the biggest</h3>
     <p>The syllabus gives sessions 49–51 to interview preparation and Group Assignment 2, and asks CQ17.1–17.6 about interview types and questions. In the old Academy course the word "interview" appeared exactly once, inside the sentence "in every job interview you will be asked about teamwork" — which was true, and was all it said.</p>`,
    `<h3>✅ Lỗ hổng cuối cùng, và cũng là lỗ hổng lớn nhất</h3>
     <p>Syllabus dành buổi 49–51 cho phần chuẩn bị phỏng vấn và Group Assignment 2, và hỏi CQ17.1–17.6 về các kiểu phỏng vấn cùng loại câu hỏi. Ở khoá Academy cũ, chữ "phỏng vấn" xuất hiện đúng một lần, trong câu "phỏng vấn xin việc nào bạn cũng sẽ bị hỏi về làm việc nhóm" — câu đó đúng, và đó là tất cả những gì nó nói.</p>`),
].join('\n');
