/**
 * Bài học chặng 3 (5.5 → 6.5) — 20 bài, 4 chủ điểm.
 *
 * Lộ trình gọi đây là "chặng đông người mắc kẹt nhất", và nêu đúng nguyên
 * nhân: gần như luôn vì Writing — viết rất nhiều mà KHÔNG ai sửa, nên sai gì
 * thì lặp lại mãi.
 *
 * Vì vậy chủ điểm số 1 của chặng này KHÔNG phải ngữ pháp mới mà là **tự chấm
 * và tự sửa bài**. Đây là thứ duy nhất phá được vòng lặp "viết nhiều mà không
 * lên điểm". Ba chủ điểm còn lại phục vụ cùng mục tiêu: câu phức dùng đúng,
 * từ vựng đi đúng kết hợp, và tốc độ đọc/nghe đủ để không mất điểm vì hết giờ.
 */
import type { LessonUnit } from '../types';

export const UNITS3: LessonUnit[] = [
  /* ═══════════ CHỦ ĐIỂM 1: TỰ CHẤM & TỰ SỬA ═══════════ */
  {
    id: 's3-selfmark',
    title: 'Tự chấm & tự sửa bài — thứ phá vòng lặp',
    subtitle: 'Bài 1–5 · Vì sao viết 50 bài mà vẫn 5.5',
    icon: '🔍',
    lessons: [
      {
        id: 'm1',
        n: 1,
        title: 'Vì sao viết nhiều mà không lên điểm',
        goal: 'Hiểu đúng nguyên nhân kẹt ở 5.5–6.0, để không tốn thêm sáu tháng làm sai cách.',
        blocks: [
          {
            explain:
              'Viết một bài rồi không ai chỉ ra lỗi thì bài thứ hai lặp lại đúng lỗi đó. Sau năm mươi bài, '
              + 'bạn không có năm mươi lần tiến bộ — bạn có một lỗi được luyện thành phản xạ năm mươi lần.\n\n'
              + 'Đây là lý do người học chăm chỉ nhất đôi khi kẹt lâu nhất: họ viết nhiều nhất nên khắc sâu lỗi '
              + 'nhất. Cách thoát duy nhất là mỗi bài viết ra phải được SOI, và chỗ sai phải được VIẾT LẠI.',
            examples: [
              { en: 'Viết 1 bài + sửa kỹ + viết lại = tiến bộ thật', vi: 'vòng lặp đúng' },
              { en: 'Viết 5 bài, không sửa bài nào = 5 lần luyện lỗi cũ', vi: 'vòng lặp sai' },
            ],
            mistake: {
              wrong: 'Viết xong, đọc lướt một lượt thấy "cũng ổn", rồi viết bài mới.',
              right: 'Viết xong, soi theo bảng ở bài 2, VIẾT LẠI đoạn có lỗi, rồi mới sang bài mới.',
              why:
                'Viết lại quan trọng hơn viết mới. Bài 4 sẽ chỉ rõ vì sao: chỉ khi viết lại thì tay bạn mới '
                + 'thực hiện phiên bản đúng, còn đọc lời giải thích thì chỉ có mắt làm việc.',
            },
          },
        ],
        practice: [
          'Lấy 3 bài viết cũ của bạn. Đếm xem có bao nhiêu lỗi LẶP LẠI ở cả ba bài — đó là danh sách cần diệt.',
          'Nếu không tìm được lỗi nào, đó chính là vấn đề: bạn chưa nhìn ra lỗi của mình. Sang bài 2.',
        ],
      },
      {
        id: 'm2',
        n: 2,
        title: 'Bảng tự chấm theo 4 tiêu chí thật',
        goal: 'Tự cho bài mình một band ước lượng, dựa vào đúng tiêu chí giám khảo dùng.',
        blocks: [
          {
            explain:
              'Chấm bài mình bằng cảm giác thì luôn cao hơn thực tế. Dùng bảng dưới đây, trả lời TỪNG câu bằng '
              + 'có/không, rồi đếm.',
            examples: [
              { en: '① Task Response — Trả lời ĐỦ mọi vế của đề chưa? Có đủ số từ chưa? Mỗi ý có ví dụ cụ thể chưa?', vi: '' },
              { en: '② Coherence — Có chia đoạn không? Mỗi đoạn có câu chủ đề ở ĐẦU không? Từ nối có đúng chỗ không?', vi: '' },
              { en: '③ Lexical — Có từ nào lặp quá 3 lần không? Có từ nào dùng sai ngữ cảnh không?', vi: '' },
              { en: '④ Grammar — Có ít nhất 4 câu phức không? Trong đó có câu nào SAI không?', vi: '' },
              { en: 'Ước lượng: 12+ câu "có" ≈ 6.5 · 8–11 ≈ 6.0 · dưới 8 ≈ 5.5', vi: 'chỉ để tự đo, không phải điểm thật' },
            ],
            mistake: {
              wrong: 'Tự chấm theo cảm giác "bài này mình viết hay".',
              right: 'Trả lời từng câu hỏi trong bảng bằng có/không, rồi đếm.',
              why:
                'Cảm giác "viết hay" thường đến từ việc dùng từ khó, mà đó chỉ là một phần của MỘT tiêu chí '
                + 'trên bốn. Bảng buộc bạn nhìn cả bốn.',
            },
          },
        ],
        practice: [
          'Chấm 3 bài cũ bằng bảng này. Ghi lại tiêu chí nào bạn thường "không" nhiều nhất.',
          'Tiêu chí yếu nhất đó chính là thứ cần luyện trong tháng tới — không phải luyện đều cả bốn.',
        ],
      },
      {
        id: 'm3',
        n: 3,
        title: 'Sổ lỗi cá nhân',
        goal: 'Có một danh sách lỗi của RIÊNG bạn, thay vì học chung chung mọi lỗi có thể có.',
        blocks: [
          {
            explain:
              'Mỗi người chỉ lặp khoảng 8–12 lỗi. Tìm ra chúng rồi diệt từng cái nhanh hơn nhiều so với đọc '
              + 'sách ngữ pháp từ đầu tới cuối. Sổ lỗi có ba cột: câu sai của bạn — câu đúng — LOẠI lỗi.',
            examples: [
              { en: 'Cities has many problem. | Cities have many problems. | hợp chủ–vị + số nhiều', vi: '' },
              { en: 'I very like it. | I like it very much. | trật tự trạng từ', vi: '' },
              { en: 'Despite of the rain… | Despite the rain… | despite không có "of"', vi: '' },
              { en: 'It make me happy. | It makes me happy. | -s ngôi thứ ba', vi: '' },
            ],
            mistake: {
              wrong: 'Ghi lỗi rồi không bao giờ mở lại sổ.',
              right: 'Trước MỖI bài viết mới, đọc lại sổ lỗi 30 giây.',
              why:
                '30 giây đó là thứ biến sổ lỗi từ một danh sách chết thành công cụ thật. Đọc trước khi viết thì '
                + 'não đang ở trạng thái sắp dùng, nên nhớ được.',
            },
          },
        ],
        practice: [
          'Lập sổ lỗi ba cột từ 3 bài cũ. Mục tiêu: tìm được ít nhất 8 lỗi lặp.',
          'Đọc lại sổ 30 giây trước mỗi lần viết, trong 4 tuần liền.',
        ],
      },
      {
        id: 'm4',
        n: 4,
        title: 'Viết lại quan trọng hơn viết mới',
        goal: 'Biến mỗi bài đã sửa thành một lần tiến bộ thật, thay vì một lần đọc lời phê.',
        blocks: [
          {
            explain:
              'Đọc lời giải thích chỉ có MẮT làm việc. Viết lại thì TAY thực hiện phiên bản đúng, và đó mới là '
              + 'thứ tạo ra phản xạ. Quy trình ba bước cho mỗi bài:\n\n'
              + '① Viết bài · ② Soi bằng bảng bài 2, ghi lỗi vào sổ · ③ VIẾT LẠI riêng những đoạn có lỗi (không '
              + 'cần viết lại cả bài).\n\n'
              + 'Bước 3 là bước hầu hết mọi người bỏ qua, và cũng là bước duy nhất thật sự có tác dụng.',
            examples: [
              { en: 'Sai: Cities has many problem, so government should build more road.', vi: '' },
              { en: 'Viết lại: Cities face a number of problems, which is why governments should invest in road infrastructure.', vi: 'sửa lỗi VÀ nâng cấp cấu trúc luôn' },
            ],
            mistake: {
              wrong: 'Chỉ sửa đúng chữ bị sai: "has" → "have".',
              right: 'Viết lại CẢ CÂU, và nhân tiện nâng cấp cấu trúc.',
              why:
                'Sửa một chữ thì bạn không luyện được gì. Viết lại cả câu là một lần luyện thật, mà lại tốn '
                + 'thêm có mười giây.',
            },
          },
        ],
        practice: [
          'Lấy bài viết gần nhất, chọn 5 câu có lỗi, viết lại từng câu — mỗi câu vừa sửa lỗi vừa nâng cấp cấu trúc.',
          'So câu cũ và câu mới cạnh nhau. Đó là khoảng cách giữa band hiện tại và band bạn muốn.',
        ],
      },
      {
        id: 'm5',
        n: 5,
        title: 'Nhờ chấm thế nào cho hiệu quả',
        goal: 'Lấy được góp ý dùng được, kể cả khi không có gia sư.',
        blocks: [
          {
            explain:
              'Lộ trình ghi rất rõ: ở chặng này "BẮT BUỘC nhờ chấm — không chấm thì đừng viết thêm". Nhưng nhờ '
              + 'sai cách thì góp ý cũng vô dụng.\n\n'
              + 'Khi nhờ ai đó (gia sư, bạn giỏi hơn, hoặc công cụ), hãy hỏi CỤ THỂ thay vì "bài này mấy điểm":\n'
              + '• "Câu nào trong bài này sai ngữ pháp? Chỉ ra và giải thích vì sao."\n'
              + '• "Từ nào tôi dùng sai ngữ cảnh?"\n'
              + '• "Đoạn nào thiếu ví dụ cụ thể?"\n'
              + '• "Tôi có trả lời hết mọi vế của đề không?"\n\n'
              + 'Bốn câu hỏi này ứng đúng bốn tiêu chí chấm, nên góp ý nhận về sẽ dùng được ngay.',
            examples: [
              { en: 'Hỏi kém: "Bài này được mấy chấm?"', vi: 'nhận về một con số, không sửa được gì' },
              { en: 'Hỏi tốt: "Chỉ ra mọi câu sai ngữ pháp và giải thích vì sao sai."', vi: 'nhận về danh sách dùng được' },
            ],
            mistake: {
              wrong: 'Nhận điểm rồi cất bài đi.',
              right: 'Nhận danh sách lỗi → ghi vào sổ → viết lại các câu đó.',
              why: 'Con số điểm không dạy bạn gì cả. Danh sách lỗi cụ thể mới dạy.',
            },
          },
        ],
        practice: [
          'Viết 1 bài Task 2, rồi nhờ chấm bằng ĐÚNG bốn câu hỏi ở trên.',
          'Đưa mọi lỗi nhận được vào sổ, viết lại các câu sai. Lặp 10 lần trong chặng này — đó là mốc của lộ trình.',
        ],
      },
    ],
  },

  /* ═══════════ CHỦ ĐIỂM 2: CÂU PHỨC DÙNG ĐÚNG ═══════════ */
  {
    id: 's3-complex',
    title: 'Câu phức dùng đúng, không gượng',
    subtitle: 'Bài 6–10 · Đa dạng ngữ pháp là tiêu chí, nhưng SAI thì trừ nặng hơn',
    icon: '🧩',
    lessons: [
      {
        id: 'c3-1',
        n: 6,
        title: 'Mệnh đề quan hệ không xác định',
        goal: 'Thêm thông tin phụ vào câu mà không phá cấu trúc — cách nâng câu rẻ nhất.',
        blocks: [
          {
            formula: 'Danh từ + , which/who + mệnh đề + , + phần còn lại',
            explain:
              'Loại có dấu phẩy thêm thông tin PHỤ, bỏ đi câu vẫn đủ nghĩa. Loại không phẩy (đã học ở chặng 1) '
              + 'thì xác định danh từ, bỏ đi là mất nghĩa. Loại có phẩy hay dùng trong văn học thuật vì nó cho '
              + 'phép nhét thêm dữ kiện mà không cần câu mới.',
            examples: [
              { en: 'The report, which was published in 2020, found a clear link.', vi: 'Báo cáo, được công bố năm 2020, tìm ra mối liên hệ rõ ràng.' },
              { en: 'Renewable energy, which now supplies a third of the grid, was once dismissed as impractical.', vi: 'Năng lượng tái tạo, nay cung cấp một phần ba lưới điện, từng bị cho là bất khả thi.' },
              { en: 'Many students work part-time, which reduces the time available for study.', vi: '"which" ở đây thay cho CẢ MỆNH ĐỀ trước đó.' },
            ],
            mistake: {
              wrong: 'The report that was published in 2020, found a clear link.',
              right: 'The report, which was published in 2020, found a clear link.',
              why:
                'Loại có phẩy dùng "which"/"who", KHÔNG dùng "that". Và phải có phẩy ở CẢ HAI đầu — thiếu một '
                + 'bên là lỗi dấu câu bị đếm.',
            },
          },
        ],
        practice: [
          'Lấy 8 câu đơn trong bài cũ, thêm vào mỗi câu một mệnh đề quan hệ có phẩy.',
          'Viết 3 câu dùng "which" thay cho cả mệnh đề trước đó (kiểu ví dụ cuối).',
        ],
      },
      {
        id: 'c3-2',
        n: 7,
        title: 'Đảo ngữ và câu nhấn mạnh',
        goal: 'Có vài cấu trúc nâng cao dùng ĐÚNG một hai lần mỗi bài, không rải khắp nơi.',
        blocks: [
          {
            explain:
              'Ba cấu trúc đáng học ở chặng này. Dùng MỘT HOẶC HAI lần mỗi bài là đủ để giám khảo thấy bạn có '
              + 'khả năng; dùng nhiều hơn thì bài đọc gượng và dễ sai.',
            examples: [
              { en: 'Not only does it save money, but it also reduces waste.', vi: 'Không những tiết kiệm tiền mà còn giảm rác thải.' },
              { en: 'It is the lack of funding, rather than the lack of ideas, that holds these projects back.', vi: 'Chính việc thiếu vốn, chứ không phải thiếu ý tưởng, mới kìm các dự án này.' },
              { en: 'What matters most is not the number of hours but how they are used.', vi: 'Điều quan trọng nhất không phải số giờ mà là cách dùng chúng.' },
            ],
            mistake: {
              wrong: 'Not only it saves money, but also it reduces waste.',
              right: 'Not only does it save money, but it also reduces waste.',
              why:
                'Sau "Not only" đầu câu phải ĐẢO trợ động từ lên trước chủ ngữ. Đây là lỗi khiến nhiều người '
                + 'dùng cấu trúc này bị trừ điểm thay vì được cộng.',
            },
          },
        ],
        practice: [
          'Viết 6 câu, mỗi cấu trúc 2 câu. Đọc to xem có tự nhiên không.',
          'Trong bài viết tới, dùng ĐÚNG hai câu loại này. Đếm để không dùng quá.',
        ],
      },
      {
        id: 'c3-3',
        n: 8,
        title: 'Câu điều kiện loại 3 và hỗn hợp',
        goal: 'Nói về điều đã không xảy ra — cần cho Speaking Part 3 và Task 2 dạng phản biện.',
        blocks: [
          {
            formula: 'Loại 3: If + had + V3, … would have + V3 · Hỗn hợp: If + had + V3, … would + V',
            explain:
              '**Loại 3** cho giả định trái với QUÁ KHỨ. **Hỗn hợp** khi nguyên nhân ở quá khứ nhưng kết quả ở '
              + 'hiện tại — dạng này ít người dùng đúng nên dùng được là ăn điểm rõ.',
            examples: [
              { en: 'If the scheme had been introduced earlier, the city would have avoided years of congestion.', vi: 'loại 3 — cả hai vế ở quá khứ' },
              { en: 'If governments had invested in rail decades ago, we would not be so dependent on cars today.', vi: 'hỗn hợp — nguyên nhân quá khứ, kết quả hiện tại' },
            ],
            mistake: {
              wrong: 'If the scheme was introduced earlier, the city would avoid congestion.',
              right: 'If the scheme had been introduced earlier, the city would have avoided congestion.',
              why:
                'Nói về việc ĐÃ KHÔNG xảy ra trong quá khứ thì phải dùng loại 3. Dùng loại 2 làm câu mang nghĩa '
                + 'giả định hiện tại, sai thời điểm.',
            },
          },
        ],
        practice: [
          'Viết 4 câu loại 3 về những quyết định trong quá khứ (của bạn hoặc của xã hội).',
          'Viết 2 câu hỗn hợp. Đọc lại kiểm: vế "if" ở quá khứ, vế sau ở hiện tại.',
        ],
      },
      {
        id: 'c3-4',
        n: 9,
        title: 'Dấu câu: chấm phẩy, hai chấm, dấu phẩy nối câu',
        goal: 'Hết lỗi câu chạy (run-on) — lỗi âm thầm kéo điểm mạch lạc.',
        blocks: [
          {
            explain:
              'Người Việt hay nối hai mệnh đề độc lập bằng DẤU PHẨY. Trong tiếng Anh đó là lỗi "comma splice", '
              + 'và nó bị đếm là lỗi ngữ pháp mỗi lần xuất hiện. Bốn cách sửa:',
            examples: [
              { en: '① Dấu chấm: Costs rose. Demand fell.', vi: 'đơn giản nhất, luôn đúng' },
              { en: '② Chấm phẩy: Costs rose; demand fell.', vi: 'hai ý gắn chặt với nhau' },
              { en: '③ Liên từ: Costs rose, so demand fell.', vi: 'thêm and/but/so/because' },
              { en: '④ Trạng từ nối + chấm phẩy: Costs rose; however, demand fell.', vi: 'chú ý DẤU CHẤM PHẨY trước "however"' },
            ],
            mistake: {
              wrong: 'Costs rose, demand fell. / Costs rose, however demand fell.',
              right: 'Costs rose, so demand fell. / Costs rose; however, demand fell.',
              why:
                '"however" KHÔNG phải liên từ nên không nối được hai mệnh đề bằng dấu phẩy. Phải có dấu chấm '
                + 'hoặc chấm phẩy trước nó.',
            },
          },
        ],
        practice: [
          'Soi 2 bài viết cũ, tìm mọi chỗ nối hai mệnh đề bằng dấu phẩy. Sửa bằng cả bốn cách.',
          'Viết 4 câu dùng chấm phẩy đúng cách.',
        ],
      },
      {
        id: 'c3-5',
        n: 10,
        title: 'Câu dài mà vẫn rõ',
        goal: 'Viết câu 25–35 từ không bị rối — dấu hiệu của band 6.5 trở lên.',
        blocks: [
          {
            explain:
              'Câu dài ăn điểm chỉ khi người đọc theo được. Ba quy tắc giữ câu dài mà vẫn rõ:\n\n'
              + '① Chủ ngữ và động từ chính đặt GẦN nhau, đừng nhét mệnh đề dài vào giữa.\n'
              + '② Mỗi câu chỉ một ý chính; phần phụ phải rõ ràng là phụ.\n'
              + '③ Quá 35 từ thì tách. Không có giải thưởng cho câu dài nhất.',
            examples: [
              {
                en: 'Rối: The report which was published in 2020 by a team of researchers who had spent three years studying the issue found that…',
                vi: 'chủ ngữ "The report" cách động từ "found" tới 20 từ',
              },
              {
                en: 'Rõ: A 2020 report, based on three years of research, found that…',
                vi: 'chủ ngữ và động từ sát nhau, phần phụ gọn trong hai dấu phẩy',
              },
            ],
            mistake: {
              wrong: 'Cố viết câu thật dài để "cho có ngữ pháp phức tạp".',
              right: 'Viết câu vừa đủ dài để chứa hết ý, rồi dừng.',
              why:
                'Tiêu chí là "range AND accuracy". Câu dài mà rối làm hỏng cả hai: người đọc không theo được, '
                + 'mà xác suất sai cũng tăng theo độ dài.',
            },
          },
        ],
        practice: [
          'Lấy 5 câu dài trong bài cũ, đếm số từ giữa chủ ngữ và động từ chính. Quá 8 từ thì viết lại.',
          'Viết 5 câu 25–35 từ, đọc to. Phải đọc một hơi mà không cần đọc lại.',
        ],
      },
    ],
  },

  /* ═══════════ CHỦ ĐIỂM 3: TỪ VỰNG ĐI ĐÚNG KẾT HỢP ═══════════ */
  {
    id: 's3-collocation',
    title: 'Kết hợp từ (collocation)',
    subtitle: 'Bài 11–15 · Từ đúng nhưng đi sai chỗ vẫn bị trừ',
    icon: '🔗',
    lessons: [
      {
        id: 'v3-1',
        n: 11,
        title: 'Collocation là gì và vì sao nó quyết định band 6.5',
        goal: 'Hiểu vì sao "make a research" sai dù cả hai từ đều đúng.',
        blocks: [
          {
            explain:
              'Collocation là những từ người bản xứ QUEN dùng cùng nhau. Không có quy tắc suy ra được — phải '
              + 'học theo cặp. Ở band 6.5, tiêu chí Lexical Resource không còn hỏi "bạn biết bao nhiêu từ" mà '
              + 'hỏi "bạn dùng từ có tự nhiên không".',
            examples: [
              { en: 'do research (KHÔNG phải make research)', vi: 'làm nghiên cứu' },
              { en: 'make a decision (KHÔNG phải do a decision)', vi: 'ra quyết định' },
              { en: 'take action / take measures', vi: 'hành động / áp dụng biện pháp' },
              { en: 'raise awareness (KHÔNG phải increase awareness — dùng được nhưng kém tự nhiên hơn)', vi: 'nâng cao nhận thức' },
              { en: 'meet a demand / meet a deadline / meet requirements', vi: 'đáp ứng nhu cầu / kịp hạn / đạt yêu cầu' },
              { en: 'play a role / play a part', vi: 'đóng vai trò' },
            ],
            mistake: {
              wrong: 'Scientists made a research about this problem.',
              right: 'Scientists carried out research into this problem.',
              why:
                'Ba lỗi kết hợp trong một câu: "made" → "carried out"/"did"; "research" không đếm được nên bỏ '
                + '"a"; "about" → "into" (research INTO something).',
            },
          },
        ],
        practice: [
          'Học 20 cặp collocation với make / do / take / have. Đây là bốn động từ gây lỗi nhiều nhất.',
          'Soi bài cũ, tìm mọi chỗ bạn ghép động từ với danh từ. Tra xem cặp đó có tự nhiên không.',
        ],
      },
      {
        id: 'v3-2',
        n: 12,
        title: 'Collocation cho Writing Task 1',
        goal: 'Mô tả số liệu bằng cụm tự nhiên thay vì ghép từ theo cảm tính.',
        blocks: [
          {
            explain:
              'Task 1 có bộ kết hợp gần như cố định. Thuộc chúng thì viết nhanh và không sai.',
            examples: [
              { en: 'a sharp / steady / gradual / slight increase', vi: 'mức tăng mạnh / đều / dần / nhẹ' },
              { en: 'rise steadily · fall sharply · fluctuate wildly · remain stable', vi: 'động từ + trạng từ đúng cặp' },
              { en: 'reach a peak of 40% · hit a low of 12%', vi: 'đạt đỉnh / chạm đáy' },
              { en: 'account for 30% of the total', vi: 'chiếm 30% tổng số' },
              { en: 'the figure for France · the proportion of students', vi: 'figure FOR, proportion OF' },
              { en: 'over the period · throughout the period · by the end of the period', vi: 'cụm chỉ giai đoạn' },
            ],
            mistake: {
              wrong: 'The figure of France increased strongly.',
              right: 'The figure for France increased sharply.',
              why:
                '"figure FOR" chứ không phải "of"; và "increase" đi với "sharply", không đi với "strongly". '
                + 'Hai lỗi kết hợp trong một câu ngắn.',
            },
          },
        ],
        practice: [
          'Viết lại một bài Task 1 cũ, thay mọi cụm mô tả bằng collocation ở trên.',
          'Học riêng 6 cặp động từ + trạng từ: rise steadily, fall sharply, increase gradually, decline slightly, fluctuate wildly, remain stable.',
        ],
      },
      {
        id: 'v3-3',
        n: 13,
        title: 'Collocation cho Writing Task 2',
        goal: 'Diễn đạt lập luận bằng cụm học thuật tự nhiên.',
        blocks: [
          {
            explain: 'Bộ kết hợp hay dùng nhất khi bàn vấn đề xã hội — thuộc là viết nhanh hơn hẳn.',
            examples: [
              { en: 'address a problem · tackle an issue · solve a crisis', vi: 'giải quyết vấn đề' },
              { en: 'pose a threat · cause damage · have an impact on', vi: 'gây ra mối đe doạ / thiệt hại / tác động' },
              { en: 'impose a ban · introduce a policy · enforce a law', vi: 'áp lệnh cấm / đưa ra chính sách / thực thi luật' },
              { en: 'bridge the gap · widen the gap', vi: 'thu hẹp / nới rộng khoảng cách' },
              { en: 'strike a balance between A and B', vi: 'tìm điểm cân bằng giữa A và B' },
              { en: 'place a burden on · put pressure on', vi: 'đặt gánh nặng lên / gây áp lực lên' },
            ],
            mistake: {
              wrong: 'The government should solve this problem by making a new law.',
              right: 'The government should address this problem by introducing new legislation.',
              why:
                '"solve a problem" đúng nhưng "address" tự nhiên hơn khi vấn đề chưa giải quyết dứt điểm được; '
                + 'và "make a law" nên là "introduce/pass a law".',
            },
          },
        ],
        practice: [
          'Viết 12 câu, mỗi câu dùng một cụm ở trên, về chủ đề môi trường hoặc giáo dục.',
          'Đọc lại bài Task 2 cũ, thay ít nhất 5 chỗ bằng collocation tự nhiên hơn.',
        ],
      },
      {
        id: 'v3-4',
        n: 14,
        title: 'Từ dễ dùng sai vì nghĩa gần',
        goal: 'Hết lỗi chọn nhầm từ trong nhóm gần nghĩa — lỗi rất hay gặp ở band 6.0.',
        blocks: [
          {
            explain:
              'Từ điển cho nghĩa giống nhau nhưng cách dùng khác hẳn. Nhóm dưới đây gây lỗi nhiều nhất.',
            examples: [
              { en: 'affect (động từ) vs effect (danh từ): Pollution affects health. / Pollution has an effect on health.', vi: '' },
              { en: 'economic (thuộc kinh tế) vs economical (tiết kiệm): economic growth / an economical car', vi: '' },
              { en: 'raise (nâng cái gì) vs rise (tự tăng): raise prices / prices rise', vi: 'raise cần tân ngữ, rise thì không' },
              { en: 'amount of (không đếm được) vs number of (đếm được)', vi: 'amount of water / number of cars' },
              { en: 'fewer (đếm được) vs less (không đếm được)', vi: 'fewer cars / less traffic' },
              { en: 'practice (danh từ) vs practise (động từ, Anh-Anh)', vi: '' },
            ],
            mistake: {
              wrong: 'The amount of students has risen and this effects the quality of teaching.',
              right: 'The number of students has risen and this affects the quality of teaching.',
              why:
                'students đếm được → "number of"; và ở đây cần ĐỘNG TỪ nên là "affects", không phải "effects".',
            },
          },
        ],
        practice: [
          'Viết 12 câu, mỗi cặp từ hai câu, để phân biệt rõ cách dùng.',
          'Thêm cả 6 cặp này vào sổ lỗi và kiểm chúng mỗi lần soát bài.',
        ],
      },
      {
        id: 'v3-5',
        n: 15,
        title: 'Bỏ từ rỗng, thay bằng từ mang thông tin',
        goal: 'Nâng điểm từ vựng mà không cần học thêm từ mới nào.',
        blocks: [
          {
            explain:
              'Cách nhanh nhất để bài viết lên một mức: xoá các từ không mang thông tin. Chúng chiếm chỗ, làm '
              + 'loãng ý, và bị đếm là vốn từ nghèo.',
            examples: [
              { en: 'very important → crucial / vital / essential', vi: '' },
              { en: 'very big problem → a major problem / a serious issue', vi: '' },
              { en: 'a lot of people → a significant proportion of the population', vi: '' },
              { en: 'good for the environment → environmentally beneficial', vi: '' },
              { en: 'Nowadays, … is very important in our modern society. → (xoá hẳn câu này)', vi: 'câu rỗng kinh điển' },
              { en: 'It is a fact that → (xoá, viết thẳng vào ý)', vi: '' },
            ],
            mistake: {
              wrong: 'Nowadays, education is very important in our modern society.',
              right: 'Access to education shapes almost every later outcome in a person life.',
              why:
                'Câu đầu 10 từ mà không nói gì. Câu sau cũng khoảng chừng ấy từ nhưng nêu một luận điểm cụ thể, '
                + 'ăn điểm ở cả Task Response lẫn Lexical Resource.',
            },
          },
        ],
        practice: [
          'Lấy một bài cũ, đếm số lần dùng "very", "a lot of", "good", "bad", "important". Thay hết.',
          'Xoá mọi câu mở bài kiểu "Nowadays… in our modern society". Viết lại bằng câu paraphrase đề.',
        ],
      },
    ],
  },

  /* ═══════════ CHỦ ĐIỂM 4: TỐC ĐỘ ĐỌC & NGHE ═══════════ */
  {
    id: 's3-speed',
    title: 'Tốc độ Đọc & Nghe',
    subtitle: 'Bài 16–20 · Mục tiêu chặng này: 30/40 ổn định',
    icon: '⚡',
    lessons: [
      {
        id: 'sp3-1',
        n: 16,
        title: 'Đọc 900 từ trong 20 phút',
        goal: 'Làm xong một passage đúng giờ mà vẫn đúng 9–10 câu.',
        blocks: [
          {
            explain:
              'Mốc chặng 3 là 30/40 trong đúng 60 phút. Muốn vậy mỗi passage phải xong trong 17–23 phút. Quy '
              + 'trình đã chốt:\n\n'
              + '① Lướt 2 phút — chỉ đọc câu đầu mỗi đoạn, ghi 3 chữ tóm ý bên lề.\n'
              + '② Đọc câu hỏi, gạch từ khoá, TỰ NGHĨ cách bài có thể diễn đạt lại.\n'
              + '③ Quét tìm, đọc kỹ ĐÚNG đoạn chứa đáp án.\n'
              + '④ Viết đáp án vào phiếu NGAY.\n\n'
              + 'Bước ① mất 2 phút nhưng tiết kiệm 5–6 phút ở bước ③ vì bạn biết phải quay lại đoạn nào.',
            examples: [
              { en: 'Ghi bên lề: A = định nghĩa · B = nguyên nhân · C = phản biện · D = giải pháp', vi: 'bản đồ bài đọc trong 2 phút' },
            ],
            mistake: {
              wrong: 'Bỏ bước lướt vì "mất thời gian".',
              right: 'Luôn lướt 2 phút. Đó là 2 phút đầu tư, không phải 2 phút mất đi.',
              why:
                'Không có bản đồ bài thì mỗi câu hỏi bạn lại quét từ đầu. Mười câu hỏi là mười lần quét lại cả bài.',
            },
          },
        ],
        practice: [
          'Làm 1 passage bấm giờ 20 phút mỗi ngày. Ghi lại: làm được mấy câu, đúng mấy câu.',
          'Tuần đầu chấp nhận làm không hết. Ưu tiên GIỮ ĐÚNG GIỜ hơn là làm hết câu.',
        ],
      },
      {
        id: 'sp3-2',
        n: 17,
        title: 'Phân tích câu sai — viết ra vì sao sai',
        goal: 'Mỗi câu sai thành một bài học, thay vì một lần tiếc.',
        blocks: [
          {
            explain:
              'Làm đề rồi chỉ xem đáp án là cách chắc chắn nhất để giậm chân. Với MỌI câu sai, viết ra một dòng '
              + 'thuộc một trong bốn loại:\n\n'
              + '① Không biết từ → vấn đề TỪ VỰNG\n'
              + '② Không nhận ra paraphrase → luyện lại chủ điểm 2 chặng 2\n'
              + '③ Hiểu sai yêu cầu dạng câu hỏi → đọc lại tab Dạng câu hỏi\n'
              + '④ Hết giờ nên đoán → vấn đề TỐC ĐỘ\n\n'
              + 'Sau 5 đề, đếm xem loại nào nhiều nhất. Đó là thứ duy nhất cần luyện.',
            examples: [
              { en: 'Câu 7 sai — loại ②: bài viết "curb", đề viết "reduce". Không nhận ra là cùng nghĩa.', vi: '' },
              { en: 'Câu 12 sai — loại ④: còn 40 giây cho 3 câu, đoán bừa.', vi: '' },
            ],
            mistake: {
              wrong: 'Xem đáp án, gật gù "à đúng rồi", rồi làm đề tiếp.',
              right: 'Viết ra LOẠI lỗi cho từng câu sai.',
              why:
                'Loại lỗi mới cho biết phải luyện gì. Bốn loại trên cần bốn cách chữa hoàn toàn khác nhau — '
                + 'chữa nhầm loại là tốn hàng tháng.',
            },
          },
        ],
        practice: [
          'Với 3 đề đọc gần nhất, phân loại mọi câu sai theo bốn loại trên.',
          'Loại nào chiếm trên 40% thì dành hai tuần tới chỉ luyện đúng loại đó.',
        ],
      },
      {
        id: 'sp3-3',
        n: 18,
        title: 'Nghe Section 3 và 4 — nơi mất điểm',
        goal: 'Không còn rớt quá 4 câu ở hai section cuối.',
        blocks: [
          {
            explain:
              'Section 1 và 2 bạn đã ổn từ chặng 2. Điểm ở chặng 3 nằm hết ở Section 3 (hội thoại học thuật, '
              + 'nhiều lần đổi ý) và Section 4 (bài giảng, nói liên tục không nghỉ).\n\n'
              + 'Section 3 khó vì có 3–4 người và nhiều lần đảo ý. Section 4 khó vì không có ai nhắc lại và từ '
              + 'vựng học thuật dày đặc.',
            examples: [
              { en: 'Section 3 — bám: ai nói câu chốt? Các cụm "Let us go with…", "Fair enough", "Agreed"', vi: '' },
              { en: 'Section 4 — đọc trước TOÀN BỘ ghi chú, đoán loại từ cho từng chỗ trống', vi: '' },
              { en: 'Section 4 — bài giảng luôn có cấu trúc: theo thời gian, theo phân loại, hoặc theo nguyên nhân–kết quả', vi: '' },
            ],
            mistake: {
              wrong: 'Nghe Section 4 mà chưa đọc trước ghi chú.',
              right: 'Dùng trọn thời gian hướng dẫn để đọc ghi chú và đoán loại từ.',
              why:
                'Section 4 nói liên tục 5 phút không nghỉ. Không biết mình đang chờ danh từ hay động từ thì '
                + 'nghe xong mới hiểu, mà lúc đó đã trôi mất hai câu.',
            },
          },
        ],
        practice: [
          'Mỗi ngày làm 1 Section 3 hoặc Section 4, không làm Section 1 và 2 nữa.',
          'Chép chính tả riêng những đoạn bị sai. Ghi loại lỗi theo bài 14 chặng 2.',
        ],
      },
      {
        id: 'sp3-4',
        n: 19,
        title: 'Nghe giọng khác nhau',
        goal: 'Không bị khựng khi gặp giọng Úc, Scotland hay Ấn.',
        blocks: [
          {
            explain:
              'Đề IELTS cố ý dùng nhiều giọng. Người học Việt Nam thường chỉ quen giọng Mỹ qua phim, nên gặp '
              + 'giọng Anh-Anh hoặc Úc là khựng. Ba khác biệt đáng nhớ:',
            examples: [
              { en: 'Anh-Anh: bỏ /r/ cuối — "car" thành /kɑː/, "water" thành /ˈwɔːtə/', vi: '' },
              { en: 'Úc: nguyên âm /eɪ/ nghiêng về /aɪ/ — "today" nghe gần như "to-die"', vi: '' },
              { en: 'Anh-Anh: "can\'t" là /kɑːnt/, không phải /kænt/', vi: '' },
            ],
            mistake: {
              wrong: 'Chỉ nghe một nguồn duy nhất suốt nhiều tháng.',
              right: 'Mỗi tuần đổi nguồn: BBC (Anh-Anh), VOA (Mỹ), rồi tìm thêm nguồn Úc.',
              why:
                'Quen một giọng thì nghe giọng đó rất tốt nhưng gặp giọng khác lại như người mới. Đề thi chắc '
                + 'chắn có nhiều giọng.',
            },
          },
        ],
        practice: [
          'Hai tuần nghe BBC (Anh-Anh), hai tuần nghe VOA (Mỹ), rồi so xem giọng nào bạn nghe kém hơn.',
          'Giọng kém hơn thì dành gấp đôi thời gian cho nó.',
        ],
      },
      {
        id: 'sp3-5',
        n: 20,
        title: 'Bài kiểm tra cuối chặng 3',
        goal: 'Tự đo xem đã đủ điều kiện sang chặng 4 chưa.',
        blocks: [
          {
            explain:
              'Sáu phép kiểm, đạt từ 5/6 thì sang chặng 4. Chưa đạt thì quay lại đúng chủ điểm yếu.',
            examples: [
              { en: '1. Writing: có ít nhất 10 bài đã được CHẤM và đã viết lại phần sai.', vi: 'mốc quan trọng nhất của chặng này' },
              { en: '2. Sổ lỗi cá nhân có ≥ 8 mục, và ≥ 5 mục đã không tái phạm trong 3 bài gần nhất.', vi: '' },
              { en: '3. Reading: 30+/40 qua 3 đề liên tiếp, trong đúng 60 phút.', vi: '' },
              { en: '4. Listening: 30+/40, Section 3 và 4 không rớt quá 4 câu.', vi: '' },
              { en: '5. Vốn từ ~4.000, dùng được collocation học thuật đúng ngữ cảnh.', vi: '' },
              { en: '6. Thi thử 6.0–6.5 tổng, không kỹ năng nào dưới 5.5.', vi: '' },
            ],
            mistake: {
              wrong: 'Sang chặng 4 khi Writing vẫn chưa từng được ai chấm.',
              right: 'Đủ 10 bài được chấm rồi mới đi tiếp.',
              why:
                'Chặng 4 là chặng giảm lỗi. Không biết mình sai gì thì không có gì để giảm — bạn sẽ dậm chân ở '
                + 'chặng 4 y như đã dậm chân ở chặng 3.',
            },
          },
        ],
        practice: [
          'Làm đủ 6 phép kiểm trong 3 ngày, ghi kết quả.',
          'Mục nào chưa đạt, quay lại chủ điểm tương ứng: Writing → chủ điểm 1, câu phức → chủ điểm 2, từ → chủ điểm 3, tốc độ → chủ điểm 4.',
        ],
      },
    ],
  },
];
