/**
 * Tiếng Anh giao tiếp — NGÀY 5 (chặng 1 "Sống sót", A2): mua sắm & dịch vụ.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd5-`.
 * Ngữ pháp trong câu: How much / How many · this / that / these / those · so sánh đơn giản (cheaper, bigger, more expensive).
 * Cảnh: Phong — sinh viên IT năm 3 — sang London 3 tháng thực tập trao đổi ở văn phòng một công ty khách hàng.
 * Khác podcast en-ds-a1-02 (Vy mua xoài ở chợ phiên): ở đây là SIM điện thoại, trả áo, đổi tiền, mua xe đạp cũ.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_5: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd5-nghe',
    kind: 'listening',
    title: 'Mua sắm & dịch vụ: hỏi giá, đổi trả, ngân hàng',
    goal: 'Nghe hiểu ba cảnh mua sắm và dịch vụ ở London: chọn gói SIM, trả lại một chiếc áo, đổi tiền ở quầy, và nghe ra đúng giá, đúng điều kiện, đúng lời khuyên.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Phong**, sinh viên IT năm 3, vừa tới **London** cho đợt thực tập trao đổi 3 tháng. Tuần đầu Phong phải tự lo ba việc: **SIM điện thoại, quần áo ấm và tiền mặt**.',
          'Bạn cần nghe ra: **giá bao nhiêu, mỗi tháng hay mỗi lần, được bao nhiêu** (dữ liệu, ngày, tiền), và **điều kiện** đi kèm.',
          'Ngày 4 bạn đã gọi món, xin hoá đơn ở Melbourne. Hôm nay là cửa hàng và quầy dịch vụ: câu hỏi chuyển từ **Can I have…?** sang **How much…? How many…? Which one is cheaper?**',
          'Người Anh có vài từ lóng về tiền làm người mới "đứng hình": **quid**, **a tenner**, **a fiver**. Bài này gặp cả ba.',
          'Nghe mỗi cảnh **2 lần**: lần 1 chỉ ghi số ra giấy, lần 2 mở lời thoại và đọc theo.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Cửa hàng điện thoại: hợp đồng hay trả trước?' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'man-student', 'man-office-worker', 'pound-banknote', 'credit-card'],
        caption: 'Chiều thứ Bảy trên một con phố mua sắm ở London. **Phong** vào một cửa hàng điện thoại để mua SIM. Anh nhân viên **Callum** nói giọng Anh, nhanh và dùng từ lóng.',
      },
      {
        t: 'listen',
        id: 'gtd5-nghe-canh1',
        title: 'Scene 1 — At the phone shop',
        note: 'Nghe xem có mấy gói, mỗi gói giá bao nhiêu, và vì sao Phong không lấy được gói rẻ hơn theo tháng.',
        lines: [
          { who: 'Callum', voice: 'uk-nam', text: 'Hiya, you alright? Looking for anything in particular?', vi: 'Chào anh, khoẻ không? Anh đang tìm gì cụ thể không?' },
          { who: 'Phong', voice: 'us-nam', text: "Hi. Yes, I need a SIM card. I'm here for three months.", vi: 'Chào anh. Vâng, tôi cần một cái SIM. Tôi ở đây ba tháng.' },
          { who: 'Callum', voice: 'uk-nam', text: 'Right. Do you want a contract or pay as you go?', vi: 'Được. Anh muốn hợp đồng (trả sau) hay trả trước?' },
          { who: 'Phong', voice: 'us-nam', text: "Sorry, what's the difference?", vi: 'Xin lỗi, hai cái khác nhau thế nào?' },
          { who: 'Callum', voice: 'uk-nam', text: 'With a contract, you pay every month for a year. With pay as you go, you just top up when you need to.', vi: 'Hợp đồng thì anh trả hằng tháng trong một năm. Trả trước thì khi nào cần anh nạp tiền thôi.' },
          { who: 'Phong', voice: 'us-nam', text: 'I see. How much is this one?', vi: 'Tôi hiểu rồi. Cái này bao nhiêu?' },
          { who: 'Callum', voice: 'uk-nam', text: "That one's twelve quid a month for thirty gigs.", vi: 'Cái đó mười hai bảng một tháng, được ba mươi gigabyte.' },
          { who: 'Phong', voice: 'us-nam', text: 'Twelve… quid?', vi: 'Mười hai… "quid" ạ?' },
          { who: 'Callum', voice: 'uk-nam', text: 'Sorry, twelve pounds. "Quid" just means pounds.', vi: 'À xin lỗi, mười hai bảng. "Quid" nghĩa là bảng Anh thôi.' },
          { who: 'Phong', voice: 'us-nam', text: 'Ah, okay. And those ones on the poster?', vi: 'À, vâng. Còn mấy gói trên tấm áp phích kia?' },
          { who: 'Callum', voice: 'uk-nam', text: "Those are fifteen a month, but the data's unlimited. It's a better deal if you watch a lot of videos.", vi: 'Mấy gói đó mười lăm một tháng, nhưng dữ liệu không giới hạn. Anh hay xem video thì gói đó lợi hơn.' },
          { who: 'Phong', voice: 'us-nam', text: "But I'm only here for three months. Can I cancel early?", vi: 'Nhưng tôi chỉ ở đây ba tháng. Tôi huỷ sớm được không?' },
          { who: 'Callum', voice: 'uk-nam', text: "Not really, I'm afraid. And for a contract, you need a UK bank account.", vi: 'E là không được anh ạ. Mà làm hợp đồng thì anh cần tài khoản ngân hàng ở Anh.' },
          { who: 'Phong', voice: 'us-nam', text: "I don't have one yet. So pay as you go is better for me?", vi: 'Tôi chưa có. Vậy trả trước hợp với tôi hơn à?' },
          { who: 'Callum', voice: 'uk-nam', text: "Definitely. This one's a tenner for twenty gigs, and it lasts thirty days. No contract.", vi: 'Chắc chắn rồi. Gói này mười bảng được hai mươi gigabyte, dùng ba mươi ngày. Không hợp đồng.' },
          { who: 'Phong', voice: 'us-nam', text: 'A tenner is ten pounds, right? How many minutes do I get?', vi: '"A tenner" là mười bảng phải không? Tôi được bao nhiêu phút gọi?' },
          { who: 'Callum', voice: 'uk-nam', text: 'Unlimited calls and texts in the UK. Calls to Vietnam cost extra, though.', vi: 'Gọi và nhắn tin trong nước Anh không giới hạn. Nhưng gọi về Việt Nam thì tính thêm.' },
          { who: 'Phong', voice: 'us-nam', text: "That's fine, I use apps for that. I'll take the ten-pound one, please.", vi: 'Không sao, cái đó tôi dùng ứng dụng. Cho tôi gói mười bảng.' },
          { who: 'Callum', voice: 'uk-nam', text: "Lovely. Pop it in your phone and… there you go. You're all set.", vi: 'Được rồi. Anh lắp vào máy rồi… xong. Mọi thứ sẵn sàng rồi.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd5-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Gói hợp đồng 12 bảng một tháng cho bao nhiêu dữ liệu?',
            options: ['20 GB', '30 GB', 'Không giới hạn', '12 GB'],
            correct: 1,
            why: '"That one\'s twelve quid a month for **thirty gigs**." gigs = gigabytes.',
          },
          {
            q: 'Vì sao Phong không làm được hợp đồng?',
            options: ['Hợp đồng đắt quá', 'Anh ấy chưa có tài khoản ngân hàng ở Anh', 'Cửa hàng hết SIM', 'Anh ấy không có hộ chiếu'],
            correct: 1,
            why: 'Callum: "for a contract, you need **a UK bank account**." Phong: "I don\'t have one yet."',
          },
          {
            q: 'Cuối cùng Phong trả bao nhiêu và được gì?',
            options: ['£15, dữ liệu không giới hạn', '£12 một tháng trong một năm', '£10, 20 GB dùng 30 ngày', '£10, 30 GB'],
            correct: 2,
            why: '"This one\'s **a tenner for twenty gigs**, and it lasts **thirty days**." a tenner = £10.',
          },
          {
            q: 'Callum nói "Not really, I\'m afraid." Câu đó báo điều gì?',
            options: ['Callum đang sợ', 'Một tin không vui: không huỷ sớm được', 'Callum không biết', 'Huỷ sớm được nhưng mất phí'],
            correct: 1,
            why: '**I\'m afraid** đứng đầu hay cuối câu = "e là…", làm mềm một tin xấu. Không liên quan tới sợ hãi.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Trả áo khoác: "Have you got the receipt?"' },
      {
        t: 'canh',
        anh: ['coat', 'shopping-bags', 'receipt', 'woman-office-worker', 'mobile-phone'],
        caption: 'Hai hôm sau. Chiếc áo khoác Phong mua **chật ở vai**. Phong mang áo quay lại cửa hàng. Chị **Priya** ở quầy đổi trả.',
      },
      {
        t: 'listen',
        id: 'gtd5-nghe-canh2',
        title: 'Scene 2 — Returning a jacket',
        note: 'Nghe xem Phong muốn gì lúc đầu, cửa hàng còn cỡ nào, và cuối cùng Phong chọn gì.',
        lines: [
          { who: 'Priya', voice: 'uk-nu', text: 'Hi there. Can I help?', vi: 'Chào anh. Tôi giúp gì được ạ?' },
          { who: 'Phong', voice: 'us-nam', text: "Hi. I bought this jacket on Saturday, but it's a bit tight across the shoulders.", vi: 'Chào chị. Tôi mua cái áo khoác này hôm thứ Bảy, nhưng nó hơi chật ở vai.' },
          { who: 'Priya', voice: 'uk-nu', text: "Oh, sorry about that. Have you got the receipt?", vi: 'Ôi, tiếc quá. Anh có hoá đơn không?' },
          { who: 'Phong', voice: 'us-nam', text: "I've got the email receipt. Is that okay?", vi: 'Tôi có hoá đơn gửi qua email. Như vậy được không?' },
          { who: 'Priya', voice: 'uk-nu', text: "That's fine. And the tags are still on. Lovely. Would you like an exchange or a refund?", vi: 'Được ạ. Nhãn vẫn còn nguyên. Tốt quá. Anh muốn đổi hay lấy lại tiền?' },
          { who: 'Phong', voice: 'us-nam', text: 'An exchange, please. Do you have this in a large?', vi: 'Cho tôi đổi. Áo này còn cỡ L không chị?' },
          { who: 'Priya', voice: 'uk-nu', text: 'Let me check… Sorry, the navy one is sold out in a large. We only have it in green.', vi: 'Để tôi xem… Xin lỗi, màu xanh than hết cỡ L rồi. Chỉ còn màu xanh lá.' },
          { who: 'Phong', voice: 'us-nam', text: "Hmm, I'm not sure about green. Do you have anything similar?", vi: 'Hừm, tôi không chắc lắm với màu xanh lá. Chị có mẫu nào tương tự không?' },
          { who: 'Priya', voice: 'uk-nu', text: "These ones over here are similar. They're a bit longer, and they're cheaper, too. Sixty-five instead of seventy-nine.", vi: 'Mấy cái bên này giống kiểu đó. Dài hơn một chút, lại rẻ hơn nữa. Sáu mươi lăm thay vì bảy mươi chín.' },
          { who: 'Phong', voice: 'us-nam', text: 'Are they warmer than this one? It gets really cold here.', vi: 'Mấy cái đó có ấm hơn cái này không? Ở đây trời lạnh thật.' },
          { who: 'Priya', voice: 'uk-nu', text: "Honestly, no. This wool one is warmer. Those are better for spring.", vi: 'Nói thật là không. Cái len này ấm hơn. Mấy cái kia hợp mùa xuân hơn.' },
          { who: 'Phong', voice: 'us-nam', text: 'Then I think I need a refund, please. I paid by card.', vi: 'Vậy chắc tôi lấy lại tiền thôi. Tôi trả bằng thẻ.' },
          { who: 'Priya', voice: 'uk-nu', text: "No problem. Can you tap the same card here? It'll go back on your card in three to five working days.", vi: 'Không sao. Anh chạm đúng cái thẻ đó vào đây nhé? Tiền sẽ về thẻ trong ba đến năm ngày làm việc.' },
          { who: 'Phong', voice: 'us-nam', text: 'Three to five working days. Okay. Do I need to sign anything?', vi: 'Ba đến năm ngày làm việc. Vâng. Tôi có cần ký gì không?' },
          { who: 'Priya', voice: 'uk-nu', text: "No, that's all done. Here's your refund receipt. Try our other shop on Regent Street. They might have a large.", vi: 'Không, xong hết rồi. Đây là biên nhận hoàn tiền. Anh thử chi nhánh trên phố Regent xem, có khi bên đó còn cỡ L.' },
          { who: 'Phong', voice: 'us-nam', text: "Good idea. Thanks for your help.", vi: 'Ý hay đấy. Cảm ơn chị đã giúp.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd5-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Chiếc áo có vấn đề gì?',
            options: ['Bị rách', 'Hơi chật ở vai', 'Sai màu', 'Quá dài'],
            correct: 1,
            why: '"it\'s a bit **tight across the shoulders**." Áo không lỗi, chỉ không vừa.',
          },
          {
            q: 'Lúc đầu Phong muốn gì?',
            options: ['Lấy lại tiền', 'Đổi sang cỡ L cùng màu', 'Đổi sang màu xanh lá', 'Sửa áo'],
            correct: 1,
            why: '"**An exchange**, please. Do you have this **in a large**?"',
          },
          {
            q: 'Mẫu áo Priya gợi ý khác áo cũ thế nào?',
            options: ['Dài hơn, rẻ hơn nhưng không ấm bằng', 'Ngắn hơn và đắt hơn', 'Giống hệt nhưng màu khác', 'Ấm hơn và rẻ hơn'],
            correct: 0,
            why: '"They\'re **a bit longer**, and they\'re **cheaper**" rồi "This wool one is **warmer**. Those are better for spring."',
          },
          {
            q: 'Bao lâu thì tiền về thẻ của Phong?',
            options: ['Ngay lập tức', '3–5 ngày làm việc', '28 ngày', '1 tuần'],
            correct: 1,
            why: '"It\'ll go back on your card in **three to five working days**." working days = ngày làm việc, không tính cuối tuần.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Quầy đổi tiền ở nhà ga: "pounds or dong?"' },
      {
        t: 'canh',
        anh: ['station', 'dollar-banknote', 'pound-banknote', 'man-office-worker', 'atm-sign'],
        caption: 'Chủ nhật Phong định đi chợ đồ cũ, ở đó nhiều sạp **chỉ nhận tiền mặt**. Phong ghé quầy đổi tiền trong nhà ga. Anh nhân viên **Ciarán** người Ireland.',
      },
      {
        t: 'listen',
        id: 'gtd5-nghe-canh3',
        title: 'Scene 3 — At the currency exchange',
        note: 'Nghe xem quầy có đổi tiền đồng không, Phong đổi bao nhiêu, và Ciarán khuyên gì về máy quẹt thẻ.',
        lines: [
          { who: 'Ciarán', voice: 'ie-nam', text: 'Morning. What can I do for you?', vi: 'Chào buổi sáng. Tôi giúp gì được anh?' },
          { who: 'Phong', voice: 'us-nam', text: 'Hi. Can I change Vietnamese dong to pounds here?', vi: 'Chào anh. Ở đây đổi tiền đồng Việt Nam sang bảng được không?' },
          { who: 'Ciarán', voice: 'ie-nam', text: "Sorry, we don't take dong. We do dollars, euros, yen, that kind of thing.", vi: 'Xin lỗi, bên tôi không nhận tiền đồng. Bên tôi đổi đô la, euro, yên, mấy loại như thế.' },
          { who: 'Phong', voice: 'us-nam', text: "Okay. I have some US dollars. What's the rate today?", vi: 'Vâng. Tôi có ít đô la Mỹ. Tỷ giá hôm nay bao nhiêu?' },
          { who: 'Ciarán', voice: 'ie-nam', text: "We're buying at seventy-four pence to the dollar. So a hundred dollars gets you seventy-four pounds.", vi: 'Bên tôi mua vào bảy mươi tư xu một đô. Tức là một trăm đô được bảy mươi tư bảng.' },
          { who: 'Phong', voice: 'us-nam', text: 'Is there a commission?', vi: 'Có mất phí không?' },
          { who: 'Ciarán', voice: 'ie-nam', text: "No commission. The rate's a little better if you change more than five hundred, though.", vi: 'Không mất phí. Nhưng đổi trên năm trăm thì tỷ giá tốt hơn một chút.' },
          { who: 'Phong', voice: 'us-nam', text: 'Just two hundred, please. Is it cheaper to use my Vietnamese card?', vi: 'Hai trăm thôi anh. Dùng thẻ Việt Nam của tôi thì có rẻ hơn không?' },
          { who: 'Ciarán', voice: 'ie-nam', text: 'Depends on your bank. Some banks charge a fee every time you pay abroad. Check your app.', vi: 'Tuỳ ngân hàng của anh. Có ngân hàng tính phí mỗi lần anh trả tiền ở nước ngoài. Anh xem trong ứng dụng.' },
          { who: 'Ciarán', voice: 'ie-nam', text: 'One tip, though. When a card machine asks "pounds or dong?", always choose pounds.', vi: 'Nhưng có một mẹo. Khi máy quẹt thẻ hỏi "bảng hay đồng?", lúc nào cũng chọn bảng.' },
          { who: 'Phong', voice: 'us-nam', text: 'Really? Why is that?', vi: 'Thật ạ? Sao vậy anh?' },
          { who: 'Ciarán', voice: 'ie-nam', text: 'If you pick dong, the machine changes the money for you, and its rate is usually much worse.', vi: 'Chọn đồng thì cái máy tự đổi tiền giúp anh, mà tỷ giá của nó thường tệ hơn nhiều.' },
          { who: 'Phong', voice: 'us-nam', text: 'Good to know. Thank you!', vi: 'May mà biết. Cảm ơn anh!' },
          { who: 'Ciarán', voice: 'ie-nam', text: "Right, two hundred dollars, that's a hundred and forty-eight pounds. How would you like it?", vi: 'Rồi, hai trăm đô, là một trăm bốn mươi tám bảng. Anh muốn lấy tiền loại nào?' },
          { who: 'Phong', voice: 'us-nam', text: "Could I have some fives and tens, please? The market stalls don't like big notes.", vi: 'Cho tôi ít tờ năm và tờ mười nhé. Sạp ngoài chợ không thích tờ lớn.' },
          { who: 'Ciarán', voice: 'ie-nam', text: 'No bother. And if you need more, the cash machine outside is free. Some of the ones in shops charge you.', vi: 'Không vấn đề gì. Cần thêm thì cây rút tiền ngoài kia miễn phí. Mấy cây đặt trong cửa hàng có cây tính phí đấy.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd5-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Quầy có đổi tiền đồng Việt Nam không?',
            options: ['Có, không mất phí', 'Có, nhưng tỷ giá thấp', 'Không', 'Chỉ khi đổi trên 500'],
            correct: 2,
            why: '"Sorry, **we don\'t take dong**." Rất nhiều quầy đổi tiền ở nước ngoài không nhận tiền đồng. Mang đô la Mỹ hoặc dùng thẻ thì dễ hơn.',
          },
          {
            q: 'Phong đổi bao nhiêu đô và nhận bao nhiêu bảng?',
            options: ['$100 → £74', '$200 → £148', '$500 → £370', '$200 → £184'],
            correct: 1,
            why: '"**two hundred dollars**, that\'s **a hundred and forty-eight pounds**." Tỷ giá 74 xu/đô: 200 × 0,74 = 148.',
          },
          {
            q: 'Máy quẹt thẻ hỏi "pounds or dong?". Ciarán khuyên chọn gì?',
            options: ['Đồng, cho dễ tính', 'Bảng', 'Cái nào cũng như nhau', 'Không trả bằng thẻ'],
            correct: 1,
            why: 'Chọn tiền **của nước sở tại** (bảng). Chọn tiền nhà thì máy tự quy đổi với tỷ giá thường tệ hơn nhiều.',
          },
          {
            q: 'Vì sao Phong xin tờ 5 và tờ 10?',
            options: ['Vì tờ lớn bị cấm', 'Vì sạp ở chợ không thích tờ lớn', 'Vì quầy hết tờ 20', 'Vì cây rút tiền chỉ nhận tờ nhỏ'],
            correct: 1,
            why: '"The market stalls **don\'t like big notes**." Mua đồ ở chợ, tiền lẻ giúp mặc cả dễ hơn và người bán không phải thối.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Câu có số thì gõ chữ hay gõ số đều được. Chú ý chữ nhỏ bị nuốt: **a, a bit, in a, to the**.',
      },
      {
        t: 'dictation',
        id: 'gtd5-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — giá gói SIM (quid = pounds)', spell: "That one's twelve quid a month.", answer: "That one's twelve quid a month.", alt: ["That one's 12 quid a month.", 'That one is twelve quid a month.', 'That one is 12 quid a month.'] },
          { label: 'Câu 2 — hỏi số lượng', spell: 'How many minutes do I get?', answer: 'How many minutes do I get?' },
          { label: 'Câu 3 — áo không vừa', spell: "It's a bit tight across the shoulders.", answer: "It's a bit tight across the shoulders.", alt: ['It is a bit tight across the shoulders.'] },
          { label: 'Câu 4 — hỏi cỡ', spell: 'Do you have this in a large?', answer: 'Do you have this in a large?' },
          { label: 'Câu 5 — thời gian hoàn tiền', spell: "It'll go back on your card in three to five working days.", answer: "It'll go back on your card in three to five working days.", alt: ["It'll go back on your card in 3 to 5 working days.", 'It will go back on your card in three to five working days.', 'It will go back on your card in 3 to 5 working days.', "It'll go back on your card in 3-5 working days."] },
          { label: 'Câu 6 — tỷ giá (pence = xu)', spell: "We're buying at seventy-four pence to the dollar.", answer: "We're buying at seventy-four pence to the dollar.", alt: ["We're buying at 74 pence to the dollar.", 'We are buying at seventy-four pence to the dollar.', 'We are buying at 74 pence to the dollar.', "We're buying at seventy four pence to the dollar."] },
          { label: 'Câu 7 — xin tiền lẻ', spell: 'Could I have some fives and tens, please?', answer: 'Could I have some fives and tens, please?', alt: ['Could I have some 5s and 10s, please?'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Looking for anything in particular?', 'Anh/chị cần gì không? Câu mở lời của nhân viên, không phải tra hỏi.', "Just looking, thanks. · Yes, I'm looking for…"],
          ['twelve quid · a fiver · a tenner', '£12 · tờ £5 · tờ £10 (lóng, rất hay nghe ở Anh)', '(hiểu là đủ, bạn cứ nói pounds)'],
          ["It's a better deal.", 'Gói này lợi hơn (tính ra rẻ hơn so với cái được).', 'Is it? Why?'],
          ["Not really, I'm afraid.", 'Không được đâu. **I\'m afraid** làm mềm tin xấu.', 'Oh, okay. What else can I do?'],
          ['Lovely.', 'Ở Anh = "được rồi, ổn", nói cả khi chẳng có gì "đáng yêu".', '(không cần đáp)'],
          ["Pop it in. · You're all set.", 'Lắp vào đi. · Xong rồi, dùng được rồi.', 'Great, thanks.'],
          ['Honestly, no.', 'Nhân viên nói thật dù mất một đơn bán. Tin được.', 'Thanks for being honest.'],
          ['No bother. (Ireland)', 'Không có gì, không phiền đâu.', '(mỉm cười)'],
        ],
        caption: 'Ở cửa hàng Anh, nhân viên hay chào bằng câu hỏi: **You alright?** (Ngày 1) hoặc **Can I help?** Trả lời "Just looking, thanks" là đủ lịch sự, họ sẽ để bạn tự xem.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp GIÁ thì làm gì',
        items: [
          '**Nhắc lại con số** kèm "right?": "Twelve pounds a month, right?" Sai thì người ta sửa ngay. Đây là cách nhanh nhất và tự nhiên nhất.',
          'Nghi ngờ **-teen / -ty** (Ngày 2): hỏi kiểu lựa chọn: "Sorry, fifteen or fifty?" Người bán sẽ nhấn rõ âm.',
          'Nhìn **màn hình máy quẹt thẻ** trước khi chạm thẻ. Con số trên đó mới là con số bạn trả.',
          'Nghe từ lạ về tiền (quid, tenner) thì hỏi thẳng: "Sorry, what does quid mean?" Như Phong. Không ai cười bạn.',
          'Giá có hai phần (12 quid **a month** · 74p **to the dollar**): hỏi lại phần thứ hai: "Is that per month or in total?"',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc'],
        rows: [
          ['Cây rút tiền', 'cash machine · cashpoint', 'ATM', 'ATM'],
          ['SIM trả trước', 'pay as you go', 'prepaid', 'prepaid'],
          ['Điện thoại di động', 'mobile', 'cell phone · cell', 'mobile'],
          ['Quần dài', 'trousers (pants = **quần lót**!)', 'pants', 'pants · trousers'],
          ['Phòng thử đồ', 'changing room · fitting room', 'fitting room · dressing room', 'change room · fitting room'],
          ['Tiền lóng', 'quid · fiver · tenner', 'bucks', 'bucks'],
          ['Thuế trong giá', 'Giá dán đã gồm thuế VAT', '**Chưa** gồm thuế bán hàng, tới quầy mới cộng (mỗi bang một mức)', 'Giá dán đã gồm GST'],
          ['Xếp hàng', 'queue', 'line', 'queue · line'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc khi đi mua sắm. Ở Mỹ đừng ngạc nhiên khi tới quầy, số tiền **cao hơn** giá dán: đó là thuế, không phải bị chặt chém.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-a1-02 · How Much Are the Mangoes?** — Vy hỏi giá xoài ở chợ phiên, nhầm twelve với twenty, sạp chỉ nhận tiền mặt.',
          '**en-ds-b2-01 · Is the Rent Negotiable?** — thương lượng giá thuê nhà. Tập này khó (B2), nghe thử để thấy mặc cả ở mức cao hơn trông thế nào.',
          'Cảnh trong podcast khác bài hôm nay. Nghe để gặp lại **How much…? Can I pay by card?** trong một chuyện mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd5-noi',
    kind: 'speaking',
    title: 'Hỏi, mặc cả, đổi trả lịch sự',
    goal: 'Hỏi giá, hỏi cỡ, so sánh hai món, mặc cả ở nơi được phép mặc cả và trả hàng hoặc xin hoàn tiền mà vẫn lịch sự.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** đi theo một lượt mua sắm: **xem → hỏi giá → hỏi cỡ, thử → so sánh → mặc cả → trả tiền → đổi trả**.',
          'Ngữ pháp: **How much / How many**, **this / that / these / those**, và **so sánh** (cheaper, bigger, more expensive, better).',
          '**Mặc cả ở đâu thì được**: chợ đồ cũ, đồ mua lại trên mạng thì được; cửa hàng có giá dán thì gần như không.',
          'Ngôn ngữ cơ thể khi trả tiền và mặc cả: đưa tiền một tay hay hai tay, đếm ngón tay, chỉ vào món hàng.',
          'Cuối bài bạn nhập vai **mua một chiếc xe đạp cũ** qua mạng và mặc cả với người bán.',
        ],
      },

      { t: 'h', text: '1. Đổi trả trong 4 bước' },
      {
        t: 'sodo',
        kind: 'flow',
        title: 'Trả hàng lịch sự mà vẫn được việc',
        caption: 'Không cần kể dài. Bốn câu ngắn đúng thứ tự là nhân viên hiểu ngay bạn cần gì.',
        steps: [
          { label: 'Nói vấn đề', sub: "I bought this on Saturday, but it doesn't fit." },
          { label: 'Đưa bằng chứng', sub: "Here's the receipt. The tags are still on." },
          { label: 'Nói mình muốn gì', sub: 'Could I exchange it for a bigger size?' },
          { label: 'Hỏi bước tiếp', sub: 'How long does the refund take?' },
        ],
      },

      { t: 'h', text: '2. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Học theo thứ tự một lượt mua sắm. Bấm loa từng câu, **nói to theo**, rồi bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Just looking, thanks.', pos: 'phr', ipa: '/dʒʌst ˈlʊkɪŋ θæŋks/', vi: 'Em chỉ xem thôi, cảm ơn.', ex: 'Can I help you? — Just looking, thanks.', exVi: 'Tôi giúp gì được không? — Em chỉ xem thôi, cảm ơn.', more: 'Muốn được giúp sau đó: **Actually, could you help me?**' },
          { w: 'Excuse me, do you work here?', pos: 'phr', ipa: '/ɪkˈskjuːz mi du ju ˈwɝːk hɪr/', vi: 'Xin lỗi, anh/chị làm ở đây ạ?', ex: 'Excuse me, do you work here? Where are the jackets?', exVi: 'Xin lỗi, chị làm ở đây ạ? Áo khoác ở đâu ạ?' },
          { w: 'How much is this?', pos: 'phr', ipa: '/haʊ ˈmʌtʃ ɪz ðɪs/', vi: 'Cái này bao nhiêu tiền?', ex: 'How much is this jacket?', exVi: 'Cái áo khoác này bao nhiêu?', more: 'Một món: **is this / is that**. Nhiều món: **are these / are those**.' },
          { w: 'How much are these?', pos: 'phr', ipa: '/haʊ ˈmʌtʃ ɑːr ðiːz/', vi: 'Mấy cái này bao nhiêu?', ex: 'How much are these socks?', exVi: 'Mấy đôi tất này bao nhiêu?', anh: 'socks' },
          { w: 'Is that per month or in total?', pos: 'phr', ipa: '/ɪz ðæt pɝː ˈmʌnθ ɔːr ɪn ˈtoʊtl/', vi: 'Giá đó là mỗi tháng hay tổng cộng?', ex: 'Twelve pounds — is that per month or in total?', exVi: 'Mười hai bảng — mỗi tháng hay tổng cộng ạ?' },
          { w: 'Do you have this in a medium?', pos: 'phr', ipa: '/du ju hæv ðɪs ɪn ə ˈmiːdiəm/', vi: 'Cái này còn cỡ M không?', ex: 'Do you have this in a medium? This one is too big.', exVi: 'Cái này còn cỡ M không ạ? Cái này to quá.', more: 'Anh hay nói: **Have you got this in a medium?** · cỡ: small · medium · large · extra large' },
          { w: 'Do you have it in another colour?', pos: 'phr', ipa: '/du ju hæv ɪt ɪn əˈnʌðər ˈkʌlər/', vi: 'Có màu khác không?', ex: 'I like the style. Do you have it in another colour?', exVi: 'Em thích kiểu này. Có màu khác không ạ?', more: 'Anh viết **colour**, Mỹ viết **color**, đọc như nhau.' },
          { w: 'Can I try it on?', pos: 'phr', ipa: '/kən aɪ ˈtraɪ ɪt ɑːn/', vi: 'Em mặc thử được không?', ex: 'Can I try it on? Where are the changing rooms?', exVi: 'Em mặc thử được không? Phòng thử đồ ở đâu ạ?', anh: 'coat' },
          { w: "It's a bit too small.", pos: 'phr', ipa: '/ɪts ə bɪt tuː ˈsmɔːl/', vi: 'Hơi chật quá.', ex: "It's a bit too small. Do you have a bigger one?", exVi: 'Hơi chật quá. Có cái to hơn không ạ?', more: '**a bit too** + adj = hơi quá… · too big · too long · too tight' },
          { w: "It doesn't fit.", pos: 'phr', ipa: '/ɪt ˈdʌznt ˈfɪt/', vi: 'Không vừa.', ex: "I bought this yesterday, but it doesn't fit.", exVi: 'Em mua cái này hôm qua nhưng nó không vừa.', more: '**fit** = vừa cỡ. **suit** = hợp với người (It really suits you! = Hợp với bạn lắm!)' },
          { w: 'Which one is cheaper?', pos: 'phr', ipa: '/ˈwɪtʃ wʌn ɪz ˈtʃiːpər/', vi: 'Cái nào rẻ hơn?', ex: 'Which one is cheaper, this one or that one?', exVi: 'Cái nào rẻ hơn, cái này hay cái kia?' },
          { w: "What's the difference?", pos: 'phr', ipa: '/wʌts ðə ˈdɪfrəns/', vi: 'Hai cái khác nhau thế nào?', ex: "They look the same. What's the difference?", exVi: 'Trông giống nhau. Khác nhau chỗ nào ạ?' },
          { w: 'Is this on sale?', pos: 'phr', ipa: '/ɪz ðɪs ɑːn ˈseɪl/', vi: 'Cái này có đang giảm giá không?', ex: 'Is this on sale? The sign says 30% off.', exVi: 'Cái này có giảm giá không? Biển ghi giảm 30%.', more: '**on sale** = đang giảm giá. **for sale** = để bán (chưa chắc giảm).', anh: 'label' },
          { w: 'Is that your best price?', pos: 'phr', ipa: '/ɪz ðæt jɔːr ˌbest ˈpraɪs/', vi: 'Đó là giá tốt nhất của anh/chị chưa?', ex: 'A hundred and twenty? Is that your best price?', exVi: 'Một trăm hai mươi ạ? Anh bớt được nữa không?', more: 'Câu mặc cả **lịch sự nhất**: không chê hàng, chỉ hỏi giá.' },
          { w: 'Would you take ninety?', pos: 'phr', ipa: '/wʊd ju ˈteɪk ˈnaɪnti/', vi: 'Chín mươi anh bán không?', ex: "It's a bit scratched. Would you take ninety?", exVi: 'Nó hơi trầy. Chín mươi anh bán không?' },
          { w: 'Could you do eighty?', pos: 'phr', ipa: '/kʊd ju ˈduː ˈeɪti/', vi: 'Anh để tám mươi được không?', ex: 'Could you do eighty if I pay in cash?', exVi: 'Em trả tiền mặt thì anh để tám mươi được không?' },
          { w: "It's a bit out of my budget.", pos: 'phr', ipa: '/ɪts ə bɪt aʊt əv maɪ ˈbʌdʒɪt/', vi: 'Hơi quá khả năng của em.', ex: "I really like it, but it's a bit out of my budget.", exVi: 'Em thích lắm nhưng hơi quá khả năng của em.' },
          { w: "It's a deal.", pos: 'phr', ipa: '/ɪts ə ˈdiːl/', vi: 'Chốt.', ex: "A hundred, and you keep the lock? It's a deal.", exVi: 'Một trăm, anh tặng kèm ổ khoá? Chốt.', more: "**a good deal** = món hời · **That's a good deal.**", anh: 'handshake' },
          { w: "I'll take it.", pos: 'phr', ipa: '/aɪl ˈteɪk ɪt/', vi: 'Em lấy cái này.', ex: "Okay, I'll take it. Can I pay by card?", exVi: 'Được, em lấy. Em trả thẻ được không?', more: 'Nhiều món: **I\'ll take them.** Thôi không mua: **I\'ll think about it, thanks.**' },
          { w: 'Can I pay by card?', pos: 'phr', ipa: '/kən aɪ ˈpeɪ baɪ ˈkɑːrd/', vi: 'Em trả bằng thẻ được không?', ex: 'Can I pay by card, or is it cash only?', exVi: 'Em trả thẻ được không, hay chỉ nhận tiền mặt?', more: 'pay **by** card · pay **in** cash · pay **with** my phone', anh: 'credit-card' },
          { w: 'receipt', pos: 'n', ipa: '/rɪˈsiːt/', vi: 'hoá đơn, biên nhận', ex: 'Could I have a receipt, please?', exVi: 'Cho em xin hoá đơn ạ.', more: 'Chữ **p câm**: rɪ-SIIT, không đọc "ri-xíp".', anh: 'receipt' },
          { w: "I'd like to return this.", pos: 'phr', ipa: '/aɪd ˈlaɪk tə rɪˈtɝːn ðɪs/', vi: 'Em muốn trả lại cái này.', ex: "Hi, I'd like to return this. It doesn't fit.", exVi: 'Chào chị, em muốn trả lại cái này. Nó không vừa.' },
          { w: 'Could I exchange it for a bigger size?', pos: 'phr', ipa: '/kʊd aɪ ɪksˈtʃeɪndʒ ɪt fər ə ˈbɪɡər saɪz/', vi: 'Em đổi sang cỡ to hơn được không?', ex: 'Could I exchange it for a bigger size, please?', exVi: 'Cho em đổi sang cỡ to hơn được không ạ?' },
          { w: 'Could I get a refund?', pos: 'phr', ipa: '/kʊd aɪ ɡet ə ˈriːfʌnd/', vi: 'Em lấy lại tiền được không?', ex: "If you don't have a large, could I get a refund?", exVi: 'Nếu không còn cỡ L thì em lấy lại tiền được không?', more: 'Danh từ **REfund** nhấn âm đầu. Động từ re**FUND** nhấn âm sau.' },
          { w: 'store credit', pos: 'n', ipa: '/ˈstɔːr ˌkredɪt/', vi: 'phiếu mua hàng của cửa hàng (thay vì trả tiền mặt)', ex: 'Without a receipt, we can only give you store credit.', exVi: 'Không có hoá đơn thì bên em chỉ đưa được phiếu mua hàng.' },
          { w: "It's faulty.", pos: 'phr', ipa: '/ɪts ˈfɔːlti/', vi: 'Nó bị lỗi (do nhà sản xuất).', ex: "The left earbud doesn't work. I think it's faulty.", exVi: 'Tai nghe bên trái không chạy. Chắc nó bị lỗi.', more: 'Mỹ hay nói **defective**. Hàng lỗi thì bạn có quyền cao hơn hàng "đổi ý".' },
          { w: 'top up', pos: 'v', ipa: '/ˌtɑːp ˈʌp/', vi: 'nạp tiền (SIM, thẻ đi xe)', ex: 'How do I top up my SIM?', exVi: 'Em nạp tiền SIM thế nào?', more: 'Mỹ hay nói **add money / reload**.', anh: 'mobile-phone' },
          { w: 'cash machine', pos: 'n', ipa: '/ˈkæʃ məˌʃiːn/', vi: 'cây rút tiền (Anh)', ex: 'Is there a cash machine near here?', exVi: 'Gần đây có cây rút tiền không?', more: 'Mỹ, Úc: **ATM** (đọc từng chữ: ây-ti-em).', anh: 'atm-sign' },
        ],
      },

      { t: 'h', text: '3. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Ở cửa hàng, mức **trung tính** là đủ cho gần như mọi lúc. Mức trang trọng dùng khi khiếu nại ở quầy dịch vụ, ngân hàng, hoặc viết email cho cửa hàng.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè, chợ)', 'Trung tính (cửa hàng)', 'Trang trọng (ngân hàng, khiếu nại)'],
        rows: [
          ['Hỏi giá', 'How much?', 'How much is this?', 'Could you tell me how much this costs?'],
          ['Hỏi cỡ', 'Got a medium?', 'Do you have this in a medium?', 'Would you have this in a medium, by any chance?'],
          ['Mặc cả', 'Ninety?', 'Would you take ninety?', 'Is there any flexibility on the price?'],
          ['Từ chối mua', 'Nah, leave it.', "I'll think about it, thanks.", "Thank you, but I'll leave it for now."],
          ['Trả hàng', 'This doesn\'t fit. Can I swap it?', "I'd like to return this, please.", "I'd like to return this item. It doesn't fit."],
          ['Xin hoàn tiền', 'Can I get my money back?', 'Could I get a refund?', "I'd like a full refund, please."],
        ],
        caption: '**Can I get my money back?** không sai nhưng nghe cụt, hợp nói với bạn. Ở quầy, **Could I get a refund?** an toàn hơn.',
      },
      {
        t: 'note',
        title: 'Mặc cả ở đâu thì được?',
        items: [
          '**Được**: chợ đồ cũ, chợ trời, đồ mua lại trên mạng (Facebook Marketplace, Gumtree ở Anh), xe cũ, đôi khi đồ điện tử giá cao.',
          '**Gần như không**: siêu thị, cửa hàng có giá dán, quán cà phê. Hỏi "Can you discount?" ở đây làm nhân viên lúng túng.',
          'Ở cửa hàng có thể hỏi **khéo**: "Is this on sale?" · "Do you have any offers at the moment?" · "Is there a student discount?" Câu cuối rất hay được nhận: nhiều cửa hàng ở Anh giảm giá cho sinh viên.',
          'Mặc cả ở Anh, Mỹ, Úc nhẹ nhàng hơn Việt Nam nhiều: **trả 70–85 % giá** là hợp lý, trả một nửa giá dễ bị coi là xúc phạm.',
        ],
      },

      { t: 'h', text: '4. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Hôm nay có ba khối: **hỏi bao nhiêu** (much hay many), **chỉ món nào** (this, that, these, those), và **so sánh** hai món. Ghép ba khối lại là hỏi được gần hết mọi thứ ở cửa hàng.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'How much + is / are + N?',
            vi: 'Hỏi GIÁ. Một món dùng is, nhiều món dùng are.',
            examples: [
              { en: 'How much is this jacket?', vi: 'Cái áo khoác này bao nhiêu?' },
              { en: 'How much are those socks?', vi: 'Mấy đôi tất kia bao nhiêu?' },
              { en: 'How much is it to change two hundred dollars?', vi: 'Đổi hai trăm đô thì tốn bao nhiêu?' },
            ],
          },
          {
            formula: 'How many + N số nhiều + do / does / is / are…?',
            vi: 'Hỏi SỐ LƯỢNG thứ đếm được: phút, gigabyte, ngày, món.',
            examples: [
              { en: 'How many minutes do I get?', vi: 'Tôi được bao nhiêu phút gọi?' },
              { en: 'How many days does it last?', vi: 'Dùng được bao nhiêu ngày?' },
              { en: 'How many items can I take into the changing room?', vi: 'Tôi được mang mấy món vào phòng thử?' },
            ],
          },
          {
            formula: 'this / that + N số ít · these / those + N số nhiều',
            vi: 'Gần tay: this, these. Xa tay: that, those. Có thể thay N bằng one / ones.',
            examples: [
              { en: 'This one is too small.', vi: 'Cái này chật quá.' },
              { en: 'Are those ones warmer?', vi: 'Mấy cái kia có ấm hơn không?' },
              { en: "I'll take these two.", vi: 'Tôi lấy hai cái này.' },
            ],
          },
          {
            formula: 'adj ngắn + -er + than · more + adj dài + than',
            vi: 'So sánh hai thứ. Tính từ 1 âm tiết (và đuôi -y) thêm -er; tính từ dài dùng more.',
            examples: [
              { en: 'This one is cheaper than that one.', vi: 'Cái này rẻ hơn cái kia.' },
              { en: 'The wool jacket is warmer.', vi: 'Áo len ấm hơn.' },
              { en: 'Unlimited data is more expensive.', vi: 'Dữ liệu không giới hạn đắt hơn.' },
            ],
          },
          {
            formula: 'Which one is + adj-er? · Do you have a + adj-er + one?',
            vi: 'Hỏi chọn giữa hai món, xin một món khác hơn.',
            examples: [
              { en: 'Which one is better for winter?', vi: 'Cái nào hợp mùa đông hơn?' },
              { en: 'Do you have a bigger one?', vi: 'Có cái nào to hơn không?' },
              { en: 'Do you have a cheaper plan?', vi: 'Có gói nào rẻ hơn không?' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['', 'Gần (cầm trên tay)', 'Xa (chỉ tay tới)'],
        rows: [
          ['Một món', 'this (one)', 'that (one)'],
          ['Nhiều món', 'these (ones)', 'those (ones)'],
          ['Hỏi giá', 'How much is this? · How much are these?', 'How much is that? · How much are those?'],
        ],
        caption: '**much** đi với thứ không đếm được (money, data, time). **many** đi với thứ đếm được số nhiều (minutes, days, items). Hỏi giá luôn là **How much**, kể cả khi món đồ đếm được.',
      },
      {
        t: 'table',
        head: ['Tính từ', 'So sánh hơn', 'Quy tắc'],
        rows: [
          ['cheap · warm · long', 'cheaper · warmer · longer', '1 âm tiết: thêm **-er**'],
          ['big · hot', 'bigger · hotter', 'phụ âm – nguyên âm – phụ âm: **gấp đôi** phụ âm cuối'],
          ['easy · heavy', 'easier · heavier', 'đuôi **-y** → **-ier**'],
          ['expensive · comfortable', 'more expensive · more comfortable', '2–3 âm tiết trở lên: **more**'],
          ['good · bad · far', 'better · worse · further', '**bất quy tắc**, phải nhớ'],
        ],
      },
      {
        t: 'rule',
        formula: 'How much is / are + N? · How many + N số nhiều…? · this / that / these / those · adj-er / more + adj + than',
        vi: 'Hỏi giá luôn dùng much. Đếm được số nhiều thì many. Hai món thì so sánh hơn: cheaper, bigger, more expensive, better.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: or · than · instead of',
        items: [
          '**or** đưa lựa chọn: "Do you want a contract **or** pay as you go?" · "Is that per month **or** in total?" Ngữ điệu lên ở lựa chọn đầu, xuống ở lựa chọn cuối.',
          '**than** nối hai vế so sánh: "This one is cheaper **than** that one." Đã có than thì bắt buộc có -er hoặc more đi trước.',
          '**instead of** = thay vì: "Sixty-five **instead of** seventy-nine." · "Can I have a refund **instead of** store credit?"',
          'Ôn lại **but** (Ngày 3): "It\'s cheaper, **but** it isn\'t as warm."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd5-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: 'How much is / are… · How many… · this / that / these / those · adj-er than / more + adj',
        items: [
          { q: 'Mấy cái này bao nhiêu tiền?', hint: 'how much, these', answers: ['How much are these?', 'How much are these ones?', 'How much do these cost?'] },
          { q: 'Tôi được bao nhiêu gigabyte?', hint: 'how many, gigs / gigabytes', answers: ['How many gigs do I get?', 'How many gigabytes do I get?', 'How many GB do I get?', 'How much data do I get?'] },
          { q: 'Cái này rẻ hơn cái kia.', hint: 'this one, cheaper, that one', answers: ['This one is cheaper than that one.', "This one's cheaper than that one.", 'This is cheaper than that one.', 'This is cheaper than that.'] },
          { q: 'Có cái nào to hơn không ạ?', hint: 'bigger one', answers: ['Do you have a bigger one?', 'Have you got a bigger one?', 'Do you have a bigger size?', 'Do you have one in a bigger size?'] },
          { q: 'Gói không giới hạn đắt hơn, nhưng lợi hơn.', hint: 'unlimited plan, more expensive, but, a better deal', answers: ["The unlimited plan is more expensive, but it's a better deal.", 'The unlimited plan is more expensive, but it is a better deal.', "The unlimited one is more expensive, but it's a better deal.", "The unlimited plan is more expensive but it's a better deal."] },
        ],
      },

      { t: 'h', text: '5. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~How many money?~~ → **How much is it?** Tiền là không đếm được trong tiếng Anh, nên dùng **much**. Và hỏi giá thì không cần nhắc chữ money.',
          '~~How much is these?~~ → **How much are these?** these, those là số nhiều, phải đi với **are**.',
          '~~This one is more cheaper.~~ → **This one is cheaper.** Đã có -er thì không thêm more. Chỉ dùng một trong hai.',
          '~~It is cheap than that one.~~ → **It\'s cheaper than that one.** Có than thì tính từ phải ở dạng so sánh.',
          '~~Can you discount for me?~~ → **Is that your best price?** / **Could you do eighty?** discount ít khi là động từ trong câu nói thường. Câu dịch thẳng "giảm giá cho em" nghe rất lạ.',
          '~~I want to give back this.~~ → **I\'d like to return this.** "give back" dùng cho đồ mượn của người khác. Trả hàng cho cửa hàng dùng **return**.',
          '~~This shirt is not fit me.~~ → **This shirt doesn\'t fit (me).** fit là động từ, phủ định cần **doesn\'t**.',
          '~~Sale 50%.~~ (đọc "xêu năm mươi phần trăm") → **It\'s fifty percent off.** / **It\'s half price.** Giảm bao nhiêu thì nói **… off**.',
        ],
      },

      { t: 'h', text: '6. 🙋 Ngôn ngữ cơ thể khi mua bán' },
      {
        t: 'p',
        text: 'Ở cửa hàng, tay và mắt nói nhiều hơn bạn nghĩ: chỉ món hàng, đưa tiền, từ chối nhân viên. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi mua sắm',
        items: [
          { anh: 'backhand-index-pointing-down', w: 'How much is this one?', ro: '/haʊ ˈmʌtʃ ɪz ðɪs wʌn/', vi: 'Chỉ vào **món hàng** bằng ngón trỏ thì không sao. Ngày 1 đã học: chỉ vào **người** mới bất lịch sự.' },
          { anh: 'index-pointing-up', w: 'Just one, please.', ro: '/dʒʌst ˈwʌn pliːz/', vi: 'Giơ một ngón = "một cái". Ở Đức, Pháp người ta giơ **ngón cái** cho số 1, nên nhân viên ở châu Âu có thể đưa bạn 2 món khi bạn giơ ngón cái và ngón trỏ.' },
          { anh: 'raised-hand', w: 'Just looking, thanks.', ro: '/dʒʌst ˈlʊkɪŋ θæŋks/', vi: 'Mỉm cười, giơ nhẹ lòng bàn tay khi nói câu này. Không cần lắc đầu, không cần bỏ đi.' },
          { anh: 'thinking-face', w: "Hmm, I'll think about it.", ro: '/aɪl ˈθɪŋk əˌbaʊt ɪt/', vi: 'Ngừng một chút, nghiêng đầu khi mặc cả. Im lặng vài giây hiệu quả hơn nói nhiều.' },
          { anh: 'handshake', w: "Okay, it's a deal.", ro: '/ɪts ə ˈdiːl/', vi: 'Mua đồ cũ với người lạ, chốt giá xong hay bắt tay. Ở cửa hàng thì không.' },
          { anh: 'credit-card', w: 'Contactless is fine.', ro: '/ˈkɑːntæktləs ɪz faɪn/', vi: 'Ở Anh, Úc gần như mọi nơi chạm thẻ hoặc điện thoại. Chạm rồi **chờ tiếng bíp**, đừng rút thẻ ngay.' },
          { anh: 'folded-hands', w: 'Here you are.', ro: '/ˈhɪr ju ɑːr/', vi: 'Ở Việt Nam, Nhật, Hàn đưa tiền **bằng hai tay** là lễ phép. Ở Anh, Mỹ đưa một tay là bình thường, hai tay cũng không ai phiền.' },
          { anh: 'person-gesturing-no', w: "No, thanks. I'm fine.", ro: '/noʊ θæŋks aɪm faɪn/', vi: 'Từ chối túi nilon, thẻ thành viên: nói kèm lắc đầu nhẹ và mỉm cười. Ở Nhật thường **xua tay trước mặt** để nói không.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Mặc cả', 'Thường gặp ở chợ, cửa hàng nhỏ.', 'Chỉ ở chợ đồ cũ, đồ mua lại, xe cũ. Nhẹ nhàng, không ép.', 'Gần như không mặc cả.'],
          ['Nhân viên', 'Hay đi theo khách, giới thiệu nhiều.', 'Chào một câu rồi để khách tự xem. Cần thì gọi.', 'Chào to "irasshaimase", không đi theo sát.'],
          ['Đưa tiền', 'Đưa tận tay, hai tay với người lớn tuổi.', 'Đưa một tay hoặc đặt lên quầy.', 'Đặt tiền vào **khay nhỏ** trên quầy, không đưa tận tay.'],
          ['Tiền thối', 'Đếm lại trước mặt là bình thường.', 'Nhìn nhanh là đủ. Đếm lâu ở quầy làm người sau phải chờ.', 'Nhân viên tự đếm cho bạn xem.'],
          ['Đổi trả', 'Tuỳ cửa hàng, nhiều nơi không đổi.', 'Đổi trả phổ biến, có chính sách rõ (thường 14–30 ngày).', 'Đổi được nhưng ít khi đổi vì "đổi ý".'],
        ],
        caption: 'Đọc **chính sách đổi trả** dán ở quầy hoặc in sau hoá đơn trước khi mua. Bài Đọc hôm nay luyện đúng việc này.',
      },

      { t: 'h', text: '7. Phát âm: this / these, chữ câm, đuôi -er' },
      {
        t: 'p',
        text: '**this** có âm /ɪ/ ngắn, **these** có /iː/ dài và kết thúc bằng /z/. Đọc lẫn hai từ này là người bán đưa nhầm số lượng. Đuôi **-er** trong cheaper, bigger đọc rất nhẹ /ər/, không đọc thành "chíp-pơ" rõ từng chữ. **receipt** có p câm.',
      },
      {
        t: 'phatam',
        id: 'gtd5-phat-am',
        title: 'Luyện phát âm — this / these, chữ câm, so sánh hơn',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nhấn rõ từ mang thông tin (giá, cỡ, màu); các từ nhỏ is, a, to đọc lướt.',
        items: [
          { text: 'How much is this?', ipa: 'haʊ mʌtʃ ɪz ðɪs', vi: 'nối: much‿is · this /ɪ/ ngắn, /s/ cuối' },
          { text: 'How much are these?', ipa: 'haʊ mʌtʃ ər ðiːz', vi: 'these /iː/ kéo dài, /z/ cuối rung · are đọc nhẹ /ər/' },
          { text: 'This one is cheaper.', ipa: 'ðɪs wʌn ɪz tʃiːpər', vi: 'cheaper: nhấn CHEA, đuôi -er nhẹ /pər/' },
          { text: 'Could I have a receipt, please?', ipa: 'kʊd aɪ hæv ə rɪsiːt pliːz', vi: 'receipt = rɪ-SIIT, chữ p câm' },
          { text: 'Do you have this in a medium?', ipa: 'du ju hæv ðɪs ɪn ə miːdiəm', vi: 'nối: this‿in‿a, nghe như "đi-xi-nơ"' },
          { text: 'Would you take ninety?', ipa: 'wʊd ju teɪk naɪnti', vi: 'would you nối thành /wʊdʒu/ · ninety nhấn NIN' },
          { text: "I'd like to return this.", ipa: 'aɪd laɪk tə rɪtɝːn ðɪs', vi: 'return nhấn âm sau: re-TURN · to đọc nhẹ /tə/' },
          { text: "It's more expensive than that one.", ipa: 'ɪts mɔːr ɪkspensɪv ðən ðæt wʌn', vi: 'expensive nhấn PEN · than đọc nhẹ /ðən/' },
        ],
      },

      { t: 'h', text: '8. Nhập vai: mua xe đạp cũ qua mạng' },
      {
        t: 'canh',
        anh: ['bicycle', 'man-student', 'man-office-worker', 'pound-banknote', 'handshake'],
        caption: 'Đi làm bằng tàu điện ngầm ở London tốn tiền, nên Phong tìm mua một chiếc **xe đạp cũ** trên một trang rao vặt. Tin rao ghi **£120**. Phong hẹn gặp người bán, anh **Rob**, để xem xe.',
      },
      {
        t: 'dialogue',
        title: 'Xem xe và mặc cả',
        lines: [
          { who: 'Phong', role: 'a', text: "Hi, are you Rob? I'm Phong. I messaged you about the bike.", vi: 'Chào anh, anh là Rob phải không? Em là Phong. Em nhắn anh về chiếc xe đạp.' },
          { who: 'Rob', role: 'b', text: "Yeah, hi! Here it is. It's about three years old, but it rides really well.", vi: 'Ừ, chào em! Xe đây. Khoảng ba năm tuổi, nhưng đi êm lắm.' },
          { who: 'Phong', role: 'a', text: 'Can I try it?', vi: 'Em đi thử được không?' },
          { who: 'Rob', role: 'b', text: 'Sure, go for it.', vi: 'Được, cứ thử đi.' },
          { who: 'Phong', role: 'a', text: "It's nice. But the back brake is a bit loose, and there are some scratches here.", vi: 'Xe được đấy. Nhưng phanh sau hơi lỏng, và chỗ này có mấy vết trầy.' },
          { who: 'Rob', role: 'b', text: "Yeah, the brake needs a small fix. It's easy, though.", vi: 'Ừ, phanh cần chỉnh lại chút. Dễ thôi mà.' },
          { who: 'Phong', role: 'a', text: 'The ad says a hundred and twenty. Is that your best price?', vi: 'Tin rao ghi một trăm hai mươi. Đó là giá tốt nhất của anh chưa?' },
          { who: 'Rob', role: 'b', text: 'What were you thinking?', vi: 'Em định trả bao nhiêu?' },
          { who: 'Phong', role: 'a', text: "Would you take ninety? I'm a student, and I can pay in cash right now.", vi: 'Chín mươi anh bán không? Em là sinh viên, và em trả tiền mặt luôn.' },
          { who: 'Rob', role: 'b', text: 'Ninety is a bit low. I could do a hundred and ten.', vi: 'Chín mươi hơi thấp. Anh để một trăm mười được.' },
          { who: 'Phong', role: 'a', text: "Hmm. How about a hundred? And I fix the brake myself.", vi: 'Hừm. Một trăm thì sao anh? Phanh em tự sửa.' },
          { who: 'Rob', role: 'b', text: "Go on, then. A hundred, and I'll throw in the lock.", vi: 'Thôi được. Một trăm, anh tặng kèm ổ khoá.' },
          { who: 'Phong', role: 'a', text: "It's a deal! Here you are: five twenties.", vi: 'Chốt! Tiền đây ạ: năm tờ hai mươi.' },
          { who: 'Rob', role: 'b', text: 'Cheers. Enjoy the bike, and wear a helmet!', vi: 'Cảm ơn nhé. Đi xe vui vẻ, nhớ đội mũ bảo hiểm!' },
        ],
      },
      {
        t: 'note',
        title: 'Vì sao Phong mặc cả được',
        items: [
          '**Chỉ ra lý do có thật** (phanh lỏng, vết trầy) chứ không chê bừa. Người bán dễ nhận lời hơn.',
          '**Đưa điều kiện có lợi cho người bán**: trả tiền mặt, lấy luôn, tự sửa phanh.',
          '**Gặp nhau ở giữa**: 120 → Phong 90 → Rob 110 → Phong 100. Hai bên đều thấy mình được một chút.',
          '"**Go on, then.**" (Anh) = thôi được rồi, anh đồng ý. "**I\'ll throw in…**" = anh tặng kèm.',
          'An toàn khi mua đồ cũ qua mạng: hẹn ở **nơi đông người**, xem kỹ hàng trước khi trả tiền, đừng chuyển tiền trước cho người lạ.',
        ],
      },
      {
        t: 'build',
        id: 'gtd5-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Phong (5 câu)',
        items: [
          { vi: 'Rob: "Here it is." → Bạn: Em đi thử được không?', chips: ['Can', 'I', 'try', 'it?', 'on', 'test'], answer: ['Can', 'I', 'try', 'it?'] },
          { vi: 'Bạn: Phanh sau hơi lỏng.', chips: ['The', 'back', 'brake', 'is', 'a', 'bit', 'loose.', 'very', 'are'], answer: ['The', 'back', 'brake', 'is', 'a', 'bit', 'loose.'] },
          { vi: 'Bạn: Đó là giá tốt nhất của anh chưa?', chips: ['Is', 'that', 'your', 'best', 'price?', 'good', 'cheap'], answer: ['Is', 'that', 'your', 'best', 'price?'] },
          { vi: 'Bạn: Chín mươi anh bán không?', chips: ['Would', 'you', 'take', 'ninety?', 'nineteen?', 'make'], answer: ['Would', 'you', 'take', 'ninety?'] },
          { vi: 'Rob: "A hundred, and I\'ll throw in the lock." → Bạn: Chốt!', chips: ["It's", 'a', 'deal!', 'the', 'done'], answer: ["It's", 'a', 'deal!'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd5-noi-tra-loi',
        part: '1',
        questions: [
          'Hi there! Can I help you with anything?',
          "We don't have the blue one in your size. Would you like the black one instead?",
          'Would you like an exchange or a refund?',
          "It's eighty pounds. That's already a good price, you know.",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay**, dán đề bài dưới đây rồi nói bằng giọng của bạn. Làm **2 lượt**.',
          '"You are Sam, a friendly British shop assistant in a clothes shop in London. I am a Vietnamese intern. I bought a jacket here three days ago, but it is too small. Ask me what the problem is, ask for the receipt, and tell me you have my size only in a different colour, which is a bit more expensive. Let me choose between an exchange, a refund, and store credit. Use A2-level English and short sentences. If I use \"How many\" for prices or forget \"than\" in a comparison, correct me gently. After 8 turns, tell me in Vietnamese two things I did well and two things to fix."',
          'Lượt hai: AI là người bán một chiếc laptop cũ giá £300 trên mạng, bạn mặc cả xuống khoảng £250 bằng **Is that your best price? · Would you take…? · How about…?**',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd5-doc',
    kind: 'reading',
    title: 'Hoá đơn, chính sách đổi trả, khuyến mãi',
    goal: 'Đọc hiểu một hoá đơn mua hàng ở Anh, chính sách đổi trả in sau hoá đơn, một email khuyến mãi và các biển giảm giá trong siêu thị; tính đúng số tiền phải trả.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn mẩu chữ **thật** Phong gặp trong tuần đầu ở London: **hoá đơn**, **chính sách đổi trả**, **email khuyến mãi**, **biển giá trong siêu thị**.',
          'Đọc để trả lời được ba câu: **mình trả bao nhiêu? được trả lại không? khuyến mãi có điều kiện gì?**',
          'Chữ nhỏ (fine print) là chỗ hay có bẫy: **up to**, **selected lines**, **exclusions apply**, **while stocks last**.',
          'Cuối bài có 5 câu **tính tiền** từ khuyến mãi. Ôn lại số và giá của Ngày 2.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['receipt', 'shopping-bags', 'e-mail', 'label', 'shopping-cart'],
        caption: 'Tối Chủ nhật, Phong ngồi xem lại **hoá đơn** mua áo, đọc **chính sách đổi trả**, mở email của cửa hàng và nhớ lại mấy biển giá ở siêu thị.',
      },
      {
        t: 'passage',
        title: "Phong's week — a receipt, a policy, an email and some signs",
        intro: 'Đọc chậm một lượt, chưa cần tra từ. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**RECEIPT** — NORTHGATE · Oxford Street, London · Sat 10 Oct 2026, 15:42 · Wool jacket, navy, M … £79.00 · Cotton T-shirt, grey ×2 @ £12.00 … £24.00 · Socks (3 pairs) @ £5.00 … £15.00 · **Offer: 3 for 2 socks** … −£5.00 · SUBTOTAL £118.00 · **SAVINGS** −£5.00 · **TOTAL £113.00** · **VAT included** £18.83 · Paid by **contactless** VISA ****4821 · Items: 6 · **Please keep your receipt.**',
          },
          {
            label: 'B',
            text: '**RETURNS POLICY** — **Changed your mind?** Return unworn items with **tags attached** within **28 days** with **proof of purchase** for a **full refund** to your **original payment method**. **Without a receipt**, we can offer an exchange or **store credit** at the current price. **Sale items**: exchange or store credit only. For **hygiene reasons**, we cannot accept returns of underwear or earrings. **Faulty items**: please speak to a member of staff. Refunds can take **up to 5 working days** to appear. **This does not affect your statutory rights.**',
          },
          {
            label: 'C',
            text: '**EMAIL** — From: NORTHGATE Members · Subject: **Early access starts now** 🎉 · Hi Phong, as a member, you can shop our winter sale **before everyone else**. Get **up to 50% off selected lines**, plus an **extra 10% off** with code **EARLY10**. **Ends midnight Sunday.** **Free delivery on orders over £50.** **Exclusions apply.** See full T&Cs online. · Unsubscribe',
          },
          {
            label: 'D',
            text: '**SIGNS IN A SUPERMARKET** — ① **Buy one, get one free** — orange juice 1 L · ② **2 for £3** — bread rolls (£1.80 each) · ③ **Reduced to clear** — sandwiches, now 75p · ④ **Was £4.00, now £2.50** — coffee beans · ⑤ **Card only. No cash.** — self-checkout · ⑥ **Price per 100 g: 42p** — rice',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd5-doc-hieu',
        title: 'Hiểu ý và chữ nhỏ (8 câu)',
        items: [
          {
            q: 'Theo hoá đơn (A), "VAT included £18.83" nghĩa là gì?',
            options: ['Phong phải trả thêm £18,83', 'Trong £113 đã có £18,83 tiền thuế', 'Phong được giảm £18,83', 'Phí giao hàng là £18,83'],
            correct: 1,
            why: 'Ở Anh giá đã **gồm thuế VAT**. Hoá đơn chỉ ghi ra trong tổng tiền có bao nhiêu là thuế. Phong không trả thêm gì.',
          },
          {
            q: 'Khuyến mãi "3 for 2" ở tất cho Phong lợi bao nhiêu?',
            options: ['Không lợi gì', '£5 — một đôi miễn phí', '£10', '£15'],
            correct: 1,
            why: '**3 for 2** = mua 3 trả tiền 2. Mỗi đôi £5, nên đôi thứ ba miễn phí: −£5.00.',
          },
          {
            q: 'Phong mua áo ngày 10/10. Muốn được hoàn tiền vì "đổi ý", hạn chót là khi nào?',
            options: ['17/10', '24/10', '7/11', 'Không có hạn'],
            correct: 2,
            why: '**within 28 days**: 10/10 + 28 ngày = 7/11 (tháng 10 có 31 ngày). Kèm điều kiện: chưa mặc, còn nhãn, có hoá đơn.',
          },
          {
            q: 'Không có hoá đơn thì cửa hàng (B) cho Phong gì?',
            options: ['Hoàn tiền đầy đủ', 'Không giúp gì', 'Đổi hàng hoặc phiếu mua hàng theo giá hiện tại', 'Hoàn tiền mặt'],
            correct: 2,
            why: '"**Without a receipt**, we can offer an **exchange or store credit at the current price**." Giá hiện tại có thể thấp hơn giá bạn đã trả nếu đang giảm giá.',
          },
          {
            q: '"This does not affect your statutory rights." Câu này muốn nói gì?',
            options: ['Cửa hàng không chịu trách nhiệm', 'Quyền theo luật của bạn vẫn giữ nguyên, chính sách này là thêm', 'Bạn phải ký giấy tờ', 'Chỉ áp dụng cho người Anh'],
            correct: 1,
            why: '**statutory rights** = quyền luật định. Ở Anh, hàng **lỗi** được luật bảo vệ. Còn trả hàng vì **đổi ý** ở cửa hàng là lòng tốt của cửa hàng theo chính sách riêng.',
          },
          {
            q: 'Email (C) ghi "up to 50% off selected lines". Phong nên hiểu thế nào?',
            options: ['Mọi món đều giảm 50 %', 'Chỉ một số món được giảm, mức giảm cao nhất là 50 %', 'Giảm 50 % cho thành viên', 'Giảm 50 % khi mua trên £50'],
            correct: 1,
            why: '**up to** = tối đa. **selected lines** = một số mặt hàng được chọn. Phần lớn món có thể chỉ giảm 10–20 %.',
          },
          {
            q: 'Biển ③ "Reduced to clear" thường gặp ở đâu và nghĩa là gì?',
            options: ['Hàng mới về', 'Hàng giảm giá để bán hết, thường sắp hết hạn', 'Hàng lỗi không bán', 'Hàng chỉ dành cho thành viên'],
            correct: 1,
            why: '**Reduced to clear** = hạ giá để bán cho hết. Ở siêu thị Anh, đồ ăn sắp hết hạn được dán nhãn này, hay có vào buổi tối.',
          },
          {
            q: 'Phong chỉ có tiền mặt. Biển nào là tin xấu cho Phong?',
            options: ['①', '③', '⑤', '⑥'],
            correct: 2,
            why: '⑤ **Card only. No cash.** Nhiều quầy tự thanh toán ở Anh chỉ nhận thẻ. Đó là lý do Phong cần cả tiền mặt lẫn thẻ.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp trên hoá đơn và biển giảm giá' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['proof of purchase', 'bằng chứng đã mua (hoá đơn, email, sao kê thẻ)', 'Chính sách đổi trả'],
          ['tags attached', 'còn nguyên nhãn mác', 'Chính sách đổi trả'],
          ['original payment method', 'trả về đúng cách bạn đã trả (thẻ nào về thẻ đó)', 'Chính sách đổi trả'],
          ['store credit', 'phiếu mua hàng của cửa hàng', 'Chính sách đổi trả'],
          ['up to … off', 'giảm tối đa …', 'Email, biển quảng cáo'],
          ['selected lines · exclusions apply', 'một số mặt hàng · có ngoại lệ', 'Chữ nhỏ khuyến mãi'],
          ['while stocks last', 'tới khi hết hàng', 'Khuyến mãi'],
          ['buy one, get one free (BOGOF)', 'mua một tặng một', 'Siêu thị Anh'],
          ['3 for 2 · 2 for £3', 'mua 3 trả 2 · 2 món giá £3', 'Siêu thị, hiệu thuốc'],
          ['T&Cs (terms and conditions)', 'điều khoản và điều kiện', 'Cuối email, quảng cáo'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc khuyến mãi không bị "lừa"',
        items: [
          'Gặp **up to** thì nghĩ "**có thể ít hơn nhiều**". Gặp **from £9** thì nghĩ "món rẻ nhất mới là £9".',
          '**Ends midnight Sunday** = hết hạn lúc 0 giờ đêm Chủ nhật, theo **giờ Anh**. Đặt hàng từ Việt Nam thì đổi giờ trước.',
          'Tính **giá mỗi đơn vị** (price per 100 g, per litre) khi so hai gói. Gói to không phải lúc nào cũng rẻ hơn.',
          'Email khuyến mãi luôn có **Unsubscribe** ở cuối: bấm vào đó để hủy đăng ký nhận thư. Đừng bấm link lạ hỏi mật khẩu, thẻ ngân hàng.',
        ],
      },

      { t: 'h', text: '3. Tính tiền' },
      {
        t: 'quiz',
        id: 'gtd5-doc-tinh-tien',
        title: 'Phong phải trả bao nhiêu? Gõ số (5 câu)',
        kind: 'fill',
        items: [
          { q: 'Bread rolls "2 for £3". Phong mua 2 cái. Phong trả £___', answers: ['3', '3.00', '£3', '£3.00'] },
          { q: 'Bread rolls "2 for £3", giá lẻ £1.80 một cái. Mua 2 cái theo khuyến mãi thì tiết kiệm được bao nhiêu xu (pence)? ___p', answers: ['60', '60p'] },
          { q: 'Orange juice £2.20, "Buy one, get one free". Phong lấy 2 chai. Phong trả £___', answers: ['2.20', '£2.20'] },
          { q: 'Coffee beans "Was £4.00, now £2.50". Phong mua 2 gói. Phong trả £___', answers: ['5', '5.00', '£5', '£5.00'] },
          { q: 'Giỏ hàng online £48. "Free delivery on orders over £50". Phong có được miễn phí giao hàng không? (yes / no)', answers: ['no', 'No'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd5-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 5',
    goal: 'Làm 35 câu có đáp án để nhớ chắc cách hỏi giá, hỏi cỡ, so sánh, mặc cả và đổi trả, kèm ôn lại gọi món của Ngày 4.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 35 câu**: chọn câu hợp cảnh · điền much / many / this / these / so sánh · dịch · nghe chép · ghép câu.',
          'Có vài câu **ôn Ngày 1–4** (chào, hỏi lại, gọi món) xen vào. Gặp thì đừng lật lại bài.',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **28/35** trở lên là sẵn sàng sang Ngày 6.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd5-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn vào cửa hàng, nhân viên hỏi "Can I help you?" nhưng bạn chỉ muốn xem. Bạn nói:',
            options: ['No.', 'Just looking, thanks.', "Don't help me.", 'I see only.'],
            correct: 1,
            why: '**Just looking, thanks.** Ngắn, lịch sự, ai cũng hiểu. "No." trơ trọi nghe cộc.',
          },
          {
            q: 'Bạn cầm hai đôi giày trên tay và muốn hỏi giá. Bạn nói:',
            options: ['How much is these?', 'How many are these?', 'How much are these?', 'How much money these?'],
            correct: 2,
            why: 'Nhiều món, gần tay: **these** + **are**. Hỏi giá luôn là **How much**.',
          },
          {
            q: 'Áo hơi chật. Bạn hỏi nhân viên:',
            options: ['Do you have a bigger one?', 'Do you have a more big one?', 'Is there big?', 'Give me big size.'],
            correct: 0,
            why: '**big → bigger** (gấp đôi g). Không dùng "more big".',
          },
          {
            q: 'Ở chợ đồ cũ, người bán nói "Forty pounds". Bạn muốn mặc cả lịch sự:',
            options: ['Too expensive! Twenty!', 'Can you discount?', 'Is that your best price?', 'I want cheap.'],
            correct: 2,
            why: '**Is that your best price?** hỏi khéo, không chê hàng. Câu A nghe gay gắt, câu B là kiểu dịch thẳng.',
          },
          {
            q: 'Bạn muốn trả lại tai nghe vì bên trái không có tiếng. Bạn nói:',
            options: ["I'd like to return these. The left side doesn't work.", 'I want to give back.', 'This is bad quality. Money back!', 'I changed my mind.'],
            correct: 0,
            why: 'Nêu việc muốn làm (**return**) + vấn đề cụ thể. Tai nghe lỗi thì đừng nói "I changed my mind": đổi ý và hàng lỗi được xử lý khác nhau.',
          },
          {
            q: 'Máy quẹt thẻ ở Anh hỏi: "Pay in GBP or VND?" Bạn nên chọn:',
            options: ['VND, cho dễ biết giá', 'GBP', 'Cái nào cũng như nhau', 'Huỷ, trả tiền mặt'],
            correct: 1,
            why: 'Chọn tiền **nước sở tại** (GBP = bảng Anh). Chọn VND thì máy tự quy đổi với tỷ giá thường bất lợi.',
          },
          {
            q: 'Nhân viên nói: "It\'s twelve quid." Bạn phải trả:',
            options: ['£2', '£12', '£20', '$12'],
            correct: 1,
            why: '**quid** = pound (lóng Anh). Twelve quid = £12.',
          },
          {
            q: 'Bạn muốn biết gói SIM được bao nhiêu phút gọi:',
            options: ['How much minutes?', 'How many minutes do I get?', 'How many minute do I get?', 'How long minutes?'],
            correct: 1,
            why: 'minutes đếm được, số nhiều → **How many minutes**.',
          },
          {
            q: '(Ôn Ngày 4) Ở quán, bạn muốn gọi một ly cà phê. Câu nào tự nhiên nhất?',
            options: ['I want a coffee.', 'Give me a coffee.', 'Could I have a coffee, please?', 'One coffee for me now.'],
            correct: 2,
            why: '**Could I have…, please?** (Ngày 4). "I want" nghe như đòi.',
          },
          {
            q: '(Ôn Ngày 2) Nhân viên nói giá nhanh quá, bạn không chắc là 15 hay 50. Bạn nói:',
            options: ['What?', 'Sorry, fifteen or fifty?', 'Speak again.', 'Repeat the money.'],
            correct: 1,
            why: 'Hỏi kiểu lựa chọn (Ngày 2): **Sorry, fifteen or fifty?** Người kia sẽ nhấn rõ âm.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền much / many / this / these / so sánh' },
      {
        t: 'quiz',
        id: 'gtd5-bt-dien',
        title: 'Phần II — Điền một từ (8 câu)',
        kind: 'fill',
        grammar: 'How much / How many · this / that / these / those · adj-er / more + adj + than',
        items: [
          { q: 'How ___ is this scarf?', answers: ['much'] },
          { q: 'How ___ days does the SIM last?', answers: ['many'] },
          { q: 'How much are ___ shoes? (đang cầm trên tay)', answers: ['these'] },
          { q: 'Can I see ___ bag over there, please? (một cái, ở xa)', answers: ['that'] },
          { q: 'The wool jacket is ___ than the cotton one. (warm)', answers: ['warmer'] },
          { q: 'The unlimited plan is ___ expensive than the basic one.', answers: ['more'] },
          { q: 'This shop is ___ than the one on Regent Street. (good)', answers: ['better'] },
          { q: 'This one is cheaper ___ that one.', answers: ['than'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd5-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'How much… · Do you have this in… · I\'d like to return… · Could I…? · adj-er',
        items: [
          { q: 'Cái này còn cỡ M không ạ?', hint: 'have this in a medium', answers: ['Do you have this in a medium?', 'Have you got this in a medium?', 'Do you have this in medium?', 'Do you have this in a medium size?', 'Do you have this in size M?'] },
          { q: 'Em mặc thử được không?', hint: 'try it on', answers: ['Can I try it on?', 'Could I try it on?', 'Can I try this on?', 'Could I try this on?'] },
          { q: 'Em muốn trả lại cái này.', hint: "I'd like to, return", answers: ["I'd like to return this.", 'I would like to return this.', "I'd like to return this, please.", 'I would like to return this, please.'] },
          { q: 'Em lấy lại tiền được không ạ?', hint: 'could, refund', answers: ['Could I get a refund?', 'Could I have a refund?', 'Can I get a refund?', 'Can I have a refund?', 'Could I get a refund, please?', 'Could I have a refund, please?'] },
          { q: 'Em trả bằng thẻ được không?', hint: 'pay by card', answers: ['Can I pay by card?', 'Could I pay by card?', 'Can I pay by card, please?', 'Could I pay by card, please?'] },
          { q: 'Hơi quá khả năng của em.', hint: 'a bit out of my budget', answers: ["It's a bit out of my budget.", 'It is a bit out of my budget.', "That's a bit out of my budget.", 'That is a bit out of my budget.'] },
          { q: 'Cái nào ấm hơn, cái này hay cái kia?', hint: 'which one, warmer, or', answers: ['Which one is warmer, this one or that one?', "Which one's warmer, this one or that one?", 'Which is warmer, this one or that one?', 'Which one is warmer, this or that?'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd5-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: 'Is that per month or in total?', answer: 'Is that per month or in total?' },
          { label: 'Câu 2', spell: 'The navy one is sold out in a large.', answer: 'The navy one is sold out in a large.', alt: ["The navy one's sold out in a large."] },
          { label: 'Câu 3', spell: 'Would you take ninety?', answer: 'Would you take ninety?', alt: ['Would you take 90?'] },
          { label: 'Câu 4', spell: 'Without a receipt, we can only give you store credit.', answer: 'Without a receipt, we can only give you store credit.', alt: ['Without a receipt we can only give you store credit.'] },
          { label: 'Câu 5', spell: 'Is there a cash machine near here?', answer: 'Is there a cash machine near here?', alt: ['Is there a cash machine near here'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd5-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Mấy đôi tất kia bao nhiêu tiền?', chips: ['How', 'much', 'are', 'those', 'socks?', 'many', 'is', 'that'], answer: ['How', 'much', 'are', 'those', 'socks?'] },
          { vi: 'Em đổi sang cỡ to hơn được không ạ?', chips: ['Could', 'I', 'exchange', 'it', 'for', 'a', 'bigger', 'size?', 'more', 'big'], answer: ['Could', 'I', 'exchange', 'it', 'for', 'a', 'bigger', 'size?'] },
          { vi: 'Gói này rẻ hơn gói kia.', chips: ['This', 'plan', 'is', 'cheaper', 'than', 'that', 'one.', 'more', 'then'], answer: ['This', 'plan', 'is', 'cheaper', 'than', 'that', 'one.'] },
          { vi: 'Áo này hơi chật ở vai.', chips: ["It's", 'a', 'bit', 'tight', 'across', 'the', 'shoulders.', 'very', 'on'], answer: ["It's", 'a', 'bit', 'tight', 'across', 'the', 'shoulders.'] },
          { vi: 'Cho em ít tờ năm và tờ mười nhé.', chips: ['Could', 'I', 'have', 'some', 'fives', 'and', 'tens,', 'please?', 'any', 'five'], answer: ['Could', 'I', 'have', 'some', 'fives', 'and', 'tens,', 'please?'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Lấy một món đồ trong phòng (áo, tai nghe, chai nước). Tự đóng vai **trả hàng** 4 bước to thành tiếng: vấn đề → hoá đơn → muốn gì → hỏi bước tiếp.',
          'So sánh hai món đồ của bạn bằng 3 câu có **-er / more … than**. Ví dụ: "My phone is older than my laptop."',
          'Ngày 6: hỏi đường, gọi xe, sân bay, khách sạn, rồi **kiểm tra chặng 1** gom cả Ngày 1–6.',
        ],
      },
    ],
  },
];
