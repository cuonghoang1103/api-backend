/**
 * Tiếng Anh giao tiếp — NGÀY 8 (chặng 2 "Đời sống", A2+ → B1): thuê nhà.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd8-`.
 * Ngữ pháp trong câu: there is / there are (Is there…? / There isn't…) · hiện tại tiếp diễn cho việc đang xảy ra
 * (the shower is leaking, the heating isn't working) · nối câu bằng `still`, `right now`, `and also`.
 * Cảnh: Hân — sinh viên IT năm 3 — sang Dublin (Ireland) 4 tháng thực tập ở chi nhánh khách hàng, thuê một phòng trong căn hộ ở chung:
 * xem phòng (ảnh quảng cáo có bàn mà phòng thật không có, "the immersion", có người khác cũng muốn thuê), gọi chủ nhà báo
 * lò sưởi đèn đỏ + vòi sen rò + nấm mốc, và nước nhỏ từ trần nhà tắm lúc đêm (gõ nhầm cửa trước khi tìm ra máy giặt nhà trên).
 * Khác podcast en-ds-b2-01 (Phong thương lượng giá thuê, cọc, báo trước khi chuyển đi) và en-ds-b2-02 (hàng xóm phàn nàn tiếng
 * ồn, chuyện rửa bát với bạn ở chung): ở đây không mặc cả, không chuyện tiếng ồn — là xem phòng, báo hỏng và sự cố rò nước.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_8: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd8-nghe',
    kind: 'listening',
    title: 'Thuê nhà: xem phòng, hợp đồng, báo hỏng',
    goal: 'Nghe hiểu người cho thuê tả căn phòng (có gì, không có gì, tiền điện nước), chủ nhà hỏi về chỗ hỏng qua điện thoại, và hàng xóm nói gì khi có sự cố rò nước.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Hân**, sinh viên IT năm 3, sang **Dublin** (Ireland) 4 tháng thực tập ở chi nhánh của một khách hàng. Việc đầu tiên: tìm một phòng trong căn hộ ở chung.',
          'Ba cảnh: **xem phòng** · **gọi chủ nhà báo hỏng** · **nước nhỏ từ trần nhà lúc 11 giờ đêm**.',
          'Bạn cần nghe ra: **có gì, không có gì** (there is / there isn\'t), **cái gì đang hỏng** (is leaking, isn\'t working), **ai sửa, khi nào**.',
          'Giọng hôm nay có **Ireland**, Canada, New Zealand, Úc. Người Ireland dùng vài từ riêng (grand, the immersion) mà ở Anh, Mỹ không ai nói.',
          'Ngày 7 bạn tả **bệnh** của mình. Hôm nay bạn tả **bệnh của căn nhà**: cùng cách nghĩ, chỗ nào, từ bao giờ, nặng thế nào.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Xem phòng: ảnh một đằng, phòng một nẻo' },
      {
        t: 'canh',
        anh: ['office-building', 'key', 'woman-student', 'bed', 'camera-with-flash'],
        caption: 'Chiều thứ Năm. **Hân** tới xem một phòng trống trong căn hộ ba phòng ngủ. Người dẫn đi xem là **Orla**, người Ireland, đang ở trong căn hộ. Trên mạng phòng này có ảnh một cái bàn làm việc cạnh cửa sổ.',
      },
      {
        t: 'listen',
        id: 'gtd8-nghe-canh1',
        title: 'Scene 1 — Viewing the room',
        note: 'Nghe xem căn hộ có gì, không có gì, tiền điện nước tính thế nào, và vì sao Hân phải quyết nhanh.',
        lines: [
          { who: 'Orla', voice: 'ie-nu', text: "Hi, you must be Hân. Come in. Oh, the shoes are grand, don't worry about them.", vi: 'Chào, chắc em là Hân. Vào đi. À, giày cứ để đó, không sao đâu.' },
          { who: 'Hân', voice: 'us-nu', text: "Oh, okay. In Vietnam, we always take our shoes off inside, so it feels a bit strange.", vi: 'Ồ, vâng. Ở Việt Nam bọn em luôn cởi giày khi vào nhà, nên em thấy hơi lạ.' },
          { who: 'Orla', voice: 'ie-nu', text: "Ha, some people here do too. So, this is the kitchen. There's a dishwasher, and the washing machine is under the counter there.", vi: 'Ha, ở đây cũng có người cởi. Đây là bếp. Có máy rửa bát, còn máy giặt ở dưới mặt bếp kia.' },
          { who: 'Hân', voice: 'us-nu', text: 'Is there a dryer?', vi: 'Có máy sấy không chị?' },
          { who: 'Orla', voice: 'ie-nu', text: "There isn't, no. We use a clothes horse, or the balcony when it isn't raining. So, never, basically.", vi: 'Không có. Bọn chị phơi trên giá phơi đồ, hoặc ngoài ban công những hôm trời không mưa. Tức là gần như chẳng bao giờ.' },
          { who: 'Hân', voice: 'us-nu', text: 'Ha ha. And how many people are living here at the moment?', vi: 'Ha ha. Thế hiện giờ có bao nhiêu người đang ở đây ạ?' },
          { who: 'Orla', voice: 'ie-nu', text: "Just two of us: me and Ethan. He's Canadian, he's working from home today, actually. And this is the room.", vi: 'Có hai người thôi: chị và Ethan. Cậu ấy người Canada, hôm nay đang làm ở nhà đấy. Còn đây là phòng.' },
          { who: 'Hân', voice: 'us-nu', text: "Oh. It's smaller than in the photos. In the advert, there's a desk by the window. Is there a desk?", vi: 'Ồ. Nhỏ hơn trong ảnh. Trong tin đăng có cái bàn cạnh cửa sổ. Phòng có bàn không chị?' },
          { who: 'Orla', voice: 'ie-nu', text: "Ah, sorry, that photo's from my room. There isn't space for a desk in here, to be honest. It's a bit cosy.", vi: 'À, xin lỗi, ảnh đó chụp phòng chị. Nói thật là phòng này không có chỗ kê bàn. Hơi nhỏ xinh một chút.' },
          { who: 'Hân', voice: 'us-nu', text: "Hmm. I'm working from home two days a week, so I really need somewhere to work.", vi: 'Hừm. Em làm ở nhà hai ngày một tuần, nên em rất cần chỗ ngồi làm việc.' },
          { who: 'Orla', voice: 'ie-nu', text: "There's a big table in the living room, and it's empty all day. Ethan works there sometimes.", vi: 'Phòng khách có cái bàn to, cả ngày không ai ngồi. Ethan thỉnh thoảng làm ở đó.' },
          { who: 'Hân', voice: 'us-nu', text: 'Okay. And are the bills included in the rent?', vi: 'Vâng. Thế tiền điện nước có tính trong tiền thuê không ạ?' },
          { who: 'Orla', voice: 'ie-nu', text: "No. The rent's nine hundred and fifty a month, and we split the bills three ways. It's usually about ninety each, a bit more in winter.", vi: 'Không. Tiền thuê chín trăm năm mươi một tháng, còn hoá đơn thì chia ba. Thường mỗi người khoảng chín mươi, mùa đông nhiều hơn chút.' },
          { who: 'Hân', voice: 'us-nu', text: 'And is there always hot water?', vi: 'Thế lúc nào cũng có nước nóng ạ?' },
          { who: 'Orla', voice: 'ie-nu', text: "Not always. You put the immersion on about half an hour before your shower.", vi: 'Không phải lúc nào cũng có. Em bật "immersion" khoảng nửa tiếng trước khi tắm.' },
          { who: 'Hân', voice: 'us-nu', text: 'Sorry, the… immersion?', vi: 'Xin lỗi, cái… "immersion" ạ?' },
          { who: 'Orla', voice: 'ie-nu', text: "The water heater. There's a switch outside the bathroom. Just turn it off after, or the electricity bill goes mad.", vi: 'Bình nóng lạnh ấy. Có công tắc ngoài cửa nhà tắm. Tắm xong nhớ tắt, không thì tiền điện tăng vọt.' },
          { who: 'Hân', voice: 'us-nu', text: 'Got it. Is anyone else interested in the room?', vi: 'Em hiểu rồi. Có ai khác muốn thuê phòng này không chị?' },
          { who: 'Orla', voice: 'ie-nu', text: "There are two more people coming to see it this evening, so if you want it, let me know by tomorrow lunchtime.", vi: 'Tối nay còn hai người nữa tới xem, nên nếu em muốn thì báo chị trước trưa mai nhé.' },
          { who: 'Hân', voice: 'us-nu', text: "Okay. Can I take a few photos, so I can think about it tonight?", vi: 'Vâng. Em chụp vài tấm ảnh được không, để tối nay em suy nghĩ?' },
          { who: 'Orla', voice: 'ie-nu', text: 'Of course, go ahead.', vi: 'Được chứ, em cứ chụp.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd8-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Căn hộ KHÔNG có thứ gì?',
            options: ['Máy rửa bát', 'Máy giặt', 'Máy sấy quần áo', 'Ban công'],
            correct: 2,
            why: '"Is there a dryer?" — "**There isn\'t**, no." Có máy rửa bát, máy giặt dưới mặt bếp, và phơi ngoài ban công.',
          },
          {
            q: 'Vì sao phòng trông khác ảnh trên mạng?',
            options: ['Ảnh chụp từ năm ngoái', 'Ảnh là phòng của Orla, không phải phòng cho thuê', 'Bàn bị mang đi sửa', 'Hân nhìn nhầm ảnh'],
            correct: 1,
            why: '"Sorry, **that photo\'s from my room**." Đây là lý do luôn phải **xem tận nơi** trước khi trả tiền.',
          },
          {
            q: 'Mỗi tháng Hân trả khoảng bao nhiêu cả tiền thuê lẫn điện nước?',
            options: ['950 euro', 'Khoảng 1.040 euro', 'Khoảng 1.220 euro', '90 euro'],
            correct: 1,
            why: 'Tiền thuê **950** + hoá đơn chia ba khoảng **90** mỗi người = khoảng **1.040** euro, mùa đông nhiều hơn.',
          },
          {
            q: '"The immersion" là gì?',
            options: ['Máy giặt', 'Bình nước nóng phải bật trước khi tắm', 'Lò sưởi trong phòng ngủ', 'Một loại hợp đồng'],
            correct: 1,
            why: 'Orla giải thích: "**The water heater**. There\'s a switch outside the bathroom." Từ này rất Ireland: bật trước khoảng nửa tiếng, tắm xong tắt.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Ba tuần sau: gọi chủ nhà' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'cold-face', 'droplet', 'wrench', 'man-mechanic'],
        caption: 'Hân đã thuê phòng. Tối thứ Hai trời lạnh, lò sưởi không ấm, vòi sen rò nước ra sàn, góc tường cạnh cửa sổ có vệt mốc đen. Hân gọi chủ nhà, **ông Gerry**.',
      },
      {
        t: 'listen',
        id: 'gtd8-nghe-canh2',
        title: 'Scene 2 — Calling the landlord',
        note: 'Nghe xem Hân báo những chỗ hỏng nào, Gerry đoán lò sưởi bị gì, và ai ở nhà khi thợ tới.',
        lines: [
          { who: 'Gerry', voice: 'ie-nam', text: 'Hello, Gerry speaking.', vi: 'Alô, Gerry nghe.' },
          { who: 'Hân', voice: 'us-nu', text: "Hi, Gerry, it's Hân from Flat 4C. Sorry to bother you in the evening, but the heating isn't working.", vi: 'Chào ông Gerry, cháu là Hân ở căn 4C. Xin lỗi làm phiền ông buổi tối, nhưng lò sưởi không chạy ạ.' },
          { who: 'Gerry', voice: 'ie-nam', text: "Ah, right. Is the immersion on? People always forget the immersion.", vi: 'À, thế à. "Immersion" có bật không? Người ta hay quên cái đó lắm.' },
          { who: 'Hân', voice: 'us-nu', text: "Yes, it's on. The water is hot, but the radiators are completely cold.", vi: 'Có ạ, nó đang bật. Nước vẫn nóng, nhưng mấy cái lò sưởi thì lạnh ngắt.' },
          { who: 'Gerry', voice: 'ie-nam', text: "Okay. Have a look at the boiler, in the press next to the fridge. Is there a light on it?", vi: 'Được. Cháu xem cái nồi hơi, trong tủ cạnh tủ lạnh ấy. Trên đó có đèn sáng không?' },
          { who: 'Hân', voice: 'us-nu', text: "Sorry, in the… press?", vi: 'Xin lỗi, trong cái… "press" ạ?' },
          { who: 'Gerry', voice: 'ie-nam', text: 'The cupboard, sorry. The big white cupboard.', vi: 'Cái tủ ấy, xin lỗi. Cái tủ trắng to.' },
          { who: 'Hân', voice: 'us-nu', text: "Oh, okay. Yes, there's a red light, and it's beeping every few seconds.", vi: 'À, vâng. Có ạ, có một đèn đỏ, và cứ vài giây nó lại kêu bíp.' },
          { who: 'Gerry', voice: 'ie-nam', text: "That'll be the pressure. It's an old boiler. I'll send a plumber. Will anyone be in on Thursday morning?", vi: 'Chắc là do áp suất. Nồi hơi cũ rồi. Tôi sẽ gọi thợ nước. Sáng thứ Năm có ai ở nhà không?' },
          { who: 'Hân', voice: 'us-nu', text: "I'm working in the office on Thursday, but Ethan is working from home, so he can let them in.", vi: 'Thứ Năm cháu làm ở văn phòng, nhưng Ethan làm ở nhà, nên anh ấy mở cửa cho thợ được.' },
          { who: 'Hân', voice: 'us-nu', text: "And there are two more problems. The shower is leaking. Every time we use it, there's water all over the floor.", vi: 'Với lại còn hai chỗ nữa ạ. Vòi sen bị rò. Lần nào tắm xong nước cũng tràn ra khắp sàn.' },
          { who: 'Gerry', voice: 'ie-nam', text: 'Is it coming from the shower head, or from under the door?', vi: 'Nước chảy ra từ bát sen hay từ dưới cửa kính?' },
          { who: 'Hân', voice: 'us-nu', text: "From the bottom of the glass door, I think. And there's black mould on my bedroom wall, near the window.", vi: 'Cháu nghĩ là từ chân cửa kính. Còn tường phòng ngủ cháu có mốc đen, gần cửa sổ.' },
          { who: 'Gerry', voice: 'ie-nam', text: "Ah, that's just these old buildings. Open the window a bit every morning and it'll be grand.", vi: 'À, nhà cũ thì vậy thôi. Sáng nào cũng mở hé cửa sổ ra là ổn.' },
          { who: 'Hân', voice: 'us-nu', text: "I'm opening it every day, but the mould is still getting bigger. Could the plumber look at that too, please?", vi: 'Ngày nào cháu cũng đang mở, nhưng vết mốc vẫn cứ to ra. Ông nhờ thợ xem luôn chỗ đó được không ạ?' },
          { who: 'Gerry', voice: 'ie-nam', text: "Fair enough. I'll ask him to look at all three.", vi: 'Cũng phải. Tôi sẽ bảo cậu ấy xem cả ba chỗ.' },
          { who: 'Hân', voice: 'us-nu', text: "Thank you. Could you text me the time on Thursday, so I can tell Ethan?", vi: 'Cảm ơn ông. Ông nhắn giúp cháu giờ thợ tới hôm thứ Năm nhé, để cháu báo Ethan.' },
          { who: 'Gerry', voice: 'ie-nam', text: 'Will do. Talk soon.', vi: 'Được. Nói chuyện sau nhé.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd8-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Hân báo mấy chỗ hỏng?',
            options: ['Một: lò sưởi', 'Hai: lò sưởi và vòi sen', 'Ba: lò sưởi, vòi sen rò, mốc trên tường', 'Bốn, gồm cả máy giặt'],
            correct: 2,
            why: '"the heating isn\'t working" · "the shower is leaking" · "there\'s black mould on my bedroom wall". Gerry hứa: "look at **all three**".',
          },
          {
            q: '"The press" trong câu của Gerry là gì?',
            options: ['Cái tủ', 'Cái nút bấm', 'Tờ báo', 'Bàn là'],
            correct: 0,
            why: 'Ở Ireland, **press** = **cupboard** (tủ âm tường, tủ bếp). Hân hỏi lại đúng chỗ không hiểu, Gerry giải thích ngay.',
          },
          {
            q: 'Gerry bảo mốc là do nhà cũ, chỉ cần mở cửa sổ. Hân phản hồi thế nào?',
            options: ['Đồng ý, không nói gì thêm', 'Nói mình ngày nào cũng mở mà mốc vẫn to ra, nhờ thợ xem luôn', 'Doạ chuyển nhà', 'Tự đi mua thuốc tẩy mốc'],
            correct: 1,
            why: '"I\'m opening it every day, but the mould is **still** getting bigger. Could the plumber look at that too?" Lịch sự nhưng không bỏ qua: đưa **bằng chứng** rồi **đề nghị cụ thể**.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — 11 giờ đêm: nước nhỏ từ trần nhà' },
      {
        t: 'canh',
        anh: ['droplet', 'bathtub', 'door', 'face-with-open-mouth', 'hot-beverage'],
        caption: 'Tối thứ Bảy, Hân vào nhà tắm thì thấy **nước nhỏ giọt từ trần**, một vệt ướt đang loang ra. Hân lên tầng trên gõ cửa. Người mở cửa đầu tiên là **Bruce**, người New Zealand.',
      },
      {
        t: 'listen',
        id: 'gtd8-nghe-canh3',
        title: 'Scene 3 — Water through the ceiling',
        note: 'Nghe xem vì sao Hân gõ nhầm cửa, nước rò từ đâu, và hai người hàng xóm hứa làm gì.',
        lines: [
          { who: 'Hân', voice: 'us-nu', text: "Hi, sorry to bother you so late. I live downstairs, and there's water coming through my bathroom ceiling. Are you running a bath, by any chance?", vi: 'Chào chú, xin lỗi làm phiền muộn thế này. Cháu ở tầng dưới, và nước đang nhỏ qua trần nhà tắm của cháu. Có phải chú đang xả nước bồn tắm không ạ?' },
          { who: 'Bruce', voice: 'nz-nam', text: "Water? No, nothing's running here. I'm just watching the rugby. Which flat are you in?", vi: 'Nước à? Không, ở đây không xả gì cả. Chú đang xem bóng bầu dục thôi. Cháu ở căn nào?' },
          { who: 'Hân', voice: 'us-nu', text: '4C.', vi: '4C ạ.' },
          { who: 'Bruce', voice: 'nz-nam', text: "Then it's not me. I'm above 4B. The flat right above you is 5C, next door. That's Kirsty's.", vi: 'Vậy không phải chú rồi. Chú ở trên căn 4B. Căn ngay trên đầu cháu là 5C, nhà bên cạnh. Nhà Kirsty đấy.' },
          { who: 'Hân', voice: 'us-nu', text: "Oh, sorry! Thank you so much.", vi: 'Ôi, cháu xin lỗi! Cảm ơn chú nhiều.' },
          { who: 'Bruce', voice: 'nz-nam', text: "No worries. Take some photos of the ceiling before you do anything else.", vi: 'Không sao. Trước khi làm gì thì chụp vài tấm ảnh cái trần đã.' },
          { who: 'Kirsty', voice: 'au-nu', text: "Hi… Oh, is everything okay?", vi: 'Chào… Ồ, có chuyện gì không?' },
          { who: 'Hân', voice: 'us-nu', text: "Hi, I'm Hân from 4C, right below you. I'm really sorry to bother you, but water is dripping through my bathroom ceiling, and it's getting worse.", vi: 'Chào chị, em là Hân ở căn 4C, ngay dưới nhà chị. Em rất xin lỗi đã làm phiền, nhưng nước đang nhỏ qua trần nhà tắm của em, và càng lúc càng nhiều.' },
          { who: 'Kirsty', voice: 'au-nu', text: "Oh no! Hang on, let me check… Oh my God, the washing machine is leaking! There's water everywhere in here.", vi: 'Ôi không! Đợi chị xem… Trời ơi, máy giặt đang rò nước! Nước khắp nơi trong này.' },
          { who: 'Hân', voice: 'us-nu', text: 'Can you turn it off?', vi: 'Chị tắt nó đi được không?' },
          { who: 'Kirsty', voice: 'au-nu', text: "I'm turning it off now… done. And there's a little tap behind it. I'm closing that too.", vi: 'Chị đang tắt đây… xong rồi. Với lại đằng sau nó có một cái van nhỏ. Chị khoá luôn.' },
          { who: 'Hân', voice: 'us-nu', text: 'Is the water still coming out?', vi: 'Nước còn chảy ra nữa không chị?' },
          { who: 'Kirsty', voice: 'au-nu', text: "No, it's stopped. I'm so sorry. Is there much damage downstairs?", vi: 'Không, ngừng rồi. Chị xin lỗi lắm. Ở dưới có hư hại nhiều không em?' },
          { who: 'Hân', voice: 'us-nu', text: "There's a big wet patch on the ceiling and some water on the floor. I'm taking photos for my landlord.", vi: 'Có một vệt ướt to trên trần và ít nước dưới sàn. Em đang chụp ảnh để gửi chủ nhà.' },
          { who: 'Kirsty', voice: 'au-nu', text: "Good idea. Give me your number, and I'll tell my landlord tonight. If anything needs fixing, it's on us.", vi: 'Hay đấy. Cho chị số của em, tối nay chị báo chủ nhà chị. Có gì cần sửa thì bên chị chịu.' },
          { who: 'Hân', voice: 'us-nu', text: 'Thanks, Kirsty. Here you go.', vi: 'Cảm ơn chị Kirsty. Số em đây ạ.' },
          { who: 'Kirsty', voice: 'au-nu', text: "And come up for a cuppa tomorrow. It's the least I can do.", vi: 'Mai lên nhà chị uống trà nhé. Ít nhất chị cũng phải làm được chừng đó.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd8-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Bruce không phải người làm rò nước?',
            options: ['Ông ấy không có nhà tắm', 'Căn của ông ấy nằm trên căn 4B, không phải trên 4C', 'Ông ấy đang tắm', 'Ông ấy ở tầng dưới'],
            correct: 1,
            why: '"I\'m **above 4B**. The flat **right above you** is 5C." Hân lên đúng tầng nhưng gõ nhầm căn.',
          },
          {
            q: 'Nước rò từ đâu?',
            options: ['Bồn tắm nhà Kirsty', 'Máy giặt nhà Kirsty', 'Mái nhà', 'Lò sưởi'],
            correct: 1,
            why: '"Oh my God, **the washing machine is leaking**!" Hiện tại tiếp diễn: việc **đang** xảy ra ngay lúc nói.',
          },
          {
            q: '"If anything needs fixing, it\'s on us" nghĩa là gì?',
            options: ['Hân phải tự sửa', 'Bên Kirsty sẽ chịu chi phí sửa', 'Chủ nhà của Hân trả', 'Kirsty không muốn bàn chuyện đó'],
            correct: 1,
            why: '**It\'s on us / It\'s on me** = chúng tôi / tôi chịu (trả tiền). Cùng nghĩa khi ai đó nói "Lunch is on me" = bữa trưa tôi mời.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Các câu dưới đây có **there\'s / there are** nói rất nhanh (nghe như "dez", "de-rơ"), số căn hộ và đuôi **-ing**. Nghe tối đa 3 lần rồi gõ lại cả câu.',
      },
      {
        t: 'dictation',
        id: 'gtd8-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — trong bếp', spell: "There's a dishwasher, but there isn't a dryer.", answer: "There's a dishwasher, but there isn't a dryer.", alt: ['There is a dishwasher, but there is not a dryer.', "There's a dishwasher but there isn't a dryer.", 'There is a dishwasher, but there isn\'t a dryer.'] },
          { label: 'Câu 2 — hoá đơn', spell: 'We split the bills three ways.', answer: 'We split the bills three ways.', alt: ['We split the bills 3 ways.'] },
          { label: 'Câu 3 — người khác cũng muốn thuê', spell: 'There are two more people coming to see it.', answer: 'There are two more people coming to see it.', alt: ['There are 2 more people coming to see it.'] },
          { label: 'Câu 4 — báo hỏng', spell: "The heating isn't working.", answer: "The heating isn't working.", alt: ['The heating is not working.'] },
          { label: 'Câu 5 — lò sưởi', spell: "There's a red light, and it's beeping.", answer: "There's a red light, and it's beeping.", alt: ["There's a red light and it's beeping.", 'There is a red light, and it is beeping.'] },
          { label: 'Câu 6 — số căn hộ', spell: 'The flat right above you is 5C.', answer: 'The flat right above you is 5C.', alt: ['The flat right above you is five C.', 'The flat right above you is 5 C.'] },
          { label: 'Câu 7 — sự cố', spell: 'Water is dripping through my bathroom ceiling.', answer: 'Water is dripping through my bathroom ceiling.', alt: ["Water's dripping through my bathroom ceiling."] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp / làm'],
        rows: [
          ["The shoes are grand. (Ireland)", '**grand** = ổn, không sao. Không cần cởi giày.', "Okay, thanks."],
          ["It's a bit cosy.", 'Phòng **nhỏ**. Người cho thuê nói giảm.', "Can I measure it? · Is there space for a desk?"],
          ['There are a few people interested.', 'Phải quyết nhanh. Có thể thật, có thể để ép bạn.', 'Xem kỹ, chụp ảnh, nhưng đừng trả tiền khi chưa đọc hợp đồng.'],
          ["That's just these old buildings.", 'Đổ cho nhà cũ để khỏi sửa.', "I understand, but it's getting worse. Could someone look at it?"],
          ["I'll get someone to look at it.", 'Lời hứa **chung chung**: chưa có ngày, chưa có người.', 'Great. When do you think they can come?'],
          ['Will anyone be in?', 'Có ai **ở nhà** để mở cửa cho thợ không? "be in" = ở nhà, "be out" = đi vắng.', "I'll be out, but my flatmate will be in."],
          ["It's on us.", 'Chúng tôi chịu chi phí.', "That's really kind, thanks."],
          ['Come up for a cuppa.', 'Mời lên uống tách trà. Lời mời **thật**, nhận lời là cách làm lành.', "I'd love to. What time?"],
        ],
        caption: 'Chủ nhà nói "**I\'ll sort it**", "**Leave it with me**" mà không nói ngày: luôn hỏi tiếp **When…?** và xin **nhắn lại bằng chữ**.',
      },
      {
        t: 'note',
        title: 'Mẹo: chủ nhà nói nhanh qua điện thoại, giọng lạ, thì làm gì',
        items: [
          'Điện thoại khó nghe hơn gặp mặt vì **không nhìn được miệng**. Trước khi gọi, viết sẵn 3 dòng: **cái gì hỏng, từ bao giờ, nặng thế nào**. Không nghe kịp thì ít nhất bạn đã nói đủ.',
          'Gặp một từ lạ (press, immersion), hỏi lại **đúng từ đó**, lên giọng ở cuối: "Sorry, in the… **press**?" Người ta sẽ đổi sang từ quen hơn.',
          'Giọng Ireland hay đọc **th** thành **t**: "three" nghe như "tree", "think" như "tink", "Thursday" như "Tursday". Nghe thấy "tree o\'clock" thì đó là **ba giờ**.',
          'Kết thúc cuộc gọi bằng xin **nhắn lại bằng chữ**: "Could you text me the day and time?" Vừa khỏi nghe sót, vừa có **bằng chứng** chủ nhà đã hứa.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh / Ireland', 'Mỹ', 'Úc'],
        rows: [
          ['Căn hộ', 'flat', 'apartment', 'unit · apartment'],
          ['Người ở chung', 'flatmate · housemate', 'roommate', 'flatmate · housemate'],
          ['Tiền đặt cọc', 'deposit', 'security deposit', '**bond**'],
          ['Người môi giới cho thuê', 'letting agent', 'property manager · leasing office', 'real estate agent'],
          ['Hợp đồng thuê', 'tenancy agreement · lease', 'lease', 'lease'],
          ['Tiền điện nước', 'bills', 'utilities', 'bills'],
          ['Tầng trệt / tầng 2 kiểu Việt Nam', 'ground floor / first floor', 'first floor / second floor', 'ground floor / first floor'],
          ['Vòi nước · tủ', 'tap · cupboard (Ireland: **press**)', 'faucet · cabinet', 'tap · cupboard'],
        ],
        caption: 'Chú ý **tầng**: ở Anh, Ireland, Úc "**first floor**" là tầng **trên** tầng trệt (tầng 2 kiểu Việt Nam). Ở Mỹ "first floor" lại chính là tầng trệt.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-b2-01 · Is the Rent Negotiable?** — Phong xem một căn hộ, hỏi về điện nước, tiền cọc, sửa chữa rồi thương lượng giá thuê và đòi ghi mọi thứ vào hợp đồng.',
          '**en-ds-b2-02 · Can We Talk About the Noise?** — hàng xóm tầng dưới gõ cửa vì nhạc to, rồi chuyện rửa bát và xe đạp với bạn ở chung.',
          'Hai tập này mức **B2**, nhanh và dài hơn bài hôm nay. Nghe sau khi xong Ngày 8; nghe lần đầu cứ bật lời thoại.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd8-noi',
    kind: 'speaking',
    title: 'Nói chuyện với chủ nhà & hàng xóm',
    goal: 'Hỏi được căn phòng có gì, tả đúng chỗ hỏng đang xảy ra bằng there is / there are và hiện tại tiếp diễn, nhờ sửa và nói chuyện với hàng xóm khi có sự cố mà không làm mất lòng.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu**: hỏi khi xem phòng, tả chỗ hỏng, nhờ sửa, hẹn thợ, gõ cửa hàng xóm.',
          'Điểm ngữ pháp: **there is / there are** (và Is there…? / There isn\'t…) · **hiện tại tiếp diễn** cho việc đang xảy ra. Nối câu: **still**, **right now**, **and also**.',
          'Nói với **bạn ở chung, chủ nhà, công ty quản lý** ở ba mức khác nhau.',
          'Cởi giày, gõ cửa nhà bên, tặng quà hàng xóm: Việt Nam, Anh – Ireland – Mỹ – Úc và Nhật khác nhau.',
          'Cuối bài: nhập vai xem một căn hộ khác với người môi giới.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Theo thứ tự một lần thuê nhà: **hỏi phòng → xem phòng → báo hỏng → hẹn thợ → hàng xóm**. Bấm loa từng câu, nói to theo, rồi bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Is the room still available?', pos: 'phr', ipa: '/ɪz ðə ˈruːm stɪl əˈveɪləbl/', vi: 'Phòng còn trống không?', ex: "Hi, I saw your advert. Is the room still available?", exVi: 'Chào anh/chị, tôi thấy tin đăng. Phòng còn trống không?' },
          { w: 'arrange a viewing', pos: 'v', ipa: '/əˌreɪndʒ ə ˈvjuːɪŋ/', vi: 'hẹn đi xem nhà', ex: "Could we arrange a viewing this week?", exVi: 'Mình hẹn xem phòng trong tuần này được không?', more: 'Nói thân hơn: **Can I come and see it?**', anh: 'key' },
          { w: 'How much is the rent?', pos: 'phr', ipa: '/haʊ ˈmʌtʃ ɪz ðə ˈrent/', vi: 'Tiền thuê bao nhiêu?', ex: 'How much is the rent a month?', exVi: 'Tiền thuê một tháng bao nhiêu?', anh: 'euro-banknote' },
          { w: 'Are bills included?', pos: 'phr', ipa: '/ɑːr ˈbɪlz ɪnˈkluːdɪd/', vi: 'Có bao gồm điện nước không?', ex: 'Are bills included, or do we split them?', exVi: 'Có bao gồm điện nước không, hay mình chia nhau?', more: 'Mỹ: **Are utilities included?**', anh: 'receipt' },
          { w: 'How much is the deposit?', pos: 'phr', ipa: '/haʊ ˈmʌtʃ ɪz ðə dɪˈpɑːzɪt/', vi: 'Tiền cọc bao nhiêu?', ex: "How much is the deposit, and when do I get it back?", exVi: 'Tiền cọc bao nhiêu, và khi nào tôi được trả lại?' },
          { w: 'Is there a…?', pos: 'phr', ipa: '/ɪz ðer ə/', vi: 'Có… không?', ex: 'Is there a washing machine?', exVi: 'Có máy giặt không?', more: 'Số nhiều: **Are there any** shops nearby?' },
          { w: 'How many people are living here?', pos: 'phr', ipa: '/haʊ ˈmeni ˈpiːpl ər ˈlɪvɪŋ hɪr/', vi: 'Hiện có bao nhiêu người đang ở đây?', ex: 'How many people are living here at the moment?', exVi: 'Hiện giờ có bao nhiêu người đang ở đây?' },
          { w: 'flatmate / housemate', pos: 'n', ipa: '/ˈflætmeɪt/ /ˈhaʊsmeɪt/', vi: 'bạn ở chung căn hộ / chung nhà', ex: 'My flatmate is working from home today.', exVi: 'Bạn ở chung của tôi hôm nay làm ở nhà.', more: 'Mỹ: **roommate** (dù mỗi người một phòng).' },
          { w: 'landlord / landlady', pos: 'n', ipa: '/ˈlændlɔːrd/ /ˈlændleɪdi/', vi: 'chủ nhà cho thuê (nam / nữ)', ex: "I'll ask the landlord about the heating.", exVi: 'Tôi sẽ hỏi chủ nhà chuyện lò sưởi.', anh: 'man-office-worker' },
          { w: 'tenancy agreement / lease', pos: 'n', ipa: '/ˈtenənsi əˌɡriːmənt/ /liːs/', vi: 'hợp đồng thuê nhà', ex: 'Can I read the tenancy agreement before I pay?', exVi: 'Tôi đọc hợp đồng thuê trước khi trả tiền được không?', anh: 'page-facing-up' },
          { w: "It's smaller than in the photos.", pos: 'phr', ipa: '/ɪts ˈsmɔːlər ðən ɪn ðə ˈfoʊtoʊz/', vi: 'Nhỏ hơn trong ảnh.', ex: "It's nice, but it's smaller than in the photos.", exVi: 'Đẹp, nhưng nhỏ hơn trong ảnh.', more: 'Ôn so sánh của Ngày 5: smaller, bigger, cheaper, **more expensive**.' },
          { w: 'Should I take my shoes off?', pos: 'phr', ipa: '/ʃʊd aɪ teɪk maɪ ˈʃuːz ɔːf/', vi: 'Tôi có nên cởi giày không?', ex: 'Hi! Should I take my shoes off?', exVi: 'Chào! Tôi có nên cởi giày không?', anh: 'mans-shoe' },
          { w: 'The shower is leaking.', pos: 'phr', ipa: '/ðə ˈʃaʊər ɪz ˈliːkɪŋ/', vi: 'Vòi sen đang rò nước.', ex: "The shower is leaking, and there's water all over the floor.", exVi: 'Vòi sen đang rò, nước tràn khắp sàn.', anh: 'shower' },
          { w: 'The tap is dripping.', pos: 'phr', ipa: '/ðə ˈtæp ɪz ˈdrɪpɪŋ/', vi: 'Vòi nước đang nhỏ giọt.', ex: "The kitchen tap is dripping. It's driving me mad.", exVi: 'Vòi bếp cứ nhỏ giọt. Phát điên mất.', more: 'leak = rò (nước ra chỗ không nên ra) · drip = nhỏ từng giọt', anh: 'droplet' },
          { w: "The heating isn't working.", pos: 'phr', ipa: '/ðə ˈhiːtɪŋ ˈɪznt ˈwɝːkɪŋ/', vi: 'Lò sưởi không chạy.', ex: "The heating isn't working, and it's really cold.", exVi: 'Lò sưởi không chạy, mà trời lạnh lắm.', more: 'Câu dùng cho **mọi thứ hỏng**: the Wi-Fi / the lock / the fridge **isn\'t working**.', anh: 'cold-face' },
          { w: 'The sink is blocked.', pos: 'phr', ipa: '/ðə ˈsɪŋk ɪz ˈblɑːkt/', vi: 'Bồn rửa bị tắc.', ex: "The bathroom sink is blocked. The water isn't going down.", exVi: 'Bồn rửa nhà tắm bị tắc. Nước không xuống.', more: 'Mỹ hay nói **clogged**.' },
          { w: "There's mould on the wall.", pos: 'phr', ipa: '/ðerz ˈmoʊld ɑːn ðə ˈwɔːl/', vi: 'Tường bị mốc.', ex: "There's black mould on the wall near the window.", exVi: 'Tường gần cửa sổ có mốc đen.', more: 'Mỹ viết **mold**.' },
          { w: "It's making a strange noise.", pos: 'phr', ipa: '/ɪts ˈmeɪkɪŋ ə ˌstreɪndʒ ˈnɔɪz/', vi: 'Nó đang kêu tiếng lạ.', ex: "The fridge is making a strange noise at night.", exVi: 'Tủ lạnh kêu tiếng lạ vào ban đêm.' },
          { w: "There's water coming through the ceiling.", pos: 'phr', ipa: '/ðerz ˈwɔːtər ˈkʌmɪŋ θruː ðə ˈsiːlɪŋ/', vi: 'Nước đang chảy qua trần nhà.', ex: "Sorry, there's water coming through my ceiling. Is your bath running?", exVi: 'Xin lỗi, nước đang chảy qua trần nhà tôi. Bồn tắm nhà anh/chị có đang xả không?' },
          { w: "It's getting worse.", pos: 'phr', ipa: '/ɪts ˈɡetɪŋ ˈwɝːs/', vi: 'Nó đang tệ hơn.', ex: "The crack is getting worse every week.", exVi: 'Vết nứt mỗi tuần một tệ hơn.' },
          { w: 'Could you send someone to look at it?', pos: 'phr', ipa: '/kʊd ju ˈsend ˌsʌmwʌn tə ˈlʊk æt ɪt/', vi: 'Anh/chị cho người tới xem giúp được không?', ex: 'The boiler is beeping. Could you send someone to look at it?', exVi: 'Nồi hơi cứ kêu bíp. Ông cho người tới xem giúp được không?', anh: 'man-mechanic' },
          { w: 'When can someone come?', pos: 'phr', ipa: '/wen kən ˌsʌmwʌn ˈkʌm/', vi: 'Khi nào có người tới được?', ex: "Thanks. When can someone come?", exVi: 'Cảm ơn. Khi nào có người tới được ạ?' },
          { w: "I'll be in / I'll be out.", pos: 'phr', ipa: '/aɪl bi ˈɪn/ /aɪl bi ˈaʊt/', vi: 'Tôi sẽ ở nhà / Tôi sẽ đi vắng.', ex: "I'll be out on Thursday, but my flatmate will be in.", exVi: 'Thứ Năm tôi đi vắng, nhưng bạn ở chung sẽ ở nhà.' },
          { w: 'Sorry to bother you, but…', pos: 'phr', ipa: '/ˈsɑːri tə ˈbɑːðər ju bʌt/', vi: 'Xin lỗi đã làm phiền, nhưng…', ex: "Sorry to bother you, but is this your parcel?", exVi: 'Xin lỗi đã làm phiền, nhưng đây có phải bưu kiện của anh/chị không?', anh: 'door' },
          { w: "I'm in 4C, right below you.", pos: 'phr', ipa: '/aɪm ɪn ˌfɔːr ˈsiː raɪt bɪˈloʊ ju/', vi: 'Tôi ở căn 4C, ngay dưới nhà bạn.', ex: "Hi, I'm Hân. I'm in 4C, right below you.", exVi: 'Chào, tôi là Hân. Tôi ở căn 4C, ngay dưới nhà bạn.', more: 'right above / right below / next door / across the hall' },
          { w: 'Is everything okay?', pos: 'phr', ipa: '/ɪz ˈevriθɪŋ oʊˈkeɪ/', vi: 'Mọi chuyện ổn chứ?', ex: 'Oh, hi! Is everything okay?', exVi: 'Ồ, chào! Mọi chuyện ổn chứ?' },
          { w: 'Which day are the bins collected?', pos: 'phr', ipa: '/wɪtʃ ˈdeɪ ər ðə ˈbɪnz kəˈlektɪd/', vi: 'Thứ mấy người ta thu rác?', ex: 'Sorry, which day are the bins collected here?', exVi: 'Xin lỗi, ở đây thứ mấy thu rác?', more: 'Nói gọn: **When\'s bin day?**', anh: 'wastebasket' },
          { w: "I've attached a photo.", pos: 'phr', ipa: '/aɪv əˈtætʃt ə ˈfoʊtoʊ/', vi: 'Tôi gửi kèm một tấm ảnh.', ex: "I've attached a photo of the leak.", exVi: 'Tôi gửi kèm ảnh chỗ rò.', anh: 'camera-with-flash' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Với **bạn ở chung** nói thoải mái. Với **chủ nhà** là quan hệ làm ăn: lịch sự nhưng rõ ràng. Với **công ty quản lý nhà** (letting agent) thì viết như thư công việc.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn ở chung)', 'Trung tính (chủ nhà)', 'Trang trọng (công ty quản lý)'],
        rows: [
          ['Báo hỏng', "The shower's leaking again, ugh.", "Hi Gerry, the shower is leaking.", "I'm writing to report a leak in the shower in Flat 4C."],
          ['Nhờ sửa', "Can you have a look?", 'Could you send someone to look at it?', 'I would be grateful if you could arrange a repair.'],
          ['Hỏi khi nào', 'When are they coming?', 'When can someone come?', 'Could you let me know when a technician is available?'],
          ['Nhắc lần hai', 'Any news on the plumber?', "Just checking in about the shower. It's still leaking.", 'I am following up on my email of 3 November. The problem has not been fixed.'],
          ['Gõ cửa hàng xóm', 'Hey, sorry, quick one…', 'Sorry to bother you, but…', "I'm sorry to disturb you, but there seems to be a problem."],
          ['Cảm ơn', 'Legend, thanks!', 'Thanks for sorting it so quickly.', 'Thank you for arranging the repair so promptly.'],
        ],
        caption: '**Nhắc lần hai** là chỗ người Việt hay ngại nhất. Ở Anh, Ireland, nhắc lịch sự sau 3–5 ngày là **bình thường**, không ai coi là hỗn.',
      },
      {
        t: 'note',
        title: 'Mẹo: lịch sự nhưng không bỏ qua',
        items: [
          'Chủ nhà nói "Ah, that\'s normal" về chỗ hỏng, bạn **không cần cãi**. Nói một câu bằng chứng + một đề nghị: "I\'m opening the window every day, **but** it\'s **still** getting worse. **Could someone look at it?**"',
          'Câu mở đầu bằng **I understand, but…** giúp bạn không đồng ý mà vẫn mềm.',
          'Việc lớn (nước, điện, gas, khoá cửa) báo **ngay**. Việc nhỏ (bóng đèn, vòi nhỏ giọt) gom lại báo một lần.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt dùng chữ "**có**" cho cả hai việc: "tôi **có** một cái xe" và "trong phòng **có** một cái bàn". Tiếng Anh tách ra: người sở hữu thì **have**, còn "ở đâu đó có cái gì" thì **there is / there are**. Việc **đang** hỏng ngay lúc này thì dùng **am / is / are + V-ing**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: "There is (There's) + a / an + N + nơi",
            vi: 'Ở đâu đó có một thứ. Khi nói luôn rút gọn thành there\'s.',
            examples: [
              { en: "There's a washing machine in the kitchen.", vi: 'Trong bếp có máy giặt.' },
              { en: "There's a big table in the living room.", vi: 'Phòng khách có một cái bàn to.' },
              { en: "There's mould on my bedroom wall.", vi: 'Tường phòng ngủ của tôi có mốc.' },
            ],
          },
          {
            formula: 'There are + số / some / a lot of + N(s)',
            vi: 'Có nhiều thứ. Danh từ số nhiều đi với are.',
            examples: [
              { en: 'There are three bedrooms.', vi: 'Có ba phòng ngủ.' },
              { en: 'There are two more people coming tonight.', vi: 'Tối nay còn hai người nữa tới.' },
              { en: 'There are a lot of shops near the station.', vi: 'Gần ga có nhiều cửa hàng.' },
            ],
          },
          {
            formula: 'Is there a / an + N? · Are there any + N(s)? · There isn\'t a… / There aren\'t any…',
            vi: 'Hỏi và trả lời "có… không". Câu hỏi đảo is / are lên trước there.',
            examples: [
              { en: 'Is there a dryer? — No, there isn\'t.', vi: 'Có máy sấy không? — Không có.' },
              { en: 'Are there any supermarkets nearby?', vi: 'Gần đây có siêu thị nào không?' },
              { en: "There aren't any curtains in the room.", vi: 'Trong phòng không có rèm.' },
            ],
          },
          {
            formula: 'S + am / is / are + V-ing',
            vi: 'Việc **đang** xảy ra ngay lúc nói: chỗ hỏng, sự cố, việc người khác đang làm.',
            examples: [
              { en: 'The shower is leaking.', vi: 'Vòi sen đang rò.' },
              { en: "It's beeping every few seconds.", vi: 'Nó cứ vài giây lại kêu bíp.' },
              { en: 'Ethan is working from home today.', vi: 'Hôm nay Ethan làm ở nhà.' },
            ],
          },
          {
            formula: "S + isn't / aren't + V-ing · There's + N + V-ing",
            vi: 'Thứ gì không hoạt động · Có cái gì đang diễn ra.',
            examples: [
              { en: "The heating isn't working.", vi: 'Lò sưởi không chạy.' },
              { en: "The lights aren't working in the hallway.", vi: 'Đèn hành lang không sáng.' },
              { en: "There's water coming through the ceiling.", vi: 'Có nước đang chảy qua trần.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Nói', 'Nghĩa', 'Khi nào dùng'],
        rows: [
          ['The tap drips.', 'Cái vòi (hay) nhỏ giọt.', 'Hiện tại đơn (Ngày 3): **thói quen, chuyện thường xuyên**. Ít dùng khi báo hỏng.'],
          ['The tap is dripping.', 'Cái vòi **đang** nhỏ giọt.', 'Hiện tại tiếp diễn: chuyện **đang xảy ra**, cần xử lý. Dùng khi báo hỏng.'],
          ['I have a desk.', 'Tôi có cái bàn (của tôi).', '**have**: người sở hữu.'],
          ['There is a desk in the room.', 'Trong phòng có cái bàn.', '**there is**: ở chỗ đó có.'],
        ],
        caption: 'Mẹo nhớ: nói được "**ngay lúc này**" (right now) vào sau câu mà nghe hợp lý thì dùng **V-ing**.',
      },
      {
        t: 'rule',
        formula: "There's / There are + N (+ nơi). · The + N + is / isn't + V-ing.",
        vi: 'Câu đầu tả căn nhà có gì. Câu sau tả cái gì đang hỏng. Hai khung này đủ cho mọi tin báo hỏng.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: still · right now · and also',
        items: [
          '**still** (vẫn còn) đứng **trước V-ing**: "It\'s **still** leaking." Rất mạnh khi nhắc lần hai: chỗ hỏng chưa ai sửa.',
          '**right now / at the moment** đứng cuối câu, nhấn là chuyện đang xảy ra: "Water is coming through the ceiling **right now**."',
          '**and also** thêm một chỗ hỏng nữa: "The heating isn\'t working, **and also** the shower is leaking." Viết thì hay dùng: "**There are two more problems.**"',
          'Ôn **but** (Ngày 3): "I\'m opening the window every day, **but** the mould is still getting bigger."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd8-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "There is / There are · Is there…? · S + is / isn't + V-ing · still",
        items: [
          { q: 'Trong phòng có một cửa sổ to.', hint: "there's, big window", answers: ["There's a big window in the room.", 'There is a big window in the room.', "The room has a big window.", "There's a big window in my room.", 'There is a big window in my room.'] },
          { q: 'Gần đây có siêu thị nào không?', hint: 'are there any, supermarkets, nearby', answers: ['Are there any supermarkets nearby?', 'Are there any supermarkets near here?', 'Is there a supermarket nearby?', 'Is there a supermarket near here?'] },
          { q: 'Tủ lạnh không chạy.', hint: "isn't working", answers: ["The fridge isn't working.", 'The fridge is not working.', "The fridge doesn't work."] },
          { q: 'Vòi bếp vẫn đang nhỏ giọt.', hint: 'still, dripping', answers: ['The kitchen tap is still dripping.', "The kitchen tap's still dripping.", 'The tap in the kitchen is still dripping.', 'The kitchen faucet is still dripping.'] },
          { q: 'Có nước đang chảy qua trần nhà tôi.', hint: "there's, water coming through", answers: ["There's water coming through my ceiling.", 'There is water coming through my ceiling.', 'Water is coming through my ceiling.', "Water's coming through my ceiling."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~In my room have a big window.~~ → **There\'s a big window in my room.** Dịch thẳng chữ "có" thành "have" là lỗi số một. Phòng không "sở hữu" cửa sổ; ở đó **có** cửa sổ.',
          '~~Have any shops near here?~~ → **Are there any shops near here?** Câu hỏi "có… không" về một nơi luôn bắt đầu bằng **Is there / Are there**.',
          '~~The tap is leak.~~ / ~~The tap leak water.~~ → **The tap is leaking.** Sau is / are phải là **V-ing**. leak đã có nghĩa là rò nước, không cần thêm "water".',
          '~~The aircon doesn\'t cold.~~ → **The aircon isn\'t working / isn\'t cooling.** "cold" là tính từ, không làm động từ được.',
          '~~Open the heating. Close the light.~~ → **Turn on the heating. Turn off the light.** Thiết bị điện dùng **turn on / turn off** (hoặc switch on / off). open / close chỉ dùng cho cửa, cửa sổ, hộp.',
          '~~The light is die.~~ / ~~The light is broken~~ (chỉ hết bóng) → **The bulb has gone. / The light isn\'t working.** "broken" nghe như vỡ, gãy.',
          '~~house owner~~ → **landlord / landlady.** "owner" đúng nhưng không ai nói vậy với người cho thuê.',
          '~~Can you repair?~~ → **Could you send someone to fix it / to look at it?** Thiếu tân ngữ (it) và quá cộc. "look at it" nhẹ hơn "fix it" vì chưa ai biết hỏng gì.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi thuê nhà và với hàng xóm' },
      {
        t: 'p',
        text: 'Cửa nhà là ranh giới. Mỗi nước có thói quen riêng về giày, gõ cửa, đứng ở đâu khi nói chuyện với hàng xóm. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi xem phòng và gặp hàng xóm',
        items: [
          { anh: 'mans-shoe', w: 'Should I take my shoes off?', ro: '/ʃʊd aɪ teɪk maɪ ˈʃuːz ɔːf/', vi: 'Ở Anh, Ireland, Mỹ nhiều nhà vẫn đi giày trong nhà. Chưa biết thì **hỏi**, đừng tự cởi hay tự đi vào. Ở Nhật, Hàn, Việt Nam thì cởi.' },
          { anh: 'door', w: "Sorry to bother you.", ro: '/ˈsɑːri tə ˈbɑːðər juː/', vi: 'Gõ cửa xong **lùi lại một bước**. Đứng sát cửa hay nhìn vào trong nhà người ta bị coi là xâm phạm.' },
          { anh: 'raised-hand', w: "Hi, I'm Hân from 4C.", ro: '', vi: 'Hàng xóm chưa quen: nói **tên + số căn hộ** ngay câu đầu, để người ta biết bạn là ai trước khi mở cửa rộng ra.' },
          { anh: 'eyes', w: 'Can I open the windows and turn on the taps?', ro: '', vi: 'Khi xem phòng, **thử mọi thứ** (vòi nước, công tắc, cửa sổ, ổ khoá) là bình thường và nên làm. Không ai cho là bạn bất lịch sự.' },
          { anh: 'camera-with-flash', w: 'Is it okay if I take a few photos?', ro: '', vi: 'Xin phép rồi chụp ảnh căn phòng lúc xem và lúc dọn vào. Ảnh là bằng chứng khi trả phòng, đòi lại tiền cọc.' },
          { anh: 'backhand-index-pointing-up', w: "It's coming from up there.", ro: '/ɪts ˈkʌmɪŋ frəm ˈʌp ðer/', vi: 'Chỉ lên chỗ rò, chỗ hỏng: chỉ vào **đồ vật** thì thoải mái. Chỉ ngón tay vào **người** thì tránh (Ngày 1).' },
          { anh: 'hot-beverage', w: "I'd love to. Thanks!", ro: '', vi: 'Hàng xóm mời "come up for a cuppa" sau một sự cố là đang muốn làm lành. Nhận lời, ngồi 20–30 phút là vừa.' },
          { anh: 'thumbs-up', w: 'All sorted, thanks!', ro: '/ɔːl ˈsɔːrtɪd θæŋks/', vi: 'Gặp lại hàng xóm ở thang máy sau khi đã sửa xong: một câu, một nụ cười, một ngón cái là đủ.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Ireland · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Giày trong nhà', 'Cởi ở cửa.', 'Tuỳ nhà, nhiều nhà vẫn đi giày. **Hỏi** chủ nhà.', 'Luôn cởi ở **genkan** (bậc cửa). Có dép riêng cho nhà vệ sinh.'],
          ['Mới dọn đến', 'Không có lệ gì đặc biệt.', 'Không bắt buộc. Gặp thì chào, nói tên, số căn hộ.', 'Mang quà nhỏ chào hàng xóm hai bên và tầng trên, tầng dưới.'],
          ['Có chuyện với hàng xóm', 'Sang gõ cửa nói thẳng.', 'Chuyện gấp (rò nước) thì gõ cửa. Chuyện nhỏ thì **nhắn tin hoặc để lại mẩu giấy** trước.', 'Thường báo qua ban quản lý, ít nói trực tiếp.'],
          ['Giờ yên tĩnh', 'Không rõ ràng, tuỳ khu.', 'Thường từ khoảng 22–23 giờ. Hợp đồng hay ghi rõ.', 'Rất nghiêm, ồn sau 21–22 giờ là bị nhắc.'],
          ['Đổ rác', 'Đổ theo giờ xe rác.', 'Theo **bin day**, chia thùng tái chế. Ireland: thùng xanh lá tái chế, nâu đồ ăn, đen rác thường.', 'Phân loại rất kỹ, sai bị trả lại.'],
        ],
        caption: 'Quy tắc dễ nhất khi ở nhà thuê nước ngoài: **hỏi bạn ở chung ngay tuần đầu** về giày, rác, giờ yên tĩnh, khách tới chơi.',
      },

      { t: 'h', text: '6. Phát âm: there\'s, there are, ceiling, -ed' },
      {
        t: 'p',
        text: '**there\'s** đọc /ðerz/, rất nhanh, nghe gần như "dez". **There are** nối thành /ðerər/ ("de-rơ"). Âm /ð/ đặt đầu lưỡi giữa hai hàm răng, **rung** cổ họng. **ceiling** đọc /ˈsiːlɪŋ/ ("xi-linh"), không phải "xê-linh". **blocked** chỉ một âm tiết: /blɑːkt/.',
      },
      {
        t: 'phatam',
        id: 'gtd8-phat-am',
        title: 'Luyện phát âm — there is / there are và -ing khi báo hỏng',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ rõ âm /ð/ ở there và âm /ŋ/ ở cuối -ing.',
        items: [
          { text: "There's a washing machine.", ipa: 'ðerz ə wɑːʃɪŋ məʃiːn', vi: "there's = /ðerz/ một âm tiết · machine nhấn âm sau: mơ-SHIN" },
          { text: 'There are three bedrooms.', ipa: 'ðer ər θriː bedruːmz', vi: 'nối There‿are · /ð/ rung ở there, /θ/ không rung ở three' },
          { text: 'Is there a desk?', ipa: 'ɪz ðer ə desk', vi: 'nối Is‿there‿a · lên giọng ở desk · desk có /sk/ cuối' },
          { text: 'The shower is leaking.', ipa: 'ðə ʃaʊər ɪz liːkɪŋ', vi: 'shower 2 âm tiết: SHAO-ơ · leaking /ŋ/ cuối, không đọc "lí-kin"' },
          { text: "The heating isn't working.", ipa: 'ðə hiːtɪŋ ɪznt wɝːkɪŋ', vi: "isn't = /ɪznt/ · working có âm /ɝː/ cong lưỡi" },
          { text: "There's water coming through the ceiling.", ipa: 'ðerz wɔːtər kʌmɪŋ θruː ðə siːlɪŋ', vi: 'ceiling = /siːlɪŋ/ · through /θruː/ không đọc "thờ-ru"' },
          { text: 'The sink is blocked.', ipa: 'ðə sɪŋk ɪz blɑːkt', vi: 'blocked một âm tiết, -ed đọc /t/ · sink có /ŋk/' },
          { text: "It's still getting worse.", ipa: 'ɪts stɪl ɡetɪŋ wɝːs', vi: 'nhấn **still** và **worse** · getting: t giữa nhẹ thành âm bật nhanh' },
        ],
      },

      { t: 'h', text: '7. Nhập vai: xem một căn hộ khác với người môi giới' },
      {
        t: 'dialogue',
        title: 'Hân đi xem căn hộ một phòng ngủ (dự phòng) — người dẫn là Mark, nhân viên công ty môi giới',
        lines: [
          { who: 'Hân', role: 'a', text: "Hi, I'm Hân. I'm here for the six-thirty viewing.", vi: 'Chào anh, em là Hân. Em tới xem nhà lúc sáu rưỡi ạ.' },
          { who: 'Mark', role: 'b', text: "Hi, Hân. Come on up. It's on the second floor, and there isn't a lift, I'm afraid.", vi: 'Chào Hân. Lên đi em. Căn hộ ở tầng hai, mà tiếc là không có thang máy.' },
          { who: 'Hân', role: 'a', text: "That's okay. How much is the rent, and are bills included?", vi: 'Không sao ạ. Tiền thuê bao nhiêu, và có bao gồm điện nước không anh?' },
          { who: 'Mark', role: 'b', text: "It's seventeen hundred a month. Bills aren't included, but the internet is.", vi: 'Mười bảy trăm một tháng. Không gồm điện nước, nhưng có gồm internet.' },
          { who: 'Hân', role: 'a', text: 'And how much is the deposit?', vi: 'Còn tiền cọc bao nhiêu ạ?' },
          { who: 'Mark', role: 'b', text: "One month's rent. You get it back when you move out, if everything's in good condition.", vi: 'Một tháng tiền thuê. Khi chuyển đi em được trả lại, nếu mọi thứ còn tốt.' },
          { who: 'Hân', role: 'a', text: 'Is there a washing machine?', vi: 'Có máy giặt không anh?' },
          { who: 'Mark', role: 'b', text: "There is, and there's a small dryer as well.", vi: 'Có, và còn có một máy sấy nhỏ nữa.' },
          { who: 'Hân', role: 'a', text: "Great. Are there any supermarkets nearby? I don't have a car.", vi: 'Tuyệt. Gần đây có siêu thị nào không ạ? Em không có xe ô tô.' },
          { who: 'Mark', role: 'b', text: "There are two, both about five minutes' walk. And there's a bus stop right outside.", vi: 'Có hai cái, đều đi bộ khoảng năm phút. Và có trạm xe buýt ngay trước cửa.' },
          { who: 'Hân', role: 'a', text: "That's perfect. Is it okay if I turn on the shower and check the water pressure?", vi: 'Thế thì quá tốt. Em mở vòi sen kiểm tra áp lực nước được không ạ?' },
          { who: 'Mark', role: 'b', text: 'Of course. Most people forget to check that.', vi: 'Được chứ. Phần lớn mọi người quên kiểm tra chỗ đó.' },
          { who: 'Hân', role: 'a', text: "Thanks. Could you send me a copy of the lease before I decide?", vi: 'Cảm ơn anh. Anh gửi em bản hợp đồng thuê trước khi em quyết định được không ạ?' },
          { who: 'Mark', role: 'b', text: "Sure. I'll email it to you tonight.", vi: 'Được. Tối nay anh gửi email cho em.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd8-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Hân (5 câu)',
        items: [
          { vi: 'Em tới xem nhà lúc sáu rưỡi ạ.', chips: ["I'm", 'here', 'for', 'the', 'six-thirty', 'viewing.', 'to', 'at'], answer: ["I'm", 'here', 'for', 'the', 'six-thirty', 'viewing.'] },
          { vi: 'Có máy giặt không?', chips: ['Is', 'there', 'a', 'washing', 'machine?', 'Are', 'have', 'any'], answer: ['Is', 'there', 'a', 'washing', 'machine?'] },
          { vi: 'Gần đây có siêu thị nào không?', chips: ['Are', 'there', 'any', 'supermarkets', 'nearby?', 'Is', 'a', 'have'], answer: ['Are', 'there', 'any', 'supermarkets', 'nearby?'] },
          { vi: 'Vòi sen đang rò, và lò sưởi không chạy.', chips: ['The', 'shower', 'is', 'leaking,', 'and', 'the', 'heating', "isn't", 'working.', 'leak', "doesn't"], answer: ['The', 'shower', 'is', 'leaking,', 'and', 'the', 'heating', "isn't", 'working.'] },
          { vi: 'Anh gửi em bản hợp đồng thuê trước khi em quyết định được không?', chips: ['Could', 'you', 'send', 'me', 'a', 'copy', 'of', 'the', 'lease', 'before', 'I', 'decide?', 'to', 'after'], answer: ['Could', 'you', 'send', 'me', 'a', 'copy', 'of', 'the', 'lease', 'before', 'I', 'decide?'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd8-noi-tra-loi',
        part: '1',
        questions: [
          'Can you describe your room? What is there in it?',
          'Are there any problems in your home at the moment?',
          'What do you look for when you rent a room?',
          'Do you know your neighbours? What are they like?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Gerry, a friendly but slightly lazy Irish landlord in Dublin. I am a Vietnamese tenant in Flat 4C. I am calling you to report two problems: choose two at random from this list and tell me which ones at the start (the kitchen tap is dripping, the fridge is making a strange noise, there is mould on the bedroom wall, the front door lock is stuck, the heating is not working). First, try to say each problem is normal or not urgent, so I have to explain politely why it needs fixing. Ask me where the problem is, when it started and whether anyone will be in for the plumber. Use a few Irish words like \'grand\' and \'press\', and explain them if I ask. Speak at a natural but clear speed (A2+ / B1). If I say \'In my room have…\' or \'The tap is leak\', correct me gently. After 10 turns, agree a day and time, then tell me in Vietnamese two things I did well and two things to fix."',
          'Làm **2 lượt**. Lượt hai: bạn là hàng xóm tầng trên, AI là người tầng dưới gõ cửa báo nước rò. Bạn phải xin lỗi, hỏi thiệt hại và hứa xử lý.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd8-viet',
    kind: 'writing',
    title: 'Tin nhắn báo hỏng, email hỏi thuê phòng',
    goal: 'Viết được email hỏi thuê phòng, tin báo hỏng đủ thông tin (cái gì, ở đâu, từ bao giờ, nặng thế nào), tin nhắc lần hai và tin hẹn thợ, ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao phải viết, không chỉ gọi',
        items: [
          'Gọi điện thì nhanh, nhưng **lời hứa qua điện thoại không để lại dấu vết**. Báo hỏng bằng chữ là **bằng chứng** khi trả phòng, đòi lại tiền cọc.',
          'Tin báo hỏng tốt có 4 ý: **cái gì hỏng · ở đâu · từ bao giờ · nặng thế nào** (+ ảnh, + khi nào bạn ở nhà). Giống tả bệnh ở Ngày 7.',
          'Hôm nay viết 4 loại: hỏi thuê phòng · báo hỏng · nhắc lần hai · hẹn thợ vào nhà.',
          'Mỗi loại có hai bản đặt cạnh nhau: **thân mật** (bạn ở chung, chủ nhà dễ tính) và **trang trọng** (công ty môi giới, ban quản lý).',
          'Dùng lại khung của bài Nói: there is / there are, is leaking, isn\'t working, still.',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu tin, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Hỏi thuê phòng',
        caption: 'Bản thân mật trả lời một tin đăng trên nhóm tìm bạn ở chung. Bản trang trọng gửi công ty môi giới. Cả hai đều **tự giới thiệu một câu** và **hỏi hẹn xem nhà**.',
        cols: [
          {
            title: 'Thân mật (tin đăng tìm bạn ở chung)',
            anh: 'speech-balloon',
            items: [
              'Hi Orla,',
              "I saw your post about the room. Is it still available?",
              "I'm a Vietnamese intern, here until March. I'm tidy and quiet, and I don't smoke.",
              'Could I come and see it this week?',
              'Thanks! Hân',
            ],
          },
          {
            title: 'Trang trọng (email công ty môi giới)',
            anh: 'e-mail',
            items: [
              'Dear Sir or Madam,',
              'I am writing to enquire about the one-bedroom flat on Grove Road.',
              'Could you tell me if it is still available, and whether bills are included in the rent?',
              'I would like to arrange a viewing. I am free after 6 pm on weekdays.',
              'Kind regards,',
              'Nguyen Ngoc Han',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Báo hỏng',
        caption: 'Bản thân mật báo cho nhóm bạn ở chung. Bản trang trọng gửi chủ nhà hoặc công ty: **tiêu đề rõ, số căn hộ, 4 ý, ảnh, khi nào ở nhà**.',
        cols: [
          {
            title: 'Thân mật (nhóm chat căn hộ)',
            anh: 'mobile-phone',
            items: [
              'Heads up: the shower is leaking again 😩',
              "There's water all over the floor, so be careful.",
              "I've told Gerry. Please don't use the shower until it's fixed!",
            ],
          },
          {
            title: 'Trang trọng (email chủ nhà / công ty)',
            anh: 'memo',
            items: [
              'Subject: Flat 4C – shower leaking',
              'Dear Mr Brennan,',
              'I am writing to report a problem with the shower in Flat 4C.',
              'Water is leaking from the bottom of the glass door, and there is water on the floor every time we use it. It started on Monday, and it is getting worse.',
              'I have attached two photos. Could you send someone to look at it?',
              'My flatmate will be in on Thursday and Friday mornings.',
              'Kind regards,',
              'Nguyen Ngoc Han',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Nhắc lần hai (chưa ai sửa)',
        caption: 'Không trách, không dài. Nhắc **ngày đã báo**, nói **tình trạng bây giờ** bằng **still**, đề nghị một việc cụ thể.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'hourglass-not-done',
            items: [
              'Hi Gerry,',
              'Just checking in about the shower. It\'s still leaking.',
              'Any news on the plumber?',
              'Thanks, Hân',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'e-mail',
            items: [
              'Subject: Follow-up – Flat 4C shower leak',
              'Dear Mr Brennan,',
              'I am following up on my email of 3 November about the shower.',
              'The problem has not been fixed, and water is still leaking onto the floor.',
              'Could you let me know when a plumber will be available?',
              'Kind regards,',
              'Nguyen Ngoc Han',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Hẹn thợ vào nhà',
        caption: 'Trả lời câu "Will anyone be in?": **ai ở nhà, khung giờ nào**, và cách vào nhà nếu không có ai.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thumbs-up',
            items: [
              'Thursday morning works!',
              "I'll be out, but Ethan is working from home, so he can let the plumber in.",
              'Thanks for sorting it 🙏',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'spiral-calendar',
            items: [
              'Dear Mr Brennan,',
              'Thank you for arranging the repair.',
              'Thursday between 9 am and 1 pm is fine. My flatmate, Ethan Clarke, will be in to let the plumber in.',
              'His number is 087 xxx xxxx.',
              'Kind regards,',
              'Nguyen Ngoc Han',
            ],
          },
        ],
      },
      {
        t: 'note',
        title: 'Cảnh giác lừa đảo thuê nhà',
        items: [
          'Ở các thành phố khan nhà (Dublin, London, Sydney, Toronto…) lừa đảo cho thuê **rất phổ biến**, và sinh viên nước ngoài là mục tiêu số một.',
          '**Không bao giờ chuyển tiền cọc trước khi xem nhà tận nơi** và đọc hợp đồng. "Chủ nhà đang ở nước ngoài, chuyển cọc rồi gửi chìa qua bưu điện" là kịch bản lừa quen thuộc.',
          'Giá rẻ hơn hẳn các phòng xung quanh, giục chuyển tiền ngay, chỉ nhắn tin không chịu gặp: ba dấu hiệu cần dừng lại.',
          'Trả tiền thì trả **có ghi chép** (chuyển khoản tới tên đúng người trên hợp đồng) và xin **biên nhận**.',
        ],
      },

      { t: 'h', text: '2. Khung câu để viết tin báo hỏng' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'I am writing to + report / enquire about + N',
            vi: 'Câu mở đầu email trang trọng: nói ngay mục đích.',
            examples: [
              { en: 'I am writing to report a problem with the heating.', vi: 'Tôi viết thư để báo lỗi lò sưởi.' },
              { en: 'I am writing to enquire about the room on Grove Road.', vi: 'Tôi viết thư để hỏi về căn phòng trên đường Grove.' },
              { en: 'I am writing to follow up on my email of 3 November.', vi: 'Tôi viết thư để hỏi tiếp về email ngày 3 tháng 11.' },
            ],
          },
          {
            formula: 'The + N + is / isn\'t + V-ing · There is / are + N + nơi',
            vi: 'Tả chỗ hỏng và tình trạng hiện tại.',
            examples: [
              { en: 'The kitchen tap is dripping.', vi: 'Vòi bếp đang nhỏ giọt.' },
              { en: "The heating isn't working in the bedroom.", vi: 'Lò sưởi phòng ngủ không chạy.' },
              { en: 'There is a large crack in the bathroom window.', vi: 'Cửa sổ nhà tắm có một vết nứt lớn.' },
            ],
          },
          {
            formula: 'It started on + ngày, and it is still / getting worse.',
            vi: 'Từ bao giờ và nặng thế nào.',
            examples: [
              { en: 'It started on Monday, and it is getting worse.', vi: 'Bắt đầu từ thứ Hai, và đang tệ hơn.' },
              { en: 'It started last week, and it is still leaking.', vi: 'Bắt đầu từ tuần trước, và vẫn đang rò.' },
              { en: 'It started yesterday evening.', vi: 'Bắt đầu từ tối hôm qua.' },
            ],
          },
          {
            formula: 'Could you + send someone / let me know / arrange + …?',
            vi: 'Đề nghị một việc cụ thể ở cuối thư.',
            examples: [
              { en: 'Could you send someone to look at it?', vi: 'Ông/bà cho người tới xem giúp được không?' },
              { en: 'Could you let me know when the plumber is coming?', vi: 'Ông/bà báo giúp khi nào thợ tới được không?' },
              { en: 'Could you arrange a repair this week?', vi: 'Ông/bà sắp xếp sửa trong tuần này được không?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Chào + I am writing to report… + The N is V-ing / There is N + It started on… + Could you…? + khi nào ở nhà',
        vi: 'Một tin báo hỏng đủ dùng ở mọi nước: mục đích, chỗ hỏng, từ bao giờ, đề nghị, giờ ở nhà.',
      },
      {
        t: 'table',
        head: ['Viết gì', 'Nên viết', 'Tránh', 'Vì sao'],
        rows: [
          ['Tiêu đề', 'Flat 4C – shower leaking', 'Problem!!! · Help', 'Chủ nhà nhiều căn: nhìn tiêu đề là biết căn nào, việc gì.'],
          ['Chỗ hỏng', 'Water is leaking from the bottom of the glass door.', 'The bathroom is broken.', 'Cụ thể thì thợ mang đúng đồ nghề, sửa một lần là xong.'],
          ['Thời gian', 'It started on Monday.', '(bỏ trống)', 'Hỏng lâu mà không báo, có hợp đồng tính lỗi cho người thuê.'],
          ['Mức độ', "It's getting worse. · It isn't urgent, but…", 'EVERYTHING IS RUINED', 'Nói đúng mức để được xếp đúng thứ tự ưu tiên.'],
          ['Bằng chứng', "I've attached two photos.", '(không ảnh)', 'Ảnh có ngày giờ là bằng chứng khi trả phòng.'],
          ['Giọng', 'Could you…? · Thank you for…', 'You must fix it now.', 'Lịch sự mà rõ ràng hiệu quả hơn ra lệnh.'],
        ],
        caption: 'Viết như vậy, người nhận **không phải hỏi lại câu nào**. Đó là thước đo của một tin báo hỏng tốt.',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd8-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Tôi viết thư để báo lỗi lò sưởi.', chips: ['I', 'am', 'writing', 'to', 'report', 'a', 'problem', 'with', 'the', 'heating.', 'for', 'about'], answer: ['I', 'am', 'writing', 'to', 'report', 'a', 'problem', 'with', 'the', 'heating.'] },
          { vi: 'Bắt đầu từ thứ Hai, và đang tệ hơn.', chips: ['It', 'started', 'on', 'Monday,', 'and', "it's", 'getting', 'worse.', 'in', 'since'], answer: ['It', 'started', 'on', 'Monday,', 'and', "it's", 'getting', 'worse.'] },
          { vi: 'Phòng còn trống không?', chips: ['Is', 'the', 'room', 'still', 'available?', 'Are', 'empty'], answer: ['Is', 'the', 'room', 'still', 'available?'] },
          { vi: 'Bạn ở chung của tôi sẽ ở nhà sáng thứ Năm.', chips: ['My', 'flatmate', 'will', 'be', 'in', 'on', 'Thursday', 'morning.', 'at', 'out'], answer: ['My', 'flatmate', 'will', 'be', 'in', 'on', 'Thursday', 'morning.'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd8-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: "is / are + V-ing · there is / are · still · in / out",
        items: [
          { q: 'The kitchen tap is ___. (nhỏ giọt)', answers: ['dripping'] },
          { q: '___ is black mould on the bedroom wall.', answers: ['There'] },
          { q: "I'm opening the window every day, but it's ___ getting bigger. (vẫn)", answers: ['still'] },
          { q: "I'll be ___ on Thursday, but my flatmate will be in. (đi vắng)", answers: ['out'] },
          { q: 'I have ___ two photos of the leak. (gửi kèm)', answers: ['attached'] },
          { q: '___ there any problems with the heating? (câu hỏi)', answers: ['Are'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd8-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I am writing to… · The N is V-ing · There is… · still · Could you…?",
        items: [
          { q: '(Nhắn chủ đăng tin) Phòng còn trống không? Tôi qua xem tuần này được không?', hint: 'still available, come and see it', answers: ['Is the room still available? Could I come and see it this week?', 'Is the room still available? Can I come and see it this week?', 'Is the room still available? Could I come to see it this week?', 'Is the room still available? Can I come to see it this week?'] },
          { q: '(Trang trọng) Tôi viết thư để báo lỗi tủ lạnh.', hint: 'I am writing to report, problem with', answers: ['I am writing to report a problem with the fridge.', "I'm writing to report a problem with the fridge.", 'I am writing to report a problem with the refrigerator.'] },
          { q: 'Tủ lạnh đang kêu tiếng lạ và không lạnh.', hint: "making a strange noise, isn't cold / isn't working", answers: ["The fridge is making a strange noise, and it isn't cold.", "The fridge is making a strange noise and it isn't cold.", "The fridge is making a strange noise, and it isn't working.", "The fridge is making a strange noise and it isn't working.", "The fridge is making a strange noise, and it isn't cooling.", "The fridge is making a strange noise and it isn't cooling."] },
          { q: '(Nhắc lần hai) Vòi bếp vẫn đang nhỏ giọt. Có tin gì về thợ chưa ạ?', hint: 'still dripping, any news on', answers: ['The kitchen tap is still dripping. Any news on the plumber?', "The kitchen tap's still dripping. Any news on the plumber?", 'The kitchen tap is still dripping. Is there any news on the plumber?'] },
          { q: 'Ông cho người tới xem giúp được không ạ?', hint: 'could you, send someone, look at it', answers: ['Could you send someone to look at it?', 'Could you please send someone to look at it?', 'Could you send someone to have a look at it?', 'Could you send someone to check it?'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Có số căn hộ chưa?** Chủ nhà nhiều căn, thiếu số căn là thư bị để sang một bên.',
          '**Đủ 4 ý chưa?** Cái gì · ở đâu · từ bao giờ · nặng thế nào. Thiếu ý nào là người nhận phải hỏi lại.',
          '**Ảnh đã gắn chưa?** Viết "I have attached" mà quên gắn ảnh là lỗi ai cũng từng mắc.',
          '**Giọng có quá gắt không?** Đọc lại to một lần. Có chữ "must", "immediately", ba dấu chấm than thì sửa thành "Could you…?".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd8-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 8',
    goal: 'Làm 34 câu có đáp án để dùng chắc there is / there are, hiện tại tiếp diễn khi báo hỏng và các câu với chủ nhà, hàng xóm; ôn lại sức khoẻ (Ngày 7) và so sánh (Ngày 5).',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền there is / are, V-ing · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 5** (so sánh), **Ngày 7** (triệu chứng, should) và **Ngày 2** (hỏi lại).',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 9.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd8-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn muốn nói "Trong phòng có hai cửa sổ". Câu nào đúng?',
            options: ['In the room have two windows.', 'There are two windows in the room.', 'There is two windows in the room.', 'The room is two windows.'],
            correct: 1,
            why: '**There are** + danh từ số nhiều. "have" chỉ dùng khi có người sở hữu.',
          },
          {
            q: 'Bạn gọi chủ nhà báo nước nóng không có. Câu nào tự nhiên nhất?',
            options: ['The hot water is not.', "There's no hot water, and the boiler is beeping.", 'Hot water die.', 'I have no hot.'],
            correct: 1,
            why: '**There\'s no + N** = không có. Thêm một chi tiết đang xảy ra (is beeping) giúp chủ nhà đoán lỗi.',
          },
          {
            q: 'Chủ nhà hỏi: "Will anyone be in on Friday morning?" Bạn đi làm, bạn ở chung ở nhà. Bạn đáp:',
            options: ["I'll be in, but my flatmate will be out.", "I'll be out, but my flatmate will be in.", "Yes, I'm in the office.", 'Nobody is inside the house.'],
            correct: 1,
            why: '**be in** = ở nhà, **be out** = đi vắng. Bạn vắng, bạn ở chung ở nhà.',
          },
          {
            q: 'Chủ nhà nói vết mốc "is normal in old houses". Bạn đáp lịch sự mà vẫn giữ ý:',
            options: ["You're wrong.", "Okay, sorry.", "I understand, but it's still getting bigger. Could someone look at it?", 'Fix it now.'],
            correct: 2,
            why: '**I understand, but…** + bằng chứng (still getting bigger) + đề nghị cụ thể (Could someone…?).',
          },
          {
            q: 'Câu nào dùng đúng hiện tại tiếp diễn để báo hỏng?',
            options: ['The tap leaks water now.', 'The tap is leak.', 'The tap is leaking.', 'The tap leaking.'],
            correct: 2,
            why: '**is + V-ing**. Câu A dùng hiện tại đơn, hợp với thói quen hơn là sự cố đang xảy ra.',
          },
          {
            q: 'Ở Ireland, người ta nói "It\'s in the press." Họ muốn nói:',
            options: ['Nó ở trên báo', 'Nó ở trong tủ', 'Nó đang được ép', 'Nó ở tiệm giặt'],
            correct: 1,
            why: 'Tiếng Anh ở Ireland: **press** = **cupboard** (tủ).',
          },
          {
            q: 'Bạn muốn tắt lò sưởi. Câu nào đúng?',
            options: ['Close the heating.', 'Turn off the heating.', 'Open off the heating.', 'Shut the heating down off.'],
            correct: 1,
            why: 'Thiết bị điện: **turn on / turn off**. open / close cho cửa, hộp.',
          },
          {
            q: 'Phòng thật nhỏ hơn trong ảnh (ôn Ngày 5). Bạn nói:',
            options: ["It's more small than the photos.", "It's smaller than in the photos.", "It's small than the photos.", "It's the smallest than the photos."],
            correct: 1,
            why: 'Tính từ ngắn: **-er + than**: smaller than. Không dùng "more small".',
          },
          {
            q: 'Bạn ở chung kêu đau đầu và sốt từ hôm qua (ôn Ngày 7). Bạn khuyên:',
            options: ['You must go to hospital.', 'Maybe you should stay in bed today.', 'You should to rest.', 'You are headache.'],
            correct: 1,
            why: '**Maybe you should + V** là lời khuyên vừa mức. "should to" sai, "hospital" quá nặng cho cảm sốt.',
          },
          {
            q: 'Hàng xóm mời "Come up for a cuppa tomorrow." Câu đáp nào hợp nhất?',
            options: ["What is a cuppa?", "I'd love to. What time suits you?", 'No.', 'Why?'],
            correct: 1,
            why: '**cuppa** = tách trà. Nhận lời và hỏi giờ là cách đáp ấm áp, giữ quan hệ hàng xóm.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd8-bt-dien',
        title: "Phần II — Điền there / is / are / isn't / aren't / V-ing (8 câu)",
        kind: 'fill',
        grammar: "There is + a / an + N · There are + N(s) · Is there…? · S + is / isn't + V-ing",
        items: [
          { q: "There ___ three bedrooms and one bathroom.", answers: ['are'] },
          { q: "___ there a lift in the building?", answers: ['Is'] },
          { q: "There ___ any curtains, so the room is very bright in the morning. (không có)", answers: ["aren't", 'are not', 'arent'] },
          { q: "The fridge ___ working. It's warm inside. (không)", answers: ["isn't", 'is not', 'isnt'] },
          { q: 'The boiler is ___ every few seconds. (kêu bíp — beep)', answers: ['beeping'] },
          { q: "___'s a strange smell in the hallway.", answers: ['There'] },
          { q: 'My flatmate is ___ from home today. (làm việc — work)', answers: ['working'] },
          { q: 'Water is ___ through the ceiling right now. (chảy — come)', answers: ['coming'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd8-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "There is / are · Are bills included? · S + is / isn't + V-ing · be in / out",
        items: [
          { q: 'Có bao gồm điện nước không?', hint: 'bills, included', answers: ['Are bills included?', 'Are the bills included?', 'Are bills included in the rent?', 'Are the bills included in the rent?', 'Are utilities included?'] },
          { q: 'Tiền cọc bao nhiêu?', hint: 'how much, deposit', answers: ['How much is the deposit?', "What's the deposit?", 'What is the deposit?'] },
          { q: 'Bồn rửa trong bếp bị tắc.', hint: 'sink, blocked', answers: ['The kitchen sink is blocked.', 'The sink in the kitchen is blocked.', 'The kitchen sink is clogged.', "The kitchen sink's blocked."] },
          { q: 'Đèn hành lang không sáng.', hint: "lights, aren't working / light isn't working", answers: ["The lights in the hallway aren't working.", "The hallway lights aren't working.", "The light in the hallway isn't working.", "The hallway light isn't working.", 'The hallway lights are not working.'] },
          { q: 'Xin lỗi đã làm phiền, nhưng đây có phải bưu kiện của chị không?', hint: 'sorry to bother you, parcel', answers: ['Sorry to bother you, but is this your parcel?', "Sorry to bother you, but is this parcel yours?", "I'm sorry to bother you, but is this your parcel?", 'Sorry to bother you, but is this your package?'] },
          { q: 'Thứ Năm tôi đi vắng, nhưng bạn ở chung của tôi sẽ ở nhà.', hint: 'be out, be in, flatmate', answers: ["I'll be out on Thursday, but my flatmate will be in.", "I'll be out on Thursday but my flatmate will be in.", 'I will be out on Thursday, but my flatmate will be in.', "I'm out on Thursday, but my flatmate will be in.", "I'll be out on Thursday, but my flatmate will be home.", "I'll be out on Thursday, but my roommate will be in."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd8-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Is the room still available?', answer: 'Is the room still available?' },
          { label: 'Câu 2', spell: "There isn't a desk, but there's a big table in the living room.", answer: "There isn't a desk, but there's a big table in the living room.", alt: ["There isn't a desk but there's a big table in the living room.", 'There is not a desk, but there is a big table in the living room.'] },
          { label: 'Câu 3', spell: 'The kitchen tap is still dripping.', answer: 'The kitchen tap is still dripping.', alt: ["The kitchen tap's still dripping."] },
          { label: 'Câu 4', spell: 'Could you send someone to look at it?', answer: 'Could you send someone to look at it?' },
          { label: 'Câu 5', spell: "I'm in 4C, right below you.", answer: "I'm in 4C, right below you.", alt: ["I'm in 4C right below you.", 'I am in 4C, right below you.', "I'm in four C, right below you."] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd8-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Hiện có bao nhiêu người đang ở đây?', chips: ['How', 'many', 'people', 'are', 'living', 'here?', 'much', 'is', 'live'], answer: ['How', 'many', 'people', 'are', 'living', 'here?'] },
          { vi: 'Tôi có nên cởi giày không?', chips: ['Should', 'I', 'take', 'my', 'shoes', 'off?', 'out', 'open'], answer: ['Should', 'I', 'take', 'my', 'shoes', 'off?'] },
          { vi: 'Có nước đang chảy qua trần nhà tôi.', chips: ["There's", 'water', 'coming', 'through', 'my', 'ceiling.', 'come', 'Have'], answer: ["There's", 'water', 'coming', 'through', 'my', 'ceiling.'] },
          { vi: 'Lò sưởi không chạy, và vòi sen cũng đang rò.', chips: ['The', 'heating', "isn't", 'working,', 'and', 'the', 'shower', 'is', 'also', 'leaking.', "doesn't", 'leak'], answer: ['The', 'heating', "isn't", 'working,', 'and', 'the', 'shower', 'is', 'also', 'leaking.'] },
          { vi: 'Tôi viết thư để hỏi về căn phòng trên đường Grove.', chips: ['I', 'am', 'writing', 'to', 'enquire', 'about', 'the', 'room', 'on', 'Grove', 'Road.', 'for', 'in'], answer: ['I', 'am', 'writing', 'to', 'enquire', 'about', 'the', 'room', 'on', 'Grove', 'Road.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Đi một vòng chỗ bạn đang ở và **nói to** 5 câu: "There\'s a… in the… · There are… · There isn\'t a…".',
          'Tìm một thứ trong nhà đang hỏng hoặc chưa ổn (vòi nhỏ giọt, bóng đèn, cửa kẹt) và viết **tin báo hỏng 4 ý** bằng tiếng Anh như Mẫu 2.',
          'Ngày 9: gọi điện — mở đầu, chuyển máy, để lại lời nhắn, nghe hộp thư thoại.',
        ],
      },
    ],
  },
];
