/**
 * Bài nghe chặng 2 — 4 bài phủ đủ bốn Section của đề thật.
 *
 * Nâng lên so với chặng 1 ở ba điểm:
 *   1. Đủ BỐN dạng section: Section 1 (điền phiếu), Section 2 (một người nói +
 *      chỉ đường trên bản đồ), Section 3 (hai sinh viên bàn bài, có đổi ý),
 *      Section 4 (bài giảng học thuật, nói liên tục không nghỉ).
 *   2. Nói dài hơn và ít nhắc lại hơn — đúng như đề thật.
 *   3. Câu hỏi được PARAPHRASE: từ trong câu hỏi không trùng từ trong bài.
 *
 * Vẫn dùng transcript tự viết + giọng đọc trình duyệt, vì lý do đã ghi ở
 * `stage1/listening.ts`: hỏi theo video nhúng thì phải bịa câu hỏi.
 */
import type { ListeningExercise, ListeningSource } from '../types';

export const LISTENINGS2: ListeningExercise[] = [
  /* ─────────────── SECTION 1 ─────────────── */
  {
    id: 's2l1',
    title: 'Enrolling on an Evening Course',
    titleVi: 'Đăng ký khoá học buổi tối',
    kind: 'Section 1 — Form Completion, có bẫy đổi ý',
    level: 'Vừa · nói nhanh hơn chặng 1',
    context:
      'Một người gọi điện đăng ký khoá học buổi tối. Điền vào phiếu. Chú ý: người nói ĐỔI Ý vài lần — đáp '
      + 'án luôn là thông tin sau cùng.',
    lines: [
      { who: 'Nhân viên', text: 'Good evening, Riverside Community College. How can I help?' },
      { who: 'Khách', text: 'Hi. I saw your advert for evening classes and I would like to enrol.' },
      { who: 'Nhân viên', text: 'Certainly. Which course were you interested in?' },
      { who: 'Khách', text: 'The photography one — actually no, sorry, I meant the graphic design course.' },
      { who: 'Nhân viên', text: 'Graphic design. That runs on Tuesday and Thursday evenings.' },
      { who: 'Khách', text: 'And what time does it start?' },
      { who: 'Nhân viên', text: 'Half past six until half past eight. Two hours each session.' },
      { who: 'Khách', text: 'How many weeks does the whole thing last?' },
      { who: 'Nhân viên', text: 'Twelve weeks, starting on the ninth of October.' },
      { who: 'Khách', text: 'Right. And the fee?' },
      { who: 'Nhân viên', text: 'It is two hundred and forty pounds. However, if you are a student, there is a reduced rate of one hundred and eighty.' },
      { who: 'Khách', text: 'I am a full-time student, so the lower rate applies.' },
      { who: 'Nhân viên', text: 'In that case bring your student card to the first session. Could I take your surname?' },
      { who: 'Khách', text: 'It is Pham. P-H-A-M.' },
      { who: 'Nhân viên', text: 'Thank you. And a contact number?' },
      { who: 'Khách', text: 'Oh double six, four one three, oh nine.' },
      { who: 'Nhân viên', text: 'Let me read that back — oh double six, four one three, oh nine.' },
      { who: 'Khách', text: 'That is correct. Do I need to bring anything else?' },
      { who: 'Nhân viên', text: 'Just a laptop. All the software is provided, but we do not supply computers.' },
    ],
    questions: [
      {
        q: 'Course chosen: ____________ design',
        answer: 'graphic',
        why:
          'Khách nói "photography — actually no, sorry, I meant the graphic design course". Từ "actually" và '
          + '"sorry" báo hiệu ĐỔI Ý; đáp án là thông tin sau cùng.',
      },
      {
        q: 'Classes are held on Tuesday and ____________ evenings.',
        answer: 'Thursday',
        why: '"That runs on Tuesday and Thursday evenings." Chú ý cặp Tuesday/Thursday rất dễ nghe nhầm.',
      },
      {
        q: 'Each session finishes at ____________ pm.',
        answer: '8.30',
        alt: ['20.30', '8:30', 'half past eight', '830'],
        why: '"Half past six until half past eight" — câu hỏi hỏi giờ KẾT THÚC nên đáp án là 8.30.',
      },
      {
        q: 'The course lasts ____________ weeks.',
        answer: '12',
        alt: ['twelve'],
        why: '"Twelve weeks, starting on the ninth of October."',
      },
      {
        q: 'Start date: ____________ October',
        answer: '9',
        alt: ['9th', 'ninth'],
        why: '"starting on the ninth of October". Ngày đọc bằng số thứ tự nhưng viết số thường được.',
      },
      {
        q: 'Fee the caller will pay: £____________',
        answer: '180',
        alt: ['one hundred and eighty'],
        why:
          'Nêu HAI giá: 240 và 180. Từ "However" báo hiệu đảo hướng, và khách xác nhận là sinh viên toàn thời '
          + 'gian nên áp mức thấp. Đáp án là 180, không phải 240.',
      },
      {
        q: 'Surname: ____________',
        answer: 'Pham',
        why: '"It is Pham. P-H-A-M." Câu hỏi hỏi HỌ nên chỉ viết Pham.',
      },
      {
        q: 'Phone number: ____________',
        answer: '0664130 9',
        alt: ['06641309', '0664 1309', '0 66 413 09'],
        why:
          '"Oh double six, four one three, oh nine" → 0-6-6-4-1-3-0-9. "oh" = 0, "double six" = 66. Nhân viên '
          + 'đọc lại một lần để bạn kiểm tra.',
      },
    ],
    listenFor: ['actually / sorry / I meant (đổi ý)', 'However (đảo hướng)', 'double = hai số giống nhau', 'giá thứ hai mới là đáp án'],
    tips: [
      'Section 1 chặng 2 khác chặng 1 ở chỗ có BẪY ĐỔI Ý. Đừng ghi ngay thông tin đầu tiên nghe được — chờ hết ý.',
      '"However" gần như luôn báo hiệu thông tin sắp tới mới là đáp án.',
      'Khi nêu hai mức giá, đáp án là mức ÁP DỤNG CHO NGƯỜI NÓI, không phải mức được nêu trước.',
    ],
  },

  /* ─────────────── SECTION 2 ─────────────── */
  {
    id: 's2l2',
    title: 'Welcome Tour of the Sports Centre',
    titleVi: 'Giới thiệu trung tâm thể thao',
    kind: 'Section 2 — một người nói + Map Labelling',
    level: 'Khó vừa · nhiều giới từ chỉ hướng',
    context:
      'Một nhân viên dẫn đoàn tham quan trung tâm thể thao. Đây là dạng Map Labelling — vừa nghe vừa DI '
      + 'NGÓN TAY theo lời chỉ dẫn. Ôn lại bộ giới từ chỉ hướng trước khi nghe.',
    lines: [
      {
        who: 'Hướng dẫn',
        text:
          'Welcome everyone. We are standing at the main entrance, and I will take you through the layout '
          + 'quickly before you go off on your own.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'Directly opposite the entrance, on the far side of the reception area, you will find the swimming '
          + 'pool. You cannot miss it.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'If you turn left from where we are standing and walk along the corridor, the gym is the second door '
          + 'on your right. The first door is a store room, so do not go in there by mistake.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'At the very end of that same corridor there is a cafe, which is open until nine on weekdays but '
          + 'closes at five at weekends.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'Now, if instead you turn right from the entrance, you come to the changing rooms. They are between '
          + 'reception and the squash courts.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'The squash courts themselves are behind the changing rooms, and you have to book those in advance — '
          + 'at least twenty-four hours before, using the app.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'Upstairs, above the reception, is the studio where the yoga and dance classes are held. The stairs '
          + 'are just next to the noticeboard.',
      },
      {
        who: 'Hướng dẫn',
        text:
          'One last thing before you go. Lockers are free, but you need a one-pound coin, which you get back '
          + 'when you return the key. And please do not leave valuables in the changing rooms overnight.',
      },
    ],
    questions: [
      {
        q: 'The swimming pool is ____________ the main entrance.',
        answer: 'opposite',
        why: '"Directly opposite the entrance… you will find the swimming pool."',
      },
      {
        q: 'From the entrance, turn ____________ to reach the gym.',
        answer: 'left',
        why: '"If you turn left from where we are standing… the gym is the second door on your right."',
      },
      {
        q: 'The gym is the ____________ door on the right.',
        answer: 'second',
        alt: ['2nd'],
        why:
          'Bẫy: cửa THỨ NHẤT là kho chứa đồ. Nghe sót chi tiết này là điền nhầm "first".',
      },
      {
        q: 'The café is at the end of the corridor and closes at ____________ pm at weekends.',
        answer: '5',
        alt: ['five'],
        why:
          '"open until nine on weekdays but closes at five at weekends". Câu hỏi hỏi CUỐI TUẦN nên đáp án là 5, '
          + 'không phải 9.',
      },
      {
        q: 'The changing rooms are ____________ reception and the squash courts.',
        answer: 'between',
        why: '"They are between reception and the squash courts."',
      },
      {
        q: 'Squash courts must be booked at least ____________ hours in advance.',
        answer: '24',
        alt: ['twenty-four', 'twenty four'],
        why: '"at least twenty-four hours before, using the app".',
      },
      {
        q: 'The studio is located above the ____________.',
        answer: 'reception',
        why: '"Upstairs, above the reception, is the studio."',
      },
      {
        q: 'To use a locker you need a one-pound ____________.',
        answer: 'coin',
        why: '"Lockers are free, but you need a one-pound coin." Thông tin nằm ở đoạn "One last thing" — đừng buông tai sớm.',
      },
    ],
    listenFor: ['opposite / left / right / between / behind / above', 'second door (không phải first)', 'weekdays vs weekends', 'One last thing'],
    tips: [
      'Map Labelling: DI NGÓN TAY theo lời chỉ dẫn. Chỉ ghi chữ thôi thì rất dễ rối.',
      'Người nói hay nêu một thứ để LOẠI TRỪ ("the first door is a store room") — nghe sót là điền nhầm.',
      'Có cặp thông tin đối nhau (weekdays / weekends) thì gạch chân từ phân biệt trong câu hỏi TRƯỚC khi nghe.',
      '"One last thing" báo hiệu thông tin cuối — đề gần như luôn hỏi một câu ở đó.',
    ],
  },

  /* ─────────────── SECTION 3 ─────────────── */
  {
    id: 's2l3',
    title: 'Planning a Research Project',
    titleVi: 'Hai sinh viên bàn đề tài nghiên cứu',
    kind: 'Section 3 — hội thoại học thuật, nhiều lần đổi ý',
    level: 'Khó · đây là phần mất điểm nhiều nhất',
    context:
      'Hai sinh viên bàn với giảng viên về đề tài. Section 3 là phần khó nhất với người chặng 2 vì có nhiều '
      + 'lần đổi ý và ý kiến trái chiều. Quy tắc sống còn: đáp án là quyết định CUỐI CÙNG.',
    lines: [
      { who: 'Giảng viên', text: 'So, have you two settled on a topic yet?' },
      { who: 'Nam', text: 'We were thinking about sleep and memory, but there is already a lot of work on that.' },
      { who: 'Lan', text: 'We have moved on to something narrower — how background noise affects reading speed.' },
      { who: 'Giảng viên', text: 'That is more manageable. How were you planning to collect the data?' },
      { who: 'Nam', text: 'Originally we wanted to use a laboratory, but booking one takes weeks.' },
      { who: 'Lan', text: 'So we will run the sessions in an ordinary seminar room instead, with headphones for the noise.' },
      { who: 'Giảng viên', text: 'Sensible. How many participants?' },
      { who: 'Nam', text: 'We were aiming for a hundred.' },
      { who: 'Giảng viên', text: 'That is ambitious for one term. I would suggest around forty, done properly.' },
      { who: 'Lan', text: 'Forty it is, then. We can always extend later if there is time.' },
      { who: 'Giảng viên', text: 'And how will you measure reading speed?' },
      { who: 'Lan', text: 'Words per minute, with a short comprehension test afterwards so we know they actually read it.' },
      { who: 'Giảng viên', text: 'Good — without that check the speed figure means nothing. What about the write-up?' },
      { who: 'Nam', text: 'I will handle the literature review, and Lan is doing the statistics.' },
      { who: 'Lan', text: 'Although actually, I would rather do the methods section. Statistics is more your area.' },
      { who: 'Nam', text: 'Fair enough. I will take the statistics as well, then, and you do methods.' },
      { who: 'Giảng viên', text: 'Fine. Send me a one-page outline by the end of next week — Friday at the latest.' },
    ],
    questions: [
      {
        q: 'What is their final research topic?',
        answer: 'background noise and reading speed',
        alt: ['how background noise affects reading speed', 'noise and reading speed', 'reading speed'],
        why:
          'Ban đầu định làm giấc ngủ và trí nhớ nhưng bỏ vì đã có nhiều nghiên cứu. Chốt lại: "how background '
          + 'noise affects reading speed".',
      },
      {
        q: 'Where will the sessions take place?',
        answer: 'seminar room',
        alt: ['in a seminar room', 'an ordinary seminar room'],
        why:
          'Định dùng phòng thí nghiệm nhưng đặt mất hàng tuần, nên "we will run the sessions in an ordinary '
          + 'seminar room instead". Từ "instead" báo hiệu đổi ý.',
      },
      {
        q: 'How many participants will they recruit?',
        answer: '40',
        alt: ['forty'],
        why:
          'Định 100, giảng viên bảo quá tham vọng và đề xuất khoảng 40, Lan chốt "Forty it is". Bẫy: con số 100 '
          + 'được nói TRƯỚC nhưng không phải đáp án.',
      },
      {
        q: 'Reading speed will be measured in words per ____________.',
        answer: 'minute',
        why: '"Words per minute, with a short comprehension test afterwards."',
      },
      {
        q: 'Why is the comprehension test necessary?',
        answer: 'to check they actually read it',
        alt: ['to make sure they read it', 'so they know they actually read it', 'without it the speed figure means nothing'],
        why:
          'Giảng viên nói rõ: "without that check the speed figure means nothing" — nếu không kiểm thì con số '
          + 'tốc độ vô nghĩa.',
      },
      {
        q: 'Which section will Nam write?',
        answer: 'literature review and statistics',
        alt: ['literature review', 'the literature review and the statistics'],
        why:
          'Ban đầu Nam làm tổng quan tài liệu, Lan làm thống kê. Lan đổi ý muốn làm phần phương pháp, nên Nam '
          + 'nhận LUÔN cả thống kê. Đáp án là phân công CUỐI CÙNG.',
      },
      {
        q: 'Which section will Lan write?',
        answer: 'methods',
        alt: ['the methods section', 'methods section'],
        why: '"I would rather do the methods section" — và Nam đồng ý "you do methods".',
      },
      {
        q: 'The outline must be sent by ____________ at the latest.',
        answer: 'Friday',
        why: '"by the end of next week — Friday at the latest".',
      },
    ],
    listenFor: ['instead / although actually / I would rather (đổi ý)', 'Forty it is / Fair enough (chốt)', 'con số nói trước KHÔNG phải đáp án'],
    tips: [
      'Section 3 mất điểm nhiều nhất vì có 3–4 lần đổi ý trong một bài. Ghi nháp CẢ HAI phương án rồi gạch bỏ cái bị loại.',
      'Các cụm báo hiệu chốt: "… it is, then", "Fair enough", "Agreed", "Fine". Nghe thấy chúng là biết đáp án vừa được xác nhận.',
      '"I would rather…" là cách đổi ý lịch sự, rất hay gặp ở Section 3 — nó luôn thay thế điều vừa nói.',
      'Đừng ghi đáp án ngay khi nghe thấy một con số hợp lý. Chờ tới câu chốt.',
    ],
  },

  /* ─────────────── SECTION 4 ─────────────── */
  {
    id: 's2l4',
    title: 'Lecture: The History of Street Lighting',
    titleVi: 'Bài giảng: lịch sử đèn đường',
    kind: 'Section 4 — bài giảng, một người nói liên tục',
    level: 'Khó · không có ai nhắc lại thông tin',
    context:
      'Section 4 là một bài giảng học thuật, MỘT người nói liên tục không nghỉ, không có hội thoại để bám và '
      + 'không ai nhắc lại. Lỡ câu nào là mất luôn. Đọc trước phần ghi chú để biết phải chờ nghe cái gì.',
    lines: [
      {
        who: 'Giảng viên',
        text:
          'Today I want to look at street lighting, which is a good example of a technology that changed cities '
          + 'in ways nobody predicted.',
      },
      {
        who: 'Giảng viên',
        text:
          'Before the seventeenth century, most European cities were simply dark after sunset. Where any lighting '
          + 'existed, it was the responsibility of individual householders, who were required to hang a lantern '
          + 'outside their door.',
      },
      {
        who: 'Giảng viên',
        text:
          'The first organised public system appeared in Paris in the sixteen sixties. Oil lamps were installed '
          + 'along the main streets and paid for through a local tax. The stated purpose was to reduce crime, '
          + 'though there is little evidence that it did so.',
      },
      {
        who: 'Giảng viên',
        text:
          'What the lamps did change was social life. Shops began to stay open later, theatres moved their '
          + 'performances back, and walking in the evening became an ordinary activity rather than a risk. In '
          + 'other words, the effect was economic rather than criminal.',
      },
      {
        who: 'Giảng viên',
        text:
          'Gas lighting arrived at the beginning of the nineteenth century and spread very quickly, largely '
          + 'because it was far cheaper to run. However, it required a network of pipes, which meant that only '
          + 'wealthier districts were connected at first.',
      },
      {
        who: 'Giảng viên',
        text:
          'Electric lighting followed in the eighteen eighties. Early electric lamps were criticised for being '
          + 'too bright, and several cities received complaints that the new light was unpleasant compared with '
          + 'gas.',
      },
      {
        who: 'Giảng viên',
        text:
          'The modern concern is the opposite one. We now produce so much light at night that astronomers cannot '
          + 'see the sky from most urban areas, and there is growing evidence of effects on insects and on human '
          + 'sleep. Several cities have therefore begun dimming their lights after midnight.',
      },
      {
        who: 'Giảng viên',
        text:
          'Finally, one point worth remembering for your essays: each of these changes was introduced for one '
          + 'stated reason and ended up mattering for a completely different one.',
      },
    ],
    questions: [
      {
        q: 'Before the 1600s, lighting was the responsibility of individual ____________.',
        answer: 'householders',
        why: '"it was the responsibility of individual householders". Chép nguyên văn, giữ số nhiều.',
      },
      {
        q: 'The first organised public system appeared in ____________.',
        answer: 'Paris',
        why: '"The first organised public system appeared in Paris in the sixteen sixties."',
      },
      {
        q: 'The Paris lamps were paid for through a local ____________.',
        answer: 'tax',
        why: '"Oil lamps were installed along the main streets and paid for through a local tax."',
      },
      {
        q: 'The stated purpose of the Paris system was to reduce ____________.',
        answer: 'crime',
        why:
          '"The stated purpose was to reduce crime, though there is little evidence that it did so." Chú ý bài '
          + 'nói mục đích ĐƯỢC NÊU RA, không phải kết quả thật.',
      },
      {
        q: 'According to the lecturer, the real effect of the lamps was ____________ rather than criminal.',
        answer: 'economic',
        why: '"the effect was economic rather than criminal" — cửa hàng mở muộn hơn, nhà hát dời giờ diễn.',
      },
      {
        q: 'Gas lighting spread quickly mainly because it was ____________ to run.',
        answer: 'cheaper',
        alt: ['far cheaper'],
        why: '"it was far cheaper to run". Từ "largely because" báo hiệu lý do chính sắp tới.',
      },
      {
        q: 'At first, only ____________ districts were connected to gas.',
        answer: 'wealthier',
        alt: ['wealthy'],
        why: '"only wealthier districts were connected at first". Sau "However" là thông tin hạn chế — đề hay hỏi vào đó.',
      },
      {
        q: 'Early electric lamps were criticised for being too ____________.',
        answer: 'bright',
        why: '"Early electric lamps were criticised for being too bright."',
      },
    ],
    listenFor: ['largely because (lý do chính)', 'However (điều kiện hạn chế)', 'In other words (diễn giải lại)', 'Finally (ý cuối)'],
    tips: [
      'Section 4 KHÔNG có ai nhắc lại. Lỡ câu nào thì bỏ luôn câu đó và bám tiếp — tiếc một câu là mất cả cụm.',
      'Đọc trước toàn bộ phần ghi chú, đoán LOẠI TỪ cho mỗi chỗ trống. Biết mình đang chờ danh từ hay tính từ thì bắt nhanh hơn nhiều.',
      'Bài giảng luôn có cấu trúc theo thời gian hoặc theo chủ đề. Nắm được cấu trúc là biết mình đang ở đâu.',
      'Cụm "one point worth remembering", "Finally" báo hiệu ý tổng kết — thường là câu hỏi cuối.',
    ],
  },
];

