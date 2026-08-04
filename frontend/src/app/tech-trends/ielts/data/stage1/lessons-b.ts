/**
 * Bài học chặng 1 — phần B: chủ điểm 5–8 (bài 21–40).
 *
 * Bốn chủ điểm cuối chuyển dần từ "đúng câu" sang "đúng bài": tương lai và
 * động từ khuyết thiếu (nói được dự định, đưa được ý kiến), so sánh (bắt buộc
 * cho Writing Task 1), câu hỏi và từ nối (nền của Speaking và của đoạn văn),
 * và cuối cùng là ghép câu thành đoạn.
 *
 * Chủ điểm 8 cố ý đặt cuối: viết được ĐOẠN mới là mốc thật của chặng 1, chứ
 * không phải thuộc bao nhiêu điểm ngữ pháp rời rạc.
 */
import type { LessonUnit } from '../types';

export const UNITS_B: LessonUnit[] = [
  /* ═════════════════ CHỦ ĐIỂM 5: TƯƠNG LAI & KHUYẾT THIẾU ═════════════════ */
  {
    id: 'future',
    title: 'Tương lai & động từ khuyết thiếu',
    subtitle: 'Bài 21–25 · will, be going to, can, should, must',
    icon: '🔮',
    lessons: [
      {
        id: 'f1',
        n: 21,
        title: 'will và be going to — khác nhau ở chỗ nào',
        goal: 'Chọn đúng giữa hai cách nói tương lai thay vì dùng bừa "will" cho mọi câu.',
        blocks: [
          {
            formula: 'S + will + V · S + am/is/are + going to + V',
            explain:
              '**will**: quyết định ngay lúc nói, dự đoán, lời hứa. **be going to**: kế hoạch đã định từ '
              + 'trước, hoặc dự đoán CÓ BẰNG CHỨNG trước mắt.',
            examples: [
              { en: 'The phone is ringing. I will answer it. (quyết định ngay)', vi: 'Điện thoại reo. Để tôi nghe.' },
              { en: 'I am going to study abroad next year. (đã lên kế hoạch)', vi: 'Năm sau tôi sẽ đi du học.' },
              { en: 'Look at those clouds. It is going to rain. (có bằng chứng)', vi: 'Nhìn mây kia kìa. Trời sắp mưa.' },
            ],
            mistake: {
              wrong: 'I will go to Da Nang next week. I already booked the ticket.',
              right: 'I am going to go to Da Nang next week. I have already booked the ticket.',
              why: 'Đã đặt vé tức là kế hoạch có từ trước → dùng "be going to". Dùng "will" cho mọi câu là dấu hiệu của band thấp.',
            },
          },
        ],
        practice: [
          'Viết 4 câu kế hoạch có thật của bạn (be going to) và 4 câu dự đoán về tương lai (will).',
          'Đọc lại, tự hỏi từng câu: kế hoạch này có từ trước hay vừa nghĩ ra?',
        ],
      },
      {
        id: 'f2',
        n: 22,
        title: 'can / could — khả năng và lời đề nghị lịch sự',
        goal: 'Nói được điều mình làm được, và hỏi xin phép cho lịch sự.',
        blocks: [
          {
            formula: 'S + can/could + V nguyên thể (không "to", không chia)',
            explain:
              '**can**: khả năng hiện tại, xin phép thân mật. **could**: khả năng trong quá khứ, hoặc bản '
              + 'lịch sự hơn của can khi đề nghị.',
            examples: [
              { en: 'I can speak a little English.', vi: 'Tôi nói được một chút tiếng Anh.' },
              { en: 'Could you repeat that, please? (lịch sự)', vi: 'Bạn nhắc lại được không ạ?' },
              { en: 'When I was five, I could not swim.', vi: 'Hồi năm tuổi tôi chưa biết bơi.' },
            ],
            mistake: {
              wrong: 'I can to speak English. / She cans swim.',
              right: 'I can speak English. / She can swim.',
              why: 'Động từ khuyết thiếu KHÔNG bao giờ đi với "to" và KHÔNG bao giờ thêm -s, kể cả với he/she/it.',
            },
          },
        ],
        keyWords: [
          { en: 'Could you…?', ipa: '/kʊd juː/', vi: 'Bạn có thể… không? (lịch sự)' },
          { en: 'be able to', ipa: '/bi ˈeɪbl tuː/', vi: 'có thể (thay can ở các thì khác)' },
        ],
        practice: [
          'Viết 5 câu về những việc bạn làm được và 3 việc bạn chưa làm được.',
          'Viết 4 câu đề nghị lịch sự dùng "Could you…?" cho các tình huống: hỏi đường, nhờ nhắc lại, mượn đồ, xin số điện thoại.',
        ],
      },
      {
        id: 'f3',
        n: 23,
        title: 'should / must / have to — lời khuyên và nghĩa vụ',
        goal: 'Đưa được ý kiến — kỹ năng nền của Writing Task 2 sau này.',
        blocks: [
          {
            formula: 'S + should/must + V · S + have to / has to + V',
            explain:
              '**should**: nên (lời khuyên, ý kiến cá nhân). **must**: bắt buộc do chính người nói thấy cần. '
              + '**have to**: bắt buộc do quy định bên ngoài. Phủ định khác nhau rất xa: "must not" = cấm, '
              + '"do not have to" = không bắt buộc, làm cũng được.',
            examples: [
              { en: 'Students should read more books.', vi: 'Học sinh nên đọc sách nhiều hơn.' },
              { en: 'You must not use your phone in the exam. (cấm)', vi: 'Bạn không được dùng điện thoại trong phòng thi.' },
              { en: 'You do not have to come early. (không bắt buộc)', vi: 'Bạn không nhất thiết phải đến sớm.' },
              { en: 'I have to wear a uniform at school.', vi: 'Tôi phải mặc đồng phục ở trường.' },
            ],
            mistake: {
              wrong: 'You must not to be late. / He have to go.',
              right: 'You must not be late. / He has to go.',
              why:
                '"must" là khuyết thiếu nên không có "to"; nhưng "have to" KHÔNG phải khuyết thiếu nên vẫn '
                + 'chia theo ngôi (has to).',
            },
          },
        ],
        practice: [
          'Viết 6 lời khuyên cho người mới học tiếng Anh, dùng "should" và "should not".',
          'Viết 4 câu về quy định ở trường/nơi làm của bạn, dùng have to và must not.',
        ],
      },
      {
        id: 'f4',
        n: 24,
        title: 'Thích, muốn, ghét — like / want / enjoy đi với gì',
        goal: 'Không còn lẫn giữa "like doing" và "want to do".',
        blocks: [
          {
            formula: 'like / enjoy / love / hate + V-ing  ·  want / need / decide / hope + to + V',
            explain:
              'Đây là bảng phải thuộc, không suy luận được. Nhóm cảm xúc (like, love, hate, enjoy, mind) đi '
              + 'với V-ing. Nhóm ý định (want, need, decide, hope, plan, would like) đi với to + V.',
            examples: [
              { en: 'I enjoy reading books.', vi: 'Tôi thích đọc sách.' },
              { en: 'I want to improve my English.', vi: 'Tôi muốn cải thiện tiếng Anh.' },
              { en: 'I would like to book a room. (lịch sự hơn "I want")', vi: 'Tôi muốn đặt một phòng.' },
              { en: 'She hates getting up early.', vi: 'Cô ấy ghét dậy sớm.' },
            ],
            mistake: {
              wrong: 'I enjoy to read. / I want improving my English.',
              right: 'I enjoy reading. / I want to improve my English.',
              why:
                'Người Việt dịch cả hai thành "thích/muốn + động từ" nên hay hoán đổi. Mẹo: enjoy/like đi với '
                + '-ing (cả hai đều có chữ cái mềm), want/need đi với "to".',
            },
          },
        ],
        practice: [
          'Viết 6 câu về sở thích dùng V-ing và 6 câu về dự định dùng to + V.',
          'Học thuộc hai nhóm động từ; kiểm bằng cách tự đặt câu chứ không đọc lại bảng.',
        ],
      },
      {
        id: 'f5',
        n: 25,
        title: 'Nói về kế hoạch tương lai — ghép cả chủ điểm 5',
        goal: 'Trả lời trôi chảy câu "What are your plans for the future?" trong 1 phút.',
        blocks: [
          {
            explain:
              'Khung trả lời dùng được ngay: kế hoạch gần (be going to) → lý do (because) → kế hoạch xa '
              + '(would like to / hope to) → điều kiện cần (need to / have to). Bốn câu là đủ 45 giây.',
            examples: [
              {
                en: 'I am going to take the IELTS test next year because I need it for university. After that, I would like to study abroad, probably in Australia. To do that, I have to save money and improve my writing. I hope I can achieve band seven.',
                vi: 'Năm sau tôi sẽ thi IELTS vì tôi cần nó để vào đại học. Sau đó tôi muốn đi du học, có thể là ở Úc. Để làm được, tôi phải tiết kiệm tiền và cải thiện kỹ năng viết. Tôi hy vọng đạt được band bảy.',
              },
            ],
            mistake: {
              wrong: 'I will study abroad. I will get band 7. I will work hard. (toàn "will", không có lý do)',
              right: 'Trộn be going to / would like to / have to, và luôn kèm "because".',
              why:
                'Câu trả lời không có lý do bị chấm thấp ở Fluency vì quá ngắn, và thấp ở Grammar vì lặp một '
                + 'cấu trúc.',
            },
          },
        ],
        practice: [
          'Viết bản trả lời của riêng bạn theo khung 4 câu, rồi học thuộc ý (không thuộc từng chữ).',
          'Thu âm, bấm giờ. Đạt 45–60 giây, không dừng quá 3 lần là đạt.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 6: SO SÁNH & MIÊU TẢ ═════════════════ */
  {
    id: 'compare',
    title: 'So sánh & miêu tả',
    subtitle: 'Bài 26–30 · Tính từ, so sánh hơn/nhất, trạng từ, thứ tự từ',
    icon: '⚖️',
    lessons: [
      {
        id: 'c1',
        n: 26,
        title: 'So sánh hơn — -er hay more?',
        goal: 'So sánh hai thứ đúng ngữ pháp — kỹ năng bắt buộc cho Writing Task 1.',
        blocks: [
          {
            formula: 'Tính từ ngắn (1 âm tiết): adj + er + than · Tính từ dài (từ 2 âm tiết trở lên): more + adj + than',
            explain:
              'Tính từ 2 âm tiết tận cùng bằng -y thì theo nhóm NGẮN và đổi y → ier (happy → happier, easy → '
              + 'easier). Bất quy tắc phải thuộc: good → better, bad → worse, far → further.',
            examples: [
              { en: 'My brother is taller than me.', vi: 'Em trai tôi cao hơn tôi.' },
              { en: 'This book is more interesting than that one.', vi: 'Quyển này hay hơn quyển kia.' },
              { en: 'Life in the city is busier than in the countryside.', vi: 'Cuộc sống thành phố bận rộn hơn ở quê.' },
              { en: 'Her English is better than mine.', vi: 'Tiếng Anh của cô ấy tốt hơn của tôi.' },
            ],
            mistake: {
              wrong: 'She is more taller than me. / This is gooder.',
              right: 'She is taller than me. / This is better.',
              why: 'Không dùng ĐỒNG THỜI "more" và "-er". Và "good" là bất quy tắc, không bao giờ có "gooder".',
            },
          },
        ],
        practice: [
          'Viết 8 câu so sánh: thành phố với nông thôn, tiếng Anh với tiếng Việt, hai người bạn, hai môn học.',
          'Trong đó phải có 3 tính từ ngắn, 3 tính từ dài, 2 bất quy tắc.',
        ],
      },
      {
        id: 'c2',
        n: 27,
        title: 'So sánh nhất và so sánh bằng',
        goal: 'Chỉ ra được cái nhất trong nhóm — câu bắt buộc có trong mọi bài Task 1.',
        blocks: [
          {
            formula: 'the + adj-est · the most + adj · as + adj + as (bằng nhau)',
            explain:
              'So sánh nhất LUÔN có "the" phía trước. So sánh bằng dùng "as … as"; phủ định "not as … as" '
              + 'nghĩa là kém hơn.',
            examples: [
              { en: 'China had the highest figure in 2020.', vi: 'Trung Quốc có con số cao nhất năm 2020.' },
              { en: 'This is the most expensive option.', vi: 'Đây là lựa chọn đắt nhất.' },
              { en: 'My room is as big as yours.', vi: 'Phòng tôi to bằng phòng bạn.' },
              { en: 'Reading is not as difficult as writing.', vi: 'Đọc không khó bằng viết.' },
            ],
            mistake: {
              wrong: 'He is tallest in my class. / It is more cheaper.',
              right: 'He is the tallest in my class. / It is cheaper.',
              why: 'Quên "the" ở so sánh nhất là lỗi nhỏ nhưng lặp nhiều lần thì bị trừ điểm chính xác ngữ pháp.',
            },
          },
        ],
        practice: [
          'Viết 6 câu so sánh nhất về gia đình, lớp học, thành phố bạn biết.',
          'Viết 4 câu dùng "as … as" và "not as … as".',
        ],
      },
      {
        id: 'c3',
        n: 28,
        title: 'Thứ tự tính từ — "a big old wooden house"',
        goal: 'Xếp nhiều tính từ trước danh từ theo đúng thứ tự người bản xứ dùng.',
        blocks: [
          {
            formula: 'Ý kiến → Kích thước → Tuổi → Hình dạng → Màu → Xuất xứ → Chất liệu → DANH TỪ',
            explain:
              'Người bản xứ không học quy tắc này nhưng nói sai thứ tự là họ nghe ra ngay. Ở chặng 1 chỉ '
              + 'cần nhớ: ý kiến đứng trước, chất liệu đứng sát danh từ nhất.',
            examples: [
              { en: 'a beautiful small old wooden house', vi: 'một ngôi nhà gỗ cũ nhỏ đẹp' },
              { en: 'a nice young Vietnamese teacher', vi: 'một cô giáo Việt trẻ dễ mến' },
              { en: 'a large round plastic table', vi: 'một cái bàn nhựa tròn lớn' },
            ],
            mistake: {
              wrong: 'a wooden old big house',
              right: 'a big old wooden house',
              why:
                'Tiếng Việt xếp ngược hẳn (danh từ trước, tính từ sau) nên người Việt hay bê nguyên trật tự '
                + 'tiếng Việt sang.',
            },
          },
        ],
        practice: [
          'Viết 5 cụm danh từ có ít nhất 3 tính từ, tả đồ vật quanh bạn.',
          'Đọc to từng cụm — nghe thấy "trôi" là đúng, thấy vấp là sai thứ tự.',
        ],
      },
      {
        id: 'c4',
        n: 29,
        title: 'Trạng từ — miêu tả cách làm việc gì',
        goal: 'Phân biệt được khi nào dùng tính từ, khi nào dùng trạng từ.',
        blocks: [
          {
            formula: 'Tính từ bổ nghĩa DANH TỪ · Trạng từ bổ nghĩa ĐỘNG TỪ (thường + ly)',
            explain:
              'quick → quickly, careful → carefully, easy → easily. Bất quy tắc: good → well, fast → fast, '
              + 'hard → hard (chú ý "hardly" nghĩa là HẦU NHƯ KHÔNG, hoàn toàn khác "hard").',
            examples: [
              { en: 'She is a careful driver. → She drives carefully.', vi: 'Cô ấy lái xe cẩn thận.' },
              { en: 'He speaks English well. (không phải "good")', vi: 'Anh ấy nói tiếng Anh tốt.' },
              { en: 'I hardly ever eat fast food. (hầu như không bao giờ)', vi: 'Tôi hầu như không bao giờ ăn đồ ăn nhanh.' },
            ],
            mistake: {
              wrong: 'He speaks English very good. / She works hardly.',
              right: 'He speaks English very well. / She works hard.',
              why:
                '"good" là tính từ, không bổ nghĩa được cho động từ "speak". Còn "works hardly" nghĩa thành '
                + '"hầu như không làm việc" — ngược hẳn ý định.',
            },
          },
        ],
        practice: [
          'Viết 6 cặp câu: một câu dùng tính từ, câu kia đổi sang trạng từ cùng nghĩa.',
          'Học riêng 3 cặp bẫy: good/well, hard/hardly, late/lately.',
        ],
      },
      {
        id: 'c5',
        n: 30,
        title: 'Miêu tả một người, một nơi — ghép chủ điểm 6',
        goal: 'Nói liên tục 1 phút miêu tả một người hoặc một nơi, có so sánh.',
        blocks: [
          {
            explain:
              'Khung miêu tả dùng được ở cả Speaking Part 2 sau này: (1) giới thiệu đối tượng, (2) ngoại hình '
              + '/ đặc điểm bằng tính từ đúng thứ tự, (3) so sánh với thứ khác, (4) cảm nghĩ của bạn.',
            examples: [
              {
                en: 'I would like to talk about my grandmother. She is a small, quiet old woman with grey hair. She is much more patient than anyone else in my family. She never gets angry, even when we are noisy. I admire her because she raised five children on her own.',
                vi: 'Tôi muốn nói về bà tôi. Bà là một người phụ nữ già nhỏ nhắn, trầm tính, tóc bạc. Bà kiên nhẫn hơn bất kỳ ai trong nhà tôi. Bà không bao giờ nổi giận, kể cả khi chúng tôi ồn ào. Tôi ngưỡng mộ bà vì bà một mình nuôi năm người con.',
              },
            ],
            mistake: {
              wrong: 'My grandmother is good. She is nice. She is kind. (ba câu cùng cấu trúc, tính từ chung chung)',
              right: 'Thay bằng tính từ cụ thể + một câu so sánh + một câu lý do.',
              why: 'Tính từ chung chung (good, nice) không cho thấy vốn từ. Giám khảo chấm ĐỘ CHÍNH XÁC và ĐỘ CỤ THỂ của từ.',
            },
          },
        ],
        practice: [
          'Viết bài miêu tả 100 từ về một người bạn ngưỡng mộ, theo đúng 4 bước trên.',
          'Gạch chân mọi tính từ, thay ít nhất 3 tính từ chung chung bằng từ cụ thể hơn.',
          'Thu âm nói 1 phút, đếm số lần dừng.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 7: CÂU HỎI & TỪ NỐI ═════════════════ */
  {
    id: 'question',
    title: 'Câu hỏi, giới từ & từ nối',
    subtitle: 'Bài 31–35 · Nền của Speaking và của đoạn văn mạch lạc',
    icon: '🔗',
    lessons: [
      {
        id: 'k1',
        n: 31,
        title: 'Câu hỏi Wh- — hỏi đúng thì nghe cũng đúng',
        goal: 'Đặt được câu hỏi đủ 7 từ để hỏi, và nhận ra đề đang hỏi gì khi nghe.',
        blocks: [
          {
            formula: 'Wh- + trợ động từ + S + V? (What do you do? / Where does she live?)',
            explain:
              'What (cái gì), Where (ở đâu), When (khi nào), Who (ai), Why (tại sao), How (thế nào), '
              + 'Which (cái nào). Trật tự BẮT BUỘC đảo: từ hỏi → trợ động từ → chủ ngữ → động từ.',
            examples: [
              { en: 'Where do you live?', vi: 'Bạn sống ở đâu?' },
              { en: 'Why did she leave early?', vi: 'Sao cô ấy về sớm?' },
              { en: 'How long have you studied English?', vi: 'Bạn học tiếng Anh bao lâu rồi?' },
              { en: 'Who lives here? (hỏi về chủ ngữ → KHÔNG đảo)', vi: 'Ai sống ở đây?' },
            ],
            mistake: {
              wrong: 'Where you live? / Why she left early?',
              right: 'Where do you live? / Why did she leave early?',
              why:
                'Tiếng Việt không có trợ động từ nên người Việt bỏ luôn do/does/did. Trong Listening, đề rất '
                + 'hay dựa vào từ hỏi để định hướng đáp án — nghe sót từ hỏi là làm sai cả câu.',
            },
          },
        ],
        practice: [
          'Viết 10 câu hỏi Wh- ở các thì khác nhau, hỏi về một người bạn.',
          'Nhờ ai đó trả lời, hoặc tự trả lời, rồi kiểm lại trật tự từ trong câu hỏi.',
        ],
      },
      {
        id: 'k2',
        n: 32,
        title: 'Giới từ thời gian: in / on / at',
        goal: 'Không còn sai giới từ khi nói ngày giờ — lỗi rất hay gặp trong Listening.',
        blocks: [
          {
            formula: 'at + giờ · on + ngày/thứ · in + tháng/năm/mùa/buổi',
            explain:
              'Nhớ theo độ RỘNG của thời gian: hẹp nhất dùng at (at 6 o\'clock), rộng vừa dùng on (on Monday, '
              + 'on 5 May), rộng nhất dùng in (in May, in 2020, in the morning). Ngoại lệ phải thuộc: at night, at the weekend.',
            examples: [
              { en: 'The class starts at eight.', vi: 'Lớp bắt đầu lúc tám giờ.' },
              { en: 'I have an exam on Monday.', vi: 'Tôi có bài thi vào thứ Hai.' },
              { en: 'She was born in 2005.', vi: 'Cô ấy sinh năm 2005.' },
              { en: 'I study best in the morning, but I never study at night.', vi: 'Tôi học tốt nhất buổi sáng, nhưng không bao giờ học ban đêm.' },
            ],
            mistake: {
              wrong: 'in Monday / on 2020 / in night',
              right: 'on Monday / in 2020 / at night',
              why: 'Sai giới từ không làm mất nghĩa nhưng bị đếm là lỗi ngữ pháp. Lặp lại nhiều lần thì kéo điểm xuống rõ rệt.',
            },
          },
        ],
        practice: [
          'Viết 9 câu, mỗi giới từ 3 câu, về lịch học và lịch sinh hoạt của bạn.',
          'Học riêng nhóm ngoại lệ: at night, at the weekend, at Christmas, on time, in time.',
        ],
      },
      {
        id: 'k3',
        n: 33,
        title: 'Giới từ nơi chốn: in / on / at',
        goal: 'Nói đúng vị trí — dùng ngay ở dạng Map Labelling của Listening.',
        blocks: [
          {
            formula: 'in + không gian bao quanh · on + bề mặt · at + một điểm/địa chỉ cụ thể',
            explain:
              'in the room (trong phòng), on the table (trên mặt bàn), at the bus stop (tại điểm dừng). '
              + 'Với thành phố dùng in; với địa chỉ cụ thể dùng at.',
            examples: [
              { en: 'I live in Da Nang, at 25 Le Loi Street.', vi: 'Tôi sống ở Đà Nẵng, tại số 25 đường Lê Lợi.' },
              { en: 'The book is on the shelf.', vi: 'Quyển sách ở trên kệ.' },
              { en: 'Wait for me at the entrance.', vi: 'Đợi tôi ở lối vào.' },
            ],
            mistake: {
              wrong: 'I live at Da Nang. / The keys are in the table.',
              right: 'I live in Da Nang. / The keys are on the table.',
              why: '"in the table" nghĩa là ở BÊN TRONG cái bàn. Bề mặt luôn dùng "on".',
            },
          },
        ],
        practice: [
          'Vẽ sơ đồ phòng bạn, viết 8 câu mô tả vị trí đồ vật bằng in/on/at và các giới từ ở bài 33 phần từ vựng.',
          'Đọc to mô tả đó cho người khác nghe, xem họ vẽ lại có đúng không.',
        ],
      },
      {
        id: 'k4',
        n: 34,
        title: 'Từ nối cơ bản: and, but, because, so',
        goal: 'Nối hai câu ngắn thành một câu dài — bước đầu tiên để thoát khỏi văn liệt kê.',
        blocks: [
          {
            formula: 'Mệnh đề 1 + and/but/so + Mệnh đề 2 · because + lý do',
            explain:
              'and (thêm ý), but (đối lập), so (kết quả), because (lý do). Bốn từ này giải quyết 80% nhu cầu '
              + 'nối câu ở chặng 1. Các từ nối học thuật (moreover, nevertheless) để dành chặng sau — dùng sớm hay sai ngữ cảnh.',
            examples: [
              { en: 'I like coffee, but I do not drink it at night.', vi: 'Tôi thích cà phê, nhưng tôi không uống vào ban đêm.' },
              { en: 'It was raining, so we stayed at home.', vi: 'Trời mưa nên chúng tôi ở nhà.' },
              { en: 'I study English because I want to travel.', vi: 'Tôi học tiếng Anh vì tôi muốn đi du lịch.' },
            ],
            mistake: {
              wrong: 'Because it was raining, so we stayed at home.',
              right: 'Because it was raining, we stayed at home. HOẶC It was raining, so we stayed at home.',
              why:
                'Tiếng Việt nói "Vì… nên…" có cả hai vế. Tiếng Anh chỉ được dùng MỘT trong hai: because hoặc '
                + 'so, không dùng đồng thời. Lỗi này rất phổ biến và bị trừ điểm ngay.',
            },
          },
        ],
        practice: [
          'Lấy 10 câu ngắn bạn đã viết ở các bài trước, ghép thành 5 câu dài bằng 4 từ nối trên.',
          'Viết 4 câu với "because" đặt ở đầu câu (nhớ dấu phẩy giữa hai vế).',
        ],
      },
      {
        id: 'k5',
        n: 35,
        title: 'Đại từ quan hệ who / which / that',
        goal: 'Viết được câu có mệnh đề quan hệ — bước lên đa dạng ngữ pháp.',
        blocks: [
          {
            formula: 'người → who · vật → which · cả hai → that',
            explain:
              'Mệnh đề quan hệ giúp gộp hai câu về CÙNG một đối tượng thành một câu. Đây là cấu trúc "phức" '
              + 'đầu tiên bạn nên dùng, vì nó dễ mà lại cho thấy ngữ pháp đa dạng.',
            examples: [
              { en: 'I have a friend who lives in Japan.', vi: 'Tôi có một người bạn sống ở Nhật.' },
              { en: 'This is the book which changed my life.', vi: 'Đây là quyển sách đã thay đổi đời tôi.' },
              { en: 'The house that we rented was very small.', vi: 'Căn nhà chúng tôi thuê rất nhỏ.' },
            ],
            mistake: {
              wrong: 'I have a friend, he lives in Japan.',
              right: 'I have a friend who lives in Japan.',
              why:
                'Nối hai mệnh đề bằng dấu phẩy suông là lỗi câu chạy (run-on). Phải dùng đại từ quan hệ, '
                + 'hoặc tách hẳn thành hai câu có dấu chấm.',
            },
          },
        ],
        practice: [
          'Viết 6 câu có mệnh đề quan hệ: 2 câu who, 2 câu which, 2 câu that.',
          'Lấy một đoạn đã viết, tìm 2 chỗ có thể gộp câu bằng who/which và viết lại.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 8: TỪ CÂU SANG ĐOẠN ═════════════════ */
  {
    id: 'paragraph',
    title: 'Từ câu sang đoạn — mốc thật của chặng 1',
    subtitle: 'Bài 36–40 · Viết đoạn, nghe số, đánh vần, soát lỗi',
    icon: '📝',
    lessons: [
      {
        id: 'w1',
        n: 36,
        title: 'Cấu trúc một đoạn văn: câu chủ đề + triển khai',
        goal: 'Viết được đoạn 80–100 từ có mở đoạn, thân đoạn, kết đoạn rõ ràng.',
        blocks: [
          {
            formula: 'Câu chủ đề → 2–3 câu triển khai → 1 câu ví dụ → câu chốt',
            explain:
              'Một đoạn văn tiếng Anh LUÔN bắt đầu bằng câu nêu ý chính (topic sentence). Người Việt hay viết '
              + 'lòng vòng rồi mới chốt ý ở cuối — cách đó bị chấm thấp ở tiêu chí mạch lạc.',
            examples: [
              {
                en: 'Learning English has changed my daily life. First, I can read news from other countries every morning. I also watch films without subtitles now, which was impossible two years ago. For example, last week I understood a whole documentary about animals. Because of this, I feel more confident about studying abroad.',
                vi: 'Học tiếng Anh đã thay đổi cuộc sống hằng ngày của tôi. Trước hết, mỗi sáng tôi đọc được tin tức từ các nước khác. Tôi cũng xem phim không cần phụ đề, điều mà hai năm trước là không thể. Ví dụ, tuần trước tôi hiểu trọn một phim tài liệu về động vật. Nhờ vậy, tôi tự tin hơn về việc đi du học.',
              },
            ],
            mistake: {
              wrong: 'Viết một đoạn dài không xuống dòng, không có câu chủ đề, ý nhảy lung tung.',
              right: 'Câu đầu tiên nói thẳng ý chính của cả đoạn.',
              why: 'Giám khảo đọc câu đầu để biết đoạn nói gì. Không có câu chủ đề là mất điểm Coherence ngay lập tức.',
            },
          },
        ],
        practice: [
          'Viết 3 đoạn 80 từ theo đúng khung: về việc học tiếng Anh, về quê bạn, về một thói quen tốt.',
          'Gạch chân câu chủ đề của mỗi đoạn — nếu không gạch được thì đoạn đó chưa đạt.',
        ],
      },
      {
        id: 'w2',
        n: 37,
        title: 'Nghe số và đánh vần — nơi mất điểm oan nhất',
        goal: 'Chép đúng số điện thoại, ngày tháng, tên riêng khi nghe.',
        blocks: [
          {
            explain:
              'Listening Section 1 gần như luôn có 3–4 câu dạng này. Ba bẫy kinh điển: (1) cặp 13/30, 14/40, '
              + '15/50 — khác nhau ở TRỌNG ÂM: thirTEEN nhấn cuối, THIRty nhấn đầu; (2) số 0 đọc là "oh" hoặc '
              + '"zero"; (3) hai số giống nhau liền nhau đọc là "double": 4477 = "double four double seven".',
            examples: [
              { en: '0 9 8 7 → "oh nine eight seven"', vi: 'số 0 trong dãy số đọc là "oh"' },
              { en: '3355 → "double three double five"', vi: 'hai số giống nhau đọc "double"' },
              { en: '15 (fifTEEN) vs 50 (FIFty)', vi: 'nghe TRỌNG ÂM, không nghe từng âm' },
              { en: '5 May 2024 → "the fifth of May twenty twenty-four"', vi: 'ngày đọc là số thứ tự' },
            ],
            mistake: {
              wrong: 'Nghe "thirty" mà viết 13.',
              right: 'Nghe trọng âm rơi ở âm tiết ĐẦU (THIRty) → 30; rơi ở âm tiết SAU (thirTEEN) → 13.',
              why:
                'Đây là mất điểm oan: bạn nghe hiểu cả câu nhưng ghi sai một chữ số vẫn 0 điểm. Luyện riêng '
                + 'phần này 10 phút mỗi ngày trong 1 tuần là gần như hết sai.',
            },
          },
          {
            explain:
              'Đánh vần tên riêng: phải thuộc cách đọc 26 chữ cái, đặc biệt các chữ hay nhầm — G /dʒiː/ vs '
              + 'J /dʒeɪ/, E /iː/ vs I /aɪ/, A /eɪ/ vs R /ɑː/, và cách nói "double L", "capital N".',
            examples: [
              { en: 'N-G-U-Y-E-N → "en, jee, you, why, ee, en"', vi: 'đánh vần họ Nguyễn' },
              { en: 'MILLER → "em, eye, double el, ee, ar"', vi: 'chú ý "double el"' },
            ],
          },
        ],
        practice: [
          'Nhờ ai đó đọc 20 dãy số ngẫu nhiên (có cả double và số 0), bạn chép lại. Đạt 18/20 mới qua.',
          'Tự đánh vần to tên đầy đủ của 10 người bạn bằng tiếng Anh, không nhìn bảng chữ cái.',
          'Luyện riêng 6 cặp: 13/30, 14/40, 15/50, 16/60, 17/70, 18/80.',
        ],
      },
      {
        id: 'w3',
        n: 38,
        title: 'Chép chính tả — bài tập hiệu quả nhất chặng 1',
        goal: 'Biến việc nghe thụ động thành nghe chủ động, tăng cả nghe lẫn chính tả.',
        blocks: [
          {
            explain:
              'Cách làm: chọn một đoạn 30–60 giây ở mức dễ. (1) Nghe cả đoạn 1 lần, không viết. (2) Nghe từng '
              + 'câu, tạm dừng, viết ra. (3) Nghe lại tới khi không thêm được chữ nào. (4) MỞ transcript, dùng '
              + 'bút đỏ đánh dấu chỗ sai. (5) Đọc to đoạn đó 2 lần. Bước 4 và 5 mới là chỗ tạo tiến bộ — bỏ hai bước này thì chép chính tả vô ích.',
            examples: [
              { en: 'Sai vì không nghe ra âm cuối: "he work" thay vì "he works"', vi: 'nối lại bài 1 và bài 11' },
              { en: 'Sai vì nối âm: "an apple" nghe thành "a napple"', vi: 'hiện tượng nối phụ âm cuối với nguyên âm đầu' },
            ],
            mistake: {
              wrong: 'Nghe đi nghe lại 10 lần mà không bao giờ mở transcript đối chiếu.',
              right: 'Luôn đối chiếu transcript và ghi lại LOẠI lỗi mình mắc.',
              why:
                'Không đối chiếu thì bạn không biết mình nghe sai chỗ nào, lần sau lặp lại y hệt. Ghi lại '
                + 'LOẠI lỗi (âm cuối, nối âm, số) quan trọng hơn ghi từ bị sai.',
            },
          },
        ],
        practice: [
          'Mỗi ngày chép chính tả 5 phút, dùng phần Nghe của trang này (có sẵn transcript để đối chiếu).',
          'Lập một bảng "lỗi nghe của tôi" với 3 cột: từ nghe nhầm — từ đúng — loại lỗi. Sau 2 tuần xem loại nào lặp nhiều nhất rồi luyện riêng loại đó.',
        ],
      },
      {
        id: 'w4',
        n: 39,
        title: 'Bảng soát lỗi 8 điểm — dùng cho mọi bài viết',
        goal: 'Tự phát hiện được lỗi của mình trước khi nhờ người khác chấm.',
        blocks: [
          {
            explain:
              'Sau khi viết xong, đọc lại bài ĐÚNG 8 LẦN, mỗi lần chỉ soát MỘT loại lỗi. Soát một lần mà tìm '
              + 'mọi lỗi thì luôn sót. Thứ tự dưới đây xếp theo mức độ bị trừ điểm.',
            examples: [
              { en: '1. Động từ chia đúng thì chưa? (nhất là -s ngôi thứ ba và -ed quá khứ)', vi: 'lỗi nặng nhất' },
              { en: '2. Danh từ số nhiều có thiếu -s không?', vi: '' },
              { en: '3. Mạo từ a/an/the có thiếu hoặc thừa không?', vi: '' },
              { en: '4. Chủ ngữ và động từ có hợp nhau không?', vi: 'He go → He goes' },
              { en: '5. Giới từ in/on/at đúng chưa?', vi: '' },
              { en: '6. Có câu nào thiếu động từ không?', vi: 'lỗi bỏ to be' },
              { en: '7. Có dùng cả because và so trong một câu không?', vi: '' },
              { en: '8. Có câu nào dài quá 25 từ không? Nếu có, tách đôi.', vi: 'câu quá dài thường kèm lỗi' },
            ],
            mistake: {
              wrong: 'Viết xong nộp luôn, hoặc đọc lại một lượt cho có.',
              right: 'Dành 5 phút cuối soát theo đúng 8 bước, mỗi bước một lượt đọc.',
              why:
                'Ở chặng 1, phần lớn lỗi là lỗi BẤT CẨN chứ không phải không biết. Soát kỹ có thể nâng nửa '
                + 'band mà không cần học thêm gì.',
            },
          },
        ],
        practice: [
          'In bảng 8 điểm này ra, để cạnh bàn. Áp dụng cho 5 bài viết gần nhất của bạn.',
          'Đếm xem mỗi lần soát bắt được bao nhiêu lỗi ở từng mục — mục nào nhiều nhất là điểm yếu của bạn.',
        ],
      },
      {
        id: 'w5',
        n: 40,
        title: 'Bài kiểm tra cuối chặng — bạn đã lên 4.0 chưa?',
        goal: 'Tự đánh giá xem đủ điều kiện sang chặng 2 chưa, bằng tiêu chí đo được.',
        blocks: [
          {
            explain:
              'Không đoán bằng cảm giác. Làm đủ 6 phép kiểm dưới đây; đạt từ 5/6 trở lên thì sang chặng 2. '
              + 'Chưa đạt thì quay lại đúng chủ điểm còn yếu, không cần học lại từ đầu.',
            examples: [
              { en: '1. Từ vựng: cho 30 nghĩa tiếng Việt bất kỳ trong 300 từ, bật ra được ≥ 25 từ tiếng Anh.', vi: 'kiểm bằng tab Từ vựng, chế độ Lật thẻ' },
              { en: '2. Nghe: làm 3 bài nghe ở tab Nghe, mỗi bài đúng ≥ 6/8.', vi: '' },
              { en: '3. Đọc: làm 1 bài ở tab Đọc trong đúng thời gian, đúng ≥ 7/10.', vi: '' },
              { en: '4. Viết: viết đoạn 100 từ, tự soát bằng bảng 8 điểm, còn ≤ 5 lỗi ngữ pháp.', vi: '' },
              { en: '5. Nói: nói 1 phút về bản thân, dừng ≤ 3 lần, không dịch trong đầu.', vi: '' },
              { en: '6. Âm: đọc 20 từ có âm /θ/ /ð/ /s/ /ʃ/ và âm cuối, thu âm nghe lại, sai ≤ 4 từ.', vi: '' },
            ],
            mistake: {
              wrong: 'Vội sang chặng 2 khi từ vựng mới được 800 từ.',
              right: 'Đủ 1.500 từ nền rồi mới đụng đề IELTS thật.',
              why:
                'Làm đề khi chưa đủ từ vựng thì mỗi bài đều sai vì không hiểu từ, không phải vì không biết '
                + 'dạng. Người học nản và bỏ ở đúng chỗ này.',
            },
          },
        ],
        practice: [
          'Làm đủ 6 phép kiểm trong 2 ngày, ghi kết quả ra giấy.',
          'Mục nào chưa đạt, quay lại chủ điểm tương ứng: âm → chủ điểm 1, ngữ pháp câu → chủ điểm 2–4, viết đoạn → chủ điểm 8.',
          'Đạt ≥ 5/6 thì đánh dấu 4 mốc của chặng 1 ở tab Lộ trình và sang chặng 2.',
        ],
      },
    ],
  },
];
