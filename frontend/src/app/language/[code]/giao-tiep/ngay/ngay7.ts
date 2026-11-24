/**
 * Tiếng Anh giao tiếp — NGÀY 7 (chặng 2 "Đời sống", A2+ → B1): hiệu thuốc & bác sĩ.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd7-`.
 * Ngữ pháp trong câu: have (got) + triệu chứng · should / shouldn't · for + khoảng thời gian (since + mốc) · nối câu bằng `when`.
 * Cảnh: Khôi — sinh viên IT năm 3 — thực tập hai tháng ở văn phòng khách hàng tại Manchester (Anh) thì bị đau bụng:
 * hiệu thuốc (hiểu lầm "I've been sick"), gọi phòng khám GP lúc 8 giờ sáng (xếp hàng, hẹn bác sĩ gọi lại), gặp bác sĩ.
 * Khác podcast en-ds-a2-02 (Liên đau họng + nhức đầu, viên uống 6 tiếng, kẹo ngậm, phòng khám bên cạnh): ở đây là đau bụng,
 * gói bù nước, thuốc mang từ Việt Nam, kháng sinh phải có đơn, đăng ký GP, xếp hàng điện thoại, nghỉ làm 48 giờ, tự khai nghỉ ốm.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_7: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd7-nghe',
    kind: 'listening',
    title: 'Hiệu thuốc & bác sĩ: mô tả triệu chứng',
    goal: 'Nghe hiểu dược sĩ, lễ tân phòng khám và bác sĩ hỏi gì về triệu chứng, dặn uống thuốc thế nào, khi nào phải đi khám, và không hiểu lầm chữ "sick" kiểu Anh.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Chào mừng bạn sang **chặng 2 — Đời sống**. Câu dài hơn, người nói nhanh hơn chặng 1 một chút (khoảng 140 từ/phút), và có những câu họ nói **không đúng nghĩa đen**.',
          'Bạn theo chân **Khôi**, sinh viên IT năm 3, đang thực tập hai tháng ở văn phòng khách hàng tại **Manchester** (Anh). Tối thứ Hai Khôi ăn đồ mang về, sáng thứ Ba bắt đầu đau bụng.',
          'Ba cảnh: **hiệu thuốc** (pharmacy) · **gọi phòng khám** lúc 8 giờ sáng · **gặp bác sĩ** (GP).',
          'Bạn cần nghe ra: **triệu chứng gì, bị bao lâu, uống gì, uống thế nào, khi nào phải đi khám**.',
          'Ngày 6 bạn đã biết hỏi đường tới hiệu thuốc. Hôm nay bạn bước vào trong và nói chuyện với dược sĩ.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Ở hiệu thuốc: "I\'ve been sick" là sao?' },
      {
        t: 'canh',
        anh: ['pill', 'woman-health-worker', 'man-student', 'nauseated-face', 'potable-water'],
        caption: 'Thứ Tư, giờ nghỉ trưa. **Khôi** vào hiệu thuốc gần văn phòng. Dược sĩ là **Aoife**, người Ireland. Khôi nói một câu làm chị hiểu sai hoàn toàn.',
      },
      {
        t: 'listen',
        id: 'gtd7-nghe-canh1',
        title: 'Scene 1 — At the pharmacy',
        note: 'Nghe xem Khôi bị gì, bị bao lâu, và vì sao Aoife không bán thứ Khôi hỏi mua.',
        lines: [
          { who: 'Aoife', voice: 'ie-nu', text: 'Hiya. Are you being looked after?', vi: 'Chào em. Đã có ai giúp em chưa?' },
          { who: 'Khôi', voice: 'us-nam', text: "Sorry? Oh, no, not yet. I need something for my stomach, please.", vi: 'Dạ? À, chưa ạ. Em cần thuốc gì đó cho dạ dày.' },
          { who: 'Aoife', voice: 'ie-nu', text: "No problem. Is it for yourself, or for someone else?", vi: 'Được. Thuốc cho em hay cho người khác?' },
          { who: 'Khôi', voice: 'us-nam', text: "It's for me. I've got a really bad stomach ache, and I've been sick since Tuesday.", vi: 'Cho em ạ. Em đau bụng lắm, và em bị ốm từ thứ Ba.' },
          { who: 'Aoife', voice: 'ie-nu', text: "Oh dear. Sick as in vomiting? How many times have you been sick?", vi: 'Ôi. "Sick" là nôn ấy hả? Em nôn mấy lần rồi?' },
          { who: 'Khôi', voice: 'us-nam', text: "No, no, I haven't vomited. I mean I'm not well. I've got diarrhoea, and I feel a bit dizzy.", vi: 'Dạ không, em không nôn. Ý em là em không khoẻ. Em bị tiêu chảy, và hơi chóng mặt.' },
          { who: 'Aoife', voice: 'ie-nu', text: "Ah, I see. Over here, \"I've been sick\" usually means you've thrown up. So, an upset stomach and diarrhoea. For how long?", vi: 'À, chị hiểu rồi. Ở bên này, "I\'ve been sick" thường nghĩa là đã nôn. Vậy là rối loạn tiêu hoá và tiêu chảy. Bao lâu rồi?' },
          { who: 'Khôi', voice: 'us-nam', text: 'For about two days now. I had a takeaway on Monday night, and it started the next morning.', vi: 'Khoảng hai ngày rồi ạ. Tối thứ Hai em ăn đồ mang về, sáng hôm sau thì bắt đầu.' },
          { who: 'Aoife', voice: 'ie-nu', text: 'Have you got a temperature?', vi: 'Em có sốt không?' },
          { who: 'Khôi', voice: 'us-nam', text: "I don't think so. I just feel cold and really tired.", vi: 'Em nghĩ là không. Em chỉ thấy lạnh và mệt lắm.' },
          { who: 'Aoife', voice: 'ie-nu', text: 'Are you taking anything for it at the moment?', vi: 'Hiện giờ em có đang uống gì cho nó không?' },
          { who: 'Khôi', voice: 'us-nam', text: "Just some medicine from Vietnam. My mum put it in my suitcase. And can I buy some antibiotics, please?", vi: 'Chỉ có ít thuốc từ Việt Nam. Mẹ em bỏ vào vali. Với lại em mua ít kháng sinh được không ạ?' },
          { who: 'Aoife', voice: 'ie-nu', text: "I'm afraid antibiotics are prescription only here. You'd need to see a doctor, and most stomach bugs don't need them anyway.", vi: 'Chị e là kháng sinh ở đây phải có đơn bác sĩ. Em phải đi khám, mà phần lớn đau bụng do nhiễm siêu vi cũng không cần kháng sinh.' },
          { who: 'Aoife', voice: 'ie-nu', text: "What I'd recommend is these rehydration sachets. Mix one with a glass of water, and drink it every time you go to the toilet.", vi: 'Chị khuyên em dùng mấy gói bù nước này. Pha một gói với một cốc nước, và uống mỗi lần em đi vệ sinh.' },
          { who: 'Khôi', voice: 'us-nam', text: "Okay. And should I keep taking my Vietnamese medicine?", vi: 'Vâng. Thế em có nên uống tiếp thuốc Việt Nam không ạ?' },
          { who: 'Aoife', voice: 'ie-nu', text: "I can't read the box, so to be safe, you shouldn't take it with these. Drink lots of water, little and often, and you shouldn't have coffee or alcohol for a few days.", vi: 'Chị không đọc được chữ trên hộp, nên cho chắc thì em đừng uống chung với gói này. Uống nhiều nước, mỗi lần một ít, và mấy ngày tới đừng uống cà phê hay rượu bia.' },
          { who: 'Aoife', voice: 'ie-nu', text: "If you're still unwell after two more days, or you see any blood, you should see a GP or ring 111. Are you registered with a GP?", vi: 'Nếu hai ngày nữa vẫn chưa khỏi, hoặc thấy có máu, em nên đi khám GP hoặc gọi 111. Em đã đăng ký với GP nào chưa?' },
          { who: 'Khôi', voice: 'us-nam', text: "Sorry, what's a GP?", vi: 'Xin lỗi, GP là gì ạ?' },
          { who: 'Aoife', voice: 'ie-nu', text: "A family doctor. You register with a local surgery, and it's free. Do it today, so it's sorted if you need it.", vi: 'Bác sĩ gia đình. Em đăng ký với một phòng khám gần nhà, miễn phí. Làm ngay hôm nay đi, để lỡ cần là có sẵn.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd7-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Khôi nói "I\'ve been sick since Tuesday". Aoife hiểu thành gì?',
            options: ['Khôi bị ốm từ thứ Ba', 'Khôi đã nôn', 'Khôi bị cảm lạnh', 'Khôi nghỉ làm từ thứ Ba'],
            correct: 1,
            why: 'Aoife hỏi lại: "**Sick as in vomiting?**" Ở Anh, **I\'ve been sick** thường nghĩa là **đã nôn**. Muốn nói "bị ốm" thì dùng **I\'m not well / I\'m ill**.',
          },
          {
            q: 'Khôi bị gì?',
            options: ['Sốt cao và nôn', 'Đau bụng, tiêu chảy, hơi chóng mặt', 'Đau họng và ho', 'Nhức đầu và sổ mũi'],
            correct: 1,
            why: '"a really bad **stomach ache**", "I\'ve got **diarrhoea**, and I feel a bit **dizzy**". Khôi nói không sốt: "I don\'t think so".',
          },
          {
            q: 'Vì sao Aoife không bán kháng sinh?',
            options: ['Hiệu thuốc hết hàng', 'Ở Anh kháng sinh phải có đơn bác sĩ', 'Khôi không có tiền', 'Khôi dị ứng kháng sinh'],
            correct: 1,
            why: '"Antibiotics are **prescription only** here." = phải có đơn. Chị còn nói phần lớn đau bụng kiểu này không cần kháng sinh.',
          },
          {
            q: 'Aoife dặn uống gói bù nước khi nào?',
            options: ['Ba lần một ngày sau ăn', 'Trước khi đi ngủ', 'Mỗi lần đi vệ sinh', 'Mỗi sáu tiếng'],
            correct: 2,
            why: '"drink it **every time you go to the toilet**". Cách dùng theo **số lần**, không theo giờ.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — 8 giờ sáng: gọi phòng khám' },
      {
        t: 'canh',
        anh: ['mobile-phone', 'alarm-clock', 'hourglass-not-done', 'woman-office-worker', 'spiral-calendar'],
        caption: 'Hai ngày sau, Khôi đỡ đau nhưng vẫn tiêu chảy và chóng mặt mỗi khi đứng dậy. Khôi đã đăng ký GP. Lịch khám trong ngày phải **gọi đúng 8 giờ sáng**. Người nghe máy là **Bev**, lễ tân.',
      },
      {
        t: 'listen',
        id: 'gtd7-nghe-canh2',
        title: 'Scene 2 — Calling the GP surgery',
        note: 'Nghe xem Khôi đứng thứ mấy trong hàng chờ, Bev hỏi những gì, và Khôi có phải tới phòng khám ngay không.',
        lines: [
          { who: 'Recording', voice: 'uk-nam', text: 'Thank you for calling Brookfield Medical Practice. You are number fourteen in the queue. Please hold.', vi: 'Cảm ơn quý khách đã gọi Phòng khám Brookfield. Quý khách đang ở vị trí số mười bốn trong hàng chờ. Vui lòng giữ máy.' },
          { who: 'Bev', voice: 'uk-nu', text: 'Good morning, Brookfield. Bev speaking. How can I help?', vi: 'Chào buổi sáng, phòng khám Brookfield. Bev nghe đây. Tôi giúp gì được?' },
          { who: 'Khôi', voice: 'us-nam', text: "Hi, good morning. I'd like to make an appointment to see a doctor today, please.", vi: 'Chào chị. Em muốn đặt lịch gặp bác sĩ hôm nay ạ.' },
          { who: 'Bev', voice: 'uk-nu', text: 'Okay, love. Can I take your full name and date of birth?', vi: 'Được em. Cho chị xin họ tên đầy đủ và ngày sinh nhé.' },
          { who: 'Khôi', voice: 'us-nam', text: "It's Pham Minh Khoi. Khoi is K-H-O-I. Date of birth: the ninth of March, two thousand and five.", vi: 'Em tên Phạm Minh Khôi. Khôi đánh vần là K-H-O-I. Ngày sinh: mùng chín tháng Ba, năm hai nghìn không trăm linh năm.' },
          { who: 'Bev', voice: 'uk-nu', text: "Lovely, I've got you. You only registered on Wednesday, didn't you? And can you tell me briefly what the problem is?", vi: 'Được rồi, chị thấy em rồi. Em mới đăng ký hôm thứ Tư nhỉ? Em nói ngắn gọn giúp chị là em bị gì?' },
          { who: 'Khôi', voice: 'us-nam', text: "I've had diarrhoea for four days now, and I feel dizzy when I stand up. The pharmacist said I should see a doctor.", vi: 'Em bị tiêu chảy bốn ngày rồi, và mỗi khi đứng dậy em thấy chóng mặt. Dược sĩ bảo em nên đi khám.' },
          { who: 'Bev', voice: 'uk-nu', text: 'Any blood, or a high temperature?', vi: 'Có máu hay sốt cao không em?' },
          { who: 'Khôi', voice: 'us-nam', text: "No blood. I don't have a thermometer, but I don't feel hot.", vi: 'Không có máu ạ. Em không có nhiệt kế, nhưng em không thấy nóng người.' },
          { who: 'Bev', voice: 'uk-nu', text: "Right. The doctor will ring you back this morning, some time between ten and twelve. Is this the best number?", vi: 'Rồi. Bác sĩ sẽ gọi lại cho em sáng nay, khoảng từ mười đến mười hai giờ. Số này là số liên lạc tốt nhất phải không?' },
          { who: 'Khôi', voice: 'us-nam', text: "Yes, it is. Sorry, so I shouldn't come in now?", vi: 'Vâng ạ. Xin lỗi, vậy là em không nên tới bây giờ ạ?' },
          { who: 'Bev', voice: 'uk-nu', text: "No, stay at home and keep your phone on. If the doctor needs to see you, she'll book you in for this afternoon.", vi: 'Không, em cứ ở nhà và để điện thoại mở. Nếu bác sĩ cần gặp, bác sĩ sẽ xếp lịch cho em chiều nay.' },
          { who: 'Khôi', voice: 'us-nam', text: "Okay. Between ten and twelve. Thank you so much.", vi: 'Vâng. Từ mười đến mười hai giờ. Cảm ơn chị nhiều.' },
          { who: 'Bev', voice: 'uk-nu', text: "You're welcome. And if you get much worse before then, ring 111. Take care, love.", vi: 'Không có gì. Nếu trước lúc đó em thấy tệ hơn nhiều thì gọi 111. Giữ gìn sức khoẻ nhé em.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd7-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Khi Bev nghe máy, Khôi đã chờ sau bao nhiêu người?',
            options: ['4 người', '13 người', '14 người', '40 người'],
            correct: 1,
            why: 'Lời ghi âm: "You are **number fourteen** in the queue" = Khôi đứng thứ 14, tức là có 13 người trước. Gọi GP lúc 8 giờ sáng ở Anh xếp hàng là chuyện thường.',
          },
          {
            q: 'Khôi bị tiêu chảy bao lâu rồi?',
            options: ['Hai ngày', 'Bốn ngày', 'Một tuần', 'Từ thứ Tư'],
            correct: 1,
            why: '"I\'ve had diarrhoea **for four days** now". **for + khoảng thời gian**.',
          },
          {
            q: 'Bev bảo Khôi làm gì?',
            options: ['Tới phòng khám ngay', 'Ở nhà, chờ bác sĩ gọi lại từ 10 đến 12 giờ', 'Gọi lại lúc 8 giờ sáng mai', 'Ra hiệu thuốc mua kháng sinh'],
            correct: 1,
            why: '"The doctor will **ring you back** this morning, some time **between ten and twelve**." và "**stay at home** and keep your phone on". Bác sĩ nghe trước qua điện thoại, cần thì mới hẹn gặp.',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Phòng khám: "Bao giờ em đi làm lại được?"' },
      {
        t: 'canh',
        anh: ['stethoscope', 'man-health-worker', 'man-student', 'thermometer', 'memo'],
        caption: 'Bác sĩ gọi lại và hẹn Khôi tới lúc 3 giờ 20 chiều. Người khám là **bác sĩ Reid**, người New Zealand làm việc ở Anh. Khôi lo nhất một chuyện: mai có đi làm được không.',
      },
      {
        t: 'listen',
        id: 'gtd7-nghe-canh3',
        title: 'Scene 3 — With the doctor',
        note: 'Nghe xem bác sĩ kết luận Khôi bị gì, Khôi nên làm gì, và khi nào được đi làm lại.',
        lines: [
          { who: 'Dr Reid', voice: 'nz-nam', text: "Come in, Khoi, have a seat. So, what seems to be the problem?", vi: 'Mời em vào, Khôi, ngồi đi. Nào, em bị sao?' },
          { who: 'Khôi', voice: 'us-nam', text: "I've had diarrhoea since Tuesday, and I get dizzy when I stand up quickly. My stomach still hurts sometimes.", vi: 'Em bị tiêu chảy từ thứ Ba, và cứ đứng dậy nhanh là chóng mặt. Thỉnh thoảng bụng em vẫn đau.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "Okay. On a scale of one to ten, how bad is the pain?", vi: 'Được. Trên thang từ một đến mười, đau cỡ nào?' },
          { who: 'Khôi', voice: 'us-nam', text: "Now it's about a three. On Tuesday it was an eight.", vi: 'Giờ khoảng ba thôi ạ. Hôm thứ Ba thì tám.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "Good, it's getting better, then. Let me have a look. Does it hurt when I press here?", vi: 'Tốt, vậy là đang đỡ dần. Để tôi xem nào. Tôi ấn chỗ này có đau không?' },
          { who: 'Khôi', voice: 'us-nam', text: "A little. Not really. Ow, yes, there.", vi: 'Hơi hơi. Không đau lắm. Ui, có, chỗ đó.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "Right. How much have you been drinking? Water, I mean.", vi: 'Rồi. Em uống được bao nhiêu? Ý tôi là nước ấy.' },
          { who: 'Khôi', voice: 'us-nam', text: "Not much, to be honest. When I drink, I need the toilet again.", vi: 'Nói thật là không nhiều ạ. Cứ uống vào là em lại phải đi vệ sinh.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "That's why you're dizzy. You're a bit dehydrated. It looks like a stomach bug, probably from that takeaway. It should settle down on its own.", vi: 'Thế nên em mới chóng mặt. Em hơi mất nước. Có vẻ là viêm dạ dày ruột do nhiễm trùng, chắc từ đồ ăn mang về hôm đó. Nó sẽ tự khỏi.' },
          { who: 'Khôi', voice: 'us-nam', text: "So I don't need any medicine?", vi: 'Vậy em không cần thuốc gì ạ?' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "Keep using the sachets from the pharmacy, and drink more than you think you need. You should eat small, plain meals: toast, rice, bananas.", vi: 'Em cứ dùng tiếp gói bù nước mua ở hiệu thuốc, và uống nhiều hơn mức em nghĩ là đủ. Nên ăn từng bữa nhỏ, đồ nhạt: bánh mì nướng, cơm, chuối.' },
          { who: 'Khôi', voice: 'us-nam', text: "Can I go back to work tomorrow? I'm an intern, and I don't want to miss too much.", vi: 'Mai em đi làm lại được không ạ? Em là thực tập sinh, em không muốn nghỉ nhiều quá.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "I'm afraid not. You should stay off work until forty-eight hours after the diarrhoea stops. Otherwise you could pass it on to the whole office.", vi: 'E là chưa được. Em nên nghỉ làm cho tới bốn mươi tám tiếng sau khi hết tiêu chảy. Không thì em có thể lây cho cả văn phòng.' },
          { who: 'Khôi', voice: 'us-nam', text: "Oh. Do I need a doctor's note for my company?", vi: 'Ồ. Em có cần giấy bác sĩ để nộp công ty không ạ?' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "Not for less than seven days. You can self-certify: you just fill in a form at work. If you're not better by Monday, give us a ring.", vi: 'Dưới bảy ngày thì không cần. Em tự khai được: chỉ cần điền một tờ đơn ở công ty. Nếu tới thứ Hai chưa khỏi thì gọi cho phòng khám.' },
          { who: 'Khôi', voice: 'us-nam', text: "Okay. Forty-eight hours after it stops, and ring you on Monday if I'm not better. Thank you, doctor.", vi: 'Vâng. Bốn mươi tám tiếng sau khi hết, và nếu chưa khỏi thì thứ Hai gọi lại. Cảm ơn bác sĩ.' },
          { who: 'Dr Reid', voice: 'nz-nam', text: "No worries. Rest up, and keep sipping.", vi: 'Không có gì. Nghỉ ngơi nhé, và cứ nhấp nước liên tục.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd7-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (3 câu)',
        items: [
          {
            q: 'Vì sao Khôi chóng mặt?',
            options: ['Vì sốt cao', 'Vì uống thuốc Việt Nam', 'Vì bị mất nước do uống quá ít', 'Vì thiếu ngủ'],
            correct: 2,
            why: '"Not much, to be honest" rồi bác sĩ nói: "That\'s why you\'re dizzy. You\'re a bit **dehydrated**." (mất nước).',
          },
          {
            q: '"It should settle down on its own" nghĩa là gì?',
            options: ['Khôi phải tự đi mua thuốc', 'Bệnh sẽ tự khỏi, không cần thuốc đặc trị', 'Khôi nên ngồi xuống nghỉ', 'Bác sĩ chưa biết là bệnh gì'],
            correct: 1,
            why: '**settle down on its own** = tự lắng xuống, tự khỏi. Ở Anh bác sĩ không kê thuốc cho bệnh tự khỏi được. Đó không phải là bác sĩ lười.',
          },
          {
            q: 'Khi nào Khôi được đi làm lại?',
            options: ['Ngày mai', 'Thứ Hai tuần sau', 'Hai ngày sau khi hết tiêu chảy', 'Khi có giấy bác sĩ'],
            correct: 2,
            why: '"stay off work until **forty-eight hours after** the diarrhoea stops". 48 tiếng = 2 ngày. Dưới 7 ngày thì không cần giấy bác sĩ, tự khai (**self-certify**).',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 7 câu khó' },
      {
        t: 'p',
        text: 'Các câu dưới đây có **số**, **giờ**, và từ nối âm liền nhau (I\'ve got a, for about, ring you back). Nghe tối đa 3 lần rồi gõ lại cả câu.',
      },
      {
        t: 'dictation',
        id: 'gtd7-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — mô tả triệu chứng', spell: "I've got a really bad stomach ache.", answer: "I've got a really bad stomach ache.", alt: ['I have got a really bad stomach ache.', "I've got a really bad stomachache."] },
          { label: 'Câu 2 — bị bao lâu', spell: 'For about two days now.', answer: 'For about two days now.', alt: ['For about 2 days now.'] },
          { label: 'Câu 3 — câu hỏi của dược sĩ', spell: 'Are you taking anything for it at the moment?', answer: 'Are you taking anything for it at the moment?' },
          { label: 'Câu 4 — kháng sinh', spell: 'Antibiotics are prescription only here.', answer: 'Antibiotics are prescription only here.', alt: ['Antibiotics are prescription-only here.'] },
          { label: 'Câu 5 — hàng chờ điện thoại', spell: 'You are number fourteen in the queue.', answer: 'You are number fourteen in the queue.', alt: ['You are number 14 in the queue.', "You're number fourteen in the queue.", "You're number 14 in the queue."] },
          { label: 'Câu 6 — hẹn gọi lại', spell: 'The doctor will ring you back between ten and twelve.', answer: 'The doctor will ring you back between ten and twelve.', alt: ['The doctor will ring you back between 10 and 12.'] },
          { label: 'Câu 7 — lời dặn', spell: 'You should stay off work for forty-eight hours.', answer: 'You should stay off work for forty-eight hours.', alt: ['You should stay off work for 48 hours.', 'You should stay off work for forty eight hours.'] },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['Are you being looked after? (Anh)', 'Đã có ai giúp bạn chưa? Câu của người bán hàng, **không** hỏi ai chăm sóc bạn.', "Not yet, thanks. · Yes, thanks, I'm fine."],
          ["I've been sick. (Anh)", 'Tôi **đã nôn**. Không phải "tôi bị ốm".', "Oh no. How many times?"],
          ['I feel sick. (Anh)', 'Tôi **buồn nôn**. Ở Mỹ thì nghĩa rộng hơn: thấy không khoẻ.', 'Do you want some water?'],
          ['What seems to be the problem?', 'Câu mở đầu của bác sĩ: bạn bị sao? Nói **triệu chứng + bao lâu** luôn.', "I've had a cough for a week."],
          ['It should settle down on its own.', 'Bệnh sẽ tự khỏi. Bác sĩ **không** từ chối giúp bạn.', 'Is there anything I can do to help it?'],
          ["Keep an eye on it.", 'Theo dõi thêm. Nặng hơn thì quay lại.', "Okay. When should I come back?"],
          ['Give us a ring. · Ring 111.', 'Gọi điện cho chúng tôi. · Gọi đường dây y tế không khẩn cấp (Anh).', "Okay, I will."],
          ['Take care, love.', '"love" ở miền Bắc nước Anh chỉ là cách gọi thân của người bán hàng, lễ tân. Không có ý tán tỉnh.', 'Thanks, you too.'],
        ],
        caption: 'Ở nước Anh, "**sick**" khi nói về bản thân thường là **nôn**. Muốn nói "bị ốm" thì an toàn nhất là: **I\'m not well · I\'m not feeling well · I\'m ill**.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp cách dùng thuốc thì làm gì',
        items: [
          'Cách dùng thuốc là chỗ **không được đoán**. Nghe sót một chữ (before / after, two / three) là uống sai.',
          '**Đọc lại** cho người ta nghe: "So that\'s **one sachet every time I go to the toilet**, right?" Sai thì họ sửa ngay. Cách này dùng được cả với dược sĩ lẫn bác sĩ.',
          'Hỏi đúng chỗ còn mơ hồ, đưa sẵn hai lựa chọn: "**Before or after food?**" · "**Is that once or twice a day?**"',
          'Nhờ ghi lên hộp: "**Could you write the dose on the box?**" Hiệu thuốc ở Anh thường dán sẵn nhãn in cách dùng lên hộp thuốc theo đơn.',
          'Gọi điện mà gặp máy trả lời tự động: chỉ cần bắt **số** và **từ khoá** ("Press **one** for **appointments**"). Không hiểu hết câu cũng không sao.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Hiệu thuốc', 'pharmacy · chemist', 'drugstore · pharmacy', 'chemist · pharmacy'],
          ['Bác sĩ gia đình', 'GP · the doctor\'s · surgery', 'doctor · doctor\'s office', 'GP · medical centre'],
          ['Phòng cấp cứu', 'A&E', 'the ER', 'ED · emergency department'],
          ['Nôn', "be sick", 'throw up · vomit', 'be sick · throw up'],
          ['Thuốc hạ sốt giảm đau phổ biến', 'paracetamol', 'acetaminophen (Tylenol)', 'paracetamol'],
          ['Băng dán cá nhân', 'plaster', 'Band-Aid', 'Band-Aid · plaster'],
          ['Thấy không khoẻ (thân)', 'feeling rough · under the weather', 'under the weather', 'feeling crook (Úc)'],
          ['Số cấp cứu', '999 (111 = tư vấn y tế không khẩn cấp)', '911', 'Úc: 000 · New Zealand: **111** = cấp cứu'],
        ],
        caption: 'Cẩn thận số **111**: ở **Anh** là đường dây tư vấn **không khẩn cấp**, ở **New Zealand** lại là số **cấp cứu**. Ở Việt Nam, cấp cứu là 115.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-ds-a2-02 · Something for a Sore Throat** — Liên đau họng và nhức đầu khi đi du học, hỏi dược sĩ cách uống và có cần đi khám không. Cùng chủ đề, khác bệnh, khác lời khuyên: nghe để gặp lại **have a…**, **How long…?**, **should**.',
          'Nghe sau khi xong bài Nói hôm nay. Thử dừng sau mỗi câu của dược sĩ và tự trả lời trước khi nghe Liên nói.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd7-noi',
    kind: 'speaking',
    title: 'Nói về sức khoẻ, đặt lịch khám',
    goal: 'Tả được triệu chứng, nói bị bao lâu, hỏi và cho lời khuyên bằng should / shouldn\'t, đặt lịch khám và hỏi thăm người ốm ở đúng mức lịch sự.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**28 câu mẫu** để nói mình bị gì, bị bao lâu, hỏi dược sĩ, đặt lịch khám và hỏi thăm người ốm.',
          'Điểm ngữ pháp: **have (got) + triệu chứng** · **should / shouldn\'t** · **for + khoảng thời gian** (và since + mốc). Từ nối: **when**.',
          'Kể bệnh với **bạn, đồng nghiệp và bác sĩ** khác nhau thế nào; hỏi thăm người ốm đến mức nào là vừa.',
          'Khẩu trang, hắt hơi, bắt tay khi đang ốm: Việt Nam, Anh – Mỹ – Úc và Nhật nghĩ khác nhau.',
          'Cuối bài: nhập vai ở hiệu thuốc với một chấn thương khác (trẹo mắt cá chân khi đá bóng).',
        ],
      },

      { t: 'h', text: '1. 28 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Xếp theo thứ tự một lần đi khám: **mình bị gì → bị bao lâu → hỏi cách chữa → đặt lịch → hỏi thăm người khác**. Bấm loa từng câu, nói to theo, rồi bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: "I'm not feeling well.", pos: 'phr', ipa: '/aɪm nɑːt ˈfiːlɪŋ wel/', vi: 'Tôi thấy không khoẻ.', ex: "Sorry, I'm not feeling well. Can I sit down?", exVi: 'Xin lỗi, tôi thấy không khoẻ. Tôi ngồi xuống được không?', more: 'Câu an toàn nhất ở mọi nước. Ở Anh tránh "I\'m sick" vì dễ bị hiểu là nôn.', anh: 'face-with-thermometer' },
          { w: "I've got a stomach ache.", pos: 'phr', ipa: '/aɪv ɡɑːt ə ˈstʌmək eɪk/', vi: 'Tôi bị đau bụng.', ex: "I've got a stomach ache, and I can't eat anything.", exVi: 'Tôi bị đau bụng, không ăn được gì.', more: 'Cùng khuôn: a **head**ache, a **tooth**ache, an **ear**ache, a **back**ache.' },
          { w: "I've got a temperature.", pos: 'phr', ipa: '/aɪv ɡɑːt ə ˈtemprətʃər/', vi: 'Tôi bị sốt. (Anh)', ex: "I've got a temperature of thirty-eight and a half.", exVi: 'Tôi sốt ba mươi tám độ rưỡi.', more: 'Mỹ hay nói **I have a fever.** Cả hai đều đúng ở mọi nơi.', anh: 'thermometer' },
          { w: "I've got a cold.", pos: 'phr', ipa: '/aɪv ɡɑːt ə ˈkoʊld/', vi: 'Tôi bị cảm.', ex: "I've got a cold, so I won't shake hands.", exVi: 'Tôi bị cảm, nên tôi không bắt tay đâu.', more: '**I\'m cold** = tôi thấy lạnh. **I\'ve got a cold** = tôi bị cảm. Thiếu **a** là sai nghĩa.', anh: 'sneezing-face' },
          { w: "I've got a cough.", pos: 'phr', ipa: '/aɪv ɡɑːt ə ˈkɔːf/', vi: 'Tôi bị ho.', ex: "I've got a dry cough. It's worse at night.", exVi: 'Tôi bị ho khan. Ban đêm ho nhiều hơn.', more: 'dry cough (ho khan) · chesty cough (ho có đờm, Anh)' },
          { w: 'a blocked nose / a runny nose', pos: 'n', ipa: '/ə ˌblɑːkt ˈnoʊz/ /ə ˌrʌni ˈnoʊz/', vi: 'nghẹt mũi / sổ mũi', ex: "I've got a blocked nose, so I can't sleep.", exVi: 'Tôi bị nghẹt mũi nên không ngủ được.', more: 'Mỹ hay nói **a stuffy nose**.', anh: 'nose' },
          { w: 'I feel dizzy.', pos: 'phr', ipa: '/aɪ fiːl ˈdɪzi/', vi: 'Tôi thấy chóng mặt.', ex: 'I feel dizzy when I stand up quickly.', exVi: 'Tôi thấy chóng mặt khi đứng dậy nhanh.', anh: 'face-with-spiral-eyes' },
          { w: 'I feel sick.', pos: 'phr', ipa: '/aɪ fiːl ˈsɪk/', vi: 'Tôi buồn nôn. (Anh)', ex: 'I feel sick. I think it was the fish.', exVi: 'Tôi buồn nôn. Chắc tại món cá.', more: 'Nghĩa khác hẳn **I\'ve been sick** (đã nôn).', anh: 'nauseated-face' },
          { w: 'diarrhoea', pos: 'n', ipa: '/ˌdaɪəˈriːə/', vi: 'tiêu chảy', ex: "I've had diarrhoea since Tuesday.", exVi: 'Tôi bị tiêu chảy từ thứ Ba.', more: 'Mỹ viết **diarrhea**. Nói tránh, lịch sự hơn: **an upset stomach** (rối loạn tiêu hoá).' },
          { w: 'It hurts here.', pos: 'phr', ipa: '/ɪt ˈhɝːts hɪr/', vi: 'Đau ở chỗ này.', ex: 'It hurts here, on the right side.', exVi: 'Đau ở chỗ này, bên phải.', more: 'Vừa nói vừa **chỉ vào chỗ đau** trên người mình. Đây là cách tả nhanh nhất.' },
          { w: 'It hurts when I…', pos: 'phr', ipa: '/ɪt ˈhɝːts wen aɪ/', vi: 'Đau khi tôi…', ex: 'It hurts when I swallow.', exVi: 'Tôi đau khi nuốt.', more: 'when I walk · when I breathe in · when I bend down' },
          { w: 'My back hurts.', pos: 'phr', ipa: '/maɪ ˈbæk hɝːts/', vi: 'Tôi đau lưng.', ex: 'My back hurts after sitting all day.', exVi: 'Ngồi cả ngày xong tôi đau lưng.', more: '**My + bộ phận + hurts / hurt**: My eyes hurt. My knee hurts.' },
          { w: 'a rash / itchy', pos: 'n / adj', ipa: '/ə ˈræʃ/ /ˈɪtʃi/', vi: 'phát ban / ngứa', ex: "I've got a rash on my arm, and it's really itchy.", exVi: 'Tay tôi bị phát ban, ngứa lắm.' },
          { w: "I've sprained my ankle.", pos: 'phr', ipa: '/aɪv ˈspreɪnd maɪ ˈæŋkl/', vi: 'Tôi bị trẹo mắt cá chân.', ex: "I've sprained my ankle playing football.", exVi: 'Tôi bị trẹo mắt cá khi đá bóng.', anh: 'foot' },
          { w: "I've had it for two days.", pos: 'phr', ipa: '/aɪv ˈhæd ɪt fər tuː ˈdeɪz/', vi: 'Tôi bị hai ngày rồi.', ex: "I've had this cough for about a week.", exVi: 'Tôi bị ho này khoảng một tuần rồi.', more: 'Học **nguyên khối**. Ngày 12 mới giải thích kỹ thì hiện tại hoàn thành.' },
          { w: 'It started on Monday.', pos: 'phr', ipa: '/ɪt ˈstɑːrtɪd ɑːn ˈmʌndeɪ/', vi: 'Nó bắt đầu từ thứ Hai.', ex: 'It started on Monday night, after dinner.', exVi: 'Bắt đầu từ tối thứ Hai, sau bữa tối.', more: 'Cách dễ nhất khi chưa quen "since": nói **ngày bắt đầu** bằng quá khứ đơn.' },
          { w: 'Can you recommend something for…?', pos: 'phr', ipa: '/kən ju ˌrekəˈmend ˈsʌmθɪŋ fɔːr/', vi: 'Anh/chị gợi ý giúp thuốc gì cho…?', ex: 'Can you recommend something for a blocked nose?', exVi: 'Chị gợi ý giúp thuốc gì cho nghẹt mũi?', anh: 'pill' },
          { w: 'How often should I take it?', pos: 'phr', ipa: '/haʊ ˈɔːfn ʃəd aɪ ˈteɪk ɪt/', vi: 'Tôi nên uống bao lâu một lần?', ex: 'How often should I take it? — Every four hours.', exVi: 'Tôi nên uống bao lâu một lần? — Bốn tiếng một lần.' },
          { w: 'before / after food', pos: 'phr', ipa: '/bɪˈfɔːr ˈæftər fuːd/', vi: 'trước / sau khi ăn', ex: 'Should I take it before or after food?', exVi: 'Tôi uống trước hay sau khi ăn?', more: 'Trên nhãn thuốc hay ghi: **with food** (uống cùng bữa ăn), **on an empty stomach** (lúc bụng đói).' },
          { w: 'Is it okay to take this with…?', pos: 'phr', ipa: '/ɪz ɪt oʊˈkeɪ tə teɪk ðɪs wɪð/', vi: 'Uống cái này cùng với… có được không?', ex: "Is it okay to take this with my allergy tablets?", exVi: 'Uống cái này cùng thuốc dị ứng của tôi có được không?' },
          { w: 'prescription', pos: 'n', ipa: '/prɪˈskrɪpʃn/', vi: 'đơn thuốc', ex: 'You need a prescription for antibiotics.', exVi: 'Muốn mua kháng sinh thì cần đơn thuốc.', more: '**prescription only** = chỉ bán khi có đơn.', anh: 'memo' },
          { w: "I'm allergic to penicillin.", pos: 'phr', ipa: '/aɪm əˈlɝːdʒɪk tə ˌpenɪˈsɪlɪn/', vi: 'Tôi dị ứng penicillin.', ex: "Before you give me anything, I'm allergic to penicillin.", exVi: 'Trước khi chị đưa thuốc, tôi dị ứng penicillin.', more: 'Dị ứng thuốc thì **nói trước khi được hỏi**. Ngày 4 bạn đã dùng mẫu này cho đồ ăn.' },
          { w: "I'd like to make an appointment.", pos: 'phr', ipa: '/aɪd laɪk tə meɪk ən əˈpɔɪntmənt/', vi: 'Tôi muốn đặt lịch khám.', ex: "I'd like to make an appointment to see a doctor, please.", exVi: 'Tôi muốn đặt lịch gặp bác sĩ.', anh: 'spiral-calendar' },
          { w: "It's not an emergency, but…", pos: 'phr', ipa: '/ɪts nɑːt ən ɪˈmɝːdʒənsi bʌt/', vi: 'Không phải cấp cứu, nhưng…', ex: "It's not an emergency, but I'd like to see someone today.", exVi: 'Không phải cấp cứu, nhưng tôi muốn được khám trong hôm nay.' },
          { w: 'register with a GP', pos: 'v', ipa: '/ˈredʒɪstər wɪð ə ˌdʒiː ˈpiː/', vi: 'đăng ký với bác sĩ gia đình (Anh)', ex: "I'd like to register with this surgery.", exVi: 'Tôi muốn đăng ký với phòng khám này.' },
          { w: 'You should… / You shouldn\'t…', pos: 'phr', ipa: '/ju ʃʊd/ /ju ˈʃʊdnt/', vi: 'Bạn nên… / Bạn không nên…', ex: "You should go home. You shouldn't be at work like this.", exVi: 'Bạn nên về nhà đi. Ốm thế này không nên đi làm.' },
          { w: 'under the weather', pos: 'phr', ipa: '/ˌʌndər ðə ˈweðər/', vi: 'hơi mệt, hơi ốm (nói nhẹ)', ex: "I'm a bit under the weather today, so I'm working from home.", exVi: 'Hôm nay mình hơi mệt nên làm ở nhà.', more: 'Cách nói **không đi vào chi tiết**, rất hợp ở công sở.' },
          { w: 'I hope you feel better soon.', pos: 'phr', ipa: '/aɪ hoʊp ju fiːl ˈbetər suːn/', vi: 'Mong bạn sớm khoẻ.', ex: 'Take it easy, and I hope you feel better soon.', exVi: 'Nghỉ ngơi đi nhé, mong bạn sớm khoẻ.', more: 'Ngắn hơn, thân hơn: **Get well soon!** · **Take care!**', anh: 'folded-hands' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Kể bệnh với bạn thì được nói "thấy như sắp chết". Với đồng nghiệp chỉ cần nói chung chung. Với bác sĩ phải nói **cụ thể**: chỗ nào, bao lâu, nặng mức nào.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng / chính xác (bác sĩ, sếp)'],
        rows: [
          ['Nói mình ốm', 'I feel awful. · I feel rough.', "I'm a bit under the weather.", "I'm afraid I'm not well today."],
          ['Tả triệu chứng', "My stomach's killing me!", "I've got a bit of a stomach bug.", "I've had stomach pain and diarrhoea for four days."],
          ['Xin lời khuyên', 'What should I do?', 'Do you think I should see a doctor?', 'What would you recommend?'],
          ['Cho lời khuyên', 'You should go home, seriously.', 'Maybe you should see a doctor.', 'I would recommend seeing your GP.'],
          ['Hỏi thăm người ốm', 'You okay? You look terrible.', 'Are you feeling better?', 'I hope you are feeling better.'],
          ['Chúc mau khoẻ', 'Get well soon!', 'Hope you feel better soon.', 'Wishing you a speedy recovery.'],
        ],
        caption: '"**You should…**" là lời khuyên thẳng, hợp với bạn bè. Với đồng nghiệp, thêm **Maybe** phía trước cho mềm. Với khách hay sếp thì dùng **I would recommend…** hoặc **It might be a good idea to…**',
      },
      {
        t: 'note',
        title: 'Mẹo: hỏi thăm người ốm ở công sở',
        items: [
          'Ở Anh, Mỹ, Úc, sức khoẻ là chuyện **riêng**. Đồng nghiệp nói "I\'ve got a bug" thì bạn **không hỏi tiếp** bị gì, uống thuốc gì.',
          'Câu vừa đủ: "**Oh no. Feeling better?**" · "**Take it easy.**" · "**Shout if you need anything.**"',
          'Ở Việt Nam hỏi han kỹ là quan tâm. Ở các nước này hỏi kỹ dễ thành tò mò. Người kia **tự kể** thì bạn mới nghe tiếp.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Tiếng Việt nói "tôi **bị** đau đầu", "tôi **bị** sốt". Tiếng Anh không có chữ "bị": họ nói "tôi **có** một cơn đau đầu" — **I have a headache**. Lời khuyên thì gói gọn trong một chữ: **should**.',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: 'S + have / has (got) + a / an + triệu chứng',
            vi: 'Nói mình bị gì. Anh hay thêm "got" khi nói. Bệnh đếm được thì có a / an.',
            examples: [
              { en: "I've got a headache.", vi: 'Tôi bị đau đầu.' },
              { en: "She's got a temperature.", vi: 'Cô ấy bị sốt.' },
              { en: 'I have a cough and a runny nose.', vi: 'Tôi bị ho và sổ mũi.' },
            ],
          },
          {
            formula: 'S + feel + adj',
            vi: 'Nói mình cảm thấy thế nào. I feel dizzy và I\'m feeling dizzy đều đúng; mới học thì dùng I feel… cho gọn. Đừng ghép cả hai: ~~I am feel~~.',
            examples: [
              { en: 'I feel dizzy.', vi: 'Tôi thấy chóng mặt.' },
              { en: 'I feel sick.', vi: 'Tôi buồn nôn.' },
              { en: 'He feels a bit better today.', vi: 'Hôm nay anh ấy thấy đỡ hơn chút.' },
            ],
          },
          {
            formula: 'My + bộ phận + hurts / hurt · It hurts when I + V',
            vi: 'Nói chỗ đau. Một bộ phận: hurts. Hai bộ phận (eyes, feet): hurt.',
            examples: [
              { en: 'My knee hurts.', vi: 'Tôi đau đầu gối.' },
              { en: 'My eyes hurt.', vi: 'Mắt tôi đau.' },
              { en: 'It hurts when I walk.', vi: 'Tôi đi thì đau.' },
            ],
          },
          {
            formula: 'S + should / shouldn\'t + V',
            vi: 'Cho lời khuyên. Sau should là động từ nguyên thể, không "to", không thêm s.',
            examples: [
              { en: 'You should drink lots of water.', vi: 'Bạn nên uống nhiều nước.' },
              { en: "You shouldn't drink coffee for a few days.", vi: 'Mấy ngày tới bạn không nên uống cà phê.' },
              { en: 'Should I see a doctor?', vi: 'Tôi có nên đi khám không?' },
            ],
          },
          {
            formula: "I've had it + for + khoảng thời gian / since + mốc",
            vi: 'Nói bị bao lâu. for + bao lâu (two days, a week). since + từ lúc nào (Monday, last night).',
            examples: [
              { en: "I've had it for two days.", vi: 'Tôi bị hai ngày rồi.' },
              { en: "I've had this cough for a week.", vi: 'Tôi bị ho này một tuần rồi.' },
              { en: "I've had diarrhoea since Tuesday.", vi: 'Tôi bị tiêu chảy từ thứ Ba.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Tiếng Việt', 'Đúng', 'Sai hay gặp'],
        rows: [
          ['Tôi bị đau đầu.', "I've got a headache. · I have a headache.", '~~I am headache.~~ · ~~I headache.~~'],
          ['Tôi bị sốt.', "I've got a temperature. · I have a fever.", '~~I am fever.~~'],
          ['Tôi bị cảm.', "I've got a cold.", "~~I'm cold.~~ (= tôi thấy lạnh)"],
          ['Tôi bị chóng mặt.', 'I feel dizzy.', '~~I have dizzy.~~'],
          ['Bạn nên nghỉ ngơi.', 'You should rest.', '~~You should to rest.~~ · ~~You should resting.~~'],
          ['Tôi bị hai ngày rồi.', "I've had it for two days.", '~~I have it since two days.~~'],
        ],
        caption: 'Mẹo nhớ: **danh từ** (a headache, a cold, a cough) đi với **have**. **Tính từ** (dizzy, sick, tired) đi với **feel**.',
      },
      {
        t: 'rule',
        formula: "I've got + a + triệu chứng + for + khoảng thời gian. · You should / shouldn't + V.",
        vi: 'Hai khung này đủ cho cả buổi đi khám: một câu tả bệnh (bị gì, bao lâu), một câu xin hoặc cho lời khuyên.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: when',
        items: [
          '**when** nối triệu chứng với lúc nó xảy ra: "It hurts **when** I swallow." · "I feel dizzy **when** I stand up."',
          'Bác sĩ cần đúng thông tin này: **đau lúc nào**. Câu có when giúp bác sĩ đoán bệnh nhanh hơn một câu "It hurts" trơn.',
          'when đứng đầu câu thì có dấu phẩy: "**When** I eat, my stomach hurts." Đứng giữa thì không: "My stomach hurts **when** I eat."',
          'Ôn lại từ nối cũ: **and** (Ngày 1) thêm triệu chứng: "I\'ve got a cough **and** a runny nose." **so** (Ngày 3) nói kết quả: "I felt dizzy, **so** I sat down."',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd7-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "have (got) + a + triệu chứng · feel + adj · should / shouldn't · for / since · when",
        items: [
          { q: 'Tôi bị đau răng.', hint: 'have got, toothache', answers: ["I've got a toothache.", 'I have a toothache.', "I've got toothache.", 'I have got a toothache.'] },
          { q: 'Tôi bị ho một tuần rồi.', hint: "I've had, cough, for", answers: ["I've had a cough for a week.", "I've had a cough for one week.", 'I have had a cough for a week.', "I've had this cough for a week."] },
          { q: 'Bạn không nên đi làm hôm nay.', hint: "shouldn't, go to work", answers: ["You shouldn't go to work today.", 'You should not go to work today.', "You shouldn't go into work today."] },
          { q: 'Tôi thấy chóng mặt khi đứng dậy.', hint: 'feel dizzy, when, stand up', answers: ['I feel dizzy when I stand up.', 'When I stand up, I feel dizzy.', 'I get dizzy when I stand up.'] },
          { q: 'Tôi có nên đi khám không?', hint: 'should, see a doctor', answers: ['Should I see a doctor?', 'Should I go to the doctor?', "Should I go to the doctor's?", 'Should I see a GP?'] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~I am headache.~~ → **I\'ve got a headache.** Tiếng Việt "tôi bị đau đầu" không có động từ nào giống "have", nên rất hay dịch thành "I am". Bệnh là thứ bạn **có**.',
          '~~I drink medicine.~~ → **I take medicine.** "Uống thuốc" là **take**, kể cả thuốc nước. "drink" chỉ dùng cho nước, cà phê, gói bù nước pha sẵn.',
          '~~I have fever 39 degree.~~ → **I\'ve got a temperature of 39.** Người Anh hay nói "a temperature of thirty-nine". Ở Mỹ đo độ F, nên nói thêm "degrees Celsius" cho chắc.',
          '~~My stomach is pain.~~ / ~~My stomach is painful.~~ → **My stomach hurts.** "pain" là danh từ. "painful" đúng ngữ pháp nhưng nghe như sách y khoa.',
          '~~I have it since two days.~~ → **I\'ve had it for two days.** **for** + bao lâu, **since** + từ mốc nào. "since two days" là lỗi kinh điển của người Việt lẫn người Pháp.',
          '~~I\'m cold~~ (ý là "bị cảm") → **I\'ve got a cold.** "I\'m cold" chỉ là "tôi thấy lạnh", người ta sẽ đưa bạn cái áo khoác.',
          '~~I go to hospital~~ (đau bụng, cảm cúm) → **I\'m going to see a doctor / the GP.** Ở Anh, Mỹ, Úc **hospital** là chuyện nặng: cấp cứu, mổ, nằm viện. Ai nghe bạn nói "I went to hospital" vì cảm cúm sẽ rất lo.',
          '~~You must go to the doctor!~~ (khuyên bạn) → **You should see a doctor.** "must" là ra lệnh hoặc bắt buộc. Khuyên người khác thì dùng **should**.',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi ốm' },
      {
        t: 'p',
        text: 'Khi ốm, cách bạn ho, hắt hơi, bắt tay hay đeo khẩu trang nói nhiều hơn lời. Mỗi nước có thói quen riêng. Bấm từng thẻ để nghe câu đi kèm.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ khi đang ốm hoặc đi khám',
        items: [
          { anh: 'backhand-index-pointing-down', w: 'It hurts here.', ro: '/ɪt ˈhɝːts hɪr/', vi: 'Chỉ vào chỗ đau **trên người mình**: cách tả nhanh và chính xác nhất. Chỉ vào người mình thì không bất lịch sự.' },
          { anh: 'hand-with-fingers-splayed', w: "It's about a five out of ten.", ro: '/ɪts əˌbaʊt ə ˈfaɪv aʊt əv ˈten/', vi: 'Bác sĩ hỏi đau mấy trên mười, có thể giơ ngón tay kèm lời. Đừng nói "very very pain", nói **một con số**.' },
          { anh: 'raised-hand', w: "I won't shake hands. I've got a cold.", ro: '', vi: 'Đang ốm thì giơ tay chào và **nói lý do** khi không bắt tay. Người ta sẽ cảm ơn bạn, không ai thấy bị từ chối.' },
          { anh: 'sneezing-face', w: 'Excuse me. — Bless you!', ro: '/ɪkˈskjuːz miː/ /ˈbles juː/', vi: 'Hắt hơi vào **khăn giấy hoặc khuỷu tay**, không vào lòng bàn tay. Ai hắt hơi thì người bên cạnh nói "Bless you!", người hắt hơi đáp "Thanks."' },
          { anh: 'face-with-medical-mask', w: "I'm wearing a mask because I've got a cough.", ro: '', vi: 'Ở Việt Nam, Nhật đeo khẩu trang là bình thường. Ở Anh, Mỹ, Úc ít người đeo hơn: đeo khi ốm là tế nhị, có thể nói một câu giải thích.' },
          { anh: 'eyes', w: "Sorry, could you say the dose again?", ro: '', vi: 'Nhìn bác sĩ khi họ dặn. Nghe chưa rõ thì hỏi lại ngay, đừng gật đầu cho qua.' },
          { anh: 'grimacing-face', w: 'Ow! Yes, there.', ro: '/aʊ jes ˈðer/', vi: 'Bác sĩ ấn mà đau thì **nói ra**, đừng cố chịu cho lịch sự. Họ cần biết đúng chỗ đau.' },
          { anh: 'thumbs-up', w: "I'm feeling much better, thanks.", ro: '', vi: 'Đồng nghiệp hỏi thăm sau khi bạn khỏi: trả lời ngắn, cười, giơ ngón cái. Không cần kể chi tiết bệnh.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Khẩu trang', 'Đeo thường xuyên: bụi, nắng, ốm.', 'Chủ yếu khi ốm hoặc trong bệnh viện. Ít người đeo ngoài đường.', 'Đeo khi ốm để khỏi lây cho người khác là phép lịch sự.'],
          ['Ốm có đi làm không', 'Ốm nhẹ thường vẫn đi.', 'Ốm thì **ở nhà** để khỏi lây. Đi làm khi đang ốm bị coi là thiếu ý thức.', 'Nhiều người vẫn đi làm, đeo khẩu trang.'],
          ['Kể bệnh ở công ty', 'Kể khá chi tiết, mọi người góp ý thuốc.', 'Nói chung chung: "a bug", "under the weather".', 'Nói ngắn, xin lỗi vì làm phiền mọi người.'],
          ['Mua thuốc', 'Kháng sinh nhiều nơi bán không cần đơn.', 'Kháng sinh **phải có đơn**. Thuốc giảm đau bán tự do nhưng giới hạn số vỉ mỗi lần mua (Anh).', 'Kháng sinh phải có đơn.'],
          ['Hắt hơi', 'Thường không nói gì.', 'Người bên cạnh nói "Bless you!".', 'Thường không nói gì.'],
        ],
        caption: 'Đi công tác hay thực tập ở nước ngoài mà ốm: **báo sớm, ở nhà, nói ngắn gọn**. Quy tắc này đúng ở hầu hết công ty phương Tây.',
      },

      { t: 'h', text: '6. Phát âm: ache, stomach, should' },
      {
        t: 'p',
        text: 'Ba chỗ người Việt hay đọc sai: **ache** đọc là /eɪk/ (như "ếch"), không phải "át-chơ" · **stomach** đọc /ˈstʌmək/ ("xtá-mấk"), không phải "xtô-mách" · **should** và **could** không đọc chữ **l**. Trọng âm câu rơi vào **chữ mang nghĩa**: bị **gì**, bao **lâu**.',
      },
      {
        t: 'phatam',
        id: 'gtd7-phat-am',
        title: 'Luyện phát âm — từ y tế và trọng âm câu khi tả bệnh',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Nói liền một hơi, nhấn vào từ in đậm trong phần giải thích.',
        items: [
          { text: "I've got a stomach ache.", ipa: 'aɪv ɡɑːt ə stʌmək eɪk', vi: "stomach = /stʌmək/, ch đọc /k/ · ache = /eɪk/ · nối I've‿got‿a" },
          { text: "I've had it for two days.", ipa: 'aɪv hæd ɪt fər tuː deɪz', vi: 'nối had‿it · for đọc nhẹ /fər/ · nhấn **two days**' },
          { text: 'You should see a doctor.', ipa: 'ju ʃʊd siː ə dɑːktər', vi: 'should không có âm /l/ · nhấn **see** và **doc**' },
          { text: "You shouldn't drink coffee.", ipa: 'ju ʃʊdnt drɪŋk kɔːfi', vi: "shouldn't: /d/ gần như nuốt, bật ra /nt/ · nhấn **drink** và **co**" },
          { text: "I've got a temperature.", ipa: 'aɪv ɡɑːt ə temprətʃər', vi: 'temperature 3 âm tiết: TEM-prơ-chơ, không đọc đủ 4' },
          { text: 'It hurts when I swallow.', ipa: 'ɪt hɝːts wen aɪ swɑːloʊ', vi: 'hurts có /ts/ cuối · nối when‿I' },
          { text: 'Take one tablet three times a day.', ipa: 'teɪk wʌn tæblət θriː taɪmz ə deɪ', vi: 'three: lưỡi giữa hai hàm răng /θ/ · times có /mz/ cuối' },
          { text: 'I feel a bit dizzy.', ipa: 'aɪ fiːl ə bɪt dɪzi', vi: 'nối feel‿a‿bit · dizzy có /z/, không đọc "đi-xi"' },
        ],
      },

      { t: 'h', text: '7. Nhập vai: trẹo chân sau trận bóng' },
      {
        t: 'dialogue',
        title: 'Ở hiệu thuốc sáng Chủ nhật — Khôi trẹo mắt cá chân khi đá bóng với đồng nghiệp',
        lines: [
          { who: 'Khôi', role: 'a', text: "Hi. Can you recommend something for a sprained ankle? I think I twisted it playing football.", vi: 'Chào chị. Chị gợi ý giúp thuốc gì cho trẹo mắt cá chân được không? Em nghĩ em bị trẹo khi đá bóng.' },
          { who: 'Ruth', role: 'b', text: 'Ouch. When did it happen?', vi: 'Ui. Bị lúc nào thế?' },
          { who: 'Khôi', role: 'a', text: "Yesterday afternoon. It's quite swollen this morning, and it hurts when I walk.", vi: 'Chiều hôm qua ạ. Sáng nay nó sưng khá to, và em đi thì đau.' },
          { who: 'Ruth', role: 'b', text: 'Can you put any weight on it at all?', vi: 'Em có dồn được chút sức nặng lên chân đó không?' },
          { who: 'Khôi', role: 'a', text: "Yes, a bit. I walked here, but slowly.", vi: 'Được một chút ạ. Em đi bộ tới đây được, nhưng chậm.' },
          { who: 'Ruth', role: 'b', text: "That's a good sign. You should rest it, put ice on it for twenty minutes a few times a day, and keep it up on a cushion.", vi: 'Thế là dấu hiệu tốt. Em nên để chân nghỉ, chườm đá hai mươi phút vài lần mỗi ngày, và kê chân cao lên gối.' },
          { who: 'Khôi', role: 'a', text: "Okay. Should I take anything for the pain?", vi: 'Vâng. Em có nên uống gì giảm đau không ạ?' },
          { who: 'Ruth', role: 'b', text: "Paracetamol's fine. Are you taking any other medicine, or are you allergic to anything?", vi: 'Paracetamol là được. Em có đang uống thuốc nào khác, hay dị ứng gì không?' },
          { who: 'Khôi', role: 'a', text: "No, nothing. How often should I take it?", vi: 'Dạ không ạ. Em nên uống bao lâu một lần?' },
          { who: 'Ruth', role: 'b', text: "Two tablets, up to four times a day, at least four hours apart. And you shouldn't play football for a couple of weeks.", vi: 'Hai viên, tối đa bốn lần một ngày, cách nhau ít nhất bốn tiếng. Và vài tuần tới em không nên đá bóng.' },
          { who: 'Khôi', role: 'a', text: "So, two tablets, four hours apart, no more than four times a day. And if it doesn't get better?", vi: 'Vậy là hai viên, cách nhau bốn tiếng, không quá bốn lần một ngày. Thế nếu không đỡ thì sao ạ?' },
          { who: 'Ruth', role: 'b', text: "If you can't walk on it, or it's no better in a few days, you should get it checked at an urgent treatment centre.", vi: 'Nếu em không đi được, hoặc vài ngày nữa không đỡ, em nên tới trung tâm điều trị khẩn để kiểm tra.' },
        ],
      },
      {
        t: 'build',
        id: 'gtd7-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu của Khôi (5 câu)',
        items: [
          { vi: 'Chị gợi ý giúp thuốc gì cho trẹo mắt cá chân được không?', chips: ['Can', 'you', 'recommend', 'something', 'for', 'a', 'sprained', 'ankle?', 'to', 'some'], answer: ['Can', 'you', 'recommend', 'something', 'for', 'a', 'sprained', 'ankle?'] },
          { vi: 'Em đi thì đau.', chips: ['It', 'hurts', 'when', 'I', 'walk.', 'hurt', 'if', 'am'], answer: ['It', 'hurts', 'when', 'I', 'walk.'] },
          { vi: 'Em có nên uống gì giảm đau không?', chips: ['Should', 'I', 'take', 'anything', 'for', 'the', 'pain?', 'drink', 'to'], answer: ['Should', 'I', 'take', 'anything', 'for', 'the', 'pain?'] },
          { vi: 'Em nên uống bao lâu một lần?', chips: ['How', 'often', 'should', 'I', 'take', 'it?', 'much', 'long', 'drink'], answer: ['How', 'often', 'should', 'I', 'take', 'it?'] },
          { vi: 'Em bị đau bụng hai ngày rồi.', chips: ["I've", 'had', 'a', 'stomach', 'ache', 'for', 'two', 'days.', 'since', 'am'], answer: ["I've", 'had', 'a', 'stomach', 'ache', 'for', 'two', 'days.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd7-noi-tra-loi',
        part: '1',
        questions: [
          "You don't look very well. What's the matter?",
          'How long have you had it?',
          'Are you taking anything for it?',
          'What do people in Vietnam usually do when they have a cold?',
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Ruth, a friendly pharmacist in Manchester, England. I am a Vietnamese intern. I come into the pharmacy with a health problem: choose one for me at random (a bad cold, a rash, an upset stomach or a sprained wrist) and tell me which one at the start. Ask me the usual pharmacist questions one at a time: who the medicine is for, what the symptoms are, how long I have had them, whether I am taking other medicine, and whether I have any allergies. Then give me advice with should and shouldn\'t, and tell me when I should see a GP. Speak at a natural but clear speed (A2+ / B1 level). If I say \'I am headache\', \'drink medicine\' or \'since two days\', correct me gently. After 10 turns, tell me in Vietnamese two things I did well and two things to fix."',
          'Làm **2 lượt** với hai bệnh khác nhau. Lượt hai, nhớ **đọc lại cách dùng thuốc** ("So that\'s… right?") trước khi cảm ơn.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd7-doc',
    kind: 'reading',
    title: 'Đơn thuốc, hướng dẫn dùng thuốc, bảo hiểm',
    goal: 'Đọc đúng nhãn thuốc và tờ hướng dẫn (liều, số lần, trước hay sau ăn, tác dụng phụ), tin nhắn hẹn của phòng khám và điều khoản bảo hiểm du học cần nhớ khi đi khám.',
    minutes: 20,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn mẩu chữ **thật** Khôi cầm trong tay tuần đó: **nhãn hộp thuốc**, **tờ hướng dẫn**, **tin nhắn của phòng khám**, **trang điều khoản bảo hiểm**.',
          'Đọc nhãn thuốc là việc **không được đoán**: một chữ "every" hay "maximum" đổi hẳn cách uống.',
          'Học cách đọc **giọng điệu** của văn bản y tế: câu mệnh lệnh ngắn, chữ IN HOA để cảnh báo.',
          'Từ bài Nói: should, for + thời gian, before / after food. Ở đây bạn gặp lại chúng dưới dạng chữ in.',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['pill', 'page-facing-up', 'mobile-phone', 'shield', 'receipt'],
        caption: 'Khôi đã khoẻ. Một tuần sau, Khôi đi khám vì nổi ban ngứa ở tay, được kê thuốc, rồi ngồi đọc mọi thứ để biết phải uống thế nào và có được bảo hiểm trả tiền không.',
      },
      {
        t: 'passage',
        title: "Khoi's medicine, messages and insurance",
        intro: 'Đọc một lượt, chưa tra từ. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**PHARMACY LABEL** — Mr Minh Khoi Pham · 19 Oct · Cetirizine 10 mg tablets × 30 · **Take ONE tablet ONCE a day.** · **May cause drowsiness.** If affected, do not drive or operate machinery. **Avoid alcoholic drink.** · Keep out of the reach and sight of children.',
          },
          {
            label: 'B',
            text: '**PATIENT INFORMATION LEAFLET (part)** — **Possible side effects.** Like all medicines, this medicine can cause side effects, although not everybody gets them. **Common** (may affect up to 1 in 10 people): tiredness, dry mouth, headache. **Rare** (may affect up to 1 in 1,000 people): fast heartbeat, swelling of the face or throat. **Stop taking this medicine and get medical help immediately** if your face, lips or throat start to swell.',
          },
          {
            label: 'C',
            text: '**TEXT MESSAGE** from Brookfield Medical Practice: Hi Minh Khoi, your appointment with Dr Reid is confirmed for **Mon 26 Oct at 10:40**. Please arrive 5 minutes early. **To cancel, reply CANCEL.** If you no longer need this appointment, please let us know so we can offer it to another patient. Do not reply to this message with medical questions.',
          },
          {
            label: 'D',
            text: '**STUDENT TRAVEL INSURANCE — What you need to know** · We cover medical treatment that you **need urgently** while you are abroad. We **do not cover** routine check-ups or **pre-existing conditions** (health problems you had before you travelled) unless you told us about them when you bought the policy. **An excess of £50 applies** to each claim: you pay the first £50. **Keep all receipts** and send us your claim **within 30 days** of treatment.',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd7-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Theo nhãn (A), Khôi uống thuốc thế nào?',
            options: ['Một viên mỗi bữa ăn', 'Một viên một lần mỗi ngày', 'Hai viên một ngày', 'Khi nào ngứa thì uống'],
            correct: 1,
            why: '"Take **ONE** tablet **ONCE** a day." once = một lần, twice = hai lần, three times = ba lần.',
          },
          {
            q: '"May cause drowsiness. If affected, do not drive" nghĩa là gì?',
            options: ['Thuốc chắc chắn làm buồn ngủ, không được lái xe', 'Thuốc có thể gây buồn ngủ; nếu thấy buồn ngủ thì không lái xe', 'Uống thuốc trước khi lái xe', 'Thuốc giúp tỉnh táo khi lái xe'],
            correct: 1,
            why: '**may** = có thể (không chắc chắn). **drowsiness** = buồn ngủ, lơ mơ. **If affected** = nếu bạn bị ảnh hưởng.',
          },
          {
            q: '"Avoid alcoholic drink" là lời gì?',
            options: ['Lời khuyên nên tránh rượu bia', 'Thuốc có chứa cồn', 'Uống thuốc với bia', 'Chỉ cấm rượu mạnh'],
            correct: 0,
            why: '**Avoid** + N = tránh. Văn bản y tế dùng câu mệnh lệnh ngắn thay cho "You shouldn\'t…".',
          },
          {
            q: 'Trong tờ hướng dẫn (B), "common" side effect nghĩa là gì?',
            options: ['Ai uống cũng bị', 'Có thể gặp ở tối đa 1 trên 10 người', 'Rất nguy hiểm', 'Chỉ gặp ở trẻ em'],
            correct: 1,
            why: '"**Common** (may affect **up to 1 in 10** people)". Tác dụng phụ "thường gặp" vẫn có nghĩa là phần lớn người uống **không** bị.',
          },
          {
            q: 'Khi nào phải ngừng thuốc và đi cấp cứu ngay?',
            options: ['Khi thấy mệt', 'Khi bị khô miệng', 'Khi mặt, môi hoặc cổ họng bắt đầu sưng', 'Khi quên uống một liều'],
            correct: 2,
            why: '"Stop taking this medicine and get medical help **immediately** if your face, lips or throat start to swell." Đây là dấu hiệu dị ứng nặng.',
          },
          {
            q: 'Tin nhắn (C) muốn Khôi làm gì nếu không cần đi khám nữa?',
            options: ['Không làm gì', 'Gọi cho bác sĩ Reid', 'Nhắn CANCEL để huỷ, nhường lịch cho người khác', 'Đến sớm 5 phút'],
            correct: 2,
            why: '"To cancel, reply CANCEL. If you no longer need this appointment, please let us know so we can **offer it to another patient**." Ở Anh lịch GP khan hiếm, bỏ hẹn không báo bị coi là thiếu ý thức.',
          },
          {
            q: 'Theo bảo hiểm (D), "an excess of £50" nghĩa là gì?',
            options: ['Bảo hiểm trả thêm 50 bảng', 'Khôi tự trả 50 bảng đầu tiên mỗi lần yêu cầu bồi thường', 'Phí mua bảo hiểm là 50 bảng', 'Khám dưới 50 bảng thì miễn phí'],
            correct: 1,
            why: '"you pay the first £50". **excess** (Anh) = **deductible** (Mỹ) = phần tiền bạn tự chịu.',
          },
          {
            q: 'Khôi bị ban ngứa từ trước khi sang Anh và không khai khi mua bảo hiểm. Bảo hiểm có trả không?',
            options: ['Có, vì đó là bệnh cần chữa', 'Không, vì đó là bệnh có từ trước và không khai', 'Có, nếu giữ hoá đơn', 'Chỉ trả một nửa'],
            correct: 1,
            why: '"We do not cover **pre-existing conditions** … unless you told us about them". Khi mua bảo hiểm, **khai hết** bệnh đang có.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp trên nhãn thuốc và giấy tờ y tế' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['once / twice / three times a day', 'một / hai / ba lần một ngày', 'Nhãn thuốc'],
          ['every 4–6 hours', 'cách nhau 4–6 tiếng một lần', 'Nhãn thuốc'],
          ['Do not exceed the stated dose.', 'Không uống quá liều ghi trên nhãn.', 'Hộp thuốc'],
          ['with or after food · on an empty stomach', 'trong hoặc sau bữa ăn · lúc bụng đói', 'Nhãn thuốc'],
          ['May cause drowsiness.', 'Có thể gây buồn ngủ.', 'Nhãn cảnh báo'],
          ['Complete the course.', 'Uống hết đợt thuốc dù đã thấy khỏi.', 'Nhãn kháng sinh'],
          ['side effects', 'tác dụng phụ', 'Tờ hướng dẫn'],
          ['Seek medical advice.', 'Hỏi ý kiến bác sĩ / dược sĩ.', 'Tờ hướng dẫn'],
          ['pre-existing condition', 'bệnh có từ trước', 'Bảo hiểm'],
          ['excess · make a claim', 'phần tự chịu · yêu cầu bồi thường', 'Bảo hiểm'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc giọng điệu văn bản y tế',
        items: [
          '**Chữ IN HOA** (ONE, ONCE, DO NOT) = chỗ người viết sợ bạn đọc nhầm. Đọc chậm lại đúng chỗ đó.',
          '**may** = có thể xảy ra, không chắc. **must** / **do not** = bắt buộc. Một chữ "may" khác hẳn một chữ "will".',
          '**Câu mệnh lệnh ngắn** (Take…, Avoid…, Keep…) không phải giọng hách dịch. Đó là cách viết chuẩn của mọi nhãn thuốc.',
          'Tin nhắn phòng khám thường ghi "**Do not reply with medical questions**": muốn hỏi về bệnh thì **gọi điện**, đừng nhắn vào số tự động.',
        ],
      },

      { t: 'h', text: '3. Đọc nhãn, trả lời bằng số' },
      {
        t: 'quiz',
        id: 'gtd7-doc-nhan',
        title: 'Nhãn: "Take TWO tablets every FOUR to SIX hours. Do not take more than EIGHT tablets in 24 hours." (5 câu)',
        kind: 'fill',
        items: [
          { q: 'Mỗi lần uống mấy viên? ___', answers: ['2', 'two', 'hai'] },
          { q: 'Hai lần uống cách nhau ít nhất mấy tiếng? ___', answers: ['4', 'four', 'bốn'] },
          { q: 'Tối đa bao nhiêu viên trong 24 giờ? ___', answers: ['8', 'eight', 'tám'] },
          { q: 'Vậy một ngày uống tối đa mấy lần? ___', answers: ['4', 'four', 'bốn'] },
          { q: 'Bạn uống lúc 8 giờ sáng. Sớm nhất mấy giờ được uống lần sau? (ghi dạng 12 pm) ___', answers: ['12 pm', '12pm', '12:00', '12', '12 giờ', '12:00 pm', 'noon', '12 noon'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd7-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 7',
    goal: 'Làm 34 câu có đáp án để nói chắc triệu chứng, thời gian, lời khuyên và đặt lịch khám; ôn lại câu hỏi lại (Ngày 2) và chỉ đường (Ngày 6).',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền have / feel / should / for / since · dịch · nghe chép · ghép câu.',
          'Có câu ôn **Ngày 2** (hỏi lại khi không nghe kịp), **Ngày 4** (dị ứng) và **Ngày 6** (chỉ đường).',
          'Sai câu nào, đọc giải thích rồi **nói to câu đúng 2 lần**.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 8.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd7-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Bạn bị sốt và muốn nói với dược sĩ. Câu nào đúng?',
            options: ['I am fever.', "I've got a temperature.", 'I have hot.', 'My body is fever.'],
            correct: 1,
            why: '**I\'ve got a temperature** (Anh) hoặc **I have a fever** (Mỹ). Bệnh là danh từ, đi với **have**.',
          },
          {
            q: 'Ở London, đồng nghiệp nói "I\'ve been sick twice this morning." Ý họ là:',
            options: ['Họ ốm hai ngày rồi', 'Sáng nay họ nôn hai lần', 'Họ đi khám hai lần', 'Họ nghỉ làm hai lần'],
            correct: 1,
            why: 'Ở Anh, **be sick** = nôn. "I\'ve been sick twice" = đã nôn hai lần.',
          },
          {
            q: 'Đồng nghiệp ho liên tục ở bàn làm việc. Lời khuyên nào tự nhiên và vừa mức?',
            options: ['You must go home now!', 'Maybe you should go home and rest.', 'Go to hospital.', 'You are sick, go.'],
            correct: 1,
            why: '**Maybe you should…** là lời khuyên mềm, hợp với đồng nghiệp. "must" là ra lệnh; "hospital" là chuyện nặng.',
          },
          {
            q: 'Dược sĩ hỏi: "How long have you had it?" Câu trả lời nào đúng?',
            options: ['Since three days.', 'For three days.', 'Three days ago.', 'In three days.'],
            correct: 1,
            why: '**for** + khoảng thời gian. "Since" phải đi với mốc: since Monday. "In three days" là "ba ngày nữa".',
          },
          {
            q: 'Bạn gọi phòng khám, bệnh không nặng nhưng muốn khám trong ngày. Bạn nói:',
            options: ["It's an emergency! Help!", "It's not an emergency, but I'd like to see a doctor today.", 'Give me a doctor now.', 'I go to hospital today.'],
            correct: 1,
            why: 'Nói rõ **mức độ** giúp lễ tân xếp đúng lịch. Bệnh không nguy hiểm thì đừng nói "emergency".',
          },
          {
            q: 'Bạn bị cảm, gặp khách và không muốn bắt tay. Câu nào lịch sự nhất?',
            options: ["Don't touch me.", "Sorry, I won't shake hands. I've got a cold.", 'No hand.', "I'm cold, sorry."],
            correct: 1,
            why: 'Từ chối bắt tay **kèm lý do**. Người ta sẽ cảm ơn bạn. "I\'m cold" lại là "tôi thấy lạnh".',
          },
          {
            q: 'Dược sĩ nói nhanh: "Two every four to six hours, with food." Bạn chưa chắc. Bạn nói (ôn Ngày 2):',
            options: ['What?', 'Okay. (rồi về đoán)', "Sorry, so that's two tablets every four to six hours, with food. Is that right?", 'Speak again.'],
            correct: 2,
            why: '**Đọc lại để xác nhận** là cách chắc ăn nhất với cách dùng thuốc. "What?" và "Speak again" cộc lốc.',
          },
          {
            q: 'Trước khi nhận thuốc, bạn cần nói với dược sĩ mình dị ứng penicillin (ôn Ngày 4). Câu nào đúng?',
            options: ['I allergy penicillin.', "I'm allergic to penicillin.", 'Penicillin is my allergy.', 'I am allergic with penicillin.'],
            correct: 1,
            why: '**be allergic to + N**. Giới từ là **to**, không phải with.',
          },
          {
            q: 'Một đồng nghiệp người Anh vừa đi làm lại sau ba ngày ốm. Câu nào vừa mức nhất?',
            options: ['What disease did you have? What medicine?', "Oh, good to see you back! Feeling better?", 'You look very bad still.', 'Why were you absent?'],
            correct: 1,
            why: 'Hỏi thăm **ngắn**, không hỏi chi tiết bệnh. Người kia muốn kể thì họ tự kể.',
          },
          {
            q: 'Một khách du lịch hỏi bạn hiệu thuốc ở đâu (ôn Ngày 6). Câu nào chỉ đường đúng?',
            options: ['Go straight, then turn left. It\'s next to the bank.', 'You go straight and turning left.', 'Straight go, left turn.', 'It is next the bank.'],
            correct: 0,
            why: 'Câu mệnh lệnh: **Go straight, then turn left.** Giới từ nơi chốn: **next to**.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền một từ' },
      {
        t: 'quiz',
        id: 'gtd7-bt-dien',
        title: "Phần II — Điền have / has / feel / should / shouldn't / for / since / when (8 câu)",
        kind: 'fill',
        grammar: "have / has + a + bệnh · feel + adj · should / shouldn't + V · for + bao lâu · since + mốc",
        items: [
          { q: "I've got a headache, and I ___ a bit dizzy.", answers: ['feel'] },
          { q: 'She ___ got a sore back after the long flight.', answers: ['has', "'s", 's'] },
          { q: "You ___ drink coffee when you've got an upset stomach. (không nên)", answers: ["shouldn't", 'should not', 'shouldnt'] },
          { q: "I've had this cough ___ about ten days.", answers: ['for'] },
          { q: "I've had a temperature ___ Sunday night.", answers: ['since'] },
          { q: 'It hurts ___ I breathe in.', answers: ['when'] },
          { q: '___ I take these before or after food?', answers: ['Should', 'Do'] },
          { q: 'I ___ a runny nose and a sore throat.', answers: ['have', "'ve got", 've got', 'have got'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd7-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (6 câu)',
        kind: 'translate',
        grammar: "have got + a + bệnh · should / shouldn't · for / since · I'd like to…",
        items: [
          { q: 'Tôi thấy không khoẻ.', hint: 'not feeling well', answers: ["I'm not feeling well.", 'I am not feeling well.', "I don't feel well.", 'I do not feel well.'] },
          { q: 'Tôi bị đau bụng từ tối qua.', hint: "I've had, stomach ache, since", answers: ["I've had a stomach ache since last night.", 'I have had a stomach ache since last night.', "I've had stomach ache since last night.", "I've had a stomachache since last night."] },
          { q: 'Tôi muốn đặt lịch gặp bác sĩ.', hint: "I'd like to, make an appointment", answers: ["I'd like to make an appointment to see a doctor.", "I'd like to make an appointment with a doctor.", 'I would like to make an appointment to see a doctor.', "I'd like to make a doctor's appointment.", "I'd like to make an appointment."] },
          { q: 'Bạn nên uống nhiều nước.', hint: 'should, drink, lots of / plenty of', answers: ['You should drink lots of water.', 'You should drink a lot of water.', 'You should drink plenty of water.', 'You should drink more water.'] },
          { q: 'Tôi uống cái này trước hay sau khi ăn?', hint: 'should I take, before or after food', answers: ['Should I take this before or after food?', 'Should I take it before or after food?', 'Do I take this before or after food?', 'Should I take this before or after meals?', 'Should I take it before or after meals?', 'Should I take this before or after eating?'] },
          { q: 'Mong bạn sớm khoẻ.', hint: 'hope, feel better', answers: ['I hope you feel better soon.', 'Hope you feel better soon.', 'Get well soon.', 'I hope you get well soon.', 'Hope you get well soon.'] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd7-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "I've got a blocked nose and a dry cough.", answer: "I've got a blocked nose and a dry cough.", alt: ['I have got a blocked nose and a dry cough.', "I've got a blocked nose and a dry cough"] },
          { label: 'Câu 2', spell: 'How often should I take it?', answer: 'How often should I take it?' },
          { label: 'Câu 3', spell: 'It hurts when I bend down.', answer: 'It hurts when I bend down.' },
          { label: 'Câu 4', spell: "You shouldn't go to work like this.", answer: "You shouldn't go to work like this.", alt: ['You should not go to work like this.'] },
          { label: 'Câu 5', spell: 'Take one tablet twice a day, after food.', answer: 'Take one tablet twice a day, after food.', alt: ['Take one tablet twice a day after food.', 'Take 1 tablet twice a day, after food.'] },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd7-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Đã có ai giúp anh/chị chưa? (câu của người bán hàng ở Anh)', chips: ['Are', 'you', 'being', 'looked', 'after?', 'looking', 'for'], answer: ['Are', 'you', 'being', 'looked', 'after?'] },
          { vi: 'Kháng sinh phải có đơn bác sĩ.', chips: ['Antibiotics', 'are', 'prescription', 'only.', 'is', 'need'], answer: ['Antibiotics', 'are', 'prescription', 'only.'] },
          { vi: 'Bạn không nên ăn đồ cay vài ngày.', chips: ['You', "shouldn't", 'eat', 'spicy', 'food', 'for', 'a', 'few', 'days.', 'since', 'to'], answer: ['You', "shouldn't", 'eat', 'spicy', 'food', 'for', 'a', 'few', 'days.'] },
          { vi: 'Tôi bị phát ban ở tay, ngứa lắm.', chips: ["I've", 'got', 'a', 'rash', 'on', 'my', 'arm,', 'and', "it's", 'really', 'itchy.', 'in', 'am'], answer: ["I've", 'got', 'a', 'rash', 'on', 'my', 'arm,', 'and', "it's", 'really', 'itchy.'] },
          { vi: 'Không phải cấp cứu, nhưng tôi muốn được khám hôm nay.', chips: ["It's", 'not', 'an', 'emergency,', 'but', "I'd", 'like', 'to', 'see', 'a', 'doctor', 'today.', 'so', 'meet'], answer: ["It's", 'not', 'an', 'emergency,', 'but', "I'd", 'like', 'to', 'see', 'a', 'doctor', 'today.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Chuẩn bị sẵn **"thẻ sức khoẻ"** của bạn bằng tiếng Anh trong điện thoại: nhóm máu (nếu biết), thuốc đang dùng, dị ứng, một số người thân. Viết bằng câu: "I\'m allergic to… · I take… for…".',
          'Nói to một lượt: "I\'ve got a… I\'ve had it for… It hurts when I… Should I…?" với một bệnh bạn từng bị thật.',
          'Ngày 8: thuê nhà ở Dublin — xem phòng, báo đồ hỏng, nói chuyện với chủ nhà và hàng xóm.',
        ],
      },
    ],
  },
];
