/**
 * Tiếng Anh giao tiếp — NGÀY 16 (chặng 3 "Công sở, không kỹ thuật", B1): xin nghỉ, báo ốm, báo trễ, xin về sớm.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd16-`.
 * Ngữ pháp trong câu: nêu lý do bằng because / since / as (+ because of + danh từ) · won't be able to + V · I'm afraid…
 * · nối câu bằng `so` (kết quả) — không đi chung với because.
 * Cảnh: Yến — sinh viên IT năm 3, tháng thứ ba OJT ở Pinegate Digital (Quận 7, TP.HCM), quản lý trực tiếp là Rachel (Mỹ):
 * gọi báo trễ vì tai nạn trên cầu (lỡ buổi dẫn thực tập sinh mới đi tham quan văn phòng, nhờ Joel thay, "text me your ETA"),
 * xin về sớm gặp giảng viên + xin nghỉ đám giỗ ông trùng ngày chuyển văn phòng (Gareth), gọi báo ốm cúm và định "vẫn làm
 * ở nhà" thì bị quản lý cản.
 * Khác Ngày 7 (Khôi đi hiệu thuốc, gọi phòng khám, gặp bác sĩ ở Manchester): hôm nay là nói với QUẢN LÝ — xin phép, nêu lý do,
 * thu xếp người làm thay, bao giờ quay lại. Khác Ngày 11 (mưa ngập, xe chết máy — kể chuyện): ở đây là cuộc gọi báo trễ.
 * Email báo nghỉ cho khách / trả lời tự động ⇒ khoá Technical English at Work.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_16: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd16-nghe',
    kind: 'listening',
    title: 'Xin nghỉ, báo ốm, báo trễ, xin về sớm',
    goal: 'Nghe hiểu ba cuộc nói chuyện với quản lý: báo trễ qua điện thoại, xin về sớm và xin nghỉ một ngày, gọi báo ốm; nhận ra quản lý cần những thông tin gì và câu nào của họ là "không cần xin lỗi".',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Yến**, sinh viên IT năm 3, đang ở **tháng thứ ba** OJT ở **Pinegate Digital**, Quận 7, TP.HCM. Quản lý trực tiếp là chị **Rachel** (Mỹ); cùng phòng có **Joel** (Canada) và anh **Gareth** (Anh) lo hành chính văn phòng.',
          'Ngày 15 bạn đã học nhờ đồng nghiệp. Hôm nay là việc khó nói hơn: **xin phép quản lý**, khi bạn trễ, khi bạn cần nghỉ, khi bạn ốm.',
          'Quản lý nước ngoài muốn nghe **4 thông tin, theo thứ tự**: chuyện gì · bao lâu / tới khi nào · việc của bạn ai lo · bao giờ bạn báo tiếp. Lý do chỉ cần **một câu**.',
          'Bạn sẽ nghe lý do được nối bằng **because**, **since**, **as**, và câu **I won\'t be able to…** (tôi sẽ không thể…).',
          'Tốc độ khoảng **150 từ/phút**; cảnh 1 là điện thoại giữa đường, có tiếng xe. Lần 1 chỉ bắt: **trễ bao lâu, nghỉ hôm nào, ai làm thay**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — 8 giờ 35, kẹt trên cầu: gọi báo trễ' },
      {
        t: 'canh',
        anh: ['motor-scooter', 'construction', 'automobile', 'mobile-phone', 'eight-thirty'],
        caption: 'Sáng thứ Ba. **Yến** ngồi sau xe ôm công nghệ, kẹt cứng trên cầu vì phía trước có tai nạn. 9 giờ cô phải **dẫn hai thực tập sinh mới đi một vòng văn phòng**. Cô gọi cho chị **Rachel**, rồi gọi **Joel**.',
      },
      {
        t: 'listen',
        id: 'gtd16-nghe-canh1',
        title: 'Scene 1 — Stuck on the bridge',
        note: 'Nghe xem: Yến trễ bao lâu và vì sao, việc gì bị ảnh hưởng, ai làm thay, và Rachel dặn gì cuối cuộc gọi.',
        lines: [
          { who: 'Rachel', voice: 'us-nu', text: 'Hi Yến, good morning. Everything okay?', vi: 'Chào Yến, chào buổi sáng. Mọi chuyện ổn chứ?' },
          { who: 'Yến', voice: 'ie-nu', text: "Morning, Rachel. Sorry to call so early. I'm afraid I'm running late. There's been an accident on the bridge, and the traffic isn't moving at all.", vi: 'Chào chị Rachel. Xin lỗi gọi chị sớm thế này. Em e là em sẽ đến trễ. Trên cầu vừa có tai nạn, xe cộ đứng im luôn.' },
          { who: 'Rachel', voice: 'us-nu', text: 'Oh no. Are you okay?', vi: 'Ôi trời. Em có sao không?' },
          { who: 'Yến', voice: 'ie-nu', text: "I'm fine. I'm on the back of a Grab bike, and we're just stuck.", vi: 'Em không sao. Em đang ngồi sau xe Grab, chỉ là kẹt thôi.' },
          { who: 'Rachel', voice: 'us-nu', text: "Sorry, it's really noisy there. How late did you say?", vi: 'Xin lỗi, chỗ em ồn quá. Em nói em trễ bao lâu?' },
          { who: 'Yến', voice: 'ie-nu', text: 'About half an hour. I should be there by nine thirty.', vi: 'Khoảng nửa tiếng ạ. Chắc chín rưỡi em tới.' },
          { who: 'Rachel', voice: 'us-nu', text: "Okay, thanks for letting me know. Wait, weren't you doing the office tour for the new interns at nine?", vi: 'Được, cảm ơn em đã báo. Khoan, không phải chín giờ em dẫn thực tập sinh mới đi tham quan văn phòng à?' },
          { who: 'Yến', voice: 'ie-nu', text: "Yes, that's the problem. Since I won't be able to get there by nine, could someone else start the tour?", vi: 'Vâng, đó mới là vấn đề. Vì em không thể tới trước chín giờ, có ai bắt đầu buổi tham quan thay em được không ạ?' },
          { who: 'Rachel', voice: 'us-nu', text: "I've got back-to-back meetings all morning. Could you ask Joel? He's usually in by eight.", vi: 'Chị họp liền mạch cả sáng. Em hỏi Joel được không? Cậu ấy thường tám giờ đã có mặt.' },
          { who: 'Yến', voice: 'ie-nu', text: "Sure, I'll call him now. And I'll make up the time this evening.", vi: 'Dạ, em gọi anh ấy ngay. Và tối nay em sẽ làm bù giờ.' },
          { who: 'Rachel', voice: 'us-nu', text: "Don't worry about that. It's not your fault. Just text me your ETA when you're moving again.", vi: 'Đừng lo chuyện đó. Đâu phải lỗi của em. Khi nào xe chạy lại thì nhắn chị ETA của em là được.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Sorry, my… ETA?', vi: 'Xin lỗi chị, "ETA" của em là…?' },
          { who: 'Rachel', voice: 'us-nu', text: 'Your estimated time of arrival. When you think you\'ll get here.', vi: 'Giờ dự kiến em tới nơi. Lúc em nghĩ là em tới được.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Oh, okay. Will do. Sorry again, Rachel.', vi: 'À, em hiểu rồi. Em sẽ nhắn ạ. Một lần nữa em xin lỗi chị.' },
          { who: 'Rachel', voice: 'us-nu', text: 'No need to apologise. Stay safe.', vi: 'Không cần xin lỗi đâu. Đi cẩn thận nhé.' },
          { who: 'Joel', voice: 'ca-nam', text: "Hey Yến, what's up?", vi: 'Chào Yến, có chuyện gì thế?' },
          { who: 'Yến', voice: 'ie-nu', text: "Hi Joel, quick favour. I'm stuck in traffic because of an accident, so I won't make it by nine. Would you mind starting the office tour for the two new interns? I'll take over when I get there.", vi: 'Chào anh Joel, nhờ anh chút việc. Em kẹt xe vì có tai nạn nên không kịp chín giờ. Anh bắt đầu buổi tham quan văn phòng cho hai bạn thực tập mới giúp em được không? Em tới thì em làm tiếp.' },
          { who: 'Joel', voice: 'ca-nam', text: 'No problem. Where do I start?', vi: 'Không sao. Anh bắt đầu từ đâu?' },
          { who: 'Yến', voice: 'ie-nu', text: 'Reception first, then the kitchen and the fire exits. The checklist is on my desk.', vi: 'Quầy lễ tân trước, rồi bếp với lối thoát hiểm. Danh sách việc cần làm ở trên bàn em.' },
          { who: 'Joel', voice: 'ca-nam', text: "Got it. Take your time, and don't text on the bike!", vi: 'Rõ rồi. Cứ từ từ, và đừng nhắn tin khi đang ngồi xe nhé!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd16-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Yến đến trễ?',
            options: ['Xe của cô bị hỏng', 'Cô ngủ quên', 'Có tai nạn trên cầu, xe không chạy được', 'Trời mưa ngập đường'],
            correct: 2,
            why: '"**There\'s been an accident on the bridge**, and the traffic isn\'t moving at all."',
          },
          {
            q: 'Yến dự kiến tới văn phòng lúc mấy giờ?',
            options: ['8 giờ 35', '9 giờ', '9 giờ 30', '10 giờ'],
            correct: 2,
            why: '"About half an hour. I should be there **by nine thirty**." by = muộn nhất là.',
          },
          {
            q: 'Rachel phản ứng thế nào khi Yến nói sẽ làm bù giờ buổi tối?',
            options: ['Đồng ý, bảo Yến ở lại tới 7 giờ', 'Bảo không cần, vì không phải lỗi của Yến', 'Bảo Yến trừ vào ngày phép', 'Không trả lời'],
            correct: 1,
            why: '"**Don\'t worry about that. It\'s not your fault.**" Trễ vì tai nạn giao thông, quản lý thường không bắt làm bù.',
          },
          {
            q: '"Text me your ETA" nghĩa là Rachel muốn Yến làm gì?',
            options: ['Nhắn tên tài xế', 'Nhắn giờ dự kiến tới nơi', 'Nhắn ảnh vụ tai nạn', 'Nhắn lý do trễ'],
            correct: 1,
            why: '**ETA = estimated time of arrival**, giờ dự kiến tới nơi. Rất hay gặp ở công sở và trong ứng dụng gọi xe.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Bàn của Rachel: xin về sớm và xin nghỉ đám giỗ' },
      {
        t: 'canh',
        anh: ['woman-office-worker', 'spiral-calendar', 'school', 'candle', 'package'],
        caption: 'Chiều thứ Tư. **Yến** cần **về sớm thứ Năm tuần sau** để gặp giảng viên hướng dẫn OJT ở trường, và **nghỉ thứ Sáu** về Bến Tre dự đám giỗ ông nội. Cô tới bàn chị **Rachel**. Anh **Gareth** (Anh) đang lo vụ chuyển văn phòng cũng có mặt.',
      },
      {
        t: 'listen',
        id: 'gtd16-nghe-canh2',
        title: "Scene 2 — At Rachel's desk",
        note: 'Nghe xem: Yến xin về lúc mấy giờ, Rachel hỏi gì về đám giỗ, ngày thứ Sáu có chuyện gì, và Yến đưa ra giải pháp nào.',
        lines: [
          { who: 'Yến', voice: 'ie-nu', text: "Rachel, have you got a minute? I'd like to ask about some time off.", vi: 'Chị Rachel, chị có rảnh một phút không ạ? Em muốn hỏi về việc xin nghỉ.' },
          { who: 'Rachel', voice: 'us-nu', text: 'Sure. Grab a seat.', vi: 'Được chứ. Em ngồi đi.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Thanks. Next Thursday, my university wants me to come in for a meeting with my OJT supervisor at four. Would it be okay if I left at three that day?', vi: 'Em cảm ơn. Thứ Năm tuần sau, trường muốn em lên gặp giảng viên hướng dẫn OJT lúc bốn giờ. Hôm đó em về lúc ba giờ có được không ạ?' },
          { who: 'Rachel', voice: 'us-nu', text: "Thursday the third? That's fine. Just put it in the team calendar.", vi: 'Thứ Năm ngày mùng ba hả? Được. Em chỉ cần ghi vào lịch nhóm.' },
          { who: 'Yến', voice: 'ie-nu', text: 'I will. And there\'s one more thing. I was wondering if I could take Friday off as well.', vi: 'Dạ. Còn một việc nữa. Em đang muốn hỏi không biết em có thể nghỉ luôn thứ Sáu được không.' },
          { who: 'Rachel', voice: 'us-nu', text: "The fourth? What's happening?", vi: 'Ngày mùng bốn à? Có chuyện gì thế?' },
          { who: 'Yến', voice: 'ie-nu', text: "It's my grandfather's death anniversary. We call it giỗ. As it's a big family day, my parents want all the grandchildren to come back to Bến Tre.", vi: 'Đó là ngày giỗ ông nội em. Tiếng Việt gọi là "giỗ". Vì đây là ngày lớn của cả họ, bố mẹ em muốn tất cả các cháu về Bến Tre.' },
          { who: 'Rachel', voice: 'us-nu', text: "Oh, I'm sorry. Is it a sad occasion?", vi: 'Ồ, chị rất tiếc. Đó là dịp buồn à?' },
          { who: 'Yến', voice: 'ie-nu', text: "Not really, actually. He passed away eight years ago. It's more like a family reunion. We cook a big meal and remember him together.", vi: 'Thật ra không hẳn ạ. Ông mất tám năm rồi. Nó giống một buổi họp mặt gia đình hơn. Cả nhà nấu một bữa lớn và cùng tưởng nhớ ông.' },
          { who: 'Rachel', voice: 'us-nu', text: "That sounds lovely. The only issue is that Friday's the office move. Gareth, have you got a sec?", vi: 'Nghe hay quá. Vấn đề duy nhất là thứ Sáu chuyển văn phòng. Gareth, anh rảnh chút không?' },
          { who: 'Gareth', voice: 'uk-nam', text: "Hiya. What's up?", vi: 'Chào. Có chuyện gì thế?' },
          { who: 'Rachel', voice: 'us-nu', text: "Yến won't be in on Friday. Is that going to be a problem for the move?", vi: 'Yến sẽ không có mặt hôm thứ Sáu. Việc đó có gây khó cho vụ chuyển văn phòng không?' },
          { who: 'Gareth', voice: 'uk-nam', text: 'Hmm. Everyone has to pack their own desk, because the movers arrive at eight on Friday morning.', vi: 'Ừm. Ai cũng phải tự đóng đồ ở bàn mình, vì tám giờ sáng thứ Sáu bên chuyển nhà đã tới.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Since I won\'t be able to come on Friday, could I pack my desk on Thursday morning instead?', vi: 'Vì thứ Sáu em không thể tới, em đóng đồ ở bàn mình vào sáng thứ Năm thay được không ạ?' },
          { who: 'Gareth', voice: 'uk-nam', text: "That works. I'll leave you a couple of boxes. Just label everything with your name and your new desk number.", vi: 'Được đấy. Anh để sẵn cho em vài cái thùng. Nhớ dán nhãn mọi thứ, ghi tên em và số bàn mới.' },
          { who: 'Rachel', voice: 'us-nu', text: "Great. So put in a leave request for Friday, and I'll approve it today.", vi: 'Tốt. Vậy em gửi đơn xin nghỉ ngày thứ Sáu trên hệ thống, chị duyệt luôn trong hôm nay.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Thank you so much, Rachel. I really appreciate it.', vi: 'Em cảm ơn chị Rachel rất nhiều. Em thật sự cảm kích.' },
          { who: 'Rachel', voice: 'us-nu', text: 'Of course. Family comes first.', vi: 'Có gì đâu. Gia đình là trên hết mà.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd16-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Thứ Năm tuần sau Yến xin gì?',
            options: ['Nghỉ cả ngày', 'Về lúc ba giờ để gặp giảng viên hướng dẫn', 'Làm ở nhà', 'Đi muộn một tiếng'],
            correct: 1,
            why: '"Would it be okay if I **left at three** that day?" vì 4 giờ có hẹn với **OJT supervisor** ở trường.',
          },
          {
            q: 'Vì sao thứ Sáu là vấn đề?',
            options: ['Có khách tới thăm', 'Hôm đó chuyển văn phòng, ai cũng phải tự đóng đồ ở bàn mình', 'Rachel đi công tác', 'Hôm đó là hạn nộp báo cáo'],
            correct: 1,
            why: '"Friday\'s **the office move**." Gareth: "Everyone has to **pack their own desk**, because the movers arrive at eight."',
          },
          {
            q: 'Yến giải quyết thế nào?',
            options: ['Bỏ không về quê', 'Nhờ Joel đóng đồ giúp', 'Đóng đồ ở bàn mình vào sáng thứ Năm', 'Đi làm buổi sáng thứ Sáu rồi mới về'],
            correct: 2,
            why: '"Since I won\'t be able to come on Friday, **could I pack my desk on Thursday morning instead?**" Xin nghỉ kèm **giải pháp** là cách quản lý nước ngoài rất thích.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — 7 giờ sáng thứ Hai: gọi báo ốm' },
      {
        t: 'canh',
        anh: ['bed', 'face-with-thermometer', 'telephone-receiver', 'teacup-without-handle', 'pill'],
        caption: 'Thứ Hai tuần sau (30 tháng 11). **Yến** sốt cao từ đêm, đau nhức khắp người, có lẽ là cúm. Cô gọi cho chị **Rachel** trước giờ làm.',
      },
      {
        t: 'listen',
        id: 'gtd16-nghe-canh3',
        title: 'Scene 3 — Calling in sick',
        note: 'Nghe xem: Yến đề nghị gì và Rachel trả lời thế nào, khi nào cần giấy bác sĩ, và hai người hẹn liên lạc lại lúc nào.',
        lines: [
          { who: 'Rachel', voice: 'us-nu', text: "Morning, Yến. You sound terrible. What's wrong?", vi: 'Chào Yến. Giọng em nghe tệ quá. Em bị sao thế?' },
          { who: 'Yến', voice: 'ie-nu', text: "Morning, Rachel. I'm not feeling well at all. I've had a high temperature since last night, and I ache all over. I think I've come down with the flu.", vi: 'Chào chị Rachel. Em mệt lắm ạ. Em sốt cao từ tối qua và đau nhức khắp người. Em nghĩ em bị cúm rồi.' },
          { who: 'Rachel', voice: 'us-nu', text: "Oh, you poor thing. Don't come in today. Stay home and rest.", vi: 'Ôi, tội em. Hôm nay đừng tới nữa. Ở nhà nghỉ ngơi đi.' },
          { who: 'Yến', voice: 'ie-nu', text: "Thank you. I won't be able to come in, but I can still work from home this afternoon if I feel better.", vi: 'Em cảm ơn chị. Em không thể lên văn phòng, nhưng chiều nay nếu đỡ thì em vẫn làm ở nhà được ạ.' },
          { who: 'Rachel', voice: 'us-nu', text: "Please don't. Sick days are for getting better. Joel can cover your tasks for a day or two.", vi: 'Thôi em đừng. Ngày nghỉ ốm là để khoẻ lại. Joel làm thay việc của em một hai ngày được.' },
          { who: 'Yến', voice: 'ie-nu', text: 'Okay. Do I need a doctor\'s note?', vi: 'Dạ. Em có cần giấy bác sĩ không ạ?' },
          { who: 'Rachel', voice: 'us-nu', text: "Only if you're off for more than two days. That's company policy. Just log it as sick leave in the system when you can.", vi: 'Chỉ khi em nghỉ quá hai ngày. Đó là quy định của công ty. Khi nào tiện thì em ghi nghỉ ốm vào hệ thống là được.' },
          { who: 'Yến', voice: 'ie-nu', text: "I'm really sorry for the trouble, Rachel. I know it's a busy week.", vi: 'Em thật sự xin lỗi vì làm phiền chị. Em biết tuần này bận lắm.' },
          { who: 'Rachel', voice: 'us-nu', text: "Hey, you don't need to apologise for being sick. It happens to everyone.", vi: 'Này, em không cần xin lỗi vì bị ốm đâu. Ai mà chẳng có lúc ốm.' },
          { who: 'Yến', voice: 'ie-nu', text: "Thanks. I'll message you tomorrow morning to let you know if I can come in.", vi: 'Em cảm ơn chị. Sáng mai em nhắn chị để báo em có đi làm được không.' },
          { who: 'Rachel', voice: 'us-nu', text: 'Perfect. Keep me posted. And drink lots of water!', vi: 'Tốt lắm. Có gì báo chị nhé. Và uống nhiều nước vào!' },
          { who: 'Yến', voice: 'ie-nu', text: 'I will. Thanks, Rachel.', vi: 'Dạ, em sẽ uống. Cảm ơn chị Rachel.' },
          { who: 'Rachel', voice: 'us-nu', text: 'Feel better soon.', vi: 'Mau khoẻ nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd16-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Yến đề nghị gì, và Rachel trả lời ra sao?',
            options: ['Đề nghị đi làm buổi chiều; Rachel đồng ý', 'Đề nghị làm ở nhà buổi chiều nếu đỡ; Rachel bảo đừng, nghỉ ốm là để khoẻ lại', 'Đề nghị nghỉ cả tuần; Rachel từ chối', 'Đề nghị đổi ngày nghỉ; Rachel đồng ý'],
            correct: 1,
            why: 'Yến: "I can still **work from home** this afternoon…" Rachel: "**Please don\'t. Sick days are for getting better.**" Ở nhiều công ty nước ngoài, quản lý không muốn bạn làm việc khi đang nghỉ ốm.',
          },
          {
            q: 'Khi nào Yến cần giấy bác sĩ?',
            options: ['Luôn luôn', 'Khi nghỉ quá hai ngày', 'Khi nghỉ quá một tuần', 'Không bao giờ'],
            correct: 1,
            why: '"Only if you\'re off for **more than two days**. That\'s company policy." Mỗi công ty một quy định, nên hỏi như Yến là đúng.',
          },
          {
            q: '"Keep me posted" nghĩa là gì?',
            options: ['Gửi thư cho chị', 'Đăng lên nhóm chat', 'Cập nhật tình hình cho chị', 'Giữ bí mật'],
            correct: 2,
            why: '**Keep me posted** = báo tin cho tôi khi có gì mới. Yến đã hứa trước: "I\'ll message you tomorrow morning."',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Chú ý: **won\'t** (sẽ không, /woʊnt/) nghe rất giống **want** (muốn, /wɑːnt/); **I\'m afraid**, **there\'s been**, **I\'ll** đều bị nói lướt.',
      },
      {
        t: 'dictation',
        id: 'gtd16-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — báo trễ', spell: "I'm afraid I'm running late.", answer: "I'm afraid I'm running late.", alt: ['I am afraid I am running late.'] },
          { label: 'Câu 2 — lý do', spell: "There's been an accident on the bridge.", answer: "There's been an accident on the bridge.", alt: ['There has been an accident on the bridge.'] },
          { label: 'Câu 3 — giờ tới', spell: 'I should be there by nine thirty.', answer: 'I should be there by nine thirty.', alt: ['I should be there by 9:30.', 'I should be there by 9.30.', 'I should be there by nine-thirty.'] },
          { label: 'Câu 4 — since + won\'t be able to', spell: "Since I won't be able to get there by nine, could someone else start the tour?", answer: "Since I won't be able to get there by nine, could someone else start the tour?", alt: ["Since I won't be able to get there by 9, could someone else start the tour?"] },
          { label: 'Câu 5 — xin về sớm', spell: 'Would it be okay if I left at three that day?', answer: 'Would it be okay if I left at three that day?', alt: ['Would it be OK if I left at three that day?', 'Would it be okay if I left at 3 that day?'] },
          { label: 'Câu 6 — xin nghỉ', spell: 'I was wondering if I could take Friday off as well.', answer: 'I was wondering if I could take Friday off as well.' },
          { label: 'Câu 7 — báo ốm', spell: "I won't be able to come in today.", answer: "I won't be able to come in today.", alt: ['I will not be able to come in today.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Thanks for letting me know.', 'Cảm ơn đã báo. **Báo là đúng**, quản lý không giận.', "Of course. I'll keep you updated."],
          ["Don't worry about that. It's not your fault.", 'Không cần làm bù, không cần áy náy.', 'Thanks, Rachel.'],
          ['No need to apologise.', 'Đừng xin lỗi nữa. Xin lỗi một lần là đủ.', '(cảm ơn thay vì xin lỗi tiếp) Thanks for understanding.'],
          ['Text me your ETA.', 'Nhắn giờ dự kiến bạn tới.', 'Will do.'],
          ['Put in a leave request.', 'Gửi đơn xin nghỉ trên hệ thống (để có giấy tờ).', "I'll do it right after this."],
          ["Please don't (log on).", 'Thật sự đừng làm việc. **Không phải** khách sáo.', "Okay, I'll rest. Thanks."],
          ['Keep me posted.', 'Có gì mới thì báo tôi.', "I will. I'll message you tomorrow morning."],
          ['That works.', 'Phương án đó được.', 'Great, thank you.'],
          ['Family comes first.', 'Gia đình là trên hết. Câu rất hay nghe khi xin nghỉ vì việc nhà.', 'Thank you. I really appreciate it.'],
        ],
        caption: 'Quản lý Mỹ, Anh, Úc thường **cảm ơn vì bạn báo sớm** hơn là trách bạn trễ. Thứ họ không chấp nhận được là **không báo gì**.',
      },
      {
        t: 'note',
        title: 'Mẹo: gọi điện chỗ ồn, không nghe kịp thì làm gì',
        items: [
          'Nói **thông tin quan trọng nhất trước**: "I\'m running about 30 minutes late." Lý do để sau. Lỡ cuộc gọi đứt giữa chừng, quản lý vẫn biết điều cần biết.',
          'Không nghe rõ: "Sorry, it\'s really noisy here. **Could you say that again?**" Vẫn không rõ: "**I\'ll text you the details** in a minute." Rồi nhắn ngay.',
          'Nghe một chữ lạ (ETA, PTO, WFH): **hỏi lại đúng chữ đó** như Yến: "Sorry, my… ETA?" Người ta tự giải thích.',
          'Nhắc lại giờ, ngày cho chắc: "So, **Thursday the third, I leave at three**. Is that right?" (Ngày 2 đã học: đọc lại để xác nhận.)',
          'Đang ngồi sau xe: gọi ngắn, nhắn tin sau khi dừng. Joel nói đúng: "**Don\'t text on the bike!**"',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Nghỉ phép năm', 'annual leave · "I\'m on holiday next week"', 'vacation · PTO (paid time off)', 'annual leave · "I\'m on leave next week"'],
          ['Nghỉ ốm', "I'm off sick. · ring in sick", "I'm out sick. · call in sick", "I'm off sick. · I'm crook (ốm, thân mật)"],
          ['Giấy bác sĩ', 'fit note (cần từ ngày nghỉ thứ 8)', "doctor's note", 'medical certificate'],
          ['Ngày lễ', 'bank holiday', 'federal / public holiday', 'public holiday'],
          ['Nghỉ giả ốm (tiếng lóng, đừng dùng)', 'pull a sickie', 'play hooky', 'chuck a sickie'],
        ],
        caption: 'Thực tế: ở Anh nhân viên tự khai ốm được **7 ngày đầu** mà không cần bác sĩ; ở Úc người làm toàn thời gian có **10 ngày nghỉ ốm / chăm người thân có lương mỗi năm**; ở Mỹ **không có luật liên bang** bắt trả lương ngày ốm, tuỳ bang và công ty. Ở Việt Nam, người lao động có **12 ngày phép năm** (Bộ luật Lao động 2019); thực tập sinh thì theo quy định riêng của công ty, nên **hỏi ngay tuần đầu**.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-cv-b1-01 · Could You Send Me the Invoice?** — lời nhờ có lý do và có hạn chót, rồi một cuộc gọi đọc lại thông tin cho chắc. Cùng tinh thần "nói rõ, lịch sự" như khi báo trễ hôm nay.',
          '**en-ds-a2-04 · I\'d Love To, But…** — từ chối và dời hẹn với bạn bè mà không mất lòng; hôm nay là phiên bản công sở với quản lý.',
          'Email báo nghỉ gửi **khách hàng**, trả lời tự động (out-of-office), bàn giao công việc kỹ thuật: khoá **Technical English at Work** (Courses).',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd16-noi',
    kind: 'speaking',
    title: 'Nói với quản lý: xin phép và giải thích',
    goal: 'Báo trễ, báo ốm, xin nghỉ và xin về sớm với quản lý trong 4 câu: chuyện gì, bao lâu, ai lo việc thay, khi nào báo tiếp; nêu lý do gọn bằng because / since / as và dùng đúng won\'t be able to.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**29 câu mẫu** cho bốn việc: báo trễ · báo ốm · xin nghỉ có kế hoạch · xin về sớm. Bấm loa, **nói to theo**.',
          'Khung **4 câu** dùng được cho mọi lần xin phép, và mức **thân · trung tính · trang trọng**.',
          'Ngữ pháp: nêu lý do bằng **because / since / as** (+ **because of** + danh từ) và **won\'t be able to**. Từ nối: **so** (kết quả).',
          'Ôn Ngày 15: **Would it be okay if I + V2?** và **I was wondering if I could…** giờ dùng để **xin phép** chứ không phải nhờ.',
          'Văn hoá: kể bệnh tới đâu là đủ, có nên vẫn làm khi ốm, xin lỗi bao nhiêu lần là vừa.',
        ],
      },

      { t: 'h', text: '1. 29 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo bốn tình huống. Mỗi câu nói nguyên như vậy được. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "I'm running late.", pos: 'phr', ipa: '/aɪm ˈrʌnɪŋ ˈleɪt/', vi: 'Tôi đang bị trễ (đang trên đường).', ex: "I'm afraid I'm running late. I'll be there in twenty minutes.", exVi: 'Em e là em đang trễ. Hai mươi phút nữa em tới.', anh: 'alarm-clock' },
          { w: "I'm stuck in traffic.", pos: 'phr', ipa: '/aɪm ˈstʌk ɪn ˈtræfɪk/', vi: 'Tôi đang kẹt xe.', ex: "I'm stuck in traffic on the bridge.", exVi: 'Em đang kẹt xe trên cầu.', anh: 'automobile' },
          { w: "I'll be about 20 minutes late.", pos: 'phr', ipa: '/aɪl bi əˌbaʊt ˈtwenti ˈmɪnɪts ˈleɪt/', vi: 'Tôi sẽ trễ khoảng 20 phút.', ex: "Sorry, I'll be about 20 minutes late for the tour.", exVi: 'Xin lỗi, em sẽ trễ buổi tham quan khoảng 20 phút.', more: 'Số phút đứng **trước** late: 20 minutes late, half an hour late.' },
          { w: 'I should be there by…', pos: 'phr', ipa: '/aɪ ʃʊd bi ˈðer baɪ/', vi: 'Chắc tôi sẽ tới trước / lúc…', ex: 'I should be there by nine thirty.', exVi: 'Chắc chín rưỡi em tới.', more: '**should** ở đây = "dự là", không phải "nên".' },
          { w: 'ETA', pos: 'n', ipa: '/ˌiː tiː ˈeɪ/', vi: 'giờ dự kiến tới nơi (estimated time of arrival)', ex: "What's your ETA? — About ten minutes.", exVi: 'Bao giờ em tới? — Khoảng mười phút nữa.' },
          { w: 'Sorry to call so early.', pos: 'phr', ipa: '/ˈsɑːri tə ˈkɔːl soʊ ˈɝːli/', vi: 'Xin lỗi gọi sớm thế này.', ex: "Sorry to call so early, Rachel. I'm not feeling well.", exVi: 'Xin lỗi gọi chị sớm thế này, chị Rachel. Em không được khoẻ.' },
          { w: "I'm not feeling well.", pos: 'phr', ipa: '/aɪm ˈnɑːt ˈfiːlɪŋ ˈwel/', vi: 'Tôi không được khoẻ.', ex: "I'm not feeling well, so I won't be able to come in today.", exVi: 'Em không được khoẻ nên hôm nay em không lên văn phòng được.', more: 'Câu **an toàn nhất** để báo ốm: đủ ý, không cần kể chi tiết.' },
          { w: "I've come down with…", pos: 'phr', ipa: '/aɪv ˌkʌm ˈdaʊn wɪð/', vi: 'Tôi bị (mắc) … rồi.', ex: "I think I've come down with the flu.", exVi: 'Em nghĩ em bị cúm rồi.', more: 'come down with a cold (cảm), the flu (cúm), something (bị gì đó).', anh: 'face-with-thermometer' },
          { w: 'call in sick', pos: 'v', ipa: '/ˌkɔːl ɪn ˈsɪk/', vi: 'gọi điện báo ốm', ex: 'Yến called in sick on Monday.', exVi: 'Thứ Hai Yến gọi điện báo ốm.', anh: 'telephone-receiver' },
          { w: "I won't be able to come in today.", pos: 'phr', ipa: '/aɪ ˈwoʊnt bi ˈeɪbl tə ˌkʌm ˈɪn təˈdeɪ/', vi: 'Hôm nay tôi không thể đi làm được.', ex: "I've got a high temperature, so I won't be able to come in today.", exVi: 'Em đang sốt cao nên hôm nay em không đi làm được.', more: '**come in** = đến chỗ làm. Nói với quản lý, câu này mềm hơn "I can\'t come".' },
          { w: 'take a sick day', pos: 'phr', ipa: '/ˌteɪk ə ˈsɪk deɪ/', vi: 'nghỉ một ngày ốm', ex: "I need to take a sick day today.", exVi: 'Hôm nay em cần nghỉ ốm một ngày.' },
          { w: 'work from home', pos: 'phr', ipa: '/ˌwɝːk frəm ˈhoʊm/', vi: 'làm việc ở nhà (WFH)', ex: 'Would it be okay if I worked from home tomorrow?', exVi: 'Mai em làm ở nhà có được không ạ?', more: 'Ốm thật thì **đừng** đề nghị làm ở nhà. Chỉ dùng khi bạn khoẻ nhưng không lên văn phòng được.' },
          { w: 'take Friday off', pos: 'phr', ipa: '/ˌteɪk ˈfraɪdeɪ ˈɔːf/', vi: 'nghỉ ngày thứ Sáu', ex: 'I was wondering if I could take Friday off.', exVi: 'Em muốn hỏi em có thể nghỉ thứ Sáu không.', more: 'take + thời gian + off: take **the day** off · take **next week** off · take **the afternoon** off.', anh: 'spiral-calendar' },
          { w: 'leave early', pos: 'v', ipa: '/ˌliːv ˈɝːli/', vi: 'về sớm', ex: 'I need to leave early on Thursday.', exVi: 'Thứ Năm em cần về sớm.' },
          { w: 'Would it be okay if I left at three?', pos: 'phr', ipa: '/wʊd ɪt bi oʊˈkeɪ ɪf aɪ ˈleft ət ˈθriː/', vi: 'Tôi về lúc ba giờ có được không?', ex: 'Would it be okay if I left at three on Thursday?', exVi: 'Thứ Năm em về lúc ba giờ có được không ạ?', more: '**if I + quá khứ** (left, worked, took) cho mềm, như Would you mind if I… của Ngày 15.', anh: 'three-oclock' },
          { w: "Something's come up.", pos: 'phr', ipa: '/ˈsʌmθɪŋz ˌkʌm ˈʌp/', vi: 'Có việc đột xuất.', ex: "Something's come up at home. Could I leave an hour early?", exVi: 'Nhà em có việc đột xuất. Em về sớm một tiếng được không ạ?', more: 'Đủ lịch sự, không bắt buộc kể chi tiết. Quản lý hỏi thêm thì nói thêm một câu.' },
          { w: 'for family reasons', pos: 'phr', ipa: '/fər ˈfæməli ˈriːznz/', vi: 'vì lý do gia đình', ex: 'I need to take Friday off for family reasons.', exVi: 'Em cần nghỉ thứ Sáu vì lý do gia đình.' },
          { w: 'death anniversary', pos: 'n', ipa: '/ˈdeθ ˌænɪˈvɝːsəri/', vi: 'ngày giỗ', ex: "It's my grandfather's death anniversary. It's a family memorial day.", exVi: 'Đó là ngày giỗ ông em. Một ngày tưởng nhớ của cả nhà.', more: 'Người nước ngoài nghe "death" dễ tưởng là chuyện buồn mới xảy ra. Thêm **"It\'s a family memorial day"** hoặc **"more like a family reunion"** như Yến.', anh: 'candle' },
          { w: 'annual leave', pos: 'n', ipa: '/ˌænjuəl ˈliːv/', vi: 'ngày phép năm', ex: 'How many days of annual leave do interns get?', exVi: 'Thực tập sinh được bao nhiêu ngày phép năm?', more: 'Mỹ: **vacation days / PTO**.' },
          { w: 'put in a leave request', pos: 'phr', ipa: '/ˌpʊt ɪn ə ˈliːv rɪˌkwest/', vi: 'gửi đơn xin nghỉ (trên hệ thống)', ex: "Put in a leave request and I'll approve it today.", exVi: 'Em gửi đơn xin nghỉ đi, chị duyệt luôn hôm nay.', anh: 'memo' },
          { w: 'approve', pos: 'v', ipa: '/əˈpruːv/', vi: 'duyệt, chấp thuận', ex: 'Has Rachel approved your leave?', exVi: 'Chị Rachel duyệt đơn nghỉ của bạn chưa?', anh: 'check-mark-button' },
          { w: 'cover for someone', pos: 'phr', ipa: '/ˈkʌvər fər ˈsʌmwʌn/', vi: 'làm thay ai', ex: 'Joel can cover for you on Monday.', exVi: 'Thứ Hai Joel làm thay em được.' },
          { w: 'make up the time', pos: 'phr', ipa: '/ˌmeɪk ʌp ðə ˈtaɪm/', vi: 'làm bù giờ', ex: "I'll make up the time this evening.", exVi: 'Tối nay em sẽ làm bù giờ.' },
          { w: "a doctor's note", pos: 'n', ipa: '/ə ˈdɑːktərz ˈnoʊt/', vi: 'giấy bác sĩ (xác nhận ốm)', ex: "Do I need a doctor's note?", exVi: 'Em có cần giấy bác sĩ không?' },
          { w: 'Sorry for the short notice.', pos: 'phr', ipa: '/ˈsɑːri fər ðə ˌʃɔːrt ˈnoʊtɪs/', vi: 'Xin lỗi vì báo gấp.', ex: 'Sorry for the short notice. Something came up this morning.', exVi: 'Xin lỗi vì báo gấp. Sáng nay em có việc đột xuất.' },
          { w: "I'll keep you posted.", pos: 'phr', ipa: '/aɪl ˈkiːp ju ˈpoʊstɪd/', vi: 'Có gì mới tôi sẽ báo.', ex: "I'll keep you posted about tomorrow.", exVi: 'Mai thế nào em sẽ báo chị.' },
          { w: 'Thanks for letting me know.', pos: 'phr', ipa: '/ˈθæŋks fər ˈletɪŋ mi ˈnoʊ/', vi: 'Cảm ơn đã báo.', ex: "Thanks for letting me know. Stay safe.", exVi: 'Cảm ơn em đã báo. Đi cẩn thận nhé.', more: 'Câu quản lý hay nói. Bạn cũng nói khi đồng nghiệp báo trễ, báo ốm.' },
          { w: 'Feel better soon.', pos: 'phr', ipa: '/ˈfiːl ˈbetər ˈsuːn/', vi: 'Mau khoẻ nhé.', ex: "Get some rest. Feel better soon!", exVi: 'Nghỉ ngơi đi. Mau khoẻ nhé!', more: 'Cũng nói: **Get well soon. · Hope you feel better.**' },
          { w: 'Thanks for understanding.', pos: 'phr', ipa: '/ˈθæŋks fər ˌʌndərˈstændɪŋ/', vi: 'Cảm ơn vì đã thông cảm.', ex: 'Sorry again about this morning. Thanks for understanding.', exVi: 'Một lần nữa xin lỗi về chuyện sáng nay. Cảm ơn chị đã thông cảm.', more: 'Dùng câu này **thay cho** lần xin lỗi thứ ba.' },
        ],
      },

      { t: 'h', text: '2. Khung 4 câu và ba mức lịch sự' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Xin phép quản lý: 4 câu là đủ',
        caption: 'Câu 1 là **chuyện gì + bao lâu**, lý do gói trong một mệnh đề because / since. Quản lý không cần nghe kể dài, họ cần biết **việc có bị bỏ dở không**.',
        steps: [
          { label: 'Chuyện gì + bao lâu', sub: "I'm not feeling well, so I won't be able to come in today." },
          { label: 'Lý do (một câu)', sub: "I've had a high temperature since last night." },
          { label: 'Việc của bạn', sub: 'Joel knows where my checklist is.' },
          { label: 'Khi nào báo tiếp', sub: "I'll message you tomorrow morning." },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Thân (đồng nghiệp cùng cấp)', 'Trung tính (quản lý trực tiếp)', 'Trang trọng (giám đốc, quản lý người Nhật)'],
        rows: [
          ['Báo trễ', "Running 10 mins late, sorry!", "I'm afraid I'm running about 10 minutes late.", 'I apologise, but I will be approximately 10 minutes late this morning.'],
          ['Báo ốm', "I'm off sick today, feeling awful.", "I'm not feeling well, so I won't be able to come in today.", 'I am afraid I am unwell and will not be able to come in today.'],
          ['Xin nghỉ', "I'm taking Friday off, by the way.", 'I was wondering if I could take Friday off.', 'I would like to request a day of annual leave on Friday, 4 December.'],
          ['Xin về sớm', 'Gotta leave at 3 today.', 'Would it be okay if I left at three today?', 'Would it be possible for me to leave at 3 pm today?'],
          ['Cảm ơn', 'Cheers!', 'Thanks, I really appreciate it.', 'Thank you very much for your understanding.'],
        ],
        caption: 'Cột thân **chỉ** dùng để báo cho đồng nghiệp ngang hàng. Với quản lý, kể cả quản lý trẻ và thân thiện, dùng **cột giữa**: nó vừa lịch sự vừa không cứng.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Ba từ cùng nghĩa "vì": **because**, **since**, **as**. Khác nhau ở **vị trí** và **sắc thái**. Và một từ người Việt hay lẫn: **because of** chỉ đi với **danh từ**, không đi với cả câu.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + V …, because + S + V',
            vi: 'Lý do là **thông tin mới**, người nghe chưa biết. Hay đứng **sau**.',
            examples: [
              { en: "I'll be late because there's been an accident on the bridge.", vi: 'Em sẽ trễ vì trên cầu có tai nạn.' },
              { en: 'I need to leave at three because I have a meeting at university.', vi: 'Em cần về lúc ba giờ vì có buổi gặp ở trường.' },
              { en: 'Everyone has to pack their desk, because the movers arrive at eight.', vi: 'Ai cũng phải đóng đồ ở bàn mình, vì tám giờ bên chuyển nhà tới.' },
            ],
          },
          {
            formula: 'because of + danh từ',
            vi: 'Sau because of là **danh từ / cụm danh từ**, không có động từ.',
            examples: [
              { en: "I'm stuck in traffic because of an accident.", vi: 'Em kẹt xe vì một vụ tai nạn.' },
              { en: 'The tour started late because of me.', vi: 'Buổi tham quan bắt đầu trễ vì em.' },
              { en: "I can't come in because of the flu.", vi: 'Em không đi làm được vì bị cúm.' },
            ],
          },
          {
            formula: 'Since / As + S + V, S + V',
            vi: 'Lý do **người nghe đã biết** hoặc hiển nhiên. Hay đứng **đầu câu**. As trang trọng hơn since một chút.',
            examples: [
              { en: "Since I won't be able to come on Friday, could I pack my desk on Thursday?", vi: 'Vì thứ Sáu em không tới được, em đóng đồ vào thứ Năm được không?' },
              { en: "As it's a big family day, my parents want everyone to come home.", vi: 'Vì là ngày lớn của cả họ, bố mẹ em muốn mọi người về.' },
              { en: "Since you're sick, please don't log on.", vi: 'Vì em đang ốm, đừng đăng nhập làm việc nhé.' },
            ],
          },
          {
            formula: "S + won't be able to + V",
            vi: '"Sẽ không thể". Tương lai của can là **will be able to**, vì không có "will can".',
            examples: [
              { en: "I won't be able to come in today.", vi: 'Hôm nay em không đi làm được.' },
              { en: "I won't be able to get there by nine.", vi: 'Em không thể tới trước chín giờ.' },
              { en: "Will you be able to finish before you leave?", vi: 'Em có kịp làm xong trước khi về không?' },
            ],
          },
          {
            formula: "I'm afraid + S + V",
            vi: 'Đệm mềm trước tin không vui. **Không** có nghĩa là "sợ".',
            examples: [
              { en: "I'm afraid I'm running late.", vi: 'Em e là em đang trễ.' },
              { en: "I'm afraid I won't be able to make the meeting.", vi: 'Tiếc là em không dự buổi họp được.' },
              { en: "I'm afraid I need to leave a bit early today.", vi: 'Em e là hôm nay em cần về sớm một chút.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Từ', 'Đi với', 'Vị trí hay gặp', 'Sắc thái'],
        rows: [
          ['because', 'S + V (cả câu)', 'Sau mệnh đề chính', 'Lý do mới, nhấn mạnh lý do. Dùng nhiều nhất khi nói.'],
          ['because of', 'danh từ: the traffic, an accident, the flu', 'Sau mệnh đề chính', 'Gọn, hay dùng khi nói nhanh.'],
          ['since', 'S + V', 'Đầu câu', 'Lý do ai cũng biết, nói như "vì đã vậy thì…". Rất tự nhiên khi đề xuất phương án.'],
          ['as', 'S + V', 'Đầu câu', 'Như since, trang trọng hơn, hay gặp trong email.'],
          ["'cause (nói)", 'S + V', 'Sau mệnh đề chính', 'Dạng rút gọn của because khi nói thân mật. Đừng viết trong email.'],
        ],
        caption: 'Khi nói với quản lý, hai khung dùng được nhiều nhất: **"…, because…"** để giải thích, và **"Since…, could I…?"** để xin phép kèm phương án.',
      },
      {
        t: 'rule',
        formula: "because + S + V · because of + N · Since / As + S + V, … · won't be able to + V",
        vi: 'Lý do mới thì because (đứng sau); lý do đã rõ thì since / as (đứng đầu). Sau because of chỉ là danh từ. "Sẽ không thể" là won\'t be able to, không phải "won\'t can".',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: so (vì vậy) — và đừng ghép với because',
        items: [
          '**so** nối **kết quả**: "I\'m not feeling well, **so** I won\'t be able to come in." (lý do → kết quả)',
          '**because** nối **lý do**: "I won\'t be able to come in **because** I\'m not feeling well." (kết quả → lý do)',
          'Tiếng Việt nói "**Vì** em ốm **nên** em nghỉ", nhưng tiếng Anh chỉ chọn **một**: because **hoặc** so. "Because I\'m sick, so I…" là sai.',
          'Khi báo tin, **so** thường hay hơn: nghe tới đâu hiểu tới đó, thông tin chính (nghỉ / trễ) đứng cuối câu nên dễ nhớ.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd16-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "because / because of / since · won't be able to · so · I'm afraid",
        items: [
          { q: 'Em e là em sẽ trễ khoảng 20 phút.', hint: "I'm afraid, about 20 minutes late", answers: ["I'm afraid I'll be about 20 minutes late.", "I'm afraid I'll be about twenty minutes late.", "I'm afraid I'm going to be about 20 minutes late.", "I'm afraid I'm going to be about twenty minutes late.", "I'm afraid I'm running about 20 minutes late.", "I'm afraid I'm running about twenty minutes late."] },
          { q: 'Em kẹt xe vì một vụ tai nạn.', hint: 'stuck in traffic, because of', answers: ["I'm stuck in traffic because of an accident.", 'I am stuck in traffic because of an accident.'] },
          { q: 'Hôm nay em không đi làm được.', hint: "won't be able to, come in", answers: ["I won't be able to come in today.", 'I will not be able to come in today.', "I won't be able to come to work today.", "I can't come in today.", "I can't come to work today."] },
          { q: 'Em không được khoẻ nên hôm nay em nghỉ ốm.', hint: "not feeling well, so, take a sick day", answers: ["I'm not feeling well, so I'm taking a sick day today.", "I'm not feeling well, so I'll take a sick day today.", "I'm not feeling well so I'm taking a sick day today.", "I'm not feeling well, so I need to take a sick day today.", "I'm not feeling well, so I'm taking a sick day.", "I'm not feeling well, so I'm off sick today.", "I'm not feeling well, so I'm calling in sick today."] },
          { q: 'Vì thứ Sáu em không tới được, em làm việc đó vào thứ Năm được không ạ?', hint: "since, won't be able to, could I", answers: ["Since I won't be able to come on Friday, could I do it on Thursday?", "Since I won't be able to come in on Friday, could I do it on Thursday?", "As I won't be able to come on Friday, could I do it on Thursday?", "Since I can't come on Friday, could I do it on Thursday?", "Since I won't be able to come on Friday, could I do it on Thursday instead?"] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~Can I off tomorrow?~~ → **Could I take tomorrow off?** "off" không phải động từ. Cấu trúc là **take + thời gian + off**. "Xin off" là tiếng lóng văn phòng Việt, người nước ngoài không hiểu.',
          '~~I will come late 15 minutes.~~ → **I\'ll be about 15 minutes late.** Dùng **be late**, và số phút đứng **trước** late.',
          '~~I\'m late because the traffic jam.~~ → **…because of the traffic.** hoặc **…because there\'s a traffic jam.** Sau because là cả câu; chỉ có danh từ thì dùng because of.',
          '~~Because I\'m sick, so I can\'t come.~~ → **I\'m sick, so I can\'t come.** hoặc **Because I\'m sick, I can\'t come.** Không dùng cả because lẫn so trong một câu.',
          '~~I won\'t can come tomorrow.~~ → **I won\'t be able to come tomorrow.** Hai động từ khuyết thiếu (will + can) không đứng cạnh nhau.',
          '~~Sorry for the inconvenient.~~ → **Sorry for the inconvenience.** (danh từ) — và với việc báo gấp, câu tự nhiên hơn là **Sorry for the short notice.**',
          '~~I have a sick leave today.~~ → **I\'m off sick today.** / **I\'m taking a sick day today.** "sick leave" là tên loại ngày nghỉ (ghi trên hệ thống), không "have a" như có một cái gì.',
          '~~(Nhắn lúc 8 giờ 59) Sorry, I\'m sick.~~ → **I\'m not feeling well, so I won\'t be able to come in today. I\'ll keep you posted about tomorrow.** Câu cũ không sai ngữ pháp nhưng **thiếu thông tin**: nghỉ bao lâu? mai thì sao? Và báo **trước** giờ làm, không phải đúng giờ làm.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi xin phép quản lý' },
      {
        t: 'p',
        text: 'Xin nghỉ trực tiếp thì **dáng đứng, ánh mắt, số lần xin lỗi** nói nhiều hơn bạn nghĩ. Gọi điện báo ốm thì **giọng** là ngôn ngữ cơ thể duy nhất. Bấm từng thẻ để nghe.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ và giọng khi xin phép',
        items: [
          { anh: 'raised-hand', w: 'Have you got a minute?', ro: '/hæv ju ˈɡɑːt ə ˈmɪnɪt/', vi: 'Tới bàn quản lý: đứng cách một sải tay, chờ họ ngẩng lên. Thấy họ đang gọi điện thì giơ tay ra hiệu "lát nữa" rồi quay lại sau.' },
          { anh: 'chair', w: 'Grab a seat.', ro: '/ˌɡræb ə ˈsiːt/', vi: 'Được mời ngồi thì ngồi. Đứng lơ lửng bên cạnh bàn trông như đang bị gọi lên để khiển trách.' },
          { anh: 'eyes', w: 'I was wondering if I could take Friday off.', ro: '', vi: 'Nhìn vào mắt khi xin phép. Nhìn xuống đất nghe như bạn đang làm điều gì sai, trong khi xin nghỉ là quyền bình thường.' },
          { anh: 'person-bowing', w: '(đừng làm) Sorry, sorry, sorry…', ro: '', vi: 'Cúi đầu liên tục + xin lỗi nhiều lần: quản lý phương Tây thấy **khó xử**. Xin lỗi **một lần**, rồi **cảm ơn**.' },
          { anh: 'woman-tipping-hand', w: 'Since I won\'t be able to come, I could…', ro: '', vi: 'Đưa phương án kèm cử chỉ tay mở, giọng chắc: bạn đang **giải quyết vấn đề**, không chỉ báo vấn đề.' },
          { anh: 'telephone-receiver', w: "I'm not feeling well.", ro: '/aɪm ˈnɑːt ˈfiːlɪŋ ˈwel/', vi: 'Báo ốm: nói chậm, rõ, giọng tự nhiên. **Đừng giả giọng ốm**, người nghe nhận ra ngay và thấy kỳ.' },
          { anh: 'face-with-thermometer', w: "I've had a high temperature since last night.", ro: '', vi: 'Kể bệnh **một câu** là đủ. Không cần kể nôn mấy lần, đi ngoài mấy lần: ở công sở phương Tây đó là chuyện riêng tư.' },
          { anh: 'slightly-smiling-face', w: 'Thanks for understanding.', ro: '/ˈθæŋks fər ˌʌndərˈstændɪŋ/', vi: 'Kết thúc bằng một nụ cười và lời cảm ơn, không phải câu xin lỗi.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Báo trễ', 'Trễ 5–10 phút hay không báo; báo thì nhắn sát giờ.', 'Báo **trước giờ bắt đầu**, kể cả trễ 10 phút. Không báo mới là lỗi lớn.', 'Đúng giờ gần như tuyệt đối. Trễ phải gọi trước và xin lỗi kỹ.'],
          ['Báo ốm', 'Nhắn tin; hay kể chi tiết bệnh.', 'Gọi hoặc nhắn theo **quy định công ty**. Bệnh gì nói một câu là đủ.', 'Thường gọi điện, xin lỗi vì làm phiền nhóm.'],
          ['Ốm mà vẫn làm', 'Cố đi làm hoặc vẫn trả lời tin nhắn là "chăm chỉ".', 'Nhiều quản lý **không muốn** bạn làm khi ốm: lây cho người khác, làm kém.', 'Hay cố đi làm, nhưng đeo khẩu trang.'],
          ['Xin nghỉ có kế hoạch', 'Hay báo sát ngày.', 'Báo **sớm** (thường vài tuần với nghỉ dài), gửi đơn trên hệ thống.', 'Báo rất sớm; ngại nghỉ nhiều ngày liền.'],
          ['Nêu lý do', 'Hay nói chung "việc gia đình".', '"Personal reasons" / "family reasons" là đủ, không ai ép kể.', 'Lý do ngắn, kèm lời xin lỗi.'],
        ],
        caption: 'Với quản lý người Nhật, giữ thêm một bậc lịch sự: báo sớm hơn, xin lỗi rõ hơn. Với quản lý Mỹ, Úc: báo sớm, ngắn, có phương án, cảm ơn.',
      },

      { t: 'h', text: "6. Phát âm: won't và want, because, would it be" },
      {
        t: 'p',
        text: '**won\'t** /woʊnt/ (sẽ không) và **want** /wɑːnt/ (muốn) là cặp nguy hiểm nhất hôm nay: "I **won\'t** come in" và "I **want** to come in" nghĩa ngược nhau. won\'t miệng **tròn** như "âu", want miệng **mở** như "a". **because** khi nói nhanh thành "**cuz**" /kəz/. **would it be** dính thành "wu-đít-bi".',
      },
      {
        t: 'phatam',
        id: 'gtd16-phat-am',
        title: "Luyện phát âm — won't / want, nối âm khi xin phép",
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nhấn vào thông tin chính (late, today, three, Friday); từ nhỏ đọc lướt.',
        items: [
          { text: "I won't be able to come in today.", ipa: 'aɪ woʊnt bi eɪbl tə kʌm ɪn tədeɪ', vi: "won't /woʊnt/ tròn môi như \"âu\", khác want /wɑːnt/ · able to → \"ây-bồ-tơ\"" },
          { text: 'I want to come in today.', ipa: 'aɪ wɑːnt tə kʌm ɪn tədeɪ', vi: 'Câu đối chiếu: want mở miệng như "oan" · nghĩa ngược với câu trên' },
          { text: "I'm afraid I'm running late.", ipa: 'aɪm əfreɪd aɪm rʌnɪŋ leɪt', vi: 'afraid nhấn âm 2 · running có /ŋ/ cuối, không đọc "rân-nin"' },
          { text: "There's been an accident on the bridge.", ipa: 'ðerz bɪn ən æksɪdənt ɑːn ðə brɪdʒ', vi: "been‿an‿accident nối liền · accident nhấn âm 1 · bridge có /dʒ/ cuối" },
          { text: "I'm late because of the traffic.", ipa: 'aɪm leɪt bɪkɑːz əv ðə træfɪk', vi: 'because nhấn âm 2 · because of nối "bi-ca-zơv" · nói nhanh: \'cause /kəz/' },
          { text: 'Would it be okay if I left at three?', ipa: 'wʊdɪt bi oʊkeɪ ɪf aɪ left ət θriː', vi: 'would it → "wu-đít" · left at → "lép-tớt" · three /θr/ lưỡi giữa răng' },
          { text: "Something's come up.", ipa: 'sʌmθɪŋz kʌm ʌp', vi: 'come‿up nối: "căm-mắp" · something có /θ/' },
          { text: "I'll keep you posted.", ipa: 'aɪl kiːp ju poʊstɪd', vi: "I'll có /l/ cuối (đừng nói \"ai\") · posted /ɪd/ cuối vì sau /t/" },
        ],
      },

      { t: 'h', text: '7. Nhập vai: xin về sớm nhận hộ chiếu' },
      {
        t: 'dialogue',
        title: 'Bàn của Rachel — Yến cần về sớm',
        lines: [
          { who: 'Yến', role: 'a', text: "Hi Rachel, sorry to interrupt. Have you got a minute?", vi: 'Chào chị Rachel, xin lỗi cắt ngang. Chị rảnh một phút không ạ?' },
          { who: 'Rachel', role: 'b', text: "Sure. What's up?", vi: 'Được chứ. Có chuyện gì thế?' },
          { who: 'Yến', role: 'a', text: "Would it be okay if I left at four today? I need to pick up my new passport, and the office closes at five.", vi: 'Hôm nay em về lúc bốn giờ có được không ạ? Em cần đi nhận hộ chiếu mới, mà văn phòng xuất nhập cảnh năm giờ đóng cửa.' },
          { who: 'Rachel', role: 'b', text: "That should be fine. Is it for the Singapore trip?", vi: 'Chắc là được. Cho chuyến đi Singapore à?' },
          { who: 'Yến', role: 'a', text: "Yes. Since the trip is next month, I don't want to leave it too late.", vi: 'Vâng. Vì tháng sau là đi rồi, em không muốn để sát quá.' },
          { who: 'Rachel', role: 'b', text: "Makes sense. What about the four-thirty catch-up with the new interns?", vi: 'Hợp lý. Còn buổi gặp nhanh với các bạn thực tập mới lúc bốn rưỡi thì sao?' },
          { who: 'Yến', role: 'a', text: "I won't be able to join, but I've asked Joel to run it. I'll send him my notes before I go.", vi: 'Em không dự được, nhưng em đã nhờ anh Joel chủ trì. Em sẽ gửi ghi chú cho anh ấy trước khi về.' },
          { who: 'Rachel', role: 'b', text: "Perfect. Thanks for sorting that out.", vi: 'Tuyệt. Cảm ơn em đã thu xếp.' },
          { who: 'Yến', role: 'a', text: "And I'll make up the hour tomorrow morning, if that's okay.", vi: 'Và em sẽ làm bù một tiếng vào sáng mai, nếu chị thấy ổn.' },
          { who: 'Rachel', role: 'b', text: "No need, honestly. Good luck with the passport office!", vi: 'Không cần đâu, thật đấy. Chúc em đi nhận hộ chiếu suôn sẻ!' },
          { who: 'Yến', role: 'a', text: 'Thank you. I really appreciate it.', vi: 'Em cảm ơn chị. Em thật sự cảm kích.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd16-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Yến (5 câu)',
        items: [
          { vi: 'Hôm nay em về lúc bốn giờ có được không ạ?', chips: ['Would', 'it', 'be', 'okay', 'if', 'I', 'left', 'at', 'four', 'today?', 'leave', 'can'], answer: ['Would', 'it', 'be', 'okay', 'if', 'I', 'left', 'at', 'four', 'today?'] },
          { vi: 'Em cần đi nhận hộ chiếu mới.', chips: ['I', 'need', 'to', 'pick', 'up', 'my', 'new', 'passport.', 'take', 'for'], answer: ['I', 'need', 'to', 'pick', 'up', 'my', 'new', 'passport.'] },
          { vi: 'Em không dự được, nhưng em đã nhờ anh Joel chủ trì.', chips: ['I', "won't", 'be', 'able', 'to', 'join,', 'but', "I've", 'asked', 'Joel', 'to', 'run', 'it.', 'can', 'so'], answer: ['I', "won't", 'be', 'able', 'to', 'join,', 'but', "I've", 'asked', 'Joel', 'to', 'run', 'it.'] },
          { vi: 'Vì tháng sau là đi rồi, em không muốn để sát quá.', chips: ['Since', 'the', 'trip', 'is', 'next', 'month,', 'I', "don't", 'want', 'to', 'leave', 'it', 'too', 'late.', 'so', 'because'], answer: ['Since', 'the', 'trip', 'is', 'next', 'month,', 'I', "don't", 'want', 'to', 'leave', 'it', 'too', 'late.'] },
          { vi: 'Em cảm ơn chị. Em thật sự cảm kích.', chips: ['Thank', 'you.', 'I', 'really', 'appreciate', 'it.', 'very', 'appreciated'], answer: ['Thank', 'you.', 'I', 'really', 'appreciate', 'it.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd16-noi-tra-loi',
        part: '1',
        questions: [
          "Hi, it's 8:45. Where are you? The meeting starts at nine.",
          "You sound unwell. What's wrong?",
          'You asked to take next Friday off. Can I ask what it is for?',
          "Who's going to cover your work while you're away?",
          'When do you think you will be back?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Rachel, a friendly American line manager at a software company in Ho Chi Minh City. I am your Vietnamese intern. Play three short scenes, one after another. Scene 1: it is 8:40 am and I call you because I am running late. Scene 2: I come to your desk to ask for next Friday off. Scene 3: I call you at 7 am because I am sick. In each scene, ask me the questions a real manager asks: how late, why, who will cover my work, when I will update you. Once, mention a problem (for example a meeting I will miss) and wait for me to suggest a solution. If I apologise more than twice, tell me kindly that I don\'t need to. Use B1-level English. After the three scenes, tell me in Vietnamese two things I did well and two mistakes, especially with because / because of / since and won\'t be able to."',
          'Làm **2 lượt**. Lượt hai đổi vai: bạn là quản lý, AI là thực tập sinh báo trễ; bạn phải hỏi đủ 4 câu (how late, why, who covers, when you\'ll update) và nói ít nhất một lần "Thanks for letting me know".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd16-viet',
    kind: 'writing',
    title: 'Tin nhắn / email xin nghỉ, báo trễ',
    goal: 'Viết được tin nhắn và email ngắn để báo trễ, báo ốm, xin nghỉ một ngày và xin về sớm, đủ 4 thông tin quản lý cần, ở mức thân mật (chat nội bộ) và trang trọng (email).',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Viết gì, cho ai',
        items: [
          'Bốn loại tin: **báo trễ** · **báo ốm** · **xin nghỉ có kế hoạch** · **xin về sớm**. Đúng bốn việc Yến làm ở bài Nghe.',
          'Mỗi loại có hai bản cạnh nhau: **chat nội bộ** gửi quản lý trực tiếp (ngắn, thân vừa) và **email** gửi quản lý + bộ phận nhân sự (đủ câu, có tiêu đề).',
          'Bộ khung của bài Nói dùng y nguyên: **chuyện gì + bao lâu → lý do một câu → việc của bạn ai lo → khi nào báo tiếp**.',
          'Dùng lại cách viết ngày, giờ của Ngày 2 (Thursday 3 December, 3 pm), và Would it be okay if I… của Ngày 15.',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Báo trễ',
        caption: 'Thông tin chính (trễ bao lâu, mấy giờ tới) đứng **ngay câu đầu**. Báo trễ chủ yếu dùng chat; email chỉ khi người nhận không dùng chat, hoặc là quản lý cấp cao.',
        cols: [
          {
            title: 'Chat nội bộ (gửi Rachel)',
            anh: 'speech-balloon',
            items: [
              'Hi Rachel, sorry, I\'m running about 30 mins late.',
              'There\'s been an accident on the bridge, so traffic isn\'t moving.',
              'Joel is starting the office tour for me.',
              'ETA 9:30. I\'ll update you if it changes.',
            ],
          },
          {
            title: 'Email trang trọng',
            anh: 'e-mail',
            items: [
              'Subject: Running late this morning – Tran Hai Yen',
              'Dear Mr Tanaka,',
              'I am afraid I will be about 30 minutes late this morning because of an accident on the bridge.',
              'Joel has kindly agreed to start the office tour at 9:00.',
              'I expect to arrive by 9:30.',
              'Kind regards,',
              'Tran Hai Yen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Báo ốm',
        caption: 'Gửi **trước giờ làm**. Bệnh gì một câu là đủ. Nói rõ **mai báo tiếp** để quản lý khỏi phải hỏi.',
        cols: [
          {
            title: 'Chat nội bộ',
            anh: 'face-with-thermometer',
            items: [
              'Morning Rachel,',
              'I\'m not feeling well (high temperature since last night), so I won\'t be able to come in today.',
              'Joel knows where my checklist for the interns is.',
              'I\'ll let you know tomorrow morning how I\'m feeling.',
            ],
          },
          {
            title: 'Email (quản lý + nhân sự)',
            anh: 'memo',
            items: [
              'Subject: Sick leave – Monday 30 November',
              'Dear Rachel,',
              'I am unwell today, so I will not be able to come in.',
              'Joel will cover my tasks with the new interns.',
              'I will let you know by 8 am tomorrow whether I can return.',
              'If I am off for more than two days, I will send a doctor\'s note.',
              'Best regards,',
              'Tran Hai Yen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Xin nghỉ có kế hoạch',
        caption: 'Hỏi quản lý **trước** (chat hoặc trực tiếp), được đồng ý rồi mới gửi đơn trên hệ thống. Email chính thức ghi rõ ngày, loại nghỉ và ai lo việc.',
        cols: [
          {
            title: 'Chat hỏi trước',
            anh: 'speech-balloon',
            items: [
              'Hi Rachel, quick question.',
              'Would it be okay if I took Friday 4 December off?',
              'It\'s a family memorial day (my grandfather\'s death anniversary), so I need to go home to Ben Tre.',
              'Since it\'s moving day, I can pack my desk on Thursday morning.',
            ],
          },
          {
            title: 'Email xin nghỉ',
            anh: 'e-mail',
            items: [
              'Subject: Leave request – Friday 4 December',
              'Dear Rachel,',
              'I would like to request one day of leave on Friday 4 December for family reasons.',
              'As the office move is on that day, I will pack my desk on Thursday morning.',
              'I will be back in the office on Monday 7 December.',
              'Thank you for considering my request.',
              'Kind regards,',
              'Tran Hai Yen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Xin về sớm',
        caption: 'Nói **giờ về** và **việc gì sẽ bị ảnh hưởng** trong cùng một tin. Hỏi bằng câu hỏi, đừng thông báo như đã quyết.',
        cols: [
          {
            title: 'Chat nội bộ',
            anh: 'three-oclock',
            items: [
              'Hi Rachel, would it be okay if I left at 3 on Thursday?',
              'I have a meeting with my OJT supervisor at uni at 4.',
              'I\'ll put it in the team calendar.',
              'Thanks!',
            ],
          },
          {
            title: 'Email trang trọng',
            anh: 'memo',
            items: [
              'Subject: Request to leave early – Thursday 3 December',
              'Dear Rachel,',
              'Would it be possible for me to leave at 3 pm on Thursday 3 December?',
              'My university has asked me to attend a meeting with my OJT supervisor at 4 pm.',
              'I will finish my tasks for the day before I leave.',
              'Kind regards,',
              'Tran Hai Yen',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Ghi nhớ về mẫu',
        items: [
          'Ngày trong mẫu là năm 2026: **Thursday 3 December**, **Friday 4 December**, **Monday 7 December** khớp thứ với ngày. Khi viết thật, mở lịch ra soát.',
          'Tên trên email: viết **không dấu** (Tran Hai Yen) cho chắc. Chữ có dấu đôi khi hiện sai trên máy của người nhận.',
          'Mẫu 1 trang trọng gửi **Mr Tanaka**: quản lý cấp cao người Nhật, nên dùng Dear + Mr + họ.',
          'Gửi khách hàng (báo nghỉ, trả lời tự động "out of office") thì khác hẳn: khoá **Technical English at Work** (Courses).',
        ],
      },

      { t: 'h', text: '2. Khung câu để viết tin xin phép' },
      {
        t: 'patterns',
        rows: [
          {
            formula: "I won't be able to + V … because / as …",
            vi: 'Câu chính của tin báo trễ, báo ốm. Bản email viết đủ: will not be able to.',
            examples: [
              { en: "I won't be able to come in today because I'm unwell.", vi: 'Hôm nay em không đi làm được vì em bị ốm.' },
              { en: 'I will not be able to attend the meeting as I am on leave.', vi: 'Tôi không thể dự buổi họp vì đang nghỉ phép.' },
              { en: "I won't be able to make it by nine.", vi: 'Em không kịp tới trước chín giờ.' },
            ],
          },
          {
            formula: 'I would like to request + loại nghỉ + on + ngày',
            vi: 'Mở đầu email xin nghỉ trang trọng.',
            examples: [
              { en: 'I would like to request one day of leave on Friday 4 December.', vi: 'Tôi xin nghỉ một ngày vào thứ Sáu 4 tháng 12.' },
              { en: 'I would like to request annual leave from 21 to 23 December.', vi: 'Tôi xin nghỉ phép năm từ 21 đến 23 tháng 12.' },
              { en: 'I would like to request permission to leave at 3 pm on Thursday.', vi: 'Tôi xin phép về lúc 3 giờ chiều thứ Năm.' },
            ],
          },
          {
            formula: 'X will cover … · I will be back on … · I will let you know by …',
            vi: 'Ba câu "yên tâm": ai lo việc, khi nào quay lại, khi nào báo tiếp.',
            examples: [
              { en: 'Joel will cover my tasks with the new interns.', vi: 'Joel sẽ làm thay việc của tôi với các bạn thực tập mới.' },
              { en: 'I will be back in the office on Monday 7 December.', vi: 'Tôi sẽ quay lại văn phòng vào thứ Hai 7 tháng 12.' },
              { en: 'I will let you know by 8 am tomorrow.', vi: 'Tôi sẽ báo trước 8 giờ sáng mai.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: "Chuyện gì + bao lâu (won't be able to … / would like to request …) → lý do một câu → ai lo việc → khi nào báo tiếp",
        vi: 'Một tin xin phép tốt trả lời trước mọi câu hỏi quản lý định hỏi. Lý do chỉ cần một câu; phần dài nhất nên là "việc của bạn ai lo".',
      },
      {
        t: 'table',
        head: ['Nên viết', 'Tránh', 'Vì sao'],
        rows: [
          ['Subject: Sick leave – Monday 30 November', 'Subject: (trống) · Subject: Xin nghỉ', 'Tiêu đề có loại nghỉ + ngày thì quản lý và nhân sự tìm lại được.'],
          ['I\'m not feeling well (high temperature).', 'Kể chi tiết triệu chứng, gửi ảnh nhiệt kế', 'Thông tin sức khoẻ là riêng tư. Một câu là đủ.'],
          ['Sorry for the short notice.', 'Sorry sorry sorry 🙏🙏🙏', 'Xin lỗi một lần. Emoji chắp tay với quản lý người Nhật, Mỹ nghe như van xin.'],
          ['I will be back on Monday.', '(không nói ngày quay lại)', 'Quản lý cần biết để xếp việc.'],
          ['Gửi trước 8:30 (giờ làm 9:00)', 'Gửi lúc 8:59 hoặc sau giờ bắt đầu', 'Báo sớm cho người ta kịp thu xếp, ví dụ nhờ Joel dẫn tham quan thay.'],
          ['Would it be okay if I took Friday off?', "I'm taking Friday off.", 'Với quản lý, xin phép bằng câu hỏi. Câu khẳng định nghe như đã tự quyết.'],
        ],
        caption: 'Sáu lỗi hay gặp khi người Việt nhắn xin nghỉ bằng tiếng Anh.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd16-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Xin lỗi chị, em trễ khoảng 30 phút.', chips: ['Sorry,', "I'm", 'running', 'about', '30', 'mins', 'late.', 'come', 'later'], answer: ['Sorry,', "I'm", 'running', 'about', '30', 'mins', 'late.'] },
          { vi: 'Tôi xin nghỉ một ngày vào thứ Sáu 4 tháng 12.', chips: ['I', 'would', 'like', 'to', 'request', 'one', 'day', 'of', 'leave', 'on', 'Friday', '4', 'December.', 'off', 'in'], answer: ['I', 'would', 'like', 'to', 'request', 'one', 'day', 'of', 'leave', 'on', 'Friday', '4', 'December.'] },
          { vi: 'Joel sẽ làm thay việc của tôi.', chips: ['Joel', 'will', 'cover', 'my', 'tasks.', 'for', 'covers'], answer: ['Joel', 'will', 'cover', 'my', 'tasks.'] },
          { vi: 'Tôi sẽ báo trước 8 giờ sáng mai.', chips: ['I', 'will', 'let', 'you', 'know', 'by', '8', 'am', 'tomorrow.', 'until', 'at'], answer: ['I', 'will', 'let', 'you', 'know', 'by', '8', 'am', 'tomorrow.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd16-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: "won't be able to · because of · as · by · back · off",
        items: [
          { q: "I won't be ___ to come in today. (có thể)", answers: ['able'] },
          { q: "I'm stuck in traffic because ___ an accident.", answers: ['of'] },
          { q: '___ the office move is on Friday, I will pack my desk on Thursday. (Vì, trang trọng, 2 chữ cái)', answers: ['As'] },
          { q: 'I will let you know ___ 8 am tomorrow. (trước, muộn nhất là)', answers: ['by'] },
          { q: 'I will be ___ in the office on Monday. (quay lại)', answers: ['back'] },
          { q: 'Would it be okay if I took Friday ___?', answers: ['off'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd16-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "running late · won't be able to · would like to request · will cover · let you know",
        items: [
          { q: '(Chat) Chào chị Rachel, em xin lỗi, em trễ khoảng 15 phút ạ.', hint: "sorry, running, about 15 mins late", answers: ["Hi Rachel, sorry, I'm running about 15 mins late.", "Hi Rachel, sorry, I'm running about 15 minutes late.", "Hi Rachel, sorry, I'm about 15 minutes late.", "Hi Rachel, sorry, I'll be about 15 minutes late.", "Hi Rachel, sorry, I'm running about fifteen minutes late."] },
          { q: '(Chat) Em không được khoẻ nên hôm nay em không lên văn phòng được.', hint: "not feeling well, so, won't be able to, come in", answers: ["I'm not feeling well, so I won't be able to come in today.", "I'm not feeling well so I won't be able to come in today.", "I'm not feeling well, so I won't be able to come into the office today.", "I'm not feeling well, so I can't come in today."] },
          { q: '(Email) Tôi xin nghỉ phép năm vào thứ Sáu 4 tháng 12.', hint: 'would like to request, annual leave, on', answers: ['I would like to request annual leave on Friday 4 December.', 'I would like to request a day of annual leave on Friday 4 December.', 'I would like to request one day of annual leave on Friday 4 December.', "I'd like to request annual leave on Friday 4 December.", 'I would like to request annual leave on Friday, 4 December.'] },
          { q: '(Email) Anh Joel sẽ làm thay việc của tôi.', hint: 'will cover, tasks', answers: ['Joel will cover my tasks.', 'Joel will cover my work.', 'Joel will cover for me.'] },
          { q: '(Chat) Sáng mai em sẽ báo chị là em đi làm được không.', hint: "I'll let you know, tomorrow morning, if", answers: ["I'll let you know tomorrow morning if I can come in.", "I'll let you know tomorrow morning whether I can come in.", "I'll let you know tomorrow morning if I can come to work.", "I'll message you tomorrow morning to let you know if I can come in."] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Câu đầu đã nói đủ "chuyện gì + bao lâu" chưa?** Người bận chỉ đọc câu đầu.',
          '**Có ngày quay lại / giờ báo tiếp chưa?** Thiếu là quản lý phải nhắn hỏi lại.',
          '**Việc của bạn có ai lo chưa?** Có cuộc hẹn, buổi tham quan, buổi họp nào bị ảnh hưởng thì nói rõ.',
          '**Gửi đúng kênh chưa?** Công ty bắt gọi điện khi ốm thì gọi, rồi mới gửi đơn trên hệ thống. Hỏi quy định ngay tuần đầu OJT.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd16-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 16',
    goal: 'Làm 35 câu có đáp án để chắc tay: báo trễ, báo ốm, xin nghỉ và xin về sớm đúng mức; nêu lý do đúng because / because of / since / so; dùng won\'t be able to.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền từ nối lý do · dịch · nghe chép · ghép câu.',
          'Có câu **ôn Ngày 15** (Would you mind…, câu hỏi gián tiếp) và **Ngày 7** (triệu chứng). Làm không nhìn lại bài.',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 17.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd16-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: '8 giờ 40, bạn kẹt xe, 9 giờ mới bắt đầu làm. Bạn gọi quản lý. Câu mở đầu tốt nhất:',
            options: ['Sorry sorry, the traffic in Saigon is terrible today, you know…', "I'm afraid I'm running about 20 minutes late.", 'I will come late.', 'Can I off this morning?'],
            correct: 1,
            why: 'Nói **thông tin chính trước** (trễ, bao lâu), lý do để sau: **I\'m afraid I\'m running about 20 minutes late.**',
          },
          {
            q: 'Câu nào đúng?',
            options: ["I won't can come tomorrow.", "I won't be able to come tomorrow.", "I don't be able to come tomorrow.", "I won't able to come tomorrow."],
            correct: 1,
            why: 'Tương lai của can: **will be able to** → phủ định **won\'t be able to**.',
          },
          {
            q: 'Câu nào đúng?',
            options: ["Because I'm sick, so I can't come.", "I'm sick, so I can't come.", "Because of I'm sick, I can't come.", "I'm sick because of I can't come."],
            correct: 1,
            why: 'Chỉ dùng **so** (hoặc chỉ because), không dùng cả hai. Because of + danh từ, không + câu.',
          },
          {
            q: 'Bạn muốn nghỉ thứ Sáu. Câu nào hợp nhất để hỏi quản lý?',
            options: ["I'm off on Friday.", 'Can I off on Friday?', 'I was wondering if I could take Friday off.', 'Friday I no come.'],
            correct: 2,
            why: '**I was wondering if I could take Friday off.** Xin phép bằng câu hỏi mềm; cấu trúc đúng là **take + ngày + off**.',
          },
          {
            q: 'Bạn bị cúm, gọi quản lý. Câu nào đủ thông tin và đúng mức?',
            options: [
              "I'm sick.",
              "I've come down with the flu, so I won't be able to come in today. I'll let you know tomorrow morning how I'm feeling.",
              'I have fever, vomit three times, and my stomach is very bad, and also…',
              'Sorry, sorry, I am very sorry, I am sick, sorry.',
            ],
            correct: 1,
            why: 'Đủ 3 ý: **bệnh gì (một câu)** · **nghỉ hôm nay** · **khi nào báo tiếp**. Không kể chi tiết, không xin lỗi rối rít.',
          },
          {
            q: 'Quản lý nói: "Please don\'t log on today. Sick days are for getting better." Bạn nên:',
            options: ['Vẫn trả lời email cho chăm chỉ', 'Nghỉ ngơi thật, không làm việc', 'Đăng nhập lúc tối muộn', 'Gọi lại để nài được làm'],
            correct: 1,
            why: 'Ở nhiều công ty nước ngoài, đó là **lời thật**, không phải khách sáo. Đáp: **Okay, I\'ll rest. Thanks.**',
          },
          {
            q: '"Text me your ETA" nghĩa là:',
            options: ['Nhắn lý do trễ', 'Nhắn giờ dự kiến tới nơi', 'Nhắn tên người làm thay', 'Nhắn số điện thoại'],
            correct: 1,
            why: '**ETA = estimated time of arrival** (giờ dự kiến tới).',
          },
          {
            q: 'Quản lý người Mỹ đã nói "No need to apologise" hai lần. Bạn kết thúc cuộc gọi bằng:',
            options: ["Sorry again, I'm so sorry.", 'Thanks for understanding.', 'Sorry for the inconvenient.', 'OK. Bye.'],
            correct: 1,
            why: 'Đổi lời xin lỗi thứ ba thành **lời cảm ơn**: Thanks for understanding. (Câu C sai: inconvenien**ce**.)',
          },
          {
            q: '(Ôn Ngày 15) Đồng nghiệp hỏi: "Would you mind covering the tour for me?" Bạn đồng ý. Bạn nói:',
            options: ['Yes, I mind.', 'No, not at all.', 'Yes.', 'I mind not.'],
            correct: 1,
            why: '"Would you mind…?" đồng ý = **No, not at all. / No problem.**',
          },
          {
            q: '(Ôn Ngày 7) Bạn muốn báo mình bị sốt. Câu nào đúng?',
            options: ['I am fever.', "I've got a temperature.", 'I have fever 39 degree.', 'I fever since last night.'],
            correct: 1,
            why: "**I've got a temperature / a fever.** Không nói \"I am fever\" (fever là danh từ).",
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền vào chỗ trống' },
      {
        t: 'quiz',
        id: 'gtd16-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'because · because of · since · so · able · late · off · early',
        items: [
          { q: "I'm late ___ there's an accident on the bridge. (vì + câu)", answers: ['because', 'as', 'since'] },
          { q: "I'm late because ___ the rain.", answers: ['of'] },
          { q: "___ I won't be in on Friday, could I pack my desk on Thursday? (Vì, đầu câu)", answers: ['Since', 'As'] },
          { q: "I'm not feeling well, ___ I'm taking a sick day. (nên)", answers: ['so'] },
          { q: "I'm afraid I won't be ___ to make the meeting.", answers: ['able'] },
          { q: "I'll be about ten minutes ___. (trễ)", answers: ['late'] },
          { q: 'Could I take tomorrow afternoon ___?', answers: ['off'] },
          { q: 'Would it be okay if I left a bit ___ today? (sớm)', answers: ['early'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd16-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "running late · won't be able to · take … off · because of · keep you posted",
        items: [
          { q: 'Xin lỗi gọi chị sớm thế này.', hint: 'sorry to call, so early', answers: ['Sorry to call so early.', "I'm sorry to call so early.", 'Sorry for calling so early.'] },
          { q: 'Chắc chín rưỡi em tới.', hint: 'should be there by', answers: ['I should be there by nine thirty.', 'I should be there by 9:30.', 'I should be there by half past nine.', 'I should be there by 9.30.'] },
          { q: 'Nhà em có việc đột xuất.', hint: "something's come up, at home", answers: ["Something's come up at home.", 'Something has come up at home.', "Something's come up with my family."] },
          { q: 'Em có cần giấy bác sĩ không ạ?', hint: "need, doctor's note", answers: ["Do I need a doctor's note?", "Do I need to get a doctor's note?", "Will I need a doctor's note?"] },
          { q: 'Thứ Năm em về lúc ba giờ có được không ạ?', hint: 'would it be okay if, left', answers: ['Would it be okay if I left at three on Thursday?', 'Would it be okay if I left at 3 on Thursday?', 'Would it be OK if I left at three on Thursday?', 'Would it be okay if I left at 3 pm on Thursday?', 'Would it be all right if I left at three on Thursday?'] },
          { q: 'Có gì mới em sẽ báo chị.', hint: "I'll keep you posted", answers: ["I'll keep you posted.", 'I will keep you posted.', "I'll keep you updated."] },
          { q: 'Cảm ơn chị đã thông cảm.', hint: 'thanks for, understanding', answers: ['Thanks for understanding.', 'Thank you for understanding.', 'Thanks for your understanding.', 'Thank you for your understanding.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd16-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I'm stuck in traffic because of an accident.", answer: "I'm stuck in traffic because of an accident.", alt: ['I am stuck in traffic because of an accident.'] },
          { label: 'Câu 2', spell: "I think I've come down with the flu.", answer: "I think I've come down with the flu.", alt: ['I think I have come down with the flu.'] },
          { label: 'Câu 3', spell: 'Joel can cover for you on Monday.', answer: 'Joel can cover for you on Monday.' },
          { label: 'Câu 4', spell: "Put in a leave request and I'll approve it today.", answer: "Put in a leave request and I'll approve it today.", alt: ['Put in a leave request and I will approve it today.', "Put in a leave request, and I'll approve it today."] },
          { label: 'Câu 5', spell: 'Sorry for the short notice.', answer: 'Sorry for the short notice.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd16-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Em e là em đang trễ.', chips: ["I'm", 'afraid', "I'm", 'running', 'late.', 'scared', 'come'], answer: ["I'm", 'afraid', "I'm", 'running', 'late.'] },
          { vi: 'Em không được khoẻ nên hôm nay em không đi làm được.', chips: ["I'm", 'not', 'feeling', 'well,', 'so', 'I', "won't", 'be', 'able', 'to', 'come', 'in', 'today.', 'because', 'can'], answer: ["I'm", 'not', 'feeling', 'well,', 'so', 'I', "won't", 'be', 'able', 'to', 'come', 'in', 'today.'] },
          { vi: 'Em muốn hỏi em có thể nghỉ thứ Sáu không.', chips: ['I', 'was', 'wondering', 'if', 'I', 'could', 'take', 'Friday', 'off.', 'can', 'out'], answer: ['I', 'was', 'wondering', 'if', 'I', 'could', 'take', 'Friday', 'off.'] },
          { vi: 'Vì là ngày lớn của cả họ, bố mẹ em muốn mọi người về.', chips: ['As', "it's", 'a', 'big', 'family', 'day,', 'my', 'parents', 'want', 'everyone', 'to', 'come', 'home.', 'so', 'because'], answer: ['As', "it's", 'a', 'big', 'family', 'day,', 'my', 'parents', 'want', 'everyone', 'to', 'come', 'home.'] },
          { vi: 'Tối nay em sẽ làm bù giờ.', chips: ["I'll", 'make', 'up', 'the', 'time', 'this', 'evening.', 'do', 'for'], answer: ["I'll", 'make', 'up', 'the', 'time', 'this', 'evening.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Hỏi (hoặc tra sổ tay thực tập) **quy định xin nghỉ** ở nơi bạn OJT: báo ốm bằng gì, trước mấy giờ, nghỉ mấy ngày thì cần giấy. Ghi vào sổ tay bằng tiếng Anh.',
          'Soạn sẵn và lưu trong điện thoại **hai tin**: một tin báo trễ, một tin báo ốm, theo khung 4 câu. Lúc cần chỉ sửa giờ và lý do.',
          'Ghi âm 3 câu có **won\'t** và 3 câu có **want**, nghe lại xem có phân biệt được không.',
          'Ngày 17: **gọi video** — mic, mạng chập chờn, chia sẻ màn hình, hai người nói cùng lúc; câu điều kiện "If you can\'t hear me, …".',
        ],
      },
    ],
  },
];
