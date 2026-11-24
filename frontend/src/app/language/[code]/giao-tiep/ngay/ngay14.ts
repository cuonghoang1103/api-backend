/**
 * Tiếng Anh giao tiếp — NGÀY 14 (chặng 3 "Công sở, không kỹ thuật", B1): small talk ở công ty.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd14-`.
 * Ngữ pháp trong câu: câu hỏi đuôi (…, isn't it? / …, do you?) + cách trả lời câu đuôi phủ định · Have you ever + V3…?
 * · nối câu bằng `actually` và `especially`.
 * Cảnh: Diệp — sinh viên IT năm 3, tháng thứ hai thực tập QA ở Larkspur Software (Hà Nội, khách Mỹ và Nhật).
 * Khác Ngày 3 (thời tiết, cuối tuần, đổi chủ đề — trong thang máy, chiều thứ Sáu, chuyện bóng đá): hôm nay là small talk
 * CÔNG SỞ — bữa trưa nhiều nước, pantry khi có người nói xấu sếp, đi cùng khách Mỹ ra thang máy sau buổi họp — và
 * ranh giới chủ đề an toàn / nên tránh (lương, giá tiền, chính trị, tôn giáo, nói xấu đồng nghiệp, chuyện riêng).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_14: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd14-nghe',
    kind: 'listening',
    title: 'Small talk công sở: giờ ăn trưa, pantry, sau họp',
    goal: 'Nghe hiểu ba cuộc nói chuyện phiếm ở công ty: nhận ra câu đuôi đang hỏi thật hay chỉ mở chuyện, và thấy người bản xứ né một chủ đề khó như thế nào.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Diệp**, sinh viên IT năm 3, đang ở **tháng thứ hai** thực tập kiểm thử (QA) ở **Larkspur Software**, Hà Nội. Công ty làm dự án cho khách Mỹ và Nhật.',
          'Ngày 3 bạn đã học small talk chung: thời tiết, cuối tuần, giữ chuyện. Hôm nay là small talk **trong công ty**: ăn trưa với đồng nghiệp Philippines và Ấn Độ, đứng pha trà với một anh người Ireland, rồi tiễn **khách Mỹ** ra thang máy.',
          'Mỗi cảnh có **một chủ đề nên né**: hỏi lương, nói xấu người khác, hỏi giá tiền. Nghe xem người ta né khéo bằng câu gì.',
          'Bạn sẽ nghe rất nhiều **câu hỏi đuôi**: "…, isn\'t it?", "…, do you?". Có câu hỏi thật, có câu chỉ để mở chuyện.',
          'Tốc độ khoảng **145–150 từ/phút**. Có tiếng cười, có người nói chen. Nghe lần 1 chỉ bắt: **ai hỏi gì, ai né gì**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Căng tin: "You don\'t eat spicy food, do you?"' },
      {
        t: 'canh',
        anh: ['fork-and-knife-with-plate', 'curry-rice', 'hot-pepper', 'woman-technologist', 'man-office-worker'],
        caption: '12 giờ 10, căng tin tầng 2. **Diệp** xếp hàng lấy cơm cùng **Paolo** (BA người Philippines) và **Meera** (lập trình viên người Ấn, mới chuyển từ Bangalore sang). Paolo đứng ở quầy tương ớt.',
      },
      {
        t: 'listen',
        id: 'gtd14-nghe-canh1',
        title: 'Scene 1 — The lunch queue',
        note: 'Nghe xem: Diệp trả lời sai câu đuôi nào và chuyện gì xảy ra, Meera từng tới đâu, và Meera né câu hỏi nào.',
        lines: [
          { who: 'Paolo', voice: 'us-nam', text: "This queue's getting longer every day, isn't it?", vi: 'Hàng này mỗi ngày một dài ra, nhỉ?' },
          { who: 'Meera', voice: 'uk-nu', text: 'It really is. I think the whole building eats here now.', vi: 'Đúng thật. Chắc cả toà nhà giờ ăn ở đây.' },
          { who: 'Paolo', voice: 'us-nam', text: "Diệp, you don't eat spicy food, do you?", vi: 'Diệp, em không ăn cay, đúng không?' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Yes.', vi: '(Diệp định nói: "Vâng, em không ăn cay.")' },
          { who: 'Paolo', voice: 'us-nam', text: 'Great! Here you go, extra chilli.', vi: 'Tuyệt! Của em đây, thêm ớt nhé.' },
          { who: 'Diệp', voice: 'ca-nu', text: "Oh no, wait! I mean, no, I don't. Sorry!", vi: 'Ôi không, khoan! Ý em là không, em không ăn cay. Em xin lỗi!' },
          { who: 'Paolo', voice: 'us-nam', text: "Ha! Okay, no chilli for you. Don't worry, that one confuses everybody.", vi: 'Ha! Rồi, không ớt cho em. Đừng lo, câu kiểu này ai cũng nhầm.' },
          { who: 'Meera', voice: 'uk-nu', text: "Have you ever tried the curry here, Diệp? It's actually not bad.", vi: 'Em đã bao giờ ăn thử món cà ri ở đây chưa, Diệp? Thật ra cũng không tệ đâu.' },
          { who: 'Diệp', voice: 'ca-nu', text: "No, never. Is it like Indian curry?", vi: 'Chưa bao giờ ạ. Nó có giống cà ri Ấn không chị?' },
          { who: 'Meera', voice: 'uk-nu', text: "Not really. It's sweeter, with coconut milk. Have you ever been to India?", vi: 'Không hẳn. Nó ngọt hơn, có nước cốt dừa. Em đã bao giờ đi Ấn Độ chưa?' },
          { who: 'Diệp', voice: 'ca-nu', text: "Not yet, but I'd love to. Have you ever been to Huế? The food there is really spicy.", vi: 'Chưa ạ, nhưng em rất muốn đi. Chị đã bao giờ tới Huế chưa? Đồ ăn ở đó cay lắm.' },
          { who: 'Meera', voice: 'uk-nu', text: 'Yes, once, in March. I loved it, especially the bún bò.', vi: 'Rồi, một lần, hồi tháng Ba. Chị mê lắm, nhất là bún bò.' },
          { who: 'Paolo', voice: 'us-nam', text: "Meera, can I ask you something? How much did your old company in Bangalore pay you? I'm thinking of applying there.", vi: 'Meera, anh hỏi cái này nhé? Công ty cũ ở Bangalore trả em bao nhiêu? Anh đang tính nộp đơn vào đó.' },
          { who: 'Meera', voice: 'uk-nu', text: "Ha, nice try! Let's just say it paid the rent. Anyway, Diệp, you went to Ninh Bình last weekend, didn't you?", vi: 'Ha, khéo hỏi nhỉ! Cứ cho là đủ trả tiền nhà đi. Mà này Diệp, cuối tuần trước em đi Ninh Bình, phải không?' },
          { who: 'Diệp', voice: 'ca-nu', text: "Yes, I did! We went by boat through the caves. It was beautiful, especially in the morning.", vi: 'Vâng ạ! Bọn em đi thuyền qua mấy hang động. Đẹp lắm, nhất là buổi sáng.' },
          { who: 'Paolo', voice: 'us-nam', text: 'Okay, okay, I get it. No salary questions at lunch. Show us some photos, then!', vi: 'Rồi, rồi, anh hiểu rồi. Không hỏi lương lúc ăn trưa. Thế cho xem ảnh đi!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd14-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Paolo hỏi "You don\'t eat spicy food, do you?". Diệp đáp "Yes". Paolo hiểu là gì?',
            options: ['Diệp không ăn cay', 'Diệp ăn cay', 'Diệp chưa nghe rõ', 'Diệp muốn ít ớt'],
            correct: 1,
            why: 'Trong tiếng Anh, **Yes = tôi CÓ ăn cay**, **No = tôi KHÔNG ăn cay**, bất kể câu hỏi phủ định. Diệp nói "Yes" theo kiểu Việt ("vâng, đúng thế") nên Paolo thêm ớt.',
          },
          {
            q: 'Món cà ri ở căng tin khác cà ri Ấn thế nào?',
            options: ['Cay hơn', 'Ngọt hơn, có nước cốt dừa', 'Không có thịt', 'Meera không nói'],
            correct: 1,
            why: '"It\'s **sweeter, with coconut milk**."',
          },
          {
            q: 'Meera đã từng tới Huế chưa?',
            options: ['Chưa bao giờ', 'Rồi, một lần hồi tháng Ba', 'Rồi, nhiều lần', 'Sắp đi'],
            correct: 1,
            why: '"Yes, **once, in March**." Trả lời "Have you ever…?" xong thì thêm **khi nào** bằng quá khứ đơn.',
          },
          {
            q: 'Meera trả lời câu hỏi về lương thế nào?',
            options: ['Nói con số thật', 'Né bằng một câu đùa rồi đổi chủ đề', 'Giận và bỏ đi', 'Bảo Paolo hỏi phòng nhân sự'],
            correct: 1,
            why: '"Ha, nice try! **Let\'s just say** it paid the rent. **Anyway**, Diệp…" Đùa nhẹ + câu trả lời mơ hồ + "Anyway" để chuyển chủ đề.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Pantry: "Between you and me…"' },
      {
        t: 'canh',
        anh: ['teapot', 'hot-beverage', 'man-technologist', 'zipper-mouth-face', 'woman-technologist'],
        caption: '3 giờ 30 chiều. Máy pha cà phê lại hỏng. Diệp đứng chờ nước sôi cùng **Brendan**, lập trình viên người Ireland. Sáng nay cả nhóm vừa có một cuộc gọi căng thẳng với khách.',
      },
      {
        t: 'listen',
        id: 'gtd14-nghe-canh2',
        title: 'Scene 2 — Waiting for the kettle',
        note: 'Nghe xem Brendan muốn Diệp đồng ý với điều gì, Diệp né thế nào, và Brendan thấy khách Mỹ và khách Nhật khác nhau ở điểm nào.',
        lines: [
          { who: 'Brendan', voice: 'ie-nam', text: "The coffee machine's broken again, isn't it?", vi: 'Máy pha cà phê lại hỏng rồi, phải không?' },
          { who: 'Diệp', voice: 'ca-nu', text: "Yes, it is. There's a note on it. The kettle still works, though.", vi: 'Vâng, hỏng rồi ạ. Có tờ giấy dán trên đó. Nhưng ấm đun nước vẫn dùng được.' },
          { who: 'Brendan', voice: 'ie-nam', text: "Grand, tea it is. You're more of a tea person, aren't you?", vi: 'Ổn, vậy uống trà. Em là người thích trà hơn, đúng không?' },
          { who: 'Diệp', voice: 'ca-nu', text: "No, I'm not, actually. I'm a coffee person. Today I have no choice!", vi: 'Thật ra là không ạ. Em mê cà phê hơn. Hôm nay hết đường chọn thôi!' },
          { who: 'Brendan', voice: 'ie-nam', text: 'Ha, fair enough. So, that client call this morning. Between you and me, Thắng made a bit of a mess of it, didn\'t he?', vi: 'Ha, cũng phải. Mà cái cuộc gọi với khách sáng nay. Nói riêng thôi nhé, Thắng làm hơi rối, nhỉ?' },
          { who: 'Diệp', voice: 'ca-nu', text: "Hmm, I'm not sure. I'm still new, so I'm still learning how everything works.", vi: 'Hừm, em cũng không chắc. Em còn mới, vẫn đang học xem mọi thứ chạy thế nào.' },
          { who: 'Brendan', voice: 'ie-nam', text: 'Very diplomatic! You\'ll go far.', vi: 'Khéo ghê! Em sẽ tiến xa đấy.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Ha. Have you ever worked with Japanese clients before this job?', vi: 'Ha. Trước công việc này anh đã từng làm với khách Nhật chưa?' },
          { who: 'Brendan', voice: 'ie-nam', text: 'Never. Back in Dublin, all my clients were American.', vi: 'Chưa bao giờ. Hồi ở Dublin, khách của anh toàn người Mỹ.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Is it very different?', vi: 'Có khác nhiều không anh?' },
          { who: 'Brendan', voice: 'ie-nam', text: "Totally. American clients say \"Awesome!\" every five minutes. Japanese clients are quieter, so you have to ask more questions to know what they think.", vi: 'Khác hẳn. Khách Mỹ cứ năm phút lại "Tuyệt vời!". Khách Nhật trầm hơn, nên mình phải hỏi nhiều hơn mới biết họ nghĩ gì.' },
          { who: 'Diệp', voice: 'ca-nu', text: "That's really useful to know. Oh, the kettle's done.", vi: 'Biết vậy có ích lắm ạ. Ồ, nước sôi rồi.' },
          { who: 'Brendan', voice: 'ie-nam', text: "Lovely. Right, I'd better get back to it. Good chat, Diệp.", vi: 'Tốt quá. Thôi, anh phải quay lại làm việc đây. Nói chuyện vui lắm, Diệp.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Yeah, good chat. See you later, Brendan!', vi: 'Vâng, vui ạ. Lát gặp anh nhé, anh Brendan!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd14-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Brendan hỏi "You\'re more of a tea person, aren\'t you?". Diệp có thích trà hơn không?',
            options: ['Có', 'Không, Diệp thích cà phê hơn', 'Diệp không uống cả hai', 'Không rõ'],
            correct: 1,
            why: '"**No, I\'m not**, actually. I\'m a coffee person." Lần này Diệp trả lời đúng: No + câu đầy đủ, khỏi bị hiểu nhầm.',
          },
          {
            q: '"Between you and me, Thắng made a bit of a mess of it, didn\'t he?" Brendan đang làm gì?',
            options: ['Hỏi thông tin về cuộc gọi', 'Rủ Diệp cùng nói xấu một đồng nghiệp', 'Khen Thắng', 'Giao việc cho Diệp'],
            correct: 1,
            why: '"**Between you and me**" = chuyện riêng giữa hai ta. Câu đuôi "didn\'t he?" xuống giọng = mong Diệp **đồng ý**. Đây là lời mời buôn chuyện.',
          },
          {
            q: 'Diệp né thế nào?',
            options: ['Đồng ý cho xong', 'Nói mình còn mới, chưa đủ để nhận xét, rồi hỏi sang chuyện khác', 'Báo lại với Thắng', 'Im lặng bỏ đi'],
            correct: 1,
            why: '"I\'m not sure. **I\'m still new**…" rồi đổi chủ đề bằng một câu "**Have you ever…?**". Brendan khen: "Very diplomatic!" (khéo léo).',
          },
          {
            q: 'Theo Brendan, làm việc với khách Nhật khác khách Mỹ ở đâu?',
            options: ['Khách Nhật khen nhiều hơn', 'Khách Nhật ít nói hơn, phải hỏi nhiều mới biết họ nghĩ gì', 'Khách Nhật không thích gọi điện', 'Không khác gì'],
            correct: 1,
            why: '"Japanese clients are **quieter**, so you have to **ask more questions** to know what they think." Đây là nhận xét của riêng Brendan, không phải ai cũng vậy.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Sau buổi họp: tiễn khách Mỹ ra thang máy' },
      {
        t: 'canh',
        anh: ['woman-office-worker', 'elevator', 'hot-beverage', 'cityscape', 'airplane'],
        caption: '5 giờ chiều. Buổi họp ba tiếng với **Debbie**, quản lý dự án bên khách, sang từ Chicago, vừa kết thúc. Trưởng nhóm nhờ Diệp tiễn Debbie xuống sảnh. Hai người đi bộ ra thang máy.',
      },
      {
        t: 'listen',
        id: 'gtd14-nghe-canh3',
        title: 'Scene 3 — Walking a client to the lift',
        note: 'Nghe xem Diệp giới thiệu món gì, Diệp lỡ hỏi câu gì không nên hỏi, và Debbie thoát câu hỏi đó ra sao.',
        lines: [
          { who: 'Debbie', voice: 'us-nu', text: "Well, that was a long one, wasn't it?", vi: 'Chà, buổi họp dài thật, nhỉ?' },
          { who: 'Diệp', voice: 'ca-nu', text: "It was! Three hours. You must be tired after your flight.", vi: 'Dài thật ạ! Ba tiếng liền. Chắc chị mệt lắm sau chuyến bay.' },
          { who: 'Debbie', voice: 'us-nu', text: "A little. Jet lag is the worst. It's my first time in Asia, believe it or not.", vi: 'Hơi hơi. Lệch múi giờ là khổ nhất. Đây là lần đầu chị tới châu Á, tin được không.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Really? So how are you finding Hà Nội so far?', vi: 'Thật ạ? Thế chị thấy Hà Nội thế nào?' },
          { who: 'Debbie', voice: 'us-nu', text: "I love it. The traffic is wild, though. I've crossed the street exactly once!", vi: 'Chị thích lắm. Mỗi tội giao thông loạn quá. Chị mới băng qua đường đúng một lần!' },
          { who: 'Diệp', voice: 'ca-nu', text: "Ha! Have you tried egg coffee yet? It's a Hà Nội thing.", vi: 'Ha! Chị đã thử cà phê trứng chưa? Món đặc trưng Hà Nội đấy ạ.' },
          { who: 'Debbie', voice: 'us-nu', text: "Egg coffee? No, I haven't. Is there really egg in it?", vi: 'Cà phê trứng á? Chưa, chị chưa thử. Có trứng thật trong đó à?' },
          { who: 'Diệp', voice: 'ca-nu', text: "Yes, egg yolk whipped with sugar, on top of strong coffee. It sounds strange, but it's delicious.", vi: 'Vâng, lòng đỏ trứng đánh với đường, phủ lên trên cà phê đặc. Nghe lạ nhưng ngon lắm ạ.' },
          { who: 'Debbie', voice: 'us-nu', text: 'Okay, now I have to try it.', vi: 'Được rồi, giờ thì chị phải thử mới được.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'Which hotel are you staying at? How much is it per night?', vi: 'Chị ở khách sạn nào ạ? Mỗi đêm bao nhiêu tiền ạ?' },
          { who: 'Debbie', voice: 'us-nu', text: "Oh, the one by the lake. Honestly, the company booked it, so I have no idea!", vi: 'À, cái cạnh hồ. Thật tình là công ty đặt, nên chị cũng chẳng biết nữa!' },
          { who: 'Diệp', voice: 'ca-nu', text: "Of course. Well, there's a great egg coffee place just behind the lake. I'll send you the address.", vi: 'Dạ vâng. À, có một quán cà phê trứng ngon lắm ngay sau hồ. Em gửi chị địa chỉ nhé.' },
          { who: 'Debbie', voice: 'us-nu', text: 'Perfect, thank you. Have you ever been to the States, Diệp?', vi: 'Tuyệt, cảm ơn em. Em đã bao giờ tới Mỹ chưa, Diệp?' },
          { who: 'Diệp', voice: 'ca-nu', text: "No, never. But I've always wanted to see Chicago, actually. Is it really that windy?", vi: 'Chưa bao giờ ạ. Nhưng thật ra em luôn muốn tới Chicago. Ở đó gió dữ vậy thật ạ?' },
          { who: 'Debbie', voice: 'us-nu', text: "Ha! In winter, yes. Come in summer. Oh, here's the elevator. It was great to finally meet you in person, Diệp.", vi: 'Ha! Mùa đông thì có. Em đi mùa hè ấy. Ồ, thang máy đây rồi. Cuối cùng cũng được gặp em ngoài đời, vui lắm, Diệp.' },
          { who: 'Diệp', voice: 'ca-nu', text: 'You too, Debbie. Enjoy the egg coffee!', vi: 'Em cũng vậy ạ, chị Debbie. Chị thưởng thức cà phê trứng ngon nhé!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd14-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: '"Well, that was a long one, wasn\'t it?" Debbie có đang hỏi thật không?',
            options: ['Có, Debbie muốn biết buổi họp dài bao lâu', 'Không, đó là câu mở chuyện, chờ Diệp đồng ý rồi nói thêm', 'Debbie đang phàn nàn với Diệp', 'Debbie hỏi giờ'],
            correct: 1,
            why: 'Câu đuôi **xuống giọng** về điều cả hai đều biết = mở chuyện. Diệp đáp đúng kiểu: đồng ý ("It was!") + thêm một ý ("You must be tired…").',
          },
          {
            q: 'Câu nào của Diệp là câu không nên hỏi?',
            options: ['How are you finding Hà Nội?', 'Have you tried egg coffee yet?', 'How much is it per night?', 'Is it really that windy?'],
            correct: 2,
            why: 'Hỏi **giá tiền** khách sạn của khách là chuyện tiền bạc riêng. Debbie né: "**Honestly, the company booked it, so I have no idea!**"',
          },
          {
            q: 'Diệp gỡ lại tình huống thế nào?',
            options: ['Xin lỗi rất dài', 'Hỏi lại lần nữa', 'Chuyển ngay sang chuyện quán cà phê trứng gần hồ', 'Im lặng'],
            correct: 2,
            why: '"Of course. Well, there\'s a great egg coffee place just behind the lake." Không cần xin lỗi, chỉ cần **chuyển chủ đề mượt**.',
          },
          {
            q: 'Diệp đã từng tới Mỹ chưa?',
            options: ['Rồi, một lần', 'Chưa bao giờ, nhưng muốn tới Chicago', 'Rồi, ở Chicago', 'Sắp đi tháng sau'],
            correct: 1,
            why: '"**No, never.** But I\'ve always wanted to see Chicago, actually."',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Câu đuôi nói rất nhanh và dính vào câu chính: "isn\'t it" nghe như "i-zn-nit", "didn\'t he" nghe như "đi-đn-ni". Gõ lại **cả câu**, có dấu phẩy trước câu đuôi càng tốt (không tính điểm).',
      },
      {
        t: 'dictation',
        id: 'gtd14-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — câu đuôi mở chuyện', spell: "This queue's getting longer every day, isn't it?", answer: "This queue's getting longer every day, isn't it?", alt: ["This queue is getting longer every day, isn't it?", 'This queue is getting longer every day, is it not?'] },
          { label: 'Câu 2 — câu đuôi phủ định', spell: "You don't eat spicy food, do you?", answer: "You don't eat spicy food, do you?", alt: ['You do not eat spicy food, do you?'] },
          { label: 'Câu 3 — trả lời đúng', spell: "I mean, no, I don't.", answer: "I mean, no, I don't.", alt: ['I mean no I do not.', "I mean no I don't"] },
          { label: 'Câu 4 — Have you ever', spell: 'Have you ever been to India?', answer: 'Have you ever been to India?' },
          { label: 'Câu 5 — né câu hỏi lương', spell: "Let's just say it paid the rent.", answer: "Let's just say it paid the rent.", alt: ['Let us just say it paid the rent.'] },
          { label: 'Câu 6 — rút khỏi cuộc nói chuyện', spell: "I'd better get back to it.", answer: "I'd better get back to it.", alt: ['I had better get back to it.'] },
          { label: 'Câu 7 — chào khách', spell: 'It was great to finally meet you in person.', answer: 'It was great to finally meet you in person.' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ["Long meeting, wasn't it?", 'Mở chuyện. Không cần thông tin, cần **đồng ý + thêm một ý**.', 'It was! I need a coffee now.'],
          ['Nice try!', 'Tôi biết bạn muốn hỏi gì, nhưng **tôi không trả lời đâu** (đùa nhẹ).', '(cười, đổi chủ đề)'],
          ["Let's just say…", 'Tôi chỉ nói **mơ hồ** thôi, đừng hỏi thêm.', 'Fair enough!'],
          ['Between you and me…', 'Sắp có chuyện riêng hoặc nói xấu ai đó. **Cẩn thận**.', "Hmm, I'm not sure. I'm still new."],
          ['Very diplomatic!', 'Bạn né khéo đấy (khen nửa đùa).', 'Ha, I try!'],
          ["Honestly, I have no idea!", 'Có khi là thật, có khi là cách **né lịch sự** câu hỏi về tiền.', '(đừng hỏi lại, chuyển chuyện)'],
          ["Right, I'd better get back to it.", 'Tôi muốn **kết thúc** cuộc nói chuyện, không phải vì bạn nói chán.', 'Sure. Good chat!'],
          ['Fair enough.', 'Ừ, hợp lý, tôi chấp nhận.', '(nói tiếp)'],
        ],
        caption: 'Ở công sở, small talk có hai việc: **làm thân** và **không làm ai khó xử**. Khi người kia đùa, mơ hồ, hay nói "Anyway…", đó là tín hiệu "đổi chủ đề đi".',
      },
      {
        t: 'note',
        title: 'Mẹo: bàn ăn đông người nói nhanh, bạn không theo kịp',
        items: [
          'Câu đuôi nói nhanh không nghe rõ phần đuôi? **Trả lời theo câu chính** là đủ: nghe "…spicy food…" + giọng hỏi ⇒ trả lời đúng ý mình bằng câu đầy đủ: "**I don\'t eat spicy food.**" Không ai bắt bẻ thiếu Yes / No.',
          'Cả bàn cười mà bạn không hiểu: đừng cười theo rồi gật. Hỏi nhẹ: "**Sorry, I missed that. What\'s the joke?**" Người ta thường vui vẻ kể lại.',
          'Lạc mạch hẳn: chờ một khoảng lặng, rồi hỏi người ngồi cạnh một câu riêng ("**Have you ever tried…?**"). Nói chuyện với 1 người dễ hơn theo 4 người.',
          'Đừng ngồi im cả bữa. Một câu hỏi Have you ever… mỗi bữa ăn là đủ để người ta nhớ bạn có mặt.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Câu đuôi thân mật', "…, isn't it? · …, innit? (London, rất bình dân)", '…, right?', '…, yeah? · …, eh?'],
          ['Hỏi "đã bao giờ chưa"', 'Have you ever been to…?', 'Have you ever…? · Did you ever…? (nói nhanh)', 'Have you ever been to…?'],
          ['Giờ nghỉ', 'lunch break · tea break', 'lunch break · coffee break', 'lunch · smoko (giải lao, thân mật)'],
          ['Cơm mang từ nhà', 'packed lunch', 'bag lunch · brown-bag lunch', 'packed lunch'],
          ['Khen', 'Not bad at all! (= rất tốt)', 'Awesome! · Great job!', 'Good on ya!'],
          ['Rút khỏi câu chuyện', "Right, I'd better get on.", 'Well, I should get back to work.', 'Righto, back to it.'],
        ],
        caption: 'Người Anh nói giảm (Not bad at all = rất tốt), người Mỹ nói tăng (Awesome!). Người Canada nổi tiếng với "…, eh?" ở cuối câu.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b1-02 · Crazy Weather, Isn\'t It?** — Duy bắt chuyện với một du khách Anh ở trạm xe buýt Hà Nội bằng câu đuôi, rồi tới câu hỏi "rất Việt Nam" về tuổi và hôn nhân. Cảnh khác hôm nay (người lạ ngoài phố, không phải đồng nghiệp).',
          '**en-ds-c1-01 · What They Say vs. What They Mean** — ẩn ý sau những câu lịch sự, nghe sau khi xong bảng "Họ nói vậy nghĩa là gì" ở trên.',
          'Nói chuyện với khách **trong** buổi họp (demo, hỏi đáp, chốt việc) ở khoá **Technical English at Work**.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd14-noi',
    kind: 'speaking',
    title: 'Chủ đề an toàn và chủ đề nên tránh',
    goal: 'Mở chuyện bằng câu đuôi, hỏi tiếp bằng Have you ever…?, trả lời đúng câu đuôi phủ định, và né khéo những chủ đề dễ làm đồng nghiệp hoặc khách khó xử.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** cho small talk công sở: mở chuyện, hỏi "đã bao giờ…", đáp lại, **né chủ đề khó**, rút khỏi cuộc nói chuyện.',
          '**Bản đồ chủ đề**: nói gì thoải mái, nói gì cẩn thận, gì nên tránh hẳn khi có đồng nghiệp và khách nước ngoài.',
          'Ngữ pháp: **câu hỏi đuôi** (…, isn\'t it? / …, do you?) và **Have you ever + V3?**. Cái bẫy lớn nhất: trả lời **Yes / No** câu đuôi phủ định.',
          'Ngôn ngữ cơ thể khi đứng nói chuyện ở pantry: góc đứng, điện thoại, cách rút lui; và vì sao người Nhật gật đầu chưa chắc là đồng ý.',
          'Cuối bài: nhập vai chờ lò vi sóng với một kỹ sư Nhật mới sang.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo một cuộc small talk: **mở chuyện → hỏi tiếp → đáp → né khi cần → kết thúc**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "Long meeting, wasn't it?", pos: 'phr', ipa: '/ˌlɔːŋ ˈmiːtɪŋ ˈwʌznt ɪt/', vi: 'Họp lâu thật, nhỉ?', ex: "Long meeting, wasn't it? I need some air.", exVi: 'Họp lâu thật, nhỉ? Mình cần ra ngoài hít thở.', more: 'Bỏ "That was" ở đầu khi nói nhanh: (That was a) long meeting, wasn\'t it?' },
          { w: "It's so busy in here today, isn't it?", pos: 'phr', ipa: '/ɪts ˈsoʊ ˈbɪzi ɪn hɪr təˈdeɪ ˈɪznt ɪt/', vi: 'Hôm nay ở đây đông ghê, nhỉ?', ex: "It's so busy in here today, isn't it? Is there a holiday tomorrow?", exVi: 'Hôm nay căng tin đông ghê nhỉ? Mai nghỉ lễ à?' },
          { w: "You're on the mobile team, aren't you?", pos: 'phr', ipa: '/jʊr ɑːn ðə ˈmoʊbl tiːm ˈɑːrnt ju/', vi: 'Bạn ở nhóm mobile, đúng không?', ex: "You're on the mobile team, aren't you? I think I've seen you at the demo.", exVi: 'Anh ở nhóm mobile phải không? Hình như em gặp anh ở buổi demo.', more: 'Câu đuôi **lên giọng** = hỏi thật vì chưa chắc.' },
          { w: "You don't eat spicy food, do you?", pos: 'phr', ipa: '/ju ˈdoʊnt iːt ˈspaɪsi fuːd ˈduː ju/', vi: 'Bạn không ăn cay, đúng không?', ex: "You don't eat spicy food, do you? — No, I don't.", exVi: 'Em không ăn cay đúng không? — Vâng, em không ăn.', more: 'Đáp theo **sự thật**: không ăn ⇒ **No, I don\'t.** Có ăn ⇒ **Yes, I do.**' },
          { w: 'Have you ever been to…?', pos: 'phr', ipa: '/həv ju ˈevər bɪn tə/', vi: 'Bạn đã bao giờ tới… chưa?', ex: 'Have you ever been to Huế?', exVi: 'Chị đã bao giờ tới Huế chưa?', more: '**been to** = đã tới rồi về. "gone to" = đã đi và chưa về.' },
          { w: 'Have you ever tried…?', pos: 'phr', ipa: '/həv ju ˈevər ˈtraɪd/', vi: 'Bạn đã bao giờ thử… chưa?', ex: 'Have you ever tried bún chả?', exVi: 'Chị đã bao giờ ăn thử bún chả chưa?' },
          { w: 'Have you tried … yet?', pos: 'phr', ipa: '/həv ju ˈtraɪd … jet/', vi: 'Bạn đã thử… chưa? (từ lúc tới đây)', ex: 'Have you tried egg coffee yet?', exVi: 'Chị đã thử cà phê trứng chưa?', more: '**yet** = trong khoảng thời gian gần đây (chuyến này). **ever** = cả đời.' },
          { w: 'Yes, once.', pos: 'phr', ipa: '/jes ˈwʌns/', vi: 'Rồi, một lần.', ex: 'Have you ever been to Japan? — Yes, once, two years ago.', exVi: 'Em đã bao giờ đi Nhật chưa? — Rồi ạ, một lần, hai năm trước.', more: 'once · twice · a few times · many times' },
          { w: 'No, never. · Not yet.', pos: 'phr', ipa: '/noʊ ˈnevər · ˌnɑːt ˈjet/', vi: 'Chưa bao giờ. · Chưa (nhưng sẽ).', ex: "Have you ever been to India? — Not yet, but I'd love to.", exVi: 'Em đã bao giờ đi Ấn Độ chưa? — Chưa ạ, nhưng em rất muốn.' },
          { w: "I've always wanted to…", pos: 'phr', ipa: '/aɪv ˈɔːlweɪz ˈwɑːntɪd tə/', vi: 'Mình luôn muốn…', ex: "I've always wanted to see Chicago.", exVi: 'Em luôn muốn tới Chicago.' },
          { w: 'How are you finding…?', pos: 'phr', ipa: '/haʊ ər ju ˈfaɪndɪŋ/', vi: 'Bạn thấy… thế nào? (trải nghiệm mới)', ex: 'How are you finding Hà Nội so far?', exVi: 'Chị thấy Hà Nội tới giờ thế nào?', more: 'Câu an toàn nhất để hỏi người **mới tới** thành phố, công ty, dự án.' },
          { w: 'You must be tired after your flight.', pos: 'phr', ipa: '/ju ˈmʌst bi ˈtaɪərd ˈæftər jər ˈflaɪt/', vi: 'Chắc bạn mệt sau chuyến bay.', ex: 'Welcome! You must be tired after your flight.', exVi: 'Chào mừng chị! Chắc chị mệt sau chuyến bay.' },
          { w: 'jet lag', pos: 'n', ipa: '/ˈdʒet læɡ/', vi: 'mệt vì lệch múi giờ', ex: "How's the jet lag?", exVi: 'Lệch múi giờ chị thấy sao rồi?', anh: 'airplane' },
          { w: 'especially', pos: 'adv', ipa: '/ɪˈspeʃəli/', vi: 'nhất là', ex: 'I loved it, especially the bún bò.', exVi: 'Chị mê lắm, nhất là bún bò.', more: 'Đừng đọc "ếch-pê-xi-a-li". Âm đầu là /ɪ/ nhẹ.' },
          { w: 'actually', pos: 'adv', ipa: '/ˈæktʃuəli/', vi: 'thật ra (sửa nhẹ, thêm thông tin bất ngờ)', ex: "No, I'm not, actually. I'm a coffee person.", exVi: 'Thật ra là không. Em thích cà phê hơn.' },
          { w: 'Nice try!', pos: 'phr', ipa: '/ˌnaɪs ˈtraɪ/', vi: 'Khéo hỏi nhỉ! (đùa, từ chối trả lời)', ex: 'How much do you earn? — Ha, nice try!', exVi: 'Lương anh bao nhiêu? — Ha, khéo hỏi nhỉ!' },
          { w: "Let's just say…", pos: 'phr', ipa: '/ˌlets ˈdʒʌst ˈseɪ/', vi: 'Cứ cho là… (trả lời mơ hồ)', ex: "Let's just say it paid the rent.", exVi: 'Cứ cho là đủ trả tiền nhà đi.' },
          { w: "I'd rather not say, if that's okay.", pos: 'phr', ipa: '/aɪd ˈræðər ˌnɑːt ˈseɪ ɪf ðæts oʊˈkeɪ/', vi: 'Mình xin phép không nói, được không.', ex: "Who did you vote for? — I'd rather not say, if that's okay.", exVi: 'Bạn bầu cho ai? — Mình xin phép không nói nhé.', more: 'Câu né **thẳng mà lịch sự**. Nói kèm nụ cười.' },
          { w: "I'm not sure. I'm still new.", pos: 'phr', ipa: '/aɪm ˌnɑːt ˈʃʊr aɪm stɪl ˈnuː/', vi: 'Em không chắc. Em còn mới.', ex: "Our manager's plan is terrible, isn't it? — I'm not sure. I'm still new.", exVi: 'Kế hoạch của sếp tệ quá nhỉ? — Em không chắc. Em còn mới.', more: 'Lá chắn tốt nhất của người mới khi bị rủ nói xấu ai đó.' },
          { w: 'Anyway, …', pos: 'phr', ipa: '/ˈeniweɪ/', vi: 'Mà này, … (đổi chủ đề)', ex: 'Anyway, you went to Ninh Bình, didn\'t you?', exVi: 'Mà này, em đi Ninh Bình đúng không?', more: 'Ngày 26 học kỹ các từ chuyển ý. Hôm nay chỉ cần một: **Anyway**.' },
          { w: 'Between you and me…', pos: 'phr', ipa: '/bɪˈtwiːn ju ən ˈmiː/', vi: 'Nói riêng thôi nhé…', ex: "Between you and me, I think the deadline is too tight.", exVi: 'Nói riêng thôi nhé, mình nghĩ hạn chót gấp quá.', more: 'Nghe câu này thì **nghe**, đừng thêm, đừng kể lại.' },
          { w: 'gossip', pos: 'n · v', ipa: '/ˈɡɑːsɪp/', vi: 'chuyện ngồi lê đôi mách; buôn chuyện', ex: "I try not to gossip about people at work.", exVi: 'Mình cố không buôn chuyện về người khác ở công ty.', anh: 'speaking-head' },
          { w: 'small talk', pos: 'n', ipa: '/ˈsmɔːl tɔːk/', vi: 'nói chuyện phiếm', ex: "I'm not great at small talk, but I'm learning.", exVi: 'Mình không giỏi nói chuyện phiếm, nhưng đang học.', anh: 'speech-balloon' },
          { w: 'pantry', pos: 'n', ipa: '/ˈpæntri/', vi: 'góc pha trà, cà phê ở công ty', ex: 'See you in the pantry at three?', exVi: 'Ba giờ gặp ở pantry nhé?', anh: 'teapot' },
          { w: 'packed lunch', pos: 'n', ipa: '/ˌpækt ˈlʌntʃ/', vi: 'cơm mang từ nhà', ex: 'I usually bring a packed lunch.', exVi: 'Mình hay mang cơm từ nhà.', anh: 'bento-box' },
          { w: "Fair enough.", pos: 'phr', ipa: '/ˌfer ɪˈnʌf/', vi: 'Cũng phải. / Hợp lý.', ex: "I'd rather not say. — Fair enough.", exVi: 'Mình xin không nói. — Ừ, cũng phải.' },
          { w: "Right, I'd better get back to it.", pos: 'phr', ipa: '/ˈraɪt aɪd ˈbetər ɡet ˈbæk tu ɪt/', vi: 'Thôi, mình phải quay lại làm việc đây.', ex: "Right, I'd better get back to it. Good chat!", exVi: 'Thôi, mình quay lại làm việc đây. Nói chuyện vui lắm!' },
          { w: 'Good chat!', pos: 'phr', ipa: '/ˌɡʊd ˈtʃæt/', vi: 'Nói chuyện vui lắm!', ex: 'Good chat, Brendan. See you later!', exVi: 'Nói chuyện vui lắm, anh Brendan. Lát gặp nhé!' },
        ],
      },

      { t: 'h', text: '2. Bản đồ chủ đề: nói thoải mái, cẩn thận, hay tránh hẳn' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Ở công ty có đồng nghiệp và khách nước ngoài',
        caption: 'Đây là quy tắc **với người chưa thân**. Bạn thân lâu năm thì nói gì cũng được. Không chắc thì chọn cột trái.',
        cols: [
          {
            title: 'An toàn ✅',
            anh: 'thumbs-up',
            items: ['Đồ ăn, quán ngon, món lạ', 'Du lịch, nơi đã tới / muốn tới', 'Thành phố, giao thông, thời tiết (Ngày 3)', 'Phim, nhạc, thể thao, sở thích', 'Cuối tuần, kỳ nghỉ', 'Cảm nhận về công việc mới (nói tích cực)'],
          },
          {
            title: 'Cẩn thận ⚠️',
            anh: 'face-with-raised-eyebrow',
            items: ['Gia đình, con cái (để họ tự kể)', 'Quê hương, tình hình đất nước họ', 'Ăn kiêng, đồ uống có cồn', 'Công việc của khách (nghe nhiều, nhận xét ít)', 'Câu đùa về quốc gia, giọng nói'],
          },
          {
            title: 'Nên tránh ⛔',
            anh: 'zipper-mouth-face',
            items: ['Lương, giá nhà, giá đồ của người khác', 'Chính trị, bầu cử', 'Tôn giáo', 'Tuổi, cân nặng, ngoại hình', 'Chuyện kết hôn, sinh con', 'Nói xấu đồng nghiệp, sếp, khách'],
          },
        ],
      },
      {
        t: 'table',
        head: ['Chủ đề khó', 'Vì sao', 'Nếu bị hỏi, bạn nói', 'Nếu lỡ hỏi, gỡ bằng'],
        rows: [
          ['Lương, giá tiền', 'Ở Anh – Mỹ – Úc tiền là chuyện riêng. Hỏi lương ở chỗ đông người làm cả hai ngượng.', "Ha, nice try! · Let's just say it's enough.", 'Oh, sorry, none of my business! Anyway, …'],
          ['Chính trị', 'Đồng nghiệp từ nhiều nước, quan điểm khác nhau. Một câu sai làm hỏng quan hệ lâu dài.', "I'd rather not talk politics at work, if that's okay.", 'Actually, let\'s talk about something else. …'],
          ['Tôn giáo', 'Riêng tư. Có ảnh hưởng tới đồ ăn (không ăn bò, ăn chay, halal), hỏi chuyện đồ ăn thì được, hỏi niềm tin thì không.', '(trả lời ngắn nếu muốn, hoặc đổi chủ đề)', 'Do you have any dietary requirements? (hỏi về đồ ăn, không hỏi về đạo)'],
          ['Nói xấu người khác', 'Chuyện truyền đi rất nhanh. Người mới mà buôn chuyện thì mất lòng tin.', "I'm not sure. I'm still new.", "Sorry, that wasn't fair of me."],
          ['Tuổi, cân nặng, kết hôn', 'Ở Việt Nam là quan tâm, với nhiều người nước ngoài là quá riêng tư (Ngày 1 và Ngày 3 đã nhắc).', "Ha, old enough! · That's a long story.", 'Sorry, too personal! …'],
        ],
        caption: 'Cột cuối quan trọng nhất: **lỡ hỏi thì gỡ bằng một câu ngắn rồi đổi chủ đề**. Xin lỗi dài dòng chỉ làm không khí ngượng thêm.',
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn cùng nhóm)', 'Trung tính (đồng nghiệp)', 'Trang trọng (khách, sếp lớn)'],
        rows: [
          ['Mở chuyện sau họp', "Phew, long one, huh?", "Long meeting, wasn't it?", "That was a productive meeting, wasn't it?"],
          ['Hỏi đã từng chưa', 'Ever tried egg coffee?', 'Have you ever tried egg coffee?', 'Have you had a chance to try egg coffee?'],
          ['Hỏi cảm nhận', 'Liking Hà Nội so far?', 'How are you finding Hà Nội?', 'I hope you are enjoying your stay in Hà Nội.'],
          ['Né câu hỏi', 'Ha, nice try!', "Let's just say…", "I'd rather not say, if you don't mind."],
          ['Đổi chủ đề', 'Anyway! …', 'Anyway, …', 'By the way, may I ask…?'],
          ['Kết thúc', 'Back to work! Catch you later.', "Right, I'd better get back to it.", 'I will let you go. Have a wonderful evening.'],
        ],
        caption: '"Ever tried…?" và "Liking… so far?" là câu bỏ trợ động từ khi nói nhanh và thân. Nghe hiểu là đủ.',
      },
      {
        t: 'note',
        title: 'Mẹo: small talk với khách Nhật và khách Mỹ',
        items: [
          '**Khách Mỹ** thường mở chuyện trước, nói nhiều, khen nhiều. Bạn chỉ cần đáp nhiệt tình và hỏi lại một câu.',
          '**Khách Nhật** thường chờ bạn mở lời, nhất là khi bạn là chủ nhà. Hỏi câu dễ trả lời ngắn: "How is the weather in Osaka now?", "Have you tried phở yet?". Im lặng vài giây **không** phải là khó chịu.',
          'Với cả hai: không hỏi giá khách sạn, không hỏi lương, không hỏi khách "dự án này bên anh trả bao nhiêu". Chuyện tiền của dự án là việc của sếp bạn.',
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Câu hỏi đuôi = **một câu kể + một cái đuôi ngắn ngược chiều**. Câu kể khẳng định thì đuôi phủ định, câu kể phủ định thì đuôi khẳng định. Đuôi lấy **trợ động từ** của câu chính (be, do, did, have, can…) và **đại từ** của chủ ngữ.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + am / is / are … , + isn\'t / aren\'t + S?',
            vi: 'Câu có be: đuôi lặp lại be, đổi dấu.',
            examples: [
              { en: "It's really busy today, isn't it?", vi: 'Hôm nay đông thật, nhỉ?' },
              { en: "You're on the mobile team, aren't you?", vi: 'Bạn ở nhóm mobile, đúng không?' },
              { en: "That was a long meeting, wasn't it?", vi: 'Buổi họp dài thật, nhỉ?' },
            ],
          },
          {
            formula: "S + don't / doesn't + V … , + do / does + S?",
            vi: 'Câu phủ định với động từ thường: đuôi là do / does khẳng định.',
            examples: [
              { en: "You don't eat spicy food, do you?", vi: 'Bạn không ăn cay, đúng không?' },
              { en: "Meera doesn't drink coffee, does she?", vi: 'Meera không uống cà phê, phải không?' },
              { en: "They don't work on Saturdays, do they?", vi: 'Họ không làm thứ Bảy, nhỉ?' },
            ],
          },
          {
            formula: "S + V-ed … , + didn't + S?",
            vi: 'Câu quá khứ khẳng định: đuôi là didn\'t.',
            examples: [
              { en: "You went to Ninh Bình, didn't you?", vi: 'Em đi Ninh Bình rồi, phải không?' },
              { en: "The client liked the demo, didn't they?", vi: 'Khách thích buổi demo, nhỉ?' },
              { en: "Debbie flew in yesterday, didn't she?", vi: 'Debbie bay tới hôm qua, đúng không?' },
            ],
          },
          {
            formula: 'Have you ever + V3 … ?',
            vi: 'Hỏi trải nghiệm trong cả cuộc đời tới bây giờ. Không nói thời điểm.',
            examples: [
              { en: 'Have you ever been to India?', vi: 'Bạn đã bao giờ tới Ấn Độ chưa?' },
              { en: 'Have you ever tried bún bò?', vi: 'Bạn đã bao giờ ăn bún bò chưa?' },
              { en: 'Have you ever worked with Japanese clients?', vi: 'Bạn đã bao giờ làm với khách Nhật chưa?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu chính có…', 'Đuôi', 'Ví dụ'],
        rows: [
          ['is / are (khẳng định)', "isn't / aren't", "It's hot, **isn't it**?"],
          ['was / were', "wasn't / weren't", "They were late, **weren't they**?"],
          ['V(s/es) hiện tại đơn', "don't / doesn't", "She speaks Japanese, **doesn't she**?"],
          ['V-ed quá khứ đơn', "didn't", "You met Okada-san, **didn't you**?"],
          ['have / has + V3', "haven't / hasn't", "You've been to Huế, **haven't you**?"],
          ['can / will', "can't / won't", "You can come, **can't you**? · He'll be there, **won't he**?"],
          ["I'm", "aren't I (ngoại lệ)", "I'm on the list, **aren't I**?"],
        ],
        caption: 'Đuôi dùng **đại từ**, không lặp tên: "Meera likes curry, doesn\'t **she**?", không nói "doesn\'t Meera?". "This / That" ⇒ đuôi **it**.',
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Lên giọng hay xuống giọng ở cái đuôi?',
        caption: 'Cùng một câu, khác ngữ điệu là khác mục đích. Phần phát âm bên dưới luyện cả hai.',
        cols: [
          { title: '↘ Xuống giọng = mở chuyện, mong đồng ý', anh: 'slightly-smiling-face', items: ["Long meeting, wasn't it? ↘", 'Người nói **đã biết**. Họ chờ bạn đồng ý + thêm một ý.', "Đáp: It was! I'm starving now."] },
          { title: '↗ Lên giọng = hỏi thật, chưa chắc', anh: 'red-question-mark', items: ["You're on the mobile team, aren't you? ↗", 'Người nói **chưa chắc**. Họ cần Yes / No thật.', "Đáp: No, I'm on the QA team, actually."] },
        ],
      },
      {
        t: 'table',
        head: ['Câu hỏi', 'Sự thật', 'Trả lời ĐÚNG', 'Kiểu Việt (sai)'],
        rows: [
          ["You don't eat spicy food, do you?", 'Bạn không ăn cay', "**No, I don't.**", '~~Yes.~~ (vâng, không ăn)'],
          ["You don't eat spicy food, do you?", 'Bạn có ăn cay', "**Yes, I do!** I love it.", '~~No.~~ (không, có ăn)'],
          ["You haven't been to Japan, have you?", 'Bạn chưa đi', "**No, I haven't.**", '~~Yes.~~'],
          ["You're not from Hanoi, are you?", 'Bạn là người Hà Nội', "**Yes, I am**, actually!", '~~No.~~ (không, em người Hà Nội)'],
        ],
        caption: 'Quy tắc vàng: tiếng Anh **Yes đi với câu khẳng định, No đi với câu phủ định**, theo sự thật, không theo câu hỏi. Luôn nói thêm **trợ động từ** (No, I don\'t) hoặc cả câu cho chắc.',
      },
      {
        t: 'rule',
        formula: "Câu kể (+) , đuôi (−)? · Câu kể (−) , đuôi (+)? · Have you ever + V3? → Yes, once / No, never",
        vi: 'Đuôi = trợ động từ + đại từ, ngược dấu. Trả lời theo sự thật: có ⇒ Yes, I do; không ⇒ No, I don\'t. Have you ever hỏi trải nghiệm; muốn kể thêm khi nào thì chuyển sang quá khứ đơn.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: actually · especially',
        items: [
          '**actually** = "thật ra". Dùng khi **sửa nhẹ** điều người kia đoán sai: "You\'re a tea person, aren\'t you? — No, I\'m a coffee person, **actually**." Có actually thì lời sửa nghe mềm, không cãi.',
          '**actually** còn mở một thông tin **bất ngờ**: "It\'s **actually** not bad." (Tưởng tệ, hoá ra cũng được.)',
          '**especially** = "nhất là", chọn ra một thứ nổi bật nhất: "I loved Huế, **especially** the bún bò." Thêm một chi tiết là người kia có cớ hỏi tiếp.',
          'Sau Have you ever…, câu trả lời hay = **Yes / No + khi nào (quá khứ đơn) + especially / actually**: "Yes, once, in March. I loved it, **especially** the food."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd14-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "Câu kể, + đuôi ngược dấu? · Have you ever + V3? · actually · especially",
        items: [
          { q: 'Hôm nay đông thật, nhỉ? (dùng busy)', hint: "it's busy, isn't it", answers: ["It's really busy today, isn't it?", "It's so busy today, isn't it?", "It's busy today, isn't it?", "It's very busy today, isn't it?", 'It is busy today, is it not?'] },
          { q: 'Anh không uống cà phê, đúng không?', hint: "don't, do you", answers: ["You don't drink coffee, do you?", 'You do not drink coffee, do you?'] },
          { q: 'Em đi Ninh Bình rồi, phải không?', hint: "went, didn't you", answers: ["You went to Ninh Bình, didn't you?", "You went to Ninh Binh, didn't you?", "You've been to Ninh Bình, haven't you?", "You've been to Ninh Binh, haven't you?"] },
          { q: 'Chị đã bao giờ ăn thử bún bò chưa?', hint: 'have you ever, tried', answers: ['Have you ever tried bún bò?', 'Have you ever tried bun bo?', 'Have you ever eaten bún bò?', 'Have you ever eaten bun bo?', 'Have you ever had bún bò?', 'Have you ever had bun bo?'] },
          { q: '(Bạn không ăn cay) Trả lời: "You don\'t eat spicy food, do you?"', hint: "No, I…", answers: ["No, I don't.", 'No, I do not.', "No, I don't eat spicy food.", "No, I don't, actually."] },
          { q: 'Rồi, một lần. Em mê lắm, nhất là đồ ăn.', hint: 'once, especially', answers: ['Yes, once. I loved it, especially the food.', 'Yes, once. I really loved it, especially the food.', 'Yes, once, and I loved it, especially the food.', 'Yes, once. I loved it, especially the food there.'] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi small talk ở công ty',
        items: [
          '~~You don\'t like durian, do you? — Yes.~~ (nghĩa là "vâng, không thích") → **No, I don\'t.** Trả lời theo sự thật. Đây là lỗi gây hiểu nhầm nhiều nhất bài hôm nay.',
          '~~It\'s hot, isn\'t?~~ / ~~It\'s hot, is it?~~ → **It\'s hot, isn\'t it?** Đuôi phải đủ **trợ động từ + đại từ**, và **ngược dấu** với câu chính.',
          '~~You like phở, isn\'t it?~~ → **You like phở, don\'t you?** "isn\'t it" không phải đuôi vạn năng (người Ấn, Singapore hay nói vậy, nhưng chuẩn thì đuôi đi theo động từ). Nói chưa kịp nghĩ thì dùng **…, right?**',
          '~~Have you ever been to Japan last year?~~ → **Have you ever been to Japan?** — **Yes, I went there last year.** Have you ever không đi với thời điểm cụ thể. Có thời điểm ⇒ quá khứ đơn.',
          '~~Did you ever eat bún chả?~~ (với ý "đã bao giờ chưa", trong lúc nói trang trọng) → **Have you ever tried bún chả?** Người Mỹ có nói "Did you ever…?" khi nói nhanh, nhưng bạn dùng Have you ever là luôn đúng.',
          '~~How much is your salary? · How much did you pay for that?~~ → hỏi chuyện khác: **How are you finding the new project?** Tiền là chủ đề riêng tư (xem bảng chủ đề ở trên).',
          '~~Yes, he\'s terrible!~~ (khi bị rủ nói xấu sếp) → **I\'m not sure. I\'m still new.** Đồng ý một lần là bạn thành "người cùng phe" trong câu chuyện người khác kể lại.',
          '~~I have been to Đà Lạt 2 times.~~ → **I\'ve been to Đà Lạt twice.** Hai lần nói **twice**, một lần **once**; từ ba trở lên mới "three times".',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi đứng nói chuyện ở pantry' },
      {
        t: 'p',
        text: 'Small talk là **5 phút đứng cạnh nhau**. Cơ thể bạn cho người kia biết bạn muốn nói chuyện, muốn né một chủ đề, hay muốn đi. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi small talk ở công ty',
        items: [
          { anh: 'head-shaking-vertically', w: "Long meeting, wasn't it?", ro: '/ˌlɔːŋ ˈmiːtɪŋ ˈwʌznt ɪt/', vi: 'Nói câu đuôi xuống giọng kèm **gật nhẹ**: người nghe hiểu ngay bạn đang mở chuyện, không hỏi thật.' },
          { anh: 'mobile-phone', w: '(cất điện thoại)', ro: '', vi: 'Đang nói chuyện mà nhìn điện thoại = "tôi không quan tâm". Úp màn hình hoặc cho vào túi.' },
          { anh: 'slightly-smiling-face', w: "Ha, nice try!", ro: '/hɑː ˌnaɪs ˈtraɪ/', vi: 'Né câu hỏi khó **bằng nụ cười**: câu từ chối có cười thì không ai thấy bị gạt đi.' },
          { anh: 'zipper-mouth-face', w: "I'm not sure. I'm still new.", ro: '/aɪm ˌnɑːt ˈʃʊr aɪm stɪl ˈnuː/', vi: 'Khi bị rủ nói xấu ai: mặt bình thường, không cười hùa, không gật. Gật đầu cũng là đồng ý.' },
          { anh: 'face-with-hand-over-mouth', w: '(cười)', ro: '', vi: 'Che miệng khi cười là phép lịch sự ở Việt Nam và Nhật. Ở Anh – Mỹ – Úc người ta cười tự nhiên, không che cũng không ai thấy lạ.' },
          { anh: 'open-hands', w: 'Have you ever been to Huế?', ro: '/həv ju ˈevər bɪn tə ˈhweɪ/', vi: 'Đứng **hơi chéo** người kia, tay thả lỏng: mở cho người khác nhập hội. Đứng đối diện sát mặt dễ thành căng thẳng.' },
          { anh: 'hot-beverage', w: "Right, I'd better get back to it.", ro: '/ˈraɪt aɪd ˈbetər ɡet ˈbæk tu ɪt/', vi: 'Muốn rút lui: cầm cốc lên, xoay người nửa bước về phía cửa, rồi nói câu kết. Đừng đi luôn giữa câu người khác.' },
          { anh: 'person-bowing', w: 'Have you tried phở yet?', ro: '/həv ju ˈtraɪd ˈfʌ jet/', vi: 'Với khách Nhật: nói chậm, cúi nhẹ khi chào và khi chia tay. Họ gật đầu liên tục khi bạn nói nghĩa là **đang nghe**, chưa chắc đồng ý.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật', 'Ấn · Philippines'],
        rows: [
          ['Im lặng giữa chuyện', 'Hơi ngượng, hay lấp bằng một câu hỏi', 'Ngượng sau 3–4 giây, người ta sẽ nói gì đó', 'Bình thường, im lặng cũng là lịch sự', 'Ít im lặng, nói chuyện sôi nổi'],
          ['Hỏi chuyện riêng', 'Hỏi tuổi, lương, gia đình là quan tâm', 'Riêng tư, chờ người ta tự kể', 'Rất riêng tư', 'Hỏi gia đình khá phổ biến, hỏi lương vẫn tế nhị'],
          ['Khen', 'Khen thẳng, cả ngoại hình', 'Khen việc làm, quần áo; tránh khen cơ thể', 'Khen thì người được khen thường chối khéo', 'Khen thoải mái'],
          ['Chạm', 'Vỗ vai, khoác tay', 'Không chạm, trừ bắt tay', 'Không chạm', 'Philippines: vỗ vai nhẹ khi thân; Ấn: khác giới ít chạm'],
        ],
        caption: 'Người Nhật **khen thì chối** ("No, no, my English is not good") là khiêm tốn, không phải họ không tin bạn. Đừng khen lại lần hai cho tới khi họ nhận.',
      },

      { t: 'h', text: '7. Phát âm: ngữ điệu câu đuôi, Have you ever, -n\'t it' },
      {
        t: 'p',
        text: 'Đuôi **xuống giọng** khi bạn mở chuyện, **lên giọng** khi hỏi thật. Đuôi phủ định nối âm: **isn\'t it** /ˈɪznɪt/, **wasn\'t it** /ˈwʌznɪt/, **didn\'t you** /ˈdɪdntʃu/, **don\'t you** /ˈdoʊntʃu/ (âm /t/ + /j/ nhập thành "ch"). **Have you ever** đọc liền: "hə-vjə-e-vơ".',
      },
      {
        t: 'phatam',
        id: 'gtd14-phat-am',
        title: 'Luyện phát âm — câu hỏi đuôi và Have you ever',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Câu 1–3 xuống giọng ở đuôi, câu 4 lên giọng. Giữ âm /z/ trong isn\'t, wasn\'t.',
        items: [
          { text: "Long meeting, wasn't it?", ipa: 'lɔːŋ miːtɪŋ wʌznt ɪt', vi: 'xuống giọng ở "it" · wasn\'t it nối thành "wʌz-nit"' },
          { text: "It's really busy today, isn't it?", ipa: 'ɪts rɪəli bɪzi tədeɪ ɪznt ɪt', vi: 'busy đọc /ˈbɪzi/ (bi-zi), không đọc "bu-xi"' },
          { text: "You went to Ninh Bình, didn't you?", ipa: 'ju went tə nɪn bɪn dɪdnt ju', vi: 'didn\'t you nối thành "đi-đn-chu"' },
          { text: "You're on the mobile team, aren't you?", ipa: 'jʊr ɑːn ðə moʊbl tiːm ɑːrnt ju', vi: 'lên giọng ở "you" vì đang hỏi thật' },
          { text: 'Have you ever been to India?', ipa: 'həv ju evər bɪn tu ɪndiə', vi: 'have you ever đọc liền · nhấn "ever" và "India"' },
          { text: "No, I don't. I've never tried it.", ipa: 'noʊ aɪ doʊnt aɪv nevər traɪd ɪt', vi: 'don\'t có /t/ cuối nhẹ · I\'ve có /v/ cuối, đừng bỏ' },
          { text: 'I loved it, especially the food.', ipa: 'aɪ lʌvd ɪt ɪspeʃəli ðə fuːd', vi: 'loved it nối "lʌv-dit" · especially nhấn âm thứ hai /ˈspeʃ/' },
          { text: "No, I'm not, actually.", ipa: 'noʊ aɪm nɑːt æktʃuəli', vi: 'actually: /ˈæk-tʃu-ə-li/, nói nhẹ ở cuối câu' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: chờ lò vi sóng với kỹ sư Nhật mới sang' },
      {
        t: 'dialogue',
        title: '12 giờ trưa thứ Sáu — Diệp đứng chờ lò vi sóng sau Kenta, kỹ sư người Nhật vừa sang Hà Nội làm ba tháng',
        lines: [
          { who: 'Diệp', role: 'a', text: "Hi, Kenta. It's always a long wait on Fridays, isn't it?", vi: 'Chào anh Kenta. Thứ Sáu nào cũng phải chờ lâu, nhỉ?' },
          { who: 'Kenta', role: 'b', text: 'Yes, very long. Everyone brings lunch on Friday.', vi: 'Vâng, rất lâu. Thứ Sáu ai cũng mang cơm.' },
          { who: 'Diệp', role: 'a', text: "You came from Osaka last week, didn't you? How are you finding Hà Nội?", vi: 'Anh từ Osaka sang tuần trước, đúng không? Anh thấy Hà Nội thế nào?' },
          { who: 'Kenta', role: 'b', text: 'It is very interesting. Many motorbikes! But the people are kind.', vi: 'Rất thú vị. Nhiều xe máy quá! Nhưng mọi người tốt bụng.' },
          { who: 'Diệp', role: 'a', text: 'Have you tried any Vietnamese food yet?', vi: 'Anh đã ăn thử món Việt nào chưa?' },
          { who: 'Kenta', role: 'b', text: 'Only phở. It was delicious. Have you ever been to Japan, Diệp?', vi: 'Mới có phở. Ngon lắm. Chị đã bao giờ đi Nhật chưa, Diệp?' },
          { who: 'Diệp', role: 'a', text: "No, never, but I've always wanted to see Kyoto, especially in autumn.", vi: 'Chưa bao giờ ạ, nhưng em luôn muốn tới Kyoto, nhất là vào mùa thu.' },
          { who: 'Kenta', role: 'b', text: "Ah, autumn in Kyoto is beautiful. You don't like cold weather, do you?", vi: 'À, mùa thu Kyoto đẹp lắm. Chị không thích trời lạnh, đúng không?' },
          { who: 'Diệp', role: 'a', text: "No, I don't, actually. But for Kyoto, I can wear a big coat!", vi: 'Thật ra là em không thích ạ. Nhưng vì Kyoto thì em mặc áo khoác dày cũng được!' },
          { who: 'Kenta', role: 'b', text: 'Ha ha. Oh, my lunch is ready. Please, go ahead.', vi: 'Ha ha. Ồ, cơm của tôi xong rồi. Chị dùng đi.' },
          { who: 'Diệp', role: 'a', text: "Thanks, Kenta. Enjoy your lunch. Next time, let's try bún chả together!", vi: 'Cảm ơn anh Kenta. Anh ăn ngon miệng nhé. Lần sau mình đi ăn bún chả cùng nhau nhé!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd14-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Diệp (5 câu)',
        items: [
          { vi: 'Thứ Sáu nào cũng phải chờ lâu, nhỉ?', chips: ["It's", 'always', 'a', 'long', 'wait', 'on', 'Fridays,', "isn't", 'it?', "doesn't", 'is'], answer: ["It's", 'always', 'a', 'long', 'wait', 'on', 'Fridays,', "isn't", 'it?'] },
          { vi: 'Anh từ Osaka sang tuần trước, đúng không?', chips: ['You', 'came', 'from', 'Osaka', 'last', 'week,', "didn't", 'you?', "don't", 'come'], answer: ['You', 'came', 'from', 'Osaka', 'last', 'week,', "didn't", 'you?'] },
          { vi: 'Anh đã ăn thử món Việt nào chưa?', chips: ['Have', 'you', 'tried', 'any', 'Vietnamese', 'food', 'yet?', 'try', 'did'], answer: ['Have', 'you', 'tried', 'any', 'Vietnamese', 'food', 'yet?'] },
          { vi: 'Chưa bao giờ, nhưng em luôn muốn tới Kyoto.', chips: ['No,', 'never,', 'but', "I've", 'always', 'wanted', 'to', 'see', 'Kyoto.', 'want', 'ever'], answer: ['No,', 'never,', 'but', "I've", 'always', 'wanted', 'to', 'see', 'Kyoto.'] },
          { vi: '(Không thích trời lạnh) Thật ra là em không thích ạ.', chips: ['No,', 'I', "don't,", 'actually.', 'Yes,', 'do,'], answer: ['No,', 'I', "don't,", 'actually.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd14-noi-tra-loi',
        part: '1',
        questions: [
          "Long day today, isn't it? How's your week going?",
          'Have you ever been abroad? Where did you go?',
          "You don't drink coffee, do you?",
          'What Vietnamese food should I try first? Have you ever cooked it yourself?',
          'So, how much do they pay interns here?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Brendan, a chatty Irish developer at a software outsourcing company in Hanoi. We are colleagues standing in the office pantry waiting for the kettle. Make small talk with me using tag questions (some with falling intonation, some real questions) and at least two Have you ever… questions. During the chat, do three tricky things: ask me a negative tag question that I must answer correctly (for example You don\'t like coffee, do you?), ask how much I earn, and try to get me to agree that our manager is bad. I should avoid the last two politely and change the topic. Use natural B1 English. After 12 turns, end the chat with a natural closing line, then tell me in Vietnamese: did I answer the negative tag question correctly, how well did I avoid the difficult topics, and two sentences I could say more naturally."',
          'Làm **2 lượt**. Lượt hai: bạn là người bắt chuyện, AI là khách Mỹ vừa họp xong. Bạn phải mở chuyện bằng câu đuôi xuống giọng, hỏi ít nhất **hai** câu Have you ever / Have you tried… yet, và kết thúc bằng một câu chào khách đúng mức trang trọng.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd14-viet',
    kind: 'writing',
    title: 'Tin nhắn nhóm: rủ ăn trưa, sinh nhật đồng nghiệp',
    goal: 'Viết được tin nhắn nhóm rủ ăn trưa, hỏi khẩu vị cho nhóm nhiều nước, rủ góp quà sinh nhật bí mật và trả lời nhận lời / từ chối, ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Viết gì trong nhóm chat công ty',
        items: [
          'Nhóm chat của team là nơi small talk **bằng chữ**: rủ ăn trưa, chúc mừng, rủ góp quà. Viết đúng giọng thì người ta trả lời nhanh; viết dài như email thì không ai đọc.',
          'Bốn mẫu hôm nay: **rủ ăn trưa** · **hỏi khẩu vị, ăn kiêng** · **góp quà sinh nhật bí mật** · **trả lời có / không**. Mỗi mẫu một bản thân mật, một bản trang trọng.',
          'Ngày 12 bạn đã viết lời chúc trên thiệp sinh nhật. Hôm nay là phần **tổ chức**: rủ, hỏi, giữ bí mật, chốt giờ.',
          'Dùng lại: câu đuôi trong chat ("…, right?"), Have you ever tried…?, I\'d love to, but… (Ngày 10).',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Rủ ăn trưa',
        caption: 'Tin thân mật: ai, ăn gì, mấy giờ, gặp ở đâu, trong 2–3 dòng. Tin trang trọng (mời khách đang ở văn phòng) thêm câu chào và cho người được mời quyền từ chối.',
        cols: [
          {
            title: 'Thân mật (nhóm #team-osaka)',
            anh: 'speech-balloon',
            items: [
              'Anyone up for bún chả today? 🍜',
              "Thinking 12:15, meet at the lifts.",
              "Reply with 🙋 if you're in!",
            ],
          },
          {
            title: 'Trang trọng (mời khách Mỹ đang ở văn phòng)',
            anh: 'e-mail',
            items: [
              'Hi Debbie,',
              'A few of us are going out for lunch at 12:15 to a local bún chả place, about 5 minutes\' walk away.',
              "We'd be delighted if you could join us, but please don't feel obliged if you're busy.",
              'Best,',
              'Diệp',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Hỏi khẩu vị cho nhóm nhiều nước',
        caption: 'Hỏi về **đồ ăn**, không hỏi về tôn giáo hay lý do. Người ta tự nói nếu muốn.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'fork-and-knife-with-plate',
            items: [
              'Quick one: any food no-gos? 🌶️🥩',
              "I'll pick a place that works for everyone.",
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'memo',
            items: [
              'Dear all,',
              'Before I book the restaurant for Thursday, could you let me know if you have any dietary requirements (for example vegetarian, halal or allergies)?',
              'Thank you,',
              'Diệp',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Góp quà sinh nhật bí mật',
        caption: 'Viết trong **nhóm riêng không có người có sinh nhật**. Ghi rõ: sinh nhật ai, ngày nào, góp bao nhiêu (tuỳ ý), gửi cho ai, hạn chót.',
        cols: [
          {
            title: 'Thân mật (nhóm bí mật)',
            anh: 'wrapped-gift',
            items: [
              "🤫 Meera's birthday is on Friday!",
              "We're chipping in for a gift and a cake. 50k–100k, whatever you like.",
              'Send it to me by Wednesday. Cake in the pantry at 3 pm Friday!',
              "Please don't mention it in the team chat 😄",
            ],
          },
          {
            title: 'Trang trọng (email trưởng nhóm gửi cả tầng)',
            anh: 'birthday-cake',
            items: [
              'Hi everyone,',
              "We're celebrating Meera's birthday this Friday at 3 pm in the pantry.",
              'If you would like to contribute to a gift, please contact Diệp by Wednesday. Contributions are entirely optional.',
              'Thanks,',
              'Grant',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Trả lời: nhận lời và từ chối',
        caption: 'Nhận lời: ngắn. Từ chối: một lý do ngắn + chúc vui (Ngày 10). Không cần giải thích dài.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thumbs-up',
            items: [
              "Count me in! 🙋",
              "I'll pass today, got a call at 12:30 😅 Have fun!",
              'Just sent 100k for the gift 🎁',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'handshake',
            items: [
              'Thank you for the invitation. I would be happy to join.',
              "Thank you for thinking of me. Unfortunately I have a call at 12:30, but I hope you all enjoy it.",
            ],
          },
        ],
      },

      { t: 'h', text: '2. Khung câu cho tin nhắn nhóm' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Anyone up for + N / V-ing + (thời gian)?',
            vi: 'Rủ cả nhóm, rất thân mật. Không chỉ định ai nên ai không đi cũng không ngại.',
            examples: [
              { en: 'Anyone up for bún chả today?', vi: 'Có ai muốn đi bún chả hôm nay không?' },
              { en: 'Anyone up for coffee at 3?', vi: 'Ba giờ có ai đi cà phê không?' },
              { en: 'Anyone up for badminton after work?', vi: 'Có ai đánh cầu lông sau giờ làm không?' },
            ],
          },
          {
            formula: "We're chipping in for + N",
            vi: 'Cả nhóm góp tiền cho một món (quà, bánh, bữa ăn).',
            examples: [
              { en: "We're chipping in for a gift and a cake.", vi: 'Mọi người góp tiền mua quà và bánh.' },
              { en: "We're chipping in for Paolo's farewell lunch.", vi: 'Mọi người góp tiền cho bữa trưa chia tay anh Paolo.' },
              { en: 'Happy to chip in!', vi: 'Mình góp với!' },
            ],
          },
          {
            formula: 'Count me in! / I\'ll pass this time.',
            vi: 'Trả lời nhanh: có mặt / lần này không đi.',
            examples: [
              { en: 'Count me in!', vi: 'Tính cả mình nhé!' },
              { en: "I'll pass this time. Have fun!", vi: 'Lần này mình không đi. Đi vui nhé!' },
              { en: "Count me in, but I'll be 10 minutes late.", vi: 'Có mình, nhưng mình tới muộn 10 phút.' },
            ],
          },
          {
            formula: 'Could you let me know if + S + V … ?',
            vi: 'Hỏi lịch sự trong tin trang trọng (đã gặp ở Ngày 2, nay dùng để hỏi khẩu vị, lịch).',
            examples: [
              { en: 'Could you let me know if you have any dietary requirements?', vi: 'Anh chị báo giúp em nếu có yêu cầu về ăn uống nhé?' },
              { en: "Could you let me know if you're free on Thursday?", vi: 'Anh chị báo giúp em thứ Năm có rảnh không ạ?' },
              { en: 'Could you let me know if you would like to contribute?', vi: 'Anh chị báo giúp em có muốn góp không ạ?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Rủ: Anyone up for … + giờ + chỗ gặp · Góp: We\'re chipping in for … + bao nhiêu + gửi ai + hạn · Đáp: Count me in! / I\'ll pass this time.',
        vi: 'Tin nhắn nhóm tốt trả lời được ngay bốn câu: cái gì, khi nào, ở đâu, làm gì để tham gia.',
      },
      {
        t: 'table',
        head: ['Việc', 'Nên', 'Tránh', 'Vì sao'],
        rows: [
          ['Rủ cả nhóm', 'Anyone up for…? · Reply with 🙋', '@ từng người một', 'Gọi tên từng người làm người không đi khó từ chối.'],
          ['Góp tiền', 'Ghi "whatever you like" / "optional"', 'Ghi số tiền cố định, đòi ai chưa góp trong nhóm', 'Thu nhập mỗi người khác nhau. Góp là tự nguyện.'],
          ['Bí mật sinh nhật', 'Lập nhóm riêng không có người đó', 'Nhắn trong nhóm chung "đừng nói với Meera nhé"', 'Meera ở ngay trong nhóm chung, đọc được.'],
          ['Trả lời', 'Một dòng hoặc một emoji 👍 🙋', 'Viết đoạn dài giải thích vì sao không đi', 'Nhóm chat cần gọn, nhiều người đọc trên điện thoại.'],
          ['Hỏi ăn kiêng', '"Any dietary requirements?"', '"Are you Muslim? Can you eat beef?"', 'Hỏi đồ ăn thì được, hỏi tôn giáo trong nhóm chat thì không.'],
          ['Giờ giấc', 'Ghi giờ + chỗ gặp: 12:15, at the lifts', '"Lunch soon?"', 'Không có giờ thì không ai biết lúc nào đi.'],
        ],
        caption: 'Văn hoá nhóm chat ở công ty có người nước ngoài: **ngắn, rõ, không ép ai**.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd14-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Có ai muốn đi bún chả hôm nay không?', chips: ['Anyone', 'up', 'for', 'bún chả', 'today?', 'to', 'down'], answer: ['Anyone', 'up', 'for', 'bún chả', 'today?'] },
          { vi: 'Mọi người góp tiền mua quà và bánh.', chips: ["We're", 'chipping', 'in', 'for', 'a', 'gift', 'and', 'a', 'cake.', 'chip', 'on'], answer: ["We're", 'chipping', 'in', 'for', 'a', 'gift', 'and', 'a', 'cake.'] },
          { vi: 'Lần này mình không đi. Đi vui nhé!', chips: ["I'll", 'pass', 'this', 'time.', 'Have', 'fun!', 'pas', 'go'], answer: ["I'll", 'pass', 'this', 'time.', 'Have', 'fun!'] },
          { vi: 'Anh chị báo giúp em nếu có yêu cầu về ăn uống nhé?', chips: ['Could', 'you', 'let', 'me', 'know', 'if', 'you', 'have', 'any', 'dietary', 'requirements?', 'diet', 'tell'], answer: ['Could', 'you', 'let', 'me', 'know', 'if', 'you', 'have', 'any', 'dietary', 'requirements?'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd14-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: 'Anyone up for…? · chip in · Count me in · I\'ll pass · optional · dietary requirements',
        items: [
          { q: 'Anyone ___ for coffee at 3?', answers: ['up'] },
          { q: "We're chipping ___ for Meera's birthday cake.", answers: ['in'] },
          { q: 'Count me ___! 🙋', answers: ['in'] },
          { q: "I'll ___ this time, I have a call. Have fun!", answers: ['pass'] },
          { q: 'Contributions are entirely ___. (không bắt buộc)', answers: ['optional'] },
          { q: 'Do you have any dietary ___? (yêu cầu về ăn uống)', answers: ['requirements', 'restrictions', 'needs'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd14-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "Anyone up for…? · We're chipping in for… · Count me in · I'll pass · Could you let me know if…?",
        items: [
          { q: '(Nhóm thân) Có ai đi ăn phở trưa nay không? 12 giờ, gặp ở thang máy.', hint: 'anyone up for, meet at the lifts', answers: ['Anyone up for phở today? 12:00, meet at the lifts.', 'Anyone up for pho today? 12:00, meet at the lifts.', 'Anyone up for phở for lunch? 12:00, meet at the lifts.', 'Anyone up for pho for lunch? 12:00, meet at the lifts.', 'Anyone up for phở today? 12, meet at the lifts.', 'Anyone up for pho today? 12, meet at the lifts.', 'Anyone up for phở today? Meet at the lifts at 12.', 'Anyone up for pho today? Meet at the lifts at 12.', 'Anyone up for phở for lunch today? 12:00, meet at the lifts.', 'Anyone up for pho for lunch today? 12:00, meet at the lifts.'] },
          { q: '(Nhóm bí mật) Thứ Sáu là sinh nhật Paolo! Mọi người góp tiền mua quà nhé.', hint: "birthday, we're chipping in", answers: ["Paolo's birthday is on Friday! We're chipping in for a gift.", "It's Paolo's birthday on Friday! We're chipping in for a gift.", "Paolo's birthday is on Friday! We're chipping in for a present.", "It's Paolo's birthday on Friday! We're chipping in for a present.", "Paolo's birthday is Friday! We're chipping in for a gift."] },
          { q: 'Tính cả mình nhé! Mình vừa gửi 100 nghìn.', hint: 'count me in, just sent', answers: ["Count me in! I've just sent 100k.", 'Count me in! I just sent 100k.', "Count me in! I've just sent 100,000.", 'Count me in! I just sent 100,000.', "Count me in! I've just sent 100k VND.", 'Count me in! I just sent 100k VND.'] },
          { q: 'Lần này mình không đi được, mình có cuộc gọi lúc 12 rưỡi. Đi vui nhé!', hint: "I'll pass, call at 12:30, have fun", answers: ["I'll pass this time, I have a call at 12:30. Have fun!", "I'll pass this time. I have a call at 12:30. Have fun!", "I'll pass this time, I've got a call at 12:30. Have fun!", "I'll pass this time. I've got a call at 12:30. Have fun!", "I'll pass this time, got a call at 12:30. Have fun!"] },
          { q: '(Trang trọng) Anh chị báo giúp em nếu có yêu cầu về ăn uống nhé.', hint: 'could you let me know if, dietary requirements', answers: ['Could you let me know if you have any dietary requirements?', 'Could you please let me know if you have any dietary requirements?', 'Could you let me know if you have any dietary requirements, please?'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi gửi vào nhóm',
        items: [
          '**Đúng nhóm chưa?** Tin bí mật sinh nhật gửi nhầm vào nhóm chung là lỗi kinh điển. Nhìn tên nhóm hai lần.',
          '**Đủ giờ + chỗ gặp chưa?** "Lunch?" không đủ. "12:15, at the lifts" là đủ.',
          '**Có ép ai không?** Có "optional / whatever you like / no pressure" chưa (Ngày 1 đã gặp **No pressure!**)?',
          '**Đọc lại giọng điệu**: nhóm thân dùng emoji, câu ngắn. Tin cho khách hay sếp lớn: chào, đủ câu, không emoji.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd14-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 14',
    goal: 'Làm 36 câu có đáp án để dựng và trả lời đúng câu hỏi đuôi, hỏi Have you ever…, chọn chủ đề an toàn, né khéo chủ đề khó và ôn lại Ngày 13.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 36 câu**: chọn câu hợp cảnh · điền đuôi · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 13** (câu hỏi làm quen, also / too / either) và **Ngày 10** (từ chối khéo).',
          'Phần trả lời câu đuôi phủ định: đọc chậm, nghĩ theo **sự thật**, rồi mới chọn Yes / No.',
          'Đúng từ **29/36** trở lên là sẵn sàng sang Ngày 15.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd14-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp hỏi: "You haven\'t been to Japan, have you?" Bạn CHƯA từng đi. Bạn đáp:',
            options: ['Yes.', "Yes, I haven't.", "No, I haven't.", 'No, I have.'],
            correct: 2,
            why: 'Chưa đi = câu phủ định ⇒ **No, I haven\'t.** Yes / No theo sự thật, không theo câu hỏi.',
          },
          {
            q: 'Câu đuôi nào đúng? "She works on the Osaka project, ___?"',
            options: ["isn't she", "doesn't she", "don't she", "didn't she"],
            correct: 1,
            why: 'Câu chính hiện tại đơn, ngôi thứ ba (works) ⇒ đuôi **doesn\'t she**.',
          },
          {
            q: 'Vừa họp xong, bạn muốn mở chuyện với một đồng nghiệp người Úc. Câu nào tự nhiên nhất?',
            options: ['What is your salary?', "Long meeting, wasn't it?", 'Do you agree the manager is bad?', 'How old are you?'],
            correct: 1,
            why: 'Câu đuôi về điều cả hai cùng biết là cách mở chuyện an toàn nhất.',
          },
          {
            q: 'Một đồng nghiệp hỏi "How much do you earn?" ở bàn ăn đông người. Bạn không muốn nói. Câu nào hợp?',
            options: ["That's none of your business!", "Ha, nice try! Let's just say it's enough for now.", '8 million.', 'Why do you ask me that?'],
            correct: 1,
            why: 'Đùa nhẹ + trả lời mơ hồ = né mà không làm ai mất mặt. Câu A đúng ý nhưng quá gắt.',
          },
          {
            q: 'Bạn muốn hỏi một đồng nghiệp người Anh đã từng ăn bánh xèo chưa. Câu nào đúng?',
            options: ['Did you ever eat bánh xèo last week?', 'Have you ever tried bánh xèo?', 'Have you tried bánh xèo yesterday?', 'Do you ever tried bánh xèo?'],
            correct: 1,
            why: '**Have you ever + V3** hỏi trải nghiệm. Có "last week / yesterday" thì phải dùng quá khứ đơn.',
          },
          {
            q: '"Between you and me, Grant\'s new plan is a disaster, isn\'t it?" Bạn là người mới. Câu nào khôn ngoan nhất?',
            options: ['Yes, it really is!', "I'm not sure. I'm still new. Anyway, have you tried the new café downstairs?", "I'll tell Grant you said that.", 'No, YOU are a disaster.'],
            correct: 1,
            why: 'Không đồng ý, không cãi, không mách: "**I\'m still new**" + đổi chủ đề.',
          },
          {
            q: 'Bạn muốn rút khỏi cuộc nói chuyện ở pantry một cách lịch sự. Bạn nói:',
            options: ['Bye.', "Right, I'd better get back to it. Good chat!", "I'm bored now.", "Sorry, you talk too much."],
            correct: 1,
            why: '"**I\'d better get back to it**" + "**Good chat!**" là câu kết chuẩn ở văn phòng.',
          },
          {
            q: 'Câu nào là câu đuôi đang hỏi THẬT (lên giọng)?',
            options: ["Lovely day, isn't it? ↘", "You're on Lindsay's team, aren't you? ↗", "Long meeting, wasn't it? ↘", "Busy today, isn't it? ↘"],
            correct: 1,
            why: 'Mũi tên **↗ lên giọng** = người nói chưa chắc, cần câu trả lời thật. Ba câu kia là mở chuyện.',
          },
          {
            q: '(Ôn Ngày 13) Đồng nghiệp: "I don\'t eat beef." Bạn cũng không ăn. Bạn đáp:',
            options: ["I don't too.", "I don't either.", 'Me too.', "I also don't."],
            correct: 1,
            why: 'Câu phủ định ⇒ **either**. (Thân mật: Me neither.)',
          },
          {
            q: '(Ôn Ngày 10) Cả nhóm rủ ăn trưa nhưng bạn có cuộc gọi. Câu nào khéo nhất?',
            options: ["No, I can't.", "I'd love to, but I've got a call at 12:30. Have fun!", "I don't want to.", 'Maybe.'],
            correct: 1,
            why: '**I\'d love to, but…** + lý do ngắn + chúc vui. Đúng khung từ chối khéo của Ngày 10.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền câu đuôi' },
      {
        t: 'quiz',
        id: 'gtd14-bt-dien',
        title: 'Phần II — Điền phần đuôi (8 câu)',
        kind: 'fill',
        grammar: 'Câu (+) → đuôi (−) · Câu (−) → đuôi (+) · trợ động từ + đại từ',
        items: [
          { q: "It's really cold in the canteen, ___ ___?", answers: ["isn't it"] },
          { q: "You went to Huế last year, ___ ___?", answers: ["didn't you"] },
          { q: "Meera doesn't drink alcohol, ___ ___?", answers: ['does she'] },
          { q: "They're from Manila, ___ ___?", answers: ["aren't they"] },
          { q: "You've met Okada-san, ___ ___?", answers: ["haven't you"] },
          { q: "Brendan can't speak Vietnamese, ___ ___?", answers: ['can he'] },
          { q: "That was a great lunch, ___ ___?", answers: ["wasn't it"] },
          { q: "I'm on the list for Friday, ___ ___?", answers: ["aren't I"] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd14-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "Câu đuôi · Have you ever + V3? · Let's just say… · I'd rather not say · I'd better get back to it",
        items: [
          { q: 'Chị đã bao giờ tới Đà Nẵng chưa?', hint: 'have you ever, been to', answers: ['Have you ever been to Da Nang?', 'Have you ever been to Đà Nẵng?'] },
          { q: 'Chị thấy Hà Nội tới giờ thế nào?', hint: 'how are you finding, so far', answers: ['How are you finding Hà Nội so far?', 'How are you finding Hanoi so far?', 'How are you finding Ha Noi so far?', 'How do you like Hanoi so far?', 'How do you like Hà Nội so far?'] },
          { q: 'Mình xin phép không nói, được không.', hint: "I'd rather not say", answers: ["I'd rather not say, if that's okay.", "I'd rather not say, if that's OK.", "I'd rather not say, if you don't mind.", 'I would rather not say, if that is okay.'] },
          { q: 'Thật ra em không phải người Hà Nội. (dùng actually)', hint: "I'm not, actually", answers: ["I'm not from Hanoi, actually.", "Actually, I'm not from Hanoi.", "I'm not from Hà Nội, actually.", "Actually, I'm not from Hà Nội.", "I'm actually not from Hanoi.", "I'm actually not from Hà Nội."] },
          { q: 'Chị mê Huế lắm, nhất là đồ ăn.', hint: 'loved, especially', answers: ['I loved Huế, especially the food.', 'I loved Hue, especially the food.', 'I love Huế, especially the food.', 'I love Hue, especially the food.', 'I really loved Huế, especially the food.', 'I really loved Hue, especially the food.'] },
          { q: 'Thôi, mình phải quay lại làm việc đây. Nói chuyện vui lắm!', hint: "I'd better get back to it, good chat", answers: ["Right, I'd better get back to it. Good chat!", "I'd better get back to it. Good chat!", "Well, I'd better get back to it. Good chat!", "Okay, I'd better get back to it. Good chat!", "Right, I'd better get back to work. Good chat!", "I'd better get back to work. Good chat!"] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd14-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (6 câu)',
        items: [
          { label: 'Câu 1', spell: "You're more of a tea person, aren't you?", answer: "You're more of a tea person, aren't you?", alt: ["You are more of a tea person, aren't you?"] },
          { label: 'Câu 2', spell: 'Have you tried egg coffee yet?', answer: 'Have you tried egg coffee yet?' },
          { label: 'Câu 3', spell: "No, never. But I've always wanted to go.", answer: "No, never. But I've always wanted to go.", alt: ['No, never. But I have always wanted to go.', "No never but I've always wanted to go"] },
          { label: 'Câu 4', spell: "Between you and me, it wasn't great.", answer: "Between you and me, it wasn't great.", alt: ['Between you and me, it was not great.'] },
          { label: 'Câu 5', spell: 'Anyone up for coffee at three?', answer: 'Anyone up for coffee at three?', alt: ['Anyone up for coffee at 3?'] },
          { label: 'Câu 6', spell: 'Count me in!', answer: 'Count me in!' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd14-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (6 câu)',
        items: [
          { vi: 'Họp lâu thật, nhỉ?', chips: ['That', 'was', 'a', 'long', 'meeting,', "wasn't", 'it?', "isn't", 'is'], answer: ['That', 'was', 'a', 'long', 'meeting,', "wasn't", 'it?'] },
          { vi: 'Em đã bao giờ làm với khách Nhật chưa?', chips: ['Have', 'you', 'ever', 'worked', 'with', 'Japanese', 'clients?', 'work', 'did'], answer: ['Have', 'you', 'ever', 'worked', 'with', 'Japanese', 'clients?'] },
          { vi: 'Cứ cho là đủ trả tiền nhà đi.', chips: ["Let's", 'just', 'say', 'it', 'paid', 'the', 'rent.', 'tell', 'pay'], answer: ["Let's", 'just', 'say', 'it', 'paid', 'the', 'rent.'] },
          { vi: 'Em không chắc. Em còn mới.', chips: ["I'm", 'not', 'sure.', "I'm", 'still', 'new.', 'yet', 'sure'], answer: ["I'm", 'not', 'sure.', "I'm", 'still', 'new.'] },
          { vi: 'Rồi, hai lần. Em thích lắm, nhất là các hang động.', chips: ['Yes,', 'twice.', 'I', 'loved', 'it,', 'especially', 'the', 'caves.', 'two', 'times', 'special'], answer: ['Yes,', 'twice.', 'I', 'loved', 'it,', 'especially', 'the', 'caves.'] },
          { vi: '(Ôn Ngày 13) Chị làm ở đây bao lâu rồi?', chips: ['How', 'long', 'have', 'you', 'been', 'here?', 'do', 'are'], answer: ['How', 'long', 'have', 'you', 'been', 'here?'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Chuẩn bị **3 câu đuôi mở chuyện** cho ba chỗ ở trường / công ty của bạn (căng tin, thang máy, sau giờ học / họp). Nói to, **xuống giọng** ở đuôi.',
          'Viết sẵn **3 câu Have you ever…?** về đồ ăn và nơi chốn ở thành phố bạn, để hỏi người nước ngoài.',
          'Tập to câu né chủ đề khó cho thật trơn: "**Ha, nice try!**" · "**I\'d rather not say, if that\'s okay.**" · "**I\'m not sure. I\'m still new.**"',
          'Ngày 15: nhờ đồng nghiệp giúp việc và hỏi chỗ đồ dùng một cách lịch sự (Do you know where…? Would you mind…?).',
        ],
      },
    ],
  },
];
