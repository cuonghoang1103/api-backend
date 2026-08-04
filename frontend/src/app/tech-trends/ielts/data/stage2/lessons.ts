/**
 * Bài học chặng 2 — 20 bài, 4 chủ điểm.
 *
 * Chọn nội dung theo đúng khoảng cách giữa band 4.0 và 5.5, chứ không dạy lại
 * ngữ pháp từ đầu. Người ở 4.0 đã đặt được câu đúng; thứ họ thiếu là:
 *
 *   1. Vài cấu trúc nâng band mà đề nào cũng cần (bị động, mệnh đề quan hệ,
 *      câu điều kiện, mệnh đề nhượng bộ).
 *   2. PARAPHRASE — kỹ năng quyết định nhất chặng này. Đề IELTS gần như không
 *      bao giờ dùng lại đúng từ trong bài; không nhận ra được cách diễn đạt
 *      lại thì đọc hiểu tới đâu cũng vẫn làm sai.
 *   3. Kỹ năng LÀM BÀI: đọc lướt, quét tìm, quản lý thời gian, bắt từ báo hiệu.
 *      Ở chặng này người học mất điểm vì hết giờ nhiều hơn vì không hiểu.
 *   4. Khung viết và nói đủ để chạm 5.5.
 *
 * Cố ý KHÔNG có 40 bài như chặng 1: chặng 2 học ÍT điểm mới nhưng phải luyện
 * sâu từng điểm, vì mỗi cái đều dùng lại hằng ngày trong mọi đề.
 */
import type { LessonUnit } from '../types';

