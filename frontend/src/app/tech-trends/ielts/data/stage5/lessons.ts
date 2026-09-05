/**
 * Bài học chặng 5 (7.5 → 8.0) — 12 bài, 3 chủ điểm.
 *
 * Chặng này khác hẳn bốn chặng trước ở một điểm phải nói thẳng ngay từ đầu:
 * **không có kiến thức mới nào để dạy.** Người ở 7.5 đã biết đủ ngữ pháp, đủ
 * từ vựng, đủ dạng đề. Thứ còn chặn họ là ba việc, và cả 12 bài đây chỉ xoay
 * quanh ba việc đó:
 *
 *   1. **Chính xác, không chỉ đúng.** Band 7 dùng từ ĐÚNG NGHĨA; band 8 dùng
 *      từ ĐÚNG SẮC THÁI. Đây là khoảng cách lớn nhất và ít ai dạy.
 *   2. **Trả lời đúng câu được hỏi.** Phần lớn bài "viết hay mà chỉ 7.0" là
 *      bài trả lời lệch đề, không phải bài viết dở.
 *   3. **Giữ được cả hai thứ trên dưới áp lực thời gian.**
 *
 * Mọi bài đều neo vào chữ trong band descriptors bản public — vì ở chặng này,
 * đoán xem giám khảo muốn gì là cách chắc chắn nhất để đứng yên. Tài liệu đó
 * miễn phí trên ielts.org; ai học tới đây mà chưa đọc nó là đang tự bịt mắt.
 */
import type { LessonUnit } from '../types';

