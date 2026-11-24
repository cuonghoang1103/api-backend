/**
 * Tiếng Anh giao tiếp — NGÀY 9 (chặng 2 "Đời sống", A2+ → B1): gọi điện.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd9-`.
 * Ngữ pháp trong câu: will cho quyết định tức thì (I'll call you back, I'll put you through) · can / could (xin, nhờ, khả năng)
 * · nối câu bằng `in that case`, `as soon as`.
 * Cảnh: Vân — sinh viên IT năm 3 — thực tập trao đổi 3 tháng ở một công ty phần mềm tại Auckland (New Zealand):
 * nghe máy hộ trưởng nhóm và ghi lời nhắn (nghe nhầm tên công ty, đọc sai số), gọi tổng đài nhà mạng đặt lịch lắp cáp quang
 * (thợ chỉ làm tới 4 rưỡi, thứ Bảy mất phí, cuộc gọi bị ngắt), để lại lời nhắn hộp thư rồi được gọi lại khi đang trên phà.
 * Khác podcast en-ds-a2-03 (Quỳnh đặt bàn nhà hàng + đặt lịch cắt tóc) và Ngày 7 (gọi phòng khám, hàng chờ tự động):
 * ở đây là nhận lời nhắn hộ, tổng đài dịch vụ, hộp thư thoại, gọi lại.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_9: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd9-nghe',
    kind: 'listening',
    title: 'Gọi điện: đặt lịch, để lại lời nhắn, nghe hộp thư',
    goal: 'Nghe hiểu ba cuộc gọi không thấy mặt: ai gọi, gọi cho ai, việc gì, số gọi lại, giờ hẹn; nhận ra lúc người nói quyết định ngay ("I\'ll…") và lúc họ xin, nhờ ("Can I…? / Could you…?").',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Vân**, sinh viên IT năm 3, đang thực tập trao đổi 3 tháng ở một công ty phần mềm tại **Auckland (New Zealand)**. Tuần thứ hai, Vân phải nghe và gọi điện nhiều hơn cô tưởng.',
          'Gọi điện khó hơn nói trực tiếp: **không thấy mặt, không thấy môi, không có cử chỉ**, tiếng rè, người ta nói nhanh. Mọi thứ dồn vào tai.',
          'Ba việc khó nhất của hôm nay: **nghe máy hộ và ghi lời nhắn**, **gọi tổng đài để đặt lịch**, **để lại lời nhắn ở hộp thư thoại** rồi nhận cuộc gọi lại.',
          'Mỗi cảnh bạn cần nghe ra 5 thứ: **ai gọi · gọi cho ai · việc gì · số gọi lại · khi nào**.',
          'Nối lại Ngày 2 (đánh vần, đọc số, "half two") và Ngày 7 (gọi phòng khám). Hôm nay câu dài hơn, nhanh hơn (khoảng 140 từ/phút) và có đoạn **tín hiệu chập chờn**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Nghe máy hộ trưởng nhóm: "Curry Freight"?' },
      {
        t: 'canh',
        anh: ['telephone-receiver', 'woman-technologist', 'office-building', 'memo', 'twelve-oclock'],
        caption: '12 giờ 40 trưa thứ Hai. Cả nhóm đi ăn, chỉ còn **Vân** ở bàn. Điện thoại bàn của trưởng nhóm **Aroha** reo mãi. Vân nhấc máy giúp.',
      },
      {
        t: 'listen',
        id: 'gtd9-nghe-canh1',
        title: 'Scene 1 — Taking a message',
        note: 'Nghe xem người gọi tên gì, ở công ty nào, muốn gì, và Vân đọc sai chỗ nào trong số điện thoại.',
        lines: [
          { who: 'Van', voice: 'us-nu', text: "Hello, this is Aroha Walker's phone. Van speaking.", vi: 'Alô, đây là máy của chị Aroha Walker. Vân nghe ạ.' },
          { who: 'Craig', voice: 'au-nam', text: "Oh, hi. Is Aroha around? It's Craig Dunn from Kauri Freight.", vi: 'À, chào em. Aroha có ở đó không? Anh là Craig Dunn ở Kauri Freight.' },
          { who: 'Van', voice: 'us-nu', text: "I'm sorry, she's at lunch at the moment. Sorry, was that Craig from… Curry Freight?", vi: 'Em xin lỗi, chị ấy đang đi ăn trưa. Xin lỗi, anh là Craig ở… Curry Freight ạ?' },
          { who: 'Craig', voice: 'au-nam', text: "Ha, no, not curry! Kauri. K-A-U-R-I. It's a big tree here in New Zealand.", vi: 'Ha, không, không phải cà ri! Kauri. K-A-U-R-I. Là một loài cây lớn ở New Zealand.' },
          { who: 'Van', voice: 'us-nu', text: 'Oh, sorry! Kauri Freight. Got it. Would you like to hold, or can I take a message?', vi: 'Ôi, em xin lỗi! Kauri Freight. Em nhớ rồi. Anh muốn chờ máy, hay để em ghi lời nhắn ạ?' },
          { who: 'Craig', voice: 'au-nam', text: "I'd better leave a message. She's meeting us on Thursday at ten, but I need to move it.", vi: 'Để anh nhắn lại thì hơn. Thứ Năm lúc mười giờ chị ấy họp với bên anh, nhưng anh cần dời buổi đó.' },
          { who: 'Van', voice: 'us-nu', text: 'Okay, so you want to move the Thursday meeting. Do you have another time in mind?', vi: 'Vâng, vậy là anh muốn dời buổi họp thứ Năm. Anh có nghĩ sẵn giờ khác chưa ạ?' },
          { who: 'Craig', voice: 'au-nam', text: 'Friday morning would be best. Any time before eleven. Could she give me a call back today?', vi: 'Sáng thứ Sáu là tốt nhất. Giờ nào trước mười một giờ cũng được. Chị ấy gọi lại cho anh trong hôm nay được không?' },
          { who: 'Van', voice: 'us-nu', text: "Sure. I'll ask her to call you as soon as she's back. What's the best number to reach you on?", vi: 'Dạ được. Chị ấy về là em nhờ chị gọi anh ngay. Số nào gọi anh tiện nhất ạ?' },
          { who: 'Craig', voice: 'au-nam', text: "My mobile. It's oh-two-two, four-one-eight, seven-three-oh-six.", vi: 'Số di động của anh. 022 418 7306.' },
          { who: 'Van', voice: 'us-nu', text: "Let me just check I've got that. Oh-two-two, four-one-eight, seven-three-six-oh?", vi: 'Để em kiểm lại xem em ghi đúng chưa. 022 418 7360 ạ?' },
          { who: 'Craig', voice: 'au-nam', text: 'Nearly. The end is seven-three-OH-six.', vi: 'Gần đúng. Đoạn cuối là bảy-ba-KHÔNG-sáu.' },
          { who: 'Van', voice: 'us-nu', text: 'Seven-three-oh-six. Sorry about that. And could you spell your surname for me?', vi: 'Bảy-ba-không-sáu. Em xin lỗi. Anh đánh vần giúp em họ của anh được không ạ?' },
          { who: 'Craig', voice: 'au-nam', text: 'D-U-double N. Dunn.', vi: 'D-U-hai chữ N. Dunn.' },
          { who: 'Van', voice: 'us-nu', text: "Perfect. So, Craig Dunn from Kauri Freight would like to move Thursday's meeting to Friday morning, before eleven, and could Aroha call you back today. Is that right?", vi: 'Tuyệt ạ. Vậy là anh Craig Dunn ở Kauri Freight muốn dời buổi họp thứ Năm sang sáng thứ Sáu, trước mười một giờ, và nhờ chị Aroha gọi lại cho anh trong hôm nay. Đúng không ạ?' },
          { who: 'Craig', voice: 'au-nam', text: "That's it exactly. Thanks, Van. You've been really helpful.", vi: 'Chính xác. Cảm ơn em, Vân. Em giúp anh nhiều lắm.' },
          { who: 'Van', voice: 'us-nu', text: "No problem. I'll leave a note on her desk, and I'll text her as well.", vi: 'Không có gì ạ. Em sẽ để giấy nhắn trên bàn chị ấy, và em nhắn tin cho chị ấy nữa.' },
          { who: 'Craig', voice: 'au-nam', text: 'Brilliant. Cheers. Bye now.', vi: 'Tuyệt. Cảm ơn nhé. Chào em.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd9-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Vân nói "Curry Freight"?',
            options: ['Craig nói sai tên công ty mình', 'Vân nghe nhầm "Kauri" thành "curry"', 'Công ty đó bán cà ri', 'Vân đùa cho vui'],
            correct: 1,
            why: '"Kauri" /ˈkaʊri/ nghe gần giống "curry" /ˈkɝːi/. Tên riêng lạ là thứ dễ nghe nhầm nhất. Vân làm đúng: **hỏi lại ngay** ("Sorry, was that…?") và Craig đánh vần: K-A-U-R-I.',
          },
          {
            q: 'Craig muốn gì?',
            options: ['Huỷ hẳn buổi họp', 'Dời buổi họp thứ Năm sang sáng thứ Sáu, trước 11 giờ', 'Dời buổi họp sang chiều thứ Năm', 'Gặp Aroha ngay trưa nay'],
            correct: 1,
            why: '"I need to **move** it" (dời) rồi "**Friday morning** would be best. Any time **before eleven**."',
          },
          {
            q: 'Vân đọc sai chỗ nào trong số điện thoại?',
            options: ['Ba số đầu 022', 'Ba số giữa 418', 'Bốn số cuối: 7360 thay vì 7306', 'Vân không đọc sai'],
            correct: 2,
            why: 'Craig sửa: "The end is seven-three-**OH**-six." Anh ấy **nhấn mạnh** đúng chữ số bị đọc sai. Nhờ Vân đọc lại mà lỗi được sửa ngay trên máy, không phải đợi Aroha gọi nhầm số.',
          },
          {
            q: 'Câu "I\'ll text her as well." cho thấy điều gì?',
            options: ['Vân đã định từ sáng là sẽ nhắn tin', 'Vân quyết định nhắn tin ngay lúc đang nói', 'Vân hứa nhắn tin vào ngày mai', 'Vân nhờ Craig nhắn tin'],
            correct: 1,
            why: '**I\'ll + V** dùng khi bạn **quyết định ngay lúc nói**, thường để giúp hoặc hứa. Đây là điểm ngữ pháp chính hôm nay.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Gọi tổng đài nhà mạng: đặt lịch lắp internet' },
      {
        t: 'canh',
        anh: ['house', 'globe-with-meridians', 'mobile-phone', 'spiral-calendar', 'man-construction-worker'],
        caption: 'Tối thứ Hai. Vân vừa chuyển vào một căn hộ ở chung ở khu **Mount Eden**. Nhà chưa có internet. Cô gọi tổng đài nhà mạng **Kiwinet** để đặt lịch thợ tới lắp cáp quang (**fibre**).',
      },
      {
        t: 'listen',
        id: 'gtd9-nghe-canh2',
        title: 'Scene 2 — Booking an installation',
        note: 'Nghe xem ngày giờ nào được chốt, ai sẽ mở cửa cho thợ, và chuyện gì xảy ra giữa cuộc gọi.',
        lines: [
          { who: 'Jono', voice: 'nz-nam', text: "Kia ora, you're through to Kiwinet. My name's Jono. How can I help you today?", vi: 'Xin chào, đây là tổng đài Kiwinet. Tôi là Jono. Hôm nay tôi giúp gì được cho chị?' },
          { who: 'Van', voice: 'us-nu', text: "Hi, Jono. I'd like to book a fibre installation for my new flat, please.", vi: 'Chào anh Jono. Tôi muốn đặt lịch lắp cáp quang cho căn hộ mới của tôi.' },
          { who: 'Jono', voice: 'nz-nam', text: 'Sweet, I can help with that. Can I get the address, please?', vi: 'Được thôi, tôi giúp chị việc đó. Cho tôi xin địa chỉ nhé.' },
          { who: 'Van', voice: 'us-nu', text: "It's flat two, twenty-seven Valley Road, Mount Eden.", vi: 'Căn hộ số 2, số 27 đường Valley, khu Mount Eden.' },
          { who: 'Jono', voice: 'nz-nam', text: "Flat two, twenty-seven Valley Road… Yep, that building's already fibre-ready, so it's a quick job. About an hour.", vi: 'Căn 2, số 27 Valley Road… Đúng rồi, toà đó đã sẵn đường cáp quang, nên làm nhanh thôi. Khoảng một tiếng.' },
          { who: 'Van', voice: 'us-nu', text: "Great. What's the earliest you can come?", vi: 'Tốt quá. Sớm nhất là khi nào bên anh tới được?' },
          { who: 'Jono', voice: 'nz-nam', text: "Let me have a look… The earliest is Tuesday the eighth, in the morning window. That's eight till twelve.", vi: 'Để tôi xem… Sớm nhất là thứ Ba ngày mùng 8, khung buổi sáng. Tức là từ tám giờ tới mười hai giờ.' },
          { who: 'Van', voice: 'us-nu', text: "Hmm, I'm at work then. Could the technician come after five?", vi: 'Hừm, giờ đó tôi đi làm. Thợ tới sau năm giờ được không anh?' },
          { who: 'Jono', voice: 'nz-nam', text: "Sorry, our technicians only work until half four on weekdays. We can do Saturdays, but there's a forty-nine-dollar fee.", vi: 'Xin lỗi chị, thợ bên tôi chỉ làm tới bốn rưỡi các ngày trong tuần. Thứ Bảy thì được, nhưng mất phí bốn mươi chín đô.' },
          { who: 'Van', voice: 'us-nu', text: "Oh. In that case, I'll take Tuesday morning. My flatmate works from home, so she can let him in.", vi: 'Ồ. Vậy thì tôi lấy sáng thứ Ba. Bạn cùng nhà tôi làm việc ở nhà, nên bạn ấy mở cửa cho thợ được.' },
          { who: 'Jono', voice: 'nz-nam', text: 'No worries. Can I put her down as the contact on the day? What was her name?', vi: 'Không vấn đề gì. Tôi ghi bạn ấy là người liên hệ hôm đó nhé? Bạn ấy tên gì?' },
          { who: 'Van', voice: 'us-nu', text: "It's Ella. E-double L-A. Sorry, Jono, you're breaking up a bit. Can you hear me?", vi: 'Ella. E-hai chữ L-A. Xin lỗi anh Jono, tiếng anh bị rè. Anh nghe tôi rõ không?' },
          { who: 'Jono', voice: 'nz-nam', text: "Sorry, you're… still there? If we get cut off, I'll call you straight back.", vi: 'Xin lỗi, chị… còn đó không? Nếu bị ngắt máy, tôi sẽ gọi lại cho chị ngay.' },
          { who: 'Van', voice: 'us-nu', text: 'Hello? Jono? …Oh no, I think I lost him.', vi: 'Alô? Anh Jono? …Ôi, chắc mất sóng rồi.' },
          { who: 'Jono', voice: 'nz-nam', text: "Hi, it's Jono from Kiwinet again. Sorry, we got cut off. So, Ella's the contact. You'll both get a text the day before with the technician's arrival time.", vi: 'Chào chị, lại là Jono ở Kiwinet đây. Xin lỗi, lúc nãy bị ngắt máy. Vậy là Ella sẽ là người liên hệ. Trước một ngày, cả hai sẽ nhận tin nhắn báo giờ thợ tới.' },
          { who: 'Van', voice: 'us-nu', text: 'Perfect. And could you send me the confirmation by email too?', vi: 'Tuyệt. Anh gửi giúp tôi xác nhận qua email nữa được không?' },
          { who: 'Jono', voice: 'nz-nam', text: 'Will do. Is there anything else I can help you with?', vi: 'Được ạ. Chị còn cần tôi giúp gì nữa không?' },
          { who: 'Van', voice: 'us-nu', text: "No, that's everything. Thanks for calling back, Jono.", vi: 'Không, vậy là đủ rồi. Cảm ơn anh đã gọi lại, Jono.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd9-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Vân không chọn thứ Bảy?',
            options: ['Thứ Bảy thợ không làm', 'Thứ Bảy phải trả thêm 49 đô', 'Thứ Bảy Vân đi làm', 'Thứ Bảy Ella không ở nhà'],
            correct: 1,
            why: '"We can do Saturdays, but **there\'s a forty-nine-dollar fee**." Vân nghe xong quyết định ngay: "**In that case, I\'ll take** Tuesday morning."',
          },
          {
            q: '"Our technicians only work until half four." Thợ làm tới mấy giờ?',
            options: ['3 giờ 30', '4 giờ', '4 giờ 30', '5 giờ'],
            correct: 2,
            why: 'Nhớ Ngày 2: **half + giờ** = giờ đó + 30 phút (kiểu Anh, Úc, New Zealand). half four = **4:30**, không phải 3:30.',
          },
          {
            q: 'Khi cuộc gọi bị ngắt, chuyện gì xảy ra?',
            options: ['Vân phải gọi lại từ đầu và chờ lâu', 'Jono gọi lại cho Vân như anh đã hứa', 'Hai người nói tiếp qua email', 'Lịch hẹn bị huỷ'],
            correct: 1,
            why: 'Trước khi mất sóng, Jono nói "If we get cut off, **I\'ll call you straight back**." Và anh gọi lại thật: "It\'s Jono from Kiwinet again. Sorry, **we got cut off**."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Hộp thư thoại, rồi cuộc gọi lại trên phà' },
      {
        t: 'canh',
        anh: ['speaker-high-volume', 'spiral-notepad', 'ferry', 'water-wave', 'mobile-phone'],
        caption: 'Thứ Tư. Vân cần **giấy xác nhận thực tập** để gửi về trường ở Việt Nam trước thứ Sáu. Cô gọi chị **Fiona** ở Văn phòng Quốc tế của trường đối tác nhưng gặp **hộp thư thoại**. Chiều hôm đó, khi Vân đang trên phà sang Devonport, điện thoại reo.',
      },
      {
        t: 'listen',
        id: 'gtd9-nghe-canh3',
        title: 'Scene 3 — Voicemail and a call back',
        note: 'Nghe lời chào của hộp thư: Fiona vắng tới khi nào? Rồi nghe lời nhắn Vân để lại có đủ 5 thứ chưa, và Tyler giải quyết thế nào.',
        lines: [
          { who: 'Voicemail', voice: 'uk-nu', text: "Hi, you've reached Fiona Shaw at the International Office. I'm away from my desk until Thursday the third. Please leave your name, your number and a short message after the tone, and I'll get back to you. If it's urgent, please call the main office on oh-nine, three-oh-two, one-one-eight-eight.", vi: 'Xin chào, bạn đã gọi tới Fiona Shaw ở Văn phòng Quốc tế. Tôi vắng mặt tới thứ Năm ngày mùng 3. Vui lòng để lại tên, số điện thoại và lời nhắn ngắn sau tiếng bíp, tôi sẽ liên lạc lại. Nếu việc gấp, xin gọi văn phòng chính số 09 302 1188.' },
          { who: 'Van', voice: 'us-nu', text: "Hi, Fiona. This is Van Nguyen, the exchange intern from Vietnam. I'm calling about my internship letter. My university needs it by Friday the fourth. Could you call me back when you get a chance? My number is oh-two-one, six-six-four, two-nine-five. Thanks so much. Bye.", vi: 'Chào chị Fiona. Em là Nguyễn Vân, thực tập sinh trao đổi từ Việt Nam. Em gọi về giấy xác nhận thực tập. Trường em cần giấy đó trước thứ Sáu ngày mùng 4. Khi nào tiện chị gọi lại cho em được không ạ? Số của em là 021 664 295. Cảm ơn chị nhiều. Em chào chị.' },
          { who: 'Tyler', voice: 'ca-nam', text: "Hi, is that Van? It's Tyler from the International Office. I'm calling about your message for Fiona.", vi: 'Chào, Vân phải không? Anh là Tyler ở Văn phòng Quốc tế. Anh gọi về lời nhắn em để lại cho Fiona.' },
          { who: 'Van', voice: 'us-nu', text: "Oh, hi, Tyler! Sorry, I'm on the ferry and it's really loud here. Could you speak up a little?", vi: 'Ồ, chào anh Tyler! Xin lỗi, em đang trên phà, ở đây ồn lắm. Anh nói to hơn một chút được không ạ?' },
          { who: 'Tyler', voice: 'ca-nam', text: 'Sure! Is this a good time? I can call back later if you like.', vi: 'Được chứ! Giờ em nói chuyện được không? Nếu em muốn thì lát anh gọi lại.' },
          { who: 'Van', voice: 'us-nu', text: "Actually, can I call you back in fifteen minutes? I'll be off the ferry by then.", vi: 'Thật ra, mười lăm phút nữa em gọi lại cho anh được không ạ? Lúc đó em xuống phà rồi.' },
          { who: 'Tyler', voice: 'ca-nam', text: "No problem. I'm here till five. Just call the main office and ask for Tyler.", vi: 'Không sao. Anh ở đây tới năm giờ. Em cứ gọi văn phòng chính và xin gặp Tyler.' },
          { who: 'Van', voice: 'us-nu', text: "Hi, could I speak to Tyler, please? It's Van Nguyen. I'm returning his call.", vi: 'Chào chị, cho em gặp anh Tyler được không ạ? Em là Nguyễn Vân. Em gọi lại cho anh ấy.' },
          { who: 'Tyler', voice: 'ca-nam', text: "Speaking! Thanks for calling back. So, Fiona's away, but I can do your letter. Can you come in and sign it tomorrow?", vi: 'Anh đây! Cảm ơn em đã gọi lại. Fiona đi vắng, nhưng anh làm giấy cho em được. Mai em qua ký được không?' },
          { who: 'Van', voice: 'us-nu', text: "Tomorrow? I'm working all day tomorrow. Could I come on Friday morning instead?", vi: 'Mai ạ? Mai em làm cả ngày. Em qua sáng thứ Sáu được không ạ?' },
          { who: 'Tyler', voice: 'ca-nam', text: "Friday's fine, but your uni needs it by Friday, right? Okay, I'll email you a PDF tonight, and you can sign the paper copy on Friday.", vi: 'Thứ Sáu được, nhưng trường em cần trước thứ Sáu đúng không? Thế này nhé, tối nay anh gửi email bản PDF cho em, rồi thứ Sáu em ký bản giấy.' },
          { who: 'Van', voice: 'us-nu', text: "That's perfect. Thank you so much, Tyler.", vi: 'Vậy thì tuyệt quá. Cảm ơn anh nhiều, Tyler.' },
          { who: 'Tyler', voice: 'ca-nam', text: "No worries. Anyway, I'll let you go. See you Friday!", vi: 'Không có gì. Thôi, anh không giữ em nữa. Hẹn thứ Sáu nhé!' },
          { who: 'Van', voice: 'us-nu', text: 'See you Friday. Bye!', vi: 'Hẹn anh thứ Sáu. Em chào anh!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd9-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Theo lời chào hộp thư, khi nào Fiona quay lại?',
            options: ['Thứ Tư', 'Thứ Năm ngày mùng 3', 'Thứ Sáu ngày mùng 4', 'Tuần sau'],
            correct: 1,
            why: '"I\'m away from my desk **until Thursday the third**." Lời chào hộp thư hay có 3 thứ: **vắng tới khi nào · để lại gì · việc gấp gọi ai**. Chỉ cần bắt đúng 3 thứ đó.',
          },
          {
            q: 'Vì sao Vân xin gọi lại sau 15 phút?',
            options: ['Cô đang bận họp', 'Cô đang trên phà, quá ồn', 'Điện thoại cô sắp hết pin', 'Cô chưa có thông tin Tyler cần'],
            correct: 1,
            why: '"I\'m **on the ferry** and **it\'s really loud** here." Ồn quá thì xin gọi lại với **giờ cụ thể** ("in fifteen minutes"), đừng cố nghe rồi đoán.',
          },
          {
            q: 'Cuối cùng giấy xác nhận được giải quyết thế nào?',
            options: ['Vân ký vào thứ Năm', 'Fiona gửi giấy về Việt Nam', 'Tối nay Tyler email bản PDF, thứ Sáu Vân ký bản giấy', 'Vân phải xin trường lùi hạn'],
            correct: 2,
            why: '"**I\'ll email you a PDF tonight**, and you can sign the paper copy on Friday." Lại một câu **I\'ll** quyết định ngay để giải quyết vấn đề.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Qua điện thoại, từ nhỏ như **I\'ll, can, you\'re** bị nói lướt rất nhanh. Bấm loa, nghe rồi gõ lại **đúng cả câu**. Số có thể gõ bằng chữ số. Viết hoa và dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd9-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — người nghe máy hộ đề nghị', spell: 'Would you like to hold, or can I take a message?', answer: 'Would you like to hold, or can I take a message?', alt: ['Would you like to hold or can I take a message?'] },
          { label: 'Câu 2 — hứa chuyển lời', spell: "I'll ask her to call you as soon as she's back.", answer: "I'll ask her to call you as soon as she's back.", alt: ['I will ask her to call you as soon as she is back.', "I'll ask her to call you as soon as she is back."] },
          { label: 'Câu 3 — số di động', spell: 'My mobile is oh-two-two, four-one-eight, seven-three-oh-six.', answer: 'My mobile is 022 418 7306.', alt: ['My mobile is 0224187306.', 'My mobile is 022-418-7306.', "My mobile's 022 418 7306.", 'My mobile is oh two two four one eight seven three oh six.'] },
          { label: 'Câu 4 — tín hiệu kém', spell: "Sorry, you're breaking up a bit.", answer: "Sorry, you're breaking up a bit.", alt: ['Sorry, you are breaking up a bit.'] },
          { label: 'Câu 5 — giờ làm của thợ', spell: 'Our technicians only work until half four.', answer: 'Our technicians only work until half four.', alt: ['Our technicians only work until half 4.', 'Our technicians only work till half four.'] },
          { label: 'Câu 6 — lời chào hộp thư', spell: 'Please leave your name and number after the tone.', answer: 'Please leave your name and number after the tone.' },
          { label: 'Câu 7 — gọi lại', spell: "Could I speak to Tyler, please? I'm returning his call.", answer: "Could I speak to Tyler, please? I'm returning his call.", alt: ['Could I speak to Tyler please? I am returning his call.', "Could I speak to Tyler please I'm returning his call"] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Is Aroha around?', 'Aroha có ở đó không? (**around** = có mặt quanh đây, không phải "xung quanh")', "I'm afraid she's not at her desk right now."],
          ["You're through to Kiwinet.", 'Bạn đã gọi được vào Kiwinet (tổng đài nói khi nhấc máy).', "Hi, I'd like to…"],
          ['Sweet. / Sweet as. (NZ, Úc)', 'Được, ổn, không vấn đề gì. Không liên quan tới "ngọt".', '(nói tiếp việc của bạn)'],
          ['Speaking!', 'Chính tôi đây. (khi bạn xin gặp đúng người đang nghe máy)', "Oh, hi! It's Van…"],
          ['Is this a good time?', 'Câu hỏi thật: bạn có rảnh nói chuyện không? Bận thì cứ nói thật.', 'Actually, can I call you back in ten minutes?'],
          ['Will do.', 'Tôi sẽ làm (= OK, I will do that). Câu hứa ngắn.', 'Thanks.'],
          ["Anyway, I'll let you go.", 'Thôi, tôi không giữ bạn nữa. = Tín hiệu **kết thúc cuộc gọi** lịch sự, không phải "để bạn đi đâu đó".', 'Thanks for calling. Bye!'],
          ["I'd better leave a message.", 'Tôi nhắn lại thì hơn (chờ máy sẽ lâu).', 'Sure. Go ahead.'],
        ],
        caption: 'Trên điện thoại, người ta **báo trước** khi kết thúc ("Anyway…", "I\'ll let you go", "Was there anything else?"). Nghe thấy các câu này thì chuẩn bị chào.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp qua điện thoại thì làm gì',
        items: [
          'Sóng kém thì **nói ngay**: "Sorry, you\'re breaking up." Đừng ậm ừ cho qua rồi ghi sai số.',
          'Người kia nói quá nhỏ, quá nhanh: "**Could you speak up a bit?**" (to hơn) · "**Could you say that a bit more slowly?**" (chậm hơn).',
          'Mọi **tên, số, ngày giờ**: đọc lại theo cụm. "Let me just check I\'ve got that: …" Người kia sẽ **nhấn đúng chỗ bạn sai**, như Craig nhấn "seven-three-**OH**-six".',
          'Đang ồn, đang bận: hẹn gọi lại với **giờ cụ thể**: "Can I call you back in fifteen minutes?" Nói "later" thì người kia không biết chờ tới bao giờ.',
          'Xin chuyển sang chữ: "**Could you text me that?**" · "**Could you send it by email?**" Không ai thấy phiền, và bạn có bản để đối chiếu.',
          'Trước khi nghe máy hộ, cầm sẵn bút và viết 5 ô: **Ai gọi · Cho ai · Việc gì · Số · Khi nào**. Nghe tới đâu điền tới đó.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Điện thoại di động', 'mobile', 'cell phone · cell', 'mobile'],
          ['Gọi cho ai', 'ring · give someone a ring / a bell', 'call · give someone a call', 'ring · give someone a call'],
          ['Máy bận', "It's engaged.", "It's busy.", "It's engaged."],
          ['Hộp thư thoại', 'voicemail · answerphone (máy bàn)', 'voicemail', 'voicemail · message bank (Úc)'],
          ['Bảo người kia chờ', 'Hold on. · Bear with me.', 'Hold on a sec.', 'Hang on a tick.'],
          ['Số 0 khi đọc số điện thoại', 'oh', 'zero (hay hơn) · oh', 'oh · zero'],
          ['Tổng đài miễn phí', '0800', '1-800', '0800 (NZ) · 1800 (Úc)'],
          ['Chào khi nhấc máy', 'Hello? · Hiya.', 'Hello? · Hey.', 'Hello? · Kia ora. (NZ)'],
        ],
        caption: '**Kia ora** là lời chào tiếng Māori, ở New Zealand dùng khắp nơi, cả ở tổng đài và email công sở. Bạn đáp "Hi" là đủ, hoặc chào lại "Kia ora" cũng được, người ta sẽ vui.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-a2-03 · Can I Book for Saturday?** — Quỳnh gọi đặt bàn mừng sinh nhật mẹ và đặt lịch cắt tóc: kín chỗ, chọn giờ khác, hỏi đổi lịch.',
          '**en-cv-b1-01 · Could You Send Me the Invoice?** — gọi điện và email công việc. Nghe khi tới chặng 3 (công sở).',
          'Hai tập là cảnh khác với bài hôm nay (đặt bàn, cắt tóc, hoá đơn). Nghe để gặp lại **I\'ll…, Can I…?, Could you…?** trong chuyện mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd9-noi',
    kind: 'speaking',
    title: 'Mở đầu – chuyển máy – kết thúc cuộc gọi',
    goal: 'Gọi đi và nghe máy trọn một cuộc gọi: mở đầu đúng kiểu điện thoại, xin gặp ai, bảo chờ, chuyển máy, nhận và để lại lời nhắn, xử lý khi rè hoặc mất sóng, rồi kết thúc lịch sự.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**Một cuộc gọi có 5 chặng**. Biết mình đang ở chặng nào thì luôn có sẵn câu để nói.',
          '**28 câu mẫu** chia theo chặng: mở đầu, nghe máy, nhận lời nhắn, khi có sự cố, kết thúc. Bấm loa, **nói to theo**.',
          'Ngữ pháp: **I\'ll + V** (quyết định ngay lúc nói) và **Can / Could…?** (xin, nhờ, nói khả năng). Nối câu: **in that case · as soon as**.',
          'Điện thoại có **ngôn ngữ cơ thể** riêng: mỉm cười khi nói, giơ một ngón tay "chờ chút", nghe máy giữa bữa ăn… Việt Nam và Anh – Mỹ – Nhật khác nhau ở đâu.',
          'Cuối bài bạn nhập vai **nghe máy hộ và ghi lời nhắn** với Gia sư AI, có cả đoạn "sóng kém".',
        ],
      },

      { t: 'h', text: '1. Một cuộc gọi đi qua 5 chặng' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Khung một cuộc gọi',
        caption: 'Chặng 4 (đọc lại) là chặng người Việt hay bỏ nhất, và cũng là chặng cứu bạn khỏi gọi nhầm số, đến nhầm giờ.',
        steps: [
          { label: 'Mở đầu: chào + mình là ai', sub: "Hi, this is Van from Tidewater." },
          { label: 'Lý do gọi', sub: "I'm calling about my internship letter." },
          { label: 'Xử lý: chuyển máy / nhắn / đặt lịch', sub: "I'll put you through. · Can I take a message?" },
          { label: 'Đọc lại thông tin', sub: "Let me just check I've got that…" },
          { label: 'Kết thúc', sub: "Thanks for calling. Bye now." },
        ],
      },

      { t: 'h', text: '2. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo thứ tự cuộc gọi. Mục nào có hai câu nối bằng " · " thì câu đầu trung tính, câu sau trang trọng hơn. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Hi, this is Van from Tidewater.', pos: 'phr', ipa: '/haɪ ðɪs ɪz væn frəm ˈtaɪdwɔːtər/', vi: 'Chào, tôi là Vân ở công ty Tidewater. (mở đầu khi gọi đi)', ex: "Hi, this is Van from Tidewater. I'm calling about the installation.", exVi: 'Chào anh, tôi là Vân ở Tidewater. Tôi gọi về việc lắp đặt.', more: 'Trên điện thoại nói **This is…** hoặc **It\'s…**, không nói "I am Van".', anh: 'telephone-receiver' },
          { w: 'Van speaking.', pos: 'phr', ipa: '/væn ˈspiːkɪŋ/', vi: 'Vân nghe. (nhấc máy ở công sở)', ex: 'Good morning, Tidewater Software, Van speaking.', exVi: 'Chào buổi sáng, Tidewater Software, Vân nghe ạ.' },
          { w: "I'm calling about…", pos: 'phr', ipa: '/aɪm ˈkɔːlɪŋ əˈbaʊt/', vi: 'Tôi gọi về việc…', ex: "I'm calling about my internship letter.", exVi: 'Tôi gọi về giấy xác nhận thực tập của tôi.', more: 'Nói lý do **ngay câu thứ hai**. Người nghe máy cần biết chuyển bạn cho ai.' },
          { w: 'Could I speak to Aroha, please?', pos: 'phr', ipa: '/kʊd aɪ ˈspiːk tu əˈroʊhə pliːz/', vi: 'Cho tôi gặp Aroha được không ạ?', ex: 'Hi, could I speak to Aroha Walker, please?', exVi: 'Chào chị, cho tôi gặp chị Aroha Walker được không ạ?', more: 'Thân hơn: **Is Aroha there?** · **Is Aroha around?**' },
          { w: 'Is this a good time?', pos: 'phr', ipa: '/ɪz ðɪs ə ˌɡʊd ˈtaɪm/', vi: 'Giờ anh/chị nói chuyện được không?', ex: "Hi, Tyler, it's Van. Is this a good time?", exVi: 'Chào anh Tyler, em Vân đây. Giờ anh nói chuyện được không?', more: 'Gọi điện thoại di động của ai đó thì hỏi câu này trước, nhất là ngoài giờ làm.' },
          { w: "Who's calling, please? · May I ask who's calling?", pos: 'phr', ipa: '/huːz ˈkɔːlɪŋ pliːz/', vi: 'Xin hỏi ai đang gọi ạ?', ex: "I'll see if she's free. May I ask who's calling?", exVi: 'Để tôi xem chị ấy có rảnh không. Xin hỏi ai đang gọi ạ?', more: '**Đừng** hỏi "Who are you?" (nghe như tra hỏi).' },
          { w: 'Speaking.', pos: 'phr', ipa: '/ˈspiːkɪŋ/', vi: 'Chính tôi đây.', ex: 'Could I speak to Tyler, please? — Speaking!', exVi: 'Cho tôi gặp Tyler được không? — Tôi đây!', more: 'Cũng được: **This is he / she** (rất trang trọng, kiểu Mỹ) · **That\'s me!** (thân).' },
          { w: 'Could you hold for a moment?', pos: 'phr', ipa: '/kʊdʒu ˈhoʊld fər ə ˈmoʊmənt/', vi: 'Anh/chị chờ máy một lát được không?', ex: "Could you hold for a moment? I'll check if she's free.", exVi: 'Anh chờ máy một lát nhé? Để tôi xem chị ấy có rảnh không.', more: 'Thân: **Hang on a sec.** Đừng nói "Please wait" (nghe như máy tự động).' },
          { w: "I'll put you through.", pos: 'phr', ipa: '/aɪl ˌpʊt ju ˈθruː/', vi: 'Tôi chuyển máy cho anh/chị.', ex: "One moment, I'll put you through to the repairs team.", exVi: 'Chờ một chút, tôi chuyển máy cho anh sang bộ phận sửa chữa.' },
          { w: "I'm afraid she's not at her desk.", pos: 'phr', ipa: '/aɪm əˈfreɪd ʃiz ˌnɑːt ət hər ˈdesk/', vi: 'Tiếc là chị ấy không có ở bàn.', ex: "I'm afraid she's not at her desk right now. She's at lunch.", exVi: 'Tiếc là chị ấy không có ở bàn. Chị ấy đi ăn trưa.', more: '**I\'m afraid…** = rất tiếc là… (báo tin không vui một cách lịch sự). Không có nghĩa là "tôi sợ".' },
          { w: "She's on another call.", pos: 'phr', ipa: '/ʃiz ɑːn əˌnʌðər ˈkɔːl/', vi: 'Chị ấy đang nghe một cuộc gọi khác.', ex: "She's on another call. Would you like to hold?", exVi: 'Chị ấy đang nghe máy khác. Anh muốn chờ không?' },
          { w: 'Can I take a message?', pos: 'phr', ipa: '/kən aɪ ˌteɪk ə ˈmesɪdʒ/', vi: 'Tôi ghi lời nhắn được không? (bạn nghe máy hộ)', ex: "She's in a meeting until three. Can I take a message?", exVi: 'Chị ấy họp tới ba giờ. Tôi ghi lời nhắn nhé?', more: 'Bạn là **người gọi**, muốn nhắn lại: **Can I leave a message?** (take = nhận, leave = để lại).' },
          { w: "I'll make sure she gets it.", pos: 'phr', ipa: '/aɪl ˌmeɪk ˈʃʊr ʃi ˈɡets ɪt/', vi: 'Tôi sẽ đảm bảo chị ấy nhận được (lời nhắn).', ex: "Thanks, Craig. I'll make sure she gets it.", exVi: 'Cảm ơn anh Craig. Tôi sẽ đảm bảo chị ấy nhận được.' },
          { w: "What's the best number to reach you on?", pos: 'phr', ipa: '/wʌts ðə ˌbest ˈnʌmbər tə ˈriːtʃ ju ɑːn/', vi: 'Số nào gọi anh/chị tiện nhất?', ex: "What's the best number to reach you on? — My mobile.", exVi: 'Số nào gọi anh tiện nhất? — Số di động của tôi.' },
          { w: "Let me just check I've got that.", pos: 'phr', ipa: '/ˌlet mi dʒʌst ˈtʃek aɪv ˈɡɑːt ðæt/', vi: 'Để tôi kiểm lại xem tôi ghi đúng chưa.', ex: "Let me just check I've got that: oh-two-two, four-one-eight…", exVi: 'Để tôi kiểm lại xem ghi đúng chưa: 022 418…', more: 'Ngày 2 đã có **Let me read that back.** Hai câu dùng thay nhau được.' },
          { w: "I'll ask her to call you back.", pos: 'phr', ipa: '/aɪl ˈæsk hər tə ˌkɔːl ju ˈbæk/', vi: 'Tôi sẽ nhờ chị ấy gọi lại cho anh/chị.', ex: "I'll ask her to call you back as soon as she's free.", exVi: 'Chị ấy rảnh là tôi nhờ chị ấy gọi lại cho anh ngay.' },
          { w: 'Could you call me back when you get a chance?', pos: 'phr', ipa: '/kʊdʒu ˌkɔːl mi ˈbæk wen ju ˌɡet ə ˈtʃæns/', vi: 'Khi nào tiện anh/chị gọi lại cho tôi được không?', ex: 'Could you call me back when you get a chance? My number is…', exVi: 'Khi nào tiện chị gọi lại cho em được không? Số của em là…', more: 'Câu chốt của mọi **lời nhắn hộp thư**.' },
          { w: "I'm returning your call.", pos: 'phr', ipa: '/aɪm rɪˈtɝːnɪŋ jər ˈkɔːl/', vi: 'Tôi gọi lại theo cuộc gọi nhỡ / lời nhắn của anh/chị.', ex: "Hi, it's Van Nguyen. I'm returning Tyler's call.", exVi: 'Chào chị, em là Nguyễn Vân. Em gọi lại cho anh Tyler.' },
          { w: "Sorry, you're breaking up.", pos: 'phr', ipa: '/ˈsɑːri jʊr ˌbreɪkɪŋ ˈʌp/', vi: 'Xin lỗi, tiếng bị rè / đứt quãng.', ex: "Sorry, you're breaking up. Can you hear me?", exVi: 'Xin lỗi, tiếng anh bị rè. Anh nghe tôi không?', anh: 'antenna-bars' },
          { w: 'Could you speak up a bit?', pos: 'phr', ipa: '/kʊdʒu ˌspiːk ˈʌp ə bɪt/', vi: 'Anh/chị nói to hơn một chút được không?', ex: "Could you speak up a bit? I'm on the ferry.", exVi: 'Anh nói to hơn chút được không? Em đang trên phà.', more: '**speak up** = nói to lên. Đừng nói "Speak louder!" (nghe như ra lệnh).' },
          { w: 'We got cut off.', pos: 'phr', ipa: '/wi ˌɡɑːt kʌt ˈɔːf/', vi: 'Cuộc gọi bị ngắt / mất sóng.', ex: "Sorry, we got cut off. Where were we?", exVi: 'Xin lỗi, lúc nãy bị ngắt máy. Mình đang nói tới đâu nhỉ?' },
          { w: "I'll call you straight back.", pos: 'phr', ipa: '/aɪl ˌkɔːl ju ˌstreɪt ˈbæk/', vi: 'Tôi gọi lại cho anh/chị ngay.', ex: "The line's terrible. I'll call you straight back.", exVi: 'Đường truyền tệ quá. Tôi gọi lại ngay.', more: 'Kiểu Mỹ hay nói: **I\'ll call you right back.**' },
          { w: 'Can I call you back in ten minutes?', pos: 'phr', ipa: '/kən aɪ ˌkɔːl ju ˈbæk ɪn ten ˈmɪnɪts/', vi: 'Mười phút nữa tôi gọi lại được không?', ex: "I'm on the bus. Can I call you back in ten minutes?", exVi: 'Tôi đang trên xe buýt. Mười phút nữa tôi gọi lại được không?' },
          { w: 'voicemail', pos: 'n', ipa: '/ˈvɔɪsmeɪl/', vi: 'hộp thư thoại; lời nhắn thoại', ex: 'I left you a voicemail this morning.', exVi: 'Sáng nay tôi có để lại lời nhắn thoại cho anh.', more: 'leave a voicemail · check your voicemail · go to voicemail (máy chuyển vào hộp thư)', anh: 'speaker-high-volume' },
          { w: 'after the tone', pos: 'phr', ipa: '/ˈæftər ðə ˈtoʊn/', vi: 'sau tiếng bíp', ex: 'Please leave a message after the tone.', exVi: 'Vui lòng để lại lời nhắn sau tiếng bíp.', more: 'Mỹ hay nói **after the beep**.' },
          { w: 'landline', pos: 'n', ipa: '/ˈlændlaɪn/', vi: 'điện thoại bàn, máy cố định', ex: 'You can also call me on the office landline.', exVi: 'Anh cũng có thể gọi tôi qua số máy bàn ở văn phòng.', anh: 'telephone' },
          { w: 'Is there anything else I can help with?', pos: 'phr', ipa: '/ɪz ðer ˈeniθɪŋ ˈels aɪ kən ˈhelp wɪð/', vi: 'Còn việc gì khác tôi giúp được không?', ex: 'Is there anything else I can help with? — No, that\'s everything.', exVi: 'Còn gì tôi giúp được nữa không? — Không, vậy là đủ rồi.', more: 'Câu này báo hiệu **sắp kết thúc**. Đáp: **No, that\'s everything / that\'s all, thanks.**' },
          { w: 'Thanks for calling. · Thanks for getting back to me.', pos: 'phr', ipa: '/θæŋks fər ˈkɔːlɪŋ/', vi: 'Cảm ơn đã gọi. · Cảm ơn đã gọi lại / trả lời tôi.', ex: 'Thanks for getting back to me so quickly. Bye now.', exVi: 'Cảm ơn anh đã gọi lại nhanh vậy. Chào anh.', more: '**Bye now** / **Bye-bye** nghe mềm hơn một chữ "Bye" cụt.' },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Gọi cho bạn cùng nhà khác hẳn gọi cho tổng đài hay khách hàng. Trên điện thoại, người ta **chỉ nghe được lời**, nên mức lịch sự nằm trọn trong chữ bạn chọn. Chưa chắc thì dùng cột **giữa**.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp, dịch vụ)', 'Trang trọng (khách, công sở)'],
        rows: [
          ['Nhấc máy', 'Hey! · Hello?', 'Hello, Van speaking.', 'Good morning, Tidewater Software, Van speaking. How can I help?'],
          ['Nói mình là ai', "Hey, it's Van.", 'Hi, this is Van.', 'Hello, my name is Van Nguyen. I\'m calling from Tidewater Software.'],
          ['Xin gặp ai', 'Is Ella there?', 'Can I speak to Ella?', 'Could I speak to Ms Walker, please?'],
          ['Hỏi ai gọi', '(thường thấy tên trên màn hình)', "Who's calling, please?", "May I ask who's calling?"],
          ['Bảo chờ', 'Hang on a sec.', 'Hold on a second.', 'Could you hold for a moment, please?'],
          ['Người cần gặp vắng', "She's out.", "She's not at her desk right now.", "I'm afraid she's unavailable at the moment."],
          ['Nhận lời nhắn', 'Want me to tell her?', 'Can I take a message?', 'Would you like to leave a message?'],
          ['Kết thúc', 'Okay, talk soon. Bye!', 'Thanks for calling. Bye.', 'Thank you for calling. Have a good afternoon.'],
        ],
        caption: 'Ở New Zealand và Úc, kể cả tổng đài cũng nói khá thân ("Sweet", "No worries"). Bạn không cần bắt chước, cột giữa luôn hợp.',
      },
      {
        t: 'note',
        title: 'Mẹo: "take" hay "leave" một lời nhắn?',
        items: [
          'Bạn **nghe máy hộ**, ghi lời nhắn cho người vắng: **Can I take a message?** (take = nhận).',
          'Bạn **là người gọi**, muốn nhắn lại: **Can I leave a message?** (leave = để lại).',
          'Tổng đài hỏi bạn: **Would you like to leave a message?** Đáp: **Yes, please.** rồi nói theo 5 ô: tên · công ty · việc · số · khi nào gọi lại.',
          'Lời nhắn hộp thư nên dưới **30 giây**. Đọc số điện thoại **hai lần**, lần hai chậm hơn.',
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Hôm nay có hai khung. **I\'ll + V**: bạn **quyết định ngay lúc đang nói**, thường để giúp, hứa, đề nghị ("Để em…"). **Can / Could + S + V…?**: xin phép, nhờ, hỏi khả năng. Gần như cả cuộc gọi của Vân chỉ dùng hai khung này.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: "S + 'll + V",
            vi: 'Quyết định ngay lúc nói: hứa, giúp, đề nghị. Tiếng Việt thường là "để em…", "em sẽ…".',
            examples: [
              { en: "I'll call you straight back.", vi: 'Tôi gọi lại ngay.' },
              { en: "I'll put you through.", vi: 'Tôi chuyển máy cho anh.' },
              { en: "I'll text her as well.", vi: 'Em nhắn tin cho chị ấy nữa.' },
            ],
          },
          {
            formula: "In that case, S + 'll + V",
            vi: 'Vừa nghe một thông tin mới, bạn chọn luôn.',
            examples: [
              { en: "In that case, I'll take Tuesday morning.", vi: 'Vậy thì tôi lấy sáng thứ Ba.' },
              { en: "Oh, she's busy? In that case, I'll leave a message.", vi: 'Ồ, chị ấy bận à? Vậy tôi để lời nhắn.' },
              { en: "In that case, I'll call back after lunch.", vi: 'Vậy thì tôi gọi lại sau bữa trưa.' },
            ],
          },
          {
            formula: "S + 'll + V … as soon as + S + V (hiện tại)",
            vi: 'Hứa làm ngay khi một việc khác xảy ra. Sau as soon as dùng **hiện tại**, không dùng will.',
            examples: [
              { en: "I'll ask her to call you as soon as she's back.", vi: 'Chị ấy về là tôi nhờ chị gọi anh ngay.' },
              { en: "I'll call you as soon as I get off the ferry.", vi: 'Xuống phà là em gọi anh ngay.' },
              { en: "I'll email you as soon as I hear from Fiona.", vi: 'Có tin của Fiona là tôi email cho bạn ngay.' },
            ],
          },
          {
            formula: 'Can I + V…?',
            vi: 'Xin phép hoặc đề nghị làm gì cho người kia.',
            examples: [
              { en: 'Can I take a message?', vi: 'Tôi ghi lời nhắn được không?' },
              { en: 'Can I call you back in fifteen minutes?', vi: 'Mười lăm phút nữa tôi gọi lại được không?' },
              { en: 'Can I put her down as the contact?', vi: 'Tôi ghi chị ấy là người liên hệ nhé?' },
            ],
          },
          {
            formula: 'Could you + V…?',
            vi: 'Nhờ người khác làm gì, lịch sự hơn Can you.',
            examples: [
              { en: 'Could you spell your surname for me?', vi: 'Anh đánh vần họ giúp tôi được không?' },
              { en: 'Could you speak up a little?', vi: 'Anh nói to hơn chút được không?' },
              { en: 'Could you send me the confirmation by email?', vi: 'Anh gửi xác nhận qua email cho tôi được không?' },
            ],
          },
          {
            formula: "S + can / can't + V",
            vi: 'Nói khả năng: làm được hay không.',
            examples: [
              { en: "I can't hear you very well.", vi: 'Tôi nghe anh không rõ lắm.' },
              { en: 'She can let him in.', vi: 'Chị ấy mở cửa cho thợ được.' },
              { en: 'Can you hear me now?', vi: 'Giờ anh nghe tôi được không?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu', 'Mức', 'Dùng khi'],
        rows: [
          ['Can I…? · Can you…?', 'thân, trung tính', 'Bạn bè, đồng nghiệp, việc nhỏ.'],
          ['Could I…? · Could you…?', 'lịch sự', 'Người lạ, khách, tổng đài, việc nhờ hơi phiền người kia.'],
          ['May I…?', 'trang trọng', 'Chỉ xin phép (May I ask who\'s calling?). Không dùng để nhờ: không nói "May you…?".'],
          ["Shall I…? (Anh) · Do you want me to…? (Mỹ)", 'đề nghị giúp', "Shall I ask her to call you? · Do you want me to tell her?"],
          ["I'll… · I won't…", 'hứa / quyết định', "I'll call you back. · I won't forget, I promise."],
        ],
        caption: '**Could** ở đây không phải quá khứ của can. Nó chỉ làm câu mềm hơn. Ngày 15 học bậc lịch sự cao hơn nữa: Would you mind…?',
      },
      {
        t: 'rule',
        formula: "I'll + V (quyết định ngay) · Can / Could + S + V…? (xin, nhờ) · as soon as + hiện tại",
        vi: 'Đang nói mà quyết định làm gì thì dùng I\'ll. Xin phép hay nhờ thì mở đầu bằng Can / Could. Sau as soon as dùng hiện tại: as soon as she\'s back, không phải "as soon as she will be back".',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: in that case · as soon as',
        items: [
          '**in that case** (vậy thì, nếu thế thì): nối thông tin người kia vừa nói với quyết định của bạn. "There\'s a fee on Saturdays." — "**In that case**, I\'ll take Tuesday."',
          '**as soon as** (ngay khi): nối hai việc, việc sau xảy ra ngay khi việc trước xong. "I\'ll call you **as soon as** I\'m off the ferry."',
          'Thân mật hơn in that case: **Then…** hoặc **Okay, so…** "Okay, so I\'ll take Tuesday then."',
          'Nhớ lại các từ nối đã học: **and** (N1), **or** (N2), **but / so** (N3), **when** (N7). Ghép thử: "She\'s at lunch, **so** I\'ll take a message, **and** I\'ll text her **as soon as** we hang up."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd9-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "I'll + V · Can I…? · Could you…? · in that case · as soon as",
        items: [
          { q: 'Để tôi chuyển máy cho anh.', hint: 'put through', answers: ["I'll put you through.", 'I will put you through.', "Let me put you through.", "I'll put you through now."] },
          { q: 'Anh đánh vần họ của anh giúp tôi được không?', hint: 'could you, spell, surname', answers: ['Could you spell your surname for me?', 'Could you spell your surname?', 'Could you spell your last name for me?', 'Could you spell your last name?', 'Could you spell your family name for me?', 'Could you spell your family name?', 'Could you spell your surname, please?'] },
          { q: 'Chị ấy về là tôi nhờ chị ấy gọi lại cho anh ngay.', hint: 'as soon as, ask her to call you', answers: ["I'll ask her to call you as soon as she's back.", "I'll ask her to call you back as soon as she's back.", "I will ask her to call you as soon as she is back.", "I'll ask her to call you as soon as she gets back.", "I'll ask her to call you back as soon as she gets back.", "As soon as she's back, I'll ask her to call you.", "As soon as she gets back, I'll ask her to call you."] },
          { q: 'Vậy thì tôi để lại lời nhắn.', hint: 'in that case, leave', answers: ["In that case, I'll leave a message.", "In that case I'll leave a message.", 'In that case, I will leave a message.', "In that case, can I leave a message?"] },
          { q: 'Xin lỗi, tôi nghe anh không rõ lắm.', hint: "can't hear, very well", answers: ["Sorry, I can't hear you very well.", "Sorry, I can't hear you very clearly.", "Sorry, I cannot hear you very well.", "Sorry, I can't hear you well."] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi gọi điện',
        items: [
          '~~Alo?~~ → **Hello?** · **Hello, Van speaking.** "Alo" là tiếng Việt (gốc Pháp "allô"). Người nước ngoài nghe không hiểu bạn đang nói gì.',
          '~~I am Van.~~ (khi nhấc máy / gọi đi) → **This is Van.** · **It\'s Van.** · **Van speaking.** Trên điện thoại, tự giới thiệu bằng **this is / it\'s**.',
          '~~Who are you?~~ → **Who\'s calling, please?** Câu đầu nghe như bạn đang tra hỏi kẻ lạ mặt.',
          '~~I call you back.~~ → **I\'ll call you back.** Thiếu \'ll thì thành câu thói quen ("tôi thường gọi lại cho bạn"). Hứa, quyết định ngay thì phải có **will**.',
          '~~Please wait.~~ → **Could you hold for a moment?** · **Hang on a sec.** "Please wait" nghe như máy trả lời tự động.',
          '~~She is not here. Call later.~~ → **I\'m afraid she\'s not at her desk right now. Can I take a message?** Câu cũ đúng nghĩa nhưng đẩy người gọi đi. Luôn đề nghị một cách giải quyết.',
          '~~Speak louder!~~ → **Could you speak up a bit?** Lỗi không nằm ở từ, nằm ở giọng ra lệnh. Qua điện thoại, giọng ra lệnh nghe còn gắt hơn nói trực tiếp.',
          '~~(cúp máy ngay sau "OK")~~ → **Okay, great. Thanks for calling. Bye now.** Người Việt hay cúp rất nhanh. Người Anh – Mỹ – Úc chào 2–3 câu rồi mới cúp, cúp ngay sau "OK" bị coi là cụt lủn.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi gọi điện' },
      {
        t: 'p',
        text: 'Người ở đầu dây không thấy bạn, nhưng **người xung quanh bạn** thì thấy, và giọng bạn đổi theo tư thế. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ quanh một cuộc gọi',
        items: [
          { anh: 'slightly-smiling-face', w: 'Hi, this is Van from Tidewater.', ro: '/haɪ ðɪs ɪz væn frəm ˈtaɪdwɔːtər/', vi: '**Mỉm cười khi nói**. Người nghe không thấy mặt nhưng nghe ra giọng ấm hơn, thân thiện hơn. Tổng đài viên được dạy đúng điều này.' },
          { anh: 'index-pointing-up', w: "(che micro) One sec, I'm on the phone.", ro: '', vi: 'Giơ **một ngón trỏ** với người đứng cạnh = "chờ chút, tôi đang nghe máy". Ở Anh, Mỹ, Úc ai cũng hiểu. Với sếp thì kèm một câu nhỏ "Sorry, one sec".' },
          { anh: 'call-me-hand', w: 'Give me a call later!', ro: '/ˌɡɪv mi ə ˈkɔːl ˈleɪtər/', vi: 'Ngón cái + ngón út giơ ra như cầm máy = "gọi cho tôi nhé". Dùng được ở Anh, Mỹ, Úc, New Zealand và cả Việt Nam.' },
          { anh: 'person-raising-hand', w: 'Sorry, I have to take this.', ro: '/ˈsɑːri aɪ ˈhæf tə ˈteɪk ðɪs/', vi: 'Đang họp, đang ăn mà **bắt buộc** phải nghe máy: xin phép một câu rồi **đứng dậy ra ngoài**. Nghe ngay tại bàn là thiếu tôn trọng người trước mặt.' },
          { anh: 'speaker-high-volume', w: 'Is it okay if I put you on speaker?', ro: '', vi: 'Muốn **bật loa ngoài** thì hỏi người ở đầu dây trước, và báo nếu trong phòng có người khác nghe cùng. Bật loa ngoài ở nơi công cộng bị coi là bất lịch sự.' },
          { anh: 'no-mobile-phones', w: "Sorry, I'm on the train. I'll call you back.", ro: '', vi: 'Ở **Nhật**, nói chuyện điện thoại trên tàu bị coi là bất lịch sự, máy để chế độ im lặng. Ở Anh, New Zealand thì được nhưng nói **nhỏ và ngắn**.' },
          { anh: 'mobile-phone-off', w: 'Sorry I missed your call. My phone was on silent.', ro: '', vi: 'Lỡ cuộc gọi công việc thì **gọi lại hoặc nhắn trong ngày**. Ở công sở phương Tây, để tới hôm sau mới hồi âm là chậm.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc · NZ', 'Nhật'],
        rows: [
          ['Câu đầu khi nhấc máy', '"Alo" rồi chờ người kia nói.', 'Ở công sở: tên công ty + tên mình ("Tidewater, Van speaking"). Ở nhà: "Hello?"', 'Ở công ty: tên công ty trước, rất lễ phép. Với người quen: "moshi moshi".'],
          ['Gọi bất ngờ hay nhắn trước', 'Gọi luôn là bình thường.', 'Nhiều người, nhất là người trẻ, **nhắn trước** ("Is it okay to call?") rồi mới gọi.', 'Công việc thường đặt lịch hoặc email trước.'],
          ['Nghe máy giữa bữa ăn, cuộc họp', 'Khá phổ biến, nghe ngay tại chỗ.', 'Xin phép rồi ra ngoài. Cả bữa cứ nghe máy là bất lịch sự.', 'Gần như không, trừ việc gấp, và luôn xin lỗi.'],
          ['Nói to nơi công cộng', 'Thường gặp.', 'Bị nhìn khó chịu, nhất là trên tàu, xe buýt yên tĩnh.', 'Tránh hẳn trên tàu.'],
          ['Hộp thư thoại', 'Ít ai dùng, ít ai nghe.', 'Công sở dùng nhiều. Không để lời nhắn thì nhiều người **không gọi lại số lạ**.', 'Dùng ở công sở.'],
        ],
        caption: 'Gọi một số lạ ở Anh, Mỹ, Úc mà không ai nghe: **để lời nhắn** hoặc **nhắn tin**. Nhiều người không nghe số lạ vì sợ cuộc gọi lừa đảo, nhưng sẽ gọi lại nếu biết bạn là ai.',
      },

      { t: 'h', text: '7. Phát âm: I\'ll, can / can\'t, nhấn chữ số khi sửa' },
      {
        t: 'p',
        text: 'Ba chỗ làm hỏng nghĩa qua điện thoại. **I\'ll** có âm /l/ ở cuối: nuốt mất là thành "I call you back" (sai ngữ pháp, sai nghĩa). **can** trong câu đọc nhẹ /kən/, còn **can\'t** đọc mạnh, nguyên âm dài: qua điện thoại, người nghe phân biệt hai từ nhờ **độ mạnh**, vì âm /t/ cuối gần như không bật. Khi sửa số, **nhấn mạnh đúng chữ số sai**.',
      },
      {
        t: 'phatam',
        id: 'gtd9-phat-am',
        title: 'Luyện phát âm — 8 câu điện thoại',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ âm /l/ trong I\'ll, đọc can thật nhẹ, can\'t thật rõ.',
        items: [
          { text: "I'll call you back.", ipa: 'aɪl kɔːl ju bæk', vi: 'I\'ll: cong lưỡi chạm nhẹ sau răng ở cuối, nghe như "ai-ồ" · back có /k/ cuối' },
          { text: 'I can hear you now.', ipa: 'aɪ kən hɪr ju naʊ', vi: 'can đọc nhẹ /kən/, gần như "cơn" · nhấn vào hear và now' },
          { text: "I can't hear you.", ipa: 'aɪ kænt hɪr ju', vi: 'can\'t nhấn mạnh, /æ/ mở miệng rộng (Anh: /kɑːnt/) · /t/ gần như không bật' },
          { text: 'Could you hold for a moment?', ipa: 'kʊdʒu hoʊld fər ə moʊmənt', vi: 'Could you nối thành /kʊdʒu/ "cu-chu" · hold có /ld/ cuối' },
          { text: 'Can I take a message?', ipa: 'kən aɪ teɪk ə mesɪdʒ', vi: 'Can‿I nối "cơ-nai" · message /ˈmesɪdʒ/ có hai âm tiết, âm cuối /dʒ/ như "ch" nhẹ, không đọc "mét-xây"' },
          { text: "Who's calling, please?", ipa: 'huːz kɔːlɪŋ pliːz', vi: 'who\'s và please đều kết thúc bằng /z/, rung cổ họng' },
          { text: 'Seven three OH six.', ipa: 'sevən θriː oʊ sɪks', vi: 'sửa số: nhấn mạnh và kéo dài chữ số bị đọc sai (OH), các số khác đọc bình thường' },
          { text: 'Thanks for calling. Bye now.', ipa: 'θæŋks fər kɔːlɪŋ baɪ naʊ', vi: 'xuống giọng ở cuối câu = tín hiệu kết thúc · for đọc nhẹ /fər/' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: gọi tiệm sửa máy tính' },
      {
        t: 'dialogue',
        title: 'Vân gọi tiệm sửa laptop hỏi máy sửa xong chưa',
        lines: [
          { who: 'Mel', role: 'b', text: 'Good afternoon, FixIt Laptops, Mel speaking.', vi: 'Chào buổi chiều, tiệm FixIt Laptops, Mel nghe ạ.' },
          { who: 'Van', role: 'a', text: "Hi, Mel. This is Van Nguyen. I'm calling about my laptop. I dropped it off on Monday.", vi: 'Chào chị Mel. Tôi là Nguyễn Vân. Tôi gọi về chiếc laptop tôi gửi hôm thứ Hai.' },
          { who: 'Mel', role: 'b', text: 'Sure. Can I get your job number?', vi: 'Vâng. Chị cho tôi xin mã phiếu sửa nhé.' },
          { who: 'Van', role: 'a', text: "Yes, it's four-four-seven-two.", vi: 'Vâng, là 4472.' },
          { who: 'Mel', role: 'b', text: "Thanks. Hang on, I'll check… Okay, the new screen has arrived, but it isn't fitted yet.", vi: 'Cảm ơn chị. Chờ chút, để tôi xem… À, màn hình mới về rồi, nhưng chưa lắp.' },
          { who: 'Van', role: 'a', text: 'Oh, okay. When do you think it will be ready?', vi: 'À, vâng. Chị nghĩ khi nào thì xong ạ?' },
          { who: 'Mel', role: 'b', text: 'Probably Thursday afternoon. Would you like me to put you through to the technician?', vi: 'Chắc chiều thứ Năm. Chị có muốn tôi chuyển máy cho thợ không?' },
          { who: 'Van', role: 'a', text: "No, that's fine. Could you just text me when it's ready?", vi: 'Không cần đâu ạ. Chị nhắn tin cho tôi khi xong là được.' },
          { who: 'Mel', role: 'b', text: "Will do. What's the best number for you?", vi: 'Được ạ. Số nào tiện cho chị nhất?' },
          { who: 'Van', role: 'a', text: "It's oh-two-one, six-six-four, two-nine-five.", vi: 'Số 021 664 295.' },
          { who: 'Mel', role: 'b', text: 'Oh-two-one, six-six-four, two-nine-five. Got it.', vi: '021 664 295. Tôi ghi rồi.' },
          { who: 'Van', role: 'a', text: "Great. In that case, I'll pick it up on Friday morning. Thanks, Mel.", vi: 'Tuyệt. Vậy thì sáng thứ Sáu tôi qua lấy. Cảm ơn chị Mel.' },
          { who: 'Mel', role: 'b', text: 'No problem. Thanks for calling. Bye now.', vi: 'Không có gì. Cảm ơn chị đã gọi. Chào chị.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd9-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Vân (5 câu)',
        items: [
          { vi: 'Mel nhấc máy → Bạn: Chào chị, tôi là Vân. Tôi gọi về chiếc laptop của tôi.', chips: ['Hi,', 'this', 'is', 'Van.', "I'm", 'calling', 'about', 'my', 'laptop.', 'am', 'for'], answer: ['Hi,', 'this', 'is', 'Van.', "I'm", 'calling', 'about', 'my', 'laptop.'] },
          { vi: 'Mel: "It isn\'t fitted yet." → Bạn: Chị nghĩ khi nào thì xong?', chips: ['When', 'do', 'you', 'think', 'it', 'will', 'be', 'ready?', 'does', 'is'], answer: ['When', 'do', 'you', 'think', 'it', 'will', 'be', 'ready?'] },
          { vi: 'Mel: "Shall I put you through?" → Bạn: Không cần ạ. Chị nhắn tin cho tôi khi xong được không?', chips: ["No,", "that's", 'fine.', 'Could', 'you', 'text', 'me', 'when', "it's", 'ready?', 'will', 'can'], answer: ["No,", "that's", 'fine.', 'Could', 'you', 'text', 'me', 'when', "it's", 'ready?'] },
          { vi: 'Mel: "Probably Thursday." → Bạn: Vậy thì sáng thứ Sáu tôi qua lấy.', chips: ['In', 'that', 'case,', "I'll", 'pick', 'it', 'up', 'on', 'Friday', 'morning.', 'I', 'at'], answer: ['In', 'that', 'case,', "I'll", 'pick', 'it', 'up', 'on', 'Friday', 'morning.'] },
          { vi: 'Tiếng rè → Bạn: Xin lỗi, tiếng chị bị rè. Tôi gọi lại ngay.', chips: ['Sorry,', "you're", 'breaking', 'up.', "I'll", 'call', 'you', 'straight', 'back.', 'broken', 'I'], answer: ['Sorry,', "you're", 'breaking', 'up.', "I'll", 'call', 'you', 'straight', 'back.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd9-noi-tra-loi',
        part: '1',
        questions: [
          'Do you prefer calling or texting? Why?',
          'How often do you make phone calls in English?',
          'What do you say when you can\'t hear the other person?',
          'Tell me about a phone call that went wrong.',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn. Cầm sẵn giấy bút để ghi lời nhắn.',
          '"You are Craig, a client from a freight company in Auckland. You call my team leader, Aroha, but I answer her phone because she is at lunch. Speak at natural speed (B1 level). Give me your full name, your company name (spell it only if I ask), a mobile number and a message about moving a meeting. Twice during the call, pretend the line is bad and say \'Sorry, you\'re breaking up\'. Wait for me to read the details back. If I get a number wrong, correct me by stressing the wrong digit. After about 10 turns, end the call politely. Then tell me in Vietnamese two things I did well and two things to fix, especially whether I used I\'ll, Can I…? and Could you…? correctly."',
          'Lượt hai **đổi vai**: AI là hộp thư thoại của một văn phòng, bạn để lại lời nhắn dưới 30 giây (tên · việc · hạn · số · nhờ gọi lại). Sau đó AI gọi lại khi bạn "đang trên xe buýt" và bạn phải hẹn gọi lại với giờ cụ thể.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd9-doc',
    kind: 'reading',
    title: 'Lời nhắn thoại chép lại, thông báo lịch hẹn',
    goal: 'Đọc hiểu giấy ghi lời nhắn, bản chép lời nhắn thoại tự động (có lỗi), tin nhắn đặt lịch và email đổi lịch hẹn; biết việc mình phải làm tiếp và hạn chót; chuyển một lời nhắn thoại thành giấy nhắn gọn.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn mẩu chữ **thật** quanh các cuộc gọi của Vân: giấy nhắn để trên bàn Aroha, bản chép lời nhắn thoại do điện thoại tự tạo, tin nhắn xác nhận lịch của nhà mạng, email của Văn phòng Quốc tế.',
          'Mỗi mẩu, tìm cho ra: **ai · việc gì · khi nào · bạn phải làm gì tiếp**.',
          'Bản chép tự động hay **nghe sai tên riêng, tiếng Māori, con số**. Bạn tập đoán lại chữ đúng.',
          'Học các cụm cố định của tin hẹn lịch: booked for · reply Y to confirm · has been moved to · at least 24 hours in advance.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['memo', 'speaker-high-volume', 'mobile-phone', 'e-mail'],
        caption: 'Tuần đầu tháng 12 của Vân: một giấy nhắn cô viết, một lời nhắn thoại cô nhận, một tin nhắn và một email về lịch hẹn.',
      },
      {
        t: 'passage',
        title: "Van's week — a message slip, a voicemail, a text and an email",
        intro: 'Đọc lướt một lượt để biết mỗi mẩu là gì, rồi đọc kỹ từng mẩu khi làm câu hỏi. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**WHILE YOU WERE OUT** — For: Aroha · Date: Mon 30 Nov · Time: 12:45 pm · From: Craig Dunn, Kauri Freight · Tel: 022 418 7306 · ☑ **Please call back** ☐ **Will call again** ☐ **Returned your call** · Message: Wants to **move** Thursday\'s 10 am meeting to **Fri am** (any time before 11). Please call him **today if possible**. I\'ve texted you too. — Van',
          },
          {
            label: 'B',
            text: '**Voicemail** from 027 553 9140 · Mon 7 Dec, 5:12 pm · 0:41 · **Transcription (beta)**: "Hi, this is Dave, your **Kiwi net** technician for tomorrow at Valley Road. Just **letting you know** I\'ll be there between nine and ten, not eight, because my first job **ran over**. If that doesn\'t **suit**, give us a ring on this number. Otherwise, **see you then**. Cheers, **car Katie**."',
          },
          {
            label: 'C',
            text: '**Text from Kiwinet** · Mon 7 Dec, 6:00 pm: "Hi Van, your fibre installation is **booked for** Tue 8 Dec, 8am–12pm, at 2/27 Valley Rd, Mt Eden. **On-site contact**: Ella. Your technician is Dave. **Reply Y to confirm** or **R to reschedule**. Questions? Call 0800 549 xxx. **Txt STOP to opt out**."',
          },
          {
            label: 'D',
            text: '**Email** · From: Tyler Morgan, International Office · Subject: **Change to your appointment** — Dear Van, **As discussed on the phone**, your appointment to sign your internship letter **has been moved from** Thursday 3 December **to** Friday 4 December at 9:30 am, Room 208, Level 2. **Please bring photo ID.** A PDF copy of the letter is **attached** for your university. **If this time no longer suits**, please reply **at least 24 hours in advance**. Kind regards, Tyler Morgan',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd9-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Trên giấy nhắn (A), ô "Please call back" được đánh dấu. Aroha cần làm gì?',
            options: ['Chờ Craig gọi lại', 'Gọi lại cho Craig', 'Không cần làm gì, Craig đã gọi lại rồi', 'Email cho Craig'],
            correct: 1,
            why: '**Please call back** = người nhận phải gọi lại. **Will call again** = người gọi sẽ tự gọi lại. **Returned your call** = họ gọi lại theo cuộc gọi trước của bạn.',
          },
          {
            q: '"Fri am" trên giấy nhắn nghĩa là gì?',
            options: ['Thứ Sáu, sáng', 'Thứ Sáu, tôi là…', 'Thứ Sáu, cả ngày', 'Sáng thứ Năm'],
            correct: 0,
            why: 'Viết tắt trong giấy nhắn: **Fri** = Friday, **am** = buổi sáng (trước 12 giờ trưa). Giấy nhắn viết gọn, bỏ chủ ngữ ("Wants to move…").',
          },
          {
            q: 'Trong (B), vì sao thợ Dave tới muộn hơn?',
            options: ['Anh ấy bị ốm', 'Việc đầu tiên của anh ấy kéo dài hơn dự kiến', 'Ella không có nhà', 'Anh ấy nhầm địa chỉ'],
            correct: 1,
            why: '**ran over** = (việc, cuộc họp) kéo dài quá giờ dự kiến. "My first job **ran over**."',
          },
          {
            q: 'Bản chép tự động ghi "car Katie" ở cuối. Dave thật ra nói gì?',
            options: ['Tên vợ anh ấy', '"Ka kite", lời chào tạm biệt tiếng Māori', '"Carry it", mang đồ theo', 'Tên một hãng xe'],
            correct: 1,
            why: '**Ka kite** (tiếng Māori) = hẹn gặp lại, ở New Zealand hay dùng cuối cuộc gọi, cuối email. Máy chép tự động không biết tiếng Māori nên chép thành chữ tiếng Anh nghe giống. Tương tự "Kiwi net" = tên hãng Kiwinet.',
          },
          {
            q: 'Dave nói "If that doesn\'t suit, give us a ring." Nghĩa là gì?',
            options: ['Nếu giờ đó không hợp, gọi cho anh ấy', 'Nếu thiếu đồ, mua thêm', 'Nếu không mặc vừa, đổi lại', 'Gọi trước khi mặc đồ'],
            correct: 0,
            why: '**suit** (động từ) = hợp với lịch của bạn. **give us a ring** = gọi cho chúng tôi (kiểu Anh, Úc, NZ). "us" ở đây là "tôi / bên tôi".',
          },
          {
            q: 'Ella là ai, theo tin nhắn (C)?',
            options: ['Thợ lắp đặt', 'Nhân viên tổng đài', 'Người có mặt ở nhà để làm việc với thợ', 'Chủ nhà'],
            correct: 2,
            why: '**On-site contact** = người liên hệ có mặt tại chỗ. Trong cảnh 2, Vân đã ghi Ella vì Ella làm việc ở nhà.',
          },
          {
            q: 'Vân muốn giữ lịch hẹn ngày 8. Cô nên trả lời tin nhắn (C) thế nào?',
            options: ['Gõ R', 'Gõ Y', 'Gõ STOP', 'Gọi 0800'],
            correct: 1,
            why: '**Reply Y to confirm** (gõ Y để xác nhận). R = reschedule (đổi lịch). STOP = không nhận tin quảng cáo nữa (**opt out**), không liên quan lịch hẹn.',
          },
          {
            q: 'Theo email (D), muốn đổi giờ ký giấy thì Vân phải làm gì?',
            options: ['Gọi cho Fiona', 'Trả lời email trước ít nhất 24 giờ', 'Tới thẳng phòng 208', 'Không đổi được nữa'],
            correct: 1,
            why: '"If this time no longer suits, please reply **at least 24 hours in advance**." Giọng email lịch sự, trung tính: Dear + tên, As discussed…, Please…, Kind regards.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp trong lời nhắn và tin hẹn lịch' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['While you were out', 'Trong lúc bạn vắng mặt (tiêu đề giấy nhắn)', 'Giấy nhắn ở văn phòng'],
          ['Please call back · Will call again', 'Xin gọi lại · Họ sẽ gọi lại', 'Giấy nhắn'],
          ['Just letting you know…', 'Báo để bạn biết…', 'Lời nhắn thoại, tin nhắn thân'],
          ["If that doesn't suit, …", 'Nếu (giờ đó) không hợp, …', 'Lời nhắn, email'],
          ['give us a ring · give me a call', 'gọi cho tôi / bên tôi', 'Lời nhắn thoại'],
          ['booked for + ngày giờ', 'đã được đặt vào…', 'Tin nhắn xác nhận'],
          ['Reply Y to confirm', 'Gõ Y để xác nhận', 'Tin nhắn tự động'],
          ['has been moved / rescheduled to…', 'đã được dời sang…', 'Email đổi lịch'],
          ['As discussed on the phone, …', 'Như đã trao đổi qua điện thoại, …', 'Email sau cuộc gọi'],
          ['at least 24 hours in advance', 'trước ít nhất 24 giờ', 'Quy định đổi / huỷ lịch'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc bản chép lời nhắn thoại tự động',
        items: [
          'Máy chép đúng **câu thường**, hay sai **tên riêng, tên hãng, tiếng địa phương, con số**. Chỗ nào nghe vô lý ("car Katie"), đọc to lên xem nó giống từ gì.',
          'Luôn **mở nghe lại** đoạn có số điện thoại hoặc giờ hẹn. Đừng tin số trong bản chép khi chưa nghe.',
          'Lời nhắn thoại công việc gần như luôn theo thứ tự: **ai → việc gì → bạn cần làm gì → số gọi lại → chào**. Tìm đúng 5 chỗ đó.',
          'Muốn trả lời nhanh mà không gọi được (đang họp, đang ồn): nhắn tin lại số đó: "Hi Dave, got your message. 9–10 is fine. Thanks!"',
        ],
      },

      { t: 'h', text: '3. Chép lời nhắn thoại thành giấy nhắn' },
      {
        t: 'p',
        text: 'Đọc lời nhắn thoại để lại cho **Aroha** dưới đây, rồi điền giấy nhắn. Viết gọn như mẫu A: không cần câu đầy đủ.',
      },
      {
        t: 'examples',
        items: [
          { en: '"Hi Aroha, it\'s Priya Shah from the Wellington office. Just letting you know the training on Wednesday has been moved to Thursday at two. Could you give me a call back on oh-four, four-seven-one, two-two-nine-oh before Tuesday? Thanks, bye."', vi: 'Lời nhắn thoại cho Aroha (Wellington có mã vùng 04).' },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd9-doc-dien-giay',
        title: 'Điền giấy nhắn (5 câu)',
        kind: 'fill',
        items: [
          { q: 'From: Priya Shah, ___ office', answers: ['Wellington'] },
          { q: 'Tel: ___', answers: ['04 471 2290', '044712290', '04-471-2290', '(04) 471 2290'] },
          { q: 'Training: moved from Wed to ___ at 2 pm', answers: ['Thu', 'Thursday'] },
          { q: 'Tick one box: ☐ Please call back ☐ Will call again → ___', answers: ['Please call back', 'please call back'] },
          { q: 'Call back by: before ___', answers: ['Tue', 'Tuesday'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd9-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 9',
    goal: 'Làm 34 câu có đáp án để nhớ chắc cách mở đầu, chuyển máy, nhận và để lại lời nhắn, xử lý khi rè, kết thúc cuộc gọi; dùng đúng I\'ll và Can / Could.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu. Có vài câu ôn Ngày 2, 7, 8.',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**, như đang cầm máy.',
          'Phần dịch chấp nhận nhiều cách nói (I\'ll = I will). Dấu câu, viết hoa không tính.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 10.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd9-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn nhấc điện thoại bàn ở công ty. Câu nào hợp nhất?',
            options: ['Alo?', 'Who are you?', 'Good morning, Tidewater Software, Van speaking.', 'I am Van. What do you want?'],
            correct: 2,
            why: 'Ở công sở: **tên công ty + tên mình + speaking**. "Alo" là tiếng Việt, "Who are you?" và "What do you want?" nghe như tra hỏi.',
          },
          {
            q: 'Người gọi xin gặp sếp bạn, nhưng chị ấy đang họp. Bạn nói:',
            options: ["She's busy. Call later.", "I'm afraid she's in a meeting. Can I take a message?", "She's not here. Bye.", 'Please wait one hour.'],
            correct: 1,
            why: 'Báo tin không vui bằng **I\'m afraid…** rồi **đề nghị giải quyết**: Can I take a message?',
          },
          {
            q: 'Bạn gọi đi và muốn để lại lời nhắn. Bạn hỏi:',
            options: ['Can I take a message?', 'Can I leave a message?', 'Can you leave me a message?', 'Can I make a message?'],
            correct: 1,
            why: 'Người gọi **leave** (để lại) lời nhắn. Người nghe máy hộ **take** (nhận) lời nhắn.',
          },
          {
            q: 'Tiếng người kia bị đứt quãng. Bạn nói:',
            options: ["Sorry, you're breaking up.", 'Your phone is broken.', 'Sorry, you are breaking.', "You're cutting."],
            correct: 0,
            why: '**You\'re breaking up** = tiếng bạn bị rè / đứt quãng. Cụm cố định, không đổi từ.',
          },
          {
            q: 'Người kia nói: "There\'s a forty-dollar fee for Saturdays." Bạn quyết định chọn thứ Hai. Câu nào đúng?',
            options: ["In that case, I take Monday.", "In that case, I'll take Monday.", "In that case, I'm going to took Monday.", "In that case, I taking Monday."],
            correct: 1,
            why: 'Quyết định **ngay lúc nói** → **I\'ll + V**. "In that case" nối thông tin vừa nghe với quyết định của bạn.',
          },
          {
            q: 'Câu nào đúng ngữ pháp?',
            options: ["I'll call you as soon as I will arrive.", "I'll call you as soon as I arrive.", 'I call you as soon as I arrive.', "I'll calling you as soon as I arrive."],
            correct: 1,
            why: 'Sau **as soon as** dùng **hiện tại** (I arrive), vế chính dùng **I\'ll**.',
          },
          {
            q: 'Bạn đang trên xe buýt rất ồn thì đồng nghiệp gọi. Bạn nói:',
            options: ['Speak louder!', 'Can I call you back in ten minutes? I\'m on the bus.', "I can't. Bye.", 'Call me later.'],
            correct: 1,
            why: 'Hẹn gọi lại với **giờ cụ thể** và nói lý do ngắn. "Call me later" bắt người kia phải gọi lại, mà không biết là bao giờ.',
          },
          {
            q: 'Trong cảnh 3, lời chào hộp thư nói: "If it\'s urgent, please call the main office." Nghĩa là:',
            options: ['Mọi cuộc gọi phải qua văn phòng chính', 'Việc gấp thì gọi văn phòng chính', 'Văn phòng chính đã đóng cửa', 'Fiona đang ở văn phòng chính'],
            correct: 1,
            why: '**urgent** = gấp. Lời chào hộp thư hay cho một số khác để gọi khi việc gấp.',
          },
          {
            q: '(Ôn Ngày 7) Đồng nghiệp ho cả tuần. Bạn khuyên:',
            options: ['You should to see a doctor.', 'You should see a doctor.', 'You should seeing a doctor.', 'You must to see a doctor.'],
            correct: 1,
            why: '**should + V nguyên mẫu**, không có "to".',
          },
          {
            q: '(Ôn Ngày 8) Bạn gọi chủ nhà báo vòi nước đang rò. Câu nào đúng?',
            options: ['The tap leaks now.', 'The tap is leaking.', 'The tap leaking.', 'There is leaking the tap.'],
            correct: 1,
            why: 'Việc **đang xảy ra ngay lúc này** → hiện tại tiếp diễn: **is leaking**.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd9-bt-dien',
        title: "Phần II — Điền 'll / can / could / take / leave / through / back (7 câu)",
        kind: 'fill',
        grammar: "I'll + V · Can / Could…? · take / leave a message · put through · call back",
        items: [
          { q: "Hold on, I___ put you through. (một chữ, viết tắt)", answers: ["'ll", 'll', '’ll'] },
          { q: '___ you spell that for me, please? (lịch sự)', answers: ['Could', 'Would'] },
          { q: "She's on another call. Can I ___ a message? (bạn nghe máy hộ)", answers: ['take'] },
          { q: "She's not answering. Can I ___ a message? (bạn là người gọi)", answers: ['leave'] },
          { q: "One moment. I'll put you ___ to the sales team.", answers: ['through'] },
          { q: "I'm returning your call. You left me a voicemail, so I'm calling you ___.", answers: ['back'] },
          { q: "Sorry, I ___ hear you very well. It's really noisy here. (phủ định)", answers: ["can't", 'cannot', 'can’t'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd9-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "This is… · I'm calling about… · I'll… · Could you…? · as soon as",
        items: [
          { q: '(Gọi đi) Chào chị, tôi là Vân ở công ty Tidewater.', hint: 'this is, from', answers: ['Hi, this is Van from Tidewater.', "Hi, it's Van from Tidewater.", 'Hello, this is Van from Tidewater.', "Hello, it's Van from Tidewater.", 'Hi, this is Van from Tidewater Software.', "Hi, it's Van from Tidewater Software."] },
          { q: 'Tôi gọi về lịch lắp internet.', hint: "I'm calling about, installation", answers: ["I'm calling about the internet installation.", "I'm calling about my internet installation.", 'I am calling about the internet installation.', "I'm calling about the installation.", "I'm calling about the fibre installation.", "I'm calling about my fibre installation."] },
          { q: 'Xin hỏi ai đang gọi ạ? (trang trọng)', hint: 'may I ask', answers: ["May I ask who's calling?", 'May I ask who is calling?', "May I ask who's calling, please?"] },
          { q: 'Số nào gọi anh tiện nhất?', hint: 'best number, reach you', answers: ["What's the best number to reach you on?", 'What is the best number to reach you on?', "What's the best number to reach you?", "What's the best number for you?", 'What is the best number to reach you?'] },
          { q: 'Xuống phà là tôi gọi lại cho anh ngay.', hint: 'as soon as, get off the ferry', answers: ["I'll call you back as soon as I get off the ferry.", "I'll call you as soon as I get off the ferry.", 'I will call you back as soon as I get off the ferry.', "As soon as I get off the ferry, I'll call you back.", "As soon as I get off the ferry, I'll call you.", "I'll call you back as soon as I'm off the ferry.", "I'll call you as soon as I'm off the ferry."] },
          { q: 'Anh gửi xác nhận qua email cho tôi được không?', hint: 'could you, confirmation, by email', answers: ['Could you send me the confirmation by email?', 'Could you send me the confirmation by email, please?', 'Could you email me the confirmation?', 'Could you please send me the confirmation by email?', 'Could you send the confirmation to me by email?', 'Could you email me the confirmation, please?'] },
          { q: 'Cảm ơn anh đã gọi lại.', hint: 'thanks for', answers: ['Thanks for calling back.', 'Thanks for calling me back.', 'Thank you for calling back.', 'Thank you for calling me back.', 'Thanks for getting back to me.', 'Thank you for getting back to me.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd9-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I'm afraid she's not at her desk right now.", answer: "I'm afraid she's not at her desk right now.", alt: ['I am afraid she is not at her desk right now.', "I'm afraid she's not at her desk right now"] },
          { label: 'Câu 2', spell: 'Could you hold for a moment, please?', answer: 'Could you hold for a moment, please?', alt: ['Could you hold for a moment please?'] },
          { label: 'Câu 3', spell: "We got cut off. I'll call you straight back.", answer: "We got cut off. I'll call you straight back.", alt: ['We got cut off. I will call you straight back.', "We got cut off I'll call you straight back"] },
          { label: 'Câu 4 — số điện thoại', spell: 'My number is oh-two-one, six-six-four, two-nine-five.', answer: 'My number is 021 664 295.', alt: ['My number is 021664295.', 'My number is 021-664-295.', "My number's 021 664 295.", 'My number is oh two one six six four two nine five.'] },
          { label: 'Câu 5', spell: "Is there anything else I can help with? No, that's everything.", answer: "Is there anything else I can help with? No, that's everything.", alt: ['Is there anything else I can help with? No, that is everything.', "Is there anything else I can help with no that's everything"] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép lượt và câu' },
      {
        t: 'build',
        id: 'gtd9-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Chị ấy về là tôi nhờ chị ấy gọi lại cho anh.', chips: ["I'll", 'ask', 'her', 'to', 'call', 'you', 'back', 'as', 'soon', 'as', "she's", 'back.', 'will', 'she'], answer: ["I'll", 'ask', 'her', 'to', 'call', 'you', 'back', 'as', 'soon', 'as', "she's", 'back.'] },
          { vi: 'Để tôi kiểm lại xem tôi ghi đúng chưa.', chips: ['Let', 'me', 'just', 'check', "I've", 'got', 'that.', 'to', 'I'], answer: ['Let', 'me', 'just', 'check', "I've", 'got', 'that.'] },
          { vi: 'Giờ anh nói chuyện được không?', chips: ['Is', 'this', 'a', 'good', 'time?', 'Are', 'it', 'well'], answer: ['Is', 'this', 'a', 'good', 'time?'] },
          { vi: 'Anh nói to hơn một chút được không?', chips: ['Could', 'you', 'speak', 'up', 'a', 'bit?', 'louder', 'more', 'talk'], answer: ['Could', 'you', 'speak', 'up', 'a', 'bit?'] },
          { vi: 'Chào chị, tôi là Vân. Tôi gọi lại cho anh Tyler.', chips: ['Hi,', "it's", 'Van.', "I'm", 'returning', "Tyler's", 'call.', 'I', 'am', 'back'], answer: ['Hi,', "it's", 'Van.', "I'm", 'returning', "Tyler's", 'call.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Gọi cho chính mình (hoặc bật ghi âm) và **để lại một lời nhắn hộp thư 30 giây** bằng tiếng Anh: tên · việc · hạn · số · nhờ gọi lại. Đọc số hai lần.',
          'Nghe lại bản ghi: I\'ll có rõ âm /l/ không? can và can\'t có phân biệt được không?',
          'Ngày 10: mời, nhận lời, từ chối khéo, dời hẹn — và **be going to / hiện tại tiếp diễn** để nói về kế hoạch.',
        ],
      },
    ],
  },
];
