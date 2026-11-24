/**
 * Tiếng Anh giao tiếp — NGÀY 13 (chặng 3 "Công sở, không kỹ thuật", B1): ngày đầu vào team.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd13-`.
 * Ngữ pháp trong câu: câu hỏi để làm quen (Which team are you on? How long have you been here? What did you do before?)
 * · nối câu bằng `also` / `too` (+ `either` cho câu phủ định).
 * Cảnh: Quân — sinh viên IT năm 3 đi OJT — ngày đầu ở Tandem Global, trung tâm phần mềm ở TP.HCM làm dự án cho khách Nhật
 * và Mỹ. Đồng nghiệp người Ấn (Venky), Philippines (Pia), trưởng nhóm người Úc (Fiona), khách Nhật (Okada-san).
 * Khác Ngày 1 (Huy, chào và tự giới thiệu cơ bản): hôm nay là NHỚ TÊN, hỏi để làm quen sâu hơn, tên Ấn – Nhật – Philippines.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_13: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd13-nghe',
    kind: 'listening',
    title: 'Ngày đầu đi làm: làm quen với cả team',
    goal: 'Nghe hiểu ba cảnh ngày đầu ở một công ty outsourcing: ai làm gì, ở đây bao lâu, gọi họ bằng tên nào, và xử lý khi lỡ gọi sai tên.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bắt đầu **chặng 3: Công sở**. Bạn theo chân **Quân**, sinh viên IT năm 3, ngày đầu đi **OJT** ở **Tandem Global**, một trung tâm phần mềm ở TP.HCM làm dự án cho khách **Nhật** và **Mỹ**.',
          'Quân gặp trưởng nhóm người Úc, đồng nghiệp người **Ấn Độ** và **Philippines**, rồi một **khách Nhật** ở sảnh thang máy. Mỗi nước một kiểu tên, một kiểu chào.',
          'Ngày 1 bạn đã học chào và tự giới thiệu. Hôm nay khó hơn: **nhớ tám cái tên trong năm phút**, hỏi thêm để làm quen, và **gỡ rối khi lỡ gọi sai tên**.',
          'Tốc độ chặng này nhanh hơn: khoảng **145 từ/phút**, người nói nối âm nhiều hơn, câu dài hơn. Nghe lần 1 không mở lời thoại, chỉ bắt **tên + nghề + bao lâu**.',
          'Hôm nay không có họp, không có ticket. Phần đó học ở khoá **Technical English at Work**. Ở đây chỉ là **người với người**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Khu làm việc: tám cái tên trong năm phút' },
      {
        t: 'canh',
        anh: ['office-building', 'busts-in-silhouette', 'woman-office-worker', 'man-technologist', 'name-badge'],
        caption: '9 giờ sáng thứ Hai, tầng 9. **Fiona**, trưởng nhóm người Úc, đưa **Quân** tới khu bàn của dự án Osaka và giới thiệu nhanh với cả nhóm. Quân cố nhớ từng cái tên.',
      },
      {
        t: 'listen',
        id: 'gtd13-nghe-canh1',
        title: 'Scene 1 — Meet the team',
        note: 'Nghe xem: ai là tech lead, ai là business analyst, ai sẽ kèm Quân trong tháng đầu, và ai chưa có mặt sáng nay.',
        lines: [
          { who: 'Fiona', voice: 'au-nu', text: "Okay, everyone, can I steal thirty seconds? This is Quân. He's joining us today as an OJT trainee.", vi: 'Mọi người ơi, cho mình xin ba mươi giây nhé? Đây là Quân. Hôm nay em ấy vào nhóm mình theo diện thực tập OJT.' },
          { who: 'Venky', voice: 'uk-nam', text: 'Morning, Quân!', vi: 'Chào buổi sáng, Quân!' },
          { who: 'Fiona', voice: 'au-nu', text: "Quân, I'll go round quickly. Don't worry about remembering everyone today. Nobody does.", vi: 'Quân, chị giới thiệu nhanh một vòng. Hôm nay đừng lo phải nhớ hết mọi người. Chẳng ai nhớ nổi đâu.' },
          { who: 'Fiona', voice: 'au-nu', text: "This is Venkatesh. He's the tech lead on the Osaka project.", vi: 'Đây là Venkatesh. Anh ấy là trưởng nhóm kỹ thuật của dự án Osaka.' },
          { who: 'Venky', voice: 'uk-nam', text: "Hi, welcome. It's Venkatesh on paper, but everyone calls me Venky. Much easier.", vi: 'Chào em, chào mừng em. Trên giấy tờ là Venkatesh, nhưng ai cũng gọi anh là Venky. Dễ hơn nhiều.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Nice to meet you, Venky. How long have you been here?', vi: 'Rất vui được gặp anh, Venky. Anh làm ở đây bao lâu rồi ạ?' },
          { who: 'Venky', voice: 'uk-nam', text: 'Almost four years now. I moved here from Chennai, in the south of India.', vi: 'Gần bốn năm rồi. Anh chuyển từ Chennai sang, ở miền Nam Ấn Độ.' },
          { who: 'Quân', voice: 'ca-nam', text: "Oh, I'm from the south too. From Cần Thơ, in the Mekong Delta.", vi: 'Ồ, em cũng là người miền Nam. Em ở Cần Thơ, miền Tây ạ.' },
          { who: 'Venky', voice: 'uk-nam', text: "Two southerners, then. We'll get along fine.", vi: 'Vậy là hai người miền Nam. Mình sẽ hợp nhau thôi.' },
          { who: 'Fiona', voice: 'au-nu', text: "And next to Venky is Pia. She's our business analyst. She's from Manila.", vi: 'Ngồi cạnh Venky là Pia. Chị ấy là business analyst của nhóm. Chị ấy đến từ Manila.' },
          { who: 'Pia', voice: 'us-nu', text: "Hi, Quân! Just three letters, P-I-A. So you've got no excuse to forget it!", vi: 'Chào Quân! Chỉ ba chữ thôi, P-I-A. Nên em không có lý do gì để quên đâu nhé!' },
          { who: 'Quân', voice: 'ca-nam', text: "Ha, I'll do my best. Which project are you on, Pia?", vi: 'Ha, em sẽ cố hết sức. Chị làm dự án nào ạ, chị Pia?' },
          { who: 'Pia', voice: 'us-nu', text: "Same as Venky, the Osaka account. So you'll see a lot of us. Are you on it too?", vi: 'Giống Venky, dự án khách Osaka. Nên em sẽ gặp bọn chị suốt. Em cũng vào dự án đó à?' },
          { who: 'Fiona', voice: 'au-nu', text: "He is. He's also helping the QA guys for the first two weeks. That's Bảo and Lindsay. They're out at a client workshop, so you'll meet them after lunch.", vi: 'Đúng vậy. Em ấy cũng hỗ trợ nhóm kiểm thử trong hai tuần đầu. Là Bảo và Lindsay. Hai bạn ấy đang đi buổi làm việc với khách, chiều em sẽ gặp.' },
          { who: 'Fiona', voice: 'au-nu', text: "Right. Pia's going to be your buddy this month. Any questions, ask her first, and then me.", vi: 'Rồi. Tháng này Pia sẽ là người kèm em. Có gì thắc mắc thì hỏi Pia trước, rồi mới tới chị.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Great. Thank you, Fiona. And thanks, everyone.', vi: 'Dạ tuyệt quá. Cảm ơn chị Fiona. Cảm ơn mọi người ạ.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd13-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Venkatesh muốn mọi người gọi mình là gì?',
            options: ['Venkatesh', 'Mr Venkatesh', 'Venky', 'Chennai'],
            correct: 2,
            why: '"It\'s Venkatesh on paper, but **everyone calls me Venky**." Câu "everyone calls me…" là lời mời: bạn cũng gọi như vậy.',
          },
          {
            q: 'Venky làm ở công ty bao lâu rồi?',
            options: ['Bốn tháng', 'Gần bốn năm', 'Hơn bốn năm', 'Mới vào tuần trước'],
            correct: 1,
            why: '"**Almost four years** now." almost = gần, chưa đủ.',
          },
          {
            q: 'Quân và Venky có điểm chung gì?',
            options: ['Cùng học một trường', 'Cùng là người miền Nam của nước mình', 'Cùng làm tester', 'Cùng mới vào công ty'],
            correct: 1,
            why: 'Venky từ **miền Nam Ấn Độ**, Quân nói "**I\'m from the south too**". Tìm một điểm chung là cách làm quen nhanh nhất.',
          },
          {
            q: 'Vì sao Quân chưa gặp Bảo và Lindsay?',
            options: ['Họ nghỉ phép', 'Họ làm ở tầng khác', 'Họ đang đi buổi làm việc với khách', 'Họ làm từ xa'],
            correct: 2,
            why: '"They\'re out at a **client workshop**, so you\'ll meet them after lunch."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Pantry sau bữa trưa: gọi nhầm tên' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'man-technologist', 'woman-office-worker', 'grimacing-face', 'spiral-notepad'],
        caption: '1 giờ chiều. Quân vào **pantry** (góc pha trà, cà phê) và gặp lại cô đồng nghiệp người Philippines buổi sáng. Quân chào ngay bằng tên… nhưng có đúng tên không?',
      },
      {
        t: 'listen',
        id: 'gtd13-nghe-canh2',
        title: 'Scene 2 — The wrong name',
        note: 'Nghe xem Quân gọi nhầm thành tên ai, trước đây Pia làm nghề gì, và Pia gợi ý cách gì để nhớ tên.',
        lines: [
          { who: 'Pia', voice: 'us-nu', text: 'Hey, you found the pantry! How was lunch?', vi: 'Ê, em tìm ra pantry rồi à! Bữa trưa thế nào?' },
          { who: 'Quân', voice: 'ca-nam', text: 'Good, thanks, Bea. The canteen is bigger than I expected.', vi: 'Ổn ạ, cảm ơn chị Bea. Căng tin rộng hơn em tưởng.' },
          { who: 'Pia', voice: 'us-nu', text: "Ha! Close. It's Pia, actually.", vi: 'Ha! Gần đúng. Thật ra là Pia.' },
          { who: 'Quân', voice: 'ca-nam', text: "Oh no. I'm so sorry, Pia. Three letters, and I still got it wrong.", vi: 'Ôi không. Em xin lỗi chị Pia. Có ba chữ mà em vẫn gọi sai.' },
          { who: 'Pia', voice: 'us-nu', text: "Don't worry about it! Bea works in HR, downstairs. She's from Manila too, so people mix us up all the time.", vi: 'Không sao đâu! Bea làm ở phòng nhân sự, tầng dưới. Bạn ấy cũng người Manila, nên mọi người nhầm hai đứa suốt.' },
          { who: 'Quân', voice: 'ca-nam', text: 'That makes me feel a little better. So, how long have you lived in Saigon?', vi: 'Nghe vậy em đỡ ngại hơn chút. Mà chị sống ở Sài Gòn bao lâu rồi ạ?' },
          { who: 'Pia', voice: 'us-nu', text: 'Six years. I came for one year, and I never left!', vi: 'Sáu năm. Chị định sang một năm thôi, rồi ở luôn tới giờ!' },
          { who: 'Quân', voice: 'ca-nam', text: 'Wow. What did you do before you came here?', vi: 'Ồ. Trước khi sang đây chị làm gì ạ?' },
          { who: 'Pia', voice: 'us-nu', text: 'I was an English teacher, believe it or not. Then I did a coding bootcamp and moved into BA work.', vi: 'Chị từng là giáo viên tiếng Anh, tin được không. Sau đó chị học một khoá lập trình cấp tốc rồi chuyển sang làm BA.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Really? My mum is also a teacher. She teaches maths back home.', vi: 'Thật ạ? Mẹ em cũng là giáo viên. Mẹ dạy toán ở quê.' },
          { who: 'Pia', voice: 'us-nu', text: "Oh, nice. Sorry, remind me, you're from Cà Mau, right?", vi: 'Ồ, hay quá. Xin lỗi, nhắc lại giúp chị, em quê Cà Mau đúng không?' },
          { who: 'Quân', voice: 'ca-nam', text: "Cần Thơ. But you're close. Cà Mau is about three hours away.", vi: 'Cần Thơ ạ. Nhưng chị đoán gần đúng rồi. Cà Mau cách đó khoảng ba tiếng.' },
          { who: 'Pia', voice: 'us-nu', text: "See? I forget things too. Do you know anyone here yet?", vi: 'Thấy chưa? Chị cũng quên suốt. Em đã quen ai ở đây chưa?' },
          { who: 'Quân', voice: 'ca-nam', text: "Just one person. A friend from university also works here, but she's on the seventh floor.", vi: 'Mới một người thôi ạ. Một bạn đại học của em cũng làm ở đây, nhưng bạn ấy ở tầng bảy.' },
          { who: 'Pia', voice: 'us-nu', text: "Well, now you know two people. And here's a tip: I keep a little map of who sits where, with everyone's name. I'll send it to you.", vi: 'Giờ thì em quen hai người rồi. Mẹo này: chị có một sơ đồ nhỏ ai ngồi chỗ nào, ghi tên từng người. Chị gửi em nhé.' },
          { who: 'Quân', voice: 'ca-nam', text: "That would really help. Thanks, Pia. Pia, P-I-A. Okay, I've got it now.", vi: 'Thế thì giúp em nhiều lắm. Cảm ơn chị Pia. Pia, P-I-A. Rồi, giờ em nhớ rồi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd13-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Quân gọi nhầm Pia thành tên gì?',
            options: ['Pam', 'Bea', 'Lindsay', 'Fiona'],
            correct: 1,
            why: 'Quân nói "Good, thanks, **Bea**." Pia sửa nhẹ: "Close. **It\'s Pia, actually.**"',
          },
          {
            q: 'Vì sao Pia không giận?',
            options: ['Vì Pia không nghe thấy', 'Vì người ta hay nhầm Pia với Bea, và chính Pia cũng hay quên', 'Vì Bea là chị gái của Pia', 'Vì Quân là thực tập sinh'],
            correct: 1,
            why: '"People **mix us up all the time**." Rồi Pia cũng nhớ sai quê Quân: "See? I forget things too."',
          },
          {
            q: 'Trước khi làm BA, Pia làm nghề gì?',
            options: ['Lập trình viên', 'Nhân viên nhân sự', 'Giáo viên tiếng Anh', 'Kế toán'],
            correct: 2,
            why: '"I was an **English teacher**, believe it or not." "believe it or not" = nghe lạ nhưng là thật.',
          },
          {
            q: 'Pia gợi ý cách gì để nhớ tên?',
            options: ['Chụp ảnh từng người', 'Một sơ đồ chỗ ngồi có ghi tên', 'Hỏi lại tên mỗi sáng', 'Đọc danh sách nhân viên'],
            correct: 1,
            why: '"I keep a little **map of who sits where**, with everyone\'s name."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Sảnh thang máy: khách Nhật và tấm danh thiếp' },
      {
        t: 'canh',
        anh: ['elevator', 'man-office-worker', 'identification-card', 'person-bowing', 'map-of-japan'],
        caption: '5 giờ chiều. Ở sảnh thang máy, Fiona gặp **ông Okada**, khách từ một công ty bán lẻ ở Osaka sang thăm văn phòng cả tuần. Fiona giới thiệu Quân. Ông Okada đưa danh thiếp.',
      },
      {
        t: 'listen',
        id: 'gtd13-nghe-canh3',
        title: 'Scene 3 — A business card',
        note: 'Nghe xem Quân gọi sai ông Okada ở chỗ nào, vì sao Quân không có danh thiếp, và khi nào họ gặp lại.',
        lines: [
          { who: 'Fiona', voice: 'au-nu', text: "Okada-san, good timing! Can I introduce our newest team member? This is Quân. Quân, this is Mr Okada from Hoshino Retail in Osaka. He's with us all week.", vi: 'Okada-san, đúng lúc quá! Cho tôi giới thiệu thành viên mới nhất của nhóm nhé? Đây là Quân. Quân, đây là ông Okada của công ty Hoshino Retail ở Osaka. Ông ấy ở đây cả tuần.' },
          { who: 'Okada', voice: 'nz-nam', text: 'Nice to meet you. Here is my card.', vi: 'Rất vui được gặp cậu. Đây là danh thiếp của tôi.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Thank you very much. Hiroshi Okada… It\'s an honour to meet you, Mr Hiroshi.', vi: 'Cảm ơn ông nhiều ạ. Hiroshi Okada… Rất hân hạnh được gặp ông, ông Hiroshi.' },
          { who: 'Okada', voice: 'nz-nam', text: 'Ah, thank you. Actually, Okada is my family name. Hiroshi is my given name.', vi: 'À, cảm ơn cậu. Thật ra Okada là họ của tôi. Hiroshi là tên.' },
          { who: 'Quân', voice: 'ca-nam', text: "Oh, I'm sorry, Mr Okada. In Vietnamese, the given name comes last, so I got confused.", vi: 'Ôi, cháu xin lỗi, ông Okada. Trong tiếng Việt tên đứng cuối nên cháu bị lẫn.' },
          { who: 'Okada', voice: 'nz-nam', text: 'No problem at all. And in Vietnam, people use the given name at work, I think.', vi: 'Không sao cả. Còn ở Việt Nam, đi làm thì mọi người gọi nhau bằng tên, tôi nghĩ vậy.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Yes, we do. My family name is Nguyễn, but everyone calls me Quân.', vi: 'Dạ đúng ạ. Họ của cháu là Nguyễn, nhưng mọi người gọi cháu là Quân.' },
          { who: 'Okada', voice: 'nz-nam', text: 'Then I will call you Quân-san.', vi: 'Vậy tôi sẽ gọi cậu là Quân-san.' },
          { who: 'Quân', voice: 'ca-nam', text: "Thank you. I'm afraid I don't have a business card yet. Today is my first day.", vi: 'Cảm ơn ông. Cháu rất tiếc là chưa có danh thiếp. Hôm nay là ngày đầu của cháu ạ.' },
          { who: 'Okada', voice: 'nz-nam', text: 'Your first day? Then welcome. Do you speak any Japanese?', vi: 'Ngày đầu à? Vậy chào mừng cậu. Cậu có nói được chút tiếng Nhật nào không?' },
          { who: 'Quân', voice: 'ca-nam', text: 'Only a little. I studied it for one year at university, but "hajimemashite" is all I remember!', vi: 'Chỉ một chút thôi ạ. Cháu học một năm ở trường, nhưng giờ chỉ còn nhớ mỗi câu "hajimemashite"!' },
          { who: 'Okada', voice: 'nz-nam', text: 'Ha ha, that is a good start. My Vietnamese is only "cảm ơn".', vi: 'Ha ha, khởi đầu tốt đấy. Tiếng Việt của tôi cũng chỉ có "cảm ơn".' },
          { who: 'Fiona', voice: 'au-nu', text: "Okada-san is joining our team lunch on Thursday, so you'll see him again then.", vi: 'Trưa thứ Năm Okada-san đi ăn trưa cùng cả nhóm, nên em sẽ gặp lại ông ấy.' },
          { who: 'Okada', voice: 'nz-nam', text: 'I look forward to it. Please excuse me, my taxi is here.', vi: 'Tôi rất mong tới hôm đó. Xin phép, taxi của tôi tới rồi.' },
          { who: 'Quân', voice: 'ca-nam', text: 'Of course. It was a pleasure to meet you, Mr Okada.', vi: 'Dạ vâng. Rất hân hạnh được gặp ông, ông Okada.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd13-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Quân gọi sai ông Okada thế nào?',
            options: ['Gọi bằng họ, không có Mr', 'Gọi "Mr" kèm TÊN riêng (Mr Hiroshi)', 'Gọi là Okada-san', 'Gọi là anh'],
            correct: 1,
            why: 'Danh thiếp in "Hiroshi Okada" (tên trước, họ sau). Quân tưởng chữ cuối là tên như tiếng Việt nên gọi "**Mr Hiroshi**". Mr luôn đi với **họ**: Mr Okada.',
          },
          {
            q: 'Vì sao Quân không đưa lại danh thiếp?',
            options: ['Quân để quên ở bàn', 'Quân chưa có, vì hôm nay mới vào', 'Ở Việt Nam không dùng danh thiếp', 'Quân không muốn đưa'],
            correct: 1,
            why: '"I\'m afraid I don\'t have a business card yet. **Today is my first day.**" "I\'m afraid…" = xin lỗi trước một tin không vui.',
          },
          {
            q: 'Ông Okada sẽ gọi Quân là gì?',
            options: ['Nguyễn-san', 'Mr Nguyễn', 'Quân-san', 'Quân-kun'],
            correct: 2,
            why: '"Then I will call you **Quân-san**." Người Nhật thêm -san vào tên người khác như một phép lịch sự. Bạn **không** tự gọi mình là "Quân-san".',
          },
          {
            q: 'Khi nào Quân gặp lại ông Okada?',
            options: ['Sáng mai', 'Bữa trưa thứ Năm với cả nhóm', 'Tối thứ Sáu', 'Không hẹn gặp lại'],
            correct: 1,
            why: '"Okada-san is joining our **team lunch on Thursday**."',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **cả câu**. Chú ý các từ nhỏ hay bị nuốt: **have, been, too, also**, và tên riêng. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd13-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — tên gọi tắt (tên: Venky)', spell: 'Everyone calls me Venky.', answer: 'Everyone calls me Venky.' },
          { label: 'Câu 2 — câu hỏi làm quen', spell: 'How long have you been here?', answer: 'How long have you been here?' },
          { label: 'Câu 3 — trả lời thời gian', spell: 'Almost four years now.', answer: 'Almost four years now.', alt: ['Almost 4 years now.'] },
          { label: 'Câu 4 — điểm chung', spell: "I'm from the south too.", answer: "I'm from the south too.", alt: ['I am from the south too.', "I'm from the South too."] },
          { label: 'Câu 5 — hỏi dự án', spell: 'Which project are you on?', answer: 'Which project are you on?' },
          { label: 'Câu 6 — also giữa câu', spell: 'My mum is also a teacher.', answer: 'My mum is also a teacher.', alt: ['My mom is also a teacher.'] },
          { label: 'Câu 7 — sửa tên khéo (tên: Okada)', spell: 'Actually, Okada is my family name.', answer: 'Actually, Okada is my family name.', alt: ['Actually Okada is my family name.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ["Don't worry about remembering everyone.", 'Không ai chấm điểm bạn hôm nay. Quên tên là chuyện **được phép**.', 'Thanks, that helps!'],
          ['Everyone calls me Venky.', 'Bạn **cứ gọi** như vậy. Gọi tên đầy đủ lại thành xa cách.', 'Venky. Got it.'],
          ["Close! It's Pia, actually.", 'Bạn gọi sai, nhưng họ **không giận**. "actually" làm lời sửa nhẹ đi.', "Sorry, Pia! I won't forget again."],
          ['Sorry, remind me…?', 'Họ cũng quên. Xin nhắc lại là chuyện **thường**, kể cả với người cũ.', '(nhắc lại ngắn gọn, mỉm cười)'],
          ['Any questions, ask her first.', 'Có một người **chính thức** kèm bạn. Hỏi người đó trước, đừng đi hỏi lung tung.', 'Great, thank you.'],
          ["We should grab lunch sometime.", 'Thường chỉ là câu xã giao (nhất là ở Mỹ). Thành lời mời thật khi có **ngày cụ thể**.', "I'd like that. How about Thursday?"],
          ['Okada-san', 'Cách gọi lịch sự kiểu Nhật: họ + san. Người nước ngoài trong công ty hay gọi khách Nhật như vậy.', '(dùng theo, nhưng không gắn -san vào tên mình)'],
          ["I'm afraid I don't have…", 'Xin lỗi trước một tin không vui. **Không** liên quan tới sợ.', 'No problem.'],
        ],
        caption: 'Ngày đầu, người cũ **chờ bạn hỏi**. Hỏi tên lại, hỏi người kèm, hỏi chỗ ngồi đều được coi là chủ động, không phải làm phiền.',
      },
      {
        t: 'note',
        title: 'Mẹo: nghe giới thiệu một loạt tên mà không kịp nhớ',
        items: [
          'Đừng cố nhớ cả tám người trong lúc nghe. Bắt **tên + một chi tiết** của 2–3 người ngồi gần bạn nhất (Venky – tech lead – Chennai).',
          'Nhắc lại tên ngay khi đáp: "Nice to meet you, **Venky**." Tên nào không nghe rõ thì hỏi luôn trong 5 giây, như Ngày 1.',
          'Giới thiệu xong, hỏi người kèm: "**Sorry, who\'s who again?**" (Xin lỗi, ai là ai nhỉ?) hoặc "**Could you tell me everyone\'s names again later?**"',
          'Tên Ấn, tên Nhật dài và lạ: hỏi "**What do people usually call you?**" Hầu hết đều có tên gọi tắt hoặc chấp nhận gọi bằng họ.',
          'Về chỗ ngồi thì **ghi ngay** lên sổ: tên, chỗ ngồi, một chi tiết. Đây không phải kém trí nhớ, người đi làm lâu năm cũng làm vậy.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Đồng nghiệp', 'colleague · workmate', 'coworker · colleague', 'workmate · colleague'],
          ['Góc pha trà cà phê', 'kitchen · staff room', 'break room · kitchen', 'tea room · kitchen'],
          ['Nhà ăn công ty', 'canteen', 'cafeteria', 'canteen · lunchroom'],
          ['Thang máy', 'lift', 'elevator', 'lift'],
          ['Gọi thân một người', 'mate (nam, thân)', 'man · buddy', 'mate (rất phổ biến)'],
          ['Người kèm người mới', 'buddy · mentor', 'buddy · onboarding buddy', 'buddy'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc ở văn phòng. **pantry** là từ chung của nhiều công ty ở châu Á (Việt Nam, Philippines, Singapore, Ấn Độ), bạn sẽ nghe nó ở công ty outsourcing nhiều hơn cả.',
      },
      {
        t: 'note',
        title: 'Nghe giọng đồng nghiệp Ấn, Philippines, Nhật (bài nghe dùng giọng Anh – Mỹ – Úc)',
        items: [
          '**Ấn Độ**: nói nhanh, nhịp đều, âm /t/ và /d/ đặt lưỡi cao (nghe hơi "cứng"), /v/ và /w/ có khi giống nhau (very nghe như "wery"). Hay dùng **"Kindly…"**, **"do the needful"**, **"prepone"** (dời sớm lên). Nghe kịp thì bắt các từ có trọng âm.',
          '**Philippines**: giọng gần Mỹ, rõ, dễ nghe. Âm /f/ đôi khi thành /p/, /v/ thành /b/. Hay chêm **"po"** khi nói lịch sự bằng tiếng Tagalog.',
          '**Nhật**: thêm nguyên âm sau phụ âm cuối ("desk" nghe như "desuku"), /l/ và /r/ lẫn nhau, câu ngắn, nói chậm và lịch sự. Nhiều người nghe – đọc tốt hơn nói, nên **nói chậm, câu ngắn** với họ là tôn trọng, không phải coi thường.',
          'Gặp giọng lạ: đừng đoán bừa. "Sorry, could you say that again?" (Ngày 2) dùng được với **mọi** giọng.',
        ],
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-se-a2-01 · Hi, I\'m a Developer** — Minh tự giới thiệu ở một buổi gặp mặt dân công nghệ: học gì, thích front-end hay back-end. Cảnh khác bài hôm nay (gặp người lạ ở sự kiện, không phải đồng nghiệp mới), nghe để ôn câu hỏi làm quen và cách dùng **too** ("I\'m learning back-end too").',
          'Phần kỹ thuật ngày đầu (họp đứng hằng ngày, nhận ticket, email khách) ở khoá **Technical English at Work**.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd13-noi',
    kind: 'speaking',
    title: 'Giới thiệu mình với đồng nghiệp, nhớ và gọi tên',
    goal: 'Tự giới thiệu với một nhóm đồng nghiệp mới, hỏi 5–6 câu làm quen tự nhiên, nối điểm chung bằng also / too, và nhớ – gọi đúng tên người Ấn, Nhật, Philippines.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** để vào team mới: nói mình là ai ở đây, hỏi người khác làm gì – ở đây bao lâu – trước đây làm gì, tìm điểm chung, xin nhắc lại tên.',
          'Ngữ pháp: **câu hỏi làm quen** (Which team are you on? How long have you been here?) và **also / too / either**.',
          '**Nhớ tên 5 bước**, và quy tắc gọi tên người Nhật, Ấn, Philippines, Anh – Mỹ.',
          '**Danh thiếp, cúi chào, lắc đầu kiểu Ấn, nhướn mày kiểu Philippines**: cử chỉ nào nghĩa là gì.',
          'Cuối bài: nhập vai buổi chiều Quân gặp Lindsay (nhóm kiểm thử) và tự nói bằng thông tin của bạn.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo thứ tự một lần làm quen ở công ty: **nói mình là ai ở đây → hỏi người kia → tìm điểm chung → hỏi / sửa tên → hẹn gặp lại**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "I'm joining the team today.", pos: 'phr', ipa: '/aɪm ˈdʒɔɪnɪŋ ðə ˈtiːm təˈdeɪ/', vi: 'Hôm nay mình vào nhóm.', ex: "Hi, I'm Quân. I'm joining the Osaka team today.", exVi: 'Chào mọi người, em là Quân. Hôm nay em vào nhóm Osaka.', more: 'Thay "today" bằng **this week** nếu đã vào được vài ngày.' },
          { w: "I'm here as an OJT trainee.", pos: 'phr', ipa: '/aɪm hɪr əz ən ˌoʊ dʒeɪ ˈtiː treɪˈniː/', vi: 'Mình ở đây theo diện thực tập OJT.', ex: "I'm here as an OJT trainee for four months.", exVi: 'Em thực tập OJT ở đây bốn tháng.', more: 'Cũng nói: **I\'m on a four-month internship.** · **I\'m doing my OJT here.**' },
          { w: "I'll be working with…", pos: 'phr', ipa: '/aɪl bi ˈwɝːkɪŋ wɪð/', vi: 'Mình sẽ làm cùng…', ex: "I'll be working with Venky and Pia on the Osaka project.", exVi: 'Em sẽ làm cùng anh Venky và chị Pia ở dự án Osaka.' },
          { w: 'Which team are you on?', pos: 'phr', ipa: '/wɪtʃ ˈtiːm ər ju ˈɑːn/', vi: 'Bạn ở nhóm nào?', ex: "Which team are you on? — I'm on the QA team.", exVi: 'Chị ở nhóm nào ạ? — Chị ở nhóm kiểm thử.', more: 'Giới từ là **on**: on the team, on the project, on the Osaka account. "in the team" là kiểu Anh, cũng gặp.' },
          { w: 'What do you do here?', pos: 'phr', ipa: '/ˈwʌt də ju ˈduː hɪr/', vi: 'Bạn làm mảng gì ở đây?', ex: "What do you do here, Lindsay? — I'm a tester.", exVi: 'Chị làm mảng gì ở đây, chị Lindsay? — Chị là tester.', more: 'Thêm **here** là hỏi vai trò trong công ty, không phải hỏi nghề chung chung như Ngày 1.' },
          { w: "What's your role?", pos: 'phr', ipa: '/ˌwʌts jər ˈroʊl/', vi: 'Vai trò của bạn là gì?', ex: "What's your role on the project?", exVi: 'Vai trò của anh trong dự án là gì ạ?', more: 'Trung tính hơn **What\'s your position?** (nghe như hỏi chức vụ).' },
          { w: 'How long have you been here?', pos: 'phr', ipa: '/haʊ ˈlɔːŋ əv ju bɪn ˈhɪr/', vi: 'Bạn làm ở đây bao lâu rồi?', ex: 'How long have you been here? — Almost four years.', exVi: 'Anh làm ở đây bao lâu rồi? — Gần bốn năm.', more: 'Cùng nghĩa: **How long have you been with the company?** (trang trọng hơn).' },
          { w: 'How long have you lived in Saigon?', pos: 'phr', ipa: '/haʊ ˈlɔːŋ əv ju ˈlɪvd ɪn saɪˈɡɑːn/', vi: 'Bạn sống ở Sài Gòn bao lâu rồi?', ex: 'How long have you lived in Saigon? — Six years.', exVi: 'Chị sống ở Sài Gòn bao lâu rồi? — Sáu năm.' },
          { w: 'What did you do before this?', pos: 'phr', ipa: '/ˈwʌt dɪd ju ˈduː bɪˈfɔːr ðɪs/', vi: 'Trước đây bạn làm gì?', ex: 'What did you do before this? — I was a teacher.', exVi: 'Trước đây chị làm gì? — Chị từng là giáo viên.', more: 'Đã xong ⇒ **did**. Hỏi "đang làm gì" thì là What do you do.' },
          { w: 'What brought you to Vietnam?', pos: 'phr', ipa: '/ˈwʌt ˈbrɔːt ju tə ˌviːetˈnɑːm/', vi: 'Điều gì đưa bạn tới Việt Nam?', ex: 'What brought you to Vietnam, Venky?', exVi: 'Điều gì đưa anh tới Việt Nam vậy, anh Venky?', more: 'Lịch sự hơn **Why are you in Vietnam?** (nghe như tra hỏi).' },
          { w: 'Where are you based?', pos: 'phr', ipa: '/ˈwer ər ju ˈbeɪst/', vi: 'Bạn làm việc ở đâu (văn phòng nào)?', ex: "Where are you based? — I'm based in Hanoi, but I'm here this week.", exVi: 'Anh làm ở văn phòng nào? — Anh ở Hà Nội, tuần này vào đây.' },
          { w: 'Do you know anyone here yet?', pos: 'phr', ipa: '/də ju ˈnoʊ ˈeniwʌn hɪr jet/', vi: 'Bạn đã quen ai ở đây chưa?', ex: 'Do you know anyone here yet? — Just one person.', exVi: 'Em đã quen ai ở đây chưa? — Mới một người thôi.' },
          { w: "I'm from the south too.", pos: 'phr', ipa: '/aɪm frəm ðə ˈsaʊθ tuː/', vi: 'Mình cũng người miền Nam.', ex: "You're from the south of India? I'm from the south too!", exVi: 'Anh ở miền Nam Ấn Độ ạ? Em cũng người miền Nam!', more: '**too** đứng **cuối câu**, nói nhẹ nhưng rõ.' },
          { w: 'My mum is also a teacher.', pos: 'phr', ipa: '/maɪ ˈmʌm ɪz ˈɔːlsoʊ ə ˈtiːtʃər/', vi: 'Mẹ mình cũng là giáo viên.', ex: 'You were a teacher? My mum is also a teacher.', exVi: 'Chị từng là giáo viên ạ? Mẹ em cũng là giáo viên.', more: '**also** đứng **sau be**, **trước động từ thường**: I also play…' },
          { w: "I don't either.", pos: 'phr', ipa: '/aɪ ˌdoʊnt ˈiːðər/', vi: 'Mình cũng không.', ex: "I don't drink coffee. — I don't either. I'm a tea person.", exVi: 'Mình không uống cà phê. — Mình cũng không. Mình hợp trà hơn.', more: 'Câu phủ định ⇒ **either**, không dùng too. Thân mật: **Me neither.**' },
          { w: 'We have something in common.', pos: 'phr', ipa: '/wi hæv ˈsʌmθɪŋ ɪn ˈkɑːmən/', vi: 'Chúng ta có điểm chung.', ex: 'You run? Me too. We have something in common.', exVi: 'Chị chạy bộ ạ? Em cũng vậy. Mình có điểm chung rồi.' },
          { w: 'Sorry, remind me of your name?', pos: 'phr', ipa: '/ˈsɑːri rɪˈmaɪnd mi əv jər ˈneɪm/', vi: 'Xin lỗi, nhắc lại tên bạn giúp mình nhé?', ex: "Sorry, remind me of your name? I've met so many people today.", exVi: 'Xin lỗi, nhắc lại tên giúp em nhé? Hôm nay em gặp nhiều người quá.', more: 'Dùng khi **đã được giới thiệu rồi mà quên**. Chưa nghe rõ ngay lúc đầu thì dùng câu Ngày 1: I didn\'t catch your name.' },
          { w: "I'm so sorry, I've forgotten your name.", pos: 'phr', ipa: '/aɪm ˈsoʊ ˈsɑːri aɪv fərˈɡɑːtn jər ˈneɪm/', vi: 'Xin lỗi, mình quên mất tên bạn rồi.', ex: "I'm so sorry, I've forgotten your name already.", exVi: 'Em xin lỗi, em quên tên chị mất rồi.', more: 'Nói **một lần**, thẳng thắn. Đoán bừa rồi gọi sai còn ngại hơn.' },
          { w: 'What do people usually call you?', pos: 'phr', ipa: '/ˈwʌt də ˈpiːpl ˈjuːʒuəli ˈkɔːl ju/', vi: 'Mọi người thường gọi bạn là gì?', ex: 'Venkatesh — what do people usually call you?', exVi: 'Venkatesh — mọi người thường gọi anh là gì ạ?', more: 'Câu cứu cánh cho tên dài, tên khó đọc.' },
          { w: 'Am I saying it right?', pos: 'phr', ipa: '/æm aɪ ˈseɪɪŋ ɪt ˈraɪt/', vi: 'Mình đọc vậy đúng chưa?', ex: 'Venkatesh. Am I saying it right?', exVi: 'Venkatesh. Em đọc vậy đúng chưa ạ?', more: 'Người ta quý bạn hơn khi bạn **cố đọc đúng** tên họ.' },
          { w: 'Is that your first name or your family name?', pos: 'phr', ipa: '/ɪz ðæt jər ˈfɝːst neɪm ɔːr jər ˈfæməli neɪm/', vi: 'Đó là tên hay họ của bạn?', ex: 'Okada — is that your first name or your family name?', exVi: 'Okada là tên hay họ của ông ạ?' },
          { w: 'It\'s an honour to meet you.', pos: 'phr', ipa: '/ɪts ən ˈɑːnər tə ˈmiːt ju/', vi: 'Rất hân hạnh được gặp ông / bà. (rất trang trọng)', ex: "It's an honour to meet you, Mr Okada.", exVi: 'Rất hân hạnh được gặp ông, ông Okada.', more: 'Dùng với khách lớn, người rất cao tuổi. Đồng nghiệp thì Nice to meet you là đủ. Mỹ viết **honor**.' },
          { w: 'business card', pos: 'n', ipa: '/ˈbɪznəs kɑːrd/', vi: 'danh thiếp', ex: "I'm afraid I don't have a business card yet.", exVi: 'Tôi rất tiếc là chưa có danh thiếp.', anh: 'identification-card', more: 'Người Nhật gọi là **meishi**. Đưa – nhận bằng **hai tay**.' },
          { w: 'buddy', pos: 'n', ipa: '/ˈbʌdi/', vi: 'người kèm người mới (trong công ty)', ex: "Pia's going to be your buddy this month.", exVi: 'Tháng này Pia sẽ kèm em.', anh: 'people-hugging' },
          { w: 'seating chart', pos: 'n', ipa: '/ˈsiːtɪŋ tʃɑːrt/', vi: 'sơ đồ chỗ ngồi', ex: "I'll send you the seating chart with everyone's names.", exVi: 'Chị gửi em sơ đồ chỗ ngồi có tên mọi người.', anh: 'spiral-notepad' },
          { w: 'mix (people) up', pos: 'v', ipa: '/ˌmɪks ˈʌp/', vi: 'nhầm hai người với nhau', ex: 'People mix us up all the time.', exVi: 'Mọi người nhầm hai đứa suốt.', more: 'I always **mix up** their names. · Sorry, I **got you mixed up** with Bea.' },
          { w: "Let me know if you need anything.", pos: 'phr', ipa: '/ˌlet mi ˈnoʊ ɪf ju ˈniːd ˈeniθɪŋ/', vi: 'Cần gì cứ báo mình nhé.', ex: "Welcome aboard. Let me know if you need anything.", exVi: 'Chào mừng em. Cần gì cứ báo anh nhé.', more: 'Đáp: **Thanks, I will.** Rồi hỏi thật khi cần, họ nói thật lòng.' },
          { w: 'See you around.', pos: 'phr', ipa: '/ˌsiː ju əˈraʊnd/', vi: 'Gặp lại sau nhé. (chưa hẹn cụ thể)', ex: 'Nice meeting you, Lindsay. See you around!', exVi: 'Rất vui được gặp chị, Lindsay. Gặp lại chị sau nhé!' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Ở công ty outsourcing bạn gặp đủ ba kiểu người trong một ngày: bạn cùng nhóm (thân), người ở nhóm khác (trung tính), **khách** và quản lý lớn (trang trọng). Chưa chắc thì dùng cột giữa.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (cùng nhóm)', 'Trung tính (đồng nghiệp khác nhóm)', 'Trang trọng (khách, sếp lớn)'],
        rows: [
          ['Nói mình mới vào', "Hey, I'm Quân, the new guy.", "Hi, I'm Quân. I've just joined the Osaka team.", "Good afternoon. My name is Nguyễn Minh Quân. I joined the team today."],
          ['Hỏi làm gì', 'So what do you do?', 'What do you do here?', 'May I ask what your role is?'],
          ['Hỏi bao lâu', 'Been here long?', 'How long have you been here?', 'How long have you been with the company?'],
          ['Hỏi trước đây', 'What were you doing before?', 'What did you do before this?', 'Where were you before you joined?'],
          ['Quên tên', 'Sorry, what was your name again?', 'Sorry, remind me of your name?', "I do apologise, could you tell me your name again?"],
          ['Điểm chung', 'No way, me too!', "Oh, I'm from the south too.", 'What a coincidence. I am also from the south.'],
          ['Chào ra về', 'Catch you later!', 'Nice meeting you. See you around.', 'It was a pleasure to meet you.'],
        ],
        caption: '"Been here long?" là câu bỏ trợ động từ (Have you…) khi nói nhanh và thân. Nghe được là đủ, khi nói bạn cứ dùng câu đầy đủ.',
      },
      {
        t: 'note',
        title: 'Mẹo: tên tiếng Anh ở công ty outsourcing',
        items: [
          'Ở một số công ty, người Việt tự đặt **tên tiếng Anh** (Kevin, Lily) cho khách dễ gọi. Đây là lựa chọn **của bạn**, không bắt buộc.',
          'Muốn giữ tên thật thì dạy người ta đọc một lần: "**It\'s Quân. Like \"kwun\".**" rồi thôi, đừng xin lỗi vì tên mình khó.',
          'Đã chọn tên tiếng Anh thì dùng **nhất quán** ở email, chat, hồ sơ, kẻo khách tưởng là hai người.',
          'Đồng nghiệp có tên tiếng Anh thì gọi theo tên họ chọn, không gọi tên thật nếu họ không mời.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Làm quen = **hỏi đúng câu**. Hôm nay có ba khung câu hỏi: hỏi **hiện tại** (đang ở đâu, làm gì), hỏi **từ trước tới giờ** (bao lâu rồi, Ngày 12 vừa học hiện tại hoàn thành), và hỏi **quá khứ đã xong** (trước đây làm gì, Ngày 11). Rồi nối điểm chung bằng **also / too**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Which / What + N + are you on / in?',
            vi: 'Hỏi nhóm, dự án, phòng. Giới từ đứng cuối câu hỏi.',
            examples: [
              { en: 'Which team are you on?', vi: 'Bạn ở nhóm nào?' },
              { en: 'Which project are you on?', vi: 'Bạn làm dự án nào?' },
              { en: 'What floor are you on?', vi: 'Bạn ngồi tầng mấy?' },
            ],
          },
          {
            formula: 'How long have you + V3 + …?',
            vi: 'Hỏi một việc bắt đầu từ trước và **vẫn đang tiếp diễn**. Trả lời bằng for + khoảng thời gian / since + mốc.',
            examples: [
              { en: 'How long have you been here?', vi: 'Bạn ở đây bao lâu rồi?' },
              { en: 'How long have you lived in Saigon?', vi: 'Bạn sống ở Sài Gòn bao lâu rồi?' },
              { en: 'How long have you known Venky?', vi: 'Bạn quen Venky bao lâu rồi?' },
            ],
          },
          {
            formula: 'What did you do + before + this / you came here?',
            vi: 'Hỏi việc đã **xong** ở quá khứ: did + V nguyên mẫu.',
            examples: [
              { en: 'What did you do before this?', vi: 'Trước đây bạn làm gì?' },
              { en: 'Where did you work before?', vi: 'Trước đây bạn làm ở đâu?' },
              { en: 'What did you study at university?', vi: 'Hồi đại học bạn học ngành gì?' },
            ],
          },
          {
            formula: 'What brought you + to + nơi?',
            vi: 'Hỏi lý do một cách mềm. Không dùng "Why are you here?".',
            examples: [
              { en: 'What brought you to Vietnam?', vi: 'Điều gì đưa bạn tới Việt Nam?' },
              { en: 'What brought you to Tandem?', vi: 'Sao bạn vào làm ở Tandem?' },
              { en: 'What brought you to IT?', vi: 'Điều gì khiến bạn theo ngành IT?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu gốc', 'Thêm also', 'Thêm too', 'Phủ định'],
        rows: [
          ["I'm from the south.", "I'm **also** from the south. (sau be)", "I'm from the south **too**.", "I'm not from Hanoi **either**."],
          ['I play badminton.', 'I **also** play badminton. (trước động từ)', 'I play badminton **too**.', "I don't play tennis **either**."],
          ['She can speak Japanese.', 'She can **also** speak Japanese. (sau can)', 'She can speak Japanese **too**.', "She can't speak Korean **either**."],
          ["We've met before.", "We've **also** met Okada-san. (sau have)", "We've met Okada-san **too**.", "We haven't met Bảo **either**."],
          ['Đáp ngắn (thân mật)', '—', '**Me too.** · **So do I.** · **So am I.**', '**Me neither.** · **Neither do I.**'],
        ],
        caption: '**too** luôn ở **cuối câu**, nói chuyện dùng nhiều nhất. **also** đứng **giữa câu**, gặp nhiều trong viết và câu dài. Câu **phủ định** thì không dùng too / also, mà dùng **either**.',
      },
      {
        t: 'rule',
        formula: 'S + be + also … · S + also + V … · … + too · … not … + either',
        vi: 'also: sau be / can / have, trước động từ thường. too: cuối câu. Phủ định: either ở cuối câu.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: also · too · either',
        items: [
          'Tìm điểm chung là cách nhanh nhất để người lạ thành đồng nghiệp. Mỗi lần nghe người kia kể, tự hỏi: **mình có gì giống không?** → "Oh, I\'m … **too**!"',
          '**also** còn nối thêm thông tin về chính mình: "I\'m on the Osaka project. I\'m **also** helping the QA team." (Không phải điểm chung, mà là "ngoài ra".)',
          'Đáp lại người khác bằng đủ câu thì tự nhiên hơn chỉ "Me too": "**My mum is also a teacher.**" cho người kia thêm một chi tiết để hỏi tiếp.',
          '"**So do I / So am I**" phải đổi theo động từ của người kia: I love Đà Lạt. — **So do I.** · I\'m tired. — **So am I.** Chưa chắc thì "Me too" luôn đúng.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd13-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: 'Which team are you on? · How long have you + V3? · What did you do before…? · also / too / either',
        items: [
          { q: 'Anh ở nhóm nào ạ?', hint: 'which team, on', answers: ['Which team are you on?', 'Which team are you in?', 'What team are you on?', 'What team are you in?'] },
          { q: 'Chị làm ở đây bao lâu rồi?', hint: 'how long, have you been', answers: ['How long have you been here?', 'How long have you worked here?', 'How long have you been working here?', 'How long have you been with the company?'] },
          { q: 'Trước khi vào đây anh làm gì?', hint: 'what did you do, before', answers: ['What did you do before this?', 'What did you do before you came here?', 'What did you do before you joined?', 'What did you do before joining?', 'What did you do before you joined the company?'] },
          { q: 'Em cũng là người miền Nam. (dùng too)', hint: 'the south, too', answers: ["I'm from the south too.", 'I am from the south too.', "I'm also from the south.", "I'm from the south, too."] },
          { q: 'Em cũng chơi cầu lông. (dùng also)', hint: 'also, play badminton', answers: ['I also play badminton.', 'I play badminton too.', 'I play badminton, too.'] },
          { q: 'Em cũng không uống cà phê.', hint: "don't, either", answers: ["I don't drink coffee either.", 'I do not drink coffee either.', "I don't drink coffee, either."] },
        ],
      },

      { t: 'h', text: '4. Nhớ tên và gọi tên cho đúng' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Nhớ một cái tên: 5 bước',
        caption: 'Người ta quên tên không phải vì trí nhớ kém, mà vì **lúc nghe tên đang bận nghĩ câu tiếp theo**. Bước 1 là dừng nghĩ để nghe.',
        steps: [
          { label: 'Nghe trọn', sub: 'Ngừng nghĩ câu của mình 2 giây' },
          { label: 'Nhắc lại', sub: 'Nice to meet you, Venky.' },
          { label: 'Hỏi nếu lạ', sub: 'Am I saying it right?' },
          { label: 'Gắn 1 chi tiết', sub: 'Venky – tech lead – Chennai' },
          { label: 'Dùng khi chia tay', sub: 'See you tomorrow, Venky.' },
        ],
      },
      {
        t: 'table',
        head: ['Người', 'Thứ tự tên', 'Gọi ở công ty', 'Cẩn thận'],
        rows: [
          ['Việt Nam', 'Họ – đệm – tên (Nguyễn Minh Quân)', 'Tên: Quân', 'Đưa thẻ tiếng Anh ghi "Quan Nguyen" để người nước ngoài biết đâu là tên.'],
          ['Anh – Mỹ – Úc', 'Tên – họ (Fiona Walsh)', 'Tên: Fiona, kể cả với sếp', 'Mr / Ms + **họ** chỉ dùng khi rất trang trọng: Ms Walsh.'],
          ['Nhật', 'Họ – tên (Okada Hiroshi), nhưng danh thiếp tiếng Anh hay in tên trước: Hiroshi Okada', 'Họ + san: Okada-san, hoặc Mr Okada', 'Không gọi tên riêng khi chưa được mời. Không gắn -san vào tên mình. Nhiều danh thiếp viết HOA họ: OKADA Hiroshi.'],
          ['Ấn Độ', 'Rất khác theo vùng; miền Nam có người không có họ, dùng chữ cái đầu cho tên cha hoặc quê', 'Tên hoặc tên gọi tắt: Venky', 'Hỏi "What do people usually call you?" là cách an toàn nhất.'],
          ['Philippines', 'Tên – họ, giống Mỹ', 'Tên hoặc biệt danh (Pia, Bea, Joy)', 'Biệt danh rất phổ biến, nhiều người dùng ở cả email công việc.'],
        ],
        caption: 'Nhìn danh thiếp mà không chắc chữ nào là họ: hỏi luôn "**Is Okada your family name?**". Hỏi một lần đỡ hơn gọi sai cả tuần.',
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi làm quen ở công ty',
        items: [
          '~~How long do you work here?~~ → **How long have you been here?** Hỏi "bao lâu rồi" về việc vẫn đang tiếp diễn thì dùng **have + V3**, không dùng hiện tại đơn.',
          '~~I work here since 4 years.~~ → **I\'ve been here for four years.** Khoảng thời gian dùng **for**; mốc thời gian mới dùng **since** (since 2022, since March).',
          '~~Where do you work before?~~ → **Where did you work before?** Việc trước đây đã xong ⇒ **did**.',
          '~~I also am from the south.~~ → **I\'m also from the south.** also đứng **sau** be. Với động từ thường thì đứng trước: I **also play**.',
          '~~I don\'t like spicy food too.~~ → **I don\'t like spicy food either.** Câu phủ định dùng **either**.',
          '~~Mr Hiroshi · Mr Venky · Ms Pia~~ → **Mr Okada · Venky · Pia.** Mr / Ms chỉ đi với **họ**. Đồng nghiệp thì gọi tên trơn.',
          '~~Hello, I\'m Quân-san.~~ → **Hello, I\'m Quân.** -san là kính ngữ dành cho **người khác**. Tự gắn vào tên mình nghe như tự xưng "ngài".',
          '~~Why are you in Vietnam?~~ → **What brought you to Vietnam?** Câu đầu đúng ngữ pháp nhưng nghe như hải quan hỏi. Câu sau tò mò mà thân thiện.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi làm quen đồng nghiệp nhiều nước' },
      {
        t: 'p',
        text: 'Trong một công ty outsourcing, cùng một cử chỉ có thể có ba nghĩa khác nhau tuỳ người đối diện. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi làm quen ở văn phòng nhiều nước',
        items: [
          { anh: 'identification-card', w: 'Thank you very much.', ro: '/ˈθæŋk ju ˈveri ˈmʌtʃ/', vi: 'Nhận danh thiếp của khách Nhật bằng **hai tay**, đọc tên trên thẻ vài giây, đặt lên bàn trước mặt. Không nhét ngay vào túi quần, không viết lên thẻ.' },
          { anh: 'person-bowing', w: 'Nice to meet you, Mr Okada.', ro: '/naɪs tə ˈmiːt ju ˈmɪstər oʊˈkɑːdə/', vi: 'Cúi đầu nhẹ khi chào khách Nhật. Họ đưa tay thì bắt nhẹ, có thể vừa bắt tay vừa hơi cúi.' },
          { anh: 'head-shaking-horizontally', w: 'Okay, no problem.', ro: '/ˌoʊˈkeɪ noʊ ˈprɑːbləm/', vi: 'Đồng nghiệp Ấn **nghiêng đầu qua lại** khi bạn nói: thường nghĩa là "ừ, hiểu rồi, ok", **không** phải lắc đầu từ chối.' },
          { anh: 'face-with-raised-eyebrow', w: 'Hi!', ro: '/haɪ/', vi: 'Đồng nghiệp Philippines **nhướn mày nhanh** một cái: chào hoặc "ừ". Không phải nghi ngờ bạn.' },
          { anh: 'eyes', w: 'Nice to meet you, Venky.', ro: '/naɪs tə ˈmiːt ju ˈveŋki/', vi: 'Nhìn vào người đó **đúng lúc nói tên họ**. Ánh mắt + tên = họ thấy được nhớ tới.' },
          { anh: 'spiral-notepad', w: "Let me write that down.", ro: '/ˌlet mi ˈraɪt ðæt ˈdaʊn/', vi: 'Ghi tên ngay trước mặt người ta là **lịch sự** ở công sở: cho thấy bạn coi trọng.' },
          { anh: 'grimacing-face', w: "Sorry, I've forgotten your name.", ro: '', vi: 'Quên tên: nhăn mặt nhẹ, cười, nói thẳng một câu. Đừng né mặt để khỏi phải gọi tên.' },
          { anh: 'palm-up-hand', w: 'Venky, this is Bảo.', ro: '/ˈveŋki ðɪs ɪz ˈbaʊ/', vi: 'Giới thiệu hai người với nhau: bàn tay mở hướng về từng người khi nói tên họ (Ngày 1).' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật', 'Ấn · Philippines'],
        rows: [
          ['Chào lần đầu', 'Gật đầu, bắt tay', 'Bắt tay chắc, nhìn mắt', 'Cúi chào, bắt tay nhẹ nếu họ đưa', 'Bắt tay; Ấn có thể chắp tay **Namaste**'],
          ['Danh thiếp', 'Đưa một tay cũng được', 'Ít dùng, nhận một tay, cất đi', 'Hai tay, đọc kỹ, đặt lên bàn', 'Nhận một tay, **tay phải** (Ấn)'],
          ['Gật / lắc đầu', 'Gật = có', 'Gật = có, lắc = không', 'Gật nhiều = **đang nghe**, chưa chắc là đồng ý', 'Ấn: nghiêng đầu qua lại = ok'],
          ['Gọi người khác', 'Anh / chị + tên', 'Tên riêng', 'Họ + san', 'Tên / biệt danh; Philippines thêm "Ma\'am / Sir" với người lớn'],
          ['Khoảng cách, chạm', 'Gần, vỗ vai', 'Một sải tay, không chạm', 'Xa hơn, không chạm', 'Philippines thân thiện, Ấn khác giới ít chạm'],
        ],
        caption: 'Đồng nghiệp Nhật gật đầu "hai, hai" khi bạn nói nghĩa là **"tôi đang nghe"**, chưa phải "tôi đồng ý". Muốn biết họ đồng ý chưa thì hỏi lại rõ ràng.',
      },

      { t: 'h', text: '7. Phát âm: How long have you…, also / too, tên nước ngoài' },
      {
        t: 'p',
        text: 'Trong câu hỏi làm quen, **have** và **you** đọc rất nhẹ: "How long have you been here?" nghe như "hao-lóng-əv-yə-bin-hia". **also** có hai âm tiết, nhấn âm đầu /ˈɔːl/. **too** dài và rõ ở cuối câu. Tên nước ngoài: nhấn đúng âm tiết người ta nhấn.',
      },
      {
        t: 'phatam',
        id: 'gtd13-phat-am',
        title: 'Luyện phát âm — câu hỏi làm quen, also / too và tên riêng',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Đọc nhẹ have / you, rõ ở từ có thông tin (long, here, south).',
        items: [
          { text: 'How long have you been here?', ipa: 'haʊ lɔːŋ əv jə bɪn hɪr', vi: 'have đọc /əv/, you đọc /jə/ · nhấn long và here' },
          { text: 'Which team are you on?', ipa: 'wɪtʃ tiːm ər ju ɑːn', vi: 'which có /tʃ/ cuối · on đọc rõ, xuống giọng' },
          { text: 'What did you do before this?', ipa: 'wʌt dɪd jə duː bɪfɔːr ðɪs', vi: 'did you nối thành "đi-dʒə" · nhấn before' },
          { text: "I'm from the south too.", ipa: 'aɪm frəm ðə saʊθ tuː', vi: 'south: /θ/ cuối, lưỡi giữa hai răng · too kéo dài' },
          { text: 'My mum is also a teacher.', ipa: 'maɪ mʌm ɪz ɔːlsoʊ ə tiːtʃər', vi: 'also: nhấn /ɔːl/, không đọc "an-xô"' },
          { text: "I don't either.", ipa: 'aɪ doʊnt iːðər', vi: 'either: /ˈiːðər/ (Mỹ) · /θ/ không, đây là /ð/ rung' },
          { text: 'Sorry, remind me of your name?', ipa: 'sɑːri rɪmaɪnd mi əv jər neɪm', vi: 'remind nhấn âm sau · lên giọng nhẹ ở name' },
          { text: 'Nice to meet you, Mr Okada.', ipa: 'naɪs tə miːt ju mɪstər oʊkɑːdə', vi: 'Okada: ba âm tiết đều, không nhấn mạnh như tiếng Anh' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: buổi chiều gặp nhóm kiểm thử' },
      {
        t: 'dialogue',
        title: '2 giờ chiều — Lindsay (QA, người Mỹ) vừa đi làm việc với khách về, Quân tới chào',
        lines: [
          { who: 'Quân', role: 'a', text: "Hi, you must be Lindsay. I'm Quân. I'm joining the Osaka team today.", vi: 'Chào chị, chị chắc là Lindsay. Em là Quân. Hôm nay em vào nhóm Osaka.' },
          { who: 'Lindsay', role: 'b', text: 'Oh, hi, Quân! Fiona told us about you. Welcome aboard.', vi: 'Ồ, chào Quân! Fiona có kể về em. Chào mừng em.' },
          { who: 'Quân', role: 'a', text: "Thanks. Fiona said I'll be helping you and Bảo for the first two weeks.", vi: 'Cảm ơn chị. Chị Fiona nói em sẽ hỗ trợ chị và anh Bảo hai tuần đầu.' },
          { who: 'Lindsay', role: 'b', text: "That's right. We'll keep you busy, don't worry.", vi: 'Đúng rồi. Bọn chị sẽ cho em bận rộn, đừng lo.' },
          { who: 'Quân', role: 'a', text: 'How long have you been on the project?', vi: 'Chị làm dự án này bao lâu rồi ạ?' },
          { who: 'Lindsay', role: 'b', text: "About a year. Before this, I was in Singapore for three years. I also did some teaching there.", vi: 'Khoảng một năm. Trước đó chị ở Singapore ba năm. Chị cũng có đi dạy một thời gian ở đó.' },
          { who: 'Quân', role: 'a', text: 'Oh, interesting. What brought you to Vietnam?', vi: 'Ồ, hay quá. Điều gì đưa chị tới Việt Nam vậy?' },
          { who: 'Lindsay', role: 'b', text: "The food, honestly! And the job, of course. Are you from Saigon?", vi: 'Thật lòng là đồ ăn! Và công việc nữa, tất nhiên. Em người Sài Gòn à?' },
          { who: 'Quân', role: 'a', text: "No, I'm from Cần Thơ. Sorry, is Lindsay your first name? I'm still learning everyone's names.", vi: 'Không ạ, em ở Cần Thơ. Xin lỗi, Lindsay là tên của chị đúng không ạ? Em vẫn đang học tên mọi người.' },
          { who: 'Lindsay', role: 'b', text: "Yep, Lindsay Park. Just Lindsay is fine. Let me know if you need anything, okay?", vi: 'Ừ, Lindsay Park. Cứ gọi Lindsay là được. Cần gì cứ báo chị nhé?' },
          { who: 'Quân', role: 'a', text: "Thanks, Lindsay, I will. Nice meeting you. See you around!", vi: 'Cảm ơn chị Lindsay, em sẽ báo ạ. Rất vui được gặp chị. Gặp lại chị sau!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd13-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Quân (5 câu)',
        items: [
          { vi: 'Chào chị, chị chắc là Lindsay.', chips: ['Hi,', 'you', 'must', 'be', 'Lindsay.', 'are', 'should'], answer: ['Hi,', 'you', 'must', 'be', 'Lindsay.'] },
          { vi: 'Hôm nay em vào nhóm Osaka.', chips: ["I'm", 'joining', 'the', 'Osaka', 'team', 'today.', 'join', 'on'], answer: ["I'm", 'joining', 'the', 'Osaka', 'team', 'today.'] },
          { vi: 'Chị làm dự án này bao lâu rồi ạ?', chips: ['How', 'long', 'have', 'you', 'been', 'on', 'the', 'project?', 'do', 'are'], answer: ['How', 'long', 'have', 'you', 'been', 'on', 'the', 'project?'] },
          { vi: 'Điều gì đưa chị tới Việt Nam vậy?', chips: ['What', 'brought', 'you', 'to', 'Vietnam?', 'why', 'bring', 'are'], answer: ['What', 'brought', 'you', 'to', 'Vietnam?'] },
          { vi: 'Lindsay là tên của chị đúng không ạ?', chips: ['Is', 'Lindsay', 'your', 'first', 'name?', 'family', 'are', 'last'], answer: ['Is', 'Lindsay', 'your', 'first', 'name?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd13-noi-tra-loi',
        part: '1',
        questions: [
          "Hi! You're new, aren't you? Which team are you on?",
          'What did you do before you joined us?',
          'How long have you lived in this city?',
          "I'm a big badminton fan. Do you play any sports?",
          "Sorry, remind me of your name? And what do people usually call you?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Venky, a friendly tech lead from Chennai, India, working at a software outsourcing company in Ho Chi Minh City. It is 10 am and I am a new OJT trainee on your team; we were introduced quickly this morning. We meet again at the pantry. Pretend you have forgotten my name and ask me politely. Ask me which project I am on, what I did before, and where I am from. Use B1-level English at a natural speed. When I say something that is also true for you, say so with also or too. If I ask a question in the wrong tense (for example How long do you work here?), gently repeat it the correct way and continue. After 10 turns, end the chat, then tell me in Vietnamese two things I did well and two things to fix."',
          'Làm **2 lượt**. Lượt hai: bạn là người cũ, AI là thực tập sinh mới tên khó đọc (vd "Thiruvenkatam"). Bạn phải hỏi cách gọi, đọc lại cho đúng, và tìm ít nhất **hai** điểm chung bằng also / too.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd13-doc',
    kind: 'reading',
    title: 'Email chào mừng, sơ đồ văn phòng, nội quy',
    goal: 'Đọc hiểu email chào mừng người mới, bảng chỉ dẫn tầng làm việc và nội quy văn phòng có khu dự án bảo mật; nhận ra việc nào bắt buộc, việc nào chỉ là gợi ý.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn văn bản Quân nhận trong buổi sáng đầu tiên: **email chào mừng** của trưởng nhóm, **bảng chỉ dẫn tầng 9**, **nội quy văn phòng**, và **tin nhắn** kèm sơ đồ chỗ ngồi của Pia.',
          'Kỹ năng chính: phân biệt **bắt buộc** (must, are not allowed, please make sure) và **gợi ý** (feel free, you might want to).',
          'Gặp lại also / too trong văn bản thật, và cách người bản xứ viết lịch trình tuần đầu.',
          'Không đọc từng từ. Đọc lướt tìm **giờ, tầng, việc phải làm** trước.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn văn bản sau' },
      {
        t: 'canh',
        anh: ['e-mail', 'office-building', 'locked', 'no-mobile-phones', 'spiral-notepad'],
        caption: '9 giờ 40. Quân ngồi vào bàn, mở máy và đọc những gì được gửi cho mình trong buổi sáng.',
      },
      {
        t: 'passage',
        title: "Quân's first morning — what's in the inbox",
        intro: 'Đọc lướt một lượt để biết mỗi văn bản nói về gì. Lượt hai mới đọc kỹ để làm câu hỏi.',
        paras: [
          {
            label: 'A',
            text: '**From: Fiona Walsh · Subject: Welcome to the Osaka team!** — Hi Quân, welcome aboard! Here\'s a rough plan for your first week. **Monday:** IT will set up your laptop at 10:30. Lunch with Pia (your buddy) at 12. **Tuesday:** security and data protection training, 9–11, room 9B. This is **compulsory** for everyone who works on client projects. **Wednesday & Thursday:** shadow Lindsay and Bảo in QA. **Thursday:** team lunch with Okada-san from Hoshino Retail. **Friday:** a short chat with me at 4 pm about how the week went. **Don\'t worry if you feel a bit lost at first. Everyone does.** Cheers, Fiona',
          },
          {
            label: 'B',
            text: '**LEVEL 9 — FLOOR GUIDE** · ⬅ Left from the lifts: Reception · Meeting rooms 9A–9D · Pantry · ➡ Right from the lifts: Open-plan desks (Osaka & Chicago teams) · Quiet zone (no calls, please) · **Project Room 9E — Hoshino Retail** 🔒 Authorised staff only. **Badge access.** · Restrooms are next to the fire exit. **Canteen: Level 3, 11:30–13:30.**',
          },
          {
            label: 'C',
            text: '**OFFICE HOUSE RULES (summary)** · 1. **Wear your staff badge at all times**, and never lend it to anyone. · 2. **Personal phones, USB drives and cameras are not allowed in Project Room 9E.** Lockers are outside the door. · 3. **Clean desk policy:** please make sure no client documents are left on your desk when you leave. · 4. Visitors must sign in at reception and be **accompanied** at all times. · 5. Pantry: label your food in the fridge. The fridge is **cleared every Friday at 5 pm**. · 6. **Feel free to** book a meeting room for a quick chat, but please cancel it if you don\'t need it.',
          },
          {
            label: 'D',
            text: '**Chat — Pia Santos, 9:52 am:** Hey Quân! As promised, here\'s the seating chart 🗺️ I\'ve added one fun fact next to each name so they\'re easier to remember 😄 (Venky = tech lead, cricket fan, makes amazing coffee · Bảo = QA, also from Cần Thơ!! · Lindsay = QA, ex-teacher like me, plays the ukulele). See you at 12, I\'ll come and get you. **You might want to** bring a jacket, the canteen is freezing!',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd13-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Theo email (A), buổi đào tạo bảo mật thứ Ba có bắt buộc không?',
            options: ['Không, chỉ ai thích thì đi', 'Bắt buộc với mọi người làm dự án của khách', 'Chỉ bắt buộc với trưởng nhóm', 'Email không nói'],
            correct: 1,
            why: '"This is **compulsory** for everyone who works on client projects." compulsory = bắt buộc.',
          },
          {
            q: 'Khi nào Quân nói chuyện riêng với Fiona về tuần đầu?',
            options: ['Thứ Hai lúc 12 giờ', 'Thứ Năm buổi trưa', 'Thứ Sáu lúc 4 giờ chiều', 'Chưa hẹn'],
            correct: 2,
            why: '"**Friday:** a short chat with me **at 4 pm** about how the week went."',
          },
          {
            q: 'Câu "Don\'t worry if you feel a bit lost at first. Everyone does." có giọng điệu thế nào?',
            options: ['Cảnh cáo', 'Trấn an, thân thiện', 'Mỉa mai', 'Ra lệnh'],
            correct: 1,
            why: 'Trưởng nhóm cho phép bạn **thấy bỡ ngỡ**. Kết email bằng "Cheers" cũng là dấu hiệu thân mật (kiểu Anh, Úc).',
          },
          {
            q: 'Theo bảng chỉ dẫn (B), phòng 9E là gì?',
            options: ['Phòng họp ai cũng đặt được', 'Phòng dự án của khách Hoshino, chỉ người được cấp quyền mới vào', 'Khu yên tĩnh', 'Pantry'],
            correct: 1,
            why: '"Project Room 9E — Hoshino Retail 🔒 **Authorised staff only. Badge access.**" Nhiều dự án cho khách Nhật có phòng riêng như vậy.',
          },
          {
            q: 'Quân muốn mang điện thoại cá nhân vào phòng 9E. Nội quy (C) nói gì?',
            options: ['Được, nếu để chế độ im lặng', 'Không được; phải cất ở tủ khoá bên ngoài', 'Được, nếu không chụp ảnh', 'Phải hỏi Pia'],
            correct: 1,
            why: 'Quy định 2: "Personal phones, USB drives and cameras **are not allowed** in Project Room 9E. Lockers are outside the door."',
          },
          {
            q: '"Clean desk policy" yêu cầu gì?',
            options: ['Lau bàn mỗi sáng', 'Không để tài liệu của khách trên bàn khi rời đi', 'Không ăn ở bàn', 'Dọn tủ lạnh thứ Sáu'],
            correct: 1,
            why: '"please make sure **no client documents are left on your desk** when you leave." Đây là quy định bảo mật, không phải chuyện vệ sinh.',
          },
          {
            q: 'Trong tin của Pia (D), ai có điểm chung với Quân?',
            options: ['Venky', 'Bảo', 'Lindsay', 'Fiona'],
            correct: 1,
            why: '"Bảo = QA, **also from Cần Thơ**!!" Một gợi ý bắt chuyện có sẵn.',
          },
          {
            q: '"You might want to bring a jacket" là gì?',
            options: ['Quy định bắt buộc', 'Lời khuyên nhẹ', 'Lời trách', 'Lời mời đi mua áo'],
            correct: 1,
            why: '**You might want to…** = có lẽ bạn nên… Đây là cách khuyên rất mềm, người nghe tự quyết.',
          },
        ],
      },

      { t: 'h', text: '2. Bắt buộc hay chỉ gợi ý?' },
      {
        t: 'table',
        head: ['Cụm trong văn bản', 'Mức', 'Nghĩa'],
        rows: [
          ['must · are not allowed · compulsory', '🔴 Bắt buộc', 'Không làm là vi phạm, có thể bị nhắc nhở hoặc mất quyền vào phòng.'],
          ['at all times · never', '🔴 Bắt buộc', 'Lúc nào cũng phải / không bao giờ được.'],
          ['Please make sure…', '🟠 Gần như bắt buộc', 'Lời lịch sự nhưng là yêu cầu thật.'],
          ['Authorised staff only', '🔴 Bắt buộc', 'Chỉ người được cấp quyền.'],
          ['Feel free to…', '🟢 Tuỳ bạn', 'Cứ thoải mái, không ai bắt.'],
          ['You might want to… · It\'s a good idea to…', '🟢 Lời khuyên', 'Nên làm, không làm cũng không sao.'],
          ['rough plan', 'ℹ️ Thông tin', 'Kế hoạch sơ bộ, có thể đổi.'],
          ['shadow (someone)', 'ℹ️ Thông tin', 'Đi theo xem một người làm việc để học.'],
        ],
        caption: 'Văn bản công sở tiếng Anh rất **lịch sự**, nên yêu cầu bắt buộc nhiều khi nghe như lời mời. "Please make sure…" **không** phải tuỳ ý.',
      },
      {
        t: 'note',
        title: 'Mẹo đọc nội quy ở công ty có dự án nước ngoài',
        items: [
          'Đọc kỹ nhất phần về **thẻ nhân viên, điện thoại, USB, khách tới thăm**. Ở công ty outsourcing, vi phạm bảo mật là lỗi nặng nhất của người mới, nặng hơn đi muộn rất nhiều.',
          'Không chắc một quy định thì **hỏi buddy**: "Sorry, is it okay to…?" Hỏi một lần không ai cười, vi phạm một lần thì ai cũng nhớ.',
          'Câu "Everyone does" / "Don\'t worry" trong email là thật lòng. Người viết **muốn** bạn hỏi.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd13-doc-dien',
        title: 'Điền thông tin từ bốn văn bản (6 câu)',
        kind: 'fill',
        items: [
          { q: 'IT sẽ cài máy cho Quân lúc ___ sáng thứ Hai.', answers: ['10:30', '10.30', '10h30'] },
          { q: 'Căng tin ở tầng ___.', answers: ['3', 'three', 'Level 3'] },
          { q: 'Muốn gọi điện thì KHÔNG ngồi ở khu ___ zone.', answers: ['quiet'] },
          { q: 'Tủ lạnh pantry bị dọn sạch mỗi thứ ___ lúc 5 giờ chiều. (tiếng Anh)', answers: ['Friday', 'Fri'] },
          { q: 'Khách tới thăm phải ký tên ở ___ và luôn có người đi kèm. (tiếng Anh)', answers: ['reception', 'the reception'] },
          { q: 'Lindsay cũng từng là ___ giống Pia. (tiếng Anh, một từ)', answers: ['teacher', 'a teacher'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd13-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 13',
    goal: 'Làm 36 câu có đáp án để hỏi làm quen đúng thì, nối điểm chung bằng also / too / either, gọi đúng tên người nhiều nước và ôn lại Ngày 11–12.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 36 câu**: chọn câu hợp cảnh · điền also / too / either · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 11** (quá khứ đơn) và **Ngày 12** (hiện tại hoàn thành), vì câu hỏi làm quen dùng cả hai.',
          'Sai câu nào: đọc giải thích, rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **29/36** trở lên là sẵn sàng sang Ngày 14.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd13-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn muốn biết một đồng nghiệp làm ở công ty bao lâu rồi. Câu nào đúng?',
            options: ['How long do you work here?', 'How long have you been here?', 'How long are you here?', 'How long did you work here?'],
            correct: 1,
            why: 'Việc bắt đầu từ trước và **vẫn đang tiếp diễn** ⇒ have + V3: **How long have you been here?** "How long did you work here?" là hỏi về một công việc **đã nghỉ**.',
          },
          {
            q: 'Danh thiếp của khách in "Kenji Matsuda". Bạn gọi ông ấy thế nào?',
            options: ['Mr Kenji', 'Kenji-san', 'Mr Matsuda', 'Matsuda Kenji-san'],
            correct: 2,
            why: 'Danh thiếp tiếng Anh in tên trước: Kenji là tên, **Matsuda là họ**. Mr đi với họ: **Mr Matsuda** (hoặc Matsuda-san).',
          },
          {
            q: 'Sáng nay bạn được giới thiệu với một chị ở phòng nhân sự. Giờ gặp lại mà quên tên. Bạn nói:',
            options: ["What's your name?", "Sorry, remind me of your name? I've met so many people today.", 'Hey, you!', "Sorry, I didn't catch your name."],
            correct: 1,
            why: 'Đã được giới thiệu rồi mà quên ⇒ **remind me**. "I didn\'t catch your name" dùng ngay lúc vừa nghe chưa rõ (Ngày 1).',
          },
          {
            q: 'Đồng nghiệp: "I don\'t really like spicy food." Bạn cũng không thích. Bạn đáp:',
            options: ["I don't too.", "Me too, I don't.", "I don't either.", "I also don't."],
            correct: 2,
            why: 'Câu phủ định ⇒ **either**: I don\'t either. (hoặc thân mật: Me neither.)',
          },
          {
            q: 'Bạn muốn hỏi một đồng nghiệp người Mỹ vì sao sang Việt Nam làm. Câu nào thân thiện nhất?',
            options: ['Why are you in Vietnam?', 'What brought you to Vietnam?', 'Why do you come here?', 'What is your reason?'],
            correct: 1,
            why: '**What brought you to…?** tò mò mà mềm. "Why are you in Vietnam?" nghe như bị tra hỏi.',
          },
          {
            q: 'Đồng nghiệp người Ấn nghiêng đầu qua lại khi bạn hỏi "Can I sit here?". Nhiều khả năng nghĩa là:',
            options: ['Không được', 'Được, ok', 'Họ đang khó chịu', 'Họ không hiểu'],
            correct: 1,
            why: 'Cái nghiêng đầu qua lại (head wobble) của nhiều người Ấn thường là **"ừ, được, hiểu rồi"**. Không chắc thì nhìn nét mặt, hoặc hỏi lại.',
          },
          {
            q: 'Bạn tự giới thiệu với khách Nhật. Câu nào đúng?',
            options: ["Hello, I'm Quân-san.", "Good afternoon. I'm Quân. I joined the team today.", "Hey, what's up?", "Hello, Mr Hiroshi, I'm Mr Quân."],
            correct: 1,
            why: 'Với khách: chào trang trọng + tên + mình là ai. Không gắn -san / Mr vào tên **mình**.',
          },
          {
            q: 'Nội quy viết: "Please make sure no client documents are left on your desk." Bạn hiểu là:',
            options: ['Nên làm nếu rảnh', 'Yêu cầu thật, phải làm', 'Chỉ áp dụng cho trưởng nhóm', 'Lời mời'],
            correct: 1,
            why: '"Please make sure…" là cách **lịch sự** để đưa ra một yêu cầu thật.',
          },
          {
            q: '(Ôn Ngày 12) Pia vừa nghe tin bạn được nhận vào dự án. Câu nào đúng ngữ pháp?',
            options: ["I've just heard you're on the Osaka project!", 'I just have heard you are on the Osaka project!', "I've heard just you're on the Osaka project!", 'I hear just you are on the Osaka project!'],
            correct: 0,
            why: 'Hiện tại hoàn thành với **just**: have + **just** + V3. Just đứng giữa have và V3.',
          },
          {
            q: '(Ôn Ngày 11) "Trước đây chị làm ở đâu?" Câu nào đúng?',
            options: ['Where do you work before?', 'Where did you work before?', 'Where did you worked before?', 'Where you worked before?'],
            correct: 1,
            why: 'Hỏi việc **đã xong** ở quá khứ ⇒ did + V nguyên mẫu: **Where did you work before?** Có did rồi thì động từ về nguyên mẫu (~~did you worked~~), và câu hỏi phải có did (~~Where you worked~~).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền also / too / either' },
      {
        t: 'quiz',
        id: 'gtd13-bt-dien',
        title: 'Phần II — Điền also, too hoặc either (8 câu)',
        kind: 'fill',
        grammar: 'also: sau be / trước động từ thường · too: cuối câu khẳng định · either: cuối câu phủ định',
        items: [
          { q: "Venky is from the south of India. I'm from the south ___.", answers: ['too'] },
          { q: 'My mum is ___ a teacher. (giữa câu)', answers: ['also'] },
          { q: "Lindsay doesn't drink coffee. I don't ___.", answers: ['either'] },
          { q: "I ___ play badminton on Sundays. (giữa câu)", answers: ['also'] },
          { q: "Pia hasn't met Okada-san. Bảo hasn't met him ___.", answers: ['either'] },
          { q: 'Bảo is from Cần Thơ ___! (cuối câu)', answers: ['too'] },
          { q: "I'm on the Osaka project. I'm ___ helping the QA team.", answers: ['also'] },
          { q: "Fiona can't speak Vietnamese. Venky can't ___.", answers: ['either'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd13-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'How long have you…? · What did you do before…? · Which … are you on? · also / too / either',
        items: [
          { q: 'Chị sống ở Sài Gòn bao lâu rồi?', hint: 'how long, have you lived', answers: ['How long have you lived in Saigon?', 'How long have you been living in Saigon?', 'How long have you lived in Ho Chi Minh City?', 'How long have you been in Saigon?'] },
          { q: 'Anh làm dự án nào ạ?', hint: 'which project, on', answers: ['Which project are you on?', 'What project are you on?', 'Which project are you working on?', 'What project are you working on?'] },
          { q: 'Mọi người thường gọi anh là gì?', hint: 'people, usually, call', answers: ['What do people usually call you?', 'What do people normally call you?', 'What does everyone usually call you?'] },
          { q: 'Em xin lỗi, em quên tên chị mất rồi.', hint: "so sorry, I've forgotten", answers: ["I'm so sorry, I've forgotten your name.", "I'm sorry, I've forgotten your name.", "Sorry, I've forgotten your name.", "I'm so sorry, I forgot your name.", "Sorry, I forgot your name."] },
          { q: 'Okada là tên hay họ của ông ạ?', hint: 'first name, family name', answers: ['Is Okada your first name or your family name?', 'Is Okada your first name or family name?', 'Is Okada your given name or your family name?', 'Is Okada your first name or your last name?', 'Is Okada your first name or last name?'] },
          { q: 'Mẹ em cũng là giáo viên. (dùng also)', hint: 'also', answers: ['My mum is also a teacher.', 'My mom is also a teacher.', 'My mother is also a teacher.'] },
          { q: 'Cần gì cứ báo anh nhé.', hint: 'let me know, need', answers: ['Let me know if you need anything.', 'Let me know if you need anything, okay?', 'Just let me know if you need anything.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd13-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Which team are you on?', answer: 'Which team are you on?' },
          { label: 'Câu 2', spell: 'How long have you lived in Saigon?', answer: 'How long have you lived in Saigon?' },
          { label: 'Câu 3', spell: "I don't play tennis either.", answer: "I don't play tennis either.", alt: ['I do not play tennis either.', "I don't play tennis, either."] },
          { label: 'Câu 4', spell: 'What brought you to Vietnam?', answer: 'What brought you to Vietnam?' },
          { label: 'Câu 5', spell: "I'm afraid I don't have a business card yet.", answer: "I'm afraid I don't have a business card yet.", alt: ["I'm afraid I do not have a business card yet.", 'I am afraid I do not have a business card yet.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd13-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (6 câu)',
        items: [
          { vi: 'Hôm nay em vào nhóm theo diện thực tập OJT.', chips: ["I'm", 'joining', 'the', 'team', 'as', 'an', 'OJT', 'trainee.', 'like', 'a'], answer: ["I'm", 'joining', 'the', 'team', 'as', 'an', 'OJT', 'trainee.'] },
          { vi: 'Chị làm ở công ty bao lâu rồi ạ?', chips: ['How', 'long', 'have', 'you', 'been', 'with', 'the', 'company?', 'did', 'are'], answer: ['How', 'long', 'have', 'you', 'been', 'with', 'the', 'company?'] },
          { vi: 'Trước khi vào đây chị làm gì?', chips: ['What', 'did', 'you', 'do', 'before', 'this?', 'does', 'done'], answer: ['What', 'did', 'you', 'do', 'before', 'this?'] },
          { vi: 'Mọi người hay nhầm hai đứa mình.', chips: ['People', 'mix', 'us', 'up', 'all', 'the', 'time.', 'mixes', 'down'], answer: ['People', 'mix', 'us', 'up', 'all', 'the', 'time.'] },
          { vi: 'Em đọc vậy đúng chưa ạ?', chips: ['Am', 'I', 'saying', 'it', 'right?', 'Do', 'say', 'true'], answer: ['Am', 'I', 'saying', 'it', 'right?'] },
          { vi: 'Em cũng đang hỗ trợ nhóm kiểm thử.', chips: ["I'm", 'also', 'helping', 'the', 'QA', 'team.', 'too', 'help'], answer: ["I'm", 'also', 'helping', 'the', 'QA', 'team.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Viết **sơ đồ chỗ ngồi** của lớp học / nhóm làm việc của bạn: mỗi người một tên + một chi tiết, đúng kiểu Pia. Đọc to: "This is…, he\'s… He also…"',
          'Chuẩn bị **3 câu hỏi làm quen** bạn sẽ hỏi người mới gặp tiếp theo (Which team…? How long have you…? What did you do before…?).',
          'Ngày 14: small talk công sở. Chủ đề nào an toàn, chủ đề nào nên né, và câu hỏi đuôi "…, isn\'t it?".',
        ],
      },
    ],
  },
];