export const UNITS5: LessonUnit[] = [
  /* ══════════════════ CHỦ ĐIỂM 1 ══════════════════ */
  {
    id: 's5-precision',
    title: 'Chính xác, không chỉ đúng',
    subtitle: 'Bài 1–4 · Band 7 dùng từ đúng nghĩa, band 8 dùng từ đúng sắc thái',
    icon: '🎯',
    lessons: [
      {
        id: 'p1', n: 1, title: 'Ranh giới thật giữa 7.0 và 8.0',
        goal: 'Biết CHÍNH XÁC giám khảo đếm gì, để thôi luyện những thứ không được tính điểm.',
        blocks: [{
          formula: 'Band 7 · "produces frequent error-free sentences" — Band 8 · "the majority of sentences are error-free"',
          explain:
            'Hai dòng trên là chữ trong band descriptors bản public cho tiêu chí Ngữ pháp của Writing. '
            + 'Đọc kỹ sự khác nhau: band 7 là "thường xuyên có câu không lỗi"; band 8 là "PHẦN LỚN câu không lỗi".\n\n'
            + 'Đây là một tiêu chí ĐẾM ĐƯỢC, và đó là tin tốt. Bạn không cần đoán mình đang ở đâu: lấy bài viết gần '
            + 'nhất, đánh số từng câu, đánh dấu câu nào có ít nhất một lỗi. Dưới 50% câu sạch là band 6.5. Khoảng '
            + '60–70% là band 7. Trên 80% mới bắt đầu chạm band 8.\n\n'
            + 'Điều này giải thích một hiện tượng hay gặp: người viết hay mà ẩu thua người viết đơn giản mà sạch. '
            + 'Ở chặng này, viết thêm một câu phức có 20% khả năng sai là một nước đi TRỪ điểm, không phải cộng.',
          examples: [
            { en: 'Band 7 điển hình: 12 câu, 8 câu sạch (67%).', vi: 'đủ "frequent" nhưng chưa tới "majority"' },
            { en: 'Band 8 điển hình: 12 câu, 10–11 câu sạch (83–92%).', vi: 'ngưỡng thật sự phải chạm' },
            { en: 'Lỗi tính là lỗi: mạo từ thiếu/thừa, số ít–số nhiều, giới từ sai, hợp chủ–vị, thì sai.', vi: 'không có lỗi nào "nhỏ tới mức không tính"' },
          ],
          mistake: {
            wrong: 'Luyện viết câu phức hơn để "trông giống band 8".',
            right: 'Đếm tỷ lệ câu sạch trong ba bài gần nhất, rồi nâng đúng con số đó.',
            why: 'Band 8 yêu cầu "a wide range of structures" — nhưng câu đó nằm SAU vế "majority error-free". Phong phú mà sai thì không được tính; sạch mà đơn điệu thì mất ít điểm hơn nhiều.',
          },
        }, {
          explain:
            'Tiêu chí Từ vựng cũng có chữ đáng đọc chậm. Band 8: "uses a wide range of vocabulary fluently and '
            + 'flexibly to convey PRECISE meanings" và "skilfully uses uncommon lexical items but there may be '
            + 'occasional inaccuracies in word choice and collocation".\n\n'
            + 'Chữ khoá là "precise" và "skilfully". Không phải "khó", không phải "hiếm". Một từ hiếm dùng vụng thì '
            + 'rơi thẳng vào vế "inaccuracies in word choice and collocation" — tức là bị trừ ở đúng chỗ bạn tưởng '
            + 'mình đang ghi điểm.',
          examples: [
            { en: '❌ The government must ameliorate the traffic problem.', vi: '"ameliorate" đi với tình trạng/điều kiện, không đi với "problem" → dùng vụng' },
            { en: '✅ The government must ease congestion.', vi: 'từ thường, kết hợp chuẩn → được tính là chính xác' },
            { en: '✅ Conditions in the camps have improved markedly.', vi: '"ameliorate/improve conditions" mới là kết hợp tự nhiên' },
          ],
        }],
        practice: [
          'Tải band descriptors bản public (Writing và Speaking) từ ielts.org. In ra. Đây là tài liệu quan trọng nhất của cả chặng.',
          'Lấy ba bài viết gần nhất, đánh số câu, đếm tỷ lệ câu sạch của từng bài. Ghi ba con số đó lại — đó là vạch xuất phát.',
          'Với mỗi câu có lỗi, ghi loại lỗi (mạo từ / số nhiều / giới từ / thì / hợp chủ–vị). Sang bài 12 bạn sẽ cần bảng này.',
        ],
      },
      {
        id: 'p2', n: 2, title: 'Cặp từ gần nghĩa — chỗ band 7 lộ ra',
        goal: 'Chọn đúng từ trong nhóm gần nghĩa, thay vì chọn từ nghe kêu nhất.',
        blocks: [{
          explain:
            'Từ điển Việt–Anh cho bạn nhiều từ cho cùng một nghĩa tiếng Việt, và không nói cái nào dùng ở đâu. Đó là '
            + 'nguồn gốc của gần như mọi lỗi từ vựng ở band 7.5.\n\n'
            + 'Cách chữa không phải học thêm từ, mà là học theo CẶP ĐỐI CHIẾU: mỗi lần gặp một từ mới, hỏi ngay '
            + '"nó khác từ tôi đã biết ở chỗ nào?" Khác về mức độ? Khác về sắc thái tốt/xấu? Khác về việc đi với '
            + 'người hay đi với vật?',
          examples: [
            { en: 'affect (động từ, tác động) ≠ effect (danh từ, hiệu ứng) — trừ "to effect change" (hiếm, trang trọng)', vi: 'cặp bị lẫn nhiều nhất trong bài thi' },
            { en: 'economic (thuộc kinh tế) ≠ economical (tiết kiệm)', vi: 'economic growth · an economical car' },
            { en: 'historic (mang tính lịch sử, trọng đại) ≠ historical (thuộc về lịch sử)', vi: 'a historic decision · a historical document' },
            { en: 'continual (lặp đi lặp lại, có quãng nghỉ) ≠ continuous (liên tục không ngắt)', vi: 'continual interruptions · continuous monitoring' },
            { en: 'practicable (khả thi về mặt thực hiện) ≠ practical (thiết thực)', vi: 'a practicable solution · practical advice' },
            { en: 'classic (kinh điển, mẫu mực) ≠ classical (cổ điển, thuộc thời cổ)', vi: 'a classic mistake · classical music' },
          ],
          mistake: {
            wrong: 'The policy had a large affect on rural areas.',
            right: 'The policy had a large effect on rural areas. / The policy affected rural areas.',
            why: 'affect là ĐỘNG TỪ, effect là DANH TỪ. Đây là lỗi bị bắt gần như 100% vì nó nằm ở từ mang nghĩa chính của câu.',
          },
        }, {
          explain:
            'Nhóm thứ hai khó hơn: các từ cùng nghĩa nhưng khác MỨC ĐỘ CHẮC CHẮN. Ở văn học thuật, chọn sai mức độ '
            + 'chắc chắn bị coi là sai nội dung, không phải sai từ vựng.',
          examples: [
            { en: 'prove (chứng minh dứt khoát) > demonstrate (cho thấy rõ) > indicate (cho thấy) > suggest (gợi ý)', vi: 'thang chắc chắn giảm dần' },
            { en: '❌ This proves that homework is useless.', vi: 'một nghiên cứu gần như không bao giờ "prove" được điều gì' },
            { en: '✅ This suggests that homework has less effect than is often assumed.', vi: 'đúng mức độ mà bằng chứng cho phép' },
          ],
        }],
        keyWords: [
          { en: 'nuance', ipa: '/ˈnjuːɑːns/', vi: 'sắc thái' },
          { en: 'connotation', ipa: '/ˌkɒnəˈteɪʃn/', vi: 'nghĩa hàm ẩn' },
          { en: 'register', ipa: '/ˈredʒɪstə/', vi: 'văn phong, mức trang trọng' },
        ],
        practice: [
          'Lấy 10 từ "hay" bạn hay dùng trong bài viết. Với mỗi từ, tra Oxford Learner\'s Dictionaries và đọc phần ví dụ — không đọc phần định nghĩa.',
          'Tìm trong ba bài viết gần nhất mọi chỗ dùng prove / show / demonstrate. Kiểm xem bằng chứng bạn nêu có đủ mạnh cho từ bạn đã chọn không.',
        ],
      },
      {
        id: 'p3', n: 3, title: 'Kết hợp từ — thứ giám khảo nghe thấy ngay',
        goal: 'Dùng đúng cụm mà người bản xứ dùng, thay vì ghép từ đúng nghĩa lại với nhau.',
        blocks: [{
          formula: 'Học CỤM, không học TỪ. Một từ đơn gần như không có giá trị cho tới khi biết nó đi với gì.',
          explain:
            'Kết hợp từ (collocation) là chỗ bài viết lộ ra ngay rằng người viết đang dịch từ tiếng mẹ đẻ. Câu không '
            + 'sai ngữ pháp, nghĩa vẫn hiểu được, nhưng "không ai nói thế". Descriptor band 8 nhắc thẳng cụm '
            + '"inaccuracies in word choice and collocation" — nghĩa là band 8 vẫn được phép sai đôi chỗ, nhưng '
            + 'phải là ĐÔI CHỖ.\n\n'
            + 'Công cụ cho việc này là Oxford Collocations Dictionary (tra miễn phí trên mạng). Cách dùng: mỗi lần '
            + 'định viết một danh từ trừu tượng quan trọng, tra xem nó đi với ĐỘNG TỪ nào và TÍNH TỪ nào.',
          examples: [
            { en: '❌ do a mistake → ✅ make a mistake', vi: '' },
            { en: '❌ make research → ✅ conduct research / carry out research', vi: '' },
            { en: '❌ strong rain → ✅ heavy rain', vi: '' },
            { en: '❌ high experience → ✅ extensive experience', vi: '' },
            { en: '❌ raise the problem → ✅ address the problem / tackle the problem', vi: '"raise" chỉ dùng với "issue/question", không dùng với "problem" theo nghĩa giải quyết' },
            { en: '❌ open a business → ✅ set up a business / start a business', vi: '' },
            { en: '❌ take a decision (Anh-Anh chấp nhận) · ✅ make a decision', vi: 'bản Anh-Mỹ và phần lớn giám khảo quen "make"' },
          ],
          mistake: {
            wrong: 'The government should make more researches about this problem.',
            right: 'The government should conduct further research into this problem.',
            why: 'Ba lỗi trong một câu ngắn: sai động từ đi kèm (make → conduct), "research" không đếm được nên không có -s, và giới từ đúng là "research INTO" chứ không phải "about".',
          },
        }],
        keyWords: [
          { en: 'conduct research into', ipa: '/kənˈdʌkt rɪˈsɜːtʃ ˈɪntuː/', vi: 'tiến hành nghiên cứu về' },
          { en: 'address a problem', ipa: '/əˈdres ə ˈprɒbləm/', vi: 'giải quyết một vấn đề' },
          { en: 'draw a distinction', ipa: '/drɔː ə dɪˈstɪŋkʃn/', vi: 'vạch ra một sự phân biệt' },
          { en: 'place emphasis on', ipa: '/pleɪs ˈemfəsɪs ɒn/', vi: 'đặt trọng tâm vào' },
        ],
        practice: [
          'Chọn 8 danh từ trừu tượng bạn dùng nhiều nhất (problem, research, policy, impact, evidence, growth, access, awareness). Tra mỗi từ trên Oxford Collocations Dictionary, ghi 3 động từ và 3 tính từ hay đi cùng.',
          'Viết lại một đoạn cũ, thay mọi cụm bạn đã tự ghép bằng cụm tra được. So hai bản đọc lên thành tiếng.',
        ],
      },
      {
        id: 'p4', n: 4, title: 'Từ ít gặp — dùng KHÉO, không dùng nhiều',
        goal: 'Biết chỗ nào đáng đặt một từ ít gặp, và chỗ nào đặt vào là hỏng.',
        blocks: [{
          explain:
            'Descriptor band 8 dùng đúng chữ "skilfully uses uncommon lexical items". Chữ "skilfully" mới là điều kiện, '
            + 'không phải chữ "uncommon". Rất nhiều người đọc dòng này thành "phải nhồi từ hiếm" rồi tụt điểm.\n\n'
            + 'Quy tắc dùng được ngay: **một từ ít gặp chỉ đáng dùng khi nó thay được cả một cụm dài, và bạn đã thấy '
            + 'nó trong văn cảnh thật ít nhất ba lần.** Nếu chỉ mới gặp trong danh sách từ vựng, đừng đưa vào bài thi.',
          examples: [
            { en: '✅ mitigate = làm dịu bớt (mitigate the impact of…) — thay được "make the effects less serious"', vi: 'đáng dùng: gọn hơn hẳn' },
            { en: '✅ disproportionate = không tương xứng về tỷ lệ (a disproportionate share of…)', vi: 'đáng dùng: không có cách nói ngắn hơn' },
            { en: '❌ plethora, myriad, panacea, ubiquitous', vi: 'bốn từ bị dùng sai nhiều nhất trong bài thi IELTS — nghe kêu, gần như luôn đặt sai chỗ' },
            { en: '❌ In this modern era, a plethora of people utilise the internet.', vi: 'ba từ "sang" trong một câu, cả ba đều sai văn phong → mất điểm ở đúng chỗ tưởng được điểm' },
            { en: '✅ Most people now use the internet for tasks that once required an office visit.', vi: 'từ thường, nội dung cụ thể hơn, ăn điểm hơn' },
          ],
          mistake: {
            wrong: 'Nhồi 5–6 từ hiếm vào mỗi bài để "chứng minh vốn từ".',
            right: 'Mỗi đoạn tối đa 1–2 chỗ dùng từ ít gặp, và chỉ ở chỗ nó gọn hơn cách nói thường.',
            why: 'Giám khảo chấm độ CHÍNH XÁC, không đếm số từ hiếm. Một từ dùng vụng làm hỏng ấn tượng của cả đoạn nhanh hơn nhiều so với việc một từ dùng khéo cứu được nó.',
          },
        }],
        practice: [
          'Lập danh sách từ hiếm bạn đang cố dùng. Với mỗi từ, tự hỏi: tôi đã gặp nó trong văn bản thật mấy lần? Dưới ba lần thì gạch khỏi danh sách thi.',
          'Đọc lại bài gần nhất, gạch mọi từ "sang". Với từng từ, thử thay bằng từ thường nhất có thể — nếu câu không xấu đi thì từ đó đang không làm việc gì.',
        ],
      },
    ],
  },

  /* ══════════════════ CHỦ ĐIỂM 2 ══════════════════ */
  {
    id: 's5-response',
    title: 'Trả lời đúng câu được hỏi',
    subtitle: 'Bài 5–8 · Phần lớn bài "viết hay mà 7.0" là bài lệch đề',
    icon: '🧭',
    lessons: [
      {
        id: 'p5', n: 5, title: 'Đọc đề tới cùng — bốn kiểu đề và bẫy riêng',
        goal: 'Nhận ra chính xác đề đang hỏi gì trước khi viết chữ nào.',
        blocks: [{
          explain:
            'Tiêu chí Task Response nặng ngang ba tiêu chí còn lại cộng lại về mặt ảnh hưởng: lệch đề thì trần điểm '
            + 'của cả bài bị chặn, viết hay đến mấy cũng không gỡ được. Band 8 yêu cầu "sufficiently addresses ALL '
            + 'parts of the task" — chữ ALL là chỗ mất điểm.\n\n'
            + 'Bốn kiểu đề Task 2, và bẫy của từng kiểu:',
          examples: [
            { en: 'Opinion (To what extent do you agree?) — bẫy: trả lời nửa vời, không nêu rõ lập trường.', vi: 'phải nói rõ đồng ý ở mức nào, và giữ nguyên mức đó tới cuối bài' },
            { en: 'Discussion (Discuss both views and give your own opinion) — bẫy: quên vế "your own opinion".', vi: 'thiếu ý kiến riêng là mất hẳn một phần của đề → không thể tới band 7' },
            { en: 'Problem–Solution (What problems… What solutions…) — bẫy: giải pháp không khớp với vấn đề vừa nêu.', vi: 'mỗi giải pháp phải trỏ về đúng một vấn đề đã nêu' },
            { en: 'Two-part (Why is this happening? Is it a positive or negative development?) — bẫy: trả lời vế đầu, bỏ quên vế sau.', vi: 'đề hai vế thì thân bài phải có hai phần rõ rệt' },
          ],
          mistake: {
            wrong: 'Đọc đề, thấy chủ đề quen (giáo dục / môi trường), viết luôn bài về chủ đề đó.',
            right: 'Gạch chân TỪ HỎI và mọi hạn định trong đề, viết lại đề bằng lời mình trước khi lập dàn ý.',
            why: 'Đề gần như luôn có hạn định: "in developing countries", "for young children", "in the workplace". Bỏ qua một hạn định là trả lời một câu hỏi khác với câu được hỏi.',
          },
        }, {
          explain:
            'Một mẹo kiểm rất nhanh, làm trong 30 giây trước khi viết: đọc câu hỏi của đề, rồi đọc dàn ý của bạn, và '
            + 'hỏi "nếu chỉ đọc dàn ý này, người ta có đoán lại được câu hỏi gốc không?" Không đoán được thì dàn ý '
            + 'đang lệch — sửa lúc này mất 1 phút, sửa sau khi viết xong thì không sửa được nữa.',
          examples: [
            { en: 'Đề: Some people think universities should only offer subjects useful in the future, such as science. To what extent do you agree?', vi: '' },
            { en: '❌ Dàn ý lệch: lợi ích của khoa học · lợi ích của nghệ thuật · kết luận cân bằng', vi: 'đây là bài "so sánh hai ngành", không trả lời "có nên CHỈ dạy môn hữu ích"' },
            { en: '✅ Dàn ý đúng: vì sao lập luận "chỉ dạy môn hữu ích" có lý · vì sao chữ "chỉ" làm nó sai · lập trường: đồng ý một phần, phản đối tính độc quyền', vi: 'bám vào chữ "only", tức là chỗ đề thật sự hỏi' },
          ],
        }],
        practice: [
          'Lấy 10 đề Task 2 bất kỳ. Với mỗi đề, chỉ làm một việc: phân loại kiểu đề và gạch chân mọi hạn định. Không viết bài.',
          'Với 3 đề trong số đó, lập dàn ý rồi áp phép kiểm 30 giây ở trên.',
        ],
      },
      {
        id: 'p6', n: 6, title: '"Extended and supported" nghĩa là gì',
        goal: 'Phát triển một ý tới đủ độ sâu của band 8, thay vì nêu nhiều ý nông.',
        blocks: [{
          formula: 'Ý → vì sao → cơ chế cụ thể → hệ quả · Bốn bước, một ý. KHÔNG phải bốn ý.',
          explain:
            'Descriptor band 8 cho Task Response: "presents a well-developed response to the question with relevant, '
            + 'EXTENDED and SUPPORTED ideas". Hai chữ đó có nghĩa rất cụ thể mà ít ai được giải thích:\n\n'
            + '**Extended** = ý được kéo dài bằng lập luận, không phải bằng cách nhắc lại. '
            + '**Supported** = có ví dụ hoặc cơ chế cụ thể, không phải "ví dụ, nhiều nghiên cứu đã chứng minh".\n\n'
            + 'Lỗi phổ biến nhất ở band 7 là nêu BỐN ý, mỗi ý hai câu. Band 8 nêu HAI ý, mỗi ý bốn câu. Cùng độ dài, '
            + 'khác hẳn điểm.',
          examples: [
            { en: '❌ Nông: Public transport reduces traffic. It also protects the environment. Moreover, it saves money.', vi: 'ba ý, không ý nào được phát triển — đây là band 6.0–6.5 dù câu không sai gì' },
            { en: '✅ Sâu: Public transport reduces congestion, but only where it is frequent enough to be chosen over driving.', vi: 'ý + hạn định (đây là chỗ band 8 bắt đầu)' },
            { en: '  A bus every ten minutes changes behaviour; a bus every hour does not, because the waiting cost outweighs the fare saving.', vi: 'cơ chế cụ thể, có con số' },
            { en: '  This is why cities that add routes without adding frequency often see ridership stay flat.', vi: 'hệ quả kiểm chứng được → "supported"' },
          ],
          mistake: {
            wrong: 'For example, a study has shown that public transport is good for cities.',
            right: 'A bus every ten minutes changes behaviour; a bus every hour does not.',
            why: '"Một nghiên cứu đã cho thấy" là ví dụ GIẢ — không ai kiểm được, và giám khảo đọc hàng nghìn bài nên nhận ra ngay. Cơ chế cụ thể luôn mạnh hơn nghiên cứu bịa.',
          },
        }],
        practice: [
          'Lấy một bài Task 2 cũ. Đếm số ý chính trong thân bài. Nếu quá ba, viết lại còn hai ý và kéo mỗi ý ra bốn câu theo công thức trên.',
          'Tìm mọi chỗ bạn viết "many studies have shown" hoặc "research proves". Thay từng chỗ bằng một cơ chế cụ thể mà bạn tự giải thích được.',
        ],
      },
      {
        id: 'p7', n: 7, title: 'Lập trường nhất quán từ đầu tới cuối',
        goal: 'Không tự mâu thuẫn giữa mở bài, thân bài và kết bài — lỗi âm thầm nhất ở band 7.',
        blocks: [{
          explain:
            'Đây là lỗi khó tự thấy nhất, vì mỗi đoạn đọc riêng đều ổn. Nó chỉ lộ ra khi đọc cả bài liền mạch: mở bài '
            + 'nói "phần lớn đồng ý", thân bài thứ hai lại phản biện mạnh tới mức nghe như không đồng ý, kết bài quay '
            + 'về "cần cân bằng cả hai".\n\n'
            + 'Giám khảo đọc cả bài, nên họ thấy. Trong Coherence và trong Task Response, bài tự mâu thuẫn bị chặn ở '
            + '6.5–7.0 dù từng đoạn viết tốt.\n\n'
            + 'Cách chữa dứt điểm: viết lập trường thành MỘT CÂU trước khi viết bài, đặt câu đó ở đầu tờ nháp, và mỗi '
            + 'khi bắt đầu một đoạn mới thì đọc lại nó.',
          examples: [
            { en: 'Câu lập trường: "Tôi đồng ý phần lớn, nhưng phản đối tính độc quyền của chữ ONLY."', vi: 'một câu, ghi ra nháp trước khi viết' },
            { en: 'Mở bài phải khớp: While there is a strong case for prioritising practical subjects, restricting universities to them alone would be a mistake.', vi: '' },
            { en: 'Đoạn nhượng bộ vẫn phải giữ hướng: The argument has real force — graduates do need employable skills…', vi: 'nhượng bộ, nhưng không đổi phe' },
            { en: 'Kết bài không được "cân bằng chung chung": …should therefore expand practical provision without eliminating the rest.', vi: 'lặp lại đúng lập trường ban đầu, bằng từ khác' },
          ],
          mistake: {
            wrong: 'Kết bài kiểu "In conclusion, both sides have advantages and disadvantages, so we should balance them."',
            right: 'Kết bài nhắc lại đúng lập trường đã nêu ở mở bài, bằng cách diễn đạt khác.',
            why: 'Kết bài cân bằng chung chung là dấu hiệu rõ nhất của bài không có lập trường. Nó xoá đi chính thứ Task Response đang chấm.',
          },
        }],
        practice: [
          'Lấy ba bài cũ. Với mỗi bài, đọc RIÊNG mở bài và kết bài, bỏ qua thân bài. Hai đoạn đó có nói cùng một điều không?',
          'Tập viết câu lập trường một dòng cho 5 đề khác nhau. Chỉ viết câu đó, không viết bài — 10 phút cho cả 5 đề.',
        ],
      },
      {
        id: 'p8', n: 8, title: 'Task 1 ở mức 8.0 — chọn lọc mới là kỹ năng',
        goal: 'Viết Task 1 mà người đọc hiểu được biểu đồ mà không cần nhìn biểu đồ.',
        blocks: [{
          formula: 'Overview = điều lớn nhất nhìn ra được KHÔNG có số · Thân bài = số liệu chứng minh cho overview đó',
          explain:
            'Task 1 band 8 khác band 7 ở một chỗ duy nhất mà ai cũng bỏ qua: **chọn lọc**. Descriptor dùng chữ '
            + '"selecting and reporting the main features" — chữ SELECTING đứng trước. Liệt kê đủ mọi con số là làm '
            + 'ngược lại yêu cầu.\n\n'
            + 'Overview phải nêu được xu hướng bao trùm, thứ tự lớn nhỏ, và điểm bất thường nếu có — tất cả KHÔNG '
            + 'kèm con số. Số liệu để dành cho thân bài, và mỗi số đưa vào phải phục vụ một so sánh.',
          examples: [
            { en: '❌ Overview kém: The chart shows four countries between 2000 and 2020.', vi: 'nhắc lại đề, không nêu được gì' },
            { en: '✅ Overview tốt: Overall, all four countries saw rising figures, but the gap between the highest and lowest widened considerably, and only Japan reversed direction after 2015.', vi: 'xu hướng chung + so sánh + điểm bất thường, không một con số nào' },
            { en: '❌ Thân bài kém: Japan was 20% in 2000, 25% in 2005, 31% in 2010, 34% in 2015 and 29% in 2020.', vi: 'đọc lại bảng số — không có so sánh nào' },
            { en: '✅ Thân bài tốt: Japan rose steadily to a peak of 34% in 2015 before falling back to 29%, the only country to end the period below its own peak.', vi: 'cùng số liệu, nhưng mỗi số phục vụ một nhận định' },
          ],
          mistake: {
            wrong: 'Nêu hết mọi con số trong biểu đồ để "đầy đủ".',
            right: 'Chọn số cao nhất, thấp nhất, chỗ giao nhau, chỗ đổi chiều — bỏ phần còn lại.',
            why: 'Task 1 chỉ có 150 từ và 20 phút. Dùng chỗ đó để liệt kê là mất chỗ cho so sánh, mà so sánh mới là thứ được chấm.',
          },
        }],
        practice: [
          'Lấy 5 biểu đồ Task 1. Với mỗi cái, chỉ viết ĐÚNG câu overview — không viết phần còn lại. 3 phút mỗi cái.',
          'Đưa bài Task 1 của bạn cho người chưa nhìn biểu đồ. Hỏi họ vẽ lại hình dạng chung của biểu đồ. Vẽ sai nghĩa là overview chưa đạt.',
        ],
      },
    ],
  },

  /* ══════════════════ CHỦ ĐIỂM 3 ══════════════════ */
  {
    id: 's5-pressure',
    title: 'Giữ được chất lượng dưới áp lực',
    subtitle: 'Bài 9–12 · Biết làm đúng mà hết giờ thì vẫn là không làm được',
    icon: '⏱️',
    lessons: [
      {
        id: 'p9', n: 9, title: 'Quy trình 40 phút cho Task 2',
        goal: 'Có một quy trình cố định theo đồng hồ, để không phải quyết định gì trong phòng thi.',
        blocks: [{
          formula: '5 phút phân tích + dàn ý · 30 phút viết · 5 phút soát — cố định, không linh hoạt',
          explain:
            'Ở band 7.5 bạn viết được bài band 8 khi có thời gian. Thứ chặn bạn trong phòng thi là quyết định: viết ý '
            + 'nào trước, có nên đổi hướng không, còn bao lâu. Quy trình cố định xoá hết những quyết định đó.\n\n'
            + '**5 phút đầu** — phân loại đề, gạch hạn định, viết câu lập trường một dòng, ghi 2 ý chính kèm 1 cơ chế '
            + 'cụ thể cho mỗi ý. Không viết câu hoàn chỉnh nào.\n\n'
            + '**30 phút viết** — mở bài 4 phút, hai đoạn thân mỗi đoạn 11 phút, kết bài 4 phút. Không quay lại sửa '
            + 'trong lúc viết; thấy sai thì ghi nhớ, để dành 5 phút cuối.\n\n'
            + '**5 phút soát** — chỉ soát bốn thứ, theo đúng thứ tự này: mạo từ · số ít/số nhiều · thì · hợp chủ–vị. '
            + 'Không đọc lại để "thấy hay hơn" — sẽ không kịp và thường làm hỏng.',
          examples: [
            { en: 'Soát theo LOẠI LỖI, không đọc trôi.', vi: 'quét riêng từng loại bắt được nhiều lỗi hơn hẳn đọc một lượt' },
            { en: 'Lượt 1: chỉ nhìn danh từ — có thiếu/thừa mạo từ không?', vi: '' },
            { en: 'Lượt 2: chỉ nhìn danh từ số nhiều và động từ theo sau.', vi: '' },
            { en: 'Lượt 3: chỉ nhìn thì của động từ.', vi: '' },
          ],
          mistake: {
            wrong: 'Viết xong Task 2 rồi mới quay lại làm Task 1 vì "Task 2 nhiều điểm hơn".',
            right: 'Task 1 trước, đúng 20 phút, rồi chuyển. Task 2 cần 40 phút trọn vẹn chứ không phải phần thừa.',
            why: 'Task 2 chiếm 2/3 điểm phần Writing, nhưng Task 1 vẫn chiếm 1/3. Bỏ Task 1 dở dang là mất nhiều hơn phần thời gian tiết kiệm được.',
          },
        }],
        practice: [
          'Viết 5 bài Task 2 với đồng hồ đếm ngược đúng 40 phút, ngồi đúng tư thế phòng thi, không tra từ điển.',
          'Sau mỗi bài, ghi lại bạn đã LỆCH quy trình ở chỗ nào (thường là dùng quá 5 phút cho dàn ý).',
        ],
      },
      {
        id: 'p10', n: 10, title: 'Nghe và đọc ở tốc độ vượt đề thi',
        goal: 'Làm cho đề thi trở nên dễ, thay vì luyện cho vừa đủ với đề thi.',
        blocks: [{
          explain:
            'Từ 7.5 lên 8.0 ở Nghe và Đọc là chuyện của BIÊN AN TOÀN. Band 8 Listening cần 35/40 — chỉ sai 5 câu cho '
            + 'cả bốn phần. Ai luyện vừa đúng độ khó đề thi sẽ dao động quanh 32–35 và phụ thuộc vào việc hôm đó đề dễ '
            + 'hay khó. Ai luyện ở mức khó hơn đề thi thì 35 trở thành sàn, không phải trần.\n\n'
            + 'Nghe: bỏ tài liệu luyện thi, chuyển sang BBC Radio 4, podcast học thuật, bài giảng đại học mở. Nghe một '
            + 'lần, tóm tắt bằng lời mình, rồi mới đối chiếu transcript.\n\n'
            + 'Đọc: The Economist, Nature news, Aeon, long reads của The Guardian. Bấm giờ 900 từ trong 9 phút rồi tự '
            + 'tóm tắt lập luận của bài — mục tiêu là tốc độ CÓ HIỂU, không phải đọc lướt.',
          examples: [
            { en: 'Chuẩn tốc độ cần đạt: đọc hiểu 130–150 từ/phút với văn bản học thuật.', vi: 'passage 3 khoảng 900 từ → dưới 7 phút đọc, còn lại để làm câu hỏi' },
            { en: 'Phân bổ Reading: 17 phút passage 1 · 20 phút passage 2 · 23 phút passage 3.', vi: 'passage 3 khó nhất nên được nhiều thời gian nhất' },
            { en: 'Nghe: mục tiêu là hiểu được giọng Úc, Scotland và Ireland, không chỉ giọng Anh chuẩn.', vi: 'đề thi dùng nhiều giọng — đây là chỗ mất điểm bất ngờ nhất' },
          ],
          mistake: {
            wrong: 'Làm thêm đề Cambridge để "quen đề hơn".',
            right: 'Làm ít đề hơn, nhưng nghe/đọc tài liệu KHÓ HƠN đề mỗi ngày.',
            why: 'Ở 7.5 bạn đã quen đề rồi. Cày thêm đề chỉ đo lại điều đã biết; nâng độ khó nguồn vào mới dịch được con số.',
          },
        }],
        practice: [
          'Mỗi ngày: 1 bài đọc ngoài đề 900–1.200 từ, bấm giờ, tự tóm tắt lập luận trong 3 câu trước khi đọc lại.',
          'Mỗi ngày: 15 phút nghe không phụ đề nguồn ngoài đề, tóm tắt bằng lời mình, sau đó mới xem transcript.',
          'Mỗi tuần: một đề đầy đủ có bấm giờ để đo. Chỉ MỘT đề — phần còn lại của tuần dành cho nguồn khó hơn.',
        ],
      },
      {
        id: 'p11', n: 11, title: 'Nói tự nhiên: ngập ngừng đúng chỗ',
        goal: 'Đạt tiêu chí "hesitation is content-related" thay vì cố nói liền mạch không nghỉ.',
        blocks: [{
          explain:
            'Descriptor Speaking band 8 cho Fluency có một dòng rất giải phóng: "speaks fluently with only occasional '
            + 'repetition or self-correction; HESITATION IS USUALLY CONTENT-RELATED, and only rarely to search for '
            + 'language".\n\n'
            + 'Nghĩa là: **được phép dừng lại để nghĩ.** Điều bị trừ điểm là dừng lại để TÌM TỪ. Hai kiểu dừng nghe '
            + 'rất khác nhau, và giám khảo phân biệt được ngay.\n\n'
            + 'Ngập ngừng vì nội dung nghe như: "Hmm, that\'s a harder question than it sounds — let me think about '
            + 'the second part." Ngập ngừng vì ngôn ngữ nghe như: "The… the… how do you say… the thing that…".',
          examples: [
            { en: '✅ That is an interesting way to put it. I want to think about the second half of that.', vi: 'dừng vì nội dung — được tính là dấu hiệu tư duy' },
            { en: '✅ I have not thought about this before, so let me reason through it out loud.', vi: 'thành thật, và cho bạn 3 giây suy nghĩ hợp lệ' },
            { en: '❌ The… ummm… the people who… the… you know…', vi: 'dừng vì tìm từ — bị trừ' },
            { en: '✅ Cách cứu khi bí từ: nói vòng, đừng dừng. "the people who make those decisions — whatever the official term is"', vi: 'paraphrase là kỹ năng được nêu thẳng trong descriptor band 8' },
          ],
          mistake: {
            wrong: 'Học thuộc câu trả lời để nói liền mạch không nghỉ.',
            right: 'Nói tự nhiên, dừng khi cần nghĩ, và nói rõ là mình đang nghĩ về cái gì.',
            why: 'Câu học thuộc có nhịp đều và ngữ điệu phẳng, giám khảo nhận ra ngay và Fluency bị trừ. Một chỗ ngập ngừng thật lòng ăn điểm hơn một đoạn trôi chảy thuộc lòng.',
          },
        }, {
          explain:
            'Phần thứ hai của band 8 Speaking là Pronunciation, và ở đây tiêu chí là "L1 accent has minimal effect on '
            + 'intelligibility" — **không yêu cầu bỏ giọng Việt.** Giữ giọng vẫn được band 8; điều kiện là người nghe '
            + 'không phải cố gắng.\n\n'
            + 'Ba thứ ảnh hưởng tới việc "người nghe có phải cố hay không", theo đúng thứ tự quan trọng: phụ âm cuối, '
            + 'trọng âm từ, và ngữ điệu câu. Giọng vùng miền gần như không ảnh hưởng.',
          examples: [
            { en: 'Phụ âm cuối: "he work" vs "he works" — mất /s/ là mất luôn ngữ pháp người nghe cần.', vi: 'quan trọng nhất với người Việt' },
            { en: 'Trọng âm từ: ˈcomfortable, ˈcomparable, deˈvelopment, phoˈtographer.', vi: 'sai trọng âm làm từ trở nên khó nhận ra hơn cả phát âm sai âm' },
            { en: 'Ngữ điệu: nhấn vào từ mang THÔNG TIN MỚI, hạ giọng ở phần đã biết.', vi: 'nói đều một nhịp là lỗi phổ biến nhất ở người đã trôi chảy' },
          ],
        }],
        practice: [
          'Thu âm 3 câu trả lời Part 3, nghe lại và đánh dấu mọi chỗ dừng. Phân loại từng chỗ: dừng vì nội dung hay vì tìm từ?',
          'Tập 5 câu "câu giờ hợp lệ" cho tới khi bật ra tự nhiên. Đó là lưới an toàn để không bao giờ phải dừng vì tìm từ.',
          'Shadowing 10 phút/ngày với một podcast học thuật — nhại cả ngữ điệu, không chỉ từ.',
        ],
      },
      {
        id: 'p12', n: 12, title: 'Nhật ký lỗi — công cụ quan trọng nhất của chặng',
        goal: 'Biến lỗi lặp thành danh sách hữu hạn rồi diệt từng cái, thay vì mong "viết nhiều sẽ hết sai".',
        blocks: [{
          formula: 'Lỗi → phân loại → đếm tần suất → diệt loại nhiều nhất trước',
          explain:
            'Đây là bài quan trọng nhất trong 12 bài, và cũng là bài ít người làm nhất vì nó không giống "học".\n\n'
            + 'Sự thật đằng sau: lỗi của bạn KHÔNG ngẫu nhiên. Một người viết ở 7.5 thường chỉ có 5–8 loại lỗi lặp đi '
            + 'lặp lại, và ba loại đầu chiếm quá nửa số lỗi. Diệt được ba loại đó là đủ đưa tỷ lệ câu sạch từ 70% lên '
            + 'trên 85% — đúng khoảng cách 7.0 → 8.0.\n\n'
            + 'Cách vận hành, mỗi bài viết mất thêm 10 phút:',
          examples: [
            { en: '1. Sau mỗi bài được chấm, chép MỌI lỗi vào một bảng: câu sai · câu đúng · loại lỗi.', vi: '' },
            { en: '2. Loại lỗi ghi bằng nhãn cố định: MẠO TỪ · SỐ NHIỀU · GIỚI TỪ · THÌ · HỢP CHỦ VỊ · KẾT HỢP TỪ · CHÍNH TẢ.', vi: 'nhãn cố định mới đếm được' },
            { en: '3. Cuối tuần đếm số lần mỗi nhãn xuất hiện. Xếp thứ tự.', vi: '' },
            { en: '4. Tuần sau: TRƯỚC khi viết, đọc lại ba nhãn đứng đầu. Sau khi viết, chỉ soát ba nhãn đó.', vi: 'soát có trọng điểm bắt được nhiều hơn soát chung' },
            { en: '5. Một nhãn không xuất hiện trong ba bài liên tiếp thì gạch khỏi danh sách soát.', vi: 'danh sách phải ngắn dần — đó là bằng chứng bạn đang tiến' },
          ],
          mistake: {
            wrong: 'Đọc lại góp ý của người chấm, gật đầu, rồi viết bài tiếp theo.',
            right: 'Chép lỗi vào bảng, phân nhãn, đếm, và VIẾT LẠI chính bài đó sau khi sửa.',
            why: 'Viết lại bài cũ có giá trị hơn viết bài mới ở chặng này. Bài mới tạo ra lỗi mới; bài viết lại chứng minh bạn đã diệt được lỗi cũ.',
          },
        }],
        practice: [
          'Lập bảng nhật ký lỗi ngay hôm nay, kể cả khi mới chỉ có một bài được chấm.',
          'Với ba bài viết gần nhất: chép mọi lỗi vào bảng, phân nhãn, đếm. Ba nhãn đứng đầu chính là kế hoạch học của tháng tới.',
          'Quy tắc cứng cho cả chặng: cứ hai bài mới thì viết lại một bài cũ theo góp ý đã nhận.',
        ],
      },
    ],
  },
];
