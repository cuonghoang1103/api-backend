/**
 * Tiếng Anh giao tiếp — NGÀY 3 (chặng 1 "Sống sót", A2): small talk.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd3-`.
 * Ngữ pháp trong câu: hiện tại đơn (thói quen, sở thích) · like / love / enjoy + V-ing · nối câu bằng `but`, `so`.
 * Cảnh: Đạt — sinh viên IT năm 3 thực tập ở Cầu Giấy, Hà Nội — nói chuyện phiếm trong thang máy mùa nồm, chiều thứ Sáu,
 * và bữa trưa thứ Hai (nói mãi về bóng đá rồi biết đổi chủ đề).
 * Khác podcast en-ds-b1-02 (mưa ở trạm xe buýt, khách du lịch): ở đây là đồng nghiệp, trời nồm, quiz night, đi bộ đường dài.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_3: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd3-nghe',
    kind: 'listening',
    title: 'Small talk: thời tiết, cuối tuần, sở thích',
    goal: 'Nghe hiểu ba cuộc nói chuyện phiếm ở công ty: thời tiết, kế hoạch cuối tuần, sở thích; nhận ra khi nào người kia thích thú và khi nào họ đã chán.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Ngày 1 bạn học chào và tự giới thiệu, Ngày 2 học hỏi lại khi không nghe kịp. Hôm nay là bước tiếp theo: **nói chuyện phiếm** (small talk) sau câu chào.',
          'Bạn theo chân **Đạt**, sinh viên IT năm 3 thực tập ở một công ty phần mềm tại **Cầu Giấy, Hà Nội**. Đang là cuối tháng Hai, mùa **nồm**.',
          'Ba cảnh, ba chủ đề an toàn nhất của small talk: **thời tiết** (trong thang máy) · **cuối tuần** (chiều thứ Sáu) · **sở thích** (bữa trưa).',
          'Ngoài lời nói, nghe cả **thái độ**: câu nào là đang thích thú, câu nào là lịch sự cho qua. Cảnh 3 có một lỗi người Việt rất hay mắc.',
          'Nghe mỗi cảnh **2 lần**: lần 1 không xem lời thoại, lần 2 mở lời thoại và nhại theo từng câu.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Trong thang máy: "Is it always this damp?"' },
      {
        t: 'canh',
        anh: ['elevator', 'man-technologist', 'man-office-worker', 'fog', 'droplet', 'cold-face'],
        caption: '8 giờ 15 sáng thứ Hai. Trời Hà Nội nồm, sàn sảnh toà nhà ướt nhẹp. **Đạt** bước vào thang máy cùng **Liam**, kỹ sư người Úc mới sang được hai tuần. Thang lên tầng 12 mất chừng 40 giây.',
      },
      {
        t: 'listen',
        id: 'gtd3-nghe-canh1',
        title: 'Scene 1 — In the lift',
        note: 'Nghe xem Liam than phiền điều gì, Đạt khuyên gì, và vì sao Liam thấy lời khuyên đó lạ.',
        lines: [
          { who: 'Liam', voice: 'au-nam', text: 'Morning! Bit chilly today.', vi: 'Chào buổi sáng! Hôm nay hơi lạnh nhỉ.' },
          { who: 'Đạt', voice: 'us-nam', text: "Morning! Yes, it's about fourteen degrees.", vi: 'Chào anh! Vâng, khoảng mười bốn độ.' },
          { who: 'Liam', voice: 'au-nam', text: "Fourteen? That's freezing for me. I'm from Brisbane. It never gets this cold there.", vi: 'Mười bốn á? Với anh thế là rét cóng. Anh ở Brisbane. Ở đó chẳng bao giờ lạnh thế này.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Really? For us, fourteen is normal in February.', vi: 'Thật ạ? Với bọn em, tháng Hai mười bốn độ là bình thường.' },
          { who: 'Liam', voice: 'au-nam', text: 'And everything is wet. The floor is wet, the walls are wet. Is it always this damp?', vi: 'Mà cái gì cũng ướt. Sàn ướt, tường ướt. Lúc nào cũng ẩm thế này à?' },
          { who: 'Đạt', voice: 'us-nam', text: 'Sorry, damp?', vi: 'Xin lỗi, "damp" ạ?' },
          { who: 'Liam', voice: 'au-nam', text: "Damp. A bit wet, but it isn't raining. Like the air is full of water.", vi: '"Damp". Hơi ướt, mà trời không mưa. Như kiểu không khí đầy nước ấy.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Oh, yes! We call it "nồm". It comes every spring, for a few weeks.', vi: 'À, đúng rồi! Bọn em gọi là "nồm". Mùa xuân nào cũng có, kéo dài vài tuần.' },
          { who: 'Liam', voice: 'au-nam', text: "Nồm. Okay. My clothes never dry. What do people do here?", vi: '"Nồm". Được rồi. Quần áo của anh không bao giờ khô. Người ở đây làm thế nào?' },
          { who: 'Đạt', voice: 'us-nam', text: 'Most people close all the windows. My mum closes them every morning and turns on a fan.', vi: 'Phần lớn mọi người đóng hết cửa sổ. Mẹ em sáng nào cũng đóng cửa rồi bật quạt.' },
          { who: 'Liam', voice: 'au-nam', text: 'Close the windows? Really? At home, we open them to dry things.', vi: 'Đóng cửa sổ á? Thật à? Ở nhà anh, bọn anh mở cửa ra cho đồ khô.' },
          { who: 'Đạt', voice: 'us-nam', text: 'I know, it sounds strange. But in nồm season, the air outside is wetter than the air inside.', vi: 'Em biết, nghe lạ lắm. Nhưng mùa nồm thì không khí bên ngoài còn ẩm hơn bên trong.' },
          { who: 'Liam', voice: 'au-nam', text: 'Huh. That makes sense. Thanks for the tip!', vi: 'Ồ. Nghe hợp lý đấy. Cảm ơn em đã mách nhé!' },
          { who: 'Đạt', voice: 'us-nam', text: "No problem. Don't worry, it usually stops in April.", vi: 'Không có gì ạ. Anh đừng lo, thường đến tháng Tư là hết.' },
          { who: 'Liam', voice: 'au-nam', text: 'April! Okay, I can wait. Oh, this is me. Have a good one, Đạt.', vi: 'Tháng Tư! Được, anh chờ được. Ồ, tầng của anh đây rồi. Chúc em một ngày tốt lành, Đạt.' },
          { who: 'Đạt', voice: 'us-nam', text: 'You too. See you later!', vi: 'Anh cũng vậy. Lát gặp lại anh!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd3-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Liam thấy 14 độ là rất lạnh?',
            options: ['Vì anh ấy đang ốm', 'Vì anh ấy đến từ Brisbane, nơi không bao giờ lạnh như vậy', 'Vì toà nhà không có máy sưởi', 'Vì anh ấy quên mang áo khoác'],
            correct: 1,
            why: '"I\'m from Brisbane. **It never gets this cold there.**" Brisbane ở vùng cận nhiệt đới của Úc, mùa đông hiếm khi xuống dưới 10 độ vào ban ngày.',
          },
          {
            q: '"Damp" nghĩa là gì?',
            options: ['Mưa to', 'Lạnh buốt', 'Ẩm ướt, dù trời không mưa', 'Bụi bẩn'],
            correct: 2,
            why: 'Liam tự giải thích: "**A bit wet, but it isn\'t raining.** Like the air is full of water." Đạt hỏi lại đúng một từ "Sorry, damp?", đúng mẹo đã học ở Ngày 2.',
          },
          {
            q: 'Đạt khuyên Liam làm gì?',
            options: ['Mở hết cửa sổ', 'Đóng hết cửa sổ', 'Phơi quần áo ngoài ban công', 'Chuyển nhà'],
            correct: 1,
            why: '"Most people **close all the windows**." Mùa nồm không khí ngoài trời ẩm hơn trong nhà, nên mở cửa là đưa thêm hơi nước vào.',
          },
          {
            q: 'Câu "Oh, this is me" của Liam trong thang máy nghĩa là gì?',
            options: ['Đây là ảnh của anh', 'Anh ấy tự giới thiệu', 'Đến tầng của anh ấy rồi', 'Anh ấy nhận lỗi'],
            correct: 2,
            why: 'Trong thang máy hay trên xe buýt, **"This is me."** = "Tôi xuống ở đây". Đó cũng là tín hiệu kết thúc câu chuyện, nên Liam chào luôn: Have a good one.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Chiều thứ Sáu: "Any plans for the weekend?"' },
      {
        t: 'canh',
        anh: ['five-oclock', 'woman-office-worker', 'spiral-calendar', 'badminton', 'trophy'],
        caption: '5 giờ chiều thứ Sáu. **Niamh** (đọc gần như "Niêv"), trưởng nhóm thiết kế người Ireland, đi ngang bàn Đạt. Ở công ty có người nước ngoài, chiều thứ Sáu ai cũng hỏi nhau đúng một câu.',
      },
      {
        t: 'listen',
        id: 'gtd3-nghe-canh2',
        title: 'Scene 2 — Friday afternoon',
        note: 'Nghe xem Đạt thường làm gì vào thứ Bảy, Chủ nhật, Niamh rủ Đạt đi đâu và vì sao lúc đầu Đạt ngần ngại.',
        lines: [
          { who: 'Niamh', voice: 'ie-nu', text: 'Đạt! Any plans for the weekend?', vi: 'Đạt ơi! Cuối tuần có định làm gì không?' },
          { who: 'Đạt', voice: 'us-nam', text: 'Not really. I usually just sleep in on Saturdays.', vi: 'Không hẳn ạ. Thứ Bảy em thường chỉ ngủ nướng thôi.' },
          { who: 'Niamh', voice: 'ie-nu', text: 'Ha, me too! What about Sunday?', vi: 'Ha, chị cũng thế! Còn Chủ nhật?' },
          { who: 'Đạt', voice: 'us-nam', text: 'On Sundays I play badminton with my friends. We play every week.', vi: 'Chủ nhật em đánh cầu lông với bạn. Tuần nào bọn em cũng chơi.' },
          { who: 'Niamh', voice: 'ie-nu', text: 'Oh, lovely. Where do you play?', vi: 'Ồ, hay quá. Em chơi ở đâu?' },
          { who: 'Đạt', voice: 'us-nam', text: "At a sports centre near my university. It's cheap, so lots of students go there.", vi: 'Ở một nhà thi đấu gần trường em. Ở đó rẻ nên nhiều sinh viên tới lắm.' },
          { who: 'Niamh', voice: 'ie-nu', text: 'Nice. Listen, do you like quizzes?', vi: 'Hay đấy. À này, em có thích đố vui không?' },
          { who: 'Đạt', voice: 'us-nam', text: 'Quizzes? You mean… tests?', vi: 'Đố vui ạ? Ý chị là… bài kiểm tra ạ?' },
          { who: 'Niamh', voice: 'ie-nu', text: 'No, no! A pub quiz. Teams answer fun questions about music, films, sport. We do one every Saturday night in Tay Ho.', vi: 'Không, không! Đố vui ở quán. Các đội trả lời câu hỏi vui về âm nhạc, phim, thể thao. Tối thứ Bảy nào bọn chị cũng chơi ở Tây Hồ.' },
          { who: 'Đạt', voice: 'us-nam', text: "That sounds fun. But I don't really drink.", vi: 'Nghe vui đấy ạ. Nhưng em không uống rượu bia mấy.' },
          { who: 'Niamh', voice: 'ie-nu', text: "Ah, that's grand. Lots of people just have a juice or a soft drink. Nobody minds.", vi: 'À, không sao đâu. Nhiều người chỉ uống nước ép hay nước ngọt thôi. Chẳng ai để ý cả.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Really? Then yes, I\'d love to come. I know a lot about football.', vi: 'Thật ạ? Vậy thì có, em rất muốn đi. Em biết nhiều về bóng đá lắm.' },
          { who: 'Niamh', voice: 'ie-nu', text: 'Perfect! Our team always loses the sport round. We need you.', vi: 'Tuyệt! Đội chị lần nào cũng thua vòng thể thao. Bọn chị cần em đấy.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Ha ha, no pressure, then. What time does it start?', vi: 'Ha ha, vậy là không áp lực gì nhỉ. Mấy giờ bắt đầu ạ?' },
          { who: 'Niamh', voice: 'ie-nu', text: "Eight o'clock. I'll message you the address. Bring a friend if you like.", vi: 'Tám giờ. Chị sẽ nhắn em địa chỉ. Em muốn thì rủ thêm một bạn.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Great. Thanks, Niamh. Have a good weekend!', vi: 'Tuyệt ạ. Cảm ơn chị Niamh. Chúc chị cuối tuần vui vẻ!' },
          { who: 'Niamh', voice: 'ie-nu', text: 'You too. See you Saturday!', vi: 'Em cũng vậy. Thứ Bảy gặp nhé!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd3-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Thứ Bảy Đạt thường làm gì?',
            options: ['Đánh cầu lông', 'Ngủ nướng', 'Đi đố vui ở quán', 'Đi làm thêm'],
            correct: 1,
            why: '"I usually just **sleep in** on Saturdays." sleep in = ngủ dậy muộn hơn thường lệ, ngủ nướng. Cầu lông là Chủ nhật.',
          },
          {
            q: '"Pub quiz" là gì?',
            options: ['Bài kiểm tra ở trường', 'Cuộc thi đố vui theo đội ở quán', 'Trò chơi điện tử', 'Buổi họp nhóm'],
            correct: 1,
            why: 'Niamh giải thích: "**Teams answer fun questions** about music, films, sport." Đây là trò rất phổ biến ở Anh, Ireland, Úc. Ở Mỹ hay gọi là **trivia night**.',
          },
          {
            q: 'Vì sao lúc đầu Đạt ngần ngại?',
            options: ['Vì Đạt bận học', 'Vì Đạt không biết đường', 'Vì Đạt không uống rượu bia mấy', 'Vì Đạt không thích bóng đá'],
            correct: 2,
            why: '"That sounds fun. **But I don\'t really drink.**" Câu này vừa nhận là lời mời hay, vừa nói rõ điều mình ngại, nhờ vậy Niamh giải đáp được ngay.',
          },
          {
            q: 'Niamh nói "That\'s grand." Câu này nghĩa là gì?',
            options: ['Thế thì hoành tráng quá', 'Không sao đâu, ổn mà', 'Thế thì tiếc quá', 'Em nói to quá'],
            correct: 1,
            why: 'Người Ireland dùng **grand** với nghĩa "ổn, được, không sao". "I\'m grand" = Tôi ổn. Không phải "to lớn, hoành tráng".',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Bữa trưa thứ Hai: nói mãi về bóng đá' },
      {
        t: 'canh',
        anh: ['steaming-bowl', 'man-technologist', 'woman-technologist', 'soccer-ball', 'hiking-boot', 'snow-capped-mountain'],
        caption: 'Trưa thứ Hai, Đạt ăn bún chả cùng **Jess**, chị quản lý sản phẩm người Canada. Jess hỏi Đạt rảnh thì làm gì, và Đạt nói… hơi nhiều. Để ý cách Jess đáp lại.',
      },
      {
        t: 'listen',
        id: 'gtd3-nghe-canh3',
        title: 'Scene 3 — Lunch on Monday',
        note: 'Nghe xem câu trả lời của Jess thay đổi thế nào khi Đạt nói về bóng đá, và khi nào câu chuyện "sống" lại.',
        lines: [
          { who: 'Jess', voice: 'ca-nu', text: 'So, Đạt, what do you do in your free time?', vi: 'Thế Đạt này, lúc rảnh em hay làm gì?' },
          { who: 'Đạt', voice: 'us-nam', text: 'I love football. I watch every Manchester United game.', vi: 'Em mê bóng đá. Trận nào của Manchester United em cũng xem.' },
          { who: 'Jess', voice: 'ca-nu', text: 'Oh, right.', vi: 'À, vậy à.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Some games start at two or three in the morning here, so I often sleep only four hours.', vi: 'Ở đây có trận bắt đầu lúc hai, ba giờ sáng, nên em hay chỉ ngủ được bốn tiếng.' },
          { who: 'Jess', voice: 'ca-nu', text: 'Mm. Wow.', vi: 'Ừm. Ghê nhỉ.' },
          { who: 'Đạt', voice: 'us-nam', text: 'And I play football on Thursdays, and I play football games on my phone, and…', vi: 'Rồi thứ Năm em đá bóng, rồi em chơi game bóng đá trên điện thoại, rồi…' },
          { who: 'Jess', voice: 'ca-nu', text: 'Uh-huh.', vi: 'Ừ hử.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Sorry, I talk about football too much! What about you? Do you like sport?', vi: 'Xin lỗi, em nói về bóng đá nhiều quá! Còn chị? Chị có thích thể thao không?' },
          { who: 'Jess', voice: 'ca-nu', text: "Ha, not really, to be honest. I'm more of an outdoors person. I love hiking.", vi: 'Ha, thật ra không thích lắm. Chị thích hoạt động ngoài trời hơn. Chị mê đi bộ đường dài.' },
          { who: 'Đạt', voice: 'us-nam', text: 'Hiking? Where do you go? Hanoi is very flat.', vi: 'Đi bộ đường dài ạ? Chị đi ở đâu? Hà Nội phẳng lắm mà.' },
          { who: 'Jess', voice: 'ca-nu', text: "I usually go to Ba Vi. It's about two hours by car. I go once a month.", vi: 'Chị hay lên Ba Vì. Đi ô tô mất khoảng hai tiếng. Mỗi tháng chị đi một lần.' },
          { who: 'Đạt', voice: 'us-nam', text: "Once a month? That's a lot! I don't hike, but my mum loves the mountains. She goes to Sa Pa every year.", vi: 'Mỗi tháng một lần ạ? Nhiều thật! Em không đi bộ đường dài, nhưng mẹ em mê núi lắm. Năm nào mẹ em cũng đi Sa Pa.' },
          { who: 'Jess', voice: 'ca-nu', text: 'Sa Pa! I really want to go. Is it cold there?', vi: 'Sa Pa! Chị rất muốn đi. Ở đó có lạnh không?' },
          { who: 'Đạt', voice: 'us-nam', text: "Very cold in winter. Sometimes it snows, but not every year.", vi: 'Mùa đông lạnh lắm. Thỉnh thoảng có tuyết, nhưng không phải năm nào cũng có.' },
          { who: 'Jess', voice: 'ca-nu', text: 'Snow in Vietnam? No way! Okay, now I really want to go.', vi: 'Tuyết ở Việt Nam á? Không thể nào! Thôi, giờ thì chị nhất định phải đi.' },
          { who: 'Đạt', voice: 'us-nam', text: 'My mum knows all the good places. I can ask her for you.', vi: 'Mẹ em biết hết mấy chỗ đẹp. Em hỏi mẹ giúp chị nhé.' },
          { who: 'Jess', voice: 'ca-nu', text: "That's so kind. Thanks, Đạt! And hey, good luck with the football.", vi: 'Em tốt quá. Cảm ơn Đạt! À, chúc đội bóng của em may mắn nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd3-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: 'Jess đáp "Oh, right." · "Mm. Wow." · "Uh-huh." khi Đạt kể về bóng đá. Điều đó cho thấy gì?',
            options: ['Jess rất thích bóng đá', 'Jess lịch sự nghe nhưng không mấy hứng thú', 'Jess không hiểu tiếng Anh của Đạt', 'Jess đang giận'],
            correct: 1,
            why: 'Câu đáp **ngắn, không hỏi thêm gì** = lịch sự nghe cho qua. Người đang thích thú sẽ hỏi lại: "Oh, who\'s your favourite player?" Ba câu ngắn liên tiếp là tín hiệu nên **đổi chủ đề**.',
          },
          {
            q: 'Đạt làm đúng điều gì để cứu câu chuyện?',
            options: ['Kể thêm về Manchester United', 'Im lặng ăn tiếp', 'Xin lỗi vì nói nhiều rồi hỏi lại Jess', 'Đổi sang nói về công việc'],
            correct: 2,
            why: '"Sorry, I talk about football too much! **What about you?**" Một câu nhận ra, một câu trả bóng. Từ đó Jess mới nói nhiều.',
          },
          {
            q: 'Jess thường đi bộ đường dài ở đâu và bao lâu một lần?',
            options: ['Sa Pa, mỗi năm một lần', 'Ba Vì, mỗi tháng một lần', 'Ba Vì, mỗi tuần một lần', 'Hồ Tây, mỗi sáng'],
            correct: 1,
            why: '"I usually go to **Ba Vi**… I go **once a month**." Sa Pa là nơi mẹ Đạt đi mỗi năm.',
          },
          {
            q: 'Jess nói "No way!" khi nghe Sa Pa có tuyết. Câu đó nghĩa là gì?',
            options: ['Không được, chị không đi', 'Thật không thể tin được! (ngạc nhiên thích thú)', 'Không có đường lên đó', 'Em nói sai rồi'],
            correct: 1,
            why: '**No way!** ở đây là ngạc nhiên kiểu "thật á!", không phải từ chối. Câu ngay sau ("now I really want to go") cho thấy Jess đang rất hứng thú.',
          },
          {
            q: '"I\'m more of an outdoors person" nghĩa là gì?',
            options: ['Chị làm việc ngoài trời', 'Chị thích hoạt động ngoài trời hơn (thể thao xem trên TV)', 'Chị không có nhà', 'Chị là người hướng ngoại'],
            correct: 1,
            why: '**I\'m more of a … person** = tôi thuộc kiểu người thích … hơn. Cách nói mềm để không thích cái người kia vừa nói mà không làm họ mất hứng.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Để ý các đuôi **-s** (plays, goes, Saturdays) và **-ing** (hiking): người bản xứ đọc rất nhẹ nên người Việt hay nghe sót. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd3-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — mở lời về thời tiết', spell: 'Bit chilly today.', answer: 'Bit chilly today.', alt: ['Bit chilly today'] },
          { label: 'Câu 2 — hỏi về độ ẩm', spell: 'Is it always this damp?', answer: 'Is it always this damp?' },
          { label: 'Câu 3 — hỏi chuyện cuối tuần', spell: 'Any plans for the weekend?', answer: 'Any plans for the weekend?' },
          { label: 'Câu 4 — thói quen thứ Bảy', spell: 'I usually just sleep in on Saturdays.', answer: 'I usually just sleep in on Saturdays.', alt: ['I usually just sleep in on Saturdays'] },
          { label: 'Câu 5 — vừa nhận vừa ngại', spell: "That sounds fun. But I don't really drink.", answer: "That sounds fun. But I don't really drink.", alt: ["That sounds fun, but I don't really drink.", 'That sounds fun. But I do not really drink.'] },
          { label: 'Câu 6 — nói sở thích', spell: "I'm more of an outdoors person.", answer: "I'm more of an outdoors person.", alt: ['I am more of an outdoors person.'] },
          { label: 'Câu 7 — tần suất (tên riêng: Ba Vi)', spell: 'I usually go to Ba Vi. I go once a month.', answer: 'I usually go to Ba Vi. I go once a month.', alt: ['I usually go to Ba Vi, I go once a month.', 'I usually go to Ba Vi. I go once a month'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Bit chilly today. · Lovely day!', 'Câu mở chuyện, **không** cần thông tin. Chỉ cần đồng ý và nói thêm một chút.', 'Yeah, it is! I like it, though.'],
          ['Any plans for the weekend?', 'Hỏi phiếm chiều thứ Sáu. Không cần kế hoạch thật, một câu ngắn là đủ.', 'Nothing special. Just relaxing. You?'],
          ['Oh, right. · Mm. · Uh-huh.', 'Đang nghe lịch sự, **chưa thấy hứng thú**. Ba lần liền thì nên đổi chủ đề.', 'Anyway, what about you?'],
          ['No way!', 'Thật á! (ngạc nhiên, thích thú). **Không** phải từ chối.', 'Yes, really!'],
          ["That's grand. (Ireland)", 'Ổn mà, không sao.', '(nói tiếp)'],
          ['Nobody minds.', 'Không ai để ý đâu, đừng ngại.', 'Oh, good.'],
          ['This is me.', '(trong thang máy, xe buýt) Tôi xuống ở đây.', 'Have a good day!'],
          ['Have a good one.', 'Chúc một ngày / buổi tối / cuối tuần tốt lành. Dùng được mọi lúc.', 'You too!'],
          ['Good luck with the football.', 'Lời chào kết, đùa nhẹ về điều bạn vừa kể. Họ **có** nghe bạn nói.', 'Thanks! Enjoy Sa Pa!'],
        ],
        caption: 'Small talk không phải để trao đổi thông tin. Nó để hai người **thấy dễ chịu với nhau**. Nói đúng giọng vui vẻ quan trọng hơn nói đúng từng chữ.',
      },
      {
        t: 'note',
        title: 'Mẹo: nói chuyện phiếm mà không nghe kịp thì làm gì',
        items: [
          'Small talk **dễ tha thứ** nhất trong mọi kiểu nói chuyện: không ai kiểm tra bạn nghe đúng 100 %. Bạn chỉ cần bắt được **từ khoá**: tên thời tiết (cold, damp, humid), ngày (Saturday), hoạt động (hiking, quiz).',
          '**Nhắc lại đúng từ khoá với giọng hỏi** như Đạt: "Sorry, damp?" · "Quizzes?" Người kia sẽ tự giải thích bằng từ dễ hơn.',
          'Mất cả câu thì đừng gật cho qua, vì câu tiếp theo có thể là một **lời mời**. Nói: "Sorry, I missed that. Say again?" (thân mật, dùng được với đồng nghiệp).',
          'Chưa nghĩ ra câu đáp thì dùng câu **giữ chỗ**: "Oh, really?" · "Oh, nice!", rồi hỏi một câu ngắn: "How often do you go?" Hỏi là cách giữ chuyện dễ nhất cho người nghe chưa giỏi: bạn nói ít, họ nói nhiều.',
          'Nghe giọng Ireland như Niamh: âm **th** hay đọc thành **t** ("tree" cho "three", "tanks" cho "thanks"), và **r** đọc rõ ở cuối từ. Nghe mấy lần là quen.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh / Ireland', 'Mỹ', 'Úc'],
        rows: [
          ['Cuối tuần', 'at the weekend', 'on the weekend', 'on the weekend'],
          ['Đố vui ở quán', 'pub quiz', 'trivia night', 'trivia night · pub quiz'],
          ['Bóng đá', 'football', 'soccer (football là bóng bầu dục Mỹ)', 'football có thể là bóng bầu dục Úc · soccer'],
          ['Kỳ nghỉ', 'holiday', 'vacation', 'holiday · "hols"'],
          ['Buổi chiều (thân)', 'afternoon', 'afternoon', 'arvo ("See you this arvo!")'],
          ['Nhiệt độ', 'độ C', '**độ F**: 14 °C ≈ 57 °F · 30 °C ≈ 86 °F', 'độ C'],
          ['Hỏi cuối tuần', 'Doing anything nice at the weekend?', 'Any plans for the weekend?', "What are you up to this weekend?"],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc trong small talk. Người Mỹ nói "It\'s ninety degrees" là đang nói độ F, khoảng 32 °C: trời nóng chứ không phải sắp sôi.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b1-02 · Crazy Weather, Isn\'t It?** — một cơn mưa ở trạm xe buýt Hà Nội mở đầu chuyện với một du khách người Anh: quê quán, nghề, sở thích, và câu hỏi tuổi tác. Mức B1, nghe sau khi xong bài Nói hôm nay.',
          '**en-a2-03 · A Weekend in Da Lat** — hai bạn lên kế hoạch một chuyến cuối tuần. Nhiều câu về thói quen và sở thích đi chơi.',
          'Hai tập này là người lạ ngoài đường và bạn bè đi chơi, khác ba cảnh ở công ty hôm nay.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd3-noi',
    kind: 'speaking',
    title: 'Giữ câu chuyện: hỏi tiếp, kể thêm, phản hồi',
    goal: 'Nói chuyện phiếm 2–3 phút về thời tiết, cuối tuần, sở thích bằng công thức "phản hồi + trả lời + kể thêm + hỏi lại", dùng đúng hiện tại đơn cho thói quen.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**Công thức 4 bước** để câu chuyện không chết sau một câu trả lời.',
          '**28 câu mẫu** về thời tiết, cuối tuần, sở thích, phản hồi và cách kết thúc khéo. Bấm loa từng câu, **nói to theo**.',
          'Ngữ pháp: **hiện tại đơn** để kể thói quen (I play / she plays), **like / love / enjoy + V-ing**, nối câu bằng **but** và **so**.',
          'Chủ đề nào an toàn, chủ đề nào nên tránh; nghe người khác kể thì **mặt và mắt** làm gì.',
          'Cuối bài: nhập vai một cuộc nói chuyện phiếm ở máy pha cà phê.',
        ],
      },

      { t: 'h', text: '1. Công thức giữ chuyện' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Đừng trả lời một từ rồi im',
        caption: 'Bước 3 (kể thêm **một** chi tiết) cho người kia "cái móc" để hỏi tiếp. Bước 4 (hỏi lại) trả lượt nói cho họ.',
        steps: [
          { label: '1. Phản hồi', sub: 'Oh, nice! · Really?' },
          { label: '2. Trả lời', sub: 'I play badminton.' },
          { label: '3. Kể thêm 1 chi tiết', sub: 'We play every Sunday near my uni.' },
          { label: '4. Hỏi lại / hỏi tiếp', sub: 'What about you? · How often do you go?' },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: '— Do you like Hanoi?  — Yes.', vi: '❌ Câu chuyện chết. Người hỏi phải tự nghĩ câu tiếp theo.' },
          { en: "— Do you like Hanoi?  — Yes, I love it. The food is amazing, but the traffic is crazy. Do you live near here?", vi: '✅ Trả lời · kể thêm (đồ ăn, giao thông) · hỏi lại. Người kia có ba chỗ để nói tiếp.' },
        ],
      },

      { t: 'h', text: '2. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo thứ tự một cuộc nói chuyện phiếm: **mở lời bằng thời tiết → hỏi cuối tuần → hỏi sở thích → phản hồi → kết thúc khéo**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Bit chilly today.', pos: 'phr', ipa: '/bɪt ˈtʃɪli təˈdeɪ/', vi: 'Hôm nay hơi lạnh nhỉ.', ex: 'Morning! Bit chilly today.', exVi: 'Chào buổi sáng! Hôm nay hơi lạnh nhỉ.', more: 'Câu đầy đủ: **It\'s a bit chilly today.** Khi nói phiếm, người ta bỏ "It\'s a".', anh: 'cold-face' },
          { w: "It's so humid.", pos: 'phr', ipa: '/ɪts soʊ ˈhjuːmɪd/', vi: 'Trời nồm / oi quá.', ex: "It's so humid. My clothes never dry.", exVi: 'Trời ẩm quá. Quần áo chẳng bao giờ khô.', more: '**humid** = ẩm (nóng ẩm, oi) · **damp** = ẩm ướt khó chịu (tường, sàn, quần áo).', anh: 'droplet' },
          { w: "It's boiling!", pos: 'phr', ipa: '/ɪts ˈbɔɪlɪŋ/', vi: 'Nóng như đổ lửa!', ex: "It's boiling today! Thirty-eight degrees.", exVi: 'Hôm nay nóng như đổ lửa! Ba mươi tám độ.', more: 'Ngược lại: **It\'s freezing!** (rét cóng).', anh: 'hot-face' },
          { w: "It's pouring.", pos: 'phr', ipa: '/ɪts ˈpɔːrɪŋ/', vi: 'Mưa như trút.', ex: "Take an umbrella. It's pouring.", exVi: 'Mang ô đi. Mưa như trút nước.', more: 'Mưa nhỏ: **It\'s drizzling.** (mưa phùn) · **spitting** (Anh, lất phất).', anh: 'cloud-with-rain' },
          { w: 'Lovely weather today!', pos: 'phr', ipa: '/ˈlʌvli ˈweðər təˈdeɪ/', vi: 'Hôm nay trời đẹp ghê!', ex: 'Lovely weather today! Perfect for a walk.', exVi: 'Hôm nay trời đẹp ghê! Đi dạo là hết ý.', anh: 'sun' },
          { w: 'It usually stops in April.', pos: 'phr', ipa: '/ɪt ˈjuːʒuəli stɑːps ɪn ˈeɪprəl/', vi: 'Thường đến tháng Tư là hết.', ex: "Don't worry, the rain usually stops in the afternoon.", exVi: 'Đừng lo, mưa thường tạnh vào buổi chiều.' },
          { w: 'Any plans for the weekend?', pos: 'phr', ipa: '/ˈeni ˈplænz fər ðə ˈwiːkend/', vi: 'Cuối tuần có định làm gì không?', ex: 'Hey, Niamh! Any plans for the weekend?', exVi: 'Chị Niamh! Cuối tuần chị có định làm gì không?', more: 'Câu đầy đủ: Do you have any plans for the weekend?' },
          { w: 'Nothing special.', pos: 'phr', ipa: '/ˈnʌθɪŋ ˈspeʃl/', vi: 'Không có gì đặc biệt.', ex: 'Nothing special. Just relaxing at home. You?', exVi: 'Không có gì đặc biệt. Chỉ nghỉ ở nhà thôi. Còn bạn?', more: 'Nói xong **luôn thêm "You?"** để trả lượt.' },
          { w: 'sleep in', pos: 'v', ipa: '/ˌsliːp ˈɪn/', vi: 'ngủ nướng, dậy muộn', ex: 'I usually sleep in on Saturdays.', exVi: 'Thứ Bảy mình thường ngủ nướng.', anh: 'sleeping-face' },
          { w: 'What do you do in your free time?', pos: 'phr', ipa: '/ˈwʌt də ju ˈduː ɪn jər ˌfriː ˈtaɪm/', vi: 'Lúc rảnh bạn hay làm gì?', ex: 'So, what do you do in your free time?', exVi: 'Thế lúc rảnh bạn hay làm gì?', more: 'Tự nhiên hơn hẳn "What is your hobby?" (nghe như phiếu khảo sát).' },
          { w: "I'm really into…", pos: 'phr', ipa: '/aɪm ˈrɪəli ˈɪntuː/', vi: 'Mình đang rất mê…', ex: "I'm really into photography at the moment.", exVi: 'Dạo này mình đang mê chụp ảnh lắm.', more: 'Sau **into** là danh từ hoặc V-ing: into hiking, into K-pop.' },
          { w: 'I love hiking.', pos: 'phr', ipa: '/aɪ ˈlʌv ˈhaɪkɪŋ/', vi: 'Mình mê đi bộ đường dài.', ex: 'I love hiking. I go once a month.', exVi: 'Mình mê đi bộ đường dài. Mỗi tháng mình đi một lần.', anh: 'hiking-boot' },
          { w: 'I enjoy cooking.', pos: 'phr', ipa: '/aɪ ɪnˈdʒɔɪ ˈkʊkɪŋ/', vi: 'Mình thích nấu ăn.', ex: 'I enjoy cooking, but I hate washing up.', exVi: 'Mình thích nấu ăn, nhưng ghét rửa bát.', more: '**enjoy + V-ing**, không có "enjoy to cook".', anh: 'cooking' },
          { w: "I'm not a big fan of…", pos: 'phr', ipa: '/aɪm nɑːt ə ˌbɪɡ ˈfæn əv/', vi: 'Mình không mê … lắm.', ex: "I'm not a big fan of horror films.", exVi: 'Mình không mê phim kinh dị lắm.', more: 'Cách nói "không thích" **mềm** hơn hẳn "I don\'t like…".' },
          { w: "I'm more of a… person.", pos: 'phr', ipa: '/aɪm ˈmɔːr əv ə … ˈpɝːsn/', vi: 'Mình thuộc kiểu thích … hơn.', ex: "I'm more of a coffee person. Tea's not for me.", exVi: 'Mình là dân cà phê. Trà không hợp mình.' },
          { w: 'How often do you go?', pos: 'phr', ipa: '/haʊ ˈɔːfn də ju ˈɡoʊ/', vi: 'Bạn đi bao lâu một lần?', ex: 'You play badminton? How often do you play?', exVi: 'Bạn chơi cầu lông à? Bao lâu bạn chơi một lần?', more: 'Câu hỏi tiếp **dễ nhất** sau mọi sở thích.' },
          { w: 'once a week · twice a month', pos: 'phr', ipa: '/wʌns ə ˈwiːk · twaɪs ə ˈmʌnθ/', vi: 'mỗi tuần một lần · mỗi tháng hai lần', ex: 'We play twice a week, on Tuesdays and Sundays.', exVi: 'Bọn mình chơi mỗi tuần hai lần, thứ Ba và Chủ nhật.', more: 'Ba lần trở lên: **three times a week**.' },
          { w: 'What do you like about it?', pos: 'phr', ipa: '/ˈwʌt də ju ˈlaɪk əˈbaʊt ɪt/', vi: 'Bạn thích nó ở điểm nào?', ex: 'You love hiking? What do you like about it?', exVi: 'Bạn mê đi bộ đường dài à? Bạn thích nó ở điểm nào?', more: 'Câu hỏi làm người kia **kể nhiều nhất**. Ai cũng thích nói về điều mình mê.' },
          { w: 'Oh, nice!', pos: 'phr', ipa: '/oʊ ˈnaɪs/', vi: 'Ồ, hay đấy!', ex: 'I go to Ba Vi once a month. — Oh, nice!', exVi: 'Mỗi tháng mình lên Ba Vì một lần. — Ồ, hay đấy!' },
          { w: 'That sounds fun!', pos: 'phr', ipa: '/ðæt saʊndz ˈfʌn/', vi: 'Nghe vui đấy!', ex: 'A pub quiz? That sounds fun!', exVi: 'Đố vui ở quán á? Nghe vui đấy!', more: 'Cùng khung: That sounds **great / amazing / relaxing / tiring**.' },
          { w: 'Really?', pos: 'phr', ipa: '/ˈriːəli/', vi: 'Thật á?', ex: 'It snows in Sa Pa. — Really? I had no idea.', exVi: 'Sa Pa có tuyết đấy. — Thật á? Mình không hề biết.', more: '**Lên giọng** ↗ = ngạc nhiên thích thú. Xuống giọng đều đều = không tin hoặc không quan tâm.' },
          { w: 'No way!', pos: 'phr', ipa: '/ˌnoʊ ˈweɪ/', vi: 'Không thể nào! Thật á!', ex: 'You play the guitar too? No way!', exVi: 'Bạn cũng chơi guitar á? Thật luôn!', more: 'Thân mật. Với khách hay sếp lớn: **Really? That\'s amazing.**' },
          { w: 'Me too. · Me neither.', pos: 'phr', ipa: '/ˌmiː ˈtuː · ˌmiː ˈniːðər/', vi: 'Mình cũng vậy. · Mình cũng không.', ex: "I don't like getting up early. — Me neither!", exVi: 'Mình không thích dậy sớm. — Mình cũng không!', more: 'Câu **khẳng định** → Me too. Câu **phủ định** → Me neither.' },
          { w: 'What about you?', pos: 'phr', ipa: '/ˈwʌt əbaʊt ˈjuː/', vi: 'Còn bạn thì sao?', ex: 'I usually sleep in on Saturdays. What about you?', exVi: 'Thứ Bảy mình hay ngủ nướng. Còn bạn?', more: 'Cùng nghĩa How about you? (Ngày 1). Hai câu dùng thay nhau cho đỡ lặp.' },
          { w: 'to be honest', pos: 'phr', ipa: '/tə bi ˈɑːnɪst/', vi: 'nói thật thì', ex: "To be honest, I'm not really into sport.", exVi: 'Nói thật thì mình không mê thể thao lắm.', more: 'Đặt trước câu **không thích** để câu nghe nhẹ và thật lòng.' },
          { w: "I'd better get back to work.", pos: 'phr', ipa: '/aɪd ˈbetər ɡet ˈbæk tə ˈwɝːk/', vi: 'Thôi mình quay lại làm việc đây.', ex: "Well, I'd better get back to work. Nice chatting!", exVi: 'Thôi, mình quay lại làm việc đây. Nói chuyện vui ghê!', more: 'Câu **kết thúc khéo**: lấy lý do công việc, không ai thấy bị bỏ rơi.' },
          { w: 'Nice chatting with you.', pos: 'phr', ipa: '/ˌnaɪs ˈtʃætɪŋ wɪð ju/', vi: 'Nói chuyện với bạn vui ghê.', ex: 'Nice chatting with you, Jess. See you later!', exVi: 'Nói chuyện với chị vui ghê, Jess. Lát gặp lại!' },
          { w: 'Have a good one!', pos: 'phr', ipa: '/hæv ə ˈɡʊd wʌn/', vi: 'Chúc một ngày / buổi tốt lành!', ex: "This is me. Have a good one!", exVi: 'Tôi xuống đây. Chúc một ngày tốt lành!', more: '"one" thay cho day / evening / weekend. Dùng được ở mọi giờ.' },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Small talk với **bạn cùng nhóm** khác với khi ngồi chờ cùng **khách hàng** trước buổi họp. Với khách, chủ đề vẫn là thời tiết, cuối tuần, sở thích, chỉ có câu dài hơn và đầy đủ hơn.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp lớn, khách)'],
        rows: [
          ['Mở lời', 'Ugh, so hot!', "It's really hot today.", 'Quite warm today, isn\'t it? I hope the hotel is comfortable.'],
          ['Hỏi cuối tuần', 'Up to anything this weekend?', 'Any plans for the weekend?', 'Do you have any plans for the weekend?'],
          ['Hỏi sở thích', 'What are you into?', 'What do you do in your free time?', 'What do you enjoy doing when you are not working?'],
          ['Thích thú', 'No way! · Cool!', 'That sounds fun!', 'That sounds wonderful.'],
          ['Không thích', "Nah, not for me.", "I'm not a big fan, to be honest.", "I'm afraid I'm not much of a sports fan."],
          ['Kết thúc', 'Gotta go. Laters!', "I'd better get back to work. Nice chatting!", 'It was lovely talking to you. Enjoy the rest of your stay.'],
        ],
        caption: 'Chưa chắc thì dùng cột **giữa**. "Gotta go", "Laters" chỉ dùng với bạn thân cùng tuổi.',
      },
      {
        t: 'table',
        head: ['Chủ đề an toàn ✅', 'Nên tránh khi mới quen ⚠️'],
        rows: [
          ['Thời tiết, mùa (nồm, mùa mưa)', 'Lương, giá nhà, "bạn kiếm được bao nhiêu"'],
          ['Cuối tuần, kỳ nghỉ, du lịch', 'Tuổi, chuyện yêu đương, "bao giờ cưới", "có con chưa"'],
          ['Đồ ăn, quán ngon', 'Cân nặng, ngoại hình ("béo lên", "gầy đi", "đen thế")'],
          ['Sở thích, thể thao, phim, nhạc', 'Chính trị, tôn giáo'],
          ['Thành phố, giao thông, chỗ hay đi', 'Chê công ty, nói xấu đồng nghiệp vắng mặt'],
        ],
        caption: 'Ngày 1 bạn đã biết không hỏi tuổi và lương. Cột phải còn thêm **nhận xét ngoại hình**: ở Việt Nam "dạo này béo ra" là câu hỏi thăm, ở Anh, Mỹ, Úc là câu xúc phạm.',
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Kể **thói quen, sở thích, điều luôn đúng** thì dùng **hiện tại đơn**. Tiếng Việt chỉ cần thêm "thường", "hay": "Mình hay đánh cầu lông". Tiếng Anh thì động từ **đổi đuôi theo chủ ngữ**: I play, nhưng she play**s**. Đây là lỗi người Việt sai nhiều nhất khi nói nhanh.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'I / you / we / they + V (+ thời gian)',
            vi: 'Thói quen của mình, của nhóm. Động từ giữ nguyên.',
            examples: [
              { en: 'I play badminton on Sundays.', vi: 'Chủ nhật mình đánh cầu lông.' },
              { en: 'We play every week.', vi: 'Tuần nào bọn mình cũng chơi.' },
              { en: 'Most people close all the windows.', vi: 'Phần lớn mọi người đóng hết cửa sổ.' },
            ],
          },
          {
            formula: 'he / she / it + V-s / V-es',
            vi: 'Một người khác hoặc một vật: thêm -s. go → goes, watch → watches, have → has.',
            examples: [
              { en: 'She goes to Sa Pa every year.', vi: 'Năm nào mẹ cũng đi Sa Pa.' },
              { en: 'Jess loves hiking.', vi: 'Jess mê đi bộ đường dài.' },
              { en: 'It usually stops in April.', vi: 'Thường đến tháng Tư là hết.' },
            ],
          },
          {
            formula: "S + don't / doesn't + V",
            vi: 'Phủ định. Có doesn\'t rồi thì động từ **bỏ -s**.',
            examples: [
              { en: "I don't really drink.", vi: 'Mình không uống rượu bia mấy.' },
              { en: "Liam doesn't like the cold.", vi: 'Liam không thích lạnh.' },
              { en: "It doesn't snow in Hanoi.", vi: 'Hà Nội không có tuyết.' },
            ],
          },
          {
            formula: 'Do / Does + S + V…? · How often do you + V?',
            vi: 'Hỏi thói quen, sở thích.',
            examples: [
              { en: 'Do you like quizzes?', vi: 'Bạn có thích đố vui không?' },
              { en: 'Does she hike every weekend?', vi: 'Cuối tuần nào chị ấy cũng đi bộ đường dài à?' },
              { en: 'How often do you play?', vi: 'Bao lâu bạn chơi một lần?' },
            ],
          },
          {
            formula: 'like / love / enjoy / hate + V-ing',
            vi: 'Nói thích, ghét một hoạt động. Sau enjoy **chỉ** dùng V-ing.',
            examples: [
              { en: 'I love watching football.', vi: 'Mình mê xem bóng đá.' },
              { en: 'She enjoys baking at the weekend.', vi: 'Cuối tuần chị ấy thích làm bánh.' },
              { en: "I don't like getting up early.", vi: 'Mình không thích dậy sớm.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Từ', 'Tần suất', 'Đứng ở đâu', 'Ví dụ'],
        rows: [
          ['always', '100 %', 'trước động từ thường · sau be', 'Our team always loses. · It\'s always damp in March.'],
          ['usually', '~80 %', 'như trên', 'I usually sleep in.'],
          ['often', '~60 %', 'như trên', 'I often sleep only four hours.'],
          ['sometimes', '~30 %', 'như trên, hoặc đầu câu', 'Sometimes it snows.'],
          ['never', '0 %', 'như trên', 'It never gets this cold in Brisbane.'],
          ['every day / once a week…', 'cụ thể', '**cuối câu**', 'We play every week. · I go once a month.'],
        ],
        caption: 'Thêm -s thế nào: thường thêm **-s** (plays, likes) · sau s, sh, ch, x, o thêm **-es** (watches, goes) · phụ âm + y thì đổi **-ies** (study → studies) · have → **has**.',
      },
      {
        t: 'rule',
        formula: 'I / you / we / they + V · he / she / it + V-s · love / enjoy + V-ing',
        vi: 'Thói quen và sở thích dùng hiện tại đơn. Ngôi thứ ba số ít thêm -s. Hỏi và phủ định mượn do / does, khi đó động từ trở về nguyên dạng.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: but và so',
        items: [
          '**but** nối hai ý **ngược chiều**: "That sounds fun, **but** I don\'t really drink." · "I don\'t hike, **but** my mum loves the mountains."',
          '**so** nối **nguyên nhân → kết quả**: "It\'s cheap, **so** lots of students go there." · "The games start at 2 a.m., **so** I often sleep only four hours."',
          'Mẹo nhớ: trước **so** là lý do, sau **so** là chuyện xảy ra vì lý do đó. Đảo ngược là sai nghĩa.',
          '**but** còn là cách **từ chối mềm** đầu tiên của bạn: nhận là hay trước, nói điều mình ngại sau. Ngày 10 học đầy đủ cách từ chối lời mời.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd3-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: 'hiện tại đơn (I play / she plays) · love / enjoy + V-ing · but · so',
        items: [
          { q: 'Mình thường ngủ nướng vào thứ Bảy.', hint: 'usually, sleep in', answers: ['I usually sleep in on Saturdays.', 'I usually sleep in on Saturday.', 'I usually sleep in on Saturdays', 'On Saturdays I usually sleep in.', 'On Saturday I usually sleep in.'] },
          { q: 'Chị ấy đi Ba Vì mỗi tháng một lần.', hint: 'goes, once a month', answers: ['She goes to Ba Vi once a month.', 'She goes to Ba Vi once a month', 'She goes to Ba Vì once a month.'] },
          { q: 'Bạn có thích đi bộ đường dài không?', hint: 'do, like, hiking', answers: ['Do you like hiking?', 'Do you enjoy hiking?', 'Do you like to hike?'] },
          { q: 'Anh ấy không thích trời lạnh.', hint: "doesn't", answers: ["He doesn't like the cold.", "He doesn't like cold weather.", 'He does not like the cold.', 'He does not like cold weather.', "He doesn't like the cold weather."] },
          { q: 'Ở đó rẻ nên nhiều sinh viên tới.', hint: "it's cheap, so", answers: ["It's cheap, so lots of students go there.", "It's cheap so lots of students go there.", "It's cheap, so a lot of students go there.", "It's cheap, so many students go there.", 'It is cheap, so lots of students go there.', "It's cheap, so lots of students go."] },
          { q: 'Nghe vui đấy, nhưng mình không uống rượu bia mấy.', hint: "sounds, but, don't really", answers: ["That sounds fun, but I don't really drink.", "That sounds fun but I don't really drink.", "Sounds fun, but I don't really drink.", "That sounds fun. But I don't really drink.", "It sounds fun, but I don't really drink."] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 9 lỗi thật',
        items: [
          '~~I very like football.~~ → **I really like football.** / **I like football a lot.** "very" không đứng trước động từ. Đây là lỗi dịch thẳng "rất thích" phổ biến nhất.',
          '~~I like play badminton.~~ → **I like playing badminton.** Sau like / love / enjoy cần **V-ing** (like còn đi được với to + V, nhưng không bao giờ là V trơn).',
          '~~She go hiking every month.~~ → **She goes hiking every month.** Quên -s ở ngôi thứ ba. Khi nói nhanh ai cũng quên, nên hãy luyện chậm câu có she / he trước.',
          '~~Weather today very hot.~~ → **It\'s really hot today.** Tiếng Anh cần chủ ngữ giả **It** và động từ **be**. Không có câu nào thiếu cả hai.',
          '~~Do you free this weekend?~~ → **Are you free this weekend?** "free" là tính từ, nên câu hỏi mượn **are**, không mượn do.',
          '~~I\'m boring.~~ → **I\'m bored.** "I\'m boring" = "Tôi là người nhạt nhẽo". Cảm thấy chán thì dùng **bored**. Tương tự: interesting / interested, tiring / tired.',
          '~~My hobby is listen to music.~~ → **In my free time, I listen to music a lot.** Câu "My hobby is…" nghe như bài văn tiểu học. Nếu vẫn dùng thì phải là **listening**.',
          '~~You look fatter! · You\'re so dark now!~~ → **You look well!** (hoặc không nhận xét gì). Ở Việt Nam đây là quan tâm, với người Anh, Mỹ, Úc là xúc phạm thật sự.',
          '~~Yes. / No.~~ (trả lời một từ rồi im) → **Yes, I love it. The food is amazing.** Không sai ngữ pháp, nhưng người kia sẽ nghĩ bạn không muốn nói chuyện.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi nghe người khác kể' },
      {
        t: 'p',
        text: 'Trong small talk, **nghe** quan trọng ngang **nói**. Người kể nhìn mặt bạn để biết nên kể tiếp hay dừng. Bấm từng thẻ để nghe câu đi kèm cử chỉ.',
      },
      {
        t: 'hinh',
        title: 'Nghe sao cho người kể muốn kể tiếp',
        items: [
          { anh: 'eyes', w: 'Mm-hmm.', ro: '/ˌmʌm ˈhʌm/', vi: 'Nhìn người kể, thỉnh thoảng gật nhẹ và nói "mm-hmm" = "tôi đang nghe, kể tiếp đi".' },
          { anh: 'face-with-open-mouth', w: 'No way! Really?', ro: '/ˌnoʊ ˈweɪ ˈriːəli/', vi: 'Nhướn mày, mắt mở to khi ngạc nhiên. Mặt không đổi mà miệng nói "No way" nghe như mỉa mai.' },
          { anh: 'grinning-face-with-smiling-eyes', w: 'That sounds fun!', ro: '/ðæt saʊndz ˈfʌn/', vi: 'Khen thì cười **cả mắt** và lên giọng. Giọng đều đều + mặt nghiêm = "chẳng vui gì".' },
          { anh: 'cold-face', w: "Brr, it's freezing!", ro: '/ɪts ˈfriːzɪŋ/', vi: 'Rụt vai, xoa hai tay = lạnh. Cử chỉ này ở đâu cũng hiểu, rất hợp để mở chuyện thời tiết.' },
          { anh: 'hot-face', w: "It's boiling!", ro: '/ɪts ˈbɔɪlɪŋ/', vi: 'Lấy tay quạt quạt trước mặt = nóng quá. Đi kèm nụ cười, không nhăn nhó.' },
          { anh: 'mobile-phone-off', w: '(đừng làm) xem điện thoại khi người ta đang kể', ro: '', vi: 'Liếc điện thoại = "chuyện của bạn chán". Có tin gấp thì nói trước: "Sorry, one second."' },
          { anh: 'face-with-rolling-eyes', w: '(đừng làm) Oh, right…', ro: '', vi: 'Đảo mắt lên trên ở Anh, Mỹ, Úc = khinh thường, chán ngán. Rất dễ làm vô tình khi đang nghĩ.' },
          { anh: 'stopwatch', w: "I'd better get back to work.", ro: '/aɪd ˈbetər ɡet ˈbæk tə ˈwɝːk/', vi: 'Muốn kết thúc: liếc đồng hồ **một lần**, nói câu này kèm nụ cười. Liếc liên tục trong lúc người ta kể là bất lịch sự.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Nói chuyện với người lạ', 'Ít khi bắt chuyện với người lạ.', 'Mỹ, Úc: rất hay nói vài câu với người lạ (thang máy, xếp hàng). Anh: hay nói về thời tiết, nhưng thang máy ở London thường im lặng.', 'Chào và nói một câu thời tiết ("Hôm nay nóng nhỉ") là đủ, hiếm khi nói dài.'],
          ['Im lặng giữa câu chuyện', 'Bình thường.', 'Quá 3–4 giây là **ngượng**. Lấp bằng một câu hỏi.', 'Im lặng là bình thường, là đang nghĩ.'],
          ['Nhận xét ngoại hình', '"Béo ra / gầy đi" là hỏi thăm.', '**Xúc phạm.** Chỉ khen quần áo, kiểu tóc: "Nice jacket!"', 'Tránh nhận xét cơ thể.'],
          ['Được khen', 'Chối: "Đâu có, bình thường mà."', '**Nhận lời khen**: "Thanks! That\'s nice of you." Chối mãi làm người khen ngượng.', 'Chối khiêm tốn như Việt Nam.'],
          ['Khoảng cách trong thang máy', 'Đứng sát cũng không sao.', 'Đứng cách nhau, quay mặt về cửa. Nói chuyện nhỏ giọng.', 'Đứng im, nói rất nhỏ hoặc không nói.'],
        ],
        caption: 'Với người Anh, Mỹ, Úc: **nhận lời khen bằng "Thanks!"** là kỹ năng nhỏ nhưng làm bạn trông tự tin hẳn. Với đồng nghiệp Nhật: small talk ngắn, đừng ngại khoảng lặng.',
      },

      { t: 'h', text: '7. Phát âm: đuôi -s, đuôi -ing và giọng thích thú' },
      {
        t: 'p',
        text: 'Đuôi **-s** có ba cách đọc: **/z/** sau âm hữu thanh (plays, goes), **/s/** sau p, t, k, f (likes, stops), **/ɪz/** sau s, sh, ch (watches: thêm hẳn một âm tiết). Đuôi **-ing** là **/ɪŋ/**, ngậm lưỡi sau, không đọc thành "in". Và câu phản hồi (Really? · That sounds fun!) phải có **giọng lên xuống**, đọc đều đều là nghe như chán.',
      },
      {
        t: 'phatam',
        id: 'gtd3-phat-am',
        title: 'Luyện phát âm — đuôi -s / -ing, nối âm và ngữ điệu thích thú',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Phóng đại đuôi -s lúc đầu cho quen, rồi đọc tự nhiên dần.',
        items: [
          { text: 'He plays badminton.', ipa: 'hi pleɪz ˈbædmɪntən', vi: 'plays: đuôi /z/, rung cổ họng · badminton nhấn âm đầu BAD' },
          { text: 'She likes hiking.', ipa: 'ʃi laɪks ˈhaɪkɪŋ', vi: 'likes: đuôi /s/ · hiking: đuôi /ɪŋ/, không phải "hai-kin"' },
          { text: 'He watches football.', ipa: 'hi ˈwɑːtʃɪz ˈfʊtbɔːl', vi: 'watches: hai âm tiết WAT-chiz · football: /ʊ/ ngắn' },
          { text: 'Really?', ipa: 'ˈriːəli', vi: 'lên giọng ↗ ở cuối = ngạc nhiên thích thú' },
          { text: 'Oh, that sounds fun!', ipa: 'oʊ ðæt saʊndz fʌn', vi: 'sounds có cụm /ndz/ · nhấn và lên giọng ở fun' },
          { text: 'I usually sleep in on Saturdays.', ipa: 'aɪ ˈjuːʒuəli sliːp ɪn ɑːn ˈsætərdeɪz', vi: 'usually: /ʒ/ giữa từ · nối sleep‿in‿on · Saturdays đuôi /z/' },
          { text: 'How often do you go?', ipa: 'haʊ ˈɔːfn də ju ɡoʊ', vi: 'often: phần lớn người bản xứ không đọc /t/ · do you đọc nhẹ /də ju/' },
          { text: "I'm not a big fan of horror films.", ipa: 'aɪm nɑːt ə bɪɡ fæn əv ˈhɔːrər fɪlmz', vi: 'nối not‿a‿big · of đọc nhẹ /əv/ · films có /lmz/' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: ở máy pha cà phê' },
      {
        t: 'dialogue',
        title: 'Sáng thứ Ba — Đạt gặp Marco, kỹ sư người Mỹ mới vào, ở máy pha cà phê',
        lines: [
          { who: 'Marco', role: 'b', text: "Morning! It's so humid today.", vi: 'Chào buổi sáng! Hôm nay ẩm quá.' },
          { who: 'Đạt', role: 'a', text: "I know! It's always like this in March. How are you finding Hanoi?", vi: 'Đúng thế! Tháng Ba lúc nào cũng vậy. Anh thấy Hà Nội thế nào?' },
          { who: 'Marco', role: 'b', text: 'I love it, but the traffic is crazy. So, what do you do in your free time?', vi: 'Anh thích lắm, nhưng giao thông thì kinh khủng. Mà lúc rảnh em hay làm gì?' },
          { who: 'Đạt', role: 'a', text: "I play badminton. We play every Sunday near my university. What about you?", vi: 'Em đánh cầu lông. Chủ nhật nào bọn em cũng chơi gần trường. Còn anh?' },
          { who: 'Marco', role: 'b', text: "I'm really into photography. I take photos of the Old Quarter at night.", vi: 'Anh đang mê chụp ảnh. Anh hay chụp phố cổ buổi tối.' },
          { who: 'Đạt', role: 'a', text: 'Oh, nice! How often do you go?', vi: 'Ồ, hay quá! Anh đi bao lâu một lần?' },
          { who: 'Marco', role: 'b', text: 'Twice a week. The street food stalls look amazing in photos.', vi: 'Mỗi tuần hai lần. Mấy hàng ăn vỉa hè lên ảnh đẹp lắm.' },
          { who: 'Đạt', role: 'a', text: 'That sounds fun! Do you eat there too?', vi: 'Nghe vui thật! Anh có ăn ở đó luôn không?' },
          { who: 'Marco', role: 'b', text: 'Every time! Okay, I have a meeting. Nice chatting with you, Đạt.', vi: 'Lần nào cũng ăn! Thôi, anh có cuộc họp. Nói chuyện với em vui ghê, Đạt.' },
          { who: 'Đạt', role: 'a', text: 'You too, Marco. Have a good one!', vi: 'Em cũng vậy, anh Marco. Chúc anh một ngày tốt lành!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd3-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Đạt (5 câu)',
        items: [
          { vi: 'Marco: "It\'s so humid today." → Bạn: Đúng thế! Tháng Ba lúc nào cũng vậy.', chips: ['I', 'know!', "It's", 'always', 'like', 'this', 'in', 'March.', 'on', 'never'], answer: ['I', 'know!', "It's", 'always', 'like', 'this', 'in', 'March.'] },
          { vi: 'Marco: "What do you do in your free time?" → Bạn: Em đánh cầu lông.', chips: ['I', 'play', 'badminton.', 'plays', 'the', 'playing'], answer: ['I', 'play', 'badminton.'] },
          { vi: 'Bạn kể thêm: Chủ nhật nào bọn em cũng chơi.', chips: ['We', 'play', 'every', 'Sunday.', 'plays', 'all', 'in'], answer: ['We', 'play', 'every', 'Sunday.'] },
          { vi: 'Marco: "I\'m really into photography." → Bạn: Ồ, hay quá! Anh đi bao lâu một lần?', chips: ['Oh,', 'nice!', 'How', 'often', 'do', 'you', 'go?', 'does', 'much'], answer: ['Oh,', 'nice!', 'How', 'often', 'do', 'you', 'go?'] },
          { vi: 'Marco: "Nice chatting with you." → Bạn: Em cũng vậy. Chúc anh một ngày tốt lành!', chips: ['You', 'too.', 'Have', 'a', 'good', 'one!', 'day', 'nice'], answer: ['You', 'too.', 'Have', 'a', 'good', 'one!'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd3-noi-tra-loi',
        part: '1',
        questions: [
          "It's really hot today, isn't it? Do you like this weather?",
          'Any plans for the weekend?',
          'What do you do in your free time?',
          'How often do you do that?',
          'What do you like about it?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đoạn đề bài dưới đây. Mục tiêu: **mỗi câu trả lời phải có một chi tiết thêm**, và bạn hỏi lại ít nhất 3 lần.',
          '"You are Marco, a friendly American software engineer who just moved to Hanoi. We are colleagues chatting at the office coffee machine on a humid morning. Start with a comment about the weather. Then ask me about my weekend plans and my hobbies. Speak at A2 level with short sentences. If I answer with only one or two words, look a little bored and say something short like \'Oh, right.\' so I notice. If I give an extra detail or ask you a question back, become interested and keep talking. After about 10 turns, end the conversation politely with a work reason. Then tell me in Vietnamese: how many times I added a detail, how many times I asked you back, and every mistake with he/she + verb-s."',
          'Lượt hai: bạn mở lời trước bằng một câu về thời tiết hôm nay ở chỗ bạn, và bạn là người kết thúc câu chuyện bằng "I\'d better get back to work."',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd3-doc',
    kind: 'reading',
    title: 'Bài đăng mạng xã hội & bình luận',
    goal: 'Đọc hiểu bài đăng và bình luận của đồng nghiệp nước ngoài trên mạng xã hội: ý chính, giọng đùa hay thật, các cụm hay gặp; tự viết được bình luận ngắn, tự nhiên.',
    minutes: 18,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Small talk không chỉ diễn ra ở thang máy. Đồng nghiệp nước ngoài còn **đăng ảnh cuối tuần, than thời tiết, khoe sở thích** trên mạng, và bình luận ở đó cũng là một kiểu small talk.',
          'Bốn bài đăng của những người bạn vừa gặp trong bài Nghe: Liam than nồm, Niamh khoe thắng đố vui, Jess đăng ảnh Ba Vì, và câu lạc bộ chạy bộ của công ty.',
          'Học đọc **giọng điệu**: câu nào đùa (So jealous! = khen), câu nào cường điệu (life-changing), emoji nói gì.',
          'Cuối bài: tự viết 5 bình luận ngắn, đúng giọng.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn bài đăng sau' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'camera-with-flash', 'speech-balloon', 'red-heart', 'trophy', 'sunrise-over-mountains'],
        caption: 'Tối Chủ nhật, Đạt lướt điện thoại và thấy bài đăng của các đồng nghiệp người nước ngoài.',
      },
      {
        t: 'passage',
        title: 'Weekend posts — what your colleagues share',
        intro: 'Đọc chậm một lượt, chưa cần tra từ. Chỗ in đậm là cụm đáng nhớ. Tên sau dấu @ là người được nhắc tới.',
        paras: [
          {
            label: 'A',
            text: '**Liam Walsh** · 2 days ago — Day 15 in Hanoi. My towel is wet. My socks are wet. My WALLS are wet. **Is this normal??** 😩 · 💬 **Đạt Nguyen**: Welcome to nồm season 😂 Close your windows, it helps, **I promise**. · 💬 **Maya Patel**: **Same here!** Buy a dehumidifier. **Life-changing.** · 💬 **Liam Walsh**: @Đạt Nguyen **cheers mate**, closing them now 🙏',
          },
          {
            label: 'B',
            text: '**Niamh Byrne** · 1 day ago — PUB QUIZ CHAMPIONS!!! 🏆 **Huge thanks to** our new team member @Đạt Nguyen, who got every football question right. **Same time next Saturday?** · 💬 **Jess Taylor**: **Congrats!!** 🎉 **Count me in** next week. · 💬 **Ben Clarke**: **Not fair.** You guys win every week 😤 · 💬 **Đạt Nguyen**: **Thanks for having me!** It was so much fun 😄',
          },
          {
            label: 'C',
            text: '**Jess Taylor** · 5 hours ago — Sunrise at Ba Vi this morning ⛰️ 4:30 a.m. alarm = **totally worth it**. #weekendvibes · 💬 **Maya Patel**: **Stunning!** 😍 · 💬 **Ben Clarke**: Ugh, **so jealous**. I was still in bed at 4:30. · 💬 **Đạt Nguyen**: Wow! My mum says the view from the top is even better. · 💬 **Jess Taylor**: @Đạt Nguyen next time! Can you **DM me** her tips? 🙏',
          },
          {
            label: 'D',
            text: '**Company Notice Board — Running Club 🏃** · Posted by **Maya Patel** — We run 5 km around West Lake every Wednesday at 6 a.m. **All levels welcome** — we are SLOW 🐢 and we stop for coffee after. **Drop a 👍 if you\'re interested** and I\'ll add you to the group chat. · 💬 **Liam Walsh**: 👍 Is it humid at 6 a.m. too? 😅 · 💬 **Maya Patel**: @Liam Walsh yes. **Sorry not sorry.**',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd3-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Trong bài A, Liam viết "My WALLS are wet" bằng chữ in hoa. Vì sao?',
            options: ['Anh ấy viết nhầm', 'Để nhấn mạnh, như đang nói to vì ngạc nhiên, bực mình', 'Vì đó là tên riêng', 'Để trang trọng hơn'],
            correct: 1,
            why: 'Trên mạng, **CHỮ IN HOA** = nói to, nhấn mạnh. Một hai từ thì vui. Viết hoa cả bình luận dài thì nghe như đang **quát**.',
          },
          {
            q: 'Maya viết "Life-changing." về máy hút ẩm. Ý cô ấy là gì?',
            options: ['Máy hút ẩm làm cô ấy đổi nghề', 'Máy hút ẩm giúp ích rất nhiều (nói cường điệu cho vui)', 'Máy hút ẩm rất đắt', 'Cô ấy muốn bán máy hút ẩm'],
            correct: 1,
            why: 'Mạng xã hội tiếng Anh rất hay **cường điệu**: life-changing, obsessed, the best thing ever. Hiểu là "tốt lắm, nên mua".',
          },
          {
            q: '"Cheers mate" của Liam nghĩa là gì?',
            options: ['Chúc sức khoẻ, cạn ly', 'Cảm ơn bạn nhé', 'Tạm biệt', 'Xin lỗi'],
            correct: 1,
            why: 'Ở Anh, Úc, **Cheers** thường nghĩa là **cảm ơn** (thân mật). **mate** = bạn. Chỉ khi nâng ly thì Cheers mới là "cạn ly".',
          },
          {
            q: 'Ben bình luận "Not fair. You guys win every week 😤". Giọng của Ben thế nào?',
            options: ['Giận thật, muốn khiếu nại', 'Đùa, giả vờ ghen tị', 'Buồn', 'Chê đội của Niamh gian lận'],
            correct: 1,
            why: 'Emoji 😤 và chuyện đố vui ở quán cho thấy đây là **đùa vui giữa đồng nghiệp**. Giả vờ ghen tị là một cách khen.',
          },
          {
            q: 'Jess viết "Count me in next week". Jess muốn nói gì?',
            options: ['Đếm giúp tôi số điểm', 'Tuần sau cho tôi tham gia với', 'Tuần sau tôi bận', 'Tôi sẽ đếm số người'],
            correct: 1,
            why: '**Count me in** = tính cả tôi vào, tôi tham gia. Ngược lại: **Count me out** = tôi không tham gia.',
          },
          {
            q: '"So jealous" trong bình luận của Ben ở bài C có nghĩa thật là gì?',
            options: ['Ben ghét Jess', 'Ảnh đẹp quá, ước gì mình cũng ở đó (một lời khen)', 'Ben muốn Jess xoá ảnh', 'Ben giận vì không được rủ'],
            correct: 1,
            why: 'Dưới ảnh du lịch, **"So jealous!"** gần như luôn là **lời khen**. Câu sau "I was still in bed at 4:30" là tự trêu mình.',
          },
          {
            q: 'Jess nhờ Đạt "DM me her tips". Đạt nên làm gì?',
            options: ['Viết hết mẹo vào bình luận công khai', 'Nhắn tin riêng cho Jess các mẹo của mẹ', 'Gọi điện cho mẹ Jess', 'Đăng một bài mới'],
            correct: 1,
            why: '**DM** = direct message, tin nhắn riêng. Người ta xin nhắn riêng khi nội dung dài hoặc riêng tư.',
          },
          {
            q: 'Bài D: "All levels welcome — we are SLOW 🐢" muốn nói điều gì với người đọc?',
            options: ['Chỉ người chạy giỏi mới được tham gia', 'Ai cũng tham gia được, không cần chạy nhanh', 'Câu lạc bộ sắp đóng cửa', 'Phải trả phí'],
            correct: 1,
            why: '**All levels welcome** = mọi trình độ đều được chào đón. Kể thêm "we are slow" và "stop for coffee" để người mới **bớt ngại**.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp trong bài đăng và bình luận' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Dùng khi'],
        rows: [
          ['Same here!', 'Mình cũng vậy!', 'Đồng cảm với chuyện người đăng than / kể'],
          ['Congrats! 🎉', 'Chúc mừng!', 'Tin vui: thắng giải, có việc mới, sinh nhật'],
          ['Count me in!', 'Cho mình tham gia với!', 'Trả lời một lời rủ chung'],
          ['So jealous!', 'Ghen tị quá! (= đẹp quá, vui quá)', 'Ảnh du lịch, đồ ăn ngon'],
          ['Stunning! · Gorgeous!', 'Đẹp tuyệt!', 'Ảnh phong cảnh'],
          ['Totally worth it.', 'Hoàn toàn xứng đáng.', 'Kể việc vất vả mà kết quả tốt'],
          ['Thanks for having me!', 'Cảm ơn đã cho mình tham gia!', 'Khách / người mới cảm ơn chủ nhà, đội'],
          ['Cheers (mate)!', 'Cảm ơn (bạn) nhé!', 'Anh, Úc, thân mật'],
          ['DM me.', 'Nhắn riêng cho mình nhé.', 'Nội dung dài hoặc riêng tư'],
          ["Drop a 👍 if you're interested.", 'Ai quan tâm thì thả 👍.', 'Bài rủ đi chơi, khảo sát nhanh'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo bình luận cho tự nhiên',
        items: [
          '**Ngắn**: 3–10 từ là đủ. Công thức: **phản ứng + một chi tiết**. "Stunning! Is that Ba Vi?" Giống hệt công thức giữ chuyện ở bài Nói.',
          'Thay "**Very beautiful!**" (nghe như học sinh) bằng **Stunning!** · **Gorgeous!** · **Love this!**',
          'Emoji tiếng Anh dùng như tiếng Việt, nhưng 😂 nghĩa là **buồn cười thật**, không phải cười trừ. Khi người ta than chuyện buồn, đừng dùng 😂.',
          'Bài đăng công khai thì **đừng hỏi chuyện riêng** (lương, người yêu, giá nhà). Muốn hỏi thì DM, và vẫn theo quy tắc chủ đề an toàn ở bài Nói.',
          '**Sorry not sorry** = "xin lỗi nhưng chẳng hối hận đâu" (đùa). Chỉ dùng với người đã thân.',
        ],
      },

      { t: 'h', text: '3. Tập viết bình luận' },
      {
        t: 'mcq',
        id: 'gtd3-doc-chon-binh-luan',
        title: 'Chọn bình luận hợp nhất (3 câu)',
        items: [
          {
            q: 'Đồng nghiệp người Mỹ đăng ảnh bánh tự làm: "My first banana bread! 🍞". Bạn bình luận:',
            options: ['Very beautiful bread.', 'Looks amazing! Can I get the recipe?', 'How much money did you spend?', 'Your bread is a bit ugly lol.'],
            correct: 1,
            why: 'Phản ứng (Looks amazing!) + một câu hỏi (xin công thức) = bình luận tự nhiên. Câu A cứng, C hỏi chuyện tiền, D đùa quá đà với người chưa thân.',
          },
          {
            q: 'Một đồng nghiệp viết: "Stuck in traffic for 2 hours today 😩". Bạn bình luận:',
            options: ['😂😂😂', 'Oh no! Same here last week. Hope you\'re home now.', 'You should buy a car.', 'Count me in!'],
            correct: 1,
            why: 'Người ta đang than thì **đồng cảm** (Oh no! · Same here). 😂 là cười trên nỗi khổ, Count me in thì sai ngữ cảnh.',
          },
          {
            q: 'Bài đăng rủ: "Dinner at a new pho place on Friday. Who\'s in? 🍜". Bạn muốn đi:',
            options: ['Count me in!', 'Count me out!', 'Congrats!', 'Thanks for having me!'],
            correct: 0,
            why: '**Count me in** = cho tôi tham gia. "Thanks for having me" dùng **sau khi** đã đi (cảm ơn chủ nhà).',
          },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd3-doc-binh-luan',
        title: 'Viết 5 bình luận (dịch Việt → Anh)',
        kind: 'translate',
        grammar: 'phản ứng + một chi tiết · Same here · Count me in · So jealous',
        items: [
          { q: 'Đẹp tuyệt! Đây là ở Sa Pa à?', hint: 'stunning, is this', answers: ['Stunning! Is this Sa Pa?', 'Stunning! Is that Sa Pa?', 'Stunning! Is this in Sa Pa?', 'Stunning! Is that in Sa Pa?', 'Gorgeous! Is this Sa Pa?', 'Gorgeous! Is that Sa Pa?'] },
          { q: 'Chúc mừng! Tuần sau cho mình tham gia với.', hint: 'congrats, count me in', answers: ['Congrats! Count me in next week.', 'Congratulations! Count me in next week.', 'Congrats! Count me in next week!', 'Congrats! Count me in for next week.'] },
          { q: 'Mình cũng vậy! Quần áo mình chẳng bao giờ khô.', hint: 'same here, never dry', answers: ['Same here! My clothes never dry.', 'Same here! My clothes never get dry.', 'Same here. My clothes never dry.', 'Me too! My clothes never dry.'] },
          { q: 'Ghen tị quá! Mình vẫn còn trên giường.', hint: 'so jealous, still in bed', answers: ["So jealous! I'm still in bed.", 'So jealous! I am still in bed.', "So jealous! I'm still in bed lol.", "So jealous. I'm still in bed."] },
          { q: 'Cảm ơn đã cho mình tham gia! Vui lắm.', hint: 'thanks for having me, so much fun', answers: ['Thanks for having me! It was so much fun.', 'Thanks for having me! It was a lot of fun.', 'Thanks for having me! So much fun.', 'Thank you for having me! It was so much fun.', 'Thanks for having me! It was really fun.'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd3-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 3',
    goal: 'Làm 35 câu có đáp án để giữ được câu chuyện phiếm, chia đúng hiện tại đơn, dùng love / enjoy + V-ing, but, so; ôn lại chào hỏi và hỏi lại của Ngày 1–2.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · chia động từ · dịch · nghe chép · ghép câu.',
          'Có **5 câu ôn Ngày 1–2** (đánh dấu "Ôn N1", "Ôn N2") trộn trong các phần.',
          'Phần II chú ý **-s / -es** ở he, she, it và **V-ing** sau love, enjoy.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 4. Sai nhiều ở phần II thì đọc lại mục 🧱 của bài Nói.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd3-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp hỏi: "Do you like Hanoi?" Câu trả lời nào giữ được câu chuyện?',
            options: ['Yes.', 'Yes, I do.', 'Yes, I love it. The food is great, but the traffic is crazy. Do you live near here?', 'Yes, Hanoi is the capital of Vietnam.'],
            correct: 2,
            why: 'Trả lời + kể thêm + hỏi lại. Câu A và B đúng nhưng làm câu chuyện dừng lại. Câu D là thông tin sách giáo khoa, không phải cảm nhận.',
          },
          {
            q: 'Chiều thứ Sáu, sếp người Anh hỏi: "Any plans for the weekend?" Bạn không có kế hoạch gì. Bạn nói:',
            options: ['No.', "Nothing special. Just relaxing at home. How about you?", 'Why do you ask?', 'I have no plan.'],
            correct: 1,
            why: '**Nothing special** + một chi tiết + hỏi lại. "Why do you ask?" làm người hỏi tưởng bạn khó chịu.',
          },
          {
            q: 'Bạn kể chuyện game đã 2 phút. Người nghe đáp "Uh-huh… Oh, right." Bạn nên:',
            options: ['Kể tiếp chi tiết hơn', 'Nói to hơn', 'Dừng lại, hỏi: "Sorry, I talk too much! What about you?"', 'Hỏi: "Why are you bored?"'],
            correct: 2,
            why: 'Câu đáp ngắn liên tiếp = người nghe không hứng thú. Nhận ra rồi **trả lượt** như Đạt ở Cảnh 3.',
          },
          {
            q: 'Đồng nghiệp kể: "I go hiking in Ba Vi once a month." Câu phản hồi nào hay nhất?',
            options: ['Oh.', 'Oh, nice! What do you like about it?', 'Hiking is dangerous.', 'I very like hiking too.'],
            correct: 1,
            why: 'Phản hồi + câu hỏi tiếp làm người kia kể nhiều. Câu D sai ngữ pháp ("very like").',
          },
          {
            q: 'Một khách hàng người Nhật ngồi chờ cùng bạn trước buổi họp. Câu mở lời nào hợp nhất?',
            options: ["It's very hot today. I hope you're comfortable at the hotel.", 'How much is your salary in Japan?', 'Are you married?', 'You look tired.'],
            correct: 0,
            why: 'Thời tiết + quan tâm chỗ ở là mở lời an toàn với khách. Lương, hôn nhân, nhận xét vẻ mặt đều nên tránh.',
          },
          {
            q: 'Bạn không thích phim kinh dị. Đồng nghiệp rủ xem phim kinh dị. Câu nào mềm nhất?',
            options: ["I hate horror films. No.", "To be honest, I'm not a big fan of horror films.", 'Horror films are stupid.', "I don't like."],
            correct: 1,
            why: '**To be honest + I\'m not a big fan of…** nói thật mà không làm người rủ mất hứng.',
          },
          {
            q: 'Đồng nghiệp người Mỹ nói: "It\'s ninety degrees today!" Bạn hiểu là:',
            options: ['Trời 90 độ C, sắp cháy', 'Trời khoảng 32 độ C, nóng', 'Trời rất lạnh', 'Có góc vuông'],
            correct: 1,
            why: 'Mỹ dùng **độ F**. 90 °F ≈ 32 °C.',
          },
          {
            q: 'Đồng nghiệp khen: "Nice jacket!" Bạn đáp kiểu tự nhiên với người Anh, Mỹ:',
            options: ['No, no, it\'s very cheap and old.', 'Thanks! I got it in Da Lat.', 'Why? Do you want it?', 'Yes, I know.'],
            correct: 1,
            why: '**Nhận lời khen** + một chi tiết. Chối mãi ("cheap and old") làm người khen ngượng.',
          },
          {
            q: '(Ôn N1) Bạn gặp lại Jess sáng thứ Hai sau khi đã ăn trưa với chị ấy tuần trước. Bạn nói:',
            options: ['Nice to meet you, Jess.', 'Hi, Jess! Good to see you again.', 'How do you do?', "I'm Đạt. What's your name?"],
            correct: 1,
            why: 'Đã quen rồi thì dùng **see**: Good to see you again. "meet" chỉ dùng lần đầu.',
          },
          {
            q: '(Ôn N2) Niamh nói "pub quiz" mà bạn không biết nghĩa. Bạn hỏi:',
            options: ['What means pub quiz?', 'Sorry, what does "pub quiz" mean?', 'Pub quiz? What?', 'Repeat!'],
            correct: 1,
            why: 'Câu hỏi nghĩa của từ: **What does … mean?** (does + mean đứng cuối).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Chia động từ trong ngoặc' },
      {
        t: 'quiz',
        id: 'gtd3-bt-dien',
        title: 'Phần II — Điền dạng đúng (8 câu)',
        kind: 'fill',
        grammar: "I / you / we / they + V · he / she / it + V-s · don't / doesn't + V · love / enjoy + V-ing",
        items: [
          { q: 'Jess ___ (go) to Ba Vi once a month.', answers: ['goes'] },
          { q: 'We ___ (play) badminton every Sunday.', answers: ['play'] },
          { q: 'My mum ___ (watch) Korean dramas every evening.', answers: ['watches'] },
          { q: "Liam ___ (not / like) the cold.", answers: ["doesn't like", 'does not like', 'doesnt like'] },
          { q: 'I really enjoy ___ (cook) on Sundays.', answers: ['cooking'] },
          { q: '___ (do) she play any sport?', answers: ['Does'] },
          { q: 'It ___ (not / snow) in Hanoi.', answers: ["doesn't snow", 'does not snow', 'doesnt snow'] },
          { q: 'Đạt ___ (study) software engineering in Hanoi.', answers: ['studies'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd3-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'hiện tại đơn · love / enjoy + V-ing · but · so · What about you?',
        items: [
          { q: 'Lúc rảnh bạn hay làm gì?', hint: 'free time', answers: ['What do you do in your free time?', 'What do you usually do in your free time?', 'What do you like doing in your free time?', 'What do you do in your spare time?'] },
          { q: 'Mình mê chụp ảnh.', hint: 'love, taking photos', answers: ['I love taking photos.', 'I love photography.', "I'm really into photography.", 'I love taking pictures.', "I'm into photography.", 'I really love taking photos.'] },
          { q: 'Bạn chơi bao lâu một lần?', hint: 'how often', answers: ['How often do you play?', 'How often do you play it?'] },
          { q: 'Hôm nay trời nóng quá!', hint: "it's, so / really", answers: ["It's so hot today!", "It's really hot today!", "It's boiling today!", 'It is so hot today!', "It's very hot today!", "It's so hot today."] },
          { q: 'Mình không mê bóng đá lắm. Còn bạn?', hint: 'not a big fan, what about you', answers: ["I'm not a big fan of football. What about you?", "I'm not a big fan of football. How about you?", "I'm not a big fan of soccer. What about you?", "I'm not a big fan of soccer. How about you?", "I'm not really into football. What about you?"] },
          { q: 'Mình thích hiking, nhưng mình ghét dậy sớm.', hint: 'but, getting up early', answers: ['I love hiking, but I hate getting up early.', 'I like hiking, but I hate getting up early.', 'I love hiking but I hate getting up early.', 'I like hiking but I hate getting up early.', 'I enjoy hiking, but I hate getting up early.'] },
          { q: '(Ôn N1) Nói chuyện với bạn vui ghê. Hẹn gặp lại!', hint: 'nice chatting, see you', answers: ['Nice chatting with you. See you later!', 'Nice chatting with you. See you!', 'It was nice chatting with you. See you later!', 'Nice talking to you. See you later!', 'Nice chatting with you. See you soon!', 'It was nice talking to you. See you later!'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd3-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "It's so humid. My clothes never dry.", answer: "It's so humid. My clothes never dry.", alt: ["It's so humid, my clothes never dry.", 'It is so humid. My clothes never dry.'] },
          { label: 'Câu 2', spell: 'She enjoys baking at the weekend.', answer: 'She enjoys baking at the weekend.', alt: ['She enjoys baking at the weekend'] },
          { label: 'Câu 3', spell: "I'm not a big fan of horror films.", answer: "I'm not a big fan of horror films.", alt: ['I am not a big fan of horror films.', "I'm not a big fan of horror films"] },
          { label: 'Câu 4', spell: 'He watches every game, so he never gets enough sleep.', answer: 'He watches every game, so he never gets enough sleep.', alt: ['He watches every game so he never gets enough sleep.'] },
          { label: 'Câu 5 (Ôn N2)', spell: 'Sorry, I missed that. Say again?', answer: 'Sorry, I missed that. Say again?', alt: ['Sorry I missed that, say again?', 'Sorry, I missed that, say again?'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd3-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Cuối tuần có định làm gì không?', chips: ['Any', 'plans', 'for', 'the', 'weekend?', 'on', 'do'], answer: ['Any', 'plans', 'for', 'the', 'weekend?'] },
          { vi: 'Mẹ mình năm nào cũng đi Sa Pa.', chips: ['My', 'mum', 'goes', 'to', 'Sa Pa', 'every', 'year.', 'go', 'all'], answer: ['My', 'mum', 'goes', 'to', 'Sa Pa', 'every', 'year.'] },
          { vi: 'Thứ Bảy mình thường ngủ nướng.', chips: ['I', 'usually', 'sleep', 'in', 'on', 'Saturdays.', 'sleeps', 'at'], answer: ['I', 'usually', 'sleep', 'in', 'on', 'Saturdays.'] },
          { vi: 'Ở đó rẻ nên nhiều sinh viên tới.', chips: ["It's", 'cheap,', 'so', 'lots', 'of', 'students', 'go', 'there.', 'but', 'goes'], answer: ["It's", 'cheap,', 'so', 'lots', 'of', 'students', 'go', 'there.'] },
          { vi: '(Ôn N2) Xin lỗi, bạn nói "damp" ạ?', chips: ['Sorry,', 'did', 'you', 'say', '"damp"?', 'does', 'speak'], answer: ['Sorry,', 'did', 'you', 'say', '"damp"?'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Chọn **một sở thích thật** của bạn. Nói to 4 câu theo công thức: trả lời · kể thêm (bao lâu một lần, ở đâu, với ai) · vì sao thích · hỏi lại.',
          'Nói thêm 2 câu về thời tiết hôm nay ở chỗ bạn (**It\'s so…** · **It usually…**). Ghi âm, nghe lại xem có đủ đuôi **-s** chưa.',
          'Ngày 4: vào quán cà phê và nhà hàng — gọi món, báo dị ứng, xin hoá đơn, và lần đầu biết "entrée" ở Úc với ở Mỹ khác nhau thế nào.',
        ],
      },
    ],
  },
];
