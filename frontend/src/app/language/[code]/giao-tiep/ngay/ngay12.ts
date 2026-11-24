/**
 * Tiếng Anh giao tiếp — NGÀY 12 (chặng 2 "Đời sống", B1): cảm xúc — khen, cảm ơn, xin lỗi, chia buồn, chúc mừng.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework · review (kiểm tra chặng 2, gom Ngày 7–12). Mọi id bắt đầu `gtd12-`.
 * Ngữ pháp trong câu: hiện tại hoàn thành cơ bản (I've just heard… · You've already… · We haven't… yet · Have you…?)
 * · so + adj + that / such + (a) + adj + N + that · giới từ đi sau lời cảm xúc (thanks for, sorry about, congratulations on).
 * Cảnh: Nhi — sinh viên IT năm 3 — tháng thứ hai thực tập ở văn phòng một công ty phần mềm tại Austin, Texas (Mỹ):
 * chối lời khen bánh chuối kiểu Việt rồi hỏi đồng nghiệp vừa đính hôn "bao giờ có em bé"; ăn nhầm hộp cơm của Lachlan
 * (người Úc) rồi xin lỗi quá nhiều lần; chia buồn với trưởng nhóm Hamish (người New Zealand) vừa dự đám tang ông về.
 * Khác podcast en-b1-01 (chúc mừng lương đầu, quy tắc tiêu tiền), en-b1-03 (bạn quen qua mạng), en-cs-b1-02 (cốc trà của người lạ):
 * ở đây là phản ứng đúng mức trong 5 loại cảm xúc ở công sở, và cái bẫy văn hoá của người Việt (chối khen, hỏi chuyện riêng).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_12: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd12-nghe',
    kind: 'listening',
    title: 'Cảm xúc: khen, cảm ơn, xin lỗi, chia buồn, chúc mừng',
    goal: 'Nghe ba cảnh trong một ngày ở văn phòng có đủ năm loại cảm xúc: nhận ra ai đang vui, buồn, ngượng, và câu đáp nào đúng mức, câu nào lố hoặc lạc chỗ.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Nhi**, sinh viên IT năm 3, đang ở **tháng thứ hai** thực tập tại một văn phòng ở **Austin, Texas** (Mỹ). Đồng nghiệp người Mỹ, Úc, New Zealand.',
          'Một ngày của Nhi có đủ **năm loại cảm xúc**: được khen, chúc mừng, phải xin lỗi, chia buồn, được cảm ơn.',
          'Nghe xem Nhi đáp **đúng mức** chưa. Hai lần Nhi lỡ lời theo thói quen Việt Nam, và đồng nghiệp phản ứng rất rõ.',
          'Ngày 11 bạn kể chuyện **đã xong** bằng quá khứ đơn (I went, I left). Hôm nay thêm **tin vừa xảy ra**, còn nóng hổi: **I\'ve just heard…, She\'s just got engaged** (hiện tại hoàn thành).',
          'Cuối ngày có **bài kiểm tra chặng 2** (Ngày 7–12). Học xong ba bài và bài tập rồi hãy làm.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Bánh chuối và chiếc nhẫn' },
      {
        t: 'canh',
        anh: ['banana', 'shortcake', 'woman-technologist', 'ring', 'popcorn', 'party-popper'],
        caption: '9 giờ sáng. Nhi mang tới văn phòng một hộp **bánh chuối** tự làm. **Dana**, nhà thiết kế người Mỹ, ăn thử rồi khen. Sau đó Dana kể cho Nhi một tin rất vui. Nhi lỡ lời hai lần.',
      },
      {
        t: 'listen',
        id: 'gtd12-nghe-canh1',
        title: 'Scene 1 — Banana cake and a ring',
        note: 'Nghe xem Nhi phản ứng thế nào khi được khen, Dana có tin gì, và câu hỏi nào của Nhi làm Dana bật cười ngượng.',
        lines: [
          { who: 'Dana', voice: 'us-nu', text: "Morning, Nhi! Ooh, what's in the box?", vi: 'Chào Nhi! Ồ, trong hộp có gì thế?' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Banana cake. I made it last night for the team. Please, take some.', vi: 'Bánh chuối ạ. Tối qua em làm cho cả nhóm. Chị lấy ăn đi ạ.' },
          { who: 'Dana', voice: 'us-nu', text: 'Mmm! Oh my gosh, this is so good. Did you really make this yourself?', vi: 'Ừm! Trời ơi, ngon quá. Em tự làm thật à?' },
          { who: 'Nhi', voice: 'ca-nu', text: "Oh no, it's not good. It's too sweet, and it's a bit dry. I'm a terrible cook.", vi: 'Ôi không, không ngon đâu ạ. Ngọt quá, lại hơi khô. Em nấu ăn dở lắm.' },
          { who: 'Dana', voice: 'us-nu', text: "Are you kidding? It's amazing. Just say thank you!", vi: 'Em đùa à? Tuyệt lắm đấy. Cứ nói cảm ơn là được!' },
          { who: 'Nhi', voice: 'ca-nu', text: "Okay… thank you! I'm glad you like it. It's my mom's recipe.", vi: 'Vâng… em cảm ơn ạ! Chị thích là em vui rồi. Công thức của mẹ em đấy.' },
          { who: 'Dana', voice: 'us-nu', text: "Well, your mom is a genius. Hey, can I tell you something? You're the first person I've told at work.", vi: 'Vậy mẹ em là thiên tài. Này, chị kể em nghe chuyện này nhé? Em là người đầu tiên ở công ty chị kể đấy.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Of course. What is it?', vi: 'Dạ vâng. Chuyện gì thế chị?' },
          { who: 'Dana', voice: 'us-nu', text: "Theo proposed on Saturday! We're engaged!", vi: 'Theo cầu hôn chị hôm thứ Bảy! Bọn chị đính hôn rồi!' },
          { who: 'Nhi', voice: 'ca-nu', text: "Oh my gosh, congratulations! I'm so happy for you! Can I see the ring?", vi: 'Trời ơi, chúc mừng chị! Em mừng cho chị quá! Cho em xem nhẫn với?' },
          { who: 'Dana', voice: 'us-nu', text: 'Here. He hid it in a bucket of popcorn at the movies. I almost ate it.', vi: 'Đây. Anh ấy giấu nó trong xô bỏng ngô ở rạp phim. Suýt nữa chị ăn luôn.' },
          { who: 'Nhi', voice: 'ca-nu', text: "No way! It's so beautiful. So, when are you going to have a baby?", vi: 'Không thể tin được! Đẹp quá. Thế bao giờ chị định có em bé?' },
          { who: 'Dana', voice: 'us-nu', text: "Whoa! Slow down! We haven't even chosen a date for the wedding yet.", vi: 'Ối! Từ từ đã em! Bọn chị còn chưa chọn ngày cưới cơ mà.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Oh, sorry! Was that too personal?', vi: 'Ôi, em xin lỗi! Câu đó riêng tư quá ạ?' },
          { who: 'Dana', voice: 'us-nu', text: "Ha, a little. My grandma asks me that every week, so I'm used to it.", vi: 'Ha, hơi hơi. Bà chị tuần nào cũng hỏi câu đó nên chị quen rồi.' },
          { who: 'Nhi', voice: 'ca-nu', text: "Well, I'm really happy for you. Theo is a lucky guy.", vi: 'Dù sao em vẫn mừng cho chị lắm. Anh Theo thật may mắn.' },
          { who: 'Dana', voice: 'us-nu', text: "Aw, that's so sweet. Thanks, Nhi.", vi: 'Ôi, dễ thương quá. Cảm ơn em, Nhi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd12-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Dana nói "Just say thank you!"?',
            options: ['Vì Nhi quên cảm ơn Dana đã ăn bánh', 'Vì Nhi chê bánh của mình khi đang được khen', 'Vì Dana muốn xin công thức', 'Vì bánh thật sự không ngon'],
            correct: 1,
            why: 'Nhi đáp lời khen bằng "**it\'s not good… I\'m a terrible cook**". Ở Việt Nam đó là khiêm tốn. Với người Mỹ, chối lời khen giống như bảo người khen là họ sai, nên Dana nhắc: cứ nhận và cảm ơn.',
          },
          {
            q: 'Dana vừa có tin gì?',
            options: ['Được thăng chức', 'Vừa cưới', 'Vừa đính hôn', 'Sắp có em bé'],
            correct: 2,
            why: '"Theo **proposed** on Saturday! We\'re **engaged**!" propose = cầu hôn, engaged = đã đính hôn. Chưa cưới, còn chưa chọn ngày.',
          },
          {
            q: 'Câu nào của Nhi làm Dana thấy hơi riêng tư?',
            options: ['Can I see the ring?', 'When are you going to have a baby?', "I'm so happy for you!", 'Theo is a lucky guy.'],
            correct: 1,
            why: 'Hỏi chuyện **con cái** ngay khi nghe tin đính hôn là quen ở Việt Nam, nhưng ở Mỹ đó là chuyện riêng. Dana phản ứng: "Whoa! **Slow down!**"',
          },
          {
            q: '"We haven\'t even chosen a date for the wedding yet." nghĩa là gì?',
            options: ['Họ đã chọn ngày nhưng chưa báo ai', 'Họ còn chưa chọn ngày cưới', 'Họ không định cưới', 'Đám cưới bị hoãn'],
            correct: 1,
            why: '**haven\'t + V3 + yet** = chưa làm (tính tới bây giờ). **even** nhấn mạnh: tới việc chọn ngày còn chưa làm, nói gì tới em bé.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Hộp cơm màu xanh' },
      {
        t: 'canh',
        anh: ['bento-box', 'man-technologist', 'grimacing-face', 'woman-technologist', 'hot-beverage'],
        caption: '12 giờ 30. **Lachlan**, lập trình viên người Úc, đi tìm hộp cơm của mình trong tủ lạnh chung. Nhi vừa ăn xong, và chợt nhận ra hộp mình vừa ăn có thể không phải của mình.',
      },
      {
        t: 'listen',
        id: 'gtd12-nghe-canh2',
        title: 'Scene 2 — The green lunch box',
        note: 'Nghe xem Nhi xin lỗi bằng mấy bước, chuộc lỗi bằng cách nào, và vì sao Lachlan nói "you\'ve already apologised three times".',
        lines: [
          { who: 'Lachlan', voice: 'au-nam', text: "Has anyone seen my lunch? It's in a green box with my name on the lid.", vi: 'Có ai thấy hộp cơm của tôi không? Hộp màu xanh, có tên tôi trên nắp.' },
          { who: 'Nhi', voice: 'ca-nu', text: "A green box? Oh no… I think I've just eaten it.", vi: 'Hộp xanh ạ? Ôi không… Hình như em vừa ăn mất rồi.' },
          { who: 'Lachlan', voice: 'au-nam', text: 'You what?', vi: 'Hả, cái gì cơ?' },
          { who: 'Nhi', voice: 'ca-nu', text: "I'm so sorry, Lachlan. I've got the same box, and I took it without looking at the name. It was my mistake.", vi: 'Em xin lỗi anh Lachlan nhiều lắm. Em có cái hộp y hệt, em lấy mà không nhìn tên. Là lỗi của em.' },
          { who: 'Lachlan', voice: 'au-nam', text: "Ha! Well, that explains it. So where's yours?", vi: 'Ha! Ra là thế. Thế hộp của em đâu?' },
          { who: 'Nhi', voice: 'ca-nu', text: "It's still in the fridge. It's bún chả, grilled pork with noodles. Please have it.", vi: 'Vẫn trong tủ lạnh ạ. Bún chả, thịt nướng với bún. Anh ăn đi ạ.' },
          { who: 'Lachlan', voice: 'au-nam', text: "Are you sure? I don't want to steal your lunch.", vi: 'Em chắc chứ? Anh không muốn cướp bữa trưa của em đâu.' },
          { who: 'Nhi', voice: 'ca-nu', text: "Please. It's the least I can do. And let me buy you a coffee this afternoon.", vi: 'Anh cứ ăn đi. Ít nhất em cũng phải làm được vậy. Chiều nay để em mời anh cà phê nữa.' },
          { who: 'Lachlan', voice: 'au-nam', text: 'Deal. And seriously, no harm done.', vi: 'Chốt. Mà thật đấy, không sao cả.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Lachlan, sorry again about your lunch. I feel so bad.', vi: '(hai mươi phút sau) Anh Lachlan, em xin lỗi lần nữa về bữa trưa. Em thấy áy náy quá.' },
          { who: 'Lachlan', voice: 'au-nam', text: "Nhi, you've already apologised three times! It's all good, I promise.", vi: 'Nhi ơi, em xin lỗi ba lần rồi đấy! Ổn hết mà, anh hứa.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Sorry! Oh no, I did it again.', vi: 'Em xin lỗi! Ôi trời, em lại thế nữa rồi.' },
          { who: 'Lachlan', voice: 'au-nam', text: "Ha! Look, this bún chả is so good that I want to steal your lunch every day.", vi: 'Ha! Này, bún chả ngon tới mức ngày nào anh cũng muốn cướp bữa trưa của em.' },
          { who: 'Nhi', voice: 'ca-nu', text: "Then from now on, I'll write my name on my box too.", vi: 'Vậy từ giờ em cũng sẽ viết tên lên hộp của em.' },
          { who: 'Lachlan', voice: 'au-nam', text: 'Good idea. Thanks for sharing, by the way. I owe you one.', vi: 'Ý hay. Mà cảm ơn em đã chia cho anh nhé. Anh nợ em một lần.' },
          { who: 'Nhi', voice: 'ca-nu', text: "No, you don't. We're even.", vi: 'Không đâu ạ. Mình hoà nhau rồi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd12-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Nhi ăn nhầm hộp cơm?',
            options: ['Vì đói quá', 'Vì hai người có hộp giống nhau và Nhi không nhìn tên', 'Vì Lachlan cho Nhi', 'Vì hộp của Nhi bị mất'],
            correct: 1,
            why: '"I\'ve got **the same box**, and I took it **without looking at the name**."',
          },
          {
            q: 'Lời xin lỗi đầu tiên của Nhi có những phần nào?',
            options: [
              'Chỉ nói "Sorry"',
              'Xin lỗi → nói rõ chuyện gì → nhận lỗi → đề nghị sửa (đưa hộp của mình, mời cà phê)',
              'Giải thích dài vì sao không phải lỗi mình',
              'Cười cho qua',
            ],
            correct: 1,
            why: '**I\'m so sorry** → **I took it without looking** → **It was my mistake** → **Please have it… let me buy you a coffee**. Đó là khung xin lỗi bốn bước của bài Nói.',
          },
          {
            q: 'Vì sao Lachlan nói "you\'ve already apologised three times"?',
            options: ['Vì anh vẫn còn giận', 'Vì Nhi xin lỗi quá nhiều; anh muốn Nhi thôi áy náy', 'Vì Nhi xin lỗi sai cách', 'Vì anh không nghe thấy'],
            correct: 1,
            why: 'Với người Úc, xin lỗi **một lần cho tử tế** là đủ. Xin lỗi mãi làm người kia phải dỗ lại mình. "**It\'s all good, I promise**" = thôi bỏ qua đi.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Trưởng nhóm trở lại sau đám tang' },
      {
        t: 'canh',
        anh: ['airplane-arrival', 'man-office-worker', 'woman-technologist', 'potted-plant', 'love-letter'],
        caption: 'Chiều cùng ngày. **Hamish**, trưởng nhóm người New Zealand, vừa bay về sau một tuần ở quê dự **đám tang ông nội**. Cả nhóm đã gửi thiệp chia buồn. Trong lúc anh đi vắng, Nhi tưới giúp mấy chậu cây trên bàn anh.',
      },
      {
        t: 'listen',
        id: 'gtd12-nghe-canh3',
        title: 'Scene 3 — Welcome back',
        note: 'Nghe câu chia buồn của Nhi và câu Hamish đáp. Chú ý Nhi KHÔNG hỏi những gì. Rồi nghe Hamish cảm ơn chuyện gì, và Nhi kể tin gì.',
        lines: [
          { who: 'Nhi', voice: 'ca-nu', text: 'Hamish, welcome back. I was so sorry to hear about your grandfather.', vi: 'Anh Hamish, mừng anh về. Em rất tiếc khi nghe tin về ông anh.' },
          { who: 'Hamish', voice: 'nz-nam', text: 'Thanks, Nhi. That means a lot.', vi: 'Cảm ơn em, Nhi. Anh trân trọng lắm.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'How are you doing?', vi: 'Anh thấy trong người thế nào ạ?' },
          { who: 'Hamish', voice: 'nz-nam', text: "I'm okay. Tired, mostly. It was such a long trip that I still don't know what day it is.", vi: 'Anh ổn. Chủ yếu là mệt. Chuyến bay dài tới mức anh vẫn chưa biết hôm nay là thứ mấy.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'From Wellington? I can imagine.', vi: 'Từ Wellington về ạ? Em hình dung được.' },
          { who: 'Hamish', voice: 'nz-nam', text: "Three flights and six hours in LA. But I'm really glad I went. He was ninety-one, and he had a great life.", vi: 'Ba chuyến bay và sáu tiếng chờ ở Los Angeles. Nhưng anh rất mừng là đã về. Ông chín mươi mốt tuổi, và ông đã sống một đời rất trọn vẹn.' },
          { who: 'Nhi', voice: 'ca-nu', text: 'He sounds like a wonderful man.', vi: 'Nghe anh kể thì ông là một người rất tuyệt.' },
          { who: 'Hamish', voice: 'nz-nam', text: 'He was. The church was so full that people were standing outside. Half the town came.', vi: 'Đúng vậy. Nhà thờ đông tới mức người ta phải đứng ngoài. Nửa thị trấn đến viếng.' },
          { who: 'Nhi', voice: 'ca-nu', text: "That's lovely. If there's anything I can do, just let me know.", vi: 'Thật cảm động. Nếu có gì em giúp được, anh cứ nói nhé.' },
          { who: 'Hamish', voice: 'nz-nam', text: "Actually, you've already done something. Someone watered my plants while I was away. Was that you?", vi: 'Thật ra em làm rồi đấy. Ai đó đã tưới cây cho anh trong lúc anh đi vắng. Là em à?' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Ha, yes. They looked a bit sad, so…', vi: 'Ha, vâng ạ. Trông chúng hơi héo nên…' },
          { who: 'Hamish', voice: 'nz-nam', text: 'Thanks so much. And please thank the team for the card. It really made my week.', vi: 'Cảm ơn em nhiều lắm. Và nhờ em cảm ơn cả nhóm về tấm thiệp. Nó làm anh ấm lòng cả tuần.' },
          { who: 'Nhi', voice: 'ca-nu', text: "You're welcome. It was nothing, really.", vi: 'Không có gì đâu ạ. Chuyện nhỏ thôi.' },
          { who: 'Hamish', voice: 'nz-nam', text: 'So, what have I missed? Has anything exciting happened?', vi: 'Thế anh bỏ lỡ những gì rồi? Có chuyện gì vui không?' },
          { who: 'Nhi', voice: 'ca-nu', text: 'Well, Dana has some big news, but she wants to tell you herself.', vi: 'Dạ, chị Dana có tin lớn, nhưng chị ấy muốn tự kể với anh.' },
          { who: 'Hamish', voice: 'nz-nam', text: "Ooh, I think I can guess. And what about you? Have you settled in?", vi: 'Ồ, anh đoán được rồi. Còn em thì sao? Em quen chỗ mới chưa?' },
          { who: 'Nhi', voice: 'ca-nu', text: "I think so. I've just joined a salsa class, and I've finally learned to love breakfast tacos.", vi: 'Em nghĩ là rồi ạ. Em vừa đăng ký một lớp nhảy salsa, và cuối cùng em cũng mê món taco ăn sáng.' },
          { who: 'Hamish', voice: 'nz-nam', text: "Look at you! You're more Texan than I am. Good on ya.", vi: 'Giỏi chưa kìa! Em còn "Texas" hơn cả anh. Hay lắm.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd12-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao cách Nhi chia buồn là đúng mực?',
            options: [
              'Nhi hỏi ông mất vì bệnh gì để biết mà an ủi',
              'Nhi nói một câu chia buồn ngắn, hỏi Hamish thấy thế nào, và để anh tự kể',
              'Nhi đổi chủ đề ngay để Hamish đỡ buồn',
              'Nhi không nói gì để tránh ngượng',
            ],
            correct: 1,
            why: '**I was so sorry to hear about…** + **How are you doing?** Nhi không hỏi nguyên nhân mất hay tuổi. Hamish tự kể ông 91 tuổi. Chi tiết là để người trong cuộc chọn nói hay không.',
          },
          {
            q: 'Hamish cảm ơn Nhi về việc gì?',
            options: ['Gửi hoa', 'Tưới cây trên bàn anh', 'Làm thay việc của anh', 'Đón anh ở sân bay'],
            correct: 1,
            why: '"Someone **watered my plants** while I was away. Was that you?" Còn tấm thiệp là của cả nhóm.',
          },
          {
            q: '"It was such a long trip that I still don\'t know what day it is." nghĩa là gì?',
            options: ['Chuyến đi dài tới mức anh vẫn còn lẫn lộn ngày', 'Anh không nhớ mình đi ngày nào', 'Chuyến đi bị hoãn', 'Anh muốn đi một chuyến dài nữa'],
            correct: 0,
            why: '**such + a + adj + N + that…** = (cái gì) … tới mức … Đây là điểm ngữ pháp nối câu của hôm nay.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Chú ý các âm rút gọn rất nhẹ: **I\'ve, you\'ve, haven\'t**. Nghe thiếu "\'ve" là câu đổi nghĩa.',
      },
      {
        t: 'dictation',
        id: 'gtd12-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — khen', spell: 'Did you really make this yourself?', answer: 'Did you really make this yourself?' },
          { label: 'Câu 2 — chúc mừng', spell: "I'm so happy for you!", answer: "I'm so happy for you!", alt: ['I am so happy for you!'] },
          { label: 'Câu 3 — chưa làm', spell: "We haven't even chosen a date yet.", answer: "We haven't even chosen a date yet.", alt: ['We have not even chosen a date yet.'] },
          { label: 'Câu 4 — vừa làm', spell: "I think I've just eaten it.", answer: "I think I've just eaten it.", alt: ['I think I have just eaten it.'] },
          { label: 'Câu 5 — xin lỗi đủ rồi', spell: "You've already apologised three times!", answer: "You've already apologised three times!", alt: ["You've already apologized three times!", 'You have already apologised three times!', 'You have already apologized three times!', "You've already apologised 3 times!", "You've already apologized 3 times!"] },
          { label: 'Câu 6 — chia buồn', spell: 'I was so sorry to hear about your grandfather.', answer: 'I was so sorry to hear about your grandfather.' },
          { label: 'Câu 7 — such … that', spell: "It was such a long trip that I still don't know what day it is.", answer: "It was such a long trip that I still don't know what day it is.", alt: ['It was such a long trip that I still do not know what day it is.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Just say thank you!', 'Cứ nhận lời khen đi, đừng chối.', 'Thank you! I\'m glad you like it.'],
          ['Slow down!', 'Từ từ đã! (bạn hỏi đi quá xa). **Không** phải bảo nói chậm.', 'Sorry! Was that too personal?'],
          ['You what? (Anh, Úc)', 'Hả? Cái gì cơ? (ngạc nhiên). Không phải bắt lỗi.', 'Nói lại rõ hơn.'],
          ['No harm done.', 'Không thiệt hại gì, bỏ qua đi.', 'Thanks for being so nice about it.'],
          ["It's all good.", 'Ổn cả mà, đừng lo nữa.', '(thôi xin lỗi, chuyển chuyện)'],
          ['I owe you one.', 'Tôi nợ bạn một lần (sẽ trả ơn).', 'Anytime! · No, we\'re even.'],
          ['That means a lot.', 'Lời của bạn có ý nghĩa với tôi. (đáp lời an ủi, lời khen chân thành)', '(gật đầu, không cần nói thêm)'],
          ['Look at you!', 'Giỏi chưa kìa! (khen kiểu trêu, thân mật)', 'Ha, thanks!'],
          ['Good on ya. (Úc, NZ)', 'Hay lắm, giỏi lắm.', 'Thanks!'],
        ],
        caption: 'Nhiều câu cảm xúc nghe như câu khác: **Slow down** không nói về tốc độ, **You what?** không phải chất vấn. Nghe **giọng và mặt** người nói trước khi hiểu theo chữ.',
      },
      {
        t: 'note',
        title: 'Mẹo: tin đến bất ngờ mà không nghe kịp',
        items: [
          '**Phản ứng cảm xúc trước, hỏi chi tiết sau.** Nghe ra "engaged" mà sót phần còn lại? Nói ngay "Oh my gosh, congratulations!" rồi mới "Sorry, when did he propose?"',
          'Không chắc là tin **vui hay buồn**? Nhìn mặt và nghe giọng. Vẫn không chắc thì dùng câu trung tính: **"Oh! How are you feeling about it?"**. Câu này đúng trong cả hai trường hợp.',
          'Với tin buồn, **đừng hỏi lại chi tiết** ("Sorry, who died?"). Nghe sót tên thì nói chung: **"I\'m so sorry to hear that."** Chi tiết sẽ đến sau, hoặc hỏi đồng nghiệp khác.',
          'Nghe thấy một câu ngắn, giọng hạ thấp, nói chậm thường là tin buồn. Giọng cao, nhanh, có "guess what" thường là tin vui.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Khen thành tích', 'Well done! · Brilliant!', 'Good job! · Nice work! · Awesome!', 'Good on ya! · Well done!'],
          ['Cảm ơn nhanh', 'Cheers. · Ta.', 'Thanks! · Thanks a bunch.', 'Cheers. · Ta.'],
          ['Đáp lời cảm ơn', 'No problem. · Not at all.', "You're welcome. · Sure thing. · You bet.", 'No worries.'],
          ['Xin lỗi nhỏ', 'Sorry! (rất nhiều, kể cả khi người khác va vào mình)', 'Sorry! · My bad.', 'Sorry, mate. · My bad.'],
          ['Bỏ qua lời xin lỗi', "Don't worry about it. · No harm done.", "It's all good. · No big deal.", "No worries. · She'll be right."],
          ['Báo tin vừa xảy ra', "She's just got engaged.", 'She just got engaged.', "She's just got engaged."],
        ],
        caption: 'Dòng cuối quan trọng: người **Mỹ** hay dùng **quá khứ đơn** với just / already (I just heard, Did you eat yet?), người **Anh, Úc** dùng **hiện tại hoàn thành** (I\'ve just heard, Have you eaten yet?). Nghe cả hai đều đúng. Khi nói, chọn một kiểu.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-b1-01 · My First Salary** — Hà nhận lương thực tập đầu tiên; nghe anh Long chúc mừng và hỏi "How does it feel?".',
          '**en-b1-03 · A Friend I Have Never Met** — tên tập đã là hiện tại hoàn thành. Nghe cách nói về điều **chưa từng** làm.',
          '**en-ds-b1-01 · This Isn\'t What We Ordered** — nhà hàng giao sai món và **xin lỗi** ba lần theo ba cách khác nhau (chặng 4 học sâu về phàn nàn).',
          'Ba tập là chuyện khác bài hôm nay. Nghe để đếm xem có bao nhiêu câu cảm xúc bạn vừa học.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd12-noi',
    kind: 'speaking',
    title: 'Nói đúng cảm xúc, đúng mức',
    goal: 'Khen, nhận lời khen, cảm ơn, xin lỗi, chia buồn và chúc mừng bằng câu tự nhiên, ở đúng mức thân hay trang trọng; báo tin vừa xảy ra bằng hiện tại hoàn thành và nhấn mạnh bằng so / such … that.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**29 câu mẫu** cho năm loại cảm xúc, và cả **câu đáp lại** từng loại (người ta khen thì nói gì, cảm ơn thì đáp gì).',
          'Ngữ pháp: **hiện tại hoàn thành cơ bản** (I\'ve just…, already, yet, Have you…?) và **so / such … that**.',
          '**Đúng mức** quan trọng hơn đúng chữ: xin lỗi một lần là đủ, nhận lời khen thì cảm ơn, chia buồn thì ngắn và không hỏi chi tiết.',
          'Ôm, đập tay, chắp tay, cúi chào: cái nào hợp ở đâu.',
          'Cuối bài nhập vai một cuộc gặp có đủ ba việc: chúc mừng, xin lỗi, cảm ơn.',
        ],
      },

      { t: 'h', text: '1. 29 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Mỗi cảm xúc có **câu nói** và **câu đáp**. Học theo cặp. Bấm **Che nghĩa** để tự kiểm tra, rồi đổi sang **Che tiếng Anh** và nói to.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'This is so good!', pos: 'phr', ipa: '/ðɪs ɪz ˌsoʊ ˈɡʊd/', vi: 'Ngon quá! / Hay quá!', ex: 'Mmm, this is so good! Did you make it?', exVi: 'Ừm, ngon quá! Bạn làm à?', anh: 'shortcake' },
          { w: 'I love your…', pos: 'phr', ipa: '/aɪ ˈlʌv jər/', vi: 'Mình thích … của bạn quá.', ex: 'I love your jacket! Where did you get it?', exVi: 'Mình thích áo khoác của bạn quá! Bạn mua ở đâu thế?', more: 'Khen **đồ, lựa chọn, việc làm**. Tránh khen ngoại hình cơ thể ở công sở.' },
          { w: 'You did a great job on…', pos: 'phr', ipa: '/ju dɪd ə ˌɡreɪt ˈdʒɑːb ɑːn/', vi: 'Bạn làm … tốt lắm.', ex: 'You did a great job on the party decorations.', exVi: 'Bạn trang trí bữa tiệc đẹp lắm.' },
          { w: 'That looks great on you.', pos: 'phr', ipa: '/ðæt lʊks ˈɡreɪt ɑːn ju/', vi: 'Bạn mặc cái đó đẹp lắm.', ex: 'New glasses? They look great on you.', exVi: 'Kính mới à? Bạn đeo đẹp lắm.' },
          { w: "Thanks! I'm glad you like it.", pos: 'phr', ipa: '/θæŋks aɪm ˈɡlæd ju ˈlaɪk ɪt/', vi: 'Cảm ơn! Bạn thích là mình vui rồi.', ex: 'This cake is amazing. — Thanks! I\'m glad you like it.', exVi: 'Bánh tuyệt quá. — Cảm ơn! Bạn thích là mình vui rồi.', more: 'Câu nhận lời khen **an toàn nhất**. Không chối, không khoe.' },
          { w: "Aw, that's so kind of you.", pos: 'phr', ipa: '/ɔː ðæts ˌsoʊ ˈkaɪnd əv ju/', vi: 'Ôi, bạn tốt quá.', ex: 'You helped me so much this month. — Aw, that\'s so kind of you.', exVi: 'Tháng này bạn giúp mình nhiều lắm. — Ôi, bạn tốt quá.' },
          { w: 'Thanks so much for…', pos: 'phr', ipa: '/ˈθæŋks soʊ ˈmʌtʃ fər/', vi: 'Cảm ơn bạn nhiều vì…', ex: 'Thanks so much for watering my plants.', exVi: 'Cảm ơn em nhiều vì đã tưới cây cho anh.', more: 'Sau **for** là danh từ hoặc **V-ing**: for the card, for helping me.' },
          { w: 'I really appreciate it.', pos: 'phr', ipa: '/aɪ ˈrɪəli əˈpriːʃieɪt ɪt/', vi: 'Mình thật sự cảm kích.', ex: 'You stayed late to help me. I really appreciate it.', exVi: 'Bạn ở lại muộn để giúp mình. Mình thật sự cảm kích.' },
          { w: "You're a lifesaver.", pos: 'phr', ipa: '/jʊr ə ˈlaɪfseɪvər/', vi: 'Bạn cứu mình một bàn thua.', ex: 'You brought my charger? You\'re a lifesaver!', exVi: 'Bạn mang sạc cho mình à? Bạn cứu mình rồi!' },
          { w: 'I owe you one.', pos: 'phr', ipa: '/aɪ ˈoʊ ju ˈwʌn/', vi: 'Mình nợ bạn một lần.', ex: 'Thanks for covering for me. I owe you one.', exVi: 'Cảm ơn đã làm thay mình. Mình nợ bạn một lần.' },
          { w: "You're welcome.", pos: 'phr', ipa: '/jʊr ˈwelkəm/', vi: 'Không có gì.', ex: 'Thanks for the card. — You\'re welcome.', exVi: 'Cảm ơn tấm thiệp. — Không có gì.' },
          { w: 'Anytime!', pos: 'phr', ipa: '/ˈenitaɪm/', vi: 'Lúc nào cũng được! (cứ nhờ mình)', ex: 'Thanks for the ride. — Anytime!', exVi: 'Cảm ơn đã chở mình. — Lúc nào cũng được!' },
          { w: 'It was nothing, really.', pos: 'phr', ipa: '/ɪt wəz ˈnʌθɪŋ ˈrɪəli/', vi: 'Chuyện nhỏ thôi mà.', ex: 'Thanks so much for your help. — It was nothing, really.', exVi: 'Cảm ơn bạn nhiều. — Chuyện nhỏ thôi mà.' },
          { w: 'My pleasure.', pos: 'phr', ipa: '/maɪ ˈpleʒər/', vi: 'Rất hân hạnh. (lịch sự, hơi trang trọng)', ex: 'Thank you for showing us around. — My pleasure.', exVi: 'Cảm ơn anh đã dẫn chúng tôi đi tham quan. — Rất hân hạnh.' },
          { w: "I'm so sorry about…", pos: 'phr', ipa: '/aɪm ˌsoʊ ˈsɑːri əˈbaʊt/', vi: 'Mình rất xin lỗi về…', ex: "I'm so sorry about your lunch.", exVi: 'Em xin lỗi về bữa trưa của anh.', more: 'sorry **about** + N · sorry **for** + V-ing · sorry (that) + câu.' },
          { w: 'It was my mistake.', pos: 'phr', ipa: '/ɪt wəz maɪ mɪˈsteɪk/', vi: 'Là lỗi của mình.', ex: 'I took it without looking. It was my mistake.', exVi: 'Mình lấy mà không nhìn. Là lỗi của mình.' },
          { w: 'My bad.', pos: 'phr', ipa: '/maɪ ˈbæd/', vi: 'Lỗi mình. (rất thân, lỗi nhỏ)', ex: 'Oops, that was your seat? My bad!', exVi: 'Ối, ghế của bạn à? Lỗi mình!', more: 'Chỉ dùng với bạn bè, lỗi vặt. Lỗi thật thì không dùng.' },
          { w: 'Let me make it up to you.', pos: 'phr', ipa: '/ˌlet mi ˌmeɪk ɪt ˈʌp tə ju/', vi: 'Để mình chuộc lỗi nhé.', ex: "I forgot your birthday! Let me make it up to you. Dinner's on me.", exVi: 'Mình quên sinh nhật bạn! Để mình chuộc lỗi nhé. Bữa tối mình mời.' },
          { w: 'I apologise for…', pos: 'phr', ipa: '/aɪ əˈpɑːlədʒaɪz fər/', vi: 'Tôi xin lỗi vì… (trang trọng)', ex: 'I apologise for the late reply.', exVi: 'Tôi xin lỗi vì trả lời muộn.', more: 'Anh: apologise · Mỹ: apologize. Dùng trong email, với khách.' },
          { w: "Don't worry about it.", pos: 'phr', ipa: '/ˌdoʊnt ˈwɝːri əbaʊt ɪt/', vi: 'Đừng bận tâm.', ex: "I'm so sorry I'm late. — Don't worry about it.", exVi: 'Xin lỗi mình đến muộn. — Đừng bận tâm.' },
          { w: 'No harm done.', pos: 'phr', ipa: '/ˌnoʊ ˌhɑːrm ˈdʌn/', vi: 'Không sao cả, chẳng thiệt gì.', ex: 'Sorry, I took your pen. — No harm done.', exVi: 'Xin lỗi, mình cầm nhầm bút của bạn. — Không sao cả.' },
          { w: 'I was so sorry to hear about…', pos: 'phr', ipa: '/aɪ wəz ˌsoʊ ˈsɑːri tə ˈhɪr əbaʊt/', vi: 'Mình rất tiếc khi nghe tin về…', ex: 'I was so sorry to hear about your grandfather.', exVi: 'Em rất tiếc khi nghe tin về ông anh.', more: 'Câu chia buồn **chuẩn nhất** khi gặp lại người vừa có tang.', anh: 'white-flower' },
          { w: "I'm so sorry for your loss.", pos: 'phr', ipa: '/aɪm ˌsoʊ ˈsɑːri fər jər ˈlɔːs/', vi: 'Xin chia buồn với bạn.', ex: "I've just heard. I'm so sorry for your loss.", exVi: 'Mình vừa nghe tin. Xin chia buồn với bạn.' },
          { w: "If there's anything I can do, let me know.", pos: 'phr', ipa: '/ɪf ðerz ˈeniθɪŋ aɪ kən ˈduː let mi ˈnoʊ/', vi: 'Có gì mình giúp được thì cứ nói nhé.', ex: "Take your time. If there's anything I can do, let me know.", exVi: 'Cứ từ từ. Có gì mình giúp được thì cứ nói nhé.' },
          { w: 'Congratulations on…!', pos: 'phr', ipa: '/kənˌɡrætʃəˈleɪʃənz ɑːn/', vi: 'Chúc mừng … !', ex: 'Congratulations on your engagement!', exVi: 'Chúc mừng chị đính hôn!', more: 'Luôn có **-s**. Sau là **on**, không phải for. Thân: **Congrats!**', anh: 'party-popper' },
          { w: "I'm so happy for you!", pos: 'phr', ipa: '/aɪm ˌsoʊ ˈhæpi fər ju/', vi: 'Mình mừng cho bạn quá!', ex: "You got the scholarship? I'm so happy for you!", exVi: 'Bạn được học bổng à? Mình mừng cho bạn quá!' },
          { w: 'You deserve it.', pos: 'phr', ipa: '/ju dɪˈzɝːv ɪt/', vi: 'Bạn xứng đáng mà.', ex: 'You worked so hard this year. You deserve it.', exVi: 'Năm nay bạn làm việc chăm lắm. Bạn xứng đáng mà.' },
          { w: 'Well done!', pos: 'phr', ipa: '/ˌwel ˈdʌn/', vi: 'Giỏi lắm! / Làm tốt lắm!', ex: 'You passed your driving test? Well done!', exVi: 'Bạn thi đỗ bằng lái à? Giỏi lắm!', more: 'Khen **thành tích**. Không dùng cho tin đính hôn, có em bé (dùng Congratulations).' },
          { w: "I've just heard the news!", pos: 'phr', ipa: '/aɪv ˌdʒʌst ˈhɝːd ðə ˈnuːz/', vi: 'Mình vừa nghe tin!', ex: "I've just heard the news! Congratulations!", exVi: 'Mình vừa nghe tin! Chúc mừng nhé!' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Với cảm xúc, **sai mức** còn tệ hơn sai ngữ pháp. "My bad!" khi làm hỏng việc của khách nghe như coi thường. "Please accept my deepest condolences" nói miệng với đồng nghiệp lại nghe như đọc thiệp.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Khen', 'This is awesome!', 'This is really good.', 'That was an excellent speech.'],
          ['Cảm ơn', "Thanks a lot! You're a lifesaver.", 'Thanks so much for your help.', 'Thank you very much. I really appreciate your help.'],
          ['Đáp lời cảm ơn', 'Anytime!', "You're welcome. · No problem.", 'It was my pleasure.'],
          ['Xin lỗi', 'My bad! · Oops, sorry!', "I'm so sorry. That was my mistake.", 'I sincerely apologise for the inconvenience.'],
          ['Chia buồn', "Oh no, I'm so sorry. I'm here if you need anything.", 'I was so sorry to hear about your grandfather.', 'Please accept my deepest condolences. (thường là viết)'],
          ['Chúc mừng', 'Congrats!! That\'s amazing!', "Congratulations! I'm so happy for you.", 'Congratulations on your promotion. It is very well deserved.'],
        ],
        caption: 'Chưa chắc thì chọn cột **giữa**. Riêng chia buồn: dù thân đến mấy cũng **không đùa**, không emoji cười.',
      },
      {
        t: 'note',
        title: 'Mẹo: cảm ơn nhiều, xin lỗi vừa đủ',
        items: [
          'Ở Việt Nam ít ai nói "cảm ơn" với người nhà hay khi được rót nước. Người Anh – Mỹ – Úc nói **thanks** cho **mọi** việc nhỏ: được mở cửa giúp, được đưa menu, cả với bố mẹ.',
          'Ngược lại, xin lỗi về **một** lỗi thì nói **một lần cho đàng hoàng** (xin lỗi → lỗi gì → nhận lỗi → sửa). Xin lỗi đi xin lỗi lại như Nhi ở cảnh 2 làm người kia phải an ủi bạn.',
          'Được cảm ơn mà đáp "No, no, it\'s nothing" quá nhiều lần cũng giống chối lời khen. Một câu **You\'re welcome** hay **Anytime!** là đủ.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Ngày 11 bạn kể chuyện **đã xong, có mốc thời gian** (I left at seven) bằng quá khứ đơn. Hôm nay là tin **vừa xảy ra, không nói giờ**, kết quả còn ở đây: "I\'ve just eaten your lunch" (hộp cơm giờ trống). Đó là **hiện tại hoàn thành**: **have / has + V3**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + have / has + just + V3',
            vi: 'Việc vừa mới xảy ra, tin còn nóng. Khi nói: I\'ve, you\'ve, she\'s, we\'ve.',
            examples: [
              { en: "I've just heard the news.", vi: 'Mình vừa nghe tin.' },
              { en: "She's just got engaged.", vi: 'Chị ấy vừa đính hôn.' },
              { en: "I think I've just eaten your lunch.", vi: 'Hình như em vừa ăn mất bữa trưa của anh.' },
            ],
          },
          {
            formula: 'S + have / has + already + V3',
            vi: 'Đã … rồi (sớm hơn người ta nghĩ, hoặc đủ rồi).',
            examples: [
              { en: "You've already apologised three times!", vi: 'Em xin lỗi ba lần rồi đấy!' },
              { en: "You've already done something.", vi: 'Em đã giúp rồi đấy.' },
              { en: "We've already sent a card.", vi: 'Bọn mình gửi thiệp rồi.' },
            ],
          },
          {
            formula: "S + haven't / hasn't + V3 + yet",
            vi: 'Chưa … (tính tới giờ). yet đứng cuối câu.',
            examples: [
              { en: "We haven't chosen a date yet.", vi: 'Bọn chị chưa chọn ngày.' },
              { en: "Hamish hasn't met Dana's fiancé yet.", vi: 'Hamish chưa gặp hôn phu của Dana.' },
              { en: "I haven't thanked her yet.", vi: 'Mình chưa cảm ơn cô ấy.' },
            ],
          },
          {
            formula: 'Have / Has + S + V3 (+ yet)?',
            vi: 'Hỏi: đã … chưa? Đã từng …?',
            examples: [
              { en: 'Have you heard about Dana?', vi: 'Bạn nghe tin về Dana chưa?' },
              { en: 'Has Hamish come back yet?', vi: 'Hamish về chưa?' },
              { en: 'Have you tried bún chả?', vi: 'Bạn ăn thử bún chả chưa?' },
            ],
          },
          {
            formula: 'so + adj + that + S + V · such + (a / an) + adj + N + that + S + V',
            vi: '… tới mức … so đi với tính từ đứng một mình; such đi với cụm danh từ.',
            examples: [
              { en: 'The cake was so good that it was gone by ten.', vi: 'Bánh ngon tới mức mười giờ đã hết.' },
              { en: 'It was such a long trip that I still feel tired.', vi: 'Chuyến đi dài tới mức tôi vẫn còn mệt.' },
              { en: 'She is such a good cook that we all asked for the recipe.', vi: 'Cô ấy nấu ngon tới mức ai cũng xin công thức.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Hiện tại hoàn thành', 'Quá khứ đơn', 'Vì sao'],
        rows: [
          ["I've just heard the news.", 'I heard the news **yesterday**.', 'Có mốc thời gian đã qua (yesterday, at 3, last week) → **quá khứ đơn**.'],
          ["She's lost her keys. (giờ vẫn chưa thấy)", 'She lost her keys **last week**. (có thể đã tìm thấy)', 'Hiện tại hoàn thành nói về **kết quả bây giờ**.'],
          ['Have you eaten? (bây giờ còn đói không?)', 'Did you eat **at the party**?', 'Hỏi về một dịp cụ thể đã qua → Did…?'],
          ["I've been to Hội An. (trải nghiệm, không nói khi nào)", 'I went to Hội An **in 2023**.', 'Có năm → quá khứ đơn.'],
        ],
        caption: 'Quy tắc nhanh: câu có **mốc thời gian đã qua** thì không dùng have + V3. Ngày 11 (kể chuyện) gần như toàn quá khứ đơn; hôm nay (báo tin) hay dùng hiện tại hoàn thành.',
      },
      {
        t: 'table',
        head: ['Lời cảm xúc', 'Giới từ / dạng đi sau', 'Ví dụ'],
        rows: [
          ['Thanks / Thank you', 'for + N / V-ing', 'Thanks for the card. · Thank you for helping me.'],
          ['Sorry', 'about + N · for + V-ing · (that) + câu', 'Sorry about your lunch. · Sorry for being late. · Sorry I forgot.'],
          ['Congratulations', 'on + N / V-ing', 'Congratulations on your new job. · on passing the exam.'],
          ['happy / sorry for + người', 'for + người', "I'm so happy for you. · I feel sorry for him."],
          ['sorry to hear', 'about + N · (that) + câu', 'Sorry to hear about your grandfather. · Sorry to hear you were ill.'],
        ],
      },
      {
        t: 'rule',
        formula: "S + have / has + just / already + V3 · haven't + V3 + yet · so + adj + that · such + a + adj + N + that",
        vi: 'Tin vừa xảy ra, chưa nói giờ → have / has + V3. Có mốc giờ đã qua → quá khứ đơn. Muốn nói "… tới mức…": so + tính từ, such + cụm danh từ.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: so … that · such … that',
        items: [
          '**so + tính từ / trạng từ + that**: "The church was **so full that** people stood outside."',
          '**such + (a / an) + tính từ + danh từ + that**: "It was **such a long trip that** I\'m still tired." Danh từ số nhiều hoặc không đếm được thì bỏ a: "such nice people", "such good news".',
          'Khi nói, **that** thường bị bỏ: "It was so good I ate three pieces."',
          'Muốn chỉ nhấn mạnh, không cần vế sau: "You\'re **so** kind!" · "It was **such** a lovely card!" Đây là cách khen, cảm ơn nghe ấm hơn hẳn.',
          'Đừng lẫn: ~~so a long trip~~ · ~~such long~~. Có a + danh từ → such. Chỉ có tính từ → so.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd12-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "have / has + just / already + V3 · haven't … yet · so / such … that",
        items: [
          { q: 'Mình vừa nghe tin. Chúc mừng nhé!', hint: 'just, hear, the news', answers: ["I've just heard the news. Congratulations!", 'I have just heard the news. Congratulations!', "I just heard the news. Congratulations!", "I've just heard the news. Congrats!", "I just heard the news. Congrats!"] },
          { q: 'Mình chưa cảm ơn cô ấy.', hint: "haven't, thank, yet", answers: ["I haven't thanked her yet.", 'I have not thanked her yet.'] },
          { q: 'Bạn ăn thử phở chưa?', hint: 'have you, try', answers: ['Have you tried pho?', 'Have you tried phở?', 'Have you tried pho yet?', 'Have you tried phở yet?', 'Have you ever tried pho?', 'Have you ever tried phở?'] },
          { q: 'Bánh ngon tới mức mười giờ đã hết.', hint: 'so … that, gone', answers: ['The cake was so good that it was gone by ten.', 'The cake was so good it was gone by ten.', 'The cake was so good that it was gone by 10.', 'The cake was so delicious that it was gone by ten.'] },
          { q: 'Đó là một tấm thiệp đẹp tới mức anh ấy giữ nó trên bàn.', hint: 'such a … that, keep, on his desk', answers: ['It was such a beautiful card that he kept it on his desk.', 'It was such a nice card that he kept it on his desk.', 'It was such a lovely card that he kept it on his desk.', 'It was such a beautiful card that he keeps it on his desk.', 'It was such a nice card that he keeps it on his desk.', 'It was such a lovely card that he keeps it on his desk.', 'It was such a beautiful card he kept it on his desk.'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi nói cảm xúc',
        items: [
          '~~Congratulation!~~ · ~~Congratulations for your new job.~~ → **Congratulations on your new job!** Luôn có **-s**, và đi với **on**.',
          '~~No, no, it\'s not good. I\'m bad at it.~~ (khi được khen) → **Thank you! I\'m glad you like it.** Chối lời khen là khiêm tốn ở Việt Nam, nhưng với người Anh – Mỹ – Úc nó giống như bảo người khen là họ sai.',
          '~~Thank you for help me.~~ → **Thank you for helping me.** · **Thanks for your help.** Sau for là V-ing hoặc danh từ.',
          '~~Sorry for late.~~ → **Sorry I\'m late.** · **Sorry for being late.** late là tính từ, không đứng một mình sau for.',
          '~~I have seen him yesterday.~~ → **I saw him yesterday.** Có mốc thời gian đã qua là quá khứ đơn, dù nghe có vẻ "đã".',
          '~~It was so a long trip.~~ → **It was such a long trip.** · **The trip was so long.**',
          '~~How did he die? How old was he?~~ (khi chia buồn) → **I\'m so sorry to hear that. How are you doing?** Nguyên nhân, tuổi là chuyện để người trong cuộc tự kể nếu muốn.',
          '~~So when are you having a baby?~~ · ~~How much was the ring?~~ (khi nghe tin đính hôn, cưới) → **Congratulations! How did he propose?** Ở Việt Nam đó là quan tâm; ở Anh – Mỹ – Úc, con cái và tiền là chuyện riêng. Hỏi về **câu chuyện** thì an toàn và người ta rất thích kể.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể đi cùng cảm xúc' },
      {
        t: 'p',
        text: 'Cùng một câu "Congratulations!", ôm hay bắt tay, cười hay không, làm nó ấm áp hoặc thành vô duyên. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi khen, cảm ơn, xin lỗi, chia buồn, chúc mừng',
        items: [
          { anh: 'people-hugging', w: 'Congratulations! Come here!', ro: '', vi: 'Ôm chúc mừng: với bạn thân thì tự nhiên. Ở công sở Mỹ, chỉ ôm khi người kia **mở tay trước**. Với khách, sếp, đồng nghiệp Nhật: bắt tay hoặc chỉ nói.' },
          { anh: 'raised-hand', w: 'High five!', ro: '/ˌhaɪ ˈfaɪv/', vi: 'Đập tay: vui, thân mật, dùng nhiều ở Mỹ, Úc khi xong một việc khó cùng nhau.' },
          { anh: 'clapping-hands', w: 'Well done, everyone!', ro: '/ˌwel ˈdʌn ˈevriwʌn/', vi: 'Vỗ tay ở công sở: chúc mừng thành tích của nhóm hoặc người vừa trình bày.' },
          { anh: 'folded-hands', w: 'Thank you so much.', ro: '', vi: 'Chắp tay: ở Thái, Ấn là lời chào. Biểu tượng 🙏 trong tin nhắn người Mỹ đọc là "cảm ơn / làm ơn". Nói chuyện trực tiếp thì người Anh – Mỹ ít chắp tay.' },
          { anh: 'person-bowing', w: 'Thank you very much.', ro: '', vi: 'Đồng nghiệp Nhật cúi khi cảm ơn và khi xin lỗi. Cúi càng sâu, càng lâu là càng thành khẩn. Bạn cúi nhẹ đáp lại là đủ.' },
          { anh: 'pensive-face', w: "I'm so sorry for your loss.", ro: '', vi: 'Chia buồn: giọng nhỏ, nói chậm, mặt nghiêm, nhìn vào mắt người kia. **Không cười cho đỡ ngượng**, đây là thói quen dễ bị hiểu lầm nhất của người Việt.' },
          { anh: 'face-holding-back-tears', w: 'That means a lot.', ro: '/ðæt miːnz ə ˈlɑːt/', vi: 'Cảm động thì cứ để lộ ra. Người Anh – Mỹ – Úc không coi xúc động là yếu đuối.' },
          { anh: 'heart-hands', w: "I'm so happy for you!", ro: '', vi: 'Tay hình trái tim: người trẻ dùng với bạn bè. Với sếp, khách thì không.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Được khen', 'Chối khéo: "Đâu có, bình thường thôi".', 'Nhận và cảm ơn.', 'Chối khéo, giống Việt Nam.'],
          ['Nói cảm ơn', 'Ít nói với người nhà, phục vụ.', 'Nói với mọi người, mọi việc nhỏ.', 'Nói rất nhiều, kèm cúi.'],
          ['Xin lỗi lỗi nhỏ', 'Hay cười cho qua.', 'Anh nói sorry liên tục; Mỹ, Úc ít hơn nhưng vẫn nói.', 'Xin lỗi nhiều, kèm cúi.'],
          ['Chia buồn', 'Hỏi han chi tiết, đi viếng, phúng viếng bằng tiền.', 'Thiệp, hoa, mang đồ ăn tới nhà. Không hỏi chi tiết.', 'Đi viếng, phong bì tiền, rất trang trọng.'],
          ['Mừng cưới', 'Phong bì tiền.', 'Quà theo danh sách cô dâu chú rể lập sẵn, hoặc thiệp kèm tiền.', 'Phong bì tiền trong bao trang trí riêng.'],
          ['Sau tin vui', 'Hỏi tiếp chuyện con cái, lương, nhà.', 'Hỏi về câu chuyện (How did he propose?), không hỏi tiền, con.', 'Ít hỏi chuyện riêng.'],
        ],
        caption: 'Hai thói quen người Việt nên sửa trước tiên khi làm với người Anh – Mỹ – Úc: **nhận lời khen** và **không hỏi chuyện riêng sau tin vui**.',
      },

      { t: 'h', text: '6. Phát âm: ngữ điệu cảm xúc và âm rút gọn' },
      {
        t: 'p',
        text: 'Câu cảm xúc nói **không có ngữ điệu** nghe như máy đọc, dù chữ đúng. Tin vui: giọng **lên cao**, nhấn mạnh **so**. Chia buồn: giọng **thấp, chậm**, ngắt nhẹ. Và giữ âm **/v/** rất nhẹ trong **I\'ve, you\'ve**: nuốt mất nó thì "I\'ve just heard" thành "I just heard" (kiểu Mỹ, cũng đúng), còn "I\'ve heard" thành "I heard" (quá khứ đơn, đổi nghĩa).',
      },
      {
        t: 'phatam',
        id: 'gtd12-phat-am',
        title: 'Luyện phát âm — 8 câu cảm xúc',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Đọc to, có cảm xúc. Thử đọc câu 1 bằng giọng đều đều rồi giọng vui để nghe khác biệt.',
        items: [
          { text: 'Congratulations!', ipa: 'kənɡrætʃəleɪʃənz', vi: 'năm âm tiết, nhấn **LAY**: kơn-gra-chơ-LÂY-shơnz · có /z/ cuối' },
          { text: "I'm so happy for you!", ipa: 'aɪm soʊ hæpi fər juː', vi: 'giọng lên cao ở **so** và **happy** · for đọc nhẹ /fər/' },
          { text: "I've just heard the news.", ipa: 'aɪv dʒʌst hɝːd ðə nuːz', vi: "I've có /v/ nhẹ, đừng nuốt · news có /z/ cuối" },
          { text: "She's just got engaged.", ipa: 'ʃiːz dʒʌst ɡɑːt ɪnɡeɪdʒd', vi: 'engaged hai âm tiết: in-GEYJD, -ed đọc /d/' },
          { text: 'I really appreciate it.', ipa: 'aɪ rɪəli əpriːʃieɪt ɪt', vi: 'appreciate: ơ-PRI-shi-ây · nối appreciate‿it' },
          { text: "I'm so sorry for your loss.", ipa: 'aɪm soʊ sɑːri fər jər lɔːs', vi: 'giọng thấp, chậm, hạ dần ở **loss**' },
          { text: "You've already apologised.", ipa: 'juːv ɔːlredi əpɑːlədʒaɪzd', vi: "You've có /v/ · apologised nhấn **PO**: ơ-PO-lơ-jai-zd" },
          { text: 'It was such a long trip.', ipa: 'ɪt wəz sʌtʃ ə lɔːŋ trɪp', vi: 'nối such‿a nghe như "sát-chơ" · nhấn **such** và **long**' },
        ],
      },

      { t: 'h', text: '7. Xin lỗi cho đàng hoàng: 4 bước, một lần' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Lời xin lỗi có trọng lượng',
        caption: 'Bỏ bước 2 thì người kia không biết bạn xin lỗi chuyện gì. Bỏ bước 3 thì nghe như đổ lỗi. Bước 4 làm lời xin lỗi thành việc làm. Xong là **dừng**.',
        steps: [
          { label: '1. Xin lỗi', sub: "I'm so sorry, Lachlan." },
          { label: '2. Lỗi gì, cụ thể', sub: 'I took your lunch without looking.' },
          { label: '3. Nhận trách nhiệm', sub: 'It was my mistake.' },
          { label: '4. Sửa / chuộc', sub: 'Please have mine. Let me buy you a coffee.' },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "I'm so sorry I missed your call last night. My phone was on silent. Can I call you back now?", vi: 'Xin lỗi tối qua mình lỡ cuộc gọi của bạn. Điện thoại để im lặng. Giờ mình gọi lại được không?' },
          { en: "Sorry I'm late. That's my fault, I left too late. I'll stay later to finish the poster.", vi: 'Xin lỗi mình đến muộn. Lỗi tại mình, mình đi muộn quá. Mình sẽ ở lại muộn hơn để làm xong tấm poster.' },
          { en: "I'm really sorry I forgot your birthday. No excuses. Let me take you out for dinner this weekend.", vi: 'Mình thật sự xin lỗi vì quên sinh nhật bạn. Không có lý do gì cả. Cuối tuần này để mình mời bạn đi ăn tối nhé.' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: chúc mừng, xin lỗi, cảm ơn trong một cuộc gặp' },
      {
        t: 'dialogue',
        title: 'Ở quán cà phê — Nhi gặp Gabi, bạn cùng lớp salsa, vừa nhận tin được vào học thạc sĩ',
        lines: [
          { who: 'Gabi', role: 'b', text: "Nhi! Guess what? I've just got into the master's program in Boston!", vi: 'Nhi! Đoán xem? Mình vừa được nhận vào chương trình thạc sĩ ở Boston!' },
          { who: 'Nhi', role: 'a', text: "No way! Congratulations! I'm so happy for you!", vi: 'Không thể tin được! Chúc mừng cậu! Mình mừng cho cậu quá!' },
          { who: 'Gabi', role: 'b', text: "Thanks! I can't believe it. I've wanted this for three years.", vi: 'Cảm ơn! Mình vẫn chưa tin nổi. Mình mong điều này ba năm rồi.' },
          { who: 'Nhi', role: 'a', text: 'You worked so hard. You really deserve it. How did you find out?', vi: 'Cậu đã cố gắng nhiều lắm. Cậu thật sự xứng đáng. Cậu biết tin thế nào?' },
          { who: 'Gabi', role: 'b', text: 'By email, at six this morning. I screamed so loudly that my roommate woke up.', vi: 'Qua email, lúc sáu giờ sáng nay. Mình hét to tới mức bạn cùng phòng tỉnh giấc.' },
          { who: 'Nhi', role: 'a', text: "Ha! Oh, and I'm so sorry I didn't reply to your message last week. It was my mistake. I read it and forgot.", vi: 'Ha! À, mình xin lỗi tuần trước không trả lời tin nhắn của cậu. Lỗi tại mình. Mình đọc rồi quên mất.' },
          { who: 'Gabi', role: 'b', text: "Don't worry about it. You were busy with your move.", vi: 'Đừng bận tâm. Cậu bận chuyển nhà mà.' },
          { who: 'Nhi', role: 'a', text: 'Still, let me buy the coffee today. And thanks so much for helping me move. I really appreciate it.', vi: 'Dù vậy, hôm nay để mình trả tiền cà phê. Và cảm ơn cậu nhiều vì đã giúp mình chuyển nhà. Mình thật sự cảm kích.' },
          { who: 'Gabi', role: 'b', text: 'Anytime! That sofa was so heavy, though.', vi: 'Lúc nào cũng được! Mà cái sofa đó nặng thật.' },
          { who: 'Nhi', role: 'a', text: "I know! I owe you one. Let's celebrate properly before you leave.", vi: 'Mình biết! Mình nợ cậu một lần. Mình ăn mừng cho đàng hoàng trước khi cậu đi nhé.' },
          { who: 'Gabi', role: 'b', text: "Deal. Salsa and tacos, my treat this time.", vi: 'Chốt. Nhảy salsa rồi ăn taco, lần này mình mời.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd12-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Nhi (5 câu)',
        items: [
          { vi: 'Chúc mừng cậu! Mình mừng cho cậu quá!', chips: ['Congratulations!', "I'm", 'so', 'happy', 'for', 'you!', 'Congratulation!', 'with'], answer: ['Congratulations!', "I'm", 'so', 'happy', 'for', 'you!'] },
          { vi: 'Cậu thật sự xứng đáng.', chips: ['You', 'really', 'deserve', 'it.', 'deserved', 'are'], answer: ['You', 'really', 'deserve', 'it.'] },
          { vi: 'Mình xin lỗi vì đã không trả lời tin nhắn của cậu.', chips: ["I'm", 'sorry', 'I', "didn't", 'reply', 'to', 'your', 'message.', 'for', 'replied'], answer: ["I'm", 'sorry', 'I', "didn't", 'reply', 'to', 'your', 'message.'] },
          { vi: 'Cảm ơn cậu nhiều vì đã giúp mình chuyển nhà.', chips: ['Thanks', 'so', 'much', 'for', 'helping', 'me', 'move.', 'help', 'to'], answer: ['Thanks', 'so', 'much', 'for', 'helping', 'me', 'move.'] },
          { vi: 'Mình nợ cậu một lần.', chips: ['I', 'owe', 'you', 'one.', 'once', 'have'], answer: ['I', 'owe', 'you', 'one.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd12-noi-tra-loi',
        part: '1',
        questions: [
          'How do you usually react when someone compliments you?',
          'Tell me about a time you had to apologise to someone.',
          "What's the best news you've heard recently?",
          'Who would you like to thank this week, and why?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Gabi, a friendly American woman who takes a salsa class with me in Austin, Texas. We meet at a café. Start by telling me some good news: you have just got into a master\'s program. Let me congratulate you. Then wait: I need to apologise for not replying to your message last week, and thank you for helping me move apartment. React naturally. Sometimes compliment me (on my English, my bag, my dancing) so I can practise accepting a compliment. If I reject a compliment in a Vietnamese way (\'No, it\'s not good\'), or ask a too-personal question, react like a real American would, then explain kindly. Use B1-level English. After about 10 turns, tell me in Vietnamese two things I did well and two things to improve."',
          'Làm **2 lượt**. Lượt hai: AI là đồng nghiệp vừa mất người thân và quay lại làm việc. Bạn chia buồn đúng mực, không hỏi chi tiết, và đề nghị giúp một việc cụ thể.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd12-viet',
    kind: 'writing',
    title: 'Thiệp chúc mừng, lời xin lỗi, lời cảm ơn',
    goal: 'Viết được bốn loại lời nhắn cảm xúc (chúc mừng, cảm ơn, xin lỗi, chia buồn), mỗi loại ở cả mức thân mật và trang trọng, ngắn mà cụ thể.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao phải viết, không chỉ nói',
        items: [
          'Ở Anh – Mỹ – Úc, **thiệp** vẫn rất phổ biến: cả nhóm ký chung một thiệp sinh nhật, thiệp chia tay, thiệp chia buồn. Bạn sẽ được đưa một tấm thiệp và chiếc bút, và phải viết **2–3 dòng**.',
          'Lời cảm ơn **sau** một việc (được mời ăn, được giúp chuyển nhà) bằng tin nhắn hay email là phép lịch sự được chờ đợi.',
          'Bí quyết của mọi lời nhắn cảm xúc: **cụ thể**. "Thanks for everything" nhạt; "Thanks for watering my plants" ấm.',
          'Mỗi mẫu có hai bản đặt cạnh nhau: **thân mật** và **trang trọng**. Dùng lại các câu của bài Nói.',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Chúc mừng',
        caption: 'Thân: gọi tên, chúc mừng, một chi tiết riêng. Trang trọng: chúc mừng + đúng tên sự việc + lời chúc cho chặng tiếp theo.',
        cols: [
          {
            title: 'Thân mật (thiệp cho Dana và Theo)',
            anh: 'party-popper',
            items: [
              'Dana & Theo,',
              "Congratulations!! I'm so happy for you both.",
              "Can't wait to hear the full popcorn story at the wedding. 🍿",
              'Love,',
              'Nhi',
            ],
          },
          {
            title: 'Trang trọng (email cho chị quản lý bên khách hàng)',
            anh: 'e-mail',
            items: [
              'Dear Ms Alvarez,',
              'Congratulations on your promotion to Head of Operations.',
              'It is very well deserved, and I wish you every success in your new role.',
              'Best regards,',
              'Nguyen Thao Nhi',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Cảm ơn',
        caption: 'Cảm ơn việc gì + nó giúp bạn thế nào. Bản trang trọng thêm một chi tiết bạn nhớ nhất.',
        cols: [
          {
            title: 'Thân mật (nhắn Lachlan)',
            anh: 'mobile-phone',
            items: [
              'Hi Lachlan!',
              'Thanks so much for the ride to the airport this morning.',
              'You saved me $60 and a lot of stress 😅',
              'I owe you one!',
            ],
          },
          {
            title: 'Trang trọng (email cảm ơn gia đình đã mời ăn Lễ Tạ ơn)',
            anh: 'love-letter',
            items: [
              'Dear Mr and Mrs Hensley,',
              'Thank you so much for having me for Thanksgiving dinner on Thursday.',
              'It was my first Thanksgiving, and it was such a warm evening that I felt like part of the family.',
              'The pecan pie was wonderful. I hope I can return the favour with a Vietnamese meal soon.',
              'With warm wishes,',
              'Nhi',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Xin lỗi',
        caption: 'Bốn bước của bài Nói, viết gọn: xin lỗi → lỗi gì → nhận lỗi → sửa. Không viết lý do dài dòng.',
        cols: [
          {
            title: 'Thân mật (nhắn Gabi)',
            anh: 'grimacing-face',
            items: [
              'So sorry I missed your call last night!',
              'My phone was on silent. Totally my fault.',
              'Call you after class? Coffee is on me this week.',
            ],
          },
          {
            title: 'Trang trọng (email cho người quản lý toà nhà)',
            anh: 'memo',
            items: [
              'Dear Ms Reyes,',
              'I am very sorry that I missed our appointment on Tuesday.',
              'It was entirely my mistake: I wrote down the wrong date.',
              'Would it be possible to meet later this week? I am free on Thursday and Friday afternoon.',
              'Kind regards,',
              'Nguyen Thao Nhi (apartment 3B)',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Chia buồn',
        caption: 'Ngắn. Không giải thích, không khuyên, không hỏi chi tiết. Bản thân mật có thể thêm một lời đề nghị giúp **cụ thể**.',
        cols: [
          {
            title: 'Thân mật (nhắn một người bạn)',
            anh: 'white-flower',
            items: [
              "Hi Mia, I've just heard about your dad.",
              "I'm so, so sorry.",
              "No need to reply. I'm here if you need anything, even just a walk or some food. ❤️",
            ],
          },
          {
            title: 'Trang trọng (thiệp cả nhóm gửi Hamish)',
            anh: 'love-letter',
            items: [
              'Dear Hamish,',
              'We were so sorry to hear about the loss of your grandfather.',
              'Our thoughts are with you and your family at this difficult time.',
              'With deepest sympathy,',
              'The Austin team',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Viết gì lên thiệp ký chung của cả nhóm',
        items: [
          'Thiệp chung (sinh nhật, chia tay, chúc mừng có em bé) đi vòng quanh văn phòng. Mỗi người viết **1–2 dòng** rồi ký tên. Không cần "Dear…".',
          'Sinh nhật: **Happy birthday, Dana! Hope you have a great day. — Nhi**',
          'Chia tay: **It was so great working with you. Good luck in Boston! — Nhi**',
          'Em bé: **Congratulations on your little one! Wishing you all the best. — Nhi**',
          'Đọc dòng của người khác trước để biết thiệp vui đùa hay nghiêm túc, rồi viết đúng giọng đó.',
        ],
      },

      { t: 'h', text: '2. Khung câu để viết lời nhắn cảm xúc' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Congratulations on + N / V-ing (+ !)',
            vi: 'Chúc mừng việc gì. Thân: Congrats on…',
            examples: [
              { en: 'Congratulations on your new job!', vi: 'Chúc mừng bạn có việc mới!' },
              { en: 'Congratulations on passing your exam!', vi: 'Chúc mừng bạn thi đỗ!' },
              { en: 'Congrats on the engagement!', vi: 'Chúc mừng đính hôn nhé!' },
            ],
          },
          {
            formula: 'Thank you (so much) for + N / V-ing · It + V2 + …',
            vi: 'Cảm ơn việc gì, rồi nó giúp bạn thế nào.',
            examples: [
              { en: 'Thank you so much for the lovely card. It really made my week.', vi: 'Cảm ơn rất nhiều vì tấm thiệp dễ thương. Nó làm tôi vui cả tuần.' },
              { en: 'Thanks for helping me move. I could never do it alone.', vi: 'Cảm ơn đã giúp mình chuyển nhà. Một mình mình không làm nổi.' },
              { en: 'Thank you for having me.', vi: 'Cảm ơn vì đã mời tôi đến.' },
            ],
          },
          {
            formula: "I'm (very / so) sorry that + S + V · I apologise for + N / V-ing",
            vi: 'Xin lỗi về việc gì. apologise trang trọng hơn sorry.',
            examples: [
              { en: "I'm so sorry that I missed your call.", vi: 'Mình rất xin lỗi vì đã lỡ cuộc gọi của bạn.' },
              { en: 'I apologise for the late reply.', vi: 'Tôi xin lỗi vì trả lời muộn.' },
              { en: 'I apologise for any inconvenience.', vi: 'Tôi xin lỗi vì mọi bất tiện.' },
            ],
          },
          {
            formula: 'I was / We were so sorry to hear about + N',
            vi: 'Mở đầu lời chia buồn.',
            examples: [
              { en: 'I was so sorry to hear about your grandfather.', vi: 'Tôi rất tiếc khi nghe tin về ông anh.' },
              { en: 'We were so sorry to hear about the loss of your mother.', vi: 'Chúng tôi rất tiếc khi nghe tin mẹ anh mất.' },
              { en: 'I was sorry to hear you were in hospital.', vi: 'Mình rất tiếc khi nghe bạn phải nằm viện.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Câu cảm xúc + chuyện CỤ THỂ + (một câu về bạn / về họ) + ký tên',
        vi: 'Lời nhắn cảm xúc hay nhất thường chỉ 2–4 câu. Cụ thể quan trọng hơn dài.',
      },
      {
        t: 'table',
        head: ['Tránh viết', 'Viết', 'Vì sao'],
        rows: [
          ['Wish you happy birthday!', 'Happy birthday! · Wishing you a happy birthday!', '"Wish you…" là dịch thẳng "chúc bạn…". Cần **Wishing you** hoặc chỉ Happy birthday.'],
          ['Congratulation for your new job.', 'Congratulations on your new job!', 'Có -s, đi với on.'],
          ['Happy new year. Wish your family healthy.', 'Wishing you and your family a happy and healthy New Year.', 'healthy là tính từ, cần có danh từ đi kèm.'],
          ['Thank you for your help me.', 'Thank you for your help. · Thank you for helping me.', 'your help hoặc helping me, không ghép cả hai.'],
          ['Sorry for my mistake. 😂', "Sorry, that was my mistake.", 'Emoji cười làm lời xin lỗi thành đùa.'],
          ['RIP 🙏 (bình luận dưới bài báo tang của đồng nghiệp)', "I'm so sorry for your loss.", 'Viết cho **người còn sống**, gọi tên họ, viết đủ câu.'],
        ],
        caption: 'Sáu lỗi hay gặp nhất khi người Việt viết thiệp và lời nhắn cảm xúc bằng tiếng Anh.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd12-viet-ghep',
        title: 'Sắp xếp thành câu trong lời nhắn (4 câu)',
        items: [
          { vi: 'Chúc mừng bạn có việc mới!', chips: ['Congratulations', 'on', 'your', 'new', 'job!', 'for', 'Congratulation'], answer: ['Congratulations', 'on', 'your', 'new', 'job!'] },
          { vi: 'Cảm ơn vì đã mời tôi đến.', chips: ['Thank', 'you', 'for', 'having', 'me.', 'have', 'to'], answer: ['Thank', 'you', 'for', 'having', 'me.'] },
          { vi: 'Tôi xin lỗi vì trả lời muộn.', chips: ['I', 'apologise', 'for', 'the', 'late', 'reply.', 'lately', 'about'], answer: ['I', 'apologise', 'for', 'the', 'late', 'reply.'] },
          { vi: 'Chúng tôi rất tiếc khi nghe tin về ông anh.', chips: ['We', 'were', 'so', 'sorry', 'to', 'hear', 'about', 'your', 'grandfather.', 'such', 'for'], answer: ['We', 'were', 'so', 'sorry', 'to', 'hear', 'about', 'your', 'grandfather.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd12-viet-dien',
        title: 'Điền một từ vào lời nhắn (6 câu)',
        kind: 'fill',
        grammar: 'on · for · about · Wishing · such · so',
        items: [
          { q: 'Congratulations ___ your engagement!', answers: ['on'] },
          { q: 'Thank you so much ___ the lovely card.', answers: ['for'] },
          { q: 'I was so sorry to hear ___ your grandfather.', answers: ['about'] },
          { q: '___ you a happy and healthy New Year! (bắt đầu lời chúc)', answers: ['Wishing', 'wishing'] },
          { q: 'It was ___ a warm evening that I felt like part of the family.', answers: ['such'] },
          { q: 'The pie was ___ good that I had two pieces.', answers: ['so'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd12-viet-dich',
        title: 'Tự viết 5 lời nhắn (dịch Việt → Anh)',
        kind: 'translate',
        grammar: 'Congratulations on… · Thanks so much for… · I\'m so sorry that… · I was so sorry to hear about…',
        items: [
          { q: '(Thiệp chung) Chúc mừng sinh nhật, Lachlan! Chúc anh một ngày thật vui.', hint: 'happy birthday, hope you have a great day', answers: ['Happy birthday, Lachlan! Hope you have a great day.', 'Happy birthday, Lachlan! I hope you have a great day.', 'Happy birthday, Lachlan! Have a great day!', 'Happy birthday, Lachlan! Hope you have a great day!', 'Happy birthday Lachlan! Hope you have a great day.', 'Happy birthday, Lachlan! Hope you have a wonderful day.'] },
          { q: '(Nhắn bạn) Cảm ơn cậu nhiều vì đã cho mình mượn ô. Cậu cứu mình đấy!', hint: 'thanks so much for lending me…, lifesaver', answers: ["Thanks so much for lending me your umbrella. You're a lifesaver!", "Thanks so much for lending me the umbrella. You're a lifesaver!", "Thank you so much for lending me your umbrella. You're a lifesaver!", "Thanks so much for lending me your umbrella. You saved me!", "Thanks so much for lending me an umbrella. You're a lifesaver!"] },
          { q: '(Nhắn bạn) Xin lỗi cậu, mình quên mất buổi hẹn hôm qua. Lỗi tại mình.', hint: "sorry, forgot, my fault / my mistake", answers: ["Sorry, I forgot about our plans yesterday. It was my fault.", "Sorry, I forgot about our meeting yesterday. It was my fault.", "I'm sorry, I forgot our plans yesterday. It was my mistake.", "I'm so sorry I forgot about yesterday. It was my fault.", "Sorry, I forgot about our plans yesterday. My fault.", "Sorry I forgot our plans yesterday. It was my mistake.", "Sorry, I forgot about yesterday. It was my fault.", "I'm sorry I forgot about our plans yesterday. It was my fault."] },
          { q: '(Email trang trọng) Chúc mừng chị được thăng chức.', hint: 'congratulations on, promotion', answers: ['Congratulations on your promotion.', 'Congratulations on your promotion!'] },
          { q: '(Thiệp chia buồn) Chúng tôi rất tiếc khi nghe tin mẹ anh mất.', hint: 'we were so sorry to hear about the loss of…', answers: ['We were so sorry to hear about the loss of your mother.', 'We were so sorry to hear about your mother.', 'We were very sorry to hear about the loss of your mother.', 'We were so sorry to hear about the loss of your mum.', 'We were so sorry to hear about the loss of your mom.', 'We were so sorry to hear that your mother passed away.'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi gửi lời nhắn cảm xúc',
        items: [
          '**Có chuyện cụ thể chưa?** Thêm một chi tiết (the popcorn story, the pecan pie, watering my plants) là lời nhắn khác hẳn.',
          '**Giới từ đúng chưa?** Congratulations **on**, thanks **for**, sorry **about**, sorry to hear **about**.',
          '**Emoji có hợp không?** 🎉 cho tin vui, ❤️ cho bạn thân. Không emoji cười trong lời xin lỗi thật và lời chia buồn.',
          '**Tên người nhận viết đúng chưa?** Lachlan, Hamish, Dana. Viết sai tên trong thiệp chúc mừng là điều người ta nhớ lâu.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd12-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 12',
    goal: 'Làm 35 câu có đáp án để chắc năm loại câu cảm xúc, câu đáp đúng mức, hiện tại hoàn thành cơ bản và so / such … that; có câu ôn Ngày 10–11.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 10–11**: từ chối lời mời, kể chuyện bằng quá khứ đơn. Chú ý câu nào cần **quá khứ đơn**, câu nào cần **have + V3**.',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**, có ngữ điệu.',
          'Đúng từ **28/35** trở lên thì làm **bài kiểm tra chặng 2** ngay sau bài này.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd12-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp khen: "Your English is really good!" Bạn đáp:',
            options: ["No, no, my English is very bad.", "Thanks! I've been practising a lot.", 'Yes, I know.', 'Your English is good too.'],
            correct: 1,
            why: 'Nhận lời khen + một chi tiết: **Thanks! I\'ve been practising a lot.** Chối như câu A làm người khen khó xử.',
          },
          {
            q: 'Bạn nghe tin chị trưởng phòng vừa sinh em bé. Câu phù hợp:',
            options: ['Well done!', 'Congratulations! How are you both doing?', 'Was it expensive?', 'My bad!'],
            correct: 1,
            why: '**Congratulations** cho tin vui đời sống. **Well done** là khen thành tích, không dùng cho em bé.',
          },
          {
            q: 'Một đồng nghiệp người Úc nói "Cheers, mate!" sau khi bạn giữ cửa cho anh. Bạn đáp:',
            options: ['Cheers! (nâng ly)', 'No worries!', "Sorry!", 'Why?'],
            correct: 1,
            why: '**Cheers** ở Úc, Anh còn là "cảm ơn". Đáp kiểu Úc: **No worries!**',
          },
          {
            q: 'Bạn làm đổ cà phê lên bàn phím của đồng nghiệp. Câu nào tốt nhất?',
            options: ['My bad!', "Oh no, I'm so sorry! That was my fault. Let me clean it up and check if it still works.", 'Sorry sorry sorry sorry.', "It's not a big problem."],
            correct: 1,
            why: 'Lỗi thật thì đủ bốn bước: **xin lỗi → lỗi gì → nhận lỗi → sửa**. "My bad" quá nhẹ, còn câu D là việc của người bị đổ, không phải của bạn.',
          },
          {
            q: 'Đồng nghiệp vừa đi làm lại sau khi mẹ mất. Bạn nói:',
            options: ['What happened to her?', "I was so sorry to hear about your mum. How are you doing?", 'Everyone dies one day.', 'At least she was old.'],
            correct: 1,
            why: 'Chia buồn ngắn + hỏi thăm **người còn sống**. Không hỏi nguyên nhân, không "at least…" (dù có ý an ủi, nghe như xem nhẹ).',
          },
          {
            q: 'Câu nào đúng?',
            options: ['I have met her yesterday.', 'I met her yesterday.', 'I have meet her yesterday.', 'I meeted her yesterday.'],
            correct: 1,
            why: 'Có **yesterday** (mốc đã qua) → quá khứ đơn: **I met her yesterday.**',
          },
          {
            q: 'Câu nào đúng?',
            options: ["It was so a nice party.", "It was such nice party.", "It was such a nice party.", "It was so nice a party that."],
            correct: 2,
            why: '**such + a + adj + N**. Hoặc nói "The party was **so nice**."',
          },
          {
            q: 'Bạn của bạn vừa được nhận học bổng. Câu nào KHÔNG nên nói?',
            options: ["You deserve it!", "I'm so happy for you!", 'How much money is it?', 'Congratulations! When do you start?'],
            correct: 2,
            why: 'Hỏi **số tiền** là chuyện riêng. Hỏi về khi nào bắt đầu, học ở đâu thì an toàn.',
          },
          {
            q: '(Ôn Ngày 10) Bạn được rủ đi xem phim tối thứ Sáu nhưng đã có hẹn. Bạn nói:',
            options: ["No, I don't want.", "I'd love to, but I'm having dinner with my aunt on Friday. Maybe next time?", 'I will busy.', 'Sorry, I can.'],
            correct: 1,
            why: "**I'd love to, but** + kế hoạch đã chốt (**I'm having…**) + phương án khác (Ngày 10).",
          },
          {
            q: '(Ôn Ngày 11) Bạn kể lại: "Hôm qua mình quên ví ở quán, may mà chủ quán giữ hộ." Câu đúng:',
            options: ["Yesterday I've left my wallet at the café. Luckily, the owner has kept it.", 'Yesterday I left my wallet at the café. Luckily, the owner kept it for me.', 'Yesterday I leave my wallet. Luckily the owner keep it.', 'Yesterday I was left my wallet.'],
            correct: 1,
            why: 'Kể chuyện có **yesterday** → quá khứ đơn: left, kept (Ngày 11). Không dùng have + V3 khi có mốc thời gian.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd12-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: "just · already · yet · on · for · about · so · such",
        items: [
          { q: "I've ___ heard the news. Congratulations! (vừa mới)", answers: ['just'] },
          { q: "Don't worry, we've ___ sent the card. (rồi, sớm hơn bạn nghĩ)", answers: ['already'] },
          { q: "Have you thanked Hamish ___? (chưa — ở cuối câu hỏi)", answers: ['yet'] },
          { q: 'Congratulations ___ your new apartment!', answers: ['on'] },
          { q: 'Thanks ___ looking after my cat.', answers: ['for'] },
          { q: "I'm so sorry ___ your lunch.", answers: ['about'] },
          { q: 'The cake was ___ sweet that I could only eat half.', answers: ['so'] },
          { q: 'She is ___ a kind person that everyone loves her.', answers: ['such'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd12-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'câu cảm xúc · have / has + V3 · so / such … that',
        items: [
          { q: 'Cảm ơn! Bạn thích là mình vui rồi.', hint: "glad, like it", answers: ["Thanks! I'm glad you like it.", "Thank you! I'm glad you like it.", 'Thanks! I am glad you like it.', "Thanks, I'm glad you like it."] },
          { q: 'Mình thật sự cảm kích.', hint: 'appreciate', answers: ['I really appreciate it.', 'I really appreciate it!', 'I really appreciate that.'] },
          { q: 'Xin lỗi mình đến muộn.', hint: "sorry, late", answers: ["Sorry I'm late.", "I'm sorry I'm late.", 'Sorry for being late.', "Sorry, I'm late.", "I'm sorry for being late."] },
          { q: 'Đừng bận tâm. Không sao cả.', hint: "don't worry, no harm done", answers: ["Don't worry about it. No harm done.", "Don't worry. No harm done.", "Don't worry about it. It's fine.", "Don't worry about it. It's all good.", "Don't worry. It's fine."] },
          { q: 'Bạn nghe tin về Dana chưa?', hint: 'have you, hear', answers: ['Have you heard about Dana?', 'Have you heard the news about Dana?', 'Did you hear about Dana?'] },
          { q: 'Chị ấy vừa đính hôn.', hint: 'just, get engaged', answers: ["She's just got engaged.", 'She has just got engaged.', 'She just got engaged.', "She's just gotten engaged.", 'She has just gotten engaged.'] },
          { q: 'Bộ phim dở tới mức bọn mình về giữa chừng.', hint: 'so bad that, leave halfway', answers: ['The movie was so bad that we left halfway.', 'The film was so bad that we left halfway.', 'The movie was so bad that we left halfway through.', 'The film was so bad that we left halfway through.', 'The movie was so bad we left halfway.', 'The film was so bad we left halfway through.', 'The movie was so bad that we left in the middle.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd12-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I've just heard the news!", answer: "I've just heard the news!", alt: ['I have just heard the news!'] },
          { label: 'Câu 2', spell: 'Thanks so much for the lovely card.', answer: 'Thanks so much for the lovely card.' },
          { label: 'Câu 3', spell: "Don't worry about it.", answer: "Don't worry about it.", alt: ['Do not worry about it.'] },
          { label: 'Câu 4', spell: "If there's anything I can do, let me know.", answer: "If there's anything I can do, let me know.", alt: ['If there is anything I can do, let me know.', "If there's anything I can do let me know."] },
          { label: 'Câu 5', spell: 'You really deserve it.', answer: 'You really deserve it.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd12-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Mình chưa gặp hôn phu của chị ấy.', chips: ['I', "haven't", 'met', 'her', 'fiancé', 'yet.', 'meet', 'already'], answer: ['I', "haven't", 'met', 'her', 'fiancé', 'yet.'] },
          { vi: 'Bạn xin lỗi ba lần rồi đấy!', chips: ["You've", 'already', 'apologised', 'three', 'times!', 'yet', 'apologise'], answer: ["You've", 'already', 'apologised', 'three', 'times!'] },
          { vi: 'Để mình chuộc lỗi nhé.', chips: ['Let', 'me', 'make', 'it', 'up', 'to', 'you.', 'for', 'do'], answer: ['Let', 'me', 'make', 'it', 'up', 'to', 'you.'] },
          { vi: 'Đó là một chuyến đi dài tới mức tôi vẫn mệt.', chips: ['It', 'was', 'such', 'a', 'long', 'trip', 'that', "I'm", 'still', 'tired.', 'so'], answer: ['It', 'was', 'such', 'a', 'long', 'trip', 'that', "I'm", 'still', 'tired.'] },
          { vi: 'Xin chia buồn với bạn.', chips: ["I'm", 'so', 'sorry', 'for', 'your', 'loss.', 'about', 'lost'], answer: ["I'm", 'so', 'sorry', 'for', 'your', 'loss.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Viết **một lời cảm ơn thật** bằng tiếng Anh cho một người đã giúp bạn tuần này (bạn cùng lớp, đồng nghiệp, gia sư). Cụ thể một chi tiết. Gửi đi nếu được.',
          'Lần tới có người khen bạn, bằng tiếng Việt hay tiếng Anh, thử đáp: "Cảm ơn, bạn thích là mình vui rồi" thay vì chối. Tập từ tiếng Việt trước, sang tiếng Anh sẽ tự nhiên.',
          'Tiếp theo: **Kiểm tra chặng 2** (Ngày 7–12). Đạt rồi mới sang Ngày 13: chặng 3 "Công sở".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG 2 ═══════════════════════════ */
  {
    id: 'gtd12-kiem-tra',
    kind: 'review',
    title: 'Kiểm tra chặng 2 (Ngày 7–12)',
    goal: 'Tự đo mức nắm chắc chặng 2 "Đời sống" (Ngày 7–12): nghe một cuộc gọi mới, chọn câu hợp cảnh, dùng đúng ngữ pháp từng ngày và tự viết tin nhắn đời thường. Đạt ≥ 70 % từng phần mới sang chặng 3.',
    minutes: 45,
    blocks: [
      {
        t: 'recap',
        title: 'Bài kiểm tra này đo gì',
        items: [
          '**4 phần, 46 câu, khoảng 45 phút**: Nghe · Mẫu câu hợp cảnh · Ngữ pháp · Viết tin nhắn. Toàn bộ là kiến thức **Ngày 7–12**.',
          '**Đạt** = từ **70 %** trở lên ở **từng phần**. Trượt phần nào thì ôn đúng Ngày ghi ở bảng dưới, không cần học lại cả chặng.',
          'Mọi câu đều **mới**: cảnh mới, người mới, câu mới. Nhớ đáp án cũ không giúp được, phải hiểu mẫu câu.',
          'Mỗi câu có ghi **(Ngày N)** để bạn biết câu sai thuộc ngày nào.',
          'Chặng 3 (Ngày 13–18) là **công sở**: câu dài hơn, tốc độ nhanh hơn, gần như không còn chú thích tiếng Việt trong bài nghe. Đạt bài này là đủ nền để theo.',
        ],
      },
      {
        t: 'sodo',
        kind: 'mindmap',
        title: 'Chặng 2 (Ngày 7–12) — những gì sẽ bị kiểm',
        center: 'Ngày 7–12',
        branches: [
          { label: 'N7 Sức khoẻ', items: ["I've got a… · I feel…", 'should / shouldn\'t', 'for + khoảng · since + mốc'], anh: 'pill' },
          { label: 'N8 Nhà ở', items: ['there is / there are', 'The tap is leaking.', 'still · right now'], anh: 'house' },
          { label: 'N9 Gọi điện', items: ["I'll call you back.", 'Can I…? · Could you…?', 'in that case · as soon as'], anh: 'telephone-receiver' },
          { label: 'N10 Mời, từ chối', items: ["I'm + V-ing (đã chốt)", 'be going to', "I'd love to, but…"], anh: 'spiral-calendar' },
          { label: 'N11 Kể chuyện', items: ["quá khứ đơn · didn't · Did…?", 'first, then, after that, in the end'], anh: 'speech-balloon' },
          { label: 'N12 Cảm xúc', items: ["I've just… · already · yet", 'so / such … that', 'thanks for · congratulations on'], anh: 'wrapped-gift' },
        ],
        caption: 'Mỗi nhánh là kiến thức của một ngày. Câu sai nằm ở nhánh nào thì ôn đúng ngày đó.',
      },
      {
        t: 'note',
        title: 'Cách làm bài',
        items: [
          '**Gập sách**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.',
          'Thời gian gợi ý: Nghe 12′ · Mẫu câu 10′ · Ngữ pháp 8′ · Viết tin nhắn 15′.',
          'Phần **Nghe**: đọc câu hỏi trước, nghe **tối đa 2 lần**, chưa mở lời thoại cho tới khi trả lời xong.',
          'Phần **Viết**: cố **không bấm 💡 Gợi ý**. Bấm thì tự trừ câu đó khi tính điểm.',
          'Làm xong phần nào thì **ghi điểm ra giấy** rồi mới sang phần sau. Cuối bài đối chiếu bảng dưới.',
        ],
      },
      {
        t: 'table',
        caption: 'Cách tính điểm — ĐẠT = từ 70 % trở lên ở TỪNG phần',
        head: ['Phần', 'Số câu', 'Đạt khi', 'Chưa đạt thì ôn lại'],
        rows: [
          ['1. Nghe', '8 + 4', '≥ 9/12 (cộng hai khối)', 'Ngày 9 · Nghe (cuộc gọi) + mẹo "không nghe kịp qua điện thoại" — Ngày 8 · Nghe (báo hỏng) — Ngày 11 · Nghe (trình tự chuyện)'],
          ['2. Mẫu câu hợp cảnh', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục "câu dùng được ngay" và bảng ba mức lịch sự'],
          ['3. Ngữ pháp', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục 🧱 Câu này ghép thế nào'],
          ['4. Viết tin nhắn', '6 + 4', '≥ 7/10 (cộng hai khối)', 'Ngày 7 · Đọc (đơn thuốc) — Ngày 8 · Viết (báo hỏng) — Ngày 10 · Viết (từ chối, đổi lịch) — Ngày 12 · Viết (cảm ơn, xin lỗi, chúc mừng)'],
        ],
      },

      /** ───────────── 1. Nghe ───────────── **/
      { t: 'h', text: 'Phần 1 — Nghe (12 câu · đạt ≥ 9 · trượt thì ôn Ngày 8, 9, 11)' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'woman-technologist', 'man-office-worker', 'house', 'cooked-rice', 'fire-extinguisher'],
        caption: 'Tháng cuối của Nhi ở Austin. Nhi gọi điện cho **Frank**, chủ căn hộ đang thuê, vì điều hoà lại hỏng. Cuộc gọi đi qua đủ chuyện: sức khoẻ, sửa nhà, một lời mời, một chuyện tuần trước và một tin vui.',
      },
      {
        t: 'listen',
        id: 'gtd12-kt-nghe',
        title: 'Test — A call to the landlord',
        note: 'Nghe tối đa 2 lần. Ghi ra giấy: Nhi bị gì và bao lâu, điều hoà làm sao, khi nào thợ tới, Nhi từ chối lời mời vì sao, chuyện thứ Năm theo thứ tự.',
        lines: [
          { who: 'Frank', voice: 'us-nam', text: 'Hello, Frank speaking.', vi: 'Alô, Frank nghe.' },
          { who: 'Nhi', voice: 'ca-nu', text: "Hi, Frank, it's Nhi from apartment 3B. Is this a good time?", vi: 'Chào chú Frank, cháu là Nhi ở căn 3B. Chú nghe máy tiện không ạ?' },
          { who: 'Frank', voice: 'us-nam', text: 'Sure, go ahead. How\'s that cold of yours? Are you feeling better?', vi: 'Được chứ, cháu nói đi. Cảm của cháu thế nào rồi? Đỡ chưa?' },
          { who: 'Nhi', voice: 'ca-nu', text: "Much better, thanks. I've had a cough for about a week, but the doctor said I should just rest and drink lots of water.", vi: 'Đỡ nhiều rồi ạ, cảm ơn chú. Cháu ho khoảng một tuần nay, nhưng bác sĩ bảo chỉ cần nghỉ ngơi và uống nhiều nước.' },
          { who: 'Frank', voice: 'us-nam', text: 'Glad to hear it. So, what can I do for you?', vi: 'Nghe vậy chú mừng. Thế chú giúp gì được cháu?' },
          { who: 'Nhi', voice: 'ca-nu', text: "I'm calling about the air conditioner. There's water dripping from it again, and it's making a strange noise.", vi: 'Cháu gọi về cái điều hoà ạ. Nó lại nhỏ nước, và đang kêu một tiếng lạ.' },
          { who: 'Frank', voice: 'us-nam', text: "Again? I'm sorry about that. I'll send someone tomorrow morning. Will you be home?", vi: 'Lại thế à? Chú xin lỗi nhé. Sáng mai chú cho người tới. Cháu có nhà không?' },
          { who: 'Nhi', voice: 'ca-nu', text: "Yes, I'm working from home tomorrow, so that's perfect. Thanks so much.", vi: 'Có ạ, mai cháu làm ở nhà nên tiện lắm. Cảm ơn chú nhiều.' },
          { who: 'Frank', voice: 'us-nam', text: "No problem. Oh, and we're having a cookout for the whole building on Saturday. Would you like to come?", vi: 'Không có gì. À, thứ Bảy này cả toà nhà tổ chức tiệc nướng ngoài trời. Cháu có muốn tới không?' },
          { who: 'Nhi', voice: 'ca-nu', text: "I'd love to, but I'm going to San Antonio with some friends this weekend. Could I come to the next one?", vi: 'Cháu rất muốn ạ, nhưng cuối tuần này cháu đi San Antonio với mấy người bạn. Lần sau cháu tới được không ạ?' },
          { who: 'Frank', voice: 'us-nam', text: "Of course. By the way, what happened on Thursday night? Mrs Lopez said she heard an alarm.", vi: 'Tất nhiên rồi. Mà này, tối thứ Năm có chuyện gì thế? Bà Lopez bảo nghe thấy chuông báo động.' },
          { who: 'Nhi', voice: 'ca-nu', text: "Oh, sorry! That was me. First, I burned some rice. Then the smoke alarm went off, and I couldn't turn it off. In the end, Mrs Lopez came over and helped me.", vi: 'Ôi, cháu xin lỗi! Là cháu đấy ạ. Đầu tiên cháu làm cháy nồi cơm. Rồi chuông báo khói kêu, và cháu không tắt được. Cuối cùng bà Lopez sang giúp cháu.' },
          { who: 'Frank', voice: 'us-nam', text: "Ha! Happens to everyone. And I heard you've just finished your big project at work. Congratulations!", vi: 'Ha! Ai cũng từng bị thế. À chú nghe nói cháu vừa xong dự án lớn ở công ty. Chúc mừng cháu!' },
          { who: 'Nhi', voice: 'ca-nu', text: "Thank you! I'm so glad it's done. And thanks for being such a great landlord, Frank.", vi: 'Cháu cảm ơn chú! Xong rồi cháu nhẹ cả người. Và cảm ơn chú vì là một chủ nhà tuyệt vời.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd12-kt-nghe-hieu',
        title: 'Phần 1a — Hiểu ý (8 câu)',
        items: [
          {
            q: 'Câu Nhi mở đầu cuộc gọi cho thấy điều gì?',
            options: ['Nhi quên tên Frank', 'Nhi tự giới thiệu và hỏi Frank có tiện nghe không', 'Nhi để lại lời nhắn', 'Nhi gọi nhầm số'],
            correct: 1,
            why: '"**it\'s Nhi from apartment 3B. Is this a good time?**" — tự giới thiệu kiểu điện thoại + hỏi có tiện không (Ngày 9).',
          },
          {
            q: 'Nhi bị ho bao lâu rồi?',
            options: ['Từ thứ Năm', 'Khoảng một tuần', 'Hai ngày', 'Một tháng'],
            correct: 1,
            why: '"I\'ve had a cough **for about a week**." **for** + khoảng thời gian (Ngày 7).',
          },
          {
            q: 'Bác sĩ khuyên Nhi gì?',
            options: ['Uống kháng sinh', 'Nghỉ ngơi và uống nhiều nước', 'Đi bệnh viện', 'Nghỉ làm một tuần'],
            correct: 1,
            why: '"the doctor said I **should** just rest and drink lots of water." (Ngày 7)',
          },
          {
            q: 'Điều hoà bị làm sao?',
            options: ['Không chạy', 'Nhỏ nước và kêu tiếng lạ', 'Quá lạnh', 'Mất điều khiển'],
            correct: 1,
            why: '"There\'s water **dripping** from it again, and it\'s **making a strange noise**." Hiện tại tiếp diễn cho việc đang xảy ra (Ngày 8).',
          },
          {
            q: 'Khi nào thợ tới, và vì sao giờ đó tiện cho Nhi?',
            options: ['Chiều nay, vì Nhi nghỉ ốm', 'Sáng mai, vì mai Nhi làm việc ở nhà', 'Thứ Bảy, vì Nhi rảnh', 'Chưa hẹn'],
            correct: 1,
            why: '"**I\'ll send** someone tomorrow morning" (quyết định ngay, Ngày 9) — "**I\'m working from home** tomorrow" (kế hoạch đã chốt, Ngày 10).',
          },
          {
            q: 'Vì sao Nhi không đi tiệc nướng?',
            options: ['Vì Nhi đang ốm', 'Vì cuối tuần Nhi đi San Antonio với bạn', 'Vì Nhi phải làm thêm', 'Vì Nhi không thích tiệc'],
            correct: 1,
            why: '"**I\'d love to, but I\'m going to San Antonio**… Could I come to the next one?" Từ chối + lý do + phương án khác (Ngày 10).',
          },
          {
            q: 'Chuyện tối thứ Năm diễn ra theo thứ tự nào?',
            options: [
              'Chuông kêu → cháy cơm → bà Lopez giúp',
              'Cháy cơm → chuông báo khói kêu, không tắt được → bà Lopez sang giúp',
              'Bà Lopez sang chơi → cháy cơm → chuông kêu',
              'Cháy cơm → Nhi gọi Frank → chuông tắt',
            ],
            correct: 1,
            why: '"**First**, I burned some rice. **Then** the smoke alarm went off… **In the end**, Mrs Lopez came over and helped me." (Ngày 11)',
          },
          {
            q: 'Frank chúc mừng Nhi về điều gì?',
            options: ['Khỏi ốm', 'Vừa xong một dự án lớn ở công ty', 'Được gia hạn thực tập', 'Chuyển nhà mới'],
            correct: 1,
            why: '"I heard **you\'ve just finished** your big project at work. **Congratulations!**" — hiện tại hoàn thành báo tin vừa xảy ra (Ngày 12).',
          },
        ],
      },
      {
        t: 'dictation',
        id: 'gtd12-kt-chinh-ta',
        title: 'Phần 1b — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1 (Ngày 7)', spell: "I've had a cough for about a week.", answer: "I've had a cough for about a week.", alt: ['I have had a cough for about a week.'] },
          { label: 'Câu 2 (Ngày 8)', spell: "There's water dripping from it again.", answer: "There's water dripping from it again.", alt: ['There is water dripping from it again.'] },
          { label: 'Câu 3 (Ngày 10)', spell: "I'd love to, but I'm going to San Antonio.", answer: "I'd love to, but I'm going to San Antonio.", alt: ["I'd love to but I'm going to San Antonio.", 'I would love to, but I am going to San Antonio.'] },
          { label: 'Câu 4 (Ngày 11)', spell: 'In the end, Mrs Lopez came over and helped me.', answer: 'In the end, Mrs Lopez came over and helped me.', alt: ['In the end Mrs Lopez came over and helped me.', 'In the end, Mrs. Lopez came over and helped me.', 'In the end Mrs. Lopez came over and helped me.'] },
        ],
      },

      /** ───────────── 2. Mẫu câu hợp cảnh ───────────── **/
      { t: 'h', text: 'Phần 2 — Mẫu câu hợp cảnh (12 câu · đạt ≥ 9 · trượt thì ôn bài Nói của Ngày ghi trong câu)' },
      {
        t: 'mcq',
        id: 'gtd12-kt-mau-cau',
        title: 'Phần 2 — Chọn câu hợp cảnh nhất (12 câu)',
        items: [
          {
            q: 'Ở hiệu thuốc, bạn muốn tả là bị sổ mũi và đau họng hai ngày nay:',
            options: ['I am runny nose and sore throat two days.', "I've got a runny nose and a sore throat. I've had them for two days.", 'My nose run and my throat pain since two days.', 'I sick nose.'],
            correct: 1,
            why: "**I've got a…** + **I've had them for + khoảng** (Ngày 7).",
          },
          {
            q: 'Đồng nghiệp ho cả buổi sáng. Lời khuyên tự nhiên nhất:',
            options: ['You must go to hospital now!', 'Maybe you should go home and rest.', 'You should to drink water.', 'Why you cough?'],
            correct: 1,
            why: '**should + V** (không "to"), thêm **Maybe** cho mềm. Ho thì không ai bảo đi viện ngay (Ngày 7).',
          },
          {
            q: 'Đi xem phòng thuê, bạn muốn hỏi có máy giặt không:',
            options: ['Have washing machine?', 'Is there a washing machine?', 'Are there washing machine?', 'It has washing machine?'],
            correct: 1,
            why: 'Hỏi "có… không" về một nơi: **Is there a…?** (Ngày 8)',
          },
          {
            q: 'Nhắn chủ nhà: vòi nước trong bếp nhỏ giọt cả đêm:',
            options: ['The kitchen tap is drip.', "The kitchen tap is dripping, and it's getting worse.", 'The kitchen tap drip water.', 'Kitchen tap broken water.'],
            correct: 1,
            why: 'Việc đang diễn ra: **is + V-ing**, thêm **it\'s getting worse** để chủ nhà biết cần sửa sớm (Ngày 8).',
          },
          {
            q: 'Bạn nghe máy hộ đồng nghiệp đang họp. Câu đúng:',
            options: ["She is not here. Call later.", "I'm afraid she's in a meeting right now. Can I take a message?", 'Who are you?', 'Wait.'],
            correct: 1,
            why: "**I'm afraid…** + **Can I take a message?** (Ngày 9)",
          },
          {
            q: 'Cuộc gọi bị rè, bạn không nghe rõ. Bạn nói:',
            options: ["Sorry, you're breaking up. Could you say that again?", 'Your phone is bad!', 'Speak louder!', 'What? What?'],
            correct: 0,
            why: "**You're breaking up** = tiếng bị rè, đứt quãng. Kèm **Could you…?** cho lịch sự (Ngày 9).",
          },
          {
            q: 'Bạn bè rủ đi leo núi Chủ nhật, nhưng bạn đã hẹn về quê. Câu tốt nhất:',
            options: ["I'm busy.", "I'd love to, but I'm visiting my grandparents on Sunday. Have a great time, though!", 'No.', 'Maybe. I will try.'],
            correct: 1,
            why: "**I'd love to, but** + kế hoạch đã chốt (**I'm visiting**) + chúc vui (Ngày 10).",
          },
          {
            q: 'Bạn phải xin dời buổi cà phê với mentor từ thứ Ba sang hôm khác:',
            options: ['Can we delay Tuesday?', "Something's come up on Tuesday. Could we make it Thursday instead?", 'I cancel Tuesday.', 'Tuesday no.'],
            correct: 1,
            why: "**Something's come up** + **Could we make it… instead?** (Ngày 10)",
          },
          {
            q: 'Đồng nghiệp kể: "…and then the taxi driver drove off with my suitcase!" Bạn phản ứng:',
            options: ['Okay.', 'No way! Then what did you do?', 'Taxi is dangerous.', 'I know.'],
            correct: 1,
            why: 'Phản ứng + câu hỏi tiếp bằng quá khứ đơn (Ngày 11).',
          },
          {
            q: 'Bạn báo sếp chuyện tối qua làm mất thẻ ra vào văn phòng (đã xin cấp lại):',
            options: [
              'So, last night, I went to the gym, and then…',
              "It's sorted now, but I lost my office pass last night. I've already asked for a new one.",
              'My pass is lost by me.',
              'Guess what happened, dude!',
            ],
            correct: 1,
            why: 'Với sếp: **kết quả trước** (It\'s sorted now), rồi kể ngắn (Ngày 11) và báo việc đã làm bằng **I\'ve already…** (Ngày 12).',
          },
          {
            q: 'Hàng xóm khen: "Your Vietnamese coffee smells amazing!" Bạn đáp:',
            options: ['No, it is bad coffee.', 'Thanks! Would you like to try some?', 'Yes, of course.', 'Your coffee also.'],
            correct: 1,
            why: 'Nhận lời khen + một câu thân thiện (Ngày 12).',
          },
          {
            q: 'Một đồng nghiệp vừa trở lại sau khi bố mất. Câu phù hợp:',
            options: ['How did he die?', 'I was so sorry to hear about your dad. If there\'s anything I can do, just let me know.', 'Don\'t be sad!', 'Congratulations on coming back!'],
            correct: 1,
            why: 'Chia buồn ngắn + đề nghị giúp. Không hỏi nguyên nhân, không bảo người ta đừng buồn (Ngày 12).',
          },
        ],
      },

      /** ───────────── 3. Ngữ pháp ───────────── **/
      { t: 'h', text: 'Phần 3 — Ngữ pháp (12 câu · đạt ≥ 9 · trượt thì ôn mục 🧱 của Ngày ghi trong câu)' },
      {
        t: 'quiz',
        id: 'gtd12-kt-ngu-phap',
        title: 'Phần 3 — Điền một từ (12 câu)',
        kind: 'fill',
        grammar: "have / has · should · there · is / are · 'll · could · going · am / is · V2 · didn't · just · such",
        items: [
          { q: '(Ngày 7) I\'ve had this headache ___ Monday morning.', answers: ['since'] },
          { q: "(Ngày 7) You ___ go to work tomorrow. You need to rest. (không nên — dạng rút gọn)", answers: ["shouldn't", 'shouldn’t', 'should not'] },
          { q: '(Ngày 8) ___ there any shops near the apartment?', answers: ['Are', 'are'] },
          { q: "(Ngày 8) The heating ___ working again. It's freezing! (phủ định, rút gọn)", answers: ["isn't", 'isn’t', 'is not'] },
          { q: "(Ngày 9) She's on another call. I___ ask her to call you back. (rút gọn)", answers: ["'ll", 'll', '’ll'] },
          { q: '(Ngày 9) ___ you speak up a bit, please? I can\'t hear you.', answers: ['Could', 'could', 'Can', 'can', 'Would', 'would'] },
          { q: "(Ngày 10) I'm ___ to visit my aunt in Da Lat next month. (đã định)", answers: ['going'] },
          { q: "(Ngày 10) Sorry, I can't come on Friday. I ___ meeting a client. (đã chốt)", answers: ['am', "'m"] },
          { q: '(Ngày 11) Last night I ___ (lose) my keys and called a locksmith.', answers: ['lost'] },
          { q: "(Ngày 11) The driver ___ answer, so I reported it in the app. (phủ định, rút gọn)", answers: ["didn't", 'didn’t', 'did not'] },
          { q: "(Ngày 12) Guess what? I've ___ passed my driving test! (vừa mới)", answers: ['just'] },
          { q: '(Ngày 12) It was ___ a good party that nobody wanted to leave.', answers: ['such'] },
        ],
      },

      /** ───────────── 4. Viết tin nhắn ───────────── **/
      { t: 'h', text: 'Phần 4 — Viết tin nhắn (10 câu · đạt ≥ 7 · trượt thì ôn bài Đọc / Viết của Ngày 7, 8, 10, 12)' },
      {
        t: 'quiz',
        id: 'gtd12-kt-viet',
        title: 'Phần 4a — Tự viết 6 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I'm not feeling well… · The … is V-ing · Could you…? · I'd love to, but… · first / then · Congratulations on… · Thanks for…",
        items: [
          { q: '(Ngày 7 — nhắn quản lý) Em thấy không khoẻ. Em bị sốt từ tối qua.', hint: "not feeling well, temperature / fever, since", answers: ["I'm not feeling well. I've had a temperature since last night.", "I'm not feeling well. I've had a fever since last night.", "I am not feeling well. I have had a fever since last night.", "I'm not feeling well. I've had a high temperature since last night.", "I don't feel well. I've had a fever since last night.", "I'm not feeling well. I've had a temperature since yesterday evening.", "I'm not feeling well. I've had a fever since yesterday evening."] },
          { q: '(Ngày 8 — nhắn chủ nhà) Bồn rửa trong bếp bị tắc. Chú cho người tới xem được không ạ?', hint: 'blocked, could you send someone to look at it', answers: ['The kitchen sink is blocked. Could you send someone to look at it?', 'The sink in the kitchen is blocked. Could you send someone to look at it?', 'The kitchen sink is blocked. Could you send someone to have a look?', 'The kitchen sink is clogged. Could you send someone to look at it?', 'The kitchen sink is blocked. Could you please send someone to look at it?', 'The kitchen sink is blocked. Can you send someone to look at it?'] },
          { q: '(Ngày 9 — nhắn sau cuộc gọi lỡ) Xin lỗi, lúc nãy mình lỡ cuộc gọi. Mình sẽ gọi lại cho bạn sau 10 phút.', hint: "missed your call, I'll call you back in", answers: ["Sorry, I missed your call. I'll call you back in 10 minutes.", "Sorry, I missed your call earlier. I'll call you back in ten minutes.", "Sorry, I missed your call. I'll call you back in ten minutes.", "Sorry I missed your call earlier. I'll call you back in 10 minutes.", "Sorry, I missed your call earlier. I'll call you back in 10 minutes.", "Sorry, I missed your call. I will call you back in 10 minutes."] },
          { q: '(Ngày 10 — từ chối) Cảm ơn đã mời! Mình rất muốn, nhưng tối thứ Bảy mình phải làm. Lần sau nhé?', hint: "thanks for inviting me, I'd love to but I'm working", answers: ["Thanks for inviting me! I'd love to, but I'm working on Saturday evening. Maybe next time?", "Thanks for the invite! I'd love to, but I'm working on Saturday evening. Next time?", "Thanks for inviting me! I'd love to, but I'm working on Saturday night. Maybe next time?", "Thanks for inviting me! I'd love to, but I have to work on Saturday evening. Maybe next time?", "Thanks for the invite! I'd love to, but I'm working on Saturday night. Maybe next time?", "Thanks for inviting me! I'd love to, but I'm working Saturday evening. Next time?"] },
          { q: '(Ngày 12 — nhắn bạn) Chúc mừng cậu thi đỗ! Cậu xứng đáng lắm.', hint: 'congratulations on passing, deserve it', answers: ['Congratulations on passing your exam! You really deserve it.', 'Congratulations on passing your exam! You deserve it.', 'Congrats on passing your exam! You really deserve it.', 'Congratulations on passing the exam! You really deserve it.', 'Congratulations on passing! You really deserve it.', 'Congrats on passing! You deserve it.'] },
          { q: '(Ngày 12 — cảm ơn) Cảm ơn chị nhiều vì đã giúp em chuyển nhà. Em thật sự cảm kích.', hint: 'thanks so much for helping me move, appreciate it', answers: ['Thanks so much for helping me move. I really appreciate it.', 'Thank you so much for helping me move. I really appreciate it.', 'Thanks so much for helping me move house. I really appreciate it.', 'Thanks so much for helping me move. I really appreciate it!', 'Thank you so much for helping me move house. I really appreciate it.'] },
        ],
      },
      {
        t: 'build',
        id: 'gtd12-kt-viet-ghep',
        title: 'Phần 4b — Sắp xếp câu trong tin nhắn (4 câu)',
        items: [
          { vi: '(Ngày 7) Tôi muốn đặt lịch khám.', chips: ["I'd", 'like', 'to', 'make', 'an', 'appointment.', 'do', 'a'], answer: ["I'd", 'like', 'to', 'make', 'an', 'appointment.'] },
          { vi: '(Ngày 8) Có nước rỉ qua trần nhà.', chips: ["There's", 'water', 'coming', 'through', 'the', 'ceiling.', 'have', 'from'], answer: ["There's", 'water', 'coming', 'through', 'the', 'ceiling.'] },
          { vi: '(Ngày 11) Đầu tiên mình gọi tài xế, rồi mình báo trong ứng dụng.', chips: ['First,', 'I', 'called', 'the', 'driver,', 'then', 'I', 'reported', 'it', 'in', 'the', 'app.', 'call', 'after'], answer: ['First,', 'I', 'called', 'the', 'driver,', 'then', 'I', 'reported', 'it', 'in', 'the', 'app.'] },
          { vi: '(Ngày 12) Chúng tôi rất tiếc khi nghe tin về bố anh.', chips: ['We', 'were', 'so', 'sorry', 'to', 'hear', 'about', 'your', 'father.', 'for', 'such'], answer: ['We', 'were', 'so', 'sorry', 'to', 'hear', 'about', 'your', 'father.'] },
        ],
      },

      { t: 'h', text: 'Sau khi làm xong' },
      {
        t: 'note',
        title: 'Đạt hay chưa đạt — làm gì tiếp',
        items: [
          '**Đạt cả 4 phần**: sang **Ngày 13**, chặng 3 "Công sở". Trước khi sang, kể lại **câu chuyện 1 phút** của Ngày 11 và ghi âm: so với bản ghi hôm trước, đếm xem lỗi thì quá khứ còn bao nhiêu.',
          '**Trượt Nghe**: nghe lại ba cảnh của **Ngày 9** (gọi điện) và **Ngày 11** (kể chuyện), mỗi cảnh 2 lần, lần 2 nhắc lại từng câu thành tiếng. Làm lại Phần 1 sau một ngày.',
          '**Trượt Mẫu câu**: mỗi câu sai ghi một (Ngày N). Mở bài **Nói** ngày đó, đọc lại bảng **ba mức lịch sự**, rồi làm phần "Nhập vai với Gia sư AI" của ngày đó một lượt.',
          '**Trượt Ngữ pháp**: mở mục **🧱 Câu này ghép thế nào** của ngày có câu sai. Hay nhầm nhất ở chặng này: **for / since** (Ngày 7), **I\'m + V-ing / going to / I\'ll** (Ngày 9–10), **quá khứ đơn / have + V3** (Ngày 11–12).',
          '**Trượt Viết**: làm lại phần **Tập viết** của bài Viết Ngày 8, 10, 12, rồi viết 3 tin thật trong tuần này: một lời cảm ơn, một lời từ chối khéo, một tin báo việc gì đó hỏng.',
          'Chỉ làm lại **phần trượt**, không cần làm lại cả bài. Đạt rồi thì sang Ngày 13, đừng đợi điểm tuyệt đối.',
        ],
      },
    ],
  },
];
