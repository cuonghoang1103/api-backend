/**
 * Tiếng Anh giao tiếp — NGÀY 21 (chặng 4 "Giao tiếp sâu", B1+ → B2): phàn nàn & giải quyết — khách sạn, giao hàng, dịch vụ.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd21-`.
 * Ngữ pháp trong câu: tường thuật đơn giản (I was told (that)… · They said… · lùi thì will → would, is → was, can → could)
 * · should have / shouldn't have + V3 (trách, tiếc, việc lẽ ra đã xong) · nối câu bằng `even though`, `in the meantime`.
 * Cảnh: Châu — sinh viên IT năm 3 đang OJT — được công ty cử sang Vancouver (Canada) hai tuần học khoá đào tạo ở văn phòng
 * khách hàng (Larchmont Systems): phòng khách sạn "yên tĩnh" nằm sát công trường (nhân viên ca sáng chỉ đưa nút tai ⇒ xin gặp
 * quản lý trực ca, được đổi phòng + bớt một đêm + bữa sáng); đôi ủng đặt mạng báo "đã giao" mà ảnh giao hàng là một cửa gỗ đỏ
 * (đòi cửa hàng tự lo với hãng chuyển phát, được gửi lại hàng nhanh miễn phí); rồi BỊ phàn nàn: áo hoodie in tên cả lớp do
 * Châu gom tiền đặt bị in sai tên Leah và Mitch trả nhiều hơn mà không ai báo. Bài đọc: email đòi khoản hoàn tiền chưa về,
 * thư trả lời mẫu né tránh, thư nhắc lại, thư trả lời đúng cách.
 * Khác Ngày 4 (phàn nàn nhẹ ở nhà hàng) và Ngày 5 (đổi trả ở quầy): hôm nay là LEO THANG, ĐÒI BỒI THƯỜNG, VIẾT KHIẾU NẠI,
 * và đứng ở phía BỊ phàn nàn. Khác podcast en-ds-b1-01 (sai món, súp nguội, ưu đãi đồ uống), en-ds-b1-03 (vali kẹt ở
 * Singapore, hải quan) và en-ds-b2-02 (hàng xóm phàn nàn tiếng nhạc).
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_21: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd21-nghe',
    kind: 'listening',
    title: 'Phàn nàn & giải quyết: khách sạn, giao hàng, dịch vụ',
    goal: 'Nghe hiểu ba cảnh phàn nàn thật: ở quầy lễ tân khách sạn, qua điện thoại với cửa hàng online, và khi chính mình bị phàn nàn; nhận ra lúc nào nhân viên đang "né", lúc nào cần xin gặp người có quyền quyết.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, cần làm được gì',
        items: [
          'Ngày 4 bạn đã phàn nàn **nhẹ** ở nhà hàng, Ngày 5 đổi trả ở quầy. Hôm nay sâu hơn: chuyện **không được giải quyết ở lần nói đầu**, phải **leo thang**, **đòi bù** cho thiệt hại và **xin xác nhận bằng chữ**.',
          'Bạn theo **Châu**, sinh viên IT năm 3 đang OJT, được công ty cử sang **Vancouver (Canada)** hai tuần học khoá đào tạo ở văn phòng khách hàng.',
          'Cảnh 3 lật ngược vai: **Châu bị phàn nàn**. Biết cách đón lời phàn nàn cũng quan trọng như biết phàn nàn.',
          'Ngày 19–20 bạn nghe ở tốc độ khoảng **160 từ/phút**, hôm nay giữ mức đó. Câu dễ không còn dịch. Để ý câu **I was told that…** và **should have…**: đó là hai "vũ khí" chính của người phàn nàn.',
          'Nghe mỗi cảnh **2 lần**. Lần 1 ghi ra giấy: **vấn đề là gì · khách muốn gì · cuối cùng được gì**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Quầy lễ tân, 7 giờ 20 sáng: "phòng yên tĩnh" cạnh công trường' },
      {
        t: 'canh',
        anh: ['hotel', 'building-construction', 'alarm-clock', 'bellhop-bell', 'woman-office-worker'],
        caption: 'Sáng thứ Hai ở **khách sạn Cedarline**, Vancouver. Châu đặt phòng **"yên tĩnh"** cho hai tuần học. Đúng 7 giờ, máy khoan ở công trường ngay ngoài cửa sổ bắt đầu chạy. Châu xuống quầy gặp **Trevor**, nhân viên ca sáng.',
      },
      {
        t: 'listen',
        id: 'gtd21-nghe-canh1',
        title: 'Scene 1 — At the front desk',
        note: 'Nghe xem Trevor đưa ra những gì, vì sao Châu không nhận, và quản lý trực ca Anjali cuối cùng đồng ý những gì.',
        lines: [
          { who: 'Trevor', voice: 'ca-nam', text: 'Good morning. How can I help you?' },
          { who: 'Châu', voice: 'us-nu', text: "Morning. I'm in room 1408, and I'm afraid I need to make a complaint about my room.", vi: 'Chào anh. Tôi ở phòng 1408, và tôi e là tôi phải phàn nàn về phòng của mình.' },
          { who: 'Trevor', voice: 'ca-nam', text: "I'm sorry to hear that. What seems to be the problem?" },
          { who: 'Châu', voice: 'us-nu', text: "There's a construction site right outside my window. The drilling started at seven, and honestly, it sounds like it's inside the room.", vi: 'Có một công trường ngay ngoài cửa sổ phòng tôi. Máy khoan chạy từ bảy giờ, và thật lòng mà nói, nghe như nó ở ngay trong phòng.' },
          { who: 'Trevor', voice: 'ca-nam', text: "Ah, yes, that's the site next door. It's not actually part of the hotel, so unfortunately there isn't much we can do about it.", vi: 'À vâng, đó là công trường bên cạnh. Nó không thuộc khách sạn, nên tiếc là chúng tôi không làm được gì nhiều.' },
          { who: 'Châu', voice: 'us-nu', text: "I understand it's not your building. But when I booked, I was told that the work wouldn't affect guests. I specifically asked for a quiet room, because I'm here for a two-week course and I need to sleep.", vi: 'Tôi hiểu đó không phải toà nhà của khách sạn. Nhưng lúc đặt phòng, tôi được bảo là công trình sẽ không ảnh hưởng tới khách. Tôi đã yêu cầu rõ một phòng yên tĩnh, vì tôi ở đây học hai tuần và tôi cần ngủ.' },
          { who: 'Trevor', voice: 'ca-nam', text: 'I can offer you some earplugs. A lot of guests find they help.', vi: 'Tôi có thể đưa chị nút bịt tai. Nhiều khách thấy cũng đỡ.' },
          { who: 'Châu', voice: 'us-nu', text: "That's kind of you, but earplugs aren't really a solution for two weeks. I'd like to move to a room on the other side of the building, please.", vi: 'Anh tử tế quá, nhưng nút bịt tai không thật sự giải quyết được chuyện hai tuần. Tôi muốn chuyển sang một phòng ở phía bên kia toà nhà.' },
          { who: 'Trevor', voice: 'ca-nam', text: "Let me check… I'm afraid we're fully booked tonight. There's a big conference in town this week.", vi: 'Để tôi xem… Tôi e là tối nay hết phòng rồi. Tuần này thành phố có một hội nghị lớn.' },
          { who: 'Châu', voice: 'us-nu', text: "In that case, could I speak to the duty manager, please? I'm not trying to make things difficult for you. I just think this needs someone who can make a decision.", vi: 'Vậy thì cho tôi gặp quản lý trực ca được không? Tôi không cố làm khó anh đâu. Tôi chỉ nghĩ chuyện này cần một người có quyền quyết định.' },
          { who: 'Trevor', voice: 'ca-nam', text: 'Of course. Bear with me one moment.', vi: 'Tất nhiên. Chị đợi tôi một chút.' },
          { who: 'Anjali', voice: 'ca-nu', text: "Good morning, I'm Anjali, the duty manager. Trevor's filled me in. I'm really sorry about the noise. You should have been told about the work when you checked in.", vi: 'Chào chị, tôi là Anjali, quản lý trực ca. Trevor đã kể tôi nghe rồi. Tôi thật sự xin lỗi về tiếng ồn. Lẽ ra chị phải được báo về công trình lúc nhận phòng.' },
          { who: 'Châu', voice: 'us-nu', text: "Thank you. The confirmation email even says 'quiet room guaranteed'. I've got it here on my phone.", vi: 'Cảm ơn chị. Email xác nhận còn ghi "đảm bảo phòng yên tĩnh". Tôi có nó trong điện thoại đây.' },
          { who: 'Anjali', voice: 'ca-nu', text: "I don't doubt it. So here's what I can do. A room on the ninth floor, facing the harbour, is being cleaned right now. You can move in by noon.", vi: 'Tôi tin chị. Vậy tôi làm được thế này. Một phòng ở tầng chín, nhìn ra cảng, đang được dọn. Chị chuyển vào trước trưa được.' },
          { who: 'Châu', voice: 'us-nu', text: "That would be great. And what about last night? I paid for a quiet room and didn't get one.", vi: 'Thế thì tuyệt. Còn đêm qua thì sao? Tôi đã trả tiền cho một phòng yên tĩnh mà không được như vậy.' },
          { who: 'Anjali', voice: 'ca-nu', text: "That's fair. I'll take last night off your bill, and breakfast is on us for the rest of your stay.", vi: 'Chị nói đúng. Tôi sẽ trừ tiền đêm qua khỏi hoá đơn, và bữa sáng những ngày còn lại khách sạn mời.' },
          { who: 'Châu', voice: 'us-nu', text: 'I appreciate that. Could you put it in an email, so I have it in writing?', vi: 'Tôi cảm kích lắm. Chị gửi giúp tôi một email để tôi có xác nhận bằng văn bản được không?' },
          { who: 'Anjali', voice: 'ca-nu', text: "Absolutely. You'll have it within the hour. And again, I'm sorry your stay started like this." },
          { who: 'Châu', voice: 'us-nu', text: 'Thanks for sorting it out so quickly.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd21-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Trevor đưa ra giải pháp gì đầu tiên?',
            options: ['Đổi sang phòng khác ngay', 'Nút bịt tai', 'Giảm giá một đêm', 'Bữa sáng miễn phí'],
            correct: 1,
            why: '"I can offer you some **earplugs**." Đây là giải pháp nhỏ nhất nhân viên ca sáng được phép đưa. Đổi phòng, trừ tiền và bữa sáng là do **quản lý trực ca** quyết.',
          },
          {
            q: 'Châu dựa vào điều gì để nói mình có lý?',
            options: [
              'Châu là khách quen của khách sạn',
              'Lúc đặt phòng, Châu được bảo công trình không ảnh hưởng tới khách, và email xác nhận ghi "quiet room guaranteed"',
              'Châu dọa viết đánh giá xấu trên mạng',
              'Công ty của Châu trả tiền phòng',
            ],
            correct: 1,
            why: 'Hai bằng chứng: "**I was told that** the work wouldn\'t affect guests" và email ghi "**quiet room guaranteed**". Phàn nàn có bằng chứng thì người kia khó né.',
          },
          {
            q: 'Vì sao Châu xin gặp quản lý trực ca?',
            options: [
              'Vì Trevor bất lịch sự',
              'Vì Trevor không có quyền giải quyết thêm, khách sạn lại hết phòng',
              'Vì Châu muốn khiếu nại Trevor',
              'Vì Trevor không nói được tiếng Anh',
            ],
            correct: 1,
            why: 'Châu nói rõ: "I\'m not trying to make things difficult for you. I just think this needs **someone who can make a decision**." Xin gặp cấp trên mà không đổ lỗi cho nhân viên đang đứng trước mặt.',
          },
          {
            q: 'Cuối cùng Châu được những gì?',
            options: [
              'Chỉ được đổi phòng',
              'Đổi phòng tầng chín, trừ tiền đêm đầu, bữa sáng miễn phí, và email xác nhận',
              'Hoàn tiền cả hai tuần',
              'Không được gì, phải tự tìm khách sạn khác',
            ],
            correct: 1,
            why: 'Phòng tầng chín nhìn ra cảng · "I\'ll take **last night off your bill**" · "breakfast is **on us**" · và Châu xin "**put it in an email**".',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Gọi cửa hàng: "đã giao" mà không thấy hàng' },
      {
        t: 'canh',
        anh: ['package', 'mobile-phone', 'door', 'delivery-truck', 'woman-raising-hand'],
        caption: 'Thứ Năm. Châu đặt một đôi **ủng chống nước** ở cửa hàng online **Northgate Outfitters** để đi bộ đường dài thứ Bảy. Trang theo dõi báo **đã giao chiều thứ Ba**, nhưng lễ tân nói không có gói nào cho Châu. Châu gọi tổng đài, gặp **Kyle**.',
      },
      {
        t: 'listen',
        id: 'gtd21-nghe-canh2',
        title: 'Scene 2 — Calling customer service',
        note: 'Nghe xem bằng chứng nào cho thấy hàng giao nhầm, "quy trình chuẩn" của Kyle là gì, và vì sao cuối cùng Kyle đổi ý.',
        lines: [
          { who: 'Kyle', voice: 'us-nam', text: "Thanks for calling Northgate Outfitters, this is Kyle. Can I get your order number, please?" },
          { who: 'Châu', voice: 'us-nu', text: "Hi, Kyle. It's N-G-4-7-0-9-1-3.", vi: 'Chào Kyle. Mã đơn là N-G-4-7-0-9-1-3.' },
          { who: 'Kyle', voice: 'us-nam', text: "Thank you. Okay, I've got a pair of waterproof hiking boots, size seven, shipped to the Cedarline Hotel. It shows as delivered on Tuesday at 2:14 p.m.", vi: 'Cảm ơn chị. Tôi thấy một đôi ủng đi bộ chống nước, cỡ bảy, gửi tới khách sạn Cedarline. Hệ thống báo đã giao lúc 2 giờ 14 chiều thứ Ba.' },
          { who: 'Châu', voice: 'us-nu', text: "That's the problem. It says delivered, but I never got it. I've asked at reception twice, and I was told that nothing came for me.", vi: 'Chuyện là vậy. Nó báo đã giao, nhưng tôi chưa hề nhận. Tôi đã hỏi lễ tân hai lần, và họ bảo không có gì gửi cho tôi cả.' },
          { who: 'Kyle', voice: 'us-nam', text: 'Okay. Sometimes packages get left with a neighbor or in a mail room, so could you maybe check with—', vi: 'Vâng. Đôi khi gói hàng được để ở nhà bên cạnh hoặc phòng nhận thư, nên chị có thể kiểm tra với—' },
          { who: 'Châu', voice: 'us-nu', text: "Sorry to cut in, but I've already done that. And there's a delivery photo on the tracking page. It shows a red wooden door. The hotel has glass doors. It went to the wrong address.", vi: 'Xin lỗi ngắt lời anh, nhưng tôi làm việc đó rồi. Và trên trang theo dõi có ảnh giao hàng. Ảnh chụp một cánh cửa gỗ màu đỏ. Khách sạn thì cửa kính. Hàng đã giao nhầm địa chỉ.' },
          { who: 'Kyle', voice: 'us-nam', text: "I see what you mean. In that case, the next step is to open a claim with the carrier. That usually takes five to seven business days.", vi: 'Tôi hiểu ý chị. Vậy thì bước tiếp theo là mở yêu cầu bồi thường với hãng chuyển phát. Việc đó thường mất năm tới bảy ngày làm việc.' },
          { who: 'Châu', voice: 'us-nu', text: "Five to seven business days? I'm only in Vancouver for another nine days, and I bought the boots for a hike this Saturday.", vi: 'Năm tới bảy ngày làm việc? Tôi chỉ còn ở Vancouver chín ngày nữa, và tôi mua đôi ủng cho chuyến đi bộ thứ Bảy này.' },
          { who: 'Kyle', voice: 'us-nam', text: "I totally understand. Unfortunately, that's our standard process." },
          { who: 'Châu', voice: 'us-nu', text: "I appreciate it's not your fault personally. But I bought the boots from Northgate, not from the courier. I think it's fair to expect you to sort it out with them, not me.", vi: 'Tôi hiểu đây không phải lỗi của riêng anh. Nhưng tôi mua ủng của Northgate chứ không mua của hãng chuyển phát. Tôi nghĩ việc mong cửa hàng tự làm việc với họ, chứ không phải tôi, là hợp lý.' },
          { who: 'Kyle', voice: 'us-nam', text: "That's a fair point. Let me talk to my supervisor. Do you mind holding for a couple of minutes?", vi: 'Chị nói có lý. Để tôi hỏi cấp trên. Chị giữ máy vài phút có phiền không?' },
          { who: 'Châu', voice: 'us-nu', text: 'Not at all.' },
          { who: 'Kyle', voice: 'us-nam', text: "Thanks for holding. So, here's what we can do. We'll ship a new pair today by express, at no extra cost, and we'll handle the claim on our end.", vi: 'Cảm ơn chị đã chờ. Chúng tôi làm thế này: hôm nay gửi một đôi mới bằng chuyển phát nhanh, không tính thêm phí, còn yêu cầu bồi thường thì phía chúng tôi tự lo.' },
          { who: 'Châu', voice: 'us-nu', text: "That sounds good. When should they arrive?" },
          { who: 'Kyle', voice: 'us-nam', text: "They should get to you by Friday. If they haven't arrived by then, just reply to the confirmation email and we'll refund you in full.", vi: 'Chậm nhất thứ Sáu chị sẽ nhận được. Nếu tới lúc đó chưa có, chị chỉ cần trả lời email xác nhận và chúng tôi sẽ hoàn tiền toàn bộ.' },
          { who: 'Châu', voice: 'us-nu', text: 'Great. Could I have a reference number for this call?' },
          { who: 'Kyle', voice: 'us-nam', text: "Sure. It's C as in Charlie, R as in Romeo, five-five-zero-one-eight.", vi: 'Vâng. C như Charlie, R như Romeo, năm-năm-không-một-tám.' },
          { who: 'Châu', voice: 'us-nu', text: "C-R-5-5-0-1-8. Thanks, Kyle. You've been really helpful." },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd21-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Bằng chứng nào cho thấy hàng bị giao nhầm?',
            options: ['Lễ tân thấy người giao hàng đi nhầm', 'Ảnh giao hàng chụp một cửa gỗ đỏ, còn khách sạn cửa kính', 'Mã đơn bị in sai', 'Kyle tự nhận là giao nhầm'],
            correct: 1,
            why: '"It shows a **red wooden door**. The hotel has **glass doors**." Ảnh giao hàng trên trang theo dõi là bằng chứng mạnh nhất, nên luôn mở xem trước khi gọi.',
          },
          {
            q: '"That\'s our standard process" — Kyle thật ra đang nói gì?',
            options: ['Tôi đã giải quyết xong', 'Tôi chỉ được làm theo kịch bản, không tự quyết thêm được', 'Chị đang sai', 'Hãy gọi lại sau'],
            correct: 1,
            why: 'Câu này là dấu hiệu nhân viên **hết quyền**. Cãi tiếp với họ vô ích. Châu đưa ra một lý lẽ mới (mua của cửa hàng chứ không mua của hãng chuyển phát), và Kyle tự xin ý kiến **supervisor**.',
          },
          {
            q: 'Nếu tới thứ Sáu ủng chưa tới thì sao?',
            options: ['Châu phải tự mở yêu cầu với hãng chuyển phát', 'Châu trả lời email xác nhận và được hoàn tiền toàn bộ', 'Cửa hàng gửi thêm một đôi nữa', 'Châu mất tiền'],
            correct: 1,
            why: '"If they haven\'t arrived by then, just **reply to the confirmation email** and we\'ll **refund you in full**."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Giờ giải lao: lần này Châu bị phàn nàn' },
      {
        t: 'canh',
        anh: ['woman-student', 'label', 'dollar-banknote', 'speech-balloon', 'man-frowning'],
        caption: 'Thứ Năm tuần hai. Châu nhận gom tiền và đặt **áo hoodie in tên** cho cả lớp đào tạo ở tiệm in **Inkhouse**. Áo vừa về. **Leah** (người Ireland) và **Mitch** (người Úc) có chuyện muốn nói.',
      },
      {
        t: 'listen',
        id: 'gtd21-nghe-canh3',
        title: 'Scene 3 — On the receiving end',
        note: 'Nghe xem Leah và Mitch phàn nàn chuyện gì, Châu nhận lỗi phần nào, phần nào không phải lỗi của mình, và hứa làm gì.',
        lines: [
          { who: 'Leah', voice: 'ie-nu', text: "Châu, have you got a sec? It's about the hoodies.", vi: 'Châu ơi, rảnh một chút không? Chuyện áo hoodie.' },
          { who: 'Châu', voice: 'us-nu', text: 'Sure. Is something wrong?' },
          { who: 'Leah', voice: 'ie-nu', text: "Well, I love the colour, but they've spelt my name without the H. And I asked for a small, and this is a medium.", vi: 'À, mình thích màu lắm, nhưng họ viết tên mình thiếu chữ H. Mà mình đặt cỡ S, cái này là cỡ M.' },
          { who: 'Châu', voice: 'us-nu', text: "Oh no. Let me see… You're right. I'm really sorry, Leah.", vi: 'Ôi không. Để mình xem… Cậu nói đúng. Mình xin lỗi nhé, Leah.' },
          { who: 'Leah', voice: 'ie-nu', text: "Ah, it's not the end of the world. I just wanted to tell you before you pay the shop the rest.", vi: 'Ôi, có gì to tát đâu. Mình chỉ muốn báo cậu trước khi cậu trả nốt tiền cho tiệm.' },
          { who: 'Châu', voice: 'us-nu', text: "Thanks for telling me. Actually, the name might be my fault. I typed up the list from everyone's messages, and I should have double-checked it with you all before I sent it.", vi: 'Cảm ơn cậu đã nói. Thật ra tên thì có thể là lỗi của mình. Mình gõ danh sách từ tin nhắn của mọi người, và lẽ ra mình phải gửi cả nhóm kiểm lại trước khi gửi tiệm.' },
          { who: 'Leah', voice: 'ie-nu', text: 'These things happen. What about the size?' },
          { who: 'Châu', voice: 'us-nu', text: "The order form says small, so that one's on the shop. I'll call them at lunch and ask them to reprint yours. They told me reprints usually take two days.", vi: 'Phiếu đặt ghi cỡ S, nên cái đó là lỗi của tiệm. Trưa nay mình gọi họ in lại áo của cậu. Họ bảo mình in lại thường mất hai ngày.' },
          { who: 'Leah', voice: 'ie-nu', text: 'Grand. Honestly, no rush.', vi: 'Được rồi. Thật đấy, không vội đâu.' },
          { who: 'Mitch', voice: 'au-nam', text: "While we're on the subject of hoodies… can I ask why I paid forty-five and everyone else paid forty?", vi: 'Nhân tiện nói chuyện áo… cho tôi hỏi sao tôi trả bốn lăm còn mọi người trả bốn mươi?' },
          { who: 'Châu', voice: 'us-nu', text: 'Sure. You joined the order on Monday, after the first batch had gone to print. The shop said late additions cost five dollars more.', vi: 'Ừ. Cậu đăng ký hôm thứ Hai, sau khi đợt đầu đã đem in. Tiệm bảo đặt thêm muộn thì tính thêm năm đô.' },
          { who: 'Mitch', voice: 'au-nam', text: "Right, but nobody told me that. You should have mentioned it before you took my money.", vi: 'Ừ, nhưng có ai nói với tôi đâu. Lẽ ra cậu phải nói trước khi lấy tiền của tôi chứ.' },
          { who: 'Châu', voice: 'us-nu', text: "That's fair. I should have mentioned it, and I'm sorry I didn't. I can show you the shop's message, if that helps.", vi: 'Cậu nói đúng. Lẽ ra mình phải nói, và mình xin lỗi vì đã không nói. Mình có thể cho cậu xem tin nhắn của tiệm, nếu cần.' },
          { who: 'Mitch', voice: 'au-nam', text: "Nah, I believe you. It's not about the five bucks, mate. It's the principle.", vi: 'Thôi, tôi tin cậu. Không phải vì năm đô đâu. Là vì nguyên tắc.' },
          { who: 'Châu', voice: 'us-nu', text: "I get that. So here's my plan: I'll ask the shop to drop the late fee, since they got Leah's size wrong. If they won't, I'll pay you the five dollars back myself.", vi: 'Mình hiểu. Vậy mình tính thế này: mình sẽ xin tiệm bỏ phí đặt muộn, vì họ đã làm sai cỡ áo của Leah. Nếu họ không chịu, mình tự trả lại cậu năm đô.' },
          { who: 'Mitch', voice: 'au-nam', text: "You don't have to do that." },
          { who: 'Châu', voice: 'us-nu', text: "I want to. It was my job to keep everyone in the loop. I'll post an update in the group chat this afternoon, so everyone knows what's going on.", vi: 'Mình muốn thế. Việc của mình là báo cho mọi người nắm tình hình. Chiều nay mình sẽ cập nhật trong nhóm chat để ai cũng biết chuyện gì đang diễn ra.' },
          { who: 'Mitch', voice: 'au-nam', text: "Fair enough. Cheers, Châu. And sorry if I sounded a bit grumpy in the chat.", vi: 'Được thôi. Cảm ơn nhé, Châu. Và xin lỗi nếu lúc nãy trong nhóm chat tôi nghe hơi cáu.' },
          { who: 'Châu', voice: 'us-nu', text: 'Don\'t worry about it. Thanks for being straight with me.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd21-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Châu nhận lỗi phần nào?',
            options: ['Cả tên lẫn cỡ áo', 'Tên viết sai, vì Châu không gửi danh sách cho mọi người kiểm lại', 'Cỡ áo sai, vì Châu ghi nhầm', 'Không nhận lỗi gì, đổ hết cho tiệm'],
            correct: 1,
            why: '"The name might be **my fault**… I **should have double-checked** it." Còn cỡ áo: "The order form says small, so **that one\'s on the shop**." Nhận đúng phần của mình, không nhận thay phần người khác.',
          },
          {
            q: 'Mitch bực vì điều gì nhất?',
            options: ['Vì mất năm đô', 'Vì không ai báo trước khoản phí đặt muộn', 'Vì áo xấu', 'Vì Châu trả lời chậm'],
            correct: 1,
            why: '"**Nobody told me that**… It\'s not about the five bucks. **It\'s the principle.**" Bực vì không được báo trước, không phải vì số tiền.',
          },
          {
            q: 'Châu hứa làm gì?',
            options: [
              'Hoàn tiền cho cả lớp',
              'Xin tiệm bỏ phí đặt muộn; nếu không được thì tự trả Mitch năm đô; chiều nay cập nhật trong nhóm chat',
              'Đặt lại toàn bộ áo',
              'Nhờ Leah gọi cho tiệm',
            ],
            correct: 1,
            why: 'Một kế hoạch có **bước cụ thể**, có **phương án dự phòng** ("If they won\'t, I\'ll…") và có **hẹn giờ báo lại** ("this afternoon"). Đó là cách trả lời lời phàn nàn khiến người ta hết giận.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Hôm nay nhiều câu tường thuật và **should have**. Khi nói nhanh, "should have" chỉ còn **"should-ơv"** /ʃʊdəv/, "I was told" dính thành **"ai-wơz-tâul"**. Gõ lại đủ từ; viết hoa, dấu chấm không tính.',
      },
      {
        t: 'dictation',
        id: 'gtd21-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — kể lại điều được hứa', spell: "I was told that the work wouldn't affect guests.", answer: "I was told that the work wouldn't affect guests.", alt: ['I was told that the work would not affect guests.'] },
          { label: 'Câu 2 — xin gặp cấp trên', spell: 'Could I speak to the duty manager, please?', answer: 'Could I speak to the duty manager, please?', alt: ['Could I speak to the duty manager please'] },
          { label: 'Câu 3 — quản lý nhận lỗi', spell: 'You should have been told about the work when you checked in.', answer: 'You should have been told about the work when you checked in.', alt: ["You should've been told about the work when you checked in."] },
          { label: 'Câu 4 — xin xác nhận bằng chữ', spell: 'Could you put it in an email, so I have it in writing?', answer: 'Could you put it in an email, so I have it in writing?', alt: ['Could you put it in an email so I have it in writing?'] },
          { label: 'Câu 5 — nhân viên hết quyền', spell: "Unfortunately, that's our standard process.", answer: "Unfortunately, that's our standard process.", alt: ['Unfortunately, that is our standard process.'] },
          { label: 'Câu 6 — tự nhận lỗi', spell: 'I should have double-checked it with you all.', answer: 'I should have double-checked it with you all.', alt: ["I should've double-checked it with you all.", 'I should have double checked it with you all.'] },
          { label: 'Câu 7 — bực vì nguyên tắc', spell: "It's not about the five bucks. It's the principle.", answer: "It's not about the five bucks. It's the principle.", alt: ["It's not about the 5 bucks. It's the principle.", 'It is not about the five bucks. It is the principle.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn làm gì'],
        rows: [
          ["There isn't much we can do about it.", 'Tôi không muốn (hoặc không được phép) làm gì thêm.', 'Đưa bằng chứng, nói điều bạn **được hứa** (I was told…).'],
          ['I can offer you some earplugs.', 'Giải pháp nhỏ nhất họ có. Thường là bước một của kịch bản.', 'Cảm ơn, nói rõ vì sao chưa đủ, nêu điều bạn muốn.'],
          ["That's our standard process.", 'Tôi hết quyền.', 'Đừng cãi tiếp. Xin gặp **supervisor / manager**.'],
          ['Bear with me one moment.', 'Chờ tôi một chút (lịch sự).', 'Chờ. Đây là dấu hiệu tốt.'],
          ["Trevor's filled me in.", 'Trevor đã kể tôi nghe rồi. Bạn không phải kể lại từ đầu.', 'Đi thẳng vào điều bạn muốn.'],
          ['Breakfast is on us.', 'Bữa sáng chúng tôi mời (miễn phí).', 'Cảm ơn, và xin ghi lại bằng email.'],
          ["It's not the end of the world.", 'Chuyện nhỏ, nhưng vẫn mong được sửa.', 'Vẫn xin lỗi và vẫn sửa. Đừng coi là "không sao".'],
          ["It's the principle.", 'Tôi bực vì chuyện công bằng, không vì tiền.', 'Nhận lỗi phần "không báo trước", đừng giải thích về số tiền.'],
          ['Thanks for being straight with me.', 'Cảm ơn vì đã nói thật, không vòng vo.', '(Câu khen. Hai bên đã hết giận.)'],
        ],
        caption: 'Ba câu đầu là **câu né** quen thuộc của nhân viên tuyến đầu. Nghe ra chúng là biết lúc nào nên lên một bậc.',
      },
      {
        t: 'note',
        title: 'Mẹo: tổng đài nói nhanh theo kịch bản, không nghe kịp thì làm gì',
        items: [
          'Nói ngay từ đầu: **"Sorry, could you slow down a little? I\'m writing this down."** Ai cũng chậm lại khi biết bạn đang ghi.',
          'Nghe xong một đề xuất, **nhắc lại tóm tắt**: "So, just to confirm: you\'ll send a new pair today, by express, and they should arrive by Friday?" Sai chỗ nào họ sửa ngay.',
          'Mã số luôn xin **đánh vần từng ký tự**, chữ cái thì kèm từ mã: "C as in Charlie". Đọc lại cả mã trước khi cúp máy, như Châu làm.',
          'Hỏi **tên người nghe máy** ngay câu đầu và **xin email xác nhận** cuối cuộc gọi. Lần sau gọi lại, bạn nói: "I spoke to Kyle on Thursday, reference CR55018" và không phải kể lại từ đầu.',
          'Bí quá thì xin chuyển sang **chat** hoặc **email**: "Is there a chat option? It\'d be easier for me in writing." Không có gì xấu hổ.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ · Canada', 'Úc'],
        rows: [
          ['Gói hàng', 'parcel', 'package', 'parcel'],
          ['Người giao hàng', 'courier · delivery driver', 'delivery driver · carrier', 'courier · delivery driver'],
          ['Quầy lễ tân', 'reception', 'front desk', 'reception'],
          ['Đô / bảng (nói thân)', 'quid (bảng Anh)', 'bucks', 'bucks'],
          ['Cách phàn nàn hay gặp', "Nói giảm: \"It's not ideal.\" · \"I'm a bit disappointed.\" = thật ra khá bực", 'Nói thẳng: "This isn\'t acceptable." · "I\'d like to speak to a manager."', 'Thẳng mà thân: "That\'s not on." (= không chấp nhận được) · "Fair enough."'],
          ['Ngày làm việc', 'working days', 'business days', 'business days · working days'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi phàn nàn. Người Anh nói "**not ideal**" có khi giận hơn người Mỹ nói "**unacceptable**": nghe **ý**, đừng chỉ nghe chữ.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b1-01 · This Isn\'t What We Ordered** — phàn nàn ba lần ở nhà hàng (chờ lâu, sai món, món nguội) mà không lần nào nặng lời. Mức nhẹ hơn hôm nay, nghe để ôn.',
          '**en-ds-b1-03 · My Bag Didn\'t Arrive** — báo thất lạc hành lý ở sân bay và hỏi hãng bay có trả tiền đồ dùng tạm không.',
          '**en-ds-b2-02 · Can We Talk About the Noise?** — bị hàng xóm phàn nàn tiếng ồn: cách đón lời phàn nàn, xin lỗi và đề xuất, giống vai của Châu ở cảnh 3.',
          'Ba tập là ba chuyện khác bài hôm nay. Nghe để gặp lại đúng những câu vừa học trong tình huống mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd21-noi',
    kind: 'speaking',
    title: 'Phàn nàn chắc mà lịch sự; xử lý khi bị phàn nàn',
    goal: 'Phàn nàn theo 5 bước có bằng chứng, nói "I was told that…" và "should have…" cho tự nhiên, leo thang lịch sự khi cần, và khi bị phàn nàn thì đón lời theo 4 bước mà không cãi, không đổ lỗi.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**30 câu mẫu**: mở lời, nêu sự việc, kể điều được hứa, đòi giải pháp, leo thang, xin xác nhận; và nửa còn lại là câu dùng khi **bạn bị phàn nàn**.',
          'Ngữ pháp: **tường thuật đơn giản** (I was told that… / They said…) và **should have + V3**. Nối câu: **even though**, **in the meantime**.',
          'Cùng một ý ở ba mức: thân · trung tính · trang trọng. Phàn nàn "chắc" **không có nghĩa là to tiếng**.',
          'Ngôn ngữ cơ thể khi phàn nàn và khi bị phàn nàn; vì sao **nụ cười ngại** của người Việt dễ bị hiểu sai.',
          'Nhập vai: tiệm giặt khô làm co áo len. Cuối bài nhập vai với Gia sư AI, hai lượt đổi vai.',
        ],
      },

      { t: 'h', text: '1. 30 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo thứ tự một cuộc phàn nàn: **mở lời → sự việc → điều được hứa → điều bạn muốn → leo thang → chốt**. Sáu câu cuối là câu khi **bạn là người bị phàn nàn**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "I'm afraid I need to make a complaint.", pos: 'phr', ipa: '/aɪm əˈfreɪd aɪ ˈniːd tə ˌmeɪk ə kəmˈpleɪnt/', vi: 'Tôi e là tôi phải phàn nàn. (mở lời lịch sự, nghiêm túc)', ex: "Good morning. I'm afraid I need to make a complaint about my room.", exVi: 'Chào anh. Tôi e là tôi phải phàn nàn về phòng của tôi.', more: '**make a complaint** (danh từ). Động từ: **complain about** sth · **complain to** sb.', anh: 'memo' },
          { w: "Sorry to bother you, but there's a problem with…", pos: 'phr', ipa: '/ˈsɑːri tə ˈbɑːðər ju bət ðerz ə ˈprɑːbləm wɪð/', vi: 'Xin lỗi làm phiền, nhưng có vấn đề với…', ex: "Sorry to bother you, but there's a problem with my order.", exVi: 'Xin lỗi làm phiền, nhưng đơn hàng của tôi có vấn đề.', more: 'Xin lỗi **một lần** ở đầu là đủ. Đừng xin lỗi suốt cả câu chuyện.' },
          { w: 'It sounds like it\'s inside the room.', pos: 'phr', ipa: '/ɪt ˈsaʊndz laɪk ɪts ɪnˈsaɪd ðə ˈruːm/', vi: 'Nghe như ở ngay trong phòng. (tả mức độ cho người kia hình dung)', ex: "The drilling started at seven. It sounds like it's inside the room.", exVi: 'Máy khoan chạy từ bảy giờ. Nghe như ở ngay trong phòng.' },
          { w: 'I was told (that)…', pos: 'phr', ipa: '/aɪ wəz ˈtoʊld ðət/', vi: 'Tôi được bảo là… / Người ta nói với tôi là…', ex: "When I booked, I was told that the work wouldn't affect guests.", exVi: 'Lúc đặt phòng, tôi được bảo là công trình không ảnh hưởng tới khách.', more: 'Không cần nói rõ **ai** nói. Câu mạnh nhất khi phàn nàn: nhắc lại **lời hứa** của họ.' },
          { w: "That's not what I was told.", pos: 'phr', ipa: '/ðæts ˈnɑːt wʌt aɪ wəz ˈtoʊld/', vi: 'Đó không phải điều tôi được nói lúc trước.', ex: "Five to seven days? That's not what I was told on the website.", exVi: 'Năm tới bảy ngày? Trên trang web người ta không nói thế.' },
          { w: 'I specifically asked for…', pos: 'phr', ipa: '/aɪ spəˈsɪfɪkli ˈæskt fər/', vi: 'Tôi đã yêu cầu rõ ràng là…', ex: 'I specifically asked for a quiet room.', exVi: 'Tôi đã yêu cầu rõ là phòng yên tĩnh.' },
          { w: "I paid for… and didn't get it.", pos: 'phr', ipa: '/aɪ ˈpeɪd fər ən ˈdɪdnt ˈɡet ɪt/', vi: 'Tôi đã trả tiền cho… mà không nhận được.', ex: "I paid for a quiet room and didn't get one.", exVi: 'Tôi trả tiền cho một phòng yên tĩnh mà không được như vậy.', more: 'Câu nối thẳng **tiền** với **thiệt hại**: mở đường đòi bù.' },
          { w: "That's not really a solution.", pos: 'phr', ipa: '/ðæts ˈnɑːt ˈrɪəli ə səˈluːʃn/', vi: 'Cái đó chưa thật sự giải quyết được.', ex: "That's kind, but earplugs aren't really a solution for two weeks.", exVi: 'Anh tử tế quá, nhưng nút bịt tai không giải quyết được chuyện hai tuần.', more: 'Mở bằng **That\'s kind, but…** để từ chối đề xuất mà vẫn mềm.' },
          { w: 'What can you do about it?', pos: 'phr', ipa: '/ˈwʌt kən ju ˈduː əbaʊt ɪt/', vi: 'Anh/chị làm được gì cho chuyện này?', ex: "I understand it's not your fault. What can you do about it?", exVi: 'Tôi hiểu không phải lỗi của anh. Anh làm được gì cho chuyện này?', more: 'Để người kia tự đưa giải pháp trước. Thường họ đưa nhiều hơn bạn nghĩ.' },
          { w: "I'd like to move to another room.", pos: 'phr', ipa: '/aɪd ˈlaɪk tə ˈmuːv tu əˌnʌðər ˈruːm/', vi: 'Tôi muốn chuyển sang phòng khác.', ex: "I'd like to move to a room on the other side of the building, please.", exVi: 'Tôi muốn chuyển sang một phòng ở phía bên kia toà nhà.', anh: 'key' },
          { w: "I'd like a (full / partial) refund.", pos: 'phr', ipa: '/aɪd ˈlaɪk ə ˌfʊl ˈriːfʌnd/', vi: 'Tôi muốn được hoàn tiền (toàn bộ / một phần).', ex: "The sweater is ruined, so I'd like a full refund.", exVi: 'Áo len hỏng rồi, nên tôi muốn được hoàn toàn bộ tiền.', more: 'Danh từ **REfund** nhấn âm đầu; động từ **reFUND** nhấn âm sau.', anh: 'money-with-wings' },
          { w: 'compensation', pos: 'n', ipa: '/ˌkɑːmpenˈseɪʃn/', vi: 'tiền / thứ bồi thường, đền bù', ex: "I'd like some compensation for the two nights I couldn't sleep.", exVi: 'Tôi muốn được đền bù cho hai đêm không ngủ được.', more: 'Đời thường hay nói nhẹ hơn: **Is there anything you can do for the inconvenience?**' },
          { w: 'Could I speak to the manager?', pos: 'phr', ipa: '/kʊd aɪ ˈspiːk tə ðə ˈmænɪdʒər/', vi: 'Cho tôi gặp quản lý được không?', ex: 'In that case, could I speak to the duty manager, please?', exVi: 'Vậy thì cho tôi gặp quản lý trực ca được không?', more: '**duty manager** = quản lý trực ca (khách sạn, siêu thị). Tổng đài: **supervisor**.' },
          { w: 'someone who can make a decision', pos: 'phr', ipa: '/ˈsʌmwʌn hu kən ˌmeɪk ə dɪˈsɪʒn/', vi: 'người có quyền quyết định', ex: 'I just think this needs someone who can make a decision.', exVi: 'Tôi chỉ nghĩ chuyện này cần một người có quyền quyết.' },
          { w: "I'm not trying to make things difficult.", pos: 'phr', ipa: '/aɪm ˈnɑːt ˈtraɪɪŋ tə ˌmeɪk θɪŋz ˈdɪfɪkəlt/', vi: 'Tôi không cố làm khó anh/chị đâu.', ex: "I'm not trying to make things difficult for you. I just need a quiet room.", exVi: 'Tôi không cố làm khó anh. Tôi chỉ cần một phòng yên tĩnh.', more: 'Câu "giữ hoà khí" với nhân viên tuyến đầu trước khi xin gặp cấp trên.' },
          { w: "I appreciate it's not your fault, but…", pos: 'phr', ipa: '/aɪ əˈpriːʃieɪt ɪts ˈnɑːt jər ˈfɔːlt bət/', vi: 'Tôi hiểu đây không phải lỗi của anh/chị, nhưng…', ex: "I appreciate it's not your fault, but I bought the boots from you.", exVi: 'Tôi hiểu không phải lỗi của anh, nhưng tôi mua ủng của cửa hàng anh.', more: '**appreciate** ở đây = hiểu, ghi nhận (không phải "cảm kích").' },
          { w: 'Sorry to cut in, but…', pos: 'phr', ipa: '/ˈsɑːri tə ˌkʌt ˈɪn bət/', vi: 'Xin lỗi ngắt lời, nhưng…', ex: "Sorry to cut in, but I've already checked with reception.", exVi: 'Xin lỗi ngắt lời, nhưng tôi đã hỏi lễ tân rồi.' },
          { w: 'It says delivered, but I never got it.', pos: 'phr', ipa: '/ɪt ˈsez dɪˈlɪvərd bət aɪ ˈnevər ˈɡɑːt ɪt/', vi: 'Hệ thống báo đã giao, nhưng tôi chưa hề nhận.', ex: "The tracking page says delivered, but I never got it.", exVi: 'Trang theo dõi báo đã giao, nhưng tôi chưa hề nhận.', anh: 'package' },
          { w: "It's fair to expect…", pos: 'phr', ipa: '/ɪts ˈfer tu ɪkˈspekt/', vi: 'Mong… là hợp lý.', ex: "I think it's fair to expect you to sort it out with the courier.", exVi: 'Tôi nghĩ mong cửa hàng tự làm việc với hãng chuyển phát là hợp lý.' },
          { w: 'Could you put that in writing?', pos: 'phr', ipa: '/kʊd ju ˈpʊt ðæt ɪn ˈraɪtɪŋ/', vi: 'Anh/chị ghi lại bằng văn bản giúp tôi được không?', ex: 'Thank you. Could you put that in an email, so I have it in writing?', exVi: 'Cảm ơn. Chị gửi email để tôi có xác nhận bằng chữ được không?', anh: 'e-mail' },
          { w: 'reference number', pos: 'n', ipa: '/ˈrefrəns ˌnʌmbər/', vi: 'mã số hồ sơ / mã cuộc gọi', ex: 'Could I have a reference number for this call?', exVi: 'Cho tôi xin mã số của cuộc gọi này.', more: 'Cũng gặp: **case number**, **ticket number**, **booking reference**.', anh: 'receipt' },
          { w: 'escalate', pos: 'v', ipa: '/ˈeskəleɪt/', vi: 'đưa lên cấp cao hơn, leo thang', ex: "If I don't hear back by Friday, I'll escalate it.", exVi: 'Nếu tới thứ Sáu chưa có phản hồi, tôi sẽ đưa lên cấp trên.' },
          { w: 'a goodwill gesture', pos: 'n', ipa: '/ə ˌɡʊdˈwɪl ˈdʒestʃər/', vi: 'món "lấy lòng", quà xin lỗi (không bắt buộc, công ty tự nguyện)', ex: 'As a goodwill gesture, breakfast is on us.', exVi: 'Để xin lỗi, khách sạn mời bữa sáng.' },
          { w: '… is on us / on the house', pos: 'phr', ipa: '/ɪz ˈɑːn ʌs/', vi: '… chúng tôi mời (miễn phí)', ex: 'Breakfast is on us for the rest of your stay.', exVi: 'Bữa sáng những ngày còn lại chúng tôi mời.', anh: 'fork-and-knife-with-plate' },
          { w: 'Thanks for sorting it out.', pos: 'phr', ipa: '/ˈθæŋks fər ˌsɔːrtɪŋ ɪt ˈaʊt/', vi: 'Cảm ơn đã giải quyết giúp.', ex: 'Thanks for sorting it out so quickly.', exVi: 'Cảm ơn chị đã giải quyết nhanh như vậy.', more: 'Luôn cảm ơn người đã giải quyết. Lần sau bạn cần họ, họ nhớ bạn.' },
          { w: 'Thanks for letting me know.', pos: 'phr', ipa: '/ˈθæŋks fər ˌletɪŋ mi ˈnoʊ/', vi: 'Cảm ơn đã báo cho tôi. (câu đầu tiên khi bị phàn nàn)', ex: "Thanks for letting me know. Let me have a look.", exVi: 'Cảm ơn đã báo mình. Để mình xem.' },
          { w: "You're right, and I'm sorry.", pos: 'phr', ipa: '/jʊr ˈraɪt ən aɪm ˈsɑːri/', vi: 'Bạn nói đúng, và mình xin lỗi.', ex: "You're right, and I'm sorry. I should have told you.", exVi: 'Cậu nói đúng, mình xin lỗi. Lẽ ra mình phải nói với cậu.' },
          { w: "That's on me.", pos: 'phr', ipa: '/ðæts ˈɑːn mi/', vi: 'Lỗi đó là của tôi. (thân, thẳng)', ex: "The spelling mistake? That's on me.", exVi: 'Lỗi chính tả à? Là lỗi của mình.', more: 'Ngược lại: **That one\'s on the shop.** = lỗi đó là của tiệm.' },
          { w: "Let me look into it.", pos: 'phr', ipa: '/ˌlet mi ˌlʊk ˈɪntu ɪt/', vi: 'Để tôi kiểm tra / tìm hiểu.', ex: "Let me look into it and get back to you by five.", exVi: 'Để tôi kiểm tra rồi báo lại trước năm giờ.' },
          { w: 'keep someone in the loop', pos: 'phr', ipa: '/ˌkiːp ˌsʌmwʌn ɪn ðə ˈluːp/', vi: 'báo cho ai nắm tình hình', ex: "It was my job to keep everyone in the loop.", exVi: 'Việc của mình là báo cho mọi người nắm tình hình.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Với bạn bè, phàn nàn kiểu nói đùa cũng được. Với lễ tân hay tổng đài, dùng cột **giữa**. Cột **trang trọng** dành cho thư khiếu nại, hoặc khi nói chuyện bình thường không có kết quả và bạn cần cho thấy mình nghiêm túc.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (quầy, tổng đài)', 'Trang trọng (quản lý, thư)'],
        rows: [
          ['Mở lời', 'Hey, quick thing about the hoodies…', "Sorry to bother you, but there's a problem with my room.", "I'm afraid I need to make a complaint about…"],
          ['Nêu vấn đề', "The room's super noisy.", "There's a lot of noise from the building site.", 'The room does not match the description in my booking confirmation.'],
          ['Nói cảm xúc', 'Kind of annoying, to be honest.', "It's quite frustrating.", 'I am very disappointed with the service I have received.'],
          ['Nhắc lời hứa', 'You said it was quiet!', 'I was told it would be quiet.', 'I was assured at the time of booking that…'],
          ['Đòi giải pháp', 'Can you sort it out?', 'Could you move me to another room?', 'I would expect a partial refund for the inconvenience.'],
          ['Leo thang', 'Is there someone else I can ask?', 'Could I speak to the duty manager?', 'I would like to make a formal complaint.'],
          ['Nhận giải pháp', 'Cool, works for me.', 'That sounds fair, thank you.', 'Thank you. I am happy to accept this.'],
        ],
        caption: 'Đi từ trái sang phải theo **mức nghiêm trọng**, không theo mức giận. Câu trang trọng nói bằng giọng bình thường có sức nặng hơn câu thân mật nói to.',
      },
      {
        t: 'table',
        head: ['Khi BỊ phàn nàn', 'Thân', 'Trung tính', 'Trang trọng'],
        rows: [
          ['Đón lời', 'Oh no, what happened?', "I'm sorry to hear that. What happened?", 'Thank you for bringing this to our attention.'],
          ['Nhận lỗi', 'My bad!', "You're right, and I'm sorry.", 'Please accept our apologies.'],
          ['Giải thích (không đổ lỗi)', "Here's what happened.", 'Let me explain what happened.', 'I would like to explain the situation.'],
          ['Đề xuất', 'How about I…?', 'What I can do is…', 'We would like to offer…'],
          ['Hẹn báo lại', "I'll text you tonight.", "I'll get back to you by Friday.", 'You will receive a full response within two working days.'],
        ],
        caption: 'Thứ tự quan trọng hơn câu chữ: **nghe → nhận lỗi → giải thích ngắn → giải pháp → hẹn**. Giải thích trước khi xin lỗi nghe như đang chống chế.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Hai khung câu gánh cả bài hôm nay. **I was told that…** để kể lại điều người ta đã hứa (tường thuật). **should have + V3** để nói điều lẽ ra phải xảy ra mà không xảy ra: dùng để **trách** người khác hoặc **tự nhận lỗi**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'I was told (that) + S + would / was / could + …',
            vi: 'Kể lại điều mình được nói, không cần nêu ai nói. that có thể bỏ khi nói.',
            examples: [
              { en: "I was told that the work wouldn't affect guests.", vi: 'Tôi được bảo là công trình không ảnh hưởng tới khách.' },
              { en: 'I was told the package was at reception.', vi: 'Tôi được bảo là gói hàng ở quầy lễ tân.' },
              { en: 'I was told reprints usually took two days.', vi: 'Tôi được bảo in lại thường mất hai ngày.' },
            ],
          },
          {
            formula: 'S + said (that) + … / S + told + O + (that) + …',
            vi: 'Kể lại lời của một người cụ thể. said không có tân ngữ; told phải có người nghe (told me, told us).',
            examples: [
              { en: 'The website said the room was quiet.', vi: 'Trang web nói phòng này yên tĩnh.' },
              { en: 'Anjali told me she would send an email.', vi: 'Anjali bảo tôi là chị ấy sẽ gửi email.' },
              { en: "Kyle said they'd ship a new pair today.", vi: 'Kyle nói họ sẽ gửi đôi mới ngay hôm nay.' },
            ],
          },
          {
            formula: 'S + should have + V3',
            vi: 'Lẽ ra đã phải làm (mà không làm). Dùng để trách, hoặc nhận lỗi về mình.',
            examples: [
              { en: 'You should have told me about the late fee.', vi: 'Lẽ ra cậu phải nói với tôi về phí đặt muộn.' },
              { en: 'I should have double-checked the list.', vi: 'Lẽ ra mình phải kiểm lại danh sách.' },
              { en: 'Someone should have warned us about the noise.', vi: 'Lẽ ra phải có ai báo trước cho chúng tôi về tiếng ồn.' },
            ],
          },
          {
            formula: "S + shouldn't have + V3",
            vi: 'Lẽ ra không nên làm (mà đã làm).',
            examples: [
              { en: "I shouldn't have paid before checking the sizes.", vi: 'Lẽ ra mình không nên trả tiền trước khi kiểm cỡ áo.' },
              { en: "They shouldn't have left the parcel outside.", vi: 'Lẽ ra họ không được để gói hàng bên ngoài.' },
              { en: "That shouldn't have happened.", vi: 'Lẽ ra chuyện đó không được xảy ra.' },
            ],
          },
          {
            formula: 'It + should have + V3 + by + mốc',
            vi: 'Việc lẽ ra đã xong tới mốc đó (mà chưa).',
            examples: [
              { en: 'It should have arrived on Tuesday.', vi: 'Lẽ ra nó đã tới từ thứ Ba.' },
              { en: 'The refund should have appeared by now.', vi: 'Lẽ ra giờ này tiền hoàn đã về rồi.' },
              { en: 'The work should have finished last month.', vi: 'Lẽ ra công trình đã xong từ tháng trước.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Lúc đó họ nói', 'Bạn kể lại', 'Đổi gì'],
        rows: [
          ['"It **will** take two days."', 'I was told it **would** take two days.', 'will → would'],
          ['"The room **is** quiet."', 'The website said the room **was** quiet.', 'is → was'],
          ['"We **can** move you tomorrow."', 'They said they **could** move me the next day.', 'can → could · tomorrow → the next day'],
          ['"We\'**re going to** fix it."', 'I was told they **were going to** fix it.', 'are going to → were going to'],
          ['"I\'ll email **you**."', 'She told **me** she\'d email **me**.', 'đổi người: you → me'],
        ],
        caption: 'Khi kể lại, động từ thường **lùi một thì** về quá khứ. Khi nói chuyện, nếu điều đó **vẫn đúng** thì nhiều người không lùi: "They told me the hotel **has** a gym." Cả hai đều nghe tự nhiên.',
      },
      {
        t: 'rule',
        formula: 'I was told (that) + S + would / was / could… · S + should have / shouldn\'t have + V3',
        vi: 'Nhắc lời hứa bằng I was told that… (lùi thì). Nói điều lẽ ra phải khác bằng should have + V3. Khi nói, should have đọc nhẹ thành "should-ơv".',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: even though · in the meantime',
        items: [
          '**even though** = dù… (mà) vẫn — mạnh hơn although (Ngày 18), nhấn sự **trái ngược bất công**: "**Even though** I asked for a quiet room, they gave me one next to a building site."',
          'Không dùng even though cùng **but** trong một câu: ~~Even though I asked, but they…~~ → "Even though I asked, they…"',
          '**in the meantime** = trong lúc chờ: "They\'re sending a new pair. **In the meantime**, I\'ll borrow some boots from Leah." Rất hay gặp khi người ta hẹn giải quyết sau.',
          'Nhân viên giỏi hay nói: "We\'ll process the refund today. **In the meantime**, here\'s a voucher for the café." Nghe câu này là biết họ đang bù đắp phần chờ đợi.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd21-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'I was told (that)… · S + should have / shouldn\'t have + V3 · even though · in the meantime',
        items: [
          { q: 'Tôi được bảo là phòng này yên tĩnh.', hint: 'I was told, quiet', answers: ['I was told that the room was quiet.', 'I was told the room was quiet.', 'I was told that this room was quiet.', 'I was told this room was quiet.', 'I was told that the room would be quiet.', 'I was told the room would be quiet.', 'I was told that this room is quiet.', 'I was told this room is quiet.'] },
          { q: 'Lẽ ra anh phải báo cho tôi trước.', hint: 'should have, tell, before / in advance', answers: ['You should have told me before.', 'You should have told me in advance.', "You should've told me before.", "You should've told me in advance.", 'You should have told me beforehand.', "You should've told me beforehand.", 'You should have told me first.'] },
          { q: 'Lẽ ra nó đã tới từ thứ Ba.', hint: 'should have, arrive, on Tuesday', answers: ['It should have arrived on Tuesday.', "It should've arrived on Tuesday.", 'It should have arrived by Tuesday.', "It should've arrived by Tuesday."] },
          { q: 'Dù tôi đã yêu cầu phòng yên tĩnh, họ vẫn cho tôi phòng cạnh công trường.', hint: 'even though, a room next to', answers: ['Even though I asked for a quiet room, they gave me a room next to a construction site.', 'Even though I asked for a quiet room, they gave me a room next to a building site.', 'Even though I asked for a quiet room, they gave me one next to a construction site.', 'Even though I asked for a quiet room, they gave me one next to a building site.', 'Even though I had asked for a quiet room, they gave me a room next to a construction site.', 'Even though I asked for a quiet room, they still gave me a room next to a construction site.'] },
          { q: 'Họ sẽ gửi đôi mới. Trong lúc chờ, tôi mượn ủng của Leah.', hint: 'in the meantime, borrow', answers: ["They'll send a new pair. In the meantime, I'll borrow Leah's boots.", 'They will send a new pair. In the meantime, I will borrow Leah\'s boots.', "They're sending a new pair. In the meantime, I'll borrow Leah's boots.", "They'll send a new pair. In the meantime, I'll borrow some boots from Leah.", "They're sending a new pair. In the meantime, I'm borrowing Leah's boots.", "They'll send a new pair. In the meantime, I'm going to borrow Leah's boots."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 9 lỗi thật',
        items: [
          '~~I want to complain you.~~ → **I\'d like to make a complaint.** / **I want to complain about the room.** complain cần **about** (về cái gì) và **to** (với ai): complain **to** the manager **about** the noise.',
          '~~I was said that…~~ → **I was told that…** say không đi với người nghe. Nói về người nghe thì dùng **tell**: I was **told**, she **told** me.',
          '~~You should told me.~~ / ~~You should tell me before.~~ (nói về chuyện đã qua) → **You should have told me.** Chuyện đã qua phải có **have + V3**. "You should tell me" là lời khuyên cho tương lai.',
          '~~You must give me refund!~~ → **I\'d like a refund, please.** / **I\'d expect a refund.** "must" với nhân viên nghe như ra lệnh, và thiếu **a**.',
          '~~Can I meet your boss?~~ → **Could I speak to the manager?** "boss" nghe trẻ con và hơi khiêu khích; "meet" là gặp lần đầu (Ngày 1).',
          '~~Sorry, sorry, so sorry, but maybe, if possible…~~ (xin lỗi liên tục khi phàn nàn) → **Sorry to bother you, but…** một lần rồi nói thẳng vấn đề. Xin lỗi nhiều quá, người ta tưởng bạn không thật sự cần họ sửa.',
          '~~Haha, my room is very noisy, haha.~~ (cười ngượng) → nói với mặt bình tĩnh. Ở Việt Nam cười để đỡ ngại là bình thường; ở Anh, Mỹ, Canada, cười khi phàn nàn dễ bị hiểu là **chuyện không nghiêm trọng**.',
          '~~It\'s not my fault!~~ (câu đầu tiên khi bị phàn nàn) → **Thanks for letting me know. Let me have a look.** Dù không phải lỗi bạn, câu đầu tiên là **nghe**, chưa phải cãi.',
          '~~Sorry for the inconvenient.~~ → **Sorry for the inconvenience.** inconvenient là tính từ (bất tiện); danh từ là **inconvenience**.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi phàn nàn và khi bị phàn nàn' },
      {
        t: 'p',
        text: 'Lời phàn nàn có hiệu quả hay không phụ thuộc một nửa vào **giọng và mặt**. Mục tiêu: trông **bình tĩnh và nghiêm túc**, không giận dữ, cũng không ngại ngùng. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi phàn nàn và khi đón lời phàn nàn',
        items: [
          { anh: 'neutral-face', w: "I'm afraid there's a problem with my room.", ro: '/aɪm əˈfreɪd ðerz ə ˈprɑːbləm/', vi: 'Mặt **bình thản, nghiêm vừa**. Không cười ngượng, không nhíu mày. Giọng đều, xuống giọng cuối câu.' },
          { anh: 'mobile-phone', w: "Here's the confirmation email.", ro: '/hɪrz ðə ˌkɑːnfərˈmeɪʃn ˌiːmeɪl/', vi: 'Đưa **bằng chứng** (email, ảnh, hoá đơn) ra cho người kia xem. Một tấm ảnh có giá hơn ba câu giải thích.' },
          { anh: 'raised-hand', w: 'Sorry to cut in, but…', ro: '/ˈsɑːri tə ˌkʌt ˈɪn/', vi: 'Giơ nhẹ bàn tay ngang ngực khi cần ngắt lời. Không giơ ngón trỏ.' },
          { anh: 'eyes', w: 'Could I speak to the duty manager, please?', ro: '/kʊd aɪ ˈspiːk tə ðə ˈduːti ˌmænɪdʒər/', vi: 'Nhìn thẳng, nói chậm hơn bình thường một chút. Chậm và đều = chắc chắn.' },
          { anh: 'face-with-steam-from-nose', w: '(đừng) This is ridiculous!', ro: '', vi: '**Đừng** lớn tiếng, đập tay xuống quầy. Ở Anh, Mỹ, Canada, khách to tiếng thường bị coi là **mất kiểm soát**, và nhân viên được phép từ chối phục vụ.' },
          { anh: 'ear', w: "Go on, I'm listening.", ro: '/ˌɡoʊ ˈɑːn aɪm ˈlɪsnɪŋ/', vi: 'Khi **bị** phàn nàn: quay người về phía họ, gật nhẹ, **không ngắt lời** cho tới khi họ nói xong.' },
          { anh: 'person-bowing', w: "I'm very sorry for the trouble.", ro: '/aɪm ˈveri ˈsɑːri/', vi: 'Với khách Nhật: xin lỗi kèm **cúi đầu**; lỗi càng lớn cúi càng sâu, càng lâu. Khách Nhật thường phàn nàn rất nhẹ nhàng, gián tiếp, nên nghe kỹ.' },
          { anh: 'handshake', w: 'Thanks for sorting it out.', ro: '/ˈθæŋks fər ˌsɔːrtɪŋ ɪt ˈaʊt/', vi: 'Xong việc thì **cảm ơn đúng người** (gọi tên: "Thanks, Anjali"), có thể bắt tay. Kết thúc thân thiện, lần sau họ sẵn lòng giúp.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh', 'Mỹ · Canada', 'Nhật'],
        rows: [
          ['Có phàn nàn không', 'Nhiều người im rồi không quay lại; hoặc nói to ngay tại chỗ.', 'Hay ngại nói thẳng, có khi im rồi viết đánh giá trên mạng.', 'Phàn nàn trực tiếp là bình thường, xin gặp quản lý không bị coi là quá đáng.', 'Khách ít phàn nàn thẳng; nói rất nhẹ và gián tiếp.'],
          ['Giọng khi phàn nàn', 'Có thể to, nhiều cảm xúc.', 'Nói giảm: "not ideal", "a bit disappointed" — thật ra có thể đang rất bực.', 'Thẳng, rõ, lịch sự: "This isn\'t acceptable."', 'Rất mềm: "Có lẽ… hơi khó một chút."'],
          ['Cười khi phàn nàn / xin lỗi', 'Cười để đỡ ngại, giữ hoà khí.', 'Dễ bị hiểu là không nghiêm túc.', 'Dễ bị hiểu là không nghiêm túc hoặc chế giễu.', 'Có cười ngại, nhưng xin lỗi thì nghiêm mặt và cúi chào.'],
          ['Khi bị phàn nàn', 'Hay giải thích ngay để "chữa".', 'Xin lỗi trước, giải thích sau.', 'Xin lỗi, đưa giải pháp nhanh, hay kèm món bù (giảm giá, đồ uống).', 'Xin lỗi rất trang trọng, cúi chào; giải pháp đến sau.'],
        ],
        caption: 'Không ai bắt bạn đổi tính. Chỉ cần nhớ: khi phàn nàn với người Anh, Mỹ, Canada, **mặt nghiêm + giọng đều** là đủ chắc; không cần to tiếng, cũng đừng cười ngượng.',
      },

      { t: 'h', text: '6. Phát âm: should have, I was told, và ngữ điệu "chắc"' },
      {
        t: 'p',
        text: 'Ba điều cần làm đúng: (1) **should have** đọc nhẹ /ʃʊdəv/, nghe như "should-ơv", tuyệt đối không đọc "should half"; (2) **I was told** dính liền, "was" đọc nhẹ /wəz/, "told" giữ âm /ld/ cuối; (3) câu phàn nàn **xuống giọng ở cuối**. Lên giọng cuối câu nghe như đang hỏi xin, mất sức nặng.',
      },
      {
        t: 'phatam',
        id: 'gtd21-phat-am',
        title: 'Luyện phát âm — dạng yếu và ngữ điệu xuống trong 8 câu phàn nàn',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nhấn vào từ mang nghĩa (told, quiet, should, manager), đọc lướt từ nhỏ (was, have, to, the).',
        items: [
          { text: 'I was told that it was quiet.', ipa: 'aɪ wəz toʊld ðət ɪt wəz kwaɪət', vi: 'was đọc nhẹ /wəz/ cả hai lần · told có /ld/ cuối · nhấn told và quiet' },
          { text: 'You should have told me.', ipa: 'ju ʃʊdəv toʊld mi', vi: 'should have → /ʃʊdəv/ "should-ơv" · nhấn told' },
          { text: 'I should have checked the list.', ipa: 'aɪ ʃʊdəv tʃekt ðə lɪst', vi: 'checked đọc /tʃekt/, đuôi -ed thành /t/ · list có /st/ cuối' },
          { text: "I'd like a refund, please.", ipa: 'aɪd laɪk ə riːfʌnd pliːz', vi: 'refund (danh từ) nhấn âm đầu RE- · nối like‿a' },
          { text: 'Could I speak to the manager?', ipa: 'kʊd aɪ spiːk tə ðə mænɪdʒər', vi: 'Could‿I nối thành "cu-đai" · manager nhấn MA-' },
          { text: "That's not really a solution.", ipa: 'ðæts nɑːt rɪəli ə səluːʃn', vi: 'nhấn not và LU trong solution · xuống giọng cuối câu' },
          { text: "I'm afraid that isn't acceptable.", ipa: 'aɪm əfreɪd ðæt ɪznt əkseptəbl', vi: 'acceptable nhấn -CEP- · câu chắc: xuống giọng ở cuối, không lên' },
          { text: 'Let me look into it.', ipa: 'let mi lʊk ɪntu ɪt', vi: 'nối look‿into‿it, nghe như "lúc-kin-tu-ít"' },
        ],
      },

      { t: 'h', text: '7. Phàn nàn 5 bước — và đón lời phàn nàn 4 bước' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Khi bạn phàn nàn',
        caption: 'Bước 3 là "vũ khí": nhắc lời hứa của chính họ. Bước 5 là "bảo hiểm": có tên người, có mốc, có chữ.',
        steps: [
          { label: 'Mở lời bình tĩnh', sub: "I'm afraid there's a problem with…" },
          { label: 'Sự việc + bằng chứng', sub: 'The photo shows a red door. The hotel has glass doors.' },
          { label: 'Điều bạn được hứa', sub: "I was told that… / The email says…" },
          { label: 'Điều bạn muốn (cụ thể)', sub: "I'd like to move rooms / a refund for last night." },
          { label: 'Chốt: ai, khi nào, bằng chữ', sub: 'Could I have a reference number? Could you put that in an email?' },
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Khi bạn bị phàn nàn',
        caption: 'Giải thích là bước **thứ ba**, và chỉ một câu. Câu đầu tiên luôn là nghe.',
        steps: [
          { label: 'Nghe hết, cảm ơn', sub: 'Thanks for letting me know.' },
          { label: 'Nhận đúng phần lỗi của mình', sub: "You're right. I should have mentioned it." },
          { label: 'Giải thích ngắn, không đổ lỗi', sub: 'The shop said late additions cost more.' },
          { label: 'Giải pháp + hẹn báo lại', sub: "I'll call them at lunch and update the group this afternoon." },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "I'm afraid there's a problem with my order.", vi: 'Tôi e là đơn hàng của tôi có vấn đề.' },
          { en: 'The tracking page says it was delivered on Tuesday, but I never got it.', vi: 'Trang theo dõi báo giao hôm thứ Ba, nhưng tôi chưa hề nhận.' },
          { en: 'I was told it would arrive within three days, and I paid extra for that.', vi: 'Tôi được bảo hàng sẽ tới trong ba ngày, và tôi đã trả thêm tiền cho việc đó.' },
          { en: "I'd like you to send a replacement today, or give me a full refund.", vi: 'Tôi muốn cửa hàng gửi hàng thay thế ngay hôm nay, hoặc hoàn tiền toàn bộ.' },
          { en: 'Could I have a reference number, and could you confirm that by email?', vi: 'Cho tôi xin mã hồ sơ, và anh xác nhận lại qua email giúp tôi được không?' },
        ],
      },
      {
        t: 'p',
        text: 'Nghĩ về **một lần bạn từng bị phục vụ tệ** (giao hàng trễ, quán làm sai món, ứng dụng trừ tiền hai lần). Viết 5 câu theo 5 bước trên bằng tiếng Anh, rồi đọc to với **mặt bình tĩnh và giọng xuống cuối câu**.',
      },

      { t: 'h', text: '8. Nhập vai: tiệm giặt khô làm co áo len' },
      {
        t: 'dialogue',
        title: 'Ở tiệm giặt khô — Châu cầm chiếc áo len bị co',
        lines: [
          { who: 'Châu', role: 'a', text: "Hi. I picked up this sweater yesterday, and I'm afraid it's shrunk. It used to fit me, and now it barely covers my stomach.", vi: 'Chào anh. Hôm qua tôi lấy chiếc áo len này, và tôi e là nó bị co rồi. Trước đây tôi mặc vừa, giờ nó gần như không che nổi bụng.' },
          { who: 'Ross', role: 'b', text: "Oh dear. Let me have a look… It's wool. Did you tick 'hand wash' on the ticket?", vi: 'Ôi trời. Để tôi xem… Áo len lông cừu. Chị có đánh dấu "giặt tay" trên phiếu không?' },
          { who: 'Châu', role: 'a', text: "I didn't tick anything. I was told at the counter that you'd check the label, and the label clearly says 'dry clean only'.", vi: 'Tôi không đánh dấu gì cả. Ở quầy người ta bảo tôi là tiệm sẽ xem nhãn, mà nhãn ghi rõ "chỉ giặt khô".' },
          { who: 'Ross', role: 'b', text: "Right. I'm sorry. It looks like it went in with the normal wash. That shouldn't have happened.", vi: 'Đúng rồi. Tôi xin lỗi. Có vẻ nó đã bị cho vào giặt thường. Lẽ ra chuyện đó không được xảy ra.' },
          { who: 'Châu', role: 'a', text: 'I appreciate you saying that. So what can you do about it?', vi: 'Cảm ơn anh đã nhận. Vậy tiệm làm được gì cho chuyện này?' },
          { who: 'Ross', role: 'b', text: 'Our usual policy is to refund the cleaning fee.', vi: 'Thường thì tiệm hoàn lại tiền giặt.' },
          { who: 'Châu', role: 'a', text: "That's a start, but the sweater was a gift, and it cost about a hundred and twenty dollars. Twelve dollars doesn't really cover it.", vi: 'Cũng là một bước, nhưng chiếc áo là quà tặng, giá khoảng một trăm hai mươi đô. Mười hai đô không bù được.' },
          { who: 'Ross', role: 'b', text: "I understand. For anything more than that, I'd have to check with the owner.", vi: 'Tôi hiểu. Hơn mức đó thì tôi phải hỏi chủ tiệm.' },
          { who: 'Châu', role: 'a', text: "That's fine. Could you ask her today and give me a call? Here's my number.", vi: 'Được. Anh hỏi chị ấy trong hôm nay rồi gọi cho tôi nhé? Số tôi đây.' },
          { who: 'Ross', role: 'b', text: "Will do. You should hear from us by five.", vi: 'Vâng. Trước năm giờ chị sẽ nhận được tin của tiệm.' },
          { who: 'Châu', role: 'a', text: 'Great. And could you write down what we agreed, with your name?', vi: 'Tốt quá. Anh ghi lại những gì mình vừa thống nhất, kèm tên anh giúp tôi nhé?' },
          { who: 'Ross', role: 'b', text: "Of course. I'm Ross. I'll put it on your receipt.", vi: 'Tất nhiên. Tôi là Ross. Tôi ghi lên biên lai của chị.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd21-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Châu (5 câu)',
        items: [
          { vi: 'Mở lời: Tôi e là nó bị co rồi.', chips: ["I'm", 'afraid', "it's", 'shrunk.', 'scared', 'is'], answer: ["I'm", 'afraid', "it's", 'shrunk.'] },
          { vi: 'Nhắc lời hứa: Ở quầy người ta bảo tôi là tiệm sẽ xem nhãn.', chips: ['I', 'was', 'told', 'at', 'the', 'counter', "that you'd", 'check', 'the', 'label.', 'said', 'will'], answer: ['I', 'was', 'told', 'at', 'the', 'counter', "that you'd", 'check', 'the', 'label.'] },
          { vi: 'Đòi giải pháp: Vậy tiệm làm được gì cho chuyện này?', chips: ['So', 'what', 'can', 'you', 'do', 'about', 'it?', 'make', 'for'], answer: ['So', 'what', 'can', 'you', 'do', 'about', 'it?'] },
          { vi: 'Từ chối mức bù thấp: Mười hai đô không bù được.', chips: ['Twelve', 'dollars', "doesn't", 'really', 'cover', 'it.', "don't", 'pay'], answer: ['Twelve', 'dollars', "doesn't", 'really', 'cover', 'it.'] },
          { vi: 'Xin xác nhận: Anh ghi lại những gì mình đã thống nhất giúp tôi nhé?', chips: ['Could', 'you', 'write', 'down', 'what', 'we', 'agreed?', 'agree', 'which'], answer: ['Could', 'you', 'write', 'down', 'what', 'we', 'agreed?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd21-noi-tra-loi',
        part: '1',
        questions: [
          'Tell me about a time you complained about something. What happened in the end?',
          'Your hotel room is very different from the photos online. What do you say at reception?',
          'A friend says you forgot to pay them back for dinner. How do you respond?',
          'Do people in Vietnam usually complain directly? Why do you think that is?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Trevor, a polite but tired front desk agent at a busy hotel in Vancouver. I am a guest from Vietnam. My room is next to a noisy construction site, even though my booking said \'quiet room\'. Follow your script: first offer only earplugs, then say the hotel is fully booked. Only offer a room move and a discount if I stay calm, give facts, say what I was told, and ask to speak to the duty manager — then become Anjali, the duty manager. Speak at natural speed (B1+ to B2), do not explain words unless I ask. After 12 turns, tell me in Vietnamese: did I use \'I was told that…\' and \'should have\' correctly, was I firm without being rude, and give me two better sentences."',
          'Lượt hai **đổi vai**: AI là một vị khách đang rất bực vì bạn giao bánh sinh nhật trễ một tiếng. Bạn là người bị phàn nàn: làm đủ 4 bước (nghe · nhận lỗi · giải thích ngắn · giải pháp + hẹn), không được nói "It\'s not my fault".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd21-doc',
    kind: 'reading',
    title: 'Email khiếu nại & thư trả lời của công ty',
    goal: 'Đọc hiểu một chuỗi email khiếu nại thật: thư khiếu nại có cấu trúc, thư trả lời mẫu né tránh, thư nhắc lại khi bị né, và thư trả lời đúng cách; nhận ra giọng điệu và nhặt cụm để tự viết.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Ba tuần sau chuyến đi, Châu thấy **khoản tiền một đêm** mà khách sạn hứa trừ **chưa hề về** thẻ, lại còn bị tính tiền bữa sáng. Châu viết email.',
          'Bạn đọc **bốn email** nối nhau: thư khiếu nại · thư trả lời tự động "né" · thư nhắc lại cứng rắn hơn · thư trả lời đúng cách của quản lý.',
          'Học đọc **giọng điệu**: câu nào là xin lỗi thật, câu nào chỉ là "xin lỗi cho có".',
          'Nhặt cụm cố định của thư khiếu nại để tự viết. Đây là email **đời sống** (khách sạn, cửa hàng); email gửi khách hàng ở công ty thuộc khoá Technical English at Work.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn email sau' },
      {
        t: 'canh',
        anh: ['e-mail', 'credit-card', 'receipt', 'hotel', 'magnifying-glass-tilted-left'],
        caption: 'Đầu tháng 11, Châu đã về Việt Nam. Mở sao kê thẻ, Châu thấy khách sạn Cedarline **tính đủ 13 đêm** và **thêm 9 bữa sáng**, dù quản lý Anjali đã hứa trừ một đêm và mời bữa sáng.',
      },
      {
        t: 'passage',
        title: 'Booking CED-48213 — four emails',
        intro: 'Đọc một lượt, chưa tra từ. Để ý mỗi email mở đầu thế nào và kết thúc thế nào.',
        paras: [
          {
            label: 'A',
            text: '**From:** Tran Minh Chau · **To:** guestrelations@cedarlinehotel.ca · **Tue 3 Nov** · **Subject: Refund not received — booking CED-48213** · Dear Guest Relations Team, **I am writing about** my stay at the Cedarline Hotel from 11 to 24 October (booking reference CED-48213). On 12 October, I reported construction noise outside room 1408. The duty manager, Ms Anjali Rao, **apologised and agreed to** take the first night off my bill and to provide free breakfast for the rest of my stay. **I was told that** this would be confirmed by email, and I attach her message. **However**, my card statement shows that I was charged for all 13 nights, and 9 breakfasts (CAD 216) were also added. The refund **should have appeared** by now, as I checked out ten days ago. **I would be grateful if you could** refund one night (CAD 289) and the breakfast charges, and confirm this in writing. **I look forward to hearing from you.** Kind regards, Tran Minh Chau',
          },
          {
            label: 'B',
            text: '**From:** no-reply@cedarlinehotel.ca · **Tue 3 Nov** · Dear Guest, **Thank you for contacting us.** At the Cedarline, we value all guest feedback. **We apologise for any inconvenience this may have caused.** Your request has been received and will be reviewed **within 10–14 business days**. Please do not reply to this email. Warm regards, The Cedarline Team',
          },
          {
            label: 'C',
            text: '**From:** Tran Minh Chau · **To:** guestrelations@cedarlinehotel.ca · **Cc:** Anjali Rao · **Wed 4 Nov** · **Subject: RE: Refund not received — booking CED-48213** · Dear Guest Relations Team, Thank you for the automatic reply. **I understand that** requests take time to process. **However**, this is not a new request: the refund was **agreed in writing** on 12 October, and **it should have been processed** at check-out. **I have copied** Ms Rao, who made the agreement. **Could you please** pass this to a manager and **let me know by Friday 6 November** when the money will be returned? **Otherwise**, I will have to raise the matter with my card provider. Kind regards, Tran Minh Chau',
          },
          {
            label: 'D',
            text: '**From:** Anjali Rao, Front Office Manager · **Thu 5 Nov** · Dear Chau, **Thank you for copying me in, and I\'m sorry you had to chase this.** You were right: the adjustment was entered on 12 October, but **it was not applied** to your final bill because of an error at check-out. **That should not have happened.** **I have now refunded** CAD 505 (one night plus all breakfast charges) to your card. Card refunds **usually take 5–10 business days** to appear, depending on your bank. **As a goodwill gesture**, I have also added 5,000 points to your Cedarline Rewards account. **If anything is still not right**, please reply to me directly. Kind regards, Anjali Rao',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd21-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Châu khiếu nại về chuyện gì?',
            options: ['Tiếng ồn ở phòng 1408', 'Khoản hoàn tiền đã hứa chưa về, lại bị tính tiền bữa sáng', 'Nhân viên lễ tân bất lịch sự', 'Khách sạn huỷ đặt phòng'],
            correct: 1,
            why: 'Tiếng ồn đã được giải quyết từ tháng 10. Email A là về **tiền**: "charged for all 13 nights" và "9 breakfasts (CAD 216) were also added".',
          },
          {
            q: 'Trong email A, vì sao Châu đính kèm tin nhắn của Anjali?',
            options: ['Để khen Anjali', 'Làm bằng chứng cho điều đã được hứa', 'Vì khách sạn yêu cầu', 'Để xin việc ở khách sạn'],
            correct: 1,
            why: '"**I was told that** this would be confirmed by email, and **I attach her message**." Thư khiếu nại tốt luôn có bằng chứng kèm theo.',
          },
          {
            q: 'Email B có giọng điệu thế nào?',
            options: ['Xin lỗi chân thành, có giải pháp', 'Thư mẫu tự động, xin lỗi chung chung, không giải quyết gì', 'Giận dữ', 'Rất thân mật'],
            correct: 1,
            why: 'Dấu hiệu thư mẫu: "Dear **Guest**" (không tên), "**any** inconvenience this **may** have caused" (không nhận là có lỗi), không nhắc gì tới vấn đề cụ thể, và "Please do not reply".',
          },
          {
            q: '"We apologise for any inconvenience this may have caused" — vì sao câu này làm người đọc khó chịu?',
            options: [
              'Vì sai ngữ pháp',
              'Vì "any… may have" nghĩa là "nếu có phiền gì thì…": công ty không nhận là đã có lỗi',
              'Vì quá trang trọng',
              'Vì không có chữ sorry',
            ],
            correct: 1,
            why: '**any** + **may have** biến lời xin lỗi thành giả định. So với email D: "**That should not have happened.**" — nhận thẳng là có lỗi.',
          },
          {
            q: 'Trong email C, Châu làm gì để không bị chờ thêm 10–14 ngày?',
            options: [
              'Gọi điện chửi khách sạn',
              'Nói rõ đây không phải yêu cầu mới, gửi kèm (Cc) người đã hứa, xin chuyển cho quản lý, và đặt hạn trả lời',
              'Viết đánh giá một sao',
              'Xin lỗi vì đã làm phiền',
            ],
            correct: 1,
            why: 'Bốn bước leo thang trong một thư: "this is **not a new request**" · "**I have copied** Ms Rao" · "pass this to **a manager**" · "let me know **by Friday 6 November**".',
          },
          {
            q: '"Otherwise, I will have to raise the matter with my card provider." Câu này có ý gì?',
            options: ['Châu sẽ đổi thẻ', 'Nếu không được giải quyết, Châu sẽ nhờ ngân hàng / công ty thẻ can thiệp', 'Châu cảm ơn ngân hàng', 'Châu sẽ trả thêm tiền'],
            correct: 1,
            why: 'Đây là bước leo thang **tiếp theo**, nói ra một cách bình tĩnh, có điều kiện (**otherwise** = nếu không). Không đe doạ, chỉ cho biết bước kế tiếp.',
          },
          {
            q: 'Theo email D, vì sao tiền chưa được trừ?',
            options: ['Châu đưa sai số thẻ', 'Khoản điều chỉnh đã nhập nhưng không được áp vào hoá đơn cuối do lỗi lúc trả phòng', 'Anjali quên', 'Ngân hàng giữ tiền'],
            correct: 1,
            why: '"The adjustment was entered on 12 October, but **it was not applied** to your final bill because of **an error at check-out**."',
          },
          {
            q: 'Câu nào trong email D cho thấy đây là lời xin lỗi THẬT?',
            options: ['Kind regards', 'That should not have happened.', 'Card refunds usually take 5–10 business days.', 'Dear Chau'],
            correct: 1,
            why: 'Nhận lỗi rõ ràng bằng **should not have + V3**, kèm **việc đã làm** ("I have now refunded…"), món bù ("As a goodwill gesture…") và **liên lạc trực tiếp** ("reply to me directly").',
          },
        ],
      },

      { t: 'h', text: '2. Thư trả lời tốt và thư "né" khác nhau ở đâu' },
      {
        t: 'table',
        head: ['Dấu hiệu', 'Thư "né" (B)', 'Thư đúng cách (D)'],
        rows: [
          ['Gọi tên', 'Dear Guest', 'Dear Chau'],
          ['Xin lỗi', 'for **any** inconvenience this **may** have caused', "I'm sorry you had to chase this. · That should not have happened."],
          ['Nhắc vấn đề cụ thể', 'Không', 'Có: lỗi lúc trả phòng, số tiền, ngày'],
          ['Việc đã làm', 'will be reviewed', '**I have now refunded** CAD 505'],
          ['Mốc thời gian', '10–14 business days (để xem xét)', '5–10 business days (để tiền về)'],
          ['Liên lạc tiếp', 'Please do not reply', 'Please reply to me directly'],
        ],
        caption: 'Khi nhận thư kiểu B, đừng bực mà viết thư kiểu C: lịch sự, ngắn, có lý do, có người liên quan, có hạn trả lời.',
      },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Dùng ở đâu'],
        rows: [
          ['I am writing about / regarding…', 'Tôi viết thư về…', 'Câu mở thư khiếu nại'],
          ['booking reference · order number', 'mã đặt chỗ · mã đơn', 'Luôn ghi ở tiêu đề và câu đầu'],
          ['I attach… · Please find attached…', 'Tôi gửi kèm…', 'Đưa bằng chứng'],
          ['I would be grateful if you could…', 'Tôi rất mong anh/chị có thể…', 'Nêu điều bạn muốn (trang trọng, rất hay dùng)'],
          ['I look forward to hearing from you.', 'Mong sớm nhận được phản hồi.', 'Câu kết thư trang trọng'],
          ['I have copied (in)… · Cc', 'Tôi gửi kèm cho…', 'Cho người liên quan cùng đọc'],
          ['Could you please let me know by + ngày…?', 'Anh/chị báo giúp trước ngày…', 'Đặt hạn'],
          ['raise the matter with…', 'đưa chuyện này lên…', 'Nói bước leo thang tiếp theo'],
          ["I'm sorry you had to chase this.", 'Xin lỗi vì anh/chị đã phải nhắc nhiều lần.', 'Câu xin lỗi tốt của công ty'],
          ['As a goodwill gesture, …', 'Để bày tỏ thiện chí, …', 'Món bù tự nguyện'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc và viết thư khiếu nại',
        items: [
          '**Tiêu đề** nói đủ ba thứ: vấn đề + mã + (nếu cần) "second request". Ví dụ: "Refund not received — booking CED-48213".',
          'Một thư khiếu nại tốt trả lời được: **chuyện gì · khi nào · được hứa gì · bằng chứng · muốn gì · trước khi nào**.',
          'Viết **sự việc**, không viết cảm xúc dài. "I was charged for all 13 nights" mạnh hơn "I am extremely angry and shocked".',
          'Hoàn tiền về thẻ thường mất **vài ngày tới khoảng hai tuần** tuỳ ngân hàng. Đã quá mốc người ta hứa thì mới nhắc.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd21-doc-dien',
        title: 'Điền một từ để hoàn chỉnh thư khiếu nại (6 câu)',
        kind: 'fill',
        grammar: 'I am writing about… · I was told that… · I would be grateful if you could… · I look forward to hearing from you.',
        items: [
          { q: 'I am ___ about my order NG470913, which has not arrived.', answers: ['writing'] },
          { q: 'I was ___ that it would arrive within three days.', answers: ['told'] },
          { q: 'I ___ a copy of the delivery photo.', answers: ['attach'] },
          { q: 'I would be ___ if you could send a replacement this week.', answers: ['grateful'] },
          { q: 'The parcel should ___ arrived on Tuesday.', answers: ['have'] },
          { q: 'I look forward to ___ from you.', answers: ['hearing'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd21-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 21',
    goal: 'Làm 34 câu có đáp án để phàn nàn đúng mức, kể lại lời hứa bằng I was told that…, dùng should have đúng, đón lời phàn nàn không chống chế, và ôn lại Ngày 15–20.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 15** (Would you mind…), **Ngày 18** (however), **Ngày 19** (used to), **Ngày 20** (bị động).',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần** với giọng xuống ở cuối.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 22 (thuyết phục và thương lượng).',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd21-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Phòng khách sạn không có nước nóng. Câu mở lời nào hợp nhất ở quầy?',
            options: ['You must fix the water now!', "Sorry to bother you, but there's no hot water in room 512.", 'Haha, sorry, sorry, maybe the water is a little cold?', 'I want to complain you about water.'],
            correct: 1,
            why: 'Xin lỗi **một lần**, rồi nói **sự việc cụ thể** (không có nước nóng, phòng nào). A ra lệnh, C vòng vo và cười ngượng, D sai ngữ pháp (complain **about**).',
          },
          {
            q: 'Nhân viên tổng đài nói: "Unfortunately, that\'s our standard process." Bạn nói gì tiếp?',
            options: ["Okay, bye.", 'You are stupid.', 'I understand. Could I speak to a supervisor, please?', 'Process is bad.'],
            correct: 2,
            why: 'Câu đó nghĩa là nhân viên **hết quyền**. Ghi nhận ("I understand") rồi xin gặp **supervisor**.',
          },
          {
            q: 'Câu nào đúng?',
            options: ['I was said that the room was quiet.', 'I was told that the room was quiet.', 'I told that the room was quiet.', 'They said me the room was quiet.'],
            correct: 1,
            why: '**I was told (that)…** Say không có người nghe đi sau (They **said** the room was quiet / They **told me** the room was quiet).',
          },
          {
            q: 'Gói hàng lẽ ra đã tới thứ Ba mà chưa thấy. Câu nào đúng?',
            options: ['It should arrive on Tuesday.', 'It should have arrived on Tuesday.', 'It should arrived on Tuesday.', 'It must arrive Tuesday.'],
            correct: 1,
            why: 'Việc **lẽ ra đã xảy ra** trong quá khứ: **should have + V3**. "It should arrive" là đoán cho tương lai.',
          },
          {
            q: 'Bạn của bạn nói: "You said you\'d book the table, and you didn\'t!" Câu đầu tiên nên nói:',
            options: ["It's not my fault, the website was down.", "You're right, I'm sorry. I should have booked it last night.", 'Why are you angry?', 'Whatever.'],
            correct: 1,
            why: 'Khi bị phàn nàn: **nhận lỗi trước**, giải thích sau (nếu cần). Câu A giải thích ngay nên nghe như chống chế.',
          },
          {
            q: 'Quản lý khách sạn đồng ý giảm giá. Bạn muốn có bằng chứng. Bạn nói:',
            options: ['Promise me!', 'Could you put that in an email, please?', 'I don\'t believe you.', 'Write it.'],
            correct: 1,
            why: '**Could you put that in writing / in an email?** Lịch sự và chắc chắn. Không ai phật lòng với câu này.',
          },
          {
            q: 'Người Anh nói về bữa ăn: "Hmm, it\'s not ideal." Họ có thể đang nghĩ gì?',
            options: ['Món ăn rất ngon', 'Họ khá không hài lòng, chỉ nói giảm đi', 'Họ không hiểu món', 'Họ muốn gọi thêm'],
            correct: 1,
            why: 'Người Anh hay **nói giảm**: "not ideal", "a bit disappointing" có khi nghĩa là khá bực. Nghe ý, đừng chỉ nghe chữ.',
          },
          {
            q: '(Ôn Ngày 15) Bạn muốn nhờ lễ tân kiểm tra lại hoá đơn, thật lịch sự:',
            options: ['Check my bill.', 'Would you mind checking my bill again?', 'Would you mind to check my bill?', 'You mind check bill?'],
            correct: 1,
            why: '**Would you mind + V-ing?** Không dùng "to V" sau mind.',
          },
          {
            q: '(Ôn Ngày 19) Câu nào đúng nghĩa "Trước đây khách sạn này yên tĩnh (giờ không còn)"?',
            options: ['This hotel is used to be quiet.', 'This hotel used to be quiet.', 'This hotel use to quiet.', 'This hotel was used to quiet.'],
            correct: 1,
            why: '**used to + V nguyên mẫu** = trước đây như vậy, giờ không còn.',
          },
          {
            q: '(Ôn Ngày 20) Chọn câu bị động đúng:',
            options: ['The parcel was leave at a red door.', 'The parcel was left at a red door.', 'The parcel left at a red door.', 'The parcel is leaving at a red door.'],
            correct: 1,
            why: 'Bị động quá khứ: **was / were + V3**. leave → left → **left**.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền từ: tường thuật và should have' },
      {
        t: 'quiz',
        id: 'gtd21-bt-dien',
        title: 'Phần II — Điền một từ (7 câu)',
        kind: 'fill',
        grammar: 'I was told… · would / was / could (lùi thì) · should have + V3 · even though · in the meantime',
        items: [
          { q: '"It will take two days." → I was told it ___ take two days.', answers: ['would'] },
          { q: '"We can move you tomorrow." → They said they ___ move me the next day.', answers: ['could'] },
          { q: 'You should have ___ me about the late fee. (tell)', answers: ['told'] },
          { q: "I shouldn't have ___ before checking the sizes. (pay)", answers: ['paid'] },
          { q: 'Anjali ___ me she would send an email. (said / told)', answers: ['told'] },
          { q: '___ though I asked for a quiet room, I got a noisy one.', answers: ['Even'] },
          { q: "They're sending a new pair. In the ___, I'll borrow some boots.", answers: ['meantime'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd21-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "I'm afraid… · I was told… · should have + V3 · Could I…? · Could you…?",
        items: [
          { q: 'Tôi e là tôi phải phàn nàn về phòng của mình.', hint: "I'm afraid, make a complaint", answers: ["I'm afraid I need to make a complaint about my room.", "I'm afraid I have to make a complaint about my room.", "I'm afraid I'd like to make a complaint about my room.", 'I am afraid I need to make a complaint about my room.', "I'm afraid I need to complain about my room.", "I'm afraid I have to complain about my room."] },
          { q: 'Hệ thống báo đã giao, nhưng tôi chưa hề nhận.', hint: 'it says, delivered, never got', answers: ["It says delivered, but I never got it.", "It says it was delivered, but I never got it.", "It says delivered, but I never received it.", "It says it was delivered, but I never received it.", "It says it's been delivered, but I never got it."] },
          { q: 'Cho tôi gặp quản lý được không?', hint: 'could, speak to', answers: ['Could I speak to the manager?', 'Could I speak to the manager, please?', 'Could I speak to a manager, please?', 'Could I speak to a manager?', 'Can I speak to the manager, please?', 'Could I talk to the manager, please?'] },
          { q: 'Tôi hiểu đây không phải lỗi của anh, nhưng tôi mua hàng của cửa hàng anh.', hint: "I appreciate, not your fault, bought it from you", answers: ["I appreciate it's not your fault, but I bought it from you.", "I understand it's not your fault, but I bought it from you.", "I appreciate that it's not your fault, but I bought it from you.", "I understand that it's not your fault, but I bought it from you.", "I appreciate it's not your fault, but I bought it from your shop.", "I understand it's not your fault, but I bought it from your store."] },
          { q: 'Anh/chị gửi email xác nhận giúp tôi được không?', hint: 'could you, confirm, by email', answers: ['Could you confirm that by email?', 'Could you confirm that by email, please?', 'Could you confirm it by email?', 'Could you put that in an email?', 'Could you put that in an email, please?', 'Could you please confirm that by email?'] },
          { q: 'Cậu nói đúng. Lẽ ra mình phải kiểm lại.', hint: "you're right, should have, check", answers: ["You're right. I should have checked.", "You're right. I should have double-checked.", "You're right. I should've checked.", "You're right, I should have checked.", "You're right. I should have checked again.", 'You are right. I should have checked.'] },
          { q: 'Cảm ơn đã báo cho mình. Để mình kiểm tra.', hint: 'thanks for letting me know, look into', answers: ["Thanks for letting me know. Let me look into it.", "Thanks for letting me know. Let me check.", "Thank you for letting me know. Let me look into it.", "Thanks for letting me know. I'll look into it.", "Thanks for letting me know. Let me have a look.", "Thanks for telling me. Let me look into it."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd21-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "That's not what I was told.", answer: "That's not what I was told.", alt: ['That is not what I was told.'] },
          { label: 'Câu 2', spell: "I paid for a quiet room and didn't get one.", answer: "I paid for a quiet room and didn't get one.", alt: ['I paid for a quiet room and did not get one.'] },
          { label: 'Câu 3', spell: 'Could I have a reference number for this call?', answer: 'Could I have a reference number for this call?' },
          { label: 'Câu 4', spell: "That shouldn't have happened.", answer: "That shouldn't have happened.", alt: ['That should not have happened.'] },
          { label: 'Câu 5', spell: 'It was my job to keep everyone in the loop.', answer: 'It was my job to keep everyone in the loop.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd21-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Lúc đặt phòng, tôi được bảo là công trình không ảnh hưởng tới khách.', chips: ['When', 'I', 'booked,', 'I', 'was', 'told', 'the', 'work', "wouldn't", 'affect', 'guests.', 'said', "won't"], answer: ['When', 'I', 'booked,', 'I', 'was', 'told', 'the', 'work', "wouldn't", 'affect', 'guests.'] },
          { vi: 'Lẽ ra chị phải được báo lúc nhận phòng.', chips: ['You', 'should', 'have', 'been', 'told', 'when', 'you', 'checked', 'in.', 'tell', 'had'], answer: ['You', 'should', 'have', 'been', 'told', 'when', 'you', 'checked', 'in.'] },
          { vi: 'Tôi không cố làm khó anh đâu.', chips: ["I'm", 'not', 'trying', 'to', 'make', 'things', 'difficult.', 'do', 'hard'], answer: ["I'm", 'not', 'trying', 'to', 'make', 'things', 'difficult.'] },
          { vi: 'Nút bịt tai không thật sự giải quyết được.', chips: ['Earplugs', "aren't", 'really', 'a', 'solution.', 'solve', "isn't"], answer: ['Earplugs', "aren't", 'really', 'a', 'solution.'] },
          { vi: '(Ôn Ngày 18) Tuy nhiên, khoản hoàn tiền vẫn chưa về.', chips: ['However,', 'the', 'refund', 'still', "hasn't", 'arrived.', 'Although', 'yet'], answer: ['However,', 'the', 'refund', 'still', "hasn't", 'arrived.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Nói to 5 bước phàn nàn của **câu chuyện thật của bạn** (đã viết ở bài Nói), ghi âm, nghe lại: giọng có **xuống ở cuối câu** không, có **cười ngượng** không.',
          'Viết nháp một email khiếu nại 80–100 từ theo khung email A (chuyện gì · được hứa gì · bằng chứng · muốn gì · hạn). Chưa cần gửi.',
          'Ngày 22: thuyết phục và thương lượng đời thường — giá cả, kế hoạch nhóm; câu **If we…, we could…** và **What if…? How about…?**',
        ],
      },
    ],
  },
];
