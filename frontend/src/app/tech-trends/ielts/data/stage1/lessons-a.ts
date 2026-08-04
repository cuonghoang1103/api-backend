/**
 * Bài học chặng 1 — phần A: chủ điểm 1–4 (bài 1–20).
 *
 * Thứ tự các chủ điểm KHÔNG theo sách ngữ pháp truyền thống mà theo thứ tự
 * người học cần dùng:
 *   1. Âm — học trước tiên, vì phát âm sai đã quen miệng thì sửa tốn gấp
 *      nhiều lần, mà nghe cũng hỏng theo (không nói được âm nào thì thường
 *      không nghe ra âm đó).
 *   2. Câu cơ bản — có câu mới có chỗ lắp từ vựng vào.
 *   3. Hiện tại, 4. Quá khứ — hai thì chiếm phần lớn câu trong đề thi thật.
 *
 * Mỗi bài đều có mục `mistake` ghi lỗi NGƯỜI VIỆT hay mắc, không phải lỗi
 * chung chung. Đây là phần khác biệt so với giáo trình dịch từ tiếng Anh.
 */
import type { LessonUnit } from '../types';

export const UNITS_A: LessonUnit[] = [
  /* ═════════════════ CHỦ ĐIỂM 1: ÂM ═════════════════ */
  {
    id: 'sounds',
    title: 'Âm tiếng Anh — sửa trước khi quen miệng',
    subtitle: 'Bài 1–5 · Những âm người Việt gần như luôn đọc sai',
    icon: '🔊',
    lessons: [
      {
        id: 's1',
        n: 1,
        title: 'Âm cuối — thứ người Việt bỏ quên nhiều nhất',
        goal: 'Đọc bật ra được phụ âm cuối của mọi từ, và nghe ra được số nhiều khi người khác nói.',
        blocks: [
          {
            explain:
              'Tiếng Việt không có phụ âm bật ở cuối từ, nên người Việt tự động nuốt âm cuối: "like" '
              + 'thành "lai", "book" thành "bút". Hậu quả không chỉ ở nói: vì bạn không phát ra âm đó, '
              + 'não bạn cũng không lọc ra âm đó khi nghe — mất điểm Listening ở chỗ số nhiều và thì quá khứ.',
            examples: [
              { en: 'like /laɪk/ — bật rõ /k/ ở cuối', vi: 'thích' },
              { en: 'books /bʊks/ — có /s/ mới biết là số nhiều', vi: 'những quyển sách' },
              { en: 'worked /wɜːkt/ — /t/ ở cuối cho biết đây là quá khứ', vi: 'đã làm việc' },
            ],
            mistake: {
              wrong: 'I like /laɪ/ two book /bʊ/.',
              right: 'I like /laɪk/ two books /bʊks/.',
              why:
                'Nuốt /k/ và /s/ thì người nghe không biết bạn nói số ít hay số nhiều. Trong Listening, '
                + 'chính bạn cũng sẽ không nghe ra "books" khác "book".',
            },
          },
        ],
        keyWords: [
          { en: 'book', ipa: '/bʊk/', vi: 'quyển sách' },
          { en: 'books', ipa: '/bʊks/', vi: 'những quyển sách' },
          { en: 'worked', ipa: '/wɜːkt/', vi: 'đã làm việc' },
          { en: 'stopped', ipa: '/stɒpt/', vi: 'đã dừng' },
        ],
        practice: [
          'Đọc to 10 lần cặp: book – books, cat – cats, map – maps. Đặt tay trước miệng, phải thấy hơi bật ra ở âm cuối.',
          'Thu âm chính bạn đọc "I worked at a shop and bought two books." rồi nghe lại, đếm xem bạn bật đủ mấy âm cuối.',
        ],
      },
      {
        id: 's2',
        n: 2,
        title: 'Âm /θ/ và /ð/ — think, this, the',
        goal: 'Đọc đúng "think", "this", "the" bằng cách đặt lưỡi giữa hai hàm răng.',
        blocks: [
          {
            explain:
              'Hai âm này KHÔNG có trong tiếng Việt nên người Việt thay bằng /t/, /d/ hoặc /s/: "think" '
              + 'thành "tin", "this" thành "dis". Cách làm đúng: đặt đầu lưỡi CHẠM nhẹ giữa hai hàm răng rồi '
              + 'thổi hơi ra. /θ/ không rung cổ họng; /ð/ có rung.',
            examples: [
              { en: 'think /θɪŋk/ — không rung cổ', vi: 'nghĩ' },
              { en: 'three /θriː/', vi: 'số ba' },
              { en: 'this /ðɪs/ — có rung cổ', vi: 'cái này' },
              { en: 'the /ðə/ — âm hay gặp nhất trong tiếng Anh', vi: 'mạo từ xác định' },
            ],
            mistake: {
              wrong: 'I tink dis is de best.',
              right: 'I think /θ/ this /ð/ is the /ð/ best.',
              why:
                '"tink" nghe ra "tin" (thiếc), nghĩa hoàn toàn khác. Riêng "the" xuất hiện vài chục lần '
                + 'trong một bài nói — đọc sai chỗ này là lỗi lặp liên tục, trừ điểm Pronunciation rất nhanh.',
            },
          },
        ],
        keyWords: [
          { en: 'think', ipa: '/θɪŋk/', vi: 'nghĩ' },
          { en: 'thank', ipa: '/θæŋk/', vi: 'cảm ơn' },
          { en: 'this', ipa: '/ðɪs/', vi: 'cái này' },
          { en: 'those', ipa: '/ðəʊz/', vi: 'những cái kia' },
        ],
        practice: [
          'Soi gương đọc "think": phải NHÌN THẤY đầu lưỡi thò ra giữa hai hàm răng. Không thấy lưỡi là bạn đang đọc sai.',
          'Đọc câu: "I think this thing is thirty." — 4 lần /θ/ và /ð/ trong một câu.',
        ],
      },
      {
        id: 's3',
        n: 3,
        title: 'Cặp âm /s/ – /ʃ/ và /tʃ/ – /dʒ/',
        goal: 'Phân biệt được see – she, chair – share khi nói và khi nghe.',
        blocks: [
          {
            explain:
              'Người Việt hay trộn /s/ (như "x" tiếng Việt) với /ʃ/ (như "s" miền Bắc). /s/ đầu lưỡi gần '
              + 'lợi trên, hơi thoát thành luồng hẹp. /ʃ/ lưỡi lùi sau hơn, môi hơi tròn.',
            examples: [
              { en: 'see /siː/ vs she /ʃiː/', vi: 'nhìn thấy vs cô ấy' },
              { en: 'sea /siː/ vs sheep /ʃiːp/', vi: 'biển vs con cừu' },
              { en: 'chair /tʃeə(r)/ vs share /ʃeə(r)/', vi: 'cái ghế vs chia sẻ' },
            ],
            mistake: {
              wrong: 'Nói "She sells sea shells" mà mọi âm đều thành /s/.',
              right: '/ʃ/ ở "She", "shells"; /s/ ở "sells", "sea".',
              why:
                'Trong Listening, đề rất hay bẫy bằng cặp gần âm. Không phân biệt được khi nói thì cũng '
                + 'không phân biệt được khi nghe.',
            },
          },
        ],
        keyWords: [
          { en: 'she', ipa: '/ʃiː/', vi: 'cô ấy' },
          { en: 'sheep', ipa: '/ʃiːp/', vi: 'con cừu' },
          { en: 'cheap', ipa: '/tʃiːp/', vi: 'rẻ' },
          { en: 'change', ipa: '/tʃeɪndʒ/', vi: 'thay đổi' },
        ],
        practice: [
          'Đọc chậm rồi tăng dần: "She sells cheap sheep." Ghi âm, nghe lại xem có phân biệt được không.',
          'Nhờ người khác đọc ngẫu nhiên see/she, bạn quay lưng lại nghe và đoán — đúng 8/10 mới đạt.',
        ],
      },
      {
        id: 's4',
        n: 4,
        title: 'Nguyên âm dài – ngắn: ship hay sheep?',
        goal: 'Kéo dài đúng nguyên âm để không bị hiểu nhầm sang từ khác.',
        blocks: [
          {
            explain:
              'Tiếng Việt phân biệt từ bằng dấu; tiếng Anh phân biệt bằng ĐỘ DÀI nguyên âm. /ɪ/ ngắn và '
              + 'thả lỏng, /iː/ dài và căng môi. Đọc đều nhau là hai từ khác nghĩa lẫn vào nhau.',
            examples: [
              { en: 'ship /ʃɪp/ (con tàu) vs sheep /ʃiːp/ (con cừu)', vi: 'ngắn vs dài' },
              { en: 'live /lɪv/ (sống) vs leave /liːv/ (rời đi)', vi: 'nghĩa ngược hẳn nhau' },
              { en: 'full /fʊl/ (đầy) vs fool /fuːl/ (kẻ ngốc)', vi: 'cặp /ʊ/ – /uː/' },
            ],
            mistake: {
              wrong: 'I want to live now. (ý muốn nói "tôi muốn ĐI bây giờ")',
              right: 'I want to leave /liːv/ now.',
              why: 'Sai độ dài nguyên âm ở đây làm câu mang nghĩa ngược lại hoàn toàn.',
            },
          },
        ],
        keyWords: [
          { en: 'leave', ipa: '/liːv/', vi: 'rời đi' },
          { en: 'live', ipa: '/lɪv/', vi: 'sống' },
          { en: 'seat', ipa: '/siːt/', vi: 'chỗ ngồi' },
          { en: 'sit', ipa: '/sɪt/', vi: 'ngồi' },
        ],
        practice: [
          'Đọc từng cặp, tay vỗ nhịp: từ ngắn 1 nhịp, từ dài 2 nhịp. Cảm nhận được độ dài bằng tay trước rồi mới bằng tai.',
          'Viết 5 câu dùng cả hai từ trong cặp, đọc to từng câu.',
        ],
      },
      {
        id: 's5',
        n: 5,
        title: 'Trọng âm từ — đọc sai trọng âm là mất nghĩa',
        goal: 'Xác định được trọng âm và đọc nhấn đúng âm tiết.',
        blocks: [
          {
            explain:
              'Tiếng Anh có âm tiết nhấn (đọc to, dài, rõ) và âm tiết không nhấn (đọc nhẹ, thường thành '
              + '/ə/). Đọc đều tăm tắp mọi âm tiết là dấu hiệu rõ nhất của người mới. Trong từ điển, trọng '
              + 'âm là dấu ˈ đặt TRƯỚC âm tiết được nhấn.',
            examples: [
              { en: 'PHOtograph /ˈfəʊtəɡrɑːf/', vi: 'bức ảnh — nhấn âm 1' },
              { en: 'phoTOgrapher /fəˈtɒɡrəfə(r)/', vi: 'nhiếp ảnh gia — nhấn âm 2' },
              { en: 'photoGRAPHic /ˌfəʊtəˈɡræfɪk/', vi: 'thuộc nhiếp ảnh — nhấn âm 3' },
            ],
            mistake: {
              wrong: 'Đọc "hotel" thành HO-tel.',
              right: 'ho-TEL /həʊˈtel/ — nhấn âm thứ hai.',
              why:
                'Người bản xứ nghe trọng âm trước khi nghe từng âm. Sai trọng âm thì dù đọc đủ âm họ vẫn '
                + 'không nhận ra từ.',
            },
          },
        ],
        keyWords: [
          { en: 'hotel', ipa: '/həʊˈtel/', vi: 'khách sạn' },
          { en: 'develop', ipa: '/dɪˈveləp/', vi: 'phát triển' },
          { en: 'important', ipa: '/ɪmˈpɔːtnt/', vi: 'quan trọng' },
          { en: 'comfortable', ipa: '/ˈkʌmftəbl/', vi: 'thoải mái' },
        ],
        practice: [
          'Lấy 20 từ vừa học, tra từ điển và đánh dấu trọng âm. Đọc to, vỗ tay MẠNH vào đúng âm tiết nhấn.',
          'Chú ý các từ dài: comfortable đọc 3 âm tiết /ˈkʌmf-tə-bl/ chứ không phải 4.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 2: CÂU CƠ BẢN ═════════════════ */
  {
    id: 'basic-sentence',
    title: 'Câu cơ bản — có khung rồi mới lắp từ',
    subtitle: 'Bài 6–10 · to be, danh từ đếm được, mạo từ, sở hữu',
    icon: '🧩',
    lessons: [
      {
        id: 'b1',
        n: 6,
        title: 'Động từ to be — am / is / are',
        goal: 'Viết và nói được câu giới thiệu bản thân không sai động từ.',
        blocks: [
          {
            formula: 'S + am/is/are + (danh từ / tính từ / nơi chốn)',
            explain:
              'I đi với **am**; he/she/it và danh từ số ít đi với **is**; you/we/they và danh từ số nhiều '
              + 'đi với **are**. Đây là câu đầu tiên bạn phải viết đúng 100% — nó xuất hiện trong mọi bài viết.',
            examples: [
              { en: 'I am a student.', vi: 'Tôi là sinh viên.' },
              { en: 'She is from Hue.', vi: 'Cô ấy đến từ Huế.' },
              { en: 'My parents are teachers.', vi: 'Bố mẹ tôi là giáo viên.' },
              { en: 'The room is very small.', vi: 'Căn phòng rất nhỏ.' },
            ],
            mistake: {
              wrong: 'I student. / She from Hue.',
              right: 'I am a student. / She is from Hue.',
              why:
                'Tiếng Việt không cần "là" trước tính từ ("Tôi mệt"), nên người Việt hay bỏ luôn to be. '
                + 'Trong tiếng Anh, câu thiếu động từ là câu SAI, không phải câu rút gọn.',
            },
          },
          {
            formula: 'Phủ định: S + am/is/are + not · Hỏi: Am/Is/Are + S + …?',
            explain: 'Câu phủ định và câu hỏi của to be không cần trợ động từ do/does — chỉ đảo chỗ hoặc thêm "not".',
            examples: [
              { en: 'I am not ready.', vi: 'Tôi chưa sẵn sàng.' },
              { en: 'Is she your sister?', vi: 'Cô ấy là chị bạn phải không?' },
              { en: 'Are they at home?', vi: 'Họ có ở nhà không?' },
            ],
            mistake: {
              wrong: 'Do you are a student?',
              right: 'Are you a student?',
              why: 'Đã có to be thì KHÔNG dùng thêm do/does. Dùng cả hai là lỗi rất nặng, thấy ngay ở band thấp.',
            },
          },
        ],
        practice: [
          'Viết 8 câu về bản thân dùng am/is/are: tên, tuổi, quê, nghề, tính cách, nơi ở, gia đình, sở thích.',
          'Đổi cả 8 câu sang phủ định rồi sang câu hỏi. Đọc to từng câu.',
        ],
      },
      {
        id: 'b2',
        n: 7,
        title: 'Danh từ đếm được và không đếm được',
        goal: 'Biết khi nào thêm -s và khi nào tuyệt đối không được thêm.',
        blocks: [
          {
            explain:
              'Danh từ đếm được có số ít / số nhiều (a book → two books). Danh từ KHÔNG đếm được không bao '
              + 'giờ thêm -s và luôn đi với động từ số ít: information, advice, furniture, knowledge, money, '
              + 'water, homework, research, equipment. Nhóm này là bẫy vì trong tiếng Việt chúng đếm được bình thường.',
            examples: [
              { en: 'I need some information.', vi: 'Tôi cần một ít thông tin.' },
              { en: 'She gave me good advice.', vi: 'Cô ấy cho tôi lời khuyên hay.' },
              { en: 'There is a lot of furniture in the room.', vi: 'Có nhiều đồ đạc trong phòng.' },
            ],
            mistake: {
              wrong: 'She gave me many advices and informations.',
              right: 'She gave me a lot of advice and information.',
              why:
                'Lỗi này gặp ở gần như 100% bài viết band 4–5 của người Việt. Nhớ nhóm 9 từ ở trên là '
                + 'tránh được phần lớn.',
            },
          },
          {
            formula: 'many + đếm được · much / a lot of + không đếm được',
            explain: 'Chọn từ chỉ lượng theo loại danh từ. "a lot of" dùng được cho cả hai — an toàn khi chưa chắc.',
            examples: [
              { en: 'many students / much water / a lot of both', vi: 'nhiều sinh viên / nhiều nước' },
              { en: 'a few books (một vài) vs a little water (một ít)', vi: 'few + đếm được, little + không đếm được' },
            ],
          },
        ],
        keyWords: [
          { en: 'information', ipa: '/ˌɪnfəˈmeɪʃn/', vi: 'thông tin (không đếm được)' },
          { en: 'advice', ipa: '/ədˈvaɪs/', vi: 'lời khuyên (không đếm được)' },
          { en: 'equipment', ipa: '/ɪˈkwɪpmənt/', vi: 'thiết bị (không đếm được)' },
        ],
        practice: [
          'Chép danh sách 9 danh từ không đếm được hay dùng, dán ở bàn học. Mỗi lần viết bài, soát lại xem có thêm nhầm -s không.',
          'Viết 6 câu, 3 câu dùng danh từ đếm được số nhiều, 3 câu dùng danh từ không đếm được.',
        ],
      },
      {
        id: 'b3',
        n: 8,
        title: 'Mạo từ a / an / the — lỗi mất điểm âm thầm',
        goal: 'Dùng đúng a, an, the và biết khi nào không cần mạo từ.',
        blocks: [
          {
            formula: 'a + phụ âm · an + nguyên âm (theo ÂM, không theo chữ) · the + đã xác định',
            explain:
              'Dùng **a/an** khi nhắc lần đầu hoặc nói chung chung. Dùng **the** khi cả người nói và người '
              + 'nghe đều biết đang nói vật nào. Không mạo từ khi nói về danh từ số nhiều hoặc không đếm được ở nghĩa chung.',
            examples: [
              { en: 'I bought a book. The book was expensive.', vi: 'Tôi mua một quyển sách. Quyển sách đó đắt.' },
              { en: 'She is an honest person. (âm /ɒ/, chữ h câm)', vi: 'Cô ấy là người trung thực.' },
              { en: 'He is a university student. (âm /juː/ nên dùng a)', vi: 'Anh ấy là sinh viên đại học.' },
              { en: 'Books are expensive. (nói chung — không mạo từ)', vi: 'Sách thì đắt.' },
            ],
            mistake: {
              wrong: 'I am student. / I go to the school every day.',
              right: 'I am a student. / I go to school every day.',
              why:
                'Tiếng Việt không có mạo từ nên người Việt hoặc bỏ hẳn, hoặc thêm "the" tràn lan. '
                + '"go to school" (đi học) khác "go to the school" (đến toà nhà trường học đó).',
            },
          },
        ],
        practice: [
          'Lấy một đoạn bạn đã viết, khoanh mọi danh từ, tự hỏi từng cái: cái này người đọc đã biết chưa? Chưa → a/an. Rồi → the.',
          'Học thuộc 4 cụm không mạo từ: go to school, go to work, at home, by bus.',
        ],
      },
      {
        id: 'b4',
        n: 9,
        title: 'Sở hữu: my / mine và dấu ’s',
        goal: 'Diễn đạt quyền sở hữu không lẫn giữa tính từ và đại từ sở hữu.',
        blocks: [
          {
            formula: "N của người: người + 's + vật  (Lan's book)",
            explain:
              'Tính từ sở hữu (my, your, his, her, our, their) LUÔN đứng trước danh từ. Đại từ sở hữu '
              + '(mine, yours, his, hers, ours, theirs) đứng một mình, thay cho cả cụm.',
            examples: [
              { en: 'This is my book. → This book is mine.', vi: 'Đây là sách của tôi.' },
              { en: "Lan's brother is a doctor.", vi: 'Anh trai của Lan là bác sĩ.' },
              { en: 'The students’ classroom is upstairs. (số nhiều → dấu nháy sau s)', vi: 'Lớp của các sinh viên ở tầng trên.' },
            ],
            mistake: {
              wrong: 'This is mine book. / The book of Lan.',
              right: "This is my book. / Lan's book.",
              why:
                'Người Việt dịch thẳng "sách của Lan" thành "book of Lan". Với NGƯỜI, tiếng Anh dùng ’s. '
                + '"of" để dành cho vật: the roof of the house.',
            },
          },
        ],
        practice: [
          'Viết 6 câu về đồ vật của các thành viên trong gia đình, dùng cả ’s và tính từ sở hữu.',
          'Đổi mỗi câu sang dạng dùng đại từ sở hữu: "This is my phone." → "This phone is mine."',
        ],
      },
      {
        id: 'b5',
        n: 10,
        title: 'There is / There are — nói về sự tồn tại',
        goal: 'Miêu tả được một căn phòng, một nơi chốn — nền của Speaking Part 2 và Task 1.',
        blocks: [
          {
            formula: 'There is + N số ít/không đếm được · There are + N số nhiều',
            explain:
              'Cấu trúc dùng để nói "có cái gì đó ở đâu đó". Động từ chia theo danh từ ĐỨNG NGAY SAU nó, '
              + 'không phải theo cả danh sách.',
            examples: [
              { en: 'There is a desk in my room.', vi: 'Có một cái bàn trong phòng tôi.' },
              { en: 'There are two windows and a door.', vi: 'Có hai cửa sổ và một cái cửa.' },
              { en: 'There is a lot of noise at night.', vi: 'Có nhiều tiếng ồn vào ban đêm.' },
            ],
            mistake: {
              wrong: 'In my room have a desk. / My room has two windows and there are a door.',
              right: 'There is a desk in my room. / There is a door.',
              why:
                'Người Việt dịch thẳng "trong phòng tôi CÓ" thành "in my room have" — sai vì câu không có '
                + 'chủ ngữ. Và động từ phải chia theo danh từ liền sau: "a door" là số ít → there IS.',
            },
          },
        ],
        practice: [
          'Viết 8 câu miêu tả phòng của bạn, dùng cả there is và there are, kèm giới từ (on, in, next to, between).',
          'Nói to trong 1 phút: miêu tả căn phòng bạn đang ngồi, không nhìn giấy.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 3: HIỆN TẠI ═════════════════ */
  {
    id: 'present',
    title: 'Thì hiện tại — thì dùng nhiều nhất khi nói',
    subtitle: 'Bài 11–15 · Hiện tại đơn, tiếp diễn, hoàn thành',
    icon: '⏱️',
    lessons: [
      {
        id: 'p1',
        n: 11,
        title: 'Hiện tại đơn — và chữ "s" ai cũng quên',
        goal: 'Kể được thói quen hằng ngày mà không sót -s ở ngôi thứ ba.',
        blocks: [
          {
            formula: 'I/You/We/They + V · He/She/It + V-s',
            explain:
              'Dùng cho thói quen, sự thật hiển nhiên, lịch trình cố định. Điểm chết duy nhất: ngôi thứ ba '
              + 'số ít phải thêm -s. Đây là lỗi bị trừ điểm Grammar nhiều nhất ở band 4–5.',
            examples: [
              { en: 'I get up at six.', vi: 'Tôi dậy lúc sáu giờ.' },
              { en: 'She gets up at six.', vi: 'Cô ấy dậy lúc sáu giờ.' },
              { en: 'My brother watches TV every evening. (watch → watches)', vi: 'Em trai tôi xem tivi mỗi tối.' },
              { en: 'The train leaves at eight. (lịch trình cố định)', vi: 'Tàu khởi hành lúc tám giờ.' },
            ],
            mistake: {
              wrong: 'He go to school every day.',
              right: 'He goes to school every day.',
              why:
                'Tiếng Việt không chia động từ theo chủ ngữ nên người Việt quên -s một cách hệ thống. '
                + 'Mẹo soát bài: đọc lại, gặp he/she/it thì DỪNG, kiểm động từ ngay sau.',
            },
          },
          {
            formula: 'Phủ định: do/does + not + V · Hỏi: Do/Does + S + V?',
            explain: 'Khi đã có does thì động từ chính TRỞ VỀ nguyên thể — chữ s chuyển sang does rồi.',
            examples: [
              { en: 'She does not like coffee.', vi: 'Cô ấy không thích cà phê.' },
              { en: 'Does he live here?', vi: 'Anh ấy sống ở đây phải không?' },
            ],
            mistake: {
              wrong: 'She does not likes coffee. / Does he lives here?',
              right: 'She does not like coffee. / Does he live here?',
              why: 'Chỉ được thêm -s MỘT lần. Đã có "does" thì động từ chính để nguyên.',
            },
          },
        ],
        practice: [
          'Viết 10 câu về thói quen của một người thân (dùng he/she) — bắt buộc chia đúng -s cả 10 câu.',
          'Đổi 5 câu sang phủ định, 5 câu sang câu hỏi, kiểm xem có sót "s" ở động từ chính không.',
        ],
      },
      {
        id: 'p2',
        n: 12,
        title: 'Trạng từ tần suất — always, usually, never đặt ở đâu',
        goal: 'Đặt trạng từ đúng vị trí, không bị lủng củng như dịch từ tiếng Việt.',
        blocks: [
          {
            formula: 'S + [trạng từ] + V thường  ·  S + to be + [trạng từ]',
            explain:
              'Trạng từ tần suất đứng TRƯỚC động từ thường nhưng SAU động từ to be. Đây là quy tắc nhỏ mà '
              + 'sai thì câu nghe rất "Tây học tiếng Việt".',
            examples: [
              { en: 'I always get up early.', vi: 'Tôi luôn dậy sớm.' },
              { en: 'She is always late. (sau to be)', vi: 'Cô ấy luôn đi muộn.' },
              { en: 'We rarely eat out.', vi: 'Chúng tôi hiếm khi ăn ngoài.' },
              { en: 'I go swimming twice a week. (cụm tần suất → cuối câu)', vi: 'Tôi đi bơi hai lần mỗi tuần.' },
            ],
            mistake: {
              wrong: 'I get up always early. / Always I am late.',
              right: 'I always get up early. / I am always late.',
              why: 'Trạng từ một từ (always, often…) không đứng đầu câu và không đứng sau động từ thường.',
            },
          },
        ],
        practice: [
          'Viết 6 câu dùng 6 trạng từ khác nhau: always, usually, often, sometimes, rarely, never.',
          'Trong đó phải có 2 câu dùng to be để luyện vị trí ngược lại.',
        ],
      },
      {
        id: 'p3',
        n: 13,
        title: 'Hiện tại tiếp diễn — đang xảy ra lúc này',
        goal: 'Phân biệt được khi nào dùng hiện tại đơn, khi nào dùng tiếp diễn.',
        blocks: [
          {
            formula: 'S + am/is/are + V-ing',
            explain:
              'Dùng cho việc ĐANG diễn ra ngay lúc nói, hoặc giai đoạn tạm thời quanh thời điểm này. '
              + 'So với hiện tại đơn: đơn = thói quen lâu dài, tiếp diễn = tạm thời.',
            examples: [
              { en: 'I am studying English now.', vi: 'Tôi đang học tiếng Anh bây giờ.' },
              { en: 'She is living in Hanoi this year. (tạm thời)', vi: 'Năm nay cô ấy đang sống ở Hà Nội.' },
              { en: 'I study English every day. (thói quen)', vi: 'Tôi học tiếng Anh mỗi ngày.' },
            ],
            mistake: {
              wrong: 'I am liking this song. / I am knowing the answer.',
              right: 'I like this song. / I know the answer.',
              why:
                'Động từ chỉ trạng thái (like, know, want, need, understand, believe, love) KHÔNG dùng ở '
                + 'tiếp diễn. Nhớ nhóm 7 từ này là tránh được lỗi.',
            },
          },
        ],
        practice: [
          'Viết 5 câu về việc đang xảy ra quanh bạn lúc này, 5 câu về thói quen — đọc lại và giải thích vì sao chọn thì đó.',
          'Học thuộc nhóm động từ trạng thái không chia tiếp diễn.',
        ],
      },
      {
        id: 'p4',
        n: 14,
        title: 'Hiện tại hoàn thành — have / has + V3',
        goal: 'Dùng đúng thì cho việc đã xảy ra nhưng còn liên quan tới hiện tại.',
        blocks: [
          {
            formula: 'S + have/has + V3 (quá khứ phân từ)',
            explain:
              'Dùng khi: (1) việc đã xảy ra nhưng KHÔNG nói rõ lúc nào, (2) việc bắt đầu trong quá khứ và '
              + 'còn kéo dài tới nay, (3) trải nghiệm trong đời. Dấu hiệu: already, yet, ever, never, since, for.',
            examples: [
              { en: 'I have finished my homework.', vi: 'Tôi đã làm xong bài tập.' },
              { en: 'She has lived here for five years.', vi: 'Cô ấy đã sống ở đây được năm năm.' },
              { en: 'Have you ever been to Da Lat?', vi: 'Bạn từng đến Đà Lạt chưa?' },
            ],
            mistake: {
              wrong: 'I have finished my homework yesterday.',
              right: 'I finished my homework yesterday.',
              why:
                'Có mốc thời gian quá khứ RÕ RÀNG (yesterday, last week, in 2020) thì bắt buộc dùng quá khứ '
                + 'đơn, không dùng hiện tại hoàn thành.',
            },
          },
          {
            formula: 'since + mốc thời gian · for + khoảng thời gian',
            explain: 'since 2020, since Monday (điểm bắt đầu) — for five years, for two hours (độ dài).',
            examples: [
              { en: 'I have studied English since 2019.', vi: 'Tôi học tiếng Anh từ năm 2019.' },
              { en: 'I have studied English for six years.', vi: 'Tôi học tiếng Anh được sáu năm.' },
            ],
          },
        ],
        practice: [
          'Viết 5 câu dùng since và 5 câu dùng for, về việc học, nơi ở, công việc.',
          'Viết 3 câu trải nghiệm với "have never" và 3 câu hỏi với "Have you ever…?"',
        ],
      },
      {
        id: 'p5',
        n: 15,
        title: 'Ba thì hiện tại đứng cạnh nhau — chọn thì nào?',
        goal: 'Nhìn câu tiếng Việt là chọn được đúng thì trong ba thì đã học.',
        blocks: [
          {
            explain:
              'Bài này không dạy thì mới mà dạy cách CHỌN. Hỏi ba câu theo thứ tự: (1) Việc này có mốc thời '
              + 'gian quá khứ rõ ràng không? → quá khứ đơn. (2) Đang xảy ra ngay lúc nói? → tiếp diễn. '
              + '(3) Thói quen, sự thật? → hiện tại đơn. (4) Xong rồi nhưng còn liên quan tới nay? → hoàn thành.',
            examples: [
              { en: 'I work at a bank. (nghề nghiệp — thói quen)', vi: 'Tôi làm ở ngân hàng.' },
              { en: 'I am working on a project this month. (tạm thời)', vi: 'Tháng này tôi đang làm một dự án.' },
              { en: 'I have worked here for two years. (từ quá khứ tới nay)', vi: 'Tôi làm ở đây được hai năm.' },
            ],
            mistake: {
              wrong: 'Dùng hiện tại tiếp diễn cho mọi thứ vì "nghe cho sang".',
              right: 'Thói quen thì dùng hiện tại đơn — đó mới là câu đúng.',
              why:
                'Giám khảo chấm ĐỘ CHÍNH XÁC, không chấm độ phức tạp. Ở chặng này, dùng đúng hiện tại đơn '
                + 'ăn điểm hơn dùng sai thì khó.',
            },
          },
        ],
        practice: [
          'Tự dịch 10 câu tiếng Việt sang tiếng Anh, ghi rõ bên cạnh vì sao chọn thì đó.',
          'Viết một đoạn 80 từ về công việc/việc học của bạn, dùng đủ cả ba thì hiện tại.',
        ],
      },
    ],
  },

  /* ═════════════════ CHỦ ĐIỂM 4: QUÁ KHỨ ═════════════════ */
  {
    id: 'past',
    title: 'Thì quá khứ — kể lại chuyện đã qua',
    subtitle: 'Bài 16–20 · Quá khứ đơn, tiếp diễn, động từ bất quy tắc',
    icon: '📜',
    lessons: [
      {
        id: 'q1',
        n: 16,
        title: 'Quá khứ đơn — động từ có quy tắc',
        goal: 'Kể lại được một ngày đã qua bằng động từ thêm -ed đúng cách.',
        blocks: [
          {
            formula: 'S + V-ed (mọi ngôi đều như nhau)',
            explain:
              'Tin tốt: quá khứ đơn KHÔNG chia theo ngôi — I worked, she worked, they worked đều giống nhau. '
              + 'Quy tắc thêm -ed: thường + ed; tận cùng e thì + d; phụ âm + y thì đổi y → ied (study → studied).',
            examples: [
              { en: 'I worked at a shop last summer.', vi: 'Hè năm ngoái tôi làm ở một cửa hàng.' },
              { en: 'She studied medicine for six years.', vi: 'Cô ấy học y sáu năm.' },
              { en: 'We stopped at a small café. (gấp đôi phụ âm)', vi: 'Chúng tôi dừng ở một quán nhỏ.' },
            ],
            mistake: {
              wrong: 'Yesterday I go to school and meet my friend.',
              right: 'Yesterday I went to school and met my friend.',
              why:
                'Người Việt hay chia đúng động từ đầu rồi quên các động từ sau trong cùng câu. Soát bài: '
                + 'gặp mốc quá khứ thì kiểm TẤT CẢ động từ trong câu, không chỉ động từ đầu.',
            },
          },
          {
            formula: 'Phủ định: did not + V nguyên thể · Hỏi: Did + S + V?',
            explain: 'Có "did" rồi thì động từ chính về nguyên thể — giống quy tắc của does ở hiện tại.',
            examples: [
              { en: 'I did not go out last night.', vi: 'Tối qua tôi không đi đâu.' },
              { en: 'Did you finish the report?', vi: 'Bạn làm xong báo cáo chưa?' },
            ],
            mistake: {
              wrong: 'I did not went out. / Did you finished it?',
              right: 'I did not go out. / Did you finish it?',
              why: 'Dấu hiệu quá khứ đã nằm ở "did", không lặp lại ở động từ chính.',
            },
          },
        ],
        practice: [
          'Viết 10 câu về ngày hôm qua của bạn, dùng động từ có quy tắc, chú ý cách thêm -ed.',
          'Đọc to cả 10 câu, bật rõ âm cuối /t/ /d/ /ɪd/ — nối lại bài 1.',
        ],
      },
      {
        id: 'q2',
        n: 17,
        title: '40 động từ bất quy tắc phải thuộc',
        goal: 'Nhớ dạng quá khứ của các động từ dùng nhiều nhất, không phải tra lại.',
        blocks: [
          {
            explain:
              'Không có mẹo — nhóm này phải thuộc lòng. Nhưng đừng học hết 200 từ trong bảng: 40 động từ '
              + 'dưới đây chiếm phần lớn số lần xuất hiện trong bài nói và bài viết thật.',
            examples: [
              { en: 'be → was/were · have → had · do → did · go → went', vi: 'nhóm hay dùng nhất' },
              { en: 'say → said · get → got · make → made · know → knew', vi: 'nhóm 2' },
              { en: 'take → took · see → saw · come → came · think → thought', vi: 'nhóm 3' },
              { en: 'give → gave · find → found · tell → told · become → became', vi: 'nhóm 4' },
              { en: 'leave → left · feel → felt · put → put · bring → brought', vi: 'nhóm 5' },
              { en: 'begin → began · keep → kept · write → wrote · read → read /red/', vi: 'nhóm 6 — read viết y nguyên nhưng đọc khác' },
              { en: 'buy → bought · run → ran · eat → ate · drink → drank', vi: 'nhóm 7' },
              { en: 'speak → spoke · meet → met · pay → paid · sit → sat', vi: 'nhóm 8' },
              { en: 'stand → stood · lose → lost · win → won · teach → taught', vi: 'nhóm 9' },
              { en: 'send → sent · build → built · spend → spent · understand → understood', vi: 'nhóm 10' },
            ],
            mistake: {
              wrong: 'I buyed a new phone. / She teached us English.',
              right: 'I bought a new phone. / She taught us English.',
              why: 'Thêm -ed vào động từ bất quy tắc là lỗi thấy ngay ở band thấp. 40 từ này phải thuộc như bảng cửu chương.',
            },
          },
        ],
        practice: [
          'Chia 40 từ thành 10 nhóm 4 từ, mỗi ngày học 1 nhóm, ngày hôm sau ôn lại nhóm cũ trước khi học nhóm mới.',
          'Kiểm tra ngược: cho dạng quá khứ, tự bật ra nguyên thể. Đúng 36/40 mới coi là thuộc.',
        ],
      },
      {
        id: 'q3',
        n: 18,
        title: 'was / were — quá khứ của to be',
        goal: 'Miêu tả được trạng thái, cảm xúc trong quá khứ.',
        blocks: [
          {
            formula: 'I/He/She/It + was · You/We/They + were',
            explain:
              'Đây là chỗ duy nhất trong quá khứ đơn còn chia theo ngôi. Rất hay dùng khi kể chuyện: tả '
              + 'thời tiết, cảm xúc, tình trạng.',
            examples: [
              { en: 'I was very tired after the trip.', vi: 'Tôi rất mệt sau chuyến đi.' },
              { en: 'The weather was hot and humid.', vi: 'Thời tiết nóng và ẩm.' },
              { en: 'We were at home all day.', vi: 'Cả ngày chúng tôi ở nhà.' },
              { en: 'There were many people at the festival.', vi: 'Có nhiều người ở lễ hội.' },
            ],
            mistake: {
              wrong: 'They was very happy. / I were tired.',
              right: 'They were very happy. / I was tired.',
              why: 'Nhớ đơn giản: chỉ you/we/they dùng "were", còn lại dùng "was".',
            },
          },
        ],
        practice: [
          'Viết 8 câu tả một kỷ niệm: bạn ở đâu, thời tiết ra sao, cảm xúc thế nào, có ai ở đó.',
          'Dùng thêm "There was / There were" ít nhất 2 lần.',
        ],
      },
      {
        id: 'q4',
        n: 19,
        title: 'Quá khứ tiếp diễn — hai việc cùng lúc',
        goal: 'Kể chuyện có lớp lang: việc đang diễn ra thì việc khác chen vào.',
        blocks: [
          {
            formula: 'S + was/were + V-ing · … when + quá khứ đơn',
            explain:
              'Quá khứ tiếp diễn tả bối cảnh đang diễn ra; quá khứ đơn tả việc CHEN VÀO cắt ngang. Đây là '
              + 'cấu trúc làm câu chuyện của bạn nghe tự nhiên thay vì liệt kê khô khan.',
            examples: [
              { en: 'I was cooking when the phone rang.', vi: 'Tôi đang nấu ăn thì điện thoại reo.' },
              { en: 'While we were waiting, it started to rain.', vi: 'Trong lúc chúng tôi đang chờ thì trời mưa.' },
              { en: 'They were studying at eight last night.', vi: 'Tám giờ tối qua họ đang học.' },
            ],
            mistake: {
              wrong: 'I cooked when the phone rang. (mất nghĩa "đang")',
              right: 'I was cooking when the phone rang.',
              why:
                'Dùng hai quá khứ đơn thì thành hai việc nối tiếp (nấu xong rồi điện thoại reo). Muốn diễn '
                + 'đạt "đang… thì…" phải có tiếp diễn.',
            },
          },
        ],
        practice: [
          'Viết 5 câu theo mẫu "I was …-ing when …". Mỗi câu một tình huống khác nhau.',
          'Kể lại bằng lời một sự việc bất ngờ từng xảy ra với bạn, dùng ít nhất 3 lần cấu trúc này.',
        ],
      },
      {
        id: 'q5',
        n: 20,
        title: 'Kể một câu chuyện hoàn chỉnh',
        goal: 'Ghép mọi thứ đã học ở chủ điểm 4 thành một đoạn kể 100 từ mạch lạc.',
        blocks: [
          {
            explain:
              'Một câu chuyện kể tốt ở chặng này chỉ cần bốn phần: bối cảnh (was/were + quá khứ tiếp diễn) '
              + '→ diễn biến (quá khứ đơn) → cao trào (từ nối then, suddenly) → cảm nghĩ (was/were + tính từ). '
              + 'Đây chính là khung của Speaking Part 2 sau này.',
            examples: [
              {
                en: 'Last summer I visited my grandparents. The weather was very hot. One afternoon I was reading in the garden when my grandfather called me. He wanted to show me his old photos. We looked at them for two hours. I felt very close to him that day.',
                vi: 'Hè năm ngoái tôi về thăm ông bà. Thời tiết rất nóng. Một buổi chiều tôi đang đọc sách ngoài vườn thì ông gọi. Ông muốn cho tôi xem những bức ảnh cũ. Chúng tôi xem suốt hai tiếng. Hôm đó tôi thấy rất gần gũi với ông.',
              },
            ],
            mistake: {
              wrong: 'Kể toàn câu ngắn cùng cấu trúc: "I went. I saw. I ate. I came home."',
              right: 'Xen câu dài có "when", "while", và thêm câu cảm nghĩ ở cuối.',
              why:
                'Bài kể toàn câu đơn giống nhau bị trừ điểm ở tiêu chí đa dạng ngữ pháp — ngay cả khi không '
                + 'sai câu nào.',
            },
          },
        ],
        practice: [
          'Viết một đoạn 100 từ kể một kỷ niệm, đủ 4 phần: bối cảnh, diễn biến, cao trào, cảm nghĩ.',
          'Đọc to đoạn đó, bấm giờ. Mục tiêu: nói liền 1 phút không dừng quá 3 lần.',
          'Gạch chân mọi động từ, kiểm từng cái đã chia đúng quá khứ chưa.',
        ],
      },
    ],
  },
];
