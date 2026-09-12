/**
 * Buổi 4 · Bài 16 — Groups and meetings (21 slide).
 *
 * Bám bộ "Session 4_..._Lesson 16_Meetings.pptx". Syllabus hỏi CQ13.2 về
 * hành vi phá đám trong cuộc họp và vai trò người điều hành; bản Academy cũ
 * chỉ có ba gạch đầu dòng trước/trong/sau họp, không có bảng kiểm cho người
 * tham dự, không có 8 kiểu điều hành hỏng, không có 15 nguyên tắc điều hành.
 */
import { slide, walkHead, books, bi } from './_slides.mjs';

const D = 's4-l16';

export const b4l16 = [
  walkHead(D, 1, 21,
    'The three lists to keep: the participant checklist (slide 11), the eight perils of poor facilitation (slide 12) — this is CQ13.2 — and the fifteen facilitation guidelines (slides 13–14).',
    'Ba danh sách cần giữ: bảng kiểm cho người dự họp (slide 11), tám kiểu điều hành hỏng (slide 12) — chính là CQ13.2 — và mười lăm nguyên tắc điều hành (slide 13–14).'),

  slide(D, 1, 'Groups and meetings — Session IV',
    `<p class="y-chinh">🎯 Title slide.</p>
     <p class="meo">💡 The syllabus places meetings at sessions 37–38 together with Activity 3, so this lesson is graded work, not background reading.</p>`,
    `<p class="y-chinh">🎯 Slide tiêu đề.</p>
     <p class="meo">💡 Syllabus xếp phần cuộc họp ở buổi 37–38 cùng với Activity 3, nên bài này là phần tính điểm, không phải đọc thêm.</p>`),

  slide(D, 2, 'Chapter outline (5 parts)',
    `<p class="y-chinh">🎯 Five parts, following a meeting's own timeline.</p>
     <ol>
       <li>What is a meeting?</li>
       <li>Pre-meeting</li>
       <li>Components of the agenda</li>
       <li>Post-meeting communication — minutes and follow-up</li>
       <li>Using technology</li>
     </ol>
     <p class="meo">💡 Three of the five parts happen when nobody is in the room. That ratio is the lesson.</p>`,
    `<p class="y-chinh">🎯 Năm phần, đi theo đúng dòng thời gian của một cuộc họp.</p>
     <ol>
       <li>Cuộc họp là gì?</li>
       <li>Trước cuộc họp</li>
       <li>Các thành phần của chương trình họp</li>
       <li>Sau cuộc họp — biên bản và việc theo dõi tiếp</li>
       <li>Dùng công nghệ</li>
     </ol>
     <p class="meo">💡 Ba trong năm phần diễn ra khi chẳng ai ngồi trong phòng. Chính tỷ lệ đó là bài học.</p>`),

  slide(D, 3, 'Learning objectives (3)',
    `<p class="y-chinh">🎯 Three objectives.</p>
     <ol>
       <li>Discuss how to <strong>prepare</strong> for group meetings.</li>
       <li>Identify strategies for effectively <strong>facilitating</strong> meetings.</li>
       <li>Understand how to use <strong>technology</strong> to aid group communication.</li>
     </ol>`,
    `<p class="y-chinh">🎯 Ba mục tiêu.</p>
     <ol>
       <li>Bàn về cách <strong>chuẩn bị</strong> cho các cuộc họp nhóm.</li>
       <li>Chỉ ra chiến lược <strong>điều hành</strong> cuộc họp hiệu quả.</li>
       <li>Hiểu cách dùng <strong>công nghệ</strong> hỗ trợ giao tiếp nhóm.</li>
     </ol>`),

  slide(D, 4, 'What is a meeting?',
    `<p class="y-chinh">🎯 Meetings are part of how groups get work done — and the slide is honest that people disagree about them.</p>
     <ul>
       <li>Some view meetings as <strong>boring, pointless and futile exercises</strong>.</li>
       <li>Others see them as <strong>opportunities to exchange information and produce results</strong>.</li>
     </ul>
     <p class="meo">💡 The difference between the two experiences is almost entirely decided before anyone sits down — which is what the next four slides are about.</p>`,
    `<p class="y-chinh">🎯 Họp là một phần trong cách nhóm hoàn thành công việc — và slide rất thật thà rằng người ta không đồng ý với nhau về nó.</p>
     <ul>
       <li>Có người coi họp là <strong>chán, vô nghĩa, vô ích</strong>.</li>
       <li>Người khác coi đó là <strong>cơ hội trao đổi thông tin và tạo ra kết quả</strong>.</li>
     </ul>
     <p class="meo">💡 Khác biệt giữa hai trải nghiệm ấy gần như được quyết định xong trước khi ai kịp ngồi xuống — và đó là nội dung của bốn slide tiếp theo.</p>`),

  slide(D, 5, 'Pre-meeting',
    `<p class="y-chinh">🎯 Two requirements before anything else.</p>
     <ul>
       <li>A <strong>clear purpose statement</strong>.</li>
       <li>A planned meeting schedule.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phép thử một câu:</strong> if you cannot write the purpose in one sentence, the meeting is not ready to be called. "Discuss the project" is a topic, not a purpose; "decide which of the three designs we submit" is a purpose.</p>`,
    `<p class="y-chinh">🎯 Hai điều kiện trước mọi thứ khác.</p>
     <ul>
       <li>Một <strong>tuyên bố mục đích rõ ràng</strong>.</li>
       <li>Lịch họp đã được hoạch định.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Phép thử một câu:</strong> nếu bạn không viết nổi mục đích trong một câu thì cuộc họp chưa đủ điều kiện để triệu tập. "Bàn về dự án" là chủ đề, không phải mục đích; "chốt xem nộp phương án nào trong ba thiết kế" mới là mục đích.</p>`),

  slide(D, 6, 'Deciding how to meet',
    `<p class="y-chinh">🎯 Two modes, each with its own decision to make.</p>
     <ul>
       <li><span class="nhan">Meeting in person</span> — you must decide <em>how</em> and <em>where</em> to meet.</li>
       <li><span class="nhan">Virtual meetings</span> — you must choose the technologies.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Hai hình thức, mỗi hình thức có quyết định riêng phải chốt.</p>
     <ul>
       <li><span class="nhan">Họp trực tiếp</span> — phải quyết <em>họp thế nào</em> và <em>họp ở đâu</em>.</li>
       <li><span class="nhan">Họp trực tuyến</span> — phải chọn công nghệ dùng.</li>
     </ul>`),

  slide(D, 7, 'Discussion — strengths and weaknesses of face-to-face',
    `<p class="y-chinh">🎯 Two questions for the class.</p>
     <ul>
       <li>Identify the strengths and weaknesses of face-to-face meetings.</li>
       <li>List types of effective application technologies for meetings.</li>
     </ul>
     <p><span class="nhan">Material for the answer</span> — face-to-face gives you the full nonverbal channel from Lesson 14 (all eight types), which is why disagreement is easier to detect. It costs travel time and it excludes anyone who cannot be there.</p>`,
    `<p class="y-chinh">🎯 Hai câu hỏi cho lớp.</p>
     <ul>
       <li>Nêu điểm mạnh và điểm yếu của họp trực tiếp.</li>
       <li>Liệt kê các loại ứng dụng công nghệ hiệu quả cho cuộc họp.</li>
     </ul>
     <p><span class="nhan">Nguyên liệu để trả lời</span> — họp trực tiếp cho bạn trọn kênh phi ngôn ngữ ở Bài 14 (đủ tám loại), nên dễ phát hiện sự bất đồng hơn. Đổi lại, nó tốn thời gian di chuyển và gạt ra ngoài những ai không tới được.</p>`),

  slide(D, 8, 'Formulating an agenda',
    `<p class="y-chinh">🎯 <strong>Agenda</strong> = the outline of items to be discussed and tasks to be accomplished during a meeting.</p>
     <p class="meo">💡 Two nouns in one definition: <em>items to discuss</em> and <em>tasks to accomplish</em>. An agenda with only the first produces a meeting that ends with nothing decided.</p>`,
    `<p class="y-chinh">🎯 <strong>Chương trình họp (agenda)</strong> = bản phác các mục sẽ bàn và các việc cần hoàn thành trong cuộc họp.</p>
     <p class="meo">💡 Hai danh từ trong một định nghĩa: <em>mục để bàn</em> và <em>việc để xong</em>. Chương trình họp chỉ có vế đầu sẽ đẻ ra cuộc họp tan mà chẳng chốt được gì.</p>`),

  slide(D, 9, 'Components of the agenda (6)',
    `<p class="y-chinh">🎯 Six components.</p>
     <ul>
       <li>Purpose of the meeting.</li>
       <li>A list of points to be considered, <strong>plus a brief summary of the relevant information for each point</strong>.</li>
       <li>List of participants.</li>
       <li>Date · time · place.</li>
     </ul>
     <p class="meo">💡 The second component is the one students skip. Attaching the background to each point is what lets people arrive ready, instead of spending the first fifteen minutes being briefed.</p>`,
    `<p class="y-chinh">🎯 Sáu thành phần.</p>
     <ul>
       <li>Mục đích cuộc họp.</li>
       <li>Danh sách các điểm sẽ xem xét, <strong>kèm tóm tắt ngắn thông tin liên quan cho từng điểm</strong>.</li>
       <li>Danh sách người tham dự.</li>
       <li>Ngày · giờ · địa điểm.</li>
     </ul>
     <p class="meo">💡 Thành phần thứ hai là cái sinh viên hay bỏ. Gắn phần thông tin nền vào từng điểm chính là thứ giúp mọi người tới nơi đã sẵn sàng, thay vì mất mười lăm phút đầu chỉ để nghe phổ biến.</p>`),

  slide(D, 10, 'Inviting meeting participants',
    `<p class="y-chinh">🎯 Four points about the invitation itself.</p>
     <ul>
       <li>Adding participants <strong>for no clear reason</strong> only makes the process more complex and may produce negative results.</li>
       <li>Inviting by email has become increasingly common across business and industry.</li>
       <li>Software such as Microsoft Outlook lets you send a meeting request and receive an "accept" or "decline", keeping the process organised.</li>
       <li>A <strong>reminder email on the day</strong>, often early in the morning, highlights the day's activities.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy ngược trực giác:</strong> inviting extra people looks generous and costs the meeting its focus. Invite whoever must decide or must do; send the minutes to the rest.</p>`,
    `<p class="y-chinh">🎯 Bốn điểm về chính lời mời họp.</p>
     <ul>
       <li>Thêm người dự <strong>mà không có lý do rõ ràng</strong> chỉ làm quá trình phức tạp hơn và có thể gây kết quả tiêu cực.</li>
       <li>Mời qua email ngày càng phổ biến trong doanh nghiệp và công nghiệp.</li>
       <li>Phần mềm như Microsoft Outlook cho phép gửi lời mời họp và nhận lại "chấp nhận" hay "từ chối", giúp quá trình mời gọn gàng.</li>
       <li>Một <strong>email nhắc trong ngày họp</strong>, thường vào sáng sớm, giúp làm nổi bật các hoạt động của ngày hôm đó.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Bẫy ngược trực giác:</strong> mời thêm người trông có vẻ hào phóng nhưng lấy mất sự tập trung của cuộc họp. Hãy mời người phải quyết hoặc phải làm; còn lại thì gửi biên bản.</p>`),

  slide(D, 11, 'Identifying an appropriate meeting space',
    `<p class="y-chinh">🎯 The shape of the table changes the conversation.</p>
     <ul>
       <li><span class="nhan">Square, rectangular or U-shaped tables</span> — carry a hierarchy: there is a head of the table.</li>
       <li><span class="nhan">Round tables, or tables arranged in a circle</span> — allow a more <strong>egalitarian model of interaction</strong>, reducing hierarchical aspects while keeping a clear line of sight among all participants.</li>
     </ul>
     <p class="meo">💡 This is "environment" from Lesson 14 slide 7, applied. If you want quiet members to speak, the seating does more work than asking them to.</p>`,
    `<p class="y-chinh">🎯 Hình dạng cái bàn làm thay đổi cuộc trò chuyện.</p>
     <ul>
       <li><span class="nhan">Bàn vuông, chữ nhật hoặc hình chữ U</span> — mang sẵn thứ bậc: có chỗ gọi là đầu bàn.</li>
       <li><span class="nhan">Bàn tròn, hoặc bàn xếp thành vòng</span> — cho phép kiểu tương tác <strong>bình đẳng hơn</strong>, giảm tính thứ bậc trong khi vẫn giữ đường nhìn thông suốt giữa mọi người.</li>
     </ul>
     <p class="meo">💡 Đây chính là yếu tố "môi trường" ở slide 7 Bài 14, đem áp dụng. Muốn thành viên ít nói chịu phát biểu thì cách xếp chỗ ngồi làm được nhiều việc hơn là lời kêu gọi.</p>`),

  slide(D, 12, 'Meeting checklist for participants (Guffey, 2007)',
    `<p class="y-chinh">🎯 Eleven behaviours expected of everyone in the room, not just the chair.</p>
     <ul class="hai-cot">
       <li>Arrive on time and stay until it adjourns</li>
       <li>Leave only for established breaks or emergencies</li>
       <li>Be prepared, with everything you need on hand</li>
       <li>Turn off phones and personal devices</li>
       <li>Follow the established protocol for turn taking</li>
       <li>Respect time limits</li>
       <li>Be professional in verbal and nonverbal interaction</li>
       <li>Communicate interest and stay engaged</li>
       <li>Avoid tangents and side discussions</li>
       <li>Respect space — do not spread papers everywhere</li>
       <li>Clean up after yourself · engage in polite conversation afterwards</li>
     </ul>
     <p class="meo">💡 "Follow the protocol for turn taking" is the one that protects the quiet members. Without a protocol, airtime goes to whoever interrupts best.</p>`,
    `<p class="y-chinh">🎯 Mười một hành vi được trông đợi ở mọi người trong phòng, không riêng người chủ trì.</p>
     <ul class="hai-cot">
       <li>Đến đúng giờ và ở lại tới khi họp kết thúc</li>
       <li>Chỉ rời phòng vào giờ giải lao hoặc khi có việc khẩn</li>
       <li>Chuẩn bị sẵn, mang đủ thứ cần dùng</li>
       <li>Tắt điện thoại và thiết bị cá nhân</li>
       <li>Theo đúng quy ước về lượt phát biểu</li>
       <li>Tôn trọng giới hạn thời gian</li>
       <li>Chuyên nghiệp cả trong lời nói lẫn phi ngôn ngữ</li>
       <li>Thể hiện sự quan tâm và giữ mạch tham gia</li>
       <li>Tránh lạc đề và tránh bàn riêng</li>
       <li>Tôn trọng không gian — đừng bày giấy tờ khắp nơi</li>
       <li>Dọn dẹp chỗ mình ngồi · trò chuyện lịch sự sau khi họp xong</li>
     </ul>
     <p class="meo">💡 "Theo đúng quy ước về lượt phát biểu" là điều bảo vệ những thành viên ít nói. Không có quy ước thì thời lượng nói thuộc về người cắt lời giỏi nhất.</p>`),

  slide(D, 13, 'Perils of poor facilitation (8)',
    `<p class="y-chinh">🎯 Eight things that happen when nobody facilitates — this is CQ13.2 in the syllabus.</p>
     <ul>
       <li>An argument starts about an established fact.</li>
       <li>Opinions are introduced as if they were truths.</li>
       <li>People intimidate others with real or imaginary "knowledge".</li>
       <li>People overwhelm each other with more proposals than there is time to consider.</li>
       <li>People become angry for no good reason.</li>
       <li>People promote their own visions at everyone else's expense.</li>
       <li>People demand or offer much more information than is needed.</li>
       <li><strong>Discussion becomes circular</strong> — people repeat themselves without progress toward conclusions.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cách dùng danh sách này:</strong> name the peril out loud when it happens. "We are going in circles — can we write down the two options?" is facilitation, and any member can do it.</p>`,
    `<p class="y-chinh">🎯 Tám chuyện xảy ra khi không ai điều hành — đây chính là CQ13.2 trong syllabus.</p>
     <ul>
       <li>Cãi nhau về một sự thật đã được xác lập.</li>
       <li>Ý kiến được đưa ra như thể là chân lý.</li>
       <li>Người ta áp đảo nhau bằng "kiến thức" thật hoặc tưởng tượng.</li>
       <li>Người ta dội lên nhau nhiều đề xuất hơn mức thời gian cho phép xem xét.</li>
       <li>Người ta nổi giận chẳng vì lý do chính đáng nào.</li>
       <li>Người ta đẩy tầm nhìn riêng của mình bằng cái giá của tất cả những người khác.</li>
       <li>Người ta đòi hỏi hoặc cung cấp lượng thông tin nhiều hơn hẳn mức cần thiết.</li>
       <li><strong>Thảo luận đi lòng vòng</strong> — ai cũng nhắc lại chính mình mà không tiến tới kết luận nào.</li>
     </ul>
     <p class="pitfall co-tieu-de"><strong>Cách dùng danh sách này:</strong> hãy gọi tên hiện tượng ra thành lời khi nó xảy ra. "Mình đang đi lòng vòng — viết hai phương án ra được không?" chính là điều hành, và thành viên nào cũng làm được.</p>`),

  slide(D, 14, 'Guidelines for facilitating a meeting (1–8)',
    `<p class="y-chinh">🎯 Fifteen guidelines; the first eight.</p>
     <ol>
       <li>Start promptly.</li>
       <li>Begin with something positive.</li>
       <li>Tend to housekeeping details.</li>
       <li>Make sure people understand their roles.</li>
       <li>Keep to your agenda.</li>
       <li><strong>Guide, don't dictate.</strong></li>
       <li>Keep your eyes open for nonverbal communication.</li>
       <li><strong>Capture and assign action items.</strong></li>
     </ol>
     <p class="meo">💡 Guideline 8 is the one that decides whether the meeting mattered: an action item needs an owner and a date, or it is a wish.</p>`,
    `<p class="y-chinh">🎯 Mười lăm nguyên tắc; tám cái đầu.</p>
     <ol>
       <li>Bắt đầu đúng giờ.</li>
       <li>Mở đầu bằng một điều tích cực.</li>
       <li>Lo trước mấy việc hậu cần.</li>
       <li>Bảo đảm mọi người hiểu vai trò của mình.</li>
       <li>Bám sát chương trình họp.</li>
       <li><strong>Dẫn dắt, đừng ra lệnh.</strong></li>
       <li>Để mắt tới các tín hiệu phi ngôn ngữ.</li>
       <li><strong>Ghi lại và giao đầu việc.</strong></li>
     </ol>
     <p class="meo">💡 Nguyên tắc 8 quyết định cuộc họp có ý nghĩa hay không: một đầu việc phải có người phụ trách và có hạn, nếu không thì chỉ là một điều ước.</p>`),

  slide(D, 15, 'Guidelines for facilitating a meeting (9–15)',
    `<p class="y-chinh">🎯 The remaining seven.</p>
     <ol start="9">
       <li>Make things fun and healthy.</li>
       <li>Avoid sarcasm and cynicism.</li>
       <li>Take breaks regularly, <strong>even when you think you don't need them</strong>.</li>
       <li>Show respect for everyone.</li>
       <li>Expect the unexpected.</li>
       <li>Conduct multiple assessments of the meeting — formative assessment.</li>
       <li>Think (and talk) ahead.</li>
     </ol>
     <p class="meo">💡 "Formative assessment" here means checking during the meeting whether it is working — a quick "are we on the right question?" — rather than judging it afterwards when nothing can be fixed.</p>`,
    `<p class="y-chinh">🎯 Bảy nguyên tắc còn lại.</p>
     <ol start="9">
       <li>Làm cho không khí vui và lành mạnh.</li>
       <li>Tránh mỉa mai và giễu cợt.</li>
       <li>Nghỉ giải lao đều đặn, <strong>kể cả khi bạn nghĩ là không cần</strong>.</li>
       <li>Tôn trọng tất cả mọi người.</li>
       <li>Lường trước những chuyện ngoài dự tính.</li>
       <li>Đánh giá cuộc họp nhiều lần — đánh giá quá trình (formative).</li>
       <li>Nghĩ trước (và nói trước) về chuyện sắp tới.</li>
     </ol>
     <p class="meo">💡 "Đánh giá quá trình" ở đây nghĩa là kiểm ngay trong lúc họp xem nó có đang chạy đúng không — một câu "mình có đang bàn đúng câu hỏi không?" — thay vì phán xét sau khi tan họp, lúc chẳng còn sửa được gì.</p>`),

  slide(D, 16, 'Post-meeting communication',
    `<p class="y-chinh">🎯 Two jobs after the room empties.</p>
     <ul>
       <li><span class="nhan">Summarise</span> what was discussed or decided, and what actions members are to take as a result.</li>
       <li><span class="nhan">Finalise the minutes</span> — notes on the actions taken during the meeting, or specific indications of <strong>who is responsible for what before the next meeting</strong>.</li>
     </ul>
     <p class="meo">💡 Minutes are not a transcript. Their job is to make the decisions and owners findable later, which is exactly what prevents the argument from restarting next week.</p>`,
    `<p class="y-chinh">🎯 Hai việc sau khi phòng họp trống.</p>
     <ul>
       <li><span class="nhan">Tóm tắt</span> những gì đã bàn hoặc đã chốt, và những việc các thành viên phải làm sau đó.</li>
       <li><span class="nhan">Hoàn tất biên bản</span> — ghi các hành động đã quyết trong cuộc họp, hoặc chỉ rõ <strong>ai chịu trách nhiệm việc gì trước cuộc họp sau</strong>.</li>
     </ul>
     <p class="meo">💡 Biên bản không phải bản gỡ băng. Việc của nó là làm cho các quyết định và người phụ trách tra lại được về sau — và đó đúng là thứ ngăn cuộc tranh luận khởi động lại vào tuần kế tiếp.</p>`),

  slide(D, 17, 'Sample of informal minutes',
    `<p class="y-chinh">🎯 A worked example of what minutes look like in practice.</p>
     <p><span class="nhan">A usable minimum for a student group</span></p>
     <ul>
       <li>Date, who attended, who was absent.</li>
       <li>Decisions made — one line each.</li>
       <li>Action items: task · owner · deadline.</li>
       <li>Anything deliberately postponed, and to when.</li>
     </ul>
     <p class="meo">💡 The last line is what stops a postponed item from silently becoming a forgotten one.</p>`,
    `<p class="y-chinh">🎯 Một ví dụ thực tế về hình hài của biên bản.</p>
     <p><span class="nhan">Mức tối thiểu dùng được cho nhóm sinh viên</span></p>
     <ul>
       <li>Ngày họp, ai có mặt, ai vắng.</li>
       <li>Các quyết định đã chốt — mỗi quyết định một dòng.</li>
       <li>Đầu việc: việc gì · ai làm · hạn khi nào.</li>
       <li>Những việc cố ý hoãn lại, và hoãn tới bao giờ.</li>
     </ul>
     <p class="meo">💡 Dòng cuối chính là thứ ngăn một việc bị hoãn lặng lẽ biến thành một việc bị quên.</p>`),

  slide(D, 18, 'Using technology',
    `<p class="y-chinh">🎯 Three headings.</p>
     <ul>
       <li>Using technology to facilitate meetings.</li>
       <li><span class="nhan">Audio-only interactions</span>.</li>
       <li><span class="nhan">Audio-visual interactions</span>.</li>
     </ul>
     <p class="meo">💡 The distinction matters because audio-only removes every nonverbal channel except paralanguage — which is why the tips on the next slide are mostly about compensating for that loss.</p>`,
    `<p class="y-chinh">🎯 Ba đầu mục.</p>
     <ul>
       <li>Dùng công nghệ để hỗ trợ cuộc họp.</li>
       <li><span class="nhan">Tương tác chỉ có âm thanh</span>.</li>
       <li><span class="nhan">Tương tác có cả hình và tiếng</span>.</li>
     </ul>
     <p class="meo">💡 Phân biệt này quan trọng vì họp chỉ có tiếng thì mất sạch các kênh phi ngôn ngữ, chỉ còn cận ngôn — và đó là lý do các mẹo ở slide sau chủ yếu nhằm bù lại phần mất mát ấy.</p>`),

  slide(D, 19, 'Tips for virtual meetings (7)',
    `<p class="y-chinh">🎯 Seven practical tips.</p>
     <ol>
       <li>Get everyone to say something brief at the start, so participants become familiar with each other's <strong>voices</strong>.</li>
       <li>Remind people of the purpose and of the key outcomes you hope to achieve.</li>
       <li>Watch for people who are not participating and periodically ask if they have thoughts to add.</li>
       <li>Summarise the status of the meeting from time to time.</li>
       <li>In an audio conference, discourage calling in on a mobile phone because of sound quality.</li>
       <li>Because nonverbal cues may be missing, <strong>ask members to clarify their meaning</strong> if words alone are not enough.</li>
       <li>If you must leave early, tell the organiser in advance and sign off publicly but quickly, rather than just hanging up.</li>
     </ol>
     <p class="meo">💡 Tips 1, 3 and 6 all solve the same problem: without faces you cannot tell who is confused, who disagrees, or who has stopped listening.</p>`,
    `<p class="y-chinh">🎯 Bảy mẹo thực dụng.</p>
     <ol>
       <li>Để mỗi người nói vài câu ngắn lúc mở đầu, cho mọi người quen <strong>giọng</strong> nhau.</li>
       <li>Nhắc lại mục đích và những kết quả chính mong đạt được.</li>
       <li>Để ý ai không tham gia và thỉnh thoảng hỏi xem họ có ý gì muốn góp không.</li>
       <li>Thỉnh thoảng tóm tắt tình hình cuộc họp.</li>
       <li>Với họp âm thanh, hạn chế để người ta gọi vào bằng điện thoại di động vì chất lượng tiếng.</li>
       <li>Vì có thể thiếu tín hiệu phi ngôn ngữ, hãy <strong>đề nghị người khác nói rõ ý</strong> khi chỉ nghe lời thôi là chưa đủ.</li>
       <li>Nếu buộc phải rời sớm, báo trước cho người tổ chức và chào tạm biệt công khai nhưng nhanh gọn, đừng lẳng lặng tắt máy.</li>
     </ol>
     <p class="meo">💡 Mẹo 1, 3 và 6 cùng giải một bài toán: không nhìn thấy mặt thì bạn không biết ai đang bối rối, ai không đồng ý, ai đã ngừng nghe.</p>`),

  slide(D, 20, 'Review & reflection questions',
    `<p class="y-chinh">🎯 Three questions, with where the answers live.</p>
     <ul>
       <li><span class="nhan">Preparing for your group's first meeting — key steps, and what goes on the first agenda?</span> Slides 5, 9 and 10: purpose statement, six agenda components, invite only who is needed.</li>
       <li><span class="nhan">Strategies you have seen facilitators use — effective and ineffective?</span> Compare against the eight perils (slide 13) and the fifteen guidelines (slides 14–15).</li>
       <li><span class="nhan">Using technology for a group meeting — advantages and disadvantages?</span> Slides 18–19.</li>
     </ul>`,
    `<p class="y-chinh">🎯 Ba câu hỏi, kèm chỗ chứa câu trả lời.</p>
     <ul>
       <li><span class="nhan">Chuẩn bị cho buổi họp đầu tiên của nhóm — các bước then chốt, và chương trình họp đầu tiên gồm gì?</span> Slide 5, 9 và 10: tuyên bố mục đích, sáu thành phần chương trình họp, chỉ mời người cần thiết.</li>
       <li><span class="nhan">Bạn từng thấy người điều hành dùng chiến lược nào — cái nào hiệu quả, cái nào không?</span> Đối chiếu với tám kiểu hỏng (slide 13) và mười lăm nguyên tắc (slide 14–15).</li>
       <li><span class="nhan">Dùng công nghệ cho họp nhóm — lợi và hại?</span> Slide 18–19.</li>
     </ul>`),

  slide(D, 21, 'Q&A',
    `<p class="y-chinh">🎯 Closing slide.</p>
     <p><span class="nhan">Self-check</span></p>
     <ol>
       <li>Six components of an agenda?</li>
       <li>Three of the eight perils of poor facilitation?</li>
       <li>What must an action item contain to count?</li>
       <li>Why does table shape matter?</li>
     </ol>`,
    `<p class="y-chinh">🎯 Slide kết.</p>
     <p><span class="nhan">Tự kiểm</span></p>
     <ol>
       <li>Sáu thành phần của một chương trình họp?</li>
       <li>Ba trong tám kiểu điều hành hỏng?</li>
       <li>Một đầu việc phải có gì mới được tính?</li>
       <li>Vì sao hình dạng cái bàn lại quan trọng?</li>
     </ol>`),

  books([
    ['wig', 'Chapter 9 — group meetings and decision making', 'Chương 9 — họp nhóm và ra quyết định'],
    ['bc7', 'chương về business meetings (Guffey checklist)', 'chương về cuộc họp trong doanh nghiệp (bảng kiểm Guffey)'],
  ]),

  bi(
    `<h3>✅ What this adds</h3>
     <p>The old Academy lesson covered meetings with a before/during/after outline. The syllabus asks CQ13.2 about disruptive meeting behaviours and the chair's role — answered here by the eight perils and the fifteen facilitation guidelines, neither of which existed in the course before.</p>`,
    `<h3>✅ Bài này bù thêm gì</h3>
     <p>Bài cũ trên Academy nói về cuộc họp bằng một dàn ý trước/trong/sau. Syllabus hỏi CQ13.2 về hành vi phá đám trong họp và vai trò người chủ trì — được trả lời ở đây bằng tám kiểu điều hành hỏng và mười lăm nguyên tắc điều hành, cả hai đều chưa từng có trong khoá học.</p>`),
].join('\n');
