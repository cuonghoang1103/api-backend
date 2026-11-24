/**
 * Tiếng Anh giao tiếp — NGÀY 26 (chặng 5 "Tự nhiên như người bản xứ", B2): trò chuyện DÀI.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd26-`.
 * Ngữ pháp trong câu: từ chuyển ý — anyway, by the way, speaking of…, as I was saying (+ going back to, that reminds me).
 * Cảnh: Tâm — sinh viên IT năm 3 ở Hà Nội — trò chuyện gần 20 phút với hai người lạ trong khoang tàu đêm Hà Nội → Lào Cai,
 * một tuần trước ngày bắt đầu thực tập.
 * Không lặp Ngày 3 / 14 (mở chuyện, small talk): cuộc trò chuyện ở đây đã qua phần làm quen, bài tập trung vào giữ mạch,
 * chuyển chủ đề, quay lại ý cũ và kết thúc.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_26: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd26-nghe',
    kind: 'listening',
    title: 'Trò chuyện dài: giữ mạch, chuyển chủ đề, kết thúc khéo',
    goal: 'Theo kịp một cuộc trò chuyện gần 20 phút giữa ba người: nhận ra lúc câu chuyện lạc đề, lúc người ta kéo nó về, lúc chủ đề bị khép lại, và chuỗi tín hiệu báo cuộc nói chuyện sắp kết thúc.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay: không phải mở lời, mà là đi tiếp',
        items: [
          'Ngày 3 và Ngày 14 dạy bạn **mở** một câu chuyện. Ngày 25 dạy bạn **nghe kịp** người nói nhanh. Hôm nay là việc khó hơn cả hai: **giữ** một cuộc trò chuyện sống suốt 15–20 phút.',
          'Cảnh: tàu đêm Hà Nội → Lào Cai. **Tâm**, sinh viên IT năm 3, đi Sa Pa ba ngày trước khi bắt đầu thực tập. Cùng khoang: **Saoirse** (đọc là "Xơ-sa"), cô giáo tiếng Anh người Ireland, và **Garrett**, thầy giáo người Canada đang nghỉ phép dài hạn.',
          'Ba người đã chào hỏi xong. Bạn nghe **ba đoạn** của cuộc trò chuyện: lạc đề rồi quay lại · khoảng lặng và chuyển chủ đề · kết thúc mà không ai thấy hụt hẫng.',
          'Nghe kỹ các **từ chuyển ý**: anyway, by the way, speaking of…, as I was saying, that reminds me, come to think of it. Chúng là "biển báo giao thông" của một cuộc trò chuyện dài.',
          'Tốc độ vẫn ~175 từ/phút như Ngày 25; câu dễ không có chú thích tiếng Việt.',
        ],
      },
      {
        t: 'sodo',
        kind: 'timeline',
        title: 'Cuộc trò chuyện 18 phút trên tàu đêm',
        caption: 'Phần **làm quen** (phút 0–3) đã học ở Ngày 3, 13, 19 nên hôm nay bỏ qua. Ba đoạn bạn nghe nằm ở phút 3–8, 9–14 và 14–18.',
        marks: [
          { from: 0, to: 3, label: 'Làm quen (đã học)', kieu: 'doan', mau: 3 },
          { from: 3, to: 8, label: 'Đoạn 1: lạc đề → kéo về', kieu: 'doan', mau: 1 },
          { from: 8, label: 'Khoảng lặng', kieu: 'diem', mau: 2 },
          { from: 9, to: 14, label: 'Đoạn 2: chuyển chủ đề, khép chủ đề riêng tư', kieu: 'doan', mau: 1 },
          { from: 14, to: 18, label: 'Đoạn 3: kết thúc khéo', kieu: 'doan', mau: 1 },
        ],
      },

      { t: 'h', text: 'Đoạn 1 — Phút 3 đến 8: lạc đề rồi quay lại' },
      {
        t: 'canh',
        anh: ['railway-car', 'night-with-stars', 'woman-teacher', 'man-teacher', 'backpack'],
        caption: '10 giờ tối, khoang bốn giường nằm. **Saoirse** đang kể vì sao cô bỏ việc ở Ireland sang Hà Nội dạy tiếng Anh. Kể được nửa chừng thì một chữ "flatmate" kéo câu chuyện sang hướng khác.',
      },
      {
        t: 'listen',
        id: 'gtd26-nghe-doan1',
        title: 'Part 1 — The call centre and the six-bed room',
        note: 'Nghe xem Saoirse đang kể chuyện gì, câu chuyện bị lạc sang đâu, và ai kéo nó về bằng câu nào.',
        lines: [
          { who: 'Saoirse', voice: 'ie-nu', text: "So I was working in a call centre back in Cork. Insurance claims. Eight hours a day of people shouting at me.", vi: 'Hồi đó tôi làm tổng đài ở Cork. Hồ sơ bồi thường bảo hiểm. Tám tiếng mỗi ngày nghe người ta quát.' },
          { who: 'Garrett', voice: 'ca-nam', text: 'Oof. That sounds rough.' },
          { who: 'Saoirse', voice: 'ie-nu', text: "It was grand for a while, to be fair. And then my flatmate… oh, speaking of flatmates, Garrett, did you say you're sharing a room in Sa Pa with a total stranger?", vi: 'Công bằng mà nói thì lúc đầu cũng ổn. Rồi bạn cùng nhà tôi… à, nhân nói chuyện bạn cùng nhà, Garrett, anh bảo anh ở chung phòng với một người lạ hoàn toàn ở Sa Pa à?' },
          { who: 'Garrett', voice: 'ca-nam', text: "Ha, yeah. I booked a dorm by mistake. I saw \"six-bed\" and figured, okay, extra beds, I can put my bags on them.", vi: 'Ha, ừ. Tôi đặt nhầm phòng tập thể. Thấy chữ "six-bed", tôi nghĩ: được, dư giường, để túi lên đó.' },
          { who: 'Tâm', voice: 'us-nu', text: 'You thought the extra beds were for your luggage?' },
          { who: 'Garrett', voice: 'ca-nam', text: 'In my defence, it was two in the morning when I booked it.', vi: 'Nói để tự bào chữa nhé, lúc tôi đặt là hai giờ sáng.' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Ah, stop. That's brilliant." },
          { who: 'Tâm', voice: 'us-nu', text: 'Sorry, Saoirse, going back to your flatmate. You were saying?', vi: 'Xin lỗi, Saoirse, quay lại chuyện bạn cùng nhà của chị. Chị đang kể dở?' },
          { who: 'Saoirse', voice: 'ie-nu', text: "God, yes, where was I? Right, so, as I was saying, my flatmate taught in Hanoi for a year, and she kept sending me photos of bún chả.", vi: 'Trời, đúng rồi, tôi đang nói tới đâu nhỉ? À, như tôi đang kể, bạn cùng nhà tôi từng dạy ở Hà Nội một năm, và cứ gửi ảnh bún chả cho tôi.' },
          { who: 'Garrett', voice: 'ca-nam', text: 'And that was enough to make you quit?' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Not quite. The day I quit, a customer called me useless for twenty minutes because his claim got rejected. I hung up, opened my laptop, and applied for three jobs in Vietnam before lunch.", vi: 'Chưa hẳn. Hôm tôi nghỉ, một khách gọi tôi là đồ vô dụng suốt hai mươi phút vì hồ sơ của ông ấy bị từ chối. Tôi cúp máy, mở laptop và nộp đơn ba chỗ ở Việt Nam ngay trước giờ ăn trưa.' },
          { who: 'Tâm', voice: 'us-nu', text: 'Before lunch? Wow. And did you ever think about going somewhere else?' },
          { who: 'Saoirse', voice: 'ie-nu', text: "We nearly went to Korea, actually. But that's a whole other story.", vi: 'Thật ra suýt nữa bọn tôi đi Hàn Quốc. Nhưng đó lại là một câu chuyện khác.' },
          { who: 'Tâm', voice: 'us-nu', text: 'Okay, now I really wanna hear it. But maybe later.' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Deal. Anyway, that was eight months ago, and I haven't looked back.", vi: 'Hứa. Thôi, chuyện là vậy, đó là tám tháng trước, và tôi chưa từng hối hận.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd26-nghe-doan1-hieu',
        title: 'Đoạn 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Câu chuyện chính Saoirse đang kể là gì?',
            options: ['Chuyến đi Hàn Quốc', 'Vì sao cô bỏ việc tổng đài ở Ireland để sang Hà Nội', 'Cô bạn cùng nhà dạy tiếng Anh', 'Món bún chả'],
            correct: 1,
            why: 'Mở đầu: "I was working in a **call centre** back in Cork…" và kết: "that was **eight months ago**, and I haven\'t looked back". Bạn cùng nhà và bún chả chỉ là chi tiết trong chuyện đó.',
          },
          {
            q: 'Từ nào làm câu chuyện lạc sang hướng khác?',
            options: ['call centre', 'flatmates', 'lunch', 'Korea'],
            correct: 1,
            why: '"**Speaking of flatmates**, Garrett…" Saoirse tự nhảy từ bạn cùng nhà của mình sang chuyện Garrett ở chung phòng với người lạ.',
          },
          {
            q: 'Ai kéo câu chuyện về mạch cũ, bằng câu nào?',
            options: ['Garrett: "And that was enough to make you quit?"', 'Tâm: "Sorry, Saoirse, going back to your flatmate. You were saying?"', 'Saoirse: "Ah, stop."', 'Không ai, câu chuyện bỏ dở'],
            correct: 1,
            why: 'Tâm dùng **going back to + chủ đề** + **You were saying?**. Saoirse nhận ngay: "Where was I? Right, so, **as I was saying**…"',
          },
          {
            q: '"But that\'s a whole other story." Saoirse muốn nói gì?',
            options: ['Chuyện đó là bịa', 'Chuyện đó dài, để dịp khác kể', 'Chuyện đó không liên quan gì tới cô', 'Cô không muốn ai hỏi nữa'],
            correct: 1,
            why: '**That\'s a whole other story** = chuyện đó dài, kể riêng một buổi. Không có ý cấm hỏi. Tâm đáp đúng kiểu: "now I really wanna hear it. But maybe later."',
          },
        ],
      },

      { t: 'h', text: 'Đoạn 2 — Phút 9 đến 14: khoảng lặng, rồi chuyển chủ đề' },
      {
        t: 'canh',
        anh: ['camera-with-flash', 'snow-capped-mountain', 'foggy', 'thermometer', 'house-with-garden'],
        caption: 'Gần một phút không ai nói gì, chỉ có tiếng tàu. **Tâm** để ý chiếc máy ảnh của Garrett và dùng nó mở một chủ đề mới. Mười phút sau, một câu hỏi của Tâm chạm vào chuyện riêng của Saoirse.',
      },
      {
        t: 'listen',
        id: 'gtd26-nghe-doan2',
        title: 'Part 2 — Cameras, rice terraces and a long story',
        note: 'Nghe xem Garrett làm nghề gì, Tâm nói gì về ruộng bậc thang tháng này, và Tâm phản ứng thế nào khi Saoirse nói "Anyway!".',
        lines: [
          { who: 'Tâm', voice: 'us-nu', text: "So… by the way, Garrett, I noticed your camera. Are you a photographer?" },
          { who: 'Garrett', voice: 'ca-nam', text: "Only for fun. I teach high school science back in Winnipeg. I'm on a, what d'you call it, a sabbatical. Five months off.", vi: 'Chụp cho vui thôi. Tôi dạy khoa học cấp ba ở Winnipeg. Tôi đang… gọi là gì nhỉ, nghỉ phép dài hạn. Năm tháng.' },
          { who: 'Tâm', voice: 'us-nu', text: 'Five months! Lucky you.' },
          { who: 'Garrett', voice: 'ca-nam', text: "I saved for, like, six years. Speaking of photos, Tâm, am I too late for the rice terraces? Everyone online has these golden pictures.", vi: 'Tôi để dành cỡ sáu năm đấy. Nhân nói chuyện ảnh, Tâm này, giờ tôi đi ruộng bậc thang có muộn quá không? Trên mạng ai cũng có ảnh ruộng vàng óng.' },
          { who: 'Tâm', voice: 'us-nu', text: "Hmm, a bit, yes. The harvest is in September, maybe early October. Now the fields are mostly brown. But the mountains in the morning fog are beautiful, honestly.", vi: 'Ừm, hơi muộn thật. Mùa gặt là tháng Chín, có khi đầu tháng Mười. Giờ ruộng chủ yếu màu nâu. Nhưng núi trong sương buổi sáng thì đẹp thật đấy.' },
          { who: 'Garrett', voice: 'ca-nam', text: 'Fog works for me. Moody shots.' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Come to think of it, I've never seen the terraces either. Eight months here and I've barely left Hanoi.", vi: 'Nghĩ lại mới thấy, tôi cũng chưa thấy ruộng bậc thang bao giờ. Tám tháng ở đây mà gần như chưa ra khỏi Hà Nội.' },
          { who: 'Tâm', voice: 'us-nu', text: "Out of curiosity, Saoirse, you said \"we\" earlier. \"We nearly went to Korea.\" Who's \"we\"?", vi: 'Tò mò chút, Saoirse, lúc nãy chị nói "bọn tôi". "Bọn tôi suýt đi Hàn Quốc." "Bọn tôi" là ai vậy?' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Ah… that's my ex. It's a long story. Anyway! Tâm, what's taking you to Sa Pa? Holiday?", vi: 'À… người yêu cũ của tôi. Chuyện dài lắm. Thôi! Tâm, em lên Sa Pa làm gì? Đi chơi à?' },
          { who: 'Tâm', voice: 'us-nu', text: "Kind of. My friend's family runs a homestay in Ta Van, and I'm gonna stay with them for three days before my internship starts.", vi: 'Kiểu vậy ạ. Gia đình bạn em có homestay ở Tả Van, em sẽ ở đó ba ngày trước khi bắt đầu thực tập.' },
          { who: 'Saoirse', voice: 'ie-nu', text: 'Oh, nice. Where are you interning?' },
          { who: 'Tâm', voice: 'us-nu', text: "At a software company in Hanoi. I start on the seventh of December. Oh, that reminds me, it's gonna be cold up there. Did you both bring jackets? It can drop to about ten degrees at night.", vi: 'Ở một công ty phần mềm tại Hà Nội. Em bắt đầu ngày mùng bảy tháng Mười Hai. À, nhân tiện em nhớ ra, trên đó sẽ lạnh đấy. Hai người có mang áo khoác không? Đêm có thể xuống khoảng mười độ.' },
          { who: 'Garrett', voice: 'ca-nam', text: "Ten? I'm from Winnipeg. Ten degrees is beach weather.", vi: 'Mười độ á? Tôi người Winnipeg. Mười độ là thời tiết đi biển.' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Well, I'm from Cork, and I brought one jumper. So I'll be freezing." },
          { who: 'Tâm', voice: 'us-nu', text: "You can borrow a jacket from my friend's mum. She has, like, five." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd26-nghe-doan2-hieu',
        title: 'Đoạn 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Tâm phá khoảng lặng bằng cách nào?',
            options: ['Hỏi giờ tàu tới', 'Dùng "By the way" để hỏi về chiếc máy ảnh của Garrett', 'Kể chuyện thực tập của mình', 'Hỏi lại chuyện Hàn Quốc'],
            correct: 1,
            why: '"So… **by the way**, Garrett, I noticed your camera." Lấy một thứ **nhìn thấy trước mặt** làm chủ đề mới là cách phá khoảng lặng an toàn nhất.',
          },
          {
            q: 'Garrett làm nghề gì, và vì sao đi chơi được lâu?',
            options: ['Nhiếp ảnh gia, đi chụp thuê', 'Giáo viên khoa học, đang nghỉ phép dài hạn năm tháng', 'Kỹ sư, làm việc từ xa', 'Đã nghỉ hưu'],
            correct: 1,
            why: '"I teach high school science… I\'m on a **sabbatical**. Five months off." Sabbatical = kỳ nghỉ dài hạn (thường có lương hoặc giữ chỗ làm), hay gặp ở giáo viên, giảng viên.',
          },
          {
            q: 'Saoirse đáp "It\'s a long story. Anyway!" Tâm làm gì, và vì sao đó là cách đúng?',
            options: [
              'Hỏi tiếp về người yêu cũ, vì Saoirse vừa nói chuyện dài',
              'Trả lời câu Saoirse hỏi và không quay lại chuyện riêng đó, vì "Anyway!" ở đây là khép chủ đề',
              'Xin lỗi rất nhiều lần',
              'Im lặng',
            ],
            correct: 1,
            why: '**It\'s a long story** + **Anyway!** (giọng dứt khoát, đổi ngay sang câu hỏi khác) = "tôi không muốn nói chuyện này". Tâm hiểu tín hiệu, trả lời câu hỏi về Sa Pa và không hỏi lại.',
          },
          {
            q: 'Tâm dùng "That reminds me" để làm gì?',
            options: ['Nhắc Saoirse chuyện Hàn Quốc', 'Chuyển từ chuyện thực tập sang cảnh báo trời lạnh trên Sa Pa', 'Kết thúc cuộc trò chuyện', 'Hỏi lại tên Garrett'],
            correct: 1,
            why: '**That reminds me** = "nhân đó tôi nhớ ra": một cây cầu để rẽ sang chủ đề khác mà không đột ngột. Đêm tháng Mười Một ở Sa Pa xuống khoảng 10 °C là thông tin thật.',
          },
        ],
      },

      { t: 'h', text: 'Đoạn 3 — Phút 14 đến 18: kết thúc mà không ai thấy bị cắt ngang' },
      {
        t: 'canh',
        anh: ['yawning-face', 'mobile-phone', 'crescent-moon', 'bed', 'waving-hand'],
        caption: 'Garrett bắt đầu một câu chuyện mới về mùa đông Winnipeg, đúng lúc Saoirse ngáp. Tâm cũng mệt, tàu tới Lào Cai khoảng 6 giờ sáng. Nghe cách ba người **khép** cuộc trò chuyện qua từng bước.',
      },
      {
        t: 'listen',
        id: 'gtd26-nghe-doan3',
        title: 'Part 3 — The frozen car can wait',
        note: 'Nghe xem Tâm dừng câu chuyện của Garrett bằng câu gì, ba người trao đổi gì trước khi ngủ, và họ hẹn gì cho hôm sau.',
        lines: [
          { who: 'Garrett', voice: 'ca-nam', text: "Oh, and here's the thing about Winnipeg winters. One year my car door froze shut, and I had to…", vi: 'À, còn chuyện mùa đông ở Winnipeg thế này. Có năm cửa xe tôi đóng băng dính chặt, và tôi phải…' },
          { who: 'Saoirse', voice: 'ie-nu', text: "Sorry! Sorry, Garrett. That yawn's not you, that's the train.", vi: 'Xin lỗi! Xin lỗi anh Garrett. Cái ngáp đó không phải tại anh đâu, tại tàu đấy.' },
          { who: 'Tâm', voice: 'us-nu', text: "Garrett, hold that thought. I really wanna hear the frozen car story, but maybe at breakfast? The train gets in at around six.", vi: 'Garrett ơi, giữ chuyện đó lại nhé. Em rất muốn nghe vụ cái xe đóng băng, nhưng để bữa sáng được không? Tàu tới tầm sáu giờ.' },
          { who: 'Garrett', voice: 'ca-nam', text: "Ha, deal. I've been talking your ear off, haven't I?", vi: 'Ha, được. Nãy giờ tôi nói nhiều quá phải không?' },
          { who: 'Tâm', voice: 'us-nu', text: "No, not at all! It's been really nice chatting, honestly. I didn't think I'd talk this much on a night train." },
          { who: 'Saoirse', voice: 'ie-nu', text: 'Same. I usually just put my headphones in and pretend to be asleep.' },
          { who: 'Garrett', voice: 'ca-nam', text: "Before I forget, are you two on Instagram? I'll send you the foggy shots.", vi: 'Trước khi quên, hai người có Instagram không? Tôi gửi ảnh sương mù cho.' },
          { who: 'Tâm', voice: 'us-nu', text: "Yeah, let's swap. I'm tam dot travels. T-A-M." },
          { who: 'Saoirse', voice: 'ie-nu', text: "And if you're in Ta Van on Sunday, Tâm, could we come and say hi? I'd love to see a real homestay.", vi: 'Mà Tâm này, nếu Chủ nhật em ở Tả Van, bọn chị ghé chào được không? Chị muốn xem một homestay thật.' },
          { who: 'Tâm', voice: 'us-nu', text: "Of course! I'll message you the address. My friend's mum makes amazing corn wine, by the way.", vi: 'Tất nhiên rồi! Em nhắn địa chỉ cho. À, mẹ bạn em nấu rượu ngô ngon lắm.' },
          { who: 'Garrett', voice: 'ca-nam', text: "Now that's a reason to hike ten kilometres." },
          { who: 'Tâm', voice: 'us-nu', text: "Okay, I'm gonna try and get some sleep. Night, both of you." },
          { who: 'Saoirse', voice: 'ie-nu', text: "Night, Tâm. Night, Garrett. Don't freeze." },
          { who: 'Garrett', voice: 'ca-nam', text: "Night. And Tâm, the car story. Breakfast. I'm holding you to it.", vi: 'Ngủ ngon. Còn Tâm, chuyện cái xe. Bữa sáng. Em đã hứa rồi đấy.' },
          { who: 'Tâm', voice: 'us-nu', text: 'Deal. Breakfast.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd26-nghe-doan3-hieu',
        title: 'Đoạn 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Tâm dừng câu chuyện của Garrett bằng cách nào?',
            options: ['Nói thẳng "Stop, I\'m tired."', '"Hold that thought" + hẹn nghe tiếp ở bữa sáng', 'Giả vờ ngủ', 'Đổi sang chuyện khác'],
            correct: 1,
            why: '**Hold that thought** = "giữ ý đó lại đã". Kèm một **lời hẹn cụ thể** (at breakfast) nên Garrett không thấy bị cắt ngang, còn vui vẻ "I\'m holding you to it."',
          },
          {
            q: 'Saoirse nói "That yawn\'s not you, that\'s the train." Ý cô là gì?',
            options: ['Tàu kêu to quá', 'Cô ngáp vì mệt do tàu, không phải vì chuyện của Garrett chán', 'Cô muốn đổi khoang', 'Cô không nghe Garrett nói'],
            correct: 1,
            why: 'Ngáp giữa lúc người khác kể chuyện dễ bị hiểu là chán. Saoirse xin lỗi ngay và **nói rõ lý do**. Một câu đùa nhỏ giữ được không khí.',
          },
          {
            q: 'Ba người trao đổi liên lạc qua đâu?',
            options: ['Số điện thoại', 'Email', 'Instagram', 'Zalo'],
            correct: 2,
            why: 'Garrett: "**Before I forget**, are you two on **Instagram**?" Tâm: "Yeah, let\'s swap." Before I forget là tín hiệu quen thuộc khi cuộc trò chuyện sắp hết.',
          },
          {
            q: 'Thứ tự đúng của các bước kết thúc trong đoạn này là:',
            options: [
              'Chúc ngủ ngon → trao Instagram → khen cuộc trò chuyện',
              'Gác câu chuyện đang dở (hẹn lại) → khen cuộc trò chuyện → trao liên lạc, hẹn gặp → báo đi ngủ, chúc ngủ ngon',
              'Trao liên lạc → im lặng → đi ngủ',
              'Khen cuộc trò chuyện → đi ngủ ngay',
            ],
            correct: 1,
            why: 'Một cuộc trò chuyện dài không dừng bằng một câu. Nó đi qua **3–4 bước**: gác lại · đánh giá đẹp ("It\'s been really nice chatting") · nối tương lai (Instagram, Chủ nhật, bữa sáng) · chào.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 8 câu chuyển ý' },
      {
        t: 'p',
        text: 'Mỗi câu là một **"biển báo"** của cuộc trò chuyện. Nghe và gõ lại đúng cả câu. Chú ý các từ nhỏ dễ mất khi nói nhanh: **of, to, was, that**.',
      },
      {
        t: 'dictation',
        id: 'gtd26-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — rẽ sang chủ đề gần', spell: "Speaking of flatmates, did you say you're sharing a room?", answer: "Speaking of flatmates, did you say you're sharing a room?", alt: ['Speaking of flatmates, did you say you are sharing a room?'] },
          { label: 'Câu 2 — kéo câu chuyện về', spell: 'Sorry, going back to your flatmate. You were saying?', answer: 'Sorry, going back to your flatmate. You were saying?', alt: ['Sorry, going back to your flatmate, you were saying?'] },
          { label: 'Câu 3 — người kể nhận lại mạch', spell: 'Where was I? Right, so, as I was saying…', answer: 'Where was I? Right, so, as I was saying', alt: ['Where was I? Right so as I was saying', 'Where was I? Right, so as I was saying…'] },
          { label: 'Câu 4 — gác một chuyện lại', spell: "But that's a whole other story.", answer: "But that's a whole other story.", alt: ['But that is a whole other story.'] },
          { label: 'Câu 5 — hỏi khéo', spell: "Out of curiosity, who's we?", answer: "Out of curiosity, who's we?", alt: ['Out of curiosity, who is we?', 'Out of curiosity who\'s "we"?'] },
          { label: 'Câu 6 — rẽ bằng một cây cầu', spell: "That reminds me, it's gonna be cold up there.", answer: "That reminds me, it's going to be cold up there.", alt: ["That reminds me, it's gonna be cold up there.", 'That reminds me, it is going to be cold up there.'] },
          { label: 'Câu 7 — dừng chuyện người khác lịch sự', spell: 'Hold that thought. Tell us at breakfast.', answer: 'Hold that thought. Tell us at breakfast.' },
          { label: 'Câu 8 — bắt đầu kết thúc', spell: "It's been really nice chatting, honestly.", answer: "It's been really nice chatting, honestly.", alt: ['It has been really nice chatting, honestly.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp / làm'],
        rows: [
          ['Anyway, as I was saying…', 'Quay về mạch chính sau khi lạc đề.', 'Im lặng nghe tiếp.'],
          ["Anyway, that's my story.", '**Khép** một chủ đề: tôi kể xong rồi.', 'Bình luận ngắn, rồi hỏi hoặc kể chuyện của bạn.'],
          ["It's a long story. Anyway!", '**Tôi không muốn nói chuyện này.** Giọng dứt khoát, đổi ngay sang câu khác.', 'Đừng hỏi lại. Theo chủ đề mới.'],
          ["That's a whole other story.", 'Chuyện dài, để dịp khác (không cấm hỏi).', 'Ooh, next time, then!'],
          ['Speaking of…', 'Nhân nói chuyện… (rẽ sang chủ đề liên quan).', 'Theo nhánh mới; nhớ nhánh cũ để kéo về nếu cần.'],
          ['Where was I?', 'Tôi đang nói tới đâu nhỉ? (bị lạc mạch)', 'You were telling us about…'],
          ['Hold that thought.', 'Giữ ý đó lại, lát nói tiếp.', 'Sure! / Deal.'],
          ["I've been talking your ear off.", 'Tôi nói nhiều quá rồi. (thường để xin lỗi nhẹ)', 'Not at all! It\'s been great.'],
          ['Before I forget,…', 'Trước khi quên… (thường là **dấu hiệu sắp kết thúc**)', 'Trả lời, rồi chuẩn bị chào.'],
          ["I'm holding you to it.", 'Bạn đã hứa rồi đấy, tôi nhớ đấy. (vui vẻ)', 'Deal!'],
        ],
        caption: 'Chú ý **Anyway**: cùng một từ, ba việc khác nhau. Phân biệt bằng **giọng** và **câu ngay sau nó**: kéo về chuyện cũ · khép chuyện vừa kể · đóng cửa một chủ đề.',
      },
      {
        t: 'note',
        title: 'Mẹo: lạc mạch giữa một cuộc trò chuyện dài thì làm gì',
        items: [
          '**Hỏi lại "nhân vật"**, không hỏi lại cả câu chuyện. Chuyện dài hay lồng nhiều người: "Sorry, who\'s **she** here, your flatmate or the customer?" Một câu là bạn bắt lại được mạch.',
          '**Tóm lại bằng một câu**: "So you quit **because of** that customer?" Đúng thì người kể gật, sai thì họ sửa. Cả hai cách bạn đều theo kịp.',
          '**Nhớ ba chữ khoá** của chủ đề chính (call centre, Cork, quit). Câu chuyện lạc đi đâu thì ba chữ đó vẫn kéo bạn về được, như Tâm làm.',
          'Nghe tiếng Anh 15 phút liền rất **mệt não**. Mệt thì nói thật, kèm cười: "Sorry, my English gets worse after ten p.m.!" Người ta sẽ nói chậm lại, không ai giận.',
          'Cần nghỉ một chút mà không bỏ cuộc trò chuyện: "**I\'m just gonna grab some water. Anyone want anything?**" Ba mươi giây đi lại là đủ để đầu óc tỉnh ra.',
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Mỹ · Canada', 'Anh', 'Úc', 'Ireland'],
        rows: [
          ['Quay về ý chính', 'Anyway(s)… · So, yeah…', 'Anyway… · Right, so…', 'Anyway… · So yeah, anyway…', 'Anyway… · Sure look, anyway…'],
          ['Báo sắp kết thúc', "Well, I should probably get going.", "Right, I'd better be off.", "Righto, I'll let you get on.", "Right so, I'll head off."],
          ['Chào khi chia tay', 'Take care! · Have a good one!', 'Take care. · Cheers, then!', 'See ya. · Catch ya.', 'Mind yourself! · Good luck, so.'],
          ['Độ dài phần chào', 'Vùng Trung Tây Mỹ nổi tiếng chào tạm biệt rất lâu, đi tới cửa vẫn còn nói chuyện.', 'Ngắn gọn hơn.', 'Ngắn, thoải mái.', 'Có thể rất dài, đùa nhau mãi mới chào xong.'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc – Ireland khi chuyển ý và kết thúc. "Anyways" (có s) là dạng nói rất thân của Mỹ; khi viết, chỉ dùng **anyway**. "Sure look" (Ireland) = thôi thì, kệ đi, chỉ cần hiểu.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-cs-b1-02 · The Woman With the Flask of Tea** — một người lạ trên sân ga và một câu nói theo người nghe suốt chín năm. Cảnh khác bài hôm nay, nhưng cũng là chuyện trò với người lạ trên hành trình.',
          '**en-b1-03 · A Friend I Have Never Met** — người bạn quen qua mạng sắp gặp nhau ngoài đời. Nghe trước bài Viết hôm nay: bài viết là email dài kể chuyện cho một người bạn nước ngoài.',
          'Khi nghe, đánh dấu chỗ người nói **chuyển chủ đề** và từ họ dùng để chuyển. Đó là bài tập hay nhất cho hôm nay.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd26-noi',
    kind: 'speaking',
    title: 'Nói 3 phút không đứt: chuyển ý, quay lại ý',
    goal: 'Nói liền 3 phút về một chủ đề quen thuộc mà không đứt mạch: rẽ sang nhánh phụ rồi quay lại, chuyển chủ đề có cầu nối, khép chủ đề, nhận tín hiệu muốn đổi chủ đề của người khác và kết thúc một cuộc trò chuyện dài qua nhiều bước.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**27 cụm** để điều khiển một cuộc trò chuyện dài: rẽ (by the way, speaking of), quay lại (anyway, as I was saying, going back to), cầu nối (that reminds me, come to think of it), gác lại (hold that thought), kết thúc (before I forget, it\'s been really nice chatting).',
          'Ngữ pháp hôm nay: **từ chuyển ý đứng ở đâu, đi với gì**: Speaking of + danh từ, As I was saying + câu, Anyway + câu.',
          '**Khung nói 3 phút** có nhánh phụ và đường quay về, kèm một bài mẫu để bạn thay chuyện của chính mình vào.',
          '**Ngôn ngữ cơ thể** báo hiệu "tôi muốn nói tiếp" và "tôi muốn kết thúc", và vì sao người Việt hay kết thúc quá đột ngột.',
          'Phát âm: ngữ điệu của từ chuyển ý. "Anyway" lên hay xuống giọng làm nghĩa thay đổi.',
        ],
      },

      { t: 'h', text: '1. 27 cụm điều khiển cuộc trò chuyện' },
      {
        t: 'p',
        text: 'Xếp theo việc: **rẽ sang chủ đề mới** (1–6) · **quay lại** (7–11) · **gác, khép, né** (12–19) · **giữ lượt khi đang nói dài** (20–22) · **kết thúc** (23–27).',
      },
      {
        t: 'vocab',
        items: [
          { w: 'By the way,…', pos: 'phr', ipa: '/baɪ ðə ˈweɪ/', vi: 'Nhân tiện,… (mở một chủ đề MỚI, thường là phụ)', ex: 'By the way, I noticed your camera. Are you a photographer?', exVi: 'Nhân tiện, mình thấy máy ảnh của bạn. Bạn là nhiếp ảnh gia à?', more: 'Ngày 14 đã gặp. Hôm nay nhớ thêm: by the way **không** dùng để quay về chủ đề cũ.', anh: 'camera-with-flash' },
          { w: 'Speaking of…,…', pos: 'phr', ipa: '/ˈspiːkɪŋ əv/', vi: 'Nhân nói chuyện…, … (rẽ sang chủ đề LIÊN QUAN)', ex: 'Speaking of photos, am I too late for the rice terraces?', exVi: 'Nhân nói chuyện ảnh, giờ đi ruộng bậc thang có muộn không?', more: 'Bắt buộc có danh từ: Speaking **of food**, … · Speaking **of which**, … (nhân chuyện đó)' },
          { w: 'That reminds me,…', pos: 'phr', ipa: '/ðæt rɪˈmaɪndz mi/', vi: 'À, nhân đó mình nhớ ra,…', ex: "That reminds me, it's gonna be cold up there.", exVi: 'À, nhớ ra là trên đó sẽ lạnh đấy.' },
          { w: 'Come to think of it,…', pos: 'phr', ipa: '/ˌkʌm tə ˈθɪŋk əv ɪt/', vi: 'Nghĩ lại mới thấy,…', ex: "Come to think of it, I've never seen the terraces either.", exVi: 'Nghĩ lại mới thấy, mình cũng chưa thấy ruộng bậc thang bao giờ.' },
          { w: 'Funny you should mention that.', pos: 'phr', ipa: '/ˈfʌni ju ʃəd ˈmenʃən ðæt/', vi: 'Lạ thật, bạn nhắc đúng chuyện đó. (mình có chuyện liên quan)', ex: "Funny you should mention Da Lat. I'm going there next month.", exVi: 'Lạ ghê, bạn nhắc đúng Đà Lạt. Tháng sau mình đi đó.' },
          { w: 'Out of curiosity,…', pos: 'phr', ipa: '/ˌaʊt əv ˌkjʊriˈɑːsəti/', vi: 'Tò mò chút,… (làm mềm câu hỏi hơi riêng)', ex: 'Out of curiosity, why Vietnam and not Thailand?', exVi: 'Tò mò chút, sao lại là Việt Nam mà không phải Thái Lan?' },
          { w: 'Anyway, as I was saying,…', pos: 'phr', ipa: '/ˈeniweɪ əz aɪ wəz ˈseɪɪŋ/', vi: 'Thôi, như mình đang kể,… (quay về mạch chính)', ex: 'Anyway, as I was saying, she kept sending me photos of bún chả.', exVi: 'Thôi, như mình đang kể, bạn ấy cứ gửi ảnh bún chả cho mình.' },
          { w: 'Where was I?', pos: 'phr', ipa: '/ˈwer wəz aɪ/', vi: 'Mình đang nói tới đâu nhỉ?', ex: 'Sorry, where was I? Oh yes, the call centre.', exVi: 'Xin lỗi, mình đang nói tới đâu nhỉ? À đúng, cái tổng đài.' },
          { w: 'You were saying?', pos: 'phr', ipa: '/ju wər ˈseɪɪŋ/', vi: 'Bạn đang nói dở? (mời người kia nói tiếp)', ex: 'Sorry, I cut you off. You were saying?', exVi: 'Xin lỗi, mình cắt ngang. Bạn đang nói dở?' },
          { w: 'Going back to what you said about…', pos: 'phr', ipa: '/ˈɡoʊɪŋ ˈbæk tə wʌt ju ˈsed əˌbaʊt/', vi: 'Quay lại chuyện bạn nói về…', ex: 'Going back to what you said about Korea, what happened?', exVi: 'Quay lại chuyện bạn nói về Hàn Quốc, rồi sao nữa?', more: 'Rất hay để chứng tỏ bạn **đã nghe kỹ**. Người nói thấy được tôn trọng.' },
          { w: 'Sorry, I lost my train of thought.', pos: 'phr', ipa: '/aɪ ˈlɔːst maɪ ˌtreɪn əv ˈθɔːt/', vi: 'Xin lỗi, mình quên mất đang định nói gì.', ex: 'Sorry, I lost my train of thought. What were we talking about?', exVi: 'Xin lỗi, mình quên mất đang nói gì. Nãy mình nói chuyện gì nhỉ?', anh: 'railway-car' },
          { w: "Sorry, I'm going off on a tangent.", pos: 'phr', ipa: '/ˈɡoʊɪŋ ˈɔːf ɑːn ə ˈtændʒənt/', vi: 'Xin lỗi, mình nói lạc đề rồi.', ex: "Sorry, I'm going off on a tangent. Anyway…", exVi: 'Xin lỗi, mình lạc đề rồi. Thôi…' },
          { w: 'Hold that thought.', pos: 'phr', ipa: '/ˈhoʊld ðæt ˈθɔːt/', vi: 'Giữ ý đó lại, lát nói tiếp.', ex: 'Hold that thought. Let me grab us some tea first.', exVi: 'Giữ chuyện đó lại nhé. Để mình đi lấy trà đã.', anh: 'raised-hand' },
          { w: "That's a whole other story.", pos: 'phr', ipa: '/ðæts ə ˈhoʊl ˈʌðər ˈstɔːri/', vi: 'Đó lại là một chuyện khác (dài, để dịp khác).', ex: "We nearly went to Korea, but that's a whole other story.", exVi: 'Suýt nữa bọn mình đi Hàn Quốc, nhưng đó lại là chuyện khác.' },
          { w: "It's a long story.", pos: 'phr', ipa: '/ɪts ə ˈlɔːŋ ˈstɔːri/', vi: 'Chuyện dài lắm. (thường = không muốn kể)', ex: "Why did you move? — Ah, it's a long story.", exVi: 'Sao bạn chuyển đi? — À, chuyện dài lắm.' },
          { w: "Anyway, that's my story.", pos: 'phr', ipa: '/ˈeniweɪ ðæts maɪ ˈstɔːri/', vi: 'Thôi, chuyện của mình là vậy. (khép, trả lượt)', ex: "Anyway, that's my story. What about you?", exVi: 'Thôi, chuyện mình là vậy. Còn bạn?' },
          { w: 'Anyway, enough about me.', pos: 'phr', ipa: '/ˈeniweɪ ɪˈnʌf əˌbaʊt mi/', vi: 'Thôi, nói về mình đủ rồi.', ex: "Anyway, enough about me. How's your trip been so far?", exVi: 'Thôi, nói về mình đủ rồi. Chuyến đi của bạn tới giờ thế nào?' },
          { w: "Don't get me started on…", pos: 'phr', ipa: '/ˌdoʊnt ɡet mi ˈstɑːrtɪd ɑːn/', vi: 'Đừng để mình nói về… (nói ra là không dừng được)', ex: "Don't get me started on the traffic in Hanoi.", exVi: 'Đừng bắt mình nói chuyện kẹt xe ở Hà Nội.', more: 'Câu đùa: người nói **có rất nhiều ý kiến** (thường là bực mình) về chuyện đó.' },
          { w: 'Mind if I ask…?', pos: 'phr', ipa: '/ˈmaɪnd ɪf aɪ ˈæsk/', vi: 'Mình hỏi… được không?', ex: 'Mind if I ask how long you saved for this trip?', exVi: 'Mình hỏi bạn để dành bao lâu cho chuyến này được không?' },
          { w: 'Sorry, can I just finish this bit?', pos: 'phr', ipa: '/kən aɪ dʒəst ˈfɪnɪʃ ðɪs ˈbɪt/', vi: 'Xin lỗi, cho mình nói nốt đoạn này nhé?', ex: 'Sorry, can I just finish this bit? It gets better.', exVi: 'Xin lỗi, cho mình kể nốt đoạn này nhé? Đoạn sau hay hơn.', more: 'Ngày 29 học kỹ cách giữ lượt. Hôm nay chỉ cần một câu này.' },
          { w: "What's the word…?", pos: 'phr', ipa: '/ˌwʌts ðə ˈwɝːd/', vi: 'Từ đó là gì nhỉ…? (đang tìm từ)', ex: "It's like a… what's the word… a sabbatical.", exVi: 'Kiểu như… gọi là gì nhỉ… một kỳ nghỉ dài hạn.' },
          { w: "It's a kind of…", pos: 'phr', ipa: '/ɪts ə ˈkaɪnd əv/', vi: 'Nó là một loại… (giải thích khi không nhớ từ)', ex: "It's a kind of rice wine, but made from corn.", exVi: 'Nó là một loại rượu, nhưng nấu từ ngô.' },
          { w: 'So yeah.', pos: 'phr', ipa: '/soʊ ˈjeə/', vi: 'Vậy đó. (kết ý, báo đã nói xong)', ex: "So yeah, I'm a bit nervous about the internship.", exVi: 'Vậy đó, mình hơi lo về đợt thực tập.' },
          { w: 'Before I forget,…', pos: 'phr', ipa: '/bɪˈfɔːr aɪ fərˈɡet/', vi: 'Trước khi quên,… (thường gần lúc kết thúc)', ex: 'Before I forget, are you on Instagram?', exVi: 'Trước khi quên, bạn có Instagram không?' },
          { w: "It's been really nice chatting.", pos: 'phr', ipa: '/ɪts bɪn ˈrɪli ˈnaɪs ˈtʃætɪŋ/', vi: 'Nói chuyện với bạn vui thật đấy. (mở màn chào)', ex: "It's been really nice chatting. I didn't expect that on a night train.", exVi: 'Nói chuyện vui thật. Mình không ngờ được thế trên tàu đêm.' },
          { w: "I've been talking your ear off.", pos: 'phr', ipa: '/aɪv bɪn ˈtɔːkɪŋ jər ˈɪr ɔːf/', vi: 'Mình nói nhiều quá rồi.', ex: "Sorry, I've been talking your ear off, haven't I?", exVi: 'Xin lỗi, nãy giờ mình nói nhiều quá phải không?', anh: 'ear' },
          { w: "Let's pick this up tomorrow.", pos: 'phr', ipa: '/ˌlets ˈpɪk ðɪs ˈʌp təˈmɑːroʊ/', vi: 'Mai mình nói tiếp nhé.', ex: "I'm fading. Let's pick this up at breakfast.", exVi: 'Mình buồn ngủ rồi. Bữa sáng nói tiếp nhé.' },
        ],
      },

      { t: 'h', text: '2. Cùng một việc, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Việc', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp, người lạ)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Rẽ sang chuyện mới', 'Oh, random, but…', 'By the way, …', 'On a different note, …'],
          ['Rẽ sang chuyện liên quan', 'Oh, speaking of which!', 'Speaking of photos, …', 'On the subject of photography, …'],
          ['Quay về', 'Anyway!', 'Anyway, as I was saying, …', 'If I could just return to the earlier point, …'],
          ['Mời người kia nói tiếp', 'Go on, go on!', 'Sorry, you were saying?', 'Please, do continue.'],
          ['Né chủ đề', "Ugh, long story. Anyway!", "It's a long story. Anyway, …", "I'd rather not go into that, if you don't mind."],
          ['Báo sắp kết thúc', "Okay, I'm fading.", 'Well, I should probably get some sleep.', "I'm afraid I'll have to leave it there."],
          ['Lời cuối', 'Night! Text me!', "It's been really nice chatting.", 'It has been a pleasure talking with you.'],
        ],
        caption: 'Với người lạ trên tàu, trong quán, ở sự kiện: cột **giữa** là chuẩn. Cột phải dùng khi nói chuyện dài với khách hàng, đối tác, ví dụ bữa tối sau buổi làm việc.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Từ chuyển ý luôn đứng **đầu câu**, theo sau là **dấu phẩy** (khi viết) hoặc một **nhịp ngắt nhẹ** (khi nói). Khác nhau ở chỗ phía sau nó cần gì: một **danh từ** hay cả một **câu**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'By the way, + câu (thường là câu hỏi)',
            vi: 'Mở một chủ đề mới, phụ.',
            examples: [
              { en: 'By the way, are you on Instagram?', vi: 'Nhân tiện, bạn có Instagram không?' },
              { en: 'By the way, the train gets in at six.', vi: 'Nhân tiện, tàu tới lúc sáu giờ.' },
              { en: 'My friend\'s mum makes corn wine, by the way.', vi: 'À, mẹ bạn mình nấu rượu ngô đấy. (by the way đứng cuối câu = nói thêm)' },
            ],
          },
          {
            formula: 'Speaking of + N / V-ing, + S + V',
            vi: 'Rẽ sang chủ đề liên quan. Sau "of" bắt buộc có danh từ.',
            examples: [
              { en: 'Speaking of photos, have you been to Ha Giang?', vi: 'Nhân nói chuyện ảnh, bạn đi Hà Giang chưa?' },
              { en: 'Speaking of cold weather, did you bring a jacket?', vi: 'Nhân nói chuyện trời lạnh, bạn có mang áo khoác không?' },
              { en: "Speaking of travelling alone, I've never done it.", vi: 'Nhân nói chuyện đi một mình, mình chưa từng thử.' },
            ],
          },
          {
            formula: 'As I was saying, + S + V · Going back to + N, + S + V',
            vi: 'Quay về mạch cũ. "As I was saying" cho chuyện của mình; "Going back to…" cho chuyện của người kia.',
            examples: [
              { en: 'As I was saying, my flatmate taught here for a year.', vi: 'Như mình đang kể, bạn cùng nhà mình từng dạy ở đây một năm.' },
              { en: 'Going back to your sabbatical, how long is it?', vi: 'Quay lại kỳ nghỉ dài hạn của anh, nó kéo dài bao lâu?' },
              { en: 'Going back to what you said, why Korea?', vi: 'Quay lại chuyện bạn nói, sao lại là Hàn Quốc?' },
            ],
          },
          {
            formula: 'Anyway, + S + V',
            vi: 'Quay về, khép lại hoặc đóng chủ đề. Câu ngay sau quyết định nghĩa.',
            examples: [
              { en: "Anyway, that was eight months ago.", vi: 'Thôi, đó là tám tháng trước rồi. (khép chuyện)' },
              { en: 'Anyway, what about you?', vi: 'Thôi, còn bạn thì sao? (trả lượt)' },
              { en: 'Anyway, back to the waterfall.', vi: 'Thôi, quay lại cái thác. (quay về)' },
            ],
          },
          {
            formula: 'That reminds me, / Come to think of it, + S + V',
            vi: 'Cầu nối: chủ đề mới "nảy ra" từ câu vừa nói, nên không đột ngột.',
            examples: [
              { en: "That reminds me, I owe you a coffee.", vi: 'À nhớ ra, mình còn nợ bạn một ly cà phê.' },
              { en: "Come to think of it, I haven't called my mum this week.", vi: 'Nghĩ lại mới thấy, tuần này mình chưa gọi cho mẹ.' },
              { en: 'That reminds me, what time is breakfast?', vi: 'À nhớ ra, mấy giờ ăn sáng nhỉ?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Từ chuyển ý + , + câu đầy đủ · Speaking of / Going back to + N + , + câu',
        vi: 'By the way = mở chuyện mới · Speaking of = rẽ sang chuyện liên quan · As I was saying / Going back to = quay về · Anyway = quay về hoặc khép lại.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: ghép chuỗi khi nói dài',
        items: [
          'Ba phút nói không phải là một câu dài ba phút. Nó là **nhiều câu ngắn** nối bằng: **and then**, **so**, **but**, **which**, **and the thing is**.',
          '**which** nối thêm bình luận về cả câu trước: "I booked a six-bed dorm, **which** was a mistake." Đây là cách người bản xứ kể chuyện mà không phải dừng.',
          '**and the thing is, …** báo "ý quan trọng sắp tới": "It\'s cheap, **and the thing is**, nobody knows about it."',
          'Kết một ý bằng **So yeah.** rồi mới chuyển. Người nghe biết bạn đã xong, có thể chen vào.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd26-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'By the way / Speaking of + N / As I was saying / Going back to + N / That reminds me',
        items: [
          { q: 'Nhân tiện, mấy giờ tàu tới?', hint: 'by the way, get in', answers: ['By the way, what time does the train get in?', 'By the way, what time does the train arrive?', 'By the way, when does the train get in?', 'By the way, when does the train arrive?'] },
          { q: 'Nhân nói chuyện đồ ăn, bạn thử bún chả chưa?', hint: 'speaking of, have you tried', answers: ['Speaking of food, have you tried bún chả?', 'Speaking of food, have you tried bun cha?', 'Speaking of food, have you ever tried bún chả?', 'Speaking of food, have you ever tried bun cha?'] },
          { q: 'Như mình đang kể, mình bỏ việc ngay hôm đó.', hint: 'as I was saying, quit', answers: ['As I was saying, I quit that same day.', 'As I was saying, I quit that day.', 'As I was saying, I quit on that day.', 'As I was saying, I quit the same day.', 'Anyway, as I was saying, I quit that day.'] },
          { q: 'Quay lại chuyện bạn nói về Hàn Quốc, rồi chuyện gì xảy ra?', hint: 'going back to what you said about', answers: ['Going back to what you said about Korea, what happened?', 'Going back to what you said about Korea, what happened next?', 'Going back to Korea, what happened?', 'Going back to what you said about Korea, so what happened?'] },
          { q: 'À nhớ ra, mình còn nợ bạn một ly cà phê.', hint: 'that reminds me, owe', answers: ['That reminds me, I owe you a coffee.', 'That reminds me, I still owe you a coffee.', 'Oh, that reminds me, I owe you a coffee.', 'Oh, that reminds me, I still owe you a coffee.'] },
        ],
      },

      { t: 'h', text: '4. Khung nói 3 phút: có nhánh phụ và đường về' },
      {
        t: 'sodo',
        kind: 'flow',
        title: '3 phút, 7 bước',
        caption: 'Bí quyết không đứt: chuẩn bị **3 "móc"** cho chủ đề (một sự thật, một câu chuyện, một ý kiến). Hết móc này thì sang móc kia; lạc đề thì dùng từ chuyển ý để về.',
        steps: [
          { label: 'Mở chủ đề', sub: "So, Hanoi. I've lived here for three years." },
          { label: 'Móc 1: sự thật', sub: 'What I love most is the food.' },
          { label: 'Nhánh phụ', sub: 'Speaking of food, there\'s this one stall…' },
          { label: 'Quay về', sub: 'Anyway, as I was saying…' },
          { label: 'Móc 2: chuyện có thật', sub: 'The first week I got here…' },
          { label: 'Móc 3: ý kiến', sub: "Honestly, I think it's the best city for students." },
          { label: 'Chốt + trả lượt', sub: "So yeah, that's Hanoi for me. What about you?" },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "So, Hanoi. I've lived here for three years now, since I started uni, and I still can't decide if I love it or hate it.", vi: 'Hà Nội nhé. Mình sống ở đây ba năm rồi, từ hồi vào đại học, mà vẫn chưa biết mình yêu hay ghét nó.' },
          { en: "What I love most is the food. You can eat really well for, like, thirty thousand dong, which still surprises me.", vi: 'Thứ mình thích nhất là đồ ăn. Ăn ngon mà chỉ khoảng ba mươi nghìn, đến giờ mình vẫn thấy lạ.' },
          { en: "Speaking of food, there's this bún chả place near my dorm. The owner remembers everyone's order. I went there, what, four times a week in first year?", vi: 'Nhân nói chuyện đồ ăn, gần ký túc xá mình có quán bún chả. Chủ quán nhớ món của từng người. Năm nhất mình ăn ở đó tuần bốn lần thì phải?' },
          { en: "Anyway, as I was saying, the food's great. The traffic, on the other hand… don't get me started.", vi: 'Thôi, như mình đang nói, đồ ăn thì tuyệt. Còn kẹt xe thì… đừng để mình nói.' },
          { en: "My first week, I got lost on a motorbike for two hours, because every street in the Old Quarter looks the same at night. And the thing is, my phone was dead.", vi: 'Tuần đầu, mình đi xe máy lạc hai tiếng, vì phố nào ở phố cổ ban đêm cũng giống nhau. Mà cái chính là điện thoại hết pin.' },
          { en: "But honestly, I think it's the best city for students. It's cheap, it's busy, there's always something going on.", vi: 'Nhưng thật lòng, mình nghĩ đây là thành phố hợp nhất cho sinh viên. Rẻ, nhộn nhịp, lúc nào cũng có chuyện để làm.' },
          { en: "So yeah, that's Hanoi for me. What about you? What's your city like?", vi: 'Vậy đó, Hà Nội với mình là thế. Còn bạn? Thành phố của bạn thế nào?' },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: không nhớ ra từ thì đừng dừng',
        items: [
          '**Tả nó bằng từ dễ**: "It\'s a **kind of** wine made from corn." · "It\'s **the thing you use to** open bottles." · "It\'s **like** a hotel, but you stay with a family."',
          '**Câu giờ bằng tiếng Anh**: "What\'s the word…", "How do I say this…". Hai, ba giây là đủ để bạn nghĩ ra hoặc người nghe nhắc hộ.',
          '**Mượn từ Việt rồi giải thích**: "We call it **rượu ngô**, it\'s corn wine." Người nước ngoài thường **thích** học từ địa phương.',
          '**Không quay lại sửa mỗi lỗi nhỏ.** Nói "I go there last week" thì cứ nói tiếp. Sửa giữa chừng ba lần làm đứt mạch hơn là để lỗi đó.',
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật trong cuộc trò chuyện dài',
        items: [
          '~~By the way, as I said, the call centre…~~ (để quay về) → **Anyway, as I was saying, the call centre…** Tiếng Việt "à mà" dùng cho cả rẽ lẫn quay về. Tiếng Anh: by the way = **rẽ đi**, anyway = **quay về**.',
          '~~Speaking of, I want to ask…~~ → **Speaking of food, I wanted to ask…** Sau "speaking of" phải có danh từ (hoặc "which").',
          '~~Speaking about the trip, …~~ → **Speaking of the trip, …** Cụm chuyển ý cố định là "speaking **of**".',
          '~~As I said, the train arrives at six.~~ (với người vừa hỏi lại) → **Like I mentioned, …** hoặc nói lại bình thường. "As I said" nhấn vào "tôi đã nói rồi", dễ nghe như trách người kia không chú ý. "As I was saying" thì khác: chỉ là quay lại mạch.',
          '~~(đang nói chuyện vui, bỗng) À mà anh lương bao nhiêu?~~ → đổi chủ đề **có cầu nối** và tránh chủ đề riêng tư. Nhảy chủ đề không báo trước làm người nghe hụt hẫng; nhảy sang tiền, tuổi, chuyện tình thì càng khó xử.',
          '~~(Người kia: "It\'s a long story. Anyway!") Oh, tell me, tell me!~~ → **theo chủ đề mới họ mở**. Họ vừa đóng cửa chủ đề đó. Muốn tỏ ra quan tâm thì để họ tự kể sau.',
          '~~I go to sleep now. Bye.~~ (đứng dậy luôn) → **Well, it\'s been really nice chatting. I\'m gonna try and get some sleep. Night!** Người Việt hay kết thúc trong một câu; người Anh, Mỹ cần 2–3 câu "hạ cánh".',
          '~~(nói một mạch 5 phút về mình, không hỏi lại)~~ → **Anyway, enough about me. What about you?** Nói 3 phút là để trả lời khi được hỏi, không phải để giữ micro cả buổi.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể trong cuộc trò chuyện dài' },
      {
        t: 'p',
        text: 'Sau phút thứ mười, người ta **ít nói ra** mà **ra hiệu** nhiều hơn: muốn nói tiếp, muốn chen vào, muốn kết thúc. Đọc được tín hiệu là nửa kỹ năng giữ mạch. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Tín hiệu không lời',
        items: [
          { anh: 'eyes', w: 'Uh-huh… and then?', ro: '/əˈhʌ ən ˈðen/', vi: 'Nhìn người nói, hơi nghiêng người tới = "kể tiếp đi, tôi đang nghe". Mắt dán vào điện thoại = "tôi chán rồi".' },
          { anh: 'index-pointing-up', w: 'Oh, that reminds me…', ro: '/ðæt rɪˈmaɪndz mi/', vi: 'Giơ nhẹ ngón trỏ, hít một hơi = "tôi muốn chen một ý". Ở Anh, Mỹ đây là cách xin lượt lịch sự.' },
          { anh: 'raised-hand', w: 'Hold that thought.', ro: '/ˈhoʊld ðæt ˈθɔːt/', vi: 'Lòng bàn tay giơ nhẹ, mỉm cười = "dừng một chút, lát quay lại". Đi kèm lời hẹn cụ thể.' },
          { anh: 'watch', w: 'Well, I should probably…', ro: '/wel aɪ ʃəd ˈprɑːbli/', vi: 'Liếc đồng hồ, cầm đồ lên, xoay người về phía cửa = **tín hiệu sắp kết thúc**. Thấy người kia làm vậy thì bạn giúp họ kết thúc.' },
          { anh: 'yawning-face', w: "Sorry, that's not you, that's the train!", ro: '', vi: 'Ngáp giữa lúc người khác kể = dễ bị hiểu là chán. Lỡ ngáp thì **xin lỗi ngay và đùa một câu** như Saoirse.' },
          { anh: 'mobile-phone', w: "Sorry, I just need to reply to this. One sec.", ro: '', vi: 'Phải xem điện thoại thì **nói ra** trước. Cúi xuống điện thoại không nói gì giữa cuộc trò chuyện = cắt đứt câu chuyện.' },
          { anh: 'person-bowing', w: 'It was a pleasure talking with you.', ro: '', vi: 'Với người Nhật lớn tuổi: kết thúc bằng một cái cúi đầu nhẹ, và thường họ cúi nhiều lần khi đã quay đi. Cúi lại là đủ.' },
          { anh: 'waving-hand', w: 'Night, both of you!', ro: '/ˈnaɪt ˈboʊθ əv ju/', vi: 'Vẫy tay, nhìn từng người khi chào. Ở nhóm ba người trở lên, chào **cả nhóm**, đừng chỉ chào người mình nói nhiều nhất.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Kết thúc cuộc trò chuyện', 'Một câu là xong: "Thôi em đi ngủ nhé."', 'Nhiều bước: tín hiệu → khen cuộc trò chuyện → hẹn lại → chào. Kết thúc một câu dễ bị hiểu là phật ý.', 'Nhiều lời cảm ơn, cúi chào, có khi chào lại lần nữa khi đã đi.'],
          ['Khoảng lặng', 'Im lặng cùng nhau không sao.', 'Im lặng lâu với người lạ thấy ngượng, người ta sẽ tìm chuyện. Với người đã thân thì im lặng thoải mái.', 'Im lặng được chấp nhận, không cần lấp.'],
          ['Hỏi chuyện riêng', 'Hỏi chuyện gia đình, người yêu để tỏ thân thiết.', 'Chờ người kia tự kể. Hỏi thì làm mềm: "Out of curiosity…", "Mind if I ask…"', 'Rất ít hỏi chuyện riêng với người mới quen.'],
          ['Nói chen', 'Bạn bè chen nhau bình thường.', 'Mỹ chen ngắn được; chen để đổi chủ đề thì phải xin ("Sorry, can I just…").', 'Hầu như không chen ngang.'],
        ],
        caption: 'Quy tắc dễ nhớ: **mở chậm, đóng chậm**. Cả mở đầu lẫn kết thúc một cuộc trò chuyện tiếng Anh đều cần vài câu "đệm" mà tiếng Việt không cần.',
      },

      { t: 'h', text: '7. Phát âm: ngữ điệu của từ chuyển ý' },
      {
        t: 'p',
        text: 'Từ chuyển ý thường đọc thành **một cụm riêng**, có ngắt nhẹ phía sau. Ngữ điệu nói lên ý định: **Anyway** xuống giọng chậm = quay về / khép lại; **Anyway!** lên giọng nhanh, dứt khoát = gạt chủ đề sang bên. **By the way** thường lên nhẹ ở "way", báo hiệu "còn nữa". Nghe mẫu, chú ý chỗ ngắt.',
      },
      {
        t: 'phatam',
        id: 'gtd26-phat-am',
        title: 'Luyện phát âm — 11 câu chuyển ý',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Đọc từ chuyển ý thành một cụm, ngắt nhẹ, rồi nói phần sau một hơi.',
        items: [
          { text: 'Anyway, as I was saying,', ipa: 'eniweɪ æz aɪ wəz seɪɪŋ', vi: 'anyway nhấn âm đầu "É-ni-uây" · was đọc nhẹ /wəz/' },
          { text: 'By the way, are you on Instagram?', ipa: 'baɪ ðə weɪ ɑːr ju ɑːn ɪnstəɡræm', vi: 'the đọc nhẹ /ðə/ · nối are‿you · Instagram nhấn âm đầu' },
          { text: 'Speaking of photos, am I too late?', ipa: 'spiːkɪŋ əv foʊtoʊz æm aɪ tuː leɪt', vi: 'of nhẹ /əv/ · photos có /z/ cuối' },
          { text: "That reminds me, it's going to be cold.", ipa: 'ðæt rɪmaɪndz mi ɪts ɡənə bi koʊld', vi: 'reminds nhấn âm hai, có /ndz/ cuối · going to đọc thành gonna (Ngày 25)' },
          { text: 'Where was I?', ipa: 'wer wəz aɪ', vi: 'nối was‿I ≈ "uơ-zai" · xuống giọng cuối' },
          { text: 'Hold that thought.', ipa: 'hoʊld ðæt θɔːt', vi: 'hai âm khó liền nhau: /ð/ trong that và /θ/ trong thought, lưỡi chạm răng' },
          { text: "That's a whole other story.", ipa: 'ðæts ə hoʊl ʌðər stɔːri', vi: 'nối whole‿other · nhấn **whole**' },
          { text: 'Out of curiosity, who is we?', ipa: 'aʊt əv kjʊriɑːsəti huː ɪz wiː', vi: 'curiosity 5 âm tiết, nhấn âm thứ tư "-ÁS-" · out‿of nối thành "ao-đơv"' },
          { text: "It's been really nice chatting.", ipa: 'ɪts bɪn rɪli naɪs tʃætɪŋ', vi: 'been đọc nhẹ /bɪn/ · chatting có t "đ nhẹ" kiểu Mỹ' },
          { text: "Sorry, I've been talking your ear off.", ipa: 'sɑːri aɪv bɪn tɔːkɪŋ jər ɪr ɔːf', vi: 'talking: chữ l câm · nối ear‿off' },
          { text: "So yeah, that's my story. What about you?", ipa: 'soʊ jeə ðæts maɪ stɔːri wʌt əbaʊt juː', vi: 'xuống giọng ở story (đã xong) · lên giọng ở you (trả lượt)' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: kéo câu chuyện về và kết thúc khéo' },
      {
        t: 'dialogue',
        title: 'Bữa sáng ở ga Lào Cai — Garrett kể chuyện cái xe đóng băng',
        lines: [
          { who: 'Garrett', role: 'b', text: "Okay, as promised. So it's minus thirty-five, right, and my car door is frozen solid.", vi: 'Rồi, như đã hứa. Trời âm ba mươi lăm độ, và cửa xe tôi đóng băng cứng.' },
          { who: 'Tâm', role: 'a', text: 'Minus thirty-five? Is that normal in Winnipeg?', vi: 'Âm ba mươi lăm? Ở Winnipeg vậy là bình thường à?' },
          { who: 'Garrett', role: 'b', text: "A few days a year, yeah. Oh, speaking of normal, is it normal to eat phở for breakfast here? Because I've had it four days in a row.", vi: 'Mỗi năm vài hôm, ừ. À, nhân nói chuyện bình thường, ở đây ăn phở bữa sáng có bình thường không? Tôi ăn bốn ngày liền rồi.' },
          { who: 'Tâm', role: 'a', text: "Totally normal. But hold on, going back to your car, what did you do?", vi: 'Hoàn toàn bình thường. Nhưng khoan, quay lại cái xe của anh, rồi anh làm gì?' },
          { who: 'Garrett', role: 'b', text: "Right, where was I? So I poured a kettle of hot water on the door, which, by the way, you should never do.", vi: 'À đúng, tôi đang kể tới đâu nhỉ? Tôi đổ một ấm nước sôi lên cửa xe, mà nhân tiện, đừng bao giờ làm thế.' },
          { who: 'Tâm', role: 'a', text: "Why not? It sounds like a good idea.", vi: 'Sao lại không? Nghe hợp lý mà.' },
          { who: 'Garrett', role: 'b', text: "The window cracked. Right down the middle. Anyway, that's my winter story. What's the coldest place you've ever been?", vi: 'Kính cửa nứt. Nứt ngay giữa. Thôi, chuyện mùa đông của tôi là vậy. Chỗ lạnh nhất em từng đến là đâu?' },
          { who: 'Tâm', role: 'a', text: "Probably right here, honestly! Come to think of it, I've never seen snow.", vi: 'Chắc là ngay đây, thật đấy! Nghĩ lại mới thấy, em chưa thấy tuyết bao giờ.' },
          { who: 'Garrett', role: 'b', text: "Never? Then you've gotta come to Winnipeg. Oh, there's our bus.", vi: 'Chưa bao giờ? Vậy em phải sang Winnipeg. Ô, xe buýt của mình kìa.' },
          { who: 'Tâm', role: 'a', text: "Okay, this was really fun. Let's pick this up in Ta Van on Sunday. I wanna hear what happened next.", vi: 'Rồi, vui thật đấy. Chủ nhật ở Tả Van nói tiếp nhé. Em muốn nghe chuyện sau đó.' },
          { who: 'Garrett', role: 'b', text: "Deal. See you Sunday, Tâm.", vi: 'Hứa. Chủ nhật gặp nhé, Tâm.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd26-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Tâm (5 câu)',
        items: [
          { vi: 'Garrett lạc sang chuyện phở → Bạn: Nhưng khoan, quay lại cái xe của anh, rồi anh làm gì?', chips: ['But', 'hold', 'on,', 'going', 'back', 'to', 'your', 'car,', 'what', 'did', 'you', 'do?', 'by', 'speaking'], answer: ['But', 'hold', 'on,', 'going', 'back', 'to', 'your', 'car,', 'what', 'did', 'you', 'do?'] },
          { vi: 'Bạn: Nghĩ lại mới thấy, em chưa thấy tuyết bao giờ.', chips: ['Come', 'to', 'think', 'of', 'it,', "I've", 'never', 'seen', 'snow.', 'about', 'saw'], answer: ['Come', 'to', 'think', 'of', 'it,', "I've", 'never', 'seen', 'snow.'] },
          { vi: 'Bạn: Nhân nói chuyện bữa sáng, anh thử bánh cuốn chưa?', chips: ['Speaking', 'of', 'breakfast,', 'have', 'you', 'tried', 'bánh cuốn?', 'about', 'did'], answer: ['Speaking', 'of', 'breakfast,', 'have', 'you', 'tried', 'bánh cuốn?'] },
          { vi: 'Bạn: Chủ nhật ở Tả Van mình nói tiếp nhé.', chips: ["Let's", 'pick', 'this', 'up', 'in', 'Ta Van', 'on', 'Sunday.', 'at', 'down'], answer: ["Let's", 'pick', 'this', 'up', 'in', 'Ta Van', 'on', 'Sunday.'] },
          { vi: 'Bạn: Thôi, chuyện của em là vậy. Còn anh?', chips: ['Anyway,', "that's", 'my', 'story.', 'What', 'about', 'you?', 'By the way,', 'how'], answer: ['Anyway,', "that's", 'my', 'story.', 'What', 'about', 'you?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd26-noi-3-phut',
        part: '2',
        questions: [
          'Talk for 3 minutes about the city or town where you live now. Say what you like about it, what you don\'t like, and tell one short story that happened to you there. Use at least one side branch (Speaking of… / By the way…) and come back to your main point (Anyway, as I was saying…). Finish with "So yeah…" and a question back.',
          'Talk for 3 minutes about a hobby or interest you have had for a long time. Say how you started, what you enjoy about it, and one funny or difficult moment. Use "That reminds me" or "Come to think of it" at least once.',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đoạn đề bài dưới đây. Mục tiêu: giữ cuộc trò chuyện **ít nhất 15 lượt**, tự kéo câu chuyện về ít nhất một lần, và tự kết thúc theo đủ các bước.',
          '"You are Saoirse, a 27-year-old English teacher from Cork, Ireland, who has lived in Hanoi for eight months. We are sharing a cabin on the night train to Lao Cai and we have already introduced ourselves. Talk naturally at B2 level, at normal native speed. Go off on a tangent at least twice (use Speaking of…) and wait to see if I bring you back. Once, when I ask about something personal, say \'It\'s a long story. Anyway!\' and change the topic, and see if I follow your signal. After about 15 turns, start yawning and give me signals that you want to sleep, but let me be the one who closes the conversation. At the end, tell me in Vietnamese: which transitions I used well, where I changed topic too suddenly, and whether my goodbye had enough steps."',
          'Lượt hai: bạn là người **kể chuyện dài**, AI là người hay chen, hay lạc đề. Bạn phải tự kéo câu chuyện của mình về bằng "Anyway, as I was saying…" và "Sorry, can I just finish this bit?".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd26-viet',
    kind: 'writing',
    title: 'Email/tin nhắn dài kể chuyện cho bạn nước ngoài',
    goal: 'Viết được một email hoặc tin nhắn dài 200–300 chữ kể chuyện cho một người bạn nước ngoài: mở bằng câu nối lại lần gặp trước, kể theo đoạn có từ chuyển ý, chen một nhánh phụ rồi quay về, kết bằng câu hỏi và lời hẹn; viết được hai mức thân và trang trọng hơn.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao học viết thư dài',
        items: [
          'Gặp người nước ngoài một lần thì dễ. Giữ được **mối quan hệ** sau đó thì phải viết: một email kể chuyện sau chuyến đi, một tin nhắn dài hỏi thăm sau vài tháng.',
          'Thư kể chuyện tốt có **5 phần**: mở nối lại · chuyện chính · nhánh phụ · quay về và cập nhật · câu hỏi + lời hẹn.',
          'Từ chuyển ý trong bài Nói hôm nay **dùng được khi viết**, nhưng mỗi lần chuyển ý thì **xuống dòng sang đoạn mới**.',
          'Bạn đọc hai thư Tâm viết sau chuyến Sa Pa: cho Saoirse (bạn mới, thân) và cho Garrett (lớn tuổi hơn, mới quen, bớt thân). Rồi tự viết thư của mình.',
          'Ngày 11 bạn viết tin nhắn kể chuyện ngắn; Ngày 12 viết lời cảm ơn. Hôm nay là bản **dài và có cấu trúc** hơn.',
        ],
      },

      { t: 'h', text: '1. Thư mẫu: Tâm viết cho Saoirse (thân)' },
      {
        t: 'canh',
        anh: ['e-mail', 'snow-capped-mountain', 'foggy', 'writing-hand', 'hot-beverage'],
        caption: 'Tối thứ Năm, ba ngày sau chuyến Sa Pa. Saoirse bị cảm (một chiếc áo len không đủ) nên Chủ nhật không lên Tả Van được. Tâm viết một email dài kể lại mọi chuyện.',
      },
      {
        t: 'passage',
        title: 'Subject: Ta Van, corn wine and jacket number six',
        intro: 'Mỗi đoạn có nhãn là một phần của thư. Chỗ in đậm là cụm dùng lại được.',
        paras: [
          {
            label: 'A · Mở nối lại',
            text: 'Hi Saoirse, **How\'s the cold?** I hope you\'re feeling better. **I told you one jumper wasn\'t enough!** We missed you on Sunday. **I\'ve been meaning to write since Monday**, so here\'s the full story.',
          },
          {
            label: 'B · Chuyện chính',
            text: 'The day after the train, my friend\'s mum took me up to a waterfall above Ta Van. It\'s only about four kilometres, but it rained the whole way, so **by the time we got there**, I was completely soaked. She just laughed and handed me jacket number six. (**For the record**, she has six, not five. I was wrong.)',
          },
          {
            label: 'C · Nhánh phụ',
            text: '**Speaking of** jackets, Garrett turned up on Sunday with his camera and absolutely no raincoat. He got some amazing shots of the fog, though, **which** I\'m sure he\'ll post soon. He also told me the frozen car story. **I won\'t spoil it**, but it involves a kettle.',
          },
          {
            label: 'D · Quay về + cập nhật',
            text: '**Anyway, back to** the waterfall. On the way down, we met a group of kids walking home from school, and one of them asked me in perfect English whether I was "a tourist or a real person". **I\'m still thinking about that one.** **By the way**, I start my internship on Monday! I\'m nervous, but I keep telling myself that if I can talk to strangers on a night train for an hour, I can talk to my new team.',
          },
          {
            label: 'E · Hỏi + hẹn + chào',
            text: '**Oh, and before I forget**, you still owe me the Korea story. **No pressure**, but next time you\'re free, let\'s get bún chả and you can tell me everything. **Take care and stay warm!** Tâm',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd26-viet-hieu',
        title: 'Đọc thư mẫu: cấu trúc và giọng điệu (5 câu)',
        items: [
          {
            q: 'Câu "I told you one jumper wasn\'t enough!" ở đoạn A có tác dụng gì?',
            options: ['Trách Saoirse', 'Nối lại một chi tiết vui từ lần gặp trước, tạo cảm giác thân', 'Hỏi Saoirse mua áo ở đâu', 'Xin lỗi Saoirse'],
            correct: 1,
            why: 'Thư thân hay mở bằng **một chi tiết chung của hai người** (inside joke). Giọng đùa, có dấu chấm than, không có ý trách.',
          },
          {
            q: 'Đoạn C bắt đầu bằng "Speaking of jackets". Vì sao không viết "By the way"?',
            options: ['Hai cụm giống hệt nhau', 'Vì chuyện Garrett không có áo mưa liên quan trực tiếp tới chuyện áo khoác ở đoạn B', 'Vì "By the way" là sai ngữ pháp', 'Vì Garrett là người Canada'],
            correct: 1,
            why: '**Speaking of** = rẽ sang chuyện **liên quan** tới chữ vừa nhắc (jackets). **By the way** dùng cho chuyện mới hẳn, như tin thực tập ở đoạn D.',
          },
          {
            q: '"Anyway, back to the waterfall" ở đoạn D cho người đọc biết gì?',
            options: ['Tâm sắp kết thúc thư', 'Nhánh phụ về Garrett đã xong, câu chuyện chính tiếp tục', 'Tâm quay lại thác lần nữa', 'Tâm không muốn kể về Garrett'],
            correct: 1,
            why: '**Anyway, back to + chủ đề** = quay về mạch chính. Đây là dạng viết của "Anyway, as I was saying".',
          },
          {
            q: '"I won\'t spoil it" về câu chuyện cái xe có nghĩa là?',
            options: ['Tâm không làm hỏng chiếc ấm', 'Tâm không kể trước đoạn kết, để Garrett tự kể', 'Câu chuyện bị hỏng', 'Tâm quên mất câu chuyện'],
            correct: 1,
            why: '**spoil** (a story / a film) = kể lộ đoạn kết. "I won\'t spoil it" giữ tò mò cho người đọc, và cho Garrett cơ hội kể.',
          },
          {
            q: 'Thư kết thúc bằng gì?',
            options: ['Chỉ ký tên', 'Một lời nhắc vui (Korea story), một lời hẹn cụ thể và một lời chúc', 'Một lời xin lỗi', 'Một câu hỏi về thời tiết'],
            correct: 1,
            why: 'Đoạn E có đủ: **before I forget** + lời nhắc, **let\'s get bún chả** (hẹn cụ thể), **Take care and stay warm!** Thư kết thúc như vậy thì người nhận có lý do để trả lời.',
          },
        ],
      },

      { t: 'h', text: '2. Cùng một chuyện, hai mức: thân · bớt thân' },
      {
        t: 'p',
        text: 'Garrett lớn tuổi hơn, mới quen một lần, là thầy giáo. Tâm vẫn kể chuyện, vẫn đùa nhẹ, nhưng câu đủ chủ ngữ hơn, ít dấu chấm than, không dùng gonna, và mở – kết lịch sự hơn. So từng phần:',
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Phần mở thư',
        caption: 'Thư thân mở bằng chuyện chung; thư bớt thân mở bằng lời hỏi thăm rồi mới nối lại.',
        cols: [
          {
            title: 'Thân (gửi Saoirse)',
            anh: 'speech-balloon',
            items: ['Hi Saoirse,', "How's the cold? I told you one jumper wasn't enough!", "I've been meaning to write since Monday, so here's the full story."],
          },
          {
            title: 'Bớt thân (gửi Garrett)',
            anh: 'e-mail',
            items: ['Hi Garrett,', 'I hope you are well and that the rest of your trip is going smoothly.', 'Thank you again for the photos. The one of the fog over Ta Van is now my phone background.'],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Phần chuyển ý giữa thư',
        caption: 'Cùng việc rẽ sang chuyện khác rồi quay về, chỉ đổi cụm từ.',
        cols: [
          {
            title: 'Thân',
            anh: 'left-speech-bubble',
            items: ['Speaking of jackets, …', 'Anyway, back to the waterfall.', 'By the way, I start my internship on Monday!'],
          },
          {
            title: 'Bớt thân',
            anh: 'memo',
            items: ['On a different note, …', 'To get back to the waterfall, …', 'I also wanted to let you know that I start my internship on Monday.'],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Phần kết thư',
        caption: 'Cả hai đều có một câu hỏi và một lời hẹn. Khác ở độ thân của lời chào cuối.',
        cols: [
          {
            title: 'Thân',
            anh: 'waving-hand',
            items: ['Oh, and before I forget, you still owe me the Korea story.', "Let's get bún chả soon!", 'Take care and stay warm!', 'Tâm'],
          },
          {
            title: 'Bớt thân',
            anh: 'handshake',
            items: ['If you are ever back in Hanoi, I would be happy to show you around.', 'I hope the rest of your sabbatical goes well.', 'Best wishes,', 'Tâm'],
          },
        ],
      },

      { t: 'h', text: '3. Khung câu cho thư kể chuyện dài' },
      {
        t: 'patterns',
        rows: [
          {
            formula: "I've been meaning to + V + since… / for ages",
            vi: 'Mở thư khi trả lời hơi muộn: "mình định… từ lâu rồi". Tự nhiên hơn "Sorry for the late reply".',
            examples: [
              { en: "I've been meaning to write since Monday.", vi: 'Mình định viết cho bạn từ thứ Hai rồi.' },
              { en: "I've been meaning to send you these photos for ages.", vi: 'Mình định gửi bạn mấy tấm ảnh này lâu lắm rồi.' },
              { en: "I've been meaning to ask how your trip went.", vi: 'Mình định hỏi chuyến đi của bạn thế nào từ lâu.' },
            ],
          },
          {
            formula: 'By the time + S + V (quá khứ), + S + V',
            vi: 'Kể kết quả tại một thời điểm: "tới lúc… thì…".',
            examples: [
              { en: 'By the time we got there, I was soaked.', vi: 'Tới lúc lên tới nơi thì mình ướt sũng.' },
              { en: 'By the time the bus came, it was dark.', vi: 'Tới lúc xe buýt tới thì trời đã tối.' },
              { en: 'By the time I woke up, we were in Lao Cai.', vi: 'Tới lúc mình tỉnh dậy thì tàu đã tới Lào Cai.' },
            ],
          },
          {
            formula: 'Speaking of + N, … · Anyway, back to + N. · By the way, …',
            vi: 'Ba cụm chuyển ý chính. Mỗi lần dùng: **xuống dòng, mở đoạn mới**.',
            examples: [
              { en: 'Speaking of Garrett, he finally told me the car story.', vi: 'Nhân nói về Garrett, cuối cùng anh ấy cũng kể vụ cái xe.' },
              { en: 'Anyway, back to the homestay.', vi: 'Thôi, quay lại chuyện homestay.' },
              { en: 'By the way, did you get my photos?', vi: 'À, bạn nhận được ảnh mình gửi chưa?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Mở nối lại → Chuyện chính → (Speaking of… nhánh phụ) → Anyway, back to… → By the way, tin mới → Before I forget + hẹn → Chào',
        vi: 'Mỗi mũi tên là một đoạn mới. Đoạn 3–5 câu. Cả thư 200–300 chữ là vừa cho một lần kể chuyện.',
      },
      {
        t: 'table',
        head: ['Khi nói', 'Khi viết thư thân', 'Khi viết thư bớt thân'],
        rows: [
          ['Anyway, as I was saying, …', 'Anyway, back to…', 'To get back to…, …'],
          ['By the way, …', 'By the way, …', 'I also wanted to mention that…'],
          ['Speaking of…, …', 'Speaking of…, …', 'On the subject of…, …'],
          ['Before I forget, …', 'Oh, and before I forget, …', 'One last thing: …'],
          ["So yeah, that's my week.", "So yeah, that's been my week!", 'That is all my news for now.'],
          ['gonna / wanna', 'được dùng (thư rất thân)', 'không dùng'],
        ],
        caption: 'Từ chuyển ý khi nói và khi viết thư thân gần như giống hệt. Thư bớt thân chỉ cần chuyển sang câu đủ chữ hơn.',
      },

      { t: 'h', text: '4. Tập viết' },
      {
        t: 'build',
        id: 'gtd26-viet-ghep',
        title: 'Sắp xếp thành câu trong thư (4 câu)',
        items: [
          { vi: 'Mình định viết cho bạn từ thứ Hai rồi.', chips: ["I've", 'been', 'meaning', 'to', 'write', 'since', 'Monday.', 'for', 'writing'], answer: ["I've", 'been', 'meaning', 'to', 'write', 'since', 'Monday.'] },
          { vi: 'Tới lúc lên tới nơi thì mình ướt sũng.', chips: ['By', 'the', 'time', 'we', 'got', 'there,', 'I', 'was', 'soaked.', 'when', 'get'], answer: ['By', 'the', 'time', 'we', 'got', 'there,', 'I', 'was', 'soaked.'] },
          { vi: 'Thôi, quay lại chuyện cái thác.', chips: ['Anyway,', 'back', 'to', 'the', 'waterfall.', 'By the way,', 'speaking'], answer: ['Anyway,', 'back', 'to', 'the', 'waterfall.'] },
          { vi: 'À, trước khi quên, bạn vẫn còn nợ mình chuyện Hàn Quốc.', chips: ['Oh,', 'and', 'before', 'I', 'forget,', 'you', 'still', 'owe', 'me', 'the', 'Korea', 'story.', 'after', 'tell'], answer: ['Oh,', 'and', 'before', 'I', 'forget,', 'you', 'still', 'owe', 'me', 'the', 'Korea', 'story.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd26-viet-dien',
        title: 'Điền một từ vào thư (6 câu)',
        kind: 'fill',
        grammar: 'speaking of · anyway, back to · by the way · before I forget · by the time · been meaning to',
        items: [
          { q: "I've been ___ to write since our trip. (định từ lâu)", answers: ['meaning'] },
          { q: '___ of food, I finally tried egg coffee!', answers: ['Speaking'] },
          { q: 'Anyway, ___ to the homestay. On the last night, …', answers: ['back'] },
          { q: 'By the ___ we got home, it was midnight.', answers: ['time'] },
          { q: 'By the ___, I start my internship on Monday!', answers: ['way'] },
          { q: 'Oh, and before I ___, here are the photos.', answers: ['forget'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd26-viet-dich',
        title: 'Tự viết 5 câu cho thư của bạn (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I've been meaning to… · By the time… · Speaking of… · Anyway, back to… · Before I forget…",
        items: [
          { q: '(Thân) Mình định gửi bạn mấy tấm ảnh này lâu lắm rồi.', hint: "I've been meaning to, for ages", answers: ["I've been meaning to send you these photos for ages.", 'I have been meaning to send you these photos for ages.', "I've been meaning to send these photos to you for ages.", "I've been meaning to send you these pictures for ages."] },
          { q: 'Tới lúc xe buýt tới thì trời đã tối.', hint: 'by the time, dark', answers: ['By the time the bus came, it was dark.', 'By the time the bus arrived, it was dark.', 'By the time the bus came it was dark.', 'By the time the bus arrived, it was already dark.', 'By the time the bus came, it was already dark.'] },
          { q: 'Nhân nói chuyện Garrett, cuối cùng anh ấy cũng kể vụ cái xe.', hint: 'speaking of, finally', answers: ['Speaking of Garrett, he finally told me the car story.', 'Speaking of Garrett, he finally told me the story about the car.', 'Speaking of Garrett, he finally told us the car story.', 'Speaking of Garrett, he finally told me about the car.'] },
          { q: 'Thôi, quay lại chuyện homestay.', hint: 'anyway, back to', answers: ['Anyway, back to the homestay.', 'Anyway, back to the homestay story.', 'Anyway, going back to the homestay.'] },
          { q: '(Bớt thân) Nếu anh có dịp quay lại Hà Nội, em rất sẵn lòng dẫn anh đi tham quan.', hint: 'if you are ever back in, show you around', answers: ['If you are ever back in Hanoi, I would be happy to show you around.', "If you're ever back in Hanoi, I'd be happy to show you around.", "If you're ever back in Hanoi, I would be happy to show you around.", 'If you are ever back in Hanoi, I would be glad to show you around.', "If you're ever back in Hanoi, I'd be glad to show you around."] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 5 việc soát trước khi bấm gửi một thư dài',
        items: [
          '**Mỗi lần chuyển ý có xuống dòng chưa?** Một khối chữ 300 từ không ngắt đoạn thì ít ai đọc hết, nhất là trên điện thoại.',
          '**Có câu hỏi nào cho người nhận không?** Thư chỉ kể về mình thì người ta đọc xong, thả tim, không trả lời. Một câu hỏi cụ thể (the Korea story, how\'s the cold?) là lý do để họ viết lại.',
          '**Xin lỗi trả lời muộn nhiều nhất một lần.** "Sorry, sorry, so sorry I\'m late" ba lần làm thư nặng nề. "I\'ve been meaning to write…" là đủ.',
          '**Tên riêng Việt có giải thích chưa?** Lần đầu viết bánh cuốn, Tả Van, rượu ngô thì thêm vài chữ: "rượu ngô (corn wine)", "Ta Van, the village where my friend lives".',
          '**Giọng có khớp người nhận không?** Gửi Garrett mà còn "gonna", "lol", ba dấu chấm than thì đọc lại và hạ bớt.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd26-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 26',
    goal: 'Làm 34 câu có đáp án để chọn đúng từ chuyển ý (rẽ, quay về, khép, kết thúc), đọc đúng tín hiệu của người khác trong cuộc trò chuyện dài và viết lại các câu đó trong thư.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ chuyển ý · dịch Việt → Anh · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 25** (gonna, wanna, I\'m good) và **Ngày 23** (apparently, it seems).',
          'Phần dịch chấp nhận nhiều cách viết. Dấu chấm, viết hoa không tính.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 27: kể chuyện có cao trào và đùa nhẹ.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd26-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn đang kể chuyện thì lạc sang chuyện khác hai phút. Muốn quay lại chuyện chính, bạn nói:',
            options: ['By the way, …', 'Anyway, as I was saying, …', 'Speaking of, …', 'Before I forget, …'],
            correct: 1,
            why: '**Anyway, as I was saying** = quay về mạch chính. By the way là để rẽ đi, không phải quay về.',
          },
          {
            q: 'Người kia vừa nhắc tới Đà Lạt. Bạn muốn kể chuyện chuyến đi Đà Lạt của mình:',
            options: ['By the way, Da Lat.', 'Speaking of Da Lat, I went there last spring.', 'Anyway, Da Lat.', 'As I said, Da Lat.'],
            correct: 1,
            why: '**Speaking of + chủ đề vừa nhắc** = rẽ sang chuyện liên quan.',
          },
          {
            q: 'Bạn hỏi một đồng nghiệp người Úc sao lại chuyển sang Việt Nam. Chị ấy cười: "Ugh, long story. Anyway! How\'s your project going?" Bạn nên:',
            options: ['"No, tell me the long story!"', 'Trả lời về dự án và không hỏi lại chuyện đó', 'Im lặng', '"Why don\'t you want to tell me?"'],
            correct: 1,
            why: '**Long story. Anyway!** + câu hỏi mới = đóng cửa chủ đề. Theo chủ đề mới là lịch sự.',
          },
          {
            q: 'Người kia đang kể dở thì bạn lỡ chen ngang. Bạn sửa:',
            options: ['Sorry, I cut you off. You were saying?', 'As I said…', 'By the way, …', 'Anyway, enough about me.'],
            correct: 0,
            why: '**You were saying?** = mời người kia nói tiếp đúng chỗ bị cắt.',
          },
          {
            q: 'Bạn đã nói về mình khá lâu và muốn trả lượt:',
            options: ['So yeah. Anyway, enough about me. What about you?', 'Before I forget, bye.', "Hold that thought.", "That's a whole other story."],
            correct: 0,
            why: '**So yeah** (kết ý) + **enough about me** + câu hỏi = trả lượt tự nhiên.',
          },
          {
            q: 'Cuộc trò chuyện dài sắp kết thúc. Câu nào là tín hiệu tốt để bắt đầu chào?',
            options: ['I go now.', "Well, it's been really nice chatting. I should probably get some sleep.", 'Bye.', 'You talk too much.'],
            correct: 1,
            why: 'Kết thúc nhiều bước: **Well** (tín hiệu) + **it\'s been really nice chatting** (đánh giá đẹp) + lý do. "I go now" vừa sai ngữ pháp vừa quá đột ngột.',
          },
          {
            q: 'Bạn của bạn đang bắt đầu một câu chuyện dài nhưng xe tới rồi. Câu nào khéo nhất?',
            options: ['Stop talking, the car is here.', "Hold that thought. Tell me in the car?", "Anyway, that's my story.", 'Speaking of cars, …'],
            correct: 1,
            why: '**Hold that thought** + hẹn chỗ nói tiếp. Người kể không thấy bị cắt.',
          },
          {
            q: '"Don\'t get me started on the traffic." Người nói muốn nói gì?',
            options: ['Họ không biết gì về giao thông', 'Họ có rất nhiều điều (bực mình) muốn nói về giao thông', 'Họ không lái xe', 'Họ muốn bạn bắt đầu kể'],
            correct: 1,
            why: '**Don\'t get me started on…** = nói ra là không dừng được. Thường là câu đùa, kèm thái độ bực mình.',
          },
          {
            q: '(Ôn Ngày 25) Bạn mời thêm trà, người kia nói "I\'m good, thanks." Họ:',
            options: ['Muốn thêm trà', 'Không muốn thêm trà', 'Khen trà ngon', 'Hỏi bạn có khoẻ không'],
            correct: 1,
            why: '**I\'m good** khi được mời = No, thanks.',
          },
          {
            q: '(Ôn Ngày 23) Bạn kể lại một tin chưa chắc chắn. Câu nào hợp nhất?',
            options: ['The new metro line opens next month, 100%.', 'Apparently, the new metro line opens next month.', 'The new metro line opens next month, I promise.', 'I know the new metro line opens next month.'],
            correct: 1,
            why: '**Apparently** = nghe nói là, đọc thấy là. Dùng khi kể lại tin mà mình không trực tiếp kiểm chứng.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền từ chuyển ý' },
      {
        t: 'quiz',
        id: 'gtd26-bt-dien',
        title: 'Phần II — Điền một từ (7 câu)',
        kind: 'fill',
        grammar: 'anyway · by the way · speaking of · as I was saying · that reminds me · hold that thought · where was I',
        items: [
          { q: '___ of coffee, have you tried egg coffee?', answers: ['Speaking'] },
          { q: 'Anyway, as I was ___, the train was three hours late.', answers: ['saying'] },
          { q: 'That ___ me, I owe you twenty thousand dong.', answers: ['reminds'] },
          { q: 'Hold that ___. I need to answer this call.', answers: ['thought'] },
          { q: 'Sorry, where ___ I? Oh yes, the waterfall.', answers: ['was'] },
          { q: "We nearly moved to Korea, but that's a whole ___ story.", answers: ['other'] },
          { q: "Sorry, I've been talking your ___ off, haven't I?", answers: ['ear', 'ears'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd26-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'By the way · Speaking of · Anyway · Out of curiosity · Before I forget · It\'s been really nice chatting',
        items: [
          { q: 'Tò mò chút, sao bạn chọn Việt Nam?', hint: 'out of curiosity, choose', answers: ['Out of curiosity, why did you choose Vietnam?', 'Out of curiosity, why Vietnam?', 'Out of curiosity, why did you pick Vietnam?', 'Just out of curiosity, why did you choose Vietnam?'] },
          { q: 'Xin lỗi, mình lạc đề rồi.', hint: 'going off on a tangent', answers: ["Sorry, I'm going off on a tangent.", 'Sorry, I am going off on a tangent.', "Sorry, I'm going off on a tangent here.", 'Sorry, I went off on a tangent.'] },
          { q: 'Thôi, nói về mình đủ rồi. Còn bạn thì sao?', hint: 'enough about me', answers: ['Anyway, enough about me. What about you?', 'Anyway, enough about me. How about you?', 'Enough about me. What about you?', 'Enough about me. How about you?'] },
          { q: 'Trước khi quên, bạn có Instagram không?', hint: 'before I forget, on Instagram', answers: ['Before I forget, are you on Instagram?', 'Before I forget, do you have Instagram?', 'Oh, before I forget, are you on Instagram?', 'Before I forget, do you use Instagram?'] },
          { q: 'Nói chuyện với bạn vui thật đấy.', hint: "it's been, chatting", answers: ["It's been really nice chatting.", "It's been really nice chatting with you.", "It's been really nice talking to you.", "It's been really nice talking with you.", 'It has been really nice chatting.', "It's been great chatting.", "It's been lovely chatting."] },
          { q: 'Mai mình nói tiếp nhé.', hint: 'pick this up', answers: ["Let's pick this up tomorrow.", "Let's pick this up again tomorrow.", "Let's continue tomorrow.", "Let's pick it up tomorrow."] },
          { q: '(Ôn Ngày 25) Mình sẽ cố đi ngủ một chút. (nói tự nhiên, thân)', hint: 'gonna, try and get some sleep', answers: ["I'm gonna try and get some sleep.", "I'm going to try and get some sleep.", "I'm gonna try to get some sleep.", "I'm going to try to get some sleep."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd26-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'By the way, I noticed your camera.', answer: 'By the way, I noticed your camera.' },
          { label: 'Câu 2', spell: "Come to think of it, I've never seen snow.", answer: "Come to think of it, I've never seen snow.", alt: ['Come to think of it, I have never seen snow.'] },
          { label: 'Câu 3', spell: 'Going back to what you said about Korea, what happened?', answer: 'Going back to what you said about Korea, what happened?' },
          { label: 'Câu 4', spell: "Anyway, that's my story. What about you?", answer: "Anyway, that's my story. What about you?", alt: ['Anyway, that is my story. What about you?'] },
          { label: 'Câu 5', spell: "Let's pick this up at breakfast.", answer: "Let's pick this up at breakfast.", alt: ['Let us pick this up at breakfast.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd26-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Thôi, như mình đang kể, mình bỏ việc ngay hôm đó.', chips: ['Anyway,', 'as', 'I', 'was', 'saying,', 'I', 'quit', 'that', 'day.', 'said', 'by'], answer: ['Anyway,', 'as', 'I', 'was', 'saying,', 'I', 'quit', 'that', 'day.'] },
          { vi: 'Nhân nói chuyện đồ ăn, bạn thử bánh cuốn chưa?', chips: ['Speaking', 'of', 'food,', 'have', 'you', 'tried', 'bánh cuốn?', 'about', 'do'], answer: ['Speaking', 'of', 'food,', 'have', 'you', 'tried', 'bánh cuốn?'] },
          { vi: 'Xin lỗi, mình cắt lời bạn. Bạn đang nói dở?', chips: ['Sorry,', 'I', 'cut', 'you', 'off.', 'You', 'were', 'saying?', 'said', 'down'], answer: ['Sorry,', 'I', 'cut', 'you', 'off.', 'You', 'were', 'saying?'] },
          { vi: 'Đừng để mình nói chuyện kẹt xe.', chips: ["Don't", 'get', 'me', 'started', 'on', 'the', 'traffic.', 'start', 'about'], answer: ["Don't", 'get', 'me', 'started', 'on', 'the', 'traffic.'] },
          { vi: 'Tới lúc mình tỉnh dậy thì tàu đã tới Lào Cai.', chips: ['By', 'the', 'time', 'I', 'woke', 'up,', 'we', 'were', 'in', 'Lao Cai.', 'when', 'wake'], answer: ['By', 'the', 'time', 'I', 'woke', 'up,', 'we', 'were', 'in', 'Lao Cai.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (15 phút)',
        items: [
          'Bấm giờ **3 phút**, nói về thành phố bạn đang sống theo khung 7 bước. Ghi âm. Nghe lại và đếm: bạn dùng mấy từ chuyển ý, có lần nào đứng im quá 3 giây không.',
          'Viết một **email 200–250 chữ** cho một người bạn nước ngoài (có thật hoặc tưởng tượng) kể về một chuyến đi gần đây, theo đủ 5 phần A–E. Dán vào **Gia sư AI** và nhờ chấm giọng điệu.',
          'Ngày 27: kể chuyện **có cao trào** (I had just… when…), hiểu và đáp lại câu đùa của người bản xứ.',
        ],
      },
    ],
  },
];
