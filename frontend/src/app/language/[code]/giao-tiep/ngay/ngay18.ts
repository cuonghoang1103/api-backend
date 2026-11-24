/**
 * Tiếng Anh giao tiếp — NGÀY 18 (chặng 3 "Công sở, không kỹ thuật", B1): nêu ý kiến, đồng ý, không đồng ý.
 * Khuôn: listening · speaking · writing (ngày chẵn) · homework · review (kiểm tra chặng 3, gom Ngày 13–18). Mọi id bắt đầu `gtd18-`.
 * Ngữ pháp trong câu: I think (that)… / I don't think… (không nói "I think… not") / I'm not sure (that / if / about)…
 * · nối câu bằng `however` (đầu câu mới) và `although` (trong một câu, không đi cùng `but`).
 * Cảnh: Kiên — sinh viên IT năm 3, tháng thứ ba thực tập ở Bluefin Software (Hà Nội): chọn quán cho bữa trưa chào đón
 * người mới (đồ nướng Hàn, pizza hay bún chả), cuộc tranh luận "tuần làm 4 ngày" lúc ăn trưa (đồng nghiệp Úc trêu thẳng
 * "that's rubbish"), và chốt mức tiền Secret Santa ở pantry — Kiên lần đầu dám nói "không" với người lớn hơn.
 * Ranh giới: góp ý code, phản biện giải pháp kỹ thuật, không đồng ý với khách trong họp ⇒ khoá Technical English at Work.
 * Khác podcast en-ds-c1-01 (nghĩa ngầm, nhận lời khen), en-b2-02 (thói quen xanh), en-c1-02 (đổi ý trong nghiên cứu): ở đây
 * là trao đổi ý kiến thường ngày ở công sở, ba mức không đồng ý, và cái bẫy "im lặng = đồng ý".
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_18: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd18-nghe',
    kind: 'listening',
    title: 'Nêu ý kiến, đồng ý, không đồng ý khi trò chuyện',
    goal: 'Nghe hiểu ba cuộc trao đổi ý kiến thường ngày ở công sở: ai đồng ý, ai không, không đồng ý mạnh hay nhẹ, và cuối cùng cả nhóm chốt gì.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Kiên**, sinh viên IT năm 3, tháng thứ ba thực tập ở **Bluefin Software**, Hà Nội. Team có **Courtney** (Mỹ), **Shane** (Úc), **Imogen** (Anh), **Bruno** (Brazil) và **Hana**, kỹ sư người Nhật vừa sang tuần này.',
          'Ba cảnh: **chọn quán cho bữa trưa chào đón Hana** · **cãi nhau vui về "tuần làm 4 ngày"** trong lúc ăn · **chốt mức tiền Secret Santa** ở pantry.',
          'Nghe xem mỗi người **đồng ý hay không**, và **mạnh hay nhẹ**: "I\'m not sure about that" khác "That\'s rubbish!" rất xa, và "That\'s an interesting idea" thường không phải lời khen.',
          'Cảnh 3 là bài học lớn của hôm nay: ở công ty nước ngoài, **im lặng thường bị hiểu là đồng ý**.',
          'Tốc độ khoảng **155 từ/phút**, nhiều người nói xen nhau như bữa trưa thật. Lần 1 chỉ bắt: **ai ủng hộ phương án nào**.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Thứ Tư, ở bàn làm việc: đi ăn đâu đón Hana?' },
      {
        t: 'canh',
        anh: ['man-technologist', 'woman-office-worker', 'fork-and-knife-with-plate', 'pizza', 'red-question-mark'],
        caption: 'Thứ Tư, 4 giờ chiều. **Courtney** muốn cả team đi ăn trưa thứ Sáu để chào đón **Hana**. Mỗi người một ý: **Shane** muốn đồ nướng Hàn, **Bruno** muốn pizza, **Imogen** chưa nói gì rõ. **Kiên** biết một quán bún chả gần công ty nhưng đang ngại lên tiếng.',
      },
      {
        t: 'listen',
        id: 'gtd18-nghe-canh1',
        title: 'Scene 1 — Where should we take Hana?',
        note: 'Nghe xem: Imogen phản đối đồ nướng Hàn vì sao, Imogen thật ra nghĩ gì về pizza, Kiên đưa ra ưu và nhược điểm nào của quán bún chả, và ai phải làm gì sau cuộc nói chuyện.',
        lines: [
          { who: 'Courtney', voice: 'us-nu', text: "Okay, team, Friday lunch for Hana. Where should we go? I want something she can't get in Osaka.", vi: 'Rồi, cả nhà, bữa trưa thứ Sáu đón Hana. Mình đi đâu đây? Chị muốn món gì mà ở Osaka không có.' },
          { who: 'Shane', voice: 'au-nam', text: "I reckon Korean barbecue. Everyone loves it, and it's fun to cook at the table.", vi: 'Tôi thấy đồ nướng Hàn đi. Ai cũng thích, mà tự nướng ở bàn cũng vui.' },
          { who: 'Imogen', voice: 'uk-nu', text: "Hmm, I'm not sure that's a good idea. It takes ages, and we've only got an hour. Plus, we'll all smell of smoke all afternoon.", vi: 'Hừm, tôi không chắc đó là ý hay. Ăn lâu lắm, mà mình chỉ có một tiếng. Chưa kể cả buổi chiều người ai cũng ám mùi khói.' },
          { who: 'Shane', voice: 'au-nam', text: "Fair enough. I forgot about the smoke.", vi: 'Cũng phải. Tôi quên vụ khói.' },
          { who: 'Bruno', voice: 'ca-nam', text: "What about pizza? There's a new place on the corner.", vi: 'Thế pizza thì sao? Có một quán mới ở góc phố.' },
          { who: 'Imogen', voice: 'uk-nu', text: "Pizza? That's… an interesting idea.", vi: 'Pizza á? Đó là… một ý tưởng thú vị.' },
          { who: 'Bruno', voice: 'ca-nam', text: "You don't like it, do you?", vi: 'Chị không thích, đúng không?' },
          { who: 'Imogen', voice: 'uk-nu', text: "Honestly? I don't think Hana came all the way to Hanoi for pizza.", vi: 'Nói thật nhé? Tôi không nghĩ Hana sang tận Hà Nội để ăn pizza.' },
          { who: 'Courtney', voice: 'us-nu', text: "Good point. Kiên, you haven't said anything. What do you think?", vi: 'Ý hay đấy. Kiên, em chưa nói gì cả. Em thấy sao?' },
          { who: 'Kiên', voice: 'us-nam', text: "Um, I think bún chả is a good option. There's a really good place round the corner. It's close, and it's cheap. However, it's quite small, so we need to book.", vi: 'Ờm, em nghĩ bún chả là một lựa chọn hay. Có một quán rất ngon ngay góc phố. Gần, lại rẻ. Tuy nhiên quán hơi nhỏ, nên mình phải đặt trước.' },
          { who: 'Shane', voice: 'au-nam', text: "Bún chả? Yeah, I'm with Kiên. That's the one Obama ate, isn't it?", vi: 'Bún chả à? Ừ, tôi theo Kiên. Món ông Obama từng ăn đúng không?' },
          { who: 'Kiên', voice: 'us-nam', text: "Ha, yes, but that's a different restaurant. Ours is less famous, but I think the food is better.", vi: 'Ha, đúng ạ, nhưng là quán khác. Quán của mình ít nổi tiếng hơn, nhưng em nghĩ đồ ăn ngon hơn.' },
          { who: 'Bruno', voice: 'ca-nam', text: "Although I really wanted pizza, bún chả sounds great. Does Hana eat pork, though?", vi: 'Dù tôi rất muốn ăn pizza, bún chả nghe cũng hay. Nhưng Hana có ăn thịt lợn không nhỉ?' },
          { who: 'Kiên', voice: 'us-nam', text: "I'm not sure. I'll ask her this afternoon.", vi: 'Em không chắc. Chiều nay em sẽ hỏi chị ấy.' },
          { who: 'Courtney', voice: 'us-nu', text: "Perfect. So, bún chả, if Hana's okay with pork. Kiên, can you book a table for six?", vi: 'Tuyệt. Vậy chốt bún chả, nếu Hana ăn được thịt lợn. Kiên, em đặt bàn sáu người được không?' },
          { who: 'Kiên', voice: 'us-nam', text: "Sure. I'll call them now.", vi: 'Vâng ạ. Em gọi cho quán ngay.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd18-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Imogen phản đối đồ nướng Hàn vì những lý do nào?',
            options: ['Đắt quá và xa quá', 'Ăn lâu (chỉ có một tiếng) và ám mùi khói cả buổi chiều', 'Hana không ăn được cay', 'Quán đã kín chỗ'],
            correct: 1,
            why: '"**It takes ages**, and we\'ve only got an hour. Plus, we\'ll all **smell of smoke** all afternoon." Imogen mở đầu bằng "I\'m not sure that\'s a good idea": không đồng ý ở mức nhẹ, kèm lý do.',
          },
          {
            q: 'Imogen nói pizza là "an interesting idea". Thật ra cô ấy nghĩ gì?',
            options: ['Cô ấy rất thích pizza', 'Cô ấy không thích ý này, chỉ nói tránh cho lịch sự', 'Cô ấy chưa ăn pizza bao giờ', 'Cô ấy muốn nghe thêm'],
            correct: 1,
            why: 'Người Anh hay nói "That\'s **an interesting idea**" (giọng ngập ngừng) khi **không đồng ý**. Bruno hiểu ngay: "You don\'t like it, do you?" — và Imogen thừa nhận: "I don\'t think Hana came all the way to Hanoi for pizza."',
          },
          {
            q: 'Kiên nêu ưu điểm và nhược điểm nào của quán bún chả?',
            options: ['Ngon nhưng đắt', 'Gần và rẻ, nhưng nhỏ nên phải đặt trước', 'Nổi tiếng nhưng đông', 'Rộng nhưng xa'],
            correct: 1,
            why: '"It\'s close, and it\'s cheap. **However**, it\'s quite small, so we need to book." Một câu nêu ưu điểm, **However** mở câu nêu nhược điểm.',
          },
          {
            q: 'Sau cuộc nói chuyện, Kiên phải làm gì?',
            options: ['Chỉ đặt bàn', 'Hỏi Hana có ăn thịt lợn không, và đặt bàn sáu người', 'Đặt pizza mang về', 'Gửi thực đơn cho cả nhóm'],
            correct: 1,
            why: '"I\'m not sure. **I\'ll ask her** this afternoon." và Courtney: "Kiên, can you **book a table for six**?" Lựa chọn bún chả chốt **có điều kiện**: "if Hana\'s okay with pork".',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Thứ Sáu, ở quán bún chả: tuần làm 4 ngày?' },
      {
        t: 'canh',
        anh: ['steaming-bowl', 'spiral-calendar', 'man-office-worker', 'face-with-raised-eyebrow', 'balance-scale'],
        caption: 'Thứ Sáu, quán bún chả. Hana ăn được thịt lợn và rất thích món này. Đang ăn thì **Shane** đọc một bài báo trên điện thoại: vài công ty ở nước ngoài đang thử cho nhân viên **làm 4 ngày một tuần**. Cả bàn bắt đầu tranh luận.',
      },
      {
        t: 'listen',
        id: 'gtd18-nghe-canh2',
        title: 'Scene 2 — A four-day week?',
        note: 'Nghe xem: ai ủng hộ, ai phản đối tuần làm 4 ngày và vì sao; Shane nói câu nào nghe rất nặng mà không ai giận; Kiên đồng ý với ai ở điểm nào.',
        lines: [
          { who: 'Shane', voice: 'au-nam', text: "Listen to this. Some companies are trying a four-day week. Same pay, one extra day off. I think it's brilliant.", vi: 'Nghe này. Vài công ty đang thử làm bốn ngày một tuần. Lương giữ nguyên, nghỉ thêm một ngày. Tôi thấy tuyệt vời.' },
          { who: 'Courtney', voice: 'us-nu', text: 'Honestly, I love the idea. Three-day weekends every week? Yes, please.', vi: 'Nói thật, chị mê ý này. Tuần nào cũng nghỉ ba ngày? Có chứ.' },
          { who: 'Bruno', voice: 'ca-nam', text: "I don't think it works for every job, though. What about hospitals? Or restaurants like this one?", vi: 'Nhưng tôi không nghĩ nó hợp với mọi nghề. Bệnh viện thì sao? Hay quán ăn như quán này?' },
          { who: 'Shane', voice: 'au-nam', text: "Nah, that's rubbish, mate! They can just hire more people.", vi: 'Thôi đi, nói vớ vẩn, ông bạn! Họ thuê thêm người là xong.' },
          { who: 'Bruno', voice: 'ca-nam', text: "Ha! Easy for you to say. Who pays for the extra people?", vi: 'Ha! Ông nói thì dễ. Ai trả lương cho chỗ người thêm đó?' },
          { who: 'Imogen', voice: 'uk-nu', text: "I partly agree with Bruno. Although it sounds great, some companies just make the other four days longer. Ten hours a day isn't much fun.", vi: 'Tôi đồng ý một phần với Bruno. Dù nghe thì hay, có công ty chỉ kéo dài bốn ngày còn lại. Mười tiếng một ngày thì chẳng vui gì.' },
          { who: 'Shane', voice: 'au-nam', text: "Okay, that's true. I didn't think of that.", vi: 'Ừ, đúng thật. Tôi không nghĩ tới chuyện đó.' },
          { who: 'Courtney', voice: 'us-nu', text: 'What about Vietnam, Kiên? Do you think it could work here?', vi: 'Còn ở Việt Nam thì sao, Kiên? Em nghĩ ở đây làm được không?' },
          { who: 'Kiên', voice: 'us-nam', text: "I see what you mean, Shane, but I'm not sure that it's realistic here yet. A lot of people still work on Saturday mornings.", vi: 'Em hiểu ý anh Shane, nhưng em không chắc là ở đây làm được ngay. Nhiều người vẫn còn đi làm sáng thứ Bảy.' },
          { who: 'Hana', voice: 'ie-nu', text: 'In Japan, some companies are trying it too. However, many people feel bad if they leave before the boss.', vi: 'Ở Nhật cũng có công ty đang thử. Tuy vậy, nhiều người thấy áy náy nếu về trước sếp.' },
          { who: 'Kiên', voice: 'us-nam', text: "Exactly. I think it depends on the company, and on the boss.", vi: 'Đúng thế ạ. Em nghĩ còn tuỳ công ty, và tuỳ sếp.' },
          { who: 'Bruno', voice: 'ca-nam', text: "I'm with Kiên. It depends.", vi: 'Tôi theo Kiên. Còn tuỳ.' },
          { who: 'Shane', voice: 'au-nam', text: "Fine, fine. Let's agree to disagree. But I'm still voting for Fridays off!", vi: 'Thôi được, thôi được. Mỗi người một ý vậy. Nhưng tôi vẫn bỏ phiếu cho nghỉ thứ Sáu!' },
          { who: 'Courtney', voice: 'us-nu', text: "No offence, Bruno, but Shane's right about one thing: this bún chả is amazing.", vi: 'Bruno đừng giận nhé, nhưng Shane đúng một chuyện: bún chả này ngon tuyệt.' },
          { who: 'Bruno', voice: 'ca-nam', text: "None taken. And I agree. Totally.", vi: 'Không giận đâu. Và tôi đồng ý. Hoàn toàn đồng ý.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd18-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Bruno phản đối tuần làm 4 ngày vì sao?',
            options: ['Vì anh thích đi làm', 'Vì nó không hợp với mọi nghề, như bệnh viện, quán ăn', 'Vì lương sẽ bị giảm', 'Vì sếp anh không cho'],
            correct: 1,
            why: '"**I don\'t think** it works for every job, though. What about hospitals?" Chú ý: nói **I don\'t think it works**, không nói "I think it doesn\'t work".',
          },
          {
            q: 'Shane nói "Nah, that\'s rubbish, mate!". Vì sao không ai giận?',
            options: ['Vì không ai nghe thấy', 'Vì giữa bạn bè thân ở Úc, câu này là kiểu trêu nhau, nói kèm tiếng cười', 'Vì Bruno không hiểu tiếng Anh', 'Vì Shane là sếp'],
            correct: 1,
            why: 'Người Úc và người Anh hay **tranh luận kiểu trêu chọc** (banter) với người đã thân. Bruno đáp lại bằng một câu trêu ("Easy for you to say"). Bạn là thực tập sinh thì **đừng bắt chước** câu này với đồng nghiệp chưa thân.',
          },
          {
            q: 'Imogen nói "I partly agree with Bruno". Ý cô ấy là gì?',
            options: ['Cô ấy đồng ý hoàn toàn', 'Cô ấy đồng ý một phần: nghe hay, nhưng có công ty kéo dài bốn ngày còn lại', 'Cô ấy không đồng ý chút nào', 'Cô ấy không có ý kiến'],
            correct: 1,
            why: '"**Although** it sounds great, some companies just make the other four days longer." Although + mặt tốt, rồi mặt chưa tốt — trong cùng một câu.',
          },
          {
            q: 'Cuối cùng cả bàn kết thúc cuộc tranh luận thế nào?',
            options: ['Shane chịu thua và đổi ý hoàn toàn', '"Let\'s agree to disagree": mỗi người giữ ý mình, rồi chuyển sang chuyện khác', 'Courtney quyết định thay mọi người', 'Bruno bỏ về'],
            correct: 1,
            why: '**Let\'s agree to disagree** = mình chấp nhận mỗi người một ý, không tranh nữa. Sau đó Courtney chuyển chuyện bằng một câu đùa về món bún chả.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Thứ Hai, ở pantry: Secret Santa bao nhiêu tiền?' },
      {
        t: 'canh',
        anh: ['wrapped-gift', 'hot-beverage', 'dollar-banknote', 'woman-office-worker', 'man-student'],
        caption: 'Thứ Hai, pantry. Team tổ chức **Secret Santa** cuối năm: mỗi người bốc thăm một tên và mua quà bí mật cho người đó. **Courtney** đề xuất mức **500.000 đồng**. Kiên đang thực tập, lương thấp, thấy mức này cao quá. Lần này Kiên quyết định nói ra.',
      },
      {
        t: 'listen',
        id: 'gtd18-nghe-canh3',
        title: 'Scene 3 — The Secret Santa budget',
        note: 'Nghe xem: Kiên không đồng ý ở điểm nào, ai đổi ý, cả nhóm chốt mức bao nhiêu, và Courtney nói gì với Kiên sau đó.',
        lines: [
          { who: 'Courtney', voice: 'us-nu', text: "So, for Secret Santa, I was thinking five hundred thousand dong each. Everyone okay with that?", vi: 'Vậy, Secret Santa thì chị đang nghĩ mỗi người năm trăm nghìn. Mọi người thấy ổn không?' },
          { who: 'Shane', voice: 'au-nam', text: 'Sounds good to me.', vi: 'Tôi thấy được.' },
          { who: 'Kiên', voice: 'us-nam', text: "Sorry, can I say something? I'm not sure that five hundred is fair for the interns. It's more than a week of lunches for us.", vi: 'Xin lỗi, em nói một chút được không ạ? Em không chắc năm trăm là công bằng với thực tập sinh. Với bọn em, số đó hơn tiền ăn trưa cả tuần.' },
          { who: 'Shane', voice: 'au-nam', text: "Really? I don't think it's that much.", vi: 'Thật á? Tôi không nghĩ là nhiều đến thế.' },
          { who: 'Kiên', voice: 'us-nam', text: "Although it isn't much for full-time staff, it's a lot for us. However, I agree that one hundred is too low for a nice gift.", vi: 'Dù với nhân viên chính thức thì không nhiều, với bọn em thì nhiều ạ. Tuy vậy, em cũng đồng ý một trăm thì quá ít để mua quà cho tử tế.' },
          { who: 'Imogen', voice: 'uk-nu', text: "Good point, Kiên. I didn't think about the interns.", vi: 'Ý hay đấy Kiên. Tôi không nghĩ tới các bạn thực tập.' },
          { who: 'Shane', voice: 'au-nam', text: "Yeah, fair enough. You've changed my mind.", vi: 'Ừ, cũng phải. Cậu làm tôi đổi ý rồi.' },
          { who: 'Hana', voice: 'ie-nu', text: 'Maybe three hundred thousand? Then everyone can join.', vi: 'Hay là ba trăm nghìn? Như vậy ai cũng tham gia được.' },
          { who: 'Bruno', voice: 'ca-nam', text: "I'm with Hana. Three hundred is perfect.", vi: 'Tôi theo Hana. Ba trăm là chuẩn.' },
          { who: 'Courtney', voice: 'us-nu', text: "Great, three hundred it is. Thanks for saying something, Kiên. I honestly didn't know.", vi: 'Tuyệt, chốt ba trăm. Cảm ơn em đã lên tiếng, Kiên. Thật lòng chị không biết chuyện đó.' },
          { who: 'Kiên', voice: 'us-nam', text: "Thanks for listening. In Vietnam, interns usually stay quiet with seniors.", vi: 'Em cảm ơn mọi người đã nghe. Ở Việt Nam, thực tập sinh thường im lặng với người đi trước.' },
          { who: 'Courtney', voice: 'us-nu', text: "I get that. But here, if you stay quiet, we think you agree. So please always tell us, okay?", vi: 'Chị hiểu. Nhưng ở đây, em im lặng thì bọn chị tưởng em đồng ý. Nên cứ nói với bọn chị nhé, được không?' },
          { who: 'Kiên', voice: 'us-nam', text: 'Okay. I will.', vi: 'Vâng ạ. Em sẽ nói.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd18-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Kiên mở lời thế nào trước khi không đồng ý với Courtney?',
            options: ['"You\'re wrong, Courtney."', '"Sorry, can I say something?" rồi "I\'m not sure that five hundred is fair…"', '"No, no, no."', 'Kiên im lặng rồi nhắn tin riêng'],
            correct: 1,
            why: 'Xin phép nói (**Sorry, can I say something?**) rồi không đồng ý ở mức nhẹ (**I\'m not sure that…**) kèm lý do cụ thể ("more than a week of lunches"). Đây là cách an toàn nhất khi nói với người lớn hơn.',
          },
          {
            q: 'Kiên đồng ý với điểm nào?',
            options: ['Năm trăm nghìn là hợp lý', 'Một trăm nghìn thì quá ít để mua quà tử tế', 'Không nên tổ chức Secret Santa', 'Thực tập sinh không cần tham gia'],
            correct: 1,
            why: '"**However**, I agree that one hundred is too low for a nice gift." Không đồng ý một ý, nhưng đồng ý một ý khác: người nghe thấy bạn công bằng, không chỉ phản đối.',
          },
          {
            q: 'Ai đổi ý sau khi nghe Kiên?',
            options: ['Không ai', 'Shane: "You\'ve changed my mind."', 'Hana', 'Bruno'],
            correct: 1,
            why: 'Shane lúc đầu nói "Sounds good to me", sau đó "**Fair enough. You\'ve changed my mind.**" Đổi ý một cách vui vẻ là chuyện bình thường, không ai thấy mất mặt.',
          },
          {
            q: 'Courtney nói "If you stay quiet, we think you agree." Bài học là gì?',
            options: ['Thực tập sinh không nên nói nhiều', 'Ở công ty nước ngoài, im lặng thường bị hiểu là đồng ý, nên không đồng ý thì phải nói ra (lịch sự)', 'Courtney giận Kiên', 'Chỉ sếp mới được nêu ý kiến'],
            correct: 1,
            why: 'Ở Việt Nam, im lặng với người lớn hơn là lễ phép. Ở nhiều công ty Anh – Mỹ – Úc, **im lặng = đồng ý**. Không nói ra thì sau này không ai biết bạn từng không đồng ý.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Các câu nêu ý kiến hay mở bằng cụm nói rất nhanh: "I don\'t think" nghe như "ai-đôn-thinh", "I\'m not sure" như "ăm-nót-sua", "I see what you mean" như "ai-xi-quốt-chu-min". Viết hoa và dấu câu không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd18-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — không đồng ý nhẹ', spell: "I'm not sure that's a good idea.", answer: "I'm not sure that's a good idea.", alt: ['I am not sure that is a good idea.', "I'm not sure that is a good idea."] },
          { label: 'Câu 2 — nêu ý kiến + however', spell: "It's close and cheap. However, it's quite small.", answer: "It's close and cheap. However, it's quite small.", alt: ["It's close and cheap however it's quite small", 'It is close and cheap. However, it is quite small.'] },
          { label: 'Câu 3 — phủ định với think', spell: "I don't think it works for every job.", answer: "I don't think it works for every job.", alt: ['I do not think it works for every job.'] },
          { label: 'Câu 4 — đồng ý một phần (tên: Bruno)', spell: 'I partly agree with Bruno.', answer: 'I partly agree with Bruno.' },
          { label: 'Câu 5 — ghi nhận rồi phản bác', spell: "I see what you mean, but I'm not sure that it's realistic.", answer: "I see what you mean, but I'm not sure that it's realistic.", alt: ["I see what you mean but I'm not sure that it's realistic", 'I see what you mean, but I am not sure that it is realistic.'] },
          { label: 'Câu 6 — kết thúc tranh luận', spell: "Let's agree to disagree.", answer: "Let's agree to disagree.", alt: ['Let us agree to disagree.'] },
          { label: 'Câu 7 — đổi ý', spell: "Fair enough. You've changed my mind.", answer: "Fair enough. You've changed my mind.", alt: ['Fair enough. You have changed my mind.', "Fair enough you've changed my mind"] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ["That's an interesting idea.", 'Thường là **không thích ý đó**, nhất là khi nói chậm, ngập ngừng (kiểu Anh).', 'You don\'t sound sure. What do you think?'],
          ["I'm not sure about that.", 'Không đồng ý, nói nhẹ. Không phải "tôi chưa biết".', 'Okay, why not?'],
          ['I hear what you\'re saying, but…', 'Tôi hiểu, nhưng tôi không đồng ý.', '(nghe tiếp lý do)'],
          ['With respect, …', '(Anh, trang trọng) Sắp không đồng ý **khá mạnh**.', '(nghe kỹ, đừng ngắt lời)'],
          ['Fair enough.', 'Được, tôi chấp nhận lý lẽ của bạn.', '(không cần đáp)'],
          ['You\'ve got a point.', 'Bạn đúng ở điểm đó (nhưng chưa chắc đúng hết).', 'Thanks.'],
          ["Let's agree to disagree.", 'Mỗi người một ý, thôi không tranh nữa.', 'Sure. Anyway, …'],
          ['Each to their own.', 'Mỗi người một sở thích (thường về đồ ăn, phim…).', 'Ha, true.'],
          ['Nah, that\'s rubbish! (cười)', 'Trêu thẳng giữa bạn thân (Úc, Anh). Không phải cãi nhau.', 'Ha! Easy for you to say.'],
          ['Sure, if you think so.', 'Tôi vẫn không bị thuyết phục, nhưng thôi.', 'Are you sure? I\'m happy to change it.'],
        ],
        caption: 'Hai câu đầu bảng là chỗ người Việt hiểu lầm nhiều nhất. Nghe "interesting idea" hay "not sure about that" thì hiểu là **"không"** đang tới, và hỏi lại người ta nghĩ gì.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp một cuộc tranh luận thì làm gì',
        items: [
          '**Bắt từ báo hiệu**, đừng cố nghe từng chữ. Nghe thấy **but, however, although, actually, to be honest, I\'m not sure** ⇒ sắp **không đồng ý**. Nghe thấy **exactly, absolutely, totally, I\'m with…, good point** ⇒ đang **đồng ý**.',
          '**Hỏi lại phe**: "Sorry, I lost you there. **Are you for or against** it?" (Xin lỗi, mình nghe sót. Bạn ủng hộ hay phản đối?) Ai cũng trả lời được bằng một chữ.',
          '**Nhắc lại ý bằng lời mình**: "So **you mean** it doesn\'t work for every job?" Sai thì người ta sửa, đúng thì bạn có thời gian nghĩ câu tiếp.',
          'Chưa kịp nghĩ ý mình: "**Hmm, let me think.**" hoặc "**Good question. I\'m not sure yet.**" Tốt hơn im lặng, vì im lặng sẽ bị hiểu là đồng ý.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Tôi nghĩ là…', 'I reckon… · I think…', 'I think… · I guess… · I figure…', 'I reckon…'],
          ['Đồng ý mạnh', 'Absolutely. · Quite right.', 'Totally! · For sure!', 'Too right! · Spot on.'],
          ['Không đồng ý nhẹ', "I'm not sure about that. · That's an interesting idea…", "I hear you, but… · I don't know about that.", "Yeah, nah. · I dunno about that."],
          ['"Ừ thì được"', 'Fair enough.', 'Fair enough. · I guess.', 'Fair enough. · No worries.'],
          ['"Quite good" nghĩa là', '**tạm được, hơi kém** (khen nhẹ)', 'khá tốt', 'khá tốt'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi nêu ý kiến. Hai bẫy: **"Yeah, nah"** của người Úc nghĩa là **không** (chữ cuối mới là câu trả lời; "Nah, yeah" lại là có). Và **"quite good"** của người Anh thường nghe nhẹ hơn hẳn người Mỹ: chỉ là tạm được.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-c1-01 · What They Say vs. What They Mean** — người London và người Brisbane nói về nghĩa ngầm: từ chối mà không nói "không". Rất hợp với bảng "Họ nói vậy nghĩa là gì?" ở trên (tập này khó, nghe lần 1 chỉ bắt ý chính).',
          '**en-b2-02 · Does My Water Bottle Matter?** — hai người trao đổi ý kiến về thói quen xanh: nghe cách họ đồng ý một phần và đưa lý do.',
          'Phản biện **giải pháp kỹ thuật**, góp ý code, không đồng ý với **khách hàng** trong cuộc họp: ở khoá **Technical English at Work**. Hôm nay chỉ là trò chuyện thường ngày với đồng nghiệp.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd18-noi',
    kind: 'speaking',
    title: 'Không đồng ý lịch sự — 3 mức',
    goal: 'Nêu ý kiến bằng I think / I don\'t think / I\'m not sure (that); đồng ý và không đồng ý ở 3 mức (nhẹ, vừa, rõ ràng); nối ý bằng however và although; và dám nói "không" mà vẫn giữ hoà khí.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu**: hỏi ý kiến, nêu ý kiến, đồng ý, đồng ý một phần, không đồng ý, đổi ý, kết thúc tranh luận.',
          '**3 mức không đồng ý**: nhẹ (gần như đồng ý) · vừa · rõ ràng. Chọn mức theo **người nghe** và **chuyện to hay nhỏ**.',
          'Ngữ pháp: **I think (that)… · I don\'t think… · I\'m not sure (that)…** và hai từ nối **however**, **although**.',
          'Ngôn ngữ cơ thể khi không đồng ý: mỉm cười, bàn tay mở, cách người Nhật nói "không" mà không nói chữ "không".',
          'Cuối bài nhập vai: bạn không đồng ý với một đồng nghiệp về hoạt động cuối năm, và hai bên phải chốt được một phương án.',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo một cuộc trao đổi: **hỏi ý kiến → nêu ý kiến → đồng ý → không đồng ý → đổi ý / chốt**. Bấm loa, nói to theo. Câu không đồng ý thì tập nói **kèm nụ cười**: giọng mềm quan trọng không kém chữ.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'What do you think?', pos: 'phr', ipa: '/ˌwʌt də ju ˈθɪŋk/', vi: 'Bạn thấy sao? / Bạn nghĩ sao?', ex: "Kiên, you haven't said anything. What do you think?", exVi: 'Kiên, em chưa nói gì. Em thấy sao?', more: 'Hỏi riêng về một chuyện: **What do you think about / of + N?**', anh: 'thinking-face' },
          { w: "What's your take on it?", pos: 'phr', ipa: '/ˌwʌts jər ˈteɪk ɑːn ɪt/', vi: 'Bạn nhìn chuyện này thế nào?', ex: "Hana, what's your take on the four-day week?", exVi: 'Hana, chị nhìn chuyện làm 4 ngày thế nào?', more: 'Thân mật, rất hay nghe ở Mỹ.' },
          { w: 'I think (that)…', pos: 'phr', ipa: '/aɪ ˈθɪŋk ðæt/', vi: 'Tôi nghĩ là…', ex: 'I think bún chả is a good option.', exVi: 'Tôi nghĩ bún chả là một lựa chọn hay.', more: '**that** thường bỏ khi nói.' },
          { w: "I don't think…", pos: 'phr', ipa: '/aɪ ˌdoʊnt ˈθɪŋk/', vi: 'Tôi không nghĩ là…', ex: "I don't think it works for every job.", exVi: 'Tôi không nghĩ nó hợp với mọi nghề.', more: 'Phủ định đặt ở **think**, vế sau giữ khẳng định.' },
          { w: 'I reckon…', pos: 'phr', ipa: '/aɪ ˈrekən/', vi: 'Tôi thấy là… (thân mật, Anh / Úc)', ex: 'I reckon Korean barbecue. Everyone loves it.', exVi: 'Tôi thấy đồ nướng Hàn đi. Ai cũng thích.' },
          { w: 'In my opinion, …', pos: 'phr', ipa: '/ɪn maɪ əˈpɪnjən/', vi: 'Theo ý tôi, …', ex: 'In my opinion, three hundred thousand is fair.', exVi: 'Theo ý tôi, ba trăm nghìn là công bằng.', more: 'Hơi trang trọng. Nói chuyện thường ngày dùng **I think** nhiều hơn hẳn.' },
          { w: "I'm not sure (that)…", pos: 'phr', ipa: '/aɪm ˌnɑːt ˈʃʊr ðæt/', vi: 'Tôi không chắc là… (không đồng ý nhẹ)', ex: "I'm not sure that's a good idea.", exVi: 'Tôi không chắc đó là ý hay.' },
          { w: 'It depends.', pos: 'phr', ipa: '/ɪt dɪˈpendz/', vi: 'Còn tuỳ.', ex: 'I think it depends on the company, and on the boss.', exVi: 'Tôi nghĩ còn tuỳ công ty, và tuỳ sếp.', more: '**depend on** + N, không phải "depend in".', anh: 'person-shrugging' },
          { w: 'I agree (with you).', pos: 'phr', ipa: '/aɪ əˈɡriː wɪð ju/', vi: 'Tôi đồng ý (với bạn).', ex: 'I agree with Imogen. It takes too long.', exVi: 'Tôi đồng ý với Imogen. Ăn lâu quá.', more: '**agree** là động từ: I agree, I don\'t agree. Không có "I\'m agree".' },
          { w: 'Absolutely. / Exactly.', pos: 'phr', ipa: '/ˌæbsəˈluːtli/ /ɪɡˈzæktli/', vi: 'Hoàn toàn đúng. / Chính xác.', ex: 'This bún chả is amazing. — Absolutely!', exVi: 'Bún chả này ngon tuyệt. — Chuẩn luôn!', anh: 'thumbs-up' },
          { w: "I'm with Kiên.", pos: 'phr', ipa: '/aɪm ˈwɪð kiːən/', vi: 'Tôi theo ý Kiên.', ex: "Bún chả? Yeah, I'm with Kiên.", exVi: 'Bún chả à? Ừ, tôi theo Kiên.', more: 'Cách đồng ý ngắn, thân mật, rất tự nhiên khi cả nhóm đang chọn.' },
          { w: 'Good point.', pos: 'phr', ipa: '/ˌɡʊd ˈpɔɪnt/', vi: 'Ý hay đấy. / Đúng đấy.', ex: "Good point. I didn't think about the interns.", exVi: 'Ý hay đấy. Tôi không nghĩ tới các bạn thực tập.' },
          { w: "That's true.", pos: 'phr', ipa: '/ðæts ˈtruː/', vi: 'Đúng thật.', ex: "Okay, that's true. I didn't think of that.", exVi: 'Ừ, đúng thật. Tôi không nghĩ tới chuyện đó.' },
          { w: 'Fair enough.', pos: 'phr', ipa: '/ˌfer ɪˈnʌf/', vi: 'Cũng phải. / Được thôi.', ex: 'Fair enough. I forgot about the smoke.', exVi: 'Cũng phải. Tôi quên vụ khói.' },
          { w: 'I see what you mean, but…', pos: 'phr', ipa: '/aɪ ˈsiː wʌtʃu ˈmiːn bət/', vi: 'Tôi hiểu ý bạn, nhưng…', ex: "I see what you mean, but I'm not sure it's realistic here.", exVi: 'Tôi hiểu ý bạn, nhưng tôi không chắc ở đây làm được.', more: 'Câu mở **mức 1**: ghi nhận ý người kia trước, rồi mới phản bác.' },
          { w: 'I partly agree.', pos: 'phr', ipa: '/aɪ ˈpɑːrtli əˈɡriː/', vi: 'Tôi đồng ý một phần.', ex: 'I partly agree with Bruno.', exVi: 'Tôi đồng ý một phần với Bruno.', more: 'Cũng nói: **I agree up to a point.**' },
          { w: "I'm not sure about that.", pos: 'phr', ipa: '/aɪm ˌnɑːt ˈʃʊr əˌbaʊt ˈðæt/', vi: 'Tôi không chắc lắm. (= tôi không đồng ý, nói nhẹ)', ex: "Five hundred each? Hmm, I'm not sure about that.", exVi: 'Mỗi người năm trăm à? Hừm, tôi không chắc lắm.', anh: 'face-with-raised-eyebrow' },
          { w: 'I see it a bit differently.', pos: 'phr', ipa: '/aɪ ˈsiː ɪt ə ˌbɪt ˈdɪfrəntli/', vi: 'Tôi nhìn chuyện này hơi khác.', ex: 'I see it a bit differently. I think it depends on the job.', exVi: 'Tôi nhìn chuyện này hơi khác. Tôi nghĩ còn tuỳ nghề.', more: 'Câu **mức 2** thay cho "You\'re wrong". Không ai thấy bị tấn công.' },
          { w: "I'm afraid I don't agree.", pos: 'phr', ipa: '/aɪm əˈfreɪd aɪ ˌdoʊnt əˈɡriː/', vi: 'Tôi e là tôi không đồng ý.', ex: "I'm afraid I don't agree. Not everyone works in an office.", exVi: 'Tôi e là tôi không đồng ý. Đâu phải ai cũng làm văn phòng.', more: 'Câu **mức 3**: rõ ràng mà vẫn lịch sự nhờ **I\'m afraid**.' },
          { w: 'Maybe, but…', pos: 'phr', ipa: '/ˈmeɪbi bət/', vi: 'Có thể, nhưng…', ex: "Maybe, but it's really small.", exVi: 'Có thể, nhưng quán nhỏ lắm.' },
          { w: 'to be honest', pos: 'phr', ipa: '/tə bi ˈɑːnɪst/', vi: 'nói thật thì', ex: "To be honest, I don't really like karaoke.", exVi: 'Nói thật thì tôi không thích karaoke lắm.', more: 'Thường báo hiệu một ý **trái** với người khác. Ngắn hơn: **Honestly?**' },
          { w: 'on the other hand', pos: 'phr', ipa: '/ɑːn ði ˈʌðər hænd/', vi: 'mặt khác', ex: "It's cheap. On the other hand, it's always crowded.", exVi: 'Quán rẻ. Mặt khác, lúc nào cũng đông.' },
          { w: "You've changed my mind.", pos: 'phr', ipa: '/juv ˌtʃeɪndʒd maɪ ˈmaɪnd/', vi: 'Bạn làm tôi đổi ý rồi.', ex: "Yeah, fair enough. You've changed my mind.", exVi: 'Ừ, cũng phải. Cậu làm tôi đổi ý rồi.' },
          { w: "Let's agree to disagree.", pos: 'phr', ipa: '/lets əˌɡriː tə ˌdɪsəˈɡriː/', vi: 'Mỗi người một ý, thôi không tranh nữa.', ex: "Fine, let's agree to disagree.", exVi: 'Thôi được, mỗi người một ý vậy.', anh: 'handshake' },
          { w: 'No offence, but…', pos: 'phr', ipa: '/ˌnoʊ əˈfens bət/', vi: 'Đừng giận nhé, nhưng…', ex: "No offence, Bruno, but Shane's right about one thing.", exVi: 'Bruno đừng giận nhé, nhưng Shane đúng một chuyện.', more: 'Đáp: **None taken.** (Không giận đâu.) Mỹ viết **offense**.' },
          { w: 'Can I say something?', pos: 'phr', ipa: '/kən aɪ ˈseɪ ˌsʌmθɪŋ/', vi: 'Tôi nói một chút được không?', ex: "Sorry, can I say something? I'm not sure that's fair.", exVi: 'Xin lỗi, em nói một chút được không? Em không chắc thế là công bằng.' },
          { w: 'fair', pos: 'adj', ipa: '/fer/', vi: 'công bằng, hợp lý', ex: "Three hundred is fair for everyone.", exVi: 'Ba trăm là công bằng với mọi người.', anh: 'balance-scale' },
          { w: 'meet in the middle', pos: 'phr', ipa: '/ˌmiːt ɪn ðə ˈmɪdl/', vi: 'mỗi bên nhường một chút', ex: "Five hundred is too much and one hundred is too little. Let's meet in the middle.", exVi: 'Năm trăm thì nhiều, một trăm thì ít. Mỗi bên nhường một chút đi.' },
        ],
      },

      { t: 'h', text: '2. Không đồng ý: 3 mức' },
      {
        t: 'p',
        text: 'Không đồng ý không có nghĩa là cãi nhau. Câu hỏi là **mạnh tới đâu**. Chuyện nhỏ (ăn gì, đi đâu) với người lớn hơn hoặc người mới quen: dùng **mức 1**. Chuyện bạn thấy quan trọng: **mức 2**. Chuyện ảnh hưởng thật tới bạn, đã nói nhẹ mà người ta chưa nghe: **mức 3**.',
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Ba mức không đồng ý',
        caption: 'Mức nào cũng nên có **lý do**. Không đồng ý mà không nói vì sao là chỉ phản đối, người nghe không biết sửa thế nào.',
        cols: [
          {
            title: 'Mức 1 — nhẹ (gần như đồng ý)',
            anh: 'slightly-smiling-face',
            items: [
              'I see what you mean, but…',
              "That's true, but…",
              'Maybe, but…',
              "I'm not sure about that.",
              'Dùng với: sếp, người mới quen, chuyện nhỏ',
            ],
          },
          {
            title: 'Mức 2 — vừa',
            anh: 'thinking-face',
            items: [
              'I see it a bit differently.',
              "I'm not sure that's the best idea.",
              "I don't think that's quite right.",
              'I partly agree, but…',
              'Dùng với: đồng nghiệp, chuyện bạn thấy quan trọng',
            ],
          },
          {
            title: 'Mức 3 — rõ ràng',
            anh: 'raised-hand',
            items: [
              "I'm afraid I don't agree.",
              "I really don't think that's fair.",
              "Sorry, but I can't agree with that.",
              'Bạn thân: No way! · Come on!',
              'Dùng khi: ảnh hưởng thật tới bạn, đã nói nhẹ rồi',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Không đồng ý lịch sự trong 3 bước',
        caption: 'Bước 1 là bước người Việt hay bỏ qua nhất. Ghi nhận ý người kia trước thì họ sẵn lòng nghe ý bạn.',
        steps: [
          { label: 'Ghi nhận ý người kia', sub: 'I see what you mean. · That\'s a fair point.' },
          { label: 'Nêu ý mình + lý do', sub: "But I'm not sure that's fair, because…" },
          { label: 'Đưa phương án / hỏi lại', sub: 'Maybe three hundred? What do you think?' },
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp lớn, khách)'],
        rows: [
          ['Hỏi ý kiến', 'What do you reckon?', 'What do you think?', "I'd be interested to hear your thoughts."],
          ['Nêu ý kiến', 'I reckon… · Honestly?', 'I think… · To be honest, …', 'In my opinion, … · From my point of view, …'],
          ['Đồng ý', 'Totally! · Too right!', 'I agree. · Good point.', 'I completely agree with you.'],
          ['Đồng ý một phần', 'Yeah, kind of.', 'I partly agree.', 'I agree up to a point.'],
          ['Không đồng ý', 'Nah. · No way!', "I'm not sure about that.", "I'm afraid I see it differently."],
          ['Đổi ý', 'Okay, you win!', "Fair enough. You've changed my mind.", "That's a good point. I hadn't considered that."],
        ],
        caption: 'Chưa biết chọn mức nào thì dùng cột **giữa**. Cột trang trọng có vài cấu trúc bạn sẽ học sau (Ngày 24, 27), giờ chỉ cần nghe hiểu.',
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Mọi câu nêu ý kiến đều có hai tầng: **khung ý kiến** (I think / I don\'t think / I\'m not sure) + **một câu bình thường** đặt phía sau. Còn khi muốn nói "ưu điểm… nhưng nhược điểm…", tiếng Anh có hai cách: **however** (hai câu) và **although** (một câu).',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'I think (that) + S + V',
            vi: 'Nêu ý kiến. "that" bỏ được.',
            examples: [
              { en: 'I think bún chả is a good option.', vi: 'Tôi nghĩ bún chả là một lựa chọn hay.' },
              { en: 'I think it depends on the company.', vi: 'Tôi nghĩ còn tuỳ công ty.' },
              { en: 'I think that three hundred is fair.', vi: 'Tôi nghĩ ba trăm là công bằng.' },
            ],
          },
          {
            formula: "I don't think + S + V (khẳng định)",
            vi: 'Phủ định đặt ở think. Vế sau **không** có not.',
            examples: [
              { en: "I don't think it works for every job.", vi: 'Tôi không nghĩ nó hợp với mọi nghề.' },
              { en: "I don't think five hundred is fair for the interns.", vi: 'Tôi không nghĩ năm trăm là công bằng với thực tập sinh.' },
              { en: "I don't think Hana came here for pizza.", vi: 'Tôi không nghĩ Hana sang đây để ăn pizza.' },
            ],
          },
          {
            formula: "I'm not sure (that) + S + V · I'm not sure about + N · I'm not sure if + S + V",
            vi: 'Không đồng ý nhẹ (that / about) hoặc chưa biết thật (if).',
            examples: [
              { en: "I'm not sure that's a good idea.", vi: 'Tôi không chắc đó là ý hay. (= không đồng ý)' },
              { en: "I'm not sure about the pizza place.", vi: 'Tôi không chắc về quán pizza. (= không thích lắm)' },
              { en: "I'm not sure if Hana eats pork.", vi: 'Tôi không biết Hana có ăn thịt lợn không. (= chưa biết thật)' },
            ],
          },
          {
            formula: 'S + V. However, S + V.',
            vi: 'However mở **câu mới**, có dấu phẩy sau nó. Hơi trang trọng, rất hợp khi viết.',
            examples: [
              { en: "It's close and cheap. However, it's quite small.", vi: 'Quán gần và rẻ. Tuy nhiên, hơi nhỏ.' },
              { en: 'Some companies are trying it. However, many people feel bad if they leave early.', vi: 'Vài công ty đang thử. Tuy vậy, nhiều người áy náy nếu về sớm.' },
              { en: "I agree it's a lot. However, one hundred is too low.", vi: 'Tôi đồng ý là nhiều. Tuy vậy, một trăm thì quá ít.' },
            ],
          },
          {
            formula: 'Although + S + V, S + V',
            vi: 'Although nằm **trong một câu**, vế còn lại **không** có but.',
            examples: [
              { en: "Although it's small, it has a room upstairs.", vi: 'Dù quán nhỏ, nó có một phòng trên lầu.' },
              { en: 'Although it sounds great, some people work longer days.', vi: 'Dù nghe hay, có người phải làm ngày dài hơn.' },
              { en: 'Although I wanted pizza, bún chả sounds great.', vi: 'Dù tôi muốn pizza, bún chả nghe cũng hay.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Từ', 'Vị trí', 'Dấu câu', 'Ví dụ'],
        rows: [
          ['but', 'Giữa hai vế, trong một câu', 'Phẩy trước but (tuỳ)', "It's cheap, but it's small."],
          ['however', 'Đầu câu thứ hai', 'Chấm trước, phẩy sau: **. However,**', "It's cheap. However, it's small."],
          ['although', 'Đầu vế thứ nhất (hoặc giữa câu)', 'Phẩy giữa hai vế', "Although it's cheap, it's small."],
        ],
        caption: 'Ba từ cùng nghĩa "nhưng / tuy". Khi **nói**, but phổ biến nhất. **However** và **although** làm câu nghe chín chắn hơn, nhất là khi không đồng ý.',
      },
      {
        t: 'rule',
        formula: "I think / I don't think / I'm not sure (that) + S + V · S + V. However, S + V. · Although + S + V, S + V",
        vi: 'Phủ định đặt ở think, không đặt ở vế sau. However mở câu mới; although nằm trong câu và không đi cùng but.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: however và although',
        items: [
          '**however** = tuy nhiên. Hai câu riêng: "It\'s close. **However**, it\'s small." Đừng nối bằng dấu phẩy ~~It\'s close, however it\'s small.~~',
          '**although** = mặc dù. Một câu: "**Although** it\'s close, it\'s small." Không thêm **but**: ~~Although it\'s close, but it\'s small.~~ (Tiếng Việt "tuy… nhưng…" có cả hai, tiếng Anh chỉ giữ một.)',
          'Khi nói nhanh với bạn bè, người ta hay đặt **though** ở cuối câu: "Does Hana eat pork, **though**?" (Nhưng mà Hana có ăn thịt lợn không?) Nghe hiểu là đủ.',
          'Mẹo nói: dùng **although** để đưa **mặt tốt** lên trước, rồi mới nói mặt chưa tốt. Người nghe thấy bạn công bằng: "Although I love the idea, I don\'t think it works here."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd18-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "I think / I don't think / I'm not sure (that) + S + V · However, … · Although …, …",
        items: [
          { q: 'Tôi không nghĩ đó là ý hay.', hint: "I don't think, good idea", answers: ["I don't think that's a good idea.", "I don't think it's a good idea.", 'I do not think that is a good idea.', 'I do not think it is a good idea.', "I don't think that is a good idea."] },
          { q: 'Tôi không chắc Hana có ăn cay không.', hint: "I'm not sure if, spicy food", answers: ["I'm not sure if Hana eats spicy food.", "I'm not sure whether Hana eats spicy food.", 'I am not sure if Hana eats spicy food.', "I'm not sure if Hana can eat spicy food.", "I'm not sure Hana eats spicy food."] },
          { q: 'Quán gần. Tuy nhiên, nó hơi nhỏ.', hint: "close, however, quite small", answers: ["It's close. However, it's quite small.", 'It is close. However, it is quite small.', "It's close. However, it's a bit small.", "The place is close. However, it's quite small.", "The restaurant is close. However, it's quite small.", "It's near. However, it's quite small."] },
          { q: 'Dù nghe hay, tôi không nghĩ nó hợp với mọi người.', hint: "although, sounds great, works for everyone", answers: ["Although it sounds great, I don't think it works for everyone.", 'Although it sounds great, I do not think it works for everyone.', "Although it sounds good, I don't think it works for everyone.", "Although it sounds great, I don't think it's right for everyone."] },
          { q: 'Tôi hiểu ý bạn, nhưng tôi nhìn chuyện này hơi khác.', hint: 'I see what you mean, a bit differently', answers: ['I see what you mean, but I see it a bit differently.', 'I see what you mean but I see it a bit differently.', 'I see what you mean, but I see it a little differently.', 'I see what you mean, but I see things a bit differently.'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi khi nêu ý kiến',
        items: [
          '~~I\'m agree with you.~~ / ~~I\'m not agree.~~ → **I agree with you.** / **I don\'t agree.** "agree" là **động từ**, không đi với be. Tiếng Việt "tôi đồng ý" không có "là", nhưng nhiều người học quen "I\'m + tính từ" nên thêm vào.',
          '~~I think it\'s not a good idea.~~ → **I don\'t think it\'s a good idea.** Câu đầu không sai hẳn nhưng nghe gắt và lạ tai. Người bản xứ chuyển phủ định lên **think**.',
          '~~Although it\'s cheap, but it\'s far.~~ → **Although it\'s cheap, it\'s far.** hoặc **It\'s cheap, but it\'s far.** Chọn một: although hoặc but.',
          '~~It\'s cheap, however it\'s far.~~ → **It\'s cheap. However, it\'s far.** however không nối hai vế bằng dấu phẩy như but.',
          '~~According to me, …~~ → **In my opinion, …** / **I think …** "According to" dùng cho người khác hoặc nguồn tin (according to the article), không dùng cho chính mình.',
          '~~In my opinion, I think…~~ → **In my opinion, …** hoặc **I think…** Chọn một. Nói cả hai là lặp ý.',
          '~~You\'re wrong.~~ → **I see it a bit differently.** / **I\'m not sure about that.** Nói thẳng "you\'re wrong" với đồng nghiệp chưa thân nghe như tấn công người, không phải phản bác ý.',
          '(im lặng, gật đầu cho qua) → **Sorry, can I say something?** Ở công ty nước ngoài, im lặng thường bị hiểu là **đồng ý**. Không nói ra lúc bàn thì sau đó đừng phàn nàn.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi đồng ý và không đồng ý' },
      {
        t: 'p',
        text: 'Cùng một câu "I\'m not sure about that", nói kèm **nụ cười và bàn tay mở** thì là góp ý; nói kèm **khoanh tay, nhíu mày** thì thành cãi nhau. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ đi cùng ý kiến',
        items: [
          { anh: 'head-shaking-vertically', w: 'Absolutely.', ro: '/ˌæbsəˈluːtli/', vi: 'Gật đầu = đồng ý ở Anh, Mỹ, Úc. Nhưng với người Nhật, gật đầu có thể chỉ là "tôi đang nghe".' },
          { anh: 'head-shaking-horizontally', w: "I'm not sure about that.", ro: '/aɪm ˌnɑːt ˈʃʊr əˌbaʊt ˈðæt/', vi: 'Lắc đầu nhẹ, chậm, kèm nụ cười = không đồng ý nhưng vẫn thân thiện. Lắc nhanh, mặt nghiêm = phản đối gay gắt.' },
          { anh: 'slightly-smiling-face', w: 'I see what you mean, but…', ro: '/aɪ ˈsiː wʌtʃu ˈmiːn bət/', vi: 'Mỉm cười khi bắt đầu phản bác. Người nghe hiểu bạn không đồng ý **ý**, chứ không phải không ưa **người**.' },
          { anh: 'palm-up-hand', w: 'I think it depends.', ro: '/aɪ ˈθɪŋk ɪt dɪˈpendz/', vi: 'Bàn tay mở, ngửa lên khi giải thích ý mình = cởi mở, không gây hấn. Tránh chỉ ngón tay vào người đối diện.' },
          { anh: 'face-with-raised-eyebrow', w: 'Really?', ro: '/ˈriːəli/', vi: 'Nhướn một bên mày = nghi ngờ. Người Anh, Mỹ đọc ra ngay, nên nếu bạn chỉ ngạc nhiên thì nói thêm "Really? Tell me more."' },
          { anh: 'thinking-face', w: 'Hmm, let me think.', ro: '/hm let mi ˈθɪŋk/', vi: 'Tay chạm cằm, mắt nhìn lên = đang cân nhắc. Tốt hơn hẳn im lặng: người ta biết bạn sắp nói.' },
          { anh: 'person-shrugging', w: 'It depends.', ro: '/ɪt dɪˈpendz/', vi: 'Nhún vai, hai tay mở = "còn tuỳ", "tôi không chắc". Dùng thoải mái giữa đồng nghiệp, tránh dùng với sếp khi được hỏi việc.' },
          { anh: 'grimacing-face', w: "That's a bit difficult…", ro: '/ðæts ə bɪt ˈdɪfɪkəlt/', vi: 'Đồng nghiệp Nhật hít nhẹ qua kẽ răng, nghiêng đầu, nói "That\'s a bit difficult" = **không** một cách lịch sự. Đừng hiểu là "khó nhưng làm được".' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Không đồng ý với người lớn hơn', 'Thường im lặng hoặc nói riêng sau.', 'Được mong đợi nói ra, lịch sự, ngay lúc đang bàn.', 'Rất ít nói thẳng. Hay nói gián tiếp hoặc nói riêng.'],
          ['Im lặng nghĩa là', 'Lễ phép, hoặc chưa tiện nói.', '**Đồng ý**, hoặc không quan tâm.', 'Đang suy nghĩ, chưa chắc đã đồng ý.'],
          ['Nói "không"', 'Hay vòng vo: "để em xem đã".', 'Nói khá rõ, kèm lý do: "I\'m not sure, because…"', 'Gần như không nói chữ "không": "That\'s a bit difficult…"'],
          ['Tranh luận vui khi ăn trưa', 'Ít, sợ mất lòng.', 'Rất phổ biến. Người Úc, Anh hay trêu thẳng với người đã thân.', 'Ít, nhất là với người mới quen.'],
          ['Đổi ý', 'Dễ bị coi là "thua".', 'Bình thường, thậm chí được khen: "Fair enough, you\'ve changed my mind."', 'Thường đổi ý sau, ít đổi ngay trước mặt mọi người.'],
        ],
        caption: 'Ở team nhiều nước, quy tắc an toàn: **nói ra ý mình ở mức 1**, có lý do, mỉm cười. Với đồng nghiệp Nhật, **hỏi riêng** sau buổi bàn: "What do you really think?" thường nhận được câu trả lời thật hơn.',
      },

      { t: 'h', text: '6. Phát âm: ngữ điệu khi nêu ý kiến' },
      {
        t: 'p',
        text: 'Nêu ý kiến thì nhấn vào **từ mang ý** (think, sure, agree), không nhấn vào I. Câu không đồng ý nhẹ nghe mềm là nhờ **giọng đi lên rồi lơ lửng** ở cuối ("I\'m not sure about that…"), không chốt xuống như ra lệnh. Hai âm đáng sửa: **/θ/** trong think (không rung) và **/ð/** trong although, that (có rung).',
      },
      {
        t: 'phatam',
        id: 'gtd18-phat-am',
        title: 'Luyện phát âm — 8 câu nêu ý kiến',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Đặt lưỡi giữa hai hàm răng cho /θ/ và /ð/, giữ rõ âm cuối /t/, /z/.',
        items: [
          { text: "I don't think so.", ipa: 'aɪ dəʊnt θɪŋk səʊ', vi: 'think /θ/ không rung, không đọc "tinh" · nhấn vào think' },
          { text: "I'm not sure about that.", ipa: 'aɪm nɒt ʃʊə əbaʊt ðæt', vi: 'sure /ʃ/ chu môi · that /ð/ có rung · giọng lơ lửng ở cuối' },
          { text: "Although it's small, it's cheap.", ipa: 'ɔːlðəʊ ɪts smɔːl ɪts tʃiːp', vi: 'although nhấn âm 2 /ðəʊ/ · nối: it\'s‿small · ngắt nhẹ ở dấu phẩy' },
          { text: "However, it's quite small.", ipa: 'haʊevə ɪts kwaɪt smɔːl', vi: 'however nhấn âm 2 /ev/ · ngắt sau however' },
          { text: 'I see what you mean.', ipa: 'aɪ siː wɒtʃuː miːn', vi: 'what you nối thành "quốt-chu" /tʃ/' },
          { text: 'I agree with you.', ipa: 'aɪ əɡriː wɪð juː', vi: 'agree nhấn âm 2 /ɡriː/ · with /ð/ nối sang you' },
          { text: "That's a fair point.", ipa: 'ðæts ə feə pɔɪnt', vi: 'nối: that\'s‿a · point giữ /nt/ cuối' },
          { text: 'It depends.', ipa: 'ɪt dɪpendz', vi: 'depends có cụm /ndz/ cuối: đừng nuốt /z/' },
        ],
      },

      { t: 'h', text: '7. Nhập vai: tiệc cuối năm làm gì?' },
      {
        t: 'dialogue',
        title: 'Kiên và Bruno chọn hoạt động cho tiệc cuối năm của team',
        lines: [
          { who: 'Bruno', role: 'b', text: 'So, for the year-end party, I think karaoke is the best option. Everyone can join.', vi: 'Vậy tiệc cuối năm, tôi nghĩ karaoke là lựa chọn hay nhất. Ai cũng tham gia được.' },
          { who: 'Kiên', role: 'a', text: "I see what you mean, but I'm not sure that everyone likes singing. Hana told me she's really shy.", vi: 'Em hiểu ý anh, nhưng em không chắc ai cũng thích hát. Chị Hana bảo em là chị ấy ngại lắm.' },
          { who: 'Bruno', role: 'b', text: "Hmm, fair point. What do you think we should do, then?", vi: 'Hừm, cũng đúng. Thế em nghĩ mình nên làm gì?' },
          { who: 'Kiên', role: 'a', text: "I think bowling is a good idea. It's fun, and you don't need to be good at it.", vi: 'Em nghĩ bowling là ý hay. Vui, mà không cần chơi giỏi.' },
          { who: 'Bruno', role: 'b', text: "Bowling? I don't think Shane will like that. He's terrible at it.", vi: 'Bowling á? Tôi không nghĩ Shane sẽ thích đâu. Cậu ấy chơi dở tệ.' },
          { who: 'Kiên', role: 'a', text: "Ha, that's true. However, he loves anything with a competition.", vi: 'Ha, đúng thật. Tuy vậy, anh ấy mê mọi thứ có thi đấu.' },
          { who: 'Bruno', role: 'b', text: "Okay, you've got a point. But although bowling's fun, it's quite expensive.", vi: 'Được, em có lý. Nhưng dù bowling vui, nó khá đắt.' },
          { who: 'Kiên', role: 'a', text: "Maybe we can meet in the middle? Bowling first, then karaoke for anyone who wants to sing.", vi: 'Hay mình mỗi bên nhường một chút? Bowling trước, rồi ai muốn hát thì đi karaoke.' },
          { who: 'Bruno', role: 'b', text: "I like that. Let's ask Courtney what she thinks.", vi: 'Tôi thích thế. Hỏi Courtney xem chị ấy nghĩ sao.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd18-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép lượt nói của Kiên (5 câu)',
        items: [
          { vi: 'Bruno: "I think karaoke is the best option." → Em hiểu ý anh, nhưng em không chắc lắm.', chips: ['I', 'see', 'what', 'you', 'mean,', 'but', "I'm", 'not', 'sure.', 'agree', 'think'], answer: ['I', 'see', 'what', 'you', 'mean,', 'but', "I'm", 'not', 'sure.'] },
          { vi: 'Em nghĩ bowling là ý hay.', chips: ['I', 'think', 'bowling', 'is', 'a', 'good', 'idea.', 'am', 'thinking'], answer: ['I', 'think', 'bowling', 'is', 'a', 'good', 'idea.'] },
          { vi: 'Em không nghĩ ai cũng thích hát.', chips: ['I', "don't", 'think', 'everyone', 'likes', 'singing.', 'not', 'like', "doesn't"], answer: ['I', "don't", 'think', 'everyone', 'likes', 'singing.'] },
          { vi: 'Đúng thật. Tuy vậy, anh ấy mê thi đấu.', chips: ["That's", 'true.', 'However,', 'he', 'loves', 'competitions.', 'but', 'although'], answer: ["That's", 'true.', 'However,', 'he', 'loves', 'competitions.'] },
          { vi: 'Dù bowling vui, nó khá đắt.', chips: ['Although', "bowling's", 'fun,', "it's", 'quite', 'expensive.', 'but', 'however'], answer: ['Although', "bowling's", 'fun,', "it's", 'quite', 'expensive.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd18-noi-tra-loi',
        part: '1',
        questions: [
          'Do you think working from home is better than working in an office? Why?',
          'Some people say students should have a part-time job. Do you agree?',
          'What do you think about a four-day working week?',
          "Your friend says, 'Phở is better than bún chả.' Do you agree? Disagree politely if you don't.",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây. Mục tiêu: không đồng ý **đủ ba mức**, và chốt được một phương án.',
          '"You are Bruno, a friendly Brazilian developer in Hanoi. We are choosing an activity for our team\'s year-end party. You strongly want karaoke. I will disagree with you. Disagree back with me at least twice, but accept a good reason when I give one (say \'Fair enough\' or \'You\'ve changed my mind\'). Use \'I think\', \'I don\'t think\', \'However\' and \'Although\' yourself. Speak at natural speed (B1). If I say \'I think … not …\' or \'I\'m agree\', continue the conversation but remember it. After 10 turns, we must agree on one plan. Then tell me in Vietnamese: which disagreement level I used each time (mild, medium, strong), and the grammar mistakes you noticed."',
          'Làm **2 lượt**. Lượt hai: AI là **Courtney**, trưởng nhóm người Mỹ, lớn tuổi hơn bạn. Chỉ được dùng **mức 1 và mức 2**.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — VIẾT ═══════════════════════════ */
  {
    id: 'gtd18-viet',
    kind: 'writing',
    title: 'Trả lời góp ý trong nhóm chat',
    goal: 'Viết được tin trả lời một đề xuất trong nhóm chat và trong email nội bộ: đồng ý và thêm ý, đồng ý một phần, không đồng ý lịch sự kèm phương án khác, và nhận góp ý / đổi ý — ở cả mức thân mật và trang trọng.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Vì sao trả lời góp ý bằng chữ khó hơn nói',
        items: [
          'Khi nói, nụ cười và giọng mềm làm câu không đồng ý dễ nghe. **Khi viết, chỉ còn chữ**: một câu "No, that\'s too expensive." đọc lên rất gắt.',
          'Tin trả lời tốt có 3 phần, giống 3 bước ở bài Nói: **ghi nhận → ý mình + lý do → phương án / câu hỏi**.',
          'Bốn loại tin hôm nay: **đồng ý + thêm ý · đồng ý một phần · không đồng ý lịch sự · nhận góp ý, đổi ý**.',
          'Mỗi loại có hai bản: **nhóm chat team** (thân mật) và **email trả lời quản lý / phòng nhân sự** (trang trọng).',
          'Dùng lại: However / Although (Ngày 18), Could you…? / Would you mind…? (Ngày 15), because / as (Ngày 16).',
        ],
      },

      { t: 'h', text: '1. Bối cảnh' },
      {
        t: 'canh',
        anh: ['speech-balloon', 'e-mail', 'party-popper', 'spiral-calendar', 'woman-office-worker'],
        caption: 'Tối thứ Ba, nhóm chat **#team-fun** của Bluefin sôi nổi: Courtney đề xuất tiệc cuối năm. Cùng lúc, chị **Lan** ở phòng nhân sự gửi email cho cả công ty đề xuất tổ chức tiệc vào **sáng thứ Bảy**. Kiên phải trả lời cả hai.',
      },
      {
        t: 'examples',
        items: [
          { en: "Courtney (#team-fun): Year-end party idea: karaoke + hotpot on Fri 18 Dec, 300k each? Thoughts? 🎤🍲", vi: 'Ý tưởng tiệc cuối năm: karaoke + lẩu tối thứ Sáu 18/12, mỗi người 300 nghìn? Mọi người nghĩ sao?' },
          { en: 'Ms Lan (HR, email): We are planning to hold the company year-end event on Saturday 19 December, 9:00 am–12:00 pm. Please reply with any comments by Friday.', vi: 'Chúng tôi dự định tổ chức sự kiện cuối năm của công ty vào sáng thứ Bảy 19/12, 9:00–12:00. Vui lòng phản hồi trước thứ Sáu.' },
        ],
      },

      { t: 'h', text: '2. Bốn mẫu, mỗi mẫu hai mức' },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 1 — Đồng ý + thêm một ý',
        caption: 'Đồng ý suông ("ok") không giúp gì. Thêm một ý nhỏ là bạn đang tham gia thật.',
        cols: [
          {
            title: 'Thân mật (#team-fun)',
            anh: 'speech-balloon',
            items: [
              'Love it! +1 for karaoke 🙌',
              'Maybe we could invite the interns from the Đà Nẵng office too?',
            ],
          },
          {
            title: 'Trang trọng (trả lời email)',
            anh: 'e-mail',
            items: [
              'Dear Ms Lan,',
              'Thank you for organising the year-end event. I think it is a great idea.',
              'I would also like to suggest a short game for new members, as many of us are new this year.',
              'Best regards,',
              'Nguyen Trung Kien',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 2 — Đồng ý một phần',
        caption: 'Đồng ý phần nào nói trước, phần chưa ổn nói sau, nối bằng **although** hoặc **however**.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'speech-balloon',
            items: [
              'Hotpot sounds great 🍲',
              "Although I'm not a big fan of karaoke, I'm happy to come and listen 😄",
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'memo',
            items: [
              'Dear Ms Lan,',
              'I agree that a year-end event is a good way to bring everyone together.',
              'However, I am not sure that 9:00 am is the best time, as some people live far from the office.',
              'Kind regards,',
              'Nguyen Trung Kien',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 3 — Không đồng ý lịch sự + phương án khác',
        caption: 'Ba phần: ghi nhận ("Thanks for…") → không đồng ý + lý do → **một** phương án cụ thể. Không đưa phương án là chỉ phản đối.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'thinking-face',
            items: [
              "Thanks for organising, Courtney! I'm not sure about 300k though 😅 It's a lot for us interns.",
              'Maybe 200k for food, and karaoke is pay-if-you-sing? 🎤',
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'e-mail',
            items: [
              'Dear Ms Lan,',
              'Thank you for planning the event.',
              'I am afraid that Saturday morning will be difficult for many interns, because we have classes at university.',
              'Would it be possible to hold it on Friday evening instead?',
              'Kind regards,',
              'Nguyen Trung Kien',
            ],
          },
        ],
      },
      {
        t: 'sodo',
        kind: 'compare',
        title: 'Mẫu 4 — Nhận góp ý, đổi ý',
        caption: 'Đổi ý bằng chữ thì phải **cảm ơn** và nói rõ **giờ chốt gì**, để không ai phải hỏi lại.',
        cols: [
          {
            title: 'Thân mật',
            anh: 'handshake',
            items: [
              'Fair point, Shane! You\'ve changed my mind 😄',
              "Let's go with 250k then. I'll update the poll.",
            ],
          },
          {
            title: 'Trang trọng',
            anh: 'check-mark-button',
            items: [
              'Dear Ms Lan,',
              'Thank you for your reply. I understand that Friday evening is not possible for the venue.',
              'In that case, I agree that Saturday afternoon is a good option.',
              'Best regards,',
              'Nguyen Trung Kien',
            ],
          },
        ],
      },

      { t: 'h', text: '3. Khung câu để trả lời góp ý' },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'Thanks for + V-ing / N. + ý của bạn',
            vi: 'Mở tin bằng lời ghi nhận. Thân: Thanks for… · Trang trọng: Thank you for…',
            examples: [
              { en: 'Thanks for organising, Courtney!', vi: 'Cảm ơn chị đã lo vụ này, Courtney!' },
              { en: 'Thank you for planning the event.', vi: 'Cảm ơn chị đã lên kế hoạch cho sự kiện.' },
              { en: 'Thanks for the idea, Bruno. I love it.', vi: 'Cảm ơn ý tưởng nhé Bruno. Tôi thích lắm.' },
            ],
          },
          {
            formula: "I'm not sure about + N · I'm not sure (that) + S + V, because / as + S + V",
            vi: 'Không đồng ý nhẹ + lý do. Trang trọng hơn: I am afraid (that)…',
            examples: [
              { en: "I'm not sure about Saturday, as a lot of us have classes.", vi: 'Mình không chắc về thứ Bảy, vì nhiều bạn có giờ học.' },
              { en: "I'm not sure that 300k is fair for the interns.", vi: 'Mình không chắc 300 nghìn là công bằng với thực tập sinh.' },
              { en: 'I am afraid that the morning will be difficult for some people.', vi: 'E là buổi sáng sẽ khó với một số người.' },
            ],
          },
          {
            formula: 'Maybe we could + V? · Would it be possible to + V?',
            vi: 'Đưa phương án khác. Thân: Maybe we could…? · Trang trọng: Would it be possible to…?',
            examples: [
              { en: 'Maybe we could do bowling instead?', vi: 'Hay mình đi bowling thay vào đó?' },
              { en: 'Maybe we could meet in the middle at 250k?', vi: 'Hay mình nhường nhau, chốt 250 nghìn?' },
              { en: 'Would it be possible to hold it on Friday evening instead?', vi: 'Có thể tổ chức vào tối thứ Sáu được không ạ?' },
            ],
          },
        ],
      },
      {
        t: 'rule',
        formula: 'Thanks for… → I\'m not sure (that) … because … → Maybe we could…?',
        vi: 'Một tin không đồng ý lịch sự chỉ cần ba dòng: ghi nhận, ý mình kèm lý do, một phương án cụ thể.',
      },
      {
        t: 'table',
        head: ['Viết thế này', 'Người đọc thấy', 'Viết lại'],
        rows: [
          ['No.', 'Cộc, như đang bực.', "Hmm, I'm not sure about that. Maybe…?"],
          ['K.', 'Rất lạnh lùng, như bị làm phiền.', 'Okay, sounds good! 👍'],
          ['THAT IS TOO EXPENSIVE', 'Chữ in hoa = **đang hét**.', "That's a bit expensive for me 😅"],
          ['lol no way', 'Thân với bạn thì được, với chị phòng nhân sự thì không.', 'Thanks, but I am not sure that will work for everyone.'],
          ['(không trả lời)', 'Đồng ý, hoặc không quan tâm.', 'Trả lời một dòng, kể cả chỉ là "+1".'],
          ['Trả lời cả nhóm chuyện chỉ liên quan một người', 'Làm phiền cả nhóm.', 'Nhắn riêng, hoặc trả lời trong luồng (thread).'],
        ],
        caption: 'Trong nhóm chat công ty, **một emoji nhẹ** (😅 🙂 👍) làm câu không đồng ý mềm đi rất nhiều. Trong email trang trọng thì **không** dùng emoji.',
      },

      { t: 'h', text: '4. Tập viết' },
      {
        t: 'build',
        id: 'gtd18-viet-ghep',
        title: 'Sắp xếp thành câu trong tin nhắn (4 câu)',
        items: [
          { vi: 'Cảm ơn chị đã lo vụ này, Courtney!', chips: ['Thanks', 'for', 'organising,', 'Courtney!', 'to', 'organise'], answer: ['Thanks', 'for', 'organising,', 'Courtney!'] },
          { vi: 'Mình không chắc về thứ Bảy, vì nhiều bạn có giờ học.', chips: ["I'm", 'not', 'sure', 'about', 'Saturday,', 'as', 'a', 'lot', 'of', 'us', 'have', 'classes.', 'agree', 'but'], answer: ["I'm", 'not', 'sure', 'about', 'Saturday,', 'as', 'a', 'lot', 'of', 'us', 'have', 'classes.'] },
          { vi: 'Hay mình đi bowling thay vào đó?', chips: ['Maybe', 'we', 'could', 'do', 'bowling', 'instead?', 'should', 'to'], answer: ['Maybe', 'we', 'could', 'do', 'bowling', 'instead?'] },
          { vi: 'Có thể tổ chức vào tối thứ Sáu được không ạ?', chips: ['Would', 'it', 'be', 'possible', 'to', 'hold', 'it', 'on', 'Friday', 'evening?', 'in', 'is'], answer: ['Would', 'it', 'be', 'possible', 'to', 'hold', 'it', 'on', 'Friday', 'evening?'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd18-viet-dien',
        title: 'Điền một từ vào tin nhắn (6 câu)',
        kind: 'fill',
        grammar: "Thanks for · I'm not sure about · However · Although · Maybe we could · Would it be possible",
        items: [
          { q: 'Thanks ___ the idea, Bruno!', answers: ['for'] },
          { q: "I'm not sure ___ karaoke. Not everyone likes singing.", answers: ['about'] },
          { q: "Hotpot sounds great. ___, 300k is a bit much for me. (tuy nhiên)", answers: ['However', 'however'] },
          { q: "___ I can't sing, I'm happy to come. (mặc dù)", answers: ['Although', 'although', 'Though', 'though'] },
          { q: 'Maybe we ___ meet in the middle at 250k?', answers: ['could', 'can'] },
          { q: 'Would it be ___ to move it to Friday evening?', answers: ['possible'] },
        ],
      },
      {
        t: 'quiz',
        id: 'gtd18-viet-dich',
        title: 'Tự viết 5 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "+1 / Love it · I'm not sure about… · However, … · Maybe we could…? · You've changed my mind",
        items: [
          { q: '(Nhóm chat) Ý hay đấy! +1. Hay mình mời cả team Đà Nẵng?', hint: 'great idea, maybe we could invite', answers: ['Great idea! +1. Maybe we could invite the Da Nang team too?', 'Great idea! +1. Maybe we could invite the Da Nang team?', 'Great idea! +1 Maybe we could invite the Da Nang team as well?', 'Good idea! +1. Maybe we could invite the Da Nang team too?', 'Great idea! +1. Maybe we could also invite the Da Nang team?'] },
          { q: '(Nhóm chat) Mình không chắc về 300 nghìn. Hơi nhiều với bọn thực tập.', hint: "not sure about, a bit much / a lot, interns", answers: ["I'm not sure about 300k. It's a bit much for us interns.", "I'm not sure about 300k. It's a lot for us interns.", "I'm not sure about 300k. It's a bit much for the interns.", "I'm not sure about 300,000. It's a bit much for us interns.", "I'm not sure about 300k. It's a bit too much for us interns.", 'I am not sure about 300k. It is a bit much for us interns.'] },
          { q: '(Nhóm chat) Cũng phải. Bạn làm mình đổi ý rồi.', hint: "fair enough / fair point, changed my mind", answers: ["Fair enough. You've changed my mind.", "Fair point. You've changed my mind.", 'Fair enough. You have changed my mind.', "Fair enough! You've changed my mind."] },
          { q: '(Email) Tôi đồng ý rằng đó là một ý hay. Tuy nhiên, buổi sáng có thể khó với một số người.', hint: 'I agree that, however, may be difficult', answers: ['I agree that it is a good idea. However, the morning may be difficult for some people.', "I agree that it's a good idea. However, the morning may be difficult for some people.", 'I agree that it is a good idea. However, the morning might be difficult for some people.', 'I agree that this is a good idea. However, the morning may be difficult for some people.', 'I agree that it is a good idea. However, the morning could be difficult for some people.'] },
          { q: '(Email) Có thể tổ chức vào tối thứ Sáu được không ạ?', hint: 'would it be possible to hold it', answers: ['Would it be possible to hold it on Friday evening?', 'Would it be possible to hold it on Friday evening instead?', 'Would it be possible to hold the event on Friday evening?', 'Would it be possible to have it on Friday evening?'] },
        ],
      },
      {
        t: 'note',
        title: 'Mẹo: 4 việc soát trước khi bấm gửi',
        items: [
          '**Đọc to tin của mình bằng giọng gắt nhất.** Nghe vẫn ổn thì gửi. Nghe như cãi nhau thì thêm "Thanks for…", "I\'m not sure…" hoặc một emoji nhẹ.',
          '**Có lý do chưa?** "I\'m not sure about Saturday" mà không có "as we have classes" thì người đọc không biết sửa gì.',
          '**Có phương án chưa?** Một câu "Maybe we could…?" biến lời phản đối thành lời góp ý.',
          '**Đúng mức chưa?** Nhóm chat team: thân mật, emoji được. Email phòng nhân sự: Dear…, câu đủ, không emoji, ký đủ họ tên.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd18-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 18',
    goal: 'Làm 34 câu có đáp án để nhớ chắc cách nêu ý kiến, đồng ý và không đồng ý đúng mức, dùng đúng I don\'t think / however / although, và ôn Ngày 13–17.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền từ · dịch · nghe chép · ghép câu.',
          'Có câu **ôn Ngày 13–17** xen giữa, ghi rõ (Ngày N). Đây cũng là bài khởi động cho **Kiểm tra chặng 3** ngay sau.',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**, lần hai kèm nụ cười.',
          'Đúng từ **27/34** trở lên thì làm Kiểm tra chặng 3.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd18-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Trưởng nhóm đề xuất đi ăn lẩu, bạn thấy hơi xa. Câu hợp nhất:',
            options: ["You're wrong. It's too far.", "I see what you mean, but I'm not sure about the distance. Maybe somewhere closer?", 'No.', 'Hotpot is bad.'],
            correct: 1,
            why: 'Với người lớn hơn, chuyện nhỏ: **mức 1** + lý do + phương án.',
          },
          {
            q: 'Đồng nghiệp nói: "This new coffee machine is great!" Bạn hoàn toàn đồng ý:',
            options: ["I'm agree.", 'Absolutely! The coffee is so much better.', 'I am agree with you.', 'Yes, I think so not.'],
            correct: 1,
            why: '**Absolutely!** + một câu thêm ý. "I\'m agree" sai ngữ pháp.',
          },
          {
            q: 'Câu nào nghe tự nhiên nhất?',
            options: ["I think it's not a good idea.", "I don't think it's a good idea.", "I think it isn't good idea.", 'I not think it is good.'],
            correct: 1,
            why: 'Phủ định đặt ở **think**: I don\'t think + câu khẳng định.',
          },
          {
            q: 'Một đồng nghiệp người Anh nói "Hmm, that\'s an interesting idea…" về đề xuất của bạn. Nhiều khả năng cô ấy:',
            options: ['Rất thích ý của bạn', 'Không thích lắm, đang nói tránh', 'Muốn bạn nói to hơn', 'Không hiểu bạn nói gì'],
            correct: 1,
            why: 'Nói chậm, ngập ngừng "interesting idea" thường là **không đồng ý** kiểu Anh. Hỏi lại: "You don\'t sound sure. What do you think?"',
          },
          {
            q: 'Câu nào đúng?',
            options: ["Although it's cheap, but it's far.", "Although it's cheap, it's far.", "It's cheap, however it's far.", "However it's cheap, it's far."],
            correct: 1,
            why: '**Although** không đi cùng **but**. **However** mở câu mới: "It\'s cheap. However, it\'s far."',
          },
          {
            q: 'Hai người tranh luận mãi không ai chịu ai. Câu kết thúc vui vẻ:',
            options: ["You're stupid.", "Let's agree to disagree. Anyway, coffee?", 'I win.', 'Stop talking.'],
            correct: 1,
            why: "**Let's agree to disagree** + chuyển chuyện. Giữ được hoà khí.",
          },
          {
            q: 'Bạn bị hỏi ý kiến nhưng chưa kịp nghĩ. Câu tốt nhất:',
            options: ['(im lặng)', "Hmm, let me think. I'm not sure yet.", "I don't know. Ask someone else.", 'Same as you.'],
            correct: 1,
            why: 'Im lặng dễ bị hiểu là đồng ý. **Hmm, let me think** cho bạn thời gian mà người nghe biết bạn sắp nói.',
          },
          {
            q: '(Ngày 17) Bạn muốn chia sẻ màn hình trong cuộc gọi nhóm:',
            options: ['Let me to share my screen.', 'Let me share my screen. Can everyone see it?', 'I share screen now.', 'Look at my screen please now.'],
            correct: 1,
            why: '**Let me + V** (không to) + câu kiểm tra **Can everyone see it?**',
          },
          {
            q: '(Ngày 16) Bạn xin về sớm vì phải đi khám răng:',
            options: ["Could I leave at four today? I've got a dentist appointment.", 'I go home at four.', 'Today I leave early, dentist.', 'I want to go home early because tooth.'],
            correct: 0,
            why: 'Xin phép bằng **Could I…?** + lý do rõ ràng.',
          },
          {
            q: '(Ngày 14) Đồng nghiệp mới hỏi lương của bạn. Bạn né khéo:',
            options: ["It's none of your business!", "Ha, let's just say it pays the bills. Anyway, how was your weekend?", 'Ten million.', 'Why do you ask that?'],
            correct: 1,
            why: 'Né bằng một câu đùa rồi **chuyển chủ đề**. Lương là chủ đề nên tránh (Ngày 14).',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd18-bt-dien',
        title: 'Phần II — Điền một từ (7 câu)',
        kind: 'fill',
        grammar: "think · don't · sure · However · Although · agree · depends",
        items: [
          { q: "I ___ that pho is better than bún chả. (nêu ý kiến)", answers: ['think'] },
          { q: "I ___ think it's fair for everyone. (phủ định, rút gọn)", answers: ["don't", 'don’t', 'do not'] },
          { q: "I'm not ___ that's the best time.", answers: ['sure'] },
          { q: "The café is quiet. ___, it's a bit expensive.", answers: ['However', 'however'] },
          { q: "___ it's a long walk, the view is worth it.", answers: ['Although', 'although', 'Though', 'though'] },
          { q: "I partly ___ with you.", answers: ['agree'] },
          { q: "Is it better to work from home? — It ___ on the job.", answers: ['depends'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd18-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: "I think / I don't think · I'm not sure about · I'm with… · Fair enough · However · Although",
        items: [
          { q: 'Bạn thấy sao?', hint: 'what, think', answers: ['What do you think?', "What's your take on it?", 'What do you reckon?'] },
          { q: 'Tôi theo ý Hana.', hint: "I'm with", answers: ["I'm with Hana.", 'I am with Hana.', 'I agree with Hana.'] },
          { q: 'Tôi đồng ý một phần.', hint: 'partly', answers: ['I partly agree.', 'I agree up to a point.', 'I partly agree with you.'] },
          { q: 'Tôi không nghĩ là nó đắt.', hint: "don't think, expensive", answers: ["I don't think it's expensive.", 'I do not think it is expensive.', "I don't think it is expensive."] },
          { q: 'Nói thật thì tôi không thích karaoke lắm.', hint: "to be honest, don't really like", answers: ["To be honest, I don't really like karaoke.", 'To be honest, I do not really like karaoke.', "Honestly, I don't really like karaoke.", "To be honest, I don't like karaoke much.", "To be honest, I don't like karaoke very much."] },
          { q: 'Cũng phải. Bạn làm tôi đổi ý rồi.', hint: "fair enough, changed my mind", answers: ["Fair enough. You've changed my mind.", 'Fair enough. You have changed my mind.', "Fair point. You've changed my mind."] },
          { q: 'Dù quán nhỏ, đồ ăn rất ngon.', hint: "although, small, the food", answers: ["Although it's small, the food is really good.", 'Although it is small, the food is really good.', "Although it's small, the food is very good.", "Although the restaurant is small, the food is really good.", "Although it's small, the food is great.", "Although the place is small, the food is really good.", "Although it's small, the food is delicious."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd18-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'What do you think, Kiên?', answer: 'What do you think, Kiên?', alt: ['What do you think Kien?', 'What do you think, Kien?', 'What do you think Kiên?'] },
          { label: 'Câu 2', spell: "I'm not sure about that.", answer: "I'm not sure about that.", alt: ['I am not sure about that.'] },
          { label: 'Câu 3', spell: 'I see it a bit differently.', answer: 'I see it a bit differently.' },
          { label: 'Câu 4', spell: "Although it sounds great, I don't think it works here.", answer: "Although it sounds great, I don't think it works here.", alt: ["Although it sounds great I don't think it works here", 'Although it sounds great, I do not think it works here.'] },
          { label: 'Câu 5', spell: "No offence, but I'm with Bruno.", answer: "No offence, but I'm with Bruno.", alt: ["No offense, but I'm with Bruno.", "No offence but I'm with Bruno", 'No offence, but I am with Bruno.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd18-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Tôi không nghĩ ai cũng đồng ý.', chips: ['I', "don't", 'think', 'everyone', 'agrees.', 'not', 'agree', 'is'], answer: ['I', "don't", 'think', 'everyone', 'agrees.'] },
          { vi: 'Tôi không chắc quán có mở cửa thứ Hai không.', chips: ["I'm", 'not', 'sure', 'if', "it's", 'open', 'on', 'Monday.', 'about', 'in'], answer: ["I'm", 'not', 'sure', 'if', "it's", 'open', 'on', 'Monday.'] },
          { vi: 'Ý hay đấy. Tôi không nghĩ tới chuyện đó.', chips: ['Good', 'point.', 'I', "didn't", 'think', 'of', 'that.', "don't", 'about'], answer: ['Good', 'point.', 'I', "didn't", 'think', 'of', 'that.'] },
          { vi: '(Ngày 15) Phiền bạn đóng cửa sổ giúp được không?', chips: ['Would', 'you', 'mind', 'closing', 'the', 'window?', 'close', 'to'], answer: ['Would', 'you', 'mind', 'closing', 'the', 'window?'] },
          { vi: '(Ngày 17) Nếu bạn không nghe thấy tôi, cứ gõ vào khung chat.', chips: ['If', 'you', "can't", 'hear', 'me,', 'just', 'type', 'in', 'the', 'chat.', 'will', 'listen'], answer: ['If', 'you', "can't", 'hear', 'me,', 'just', 'type', 'in', 'the', 'chat.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Chọn một chuyện bạn thật sự có ý kiến (học online hay học ở lớp, Hà Nội hay Sài Gòn, phở hay bún chả). Nói **1 phút**: I think… · However… · Although… · So I think it depends on…',
          'Ghi âm, nghe lại, đếm xem bạn có lỡ nói ~~I think … not~~ hay ~~I\'m agree~~ lần nào không.',
          'Tiếp theo: **Kiểm tra chặng 3** (Ngày 13–18). Đạt rồi mới sang Ngày 19, chặng 4 "Giao tiếp sâu".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG 3 ═══════════════════════════ */
  {
    id: 'gtd18-kiem-tra',
    kind: 'review',
    title: 'Kiểm tra chặng 3 (Ngày 13–18)',
    goal: 'Tự đo mức nắm chắc chặng 3 "Công sở" (Ngày 13–18): nghe một cuộc gọi video mới, chọn câu hợp cảnh công sở, dùng đúng ngữ pháp từng ngày và tự viết tin nhắn công việc thường ngày. Đạt ≥ 70 % từng phần mới sang chặng 4.',
    minutes: 45,
    blocks: [
      {
        t: 'recap',
        title: 'Bài kiểm tra này đo gì',
        items: [
          '**4 phần, 46 câu, khoảng 45 phút**: Nghe · Mẫu câu hợp cảnh · Ngữ pháp · Viết tin nhắn. Toàn bộ là kiến thức **Ngày 13–18**.',
          '**Đạt** = từ **70 %** trở lên ở **từng phần**. Trượt phần nào thì ôn đúng Ngày ghi ở bảng dưới, không cần học lại cả chặng.',
          'Mọi câu đều **mới**: người mới, cảnh mới, câu mới. Nhớ đáp án cũ không giúp được.',
          'Mỗi câu có ghi **(Ngày N)** để bạn biết câu sai thuộc ngày nào.',
          'Chặng 4 (Ngày 19–24) là **giao tiếp sâu**: networking, đón khách, phàn nàn, thương lượng. Bài nghe sẽ bỏ dần chú thích tiếng Việt ở câu dễ.',
        ],
      },
      {
        t: 'sodo',
        kind: 'mindmap',
        title: 'Chặng 3 (Ngày 13–18) — những gì sẽ bị kiểm',
        center: 'Ngày 13–18',
        branches: [
          { label: 'N13 Làm quen team', items: ['Which team are you on?', 'How long have you been…?', 'also · too · either'], anh: 'handshake' },
          { label: 'N14 Small talk', items: ["…, isn't it? · …, do you?", 'Have you ever + V3?', 'chủ đề nên tránh'], anh: 'hot-beverage' },
          { label: 'N15 Nhờ giúp', items: ['Do you know where…?', 'Could you…? · Would you mind + V-ing?'], anh: 'folded-hands' },
          { label: 'N16 Xin nghỉ', items: ['because · since · as', "won't be able to", 'báo ốm, báo trễ, về sớm'], anh: 'spiral-calendar' },
          { label: 'N17 Video call', items: ['If + hiện tại đơn, will / mệnh lệnh', 'Let me… · Let\'s…', "You're on mute · You cut out"], anh: 'laptop' },
          { label: 'N18 Ý kiến', items: ["I think · I don't think · I'm not sure", 'however · although', '3 mức không đồng ý'], anh: 'balance-scale' },
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
          ['1. Nghe', '8 + 4', '≥ 9/12 (cộng hai khối)', 'Ngày 17 · Nghe (cuộc gọi video) + mẹo "không nghe kịp trong cuộc gọi" — Ngày 13 · Nghe (làm quen) — Ngày 18 · Nghe (ai đồng ý, ai không)'],
          ['2. Mẫu câu hợp cảnh', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục "câu dùng được ngay" và bảng ba mức lịch sự'],
          ['3. Ngữ pháp', '12', '≥ 9/12', 'Câu sai ghi (Ngày N) → bài **Nói** của ngày đó, mục 🧱 Câu này ghép thế nào'],
          ['4. Viết tin nhắn', '6 + 4', '≥ 7/10 (cộng hai khối)', 'Ngày 13 · Đọc (email chào mừng) — Ngày 15 · Đọc (tin nhờ việc) — Ngày 16 · Viết (xin nghỉ, báo trễ) — Ngày 18 · Viết (trả lời góp ý)'],
        ],
      },

      /** ───────────── 1. Nghe ───────────── **/
      { t: 'h', text: 'Phần 1 — Nghe (12 câu · đạt ≥ 9 · trượt thì ôn Ngày 13, 17, 18)' },
      {
        t: 'canh',
        anh: ['laptop', 'man-technologist', 'woman-office-worker', 'muted-speaker', 'party-popper', 'balance-scale'],
        caption: 'Đầu tháng Mười Hai. **Agnes**, điều phối viên sự kiện mới ở văn phòng **Wellington** (New Zealand), gọi video cho **Kiên** lần đầu để chuẩn bị tiệc cuối năm. Cuộc gọi đi qua đủ chuyện: làm quen, chuyện phiếm, nhờ việc, xin vắng, sự cố mạng và một cuộc trao đổi ý kiến.',
      },
      {
        t: 'listen',
        id: 'gtd18-kt-nghe',
        title: 'Test — A first call with Agnes',
        note: 'Nghe tối đa 2 lần. Ghi ra giấy: Agnes ở team nào và vào công ty bao lâu, Agnes nhờ gì, Kiên không tham gia được việc gì và vì sao, Kiên không đồng ý ở điểm nào và đề xuất gì.',
        lines: [
          { who: 'Agnes', voice: 'nz-nu', text: "Hi, is this Kiên? I can see you, but I think you're on mute.", vi: 'Chào, Kiên phải không? Chị thấy hình em, nhưng hình như em đang tắt mic.' },
          { who: 'Kiên', voice: 'us-nam', text: 'Oh, sorry! Can you hear me now?', vi: 'Ôi, em xin lỗi! Giờ chị nghe thấy em chưa ạ?' },
          { who: 'Agnes', voice: 'nz-nu', text: "Perfect. I'm Agnes. I've just joined the Wellington office. Nice to finally put a face to the name!", vi: 'Hoàn hảo. Chị là Agnes. Chị vừa vào văn phòng Wellington. Vui vì cuối cùng cũng thấy mặt em!' },
          { who: 'Kiên', voice: 'us-nam', text: 'Nice to meet you too, Agnes. Which team are you on?', vi: 'Em cũng rất vui được gặp chị. Chị ở team nào ạ?' },
          { who: 'Agnes', voice: 'nz-nu', text: "The events team. And you're one of the interns, aren't you?", vi: 'Team sự kiện. Còn em là một trong các bạn thực tập, đúng không?' },
          { who: 'Kiên', voice: 'us-nam', text: "Yes, I am. I've been here for about three months. How long have you been at Bluefin?", vi: 'Vâng ạ. Em ở đây được khoảng ba tháng rồi. Chị vào Bluefin được bao lâu rồi ạ?' },
          { who: 'Agnes', voice: 'nz-nu', text: "Only two weeks! It's so windy here today. Wellington's always windy, isn't it? Have you ever been?", vi: 'Mới hai tuần thôi! Hôm nay ở đây gió kinh khủng. Wellington lúc nào cũng gió, nhỉ? Em đến đó bao giờ chưa?' },
          { who: 'Kiên', voice: 'us-nam', text: "No, never, but I'd love to. Hanoi's quite cold now, too.", vi: 'Chưa bao giờ ạ, nhưng em rất muốn đến. Hà Nội giờ cũng khá lạnh.' },
          { who: 'Agnes', voice: 'nz-nu', text: "Anyway, would you mind sending me the photos from last year's party? Do you know where they're saved?", vi: 'Mà này, em gửi giúp chị ảnh tiệc năm ngoái được không? Em có biết ảnh lưu ở đâu không?' },
          { who: 'Kiên', voice: 'us-nam', text: "Sure. I think they're in the shared folder. If I can't find them, I'll ask Courtney.", vi: 'Vâng ạ. Em nghĩ là ở thư mục chung. Nếu em không tìm thấy thì em sẽ hỏi chị Courtney.' },
          { who: 'Agnes', voice: 'nz-nu', text: 'Thanks! Also, can you join the planning call next Thursday morning?', vi: 'Cảm ơn em! À, sáng thứ Năm tới em vào cuộc gọi lên kế hoạch được không?' },
          { who: 'Kiên', voice: 'us-nam', text: "I'm afraid I won't be able to, because I have an exam that morning. Could I send you my ideas by email instead?", vi: 'Em e là em không vào được ạ, vì sáng hôm đó em thi. Em gửi ý tưởng cho chị qua email thay vào đó được không ạ?' },
          { who: 'Agnes', voice: 'nz-nu', text: "Of course. Actually, what do you think about the venue? We're thinking of a rooftop bar.", vi: 'Tất nhiên rồi. À, em thấy địa điểm thế nào? Bọn chị đang nghĩ tới một quán bar trên sân thượng.' },
          { who: 'Kiên', voice: 'us-nam', text: "Hmm, I'm not sure that's a good idea. Although the view is great, it can be really cold and windy in December.", vi: 'Hừm, em không chắc đó là ý hay. Dù cảnh đẹp, tháng Mười Hai trên đó có thể rất lạnh và gió.' },
          { who: 'Agnes', voice: 'nz-nu', text: 'Fair point. However, some people really want somewhere outdoors.', vi: 'Có lý. Tuy vậy, có người rất muốn chỗ ngoài trời.' },
          { who: 'Kiên', voice: 'us-nam', text: "Maybe a restaurant with a garden? Then it's outdoors, but we can go inside if it gets cold.", vi: 'Hay một nhà hàng có vườn ạ? Vừa ngoài trời, mà lạnh quá thì vào trong được.' },
          { who: 'Agnes', voice: 'nz-nu', text: "Oh, I like that. Let me add it to the list. Sorry, you froze for a second. Did you say a garden?", vi: 'Ồ, chị thích ý đó. Để chị thêm vào danh sách. Xin lỗi, hình em bị đứng một giây. Em nói nhà hàng có vườn à?' },
          { who: 'Kiên', voice: 'us-nam', text: 'Yes, a restaurant with a garden.', vi: 'Vâng, nhà hàng có vườn ạ.' },
          { who: 'Agnes', voice: 'nz-nu', text: "Great. I'll let you go. Talk soon, Kiên!", vi: 'Tuyệt. Chị không giữ em nữa. Nói chuyện sau nhé, Kiên!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd18-kt-nghe-hieu',
        title: 'Phần 1a — Hiểu ý (8 câu)',
        items: [
          {
            q: 'Lúc đầu cuộc gọi có trục trặc gì?',
            options: ['Agnes không thấy hình Kiên', 'Kiên đang tắt mic', 'Mạng của Agnes bị rớt', 'Kiên vào nhầm cuộc gọi'],
            correct: 1,
            why: '"I can see you, but I think **you\'re on mute**." (Ngày 17)',
          },
          {
            q: 'Agnes làm ở đâu và vào công ty bao lâu?',
            options: ['Team sự kiện ở Wellington, hai tuần', 'Team sự kiện ở Hà Nội, ba tháng', 'Phòng nhân sự ở Wellington, hai tháng', 'Team thiết kế, một năm'],
            correct: 0,
            why: '"I\'ve just joined the Wellington office" — "**The events team**" — "**Only two weeks!**" Ba tháng là thời gian của Kiên (Ngày 13).',
          },
          {
            q: '"Wellington\'s always windy, isn\'t it?" Agnes chờ Kiên trả lời thế nào?',
            options: ['Kể chi tiết về thời tiết Wellington', 'Một câu ngắn đồng ý hoặc nói chuyện tiếp; đây là câu mở chuyện', 'Không cần trả lời', 'Hỏi lại "Is it?"'],
            correct: 1,
            why: 'Câu đuôi xuống giọng = mở chuyện, không hỏi thật (Ngày 14). Agnes hỏi tiếp "Have you ever been?" và Kiên đáp "No, never, but I\'d love to."',
          },
          {
            q: 'Agnes nhờ Kiên việc gì, và nhờ bằng câu nào?',
            options: ['Đặt nhà hàng, bằng "Book a restaurant."', 'Gửi ảnh tiệc năm ngoái, bằng "Would you mind sending…?"', 'Gọi cho Courtney, bằng "Can you call Courtney?"', 'Làm danh sách khách, bằng "Please make a list."'],
            correct: 1,
            why: '"**Would you mind sending** me the photos…? **Do you know where they\'re saved?**" — lời nhờ lịch sự và câu hỏi gián tiếp (Ngày 15).',
          },
          {
            q: 'Nếu Kiên không tìm thấy ảnh thì sao?',
            options: ['Kiên báo Agnes là không có ảnh', 'Kiên sẽ hỏi Courtney', 'Kiên chụp ảnh mới', 'Agnes tự tìm'],
            correct: 1,
            why: '"**If I can\'t find them, I\'ll ask Courtney.**" Điều kiện loại 1 (Ngày 17).',
          },
          {
            q: 'Vì sao Kiên không vào được cuộc gọi sáng thứ Năm?',
            options: ['Vì Kiên bị ốm', 'Vì sáng hôm đó Kiên đi thi', 'Vì Kiên xin nghỉ phép', 'Vì mạng nhà Kiên yếu'],
            correct: 1,
            why: '"I\'m afraid **I won\'t be able to**, **because** I have an exam that morning." Kèm phương án: gửi ý tưởng qua email (Ngày 16).',
          },
          {
            q: 'Kiên không đồng ý ý tưởng quán bar sân thượng ở mức nào, và vì sao?',
            options: ['Mức mạnh: "That\'s a terrible idea"', 'Mức nhẹ: "I\'m not sure that\'s a good idea", vì tháng Mười Hai trên đó có thể rất lạnh và gió', 'Kiên đồng ý hoàn toàn', 'Kiên không nói gì'],
            correct: 1,
            why: '"**I\'m not sure that\'s a good idea. Although** the view is great, it can be really cold and windy in December." — mức 1, có lý do, có Although (Ngày 18).',
          },
          {
            q: 'Cuối cùng phương án nào được thêm vào danh sách?',
            options: ['Quán bar sân thượng', 'Nhà hàng có vườn: ngoài trời nhưng lạnh thì vào trong được', 'Karaoke', 'Văn phòng công ty'],
            correct: 1,
            why: 'Agnes: "Fair point. **However**, some people really want somewhere outdoors." Kiên đưa phương án ở giữa, Agnes: "**Let me** add it to the list." (Ngày 17, 18)',
          },
        ],
      },
      {
        t: 'dictation',
        id: 'gtd18-kt-chinh-ta',
        title: 'Phần 1b — Nghe và gõ lại (4 câu)',
        items: [
          { label: 'Câu 1 (Ngày 13)', spell: 'How long have you been at Bluefin?', answer: 'How long have you been at Bluefin?' },
          { label: 'Câu 2 (Ngày 15)', spell: "Do you know where they're saved?", answer: "Do you know where they're saved?", alt: ['Do you know where they are saved?'] },
          { label: 'Câu 3 (Ngày 16)', spell: "I'm afraid I won't be able to, because I have an exam.", answer: "I'm afraid I won't be able to, because I have an exam.", alt: ["I'm afraid I won't be able to because I have an exam.", 'I am afraid I will not be able to, because I have an exam.'] },
          { label: 'Câu 4 (Ngày 18)', spell: "I'm not sure that's a good idea.", answer: "I'm not sure that's a good idea.", alt: ['I am not sure that is a good idea.', "I'm not sure that is a good idea."] },
        ],
      },

      /** ───────────── 2. Mẫu câu hợp cảnh ───────────── **/
      { t: 'h', text: 'Phần 2 — Mẫu câu hợp cảnh (12 câu · đạt ≥ 9 · trượt thì ôn bài Nói của Ngày ghi trong câu)' },
      {
        t: 'mcq',
        id: 'gtd18-kt-mau-cau',
        title: 'Phần 2 — Chọn câu hợp cảnh nhất (12 câu)',
        items: [
          {
            q: '(Ngày 13) Ngày đầu đi làm, bạn muốn hỏi một đồng nghiệp làm ở bộ phận nào:',
            options: ['What is your department name?', 'Which team are you on?', 'Where you work?', 'Your team?'],
            correct: 1,
            why: '**Which team are you on?** là câu làm quen tự nhiên nhất ở công ty.',
          },
          {
            q: '(Ngày 13) Đồng nghiệp nói: "I\'m from Đà Nẵng." Bạn cũng vậy:',
            options: ["I'm from Đà Nẵng also too.", "Oh, me too! I'm from Đà Nẵng too.", 'I also am from Đà Nẵng.', 'Same same.'],
            correct: 1,
            why: '**too** đứng cuối câu; nói ngắn là **Me too!**',
          },
          {
            q: '(Ngày 14) Đứng chờ thang máy, bạn mở chuyện với đồng nghiệp:',
            options: ["The lift's really slow today, isn't it?", 'How much do you earn?', 'Why are you so quiet?', 'Lift slow.'],
            correct: 0,
            why: 'Câu đuôi về một chuyện ai cũng thấy là cách mở chuyện an toàn nhất.',
          },
          {
            q: '(Ngày 14) Đồng nghiệp: "You haven\'t tried egg coffee, have you?" Bạn CHƯA thử:',
            options: ['Yes, I haven\'t.', "No, I haven't. Is it good?", "Yes. Is it good?", "No, I have."],
            correct: 1,
            why: 'Trả lời theo **sự thật**: chưa thử ⇒ **No, I haven\'t.** Không theo kiểu "vâng, đúng thế" của tiếng Việt.',
          },
          {
            q: '(Ngày 15) Bạn cần đồng nghiệp xem giúp một email tiếng Anh trước khi gửi, mà người đó đang bận:',
            options: ['Check my email now.', "Sorry to bother you. Would you mind having a quick look at this email when you're free?", 'You must check this.', 'Help me!'],
            correct: 1,
            why: 'Xin lỗi làm phiền + **Would you mind + V-ing** + "when you\'re free" để người ta chọn lúc.',
          },
          {
            q: '(Ngày 15) Bạn không biết phòng họp B ở đâu. Câu lịch sự:',
            options: ['Where is meeting room B?', 'Do you know where meeting room B is?', 'Do you know where is meeting room B?', 'Meeting room B where?'],
            correct: 1,
            why: 'Câu hỏi gián tiếp: **Do you know where + S + V?** — "room B is", không đảo "is room B".',
          },
          {
            q: '(Ngày 16) Sáng nay bạn sốt, nhắn quản lý:',
            options: ["I'm not feeling well this morning, so I won't be able to come in today. Sorry for the short notice.", 'I sick. No work.', 'Today I off.', 'I will not come because sick.'],
            correct: 0,
            why: 'Báo tình trạng + **won\'t be able to** + xin lỗi vì báo gấp (**short notice**).',
          },
          {
            q: '(Ngày 16) Xe buýt hỏng, bạn sẽ tới muộn 20 phút:',
            options: ["I'll be about twenty minutes late, as my bus has broken down. Sorry!", 'I late 20 minutes.', 'Bus broken, wait me.', 'Sorry for late.'],
            correct: 0,
            why: 'Thời gian cụ thể + lý do bằng **as** + xin lỗi.',
          },
          {
            q: '(Ngày 17) Trong cuộc gọi, tiếng đồng nghiệp mất đúng lúc họ nói giờ hẹn:',
            options: ['What? Again!', 'Sorry, you cut out there. Could you pop the time in the chat?', 'Your internet is weak.', 'I can\'t listen you.'],
            correct: 1,
            why: '**You cut out there** + nhờ gõ vào chat: an toàn nhất với số và giờ.',
          },
          {
            q: '(Ngày 17) Bạn và trưởng nhóm cùng lúc bắt đầu nói:',
            options: ['Sorry, go ahead.', 'Me first!', '(nói tiếp, to hơn)', 'Wait, I am speaking.'],
            correct: 0,
            why: 'Nhường lời: **Sorry, go ahead.**',
          },
          {
            q: '(Ngày 18) Chị trưởng nhóm đề xuất đi ăn đồ Ý, bạn muốn phản đối nhẹ:',
            options: ["That's rubbish!", "I see what you mean, but I'm not sure it's close enough. Maybe somewhere nearer?", 'No, I hate it.', "You're wrong."],
            correct: 1,
            why: '**Mức 1**: ghi nhận + ý mình + lý do + phương án.',
          },
          {
            q: '(Ngày 18) Bạn nghe lý lẽ của đồng nghiệp và thấy họ đúng:',
            options: ["Fair enough. You've changed my mind.", 'Okay, I lose.', "I'm agree now.", 'Whatever.'],
            correct: 0,
            why: '**Fair enough. You\'ve changed my mind.** Đổi ý vui vẻ, không ai mất mặt.',
          },
        ],
      },

      /** ───────────── 3. Ngữ pháp ───────────── **/
      { t: 'h', text: 'Phần 3 — Ngữ pháp (12 câu · đạt ≥ 9 · trượt thì ôn mục 🧱 của Ngày ghi trong câu)' },
      {
        t: 'quiz',
        id: 'gtd18-kt-ngu-phap',
        title: 'Phần 3 — Điền một từ (12 câu)',
        kind: 'fill',
        grammar: "have · either · aren't · ever · is · V-ing · because / as / since · able · V-s · Let · think · Although",
        items: [
          { q: '(Ngày 13) How long ___ you been with the company?', answers: ['have'] },
          { q: "(Ngày 13) I don't like karaoke. — I don't like it ___. (cũng không)", answers: ['either'] },
          { q: "(Ngày 14) You're new here, ___ you?", answers: ["aren't", 'aren’t'] },
          { q: '(Ngày 14) Have you ___ been to Sa Pa?', answers: ['ever'] },
          { q: '(Ngày 15) Do you know where the printer ___?', answers: ['is'] },
          { q: '(Ngày 15) Would you mind ___ (open) the window?', answers: ['opening'] },
          { q: "(Ngày 16) I'll be late ___ my bus has broken down. (vì)", answers: ['because', 'as', 'since'] },
          { q: "(Ngày 16) Sorry, I won't be ___ to come in tomorrow.", answers: ['able'] },
          { q: "(Ngày 17) If the Wi-Fi ___ (stop) working, I'll use my phone.", answers: ['stops'] },
          { q: '(Ngày 17) ___ me share my screen.', answers: ['Let', 'let'] },
          { q: "(Ngày 18) I don't ___ it's a good idea.", answers: ['think'] },
          { q: "(Ngày 18) ___ it's expensive, the food is great. (mặc dù)", answers: ['Although', 'although', 'Though', 'though'] },
        ],
      },

      /** ───────────── 4. Viết tin nhắn ───────────── **/
      { t: 'h', text: 'Phần 4 — Viết tin nhắn (10 câu · đạt ≥ 7 · trượt thì ôn bài Đọc / Viết của Ngày 13, 15, 16, 18)' },
      {
        t: 'quiz',
        id: 'gtd18-kt-viet',
        title: 'Phần 4a — Tự viết 6 tin (dịch Việt → Anh)',
        kind: 'translate',
        grammar: "I've just joined… · …, isn't it? · Would you mind + V-ing? · won't be able to… because… · If…, I'll… · I'm not sure about… However, …",
        items: [
          { q: '(Ngày 13 — nhắn nhóm) Chào mọi người! Mình là Kiên, mình vừa vào team thiết kế.', hint: "I'm, I've just joined, design team", answers: ["Hi everyone! I'm Kiên, and I've just joined the design team.", "Hi everyone! I'm Kien, and I've just joined the design team.", "Hi everyone! I'm Kiên. I've just joined the design team.", "Hi everyone! I'm Kien. I've just joined the design team.", "Hi, everyone! I'm Kiên and I've just joined the design team.", "Hi all! I'm Kiên, and I've just joined the design team."] },
          { q: '(Ngày 14 — nhắn đồng nghiệp) Hôm nay lạnh thật, nhỉ? Uống cà phê không?', hint: "cold, isn't it, coffee", answers: ["It's really cold today, isn't it? Coffee?", "It's really cold today, isn't it? Do you want a coffee?", "It's so cold today, isn't it? Coffee?", "It's really cold today, isn't it? Fancy a coffee?", "It is really cold today, isn't it? Coffee?", "It's really cold today, isn't it? Want a coffee?"] },
          { q: '(Ngày 15 — nhờ việc) Phiền chị gửi giúp em đường link được không ạ?', hint: 'would you mind sending', answers: ['Would you mind sending me the link?', 'Would you mind sending me the link, please?', 'Would you mind sending the link to me?', 'Would you mind sending me the link again?'] },
          { q: '(Ngày 16 — nhắn quản lý) Em xin lỗi, em không đến được buổi chiều nay vì em phải đi khám.', hint: "won't be able to come, because, doctor's appointment", answers: ["Sorry, I won't be able to come this afternoon because I have a doctor's appointment.", "I'm sorry, I won't be able to come this afternoon because I have a doctor's appointment.", "Sorry, I won't be able to come in this afternoon because I have a doctor's appointment.", "Sorry, I won't be able to come this afternoon because I've got a doctor's appointment.", "Sorry, I won't be able to come this afternoon as I have a doctor's appointment.", "Sorry, I won't be able to come this afternoon because I have to see a doctor.", "Sorry, I won't be able to come this afternoon because I have to go to the doctor."] },
          { q: '(Ngày 17 — chat trong cuộc gọi) Nếu mạng em rớt, em sẽ vào lại ngay.', hint: "if, connection drops, I'll rejoin straight away", answers: ["If my connection drops, I'll rejoin straight away.", 'If my connection drops, I will rejoin straight away.', "If my connection drops, I'll rejoin right away.", "If my internet drops, I'll rejoin straight away.", "If I drop out, I'll rejoin straight away.", "If my connection drops, I'll rejoin immediately."] },
          { q: '(Ngày 18 — nhóm chat) Mình không chắc về thứ Bảy. Tuy nhiên, chủ nhật thì được.', hint: "not sure about, however, works", answers: ["I'm not sure about Saturday. However, Sunday works.", "I'm not sure about Saturday. However, Sunday works for me.", 'I am not sure about Saturday. However, Sunday works.', "I'm not sure about Saturday. However, Sunday is fine.", "I'm not sure about Saturday. However, Sunday is okay.", "I'm not sure about Saturday. However, Sunday is fine for me."] },
        ],
      },
      {
        t: 'build',
        id: 'gtd18-kt-viet-ghep',
        title: 'Phần 4b — Sắp xếp câu trong tin nhắn (4 câu)',
        items: [
          { vi: '(Ngày 13) Rất vui được làm việc cùng mọi người.', chips: ['Looking', 'forward', 'to', 'working', 'with', 'you', 'all.', 'work', 'for'], answer: ['Looking', 'forward', 'to', 'working', 'with', 'you', 'all.'] },
          { vi: '(Ngày 15) Bạn có biết ai giữ chìa khoá phòng họp không?', chips: ['Do', 'you', 'know', 'who', 'has', 'the', 'key', 'to', 'the', 'meeting', 'room?', 'does', 'is'], answer: ['Do', 'you', 'know', 'who', 'has', 'the', 'key', 'to', 'the', 'meeting', 'room?'] },
          { vi: '(Ngày 16) Em xin về sớm vì con mèo nhà em bị ốm.', chips: ['Could', 'I', 'leave', 'early,', 'as', 'my', 'cat', 'is', 'sick?', 'go', 'because of'], answer: ['Could', 'I', 'leave', 'early,', 'as', 'my', 'cat', 'is', 'sick?'] },
          { vi: '(Ngày 18) Dù tôi thích ý này, tôi không nghĩ nó hợp với mọi người.', chips: ['Although', 'I', 'like', 'the', 'idea,', 'I', "don't", 'think', 'it', 'works', 'for', 'everyone.', 'but', 'not'], answer: ['Although', 'I', 'like', 'the', 'idea,', 'I', "don't", 'think', 'it', 'works', 'for', 'everyone.'] },
        ],
      },

      { t: 'h', text: 'Sau khi làm xong' },
      {
        t: 'note',
        title: 'Đạt hay chưa đạt — làm gì tiếp',
        items: [
          '**Đạt cả 4 phần**: sang **Ngày 19**, chặng 4 "Giao tiếp sâu". Trước khi sang, ghi âm **1 phút nêu ý kiến** (bài cuối ngày của Ngày 18) và so với bản ghi tự giới thiệu ở Ngày 13: câu dài hơn chưa, có từ nối chưa?',
          '**Trượt Nghe**: nghe lại ba cảnh của **Ngày 17** (gọi video) và **Ngày 18** (tranh luận), mỗi cảnh 2 lần, lần 2 bật lời thoại và nhắc lại từng câu thành tiếng. Làm lại Phần 1 sau một ngày.',
          '**Trượt Mẫu câu**: mỗi câu sai ghi một (Ngày N). Mở bài **Nói** ngày đó, đọc lại bảng **ba mức lịch sự**, rồi làm phần "Nhập vai với Gia sư AI" của ngày đó một lượt.',
          '**Trượt Ngữ pháp**: mở mục **🧱 Câu này ghép thế nào** của ngày có câu sai. Hay nhầm nhất ở chặng này: **trả lời câu đuôi phủ định** (Ngày 14), **câu hỏi gián tiếp không đảo ngữ** (Ngày 15), **If… will** (Ngày 17), **I think… not / although… but** (Ngày 18).',
          '**Trượt Viết**: làm lại phần **Tập viết** của bài Viết Ngày 16 và 18, rồi viết 3 tin thật trong tuần này: một tin nhờ việc, một tin báo trễ, một tin trả lời góp ý trong nhóm chat.',
          'Chỉ làm lại **phần trượt**, không cần làm lại cả bài. Đạt rồi thì sang Ngày 19, đừng đợi điểm tuyệt đối.',
        ],
      },
    ],
  },
];