/**
 * Nguồn nghe chặng 2 — đúng bộ đã ghim ở chặng 1 nhưng nay dùng CHỦ ĐỘNG.
 * Mọi ID đã kiểm oembed, kênh chính chủ.
 */
export const LISTENING_SOURCES2: ListeningSource[] = [
  {
    name: '6 Minute English (playlist)',
    channel: 'BBC Learning English',
    kind: 'playlist',
    ytId: 'PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt',
    level: 'B1 — nguồn nghe CHÍNH của chặng 2',
    how:
      'Ở chặng 1 bạn chỉ nghe thụ động lấy quen nhịp. Chặng 2 nghe CHỦ ĐỘNG: nghe một lần không phụ đề, chép '
      + 'chính tả 1–2 phút, rồi mở transcript trên trang BBC đối chiếu và phân loại lỗi theo bài 14.',
  },
  {
    name: '6 Minute English — bộ tổng hợp 1 giờ',
    channel: 'BBC Learning English',
    kind: 'video',
    ytId: 'fcN0BXzK8bg',
    level: 'B1 — nghe liền mạch',
    how:
      'Dùng để luyện sức bền khi nghe: Section 4 của đề thật nói liên tục không nghỉ, mà đó chính là thứ người '
      + 'chặng 2 chưa quen.',
  },
  {
    name: 'Box Sets — English In A Minute (playlist)',
    channel: 'BBC Learning English',
    kind: 'playlist',
    ytId: 'PLcetZ6gSk96-b8CXzFfpeF_M4ypAQneSu',
    level: 'A2–B1 — mỗi ý một phút',
    how: 'Dùng để nhặt cụm từ và thành ngữ. Mỗi mẩu xong tự đặt một câu, không đặt câu là hôm sau quên.',
  },
  {
    name: 'British Council IELTS (playlist chính thức)',
    channel: 'TakeIELTS Official — British Council',
    kind: 'playlist',
    ytId: 'PLrt2nkX3MUeBNAcBAap6B313_tlVRCAxz',
    level: 'Mọi trình độ — hướng dẫn về kỳ thi',
    how:
      'Chặng 2 là lúc nên xem kỹ kênh này: các video giải thích từng dạng câu hỏi và tiêu chí chấm, nối thẳng '
      + 'với tab Dạng câu hỏi của khoá.',
  },
];
