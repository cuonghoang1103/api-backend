/**
 * Tiếng Anh giao tiếp — NGÀY 28 (chặng 5 "Tự nhiên như người bản xứ", B2): nói về bản thân, mục tiêu, nghề nghiệp.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd28-`.
 * Ngữ pháp trong câu: hiện tại hoàn thành tiếp diễn (I've been working on… for/since) · I'm hoping to… / Eventually, I'd like to… ·
 * nối câu: which is why, that's how, since then, eventually.
 * Cảnh: Thịnh — sinh viên năm cuối, thực tập ở Ferncastle Software (Quận 7, TP.HCM) — trò chuyện làm quen với sếp mới,
 * gặp nhà tuyển dụng ở hội chợ việc làm, và nói chuyện với một người lạ trong hàng cà phê hoá ra là giám đốc mới.
 * RANH GIỚI: chỉ phần giao tiếp chung. Phỏng vấn kỹ thuật, STAR, giải thích dự án, system design ⇒ Courses interview-prep
 * (chương 2, chương 8) và Technical English at Work.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_28: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd28-nghe',
    kind: 'listening',
    title: 'Nói về bản thân, mục tiêu, nghề nghiệp với sếp mới, nhà tuyển dụng',
    goal: 'Nghe hiểu ba cuộc nói chuyện về bản thân ở tốc độ tự nhiên: người kia thật sự muốn biết gì, câu hỏi mở nghĩa là gì, và một câu trả lời hay khác câu đọc CV ở chỗ nào.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Thịnh**, sinh viên năm cuối, đã thực tập ba tháng ở **Ferncastle Software**, Quận 7, TP.HCM.',
          'Ngày 1 bạn tự giới thiệu 30 giây với đồng nghiệp mới. Hôm nay là bản **2 phút**: kể **mình đã đi tới đây thế nào**, **dạo này đang làm gì**, **mong gì sắp tới**, với ba người có thể ảnh hưởng tới sự nghiệp của Thịnh.',
          'Ba câu hỏi bạn sẽ nghe nhiều nhất: **Tell me a bit about yourself.** · **What have you been up to lately?** · **What are you hoping to get out of…?** Không câu nào muốn bạn đọc lại CV.',
          'Hôm qua (Ngày 27) bạn tập kể chuyện có cao trào. Hôm nay câu chuyện là **chính bạn**, và một chút tự trào vẫn có ích.',
          'Ngoài phạm vi bài: câu hỏi phỏng vấn kỹ thuật, trả lời theo STAR, giải thích kiến trúc dự án. Phần đó ở Courses **IT Interview Prep** (chương 2, chương 8) và **Technical English at Work**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Gặp sếp mới: "Tell me a bit about yourself"' },
      {
        t: 'canh',
        anh: ['woman-office-worker', 'man-student', 'hot-beverage', 'spiral-notepad', 'office-building'],
        caption: '3 giờ chiều thứ Ba, phòng họp nhỏ. **Margot** (người Anh, ở Bristol) vừa thay trưởng nhóm cũ, đang gặp riêng từng người để làm quen. Tới lượt **Thịnh**. Chị nói trước: đây không phải buổi đánh giá.',
      },
      {
        t: 'listen',
        id: 'gtd28-nghe-canh1',
        title: 'Scene 1 — Getting to know the new manager',
        note: 'Nghe xem Thịnh mở đầu sai thế nào, Margot kéo câu chuyện sang hướng nào, và câu "what makes you tick" nghĩa là gì.',
        lines: [
          { who: 'Margot', voice: 'uk-nu', text: "Right, Thịnh, thanks for making the time. This isn't a review or anything. I just want to get to know everyone. So, tell me a bit about yourself.", vi: 'Rồi, Thịnh, cảm ơn em đã dành thời gian. Đây không phải buổi đánh giá gì đâu. Chị chỉ muốn làm quen với từng người. Kể chị nghe một chút về em đi.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Sure. I was born in 2004 in Phan Thiết. In 2022 I started studying software engineering. In 2023 I joined the coding club. In 2024…', vi: 'Dạ. Em sinh năm 2004 ở Phan Thiết. Năm 2022 em bắt đầu học kỹ thuật phần mềm. Năm 2023 em vào câu lạc bộ lập trình. Năm 2024…' },
          { who: 'Margot', voice: 'uk-nu', text: "Okay, let me stop you there. I've read your CV, so you can skip the dates. Tell me what you've been up to lately. What's keeping you busy?", vi: 'Được rồi, chị ngắt em chỗ này nhé. Chị đọc CV của em rồi, em bỏ qua mấy cái năm đi. Kể chị nghe dạo này em làm gì. Em đang bận với chuyện gì?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Ah, sorry. Well, apart from the internship, I've been tutoring two high-school kids in maths every Saturday. For about a year now.", vi: 'À, em xin lỗi. Ngoài thực tập ra, em đang dạy kèm toán cho hai em cấp ba vào mỗi thứ Bảy. Được khoảng một năm rồi ạ.' },
          { who: 'Margot', voice: 'uk-nu', text: 'Oh, nice. How did that start?', vi: 'Ồ, hay đấy. Chuyện đó bắt đầu thế nào?' },
          { who: 'Thịnh', voice: 'us-nam', text: "My neighbour asked me to help her son just before his exams. He passed, and then his friend's mum called me. So it kind of grew from there.", vi: 'Cô hàng xóm nhờ em kèm con trai cô ngay trước kỳ thi. Bạn ấy đỗ, rồi mẹ của bạn bạn ấy gọi em. Thế là cứ thế lớn dần.' },
          { who: 'Margot', voice: 'uk-nu', text: 'That says a lot, actually. Being able to explain things simply is half of this job. What else?', vi: 'Thật ra điều đó nói lên nhiều lắm. Giải thích được mọi thứ một cách đơn giản là một nửa công việc này rồi. Còn gì nữa?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Honestly, not much. I'm not really good at anything special.", vi: 'Thật lòng thì không nhiều ạ. Em chẳng giỏi cái gì đặc biệt.' },
          { who: 'Margot', voice: 'uk-nu', text: 'Hmm. In my experience, people who say that usually are. What do your friends ask you for help with?', vi: 'Hừm. Theo kinh nghiệm của chị, người nói câu đó thường là có giỏi đấy. Bạn bè hay nhờ em giúp chuyện gì?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Maybe… organising things? I've been running the class trips since first year. Booking buses, collecting money, that kind of thing.", vi: 'Chắc là… lo tổ chức ạ? Từ năm nhất em đã lo các chuyến đi của lớp. Đặt xe, thu tiền, mấy việc kiểu đó.' },
          { who: 'Margot', voice: 'uk-nu', text: "So you're the one who makes things happen. That's not nothing. And what makes you tick? What gets you out of bed in the morning?", vi: 'Vậy em là người biến mọi việc thành hiện thực. Thế không phải chuyện nhỏ đâu. Còn điều gì làm em hăng hái? Điều gì khiến em muốn ra khỏi giường mỗi sáng?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Sorry, 'what makes me tick'? I'm not sure I know that phrase.", vi: 'Xin lỗi chị, "what makes me tick" ạ? Em không chắc em biết cụm này.' },
          { who: 'Margot', voice: 'uk-nu', text: "Good question. It just means 'what motivates you'.", vi: 'Hỏi hay đấy. Nó chỉ có nghĩa là "điều gì tạo động lực cho em".' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Ah, I see. I think… seeing something I built actually being used by people. Even something small.', vi: 'À, em hiểu rồi. Em nghĩ là… thấy thứ mình làm ra được người ta dùng thật. Dù chỉ là cái nhỏ.' },
          { who: 'Margot', voice: 'uk-nu', text: 'Lovely. And looking ahead, what are you hoping to get out of the next six months?', vi: 'Hay lắm. Còn sắp tới, em mong sáu tháng tới mang lại cho em điều gì?' },
          { who: 'Thịnh', voice: 'us-nam', text: "I'm hoping to get more confident presenting my work in English. And eventually, I'd like to be the person who helps new interns, like my mentor did for me.", vi: 'Em mong tự tin hơn khi trình bày công việc bằng tiếng Anh. Và về lâu dài, em muốn là người giúp các bạn thực tập mới, như anh mentor đã giúp em.' },
          { who: 'Margot', voice: 'uk-nu', text: "That's a great goal. Let's start on the first one: you're presenting at Friday's team meeting. Just five minutes.", vi: 'Mục tiêu hay đấy. Mình bắt đầu với cái đầu tiên luôn: thứ Sáu này em trình bày ở buổi họp nhóm. Chỉ năm phút thôi.' },
          { who: 'Thịnh', voice: 'us-nam', text: "Oh. Okay. I walked right into that one, didn't I?", vi: 'Ơ. Dạ. Em tự chui đầu vào rồi, phải không ạ?' },
          { who: 'Margot', voice: 'uk-nu', text: 'You did a bit.', vi: 'Hơi hơi đấy.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd28-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Margot ngắt lời Thịnh lúc đầu?',
            options: ['Thịnh nói quá nhỏ', 'Thịnh đọc lại CV theo năm, trong khi chị đã đọc CV và muốn nghe chuyện gần đây', 'Thịnh nói sai năm sinh', 'Margot hết thời gian'],
            correct: 1,
            why: '"I\'ve read your CV, so **you can skip the dates**. Tell me **what you\'ve been up to lately**." Câu "Tell me about yourself" không phải lệnh đọc CV.',
          },
          {
            q: 'Thịnh nói "I\'m not really good at anything special." Margot phản ứng thế nào?',
            options: ['Đồng ý với Thịnh', 'Nói những người hay nói thế thường là có giỏi, rồi hỏi bạn bè hay nhờ Thịnh việc gì', 'Chuyển sang chủ đề khác', 'Khuyên Thịnh đi học thêm'],
            correct: 1,
            why: '"In my experience, people who say that usually are." Rồi chị hỏi một câu **cụ thể** để Thịnh tự tìm ra điểm mạnh: tổ chức.',
          },
          {
            q: '"What makes you tick?" nghĩa là gì?',
            options: ['Điều gì làm bạn khó chịu', 'Điều gì tạo động lực cho bạn', 'Bạn làm việc mấy giờ', 'Bạn có đồng hồ không'],
            correct: 1,
            why: 'Margot giải thích: "It just means **what motivates you**." Thịnh làm đúng: không hiểu thì hỏi lại ngay, ngắn gọn.',
          },
          {
            q: 'Câu cuối "I walked right into that one, didn\'t I?" cho thấy Thịnh:',
            options: ['Bực vì bị giao việc', 'Tự trào: mình vừa nói muốn tự tin trình bày, thế là bị giao trình bày luôn', 'Muốn từ chối', 'Không hiểu Margot nói gì'],
            correct: 1,
            why: '**walk into it** = tự đưa mình vào thế khó. Thịnh nhận việc bằng một câu đùa nhẹ, đúng kỹ năng của Ngày 27. Margot đáp "You did a bit" (nói giảm).',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Hội chợ việc làm: "Give me the two-minute version"' },
      {
        t: 'canh',
        anh: ['man-student', 'man-office-worker', 'identification-card', 'handshake', 'graduation-cap', 'school'],
        caption: 'Sáng thứ Bảy, hội chợ việc làm ở trường. Thịnh đi tìm việc cho **sau khi tốt nghiệp**. Gian của **Corran Systems** (công ty Ireland có văn phòng ở TP.HCM) do **Rowan**, người tuyển dụng, đứng. Lần này Thịnh nhớ bài học với Margot.',
      },
      {
        t: 'listen',
        id: 'gtd28-nghe-canh2',
        title: 'Scene 2 — At the career fair',
        note: 'Nghe xem Thịnh kể về mình bằng mấy ý, tin xấu Rowan báo là gì, và Thịnh xử lý thế nào để không mất cơ hội.',
        lines: [
          { who: 'Rowan', voice: 'ie-nam', text: 'Hiya, come on over. Rowan, talent team at Corran Systems. And you are?', vi: 'Chào em, lại đây nào. Anh là Rowan, nhóm tuyển dụng của Corran Systems. Còn em là?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Hi Rowan, I'm Thịnh. Nice to meet you. I'm in my final year of software engineering here.", vi: 'Chào anh Rowan, em là Thịnh. Rất vui được gặp anh. Em đang học năm cuối ngành kỹ thuật phần mềm ở trường này.' },
          { who: 'Rowan', voice: 'ie-nam', text: "Grand. So, give me the two-minute version. Who's Thịnh?", vi: 'Tốt. Vậy kể anh nghe bản hai phút. Thịnh là ai?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Okay. So, I've always liked figuring out how things work, which is why I chose IT. For the last three months I've been interning at Ferncastle, on a booking app for small hotels.", vi: 'Dạ. Em luôn thích tìm hiểu mọi thứ vận hành thế nào, nên em chọn ngành IT. Ba tháng nay em thực tập ở Ferncastle, làm ứng dụng đặt phòng cho các khách sạn nhỏ.' },
          { who: 'Rowan', voice: 'ie-nam', text: 'Ferncastle, yeah, I know a few people there. Go on.', vi: 'Ferncastle à, ừ, anh quen vài người ở đó. Em nói tiếp đi.' },
          { who: 'Thịnh', voice: 'us-nam', text: "Outside of work, I've been tutoring kids in maths for about a year, and I organise trips for my class. So I suppose I'm the person who explains things and gets things organised.", vi: 'Ngoài công việc, em dạy kèm toán cho mấy em nhỏ được khoảng một năm, và em lo tổ chức các chuyến đi cho lớp. Nên chắc em là người hay giải thích mọi thứ và lo cho mọi việc vào nề nếp.' },
          { who: 'Rowan', voice: 'ie-nam', text: 'I like that. Clear. And what are you hoping to do after you graduate?', vi: 'Anh thích câu đó. Rõ ràng. Thế tốt nghiệp xong em mong làm gì?' },
          { who: 'Thịnh', voice: 'us-nam', text: "I'm hoping to join a graduate programme where I can move between teams. I'd like to try both product work and back-end work before I decide.", vi: 'Em mong vào một chương trình dành cho sinh viên mới tốt nghiệp mà em được luân chuyển giữa các nhóm. Em muốn thử cả mảng sản phẩm lẫn mảng back-end trước khi quyết định.' },
          { who: 'Rowan', voice: 'ie-nam', text: "Right. So here's the awkward bit: our graduate programme closed last Friday.", vi: 'Ừ. Giờ tới đoạn hơi khó nói: chương trình tốt nghiệp của bọn anh đóng đơn thứ Sáu tuần trước rồi.' },
          { who: 'Thịnh', voice: 'us-nam', text: "Oh. I hadn't realised. That's a shame.", vi: 'Ôi. Em không biết. Tiếc quá ạ.' },
          { who: 'Rowan', voice: 'ie-nam', text: "Don't panic. We have a spring intake, and applications open in February. And honestly, a chat like this counts for something.", vi: 'Đừng hoảng. Bọn anh có đợt tuyển mùa xuân, mở đơn vào tháng Hai. Và nói thật, một buổi nói chuyện như thế này cũng có giá trị đấy.' },
          { who: 'Thịnh', voice: 'us-nam', text: "That's good to hear. What would you suggest I do between now and February?", vi: 'Nghe vậy em mừng. Anh khuyên em nên làm gì từ giờ tới tháng Hai ạ?' },
          { who: 'Rowan', voice: 'ie-nam', text: 'Good question. Finish the internship strong, ask your manager for a reference, and keep your LinkedIn up to date. I do actually look.', vi: 'Hỏi hay. Hoàn thành tốt kỳ thực tập, xin quản lý một lời giới thiệu, và cập nhật LinkedIn thường xuyên. Anh có xem thật đấy.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Great. Would it be okay if I emailed you to stay in touch?', vi: 'Tuyệt quá. Em email cho anh để giữ liên lạc có được không ạ?' },
          { who: 'Rowan', voice: 'ie-nam', text: "Absolutely. Here's my card. Put 'career fair' in the subject line so I can find you.", vi: 'Được chứ. Danh thiếp của anh đây. Ghi "career fair" ở dòng tiêu đề để anh tìm ra em nhé.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Will do. Thanks so much for your time, Rowan.', vi: 'Em sẽ làm vậy. Cảm ơn anh rất nhiều vì đã dành thời gian, anh Rowan.' },
          { who: 'Rowan', voice: 'ie-nam', text: "Pleasure. Oh, and Thịnh? 'The person who explains things and gets things organised.' Keep that line. It works.", vi: 'Không có gì. À, Thịnh này? "Người hay giải thích mọi thứ và lo cho mọi việc vào nề nếp." Giữ câu đó nhé. Nó hiệu quả đấy.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd28-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Thịnh kể về mình theo thứ tự nào?',
            options: ['Năm sinh → trường → điểm số', 'Vì sao chọn IT → đang thực tập ở đâu → việc ngoài giờ → một câu tóm mình là người thế nào', 'Mức lương mong muốn → giờ làm', 'Chỉ kể về dự án kỹ thuật'],
            correct: 1,
            why: 'Lần này Thịnh không đọc CV. Câu chốt "**I\'m the person who explains things and gets things organised**" là thứ Rowan nhớ và khen.',
          },
          {
            q: '"Here\'s the awkward bit" báo trước điều gì?',
            options: ['Một câu đùa', 'Một tin không vui: chương trình tốt nghiệp đã đóng đơn', 'Một câu hỏi khó về kỹ thuật', 'Rowan sắp phải đi'],
            correct: 1,
            why: '**the awkward bit** = đoạn khó nói. Sau đó là tin xấu: "our graduate programme **closed last Friday**".',
          },
          {
            q: 'Rowan khuyên Thịnh làm gì từ giờ tới tháng Hai? (chọn câu ĐỦ nhất)',
            options: ['Nộp đơn ngay hôm nay', 'Làm tốt kỳ thực tập, xin quản lý thư giới thiệu, cập nhật LinkedIn', 'Học thêm một ngôn ngữ lập trình', 'Gọi điện cho Rowan mỗi tuần'],
            correct: 1,
            why: '"Finish the internship strong, ask your manager for a **reference**, and keep your **LinkedIn** up to date."',
          },
          {
            q: 'Vì sao Rowan dặn ghi "career fair" ở dòng tiêu đề email?',
            options: ['Để email không vào thư rác', 'Để anh ấy tìm ra email của Thịnh giữa rất nhiều email', 'Vì đó là quy định của công ty', 'Để chuyển cho phòng nhân sự'],
            correct: 1,
            why: '"…**so I can find you**." Người tuyển dụng gặp hàng trăm người mỗi hội chợ. Một dòng tiêu đề rõ giúp họ nhớ ra bạn.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Hàng cà phê: người lạ hoá ra là giám đốc mới' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'man-office-worker', 'man-technologist', 'busts-in-silhouette', 'microphone'],
        caption: '8 giờ 55 sáng thứ Hai, quán cà phê ở tầng trệt toà nhà. Một người đàn ông xếp hàng sau Thịnh bắt chuyện. Thịnh không biết đó là **Spencer** (người Úc). Một tiếng sau, ở buổi họp toàn công ty, **Bianca** (người Canada, nhân sự) giới thiệu người mới.',
      },
      {
        t: 'listen',
        id: 'gtd28-nghe-canh3',
        title: 'Scene 3 — The coffee queue',
        note: 'Nghe xem Thịnh nói điều gì là khó nhất với mình, và vì sao câu đó lại được nhắc tới ở buổi họp toàn công ty.',
        lines: [
          { who: 'Spencer', voice: 'au-nam', text: 'Is this the queue for coffee, or are we all just waiting for something to happen?', vi: 'Đây là hàng mua cà phê, hay tất cả chúng ta đang đứng chờ có chuyện gì đó xảy ra?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Ha, it's the queue. It's always like this at nine. The iced coffee's worth it, though.", vi: 'Ha, hàng cà phê đấy ạ. Chín giờ lúc nào cũng thế. Nhưng cà phê đá đáng để chờ.' },
          { who: 'Spencer', voice: 'au-nam', text: "Good to know. I've been drinking hotel coffee all week, so anything's an upgrade. You work upstairs?", vi: 'Hay đấy. Cả tuần nay tôi uống cà phê khách sạn, nên gì cũng ngon hơn. Cậu làm trên lầu à?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Yes, at Ferncastle. I'm an intern on the booking team. I've been there about three months.", vi: 'Vâng, ở Ferncastle. Em là thực tập sinh nhóm đặt phòng. Em ở đó được khoảng ba tháng.' },
          { who: 'Spencer', voice: 'au-nam', text: 'How are you finding it?', vi: 'Cậu thấy thế nào?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Honestly, harder than I expected, but in a good way. I've been learning more in three months than in a whole year at uni.", vi: 'Thật lòng thì khó hơn em nghĩ, nhưng theo nghĩa tốt. Ba tháng nay em học được nhiều hơn cả một năm ở trường.' },
          { who: 'Spencer', voice: 'au-nam', text: "That's the dream. What's been the hardest part?", vi: 'Thế thì tuyệt. Phần nào khó nhất?' },
          { who: 'Thịnh', voice: 'us-nam', text: "Speaking up, probably. In meetings I usually know what I want to say, but by the time I've translated it in my head, the conversation has moved on.", vi: 'Chắc là lên tiếng ạ. Trong cuộc họp em thường biết mình muốn nói gì, nhưng tới lúc em dịch xong trong đầu thì mọi người đã nói sang chuyện khác.' },
          { who: 'Spencer', voice: 'au-nam', text: "Mate, I've been sitting in meetings for twenty years and that still happens to me. In my own language.", vi: 'Này bạn, tôi ngồi họp hai mươi năm rồi mà chuyện đó vẫn xảy ra với tôi. Bằng chính tiếng mẹ đẻ.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Ha, that makes me feel better. What about you? Are you visiting?', vi: 'Ha, nghe vậy em thấy đỡ hơn. Còn anh thì sao? Anh đến thăm ạ?' },
          { who: 'Spencer', voice: 'au-nam', text: "Sort of. I've just moved over from Sydney. I'm starting a new role here this week.", vi: 'Cũng gần như thế. Tôi vừa chuyển từ Sydney sang. Tuần này tôi bắt đầu một vị trí mới ở đây.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Oh, welcome! Which team?', vi: 'Ồ, chào mừng anh! Nhóm nào ạ?' },
          { who: 'Spencer', voice: 'au-nam', text: "All of them, kind of. Anyway, that's me. Nice chatting… sorry, I didn't get your name.", vi: 'Kiểu như tất cả các nhóm. Thôi, tới lượt tôi rồi. Nói chuyện vui lắm… xin lỗi, tôi chưa biết tên cậu.' },
          { who: 'Thịnh', voice: 'us-nam', text: 'Thịnh. Nice to meet you.', vi: 'Em là Thịnh. Rất vui được gặp anh.' },
          { who: 'Spencer', voice: 'au-nam', text: 'Spencer. Good luck with the speaking up.', vi: 'Tôi là Spencer. Chúc may mắn với chuyện lên tiếng nhé.' },
          { who: 'Bianca', voice: 'ca-nu', text: '…so please give a warm welcome to our new Head of Delivery, Spencer Hale.', vi: '…vậy xin mọi người chào đón Giám đốc Triển khai mới của chúng ta, Spencer Hale.' },
          { who: 'Spencer', voice: 'au-nam', text: "Thanks, Bianca. Morning, everyone. I'll keep it short. I met one of our interns in the coffee queue this morning, and he said that by the time he's translated his idea, the meeting has moved on. So here's my first rule: in my meetings, nobody gets interrupted in their first ten seconds.", vi: 'Cảm ơn Bianca. Chào buổi sáng mọi người. Tôi nói ngắn thôi. Sáng nay tôi gặp một bạn thực tập trong hàng cà phê, và bạn ấy nói rằng tới lúc bạn ấy dịch xong ý của mình thì cuộc họp đã sang chuyện khác. Nên đây là quy tắc đầu tiên của tôi: trong các cuộc họp của tôi, không ai bị ngắt lời trong mười giây đầu.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd28-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: '"How are you finding it?" Spencer hỏi gì?',
            options: ['Cậu tìm đường tới đây thế nào?', 'Cậu thấy công việc thực tập thế nào?', 'Cậu tìm thấy quán cà phê chưa?', 'Cậu có làm mất gì không?'],
            correct: 1,
            why: '**How are you finding + N?** = Bạn thấy … thế nào? (hỏi cảm nhận). Không liên quan tới "tìm".',
          },
          {
            q: 'Thịnh thấy điều gì khó nhất?',
            options: ['Viết code', 'Lên tiếng trong cuộc họp: dịch xong trong đầu thì mọi người đã nói sang chuyện khác', 'Đi làm sớm', 'Hiểu giọng Úc'],
            correct: 1,
            why: '"**by the time I\'ve translated it in my head, the conversation has moved on**." Thịnh nói thật, cụ thể, không than vãn.',
          },
          {
            q: 'Câu "All of them, kind of." là gợi ý cho điều gì?',
            options: ['Spencer chưa được xếp nhóm', 'Spencer là sếp lớn quản lý nhiều nhóm', 'Spencer không biết mình ở nhóm nào', 'Spencer đùa cho vui'],
            correct: 1,
            why: 'Spencer là **Head of Delivery** (Giám đốc Triển khai) mới, phụ trách mọi nhóm. Người giữ chức lớn ở công ty nước ngoài thường không tự xưng chức vụ khi nói chuyện phiếm.',
          },
          {
            q: 'Bài học lớn nhất của Cảnh 3 là gì?',
            options: ['Không nói chuyện với người lạ', 'Một câu nói thật, cụ thể về mình trong hàng cà phê có thể được sếp lớn nhớ và dùng', 'Luôn hỏi chức vụ người khác trước', 'Nên giả vờ mình không gặp khó khăn gì'],
            correct: 1,
            why: 'Thịnh không biết Spencer là ai, chỉ nói chuyện thật và lịch sự. Ở công ty nước ngoài, **ai cũng có thể là sếp**, nên một cuộc chuyện phiếm cũng có thể thành "phỏng vấn" không báo trước.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Ở tốc độ tự nhiên, **I\'ve been** chỉ còn "ai-v-bin", **have** gần như mất hẳn. Câu nào có "for / since / lately" thì đoán trước có "\'ve been + V-ing". Viết hoa, dấu câu không tính.',
      },
      {
        t: 'dictation',
        id: 'gtd28-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — Margot hỏi', spell: "Tell me what you've been up to lately.", answer: "Tell me what you've been up to lately.", alt: ['Tell me what you have been up to lately.'] },
          { label: 'Câu 2 — Thịnh kể', spell: "I've been tutoring two high-school kids in maths every Saturday.", answer: "I've been tutoring two high-school kids in maths every Saturday.", alt: ["I've been tutoring two high school kids in maths every Saturday.", 'I have been tutoring two high-school kids in maths every Saturday.', "I've been tutoring 2 high-school kids in maths every Saturday."] },
          { label: 'Câu 3 — thành ngữ', spell: 'What makes you tick?', answer: 'What makes you tick?' },
          { label: 'Câu 4 — mục tiêu', spell: "I'm hoping to get more confident presenting my work.", answer: "I'm hoping to get more confident presenting my work.", alt: ['I am hoping to get more confident presenting my work.'] },
          { label: 'Câu 5 — tin xấu', spell: 'Our graduate programme closed last Friday.', answer: 'Our graduate programme closed last Friday.', alt: ['Our graduate program closed last Friday.'] },
          { label: 'Câu 6 — Rowan dặn', spell: "Put 'career fair' in the subject line.", answer: 'Put career fair in the subject line.', alt: ["Put 'career fair' in the subject line.", 'Put "career fair" in the subject line.'] },
          { label: 'Câu 7 — Spencer (tên riêng: Sydney)', spell: "I've just moved over from Sydney.", answer: "I've just moved over from Sydney.", alt: ['I have just moved over from Sydney.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Tell me a bit about yourself.', 'Kể **hiện tại, chặng đường, điều bạn quan tâm**. Không phải đọc CV theo năm.', "Sure. At the moment I'm…"],
          ['What have you been up to lately?', 'Dạo này bạn bận gì, làm gì (cả trong lẫn ngoài công việc).', "I've been + V-ing…"],
          ['What makes you tick?', 'Điều gì tạo động lực cho bạn?', "I think it's… / Seeing…"],
          ['What are you hoping to get out of this?', 'Bạn mong nhận được gì từ việc này (kỹ năng, kinh nghiệm)?', "I'm hoping to…"],
          ["That's not nothing.", 'Thế là đáng kể đấy (khen kiểu nói giảm).', "Thanks, I hadn't thought of it that way."],
          ['That says a lot.', 'Điều đó cho thấy nhiều điều tốt về bạn.', 'Thank you.'],
          ["Here's the awkward bit.", 'Sắp có tin không vui.', '(bình tĩnh nghe hết)'],
          ['A chat like this counts for something.', 'Buổi nói chuyện này có giá trị, họ sẽ nhớ.', "That's good to hear."],
          ['How are you finding it?', 'Bạn thấy (công việc, nơi ở) thế nào?', 'Harder than I expected, but in a good way.'],
          ['Nice chatting…', 'Cuộc nói chuyện sắp kết thúc.', 'You too. Have a good day.'],
        ],
        caption: 'Câu hỏi về bản thân ở công ty nước ngoài gần như luôn là **câu hỏi mở**. Người hỏi muốn nghe một câu chuyện ngắn có chi tiết, không muốn nghe danh sách.',
      },
      {
        t: 'note',
        title: 'Mẹo: câu hỏi dài, nhiều ý, có thành ngữ lạ — không nghe kịp thì làm gì',
        items: [
          '**Bắt từ khoá thời gian** để biết họ hỏi về lúc nào: **lately / these days** (gần đây, dùng \'ve been + V-ing) · **how did you end up / get into** (quá khứ) · **looking ahead / hoping to** (tương lai).',
          'Gặp thành ngữ lạ: hỏi lại **đúng cụm đó** như Thịnh: "Sorry, \'what makes me tick\'? I\'m not sure I know that phrase." Không cần xin lỗi dài.',
          'Câu hỏi gồm hai ý: trả lời ý bạn nhớ trước, rồi hỏi: "**And sorry, what was the second part of your question?**"',
          'Cần vài giây nghĩ: "**That\'s a good question. Let me think for a second.**" Im lặng 3 giây sau câu này là hoàn toàn bình thường.',
          'Không chắc mình hiểu đúng: nhắc lại theo ý mình trước khi trả lời: "**Just to check, do you mean my goals for this internship or after I graduate?**"',
          'Giọng Ireland của Rowan đọc "th" gần "t" (three → "tree") và hay nói **Grand** (= tốt, ổn). Giọng Úc của Spencer kéo dài nguyên âm, "day" nghe gần "đai".',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Bản sơ yếu lý lịch', 'CV', 'résumé (resume)', 'CV · résumé'],
          ['Trường đại học', 'uni · university', 'college · school', 'uni'],
          ['Năm cuối', 'final year', 'senior year', 'final year'],
          ['Chương trình cho sinh viên mới ra trường', 'graduate scheme · grad scheme', 'new grad program', 'graduate program · grad program'],
          ['Người viết thư giới thiệu', 'referee', 'reference', 'referee'],
          ['Cách khen mình', "Nói giảm: I'm reasonably good at… (= rất giỏi)", "Thẳng: I'm really good at…", 'Khiêm tốn, kèm câu đùa; khoe nhiều bị coi là "tall poppy"'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi nói về bản thân. Với người Mỹ, nói thẳng điểm mạnh là bình thường. Với người Anh, Úc, nói **có bằng chứng** ("my class asked me to run every trip") nghe dễ chịu hơn "I\'m very good at organising".',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-cs-b2-03 · Switching to IT at Thirty** — chuyện đổi nghề muộn, cách biến quá khứ thành lợi thế khi kể về mình.',
          '**en-b2-01 · Tell Me About a Mistake** — một buổi phỏng vấn xin việc thật sự (khác buổi làm quen hôm nay), nghe để thấy câu hỏi khó và cách hỏi lại nhà tuyển dụng.',
          "**en-cv-c1-01 · Asking for What You're Worth** — nói về giá trị của mình khi bàn lương, thăng chức (C1, nghe thử).",
          "**en-se-a2-01 · Hi, I'm a Developer** — bản tự giới thiệu A2. Nghe lại để thấy bạn đã đi xa thế nào kể từ Ngày 1.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd28-noi',
    kind: 'speaking',
    title: 'Câu chuyện của bạn trong 2 phút',
    goal: 'Nói được câu chuyện của mình trong 2 phút theo 6 bước, dùng hiện tại hoàn thành tiếp diễn để kể việc đang làm gần đây và "I\'m hoping to…" để nói mục tiêu, ở đúng mức với đồng nghiệp, sếp mới hay nhà tuyển dụng.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**30 câu và cụm** để nói hiện tại, chặng đường, việc đang làm, điểm mạnh, mục tiêu, và kết bằng câu hỏi lại.',
          "Một điểm ngữ pháp: **hiện tại hoàn thành tiếp diễn** (I've been + V-ing) và cách nói mục tiêu mềm: **I'm hoping to… · Eventually, I'd like to…**",
          'Nói về mình **khiêm tốn mà không tự hạ mình**: người Việt hay nói "em chẳng giỏi gì", người nghe nước ngoài sẽ tin thật.',
          'Ngôn ngữ cơ thể trong buổi gặp riêng với sếp và ở gian tuyển dụng; khác biệt với sếp Nhật.',
          'Cuối bài: bản 2 phút của chính bạn, nhập vai với Gia sư AI.',
        ],
      },
      {
        t: 'note',
        title: 'Bài này dạy gì, không dạy gì',
        items: [
          'Bài này: nói về bản thân trong **giao tiếp chung**: làm quen sếp mới, nói chuyện ở hội chợ việc làm, chuyện phiếm với người lạ, buổi cà phê với mentor.',
          'Câu hỏi phỏng vấn kỹ thuật, trả lời theo **STAR**, kể về sự cố, giải thích kiến trúc dự án, **system design**: ở Courses **IT Interview Prep** (chương 2 "Kể câu chuyện của bạn", chương 8 "Tiếng Anh trong phỏng vấn") và khoá **Technical English at Work**.',
        ],
      },

      { t: 'h', text: '1. 30 câu và cụm dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo đường đi của câu chuyện về bạn: **bây giờ → chặng đường → dạo này → bạn là người thế nào → mong gì → hỏi lại**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Tell me a bit about yourself.', pos: 'phr', ipa: '/ˌtel mi ə ˈbɪt əˌbaʊt jərˈself/', vi: 'Kể một chút về bạn đi.', ex: 'So, Thịnh, tell me a bit about yourself.', exVi: 'Thịnh này, kể chị nghe một chút về em đi.', more: 'Câu hỏi mở. Trả lời 1–2 phút, không đọc CV.' },
          { w: "At the moment, I'm…", pos: 'phr', ipa: '/ət ðə ˈmoʊmənt aɪm/', vi: 'Hiện giờ mình đang…', ex: "At the moment, I'm in my final year and interning at Ferncastle.", exVi: 'Hiện giờ mình học năm cuối và đang thực tập ở Ferncastle.' },
          { w: "I'm in my final year of…", pos: 'phr', ipa: '/aɪm ɪn maɪ ˌfaɪnl ˈjɪr əv/', vi: 'Mình đang học năm cuối ngành…', ex: "I'm in my final year of software engineering.", exVi: 'Mình đang học năm cuối ngành kỹ thuật phần mềm.', anh: 'graduation-cap' },
          { w: 'What have you been up to lately?', pos: 'phr', ipa: '/ˌwʌt əv ju bɪn ˈʌp tə ˈleɪtli/', vi: 'Dạo này bạn làm gì, bận gì?', ex: 'Long time no see! What have you been up to lately?', exVi: 'Lâu quá không gặp! Dạo này bạn làm gì?' },
          { w: "I've been + V-ing + for / since…", pos: 'phr', ipa: '/aɪv bɪn/', vi: 'Mình đã và đang… (từ… / được…)', ex: "I've been tutoring kids in maths for about a year.", exVi: 'Mình dạy kèm toán cho mấy em nhỏ được khoảng một năm rồi.' },
          { w: 'For the past (year / few months), …', pos: 'phr', ipa: '/fər ðə ˈpæst/', vi: '(Một năm / mấy tháng) gần đây…', ex: "For the past three months, I've been interning on the booking team.", exVi: 'Ba tháng gần đây mình thực tập ở nhóm đặt phòng.' },
          { w: 'These days, I mostly…', pos: 'phr', ipa: '/ˈðiːz deɪz aɪ ˈmoʊstli/', vi: 'Dạo này mình chủ yếu…', ex: 'These days, I mostly work on the screens hotel staff use.', exVi: 'Dạo này mình chủ yếu làm các màn hình nhân viên khách sạn dùng.' },
          { w: "I've just started… / I've just moved…", pos: 'phr', ipa: '/aɪv ˈdʒʌst/', vi: 'Mình vừa mới bắt đầu… / vừa chuyển…', ex: "I've just moved over from Sydney.", exVi: 'Tôi vừa chuyển từ Sydney sang.' },
          { w: "I've always been into…", pos: 'phr', ipa: '/aɪv ˈɔːlweɪz bɪn ˈɪntuː/', vi: 'Mình luôn mê… (từ trước tới nay)', ex: "I've always been into figuring out how things work.", exVi: 'Mình luôn mê tìm hiểu mọi thứ vận hành thế nào.' },
          { w: "That's how I got into…", pos: 'phr', ipa: '/ðæts ˈhaʊ aɪ ɡɑːt ˈɪntuː/', vi: 'Đó là cách mình đến với…', ex: "I fixed my mum's old laptop, and that's how I got into IT.", exVi: 'Mình sửa cái laptop cũ của mẹ, và đó là cách mình đến với IT.' },
          { w: '…, which is why…', pos: 'phr', ipa: '/wɪtʃ ɪz ˈwaɪ/', vi: '…, đó là lý do…', ex: 'I love explaining things, which is why I started tutoring.', exVi: 'Mình thích giải thích mọi thứ, đó là lý do mình đi dạy kèm.' },
          { w: 'How did you end up…?', pos: 'phr', ipa: '/ˈhaʊ dɪd ju ˌend ˈʌp/', vi: 'Sao bạn lại tới / làm… vậy?', ex: 'How did you end up in Ho Chi Minh City?', exVi: 'Sao bạn lại tới TP.HCM vậy?' },
          { w: 'What makes you tick?', pos: 'phr', ipa: '/ˌwʌt meɪks ju ˈtɪk/', vi: 'Điều gì tạo động lực cho bạn?', ex: "What makes you tick? — Seeing people actually use what I've built.", exVi: 'Điều gì tạo động lực cho bạn? — Thấy người ta dùng thật thứ mình làm ra.' },
          { w: "I'm the kind of person who…", pos: 'phr', ipa: '/aɪm ðə ˈkaɪnd əv ˈpɝːsn huː/', vi: 'Mình là kiểu người…', ex: "I'm the kind of person who likes to have a plan B.", exVi: 'Mình là kiểu người thích có phương án dự phòng.' },
          { w: 'My friends usually ask me to…', pos: 'phr', ipa: '/maɪ ˈfrendz ˈjuːʒuəli ˈæsk mi tə/', vi: 'Bạn bè thường nhờ mình…', ex: 'My friends usually ask me to organise our trips.', exVi: 'Bạn bè thường nhờ mình tổ chức các chuyến đi.', more: 'Cách nói điểm mạnh **có bằng chứng**, không khoe.' },
          { w: "I'm still working on…", pos: 'phr', ipa: '/aɪm ˈstɪl ˈwɝːkɪŋ ɑːn/', vi: 'Mình vẫn đang cải thiện…', ex: "I'm still working on speaking up in meetings.", exVi: 'Mình vẫn đang tập lên tiếng trong các cuộc họp.', more: 'Nói điểm yếu kèm việc đang làm để sửa.' },
          { w: 'step out of my comfort zone', pos: 'phr', ipa: '/ˌstep aʊt əv maɪ ˈkʌmfərt zoʊn/', vi: 'bước ra khỏi vùng an toàn', ex: 'Presenting in English really makes me step out of my comfort zone.', exVi: 'Trình bày bằng tiếng Anh thật sự bắt mình bước ra khỏi vùng an toàn.' },
          { w: "I'm hoping to…", pos: 'phr', ipa: '/aɪm ˈhoʊpɪŋ tə/', vi: 'Mình mong là sẽ…', ex: "I'm hoping to join a graduate programme next year.", exVi: 'Mình mong năm sau vào được một chương trình cho sinh viên mới tốt nghiệp.', more: 'Mềm hơn "I want to", tự tin hơn "I hope I can".' },
          { w: "Eventually, I'd like to…", pos: 'phr', ipa: '/ɪˈventʃuəli aɪd ˈlaɪk tə/', vi: 'Về lâu dài, mình muốn…', ex: "Eventually, I'd like to lead a small team.", exVi: 'Về lâu dài, mình muốn dẫn dắt một nhóm nhỏ.', more: '**eventually** = cuối cùng, về lâu dài. Không phải "có thể" (đó là possibly).' },
          { w: 'get … out of (something)', pos: 'v', ipa: '/ˌɡet … ˈaʊt əv/', vi: 'nhận được… từ (việc gì)', ex: 'What are you hoping to get out of this internship?', exVi: 'Bạn mong nhận được gì từ kỳ thực tập này?' },
          { w: "I'm really keen to…", pos: 'phr', ipa: '/aɪm ˈrɪəli ˈkiːn tə/', vi: 'Mình rất háo hức muốn…', ex: "I'm really keen to try product work.", exVi: 'Mình rất muốn thử làm mảng sản phẩm.', more: "Anh, Úc dùng nhiều. Mỹ hay nói **I'm really excited to…**" },
          { w: "I'm still figuring out…", pos: 'phr', ipa: '/aɪm ˈstɪl ˈfɪɡjərɪŋ aʊt/', vi: 'Mình vẫn đang tìm hiểu xem…', ex: "I'm still figuring out whether I prefer front-end or back-end.", exVi: 'Mình vẫn đang xem mình hợp front-end hay back-end hơn.', more: 'Thành thật "chưa biết" kèm kế hoạch thử là câu trả lời tốt.' },
          { w: "That's me in a nutshell.", pos: 'phr', ipa: '/ðæts ˈmiː ɪn ə ˈnʌtʃel/', vi: 'Tóm gọn về mình là vậy.', ex: "So yeah, that's me in a nutshell. How about you?", exVi: 'Vậy đó, tóm gọn về mình là thế. Còn bạn?' },
          { w: 'How about you? How did you end up here?', pos: 'phr', ipa: '/ˈhaʊ əbaʊt ˈjuː/', vi: 'Còn anh/chị? Sao anh/chị lại tới đây?', ex: "That's me. How about you? How did you end up in Vietnam?", exVi: 'Em là vậy đó. Còn anh? Sao anh lại tới Việt Nam?' },
          { w: 'Would it be okay if I…?', pos: 'phr', ipa: '/wʊd ɪt bi oʊˈkeɪ ɪf aɪ/', vi: 'Em … có được không ạ?', ex: 'Would it be okay if I emailed you to stay in touch?', exVi: 'Em email cho anh để giữ liên lạc có được không ạ?', anh: 'e-mail' },
          { w: 'stay in touch', pos: 'v', ipa: '/ˌsteɪ ɪn ˈtʌtʃ/', vi: 'giữ liên lạc', ex: "Let's stay in touch. Here's my card.", exVi: 'Mình giữ liên lạc nhé. Danh thiếp của tôi đây.', anh: 'handshake' },
          { w: 'graduate programme', pos: 'n', ipa: '/ˈɡrædʒuət ˌproʊɡræm/', vi: 'chương trình tuyển sinh viên mới tốt nghiệp', ex: 'Their graduate programme rotates you through three teams.', exVi: 'Chương trình của họ cho bạn luân chuyển qua ba nhóm.', more: '**graduate** danh từ đọc /-ət/; động từ đọc /-eɪt/.' },
          { w: 'intake', pos: 'n', ipa: '/ˈɪnteɪk/', vi: 'đợt tuyển, đợt nhận người', ex: 'The spring intake opens in February.', exVi: 'Đợt tuyển mùa xuân mở vào tháng Hai.' },
          { w: 'reference', pos: 'n', ipa: '/ˈrefrəns/', vi: 'thư / lời giới thiệu (của sếp, thầy)', ex: 'Could you be a reference for me?', exVi: 'Anh có thể làm người giới thiệu cho em không?', anh: 'page-facing-up' },
          { w: 'a junior developer / a recent graduate', pos: 'n', ipa: '/ə ˈdʒuːnjər dɪˈveləpər/', vi: 'lập trình viên mới vào nghề / người mới tốt nghiệp', ex: "I'm a recent graduate looking for my first full-time role.", exVi: 'Mình mới tốt nghiệp, đang tìm công việc toàn thời gian đầu tiên.', more: 'Đừng nói "**fresher**": ở Anh, fresher là **sinh viên năm nhất**.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Nói về mình với **bạn cùng nhóm lúc ăn trưa** khác với **buổi gặp sếp mới**, và khác với **người tuyển dụng hay giám đốc**. Nội dung giống nhau; độ dài, từ ngữ và mức "khoe" thì khác.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (đồng nghiệp ngang hàng)', 'Trung tính (sếp mới, mentor)', 'Trang trọng (nhà tuyển dụng, giám đốc)'],
        rows: [
          ['Hiện tại', "I'm the new intern on booking.", "I'm in my final year, and I've been interning here for three months.", "I'm a final-year software engineering student, currently interning at Ferncastle."],
          ['Dạo này', "I've been doing loads of testing lately.", "Lately I've been working on the hotel check-in screens.", 'Over the past three months, I have been contributing to a booking platform for small hotels.'],
          ['Điểm mạnh', "I'm kind of the organiser in my class.", 'My friends usually ask me to organise things.', 'I am often the person who coordinates group projects.'],
          ['Điểm yếu', 'Meetings in English still freak me out a bit.', "I'm still working on speaking up in meetings.", 'One area I am actively developing is presenting in English.'],
          ['Mục tiêu', 'I wanna try product stuff next.', "I'm hoping to get more confident presenting my work.", 'In the long term, I would like to move into a product role.'],
          ['Kết', "Anyway, that's me. You?", "That's me in a nutshell. How about you?", 'I would be very interested to hear more about your graduate programme.'],
        ],
        caption: 'Cột trang trọng viết đủ "I am / I would", không rút gọn, không "wanna". Nhưng với người tuyển dụng ở hội chợ (như Rowan) thì **trung tính** là vừa: họ muốn nói chuyện như người với người.',
      },
      {
        t: 'note',
        title: 'Mẹo: khiêm tốn kiểu Việt, nghe trong tai người nước ngoài',
        items: [
          '"**I\'m not good at anything**" (em chẳng giỏi gì): người Việt nói để lịch sự; người Anh, Mỹ, Úc **tin thật**, và họ không có lý do gì để tin khác.',
          'Cách giữ khiêm tốn mà vẫn cho người ta thấy điểm mạnh: **đưa bằng chứng thay vì đưa tính từ**. Không nói "I\'m very responsible", mà nói "My class has asked me to run every trip since first year."',
          'Điểm yếu: nói **một** điều thật, kèm **việc đang làm để sửa**: "I\'m still working on speaking up in meetings, so I\'ve started preparing one question before each meeting."',
          'Chưa biết mình muốn gì sau này? Nói thật kèm kế hoạch: "**I\'m still figuring that out, which is why I\'m hoping to try a few different teams.**" Câu này nghe trưởng thành hơn một mục tiêu bịa ra.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Khi nói về mình, bạn hay cần nói một việc **bắt đầu từ trước, kéo tới bây giờ và vẫn đang tiếp diễn**: đang dạy kèm, đang thực tập, đang học. Tiếng Việt chỉ cần "đang… được một năm rồi". Tiếng Anh dùng **have / has been + V-ing**, kèm **for** (khoảng thời gian) hoặc **since** (mốc bắt đầu).',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + have / has been + V-ing + for / since…',
            vi: "Việc bắt đầu trong quá khứ, vẫn đang tiếp diễn. Khi nói: I've been, she's been.",
            examples: [
              { en: "I've been tutoring kids in maths for about a year.", vi: 'Mình dạy kèm toán được khoảng một năm rồi.' },
              { en: "I've been running the class trips since first year.", vi: 'Từ năm nhất mình đã lo các chuyến đi của lớp.' },
              { en: "She's been living in Saigon for eight months.", vi: 'Chị ấy sống ở Sài Gòn được tám tháng.' },
            ],
          },
          {
            formula: 'What / How long + have you been + V-ing?',
            vi: 'Hỏi lại người kia về việc họ đang làm gần đây.',
            examples: [
              { en: 'What have you been working on lately?', vi: 'Dạo này bạn đang làm gì?' },
              { en: 'How long have you been living in Vietnam?', vi: 'Bạn sống ở Việt Nam bao lâu rồi?' },
              { en: 'What have you been up to since we last met?', vi: 'Từ lần trước gặp tới giờ bạn làm gì?' },
            ],
          },
          {
            formula: 'S + have been + V-ing  ↔  S + have + V3 + số lượng',
            vi: 'Tiếp diễn = quá trình, chưa xong. Hoàn thành = kết quả, đếm được.',
            examples: [
              { en: "I've been reading about UX design.", vi: 'Mình đang đọc về thiết kế trải nghiệm (vẫn đọc).' },
              { en: "I've read three books on UX design.", vi: 'Mình đã đọc ba cuốn về thiết kế trải nghiệm (kết quả).' },
              { en: "I've been tutoring for a year, and I've helped four students pass their exams.", vi: 'Mình dạy kèm một năm và đã giúp bốn em thi đỗ.' },
            ],
          },
          {
            formula: "I'm hoping to + V · Eventually, I'd like to + V",
            vi: "Mục tiêu gần (hoping to) và mục tiêu xa (eventually, I'd like to).",
            examples: [
              { en: "I'm hoping to get more confident presenting in English.", vi: 'Mình mong tự tin hơn khi trình bày bằng tiếng Anh.' },
              { en: "I'm hoping to try both product and back-end work.", vi: 'Mình mong được thử cả mảng sản phẩm lẫn back-end.' },
              { en: "Eventually, I'd like to mentor new interns.", vi: 'Về lâu dài, mình muốn hướng dẫn các bạn thực tập mới.' },
            ],
          },
          {
            formula: "I've always been + adj / into + N",
            vi: 'Nói một nét "từ trước tới nay" của mình, mở đầu phần chặng đường.',
            examples: [
              { en: "I've always been curious about how things work.", vi: 'Mình luôn tò mò mọi thứ vận hành thế nào.' },
              { en: "I've always been into puzzles and games.", vi: 'Mình luôn mê câu đố và trò chơi.' },
              { en: "I've always been the organiser in my group.", vi: 'Mình luôn là người lo tổ chức trong nhóm.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Động từ', 'Dùng tiếp diễn được?', 'Câu đúng'],
        rows: [
          ['work, study, learn, tutor, live, run', '✅ Được', "I've been studying IT for four years."],
          ['know', '❌ Không', "I've known Margot since March. (~~I've been knowing~~)"],
          ['have (= sở hữu)', '❌ Không', "I've had this laptop since first year."],
          ['like, love, want', '❌ Thường không', "I've always loved maths. (~~I've been loving~~)"],
          ['be', '❌ Không (dùng been)', "I've been an intern here for three months."],
        ],
        caption: "Động từ chỉ **trạng thái** (biết, có, thích, là) không dùng dạng -ing. Dùng hiện tại hoàn thành thường: I've known, I've had, I've been.",
      },
      {
        t: 'rule',
        formula: "S + have / has been + V-ing + for / since… · I'm hoping to + V",
        vi: "Việc đang làm kéo dài tới nay: 've been + V-ing (for + khoảng, since + mốc). Mục tiêu: I'm hoping to + V (gần), Eventually, I'd like to + V (xa).",
      },
      {
        t: 'note',
        title: "Nối câu hôm nay: which is why · that's how · since then · eventually",
        items: [
          '**…, which is why…** nối **lý do → lựa chọn**: "I love explaining things, **which is why** I started tutoring."',
          '**…, and that\'s how…** chốt một chặng: "My neighbour asked me to help her son, **and that\'s how** I started tutoring."',
          '**since then, …** nối quá khứ với hiện tại, thường đi với \'ve been + V-ing: "**Since then**, I\'ve been tutoring every Saturday."',
          '**eventually** đặt đầu câu khi nói mục tiêu xa: "**Eventually**, I\'d like to lead a team." Người Việt hay hiểu nhầm là "có lẽ".',
          'Ba từ nối này giúp câu chuyện 2 phút **chảy**, thay vì một danh sách "In 2022… In 2023…".',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd28-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "S + have been + V-ing + for / since · I'm hoping to + V · …, which is why…",
        items: [
          { q: 'Mình thực tập ở đây được ba tháng rồi.', hint: "I've been, intern, for", answers: ["I've been interning here for three months.", 'I have been interning here for three months.', "I've been interning here for 3 months.", "I've been an intern here for three months.", "I've been doing an internship here for three months.", "I've been working here as an intern for three months."] },
          { q: 'Dạo này bạn làm gì?', hint: 'up to, lately', answers: ['What have you been up to lately?', 'What have you been up to?', 'What have you been doing lately?', 'What have you been up to recently?'] },
          { q: 'Mình mong tự tin hơn khi nói trong các cuộc họp.', hint: "I'm hoping to, confident, speaking", answers: ["I'm hoping to get more confident speaking in meetings.", "I'm hoping to become more confident speaking in meetings.", "I'm hoping to be more confident speaking in meetings.", "I'm hoping to feel more confident speaking in meetings.", "I'm hoping to get more confident speaking up in meetings.", "I'm hoping to be more confident when speaking in meetings."] },
          { q: 'Mình quen chị ấy từ năm nhất.', hint: "I've known, since", answers: ["I've known her since first year.", 'I have known her since first year.', "I've known her since my first year.", "I've known her since the first year."] },
          { q: 'Mình thích giải thích mọi thứ, đó là lý do mình đi dạy kèm.', hint: 'which is why, tutoring', answers: ['I love explaining things, which is why I started tutoring.', 'I like explaining things, which is why I started tutoring.', 'I love explaining things, which is why I tutor.', 'I like explaining things, which is why I tutor.', 'I enjoy explaining things, which is why I started tutoring.', 'I love explaining things, which is why I do tutoring.'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 9 lỗi thật khi nói về bản thân',
        items: [
          "~~I study here since 2022.~~ / ~~I am studying here since 2022.~~ → **I've been studying here since 2022.** Có since / for kéo tới nay thì dùng hiện tại hoàn thành (tiếp diễn).",
          "~~I have been knowing him for two years.~~ → **I've known him for two years.** know, have, like, be không dùng -ing.",
          '~~I was born in 2004 in… In 2022 I entered university…~~ → mở bằng **hiện tại**: "At the moment I\'m in my final year…". Kể theo năm là đọc CV.',
          "~~I'm a fresher.~~ → **I'm a recent graduate. / a junior developer.** Ở Việt Nam \"fresher\" là người mới vào nghề; ở Anh, fresher là **sinh viên năm nhất**.",
          '~~My hobbies are reading books, listening to music and travelling.~~ → chọn **một** sở thích có chi tiết: "**I\'ve been getting into** street photography lately." Ba sở thích chung chung không ai nhớ.',
          "~~I hope I will become a leader.~~ → **I'm hoping to lead a small team one day.** Tự nhiên hơn, rõ hơn.",
          "~~I want to learn more experience.~~ → **I want to gain more experience.** / **I'm hoping to learn a lot.** experience đi với gain, get, không đi với learn.",
          "~~I'm not good at anything special.~~ → nói một điểm mạnh **có bằng chứng**. Khiêm tốn kiểu này bị hiểu theo nghĩa đen.",
          "~~Thank you for listening.~~ (kết thúc phần nói về mình trong một cuộc trò chuyện) → **That's me in a nutshell. How about you?** Đây là trò chuyện, không phải thuyết trình.",
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi nói về mình' },
      {
        t: 'p',
        text: 'Khi bạn nói về mình, người nghe nhìn **tư thế và ánh mắt** để đoán bạn có tự tin, có thật lòng không. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ trong buổi gặp sếp, ở gian tuyển dụng',
        items: [
          { anh: 'handshake', w: "Hi Rowan, I'm Thịnh. Nice to meet you.", ro: '', vi: 'Ở gian tuyển dụng: bước tới, bắt tay chắc, nhìn mắt, nói tên mình. Đừng đứng xa chờ được gọi.' },
          { anh: 'eyes', w: "At the moment, I'm in my final year.", ro: '/ət ðə ˈmoʊmənt aɪm ɪn maɪ ˌfaɪnl ˈjɪr/', vi: 'Nhìn người nghe khi nói về mình. Nhìn xuống bàn kiểu "em không dám" bị hiểu là thiếu tự tin hoặc không thật.' },
          { anh: 'person-standing', w: '(đứng thẳng, hai tay thả lỏng)', ro: '', vi: 'Đứng thẳng, vai mở, tay để lộ. Khoanh tay trước ngực dễ bị hiểu là phòng thủ.' },
          { anh: 'open-hands', w: "I'm the person who explains things.", ro: '', vi: 'Bàn tay mở khi nói điểm mạnh: trông thật lòng, không khoe.' },
          { anh: 'writing-hand', w: 'Do you mind if I take a few notes?', ro: '', vi: 'Ghi chép trong buổi gặp sếp là **tốt**. Hỏi một câu trước khi viết, và đừng cúi vào sổ suốt.' },
          { anh: 'mobile-phone', w: '(đừng làm) đọc bài tự giới thiệu trên điện thoại', ro: '', vi: 'Đọc từ điện thoại = học thuộc. Nhớ **6 ý**, không nhớ từng chữ.' },
          { anh: 'person-bowing', w: 'Thank you for your time, Morita-san.', ro: '', vi: 'Với sếp người Nhật: cúi nhẹ khi chào và cảm ơn; đưa, nhận danh thiếp **bằng hai tay**, đọc tên trước khi cất.' },
          { anh: 'slightly-smiling-face', w: "That's me in a nutshell. How about you?", ro: '', vi: 'Mỉm cười và hỏi lại. Kết bằng câu hỏi biến "bài nói" thành một cuộc trò chuyện.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Nói điểm mạnh của mình', 'Ngại, hay chối "em chẳng giỏi gì".', 'Mong bạn nói rõ; Mỹ thẳng hơn, Anh – Úc thích có bằng chứng.', 'Khiêm tốn là bình thường; nói qua thành tích của nhóm.'],
          ['Ánh mắt với sếp', 'Nhìn xuống là lễ phép.', 'Nhìn mắt = tự tin, thật lòng.', 'Nhìn vừa phải, không nhìn chằm chằm.'],
          ['Nói về mục tiêu cá nhân', 'Ít nói, sợ bị cho là tham vọng.', 'Được khuyến khích; sếp hỏi để giúp bạn đạt được.', 'Nói về đóng góp cho nhóm trước, mục tiêu riêng sau.'],
          ['Gọi tên sếp', 'Anh / chị + tên.', 'Tên riêng: Margot, Spencer.', 'Họ + san: Morita-san.'],
          ['Danh thiếp', 'Nhận một tay cũng được.', 'Nhận một tay, cất ngay cũng không sao.', 'Hai tay, đọc kỹ, không viết lên danh thiếp.'],
        ],
        caption: 'Sếp Anh – Mỹ – Úc hỏi "What are you hoping to get out of this?" là **thật lòng muốn giúp**. Trả lời "Em làm gì cũng được ạ" là bỏ lỡ cơ hội.',
      },

      { t: 'h', text: "6. Phát âm: 've been nhẹ, graduate hai cách đọc, nhấn đúng từ khoá" },
      {
        t: 'p',
        text: "**I've been** đọc liền \"ai-v-bin\" (Mỹ /bɪn/, Anh hay /biːn/). Các từ hay sai trọng âm khi nói về nghề nghiệp: ca**REER**, ex**PE**rience, **MA**nager, e**VEN**tually. Và **graduate**: danh từ /ˈɡrædʒuət/, động từ /ˈɡrædʒueɪt/.",
      },
      {
        t: 'phatam',
        id: 'gtd28-phat-am',
        title: 'Luyện phát âm — câu nói về bản thân (9 câu)',
        note: "Bấm \"Nghe mẫu\" rồi \"Đọc & chấm\". Nhấn vào từ mang thông tin (thời gian, việc, mục tiêu), đọc nhẹ I've, been, to, for.",
        items: [
          { text: "I've been interning here for three months.", ipa: 'aɪv bɪn ɪntɝːnɪŋ hɪr fər θriː mʌnθs', vi: "I've‿been nối · for nhẹ /fər/ · months: /nθs/ khó, đọc chậm" },
          { text: "I've been tutoring kids since first year.", ipa: 'aɪv bɪn tuːtərɪŋ kɪdz sɪns fɝːst jɪr', vi: 'tutoring Mỹ đọc /ˈtuːtərɪŋ/ · since /sɪns/ có /s/ cuối' },
          { text: "I'm hoping to get more confident.", ipa: 'aɪm hoʊpɪŋ tə ɡet mɔːr kɑːnfɪdənt', vi: 'to nhẹ /tə/ · nhấn **CON**fident' },
          { text: "Eventually, I'd like to lead a small team.", ipa: 'ɪventʃuəli aɪd laɪk tə liːd ə smɔːl tiːm', vi: "e**VEN**tually · I'd có /d/ nhẹ" },
          { text: "I'm a recent graduate.", ipa: 'aɪm ə riːsnt ɡrædʒuət', vi: 'graduate danh từ: đuôi /-ət/, không phải /-eɪt/' },
          { text: 'I graduate next June.', ipa: 'aɪ ɡrædʒueɪt nekst dʒuːn', vi: 'graduate động từ: đuôi /-eɪt/' },
          { text: "I'm hoping to build a career in product.", ipa: 'aɪm hoʊpɪŋ tə bɪld ə kərɪr ɪn prɑːdʌkt', vi: 'ca**REER** /kəˈrɪr/, đừng đọc giống Korea' },
          { text: 'What makes you tick?', ipa: 'wʌt meɪks ju tɪk', vi: 'nhấn **tick**, makes có /ks/' },
          { text: "That's me in a nutshell.", ipa: 'ðæts miː ɪn ə nʌtʃel', vi: 'me‿in nối · nhấn **nut**' },
        ],
      },

      { t: 'h', text: '7. Câu chuyện 2 phút: 6 bước' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Ngày 1 và Ngày 28',
        caption: 'Bản 30 giây cho biết bạn **là ai**. Bản 2 phút cho biết bạn **đã đi tới đây thế nào và muốn đi đâu**.',
        cols: [
          { title: 'Ngày 1 — 30 giây (A2)', anh: 'name-badge', items: ['Chào + tên', 'Vai trò ở đây', 'Quê / trường', 'Một điều về mình', 'Hỏi lại'] },
          { title: 'Ngày 28 — 2 phút (B2)', anh: 'compass', items: ['Hiện tại (At the moment…)', "Chặng đường (that's how…)", "Dạo này (I've been + V-ing)", 'Mình là người thế nào + bằng chứng', "Mục tiêu (I'm hoping to… eventually…)", 'Hỏi lại'] },
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: '6 bước, khoảng 2 phút',
        caption: 'Mỗi bước 2–3 câu. Bước 4 là chỗ bạn **khác người khác**: một chi tiết thật, không phải tính từ.',
        steps: [
          { label: '1. Hiện tại', sub: "At the moment I'm in my final year, interning at Ferncastle." },
          { label: '2. Chặng đường', sub: "I fixed my mum's laptop, and that's how I got into IT." },
          { label: '3. Dạo này', sub: "Lately I've been working on check-in screens." },
          { label: '4. Mình là ai + bằng chứng', sub: 'My class has asked me to run every trip since first year.' },
          { label: '5. Mục tiêu', sub: "I'm hoping to… Eventually, I'd like to…" },
          { label: '6. Hỏi lại', sub: "That's me in a nutshell. How about you?" },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "At the moment, I'm in my final year of software engineering, and for the past three months I've been interning at Ferncastle.", vi: 'Hiện giờ em học năm cuối kỹ thuật phần mềm, và ba tháng nay em thực tập ở Ferncastle.' },
          { en: "I've always been curious about how things work. When I was fifteen, I took apart my mum's old laptop to fix the fan, and that's how I got into IT.", vi: 'Em luôn tò mò mọi thứ vận hành thế nào. Năm mười lăm tuổi, em tháo laptop cũ của mẹ để sửa quạt, và đó là cách em đến với IT.' },
          { en: "Lately, I've been working on the screens hotel staff use to check guests in, so I've been talking to real users a lot.", vi: 'Dạo này em làm các màn hình nhân viên khách sạn dùng để làm thủ tục cho khách, nên em nói chuyện với người dùng thật nhiều.' },
          { en: "Outside of work, I've been tutoring two high-school students in maths every Saturday, which is why I'm quite good at explaining things simply.", vi: 'Ngoài công việc, em dạy kèm toán cho hai em cấp ba mỗi thứ Bảy, nên em khá giỏi giải thích mọi thứ cho đơn giản.' },
          { en: "I'm still working on speaking up in meetings, so I've started preparing one question before every meeting.", vi: 'Em vẫn đang tập lên tiếng trong cuộc họp, nên em bắt đầu chuẩn bị sẵn một câu hỏi trước mỗi buổi họp.' },
          { en: "I'm hoping to join a graduate programme where I can try different teams. Eventually, I'd like to help new interns, the way my mentor helped me.", vi: 'Em mong vào một chương trình cho sinh viên mới tốt nghiệp được thử nhiều nhóm. Về lâu dài, em muốn giúp các bạn thực tập mới, như anh mentor đã giúp em.' },
          { en: "So that's me in a nutshell. How about you? How did you end up in Vietnam?", vi: 'Tóm gọn về em là vậy. Còn anh/chị? Sao anh/chị lại tới Việt Nam?' },
        ],
      },
      {
        t: 'p',
        text: "Giờ viết **bản 2 phút của chính bạn**: điền 6 bước, mỗi bước 2–3 câu, ít nhất **2 câu 've been + V-ing** và **1 câu I'm hoping to**. Đọc to và bấm giờ. Lần 3 chỉ nhìn **6 từ khoá** (now · path · lately · proof · hope · you?).",
      },

      { t: 'h', text: '8. Nhập vai: gọi video làm quen với quản lý mới' },
      {
        t: 'dialogue',
        title: 'Cuộc gọi 1:1 đầu tiên — Natasha, quản lý mới ở văn phòng Singapore',
        lines: [
          { who: 'Natasha', role: 'b', text: 'Hi Thịnh! Can you hear me okay? Great. I just wanted a quick chat to get to know you. What have you been working on?', vi: 'Chào Thịnh! Em nghe rõ không? Tốt. Chị chỉ muốn nói chuyện nhanh để làm quen. Dạo này em làm gì?' },
          { who: 'Thịnh', role: 'a', text: "Hi Natasha. For the past three months, I've been working on the check-in screens for the hotel app.", vi: 'Chào chị Natasha. Ba tháng nay em làm các màn hình làm thủ tục nhận phòng cho ứng dụng khách sạn.' },
          { who: 'Natasha', role: 'b', text: 'Nice. And how did you end up in IT?', vi: 'Hay đấy. Mà sao em lại vào ngành IT?' },
          { who: 'Thịnh', role: 'a', text: "I've always been curious about how things work. I fixed my mum's old laptop when I was fifteen, and that's how I got into it.", vi: 'Em luôn tò mò mọi thứ vận hành thế nào. Năm mười lăm tuổi em sửa cái laptop cũ của mẹ, và đó là cách em đến với nó.' },
          { who: 'Natasha', role: 'b', text: 'Ha, classic. Did it work afterwards?', vi: 'Ha, kinh điển. Sửa xong nó có chạy không?' },
          { who: 'Thịnh', role: 'a', text: 'Eventually. After I had taken it apart three times.', vi: 'Cuối cùng thì có ạ. Sau khi em tháo ra lắp vào ba lần.' },
          { who: 'Natasha', role: 'b', text: "That's the spirit. So what are you hoping to get out of this internship?", vi: 'Đúng tinh thần đấy. Vậy em mong nhận được gì từ kỳ thực tập này?' },
          { who: 'Thịnh', role: 'a', text: "I'm hoping to get more confident presenting my work. I'm still working on speaking up in meetings.", vi: 'Em mong tự tin hơn khi trình bày công việc. Em vẫn đang tập lên tiếng trong các cuộc họp.' },
          { who: 'Natasha', role: 'b', text: "That's honest, I like it. And longer term?", vi: 'Thành thật đấy, chị thích. Còn về lâu dài?' },
          { who: 'Thịnh', role: 'a', text: "Eventually, I'd like to mentor new interns. That's me in a nutshell. How about you? How long have you been in Singapore?", vi: 'Về lâu dài, em muốn hướng dẫn các bạn thực tập mới. Tóm gọn về em là vậy. Còn chị? Chị ở Singapore bao lâu rồi?' },
          { who: 'Natasha', role: 'b', text: "Six years now. I moved from Perth for a job and never left. Right, let's set up a fortnightly catch-up.", vi: 'Sáu năm rồi. Chị từ Perth sang vì công việc rồi ở luôn. Rồi, mình hẹn hai tuần gặp nhau một lần nhé.' },
          { who: 'Thịnh', role: 'a', text: 'Sounds great. Thanks for your time, Natasha.', vi: 'Hay quá ạ. Cảm ơn chị đã dành thời gian, chị Natasha.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd28-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Thịnh (5 câu)',
        items: [
          { vi: 'Natasha: "What have you been working on?" → Bạn: Ba tháng nay em làm các màn hình nhận phòng.', chips: ['For', 'the', 'past', 'three', 'months,', "I've", 'been', 'working', 'on', 'the', 'check-in', 'screens.', 'worked', 'since'], answer: ['For', 'the', 'past', 'three', 'months,', "I've", 'been', 'working', 'on', 'the', 'check-in', 'screens.'] },
          { vi: 'Bạn: Em luôn tò mò mọi thứ vận hành thế nào.', chips: ["I've", 'always', 'been', 'curious', 'about', 'how', 'things', 'work.', 'being', 'what'], answer: ["I've", 'always', 'been', 'curious', 'about', 'how', 'things', 'work.'] },
          { vi: 'Bạn: …và đó là cách em đến với nó.', chips: ['and', "that's", 'how', 'I', 'got', 'into', 'it.', 'what', 'went'], answer: ['and', "that's", 'how', 'I', 'got', 'into', 'it.'] },
          { vi: 'Natasha: "What are you hoping to get out of this?" → Bạn: Em mong tự tin hơn khi trình bày công việc.', chips: ["I'm", 'hoping', 'to', 'get', 'more', 'confident', 'presenting', 'my', 'work.', 'hope', 'will'], answer: ["I'm", 'hoping', 'to', 'get', 'more', 'confident', 'presenting', 'my', 'work.'] },
          { vi: 'Bạn: Còn chị? Chị ở Singapore bao lâu rồi?', chips: ['How', 'long', 'have', 'you', 'been', 'in', 'Singapore?', 'are', 'did'], answer: ['How', 'long', 'have', 'you', 'been', 'in', 'Singapore?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd28-noi-tra-loi',
        part: '1',
        questions: [
          'So, tell me a bit about yourself.',
          'What have you been working on lately, inside or outside of work?',
          'How did you end up studying IT?',
          'What makes you tick?',
          'What are you hoping to get out of the next year?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở **/language/en/roleplay**, dán đề bài dưới đây. Chuẩn bị trước bản 2 phút của bạn theo 6 bước.',
          '"You are Margot, a friendly British team lead who has just joined my company in Ho Chi Minh City. This is our first getting-to-know-you chat; it is NOT a job interview, so do not ask technical or STAR-style questions. Ask me to tell you about myself, then ask follow-up questions about what I have been doing lately, what motivates me (use the idiom \'what makes you tick\' once), my strengths, and what I am hoping to get out of the next six months. If I list dates like a CV, stop me kindly and ask for the story instead. If I say I am not good at anything, push back gently. Speak at natural B2 speed. After 12 turns, tell me in Vietnamese: how many times I used \'I\'ve been + -ing\' correctly, whether I ended by asking you a question, and one sentence to make my story stronger."',
          'Lượt 2: AI đóng vai **Rowan, người tuyển dụng ở hội chợ việc làm** — chỉ có 2 phút, và giữa chừng báo một tin không vui (đợt tuyển đã đóng). Bạn phải giữ bình tĩnh và xin cách giữ liên lạc.',
          'Muốn luyện câu hỏi **phỏng vấn kỹ thuật** hoặc trả lời theo **STAR**: dùng bài Lab ở Courses **IT Interview Prep** (chương 2, chương 8).',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd28-viet',
    kind: 'writing',
    title: 'Đoạn giới thiệu bản thân, tin nhắn cảm ơn sau buổi gặp',
    goal: 'Viết được đoạn giới thiệu bản thân ngắn cho nhóm chat và cho người quan trọng, và tin nhắn hoặc email cảm ơn sau một buổi gặp, ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn viết gì',
        items: [
          'Hai loại văn bản ai đi làm cũng phải viết: **đoạn giới thiệu bản thân** (khi vào nhóm mới, khi gửi cho sếp, khi kết nối LinkedIn) và **lời cảm ơn sau buổi gặp**.',
          'Đoạn giới thiệu dùng lại **6 bước của bài Nói**, rút còn 3–5 câu.',
          'Lời cảm ơn tốt có 4 phần: **cảm ơn → một chi tiết cụ thể từ buổi gặp → việc bạn sẽ làm tiếp → câu kết**. Thiếu chi tiết cụ thể thì đọc như thư mẫu.',
          'Mỗi mẫu có hai bản đặt cạnh nhau: **thân mật** và **trang trọng**.',
          "Ngày 2 bạn đã viết tin xác nhận ngắn. Hôm nay câu dài hơn, có 've been + V-ing và I'm hoping to.",
        ],
      },

      { t: 'h', text: '1. Ba mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Đoạn giới thiệu bản thân',
        caption: 'Bản thân mật: câu ngắn, emoji, kết bằng lời mời. Bản trang trọng: đủ câu, có một dòng "vì sao tôi viết", không emoji.',
        cols: [
          {
            title: 'Thân mật (nhóm chat #booking-team)',
            anh: 'speech-balloon',
            items: [
              "Hi everyone! 👋 I'm Thịnh, the new intern on booking.",
              "I'm in my final year of software engineering, and I've been tutoring maths on Saturdays for about a year.",
              "I'm hoping to learn as much as I can, so feel free to throw questions (and bugs) my way.",
              'Also happy to recommend iced coffee spots near the office ☕',
            ],
          },
          {
            title: 'Trang trọng (email cho giám đốc mới, Spencer)',
            anh: 'e-mail',
            items: [
              'Dear Spencer,',
              'We met briefly in the coffee queue on Monday. I am Thịnh, an intern on the booking team.',
              'For the past three months, I have been working on the check-in screens for our hotel app.',
              'Thank you for the new meeting rule. It has already made a difference for me.',
              'Kind regards,',
              'Nguyen Duc Thinh',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Cảm ơn sau buổi gặp riêng với sếp',
        caption: 'Nhắc **một chi tiết** của buổi gặp, và cho thấy bạn đã bắt tay vào làm.',
        cols: [
          {
            title: 'Thân mật (tin nhắn cho Margot)',
            anh: 'mobile-phone',
            items: [
              'Hi Margot, thanks for the chat today!',
              'Really appreciated the tip about skipping the CV dates 😅',
              "I've started preparing my five minutes for Friday. Could I run it past you on Thursday?",
            ],
          },
          {
            title: 'Trang trọng (email cho quản lý ở văn phòng khác)',
            anh: 'e-mail',
            items: [
              'Dear Natasha,',
              'Thank you for taking the time to speak with me yesterday.',
              'I especially appreciated your idea of a fortnightly catch-up.',
              'I will share a short update on the check-in screens before our next catch-up.',
              'Best regards,',
              'Nguyen Duc Thinh',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Cảm ơn người tuyển dụng sau hội chợ việc làm',
        caption: 'Gửi trong **24 giờ**. Dòng tiêu đề nói rõ bạn là ai (như Rowan dặn). Nhắc lại một điều họ nói để họ nhớ ra bạn.',
        cols: [
          {
            title: 'Ngắn (tin kết nối LinkedIn)',
            anh: 'link',
            items: [
              'Hi Rowan, it was great to meet you at the career fair on Saturday.',
              "Thanks for the advice about the spring intake. I'd love to stay in touch.",
              'Thịnh',
            ],
          },
          {
            title: 'Đầy đủ (email)',
            anh: 'envelope-with-arrow',
            items: [
              'Subject: Career fair – Nguyen Duc Thinh, final-year software engineering',
              'Dear Rowan,',
              'Thank you for speaking with me at the career fair on Saturday.',
              'I was glad to hear about the spring intake, and I am hoping to apply when applications open in February.',
              'In the meantime, I will follow your advice and ask my manager for a reference.',
              'I look forward to staying in touch.',
              'Best regards,',
              'Nguyen Duc Thinh',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Ghi nhớ về tên Việt khi ký',
        items: [
          'Email trang trọng ký **đủ họ tên, không dấu** (Nguyen Duc Thinh) vì nhiều hệ thống, bàn phím nước ngoài không gõ được dấu. Trong tin nhắn thân mật ký tên có dấu (Thịnh) vẫn được.',
          "Lần đầu viết cho người mới, có thể thêm một dòng: \"(Thịnh is my first name, pronounced like 'Ting')\" để họ gọi đúng.",
        ],
      },

      { t: 'h', text: '2. Khung câu để viết' },
      {
        t: 'patterns',
        rows: [
          {
            formula: "For the past + thời gian, I've been + V-ing…",
            vi: 'Câu chính của đoạn giới thiệu: dạo này bạn làm gì.',
            examples: [
              { en: "For the past three months, I've been working on our check-in screens.", vi: 'Ba tháng nay tôi làm các màn hình nhận phòng.' },
              { en: "For the past year, I've been tutoring maths on Saturdays.", vi: 'Một năm nay tôi dạy kèm toán vào thứ Bảy.' },
              { en: 'For the past few weeks, I have been learning how our booking system works.', vi: 'Vài tuần nay tôi tìm hiểu hệ thống đặt phòng vận hành thế nào.' },
            ],
          },
          {
            formula: 'Thank you for + V-ing / Thanks for + N',
            vi: 'Mở lời cảm ơn. Sau "for" là V-ing hoặc danh từ.',
            examples: [
              { en: 'Thank you for taking the time to speak with me.', vi: 'Cảm ơn anh/chị đã dành thời gian nói chuyện với tôi.' },
              { en: 'Thanks for the chat today!', vi: 'Cảm ơn buổi nói chuyện hôm nay nhé!' },
              { en: 'Thank you for your advice about the spring intake.', vi: 'Cảm ơn lời khuyên của anh về đợt tuyển mùa xuân.' },
            ],
          },
          {
            formula: 'I (especially / really) appreciated + N / V-ing',
            vi: 'Nhắc một chi tiết cụ thể: đây là dòng làm lá thư "có hồn".',
            examples: [
              { en: 'I especially appreciated your tip about preparing one question.', vi: 'Tôi đặc biệt cảm kích lời khuyên chuẩn bị sẵn một câu hỏi.' },
              { en: 'I really appreciated hearing about your move from Sydney.', vi: 'Tôi rất thích được nghe chuyện anh chuyển từ Sydney sang.' },
              { en: 'Really appreciated the honest feedback.', vi: 'Rất cảm ơn những góp ý thẳng thắn.' },
            ],
          },
          {
            formula: "I'll + V / I'm hoping to + V / I look forward to + V-ing",
            vi: 'Việc tiếp theo và câu kết. "look forward to" đi với V-ing.',
            examples: [
              { en: "I'll send you a short update next week.", vi: 'Tuần sau tôi sẽ gửi anh/chị một bản cập nhật ngắn.' },
              { en: "I'm hoping to apply when applications open in February.", vi: 'Tôi mong sẽ nộp đơn khi mở đơn vào tháng Hai.' },
              { en: 'I look forward to staying in touch.', vi: 'Mong được giữ liên lạc.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: "Thank you for + V-ing → I appreciated + chi tiết → I'll / I'm hoping to + V → I look forward to + V-ing",
        vi: 'Lời cảm ơn sau buổi gặp: 4 dòng là đủ. Dòng 2 phải có một chi tiết chỉ buổi gặp đó mới có.',
      },
      {
        t: 'table',
        head: ['Viết gì', 'Nên', 'Tránh', 'Vì sao'],
        rows: [
          ['Cảm ơn', 'Thank you for taking the time to…', 'Thank you for your precious time.', '"precious time" là dịch từ "thời gian quý báu", nghe sến và lạ.'],
          ['Chào người đã biết tên', 'Dear Rowan, · Hi Margot,', 'Dear Sir/Madam,', 'Biết tên thì gọi tên. Sir/Madam chỉ dùng khi không biết gửi ai.'],
          ['Chi tiết', 'I appreciated your advice on…', 'It was a very useful meeting.', 'Câu chung chung ai cũng viết được, người nhận quên ngay.'],
          ['Độ dài', '3–6 câu', 'Cả trang kể lại buổi gặp', 'Người bận đọc trên điện thoại.'],
          ['Thời điểm', 'Trong 24 giờ', 'Sau một tuần', 'Gửi muộn thì họ không còn nhớ bạn.'],
          ['Kết', 'Best regards, · Kind regards, · Thanks!', 'Thanks and best regards, waiting for your reply.', '"waiting for your reply" nghe như giục.'],
        ],
        caption: 'Lời cảm ơn **ngắn, cụ thể, đúng lúc** đáng giá hơn lời cảm ơn dài và trang trọng.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd28-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn, email (4 câu)',
        items: [
          { vi: 'Cảm ơn anh đã dành thời gian nói chuyện với tôi.', chips: ['Thank', 'you', 'for', 'taking', 'the', 'time', 'to', 'speak', 'with', 'me.', 'take', 'your'], answer: ['Thank', 'you', 'for', 'taking', 'the', 'time', 'to', 'speak', 'with', 'me.'] },
          { vi: 'Ba tháng nay tôi làm các màn hình nhận phòng.', chips: ['For', 'the', 'past', 'three', 'months,', "I've", 'been', 'working', 'on', 'the', 'check-in', 'screens.', 'since', 'work'], answer: ['For', 'the', 'past', 'three', 'months,', "I've", 'been', 'working', 'on', 'the', 'check-in', 'screens.'] },
          { vi: 'Tôi đặc biệt cảm kích lời khuyên của chị.', chips: ['I', 'especially', 'appreciated', 'your', 'advice.', 'appreciate', 'advices.'], answer: ['I', 'especially', 'appreciated', 'your', 'advice.'] },
          { vi: 'Mong được giữ liên lạc.', chips: ['I', 'look', 'forward', 'to', 'staying', 'in', 'touch.', 'stay', 'for'], answer: ['I', 'look', 'forward', 'to', 'staying', 'in', 'touch.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd28-viet-dien',
        title: 'Điền một từ vào tin nhắn, email (6 câu)',
        kind: 'fill',
        grammar: "Thank you for + V-ing · I've been + V-ing · I look forward to + V-ing",
        items: [
          { q: 'Thank you ___ taking the time to meet me.', answers: ['for'] },
          { q: "For the past year, I've ___ tutoring maths on Saturdays.", answers: ['been'] },
          { q: 'I look forward to ___ (stay) in touch.', answers: ['staying'] },
          { q: 'I especially ___ your advice on preparing questions. (cảm kích, quá khứ)', answers: ['appreciated'] },
          { q: "I'm ___ to apply when applications open in February. (mong)", answers: ['hoping'] },
          { q: '___ regards, Nguyen Duc Thinh (một từ hay dùng trước "regards")', answers: ['Best', 'Kind', 'Warm'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd28-viet-dich',
        title: 'Tự viết 5 câu (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "Thank you for… · I've been + V-ing · I'm hoping to… · I look forward to…",
        items: [
          { q: '(Nhắn trong nhóm) Chào mọi người! Mình là Thịnh, thực tập sinh mới của nhóm đặt phòng.', hint: "hi everyone, I'm, the new intern", answers: ["Hi everyone! I'm Thịnh, the new intern on the booking team.", "Hi everyone! I'm Thinh, the new intern on the booking team.", "Hi everyone! I'm Thịnh, the new intern on booking.", "Hi everyone! I'm Thinh, the new intern on booking.", "Hi everyone, I'm Thịnh, the new intern on the booking team.", "Hi everyone, I'm Thinh, the new intern on the booking team.", "Hi everyone! I'm Thịnh, the booking team's new intern.", "Hi everyone! I'm Thinh, the booking team's new intern."] },
          { q: '(Trang trọng) Cảm ơn chị đã dành thời gian nói chuyện với em hôm qua.', hint: 'thank you for taking the time', answers: ['Thank you for taking the time to speak with me yesterday.', 'Thank you for taking the time to talk with me yesterday.', 'Thank you for taking the time to talk to me yesterday.', 'Thank you for taking the time to speak to me yesterday.', 'Thank you for taking the time to meet me yesterday.'] },
          { q: 'Một năm nay mình dạy kèm toán vào thứ Bảy.', hint: "for the past year, I've been tutoring", answers: ["For the past year, I've been tutoring maths on Saturdays.", 'For the past year, I have been tutoring maths on Saturdays.', "For the past year, I've been tutoring math on Saturdays.", "I've been tutoring maths on Saturdays for the past year.", "I've been tutoring maths on Saturdays for a year.", "For the past year I've been tutoring maths on Saturdays."] },
          { q: 'Em mong sẽ nộp đơn khi mở đơn vào tháng Hai.', hint: "I'm hoping to, apply, applications open", answers: ["I'm hoping to apply when applications open in February.", 'I am hoping to apply when applications open in February.', "I'm hoping to apply when the applications open in February.", "I'm hoping to apply when applications open in Feb."] },
          { q: 'Mong được giữ liên lạc với anh.', hint: 'look forward to, stay in touch', answers: ['I look forward to staying in touch.', 'I look forward to staying in touch with you.', "I'm looking forward to staying in touch.", "I'm looking forward to staying in touch with you.", 'Looking forward to staying in touch.'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Có một chi tiết chỉ buổi gặp này mới có không?** Thử che tên người nhận: nếu lá thư gửi cho ai cũng được thì nó chưa đủ cụ thể.',
          '**Tên người nhận viết đúng chưa?** Rowan, không phải Rowen. Nhìn lại danh thiếp.',
          '**Dòng tiêu đề có nói bạn là ai không?** "Career fair – Nguyen Duc Thinh" tốt hơn "Hello" hay "Thank you".',
          '**"look forward to" có đi với V-ing không?** "I look forward to ~~hear~~ **hearing** from you" là lỗi người Việt gặp nhiều nhất trong email.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd28-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 28',
    goal: 'Làm 34 câu có đáp án để nắm chắc hiện tại hoàn thành tiếp diễn, cách nói mục tiêu, cách trả lời câu hỏi mở về bản thân và cách viết lời cảm ơn sau buổi gặp.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền thì · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 27** (quá khứ hoàn thành, đáp lại câu đùa) và **Ngày 13–14** (câu hỏi làm quen).',
          'Sai câu nào, đọc giải thích rồi **nói to** câu đúng như đang nói với sếp mới.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 29.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd28-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Sếp mới hỏi: "So, tell me a bit about yourself." Câu mở đầu nào tốt nhất?',
            options: ['I was born in 2004 in Phan Thiết.', "At the moment, I'm in my final year, and I've been interning here for three months.", 'My hobbies are reading, music and travelling.', 'What do you want to know?'],
            correct: 1,
            why: 'Mở bằng **hiện tại** + việc đang làm. Kể năm sinh là đọc CV; ba sở thích chung chung không ai nhớ.',
          },
          {
            q: 'Câu nào đúng?',
            options: ['I study IT since 2022.', "I've been studying IT since 2022.", "I'm studying IT since 2022.", 'I studied IT since 2022.'],
            correct: 1,
            why: '**since + mốc** kéo tới nay ⇒ hiện tại hoàn thành (tiếp diễn).',
          },
          {
            q: 'Câu nào đúng?',
            options: ["I've been knowing Margot since March.", "I've known Margot since March.", 'I know Margot since March.', "I'm knowing Margot since March."],
            correct: 1,
            why: "**know** là động từ trạng thái, không dùng -ing: I've known.",
          },
          {
            q: 'Người tuyển dụng hỏi: "What are you hoping to do after you graduate?" Câu trả lời tự nhiên nhất:',
            options: ['Anything is okay.', "I'm hoping to join a graduate programme where I can try different teams.", 'I hope I will have a job.', 'I want money.'],
            correct: 1,
            why: "**I'm hoping to + V** + một chi tiết cụ thể. \"Anything is okay\" bỏ lỡ cơ hội cho họ biết bạn muốn gì.",
          },
          {
            q: 'Sếp hỏi "What makes you tick?" và bạn không biết cụm này. Bạn nói:',
            options: ['Tick? Like a clock?', "Sorry, 'what makes me tick'? I'm not sure I know that phrase.", '(im lặng, gật đầu)', 'Yes.'],
            correct: 1,
            why: 'Hỏi lại **đúng cụm** lạ, ngắn gọn. Sếp sẽ giải thích ngay ("what motivates you").',
          },
          {
            q: 'Bạn muốn nói điểm mạnh mà không khoe. Câu nào hay nhất?',
            options: ["I'm the best organiser.", 'I am very very responsible.', 'My class has asked me to organise every trip since first year.', "I'm not good at anything special."],
            correct: 2,
            why: '**Bằng chứng** thay cho tính từ: người nghe tự kết luận bạn giỏi tổ chức.',
          },
          {
            q: 'Bạn nói xong phần về mình trong một buổi cà phê với mentor. Câu kết hợp nhất:',
            options: ['Thank you for listening.', "That's me in a nutshell. How about you? How did you end up here?", 'The end.', 'Do you have any questions?'],
            correct: 1,
            why: 'Đây là **trò chuyện**: kết bằng câu hỏi lại. "Thank you for listening" là câu kết thuyết trình.',
          },
          {
            q: 'Câu nào là lỗi người Việt hay mắc trong email?',
            options: ['I look forward to hearing from you.', 'I look forward to hear from you.', 'I look forward to staying in touch.', 'Looking forward to it!'],
            correct: 1,
            why: '**look forward to + V-ing**. "to" ở đây là giới từ, không phải "to V".',
          },
          {
            q: '(Ôn Ngày 27) Câu nào dùng quá khứ hoàn thành đúng?',
            options: ['By the time I arrived, the fair had already closed.', 'I had graduated last year.', 'Yesterday I had met my manager.', 'I had been born in 2004.'],
            correct: 0,
            why: 'Có mốc "I arrived" và việc xảy ra trước nó "the fair closed". Ba câu kia không có mốc thứ hai.',
          },
          {
            q: '(Ôn Ngày 27) Sếp vừa giao bạn trình bày 5 phút ngay sau khi bạn nói muốn tự tin trình bày hơn. Câu đáp vui, nhẹ nhàng:',
            options: ['No, I refuse.', "I walked right into that one, didn't I?", 'That is not fair.', 'Okay.'],
            correct: 1,
            why: 'Tự trào nhẹ = nhận việc mà vẫn giữ không khí vui. "Okay." không sai nhưng nhạt.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Chọn thì đúng' },
      {
        t: 'quiz',
        id: 'gtd28-bt-dien-thi',
        title: 'Phần II — Chia động từ trong ngoặc (7 câu)',
        kind: 'fill',
        grammar: "'ve been + V-ing (quá trình tới nay) · 've + V3 (kết quả / trạng thái) · I'm hoping to + V",
        items: [
          { q: 'I ___ (tutor) kids in maths for about a year now.', answers: ["'ve been tutoring", 'have been tutoring', 've been tutoring'] },
          { q: 'So far, I ___ (help) four students pass their exams.', answers: ["'ve helped", 'have helped', 've helped'] },
          { q: 'I ___ (know) my mentor since my first week.', answers: ["'ve known", 'have known', 've known'] },
          { q: 'How long have you ___ (live) in Vietnam?', answers: ['been living', 'lived'] },
          { q: "She ___ (work) on the new app since March, and she's still on it.", answers: ["'s been working", 'has been working', 's been working'] },
          { q: "I'm hoping ___ (join) a graduate programme next year.", answers: ['to join'] },
          { q: 'I ___ (always / be) curious about how things work.', answers: ["'ve always been", 'have always been', 've always been'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd28-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "'ve been + V-ing · I'm hoping to · Eventually, I'd like to · that's how",
        items: [
          { q: 'Hiện giờ mình đang học năm cuối.', hint: 'at the moment, final year', answers: ["At the moment, I'm in my final year.", "At the moment I'm in my final year.", "I'm in my final year at the moment.", "At the moment, I'm in my final year of university.", "Right now, I'm in my final year."] },
          { q: 'Dạo này bạn đang làm gì?', hint: 'have you been, working on, lately', answers: ['What have you been working on lately?', 'What have you been up to lately?', 'What have you been doing lately?', 'What have you been working on recently?'] },
          { q: 'Về lâu dài, mình muốn dẫn dắt một nhóm nhỏ.', hint: "eventually, I'd like to, lead", answers: ["Eventually, I'd like to lead a small team.", 'Eventually, I would like to lead a small team.', "Eventually I'd like to lead a small team.", "In the long run, I'd like to lead a small team.", "In the long term, I'd like to lead a small team."] },
          { q: 'Mình vẫn đang tập lên tiếng trong các cuộc họp.', hint: 'still working on, speaking up', answers: ["I'm still working on speaking up in meetings.", 'I am still working on speaking up in meetings.', "I'm still learning to speak up in meetings.", "I'm still practising speaking up in meetings.", "I'm still practicing speaking up in meetings."] },
          { q: 'Mình sửa laptop cũ của mẹ, và đó là cách mình đến với IT.', hint: "and that's how, got into", answers: ["I fixed my mum's old laptop, and that's how I got into IT.", "I fixed my mom's old laptop, and that's how I got into IT.", "I fixed my mother's old laptop, and that's how I got into IT.", "I fixed my mum's old laptop and that's how I got into IT.", "I repaired my mum's old laptop, and that's how I got into IT."] },
          { q: 'Tóm gọn về mình là vậy. Còn bạn?', hint: 'in a nutshell, how about you', answers: ["That's me in a nutshell. How about you?", "So that's me in a nutshell. How about you?", "That's me in a nutshell. What about you?", 'That is me in a nutshell. How about you?'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd28-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'How are you finding it so far?', answer: 'How are you finding it so far?' },
          { label: 'Câu 2', spell: "I've been learning more in three months than in a year at uni.", answer: "I've been learning more in three months than in a year at uni.", alt: ['I have been learning more in three months than in a year at uni.', "I've been learning more in 3 months than in a year at uni."] },
          { label: 'Câu 3', spell: 'What are you hoping to get out of the next six months?', answer: 'What are you hoping to get out of the next six months?', alt: ['What are you hoping to get out of the next 6 months?'] },
          { label: 'Câu 4', spell: 'Would it be okay if I emailed you to stay in touch?', answer: 'Would it be okay if I emailed you to stay in touch?', alt: ['Would it be OK if I emailed you to stay in touch?', 'Would it be ok if I emailed you to stay in touch?'] },
          { label: 'Câu 5', spell: 'Thank you for taking the time to speak with me.', answer: 'Thank you for taking the time to speak with me.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd28-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (6 câu)',
        items: [
          { vi: 'Từ năm nhất mình đã lo các chuyến đi của lớp.', chips: ["I've", 'been', 'running', 'the', 'class', 'trips', 'since', 'first', 'year.', 'for', 'run'], answer: ["I've", 'been', 'running', 'the', 'class', 'trips', 'since', 'first', 'year.'] },
          { vi: 'Mình thích giải thích mọi thứ, đó là lý do mình đi dạy kèm.', chips: ['I', 'love', 'explaining', 'things,', 'which', 'is', 'why', 'I', 'started', 'tutoring.', 'what', 'because'], answer: ['I', 'love', 'explaining', 'things,', 'which', 'is', 'why', 'I', 'started', 'tutoring.'] },
          { vi: 'Sao bạn lại tới Việt Nam vậy?', chips: ['How', 'did', 'you', 'end', 'up', 'in', 'Vietnam?', 'come', 'at'], answer: ['How', 'did', 'you', 'end', 'up', 'in', 'Vietnam?'] },
          { vi: 'Mình vẫn đang tìm hiểu xem mình hợp front-end hay back-end hơn.', chips: ["I'm", 'still', 'figuring', 'out', 'whether', 'I', 'prefer', 'front-end', 'or', 'back-end.', 'if', 'find'], answer: ["I'm", 'still', 'figuring', 'out', 'whether', 'I', 'prefer', 'front-end', 'or', 'back-end.'] },
          { vi: 'Em email cho anh để giữ liên lạc có được không ạ?', chips: ['Would', 'it', 'be', 'okay', 'if', 'I', 'emailed', 'you', 'to', 'stay', 'in', 'touch?', 'email', 'keep'], answer: ['Would', 'it', 'be', 'okay', 'if', 'I', 'emailed', 'you', 'to', 'stay', 'in', 'touch?'] },
          { vi: 'Rất mong được nghe tin từ chị.', chips: ['I', 'look', 'forward', 'to', 'hearing', 'from', 'you.', 'hear', 'for'], answer: ['I', 'look', 'forward', 'to', 'hearing', 'from', 'you.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (10 phút)',
        items: [
          "Ghi âm **bản 2 phút** của bạn. Nghe lại và đếm: mấy câu 've been + V-ing? có câu I'm hoping to? có một bằng chứng cho điểm mạnh? có kết bằng câu hỏi lại?",
          'Viết **đoạn giới thiệu 3–5 câu** cho nhóm chat của lớp hoặc của công ty thực tập (bản thân mật), và một bản trang trọng để dành gửi sếp mới.',
          'Muốn đi tiếp sang phỏng vấn thật: Courses **IT Interview Prep** chương 2 (Tell me about yourself, STAR) và chương 8 (tiếng Anh khi phỏng vấn).',
          'Ngày 29: **tình huống khó** — ngắt lời lịch sự, giữ lượt nói, nói rõ lại ý mình ("What I meant was…").',
        ],
      },
    ],
  },
];