export const UNITS2: LessonUnit[] = [
  /* ═════════════ CHỦ ĐIỂM 1: NGỮ PHÁP LÊN BAND ═════════════ */
  {
    id: 's2-grammar',
    title: 'Ngữ pháp lên band',
    subtitle: 'Bài 1–5 · Bốn cấu trúc đề nào cũng cần, cộng một cái người Việt hay sai',
    icon: '📐',
    lessons: [
      {
        id: 'g1',
        n: 1,
        title: 'Câu bị động — xương sống của văn học thuật',
        goal: 'Viết được câu bị động đúng, và biết khi nào NÊN dùng nó thay vì chủ động.',
        blocks: [
          {
            formula: 'be + V3 (quá khứ phân từ) · by + người thực hiện (thường bỏ đi)',
            explain:
              'Văn học thuật dùng bị động rất nhiều vì nó đặt trọng tâm vào SỰ VIỆC chứ không vào người làm. '
              + 'Ở Reading bạn sẽ gặp liên tục; ở Writing Task 1 nó gần như bắt buộc khi mô tả quy trình.',
            examples: [
              { en: 'The survey was conducted in 2020.', vi: 'Cuộc khảo sát được tiến hành năm 2020.' },
              { en: 'Plastic waste is collected and then sorted.', vi: 'Rác nhựa được thu gom rồi phân loại.' },
              { en: 'Stricter rules have been introduced recently.', vi: 'Các quy định chặt hơn đã được đưa ra gần đây.' },
              { en: 'The building will be completed next year.', vi: 'Toà nhà sẽ được hoàn thành vào năm sau.' },
            ],
            mistake: {
              wrong: 'The survey was conduct in 2020. / The rules have introduced recently.',
              right: 'The survey was conducted in 2020. / The rules have been introduced recently.',
              why:
                'Hai lỗi hay gặp: quên chia V3 (conduct → conducted), và quên "been" ở thì hoàn thành bị động '
                + '(have been introduced, không phải have introduced).',
            },
          },
          {
            explain:
              'Khi nào dùng bị động: (1) không biết hoặc không cần nói ai làm, (2) muốn nhấn vào kết quả, '
              + '(3) mô tả quy trình. KHÔNG dùng bị động cho mọi câu — bài toàn bị động đọc rất nặng nề và '
              + 'cũng bị trừ điểm ở tiêu chí đa dạng.',
            examples: [
              { en: 'Chủ động: Researchers collected the data. (nhấn vào người làm)', vi: 'Các nhà nghiên cứu đã thu thập dữ liệu.' },
              { en: 'Bị động: The data was collected over six months. (nhấn vào dữ liệu)', vi: 'Dữ liệu được thu thập trong sáu tháng.' },
            ],
          },
        ],
        keyWords: [
          { en: 'be conducted', ipa: '/bi kənˈdʌktɪd/', vi: 'được tiến hành' },
          { en: 'be introduced', ipa: '/bi ˌɪntrəˈdjuːst/', vi: 'được đưa ra' },
          { en: 'be regarded as', ipa: '/bi rɪˈɡɑːdɪd æz/', vi: 'được xem là' },
        ],
        practice: [
          'Đổi 10 câu chủ động bạn đã viết ở chặng 1 sang bị động, rồi đọc lại xem câu nào nghe tự nhiên hơn ở dạng nào.',
          'Viết 5 câu mô tả một quy trình bất kỳ (pha cà phê, tái chế giấy) — mỗi bước một câu bị động.',
        ],
      },
      {
        id: 'g2',
        n: 2,
        title: 'Mệnh đề quan hệ rút gọn — cách gộp câu ăn điểm',
        goal: 'Gộp hai câu thành một câu gọn, cho thấy ngữ pháp đa dạng mà không dài dòng.',
        blocks: [
          {
            formula: 'who/which + be + … → bỏ who/which + be · who/which + V → V-ing',
            explain:
              'Bạn đã biết mệnh đề quan hệ ở chặng 1. Chặng này học cách RÚT GỌN nó. Câu ngắn lại mà vẫn '
              + 'thể hiện cấu trúc phức — đúng thứ giám khảo tính là "ngữ pháp đa dạng".',
            examples: [
              { en: 'The students who are studying abroad → The students studying abroad', vi: 'Những sinh viên đang du học' },
              { en: 'The report which was published in 2020 → The report published in 2020', vi: 'Báo cáo được công bố năm 2020' },
              { en: 'People who live in cities → People living in cities', vi: 'Những người sống ở thành phố' },
              { en: 'A method which reduces waste → A method reducing waste', vi: 'Một phương pháp giúp giảm rác thải' },
            ],
            mistake: {
              wrong: 'The report was published in 2020 shows a decline.',
              right: 'The report published in 2020 shows a decline.',
              why:
                'Rút gọn thì phải bỏ CẢ "which" LẪN "was". Giữ lại "was" thành hai động từ chính trong một câu → sai.',
            },
          },
        ],
        practice: [
          'Lấy 8 câu có who/which bạn đã viết, rút gọn tất cả rồi đọc lại xem có mất nghĩa không.',
          'Viết 5 câu mới dùng dạng rút gọn về chủ đề môi trường hoặc giáo dục.',
        ],
      },
      {
        id: 'g3',
        n: 3,
        title: 'Câu điều kiện loại 1 và 2',
        goal: 'Nói và viết được về giả định — cấu trúc bắt buộc khi bàn giải pháp ở Task 2.',
        blocks: [
          {
            formula: 'Loại 1: If + hiện tại đơn, … will + V · Loại 2: If + quá khứ đơn, … would + V',
            explain:
              '**Loại 1** cho việc CÓ THỂ xảy ra (giải pháp thực tế). **Loại 2** cho việc giả định, ít khả '
              + 'năng hoặc không có thật. Task 2 gần như luôn cần ít nhất một câu điều kiện khi bạn đề xuất giải pháp.',
            examples: [
              { en: 'If governments invest in public transport, traffic will decrease.', vi: 'Nếu chính phủ đầu tư vào giao thông công cộng, ùn tắc sẽ giảm.' },
              { en: 'If people had more free time, they would exercise more.', vi: 'Nếu người ta có nhiều thời gian rảnh hơn, họ sẽ tập thể dục nhiều hơn.' },
              { en: 'Unless action is taken, the situation will get worse.', vi: 'Nếu không hành động, tình hình sẽ tệ hơn.' },
            ],
            mistake: {
              wrong: 'If governments will invest more, traffic will decrease.',
              right: 'If governments invest more, traffic will decrease.',
              why:
                'KHÔNG dùng "will" trong mệnh đề "if". Đây là lỗi rất phổ biến và bị đếm là lỗi ngữ pháp mỗi lần lặp lại.',
            },
          },
          {
            explain:
              '"Unless" = "if not". Dùng nó thay cho "If … do not …" là câu gọn hơn và nghe học thuật hơn.',
            examples: [
              { en: 'Unless we act now, … = If we do not act now, …', vi: 'Nếu chúng ta không hành động ngay, …' },
            ],
            mistake: {
              wrong: 'Unless we do not act now, the problem will grow.',
              right: 'Unless we act now, the problem will grow.',
              why: '"Unless" đã mang nghĩa phủ định sẵn. Thêm "not" nữa là phủ định hai lần, thành ngược nghĩa.',
            },
          },
        ],
        practice: [
          'Viết 5 câu loại 1 đề xuất giải pháp cho ùn tắc giao thông, ô nhiễm, béo phì.',
          'Viết 3 câu loại 2 về điều bạn ước khác đi, và 2 câu dùng "unless".',
        ],
      },
      {
        id: 'g4',
        n: 4,
        title: 'Although, Despite, However — ba từ nhượng bộ hay bị dùng sai',
        goal: 'Nêu được ý đối lập bằng ba cấu trúc khác nhau, không lặp mãi "but".',
        blocks: [
          {
            formula: 'Although + MỆNH ĐỀ · Despite / In spite of + DANH TỪ hoặc V-ing · However, + MỆNH ĐỀ (câu riêng)',
            explain:
              'Ba từ này cùng nghĩa "mặc dù / tuy nhiên" nhưng NGỮ PHÁP KHÁC HẲN nhau. Dùng sai là lỗi thấy '
              + 'ngay, mà lại rất hay gặp vì tiếng Việt chỉ có một chữ "mặc dù".',
            examples: [
              { en: 'Although the cost was high, the project went ahead.', vi: 'Mặc dù chi phí cao, dự án vẫn được tiến hành.' },
              { en: 'Despite the high cost, the project went ahead.', vi: 'Bất chấp chi phí cao, dự án vẫn được tiến hành.' },
              { en: 'Despite being expensive, the project went ahead.', vi: 'Dù tốn kém, dự án vẫn được tiến hành.' },
              { en: 'The cost was high. However, the project went ahead.', vi: 'Chi phí cao. Tuy nhiên, dự án vẫn được tiến hành.' },
            ],
            mistake: {
              wrong: 'Despite the cost was high, … / Although of the high cost, … / Although, the cost was high.',
              right: 'Despite the high cost, … / Although the cost was high, … / However, the cost was high.',
              why:
                'Ba lỗi kinh điển: "Despite" không đi với mệnh đề; "Although" không đi với "of"; "However" '
                + 'phải đứng đầu MỘT CÂU MỚI, có dấu phẩy sau, không nối hai mệnh đề như "but".',
            },
          },
        ],
        practice: [
          'Viết CÙNG MỘT ý theo cả ba cách: Although…, Despite…, và …. However, ….',
          'Làm vậy với 4 ý khác nhau về chủ đề học tập và môi trường.',
        ],
      },
      {
        id: 'g5',
        n: 5,
        title: 'Sau giới từ luôn là V-ing',
        goal: 'Hết sai dạng động từ sau các cụm hay dùng nhất trong bài viết.',
        blocks: [
          {
            formula: 'giới từ (in, on, at, of, for, about, by, without, after, before) + V-ing',
            explain:
              'Quy tắc chỉ một dòng nhưng sai rất nhiều, vì nhiều cụm có chữ "to" mà "to" đó lại là GIỚI TỪ '
              + 'chứ không phải "to" của động từ nguyên thể.',
            examples: [
              { en: 'She is good at solving problems.', vi: 'Cô ấy giỏi giải quyết vấn đề.' },
              { en: 'Instead of driving, they cycle to work.', vi: 'Thay vì lái xe, họ đạp xe đi làm.' },
              { en: 'By investing in schools, the country improved literacy.', vi: 'Bằng cách đầu tư vào trường học, đất nước cải thiện tỷ lệ biết chữ.' },
              { en: 'I look forward to hearing from you.', vi: 'Tôi mong nhận được hồi âm.' },
            ],
            mistake: {
              wrong: 'I look forward to hear from you. / They are used to work late.',
              right: 'I look forward to hearing from you. / They are used to working late.',
              why:
                'Trong "look forward to" và "be used to", chữ "to" là GIỚI TỪ nên theo sau là V-ing. Khác hẳn '
                + '"want to go", "need to go" — ở đó "to" thuộc về động từ nguyên thể.',
            },
          },
        ],
        keyWords: [
          { en: 'be capable of', ipa: '/bi ˈkeɪpəbl əv/', vi: 'có khả năng' },
          { en: 'instead of', ipa: '/ɪnˈsted əv/', vi: 'thay vì' },
          { en: 'be responsible for', ipa: '/bi rɪˈspɒnsəbl fə(r)/', vi: 'chịu trách nhiệm về' },
        ],
        practice: [
          'Viết 8 câu, mỗi câu dùng một giới từ khác nhau + V-ing.',
          'Học riêng 3 cụm bẫy: look forward to, be used to, in addition to — cả ba đều đi với V-ing.',
        ],
      },
    ],
  },

  /* ═════════════ CHỦ ĐIỂM 2: PARAPHRASE ═════════════ */
  {
    id: 's2-paraphrase',
    title: 'Paraphrase — kỹ năng quyết định chặng 2',
    subtitle: 'Bài 6–10 · Đề không bao giờ dùng lại đúng từ trong bài',
    icon: '🔁',
    lessons: [
      {
        id: 'p2-1',
        n: 6,
        title: 'Vì sao paraphrase là chìa khoá của cả bài thi',
        goal: 'Hiểu tại sao đọc hiểu tốt mà vẫn làm sai, và biết mình phải luyện gì.',
        blocks: [
          {
            explain:
              'Đề IELTS gần như KHÔNG BAO GIỜ dùng lại đúng từ trong bài đọc hay bài nghe. Câu hỏi luôn diễn '
              + 'đạt lại bằng từ khác. Nếu bạn chỉ tìm từ giống hệt thì sẽ (1) không tìm thấy đáp án đúng, và '
              + '(2) rơi vào bẫy — vì chỗ có từ giống hệt thường CHÍNH LÀ bẫy.\n\n'
              + 'Paraphrase còn ăn điểm ở chiều ngược lại: Writing Task 1 bắt buộc viết lại đề bằng từ của bạn, '
              + 'và Speaking thì diễn đạt lại được khi thiếu từ chính là tiêu chí Lexical Resource.',
            examples: [
              { en: 'Bài: "Sales rose sharply." → Đề: "There was a significant increase in sales."', vi: 'cùng nghĩa, không chung một từ nào ngoài "sales"' },
              { en: 'Bài: "Few people attended." → Đề: "The event was poorly attended."', vi: 'đổi cấu trúc hoàn toàn' },
              { en: 'Bài: "The city banned cars." → Đề: "Vehicles are no longer permitted in the centre."', vi: 'đổi cả từ lẫn dạng câu' },
            ],
            mistake: {
              wrong: 'Quét bài tìm đúng từ có trong câu hỏi rồi chọn ngay chỗ đó.',
              right: 'Tìm chỗ có Ý giống, dù không có từ nào giống.',
              why:
                'Chỗ trùng từ nhiều nhất thường là bẫy do người ra đề cố tình đặt. Đây là lý do nhiều người '
                + 'đọc hiểu tốt vẫn chỉ được 5.0.',
            },
          },
        ],
        practice: [
          'Lấy 5 câu bất kỳ trong bài đọc chặng 1, viết lại mỗi câu bằng từ khác mà giữ nguyên nghĩa.',
          'Đọc một bài báo tiếng Anh ngắn, gạch chân 10 từ, tìm từ đồng nghĩa cho từng cái.',
        ],
      },
      {
        id: 'p2-2',
        n: 7,
        title: 'Cách 1: đổi sang từ đồng nghĩa',
        goal: 'Có sẵn kho từ đồng nghĩa cho những từ xuất hiện nhiều nhất trong đề.',
        blocks: [
          {
            explain:
              'Cách đơn giản nhất nhưng phải cẩn thận: từ đồng nghĩa hiếm khi thay được 100%. Học theo CẶP '
              + 'trong ngữ cảnh, đừng học danh sách trơ.',
            examples: [
              { en: 'increase → rise, grow, climb, go up, surge (mạnh)', vi: 'tăng' },
              { en: 'decrease → fall, drop, decline, reduce, plummet (mạnh)', vi: 'giảm' },
              { en: 'important → significant, crucial, vital, key, essential', vi: 'quan trọng' },
              { en: 'problem → issue, difficulty, challenge, drawback', vi: 'vấn đề' },
              { en: 'many → numerous, a large number of, a great deal of (không đếm được)', vi: 'nhiều' },
              { en: 'help → assist, support, contribute to, facilitate', vi: 'giúp đỡ' },
              { en: 'think → believe, argue, claim, maintain', vi: 'cho rằng' },
              { en: 'because of → due to, owing to, as a result of', vi: 'vì' },
            ],
            mistake: {
              wrong: 'Dùng "plummet" cho một mức giảm 2%.',
              right: 'Dùng "fall slightly" cho mức giảm nhỏ; để "plummet" cho mức giảm rất mạnh.',
              why:
                'Từ đồng nghĩa có MỨC ĐỘ khác nhau. Dùng từ mạnh cho việc nhỏ là sai ngữ cảnh, bị trừ điểm '
                + 'nặng hơn là dùng từ đơn giản mà đúng.',
            },
          },
        ],
        practice: [
          'Làm bảng 8 từ gốc × 4 từ đồng nghĩa, ghi kèm mức độ mạnh/nhẹ của từng từ.',
          'Viết một đoạn 100 từ mô tả xu hướng, KHÔNG lặp lại từ "increase" hay "decrease" lần nào.',
        ],
      },
      {
        id: 'p2-3',
        n: 8,
        title: 'Cách 2: đổi loại từ',
        goal: 'Viết lại một câu bằng cách đổi danh từ ↔ động từ ↔ tính từ.',
        blocks: [
          {
            explain:
              'Cách này mạnh hơn đổi từ đồng nghĩa vì nó đổi luôn cấu trúc câu, nên bài không bị "na ná" đề.',
            examples: [
              { en: 'Sales increased significantly. → There was a significant increase in sales.', vi: 'động từ → danh từ' },
              { en: 'The policy was successful. → The policy succeeded. / the success of the policy', vi: 'tính từ → động từ → danh từ' },
              { en: 'People are increasingly aware of… → Public awareness of… has grown.', vi: 'tính từ → danh từ' },
              { en: 'It is difficult to measure. → Measurement is difficult.', vi: 'đổi chủ ngữ' },
            ],
            mistake: {
              wrong: 'There was a significantly increase in sales.',
              right: 'There was a significant increase in sales.',
              why:
                'Đổi loại từ phải đổi CẢ từ bổ nghĩa: bổ nghĩa cho danh từ (increase) phải là tính từ '
                + '(significant), không phải trạng từ (significantly).',
            },
          },
        ],
        practice: [
          'Lấy 10 câu, viết lại mỗi câu bằng cách đổi loại từ ít nhất một chỗ.',
          'Học bộ bốn dạng của 10 từ hay dùng: analyse/analysis/analytical, succeed/success/successful…',
        ],
      },
      {
        id: 'p2-4',
        n: 9,
        title: 'Cách 3: đổi cấu trúc câu',
        goal: 'Viết lại câu bằng cách đổi chủ động ↔ bị động, hoặc đảo trật tự mệnh đề.',
        blocks: [
          {
            explain:
              'Ba phép đổi cấu trúc dùng được ngay: (1) chủ động ↔ bị động, (2) đảo vị trí mệnh đề trạng ngữ, '
              + '(3) đổi so sánh sang phủ định của chiều ngược lại.',
            examples: [
              { en: 'The government introduced the law. → The law was introduced by the government.', vi: 'chủ động → bị động' },
              { en: 'Although it rained, we went out. → We went out although it rained.', vi: 'đảo mệnh đề' },
              { en: 'Reading is easier than writing. → Writing is not as easy as reading.', vi: 'đảo chiều so sánh' },
              { en: 'Only a few students passed. → The majority of students failed.', vi: 'đổi góc nhìn' },
            ],
            mistake: {
              wrong: 'Reading is easier than writing. → Writing is not as easier as reading.',
              right: 'Writing is not as easy as reading.',
              why: 'Trong cấu trúc "not as … as" phải dùng tính từ NGUYÊN GỐC, không dùng dạng so sánh hơn.',
            },
          },
        ],
        practice: [
          'Viết lại 10 câu, mỗi câu bằng một phép đổi cấu trúc khác nhau.',
          'Lấy đề Task 2 bất kỳ, viết lại đề bằng ba cách khác nhau — đây chính là câu mở bài của bạn.',
        ],
      },
      {
        id: 'p2-5',
        n: 10,
        title: 'Nhận ra paraphrase khi đọc và khi nghe',
        goal: 'Nhìn câu hỏi là đoán được bài sẽ diễn đạt lại như thế nào.',
        blocks: [
          {
            explain:
              'Đây là chiều NGƯỢC LẠI của bốn bài vừa học, và là chiều ăn điểm trực tiếp trong phòng thi. '
              + 'Quy trình: đọc câu hỏi → gạch chân từ khoá → TỰ NGHĨ ra 2–3 cách bài có thể diễn đạt lại → '
              + 'quét tìm những cách đó. Làm vậy nhanh hơn hẳn so với đọc tuần tự cả bài.',
            examples: [
              { en: 'Câu hỏi có "reduce costs" → bài có thể viết: cut spending, lower expenditure, save money', vi: '' },
              { en: 'Câu hỏi có "young people" → bài có thể viết: teenagers, adolescents, the younger generation', vi: '' },
              { en: 'Câu hỏi có "not allowed" → bài có thể viết: banned, prohibited, forbidden, restricted', vi: '' },
              { en: 'Câu hỏi có "the main reason" → bài có thể viết: primarily because, chiefly due to, the principal cause', vi: '' },
            ],
            mistake: {
              wrong: 'Nghe thấy đúng từ trong câu hỏi là khoanh luôn đáp án.',
              right: 'Nghe hết câu rồi mới quyết — đề hay đặt từ giống hệt vào chỗ SAI để bẫy.',
              why:
                'Ở Listening, người ra đề cố tình đặt từ trùng với câu hỏi vào một phương án sai. Đáp án đúng '
                + 'thì được diễn đạt lại. Đây là bẫy khiến điểm Listening đứng yên ở 5.0 rất lâu.',
            },
          },
        ],
        practice: [
          'Lấy 10 câu hỏi trong tab Đọc, với mỗi câu tự viết 2 cách diễn đạt lại TRƯỚC KHI mở bài đọc.',
          'Làm một bài nghe, ghi lại mọi chỗ bài dùng từ khác với câu hỏi. Đây là bảng paraphrase của riêng bạn.',
        ],
      },
    ],
  },

  /* ═════════════ CHỦ ĐIỂM 3: KỸ NĂNG LÀM BÀI ═════════════ */
  {
    id: 's2-skills',
    title: 'Kỹ năng làm bài',
    subtitle: 'Bài 11–15 · Ở chặng này mất điểm vì hết giờ nhiều hơn vì không hiểu',
    icon: '⏱️',
    lessons: [
      {
        id: 'k2-1',
        n: 11,
        title: 'Đọc lướt và quét tìm (skimming & scanning)',
        goal: 'Nắm được bố cục bài trong 2 phút mà không đọc từng chữ.',
        blocks: [
          {
            explain:
              'Hai kỹ năng khác nhau, dùng vào hai lúc khác nhau.\n\n'
              + '**Skimming (đọc lướt)** — làm MỘT LẦN khi mở bài, khoảng 2 phút: đọc tiêu đề, câu đầu mỗi đoạn, '
              + 'và câu cuối bài. Mục tiêu là biết mỗi đoạn nói về cái gì để sau đó biết quay lại chỗ nào.\n\n'
              + '**Scanning (quét tìm)** — làm mỗi khi trả lời một câu hỏi: mắt lướt nhanh tìm một từ khoá cụ '
              + 'thể (tên riêng, số, năm) mà KHÔNG đọc nghĩa. Giống như tìm một số trong danh bạ.',
            examples: [
              { en: 'Skim: đọc câu đầu 5 đoạn → biết đoạn C nói về chi phí, đoạn D nói về vấn đề.', vi: '' },
              { en: 'Scan: câu hỏi có "1998" → mắt chỉ tìm chuỗi số 1998, bỏ qua mọi chữ khác.', vi: '' },
            ],
            mistake: {
              wrong: 'Đọc kỹ cả bài từ đầu tới cuối rồi mới xem câu hỏi.',
              right: 'Lướt 2 phút → đọc câu hỏi → quét tìm → chỉ đọc kỹ đúng đoạn chứa đáp án.',
              why:
                'Bài đọc Academic dài khoảng 900 từ và bạn chỉ có 20 phút cho cả bài lẫn 13 câu hỏi. Đọc kỹ '
                + 'toàn bộ là chắc chắn không kịp.',
            },
          },
        ],
        practice: [
          'Lấy một bài ở tab Đọc, bấm giờ 2 phút chỉ để lướt. Gấp lại, viết ra mỗi đoạn nói về gì.',
          'Luyện quét: nhờ ai đó cho một con số hoặc tên riêng, bấm giờ xem bạn tìm ra trong bao lâu. Mục tiêu dưới 15 giây.',
        ],
      },
      {
        id: 'k2-2',
        n: 12,
        title: 'Quản lý thời gian trong phòng thi',
        goal: 'Có một kế hoạch phút cụ thể cho Reading và Writing, không làm theo cảm tính.',
        blocks: [
          {
            explain:
              '**Reading (60 phút, 3 bài, 40 câu):** 17 phút cho passage 1, 20 phút cho passage 2, 23 phút cho '
              + 'passage 3. Chia đều 20 phút là sai vì bài 1 dễ nhất. Nhớ Reading KHÔNG có thời gian chép đáp '
              + 'án riêng — viết vào phiếu ngay.\n\n'
              + '**Writing (60 phút):** 20 phút Task 1, 40 phút Task 2. Trong 40 phút của Task 2: 5 phút lập '
              + 'dàn ý, 30 phút viết, 5 phút soát. Nếu hay thiếu giờ, làm Task 2 TRƯỚC vì nó chiếm gấp đôi điểm.',
            examples: [
              { en: 'Reading: 17 – 20 – 23 phút', vi: 'bài dễ ít giờ, bài khó nhiều giờ' },
              { en: 'Writing Task 2: 5 dàn ý – 30 viết – 5 soát', vi: '' },
              { en: 'Quá 2 phút cho một câu → đoán, đánh dấu, đi tiếp', vi: 'quy tắc cứng' },
            ],
            mistake: {
              wrong: 'Ngồi lâu ở một câu khó vì "sắp ra rồi".',
              right: 'Quá 2 phút thì đoán, đánh dấu, đi tiếp. Còn giờ thì quay lại.',
              why:
                'Mọi câu đều đáng 1 điểm như nhau. Dành 5 phút cho một câu khó là mất cơ hội làm 3 câu dễ ở sau.',
            },
          },
        ],
        practice: [
          'Làm 1 bài đọc có bấm giờ đúng 20 phút. Hết giờ là dừng, dù chưa xong — rồi xem mình làm được mấy câu.',
          'Ghi lại mình tiêu bao nhiêu phút cho từng dạng câu hỏi, tìm ra dạng ngốn giờ nhất của riêng bạn.',
        ],
      },
      {
        id: 'k2-3',
        n: 13,
        title: 'Bắt từ báo hiệu khi nghe',
        goal: 'Nghe ra được lúc nào đáp án sắp tới và lúc nào thông tin vừa nghe sắp bị thay.',
        blocks: [
          {
            explain:
              'Bài nghe không nói đều đều — nó có những từ báo hiệu. Nghe được chúng thì bạn biết phải chú ý '
              + 'vào lúc nào, thay vì căng tai suốt 30 phút rồi mệt.',
            examples: [
              { en: 'Đảo hướng — đáp án thường nằm SAU: but, however, actually, in fact, although', vi: '' },
              { en: 'Đổi ý — thông tin trước đó bị BỎ: sorry, I mean, on second thoughts, instead', vi: '' },
              { en: 'Sắp liệt kê: firstly, another thing, in addition, also', vi: '' },
              { en: 'Sắp kết thúc phần: finally, one last thing, before we finish', vi: '' },
              { en: 'Nhấn mạnh — hay là đáp án: the main thing, most importantly, the key point', vi: '' },
            ],
            mistake: {
              wrong: 'Nghe "It is on Tuesday" là ghi luôn Tuesday.',
              right: 'Chờ hết câu: "It is on Tuesday — sorry, Wednesday." Đáp án là Wednesday.',
              why:
                'Người nói ĐỔI Ý là bẫy có ở gần như mọi đề. Cứ nghe hết ý rồi mới ghi, đừng ghi ngay từ đầu tiên nghe được.',
            },
          },
        ],
        practice: [
          'Làm một bài nghe, chỉ tập trung ĐẾM xem có bao nhiêu từ báo hiệu, chưa cần trả lời câu hỏi.',
          'Nghe lại và ghi ra: sau mỗi từ báo hiệu là thông tin gì.',
        ],
      },
      {
        id: 'k2-4',
        n: 14,
        title: 'Chép chính tả nâng cao',
        goal: 'Biến chép chính tả thành công cụ chẩn đoán, không chỉ là bài tập chép.',
        blocks: [
          {
            explain:
              'Ở chặng 1 bạn chép rồi đối chiếu. Chặng 2 làm thêm một bước: PHÂN LOẠI lỗi. Sau hai tuần bạn '
              + 'sẽ thấy lỗi của mình tập trung vào một hai loại, và luyện đúng loại đó nhanh hơn nhiều so với '
              + 'nghe thêm hàng chục giờ.',
            examples: [
              { en: 'Loại 1 — âm cuối: nghe "he work" thay vì "he works"', vi: 'thiếu /s/ /t/ /d/' },
              { en: 'Loại 2 — nối âm: "an apple" nghe thành "a napple"', vi: '' },
              { en: 'Loại 3 — âm yếu: "a" "of" "to" bị nuốt gần như mất hẳn', vi: '' },
              { en: 'Loại 4 — không biết từ: nghe rõ nhưng không hiểu nên không chép được', vi: 'đây là vấn đề TỪ VỰNG, không phải nghe' },
              { en: 'Loại 5 — số và tên riêng', vi: '' },
            ],
            mistake: {
              wrong: 'Nghe sai nhiều nên kết luận "mình dốt nghe" rồi nghe thêm thật nhiều.',
              right: 'Phân loại lỗi trước. Nếu phần lớn là loại 4 thì vấn đề là TỪ VỰNG, nghe thêm không giải quyết được.',
              why:
                'Nghe thêm chỉ giúp cho loại 1, 2, 3. Loại 4 phải chữa bằng cách học từ. Không phân loại thì '
                + 'bạn đang chữa sai bệnh.',
            },
          },
        ],
        practice: [
          'Chép chính tả 5 phút mỗi ngày, mỗi lỗi ghi kèm số loại (1–5).',
          'Sau hai tuần, đếm xem loại nào nhiều nhất rồi lập kế hoạch chữa đúng loại đó.',
        ],
      },
      {
        id: 'k2-5',
        n: 15,
        title: 'Đoán nghĩa từ mới theo ngữ cảnh',
        goal: 'Không dừng lại vì một từ lạ — trong phòng thi không có từ điển.',
        blocks: [
          {
            explain:
              'Bài đọc Academic luôn có từ bạn chưa biết, kể cả ở band 8. Kỹ năng cần là ĐOÁN đủ để làm bài, '
              + 'chứ không phải hiểu chính xác. Bốn manh mối theo thứ tự nên dùng.',
            examples: [
              { en: '1. Định nghĩa ngay trong câu: "Deforestation, the clearing of forests, has…"', vi: 'bài tự giải thích' },
              { en: '2. Từ đối lập: "Unlike urban areas, rural regions…" → rural ngược với urban', vi: '' },
              { en: '3. Ví dụ theo sau: "Renewable sources, such as wind and solar, …"', vi: '' },
              { en: '4. Cấu tạo từ: un- (không), -less (không có), re- (lại), -tion (danh từ), -able (có thể)', vi: '' },
            ],
            mistake: {
              wrong: 'Gặp từ lạ là dừng lại đọc đi đọc lại câu đó.',
              right: 'Đọc tiếp hết đoạn. Nghĩa thường lộ ra ở câu sau; mà nhiều khi từ đó không liên quan tới câu hỏi nào.',
              why:
                'Phần lớn từ lạ trong bài KHÔNG nằm trong câu hỏi nào. Dừng lại vì chúng là tự lấy mất thời gian của mình.',
            },
          },
        ],
        keyWords: [
          { en: 'in other words', ipa: '/ɪn ˈʌðə wɜːdz/', vi: 'nói cách khác (báo hiệu định nghĩa)' },
          { en: 'that is', ipa: '/ðæt ɪz/', vi: 'tức là' },
          { en: 'such as', ipa: '/sʌtʃ æz/', vi: 'chẳng hạn như (báo hiệu ví dụ)' },
        ],
        practice: [
          'Lấy một bài đọc, che phần từ khó đã giải nghĩa, tự đoán rồi mới đối chiếu.',
          'Học 15 tiền tố và hậu tố hay gặp — chúng giúp đoán được rất nhiều từ học thuật.',
        ],
      },
    ],
  },

  /* ═════════════ CHỦ ĐIỂM 4: VIẾT & NÓI LÊN 5.5 ═════════════ */
  {
    id: 's2-output',
    title: 'Viết & Nói lên 5.5',
    subtitle: 'Bài 16–20 · Khung bài đủ để chạm mốc chặng này',
    icon: '✍️',
    lessons: [
      {
        id: 'o2-1',
        n: 16,
        title: 'Cấu trúc Task 2 bốn đoạn',
        goal: 'Có một khung cố định để không bao giờ phải nghĩ "viết gì trước".',
        blocks: [
          {
            formula: 'Mở bài (2 câu) → Thân 1 (5–6 câu) → Thân 2 (5–6 câu) → Kết bài (2 câu)',
            explain:
              'Mốc của chặng 2 là "viết được Task 2 đúng cấu trúc 4 đoạn, dù ý còn đơn giản". Chú ý vế sau: '
              + 'ở chặng này ĐÚNG CẤU TRÚC quan trọng hơn ý sâu sắc. Ý sâu để dành chặng 3.\n\n'
              + 'Mỗi đoạn thân theo công thức bốn bước: câu chủ đề → giải thích → ví dụ → câu chốt.',
            examples: [
              { en: 'Mở bài câu 1: viết lại đề bằng từ khác (paraphrase — bài 6–9).', vi: '' },
              { en: 'Mở bài câu 2: nêu THẲNG quan điểm hoặc nói bài sẽ bàn gì.', vi: '' },
              { en: 'Thân: Firstly, … This is because … For instance, … As a result, …', vi: '' },
              { en: 'Kết bài: In conclusion, … (nhắc lại quan điểm bằng từ khác, KHÔNG thêm ý mới)', vi: '' },
            ],
            mistake: {
              wrong: 'Viết ba đoạn thân với ba ý nông, mỗi ý một hai câu.',
              right: 'Hai đoạn thân, mỗi đoạn MỘT ý được triển khai đầy đủ có ví dụ.',
              why:
                'Nhiều ý nông bị chấm thấp ở Task Response hơn là ít ý mà sâu. Hai ý đủ cho 250 từ.',
            },
          },
        ],
        practice: [
          'Lập dàn ý (chỉ dàn ý, chưa viết) cho 5 đề Task 2 khác nhau, mỗi dàn ý đúng khung 4 đoạn. Mỗi cái 5 phút.',
          'Viết đầy đủ 1 trong 5 đề đó trong 40 phút.',
        ],
      },
      {
        id: 'o2-2',
        n: 17,
        title: 'Mở bài và kết bài Task 2',
        goal: 'Viết được mở bài trong 4 phút mà không dùng câu sáo rỗng.',
        blocks: [
          {
            explain:
              'Mở bài chỉ cần HAI câu: câu 1 viết lại đề bằng từ khác, câu 2 nêu quan điểm. Đừng viết dài — '
              + 'mở bài dài lấy mất thời gian của phần thân, mà phần thân mới là chỗ có điểm.',
            examples: [
              { en: 'Đề: "Some people think students should study only useful subjects."', vi: '' },
              { en: 'Câu 1: "It is sometimes argued that young people ought to focus solely on subjects that will help them find work."', vi: 'viết lại đề' },
              { en: 'Câu 2: "While I accept that practical skills matter, I believe this view is too narrow."', vi: 'nêu quan điểm rõ' },
              { en: 'Kết: "In conclusion, although employability is important, a broad education benefits both individuals and society."', vi: '' },
            ],
            mistake: {
              wrong: 'Nowadays, education is very important in our modern society. Everybody knows that…',
              right: 'It is sometimes argued that…',
              why:
                'Câu "Nowadays… very important… everybody knows" bị dùng mòn tới mức giám khảo nhận ra ngay là '
                + 'câu học thuộc, mà lại không mang thông tin gì và tốn 25 từ.',
            },
          },
        ],
        practice: [
          'Viết mở bài cho 6 đề khác nhau, mỗi cái đúng 2 câu và trong 4 phút.',
          'Kiểm: câu 1 có dùng lại quá 3 từ liên tiếp của đề không? Nếu có thì chưa đạt paraphrase.',
        ],
      },
      {
        id: 'o2-3',
        n: 18,
        title: 'Task 1 Academic: câu mở và câu tổng quan',
        goal: 'Viết đúng hai câu bắt buộc của mọi bài Task 1.',
        blocks: [
          {
            formula: 'Câu mở = viết lại đề · Câu tổng quan = "Overall, …" + xu hướng lớn nhất, KHÔNG số liệu',
            explain:
              'Task 1 nào cũng phải có câu tổng quan (overview). Thiếu nó là bị chặn trần điểm ngay, dù phần '
              + 'số liệu chính xác hết. Câu tổng quan nêu XU HƯỚNG LỚN NHẤT hoặc điểm nổi bật nhất — và tuyệt '
              + 'đối không kèm con số cụ thể.',
            examples: [
              { en: 'Câu mở: "The table compares the means of transport used by students in 2015 and 2025."', vi: '' },
              { en: 'Tổng quan: "Overall, the motorbike remained the most common choice in both years, but it became much less popular."', vi: 'không có con số' },
              { en: 'Sai kiểu: "Overall, motorbike use fell from 62% to 40%." — có số liệu, đây là câu thân bài.', vi: '' },
            ],
            mistake: {
              wrong: 'Bỏ hẳn câu tổng quan, hoặc nhét số liệu vào câu tổng quan.',
              right: 'Luôn có "Overall, …" và câu đó KHÔNG chứa số.',
              why:
                'Đây là quy tắc cứng của Task 1. Rất nhiều bài viết đúng hết mà chỉ được 5.5 vì thiếu đúng một câu này.',
            },
          },
        ],
        practice: [
          'Với mỗi biểu đồ ở tab Viết, chỉ viết đúng hai câu: câu mở và câu tổng quan. Làm 4 lần, mỗi lần 5 phút.',
          'Kiểm lại: câu tổng quan của bạn có con số nào không? Có là phải bỏ.',
        ],
      },
      {
        id: 'o2-4',
        n: 19,
        title: 'Speaking Part 2: dùng hết 2 phút',
        goal: 'Nói liên tục đủ 2 phút thay vì hết ý sau 40 giây.',
        blocks: [
          {
            explain:
              'Mốc chặng 2 là "nói Part 2 đủ 2 phút không dừng quá 5 giây". Vấn đề của phần lớn người học không '
              + 'phải là ngữ pháp mà là HẾT Ý. Cách chữa: dùng 1 phút chuẩn bị để ghi TỪ KHOÁ theo bốn gạch đầu '
              + 'dòng của đề, rồi thêm hai phần mà đề không hỏi nhưng luôn nói được: một kỷ niệm cụ thể và cảm nghĩ.',
            examples: [
              { en: '1 phút chuẩn bị: ghi 6–8 TỪ KHOÁ, không viết câu hoàn chỉnh.', vi: 'viết câu thì lúc nói sẽ đọc, nghe rất máy móc' },
              { en: 'Nói theo bốn gạch đầu dòng của đề, mỗi gạch 2–3 câu.', vi: '' },
              { en: 'Thêm: "I remember one occasion when…" — một câu chuyện cụ thể kéo dài 30 giây.', vi: '' },
              { en: 'Kết: "That is why it means a lot to me." — cảm nghĩ.', vi: '' },
            ],
            mistake: {
              wrong: 'Viết cả câu ra giấy trong 1 phút chuẩn bị rồi đọc lại.',
              right: 'Chỉ ghi từ khoá. Giám khảo nghe ra ngay khi bạn đang đọc.',
              why:
                'Đọc từ giấy bị chấm rất thấp ở Fluency. Từ khoá thì buộc bạn phải nói thật, nghe tự nhiên hơn nhiều.',
            },
          },
        ],
        practice: [
          'Lấy 5 đề Part 2, mỗi đề: 1 phút ghi từ khoá, 2 phút nói, có ghi âm.',
          'Nghe lại và đếm: nói được bao nhiêu giây, dừng quá 5 giây mấy lần.',
        ],
      },
      {
        id: 'o2-5',
        n: 20,
        title: 'Speaking Part 3: mở rộng ý',
        goal: 'Trả lời câu hỏi trừu tượng mà không bí sau một câu.',
        blocks: [
          {
            explain:
              'Part 3 hỏi ý kiến chung về xã hội, không hỏi về bạn. Khó vì trừu tượng. Bốn cách mở rộng, dùng '
              + 'được cho gần như mọi câu hỏi.',
            examples: [
              { en: '1. Nêu hai phía: "It depends. On the one hand… On the other hand…"', vi: '' },
              { en: '2. So sánh quá khứ – hiện tại: "In the past… whereas nowadays…"', vi: '' },
              { en: '3. Cho ví dụ cụ thể: "For example, in Vietnam…"', vi: '' },
              { en: '4. Nói về hệ quả: "This means that… As a result…"', vi: '' },
            ],
            mistake: {
              wrong: 'Trả lời "Yes, I think so." rồi im.',
              right: 'Yes + lý do + ví dụ + hệ quả. Tối thiểu bốn câu cho mỗi câu hỏi Part 3.',
              why:
                'Part 3 chấm khả năng lập luận. Câu trả lời một dòng không cho giám khảo cái gì để chấm, dù nó đúng ngữ pháp.',
            },
          },
        ],
        practice: [
          'Lấy 8 câu hỏi Part 3, trả lời mỗi câu bằng ĐÚNG bốn cách mở rộng ở trên (mỗi câu một cách khác nhau).',
          'Ghi âm, nghe lại, kiểm xem mỗi câu trả lời có đủ 4 câu không.',
        ],
      },
    ],
  },
];
