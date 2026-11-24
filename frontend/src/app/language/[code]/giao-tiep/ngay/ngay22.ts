/**
 * Tiếng Anh giao tiếp — NGÀY 22 (chặng 4 "Giao tiếp sâu", B1+ → B2): thuyết phục & thương lượng đời thường.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd22-`.
 * Ngữ pháp trong câu: điều kiện loại 2 (If we left on Saturday, we'd only need… · If we booked today, would you…?
 * · If I were you, I'd…) · đề xuất bằng What if…? / How about + V-ing / How about we…? · nối câu bằng `as long as`, `on one condition`.
 * Cảnh: Lâm — sinh viên IT năm 3 — thực tập trao đổi bốn tháng ở văn phòng Sydney của một công ty phần mềm, ở nhà chung với
 * Callie (Mỹ), Ruairí (Ireland), Kai (New Zealand). Ba cảnh của kỳ nghỉ dài cuối tuần tháng 10: cả nhà chọn chỗ đi (nhà biển
 * Jervis Bay đắt · cắm trại Blue Mountains rẻ mà lạnh · Lâm đề xuất cabin + tự nấu); gọi chỗ thuê cabin ở Leura (long weekend
 * ở tối thiểu 3 đêm ⇒ đổi sang cabin nhỏ, xin bỏ phí dọn, được 720 đô + trả phòng muộn); quầy thuê xe (phí tài xế dưới 25 tuổi
 * ⇒ thuyết phục Callie cầm lái, đổi GPS lấy xe SUV).
 * Khác podcast en-ds-b2-01 (thương lượng giá thuê căn hộ: trả trước 3 tháng, điều khoản sửa chữa, tiền cọc), en-ds-b2-02
 * (luật nhà với bạn ở chung) và en-a2-03 (hai bạn Việt lên kế hoạch đi Đà Lạt): hôm nay là thuyết phục cả NHÓM rồi mặc cả
 * với hai doanh nghiệp, và mọi câu đề xuất đi bằng điều kiện loại 2.
 * Dữ kiện đã soát: phí tài xế dưới 25 tuổi và "excess" là chuyện thường gặp khi thuê xe ở Úc; long weekend tháng 10 là
 * Labour Day ở NSW; mức giá là giá giả định, nói rõ trong bài.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_22: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd22-nghe',
    kind: 'listening',
    title: 'Thuyết phục & thương lượng đời thường',
    goal: 'Nghe hiểu một nhóm bạn tranh luận chọn kế hoạch rồi đi tới thoả hiệp, và hai cuộc mặc cả thật (qua điện thoại và ở quầy); nghe ra con số, điều kiện, lời đề nghị cuối cùng và chiêu "tạo áp lực" của người bán.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, cần làm được gì',
        items: [
          'Ngày 18 bạn học nêu ý kiến và không đồng ý. Ngày 21 học phàn nàn. Hôm nay là bước tiếp: **thuyết phục người khác** và **mặc cả để cả hai bên cùng được**.',
          'Bạn theo **Lâm**, sinh viên IT năm 3, thực tập trao đổi bốn tháng ở **Sydney**, ở chung nhà với **Callie** (Mỹ), **Ruairí** (Ireland) và **Kai** (New Zealand). Sắp tới **kỳ nghỉ dài cuối tuần** đầu tháng 10.',
          'Ba cảnh: cả nhà chọn chỗ đi · Lâm gọi điện mặc cả giá cabin · quầy thuê xe có một khoản phí không ai ngờ tới.',
          'Nghe nhiều **con số**: two-sixty, seven-twenty, all up, per night, each. Ghi ra giấy: **giá ban đầu → giá cuối → đổi lại được gì**.',
          'Câu chủ lực hôm nay: **If we…, we\'d / we could…** và **What if…? / How about…?** Nghe mỗi cảnh 2 lần, lần 2 đếm xem có bao nhiêu câu If.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Bếp nhà chung, tối Chủ nhật: đi đâu cho cả bốn người cùng vui?' },
      {
        t: 'canh',
        anh: ['house', 'beach-with-umbrella', 'tent', 'mountain', 'man-student'],
        caption: 'Tối Chủ nhật ở căn nhà chung tại **Newtown, Sydney**. Bốn người bày laptop trên bàn bếp. **Callie** muốn nhà biển, **Ruairí** muốn cắm trại cho rẻ, **Kai** sợ lạnh. **Lâm** phải tìm một phương án cả bốn cùng gật.',
      },
      {
        t: 'listen',
        id: 'gtd22-nghe-canh1',
        title: 'Scene 1 — Planning the long weekend',
        note: 'Nghe xem mỗi người muốn gì, Lâm đưa ra phương án nào và dùng hai lý do gì để thuyết phục Ruairí.',
        lines: [
          { who: 'Callie', voice: 'us-nu', text: 'Okay, long weekend. I vote Jervis Bay. I found a beach house with an ocean view, and it\'s only nine hundred for three nights.', vi: 'Rồi, kỳ nghỉ dài. Mình bầu Jervis Bay. Mình tìm được một căn nhà biển nhìn ra đại dương, chỉ chín trăm cho ba đêm thôi.' },
          { who: 'Ruairí', voice: 'ie-nam', text: "Only nine hundred? Callie, that's two hundred and twenty-five each, before food. I'm an intern, not a banker.", vi: 'Chỉ chín trăm? Callie, thế là hai trăm hai lăm mỗi người, chưa kể ăn. Tôi là thực tập sinh chứ có phải nhân viên ngân hàng đâu.' },
          { who: 'Callie', voice: 'us-nu', text: "But it's right on the beach! Come on, how often are we going to be in Australia?" },
          { who: 'Ruairí', voice: 'ie-nam', text: "Fair, but I'd rather go camping in the Blue Mountains. A campsite's about thirty-five a night for all of us. Even if we hired the gear, it'd come to under ninety each.", vi: 'Cũng đúng, nhưng tôi thích đi cắm trại ở Blue Mountains hơn. Một chỗ cắm trại khoảng ba lăm một đêm cho cả nhóm. Kể cả thuê đồ thì cũng chưa tới chín mươi mỗi người.' },
          { who: 'Kai', voice: 'nz-nam', text: "Camping in October, though? It gets pretty cold up there at night. I tried it last year and didn't sleep a wink.", vi: 'Cắm trại tháng Mười á? Trên đó ban đêm lạnh lắm. Năm ngoái tôi thử rồi, cả đêm không chợp mắt được.' },
          { who: 'Ruairí', voice: 'ie-nam', text: "That's what sleeping bags are for." },
          { who: 'Lâm', voice: 'uk-nam', text: 'Can I throw in another idea? What if we went to the Blue Mountains, but stayed in a cabin instead of a tent?', vi: 'Cho mình góp thêm một ý được không? Hay là mình lên Blue Mountains, nhưng ở cabin thay vì ở lều?' },
          { who: 'Callie', voice: 'us-nu', text: "Cabins up there aren't exactly cheap either.", vi: 'Cabin trên đó cũng đâu có rẻ.' },
          { who: 'Lâm', voice: 'uk-nam', text: "I've had a look. There's one in Leura for three-forty a night. If we left on Saturday morning instead of Friday night, we'd only need two nights. That's a hundred and seventy each.", vi: 'Mình xem rồi. Có một cái ở Leura giá ba trăm bốn mươi một đêm. Nếu mình đi sáng thứ Bảy thay vì tối thứ Sáu thì chỉ cần hai đêm. Mỗi người một trăm bảy mươi.' },
          { who: 'Ruairí', voice: 'ie-nam', text: "That's still double the camping." },
          { who: 'Lâm', voice: 'uk-nam', text: "True. But think about it this way: if it rained, we'd be stuck in a wet tent for two days. And with a kitchen, we could cook instead of eating out. That'd easily save us fifty each.", vi: 'Đúng. Nhưng thử nghĩ thế này: nếu trời mưa, mình sẽ kẹt trong cái lều ướt hai ngày. Còn có bếp thì mình tự nấu được thay vì ăn ngoài. Thế là tiết kiệm được ít nhất năm mươi mỗi người.' },
          { who: 'Kai', voice: 'nz-nam', text: "He's got a point. Eating out in Katoomba adds up fast.", vi: 'Cậu ấy nói có lý. Ăn ngoài ở Katoomba tốn tiền nhanh lắm.' },
          { who: 'Ruairí', voice: 'ie-nam', text: "Hmm. How about this: I'll go for the cabin, as long as I'm in charge of the barbecue.", vi: 'Hừm. Thế này nhé: tôi chịu ở cabin, miễn là tôi được lo vụ nướng thịt.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Deal. Callie, what do you think? Would you be okay with the mountains this time?" },
          { who: 'Callie', voice: 'us-nu', text: "Fine. But on one condition: if the weather's good in December, we're doing Jervis Bay, and nobody's allowed to say it's too expensive.", vi: 'Được thôi. Nhưng với một điều kiện: nếu tháng Mười Hai trời đẹp, mình đi Jervis Bay, và không ai được kêu đắt.' },
          { who: 'Kai', voice: 'nz-nam', text: 'Sounds fair to me.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Great. I'll ring the cabin place tomorrow and see if they can do a better price. Then I'll put it in the group chat.", vi: 'Tuyệt. Mai mình gọi chỗ cabin xem họ có bớt giá được không. Rồi mình đưa lên nhóm chat.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd22-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Ruairí không chịu đi Jervis Bay?',
            options: ['Vì sợ nước', 'Vì quá đắt: 225 đô mỗi người, chưa kể ăn', 'Vì quá xa', 'Vì đã đi rồi'],
            correct: 1,
            why: '"That\'s **two hundred and twenty-five each, before food**. I\'m an intern, not a banker." Câu sau là câu đùa, ý là "tôi không có nhiều tiền".',
          },
          {
            q: 'Phương án của Lâm là gì?',
            options: ['Cắm trại ở Jervis Bay', 'Ở cabin ở Blue Mountains hai đêm, đi sáng thứ Bảy', 'Ở nhà cả kỳ nghỉ', 'Ở khách sạn ở Katoomba ba đêm'],
            correct: 1,
            why: '"What if we went to the Blue Mountains, but **stayed in a cabin** instead of a tent?" và "If we **left on Saturday morning**… we\'d only need **two nights**."',
          },
          {
            q: 'Lâm dùng hai lý do nào để thuyết phục Ruairí?',
            options: [
              'Cabin đẹp hơn và gần biển hơn',
              'Nếu mưa thì kẹt trong lều ướt; có bếp thì tự nấu, tiết kiệm khoảng 50 đô mỗi người',
              'Callie muốn thế, và Kai sợ lạnh',
              'Cabin có wifi và tivi',
            ],
            correct: 1,
            why: 'Hai lý do đánh đúng vào nỗi lo của Ruairí là **tiền**: "if it rained, we\'d be stuck in a wet tent" và "we could cook… That\'d easily **save us fifty each**."',
          },
          {
            q: 'Callie đồng ý với điều kiện gì?',
            options: ['Callie được chọn phòng', 'Nếu tháng 12 trời đẹp, cả nhóm đi Jervis Bay và không ai được kêu đắt', 'Lâm trả tiền xăng', 'Đi ba đêm'],
            correct: 1,
            why: '"**On one condition**: if the weather\'s good in December, we\'re doing Jervis Bay, and nobody\'s allowed to say it\'s too expensive." Thoả hiệp tốt: ai cũng được một thứ.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Gọi điện mặc cả: "tối thiểu ba đêm"' },
      {
        t: 'canh',
        anh: ['telephone-receiver', 'house-with-garden', 'tear-off-calendar', 'dollar-banknote', 'thinking-face'],
        caption: 'Thứ Hai, giờ nghỉ trưa. Lâm gọi **Leura Ridge Cabins**, gặp **Hollie**. Kế hoạch hai đêm của cả nhà gặp ngay một quy định Lâm không biết. (Giá trong bài là giá giả định.)',
      },
      {
        t: 'listen',
        id: 'gtd22-nghe-canh2',
        title: 'Scene 2 — On the phone with the cabin owner',
        note: 'Nghe xem vướng quy định gì, Lâm đề xuất đổi chác những gì, và giá cuối cùng là bao nhiêu, kèm thêm gì.',
        lines: [
          { who: 'Hollie', voice: 'au-nu', text: 'Leura Ridge Cabins, Hollie speaking.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Hi, Hollie. I'm calling about the two-bedroom cabin for the long weekend. Is it still free for Saturday and Sunday night?", vi: 'Chào chị Hollie. Tôi gọi hỏi về cabin hai phòng ngủ dịp nghỉ dài. Tối thứ Bảy và Chủ nhật còn trống không ạ?' },
          { who: 'Hollie', voice: 'au-nu', text: "Let me have a look… It's free, but on long weekends we've got a three-night minimum, so it'd have to be Friday to Monday.", vi: 'Để tôi xem… Còn trống, nhưng dịp nghỉ dài bên tôi ở tối thiểu ba đêm, nên phải từ thứ Sáu tới thứ Hai.' },
          { who: 'Lâm', voice: 'uk-nam', text: 'Ah. Is there any flexibility on that? We were hoping to do just two nights.', vi: 'À. Quy định đó có linh động được không ạ? Bọn tôi định chỉ ở hai đêm.' },
          { who: 'Hollie', voice: 'au-nu', text: "Not on long weekends, I'm afraid. Saturdays are always the first to go.", vi: 'Dịp nghỉ dài thì không được, tôi e là vậy. Tối thứ Bảy luôn hết phòng đầu tiên.' },
          { who: 'Lâm', voice: 'uk-nam', text: 'Okay. What if we took the smaller cabin for three nights instead? Does that sleep four?', vi: 'Vâng. Vậy nếu bọn tôi lấy cabin nhỏ ba đêm thì sao? Cabin đó ngủ được bốn người không?' },
          { who: 'Hollie', voice: 'au-nu', text: "The one-bedroom's got a double bed and a sofa bed, so yes, it sleeps four. That's two-sixty a night, plus an eighty-dollar cleaning fee.", vi: 'Cabin một phòng có một giường đôi và một sofa giường, nên ngủ được bốn. Hai trăm sáu mươi một đêm, cộng phí dọn tám mươi đô.' },
          { who: 'Lâm', voice: 'uk-nam', text: "So that's eight hundred and sixty all up. To be honest, that's a bit more than we were hoping to spend. If we booked all three nights today, would you be able to do a better rate?", vi: 'Vậy tổng cộng là tám trăm sáu mươi. Thật lòng thì hơi quá mức bọn tôi định chi. Nếu hôm nay bọn tôi đặt luôn cả ba đêm, chị có bớt được giá không?' },
          { who: 'Hollie', voice: 'au-nu', text: 'Hmm. I could take off the cleaning fee. That brings it down to seven-eighty.', vi: 'Hừm. Tôi có thể bỏ phí dọn. Như vậy còn bảy trăm tám mươi.' },
          { who: 'Lâm', voice: 'uk-nam', text: 'That helps, thank you. And what if we paid the full amount upfront? Could you do seven hundred?', vi: 'Thế đỡ nhiều rồi, cảm ơn chị. Còn nếu bọn tôi trả hết tiền trước thì sao? Chị lấy bảy trăm được không?' },
          { who: 'Hollie', voice: 'au-nu', text: "I can't go that low on a long weekend, sorry. The best I can do is seven-twenty, and I'll throw in a late check-out on Monday. Twelve instead of ten.", vi: 'Dịp nghỉ dài thì tôi không xuống tới mức đó được, xin lỗi. Tốt nhất tôi lấy bảy trăm hai mươi, và cho thêm trả phòng muộn ngày thứ Hai. Mười hai giờ thay vì mười giờ.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Seven-twenty, no cleaning fee, and a late check-out. That sounds reasonable. I just need to run it by my housemates first. Could you hold it for me until this afternoon?", vi: 'Bảy trăm hai mươi, không phí dọn, trả phòng muộn. Nghe hợp lý. Tôi chỉ cần hỏi các bạn cùng nhà trước. Chị giữ phòng giúp tôi tới chiều được không?' },
          { who: 'Hollie', voice: 'au-nu', text: "I can hold it until five. After that, I can't promise anything. It's a busy weekend.", vi: 'Tôi giữ được tới năm giờ. Sau đó thì tôi không hứa được gì. Cuối tuần đó đông lắm.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Understood. I'll call you back before five either way." },
          { who: 'Hollie', voice: 'au-nu', text: "Lovely. Oh, and just so you know, firewood for the fireplace is included.", vi: 'Tốt quá. À, nói để anh biết, củi cho lò sưởi đã bao gồm.' },
          { who: 'Lâm', voice: 'uk-nam', text: 'Even better. Thanks, Hollie.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd22-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Quy định nào làm kế hoạch hai đêm không được?',
            options: ['Không nhận khách dưới 25 tuổi', 'Dịp nghỉ dài phải ở tối thiểu ba đêm', 'Không cho nấu ăn', 'Phải trả cọc 100%'],
            correct: 1,
            why: '"On long weekends we\'ve got a **three-night minimum**." Nhiều chỗ nghỉ ở Úc có quy định số đêm tối thiểu vào dịp lễ.',
          },
          {
            q: 'Giá cuối cùng Lâm được là bao nhiêu, kèm gì?',
            options: ['700 đô, không kèm gì', '720 đô cho ba đêm, không phí dọn, trả phòng muộn lúc 12 giờ', '780 đô, kèm củi', '860 đô, trả phòng muộn'],
            correct: 1,
            why: '"The best I can do is **seven-twenty**, and I\'ll **throw in a late check-out**." Phí dọn đã bỏ từ bước trước. Củi là có sẵn cho mọi khách.',
          },
          {
            q: '"I can hold it until five. After that, I can\'t promise anything." Hollie đang làm gì?',
            options: ['Doạ Lâm', 'Tạo chút áp lực thời gian để Lâm quyết nhanh, và cũng là thông tin thật', 'Từ chối', 'Mời Lâm tới xem phòng'],
            correct: 1,
            why: 'Người bán hay **đặt hạn** ("until five", "it\'s a busy weekend") để bạn chốt. Cách đáp đúng là của Lâm: nhận hạn và hứa gọi lại **"either way"** (dù có hay không).',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Quầy thuê xe, chiều thứ Sáu: khoản phí không ai ngờ' },
      {
        t: 'canh',
        anh: ['sport-utility-vehicle', 'identification-card', 'woman-gesturing-no', 'handshake', 'man-office-worker'],
        caption: 'Chiều thứ Sáu. Cả nhà đã đồng ý ba đêm. Xe đặt online đứng tên **Ruairí** (24 tuổi). Ở quầy, **Nate** nhìn ngày sinh trên bằng lái. **Callie** 27 tuổi, có bằng lái Mỹ nhưng chưa từng lái xe bên trái đường.',
      },
      {
        t: 'listen',
        id: 'gtd22-nghe-canh3',
        title: 'Scene 3 — At the car rental counter',
        note: 'Nghe xem phí gì phát sinh, Lâm thuyết phục Callie thế nào, và Lâm đổi cái gì để lấy chiếc xe to hơn.',
        lines: [
          { who: 'Nate', voice: 'au-nam', text: "G'day, guys. Picking up? What name's the booking under?" },
          { who: 'Ruairí', voice: 'ie-nam', text: "Ruairí Byrne. That's R-U-A-I-R-I. Here's my licence.", vi: 'Ruairí Byrne. Đánh vần là R-U-A-I-R-I. Bằng lái của tôi đây.' },
          { who: 'Nate', voice: 'au-nam', text: "Cheers. Okay, a small hatchback, Friday to Monday… Ah. You're twenty-four, so there's a young driver fee. That's twenty-seven dollars a day.", vi: 'Cảm ơn. Rồi, một xe hatchback nhỏ, từ thứ Sáu tới thứ Hai… À. Anh hai mươi bốn tuổi, nên có phí tài xế trẻ. Hai mươi bảy đô một ngày.' },
          { who: 'Ruairí', voice: 'ie-nam', text: 'Twenty-seven a day? Nobody mentioned that.' },
          { who: 'Nate', voice: 'au-nam', text: "It's in the terms and conditions, mate. Most companies charge it for drivers under twenty-five.", vi: 'Có trong điều khoản đấy anh bạn. Hầu hết các hãng đều thu phí này với tài xế dưới hai mươi lăm tuổi.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Okay. So what if Callie were the main driver instead? She's twenty-seven.", vi: 'Vâng. Vậy nếu Callie là tài xế chính thì sao? Cô ấy hai mươi bảy tuổi.' },
          { who: 'Nate', voice: 'au-nam', text: "Then there'd be no young driver fee. She'd just need a credit card in her own name for the bond.", vi: 'Thế thì không có phí tài xế trẻ. Cô ấy chỉ cần một thẻ tín dụng đứng tên mình để đặt cọc.' },
          { who: 'Callie', voice: 'us-nu', text: "I've got one. But guys, I've never driven on the left. If I drove up those mountain roads, I'd be a nervous wreck.", vi: 'Mình có thẻ. Nhưng các cậu ơi, mình chưa lái bên trái bao giờ. Nếu mình lái lên mấy con đường núi đó, mình sẽ run cầm cập.' },
          { who: 'Lâm', voice: 'uk-nam', text: "Hear me out. How about you drive, and Ruairí sits next to you and navigates? If you got tired, we could stop in Penrith for a break. And it saves us eighty dollars.", vi: 'Nghe mình nói đã. Hay là cậu lái, còn Ruairí ngồi cạnh chỉ đường? Nếu cậu mệt, mình dừng ở Penrith nghỉ một lát. Mà như thế tiết kiệm được tám mươi đô.' },
          { who: 'Callie', voice: 'us-nu', text: 'Hmm. Okay, on one condition: nobody comments on my driving. Not one word.', vi: 'Hừm. Được, với một điều kiện: không ai được nhận xét cách mình lái. Một chữ cũng không.' },
          { who: 'Ruairí', voice: 'ie-nam', text: "Deal. My lips are sealed." },
          { who: 'Lâm', voice: 'uk-nam', text: "One more thing. There are four of us, plus bags and food for three days. If we took something bigger, would you be able to do it for the same price?", vi: 'Còn một việc. Bọn tôi bốn người, cộng hành lý và đồ ăn cho ba ngày. Nếu lấy xe to hơn, anh có để cùng giá được không?' },
          { who: 'Nate', voice: 'au-nam', text: "The SUV's normally thirty more a day. Best I can do is fifteen.", vi: 'Xe SUV bình thường đắt hơn ba mươi một ngày. Tốt nhất tôi lấy thêm mười lăm.' },
          { who: 'Lâm', voice: 'uk-nam', text: "We also booked a GPS for twelve a day, but we'll just use our phones. What if you took that off and gave us the SUV for ten more?", vi: 'Bọn tôi có đặt kèm GPS mười hai đô một ngày, nhưng bọn tôi dùng điện thoại là được. Nếu anh bỏ GPS ra và cho bọn tôi xe SUV với giá thêm mười đô thì sao?' },
          { who: 'Nate', voice: 'au-nam', text: "You drive a hard bargain. Alright, ten a day, as long as it's back by ten on Monday.", vi: 'Anh mặc cả ghê thật. Thôi được, thêm mười đô một ngày, miễn là sáng thứ Hai trả xe trước mười giờ.' },
          { who: 'Lâm', voice: 'uk-nam', text: 'Back by ten on Monday. That works for us. Thanks, Nate.' },
          { who: 'Nate', voice: 'au-nam', text: "No worries. Last thing: do you want to reduce the excess? The standard excess is four thousand dollars.", vi: 'Không có gì. Việc cuối: các bạn có muốn giảm mức tự chịu khi có hư hỏng không? Mức tiêu chuẩn là bốn nghìn đô.' },
          { who: 'Callie', voice: 'us-nu', text: 'Four thousand? Yes. Definitely yes.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd22-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao có thêm phí 27 đô một ngày?',
            options: ['Vì thêm người lái', 'Vì Ruairí dưới 25 tuổi', 'Vì đi đường núi', 'Vì trả xe muộn'],
            correct: 1,
            why: '"You\'re **twenty-four**, so there\'s a **young driver fee**." Ở Úc, nhiều hãng thuê xe thu thêm phí với tài xế dưới 25 tuổi. Đọc kỹ terms and conditions trước khi đặt.',
          },
          {
            q: 'Lâm thuyết phục Callie bằng cách nào?',
            options: [
              'Nói Callie lái giỏi',
              'Đề xuất Ruairí ngồi cạnh chỉ đường, mệt thì dừng ở Penrith, và nhắc là tiết kiệm được 80 đô',
              'Hứa trả hết tiền xăng',
              'Nói không ai khác lái được',
            ],
            correct: 1,
            why: 'Lâm **giải toả nỗi lo** (có người chỉ đường, có chỗ dừng) rồi nói **lợi ích** (saves us eighty dollars). Thuyết phục tốt là trả lời đúng điều người kia sợ.',
          },
          {
            q: 'Lâm đổi cái gì để lấy xe SUV với giá chỉ thêm 10 đô một ngày?',
            options: ['Trả tiền trước', 'Bỏ GPS 12 đô một ngày (dùng điện thoại thay)', 'Thuê thêm một ngày', 'Không mua bảo hiểm'],
            correct: 1,
            why: '"What if you **took that off** and gave us the SUV for ten more?" Mặc cả hay nhất là **cho đi một thứ mình không cần** để lấy thứ mình cần.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Hôm nay nhiều câu **If** rút gọn: **we\'d** /wiːd/, **it\'d** /ˈɪtəd/, **she\'d** /ʃiːd/. Con số nói kiểu gộp: **seven-twenty** = 720, **three-forty** = 340. Gõ lại đủ từ; số viết bằng chữ hay chữ số đều được chấp nhận ở câu có số.',
      },
      {
        t: 'dictation',
        id: 'gtd22-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — đề xuất mở', spell: 'What if we stayed in a cabin instead of a tent?', answer: 'What if we stayed in a cabin instead of a tent?' },
          { label: 'Câu 2 — điều kiện loại 2', spell: "If we left on Saturday morning, we'd only need two nights.", answer: "If we left on Saturday morning, we'd only need two nights.", alt: ['If we left on Saturday morning, we would only need two nights.', "If we left on Saturday morning we'd only need two nights."] },
          { label: 'Câu 3 — giá hơi cao (lịch sự)', spell: "That's a bit more than we were hoping to spend.", answer: "That's a bit more than we were hoping to spend.", alt: ['That is a bit more than we were hoping to spend.'] },
          { label: 'Câu 4 — mặc cả có đổi chác', spell: 'If we booked all three nights today, would you be able to do a better rate?', answer: 'If we booked all three nights today, would you be able to do a better rate?', alt: ['If we booked all 3 nights today, would you be able to do a better rate?'] },
          { label: 'Câu 5 — lời đề nghị cuối', spell: 'The best I can do is seven-twenty.', answer: 'The best I can do is seven-twenty.', alt: ['The best I can do is 720.', 'The best I can do is seven twenty.', 'The best I can do is $720.'] },
          { label: 'Câu 6 — xin thời gian', spell: 'I just need to run it by my housemates first.', answer: 'I just need to run it by my housemates first.' },
          { label: 'Câu 7 — chốt có điều kiện', spell: "Alright, ten a day, as long as it's back by ten on Monday.", answer: "Alright, ten a day, as long as it's back by ten on Monday.", alt: ["All right, ten a day, as long as it's back by ten on Monday.", "Alright, 10 a day, as long as it's back by 10 on Monday.", "Alright, ten a day, as long as it is back by ten on Monday."] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn làm gì'],
        rows: [
          ["I'm an intern, not a banker.", 'Câu đùa: tôi không có nhiều tiền, quá đắt.', 'Đưa phương án rẻ hơn, có con số.'],
          ["He's got a point.", 'Cậu ấy nói có lý (đang nghiêng về phía bạn).', 'Đi tiếp: hỏi người còn lại.'],
          ['Hear me out.', 'Nghe tôi nói hết đã rồi hãy gạt đi.', '(Câu để giữ lượt nói, dùng trước một đề xuất khó nghe.)'],
          ['Saturdays are always the first to go.', 'Hàng hiếm, quyết nhanh đi. Có thể thật, có thể là chiêu.', 'Hỏi lại bằng phương án khác, đừng vội chốt.'],
          ["I can't go that low.", 'Giá đó thấp quá, nhưng tôi vẫn còn đường lùi một chút.', 'Chờ con số tiếp theo, hoặc hỏi "What can you do?"'],
          ['The best I can do is…', 'Đây là gần như giá cuối.', 'Nhận, hoặc đổi chác thêm một thứ nhỏ (không phải tiền).'],
          ["I'll throw in…", 'Tôi cho thêm… (miễn phí).', 'Cảm ơn. Đó là tín hiệu họ muốn chốt.'],
          ["It's in the terms and conditions.", 'Quy định chung, nhân viên không bỏ được.', 'Đừng cãi; tìm cách tránh điều kiện đó (đổi tài xế).'],
          ['You drive a hard bargain.', 'Bạn mặc cả giỏi đấy (khen, và cũng là "tôi đồng ý").', 'Cảm ơn, chốt luôn.'],
          ["I'll think about it.", 'Nhiều khi là cách từ chối lịch sự.', 'Muốn biết chắc: "Can I call you back by five?"'],
        ],
        caption: 'Người bản xứ hiếm khi nói "No" thẳng khi mặc cả. Nghe **mức độ**: can\'t go that low < the best I can do < that\'s my final offer.',
      },
      {
        t: 'note',
        title: 'Mẹo: nghe số khi mặc cả mà không kịp thì làm gì',
        items: [
          'Người bản xứ đọc giá kiểu gộp: **two-sixty** = 260, **seven-twenty** = 720, **eleven-fifty** = 1.150. Nghe hai cụm số liền nhau thì gần như chắc là kiểu này.',
          'Luôn hỏi lại **đơn vị**: "Is that **per night** or **in total**?" · "Is that **per person**?" · "Does that **include** the cleaning fee?" Một nửa hiểu lầm khi mặc cả là vì đơn vị.',
          '**fifteen** nhấn âm cuối (fif-TEEN), **fifty** nhấn âm đầu (FIF-ty). Nghe không chắc thì hỏi: "Sorry, one-five or five-zero?"',
          'Trước khi đồng ý, **nhắc lại toàn bộ thoả thuận** như Lâm: "Seven-twenty, no cleaning fee, and a late check-out." Nói sai chỗ nào người kia sửa ngay.',
          'Mặc cả qua điện thoại mà không nghe kịp, xin gửi bằng chữ: "Could you text me the details? I want to show my housemates."',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Kỳ nghỉ', 'holiday · "hols"', 'vacation', 'holiday · "holidays"'],
          ['Nghỉ dài cuối tuần', 'bank holiday weekend', 'long weekend', 'long weekend'],
          ['Thuê xe', 'hire a car', 'rent a car', 'hire a car · rent a car'],
          ['Mức tự chịu khi có hư hỏng', 'excess', 'deductible', 'excess'],
          ['Xăng', 'petrol', 'gas', 'petrol'],
          ['Tổng cộng (nói)', 'in total · altogether', 'in total · all told', 'all up'],
          ['Hơi đắt', "That's a bit steep.", "That's pretty pricey.", "That's a bit steep."],
          ['Bớt giá đi', 'Could you knock a bit off?', 'Could you come down a little?', 'Could you knock a bit off?'],
          ['Góp tiền', 'chip in', 'chip in · pitch in', 'chip in · chuck in'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi đi chơi và mặc cả. Đọc điều khoản thuê xe ở Úc, gặp **excess** thì đó là số tiền **bạn tự trả** nếu xe hư hỏng, giống **deductible** của Mỹ.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b2-01 · Is the Rent Negotiable?** — thương lượng giá thuê căn hộ: hỏi giá gồm gì, đề xuất ký dài hạn và trả trước, rồi chốt điều khoản bằng văn bản.',
          '**en-ds-b2-02 · Can We Talk About the Noise?** — thoả thuận "luật nhà" với bạn ở chung: How about we…? · Could we say…? · Works for me.',
          '**en-a2-03 · A Weekend in Da Lat** — hai bạn lên kế hoạch đi Đà Lạt bằng xe khách đêm (mức dễ hơn, nghe để ôn cách bàn kế hoạch).',
          'Ba tập là ba chuyện khác bài hôm nay. Nghe để gặp lại câu đề xuất, mặc cả trong tình huống mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd22-noi',
    kind: 'speaking',
    title: 'Đưa đề xuất, nhượng bộ, chốt',
    goal: 'Đề xuất bằng What if…? / How about…?, thuyết phục bằng If we…, we could…, mặc cả bằng If we…, would you…?, nhượng bộ có điều kiện (as long as, on one condition) và chốt thoả thuận rõ ràng.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**30 câu mẫu**: đề xuất, đưa lý do, hỏi giá tốt hơn, đổi chác, nhượng bộ, đặt điều kiện, xin thời gian, chốt.',
          'Ngữ pháp: **điều kiện loại 2** (If + V2, would / could + V) và **What if…? / How about…?** Nối câu: **as long as**, **on one condition**.',
          'Cùng một ý ở ba mức: bạn bè · người bán · thư trang trọng.',
          'Ngôn ngữ cơ thể khi thương lượng; mặc cả ở đâu thì bình thường, ở đâu thì kỳ cục (Việt Nam, Anh, Mỹ, Úc, Nhật).',
          'Nhập vai: đặt lớp học lướt sóng theo nhóm. Cuối bài nhập vai với Gia sư AI hai lượt.',
        ],
      },

      { t: 'h', text: '1. 30 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Hai nhóm: **thuyết phục bạn bè** (câu 1–10) và **mặc cả với người bán** (câu 11–30). Cùng một khung "nếu… thì…" dùng được cho cả hai. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'What if we…?', pos: 'phr', ipa: '/ˈwʌt ɪf wi/', vi: 'Hay là mình…? (đề xuất mở, mềm)', ex: 'What if we stayed in a cabin instead of a tent?', exVi: 'Hay là mình ở cabin thay vì ở lều?', more: 'Sau What if dùng **V2** (mềm, giả định) hoặc **V hiện tại** (thẳng hơn): What if we **cook**? cũng đúng.' },
          { w: 'How about we…? / How about + V-ing?', pos: 'phr', ipa: '/ˈhaʊ əbaʊt wi/', vi: 'Hay là…? / … thì sao?', ex: 'How about cooking instead of eating out?', exVi: 'Hay là tự nấu thay vì ăn ngoài?', more: '**How about we cook?** (thân, rất hay nói) = **How about cooking?** Không nói ~~How about cook?~~' },
          { w: 'Can I throw in another idea?', pos: 'phr', ipa: '/kən aɪ ˌθroʊ ɪn əˌnʌðər aɪˈdiːə/', vi: 'Cho mình góp thêm một ý được không?', ex: 'Can I throw in another idea? What if we went on Saturday?', exVi: 'Cho mình góp một ý nhé? Hay là đi thứ Bảy?' },
          { w: 'Hear me out.', pos: 'phr', ipa: '/ˌhɪr mi ˈaʊt/', vi: 'Nghe mình nói hết đã.', ex: 'Hear me out. How about you drive and Ruairí navigates?', exVi: 'Nghe mình nói đã. Hay là cậu lái, Ruairí chỉ đường?' },
          { w: 'Think about it this way: …', pos: 'phr', ipa: '/ˈθɪŋk əbaʊt ɪt ðɪs ˈweɪ/', vi: 'Thử nghĩ thế này: …', ex: "Think about it this way: if it rained, we'd be stuck in a wet tent.", exVi: 'Thử nghĩ thế này: nếu mưa, mình kẹt trong cái lều ướt.' },
          { w: "If we…, we'd / we could…", pos: 'phr', ipa: '/ɪf wi … wiːd/', vi: 'Nếu mình…, thì mình sẽ / có thể…', ex: "If we left on Saturday, we'd only need two nights.", exVi: 'Nếu đi thứ Bảy thì mình chỉ cần hai đêm.' },
          { w: "It'd save us…", pos: 'phr', ipa: '/ˈɪtəd ˈseɪv ʌs/', vi: 'Như vậy tiết kiệm được…', ex: "It'd easily save us fifty each.", exVi: 'Như vậy dễ dàng tiết kiệm năm mươi mỗi người.', more: "**It'd** = It would. Lý do bằng **con số** luôn thuyết phục hơn lý do chung chung.", anh: 'money-bag' },
          { w: "It'd be worth it.", pos: 'phr', ipa: '/ˈɪtəd bi ˈwɝːθ ɪt/', vi: 'Đáng đồng tiền / đáng công.', ex: "It's a bit more, but it'd be worth it for the view.", exVi: 'Đắt hơn chút, nhưng đáng vì cảnh đẹp.' },
          { w: "He's got a point.", pos: 'phr', ipa: '/hiz ɡɑːt ə ˈpɔɪnt/', vi: 'Cậu ấy nói có lý.', ex: "He's got a point. Eating out adds up fast.", exVi: 'Cậu ấy nói có lý. Ăn ngoài tốn tiền nhanh lắm.' },
          { w: 'Would you be okay with…?', pos: 'phr', ipa: '/wʊd ju bi ˌoʊˈkeɪ wɪð/', vi: 'Bạn có chịu… không? (hỏi ý người còn lưỡng lự)', ex: 'Would you be okay with the mountains this time?', exVi: 'Lần này lên núi cậu có chịu không?' },
          { w: 'Is there any flexibility on…?', pos: 'phr', ipa: '/ɪz ðer ˌeni ˌfleksəˈbɪləti ɑːn/', vi: '… có linh động được không?', ex: 'Is there any flexibility on the minimum stay?', exVi: 'Quy định ở tối thiểu có linh động được không?', more: 'Câu mặc cả **lịch sự nhất**, dùng được với giá, ngày, điều khoản.' },
          { w: 'That\'s a bit more than we were hoping to spend.', pos: 'phr', ipa: '/ðæts ə ˌbɪt ˈmɔːr ðən wi wər ˈhoʊpɪŋ tə spend/', vi: 'Hơi quá mức bọn tôi định chi. (= đắt quá, nói lịch sự)', ex: "Eight-sixty all up? That's a bit more than we were hoping to spend.", exVi: 'Tổng tám trăm sáu mươi? Hơi quá mức bọn tôi định chi.' },
          { w: "That's a bit steep.", pos: 'phr', ipa: '/ðæts ə ˌbɪt ˈstiːp/', vi: 'Hơi chát. (Anh, Úc; thân hơn)', ex: "Twenty-seven a day? That's a bit steep.", exVi: 'Hai mươi bảy một ngày? Hơi chát đấy.' },
          { w: "What's the best you can do?", pos: 'phr', ipa: '/ˈwʌts ðə ˈbest ju kən ˈduː/', vi: 'Anh/chị bớt được tối đa bao nhiêu?', ex: "We'd love to book it. What's the best you can do?", exVi: 'Bọn tôi muốn đặt lắm. Anh bớt được tối đa bao nhiêu?' },
          { w: 'Could you do it for…?', pos: 'phr', ipa: '/kʊd ju ˈduː ɪt fər/', vi: 'Anh/chị lấy … được không?', ex: 'Could you do seven hundred?', exVi: 'Chị lấy bảy trăm được không?', more: 'Nói thẳng **một con số**. "Can you make it cheaper?" quá mơ hồ, người bán chỉ bớt tượng trưng.' },
          { w: 'If we…, would you be able to…?', pos: 'phr', ipa: '/ɪf wi … wʊd ju bi ˈeɪbl tə/', vi: 'Nếu bọn tôi…, anh/chị có thể… không? (đổi chác)', ex: 'If we booked all three nights today, would you be able to do a better rate?', exVi: 'Nếu hôm nay đặt luôn ba đêm, chị có bớt giá được không?' },
          { w: 'upfront', pos: 'adv', ipa: '/ˌʌpˈfrʌnt/', vi: 'trả trước (toàn bộ)', ex: 'What if we paid the full amount upfront?', exVi: 'Nếu bọn tôi trả hết tiền trước thì sao?', anh: 'credit-card' },
          { w: 'throw in', pos: 'v', ipa: '/ˌθroʊ ˈɪn/', vi: 'cho thêm, tặng kèm', ex: "I'll throw in a late check-out on Monday.", exVi: 'Tôi cho thêm trả phòng muộn ngày thứ Hai.', more: 'Bạn cũng hỏi được: "**Could you throw in** breakfast?"' },
          { w: 'The best I can do is…', pos: 'phr', ipa: '/ðə ˈbest aɪ kən ˈduː ɪz/', vi: 'Tốt nhất tôi lấy… (gần như giá cuối)', ex: 'The best I can do is seven-twenty.', exVi: 'Tốt nhất tôi lấy bảy trăm hai mươi.' },
          { w: "I can't go that low.", pos: 'phr', ipa: '/aɪ ˈkænt ɡoʊ ˈðæt loʊ/', vi: 'Tôi không xuống tới mức đó được.', ex: "Seven hundred? Sorry, I can't go that low.", exVi: 'Bảy trăm? Xin lỗi, tôi không xuống tới mức đó được.' },
          { w: 'split the difference', pos: 'phr', ipa: '/ˌsplɪt ðə ˈdɪfrəns/', vi: 'mỗi bên nhường một nửa khoảng chênh', ex: 'You said eight hundred, we said seven. Shall we split the difference at seven-fifty?', exVi: 'Anh nói tám trăm, bọn tôi nói bảy trăm. Mình chia đôi ở bảy trăm rưỡi nhé?', more: 'Cùng nghĩa: **meet (someone) halfway**.' },
          { w: 'on one condition', pos: 'phr', ipa: '/ɑːn ˌwʌn kənˈdɪʃn/', vi: 'với một điều kiện', ex: 'Okay, on one condition: nobody comments on my driving.', exVi: 'Được, với một điều kiện: không ai được nhận xét cách mình lái.' },
          { w: 'as long as', pos: 'conj', ipa: '/əz ˈlɔːŋ əz/', vi: 'miễn là', ex: "Ten a day, as long as it's back by ten on Monday.", exVi: 'Thêm mười một ngày, miễn là thứ Hai trả xe trước mười giờ.' },
          { w: 'That works for me / us.', pos: 'phr', ipa: '/ðæt ˈwɝːks fər ˈmiː/', vi: 'Thế được đấy. / Tôi đồng ý.', ex: 'Back by ten on Monday. That works for us.', exVi: 'Thứ Hai trả trước mười giờ. Bọn tôi đồng ý.' },
          { w: 'I can live with that.', pos: 'phr', ipa: '/aɪ kən ˈlɪv wɪð ðæt/', vi: 'Thế cũng được. (chấp nhận, không hào hứng lắm)', ex: "Two nights in the mountains? Fine, I can live with that.", exVi: 'Hai đêm trên núi à? Thôi, thế cũng được.' },
          { w: 'run it by someone', pos: 'phr', ipa: '/ˌrʌn ɪt ˈbaɪ ˌsʌmwʌn/', vi: 'hỏi ý ai trước khi quyết', ex: 'I just need to run it by my housemates first.', exVi: 'Tôi chỉ cần hỏi các bạn cùng nhà trước.' },
          { w: 'hold (a booking)', pos: 'v', ipa: '/hoʊld/', vi: 'giữ chỗ tạm', ex: 'Could you hold it for me until this afternoon?', exVi: 'Chị giữ chỗ giúp tôi tới chiều được không?', anh: 'hourglass-not-done' },
          { w: 'a compromise', pos: 'n', ipa: '/ə ˈkɑːmprəmaɪz/', vi: 'giải pháp thoả hiệp (mỗi bên nhường một ít)', ex: 'Cabins in the mountains is a good compromise.', exVi: 'Ở cabin trên núi là phương án thoả hiệp hay.', anh: 'balance-scale' },
          { w: 'a deal-breaker', pos: 'n', ipa: '/ə ˈdiːl ˌbreɪkər/', vi: 'điểm không thể chấp nhận (có nó là thôi, không chốt)', ex: 'No kitchen is a deal-breaker for us.', exVi: 'Không có bếp là bọn tôi không thuê.' },
          { w: "Deal. / You've got a deal.", pos: 'phr', ipa: '/ˈdiːl/ · /juv ˈɡɑːt ə ˈdiːl/', vi: 'Chốt! / Đồng ý!', ex: "I'll go for the cabin if I'm in charge of the barbecue. — Deal.", exVi: 'Tôi chịu ở cabin nếu được lo nướng thịt. — Chốt.', anh: 'handshake' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Với bạn cùng nhà, đề xuất kiểu đùa cũng được. Với người bán, dùng cột **giữa**: lịch sự nhưng có con số. Cột **trang trọng** dùng khi viết email thương lượng hoặc nói với người lớn tuổi, khách Nhật.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (người bán)', 'Trang trọng (email, khách)'],
        rows: [
          ['Đề xuất', "Let's just go camping!", 'How about we book the smaller cabin?', 'Would you consider a three-night booking at a reduced rate?'],
          ['Thuyết phục', "Trust me, it'll be fun.", "Think about it this way: it'd save us fifty each.", 'This option would allow us to reduce costs by around 20%.'],
          ['Chê giá', "No way, that's way too much!", "That's a bit more than we were hoping to spend.", 'Unfortunately, this is slightly above our budget.'],
          ['Đòi giá tốt hơn', 'Can you do it cheaper?', 'Is there any flexibility on the price?', 'Would you be able to offer a better rate?'],
          ['Đặt điều kiện', 'Only if I get the big room.', "Okay, as long as it's back by ten.", 'We would be happy to proceed, provided that the cleaning fee is waived.'],
          ['Nhượng bộ', 'Fine, you win.', 'Okay, I can live with that.', 'We would be willing to accept this.'],
          ['Xin thời gian', 'Lemme ask the others.', 'I need to run it by my housemates first.', 'I will need to consult my colleagues and will reply by 5 pm.'],
          ['Chốt', 'Deal!', 'Great, that works for us.', 'Thank you. We are pleased to confirm the booking on these terms.'],
        ],
        caption: '**Lemme** = let me (chỉ nói, không viết trang trọng). **provided that** = as long as, nhưng trang trọng hơn.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Đề xuất bằng tiếng Anh hay đi qua **câu giả định**: thay vì nói "Mình đi thứ Bảy đi", người ta nói "**If we left** on Saturday, **we\'d** only need two nights." Động từ lùi về quá khứ (left, booked, took) nhưng **ý là hiện tại / tương lai**: nó làm đề xuất nghe mềm, như đang cùng nghĩ, không ép.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: "If + S + V2, S + would ('d) / could + V",
            vi: 'Điều kiện loại 2: giả định một phương án để người kia thấy kết quả. Dùng để thuyết phục.',
            examples: [
              { en: "If we left on Saturday, we'd only need two nights.", vi: 'Nếu mình đi thứ Bảy thì chỉ cần hai đêm.' },
              { en: "If it rained, we'd be stuck in a wet tent.", vi: 'Nếu trời mưa thì mình kẹt trong cái lều ướt.' },
              { en: 'If Callie drove, we could save eighty dollars.', vi: 'Nếu Callie lái thì tiết kiệm được tám mươi đô.' },
            ],
          },
          {
            formula: 'If + S + V2, would / could you + V?',
            vi: 'Mặc cả có đổi chác: "nếu bên tôi làm X, bên anh có làm Y không?"',
            examples: [
              { en: 'If we booked today, would you be able to do a better rate?', vi: 'Nếu đặt hôm nay, chị có bớt giá được không?' },
              { en: 'If we paid upfront, could you do seven hundred?', vi: 'Nếu trả trước, chị lấy bảy trăm được không?' },
              { en: 'If we took the bigger car, would you keep the same price?', vi: 'Nếu lấy xe to hơn, anh có giữ nguyên giá không?' },
            ],
          },
          {
            formula: "If I were you, I'd + V",
            vi: 'Khuyên ai đó. Dùng were cho mọi ngôi (If I were, if she were).',
            examples: [
              { en: "If I were you, I'd take the smaller cabin.", vi: 'Nếu là cậu, mình sẽ lấy cabin nhỏ.' },
              { en: "If I were you, I'd ask for a late check-out.", vi: 'Nếu là cậu, mình sẽ xin trả phòng muộn.' },
              { en: "If I were her, I wouldn't drive at night.", vi: 'Nếu là cô ấy, mình sẽ không lái xe ban đêm.' },
            ],
          },
          {
            formula: 'What if + S + V2 (mềm) / V (thẳng)…?',
            vi: 'Đề xuất mở, mời người kia cùng xét.',
            examples: [
              { en: 'What if we stayed in a cabin instead?', vi: 'Hay là mình ở cabin?' },
              { en: 'What if Callie were the main driver?', vi: 'Nếu Callie là tài xế chính thì sao?' },
              { en: 'What if we cook instead of eating out?', vi: 'Hay mình tự nấu thay vì ăn ngoài?' },
            ],
          },
          {
            formula: 'How about + V-ing…? / How about we + V…?',
            vi: 'Đề xuất ngắn, thân mật. Sau How about là V-ing hoặc một câu đủ chủ ngữ.',
            examples: [
              { en: 'How about leaving on Saturday morning?', vi: 'Hay là sáng thứ Bảy mới đi?' },
              { en: 'How about we split the petrol four ways?', vi: 'Hay là tiền xăng chia bốn?' },
              { en: "How about this: I'll book it, and you all pay me back.", vi: 'Thế này nhé: mình đặt, rồi mọi người trả lại mình.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu', 'Loại', 'Người nói nghĩ gì'],
        rows: [
          ["If we **leave** on Saturday, we'**ll** need two nights.", 'Loại 1 (Ngày 17)', 'Kế hoạch thật, khả năng cao. Đang tính toán.'],
          ["If we **left** on Saturday, we'**d** only need two nights.", 'Loại 2 (hôm nay)', 'Đưa ra một khả năng để mọi người cân nhắc. Mềm hơn, không ép.'],
          ['If we **book** today, **will** you give us a discount?', 'Loại 1', 'Hỏi thẳng, gần như đặt điều kiện.'],
          ['If we **booked** today, **would** you be able to do a better rate?', 'Loại 2', 'Hỏi thăm dò, lịch sự hơn. Hợp khi mặc cả.'],
          ['If I **were** you, I**\'d** take it.', 'Loại 2', 'Không thể là bạn được: chỉ là lời khuyên.'],
        ],
        caption: 'Tiếng Việt không đổi thì nên "nếu đi thì…" chỉ có một cách nói. Tiếng Anh có hai, và **loại 2 lịch sự hơn** khi đề xuất hay mặc cả. Đừng trộn: ~~If we leave…, we would…~~',
      },
      {
        t: 'rule',
        formula: "If + S + V2, S + would / could + V · What if + S + V2…? · How about + V-ing / How about we + V…?",
        vi: 'Đề xuất mềm và mặc cả lịch sự đều dùng điều kiện loại 2: động từ lùi về quá khứ, ý vẫn là bây giờ. Khi nói, would rút gọn thành \'d: we\'d, it\'d, I\'d.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: as long as · on one condition',
        items: [
          '**as long as** = miễn là — gắn điều kiện vào lời đồng ý: "I\'ll go for the cabin, **as long as** I\'m in charge of the barbecue."',
          'Sau as long as dùng **hiện tại đơn**, kể cả khi nói về tương lai: "as long as it**\'s** back by ten" (không nói ~~as long as it will be back~~).',
          '**on one condition: …** = với một điều kiện — đặt trước, rồi nói điều kiện sau dấu hai chấm: "Okay, **on one condition**: nobody comments on my driving."',
          'Trang trọng hơn: **provided that** (= as long as) — "We would be happy to book, **provided that** the cleaning fee is waived." Hợp với email.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd22-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "If + S + V2, S + would / could + V · What if…? · How about…? · as long as",
        items: [
          { q: 'Nếu mình đi thứ Bảy thì chỉ cần hai đêm.', hint: "if we left, we'd only need", answers: ["If we left on Saturday, we'd only need two nights.", 'If we left on Saturday, we would only need two nights.', "If we went on Saturday, we'd only need two nights.", 'If we went on Saturday, we would only need two nights.', "If we left on Saturday, we'd just need two nights."] },
          { q: 'Hay là mình tự nấu thay vì ăn ngoài?', hint: 'how about / what if, instead of eating out', answers: ['How about cooking instead of eating out?', 'How about we cook instead of eating out?', 'What if we cooked instead of eating out?', 'What if we cook instead of eating out?', 'Why don\'t we cook instead of eating out?'] },
          { q: 'Nếu bọn tôi đặt hôm nay, chị có bớt giá được không?', hint: 'if we booked, would you be able to, a better rate / a discount', answers: ['If we booked today, would you be able to do a better rate?', 'If we booked today, would you be able to give us a better rate?', 'If we booked today, could you do a better rate?', 'If we booked today, would you be able to give us a discount?', 'If we booked today, could you give us a discount?', 'If we booked it today, would you be able to do a better rate?'] },
          { q: 'Nếu là cậu, mình sẽ lấy cabin nhỏ.', hint: "if I were you, I'd", answers: ["If I were you, I'd take the smaller cabin.", 'If I were you, I would take the smaller cabin.', "If I were you, I'd take the small cabin.", "If I were you, I'd book the smaller cabin.", 'If I were you, I would book the smaller cabin.'] },
          { q: 'Được, miễn là cậu lo vụ nướng thịt.', hint: "okay, as long as, in charge of the barbecue", answers: ["Okay, as long as you're in charge of the barbecue.", 'Okay, as long as you are in charge of the barbecue.', "OK, as long as you're in charge of the barbecue.", "Fine, as long as you're in charge of the barbecue.", "Okay, as long as you do the barbecue.", "Okay, as long as you're in charge of the barbeque."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 9 lỗi thật',
        items: [
          '~~If we leave on Saturday, we would need two nights.~~ → **If we left…, we\'d…** (đề xuất mềm) hoặc **If we leave…, we\'ll…** (kế hoạch thật). Không trộn hai loại trong một câu.',
          '~~How about go camping?~~ → **How about going camping?** hoặc **How about we go camping?** Sau How about không dùng động từ nguyên mẫu trơn.',
          '~~What about if we…~~ → **What if we…?** Gọn hơn, tự nhiên hơn.',
          '~~If I am you, I will…~~ → **If I were you, I\'d…** Đây là khung cố định để khuyên.',
          '~~Can you discount for me?~~ / ~~Cheaper, please!~~ → **Is there any flexibility on the price?** · **Could you do it for 700?** discount là danh từ ở đây: "give us **a** discount".',
          '~~We are four people.~~ → **There are four of us.** Cách nói số người trong nhóm.',
          '~~OK, OK, no problem~~ (đồng ý ngay cho đỡ ngại, rồi về nhà mới thấy thiệt) → **"Let me run it by my friends. Can I call you back by five?"** Xin thời gian là bình thường, không mất lịch sự.',
          '~~I will think about it.~~ (khi thật ra định đồng ý) → **"That sounds good. I just need to check one thing."** Trong tiếng Anh, "I\'ll think about it" hay bị hiểu là **từ chối khéo**.',
          'Mặc cả ở **siêu thị, cửa hàng chuỗi** tại Anh, Mỹ, Úc như ở chợ Việt Nam → kỳ cục. Mặc cả hợp ở: **đồ cũ, chợ phiên, thuê chỗ ở đặt trực tiếp, thuê xe, mua xe, dịch vụ theo nhóm**.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi thương lượng' },
      {
        t: 'p',
        text: 'Thương lượng giỏi là **bình tĩnh và thân thiện**, không phải "căng". Ở nhiều nước nói tiếng Anh, mặc cả kiểu kịch tính (giả vờ bỏ đi, kêu than) dễ bị coi là thiếu tôn trọng. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi đề xuất và mặc cả',
        items: [
          { anh: 'palm-up-hand', w: 'Hear me out.', ro: '/ˌhɪr mi ˈaʊt/', vi: 'Lòng bàn tay mở, hơi đưa ra trước: mời người kia nghe, không ép.' },
          { anh: 'face-with-raised-eyebrow', w: 'Eight-sixty all up?', ro: '/ˌeɪt ˈsɪksti ɔːl ˈʌp/', vi: 'Nhướng mày nhẹ khi nghe giá: tín hiệu "hơi đắt" rất dễ hiểu. Đừng nhăn mặt hay thở dài thườn thượt.' },
          { anh: 'thinking-face', w: 'Hmm… let me think about that.', ro: '/ˈlet mi ˈθɪŋk əbaʊt ðæt/', vi: '**Im lặng 3–5 giây** là bình thường khi thương lượng. Đừng vội lấp khoảng lặng bằng cách tự nhượng bộ; nhiều khi người kia sẽ tự đưa giá tốt hơn.' },
          { anh: 'person-shrugging', w: 'I can live with that.', ro: '/aɪ kən ˈlɪv wɪð ðæt/', vi: 'Nhún vai nhẹ + mỉm cười = chấp nhận, không hào hứng lắm. Thân thiện, không phải thái độ.' },
          { anh: 'ok-hand', w: 'That works for us.', ro: '/ðæt ˈwɝːks fər ʌs/', vi: 'Ở Anh, Mỹ, Úc: "OK". **Cẩn thận**: ở Brazil, Thổ Nhĩ Kỳ cử chỉ này bị coi là thô; ở Nhật nó có thể mang nghĩa "tiền". Gật đầu + nói ra lời là an toàn nhất.' },
          { anh: 'person-gesturing-no', w: '(đừng) No, no, cheaper!', ro: '', vi: 'Đừng xua tay lia lịa như mặc cả ở chợ khi đang ở quầy có giá niêm yết. Nói "Is there any flexibility on the price?" với mặt bình thản.' },
          { anh: 'hourglass-not-done', w: 'Could you hold it until five?', ro: '/kʊd ju ˈhoʊld ɪt ənˌtɪl ˈfaɪv/', vi: 'Xin thời gian là chuyện bình thường. Với khách **Nhật**, quyết định thường không đưa ra ngay tại chỗ; họ cần hỏi nhóm trước.' },
          { anh: 'handshake', w: "Deal! / You've got a deal.", ro: '/ˈdiːl/', vi: 'Chốt mua bán đồ cũ, thuê xe, thoả thuận với chủ nhà: **bắt tay** + nhắc lại thoả thuận một lần. Rồi nhắn tin xác nhận bằng chữ.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Úc', 'Mỹ', 'Nhật'],
        rows: [
          ['Mặc cả ở đâu', 'Chợ, hàng rong, đồ cũ, thuê nhà, nhiều dịch vụ.', 'Đồ cũ, chợ phiên, thuê nhà / chỗ nghỉ đặt trực tiếp, xe. Hiếm ở cửa hàng.', 'Như Anh · Úc; mua xe hơi thì mặc cả nhiều.', 'Gần như không mặc cả ở cửa hàng.'],
          ['Nói "không" khi mặc cả', '"Để em xem đã."', '"I\'ll have a think." · "That\'s a bit steep."', '"I\'ll pass." · "That\'s more than I want to spend."', '"Chúng tôi sẽ cân nhắc" — thường là không.'],
          ['Ra quyết định nhóm', 'Người lớn tuổi hoặc người trả tiền chốt.', 'Mỗi người nói ý, rồi thoả hiệp; ai cũng được một chút.', 'Nói thẳng ý mình, bỏ phiếu cũng phổ biến.', 'Bàn kỹ trước để cả nhóm đồng thuận, ít tranh luận công khai.'],
          ['Im lặng', 'Dễ thấy ngượng, muốn nói lấp.', 'Chấp nhận được vài giây.', 'Hay lấp im lặng bằng lời.', 'Im lặng dài là bình thường, thể hiện đang suy nghĩ.'],
        ],
        caption: 'Bài học chung: **đề xuất có con số, nhượng bộ có điều kiện, chốt có chữ**. Ở đâu cũng dùng được.',
      },

      { t: 'h', text: '6. Phát âm: we\'d, it\'d, What if, và nhấn để so sánh' },
      {
        t: 'p',
        text: '(1) **we\'d / it\'d / I\'d** phải nghe ra âm /d/ nhẹ ở cuối, nếu không "we\'d need" nghe thành "we need" và câu mất nghĩa giả định. (2) **What if** nối thành "wha-dif" (âm t giữa hai nguyên âm kiểu Mỹ, Úc nghe như "đ"). (3) Khi so sánh con số, **nhấn mạnh từ khác biệt**: "**SEVEN**-twenty, not **EIGHT**-sixty".',
      },
      {
        t: 'phatam',
        id: 'gtd22-phat-am',
        title: 'Luyện phát âm — dạng rút gọn và nhấn đối lập trong 8 câu thương lượng',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ âm /d/ của \'d, nối What‿if, và nhấn vào con số.',
        items: [
          { text: "If we left on Saturday, we'd only need two nights.", ipa: 'ɪf wi left ɑːn sætərdeɪ wiːd oʊnli niːd tuː naɪts', vi: 'left có /ft/ cuối · we\'d giữ /d/ nhẹ · nights có /ts/ cuối' },
          { text: 'What if we stayed in a cabin?', ipa: 'wʌt ɪf wi steɪd ɪn ə kæbɪn', vi: 'nối What‿if thành "wha-dif" · lên giọng nhẹ ở cuối câu hỏi đề xuất' },
          { text: 'How about we cook instead?', ipa: 'haʊ əbaʊt wi kʊk ɪnsted', vi: 'about đọc nhẹ /əbaʊt/ · nhấn cook và -STEAD' },
          { text: 'Is there any flexibility on the price?', ipa: 'ɪz ðer eni fleksəbɪləti ɑːn ðə praɪs', vi: 'flexibility nhấn -BIL- · price có /s/ cuối' },
          { text: "That's a bit more than we were hoping to spend.", ipa: 'ðæts ə bɪt mɔːr ðən wi wər hoʊpɪŋ tə spend', vi: 'than, were, to đọc nhẹ · nhấn more và spend' },
          { text: 'The best I can do is seven-twenty.', ipa: 'ðə best aɪ kən duː ɪz sevən twenti', vi: 'nối best‿I · can đọc nhẹ /kən/ · nhấn seven' },
          { text: 'I can live with that.', ipa: 'aɪ kən lɪv wɪð ðæt', vi: 'live /lɪv/ âm i ngắn, có /v/ cuối · with có /ð/' },
          { text: 'Fifteen, not fifty.', ipa: 'fɪftiːn nɑːt fɪfti', vi: 'fif-TEEN nhấn sau, kéo dài /iːn/ · FIF-ty nhấn trước' },
        ],
      },

      { t: 'h', text: '7. Thuyết phục nhóm 5 bước — và mặc cả 5 bước' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Thuyết phục bạn bè',
        caption: 'Bước 4 là bước người Việt hay bỏ: trả lời đúng **nỗi lo** của người đang phản đối (tiền, thời gian, sợ lạnh, sợ lái xe).',
        steps: [
          { label: 'Ghi nhận ý người khác', sub: "Fair point, the beach house looks amazing." },
          { label: 'Đưa đề xuất', sub: 'What if we stayed in a cabin instead?' },
          { label: 'Hai lý do, có con số', sub: "If we left on Saturday, it'd be $170 each." },
          { label: 'Giải toả nỗi lo', sub: "If you got tired, we could stop in Penrith." },
          { label: 'Hỏi chốt', sub: 'Would you be okay with that?' },
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Mặc cả với người bán',
        caption: 'Đổi chác bằng thứ **mình không cần lắm** (trả trước, ở thêm đêm, bỏ GPS) để lấy thứ mình cần (giá, phòng to, giờ trả phòng).',
        steps: [
          { label: 'Hỏi rõ giá gồm gì', sub: 'Is that per night or all up?' },
          { label: 'Nêu giới hạn lịch sự', sub: "That's a bit more than we were hoping to spend." },
          { label: 'Đề xuất đổi chác', sub: 'If we booked today, would you…?' },
          { label: 'Nhượng bộ có điều kiện', sub: 'Okay, as long as…' },
          { label: 'Nhắc lại + xin bằng chữ', sub: 'So $720, no cleaning fee. Could you text me that?' },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "Fair point, Callie. The beach house does look amazing.", vi: 'Callie nói đúng. Nhà biển trông tuyệt thật.' },
          { en: 'But what if we went to the mountains this time and saved the beach for December?', vi: 'Nhưng hay là lần này lên núi, để biển cho tháng Mười Hai?' },
          { en: "If we stayed in a cabin and cooked, it'd be about half the price.", vi: 'Nếu ở cabin và tự nấu thì chỉ khoảng nửa giá.' },
          { en: "And if it rained, we'd still have a fireplace and a kitchen.", vi: 'Mà nếu mưa thì vẫn có lò sưởi và bếp.' },
          { en: 'Would everyone be okay with that? Let me know by tonight and I\'ll book it.', vi: 'Mọi người thấy được không? Báo mình trước tối nay để mình đặt.' },
        ],
      },
      {
        t: 'p',
        text: 'Giờ đến lượt bạn: nghĩ một chuyện **thật** bạn cần thuyết phục nhóm (đi ăn đâu, chia tiền nhà, đi chơi cuối tuần). Viết 5 câu theo 5 bước, **ít nhất 2 câu If** loại 2, rồi đọc to.',
      },

      { t: 'h', text: '8. Nhập vai: đặt lớp lướt sóng theo nhóm' },
      {
        t: 'dialogue',
        title: 'Ở quầy trường dạy lướt sóng, bãi Bondi — Lâm muốn đặt cho cả nhà',
        lines: [
          { who: 'Lâm', role: 'a', text: "Hi. We're thinking of booking a surf lesson for next Saturday. How much is it?", vi: 'Chào chị. Bọn tôi định đặt một buổi học lướt sóng thứ Bảy tới. Giá bao nhiêu ạ?' },
          { who: 'Jade', role: 'b', text: "It's ninety-five per person for a two-hour group lesson. Board and wetsuit included.", vi: 'Chín mươi lăm mỗi người cho buổi học nhóm hai tiếng. Đã gồm ván và đồ lặn.' },
          { who: 'Lâm', role: 'a', text: "Okay. There are six of us. If we all booked together, would you be able to do a group rate?", vi: 'Vâng. Bọn tôi có sáu người. Nếu cả sáu cùng đặt, chị có giá nhóm được không?' },
          { who: 'Jade', role: 'b', text: "For six, I could do eighty-five each.", vi: 'Sáu người thì tôi lấy tám mươi lăm mỗi người.' },
          { who: 'Lâm', role: 'a', text: "That helps. What if we came at eight, for the early lesson? I've heard it's quieter.", vi: 'Thế đỡ rồi. Nếu bọn tôi đến buổi sớm lúc tám giờ thì sao? Nghe nói buổi đó vắng hơn.' },
          { who: 'Jade', role: 'b', text: "It is. The eight o'clock is eighty, but you'd need to be here by seven-forty-five.", vi: 'Đúng vậy. Buổi tám giờ là tám mươi, nhưng phải có mặt trước tám giờ kém mười lăm.' },
          { who: 'Lâm', role: 'a', text: "That works for us. And could you throw in the photos? I saw you sell them separately.", vi: 'Bọn tôi đồng ý. Chị tặng kèm ảnh được không? Tôi thấy bên chị bán ảnh riêng.' },
          { who: 'Jade', role: 'b', text: "The photo pack's usually forty. I'll do it for twenty, as long as you book online today.", vi: 'Gói ảnh bình thường bốn mươi. Tôi lấy hai mươi, miễn là các bạn đặt online ngay hôm nay.' },
          { who: 'Lâm', role: 'a', text: "Deal. So, six people at eighty, eight o'clock Saturday, photos for twenty. Could you send me the link?", vi: 'Chốt. Vậy sáu người, mỗi người tám mươi, tám giờ thứ Bảy, ảnh hai mươi. Chị gửi tôi đường dẫn nhé?' },
          { who: 'Jade', role: 'b', text: "Sure. What's your email?", vi: 'Vâng. Email của anh là gì?' },
        ],
      },
      {
        t: 'build',
        id: 'gtd22-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Lâm (5 câu)',
        items: [
          { vi: 'Bọn tôi có sáu người.', chips: ['There', 'are', 'six', 'of', 'us.', 'We', 'people'], answer: ['There', 'are', 'six', 'of', 'us.'] },
          { vi: 'Nếu cả sáu cùng đặt, chị có giá nhóm được không?', chips: ['If', 'we', 'all', 'booked', 'together,', 'would', 'you', 'do', 'a', 'group', 'rate?', 'book', 'will'], answer: ['If', 'we', 'all', 'booked', 'together,', 'would', 'you', 'do', 'a', 'group', 'rate?'] },
          { vi: 'Nếu bọn tôi đến buổi sớm thì sao?', chips: ['What', 'if', 'we', 'came', 'for', 'the', 'early', 'lesson?', 'about', 'come'], answer: ['What', 'if', 'we', 'came', 'for', 'the', 'early', 'lesson?'] },
          { vi: 'Chị tặng kèm ảnh được không?', chips: ['Could', 'you', 'throw', 'in', 'the', 'photos?', 'give', 'up'], answer: ['Could', 'you', 'throw', 'in', 'the', 'photos?'] },
          { vi: 'Chốt. Chị gửi tôi đường dẫn nhé?', chips: ['Deal.', 'Could', 'you', 'send', 'me', 'the', 'link?', 'Done', 'to'], answer: ['Deal.', 'Could', 'you', 'send', 'me', 'the', 'link?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd22-noi-tra-loi',
        part: '1',
        questions: [
          'Your friends want to go somewhere expensive this weekend. What would you suggest instead, and why?',
          "If you could change one thing about where you live, what would it be?",
          'Have you ever bargained for something? What happened?',
          'A friend is worried about the cost of a trip. How would you persuade them to come?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are the owner of a small holiday cabin in the Blue Mountains, Australia. I want to book for a long weekend. Your rules: three-night minimum on long weekends, $280 a night plus a $90 cleaning fee. You can give a discount, but only if I offer something in return (booking today, paying upfront, staying an extra night). Never go below $750 in total. Use natural Australian phrases like \'all up\' and \'no worries\'. Speak at natural speed (B1+ to B2). After we agree or after 12 turns, tell me in Vietnamese: how many second conditional sentences I used correctly, whether I repeated the final deal, and two better sentences I could have said."',
          'Lượt hai **đổi vai**: AI là bạn cùng nhà muốn đi một chuyến đắt tiền và không chịu nghe. Bạn phải thuyết phục theo 5 bước, dùng ít nhất 3 câu **If…, we\'d…** và một câu **as long as**, và đi tới một thoả hiệp cả hai cùng được.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd22-viet',
    kind: 'writing',
    title: 'Tin nhắn thuyết phục nhóm, đề xuất kế hoạch',
    goal: 'Viết tin nhắn đề xuất kế hoạch cho nhóm, thuyết phục một người còn lưỡng lự, chốt kế hoạch có ai-làm-gì-trả-bao-nhiêu, và viết email thương lượng giá lịch sự với người bán.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao tin nhắn thuyết phục hay bị "seen" rồi im',
        items: [
          'Nhóm chat có năm người thì ai cũng chờ người khác trả lời trước. Tin nhắn đề xuất tốt phải **dễ trả lời bằng một chữ**: Yes, No, A hay B.',
          'Khung chung: **một đề xuất → hai, ba lý do có con số → giải toả nỗi lo → câu hỏi chốt → hạn**.',
          'Hôm nay bạn viết 4 loại, mỗi loại hai mức đặt cạnh nhau: **thân** (nhóm bạn) và **trang trọng** (email cho người bán, chủ nhà).',
          'Dùng lại câu của bài Nói: **What if we…? · If we…, we could… · as long as · Would you be able to…?**',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu tin, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Đề xuất kế hoạch',
        caption: 'Bản thân mật dùng emoji và câu ngắn. Bản trang trọng là email gửi chỗ nghỉ để hỏi giá theo đúng đề xuất.',
        cols: [
          {
            title: 'Thân mật (nhóm chat nhà chung)',
            anh: 'speech-balloon',
            items: [
              'Hey all 👋 idea for the long weekend:',
              'What if we did the Blue Mountains but stayed in a cabin instead of camping?',
              "If we cooked ourselves, it'd be around $180 each for 3 nights, all in.",
              "And no wet tent if it rains 😅",
              'Thumbs up 👍 or down 👎 by 9 tonight and I\'ll book it!',
            ],
          },
          {
            title: 'Trang trọng (email hỏi chỗ nghỉ)',
            anh: 'e-mail',
            items: [
              'Dear Hollie,',
              'We are a group of four looking to stay with you over the October long weekend.',
              'Would the one-bedroom cabin be available from Friday 2 to Monday 5 October?',
              'If we booked all three nights this week, would you be able to offer a better rate?',
              'Kind regards,',
              'Lam Nguyen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Thuyết phục người còn lưỡng lự',
        caption: 'Đừng nhắc lại đề xuất; trả lời đúng **nỗi lo** của người đó.',
        cols: [
          {
            title: 'Thân mật (nhắn riêng Ruairí)',
            anh: 'mobile-phone',
            items: [
              "Hey, I know you'd rather camp 😄",
              "Think about it this way: if it rained, we'd be stuck in a tent for 2 days.",
              "With a kitchen we'd save at least $50 each on food.",
              'And the barbecue is all yours. Deal?',
            ],
          },
          {
            title: 'Trang trọng (trả lời báo giá, đề nghị giá khác)',
            anh: 'memo',
            items: [
              'Dear Hollie,',
              'Thank you for your quote of $860 for three nights.',
              'Unfortunately, this is slightly above our budget.',
              'Would you consider $720, provided that we pay the full amount upfront?',
              'Kind regards,',
              'Lam Nguyen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Chốt kế hoạch: ai làm gì, trả bao nhiêu, khi nào',
        caption: 'Chốt bằng chữ để không ai "tưởng là". Con số, hạn, người phụ trách: mỗi thứ một dòng.',
        cols: [
          {
            title: 'Thân mật (nhóm chat)',
            anh: 'check-mark-button',
            items: [
              "It's booked! 🎉 Leura cabin, Fri 2 – Mon 5 Oct, late check-out at 12.",
              '$720 total = $180 each. Please send me your share by Wednesday.',
              'Callie drives 🚗 (thank you!!), Ruairí navigates, Kai does the shopping list.',
              'Leaving Fri at 5:30 pm from the house.',
            ],
          },
          {
            title: 'Trang trọng (email xác nhận)',
            anh: 'e-mail',
            items: [
              'Dear Hollie,',
              'Thank you for your help on the phone today.',
              'I am pleased to confirm the one-bedroom cabin from Friday 2 to Monday 5 October for $720, with no cleaning fee and a late check-out at 12 pm.',
              'Could you please send the payment details?',
              'Kind regards,',
              'Lam Nguyen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Từ chối một đề xuất, đưa phương án khác',
        caption: 'Ghi nhận trước ("Love the idea"), lý do ngắn, rồi đưa phương án bằng What if / Would you consider.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thinking-face',
            items: [
              'Love the beach house idea, Callie! 😍',
              "But $225 each is a bit much for us interns right now.",
              "What if we saved it for December? I'll help you plan it.",
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'envelope',
            items: [
              'Dear Hollie,',
              'Thank you for checking. Unfortunately, three nights is more than we can manage this time.',
              'Would you consider a two-night stay if a cancellation comes up?',
              'Kind regards,',
              'Lam Nguyen',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Ghi nhớ về ngày và giá trong bài mẫu',
        items: [
          'Ngày trong mẫu là **thứ Sáu 2 – thứ Hai 5 tháng 10 năm 2026**: kỳ nghỉ Labour Day ở bang New South Wales rơi vào thứ Hai đầu tháng 10.',
          'Giá cabin, phí dọn, phí thuê xe trong cả bài là **giá giả định** để luyện câu. Khi đặt thật, luôn đọc trang của chính nơi đó.',
          'Viết giá trong tin nhắn: **$180 each** · **$720 total / all in**. Ở Úc, "$" là đô Úc; viết cho người ở nước khác thì ghi **AUD 720** cho rõ.',
        ],
      },

      { t: 'h', text: '2. Khung câu để viết tin thuyết phục' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'What if we + V2 …? / How about + V-ing …?',
            vi: 'Câu mở đề xuất trong tin nhắn nhóm.',
            examples: [
              { en: 'What if we did the Blue Mountains instead?', vi: 'Hay là mình đi Blue Mountains?' },
              { en: 'How about leaving on Friday after work?', vi: 'Hay là đi tối thứ Sáu sau giờ làm?' },
              { en: 'What if we split the petrol four ways?', vi: 'Hay là tiền xăng chia bốn?' },
            ],
          },
          {
            formula: "If we + V2, it'd be / we could + V …",
            vi: 'Lý do có con số: cho người đọc thấy kết quả.',
            examples: [
              { en: "If we cooked ourselves, it'd be around $180 each.", vi: 'Nếu tự nấu thì khoảng 180 đô mỗi người.' },
              { en: "If we left at 5:30, we'd miss the traffic.", vi: 'Nếu đi lúc 5 rưỡi thì tránh được kẹt xe.' },
              { en: 'If Callie drove, we could skip the young driver fee.', vi: 'Nếu Callie lái thì không mất phí tài xế trẻ.' },
            ],
          },
          {
            formula: 'Would you consider + N / V-ing …, provided that …?',
            vi: 'Đề nghị giá khác trong email (trang trọng).',
            examples: [
              { en: 'Would you consider $720 for three nights?', vi: 'Chị có cân nhắc mức 720 đô cho ba đêm không?' },
              { en: 'Would you consider waiving the cleaning fee?', vi: 'Chị có cân nhắc bỏ phí dọn không?' },
              { en: 'Would you consider a lower rate, provided that we pay upfront?', vi: 'Chị có cân nhắc giá thấp hơn nếu bọn tôi trả trước không?' },
            ],
          },
          {
            formula: '… by + giờ / ngày (+ and I\'ll …)',
            vi: 'Câu chốt có hạn: không có hạn thì không ai trả lời.',
            examples: [
              { en: "Thumbs up or down by 9 tonight and I'll book it.", vi: 'Thả 👍 hoặc 👎 trước 9 giờ tối nay, mình sẽ đặt.' },
              { en: 'Please send me your share by Wednesday.', vi: 'Gửi mình phần tiền của mọi người trước thứ Tư nhé.' },
              { en: 'Could you let me know by Thursday?', vi: 'Chị báo giúp tôi trước thứ Năm được không?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Đề xuất (What if…?) + lý do có số (If we…, it\'d…) + giải toả lo lắng + câu hỏi chốt + hạn (by…)',
        vi: 'Một tin nhắn chỉ một đề xuất. Người đọc phải trả lời được bằng một chữ hoặc một emoji.',
      },
      {
        t: 'table',
        head: ['Viết gì', 'Nên', 'Tránh', 'Vì sao'],
        rows: [
          ['Số phương án', 'Một đề xuất (hoặc A / B)', 'Năm lựa chọn cùng lúc', 'Nhiều lựa chọn quá thì không ai chọn.'],
          ['Lý do', '$180 each · save $50 on food', "It's cheap · It'll be fun", 'Con số thuyết phục hơn tính từ.'],
          ['Câu hỏi chốt', '👍 or 👎? · A or B?', 'Thoughts?', '"Thoughts?" mở ra bàn luận mãi không xong.'],
          ['Hạn', 'by 9 tonight · by Wednesday', 'whenever · asap', 'Không có hạn thì không ai thấy cần trả lời.'],
          ['Tiền', '$720 total = $180 each', '~700ish', 'Tiền mà mơ hồ là mầm cãi nhau.'],
          ['Email trang trọng', 'Would you consider…? · provided that…', '!!! · pls · cheaper pls', 'Trang trọng mà vẫn mặc cả được, chỉ cần lịch sự.'],
        ],
        caption: 'Nhóm chat có tính năng **bình chọn (poll)** thì dùng luôn: một câu hỏi, hai lựa chọn, có hạn.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd22-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Hay là mình ở cabin thay vì cắm trại?', chips: ['What', 'if', 'we', 'stayed', 'in', 'a', 'cabin', 'instead', 'of', 'camping?', 'stay', 'about'], answer: ['What', 'if', 'we', 'stayed', 'in', 'a', 'cabin', 'instead', 'of', 'camping?'] },
          { vi: 'Nếu tự nấu thì khoảng 180 đô mỗi người.', chips: ['If', 'we', 'cooked', 'ourselves,', "it'd", 'be', 'around', '$180', 'each.', 'cook', 'will'], answer: ['If', 'we', 'cooked', 'ourselves,', "it'd", 'be', 'around', '$180', 'each.'] },
          { vi: 'Thả 👍 hoặc 👎 trước 9 giờ tối nay nhé.', chips: ['Thumbs', 'up', 'or', 'down', 'by', '9', 'tonight.', 'until', 'at'], answer: ['Thumbs', 'up', 'or', 'down', 'by', '9', 'tonight.'] },
          { vi: '(Email) Chị có cân nhắc mức 720 đô cho ba đêm không?', chips: ['Would', 'you', 'consider', '$720', 'for', 'three', 'nights?', 'considering', 'will'], answer: ['Would', 'you', 'consider', '$720', 'for', 'three', 'nights?'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd22-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: "What if… · If we + V2, it'd… · as long as · provided that · by + hạn",
        items: [
          { q: '___ if we left on Friday after work?', answers: ['What'] },
          { q: "If we ___ ourselves, it'd be much cheaper. (cook)", answers: ['cooked'] },
          { q: 'Please send me your share ___ Wednesday. (trước hạn)', answers: ['by'] },
          { q: "I'm happy to drive, as ___ as someone else navigates.", answers: ['long'] },
          { q: 'Would you ___ waiving the cleaning fee? (cân nhắc)', answers: ['consider'] },
          { q: 'We would be happy to book, ___ that we can check out at 12. (trang trọng = as long as)', answers: ['provided', 'providing'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd22-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "What if we…? · If we…, it'd / we could… · by + hạn · Would you consider…?",
        items: [
          { q: '(Nhóm chat) Hay là mình đi thứ Bảy thay vì thứ Sáu?', hint: 'what if, instead of', answers: ['What if we went on Saturday instead of Friday?', 'What if we go on Saturday instead of Friday?', 'What if we left on Saturday instead of Friday?', 'How about going on Saturday instead of Friday?', 'How about we go on Saturday instead of Friday?', 'What if we leave on Saturday instead of Friday?'] },
          { q: 'Nếu mình chia tiền xăng, mỗi người chỉ khoảng 30 đô.', hint: "if we split, it'd only be", answers: ["If we split the petrol, it'd only be about $30 each.", 'If we split the petrol, it would only be about $30 each.', "If we split the petrol, it'd only be around $30 each.", "If we split the petrol, it'd be only about $30 each.", "If we split the petrol, it'd only be about 30 dollars each.", "If we split the gas, it'd only be about $30 each."] },
          { q: 'Gửi mình phần tiền của mọi người trước thứ Tư nhé.', hint: 'please send me, your share, by', answers: ['Please send me your share by Wednesday.', 'Please send me your share by Wednesday!', 'Send me your share by Wednesday, please.', 'Can you send me your share by Wednesday?', 'Could you send me your share by Wednesday?', 'Please send your share to me by Wednesday.'] },
          { q: '(Email) Rất tiếc, mức này hơi vượt ngân sách của chúng tôi.', hint: 'unfortunately, slightly above our budget', answers: ['Unfortunately, this is slightly above our budget.', 'Unfortunately, this is a little above our budget.', 'Unfortunately, this is slightly over our budget.', 'Unfortunately, that is slightly above our budget.', 'Unfortunately, this is a bit above our budget.'] },
          { q: '(Email) Chị có cân nhắc bỏ phí dọn nếu chúng tôi trả trước không?', hint: 'would you consider, waiving, if / provided that, pay upfront', answers: ['Would you consider waiving the cleaning fee if we paid upfront?', 'Would you consider waiving the cleaning fee if we pay upfront?', 'Would you consider waiving the cleaning fee, provided that we pay upfront?', 'Would you consider waiving the cleaning fee provided that we pay upfront?', 'Would you consider waiving the cleaning fee if we paid in advance?', 'Would you consider waiving the cleaning fee if we pay in advance?'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Đọc như người đang phản đối**: tin của bạn đã trả lời nỗi lo của họ chưa (tiền, thời gian, ai lái xe)?',
          '**Con số có khớp không?** $720 chia 4 = $180. Một phép tính sai là mất uy tín cả tin.',
          '**Có câu hỏi chốt và hạn chưa?** Thiếu "by 9 tonight" thì tin nhắn sẽ chìm.',
          '**Email cho người bán**: có "Dear…", có ngày cụ thể, có con số đề nghị, không có "!!!". Mặc cả bằng thư vẫn phải lịch sự như nói chuyện trực tiếp.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd22-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 22',
    goal: 'Làm 34 câu có đáp án để dùng thành thạo điều kiện loại 2, What if / How about, mặc cả lịch sự, nhượng bộ có điều kiện, và ôn lại Ngày 17–21.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền dạng động từ · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 17** (điều kiện loại 1), **Ngày 19** (used to), **Ngày 21** (I was told…, should have).',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**, giữ âm /d/ của \'d.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 23 (kể lại tin thời sự và bình luận).',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd22-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn muốn hỏi chủ nhà nghỉ có bớt giá không, thật lịch sự:',
            options: ['Cheaper, please!', 'Can you discount for me?', 'Is there any flexibility on the price?', 'Give me a better price.'],
            correct: 2,
            why: '**Is there any flexibility on the price?** là câu mặc cả lịch sự nhất. B sai ngữ pháp (discount ở đây là danh từ: give us **a discount**).',
          },
          {
            q: 'Câu nào đúng?',
            options: ["If we leave on Saturday, we'd only need two nights.", "If we left on Saturday, we'd only need two nights.", "If we would leave on Saturday, we only need two nights.", "If we left on Saturday, we only need two nights."],
            correct: 1,
            why: 'Điều kiện loại 2: **If + V2, would (\'d) + V**. Không trộn hiện tại với would; không đặt would trong mệnh đề If.',
          },
          {
            q: 'Câu nào đúng?',
            options: ['How about go camping?', 'How about going camping?', 'How about to go camping?', 'How about we going camping?'],
            correct: 1,
            why: '**How about + V-ing** (How about going…) hoặc **How about we + V** (How about we go…).',
          },
          {
            q: 'Người bán nói: "The best I can do is seven-twenty." Nghĩa là:',
            options: ['Giá 7 đô 20 xu', 'Giá 720, gần như là giá cuối', 'Giá 7.020', 'Mở cửa lúc 7 giờ 20'],
            correct: 1,
            why: '**seven-twenty** = 720 (đọc gộp). **The best I can do** = gần như giá cuối, còn thêm được thì chỉ là thứ nhỏ như quà kèm.',
          },
          {
            q: 'Bạn muốn đồng ý nhưng gắn điều kiện: phải trả xe trước 10 giờ thứ Hai.',
            options: ["Okay, as long as it's back by ten on Monday.", "Okay, as long as it will be back by ten on Monday.", 'Okay, so long it back by ten Monday.', 'Okay, if only it back at ten.'],
            correct: 0,
            why: 'Sau **as long as** dùng hiện tại đơn, kể cả khi nói về tương lai: as long as it**\'s** back by ten.',
          },
          {
            q: 'Người bán: "I can hold it until five." Bạn chưa chắc nhóm có đồng ý không. Câu nào tốt nhất?',
            options: ["OK OK, I'll take it now!", "Understood. I'll call you back before five either way.", "I'll think about it.", 'Why only five?'],
            correct: 1,
            why: 'Nhận hạn và hứa gọi lại **dù có hay không** (either way). Câu C dễ bị hiểu là từ chối khéo.',
          },
          {
            q: 'Bạn muốn khuyên Ruairí lấy cabin nhỏ:',
            options: ["If I am you, I will take the small cabin.", "If I were you, I'd take the small cabin.", "If I was you, I take the small cabin.", "If I would be you, I'd take the small cabin."],
            correct: 1,
            why: 'Khung cố định để khuyên: **If I were you, I\'d + V**.',
          },
          {
            q: '(Ôn Ngày 21) Phòng không như mô tả. Bạn nói với lễ tân:',
            options: ["I was said the room was quiet.", "I was told that the room was quiet.", 'They told the room is quiet.', 'I told that the room was quiet.'],
            correct: 1,
            why: '**I was told (that)…** — tường thuật đơn giản, lùi thì is → was.',
          },
          {
            q: '(Ôn Ngày 17) Kế hoạch thật, khả năng cao: "Nếu trời mưa thứ Bảy, mình sẽ ở trong nhà chơi bài."',
            options: ["If it rains on Saturday, we'll stay in and play cards.", "If it rained on Saturday, we'll stay in.", "If it will rain on Saturday, we stay in.", "If it rain on Saturday, we would stay."],
            correct: 0,
            why: 'Điều kiện loại 1 (Ngày 17) cho kế hoạch thật: **If + hiện tại đơn, will + V**. So với loại 2 hôm nay: If it **rained**, we**\'d**… (giả định để thuyết phục).',
          },
          {
            q: '(Ôn Ngày 19) "Trước đây mình hay đi cắm trại, giờ thì không." Câu nào đúng?',
            options: ['I used to go camping, but I don\'t now.', 'I use to going camping.', 'I was used to go camping.', 'I usually go camping before.'],
            correct: 0,
            why: '**used to + V** = thói quen trong quá khứ, giờ không còn.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền dạng đúng của động từ' },
      {
        t: 'quiz',
        id: 'gtd22-bt-dien',
        title: 'Phần II — Điền một từ (7 câu)',
        kind: 'fill',
        grammar: "If + V2, would / could + V · If I were you · How about + V-ing · as long as + hiện tại đơn",
        items: [
          { q: "If we ___ the smaller cabin, we'd save $80. (take)", answers: ['took'] },
          { q: 'If it rained, we ___ be stuck in a wet tent.', answers: ['would', "'d", 'd'] },
          { q: 'If I ___ you, I\'d ask for a late check-out. (be)', answers: ['were'] },
          { q: 'How about ___ on Saturday morning? (leave)', answers: ['leaving'] },
          { q: 'What if Callie ___ the main driver? (be — giả định)', answers: ['were', 'was'] },
          { q: "I'll drive, as long as someone ___ me the way. (show)", answers: ['shows'] },
          { q: 'If we paid upfront, ___ you do seven hundred? (could / will)', answers: ['could'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd22-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "What if…? · How about…? · If + V2, would… · as long as · on one condition",
        items: [
          { q: 'Hay là mình ở cabin thay vì ở lều?', hint: 'what if, instead of a tent', answers: ['What if we stayed in a cabin instead of a tent?', 'What if we stay in a cabin instead of a tent?', 'How about staying in a cabin instead of a tent?', 'How about we stay in a cabin instead of a tent?', 'What if we stayed in a cabin instead of a tent', "Why don't we stay in a cabin instead of a tent?"] },
          { q: 'Hơi quá mức bọn tôi định chi.', hint: 'a bit more than, hoping to spend', answers: ["That's a bit more than we were hoping to spend.", 'That is a bit more than we were hoping to spend.', "It's a bit more than we were hoping to spend.", "That's a little more than we were hoping to spend.", "That's a bit more than we wanted to spend."] },
          { q: 'Anh bớt được tối đa bao nhiêu?', hint: 'the best you can do', answers: ["What's the best you can do?", 'What is the best you can do?', "What's the best price you can do?", "What's the best you can do on the price?"] },
          { q: 'Nếu bọn tôi trả trước, chị lấy bảy trăm được không?', hint: 'if we paid upfront, could you do', answers: ['If we paid upfront, could you do seven hundred?', 'If we paid upfront, could you do $700?', 'If we paid upfront, could you do 700?', 'If we paid in advance, could you do seven hundred?', 'If we paid upfront, would you do seven hundred?', 'If we paid upfront, could you do it for seven hundred?', 'If we paid upfront, could you do it for $700?'] },
          { q: 'Được, với một điều kiện: không ai được chê cách mình lái.', hint: 'on one condition, comments on my driving', answers: ['Okay, on one condition: nobody comments on my driving.', 'OK, on one condition: nobody comments on my driving.', 'Okay, on one condition: no one comments on my driving.', 'Fine, on one condition: nobody comments on my driving.', 'Okay, on one condition, nobody comments on my driving.'] },
          { q: 'Tôi chỉ cần hỏi các bạn cùng nhà trước.', hint: 'run it by, housemates', answers: ['I just need to run it by my housemates first.', 'I just need to run it by my housemates.', 'I need to run it by my housemates first.', 'I just need to check with my housemates first.', 'I just have to run it by my housemates first.'] },
          { q: 'Bọn tôi có bốn người.', hint: 'there are … of us', answers: ['There are four of us.', "There're four of us.", 'There are 4 of us.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd22-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Can I throw in another idea?', answer: 'Can I throw in another idea?' },
          { label: 'Câu 2', spell: "Think about it this way: it'd save us fifty each.", answer: "Think about it this way: it'd save us fifty each.", alt: ["Think about it this way, it'd save us fifty each.", 'Think about it this way: it would save us fifty each.', "Think about it this way: it'd save us 50 each."] },
          { label: 'Câu 3', spell: 'Is there any flexibility on the minimum stay?', answer: 'Is there any flexibility on the minimum stay?' },
          { label: 'Câu 4', spell: "I can't go that low, sorry.", answer: "I can't go that low, sorry.", alt: ['I cannot go that low, sorry.', "I can't go that low sorry"] },
          { label: 'Câu 5', spell: 'You drive a hard bargain.', answer: 'You drive a hard bargain.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd22-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Nếu Callie lái thì mình tiết kiệm được tám mươi đô.', chips: ['If', 'Callie', 'drove,', 'we', 'could', 'save', 'eighty', 'dollars.', 'drives', 'will'], answer: ['If', 'Callie', 'drove,', 'we', 'could', 'save', 'eighty', 'dollars.'] },
          { vi: 'Nếu lấy xe to hơn, anh có để cùng giá được không?', chips: ['If', 'we', 'took', 'something', 'bigger,', 'would', 'you', 'keep', 'the', 'same', 'price?', 'take', 'will'], answer: ['If', 'we', 'took', 'something', 'bigger,', 'would', 'you', 'keep', 'the', 'same', 'price?'] },
          { vi: 'Tôi cho thêm trả phòng muộn ngày thứ Hai.', chips: ["I'll", 'throw', 'in', 'a', 'late', 'check-out', 'on', 'Monday.', 'out', 'at'], answer: ["I'll", 'throw', 'in', 'a', 'late', 'check-out', 'on', 'Monday.'] },
          { vi: 'Mình chia đôi khoảng chênh ở bảy trăm rưỡi nhé?', chips: ['Shall', 'we', 'split', 'the', 'difference', 'at', 'seven-fifty?', 'divide', 'in'], answer: ['Shall', 'we', 'split', 'the', 'difference', 'at', 'seven-fifty?'] },
          { vi: '(Ôn Ngày 21) Lẽ ra mình phải đọc kỹ điều khoản.', chips: ['I', 'should', 'have', 'read', 'the', 'terms', 'carefully.', 'had', 'reading'], answer: ['I', 'should', 'have', 'read', 'the', 'terms', 'carefully.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Nói to bài thuyết phục 5 bước về **chuyện thật của bạn** (đã viết ở bài Nói), ghi âm. Nghe lại: có ít nhất **2 câu If loại 2** chưa, âm /d/ của **we\'d / it\'d** có nghe ra không.',
          'Gửi thật một tin nhắn đề xuất cho nhóm bạn (tiếng Việt cũng được) theo khung: một đề xuất · lý do có số · câu hỏi chốt · hạn. Xem nhóm trả lời nhanh hơn không.',
          'Ngày 23: kể lại tin thời sự và bình luận — **He said that…**, **apparently**, **it seems**.',
        ],
      },
    ],
  },
];
