/**
 * Tiếng Anh giao tiếp — NGÀY 1 (chặng 1 "Sống sót", A2): gặp lần đầu.
 * Khuôn: listening · speaking · reading (ngày lẻ) · homework. Mọi id bắt đầu `gtd1-`.
 * Ngữ pháp trong câu: be + đại từ (I'm… / This is… / Nice to meet you) · nối câu bằng `and`.
 * Cảnh: Huy — sinh viên IT năm 3 — ngày đầu thực tập ở một công ty phần mềm tại Đà Nẵng.
 * Cách soạn: docs/en-giao-tiep-soan.md. Mọi hội thoại, câu ví dụ đều tự soạn.
 */
import type { Lesson } from '../data';

export const NGAY_1: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGHE CẢNH ═══════════════════════════ */
  {
    id: 'gtd1-nghe',
    kind: 'listening',
    title: 'Gặp lần đầu: chào, giới thiệu, hỏi thăm',
    goal: 'Nghe hiểu ba cảnh gặp mặt lần đầu ở công ty: ai là ai, họ hỏi thăm bằng câu gì và câu đó thật ra có nghĩa gì.',
    minutes: 28,
    blocks: [
      {
        t: 'recap',
        title: 'Hôm nay bạn ở đâu, gặp ai',
        items: [
          'Bạn theo chân **Huy**, sinh viên IT năm 3, trong **ngày đầu thực tập** ở một công ty phần mềm tại Đà Nẵng. Cả ngày Huy gặp 4 người nước ngoài.',
          'Bạn cần nghe ra: **tên** từng người, **họ làm gì**, **họ đến từ đâu**.',
          'Bạn sẽ gặp ba câu hỏi thăm làm người Việt "đứng hình": **How are you doing?**, **You alright?**, **How are you going?** Cả ba chỉ là lời chào.',
          'Nghe mỗi cảnh **2 lần**: lần 1 không xem lời thoại, lần 2 mở lời thoại và đọc theo.',
          'Tốc độ hôm nay chậm vừa (khoảng 130 từ/phút). Chưa nghe kịp cũng không sao, Ngày 2 dạy riêng cách hỏi lại.',
        ],
      },

      { t: 'h', text: 'Cảnh 1 — Ở sảnh công ty: nhầm người' },
      {
        t: 'canh',
        anh: ['office-building', 'man-student', 'backpack', 'woman-office-worker', 'name-badge'],
        caption: '8 giờ 20 sáng thứ Hai. **Huy** ngồi ở sảnh chờ người hướng dẫn tên là **Emma**. Một chị bước tới, tay cầm thẻ tên. Huy tưởng đó là Emma.',
      },
      {
        t: 'listen',
        id: 'gtd1-nghe-canh1',
        title: 'Scene 1 — In the lobby',
        note: 'Nghe xem chị này tên gì, làm ở bộ phận nào, và vì sao Emma chưa tới.',
        lines: [
          { who: 'Chloe', voice: 'nz-nu', text: 'Hi there! You must be Huy.', vi: 'Chào em! Em chắc là Huy rồi.' },
          { who: 'Huy', voice: 'us-nam', text: "Yes, I'm Huy. Good morning. Are you Emma?", vi: 'Vâng, em là Huy. Chào chị. Chị là Emma ạ?' },
          { who: 'Chloe', voice: 'nz-nu', text: "Oh no, I'm not Emma. I'm Chloe. I'm from HR.", vi: 'Ồ không, chị không phải Emma. Chị là Chloe. Chị ở phòng nhân sự.' },
          { who: 'Huy', voice: 'us-nam', text: "Oh, sorry! Nice to meet you, Chloe.", vi: 'Ôi, em xin lỗi! Rất vui được gặp chị, Chloe.' },
          { who: 'Chloe', voice: 'nz-nu', text: "No worries. Nice to meet you too. How are you doing?", vi: 'Không sao đâu. Chị cũng rất vui được gặp em. Em thế nào?' },
          { who: 'Huy', voice: 'us-nam', text: "I'm good, thanks. A little nervous. And you?", vi: 'Em ổn, cảm ơn chị. Hơi hồi hộp một chút. Còn chị?' },
          { who: 'Chloe', voice: 'nz-nu', text: "I'm good, thanks. Don't be nervous. Everyone here is really friendly.", vi: 'Chị ổn, cảm ơn em. Đừng hồi hộp. Mọi người ở đây thân thiện lắm.' },
          { who: 'Chloe', voice: 'nz-nu', text: "Emma is your mentor, but she's in a meeting this morning. She's sorry she can't be here.", vi: 'Emma là người hướng dẫn của em, nhưng sáng nay cô ấy bận họp. Cô ấy xin lỗi vì không ra đón được.' },
          { who: 'Huy', voice: 'us-nam', text: "That's okay. No problem.", vi: 'Không sao ạ. Không vấn đề gì.' },
          { who: 'Chloe', voice: 'nz-nu', text: 'Sorry, how do I say your name? Is it "Hoy"?', vi: 'Xin lỗi, tên em đọc thế nào nhỉ? Có phải là "Hoi" không?' },
          { who: 'Huy', voice: 'us-nam', text: 'Almost! It\'s "Huy". It sounds like "we" with an H. H-U-Y.', vi: 'Gần đúng rồi ạ! Là "Huy". Nghe giống chữ "we" thêm âm H ở đầu. H-U-Y.' },
          { who: 'Chloe', voice: 'nz-nu', text: 'Huy. Got it! And is Huy your first name?', vi: 'Huy. Chị hiểu rồi! Huy là tên của em đúng không?' },
          { who: 'Huy', voice: 'us-nam', text: "Yes. My full name is Tran Gia Huy, but please just call me Huy.", vi: 'Vâng. Tên đầy đủ của em là Trần Gia Huy, nhưng chị cứ gọi em là Huy thôi ạ.' },
          { who: 'Chloe', voice: 'nz-nu', text: "Great. Here's your name badge, Huy. Come with me. I'll show you around.", vi: 'Tuyệt. Thẻ tên của em đây, Huy. Đi với chị nhé. Chị dẫn em đi một vòng.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd1-nghe-canh1-hieu',
        title: 'Cảnh 1 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Chloe là ai?',
            options: ['Người hướng dẫn (mentor) của Huy', 'Nhân viên phòng nhân sự', 'Một thực tập sinh khác', 'Lễ tân của toà nhà'],
            correct: 1,
            why: 'Chloe nói: "I\'m not Emma. I\'m Chloe. **I\'m from HR**." HR = Human Resources, phòng nhân sự. Mentor của Huy là Emma.',
          },
          {
            q: 'Vì sao Emma không ra đón Huy?',
            options: ['Cô ấy nghỉ ốm', 'Cô ấy đến muộn vì kẹt xe', 'Cô ấy đang họp', 'Cô ấy quên'],
            correct: 2,
            why: '"She\'s **in a meeting** this morning." = Sáng nay cô ấy đang họp.',
          },
          {
            q: 'Chloe hỏi "How are you doing?". Huy trả lời thế nào?',
            options: ['Kể mình đang làm gì', 'Nói mình ổn, hơi hồi hộp, rồi hỏi lại', 'Nói "I\'m fine, thank you, and you?"', 'Không trả lời'],
            correct: 1,
            why: 'Huy nói: "I\'m good, thanks. A little nervous. **And you?**" Câu "How are you doing?" là hỏi thăm, không phải hỏi "bạn đang làm gì".',
          },
          {
            q: 'Huy muốn mọi người gọi mình là gì?',
            options: ['Mr Huy', 'Tran', 'Gia Huy', 'Huy'],
            correct: 3,
            why: '"My full name is Tran Gia Huy, but **please just call me Huy**."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 2 — Ở bếp công ty: "You alright?"' },
      {
        t: 'canh',
        anh: ['hot-beverage', 'woman-office-worker', 'man-technologist', 'woman-technologist', 'waving-hand'],
        caption: 'Chloe dẫn Huy vào **khu bếp** (kitchen) của công ty. Hai đồng nghiệp đang pha cà phê: **Oliver** người Anh và **Sophie** người Úc. Mỗi người chào Huy một kiểu.',
      },
      {
        t: 'listen',
        id: 'gtd1-nghe-canh2',
        title: 'Scene 2 — In the office kitchen',
        note: 'Nghe xem Oliver và Sophie làm việc gì, và Huy hiểu nhầm câu nào.',
        lines: [
          { who: 'Chloe', voice: 'nz-nu', text: 'Morning, guys! This is Huy. He\'s our new intern.', vi: 'Chào mọi người! Đây là Huy. Em ấy là thực tập sinh mới của mình.' },
          { who: 'Oliver', voice: 'uk-nam', text: "Hi, Huy. I'm Oliver. You alright?", vi: 'Chào Huy. Anh là Oliver. Khoẻ không em?' },
          { who: 'Huy', voice: 'us-nam', text: 'Um… yes, I\'m okay. Do I look sick?', vi: 'Ờ… vâng, em ổn ạ. Trông em có vẻ ốm ạ?' },
          { who: 'Oliver', voice: 'uk-nam', text: 'Ha ha, no, no! Sorry. In England, "You alright?" just means "Hello, how are you?"', vi: 'Ha ha, không, không! Xin lỗi em. Ở Anh, "You alright?" chỉ có nghĩa là "Chào, em khoẻ không?" thôi.' },
          { who: 'Huy', voice: 'us-nam', text: 'Oh, I see! Then I\'m good, thanks. Nice to meet you, Oliver.', vi: 'À, em hiểu rồi! Thế thì em khoẻ, cảm ơn anh. Rất vui được gặp anh, Oliver.' },
          { who: 'Oliver', voice: 'uk-nam', text: "You too. I'm a designer. I'm from Manchester.", vi: 'Anh cũng vậy. Anh là nhà thiết kế. Anh đến từ Manchester.' },
          { who: 'Chloe', voice: 'nz-nu', text: 'And this is Sophie. She\'s a tester on your team.', vi: 'Còn đây là Sophie. Chị ấy là tester trong nhóm của em.' },
          { who: 'Sophie', voice: 'au-nu', text: "Hi, Huy! Welcome. How are you going?", vi: 'Chào Huy! Chào mừng em. Em thế nào?' },
          { who: 'Huy', voice: 'us-nam', text: "Good, thanks! It's my first day, so everything is new.", vi: 'Em ổn, cảm ơn chị! Hôm nay là ngày đầu của em nên cái gì cũng mới.' },
          { who: 'Sophie', voice: 'au-nu', text: "You'll be fine. Where are you from, Huy? Are you from Da Nang?", vi: 'Em sẽ ổn thôi. Em quê ở đâu, Huy? Em là người Đà Nẵng à?' },
          { who: 'Huy', voice: 'us-nam', text: "No, I'm from Hoi An. It's about forty minutes from here.", vi: 'Không ạ, em quê ở Hội An. Cách đây khoảng bốn mươi phút.' },
          { who: 'Sophie', voice: 'au-nu', text: "Oh, I love Hoi An! I'm from Melbourne, in Australia.", vi: 'Ồ, chị mê Hội An lắm! Chị đến từ Melbourne, ở Úc.' },
          { who: 'Oliver', voice: 'uk-nam', text: 'And what do you do, Huy? Are you a student?', vi: 'Thế em làm gì, Huy? Em là sinh viên à?' },
          { who: 'Huy', voice: 'us-nam', text: "Yes, I'm a third-year student. I study software engineering.", vi: 'Vâng, em là sinh viên năm ba. Em học kỹ thuật phần mềm.' },
          { who: 'Sophie', voice: 'au-nu', text: "Nice. We're having lunch at twelve. Come and join us!", vi: 'Hay đấy. Bọn chị ăn trưa lúc mười hai giờ. Đi cùng bọn chị nhé!' },
          { who: 'Huy', voice: 'us-nam', text: "Thank you! I'd love to.", vi: 'Cảm ơn chị! Em rất muốn ạ.' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd1-nghe-canh2-hieu',
        title: 'Cảnh 2 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Oliver hỏi "You alright?". Câu này nghĩa là gì?',
            options: ['Em bị ốm à?', 'Em có sao không?', 'Chào em, khoẻ không?', 'Em làm đúng chưa?'],
            correct: 2,
            why: 'Oliver tự giải thích: ở Anh, "You alright?" chỉ là **"Hello, how are you?"**. Huy tưởng mình trông ốm nên hỏi lại "Do I look sick?".',
          },
          {
            q: 'Ai là tester trong nhóm của Huy?',
            options: ['Chloe', 'Oliver', 'Sophie', 'Emma'],
            correct: 2,
            why: '"This is Sophie. **She\'s a tester on your team**." Oliver là designer, Chloe ở phòng nhân sự.',
          },
          {
            q: 'Huy quê ở đâu?',
            options: ['Đà Nẵng', 'Hội An', 'Huế', 'Melbourne'],
            correct: 1,
            why: 'Sophie hỏi "Are you from Da Nang?", Huy đáp: "No, **I\'m from Hoi An**." Melbourne là quê của Sophie.',
          },
          {
            q: 'Mấy giờ mọi người ăn trưa?',
            options: ['11 giờ', '11 rưỡi', '12 giờ', '12 rưỡi'],
            correct: 2,
            why: '"We\'re having lunch **at twelve**."',
          },
        ],
      },

      { t: 'h', text: 'Cảnh 3 — Cuối ngày: cuối cùng cũng gặp Emma' },
      {
        t: 'canh',
        anh: ['five-oclock', 'laptop', 'woman-technologist', 'handshake', 'motor-scooter'],
        caption: '5 giờ chiều. Huy đang cất máy tính vào ba lô thì **Emma**, người hướng dẫn, đi tới bàn. Đây là lần đầu hai người gặp nhau.',
      },
      {
        t: 'listen',
        id: 'gtd1-nghe-canh3',
        title: 'Scene 3 — At the end of the day',
        note: 'Nghe xem Emma đến từ đâu, và hai người hẹn nhau mấy giờ sáng mai.',
        lines: [
          { who: 'Emma', voice: 'us-nu', text: "Hi, Huy? I'm Emma. I'm so sorry about this morning.", vi: 'Chào, Huy phải không? Chị là Emma. Chị rất xin lỗi về chuyện sáng nay.' },
          { who: 'Huy', voice: 'us-nam', text: "Hi, Emma! That's okay. It's great to finally meet you.", vi: 'Chào chị Emma! Không sao ạ. Cuối cùng cũng được gặp chị, em vui lắm.' },
          { who: 'Emma', voice: 'us-nu', text: 'You too. So, how was your first day?', vi: 'Chị cũng vậy. Thế ngày đầu của em thế nào?' },
          { who: 'Huy', voice: 'us-nam', text: 'It was good. Everyone is very kind. Sophie and Oliver are really funny.', vi: 'Tốt ạ. Mọi người rất dễ mến. Chị Sophie và anh Oliver vui tính lắm.' },
          { who: 'Emma', voice: 'us-nu', text: "They are! I'm glad. Are you tired?", vi: 'Đúng thế! Chị mừng quá. Em có mệt không?' },
          { who: 'Huy', voice: 'us-nam', text: "A little. There are a lot of new names. Sorry, are you from England too?", vi: 'Hơi hơi ạ. Nhiều tên mới quá. Xin lỗi, chị cũng đến từ Anh ạ?' },
          { who: 'Emma', voice: 'us-nu', text: "No, I'm American. I'm from Seattle. But I live in Da Nang now.", vi: 'Không, chị là người Mỹ. Chị đến từ Seattle. Nhưng giờ chị sống ở Đà Nẵng.' },
          { who: 'Huy', voice: 'us-nam', text: "Oh, I see. Is it your first time in Vietnam?", vi: 'À, em hiểu rồi. Đây là lần đầu chị ở Việt Nam ạ?' },
          { who: 'Emma', voice: 'us-nu', text: "No, it's my third year here. I love it. Listen, are you free tomorrow at nine?", vi: 'Không, đây là năm thứ ba chị ở đây rồi. Chị thích lắm. À này, chín giờ sáng mai em rảnh không?' },
          { who: 'Huy', voice: 'us-nam', text: "Yes, I am.", vi: 'Em rảnh ạ.' },
          { who: 'Emma', voice: 'us-nu', text: "Perfect. Let's have a coffee and talk about your first week.", vi: 'Tuyệt. Mình uống cà phê rồi nói về tuần đầu của em nhé.' },
          { who: 'Huy', voice: 'us-nam', text: 'Sounds great. Thank you, Emma. See you tomorrow!', vi: 'Nghe hay quá ạ. Cảm ơn chị Emma. Hẹn gặp chị ngày mai!' },
          { who: 'Emma', voice: 'us-nu', text: 'See you tomorrow. It was nice meeting you, Huy. Have a good evening!', vi: 'Mai gặp nhé. Rất vui vì hôm nay được gặp em, Huy. Chúc em buổi tối vui vẻ!' },
          { who: 'Huy', voice: 'us-nam', text: 'You too. Bye!', vi: 'Chị cũng vậy ạ. Em chào chị!' },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd1-nghe-canh3-hieu',
        title: 'Cảnh 3 — Bạn nghe được gì? (4 câu)',
        items: [
          {
            q: 'Emma đến từ đâu?',
            options: ['Anh', 'Úc', 'Mỹ', 'New Zealand'],
            correct: 2,
            why: '"No, **I\'m American. I\'m from Seattle**." Huy đoán là Anh (England) nhưng đoán sai.',
          },
          {
            q: 'Emma ở Việt Nam bao lâu rồi?',
            options: ['Lần đầu tới', 'Năm đầu tiên', 'Năm thứ ba', 'Ba tháng'],
            correct: 2,
            why: '"No, it\'s **my third year** here."',
          },
          {
            q: 'Hai người hẹn gặp khi nào?',
            options: ['Chín giờ tối nay', 'Chín giờ sáng mai', 'Mười hai giờ trưa mai', 'Tuần sau'],
            correct: 1,
            why: '"Are you free **tomorrow at nine**?" rồi "Let\'s have a coffee".',
          },
          {
            q: 'Lúc chia tay, Emma nói "It was nice meeting you". Vì sao không nói "Nice to meet you"?',
            options: [
              'Vì hai câu giống hệt nhau, nói câu nào cũng được',
              'Vì "Nice to meet you" dùng lúc vừa gặp, còn "It was nice meeting you" dùng lúc chia tay',
              'Vì Emma là người Mỹ',
              'Vì Emma nói sai',
            ],
            correct: 1,
            why: 'Lúc **vừa gặp**: Nice to meet you. Lúc **chia tay** sau lần gặp đầu: It was nice meeting you. Từ "was" cho biết cuộc gặp đã xong.',
          },
        ],
      },

      { t: 'h', text: 'Chép chính tả 6 câu khó' },
      {
        t: 'p',
        text: 'Bấm loa, nghe rồi gõ lại **đúng cả câu**. Đây là các câu người bản xứ nói dính vào nhau nên dễ nghe sót từ nhỏ (I\'m, a, to, at). Viết hoa hay dấu chấm không tính điểm.',
      },
      {
        t: 'dictation',
        id: 'gtd1-nghe-chinh-ta',
        title: 'Nghe và gõ lại',
        items: [
          { label: 'Câu 1 — lời chào khi đã biết trước tên người kia (tên: Huy)', spell: 'You must be Huy.', answer: 'You must be Huy.' },
          { label: 'Câu 2 — giới thiệu người khác (tên: Huy)', spell: "This is Huy. He's our new intern.", answer: "This is Huy. He's our new intern.", alt: ["This is Huy he's our new intern", 'This is Huy. He is our new intern.'] },
          { label: 'Câu 3 — xin gọi tên ngắn (tên: Huy)', spell: 'Please just call me Huy.', answer: 'Please just call me Huy.' },
          { label: 'Câu 4 — nói về mình', spell: "I'm a third-year student.", answer: "I'm a third-year student.", alt: ["I'm a third year student.", 'I am a third-year student.', "I'm a 3rd-year student.", "I'm a 3rd year student."] },
          { label: 'Câu 5 — hẹn giờ', spell: 'Are you free tomorrow at nine?', answer: 'Are you free tomorrow at nine?', alt: ['Are you free tomorrow at 9?'] },
          { label: 'Câu 6 — lúc chia tay', spell: 'It was nice meeting you.', answer: 'It was nice meeting you.' },
        ],
      },

      { t: 'h', text: 'Họ nói vậy nghĩa là gì?' },
      {
        t: 'table',
        head: ['Họ nói', 'Nghĩa thật', 'Bạn đáp'],
        rows: [
          ['How are you doing?', 'Lời chào kèm hỏi thăm. **Không** hỏi "bạn đang làm gì".', 'Good, thanks. And you?'],
          ['You alright? (Anh)', 'Chào, khoẻ không? **Không** có ý bạn trông ốm.', 'Yeah, good, thanks. You?'],
          ['How are you going? (Úc, NZ)', 'Bạn thế nào? **Không** hỏi "bạn đi bằng gì".', 'Good, thanks. How about you?'],
          ['You must be Huy.', 'Tôi đoán bạn là Huy (đã nghe nói về bạn). Không phải ra lệnh.', "Yes, I'm Huy. Nice to meet you."],
          ['No worries.', 'Không sao đâu. Rất hay nghe ở Úc, New Zealand, giờ ở đâu cũng dùng.', '(mỉm cười, nói tiếp)'],
          ['Come and join us!', 'Lời mời thật. Từ chối cũng được, nhưng ngày đầu nên nhận lời.', "Thanks, I'd love to."],
          ['Got it!', 'Tôi hiểu rồi, tôi nhớ rồi.', '(không cần đáp)'],
        ],
        caption: 'Ba câu đầu là lời chào. Người hỏi chờ một câu trả lời ngắn 2–4 từ rồi được hỏi lại, họ không chờ bạn kể tình hình sức khoẻ.',
      },
      {
        t: 'note',
        title: 'Mẹo: không nghe kịp TÊN người ta thì làm gì',
        items: [
          'Tên riêng là thứ khó nghe nhất, người bản xứ cũng hay nghe sót. Hỏi lại tên là chuyện **rất bình thường**, không ai thấy phiền.',
          'Hỏi **ngay trong 5 giây đầu**: "Sorry, I didn\'t catch your name." (Xin lỗi, em chưa nghe rõ tên anh/chị.) Để 10 phút sau mới hỏi thì ngại hơn nhiều.',
          '**Nhắc lại tên ngay** khi đáp: "Nice to meet you, **Oliver**." Nói ra miệng một lần là nhớ lâu hơn, và nếu bạn nghe sai thì người ta sửa cho luôn.',
          'Tên lạ quá: "How do you spell that?" (Tên đó đánh vần thế nào ạ?). Ngày 2 học kỹ cách đánh vần.',
          'Huy cũng làm đúng một việc hay: khi Chloe đọc sai tên, Huy **giúp người ta đọc** ("It sounds like \"we\" with an H") thay vì im lặng chịu bị gọi sai cả kỳ thực tập.',
        ],
      },
      {
        t: 'table',
        head: ['Ý', 'Anh', 'Mỹ', 'Úc / New Zealand'],
        rows: [
          ['Chào thân mật', 'Hiya! · You alright?', 'Hey! · What\'s up?', "G'day! · How are you going?"],
          ['Hỏi thăm', 'How are you? · You alright?', "How are you doing? · How's it going?", 'How are you going?'],
          ['Trả lời "ổn"', 'Not bad, thanks. · Fine, thanks.', "I'm good. · Pretty good.", 'Good, thanks. · Not bad.'],
          ['Không sao đâu', "That's all right. · No problem.", 'No problem. · No worries.', 'No worries.'],
          ['"Họ" trong họ tên', 'surname', 'last name', 'surname · last name'],
          ['Cảm ơn (thân mật)', 'Cheers. · Ta.', 'Thanks. · Thanks a lot.', 'Cheers. · Ta.'],
        ],
        caption: 'Khác biệt Anh – Mỹ – Úc trong lời chào. Bạn chỉ cần **nghe hiểu** cả ba cột; khi nói, chọn một kiểu trung tính (Hi · How are you doing? · Good, thanks) là dùng được ở mọi nơi.',
      },
      {
        t: 'note',
        title: '🎧 Nghe thêm ở Podcast',
        items: [
          '**en-a1-01 · Hello, My Name Is Lan** — làm quen với bạn cùng lớp ngày đầu đi học: hỏi tên, quê, nghề.',
          '**en-ds-a1-01 · Hi, How Are You?** — chào người hàng xóm mới trong thang máy, kèm câu tạm biệt.',
          '**en-se-a2-01 · Hi, I\'m a Developer** — tự giới thiệu ở một buổi gặp mặt dân công nghệ (nghe sau khi xong bài Nói hôm nay).',
          'Ba tập này là ba cảnh khác với bài hôm nay. Nghe để gặp lại đúng những mẫu câu vừa học trong một chuyện mới.',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — NÓI ═══════════════════════════ */
  {
    id: 'gtd1-noi',
    kind: 'speaking',
    title: 'Tự giới thiệu 30 giây + hỏi lại người kia',
    goal: 'Tự giới thiệu trong 30 giây bằng 5 câu, trả lời tự nhiên câu "How are you?", giới thiệu hai người với nhau và luôn hỏi lại người đối diện.',
    minutes: 30,
    blocks: [
      {
        t: 'recap',
        title: 'Bài này bạn luyện gì',
        items: [
          '**26 câu mẫu** để chào, nói tên, nói mình là ai, hỏi lại và chào ra về. Bấm loa từng câu, **nói to theo**.',
          'Một điểm ngữ pháp duy nhất: **I\'m… / This is… / Nice to…** và từ nối **and**.',
          'Cùng một ý nhưng nói với **bạn bè, đồng nghiệp, sếp hay khách** thì khác nhau thế nào.',
          '**Bắt tay, ánh mắt, khoảng cách đứng**: Việt Nam, Anh – Mỹ – Úc và Nhật khác nhau ra sao.',
          'Cuối bài bạn ghép được **bài tự giới thiệu 30 giây** của chính mình và nhập vai với Gia sư AI.',
        ],
      },

      { t: 'h', text: '1. 26 câu dùng được ngay' },
      {
        t: 'p',
        text: 'Mỗi dòng là một câu hoặc cụm bạn nói nguyên như vậy. Học theo thứ tự một cuộc gặp: **chào → tên → hỏi thăm → mình là ai → hỏi lại → chào ra về**. Bấm **Che nghĩa** để tự kiểm tra.',
      },
      {
        t: 'vocab',
        items: [
          { w: 'Nice to meet you.', pos: 'phr', ipa: '/naɪs tə ˈmiːt ju/', vi: 'Rất vui được gặp bạn. (lần gặp đầu tiên)', ex: "Hi, I'm Huy. Nice to meet you.", exVi: 'Chào, mình là Huy. Rất vui được gặp bạn.', more: 'Đáp lại: **Nice to meet you too.** hoặc ngắn hơn: **You too.**', anh: 'handshake' },
          { w: 'You too.', pos: 'phr', ipa: '/ˈjuː tuː/', vi: 'Tôi cũng vậy. / Bạn cũng thế nhé.', ex: 'Nice to meet you. — You too.', exVi: 'Rất vui được gặp bạn. — Tôi cũng vậy.', more: 'Dùng được cho cả lời chúc: Have a good day! — **You too.**' },
          { w: "I'm Huy.", pos: 'phr', ipa: '/aɪm hwiː/', vi: 'Mình là Huy.', ex: "Hi, I'm Huy. I'm new here.", exVi: 'Chào, mình là Huy. Mình mới tới.', more: 'Cách nói tên **tự nhiên nhất**. "My name is…" đúng nhưng trang trọng hơn.' },
          { w: 'Just call me Huy.', pos: 'phr', ipa: '/dʒʌst ˈkɔːl mi hwiː/', vi: 'Cứ gọi mình là Huy.', ex: 'My full name is Tran Gia Huy, but just call me Huy.', exVi: 'Tên đầy đủ của mình là Trần Gia Huy, nhưng cứ gọi mình là Huy.' },
          { w: 'This is Sophie.', pos: 'phr', ipa: '/ðɪs ɪz ˈsoʊfi/', vi: 'Đây là Sophie. (giới thiệu người khác)', ex: 'Huy, this is Sophie. She\'s a tester.', exVi: 'Huy, đây là Sophie. Chị ấy là tester.', more: 'Giới thiệu người thì dùng **This is**, không dùng "She is Sophie" hay "Here is Sophie".' },
          { w: 'You must be Huy.', pos: 'phr', ipa: '/ju ˈmʌst bi hwiː/', vi: 'Bạn chắc là Huy. (đoán)', ex: 'Hi there! You must be the new intern.', exVi: 'Chào em! Em chắc là thực tập sinh mới.' },
          { w: "Sorry, I didn't catch your name.", pos: 'phr', ipa: '/ˈsɑːri aɪ ˈdɪdnt kætʃ jər neɪm/', vi: 'Xin lỗi, mình chưa nghe rõ tên bạn.', ex: "Sorry, I didn't catch your name. — It's Oliver.", exVi: 'Xin lỗi, mình chưa nghe rõ tên bạn. — Oliver.' },
          { w: 'How are you doing?', pos: 'phr', ipa: '/ˈhaʊ ər ju ˈduːɪŋ/', vi: 'Bạn thế nào? (hỏi thăm)', ex: 'Morning, Sophie! How are you doing?', exVi: 'Chào buổi sáng, Sophie! Chị thế nào?', more: 'Cùng nghĩa: **How are you?** · **How\'s it going?** (thân hơn)' },
          { w: "How's it going?", pos: 'phr', ipa: '/ˈhaʊz ɪt ˈɡoʊɪŋ/', vi: 'Dạo này sao rồi? (thân mật)', ex: "Hey, Oliver! How's it going?", exVi: 'Ê Oliver! Dạo này sao rồi?', more: 'Đáp: **Good, thanks.** · **Not bad.** · **Pretty good.**' },
          { w: 'Good, thanks. And you?', pos: 'phr', ipa: '/ɡʊd θæŋks ən ˈjuː/', vi: 'Ổn, cảm ơn. Còn bạn?', ex: 'How are you doing? — Good, thanks. And you?', exVi: 'Bạn thế nào? — Ổn, cảm ơn. Còn bạn?', more: 'Luôn **hỏi lại**. Trả lời xong rồi im là cuộc nói chuyện chết ở đó.' },
          { w: 'Not bad, thanks.', pos: 'phr', ipa: '/nɑːt ˈbæd θæŋks/', vi: 'Cũng ổn, cảm ơn.', ex: "How's it going? — Not bad, thanks. A bit busy.", exVi: 'Dạo này sao rồi? — Cũng ổn, cảm ơn. Hơi bận chút.', more: '"Not bad" nghĩa là **khá tốt**, không phải "tệ".' },
          { w: 'How about you?', pos: 'phr', ipa: '/ˈhaʊ əbaʊt ˈjuː/', vi: 'Còn bạn thì sao?', ex: "I'm from Hoi An. How about you?", exVi: 'Mình quê Hội An. Còn bạn thì sao?', more: 'Câu "trả bóng" dùng được sau **mọi** câu trả lời về bản thân.' },
          { w: 'Where are you from?', pos: 'phr', ipa: '/ˈwer ər ju frʌm/', vi: 'Bạn đến từ đâu? / Quê bạn ở đâu?', ex: 'Where are you from, Emma? — I\'m from Seattle.', exVi: 'Chị đến từ đâu, Emma? — Chị đến từ Seattle.' },
          { w: "I'm from Hoi An.", pos: 'phr', ipa: '/aɪm frəm hɔɪ ˈɑːn/', vi: 'Mình quê Hội An.', ex: "I'm from Hoi An. It's a small town near Da Nang.", exVi: 'Mình quê Hội An. Đó là một thị trấn nhỏ gần Đà Nẵng.', more: 'Nơi ít người biết thì thêm một câu **It\'s near… / It\'s in central Vietnam.**' },
          { w: 'What do you do?', pos: 'phr', ipa: '/ˈwʌt də ju ˈduː/', vi: 'Bạn làm nghề gì?', ex: 'What do you do, Oliver? — I\'m a designer.', exVi: 'Anh làm nghề gì, Oliver? — Anh là nhà thiết kế.', more: 'Hỏi nghề thì nói câu này, **không** nói "What\'s your job?" (nghe như điền tờ khai).' },
          { w: "I'm an intern.", pos: 'phr', ipa: '/aɪm ən ˈɪntɝːn/', vi: 'Mình là thực tập sinh.', ex: "I'm an intern on the mobile team.", exVi: 'Mình là thực tập sinh ở nhóm mobile.', more: '**an** trước nguyên âm: an intern, an engineer. **a** trước phụ âm: a student, a tester.' },
          { w: "I'm a third-year student.", pos: 'phr', ipa: '/aɪm ə ˌθɝːd jɪr ˈstuːdnt/', vi: 'Mình là sinh viên năm ba.', ex: "I'm a third-year student at FPT University.", exVi: 'Mình là sinh viên năm ba ở Đại học FPT.', more: 'first-year · second-year · third-year · final-year (năm cuối)' },
          { w: 'I study software engineering.', pos: 'phr', ipa: '/aɪ ˈstʌdi ˈsɔːftwer ˌendʒɪˈnɪrɪŋ/', vi: 'Mình học kỹ thuật phần mềm.', ex: 'I study software engineering in Da Nang.', exVi: 'Mình học kỹ thuật phần mềm ở Đà Nẵng.' },
          { w: "I'm new here.", pos: 'phr', ipa: '/aɪm ˈnuː hɪr/', vi: 'Mình mới tới đây.', ex: "Sorry, I'm new here. Where's the kitchen?", exVi: 'Xin lỗi, mình mới tới. Khu bếp ở đâu ạ?' },
          { w: "It's my first day.", pos: 'phr', ipa: '/ɪts maɪ ˌfɝːst ˈdeɪ/', vi: 'Hôm nay là ngày đầu của mình.', ex: "It's my first day, so I'm a little nervous.", exVi: 'Hôm nay là ngày đầu của mình nên mình hơi hồi hộp.' },
          { w: 'a little nervous', pos: 'phr', ipa: '/ə ˌlɪtl ˈnɝːvəs/', vi: 'hơi hồi hộp', ex: "I'm good, thanks. A little nervous.", exVi: 'Mình ổn, cảm ơn. Hơi hồi hộp.', more: 'a little + tính từ = "hơi": a little tired (hơi mệt), a little busy (hơi bận).' },
          { w: 'name badge', pos: 'n', ipa: '/ˈneɪm bædʒ/', vi: 'thẻ tên', ex: "Here's your name badge.", exVi: 'Thẻ tên của bạn đây.', anh: 'name-badge' },
          { w: 'shake hands', pos: 'v', ipa: '/ˌʃeɪk ˈhændz/', vi: 'bắt tay', ex: 'In the US, people shake hands when they first meet.', exVi: 'Ở Mỹ, người ta bắt tay khi gặp lần đầu.', anh: 'handshake' },
          { w: 'See you tomorrow.', pos: 'phr', ipa: '/ˌsiː ju təˈmɑːroʊ/', vi: 'Hẹn gặp bạn ngày mai.', ex: 'Thanks for today. See you tomorrow!', exVi: 'Cảm ơn về hôm nay. Mai gặp nhé!', more: 'See you **later** (lát nữa / lần sau) · See you **on Monday** · See you **at nine**.' },
          { w: 'It was nice meeting you.', pos: 'phr', ipa: '/ɪt wəz ˌnaɪs ˈmiːtɪŋ ju/', vi: 'Rất vui vì đã được gặp bạn. (lúc chia tay)', ex: 'I have to go now. It was nice meeting you.', exVi: 'Mình phải đi rồi. Rất vui vì đã được gặp bạn.' },
          { w: 'Good to see you again.', pos: 'phr', ipa: '/ˌɡʊd tə ˈsiː ju əɡen/', vi: 'Vui vì gặp lại bạn. (từ lần thứ hai)', ex: 'Hi, Chloe! Good to see you again.', exVi: 'Chào chị Chloe! Vui vì gặp lại chị.', more: '**meet** = gặp lần đầu · **see** = gặp lại người đã quen.' },
        ],
      },

      { t: 'h', text: '2. Cùng một ý, ba mức: thân · trung tính · trang trọng' },
      {
        t: 'p',
        text: 'Nói với **bạn cùng tuổi** khác nói với **đồng nghiệp**, và khác hẳn khi nói với **sếp lớn hoặc khách hàng**. Chưa biết chọn mức nào thì dùng cột **giữa**: cột này an toàn với mọi người.',
      },
      {
        t: 'table',
        head: ['Ý', 'Thân (bạn bè)', 'Trung tính (đồng nghiệp)', 'Trang trọng (sếp, khách)'],
        rows: [
          ['Chào', 'Hey! · Hi!', 'Hi. · Hello. · Morning!', 'Good morning. · Good afternoon.'],
          ['Nói tên', "I'm Huy.", "Hi, I'm Huy, the new intern.", 'My name is Tran Gia Huy.'],
          ['Vui được gặp', 'Good to meet you!', 'Nice to meet you.', "It's a pleasure to meet you."],
          ['Hỏi thăm', "How's it going? · What's up?", 'How are you doing?', 'How are you?'],
          ['Trả lời', 'Good, you?', 'Good, thanks. And you?', "I'm very well, thank you. And you?"],
          ['Giới thiệu người khác', 'Huy, Sophie. Sophie, Huy.', 'Huy, this is Sophie.', "I'd like to introduce Ms Sophie Clarke."],
          ['Chào ra về', 'See ya! · Bye!', 'See you tomorrow. · Have a good evening.', 'It was a pleasure meeting you. Goodbye.'],
        ],
        caption: 'Với khách Nhật hoặc người lớn tuổi hơn nhiều: bắt đầu ở cột trang trọng, người ta tự chuyển sang thân mật thì bạn theo.',
      },
      {
        t: 'note',
        title: 'Mẹo: "How do you do?" và "What\'s up?"',
        items: [
          '**How do you do?** là lời chào rất trang trọng, kiểu cũ, giờ hiếm gặp. Nếu nghe thấy thì đáp lại y nguyên: **How do you do?** Đừng trả lời "I\'m fine".',
          '**What\'s up?** (Mỹ, rất thân) không cần trả lời thật. Đáp: **Not much. You?** hoặc chỉ **Hey!** là đủ.',
          'Ở công ty phần mềm, kể cả với sếp, người ta gọi nhau bằng **tên riêng** (Emma, Oliver). Không cần "Mr", "Ms", cũng không có "anh", "chị" trong tiếng Anh.',
        ],
      },

      { t: 'h', text: '3. 🧱 Câu này ghép thế nào' },
      {
        t: 'p',
        text: 'Gần như **mọi câu** của hôm nay chỉ dùng một động từ: **be** (am / is / are). Tiếng Việt nói "Mình là Huy", "Mình quê Hội An", "Mình hồi hộp" bằng ba kiểu khác nhau. Tiếng Anh cả ba đều là **I\'m…**',
      },
      {
        t: 'patterns',
        rows: [
          {
            formula: "S + am / is / are + tên / nghề",
            vi: 'Nói ai là ai, làm gì. Trước nghề có a / an.',
            examples: [
              { en: "I'm Huy.", vi: 'Mình là Huy.' },
              { en: "She's a tester on your team.", vi: 'Chị ấy là tester trong nhóm của bạn.' },
              { en: "We're interns.", vi: 'Bọn mình là thực tập sinh.' },
            ],
          },
          {
            formula: 'S + am / is / are + from + nơi',
            vi: 'Nói quê, nơi đến.',
            examples: [
              { en: "I'm from Hoi An.", vi: 'Mình quê Hội An.' },
              { en: "He's from Manchester.", vi: 'Anh ấy đến từ Manchester.' },
              { en: "They're from Australia.", vi: 'Họ đến từ Úc.' },
            ],
          },
          {
            formula: 'S + am / is / are + adj',
            vi: 'Nói mình đang thế nào. Tiếng Việt không có "là", tiếng Anh bắt buộc có be.',
            examples: [
              { en: "I'm a little nervous.", vi: 'Mình hơi hồi hộp.' },
              { en: "Everyone is really friendly.", vi: 'Mọi người rất thân thiện.' },
              { en: "Are you tired?", vi: 'Bạn mệt không?' },
            ],
          },
          {
            formula: 'This is + tên (+ vai trò)',
            vi: 'Giới thiệu một người với người khác.',
            examples: [
              { en: 'This is Huy.', vi: 'Đây là Huy.' },
              { en: 'This is Sophie. She\'s from Melbourne.', vi: 'Đây là Sophie. Chị ấy đến từ Melbourne.' },
              { en: 'This is Emma, my mentor.', vi: 'Đây là Emma, người hướng dẫn của mình.' },
            ],
          },
          {
            formula: 'Nice / Good / Great + to V + you',
            vi: 'Khung câu chào cố định. Chỉ đổi tính từ và động từ.',
            examples: [
              { en: 'Nice to meet you.', vi: 'Rất vui được gặp bạn.' },
              { en: 'Good to see you again.', vi: 'Vui vì gặp lại bạn.' },
              { en: 'Great to finally meet you.', vi: 'Cuối cùng cũng được gặp bạn, vui quá.' },
            ],
          },
        ],
      },
      {
        t: 'table',
        head: ['Đầy đủ', 'Khi nói (rút gọn)', 'Phủ định', 'Câu hỏi'],
        rows: [
          ['I am', "I'm", "I'm not", 'Am I…?'],
          ['You are', "You're", "You aren't", 'Are you…?'],
          ['He is / She is / It is', "He's / She's / It's", "He isn't / She isn't", 'Is he…? / Is she…?'],
          ['We are / They are', "We're / They're", "We aren't / They aren't", 'Are we…? / Are they…?'],
        ],
        caption: 'Khi **nói**, luôn dùng dạng rút gọn. Nói đủ "I am Huy" nghe cứng như đọc bài. Muốn hỏi thì chỉ cần **đảo be lên đầu**: You are tired → Are you tired?',
      },
      {
        t: 'rule',
        formula: "S + am / is / are + tên / nghề / from + nơi / adj",
        vi: 'Ba việc "là ai", "từ đâu", "đang thế nào" đều dùng be. Khi nói thì rút gọn: I\'m, you\'re, he\'s, she\'s, it\'s, we\'re, they\'re.',
      },
      {
        t: 'note',
        title: 'Nối câu hôm nay: and',
        items: [
          'Hai câu ngắn đứng cạnh nhau nghe giật cục: "I\'m Huy. I\'m the new intern." Nối bằng **and** là mượt ngay: "I\'m Huy, **and** I\'m the new intern."',
          '**and** nối hai ý **cùng chiều** (thêm thông tin): "I\'m from Hoi An, **and** I study in Da Nang."',
          'Câu hỏi lại nhanh nhất cũng bắt đầu bằng and: "**And you?**" (Còn bạn?)',
          'Đừng nối quá hai ý trong một câu. Ba ý thì tách làm hai câu.',
        ],
      },
      {
        t: 'quiz',
        id: 'gtd1-noi-ghep-dich',
        title: 'Dịch sang tiếng Anh (5 câu)',
        kind: 'translate',
        grammar: "S + am / is / are + … · This is + tên · … , and …",
        items: [
          { q: 'Mình là sinh viên năm ba.', hint: 'third-year, student', answers: ["I'm a third-year student.", "I'm a third year student.", 'I am a third-year student.', 'I am a third year student.'] },
          { q: 'Đây là Oliver. Anh ấy là nhà thiết kế.', hint: 'this is, designer', answers: ["This is Oliver. He's a designer.", "This is Oliver he's a designer", 'This is Oliver. He is a designer.'] },
          { q: 'Chị ấy đến từ Úc.', hint: 'from, Australia', answers: ["She's from Australia.", 'She is from Australia.', 'She comes from Australia.'] },
          { q: 'Bạn mệt không?', hint: 'tired', answers: ['Are you tired?'] },
          { q: 'Mình là Huy, và mình là thực tập sinh mới.', hint: 'and, the new intern', answers: ["I'm Huy, and I'm the new intern.", "I'm Huy and I'm the new intern.", "I'm Huy, and I'm a new intern.", "I'm Huy and I'm a new intern."] },
        ],
      },

      { t: 'h', text: '4. Người Việt hay nói sai' },
      {
        t: 'note',
        title: 'Người Việt hay nói sai — 8 lỗi thật',
        items: [
          '~~I\'m fine, thank you. And you?~~ (đọc một hơi như học thuộc) → **Good, thanks. And you?** Câu cũ không sai ngữ pháp, nhưng ai cũng nhận ra đó là câu sách lớp 6. Người bản xứ đáp ngắn hơn nhiều.',
          '~~I am student.~~ → **I\'m a student.** Trước nghề nghiệp số ít phải có **a / an**. Tiếng Việt không có từ này nên rất hay quên.',
          '~~I\'m Mr Huy.~~ → **I\'m Huy.** Không ai tự gọi mình là Mr / Ms. Và Mr / Ms đi với **họ**, không đi với tên: Mr Tran, không phải Mr Huy.',
          '~~Nice to meet you~~ (với người đã gặp hôm qua) → **Good to see you again.** "meet" chỉ dùng cho **lần đầu**. Nói "Nice to meet you" lần hai, người ta tưởng bạn quên mặt họ.',
          '~~What\'s your job?~~ → **What do you do?** Câu đầu đúng ngữ pháp nhưng nghe như cán bộ làm thủ tục.',
          '~~How old are you? Are you married?~~ (hỏi ngay lần gặp đầu) → hỏi **Where are you from? · What do you do?** Ở Việt Nam hỏi tuổi để xưng hô cho đúng. Tiếng Anh không cần xưng hô theo tuổi, nên hỏi tuổi, lương, chuyện vợ chồng lần đầu gặp bị coi là tò mò quá.',
          '~~Teacher Emma, Sister Chloe~~ → **Emma, Chloe.** Tiếng Anh không gọi "cô", "chị" kèm tên. Gọi tên riêng là lịch sự rồi.',
          '~~Nice to meet you~~ (lúc chia tay) → **It was nice meeting you.** Lúc về thì dùng "was" và "meeting".',
        ],
      },

      { t: 'h', text: '5. 🙋 Ngôn ngữ cơ thể khi gặp lần đầu' },
      {
        t: 'p',
        text: 'Lần gặp đầu, người ta **nhìn** bạn trước khi nghe bạn. Nói đúng câu mà mắt nhìn xuống đất, tay bắt hờ thì ấn tượng vẫn kém. Bấm từng thẻ để nghe câu đi kèm cử chỉ.',
      },
      {
        t: 'hinh',
        title: 'Cử chỉ đi cùng lời chào',
        items: [
          { anh: 'handshake', w: 'Nice to meet you.', ro: '/naɪs tə ˈmiːt ju/', vi: 'Bắt tay: nắm **chắc vừa phải**, lắc 1–2 cái, khoảng 2 giây rồi buông. Mắt nhìn người đối diện.' },
          { anh: 'eyes', w: "Hi, I'm Huy.", ro: '/haɪ aɪm hwiː/', vi: 'Nhìn vào mắt khi nói tên mình. Không cần nhìn chằm chằm: nhìn 3–4 giây, liếc đi, rồi nhìn lại.' },
          { anh: 'slightly-smiling-face', w: 'Good, thanks. And you?', ro: '/ɡʊd θæŋks ən ˈjuː/', vi: 'Mỉm cười nhẹ khi chào. Mặt nghiêm quá dễ bị hiểu là không thân thiện.' },
          { anh: 'waving-hand', w: 'Hi there!', ro: '/haɪ ˈðer/', vi: 'Vẫy tay: chào người ở xa, chào cả nhóm, hoặc khi vào cuộc gọi video.' },
          { anh: 'palm-up-hand', w: 'This is Sophie.', ro: '/ðɪs ɪz ˈsoʊfi/', vi: 'Giới thiệu ai thì hướng **cả bàn tay mở** về phía người đó.' },
          { anh: 'backhand-index-pointing-right', w: "(đừng làm) She's Sophie.", ro: '', vi: 'Đừng chỉ **ngón trỏ** vào người. Ở Anh, Mỹ, Nhật, chỉ ngón tay vào người đều bị coi là thô.' },
          { anh: 'person-bowing', w: 'Nice to meet you, Tanaka-san.', ro: '', vi: 'Với khách Nhật: cúi đầu nhẹ khi chào. Họ đưa tay ra thì bắt, bắt nhẹ hơn kiểu Mỹ.' },
          { anh: 'thumbs-up', w: 'Got it!', ro: '/ˈɡɑːt ɪt/', vi: 'Giơ ngón cái = "OK, hiểu rồi". Dùng thoải mái ở Anh, Mỹ, Úc và Việt Nam.' },
        ],
      },
      {
        t: 'table',
        head: ['Việc', 'Việt Nam', 'Anh · Mỹ · Úc', 'Nhật'],
        rows: [
          ['Bắt tay', 'Thường nhẹ. Với người lớn tuổi hay bắt bằng hai tay.', 'Một tay, chắc vừa phải, khoảng 2 giây. Bắt hờ dễ bị hiểu là thiếu tự tin.', 'Truyền thống là cúi chào. Với người nước ngoài thì họ bắt tay, thường nhẹ và ngắn.'],
          ['Ánh mắt', 'Với người trên, nhìn xuống là lễ phép.', 'Nhìn vào mắt khi chào và khi nghe = tôn trọng. Tránh mắt dễ bị hiểu là ngại hoặc giấu gì đó.', 'Nhìn mắt ít hơn phương Tây. Nhìn thẳng lâu dễ gây khó chịu.'],
          ['Khoảng cách đứng', 'Đứng gần, đụng vai là bình thường.', 'Khoảng **một sải tay**. Đứng sát hơn làm người ta lùi lại.', 'Xa hơn một chút, ít chạm vào người.'],
          ['Chạm, ôm', 'Bạn bè cùng giới khoác vai, nắm tay.', 'Ở công sở chỉ bắt tay. Ôm là dành cho bạn thân.', 'Gần như không chạm vào người mới quen.'],
          ['Gọi tên', 'Anh / chị / em + tên.', 'Gọi **tên riêng**, kể cả với sếp.', '**Họ + san** (Tanaka-san). Chưa thân thì không gọi tên riêng.'],
          ['Hỏi tuổi', 'Hỏi ngay để xưng hô.', 'Không hỏi lần đầu gặp.', 'Không hỏi lần đầu gặp.'],
        ],
        caption: 'Không cần nhớ hết. Quy tắc dễ nhất: **nhìn người đối diện làm gì thì làm theo ở mức đó**. Họ đưa tay thì bắt, họ cúi thì cúi.',
      },

      { t: 'h', text: '6. Phát âm: nối âm trong câu chào' },
      {
        t: 'p',
        text: 'Người bản xứ không đọc rời từng từ. **Âm cuối** của từ trước dính vào **nguyên âm đầu** của từ sau: "This is" nghe như "thi-siz", "I\'m an intern" nghe như "ai-mơ-nin-tơn". Từ nhỏ như **to, do, you, are** đọc rất nhẹ. Nghe mẫu rồi đọc theo, đừng thêm khoảng nghỉ giữa các từ.',
      },
      {
        t: 'phatam',
        id: 'gtd1-phat-am',
        title: 'Luyện phát âm — nối âm và âm cuối trong 8 câu chào',
        note: 'Bấm "Nghe mẫu" rồi "Đọc & chấm". Giữ rõ âm cuối /s/, /z/, /t/, /m/ và nói liền một hơi.',
        items: [
          { text: 'Nice to meet you.', ipa: 'naɪs tə miːt ju', vi: 'nice có /s/ cuối · to đọc nhẹ thành /tə/' },
          { text: "I'm an intern.", ipa: 'aɪm ən ɪntɝːn', vi: 'nối: I\'m‿an‿intern, nghe như "ai-mơ-nin-tơn"' },
          { text: 'This is Sophie.', ipa: 'ðɪs ɪz soʊfi', vi: 'nối: This‿is · is có âm /z/ cuối' },
          { text: "How's it going?", ipa: 'haʊz ɪt ɡoʊɪŋ', vi: 'nối: How\'s‿it · /z/ không phải /s/' },
          { text: 'What do you do?', ipa: 'wʌt də ju duː', vi: 'do thứ nhất đọc nhẹ /də/, do thứ hai đọc rõ /duː/' },
          { text: 'Where are you from?', ipa: 'wer ər ju frʌm', vi: 'are đọc nhẹ /ər/ · from có /m/ cuối, ngậm môi lại' },
          { text: 'Good, thanks. And you?', ipa: 'ɡʊd θæŋks ən juː', vi: 'thanks: /θ/ đặt lưỡi giữa hai hàm răng, có /ks/ cuối · lên giọng ở "you"' },
          { text: 'It was nice meeting you.', ipa: 'ɪt wəz naɪs miːtɪŋ ju', vi: 'was đọc nhẹ /wəz/ · nhấn vào nice và meet' },
        ],
      },

      { t: 'h', text: '7. Bài tự giới thiệu 30 giây' },
      {
        t: 'sodo',
        kind: 'flow',
        title: '5 câu, 30 giây',
        caption: 'Câu cuối luôn là một **câu hỏi lại**. Giới thiệu mà không hỏi lại thì thành độc thoại.',
        steps: [
          { label: 'Chào + tên', sub: "Hi, I'm Huy." },
          { label: 'Mình là ai ở đây', sub: "I'm the new intern on the mobile team." },
          { label: 'Quê / trường', sub: "I'm from Hoi An, and I study in Da Nang." },
          { label: 'Một điều về mình', sub: "I'm a big football fan." },
          { label: 'Hỏi lại', sub: 'How about you?' },
        ],
      },
      {
        t: 'examples',
        items: [
          { en: "Hi, I'm Huy. Nice to meet you.", vi: 'Chào, mình là Huy. Rất vui được gặp bạn.' },
          { en: "I'm the new intern on the mobile team.", vi: 'Mình là thực tập sinh mới ở nhóm mobile.' },
          { en: "I'm a third-year student, and I study software engineering.", vi: 'Mình là sinh viên năm ba, và mình học kỹ thuật phần mềm.' },
          { en: "I'm from Hoi An. It's a small town near Da Nang.", vi: 'Mình quê Hội An. Đó là một thị trấn nhỏ gần Đà Nẵng.' },
          { en: "I'm a big football fan. How about you? What do you do here?", vi: 'Mình mê bóng đá lắm. Còn bạn? Bạn làm gì ở đây?' },
        ],
      },
      {
        t: 'p',
        text: 'Giờ thay thông tin của **chính bạn** vào 5 câu trên: tên, vai trò (a student / an intern / a developer), quê, trường, một điều bạn thích (**I\'m a big … fan** · **I\'m into …**). Viết ra giấy, đọc to 3 lần, lần cuối **không nhìn giấy**.',
      },

      { t: 'h', text: '8. Nhập vai: bữa trưa đầu tiên' },
      {
        t: 'dialogue',
        title: 'Ở căng tin — Huy ngồi cạnh một người chưa quen',
        lines: [
          { who: 'Huy', role: 'a', text: "Hi, is it okay if I sit here?", vi: 'Chào chị, em ngồi đây được không ạ?' },
          { who: 'Grace', role: 'b', text: "Sure, go ahead! I'm Grace.", vi: 'Được chứ, em ngồi đi! Chị là Grace.' },
          { who: 'Huy', role: 'a', text: "Thanks. I'm Huy. Nice to meet you, Grace.", vi: 'Cảm ơn chị. Em là Huy. Rất vui được gặp chị, Grace.' },
          { who: 'Grace', role: 'b', text: 'You too. Are you new here?', vi: 'Chị cũng vậy. Em mới tới à?' },
          { who: 'Huy', role: 'a', text: "Yes, it's my first day. I'm an intern on the mobile team.", vi: 'Vâng, hôm nay là ngày đầu của em. Em là thực tập sinh ở nhóm mobile.' },
          { who: 'Grace', role: 'b', text: "Oh, welcome! I'm on the data team. I'm from Toronto, in Canada.", vi: 'Ồ, chào mừng em! Chị ở nhóm dữ liệu. Chị đến từ Toronto, ở Canada.' },
          { who: 'Huy', role: 'a', text: "Wow, that's far! I'm from Hoi An. It's near here.", vi: 'Ôi, xa thật! Em quê Hội An. Gần đây thôi ạ.' },
          { who: 'Grace', role: 'b', text: "I know Hoi An! It's beautiful. So, how's your first day?", vi: 'Chị biết Hội An! Đẹp lắm. Thế ngày đầu của em thế nào?' },
          { who: 'Huy', role: 'a', text: "Good, thanks. A little busy. And you? How's your day?", vi: 'Ổn ạ, cảm ơn chị. Hơi bận một chút. Còn chị? Hôm nay của chị thế nào?' },
          { who: 'Grace', role: 'b', text: "Not bad. Lots of meetings. Oh, I have to run. It was nice meeting you, Huy!", vi: 'Cũng ổn. Họp nhiều lắm. Ôi, chị phải chạy đây. Rất vui vì được gặp em, Huy!' },
          { who: 'Huy', role: 'a', text: 'You too, Grace. See you around!', vi: 'Em cũng vậy, chị Grace. Hẹn gặp lại chị!' },
        ],
      },
      {
        t: 'build',
        id: 'gtd1-noi-ghep-luot',
        title: 'Đến lượt bạn — ghép câu trả lời của Huy (5 câu)',
        items: [
          { vi: 'Grace: "I\'m Grace." → Bạn: Em là Huy. Rất vui được gặp chị.', chips: ["I'm", 'Huy.', 'Nice', 'to', 'meet', 'you.', 'see', 'am'], answer: ["I'm", 'Huy.', 'Nice', 'to', 'meet', 'you.'] },
          { vi: 'Grace: "Are you new here?" → Bạn: Vâng, hôm nay là ngày đầu của em.', chips: ['Yes,', "it's", 'my', 'first', 'day.', 'one', 'is'], answer: ['Yes,', "it's", 'my', 'first', 'day.'] },
          { vi: 'Grace: "What do you do?" → Bạn: Em là thực tập sinh ở nhóm mobile.', chips: ["I'm", 'an', 'intern', 'on', 'the', 'mobile', 'team.', 'a', 'in'], answer: ["I'm", 'an', 'intern', 'on', 'the', 'mobile', 'team.'] },
          { vi: 'Grace: "How\'s your first day?" → Bạn: Ổn ạ, cảm ơn chị. Còn chị?', chips: ['Good,', 'thanks.', 'And', 'you?', 'fine', 'your'], answer: ['Good,', 'thanks.', 'And', 'you?'] },
          { vi: 'Grace: "I have to run." → Bạn: Rất vui vì đã được gặp chị.', chips: ['It', 'was', 'nice', 'meeting', 'you.', 'meet', 'is'], answer: ['It', 'was', 'nice', 'meeting', 'you.'] },
        ],
      },
      {
        t: 'speak',
        id: 'gtd1-noi-tra-loi',
        part: '1',
        questions: [
          "Hi! I don't think we've met. What's your name?",
          'Where are you from?',
          'What do you do?',
          "How's your day going?",
        ],
      },
      {
        t: 'note',
        title: 'Nhập vai với Gia sư AI',
        items: [
          'Mở trang **/language/en/roleplay** (hoặc nút Gia sư ở góc màn), dán đoạn đề bài dưới đây rồi nói bằng giọng của bạn.',
          '"You are Grace, a friendly Canadian data analyst. It is lunchtime in the office canteen in Da Nang. I am a new intern and today is my first day. Start by saying hi and asking my name. Ask me where I am from, what I do, and how my first day is going. Speak slowly, use short sentences (A2 level), and wait for my answer after each question. If I forget to ask you a question back, remind me gently. After 8 turns, say goodbye, then tell me in Vietnamese two things I did well and two things to fix."',
          'Làm **2 lượt**. Lượt hai đổi vai: bạn là người cũ, AI là thực tập sinh mới, bạn phải là người mở lời và giới thiệu AI với một đồng nghiệp bằng "This is…".',
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — ĐỌC ═══════════════════════════ */
  {
    id: 'gtd1-doc',
    kind: 'reading',
    title: 'Hồ sơ, thẻ tên, lời chào trong tin nhắn',
    goal: 'Đọc hiểu thẻ tên, hồ sơ ngắn của đồng nghiệp trên ứng dụng chat và các tin nhắn chào người mới; biết điền họ và tên Việt vào mẫu tiếng Anh.',
    minutes: 18,
    blocks: [
      {
        t: 'recap',
        title: 'Bài đọc hôm nay',
        items: [
          'Bốn mẩu chữ **thật** bạn gặp ngay ngày đầu đi làm: thẻ tên, hồ sơ trên ứng dụng chat, tin chào mừng trong nhóm, tin nhắn riêng.',
          'Học đọc **giọng điệu**: tin nào thân mật, tin nào trang trọng, dấu hiệu nhận ra là gì.',
          'Tên Việt **Trần Gia Huy** thì first name, last name, full name là phần nào.',
          'Nhặt 10 cụm dùng lại được khi bạn tự viết tin chào (bài Viết của Ngày 2 dùng tiếp).',
        ],
      },

      { t: 'h', text: '1. Đọc bốn mẩu sau' },
      {
        t: 'canh',
        anh: ['name-badge', 'laptop', 'speech-balloon', 'waving-hand'],
        caption: 'Sau bữa trưa, Huy nhận **thẻ tên**, mở ứng dụng chat của công ty và thấy cả nhóm đang chào mình.',
      },
      {
        t: 'passage',
        title: "Huy's first day — badge, profiles and messages",
        intro: 'Đọc chậm một lượt, chưa cần tra từ. Chỗ in đậm là cụm đáng nhớ.',
        paras: [
          {
            label: 'A',
            text: '**NAME BADGE** — Brightwave Software · **HUY TRAN** · Intern, Mobile Team · Da Nang office · Staff no. 2047 · **Hello, my name is Huy!**',
          },
          {
            label: 'B',
            text: '**PROFILE** — **Sophie Clarke** (she/her) · QA Tester, Mobile Team · **Based in** Da Nang, from Melbourne · Local time: 1:15 pm · About me: Coffee first, bugs second. **Ask me about** test plans, good bánh mì places and surfing at My Khe beach. · Status: 🟢 Active',
          },
          {
            label: 'C',
            text: '**#mobile-team** — **Emma Brooks** 1:20 pm: Hi team! **Please welcome** Huy, our new intern. He\'s a third-year student from Hoi An, and he\'s with us for four months. Sorry I missed you this morning, Huy! · **Oliver Reed** 1:22 pm: **Welcome aboard**, Huy! 🎉 · **Sophie Clarke** 1:23 pm: Welcome! Great to have you on the team. **Feel free to ask me anything.** · **Huy Tran** 1:26 pm: Thanks, everyone! I\'m really happy to be here. **Looking forward to working with you all.**',
          },
          {
            label: 'D',
            text: '**Direct message — Grace Lin** 1:40 pm: Hey Huy, it\'s Grace from lunch 👋 Nice meeting you today! A few of us play badminton on Wednesdays after work. **You\'re welcome to join** if you like. **No pressure!**',
          },
        ],
      },
      {
        t: 'mcq',
        id: 'gtd1-doc-hieu',
        title: 'Hiểu ý và giọng điệu (8 câu)',
        items: [
          {
            q: 'Trên thẻ tên (A), "TRAN" là gì của Huy?',
            options: ['Tên riêng (first name)', 'Họ (last name)', 'Tên đệm (middle name)', 'Tên công ty'],
            correct: 1,
            why: 'Tiếng Anh viết **tên trước, họ sau**: HUY TRAN = tên Huy, họ Trần. Đây là thứ tự ngược với tiếng Việt.',
          },
          {
            q: 'Trong hồ sơ (B), "Based in Da Nang, from Melbourne" nghĩa là gì?',
            options: ['Sophie sinh ở Đà Nẵng, làm ở Melbourne', 'Sophie đang sống và làm việc ở Đà Nẵng, quê ở Melbourne', 'Sophie sắp chuyển về Melbourne', 'Sophie làm việc từ xa ở Melbourne'],
            correct: 1,
            why: '**based in** = hiện sống / làm việc ở. **from** = quê gốc.',
          },
          {
            q: '"Ask me about test plans, good bánh mì places and surfing" cho bạn biết điều gì?',
            options: ['Sophie cấm hỏi các chuyện khác', 'Đây là những chủ đề Sophie rành và thích nói', 'Sophie đang cần người giúp các việc này', 'Đây là công việc bắt buộc của Sophie'],
            correct: 1,
            why: '"Ask me about…" trong hồ sơ là lời mời bắt chuyện. Muốn làm quen với Sophie, hỏi về quán bánh mì hay lướt sóng là dễ nhất.',
          },
          {
            q: 'Trong (C), ai giới thiệu Huy với cả nhóm?',
            options: ['Oliver', 'Sophie', 'Emma', 'Huy tự giới thiệu'],
            correct: 2,
            why: 'Emma viết: "**Please welcome Huy**, our new intern."',
          },
          {
            q: 'Huy thực tập ở công ty bao lâu?',
            options: ['Ba tháng', 'Bốn tháng', 'Một năm', 'Bài không nói'],
            correct: 1,
            why: '"he\'s with us for **four months**".',
          },
          {
            q: '"Welcome aboard!" nghĩa là gì?',
            options: ['Mời lên tàu', 'Chào mừng bạn gia nhập nhóm', 'Chúc thượng lộ bình an', 'Mời vào phòng họp'],
            correct: 1,
            why: 'Nghĩa gốc là "chào mừng lên tàu", nhưng ở công sở nó là câu chào người **mới vào nhóm / công ty**.',
          },
          {
            q: 'Tin của Grace (D) có giọng điệu thế nào?',
            options: ['Trang trọng, như thư công việc', 'Thân mật, thoải mái', 'Khó chịu', 'Ra lệnh'],
            correct: 1,
            why: 'Dấu hiệu thân mật: mở bằng **Hey**, có emoji 👋, câu ngắn, và **No pressure!** (không ép đâu).',
          },
          {
            q: 'Grace viết "No pressure!". Huy nên hiểu thế nào?',
            options: ['Phải đi, không được từ chối', 'Đi hay không đều được, không ai trách', 'Grace không muốn Huy đi', 'Hôm đó không có áp lực công việc'],
            correct: 1,
            why: '**No pressure** = không ép, tuỳ bạn. Lời mời thật nhưng từ chối cũng không sao.',
          },
        ],
      },

      { t: 'h', text: '2. 10 cụm hay gặp trong hồ sơ và tin chào' },
      {
        t: 'table',
        head: ['Cụm', 'Nghĩa', 'Gặp ở đâu'],
        rows: [
          ['Please welcome + tên', 'Mọi người chào đón … nhé', 'Tin giới thiệu người mới'],
          ['Welcome aboard!', 'Chào mừng gia nhập!', 'Trả lời tin giới thiệu'],
          ['Great to have you on the team.', 'Rất vui có bạn trong nhóm.', 'Trả lời tin giới thiệu'],
          ['Feel free to ask me anything.', 'Cứ thoải mái hỏi mình bất cứ gì.', 'Người cũ nói với người mới'],
          ['Looking forward to working with you.', 'Mong được làm việc cùng mọi người.', 'Người mới đáp lại'],
          ["I'm really happy to be here.", 'Mình rất vui được ở đây.', 'Người mới đáp lại'],
          ['based in + nơi', 'hiện sống / làm việc ở', 'Hồ sơ'],
          ['she/her · he/him', 'cách gọi người đó ở ngôi thứ ba (cô ấy / anh ấy)', 'Hồ sơ, chữ ký email'],
          ['Ask me about…', 'Cứ hỏi mình về…', 'Hồ sơ'],
          ["You're welcome to join. · No pressure!", 'Mời bạn tham gia. · Không ép đâu!', 'Tin mời thân mật'],
        ],
      },
      {
        t: 'note',
        title: 'Mẹo đọc giọng điệu một tin nhắn',
        items: [
          '**Thân mật**: Hey / Hi + tên, emoji, câu ngắn, dấu chấm than, bỏ chủ ngữ (Nice meeting you today! · Looking forward to it!).',
          '**Trang trọng**: Dear / Hello + tên, câu đủ chủ ngữ, không emoji, kết bằng Best regards / Kind regards.',
          'Trả lời **đúng mức người ta viết cho mình**. Grace viết "Hey Huy 👋" thì đừng đáp "Dear Ms Lin".',
        ],
      },

      { t: 'h', text: '3. Tên Việt trong mẫu tiếng Anh' },
      {
        t: 'table',
        head: ['Ô trên mẫu', 'Nghĩa', 'Trần Gia Huy điền'],
        rows: [
          ['First name · Given name', 'Tên riêng', 'Huy (hoặc Gia Huy)'],
          ['Middle name', 'Tên đệm', 'Gia (có thể để trống)'],
          ['Last name · Surname · Family name', 'Họ', 'Tran'],
          ['Full name', 'Họ tên đầy đủ', 'Tran Gia Huy'],
          ['Preferred name', 'Tên muốn được gọi', 'Huy'],
        ],
        caption: 'Mỹ hay ghi **Last name**, Anh và Úc hay ghi **Surname**. Giấy tờ chính thức (vé máy bay, visa): điền **đúng như hộ chiếu**.',
      },
      {
        t: 'quiz',
        id: 'gtd1-doc-dien-ten',
        title: 'Điền mẫu cho bạn Lê Thị Mai Anh, muốn được gọi là Mai Anh (5 câu)',
        kind: 'fill',
        items: [
          { q: 'Last name: ___', answers: ['Le', 'Lê'] },
          { q: 'First name (hai chữ): ___', answers: ['Mai Anh'] },
          { q: 'Middle name: ___', answers: ['Thi', 'Thị'] },
          { q: 'Preferred name: ___', answers: ['Mai Anh'] },
          { q: 'Trên thẻ tên kiểu tiếng Anh (tên trước, họ sau): ___', answers: ['Mai Anh Le', 'Mai Anh Lê'] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: 'gtd1-bai-tap',
    kind: 'homework',
    title: 'Bài tập Ngày 1',
    goal: 'Làm 34 câu có đáp án để nhớ chắc cách chào, tự giới thiệu, hỏi thăm và chào ra về ở đúng mức lịch sự.',
    minutes: 25,
    blocks: [
      {
        t: 'recap',
        title: 'Cách làm',
        items: [
          '**5 phần, 34 câu**: chọn câu hợp cảnh · điền be · dịch · nghe chép · ghép câu.',
          'Làm **không nhìn lại bài**. Sai câu nào, đọc phần giải thích rồi **nói to câu đúng 2 lần**.',
          'Phần dịch chấp nhận nhiều cách viết (I\'m = I am). Dấu chấm, viết hoa không tính.',
          'Đúng từ **27/34** trở lên là sẵn sàng sang Ngày 2.',
        ],
      },

      { t: 'h', text: 'Phần I — Chọn câu hợp cảnh nhất' },
      {
        t: 'mcq',
        id: 'gtd1-bt-chon',
        title: 'Phần I — Chọn câu hợp cảnh (10 câu)',
        items: [
          {
            q: 'Sáng thứ Hai, một đồng nghiệp người Anh đi ngang nói: "Morning! You alright?" Bạn đáp:',
            options: ["Yes, I'm not sick.", 'Yeah, good, thanks. You?', 'Why? What happened?', "I'm fine, thank you, and you?"],
            correct: 1,
            why: '"You alright?" là lời chào kiểu Anh. Đáp ngắn rồi hỏi lại: **Yeah, good, thanks. You?** Câu D không sai nhưng dài và giống học thuộc.',
          },
          {
            q: 'Bạn gặp giám đốc khách hàng lần đầu trong phòng họp. Câu nào hợp nhất?',
            options: ["Hey! What's up?", 'Hi, how old are you?', "Good morning. I'm Huy. It's a pleasure to meet you.", 'Yo, nice to see you again.'],
            correct: 2,
            why: 'Với khách và sếp lớn dùng mức trang trọng: **Good morning** + tên + **It\'s a pleasure to meet you**.',
          },
          {
            q: 'Hôm qua bạn đã làm quen với Sophie. Sáng nay gặp lại, bạn nói:',
            options: ['Nice to meet you, Sophie.', 'Hi, Sophie! Good to see you again.', 'How do you do?', "What's your name?"],
            correct: 1,
            why: 'Đã gặp rồi thì dùng **see**, không dùng **meet**: Good to see you again.',
          },
          {
            q: 'Bạn muốn giới thiệu bạn mình là Nam với Emma. Bạn nói:',
            options: ['Emma, he is Nam.', 'Emma, here is Nam.', 'Emma, this is Nam.', 'Emma, that Nam.'],
            correct: 2,
            why: 'Giới thiệu người: **This is + tên**.',
          },
          {
            q: 'Một người vừa nói tên nhưng bạn nghe không rõ. Bạn nói:',
            options: ['What?', 'Repeat!', "Sorry, I didn't catch your name.", 'Speak again, please.'],
            correct: 2,
            why: '**Sorry, I didn\'t catch your name.** là câu lịch sự chuẩn. "What?" và "Repeat!" nghe cộc lốc.',
          },
          {
            q: 'Ai đó hỏi: "What do you do?" Họ muốn biết gì?',
            options: ['Bạn đang làm gì lúc này', 'Nghề nghiệp của bạn', 'Bạn có khoẻ không', 'Bạn định làm gì tối nay'],
            correct: 1,
            why: '**What do you do?** = Bạn làm nghề gì? Hỏi "đang làm gì" là "What are you doing?".',
          },
          {
            q: 'Câu nào đúng ngữ pháp?',
            options: ['I am student.', "I'm a student.", 'I a student.', "I'm student."],
            correct: 1,
            why: 'Cần đủ **be** và **a**: I\'m a student.',
          },
          {
            q: 'Bạn nói chuyện xong với một người mới quen ở căng tin và phải đi. Bạn nói:',
            options: ['Nice to meet you.', 'It was nice meeting you. See you around!', 'How do you do?', 'Goodbye forever.'],
            correct: 1,
            why: 'Lúc chia tay sau lần gặp đầu: **It was nice meeting you.**',
          },
          {
            q: 'Một đồng nghiệp người Úc nói: "How are you going?" Bạn đáp:',
            options: ["I'm going by motorbike.", "I'm going to the kitchen.", 'Good, thanks. How about you?', 'At nine.'],
            correct: 2,
            why: 'Ở Úc và New Zealand, "How are you going?" = "How are you?". Đây không phải câu hỏi về phương tiện.',
          },
          {
            q: 'Lần đầu gặp một đồng nghiệp nước ngoài, câu hỏi nào KHÔNG nên hỏi?',
            options: ['Where are you from?', 'What do you do here?', 'How much is your salary?', 'Is it your first time in Vietnam?'],
            correct: 2,
            why: 'Lương, tuổi, chuyện vợ chồng là chủ đề riêng tư. Ba câu còn lại an toàn.',
          },
        ],
      },

      { t: 'h', text: 'Phần II — Điền am / is / are (dạng rút gọn nếu được)' },
      {
        t: 'quiz',
        id: 'gtd1-bt-dien-be',
        title: "Phần II — Điền 'm / 's / 're / is / are / am (7 câu)",
        kind: 'fill',
        grammar: "I'm · you're / we're / they're · he's / she's / it's",
        items: [
          { q: "Hi, I___ Huy. Nice to meet you.", answers: ["'m", 'm', 'am', '’m'] },
          { q: "This ___ Sophie. She's a tester.", answers: ['is'] },
          { q: "Oliver is a designer. He___ from Manchester.", answers: ["'s", 's', 'is', '’s'] },
          { q: "___ you from Da Nang? — No, I'm from Hoi An.", answers: ['Are'] },
          { q: "We___ having lunch at twelve.", answers: ["'re", 're', 'are', '’re'] },
          { q: "___ Huy your first name? — Yes, it is.", answers: ['Is'] },
          { q: "I'm good, thanks. A little nervous. It___ my first day.", answers: ["'s", 's', 'is', '’s'] },
        ],
      },

      { t: 'h', text: 'Phần III — Dịch Việt → Anh, nói cho tự nhiên' },
      {
        t: 'quiz',
        id: 'gtd1-bt-dich',
        title: 'Phần III — Dịch sang tiếng Anh (7 câu)',
        kind: 'translate',
        grammar: 'S + am / is / are + … · This is… · Nice to… · and',
        items: [
          { q: 'Rất vui được gặp bạn.', hint: 'nice, meet', answers: ['Nice to meet you.', 'Good to meet you.', "It's nice to meet you.", 'Great to meet you.'] },
          { q: 'Cứ gọi mình là Huy.', hint: 'just, call', answers: ['Just call me Huy.', 'Please just call me Huy.', 'Please call me Huy.', 'Call me Huy.'] },
          { q: 'Bạn đến từ đâu?', hint: 'where, from', answers: ['Where are you from?', 'Where do you come from?'] },
          { q: 'Bạn làm nghề gì?', hint: 'do', answers: ['What do you do?', 'What do you do for a living?'] },
          { q: 'Mình ổn, cảm ơn. Còn bạn?', hint: 'good, thanks', answers: ['Good, thanks. And you?', "I'm good, thanks. And you?", 'Good thanks and you', "I'm good, thanks. How about you?", 'Good, thanks. How about you?', "I'm fine, thanks. And you?", 'Fine, thanks. And you?'] },
          { q: 'Hôm nay là ngày đầu của mình, và mình hơi hồi hộp.', hint: 'first day, a little nervous', answers: ["It's my first day, and I'm a little nervous.", "It's my first day and I'm a little nervous.", "Today is my first day, and I'm a little nervous.", "Today is my first day and I'm a little nervous.", "It's my first day, and I'm a bit nervous.", "It's my first day and I'm a bit nervous."] },
          { q: 'Hẹn gặp bạn ngày mai.', hint: 'see', answers: ['See you tomorrow.', "I'll see you tomorrow."] },
        ],
      },

      { t: 'h', text: 'Phần IV — Nghe và chép lại' },
      {
        t: 'dictation',
        id: 'gtd1-bt-chinh-ta',
        title: 'Phần IV — Nghe và gõ lại cả câu (5 câu)',
        items: [
          { label: 'Câu 1', spell: "Hi, I'm Grace. I'm from Toronto.", answer: "Hi, I'm Grace. I'm from Toronto.", alt: ["Hi I'm Grace I'm from Toronto", 'Hi, I am Grace. I am from Toronto.'] },
          { label: 'Câu 2', spell: "How's it going?", answer: "How's it going?", alt: ['How is it going?'] },
          { label: 'Câu 3', spell: 'Not bad, thanks. How about you?', answer: 'Not bad, thanks. How about you?', alt: ['Not bad thanks how about you'] },
          { label: 'Câu 4', spell: "Sorry, I didn't catch your name.", answer: "Sorry, I didn't catch your name.", alt: ['Sorry, I did not catch your name.'] },
          { label: 'Câu 5', spell: 'Good to see you again.', answer: 'Good to see you again.' },
        ],
      },

      { t: 'h', text: 'Phần V — Ghép câu' },
      {
        t: 'build',
        id: 'gtd1-bt-ghep',
        title: 'Phần V — Bấm các mảnh theo đúng thứ tự (5 câu)',
        items: [
          { vi: 'Tên đầy đủ của mình là Trần Gia Huy.', chips: ['My', 'full', 'name', 'is', 'Tran', 'Gia', 'Huy.', 'are', 'I'], answer: ['My', 'full', 'name', 'is', 'Tran', 'Gia', 'Huy.'] },
          { vi: 'Đây là Emma, người hướng dẫn của mình.', chips: ['This', 'is', 'Emma,', 'my', 'mentor.', 'She', 'me'], answer: ['This', 'is', 'Emma,', 'my', 'mentor.'] },
          { vi: 'Mình quê Hội An, và mình học ở Đà Nẵng.', chips: ["I'm", 'from', 'Hoi An,', 'and', 'I', 'study', 'in', 'Da Nang.', 'at', 'am'], answer: ["I'm", 'from', 'Hoi An,', 'and', 'I', 'study', 'in', 'Da Nang.'] },
          { vi: 'Đây là lần đầu bạn ở Việt Nam à?', chips: ['Is', 'it', 'your', 'first', 'time', 'in', 'Vietnam?', 'you', 'are'], answer: ['Is', 'it', 'your', 'first', 'time', 'in', 'Vietnam?'] },
          { vi: 'Cuối cùng cũng được gặp bạn, vui quá.', chips: ["It's", 'great', 'to', 'finally', 'meet', 'you.', 'see', 'meeting'], answer: ["It's", 'great', 'to', 'finally', 'meet', 'you.'] },
        ],
      },
      {
        t: 'note',
        title: 'Việc cuối ngày (5 phút)',
        items: [
          'Đứng trước gương, nói **bài tự giới thiệu 30 giây** của bạn 3 lần. Lần cuối nhìn vào mắt mình trong gương và mỉm cười.',
          'Ghi âm lần thứ ba. Mai nghe lại trước khi học Ngày 2.',
          'Ngày 2: nghe không kịp thì hỏi lại thế nào, đánh vần tên, đọc số điện thoại và giờ hẹn.',
        ],
      },
    ],
  },
];
