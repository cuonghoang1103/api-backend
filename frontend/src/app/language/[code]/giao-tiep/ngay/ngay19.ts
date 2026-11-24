/**
 * Tiếng Anh giao tiếp — NGÀY 19 (chặng 4 "Giao tiếp sâu", B1+ → B2): kết bạn & networking.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd19-`.
 * Ngữ pháp trong câu: used to (+ didn't use to / Did you use to…?) · câu hỏi nối tiếp để giữ chuyện.
 * Nối câu: but now · these days · that's why.
 * Cảnh: Uyên — sinh viên IT năm 3 đang OJT ở TP.HCM — được công ty cho đi một hội thảo sản phẩm hai ngày ở Quận 1:
 * giờ giải lao chê nhầm bài nói của chính diễn giả (Rhys, người xứ Wales, từng dạy vật lý); buổi meetup tối ở Thảo Điền
 * bị một ông chủ startup rủ "thực tập không lương" (Jake, người Úc) và được Marisol (Mỹ) gỡ cho; cuối buổi giới thiệu
 * hai người với nhau, xin LinkedIn khi mã QR không tải được, chào ra về.
 * Khác podcast en-se-a2-01 (Minh lần đầu đi meetup, tự giới thiệu cơ bản) và en-b1-03 (bạn quen qua mạng): hôm nay là
 * VÀO một nhóm đang nói, GIỮ chuyện bằng câu hỏi nối tiếp, THOÁT khỏi người nói dai, XIN liên lạc và CHÀO ra về.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_19: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd19-nghe',
    kind: 'listening',
    title: 'Kết bạn & networking: meetup, hội thảo',
    goal: 'Nghe hiểu ba cảnh networking thật: bắt chuyện ở giờ giải lao, vào một nhóm đang nói dở, thoát khỏi người nói dai, xin liên lạc và chào ra về; nhận ra câu nói thật sự có ý gì.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Chặng 4 bắt đầu: nhanh hơn, dài hơn, ít chữ Việt hơn',
        items: [
          'Chặng 3 (Ngày 13–18) bạn đã sống được ở công sở: làm quen team, nhờ việc, họp video, nói đồng ý – không đồng ý. Chặng 4 ra **ngoài** công ty: gặp người lạ, đón khách, phàn nàn, thương lượng.',
          'Hôm nay bạn theo **Uyên**, sinh viên IT năm 3 đang OJT ở TP.HCM, được công ty cho đi **một hội thảo sản phẩm** ở Quận 1 và một **buổi meetup** buổi tối ở Thảo Điền.',
          'Tốc độ nói từ hôm nay khoảng **160 từ/phút** (chặng 1 là 130). Câu dễ **không còn dịch** bên dưới: thử hiểu thẳng bằng tiếng Anh trước, bí quá mới mở phần lời thoại.',
          'Bạn cần nghe ra: **họ từng làm gì** (used to…), **câu hỏi nào giữ được chuyện**, và **câu nào thật ra là lời chào tạm biệt** dù nghe không giống.',
          'Nghe mỗi cảnh **2 lần**: lần 1 không nhìn chữ, ghi ra giấy 3 thông tin; lần 2 mở lời thoại, đánh dấu chỗ nghe sót.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Giờ giải lao: chê nhầm người' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'woman-technologist', 'man-teacher', 'studio-microphone', 'face-with-hand-over-mouth'],
        caption: '10 giờ 30 sáng, giờ giải lao ở hội thảo. Bàn đứng nào cũng kín người. **Uyên** cầm cốc cà phê đi tới một bàn chỉ có một người đàn ông đang xem điện thoại: **Rhys**. Uyên chưa biết Rhys là ai.',
      },
      {
        t: 'listen',
        id: 'gtd19-nghe-canh1',
        title: 'Scene 1 — The coffee break',
        note: 'Nghe xem Uyên chê điều gì, Rhys là ai, và trước đây Rhys làm nghề gì.',
        lines: [
          { who: 'Uyên', voice: 'nz-nu', text: "Hi, mind if I join you? Every other table's full.", vi: 'Chào anh, em đứng cùng được không ạ? Bàn nào cũng kín cả rồi.' },
          { who: 'Rhys', voice: 'uk-nam', text: "Not at all, go ahead. I'm Rhys, by the way." },
          { who: 'Uyên', voice: 'nz-nu', text: "I'm Uyên. Nice to meet you." },
          { who: 'Rhys', voice: 'uk-nam', text: "Nice to meet you too. So, what did you make of the morning sessions?", vi: 'Rất vui được gặp em. Thế em thấy mấy phiên buổi sáng thế nào?' },
          { who: 'Uyên', voice: 'nz-nu', text: "The design one was brilliant. The accessibility talk was interesting too, but honestly, it went a bit fast at the end. I couldn't keep up with the slides.", vi: 'Bài về thiết kế hay lắm ạ. Bài về khả năng tiếp cận cũng thú vị, nhưng thật lòng thì đoạn cuối hơi nhanh. Em theo không kịp các slide.' },
          { who: 'Rhys', voice: 'uk-nam', text: "Yeah… that was me.", vi: 'Ừ… bài đó là của anh.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Oh no. I'm so sorry, I didn't mean it like that.", vi: 'Ôi không. Em xin lỗi, em không có ý như vậy.' },
          { who: 'Rhys', voice: 'uk-nam', text: "No, no, you're absolutely right. I had forty slides for twenty minutes. Lesson learned.", vi: 'Không, không, em nói đúng hoàn toàn. Anh có bốn mươi slide cho hai mươi phút. Rút kinh nghiệm.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Well, the first half really made me think. I'd never tried using an app with a screen reader before.", vi: 'Mà nửa đầu thật sự làm em phải nghĩ. Trước giờ em chưa từng thử dùng ứng dụng bằng trình đọc màn hình.' },
          { who: 'Rhys', voice: 'uk-nam', text: "That's the best thing anyone's said to me all day." },
          { who: 'Uyên', voice: 'nz-nu', text: "So, have you always worked in tech?", vi: 'Thế anh có làm ngành công nghệ từ đầu không ạ?' },
          { who: 'Rhys', voice: 'uk-nam', text: "Not at all. I used to teach physics at a secondary school in Cardiff. Eight years of it.", vi: 'Hoàn toàn không. Anh từng dạy vật lý ở một trường trung học tại Cardiff. Tám năm liền.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Really? What made you switch?", vi: 'Thật ạ? Điều gì khiến anh chuyển nghề?' },
          { who: 'Rhys', voice: 'uk-nam', text: "I used to spend my weekends building little apps for my students, and one day I realised I enjoyed that more than marking homework.", vi: 'Hồi đó cuối tuần nào anh cũng ngồi làm mấy cái ứng dụng nhỏ cho học sinh, rồi một hôm anh nhận ra mình thích việc đó hơn chấm bài.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Do you ever miss it?", vi: 'Anh có bao giờ nhớ nghề cũ không?' },
          { who: 'Rhys', voice: 'uk-nam', text: "All the time. That's partly why I give talks. It's teaching, just with a bigger room and worse coffee.", vi: 'Lúc nào cũng nhớ. Một phần vì thế mà anh đi nói chuyện. Cũng là dạy học, chỉ có phòng to hơn và cà phê dở hơn.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Ha! The coffee's not that bad. Are you here for long?" },
          { who: 'Rhys', voice: 'uk-nam', text: "Just this week. I fly to Singapore on Sunday. Oh, that's the bell. Are you going to the meetup tonight?", vi: 'Chỉ tuần này thôi. Chủ nhật anh bay đi Singapore. Ồ, chuông rồi. Tối nay em có đi buổi meetup không?' },
          { who: 'Uyên', voice: 'nz-nu', text: "I'm planning to. And sorry again about the slides comment!", vi: 'Em định đi ạ. Và xin lỗi lần nữa về câu chê slide!' },
          { who: 'Rhys', voice: 'uk-nam', text: "Don't be. Find me there and you can tell me which ten slides to cut.", vi: 'Đừng xin lỗi. Tối gặp anh ở đó, em chỉ cho anh nên bỏ mười slide nào.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd19-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Uyên chê điều gì ở bài nói về khả năng tiếp cận (accessibility)?',
            options: ['Nội dung nhàm', 'Đoạn cuối đi quá nhanh, không theo kịp slide', 'Diễn giả nói giọng khó nghe', 'Phòng quá đông'],
            correct: 1,
            why: '"It went **a bit fast at the end**. I **couldn\'t keep up with** the slides." keep up with = theo kịp.',
          },
          {
            q: '"Yeah… that was me." Rhys muốn nói gì?',
            options: ['Anh cũng thấy nhanh', 'Anh là người trình bày bài đó', 'Anh ngồi ở hàng đầu', 'Anh không nghe bài đó'],
            correct: 1,
            why: 'Rhys chính là **diễn giả**. Vì thế Uyên vội xin lỗi: "I didn\'t mean it like that."',
          },
          {
            q: 'Trước khi làm ngành công nghệ, Rhys làm gì?',
            options: ['Kỹ sư phần mềm ở Cardiff', 'Giáo viên vật lý trung học', 'Nhà thiết kế', 'Sinh viên'],
            correct: 1,
            why: '"I **used to teach physics** at a secondary school in Cardiff." used to + V = việc từng làm, nay không còn.',
          },
          {
            q: 'Câu nào của Uyên giữ cho cuộc nói chuyện đi tiếp tốt nhất?',
            options: ['"Every other table\'s full."', '"What made you switch?"', '"I\'m planning to."', '"Nice to meet you."'],
            correct: 1,
            why: 'Rhys vừa nói "I used to teach physics". Uyên **hỏi tiếp đúng chỗ đó**: "What made you switch?" Đây là câu hỏi nối tiếp: nhặt một chi tiết người ta vừa nói rồi hỏi sâu thêm.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Buổi meetup tối: vào một nhóm đang nói dở' },
      {
        t: 'canh',
        anh: ['office-building', 'cup-with-straw', 'woman-office-worker', 'man-office-worker', 'mobile-phone'],
        caption: '7 giờ tối, buổi meetup "Design & Product Night" ở một không gian làm việc chung tại Thảo Điền. **Marisol** (Mỹ) đang nghe **Jake** (Úc) kể về startup của anh. Uyên được chị tổ chức là **Anaya** bảo "qua chào nhóm đó đi".',
      },
      {
        t: 'listen',
        id: 'gtd19-nghe-canh2',
        title: 'Scene 2 — Joining a group',
        note: 'Nghe xem Jake rủ Uyên làm gì, Uyên từ chối thế nào, và Marisol giúp Uyên ra sao.',
        lines: [
          { who: 'Jake', voice: 'au-nam', text: "…so we pivoted twice, and now it's basically a marketplace for dog walkers.", vi: '…thế là bọn anh đổi hướng hai lần, giờ thì về cơ bản nó là một chợ kết nối người dắt chó đi dạo.' },
          { who: 'Marisol', voice: 'us-nu', text: "Huh. And are there enough dog owners in Saigon for that?", vi: 'Ồ. Thế Sài Gòn có đủ người nuôi chó cho việc đó không?' },
          { who: 'Uyên', voice: 'nz-nu', text: "Sorry to jump in. Is this the product and design group? Anaya said I should come and say hi.", vi: 'Xin lỗi chen ngang. Đây có phải nhóm sản phẩm và thiết kế không ạ? Chị Anaya bảo em qua chào mọi người.' },
          { who: 'Marisol', voice: 'us-nu', text: "It is! Come on in. I'm Marisol." },
          { who: 'Jake', voice: 'au-nam', text: "G'day, I'm Jake. So what's your story?", vi: 'Chào, anh là Jake. Thế em làm gì?' },
          { who: 'Uyên', voice: 'nz-nu', text: "I'm a third-year IT student. I'm doing an internship at a software company in District 7.", vi: 'Em là sinh viên IT năm ba. Em đang thực tập ở một công ty phần mềm ở Quận 7.' },
          { who: 'Jake', voice: 'au-nam', text: "Perfect timing! We're looking for interns. It's unpaid for now, but the experience is massive. You'd basically build the whole app.", vi: 'Đúng lúc quá! Bọn anh đang tìm thực tập sinh. Tạm thời chưa có lương, nhưng kinh nghiệm thì khủng lắm. Em gần như dựng cả cái app.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Oh, thanks, that's kind of you. I'm pretty busy with my internship at the moment, though.", vi: 'Ồ, cảm ơn anh, anh tốt quá. Có điều dạo này em khá bận với kỳ thực tập.' },
          { who: 'Jake', voice: 'au-nam', text: "Just have a think about it. Download the app tonight and send me your feedback. I'll text you the link. What's your number?", vi: 'Cứ nghĩ thêm đi. Tối nay tải app về rồi gửi anh góp ý. Anh nhắn link cho. Số em là gì?' },
          { who: 'Marisol', voice: 'us-nu', text: "Jake, I think Anaya's been looking for you. Something about the sponsor slides?", vi: 'Jake, hình như Anaya đang tìm anh. Chuyện slide nhà tài trợ gì đó?' },
          { who: 'Jake', voice: 'au-nam', text: "Oh, right! Back in a sec. Don't go anywhere." },
          { who: 'Marisol', voice: 'us-nu', text: "Sorry about that. He means well, but he asks everyone. You don't owe anyone free work.", vi: 'Xin lỗi em nhé. Anh ấy không có ý xấu, nhưng gặp ai cũng rủ vậy. Em không nợ ai công sức làm không đâu.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Thanks. I honestly didn't know how to say no.", vi: 'Cảm ơn chị. Thật tình em không biết từ chối kiểu gì.' },
          { who: 'Marisol', voice: 'us-nu', text: "You were fine. \"I'm pretty busy at the moment\" is perfect. And you never have to give your number to someone you just met." },
          { who: 'Uyên', voice: 'nz-nu', text: "Good to know. So, how long have you been in Saigon?" },
          { who: 'Marisol', voice: 'us-nu', text: "About two years. I used to design online forms for a bank in San Diego. Forms nobody wanted to fill in.", vi: 'Khoảng hai năm. Trước chị từng thiết kế biểu mẫu trực tuyến cho một ngân hàng ở San Diego. Toàn biểu mẫu chẳng ai muốn điền.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Ha! So how did you end up here?", vi: 'Ha! Thế sao chị lại dạt về đây?' },
          { who: 'Marisol', voice: 'us-nu', text: "I didn't use to travel at all, actually. Then I came for a friend's wedding in Đà Lạt, and I just… never really went home.", vi: 'Thật ra hồi trước chị chẳng đi đâu cả. Rồi chị sang dự đám cưới một người bạn ở Đà Lạt, và cứ thế… không về nữa.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Wow. What's it like, working as a designer here?", vi: 'Ồ. Làm thiết kế ở đây thì thế nào ạ?' },
          { who: 'Marisol', voice: 'us-nu', text: "Faster. Teams here ship things in weeks, not months. That's why I stayed, I think.", vi: 'Nhanh hơn. Các nhóm ở đây ra sản phẩm tính bằng tuần, không phải tháng. Chắc vì thế mà chị ở lại.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd19-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Uyên vào nhóm đang nói chuyện bằng cách nào?',
            options: ['Đứng im chờ người ta hỏi', 'Xin lỗi chen ngang, hỏi đúng nhóm, nêu tên người giới thiệu mình', 'Chen vào kể chuyện của mình', 'Đưa danh thiếp trước'],
            correct: 1,
            why: '"**Sorry to jump in.** Is this the product and design group? **Anaya said I should come and say hi.**" Nhắc tên người giới thiệu làm nhóm mở ra nhanh hơn.',
          },
          {
            q: 'Jake mời Uyên điều gì?',
            options: ['Làm thực tập sinh có lương', 'Làm thực tập không lương cho startup của anh', 'Đi uống nước sau buổi gặp', 'Thuyết trình ở buổi meetup'],
            correct: 1,
            why: '"We\'re looking for interns. **It\'s unpaid for now**…" unpaid = không lương.',
          },
          {
            q: '"Jake, I think Anaya\'s been looking for you." Marisol nói câu này để làm gì?',
            options: ['Báo tin thật, không có ý gì khác', 'Khéo léo kéo Jake ra để Uyên khỏi bị ép', 'Muốn Jake rời buổi gặp', 'Giới thiệu Anaya với Uyên'],
            correct: 1,
            why: 'Ngay sau đó Marisol nói nhỏ "Sorry about that. He means well, but he asks everyone." Đó là cách **cứu người khác** khỏi một cuộc nói chuyện khó.',
          },
          {
            q: 'Vì sao Marisol ở lại Việt Nam?',
            options: ['Công ty cử sang', 'Cưới chồng người Việt', 'Sang dự đám cưới bạn, rồi thích nhịp làm việc nhanh ở đây', 'Ngân hàng cũ chuyển văn phòng sang'],
            correct: 2,
            why: '"I came for a friend\'s wedding in Đà Lạt, and I just… never really went home." và "Teams here ship things in weeks, not months. **That\'s why** I stayed."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Cuối buổi: giới thiệu hai người, xin liên lạc, chào về' },
      {
        t: 'canh',
        anh: ['handshake', 'man-teacher', 'woman-office-worker', 'mobile-phone', 'link'],
        caption: '9 giờ tối. Uyên gặp lại **Rhys** khi đang đứng với Marisol. Uyên phải đi về vì sáng mai còn đi làm sớm, nhưng muốn **giữ liên lạc** với cả hai.',
      },
      {
        t: 'listen',
        id: 'gtd19-nghe-canh3',
        title: 'Scene 3 — Leaving well',
        note: 'Nghe xem Uyên giới thiệu hai người thế nào, vì sao mã QR không dùng được, và Rhys dặn Uyên điều gì.',
        lines: [
          { who: 'Rhys', voice: 'uk-nam', text: "There she is, my toughest critic!", vi: 'Cô ấy đây rồi, nhà phê bình khó tính nhất của tôi!' },
          { who: 'Uyên', voice: 'nz-nu', text: "Oh no, you remembered. Rhys, this is Marisol. She's a product designer here in Saigon. Marisol, Rhys gave the accessibility talk this morning.", vi: 'Ôi không, anh vẫn nhớ. Anh Rhys, đây là chị Marisol, nhà thiết kế sản phẩm ở Sài Gòn. Chị Marisol, anh Rhys là người trình bày bài về khả năng tiếp cận sáng nay.' },
          { who: 'Marisol', voice: 'us-nu', text: "The one with the screen reader demo? My whole team was talking about it at lunch." },
          { who: 'Rhys', voice: 'uk-nam', text: "Good things, I hope." },
          { who: 'Marisol', voice: 'us-nu', text: "Mostly. Someone said you used to be a teacher. It shows.", vi: 'Phần lớn là tốt. Có người bảo anh từng là giáo viên. Nhìn là biết.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Actually, you two should talk. Marisol's team is making their app easier for older users.", vi: 'À, hai người nên nói chuyện với nhau. Nhóm của chị Marisol đang làm app của họ dễ dùng hơn cho người lớn tuổi.' },
          { who: 'Rhys', voice: 'uk-nam', text: "Really? I'd love to hear about that." },
          { who: 'Marisol', voice: 'us-nu', text: "Let's grab a drink in a minute. Uyên, are you heading off?", vi: 'Lát nữa mình đi lấy đồ uống nhé. Uyên, em về à?' },
          { who: 'Uyên', voice: 'nz-nu', text: "Yeah, I should get going. I've got an early start tomorrow. Would you mind if I connected with you on LinkedIn?", vi: 'Vâng, em phải về rồi. Mai em đi làm sớm. Chị có phiền không nếu em kết nối với chị trên LinkedIn?' },
          { who: 'Marisol', voice: 'us-nu', text: "Of course not. Here, scan this." },
          { who: 'Uyên', voice: 'nz-nu', text: "Hmm, it's not loading. I think the Wi-Fi's given up.", vi: 'Ừm, nó không tải được. Chắc Wi-Fi chịu thua rồi.' },
          { who: 'Marisol', voice: 'us-nu', text: "Just search for Marisol Reyes, R-E-Y-E-S. And add a note saying where we met. I get a lot of random requests.", vi: 'Em cứ tìm Marisol Reyes, R-E-Y-E-S. Và thêm một lời nhắn nói mình gặp nhau ở đâu. Chị nhận nhiều lời mời lạ lắm.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Will do. Rhys, could I message you too? I'd love to ask you a couple of questions about accessibility testing.", vi: 'Em sẽ làm vậy. Anh Rhys, em nhắn cho anh được không? Em muốn hỏi anh vài câu về kiểm thử khả năng tiếp cận.' },
          { who: 'Rhys', voice: 'uk-nam', text: "Absolutely. I'm Rhys Pritchard. But message me before Sunday. Once I'm in Singapore, I'm hopeless at replying.", vi: 'Được chứ. Anh là Rhys Pritchard. Nhưng nhắn trước Chủ nhật nhé. Sang Singapore rồi là anh trả lời tin nhắn tệ lắm.' },
          { who: 'Uyên', voice: 'nz-nu', text: "Got it. It was really great talking to you both." },
          { who: 'Marisol', voice: 'us-nu', text: "You too. Good luck with the internship. And remember: \"pretty busy at the moment\"!" },
          { who: 'Rhys', voice: 'uk-nam', text: "Thanks for the honest feedback. I mean it. Get home safe.", vi: 'Cảm ơn em đã góp ý thật lòng. Anh nói thật đấy. Về nhà an toàn nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd19-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Khi giới thiệu hai người, Uyên nói thêm gì sau tên mỗi người?',
            options: ['Tuổi của họ', 'Một chi tiết giúp hai người có chuyện để nói (nghề, bài nói sáng nay)', 'Số điện thoại của họ', 'Không nói gì thêm'],
            correct: 1,
            why: '"She\'s **a product designer here in Saigon**." · "Rhys **gave the accessibility talk** this morning." Thêm một chi tiết là hai người có ngay chuyện để nói.',
          },
          {
            q: 'Vì sao Uyên không quét được mã QR?',
            options: ['Điện thoại hết pin', 'Wi-Fi không tải được', 'Marisol không dùng LinkedIn', 'Mã QR sai'],
            correct: 1,
            why: '"It\'s not loading. I think **the Wi-Fi\'s given up**." give up = bỏ cuộc, ở đây nói vui là mạng "chịu thua".',
          },
          {
            q: 'Marisol dặn Uyên làm gì khi gửi lời mời kết nối?',
            options: ['Gửi kèm CV', 'Thêm lời nhắn nói hai người gặp nhau ở đâu', 'Gửi trong tuần sau', 'Gọi điện trước'],
            correct: 1,
            why: '"**Add a note saying where we met.** I get a lot of random requests." Bài Đọc hôm nay dạy viết lời nhắn này.',
          },
          {
            q: 'Vì sao Rhys bảo Uyên nhắn trước Chủ nhật?',
            options: ['Chủ nhật anh nghỉ việc', 'Sau đó anh sang Singapore và hay quên trả lời tin', 'Chủ nhật hội thảo đóng cửa', 'Anh sẽ đổi tài khoản'],
            correct: 1,
            why: '"**Once I\'m in Singapore, I\'m hopeless at replying.**" hopeless at + V-ing = rất tệ khoản gì đó.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Các câu dưới đây nói ở tốc độ thật. Chú ý từ nhỏ bị nuốt (**to**, **you**, **it**), dạng rút gọn (**table\'s**, **Wi-Fi\'s**) và **used to** đọc liền như "yus-tơ".',
      },
      {
        t: 'dictation',
        id: 'gtd19-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — xin đứng cùng bàn', spell: 'Mind if I join you?', answer: 'Mind if I join you?' },
          { label: 'Câu 2 — hỏi cảm nhận', spell: 'What did you make of the morning sessions?', answer: 'What did you make of the morning sessions?' },
          { label: 'Câu 3 — nghề cũ (Cardiff)', spell: 'I used to teach physics in Cardiff.', answer: 'I used to teach physics in Cardiff.' },
          { label: 'Câu 4 — câu hỏi nối tiếp', spell: 'What made you switch?', answer: 'What made you switch?' },
          { label: 'Câu 5 — vào nhóm', spell: 'Sorry to jump in.', answer: 'Sorry to jump in.' },
          { label: 'Câu 6 — xin kết nối', spell: 'Would you mind if I connected with you on LinkedIn?', answer: 'Would you mind if I connected with you on LinkedIn?' },
          { label: 'Câu 7 — chào ra về', spell: "I should get going. I've got an early start tomorrow.", answer: "I should get going. I've got an early start tomorrow.", alt: ["I should get going, I've got an early start tomorrow.", 'I should get going. I have got an early start tomorrow.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Mind if I join you? — **Not at all.**', '"Not at all" = **không phiền gì cả**, tức là ĐƯỢC. Người Việt hay nghe nhầm thành "không".', 'Thanks! (rồi đứng vào)'],
          ['What did you make of…?', 'Bạn thấy … thế nào? (hỏi ý kiến, không phải hỏi "làm ra gì")', 'I really liked… / It was interesting, but…'],
          ["So what's your story?", 'Kể về bạn đi (làm gì, sao lại ở đây). Rất hay nghe ở Úc, Mỹ.', "I'm a… I'm here because…"],
          ['Lesson learned.', 'Tôi rút kinh nghiệm rồi. Tự nhận lỗi nhẹ nhàng.', '(cười) It happens!'],
          ['He means well.', 'Anh ấy không có ý xấu (dù cách làm hơi phiền).', 'No worries. / I could tell.'],
          ['Are you heading off?', 'Bạn về à? Hỏi để chào, không phải đuổi.', 'Yeah, I should get going.'],
          ["Let's grab a drink / coffee sometime.", '**Có thể** chỉ là lời chào lịch sự. Muốn thành thật thì hẹn ngày cụ thể trong vài hôm.', 'I\'d like that. Are you free next week?'],
          ['I\'ll let you go. / I\'ll let you mingle.', 'Tôi không giữ bạn nữa (= tôi kết thúc cuộc nói chuyện, rất lịch sự).', 'Great talking to you!'],
        ],
        caption: 'Ở buổi networking, câu kết thúc thường **không có chữ "goodbye"**. Nghe ra "I\'ll let you…", "I should get going", "Are you heading off?" là biết cuộc nói chuyện sắp đóng lại.',
      },
      {
        t: 'note',
        title: 'Mẹo: phòng ồn quá, không nghe kịp thì làm gì',
        items: [
          'Meetup và giờ giải lao là chỗ **khó nghe nhất**: nhạc, tiếng cốc, mười cuộc nói chuyện cùng lúc. Người bản xứ cũng nghe sót, nên đừng xấu hổ.',
          '**Đổi chỗ**: "It\'s a bit loud here. Shall we move over there?" (Ở đây hơi ồn. Mình ra đằng kia nhé?) Câu này còn làm cuộc nói chuyện riêng tư hơn.',
          '**Nhắc lại đúng từ khoá** với giọng lên như câu hỏi: "Cardiff?" · "Dog walkers?" Người kia sẽ tự nói lại và giải thích thêm.',
          '**Đứng chếch 45°**, không đứng đối diện thẳng: tai bạn gần miệng người nói hơn mà không sát mặt họ.',
          'Đừng **gật đầu cười trừ** khi chưa hiểu. Ở buổi networking, gật nhầm một câu hỏi "Would you like to join us?" là bạn vừa nhận lời một việc mà không biết.',
          'Tên riêng, tên công ty nghe không rõ: "Sorry, it\'s so loud. What was the name of your company again?" Thêm **again** để nghe tự nhiên.',
          'Nghe "**District 7**", "**District 3**": từ 7/2025 TP.HCM không còn cấp quận (các quận cũ nay chia thành phường mới), nhưng khi nói chuyện mọi người vẫn dùng tên quận cũ để chỉ **khu vực**. Ghi địa chỉ thì theo tên phường mới.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Buổi gặp sau giờ làm', 'after-work drinks', 'happy hour', 'after-work drinks · Friday drinks'],
          ['Hỏi "bạn làm gì?" thân mật', 'So what do you do?', "So what's your story?", "So what's your story? · What do you do, mate?"],
          ['Đại học', 'uni', 'college · school', 'uni'],
          ['Hồ sơ xin việc', 'CV', 'résumé', 'CV · résumé'],
          ['Khen một bài nói', 'Brilliant talk!', 'Awesome talk!', 'Great talk, mate!'],
          ['Chào ra về', 'Cheers, see you!', 'Take care! · Good meeting you!', 'Catch you later! · See ya!'],
          ['Hiểu rồi', 'Fair enough.', 'Makes sense.', 'Fair enough. · Too easy.'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc trong lời networking. "**Too easy**" ở Úc nghĩa là "được thôi, không vấn đề", không phải "quá dễ".',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-se-a2-01 · Hi, I\'m a Developer** — Minh lần đầu đi meetup dân công nghệ, tự giới thiệu cơ bản. Nghe lại để thấy mình đã đi xa thế nào: hôm nay bạn không chỉ giới thiệu mà còn giữ chuyện và xin liên lạc.',
          '**en-b1-03 · A Friend I Have Never Met** — một tình bạn quen qua mạng sắp gặp ngoài đời; nhiều câu "We met online…", "Where you met doesn\'t matter".',
          '**en-ds-c1-01 · What They Say vs. What They Mean** — mức C1, nghe thử: lời nói ngầm của người Anh và người Úc, rất hợp với bảng "Họ nói vậy nghĩa là gì" ở trên.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd19-noi',
    kind: 'speaking',
    title: 'Mở lời, giữ chuyện, xin liên lạc, chào ra về',
    goal: 'Tự bắt chuyện với người lạ ở hội thảo, giữ cuộc nói chuyện 5 phút bằng câu hỏi nối tiếp, kể chuyện cũ của mình bằng used to, xin liên lạc tự nhiên và kết thúc lịch sự.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** chia theo đúng 5 bước của một cuộc networking: mở lời → hỏi mở → hỏi nối tiếp → xin liên lạc → chào ra về.',
          'Ngữ pháp: **used to + V** (việc từng làm, nay hết) và cách đặt **câu hỏi nối tiếp** từ câu người ta vừa nói.',
          'Nối câu: **but now · these days · that\'s why** để đặt "hồi trước" cạnh "bây giờ".',
          'Ngôn ngữ cơ thể ở buổi đứng: cầm cốc tay nào, đứng thế nào để người khác vào được nhóm, nhìn đi đâu khi nói.',
          'Nối lại Ngày 13 (câu hỏi làm quen ở công ty) và Ngày 14 (small talk): hôm nay là người **lạ hoàn toàn**, không có đồng nghiệp chung để bám vào.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo thứ tự 5 bước. Mỗi câu đều nói nguyên được. Bấm loa, nói to theo, rồi **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Mind if I join you?', pos: 'phr', ipa: '/ˈmaɪnd ɪf aɪ ˈdʒɔɪn ju/', vi: 'Tôi đứng / ngồi cùng được không?', ex: "Hi, mind if I join you? Every other table's full.", exVi: 'Chào, mình đứng cùng được không? Bàn nào cũng kín rồi.', more: 'Đáp ĐỒNG Ý là **Not at all / Go ahead**. Câu đầy đủ: Do you mind if I join you?', anh: 'person-raising-hand' },
          { w: 'Is this the … group?', pos: 'phr', ipa: '/ɪz ðɪs ðə … ɡruːp/', vi: 'Đây có phải nhóm … không?', ex: 'Sorry to jump in. Is this the product and design group?', exVi: 'Xin lỗi chen ngang. Đây có phải nhóm sản phẩm và thiết kế không?' },
          { w: 'Sorry to jump in.', pos: 'phr', ipa: '/ˈsɑːri tə ˈdʒʌmp ɪn/', vi: 'Xin lỗi chen ngang. (vào một nhóm đang nói)', ex: "Sorry to jump in. Anaya said I should come and say hi.", exVi: 'Xin lỗi chen ngang. Chị Anaya bảo em qua chào mọi người.', more: 'Chờ một quãng ngắt rồi mới nói. Đừng cắt giữa câu của người khác.' },
          { w: 'What brings you here?', pos: 'phr', ipa: '/ˈwʌt ˈbrɪŋz ju hɪr/', vi: 'Điều gì đưa bạn tới đây?', ex: 'So, what brings you here tonight?', exVi: 'Thế điều gì đưa bạn tới đây tối nay?', more: 'Câu mở chuyện an toàn nhất ở mọi sự kiện.' },
          { w: 'How did you hear about this event?', pos: 'phr', ipa: '/ˈhaʊ dɪd ju ˈhɪr əbaʊt ðɪs ɪˈvent/', vi: 'Bạn biết sự kiện này qua đâu?', ex: 'How did you hear about this event? A friend told me.', exVi: 'Bạn biết sự kiện này qua đâu? Một người bạn kể với mình.' },
          { w: 'What did you make of…?', pos: 'phr', ipa: '/ˈwʌt dɪd ju ˈmeɪk əv/', vi: 'Bạn thấy … thế nào?', ex: 'What did you make of the keynote?', exVi: 'Bạn thấy bài phát biểu chính thế nào?', more: 'Nói chuyện về **thứ cả hai vừa cùng nghe** là cách mở lời dễ nhất. Khen trước, góp ý sau, và nhớ: người đứng cạnh bạn có thể là diễn giả.' },
          { w: 'Have you always worked in…?', pos: 'phr', ipa: '/həv ju ˈɔːlweɪz ˈwɝːkt ɪn/', vi: 'Bạn làm ngành … từ đầu à?', ex: 'Have you always worked in tech?', exVi: 'Bạn làm ngành công nghệ từ đầu à?', more: 'Câu mở cửa cho người kia kể chuyện cũ: "No, I used to…"' },
          { w: 'I used to…', pos: 'phr', ipa: '/aɪ ˈjuːs tə/', vi: 'Trước đây tôi từng… (giờ không còn)', ex: 'I used to teach physics in Cardiff.', exVi: 'Trước tôi từng dạy vật lý ở Cardiff.', more: '**used to** đọc /ˈjuːs tə/ với âm /s/, không phải /z/.' },
          { w: 'What made you switch?', pos: 'phr', ipa: '/ˈwʌt ˈmeɪd ju ˈswɪtʃ/', vi: 'Điều gì khiến bạn chuyển (nghề, hướng)?', ex: 'You used to be a teacher? What made you switch?', exVi: 'Anh từng là giáo viên à? Điều gì khiến anh chuyển nghề?' },
          { w: 'How did you end up…?', pos: 'phr', ipa: '/ˈhaʊ dɪd ju ˌend ˈʌp/', vi: 'Sao bạn lại (dạt / tới) …?', ex: 'So how did you end up in Saigon?', exVi: 'Thế sao chị lại tới Sài Gòn?', more: 'Mềm hơn "Why are you in Vietnam?", không nghe như tra hỏi.' },
          { w: 'Do you ever miss it?', pos: 'phr', ipa: '/də ju ˈevər ˈmɪs ɪt/', vi: 'Bạn có bao giờ nhớ (nó) không?', ex: 'You used to live in San Diego. Do you ever miss it?', exVi: 'Chị từng sống ở San Diego. Chị có bao giờ nhớ không?' },
          { w: "What's that like?", pos: 'phr', ipa: '/ˈwʌts ðæt ˈlaɪk/', vi: 'Việc đó thế nào? (kể thêm đi)', ex: "You work with Korean clients? What's that like?", exVi: 'Bạn làm với khách Hàn à? Thế nào?', more: 'Câu hỏi nối tiếp đa năng nhất: hỏi sau **mọi** thông tin mới.' },
          { w: 'How come?', pos: 'phr', ipa: '/ˌhaʊ ˈkʌm/', vi: 'Sao thế? / Vì sao vậy? (thân mật)', ex: "I didn't use to travel at all. — Really? How come?", exVi: 'Trước mình chẳng đi đâu cả. — Thật à? Sao thế?', more: 'Sau How come, câu KHÔNG đảo: How come **you left**? (không phải "How come did you leave?")' },
          { w: 'That makes sense.', pos: 'phr', ipa: '/ˈðæt ˌmeɪks ˈsens/', vi: 'Nghe hợp lý đấy. / Thảo nào.', ex: 'I liked building apps more than marking. — That makes sense.', exVi: 'Tôi thích làm app hơn chấm bài. — Thảo nào.' },
          { w: 'So what are you working on at the moment?', pos: 'phr', ipa: '/soʊ ˈwʌt ər ju ˈwɝːkɪŋ ɑːn æt ðə ˈmoʊmənt/', vi: 'Thế dạo này bạn đang làm gì?', ex: 'So what are you working on at the moment? Anything exciting?', exVi: 'Thế dạo này bạn đang làm gì? Có gì hay không?' },
          { w: "I'm pretty busy at the moment, though.", pos: 'phr', ipa: '/aɪm ˈprɪti ˈbɪzi æt ðə ˈmoʊmənt ðoʊ/', vi: 'Có điều dạo này tôi khá bận. (từ chối mềm)', ex: "Thanks, that's kind of you. I'm pretty busy at the moment, though.", exVi: 'Cảm ơn, anh tốt quá. Có điều dạo này em khá bận.', more: '**though** đặt cuối câu = "có điều, nhưng mà". Câu từ chối nghe nhẹ hẳn.' },
          { w: 'Have you two met?', pos: 'phr', ipa: '/həv ju ˈtuː ˈmet/', vi: 'Hai người gặp nhau chưa?', ex: 'Have you two met? Rhys, this is Marisol.', exVi: 'Hai người gặp nhau chưa? Anh Rhys, đây là chị Marisol.' },
          { w: 'You two should talk.', pos: 'phr', ipa: '/ju ˈtuː ʃʊd ˈtɔːk/', vi: 'Hai người nên nói chuyện với nhau.', ex: "Actually, you two should talk. You're both into accessibility.", exVi: 'À, hai người nên nói chuyện. Cả hai đều mê mảng khả năng tiếp cận.', more: 'Người biết **nối người với người** là người được nhớ lâu nhất ở buổi networking.' },
          { w: 'Would you mind if I connected with you on LinkedIn?', pos: 'phr', ipa: '/wʊd ju ˈmaɪnd ɪf aɪ kəˈnektɪd wɪð ju ɑːn ˈlɪŋktɪn/', vi: 'Bạn có phiền không nếu tôi kết nối với bạn trên LinkedIn?', ex: 'It was great talking to you. Would you mind if I connected with you on LinkedIn?', exVi: 'Nói chuyện với chị vui quá. Chị có phiền không nếu em kết nối với chị trên LinkedIn?', more: 'Ngắn hơn: **Are you on LinkedIn?** Đáp đồng ý: **Of course not / Not at all / Sure.**', anh: 'link' },
          { w: "What's the best way to reach you?", pos: 'phr', ipa: '/ˈwʌts ðə ˈbest weɪ tə ˈriːtʃ ju/', vi: 'Liên lạc với bạn cách nào tiện nhất?', ex: "I'd love to stay in touch. What's the best way to reach you?", exVi: 'Mình muốn giữ liên lạc. Liên lạc với bạn cách nào tiện nhất?', more: 'Để người kia **tự chọn** kênh: email, LinkedIn hay chat. Lịch sự hơn xin thẳng số điện thoại.' },
          { w: 'Could I message you about…?', pos: 'phr', ipa: '/kʊd aɪ ˈmesɪdʒ ju əbaʊt/', vi: 'Tôi nhắn bạn về … được không?', ex: 'Could I message you about accessibility testing?', exVi: 'Em nhắn anh về kiểm thử khả năng tiếp cận được không?' },
          { w: 'Let me scan your QR code.', pos: 'phr', ipa: '/let mi ˈskæn jər ˌkjuː ˈɑːr koʊd/', vi: 'Để tôi quét mã QR của bạn.', ex: "Let me scan your QR code. Hmm, it's not loading.", exVi: 'Để mình quét mã QR của bạn. Ừm, nó không tải.', anh: 'mobile-phone' },
          { w: "I'll send you a note.", pos: 'phr', ipa: '/aɪl ˈsend ju ə ˈnoʊt/', vi: 'Tôi sẽ gửi bạn một lời nhắn (kèm lời mời).', ex: "I'll send you a note so you know who I am.", exVi: 'Mình sẽ gửi kèm lời nhắn để bạn biết mình là ai.' },
          { w: 'I should get going.', pos: 'phr', ipa: '/aɪ ʃʊd ˌɡet ˈɡoʊɪŋ/', vi: 'Tôi phải đi rồi.', ex: "I should get going. I've got an early start tomorrow.", exVi: 'Mình phải về rồi. Mai mình đi sớm.' },
          { w: "I'll let you mingle.", pos: 'phr', ipa: '/aɪl ˈlet ju ˈmɪŋɡl/', vi: 'Tôi không giữ bạn nữa, bạn đi gặp mọi người nhé.', ex: "Anyway, I'll let you mingle. Great talking to you!", exVi: 'Thôi, mình không giữ bạn nữa. Nói chuyện vui lắm!', more: '**mingle** = đi chào người này người kia trong một buổi gặp. Câu thoát chuyện lịch sự nhất.' },
          { w: 'Would you excuse me?', pos: 'phr', ipa: '/wʊd ju ɪkˈskjuːz mi/', vi: 'Xin phép tôi đi một chút nhé?', ex: 'Would you excuse me? I promised to say hi to someone.', exVi: 'Xin phép mình nhé? Mình hứa qua chào một người.' },
          { w: 'It was really great talking to you.', pos: 'phr', ipa: '/ɪt wəz ˈrɪəli ˈɡreɪt ˈtɔːkɪŋ tə ju/', vi: 'Nói chuyện với bạn thật sự rất vui.', ex: 'It was really great talking to you both.', exVi: 'Nói chuyện với hai người thật sự rất vui.', more: 'Lần đầu gặp: It was nice **meeting** you (Ngày 1). Đã nói chuyện lâu: great **talking** to you.' },
          { w: "Let's keep in touch.", pos: 'phr', ipa: '/lets ˌkiːp ɪn ˈtʌtʃ/', vi: 'Giữ liên lạc nhé.', ex: "Let's keep in touch. I'll message you this week.", exVi: 'Giữ liên lạc nhé. Tuần này mình nhắn bạn.', more: 'Câu này chỉ thành thật khi **bạn làm thật**: nhắn trong 24–48 giờ.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Meetup buổi tối thường thân mật. Hội thảo ban ngày, nói với diễn giả hay giám đốc một công ty thì lên một mức. Không chắc thì dùng cột **giữa**.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (meetup, bạn cùng tuổi)', 'Trung tính (người mới gặp)', 'Trang trọng (diễn giả, sếp lớn)'],
        rows: [
          ['Xin vào cùng', 'Room for one more?', 'Mind if I join you?', 'Do you mind if I join you for a moment?'],
          ['Mở chuyện', "So what's your story?", 'What brings you here?', 'May I ask what brings you to the conference?'],
          ['Khen bài nói', 'Loved your talk!', 'I really enjoyed your talk.', 'Thank you for your talk. I found it very useful.'],
          ['Hỏi nối tiếp', 'How come?', 'What made you switch?', 'If you don\'t mind me asking, what led you to make the change?'],
          ['Xin liên lạc', 'You on LinkedIn?', 'Would you mind if I connected with you on LinkedIn?', "Would it be all right if I contacted you by email with a few questions?"],
          ['Thoát chuyện', "Gonna grab another drink. Catch you later!", "I'll let you mingle. Great talking to you!", 'I won\'t take up any more of your time. Thank you so much.'],
          ['Chào về', 'See ya!', "I should get going. Let's keep in touch.", 'It was a pleasure speaking with you. I hope to see you again.'],
        ],
        caption: 'Với diễn giả, một câu **cảm ơn cụ thể** ("I found the screen reader demo very useful") đáng giá hơn mười câu "Great talk!".',
      },
      {
        t: 'note',
        title: 'Mẹo: câu hỏi nối tiếp = nghe một chi tiết, hỏi sâu thêm',
        items: [
          'Cuộc nói chuyện chết khi bạn hỏi **danh sách** (Where are you from? What do you do? What\'s your hobby?) như điền phiếu. Nó sống khi bạn **bám vào câu vừa nghe**.',
          'Công thức 3 bước: **nghe từ khoá** ("I used to teach") → **phản ứng ngắn** ("Really?") → **hỏi sâu** ("What made you switch?").',
          'Năm câu hỏi nối tiếp dùng được với gần như mọi câu: **What\'s that like? · How come? · What made you…? · How did you end up…? · Do you ever miss it?**',
          'Sau 2–3 câu hỏi, **kể lại một chút về mình** cho cân ("I used to think Saigon was too noisy, but now I love it."). Hỏi mãi mà không kể thì giống phỏng vấn.',
          'Mỗi cuộc nói chuyện ở meetup chỉ cần **5–10 phút**. Đứng 40 phút với một người là bạn đang giữ họ lại.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt nói "**hồi trước** mình **hay** đi…", "**trước đây** chị **từng** làm…". Tiếng Anh gói cả "hồi trước" lẫn "giờ không còn" vào hai chữ: **used to**. Sau used to luôn là **động từ nguyên mẫu**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + used to + V (nguyên mẫu)',
            vi: 'Thói quen hoặc trạng thái **trong quá khứ**, nay không còn.',
            examples: [
              { en: 'I used to teach physics in Cardiff.', vi: 'Trước anh từng dạy vật lý ở Cardiff.' },
              { en: 'She used to design forms for a bank.', vi: 'Trước chị ấy từng thiết kế biểu mẫu cho một ngân hàng.' },
              { en: 'I used to think Saigon was too noisy.', vi: 'Hồi trước mình cứ nghĩ Sài Gòn ồn quá.' },
            ],
          },
          {
            formula: "S + didn't use to + V",
            vi: 'Phủ định: hồi trước KHÔNG như vậy (giờ thì có). Có **did** thì bỏ **d** ở use.',
            examples: [
              { en: "I didn't use to travel at all.", vi: 'Hồi trước chị chẳng đi đâu cả.' },
              { en: "He didn't use to give talks.", vi: 'Trước anh ấy không đi nói chuyện bao giờ.' },
              { en: "We didn't use to have meetups in my town.", vi: 'Hồi trước quê mình không có buổi meetup nào.' },
            ],
          },
          {
            formula: 'Did + S + use to + V?',
            vi: 'Câu hỏi về thói quen ngày trước.',
            examples: [
              { en: 'Did you use to code as a teacher?', vi: 'Hồi làm giáo viên anh có viết code không?' },
              { en: 'Did you use to live near the beach?', vi: 'Hồi trước chị có sống gần biển không?' },
              { en: 'Where did you use to work?', vi: 'Trước đây bạn làm ở đâu?' },
            ],
          },
          {
            formula: 'What made you + V? · How did you end up + V-ing / ở đâu?',
            vi: 'Câu hỏi nối tiếp hỏi **lý do** và **con đường**, mềm hơn "Why…?".',
            examples: [
              { en: 'What made you switch?', vi: 'Điều gì khiến anh chuyển nghề?' },
              { en: 'What made you choose Vietnam?', vi: 'Điều gì khiến chị chọn Việt Nam?' },
              { en: 'How did you end up working in design?', vi: 'Sao chị lại thành ra làm thiết kế?' },
            ],
          },
          {
            formula: 'Từ khoá nhắc lại + ? → What\'s that like? / How come?',
            vi: 'Phản ứng ngắn rồi hỏi sâu, giữ chuyện không đứt.',
            examples: [
              { en: "Physics? What's that like, switching to tech?", vi: 'Vật lý à? Chuyển sang công nghệ thì thế nào?' },
              { en: 'Two years? How come you stayed?', vi: 'Hai năm à? Sao chị lại ở lại?' },
              { en: 'Forty slides? How did that happen?', vi: 'Bốn mươi slide á? Sao lại thế?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu', 'Nghĩa', 'Còn đúng bây giờ?'],
        rows: [
          ['I **used to** work at a bank.', 'Trước tôi từng làm ở ngân hàng.', '**Không**: giờ không làm nữa.'],
          ['I **usually** work from home on Fridays.', 'Tôi thường làm ở nhà vào thứ Sáu.', '**Có**: thói quen hiện tại.'],
          ["I'm **used to** working late.", 'Tôi **đã quen** với việc làm muộn.', '**Có**: be used to + **V-ing** = đã quen.'],
          ["I'm **getting used to** the traffic.", 'Tôi **đang dần quen** với giao thông.', 'Đang trong quá trình quen.'],
        ],
        caption: 'Ba từ người Việt hay lẫn. "Thường" ở hiện tại là **usually**, không phải used to. Ngày 12 bạn đã nghe "I\'m used to it" (đã quen rồi): đó là nghĩa thứ ba.',
      },
      {
        t: 'sodo',
        kind: 'timeline',
        title: 'used to nằm ở đâu trên trục thời gian?',
        caption: 'Đoạn có dấu × là **thói quen lặp lại** đã kết thúc trước bây giờ. Điểm ở giữa là lúc đổi. Từ đó tới nay dùng thì hiện tại (these days, now).',
        marks: [
          { from: -9, to: -4, kieu: 'lap', label: '① Rhys **used to teach** physics (8 năm, ngày nào cũng dạy).', mau: 1 },
          { from: -4, kieu: 'diem', label: '② He **switched** to tech. (quá khứ đơn: một lần)', mau: 2 },
          { from: -4, to: 0, kieu: 'doan', label: '③ **These days** he **gives** talks. (hiện tại)', mau: 3 },
        ],
      },
      {
        t: 'rule',
        formula: "S + used to + V · S + didn't use to + V · Did + S + use to + V?",
        vi: 'used to = hồi trước (thường) như vậy, giờ thì không. Sau used to là động từ nguyên mẫu. Phủ định và câu hỏi có did thì viết use to, không có d.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: but now · these days · that\'s why',
        items: [
          'used to chỉ kể **nửa câu chuyện** (hồi trước). Nửa kia là **bây giờ**, nối bằng **but now** hoặc **these days**: "I used to think Saigon was too noisy, **but now** I love it."',
          '**these days** = dạo này, thời nay. Đặt đầu hoặc cuối câu: "**These days** I work in product." · "I give talks **these days**."',
          '**That\'s why** + câu = vì thế mà… Dùng để nói lý do của điều vừa kể: "Teams here move fast. **That\'s why** I stayed."',
          'Một câu chuyện đổi nghề 3 nhịp: **I used to…, but now… That\'s why…** Thử với chính bạn: "I used to hate speaking English, but these days I practise every day. That\'s why I came tonight."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd19-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "used to + V · didn't use to + V · What made you + V? · but now / these days / that's why",
        items: [
          { q: 'Trước đây mình từng sống ở Quy Nhơn.', hint: 'used to, live', answers: ['I used to live in Quy Nhon.', 'I used to live in Quy Nhơn.'] },
          { q: 'Hồi trước mình không thích nói tiếng Anh, nhưng giờ thì thích rồi.', hint: "didn't use to, but now", answers: ["I didn't use to like speaking English, but now I do.", "I didn't use to like speaking English, but now I like it.", "I didn't use to like speaking English but now I do.", "I didn't use to enjoy speaking English, but now I do.", "I didn't use to like speaking English, but now I love it."] },
          { q: 'Điều gì khiến chị chọn Việt Nam?', hint: 'what made you', answers: ['What made you choose Vietnam?'] },
          { q: 'Hồi trước anh có viết code không?', hint: 'did you use to', answers: ['Did you use to code?', 'Did you use to write code?', 'Did you use to write code before?', 'Did you use to code before?'] },
          { q: 'Ở đây mọi người làm nhanh lắm. Vì thế mà chị ở lại.', hint: "fast, that's why", answers: ["People here work really fast. That's why I stayed.", "People work really fast here. That's why I stayed.", "Everyone here works really fast. That's why I stayed.", "People here work very fast. That's why I stayed.", "Teams here work really fast. That's why I stayed."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi networking',
        items: [
          '~~I used to go to the gym.~~ (ý: bây giờ vẫn đi đều) → **I usually go to the gym.** Chữ "thường" trong tiếng Việt dịch thành used to là sai nghĩa: người nghe hiểu là bạn **đã bỏ** tập.',
          '~~I\'m used to wake up early.~~ → **I used to wake up early.** (hồi trước) hoặc **I\'m used to waking up early.** (đã quen). Có **be** thì sau đó là **V-ing**.',
          '~~Did you used to live here?~~ → **Did you use to live here?** Có did rồi thì use không thêm d (giống "Did you went" là sai).',
          '~~Can you introduce yourself?~~ (với người lạ ở meetup) → **So, what brings you here?** Câu đầu nghe như phỏng vấn xin việc, người kia sẽ lúng túng.',
          '~~What is your company?~~ → **Who do you work for?** hoặc **Where do you work?** Câu sai nghe như hỏi "công ty của anh là cái gì".',
          '~~Oh. And what is your hobby?~~ (vừa nghe người ta kể chuyện đổi nghề xong) → **Really? What made you switch?** Nhảy sang câu hỏi mới là báo hiệu bạn không nghe. Bám vào câu vừa nghe.',
          '~~Give me your Facebook / your phone number.~~ (người vừa gặp ở hội thảo) → **Would you mind if I connected with you on LinkedIn?** Ở môi trường công việc quốc tế, xin Facebook hay số riêng ngay lần đầu là quá thân.',
          '~~OK, bye.~~ (rồi quay đi ngay giữa chuyện) → **Anyway, I\'ll let you mingle. It was great talking to you!** Kết thúc đột ngột làm người kia tưởng họ nói gì sai. Luôn có một câu "đệm" trước khi đi.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể ở buổi đứng' },
      {
        t: 'p',
        text: 'Meetup và giờ giải lao là "tiệc đứng": không có bàn để ngồi sau, ai cũng nhìn thấy dáng đứng của bạn. Mấy cử chỉ nhỏ dưới đây quyết định người khác có muốn bước vào nói chuyện với bạn hay không.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi networking',
        items: [
          { anh: 'cup-with-straw', w: 'Hi, mind if I join you?', ro: '/ˈmaɪnd ɪf aɪ ˈdʒɔɪn ju/', vi: 'Cầm cốc ở **tay trái**. Tay phải luôn rảnh, khô và không lạnh để bắt tay bất cứ lúc nào.' },
          { anh: 'open-hands', w: 'Come on in!', ro: '/ˌkʌm ɑːn ˈɪn/', vi: 'Đứng thành nhóm thì **chừa một khoảng hở**, hai người đứng chếch nhau như chữ V. Đứng khép kín thành vòng tròn là báo hiệu "đang nói chuyện riêng".' },
          { anh: 'eyes', w: 'What made you switch?', ro: '', vi: 'Nhìn người đang nói. **Đừng nhìn qua vai họ** để tìm người "quan trọng hơn": người phương Tây nhận ra ngay và thấy bị coi thường.' },
          { anh: 'mobile-phone-off', w: '(cất điện thoại)', ro: '', vi: 'Đứng một mình thì dễ rút điện thoại ra cho đỡ ngượng. Nhưng **cầm điện thoại = đừng làm phiền tôi**. Cất đi, ngẩng lên, người khác sẽ tới bắt chuyện.' },
          { anh: 'slightly-smiling-face', w: 'Really? How come?', ro: '/ˈrɪəli ˌhaʊ ˈkʌm/', vi: 'Gật nhẹ và mỉm cười khi nghe = "tôi đang theo dõi". Không cần gật liên tục như ở Nhật.' },
          { anh: 'palm-up-hand', w: 'Rhys, this is Marisol.', ro: '/riːs ðɪs ɪz mɑːriˈsoʊl/', vi: 'Giới thiệu hai người thì **xoay người hở ra** về phía cả hai, tay mở hướng về từng người khi nói tên.' },
          { anh: 'waving-hand', w: "I'll let you mingle. Great talking to you!", ro: '', vi: 'Chào ra về: bắt tay hoặc vẫy nhẹ, nói câu đệm, rồi mới bước đi. **Đừng lùi dần** ra khỏi nhóm mà không nói gì.' },
          { anh: 'person-bowing', w: 'Thank you for your time.', ro: '', vi: 'Với khách hoặc diễn giả người Nhật: cúi nhẹ khi cảm ơn và khi chào về. Họ thường đưa **danh thiếp** thay vì mã QR (Ngày 13 đã học cách nhận).' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Bắt chuyện người lạ ở sự kiện', 'Thường chờ có người giới thiệu. Tự đi bắt chuyện thấy ngại.', 'Tự đi bắt chuyện là **chuyện bình thường**, người ta mong bạn làm vậy.', 'Thường qua người giới thiệu, đổi danh thiếp trước rồi mới nói chuyện.'],
          ['Xin liên lạc', 'Xin Zalo hoặc Facebook ngay.', 'LinkedIn hoặc email công việc. Số điện thoại riêng để sau.', 'Danh thiếp, email công việc. LinkedIn ít phổ biến hơn.'],
          ['Hỏi chuyện riêng', 'Hỏi tuổi, quê, gia đình là thân thiện.', 'Hỏi về **công việc, sở thích, sự kiện**. Tuổi, lương, tôn giáo là chuyện riêng.', 'Rất dè dặt, câu hỏi riêng tư để rất lâu sau.'],
          ['Kết thúc', 'Đôi khi chỉ cười rồi rời đi.', 'Luôn có câu kết: "Great talking to you."', 'Cảm ơn, cúi chào, thường tiễn vài bước.'],
          ['Nhắn sau buổi gặp', 'Ít khi nhắn lại nếu không có việc.', 'Nhắn trong **24–48 giờ**, nhắc lại nơi gặp và một chi tiết.', 'Email cảm ơn trang trọng, thường ngay hôm sau.'],
        ],
        caption: 'Khi không chắc: làm theo người đối diện. Họ đưa danh thiếp thì nhận bằng hai tay; họ chìa mã QR thì quét.',
      },

      { t: 'h', text: '6. Phát âm: used to, nối âm và ngữ điệu câu hỏi nối tiếp' },
      {
        t: 'p',
        text: '**used to** đọc liền thành /ˈjuːstə/: âm **/s/** (không phải /z/ như "use" động từ), chữ **to** nhẹ thành /tə/. Câu hỏi nối tiếp có ngữ điệu riêng: câu hỏi Wh- (**What made you switch?**) **xuống giọng** ở cuối; câu nhắc lại từ khoá (**Cardiff?**) **lên giọng**.',
      },
      {
        t: 'phatam',
        id: 'gtd19-phat-am',
        title: 'Luyện phát âm — used to, nối âm, lên xuống giọng',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nói liền một hơi, nhấn vào từ in đậm trong phần gợi ý.',
        items: [
          { text: 'I used to teach physics.', ipa: 'aɪ juːstə tiːtʃ fɪzɪks', vi: 'used to = "yus-tơ", âm /s/ · nhấn TEACH và PHYS' },
          { text: "I didn't use to travel at all.", ipa: 'aɪ dɪdnt juːstə trævl ət ɔːl', vi: "didn't nuốt /t/ · at all nối thành \"ơ-tol\"" },
          { text: 'Did you use to live here?', ipa: 'dɪdʒu juːstə lɪv hɪr', vi: 'Did you nối thành /dɪdʒu/ ("đi-giu") · lên giọng cuối câu' },
          { text: 'Mind if I join you?', ipa: 'maɪnd ɪf aɪ dʒɔɪn ju', vi: 'nối: Mind‿if‿I = "mai-đi-phai" · lên giọng ở you' },
          { text: 'What made you switch?', ipa: 'wʌt meɪdʒu swɪtʃ', vi: 'made you nối thành /meɪdʒu/ · nhấn SWITCH, xuống giọng' },
          { text: 'How did you end up here?', ipa: 'haʊ dɪdʒu end ʌp hɪr', vi: 'end‿up nối thành "en-đáp" · xuống giọng' },
          { text: 'Cardiff? Really?', ipa: 'kɑːrdɪf rɪəli', vi: 'nhắc lại từ khoá: lên giọng mạnh ở cả hai từ, tỏ ra ngạc nhiên thật' },
          { text: "I'll let you mingle.", ipa: 'aɪl letʃu mɪŋɡl', vi: 'let you nối thành /letʃu/ ("lét-chu") · mingle có âm /ŋɡ/' },
        ],
      },

      { t: 'h', text: '7. Một cuộc networking 5 phút' },
      {
        t: 'sodo',
        kind: 'flow',
        title: '5 bước, mỗi bước 1–2 câu',
        caption: 'Bước 3 là phần dài nhất và là phần người ta nhớ. Bước 4 và 5 chỉ cần 20 giây, nhưng thiếu thì cả cuộc nói chuyện coi như mất.',
        steps: [
          { label: 'Mở lời', sub: 'Mind if I join you? · What did you make of the talk?' },
          { label: 'Hỏi mở', sub: 'What brings you here? · Have you always worked in…?' },
          { label: 'Hỏi nối tiếp 2–3 lần', sub: 'What made you switch? · What\'s that like? · How come?' },
          { label: 'Xin liên lạc', sub: 'Would you mind if I connected with you on LinkedIn?' },
          { label: 'Chào ra về', sub: "I should get going. Great talking to you. Let's keep in touch." },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "Hi, mind if I join you? I'm Uyên.", vi: 'Chào, mình đứng cùng được không? Mình là Uyên.' },
          { en: "What did you make of the last talk? I thought the demo was great.", vi: 'Bạn thấy bài vừa rồi thế nào? Mình thấy phần demo hay lắm.' },
          { en: "So have you always worked in design? — No, I used to work at a bank. — Really? What made you switch?", vi: 'Thế bạn làm thiết kế từ đầu à? — Không, trước mình làm ở ngân hàng. — Thật à? Điều gì khiến bạn chuyển?' },
          { en: "I used to be really shy at events like this, but these days I try to talk to three new people.", vi: 'Hồi trước mình rất ngại mấy sự kiện thế này, nhưng dạo này mình cố nói chuyện với ba người mới.' },
          { en: "I should get going. Would you mind if I connected with you on LinkedIn? Great talking to you!", vi: 'Mình phải về rồi. Bạn có phiền không nếu mình kết nối trên LinkedIn? Nói chuyện vui lắm!' },
        ],
      },
      {
        t: 'p',
        text: 'Chuẩn bị **câu chuyện "used to" của riêng bạn**: một điều hồi trước bạn từng làm / từng nghĩ, bây giờ đã khác, và vì sao. Người ta hỏi "Have you always…?" là bạn có ngay câu trả lời 3 câu: **I used to… but now… That\'s why…**',
      },

      { t: 'h', text: '8. Nhập vai: giờ giải lao ở hội thảo' },
      {
        t: 'dialogue',
        title: 'Uyên bắt chuyện với một người đứng một mình ở quầy nước',
        lines: [
          { who: 'Uyên', role: 'a', text: "Hi, is anyone standing here? It's packed today.", vi: 'Chào chị, chỗ này có ai đứng chưa ạ? Hôm nay đông quá.' },
          { who: 'Gemma', role: 'b', text: "No, go ahead. It's like this every year. I'm Gemma, by the way.", vi: 'Chưa, em cứ đứng. Năm nào cũng vậy. À, chị là Gemma.' },
          { who: 'Uyên', role: 'a', text: "I'm Uyên. Is this your first time here?", vi: 'Em là Uyên. Chị tới đây lần đầu ạ?' },
          { who: 'Gemma', role: 'b', text: "Third time. I used to come for the free coffee, but now I actually come for the talks.", vi: 'Lần thứ ba rồi. Hồi trước chị tới vì cà phê miễn phí, giờ thì tới vì các bài nói thật.' },
          { who: 'Uyên', role: 'a', text: "Ha! So what do you do?", vi: 'Ha! Thế chị làm gì ạ?' },
          { who: 'Gemma', role: 'b', text: "I run the QA team at a game studio in District 3.", vi: 'Chị quản lý nhóm kiểm thử ở một studio game tại Quận 3.' },
          { who: 'Uyên', role: 'a', text: "Games? What's that like? Do you get to play all day?", vi: 'Game ạ? Làm ở đó thế nào ạ? Chị được chơi cả ngày à?' },
          { who: 'Gemma', role: 'b', text: "Everyone asks that! I play the same level two hundred times. It's less fun than it sounds.", vi: 'Ai cũng hỏi câu đó! Chị chơi một màn hai trăm lần. Không vui như nghe đâu.' },
          { who: 'Uyên', role: 'a', text: "That makes sense. How did you end up in games?", vi: 'Thảo nào. Sao chị lại vào ngành game ạ?' },
          { who: 'Gemma', role: 'b', text: "I used to write game reviews for a website. Then a studio asked me to test their games instead.", vi: 'Hồi trước chị viết bài đánh giá game cho một trang web. Rồi một studio rủ chị kiểm thử game của họ luôn.' },
          { who: 'Uyên', role: 'a', text: "That's a great story. Oh, the next session's starting. Would you mind if I connected with you on LinkedIn?", vi: 'Chuyện hay quá. Ôi, phiên tiếp theo bắt đầu rồi. Chị có phiền không nếu em kết nối với chị trên LinkedIn?' },
          { who: 'Gemma', role: 'b', text: "Not at all. Search for Gemma Nguyen-Hart. Enjoy the rest of the day!", vi: 'Không phiền gì. Em tìm Gemma Nguyen-Hart nhé. Chúc em buổi chiều vui!' },
          { who: 'Uyên', role: 'a', text: "Thanks, you too. It was great talking to you!", vi: 'Cảm ơn chị, chị cũng vậy. Nói chuyện với chị vui lắm!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd19-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Uyên (5 câu)',
        items: [
          { vi: 'Gemma: (đứng một mình) → Bạn: Chỗ này có ai đứng chưa ạ?', chips: ['Is', 'anyone', 'standing', 'here?', 'someone', 'stand'], answer: ['Is', 'anyone', 'standing', 'here?'] },
          { vi: 'Gemma: "I run the QA team at a game studio." → Bạn: Game ạ? Làm ở đó thế nào ạ?', chips: ['Games?', "What's", 'that', 'like?', 'How', 'this'], answer: ['Games?', "What's", 'that', 'like?'] },
          { vi: 'Gemma: "It\'s less fun than it sounds." → Bạn: Sao chị lại vào ngành game ạ?', chips: ['How', 'did', 'you', 'end', 'up', 'in', 'games?', 'do', 'at'], answer: ['How', 'did', 'you', 'end', 'up', 'in', 'games?'] },
          { vi: 'Bạn kể về mình: Hồi trước em ngại nói tiếng Anh lắm.', chips: ['I', 'used', 'to', 'be', 'shy', 'about', 'speaking', 'English.', 'use', 'was'], answer: ['I', 'used', 'to', 'be', 'shy', 'about', 'speaking', 'English.'] },
          { vi: 'Phiên mới sắp bắt đầu → Bạn: Em phải đi rồi. Nói chuyện với chị vui lắm!', chips: ['I', 'should', 'get', 'going.', 'Great', 'talking', 'to', 'you!', 'go', 'meet'], answer: ['I', 'should', 'get', 'going.', 'Great', 'talking', 'to', 'you!'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd19-noi-tra-loi',
        part: '1',
        questions: [
          'So, what brings you to this event?',
          'Have you always been interested in IT?',
          'What did you use to do in your free time when you were in high school?',
          'What do you do differently these days, compared with your first year at university?',
          "I'd love to stay in touch. What's the best way to reach you?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Ewan Price, a friendly British engineering manager at a tech conference in Ho Chi Minh City. It is the coffee break and you are standing alone. I am a Vietnamese IT student who wants to practise networking. Wait for me to start the conversation. Answer naturally at B1+/B2 level, at normal speed. In your answers, mention one thing you used to do before your current job, but only if I ask a good follow-up question. If I ask three unrelated questions in a row like a form, say \'Ha, this feels like a job interview!\'. After about 10 turns, the bell rings: let me ask for your contact and say goodbye. Then, in Vietnamese, tell me: how many real follow-up questions I asked, whether I used \'used to\' correctly, and one better way to end the conversation."',
          'Làm **2 lượt**. Lượt hai thêm một khó khăn: dặn AI "keep talking about your startup and ask me to work for free". Bạn phải từ chối mềm và **thoát chuyện** bằng một câu đệm.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd19-doc',
    kind: 'reading',
    title: 'Hồ sơ LinkedIn, lời mời kết nối',
    goal: 'Đọc hiểu một hồ sơ LinkedIn (tiêu đề, phần giới thiệu, kinh nghiệm), phân biệt lời mời kết nối tốt và lời mời bị bỏ qua, đọc đúng giọng điệu một tin trả lời, và tự viết lời nhắn kết nối sau buổi gặp.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Tối đó về nhà, Uyên mở LinkedIn. Bạn đọc cùng Uyên **năm mẩu chữ thật**: hồ sơ của Rhys, bài đăng cảm ơn của người tổ chức, ba lời mời kết nối Rhys nhận được, và tin trả lời của Marisol.',
          'Học đọc **tiêu đề hồ sơ** (headline) viết gọn kiểu "A | B | C" và phần **About** viết ở ngôi thứ nhất.',
          'So sánh lời mời kết nối **được nhận** và lời mời **bị bỏ qua**: khác nhau chỉ ở 2–3 câu.',
          'Cuối bài bạn tự điền một lời nhắn kết nối sau buổi gặp. Bài Viết Ngày 20 sẽ dùng lại kiểu câu ngắn, đủ ý này.',
        ],
      },

      { t: 'h', text: '1. Đọc năm mẩu sau' },
      {
        t: 'canh',
        anh: ['laptop', 'link', 'speech-balloon', 'bell'],
        caption: 'Gần 11 giờ đêm. Uyên vừa về tới nhà, mở LinkedIn trên máy tính. Có một thông báo mới và một bài đăng của chị **Anaya**, người tổ chức buổi meetup.',
      },
      {
        t: 'passage',
        title: "Uyên's LinkedIn, Thursday night",
        intro: 'Đọc lướt một lượt để biết mỗi mẩu là gì. Lượt hai đọc kỹ, chú ý chỗ in đậm.',
        paras: [
          {
            label: 'A',
            text: '**PROFILE — Rhys Pritchard** · **Developer Advocate | Accessibility | Former physics teacher** · Singapore · 2,400+ connections · **About:** I used to spend my days explaining gravity to fifteen-year-olds. These days I explain screen readers to developers, which is surprisingly similar. I help product teams build apps that everyone can use, including the 1 in 6 people who live with a disability. **Open to:** speaking at events, mentoring students. **Experience:** Developer Advocate, Brightline (2022–present) · Physics Teacher, a secondary school in Cardiff (2014–2022).',
          },
          {
            label: 'B',
            text: '**POST — Anaya Sharma · Community Organiser** · 2h · What a night! 🎉 **Huge thanks to** everyone who came to Design & Product Night in Thảo Điền — over 120 of you. Special thanks to Rhys Pritchard for staying on after his conference talk, and to our sponsors. **If you met someone interesting, don\'t let the conversation end here.** Send them a note this week. Slides from the lightning talks are **in the comments**. See you next month! #SaigonTech #Networking',
          },
          {
            label: 'C',
            text: '**CONNECTION REQUEST 1** (no note) · Khoa Le wants to connect. — **CONNECTION REQUEST 2:** "Dear Sir, I am a hard-working student with strong skills. Please accept my request and help me find a job at your company. Thank you." — **CONNECTION REQUEST 3:** "Hi Rhys, it\'s Uyên from the coffee break at the Mekong Product Summit (the one who said your talk was too fast, sorry again!). I\'d love to ask you two quick questions about accessibility testing before you leave for Singapore. **No worries if you\'re busy.**"',
          },
          {
            label: 'D',
            text: '**MESSAGE — Marisol Reyes** · 10:52 pm · Hey Uyên! **Great meeting you tonight.** Accepted 🙂 Rhys and I ended up talking for an hour, so **I owe you one**. If you\'re ever curious about design work, **happy to grab a coffee** in the next couple of weeks. I\'m around Thảo Điền most afternoons. And ignore Jake\'s text if it comes!',
          },
          {
            label: 'E',
            text: '**NOTIFICATION** · Rhys Pritchard accepted your invitation. · Rhys: "Of course, I remember! **Fire away.** I\'m free Saturday morning if a quick video call is easier than typing. **Fair warning:** my answers will be shorter than my talk."',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd19-doc-hieu',
        title: 'Hiểu ý và giọng điệu (9 câu)',
        items: [
          {
            q: 'Tiêu đề hồ sơ (A) "Developer Advocate | Accessibility | Former physics teacher" cho biết gì?',
            options: ['Rhys đang làm ba việc cùng lúc', 'Nghề hiện tại, mảng chuyên sâu và nghề cũ', 'Ba công ty Rhys từng làm', 'Ba khoá học Rhys dạy'],
            correct: 1,
            why: 'Tiêu đề LinkedIn hay viết gọn bằng dấu |. **Former** = trước đây (đồng nghĩa với used to be).',
          },
          {
            q: '"These days I explain screen readers to developers, which is surprisingly similar." Rhys muốn nói gì?',
            options: ['Giải thích công nghệ cho lập trình viên khó hơn dạy học', 'Việc anh làm bây giờ hoá ra khá giống việc dạy học trước kia', 'Anh vẫn đang dạy vật lý', 'Anh không thích việc hiện tại'],
            correct: 1,
            why: 'Câu đặt "I used to… explaining gravity" cạnh "**These days** I explain…" và nói hai việc **giống nhau một cách bất ngờ**. Đây chính là khung "used to… / these days…" của bài Nói.',
          },
          {
            q: 'Mục "Open to: speaking at events, mentoring students" là tín hiệu gì cho Uyên?',
            options: ['Rhys đang tìm việc', 'Rhys sẵn lòng hướng dẫn sinh viên, nên nhắn hỏi là hợp', 'Rhys chỉ nhận lời mời có trả tiền', 'Rhys không nhận tin nhắn'],
            correct: 1,
            why: '**Open to** = sẵn lòng nhận. Đọc kỹ hồ sơ trước khi nhắn giúp bạn biết người ta muốn được hỏi về gì.',
          },
          {
            q: 'Trong bài đăng (B), Anaya khuyên mọi người làm gì?',
            options: ['Đăng ký buổi sau ngay', 'Nhắn cho người mình đã gặp trong tuần này', 'Tải slide về', 'Cảm ơn nhà tài trợ'],
            correct: 1,
            why: '"If you met someone interesting, **don\'t let the conversation end here.** Send them a note this week."',
          },
          {
            q: 'Vì sao lời mời số 2 (C) dễ bị bỏ qua nhất?',
            options: ['Vì quá ngắn', 'Vì không nói đã gặp nhau ở đâu, xin việc ngay và dùng "Dear Sir" với người cụ thể', 'Vì viết bằng tiếng Anh', 'Vì có lời cảm ơn'],
            correct: 1,
            why: 'Lời mời 2 viết cho "ai cũng được": không tên, không bối cảnh, lại **xin việc ngay** trong câu đầu. Người nhận không biết bạn là ai.',
          },
          {
            q: 'Lời mời số 3 làm tốt điều gì?',
            options: ['Khen Rhys thật nhiều', 'Nhắc nơi gặp + một chi tiết dễ nhớ, xin một việc nhỏ cụ thể, và cho người kia đường lui', 'Gửi kèm CV', 'Viết thật dài cho lịch sự'],
            correct: 1,
            why: 'Ba phần: **ở đâu + chi tiết** ("the one who said your talk was too fast") · **xin gì** (two quick questions) · **đường lui** ("No worries if you\'re busy").',
          },
          {
            q: 'Marisol viết "I owe you one". Ý chị là gì?',
            options: ['Chị nợ Uyên tiền', 'Chị mang ơn Uyên một lần (vì đã giới thiệu Rhys)', 'Chị muốn Uyên trả tiền cà phê', 'Chị có một câu hỏi'],
            correct: 1,
            why: '**I owe you one** = tôi nợ bạn một lần, sẽ trả ơn. Vì Uyên giới thiệu Rhys mà Marisol có cuộc nói chuyện một tiếng.',
          },
          {
            q: '"Happy to grab a coffee in the next couple of weeks" — lời mời này có thật không?',
            options: ['Chỉ là câu xã giao, đừng trả lời', 'Có vẻ thật: có khung thời gian và nơi chị hay ở; Uyên nên hẹn ngày cụ thể', 'Marisol muốn Uyên mời', 'Không rõ, tốt nhất là im lặng'],
            correct: 1,
            why: 'Khác câu "Let\'s grab coffee sometime" chung chung: Marisol đưa **thời gian** (next couple of weeks) và **nơi** (Thảo Điền, most afternoons). Đáp lại bằng một ngày cụ thể là đúng.',
          },
          {
            q: 'Rhys viết "Fire away." Nghĩa là gì?',
            options: ['Anh đang rất giận', 'Cứ hỏi đi', 'Hãy gửi email', 'Anh sắp nghỉ việc'],
            correct: 1,
            why: '**Fire away** = cứ hỏi / cứ nói đi. "Fair warning" = báo trước nhé, câu đùa về bài nói quá dài của chính anh.',
          },
        ],
      },

      { t: 'h', text: '2. Cụm hay gặp trên LinkedIn và trong lời mời kết nối' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['Former + nghề', 'Từng là…', 'Tiêu đề hồ sơ'],
          ['Open to + việc', 'Sẵn lòng nhận…', 'Hồ sơ'],
          ['(2022–present)', 'Từ 2022 tới nay', 'Mục kinh nghiệm'],
          ['Huge thanks to…', 'Cảm ơn rất nhiều…', 'Bài đăng sau sự kiện'],
          ['in the comments', 'ở phần bình luận', 'Bài đăng'],
          ["It's [tên] from [nơi gặp].", 'Mình là … (người bạn gặp ở …)', 'Câu mở lời mời kết nối'],
          ["No worries if you're busy.", 'Bận thì cũng không sao đâu.', 'Cuối lời nhờ vả'],
          ['Great meeting you (tonight).', 'Rất vui được gặp bạn (tối nay).', 'Tin nhắn sau buổi gặp'],
          ['I owe you one.', 'Tôi nợ bạn một lần.', 'Tin cảm ơn thân mật'],
          ['Happy to + V', 'Sẵn lòng…', 'Lời đề nghị giúp'],
          ['Fire away.', 'Cứ hỏi đi.', 'Trả lời người xin hỏi'],
          ['Fair warning: …', 'Báo trước nhé: … (đùa nhẹ)', 'Tin thân mật'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: lời mời kết nối được nhận có 3 phần, thật ngắn',
        items: [
          '**Ở đâu + một chi tiết nhớ được**: "It\'s Uyên from the coffee break at… (the one who…)". Không có chi tiết, người gặp 120 người trong một tối sẽ không nhớ ra bạn.',
          '**Bạn muốn gì, nhỏ và cụ thể**: "two quick questions about…", "a 15-minute call". Đừng xin việc ngay trong lời mời đầu tiên.',
          '**Đường lui**: "No worries if you\'re busy." Câu này làm người ta dễ nhận lời hơn, vì họ không thấy bị ép.',
          'LinkedIn giới hạn lời nhắn kèm lời mời ở **vài trăm ký tự** (tuỳ loại tài khoản). Ba câu ngắn là vừa.',
          'Gửi trong **24–48 giờ** sau buổi gặp, khi người ta còn nhớ mặt bạn. Viết **đúng mức người ta nói với bạn**: Rhys gọi Uyên bằng tên và đùa thì Uyên không cần "Dear Mr Pritchard".',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd19-doc-tu-viet',
        title: 'Tự điền lời nhắn kết nối gửi Gemma (người ở quầy nước, bài Nói) — 5 chỗ trống',
        kind: 'fill',
        grammar: "It's + tên + from + nơi gặp · I'd love to + V · No worries if…",
        items: [
          { q: "Hi Gemma, it's Uyên ___ the coffee break at the Mekong Product Summit.", answers: ['from'] },
          { q: "(the one who asked if you ___ to play games all day!)", answers: ['get'] },
          { q: "I'd ___ to hear more about QA work at a game studio.", answers: ['love'] },
          { q: 'Would you be free for a ___ call sometime next week? (ngắn, nhanh)', answers: ['quick', 'short'] },
          { q: "No ___ if you're busy. Thanks!", answers: ['worries'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd19-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 19',
    goal: 'Làm 35 câu có đáp án để chắc used to, câu hỏi nối tiếp, cách vào nhóm, xin liên lạc và kết thúc cuộc nói chuyện; ôn lại ngữ pháp Ngày 13–18.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · used to / usually / be used to · dịch · nghe chép · ghép câu.',
          'Có **6 câu ôn** Ngày 13–18 (câu hỏi gián tiếp, nêu lý do, điều kiện loại 1, nêu ý kiến) đánh dấu "(ôn)".',
          'Làm **không nhìn lại bài**. Sai câu nào thì đọc giải thích, rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 20.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd19-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Giờ giải lao, bạn muốn đứng cùng bàn với một người lạ. Bạn nói:',
            options: ['Can I stand?', 'Mind if I join you?', 'I join you, OK?', 'Move, please.'],
            correct: 1,
            why: '**Mind if I join you?** là câu chuẩn, lịch sự và tự nhiên nhất.',
          },
          {
            q: 'Bạn hỏi "Mind if I join you?". Người kia đáp "Not at all." Nghĩa là:',
            options: ['Không được', 'Được, cứ tự nhiên', 'Họ không hiểu', 'Họ đang bận'],
            correct: 1,
            why: '"Do you **mind**…?" = bạn có **phiền** không? "Not at all" = không phiền chút nào, tức là được.',
          },
          {
            q: 'Một người kể: "I used to be a nurse." Câu hỏi nối tiếp tốt nhất là:',
            options: ['What is your hobby?', 'Really? What made you switch to tech?', 'How old are you?', 'OK. Where are you from?'],
            correct: 1,
            why: 'Bám vào chi tiết vừa nghe (nurse → nay làm tech) rồi hỏi sâu. Các câu kia nhảy sang chủ đề khác.',
          },
          {
            q: 'Bạn muốn vào một nhóm ba người đang nói chuyện. Cách hợp nhất:',
            options: ['Chen vào giữa câu của người đang nói', 'Đứng sát sau lưng họ chờ', 'Đứng ở chỗ hở của nhóm, chờ quãng ngắt rồi nói "Sorry to jump in…"', 'Gọi to "Hello everyone!"'],
            correct: 2,
            why: 'Đứng chỗ nhóm chừa ra, chờ quãng ngắt, rồi **Sorry to jump in**. Nếu có người giới thiệu thì nhắc tên họ.',
          },
          {
            q: 'Một người cứ rủ bạn làm việc không lương cho startup của họ. Câu từ chối mềm nhất:',
            options: ['No. I don\'t want.', 'Thanks, that\'s kind of you. I\'m pretty busy at the moment, though.', 'Maybe, I will try.', 'Your startup is bad.'],
            correct: 1,
            why: 'Cảm ơn + lý do ngắn + **though** ở cuối. "Maybe, I will try" khi không định làm là hứa suông (Ngày 10).',
          },
          {
            q: 'Bạn muốn rời một cuộc nói chuyện đã kéo dài. Câu lịch sự nhất:',
            options: ['OK, bye.', "I'm bored.", "Anyway, I'll let you mingle. It was great talking to you!", 'Stop talking, please.'],
            correct: 2,
            why: '**I\'ll let you mingle** = tôi không giữ bạn nữa. Có câu đệm trước khi đi.',
          },
          {
            q: 'Bạn muốn xin liên lạc một diễn giả vừa gặp. Câu nào hợp nhất?',
            options: ['Give me your Facebook.', 'What is your phone number?', 'Would you mind if I connected with you on LinkedIn?', 'Add me on Zalo.'],
            correct: 2,
            why: 'Ở môi trường công việc quốc tế, **LinkedIn / email** là kênh mặc định. Số riêng, Facebook để sau khi đã thân.',
          },
          {
            q: '(ôn Ngày 15) Bạn muốn hỏi lịch sự một người lạ phiên tiếp theo ở phòng nào:',
            options: ['Where is the next session?', 'Do you know where the next session is?', 'Do you know where is the next session?', 'Tell me where the next session.'],
            correct: 1,
            why: 'Câu hỏi gián tiếp: **Do you know where + S + V?** Sau where KHÔNG đảo: where the next session **is**.',
          },
          {
            q: '(ôn Ngày 18) Ai đó hỏi bạn thấy bài nói thế nào. Bạn thích, nhưng thấy hơi dài. Câu nào khéo nhất?',
            options: ['It was bad.', 'I think it was really useful. However, it was a little long for me.', 'Long. Too long.', 'I am not sure that it was long.'],
            correct: 1,
            why: 'Nêu ý kiến: **I think…** rồi ý trái chiều bằng **However**. Khen trước, góp ý sau. Và nhớ bài học của Uyên: người hỏi có thể là diễn giả.',
          },
          {
            q: 'Marisol viết: "Happy to grab a coffee in the next couple of weeks." Uyên nên trả lời:',
            options: ['OK.', "Thanks! Would next Tuesday afternoon work? I could come to Thảo Điền.", 'Why?', 'Maybe sometime.'],
            correct: 1,
            why: 'Lời mời có thời gian cụ thể là lời mời thật. Đáp bằng **một ngày cụ thể** để nó thành hẹn thật.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — used to · usually · be used to' },
      {
        t: 'quiz',
        id: 'gtd19-bt-used-to',
        title: 'Phần II — Điền used to / use to / usually / used to + V-ing (7 câu)',
        kind: 'fill',
        grammar: "used to + V (hồi trước) · didn't / Did … use to · usually (hiện tại) · be used to + V-ing (đã quen)",
        items: [
          { q: 'Rhys ___ teach physics, but now he works in tech.', answers: ['used to'] },
          { q: "I didn't ___ like big events, but now I enjoy them.", answers: ['use to'] },
          { q: 'Did you ___ live in Đà Nẵng?', answers: ['use to'] },
          { q: 'I ___ go to meetups on Thursdays. I went last week, too. (thói quen bây giờ)', answers: ['usually'] },
          { q: "Marisol is used to ___ fast. (work) (đã quen)", answers: ['working'] },
          { q: 'When I was a kid, I ___ play football every afternoon.', answers: ['used to'] },
          { q: "I'm getting used to ___ English every day. (speak)", answers: ['speaking'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd19-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (8 câu)',
        kind: 'translate',
        grammar: 'used to · What made you…? · How did you end up…? · Would you mind if I…? · ôn Ngày 16–17',
        items: [
          { q: 'Xin lỗi chen ngang. Đây có phải nhóm thiết kế không?', hint: 'sorry to jump in', answers: ['Sorry to jump in. Is this the design group?', 'Sorry to jump in, is this the design group?'] },
          { q: 'Điều gì đưa bạn tới đây?', hint: 'bring', answers: ['What brings you here?', 'So what brings you here?', 'What brings you here tonight?', 'What brings you here today?'] },
          { q: 'Sao chị lại tới Sài Gòn?', hint: 'end up', answers: ['How did you end up in Saigon?', 'So how did you end up in Saigon?', 'How did you end up in Ho Chi Minh City?'] },
          { q: 'Làm việc ở đó thế nào?', hint: "what's … like", answers: ["What's it like working there?", 'What is it like working there?', "What's it like to work there?", "What's that like?"] },
          { q: 'Hồi trước mình từng nghĩ networking rất đáng sợ.', hint: 'used to think, scary', answers: ['I used to think networking was really scary.', 'I used to think networking was very scary.', 'I used to think networking was scary.', 'I used to think that networking was really scary.'] },
          { q: 'Bạn có phiền không nếu mình kết nối với bạn trên LinkedIn?', hint: 'would you mind if I connected', answers: ['Would you mind if I connected with you on LinkedIn?', 'Would you mind if I connect with you on LinkedIn?', 'Do you mind if I connect with you on LinkedIn?'] },
          { q: '(ôn Ngày 16) Mình phải về rồi, vì mai mình đi làm sớm.', hint: 'because, early start', answers: ["I should get going because I've got an early start tomorrow.", 'I should get going because I have an early start tomorrow.', "I have to go because I've got an early start tomorrow.", 'I have to go because I have an early start tomorrow.', "I should go because I've got an early start tomorrow.", 'I need to go because I have an early start tomorrow.'] },
          { q: '(ôn Ngày 17) Nếu bạn rảnh tuần sau, mình mời bạn cà phê nhé.', hint: "if you're free, I'll buy you", answers: ["If you're free next week, I'll buy you a coffee.", 'If you are free next week, I will buy you a coffee.', "If you're free next week, I'll get you a coffee.", "I'll buy you a coffee if you're free next week."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd19-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Have you always worked in tech?', answer: 'Have you always worked in tech?' },
          { label: 'Câu 2', spell: "I didn't use to travel at all.", answer: "I didn't use to travel at all.", alt: ['I did not use to travel at all.'] },
          { label: 'Câu 3', spell: "What's the best way to reach you?", answer: "What's the best way to reach you?", alt: ['What is the best way to reach you?'] },
          { label: 'Câu 4', spell: "Anyway, I'll let you mingle.", answer: "Anyway, I'll let you mingle.", alt: ['Anyway I will let you mingle.'] },
          { label: 'Câu 5', spell: "Let's keep in touch.", answer: "Let's keep in touch.", alt: ['Let us keep in touch.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd19-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Trước đây chị ấy từng thiết kế biểu mẫu cho một ngân hàng.', chips: ['She', 'used', 'to', 'design', 'forms', 'for', 'a', 'bank.', 'designing', 'use'], answer: ['She', 'used', 'to', 'design', 'forms', 'for', 'a', 'bank.'] },
          { vi: 'Điều gì khiến anh chuyển nghề?', chips: ['What', 'made', 'you', 'switch?', 'did', 'make', 'to'], answer: ['What', 'made', 'you', 'switch?'] },
          { vi: 'Hồi trước mình rất ngại, nhưng giờ mình thích các buổi meetup.', chips: ['I', 'used', 'to', 'be', 'shy,', 'but', 'now', 'I', 'love', 'meetups.', 'was', 'so'], answer: ['I', 'used', 'to', 'be', 'shy,', 'but', 'now', 'I', 'love', 'meetups.'] },
          { vi: 'Ở đây mọi người làm nhanh. Vì thế mà chị ở lại.', chips: ['Teams', 'here', 'move', 'fast.', "That's", 'why', 'I', 'stayed.', 'because', 'so'], answer: ['Teams', 'here', 'move', 'fast.', "That's", 'why', 'I', 'stayed.'] },
          { vi: 'Hai người gặp nhau chưa? Anh Rhys, đây là chị Marisol.', chips: ['Have', 'you', 'two', 'met?', 'Rhys,', 'this', 'is', 'Marisol.', 'Did', 'she'], answer: ['Have', 'you', 'two', 'met?', 'Rhys,', 'this', 'is', 'Marisol.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (10 phút)',
        items: [
          'Nói to **câu chuyện "used to" 3 câu** của bạn (I used to… but now… That\'s why…) 3 lần, lần cuối không nhìn giấy. Ghi âm lại.',
          'Tìm **một sự kiện công nghệ thật** gần bạn (meetup, hội thảo sinh viên, CLB của trường). Ghi vào lịch. Đặt mục tiêu: nói chuyện với **hai người lạ** và hỏi ít nhất **ba câu nối tiếp**.',
          'Viết sẵn một lời mời kết nối 3 phần (ở đâu + chi tiết · xin gì nhỏ · đường lui) để dùng sau buổi đó.',
          'Ngày 20: bạn là người **đón khách nước ngoài** và giới thiệu Việt Nam: món ăn, phong tục, một chút lịch sử.',
        ],
      },
    ],
  },
];
