/**
 * Tiếng Anh giao tiếp — NGÀY 4 (chặng 1 "Sống sót", A2): quán cà phê & nhà hàng.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd4-`.
 * Ngữ pháp trong câu: would like / Can I have…? · some / any · đếm được – không đếm được · nối câu bằng `with / without`, `actually`.
 * Cảnh: Ngân — sinh viên IT năm 3 thực tập ở TP.HCM — lần đầu đi công tác Melbourne: quầy cà phê (long black, flat white,
 * sữa yến mạch, chỉ nhận thẻ), bữa tối với khách (dị ứng hải sản có vỏ, "entrée" Úc ≠ Mỹ), bữa trưa Chủ nhật (phụ phí, tip, hoá đơn tính nhầm).
 * Khác podcast en-a1-02 (cà phê đá, bánh chuối), en-ds-a1-03 (không đặt bàn, dị ứng đậu phộng), en-ds-b1-01 (chờ lâu, sai món, súp nguội).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_4: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd4-nghe',
    kind: 'listening',
    title: 'Quán cà phê & nhà hàng: gọi món, dị ứng, tính tiền',
    goal: 'Nghe hiểu nhân viên quán cà phê và nhà hàng ở Úc: họ hỏi gì, gợi ý gì, cảnh báo gì về dị ứng, phụ phí và hoá đơn; nhận ra những từ ăn uống mà Anh, Mỹ, Úc hiểu khác nhau.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Hôm qua bạn nói chuyện phiếm với đồng nghiệp. Hôm nay là việc **ngày nào cũng phải làm** khi ở nước ngoài: gọi đồ uống, gọi món, trả tiền.',
          'Bạn theo chân **Ngân**, sinh viên IT năm 3 thực tập ở TP.HCM, trong **chuyến công tác đầu tiên tới Melbourne (Úc)** cùng anh **Kevin**, đồng nghiệp người Mỹ.',
          'Ba cảnh: **quầy cà phê** buổi sáng · **bữa tối** với chị **Kate**, khách hàng người Úc · **bữa trưa Chủ nhật** và tờ hoá đơn có chỗ sai.',
          'Cần nghe ra: **tên món** (long black, flat white, barramundi), **cảnh báo dị ứng**, **số tiền**, và vì sao hoá đơn Chủ nhật đắt hơn.',
          'Nghe mỗi cảnh **2 lần**. Tên đồ uống và món Úc lạ tai, lần đầu chưa nghe ra là bình thường.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Quầy cà phê: "What are you after?"' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'woman-technologist', 'man-cook', 'glass-of-milk', 'cupcake', 'credit-card'],
        caption: '7 giờ 45 sáng thứ Sáu ở Melbourne. Trước giờ họp, **Ngân** vào một quán cà phê nhỏ mua hai ly: một cho mình, một cho **Kevin**. Anh barista tên **Josh**, người New Zealand, nói rất nhanh.',
      },
      {
        t: 'listen',
        id: 'gtd4-nghe-canh1',
        title: 'Scene 1 — At the coffee counter',
        note: 'Nghe xem Ngân gọi những gì, vì sao phải đổi sữa và đổi bánh, và cuối cùng trả bằng gì.',
        lines: [
          { who: 'Josh', voice: 'nz-nam', text: "Hey, how's it going? What are you after?", vi: 'Chào chị, khoẻ không? Chị muốn gọi gì ạ?' },
          { who: 'Ngân', voice: 'us-nu', text: "Sorry? What am I…?", vi: 'Xin lỗi? Em… gì cơ ạ?' },
          { who: 'Josh', voice: 'nz-nam', text: 'Ha, sorry. What would you like?', vi: 'Ha, xin lỗi. Chị muốn uống gì ạ?' },
          { who: 'Ngân', voice: 'us-nu', text: 'Oh! Can I have two coffees, please? One black, and one with milk.', vi: 'À! Cho em hai ly cà phê ạ. Một ly đen, một ly có sữa.' },
          { who: 'Josh', voice: 'nz-nam', text: 'Sure. For the black one, a long black or a short black?', vi: 'Được ạ. Ly đen thì chị lấy long black hay short black?' },
          { who: 'Ngân', voice: 'us-nu', text: "What's the difference?", vi: 'Hai loại khác nhau thế nào ạ?' },
          { who: 'Josh', voice: 'nz-nam', text: "A short black is just an espresso. Small and strong. A long black is an espresso with hot water, so it's bigger.", vi: 'Short black chỉ là một shot espresso. Nhỏ và đậm. Long black là espresso pha thêm nước nóng, nên ly to hơn.' },
          { who: 'Ngân', voice: 'us-nu', text: 'A long black, please. And for the milk one, what do you recommend?', vi: 'Cho em long black ạ. Còn ly có sữa thì anh gợi ý loại nào?' },
          { who: 'Josh', voice: 'nz-nam', text: "Most people here get a flat white. It's like a latte, but smaller, with less milk.", vi: 'Ở đây đa số gọi flat white. Nó giống latte nhưng nhỏ hơn, ít sữa hơn.' },
          { who: 'Ngân', voice: 'us-nu', text: "Okay, a flat white. Oh, wait. My colleague doesn't drink cow's milk. Do you have any oat milk?", vi: 'Vâng, một flat white. Ôi, khoan. Đồng nghiệp em không uống sữa bò. Quán có sữa yến mạch không ạ?' },
          { who: 'Josh', voice: 'nz-nam', text: 'Yep. Oat, soy or almond. Oat is sixty cents extra.', vi: 'Có ạ. Yến mạch, đậu nành hoặc hạnh nhân. Yến mạch thêm sáu mươi xu.' },
          { who: 'Ngân', voice: 'us-nu', text: "Oat, please. And I'd like a muffin. Do you have any blueberry ones?", vi: 'Yến mạch ạ. Em lấy thêm một cái bánh muffin. Quán có muffin việt quất không ạ?' },
          { who: 'Josh', voice: 'nz-nam', text: "Sorry, we haven't got any blueberry left. We've got some raspberry and white chocolate ones.", vi: 'Xin lỗi, hết muffin việt quất rồi ạ. Còn mấy cái mâm xôi sô-cô-la trắng.' },
          { who: 'Ngân', voice: 'us-nu', text: "That's fine. One raspberry, please.", vi: 'Cũng được ạ. Cho em một cái mâm xôi.' },
          { who: 'Josh', voice: 'nz-nam', text: 'No worries. Have here or take away?', vi: 'Được ạ. Chị dùng ở đây hay mang đi?' },
          { who: 'Ngân', voice: 'us-nu', text: 'Take away, please. Can I pay by cash?', vi: 'Mang đi ạ. Em trả tiền mặt được không?' },
          { who: 'Josh', voice: 'nz-nam', text: "Sorry, we're card only. Is that okay?", vi: 'Xin lỗi, quán chỉ nhận thẻ thôi. Chị trả thẻ được không ạ?' },
          { who: 'Ngân', voice: 'us-nu', text: 'Oh. Yes, I have a Visa card.', vi: 'Ồ. Được ạ, em có thẻ Visa.' },
          { who: 'Josh', voice: 'nz-nam', text: "Perfect. That's sixteen sixty. Just tap here. Your coffees will be at the end of the counter.", vi: 'Tuyệt. Mười sáu đô sáu mươi. Chị chạm thẻ vào đây. Cà phê sẽ để ở cuối quầy nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd4-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: 'Josh hỏi "What are you after?". Câu này nghĩa là gì?',
            options: ['Chị đang đi theo ai?', 'Chị muốn gọi gì?', 'Chị đến sau ai?', 'Chị làm gì sau đó?'],
            correct: 1,
            why: 'Ở Úc và New Zealand, **What are you after?** = What would you like? Ngân không hiểu nên hỏi lại, và Josh nói lại bằng câu phổ thông.',
          },
          {
            q: 'Long black khác short black ở điểm nào?',
            options: ['Long black có sữa', 'Long black là espresso thêm nước nóng, ly to hơn', 'Long black uống lạnh', 'Short black ngọt hơn'],
            correct: 1,
            why: '"A short black is just an espresso… A long black is **an espresso with hot water, so it\'s bigger**." Cả hai đều không có sữa.',
          },
          {
            q: 'Vì sao Ngân hỏi sữa yến mạch (oat milk)?',
            options: ['Vì Ngân thích vị yến mạch', 'Vì đồng nghiệp của Ngân không uống sữa bò', 'Vì quán hết sữa bò', 'Vì Josh gợi ý'],
            correct: 1,
            why: '"**My colleague doesn\'t drink cow\'s milk.** Do you have any oat milk?" Sữa thay thế thường tính thêm tiền: "Oat is sixty cents extra."',
          },
          {
            q: 'Chuyện gì xảy ra với muffin việt quất?',
            options: ['Ngân đổi ý không ăn', 'Quán hết, Ngân lấy loại mâm xôi', 'Josh tặng miễn phí', 'Bánh bị cháy'],
            correct: 1,
            why: '"Sorry, we **haven\'t got any** blueberry left. We\'ve got **some** raspberry…" Câu phủ định dùng **any**, câu khẳng định dùng **some**.',
          },
          {
            q: 'Ngân trả tiền bằng gì, và vì sao?',
            options: ['Tiền mặt, vì Ngân không có thẻ', 'Thẻ, vì quán chỉ nhận thẻ', 'Chuyển khoản qua mã QR', 'Kevin trả hộ'],
            correct: 1,
            why: '"Sorry, **we\'re card only**." Nhiều quán cà phê ở Úc không nhận tiền mặt. Khách chỉ việc chạm thẻ (tap) vào máy.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Bữa tối với khách: dị ứng và chữ "entrée"' },
      {
        t: 'canh',
        anh: ['fork-and-knife-with-plate', 'woman-office-worker', 'man-office-worker', 'shrimp', 'fish', 'potable-water'],
        caption: '7 giờ tối. Chị **Kate**, khách hàng người Úc, mời Ngân và Kevin ăn tối. Ngân **dị ứng hải sản có vỏ** (tôm, cua, sò). Anh phục vụ tên **Sam**.',
      },
      {
        t: 'listen',
        id: 'gtd4-nghe-canh2',
        title: 'Scene 2 — Dinner with a client',
        note: 'Nghe xem vì sao Ngân không gọi được món mì hải sản dù bếp bỏ tôm ra, và Kevin hiểu nhầm chữ nào.',
        lines: [
          { who: 'Sam', voice: 'au-nam', text: "Hi, guys, I'm Sam. I'm looking after you tonight. Can I get you some drinks to start?", vi: 'Chào mọi người, tôi là Sam. Tối nay tôi phục vụ bàn mình. Mọi người uống gì trước không ạ?' },
          { who: 'Kate', voice: 'au-nu', text: 'Could we get a jug of tap water for the table, please?', vi: 'Cho bàn mình một bình nước lọc nhé.' },
          { who: 'Kevin', voice: 'us-nam', text: "And I'd like a lemonade, please.", vi: 'Cho tôi một ly nước chanh.' },
          { who: 'Sam', voice: 'au-nam', text: "Sure. Just so you know, our lemonade is fizzy, like Sprite. Is that okay?", vi: 'Được ạ. Tôi nói trước để anh biết, nước chanh ở đây là loại có ga, giống Sprite. Anh thấy được không?' },
          { who: 'Kevin', voice: 'us-nam', text: "Oh! In the States, lemonade is just lemon juice, water and sugar. Then a Coke, please.", vi: 'Ồ! Ở Mỹ, lemonade chỉ là nước cốt chanh, nước với đường. Vậy cho tôi một Coca nhé.' },
          { who: 'Sam', voice: 'au-nam', text: 'No worries. And what would you like to eat?', vi: 'Được ạ. Còn món ăn thì mọi người dùng gì?' },
          { who: 'Kate', voice: 'au-nu', text: "I'd like the lamb, please.", vi: 'Chị lấy món thịt cừu.' },
          { who: 'Kevin', voice: 'us-nam', text: "I'll have the steak, medium-rare.", vi: 'Tôi lấy bít tết, tái vừa.' },
          { who: 'Ngân', voice: 'us-nu', text: "I'd like the seafood pasta, but can I ask something first? I'm allergic to shellfish. Are there any prawns in it?", vi: 'Em muốn gọi mì Ý hải sản, nhưng cho em hỏi trước một chút. Em dị ứng hải sản có vỏ. Trong món này có tôm không ạ?' },
          { who: 'Sam', voice: 'au-nam', text: "There are prawns and mussels. The chef can leave them out, but the sauce has some prawn stock in it.", vi: 'Có tôm và vẹm ạ. Đầu bếp có thể bỏ chúng ra, nhưng nước sốt có nước dùng tôm.' },
          { who: 'Ngân', voice: 'us-nu', text: 'Sorry, prawn… stock?', vi: 'Xin lỗi, "prawn stock" ạ?' },
          { who: 'Sam', voice: 'au-nam', text: "Stock is like a soup. We make it from prawn shells. It's in the sauce, so we can't take it out.", vi: '"Stock" giống như nước súp. Bếp nấu từ vỏ tôm. Nó nằm sẵn trong sốt rồi nên không bỏ ra được.' },
          { who: 'Ngân', voice: 'us-nu', text: "Oh, then it isn't safe for me. Is there any fish without shellfish?", vi: 'Ồ, vậy em không ăn được rồi. Có món cá nào không có hải sản có vỏ không ạ?' },
          { who: 'Sam', voice: 'au-nam', text: "The barramundi is a good choice. It comes with salad and chips, and there's no shellfish at all. I'll tell the kitchen about your allergy, too.", vi: 'Cá chẽm barramundi là lựa chọn tốt. Ăn kèm salad và khoai chiên, hoàn toàn không có hải sản có vỏ. Tôi cũng sẽ báo bếp về dị ứng của chị.' },
          { who: 'Ngân', voice: 'us-nu', text: "Great. I'd like the barramundi, please. Could I have the salad without onion?", vi: 'Tuyệt ạ. Cho em món cá barramundi. Salad cho em bỏ hành được không ạ?' },
          { who: 'Sam', voice: 'au-nam', text: 'Sure thing.', vi: 'Được ạ.' },
          { who: 'Kate', voice: 'au-nu', text: 'Shall we get an entrée to share?', vi: 'Mình gọi thêm một món khai vị ăn chung nhé?' },
          { who: 'Kevin', voice: 'us-nam', text: 'Another entrée? But I just ordered my steak.', vi: 'Thêm một món chính nữa á? Nhưng tôi vừa gọi bít tết rồi mà.' },
          { who: 'Kate', voice: 'au-nu', text: 'Ha! No, here an entrée is a starter. A small dish before the main.', vi: 'Ha! Không, ở đây "entrée" là món khai vị. Một món nhỏ ăn trước món chính.' },
          { who: 'Kevin', voice: 'us-nam', text: 'Oh! In the States, the entrée is the main course. Okay, how about some garlic bread?', vi: 'Ồ! Ở Mỹ, "entrée" là món chính. Được, vậy gọi bánh mì bơ tỏi nhé?' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd4-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: 'Vì sao Kevin không lấy lemonade nữa?',
            options: ['Vì quán hết', 'Vì lemonade ở Úc là nước có ga kiểu Sprite, khác ở Mỹ', 'Vì đắt quá', 'Vì Kate không thích'],
            correct: 1,
            why: '"Our lemonade is **fizzy, like Sprite**." Ở Anh và Úc, lemonade là nước ngọt có ga vị chanh. Ở Mỹ, lemonade là nước chanh pha đường, không ga.',
          },
          {
            q: 'Vì sao Ngân không gọi mì Ý hải sản dù đầu bếp bỏ được tôm và vẹm?',
            options: ['Vì món đó cay', 'Vì nước sốt có nước dùng nấu từ vỏ tôm', 'Vì món đó hết', 'Vì Kate gợi ý món khác'],
            correct: 1,
            why: '"The sauce has some **prawn stock** in it… we can\'t take it out." Người dị ứng phải hỏi cả **nước dùng, nước sốt**, không chỉ hỏi thứ nhìn thấy trên đĩa.',
          },
          {
            q: 'Sam hứa làm gì thêm?',
            options: ['Giảm giá cho Ngân', 'Báo bếp về dị ứng của Ngân', 'Tặng món tráng miệng', 'Mang thêm bánh mì'],
            correct: 1,
            why: '"**I\'ll tell the kitchen about your allergy**, too." Nhà hàng tử tế sẽ tự làm việc này. Nếu họ không nói, bạn nên nhờ: "Could you tell the kitchen, please?"',
          },
          {
            q: 'Kevin hiểu "entrée" là gì?',
            options: ['Món khai vị', 'Món chính', 'Món tráng miệng', 'Đồ uống'],
            correct: 1,
            why: 'Ở Mỹ **entrée = món chính**. Ở Úc (và theo nghĩa gốc tiếng Pháp) **entrée = món khai vị**. Ở Anh hay nói **starter**.',
          },
          {
            q: 'Câu "I\'m looking after you tonight" của Sam nghĩa là gì?',
            options: ['Tôi sẽ để mắt canh chừng mọi người', 'Tối nay tôi phục vụ bàn này', 'Tôi sẽ trả tiền cho mọi người', 'Tôi đến muộn'],
            correct: 1,
            why: 'Phục vụ ở Úc, Anh hay tự giới thiệu tên và nói **I\'m looking after you tonight** = tối nay tôi lo bàn của bạn. Cần gì cứ gọi tên họ.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Bữa trưa Chủ nhật: phụ phí, tiền tip, hoá đơn sai' },
      {
        t: 'canh',
        anh: ['croissant', 'woman-technologist', 'man-technologist', 'receipt', 'credit-card', 'coin'],
        caption: 'Trưa Chủ nhật, ngày cuối chuyến công tác. Ngân và Kevin ăn trưa ở một quán gần khách sạn. Chị phục vụ tên **Poppy**, người Anh sang Úc làm việc kỳ nghỉ. Đến lúc tính tiền.',
      },
      {
        t: 'listen',
        id: 'gtd4-nghe-canh3',
        title: 'Scene 3 — Paying on a Sunday',
        note: 'Nghe xem vì sao hoá đơn Chủ nhật đắt hơn, Kevin muốn làm gì theo thói quen Mỹ, và Ngân phát hiện chỗ sai nào.',
        lines: [
          { who: 'Ngân', voice: 'us-nu', text: 'Excuse me. Could we get the bill, please?', vi: 'Chị ơi. Cho bọn em xin hoá đơn ạ.' },
          { who: 'Poppy', voice: 'uk-nu', text: 'Of course. Do you want to split it?', vi: 'Được ạ. Hai bạn có muốn tách hoá đơn không?' },
          { who: 'Kevin', voice: 'us-nam', text: "Yes, please. I'll pay for mine, and Ngân will pay for hers.", vi: 'Có ạ. Tôi trả phần tôi, Ngân trả phần của Ngân.' },
          { who: 'Poppy', voice: 'uk-nu', text: "No problem. Just so you know, there's a ten percent surcharge on Sundays.", vi: 'Không sao ạ. Báo trước để hai bạn biết, Chủ nhật có phụ phí mười phần trăm.' },
          { who: 'Ngân', voice: 'us-nu', text: 'Sorry, a surcharge?', vi: 'Xin lỗi, "surcharge" ạ?' },
          { who: 'Poppy', voice: 'uk-nu', text: 'An extra charge. Staff get paid more on Sundays, so lots of cafés add a bit to the bill.', vi: 'Một khoản tính thêm. Chủ nhật nhân viên được trả lương cao hơn, nên nhiều quán cộng thêm một chút vào hoá đơn.' },
          { who: 'Ngân', voice: 'us-nu', text: "Oh, I see. That's fine.", vi: 'À, em hiểu rồi. Không sao ạ.' },
          { who: 'Poppy', voice: 'uk-nu', text: 'So, Kevin, yours is twenty-four twenty.', vi: 'Vậy Kevin, phần của anh là hai mươi bốn đô hai mươi.' },
          { who: 'Kevin', voice: 'us-nam', text: 'Great. Can I add a tip? Like twenty percent?', vi: 'Được. Tôi thêm tiền tip được không? Khoảng hai mươi phần trăm?' },
          { who: 'Poppy', voice: 'uk-nu', text: "That's really kind, but you don't have to. People don't usually tip here.", vi: 'Anh tốt quá, nhưng anh không cần đâu. Ở đây người ta thường không để tip.' },
          { who: 'Kevin', voice: 'us-nam', text: 'Oh, okay. Then just make it twenty-five.', vi: 'Ồ, vậy à. Thế thì làm tròn thành hai mươi lăm nhé.' },
          { who: 'Poppy', voice: 'uk-nu', text: 'Thank you! And Ngân, yours is thirty-one ninety.', vi: 'Cảm ơn anh! Còn Ngân, phần của em là ba mươi mốt đô chín mươi.' },
          { who: 'Ngân', voice: 'us-nu', text: 'Hmm, sorry, I think there\'s a mistake. There are two flat whites on here, but I only had one.', vi: 'Ừm, xin lỗi chị, em nghĩ có chỗ nhầm. Trên này có hai ly flat white, nhưng em chỉ uống một ly.' },
          { who: 'Poppy', voice: 'uk-nu', text: "Oh, let me check. You're right. Sorry about that! I'll take one off.", vi: 'Ồ, để chị kiểm tra. Em nói đúng. Chị xin lỗi nhé! Chị bỏ bớt một ly.' },
          { who: 'Ngân', voice: 'us-nu', text: "No problem. And could I get an itemised receipt, please? It's for work.", vi: 'Không sao ạ. Chị cho em xin hoá đơn ghi từng món được không ạ? Em cần cho công việc.' },
          { who: 'Poppy', voice: 'uk-nu', text: "Sure. So that's twenty-five eighty-five now. Here's your receipt.", vi: 'Được em. Vậy giờ còn hai mươi lăm đô tám mươi lăm. Hoá đơn của em đây.' },
          { who: 'Ngân', voice: 'us-nu', text: 'Thanks so much. The food was lovely.', vi: 'Cảm ơn chị nhiều. Đồ ăn ngon lắm ạ.' },
          { who: 'Poppy', voice: 'uk-nu', text: "Aw, glad you liked it. Have a lovely afternoon, guys!", vi: 'Ôi, chị vui vì hai bạn thích. Chúc hai bạn buổi chiều vui vẻ!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd4-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: '"Do you want to split it?" nghĩa là gì?',
            options: ['Có muốn chia món ăn không?', 'Có muốn tách hoá đơn, mỗi người trả phần mình không?', 'Có muốn ngồi tách bàn không?', 'Có muốn hủy món không?'],
            correct: 1,
            why: '**split the bill** = chia hoá đơn. Kevin đáp: "I\'ll pay for mine, and Ngân will pay for hers." Ở Úc, Anh, Mỹ, đồng nghiệp đi ăn thường trả phần ai nấy.',
          },
          {
            q: 'Vì sao Chủ nhật có phụ phí 10 %?',
            options: ['Vì Chủ nhật quán đông', 'Vì Chủ nhật nhân viên được trả lương cao hơn', 'Vì khách trả bằng thẻ', 'Vì là ngày lễ'],
            correct: 1,
            why: '"**Staff get paid more on Sundays**, so lots of cafés add a bit to the bill." Ở Úc, phụ phí Chủ nhật và ngày lễ (thường 10–15 %) là chuyện bình thường và phải được báo trước.',
          },
          {
            q: 'Poppy nói gì về tiền tip?',
            options: ['Phải để ít nhất 20 %', 'Không bắt buộc, ở đây người ta thường không để tip', 'Tip đã tính trong hoá đơn', 'Quán không cho để tip'],
            correct: 1,
            why: '"You don\'t have to. **People don\'t usually tip here.**" Kevin quen kiểu Mỹ (tip 15–20 % gần như bắt buộc), nên cuối cùng chỉ làm tròn số.',
          },
          {
            q: 'Ngân phát hiện chỗ sai nào trên hoá đơn?',
            options: ['Bị tính hai lần phụ phí', 'Bị tính hai ly flat white trong khi chỉ uống một', 'Tên món bị ghi sai', 'Thiếu món của Kevin'],
            correct: 1,
            why: '"There are **two flat whites** on here, but **I only had one**." Ngân nói nhẹ nhàng: "Sorry, I think there\'s a mistake", không trách ai.',
          },
          {
            q: 'Vì sao Ngân xin "an itemised receipt"?',
            options: ['Để giữ làm kỷ niệm', 'Vì cần hoá đơn ghi từng món để thanh toán với công ty', 'Để kiểm tra lại giá', 'Vì Poppy yêu cầu'],
            correct: 1,
            why: '"It\'s **for work**." Đi công tác, công ty thường cần **hoá đơn ghi từng món** (itemised) để hoàn tiền. Mỹ viết **itemized**.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Để ý **some / any**, số tiền và tên đồ uống. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd4-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — câu hỏi kiểu Úc, NZ ở quầy', spell: 'What are you after?', answer: 'What are you after?' },
          { label: 'Câu 2 — giải thích một loại cà phê', spell: 'A long black is an espresso with hot water.', answer: 'A long black is an espresso with hot water.' },
          { label: 'Câu 3 — hỏi có loại sữa nào không', spell: 'Do you have any oat milk?', answer: 'Do you have any oat milk?' },
          { label: 'Câu 4 — quán không nhận tiền mặt', spell: "Sorry, we're card only.", answer: "Sorry, we're card only.", alt: ['Sorry, we are card only.', "Sorry we're card only"] },
          { label: 'Câu 5 — báo dị ứng', spell: "I'm allergic to shellfish. Are there any prawns in it?", answer: "I'm allergic to shellfish. Are there any prawns in it?", alt: ['I am allergic to shellfish. Are there any prawns in it?', "I'm allergic to shellfish, are there any prawns in it?"] },
          { label: 'Câu 6 — phụ phí', spell: "There's a ten percent surcharge on Sundays.", answer: "There's a ten percent surcharge on Sundays.", alt: ["There's a 10% surcharge on Sundays.", "There's a 10 percent surcharge on Sundays.", 'There is a ten percent surcharge on Sundays.', 'There is a 10% surcharge on Sundays.', "There's a ten per cent surcharge on Sundays."] },
          { label: 'Câu 7 — xin hoá đơn chi tiết', spell: 'Could I get an itemised receipt, please?', answer: 'Could I get an itemised receipt, please?', alt: ['Could I get an itemized receipt, please?', 'Could I get an itemised receipt please', 'Could I get an itemized receipt please'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['What are you after? (Úc, NZ)', 'Bạn muốn gọi gì?', 'Could I have a flat white, please?'],
          ['Have here or take away?', 'Dùng ở đây hay mang đi? (Mỹ: For here or to go?)', 'Take away, please.'],
          ["We're card only.", 'Chỉ nhận thẻ, không nhận tiền mặt.', 'No problem. Can I tap?'],
          ["I'm looking after you tonight.", 'Tối nay tôi phục vụ bàn này.', 'Thanks, Sam.'],
          ['Just so you know…', 'Báo trước để bạn biết… (thường là điều bất lợi: phụ phí, hết món, chờ lâu)', 'Oh, okay. Thanks for telling us.'],
          ['The chef can leave them out.', 'Đầu bếp có thể bỏ chúng ra khỏi món.', 'Great, please leave them out.'],
          ['Sure thing. · No worries.', 'Được ạ, không vấn đề gì.', '(không cần đáp)'],
          ['Do you want to split it?', 'Có tách hoá đơn không?', 'Yes, please. / No, together, please.'],
          ['Sorry about that!', 'Xin lỗi nhé (nhận lỗi nhẹ, sẽ sửa ngay).', "That's okay. Thanks."],
        ],
        caption: 'Ở quầy và ở bàn ăn, câu của nhân viên gần như **luôn là câu hỏi lựa chọn**: nóng hay đá, ở đây hay mang đi, tách hay chung. Nghe ra hai lựa chọn là trả lời được.',
      },
      {
        t: 'note',
        title: 'Mẹo: ở quán mà không nghe kịp thì làm gì',
        items: [
          'Nhân viên đọc một tràng lựa chọn quá nhanh: **"Sorry, what are the options?"** rồi nghe từng cái một. Hoặc chọn luôn cái quen: "Just a normal one, please."',
          'Không biết tên món: **chỉ vào thực đơn** và nói "**This one, please.**" Chỉ tay vào thực đơn là hoàn toàn lịch sự (chỉ vào người mới không lịch sự).',
          'Món lạ: hỏi "**What\'s in it?**" hoặc "**What\'s it like?**" (Nó vị thế nào?). Ngân hỏi "What\'s the difference?" cũng là một cách rất hay.',
          '**Đọc lại đơn** trước khi trả tiền: "So that\'s a long black and a flat white with oat milk?" Sai thì sửa ngay lúc đó, đỡ hơn nhận nhầm ly.',
          '**Dị ứng thì không đoán**. Không chắc đã nghe đúng thì hỏi lại đến khi chắc, như Ngân hỏi lại "prawn… stock?". Mang sẵn một dòng ghi trên điện thoại: "I have a shellfish allergy. No prawns, crab, mussels or prawn stock, please."',
          '**Số tiền** thì nhìn màn hình máy tính tiền hoặc hoá đơn, đừng chỉ nghe. "Sixteen sixty" = 16,60 đô.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Hoá đơn ở nhà hàng', 'the bill', 'the check', 'the bill'],
          ['Mang đi', 'takeaway', 'to go', 'takeaway'],
          ['Món khai vị', 'starter', 'appetizer', '**entrée**'],
          ['Món chính', 'main (course)', '**entrée**', 'main'],
          ['Khoai tây chiên que', 'chips', 'fries', 'chips · hot chips'],
          ['lemonade', 'nước ngọt có ga vị chanh', 'nước chanh pha đường, không ga', 'như Anh: có ga, kiểu Sprite'],
          ['Tiền tip', 'Không bắt buộc. Nhiều nhà hàng tự cộng 10–12,5 % "service charge" vào hoá đơn: đọc kỹ để khỏi trả hai lần.', '**15–20 %**, gần như bắt buộc ở nhà hàng có phục vụ bàn.', 'Không cần. Muốn thì làm tròn số hoặc để 5–10 % khi phục vụ rất tốt.'],
          ['Nước lọc', 'tap water, miễn phí, cứ xin', 'thường mang sẵn ly nước đá', 'tap water, miễn phí, nhiều nơi mang sẵn bình'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc ở quán ăn. **Nhật**: không có văn hoá tip; để tiền lại bàn có khi nhân viên chạy theo trả lại. **Việt Nam**: tip không bắt buộc, nhưng khăn lạnh, đậu phộng trên bàn thường bị tính tiền.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-a1-02 · Coffee, Please!** — gọi cà phê đá ở một quán nhỏ: nóng hay đá, cỡ ly, hỏi giá. Mức A1, nghe trước bài Nói để khởi động.',
          '**en-ds-a1-03 · A Table for Two** — vào nhà hàng không đặt trước, xin bàn, nhờ gợi ý món, báo dị ứng đậu phộng, mời bạn một bữa.',
          '**en-ds-b1-01 · This Isn\'t What We Ordered** — chờ quá lâu, mang nhầm món, súp nguội: phàn nàn ba lần mà vẫn lịch sự. Mức B1, nghe **sau** bài Nói hôm nay.',
          'Ba tập này là ba chuyện khác với ba cảnh của Ngân. Nghe để gặp lại would like, some / any và cách xin hoá đơn trong ngữ cảnh mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd4-noi',
    kind: 'speaking',
    title: 'Gọi món, đổi món, phàn nàn nhẹ',
    goal: 'Gọi đồ uống và món ăn lịch sự, báo dị ứng rõ ràng, đổi món, phàn nàn nhẹ nhàng khi món có vấn đề và xin hoá đơn, dùng đúng would like, some / any.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**Sáu bước** của một bữa ăn ở quán, và câu cần nói ở từng bước.',
          '**28 câu mẫu**: gọi món, hỏi thành phần, báo dị ứng, đổi món, phàn nàn nhẹ, xin hoá đơn, trả tiền. Bấm loa, **nói to theo**.',
          'Ngữ pháp: **I\'d like… / Can I have…?**, **some / any**, danh từ **đếm được và không đếm được** (a muffin nhưng some water).',
          'Phàn nàn **nhẹ mà hiệu quả**: không cáu, không im lặng chịu đựng.',
          'Cách gọi phục vụ, đặt dao nĩa, cụng ly ở Anh – Mỹ – Úc và Nhật khác Việt Nam thế nào. Cuối bài: nhập vai ở quán burger.',
        ],
      },

      { t: 'h', text: '1. Một bữa ở quán: 6 bước' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Từ lúc vào tới lúc về',
        caption: 'Bước 3 là chỗ người Việt hay bỏ qua: **báo dị ứng hoặc yêu cầu đặc biệt ngay lúc gọi món**, đừng đợi món ra rồi mới nói.',
        steps: [
          { label: '1. Xin bàn', sub: 'A table for three, please.' },
          { label: '2. Gọi đồ uống', sub: 'Could I have a flat white, please?' },
          { label: '3. Gọi món + yêu cầu', sub: "I'd like the fish. I'm allergic to nuts." },
          { label: '4. Trong bữa', sub: 'Could we get some more water?' },
          { label: '5. Xin hoá đơn', sub: 'Could we get the bill, please?' },
          { label: '6. Trả tiền, chào', sub: 'Thanks, the food was lovely!' },
        ],
      },

      { t: 'h', text: '2. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo đúng thứ tự một bữa ăn. Câu nào có chỗ "…" thì thay tên món của bạn vào. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Could I see the menu, please?', pos: 'phr', ipa: '/kʊd aɪ ˈsiː ðə ˈmenjuː pliːz/', vi: 'Cho tôi xem thực đơn được không?', ex: 'Hi! Could I see the menu, please?', exVi: 'Chào anh! Cho em xem thực đơn được không ạ?', anh: 'fork-and-knife-with-plate' },
          { w: "What's good here?", pos: 'phr', ipa: '/ˈwʌts ˈɡʊd hɪr/', vi: 'Ở đây món gì ngon?', ex: "It's my first time here. What's good?", exVi: 'Lần đầu em tới đây. Món gì ngon ạ?', more: 'Thân hơn "What do you recommend?". Nhân viên rất thích được hỏi câu này.' },
          { w: "What's in it?", pos: 'phr', ipa: '/ˈwʌts ˈɪn ɪt/', vi: 'Món này có những gì?', ex: "The chef's special? What's in it?", exVi: 'Món đặc biệt của bếp trưởng ạ? Trong đó có gì?' },
          { w: "What's the difference?", pos: 'phr', ipa: '/ˈwʌts ðə ˈdɪfrəns/', vi: 'Hai cái khác nhau thế nào?', ex: "Long black or short black? What's the difference?", exVi: 'Long black hay short black? Khác nhau thế nào ạ?' },
          { w: "I'd like the…, please.", pos: 'phr', ipa: '/aɪd ˈlaɪk ðə … pliːz/', vi: 'Cho tôi món…', ex: "I'd like the barramundi, please.", exVi: 'Cho em món cá barramundi.', more: '**I\'d like** = I would like (muốn, lịch sự). Khác **I like** (tôi thích).' },
          { w: 'Can I have a…, please?', pos: 'phr', ipa: '/kən aɪ ˈhæv ə … pliːz/', vi: 'Cho tôi một…', ex: 'Can I have a flat white, please?', exVi: 'Cho em một ly flat white.', anh: 'hot-beverage' },
          { w: "I'll have the same.", pos: 'phr', ipa: '/aɪl ˈhæv ðə ˈseɪm/', vi: 'Cho tôi món giống vậy.', ex: "The lamb sounds good. I'll have the same.", exVi: 'Món cừu nghe ngon đấy. Cho em giống vậy.' },
          { w: 'a jug of tap water', pos: 'n', ipa: '/ə ˌdʒʌɡ əv ˈtæp ˌwɔːtər/', vi: 'một bình nước lọc (miễn phí)', ex: 'Could we get a jug of tap water, please?', exVi: 'Cho bọn em một bình nước lọc ạ.', more: 'Phục vụ hay hỏi **Still or sparkling?** (không ga hay có ga). Hai loại đó là nước đóng chai, **tính tiền**.', anh: 'potable-water' },
          { w: "I'm allergic to…", pos: 'phr', ipa: '/aɪm əˈlɝːdʒɪk tə/', vi: 'Tôi dị ứng với…', ex: "I'm allergic to shellfish.", exVi: 'Em dị ứng hải sản có vỏ.', more: 'shellfish (tôm cua sò) · peanuts (đậu phộng) · nuts (các loại hạt) · dairy (sữa) · gluten.', anh: 'shrimp' },
          { w: 'Does it have any… in it?', pos: 'phr', ipa: '/dʌz ɪt hæv ˈeni … ɪn ɪt/', vi: 'Món này có … không?', ex: 'Does it have any nuts in it?', exVi: 'Món này có hạt không ạ?', anh: 'peanuts' },
          { w: 'without onion · no onion', pos: 'phr', ipa: '/wɪˈðaʊt ˈʌnjən/', vi: 'bỏ hành', ex: 'Could I have the salad without onion?', exVi: 'Salad cho em bỏ hành được không ạ?', more: 'Thêm: **extra** cheese (thêm phô mai) · **less** sugar (ít đường).', anh: 'onion' },
          { w: 'on the side', pos: 'phr', ipa: '/ɑːn ðə ˈsaɪd/', vi: 'để riêng ra (sốt, nước chấm)', ex: 'Could I have the sauce on the side?', exVi: 'Cho em sốt để riêng được không ạ?' },
          { w: 'Is it spicy?', pos: 'phr', ipa: '/ɪz ɪt ˈspaɪsi/', vi: 'Món này có cay không?', ex: 'Is it spicy? I can only eat a little chilli.', exVi: 'Món này cay không ạ? Em chỉ ăn được ít ớt.', more: 'Ở Úc, Anh "a little spicy" có khi **rất nhẹ** so với khẩu vị Việt.', anh: 'hot-pepper' },
          { w: 'medium-rare', pos: 'adj', ipa: '/ˌmiːdiəm ˈrer/', vi: 'tái vừa (bít tết)', ex: "I'll have the steak, medium-rare.", exVi: 'Cho tôi bít tết, tái vừa.', more: 'rare (tái) → medium-rare → medium (chín vừa) → well done (chín kỹ).', anh: 'cut-of-meat' },
          { w: 'to share', pos: 'phr', ipa: '/tə ˈʃer/', vi: 'để ăn chung', ex: "Shall we get some garlic bread to share?", exVi: 'Mình gọi bánh mì bơ tỏi ăn chung nhé?' },
          { w: 'Actually, could I change my order?', pos: 'phr', ipa: '/ˈæktʃuəli kʊd aɪ ˈtʃeɪndʒ maɪ ˈɔːrdər/', vi: 'À thôi, cho tôi đổi món được không?', ex: 'Sorry! Actually, could I change my order?', exVi: 'Xin lỗi! À thôi, cho em đổi món được không ạ?', more: 'Đổi càng sớm càng tốt, trước khi bếp làm.' },
          { w: 'Could I swap the chips for a salad?', pos: 'phr', ipa: '/kʊd aɪ ˈswɑːp ðə ˈtʃɪps fər ə ˈsæləd/', vi: 'Đổi khoai chiên thành salad được không?', ex: 'Could I swap the chips for a salad, please?', exVi: 'Cho em đổi khoai chiên thành salad được không ạ?', more: '**swap A for B** = bỏ A, lấy B.', anh: 'green-salad' },
          { w: 'Excuse me!', pos: 'phr', ipa: '/ɪkˈskjuːz mi/', vi: 'Anh/chị ơi! (gọi phục vụ)', ex: 'Excuse me! Could we get some more water?', exVi: 'Anh ơi! Cho bọn em thêm nước được không ạ?' },
          { w: "Sorry, this is a bit too salty for me.", pos: 'phr', ipa: '/ˈsɑːri ðɪs ɪz ə bɪt tuː ˈsɔːlti fər mi/', vi: 'Xin lỗi, món này hơi mặn so với tôi.', ex: 'Sorry, this is a bit too salty for me. Could I get something else?', exVi: 'Xin lỗi, món này hơi mặn với em. Em đổi món khác được không ạ?', more: '**a bit** + **for me** làm câu chê nhẹ đi rất nhiều.', anh: 'salt' },
          { w: 'I asked for no ice.', pos: 'phr', ipa: '/aɪ ˈæskt fər ˌnoʊ ˈaɪs/', vi: 'Tôi đã dặn không đá.', ex: 'Excuse me, sorry. I asked for no ice, but there\'s ice in it.', exVi: 'Anh ơi, xin lỗi. Em dặn không đá, mà trong ly có đá.', anh: 'ice' },
          { w: 'Could I get another fork, please?', pos: 'phr', ipa: '/kʊd aɪ ɡet əˈnʌðər ˈfɔːrk pliːz/', vi: 'Cho tôi xin cái nĩa khác được không?', ex: 'Sorry, I dropped my fork. Could I get another one?', exVi: 'Xin lỗi, em làm rơi nĩa. Cho em xin cái khác được không ạ?', anh: 'fork-and-knife' },
          { w: "This is really good!", pos: 'phr', ipa: '/ðɪs ɪz ˈrɪəli ˈɡʊd/', vi: 'Món này ngon thật!', ex: 'How is everything? — This is really good, thanks!', exVi: 'Mọi thứ ổn chứ ạ? — Ngon lắm, cảm ơn anh!', more: 'Phục vụ hỏi **How is everything?** giữa bữa: trả lời ngắn, hoặc nói luôn vấn đề nếu có.', anh: 'face-savoring-food' },
          { w: 'Could we get the bill, please?', pos: 'phr', ipa: '/kʊd wi ɡet ðə ˈbɪl pliːz/', vi: 'Cho chúng tôi xin hoá đơn.', ex: "Excuse me. Could we get the bill, please?", exVi: 'Chị ơi. Cho bọn em xin hoá đơn ạ.', more: 'Mỹ: **Could we get the check?**', anh: 'receipt' },
          { w: 'Can we split the bill?', pos: 'phr', ipa: '/kən wi ˈsplɪt ðə ˈbɪl/', vi: 'Tách hoá đơn được không?', ex: 'Can we split the bill? Two separate payments.', exVi: 'Tách hoá đơn được không ạ? Hai người trả riêng.' },
          { w: 'Do you take cards?', pos: 'phr', ipa: '/də ju ˈteɪk ˈkɑːrdz/', vi: 'Quán có nhận thẻ không?', ex: 'Do you take cards? — Yes, just tap here.', exVi: 'Quán nhận thẻ không ạ? — Có, chạm thẻ vào đây.', anh: 'credit-card' },
          { w: "It's my treat. · My shout. (Úc)", pos: 'phr', ipa: '/ɪts maɪ ˈtriːt · maɪ ˈʃaʊt/', vi: 'Để tôi mời. / Để tôi trả.', ex: "Put your card away. It's my treat.", exVi: 'Cất thẻ đi. Để mình mời.', more: 'Người kia đáp: **Thanks! Next one\'s on me.** (Lần sau mình mời.)' },
          { w: 'Could I get a box for this?', pos: 'phr', ipa: '/kʊd aɪ ɡet ə ˈbɑːks fər ðɪs/', vi: 'Cho tôi hộp đựng mang phần thừa về được không?', ex: "I can't finish it. Could I get a box for this?", exVi: 'Em ăn không hết. Cho em xin hộp mang về được không ạ?', more: 'Mang đồ thừa về là chuyện bình thường ở Mỹ và Úc.', anh: 'takeout-box' },
          { w: 'itemised receipt', pos: 'n', ipa: '/ˈaɪtəmaɪzd rɪˈsiːt/', vi: 'hoá đơn ghi từng món', ex: "Could I get an itemised receipt? It's for work.", exVi: 'Cho em xin hoá đơn ghi từng món được không ạ? Em cần cho công việc.', more: 'Đi công tác: luôn xin, công ty cần để hoàn tiền.' },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Đi ăn với **bạn cùng nhóm** khác đi ăn với **khách hàng** như Kate. Nói với **nhân viên quán** thì dùng cột giữa là chuẩn: lịch sự, ngắn, có **please**.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân', 'Trung tính', 'Trang trọng'],
        rows: [
          ['Gọi món', 'Can I get a flat white?', 'Could I have a flat white, please?', "I'd like a flat white, please."],
          ['Xin thêm', 'More water, please!', 'Could we get some more water, please?', 'Would it be possible to have some more water?'],
          ['Đổi món', 'Actually, can I switch to the fish?', 'Sorry, could I change my order?', "I'm so sorry. Would it be possible to change my order?"],
          ['Phàn nàn nhẹ', 'Hmm, this is kind of cold.', 'Sorry, this is a bit cold. Could you warm it up?', "I'm sorry to mention it, but this seems a little cold."],
          ['Xin hoá đơn', 'Bill, please!', 'Could we get the bill, please?', 'Could we have the bill when you have a moment?'],
          ['Mời trả tiền', 'I got this.', "It's my treat.", 'Please, let me take care of this.'],
        ],
        caption: '**Can I get…?** người Mỹ dùng hằng ngày, nhưng một số người Anh thấy hơi cộc. **Could I have…, please?** thì an toàn ở mọi nơi.',
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Phàn nàn nhẹ: 3 bước',
        caption: 'Cứng rắn với **vấn đề**, tử tế với **con người**. Người phục vụ thường không phải người gây ra lỗi.',
        cols: [
          {
            title: '❌ Nặng lời hoặc im lặng',
            anh: 'face-with-steam-from-nose',
            items: [
              'This is too salty. I don\'t eat this.',
              'Why is there ice? I said no ice!',
              '(im lặng ăn cho hết, rồi không bao giờ quay lại)',
            ],
          },
          {
            title: '✅ Xin lỗi mở lời → nói vấn đề → nói điều mình muốn',
            anh: 'slightly-smiling-face',
            items: [
              'Sorry, this is a bit too salty for me. Could I get something else?',
              'Excuse me, I asked for no ice. Could I get a new one?',
              "Thanks so much. (khi họ sửa xong)",
            ],
          },
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Ở quán, gần như mọi câu bạn nói đều là **xin một thứ**. Tiếng Việt chỉ cần "Cho em…". Tiếng Anh có hai khung lịch sự: **I\'d like…** và **Can / Could I have…?** Và trước tên món, bạn phải chọn **a / an**, **some** hay **any**: chọn đúng hay sai phụ thuộc vào món đó **đếm được** hay **không đếm được**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: "I'd like + a / an / the + N",
            vi: 'Gọi món lịch sự. I\'d like = I would like.',
            examples: [
              { en: "I'd like a muffin, please.", vi: 'Cho em một cái muffin.' },
              { en: "I'd like the barramundi, please.", vi: 'Cho em món cá barramundi.' },
              { en: "I'd like some water, please.", vi: 'Cho em ít nước.' },
            ],
          },
          {
            formula: "I'd like + to V",
            vi: 'Muốn làm một việc: gọi món, trả tiền, đặt bàn.',
            examples: [
              { en: "I'd like to order now.", vi: 'Em muốn gọi món luôn ạ.' },
              { en: "I'd like to pay by card.", vi: 'Em muốn trả bằng thẻ.' },
              { en: "We'd like to share the garlic bread.", vi: 'Bọn em muốn ăn chung bánh mì bơ tỏi.' },
            ],
          },
          {
            formula: 'Can / Could I have + N, please?',
            vi: 'Xin một thứ. Could lịch sự hơn Can một chút.',
            examples: [
              { en: 'Can I have two coffees, please?', vi: 'Cho em hai ly cà phê.' },
              { en: 'Could I have the salad without onion?', vi: 'Salad cho em bỏ hành được không ạ?' },
              { en: 'Could we have the bill, please?', vi: 'Cho bọn em xin hoá đơn.' },
            ],
          },
          {
            formula: 'Would you like + N / to V? → Yes, please. / No, thanks.',
            vi: 'Câu phục vụ hỏi bạn. Đáp **Yes, please** chứ không đáp "Yes, I would like".',
            examples: [
              { en: 'Would you like some bread? — Yes, please.', vi: 'Bạn dùng bánh mì không? — Có, cảm ơn.' },
              { en: 'Would you like a drink to start? — No, thanks.', vi: 'Bạn uống gì trước không? — Không, cảm ơn.' },
              { en: 'Would you like to see the dessert menu?', vi: 'Bạn có muốn xem thực đơn tráng miệng không?' },
            ],
          },
          {
            formula: 'some (khẳng định, lời xin, lời mời) · any (câu hỏi, phủ định)',
            vi: 'Không cần biết "bao nhiêu" thì dùng some / any.',
            examples: [
              { en: 'Do you have any oat milk?', vi: 'Quán có sữa yến mạch không?' },
              { en: "We haven't got any blueberry muffins left.", vi: 'Hết muffin việt quất rồi.' },
              { en: 'Could we get some more napkins?', vi: 'Cho bọn em thêm ít khăn giấy.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Loại', 'Ví dụ', 'Đi với', 'Muốn đếm thì nói'],
        rows: [
          ['Đếm được', 'a muffin · an egg · two prawns · three coffees (= ba ly)', 'a / an · số · some / any + số nhiều', 'two muffins · some prawns'],
          ['Không đếm được', 'water · milk · rice · bread · sugar · salt · tea · coffee (chất)', 'some / any · **không** có a / an, **không** thêm -s', 'a **glass** of water · a **bowl** of rice · a **slice** of bread · a **cup** of tea · a **piece** of cake'],
        ],
        caption: 'Ở quán, "**a coffee**", "**two teas**" vẫn đúng: người ta hiểu là "một ly", "hai tách". Nhưng **rice, bread, water** thì không nói "a rice", "two breads". Hỏi số lượng: **How many** + đếm được · **How much** + không đếm được (Ngày 5 học kỹ).',
      },
      {
        t: 'rule',
        formula: "I'd like / Could I have + a / an + N đếm được số ít · some / any + N số nhiều hoặc không đếm được",
        vi: 'Gọi một thứ đếm được thì có a / an. Gọi chất lỏng, gạo, bánh mì thì dùng some, hoặc đếm bằng ly, bát, lát. Hỏi và phủ định đổi some thành any, trừ khi đang xin hoặc mời.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: with / without, and… as well, actually',
        items: [
          '**with / without** gắn yêu cầu vào món: "A flat white **with** oat milk." · "The salad **without** onion." Không cần câu thứ hai.',
          '**and… as well** (cũng, thêm nữa) đặt ở cuối câu: "**And** a muffin **as well**, please." Nghe tự nhiên hơn "and also a muffin".',
          '**Actually** ở đầu câu = "à thôi", báo mình đổi ý: "**Actually**, could I change the chips to a salad?" Từ này lịch sự hơn hẳn nói "No, no, change!".',
          '**but** của Ngày 3 cũng dùng ở đây: "I\'d like the pasta, **but** I\'m allergic to shellfish."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd4-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "I'd like… · Could I have…? · some / any · with / without · actually",
        items: [
          { q: 'Cho em một ly flat white với sữa yến mạch.', hint: "I'd like / can I have, with oat milk", answers: ["I'd like a flat white with oat milk, please.", "Can I have a flat white with oat milk, please?", "Could I have a flat white with oat milk, please?", "I'd like a flat white with oat milk.", "Can I have a flat white with oat milk?", "Could I have a flat white with oat milk?", "Can I get a flat white with oat milk, please?"] },
          { q: 'Quán có sữa đậu nành không?', hint: 'do you have any', answers: ['Do you have any soy milk?', 'Have you got any soy milk?', 'Do you have soy milk?'] },
          { q: 'Em dị ứng đậu phộng.', hint: 'allergic to', answers: ["I'm allergic to peanuts.", 'I am allergic to peanuts.'] },
          { q: 'Salad cho em bỏ hành được không ạ?', hint: 'could I have, without', answers: ['Could I have the salad without onion?', 'Could I have the salad without onions?', 'Could I have the salad without onion, please?', 'Can I have the salad without onion?', 'Can I have the salad without onions?', 'Could I get the salad without onion?'] },
          { q: 'À thôi, cho em đổi khoai chiên thành salad được không?', hint: 'actually, swap … for', answers: ['Actually, could I swap the chips for a salad?', 'Actually, could I swap the fries for a salad?', 'Actually, can I swap the chips for a salad?', 'Actually, could I change the chips to a salad?', 'Actually, could I have a salad instead of chips?', 'Actually, could I swap the chips for a salad, please?', 'Actually, could I have a salad instead of the chips?'] },
          { q: 'Cho bọn em xin hoá đơn ạ.', hint: 'could we get / have', answers: ['Could we get the bill, please?', 'Could we have the bill, please?', 'Can we get the bill, please?', 'Can we have the bill, please?', 'Could we get the check, please?', 'Could we have the check, please?'] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 9 lỗi thật',
        items: [
          '~~I want a coffee.~~ → **Could I have a coffee, please?** / **I\'d like a coffee, please.** "I want" nghe như trẻ con đòi quà. Người lớn gọi món bằng would like hoặc Could I have.',
          '~~Give me the menu.~~ → **Could I see the menu, please?** Câu mệnh lệnh với nhân viên nghe rất hách dịch, dù bạn không có ý đó.',
          '~~"Em ơi!" (gọi to qua phòng) · huýt sáo · búng tay · vỗ tay~~ → **nhìn vào mắt phục vụ, giơ nhẹ tay, nói "Excuse me!"** Ở Anh, Mỹ, Úc, gọi to hay búng tay là bất lịch sự.',
          '~~I\'m allergy with shrimp.~~ → **I\'m allergic to prawns / shrimp.** allergy là danh từ (I have a shrimp allergy), allergic là tính từ và đi với **to**.',
          '~~Can I have a rice? · two breads~~ → **some rice · a bowl of rice · two slices of bread · two bread rolls.** rice, bread, water không đếm được.',
          '~~Calculate money, please. · Pay money!~~ → **Could we get the bill, please?** Dịch thẳng "tính tiền" thì người nghe không hiểu.',
          '~~This food is very delicious.~~ → **This is really good!** / **This is delicious!** "delicious" đã là "rất ngon", thêm very nghe lạ tai.',
          '~~It\'s too salty. I don\'t eat.~~ → **Sorry, this is a bit too salty for me. Could I get something else?** Có Sorry, a bit, for me và một yêu cầu rõ ràng.',
          '~~Can you make it no ice?~~ → **No ice, please.** / **Could I have it without ice?** Ngắn hơn và đúng hơn.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể ở bàn ăn' },
      {
        t: 'p',
        text: 'Ở quán, cử chỉ nói thay bạn rất nhiều: gọi phục vụ, báo đã ăn xong, xin hoá đơn từ xa. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ ở quán ăn',
        items: [
          { anh: 'raised-hand', w: 'Excuse me!', ro: '/ɪkˈskjuːz mi/', vi: 'Giơ tay ngang vai, chờ phục vụ nhìn thấy rồi mới nói. Không búng tay, không huýt sáo, không gọi to qua phòng.' },
          { anh: 'writing-hand', w: 'Could we get the bill, please?', ro: '/kʊd wi ɡet ðə ˈbɪl/', vi: 'Làm động tác ký lên lòng bàn tay khi phục vụ ở xa = xin hoá đơn. Ở Anh, Mỹ, Úc ai cũng hiểu.' },
          { anh: 'backhand-index-pointing-down', w: 'This one, please.', ro: '/ˈðɪs wʌn pliːz/', vi: 'Không đọc được tên món thì chỉ vào thực đơn. Chỉ vào thực đơn thì được, chỉ vào người thì không.' },
          { anh: 'face-savoring-food', w: 'This is really good!', ro: '/ðɪs ɪz ˈrɪəli ˈɡʊd/', vi: 'Phục vụ hỏi "How is everything?" thì gật đầu, cười, nói câu ngắn. Không cần khen dài.' },
          { anh: 'fork-and-knife', w: "I'm finished, thanks.", ro: '/aɪm ˈfɪnɪʃt θæŋks/', vi: 'Đặt dao và nĩa **song song** trên đĩa = đã ăn xong, có thể dọn. Để hai bên đĩa = đang ăn dở.' },
          { anh: 'clinking-glasses', w: 'Cheers!', ro: '/tʃɪrz/', vi: 'Cụng ly ở Anh, Úc: **nhìn vào mắt** người mình cụng. Với khách Nhật: chờ người chủ tiệc nâng ly trước, cùng nói "Kanpai".' },
          { anh: 'person-gesturing-no', w: "No, thanks. I'm fine.", ro: '/noʊ θæŋks aɪm ˈfaɪn/', vi: 'Từ chối món mời thêm: lắc đầu nhẹ, cười, nói câu này. Không cần giải thích.' },
          { anh: 'chopsticks', w: '(đừng làm) cắm đũa thẳng vào bát cơm', ro: '', vi: 'Người Nhật cũng kiêng như Việt Nam (giống nén hương ở đám tang). Đi ăn với khách Nhật thì đặt đũa nằm ngang trên bát hoặc giá đũa.' },
          { anh: 'credit-card', w: 'Can I tap?', ro: '/kən aɪ ˈtæp/', vi: 'Ở Úc, Anh: chạm thẻ là xong. Ở Nhật: đặt thẻ hoặc tiền lên **khay nhỏ** ở quầy, không đưa thẳng vào tay.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Gọi phục vụ', 'Gọi to "Em ơi!" là bình thường.', 'Nhìn mắt, giơ nhẹ tay, "Excuse me". Phục vụ thường **tự đến hỏi** giữa bữa.', 'Nói to "Sumimasen!" là bình thường. Nhiều quán có nút bấm trên bàn.'],
          ['Ai trả tiền', 'Giành nhau trả, hoặc người lớn tuổi, chức cao trả.', 'Đồng nghiệp thường **trả phần ai nấy**. Ai mời thì nói rõ: "It\'s my treat."', 'Hay chia đều. Đi với sếp thì sếp thường trả, cấp dưới cảm ơn lần nữa vào hôm sau.'],
          ['Ăn có tiếng', 'Húp phở xì xụp là bình thường.', 'Ăn có tiếng, nói khi miệng đầy bị coi là **mất lịch sự**.', 'Húp mì có tiếng là bình thường, còn là khen ngon.'],
          ['Tăm xỉa răng', 'Xỉa răng ngay tại bàn.', 'Không xỉa răng ở bàn. Cần thì vào nhà vệ sinh.', 'Che miệng bằng tay, hoặc không dùng ở bàn.'],
          ['Đồ trên bàn', 'Khăn lạnh, đậu phộng thường bị tính tiền.', 'Nước lọc, bánh mì kèm (nếu có) thường miễn phí. Phục vụ sẽ hỏi trước những thứ tính tiền.', 'Khăn ướt và trà thường miễn phí.'],
        ],
        caption: 'Tiếp khách Nhật ở Việt Nam: nhớ hỏi trước về dị ứng và món kiêng, và **nói rõ ai mời** để khách khỏi lúng túng lúc thanh toán.',
      },

      { t: 'h', text: '7. Phát âm: tên món, âm câm, I\'d like ≠ I like' },
      {
        t: 'p',
        text: 'Ba bẫy của hôm nay: **I\'d like** phải giữ âm **/d/**, không thì thành **I like** (tôi thích). Tên món có **âm câm**: receipt không đọc **p**. Và **bill** /bɪl/ với **beer** /bɪr/ rất dễ lẫn: nói "Could we get the beer?" là bạn sẽ được thêm bia thay vì hoá đơn.',
      },
      {
        t: 'phatam',
        id: 'gtd4-phat-am',
        title: 'Luyện phát âm — gọi món, âm câm, từ dễ lẫn',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Đọc chậm từng từ khó trước, rồi đọc cả câu một hơi.',
        items: [
          { text: 'Can I have a flat white, please?', ipa: 'kən aɪ hæv ə flæt waɪt pliːz', vi: 'can đọc nhẹ /kən/ · nối Can‿I‿have‿a · flat white: /t/ đầu đọc rất nhẹ' },
          { text: "I'd like the barramundi, please.", ipa: 'aɪd laɪk ðə ˌbærəˈmʌndi pliːz', vi: 'giữ /d/ trong I\'d · barramundi nhấn âm MUN' },
          { text: "I'm allergic to shellfish.", ipa: 'aɪm əˈlɝːdʒɪk tə ˈʃelfɪʃ', vi: 'allergic nhấn âm thứ hai: a-LER-gic · shellfish có /ʃ/ ở đầu và cuối' },
          { text: 'Could I see the menu?', ipa: 'kʊd aɪ siː ðə ˈmenjuː', vi: 'menu: MEN-yoo, không đọc "mơ-nu" · nối Could‿I' },
          { text: 'Could I get a receipt?', ipa: 'kʊd aɪ ɡet ə rɪˈsiːt', vi: 'receipt: chữ p câm, đọc "ri-xít" · nối get‿a' },
          { text: 'Some water, please.', ipa: 'səm ˈwɔːtər pliːz', vi: 'some đọc nhẹ /səm/ · Anh: "uo-tơ", Mỹ: t mềm gần như "đ"' },
          { text: 'No onion, please.', ipa: 'noʊ ˈʌnjən pliːz', vi: 'onion: ÚN-yần, không đọc "ô-ni-ôn"' },
          { text: 'Could we get the bill, please?', ipa: 'kʊd wi ɡet ðə bɪl pliːz', vi: 'bill: /ɪ/ ngắn và /l/ cuối, khác hẳn beer /bɪr/' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: quán burger, đổi món và một ly đá' },
      {
        t: 'dialogue',
        title: 'Ở một quán burger tại Melbourne — Ngân gọi món, đổi ý, rồi phàn nàn nhẹ',
        lines: [
          { who: 'Staff', role: 'b', text: 'Hi there! Ready to order?', vi: 'Chào chị! Chị gọi món luôn chứ ạ?' },
          { who: 'Ngân', role: 'a', text: "Yes, please. I'd like the chicken burger, please.", vi: 'Vâng ạ. Cho em một burger gà.' },
          { who: 'Staff', role: 'b', text: 'Sure. Would you like chips or a salad with that?', vi: 'Được ạ. Chị ăn kèm khoai chiên hay salad?' },
          { who: 'Ngân', role: 'a', text: 'Chips, please. And could I have a lemonade with no ice?', vi: 'Khoai chiên ạ. Cho em thêm một ly lemonade, không đá.' },
          { who: 'Staff', role: 'b', text: 'No problem. Anything else?', vi: 'Được ạ. Chị còn gọi gì nữa không?' },
          { who: 'Ngân', role: 'a', text: 'Actually, could I swap the chips for a salad? Sorry!', vi: 'À thôi, cho em đổi khoai chiên thành salad được không ạ? Em xin lỗi!' },
          { who: 'Staff', role: 'b', text: "Not a problem. A salad instead of chips. That's twenty-two fifty.", vi: 'Không sao ạ. Salad thay khoai chiên. Tổng cộng hai mươi hai đô năm mươi.' },
          { who: 'Ngân', role: 'a', text: 'Excuse me, sorry. I asked for no ice, but there\'s ice in my lemonade.', vi: 'Anh ơi, xin lỗi. Em dặn không đá mà ly lemonade của em có đá.' },
          { who: 'Staff', role: 'b', text: "Oh, sorry about that! I'll get you a new one.", vi: 'Ồ, xin lỗi chị! Tôi làm ly khác cho chị.' },
          { who: 'Ngân', role: 'a', text: 'Thanks so much. And the burger is really good!', vi: 'Cảm ơn anh nhiều. Burger ngon lắm ạ!' },
          { who: 'Staff', role: 'b', text: 'Glad you like it! Enjoy.', vi: 'Chị thích là tốt rồi! Chúc chị ngon miệng.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd4-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Ngân (5 câu)',
        items: [
          { vi: 'Staff: "Ready to order?" → Bạn: Vâng. Cho em một burger gà.', chips: ['Yes,', 'please.', "I'd", 'like', 'the', 'chicken', 'burger.', 'want', 'a', 'any'], answer: ['Yes,', 'please.', "I'd", 'like', 'the', 'chicken', 'burger.'] },
          { vi: 'Cho em một ly lemonade, không đá.', chips: ['Could', 'I', 'have', 'a', 'lemonade', 'with', 'no', 'ice?', 'some', 'any'], answer: ['Could', 'I', 'have', 'a', 'lemonade', 'with', 'no', 'ice?'] },
          { vi: 'À thôi, cho em đổi khoai chiên thành salad được không?', chips: ['Actually,', 'could', 'I', 'swap', 'the', 'chips', 'for', 'a', 'salad?', 'to', 'some'], answer: ['Actually,', 'could', 'I', 'swap', 'the', 'chips', 'for', 'a', 'salad?'] },
          { vi: 'Xin lỗi. Em dặn không đá.', chips: ['Sorry.', 'I', 'asked', 'for', 'no', 'ice.', 'any', 'said'], answer: ['Sorry.', 'I', 'asked', 'for', 'no', 'ice.'] },
          { vi: 'Burger ngon lắm ạ!', chips: ['The', 'burger', 'is', 'really', 'good!', 'very', 'delicious'], answer: ['The', 'burger', 'is', 'really', 'good!'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd4-noi-tra-loi',
        part: '1',
        questions: [
          "Hi there! What can I get you to drink?",
          'And what would you like to eat?',
          'Do you have any allergies we should know about?',
          'How is everything?',
          'Would you like anything else, or just the bill?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đoạn đề bài dưới đây. Mục tiêu: gọi đủ đồ uống + món, **báo một dị ứng**, **đổi món một lần**, **phàn nàn nhẹ một lần** và xin hoá đơn.',
          '"You are a friendly waiter at a casual restaurant in Melbourne, Australia. I am a customer from Vietnam. Use some Australian phrases like \'What are you after?\' and \'No worries\', but explain them if I ask. Ask what I would like to drink (still, sparkling or tap water) and what I would like to eat. When I order, mention that one dish has nuts or prawn stock in the sauce, and wait for me to ask about allergies. Later, bring my drink with ice even if I asked for no ice, and see if I complain politely. At the end, tell me there is a 10% Sunday surcharge. Speak at A2 level. After the meal, tell me in Vietnamese: which requests were polite, which sounded too direct (like \'I want…\' or \'Give me…\'), and every mistake with a / an / some / any."',
          'Lượt hai: đổi vai. Bạn là phục vụ, AI là khách. Bạn phải hỏi về dị ứng, đọc lại đơn ("So that\'s…") và báo phụ phí trước khi tính tiền.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd4-viet',
    kind: 'writing',
    title: 'Đặt bàn, nhắn rủ đi ăn, đánh giá quán',
    goal: 'Viết được tin đặt bàn kèm yêu cầu đặc biệt, tin rủ đồng nghiệp và thư mời khách đi ăn, trả lời lời rủ, và một đánh giá quán ngắn có khen có góp ý, ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài viết hôm nay',
        items: [
          'Ngày cuối ở Melbourne, Ngân muốn **mời chị Kate và cả nhóm đi ăn tối cảm ơn**. Cô phải đặt bàn, rủ Kevin, gửi thư mời Kate, rồi về khách sạn viết **đánh giá quán** trên bản đồ.',
          'Bốn mẫu, mỗi mẫu hai bản đặt cạnh nhau: **thân mật** (đồng nghiệp, quán quen) và **trang trọng** (khách hàng, nhà hàng lớn).',
          'Dùng lại khung của Ngày 2: **on + thứ / ngày · at + giờ · for + số người**, và câu hỏi chốt "Is that okay?".',
          'Dùng lại **would like** và **some / any** của bài Nói: "We would like to book…" · "Do you have any vegetarian options?"',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu tin, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Đặt bàn',
        caption: 'Đủ 4 thông tin: **số người · ngày · giờ · tên**. Dị ứng, ghế trẻ em, sinh nhật ghi vào phần **yêu cầu đặc biệt** ngay lúc đặt.',
        cols: [
          {
            title: 'Thân mật (nhắn quán quen qua mạng xã hội)',
            anh: 'speech-balloon',
            items: [
              'Hi! Can I book a table for 5 this Friday at 7 pm?',
              'Name: Ngan. One of us has a shellfish allergy.',
              'Thanks so much!',
            ],
          },
          {
            title: 'Trang trọng (email cho nhà hàng)',
            anh: 'e-mail',
            items: [
              'Dear Sir or Madam,',
              'I would like to book a table for five on Friday 20 November at 7:00 pm, under the name Nguyen.',
              'Please note that one guest has a shellfish allergy. Could the kitchen prepare a shellfish-free option?',
              'Could you please confirm the booking?',
              'Kind regards,',
              'Nguyen Thanh Ngan',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Rủ đi ăn',
        caption: 'Lời rủ tốt có: **đi đâu · khi nào · vì sao hay** và **một câu cho người kia dễ từ chối**.',
        cols: [
          {
            title: 'Thân mật (nhắn Kevin)',
            anh: 'mobile-phone',
            items: [
              'Lunch? 🍜',
              "There's a great dumpling place near the office. 12:30?",
              'No worries if you\'re busy!',
            ],
          },
          {
            title: 'Trang trọng (email mời khách)',
            anh: 'envelope',
            items: [
              'Dear Kate,',
              'Thank you so much for your help this week.',
              'We would like to invite you to dinner on Thursday at 7 pm at Riverside Grill.',
              'Please let me know if this time suits you.',
              'Best regards,',
              'Ngan',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Trả lời lời rủ (nhận lời, hoặc xin đổi giờ)',
        caption: 'Nhận lời thì nhắc lại **giờ và nơi** để chắc chắn. Muốn đổi giờ thì đề nghị **một giờ cụ thể**. Ngày 10 học kỹ cách từ chối.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thumbs-up',
            items: [
              "I'm in! See you there at 12:30.",
              'Or: Sounds great, but can we do 1 pm instead? I have a call at 12.',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'memo',
            items: [
              'Dear Ngan,',
              'Thank you for the kind invitation. I would be delighted to join you on Thursday.',
              'Would it be possible to make it 7:30 pm instead?',
              'Best wishes,',
              'Kate',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Đánh giá quán (trên bản đồ, ứng dụng đặt món)',
        caption: 'Đánh giá hữu ích nói **cụ thể**: món gì, ngon ở đâu, chỗ nào chưa được. Góp ý thì nhẹ nhàng, không nhắc tên nhân viên để chê.',
        cols: [
          {
            title: '⭐⭐⭐⭐⭐ Khen',
            anh: 'star',
            items: [
              'Amazing barramundi and really friendly staff!',
              'Sam checked our allergies twice, which we really appreciated.',
              'Great for groups. Highly recommend!',
            ],
          },
          {
            title: '⭐⭐⭐ Góp ý lịch sự',
            anh: 'thinking-face',
            items: [
              'The coffee was great, but the food took about 40 minutes to arrive.',
              'There was also a small mistake on our bill (fixed quickly).',
              'Nice place, but maybe not when you are in a hurry.',
            ],
          },
        ],
      },

      { t: 'h', text: '2. Khung câu để viết' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Can I / I would like to + book a table for + số người + on + ngày + at + giờ',
            vi: 'Đặt bàn. Thân dùng "Can I book…?", trang trọng dùng "I would like to book…".',
            examples: [
              { en: 'Can I book a table for 5 this Friday at 7 pm?', vi: 'Cho mình đặt bàn 5 người tối thứ Sáu này lúc 7 giờ được không?' },
              { en: 'I would like to book a table for two on Saturday at 12:30 pm.', vi: 'Tôi muốn đặt bàn hai người vào thứ Bảy lúc 12 giờ 30.' },
              { en: 'Do you have any tables for four tonight?', vi: 'Tối nay quán còn bàn bốn người không?' },
            ],
          },
          {
            formula: 'Do you fancy + N / V-ing…? · Are you free for + N…? · Would you like to join us for + N…?',
            vi: 'Rủ đi ăn, từ thân tới trang trọng. "Fancy" là kiểu Anh, Úc.',
            examples: [
              { en: 'Do you fancy dumplings for lunch?', vi: 'Trưa nay đi ăn bánh bao không?' },
              { en: 'Are you free for dinner on Thursday?', vi: 'Tối thứ Năm bạn rảnh đi ăn không?' },
              { en: 'Would you like to join us for dinner on Thursday?', vi: 'Chị có muốn đi ăn tối cùng chúng tôi vào thứ Năm không?' },
            ],
          },
          {
            formula: 'The + món + was + adj, but the + thứ khác + was a bit + adj.',
            vi: 'Đánh giá có khen có góp ý. **a bit** làm lời chê nhẹ đi.',
            examples: [
              { en: 'The coffee was great, but the music was a bit loud.', vi: 'Cà phê ngon, nhưng nhạc hơi to.' },
              { en: 'The lamb was delicious, but the portion was a bit small.', vi: 'Thịt cừu rất ngon, nhưng phần ăn hơi ít.' },
              { en: 'The staff were lovely, but the wait was a bit long.', vi: 'Nhân viên dễ thương, nhưng chờ hơi lâu.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'book a table for + số người + on + ngày + at + giờ · (+ under the name…) · (+ yêu cầu đặc biệt)',
        vi: 'Một tin đặt bàn chỉ cần một câu đủ bốn thông tin. Yêu cầu đặc biệt viết thành câu riêng ngay sau.',
      },
      {
        t: 'table',
        head: ['Viết gì', 'Nên viết', 'Tránh', 'Vì sao'],
        rows: [
          ['Số người', 'a table for 5 · for five people', '5 pax', '"pax" là chữ của ngành nhà hàng, khách sạn ở châu Á. Người Anh, Mỹ, Úc ít dùng khi tự nhắn.'],
          ['Dị ứng', 'One guest has a shellfish allergy.', '(không nói gì, đến nơi mới báo)', 'Nhà hàng cần biết trước để chuẩn bị riêng, nhất là nước dùng, nước sốt.'],
          ['Tên đặt bàn', 'under the name Nguyen', '(chỉ ghi số điện thoại)', 'Tới nơi nhân viên hỏi "What name is it under?"'],
          ['Rủ đi ăn', 'No worries if you\'re busy!', 'You must come!', 'Cho người kia đường lùi, lời rủ dễ được nhận hơn.'],
          ['Khen trong đánh giá', 'Amazing barramundi!', 'Very very good!!!', 'Nói tên món cụ thể mới giúp được người đọc.'],
          ['Chê trong đánh giá', 'The wait was a bit long.', 'TERRIBLE SERVICE!!! Sam is rude!', 'Viết hoa = quát. Chê đích danh nhân viên là bất công và có thể ảnh hưởng việc làm của họ.'],
        ],
        caption: 'Mẹo nhỏ: tin đặt bàn gửi xong thì **chờ quán xác nhận**. Không thấy trả lời trong vài giờ thì gọi điện (Ngày 9 học gọi điện).',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd4-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Cho mình đặt bàn 4 người tối thứ Bảy lúc 7 giờ được không?', chips: ['Can', 'I', 'book', 'a', 'table', 'for', '4', 'on', 'Saturday', 'at', '7 pm?', 'in', 'some'], answer: ['Can', 'I', 'book', 'a', 'table', 'for', '4', 'on', 'Saturday', 'at', '7 pm?'] },
          { vi: 'Một người trong nhóm dị ứng hạt.', chips: ['One', 'guest', 'has', 'a', 'nut', 'allergy.', 'allergic', 'any'], answer: ['One', 'guest', 'has', 'a', 'nut', 'allergy.'] },
          { vi: 'Tối thứ Năm bạn rảnh đi ăn không?', chips: ['Are', 'you', 'free', 'for', 'dinner', 'on', 'Thursday?', 'do', 'at'], answer: ['Are', 'you', 'free', 'for', 'dinner', 'on', 'Thursday?'] },
          { vi: 'Cà phê ngon, nhưng chờ hơi lâu.', chips: ['The', 'coffee', 'was', 'great,', 'but', 'the', 'wait', 'was', 'a', 'bit', 'long.', 'so', 'very'], answer: ['The', 'coffee', 'was', 'great,', 'but', 'the', 'wait', 'was', 'a', 'bit', 'long.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd4-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: 'for + số người · on + ngày · at + giờ · under the name · any',
        items: [
          { q: "I'd like to book a table ___ six people.", answers: ['for'] },
          { q: 'Can we come ___ Friday?', answers: ['on', 'this', 'next'] },
          { q: 'We will arrive ___ 7:30 pm.', answers: ['at', 'by', 'around'] },
          { q: 'The booking is ___ the name Nguyen.', answers: ['under'] },
          { q: 'Do you have ___ vegetarian options?', answers: ['any'] },
          { q: "No ___ if you're busy! (đừng ngại nếu bạn bận)", answers: ['worries'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd4-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "book a table for… on… at… · Are you free for…? · I'm in! · The … was …, but …",
        items: [
          { q: '(Nhắn quán) Cho mình đặt bàn 2 người tối nay lúc 8 giờ được không?', hint: 'can I book, for 2, tonight, at 8 pm', answers: ['Can I book a table for 2 tonight at 8 pm?', 'Can I book a table for two tonight at 8 pm?', 'Can I book a table for 2 tonight at 8?', 'Can I book a table for two tonight at 8?', 'Can I book a table for two for tonight at 8 pm?', 'Could I book a table for two tonight at 8 pm?', 'Can I book a table for 2 at 8 pm tonight?', 'Can I book a table for two at 8 pm tonight?'] },
          { q: '(Email) Xin lưu ý một khách bị dị ứng đậu phộng.', hint: 'please note, one guest, peanut allergy', answers: ['Please note that one guest has a peanut allergy.', 'Please note one guest has a peanut allergy.', 'Please note that one guest is allergic to peanuts.', 'Please note one guest is allergic to peanuts.'] },
          { q: '(Nhắn đồng nghiệp) Trưa nay đi ăn không? 12 giờ nhé?', hint: 'lunch, 12', answers: ['Lunch today? 12 pm?', 'Lunch today? 12?', 'Are you free for lunch today? 12 pm?', 'Are you free for lunch today? 12?', 'Do you fancy lunch today? 12?', 'Lunch? 12 pm?', 'Lunch? 12?', 'Do you want to get lunch today? 12?'] },
          { q: '(Trả lời) Mình đi! Hẹn gặp ở đó.', hint: "I'm in, see you there", answers: ["I'm in! See you there.", 'I am in! See you there.', "I'm in! See you there!", "I'm in. See you there."] },
          { q: '(Đánh giá) Đồ ăn rất ngon, nhưng nhạc hơi to.', hint: 'was delicious / great, but, a bit loud', answers: ['The food was delicious, but the music was a bit loud.', 'The food was great, but the music was a bit loud.', 'The food was really good, but the music was a bit loud.', 'The food was delicious but the music was a bit loud.', 'The food was amazing, but the music was a bit loud.'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Đủ bốn thông tin chưa?** Số người · ngày · giờ · tên. Thiếu một là quán phải nhắn hỏi lại.',
          '**Thứ có khớp ngày không?** (bài học Ngày 2) "Friday 20 November" thì 20/11 phải đúng là thứ Sáu.',
          '**Dị ứng đã ghi chưa?** Ghi bằng chữ, đừng chỉ nói miệng khi tới nơi.',
          '**Đánh giá có câu cụ thể chưa?** Ít nhất một tên món hoặc một chi tiết (giá, chỗ ngồi, thời gian chờ). "Good!" một chữ không giúp ai cả.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd4-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 4',
    goal: 'Làm 35 câu có đáp án để gọi món, báo dị ứng, phàn nàn nhẹ và xin hoá đơn đúng mức lịch sự, dùng đúng a / an / some / any; ôn small talk của Ngày 3 và câu hỏi lại của Ngày 2.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền a / an / some / any · dịch · nghe chép · ghép câu.',
          'Có **5 câu ôn Ngày 2–3** (đánh dấu "Ôn N2", "Ôn N3") trộn trong các phần.',
          'Phần II nhớ quy tắc: đếm được số ít → **a / an**, câu hỏi và phủ định → **any**, xin và mời → **some**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 5. Sai nhiều ở phần I thì đọc lại bảng ba mức lịch sự của bài Nói.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd4-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn muốn gọi một ly cà phê ở quầy. Câu nào lịch sự và tự nhiên nhất?',
            options: ['I want a coffee.', 'Give me a coffee.', 'Could I have a coffee, please?', 'Coffee. Now.'],
            correct: 2,
            why: '**Could I have…, please?** an toàn ở mọi nơi. "I want" và câu mệnh lệnh nghe như đòi hỏi.',
          },
          {
            q: 'Bạn dị ứng đậu phộng và muốn gọi món gỏi. Bạn hỏi:',
            options: ['I\'m allergy with peanut.', "I'm allergic to peanuts. Does it have any peanuts in it?", 'Peanut no.', 'Is it delicious?'],
            correct: 1,
            why: '**allergic to** + hỏi thẳng thành phần bằng **any**. Dị ứng thì phải hỏi rõ, không đoán.',
          },
          {
            q: 'Món ra hơi mặn so với bạn. Câu nào phàn nàn nhẹ mà rõ?',
            options: ["It's too salty. I don't eat.", 'Sorry, this is a bit too salty for me. Could I get something else?', '(im lặng, ăn hết, không quay lại nữa)', 'Who cooked this?'],
            correct: 1,
            why: 'Sorry + a bit + for me + một yêu cầu cụ thể. Cứng với vấn đề, mềm với con người.',
          },
          {
            q: 'Phục vụ hỏi: "Would you like some bread?" Bạn muốn. Bạn đáp:',
            options: ['Yes, I would like.', 'Yes, please.', 'Yes, I like bread.', 'Bread is good.'],
            correct: 1,
            why: 'Đáp lời mời bằng **Yes, please.** / **No, thanks.** "Yes, I would like" thiếu tân ngữ và nghe cứng.',
          },
          {
            q: 'Ở Úc, đồng nghiệp hỏi: "Shall we get an entrée to share?" Họ muốn:',
            options: ['Gọi thêm một món chính', 'Gọi một món khai vị ăn chung', 'Gọi tráng miệng', 'Gọi đồ uống'],
            correct: 1,
            why: 'Ở Úc, **entrée = món khai vị**. Ở Mỹ thì entrée là món chính.',
          },
          {
            q: 'Bạn ăn ở một nhà hàng ở Mỹ có phục vụ bàn. Về tiền tip:',
            options: ['Không cần để tip', 'Thường để khoảng 15–20 %', 'Tip đã luôn tính sẵn', 'Để tip là bất lịch sự'],
            correct: 1,
            why: 'Ở Mỹ, tip **15–20 %** gần như bắt buộc ở nhà hàng có phục vụ bàn. Ở Úc thì không bắt buộc, ở Nhật thì không có văn hoá tip.',
          },
          {
            q: 'Phục vụ đang ở xa, bạn muốn xin hoá đơn. Cách nào hợp nhất ở Anh, Úc?',
            options: ['Gọi to: "Bill!"', 'Búng tay', 'Nhìn họ, giơ nhẹ tay, làm động tác ký lên lòng bàn tay', 'Huýt sáo'],
            correct: 2,
            why: 'Động tác ký tên lên lòng bàn tay = xin hoá đơn, ai cũng hiểu. Búng tay và huýt sáo là bất lịch sự.',
          },
          {
            q: 'Bạn vừa gọi khoai chiên thì đổi ý muốn salad. Bạn nói:',
            options: ['No, no, change!', 'Actually, could I swap the chips for a salad?', 'I hate chips.', 'Cancel.'],
            correct: 1,
            why: '**Actually** báo đổi ý một cách lịch sự, **swap A for B** = bỏ A lấy B.',
          },
          {
            q: '(Ôn N3) Trong lúc chờ món, khách hàng người Úc hỏi: "So, what do you do in your free time?" Câu trả lời nào giữ được câu chuyện?',
            options: ['Nothing.', "I play badminton. We play every Sunday. What about you?", 'Why?', 'I very like badminton.'],
            correct: 1,
            why: 'Trả lời + kể thêm + hỏi lại. Câu D sai "very like".',
          },
          {
            q: '(Ôn N2) Phục vụ nói "There\'s a surcharge on Sundays" mà bạn không biết "surcharge". Bạn nói:',
            options: ['What means surcharge?', 'Sorry, a surcharge?', 'Yes, yes.', 'Repeat!'],
            correct: 1,
            why: 'Nhắc lại từ khoá với giọng hỏi: **Sorry, a surcharge?** Người kia sẽ giải thích. Gật "Yes, yes" khi chưa hiểu là lỗi nguy hiểm nhất.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền a / an / some / any' },
      {
        t: 'quiz',
        id: 'gtd4-bt-dien',
        title: 'Phần II — Điền a, an, some hoặc any (8 câu)',
        kind: 'fill',
        grammar: 'a / an + đếm được số ít · some: khẳng định, xin, mời · any: hỏi, phủ định',
        items: [
          { q: "I'd like ___ muffin, please.", answers: ['a'] },
          { q: 'Could I have ___ egg on toast?', answers: ['an'] },
          { q: 'Do you have ___ oat milk?', answers: ['any'] },
          { q: "Sorry, we haven't got ___ blueberry muffins left.", answers: ['any'] },
          { q: 'Could we get ___ more water, please?', answers: ['some'] },
          { q: 'Would you like ___ bread with your soup?', answers: ['some'] },
          { q: 'Are there ___ prawns in this pasta?', answers: ['any'] },
          { q: "I'll have ___ orange juice, please. (một ly)", answers: ['an'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd4-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "I'd like… · Could I have…? · some / any · without · Could we get the bill?",
        items: [
          { q: 'Cho em xem thực đơn được không ạ?', hint: 'could I see', answers: ['Could I see the menu, please?', 'Could I see the menu?', 'Can I see the menu, please?', 'Can I see the menu?', 'Could I have the menu, please?', 'Could I have a look at the menu, please?'] },
          { q: 'Ở đây món gì ngon?', hint: "what's good", answers: ["What's good here?", 'What is good here?', 'What do you recommend?', 'What would you recommend?'] },
          { q: 'Cho em một bình nước lọc ạ.', hint: 'could we / I get, a jug of tap water', answers: ['Could we get a jug of tap water, please?', 'Could I get a jug of tap water, please?', 'Could we have a jug of tap water, please?', 'Could I have a jug of tap water, please?', 'Can we get a jug of tap water, please?', 'Can I have a jug of tap water, please?'] },
          { q: 'Món này có cay không ạ?', hint: 'is it', answers: ['Is it spicy?', 'Is this spicy?', 'Is it hot?', 'Is this dish spicy?'] },
          { q: 'Cho em sốt để riêng được không ạ?', hint: 'on the side', answers: ['Could I have the sauce on the side?', 'Could I have the sauce on the side, please?', 'Can I have the sauce on the side?', 'Can I get the sauce on the side?', 'Could I get the sauce on the side, please?'] },
          { q: 'Tách hoá đơn được không ạ?', hint: 'split the bill', answers: ['Can we split the bill?', 'Could we split the bill?', 'Can we split the bill, please?', 'Could we split the bill, please?', 'Can we split the check?'] },
          { q: '(Ôn N3) Mình mê ăn đồ Ý, nhưng mình không thích phô mai lắm.', hint: "love + V-ing / N, but, not a big fan of", answers: ["I love Italian food, but I'm not a big fan of cheese.", "I love eating Italian food, but I'm not a big fan of cheese.", "I love Italian food, but I don't really like cheese.", "I love Italian food but I'm not a big fan of cheese.", "I really like Italian food, but I'm not a big fan of cheese."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd4-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I'd like the lamb, please.", answer: "I'd like the lamb, please.", alt: ['I would like the lamb, please.', "I'd like the lamb please"] },
          { label: 'Câu 2', spell: 'Could I have the salad without onion?', answer: 'Could I have the salad without onion?', alt: ['Could I have the salad without onion'] },
          { label: 'Câu 3', spell: 'Have here or take away?', answer: 'Have here or take away?', alt: ['Have here or takeaway?'] },
          { label: 'Câu 4', spell: 'Sorry, I think there\'s a mistake on the bill.', answer: "Sorry, I think there's a mistake on the bill.", alt: ['Sorry, I think there is a mistake on the bill.', "Sorry I think there's a mistake on the bill"] },
          { label: 'Câu 5 (Ôn N3)', spell: 'Any plans for the weekend?', answer: 'Any plans for the weekend?' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd4-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Món này có hạt không ạ?', chips: ['Does', 'it', 'have', 'any', 'nuts', 'in', 'it?', 'some', 'is'], answer: ['Does', 'it', 'have', 'any', 'nuts', 'in', 'it?'] },
          { vi: 'Cho em một bát cơm.', chips: ['Could', 'I', 'have', 'a', 'bowl', 'of', 'rice?', 'rices?', 'an'], answer: ['Could', 'I', 'have', 'a', 'bowl', 'of', 'rice?'] },
          { vi: 'Em dặn không đá, mà trong ly có đá.', chips: ['I', 'asked', 'for', 'no', 'ice,', 'but', "there's", 'ice', 'in', 'it.', 'so', 'any'], answer: ['I', 'asked', 'for', 'no', 'ice,', 'but', "there's", 'ice', 'in', 'it.'] },
          { vi: 'Cất thẻ đi. Để mình mời.', chips: ['Put', 'your', 'card', 'away.', "It's", 'my', 'treat.', 'pay', 'me'], answer: ['Put', 'your', 'card', 'away.', "It's", 'my', 'treat.'] },
          { vi: '(Ôn N2) Vậy là một long black và một flat white, đúng không ạ?', chips: ["So", "that's", 'a', 'long', 'black', 'and', 'a', 'flat', 'white,', 'right?', 'or', 'any'], answer: ['So', "that's", 'a', 'long', 'black', 'and', 'a', 'flat', 'white,', 'right?'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Nghĩ về **quán bạn hay ăn nhất**. Nói to 4 câu như đang gọi món ở đó bằng tiếng Anh: đồ uống · món chính · một yêu cầu (without / on the side / less sugar) · xin hoá đơn.',
          'Viết một **đánh giá 3 câu** cho quán đó theo khung "The … was …, but the … was a bit …". Đọc to và ghi âm.',
          'Ngày 5: mua sắm và dịch vụ — hỏi giá, How much / How many, so sánh rẻ hơn, to hơn, đổi trả hàng lịch sự.',
        ],
      },
    ],
  },
];
