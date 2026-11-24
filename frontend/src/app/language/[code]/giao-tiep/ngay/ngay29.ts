/**
 * Tiếng Anh giao tiếp — NGÀY 29 (chặng 5 "Tự nhiên", B2): tình huống khó — bị ngắt lời, hiểu lầm, khẩn cấp.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd29-`.
 * Ngữ pháp trong câu: câu chẻ để làm rõ (What I meant was… · What I'm saying is… · What you need is… · All I'm asking is…
 * · The thing is, …) + giữ lượt nói (Sorry, can I just finish?). Nối câu: I mean · in other words · to put it another way.
 * Cảnh: Loan — sinh viên IT năm 3, OJT ở Brackenfield (công ty phần mềm có trụ sở ở Manchester) — một tuần công tác ở Anh:
 * họp lên kế hoạch "Charity Week", bị Dermot (Ireland) cắt lời và hiểu sai chữ "for free", gỡ hiểu lầm "table it" giữa Gwen
 * (Anh) và Tobias (Mỹ); mất ví có hộ chiếu ở quán cà phê, gọi 101 (số cảnh sát KHÔNG khẩn cấp của Anh); thấy một cụ ông ngã
 * đập đầu trên phố, Archie (Úc) hô "triple-zero", Loan gọi 999 và làm theo tổng đài viên.
 * Số khẩn cấp đã kiểm: Anh 999 / 112 (101 cảnh sát không khẩn cấp, 111 NHS tư vấn y tế) · Mỹ, Canada 911 · Úc 000 (112 gọi
 * được từ di động) · New Zealand 111 · EU 112 (Ireland 112 / 999) · Nhật 110 cảnh sát, 119 cứu hoả + cấp cứu ·
 * Hàn 112 cảnh sát, 119 cứu hoả + cấp cứu · Singapore 999 cảnh sát, 995 cứu thương + cứu hoả · Việt Nam 113 / 114 / 115, 112 cứu nạn.
 * Số điện thoại trong bài dùng dải 07700 900xxx mà Ofcom (Anh) dành riêng cho phim, sách — không phải số thật.
 * Khác podcast en-ds-b1-03 (My Bag Didn't Arrive: thất lạc vali ở sân bay) và en-a2-01 (Lost in a New City: hỏi đường).
 * Khác Ngày 7 (sức khoẻ: tả triệu chứng, nhà thuốc; có một dòng số cấp cứu) và Ngày 17 (cắt lời trong video call để nhắc tắt mic).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ, biển báo đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_29: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd29-nghe',
    kind: 'listening',
    title: 'Tình huống khó: bị ngắt lời, hiểu lầm, khẩn cấp',
    goal: 'Nghe hiểu ba cảnh khó ở Manchester: một cuộc họp bị cắt lời và hiểu lầm hai lần, một cuộc gọi báo mất hộ chiếu, một cuộc gọi 999 khi có người bị ngã; nhận ra câu giữ lượt, câu gỡ hiểu lầm và từng câu hỏi của tổng đài viên.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay: khi mọi thứ không suôn sẻ',
        items: [
          'Hai mươi tám ngày qua, phần lớn các cảnh đều **suôn sẻ**. Đời thật thì không: người ta **cắt lời** bạn, **hiểu sai** câu bạn nói, và đôi khi có chuyện **khẩn cấp** thật.',
          'Bạn theo **Loan**, sinh viên IT năm 3 đang OJT ở **Brackenfield**. Tuần này Loan sang **trụ sở Manchester (Anh)** một tuần. Đồng nghiệp: **Gwen** (Anh), **Dermot** (Ireland), **Tobias** (văn phòng Boston, Mỹ).',
          'Ba cảnh: cuộc họp có người **cắt lời** và hai lần **hiểu lầm** · mất ví có **hộ chiếu**, gọi số **101** · một cụ ông **ngã đập đầu** trên phố, gọi **999**.',
          'Tốc độ khoảng **180 từ/phút**, câu dễ không dịch. Cuộc gọi khẩn cấp thì nghe **thứ tự câu hỏi**: hầu như nước nào cũng hỏi gần giống nhau.',
          'Ngày 7 bạn đã có một dòng về số cấp cứu. Hôm nay đi hết: **số từng nước**, cách nói địa chỉ khi không biết số nhà, và câu nào nói trước.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Thứ Hai: cuộc họp "Charity Week"' },
      {
        t: 'canh',
        anh: ['office-building', 'woman-office-worker', 'man-office-worker', 'woman-technologist', 'raised-hand', 'red-question-mark'],
        caption: 'Thứ Hai, 10 giờ sáng, phòng họp tầng 4 ở Manchester. **Gwen** (trưởng nhóm, người Anh) chủ trì buổi họp lên kế hoạch cho **Charity Week**: tuần gây quỹ từ thiện của công ty. **Dermot** (Ireland) nói nhiều và hay chen ngang. **Tobias** (Mỹ) đang sang công tác. **Loan** có một ý tưởng.',
      },
      {
        t: 'listen',
        id: 'gtd29-nghe-canh1',
        title: 'Scene 1 — Charity Week planning',
        note: 'Nghe xem: Dermot hiểu sai chữ nào của Loan; Loan giữ lượt và nói lại thế nào; "table it" làm Gwen và Tobias hiểu ngược nhau ra sao; ai phát hiện ra.',
        lines: [
          { who: 'Gwen', voice: 'uk-nu', text: "Right, let's crack on. Item one: Charity Week. We've got a stall in the lobby on Friday. Loan, you said you had an idea?", vi: 'Rồi, bắt đầu nhé. Mục một: Charity Week. Mình có một quầy ở sảnh vào thứ Sáu. Loan, em bảo em có ý tưởng?' },
          { who: 'Loan', voice: 'us-nu', text: 'Yes. I was thinking we could run a Vietnamese food stall. Bánh mì, spring rolls, iced coffee… and everyone could eat for free, because—', vi: 'Vâng. Em nghĩ mình có thể làm một quầy đồ ăn Việt. Bánh mì, nem, cà phê đá… và mọi người được ăn miễn phí, vì—' },
          { who: 'Dermot', voice: 'ie-nam', text: "Hang on, for free? Isn't the whole point to raise money?", vi: 'Khoan, miễn phí á? Mục đích chẳng phải là gây quỹ sao?' },
          { who: 'Loan', voice: 'us-nu', text: 'Yes, but—' },
          { who: 'Dermot', voice: 'ie-nam', text: "Because last year the cake stall made over four hundred quid, and if we're just giving food away—", vi: 'Vì năm ngoái quầy bánh ngọt thu được hơn bốn trăm bảng, mà giờ mình lại phát không đồ ăn—' },
          { who: 'Loan', voice: 'us-nu', text: "Sorry, Dermot, can I just finish? What I meant was that the ingredients would be free. My aunt runs an Asian supermarket here in Manchester, and she's offered to donate everything. People would still pay, so every pound goes to the charity.", vi: 'Xin lỗi anh Dermot, cho em nói hết đã ạ? Ý em là nguyên liệu sẽ miễn phí. Dì em có một siêu thị đồ châu Á ở Manchester, và dì nhận tặng hết. Mọi người vẫn trả tiền, nên từng đồng bảng đều vào quỹ từ thiện.' },
          { who: 'Dermot', voice: 'ie-nam', text: "Oh! Right. Sorry, I jumped the gun there. That's actually brilliant.", vi: 'Ồ! Thế à. Xin lỗi, tôi vội kết luận quá. Thế thì hay thật.' },
          { who: 'Gwen', voice: 'uk-nu', text: "It is. Tobias, you've gone quiet. Thoughts?" },
          { who: 'Tobias', voice: 'us-nam', text: 'Love it. The decorations budget is a bigger question, though. Can we table that until next week?', vi: 'Thích lắm. Nhưng ngân sách trang trí mới là chuyện lớn. Mình "table" chuyện đó tới tuần sau được không?' },
          { who: 'Gwen', voice: 'uk-nu', text: "Sure, let's table it. So, decorations. What are we thinking? Balloons? Lanterns?", vi: 'Được, đưa ra bàn luôn. Vậy trang trí: mọi người nghĩ sao? Bóng bay? Đèn lồng?' },
          { who: 'Tobias', voice: 'us-nam', text: 'Uh… no, I meant…' },
          { who: 'Loan', voice: 'us-nu', text: "Sorry, just to check, Tobias. When you say 'table it', do you mean talk about it now, or leave it for later?", vi: 'Xin lỗi, em hỏi lại chút, anh Tobias. Khi anh nói "table it", ý anh là bàn ngay bây giờ, hay để sau?' },
          { who: 'Tobias', voice: 'us-nam', text: "Later. Next week. Isn't that what it means here?" },
          { who: 'Gwen', voice: 'uk-nu', text: "Ha! Over here it means the opposite. Put it on the table, discuss it now. Good catch, Loan.", vi: 'Ha! Ở bên này nó nghĩa ngược lại. Đặt lên bàn, bàn ngay. Bắt bài hay lắm, Loan.' },
          { who: 'Dermot', voice: 'ie-nam', text: 'Two countries divided by a common language.', vi: 'Hai nước bị chia cắt bởi chính một ngôn ngữ chung.' },
          { who: 'Gwen', voice: 'uk-nu', text: 'Okay. Decorations next week, for real. Loan, could you send round a list of what your aunt can donate?' },
          { who: 'Loan', voice: 'us-nu', text: "Will do. And Dermot, you're in charge of the queue. You're very good at jumping in.", vi: 'Em làm ngay. Còn anh Dermot phụ trách xếp hàng nhé. Anh chen vào giỏi lắm mà.' },
          { who: 'Dermot', voice: 'ie-nam', text: 'Fair enough. I deserved that.', vi: 'Công bằng. Tôi đáng bị thế.' },
        ],
      },
      {
        t: 'note',
        title: 'Về giọng đọc trong cảnh này',
        items: [
          '**Dermot** nói giọng **Ireland**: âm "th" thường nghe gần như /t/ hoặc /d/ (**three** nghe như "tree"), âm /r/ cuối từ vẫn đọc (giống Mỹ, khác Anh), giọng lên xuống như hát. Từ hay gặp: **quid** (bảng Anh, thân mật), **grand** (ổn, tốt), **craic** /kræk/ (vui, chuyện vui).',
          '**Gwen** dùng nhiều cụm rất Anh: **Let\'s crack on** (bắt đầu / làm tiếp nhé), **Good catch** (bắt được lỗi hay đấy), **for real** (lần này thật).',
          'Cụm "**Two countries divided by a common language**" là câu đùa quen thuộc về Anh và Mỹ (thường gán cho nhà văn Bernard Shaw, không có văn bản gốc chắc chắn). Người ta nói nó mỗi khi hai bên hiểu một từ tiếng Anh theo hai nghĩa.',
        ],
      },
      {
        t: 'mcq',
        id: 'gtd29-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Dermot chen ngang khi Loan nói "everyone could eat for free"?',
            options: ['Dermot không thích đồ ăn Việt', 'Dermot tưởng quầy sẽ phát đồ ăn không thu tiền, ngược mục đích gây quỹ', 'Dermot muốn bán bánh ngọt như năm ngoái', 'Dermot không nghe rõ'],
            correct: 1,
            why: '"Isn\'t the whole point to **raise money**?" Dermot nghe "for free" thành "người ăn không phải trả tiền". Loan chưa kịp nói hết vế "because…" thì đã bị cắt.',
          },
          {
            q: 'Loan làm gì để lấy lại lượt nói và gỡ hiểu lầm?',
            options: ['Nói to hơn Dermot', 'Im lặng chờ Gwen can thiệp', 'Xin nói hết ("can I just finish?") rồi dùng câu chẻ "What I meant was that…" để nói rõ ý', 'Xin lỗi vì đã nói sai'],
            correct: 2,
            why: 'Hai bước: **Sorry, Dermot, can I just finish?** (giữ lượt, lịch sự nhưng chắc) → **What I meant was that the ingredients would be free** (nói lại đúng chỗ bị hiểu sai). Loan không xin lỗi vì mình không sai, chỉ bị hiểu chưa hết.',
          },
          {
            q: '"Can we table that until next week?" Tobias (Mỹ) muốn gì, và Gwen (Anh) hiểu thành gì?',
            options: ['Tobias muốn bàn ngay; Gwen hiểu là để sau', 'Tobias muốn để tuần sau mới bàn; Gwen hiểu là đưa ra bàn luôn', 'Cả hai đều muốn bàn ngay', 'Tobias muốn mua bàn mới cho quầy'],
            correct: 1,
            why: 'Đây là một cặp từ **ngược nghĩa thật** giữa hai bờ Đại Tây Dương: **table it** ở Mỹ = **hoãn lại**; ở Anh = **đưa ra bàn bạc**. Chữ "until next week" lẽ ra là manh mối, nhưng Gwen đã quen nghĩa Anh.',
          },
          {
            q: 'Cuối cảnh, Loan nói "You\'re very good at jumping in." Dermot đáp "Fair enough. I deserved that." Chuyện gì đang xảy ra?',
            options: ['Loan khen thật Dermot giỏi tổ chức', 'Loan trêu nhẹ việc Dermot hay chen ngang; Dermot nhận trêu vui vẻ', 'Loan giận Dermot', 'Dermot xin nghỉ không làm quầy'],
            correct: 1,
            why: 'Một câu **trêu nhẹ** (banter) nhắc lại chuyện vừa xảy ra. **Fair enough. I deserved that.** = "Công bằng, tôi đáng bị thế". Khi đã thân, đùa nhẹ kiểu này giúp chuyện cắt lời trôi qua không ai ngượng.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Thứ Ba: mất ví có hộ chiếu' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'purse', 'passport-control', 'worried-face', 'telephone-receiver', 'police-officer'],
        caption: 'Thứ Ba, 10 giờ 30. Đến văn phòng, **Loan** phát hiện **ví** (trong có **hộ chiếu**, thẻ ngân hàng và ít tiền mặt) không còn trong túi. Cô quay lại quán cà phê gần ga lúc sáng. **Isla** (người New Zealand, đang làm ở quán theo visa working holiday) giúp cô.',
      },
      {
        t: 'listen',
        id: 'gtd29-nghe-canh2',
        title: 'Scene 2 — The missing wallet',
        note: 'Nghe xem: Isla khuyên gọi số nào và vì sao không gọi 999; tổng đài viên hỏi những gì; số tham chiếu là gì; cuối cùng chiếc ví ở đâu.',
        lines: [
          { who: 'Loan', voice: 'us-nu', text: "Excuse me, sorry to bother you. I think I might have left something here this morning. A small black wallet? My passport's in it.", vi: 'Xin lỗi đã làm phiền. Hình như sáng nay tôi để quên đồ ở đây. Một cái ví nhỏ màu đen? Hộ chiếu của tôi ở trong đó.' },
          { who: 'Isla', voice: 'nz-nu', text: 'Oh no. Where were you sitting?' },
          { who: 'Loan', voice: 'us-nu', text: "By the window, around eight thirty. I paid with my phone, so I didn't notice until I got to work.", vi: 'Cạnh cửa sổ, khoảng tám rưỡi. Tôi trả bằng điện thoại nên tới chỗ làm mới để ý.' },
          { who: 'Isla', voice: 'nz-nu', text: "Let me check behind the counter… Sorry, nothing's been handed in. Have you tried lost property at the station?", vi: 'Để tôi xem sau quầy… Tiếc quá, chưa ai mang nộp gì. Bạn hỏi phòng đồ thất lạc ở ga chưa?' },
          { who: 'Loan', voice: 'us-nu', text: "I've just come from there. Nothing yet. Should I call 999?" },
          { who: 'Isla', voice: 'nz-nu', text: "Only if someone's in danger or a crime's happening right now. Try 101. It's the police non-emergency number. Losing a passport's awful, but it's not an emergency.", vi: 'Chỉ khi có người gặp nguy hoặc đang có tội phạm xảy ra ngay lúc đó. Thử số 101. Đó là số cảnh sát không khẩn cấp. Mất hộ chiếu thì kinh khủng thật, nhưng không phải chuyện khẩn cấp.' },
          { who: 'Call handler', voice: 'uk-nam', text: 'Police, non-emergency line. How can I help?' },
          { who: 'Loan', voice: 'us-nu', text: "Hi. I'd like to report a missing passport. I'm Vietnamese, and I'm here for work this week.", vi: 'Chào anh. Tôi muốn báo mất hộ chiếu. Tôi là người Việt Nam, tuần này sang đây công tác.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Okay. We don't normally record lost items, but if you think it was stolen, I can log it and give you a reference number. Do you think it was taken?", vi: 'Vâng. Bình thường chúng tôi không ghi nhận đồ đánh rơi, nhưng nếu chị nghĩ nó bị lấy cắp thì tôi có thể ghi lại và cho chị một số tham chiếu. Chị có nghĩ là bị lấy không?' },
          { who: 'Loan', voice: 'us-nu', text: "Honestly, I'm not sure. What I do know is that my bag was open when I got to the office, and the tram was packed.", vi: 'Thật lòng tôi không chắc. Điều tôi biết chắc là lúc tới văn phòng thì túi tôi đang mở, và tàu điện lúc đó chật cứng.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Right, I'll log it as possibly stolen. Can I take your full name, please?" },
          { who: 'Loan', voice: 'us-nu', text: "Nguyễn Hương Loan. The surname's Nguyen, N-G-U-Y-E-N, and the first name's Loan, L-O-A-N.", vi: 'Nguyễn Hương Loan. Họ là Nguyen, N-G-U-Y-E-N, tên là Loan, L-O-A-N.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Thank you. Was there anything else in the wallet? Bank cards?" },
          { who: 'Loan', voice: 'us-nu', text: 'One bank card and about forty pounds in cash. Sorry, could you slow down a little? I\'m writing everything down.', vi: 'Một thẻ ngân hàng và khoảng bốn mươi bảng tiền mặt. Xin lỗi, anh nói chậm lại một chút được không? Tôi đang ghi lại hết.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Of course. Your reference number is M for Mike, four, seven, oh, two, two. Cancel the card today, and contact your embassy about an emergency travel document.", vi: 'Tất nhiên. Số tham chiếu của chị là M như Mike, bốn, bảy, không, hai, hai. Hôm nay chị khoá thẻ đi, và liên hệ đại sứ quán về giấy tờ đi lại khẩn cấp.' },
          { who: 'Loan', voice: 'us-nu', text: 'M, four, seven, zero, two, two. Thank you so much.' },
          { who: 'Isla', voice: 'nz-nu', text: "Wait, Loan? Is this yours? A guy's just brought it in. He said it was on a seat on the tram.", vi: 'Khoan, Loan? Cái này của bạn phải không? Một anh vừa mang vào. Anh ấy bảo nó nằm trên ghế tàu điện.' },
          { who: 'Loan', voice: 'us-nu', text: "Oh my God, yes! Everything's still in it! I'd better ring 101 back and tell them it's turned up.", vi: 'Trời ơi, đúng rồi! Vẫn còn đủ hết! Tôi phải gọi lại 101 báo là tìm thấy rồi.' },
          { who: 'Isla', voice: 'nz-nu', text: 'Sweet as. Quote your reference number. And maybe a bag with a zip next time?', vi: 'Ổn rồi. Nhớ đọc số tham chiếu. Và lần sau dùng túi có khoá kéo nhé?' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd29-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Vì sao Isla khuyên Loan gọi 101 chứ không phải 999?',
            options: ['999 chỉ dành cho người Anh', '999 dành cho lúc có người gặp nguy hoặc tội phạm đang xảy ra; mất hộ chiếu là việc không khẩn cấp', '101 rẻ hơn', '999 không gọi được bằng di động'],
            correct: 1,
            why: '"Only if someone\'s in danger or a crime\'s happening right now." Ở Anh, **101** là số cảnh sát **không khẩn cấp**. Gọi 999 cho việc không khẩn cấp là chiếm đường dây của người đang gặp nguy.',
          },
          {
            q: 'Tổng đài viên nói gì về đồ bị mất?',
            options: ['Cảnh sát sẽ đi tìm ví ngay', 'Thường không ghi nhận đồ đánh rơi; nếu Loan nghĩ bị lấy cắp thì sẽ ghi lại và cho số tham chiếu', 'Loan phải đến đồn cảnh sát', 'Không làm được gì'],
            correct: 1,
            why: '"We don\'t normally record lost items, but if you think it was stolen, I can **log it** and give you a **reference number**." Nhiều nơi ở Anh làm đúng như vậy; số tham chiếu cần khi xin giấy tờ thay thế.',
          },
          {
            q: 'Số tham chiếu của Loan là gì?',
            options: ['N 47022', 'M 47022', 'M 47202', 'M 40722'],
            correct: 1,
            why: '"**M for Mike**, four, seven, **oh**, two, two." Người Anh đọc số 0 là **oh**; Loan nhắc lại bằng **zero**, cả hai đều đúng. Nhắc lại số ngay là thói quen tốt.',
          },
          {
            q: 'Cuối cảnh, chiếc ví ở đâu và Loan định làm gì?',
            options: ['Vẫn mất; Loan đi đại sứ quán', 'Một người nhặt được trên ghế tàu điện và mang đến quán; Loan sẽ gọi lại 101 báo đã tìm thấy', 'Ví nằm trong túi Loan từ đầu', 'Isla giữ ví giúp từ sáng'],
            correct: 1,
            why: '"A guy\'s just brought it in… on a seat on the tram." → "I\'d better ring 101 back and tell them **it\'s turned up**." **turn up** = (đồ mất) xuất hiện lại.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Thứ Tư tối: gọi 999' },
      {
        t: 'canh',
        anh: ['person-walking', 'collision', 'face-with-head-bandage', 'mobile-phone', 'ambulance', 'man-health-worker'],
        caption: 'Thứ Tư, 6 giờ tối, trên phố Oxford Street ở trung tâm Manchester, trời đã tối và đường ướt. Một cụ ông **trượt ở mép vỉa hè**, ngã và **đập đầu**. **Loan** và **Archie** (khách du lịch người Úc đi ngang) chạy tới.',
      },
      {
        t: 'listen',
        id: 'gtd29-nghe-canh3',
        title: 'Scene 3 — A 999 call',
        note: 'Nghe xem: Archie định gọi số nào; tổng đài hỏi những gì, theo thứ tự nào; tổng đài dặn làm gì và không làm gì; Loan giữ lượt thế nào khi Archie chen vào.',
        lines: [
          { who: 'Archie', voice: 'au-nam', text: "Whoa! Mate, are you alright? He's hit his head. Someone call triple-zero!", vi: 'Ối! Bác ơi, bác có sao không? Bác ấy đập đầu rồi. Ai gọi ba số không đi!' },
          { who: 'Loan', voice: 'us-nu', text: "We're in England, it's 999. I'm calling now.", vi: 'Mình đang ở Anh, phải là 999. Mình gọi đây.' },
          { who: 'Operator', voice: 'uk-nu', text: 'Emergency, which service?' },
          { who: 'Loan', voice: 'us-nu', text: 'Ambulance, please.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Ambulance service. What's the address of the emergency?" },
          { who: 'Loan', voice: 'us-nu', text: "We're on Oxford Street in the city centre. I don't know the number. We're outside a pharmacy, across the road from the Palace Theatre.", vi: 'Chúng tôi ở Oxford Street, trung tâm thành phố. Tôi không biết số nhà. Chúng tôi đang ở trước một hiệu thuốc, đối diện nhà hát Palace.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Okay. And what's the number you're calling from?" },
          { who: 'Loan', voice: 'us-nu', text: 'Oh seven seven oh oh, nine oh oh, four six one.' },
          { who: 'Call handler', voice: 'uk-nam', text: 'Thank you. Tell me exactly what happened.' },
          { who: 'Loan', voice: 'us-nu', text: "An older man slipped on the kerb and hit his head on the pavement. He's bleeding from his forehead.", vi: 'Một cụ ông trượt chân ở mép vỉa hè và đập đầu xuống mặt đường. Ông ấy đang chảy máu ở trán.' },
          { who: 'Call handler', voice: 'uk-nam', text: 'Is he awake? Is he breathing?' },
          { who: 'Loan', voice: 'us-nu', text: "He's awake and breathing, but he seems confused. He keeps asking what day it is.", vi: 'Ông ấy tỉnh và vẫn thở, nhưng có vẻ lơ mơ. Ông cứ hỏi hôm nay là thứ mấy.' },
          { who: 'Call handler', voice: 'uk-nam', text: "Right. An ambulance is being arranged. Don't move him unless he's in danger. Press something clean on the cut, keep him warm, and don't give him anything to eat or drink.", vi: 'Được. Xe cứu thương đang được điều. Đừng di chuyển ông ấy trừ khi có nguy hiểm. Ấn một thứ gì sạch lên vết thương, giữ ấm cho ông, và đừng cho ăn uống gì.' },
          { who: 'Archie', voice: 'au-nam', text: "Should we sit him up? He's trying to stand, and—", vi: 'Mình có nên đỡ bác ngồi dậy không? Bác đang cố đứng lên, mà—' },
          { who: 'Loan', voice: 'us-nu', text: "Archie, hang on one sec. Sorry, my friend's asking: should we let him sit up? He's trying to stand.", vi: 'Archie, chờ mình một giây. Xin lỗi, bạn tôi đang hỏi: có nên để ông ấy ngồi dậy không? Ông đang cố đứng lên.' },
          { who: 'Call handler', voice: 'uk-nam', text: "No. Keep him lying still if you can, and keep talking to him. If he gets worse or stops breathing, call us straight back.", vi: 'Không. Cố giữ ông nằm yên nếu được, và tiếp tục nói chuyện với ông. Nếu ông nặng hơn hoặc ngừng thở, gọi lại cho chúng tôi ngay.' },
          { who: 'Loan', voice: 'us-nu', text: "Got it. Don't move him, press on the cut, nothing to eat or drink.", vi: 'Rõ rồi. Không di chuyển, ấn lên vết thương, không ăn uống gì.' },
          { who: 'Clive', voice: 'nz-nam', text: "I'm fine, love. Honestly. I just need to get home.", vi: 'Ông không sao đâu, cháu. Thật đấy. Ông chỉ cần về nhà thôi.' },
          { who: 'Loan', voice: 'us-nu', text: "I know. But what you need right now is to stay still. The ambulance is on its way. What's your name?", vi: 'Cháu biết. Nhưng điều ông cần lúc này là nằm yên. Xe cứu thương đang tới. Ông tên gì ạ?' },
          { who: 'Clive', voice: 'nz-nam', text: "Clive. My daughter's going to go spare.", vi: 'Clive. Con gái ông sẽ phát hoảng lên mất.' },
          { who: 'Archie', voice: 'au-nam', text: "We'll ring her for you, Clive. You're in good hands.", vi: 'Bọn cháu sẽ gọi cho chị ấy, bác Clive. Bác yên tâm, có người lo rồi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd29-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Archie hô "Someone call triple-zero!" Vì sao Loan sửa lại?',
            options: ['Triple-zero là số của cảnh sát', '000 là số khẩn cấp ở Úc; họ đang ở Anh, số là 999', 'Triple-zero là số taxi', 'Archie nói sai tên số'],
            correct: 1,
            why: 'Archie là người Úc, phản xạ gọi **000** ("triple-zero"). Ở Anh là **999** (112 cũng được). Trong lúc hoảng, người ta gọi theo thói quen ở nhà, nên **biết số của nước mình đang đứng** là việc cần làm ngay khi tới nơi.',
          },
          {
            q: 'Tổng đài hỏi theo thứ tự nào?',
            options: ['Tên người gọi → quốc tịch → chuyện gì', 'Cần dịch vụ nào → địa chỉ → số điện thoại đang gọi → chuyện gì xảy ra → còn tỉnh, còn thở không', 'Chuyện gì → tuổi → địa chỉ', 'Bảo hiểm → địa chỉ → tên'],
            correct: 1,
            why: '**Which service?** → **What\'s the address?** → **What\'s the number you\'re calling from?** → **Tell me exactly what happened** → **Is he awake? Is he breathing?** Địa chỉ luôn hỏi sớm: lỡ cuộc gọi bị ngắt thì xe vẫn đi được.',
          },
          {
            q: 'Loan không biết số nhà. Cô tả vị trí thế nào?',
            options: ['Nói "I don\'t know" rồi chờ', 'Tên phố + "trung tâm thành phố" + một cửa hàng ngay cạnh + một toà nhà nổi tiếng đối diện', 'Gửi ảnh cho tổng đài', 'Đọc toạ độ GPS'],
            correct: 1,
            why: '"Oxford Street in the city centre… **outside** a pharmacy, **across the road from** the Palace Theatre." Không biết số nhà thì dùng **mốc**: cửa hàng ngay trước mặt, toà nhà lớn đối diện, ngã tư gần nhất.',
          },
          {
            q: 'Khi Archie chen vào giữa cuộc gọi, Loan làm gì?',
            options: ['Cúp máy để nói với Archie', 'Bảo Archie chờ một giây, rồi chuyển câu hỏi của Archie cho tổng đài', 'Lờ Archie đi', 'Đưa điện thoại cho Archie'],
            correct: 1,
            why: '**Archie, hang on one sec.** (giữ lượt với người bên cạnh) → **Sorry, my friend\'s asking: …** (chuyển câu hỏi). Không cúp máy giữa chừng, không để hai người cùng nói vào máy.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Câu hôm nay có **câu chẻ** (What I meant was…), **số đọc từng chữ** (oh = 0) và **cụm cố định** (jumped the gun, turned up). Nghe kỹ từ nhỏ. Viết hoa, dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd29-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — giữ lượt', spell: 'Sorry, Dermot, can I just finish?', answer: 'Sorry, Dermot, can I just finish?' },
          { label: 'Câu 2 — câu chẻ gỡ hiểu lầm', spell: 'What I meant was that the ingredients would be free.', answer: 'What I meant was that the ingredients would be free.' },
          { label: 'Câu 3 — nhận mình vội', spell: 'Sorry, I jumped the gun there.', answer: 'Sorry, I jumped the gun there.' },
          { label: 'Câu 4 — hỏi số không khẩn cấp', spell: "It's the police non-emergency number.", answer: "It's the police non-emergency number.", alt: ['It is the police non-emergency number.', "It's the police non emergency number."] },
          { label: 'Câu 5 — đồ mất tìm lại được', spell: "I'd better ring them back and tell them it's turned up.", answer: "I'd better ring them back and tell them it's turned up.", alt: ['I had better ring them back and tell them it has turned up.', "I'd better ring them back and tell them it has turned up."] },
          { label: 'Câu 6 — tả vị trí', spell: "We're outside a pharmacy, across the road from the theatre.", answer: "We're outside a pharmacy, across the road from the theatre.", alt: ['We are outside a pharmacy, across the road from the theatre.', "We're outside a pharmacy, across the road from the theater."] },
          { label: 'Câu 7 — tình trạng người bị nạn', spell: "He's awake and breathing, but he seems confused.", answer: "He's awake and breathing, but he seems confused.", alt: ['He is awake and breathing, but he seems confused.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Can I just jump in here?', 'Cho tôi chen một câu. (lịch sự, vẫn là cắt lời)', 'Sure, go ahead. · Can I just finish this point first?'],
          ['Sorry, I jumped the gun.', 'Xin lỗi, tôi vội kết luận / làm trước khi đủ thông tin.', 'No worries.'],
          ['Let me stop you there.', 'Dừng lại đã. Thường là **không đồng ý** hoặc **sắp đổi hướng**. Khá mạnh.', "Sure. But can I just finish the last bit?"],
          ['With respect, …', 'Nghe lịch sự nhưng thường là **không đồng ý mạnh**.', 'I hear you. What I\'m saying is…'],
          ['Bear with me.', 'Chờ tôi một chút (đang tìm, đang nghĩ).', 'Sure, take your time.'],
          ['Good catch.', 'Bắt được lỗi / điểm lạ hay lắm.', 'Thanks! I just wanted to check.'],
          ["It's turned up.", '(Đồ mất) tìm thấy rồi.', "Oh, thank goodness!"],
          ['Stay on the line.', '(Tổng đài) Đừng cúp máy.', "Okay, I'm still here."],
          ['Help is on its way. · An ambulance is being arranged.', 'Xe đang được điều tới. **Không** có nghĩa là xe đã tới gần.', "Thank you. What should I do until then?"],
          ['Can I take your details?', 'Cho tôi xin tên, số điện thoại, địa chỉ.', 'Of course. My name is…'],
        ],
        caption: 'Câu **"Let me stop you there"** và **"With respect"** nghe lịch sự nhưng thường là tín hiệu **căng**. Nghe thấy thì nói chậm lại, đừng nói nhanh hơn để "giành" lời.',
      },
      {
        t: 'table',
        head: ['Nơi', 'Số khẩn cấp', 'Ghi chú'],
        rows: [
          ['Anh (UK)', '**999** (hoặc 112)', '**101** = cảnh sát không khẩn cấp · **111** = tư vấn y tế không khẩn cấp (NHS)'],
          ['Ireland', '**112** hoặc **999**', 'Hai số như nhau.'],
          ['Các nước EU', '**112**', 'Gọi được ở mọi nước thành viên, kể cả từ di động.'],
          ['Mỹ · Canada', '**911**', 'Nhiều thành phố Mỹ có **311** cho việc không khẩn cấp (đèn đường hỏng, ồn…).'],
          ['Úc', '**000** ("triple-zero")', '112 cũng gọi được từ di động. **131 444** = cảnh sát không khẩn cấp (hầu hết các bang).'],
          ['New Zealand', '**111**', 'Cẩn thận: ở Anh, 111 lại là số **không khẩn cấp**.'],
          ['Nhật Bản', '**110** cảnh sát · **119** cứu hoả + cấp cứu', 'Hai số khác nhau theo việc.'],
          ['Hàn Quốc', '**112** cảnh sát · **119** cứu hoả + cấp cứu', '112 ở Hàn là **cảnh sát**, không phải số chung như châu Âu.'],
          ['Singapore', '**999** cảnh sát · **995** cứu thương + cứu hoả', ''],
          ['Việt Nam', '**113** công an · **114** cứu hoả · **115** cấp cứu', '**112** = tìm kiếm cứu nạn.'],
        ],
        caption: 'Đến một nước mới, việc đầu tiên: **lưu số khẩn cấp của nước đó** vào danh bạ. Lúc hoảng, người ta gọi theo phản xạ ở nhà, như Archie.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp khi đang gọi khẩn cấp thì làm gì',
        items: [
          'Câu đầu tiên sau khi được nối máy: nói **dịch vụ** (Ambulance / Police / Fire), rồi **địa chỉ**. Không cần chào hỏi, không cần xin lỗi vì tiếng Anh.',
          'Nói thẳng: "**English isn\'t my first language. Please speak slowly.**" Tổng đài viên được dạy để xử lý đúng chuyện đó. Ở nhiều nước (Anh, Mỹ, Úc…) tổng đài còn có thể **nối phiên dịch**: nói rõ "**Vietnamese, please.**"',
          'Không nghe kịp câu hỏi thì hỏi lại đúng chữ đó: "**Sorry, the address?**" · "**Sorry, is he what?**" Đừng đoán rồi gật.',
          '**Nhắc lại hướng dẫn** như Loan: "Got it. Don\'t move him, press on the cut, nothing to eat or drink." Tổng đài nghe thấy bạn nhắc sai sẽ sửa ngay.',
          '**Đừng cúp máy trước** khi tổng đài bảo xong. Mất sóng thì gọi lại ngay và nói "**I was just on the phone about…**".',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Phòng cấp cứu', 'A&E', 'the ER', 'ED · emergency'],
          ['Xe cứu thương tới', 'paramedics · the ambulance', 'EMTs · paramedics', 'paramedics · the ambos (thân)'],
          ['Đội cứu hoả', 'the fire brigade', 'the fire department', 'the fire brigade'],
          ['Mép vỉa hè · vỉa hè', 'kerb · pavement', 'curb · sidewalk', 'kerb · footpath'],
          ['Đồ thất lạc', 'lost property', 'lost and found', 'lost property'],
          ['Gọi điện', 'ring · call', 'call', 'ring · give someone a bell'],
          ['Số 0 khi đọc số điện thoại', 'oh', 'zero (hoặc oh)', 'oh · zero'],
          ['Hoãn bàn chuyện gì', 'put it on hold · park it', '**table it**', 'park it · put it on hold'],
        ],
        caption: '"Table it" là cặp từ **ngược nghĩa** nổi tiếng nhất giữa Anh và Mỹ. Không chắc thì hỏi như Loan: "When you say…, do you mean…?"',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b1-03 · My Bag Didn\'t Arrive** — mất vali ở sân bay và điền mẫu báo thất lạc. Hôm nay bạn đã có cuộc gọi báo mất hộ chiếu; tập này lo phần sân bay.',
          '**en-a2-01 · Lost in a New City** — điện thoại hết pin, phải hỏi đường. Nghe để ôn cách tả vị trí bằng mốc (next to, opposite) mà cuộc gọi 999 hôm nay cần.',
          '**en-ds-a2-02 · Something for a Sore Throat** — chuyện sức khoẻ **không khẩn cấp**: ra nhà thuốc thay vì gọi cấp cứu.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd29-noi',
    kind: 'speaking',
    title: 'Giữ lượt nói, gỡ hiểu lầm, gọi giúp đỡ',
    goal: 'Giữ lượt nói khi bị cắt lời mà không gắt, gỡ một hiểu lầm bằng câu chẻ (What I meant was…), hỏi lại đúng chỗ khi hai bên hiểu khác nhau, và gọi cấp cứu hay báo sự cố bằng câu ngắn, đúng thứ tự.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** chia ba nhóm: **giữ lượt / chen lời** · **gỡ hiểu lầm** · **khẩn cấp, báo sự cố**.',
          'Ngữ pháp: **câu chẻ** (What I meant was… · What you need is… · All I\'m asking is…). Đưa phần quan trọng ra **cuối câu** để người nghe không lỡ nó.',
          '**Quy trình 5 bước gọi cấp cứu**: đúng số → dịch vụ → địa chỉ bằng mốc → chuyện gì → làm theo, không cúp máy.',
          'Ngôn ngữ cơ thể: giơ tay mở để giữ lượt, ngón trỏ "một giây", ánh mắt khi bị cắt lời. Người Việt, Anh – Mỹ và Nhật hiểu **im lặng** và **nói chồng** rất khác nhau.',
          'Cuối bài nhập vai: một va chạm nhỏ với cửa ô tô; người kia nói át bạn, bạn giữ lượt và đòi trao đổi thông tin.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Ba nhóm: **giữ lượt và chen lời → gỡ hiểu lầm → khẩn cấp, báo sự cố**. Nhóm ba nên học thuộc lòng: lúc hoảng, bạn chỉ nói được câu đã thuộc. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Sorry, can I just finish?', pos: 'phr', ipa: '/ˈsɑːri kən aɪ ˈdʒʌst ˈfɪnɪʃ/', vi: 'Xin lỗi, cho mình nói hết đã? (giữ lượt, lịch sự mà chắc)', ex: "Sorry, Dermot, can I just finish? I'm nearly done.", exVi: 'Xin lỗi anh Dermot, cho em nói hết đã? Em sắp xong rồi.', more: '**just** làm câu nhẹ đi; bỏ "just" nghe gắt hơn hẳn.' },
          { w: "Hang on, I haven't quite finished.", pos: 'phr', ipa: '/ˌhæŋ ˈɑːn aɪ ˈhævnt ˌkwaɪt ˈfɪnɪʃt/', vi: 'Khoan, mình chưa nói xong. (thân, đồng nghiệp ngang hàng)', ex: "Hang on, I haven't quite finished. There's one more thing.", exVi: 'Khoan, mình chưa nói xong. Còn một chuyện nữa.' },
          { w: 'If I could just finish this point, …', pos: 'phr', ipa: '/ɪf aɪ kʊd ˈdʒʌst ˈfɪnɪʃ ðɪs ˈpɔɪnt/', vi: 'Nếu cho phép tôi nói nốt ý này… (trang trọng, với khách, sếp)', ex: "If I could just finish this point, I'll come back to your question.", exVi: 'Cho phép tôi nói nốt ý này, rồi tôi quay lại câu hỏi của anh.' },
          { w: 'Sorry, go ahead.', pos: 'phr', ipa: '/ˈsɑːri ˌɡoʊ əˈhed/', vi: 'Xin lỗi, bạn nói trước đi. (khi hai người cùng mở miệng)', ex: 'Oh, sorry, go ahead. You were saying?', exVi: 'Ôi, xin lỗi, bạn nói trước đi. Bạn đang nói gì nhỉ?' },
          { w: 'Can I just jump in here?', pos: 'phr', ipa: '/kən aɪ ˈdʒʌst ˌdʒʌmp ˈɪn hɪr/', vi: 'Cho mình chen một câu nhé? (xin cắt lời)', ex: 'Can I just jump in here? The canteen is booked on Friday.', exVi: 'Cho mình chen một câu? Căng tin thứ Sáu có người đặt rồi.' },
          { w: 'Sorry to cut in, but…', pos: 'phr', ipa: '/ˈsɑːri tə ˌkʌt ˈɪn bət/', vi: 'Xin lỗi chen ngang, nhưng…', ex: "Sorry to cut in, but we've only got five minutes left.", exVi: 'Xin lỗi chen ngang, nhưng mình chỉ còn năm phút.' },
          { w: 'Just to finish my thought, …', pos: 'phr', ipa: '/ˈdʒʌst tə ˈfɪnɪʃ maɪ ˈθɔːt/', vi: 'Nói nốt ý của mình nhé… (quay lại sau khi bị cắt)', ex: 'Just to finish my thought, the stall would still raise money.', exVi: 'Nói nốt ý của mình nhé: quầy vẫn gây được quỹ.' },
          { w: 'What I meant was (that)…', pos: 'phr', ipa: '/ˌwʌt aɪ ˈment wəz ðət/', vi: 'Ý mình (lúc nãy) là… (gỡ hiểu lầm)', ex: 'What I meant was that the ingredients would be free.', exVi: 'Ý mình là nguyên liệu sẽ miễn phí.', more: 'Nhấn mạnh **MEANT**. Không nói ~~My meaning is…~~' },
          { w: "What I'm trying to say is…", pos: 'phr', ipa: '/ˌwʌt aɪm ˈtraɪɪŋ tə ˈseɪ ɪz/', vi: 'Điều mình đang muốn nói là… (khi diễn đạt chưa trôi)', ex: "What I'm trying to say is that we need a plan B.", exVi: 'Điều mình muốn nói là mình cần phương án dự phòng.' },
          { w: "That's not quite what I meant.", pos: 'phr', ipa: '/ðæts ˈnɑːt ˌkwaɪt ˌwʌt aɪ ˈment/', vi: 'Ý mình không hẳn là vậy. (sửa nhẹ, không đổ lỗi)', ex: "Ah, that's not quite what I meant. Let me explain.", exVi: 'À, ý mình không hẳn vậy. Để mình giải thích.' },
          { w: "I don't think I explained that very well.", pos: 'phr', ipa: '/aɪ ˈdoʊnt ˈθɪŋk aɪ ɪkˈspleɪnd ðæt ˈveri ˈwel/', vi: 'Hình như mình giải thích chưa rõ. (nhận phần lỗi về mình)', ex: "Sorry, I don't think I explained that very well.", exVi: 'Xin lỗi, hình như mình giải thích chưa rõ.', more: 'Lịch sự hơn hẳn ~~You don\'t understand me.~~' },
          { w: "I think we're talking about two different things.", pos: 'phr', ipa: '/aɪ ˈθɪŋk wɪr ˈtɔːkɪŋ əˌbaʊt ˈtuː ˈdɪfrənt ˈθɪŋz/', vi: 'Hình như hai bên đang nói về hai chuyện khác nhau.', ex: "Wait, I think we're talking about two different things. You mean the Friday stall?", exVi: 'Khoan, hình như mình đang nói hai chuyện khác nhau. Ý bạn là quầy thứ Sáu à?' },
          { w: 'Just to check, when you say…, do you mean…?', pos: 'phr', ipa: '/ˈdʒʌst tə ˈtʃek wen ju ˈseɪ… du ju ˈmiːn/', vi: 'Hỏi lại chút: khi bạn nói…, ý bạn là…?', ex: "Just to check, when you say 'table it', do you mean now or later?", exVi: 'Hỏi lại chút: khi anh nói "table it", ý anh là bây giờ hay để sau?' },
          { w: 'Let me put it another way.', pos: 'phr', ipa: '/ˌlet mi ˌpʊt ɪt əˈnʌðər ˈweɪ/', vi: 'Để mình nói cách khác.', ex: 'Let me put it another way: nobody eats for free, but the food costs us nothing.', exVi: 'Nói cách khác: không ai ăn miễn phí, nhưng đồ ăn mình không tốn đồng nào.' },
          { w: 'jump the gun', pos: 'v', ipa: '/ˌdʒʌmp ðə ˈɡʌn/', vi: 'vội kết luận / hành động khi chưa đủ thông tin', ex: "Sorry, I jumped the gun there.", exVi: 'Xin lỗi, tôi vội quá.' },
          { w: 'Are we on the same page?', pos: 'phr', ipa: '/ɑːr wi ɑːn ðə ˈseɪm ˈpeɪdʒ/', vi: 'Mình hiểu giống nhau chưa?', ex: 'So, decorations next week. Are we on the same page?', exVi: 'Vậy trang trí để tuần sau. Mọi người hiểu giống nhau chưa?' },
          { w: 'There\'s been an accident.', pos: 'phr', ipa: '/ðerz bɪn ən ˈæksɪdənt/', vi: 'Có tai nạn. (câu mở đầu khi gọi cấp cứu)', ex: "There's been an accident on Oxford Street. An older man has hit his head.", exVi: 'Có tai nạn ở phố Oxford Street. Một cụ ông bị đập đầu.', anh: 'collision' },
          { w: 'Ambulance, please.', pos: 'phr', ipa: '/ˈæmbjələns ˈpliːz/', vi: 'Cho tôi xe cứu thương. (trả lời "Which service?")', ex: 'Emergency, which service? — Ambulance, please.', exVi: 'Khẩn cấp, cần dịch vụ nào? — Xe cứu thương.', anh: 'ambulance' },
          { w: "He's hit his head.", pos: 'phr', ipa: '/hiz ˈhɪt ɪz ˈhed/', vi: 'Ông ấy bị đập đầu.', ex: "He's hit his head, and he's bleeding.", exVi: 'Ông ấy bị đập đầu, và đang chảy máu.', anh: 'face-with-head-bandage' },
          { w: "She's breathing, but she's not responding.", pos: 'phr', ipa: '/ʃiz ˈbriːðɪŋ bət ʃiz ˈnɑːt rɪˈspɑːndɪŋ/', vi: 'Cô ấy còn thở nhưng không phản ứng.', ex: "She's breathing, but she's not responding when I talk to her.", exVi: 'Cô ấy còn thở nhưng gọi không phản ứng.' },
          { w: "He's bleeding (heavily).", pos: 'phr', ipa: '/hiz ˈbliːdɪŋ ˈhevəli/', vi: 'Ông ấy đang chảy máu (nhiều).', ex: "He's bleeding heavily from his arm.", exVi: 'Ông ấy chảy máu nhiều ở tay.', anh: 'adhesive-bandage' },
          { w: "We're outside… / across the road from…", pos: 'phr', ipa: '/wɪr ˌaʊtˈsaɪd… əˈkrɔːs ðə ˈroʊd frəm/', vi: 'Chúng tôi đang ở trước… / đối diện…', ex: "We're outside a pharmacy, across the road from the theatre.", exVi: 'Chúng tôi đang ở trước một hiệu thuốc, đối diện nhà hát.', anh: 'round-pushpin' },
          { w: "English isn't my first language. Please speak slowly.", pos: 'phr', ipa: '/ˈɪŋɡlɪʃ ˈɪznt maɪ ˈfɝːst ˈlæŋɡwɪdʒ ˈpliːz ˌspiːk ˈsloʊli/', vi: 'Tiếng Anh không phải tiếng mẹ đẻ của tôi. Xin nói chậm.', ex: "Sorry, English isn't my first language. Please speak slowly.", exVi: 'Xin lỗi, tiếng Anh không phải tiếng mẹ đẻ của tôi. Xin nói chậm.' },
          { w: "My passport's gone missing.", pos: 'phr', ipa: '/maɪ ˈpæspɔːrts ɡɔːn ˈmɪsɪŋ/', vi: 'Hộ chiếu của tôi bị mất rồi. (chưa rõ rơi hay bị lấy)', ex: "My passport's gone missing. I think it was in my wallet.", exVi: 'Hộ chiếu của tôi mất rồi. Hình như nó nằm trong ví.', anh: 'passport-control' },
          { w: "I'd like to report a stolen…", pos: 'phr', ipa: '/aɪd ˈlaɪk tə rɪˈpɔːrt ə ˈstoʊlən/', vi: 'Tôi muốn trình báo bị mất cắp…', ex: "I'd like to report a stolen phone.", exVi: 'Tôi muốn trình báo bị mất cắp điện thoại.', anh: 'police-officer' },
          { w: 'Could I have a reference number?', pos: 'phr', ipa: '/kʊd aɪ ˈhæv ə ˈrefrəns ˌnʌmbər/', vi: 'Cho tôi xin số tham chiếu (số hồ sơ) được không?', ex: "Could I have a reference number? The embassy might need it.", exVi: 'Cho tôi xin số tham chiếu? Đại sứ quán có thể cần.', anh: 'clipboard' },
          { w: 'turn up', pos: 'v', ipa: '/ˌtɝːn ˈʌp/', vi: '(đồ mất) xuất hiện lại, tìm thấy', ex: "Good news: my wallet's turned up!", exVi: 'Tin vui: ví của mình tìm thấy rồi!' },
          { w: 'Does anyone know first aid?', pos: 'phr', ipa: '/dəz ˈeniwʌn ˈnoʊ ˌfɝːst ˈeɪd/', vi: 'Có ai biết sơ cứu không?', ex: "Can someone call an ambulance? Does anyone know first aid?", exVi: 'Ai gọi xe cứu thương giúp với? Có ai biết sơ cứu không?' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (khách, sếp lớn)'],
        rows: [
          ['Giữ lượt', "Hang on, let me finish!", 'Sorry, can I just finish?', 'If I could just finish this point, I\'ll come back to that.'],
          ['Xin chen lời', 'Wait, wait, can I say something?', 'Can I just jump in here?', 'Sorry to interrupt. Would it be all right if I added something?'],
          ['Nhường lời', 'Go on, you first.', 'Sorry, go ahead.', 'Please, after you.'],
          ['Gỡ hiểu lầm', 'No, no, I meant…', "That's not quite what I meant. What I meant was…", "I'm afraid I may not have been clear. What I meant was…"],
          ['Kiểm cách hiểu', 'Wait, you mean now or later?', "Just to check, when you say…, do you mean…?", 'Could I just clarify what you mean by…?'],
          ['Nhờ giúp lúc gấp', 'Help! Someone call an ambulance!', 'Can someone call an ambulance, please?', '(gấp thì không cần trang trọng: nói ngắn, rõ)'],
        ],
        caption: 'Lúc **khẩn cấp**, câu ngắn và rõ **là** lịch sự. Không ai thấy "Ambulance, please!" là thô lỗ.',
      },

      { t: 'h', text: '3. Gọi cấp cứu: 5 bước, và khi nào giữ lượt' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Một cuộc gọi khẩn cấp, ở hầu hết các nước',
        steps: [
          { label: '1. Gọi **đúng số** của nước đó', sub: 'Anh 999 · Mỹ 911 · Úc 000 · EU 112' },
          { label: '2. Nói **dịch vụ**', sub: 'Ambulance / Police / Fire, please.' },
          { label: '3. Nói **ở đâu**', sub: 'tên phố + mốc: outside… · across the road from…' },
          { label: '4. Nói **chuyện gì**', sub: 'ai, mấy người, còn tỉnh không, còn thở không' },
          { label: '5. **Làm theo**, nhắc lại, không cúp máy', sub: 'Got it. Don\'t move him…' },
        ],
        caption: 'Bước 3 quan trọng nhất: lỡ mất sóng giữa chừng, có địa chỉ là xe vẫn tới được.',
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Bị cắt lời: khi nào nhường, khi nào giữ',
        cols: [
          { title: 'Nhường lời', anh: 'open-hands', items: ['Người kia có thông tin **gấp** hơn (sai giờ, sai phòng)', 'Hai người **cùng mở miệng** một lúc', 'Bạn đã nói khá lâu', 'Câu: **Sorry, go ahead.**'] },
          { title: 'Giữ lượt', anh: 'raised-hand', items: ['Bạn chỉ còn **một câu** là xong ý', 'Người kia đang **hiểu sai** điều bạn chưa nói hết', 'Bị cắt lần **thứ hai**', 'Câu: **Sorry, can I just finish?**'] },
        ],
        caption: 'Giữ lượt **không phải là bất lịch sự**. Im lặng để người khác kết luận sai về ý của mình mới là điều nên tránh trong buổi họp.',
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: '**Câu chẻ** bẻ một câu thành hai nửa để **đẩy phần quan trọng ra cuối**, chỗ người nghe chú ý nhất. "I meant the ingredients." thành "**What I meant was** the ingredients." Người nghe biết ngay: phần sắp tới mới là điều cần nhớ.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'What I meant was (that) + S + V',
            vi: 'Nói lại cho đúng điều vừa bị hiểu sai.',
            examples: [
              { en: 'What I meant was that the ingredients would be free.', vi: 'Ý mình là nguyên liệu sẽ miễn phí.' },
              { en: 'What I meant was next Friday, not this Friday.', vi: 'Ý mình là thứ Sáu tuần sau, không phải thứ Sáu này.' },
              { en: "What I meant was that I'd pay you back, not that you should pay.", vi: 'Ý mình là mình sẽ trả lại bạn, chứ không phải bạn trả.' },
            ],
          },
          {
            formula: "What I'm saying is (that) + S + V · What I mean is…",
            vi: 'Tóm lại ý đang nói, nhất là sau khi bị cắt lời.',
            examples: [
              { en: "What I'm saying is that every pound still goes to the charity.", vi: 'Điều mình đang nói là từng đồng vẫn vào quỹ từ thiện.' },
              { en: "What I mean is, we don't need a bigger budget.", vi: 'Ý mình là mình không cần ngân sách lớn hơn.' },
              { en: "What I'm saying is it's not an emergency.", vi: 'Điều tôi đang nói là việc này không khẩn cấp.' },
            ],
          },
          {
            formula: 'What + S + need(s) / want(s) + is + N / to V',
            vi: 'Nói thẳng điều cần nhất, rất hợp lúc gấp.',
            examples: [
              { en: 'What you need right now is to stay still.', vi: 'Điều ông cần lúc này là nằm yên.' },
              { en: 'What I need is a reference number for the embassy.', vi: 'Thứ tôi cần là một số tham chiếu cho đại sứ quán.' },
              { en: 'What we want is a stall that raises money.', vi: 'Điều bọn mình muốn là một quầy gây được quỹ.' },
            ],
          },
          {
            formula: "All I'm asking is (for you) + to V · All I need is + N",
            vi: '"Tôi chỉ xin đúng một điều" — giảm căng thẳng khi người kia phản đối.',
            examples: [
              { en: "All I'm asking is for you to let me finish.", vi: 'Tôi chỉ xin anh cho tôi nói hết.' },
              { en: "All I'm asking is to swap details, just in case.", vi: 'Tôi chỉ xin trao đổi thông tin, phòng khi cần.' },
              { en: 'All I need is five minutes on Friday.', vi: 'Mình chỉ cần năm phút vào thứ Sáu.' },
            ],
          },
          {
            formula: 'The thing is, + S + V',
            vi: '"Vấn đề là…" — mở ra lý do thật, thường để giải thích hoặc từ chối mềm.',
            examples: [
              { en: "The thing is, my aunt's already offered to donate everything.", vi: 'Vấn đề là dì mình đã nhận tặng hết rồi.' },
              { en: "The thing is, I don't know the house number.", vi: 'Vấn đề là tôi không biết số nhà.' },
              { en: 'The thing is, the tram was packed, so anyone could have taken it.', vi: 'Vấn đề là tàu điện chật cứng, nên ai cũng có thể lấy.' },
            ],
          },
          {
            formula: 'It was + phần muốn nhấn + that + S + V',
            vi: 'Nhấn một phần cụ thể: ai, cái gì, ở đâu, khi nào.',
            examples: [
              { en: 'It was on the tram, not in the café, that I lost it.', vi: 'Mình làm mất nó trên tàu điện, chứ không phải ở quán.' },
              { en: 'It was Tobias who wanted to wait, not Gwen.', vi: 'Người muốn để sau là Tobias, không phải Gwen.' },
              { en: 'It was on Wednesday that it happened, not Tuesday.', vi: 'Chuyện đó xảy ra hôm thứ Tư, không phải thứ Ba.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu thường', 'Câu chẻ', 'Phần được nhấn'],
        rows: [
          ['I meant the ingredients.', '**What I meant was** the ingredients.', 'the ingredients'],
          ['You need to stay still.', '**What you need is** to stay still.', 'to stay still'],
          ['Please let me finish.', "**All I'm asking is** for you to let me finish.", 'chỉ một điều nhỏ'],
          ["I don't know the number.", "**The thing is,** I don't know the number.", 'lý do'],
          ['Tobias wanted to wait.', '**It was** Tobias **who** wanted to wait.', 'Tobias (không phải người khác)'],
        ],
        caption: 'Đừng dùng câu chẻ cho **mọi** câu: nghe như đang tranh cãi. Dùng đúng lúc có hiểu lầm, bị cắt lời, hoặc lúc gấp.',
      },
      {
        t: 'rule',
        formula: 'What I meant was (that) + câu · What + S + need(s) + is + N / to V · All I\'m asking is + to V · It was + X + that / who…',
        vi: 'Muốn chỉnh một hiểu lầm hay nói điều quan trọng nhất: đặt "What… is / was" ở đầu, để phần cần nghe ra cuối câu và nhấn giọng vào đó.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: I mean · in other words · to put it another way',
        items: [
          '**I mean, …** = ý mình là: sửa ngay câu vừa nói, rất tự nhiên khi nói nhanh. "It\'s free. **I mean**, the ingredients are free."',
          '**In other words, …** = nói cách khác: tóm lại bằng câu đơn giản hơn. "The food costs us nothing. **In other words**, every pound is profit."',
          '**To put it another way, …** = nói theo cách khác: đổi góc nhìn khi người nghe vẫn chưa hiểu. Dài hơn, hợp khi họp.',
          'Ba từ nối này **không dùng để mở đầu** chuyện mới; chúng chỉ dùng để **nói lại** điều vừa nói.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd29-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh bằng câu chẻ (5 câu)',
        kind: 'translate',
        grammar: "What I meant was… · What I'm saying is… · What + S + need(s) + is… · All I'm asking is… · The thing is, …",
        items: [
          { q: 'Ý mình là thứ Sáu tuần sau, không phải thứ Sáu này.', hint: 'What I meant was', answers: ['What I meant was next Friday, not this Friday.', 'What I meant was next Friday, not this one.', 'What I meant was next Friday rather than this Friday.'] },
          { q: 'Điều bạn cần lúc này là ngồi yên.', hint: 'What you need, is to', answers: ['What you need right now is to sit still.', 'What you need now is to sit still.', 'What you need is to sit still.', 'What you need right now is to stay still.', 'What you need now is to stay still.', 'What you need is to stay still.'] },
          { q: 'Tôi chỉ xin anh cho tôi nói hết.', hint: "All I'm asking is, for you to", answers: ["All I'm asking is for you to let me finish.", 'All I am asking is for you to let me finish.', "All I'm asking is that you let me finish.", "All I'm asking is to finish."] },
          { q: 'Vấn đề là tôi không biết số nhà.', hint: 'The thing is', answers: ["The thing is, I don't know the house number.", 'The thing is, I do not know the house number.', "The thing is I don't know the house number.", "The thing is, I don't know the number.", "The thing is, I don't know the street number."] },
          { q: 'Điều mình đang nói là việc này không khẩn cấp.', hint: "What I'm saying is", answers: ["What I'm saying is that it's not an emergency.", "What I'm saying is it's not an emergency.", "What I'm saying is that this isn't an emergency.", "What I'm saying is this isn't an emergency.", 'What I am saying is that it is not an emergency.', "What I'm saying is that this is not an emergency."] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~My meaning is…~~ → **What I meant was…** / **What I mean is…** Câu đầu dịch từng chữ "ý của tôi là", nghe như đang đọc định nghĩa.',
          '~~Wait me finish!~~ → **Sorry, can I just finish?** "wait" cần **for** (wait for me), và câu mệnh lệnh trần nghe như quát.',
          '~~Sorry for interrupt.~~ → **Sorry to interrupt.** / **Sorry to cut in.** Sau "sorry for" phải là danh từ hoặc V-ing; với lời xin chen thì "sorry **to** + V" mới tự nhiên.',
          '~~You don\'t understand me.~~ → **I don\'t think I explained that very well.** Câu đầu đổ lỗi cho người nghe; câu sau nhận phần lỗi về mình, người kia sẵn lòng nghe lại hơn.',
          '~~He is accident.~~ → **He\'s had an accident.** / **There\'s been an accident.** "accident" là danh từ, không đứng sau "is" như tính từ.',
          '~~I was lost my passport.~~ → **I\'ve lost my passport.** / **My passport\'s gone missing.** Không ghép "was" với động từ thường; "I was lost" lại có nghĩa là **tôi bị lạc đường**.',
          '~~He is bleeding blood.~~ → **He\'s bleeding.** "bleed" đã là chảy máu; muốn tả thêm thì nói **where** (from his forehead) và **how much** (heavily).',
          '~~Call the ambulance!~~ → **Call an ambulance!** Chưa có chiếc xe cụ thể nào, nên dùng **an**. Và ở nước ngoài, đừng hô ~~Call 115!~~: nói số **của nước đó** hoặc chỉ cần "Call an ambulance!".',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi bị cắt lời, khi gỡ hiểu lầm, khi có chuyện gấp' },
      {
        t: 'p',
        text: 'Giữ lượt bằng tay và mắt nhiều khi hiệu quả hơn bằng lời. Còn lúc gấp, cơ thể bình tĩnh của bạn làm người bị nạn bình tĩnh theo. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ hôm nay',
        items: [
          { anh: 'raised-hand', w: 'Sorry, can I just finish?', ro: '/ˈsɑːri kən aɪ ˈdʒʌst ˈfɪnɪʃ/', vi: 'Giơ nhẹ **bàn tay mở**, lòng bàn tay hướng về người đang chen, kèm nụ cười = "chờ chút". Đừng giơ thẳng tay như chặn xe: nghe như "im đi".' },
          { anh: 'index-pointing-up', w: 'Just one sec.', ro: '/ˈdʒʌst ˈwʌn ˈsek/', vi: 'Ngón trỏ giơ lên (không chĩa vào ai) = "một giây thôi". Anh, Mỹ, Úc hiểu ngay. Ở một số nơi châu Á, giơ ngón tay khi người lớn tuổi đang nói bị coi là **thiếu lễ phép**: dùng lời thay tay.' },
          { anh: 'open-hands', w: 'What I meant was…', ro: '/ˌwʌt aɪ ˈment wəz/', vi: 'Hai bàn tay mở khi giải thích lại = "mình không giấu gì, chỉ nói lại cho rõ". Khoanh tay lúc gỡ hiểu lầm nghe như **phòng thủ**.' },
          { anh: 'eyes', w: '(nhìn thẳng, gật nhẹ)', ro: '', vi: 'Bị cắt lời mà vẫn **nhìn người kia bình tĩnh** = bạn chưa xong. Nhìn xuống bàn = bạn bỏ cuộc, người ta sẽ nói tiếp luôn.' },
          { anh: 'face-with-raised-eyebrow', w: 'Sorry, when you say…, do you mean…?', ro: '', vi: 'Nhướn mày nhẹ + nghiêng đầu = "khoan, mình hiểu chưa chắc". Người Anh – Mỹ đọc được tín hiệu này và thường tự giải thích thêm.' },
          { anh: 'waving-hand', w: 'Over here!', ro: '/ˌoʊvər ˈhɪr/', vi: 'Khi xe cứu thương, cảnh sát tới: **đứng ra chỗ dễ thấy và vẫy cả cánh tay**. Ban đêm, bật đèn pin điện thoại.' },
          { anh: 'slightly-smiling-face', w: "You're in good hands.", ro: '/jər ɪn ˌɡʊd ˈhændz/', vi: 'Với người bị nạn: mặt bình tĩnh, nói chậm, gọi tên họ. Người hoảng sẽ "soi" nét mặt bạn để biết mình nặng hay nhẹ.' },
          { anh: 'handshake', w: 'Is it okay if I help you?', ro: '/ɪz ɪt oʊˈkeɪ ɪf aɪ ˈhelp ju/', vi: 'Ở Anh, Mỹ, Úc, **hỏi trước khi chạm** vào người lạ, kể cả để đỡ dậy. Ở Việt Nam ta hay đỡ ngay; ở đó người ta có thể giật mình.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh', 'Mỹ', 'Nhật'],
        rows: [
          ['Nói chồng lên nhau', 'Bình thường khi trò chuyện vui; trong họp thì nhường người lớn.', 'Khá ít; hay chờ người kia dừng hẳn.', 'Nhiều người nói chồng để **tỏ ra hào hứng**, không phải để giành lời.', 'Rất ít; chờ người kia nói xong hẳn.'],
          ['Im lặng vài giây', 'Có thể là đang nghĩ, hoặc ngại.', 'Hơi ngượng; người ta sẽ lấp vào.', 'Ngượng; người ta lấp ngay.', 'Bình thường, là lúc **suy nghĩ**; đừng vội lấp.'],
          ['Tiếng "ừ, ừ" khi nghe', 'Bình thường.', 'Ít; gật đầu là đủ.', '"Uh-huh", "right".', 'Rất nhiều ("hai", "ee"): nghĩa là **đang nghe**, chưa chắc là **đồng ý**.'],
          ['Chạm người lạ lúc gấp', 'Đỡ ngay.', 'Hỏi trước.', 'Hỏi trước.', 'Hỏi trước, giữ khoảng cách.'],
        ],
        caption: 'Đây là **xu hướng chung**. Một đồng nghiệp Nhật gật đầu liên tục khi bạn nói **chưa chắc đã đồng ý**: hỏi lại "So, does that work for you?" cho chắc.',
      },

      { t: 'h', text: '7. Phát âm: nhấn đúng chỗ trong câu chẻ, đọc số khẩn cấp' },
      {
        t: 'p',
        text: 'Câu chẻ chỉ có tác dụng khi bạn **nhấn đúng hai chỗ**: động từ ở nửa đầu (MEANT, NEED) và **từ khoá** ở cuối. Phần giữa đọc lướt. Số điện thoại thì đọc **từng chữ số**, ngắt theo nhóm, 0 đọc là **oh** (Anh) hoặc **zero**.',
      },
      {
        t: 'phatam',
        id: 'gtd29-noi-phat-am',
        title: 'Đọc to 6 câu',
        note: 'Nghe mẫu, đọc theo, rồi bấm ghi âm. Cố giữ nhịp: từ nhấn rõ và dài, từ nhỏ lướt nhanh.',
        items: [
          { text: 'What I meant was that the ingredients would be free.', ipa: 'wʌt aɪ ment wəz ðət ði ɪnˈɡriːdiənts wʊd bi friː', vi: 'Nhấn **MEANT** và **FREE**; "was that" lướt /wəz ðət/.' },
          { text: 'Sorry, can I just finish?', ipa: 'sɑːri kən aɪ dʒʌst fɪnɪʃ', vi: '"can I" đọc nhẹ /kənaɪ/ nối liền; lên giọng nhẹ ở **FINish**: câu xin, không phải câu ra lệnh.' },
          { text: "There's been an accident.", ipa: 'ðerz bɪn ən ˈæksɪdənt', vi: '"been an" nối /bɪnən/; trọng âm **AC**-ci-dent ở âm đầu.' },
          { text: "He's awake and breathing, but he seems confused.", ipa: 'hiz əˈweɪk ən ˈbriːðɪŋ bət hi siːmz kənˈfjuːzd', vi: '**breathing** có /ð/ (lưỡi giữa răng), khác **breath** /θ/. "and" đọc /ən/.' },
          { text: "We're across the road from the theatre.", ipa: 'wɪr əˈkrɔːs ðə roʊd frəm ðə ˈθiːətər', vi: '**theatre** bắt đầu /θ/, trọng âm âm đầu **THEA**-tre.' },
          { text: 'Oh seven seven oh oh, nine oh oh, four six one.', ipa: 'oʊ ˈsevən ˈsevən oʊ oʊ naɪn oʊ oʊ fɔːr sɪks wʌn', vi: 'Đọc theo **nhóm** như người Anh (5 · 3 · 3), ngừng ngắn giữa các nhóm. Số này thuộc dải Anh dành cho phim, sách: không gọi được.' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: va chạm nhỏ với cửa ô tô' },
      {
        t: 'dialogue',
        title: 'Loan đạp xe thuê dọc phố thì một tài xế mở cửa xe đúng lúc cô đi qua. Cô ngã nhẹ. Người tài xế (Marnie) vội và nói át',
        lines: [
          { who: 'Marnie', role: 'b', text: "Oh my God, I'm so sorry! I didn't see you at all. Are you alright?", vi: 'Trời ơi, tôi xin lỗi! Tôi không thấy chị đâu cả. Chị có sao không?' },
          { who: 'Loan', role: 'a', text: "I think so. My wrist hurts a bit, but I can move it.", vi: 'Chắc là không sao. Cổ tay hơi đau, nhưng vẫn cử động được.' },
          { who: 'Marnie', role: 'b', text: "Thank goodness. Look, it's only a scratch on the bike, so let's not make a fuss. I can give you twenty quid and we'll call it—", vi: 'May quá. Thế này, xe đạp chỉ trầy tí thôi, nên đừng làm to chuyện. Tôi đưa chị hai mươi bảng rồi mình coi như—' },
          { who: 'Loan', role: 'a', text: "Sorry, can I just finish? I'm not asking for money. What I'm saying is that my wrist might be worse tomorrow.", vi: 'Xin lỗi, cho tôi nói hết đã? Tôi không đòi tiền. Điều tôi đang nói là cổ tay tôi có thể đau hơn vào ngày mai.' },
          { who: 'Marnie', role: 'b', text: "Oh. Right. Sorry, I'm a bit shaken. What would you like to do?", vi: 'Ồ. Vâng. Xin lỗi, tôi hơi run. Chị muốn làm gì?' },
          { who: 'Loan', role: 'a', text: "All I'm asking is to swap details, just in case. Your name, your number and the car registration.", vi: 'Tôi chỉ xin trao đổi thông tin, phòng khi cần. Tên chị, số điện thoại và biển số xe.' },
          { who: 'Marnie', role: 'b', text: "That's fair. I'll text them to you now. And the bike company? Do you need to report it?", vi: 'Hợp lý. Tôi nhắn cho chị ngay. Còn công ty cho thuê xe? Chị có cần báo không?' },
          { who: 'Loan', role: 'a', text: "Yes, I'll ring them. The thing is, I'm not sure what they'll ask, so could you stay for two minutes?", vi: 'Có, tôi sẽ gọi họ. Vấn đề là tôi không chắc họ sẽ hỏi gì, nên chị ở lại hai phút được không?' },
          { who: 'Marnie', role: 'b', text: 'Of course. And if your wrist swells up, go and get it checked. Honestly, I feel awful.', vi: 'Tất nhiên. Nếu cổ tay sưng lên thì chị đi khám nhé. Thật lòng tôi thấy áy náy quá.' },
          { who: 'Loan', role: 'a', text: "Thanks. It was an accident. What matters is that nobody's badly hurt.", vi: 'Cảm ơn chị. Là tai nạn thôi. Điều quan trọng là không ai bị thương nặng.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd29-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Loan (5 câu)',
        items: [
          { vi: 'Xin lỗi, cho tôi nói hết đã?', chips: ['Sorry,', 'can', 'I', 'just', 'finish?', 'wait', 'me'], answer: ['Sorry,', 'can', 'I', 'just', 'finish?'] },
          { vi: 'Điều tôi đang nói là cổ tay tôi có thể đau hơn vào ngày mai.', chips: ["What", "I'm", 'saying', 'is', 'that', 'my', 'wrist', 'might', 'be', 'worse', 'tomorrow.', 'meaning', 'my'], answer: ["What", "I'm", 'saying', 'is', 'that', 'my', 'wrist', 'might', 'be', 'worse', 'tomorrow.'] },
          { vi: 'Tôi chỉ xin trao đổi thông tin, phòng khi cần.', chips: ['All', "I'm", 'asking', 'is', 'to', 'swap', 'details,', 'just', 'in', 'case.', 'for', 'only'], answer: ['All', "I'm", 'asking', 'is', 'to', 'swap', 'details,', 'just', 'in', 'case.'] },
          { vi: 'Vấn đề là tôi không chắc họ sẽ hỏi gì.', chips: ['The', 'thing', 'is,', "I'm", 'not', 'sure', 'what', "they'll", 'ask.', 'will', 'they', 'problem'], answer: ['The', 'thing', 'is,', "I'm", 'not', 'sure', 'what', "they'll", 'ask.'] },
          { vi: 'Điều quan trọng là không ai bị thương nặng.', chips: ['What', 'matters', 'is', 'that', "nobody's", 'badly', 'hurt.', 'important', 'bad'], answer: ['What', 'matters', 'is', 'that', "nobody's", 'badly', 'hurt.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd29-noi-tra-loi',
        part: '1',
        questions: [
          'Has anyone ever misunderstood something you said? What happened, and how did you clear it up?',
          'Someone keeps interrupting you in a meeting. What do you say, and what do you do with your hands and eyes?',
          'Imagine you are in a country you have never been to and you see an accident. What are the first three things you do?',
          'What would you do if you lost your passport abroad? Explain the steps.',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are three people, one after another. (1) Dermot, a friendly but very talkative colleague in a planning meeting: interrupt me at least twice and misunderstand one thing I say. (2) A police non-emergency call handler in the UK: I am reporting a passport that may have been stolen; ask for my name with spelling, what was inside, and give me a reference number with letters and digits. (3) A 999 ambulance call handler: ask the usual questions in the usual order (service, address, phone number, what happened, awake, breathing) and give me two instructions. Speak naturally at B2 level, about 180 words per minute, and do not slow down unless I ask. After each part, tell me in Vietnamese: did I hold my turn politely (Sorry, can I just finish?), did I use a cleft sentence to fix the misunderstanding (What I meant was…), and did I give the address before the story? Give two concrete corrections."',
          'Làm **2 lượt**. Lượt hai: phần (3) bạn **không biết số nhà**, phải tả vị trí bằng ba mốc. Và nhờ AI nói **nhanh hơn**; bạn phải dùng "Sorry, could you say that more slowly?" ít nhất một lần.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd29-doc',
    kind: 'reading',
    title: 'Biển báo, hướng dẫn khẩn cấp, thông báo sự cố',
    goal: 'Đọc nhanh và làm đúng theo sáu văn bản an toàn thật của đời sống (bảng thoát hiểm văn phòng, thông báo ở ga, email sự cố toà nhà, thẻ khẩn cấp khách sạn, biển bãi biển Úc, biển cửa ở Mỹ), nhận ra câu nào là lệnh, câu nào là thông tin, và việc gì phải làm ngay.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Sáu mẩu chữ Loan gặp trong tuần ở Anh, cộng hai mẩu ở **Úc** và **Mỹ** để so sánh: bảng **FIRE ACTION**, thông báo **ở ga**, email **sự cố toà nhà**, thẻ **khẩn cấp** trong phòng khách sạn, biển **bãi biển**, biển **cửa thoát hiểm**.',
          'Văn bản an toàn viết **rất ngắn**: câu mệnh lệnh (Do not use the lifts), bị động (Unattended items may be removed), **No + V-ing**, "… only". Đọc ra ngay: **phải làm gì · không được làm gì · đi đâu**.',
          'Email sự cố có khung riêng: **chuyện gì · đã làm gì · bạn cần làm gì · khi nào có tin tiếp**. Học khung này, bạn đọc được mọi email sự cố.',
          'Mẹo nhìn màu: ở Anh, EU, Úc, biển **xanh lá** = lối thoát; **đỏ** = cấm hoặc thiết bị chữa cháy; **vàng** = cảnh báo; **xanh dương** = bắt buộc. Ở Mỹ, biển **EXIT** nhiều nơi lại màu **đỏ**.',
        ],
      },

      { t: 'h', text: '1. Đọc sáu mẩu sau' },
      {
        t: 'canh',
        anh: ['fire-extinguisher', 'warning', 'station', 'e-mail', 'hotel', 'beach-with-umbrella'],
        caption: 'Tuần ở Manchester, Loan chụp lại những thứ cô thấy lạ: bảng thoát hiểm cạnh thang máy, thông báo ở ga tàu điện, email của ban quản lý toà nhà, thẻ trên cửa phòng khách sạn. Bạn cô ở Úc và Mỹ gửi thêm hai ảnh.',
      },
      {
        t: 'passage',
        title: "Loan's photos — safety signs and notices",
        intro: 'Đọc một lượt, tự hỏi với mỗi mẩu: **tôi phải làm gì, không được làm gì, và đi đâu?** Chỗ in đậm là cụm sẽ học.',
        paras: [
          {
            label: 'A',
            text: '**FIRE ACTION** (next to the lift, 4th floor) — **If you discover a fire:** raise the alarm by operating the nearest **fire alarm call point**. Call the fire brigade on **999**. **On hearing the alarm:** leave the building by the nearest available exit. **Do not use the lifts.** **Do not stop to collect personal belongings.** Close doors behind you **if it is safe to do so**. Go to the **assembly point**: Car Park B. **Do not re-enter the building** until a fire marshal tells you it is safe. (Small print) Weekly alarm test: Wednesdays at 11:00. If the alarm sounds for **longer than 30 seconds**, treat it as real.',
          },
          {
            label: 'B',
            text: '**CUSTOMER INFORMATION — St Peter\'s Square tram stop** — **Service disruption:** Due to a **signal fault**, trams are **not running** between St Peter\'s Square and Deansgate until **further notice**. **Please allow extra time** for your journey. Tickets are **being accepted** on local bus services. **Please do not leave luggage unattended.** Unattended items **may be removed without warning**. If you see something suspicious, text the British Transport Police on **61016**. **In an emergency, always call 999.**',
          },
          {
            label: 'C',
            text: '**From:** Building Management · **Subject: INCIDENT UPDATE — water leak, 3rd floor (Thu 14:20)** — Hi all, earlier today a pipe burst in the third-floor kitchen. The area has been **cordoned off**, and the water supply to floors 3 and 4 has been **temporarily shut off**. Engineers are **on site**, and we **expect the supply to be restored** by around 6 pm. **In the meantime**, please use the kitchens on floors 1 and 2, and **avoid** the east stairwell, as the floor is still wet. **No action is required** unless your desk is inside the taped-off area, in which case please **work from** the 2nd-floor breakout room. We\'ll send **a further update** by 5 pm. **Apologies for any inconvenience.**',
          },
          {
            label: 'D',
            text: '**IN CASE OF EMERGENCY** (card on the back of hotel room 512) — **Fire:** if you hear a **continuous** alarm, leave by the nearest exit, **marked by** green signs. Feel the door first: **if it is hot, do not open it**; stay in the room, put a wet towel along the bottom of the door and call reception. **Do not use the lift.** **Medical emergency:** dial **0** for reception (**staffed 24 hours**) or **999** for an ambulance. **Lost your key card?** Reception can **issue** a new one **on presentation of** photo ID. **Lost property** is held for three months.',
          },
          {
            label: 'E',
            text: '**Sign at a beach in Queensland, Australia** (photo from Archie) — **SWIM BETWEEN THE RED AND YELLOW FLAGS.** Lifeguards **patrol** this beach **between the flags**, 8 am to 5 pm. **WARNING: strong currents.** **If you are caught in a rip:** stay calm. **Float** to save your energy. **Raise an arm** and wave for help. **Do not** try to swim straight back to the beach against the current. **No swimming** outside patrol hours. **Emergency: 000.**',
          },
          {
            label: 'F',
            text: '**Door signs in an office in Boston, USA** (photo from Tobias) — **EMERGENCY EXIT ONLY. ALARM WILL SOUND.** · **CAUTION: WET FLOOR** · **AED INSIDE** (with a heart symbol) · **In case of emergency, dial 911.** For non-emergency city services (streetlights, noise, potholes), **dial 311.** · **Keep this door closed at all times.**',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd29-doc-hieu',
        title: 'Hiểu ý và làm đúng (8 câu)',
        items: [
          {
            q: '(A) Thứ Tư lúc 11:00, chuông báo cháy kêu được khoảng 10 giây rồi tắt. Bạn làm gì?',
            options: ['Ra ngay chỗ tập trung', 'Không cần làm gì: đó là chuông thử hằng tuần', 'Gọi 999', 'Đi thang máy xuống'],
            correct: 1,
            why: '"Weekly alarm test: Wednesdays at 11:00. If the alarm sounds for **longer than 30 seconds**, treat it as real." Mười giây rồi tắt = thử chuông. Kêu quá 30 giây thì mới coi là thật.',
          },
          {
            q: '(A) Nghe chuông thật, laptop của bạn còn trên bàn. Theo bảng, bạn làm gì?',
            options: ['Quay lại lấy laptop rồi mới đi', 'Đi ngay, không quay lại lấy đồ', 'Chờ trưởng nhóm', 'Đi thang máy cho nhanh'],
            correct: 1,
            why: '**Do not stop to collect personal belongings.** Và **Do not use the lifts.** Hai câu mệnh lệnh phủ định là hai điều quan trọng nhất của mọi bảng FIRE ACTION.',
          },
          {
            q: '(B) "Trams are not running between St Peter\'s Square and Deansgate until further notice." Nghĩa là?',
            options: ['Tàu chạy lại sau 30 phút', 'Tàu ngừng chạy đoạn đó, chưa biết đến khi nào', 'Tàu chạy chậm hơn', 'Tàu chỉ ngừng vào cuối tuần'],
            correct: 1,
            why: '**until further notice** = cho tới khi có thông báo mới, tức **chưa có giờ** chạy lại. Kèm "Tickets are **being accepted** on local bus services" = vé tàu đi xe buýt được.',
          },
          {
            q: '(B) Bạn thấy một chiếc ba lô không ai trông ở sân ga. Thông báo bảo làm gì?',
            options: ['Mở ra xem bên trong', 'Nhắn tin cho cảnh sát giao thông đường sắt qua số 61016 (gấp thì gọi 999)', 'Mang ra quầy đồ thất lạc', 'Bỏ qua'],
            correct: 1,
            why: '"If you see something suspicious, **text** the British Transport Police on **61016**. In an emergency, always call **999**." Đừng chạm vào đồ đáng ngờ.',
          },
          {
            q: '(C) Bàn của bạn ở tầng 3 nhưng **không** nằm trong vùng bị chăng dây. Bạn cần làm gì?',
            options: ['Chuyển xuống phòng breakout tầng 2', 'Không cần làm gì đặc biệt; dùng bếp tầng 1–2 và tránh cầu thang phía đông', 'Về nhà làm việc', 'Gọi kỹ sư'],
            correct: 1,
            why: '"**No action is required unless** your desk is inside the taped-off area." Còn "In the meantime, please use the kitchens on floors 1 and 2, and **avoid** the east stairwell."',
          },
          {
            q: '(C) Giọng điệu của email sự cố này thế nào?',
            options: ['Hoảng hốt, đổ lỗi', 'Bình tĩnh, rõ ràng: chuyện gì, đã làm gì, bạn làm gì, khi nào có tin tiếp', 'Thân mật như tin nhắn bạn bè', 'Mơ hồ, không có giờ'],
            correct: 1,
            why: 'Đủ bốn phần của một thông báo sự cố tốt: **chuyện gì** (pipe burst) · **đã làm gì** (cordoned off, shut off, engineers on site) · **bạn làm gì** (use floors 1–2, avoid…) · **khi nào cập nhật** (a further update by 5 pm).',
          },
          {
            q: '(D) Có chuông cháy ban đêm, bạn sờ cửa phòng thấy **nóng**. Thẻ bảo làm gì?',
            options: ['Mở cửa chạy thật nhanh', 'Không mở cửa; ở trong phòng, chèn khăn ướt dưới khe cửa và gọi lễ tân', 'Đi thang máy', 'Nhảy qua cửa sổ'],
            correct: 1,
            why: '"Feel the door first: **if it is hot, do not open it**; stay in the room, put a wet towel along the bottom of the door and call reception." Cửa nóng = lửa hoặc khói ở ngay bên ngoài.',
          },
          {
            q: '(E) Bị dòng rip kéo ra xa ở bãi biển Úc. Biển báo khuyên gì?',
            options: ['Bơi thật mạnh thẳng vào bờ', 'Bình tĩnh, nổi để giữ sức, giơ một tay vẫy gọi giúp', 'Lặn xuống đáy', 'Gọi 911'],
            correct: 1,
            why: '"Stay calm. **Float** to save your energy. **Raise an arm** and wave for help. **Do not** try to swim straight back… against the current." Và số khẩn cấp ở Úc là **000**, không phải 911.',
          },
        ],
      },

      { t: 'h', text: '2. Văn bản an toàn viết thế nào' },
      {
        t: 'table',
        head: ['Kiểu câu', 'Ví dụ trong bài', 'Đọc ra là'],
        rows: [
          ['Mệnh lệnh (V nguyên mẫu)', 'Leave the building by the nearest exit.', '**Phải làm**'],
          ['Do not + V', 'Do not use the lifts. · Do not re-enter the building.', '**Cấm**, rất mạnh'],
          ['No + V-ing / N', 'No swimming outside patrol hours.', '**Cấm**'],
          ['… only', 'Emergency exit only.', 'Chỉ dùng cho việc đó'],
          ['Bị động (may / will be + V3)', 'Unattended items may be removed without warning.', 'Hậu quả nếu bạn không làm theo'],
          ['If you…, (then) V', 'If you are caught in a rip, stay calm.', 'Trong tình huống X thì làm Y'],
          ['unless…', 'No action is required unless your desk is inside the area.', 'Trừ khi…, còn lại không cần làm gì'],
          ['Please + V · Please avoid…', 'Please allow extra time.', 'Yêu cầu lịch sự, vẫn nên làm'],
        ],
        caption: 'Biển báo bỏ gần hết **mạo từ và chủ ngữ**: "Lift out of order" = "The lift is out of order". Đọc theo **danh từ + tính từ** là ra ý.',
      },
      {
        t: 'note',
        title: 'Cụm hay gặp trong thông báo sự cố và hướng dẫn khẩn cấp',
        items: [
          '**until further notice** = cho tới khi có thông báo mới · **service disruption** = dịch vụ bị gián đoạn · **out of order** = hỏng, không dùng được.',
          '**cordoned off / taped off** = bị chăng dây, không vào được · **on site** = có mặt tại chỗ · **restored** = được khôi phục.',
          '**in the meantime** = trong lúc chờ · **a further update** = tin cập nhật tiếp theo · **no action is required** = bạn không cần làm gì.',
          '**assembly point** = điểm tập trung khi sơ tán · **fire marshal / fire warden** = người phụ trách sơ tán từng tầng · **evacuate** = sơ tán.',
          '**unattended** = không có người trông · **suspicious** = đáng ngờ · **on presentation of photo ID** = khi xuất trình giấy tờ có ảnh.',
          '**AED** (Mỹ) / **defibrillator** (Anh, Úc) = máy khử rung tim tự động, đặt ở nơi công cộng; ai cũng được dùng, máy hướng dẫn bằng giọng nói.',
        ],
      },
      {
        t: 'table',
        head: ['Biển báo', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Thang máy', 'Lift', 'Elevator', 'Lift'],
          ['Lối ra', 'Way out · Exit', 'Exit', 'Exit'],
          ['Nhà vệ sinh', 'Toilets', 'Restrooms', 'Toilets'],
          ['Bãi đỗ xe', 'Car park', 'Parking lot / garage', 'Car park'],
          ['Cẩn thận bậc', 'Mind the step', 'Watch your step', 'Mind the step · Watch your step'],
          ['Máy khử rung tim', 'Defibrillator', 'AED', 'Defibrillator · AED'],
          ['Số khẩn cấp in trên biển', '999', '911', '000'],
        ],
        caption: 'Ở ga tàu điện ngầm London, câu **Mind the gap** (cẩn thận khe hở giữa tàu và sân ga) nổi tiếng tới mức thành quà lưu niệm.',
      },

      { t: 'h', text: '3. Tự kiểm tra' },
      {
        t: 'quiz',
        id: 'gtd29-doc-dien',
        title: 'Điền một từ còn thiếu trên biển / thông báo (6 câu)',
        kind: 'fill',
        grammar: 'Do not + V · No + V-ing · … only · until further notice · in the meantime · unattended',
        items: [
          { q: 'Do not ___ the lifts in the event of fire.', answers: ['use'] },
          { q: '___ swimming outside patrol hours.', answers: ['No', 'no'] },
          { q: 'Emergency exit ___. Alarm will sound.', answers: ['only'] },
          { q: 'This station is closed until further ___.', answers: ['notice'] },
          { q: 'Engineers are on site. In the ___, please use the stairs.', answers: ['meantime'] },
          { q: 'Please do not leave bags ___. (không người trông)', answers: ['unattended'] },
        ],
      },
      {
        t: 'note',
        title: 'Áp dụng ngay',
        items: [
          'Lần tới vào một toà nhà mới (công ty OJT, khách sạn, ký túc xá), **tìm bảng thoát hiểm** và đọc ba điều: lối thoát gần nhất, điểm tập trung, ai là fire marshal.',
          'Ngày đầu tới một nước, lưu vào danh bạ: **số khẩn cấp**, **số không khẩn cấp**, **số đại sứ quán Việt Nam** ở nước đó.',
          'Chụp ảnh **trang thông tin hộ chiếu** và lưu riêng một bản (email cho chính mình). Mất hộ chiếu thì bản chụp giúp đại sứ quán xử lý nhanh hơn rất nhiều.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd29-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 29',
    goal: 'Làm 32 câu có đáp án: giữ lượt và gỡ hiểu lầm đúng mức lịch sự, dùng câu chẻ, gọi khẩn cấp đúng số và đúng thứ tự, hiểu biển báo; ôn Ngày 26–28.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 32 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có **4 câu ôn** Ngày 26–28 (ghi rõ trong câu).',
          'Làm không nhìn bài. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**. Nhóm câu khẩn cấp: nói to cho tới khi thuộc.',
          'Đúng từ **26/32** trở lên thì sang **Ngày 30**, ngày cuối khoá.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd29-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn đang trình bày ý trong buổi họp thì một đồng nghiệp chen vào lần thứ hai. Bạn chỉ còn một câu là xong. Câu tốt nhất:',
            options: ['Stop talking, please.', "Sorry, can I just finish? I'm nearly there.", '(im lặng, ngồi xuống)', 'Wait me finish!'],
            correct: 1,
            why: '**Sorry, can I just finish?** + lý do ngắn (I\'m nearly there) = giữ lượt chắc mà không gắt.',
          },
          {
            q: 'Bạn nói "Let\'s meet at the station" và đồng nghiệp đi tới nhầm ga khác. Gặp lại, bạn nói:',
            options: ["You don't understand me.", "Sorry, I don't think I explained that very well. What I meant was the tram station, not the train station.", 'Your fault.', 'I said station! Station!'],
            correct: 1,
            why: 'Nhận phần lỗi về mình (**I don\'t think I explained that very well**) rồi **What I meant was…**',
          },
          {
            q: 'Khách người Mỹ nói "Let\'s table the budget for now." Bạn không chắc ý họ. Bạn hỏi:',
            options: ['OK, so the budget, what do you think?', "Just to check, when you say 'table it', do you mean discuss it now or later?", 'What is table?', '(gật đầu)'],
            correct: 1,
            why: '"table it" ở Mỹ = **hoãn**, ở Anh = **đưa ra bàn**. Hỏi lại đúng chữ gây khó hiểu bằng **Just to check, when you say…, do you mean…?**',
          },
          {
            q: 'Hai bạn cùng mở miệng nói một lúc. Câu lịch sự nhất:',
            options: ['Me first!', 'Sorry, go ahead.', 'Shh.', 'Wait.'],
            correct: 1,
            why: '**Sorry, go ahead.** Người kia thường sẽ đáp "No, you go." và bạn nói tiếp.',
          },
          {
            q: 'Bạn đang du lịch ở Úc và thấy một người ngất trên phố. Số cần gọi:',
            options: ['911', '999', '000', '115'],
            correct: 2,
            why: 'Úc: **000** ("triple-zero"). 112 cũng gọi được từ di động. 911 là Mỹ, Canada; 999 là Anh; 115 là cấp cứu ở Việt Nam.',
          },
          {
            q: 'Tổng đài hỏi "Emergency, which service?" Bạn trả lời:',
            options: ['Hello, my name is Nam, I am from Vietnam and…', 'Ambulance, please.', 'I need help with many things.', 'Can you speak Vietnamese?'],
            correct: 1,
            why: 'Trả lời **đúng câu được hỏi**, ngắn: **Ambulance / Police / Fire, please.** Giới thiệu bản thân để sau.',
          },
          {
            q: 'Bạn không biết số nhà khi gọi cấp cứu. Câu tốt nhất:',
            options: ["I don't know where I am.", "I'm not sure of the number. We're on King Street, outside a bank, opposite a big church.", 'Somewhere in the city.', 'Please find me.'],
            correct: 1,
            why: 'Tên phố + **outside** (mốc trước mặt) + **opposite** (mốc đối diện). Xe cứu thương tìm được.',
          },
          {
            q: '(Ôn Ngày 26) Đang kể chuyện thì bị cắt ngang để hỏi giờ. Trả lời xong, bạn quay lại câu chuyện:',
            options: ['Anyway, as I was saying, the bus never came.', 'Finish. The bus never came.', 'Again: the bus never came.', 'By the way, the bus never came.'],
            correct: 0,
            why: '**Anyway, as I was saying, …** = quay lại mạch chuyện. **By the way** dùng để **mở** chuyện mới, không phải quay lại.',
          },
          {
            q: '(Ôn Ngày 27) Kể chuyện: lúc tới văn phòng thì bạn mới nhận ra ví đã biến mất từ trước đó. Câu đúng:',
            options: ['When I got to the office, my wallet disappeared.', 'When I got to the office, I realised my wallet had disappeared.', 'When I got to the office, my wallet has disappeared.', 'When I had got to the office, my wallet disappeared.'],
            correct: 1,
            why: 'Việc xảy ra **trước** một mốc quá khứ dùng **had + V3** (quá khứ hoàn thành). Ví mất trước, bạn nhận ra sau.',
          },
          {
            q: '(Ôn Ngày 28) Sếp mới hỏi dạo này bạn làm gì. Câu tự nhiên:',
            options: ["I've been helping the team plan Charity Week, and I'm hoping to run the food stall.", 'I help the team plan Charity Week since one month.', 'I am helping since one month.', 'I have help the team.'],
            correct: 0,
            why: '**I\'ve been + V-ing** cho việc bắt đầu từ trước và còn đang làm; **I\'m hoping to + V** cho mục tiêu gần.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd29-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'finish · meant · need · asking · thing · jumped · turned · been',
        items: [
          { q: 'Sorry, can I just ___? I only have one more point.', answers: ['finish'] },
          { q: 'What I ___ was that the food would be free, not the tickets.', answers: ['meant'] },
          { q: 'What you ___ right now is to sit down and drink some water.', answers: ['need'] },
          { q: "All I'm ___ is for you to let me explain.", answers: ['asking'] },
          { q: "The ___ is, I don't know the house number.", answers: ['thing'] },
          { q: 'Sorry, I ___ the gun. I thought you meant this Friday.', answers: ['jumped'] },
          { q: "Good news: my phone has ___ up! Someone handed it in.", answers: ['turned'] },
          { q: "There's ___ an accident outside the station.", answers: ['been'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd29-bt-dich',
        title: 'Phần III — Dịch (6 câu)',
        kind: 'translate',
        grammar: "Sorry, can I just finish? · What I meant was… · Just to check, … · There's been an accident · I'd like to report… · We're outside…",
        items: [
          { q: 'Xin lỗi, cho mình chen một câu được không?', hint: 'Can I just, jump in', answers: ['Can I just jump in here?', 'Sorry, can I just jump in here?', 'Can I just jump in?', 'Sorry, can I just jump in?', 'Sorry to cut in, but can I say something?'] },
          { q: 'Hình như hai bên đang nói về hai chuyện khác nhau.', hint: "I think, we're talking about", answers: ["I think we're talking about two different things.", 'I think we are talking about two different things.', "I think we're talking about different things."] },
          { q: 'Có tai nạn. Một người đàn ông bị đập đầu.', hint: "There's been, has hit his head", answers: ["There's been an accident. A man has hit his head.", 'There has been an accident. A man has hit his head.', "There's been an accident. A man's hit his head.", "There's been an accident. A man hit his head."] },
          { q: 'Tôi muốn trình báo bị mất cắp ví.', hint: "I'd like to report, stolen", answers: ["I'd like to report a stolen wallet.", 'I would like to report a stolen wallet.', "I'd like to report that my wallet has been stolen.", "I'd like to report that my wallet was stolen."] },
          { q: 'Chúng tôi đang ở trước một hiệu thuốc, đối diện ngân hàng.', hint: "We're outside, opposite / across the road from", answers: ["We're outside a pharmacy, opposite the bank.", "We're outside a pharmacy, across the road from the bank.", 'We are outside a pharmacy, opposite the bank.', "We're outside a pharmacy, opposite a bank.", "We're outside a pharmacy, across the road from a bank.", "We're in front of a pharmacy, opposite the bank."] },
          { q: 'Tiếng Anh không phải tiếng mẹ đẻ của tôi. Xin nói chậm.', hint: "isn't my first language, please speak slowly", answers: ["English isn't my first language. Please speak slowly.", 'English is not my first language. Please speak slowly.', "English isn't my first language. Could you speak slowly, please?", "English isn't my first language. Please speak more slowly."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và gõ lại' },
      {
        t: 'dictation',
        id: 'gtd29-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1', spell: "I think we're talking about two different things.", answer: "I think we're talking about two different things.", alt: ['I think we are talking about two different things.'] },
          { label: 'Câu 2', spell: "Don't move him unless he's in danger.", answer: "Don't move him unless he's in danger.", alt: ['Do not move him unless he is in danger.', "Don't move him unless he is in danger."] },
          { label: 'Câu 3', spell: 'Trams are not running until further notice.', answer: 'Trams are not running until further notice.', alt: ["Trams aren't running until further notice."] },
          { label: 'Câu 4', spell: 'Could I have a reference number, please?', answer: 'Could I have a reference number, please?', alt: ['Could I have a reference number please?'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd29-bt-ghep',
        title: 'Phần V — Ghép câu (4 câu)',
        items: [
          { vi: 'Ý mình là nguyên liệu sẽ miễn phí.', chips: ['What', 'I', 'meant', 'was', 'that', 'the', 'ingredients', 'would', 'be', 'free.', 'meaning', 'is'], answer: ['What', 'I', 'meant', 'was', 'that', 'the', 'ingredients', 'would', 'be', 'free.'], alt: [['What', 'I', 'meant', 'was', 'the', 'ingredients', 'would', 'be', 'free.']] },
          { vi: 'Ông ấy còn tỉnh và còn thở, nhưng có vẻ lơ mơ.', chips: ["He's", 'awake', 'and', 'breathing,', 'but', 'he', 'seems', 'confused.', 'is', 'confusing'], answer: ["He's", 'awake', 'and', 'breathing,', 'but', 'he', 'seems', 'confused.'] },
          { vi: 'Hộ chiếu của tôi bị mất rồi.', chips: ['My', "passport's", 'gone', 'missing.', 'was', 'lost', 'is'], answer: ['My', "passport's", 'gone', 'missing.'] },
          { vi: 'Đừng cho ông ấy ăn uống gì.', chips: ["Don't", 'give', 'him', 'anything', 'to', 'eat', 'or', 'drink.', 'something', 'no'], answer: ["Don't", 'give', 'him', 'anything', 'to', 'eat', 'or', 'drink.'] },
        ],
      },
      {
        t: 'note',
        title: 'Tự kiểm sau bài tập',
        items: [
          'Đọc to **không nhìn**: ba câu gọi cấp cứu (Ambulance, please. · We\'re on…, outside… · There\'s been an accident…) và số khẩn cấp của **Anh, Mỹ, Úc, EU, Việt Nam**.',
          'Ghi âm **30 giây**: bạn đang nói thì bị cắt lời; bạn giữ lượt, rồi gỡ một hiểu lầm bằng **What I meant was…**. Nghe lại: giọng có gắt không, có nhấn đúng MEANT không?',
        ],
      },
    ],
  },
];
