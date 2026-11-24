/**
 * Tiếng Anh giao tiếp — NGÀY 30, ngày cuối khoá (chặng 5 "Tự nhiên", B2): "Một ngày sống bằng tiếng Anh".
 * + KIỂM TRA CHẶNG 5 (Ngày 25–30) + TỔNG KẾT KHOÁ.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework · review `gtd30-kiem-tra`. Mọi id bắt đầu `gtd30-`.
 * Ngữ pháp: tổng ôn 10 khung câu dùng nhiều nhất cả khoá, lấy từ `patterns` thật của Ngày 2, 4, 9, 10, 13–14, 15, 16, 17, 18,
 * 24 (mỗi khung ghi rõ Ngày). Nối câu: tổng ôn từ nối của cả khoá.
 * Cảnh: Phúc — sinh viên IT năm 3, OJT ở Tallowmere (công ty phần mềm ở Đà Nẵng có văn phòng Melbourne) — tuần công tác ở
 * Melbourne, tự thách mình sống trọn thứ Năm bằng tiếng Anh. 6 cảnh liền, mỗi cảnh ôn một chặng: quán cà phê + tàu điện
 * (chặng 1) · cuộc gọi của Rory, mời và từ chối, đau họng (chặng 2) · văn phòng: làm quen, nhờ việc, xin vắng họp (chặng 3) ·
 * chợ Queen Victoria: hỏi giá, đề nghị giá khi mua nhiều, giải thích quà Việt Nam (chặng 4) · đi uống sau giờ làm: nói nhanh,
 * kể chuyện, đùa, nói về mục tiêu (chặng 5, Ngày 25–28) · lễ tân khách sạn: hiểu lầm giờ taxi, chen lời, câu chẻ (Ngày 29).
 * Sự thật đã kiểm: khu Free Tram Zone ở trung tâm Melbourne (gồm cả Docklands) không cần chạm thẻ myki; "magic" là kiểu cà phê
 * đặc trưng Melbourne (ristretto đôi + sữa); chợ Queen Victoria Market có thật. Xin giá khi mua nhiều là chuyện thường; mặc cả
 * từng món thì ở Úc KHÔNG phổ biến như ở chợ Việt Nam — bài nói rõ. Tuyến tàu trong cảnh chỉ là lời người bán, kèm "check the app".
 * Kiểm tra chặng 5: cảnh mới ở Đà Nẵng (Duyên, Callan, Maura, Ezra), câu mới.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_30: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd30-nghe',
    kind: 'listening',
    title: 'Một ngày sống bằng tiếng Anh — 6 cảnh liền',
    goal: 'Nghe trọn một ngày của Phúc ở Melbourne, 6 cảnh liền nhau ở tốc độ tự nhiên (khoảng 180 từ/phút): gọi đồ và hỏi tàu, nhận cuộc gọi mời, làm quen và nhờ việc ở văn phòng, mua quà ở chợ, đi uống sau giờ làm, gỡ một hiểu lầm ở khách sạn; nhận ra mỗi cảnh dùng lại kỹ năng của chặng nào.',
    minutes: 35,
    blocks: [
      {
        t: 'recap',
        title: 'Ngày cuối: không học thêm, mà dùng hết',
        items: [
          'Ba mươi ngày trước, khoá bắt đầu bằng "I\'m… / This is… / Nice to meet you". Hôm nay bạn nghe **một ngày trọn vẹn** chỉ bằng tiếng Anh, và mỗi cảnh **dùng lại một chặng**.',
          'Bạn theo **Phúc**, sinh viên IT năm 3, OJT ở **Tallowmere** (Đà Nẵng). Tuần này Phúc sang văn phòng **Melbourne (Úc)** và tự thách: **thứ Năm, từ sáng tới tối, không nói một câu tiếng Việt**.',
          'Sáu cảnh: **7:40** quán cà phê + tàu điện (chặng 1) · **9:10** cuộc gọi của bạn cũ (chặng 2) · **10:30** văn phòng (chặng 3) · **12:45** chợ (chặng 4) · **17:45** đi uống sau giờ làm (chặng 5) · **21:30** lễ tân khách sạn (Ngày 29).',
          'Hôm nay **gần như không dịch**: chỉ câu khó mới có tiếng Việt. Nghe hết một cảnh rồi mới mở lời thoại.',
          'Mỗi cảnh, tự hỏi: **Phúc làm được việc chưa?** Đó là thước đo duy nhất của khoá này.',
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Thứ Năm của Phúc — 6 cảnh, 5 chặng',
        steps: [
          { label: '7:40 Cà phê + tàu', sub: 'chặng 1 · Ngày 1–6' },
          { label: '9:10 Cuộc gọi của Rory', sub: 'chặng 2 · Ngày 7–12' },
          { label: '10:30 Văn phòng', sub: 'chặng 3 · Ngày 13–18' },
          { label: '12:45 Chợ', sub: 'chặng 4 · Ngày 19–24' },
          { label: '17:45 Đi uống', sub: 'chặng 5 · Ngày 25–28' },
          { label: '21:30 Khách sạn', sub: 'Ngày 29' },
        ],
        caption: 'Cảnh nào bạn nghe khó nhất, chặng đó là chỗ nên ôn lại đầu tiên.',
      },

      { t: 'h', text: 'Cảnh 1 — 7:40, quán cà phê và tàu điện (ôn chặng 1 · Ngày 1–6)' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'woman-cook', 'man-technologist', 'credit-card', 'tram'],
        caption: 'Một quán cà phê nhỏ trong con hẻm ở trung tâm Melbourne. **Tiana** đứng máy pha. **Phúc** gọi đồ, nghe một tên đồ uống lạ, rồi hỏi đường đi tàu điện tới văn phòng ở Docklands.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh1',
        title: 'Scene 1 — Coffee and the tram',
        note: 'Nghe xem: Phúc gọi gì; anh không hiểu chữ nào và hỏi lại thế nào; đi tàu nào, có phải chạm thẻ không.',
        lines: [
          { who: 'Tiana', voice: 'au-nu', text: 'Morning! What can I get you?' },
          { who: 'Phúc', voice: 'us-nam', text: 'Morning. Could I have a flat white and a banana bread, please?' },
          { who: 'Tiana', voice: 'au-nu', text: 'Sure. Having it here or taking away?' },
          { who: 'Phúc', voice: 'us-nam', text: 'Taking away, thanks.' },
          { who: 'Tiana', voice: 'au-nu', text: "No worries. Or if you want something stronger, our magic's pretty good today." },
          { who: 'Phúc', voice: 'us-nam', text: 'Sorry? Your… magic? Could you say that again?', vi: 'Xin lỗi? "Magic" của chị? Chị nói lại được không?' },
          { who: 'Tiana', voice: 'au-nu', text: "Ha, it's a Melbourne thing. A magic's a double ristretto with steamed milk. A bit smaller and stronger than a flat white.", vi: 'Ha, đặc sản Melbourne đấy. "Magic" là ristretto đôi với sữa nóng. Nhỏ hơn và đậm hơn flat white một chút.' },
          { who: 'Phúc', voice: 'us-nam', text: "Oh, I'll try that instead, then. One more thing: is this the right tram stop for Docklands?", vi: 'Ồ, thế em đổi sang món đó. Còn một chuyện: trạm tàu điện này đúng đường đi Docklands không ạ?' },
          { who: 'Tiana', voice: 'au-nu', text: "Yep, it's just across the road. Most trams heading west'll get you there, but check the app first. They've been doing roadworks all week." },
          { who: 'Phúc', voice: 'us-nam', text: 'Got it. And do I need to tap my card?' },
          { who: 'Tiana', voice: 'au-nu', text: "Not in the city. It's the Free Tram Zone, and Docklands is inside it. That'll be nine-fifty, thanks.", vi: 'Trong trung tâm thì không. Đó là khu tàu điện miễn phí, Docklands nằm trong đó. Chín đô năm mươi nhé.' },
          { who: 'Phúc', voice: 'us-nam', text: 'Here you go. Thanks so much. Have a good one!' },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — 9:10, trên tàu, một cuộc gọi (ôn chặng 2 · Ngày 7–12)' },
      {
        t: 'canh',
        anh: ['tram', 'mobile-phone', 'man-office-worker', 'thermometer', 'calendar'],
        caption: '**Rory**, bạn người Ireland Phúc quen hồi Rory sang Đà Nẵng làm tình nguyện, giờ sống ở Melbourne, gọi điện. Tàu đông và ồn.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh2',
        title: 'Scene 2 — A call from Rory',
        note: 'Nghe xem: Rory mời gì, khi nào; Phúc từ chối thế nào và vì sao; Phúc bị làm sao; hai người chốt gì.',
        lines: [
          { who: 'Rory', voice: 'ie-nam', text: "Phúc! You're here! Why didn't you tell me you were in Melbourne?" },
          { who: 'Phúc', voice: 'us-nam', text: "Rory! Sorry, I only got here on Monday night. It's been crazy." },
          { who: 'Rory', voice: 'ie-nam', text: 'Listen, a few of us are having a barbecue on Saturday. You have to come.' },
          { who: 'Phúc', voice: 'us-nam', text: "Ah, I'd love to, but I'm flying back on Saturday morning. Could we do Friday instead?", vi: 'À, mình rất muốn, nhưng sáng thứ Bảy mình bay về rồi. Mình gặp thứ Sáu thay được không?' },
          { who: 'Rory', voice: 'ie-nam', text: "Friday works. Hang on, you sound rough. Are you alright?", vi: 'Thứ Sáu được. Khoan, giọng cậu nghe tệ thế. Cậu ổn không?' },
          { who: 'Phúc', voice: 'us-nam', text: "I've had a sore throat since Tuesday. The air conditioning in the office is so cold that I wear my jacket all day." },
          { who: 'Rory', voice: 'ie-nam', text: 'You should get some lozenges from the chemist. And drink something hot, not iced coffee.' },
          { who: 'Phúc', voice: 'us-nam', text: "Yes, Dad. Sorry, the tram's really loud. Did you say seven or eleven on Friday?", vi: 'Vâng thưa bố. Xin lỗi, tàu ồn quá. Cậu nói bảy giờ hay mười một giờ thứ Sáu?' },
          { who: 'Rory', voice: 'ie-nam', text: "Seven! Seven p.m. I'll text you the address." },
          { who: 'Phúc', voice: 'us-nam', text: "Perfect. I'll call you back at lunch. My stop's coming up." },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — 10:30, văn phòng Melbourne (ôn chặng 3 · Ngày 13–18)' },
      {
        t: 'canh',
        anh: ['office-building', 'man-office-worker', 'handshake', 'desktop-computer', 'calendar'],
        caption: 'Văn phòng Tallowmere ở Docklands. **Felix** (người Úc) ngồi bàn bên cạnh. Phúc cần tìm phòng họp, nhờ chỉ cách dùng máy in, và báo vắng buổi họp chiều.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh3',
        title: 'Scene 3 — New desk, new faces',
        note: 'Nghe xem: Felix làm ở đây bao lâu; Phúc nhờ hai việc gì, bằng câu nào; Phúc xin gì và lý do là gì.',
        lines: [
          { who: 'Felix', voice: 'au-nam', text: "G'day, you must be Phúc. I'm Felix. Bit chilly in here, isn't it?" },
          { who: 'Phúc', voice: 'us-nam', text: "It's freezing! Nice to meet you, Felix. How long have you been at Tallowmere?" },
          { who: 'Felix', voice: 'au-nam', text: 'Coming up to three years. Have you ever been to Melbourne before?' },
          { who: 'Phúc', voice: 'us-nam', text: "Never. It's my first time in Australia. Actually, do you know where meeting room 4B is? I've got a session there at eleven." },
          { who: 'Felix', voice: 'au-nam', text: 'Down the corridor, last door on the left, next to the kitchen.' },
          { who: 'Phúc', voice: 'us-nam', text: 'Thanks. And would you mind showing me how the printer works? It keeps asking for a PIN.', vi: 'Cảm ơn. Còn anh chỉ giúp em cách dùng máy in được không? Nó cứ đòi mã PIN.' },
          { who: 'Felix', voice: 'au-nam', text: "Not at all. It's a pain, that thing. Come on, I'll show you now." },
          { who: 'Phúc', voice: 'us-nam', text: "Also, I won't be able to stay for the four o'clock catch-up, because I'm meeting a supplier at the market. Do you think Leanne will mind?", vi: 'Với lại, em không ở lại buổi họp nhanh lúc bốn giờ được, vì em gặp một nhà cung cấp ở chợ. Anh nghĩ chị Leanne có phiền không?' },
          { who: 'Felix', voice: 'au-nam', text: "I don't think so. Just drop her a message. If she needs you, she'll ring you." },
          { who: 'Phúc', voice: 'us-nam', text: 'Good idea. Let me do that now, before I forget.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd30-nghe-sang-hieu',
        title: 'Buổi sáng (cảnh 1–3) — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: '(Cảnh 1) Phúc nghe chữ "magic" và không hiểu. Anh làm gì?',
            options: ['Gật đầu rồi gọi đại', 'Nhắc lại chữ đó kèm dấu hỏi và xin nói lại: "Sorry? Your… magic? Could you say that again?"', 'Hỏi bằng tiếng Việt', 'Bỏ đi'],
            correct: 1,
            why: 'Kỹ năng số một của **Ngày 2**: nhắc lại **đúng chữ không hiểu** + **Could you say that again?** Người bán giải thích ngay, Phúc còn được thử món mới.',
          },
          {
            q: '(Cảnh 1) Phúc có phải chạm thẻ khi đi tàu tới Docklands không?',
            options: ['Có, luôn luôn', 'Không, vì Docklands nằm trong khu tàu điện miễn phí (Free Tram Zone)', 'Phải mua vé giấy', 'Tiana không biết'],
            correct: 1,
            why: '"Not in the city. It\'s the **Free Tram Zone**, and Docklands is inside it." Ra ngoài khu đó thì phải chạm thẻ myki.',
          },
          {
            q: '(Cảnh 2) Rory mời gì, và Phúc trả lời thế nào?',
            options: ['Đi xem bóng đá; Phúc nhận lời', 'Tiệc nướng thứ Bảy; Phúc từ chối vì sáng thứ Bảy bay về, đề nghị gặp thứ Sáu', 'Ăn trưa hôm nay; Phúc bận', 'Đi biển chủ nhật; Phúc ốm'],
            correct: 1,
            why: '**I\'d love to, but** + kế hoạch đã chốt (I\'m flying back on Saturday morning) + đề nghị khác (**Could we do Friday instead?**): khung từ chối của **Ngày 10**.',
          },
          {
            q: '(Cảnh 2) Tàu ồn quá. Phúc hỏi lại thông tin quan trọng nào?',
            options: ['Địa chỉ nhà Rory', 'Giờ hẹn: bảy hay mười một giờ', 'Số điện thoại', 'Tên quán'],
            correct: 1,
            why: '"Did you say **seven or eleven**?" Hai số nghe rất giống nhau khi ồn. Hỏi lại kiểu **A hay B** giúp người kia chỉ cần chọn.',
          },
          {
            q: '(Cảnh 3) Phúc báo vắng buổi họp lúc bốn giờ bằng câu nào?',
            options: ["I can't come. Bye.", "I won't be able to stay for the four o'clock catch-up, because I'm meeting a supplier at the market.", 'I off at four.', "Four o'clock, no."],
            correct: 1,
            why: '**I won\'t be able to + V … because…** của **Ngày 16**: báo trước, có lý do, rồi hỏi người phụ trách có phiền không.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 4 — 12:45, chợ Queen Victoria (ôn chặng 4 · Ngày 19–24)' },
      {
        t: 'canh',
        anh: ['shopping-bags', 'man-cook', 'money-bag', 'wrapped-gift', 'globe-showing-asia-australia'],
        caption: 'Giờ trưa, **chợ Queen Victoria**, khu chợ lâu đời ở trung tâm Melbourne. **Hugh** (người Anh, sang Úc đã lâu) bán cốc giữ nhiệt bằng gốm. Phúc mua quà cho team ở Đà Nẵng, và có món quà Việt Nam muốn tặng lại.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh4',
        title: 'Scene 4 — Gifts at the market',
        note: 'Nghe xem: giá một chiếc cốc; Phúc đề nghị thế nào; Hugh đồng ý ra sao; Phúc giải thích món quà Việt Nam thế nào.',
        lines: [
          { who: 'Phúc', voice: 'us-nam', text: 'Hi. How much are these travel mugs?' },
          { who: 'Hugh', voice: 'uk-nam', text: "Twenty-two each. They're made by a potter up in the hills, so every one's a bit different." },
          { who: 'Phúc', voice: 'us-nam', text: "They're lovely. I need six for my team back home. If I bought six, could you do them for a hundred and twenty?", vi: 'Đẹp quá. Em cần sáu cái cho team ở nhà. Nếu em mua sáu cái, anh để giá một trăm hai mươi được không?' },
          { who: 'Hugh', voice: 'uk-nam', text: "Hmm. I could do a hundred and twenty-five, and I'll throw in the gift bags." },
          { who: 'Phúc', voice: 'us-nam', text: "Deal. Thank you. Back home we'd haggle a lot more, but I was told people don't really do that here.", vi: 'Chốt. Cảm ơn anh. Ở nhà em mặc cả nhiều hơn, nhưng em được dặn là ở đây người ta không thật sự làm vậy.' },
          { who: 'Hugh', voice: 'uk-nam', text: "Not much, no. Asking for a deal when you buy a few is fine, though. Where's home?" },
          { who: 'Phúc', voice: 'us-nam', text: "Đà Nẵng, in Vietnam. Actually, here, this is for you. It's a small bag of coffee from the Central Highlands. It's roasted with a bit of butter, which gives it that chocolatey smell.", vi: 'Đà Nẵng, ở Việt Nam. À, cái này tặng anh. Một túi cà phê nhỏ từ Tây Nguyên. Cà phê được rang với chút bơ, nên có mùi như sô-cô-la.' },
          { who: 'Hugh', voice: 'uk-nam', text: "Oh, that's very kind of you. Do you drink it black?" },
          { who: 'Phúc', voice: 'us-nam', text: 'Usually with condensed milk and lots of ice. It might be a bit strong for you at first, so start with half a spoon.', vi: 'Thường uống với sữa đặc và nhiều đá. Lúc đầu có thể hơi đậm với anh, nên anh bắt đầu với nửa thìa thôi.' },
          { who: 'Hugh', voice: 'uk-nam', text: 'Noted. Cheers, Phúc. Safe flight on Saturday.' },
        ],
      },

      { t: 'h', text: 'Cảnh 5 — 17:45, đi uống sau giờ làm (ôn chặng 5 · Ngày 25–28)' },
      {
        t: 'canh',
        anh: ['cityscape-at-dusk', 'clinking-glasses', 'man-office-worker', 'woman-office-worker', 'face-with-tears-of-joy'],
        caption: 'Một quán trên sân thượng gần văn phòng. **Felix** và **Fern** (người Canada, sang Melbourne làm hai năm) rủ Phúc đi. Họ nói **rất nhanh**, nối âm, đổi chủ đề liên tục.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh5',
        title: 'Scene 5 — After-work drinks',
        note: 'Nghe xem: những chữ rút gọn (gonna, wanna, whaddaya, kinda); Phúc kể chuyện gì và câu nào là cao trào; Phúc quay lại câu chuyện thế nào; Phúc nói gì về mục tiêu của mình.',
        lines: [
          { who: 'Fern', voice: 'ca-nu', text: "Okay, whaddaya wanna drink, Phúc? First round's on me." },
          { who: 'Phúc', voice: 'us-nam', text: "Just a lemonade, thanks. My throat's still kinda sore." },
          { who: 'Felix', voice: 'au-nam', text: "Fair enough. So, how's the day been? You've been speaking English since, what, seven a.m.?" },
          { who: 'Phúc', voice: 'us-nam', text: "Since I woke up! It's been good, actually. Oh, funny story: this morning I'd just ordered a flat white when the barista offered me some magic." },
          { who: 'Fern', voice: 'ca-nu', text: 'Ha! Did you think she was selling you something dodgy?' },
          { who: 'Phúc', voice: 'us-nam', text: 'For about two seconds, yes! I was gonna say no thanks and run.', vi: 'Khoảng hai giây thì có! Mình đã định nói "thôi cảm ơn" rồi chạy.' },
          { who: 'Felix', voice: 'au-nam', text: 'Classic. Hey, by the way, are you guys coming to the footy on Sunday?' },
          { who: 'Fern', voice: 'ca-nu', text: "Can't, I've got a thing. Anyway, sorry, Phúc, you were saying?" },
          { who: 'Phúc', voice: 'us-nam', text: "Anyway, as I was saying, it turned out to be the best coffee I've had all week. So now I'm hooked." },
          { who: 'Fern', voice: 'ca-nu', text: "So what's the plan after your internship? You gonna stay in Đà Nẵng?" },
          { who: 'Phúc', voice: 'us-nam', text: "For now, yes. I've been working on my English every day for a month, and I'm hoping to apply for a role on the international team next year.", vi: 'Trước mắt thì có. Mình học tiếng Anh mỗi ngày suốt một tháng nay, và mình hy vọng năm sau ứng tuyển vào một vị trí ở team quốc tế.' },
          { who: 'Felix', voice: 'au-nam', text: "Mate, if today's anything to go by, you'll smash it." },
        ],
      },

      { t: 'h', text: 'Cảnh 6 — 21:30, lễ tân khách sạn (ôn Ngày 29)' },
      {
        t: 'canh',
        anh: ['hotel', 'bellhop-bell', 'woman-office-worker', 'taxi', 'alarm-clock'],
        caption: 'Về khách sạn. **Pippa** (người New Zealand) trực quầy lễ tân, nói nhanh và hay nói tiếp trước khi người khác nói xong. Phúc cần đặt taxi ra sân bay sáng thứ Bảy.',
      },
      {
        t: 'listen',
        id: 'gtd30-nghe-canh6',
        title: 'Scene 6 — A taxi for Saturday',
        note: 'Nghe xem: Pippa đặt nhầm giờ nào; Phúc chen vào và gỡ hiểu lầm bằng câu gì; cuối cùng taxi lúc mấy giờ và Phúc kiểm lại ra sao.',
        lines: [
          { who: 'Phúc', voice: 'us-nam', text: 'Hi. Could you book me a taxi to the airport for Saturday at four, please?' },
          { who: 'Pippa', voice: 'nz-nu', text: "Sure. Saturday, four p.m. That's a good time, actually, because the traffic's usually lighter before the evening rush, and if you—" },
          { who: 'Phúc', voice: 'us-nam', text: "Sorry, can I just jump in? What I meant was four in the morning. My flight's at seven.", vi: 'Xin lỗi, cho tôi chen một câu? Ý tôi là bốn giờ sáng. Chuyến bay của tôi lúc bảy giờ.' },
          { who: 'Pippa', voice: 'nz-nu', text: "Oh! Four a.m. Sorry, my mistake. That's a very early start." },
          { who: 'Phúc', voice: 'us-nam', text: "It is. And could you add a wake-up call at three-fifteen? I really can't miss this one." },
          { who: 'Pippa', voice: 'nz-nu', text: "Done. And I'll leave a little breakfast bag at the desk for you, since the restaurant won't be open." },
          { who: 'Phúc', voice: 'us-nam', text: "That's so thoughtful. Just to confirm: a taxi at four a.m. on Saturday, and a wake-up call at three-fifteen. Is that right?", vi: 'Chu đáo quá. Tôi xác nhận lại: taxi bốn giờ sáng thứ Bảy, gọi báo thức lúc ba giờ mười lăm. Đúng không ạ?' },
          { who: 'Pippa', voice: 'nz-nu', text: 'Spot on. Anything else I can help with?' },
          { who: 'Phúc', voice: 'us-nam', text: "No, that's everything. Thanks, Pippa. Have a good night." },
          { who: 'Pippa', voice: 'nz-nu', text: 'You too. And your English is great, by the way.' },
          { who: 'Phúc', voice: 'us-nam', text: "Thank you! That's made my day. It's been a whole day in English." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd30-nghe-chieu-hieu',
        title: 'Buổi chiều và tối (cảnh 4–6) — Bạn nghe được gì? (5 câu)',
        items: [
          {
            q: '(Cảnh 4) Phúc xin giá thế nào, và kết quả ra sao?',
            options: ['Trả nửa giá; Hugh từ chối', 'Đề nghị mua sáu cái với giá 120; Hugh đưa giá 125 và tặng thêm túi quà; Phúc đồng ý', 'Không hỏi giá', 'Đòi giảm 50%'],
            correct: 1,
            why: '**If I bought six, could you do them for…?** (điều kiện loại 2 của **Ngày 22**). Hugh đáp bằng một giá ở giữa + "I\'ll **throw in** the gift bags" (tặng kèm). Phúc chốt: **Deal.**',
          },
          {
            q: '(Cảnh 4) Phúc giải thích túi cà phê bằng cấu trúc nào?',
            options: ['It is make in the Highlands.', "It's roasted with a bit of butter, which gives it that chocolatey smell.", 'They roasting it with butter.', 'Coffee is very delicious.'],
            correct: 1,
            why: 'Bị động **is roasted with** + **which** để nói thêm (**Ngày 20**). Kèm lời khuyên mềm "It **might** be a bit strong for you at first" (**Ngày 24**).',
          },
          {
            q: '(Cảnh 5) "Funny story: this morning I\'d just ordered a flat white when the barista offered me some magic." Đây là kỹ thuật gì?',
            options: ['Hỏi đường', 'Kể chuyện: I\'d just + V3 … when … để dựng tình huống rồi tung chi tiết bất ngờ', 'Xin lỗi', 'Thương lượng'],
            correct: 1,
            why: '**Quá khứ hoàn thành** trong kể chuyện (**Ngày 27**): "I\'d just + V3, when + quá khứ đơn" tạo khoảnh khắc "vừa… thì…". Chữ "magic" nghe như đồ cấm làm cả bàn cười.',
          },
          {
            q: '(Cảnh 5) Bị Felix chen chuyện bóng đá, Phúc quay lại câu chuyện bằng câu nào?',
            options: ['By the way, the coffee was good.', "Anyway, as I was saying, it turned out to be the best coffee I've had all week.", 'Stop, I am talking.', 'Again, the coffee.'],
            correct: 1,
            why: '**Anyway, as I was saying, …** (**Ngày 26**) = quay lại mạch cũ. Fern còn giúp mở đường: "Anyway, sorry, Phúc, **you were saying?**"',
          },
          {
            q: '(Cảnh 6) Pippa hiểu sai gì, và Phúc gỡ thế nào?',
            options: ['Sai ngày; Phúc huỷ taxi', 'Hiểu "four" là 4 giờ chiều; Phúc chen vào lịch sự rồi dùng câu chẻ "What I meant was four in the morning", cuối cùng xác nhận lại toàn bộ', 'Sai sân bay; Phúc gọi taxi khác', 'Không có hiểu lầm'],
            correct: 1,
            why: '**Sorry, can I just jump in?** + **What I meant was…** (**Ngày 29**), rồi **Just to confirm: …, is that right?** (**Ngày 2**). Từ ngày 2 tới ngày 29, cùng một thói quen: **hỏi lại để chắc**.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 6 câu — mỗi cảnh một câu' },
      {
        t: 'p',
        text: 'Mỗi câu đến từ một cảnh, tức một chặng của khoá. Câu cảnh 5 có **gonna** đọc nhanh: viết đúng như nghe; viết **going to** cũng được chấm đúng. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd30-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — cảnh 1 (chặng 1)', spell: 'Is this the right tram stop for Docklands?', answer: 'Is this the right tram stop for Docklands?' },
          { label: 'Câu 2 — cảnh 2 (chặng 2)', spell: "I'd love to, but I'm flying back on Saturday morning.", answer: "I'd love to, but I'm flying back on Saturday morning.", alt: ['I would love to, but I am flying back on Saturday morning.', "I'd love to but I'm flying back on Saturday morning."] },
          { label: 'Câu 3 — cảnh 3 (chặng 3)', spell: 'Would you mind showing me how the printer works?', answer: 'Would you mind showing me how the printer works?' },
          { label: 'Câu 4 — cảnh 4 (chặng 4)', spell: 'If I bought six, could you do them for a hundred and twenty?', answer: 'If I bought six, could you do them for a hundred and twenty?', alt: ['If I bought six, could you do them for 120?', 'If I bought 6, could you do them for 120?', 'If I bought six could you do them for a hundred and twenty?'] },
          { label: 'Câu 5 — cảnh 5 (chặng 5)', spell: 'I was gonna say no thanks and run.', answer: 'I was gonna say no thanks and run.', alt: ['I was going to say no thanks and run.', 'I was gonna say no, thanks, and run.', 'I was going to say no, thanks, and run.'] },
          { label: 'Câu 6 — cảnh 6 (Ngày 29)', spell: 'What I meant was four in the morning.', answer: 'What I meant was four in the morning.', alt: ['What I meant was 4 in the morning.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Having it here or taking away? (Úc, Anh)', 'Uống tại quán hay mang đi? Mỹ nói **For here or to go?**', 'Taking away, thanks.'],
          ['No worries. (Úc)', 'Không sao / có ngay / không có gì. Dùng cho gần như mọi lời cảm ơn.', '—'],
          ['Have a good one!', 'Chúc một ngày tốt lành (rất thân thiện, không trang trọng).', 'You too!'],
          ['You sound rough.', 'Giọng bạn nghe như đang ốm / mệt.', "I've had a sore throat since…"],
          ['Just drop her a message.', 'Cứ nhắn cho chị ấy một tin là được.', "Good idea, I'll do that now."],
          ["I'll throw in the gift bags.", 'Tôi tặng kèm túi quà.', 'Deal. Thank you!'],
          ["First round's on me.", 'Lượt đồ uống đầu tôi mời.', "Thanks! I'll get the next one."],
          ["If today's anything to go by, you'll smash it.", 'Cứ như hôm nay thì bạn sẽ làm cực tốt.', 'Ha, I hope so. Thanks!'],
          ['Spot on.', 'Chính xác. (Anh, Úc, NZ)', 'Great, thanks.'],
          ["That's made my day.", 'Câu đó làm tôi vui cả ngày.', '—'],
        ],
        caption: 'Bạn không cần **nói** hết những câu này. Bạn cần **nghe ra** chúng, để không đứng hình khi người bản xứ dùng.',
      },
      {
        t: 'note',
        title: 'Mẹo: cả ngày bằng tiếng Anh, lúc không nghe kịp thì dựa vào ba "phao"',
        items: [
          '**Phao 1 — nhắc lại chữ lạ + hỏi lại** (Ngày 2): "Sorry? Your… magic?" Một chữ nhắc lại cho người kia biết **chính xác** chỗ bạn lạc.',
          '**Phao 2 — hỏi lại kiểu A hay B**: "Did you say seven or eleven?" Người kia chỉ cần chọn, không phải nói lại cả câu.',
          '**Phao 3 — xác nhận lại toàn bộ** (Ngày 2, 29): "Just to confirm: …, is that right?" Dùng cho mọi thứ có giờ, ngày, số tiền, địa chỉ.',
          'Phúc **không** nghe kịp hết cả ngày. Anh chỉ **không để lọt** những thứ quan trọng: món, tàu, giờ hẹn, giá, giờ taxi. Đó là "nói được tiếng Anh" trong đời thật.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Úc (Melbourne)', 'Mỹ', 'Anh'],
        rows: [
          ['Mang đi', 'takeaway', 'to go', 'takeaway'],
          ['Cà phê sữa phổ biến', 'flat white · magic (riêng Melbourne)', 'latte', 'flat white · latte'],
          ['Hiệu thuốc', 'chemist', 'drugstore · pharmacy', 'chemist · pharmacy'],
          ['Buổi chiều (thân)', 'arvo', 'afternoon', 'afternoon'],
          ['Chào (thân)', "G'day · How ya going?", "Hey · How's it going?", 'Hiya · You alright?'],
          ['"footy"', 'bóng đá luật Úc (AFL)', '(ít dùng; football = bóng bầu dục Mỹ)', 'bóng đá, hoặc rugby tuỳ vùng'],
          ['Mời một lượt đồ uống', "It's my shout.", "It's on me.", "It's my round."],
        ],
        caption: 'Đến Melbourne mà nghe "**footy**" thì gần như chắc chắn là **bóng đá luật Úc (AFL)**, không phải bóng đá.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast — mỗi chặng một tập để ôn',
        items: [
          '**Chặng 1** · **en-ds-a1-04 · Where To?** — đi taxi, nói điểm đến; ôn lại sau cảnh 1.',
          '**Chặng 2** · **en-ds-a2-04 · I\'d Love To, But…** — mời và từ chối; nghe lại sau cảnh 2.',
          '**Chặng 3** · **en-b1-01 · My First Salary** — chuyện đi làm, không kỹ thuật.',
          '**Chặng 4** · **en-ds-b2-01 · Is the Rent Negotiable?** — thương lượng mềm, như cảnh 4.',
          '**Chặng 5** · **en-ds-c1-01 · What They Say vs. What They Mean** và **en-b2-01 · Tell Me About a Mistake** — nghe nhanh, kể chuyện, nói về bản thân.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd30-noi',
    kind: 'speaking',
    title: 'Nhập vai tổng hợp 15 phút với Gia sư AI',
    goal: 'Nói liền 15 phút qua 6 tình huống nối nhau như một ngày thật, dùng lại 10 khung câu quan trọng nhất của cả khoá, tự chấm theo phiếu, và biết chính xác Ngày nào cần ôn tiếp.',
    minutes: 35,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn làm gì',
        items: [
          '**25 câu cứu cánh** của cả khoá: mỗi câu ghi Ngày đã học, ví dụ mới trong một ngày ở Melbourne.',
          '**Tổng ôn ngữ pháp**: 10 khung câu dùng nhiều nhất, lấy đúng từ mục 🧱 của **Ngày 2, 4, 9, 10, 13–14, 15, 16, 18, 24**.',
          '**Kế hoạch 15 phút**: 6 tình huống liền nhau với Gia sư AI, mỗi tình huống khoảng 2 phút, theo đúng một ngày của Phúc.',
          'Ngôn ngữ cơ thể và phát âm: **tổng kết** những điều khác biệt quan trọng nhất của khoá.',
          'Cuối bài: đề bài nhập vai chép sẵn + **phiếu tự chấm** sau khi nói.',
        ],
      },

      { t: 'h', text: '1. 25 câu cứu cánh của cả khoá' },
      {
        t: 'p',
        text: 'Nếu chỉ được mang theo 25 câu khi ra nước ngoài, mang những câu này. Mỗi câu ghi **Ngày** đã học kỹ; ví dụ đều là câu **mới**. Bấm **Che nghĩa**, nhìn tiếng Việt và tự nói câu tiếng Anh.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Sorry? Could you say that again?', pos: 'phr', ipa: '/ˈsɑːri kʊdʒu ˈseɪ ðæt əˈɡen/', vi: 'Xin lỗi? Bạn nói lại được không? (Ngày 1–2)', ex: "Sorry? The number twelve? Could you say that again?", exVi: 'Xin lỗi? Số mười hai à? Bạn nói lại được không?' },
          { w: 'Could you speak a bit more slowly?', pos: 'phr', ipa: '/kʊdʒu ˈspiːk ə ˌbɪt mɔːr ˈsloʊli/', vi: 'Bạn nói chậm hơn một chút được không? (Ngày 2)', ex: "Sorry, could you speak a bit more slowly? The tram's really loud.", exVi: 'Xin lỗi, bạn nói chậm hơn chút được không? Tàu ồn quá.' },
          { w: 'Just to confirm: …, is that right?', pos: 'phr', ipa: '/ˈdʒʌst tə kənˈfɝːm… ɪz ðæt ˈraɪt/', vi: 'Xác nhận lại: …, đúng không? (Ngày 2)', ex: 'Just to confirm: dinner at seven on Friday, is that right?', exVi: 'Xác nhận lại: ăn tối bảy giờ thứ Sáu, đúng không?' },
          { w: 'What does … mean?', pos: 'phr', ipa: '/ˈwʌt dəz… ˈmiːn/', vi: '… nghĩa là gì? (Ngày 2)', ex: "Sorry, what does 'arvo' mean?", exVi: 'Xin lỗi, "arvo" nghĩa là gì?' },
          { w: 'Could I have…, please?', pos: 'phr', ipa: '/kʊd aɪ ˈhæv… ˈpliːz/', vi: 'Cho tôi… được không? (Ngày 4)', ex: 'Could I have a glass of tap water, please?', exVi: 'Cho tôi một cốc nước lọc được không?' },
          { w: 'How much is / are…?', pos: 'phr', ipa: '/haʊ ˈmʌtʃ ɪz/', vi: '… bao nhiêu tiền? (Ngày 5)', ex: 'How much are the small ones?', exVi: 'Mấy cái nhỏ bao nhiêu tiền?' },
          { w: 'Is this the right way to…?', pos: 'phr', ipa: '/ɪz ðɪs ðə ˈraɪt ˈweɪ tə/', vi: 'Đường này đúng đi… không? (Ngày 6)', ex: 'Excuse me, is this the right way to the art gallery?', exVi: 'Xin lỗi, đường này đúng đi bảo tàng tranh không?' },
          { w: "I've had … since / for…", pos: 'phr', ipa: '/aɪv ˈhæd… sɪns/', vi: 'Tôi bị… từ / được… rồi. (Ngày 7)', ex: "I've had a headache since lunch.", exVi: 'Tôi bị đau đầu từ trưa.' },
          { w: "I'll call you back.", pos: 'phr', ipa: '/aɪl ˈkɔːl ju ˈbæk/', vi: 'Mình gọi lại sau nhé. (Ngày 9)', ex: "I'm just getting off the tram. I'll call you back in five.", exVi: 'Mình đang xuống tàu. Năm phút nữa mình gọi lại.' },
          { w: "I'd love to, but…", pos: 'phr', ipa: '/aɪd ˈlʌv tə bət/', vi: 'Mình rất muốn, nhưng… (Ngày 10)', ex: "I'd love to, but I'm meeting a client at six.", exVi: 'Mình rất muốn, nhưng sáu giờ mình gặp khách.' },
          { w: "I've just…", pos: 'phr', ipa: '/aɪv ˈdʒʌst/', vi: 'Tôi vừa mới… (Ngày 12)', ex: "I've just landed. Where shall we meet?", exVi: 'Mình vừa hạ cánh. Mình gặp ở đâu nhỉ?' },
          { w: 'How long have you been…?', pos: 'phr', ipa: '/haʊ ˈlɔːŋ həv ju bɪn/', vi: 'Bạn đã… được bao lâu rồi? (Ngày 13)', ex: 'How long have you been in Melbourne?', exVi: 'Bạn ở Melbourne bao lâu rồi?' },
          { w: 'Have you ever…?', pos: 'phr', ipa: '/həv ju ˈevər/', vi: 'Bạn đã bao giờ… chưa? (Ngày 14)', ex: 'Have you ever tried Vietnamese iced coffee?', exVi: 'Bạn uống thử cà phê đá Việt Nam bao giờ chưa?' },
          { w: 'Would you mind + V-ing?', pos: 'phr', ipa: '/wʊdʒu ˈmaɪnd/', vi: 'Bạn có phiền… không? (nhờ lịch sự) (Ngày 15)', ex: 'Would you mind taking a photo of us?', exVi: 'Bạn chụp giúp bọn mình một tấm được không?' },
          { w: "I won't be able to…, because…", pos: 'phr', ipa: '/aɪ ˈwoʊnt bi ˈeɪbl tə… bɪˈkɔːz/', vi: 'Tôi sẽ không… được, vì… (Ngày 16)', ex: "I won't be able to join the call, because I'll be at the airport.", exVi: 'Tôi không tham gia cuộc gọi được, vì lúc đó tôi ở sân bay.' },
          { w: 'If…, I\'ll…', pos: 'phr', ipa: '/ɪf… aɪl/', vi: 'Nếu…, tôi sẽ… (Ngày 17)', ex: "If the line drops, I'll ring you straight back.", exVi: 'Nếu mất sóng, tôi gọi lại ngay.' },
          { w: "I'm not sure (that)…", pos: 'phr', ipa: '/aɪm ˈnɑːt ˈʃʊr ðət/', vi: 'Mình không chắc là… (không đồng ý mềm) (Ngày 18)', ex: "I'm not sure that's the best time. How about Friday?", exVi: 'Mình không chắc đó là giờ tốt nhất. Thứ Sáu thì sao?' },
          { w: 'What made you…?', pos: 'phr', ipa: '/ˈwʌt ˌmeɪd ju/', vi: 'Điều gì khiến bạn…? (giữ chuyện) (Ngày 19)', ex: 'What made you move to Australia?', exVi: 'Điều gì khiến bạn chuyển sang Úc?' },
          { w: 'I was told (that)…', pos: 'phr', ipa: '/aɪ wəz ˈtoʊld ðət/', vi: 'Tôi được báo là… (phàn nàn lịch sự) (Ngày 21)', ex: 'I was told the room would be ready by two.', exVi: 'Tôi được báo là phòng sẽ xong trước hai giờ.' },
          { w: 'If I…, could you…?', pos: 'phr', ipa: '/ɪf aɪ… kʊdʒu/', vi: 'Nếu tôi…, bạn có thể…? (thương lượng) (Ngày 22)', ex: 'If I paid in cash, could you do it for ninety?', exVi: 'Nếu tôi trả tiền mặt, anh để chín mươi được không?' },
          { w: 'Apparently…', pos: 'adv', ipa: '/əˈpærəntli/', vi: 'Nghe nói… (Ngày 23)', ex: "Apparently it's going to be forty degrees on Sunday.", exVi: 'Nghe nói chủ nhật sẽ bốn mươi độ.' },
          { w: 'Sorry, that came out wrong.', pos: 'phr', ipa: '/ˈsɑːri ðæt ˌkeɪm aʊt ˈrɔːŋ/', vi: 'Xin lỗi, mình nói ra không đúng ý. (Ngày 24)', ex: "Sorry, that came out wrong. I meant it's a quiet suburb, not a boring one.", exVi: 'Xin lỗi, mình nói không đúng ý. Ý mình là khu yên tĩnh, không phải khu chán.' },
          { w: 'Anyway, as I was saying, …', pos: 'phr', ipa: '/ˈeniweɪ əz aɪ wəz ˈseɪɪŋ/', vi: 'Thôi, quay lại chuyện lúc nãy… (Ngày 26)', ex: 'Anyway, as I was saying, the market closes at three.', exVi: 'Thôi, quay lại chuyện lúc nãy: chợ đóng cửa lúc ba giờ.' },
          { w: "I'm hoping to…", pos: 'phr', ipa: '/aɪm ˈhoʊpɪŋ tə/', vi: 'Mình hy vọng sẽ… (nói về mục tiêu) (Ngày 28)', ex: "I'm hoping to work abroad for a year or two.", exVi: 'Mình hy vọng được làm ở nước ngoài một, hai năm.' },
          { w: 'What I meant was…', pos: 'phr', ipa: '/ˌwʌt aɪ ˈment wəz/', vi: 'Ý tôi là… (gỡ hiểu lầm) (Ngày 29)', ex: 'What I meant was the twentieth, not the twelfth.', exVi: 'Ý tôi là ngày hai mươi, không phải ngày mười hai.' },
        ],
      },

      { t: 'h', text: '2. 🧱 Tổng ôn: 10 khung câu dùng nhiều nhất cả khoá' },
      {
        t: 'p',
        text: 'Ba mươi ngày có hơn **150 khung câu**. Mười khung dưới đây là những khung bạn sẽ dùng **mỗi ngày** khi sống và làm việc bằng tiếng Anh. Công thức chép đúng như mục 🧱 của ngày đã học; ví dụ là câu mới. Đọc to cả ba ví dụ của mỗi khung.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: '① Could you + V + …(, please)? — Ngày 2',
            vi: 'Nhờ, xin, hỏi lại. Khung dùng nhiều nhất của cả khoá.',
            examples: [
              { en: 'Could you say that again, please?', vi: 'Bạn nói lại giúp mình được không?' },
              { en: 'Could you send me the address?', vi: 'Bạn gửi mình địa chỉ được không?' },
              { en: 'Could you book me a taxi for six, please?', vi: 'Anh đặt giúp tôi taxi lúc sáu giờ được không?' },
            ],
          },
          {
            formula: '② Just to check / Just to confirm: + thông tin — Ngày 2',
            vi: 'Kiểm lại giờ, ngày, số, tên trước khi quá muộn.',
            examples: [
              { en: 'Just to confirm: the meeting is in room 4B, at eleven?', vi: 'Xác nhận lại: họp ở phòng 4B, lúc mười một giờ?' },
              { en: 'Just to check: is breakfast included?', vi: 'Hỏi lại chút: có kèm bữa sáng không?' },
              { en: 'Just to confirm: two nights, checking out on Saturday.', vi: 'Xác nhận lại: hai đêm, trả phòng thứ Bảy.' },
            ],
          },
          {
            formula: "③ I'd like + to V · Can / Could I have + N, please? — Ngày 4",
            vi: 'Gọi món, mua đồ, đặt chỗ, nói mong muốn.',
            examples: [
              { en: "I'd like to book a table for three on Friday.", vi: 'Tôi muốn đặt bàn cho ba người tối thứ Sáu.' },
              { en: 'Could I have the bill, please?', vi: 'Cho tôi xin hoá đơn.' },
              { en: "I'd like to change my seat, if possible.", vi: 'Tôi muốn đổi ghế, nếu được.' },
            ],
          },
          {
            formula: "④ S + 'll + V (quyết định tức thì) — Ngày 9",
            vi: 'Vừa quyết xong, nói ngay: hứa, đề nghị, chọn món.',
            examples: [
              { en: "I'll have the same, please.", vi: 'Cho tôi món giống vậy.' },
              { en: "Don't worry, I'll text you when I arrive.", vi: 'Đừng lo, tới nơi mình nhắn.' },
              { en: "It's heavy. I'll carry it for you.", vi: 'Nặng đấy. Để mình xách giúp.' },
            ],
          },
          {
            formula: "⑤ I'd love to, but + S + am / is / are + V-ing … — Ngày 10",
            vi: 'Từ chối lời mời mà không làm mất lòng.',
            examples: [
              { en: "I'd love to, but I'm working late tonight.", vi: 'Mình rất muốn, nhưng tối nay mình làm muộn.' },
              { en: "I'd love to, but we're visiting my grandparents on Sunday.", vi: 'Mình rất muốn, nhưng chủ nhật nhà mình về thăm ông bà.' },
              { en: "I'd love to, but I'm flying out tomorrow. Next time?", vi: 'Mình rất muốn, nhưng mai mình bay rồi. Lần sau nhé?' },
            ],
          },
          {
            formula: '⑥ How long have you + V3 + …? · Have you ever + V3 … ? — Ngày 13–14',
            vi: 'Hỏi để làm quen và giữ chuyện.',
            examples: [
              { en: 'How long have you lived here?', vi: 'Bạn sống ở đây bao lâu rồi?' },
              { en: 'Have you ever been to Đà Nẵng?', vi: 'Bạn đến Đà Nẵng bao giờ chưa?' },
              { en: 'How long have you worked with Leanne?', vi: 'Bạn làm với chị Leanne bao lâu rồi?' },
            ],
          },
          {
            formula: '⑦ Do you know / Could you tell me + Wh- / if + S + V · Would you mind + V-ing — Ngày 15',
            vi: 'Hỏi và nhờ người lạ, đồng nghiệp mới một cách lịch sự.',
            examples: [
              { en: 'Do you know where the nearest chemist is?', vi: 'Bạn có biết hiệu thuốc gần nhất ở đâu không?' },
              { en: 'Could you tell me if this tram goes to the museum?', vi: 'Anh cho tôi hỏi tàu này có tới bảo tàng không?' },
              { en: 'Would you mind keeping an eye on my bag for a minute?', vi: 'Bạn trông giúp túi mình một phút được không?' },
            ],
          },
          {
            formula: "⑧ S + won't be able to + V · because + S + V — Ngày 16",
            vi: 'Báo trước việc không làm được, kèm lý do.',
            examples: [
              { en: "I won't be able to make it on time, because my bus is stuck in traffic.", vi: 'Mình không tới kịp, vì xe buýt kẹt.' },
              { en: "Sorry, I won't be able to join tomorrow's lunch.", vi: 'Xin lỗi, mai mình không ăn trưa cùng được.' },
              { en: "We won't be able to finish today, because the shop's closed.", vi: 'Hôm nay mình không xong được, vì cửa hàng đóng rồi.' },
            ],
          },
          {
            formula: "⑨ I think (that) + S + V · I'm not sure (that) + S + V — Ngày 18",
            vi: 'Nêu ý kiến và không đồng ý mà vẫn lịch sự.',
            examples: [
              { en: 'I think the earlier train is a better option.', vi: 'Mình nghĩ chuyến tàu sớm hơn là lựa chọn tốt hơn.' },
              { en: "I'm not sure that's a good idea in this heat.", vi: 'Mình không chắc đó là ý hay khi trời nóng thế này.' },
              { en: "I think you're right, although it might be busy.", vi: 'Mình nghĩ bạn đúng, dù có thể sẽ đông.' },
            ],
          },
          {
            formula: '⑩ It might be worth + V-ing · Would it be okay if I + V-ed? — Ngày 24',
            vi: 'Góp ý mềm và xin phép mềm, nhất là với sếp, khách.',
            examples: [
              { en: 'It might be worth booking a table first.', vi: 'Có lẽ nên đặt bàn trước.' },
              { en: 'Would it be okay if I left my bag here?', vi: 'Tôi để túi ở đây có được không?' },
              { en: 'It might be worth bringing a jacket. The office is freezing.', vi: 'Có lẽ nên mang áo khoác. Văn phòng lạnh lắm.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Khi bạn cần…', 'Dùng khung', 'Ôn lại ở'],
        rows: [
          ['Nhờ, xin, hỏi lại', '① Could you…?', 'Ngày 2 · Ngày 9'],
          ['Không để lọt giờ, số, tên', '② Just to confirm: …', 'Ngày 2'],
          ['Gọi món, mua, đặt', "③ I'd like… / Could I have…?", 'Ngày 4 · Ngày 5'],
          ['Hứa, đề nghị ngay', "④ I'll…", 'Ngày 9'],
          ['Từ chối lời mời', "⑤ I'd love to, but…", 'Ngày 10'],
          ['Làm quen, giữ chuyện', '⑥ How long have you…? / Have you ever…?', 'Ngày 13 · Ngày 14 · Ngày 19'],
          ['Hỏi, nhờ người lạ', '⑦ Do you know where…? / Would you mind…?', 'Ngày 15'],
          ['Báo không làm được', "⑧ I won't be able to…, because…", 'Ngày 16'],
          ['Nêu ý kiến, không đồng ý', "⑨ I think… / I'm not sure…", 'Ngày 18'],
          ['Góp ý, xin phép mềm', '⑩ It might be worth… / Would it be okay if I…?', 'Ngày 24'],
        ],
        caption: 'Mười khung này phủ khoảng **80 %** việc bạn cần nói mỗi ngày. Phần còn lại (kể chuyện, thương lượng, gỡ hiểu lầm…) xây thêm trên nền đó.',
      },
      {
        t: 'rule',
        formula: 'Could you…? · Just to confirm… · I\'d like… · I\'ll… · I\'d love to, but… · Have you ever…? · Would you mind…? · I won\'t be able to… · I think / I\'m not sure… · It might be worth…',
        vi: 'Thuộc lòng mười khung này, mỗi khung một câu của riêng bạn. Gặp tình huống mới, đổi danh từ và động từ là có câu ngay.',
      },
      {
        t: 'note',
        title: 'Nối câu: cả khoá trong một bảng',
        items: [
          '**Chặng 1–2** (nối đơn giản): **and · but · so · because · first, then, after that, in the end**.',
          '**Chặng 3** (nối có lý do, có tương phản): **since / as · also / too · however · although**.',
          '**Chặng 4** (nối để mềm và để kể lại): **which · which means · apparently · it seems · that said · on a lighter note**.',
          '**Chặng 5** (nối để giữ mạch nói dài): **anyway · by the way · speaking of… · as I was saying · I mean · in other words**.',
          'Thử ngay: kể lại cảnh 5 của Phúc trong **4 câu**, mỗi câu dùng một từ nối từ một chặng khác nhau.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd30-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh bằng 10 khung câu (6 câu)',
        kind: 'translate',
        grammar: "Could you…? · Just to confirm… · I'd like to… · I'd love to, but… · Would you mind + V-ing? · It might be worth + V-ing",
        items: [
          { q: '(Khung ①) Bạn gửi giúp mình ảnh lúc nãy được không?', hint: 'Could you send me', answers: ['Could you send me the photo from earlier?', 'Could you send me that photo from earlier?', 'Could you send me the photo from before?', 'Could you send me the photo?', 'Could you send me that photo, please?', 'Could you send me the photo, please?'] },
          { q: '(Khung ②) Xác nhận lại: mình gặp ở cổng chính lúc sáu giờ, đúng không?', hint: "Just to confirm, we're meeting, is that right", answers: ["Just to confirm: we're meeting at the main gate at six, is that right?", "Just to confirm, we're meeting at the main gate at six, is that right?", 'Just to confirm: we are meeting at the main gate at six, is that right?', "Just to confirm: we're meeting at the main entrance at six, is that right?", "Just to confirm: we're meeting at the front gate at six, is that right?"] },
          { q: '(Khung ③) Tôi muốn đổi phòng khác yên tĩnh hơn.', hint: "I'd like to change to a quieter room", answers: ["I'd like to change to a quieter room.", 'I would like to change to a quieter room.', "I'd like to move to a quieter room.", "I'd like to change rooms to a quieter one.", "I'd like a quieter room, please."] },
          { q: '(Khung ⑤) Mình rất muốn, nhưng tối nay mình đi ăn với khách.', hint: "I'd love to, but, having dinner with a client", answers: ["I'd love to, but I'm having dinner with a client tonight.", 'I would love to, but I am having dinner with a client tonight.', "I'd love to, but I'm having dinner with a customer tonight.", "I'd love to, but tonight I'm having dinner with a client."] },
          { q: '(Khung ⑦) Anh chỉ giúp em cách mở cửa này được không?', hint: 'Would you mind showing me how to', answers: ['Would you mind showing me how to open this door?', 'Would you mind showing me how this door opens?', 'Would you mind showing me how to open the door?'] },
          { q: '(Khung ⑩) Có lẽ nên mang theo áo mưa.', hint: 'It might be worth bringing', answers: ['It might be worth bringing a raincoat.', 'It might be worth bringing an umbrella.', 'It might be worth taking a raincoat.', 'It might be worth bringing a rain jacket.', 'It could be worth bringing a raincoat.'] },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng (tổng kết)' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (khách, sếp lớn)'],
        rows: [
          ['Chào', "Hey! How's it going?", 'Morning! How are you?', 'Good morning. Nice to see you again.'],
          ['Nhờ', 'Can you grab me one?', 'Could you send me the file?', 'Would you mind sending me the file when you have a moment?'],
          ['Từ chối', "Can't, sorry! Next time?", "I'd love to, but I'm busy that day.", "Thank you for the invitation. Unfortunately, I won't be able to attend."],
          ['Không đồng ý', 'Nah, not sure about that.', "I'm not sure that'll work.", 'I can see your point. However, I wonder if…'],
          ['Xin lỗi', 'My bad!', "Sorry, that's my mistake.", 'I apologise for the confusion.'],
          ['Cảm ơn', 'Cheers! · Thanks heaps!', 'Thanks so much, I really appreciate it.', 'Thank you very much for your help.'],
        ],
        caption: 'Ba mươi ngày, một nguyên tắc: **không chắc thì chọn trung tính**. Nó hợp với gần như mọi người, mọi nơi.',
      },

      { t: 'h', text: '4. Kế hoạch 15 phút nhập vai' },
      {
        t: 'sodo',
        kind: 'flow',
        title: '15 phút với Gia sư AI — một ngày thu nhỏ',
        steps: [
          { label: '0–2′ Cà phê + hỏi đường', sub: 'Could I have…? · Sorry? · Is this the right…?' },
          { label: '2–4′ Một cuộc gọi', sub: "I'd love to, but… · I've had… since… · I'll call you back" },
          { label: '4–7′ Đồng nghiệp mới', sub: 'How long have you…? · Would you mind…? · I won\'t be able to…' },
          { label: '7–10′ Mua bán, giải thích', sub: 'If I…, could you…? · It\'s made from…, which… · might' },
          { label: '10–13′ Trò chuyện dài', sub: "kể chuyện had just… when · anyway · I'm hoping to…" },
          { label: '13–15′ Một tình huống khó', sub: 'Sorry, can I just finish? · What I meant was… · Just to confirm…' },
        ],
        caption: 'Không dừng lại khi sai. Sai thì sửa bằng "I mean…" rồi nói tiếp. Phần chấm để AI làm **sau** 15 phút.',
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật, gom từ cả khoá',
        items: [
          '~~I have a question want to ask.~~ → **Can I ask you something?** / **I\'ve got a quick question.** Câu đầu ghép hai động từ không có từ nối, dịch từng chữ "em có câu hỏi muốn hỏi".',
          '~~Can you explain me?~~ → **Could you explain that to me?** "explain" cần **cái được giải thích** trước, người nghe đứng sau **to**.',
          '~~Let\'s discuss about the plan.~~ → **Let\'s discuss the plan.** / **Let\'s talk about the plan.** "discuss" không có "about".',
          '~~I will return back on Friday.~~ → **I\'ll be back on Friday.** / **I\'ll return on Friday.** "return" đã là "quay lại".',
          '~~Let\'s go to home.~~ → **Let\'s go home.** "home" sau go / come / get không có "to".',
          '~~I\'m very interesting in AI.~~ → **I\'m really interested in AI.** "interesting" là cái **gây** hứng thú; người **thấy** hứng thú là "interested".',
          '~~Do you understand?~~ (nói với khách, đồng nghiệp) → **Does that make sense?** / **Is that clear?** Câu đầu nghe như thầy giáo kiểm tra học trò.',
          '~~Sorry, my English is not good.~~ (mở đầu mọi câu chuyện) → bỏ đi, cứ nói; cần thì **Could you speak a bit more slowly?** Xin lỗi trước làm người nghe phải dỗ bạn, và chính bạn tự hạ mình.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể: những điều quan trọng nhất của khoá' },
      {
        t: 'p',
        text: 'Ba mươi ngày qua, mỗi bài Nói có một mục ngôn ngữ cơ thể. Đây là tám điều đáng nhớ nhất khi bạn gặp người nước ngoài. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Tám điều đáng nhớ',
        items: [
          { anh: 'handshake', w: 'Nice to meet you.', ro: '/ˈnaɪs tə ˈmiːt ju/', vi: 'Anh, Mỹ, Úc: bắt tay **chắc, ngắn**, nhìn vào mắt. Bắt tay lỏng hoặc nhìn đi chỗ khác bị đọc là thiếu tự tin.' },
          { anh: 'person-bowing', w: 'Nice to meet you.', ro: '', vi: 'Với khách **Nhật**: cúi đầu nhẹ, đưa và nhận danh thiếp bằng hai tay. Họ chủ động bắt tay thì bắt tay.' },
          { anh: 'eyes', w: "Sorry, I didn't catch that.", ro: '/ˈsɑːri aɪ ˈdɪdnt ˈkætʃ ðæt/', vi: 'Nhìn vào người đang nói là **đang nghe**. Ở Việt Nam, cúi mắt với người lớn là lễ phép; ở Anh, Mỹ, Úc dễ bị hiểu là **không quan tâm** hoặc **giấu điều gì**.' },
          { anh: 'slightly-smiling-face', w: "How's it going?", ro: '/haʊz ɪt ˈɡoʊɪŋ/', vi: 'Mỉm cười khi chào người lạ (thu ngân, tài xế) là bình thường ở Mỹ, Úc. Cười khi **ngượng** hay khi **xin lỗi** thì cẩn thận: có thể bị hiểu là cười cợt.' },
          { anh: 'thumbs-up', w: 'Sounds good!', ro: '/ˈsaʊndz ˈɡʊd/', vi: 'Anh, Mỹ, Úc: "ổn, tốt". Ở một số nơi Trung Đông và Tây Phi có thể bị coi là **thô**: đi nước khác thì dùng lời.' },
          { anh: 'ok-hand', w: "That's perfect.", ro: '/ðæts ˈpɝːfɪkt/', vi: 'Mỹ: "ổn". Ở Nhật có thể hiểu là "tiền"; ở Brazil, Thổ Nhĩ Kỳ có thể là cử chỉ **thô tục**. Không chắc thì đừng dùng.' },
          { anh: 'person-shrugging', w: "I'm not sure, to be honest.", ro: '/aɪm ˈnɑːt ˈʃʊr tə bi ˈɑːnɪst/', vi: 'Nhún vai + hai tay mở = "mình không biết". Người Anh – Mỹ dùng nhiều; với khách trang trọng thì nói bằng lời thay vì nhún vai.' },
          { anh: 'waving-hand', w: 'See you tomorrow!', ro: '/ˈsiː ju təˈmɑːroʊ/', vi: '**Khoảng cách đứng**: Anh, Mỹ, Úc thường giữ khoảng **một cánh tay** với người mới quen. Đứng sát hơn, chạm vai, vỗ lưng khi chưa thân dễ làm người ta lùi lại.' },
        ],
      },

      { t: 'h', text: '7. Phát âm: sáu câu, sáu chặng' },
      {
        t: 'p',
        text: 'Mỗi câu ôn **một điểm phát âm** đã học: nối âm, dạng yếu, trọng âm câu, ngữ điệu. Đọc đúng nhịp quan trọng hơn đọc đúng từng âm: người nghe hiểu bạn nhờ **nhịp**.',
      },
      {
        t: 'phatam',
        id: 'gtd30-noi-phat-am',
        title: 'Đọc to 6 câu',
        note: 'Nghe mẫu, đọc theo, rồi bấm ghi âm. Mục tiêu hôm nay: cả sáu câu đều được chấm từ "khá" trở lên.',
        items: [
          { text: 'Could I have a flat white, please?', ipa: 'kʊd aɪ hæv ə flæt waɪt pliːz', vi: '"Could I" nối /kʊdaɪ/; "have a" nối /hævə/; lên giọng ở **please** (chặng 1).' },
          { text: "I'd love to, but I'm flying back on Saturday.", ipa: 'aɪd lʌv tu bət aɪm flaɪɪŋ bæk ɑːn ˈsætərdeɪ', vi: '**LOVE** nhấn, "to" ngân nhẹ khi đứng cuối cụm; "but" đọc yếu /bət/ (chặng 2).' },
          { text: 'Would you mind showing me how it works?', ipa: 'wʊdʒu maɪnd ʃoʊɪŋ mi haʊ ɪt wɝːks', vi: '"Would you" thành /wʊdʒu/; "how it" nối /haʊwɪt/ (chặng 3).' },
          { text: 'If I bought six, could you do them for a hundred and twenty?', ipa: 'ɪf aɪ bɔːt sɪks kʊdʒu duː ðəm fər ə ˈhʌndrəd ən ˈtwenti', vi: '"for a" đọc /fərə/; "and" đọc /ən/; nhấn **SIX** và **TWENty** (chặng 4).' },
          { text: 'I was gonna say no thanks and run.', ipa: 'aɪ wəz ˈɡʌnə seɪ noʊ θæŋks ən rʌn', vi: '"was" yếu /wəz/; **gonna** /ˈɡʌnə/; **thanks** có /θ/ (chặng 5).' },
          { text: 'Just to confirm: a taxi at four a.m. on Saturday.', ipa: 'dʒʌs tə kənˈfɝːm ə ˈtæksi ət fɔːr eɪ em ɑːn ˈsætərdeɪ', vi: '"Just to" rụng /t/ thành /dʒʌstə/; nhấn **FOUR**, **A.M.**, **SAT**urday: ba thông tin cần chắc (Ngày 29).' },
        ],
      },

      { t: 'h', text: '8. Nhập vai tổng hợp' },
      {
        t: 'dialogue',
        title: 'Mẫu: 2 phút đầu của buổi nhập vai — Gia sư AI đóng vai người bán cà phê, rồi chuyển sang người gọi điện',
        lines: [
          { who: 'AI (barista)', role: 'b', text: 'Hi there! What can I get you this morning?', vi: 'Chào bạn! Sáng nay bạn dùng gì?' },
          { who: 'Bạn', role: 'a', text: "Morning! Could I have a small latte and a croissant, please?", vi: 'Chào buổi sáng! Cho mình một latte nhỏ và một bánh sừng bò.' },
          { who: 'AI (barista)', role: 'b', text: 'Sure. Full cream, skim or oat?', vi: 'Được. Sữa nguyên kem, sữa tách béo hay sữa yến mạch?' },
          { who: 'Bạn', role: 'a', text: "Sorry? Full… what? Could you say that again?", vi: 'Xin lỗi? Full… gì cơ? Bạn nói lại được không?' },
          { who: 'AI (barista)', role: 'b', text: 'Ha, sorry. What kind of milk? Normal milk, low-fat, or oat milk?', vi: 'Ha, xin lỗi. Loại sữa nào? Sữa thường, ít béo, hay sữa yến mạch?' },
          { who: 'Bạn', role: 'a', text: "Oh, normal milk, thanks. And do you know if there's a pharmacy near here?", vi: 'À, sữa thường, cảm ơn. Bạn có biết gần đây có hiệu thuốc không?' },
          { who: 'AI (barista)', role: 'b', text: "There's a chemist two doors down, next to the bank. That'll be eleven dollars.", vi: 'Có một hiệu thuốc cách hai cửa, cạnh ngân hàng. Mười một đô nhé.' },
          { who: 'AI (bạn cũ gọi)', role: 'c', text: "Hey, it's Jem! Are you free for dinner tonight? We're trying that new ramen place.", vi: 'Này, Kai đây! Tối nay rảnh ăn tối không? Bọn mình thử quán ramen mới.' },
          { who: 'Bạn', role: 'a', text: "Jem! I'd love to, but I'm working late tonight. Could we do tomorrow instead? I'll call you back at lunch.", vi: 'Kai! Mình rất muốn, nhưng tối nay mình làm muộn. Mai được không? Trưa mình gọi lại nhé.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd30-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu cho buổi nhập vai (5 câu)',
        items: [
          { vi: 'Bạn có biết gần đây có hiệu thuốc không?', chips: ['Do', 'you', 'know', 'if', "there's", 'a', 'pharmacy', 'near', 'here?', 'is', 'there'], answer: ['Do', 'you', 'know', 'if', "there's", 'a', 'pharmacy', 'near', 'here?'] },
          { vi: 'Mình rất muốn, nhưng tối nay mình làm muộn.', chips: ["I'd", 'love', 'to,', 'but', "I'm", 'working', 'late', 'tonight.', 'work', 'will'], answer: ["I'd", 'love', 'to,', 'but', "I'm", 'working', 'late', 'tonight.'] },
          { vi: 'Bạn làm ở công ty này bao lâu rồi?', chips: ['How', 'long', 'have', 'you', 'worked', 'at', 'this', 'company?', 'do', 'work'], answer: ['How', 'long', 'have', 'you', 'worked', 'at', 'this', 'company?'] },
          { vi: 'Ý mình là thứ Bảy tuần sau, không phải thứ Bảy này.', chips: ['What', 'I', 'meant', 'was', 'next', 'Saturday,', 'not', 'this', 'Saturday.', 'mean', 'is'], answer: ['What', 'I', 'meant', 'was', 'next', 'Saturday,', 'not', 'this', 'Saturday.'] },
          { vi: 'Mình hy vọng năm sau được làm ở nước ngoài.', chips: ["I'm", 'hoping', 'to', 'work', 'abroad', 'next', 'year.', 'hope', 'working'], answer: ["I'm", 'hoping', 'to', 'work', 'abroad', 'next', 'year.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd30-noi-tra-loi',
        part: '2',
        questions: [
          'Describe a day when you had to use English all day, or imagine one. Where were you, who did you talk to, what went wrong, and how did you feel at the end of it? (Nói 2 phút.)',
          'Talk about the most useful thing you learned in this course and a real situation where you will use it. (Nói 2 phút.)',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI — đề bài 15 phút (chép nguyên đoạn)',
        items: [
          'Mở trang **/language/en/roleplay**, đặt hẹn giờ **15 phút**, dán đề bài dưới đây. Nói liền, không dừng lại tra từ.',
          '"Let\'s do a 15-minute role-play called \'A day in English\'. I am a Vietnamese IT intern on a one-week work trip in an English-speaking city. You play six different people, one after another, and you announce each new scene in one short line. Scene 1 (2 min): a barista; use one local word I probably don\'t know. Scene 2 (2 min): an old friend phoning to invite me somewhere on a day I can\'t go; the line is noisy, so mishear one thing. Scene 3 (3 min): a new colleague at the office; ask me questions to get to know me, and let me ask you for help with something. Scene 4 (3 min): a market seller; let me ask for a deal when buying several things, then ask me about a Vietnamese gift I brought. Scene 5 (3 min): two colleagues at after-work drinks; speak fast with gonna / wanna, change the topic once with \'by the way\', and ask about my plans after the internship. Scene 6 (2 min): a hotel receptionist who misunderstands a time I give and talks over me. Speak naturally at B2 level, about 180 words per minute. Do not correct me during the role-play. After scene 6, give me feedback in Vietnamese: (1) which of these I used: Could you…?, Just to confirm…, I\'d love to, but…, Have you ever…?, Would you mind…?, I won\'t be able to…, I\'m not sure…, It might be worth…, What I meant was…; (2) my five most important mistakes, with the correct sentence; (3) which scene was weakest, so I know which part of the course to review."',
          'Làm xong thì điền **phiếu tự chấm** ngay dưới. Làm lại buổi nhập vai này **mỗi tuần một lần** trong tháng tới, đổi thành phố mỗi lần (London, Sydney, Toronto…).',
        ],
      },
      {
        t: 'table',
        caption: 'Phiếu tự chấm sau 15 phút — mỗi dòng "có" được 1 điểm. Từ 7/10 trở lên: bạn đã sống được một ngày bằng tiếng Anh.',
        head: ['#', 'Tiêu chí', 'Có / Chưa', 'Chưa thì ôn'],
        rows: [
          ['1', 'Nói đủ 15 phút, không chuyển sang tiếng Việt', '', 'Ngày 26 (nói dài không đứt)'],
          ['2', 'Hỏi lại ít nhất 2 lần khi không nghe kịp, đúng chữ không hiểu', '', 'Ngày 2'],
          ['3', 'Xác nhận lại ít nhất 1 thông tin có giờ / số (Just to confirm…)', '', 'Ngày 2 · Ngày 29'],
          ['4', 'Từ chối một lời mời mà vẫn đưa phương án khác', '', 'Ngày 10'],
          ['5', 'Hỏi ít nhất 2 câu để làm quen và hỏi nối tiếp câu trả lời', '', 'Ngày 13 · Ngày 19'],
          ['6', 'Nhờ hoặc xin phép bằng câu lịch sự (Would you mind…? / Would it be okay if…?)', '', 'Ngày 15 · Ngày 24'],
          ['7', 'Đề nghị giá hoặc phương án bằng If I…, could you…?', '', 'Ngày 22'],
          ['8', 'Kể một chuyện nhỏ có mở đầu, cao trào, kết', '', 'Ngày 11 · Ngày 27'],
          ['9', 'Nói được 2 câu về mục tiêu của mình', '', 'Ngày 28'],
          ['10', 'Giữ lượt hoặc gỡ hiểu lầm mà không gắt (What I meant was…)', '', 'Ngày 29'],
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd30-viet',
    kind: 'writing',
    title: 'Nhật ký một ngày bằng tiếng Anh + tự chấm',
    goal: 'Viết một trang nhật ký 120–180 từ về một ngày của chính mình: đúng thì quá khứ, có từ chỉ thời gian, có cảm xúc và một điều rút ra; biết đổi cùng nội dung sang bản kể cho người khác đọc, rồi tự chấm bằng phiếu 10 tiêu chí.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao kết thúc khoá bằng nhật ký',
        items: [
          'Nhật ký là cách luyện viết **rẻ nhất và bền nhất**: mỗi tối 5 phút, không ai chấm, không sợ sai, và bạn **viết về đời mình**, nên từ học được là từ bạn thật sự cần.',
          'Một trang nhật ký tốt có **6 phần**: mở · sáng · trưa · tối · cảm xúc · điều rút ra và ngày mai.',
          'Ngữ pháp chính: **quá khứ đơn** (Ngày 11), **quá khứ hoàn thành** khi kể (Ngày 27), **wish I had + V3** khi tiếc, **I\'m going to / I\'m hoping to** cho ngày mai (Ngày 10, 28).',
          'Hai bản đặt cạnh nhau: **nhật ký riêng** (viết cho mình, thân) và **bài kể gửi người khác** (email, bài đăng, chỉn chu hơn).',
          'Cuối bài: bạn viết **nhật ký của chính bạn**, rồi tự chấm bằng **phiếu 10 tiêu chí**.',
        ],
      },

      { t: 'h', text: '1. Khung một trang nhật ký' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Sáu phần, khoảng 150 từ',
        steps: [
          { label: 'Mở', sub: 'Thursday, 12 November · What a day!' },
          { label: 'Sáng', sub: 'This morning I…' },
          { label: 'Trưa / chiều', sub: 'At lunch… · Later, …' },
          { label: 'Tối', sub: 'In the evening… · Tonight…' },
          { label: 'Cảm xúc', sub: 'The best / hardest part was… · I felt…' },
          { label: 'Rút ra + mai', sub: 'I learned that… · Tomorrow I\'m going to…' },
        ],
        caption: 'Không cần kể **mọi thứ**. Chọn 3–4 khoảnh khắc đáng nhớ, kể có chi tiết; phần còn lại bỏ qua.',
      },
      {
        t: 'passage',
        title: "Phúc's diary — Thursday night, Melbourne",
        intro: 'Đọc trang nhật ký của Phúc tối thứ Năm. Chỗ in đậm là từ nối, từ chỉ thời gian và cấu trúc nên học theo.',
        paras: [
          { label: 'Mở', text: 'Thursday, 12 November. **What a day!** My first full day in English, and I survived.' },
          { label: 'Sáng', text: '**This morning** I went to a little café near the hotel. I\'d **just** ordered a flat white **when** the barista offered me some "magic". **For a second**, I thought she was selling something illegal! **It turned out** to be a type of coffee, and it was amazing. **Then** I took the tram to the office. It was free, which still surprises me.' },
          { label: 'Trưa và chiều', text: '**At lunch**, I bought six mugs for the team at a market. I asked for a deal, **and** the seller gave me a better price **and** free gift bags. I gave him some coffee from home, **so** we were both happy. **After that**, I skipped the four o\'clock meeting, but I\'d messaged Leanne first.' },
          { label: 'Tối', text: '**In the evening**, Felix and Fern took me for drinks. They spoke **so fast that** I missed about half of it, **but** I told the magic story **and** they laughed. **Later**, the hotel receptionist almost booked my taxi for 4 p.m. instead of 4 a.m. I stopped her just in time.' },
          { label: 'Cảm xúc + rút ra', text: '**The hardest part was** the fast conversation at the bar. **I wish I had asked** them to slow down instead of just nodding. **The best part was** when Pippa said my English was great. **I learned that** asking again is not embarrassing; it saves you. **Tomorrow I\'m going to** ask at least one question in every conversation.' },
        ],
      },
      {
        t: 'note',
        title: 'Nhìn kỹ trang nhật ký của Phúc',
        items: [
          '**Thì**: gần như cả bài là **quá khứ đơn** (went, took, bought, gave). Hai chỗ **quá khứ hoàn thành**: "I\'d just ordered… when…" (việc trước, rồi bất ngờ) và "I\'d messaged Leanne first" (đã làm từ trước đó).',
          '**Từ chỉ thời gian** mở mỗi đoạn: This morning · At lunch · After that · In the evening · Later · Tomorrow. Người đọc (kể cả chính bạn sau này) đi theo được ngay.',
          '**Cảm xúc cụ thể**: không chỉ "I was happy", mà "**The best part was when** Pippa said…" Một khoảnh khắc cụ thể nhớ lâu hơn mười chữ "happy".',
          '**Một điều rút ra** và **một việc cho ngày mai**: đó là phần biến nhật ký thành công cụ học, không chỉ là ghi chép.',
          'Độ dài: khoảng **240 từ**. Bản của bạn **120–180 từ** là đủ.',
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Cùng một ngày, hai cách viết',
        cols: [
          {
            title: 'Nhật ký riêng (viết cho mình)',
            anh: 'notebook-with-decorative-cover',
            items: [
              'What a day! First full day in English. Survived.',
              'Café: "magic" = coffee, not drugs 😂',
              'Bought 6 mugs. Got a deal!',
              'Drinks: missed half. Should\'ve asked them to slow down.',
              'Tmrw: 1 question per conversation.',
            ],
          },
          {
            title: 'Bài kể gửi người khác (email cho chị trưởng nhóm)',
            anh: 'e-mail',
            items: [
              'Hi Quyên, just a quick update from Melbourne.',
              "Today was my first full day using only English, and it went better than I expected.",
              "I picked up gifts for the team at the market (don't tell anyone!).",
              'The hardest part was keeping up with fast conversation, so I\'m going to practise asking people to slow down.',
              'See you on Monday. Best, Phúc',
            ],
          },
        ],
        caption: 'Nhật ký riêng được **viết tắt, bỏ chủ ngữ, dùng biểu tượng**. Bài cho người khác đọc thì **câu đủ, có chào và kết**, bỏ chuyện quá riêng.',
      },

      { t: 'h', text: '2. Khung câu cho nhật ký' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'This morning / Earlier today / Tonight + S + V2',
            vi: 'Mở đoạn bằng thời gian; kể bằng quá khứ đơn.',
            examples: [
              { en: 'This morning I missed my bus by ten seconds.', vi: 'Sáng nay mình lỡ xe buýt đúng mười giây.' },
              { en: 'Earlier today I had my first video call with the client.', vi: 'Hồi sáng mình có cuộc gọi video đầu tiên với khách.' },
              { en: 'Tonight I cooked phở for my flatmates.', vi: 'Tối nay mình nấu phở cho bạn cùng nhà.' },
            ],
          },
          {
            formula: "S + had just + V3 + when + S + V2",
            vi: '"Vừa… thì…": dựng khoảnh khắc bất ngờ (Ngày 27).',
            examples: [
              { en: "I'd just sat down when the fire alarm went off.", vi: 'Mình vừa ngồi xuống thì chuông báo cháy kêu.' },
              { en: "We'd just ordered when the power went out.", vi: 'Bọn mình vừa gọi món thì mất điện.' },
              { en: "I'd just left the house when it started pouring.", vi: 'Mình vừa ra khỏi nhà thì trời đổ mưa.' },
            ],
          },
          {
            formula: 'The best / hardest part (of the day) was + N / V-ing / when + S + V2',
            vi: 'Chọn một khoảnh khắc để nói cảm xúc.',
            examples: [
              { en: 'The hardest part was understanding the Scottish engineer.', vi: 'Khó nhất là nghe hiểu anh kỹ sư người Scotland.' },
              { en: 'The best part was when my manager thanked me in front of everyone.', vi: 'Vui nhất là lúc sếp cảm ơn mình trước mọi người.' },
              { en: 'The funniest part was watching Felix try to use chopsticks.', vi: 'Buồn cười nhất là xem Felix cố dùng đũa.' },
            ],
          },
          {
            formula: 'I felt + adj + when + S + V2 · It made me feel + adj',
            vi: 'Tả cảm xúc gắn với sự việc.',
            examples: [
              { en: 'I felt nervous when the client asked me a question.', vi: 'Mình thấy hồi hộp khi khách hỏi mình.' },
              { en: 'It made me feel proud of myself.', vi: 'Việc đó làm mình thấy tự hào về bản thân.' },
              { en: 'I felt a bit silly when I realised my mistake.', vi: 'Mình thấy hơi ngớ ngẩn khi nhận ra lỗi của mình.' },
            ],
          },
          {
            formula: 'I wish I had + V3 · Next time, I\'m going to + V',
            vi: 'Tiếc một điều, rồi biến nó thành kế hoạch.',
            examples: [
              { en: 'I wish I had asked her name.', vi: 'Giá mà mình đã hỏi tên cô ấy.' },
              { en: "I wish I'd brought an umbrella.", vi: 'Giá mà mình mang ô.' },
              { en: "Next time, I'm going to prepare three questions before the meeting.", vi: 'Lần sau mình sẽ chuẩn bị ba câu hỏi trước buổi họp.' },
            ],
          },
          {
            formula: "I learned that + S + V · Tomorrow I'm + V-ing / I'm hoping to + V",
            vi: 'Kết trang: một điều rút ra + ngày mai.',
            examples: [
              { en: 'I learned that people are happy to repeat things.', vi: 'Mình học được rằng người ta sẵn lòng nói lại.' },
              { en: "Tomorrow I'm meeting Rory for dinner.", vi: 'Mai mình đi ăn tối với Rory.' },
              { en: "I'm hoping to finish the report by Friday.", vi: 'Mình hy vọng xong báo cáo trước thứ Sáu.' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Thời gian + quá khứ đơn · had just + V3 + when · The best / hardest part was… · I felt… when… · I wish I had + V3 · I learned that… · Tomorrow I\'m + V-ing',
        vi: 'Nhật ký kể chuyện đã qua nên chủ yếu dùng quá khứ; chỉ câu "điều rút ra" và "ngày mai" mới quay về hiện tại, tương lai.',
      },
      {
        t: 'table',
        head: ['Muốn nói', '✅ Đúng', '❌ Hay viết sai'],
        rows: [
          ['sáng nay', 'this morning', '~~today morning~~ · ~~in this morning~~'],
          ['tối nay', 'tonight · this evening', '~~today night~~ · ~~tonight evening~~'],
          ['tối qua', 'last night · yesterday evening', '~~yesterday night~~ (người ta hiểu, nhưng ít dùng)'],
          ['hồi sáng / lúc nãy', 'earlier today · earlier', '~~before~~ (đứng một mình)'],
          ['sau đó', 'after that · later · then', '~~after~~ (đứng một mình đầu câu)'],
          ['cuối cùng', 'in the end · finally', '~~at the end~~ (khi không có "of…")'],
        ],
        caption: '"this / last / tonight" đi **không có giới từ**: không viết "in this morning", "on last Friday".',
      },
      {
        t: 'note',
        title: 'Người Việt hay viết sai trong nhật ký',
        items: [
          '~~Today morning I woke up late.~~ → **This morning** I woke up late. Tiếng Anh không ghép "today" với buổi trong ngày.',
          '~~After work I went back hotel.~~ → I went back **to the** hotel. Chỉ **home** mới đi thẳng không "to".',
          '~~I was happy because of I finished early.~~ → I was happy **because** I finished early. "because of" chỉ đi với danh từ: because of the rain.',
          '~~I feel tired but I am happy.~~ (viết về hôm nay đã qua) → I **felt** tired but happy. Nhật ký buổi tối kể chuyện ban ngày: quá khứ.',
          '~~Overall, today is a good day.~~ → Overall, **it was** a good day. Ngày đã hết khi bạn viết.',
          '~~I learned a lot of experiences.~~ → I learned a lot. / I **gained a lot of experience**. "experience" (kinh nghiệm) không đếm được, và không đi với "learn".',
        ],
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd30-viet-ghep',
        title: 'Sắp xếp câu nhật ký (4 câu)',
        items: [
          { vi: 'Sáng nay mình lỡ xe buýt.', chips: ['This', 'morning', 'I', 'missed', 'the', 'bus.', 'Today', 'miss', 'in'], answer: ['This', 'morning', 'I', 'missed', 'the', 'bus.'] },
          { vi: 'Mình vừa ra khỏi nhà thì trời đổ mưa.', chips: ["I'd", 'just', 'left', 'the', 'house', 'when', 'it', 'started', 'raining.', 'leave', 'while'], answer: ["I'd", 'just', 'left', 'the', 'house', 'when', 'it', 'started', 'raining.'] },
          { vi: 'Khó nhất là hiểu giọng của khách.', chips: ['The', 'hardest', 'part', 'was', 'understanding', 'the', "client's", 'accent.', 'understand', 'most'], answer: ['The', 'hardest', 'part', 'was', 'understanding', 'the', "client's", 'accent.'] },
          { vi: 'Giá mà mình đã hỏi lại.', chips: ['I', 'wish', 'I', 'had', 'asked', 'again.', 'have', 'ask'], answer: ['I', 'wish', 'I', 'had', 'asked', 'again.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd30-viet-dien',
        title: 'Điền một từ cho trang nhật ký (6 câu)',
        kind: 'fill',
        grammar: 'this · just · part · felt · wish · going',
        items: [
          { q: '___ morning I had my first meeting with the whole team.', answers: ['This', 'this'] },
          { q: "I'd ___ arrived when my manager called me into her office.", answers: ['just'] },
          { q: 'The best ___ of the day was lunch with Felix.', answers: ['part'] },
          { q: 'I ___ really nervous when they asked me to introduce myself.', answers: ['felt', 'was'] },
          { q: 'I ___ I had brought a jacket. The office was freezing.', answers: ['wish'] },
          { q: "Tomorrow I'm ___ to ask more questions.", answers: ['going'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd30-viet-dich',
        title: 'Tự viết 5 câu nhật ký (dịch Việt → Anh)',
        kind: 'translate',
        grammar: 'This morning + V2 · I felt + adj + when… · The best part was… · I wish I had + V3 · Tomorrow I\'m going to + V',
        items: [
          { q: 'Sáng nay mình dậy muộn và lỡ tàu.', hint: 'This morning, woke up late, missed', answers: ['This morning I woke up late and missed the train.', 'This morning I woke up late and missed my train.', 'I woke up late this morning and missed the train.', 'This morning, I woke up late and missed the train.', 'This morning I got up late and missed the train.'] },
          { q: 'Mình thấy hồi hộp khi sếp gọi tên mình.', hint: 'I felt nervous when, called my name', answers: ['I felt nervous when my manager called my name.', 'I felt nervous when my boss called my name.', 'I was nervous when my manager called my name.', 'I was nervous when my boss called my name.'] },
          { q: 'Vui nhất là lúc cả team cười câu đùa của mình.', hint: 'The best part was when, laughed at my joke', answers: ['The best part was when the whole team laughed at my joke.', 'The best part was when everyone on the team laughed at my joke.', 'The best part was when the team laughed at my joke.'] },
          { q: 'Giá mà mình đã chuẩn bị kỹ hơn.', hint: 'I wish I had prepared', answers: ['I wish I had prepared better.', "I wish I'd prepared better.", 'I wish I had prepared more.', "I wish I'd prepared more.", 'I wish I had prepared more carefully.'] },
          { q: 'Mai mình sẽ hỏi lại mỗi khi không hiểu.', hint: "Tomorrow I'm going to, whenever I don't understand", answers: ["Tomorrow I'm going to ask again whenever I don't understand.", 'Tomorrow I am going to ask again whenever I do not understand.', "Tomorrow I'm going to ask again every time I don't understand.", "Tomorrow I'll ask again whenever I don't understand."] },
        ],
      },

      { t: 'h', text: '4. Viết nhật ký của bạn và tự chấm' },
      {
        t: 'note',
        title: 'Đề bài',
        items: [
          'Viết **một trang nhật ký 120–180 từ** về **hôm nay** (hoặc một ngày gần đây có chuyện đáng nhớ). Theo khung 6 phần ở mục 1.',
          'Bắt buộc có: **3 từ chỉ thời gian** khác nhau · **1 câu had just… when…** · **1 câu The best / hardest part was…** · **1 câu I wish I had…** · **1 câu cho ngày mai**.',
          'Viết xong, đọc to một lượt. Chỗ nào đọc to bị vấp, chỗ đó câu đang quá dài hoặc sai.',
          'Muốn được sửa: mở **/language/en/roleplay**, dán bài kèm câu "**Please correct my diary entry. Show each mistake, the correct version, and explain in Vietnamese. Then rewrite it as a natural B2 version, keeping my ideas.**"',
        ],
      },
      {
        t: 'table',
        caption: 'Phiếu tự chấm nhật ký — mỗi dòng "có" được 1 điểm. Từ 7/10 trở lên là trang nhật ký tốt.',
        head: ['#', 'Tiêu chí', 'Có / Chưa', 'Chưa thì ôn'],
        rows: [
          ['1', 'Dài 120–180 từ, đủ 6 phần (mở · sáng · trưa · tối · cảm xúc · rút ra)', '', 'Mục 1 bài này'],
          ['2', 'Kể bằng **quá khứ đơn**, không lẫn hiện tại', '', 'Ngày 11'],
          ['3', 'Động từ bất quy tắc đúng (went, took, bought, felt, left…)', '', 'Ngày 11'],
          ['4', 'Có **3 từ chỉ thời gian** khác nhau, đúng (this morning, không "today morning")', '', 'Bảng mục 2 bài này'],
          ['5', 'Có ít nhất **3 từ nối** khác nhau (and, but, so, because, after that, although…)', '', 'Ngày 3 · Ngày 18 · Ngày 26'],
          ['6', 'Có **1 câu had just + V3 + when** đúng', '', 'Ngày 27'],
          ['7', 'Có **1 cảm xúc gắn với sự việc cụ thể** (The best part was when…)', '', 'Ngày 12'],
          ['8', 'Có **1 câu I wish I had + V3**', '', 'Mục 2 bài này'],
          ['9', 'Có **1 điều rút ra** và **1 việc cho ngày mai**', '', 'Ngày 10 · Ngày 28'],
          ['10', 'Đọc to trôi chảy, không câu nào quá 25 từ', '', 'Ngày 26'],
        ],
      },
      {
        t: 'note',
        title: 'Giữ thói quen',
        items: [
          'Mỗi tối **5 câu** là đủ. Không cần đẹp, không cần dài. Ba mươi tối = 150 câu tiếng Anh về chính đời bạn.',
          'Cuối tuần đọc lại cả tuần, gạch chân **một lỗi lặp lại**, tuần sau chỉ tập trung sửa lỗi đó.',
          'Từ mới gặp trong ngày mà bạn phải tra: viết luôn vào nhật ký, trong một câu của riêng bạn. Đó là cách nhớ từ lâu nhất.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd30-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 30',
    goal: 'Làm 32 câu có đáp án trộn đủ năm chặng: chọn câu hợp cảnh trong một ngày sống bằng tiếng Anh, điền đúng 10 khung câu, viết nhật ký đúng thì, nghe chép và ghép câu.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 32 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Mỗi câu ghi **(chặng N)** hoặc **(Ngày N)**: câu sai thuộc chặng nào thì biết ôn chỗ đó.',
          'Làm không nhìn bài. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **26/32** trở lên thì làm **Kiểm tra chặng 5** ngay sau bài này, rồi đọc **Tổng kết khoá** ở cuối bài kiểm tra.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd30-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: '(Chặng 1) Người bán hỏi "Having it here or taking away?" Bạn muốn mang đi:',
            options: ['Take away, please.', 'Taking away, thanks.', 'I take.', 'Go out.'],
            correct: 1,
            why: 'Đáp theo đúng dạng câu hỏi: **Taking away, thanks.** ("Take away, please." người ta vẫn hiểu, nhưng không khớp câu hỏi bằng.) Ở Mỹ họ hỏi "For here or to go?" → "To go, please."',
          },
          {
            q: '(Chặng 1) Bạn nghe một chữ lạ trong câu của người bán. Câu tốt nhất:',
            options: ['(gật đầu)', 'Sorry? Your… flat white? What does that mean?', 'Again!', 'I don\'t hear.'],
            correct: 1,
            why: 'Nhắc lại **đúng chữ** không hiểu + **What does … mean?** (Ngày 2).',
          },
          {
            q: '(Chặng 2) Bạn cũ mời đi chơi đúng hôm bạn bận. Câu tự nhiên nhất:',
            options: ['No, I am busy.', "I'd love to, but I'm visiting my aunt that day. How about Sunday?", "I can't. Bye.", 'Maybe, maybe.'],
            correct: 1,
            why: "**I'd love to, but** + kế hoạch (hiện tại tiếp diễn) + phương án khác (Ngày 10).",
          },
          {
            q: '(Chặng 2) Bạn bè hỏi vì sao giọng bạn khàn. Bạn đã đau họng hai ngày:',
            options: ['I have sore throat two days.', "I've had a sore throat for two days.", 'I am sore throat.', 'My throat is pain since two days.'],
            correct: 1,
            why: "**I've had + triệu chứng + for + khoảng thời gian** (Ngày 7).",
          },
          {
            q: '(Chặng 3) Ngày đầu ở văn phòng mới, bạn cần tìm phòng họp:',
            options: ['Where is meeting room?', 'Do you know where meeting room 3A is?', 'Tell me the room.', 'Do you know where is meeting room 3A?'],
            correct: 1,
            why: 'Câu hỏi gián tiếp: sau **Do you know where** thì **S + V** (where meeting room 3A **is**), không đảo (Ngày 15).',
          },
          {
            q: '(Chặng 3) Bạn không dự được buổi họp chiều. Câu báo tốt nhất:',
            options: ["I won't be able to make the three o'clock meeting, because I have a dentist appointment.", "I can't come. Sorry.", 'I absent.', "I won't can come."],
            correct: 0,
            why: "**I won't be able to + V … because…** (Ngày 16).",
          },
          {
            q: '(Chặng 4) Bạn muốn xin giá tốt hơn khi mua ba món:',
            options: ['Cheaper!', 'If I bought three, could you do them for forty?', 'Give me discount.', 'Forty or I go.'],
            correct: 1,
            why: '**If I + V2, could you…?** = đề nghị mềm (Ngày 22). Ở Úc, Anh, mặc cả từng món không phổ biến; xin giá khi mua nhiều thì bình thường.',
          },
          {
            q: '(Chặng 4) Bạn tặng khách gói trà và muốn giải thích:',
            options: ["It's grown in the north, which is why it tastes a bit smoky.", 'It grow in north.', 'Tea is very delicious.', 'This tea made by north.'],
            correct: 0,
            why: 'Bị động **is grown** + **which** để nói thêm (Ngày 20).',
          },
          {
            q: '(Chặng 5) Đang kể chuyện thì bị cắt để hỏi chuyện khác. Bạn quay lại:',
            options: ['By the way, the story.', 'Anyway, as I was saying, …', 'Speaking of, …', 'In other words, …'],
            correct: 1,
            why: '**Anyway, as I was saying** = quay lại mạch cũ (Ngày 26).',
          },
          {
            q: '(Ngày 29) Lễ tân nói át bạn và đặt nhầm giờ. Câu tốt nhất:',
            options: ['You are wrong!', 'Sorry, can I just jump in? What I meant was six in the morning.', 'Stop! Listen me!', 'My meaning is six morning.'],
            correct: 1,
            why: 'Chen lời lịch sự + câu chẻ **What I meant was…** (Ngày 29).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ (10 khung câu cả khoá)' },
      {
        t: 'quiz',
        id: 'gtd30-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'Could · confirm · like · love · ever · mind · able · worth',
        items: [
          { q: '(Khung ①) ___ you text me the address, please?', answers: ['Could', 'could', 'Can', 'can'] },
          { q: '(Khung ②) Just to ___: we check out at eleven, is that right?', answers: ['confirm', 'check'] },
          { q: "(Khung ③) I'd ___ to book a table for two, please.", answers: ['like'] },
          { q: "(Khung ⑤) I'd ___ to, but I'm working on Saturday.", answers: ['love'] },
          { q: '(Khung ⑥) Have you ___ tried bún bò Huế?', answers: ['ever'] },
          { q: '(Khung ⑦) Would you ___ holding the door for me?', answers: ['mind'] },
          { q: "(Khung ⑧) I won't be ___ to come, because my flight's delayed.", answers: ['able'] },
          { q: '(Khung ⑩) It might be ___ checking the weather first.', answers: ['worth'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd30-bt-dich',
        title: 'Phần III — Dịch (6 câu)',
        kind: 'translate',
        grammar: "I'll… · I'm not sure (that)… · I was told… · I'd just + V3 when… · I've been + V-ing · This morning…",
        items: [
          { q: '(Ngày 9) Để mình xách giúp.', hint: "I'll carry it", answers: ["I'll carry it for you.", 'I will carry it for you.', "I'll carry that for you.", "Let me carry it for you."] },
          { q: '(Ngày 18) Mình không chắc đó là ý hay.', hint: "I'm not sure, that's a good idea", answers: ["I'm not sure that's a good idea.", 'I am not sure that is a good idea.', "I'm not sure it's a good idea.", "I'm not sure that it's a good idea."] },
          { q: '(Ngày 21) Tôi được báo là phòng sẽ xong trước hai giờ.', hint: 'I was told, would be ready', answers: ['I was told the room would be ready by two.', 'I was told that the room would be ready by two.', 'I was told the room would be ready before two.', 'I was told that the room would be ready before two.', "I was told the room would be ready by two o'clock."] },
          { q: '(Ngày 27) Mình vừa ngồi xuống thì điện thoại reo.', hint: "I'd just sat down when, rang", answers: ["I'd just sat down when my phone rang.", 'I had just sat down when my phone rang.', "I'd just sat down when the phone rang.", 'I had just sat down when the phone rang.'] },
          { q: '(Ngày 28) Mình học tiếng Anh mỗi ngày suốt một tháng nay.', hint: "I've been, for a month", answers: ["I've been studying English every day for a month.", 'I have been studying English every day for a month.', "I've been learning English every day for a month.", "I've been studying English every day for a month now.", "I've been practising English every day for a month."] },
          { q: '(Nhật ký) Sáng nay mình dậy sớm và chạy bộ.', hint: 'This morning, got up early, went for a run', answers: ['This morning I got up early and went for a run.', 'This morning I woke up early and went for a run.', 'I got up early this morning and went for a run.', 'This morning, I got up early and went for a run.', 'This morning I got up early and went running.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và gõ lại' },
      {
        t: 'dictation',
        id: 'gtd30-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1 (chặng 1)', spell: 'Could I have the bill, please?', answer: 'Could I have the bill, please?', alt: ['Could I have the bill please?'] },
          { label: 'Câu 2 (chặng 3)', spell: 'How long have you been at this company?', answer: 'How long have you been at this company?' },
          { label: 'Câu 3 (chặng 5)', spell: "I'm hoping to work abroad next year.", answer: "I'm hoping to work abroad next year.", alt: ['I am hoping to work abroad next year.'] },
          { label: 'Câu 4 (nhật ký)', spell: 'The hardest part was keeping up with the conversation.', answer: 'The hardest part was keeping up with the conversation.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd30-bt-ghep',
        title: 'Phần V — Ghép câu (4 câu)',
        items: [
          { vi: '(Chặng 1) Đường này đúng đi ga tàu không?', chips: ['Is', 'this', 'the', 'right', 'way', 'to', 'the', 'station?', 'go', 'true'], answer: ['Is', 'this', 'the', 'right', 'way', 'to', 'the', 'station?'] },
          { vi: '(Chặng 2) Mình gọi lại sau năm phút nhé.', chips: ["I'll", 'call', 'you', 'back', 'in', 'five', 'minutes.', 'after', 'will'], answer: ["I'll", 'call', 'you', 'back', 'in', 'five', 'minutes.'] },
          { vi: '(Chặng 4) Xin lỗi, mình nói ra không đúng ý.', chips: ['Sorry,', 'that', 'came', 'out', 'wrong.', 'go', 'false'], answer: ['Sorry,', 'that', 'came', 'out', 'wrong.'] },
          { vi: '(Nhật ký) Giá mà mình đã hỏi tên cô ấy.', chips: ['I', 'wish', 'I', 'had', 'asked', 'her', 'name.', 'ask', 'have'], answer: ['I', 'wish', 'I', 'had', 'asked', 'her', 'name.'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG 5 + TỔNG KẾT KHOÁ ═══════════════════════════ */
  {
    id: 'gtd30-kiem-tra',
    kind: 'review',
    title: 'Kiểm tra chặng 5 (Ngày 25–30) + Tổng kết khoá',
    goal: 'Tự đo mức nắm chắc chặng 5 "Tự nhiên" (Ngày 25–30): nghe một buổi dã ngoại nói nhanh có một sự cố nhỏ, chọn câu hợp cảnh, dùng đúng ngữ pháp từng ngày, tự viết; đạt ≥ 70 % từng phần. Sau đó đọc tổng kết khoá và lập kế hoạch tự luyện 15 phút mỗi ngày.',
    minutes: 50,
    blocks: [
      {
        t: 'recap',
        title: 'Bài kiểm tra này đo gì',
        items: [
          '**4 phần, 46 câu, khoảng 45 phút**: Nghe · Mẫu câu hợp cảnh · Ngữ pháp · Viết. Toàn bộ là kiến thức **Ngày 25–30**.',
          '**Đạt** = từ **70 %** trở lên ở **từng phần**. Trượt phần nào thì ôn đúng Ngày ghi ở bảng dưới.',
          'Mọi câu đều **mới**: người mới, cảnh mới, câu mới. Mỗi câu ghi **(Ngày N)**.',
          'Bài nghe ở tốc độ **khoảng 180 từ/phút**, không có dịch.',
          'Cuối bài là **🎓 Tổng kết khoá**: học xong làm được gì, tự luyện tiếp thế nào, kế hoạch 15 phút mỗi ngày.',
        ],
      },
      {
        t: 'sodo',
        kind: 'mindmap',
        title: 'Chặng 5 (Ngày 25–30) — những gì sẽ bị kiểm',
        center: 'Ngày 25–30',
        branches: [
          { label: 'N25 Nghe nói nhanh', items: ['gonna · wanna · gotta · kinda', 'nối âm, whaddaya', 'hỏi lại đúng chỗ lạc'], anh: 'ear' },
          { label: 'N26 Trò chuyện dài', items: ['anyway · by the way', 'speaking of… · as I was saying', 'giữ mạch, kết thúc khéo'], anh: 'speech-balloon' },
          { label: 'N27 Kể chuyện, đùa', items: ['had just + V3 … when', 'by the time … had already', 'hiểu câu đùa, chơi chữ'], anh: 'face-with-tears-of-joy' },
          { label: 'N28 Nói về bản thân', items: ["I've been + V-ing", "I'm hoping to…", 'câu chuyện 2 phút'], anh: 'man-technologist' },
          { label: 'N29 Tình huống khó', items: ['What I meant was… (câu chẻ)', 'Sorry, can I just finish?', 'gọi cấp cứu đúng số, đúng thứ tự'], anh: 'ambulance' },
          { label: 'N30 Một ngày bằng tiếng Anh', items: ['10 khung câu cả khoá', 'nhật ký: this morning, wish I had', 'Just to confirm…'], anh: 'notebook-with-decorative-cover' },
        ],
        caption: 'Câu sai nằm ở nhánh nào thì ôn đúng ngày đó.',
      },
      {
        t: 'note',
        title: 'Cách làm bài',
        items: [
          '**Gập sách**: không mở lại bài học, không tra từ điển, không hỏi Gia sư AI trong lúc làm.',
          'Thời gian gợi ý: Nghe 12′ · Mẫu câu 10′ · Ngữ pháp 8′ · Viết 15′.',
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
          ['1. Nghe', '8 + 4', '≥ 9/12 (cộng hai khối)', 'Ngày 25 · Nghe (nói nhanh) — Ngày 26 · Nghe (trò chuyện dài) — Ngày 27 · Nghe (kể chuyện) — Ngày 28 · Nghe (nói về bản thân) — Ngày 29 · Nghe (cảnh 3, gọi cấp cứu)'],
          ['2. Mẫu câu hợp cảnh', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục câu dùng được ngay và bảng ba mức lịch sự'],
          ['3. Ngữ pháp', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục 🧱 Câu này ghép thế nào'],
          ['4. Viết', '6 + 4', '≥ 7/10 (cộng hai khối)', 'Ngày 26 · Viết (email kể chuyện dài) — Ngày 28 · Viết (giới thiệu bản thân) — Ngày 30 · Viết (nhật ký)'],
        ],
      },

      /** ───────────── 1. Nghe ───────────── **/
      { t: 'h', text: 'Phần 1 — Nghe (12 câu · đạt ≥ 9 · trượt thì ôn Ngày 25, 26, 27, 29)' },
      {
        t: 'canh',
        anh: ['beach-with-umbrella', 'woman-technologist', 'man-office-worker', 'adhesive-bandage', 'sun-with-face', 'sandwich'],
        caption: 'Chủ nhật, biển **Mỹ Khê, Đà Nẵng**. **Duyên**, kỹ sư phần mềm mới đi làm, đi dã ngoại với ba đồng nghiệp nước ngoài: **Ezra** (Mỹ), **Maura** (Ireland), **Callan** (Úc). Họ nói nhanh, đổi chủ đề liên tục, rồi có một sự cố nhỏ.',
      },
      {
        t: 'listen',
        id: 'gtd30-kt-nghe',
        title: 'Test — A Sunday at Mỹ Khê beach',
        note: 'Nghe tối đa 2 lần. Ghi ra giấy: Ezra muốn làm gì sau bữa trưa; Duyên đang làm gì và hy vọng gì; chuyện ở khách sạn; Callan bị làm sao; Duyên nói số nào và vì sao; Duyên ngắt lời ai, nói gì; cuối cùng ai được "giao" mua kem.',
        lines: [
          { who: 'Ezra', voice: 'us-nam', text: "So, whaddaya guys wanna do after lunch? I'm kinda tempted by a nap." },
          { who: 'Maura', voice: 'ie-nu', text: "A nap? It's a gorgeous day! By the way, Duyên, how's the new job going?" },
          { who: 'Duyên', voice: 'uk-nu', text: "Really well, thanks. I've been working on the hotel booking app for about three months, and I'm hoping to move to the design team next year." },
          { who: 'Callan', voice: 'au-nam', text: 'Speaking of hotels, did you ever sort out that thing with your room in Hội An?' },
          { who: 'Duyên', voice: 'uk-nu', text: "Oh, that's a funny story. I'd just got to the front desk when the receptionist told me my room had been given to a famous singer." },
          { who: 'Ezra', voice: 'us-nam', text: 'No way. Who?' },
          { who: 'Duyên', voice: 'uk-nu', text: "She wouldn't tell me! Anyway, as I was saying, they felt so bad that they upgraded me to a suite with a river view." },
          { who: 'Maura', voice: 'ie-nu', text: 'Best mix-up ever.' },
          { who: 'Callan', voice: 'au-nam', text: "Ow! Ah, mate, I've just stood on something. There's glass in the sand." },
          { who: 'Maura', voice: 'ie-nu', text: "Oh God, it's bleeding quite a bit. Should we call 999?" },
          { who: 'Duyên', voice: 'uk-nu', text: "Here it's 115 for an ambulance. But hang on, let me have a look first." },
          { who: 'Ezra', voice: 'us-nam', text: "Let's just carry him to the car and drive straight to the—" },
          { who: 'Duyên', voice: 'uk-nu', text: "Sorry, Ezra, can I just finish? What I'm saying is that it isn't deep. What he needs right now is pressure on the cut. Maura, could you pass me that clean towel?" },
          { who: 'Callan', voice: 'au-nam', text: 'Cheers, Duyên. You sound like a paramedic.' },
          { who: 'Duyên', voice: 'uk-nu', text: "There's a lifeguard station just over there. They'll have a first-aid kit. If it hasn't stopped bleeding in ten minutes, we'll go to the clinic." },
          { who: 'Maura', voice: 'ie-nu', text: "Good plan. And Callan, you were gonna buy everyone ice cream, weren't you?" },
          { who: 'Callan', voice: 'au-nam', text: 'Was I? Nice try.' },
          { who: 'Ezra', voice: 'us-nam', text: 'What I meant earlier, by the way, was a short nap. Twenty minutes, tops.' },
          { who: 'Duyên', voice: 'uk-nu', text: 'Ha! Request denied.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd30-kt-nghe-hieu',
        title: 'Phần 1a — Hiểu ý (8 câu)',
        items: [
          {
            q: '(Ngày 25) "Whaddaya guys wanna do after lunch? I\'m kinda tempted by a nap." Ezra hỏi và nói gì?',
            options: ['Hỏi mọi người muốn ăn gì; Ezra đói', 'Hỏi mọi người muốn làm gì sau bữa trưa; Ezra hơi muốn ngủ một giấc', 'Hỏi giờ; Ezra muốn về', 'Hỏi ai lái xe; Ezra mệt'],
            correct: 1,
            why: '**whaddaya** = what do you · **wanna** = want to · **kinda** = kind of (Ngày 25).',
          },
          {
            q: '(Ngày 28) Duyên nói gì về công việc?',
            options: ['Cô sắp nghỉ việc', 'Cô làm ứng dụng đặt phòng khách sạn khoảng ba tháng nay và hy vọng năm sau chuyển sang team thiết kế', 'Cô mới đi làm một tuần', 'Cô không thích công việc'],
            correct: 1,
            why: "**I've been working on…** (việc đang kéo dài) + **I'm hoping to…** (mục tiêu) (Ngày 28).",
          },
          {
            q: '(Ngày 26) Callan chuyển sang chuyện khách sạn bằng cụm nào?',
            options: ['By the way', 'Speaking of hotels', 'As I was saying', 'Anyway'],
            correct: 1,
            why: '**Speaking of + N** = nhân nhắc tới chuyện đó: nối chủ đề mới vào một chữ vừa được nhắc (Ngày 26).',
          },
          {
            q: '(Ngày 27) Chuyện ở khách sạn Hội An là gì?',
            options: ['Duyên quên đặt phòng', 'Vừa tới quầy thì Duyên được báo phòng của mình đã bị giao cho một ca sĩ nổi tiếng; cuối cùng cô được nâng lên phòng suite', 'Khách sạn đóng cửa', 'Duyên gặp ca sĩ'],
            correct: 1,
            why: "**I'd just got to… when…** + **had been given** (đã bị giao từ trước): quá khứ hoàn thành dựng cao trào (Ngày 27).",
          },
          {
            q: '(Ngày 26) Sau câu "No way. Who?", Duyên quay lại câu chuyện bằng gì?',
            options: ['Speaking of singers, …', 'Anyway, as I was saying, …', 'By the way, …', 'To put it another way, …'],
            correct: 1,
            why: '**Anyway, as I was saying** = quay lại mạch chính sau một câu hỏi phụ (Ngày 26).',
          },
          {
            q: '(Ngày 29) Maura hỏi có nên gọi 999. Vì sao Duyên nói 115?',
            options: ['115 là số cảnh sát', 'Họ đang ở Việt Nam: 115 là số cấp cứu; 999 là số của Anh', '999 chỉ gọi được bằng điện thoại bàn', 'Duyên nhầm'],
            correct: 1,
            why: 'Maura (Ireland) gọi theo phản xạ ở nhà. Ở Việt Nam: **113** công an · **114** cứu hoả · **115** cấp cứu (Ngày 29).',
          },
          {
            q: '(Ngày 29) Duyên ngắt lời Ezra thế nào, và nói gì?',
            options: ['Quát Ezra im lặng', '"Sorry, Ezra, can I just finish?" rồi dùng câu chẻ: vết cắt không sâu, điều Callan cần là ấn giữ lên vết thương', 'Đồng ý chở Callan đi viện', 'Gọi 115 ngay'],
            correct: 1,
            why: "Giữ lượt **Sorry, can I just finish?** + **What I'm saying is…** + **What he needs right now is…** (Ngày 29).",
          },
          {
            q: '(Ngày 27) "Callan, you were gonna buy everyone ice cream, weren\'t you?" — "Was I? Nice try." Chuyện gì đang xảy ra?',
            options: ['Callan hứa mua kem thật', 'Maura trêu, lợi dụng lúc Callan đang được chăm để "giao" việc mua kem; Callan nhận ra và đùa lại', 'Maura giận Callan', 'Callan không hiểu câu hỏi'],
            correct: 1,
            why: 'Câu trêu bằng câu hỏi đuôi; **Nice try** = "thử hay đấy, nhưng không ăn thua". Hiểu và đáp câu đùa (Ngày 27).',
          },
        ],
      },
      {
        t: 'dictation',
        id: 'gtd30-kt-chinh-ta',
        title: 'Phần 1b — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1 (Ngày 25)', spell: "I'm kinda tempted by a nap.", answer: "I'm kinda tempted by a nap.", alt: ["I'm kind of tempted by a nap.", 'I am kind of tempted by a nap.'] },
          { label: 'Câu 2 (Ngày 27)', spell: "I'd just got to the front desk when the receptionist told me.", answer: "I'd just got to the front desk when the receptionist told me.", alt: ['I had just got to the front desk when the receptionist told me.'] },
          { label: 'Câu 3 (Ngày 28)', spell: "I'm hoping to move to the design team next year.", answer: "I'm hoping to move to the design team next year.", alt: ['I am hoping to move to the design team next year.'] },
          { label: 'Câu 4 (Ngày 29)', spell: 'What he needs right now is pressure on the cut.', answer: 'What he needs right now is pressure on the cut.' },
        ],
      },

      /** ───────────── 2. Mẫu câu hợp cảnh ───────────── **/
      { t: 'h', text: 'Phần 2 — Mẫu câu hợp cảnh (12 câu · đạt ≥ 9 · trượt thì ôn bài Nói của Ngày ghi trong câu)' },
      {
        t: 'mcq',
        id: 'gtd30-kt-mau-cau',
        title: 'Phần 2 — Chọn câu hợp cảnh nhất (12 câu)',
        items: [
          {
            q: '(Ngày 25) Đồng nghiệp người Mỹ nói quá nhanh, bạn chỉ nghe được "…gotta…Friday…". Câu tốt nhất:',
            options: ['(gật đầu)', "Sorry, you've got to do what on Friday?", 'Speak English!', 'What?'],
            correct: 1,
            why: 'Nhắc lại phần **đã nghe được** và hỏi đúng phần bị lạc. Người kia chỉ cần nói lại một mẩu.',
          },
          {
            q: '(Ngày 25) Nhắn tin rất thân cho bạn: "Mình định đi ăn, đi cùng không?"',
            options: ["I'm gonna grab some food. Wanna come?", 'I am going to grab food, do you want to come with me, please?', 'Gonna food. Come.', 'Dear friend, would you like to join?'],
            correct: 0,
            why: '**gonna / wanna** hợp tin nhắn và lời nói thân. Với khách, email trang trọng thì viết đủ "going to / want to".',
          },
          {
            q: '(Ngày 26) Bạn đang nói chuyện thì nhớ ra một chuyện khác, không liên quan:',
            options: ['By the way, did you get my email about Friday?', 'As I was saying, did you get my email?', 'In other words, my email?', 'Speaking of, email?'],
            correct: 0,
            why: '**By the way** = mở một chuyện mới, không liên quan.',
          },
          {
            q: '(Ngày 26) Cuộc trò chuyện đã dài, bạn muốn kết thúc khéo:',
            options: ['I go now.', "Anyway, I'd better let you go. It's been really nice chatting.", 'Bye. Finish.', '(nhìn đồng hồ liên tục)'],
            correct: 1,
            why: "**Anyway, I'd better let you go** = kết thúc mà như đang nghĩ cho người kia.",
          },
          {
            q: '(Ngày 27) Bạn kể chuyện, muốn có cao trào:',
            options: ["I'd just stepped into the lift when the power went out.", 'I step into the lift and then power out.', 'The power went out after I had stepped into the lift, it is true.', 'Power out. Lift.'],
            correct: 0,
            why: "**I'd just + V3 … when + V2** = khoảnh khắc \"vừa… thì…\".",
          },
          {
            q: '(Ngày 27) Đồng nghiệp đùa: "I\'m not saying I\'m tired, but I just tried to unlock my front door with my office card." Bạn đáp:',
            options: ['Why you do that?', 'Ha! Did it work?', 'That is not correct.', 'You should sleep more.'],
            correct: 1,
            why: 'Hiểu đây là câu đùa tự giễu và **đùa lại** nhẹ. Khuyên thật (sleep more) làm câu đùa "chết".',
          },
          {
            q: '(Ngày 28) Sếp mới hỏi "So, tell me a bit about yourself." Mở đầu tốt nhất:',
            options: ['I was born in 2005 in a hospital.', "I'm a third-year IT student, and I've been building small web apps for about a year.", 'I am Nam. I am student. I like game.', 'What do you want to know?'],
            correct: 1,
            why: "Ai + đang làm gì (**I've been + V-ing**) trong một câu; chi tiết đời tư để sau.",
          },
          {
            q: '(Ngày 28) Bạn muốn nói mục tiêu một cách tự tin mà không khoe:',
            options: ["I'm hoping to lead a small team within two years.", 'I will be the boss.', 'I want money.', 'Maybe I do something.'],
            correct: 0,
            why: "**I'm hoping to + V** = mục tiêu rõ, giọng khiêm tốn.",
          },
          {
            q: '(Ngày 29) Đồng nghiệp hiểu "Can we move the call?" là đổi phòng, trong khi bạn muốn đổi giờ:',
            options: ["You don't understand me.", 'What I meant was move it to a different time, not a different room.', 'My meaning is time.', 'No, no, no.'],
            correct: 1,
            why: 'Câu chẻ **What I meant was…** + nói rõ cả hai vế.',
          },
          {
            q: '(Ngày 29) Ở Mỹ, bạn thấy khói bốc ra từ một căn bếp. Gọi số nào, nói gì đầu tiên?',
            options: ['999 — "Hello, I\'m Vietnamese…"', '911 — "Fire, please." rồi địa chỉ', '114 — "Fire!"', '000 — "Help!"'],
            correct: 1,
            why: 'Mỹ: **911**. Nói **dịch vụ** trước, rồi **địa chỉ**.',
          },
          {
            q: '(Ngày 30) Người ta đọc giờ hẹn cho bạn qua điện thoại ồn ào:',
            options: ['OK, OK.', 'Just to confirm: Thursday at quarter past two, is that right?', 'Thursday. Bye.', 'Send me.'],
            correct: 1,
            why: '**Just to confirm: …, is that right?** cho mọi thông tin có giờ, ngày, số.',
          },
          {
            q: '(Ngày 30) Bạn từ chối một lời mời nhưng muốn gặp dịp khác:',
            options: ["I'd love to, but I'm flying to Huế that weekend. Can we do the week after?", "No, I'm busy.", 'Not possible.', 'Next time maybe, maybe not.'],
            correct: 0,
            why: "**I'd love to, but…** + phương án khác.",
          },
        ],
      },

      /** ───────────── 3. Ngữ pháp ───────────── **/
      { t: 'h', text: 'Phần 3 — Ngữ pháp (12 câu · đạt ≥ 9 · trượt thì ôn mục 🧱 của Ngày ghi trong câu)' },
      {
        t: 'quiz',
        id: 'gtd30-kt-ngu-phap',
        title: 'Phần 3 — Điền một từ (12 câu)',
        kind: 'fill',
        grammar: 'going · got · By · saying · started · left · been · hoping · meant · finish · wish · confirm',
        items: [
          { q: '(Ngày 25) "I\'m gonna call you later" = I\'m ___ to call you later.', answers: ['going'] },
          { q: '(Ngày 25) "I gotta go" = I\'ve ___ to go.', answers: ['got'] },
          { q: '(Ngày 26) ___ the way, did you see the match last night?', answers: ['By', 'by'] },
          { q: '(Ngày 26) Anyway, as I was ___, the bus never came.', answers: ['saying'] },
          { q: '(Ngày 27) By the time we arrived, the film had already ___. (start)', answers: ['started'] },
          { q: "(Ngày 27) I'd just ___ the office when it started raining. (leave)", answers: ['left'] },
          { q: "(Ngày 28) I've ___ learning Japanese for six months.", answers: ['been'] },
          { q: "(Ngày 28) I'm ___ to get a job abroad after I graduate.", answers: ['hoping'] },
          { q: '(Ngày 29) What I ___ was the fifteenth, not the fiftieth.', answers: ['meant'] },
          { q: "(Ngày 29) Sorry, can I just ___? I'm nearly done.", answers: ['finish'] },
          { q: '(Ngày 30) I ___ I had brought a coat. It was freezing.', answers: ['wish'] },
          { q: '(Ngày 30) Just to ___: two nights, checking out on Sunday?', answers: ['confirm', 'check'] },
        ],
      },

      /** ───────────── 4. Viết ───────────── **/
      { t: 'h', text: 'Phần 4 — Viết (10 câu · đạt ≥ 7 · trượt thì ôn bài Viết của Ngày 26, 28, 30)' },
      {
        t: 'quiz',
        id: 'gtd30-kt-viet',
        title: 'Phần 4a — Tự viết 6 câu (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "Speaking of… · I'd just + V3 when… · I've been + V-ing · I'm hoping to… · What I meant was… · This morning…",
        items: [
          { q: '(Ngày 26 — email kể chuyện) Nhân nhắc tới đồ ăn, mình vừa học nấu bún chả.', hint: "Speaking of food, I've just learned", answers: ["Speaking of food, I've just learned to cook bún chả.", "Speaking of food, I've just learned how to cook bún chả.", 'Speaking of food, I have just learned to cook bún chả.', "Speaking of food, I've just learnt to cook bún chả.", "Speaking of food, I've just learned how to make bún chả.", "Speaking of food, I've just learned to make bún chả."] },
          { q: '(Ngày 27 — kể chuyện) Mình vừa lên xe buýt thì nhận ra quên ví.', hint: "I'd just got on the bus when I realised", answers: ["I'd just got on the bus when I realised I'd forgotten my wallet.", 'I had just got on the bus when I realised I had forgotten my wallet.', "I'd just got on the bus when I realized I'd forgotten my wallet.", "I'd just got on the bus when I realised I forgot my wallet.", "I'd just gotten on the bus when I realized I'd forgotten my wallet."] },
          { q: '(Ngày 28 — giới thiệu bản thân) Mình làm web với React khoảng một năm nay.', hint: "I've been building / working with", answers: ["I've been building websites with React for about a year.", "I've been working with React for about a year.", 'I have been building websites with React for about a year.', "I've been making websites with React for about a year.", "I've been building web apps with React for about a year."] },
          { q: '(Ngày 28) Mình hy vọng sẽ được thực tập ở một công ty có khách nước ngoài.', hint: "I'm hoping to, at a company with foreign clients", answers: ["I'm hoping to do an internship at a company with foreign clients.", 'I am hoping to do an internship at a company with foreign clients.', "I'm hoping to intern at a company with foreign clients.", "I'm hoping to get an internship at a company with foreign clients."] },
          { q: '(Ngày 29 — nhắn tin) Ý mình là thứ Ba tuần sau, không phải thứ Ba này.', hint: 'What I meant was', answers: ['What I meant was next Tuesday, not this Tuesday.', 'What I meant was next Tuesday, not this one.', 'Sorry, what I meant was next Tuesday, not this Tuesday.'] },
          { q: '(Ngày 30 — nhật ký) Sáng nay mình có cuộc gọi video đầu tiên với khách.', hint: 'This morning I had', answers: ['This morning I had my first video call with a client.', 'This morning I had my first video call with the client.', 'I had my first video call with a client this morning.', 'This morning, I had my first video call with a client.'] },
        ],
      },
      {
        t: 'build',
        id: 'gtd30-kt-viet-ghep',
        title: 'Phần 4b — Sắp xếp câu (4 câu)',
        items: [
          { vi: '(Ngày 26) Thôi, quay lại chuyện lúc nãy: chợ đóng cửa lúc năm giờ.', chips: ['Anyway,', 'as', 'I', 'was', 'saying,', 'the', 'market', 'closes', 'at', 'five.', 'said', 'By'], answer: ['Anyway,', 'as', 'I', 'was', 'saying,', 'the', 'market', 'closes', 'at', 'five.'] },
          { vi: '(Ngày 27) Lúc bọn mình tới nơi thì xe đã đi mất rồi.', chips: ['By', 'the', 'time', 'we', 'arrived,', 'the', 'bus', 'had', 'already', 'left.', 'leave', 'has'], answer: ['By', 'the', 'time', 'we', 'arrived,', 'the', 'bus', 'had', 'already', 'left.'] },
          { vi: '(Ngày 29) Điều bạn cần lúc này là nghỉ ngơi.', chips: ['What', 'you', 'need', 'right', 'now', 'is', 'some', 'rest.', 'needs', 'are'], answer: ['What', 'you', 'need', 'right', 'now', 'is', 'some', 'rest.'] },
          { vi: '(Ngày 30) Vui nhất là lúc cả nhà cười.', chips: ['The', 'best', 'part', 'was', 'when', 'everyone', 'laughed.', 'laugh', 'good'], answer: ['The', 'best', 'part', 'was', 'when', 'everyone', 'laughed.'] },
        ],
      },

      { t: 'h', text: 'Sau khi làm xong' },
      {
        t: 'note',
        title: 'Đạt hay chưa đạt — làm gì tiếp',
        items: [
          '**Đạt cả 4 phần**: bạn đã xong khoá. Ghi âm **2 phút** kể lại một ngày của bạn bằng tiếng Anh, rồi nghe lại bản ghi **30 giây tự giới thiệu** ở Ngày 1. Khác nhau thế nào, đó là thứ 30 ngày đã cho bạn.',
          '**Trượt Nghe**: nghe lại cảnh nói nhanh của **Ngày 25**, cuộc trò chuyện dài của **Ngày 26**, câu chuyện của **Ngày 27**, cảnh 3 của **Ngày 29**. Mỗi cảnh 2 lần, lần 2 bật lời thoại và nhắc lại từng câu thành tiếng. Làm lại Phần 1 sau 2 ngày.',
          '**Trượt Mẫu câu**: mỗi câu sai ghi một (Ngày N). Mở bài **Nói** ngày đó, đọc lại bảng ba mức lịch sự, rồi làm "Nhập vai với Gia sư AI" của ngày đó một lượt.',
          '**Trượt Ngữ pháp**: mở mục **🧱** của ngày có câu sai. Hay nhầm nhất ở chặng này: **gonna / gotta** (Ngày 25), **as I was saying** (Ngày 26), **had + V3** (Ngày 27), **I\'ve been + V-ing** (Ngày 28), **What I meant was** (Ngày 29), **I wish I had + V3** (Ngày 30).',
          '**Trượt Viết**: viết nhật ký 5 câu mỗi tối trong một tuần (Ngày 30, mục 4), rồi làm lại Phần 4.',
          'Chỉ làm lại **phần trượt**. Đạt rồi thì sang phần tổng kết dưới đây, đừng đợi điểm tuyệt đối.',
        ],
      },

      /** ───────────── 🎓 Tổng kết khoá ───────────── **/
      { t: 'h', text: '🎓 Tổng kết khoá — 30 ngày, bạn đã làm được gì' },
      {
        t: 'p',
        text: 'Khoá này chỉ có **một mục tiêu**: nói và nghe được với người thật. Bảng dưới là những việc bạn đã luyện, chặng nào cũng có cảnh nghe, mẫu câu, nhập vai và bài kiểm tra. Đánh dấu việc nào bạn **tự tin làm ngay hôm nay**; việc nào chưa, ôn đúng Ngày ghi bên cạnh.',
      },
      {
        t: 'table',
        head: ['Chặng', 'Học xong bạn làm được', 'Ngày'],
        rows: [
          ['1 · Sống sót (A2)', 'Chào, tự giới thiệu, hỏi lại khi không hiểu · small talk · gọi món, mua sắm, trả giá đơn giản · hỏi đường, đi taxi, đi tàu', 'Ngày 1–6'],
          ['2 · Đời sống (A2+ → B1)', 'Tả triệu chứng, đi khám, nhà thuốc · báo hỏng nhà, nói chuyện chủ nhà · gọi điện, để lại lời nhắn · mời và từ chối · kể chuyện đã qua · chia vui, chia buồn', 'Ngày 7–12'],
          ['3 · Công sở (B1)', 'Làm quen team · small talk công sở · nhờ việc lịch sự · xin nghỉ, báo vắng · họp video, xử lý sự cố mạng · đồng ý, không đồng ý mà không mất lòng', 'Ngày 13–18'],
          ['4 · Giao tiếp sâu (B1+ → B2)', 'Networking · đón khách, giới thiệu Việt Nam · phàn nàn và leo thang lịch sự · thương lượng · kể lại tin tức · hiểu khác biệt văn hoá, chữa ngượng khi lỡ lời', 'Ngày 19–24'],
          ['5 · Tự nhiên (B2)', 'Nghe người bản xứ nói nhanh · trò chuyện dài, chuyển và quay lại chủ đề · kể chuyện có cao trào, hiểu câu đùa · nói về bản thân và mục tiêu · giữ lượt, gỡ hiểu lầm, gọi cấp cứu · sống trọn một ngày bằng tiếng Anh', 'Ngày 25–30'],
        ],
        caption: 'Mức B2 nghĩa là: bạn nói chuyện được với người bản xứ về đa số chuyện đời thường và công sở, **không cần họ nói chậm lại cho bạn**, dù đôi khi vẫn phải hỏi lại. Đó chính là thứ khoá này nhắm tới.',
      },
      {
        t: 'note',
        title: 'Tự luyện tiếp thế nào',
        items: [
          '**🎧 Podcast** (`/language/en/podcast`): mỗi ngày một tập. Nghe lần 1 không xem chữ; lần 2 bật chữ, dừng ở câu lạ và **nhắc lại thành tiếng**. Bắt đầu từ nhóm đời sống `en-ds-*`, rồi lên `en-b2-*`, `en-c1-*`.',
          '**🗣️ Nhập vai với Gia sư AI** (`/language/en/roleplay`): làm lại đề bài 15 phút của bài Nói hôm nay **mỗi tuần một lần**, đổi thành phố và tình huống. Giữa tuần, mở lại đề nhập vai của bất kỳ ngày nào bạn thấy yếu.',
          '**🎓 IELTS** (`/language/en/ielts`): khoá này lo **nói và nghe đời thật**; IELTS lo **thi và bốn kỹ năng học thuật**. Nếu bạn cần chứng chỉ, học Tập 1 → 5 song song; vốn từ và phản xạ của khoá này giúp phần Speaking rất nhiều.',
          '**💻 Technical English at Work** (`/courses/tieng-anh-ky-thuat-di-lam`): khi đi OJT, bạn sẽ cần ticket, bug report, commit / PR, code review, email khách, standup, demo. Khoá này **không dạy** những việc đó; khoá Technical English at Work dạy đủ. Học ngay sau khoá này, trước khi vào công ty.',
          '**📓 Nhật ký 5 câu mỗi tối** (bài Viết hôm nay) và **mỗi tháng một lần** làm lại bài **Kiểm tra chặng** của chặng bạn thấy yếu nhất.',
          '**Người thật**: tìm **một** cơ hội mỗi tuần để nói với người thật bằng tiếng Anh: hỏi đường giúp một khách du lịch, câu lạc bộ tiếng Anh, đồng nghiệp nước ngoài, buổi meetup công nghệ. Gia sư AI là phòng tập; người thật mới là trận đấu.',
        ],
      },
      {
        t: 'table',
        caption: 'Kế hoạch 15 phút mỗi ngày — đặt báo thức cùng một giờ, làm đúng thứ tự',
        head: ['Ngày', '5 phút đầu', '5 phút giữa', '5 phút cuối'],
        rows: [
          ['Thứ Hai', 'Nghe 1 tập Podcast (không xem chữ)', 'Nghe lại, bật chữ, nhắc lại 5 câu hay', 'Ghi 3 cụm mới vào nhật ký'],
          ['Thứ Ba', 'Đọc to 10 khung câu (bài Nói Ngày 30)', 'Mỗi khung nói 1 câu về hôm nay', 'Nhật ký 5 câu'],
          ['Thứ Tư', 'Nhập vai AI: 1 tình huống của chặng yếu nhất', 'Đọc phần AI sửa, nói lại câu đúng', 'Nhật ký 5 câu'],
          ['Thứ Năm', 'Nghe 1 cảnh cũ của khoá ở tốc độ thường', 'Chép chính tả 3 câu khó nhất', 'Nhật ký 5 câu'],
          ['Thứ Sáu', 'Đọc 1 bài ngắn tiếng Anh thật (tin, bài đăng, email)', 'Tóm tắt thành tiếng trong 1 phút', 'Nhật ký 5 câu'],
          ['Thứ Bảy', 'Nhập vai tổng hợp 15 phút (bài Nói Ngày 30)', '(tiếp)', '(tiếp) + phiếu tự chấm'],
          ['Chủ nhật', 'Đọc lại nhật ký cả tuần', 'Gạch chân 1 lỗi lặp lại', 'Đặt mục tiêu tuần sau: sửa đúng lỗi đó'],
        ],
      },
      {
        t: 'note',
        title: 'Lời cuối',
        items: [
          'Ba mươi ngày trước, gặp người nước ngoài là đứng hình. Hôm nay bạn biết **hỏi lại**, biết **từ chối**, biết **giữ lượt**, biết **gỡ hiểu lầm**, và biết **gọi giúp đỡ** khi có chuyện. Bạn chưa cần nói hoàn hảo; bạn cần **không im lặng**.',
          'Lần tới gặp một người nói tiếng Anh, đừng chờ tới lúc "giỏi hơn". Mở lời bằng câu đầu tiên của khoá: **"Hi, I\'m… Nice to meet you."** Phần còn lại, bạn đã luyện đủ rồi.',
        ],
      },
    ],
  },
];
