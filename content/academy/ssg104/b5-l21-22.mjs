/**
 * Buổi 5 · Bài 21–22 — Résumé & Cover Letter (31 slide).
 *
 * Bám bộ "Session 5_..._Lesson 21 _ 22_Resume _ Cover Letter.pptx". Syllabus
 * hỏi CQ16.3 (résumé) và CQ16.4 (cover letter); bản Academy cũ có 0 lần nhắc
 * "cover letter" và không có bài nào về CV. Đây cũng là bộ có nhiều điều CẤM
 * nhất — phần "Caution" ở slide 14 là thứ trực tiếp bảo vệ dữ liệu cá nhân
 * của chính bạn khi rải hồ sơ.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's5-l21-22';

export const b5l2122 = [
  walkHead(D, 1, 31,
    'Two documents, two halves. The résumé half ends with a list of nine things you must NOT put on a CV (slide 14); the cover letter half is built on the AIDA formula (slides 24–27) and a three-paragraph anatomy (slide 29).',
    'Hai văn bản, hai nửa. Nửa CV kết bằng danh sách chín thứ TUYỆT ĐỐI không đưa vào hồ sơ (slide 14); nửa thư xin việc dựng trên công thức AIDA (slide 24–27) và khung ba đoạn (slide 29).'),

  slide(D, 1, 'Résumé & Cover Letter — Session V',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 The syllabus spreads this across sessions 46–48: résumé, cover letter, then a practice session on both.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Syllabus trải phần này qua buổi 46–48: CV, thư xin việc, rồi một buổi thực hành cả hai.</p>`),

  slide(D, 2, 'Learning objectives (4)',
    `<p class="y-chinh">🎯 Four objectives — two about knowing, two about writing.</p>
     <ol>
       <li>Define the purpose and contents of a résumé.</li>
       <li>Identify characteristics of an <strong>effective résumé</strong>.</li>
       <li>Identify characteristics of an <strong>effective cover letter</strong>.</li>
       <li><strong>Write</strong> a student résumé and cover letter.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Bốn mục tiêu — hai về hiểu biết, hai về thực hành viết.</p>
     <ol>
       <li>Định nghĩa mục đích và nội dung của một bản CV.</li>
       <li>Chỉ ra đặc điểm của một <strong>CV hiệu quả</strong>.</li>
       <li>Chỉ ra đặc điểm của một <strong>thư xin việc hiệu quả</strong>.</li>
       <li><strong>Viết</strong> được CV và thư xin việc của sinh viên.</li>
     </ol>`),

  slide(D, 3, 'Chapter outline',
    `<p class="y-chinh">🎯 Two parts: 1. Résumé · 2. Cover letter.</p>`,
    `<p class="y-chinh">🎯 Hai phần: 1. CV · 2. Thư xin việc.</p>`),

  slide(D, 4, 'Opening quotation',
    `<p class="y-chinh">🎯 "The most important tool you have on a résumé is <strong>language</strong>." — Jay Samit.</p>
     <p class="meo">💡 Which is why Lesson 17's style revisions matter here: on a one-page document, obscured verbs and filler words cost you space you needed for evidence.</p>`,
    `<p class="y-chinh">🎯 "Công cụ quan trọng nhất bạn có trên một bản CV là <strong>ngôn từ</strong>." — Jay Samit.</p>
     <p class="meo">💡 Vì thế phần rà văn phong ở Bài 17 mới quan trọng ở đây: trên một trang giấy, động từ bị chôn và chữ độn lấy mất đúng chỗ bạn cần để đưa bằng chứng.</p>`),

  slide(D, 5, '1. Résumé',
    `<p class="y-chinh">🎯 Section divider, repeating the quotation.</p>`,
    `<p class="y-chinh">🎯 Slide phân mục, nhắc lại câu trích.</p>`),

  slide(D, 6, 'What is a résumé?',
    `<p class="y-chinh">🎯 Three statements, and the metaphor is the deck's own.</p>
     <ul>
       <li>A résumé is a <strong>"selfie" for business purposes</strong>.</li>
       <li>It is a written picture of who you are — a marketing tool, a selling tool, and a promotion of you as an ideal candidate for any job you are interested in.</li>
       <li>The word comes from the French <em>résumé</em>, meaning <strong>"a summary"</strong>.</li>
     </ul>
     <p class="meo">💡 Hold the two ideas together: it is a summary <em>and</em> a selling tool. Summary sets the length; selling sets what you choose to include.</p>`,
    `<p class="y-chinh">🎯 Ba ý, và phép ví von là của chính bộ slide.</p>
     <ul>
       <li>CV là một <strong>"tấm ảnh tự chụp" dùng cho mục đích công việc</strong>.</li>
       <li>Nó là bức chân dung bằng chữ về con người bạn — một công cụ tiếp thị, một công cụ chào bán, và là lời quảng bá bạn như ứng viên lý tưởng cho công việc bạn nhắm tới.</li>
       <li>Từ này đến từ tiếng Pháp <em>résumé</em>, nghĩa là <strong>"bản tóm tắt"</strong>.</li>
     </ul>
     <p class="meo">💡 Hãy giữ cả hai ý cùng lúc: nó vừa là bản tóm tắt <em>vừa</em> là công cụ chào bán. Tính tóm tắt quyết định độ dài; tính chào bán quyết định bạn chọn đưa gì vào.</p>`),

  slide(D, 7, 'Purpose and contents',
    `<p class="y-chinh">🎯 What a résumé holds.</p>
     <ul class="hai-cot">
       <li>Education</li>
       <li>Work experience</li>
       <li>Job-related skills</li>
       <li>Accomplishments</li>
       <li>Volunteer history</li>
       <li>Internships</li>
       <li>Residencies and more</li>
     </ul>
     <p class="meo">💡 "Volunteer history" is listed beside paid work for a reason: for a student it is often the only place with evidence of teamwork, deadlines and responsibility.</p>`,
    `<p class="y-chinh">🎯 Một bản CV chứa những gì.</p>
     <ul class="hai-cot">
       <li>Học vấn</li>
       <li>Kinh nghiệm làm việc</li>
       <li>Kỹ năng liên quan tới công việc</li>
       <li>Thành tích</li>
       <li>Hoạt động tình nguyện</li>
       <li>Thực tập</li>
       <li>Các chương trình lưu trú nghề và hơn thế</li>
     </ul>
     <p class="meo">💡 "Hoạt động tình nguyện" được xếp ngang với việc có lương là có lý do: với sinh viên, đó thường là chỗ duy nhất có bằng chứng về làm việc nhóm, deadline và tinh thần trách nhiệm.</p>`),

  slide(D, 8, 'Four résumé formats',
    `<p class="y-chinh">🎯 Four formats to choose between.</p>
     <ul>
       <li><span class="nhan">Reverse chronological</span> — most recent first. The default, and what most employers expect.</li>
       <li><span class="nhan">Functional</span> — organised by skill rather than by date. Useful when your experience is scattered or has gaps.</li>
       <li><span class="nhan">Hybrid</span> — skills summary on top, chronological history below.</li>
       <li><span class="nhan">Video, infographic and website résumé</span> — for fields where the format itself demonstrates the skill.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cảnh báo về loại thứ tư:</strong> a video or infographic CV shows design skill and hides searchable text. If the employer screens by software, an unusual format can remove you before a human sees it.</p>`,
    `<p class="y-chinh">🎯 Bốn định dạng CV để chọn.</p>
     <ul>
       <li><span class="nhan">Theo thời gian ngược</span> — mới nhất lên trước. Mặc định, và là thứ phần lớn nhà tuyển dụng trông đợi.</li>
       <li><span class="nhan">Theo chức năng</span> — sắp theo kỹ năng thay vì theo mốc thời gian. Hữu ích khi kinh nghiệm của bạn rời rạc hoặc có quãng trống.</li>
       <li><span class="nhan">Lai</span> — phần tóm tắt kỹ năng ở trên, lịch sử theo thời gian ở dưới.</li>
       <li><span class="nhan">CV video, infographic, website</span> — dành cho ngành mà bản thân định dạng đã chứng minh kỹ năng.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cảnh báo cho loại thứ tư:</strong> CV video hay infographic khoe được khả năng thiết kế nhưng giấu mất phần chữ tìm kiếm được. Nếu nhà tuyển dụng lọc bằng phần mềm, một định dạng lạ có thể loại bạn trước khi có người đọc.</p>`),

  slide(D, 9, 'Elements — opening and education',
    `<p class="y-chinh">🎯 Two blocks.</p>
     <p><span class="nhan">Opening</span> — heading · career objective · summary of qualifications.</p>
     <p><span class="nhan">Education</span> — most recent information first · name and location of each school · dates of attendance · degrees · major · achievements.</p>
     <p class="meo">💡 For a student with little work history, education carries the weight — so "achievements" is not optional filler, it is where your evidence lives.</p>`,
    `<p class="y-chinh">🎯 Hai khối.</p>
     <p><span class="nhan">Phần mở</span> — tiêu đề hồ sơ · mục tiêu nghề nghiệp · tóm tắt năng lực.</p>
     <p><span class="nhan">Học vấn</span> — thông tin mới nhất lên trước · tên và địa điểm từng trường · thời gian học · bằng cấp · chuyên ngành · thành tích.</p>
     <p class="meo">💡 Với sinh viên ít kinh nghiệm làm việc, phần học vấn gánh phần nặng — nên mục "thành tích" không phải chữ độn tuỳ chọn, đó là chỗ chứa bằng chứng của bạn.</p>`),

  slide(D, 10, 'Elements — experience, activities, references',
    `<p class="y-chinh">🎯 Three more blocks.</p>
     <p><span class="nhan">Experience</span> — dates of employment · job title · employer · employer's location · <strong>job responsibilities stated using action words and keywords</strong>.</p>
     <p><span class="nhan">Activities / honours / special skills</span> — special skills · computer competence · community service · published works · public presentations · military service · organisation memberships · special interests.</p>
     <p><span class="nhan">References</span> — positive, related to the prospective job and its requirements, with complete and easy-to-use contact information <strong>on a separate sheet</strong>. Who: previous employers, instructors.</p>
     <p class="pitfall co-tieu-de"><strong>"On a separate sheet" có lý do bảo mật:</strong> referees' phone numbers are other people's personal data. Keep them off the document you send to dozens of companies.</p>`,
    `<p class="y-chinh">🎯 Ba khối nữa.</p>
     <p><span class="nhan">Kinh nghiệm</span> — thời gian làm việc · chức danh · nơi làm · địa điểm · <strong>mô tả trách nhiệm bằng động từ hành động và từ khoá</strong>.</p>
     <p><span class="nhan">Hoạt động / khen thưởng / kỹ năng đặc biệt</span> — kỹ năng riêng · năng lực tin học · phục vụ cộng đồng · bài viết đã đăng · các buổi trình bày trước công chúng · nghĩa vụ quân sự · thành viên các tổ chức · mối quan tâm riêng.</p>
     <p><span class="nhan">Người tham chiếu</span> — tích cực, liên quan tới công việc ứng tuyển và yêu cầu của nó, kèm thông tin liên hệ đầy đủ, dễ dùng, <strong>để trên một tờ riêng</strong>. Ai: chủ cũ, giảng viên.</p>
     <p class="pitfall co-tieu-de"><strong>"Để trên tờ riêng" có lý do bảo mật:</strong> số điện thoại người tham chiếu là dữ liệu cá nhân của người khác. Đừng để nó trên tài liệu bạn gửi cho hàng chục công ty.</p>`),

  slide(D, 11, 'Avoid — five things',
    `<p class="y-chinh">🎯 Five things to keep off a résumé.</p>
     <ul>
       <li><span class="nhan">Typos and spelling mistakes</span>.</li>
       <li><span class="nhan">Discrimination-related content</span> — religion, politics, gender, marital status, colour, race.</li>
       <li><span class="nhan">Too much for the eyes</span>.</li>
       <li><span class="nhan">Sensitive or non-job-related photos</span>.</li>
       <li><span class="nhan">Abbreviations</span>.</li>
     </ul>
     <p class="meo">💡 The second item protects you as much as the employer: information a hiring decision must not be based on should not be on the page at all.</p>`,
    `<p class="y-chinh">🎯 Năm thứ phải tránh trên CV.</p>
     <ul>
       <li><span class="nhan">Lỗi gõ và lỗi chính tả</span>.</li>
       <li><span class="nhan">Nội dung dễ dẫn tới phân biệt đối xử</span> — tôn giáo, chính trị, giới tính, tình trạng hôn nhân, màu da, chủng tộc.</li>
       <li><span class="nhan">Quá rối mắt</span>.</li>
       <li><span class="nhan">Ảnh nhạy cảm hoặc ảnh không liên quan tới công việc</span>.</li>
       <li><span class="nhan">Từ viết tắt</span>.</li>
     </ul>
     <p class="meo">💡 Mục thứ hai bảo vệ bạn không kém gì bảo vệ nhà tuyển dụng: thứ mà quyết định tuyển dụng không được phép dựa vào thì tốt nhất đừng có mặt trên trang giấy.</p>`),

  slide(D, 12, 'Refining your résumé',
    `<p class="y-chinh">🎯 Seven refinements.</p>
     <ul>
       <li>Print on light-coloured paper with a laser printer.</li>
       <li>Arrange information simply but attractively.</li>
       <li><strong>Use action verbs and strong phrases.</strong></li>
       <li>Show a <strong>clear match between your qualifications and the job requirements</strong>.</li>
       <li>Ask for a peer review.</li>
       <li>Proofread carefully.</li>
       <li>Use a summary of qualifications to highlight accomplishments.</li>
     </ul>
     <p class="meo">💡 Item 4 is why one generic CV underperforms: the match has to be visible <em>for this job</em>, which usually means reordering rather than rewriting.</p>`,
    `<p class="y-chinh">🎯 Bảy cách trau chuốt.</p>
     <ul>
       <li>In trên giấy màu sáng bằng máy in laser.</li>
       <li>Sắp xếp thông tin đơn giản mà vẫn đẹp mắt.</li>
       <li><strong>Dùng động từ hành động và cụm từ mạnh.</strong></li>
       <li>Cho thấy <strong>sự khớp rõ ràng giữa năng lực của bạn và yêu cầu công việc</strong>.</li>
       <li>Nhờ người khác đọc góp ý.</li>
       <li>Soát lỗi kỹ.</li>
       <li>Dùng phần tóm tắt năng lực để làm nổi thành tích.</li>
     </ul>
     <p class="meo">💡 Mục 4 là lý do một bản CV dùng chung cho mọi nơi luôn kém hiệu quả: sự khớp phải nhìn thấy được <em>với đúng công việc này</em>, và thường chỉ cần sắp xếp lại chứ không phải viết lại.</p>`),

  slide(D, 13, 'Résumé contents and structure (7 sections)',
    `<p class="y-chinh">🎯 The full structure, section by section.</p>
     <ol>
       <li><span class="nhan">Contact information</span> — name, address, phone number, <strong>professional email address</strong>.</li>
       <li><span class="nhan">Summary of skills</span> — 5–10 skills gained in your field; hard skills as well as soft skills.</li>
       <li><span class="nhan">Work experience</span> — title, employer's name, location, employment dates.</li>
       <li><span class="nhan">Volunteer experience</span>.</li>
       <li><span class="nhan">Education and training</span> — formal and informal: degrees, professional development, certificates, internships.</li>
       <li><span class="nhan">References statement (optional)</span> — "References available upon request" is standard, though often implied.</li>
       <li><span class="nhan">Other sections</span> — job objective, brief profile, branding statement, summary statement, additional accomplishments.</li>
     </ol>
     <p class="meo">💡 "Professional email address" is a small line with real consequences: an address that was funny at sixteen is the first thing a recruiter sees.</p>`,
    `<p class="y-chinh">🎯 Cấu trúc đầy đủ, từng mục một.</p>
     <ol>
       <li><span class="nhan">Thông tin liên hệ</span> — họ tên, địa chỉ, số điện thoại, <strong>email chuyên nghiệp</strong>.</li>
       <li><span class="nhan">Tóm tắt kỹ năng</span> — 5–10 kỹ năng có được trong lĩnh vực của bạn; cả kỹ năng cứng lẫn kỹ năng mềm.</li>
       <li><span class="nhan">Kinh nghiệm làm việc</span> — chức danh, tên nơi làm, địa điểm, thời gian.</li>
       <li><span class="nhan">Kinh nghiệm tình nguyện</span>.</li>
       <li><span class="nhan">Học vấn và đào tạo</span> — cả chính quy lẫn phi chính quy: bằng cấp, các khoá phát triển nghề, chứng chỉ, thực tập.</li>
       <li><span class="nhan">Dòng về người tham chiếu (tuỳ chọn)</span> — "Sẽ cung cấp khi được yêu cầu" là câu chuẩn, dù thường đã được ngầm hiểu.</li>
       <li><span class="nhan">Các mục khác</span> — mục tiêu công việc, hồ sơ tóm tắt, tuyên ngôn cá nhân, phần tóm lược, thành tích bổ sung.</li>
     </ol>
     <p class="meo">💡 "Email chuyên nghiệp" là một dòng nhỏ mà hệ quả thật: cái địa chỉ email hồi mười sáu tuổi thấy vui lại là thứ nhà tuyển dụng nhìn thấy đầu tiên.</p>`),

  slide(D, 14, 'Top ten tips for a successful résumé',
    `<p class="y-chinh">🎯 Ten tips.</p>
     <ol class="hai-cot">
       <li>Aim for 1–2 pages, letter size</li>
       <li>Make it visually appealing</li>
       <li>Use action verbs and phrases</li>
       <li>Proofread — no spelling, grammar or typing errors</li>
       <li>Include highlights of qualifications or skills</li>
       <li>Craft it as a pitch to people in your intended profession</li>
       <li>Stand out as different, courageous</li>
       <li><strong>Be positive and reflect only the truth</strong></li>
       <li>Be excited and optimistic about your prospects</li>
       <li>Keep refining — it is an ongoing project</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Tip 8 nối thẳng về Bài 15:</strong> "reflect only the truth" is the eleven ethical points applied to your own history. An exaggerated CV is the same failure as an exaggerated proposal.</p>`,
    `<p class="y-chinh">🎯 Mười lời khuyên.</p>
     <ol class="hai-cot">
       <li>Nhắm 1–2 trang, khổ giấy thư</li>
       <li>Trình bày bắt mắt</li>
       <li>Dùng động từ và cụm từ hành động</li>
       <li>Soát lỗi — không lỗi chính tả, ngữ pháp, gõ nhầm</li>
       <li>Làm nổi các điểm mạnh về năng lực, kỹ năng</li>
       <li>Viết như một lời chào hàng gửi người trong nghề bạn nhắm tới</li>
       <li>Nổi bật, dám khác biệt</li>
       <li><strong>Tích cực nhưng chỉ phản ánh sự thật</strong></li>
       <li>Hào hứng và lạc quan về cơ hội của mình</li>
       <li>Liên tục trau chuốt — đây là việc làm dài hạn</li>
     </ol>
     <p class="pitfall co-tieu-de"><strong>Lời khuyên 8 nối thẳng về Bài 15:</strong> "chỉ phản ánh sự thật" chính là mười một điều đạo đức đem áp vào lịch sử của chính bạn. CV phóng đại là cùng một lỗi với bản đề xuất phóng đại.</p>`),

  slide(D, 15, 'Caution — nine things never to include',
    `<p class="y-chinh">🎯 The prohibition list. <strong>Do not:</strong></p>
     <ul>
       <li>Mention your <strong>age, gender, height or weight</strong>.</li>
       <li>Include your <strong>social security / national ID number</strong>.</li>
       <li>Mention religious beliefs or political affiliations, unless relevant to the position.</li>
       <li>Include a <strong>photograph</strong> of yourself or a physical description.</li>
       <li>Mention health issues.</li>
       <li>Use first-person references (I, me).</li>
       <li>Include wage or salary expectations.</li>
       <li>Use abbreviations.</li>
       <li>Leave any spelling mistake — absolutely none are acceptable.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Điều số 2 là điều nghiêm trọng nhất:</strong> a CV is copied, forwarded and stored by people you never meet. A national ID number on it is an identity-theft risk that no job application needs you to take.</p>`,
    `<p class="y-chinh">🎯 Danh sách cấm. <strong>Không được:</strong></p>
     <ul>
       <li>Nêu <strong>tuổi, giới tính, chiều cao, cân nặng</strong>.</li>
       <li>Đưa <strong>số bảo hiểm xã hội / số căn cước</strong>.</li>
       <li>Nêu tín ngưỡng hay lập trường chính trị, trừ khi liên quan trực tiếp tới vị trí ứng tuyển.</li>
       <li>Đính <strong>ảnh chân dung</strong> hay mô tả ngoại hình.</li>
       <li>Nêu vấn đề sức khoẻ.</li>
       <li>Dùng đại từ ngôi thứ nhất (tôi, mình).</li>
       <li>Ghi mức lương mong muốn.</li>
       <li>Dùng từ viết tắt.</li>
       <li>Để sót lỗi chính tả — tuyệt đối không chấp nhận cái nào.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Điều số 2 là nghiêm trọng nhất:</strong> một bản CV bị sao chép, chuyển tiếp và lưu trữ bởi những người bạn chưa từng gặp. Để số căn cước lên đó là rủi ro bị đánh cắp danh tính mà chẳng đơn xin việc nào đòi bạn phải chịu.</p>`),

  slide(D, 16, 'Your résumé: it\'s like online dating',
    `<p class="y-chinh">🎯 The deck's closing metaphor for the résumé half.</p>
     <p class="meo">💡 The comparison earns its place: both are a short, self-written summary read quickly by someone deciding whether to spend more time on you. Both fail for the same two reasons — being generic, and being untrue.</p>`,
    `<p class="y-chinh">🎯 Phép ví von khép lại nửa CV của bộ slide.</p>
     <p class="meo">💡 So sánh này xứng đáng có chỗ: cả hai đều là bản tự giới thiệu ngắn, được đọc lướt bởi một người đang quyết xem có nên dành thêm thời gian cho bạn không. Và cả hai đều hỏng vì đúng hai lý do — chung chung, và không thật.</p>`),

  slide(D, 17, 'Activity — create your résumé',
    `<p class="y-chinh">🎯 A graded activity with a full procedure.</p>
     <p><span class="nhan">Objectives</span> — compile data on your professional and educational skills; assess the main résumé formats and select one; create a first draft.</p>
     <p><span class="nhan">Directions</span></p>
     <ol>
       <li>Compile everything: contact information, summary of skills, work and volunteer experience, education and training.</li>
       <li>Select one of the résumé builder tools listed in the course.</li>
       <li>Create your résumé following that site's instructions.</li>
       <li><strong>Save as a PDF file.</strong></li>
       <li>Follow your instructor's instructions for submitting.</li>
     </ol>
     <p class="meo">💡 Step 4 matters technically: a PDF keeps your layout on someone else's computer. A .docx re-flows and can arrive looking broken.</p>`,
    `<p class="y-chinh">🎯 Hoạt động tính điểm, có quy trình đầy đủ.</p>
     <p><span class="nhan">Mục tiêu</span> — gom dữ liệu về kỹ năng nghề nghiệp và học vấn; đánh giá các định dạng CV chính rồi chọn một; dựng bản nháp đầu tiên.</p>
     <p><span class="nhan">Các bước</span></p>
     <ol>
       <li>Gom đủ mọi thứ: thông tin liên hệ, tóm tắt kỹ năng, kinh nghiệm làm việc và tình nguyện, học vấn và đào tạo.</li>
       <li>Chọn một công cụ dựng CV trong danh sách của môn học.</li>
       <li>Tạo CV theo hướng dẫn của trang đó.</li>
       <li><strong>Lưu thành file PDF.</strong></li>
       <li>Nộp theo hướng dẫn của giảng viên.</li>
     </ol>
     <p class="meo">💡 Bước 4 quan trọng về mặt kỹ thuật: PDF giữ nguyên bố cục trên máy người khác. File .docx sẽ tự giãn dòng và có thể tới nơi trong tình trạng vỡ hết.</p>`),

  slide(D, 18, '2. Cover letter',
    `<p class="y-chinh">🎯 Second half of the deck begins.</p>
     <p>"Cover letters matter. When you have to go through a pile of them, they are probably <strong>more important than the résumé itself</strong>."</p>
     <p class="meo">💡 The reason is sorting: when fifty résumés list similar degrees, the letter is the only part that says why <em>this</em> applicant wants <em>this</em> job.</p>`,
    `<p class="y-chinh">🎯 Nửa sau của bộ slide bắt đầu.</p>
     <p>"Thư xin việc rất quan trọng. Khi phải lật qua cả chồng hồ sơ, có lẽ nó còn <strong>quan trọng hơn cả bản CV</strong>."</p>
     <p class="meo">💡 Lý do nằm ở khâu sàng lọc: khi năm mươi bản CV đều liệt kê những tấm bằng na ná nhau, lá thư là phần duy nhất nói được vì sao <em>ứng viên này</em> muốn <em>công việc này</em>.</p>`),

  slide(D, 19, 'What a cover letter is',
    `<p class="y-chinh">🎯 Two definitions in one slide.</p>
     <ul>
       <li>A cover letter <strong>introduces you to an employer and explains why you are suited for a position</strong>.</li>
       <li>It is a <strong>marketing tool</strong> that highlights your most attractive qualifications as a potential employee.</li>
     </ul>
     <p class="meo">💡 The résumé lists what you have done; the letter argues what it means for this employer. That division of labour is the whole reason both documents exist.</p>`,
    `<p class="y-chinh">🎯 Hai định nghĩa trong một slide.</p>
     <ul>
       <li>Thư xin việc <strong>giới thiệu bạn với nhà tuyển dụng và giải thích vì sao bạn hợp với vị trí đó</strong>.</li>
       <li>Nó là <strong>công cụ tiếp thị</strong> làm nổi những năng lực hấp dẫn nhất của bạn với tư cách một nhân sự tiềm năng.</li>
     </ul>
     <p class="meo">💡 CV liệt kê bạn đã làm gì; lá thư lập luận rằng những điều đó có nghĩa gì với nhà tuyển dụng này. Chính sự phân vai đó là lý do cả hai văn bản cùng tồn tại.</p>`),

  slide(D, 20, 'Characteristics of an effective cover letter (1)',
    `<p class="y-chinh">🎯 Five things an effective letter does.</p>
     <ul>
       <li>Get the attention of the prospective employer.</li>
       <li>Set you apart from any possible competition.</li>
       <li><strong>Identify the position</strong> you are interested in.</li>
       <li><strong>Specify how you learned</strong> about the position or company.</li>
       <li>Present highlights of your skills and accomplishments.</li>
     </ul>
     <p class="meo">💡 Point 4 is easy to skip and quietly powerful: naming a referral, an event or a specific advertisement proves you did not mass-send this letter.</p>`,
    `<p class="y-chinh">🎯 Năm việc mà một lá thư hiệu quả làm được.</p>
     <ul>
       <li>Thu hút được sự chú ý của nhà tuyển dụng tiềm năng.</li>
       <li>Tách bạn khỏi những đối thủ có thể có.</li>
       <li><strong>Nêu rõ vị trí</strong> bạn quan tâm.</li>
       <li><strong>Nói rõ bạn biết tới</strong> vị trí hoặc công ty đó từ đâu.</li>
       <li>Nêu bật những điểm mạnh về kỹ năng và thành tích.</li>
     </ul>
     <p class="meo">💡 Điểm 4 dễ bị bỏ qua mà lại lợi hại một cách âm thầm: nhắc tên người giới thiệu, một sự kiện hay một tin tuyển dụng cụ thể là bằng chứng bạn không gửi hàng loạt lá thư này.</p>`),

  slide(D, 21, 'Characteristics of an effective cover letter (2)',
    `<p class="y-chinh">🎯 Five more.</p>
     <ul>
       <li>Reflect your <strong>genuine interest</strong>.</li>
       <li>Please the eye and the ear.</li>
       <li>Give complete information for comparison against the skills required for the position.</li>
       <li><strong>Integrity (accuracy) of the information.</strong></li>
       <li>Legibility of the application.</li>
     </ul>
     <p class="meo">💡 "Please the ear" is not decoration: recruiters subvocalise while reading. A sentence that is hard to say aloud is hard to read quickly.</p>`,
    `<p class="y-chinh">🎯 Năm điểm nữa.</p>
     <ul>
       <li>Thể hiện <strong>sự quan tâm chân thành</strong>.</li>
       <li>Đẹp mắt và xuôi tai.</li>
       <li>Cung cấp đủ thông tin để đối chiếu với những kỹ năng mà vị trí đòi hỏi.</li>
       <li><strong>Tính chính trực (độ chính xác) của thông tin.</strong></li>
       <li>Hồ sơ dễ đọc.</li>
     </ul>
     <p class="meo">💡 "Xuôi tai" không phải chuyện trang trí: người tuyển dụng đọc thầm trong đầu. Câu nào khó đọc thành tiếng thì cũng khó đọc nhanh.</p>`),

  slide(D, 22, 'Example of a student cover letter',
    `<p class="y-chinh">🎯 A worked example for a student applicant.</p>
     <p class="meo">💡 Read it for structure, not for sentences to copy. A letter that reads like a template is the thing the previous slide's "genuine interest" is supposed to prevent.</p>`,
    `<p class="y-chinh">🎯 Một mẫu thư xin việc hoàn chỉnh của sinh viên.</p>
     <p class="meo">💡 Hãy đọc để lấy cấu trúc, đừng đọc để chép câu. Lá thư nghe như mẫu có sẵn chính là thứ mà "sự quan tâm chân thành" ở slide trước muốn ngăn lại.</p>`),

  slide(D, 23, 'College graduate cover letter example',
    `<p class="y-chinh">🎯 A second example, for a graduate rather than a current student.</p>
     <p class="meo">💡 Compare the two: the student letter leans on coursework and activities, the graduate letter on the degree and any internship. Both use the same three-paragraph shape from slide 29.</p>`,
    `<p class="y-chinh">🎯 Mẫu thứ hai, dành cho người đã tốt nghiệp thay vì sinh viên đang học.</p>
     <p class="meo">💡 Hãy so hai mẫu: thư sinh viên dựa vào môn học và hoạt động, thư cử nhân dựa vào tấm bằng và kỳ thực tập. Cả hai đều dùng chung khuôn ba đoạn ở slide 29.</p>`),

  slide(D, 24, 'LinkedIn as a resource',
    `<p class="y-chinh">🎯 The slide points to LinkedIn for articles, experts and jobs.</p>
     <p class="meo">💡 This is the "web page profile" from Lesson 20 slide 11 made concrete. Treat the profile as a living résumé: it is the version employers find without you applying.</p>`,
    `<p class="y-chinh">🎯 Slide giới thiệu LinkedIn như nguồn bài viết, chuyên gia và việc làm.</p>
     <p class="meo">💡 Đây chính là "hồ sơ cá nhân trên web" ở slide 11 Bài 20, được cụ thể hoá. Hãy coi hồ sơ đó như một bản CV sống: đó là phiên bản nhà tuyển dụng tìm thấy mà bạn không cần nộp đơn.</p>`),

  slide(D, 25, 'An application letter achieves: AIDA',
    `<p class="y-chinh">🎯 Four stages, in order: <strong>Attention → Interest → Desire → Action</strong>.</p>
     <p class="meo">💡 AIDA comes from advertising and is used here because a cover letter has the same job: move a reader from noticing to doing, in one page.</p>`,
    `<p class="y-chinh">🎯 Bốn giai đoạn, theo thứ tự: <strong>Chú ý → Quan tâm → Mong muốn → Hành động</strong>.</p>
     <p class="meo">💡 AIDA vốn từ ngành quảng cáo, được dùng ở đây vì thư xin việc làm đúng một việc: đưa người đọc từ chỗ để ý tới chỗ hành động, trong một trang giấy.</p>`),

  slide(D, 26, 'AIDA — attention and interest',
    `<p class="y-chinh">🎯 The first two stages unpacked.</p>
     <p><span class="nhan">Attention</span></p>
     <ul>
       <li>Gain favourable attention.</li>
       <li>Express interest in the position.</li>
       <li>Motivate the receiver to read the entire letter.</li>
     </ul>
     <p><span class="nhan">Interest</span></p>
     <ul>
       <li>Market your qualifications.</li>
       <li>Identify special strengths and attributes, and <strong>relate how they meet the job requirements</strong>.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Hai giai đoạn đầu được mổ xẻ.</p>
     <p><span class="nhan">Chú ý</span></p>
     <ul>
       <li>Tạo được thiện cảm ban đầu.</li>
       <li>Bày tỏ sự quan tâm tới vị trí ứng tuyển.</li>
       <li>Khiến người nhận muốn đọc hết lá thư.</li>
     </ul>
     <p><span class="nhan">Quan tâm</span></p>
     <ul>
       <li>Giới thiệu năng lực của bạn.</li>
       <li>Nêu những thế mạnh riêng, và <strong>chỉ rõ chúng đáp ứng yêu cầu công việc ra sao</strong>.</li>
     </ul>`),

  slide(D, 27, 'AIDA — desire and action',
    `<p class="y-chinh">🎯 The last two stages.</p>
     <p><span class="nhan">Desire</span></p>
     <ul>
       <li>Describe selected accomplishments that show <strong>how you can benefit the company</strong>.</li>
       <li>Motivate the receiver to look closely at your résumé.</li>
     </ul>
     <p><span class="nhan">Action</span></p>
     <ul>
       <li><strong>Request an interview</strong> or propose a future meeting.</li>
       <li>Provide easy-to-use contact information.</li>
       <li>Suggest scheduling alternatives.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Không có phần Action thì lá thư chỉ là lời giới thiệu:</strong> the same failure as an elevator speech without a call for action (Lesson 15 slide 15).</p>`,
    `<p class="y-chinh">🎯 Hai giai đoạn cuối.</p>
     <p><span class="nhan">Mong muốn</span></p>
     <ul>
       <li>Kể vài thành tích chọn lọc cho thấy <strong>bạn mang lại lợi ích gì cho công ty</strong>.</li>
       <li>Khiến người nhận muốn xem kỹ bản CV của bạn.</li>
     </ul>
     <p><span class="nhan">Hành động</span></p>
     <ul>
       <li><strong>Đề nghị một buổi phỏng vấn</strong> hoặc một cuộc gặp trong tương lai.</li>
       <li>Cung cấp thông tin liên hệ dễ dùng.</li>
       <li>Gợi ý vài phương án về lịch hẹn.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Thiếu phần Hành động thì lá thư chỉ là lời tự giới thiệu:</strong> đúng kiểu hỏng của một elevator speech không có lời kêu gọi hành động (slide 15 Bài 15).</p>`),

  slide(D, 28, 'Anatomy of a cover letter',
    `<p class="y-chinh">🎯 The basic formula, paragraph by paragraph.</p>
     <ul>
       <li><span class="nhan">Address block</span> — standard business letter format: prospect name, title, company, address, top left.</li>
       <li><span class="nhan">Salutation</span> — yes, it should be to a <strong>real person</strong>; take the time to know your target.</li>
       <li><span class="nhan">First paragraph</span> — why you are writing: to meet that company's <strong>specific needs</strong>.</li>
       <li><span class="nhan">Second paragraph</span> — two or three top skills from your résumé summary, then immediately the <strong>benefits</strong> those skills bring the company.</li>
       <li><span class="nhan">Third paragraph</span> — close. Not just an ending but a "sales closer": give a <strong>specific action</strong> for the contact to take, and a <strong>backup action you will take</strong> if there is no response.</li>
     </ul>
     <p class="meo">💡 The backup action is the part almost nobody writes: "I will follow up by phone next Tuesday" turns a hope into a plan.</p>`,
    `<p class="y-chinh">🎯 Công thức cơ bản, theo từng đoạn.</p>
     <ul>
       <li><span class="nhan">Khối địa chỉ</span> — theo chuẩn thư công việc: tên người nhận, chức danh, công ty, địa chỉ, đặt ở góc trên bên trái.</li>
       <li><span class="nhan">Lời chào</span> — đúng vậy, phải gửi tới <strong>một con người có thật</strong>; hãy bỏ công tìm hiểu xem mình đang viết cho ai.</li>
       <li><span class="nhan">Đoạn một</span> — vì sao bạn viết: để đáp ứng <strong>nhu cầu cụ thể</strong> của công ty đó.</li>
       <li><span class="nhan">Đoạn hai</span> — hai hoặc ba kỹ năng mạnh nhất lấy từ phần tóm tắt trong CV, rồi nêu ngay <strong>lợi ích</strong> mà những kỹ năng đó mang lại cho công ty.</li>
       <li><span class="nhan">Đoạn ba</span> — chốt. Không chỉ là kết thư mà là cú "chốt đơn": đưa ra một <strong>hành động cụ thể</strong> cho người nhận, và một <strong>hành động dự phòng bạn sẽ làm</strong> nếu không nhận được hồi âm.</li>
     </ul>
     <p class="meo">💡 Hành động dự phòng là phần gần như không ai viết: "Tôi sẽ gọi lại vào thứ Ba tuần sau" biến một niềm hy vọng thành một kế hoạch.</p>`),

  slide(D, 29, 'Anatomy of a cover letter (repeated)',
    `<p class="y-chinh">🎯 The same formula shown again — the lecturer repeats it deliberately.</p>
     <p class="meo">💡 If one slide in this deck is worth copying into your notes verbatim, it is this one: it is the only complete template the course gives for a document you will write dozens of times.</p>`,
    `<p class="y-chinh">🎯 Vẫn công thức đó, được trình bày lại — giảng viên cố ý nhắc lại.</p>
     <p class="meo">💡 Nếu trong cả bộ slide này có một slide đáng chép nguyên văn vào sổ thì chính là slide này: đây là khuôn mẫu hoàn chỉnh duy nhất môn học đưa cho một loại văn bản bạn sẽ viết hàng chục lần.</p>`),

  slide(D, 30, 'Activity — write your cover letter',
    `<p class="y-chinh">🎯 Write a cover letter: think about where you want to work, and the job you would genuinely enjoy and are capable of. Draft it, finalise it, and share it with classmates.</p>
     <p class="meo">💡 Note the wording — "enjoy <em>and</em> are capable of". A letter aimed at a job you cannot do fails at the Integrity point on slide 21, however well written it is.</p>`,
    `<p class="y-chinh">🎯 Viết một lá thư xin việc: nghĩ xem bạn muốn làm ở đâu, công việc nào bạn thật sự thích và đủ sức làm. Viết nháp, hoàn thiện, rồi chia sẻ với bạn học.</p>
     <p class="meo">💡 Để ý cách diễn đạt — "thích <em>và</em> đủ sức làm". Lá thư nhắm vào công việc bạn không làm nổi sẽ trượt ở tiêu chí Tính chính trực ở slide 21, dù viết hay tới đâu.</p>`),

  slide(D, 31, 'End of Lessons 21–22',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Four résumé formats, and when the functional one helps?</li>
       <li>Three items from the nine-item "never include" list?</li>
       <li>AIDA — what belongs in the Action stage?</li>
       <li>The three paragraphs of a cover letter, and what closes the third?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Bốn định dạng CV, và khi nào định dạng theo chức năng có ích?</li>
       <li>Ba mục trong danh sách chín điều "tuyệt đối không đưa vào"?</li>
       <li>AIDA — phần Hành động gồm những gì?</li>
       <li>Ba đoạn của thư xin việc, và đoạn ba khép lại bằng cái gì?</li>
     </ol>`),

  books([
    ['bcs', 'chương Employment Communication — résumé và cover letter', 'chương Employment Communication — CV và thư xin việc'],
    ['lumen', 'chương Job Search — résumé writing resources', 'chương Job Search — nguồn tài liệu viết CV'],
  ]),

  bi(
    `<h3>✅ A note on your own privacy</h3>
     <p>Slide 15's prohibition list is the same principle this Academy applies to its own slide images: personal identifiers that a document does not need should never be in it. A national ID number or a home address on a CV travels to every company you apply to, and you cannot take it back.</p>`,
    `<h3>✅ Một ghi chú về quyền riêng tư của chính bạn</h3>
     <p>Danh sách cấm ở slide 15 cũng chính là nguyên tắc Academy áp dụng cho ảnh slide của mình: thông tin nhận dạng cá nhân mà văn bản không cần tới thì đừng bao giờ đưa vào. Số căn cước hay địa chỉ nhà trên CV sẽ đi tới mọi công ty bạn nộp đơn, và bạn không lấy lại được.</p>`),
].join('\n');
