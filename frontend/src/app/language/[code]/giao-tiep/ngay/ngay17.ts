/**
 * Tiếng Anh giao tiếp — NGÀY 17 (chặng 3 "Công sở, không kỹ thuật", B1): gọi video.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd17-`.
 * Ngữ pháp trong câu: điều kiện loại 1 (If + hiện tại đơn, will / câu mệnh lệnh — If you can't hear me, just type in the chat)
 * · câu mệnh lệnh lịch sự Let me… / Let's… · nối câu bằng `otherwise` (+ `unless` để nghe hiểu).
 * Cảnh: Thư — sinh viên IT năm 3, tháng thứ ba thực tập ở Saltmarsh Digital (văn phòng Đà Nẵng, đồng nghiệp ở Manila và
 * Auckland): cuộc gọi nhóm chốt ngày đi chơi cuối năm (quên tắt mic, chia sẻ nhầm cửa sổ, hai người nói chồng); gọi video
 * sang Melbourne chúc sinh nhật cháu (ông Ron cầm ngược điện thoại, hình đứng); gọi 1-1 với chị buddy ở Ireland (tiếng vọng,
 * trễ tiếng, chó sủa, tắt camera cho đỡ lag).
 * Ranh giới: họp với khách, demo, standup qua video ⇒ khoá Technical English at Work (chỉ một dòng note dẫn sang).
 * Khác Ngày 9 (gọi điện thoại, "you're breaking up", nhận lời nhắn): hôm nay là chuyện riêng của gọi VIDEO — mic, camera,
 * màn hình, độ trễ, nói chồng lời. Khác podcast en-b1-03 (bạn quen qua mạng) và en-cv-b2-02 (thuyết trình bị ngắt lời).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_17: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd17-nghe',
    kind: 'listening',
    title: 'Video call: kết nối, mic, chia sẻ màn hình, nói chồng lời',
    goal: 'Nghe hiểu ba cuộc gọi video (nhóm nội bộ, gọi về nhà người thân, gọi 1-1): nhận ra lúc nào ai đang tắt mic, hình bị đứng, ai đang nhường lời ai, và cuộc gọi chốt được việc gì.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Thư**, sinh viên IT năm 3, đang ở **tháng thứ ba** thực tập ở **Saltmarsh Digital**, văn phòng Đà Nẵng. Nửa team ngồi ở **Manila** (Philippines) và **Auckland** (New Zealand), nên gần như ngày nào Thư cũng gọi video.',
          'Ngày 9 bạn đã học gọi **điện thoại** (xưng tên, nhận lời nhắn, "you\'re breaking up"). Hôm nay là chuyện riêng của gọi **video**: quên tắt mic, hình đứng, tiếng vọng, chia sẻ nhầm màn hình, hai người cùng nói một lúc.',
          'Ba cuộc gọi: **cả nhóm chốt ngày đi chơi cuối năm** · **gọi sang Melbourne chúc sinh nhật cháu** · **gọi 1-1 với chị buddy ở Ireland**.',
          'Nghe kỹ các câu có **If…** và **Let me…**: đó là ngữ pháp của hôm nay, và cũng là hai kiểu câu người ta nói nhiều nhất khi cuộc gọi trục trặc.',
          'Tốc độ khoảng **150 từ/phút**, có tiếng ồn, có chỗ hai người nói chồng lên nhau như cuộc gọi thật. Lần 1 chỉ bắt: **trục trặc gì, ai sửa thế nào**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Cuộc gọi nhóm: "Thư, you\'re on mute"' },
      {
        t: 'canh',
        anh: ['laptop', 'woman-technologist', 'muted-speaker', 'spiral-calendar', 'globe-showing-asia-australia'],
        caption: '9 giờ sáng thứ Năm ở Đà Nẵng (10 giờ ở Manila, 3 giờ chiều ở Auckland). **Dylan**, người Anh, gọi cả nhóm để chốt ngày đi chơi cuối năm ở Đà Nẵng. Có **Joy** ở Manila, **Ivan** ở Auckland và **Thư**. Thư vừa vào cuộc gọi, mic vẫn đang tắt.',
      },
      {
        t: 'listen',
        id: 'gtd17-nghe-canh1',
        title: 'Scene 1 — The team trip call',
        note: 'Nghe xem: Thư gặp trục trặc gì lúc đầu, Dylan chia sẻ nhầm cái gì, vì sao nhóm chọn ngày 12, và hạn chót để phản đối là khi nào.',
        lines: [
          { who: 'Dylan', voice: 'uk-nam', text: 'Morning, everyone. Can you all hear me okay?', vi: 'Chào cả nhà buổi sáng. Mọi người nghe rõ tôi không?' },
          { who: 'Joy', voice: 'ca-nu', text: 'Loud and clear, Dylan.', vi: 'Rõ mồn một, Dylan.' },
          { who: 'Ivan', voice: 'nz-nam', text: "Yep, all good here. Well, it's afternoon here, but good morning to you lot!", vi: 'Ừ, bên này ổn. Ừ thì ở đây là buổi chiều rồi, nhưng chào buổi sáng các bạn nhé!' },
          { who: 'Dylan', voice: 'uk-nam', text: "Ha, fair enough. Thư, I can see you, but I can't hear a thing. I think you're on mute.", vi: 'Ha, công nhận. Thư ơi, tôi thấy hình em nhưng không nghe gì cả. Chắc em đang tắt mic.' },
          { who: 'Joy', voice: 'ca-nu', text: "Thư, the microphone button, bottom left of your screen. You're still muted.", vi: 'Thư, nút micro ở góc dưới bên trái màn hình ấy. Em vẫn đang tắt tiếng.' },
          { who: 'Thư', voice: 'us-nu', text: 'Sorry, sorry! Can you hear me now?', vi: 'Em xin lỗi, xin lỗi! Giờ mọi người nghe thấy em chưa ạ?' },
          { who: 'Dylan', voice: 'uk-nam', text: "Yes, perfect. Right, this is a quick one: our trip in December. Let me share my screen. Can everyone see it?", vi: 'Rồi, hoàn hảo. Được rồi, cuộc này nhanh thôi: chuyến đi tháng Mười Hai. Để tôi chia sẻ màn hình. Mọi người thấy không?' },
          { who: 'Ivan', voice: 'nz-nam', text: "Er, I can see your inbox, mate. And an email called 'Secret Santa ideas'.", vi: 'Ơ, tôi thấy hộp thư của ông, ông bạn ạ. Và một email tên là "Ý tưởng quà Secret Santa".' },
          { who: 'Dylan', voice: 'uk-nam', text: "Oops! Wrong window. Hang on… Is that better? You should see a calendar now.", vi: 'Ối! Nhầm cửa sổ. Chờ chút… Được chưa? Giờ chắc mọi người thấy cái lịch rồi.' },
          { who: 'Joy', voice: 'ca-nu', text: 'Yes, I can see the calendar.', vi: 'Rồi, tôi thấy cái lịch rồi.' },
          { who: 'Dylan', voice: 'uk-nam', text: "Great. So, option one is the twelfth to the fourteenth. Option two is the nineteenth to the twenty-first. If we go on the twelfth, flights from Manila will be cheaper.", vi: 'Tốt. Phương án một là từ ngày 12 đến 14. Phương án hai là từ 19 đến 21. Nếu đi ngày 12 thì vé bay từ Manila sẽ rẻ hơn.' },
          { who: 'Joy', voice: 'ca-nu', text: 'Can I just say—', vi: 'Cho tôi nói một chút—' },
          { who: 'Thư', voice: 'us-nu', text: 'I think the—', vi: 'Em nghĩ là—' },
          { who: 'Joy', voice: 'ca-nu', text: 'Oh, sorry, Thư. Go ahead.', vi: 'Ôi, xin lỗi Thư. Em nói đi.' },
          { who: 'Thư', voice: 'us-nu', text: 'No, no, you go first, Joy.', vi: 'Không ạ, chị nói trước đi chị Joy.' },
          { who: 'Joy', voice: 'ca-nu', text: "Thanks. I just wanted to say the nineteenth is bad for me. It's my sister's wedding.", vi: 'Cảm ơn em. Chị chỉ muốn nói ngày 19 thì chị không được. Hôm đó đám cưới em gái chị.' },
          { who: 'Thư', voice: 'us-nu', text: "And for me, the twelfth works. My last exam is on the eleventh. If we go any earlier, I won't be able to come.", vi: 'Còn em thì ngày 12 được ạ. Em thi môn cuối ngày 11. Nếu đi sớm hơn nữa thì em không đi được.' },
          { who: 'Ivan', voice: 'nz-nam', text: 'Sorry, you cut out for a second there. Did you say the twelfth works?', vi: 'Xin lỗi, tiếng em bị mất một giây. Em nói ngày 12 được à?' },
          { who: 'Thư', voice: 'us-nu', text: 'Yes, the twelfth works for me.', vi: 'Vâng, ngày 12 em đi được.' },
          { who: 'Dylan', voice: 'uk-nam', text: "Brilliant. Then let's go with the twelfth. If anyone has a problem with that, let me know by Friday. Otherwise, I'll book the hotel on Monday.", vi: 'Tuyệt. Vậy chốt ngày 12. Ai có vấn đề gì thì báo tôi trước thứ Sáu. Không thì thứ Hai tôi đặt khách sạn.' },
          { who: 'Ivan', voice: 'nz-nam', text: 'Sounds good. Oh, and Dylan? Maybe close that Secret Santa email before you share your screen again.', vi: 'Được đấy. À, Dylan này? Lần sau trước khi chia sẻ màn hình thì đóng cái email Secret Santa lại nhé.' },
          { who: 'Dylan', voice: 'uk-nam', text: 'Ha! Noted. Cheers, everyone.', vi: 'Ha! Ghi nhận. Cảm ơn cả nhà.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd17-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Lúc đầu cuộc gọi, Thư gặp trục trặc gì?',
            options: ['Camera của Thư bị tắt', 'Mic của Thư đang tắt, mọi người không nghe thấy', 'Mạng của Thư bị rớt', 'Thư vào nhầm cuộc gọi'],
            correct: 1,
            why: '"I can see you, but I can\'t hear a thing. I think **you\'re on mute**." Thấy hình nhưng không có tiếng = đang tắt mic.',
          },
          {
            q: 'Ivan nói "I can see your inbox, mate". Chuyện gì đã xảy ra?',
            options: ['Dylan gửi nhầm email', 'Dylan chia sẻ nhầm cửa sổ, cả nhóm thấy hộp thư của anh', 'Ivan đọc trộm email của Dylan', 'Dylan quên chia sẻ màn hình'],
            correct: 1,
            why: 'Dylan tự nhận: "Oops! **Wrong window**." Đây là sự cố rất hay gặp: chia sẻ cả màn hình thay vì một cửa sổ, lộ email riêng.',
          },
          {
            q: 'Vì sao nhóm chọn đi từ ngày 12?',
            options: ['Vì khách sạn chỉ còn phòng ngày 12', 'Vì vé bay từ Manila rẻ hơn, Joy bận ngày 19, Thư thi xong ngày 11', 'Vì Ivan chỉ rảnh ngày 12', 'Vì Dylan đã đặt vé'],
            correct: 1,
            why: 'Ba lý do: "If we go on the twelfth, flights from Manila **will be cheaper**" · Joy: "the nineteenth is bad for me" · Thư: "My last exam is on the eleventh".',
          },
          {
            q: 'Nếu ai không đồng ý với ngày 12 thì phải làm gì?',
            options: ['Báo Dylan trước thứ Sáu', 'Báo Dylan trước thứ Hai', 'Gửi email cho cả nhóm', 'Không cần làm gì'],
            correct: 0,
            why: '"If anyone has a problem with that, **let me know by Friday**. Otherwise, I\'ll book the hotel on Monday." Thứ Hai là ngày Dylan đặt khách sạn.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Gọi sang Melbourne: "Dad, you\'re holding it upside down"' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'birthday-cake', 'old-man', 'woman-raising-hand', 'party-popper'],
        caption: 'Chủ nhật, 4 giờ chiều ở Đà Nẵng, 8 giờ tối ở Melbourne. Anh trai Thư sống ở Úc, cưới chị **Kerry** người Úc. Hôm nay là sinh nhật 6 tuổi của bé **Ruby**. Thư gọi video sang chúc, nhưng anh trai vừa ra ngoài. Người cầm máy là Kerry và bố chị, ông **Ron**, ngoài 70 tuổi.',
      },
      {
        t: 'listen',
        id: 'gtd17-nghe-canh2',
        title: 'Scene 2 — Calling Melbourne',
        note: 'Nghe xem: ông Ron gặp những trục trặc nào, Thư nhờ ông làm gì, Melbourne đi trước Việt Nam mấy tiếng và vì sao, và Thư nhắn gì cho anh trai.',
        lines: [
          { who: 'Kerry', voice: 'au-nu', text: "Thư! Hi! Oh, you're a bit dark. Can you hear me all right?", vi: 'Thư! Chào em! Ôi, hình em hơi tối. Em nghe chị rõ không?' },
          { who: 'Thư', voice: 'us-nu', text: 'Hi, Kerry! Yes, I can hear you. Let me turn on a light… Is that better?', vi: 'Chào chị Kerry! Vâng, em nghe thấy chị. Để em bật đèn… Giờ đỡ chưa chị?' },
          { who: 'Kerry', voice: 'au-nu', text: "Much better. Sorry it's so noisy, the party's still going. Minh's just popped out to get more ice, so it's me and Dad.", vi: 'Đỡ nhiều rồi. Xin lỗi ồn quá, tiệc vẫn đang tiếp. Minh vừa chạy ra ngoài mua thêm đá, nên giờ chỉ có chị với bố.' },
          { who: 'Ron', voice: 'au-nam', text: "Is she on? I can't see a thing.", vi: 'Con bé lên chưa? Bố chẳng thấy gì cả.' },
          { who: 'Kerry', voice: 'au-nu', text: "Dad, you're holding it upside down. Turn it around… no, the other way.", vi: 'Bố ơi, bố đang cầm ngược đấy. Xoay lại… không, chiều kia cơ.' },
          { who: 'Ron', voice: 'au-nam', text: "Ah, there she is! G'day, Thư. Can you see me?", vi: 'À, đây rồi! Chào cháu, Thư. Cháu thấy ông không?' },
          { who: 'Thư', voice: 'us-nu', text: 'I can see your forehead, Ron! Could you hold the phone a bit further away?', vi: 'Cháu thấy trán ông thôi ạ! Ông cầm điện thoại xa ra một chút được không ạ?' },
          { who: 'Ron', voice: 'au-nam', text: "How's this?", vi: 'Thế này được chưa?' },
          { who: 'Thư', voice: 'us-nu', text: 'Perfect! Now I can see you. How are you?', vi: 'Chuẩn rồi ạ! Giờ cháu thấy ông rồi. Ông khoẻ không ạ?' },
          { who: 'Ron', voice: 'au-nam', text: "Not bad for an old bloke. What time is it over there? It's already eight o'clock here.", vi: 'Ông già như ông thế là cũng ổn. Bên đó mấy giờ rồi? Ở đây đã tám giờ tối rồi.' },
          { who: 'Thư', voice: 'us-nu', text: "It's four in the afternoon. You're four hours ahead in summer, right?", vi: 'Bốn giờ chiều ạ. Mùa hè thì bên ông đi trước bốn tiếng, đúng không ạ?' },
          { who: 'Kerry', voice: 'au-nu', text: "That's right, because of daylight saving. In winter it's only three.", vi: 'Đúng rồi, vì giờ mùa hè. Mùa đông thì chỉ chênh ba tiếng thôi.' },
          { who: 'Ron', voice: 'au-nam', text: 'So, are you coming over for Christmas? Because Ruby keeps asking about—', vi: 'Thế cháu có sang đây ăn Giáng sinh không? Vì Ruby cứ hỏi mãi về—' },
          { who: 'Thư', voice: 'us-nu', text: "Ron? Hello? Oh, I think you've frozen.", vi: 'Ông ơi? Alô? Ôi, hình như hình ông bị đứng rồi.' },
          { who: 'Kerry', voice: 'au-nu', text: "Hang on, the Wi-Fi's terrible out in the backyard. Let me go inside… Okay, are we back?", vi: 'Chờ chút, ngoài sân sau Wi-Fi tệ lắm. Để chị vào trong nhà… Rồi, có hình lại chưa em?' },
          { who: 'Thư', voice: 'us-nu', text: "Yes, you're back. Where's Ruby? Can I say happy birthday?", vi: 'Có rồi ạ. Ruby đâu chị? Em chúc mừng sinh nhật con bé được không?' },
          { who: 'Kerry', voice: 'au-nu', text: "She's opening presents. If I give her the phone, she'll drop it in the cake! Let me call her over. Ruby! Auntie Thư's on the phone!", vi: 'Nó đang mở quà. Đưa điện thoại cho nó là nó làm rơi vào bánh kem ngay! Để chị gọi nó lại. Ruby ơi! Cô Thư gọi này!' },
          { who: 'Thư', voice: 'us-nu', text: "Happy birthday, Ruby! Six already! Kerry, I'll let you go, it's a party. If Minh's back soon, tell him to call me tonight.", vi: 'Chúc mừng sinh nhật Ruby! Đã sáu tuổi rồi! Chị Kerry, em không giữ chị nữa, đang tiệc mà. Nếu anh Minh về sớm thì chị bảo anh tối nay gọi em nhé.' },
          { who: 'Kerry', voice: 'au-nu', text: 'Will do. Love you, bye!', vi: 'Chị nhớ rồi. Thương em, chào em!' },
          { who: 'Ron', voice: 'au-nam', text: "Hang on, how do I hang up this thing?", vi: 'Khoan, cái máy này tắt thế nào nhỉ?' },
          { who: 'Kerry', voice: 'au-nu', text: 'The red button, Dad.', vi: 'Nút đỏ ấy bố.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd17-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Lúc đầu ông Ron không thấy gì vì sao?',
            options: ['Ông chưa bật camera', 'Ông cầm ngược điện thoại', 'Mạng nhà ông bị rớt', 'Thư tắt camera'],
            correct: 1,
            why: 'Kerry: "Dad, **you\'re holding it upside down**." Rồi ông lại cầm sát quá, Thư chỉ thấy trán: "Could you hold the phone **a bit further away**?"',
          },
          {
            q: 'Melbourne đi trước Việt Nam mấy tiếng vào dịp này, và vì sao?',
            options: ['Ba tiếng, vì mùa đông', 'Bốn tiếng, vì Úc đang dùng giờ mùa hè (daylight saving)', 'Hai tiếng, vì khác múi giờ', 'Bốn tiếng quanh năm'],
            correct: 1,
            why: '"You\'re four hours ahead in summer, right?" — "That\'s right, because of **daylight saving**. In winter it\'s only three." Việt Nam không đổi giờ, còn Melbourne đổi giờ từ khoảng tháng 10 tới tháng 4.',
          },
          {
            q: 'Vì sao hình ông Ron bị đứng, và Kerry sửa thế nào?',
            options: ['Hết pin, Kerry cắm sạc', 'Wi-Fi ngoài sân sau rất yếu, Kerry đi vào trong nhà', 'Ông bấm nhầm nút, Kerry bấm lại', 'Thư gọi lại'],
            correct: 1,
            why: '"Hang on, **the Wi-Fi\'s terrible out in the backyard**. Let me go inside…" Sự cố mạng thì đổi chỗ ngồi gần router là cách nhanh nhất.',
          },
          {
            q: 'Thư nói "I\'ll let you go, it\'s a party". Câu này nghĩa là gì?',
            options: ['Thư cho phép Kerry đi dự tiệc', 'Thư lịch sự xin kết thúc cuộc gọi để Kerry quay lại với buổi tiệc', 'Thư muốn Kerry cúp máy ngay', 'Thư giận vì Kerry bận'],
            correct: 1,
            why: '**I\'ll let you go** là cách kết thúc cuộc gọi rất lịch sự: nói như thể mình "trả tự do" cho người kia vì họ đang bận, chứ không nói "Tôi muốn cúp máy".',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Gọi 1-1 với chị buddy: tiếng vọng, trễ tiếng và một con chó' },
      {
        t: 'canh',
        anh: ['desktop-computer', 'headphone', 'woman-office-worker', 'dog', 'hourglass-not-done'],
        caption: '3 giờ chiều ở Đà Nẵng, 8 giờ sáng ở Galway (Ireland). **Bridget**, buddy của Thư (người kèm thực tập sinh), làm việc ở nhà. Hai người gọi 1-1 để chọn khoá tiếng Anh công ty trả tiền cho thực tập sinh. Mạng nhà Bridget hôm nay không ổn.',
      },
      {
        t: 'listen',
        id: 'gtd17-nghe-canh3',
        title: 'Scene 3 — A one-to-one with Bridget',
        note: 'Nghe xem: tiếng vọng do đâu, vì sao hai người cứ nói chồng lên nhau, Bridget tắt camera để làm gì, và nếu khoá học đã đầy thì sao.',
        lines: [
          { who: 'Bridget', voice: 'ie-nu', text: "Hiya, Thư! Sorry, give me a second. I'm just finishing my tea. Right. How are you?", vi: 'Chào Thư! Xin lỗi, chờ chị một giây. Chị đang uống nốt cốc trà. Rồi. Em khoẻ không?' },
          { who: 'Thư', voice: 'us-nu', text: "Good, thanks. Bridget, I can hear myself. There's an echo. Are you using your laptop speakers?", vi: 'Em ổn ạ. Chị Bridget ơi, em nghe thấy tiếng của chính em. Có tiếng vọng. Chị đang dùng loa máy tính ạ?' },
          { who: 'Bridget', voice: 'ie-nu', text: 'Ah, I am. Let me grab my headphones… Is that better?', vi: 'À, đúng rồi. Để chị lấy tai nghe… Giờ đỡ chưa?' },
          { who: 'Thư', voice: 'us-nu', text: "Yes, the echo's gone. So, about the English course—", vi: 'Rồi ạ, hết vọng rồi. Vậy về khoá tiếng Anh—' },
          { who: 'Bridget', voice: 'ie-nu', text: 'So I had a look at the—', vi: 'Thì chị có xem qua cái—' },
          { who: 'Thư', voice: 'us-nu', text: 'Sorry, you go ahead.', vi: 'Em xin lỗi, chị nói trước đi ạ.' },
          { who: 'Bridget', voice: 'ie-nu', text: "No, sorry, there's a bit of a delay on my end. You first.", vi: 'Không, chị xin lỗi, bên chị tiếng bị trễ một chút. Em nói trước đi.' },
          { who: 'Thư', voice: 'us-nu', text: 'I just wanted to ask: which course is better for speaking, the Tuesday one or the Saturday one?', vi: 'Em chỉ muốn hỏi: khoá nào tốt hơn cho kỹ năng nói ạ, khoá tối thứ Ba hay khoá thứ Bảy?' },
          { who: 'Bridget', voice: 'ie-nu', text: "Good question. Let me share my screen and show you the timetable. Can you see it? It's the training page.", vi: 'Hỏi hay đấy. Để chị chia sẻ màn hình cho em xem lịch học. Em thấy không? Trang đào tạo đấy.' },
          { who: 'Thư', voice: 'us-nu', text: "I can see it, but the text is really small. Could you zoom in a bit?", vi: 'Em thấy rồi, nhưng chữ bé quá. Chị phóng to lên một chút được không ạ?' },
          { who: 'Bridget', voice: 'ie-nu', text: "Sure. So the Saturday course is all conversation, but there's only—", vi: 'Được. Khoá thứ Bảy thì toàn hội thoại, nhưng chỉ còn—' },
          { who: 'Bridget', voice: 'ie-nu', text: "Sorry, that's my dog. Let me mute myself for a second… Okay. He's seen the postman.", vi: 'Xin lỗi, chó nhà chị đấy. Để chị tắt mic một giây… Rồi. Nó vừa thấy bác đưa thư.' },
          { who: 'Thư', voice: 'us-nu', text: "Ha, no problem. Bridget, your video keeps freezing. Your voice is fine, though.", vi: 'Ha, không sao ạ. Chị ơi, hình của chị cứ bị đứng. Nhưng tiếng thì vẫn ổn.' },
          { who: 'Bridget', voice: 'ie-nu', text: "My connection's a bit unstable today. Let me turn my camera off. That usually helps.", vi: 'Hôm nay mạng của chị hơi chập chờn. Để chị tắt camera. Thường thế là đỡ.' },
          { who: 'Bridget', voice: 'ie-nu', text: "So, the Saturday course has only two places left. Sign up today. If it's full, I'll put you on the waiting list. And if you don't hear from HR by Wednesday, just ping me.", vi: 'Vậy, khoá thứ Bảy chỉ còn hai chỗ. Em đăng ký ngay hôm nay đi. Nếu đầy thì chị cho em vào danh sách chờ. Và nếu tới thứ Tư mà phòng nhân sự chưa trả lời thì cứ nhắn chị.' },
          { who: 'Thư', voice: 'us-nu', text: 'Great. Could you pop the link in the chat?', vi: 'Tuyệt ạ. Chị thả đường link vào khung chat giúp em được không ạ?' },
          { who: 'Bridget', voice: 'ie-nu', text: "Done. Right, I'll let you get back to work. Talk soon, Thư!", vi: 'Xong rồi. Thôi, chị không giữ em nữa, em quay lại làm việc đi. Nói chuyện sau nhé Thư!' },
          { who: 'Thư', voice: 'us-nu', text: 'Thanks, Bridget. Talk soon. Bye!', vi: 'Em cảm ơn chị Bridget. Nói chuyện sau ạ. Em chào chị!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd17-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Thư nghe thấy tiếng vọng của chính mình?',
            options: ['Mic của Thư bị hỏng', 'Bridget dùng loa máy tính, tiếng của Thư phát ra loa rồi lọt lại vào mic', 'Hai người ở cùng một phòng', 'Mạng của Thư yếu'],
            correct: 1,
            why: '"Are you using your **laptop speakers**?" — Bridget đeo tai nghe vào là hết vọng. Đeo tai nghe là cách chữa tiếng vọng nhanh nhất.',
          },
          {
            q: 'Vì sao hai người cứ bắt đầu nói cùng một lúc?',
            options: ['Vì cả hai đều nóng tính', 'Vì tiếng bên Bridget bị trễ, mỗi người tưởng người kia đã nói xong', 'Vì Thư ngắt lời Bridget', 'Vì Bridget không nghe thấy Thư'],
            correct: 1,
            why: '"There\'s **a bit of a delay** on my end." Trễ tiếng nửa giây là đủ để hai người cùng mở miệng. Cách xử lý: một người nói "Sorry, **you go ahead**", người kia nhường lại hoặc nói luôn.',
          },
          {
            q: 'Bridget tắt camera để làm gì?',
            options: ['Vì chị chưa trang điểm', 'Để mạng đỡ tải, cuộc gọi bớt giật', 'Để đi mở cửa cho bác đưa thư', 'Vì chị muốn kết thúc cuộc gọi'],
            correct: 1,
            why: '"My connection\'s a bit unstable today. **Let me turn my camera off. That usually helps.**" Hình tốn mạng hơn tiếng rất nhiều.',
          },
          {
            q: 'Nếu khoá thứ Bảy đã đầy thì sao?',
            options: ['Thư phải học khoá thứ Ba', 'Bridget sẽ cho Thư vào danh sách chờ', 'Thư phải chờ năm sau', 'Thư tự trả tiền học chỗ khác'],
            correct: 1,
            why: '"**If it\'s full, I\'ll put you on the waiting list.**" Câu điều kiện loại 1: If + hiện tại đơn, will + V.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Đây là các câu người ta nói **rất nhanh** trong cuộc gọi, nhiều chỗ nuốt âm: "Let me" nghe như "lem-mi", "cut out" nghe như "cu-đao", "you\'re on mute" dính thành một cụm. Viết hoa và dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd17-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — báo người khác đang tắt mic', spell: "I think you're on mute.", answer: "I think you're on mute.", alt: ['I think you are on mute.'] },
          { label: 'Câu 2 — trước khi chia sẻ màn hình', spell: 'Let me share my screen. Can everyone see it?', answer: 'Let me share my screen. Can everyone see it?', alt: ['Let me share my screen can everyone see it'] },
          { label: 'Câu 3 — tiếng bị mất một chút', spell: 'Sorry, you cut out for a second there.', answer: 'Sorry, you cut out for a second there.', alt: ['Sorry you cut out for a second there'] },
          { label: 'Câu 4 — chốt hạn (ngày: Friday)', spell: 'If anyone has a problem with that, let me know by Friday.', answer: 'If anyone has a problem with that, let me know by Friday.', alt: ['If anyone has a problem with that let me know by Friday'] },
          { label: 'Câu 5 — hình bị đứng', spell: "I think you've frozen.", answer: "I think you've frozen.", alt: ['I think you have frozen.'] },
          { label: 'Câu 6 — trễ tiếng', spell: "There's a bit of a delay on my end.", answer: "There's a bit of a delay on my end.", alt: ['There is a bit of a delay on my end.'] },
          { label: 'Câu 7 — nhờ gửi link', spell: 'Could you pop the link in the chat?', answer: 'Could you pop the link in the chat?' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ["You're on mute.", 'Bạn đang tắt mic, nãy giờ không ai nghe thấy gì.', '(bật mic) Sorry! Can you hear me now?'],
          ['You cut out there.', 'Tiếng bạn bị mất một đoạn ngắn. Họ cần bạn nói lại.', 'Sorry, I said the twelfth works for me.'],
          ["We can see your screen.", 'Thường là lời **nhắc khéo**: bạn quên tắt chia sẻ, hoặc màn hình đang lộ thứ riêng tư.', 'Oh! Let me stop sharing.'],
          ['Are you still with us?', 'Bạn còn trong cuộc gọi không? (hoặc: bạn còn đang nghe không?)', "Yes, sorry, I'm here."],
          ['I think we lost Ivan.', 'Ivan bị rớt khỏi cuộc gọi.', "Let's give him a minute."],
          ['Shall we give it a couple more minutes?', 'Chờ thêm người vào rồi mới bắt đầu.', 'Sure.'],
          ["I'll let you go.", 'Tôi xin kết thúc cuộc gọi (nói lịch sự, như thể để bạn đi làm việc của bạn).', 'Thanks for calling. Talk soon!'],
          ["Let's take this offline.", 'Chuyện này không bàn ở đây, để nói riêng sau.', "Sure, I'll message you."],
          ['Can I just jump in here?', 'Cho tôi chen một câu nhé (xin phép trước khi ngắt lời).', 'Of course, go ahead.'],
        ],
        caption: 'Câu thứ ba và câu cuối cùng là hai câu ẩn ý hay gặp nhất. "We can see your screen" ít khi là thông báo trung tính: nghe thấy thì kiểm tra màn hình ngay.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp trong cuộc gọi video thì làm gì',
        items: [
          '**Bật phụ đề trực tiếp (live captions).** Teams, Zoom và Google Meet đều có nút này. Người bản xứ cũng dùng, không ai biết bạn bật. Đây là "phao" tốt nhất cho người mới.',
          '**Xin họ gõ vào khung chat**: "Sorry, could you **pop that in the chat**?" Rất hợp với tên riêng, số, đường link, ngày giờ. Không ai thấy phiền vì ai cũng từng nghe sót.',
          '**Nhắc lại để xác nhận**: "So that\'s **the twelfth**, right?" Nghe sai thì người ta sửa ngay, trước khi bạn đặt nhầm vé.',
          '**Đổ lỗi cho đường truyền**, không phải cho tai mình: "Sorry, **you cut out** there." Câu này lịch sự hơn "I don\'t understand", và nhiều khi đúng là do mạng thật.',
          '**Đeo tai nghe**: tiếng rõ hơn hẳn loa máy tính và hết tiếng vọng cho người khác.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Chờ một chút', 'Hang on. · Give me a sec.', 'Hold on. · One sec.', 'Hang on. · Hang on a sec.'],
          ['Gọi điện', 'ring someone · give someone a ring / a bell', 'call someone · give someone a call', 'ring someone · give someone a call'],
          ['Điện thoại di động', 'mobile', 'cell phone · cell', 'mobile'],
          ['Tuyệt!', 'Brilliant! · Lovely.', 'Awesome! · Great.', 'Sweet! · Good stuff.'],
          ['Chào khi cúp máy', 'Cheers, bye! · Speak soon.', 'Talk soon. · Have a good one!', 'Catch you later. · See ya.'],
          ['Giờ hẹn 9:30', '**half nine** (= 9:30, không phải 8:30)', 'nine thirty', 'half nine · nine thirty'],
          ['Buổi chiều', 'this afternoon', 'this afternoon', 'this **arvo**'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi gọi điện, gọi video. Bẫy lớn nhất là **half nine**: nó là **9:30** (giống "chín rưỡi"), đừng đoán thành 8:30. Người Mỹ gần như không nói kiểu này, nên nghe thấy là biết người Anh hoặc Úc. Đoán sai là vào cuộc gọi lệch một tiếng.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-b1-03 · A Friend I Have Never Met** — hai người bạn chỉ quen nhau qua mạng và gọi video, sắp gặp mặt lần đầu.',
          '**en-cv-b2-02 · Any Questions?** — nghe cách một người xử lý khi đang nói thì bị ngắt lời (nghe sau khi học xong bài Nói).',
          'Phần gọi video với **khách hàng**, demo sản phẩm, họp standup hằng ngày: ở khoá **Technical English at Work**. Hôm nay chỉ là cuộc gọi trong nhóm và với người thân.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd17-noi',
    kind: 'speaking',
    title: 'Câu dùng khi gọi video',
    goal: 'Tự mở, giữ và kết thúc một cuộc gọi video: báo mic tắt, hình đứng, tiếng vọng; chia sẻ màn hình; nhường lời khi nói chồng; dùng If… và Let me… cho đúng.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** đi theo đúng thứ tự một cuộc gọi: vào cuộc gọi → kiểm tra tiếng và hình → sự cố → chia sẻ màn hình → nói chồng lời → kết thúc.',
          'Ngữ pháp: **điều kiện loại 1** (If you can\'t hear me, just type in the chat) và câu mệnh lệnh lịch sự **Let me… / Let\'s…**. Từ nối: **otherwise**.',
          'Ba mức lịch sự: nói với bạn, với đồng nghiệp, với sếp lớn.',
          '**Ngôn ngữ cơ thể trên camera**: nhìn vào đâu, gật đầu khi đang tắt mic, giơ tay xin nói; người Nhật, người Việt và người Anh – Mỹ khác nhau thế nào.',
          'Cuối bài nhập vai: bạn dẫn một cuộc gọi nhóm nhỏ, xử lý một người vào muộn không nghe được tiếng.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo thứ tự của một cuộc gọi thật. Câu nào có **Let me** là bạn tự làm, câu nào có **Could you** là nhờ người khác làm. Bấm loa, nói to theo, rồi bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Can you hear me okay?', pos: 'phr', ipa: '/kən ju ˈhɪr mi oʊˈkeɪ/', vi: 'Mọi người nghe tôi rõ không?', ex: 'Hi, everyone. Can you hear me okay?', exVi: 'Chào mọi người. Mọi người nghe tôi rõ không?', more: 'Câu mở đầu chuẩn của mọi cuộc gọi. Đáp: **Loud and clear.** (rõ mồn một)', anh: 'speaker-high-volume' },
          { w: 'Loud and clear.', pos: 'phr', ipa: '/ˌlaʊd ən ˈklɪr/', vi: 'Rõ mồn một.', ex: 'Can you hear me? — Loud and clear.', exVi: 'Nghe tôi không? — Rõ mồn một.' },
          { w: "You're on mute.", pos: 'phr', ipa: '/jʊr ɑːn ˈmjuːt/', vi: 'Bạn đang tắt mic.', ex: "Thư, I can see you, but you're on mute.", exVi: 'Thư ơi, tôi thấy hình em nhưng em đang tắt mic.', more: 'Cũng nói: **You\'re muted.** Tự bật lại: **Sorry, I was on mute.**', anh: 'muted-speaker' },
          { w: 'unmute', pos: 'v', ipa: '/ʌnˈmjuːt/', vi: 'bật mic lên', ex: "If you want to ask something, just unmute and jump in.", exVi: 'Muốn hỏi gì thì cứ bật mic và nói chen vào.', anh: 'microphone' },
          { w: 'Can you see me?', pos: 'phr', ipa: '/kən ju ˈsiː mi/', vi: 'Bạn thấy hình tôi không?', ex: "I've just turned my camera on. Can you see me?", exVi: 'Tôi vừa bật camera. Bạn thấy tôi không?', anh: 'video-camera' },
          { w: 'turn my camera on / off', pos: 'phr', ipa: '/ˌtɝːn maɪ ˈkæmrə ɑːn/', vi: 'bật / tắt camera', ex: 'Let me turn my camera off. My connection is slow.', exVi: 'Để tôi tắt camera. Mạng của tôi chậm.', more: 'Camera, mic, đèn: dùng **turn on / off**, không dùng open / close.' },
          { w: "You've frozen.", pos: 'phr', ipa: '/juv ˈfroʊzn/', vi: 'Hình của bạn bị đứng.', ex: "Ron? I think you've frozen.", exVi: 'Ông ơi? Hình như hình ông bị đứng.', more: 'Cũng nói: **You froze for a second.** · **Your video keeps freezing.** (cứ bị đứng)', anh: 'snowflake' },
          { w: 'You cut out there.', pos: 'phr', ipa: '/ju ˌkʌt ˈaʊt ðer/', vi: 'Tiếng bạn bị mất một đoạn.', ex: 'Sorry, you cut out there. Did you say Friday?', exVi: 'Xin lỗi, tiếng bị mất một đoạn. Bạn nói thứ Sáu à?', more: 'Ngày 9 đã có **You\'re breaking up** (rè liên tục). **Cut out** là mất hẳn vài giây.' },
          { w: 'I can hear an echo.', pos: 'phr', ipa: '/aɪ kən ˈhɪr ən ˈekoʊ/', vi: 'Tôi nghe thấy tiếng vọng.', ex: 'I can hear an echo. Is someone using speakers?', exVi: 'Tôi nghe tiếng vọng. Có ai đang dùng loa không?', more: 'Chữa: đeo **headphones**, hoặc người đó tắt mic khi không nói.' },
          { w: 'headphones', pos: 'n', ipa: '/ˈhedfoʊnz/', vi: 'tai nghe', ex: 'Let me grab my headphones.', exVi: 'Để tôi lấy tai nghe.', more: 'Tai nghe nhét tai: **earphones / earbuds**.', anh: 'headphone' },
          { w: "There's a bit of a delay.", pos: 'phr', ipa: '/ðerz ə ˌbɪt əv ə dɪˈleɪ/', vi: 'Tiếng bị trễ một chút.', ex: "Sorry, there's a bit of a delay on my end.", exVi: 'Xin lỗi, bên tôi tiếng bị trễ một chút.', more: '**on my end** = phía tôi (lỗi ở chỗ tôi). Nói vậy là nhận lỗi về mình, rất lịch sự.', anh: 'hourglass-not-done' },
          { w: 'My connection is a bit unstable.', pos: 'phr', ipa: '/maɪ kəˈnekʃn ɪz ə bɪt ʌnˈsteɪbl/', vi: 'Mạng của tôi hơi chập chờn.', ex: "My connection is a bit unstable today. Sorry if I drop out.", exVi: 'Hôm nay mạng tôi hơi chập chờn. Xin lỗi nếu tôi bị rớt.', anh: 'antenna-bars' },
          { w: "I'll drop off and rejoin.", pos: 'phr', ipa: '/aɪl ˌdrɑːp ˈɔːf ən riːˈdʒɔɪn/', vi: 'Tôi thoát ra rồi vào lại.', ex: "My sound isn't working. I'll drop off and rejoin.", exVi: 'Tiếng của tôi không chạy. Tôi thoát ra rồi vào lại.' },
          { w: 'Let me share my screen.', pos: 'phr', ipa: '/ˌlem mi ˈʃer maɪ ˈskriːn/', vi: 'Để tôi chia sẻ màn hình.', ex: 'Let me share my screen. Can everyone see it?', exVi: 'Để tôi chia sẻ màn hình. Mọi người thấy không?', anh: 'desktop-computer' },
          { w: 'Can everyone see my screen?', pos: 'phr', ipa: '/kən ˈevriwʌn ˈsiː maɪ ˈskriːn/', vi: 'Mọi người thấy màn hình của tôi không?', ex: 'Can everyone see my screen? You should see a calendar.', exVi: 'Mọi người thấy màn hình tôi không? Chắc mọi người đang thấy cái lịch.' },
          { w: 'Let me stop sharing.', pos: 'phr', ipa: '/ˌlem mi ˌstɑːp ˈʃerɪŋ/', vi: 'Để tôi tắt chia sẻ.', ex: 'Oops, wrong window! Let me stop sharing.', exVi: 'Ối, nhầm cửa sổ! Để tôi tắt chia sẻ.' },
          { w: 'Could you zoom in a bit?', pos: 'phr', ipa: '/kʊd ju ˌzuːm ˈɪn ə bɪt/', vi: 'Bạn phóng to lên chút được không?', ex: 'The text is really small. Could you zoom in a bit?', exVi: 'Chữ bé quá. Bạn phóng to lên chút được không?' },
          { w: 'Sorry, go ahead.', pos: 'phr', ipa: '/ˈsɑːri ˌɡoʊ əˈhed/', vi: 'Xin lỗi, bạn nói đi.', ex: 'Oh, sorry, Joy. Go ahead.', exVi: 'Ôi, xin lỗi chị Joy. Chị nói đi.', more: 'Câu nhường lời số 1 khi hai người nói chồng. Cũng nói: **You first.** · **After you.**' },
          { w: 'Sorry, I talked over you.', pos: 'phr', ipa: '/ˈsɑːri aɪ ˌtɔːkt ˈoʊvər ju/', vi: 'Xin lỗi, tôi nói chồng lên bạn.', ex: 'Sorry, I talked over you. What were you saying?', exVi: 'Xin lỗi, tôi nói chồng lên bạn. Bạn đang nói gì thế?' },
          { w: 'Can I just jump in here?', pos: 'phr', ipa: '/kən aɪ ˌdʒʌst ˌdʒʌmp ˈɪn hɪr/', vi: 'Cho tôi chen một câu nhé?', ex: 'Can I just jump in here? The nineteenth is bad for me.', exVi: 'Cho tôi chen một câu nhé? Ngày 19 tôi bận.', more: 'Giơ tay ảo (**raise your hand**) rồi nói câu này là cách ngắt lời lịch sự nhất.' },
          { w: 'Could you pop that in the chat?', pos: 'phr', ipa: '/kʊd ju ˌpɑːp ðæt ɪn ðə ˈtʃæt/', vi: 'Bạn gõ cái đó vào khung chat giúp được không?', ex: 'Sorry, could you pop the link in the chat?', exVi: 'Xin lỗi, bạn thả đường link vào khung chat giúp được không?', more: '**pop** = đặt nhanh (thân mật, rất hay dùng ở Anh, Úc). Trang trọng hơn: **Could you put / share it in the chat?**', anh: 'speech-balloon' },
          { w: 'Are you still with us?', pos: 'phr', ipa: '/ɑːr ju ˈstɪl wɪð ʌs/', vi: 'Bạn còn trong cuộc gọi không?', ex: "Ivan? Are you still with us? I think we lost him.", exVi: 'Ivan? Anh còn đó không? Hình như anh ấy rớt rồi.' },
          { w: 'Shall we give it a couple more minutes?', pos: 'phr', ipa: '/ʃæl wi ˈɡɪv ɪt ə ˌkʌpl mɔːr ˈmɪnɪts/', vi: 'Mình chờ thêm vài phút nhé?', ex: "Joy isn't here yet. Shall we give it a couple more minutes?", exVi: 'Joy chưa vào. Mình chờ thêm vài phút nhé?' },
          { w: "Let's get started.", pos: 'phr', ipa: '/lets ˌɡet ˈstɑːrtɪd/', vi: 'Mình bắt đầu nhé.', ex: "Okay, everyone's here. Let's get started.", exVi: 'Được rồi, đủ người rồi. Mình bắt đầu nhé.' },
          { w: "Let's wrap it up there.", pos: 'phr', ipa: '/lets ˌræp ɪt ˈʌp ðer/', vi: 'Mình dừng ở đây nhé.', ex: "We're out of time, so let's wrap it up there.", exVi: 'Hết giờ rồi, mình dừng ở đây nhé.' },
          { w: "I'll let you go.", pos: 'phr', ipa: '/aɪl ˌlet ju ˈɡoʊ/', vi: 'Tôi không giữ bạn nữa. (kết thúc cuộc gọi lịch sự)', ex: "Right, I'll let you get back to work.", exVi: 'Thôi, tôi không giữ bạn nữa, bạn quay lại làm việc đi.' },
          { w: 'Talk soon.', pos: 'phr', ipa: '/ˌtɔːk ˈsuːn/', vi: 'Nói chuyện sau nhé.', ex: 'Thanks, Bridget. Talk soon!', exVi: 'Cảm ơn chị Bridget. Nói chuyện sau nhé!', more: 'Kiểu Anh: **Speak soon.** Kết thúc cuộc gọi nhóm: **Thanks, everyone. Bye!** rồi vẫy tay.' },
          { w: 'background noise', pos: 'n', ipa: '/ˈbækɡraʊnd nɔɪz/', vi: 'tiếng ồn xung quanh', ex: "Sorry about the background noise. I'm in a café.", exVi: 'Xin lỗi vì tiếng ồn, tôi đang ở quán cà phê.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Gọi video với bạn bè thì nói gì cũng được. Gọi với đồng nghiệp thì dùng cột **giữa**. Cột **trang trọng** dành cho sếp lớn, người mới gặp lần đầu hoặc cuộc gọi đông người. Mức trang trọng thường dài hơn và hay có **sorry** ở đầu.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp lớn, đông người)'],
        rows: [
          ['Báo người khác tắt mic', "You're muted, mate!", "I think you're on mute.", "Sorry to interrupt, I think you might be on mute."],
          ['Hỏi có nghe rõ không', 'Can you hear me?', 'Can you hear me okay?', 'Could you let me know if you can hear me clearly?'],
          ['Chia sẻ màn hình', "I'll share my screen.", 'Let me share my screen.', "If it's okay with everyone, I'll share my screen."],
          ['Nói chồng lời', 'Oh, you go!', 'Sorry, go ahead.', 'Sorry, I talked over you. Please, go ahead.'],
          ['Xin chen vào', 'Wait, wait—', 'Can I just jump in here?', 'Could I just add something here?'],
          ['Mạng kém', 'My Wi-Fi is dying!', "Sorry, there's a bit of a delay on my end.", 'Apologies, my connection seems to be unstable today.'],
          ['Vào muộn', "Sorry, I'm late!", "Sorry I'm late. I couldn't get in.", 'Apologies for joining late. I had some technical issues.'],
          ['Kết thúc', 'Okay, bye!', "I'll let you go. Talk soon.", 'Thank you for your time, everyone. Have a good afternoon.'],
        ],
        caption: 'Với cuộc gọi đông người hoặc có sếp lớn, câu "Sorry to interrupt" đặt trước khi nhắc ai đó tắt mic là phép lịch sự rất được để ý.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Cuộc gọi video toàn chuyện "nếu… thì…": nếu không nghe thấy, nếu hình đứng, nếu đầy chỗ. Tiếng Anh nói chuyện **có thể xảy ra** bằng **điều kiện loại 1**: vế If dùng **hiện tại đơn**, vế kết quả dùng **will** hoặc **câu mệnh lệnh**. Còn khi bạn **tự đề nghị làm gì**, mở đầu bằng **Let me…**',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'If + S + V (hiện tại đơn), S + will + V',
            vi: 'Nếu chuyện này xảy ra thì chuyện kia sẽ xảy ra. Vế If **không** có will.',
            examples: [
              { en: "If we go on the twelfth, flights will be cheaper.", vi: 'Nếu đi ngày 12 thì vé bay sẽ rẻ hơn.' },
              { en: "If the course is full, I'll put you on the waiting list.", vi: 'Nếu khoá học đầy, chị sẽ cho em vào danh sách chờ.' },
              { en: "If my video freezes, I'll turn my camera off.", vi: 'Nếu hình bị đứng, tôi sẽ tắt camera.' },
            ],
          },
          {
            formula: 'If + S + V (hiện tại đơn), (just) + V',
            vi: 'Nếu… thì cứ làm thế này. Vế sau là câu mệnh lệnh, thêm **just** cho nhẹ nhàng.',
            examples: [
              { en: "If you can't hear me, just type in the chat.", vi: 'Nếu không nghe thấy tôi thì cứ gõ vào khung chat.' },
              { en: "If you don't hear from HR by Wednesday, ping me.", vi: 'Nếu tới thứ Tư chưa nghe phòng nhân sự trả lời thì nhắn chị.' },
              { en: 'If anyone has a problem with that, let me know by Friday.', vi: 'Ai có vấn đề gì thì báo tôi trước thứ Sáu.' },
            ],
          },
          {
            formula: 'S + will + V + if + S + V',
            vi: 'Đảo vế If ra sau. Khi đó **không cần dấu phẩy**.',
            examples: [
              { en: "I'll send you the link if you can't find it.", vi: 'Tôi sẽ gửi link nếu bạn không tìm thấy.' },
              { en: "She'll drop the phone in the cake if I give it to her.", vi: 'Đưa điện thoại cho nó là nó làm rơi vào bánh.' },
              { en: "I'll rejoin if the sound doesn't come back.", vi: 'Tôi sẽ vào lại nếu tiếng không có lại.' },
            ],
          },
          {
            formula: 'Let me + V',
            vi: 'Để tôi làm… (tự đề nghị, báo trước việc mình sắp làm). Sau Let me là động từ nguyên mẫu, **không** có to.',
            examples: [
              { en: 'Let me share my screen.', vi: 'Để tôi chia sẻ màn hình.' },
              { en: 'Let me mute myself for a second.', vi: 'Để tôi tắt mic một giây.' },
              { en: 'Let me check and get back to you.', vi: 'Để tôi kiểm tra rồi báo lại bạn.' },
            ],
          },
          {
            formula: "Let's + V · Let's not + V",
            vi: 'Mình cùng làm… (rủ cả nhóm, chốt quyết định).',
            examples: [
              { en: "Let's go with the twelfth.", vi: 'Mình chốt ngày 12 nhé.' },
              { en: "Let's give it a couple more minutes.", vi: 'Mình chờ thêm vài phút.' },
              { en: "Let's not wait for Ivan. He's driving.", vi: 'Đừng chờ Ivan. Anh ấy đang lái xe.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu', 'Ai làm', 'Dùng khi'],
        rows: [
          ['Let me share my screen.', 'Tôi', 'Báo trước việc mình sắp làm. Không cần ai đồng ý.'],
          ['Can I share my screen?', 'Tôi', 'Xin phép, vì người khác đang chia sẻ hoặc đang chủ trì.'],
          ["Let's share our screens.", 'Cả nhóm', 'Rủ mọi người cùng làm.'],
          ['Could you share your screen?', 'Bạn', 'Nhờ người khác làm.'],
        ],
        caption: '"Let me" và "Let\'s" trông giống nhau nhưng khác hẳn: **Let me** = để TÔI; **Let\'s** (= let us) = MÌNH CÙNG.',
      },
      {
        t: 'rule',
        formula: 'If + S + V (hiện tại đơn), S + will + V / V (mệnh lệnh) · Let me + V',
        vi: 'Chuyện có thể xảy ra: vế If dùng hiện tại đơn (không will), vế kia dùng will hoặc câu mệnh lệnh. Tự đề nghị làm gì: Let me + V.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: otherwise (và unless để nghe hiểu)',
        items: [
          '**otherwise** = "nếu không thì". Đứng đầu câu thứ hai, có dấu phẩy: "Let me know by Friday. **Otherwise**, I\'ll book the hotel."',
          'Hay dùng sau một lời nhắc: "Please use headphones. **Otherwise**, we\'ll hear an echo." (Đeo tai nghe nhé. Không thì sẽ có tiếng vọng.)',
          '**unless** = "trừ khi" = if… not. "I\'ll book the hotel **unless** someone says no." Bạn chưa cần tự nói, nhưng nghe thấy thì hiểu: unless đi với câu **khẳng định** mà nghĩa là phủ định.',
          'Đừng viết ~~If you don\'t let me know, otherwise…~~: chọn một trong hai, If hoặc Otherwise.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd17-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'If + hiện tại đơn, will + V / V (mệnh lệnh) · Let me + V · Let\'s + V · otherwise',
        items: [
          { q: 'Nếu bạn không nghe thấy tôi thì cứ gõ vào khung chat.', hint: "if, can't hear, just type, chat", answers: ["If you can't hear me, just type in the chat.", "If you can't hear me just type in the chat.", "If you cannot hear me, just type in the chat.", "If you can't hear me, just type it in the chat.", "If you can't hear me, type in the chat."] },
          { q: 'Để tôi chia sẻ màn hình.', hint: 'let me, share', answers: ['Let me share my screen.'] },
          { q: 'Nếu hình bị đứng, tôi sẽ tắt camera.', hint: 'if, video freezes, turn off', answers: ["If my video freezes, I'll turn off my camera.", "If my video freezes, I'll turn my camera off.", "If my video freezes, I will turn off my camera.", "If the video freezes, I'll turn off my camera.", "If my video freezes, I'll turn off the camera.", "If it freezes, I'll turn my camera off.", "If it freezes, I'll turn off my camera."] },
          { q: 'Mình chốt ngày thứ Ba nhé.', hint: "let's, go with", answers: ["Let's go with Tuesday.", "Let's go for Tuesday.", "Let's choose Tuesday.", "Let's go with Tuesday then."] },
          { q: 'Đeo tai nghe nhé. Không thì sẽ có tiếng vọng.', hint: "please use headphones, otherwise, there'll be", answers: ["Please use headphones. Otherwise, there'll be an echo.", "Please use headphones. Otherwise there'll be an echo.", "Please use headphones. Otherwise, there will be an echo.", "Please wear headphones. Otherwise, there'll be an echo.", "Use headphones, please. Otherwise, there'll be an echo.", "Please use your headphones. Otherwise, there'll be an echo.", "Please use headphones. Otherwise, we'll hear an echo."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 7 lỗi trong cuộc gọi video',
        items: [
          '~~If I will be late, I will message you.~~ → **If I\'m late, I\'ll message you.** Lỗi số một của câu điều kiện: vế If **không** dùng will, dù nghĩa là tương lai. Tiếng Việt "nếu mai tôi sẽ đến muộn" nghe được, tiếng Anh thì không.',
          '~~You are mute.~~ → **You\'re on mute.** / **You\'re muted.** Tính từ "mute" đứng một mình nghĩa là **câm**. Thiếu chữ "on" là câu thành hơi kỳ.',
          '~~Do you see my screen?~~ → **Can you see my screen?** Hỏi người kia có thấy, có nghe được không thì dùng **can**: Can you see…? Can you hear…?',
          '~~Let me to share my screen.~~ → **Let me share my screen.** Sau let me là động từ nguyên mẫu **không có to**.',
          '~~My internet is weak.~~ → **My connection is a bit unstable.** / **My Wi-Fi is really slow today.** "weak" nghe như dịch từng chữ. Người bản xứ nói về **connection**, **Wi-Fi**, **signal**.',
          '~~Sorry, I speak first.~~ (khi hai người cùng nói) → **Sorry, go ahead.** / **You first.** Phép lịch sự khi nói chồng là **nhường lời**, không phải giành lời. Ai nhường trước là người lịch sự.',
          '~~Can everyone hear clearly me?~~ → **Can everyone hear me clearly?** Trạng từ (clearly, okay, well) đứng **sau** tân ngữ "me", không chen giữa động từ và tân ngữ.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể trên camera' },
      {
        t: 'p',
        text: 'Trên camera, người ta chỉ thấy **gương mặt và đôi tay** của bạn. Mọi tín hiệu nhỏ thành ra rất to. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi gọi video',
        items: [
          { anh: 'eyes', w: 'Can you hear me okay?', ro: '/kən ju ˈhɪr mi oʊˈkeɪ/', vi: 'Khi **bạn** nói: nhìn vào **ống kính camera**, không nhìn vào mặt người kia trên màn hình. Nhìn màn hình thì trông như đang nhìn xuống.' },
          { anh: 'head-shaking-vertically', w: 'Mm-hmm. Right.', ro: '/mˈhm/', vi: 'Gật đầu khi người khác nói, nhất là lúc bạn **đang tắt mic**: người nói biết bạn vẫn đang nghe.' },
          { anh: 'raised-hand', w: 'Can I just jump in here?', ro: '/kən aɪ ˌdʒʌst ˌdʒʌmp ˈɪn hɪr/', vi: 'Giơ tay (thật hoặc nút "Raise hand") rồi chờ được gọi. Lịch sự hơn bật mic nói chen ngay.' },
          { anh: 'thumbs-up', w: 'Sounds good.', ro: '/ˌsaʊndz ˈɡʊd/', vi: 'Giơ ngón cái lên camera = "đồng ý" mà không cần bật mic. Ở cuộc gọi đông người, cách này giúp không ai phải nói chồng.' },
          { anh: 'waving-hand', w: 'Thanks, everyone. Bye!', ro: '/θæŋks ˈevriwʌn baɪ/', vi: 'Vẫy tay khi chào lúc đầu và lúc kết thúc. Gần như ai cũng vẫy, kể cả sếp.' },
          { anh: 'index-pointing-up', w: 'Sorry, one second.', ro: '/ˈsɑːri wʌn ˈsekənd/', vi: 'Giơ một ngón tay = "chờ tôi một giây" (khi có người gọi, chó sủa…). Kèm tắt mic.' },
          { anh: 'person-bowing', w: 'Thank you, Sato-san.', ro: '', vi: 'Với đồng nghiệp Nhật: cúi đầu nhẹ trước camera khi chào và khi kết thúc. Nhiều người Nhật cúi chào cả khi gọi video.' },
          { anh: 'fork-and-knife-with-plate', w: '(đừng làm) ăn trên camera', ro: '', vi: 'Ăn uống khi đang bật camera thường bị coi là thiếu lịch sự ở công sở. Đói thì tắt camera hoặc ăn trước. Một cốc trà, cà phê thì không sao.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Bật camera', 'Nhiều người tắt, nhất là sinh viên.', 'Cuộc gọi nhỏ trong nhóm thường bật. Cuộc đông người thì tuỳ, nhưng lúc **mình nói** thì nên bật.', 'Nhiều công ty quen tắt camera. Thấy người khác tắt thì bạn cũng có thể tắt.'],
          ['Khi người khác nói', 'Im lặng, ít phản hồi.', 'Gật đầu, mỉm cười, thỉnh thoảng "Right", "Mm-hmm" (khi bật mic).', 'Gật đầu và nói "hai" (vâng) **rất nhiều** để báo đang nghe, không có nghĩa là đồng ý.'],
          ['Nói chồng lời', 'Ít ai nhường, người lớn hơn nói trước.', 'Nhường ngay: "Sorry, go ahead." Ai nhường trước được coi là lịch sự.', 'Rất ít nói chen. Thường chờ người chủ trì mời.'],
          ['Đúng giờ', 'Vào muộn 2–3 phút là bình thường.', 'Vào đúng giờ hoặc sớm 1 phút. Muộn thì gõ chat báo trước.', 'Vào sớm vài phút. Muộn là chuyện lớn, phải xin lỗi.'],
          ['Kết thúc', 'Cúp máy ngay khi xong việc.', 'Chào, vẫy tay, rồi mới bấm rời cuộc gọi.', 'Cúi đầu, cảm ơn, thường chờ người chủ trì rời trước.'],
        ],
        caption: 'Lưu ý ô **Nhật – gật đầu**: "hai" trong cuộc gọi có nghĩa "tôi đang nghe", chưa chắc là "tôi đồng ý". Ngày 18 học kỹ chuyện nói "không" khéo.',
      },

      { t: 'h', text: '6. Phát âm: nối âm và rút gọn trong câu gọi video' },
      {
        t: 'p',
        text: 'Trong cuộc gọi, người ta nói nhanh và **dính chữ**: "Let me" thành /lemi/, "cut out" thành "cu-đao" (âm t giữa hai nguyên âm kiểu Mỹ đọc nhẹ như d), "go ahead" chen thêm âm /w/ thành "gô-wơ-hed". Bạn không cần nói nhanh như vậy, nhưng phải **nghe ra**. Đọc theo mẫu, giữ rõ âm cuối.',
      },
      {
        t: 'phatam',
        id: 'gtd17-phat-am',
        title: 'Luyện phát âm — 8 câu hay nói khi gọi video',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Chú ý âm cuối /t/, /v/, /z/ và các chỗ nối âm.',
        items: [
          { text: "You're on mute.", ipa: 'jɔːr ɒn mjuːt', vi: 'nối: you\'re‿on · mute có /j/ sau m: "miu-t", giữ /t/ cuối' },
          { text: 'Let me share my screen.', ipa: 'let miː ʃeə maɪ skriːn', vi: 'Let me nối thành "lem-mi" · share bắt đầu bằng /ʃ/ (chu môi), không đọc "se"' },
          { text: 'You cut out there.', ipa: 'juː kʌt aʊt ðeə', vi: 'nối: cut‿out · there bắt đầu bằng /ð/: đặt lưỡi giữa răng, có rung' },
          { text: "I think you've frozen.", ipa: 'aɪ θɪŋk juːv frəʊzn', vi: 'think /θ/ không rung, frozen /z/ có rung · giữ /v/ trong you\'ve' },
          { text: 'Sorry, go ahead.', ipa: 'sɒri ɡəʊ əhed', vi: 'go‿ahead chen âm /w/: "gâu-wơ-hed" · nhấn vào -head' },
          { text: 'Can you hear me okay?', ipa: 'kən juː hɪə miː əʊkeɪ', vi: 'can đọc nhẹ /kən/ · lên giọng ở cuối câu hỏi yes/no' },
          { text: "There's a bit of a delay.", ipa: 'ðeəz ə bɪt əv ə dɪleɪ', vi: 'a bit of a nối liền "ơ-bi-rơ-vơ" · nhấn vào -lay' },
          { text: "If you can't hear me, just type in the chat.", ipa: 'ɪf juː kɑːnt hɪə miː dʒʌst taɪp ɪn ðə tʃæt', vi: 'can\'t /ɑː/ dài, giữ /t/ · ngắt nhẹ sau dấu phẩy, xuống giọng ở chat' },
        ],
      },

      { t: 'h', text: '7. Một cuộc gọi đi qua những bước nào' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Năm bước của một cuộc gọi video nhóm',
        caption: 'Bước 3 có thể xảy ra bất cứ lúc nào. Thuộc sẵn câu cho từng bước là không bao giờ đứng hình.',
        steps: [
          { label: 'Trước khi vào', sub: 'đeo tai nghe · thử mic · đóng email riêng' },
          { label: 'Vào và kiểm tra', sub: "Hi, everyone. Can you hear me okay?" },
          { label: 'Khi có sự cố', sub: "You're on mute · You've frozen · I'll drop off and rejoin" },
          { label: 'Chia sẻ, bàn bạc', sub: 'Let me share my screen · Sorry, go ahead' },
          { label: 'Kết thúc', sub: "Let's wrap it up there. Thanks, everyone. Talk soon!" },
        ],
      },

      { t: 'h', text: '8. Nhập vai: bạn dẫn một cuộc gọi nhỏ' },
      {
        t: 'dialogue',
        title: 'Thư gọi Hugo (Anh) để chọn ảnh cho tấm thiệp chia tay một đồng nghiệp',
        lines: [
          { who: 'Thư', role: 'a', text: 'Hi, Hugo! Can you hear me okay?', vi: 'Chào anh Hugo! Anh nghe em rõ không?' },
          { who: 'Hugo', role: 'b', text: "Hiya, Thư. Sorry I'm late. I couldn't get in at first. Yes, I can hear you, but you're a bit quiet.", vi: 'Chào Thư. Xin lỗi anh vào muộn. Lúc đầu anh không vào được. Ừ, anh nghe thấy em, nhưng hơi nhỏ.' },
          { who: 'Thư', role: 'a', text: "Let me move closer to the mic… Is that better?", vi: 'Để em ngồi gần mic hơn… Giờ đỡ chưa anh?' },
          { who: 'Hugo', role: 'b', text: 'Much better.', vi: 'Đỡ nhiều rồi.' },
          { who: 'Thư', role: 'a', text: "Great. Let me share my screen. I've got three photos for Mai's card. Can you see them?", vi: 'Tuyệt. Để em chia sẻ màn hình. Em có ba ảnh cho tấm thiệp của chị Mai. Anh thấy không?' },
          { who: 'Hugo', role: 'b', text: "I can see them, but they're tiny. Could you zoom in a bit?", vi: 'Anh thấy rồi, nhưng bé tí. Em phóng to lên chút được không?' },
          { who: 'Thư', role: 'a', text: 'Sure. So, photo one is from the team trip, and photo two—', vi: 'Vâng. Ảnh một là từ chuyến đi của team, còn ảnh hai—' },
          { who: 'Hugo', role: 'b', text: "Sorry, you cut out there. Photo two is what?", vi: 'Xin lỗi, tiếng em bị mất. Ảnh hai là gì?' },
          { who: 'Thư', role: 'a', text: "Photo two is from her birthday. If you like it, I'll print it tonight.", vi: 'Ảnh hai là từ sinh nhật chị ấy. Nếu anh thích, tối nay em in.' },
          { who: 'Hugo', role: 'b', text: "Let's go with photo two. Everyone's in it.", vi: 'Chốt ảnh hai đi. Có đủ mọi người trong đó.' },
          { who: 'Thư', role: 'a', text: "Perfect. Let me stop sharing. If anyone wants to write a message, I'll leave the card on my desk. Otherwise, I'll give it to Mai on Friday.", vi: 'Tuyệt ạ. Để em tắt chia sẻ. Ai muốn viết lời chúc thì em để thiệp trên bàn em. Không thì thứ Sáu em đưa chị Mai.' },
          { who: 'Hugo', role: 'b', text: "Sounds good. Right, I'll let you go. Talk soon!", vi: 'Được đấy. Thôi, anh không giữ em nữa. Nói chuyện sau nhé!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd17-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Thư (5 câu)',
        items: [
          { vi: 'Bắt đầu cuộc gọi: Anh nghe em rõ không?', chips: ['Can', 'you', 'hear', 'me', 'okay?', 'listen', 'do'], answer: ['Can', 'you', 'hear', 'me', 'okay?'] },
          { vi: 'Hugo: "You\'re a bit quiet." → Để em ngồi gần mic hơn.', chips: ['Let', 'me', 'move', 'closer', 'to', 'the', 'mic.', 'us', 'near'], answer: ['Let', 'me', 'move', 'closer', 'to', 'the', 'mic.'] },
          { vi: 'Để em chia sẻ màn hình.', chips: ['Let', 'me', 'share', 'my', 'screen.', 'to', "Let's"], answer: ['Let', 'me', 'share', 'my', 'screen.'] },
          { vi: 'Nếu anh thích, tối nay em in.', chips: ['If', 'you', 'like', 'it,', "I'll", 'print', 'it', 'tonight.', 'will', 'liked'], answer: ['If', 'you', 'like', 'it,', "I'll", 'print', 'it', 'tonight.'] },
          { vi: 'Hai người nói chồng → Xin lỗi, anh nói đi.', chips: ['Sorry,', 'go', 'ahead.', 'speak', 'first', 'I'], answer: ['Sorry,', 'go', 'ahead.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd17-noi-tra-loi',
        part: '1',
        questions: [
          "Sorry, I can't see your screen yet. What should I do?",
          'Your video keeps freezing. What can you do?',
          "What will you do if you're late for a video call?",
          'How do you usually end a video call with a friend?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây, rồi nói bằng giọng của bạn. Tưởng tượng có một màn hình trước mặt.',
          '"You are Hugo, a friendly British colleague. We are on a video call to choose a photo for a colleague\'s farewell card. I am leading the call. During the call, create three problems one by one: first my voice is too quiet, then my screen share shows the wrong window, then you cut out in the middle of my sentence. Wait for me to fix each problem using phrases like \'Let me…\', \'Can you see my screen?\', \'Sorry, go ahead\'. Use at least two sentences with \'If…\' yourself. Speak at natural speed (B1). After 10 turns, end the call politely, then tell me in Vietnamese two things I did well and two things to fix, especially any \'If I will…\' mistakes."',
          'Làm **2 lượt**. Lượt hai đổi vai: AI dẫn cuộc gọi, bạn là người vào muộn, mạng kém, và phải tự báo sự cố của mình ("Sorry, there\'s a bit of a delay on my end").',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd17-doc',
    kind: 'reading',
    title: 'Lời mời gọi, chat trong cuộc gọi, ghi chú sau cuộc gọi',
    goal: 'Đọc hiểu một lời mời gọi video (giờ ở ba múi giờ, link, ai bắt buộc dự), các tin nhắn chat trong lúc gọi và bản ghi chú ngắn sau cuộc gọi; nhận ra ai phải làm gì, hạn khi nào.',
    minutes: 18,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn mẩu chữ **thật** quanh một cuộc gọi video: **lời mời trên lịch** · **khung chat trong cuộc gọi** · **ghi chú sau cuộc gọi** · **một tin trả lời lời mời**.',
          'Cuộc gọi vẫn là chuyện chốt chuyến đi cuối năm của team Thư, lần này là **cuộc gọi thứ hai**: chốt khách sạn và chia việc.',
          'Đọc để trả lời ba câu: **Mấy giờ, ở múi giờ của tôi? · Tôi có bắt buộc phải vào không? · Sau cuộc gọi tôi phải làm gì, hạn khi nào?**',
          'Nhặt các chữ viết tắt hay gặp trong chat: brb, FYI, TBC, +1, ASAP.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['spiral-calendar', 'link', 'speech-balloon', 'memo', 'check-mark-button'],
        caption: 'Thứ Hai, Thư mở lịch và thấy một lời mời mới của **Dylan**. Hôm sau là cuộc gọi, rồi đến bản ghi chú Dylan gửi cả nhóm.',
      },
      {
        t: 'passage',
        title: 'Before, during and after the call',
        intro: 'Đọc một lượt, chưa tra từ. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**CALENDAR INVITATION** — **December trip: hotel + who does what** · Organiser: Dylan Evans · **Tue 17 Nov** · **9:00–9:30 am (ICT, Da Nang)** / 10:00–10:30 am (PHT, Manila) / 3:00–3:30 pm (NZDT, Auckland) · **Join link:** saltmarsh.video/trip-call · Required: Joy Reyes, Thư Nguyễn · **Optional:** Ivan Petrov · Note: Quick one, **camera optional**. If you can\'t make it, **reply with a comment** and I\'ll fill you in afterwards. · RSVP: Yes / No / **Maybe**',
          },
          {
            label: 'B',
            text: '**IN-CALL CHAT** — Joy Reyes 9:01: Morning! **Joining from my phone**, I\'m on the bus, so I\'ll **stay on mute** 🙂 · Thư Nguyễn 9:04: **Is it just me, or** has Dylan frozen? · Ivan Petrov 9:04: **Not just you.** · (Dylan Evans has left the meeting.) · (Dylan Evans has joined the meeting.) · Dylan Evans 9:06: Sorry! **Back now.** Here are the two hotels: saltmarsh.link/hotels · Joy Reyes 9:08: **+1** for the one near the beach · Ivan Petrov 9:09: **brb**, doorbell · Ivan Petrov 9:11: back · Thư Nguyễn 9:12: Can I check the restaurants for the first night? · Dylan Evans 9:12: Yes please! 🙏',
          },
          {
            label: 'C',
            text: '**Quick notes from today\'s call** (Dylan, 9:40 am) — Hi all, thanks for joining, **despite the frozen host** 😅 **Decided:** Dates 12–14 Dec. Hotel: Sea Lantern (near My Khe beach). **Still to be confirmed (TBC):** airport pick-up for Joy and Ivan. **Action items:** Dylan: book the hotel **by Fri 20 Nov**. Joy: **send** flight times **by Wed**. Thư: **shortlist** 3 restaurants for 12 Dec (**budget**: around 400,000 VND per person). **Next call:** Tue 24 Nov, same time. **FYI:** Ivan can only join on day two. **Shout if I\'ve missed anything!**',
          },
          {
            label: 'D',
            text: '**Reply to invitation — Ivan Petrov (Maybe):** Hi Dylan, I\'ll **try to join**, but I might be a few minutes late. I\'ve got a dentist appointment at 2:30. If I can\'t make it, **go ahead without me**. Cheers!',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd17-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Trong lời mời (A), cuộc gọi lúc mấy giờ theo giờ Auckland?',
            options: ['9:00 sáng', '10:00 sáng', '3:00 chiều', '9:30 sáng'],
            correct: 2,
            why: 'Lời mời ghi cả ba múi giờ: 9:00 ICT (Đà Nẵng) = 10:00 PHT (Manila) = **3:00 pm NZDT** (Auckland).',
          },
          {
            q: 'Ivan có bắt buộc phải vào cuộc gọi không?',
            options: ['Có, vì anh là người tổ chức', 'Không, anh ở mục Optional (không bắt buộc)', 'Có, vì anh trả lời Maybe', 'Bài không nói'],
            correct: 1,
            why: '**Required** = bắt buộc: Joy, Thư. **Optional** = vào cũng được, không vào cũng được: Ivan.',
          },
          {
            q: '"If you can\'t make it, reply with a comment and I\'ll fill you in afterwards." Ai không vào được thì sao?',
            options: ['Bị trừ điểm', 'Trả lời lời mời kèm ghi chú, Dylan sẽ kể lại nội dung sau', 'Phải gọi điện cho Dylan', 'Phải tìm người thay'],
            correct: 1,
            why: '**can\'t make it** = không đến / không tham gia được. **fill you in** = kể lại cho bạn những gì bạn bỏ lỡ.',
          },
          {
            q: 'Vì sao Joy tắt mic suốt cuộc gọi (B)?',
            options: ['Vì Joy không muốn nói', 'Vì Joy đang gọi bằng điện thoại trên xe buýt, xung quanh ồn', 'Vì mic của Joy hỏng', 'Vì Dylan bảo Joy tắt'],
            correct: 1,
            why: '"Joining from my phone, I\'m **on the bus**, so I\'ll **stay on mute**." Báo trước trong chat là phép lịch sự, mọi người không phải nhắc "you\'re on mute".',
          },
          {
            q: 'Thư viết "Is it just me, or has Dylan frozen?". Thư muốn hỏi gì?',
            options: ['Thư hỏi mình có bị đuổi khỏi cuộc gọi không', 'Thư hỏi có phải chỉ máy mình thấy Dylan bị đứng, hay mọi người cũng thấy', 'Thư trách Dylan', 'Thư hỏi Dylan có lạnh không'],
            correct: 1,
            why: '**Is it just me, or…?** = Chỉ mình tôi bị, hay mọi người cũng thế? Câu hỏi rất hay dùng để kiểm tra lỗi ở máy mình hay máy người khác.',
          },
          {
            q: 'Trong ghi chú (C), Thư phải làm gì?',
            options: ['Đặt khách sạn', 'Gửi giờ bay', 'Chọn sẵn 3 nhà hàng cho tối 12/12, khoảng 400.000 đồng/người', 'Đón Joy ở sân bay'],
            correct: 2,
            why: '"Thư: **shortlist** 3 restaurants for 12 Dec (**budget**: around 400,000 VND per person)." **shortlist** = chọn ra vài phương án tốt nhất để cả nhóm chọn tiếp.',
          },
          {
            q: 'Việc nào CHƯA chốt sau cuộc gọi?',
            options: ['Ngày đi', 'Khách sạn', 'Xe đón Joy và Ivan ở sân bay', 'Ngày gọi lần sau'],
            correct: 2,
            why: '"**Still to be confirmed (TBC)**: airport pick-up for Joy and Ivan." TBC = to be confirmed, chưa chốt.',
          },
          {
            q: 'Dylan kết thúc ghi chú bằng "Shout if I\'ve missed anything!". Câu này có giọng điệu thế nào?',
            options: ['Ra lệnh, nghiêm khắc', 'Thân thiện, mời mọi người bổ sung nếu anh ghi thiếu', 'Giận dữ', 'Trang trọng như thư gửi khách'],
            correct: 1,
            why: '**Shout** ở đây không phải "hét": "Shout if…" = cứ lên tiếng nếu… Thân mật, rất hay gặp ở Anh và Úc. Đi cùng emoji 😅 và câu đùa "despite the frozen host".',
          },
        ],
      },

      { t: 'h', text: '2. 12 cụm hay gặp quanh một cuộc gọi' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['Join link', 'Đường link để vào cuộc gọi', 'Lời mời'],
          ['Required · Optional', 'Bắt buộc · Không bắt buộc', 'Lời mời'],
          ["can't make it", 'không tham gia được', 'Trả lời lời mời'],
          ['fill someone in', 'kể lại cho ai những gì họ bỏ lỡ', 'Lời mời, tin nhắn'],
          ['Is it just me, or…?', 'Chỉ mình tôi bị, hay mọi người cũng thế?', 'Chat trong cuộc gọi'],
          ['+1', 'Tôi đồng ý / tôi cũng vậy', 'Chat'],
          ['brb (be right back)', 'Tôi ra ngoài chút, quay lại ngay', 'Chat'],
          ['Back now.', 'Tôi quay lại rồi', 'Chat'],
          ['Action items', 'Việc phải làm sau cuộc gọi (ai, làm gì, hạn)', 'Ghi chú sau cuộc gọi'],
          ['TBC (to be confirmed)', 'Chưa chốt', 'Ghi chú, lịch'],
          ['FYI (for your information)', 'Để mọi người biết', 'Ghi chú, email'],
          ["Shout if I've missed anything.", 'Thiếu gì cứ nói nhé', 'Cuối ghi chú'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc lời mời và ghi chú cho nhanh',
        items: [
          '**Lời mời**: tìm ngay ba thứ: **giờ ở múi giờ của mình** (ICT là giờ Việt Nam), **Required hay Optional**, **join link**. Phần còn lại đọc sau.',
          '**Ghi chú sau cuộc gọi**: kéo thẳng xuống **Action items**, tìm **tên mình**, gạch chân **hạn** (by Fri, by Wed). Bỏ lỡ một hạn là điều người ta nhớ lâu nhất.',
          'Trả lời lời mời: **Yes** (có), **No** (không), **Maybe / Tentative** (có thể). Chọn Maybe thì nên **viết thêm một câu lý do** như Ivan ở mẩu D.',
          'Giọng điệu chat trong cuộc gọi luôn **thân mật**: câu cụt, emoji, viết tắt. Đừng gõ "Dear all" trong khung chat.',
          'Cuộc gọi có **khách hàng** thì lời mời và biên bản trang trọng hơn nhiều: xem khoá **Technical English at Work**.',
        ],
      },

      { t: 'h', text: '3. Tập đọc nhanh' },
      {
        t: 'quiz',
        id: 'gtd17-doc-viet-tat',
        title: 'Chữ viết tắt và cụm trong chat nghĩa là gì? Gõ cụm tiếng Anh đầy đủ hoặc từ tiếng Anh đúng (5 câu)',
        kind: 'fill',
        items: [
          { q: 'brb = be right ___', answers: ['back'] },
          { q: 'TBC = to be ___', answers: ['confirmed'] },
          { q: 'FYI = for your ___', answers: ['information'] },
          { q: "I can't ___ it on Tuesday. (không tham gia được)", answers: ['make'] },
          { q: "Don't worry, I'll ___ you in after the call. (kể lại)", answers: ['fill'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd17-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 17',
    goal: 'Làm 35 câu có đáp án để nhớ chắc câu xử lý sự cố khi gọi video, câu điều kiện loại 1, Let me / Let\'s, và ôn lại Ngày 13–16.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền điều kiện loại 1 · dịch · nghe chép · ghép câu.',
          'Có vài câu **ôn Ngày 13–16** (làm quen, câu đuôi, nhờ giúp, xin nghỉ) xen giữa, ghi rõ (Ngày N).',
          'Làm không nhìn lại bài. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 18.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd17-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp đang nói, môi mấp máy nhưng không có tiếng. Bạn nói:',
            options: ['You are mute.', "Sorry, I think you're on mute.", 'Speak!', "I don't hear anything, what's wrong with you?"],
            correct: 1,
            why: '**I think you\'re on mute.** Có "I think" cho nhẹ. "You are mute" = bạn bị câm.',
          },
          {
            q: 'Bạn chia sẻ màn hình và muốn chắc mọi người thấy:',
            options: ['Do you see my screen?', 'Can everyone see my screen?', 'Look my screen.', 'Are you seeing my screen now or not?'],
            correct: 1,
            why: 'Hỏi khả năng nhìn / nghe: **Can you see…? Can you hear…?**',
          },
          {
            q: 'Bạn và một chị đồng nghiệp cùng bắt đầu nói. Bạn nên:',
            options: ['Nói to hơn để được nói trước', 'Im lặng và tắt camera', '"Sorry, go ahead."', '"Wait, I speak first."'],
            correct: 2,
            why: 'Nhường lời bằng **Sorry, go ahead.** Người nhường trước được coi là lịch sự.',
          },
          {
            q: 'Hình của sếp đứng hẳn, tiếng cũng mất. Bạn nói với cả nhóm:',
            options: ['I think we lost Dylan.', 'Dylan is broken.', 'Dylan died.', 'Dylan, wake up!'],
            correct: 0,
            why: '**We lost + tên** = người đó bị rớt khỏi cuộc gọi. Câu chuẩn, không ai thấy phật lòng.',
          },
          {
            q: 'Bạn nghe tiếng của chính mình vọng lại. Bạn hỏi:',
            options: ['Why my voice come back?', "I can hear an echo. Is someone using speakers?", 'Turn off your computer.', 'Your sound is wrong.'],
            correct: 1,
            why: 'Nêu sự cố (**I can hear an echo**) rồi hỏi nguyên nhân hay gặp nhất (loa ngoài). Không đổ lỗi cho ai cụ thể.',
          },
          {
            q: 'Mạng nhà bạn yếu, hình cứ giật. Câu tự nhiên nhất:',
            options: ['My internet is weak.', "Sorry, my connection is a bit unstable. Let me turn my camera off.", 'My Wi-Fi is not strong enough power.', 'I lag.'],
            correct: 1,
            why: 'Báo nguyên nhân (**connection is a bit unstable**) + việc mình sẽ làm (**Let me turn my camera off**).',
          },
          {
            q: 'Cuộc gọi đã quá giờ, bạn là người chủ trì. Bạn nói:',
            options: ['Finish!', "We're out of time, so let's wrap it up there. Thanks, everyone.", 'Okay bye.', 'Stop talking now.'],
            correct: 1,
            why: "**Let's wrap it up there** + cảm ơn mọi người. Kết thúc cuộc gọi nhóm phải có lời cảm ơn.",
          },
          {
            q: 'Một người hỏi "Is it just me, or is the sound really bad?". Họ muốn biết:',
            options: ['Họ có bị ghét không', 'Mọi người có cùng bị tiếng xấu không, hay chỉ máy họ', 'Ai đang nói', 'Họ có nên rời cuộc gọi không'],
            correct: 1,
            why: '**Is it just me, or…?** = chỉ mình tôi bị hay mọi người cũng thế?',
          },
          {
            q: '(Ngày 15) Bạn nhờ đồng nghiệp gửi lại link cuộc gọi, lịch sự nhất:',
            options: ['Send me the link.', 'Would you mind sending me the link again?', 'You send link.', 'Link, please, now.'],
            correct: 1,
            why: '**Would you mind + V-ing?** là bậc lịch sự cao nhất của lời nhờ (Ngày 15).',
          },
          {
            q: '(Ngày 16) Bạn báo trước không vào được cuộc gọi chiều thứ Sáu:',
            options: ["I won't be able to join the call on Friday afternoon because I have an exam.", 'I not join Friday.', 'Friday I busy, no call.', 'I will not can join.'],
            correct: 0,
            why: "**won't be able to** + lý do bằng **because** (Ngày 16).",
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền động từ cho câu điều kiện loại 1' },
      {
        t: 'quiz',
        id: 'gtd17-bt-dien',
        title: 'Phần II — Điền đúng dạng động từ trong ngoặc (8 câu)',
        kind: 'fill',
        grammar: "If + hiện tại đơn (V / V-s), will + V ('ll) · Let me + V",
        items: [
          { q: "If the call ___ (drop), I'll rejoin straight away.", answers: ['drops'] },
          { q: "If you ___ (not / hear) me, just type in the chat. (dạng rút gọn)", answers: ["don't hear", 'don’t hear', 'do not hear'] },
          { q: "If we start late, we ___ (finish) late. (dạng rút gọn)", answers: ["'ll finish", 'will finish', '’ll finish', 'll finish'] },
          { q: "I'll send you the notes if you ___ (miss) the call.", answers: ['miss'] },
          { q: "If Joy ___ (be) on the bus, she'll stay on mute.", answers: ['is'] },
          { q: "Let me ___ (check) my calendar.", answers: ['check'] },
          { q: "If it ___ (rain) on the twelfth, we'll go to the museum instead.", answers: ['rains'] },
          { q: "Please wear headphones. ___, we'll hear an echo. (nếu không thì)", answers: ['Otherwise', 'otherwise'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd17-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "You're on mute · Let me… · If…, will… · Sorry, go ahead · Could you…?",
        items: [
          { q: 'Xin lỗi, tiếng bạn bị mất một đoạn. Bạn nói lại được không?', hint: 'cut out, could you say that again', answers: ['Sorry, you cut out. Could you say that again?', 'Sorry, you cut out there. Could you say that again?', 'Sorry, you cut out there. Could you repeat that?', 'Sorry, you cut out. Could you repeat that?', 'Sorry, you cut out there. Can you say that again?'] },
          { q: 'Để tôi tắt mic một giây.', hint: 'let me, mute myself, a second', answers: ['Let me mute myself for a second.', 'Let me mute myself for a sec.', 'Let me mute for a second.', 'Let me mute myself for one second.'] },
          { q: 'Hình như hình bạn bị đứng.', hint: "I think, frozen", answers: ["I think you've frozen.", 'I think you have frozen.', "I think your video's frozen.", 'I think your video has frozen.', 'I think you froze.'] },
          { q: 'Bạn thả đường link vào khung chat giúp được không?', hint: 'pop / put, link, chat', answers: ['Could you pop the link in the chat?', 'Could you put the link in the chat?', 'Can you pop the link in the chat?', 'Can you put the link in the chat?', 'Could you share the link in the chat?', 'Could you pop the link in the chat, please?'] },
          { q: 'Nếu tôi vào muộn, tôi sẽ nhắn cho bạn.', hint: "if, late, I'll message", answers: ["If I'm late, I'll message you.", 'If I am late, I will message you.', "If I'm late, I'll text you.", "If I'm late, I'll send you a message.", "If I'm late, I will message you."] },
          { q: 'Mình chờ thêm vài phút nhé?', hint: 'shall we, give it, a couple more minutes', answers: ['Shall we give it a couple more minutes?', 'Shall we give it a few more minutes?', 'Shall we wait a couple more minutes?', 'Shall we wait a few more minutes?'] },
          { q: 'Thôi, mình không giữ bạn nữa. Nói chuyện sau nhé!', hint: "I'll let you go, talk soon", answers: ["I'll let you go. Talk soon!", "Right, I'll let you go. Talk soon!", "Okay, I'll let you go. Talk soon!", "I'll let you go. Speak soon!", 'I will let you go. Talk soon!'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd17-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Can everyone hear me okay?', answer: 'Can everyone hear me okay?', alt: ['Can everyone hear me OK?'] },
          { label: 'Câu 2', spell: "Sorry, I talked over you. Go ahead.", answer: 'Sorry, I talked over you. Go ahead.', alt: ['Sorry I talked over you go ahead'] },
          { label: 'Câu 3', spell: "My connection's a bit unstable today.", answer: "My connection's a bit unstable today.", alt: ['My connection is a bit unstable today.'] },
          { label: 'Câu 4', spell: "If it's full, I'll put you on the waiting list.", answer: "If it's full, I'll put you on the waiting list.", alt: ['If it is full, I will put you on the waiting list.', "If it's full I'll put you on the waiting list."] },
          { label: 'Câu 5', spell: "We're out of time, so let's wrap it up there.", answer: "We're out of time, so let's wrap it up there.", alt: ['We are out of time, so let us wrap it up there.', "We're out of time so let's wrap it up there."] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd17-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Nếu bạn không thấy màn hình của tôi thì báo tôi nhé.', chips: ['If', 'you', "can't", 'see', 'my', 'screen,', 'let', 'me', 'know.', 'will', "don't"], answer: ['If', 'you', "can't", 'see', 'my', 'screen,', 'let', 'me', 'know.'] },
          { vi: 'Để tôi dừng chia sẻ.', chips: ['Let', 'me', 'stop', 'sharing.', 'to', 'share', 'us'], answer: ['Let', 'me', 'stop', 'sharing.'] },
          { vi: 'Bên tôi tiếng bị trễ một chút.', chips: ["There's", 'a', 'bit', 'of', 'a', 'delay', 'on', 'my', 'end.', 'in', 'late'], answer: ["There's", 'a', 'bit', 'of', 'a', 'delay', 'on', 'my', 'end.'] },
          { vi: '(Ngày 14) Hôm nay mạng chậm thật, nhỉ?', chips: ['The', 'Wi-Fi', 'is', 'really', 'slow', 'today,', "isn't", 'it?', 'is', 'does'], answer: ['The', 'Wi-Fi', 'is', 'really', 'slow', 'today,', "isn't", 'it?'] },
          { vi: '(Ngày 13) Bạn ở team này được bao lâu rồi?', chips: ['How', 'long', 'have', 'you', 'been', 'on', 'this', 'team?', 'are', 'did'], answer: ['How', 'long', 'have', 'you', 'been', 'on', 'this', 'team?'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Lần tới gọi video (với bạn, với nhóm học), cố dùng **ba câu**: "Can you hear me okay?", "Let me share my screen", và một câu **If…**.',
          'Viết sẵn một mẩu giấy dán cạnh màn hình: **You\'re on mute · You cut out there · Sorry, go ahead · Could you pop that in the chat?**',
          'Ngày 18: nêu ý kiến, đồng ý và không đồng ý khi trò chuyện, cuối ngày có **kiểm tra chặng 3**.',
        ],
      },
    ],
  },
];
