/**
 * Tiếng Anh giao tiếp — NGÀY 10 (chặng 2 "Đời sống", A2+ → B1): mời, nhận lời, từ chối, dời hẹn.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework. Mọi id bắt đầu `gtd10-`.
 * Ngữ pháp trong câu: be going to (ý định) & hiện tại tiếp diễn (kế hoạch đã chốt) · từ chối bằng I'd love to, but…
 * · nối câu bằng `instead`, `though`.
 * Cảnh: Sơn — sinh viên IT năm 3 — thực tập 10 tuần ở văn phòng khu vực của một công ty phần mềm tại Singapore:
 * nhận lời đi quiz night rồi nhớ ra trùng cuộc gọi với giảng viên (được rủ tới muộn), được mời tiệc nướng ở condo
 * ("seven-ish", "Are you keen?") và từ chối khéo buổi dọn bãi biển 7 giờ sáng, mentor xin dời buổi ăn trưa và hai bên tìm giờ khác.
 * Khác podcast en-ds-a2-04 (Hiếu từ chối leo núi vì thăm dì, hẹn cà phê Chủ nhật, rủ Chloe đi tiệc, đón lúc 7 rưỡi):
 * ở đây không leo núi, không tiệc sinh nhật; có nhận lời rồi rút lại, giờ "-ish", và dời hẹn công sở.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_10: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd10-nghe',
    kind: 'listening',
    title: 'Mời, nhận lời, từ chối, dời hẹn',
    goal: 'Nghe hiểu ba cảnh mời và hẹn: ai mời, việc gì, khi nào, ở đâu; nhận ra lúc người nói nhận lời, chưa chắc, từ chối hay xin dời; hiểu các câu "nói vậy mà không phải vậy" như seven-ish, Are you keen?, I\'ll try to make it.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Sơn**, sinh viên IT năm 3, đang thực tập 10 tuần ở văn phòng khu vực của một công ty phần mềm tại **Singapore**. Đồng nghiệp đến từ Ireland, Úc, Canada, Anh.',
          'Một tuần của Sơn đầy lời mời: **quiz night** ở quán bar, **tiệc nướng** ở chung cư (condo), **dọn bãi biển** sáng Chủ nhật, và một buổi **ăn trưa với mentor** bị dời.',
          'Mỗi lời mời, nghe ra 4 thứ: **việc gì · khi nào · ở đâu · ai đi cùng**. Rồi nghe xem câu trả lời là **có, chưa chắc, không** hay **đổi giờ**.',
          'Nối lại Ngày 9: Sơn cũng dùng **I\'ll…** để quyết định ngay. Hôm nay thêm cách nói **kế hoạch**: **I\'m having a call at eight** (đã chốt) và **I\'m going to…** (đã định).',
          'Tốc độ khoảng 140–150 từ/phút, có tiếng ồn quán ăn, người Úc và người Ireland nói khá nhanh. Nghe mỗi cảnh 2 lần.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Pantry sáng thứ Hai: nhận lời rồi… nhớ ra' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'man-technologist', 'woman-office-worker', 'trophy', 'spiral-calendar'],
        caption: '9 giờ sáng thứ Hai. **Sơn** đang pha cà phê ở pantry thì **Clare** (người Ireland, trưởng nhóm kiểm thử) bước vào, rủ anh đi một việc tối thứ Tư.',
      },
      {
        t: 'listen',
        id: 'gtd10-nghe-canh1',
        title: 'Scene 1 — An invitation, and a clash',
        note: 'Nghe xem Clare rủ đi đâu, mấy giờ; vì sao Sơn đang nhận lời lại phải rút lại; và cuối cùng hai người chốt thế nào.',
        lines: [
          { who: 'Clare', voice: 'ie-nu', text: "Morning, Son! A few of us are doing the quiz night at the Irish bar on Wednesday. Do you want to come along?", vi: 'Chào Sơn! Tối thứ Tư mấy đứa bọn chị đi chơi đố vui ở quán bar Ireland. Em muốn đi cùng không?' },
          { who: 'Son', voice: 'us-nam', text: "Oh, a quiz night? Sure, I'd love to! What time does it start?", vi: 'Ồ, đố vui à? Được chứ, em rất muốn! Mấy giờ bắt đầu ạ?' },
          { who: 'Clare', voice: 'ie-nu', text: "It starts at eight, but we're meeting there at half seven to get a table. It's in Tanjong Pagar, ten minutes from here.", vi: 'Tám giờ bắt đầu, nhưng bọn chị hẹn nhau ở đó lúc bảy rưỡi để giữ bàn. Quán ở Tanjong Pagar, cách đây mười phút.' },
          { who: 'Son', voice: 'us-nam', text: 'Great. Do I need to know a lot about Ireland?', vi: 'Hay quá. Em có cần biết nhiều về Ireland không ạ?' },
          { who: 'Clare', voice: 'ie-nu', text: "Ha, not at all! It's general knowledge. Music, films, sport, a bit of geography. You'll be our secret weapon for the Asia questions.", vi: 'Ha, không hề! Kiến thức chung thôi. Nhạc, phim, thể thao, một chút địa lý. Em sẽ là vũ khí bí mật của bọn chị cho mấy câu về châu Á.' },
          { who: 'Son', voice: 'us-nam', text: "Okay, I'll be there. Oh, wait. Wednesday? Hang on, let me check my calendar… Oh no. I'm having a video call with my supervisor from uni at eight.", vi: 'Vâng, em sẽ tới. Ơ, khoan. Thứ Tư ạ? Chờ em xem lịch đã… Ôi không. Tám giờ tối đó em có cuộc gọi video với cô hướng dẫn ở trường.' },
          { who: 'Clare', voice: 'ie-nu', text: 'At eight at night?', vi: 'Tám giờ tối á?' },
          { who: 'Son', voice: 'us-nam', text: "Yeah. It's only seven in Vietnam, so it's after her classes. I'm really sorry. I'd love to come, but I can't move that call. It's my mid-term check-in.", vi: 'Vâng. Ở Việt Nam mới bảy giờ, sau giờ dạy của cô. Em xin lỗi chị. Em rất muốn đi, nhưng em không dời cuộc gọi đó được. Đó là buổi đánh giá giữa kỳ của em.' },
          { who: 'Clare', voice: 'ie-nu', text: "Ah, that's a pity. How long is the call?", vi: 'À, tiếc thật. Cuộc gọi kéo dài bao lâu?' },
          { who: 'Son', voice: 'us-nam', text: 'About forty-five minutes, I think.', vi: 'Khoảng bốn mươi lăm phút, em nghĩ vậy.' },
          { who: 'Clare', voice: 'ie-nu', text: "Then why don't you come after? We're going to be there till ten at least. The last rounds are the hardest anyway.", vi: 'Thế sao em không tới sau? Bọn chị sẽ ở đó tới ít nhất mười giờ. Mà mấy vòng cuối mới là khó nhất.' },
          { who: 'Son', voice: 'us-nam', text: "Really? That would be great. In that case, I'll come straight after the call. Could you send me the address?", vi: 'Thật ạ? Vậy thì tuyệt quá. Thế thì xong cuộc gọi em tới ngay. Chị gửi em địa chỉ được không ạ?' },
          { who: 'Clare', voice: 'ie-nu', text: "Sure, I'll add you to the quiz group chat. Our team's called The Know-It-Alls. Don't ask.", vi: 'Được, chị thêm em vào nhóm chat đi đố vui. Đội bọn chị tên là "Hội Biết Tuốt". Đừng hỏi vì sao.' },
          { who: 'Son', voice: 'us-nam', text: 'Ha! Perfect. See you on Wednesday, then. And good luck before I get there!', vi: 'Ha! Hay đấy. Vậy hẹn chị thứ Tư. Chúc cả đội may mắn trước khi em tới!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd10-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Mọi người hẹn nhau ở quán lúc mấy giờ?',
            options: ['6:30', '7:00', '7:30', '8:00'],
            correct: 2,
            why: '"It starts at eight, but **we\'re meeting there at half seven** to get a table." 8 giờ là giờ quiz bắt đầu. **half seven** = 7:30 (Ngày 2).',
          },
          {
            q: 'Vì sao Sơn đã nhận lời rồi lại rút lại?',
            options: ['Anh ấy không thích đố vui', 'Anh ấy nhớ ra đã có cuộc gọi video với giảng viên lúc 8 giờ', 'Anh ấy phải làm thêm giờ', 'Quán quá xa'],
            correct: 1,
            why: '"**I\'m having a video call** with my supervisor from uni at eight." Hiện tại tiếp diễn = kế hoạch **đã chốt** (có giờ, có người). Sơn làm đúng: nhận ra trùng lịch thì **nói ngay**, không im lặng rồi không tới.',
          },
          {
            q: 'Clare gợi ý gì?',
            options: ['Dời quiz sang tuần sau', 'Sơn tới sau cuộc gọi, vì cả nhóm ở tới ít nhất 10 giờ', 'Sơn gọi video từ quán bar', 'Sơn đi lần sau'],
            correct: 1,
            why: '"**Why don\'t you come after?** We\'re going to be there till ten at least." Từ chối khéo thường mở ra một **phương án khác**.',
          },
          {
            q: 'Câu "I\'m having a video call at eight" và "I\'ll come straight after the call" khác nhau thế nào?',
            options: [
              'Không khác, nói câu nào cũng được',
              'Câu đầu là kế hoạch đã chốt từ trước; câu sau là quyết định Sơn đưa ra ngay lúc nói',
              'Câu đầu là quá khứ, câu sau là tương lai',
              'Câu đầu lịch sự hơn',
            ],
            correct: 1,
            why: '**am/is/are + V-ing** = đã sắp xếp xong. **I\'ll + V** = vừa quyết định (Ngày 9). Hai thì này đứng cạnh nhau trong cùng một cảnh là chuyện rất thường.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Bữa trưa ở hawker centre: một lời "có", một lời "không"' },
      {
        t: 'canh',
        anh: ['steaming-bowl', 'chopsticks', 'man-office-worker', 'woman-office-worker', 'beach-with-umbrella'],
        caption: 'Trưa thứ Ba ở **hawker centre** (khu ăn uống bình dân của Singapore). **Darren** (người Úc) rủ Sơn đi tiệc nướng tối thứ Bảy. Rồi **Nadia** (người Canada) cũng có một lời mời cho sáng Chủ nhật.',
      },
      {
        t: 'listen',
        id: 'gtd10-nghe-canh2',
        title: 'Scene 2 — A yes and a no',
        note: 'Nghe xem "seven-ish" là mấy giờ, Sơn được dặn mang gì, và Sơn từ chối Nadia bằng câu nào.',
        lines: [
          { who: 'Darren', voice: 'au-nam', text: 'Son, mate, are you doing anything on Saturday night?', vi: 'Sơn ơi, tối thứ Bảy em có làm gì không?' },
          { who: 'Son', voice: 'us-nam', text: 'Not yet. Why?', vi: 'Chưa có gì ạ. Sao thế anh?' },
          { who: 'Darren', voice: 'au-nam', text: "We're having a barbecue at my condo. There's a pool and some BBQ pits downstairs. Are you keen?", vi: 'Bọn anh làm tiệc nướng ở chung cư của anh. Dưới nhà có bể bơi với mấy chỗ nướng. Em có hứng không?' },
          { who: 'Son', voice: 'us-nam', text: 'Keen? Sorry, what does that mean?', vi: '"Keen" ạ? Xin lỗi, nghĩa là gì ạ?' },
          { who: 'Darren', voice: 'au-nam', text: 'Ha, sorry, Aussie thing. Do you want to come?', vi: 'Ha, xin lỗi, kiểu nói của dân Úc. Em có muốn tới không?' },
          { who: 'Son', voice: 'us-nam', text: 'Oh! Yes, definitely. Thanks for inviting me. What time should I come?', vi: 'Ồ! Có chứ ạ, chắc chắn rồi. Cảm ơn anh đã mời em. Em nên tới lúc mấy giờ ạ?' },
          { who: 'Darren', voice: 'au-nam', text: 'Seven-ish. Come whenever, really.', vi: 'Tầm bảy giờ. Lúc nào tới cũng được.' },
          { who: 'Son', voice: 'us-nam', text: "Seven-ish… so, seven o'clock?", vi: 'Tầm bảy giờ… vậy là bảy giờ đúng ạ?' },
          { who: 'Darren', voice: 'au-nam', text: "Anywhere between seven and half seven is fine. Nobody turns up at seven on the dot.", vi: 'Từ bảy giờ tới bảy rưỡi đều được. Chẳng ai tới đúng bảy giờ cả.' },
          { who: 'Son', voice: 'us-nam', text: 'Got it. Can I bring anything?', vi: 'Em hiểu rồi. Em có cần mang gì không ạ?' },
          { who: 'Darren', voice: 'au-nam', text: "Just bring something to drink, if you like. I'll do the food. Oh, and bring your flatmate if he's around.", vi: 'Mang chút đồ uống nếu em muốn. Đồ ăn để anh lo. À, rủ cả bạn cùng nhà nếu cậu ấy rảnh.' },
          { who: 'Son', voice: 'us-nam', text: "Thanks, I'll ask him tonight.", vi: 'Cảm ơn anh, tối nay em hỏi cậu ấy.' },
          { who: 'Nadia', voice: 'ca-nu', text: "Speaking of weekends, Son, I'm doing a beach clean-up at East Coast Park on Sunday morning. Would you like to join? We start at seven.", vi: 'Nhân nói chuyện cuối tuần, Sơn ơi, sáng Chủ nhật chị đi dọn rác ở bãi biển East Coast Park. Em muốn tham gia không? Bọn chị bắt đầu lúc bảy giờ.' },
          { who: 'Son', voice: 'us-nam', text: "At seven in the morning? Oh, that's really nice of you to ask, but I think I'll be pretty tired after Darren's barbecue. Could I join the next one instead?", vi: 'Bảy giờ sáng ạ? Ồ, chị rủ em vậy là quý lắm, nhưng em nghĩ sau tiệc của anh Darren em sẽ khá mệt. Em tham gia lần sau được không ạ?' },
          { who: 'Nadia', voice: 'ca-nu', text: "Of course. We do one every month. I'll let you know about the next one.", vi: 'Tất nhiên rồi. Tháng nào bọn chị cũng làm. Chị sẽ báo em lần tới.' },
          { who: 'Son', voice: 'us-nam', text: "Thanks, Nadia. I'd really like to come next time. Have a good one on Sunday, though!", vi: 'Cảm ơn chị Nadia. Lần sau em rất muốn đi. Dù sao cũng chúc chị Chủ nhật vui nhé!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd10-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Darren nói "Seven-ish". Sơn nên tới lúc nào?',
            options: ['Trước 7 giờ để phụ chuẩn bị', 'Đúng 7 giờ', 'Khoảng 7 giờ tới 7 rưỡi', 'Sau 9 giờ'],
            correct: 2,
            why: '**-ish** = khoảng chừng. Darren nói rõ: "Anywhere **between seven and half seven** is fine. Nobody turns up at seven **on the dot** (đúng giờ tuyệt đối)." Tiệc ở nhà thì tới muộn 15–30 phút là bình thường; tới sớm làm chủ nhà lúng túng.',
          },
          {
            q: 'Darren dặn Sơn mang gì?',
            options: ['Đồ ăn', 'Chút đồ uống, nếu muốn', 'Một món quà', 'Không mang gì, và không được rủ ai'],
            correct: 1,
            why: '"Just bring **something to drink**, if you like. I\'ll do the food." Darren còn rủ thêm bạn cùng nhà của Sơn.',
          },
          {
            q: 'Sơn từ chối Nadia thế nào?',
            options: [
              '"No, I can\'t." rồi thôi',
              'Cảm ơn, nêu lý do thật, xin đi lần sau',
              'Nói "Maybe" rồi không trả lời',
              'Nhận lời rồi không tới',
            ],
            correct: 1,
            why: '"That\'s really nice of you to ask, **but** I think I\'ll be pretty tired… **Could I join the next one instead?**" Đủ 3 phần: **cảm ơn → lý do ngắn → phương án khác**. Câu cuối "Have a good one, **though**!" giữ không khí vui.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Mentor xin dời buổi ăn trưa' },
      {
        t: 'canh',
        anh: ['man-office-worker', 'man-technologist', 'airplane-arrival', 'tear-off-calendar', 'hot-beverage'],
        caption: 'Chiều thứ Hai. **Owen** (người Anh), mentor của Sơn, đã hẹn ăn trưa riêng với Sơn **ngày mai (thứ Ba)** để góp ý trước cuộc gọi giữa kỳ tối thứ Tư. Owen đi tới bàn Sơn với vẻ áy náy.',
      },
      {
        t: 'listen',
        id: 'gtd10-nghe-canh3',
        title: 'Scene 3 — Moving a lunch',
        note: 'Nghe xem vì sao Owen phải dời, các lựa chọn nào bị loại, và cuối cùng hai người chốt khi nào.',
        lines: [
          { who: 'Owen', voice: 'uk-nam', text: "Son, have you got a sec? It's about our lunch tomorrow.", vi: 'Sơn, em có rảnh một chút không? Về buổi ăn trưa mai của mình.' },
          { who: 'Son', voice: 'us-nam', text: 'Sure, Owen.', vi: 'Dạ được, anh Owen.' },
          { who: 'Owen', voice: 'uk-nam', text: "I'm really sorry, but I'm going to have to move it. A client's flying in from Jakarta tomorrow, and I'm taking them out for lunch.", vi: 'Anh xin lỗi, nhưng chắc anh phải dời buổi đó. Mai có một khách hàng bay từ Jakarta sang, và anh đưa họ đi ăn trưa.' },
          { who: 'Son', voice: 'us-nam', text: 'Oh, no problem at all. When would suit you instead?', vi: 'Ồ, không sao đâu ạ. Vậy giờ nào khác tiện cho anh ạ?' },
          { who: 'Owen', voice: 'uk-nam', text: "How about Wednesday? Same time, half twelve? I'd still like to give you some feedback before your uni call.", vi: 'Thứ Tư thì sao? Cùng giờ, mười hai rưỡi? Anh vẫn muốn góp ý cho em trước cuộc gọi với trường.' },
          { who: 'Son', voice: 'us-nam', text: "Wednesday lunchtime… sorry, I'm seeing the dentist at twelve. I booked it last week.", vi: 'Trưa thứ Tư… em xin lỗi, mười hai giờ em có hẹn nha sĩ. Em đặt từ tuần trước rồi.' },
          { who: 'Owen', voice: 'uk-nam', text: "Ah, right. What about a coffee on Wednesday morning, then? Say, nine o'clock, at the place downstairs?", vi: 'À, vậy à. Thế thì cà phê sáng thứ Tư nhé? Chẳng hạn chín giờ, ở quán dưới nhà?' },
          { who: 'Son', voice: 'us-nam', text: "Nine is perfect. I'm going to prepare some questions for you, too.", vi: 'Chín giờ là tuyệt ạ. Em cũng sẽ chuẩn bị vài câu hỏi cho anh.' },
          { who: 'Owen', voice: 'uk-nam', text: "Brilliant. And let's still have that proper lunch at some point. I'm going to book somewhere nice in Chinatown for next week.", vi: 'Tuyệt. Và mình vẫn ăn bữa trưa đàng hoàng đó vào lúc nào đó nhé. Anh sẽ đặt một chỗ ngon ở Chinatown cho tuần sau.' },
          { who: 'Son', voice: 'us-nam', text: 'That sounds great. Thanks for letting me know early, Owen.', vi: 'Nghe tuyệt quá ạ. Cảm ơn anh đã báo em sớm.' },
          { who: 'Owen', voice: 'uk-nam', text: "Not at all. Sorry again for the change. I'll send you a new calendar invite now.", vi: 'Không có gì. Xin lỗi em lần nữa vì đổi lịch. Anh gửi lời mời lịch mới cho em ngay đây.' },
          { who: 'Son', voice: 'us-nam', text: "Really, it's fine. See you Wednesday morning!", vi: 'Thật mà, không sao đâu ạ. Hẹn anh sáng thứ Tư!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd10-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Owen phải dời buổi ăn trưa?',
            options: ['Anh ấy bị ốm', 'Anh ấy bay đi Jakarta', 'Một khách hàng bay từ Jakarta sang và anh ấy đưa khách đi ăn', 'Anh ấy quên lịch'],
            correct: 2,
            why: '"A client\'s **flying in** from Jakarta tomorrow, and **I\'m taking them out** for lunch." Hai câu hiện tại tiếp diễn = việc đã chốt. **fly in** = bay tới (nơi mình đang ở).',
          },
          {
            q: 'Vì sao trưa thứ Tư không được?',
            options: ['Sơn có cuộc gọi với trường', 'Sơn có hẹn nha sĩ lúc 12 giờ', 'Owen bận họp', 'Quán dưới nhà đóng cửa'],
            correct: 1,
            why: '"**I\'m seeing the dentist** at twelve. I booked it last week." Cuộc gọi với trường là **tối** thứ Tư (cảnh 1), không phải buổi trưa.',
          },
          {
            q: 'Cuối cùng hai người chốt gì?',
            options: ['Ăn trưa thứ Tư lúc 12:30', 'Cà phê 9 giờ sáng thứ Tư ở quán dưới nhà', 'Ăn trưa ở Chinatown ngày mai', 'Gọi video tối thứ Tư'],
            correct: 1,
            why: '"What about a coffee on Wednesday morning? Say, nine o\'clock, at the place downstairs?" — "**Nine is perfect.**" Bữa trưa ở Chinatown là **tuần sau**, Owen **sẽ** đặt (I\'m going to book…).',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Trong lời mời, người bản xứ nói rất nhanh các cụm **do you want to, going to, have to**. Bấm loa, nghe rồi gõ lại **đúng cả câu** (viết đầy đủ, không viết "wanna", "gonna"). Viết hoa, dấu câu không tính.',
      },
      {
        t: 'dictation',
        id: 'gtd10-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — lời rủ', spell: 'Do you want to come along?', answer: 'Do you want to come along?' },
          { label: 'Câu 2 — giờ hẹn', spell: "We're meeting there at half seven to get a table.", answer: "We're meeting there at half seven to get a table.", alt: ['We are meeting there at half seven to get a table.', "We're meeting there at half 7 to get a table.", "We're meeting there at 7:30 to get a table."] },
          { label: 'Câu 3 — từ chối', spell: "I'd love to come, but I can't move that call.", answer: "I'd love to come, but I can't move that call.", alt: ["I'd love to come but I can't move that call.", 'I would love to come, but I cannot move that call.', "I would love to come, but I can't move that call."] },
          { label: 'Câu 4 — gợi ý khác', spell: "Why don't you come after?", answer: "Why don't you come after?", alt: ["Why don't you come after"] },
          { label: 'Câu 5 — giờ "-ish"', spell: 'Anywhere between seven and half seven is fine.', answer: 'Anywhere between seven and half seven is fine.', alt: ['Anywhere between 7 and half 7 is fine.', 'Anywhere between 7 and 7:30 is fine.'] },
          { label: 'Câu 6 — từ chối khéo', spell: "That's really nice of you to ask, but I think I'll be pretty tired.", answer: "That's really nice of you to ask, but I think I'll be pretty tired.", alt: ["That's really nice of you to ask but I think I'll be pretty tired.", 'That is really nice of you to ask, but I think I will be pretty tired.'] },
          { label: 'Câu 7 — xin dời', spell: "I'm going to have to move it.", answer: "I'm going to have to move it.", alt: ['I am going to have to move it.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn làm gì'],
        rows: [
          ['Seven-ish.', 'Khoảng 7 giờ. Tiệc ở nhà: tới 7:10–7:30 là đẹp. **Không** áp dụng cho họp hay nhà hàng.', 'Tới trễ một chút, đừng tới sớm.'],
          ['Are you keen? (Úc, NZ)', 'Bạn có muốn đi / có hứng không?', "Yeah, keen! · Sounds good!"],
          ['Come whenever.', 'Tới lúc nào cũng được **trong buổi đó**, không phải "nửa đêm cũng được".', 'Hỏi lại khung giờ nếu chưa rõ.'],
          ["Bring your flatmate if he's around.", 'Lời mời thật cho cả bạn của bạn.', 'Báo trước có đi cùng ai không.'],
          ['We should grab a coffee sometime!', 'Lời xã giao, **chưa phải** lời hẹn. Chỉ thành lời hẹn khi có ngày giờ.', "Muốn thật thì chốt: 'Sure! How about Thursday?'"],
          ["I'll try to make it.", 'Chưa chắc, khả năng không tới khá cao.', 'Đừng giữ chỗ cho người đó.'],
          ["I'm going to have to move it.", 'Tôi buộc phải dời (rất lịch sự, cho thấy không muốn mà phải làm).', "No problem. When would suit you?"],
          ['That might be a little difficult. (khách Nhật)', 'Gần như chắc chắn là **KHÔNG**. Người Nhật hiếm khi nói "No" thẳng.', 'Đừng ép. Đưa phương án khác hoặc bỏ qua nhẹ nhàng.'],
        ],
        caption: 'Lời mời trong tiếng Anh có **mức độ thật** khác nhau. Có ngày, giờ, chỗ thì là mời thật. Chỉ có "sometime", "one day" thì thường là xã giao.',
      },
      {
        t: 'note',
        title: 'Mẹo: được mời nhanh giữa chỗ ồn mà không nghe kịp',
        items: [
          'Lời mời luôn có 4 thứ: **việc gì · khi nào · ở đâu · ai đi**. Nghe sót thứ nào thì hỏi đúng thứ đó: "Sorry, **where** is it?" · "Sorry, what **time** did you say?"',
          'Đọc lại để chốt: "So that\'s **Saturday, seven-ish, at your condo**, right?" Người kia sửa ngay nếu bạn nghe sai.',
          'Không hiểu một từ lạ (keen, arvo, BYO): hỏi thẳng như Sơn: "**Keen? Sorry, what does that mean?**" Người mời sẽ thấy vui vì bạn quan tâm, không thấy phiền.',
          'Xin gửi bằng chữ: "**Could you send me the details?**" Ở công sở, người ta thường gửi lời mời lịch (calendar invite) hoặc thêm bạn vào nhóm chat.',
          'Chưa chắc lịch: đừng nói "Yes" cho xong. Nói "**Can I check my calendar and let you know by tomorrow?**" rồi trả lời **đúng hẹn**.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Rủ đi', 'Do you fancy…? · Are you up for…?', 'Do you want to…? · Wanna…?', 'Are you keen? · Keen for…?'],
          ['Nhận lời', "Lovely! · I'd love to.", 'Sure! · Sounds great!', 'Yeah, keen! · Sounds good.'],
          ['Từ chối nhẹ', "I'll have to give it a miss.", 'Can I take a rain check?', "Can't make it, sorry."],
          ['Buổi chiều', 'afternoon', 'afternoon', 'arvo (Úc, rất thân)'],
          ['Tự mang đồ uống', 'bring a bottle', 'BYOB', 'BYO'],
          ['Tiệc nướng', 'barbecue', 'barbecue · cookout', 'barbie · BBQ'],
          ['Khoảng giờ', 'seven-ish', 'around seven', 'seven-ish'],
        ],
        caption: '**rain check** (Mỹ) gốc từ vé xem bóng chày được dùng lại khi trận bị hoãn vì mưa: "Can I take a rain check?" = hôm nay không được, để lần sau nhé. **give it a miss** (Anh) = lần này bỏ qua.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-a2-04 · I\'d Love To, But…** — Hiếu từ chối một chuyến leo núi, hẹn cà phê ngày khác; Chloe lưỡng lự trước một bữa tiệc rồi nhận lời.',
          '**en-ds-c1-01 · What They Say vs. What They Mean** — lời nói vòng, nói giảm của người Anh. Khó, nghe khi tới chặng 4–5.',
          'Tập đầu là cảnh khác bài hôm nay (leo núi, tiệc sinh nhật). Nghe để gặp lại **I\'d love to, but…** và hiện tại tiếp diễn cho kế hoạch.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd10-noi',
    kind: 'speaking',
    title: 'Từ chối khéo không làm mất lòng',
    goal: 'Mời, nhận lời, xin thời gian suy nghĩ, từ chối khéo và dời hẹn bằng câu tự nhiên; nói về kế hoạch bằng be going to và hiện tại tiếp diễn; luôn kèm lý do ngắn và một phương án khác.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**Từ chối khéo có 4 bước**: cảm ơn → lý do ngắn → phương án khác → giữ không khí vui. Thiếu bước nào thì lời từ chối nghe cụt.',
          '**28 câu mẫu** cho cả vòng: mời · nhận lời · chưa chắc · từ chối · dời hẹn · huỷ sát giờ.',
          'Ngữ pháp: **I\'m + V-ing** (kế hoạch đã chốt) và **I\'m going to + V** (ý định), đặt cạnh **I\'ll** của Ngày 9. Nối câu: **instead · though**.',
          'Ngôn ngữ cơ thể: mặt khi nhận lời, khi tiếc nuối; cụng ly; cử chỉ bắt chéo tay của người Nhật; giờ "-ish".',
          'Cuối bài bạn **là người mời** và phải xử lý khi bị từ chối, rồi nhập vai với Gia sư AI.',
        ],
      },

      { t: 'h', text: '1. Từ chối khéo = 4 bước' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Khung một lời từ chối',
        caption: 'Lý do chỉ cần **một câu, và là thật**. Không cần kể dài. Người Việt hay xin lỗi rất nhiều lần; một lần là đủ.',
        steps: [
          { label: 'Cảm ơn / tỏ ra thích', sub: "Oh, thanks for asking!" },
          { label: 'Lý do ngắn, thật', sub: "I'd love to, but I'm flying to Penang that weekend." },
          { label: 'Phương án khác', sub: 'Could I join the next one instead?' },
          { label: 'Giữ không khí vui', sub: 'Have a great time, though!' },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Cùng một lời "không", hai cách nói',
        caption: 'Hai cột đều là từ chối. Cột trái làm người mời ngại mời lại. Cột phải giữ được cửa cho lần sau.',
        cols: [
          {
            title: 'Cụt (người nghe thấy bị gạt đi)',
            anh: 'neutral-face',
            items: ['No, I can\'t.', "I'm busy.", 'Maybe.', '(im lặng, không trả lời tin nhắn)'],
          },
          {
            title: 'Khéo (người nghe vẫn vui)',
            anh: 'slightly-smiling-face',
            items: [
              'Oh, thanks for asking!',
              "I'd love to, but I've already got plans on Saturday.",
              'How about next weekend instead?',
              'Have fun, though!',
            ],
          },
        ],
      },

      { t: 'h', text: '2. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo một vòng hẹn: **mời → nhận lời → chưa chắc → từ chối → dời → huỷ**. Bấm loa, nói to theo. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Are you doing anything on Saturday?', pos: 'phr', ipa: '/ɑːr ju ˈduːɪŋ ˈeniθɪŋ ɑːn ˈsætərdeɪ/', vi: 'Thứ Bảy bạn có làm gì không? (mở lời trước khi mời)', ex: 'Are you doing anything on Saturday night?', exVi: 'Tối thứ Bảy bạn có làm gì không?', more: 'Hỏi kế hoạch trước để người kia **không bị kẹt**: họ có thể nói "I\'m busy" trước khi biết bạn mời gì.' },
          { w: 'Do you want to come along?', pos: 'phr', ipa: '/də ju ˌwɑːnt tə kʌm əˈlɔːŋ/', vi: 'Bạn muốn đi cùng không?', ex: "We're doing the quiz night on Wednesday. Do you want to come along?", exVi: 'Thứ Tư bọn mình đi đố vui. Bạn muốn đi cùng không?', more: '**come along** = đi cùng nhóm. Nói nhanh nghe như "d\'you wanna come along?"' },
          { w: "We're having a barbecue. You should come!", pos: 'phr', ipa: '/wɪr ˈhævɪŋ ə ˈbɑːrbɪkjuː ju ʃʊd ˈkʌm/', vi: 'Bọn mình làm tiệc nướng. Bạn tới nhé!', ex: "We're having a barbecue at my place on Saturday. You should come!", exVi: 'Thứ Bảy bọn mình nướng thịt ở nhà mình. Bạn tới nhé!', more: '**You should come!** nghe nhiệt tình, không phải ra lệnh.', anh: 'cooking' },
          { w: "I was wondering if you'd like to…", pos: 'phr', ipa: '/aɪ wəz ˈwʌndərɪŋ ɪf jʊd ˈlaɪk tə/', vi: 'Không biết bạn có muốn… không (mời lịch sự)', ex: "I was wondering if you'd like to try a Vietnamese place with me.", exVi: 'Không biết chị có muốn đi ăn thử một quán Việt với em không.', more: 'Dùng với người chưa thân, sếp, khách. Mềm hơn hẳn "Do you want to…?"' },
          { w: "Why don't you come after?", pos: 'phr', ipa: '/ˌwaɪ doʊntʃə kʌm ˈæftər/', vi: 'Sao bạn không tới sau? (gợi ý khác)', ex: "You've got a call at eight? Why don't you come after?", exVi: 'Tám giờ bạn có cuộc gọi à? Sao không tới sau?' },
          { w: "I'd love to!", pos: 'phr', ipa: '/aɪd ˈlʌv tuː/', vi: 'Mình rất muốn! (nhận lời)', ex: "A quiz night? I'd love to!", exVi: 'Đố vui à? Mình rất muốn!', anh: 'grinning-face-with-smiling-eyes' },
          { w: 'Thanks for inviting me.', pos: 'phr', ipa: '/θæŋks fər ɪnˈvaɪtɪŋ mi/', vi: 'Cảm ơn đã mời mình.', ex: 'Yes, definitely. Thanks for inviting me!', exVi: 'Có chứ, chắc chắn rồi. Cảm ơn đã mời mình!' },
          { w: "Sounds great. I'm in!", pos: 'phr', ipa: '/saʊndz ˈɡreɪt aɪm ˈɪn/', vi: 'Nghe hay đấy. Cho mình một chân! (thân)', ex: "Pho after work? Sounds great. I'm in!", exVi: 'Tan làm đi ăn phở à? Hay đấy. Cho mình một chân!' },
          { w: 'What time should I come?', pos: 'phr', ipa: '/ˌwʌt ˈtaɪm ʃʊd aɪ ˈkʌm/', vi: 'Mình nên tới lúc mấy giờ?', ex: 'Thanks for inviting me. What time should I come?', exVi: 'Cảm ơn đã mời. Mình nên tới lúc mấy giờ?' },
          { w: 'Can I bring anything?', pos: 'phr', ipa: '/kən aɪ ˈbrɪŋ ˈeniθɪŋ/', vi: 'Mình có cần mang gì không?', ex: 'Can I bring anything? Drinks, dessert?', exVi: 'Mình có cần mang gì không? Đồ uống, tráng miệng?', more: 'Được mời tới nhà thì **luôn hỏi câu này**, kể cả khi chắc chắn chủ nhà sẽ nói "Just bring yourself".', anh: 'wrapped-gift' },
          { w: 'Is it okay if I bring a friend?', pos: 'phr', ipa: '/ɪz ɪt oʊˈkeɪ ɪf aɪ ˈbrɪŋ ə ˈfrend/', vi: 'Mình rủ thêm một người bạn được không?', ex: "Is it okay if I bring my flatmate? He doesn't know many people here.", exVi: 'Mình rủ bạn cùng nhà đi được không? Cậu ấy ở đây chưa quen ai.', more: 'Hỏi **trước**, đừng tự dẫn người tới. Chủ nhà cần biết để chuẩn bị đồ ăn.' },
          { w: "Can I let you know by tomorrow?", pos: 'phr', ipa: '/kən aɪ ˌlet ju ˈnoʊ baɪ təˈmɑːroʊ/', vi: 'Mai mình trả lời bạn được không?', ex: "I'm not sure yet. Can I let you know by tomorrow?", exVi: 'Mình chưa chắc. Mai mình trả lời bạn được không?', more: '**by** + thời gian = **trước / muộn nhất là**. Hứa rồi thì trả lời đúng hẹn, kể cả khi câu trả lời là "không".' },
          { w: 'It depends on…', pos: 'phr', ipa: '/ɪt dɪˈpendz ɑːn/', vi: 'Còn tuỳ vào…', ex: 'It depends on when my call finishes.', exVi: 'Còn tuỳ cuộc gọi của mình xong lúc nào.' },
          { w: "I'd love to, but…", pos: 'phr', ipa: '/aɪd ˈlʌv tə bʌt/', vi: 'Mình rất muốn, nhưng… (từ chối mềm)', ex: "I'd love to, but I'm flying to Penang that weekend.", exVi: 'Mình rất muốn, nhưng cuối tuần đó mình bay đi Penang.', more: 'Sau **but** là một kế hoạch có sẵn, thường dùng **I\'m + V-ing**.' },
          { w: "That's really nice of you to ask, but…", pos: 'phr', ipa: '/ðæts ˈrɪəli ˈnaɪs əv ju tu ˈæsk bʌt/', vi: 'Bạn rủ mình vậy là quý lắm, nhưng…', ex: "That's really nice of you to ask, but I'll be pretty tired.", exVi: 'Bạn rủ vậy là quý lắm, nhưng chắc mình sẽ khá mệt.' },
          { w: "I'm afraid I can't make it.", pos: 'phr', ipa: '/aɪm əˈfreɪd aɪ ˌkænt ˈmeɪk ɪt/', vi: 'Tiếc là mình không đi được.', ex: "I'm afraid I can't make it on Friday. I'm working late.", exVi: 'Tiếc là thứ Sáu mình không đi được. Mình làm muộn.', more: '**make it** = tới được, sắp xếp đi được. "Can you make it?" = Bạn đi được không?' },
          { w: "I've already got plans.", pos: 'phr', ipa: '/aɪv ɔːlˈredi ˌɡɑːt ˈplænz/', vi: 'Mình có hẹn / có kế hoạch rồi.', ex: "Sorry, I've already got plans on Saturday.", exVi: 'Tiếc quá, thứ Bảy mình có hẹn rồi.', more: 'Không cần kể kế hoạch là gì. Câu này đủ lịch sự.' },
          { w: 'Could I join the next one instead?', pos: 'phr', ipa: '/kʊd aɪ ˌdʒɔɪn ðə ˈnekst wʌn ɪnˈsted/', vi: 'Lần sau mình tham gia được không?', ex: "I can't come this Sunday. Could I join the next one instead?", exVi: 'Chủ nhật này mình không đi được. Lần sau mình tham gia nhé?' },
          { w: 'Can I take a rain check?', pos: 'phr', ipa: '/kən aɪ ˌteɪk ə ˈreɪn tʃek/', vi: 'Để lần sau được không? (Mỹ, thân)', ex: "Drinks tonight? Can I take a rain check? I'm exhausted.", exVi: 'Tối nay đi uống à? Để lần sau nhé? Mình mệt rã rời.', anh: 'umbrella-with-rain-drops' },
          { w: 'Have a great time, though!', pos: 'phr', ipa: '/ˌhæv ə ˌɡreɪt ˈtaɪm ðoʊ/', vi: 'Dù sao cũng chúc mọi người vui nhé!', ex: "I can't make it. Have a great time, though!", exVi: 'Mình không đi được. Dù sao cũng chúc mọi người vui nhé!' },
          { w: "I'm going to have to move our lunch.", pos: 'phr', ipa: '/aɪm ˈɡoʊɪŋ tə ˈhæf tə ˈmuːv ˌaʊər ˈlʌntʃ/', vi: 'Chắc mình phải dời bữa trưa của mình.', ex: "I'm really sorry, but I'm going to have to move our lunch.", exVi: 'Mình rất xin lỗi, nhưng chắc phải dời bữa trưa của mình.', more: '**going to have to** nghe áy náy, lịch sự hơn "I must move it".' },
          { w: "Something's come up.", pos: 'phr', ipa: '/ˈsʌmθɪŋz ˌkʌm ˈʌp/', vi: 'Có việc đột xuất.', ex: "Sorry, something's come up at work. Can we do Thursday?", exVi: 'Xin lỗi, công ty có việc đột xuất. Mình đổi sang thứ Năm được không?', more: 'Câu chuẩn khi phải dời mà **không muốn kể chi tiết**. Không ai hỏi thêm.' },
          { w: 'When would suit you instead?', pos: 'phr', ipa: '/wen wʊd ˈsuːt ju ɪnˈsted/', vi: 'Vậy giờ nào khác tiện cho bạn?', ex: 'No problem at all. When would suit you instead?', exVi: 'Không sao đâu. Vậy giờ nào khác tiện cho bạn?' },
          { w: 'Could we make it Wednesday instead?', pos: 'phr', ipa: '/kʊd wi ˈmeɪk ɪt ˈwenzdeɪ ɪnˈsted/', vi: 'Mình đổi sang thứ Tư được không?', ex: "Tuesday's tricky for me. Could we make it Wednesday instead?", exVi: 'Thứ Ba mình hơi khó. Đổi sang thứ Tư được không?', more: '**make it + ngày / giờ** = chốt vào ngày, giờ đó.' },
          { w: 'Does nine work for you?', pos: 'phr', ipa: '/dəz ˈnaɪn ˈwɝːk fər ju/', vi: 'Chín giờ có được không?', ex: 'Does nine work for you? — Nine is perfect.', exVi: 'Chín giờ được không? — Chín giờ là tuyệt.' },
          { w: "I'm so sorry to cancel at the last minute.", pos: 'phr', ipa: '/aɪm ˈsoʊ ˈsɑːri tə ˈkænsl ət ðə ˌlæst ˈmɪnɪt/', vi: 'Thật xin lỗi vì huỷ sát giờ.', ex: "I'm so sorry to cancel at the last minute. I've got a fever.", exVi: 'Thật xin lỗi vì huỷ sát giờ. Mình bị sốt.', more: 'Huỷ sát giờ thì **gọi hoặc nhắn ngay** khi biết, đừng đợi.' },
          { w: 'invitation · invite (n)', pos: 'n', ipa: '/ˌɪnvɪˈteɪʃn · ˈɪnvaɪt/', vi: 'lời mời; thiệp mời', ex: "Thanks for the invite! I'll be there.", exVi: 'Cảm ơn đã mời! Mình sẽ tới.', more: '**invite** (danh từ) thân mật, nhấn âm đầu /ˈɪnvaɪt/. **invitation** dùng mọi lúc. Động từ **invite** nhấn âm sau /ɪnˈvaɪt/.', anh: 'envelope' },
          { w: 'RSVP', pos: 'v', ipa: '/ˌɑːr es viː ˈpiː/', vi: 'trả lời có đi hay không (trên thiệp mời)', ex: 'Please RSVP by Wednesday 9 December.', exVi: 'Vui lòng báo có tham dự hay không trước thứ Tư ngày 9 tháng 12.', more: 'Gốc tiếng Pháp "Répondez s\'il vous plaît". Thấy RSVP là **phải trả lời**, cả khi không đi.' },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Mời', 'Wanna come? · Are you keen?', 'Do you want to come along?', "I was wondering if you'd like to join us."],
          ['Nhận lời', "I'm in! · Yeah, keen!", "I'd love to. Thanks for inviting me.", "Thank you, I'd be delighted to come."],
          ['Chưa chắc', "Maybe. I'll let you know.", 'Can I let you know by tomorrow?', 'May I confirm by tomorrow?'],
          ['Từ chối', "Can't, sorry! · Rain check?", "I'd love to, but I've already got plans.", "Unfortunately, I have a prior commitment that evening."],
          ['Đề nghị khác', 'Next time?', 'Could I join the next one instead?', 'Perhaps we could arrange another time?'],
          ['Dời hẹn', 'Can we do Thursday instead?', "Something's come up. Could we make it Thursday?", "I'm afraid I need to reschedule. Would Thursday suit you?"],
          ['Huỷ sát giờ', "So sorry, can't make it tonight!", "I'm so sorry to cancel at the last minute.", 'Please accept my apologies for the late notice.'],
        ],
        caption: 'Cột phải dùng nhiều trong **email** (bài Viết hôm nay). Nói chuyện trực tiếp với sếp người Anh, Mỹ, Úc thì cột giữa là đủ lịch sự.',
      },
      {
        t: 'note',
        title: 'Mẹo: "Maybe" của bạn và "Maybe" của họ',
        items: [
          'Người Việt hay nói "để em xem" cho đỡ ngại, rồi **không trả lời**. Ở Anh, Mỹ, Úc, im lặng tới phút chót bị coi là **thiếu lịch sự hơn** một lời từ chối rõ ràng.',
          'Nếu thật sự chưa biết: nói **khi nào** bạn sẽ trả lời ("by tomorrow", "by Thursday") và giữ đúng hẹn.',
          'Ngược lại, người bản xứ nói "**Maybe**" hoặc "**I\'ll try to make it**" thì thường là khả năng thấp. Đừng giữ chỗ cho họ.',
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt nói về tương lai chỉ cần "sẽ" hoặc "định". Tiếng Anh có ba cách, mỗi cách cho một kiểu kế hoạch. Hôm nay bạn học hai cách mới: **I\'m + V-ing** (đã chốt, có giờ, có người) và **I\'m going to + V** (đã định). Cách thứ ba, **I\'ll**, bạn có từ Ngày 9.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + am / is / are + V-ing (+ thời gian)',
            vi: 'Kế hoạch **đã sắp xếp**: đã đặt vé, đã hẹn người, có giờ cụ thể.',
            examples: [
              { en: "I'm having a video call with my supervisor at eight.", vi: 'Tám giờ mình có cuộc gọi video với cô hướng dẫn.' },
              { en: "We're meeting there at half seven.", vi: 'Bọn mình hẹn nhau ở đó lúc bảy rưỡi.' },
              { en: "A client's flying in from Jakarta tomorrow.", vi: 'Mai có khách bay từ Jakarta sang.' },
            ],
          },
          {
            formula: 'S + am / is / are + going to + V',
            vi: '**Ý định** đã có từ trước (chưa chắc đã đặt chỗ, hẹn người).',
            examples: [
              { en: "I'm going to prepare some questions.", vi: 'Mình định chuẩn bị vài câu hỏi.' },
              { en: "I'm going to book somewhere nice in Chinatown.", vi: 'Mình định đặt một chỗ ngon ở Chinatown.' },
              { en: "We're going to be there till ten at least.", vi: 'Bọn mình sẽ ở đó tới ít nhất mười giờ.' },
            ],
          },
          {
            formula: 'Are you + V-ing + … ? · What are you doing + thời gian?',
            vi: 'Hỏi kế hoạch của người khác, thường để chuẩn bị mời.',
            examples: [
              { en: 'Are you doing anything on Saturday night?', vi: 'Tối thứ Bảy bạn có làm gì không?' },
              { en: 'What are you doing this weekend?', vi: 'Cuối tuần này bạn làm gì?' },
              { en: 'Are you going to the quiz on Wednesday?', vi: 'Thứ Tư bạn có đi đố vui không?' },
            ],
          },
          {
            formula: "I'd love to, but + S + am / is / are + V-ing …",
            vi: 'Từ chối bằng một kế hoạch có sẵn.',
            examples: [
              { en: "I'd love to, but I'm seeing the dentist at twelve.", vi: 'Mình rất muốn, nhưng mười hai giờ mình có hẹn nha sĩ.' },
              { en: "I'd love to, but I'm flying to Penang on Friday.", vi: 'Mình rất muốn, nhưng thứ Sáu mình bay đi Penang.' },
              { en: "I'd love to come, but I'm working late tonight.", vi: 'Mình rất muốn đi, nhưng tối nay mình làm muộn.' },
            ],
          },
          {
            formula: "Why don't you / we + V? · How about + N / V-ing?",
            vi: 'Mời hoặc đưa một phương án khác.',
            examples: [
              { en: "Why don't you come after the call?", vi: 'Sao bạn không tới sau cuộc gọi?' },
              { en: 'How about a coffee on Wednesday morning?', vi: 'Cà phê sáng thứ Tư thì sao?' },
              { en: "Why don't we do Thursday instead?", vi: 'Hay mình đổi sang thứ Năm?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Câu', 'Nghĩa', 'Ví dụ trong cảnh'],
        rows: [
          ["I'll + V", 'Quyết định **ngay lúc nói** (Ngày 9)', "In that case, I'll come straight after the call."],
          ["I'm going to + V", '**Ý định** đã có trong đầu từ trước', "I'm going to prepare some questions for you."],
          ["I'm + V-ing", 'Kế hoạch **đã chốt**: có giờ, có chỗ, có người khác', "I'm seeing the dentist at twelve."],
        ],
        caption: 'Hai dòng dưới nhiều khi thay nhau được. Đã đặt lịch, đã hẹn người thì **V-ing** nghe tự nhiên nhất. Khi nghe: **going to** thường bị nói thành "gonna" (Ngày 25 học cách nói).',
      },
      {
        t: 'rule',
        formula: "I'm + V-ing (đã chốt) · I'm going to + V (đã định) · I'll + V (vừa quyết) · I'd love to, but + kế hoạch",
        vi: 'Nói về kế hoạch: đã hẹn giờ, hẹn người thì dùng V-ing; mới là ý định thì dùng going to; vừa nghĩ ra lúc nói thì dùng I\'ll. Từ chối: I\'d love to, but + kế hoạch có sẵn.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: instead · though',
        items: [
          '**instead** (thay vào đó) thường đứng **cuối câu**: "Could we make it Wednesday **instead**?" · "I can\'t do Saturday, but I can do Sunday **instead**."',
          '**instead of + N / V-ing** đứng giữa câu: "Let\'s have coffee **instead of** lunch."',
          '**though** (dù sao thì, nhưng mà) đứng **cuối câu** trong văn nói, nghe nhẹ hơn but: "I can\'t make it. Have fun, **though**!" · "Thanks for asking, **though**."',
          'Ghép với từ nối cũ: "I\'d love to, **but** I\'m working late, **so** could we do Friday **instead**?"',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd10-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "I'm + V-ing · I'm going to + V · I'd love to, but… · instead · though",
        items: [
          { q: 'Thứ Sáu mình bay đi Penang. (đã đặt vé)', hint: 'flying, Penang', answers: ["I'm flying to Penang on Friday.", 'I am flying to Penang on Friday.', "I'm flying to Penang this Friday.", "On Friday I'm flying to Penang."] },
          { q: 'Mình rất muốn, nhưng mình có hẹn rồi.', hint: "I'd love to, already got plans", answers: ["I'd love to, but I've already got plans.", "I'd love to but I've already got plans.", "I'd love to, but I already have plans.", 'I would love to, but I have already got plans.', 'I would love to, but I already have plans.', "I'd love to, but I've got plans."] },
          { q: 'Mình định chuẩn bị vài câu hỏi.', hint: 'going to, prepare', answers: ["I'm going to prepare some questions.", 'I am going to prepare some questions.', "I'm going to prepare a few questions."] },
          { q: 'Mình đổi sang thứ Năm được không?', hint: 'could we make it, instead', answers: ['Could we make it Thursday instead?', 'Can we make it Thursday instead?', 'Could we make it Thursday?', 'Could we do Thursday instead?', 'Can we do Thursday instead?'] },
          { q: 'Mình không đi được. Dù sao cũng chúc vui nhé!', hint: "can't make it, have fun, though", answers: ["I can't make it. Have fun, though!", "I can't make it. Have fun though!", 'I cannot make it. Have fun, though!', "I can't make it. Have a great time, though!", "I can't make it, sorry. Have fun, though!"] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật khi mời và từ chối',
        items: [
          '~~I\'m busy.~~ (một câu, rồi thôi) → **I\'d love to, but I\'ve already got plans.** Câu cũ đúng ngữ pháp nhưng nghe như bạn không muốn đi **với người đó**.',
          '~~I will go to Penang this weekend.~~ (đã đặt vé) → **I\'m going to Penang this weekend.** / **I\'m flying to Penang this weekend.** Kế hoạch đã chốt dùng V-ing, không dùng will.',
          '~~I invite you to dinner.~~ (ý là mình trả tiền) → **Let me take you out for dinner.** Tiếng Việt "mời" thường có nghĩa là trả tiền. Tiếng Anh **invite** chỉ là rủ; ai trả tiền là chuyện khác (xem Ngày 4).',
          '~~Yes, maybe.~~ / ~~I will try.~~ (khi biết chắc mình không đi) → **I don\'t think I can make it, sorry.** Nói rõ để người mời còn tính số người.',
          '~~Sorry, I can\'t.~~ (không thêm gì) → **Sorry, I can\'t make it this time. Could I join the next one?** Luôn kèm một phương án khác.',
          '~~I will join with you.~~ → **I\'ll join you.** · **Count me in.** Động từ join không cần with.',
          '~~Thank you for your invitation. I will attend.~~ (nhắn bạn trong nhóm chat) → **Thanks for the invite! I\'ll be there.** Câu cũ trang trọng như công văn. Chỉ dùng kiểu đó trong email trang trọng.',
          '~~Can we delay our lunch?~~ → **Can we move our lunch?** · **Can we push it back to Friday?** **delay** là bị trễ ngoài ý muốn (the flight was delayed). Chủ động dời thì dùng **move, reschedule, push back** (lùi), **bring forward** (dời sớm hơn).',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi mời và từ chối' },
      {
        t: 'p',
        text: 'Khi từ chối, **mặt bạn nói trước lời bạn**. Một cái nhăn mặt tiếc nuối làm câu "I can\'t" mềm đi rất nhiều. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ quanh một lời mời',
        items: [
          { anh: 'grinning-face-with-smiling-eyes', w: "I'd love to!", ro: '/aɪd ˈlʌv tuː/', vi: 'Nhận lời: **cười, giọng lên cao, trả lời ngay**. Nhận lời mà mặt phẳng lặng, giọng đều đều thì người mời nghĩ bạn miễn cưỡng.' },
          { anh: 'grimacing-face', w: "Oh no, I'd love to, but…", ro: '/oʊ ˈnoʊ aɪd ˈlʌv tə bʌt/', vi: 'Nhăn mặt nhẹ, hơi nghiêng đầu trước khi từ chối = "tôi thật sự tiếc". Ở Anh, Mỹ, Úc ai cũng hiểu ngay.' },
          { anh: 'thinking-face', w: 'Hmm, let me check my calendar.', ro: '', vi: 'Rút điện thoại ra xem lịch = **chưa nhận lời**. Rất bình thường ở công sở, nhưng phải trả lời lại.' },
          { anh: 'folded-hands', w: 'Thanks so much for asking.', ro: '/θæŋks ˈsoʊ ˈmʌtʃ fər ˈæskɪŋ/', vi: 'Chắp tay cảm ơn quen ở Việt Nam, Thái, Nhật. Ở Anh – Mỹ ít người làm, có khi bị hiểu là "năn nỉ". Nói lời cảm ơn và mỉm cười là đủ.' },
          { anh: 'person-gesturing-no', w: '(đừng làm) No.', ro: '', vi: 'Bắt chéo hai tay thành chữ X: ở **Nhật** nghĩa là "không được". Ở Anh, Mỹ ít dùng và trông gắt. Từ chối bằng lời mềm, không bằng cử chỉ này.' },
          { anh: 'clinking-glasses', w: 'Cheers!', ro: '/tʃɪrz/', vi: 'Cụng ly ở Anh, Mỹ, Úc: **nhìn vào mắt** người kia, nói "Cheers!" nhỏ nhẹ. Không hô "một, hai, ba, dzô", không ép người khác uống cạn.' },
          { anh: 'eight-oclock', w: 'Seven-ish.', ro: '/ˌsevn ˈɪʃ/', vi: 'Tiệc ở nhà với "-ish": tới muộn 10–30 phút là lịch sự. Họp, nhà hàng, rạp phim thì **đúng giờ**.' },
          { anh: 'wrapped-gift', w: 'I brought some drinks for everyone.', ro: '', vi: 'Được mời tới nhà người phương Tây: mang chút đồ uống, bánh hoặc hoa nhỏ. Không cần quà to, không đưa phong bì tiền.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Lời "hôm nào đi cà phê nhé"', 'Thường là xã giao.', 'Cũng thường là xã giao, trừ khi có ngày giờ.', 'Thường là xã giao.'],
          ['Cách nói "không"', 'Hay vòng: "để em xem", "chắc khó".', 'Nói rõ nhưng mềm: I\'d love to, but…', 'Rất vòng: "chotto…" (hơi…), "That might be difficult" = không.'],
          ['Im lặng không trả lời', 'Nhiều người hiểu là "không".', 'Bị coi là thiếu lịch sự. Phải trả lời, kể cả "không".', 'Hiếm, thường có câu trả lời vòng.'],
          ['Đến muộn', 'Muộn 15–30 phút khá thường.', 'Tiệc nhà: muộn chút được. Họp, nhà hàng: đúng giờ, muộn thì nhắn trước.', 'Rất đúng giờ, kể cả tiệc.'],
          ['Uống rượu khi mời', 'Hay mời uống, có khi ép.', 'Không ép. "No, thanks" là đủ, không ai hỏi lý do.', 'Hay rót cho nhau, nhưng uống trà đá cũng không sao.'],
        ],
        caption: '**Singapore**, nơi Sơn thực tập, rất đa văn hoá: nhiều đồng nghiệp ăn chay, ăn halal hoặc không uống rượu. Khi bạn mời ăn, hỏi trước: "**Any dietary requirements?**" (Có kiêng món gì không?).',
      },

      { t: 'h', text: '7. Phát âm: I\'d love to, have to, nối âm trong lời mời' },
      {
        t: 'p',
        text: 'Lời mời và lời từ chối sống nhờ **ngữ điệu**. "I\'d love to" lên giọng ở **love** nghe vui thật; đọc đều đều nghe như đang miễn cưỡng. Trong câu từ chối, giọng **lên ở love**, **hạ ở but**. Cũng để ý **have to** đọc là /ˈhæf tə/ và **don\'t you** nối thành /ˈdoʊntʃə/.',
      },
      {
        t: 'phatam',
        id: 'gtd10-phat-am',
        title: 'Luyện phát âm — 8 câu mời và từ chối',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nghe kỹ chỗ lên xuống giọng, đừng đọc phẳng.',
        items: [
          { text: "I'd love to!", ipa: 'aɪd lʌv tuː', vi: 'I\'d có /d/ rất nhẹ · love /ʌ/ như "lắp" bỏ p · nhấn và lên giọng ở love' },
          { text: "I'd love to, but I can't.", ipa: 'aɪd lʌv tuː bət aɪ kænt', vi: 'to cuối cụm đọc đủ /tuː/ · but nhẹ /bət/ · lên ở love, hạ ở can\'t' },
          { text: 'Do you want to come along?', ipa: 'də ju wɑːnt tə kʌm əlɔːŋ', vi: 'nói nhanh nghe như "d\'you wanna come along" · along nhấn âm sau /əˈlɔːŋ/' },
          { text: "Why don't you come after?", ipa: 'waɪ doʊntʃə kʌm æftər', vi: 'don\'t you nối thành /ˈdoʊntʃə/ "đôn-chờ"' },
          { text: "I'm going to have to move it.", ipa: 'aɪm ɡoʊɪŋ tə hæf tə muːv ɪt', vi: 'have to đọc /ˈhæf tə/, không phải "hép tu" · move‿it nối "mu-vịt"' },
          { text: "That's really nice of you to ask.", ipa: 'ðæts rɪəli naɪs əv ju tu æsk', vi: 'nice‿of nối thành "nai-sợv" · nhấn ở nice' },
          { text: 'Could we make it Wednesday instead?', ipa: 'kʊd wi meɪk ɪt wenzdeɪ ɪnsted', vi: 'Wednesday /ˈwenzdeɪ/: không đọc chữ d đầu · instead nhấn âm sau /ɪnˈsted/' },
          { text: 'Are you doing anything on Saturday?', ipa: 'ər jə duːɪŋ eniθɪŋ ɑːn sætərdeɪ', vi: 'Are you nói nhẹ /ər jə/ · doing‿anything nối · lên giọng ở cuối (câu hỏi yes/no)' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: lần này bạn là người mời' },
      {
        t: 'dialogue',
        title: 'Sơn rủ Clare đi ăn đồ Việt, Clare bận, hai người chốt ngày khác',
        lines: [
          { who: 'Son', role: 'a', text: 'Hey Clare, are you doing anything on Thursday evening?', vi: 'Chị Clare ơi, tối thứ Năm chị có làm gì không?' },
          { who: 'Clare', role: 'b', text: "Thursday? Hmm, why? What's up?", vi: 'Thứ Năm à? Hừm, sao thế? Có chuyện gì?' },
          { who: 'Son', role: 'a', text: "There's a Vietnamese place near the office that does really good bún chả. I was wondering if you'd like to try it with me and a couple of friends.", vi: 'Gần công ty có một quán Việt làm bún chả ngon lắm. Không biết chị có muốn đi ăn thử với em và vài người bạn không.' },
          { who: 'Clare', role: 'b', text: "Oh, I'd love to, but I'm going to a friend's leaving do on Thursday. Sorry!", vi: 'Ồ, chị rất muốn, nhưng thứ Năm chị đi tiệc chia tay của một người bạn. Tiếc quá!' },
          { who: 'Son', role: 'a', text: 'No worries. How about next week instead?', vi: 'Không sao ạ. Hay tuần sau nhé?' },
          { who: 'Clare', role: 'b', text: "Next week works. I'm free on Tuesday or Wednesday.", vi: 'Tuần sau được. Chị rảnh thứ Ba hoặc thứ Tư.' },
          { who: 'Son', role: 'a', text: "Let's say Tuesday, then. Does seven work for you?", vi: 'Vậy chốt thứ Ba nhé. Bảy giờ có được không chị?' },
          { who: 'Clare', role: 'b', text: "Seven's perfect. Is it okay if I bring my partner? He loves Vietnamese food.", vi: 'Bảy giờ là tuyệt. Chị rủ thêm người yêu được không? Anh ấy mê đồ Việt lắm.' },
          { who: 'Son', role: 'a', text: 'Of course! The more, the merrier.', vi: 'Tất nhiên rồi ạ! Càng đông càng vui.' },
          { who: 'Clare', role: 'b', text: 'Great. Could you send me the address?', vi: 'Tuyệt. Em gửi chị địa chỉ được không?' },
          { who: 'Son', role: 'a', text: "Sure, I'll text it to you tonight.", vi: 'Dạ được, tối nay em nhắn cho chị.' },
          { who: 'Clare', role: 'b', text: "Thanks for asking me, Son. I'm really looking forward to it!", vi: 'Cảm ơn em đã rủ chị, Sơn. Chị mong tới hôm đó lắm!' },
        ],
      },
      {
        t: 'note',
        title: 'Hai cụm mới trong đoạn hội thoại',
        items: [
          '**leaving do** (Anh, Ireland, Úc) = tiệc chia tay một người nghỉ việc / chuyển đi. Mỹ nói **farewell party** hoặc **going-away party**.',
          '**The more, the merrier.** = Càng đông càng vui. Câu đáp quen thuộc khi ai đó hỏi "Can I bring a friend?".',
        ],
      },
      {
        t: 'build',
        id: 'gtd10-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Sơn (5 câu)',
        items: [
          { vi: 'Bạn mở lời: Tối thứ Năm chị có làm gì không?', chips: ['Are', 'you', 'doing', 'anything', 'on', 'Thursday', 'evening?', 'Do', 'at', 'something'], answer: ['Are', 'you', 'doing', 'anything', 'on', 'Thursday', 'evening?'] },
          { vi: 'Bạn mời lịch sự: Không biết chị có muốn đi ăn thử với em không.', chips: ['I', 'was', 'wondering', 'if', "you'd", 'like', 'to', 'try', 'it', 'with', 'me.', 'want', 'will'], answer: ['I', 'was', 'wondering', 'if', "you'd", 'like', 'to', 'try', 'it', 'with', 'me.'] },
          { vi: 'Clare bận → Bạn: Không sao ạ. Hay tuần sau nhé?', chips: ['No', 'worries.', 'How', 'about', 'next', 'week', 'instead?', 'the', 'what'], answer: ['No', 'worries.', 'How', 'about', 'next', 'week', 'instead?'] },
          { vi: 'Bạn chốt: Vậy chốt thứ Ba nhé. Bảy giờ có được không?', chips: ["Let's", 'say', 'Tuesday,', 'then.', 'Does', 'seven', 'work', 'for', 'you?', 'Do', 'at'], answer: ["Let's", 'say', 'Tuesday,', 'then.', 'Does', 'seven', 'work', 'for', 'you?'] },
          { vi: 'Clare hỏi rủ thêm người → Bạn: Tất nhiên rồi! Càng đông càng vui.', chips: ['Of', 'course!', 'The', 'more,', 'the', 'merrier.', 'most', 'happier'], answer: ['Of', 'course!', 'The', 'more,', 'the', 'merrier.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd10-noi-tra-loi',
        part: '1',
        questions: [
          'What are you doing this weekend?',
          "How do you say no to a friend's invitation without hurting them?",
          'Tell me about a time you had to cancel or move plans.',
          'Would you rather go to a party or stay at home on a Saturday night? Why?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Darren, a friendly Australian colleague in our Singapore office. Invite me to three things, one at a time: a barbecue at your condo on Saturday (seven-ish), a 6 am run on Sunday, and a team lunch on Monday that you will later need to move. Speak at natural speed (B1 level) and use a few Australian expressions like \'Are you keen?\' — explain them only if I ask. I will accept one invitation, politely decline one, and help you find a new time for the lunch. When I decline, check that I thank you, give a short reason and offer an alternative. After about 12 turns, tell me in Vietnamese two things I did well and two things to fix, especially my use of I\'m + V-ing, going to and I\'ll."',
          'Lượt hai **đổi vai**: bạn mời AI đi ăn một món Việt bạn thích, AI từ chối lần đầu, bạn phải đưa ra ngày khác và chốt đủ **ngày · giờ · chỗ · ai đi**.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd10-viet',
    kind: 'writing',
    title: 'Thiệp mời, nhắn từ chối, đổi lịch',
    goal: 'Viết được lời mời, lời nhận lời, lời từ chối và tin đổi lịch, mỗi loại hai mức (nhắn nhóm thân mật và email trang trọng); biết các chữ hay gặp trên thiệp mời: RSVP, dietary requirements, plus-one, prior commitment.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài viết hôm nay',
        items: [
          'Sơn sắp hết 10 tuần thực tập và muốn **mời cả team một bữa chia tay** ở quán Việt. Bạn viết cùng Sơn trọn vòng: mời → người nhận lời → người từ chối → một lần đổi lịch.',
          'Mỗi mẫu có hai bản đặt cạnh nhau: **nhắn nhóm chat** (thân) và **email** (trang trọng, gửi cả văn phòng, sếp, khách).',
          'Một lời mời tốt trả lời trước mọi câu hỏi: **việc gì · ngày · giờ · chỗ · trả lời trước khi nào**.',
          'Dùng lại cụm của bài Nói: I\'d love to, but… · Could we make it… instead? · Have fun, though!',
        ],
      },

      { t: 'h', text: '1. Bốn mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Lời mời',
        caption: 'Bản thân mật đặt thông tin trong câu. Bản trang trọng tách thông tin ra từng dòng để người đọc nhìn là thấy.',
        cols: [
          {
            title: 'Thân mật (nhóm chat của team)',
            anh: 'party-popper',
            items: [
              'Hi everyone! 🎉',
              "My internship finishes next week, so I'm having a little farewell dinner at a Vietnamese place near the office.",
              'Fri 11 Dec, 7-ish. Would love to see you there!',
              'Let me know if you can make it by Wed 👍',
            ],
          },
          {
            title: 'Trang trọng (email cho cả văn phòng)',
            anh: 'envelope',
            items: [
              'Dear all,',
              'As my internship is coming to an end, I would like to invite you to a farewell dinner.',
              'Date: Friday 11 December · Time: 7:00 pm · Place: Little Saigon Kitchen, 2 minutes from the office',
              'Please RSVP by Wednesday 9 December and let me know of any dietary requirements.',
              'Best regards,',
              'Nguyen Thanh Son',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Nhận lời',
        caption: 'Nhận lời xong thì hỏi luôn điều mình cần (mang gì, ăn kiêng, đi cùng ai) để người mời khỏi phải hỏi lại.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thumbs-up',
            items: ["I'm in! Can't wait 😄", 'Can I bring anything?', 'Is it okay if I bring my partner?'],
          },
          {
            title: 'Trang trọng',
            anh: 'e-mail',
            items: [
              'Dear Son,',
              'Thank you for the kind invitation. I would be delighted to attend.',
              "Just to let you know, I'm vegetarian.",
              'Looking forward to it.',
              'Best wishes,',
              'Owen',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Từ chối',
        caption: 'Đủ bốn bước của bài Nói: cảm ơn → lý do ngắn → phương án khác → lời chúc. Bản trang trọng dùng "a prior commitment" (đã có hẹn trước) để khỏi kể chi tiết.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'grimacing-face',
            items: [
              "Ah, I'd love to, but I'm flying home to Manila that weekend 😢",
              'Could we grab a coffee before you go instead?',
              'Have an amazing night, though!',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'memo',
            items: [
              'Dear Son,',
              'Thank you very much for the invitation.',
              'Unfortunately, I have a prior commitment that evening and will not be able to attend.',
              'I wish you every success with your studies, and I hope we can stay in touch.',
              'Kind regards,',
              'Michelle Tan',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Đổi lịch',
        caption: 'Xin lỗi một lần, đưa sẵn **hai lựa chọn** để người kia chỉ cần chọn. Đừng chỉ viết "Can we change?" rồi bỏ đó.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'spiral-calendar',
            items: [
              "Hey Nadia, so sorry, something's come up at work.",
              'Could we move our coffee to Thursday instead? Same time?',
              'Or Friday morning if that works better.',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'tear-off-calendar',
            items: [
              'Dear Ms Tan,',
              "I'm afraid I need to reschedule our meeting on Tuesday 8 December.",
              'Would Wednesday 9 or Thursday 10 December at the same time suit you?',
              'I apologise for any inconvenience.',
              'Kind regards,',
              'Nguyen Thanh Son',
            ],
          },
        ],
      },

      { t: 'h', text: '2. Khung câu để viết lời mời và đổi lịch' },
      {
        t: 'patterns',
        rows: [
          {
            formula: "I'm having / We're having + sự kiện + on + ngày",
            vi: 'Mở đầu lời mời thân mật bằng hiện tại tiếp diễn (kế hoạch đã chốt).',
            examples: [
              { en: "I'm having a little farewell dinner on Friday.", vi: 'Thứ Sáu mình làm một bữa chia tay nho nhỏ.' },
              { en: "We're having a barbecue at my place on Saturday.", vi: 'Thứ Bảy bọn mình nướng thịt ở nhà mình.' },
              { en: "We're having drinks after work on Thursday. Come along!", vi: 'Thứ Năm tan làm bọn mình đi uống. Đi cùng nhé!' },
            ],
          },
          {
            formula: 'I would like to invite you to + sự kiện · Please RSVP by + ngày',
            vi: 'Lời mời trang trọng và hạn trả lời.',
            examples: [
              { en: 'I would like to invite you to a farewell dinner.', vi: 'Tôi xin trân trọng mời anh chị tới bữa tối chia tay.' },
              { en: 'Please RSVP by Wednesday 9 December.', vi: 'Vui lòng phản hồi trước thứ Tư ngày 9 tháng 12.' },
              { en: 'Please let me know of any dietary requirements.', vi: 'Xin cho tôi biết nếu anh chị có kiêng món gì.' },
            ],
          },
          {
            formula: 'Could we move + N + to + ngày (instead)? · Would + ngày giờ + suit you?',
            vi: 'Xin đổi lịch, đưa sẵn lựa chọn.',
            examples: [
              { en: 'Could we move our coffee to Thursday instead?', vi: 'Mình dời buổi cà phê sang thứ Năm được không?' },
              { en: 'Would Wednesday 9 December suit you?', vi: 'Thứ Tư ngày 9 tháng 12 có tiện cho chị không?' },
              { en: 'Would 10 am or 2 pm work better for you?', vi: '10 giờ sáng hay 2 giờ chiều thì tiện cho anh hơn?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Mời: việc + ngày + giờ + chỗ + hạn trả lời · Từ chối: cảm ơn + lý do + phương án khác · Đổi lịch: xin lỗi + 2 lựa chọn',
        vi: 'Mỗi tin chỉ làm một việc, và để người nhận trả lời được bằng một câu ngắn.',
      },
      {
        t: 'table',
        head: ['Chữ trên thiệp / email', 'Nghĩa', 'Bạn làm gì'],
        rows: [
          ['RSVP by Wed 9 Dec', 'Trả lời trước thứ Tư 9/12', 'Trả lời **dù đi hay không**.'],
          ['Regrets only', 'Chỉ cần báo nếu **không** đi', 'Đi thì khỏi trả lời.'],
          ['Dietary requirements', 'Yêu cầu ăn uống (chay, halal, dị ứng)', 'Ghi rõ: vegetarian, halal, no peanuts…'],
          ['Plus-one · + 1', 'Được dẫn thêm một người', 'Báo trước tên người đi cùng.'],
          ['Dress code: smart casual', 'Lịch sự thoải mái: sơ mi, quần âu / chinos, không cần vest', 'Tránh dép lê, quần short.'],
          ['BYO', 'Tự mang đồ uống (Úc, NZ, Singapore)', 'Mang đồ uống cho mình, chia được càng tốt.'],
          ['a prior commitment', 'đã có hẹn trước', 'Cách từ chối trang trọng, không cần kể chi tiết.'],
          ['I apologise for any inconvenience.', 'Xin lỗi vì sự bất tiện', 'Câu kết email đổi lịch (Mỹ viết apologize).'],
        ],
        caption: 'Ngày tháng trong lời mời: viết **tên thứ và tên tháng** (Friday 11 December), không viết 11/12. Người Mỹ sẽ đọc 11/12 là ngày 12 tháng 11 (Ngày 2).',
      },

      { t: 'h', text: '3. Tập viết' },
      {
        t: 'build',
        id: 'gtd10-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Thứ Sáu mình làm một bữa chia tay nho nhỏ.', chips: ["I'm", 'having', 'a', 'little', 'farewell', 'dinner', 'on', 'Friday.', 'will', 'at'], answer: ["I'm", 'having', 'a', 'little', 'farewell', 'dinner', 'on', 'Friday.'] },
          { vi: 'Vui lòng phản hồi trước thứ Tư.', chips: ['Please', 'RSVP', 'by', 'Wednesday.', 'until', 'on'], answer: ['Please', 'RSVP', 'by', 'Wednesday.'] },
          { vi: 'Rất tiếc, tối đó tôi đã có hẹn trước.', chips: ['Unfortunately,', 'I', 'have', 'a', 'prior', 'commitment', 'that', 'evening.', 'promise', 'in'], answer: ['Unfortunately,', 'I', 'have', 'a', 'prior', 'commitment', 'that', 'evening.'] },
          { vi: 'Thứ Tư ngày 9 có tiện cho chị không?', chips: ['Would', 'Wednesday', 'the', '9th', 'suit', 'you?', 'Will', 'fit'], answer: ['Would', 'Wednesday', 'the', '9th', 'suit', 'you?'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd10-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: 'by · instead · though · suit · make it · having',
        items: [
          { q: "We're ___ a barbecue on Saturday. You should come! (đang làm, đã chốt)", answers: ['having'] },
          { q: 'Please let me know ___ Wednesday. (muộn nhất là)', answers: ['by'] },
          { q: "I can't do Tuesday. Could we meet on Thursday ___?", answers: ['instead'] },
          { q: "Sorry, I can't come. Have a great time, ___!", answers: ['though'] },
          { q: 'Would Friday at 10 am ___ you? (tiện cho)', answers: ['suit'] },
          { q: "I'm afraid I can't ___ it on Friday. (đi được, sắp xếp được)", answers: ['make'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd10-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I'm having… · I'd love to, but… · Could we move… instead? · Please RSVP by…",
        items: [
          { q: '(Nhắn nhóm) Tối thứ Sáu mình làm tiệc nướng ở nhà mình. Mọi người tới nhé!', hint: "having, barbecue, at my place, come", answers: ["I'm having a barbecue at my place on Friday evening. Come along!", "I'm having a barbecue at my place on Friday night. Come along!", "I'm having a barbecue at my place on Friday evening. You should come!", "I'm having a barbecue at my place on Friday night. You should come!", "I'm having a barbecue at my place on Friday evening. Come!", "I'm having a barbecue at my place on Friday night. Come!", "I'm having a BBQ at my place on Friday night. Come along!", "I'm having a barbecue at my place on Friday evening. Hope you can come!"] },
          { q: 'Mình có cần mang gì không?', hint: 'can I bring', answers: ['Can I bring anything?', 'Should I bring anything?', 'Do I need to bring anything?', 'Can I bring something?'] },
          { q: 'Mình rất muốn, nhưng cuối tuần đó mình về Việt Nam.', hint: "I'd love to, going back / flying home", answers: ["I'd love to, but I'm going back to Vietnam that weekend.", "I'd love to, but I'm flying home to Vietnam that weekend.", "I'd love to, but I'm flying back to Vietnam that weekend.", "I'd love to, but I'm going home to Vietnam that weekend.", "I'd love to but I'm going back to Vietnam that weekend.", "I would love to, but I'm going back to Vietnam that weekend.", "I'd love to, but I'm going to Vietnam that weekend."] },
          { q: 'Xin lỗi, có việc đột xuất. Mình dời sang thứ Năm được không?', hint: "something's come up, move, Thursday", answers: ["Sorry, something's come up. Could we move it to Thursday?", "Sorry, something's come up. Can we move it to Thursday?", "Sorry, something has come up. Could we move it to Thursday?", "Sorry, something's come up. Could we make it Thursday instead?", "Sorry, something's come up. Could we move it to Thursday instead?", "Sorry, something's come up. Can we do Thursday instead?", "Sorry, something's come up. Could we make it Thursday?"] },
          { q: '(Email) Vui lòng phản hồi trước thứ Tư ngày 9 tháng 12.', hint: 'RSVP by', answers: ['Please RSVP by Wednesday 9 December.', 'Please RSVP by Wednesday, 9 December.', 'Please RSVP by Wednesday 9th December.', 'Please RSVP by Wednesday, December 9.', 'Please RSVP by Wednesday December 9th.', 'Please RSVP by Wednesday the 9th of December.'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi gửi lời mời',
        items: [
          '**Thứ có khớp với ngày không?** Mở lịch ra nhìn. Friday 11 December 2026 đúng là thứ Sáu.',
          '**Có hạn trả lời chưa?** Không có "RSVP by…", nửa số người sẽ không trả lời.',
          '**Có hỏi ăn kiêng chưa?** Ở Singapore, Malaysia, ở các team nhiều quốc tịch, đây là câu bắt buộc khi mời ăn.',
          '**Từ chối thì có lời chúc chưa?** Một câu "Have a great time, though!" làm tin nhắn ấm hẳn lên.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd10-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 10',
    goal: 'Làm 34 câu có đáp án để nhớ chắc cách mời, nhận lời, từ chối khéo, dời hẹn; phân biệt I\'ll, I\'m going to và I\'m + V-ing khi nói về kế hoạch.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền dạng động từ · dịch · nghe chép · ghép câu. Có câu ôn Ngày 4 và Ngày 9.',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**, với nét mặt đúng (vui khi nhận lời, tiếc khi từ chối).',
          'Phần dịch chấp nhận nhiều cách nói (I\'m = I am, I\'d = I would). Dấu câu, viết hoa không tính.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 11.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd10-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Đồng nghiệp rủ bạn đi ăn tối thứ Sáu, nhưng bạn đã có hẹn. Câu nào khéo nhất?',
            options: ["I'm busy.", "No, I can't.", "I'd love to, but I've already got plans on Friday. How about next week?", 'Maybe.'],
            correct: 2,
            why: 'Đủ ba phần: **thích → lý do → phương án khác**. "Maybe" khi biết chắc không đi làm người mời phải chờ vô ích.',
          },
          {
            q: 'Bạn đã đặt vé bay đi Đà Lạt thứ Bảy này. Câu nào tự nhiên nhất?',
            options: ['I will fly to Da Lat on Saturday.', "I'm flying to Da Lat on Saturday.", 'I fly to Da Lat on Saturday.', 'I flying to Da Lat on Saturday.'],
            correct: 1,
            why: 'Kế hoạch **đã chốt** (đã có vé) → **am/is/are + V-ing**.',
          },
          {
            q: 'Sếp hỏi: "Can you join the meeting at 3?" Bạn vừa quyết định nhận ngay. Bạn nói:',
            options: ["Sure, I'll be there.", "Sure, I'm being there.", 'Sure, I going to be there.', 'Sure, I be there.'],
            correct: 0,
            why: 'Quyết định **ngay lúc nói** → **I\'ll** (Ngày 9).',
          },
          {
            q: 'Chủ nhà nói "Come around seven-ish." Bạn nên tới:',
            options: ['6:45 để giúp', 'Đúng 7:00', 'Khoảng 7:10–7:30', '9:00'],
            correct: 2,
            why: '**-ish** = khoảng. Tiệc ở nhà: tới muộn một chút là lịch sự, tới sớm làm chủ nhà lúng túng.',
          },
          {
            q: 'Bạn muốn dời buổi cà phê với bạn sang thứ Năm. Câu nào đúng?',
            options: ['Can we delay our coffee to Thursday?', 'Could we move our coffee to Thursday instead?', 'Can we late our coffee to Thursday?', 'Could we postpone our coffee in Thursday?'],
            correct: 1,
            why: 'Chủ động dời → **move**, **reschedule**, **push back**. **delay** là bị trễ ngoài ý muốn. Giới từ đúng: move … **to** Thursday.',
          },
          {
            q: 'Một đồng nghiệp người Úc hỏi: "Are you keen?" Họ muốn biết:',
            options: ['Bạn có giỏi không', 'Bạn có muốn đi / có hứng không', 'Bạn có bận không', 'Bạn có chìa khoá không'],
            correct: 1,
            why: '**Are you keen?** (Úc, NZ) = bạn có muốn tham gia không. Đáp: "Yeah, keen!" hoặc "Sounds good!"',
          },
          {
            q: 'Bạn nhận lời đi tiệc ở nhà đồng nghiệp. Câu nào nên hỏi thêm?',
            options: ['How much is the party?', 'Can I bring anything?', 'Who will pay?', 'Why are you inviting me?'],
            correct: 1,
            why: 'Được mời tới nhà thì luôn hỏi **Can I bring anything?** Ba câu còn lại nghe kỳ hoặc bất lịch sự.',
          },
          {
            q: 'Thiệp mời ghi "RSVP by Friday". Bạn không đi được. Bạn nên:',
            options: ['Không trả lời, vì không đi thì không cần', 'Trả lời trước thứ Sáu là mình không đi được', 'Trả lời sau thứ Sáu', 'Tới hỏi trực tiếp vào hôm tiệc'],
            correct: 1,
            why: '**RSVP** = phải trả lời, **cả khi không đi**. Chỉ khi thiệp ghi "Regrets only" thì người đi mới khỏi trả lời.',
          },
          {
            q: '(Ôn Ngày 9) Đang nói chuyện thì tiếng bạn bè bị rè. Bạn nói:',
            options: ["Sorry, you're breaking up. I'll call you straight back.", 'Your voice is broken.', 'Speak louder!', 'I call you back.'],
            correct: 0,
            why: '**You\'re breaking up** = tiếng bị rè. **I\'ll call you straight back** = quyết định ngay, gọi lại liền.',
          },
          {
            q: '(Ôn Ngày 4) Bạn muốn rủ đồng nghiệp người Anh đi ăn trưa, kiểu thân mật. Câu nào hợp nhất?',
            options: ['I invite you to have lunch.', 'Do you fancy getting some lunch?', 'You must have lunch with me.', 'Lunch with me is required.'],
            correct: 1,
            why: '**Do you fancy + N / V-ing?** là cách rủ thân mật kiểu Anh, Úc. "I invite you…" nghe như thư mời chính thức và dễ bị hiểu là bạn trả tiền.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền dạng đúng của động từ' },
      {
        t: 'quiz',
        id: 'gtd10-bt-dien',
        title: "Phần II — Điền I'll / am / going / V-ing (7 câu)",
        kind: 'fill',
        grammar: "I'll + V (vừa quyết) · am / is / are + going to + V (đã định) · am / is / are + V-ing (đã chốt)",
        items: [
          { q: "I'm ___ the dentist at twelve tomorrow. (see, đã đặt lịch)", answers: ['seeing'] },
          { q: "We're ___ to be there till ten at least.", answers: ['going'] },
          { q: "Oh, you've got a call at eight? In that case, I___ come after. (vừa quyết, viết tắt)", answers: ["'ll", 'll', '’ll'] },
          { q: "A client ___ flying in from Jakarta tomorrow. (is / are / am)", answers: ['is', "'s"] },
          { q: 'Are you ___ anything on Saturday night? (do)', answers: ['doing'] },
          { q: "I'm going to ___ somewhere nice in Chinatown. (book)", answers: ['book'] },
          { q: "I'd love to, but I'm ___ late tonight. (work)", answers: ['working'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd10-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "Are you doing…? · I'd love to, but… · I'm going to… · instead · though",
        items: [
          { q: 'Cuối tuần này bạn có làm gì không?', hint: 'are you doing, this weekend', answers: ['Are you doing anything this weekend?', 'What are you doing this weekend?', 'Are you up to anything this weekend?', 'Have you got any plans this weekend?', 'Do you have any plans this weekend?', 'Do you have any plans for this weekend?', 'Have you got any plans for this weekend?'] },
          { q: 'Bạn muốn đi cùng không?', hint: 'come along', answers: ['Do you want to come along?', 'Would you like to come along?', 'Do you want to come?', 'Would you like to come?', 'Do you wanna come along?', 'Do you want to join us?', 'Would you like to join us?'] },
          { q: 'Cảm ơn đã mời mình. Mình nên tới lúc mấy giờ?', hint: 'inviting, what time should', answers: ['Thanks for inviting me. What time should I come?', 'Thank you for inviting me. What time should I come?', 'Thanks for the invite. What time should I come?', 'Thanks for inviting me. What time should I get there?', 'Thanks for inviting me. What time shall I come?'] },
          { q: 'Mai mình trả lời bạn được không?', hint: 'let you know, by tomorrow', answers: ['Can I let you know by tomorrow?', 'Could I let you know by tomorrow?', 'Can I let you know tomorrow?', 'Could I let you know tomorrow?', "Can I get back to you tomorrow?", 'Can I get back to you by tomorrow?'] },
          { q: 'Bạn rủ mình vậy là quý lắm, nhưng mình không đi được.', hint: "nice of you to ask, can't make it", answers: ["That's really nice of you to ask, but I can't make it.", "That's very nice of you to ask, but I can't make it.", "That's so nice of you to ask, but I can't make it.", "That's really nice of you to ask, but I can't come.", "It's really nice of you to ask, but I can't make it.", "That's nice of you to ask, but I can't make it.", "That is really nice of you to ask, but I can't make it."] },
          { q: 'Chắc mình phải dời bữa trưa của mình.', hint: 'going to have to, move', answers: ["I'm going to have to move our lunch.", 'I am going to have to move our lunch.', "I'm going to have to reschedule our lunch.", "I'm afraid I'm going to have to move our lunch.", "I'll have to move our lunch."] },
          { q: 'Mình không đi được. Dù sao cũng chúc mọi người vui nhé!', hint: "can't make it, have a great time, though", answers: ["I can't make it. Have a great time, though!", "I can't make it. Have fun, though!", "I can't make it. Have a great time though!", 'I cannot make it. Have a great time, though!', "I can't come. Have a great time, though!", "I can't make it, but have a great time!", "I can't make it. Have a good time, though!"] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd10-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Are you doing anything on Saturday night?', answer: 'Are you doing anything on Saturday night?' },
          { label: 'Câu 2', spell: "I'd love to, but I'm seeing the dentist at twelve.", answer: "I'd love to, but I'm seeing the dentist at twelve.", alt: ["I'd love to but I'm seeing the dentist at twelve.", "I'd love to, but I'm seeing the dentist at 12.", 'I would love to, but I am seeing the dentist at twelve.'] },
          { label: 'Câu 3', spell: 'Could we make it Wednesday instead?', answer: 'Could we make it Wednesday instead?' },
          { label: 'Câu 4', spell: "Something's come up. When would suit you?", answer: "Something's come up. When would suit you?", alt: ['Something has come up. When would suit you?', "Something's come up when would suit you"] },
          { label: 'Câu 5', spell: "Is it okay if I bring a friend? Of course! The more, the merrier.", answer: "Is it okay if I bring a friend? Of course! The more, the merrier.", alt: ['Is it OK if I bring a friend? Of course! The more, the merrier.', 'Is it okay if I bring a friend? Of course! The more the merrier.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd10-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Mình rất muốn, nhưng thứ Sáu mình bay đi Penang.', chips: ["I'd", 'love', 'to,', 'but', "I'm", 'flying', 'to', 'Penang', 'on', 'Friday.', 'will', 'fly'], answer: ["I'd", 'love', 'to,', 'but', "I'm", 'flying', 'to', 'Penang', 'on', 'Friday.'] },
          { vi: 'Sao bạn không tới sau cuộc gọi?', chips: ['Why', "don't", 'you', 'come', 'after', 'the', 'call?', 'not', 'coming'], answer: ['Why', "don't", 'you', 'come', 'after', 'the', 'call?'] },
          { vi: 'Lần sau mình tham gia được không?', chips: ['Could', 'I', 'join', 'the', 'next', 'one', 'instead?', 'with', 'other'], answer: ['Could', 'I', 'join', 'the', 'next', 'one', 'instead?'] },
          { vi: 'Vậy giờ nào khác tiện cho anh?', chips: ['When', 'would', 'suit', 'you', 'instead?', 'fit', 'will', 'what'], answer: ['When', 'would', 'suit', 'you', 'instead?'] },
          { vi: 'Mình định chuẩn bị vài câu hỏi cho anh.', chips: ["I'm", 'going', 'to', 'prepare', 'some', 'questions', 'for', 'you.', 'will', 'preparing'], answer: ["I'm", 'going', 'to', 'prepare', 'some', 'questions', 'for', 'you.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Mở lịch tuần tới của bạn. Nói to **5 câu** về kế hoạch thật: 3 câu **I\'m + V-ing** (việc đã hẹn), 2 câu **I\'m going to** (việc đã định).',
          'Nhắn một lời mời thật bằng tiếng Anh cho một người bạn (hoặc nhóm học), đủ **việc · ngày · giờ · chỗ · hạn trả lời**.',
          'Ngày 11: **kể một chuyện đã xảy ra** theo trình tự (first, then, after that, in the end) bằng quá khứ đơn.',
        ],
      },
    ],
  },
];
