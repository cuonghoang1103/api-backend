/**
 * Tiếng Anh giao tiếp — NGÀY 15 (chặng 3 "Công sở, không kỹ thuật", B1): nhờ giúp, đề nghị giúp, hỏi ý kiến.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd15-`.
 * Ngữ pháp trong câu: câu hỏi gián tiếp (Do you know where the printer is? · Could you tell me what time… · I was wondering if…)
 * · Would you mind + V-ing? / Would you mind if I + V2? · bậc lịch sự can → could → would you mind · nối câu bằng `if` / `whether`.
 * Cảnh: Khang — sinh viên IT năm 3 đi OJT — tuần thứ ba ở Halyard Tech (Đà Nẵng): hỏi chỗ máy in khi đồng nghiệp đeo tai nghe,
 * trả lời "Yes" cho câu "Would you mind…?" nên bị hiểu là từ chối, nài giúp ba lần kiểu Việt, nghe "Friday might be a little
 * difficult" của người Nhật, hỏi ý kiến trưởng nhóm về quà chia tay đồng nghiệp ("It's a nice idea, but…").
 * Khác podcast en-cv-b1-01 (viết email đòi hoá đơn nhà cung cấp, gọi điện đọc lại địa chỉ email): ở đây là nhờ việc NÓI trực
 * tiếp với đồng nghiệp, không email, không khách. Ticket / nhờ review code ⇒ khoá Technical English at Work.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_15: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd15-nghe',
    kind: 'listening',
    title: 'Nhờ giúp, đề nghị giúp, hỏi ý kiến',
    goal: 'Nghe hiểu ba cảnh nhờ việc ở công ty: ai nhờ ai làm gì, lời nhờ nào là thật sự tuỳ bạn, lời nào là "không" được nói vòng, và đáp "Would you mind…?" cho đúng.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Khang**, sinh viên IT năm 3, đang ở **tuần thứ ba** OJT ở **Halyard Tech**, Đà Nẵng. Trưởng nhóm là chị **Harriet** (Anh), cùng nhóm có **Corey** (Mỹ), **Ben** (Úc) và **Aiko** (kỹ sư cầu nối người Nhật).',
          'Ngày 13 bạn đã làm quen cả team, Ngày 14 đã nói chuyện phiếm ở pantry. Hôm nay là việc khó hơn: **mở miệng nhờ người khác**, **đề nghị giúp** và **xin ý kiến** sếp, mà không làm phiền, không bị hiểu nhầm.',
          'Ba câu bạn sẽ nghe nhiều nhất: **Do you know where…?** (hỏi khéo), **Would you mind…?** (nhờ lịch sự hơn could), **I was wondering if…** (nhờ rất mềm).',
          'Có một bẫy lớn: trả lời "Would you mind…?" bằng **Yes** nghĩa là **"Có, tôi phiền đấy"**. Nghe xem Khang dính bẫy ra sao.',
          'Tốc độ khoảng **150 từ/phút**. Lần 1 chỉ bắt: **ai nhờ ai, việc gì, được hay không**. Lần 2 mở lời thoại.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Khu làm việc: người đeo tai nghe và cái máy in' },
      {
        t: 'canh',
        anh: ['office-building', 'headphone', 'printer', 'man-technologist', 'name-badge'],
        caption: '10 giờ sáng thứ Ba. **Khang** cần in **phiếu đánh giá giữa kỳ** của trường để chị Harriet ký trước thứ Sáu. Anh **Corey** (Mỹ) ngồi bàn bên đang đeo tai nghe chống ồn.',
      },
      {
        t: 'listen',
        id: 'gtd15-nghe-canh1',
        title: 'Scene 1 — At the desks',
        note: 'Nghe xem: có mấy máy in và cái nào dùng được, Khang cần gì để in, vì sao Corey không đi cùng được, và Khang phải đi tìm ai.',
        lines: [
          { who: 'Khang', voice: 'nz-nam', text: 'Sorry to bother you, Corey. Have you got a sec?', vi: 'Xin lỗi làm phiền anh, Corey. Anh có rảnh một chút không?' },
          { who: 'Corey', voice: 'us-nam', text: "Yeah, sure. Hang on, let me take these off. What's up?", vi: 'Ừ, được. Đợi chút, để anh tháo cái này ra. Có chuyện gì thế?' },
          { who: 'Khang', voice: 'nz-nam', text: "Do you know where the colour printer is? I need to print a form for my university.", vi: 'Anh có biết máy in màu ở đâu không ạ? Em cần in một cái phiếu cho trường.' },
          { who: 'Corey', voice: 'us-nam', text: "There's one by the kitchen, but it's been jammed since Monday. The other one's up on the fourth floor, next to the meeting rooms.", vi: 'Có một máy cạnh bếp, nhưng nó kẹt giấy từ thứ Hai rồi. Máy kia ở trên tầng bốn, cạnh mấy phòng họp.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Okay. And do you know if I need a password for it?', vi: 'Dạ. Thế anh có biết em có cần mật khẩu để dùng nó không?' },
          { who: 'Corey', voice: 'us-nam', text: 'No password. You just tap your badge. Has your badge been set up for printing yet?', vi: 'Không có mật khẩu. Em chỉ cần chạm thẻ thôi. Thẻ của em đã được cài để in chưa?' },
          { who: 'Khang', voice: 'nz-nam', text: "I'm not sure. Could you tell me how I can check?", vi: 'Em không chắc. Anh chỉ em cách kiểm tra được không ạ?' },
          { who: 'Corey', voice: 'us-nam', text: "Just try it. If it beeps twice, it's not set up.", vi: 'Cứ thử đi. Nếu nó kêu bíp hai lần là chưa được cài.' },
          { who: 'Khang', voice: 'nz-nam', text: "Would you mind coming with me? Sorry, I know you're busy.", vi: 'Anh đi cùng em một lát có phiền không ạ? Em xin lỗi, em biết anh đang bận.' },
          { who: 'Corey', voice: 'us-nam', text: "Honestly, I've got a call in five minutes. Would you mind waiting till eleven? Or, actually, ask Aiko. She sorted mine out.", vi: 'Nói thật là năm phút nữa anh có cuộc gọi. Em đợi tới mười một giờ được không? Hoặc mà thôi, em hỏi Aiko đi. Chị ấy cài thẻ cho anh đấy.' },
          { who: 'Khang', voice: 'nz-nam', text: 'No problem. Do you happen to know where Aiko sits?', vi: 'Không sao ạ. Anh có tình cờ biết chị Aiko ngồi ở đâu không?' },
          { who: 'Corey', voice: 'us-nam', text: "Fourth floor as well. The desk with all the plants. You can't miss it.", vi: 'Cũng tầng bốn. Cái bàn có cả đống cây ấy. Nhìn là thấy ngay.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Great. Thanks a lot, Corey.', vi: 'Tuyệt. Cảm ơn anh nhiều, Corey.' },
          { who: 'Corey', voice: 'us-nam', text: "Any time. Oh, and if it asks for a code, it's your staff number.", vi: 'Lúc nào cũng được. À, nếu nó đòi mã thì đó là số nhân viên của em.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd15-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Máy in cạnh bếp làm sao?',
            options: ['Hết mực', 'Kẹt giấy từ thứ Hai', 'Chỉ in đen trắng', 'Đang được sửa ở tầng bốn'],
            correct: 1,
            why: '"There\'s one by the kitchen, but **it\'s been jammed since Monday**." jammed = kẹt (giấy).',
          },
          {
            q: 'Vì sao Corey không đi cùng Khang?',
            options: ['Anh ấy không biết máy in ở đâu', 'Năm phút nữa anh ấy có cuộc gọi', 'Anh ấy sắp đi ăn trưa', 'Anh ấy không thích bị làm phiền'],
            correct: 1,
            why: '"**I\'ve got a call in five minutes.**" Rồi anh đưa hai lựa chọn: đợi tới 11 giờ, hoặc hỏi Aiko. Đó là cách từ chối có lối thoát.',
          },
          {
            q: 'Corey nói "You can\'t miss it." Ý là gì?',
            options: ['Em không được bỏ lỡ cuộc họp', 'Cái bàn đó rất dễ nhận ra', 'Em phải đi ngay', 'Aiko không bao giờ vắng mặt'],
            correct: 1,
            why: '**You can\'t miss it** = nhìn là thấy, không thể đi lạc. Người chỉ đường hay nói câu này sau khi tả một chi tiết dễ thấy (bàn có cả đống cây).',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Tầng bốn: "Would you mind…?" — "Yes!"' },
      {
        t: 'canh',
        anh: ['woman-technologist', 'potted-plant', 'chair', 'man-office-worker', 'person-bowing'],
        caption: 'Bàn của **Aiko**, kỹ sư cầu nối (BrSE) người Nhật. Cô cài thẻ cho Khang rất nhanh. Đúng lúc đó **Ben**, lập trình viên người Úc, đi tìm ghế cho một buổi họp.',
      },
      {
        t: 'listen',
        id: 'gtd15-nghe-canh2',
        title: 'Scene 2 — On the fourth floor',
        note: 'Nghe xem: Khang trả lời câu nào khiến Ben hiểu nhầm, Khang đề nghị giúp mấy lần, và phòng họp thứ Sáu có đặt được không.',
        lines: [
          { who: 'Khang', voice: 'nz-nam', text: "Hi, Aiko? I'm Khang, the intern on Harriet's team. I was wondering if you could help me with the printer.", vi: 'Chào chị, chị Aiko phải không ạ? Em là Khang, thực tập sinh nhóm chị Harriet. Em đang muốn hỏi không biết chị có thể giúp em cái máy in được không.' },
          { who: 'Aiko', voice: 'ca-nu', text: 'Of course. Your badge is not working, right? Give it to me, please. One moment.', vi: 'Tất nhiên rồi. Thẻ của em không dùng được, đúng không? Đưa chị nhé. Chờ chị một chút.' },
          { who: 'Aiko', voice: 'ca-nu', text: 'Okay, try now.', vi: 'Xong rồi, em thử lại đi.' },
          { who: 'Khang', voice: 'nz-nam', text: 'One beep. It works! Thank you so much.', vi: 'Kêu một tiếng bíp. Được rồi! Cảm ơn chị nhiều lắm.' },
          { who: 'Ben', voice: 'au-nam', text: "Oh, Khang, good timing. Would you mind if I borrowed your chair for the eleven o'clock? All ours are taken.", vi: 'Ồ, Khang, đúng lúc quá. Anh mượn cái ghế của em cho buổi họp mười một giờ có phiền không? Ghế bên anh hết sạch rồi.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Yes, of course!', vi: '(Khang định nói: "Vâng, tất nhiên rồi, anh cứ lấy!")' },
          { who: 'Ben', voice: 'au-nam', text: "Oh. Right. No worries, mate, I'll find another one.", vi: 'Ồ. À ừ. Không sao đâu em, anh đi tìm cái khác.' },
          { who: 'Aiko', voice: 'ca-nu', text: 'Khang, I think Ben heard "Yes, I mind."', vi: 'Khang, chị nghĩ Ben nghe thành "Có, em thấy phiền đấy".' },
          { who: 'Khang', voice: 'nz-nam', text: "Oh no! Ben, sorry, I meant no, I don't mind at all. Please take it.", vi: 'Ôi không! Anh Ben, em xin lỗi, ý em là không, em không thấy phiền gì cả. Anh cứ lấy đi ạ.' },
          { who: 'Ben', voice: 'au-nam', text: 'Ha! Legend. Cheers.', vi: 'Ha! Em tuyệt quá. Cảm ơn nhé.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Do you want me to carry it to the meeting room for you?', vi: 'Anh có muốn em mang nó sang phòng họp giúp anh không?' },
          { who: 'Ben', voice: 'au-nam', text: "Nah, you're right, I've got it.", vi: 'Thôi, không cần đâu, anh tự mang được.' },
          { who: 'Khang', voice: 'nz-nam', text: "Are you sure? It's heavy. Let me help.", vi: 'Anh chắc không ạ? Nó nặng đấy. Để em giúp.' },
          { who: 'Ben', voice: 'au-nam', text: "Honestly, mate, I'm fine. Thanks, though.", vi: 'Thật mà em, anh ổn. Dù sao cũng cảm ơn em.' },
          { who: 'Aiko', voice: 'ca-nu', text: 'When an Australian says "I\'ve got it" twice, he really means it.', vi: 'Người Úc mà nói "anh tự làm được" hai lần là họ nói thật đấy.' },
          { who: 'Khang', voice: 'nz-nam', text: "Got it. Aiko, do you know if I could book the small meeting room on Friday afternoon? It's for my evaluation with Harriet.", vi: 'Em hiểu rồi. Chị Aiko, chị có biết em có đặt được phòng họp nhỏ chiều thứ Sáu không ạ? Để em làm buổi đánh giá với chị Harriet.' },
          { who: 'Aiko', voice: 'ca-nu', text: 'Hmm. Friday afternoon might be a little difficult. How about Thursday at three? It is free.', vi: 'Ừm. Chiều thứ Sáu thì có lẽ hơi khó. Ba giờ chiều thứ Năm thì sao? Lúc đó phòng trống.' },
          { who: 'Khang', voice: 'nz-nam', text: "Thursday at three is perfect. I'll check with Harriet. Thanks again, Aiko. I owe you one.", vi: 'Ba giờ thứ Năm thì quá hợp ạ. Em sẽ hỏi lại chị Harriet. Cảm ơn chị lần nữa, chị Aiko. Em nợ chị một lần.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd15-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Ben hỏi "Would you mind if I borrowed your chair?". Khang đáp "Yes, of course!". Ben hiểu là gì?',
            options: ['Khang đồng ý cho mượn', 'Khang thấy phiền, không muốn cho mượn', 'Khang muốn đi họp cùng', 'Khang muốn mượn ghế của Ben'],
            correct: 1,
            why: '"Would you mind…?" = "Bạn có **phiền** không?". Đáp **Yes** = "Có, tôi phiền". Muốn đồng ý thì đáp **No, not at all** / **No, go ahead** / **Sure, go ahead**.',
          },
          {
            q: 'Ben nói "Nah, you\'re right, I\'ve got it." Ý anh là gì?',
            options: ['Khang nói đúng, ghế rất nặng', 'Không cần giúp đâu, anh tự mang được', 'Anh ấy đã lấy được ghế khác', 'Anh ấy muốn Khang mang ghế ngay'],
            correct: 1,
            why: 'Tiếng Úc thân mật: **you\'re right** (đọc nhanh "you\'re roight") ở đây = "không sao, ổn mà", không phải "em nói đúng". **I\'ve got it** = tôi tự lo được.',
          },
          {
            q: 'Aiko nói "Friday afternoon might be a little difficult." Thật ra là gì?',
            options: ['Phòng còn trống nhưng hơi ồn', 'Chiều thứ Sáu không đặt được', 'Aiko chưa biết lịch phòng', 'Aiko muốn Khang tự hỏi lễ tân'],
            correct: 1,
            why: 'Lời từ chối kiểu Nhật (và cả kiểu Anh): **might be a little difficult** = không được. Ngay sau đó Aiko đưa phương án khác: thứ Năm lúc 3 giờ.',
          },
          {
            q: 'Cuối cảnh, Khang nói "I owe you one." Câu này dùng để làm gì?',
            options: ['Xin mượn tiền', 'Cảm ơn và hứa sẽ giúp lại khi cần', 'Xin lỗi vì làm phiền', 'Hỏi giá dịch vụ'],
            correct: 1,
            why: '**I owe you one** = "em nợ chị một lần": cảm ơn thân mật, ngầm hứa lần sau sẽ giúp lại. Không liên quan tới tiền.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Hỏi ý kiến trưởng nhóm: quà chia tay' },
      {
        t: 'canh',
        anh: ['woman-office-worker', 'wrapped-gift', 'hot-beverage', 'airplane', 'thinking-face'],
        caption: 'Chiều thứ Tư. Tuần sau **Ben** hết hợp đồng, bay về Brisbane. **Khang** muốn tặng Ben một món quà nhỏ nhưng không biết ở công ty nước ngoài làm vậy có kỳ không, nên hỏi chị **Harriet**, trưởng nhóm người Anh.',
      },
      {
        t: 'listen',
        id: 'gtd15-nghe-canh3',
        title: 'Scene 3 — Asking Harriet',
        note: 'Nghe xem: nhóm thường tặng quà kiểu gì, mỗi người góp khoảng bao nhiêu, Harriet nghĩ gì về ý tưởng của Khang, và cuối cùng chọn quà gì.',
        lines: [
          { who: 'Khang', voice: 'nz-nam', text: 'Harriet, could I ask your opinion on something? It\'s not about work.', vi: 'Chị Harriet, em xin ý kiến chị một chuyện được không ạ? Không phải chuyện công việc.' },
          { who: 'Harriet', voice: 'uk-nu', text: 'Course. Fire away.', vi: 'Tất nhiên. Em cứ nói đi.' },
          { who: 'Khang', voice: 'nz-nam', text: "I was thinking of getting Ben a small goodbye present. Do you think that's okay? I'm not sure what people usually do here.", vi: 'Em đang định mua cho anh Ben một món quà chia tay nho nhỏ. Chị thấy như vậy có được không ạ? Em không chắc ở đây mọi người thường làm thế nào.' },
          { who: 'Harriet', voice: 'uk-nu', text: "Aw, that's sweet. We normally do a card and a whip-round.", vi: 'Ôi, dễ thương quá. Bọn chị thường làm một tấm thiệp và một vụ góp tiền.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Sorry, a whip-round?', vi: 'Xin lỗi chị, "whip-round" là gì ạ?' },
          { who: 'Harriet', voice: 'uk-nu', text: 'Everyone chips in a bit of money, and we buy one nice present together.', vi: 'Mỗi người góp một ít tiền, rồi cả nhóm mua chung một món quà đẹp.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Ah, I see. Do you know how much people usually put in?', vi: 'À, em hiểu rồi. Chị có biết mọi người thường góp bao nhiêu không ạ?' },
          { who: 'Harriet', voice: 'uk-nu', text: 'Whatever you like, honestly. Most people put in about a hundred thousand.', vi: 'Tuỳ em thôi, thật đấy. Đa số mọi người góp khoảng một trăm nghìn.' },
          { who: 'Khang', voice: 'nz-nam', text: "Okay. And what do you think of a coffee set? A phin filter and some coffee from Buôn Ma Thuột.", vi: 'Dạ. Thế chị thấy một bộ cà phê thì sao? Một cái phin và ít cà phê Buôn Ma Thuột.' },
          { who: 'Harriet', voice: 'uk-nu', text: "Hmm, it's a lovely idea… but he's only got hand luggage, and I think he's trying to cut down on coffee.", vi: 'Ừm, ý tưởng hay đấy… nhưng anh ấy chỉ có hành lý xách tay, và chị nghĩ anh ấy đang cố uống ít cà phê lại.' },
          { who: 'Khang', voice: 'nz-nam', text: 'Oh. So maybe not the best choice?', vi: 'Ồ. Vậy có lẽ không phải lựa chọn hay nhất ạ?' },
          { who: 'Harriet', voice: 'uk-nu', text: "Probably not. What would you think about a framed photo of the team? It's light, and it would mean a lot to him.", vi: 'Chắc là không. Em thấy một tấm ảnh cả nhóm đóng khung thì sao? Nó nhẹ, mà với anh ấy lại rất có ý nghĩa.' },
          { who: 'Khang', voice: 'nz-nam', text: "That's a great idea. Would you mind if I organised it?", vi: 'Ý hay quá ạ. Chị có phiền không nếu em lo vụ này?' },
          { who: 'Harriet', voice: 'uk-nu', text: "Mind? I'd love you to. Could you find out whether the printer upstairs does photo paper?", vi: 'Phiền á? Chị mong thế còn không được. Em tìm hiểu giúp chị xem cái máy in trên lầu có in được giấy ảnh không nhé?' },
          { who: 'Khang', voice: 'nz-nam', text: 'Sure. Leave it with me.', vi: 'Dạ được. Chị cứ để em lo.' },
          { who: 'Harriet', voice: 'uk-nu', text: "Brilliant. Oh, and Khang? Keep it quiet. It's a surprise.", vi: 'Tuyệt. À, Khang này? Giữ bí mật nhé. Đây là quà bất ngờ đấy.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd15-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: '"A whip-round" là gì?',
            options: ['Một bữa tiệc chia tay', 'Mỗi người góp một ít tiền để mua chung quà', 'Một tấm thiệp cả nhóm ký', 'Một trò chơi trong văn phòng'],
            correct: 1,
            why: 'Harriet giải thích: "Everyone **chips in** a bit of money, and we buy one nice present together." whip-round là từ của Anh; Mỹ hay nói **pitch in / take up a collection**.',
          },
          {
            q: 'Harriet nghĩ gì về bộ cà phê?',
            options: ['Rất thích, mua ngay', 'Ý hay nhưng không hợp, vì Ben chỉ có hành lý xách tay và đang bớt cà phê', 'Quá đắt', 'Ben không biết pha cà phê phin'],
            correct: 1,
            why: '"It\'s a lovely idea… **but**…" Câu khen mở đầu rồi "but" là cách người Anh nói "không nên". Phần sau "but" mới là ý chính.',
          },
          {
            q: 'Ai sẽ lo món quà cuối cùng, và quà là gì?',
            options: ['Harriet, một bộ cà phê', 'Khang, một tấm ảnh cả nhóm đóng khung', 'Aiko, một cây cảnh', 'Cả nhóm, một vé máy bay'],
            correct: 1,
            why: 'Harriet gợi ý **a framed photo of the team**; Khang hỏi "Would you mind if I organised it?" và Harriet đồng ý: "I\'d love you to."',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Chú ý thứ tự từ trong câu hỏi gián tiếp (**where the printer is**, không phải "where is the printer") và các chữ nhỏ bị nuốt: **if, a, to, it**.',
      },
      {
        t: 'dictation',
        id: 'gtd15-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — mở lời nhờ', spell: 'Sorry to bother you. Have you got a sec?', answer: 'Sorry to bother you. Have you got a sec?', alt: ['Sorry to bother you, have you got a sec?'] },
          { label: 'Câu 2 — hỏi chỗ (câu hỏi gián tiếp)', spell: 'Do you know where the colour printer is?', answer: 'Do you know where the colour printer is?', alt: ['Do you know where the color printer is?'] },
          { label: 'Câu 3 — từ chối có lối thoát', spell: 'Would you mind waiting till eleven?', answer: 'Would you mind waiting till eleven?', alt: ['Would you mind waiting till 11?'] },
          { label: 'Câu 4 — xin mượn', spell: 'Would you mind if I borrowed your chair?', answer: 'Would you mind if I borrowed your chair?' },
          { label: 'Câu 5 — đáp lại cho đúng', spell: "No, I don't mind at all. Please take it.", answer: "No, I don't mind at all. Please take it.", alt: ['No, I do not mind at all. Please take it.', "No I don't mind at all please take it"] },
          { label: 'Câu 6 — nhờ rất mềm', spell: 'I was wondering if you could help me with the printer.', answer: 'I was wondering if you could help me with the printer.' },
          { label: 'Câu 7 — hỏi ý kiến', spell: 'Could I ask your opinion on something?', answer: 'Could I ask your opinion on something?' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Have you got a sec?', 'Bạn rảnh một chút không? Báo trước là sắp nhờ việc nhỏ.', 'Sure, what\'s up? · Can it wait five minutes?'],
          ['Would you mind waiting till eleven?', 'Lời nhờ, nhưng thật ra là **"bây giờ thì không được"**.', 'No problem. I\'ll come back at eleven.'],
          ['…might be a little difficult.', '**Không được.** Kiểu nói rất hay gặp ở người Nhật, cả người Anh.', 'I see. Is there another time that works?'],
          ['Nah, you\'re right, I\'ve got it. (Úc)', 'Không cần giúp đâu. Nói hai lần là thật lòng.', 'Okay! Shout if you need a hand.'],
          ['It\'s a lovely idea, but…', 'Ý chính nằm **sau "but"**: không nên làm thế.', 'Oh, okay. What would you suggest?'],
          ['Fire away.', 'Cứ hỏi đi, cứ nói đi.', '(nói luôn câu hỏi của bạn)'],
          ['Legend! (Úc, Anh)', 'Cảm ơn nhé, bạn tuyệt quá. Lời khen thân mật.', '(mỉm cười) No worries.'],
          ['Leave it with me.', 'Để tôi lo. Tôi nhận việc này.', 'Thanks! Let me know if you need anything.'],
          ['Keep it quiet.', 'Giữ bí mật, đừng nói ra.', 'My lips are sealed.'],
        ],
        caption: 'Ba dòng đầu và dòng 5 đều là **"không"** nói vòng. Người Việt hay chỉ nghe nửa đầu câu ("lovely idea", "would you mind") rồi tưởng là "có".',
      },
      {
        t: 'note',
        title: 'Mẹo: không chắc người ta nhờ gì thì làm gì',
        items: [
          'Lời nhờ thường **dài và vòng**: "I was wondering if you could maybe have a look at… if you get a chance…". Nghe sót một đoạn là không biết họ cần gì, cần khi nào.',
          '**Nhắc lại bằng lời của bạn**: "So you\'d like me to **book the room for Thursday**, right?" Người kia chỉ cần nói "Yes" hoặc sửa lại.',
          'Không rõ **hạn**: "Sure. **When do you need it by?**" (Cần trước lúc nào ạ?). Đây là câu hỏi bị quên nhiều nhất.',
          'Không rõ **mức độ gấp**: "Is it urgent, or can it wait till this afternoon?"',
          'Đừng gật đầu cho qua rồi làm sai. Hỏi lại một câu mất 5 giây, làm lại mất cả buổi.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Nhờ một việc', 'Could you do me a favour?', 'Could you do me a favor?', 'Could you do us a favour? (us = me)'],
          ['Cần giúp một tay', 'Could you give me a hand?', 'Could you give me a hand? · Can you help me out?', 'Give us a hand, would you?'],
          ['Hỏi ý kiến', 'What do you reckon?', 'What do you think?', 'What do you reckon?'],
          ['Mượn tạm (thân)', 'Can I pinch a pen?', 'Can I grab a pen?', 'Can I borrow a pen?'],
          ['Cảm ơn sau khi được giúp', "Cheers, that's brilliant.", "Thanks, I appreciate it.", "Cheers, legend!"],
          ['Không có gì', 'No problem. · Any time.', "You're welcome. · No problem.", 'No worries.'],
          ['Góp tiền mua quà', 'a whip-round', 'pitch in · take up a collection', 'chip in'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi nhờ và cảm ơn. Chú ý: người Anh và Úc hay dùng **us** để nói **me** ("Give us a hand"). Bạn chỉ cần nghe hiểu; khi nói, dùng cột Mỹ là an toàn.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-cv-b1-01 · Could You Send Me the Invoice?** — biến một email ra lệnh cụt lủn thành lời nhờ lịch sự, rồi gọi điện cho nhà cung cấp. Cùng tinh thần "could you…" nhưng bằng email, khác cảnh hôm nay.',
          '**en-b1-02 · The Missing Part** — nhóm sinh viên nói chuyện với bạn chưa nộp phần việc: hỏi trước khi trách.',
          'Phần nhờ đồng nghiệp **xem code, gỡ lỗi, review** thì ở khoá **Technical English at Work** (Courses), và podcast **en-se-b1-03 · Help! I Have a Merge Conflict**.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd15-noi',
    kind: 'speaking',
    title: 'Bậc lịch sự: can you → could you → would you mind',
    goal: 'Nhờ việc đúng mức lịch sự, hỏi khéo bằng câu hỏi gián tiếp, đề nghị giúp và nhận / từ chối lời giúp cho tự nhiên, và xin ý kiến người trên mà không ngại.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** chia bốn nhóm: mở lời · nhờ · đề nghị giúp · hỏi ý kiến và cảm ơn. Bấm loa, **nói to theo**.',
          'Một **cái thang lịch sự** 5 bậc: Can you… → Could you… → Could you possibly… → Would you mind + V-ing… → I was wondering if you could…',
          'Ngữ pháp: **câu hỏi gián tiếp** (Do you know where the printer **is**?) và **Would you mind + V-ing / if I + V2**. Từ nối: **if / whether**.',
          'Một lời nhờ trọn vẹn có **lối thoát** cho người kia ("No worries if not"). Người Việt hay quên phần này.',
          'Ôn lại Ngày 9: **can / could** để nhờ; Ngày 13: **How long have you…?** để mở chuyện trước khi nhờ.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo đúng thứ tự một lần nhờ việc: **gọi + xin phép → hỏi / nhờ → người kia đáp → cảm ơn**. Rồi tới phía ngược lại: **bạn đề nghị giúp** và **xin ý kiến**.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Have you got a sec?', pos: 'phr', ipa: '/hæv ju ˈɡɑːt ə ˈsek/', vi: 'Bạn rảnh một chút không?', ex: 'Corey, have you got a sec? I just need to ask you something.', exVi: 'Corey, anh rảnh chút không? Em chỉ cần hỏi anh một việc.', more: 'Mỹ hay nói: **Do you have a sec? · Got a minute?** sec = second (giây).' },
          { w: 'Sorry to bother you, but…', pos: 'phr', ipa: '/ˈsɑːri tə ˈbɑːðər ju bət/', vi: 'Xin lỗi làm phiền, nhưng…', ex: "Sorry to bother you, but do you know where the stapler is?", exVi: 'Xin lỗi làm phiền, nhưng anh có biết cái dập ghim ở đâu không?' },
          { w: 'Could you give me a hand?', pos: 'phr', ipa: '/kʊd ju ˈɡɪv mi ə ˈhænd/', vi: 'Bạn giúp mình một tay được không?', ex: 'Could you give me a hand with these boxes?', exVi: 'Anh giúp em một tay với mấy cái thùng này được không?', more: 'give someone a hand = giúp ai một tay (việc tay chân, việc nhỏ).', anh: 'handshake' },
          { w: 'Could you do me a favour?', pos: 'phr', ipa: '/kʊd ju ˈduː mi ə ˈfeɪvər/', vi: 'Bạn giúp mình một việc được không?', ex: "Could you do me a favour and water my plant on Monday?", exVi: 'Chị giúp em một việc được không, thứ Hai tưới cây giúp em?', more: 'Mỹ viết **favor**. Người nghe thường đáp: "Sure, what is it?" (họ chưa biết việc gì).' },
          { w: 'Would you mind + V-ing…?', pos: 'phr', ipa: '/wʊd ju ˈmaɪnd/', vi: 'Bạn có phiền… không? (nhờ lịch sự)', ex: 'Would you mind waiting till eleven?', exVi: 'Em đợi tới mười một giờ có được không?', more: 'Sau mind là **V-ing**. Đáp đồng ý: **No, not at all. · Sure, no problem.**' },
          { w: 'Would you mind if I + V2…?', pos: 'phr', ipa: '/wʊd ju ˈmaɪnd ɪf aɪ/', vi: 'Bạn có phiền không nếu mình…? (xin phép)', ex: 'Would you mind if I borrowed your chair?', exVi: 'Anh mượn ghế của em có phiền không?', more: 'Đi với **quá khứ** (borrowed, opened, left) cho mềm. Thân hơn: **Do you mind if I borrow…?**', anh: 'chair' },
          { w: 'I was wondering if you could…', pos: 'phr', ipa: '/aɪ wəz ˈwʌndərɪŋ ɪf ju kʊd/', vi: 'Mình đang muốn hỏi không biết bạn có thể… (rất mềm)', ex: 'I was wondering if you could help me with the printer.', exVi: 'Em đang muốn hỏi không biết chị có thể giúp em cái máy in không.', more: 'Dùng khi nhờ **người chưa quen** hoặc **việc hơi lớn**. "was" không có nghĩa quá khứ, chỉ làm câu mềm.' },
          { w: 'Do you know where … is?', pos: 'phr', ipa: '/də ju ˈnoʊ ˈwer … ɪz/', vi: 'Bạn có biết … ở đâu không?', ex: 'Do you know where the colour printer is?', exVi: 'Anh có biết máy in màu ở đâu không?', more: 'Câu hỏi gián tiếp: **is** đứng **cuối**, không đảo lên trước.', anh: 'printer' },
          { w: 'Do you happen to know…?', pos: 'phr', ipa: '/də ju ˈhæpən tə ˈnoʊ/', vi: 'Bạn có tình cờ biết… không?', ex: 'Do you happen to know where Aiko sits?', exVi: 'Anh có tình cờ biết chị Aiko ngồi đâu không?', more: '"happen to" làm câu nhẹ hơn: không biết cũng không sao.' },
          { w: 'Any idea who…?', pos: 'phr', ipa: '/ˈeni aɪˈdiːə ˈhuː/', vi: 'Có biết ai… không? (thân mật)', ex: 'Any idea who sets up the badges?', exVi: 'Có biết ai cài thẻ không?' },
          { w: 'Could I borrow…?', pos: 'phr', ipa: '/kʊd aɪ ˈbɑːroʊ/', vi: 'Mình mượn… được không?', ex: 'Could I borrow your charger for an hour?', exVi: 'Em mượn sạc của chị một tiếng được không?', more: '**borrow** = mượn (mình lấy). **lend** = cho mượn (người kia đưa). Could you **lend me** your charger?', anh: 'electric-plug' },
          { w: 'when you get a chance', pos: 'phr', ipa: '/wen ju ˌɡet ə ˈtʃæns/', vi: 'khi nào bạn rảnh (không gấp)', ex: 'Could you sign my form when you get a chance?', exVi: 'Khi nào chị rảnh, chị ký phiếu giúp em nhé?' },
          { w: 'No worries if not.', pos: 'phr', ipa: '/ˈnoʊ ˈwɝːiz ɪf ˈnɑːt/', vi: 'Không được thì cũng không sao.', ex: "Could you print one for me too? No worries if not.", exVi: 'Anh in giúp em một bản luôn được không? Không được cũng không sao ạ.', more: 'Câu **lối thoát**: người kia từ chối dễ hơn, nên lại dễ đồng ý hơn.' },
          { w: 'Need a hand?', pos: 'phr', ipa: '/ˈniːd ə ˈhænd/', vi: 'Cần giúp một tay không?', ex: 'Need a hand with that chair?', exVi: 'Cần giúp một tay với cái ghế đó không?' },
          { w: 'Do you want me to…?', pos: 'phr', ipa: '/də ju ˈwɑːnt mi tə/', vi: 'Bạn có muốn mình… không?', ex: 'Do you want me to carry it for you?', exVi: 'Anh có muốn em mang giúp không?', more: 'Trang trọng hơn: **Would you like me to…?**' },
          { w: 'Shall I…?', pos: 'phr', ipa: '/ʃəl aɪ/', vi: 'Để mình… nhé? (đề nghị)', ex: 'Shall I book the room for Thursday?', exVi: 'Để em đặt phòng cho thứ Năm nhé?', more: 'Rất hay ở Anh. Người Mỹ hay nói **Should I…?** hoặc **Want me to…?**' },
          { w: 'Let me get that for you.', pos: 'phr', ipa: '/ˈlet mi ˈɡet ðæt fər ju/', vi: 'Để mình làm / lấy giúp bạn.', ex: 'Oh, let me get that door for you.', exVi: 'Ồ, để em giữ cửa giúp chị.' },
          { w: "That'd be great, thanks.", pos: 'phr', ipa: '/ˈðætəd bi ˈɡreɪt ˈθæŋks/', vi: 'Thế thì tốt quá, cảm ơn. (nhận lời giúp)', ex: "Want me to print it for you? — That'd be great, thanks.", exVi: 'Muốn anh in giúp không? — Thế thì tốt quá, cảm ơn anh.' },
          { w: "Thanks, but I've got it.", pos: 'phr', ipa: '/ˈθæŋks bət aɪv ˈɡɑːt ɪt/', vi: 'Cảm ơn, nhưng mình tự làm được.', ex: "Need a hand? — Thanks, but I've got it.", exVi: 'Cần giúp không? — Cảm ơn, nhưng em tự làm được.' },
          { w: 'No, not at all.', pos: 'phr', ipa: '/ˈnoʊ ˈnɑːt ət ˈɔːl/', vi: 'Không phiền gì cả. (đáp Would you mind…?)', ex: 'Would you mind if I sat here? — No, not at all.', exVi: 'Em ngồi đây có phiền không? — Không phiền gì cả.', more: 'Cũng được: **No, go ahead. · Sure, go ahead.** Đừng đáp một chữ **Yes**.' },
          { w: "I'm afraid I can't right now.", pos: 'phr', ipa: '/aɪm əˈfreɪd aɪ ˈkænt raɪt ˈnaʊ/', vi: 'Tiếc là giờ mình không làm được.', ex: "I'm afraid I can't right now, but I'm free after lunch.", exVi: 'Tiếc là giờ em không làm được, nhưng sau bữa trưa em rảnh.', more: 'Từ chối xong **đưa phương án khác**, như Corey ở Cảnh 1.' },
          { w: 'When do you need it by?', pos: 'phr', ipa: '/wen də ju ˈniːd ɪt baɪ/', vi: 'Bạn cần cái này trước lúc nào?', ex: 'Sure, I can do that. When do you need it by?', exVi: 'Dạ được, em làm được. Chị cần trước lúc nào ạ?', more: 'by = **trước / muộn nhất là**: by Friday, by 3 pm.' },
          { w: 'Could I ask your opinion on something?', pos: 'phr', ipa: '/kʊd aɪ ˈæsk jər əˈpɪnjən ɑːn ˈsʌmθɪŋ/', vi: 'Mình xin ý kiến bạn một chuyện được không?', ex: "Harriet, could I ask your opinion on something? It's not about work.", exVi: 'Chị Harriet, em xin ý kiến chị một chuyện được không ạ? Không phải chuyện công việc.', anh: 'thinking-face' },
          { w: 'What do you think of…?', pos: 'phr', ipa: '/ˈwʌt də ju ˈθɪŋk əv/', vi: 'Bạn thấy… thế nào?', ex: 'What do you think of a framed photo?', exVi: 'Chị thấy một tấm ảnh đóng khung thế nào?', more: 'Anh, Úc: **What do you reckon?** (Bạn thấy sao?)' },
          { w: 'What would you suggest?', pos: 'phr', ipa: '/ˈwʌt wʊd ju səɡˈdʒest/', vi: 'Bạn gợi ý gì?', ex: "So the coffee set isn't a good idea. What would you suggest?", exVi: 'Vậy bộ cà phê không ổn. Chị gợi ý gì ạ?' },
          { w: 'Leave it with me.', pos: 'phr', ipa: '/ˈliːv ɪt wɪð ˈmiː/', vi: 'Để mình lo.', ex: 'Can you find out about the photo paper? — Sure, leave it with me.', exVi: 'Em tìm hiểu vụ giấy ảnh giúp chị nhé? — Dạ, chị cứ để em lo.' },
          { w: 'I owe you one.', pos: 'phr', ipa: '/aɪ ˈoʊ ju ˈwʌn/', vi: 'Mình nợ bạn một lần. (cảm ơn thân mật)', ex: 'Thanks for sorting out my badge. I owe you one.', exVi: 'Cảm ơn chị đã cài thẻ giúp em. Em nợ chị một lần.' },
          { w: 'chip in', pos: 'v', ipa: '/ˌtʃɪp ˈɪn/', vi: 'góp tiền (mua quà chung)', ex: "We're all chipping in for Ben's present.", exVi: 'Cả nhóm đang góp tiền mua quà cho anh Ben.', anh: 'wrapped-gift' },
        ],
      },

      { t: 'h', text: '2. Cái thang lịch sự: càng lên càng mềm' },
      {
        t: 'p',
        text: 'Cùng một việc (in giúp một bản) nhưng nói với **bạn thân**, **đồng nghiệp** hay **sếp lớn** thì khác. Quy tắc: **việc càng lớn, người càng xa, câu càng dài**. Nhờ bạn thân mà dùng bậc 5 nghe như mỉa mai; nhờ khách mà dùng bậc 1 nghe như ra lệnh.',
      },
      {
        t: 'table',
        head: ['Bậc', 'Khung câu', 'Ví dụ', 'Dùng khi'],
        rows: [
          ['1', 'Can you + V?', 'Can you print this for me?', 'Bạn thân, việc rất nhỏ'],
          ['2', 'Could you + V?', 'Could you print this for me?', 'Đồng nghiệp: **mặc định an toàn**'],
          ['3', 'Could you possibly + V?', 'Could you possibly print this today?', 'Việc hơi phiền, hơi gấp'],
          ['4', 'Would you mind + V-ing?', 'Would you mind printing this for me?', 'Người trên, người chưa quen'],
          ['5', 'I was wondering if you could + V', 'I was wondering if you could print this for me.', 'Việc lớn, sếp lớn, người hoàn toàn lạ'],
        ],
        caption: 'Thêm **please**, **just**, **quickly**, **if you get a chance** vào bất cứ bậc nào cũng làm câu mềm hơn nửa bậc: "Could you **just** sign this **when you get a chance**?"',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Mở lời', 'Hey, got a sec?', 'Sorry to bother you. Have you got a minute?', 'Excuse me, do you have a moment?'],
          ['Hỏi chỗ', 'Where\'s the stapler?', 'Do you know where the stapler is?', 'Could you tell me where I can find a stapler?'],
          ['Mượn đồ', 'Can I grab your charger?', 'Could I borrow your charger?', 'Would you mind if I borrowed your charger?'],
          ['Đề nghị giúp', 'Need a hand?', 'Do you want me to help?', 'Would you like me to help with that?'],
          ['Từ chối lời giúp', "Nah, I'm good.", "Thanks, but I've got it.", "That's very kind, but I'm fine, thank you."],
          ['Hỏi ý kiến', 'What do you reckon?', 'What do you think of this?', 'Could I ask your opinion on something?'],
          ['Cảm ơn', 'Legend! · Cheers!', 'Thanks, I owe you one.', 'Thank you so much. I really appreciate it.'],
        ],
        caption: 'Chưa biết chọn mức nào thì dùng **cột giữa**. Với người Nhật lớn tuổi hoặc khách, bắt đầu ở cột trang trọng.',
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Một lời nhờ trọn vẹn: 5 bước',
        caption: 'Bước 4 là phần người Việt hay bỏ. Có "lối thoát", người kia thấy được tôn trọng nên lại **dễ nhận lời hơn**.',
        steps: [
          { label: 'Gọi + xin phép', sub: 'Sorry to bother you, Corey.' },
          { label: 'Lý do một câu', sub: 'I need to print a form for uni.' },
          { label: 'Lời nhờ', sub: 'Would you mind showing me the printer?' },
          { label: 'Lối thoát', sub: "No worries if you're busy." },
          { label: 'Cảm ơn', sub: 'Thanks, I owe you one.' },
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Hỏi thẳng "**Where is** the printer?" không sai, nhưng hơi cụt. Muốn hỏi khéo, bạn **bọc** câu hỏi đó trong một câu mở: **Do you know… / Could you tell me… / I was wondering…** Khi bọc lại, phần câu hỏi bên trong **trở về thứ tự câu kể**: S + V. Đây là lỗi người học ở mọi trình độ đều mắc.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Do you know / Could you tell me + Wh- + S + V?',
            vi: 'Câu hỏi gián tiếp có từ để hỏi. Chủ ngữ đứng **trước** động từ, bỏ do / does / did.',
            examples: [
              { en: 'Do you know where the colour printer is?', vi: 'Anh có biết máy in màu ở đâu không?' },
              { en: 'Could you tell me what time the meeting starts?', vi: 'Chị cho em biết mấy giờ buổi họp bắt đầu được không?' },
              { en: 'Do you happen to know where Aiko sits?', vi: 'Anh có tình cờ biết chị Aiko ngồi đâu không?' },
            ],
          },
          {
            formula: 'Do you know + if / whether + S + V?',
            vi: 'Câu hỏi gián tiếp có / không: thêm **if** (hoặc whether) vào chỗ nối.',
            examples: [
              { en: 'Do you know if I need a password?', vi: 'Anh có biết em có cần mật khẩu không?' },
              { en: 'Do you know if I could book the small room?', vi: 'Chị có biết em có đặt được phòng nhỏ không?' },
              { en: 'Could you find out whether the printer does photo paper?', vi: 'Em tìm hiểu xem máy in có in giấy ảnh không nhé?' },
            ],
          },
          {
            formula: 'I was wondering if + S + could + V',
            vi: 'Lời nhờ / xin mềm nhất. Không có dấu chấm hỏi, vì nó là câu kể.',
            examples: [
              { en: 'I was wondering if you could help me with the printer.', vi: 'Em muốn hỏi không biết chị có thể giúp em cái máy in không.' },
              { en: 'I was wondering if I could leave the form on your desk.', vi: 'Em muốn hỏi em để phiếu trên bàn chị được không.' },
              { en: 'I was wondering if anyone had a spare charger.', vi: 'Mình muốn hỏi có ai có sạc dư không.' },
            ],
          },
          {
            formula: 'Would you mind + V-ing?',
            vi: 'Nhờ **người kia** làm gì. Sau mind là V-ing, không phải to V.',
            examples: [
              { en: 'Would you mind waiting till eleven?', vi: 'Em đợi tới mười một giờ được không?' },
              { en: 'Would you mind showing me how it works?', vi: 'Anh chỉ em cách dùng được không?' },
              { en: 'Would you mind keeping it quiet?', vi: 'Em giữ bí mật giúp chị nhé?' },
            ],
          },
          {
            formula: 'Would you mind if I + V2? · Do you mind if I + V?',
            vi: 'Xin phép **mình** làm gì. Would + quá khứ (mềm hơn); Do + hiện tại (thân hơn).',
            examples: [
              { en: 'Would you mind if I borrowed your chair?', vi: 'Anh mượn ghế của em có phiền không?' },
              { en: 'Would you mind if I organised it?', vi: 'Chị có phiền không nếu em lo vụ này?' },
              { en: 'Do you mind if I sit here?', vi: 'Em ngồi đây có phiền không?' },
            ],
          },
          {
            formula: 'Do you want me to + V? · Shall I + V?',
            vi: 'Đề nghị giúp. Sau want me là **to V**; sau Shall I là V nguyên mẫu.',
            examples: [
              { en: 'Do you want me to carry it for you?', vi: 'Anh có muốn em mang giúp không?' },
              { en: 'Shall I book the room for Thursday?', vi: 'Để em đặt phòng thứ Năm nhé?' },
              { en: 'Would you like me to print a copy?', vi: 'Chị có muốn em in một bản không?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu hỏi thẳng', 'Câu hỏi gián tiếp (khéo hơn)', 'Đã đổi gì'],
        rows: [
          ['Where **is** the printer?', 'Do you know where the printer **is**?', 'is xuống cuối'],
          ['What time **does** the meeting **start**?', 'Could you tell me what time the meeting **starts**?', 'bỏ does, start thêm -s'],
          ['Where **did** Ben **put** the chairs?', 'Do you know where Ben **put** the chairs?', 'bỏ did, put ở quá khứ'],
          ['**Is** Aiko in today?', 'Do you know **if** Aiko **is** in today?', 'thêm if, is về sau chủ ngữ'],
          ['**Can** I book room 4?', 'I was wondering **if** I **could** book room 4.', 'thêm if, can → could, câu kể'],
          ['Who **set up** your badge?', 'Any idea who **set up** your badge?', 'giữ nguyên (who là chủ ngữ)'],
        ],
        caption: 'Mẹo kiểm tra nhanh: đọc phần sau từ để hỏi. Nếu nó **nghe như câu kể** ("the printer is", "the meeting starts") là đúng.',
      },
      {
        t: 'rule',
        formula: 'Do you know / Could you tell me + Wh- / if + S + V · Would you mind + V-ing / if I + V2',
        vi: 'Bọc câu hỏi trong một câu mở thì phần bên trong trở về thứ tự câu kể. Would you mind luôn đi với V-ing (nhờ người kia) hoặc if I + quá khứ (xin phép mình).',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: if / whether',
        items: [
          '**if** nối một câu hỏi có / không vào câu mở: "Is the room free?" → "Do you know **if** the room is free?"',
          '**whether** cùng nghĩa, trang trọng hơn một chút, hay đi kèm **or not**: "Could you find out **whether** the printer does photo paper **or not**?"',
          'Khi nói, **if** phổ biến hơn nhiều. Khi viết email trang trọng, dùng **whether**.',
          'Đừng nhầm với **if** điều kiện (Ngày 17): "**If** it beeps twice, it\'s not set up." Ở đó if = "nếu".',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd15-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'Do you know where + S + V · Do you know if… · Would you mind + V-ing · Would you mind if I + V2',
        items: [
          { q: 'Anh có biết phòng họp nhỏ ở đâu không?', hint: 'do you know, small meeting room', answers: ['Do you know where the small meeting room is?', 'Do you know where the small meeting room is'] },
          { q: 'Chị có biết hôm nay chị Aiko có ở văn phòng không?', hint: 'do you know if, in today', answers: ['Do you know if Aiko is in today?', 'Do you know whether Aiko is in today?', 'Do you know if Aiko is in the office today?', 'Do you know whether Aiko is in the office today?'] },
          { q: 'Anh đợi em năm phút được không ạ? (would you mind)', hint: 'would you mind, wait', answers: ['Would you mind waiting five minutes?', 'Would you mind waiting for five minutes?', 'Would you mind waiting 5 minutes?', 'Would you mind waiting for 5 minutes?', 'Would you mind waiting five minutes for me?'] },
          { q: 'Em mượn sạc của chị có phiền không ạ?', hint: 'would you mind if I, borrow', answers: ['Would you mind if I borrowed your charger?', 'Do you mind if I borrow your charger?', 'Would you mind if I borrow your charger?'] },
          { q: 'Để em đặt phòng cho thứ Năm nhé?', hint: 'shall I / do you want me to, book', answers: ['Shall I book the room for Thursday?', 'Do you want me to book the room for Thursday?', 'Should I book the room for Thursday?', 'Would you like me to book the room for Thursday?', 'Shall I book a room for Thursday?', 'Do you want me to book a room for Thursday?'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~Do you know where is the printer?~~ → **Do you know where the printer is?** Trong câu hỏi gián tiếp, động từ **không đảo lên trước**. Lỗi này người học trình độ IELTS 7 vẫn mắc khi nói nhanh.',
          '~~Would you mind to send me the photo?~~ → **Would you mind sending me the photo?** Sau mind luôn là **V-ing**.',
          '~~(Được hỏi "Would you mind…?") Yes, sure!~~ → **No, not at all. / No, go ahead.** "Yes" = "Có, tôi phiền". Người bản xứ nhiều khi vẫn hiểu "Sure!" là đồng ý, nhưng một chữ **Yes** trơn thì rất dễ bị hiểu là từ chối, như Ben ở Cảnh 2.',
          '~~Can you borrow me your charger?~~ → **Could I borrow your charger?** hoặc **Could you lend me your charger?** borrow = mượn (mình nhận), lend = cho mượn (người kia đưa). Tiếng Việt dùng chung chữ "mượn" nên hay lẫn.',
          '~~Help me! / Help me check this paper.~~ → **Could you give me a hand with this?** "Help me!" đứng một mình nghe như **kêu cứu**. Mở bằng could you, người ta mới thấy là lời nhờ.',
          '~~Do you want me help you?~~ → **Do you want me to help?** / **Want a hand?** Sau want + người phải có **to**.',
          '~~Can you give me some advices?~~ → **Could you give me some advice?** advice không đếm được, không thêm -s. Muốn đếm: **a piece of advice**.',
          '~~No, no, no need! (rồi người kia mời lần nữa, lại "no need", tới lần thứ ba mới nhận)~~ → **That\'d be great, thanks.** hoặc **Thanks, but I\'ve got it.** Ở Anh, Mỹ, Úc người ta thường **tin câu trả lời đầu tiên**. Từ chối cho lịch sự là sẽ không được mời lần hai.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi nhờ và khi được nhờ' },
      {
        t: 'p',
        text: 'Lúc nhờ việc, cách bạn **tới gần** người ta quan trọng không kém câu bạn nói. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi nhờ, đề nghị giúp và cảm ơn',
        items: [
          { anh: 'headphone', w: 'Have you got a sec?', ro: '/hæv ju ˈɡɑːt ə ˈsek/', vi: 'Người kia đeo tai nghe = đang tập trung. Đứng **trong tầm mắt** họ, chờ họ tháo tai nghe. Đừng vỗ vai từ phía sau.' },
          { anh: 'waving-hand', w: 'Sorry to bother you.', ro: '/ˈsɑːri tə ˈbɑːðər ju/', vi: 'Vẫy nhẹ một cái ở mép bàn để họ thấy bạn. Ở công sở phương Tây, chạm vào người lạ để gọi là bất lịch sự.' },
          { anh: 'index-pointing-up', w: 'Just a sec.', ro: '/ˈdʒʌst ə ˈsek/', vi: 'Người ta giơ **một ngón tay** = "đợi tôi một chút". Đứng chờ, đừng nói tiếp.' },
          { anh: 'palm-up-hand', w: 'Please, take my chair.', ro: '/ˈpliːz ˈteɪk maɪ ˈtʃer/', vi: 'Mời ai lấy gì, đi trước: **bàn tay mở, ngửa**, hướng về phía đó.' },
          { anh: 'folded-hands', w: 'Thank you so much.', ro: '/ˈθæŋk ju soʊ ˈmʌtʃ/', vi: 'Chắp tay cảm ơn: người Nhật, Thái hiểu ngay. Người Anh, Mỹ đôi khi hiểu thành "**làm ơn đi mà**" (van xin). Với họ, nói và mỉm cười là đủ.' },
          { anh: 'person-shrugging', w: "I'm not sure, sorry.", ro: '/aɪm nɑːt ˈʃʊr ˈsɑːri/', vi: 'Nhún vai + mở hai tay = "tôi không biết". Thân mật, đừng dùng với khách.' },
          { anh: 'thinking-face', w: 'Hmm, let me think.', ro: '/hm ˈlet mi ˈθɪŋk/', vi: 'Được hỏi ý kiến, dừng 2 giây, tay chạm cằm: người nghe thấy bạn **đang nghĩ thật**, không trả lời cho xong.' },
          { anh: 'person-bowing', w: 'Sorry to bother you, Aiko-san.', ro: '', vi: 'Nhờ đồng nghiệp người Nhật: cúi đầu nhẹ khi mở lời và khi cảm ơn. Họ thường đáp lại cũng một cái cúi nhẹ.' },
          { anh: 'thumbs-up', w: 'Leave it with me.', ro: '/ˈliːv ɪt wɪð ˈmiː/', vi: 'Nhận việc xong giơ ngón cái = "để tôi lo". Ổn ở Anh, Mỹ, Úc, Việt Nam.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Gọi người đang làm việc', 'Gọi to tên, vỗ vai là bình thường.', 'Đứng trong tầm mắt, chờ họ ngẩng lên. Hoặc nhắn tin trước: "Got a sec?"', 'Chờ lâu hơn nữa, mở lời bằng "Sumimasen" (xin lỗi).'],
          ['Đề nghị giúp', 'Từ chối 2–3 lần mới nhận là lịch sự.', 'Tin câu trả lời đầu tiên. "No, thanks" là thật.', 'Hay từ chối khách sáo lần đầu, như Việt Nam.'],
          ['Từ chối lời nhờ', 'Ngại nói "không", hay hứa rồi không làm.', 'Từ chối thẳng nhưng mềm + đưa phương án khác.', 'Rất vòng: "That might be difficult" = không.'],
          ['Cảm ơn việc nhỏ', 'Với người thân quen, cảm ơn nhiều nghe khách sáo.', 'Cảm ơn **mọi việc nhỏ**, kể cả giữ cửa, đưa cây bút.', 'Cảm ơn nhiều lần, cả lần gặp sau.'],
          ['Sếp hỏi ý kiến', 'Ngại nói, nói "dạ em thấy sao cũng được".', 'Sếp hỏi là **muốn nghe thật**. "Sao cũng được" bị coi là không quan tâm.', 'Nói ý kiến nhưng rất mềm, hay kèm "I might be wrong, but…".'],
        ],
        caption: 'Hai chỗ người Việt dễ hố nhất: **nài giúp ba lần** và **không dám có ý kiến**. Ở công ty nước ngoài, ý kiến có lý do của thực tập sinh vẫn được nghe.',
      },

      { t: 'h', text: '6. Phát âm: could you, would you mind, wondering' },
      {
        t: 'p',
        text: 'Khi nói nhanh, **could you** và **would you** dính lại thành "cút-chờ", "gút-chờ": âm /d/ gặp /j/ biến thành /dʒ/. **wondering** (tự hỏi, /ˈwʌn/) khác **wandering** (đi lang thang, /ˈwɑːn/). Lời nhờ lịch sự thì **giọng đi xuống mềm** ở cuối, không gắt lên.',
      },
      {
        t: 'phatam',
        id: 'gtd15-phat-am',
        title: 'Luyện phát âm — nối âm và ngữ điệu trong lời nhờ',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nói liền một hơi, nhấn vào từ in nghĩa chính (hand, mind, printer), từ nhỏ đọc lướt.',
        items: [
          { text: 'Could you give me a hand?', ipa: 'kʊdʒə ɡɪv mi ə hænd', vi: 'could you → /kʊdʒə/ "cút-chờ" · nhấn vào hand' },
          { text: 'Would you mind waiting?', ipa: 'wʊdʒə maɪnd weɪtɪŋ', vi: 'would you → /wʊdʒə/ · mind có /nd/ cuối · waiting: t Mỹ đọc nhẹ như /d/' },
          { text: 'Do you know where the printer is?', ipa: 'dəjə noʊ wer ðə prɪntər ɪz', vi: 'do you đọc lướt /dəjə/ · lên giọng nhẹ ở cuối (vẫn là câu hỏi có / không)' },
          { text: 'I was wondering if you could help me.', ipa: 'aɪ wəz wʌndərɪŋ ɪf ju kʊd help mi', vi: 'wondering /ˈwʌn/ như "uân", không phải wandering · was đọc nhẹ /wəz/' },
          { text: 'Have you got a sec?', ipa: 'həv ju ɡɑːɾə sek', vi: 'got a nối thành "gá-đờ" (t giữa hai nguyên âm kiểu Mỹ) · sec có /k/ cuối' },
          { text: 'No, not at all.', ipa: 'noʊ nɑːt ə tɔːl', vi: 'not‿at‿all nối liền: "nót-tơ-tôl" (Anh) / "na-đơ-đôl" (Mỹ)' },
          { text: 'Let me get that for you.', ipa: 'lemi ɡet ðæt fər ju', vi: 'let me → "lem-mi" · for đọc nhẹ /fər/' },
          { text: 'I owe you one.', ipa: 'aɪ oʊ ju wʌn', vi: 'owe /oʊ/ như "âu" · one /wʌn/ như "uân", không phải "oan"' },
        ],
      },

      { t: 'h', text: '7. Nhập vai: mượn sạc và giúp lại' },
      {
        t: 'dialogue',
        title: 'Khu làm việc — Khang hết pin, nhờ chị Tess',
        lines: [
          { who: 'Khang', role: 'a', text: 'Hi Tess, sorry to bother you. Have you got a minute?', vi: 'Chào chị Tess, xin lỗi làm phiền chị. Chị rảnh một phút không ạ?' },
          { who: 'Tess', role: 'b', text: "Sure. What's up?", vi: 'Được chứ. Có chuyện gì thế?' },
          { who: 'Khang', role: 'a', text: "My laptop's at five percent, and I left my charger at home. Would you mind if I borrowed yours for an hour?", vi: 'Máy em còn năm phần trăm, mà em để quên sạc ở nhà. Em mượn sạc của chị một tiếng có phiền không ạ?' },
          { who: 'Tess', role: 'b', text: "No, not at all. Here you go. I need it back by two, though.", vi: 'Không phiền gì đâu. Đây em. Nhưng hai giờ chị cần lấy lại nhé.' },
          { who: 'Khang', role: 'a', text: "That's fine. I'll bring it back before two. Thanks so much.", vi: 'Dạ được ạ. Em sẽ trả trước hai giờ. Cảm ơn chị nhiều.' },
          { who: 'Tess', role: 'b', text: "No problem. Oh, do you know if the big meeting room is free this afternoon?", vi: 'Không có gì. À, em có biết chiều nay phòng họp lớn có trống không?' },
          { who: 'Khang', role: 'a', text: "I think it's free after three. Shall I check for you?", vi: 'Em nghĩ sau ba giờ thì trống. Để em kiểm tra giúp chị nhé?' },
          { who: 'Tess', role: 'b', text: "That'd be great, thanks. And could you book it for half three if it's free?", vi: 'Thế thì tốt quá, cảm ơn em. Nếu trống thì em đặt giúp chị lúc ba rưỡi được không?' },
          { who: 'Khang', role: 'a', text: 'Sure. Leave it with me.', vi: 'Dạ được. Chị cứ để em lo.' },
          { who: 'Tess', role: 'b', text: "You're a star. Thanks, Khang.", vi: 'Em tuyệt quá. Cảm ơn em, Khang.' },
          { who: 'Khang', role: 'a', text: 'Thank you for the charger. I owe you one.', vi: 'Em cảm ơn chị vì cái sạc. Em nợ chị một lần.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd15-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Khang (5 câu)',
        items: [
          { vi: 'Xin lỗi làm phiền chị. Chị rảnh một phút không ạ?', chips: ['Sorry', 'to', 'bother', 'you.', 'Have', 'you', 'got', 'a', 'minute?', 'disturb', 'time'], answer: ['Sorry', 'to', 'bother', 'you.', 'Have', 'you', 'got', 'a', 'minute?'] },
          { vi: 'Em mượn sạc của chị có phiền không ạ?', chips: ['Would', 'you', 'mind', 'if', 'I', 'borrowed', 'your', 'charger?', 'lend', 'to'], answer: ['Would', 'you', 'mind', 'if', 'I', 'borrowed', 'your', 'charger?'] },
          { vi: 'Chị có biết phòng họp lớn có trống không?', chips: ['Do', 'you', 'know', 'if', 'the', 'big', 'meeting', 'room', 'is', 'free?', 'where', 'does'], answer: ['Do', 'you', 'know', 'if', 'the', 'big', 'meeting', 'room', 'is', 'free?'] },
          { vi: 'Để em kiểm tra giúp chị nhé?', chips: ['Shall', 'I', 'check', 'for', 'you?', 'to', 'me'], answer: ['Shall', 'I', 'check', 'for', 'you?'] },
          { vi: 'Thế thì tốt quá, cảm ơn.', chips: ["That'd", 'be', 'great,', 'thanks.', 'is', 'would'], answer: ["That'd", 'be', 'great,', 'thanks.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd15-noi-tra-loi',
        part: '1',
        questions: [
          "Hey, would you mind if I sat at your desk while you're at lunch?",
          'Do you know where I can get a coffee near here?',
          'Need a hand with that? It looks heavy.',
          "I'm thinking of bringing some Vietnamese snacks for the team on Friday. What do you think?",
          'Could you do me a favour?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Tess, a friendly British office manager at a software company in Da Nang. I am a Vietnamese intern. It is a busy afternoon. I need to ask you for three things: where the spare chargers are kept, whether I can borrow a meeting room tomorrow morning, and your opinion on a small gift for a colleague who is leaving. Answer naturally at B1 level. Sometimes say no politely and offer another option (for example: \'Tomorrow morning might be tricky. How about after lunch?\'). Once, ask me \'Would you mind…?\' and check that I answer correctly. If I ask direct questions like \'Where is…?\', continue, but at the end tell me in Vietnamese how to make them polite with \'Do you know where… is?\'. After 10 turns, give me two things I did well and two things to fix, in Vietnamese."',
          'Làm **2 lượt**. Lượt hai đổi vai: AI là thực tập sinh nhờ bạn; bạn phải **từ chối một lần** có lối thoát và **đề nghị giúp một lần** bằng Shall I…? / Do you want me to…?',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd15-doc',
    kind: 'reading',
    title: 'Tin nhắn nhờ việc: đọc giọng điệu',
    goal: 'Đọc năm tin nhắn nhờ việc trong ứng dụng chat công ty và nhận ra: đây là lời nhờ tuỳ bạn hay một yêu cầu phải làm, gấp hay không, hạn khi nào, rồi trả lời đúng mức.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Năm tin nhắn **thật kiểu** Khang nhận trong một buổi sáng: từ trưởng nhóm, đồng nghiệp, kỹ sư Nhật, phòng hành chính và anh Ben sắp về nước.',
          'Câu hỏi quan trọng nhất khi đọc tin nhờ việc: **"Có phải làm không, và làm trước lúc nào?"** Chữ lịch sự không có nghĩa là tuỳ ý.',
          'Dấu hiệu cần soi: **ai gửi**, **có hạn chót không**, **có lối thoát không** (no worries if not), **có hậu quả không**.',
          'Dùng lại câu hỏi gián tiếp và Would you mind… của bài Nói để trả lời.',
        ],
      },

      { t: 'h', text: '1. Đọc năm tin nhắn' },
      {
        t: 'canh',
        anh: ['laptop', 'speech-balloon', 'potted-plant', 'hot-beverage', 'spiral-calendar'],
        caption: 'Sáng thứ Tư, Khang mở ứng dụng chat của Halyard Tech và thấy năm tin nhắn mới. Tin nào cũng lịch sự, nhưng không phải tin nào cũng "tuỳ bạn".',
      },
      {
        t: 'passage',
        title: "Khang's messages — Wednesday morning",
        intro: 'Đọc một lượt, chưa tra từ. Để ý chỗ in đậm: đó là các dấu hiệu giọng điệu.',
        paras: [
          {
            label: 'A',
            text: '**Harriet Moss** (Team Lead) 9:02 — Morning Khang! **Could you possibly** sort out the team photo for Ben\'s card? Everyone\'s free at 4 today, so that would be the best time. The frame needs to be ready **by Thursday lunchtime**. Thanks a million!',
          },
          {
            label: 'B',
            text: '**Corey Walsh** 9:40 — hey, **any chance** you could grab me an iced latte if you\'re going downstairs? **no worries if not** 🙂',
          },
          {
            label: 'C',
            text: '**Aiko Ishida** 10:15 — Good morning Khang-san. **I am sorry to bother you when you are busy.** If it is not too much trouble, could you please tell me which day is better for you for the printer training, Thursday or Friday? **I would be grateful if you could reply by tomorrow.** Thank you very much.',
          },
          {
            label: 'D',
            text: '**#danang-office** — **Office Team** 11:00 — Hi all! **Would everyone mind** clearing their desks by 6 pm on Friday? The cleaners are coming in over the weekend. **Anything left on desks will be moved to the lost-and-found box.** Thanks for your help! 🙏',
          },
          {
            label: 'E',
            text: '**Ben Carter** 11:32 — Mate, **quick favour** — would you mind adopting my peace lily when I leave? It only needs water on Mondays. **No stress if you can\'t**, I can ask Aiko. Cheers!',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd15-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Tin A của Harriet mở bằng "Could you possibly…". Khang nên hiểu thế nào?',
            options: ['Tuỳ Khang, không làm cũng được', 'Đây là việc trưởng nhóm giao, có hạn chót, phải làm', 'Harriet đang hỏi ý kiến Khang', 'Harriet muốn Khang chụp ảnh ngay bây giờ'],
            correct: 1,
            why: 'Người gửi là **trưởng nhóm**, có **hạn chót** (by Thursday lunchtime) và có giờ cụ thể. "Could you possibly" chỉ là cách nói lịch sự của một việc được giao.',
          },
          {
            q: 'Tin B của Corey có phải việc bắt buộc không?',
            options: ['Có, Corey cần cà phê gấp', 'Không. "Any chance… if you\'re going downstairs… no worries if not" = tiện thì làm, không thì thôi', 'Có, vì Corey là người hướng dẫn', 'Không rõ'],
            correct: 1,
            why: 'Ba dấu hiệu tuỳ ý: **any chance** (có cơ hội nào…), **if you\'re going downstairs** (nếu tiện đường), **no worries if not** (không được cũng không sao).',
          },
          {
            q: 'Tin C của Aiko cần Khang làm gì, trước khi nào?',
            options: ['Đi học dùng máy in hôm nay', 'Chọn thứ Năm hay thứ Sáu cho buổi hướng dẫn máy in, trả lời trước ngày mai', 'Sửa máy in cho Aiko', 'Gọi điện cho Aiko'],
            correct: 1,
            why: '"Could you please tell me **which day is better**… Thursday or Friday? … **reply by tomorrow**."',
          },
          {
            q: 'Vì sao tin của Aiko dài và trang trọng hơn hẳn tin của Corey?',
            options: ['Vì Aiko đang giận', 'Vì phong cách viết lịch sự kiểu Nhật: xin lỗi trước, "if it is not too much trouble", cảm ơn cuối', 'Vì việc rất gấp', 'Vì Aiko là sếp của Khang'],
            correct: 1,
            why: 'Người Nhật viết tiếng Anh thường giữ phép lịch sự của tiếng Nhật: **xin lỗi vì làm phiền** trước, **lời nhờ có điều kiện**, cảm ơn cuối. Trả lời Aiko nên lịch sự tương đương, không cần quá dài.',
          },
          {
            q: 'Tin D: "Would everyone mind clearing their desks by 6 pm on Friday?" Thật ra là gì?',
            options: ['Một câu hỏi khảo sát, ai không muốn thì thôi', 'Một quy định, không làm thì đồ sẽ bị chuyển vào hộp đồ thất lạc', 'Lời mời dự tiệc dọn dẹp', 'Lời xin lỗi của phòng hành chính'],
            correct: 1,
            why: 'Câu tiếp theo cho thấy **hậu quả**: "Anything left on desks **will be moved** to the lost-and-found box." Có hậu quả = quy định, dù câu mở là "Would everyone mind".',
          },
          {
            q: 'Ben nhờ Khang việc gì?',
            options: ['Tưới cây giúp khi Ben đi nghỉ phép', 'Nhận nuôi chậu cây của Ben khi Ben nghỉ hẳn', 'Mua một chậu cây mới', 'Đưa chậu cây cho Aiko'],
            correct: 1,
            why: '"would you mind **adopting** my peace lily **when I leave**?" adopt = nhận nuôi. Ben sắp về Úc hẳn (Cảnh 3 bài Nghe).',
          },
          {
            q: 'Trong năm tin, tin nào Khang có thể từ chối mà không sao?',
            options: ['A và D', 'B và E', 'A và C', 'C và D'],
            correct: 1,
            why: 'B có **no worries if not**, E có **No stress if you can\'t, I can ask Aiko**. A là việc được giao, C cần trả lời (chọn ngày), D là quy định.',
          },
          {
            q: 'Khang muốn nhận nuôi chậu cây của Ben. Câu trả lời nào hợp nhất?',
            options: ['Yes, I mind.', 'No, not at all! Happy to look after it.', 'Yes. OK.', 'I will adopt.'],
            correct: 1,
            why: 'Ben hỏi "would you mind…?" nên đáp đồng ý bằng **No, not at all!** rồi thêm một câu ấm áp: **Happy to look after it.**',
          },
        ],
      },

      { t: 'h', text: '2. Nhờ tuỳ ý hay yêu cầu phải làm?' },
      {
        t: 'table',
        head: ['Cụm trong tin nhắn', 'Nghĩa', 'Mức độ'],
        rows: [
          ['Any chance you could…?', 'Có thể nào bạn… không?', 'Tuỳ ý, thân mật'],
          ['…if you\'re going that way / if you\'re free', 'nếu tiện / nếu rảnh', 'Tuỳ ý'],
          ['No worries if not. · No stress if you can\'t.', 'Không được cũng không sao.', 'Tuỳ ý, có lối thoát'],
          ['Quick favour —', 'Nhờ chút việc nhỏ', 'Thường tuỳ ý'],
          ['when you get a chance · when you have a moment', 'khi nào bạn rảnh', 'Không gấp, nhưng **vẫn cần làm**'],
          ['Could you possibly…? · Would you mind…?', 'Bạn có thể… không?', 'Từ quản lý + có hạn = **phải làm**'],
          ['by Thursday lunchtime · by end of day', 'trước trưa thứ Năm · trước cuối ngày', 'Có hạn = **phải làm**'],
          ["I'd be grateful if you could…", 'Tôi sẽ rất biết ơn nếu bạn…', 'Trang trọng, thường là việc cần làm'],
          ['Thanks in advance!', 'Cảm ơn trước nhé!', 'Người viết **đã coi như bạn đồng ý**'],
        ],
        caption: 'Đọc **ai gửi** + **có hạn chót không** + **có lối thoát không**. Ba dấu hiệu này nói thật hơn chữ "could" hay "would".',
      },
      {
        t: 'note',
        title: 'Mẹo trả lời tin nhờ việc',
        items: [
          '**Trả lời sớm**, kể cả khi chưa làm được ngay: "Sure! I\'ll do it this afternoon." Im lặng cả buổi bị hiểu là bạn không nhận việc.',
          'Nhận việc thì **nói rõ khi nào xong**: "On it. I\'ll have the photo ready by Thursday morning."',
          'Từ chối thì **ngắn + lý do + phương án khác**: "Sorry, I\'m not going down till lunch. Want me to grab one then?"',
          'Trả lời **đúng mức người ta viết**: Corey viết thường, có emoji thì đáp thân mật; Aiko viết trang trọng thì đáp có chào, có cảm ơn.',
          'Email nhờ khách hàng, nhờ đội khác làm ticket: khoá **Technical English at Work** (Courses).',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd15-doc-tra-loi',
        title: 'Viết câu trả lời ngắn cho từng tin (4 câu)',
        kind: 'translate',
        grammar: 'Sure / No, not at all · by + thời điểm · Would… be okay?',
        items: [
          { q: '(Trả lời Harriet) Dạ được ạ. Em sẽ có ảnh trước sáng thứ Năm.', hint: 'sure, have the photo ready, by', answers: ["Sure! I'll have the photo ready by Thursday morning.", "Sure. I'll have the photo ready by Thursday morning.", "Sure, I'll have the photo ready by Thursday morning.", "No problem. I'll have the photo ready by Thursday morning.", "Sure! I'll have it ready by Thursday morning."] },
          { q: '(Trả lời Corey) Xin lỗi, tới trưa em mới xuống. Lúc đó em mua giúp anh nhé?', hint: "not going down till, want me to", answers: ["Sorry, I'm not going down till lunch. Want me to grab one then?", "Sorry, I'm not going down until lunch. Want me to grab one then?", "Sorry, I'm not going down till lunch. Do you want me to get one then?", "Sorry, I'm not going down until lunch. Do you want me to get one then?", "Sorry, I'm not going down till lunch. Shall I get one then?"] },
          { q: '(Trả lời Aiko) Cảm ơn chị Aiko. Thứ Năm thì tốt hơn cho em ạ.', hint: 'thank you, Thursday, better for me', answers: ['Thank you, Aiko-san. Thursday is better for me.', 'Thank you, Aiko. Thursday is better for me.', 'Thank you, Aiko-san. Thursday would be better for me.', 'Thank you, Aiko. Thursday would be better for me.', 'Thanks, Aiko-san. Thursday is better for me.'] },
          { q: '(Trả lời Ben) Không phiền gì đâu ạ! Em rất vui được chăm nó.', hint: 'not at all, happy to, look after', answers: ['No, not at all! Happy to look after it.', "No, not at all! I'm happy to look after it.", 'Not at all! Happy to look after it.', "Not at all! I'm happy to look after it.", "No, not at all! I'd be happy to look after it."] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd15-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 15',
    goal: 'Làm 35 câu có đáp án để chắc tay: chọn bậc lịch sự hợp cảnh, đặt câu hỏi gián tiếp đúng thứ tự, dùng và trả lời Would you mind…, đề nghị và nhận lời giúp.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền câu hỏi gián tiếp và Would you mind · dịch · nghe chép · ghép câu.',
          'Có câu **ôn Ngày 13–14** (How long have you…? câu hỏi đuôi). Làm không nhìn lại bài.',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 16.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd15-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn cần hỏi giám đốc chi nhánh (người Mỹ, chưa quen) xem chị ấy có thể ký giấy xác nhận thực tập cho bạn không. Câu nào hợp nhất?',
            options: ['Sign this for me.', 'Can you sign this?', 'I was wondering if you could sign my internship form.', 'You sign, OK?'],
            correct: 2,
            why: 'Việc trang trọng, người trên, chưa quen ⇒ bậc cao nhất: **I was wondering if you could…**',
          },
          {
            q: 'Đồng nghiệp hỏi: "Would you mind if I opened the window?" Bạn đồng ý. Bạn nói:',
            options: ['Yes.', 'Yes, I mind.', 'No, go ahead.', 'I mind not.'],
            correct: 2,
            why: '"Would you mind…?" muốn đồng ý thì đáp **No** (không phiền): **No, go ahead. · No, not at all.**',
          },
          {
            q: 'Câu nào đúng thứ tự từ?',
            options: ['Do you know where is the kitchen?', 'Do you know where the kitchen is?', 'Do you know the kitchen where is?', 'Do you know where does the kitchen?'],
            correct: 1,
            why: 'Câu hỏi gián tiếp: **Wh- + S + V** → where **the kitchen is**.',
          },
          {
            q: 'Bạn thấy chị Tess bưng ba hộp giấy. Câu đề nghị giúp tự nhiên nhất:',
            options: ['Do you want me help?', 'Need a hand?', 'Help you?', 'You need I help?'],
            correct: 1,
            why: '**Need a hand?** ngắn, thân, đúng. Câu A thiếu "to": Do you want me **to** help?',
          },
          {
            q: 'Một đồng nghiệp người Úc đề nghị: "Want me to grab you a coffee?" Bạn không cần. Bạn nói:',
            options: ['No, no, no need, no need.', "Thanks, but I'm good.", 'No.', "Yes, I don't want."],
            correct: 1,
            why: '**Thanks, but I\'m good / I\'m fine.** Một lần là đủ, họ tin ngay. Câu A nghe hoảng hốt; câu C cộc.',
          },
          {
            q: 'Một kỹ sư người Nhật nói: "Next Monday might be a little difficult." Chị ấy muốn nói:',
            options: ['Thứ Hai sau thì được nhưng hơi mệt', 'Thứ Hai sau không được', 'Chị ấy chưa xem lịch', 'Thứ Hai sau trời xấu'],
            correct: 1,
            why: '**might be a little difficult** = cách nói "không" rất lịch sự. Hãy hỏi lại: "I see. Is there another day that works for you?"',
          },
          {
            q: 'Bạn muốn mượn bút của đồng nghiệp. Câu nào đúng?',
            options: ['Can you borrow me your pen?', 'Could I borrow your pen?', 'Can I lend your pen?', 'Borrow me a pen, please.'],
            correct: 1,
            why: '**borrow** = mình mượn: Could I **borrow** your pen? Hoặc: Could you **lend** me your pen?',
          },
          {
            q: 'Trưởng nhóm nhắn: "Could you possibly send me the slides by 5? Thanks in advance!" Bạn hiểu:',
            options: ['Tuỳ bạn, không gửi cũng được', 'Việc được giao, phải gửi trước 5 giờ', 'Chị ấy hỏi ý kiến về slide', 'Chị ấy cảm ơn vì bạn đã gửi rồi'],
            correct: 1,
            why: 'Quản lý + **hạn chót (by 5)** + **Thanks in advance** (coi như bạn đã nhận) = việc phải làm.',
          },
          {
            q: '(Ôn Ngày 13) Bạn muốn hỏi một đồng nghiệp đã làm ở công ty bao lâu. Câu đúng:',
            options: ['How long do you work here?', 'How long have you been here?', 'How long are you working here before?', 'How long you work here?'],
            correct: 1,
            why: 'Việc bắt đầu trong quá khứ và còn tiếp ⇒ hiện tại hoàn thành: **How long have you been here?**',
          },
          {
            q: '(Ôn Ngày 14) Đồng nghiệp nói: "You haven\'t tried the new café downstairs, have you?" Bạn CHƯA thử. Bạn đáp:',
            options: ['Yes, I haven\'t.', 'No, I haven\'t. Is it good?', 'Yes. Is it good?', 'No, I have.'],
            correct: 1,
            why: 'Trả lời theo **sự thật**: chưa thử ⇒ **No, I haven\'t.** Rồi hỏi tiếp để giữ chuyện.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền vào chỗ trống' },
      {
        t: 'quiz',
        id: 'gtd15-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'Wh- + S + V · if / whether · mind + V-ing · if I + V2 · want me to',
        items: [
          { q: 'Do you know where the stapler ___? (be)', answers: ['is'] },
          { q: 'Could you tell me what time the lunch ___? (start)', answers: ['starts'] },
          { q: 'Do you know ___ Corey is in today? (có hay không)', answers: ['if', 'whether'] },
          { q: 'Would you mind ___ the door for me? (hold)', answers: ['holding'] },
          { q: 'Would you mind if I ___ your desk while you\'re at lunch? (use, quá khứ)', answers: ['used'] },
          { q: 'Do you want me ___ carry that for you?', answers: ['to'] },
          { q: 'Could I ___ your charger? (mượn)', answers: ['borrow'] },
          { q: 'Could you ___ me your charger? (cho mượn)', answers: ['lend'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd15-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'Câu hỏi gián tiếp · Would you mind… · Shall I… · I owe you one',
        items: [
          { q: 'Anh giúp em một tay với mấy cái ghế này được không?', hint: 'could you, give me a hand, chairs', answers: ['Could you give me a hand with these chairs?', 'Could you give me a hand with these chairs, please?', 'Can you give me a hand with these chairs?'] },
          { q: 'Chị có tình cờ biết ai cài thẻ ra vào không ạ?', hint: 'do you happen to know, sets up, badges', answers: ['Do you happen to know who sets up the badges?', 'Do you happen to know who sets up badges?', 'Do you happen to know who sets up the access badges?'] },
          { q: 'Không được cũng không sao đâu ạ.', hint: 'no worries, if not', answers: ['No worries if not.', 'No worries if not!', "It's okay if not.", "It's fine if not."] },
          { q: 'Chị cần cái này trước lúc nào ạ?', hint: 'when, need it by', answers: ['When do you need it by?', 'When do you need this by?'] },
          { q: 'Em xin ý kiến chị một chuyện được không ạ?', hint: 'could I ask, opinion', answers: ['Could I ask your opinion on something?', 'Could I ask your opinion about something?', 'Can I ask your opinion on something?', 'Can I ask your opinion about something?'] },
          { q: 'Ý hay đấy, nhưng hơi nặng để mang lên máy bay.', hint: "it's a nice idea, but, heavy", answers: ["It's a nice idea, but it's a bit heavy to take on a plane.", "It's a nice idea, but it's a little heavy to take on a plane.", "It's a nice idea, but it's a bit heavy for the plane.", "It's a lovely idea, but it's a bit heavy to take on a plane.", "It's a nice idea, but it's a bit heavy to carry on a plane."] },
          { q: 'Cảm ơn anh đã giúp. Em nợ anh một lần.', hint: 'thanks for, I owe you one', answers: ['Thanks for your help. I owe you one.', 'Thanks for helping. I owe you one.', 'Thanks for helping me. I owe you one.', 'Thank you for your help. I owe you one.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd15-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Could you give me a hand with these boxes?', answer: 'Could you give me a hand with these boxes?' },
          { label: 'Câu 2', spell: 'Do you know if the big room is free after three?', answer: 'Do you know if the big room is free after three?', alt: ['Do you know if the big room is free after 3?'] },
          { label: 'Câu 3', spell: "Thanks, but I've got it.", answer: "Thanks, but I've got it.", alt: ['Thanks, but I have got it.', "Thanks but I've got it"] },
          { label: 'Câu 4', spell: 'Would you mind keeping it quiet? It\'s a surprise.', answer: "Would you mind keeping it quiet? It's a surprise.", alt: ['Would you mind keeping it quiet? It is a surprise.'] },
          { label: 'Câu 5', spell: 'Sure. Leave it with me.', answer: 'Sure. Leave it with me.', alt: ['Sure, leave it with me.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd15-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Anh chỉ em cách dùng máy in được không ạ?', chips: ['Would', 'you', 'mind', 'showing', 'me', 'how', 'the', 'printer', 'works?', 'to', 'show', 'does'], answer: ['Would', 'you', 'mind', 'showing', 'me', 'how', 'the', 'printer', 'works?'] },
          { vi: 'Chị cho em biết mấy giờ buổi họp bắt đầu được không?', chips: ['Could', 'you', 'tell', 'me', 'what', 'time', 'the', 'meeting', 'starts?', 'does', 'start'], answer: ['Could', 'you', 'tell', 'me', 'what', 'time', 'the', 'meeting', 'starts?'] },
          { vi: 'Em muốn hỏi không biết em có thể đặt phòng nhỏ không.', chips: ['I', 'was', 'wondering', 'if', 'I', 'could', 'book', 'the', 'small', 'room.', 'can', 'whether'], answer: ['I', 'was', 'wondering', 'if', 'I', 'could', 'book', 'the', 'small', 'room.'] },
          { vi: 'Anh có muốn em in một bản không?', chips: ['Would', 'you', 'like', 'me', 'to', 'print', 'a', 'copy?', 'printing', 'I'], answer: ['Would', 'you', 'like', 'me', 'to', 'print', 'a', 'copy?'] },
          { vi: 'Chị thấy một tấm ảnh cả nhóm thì sao?', chips: ['What', 'do', 'you', 'think', 'of', 'a', 'team', 'photo?', 'about', 'does'], answer: ['What', 'do', 'you', 'think', 'of', 'a', 'team', 'photo?'], alt: [['What', 'do', 'you', 'think', 'about', 'a', 'team', 'photo?']] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Ngày mai đi làm / đi học, **nhờ thật một việc nhỏ bằng tiếng Anh** (với người nước ngoài, hoặc nhắn bạn học bằng tiếng Anh) theo đủ 5 bước: gọi, lý do, lời nhờ, lối thoát, cảm ơn.',
          'Ghi âm 5 câu hỏi gián tiếp về chỗ đồ vật trong nhà bạn: "Do you know where the remote is?"…',
          'Ngày 16: xin nghỉ, báo ốm, báo trễ và xin về sớm với **quản lý** — nêu lý do bằng because / since / as, và "I won\'t be able to…".',
        ],
      },
    ],
  },
];
