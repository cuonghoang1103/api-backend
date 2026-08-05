/**
 * Bài tập chặng 3 — 100 câu, 5 câu mỗi bài.
 *
 * Tỉ trọng lệch hẳn về `fix` so với chặng 2, và các câu `fix` ở đây KHÔNG còn
 * là lỗi ngữ pháp thô mà là những câu "đúng nhưng chưa đạt": kết hợp từ vụng,
 * câu chạy, từ rỗng, câu dài rối. Đó đúng là loại lỗi giữ người học ở 5.5–6.0.
 */
import type { ExerciseSet } from '../types';

export const EXERCISES3: ExerciseSet[] = [
  /* ── Chủ điểm 1: tự chấm & tự sửa ── */
  {
    lessonId: 'm1',
    items: [
      { kind: 'choice', q: 'Vì sao viết 50 bài mà không sửa lại không giúp tiến bộ?', options: ['Vì mỗi bài lặp lại đúng lỗi cũ, thành 50 lần luyện lỗi', 'Vì viết nhiều gây mệt', 'Vì đề khác nhau', 'Vì thiếu từ vựng'], answer: 'Vì mỗi bài lặp lại đúng lỗi cũ, thành 50 lần luyện lỗi', why: 'Không ai chỉ lỗi thì bài sau lặp lại lỗi bài trước. Lỗi được luyện thành phản xạ.' },
      { kind: 'choice', q: 'Việc nào tạo tiến bộ THẬT?', options: ['Viết 1 bài + sửa kỹ + viết lại', 'Viết 5 bài không sửa', 'Đọc 5 bài mẫu', 'Học thuộc 1 bài mẫu'], answer: 'Viết 1 bài + sửa kỹ + viết lại', why: 'Viết lại là bước duy nhất khiến TAY thực hiện phiên bản đúng.' },
      { kind: 'fix', q: 'Cities has many problem, so government should build more road.', hint: 'Bốn lỗi: hợp chủ–vị, hai chỗ số nhiều, thiếu mạo từ.', answer: 'Cities have many problems, so governments should build more roads.', why: 'Đây là kiểu câu nếu không ai chỉ ra thì bạn lặp lại suốt 50 bài.' },
      { kind: 'choice', q: 'Người học chăm chỉ nhất đôi khi kẹt lâu nhất vì sao?', options: ['Họ viết nhiều nhất nên khắc sâu lỗi nhất', 'Họ lười ôn', 'Họ học sai sách', 'Họ thi quá sớm'], answer: 'Họ viết nhiều nhất nên khắc sâu lỗi nhất', why: 'Chăm chỉ mà sai cách thì càng chăm càng khó sửa.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Viết lại quan trọng hơn viết mới.', answer: 'Rewriting matters more than writing something new.', alt: ['Rewriting is more important than writing new essays.'], why: 'Câu tóm tắt cả chủ điểm này.' },
    ],
  },
  {
    lessonId: 'm2',
    items: [
      { kind: 'choice', q: 'Writing được chấm theo mấy tiêu chí?', options: ['4 tiêu chí, mỗi cái 25%', '2 tiêu chí', '3 tiêu chí', '5 tiêu chí'], answer: '4 tiêu chí, mỗi cái 25%', why: 'Task Response · Coherence · Lexical Resource · Grammar. Mỗi cái 25%.' },
      { kind: 'choice', q: 'Tiêu chí nào NÂNG ĐIỂM NHANH nhất vì không đòi vốn từ?', options: ['Coherence — chia đoạn, câu chủ đề, từ nối', 'Lexical Resource', 'Grammar', 'Không tiêu chí nào'], answer: 'Coherence — chia đoạn, câu chủ đề, từ nối', why: 'Đây thuộc về cách trình bày, sửa được ngay hôm nay.' },
      { kind: 'choice', q: 'Câu hỏi nào KHÔNG thuộc tiêu chí Task Response?', options: ['Có từ nào lặp quá 3 lần không?', 'Trả lời đủ mọi vế của đề chưa?', 'Có đủ số từ chưa?', 'Mỗi ý có ví dụ chưa?'], answer: 'Có từ nào lặp quá 3 lần không?', why: 'Lặp từ thuộc Lexical Resource, không thuộc Task Response.' },
      { kind: 'choice', q: 'Tự chấm bằng cảm giác có vấn đề gì?', options: ['Luôn cao hơn thực tế, và chỉ nhìn một tiêu chí', 'Mất thời gian', 'Quá khắt khe', 'Không có vấn đề gì'], answer: 'Luôn cao hơn thực tế, và chỉ nhìn một tiêu chí', why: 'Cảm giác "viết hay" thường đến từ dùng từ khó — một phần của MỘT tiêu chí trên bốn.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Mỗi đoạn nên có một câu chủ đề ở đầu.', answer: 'Each paragraph should have a topic sentence at the beginning.', why: 'Đây là câu hỏi số 2 trong bảng tự chấm.' },
    ],
  },
  {
    lessonId: 'm3',
    items: [
      { kind: 'choice', q: 'Sổ lỗi cá nhân nên có ba cột nào?', options: ['Câu sai — câu đúng — LOẠI lỗi', 'Ngày — điểm — nhận xét', 'Đề bài — bài viết — điểm', 'Từ mới — nghĩa — ví dụ'], answer: 'Câu sai — câu đúng — LOẠI lỗi', why: 'Cột LOẠI lỗi mới cho biết phải luyện gì.' },
      { kind: 'fix', q: 'I very like this idea.', hint: 'Sai trật tự trạng từ.', answer: 'I like this idea very much.', why: '"very" không bổ nghĩa trực tiếp cho động từ. Đây là lỗi lặp kinh điển của người Việt.' },
      { kind: 'fix', q: 'Despite of the rain, the event went ahead.', hint: 'Thừa một từ.', answer: 'Despite the rain, the event went ahead.', alt: ['In spite of the rain, the event went ahead.'], why: '"despite" KHÔNG có "of". "in spite of" mới có.' },
      { kind: 'choice', q: 'Mỗi người thường lặp khoảng bao nhiêu lỗi?', options: ['8–12 lỗi', '50 lỗi', '2 lỗi', 'Không đếm được'], answer: '8–12 lỗi', why: 'Tìm ra và diệt từng cái nhanh hơn nhiều so với đọc sách ngữ pháp từ đầu.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi đọc lại sổ lỗi trước mỗi lần viết.', answer: 'I read my error log before I write.', alt: ['I review my error log before writing.'], why: 'Chú ý sau "before" dùng V-ing hoặc mệnh đề đủ.' },
    ],
  },
  {
    lessonId: 'm4',
    items: [
      { kind: 'choice', q: 'Vì sao viết lại hiệu quả hơn đọc lời giải thích?', options: ['Vì TAY thực hiện phiên bản đúng, tạo phản xạ', 'Vì mất nhiều thời gian hơn', 'Vì bài dài hơn', 'Vì giáo viên yêu cầu'], answer: 'Vì TAY thực hiện phiên bản đúng, tạo phản xạ', why: 'Đọc thì chỉ MẮT làm việc. Viết lại mới tạo phản xạ.' },
      { kind: 'choice', q: 'Sửa bài đúng cách là gì?', options: ['Viết lại CẢ CÂU và nâng cấp cấu trúc', 'Chỉ sửa đúng chữ bị sai', 'Đánh dấu lỗi rồi để đó', 'Viết lại cả bài từ đầu'], answer: 'Viết lại CẢ CÂU và nâng cấp cấu trúc', why: 'Sửa một chữ thì không luyện được gì; viết lại cả câu chỉ tốn thêm mười giây.' },
      { kind: 'fix', q: 'Cities has many problem, so government should build more road.', hint: 'Vừa sửa lỗi VỪA nâng cấp cấu trúc.', answer: 'Cities face a number of problems, which is why governments should invest in road infrastructure.', alt: ['Cities face many problems, which is why governments should invest in road infrastructure.'], why: 'Không chỉ sửa "has" thành "have" — thay động từ, dùng mệnh đề quan hệ, nâng từ vựng.' },
      { kind: 'choice', q: 'Quy trình ba bước cho mỗi bài viết là gì?', options: ['Viết → soi bằng bảng → VIẾT LẠI đoạn sai', 'Viết → nộp → nhận điểm', 'Đọc mẫu → viết → so sánh', 'Viết → đọc lại → viết bài mới'], answer: 'Viết → soi bằng bảng → VIẾT LẠI đoạn sai', why: 'Bước 3 là bước hầu hết bỏ qua, và cũng là bước duy nhất có tác dụng thật.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi viết lại những câu tôi đã viết sai.', answer: 'I rewrite the sentences I got wrong.', why: 'Mệnh đề quan hệ rút gọn (bỏ "that") — dùng đúng là tự nhiên.' },
    ],
  },
  {
    lessonId: 'm5',
    items: [
      { kind: 'choice', q: 'Câu hỏi nào giúp nhận góp ý DÙNG ĐƯỢC?', options: ['Chỉ ra mọi câu sai ngữ pháp và giải thích vì sao', 'Bài này được mấy chấm?', 'Bài này hay không?', 'Tôi có nên thi chưa?'], answer: 'Chỉ ra mọi câu sai ngữ pháp và giải thích vì sao', why: 'Con số điểm không dạy gì. Danh sách lỗi cụ thể mới dạy.' },
      { kind: 'choice', q: 'Bốn câu hỏi nên dùng khi nhờ chấm ứng với cái gì?', options: ['Đúng bốn tiêu chí chấm Writing', 'Bốn phần của bài thi', 'Bốn kỹ năng', 'Bốn chặng band'], answer: 'Đúng bốn tiêu chí chấm Writing', why: 'Hỏi theo tiêu chí thì góp ý nhận về dùng được ngay.' },
      { kind: 'choice', q: 'Mốc của chặng 3 về Writing là gì?', options: ['Ít nhất 10 bài được chấm và đã sửa lỗi lặp', '50 bài đã viết', '20 bài mẫu đã đọc', '5 đề đã làm'], answer: 'Ít nhất 10 bài được chấm và đã sửa lỗi lặp', why: 'Đây là mốc ghi trong lộ trình chặng 3.' },
      { kind: 'fix', q: 'Please tell me my band score and if my essay is good.', hint: 'Hỏi quá chung chung.', answer: 'Please point out any grammatical errors and explain why they are wrong.', why: 'Hỏi cụ thể theo tiêu chí thì mới nhận về thứ dùng được.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Đoạn nào thiếu ví dụ cụ thể?', answer: 'Which paragraph lacks a specific example?', alt: ['Which paragraphs lack specific examples?'], why: 'Một trong bốn câu hỏi nên dùng khi nhờ chấm.' },
    ],
  },

  /* ── Chủ điểm 2: câu phức ── */
  {
    lessonId: 'c3-1',
    items: [
      { kind: 'fix', q: 'The report that was published in 2020, found a clear link.', hint: 'Loại có phẩy dùng đại từ nào?', answer: 'The report, which was published in 2020, found a clear link.', why: 'Mệnh đề không xác định dùng "which"/"who", KHÔNG dùng "that", và phải có phẩy ở CẢ HAI đầu.' },
      { kind: 'gap', q: 'Điền: Renewable energy, ____________ now supplies a third of the grid, was once dismissed.', answer: 'which', why: 'Nói về VẬT, loại có phẩy → "which".' },
      { kind: 'translate', q: 'Dịch, dùng mệnh đề quan hệ CÓ PHẨY:', hint: 'Báo cáo, được công bố năm 2020, tìm ra mối liên hệ rõ ràng.', answer: 'The report, which was published in 2020, found a clear link.', why: 'Thông tin phụ nằm giữa hai dấu phẩy.' },
      { kind: 'choice', q: '"Many students work part-time, which reduces study time." — "which" thay cho cái gì?', options: ['Cả mệnh đề trước đó', 'Từ "students"', 'Từ "part-time"', 'Không thay cho gì'], answer: 'Cả mệnh đề trước đó', why: 'Cách dùng này rất hay gặp trong văn học thuật và ăn điểm ngữ pháp.' },
      { kind: 'order', q: 'the / , / which / grid / supplies / now / a third of / Renewable energy / , / was once dismissed', hint: 'Năng lượng tái tạo, nay cung cấp một phần ba lưới điện, từng bị cho là bất khả thi.', answer: 'Renewable energy, which now supplies a third of the grid, was once dismissed.', why: 'Chủ ngữ — mệnh đề phụ trong hai phẩy — động từ chính.' },
    ],
  },
  {
    lessonId: 'c3-2',
    items: [
      { kind: 'fix', q: 'Not only it saves money, but also it reduces waste.', hint: 'Sau "Not only" đầu câu phải làm gì?', answer: 'Not only does it save money, but it also reduces waste.', why: 'Phải ĐẢO trợ động từ lên trước chủ ngữ. Không đảo là lỗi, dùng cấu trúc mà bị trừ thay vì được cộng.' },
      { kind: 'gap', q: 'Điền trợ động từ: Not only ____________ the scheme cut traffic, but it also improved air quality.', answer: 'did', why: 'Câu ở quá khứ nên đảo "did" lên trước chủ ngữ.' },
      { kind: 'translate', q: 'Dịch, dùng cấu trúc nhấn mạnh "It is … that":', hint: 'Chính việc thiếu vốn, chứ không phải thiếu ý tưởng, mới kìm các dự án này.', answer: 'It is the lack of funding, rather than the lack of ideas, that holds these projects back.', why: 'Cấu trúc nhấn mạnh — dùng một lần mỗi bài là đủ.' },
      { kind: 'choice', q: 'Nên dùng cấu trúc nâng cao bao nhiêu lần mỗi bài?', options: ['Một hoặc hai lần', 'Càng nhiều càng tốt', 'Mỗi đoạn một lần', 'Không dùng'], answer: 'Một hoặc hai lần', why: 'Dùng nhiều thì bài đọc gượng và xác suất sai tăng.' },
      { kind: 'translate', q: 'Dịch, bắt đầu bằng "What":', hint: 'Điều quan trọng nhất không phải số giờ mà là cách dùng chúng.', answer: 'What matters most is not the number of hours but how they are used.', why: 'Mệnh đề danh từ với "What" — cấu trúc nâng cao dễ dùng đúng.' },
    ],
  },
  {
    lessonId: 'c3-3',
    items: [
      { kind: 'fix', q: 'If the scheme was introduced earlier, the city would avoid congestion.', hint: 'Nói về việc ĐÃ KHÔNG xảy ra trong quá khứ.', answer: 'If the scheme had been introduced earlier, the city would have avoided congestion.', why: 'Loại 3: If + had + V3, … would have + V3.' },
      { kind: 'gap', q: 'Chia động từ (loại 3): If they ____________ (invest) earlier, the problem would have been smaller.', answer: 'had invested', why: 'Vế "if" của loại 3 dùng quá khứ hoàn thành.' },
      { kind: 'choice', q: 'Câu nào là điều kiện HỖN HỢP?', options: ['If governments had invested decades ago, we would not be so dependent on cars today.', 'If it rains, we will stay in.', 'If I had time, I would help.', 'If she had studied, she would have passed.'], answer: 'If governments had invested decades ago, we would not be so dependent on cars today.', why: 'Nguyên nhân ở quá khứ, kết quả ở HIỆN TẠI ("today").' },
      { kind: 'translate', q: 'Dịch, dùng điều kiện loại 3:', hint: 'Nếu chính sách được đưa ra sớm hơn, thành phố đã tránh được nhiều năm ùn tắc.', answer: 'If the policy had been introduced earlier, the city would have avoided years of congestion.', why: 'Cả hai vế ở quá khứ.' },
      { kind: 'fix', q: 'If I would have known, I would have told you.', hint: 'Vế "if" không dùng "would".', answer: 'If I had known, I would have told you.', why: 'KHÔNG dùng "would" trong mệnh đề "if" — lỗi rất phổ biến.' },
    ],
  },
  {
    lessonId: 'c3-4',
    items: [
      { kind: 'fix', q: 'Costs rose, demand fell.', hint: 'Lỗi comma splice — nối hai mệnh đề độc lập bằng dấu phẩy.', answer: 'Costs rose, so demand fell.', alt: ['Costs rose; demand fell.', 'Costs rose. Demand fell.'], why: 'Bốn cách sửa: dấu chấm, chấm phẩy, thêm liên từ, hoặc chấm phẩy + trạng từ nối.' },
      { kind: 'fix', q: 'Costs rose, however demand fell.', hint: '"however" không phải liên từ.', answer: 'Costs rose; however, demand fell.', alt: ['Costs rose. However, demand fell.'], why: '"however" cần dấu chấm hoặc chấm phẩy trước nó, và dấu phẩy sau.' },
      { kind: 'choice', q: 'Cách nào KHÔNG sửa được lỗi comma splice?', options: ['Giữ nguyên dấu phẩy và thêm "however"', 'Dùng dấu chấm', 'Dùng chấm phẩy', 'Thêm liên từ "so"'], answer: 'Giữ nguyên dấu phẩy và thêm "however"', why: '"however" là trạng từ nối, không nối được hai mệnh đề bằng dấu phẩy.' },
      { kind: 'translate', q: 'Dịch, dùng CHẤM PHẨY:', hint: 'Chi phí tăng; nhu cầu giảm.', answer: 'Costs rose; demand fell.', why: 'Chấm phẩy dùng khi hai ý gắn chặt với nhau.' },
      { kind: 'fix', q: 'The plan was expensive, it was approved anyway.', hint: 'Lại là comma splice.', answer: 'The plan was expensive, but it was approved anyway.', alt: ['The plan was expensive; it was approved anyway.'], why: 'Thêm liên từ "but" là cách sửa gọn nhất ở đây.' },
    ],
  },
  {
    lessonId: 'c3-5',
    items: [
      { kind: 'fix', q: 'The report which was published in 2020 by a team of researchers who had spent three years studying the issue found that screen time affects sleep.', hint: 'Chủ ngữ cách động từ chính quá xa.', answer: 'A 2020 report, based on three years of research, found that screen time affects sleep.', why: 'Chủ ngữ và động từ chính phải GẦN nhau. Câu gốc cách nhau 20 từ nên người đọc mất mạch.' },
      { kind: 'choice', q: 'Câu dài quá bao nhiêu từ thì nên tách?', options: ['35 từ', '15 từ', '60 từ', 'Không giới hạn'], answer: '35 từ', why: 'Không có giải thưởng cho câu dài nhất. Quá 35 từ thì xác suất sai tăng nhanh.' },
      { kind: 'choice', q: 'Ba quy tắc giữ câu dài mà vẫn rõ là gì?', options: ['Chủ–động gần nhau · một ý chính · không quá 35 từ', 'Dùng nhiều từ nối · nhiều mệnh đề · nhiều tính từ', 'Viết càng dài càng tốt', 'Chỉ dùng câu bị động'], answer: 'Chủ–động gần nhau · một ý chính · không quá 35 từ', why: 'Tiêu chí là "range AND accuracy" — câu rối làm hỏng cả hai.' },
      { kind: 'translate', q: 'Dịch cho GỌN, không quá 20 từ:', hint: 'Một báo cáo năm 2020, dựa trên ba năm nghiên cứu, đã tìm ra mối liên hệ.', answer: 'A 2020 report, based on three years of research, found a link.', why: 'Phần phụ gọn trong hai dấu phẩy, chủ ngữ và động từ sát nhau.' },
      { kind: 'choice', q: 'Câu dài ăn điểm khi nào?', options: ['Khi người đọc theo được', 'Khi có nhiều mệnh đề nhất', 'Khi dùng nhiều từ hiếm', 'Luôn ăn điểm'], answer: 'Khi người đọc theo được', why: 'Câu dài mà rối bị trừ ở cả hai vế của tiêu chí ngữ pháp.' },
    ],
  },

  /* ── Chủ điểm 3: collocation ── */
  {
    lessonId: 'v3-1',
    items: [
      { kind: 'fix', q: 'Scientists made a research about this problem.', hint: 'Ba lỗi kết hợp trong một câu.', answer: 'Scientists carried out research into this problem.', alt: ['Scientists did research into this problem.'], why: '"made" → "carried out"/"did"; "research" không đếm được nên bỏ "a"; "about" → "into".' },
      { kind: 'gap', q: 'Điền động từ đúng: The council ____________ a decision last week.', answer: 'made', why: 'make a decision — KHÔNG phải "do a decision".' },
      { kind: 'gap', q: 'Điền động từ đúng: Governments must ____________ action now.', answer: 'take', why: 'take action / take measures — cặp cố định.' },
      { kind: 'choice', q: 'Cụm nào TỰ NHIÊN nhất?', options: ['raise awareness of recycling', 'increase awareness of recycling', 'make awareness of recycling', 'do awareness of recycling'], answer: 'raise awareness of recycling', why: '"raise awareness" là cặp chuẩn. "increase awareness" hiểu được nhưng kém tự nhiên hơn.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Nhà sản xuất nên chịu trách nhiệm về bao bì.', answer: 'Manufacturers should take responsibility for packaging.', why: 'take responsibility FOR — chú ý giới từ.' },
    ],
  },
  {
    lessonId: 'v3-2',
    items: [
      { kind: 'fix', q: 'The figure of France increased strongly.', hint: 'Hai lỗi kết hợp.', answer: 'The figure for France increased sharply.', why: '"figure FOR" chứ không phải "of"; và "increase" đi với "sharply", không đi với "strongly".' },
      { kind: 'gap', q: 'Điền trạng từ đúng: Bus numbers fell ____________ throughout the period. (giảm đều)', answer: 'steadily', why: 'fall steadily — cặp chuẩn cho mức giảm đều.' },
      { kind: 'gap', q: 'Điền: Services ____________ for 60% of the total. (chiếm)', answer: 'account', why: 'account for — cụm cố định để nói tỷ lệ.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Con số đạt đỉnh 40% vào năm 2018.', answer: 'The figure reached a peak of 40% in 2018.', alt: ['Numbers peaked at 40% in 2018.'], why: 'reach a peak OF / peak AT — hai cách, khác giới từ.' },
      { kind: 'choice', q: 'Cặp nào SAI?', options: ['increase strongly', 'rise steadily', 'fall sharply', 'remain stable'], answer: 'increase strongly', why: '"increase" không đi với "strongly". Dùng sharply / significantly / steadily.' },
    ],
  },
  {
    lessonId: 'v3-3',
    items: [
      { kind: 'fix', q: 'The government should solve this problem by making a new law.', hint: 'Hai chỗ có cách nói tự nhiên hơn.', answer: 'The government should address this problem by introducing new legislation.', alt: ['The government should tackle this problem by introducing new legislation.'], why: '"address/tackle a problem" tự nhiên hơn khi vấn đề chưa dứt điểm được; "make a law" → "introduce/pass a law".' },
      { kind: 'gap', q: 'Điền: Plastic waste ____________ a serious threat to marine life.', answer: 'poses', why: 'pose a threat to — cụm cố định.' },
      { kind: 'gap', q: 'Điền: Policy must ____________ a balance between growth and conservation.', answer: 'strike', why: 'strike a balance between A and B.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Già hoá dân số đặt gánh nặng lên ngành y tế.', answer: 'An ageing population places a burden on health services.', alt: ['An ageing population puts a burden on health services.'], why: 'place/put a burden ON.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Học bổng giúp thu hẹp khoảng cách giàu nghèo.', answer: 'Scholarships help bridge the gap between rich and poor.', why: 'bridge the gap — ngược với widen the gap.' },
    ],
  },
  {
    lessonId: 'v3-4',
    items: [
      { kind: 'fix', q: 'The amount of students has risen and this effects the quality of teaching.', hint: 'Hai lỗi: từ chỉ lượng và loại từ.', answer: 'The number of students has risen and this affects the quality of teaching.', why: 'students đếm được → "number of"; cần ĐỘNG TỪ nên là "affects", không phải "effects".' },
      { kind: 'gap', q: 'Điền raise hoặc rise: Prices ____________ sharply last year.', answer: 'rose', why: '"rise" tự tăng, không cần tân ngữ. "raise" cần tân ngữ.' },
      { kind: 'gap', q: 'Điền fewer hoặc less: There is ____________ traffic in the centre now.', answer: 'less', why: 'traffic không đếm được → "less". Nếu là "cars" thì dùng "fewer".' },
      { kind: 'choice', q: '"an economical car" nghĩa là gì?', options: ['một chiếc xe tiết kiệm nhiên liệu', 'một chiếc xe thuộc ngành kinh tế', 'một chiếc xe đắt tiền', 'một chiếc xe cũ'], answer: 'một chiếc xe tiết kiệm nhiên liệu', why: 'economical = tiết kiệm. economic = thuộc kinh tế (economic growth).' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Ô nhiễm có ảnh hưởng tới sức khoẻ. (dùng DANH TỪ)', answer: 'Pollution has an effect on health.', why: 'Dùng danh từ "effect" thì phải có "has an … on".' },
    ],
  },
  {
    lessonId: 'v3-5',
    items: [
      { kind: 'fix', q: 'Nowadays, education is very important in our modern society.', hint: 'Câu rỗng kinh điển — 10 từ mà không nói gì.', answer: 'Access to education shapes almost every later outcome in a person life.', alt: ['Access to education shapes almost every later outcome in a person’s life.'], why: 'Câu sau cũng chừng ấy từ nhưng nêu một luận điểm cụ thể, ăn điểm ở cả Task Response lẫn Lexical Resource.' },
      { kind: 'choice', q: 'Thay "very important" bằng từ nào?', options: ['crucial / vital / essential', 'so important', 'really important', 'much important'], answer: 'crucial / vital / essential', why: 'Một từ mạnh thay cho hai từ rỗng — vừa gọn vừa ăn điểm từ vựng.' },
      { kind: 'fix', q: 'A lot of people think this is a very big problem.', hint: 'Hai cụm rỗng.', answer: 'A significant proportion of the population regards this as a major problem.', alt: ['Many people regard this as a serious issue.'], why: '"a lot of people" → "a significant proportion"; "very big problem" → "major problem".' },
      { kind: 'choice', q: 'Cách nhanh nhất để nâng điểm từ vựng mà KHÔNG học thêm từ mới?', options: ['Xoá các từ rỗng và thay bằng từ mang thông tin', 'Dùng từ điển đồng nghĩa cho mọi từ', 'Viết dài hơn', 'Dùng nhiều từ nối hơn'], answer: 'Xoá các từ rỗng và thay bằng từ mang thông tin', why: 'Từ rỗng chiếm chỗ, làm loãng ý, và bị đếm là vốn từ nghèo.' },
      { kind: 'translate', q: 'Dịch, KHÔNG dùng "very" hay "a lot of":', hint: 'Đây là một vấn đề nghiêm trọng ảnh hưởng tới phần lớn dân số.', answer: 'This is a serious issue affecting the majority of the population.', why: 'Mệnh đề rút gọn "affecting" thay cho "which affects" — gọn hơn và ăn điểm.' },
    ],
  },

  /* ── Chủ điểm 4: tốc độ ── */
  {
    lessonId: 'sp3-1',
    items: [
      { kind: 'choice', q: 'Bước lướt 2 phút gồm những gì?', options: ['Đọc câu đầu mỗi đoạn, ghi 3 chữ tóm ý bên lề', 'Đọc kỹ cả bài', 'Đọc phần từ vựng khó', 'Đọc câu hỏi trước'], answer: 'Đọc câu đầu mỗi đoạn, ghi 3 chữ tóm ý bên lề', why: 'Tạo bản đồ bài đọc để sau đó biết quay lại đoạn nào.' },
      { kind: 'choice', q: 'Vì sao KHÔNG nên bỏ bước lướt?', options: ['Không có bản đồ thì mỗi câu hỏi lại quét từ đầu', 'Vì đề yêu cầu', 'Vì bài quá khó', 'Vì cần thời gian nghỉ'], answer: 'Không có bản đồ thì mỗi câu hỏi lại quét từ đầu', why: '2 phút đầu tư tiết kiệm 5–6 phút về sau.' },
      { kind: 'choice', q: 'Mốc Reading của chặng 3 là gì?', options: ['30+/40 trong đúng 60 phút', '40/40', '20/40', '35/40'], answer: '30+/40 trong đúng 60 phút', why: 'Ghi trong lộ trình chặng 3.' },
      { kind: 'choice', q: 'Tuần đầu luyện tốc độ nên ưu tiên gì?', options: ['GIỮ ĐÚNG GIỜ, chấp nhận làm không hết', 'Làm hết câu dù quá giờ', 'Bỏ qua câu khó', 'Không bấm giờ'], answer: 'GIỮ ĐÚNG GIỜ, chấp nhận làm không hết', why: 'Quen giờ trước, số câu đúng lên sau. Làm ngược lại thì không bao giờ kịp giờ.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi viết đáp án vào phiếu ngay sau mỗi câu.', answer: 'I write my answers on the answer sheet immediately after each question.', why: 'Reading KHÔNG có thời gian chép riêng như Listening.' },
    ],
  },
  {
    lessonId: 'sp3-2',
    items: [
      { kind: 'choice', q: 'Bốn loại lỗi khi phân tích câu sai là gì?', options: ['Không biết từ · không nhận ra paraphrase · hiểu sai dạng · hết giờ', 'Dễ · vừa · khó · rất khó', 'Nghe · nói · đọc · viết', 'Ngữ pháp · từ vựng · chính tả · dấu câu'], answer: 'Không biết từ · không nhận ra paraphrase · hiểu sai dạng · hết giờ', why: 'Bốn loại này cần bốn cách chữa hoàn toàn khác nhau.' },
      { kind: 'choice', q: 'Sai vì bài viết "curb" mà đề viết "reduce" là loại nào?', options: ['Không nhận ra paraphrase', 'Không biết từ', 'Hiểu sai dạng câu hỏi', 'Hết giờ'], answer: 'Không nhận ra paraphrase', why: 'Biết cả hai từ nhưng không nhận ra chúng cùng nghĩa → luyện lại chủ điểm paraphrase chặng 2.' },
      { kind: 'choice', q: 'Sau 5 đề nên làm gì với bảng phân loại lỗi?', options: ['Đếm loại nào nhiều nhất rồi chỉ luyện loại đó', 'Luyện đều cả bốn loại', 'Làm thêm 5 đề nữa', 'Bỏ qua'], answer: 'Đếm loại nào nhiều nhất rồi chỉ luyện loại đó', why: 'Chữa nhầm loại là tốn hàng tháng mà không lên điểm.' },
      { kind: 'choice', q: 'Xem đáp án rồi gật gù "à đúng rồi" có vấn đề gì?', options: ['Không biết vì sao mình sai nên lần sau sai lại', 'Mất thời gian', 'Quá dễ', 'Không có vấn đề'], answer: 'Không biết vì sao mình sai nên lần sau sai lại', why: 'Giống hệt vấn đề của Writing không được chấm.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi ghi lại vì sao tôi làm sai mỗi câu.', answer: 'I write down why I got each question wrong.', why: 'Chính là bước phân tích câu sai của bài này.' },
    ],
  },
  {
    lessonId: 'sp3-3',
    items: [
      { kind: 'choice', q: 'Điểm chặng 3 nằm chủ yếu ở section nào?', options: ['Section 3 và 4', 'Section 1 và 2', 'Chỉ Section 1', 'Đều nhau'], answer: 'Section 3 và 4', why: 'Section 1 và 2 đã ổn từ chặng 2. Điểm còn lại nằm ở hai section cuối.' },
      { kind: 'choice', q: 'Vì sao Section 4 khó?', options: ['Nói liên tục không nghỉ, không ai nhắc lại, từ vựng học thuật dày', 'Có nhiều người nói', 'Có nhạc nền', 'Nói quá chậm'], answer: 'Nói liên tục không nghỉ, không ai nhắc lại, từ vựng học thuật dày', why: 'Lỡ một câu là mất luôn, không có cơ hội thứ hai.' },
      { kind: 'choice', q: 'Trước khi nghe Section 4 nên làm gì?', options: ['Đọc TOÀN BỘ ghi chú và đoán loại từ cho từng chỗ trống', 'Nhắm mắt tập trung', 'Đọc câu hỏi cuối trước', 'Không cần chuẩn bị'], answer: 'Đọc TOÀN BỘ ghi chú và đoán loại từ cho từng chỗ trống', why: 'Biết mình đang chờ danh từ hay động từ thì bắt nhanh hơn nhiều.' },
      { kind: 'choice', q: 'Ở Section 3, cụm nào báo hiệu câu CHỐT?', options: ['Fair enough / Agreed / Let us go with that', 'Actually / However', 'I was thinking', 'Originally we wanted'], answer: 'Fair enough / Agreed / Let us go with that', why: 'Nghe thấy chúng là biết đáp án vừa được xác nhận.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Bài giảng luôn có cấu trúc rõ ràng.', answer: 'A lecture always has a clear structure.', why: 'Nắm được cấu trúc là biết mình đang ở đâu trong bài.' },
    ],
  },
  {
    lessonId: 'sp3-4',
    items: [
      { kind: 'choice', q: 'Đặc điểm của giọng Anh-Anh với âm /r/ cuối từ?', options: ['Bỏ /r/ — "car" thành /kɑː/', 'Nhấn mạnh /r/', 'Đổi thành /l/', 'Không khác gì Mỹ'], answer: 'Bỏ /r/ — "car" thành /kɑː/', why: 'Người quen giọng Mỹ qua phim hay khựng ở chỗ này.' },
      { kind: 'choice', q: 'Giọng Úc phát âm "today" gần như thế nào?', options: ['to-die', 'to-doo', 'to-day rõ như Mỹ', 'tu-day'], answer: 'to-die', why: 'Nguyên âm /eɪ/ nghiêng về /aɪ/ — nghe lần đầu rất dễ hiểu nhầm.' },
      { kind: 'choice', q: 'Vì sao không nên chỉ nghe một nguồn?', options: ['Đề thi chắc chắn có nhiều giọng', 'Nguồn đó sẽ hết bài', 'Nghe một nguồn gây chán', 'Không có lý do'], answer: 'Đề thi chắc chắn có nhiều giọng', why: 'Quen một giọng thì gặp giọng khác lại như người mới.' },
      { kind: 'choice', q: '"can\'t" trong giọng Anh-Anh đọc thế nào?', options: ['/kɑːnt/', '/kænt/', '/keɪnt/', '/kʌnt/'], answer: '/kɑːnt/', why: 'Khác hẳn giọng Mỹ /kænt/ — dễ nghe nhầm thành "can".' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Mỗi tuần tôi đổi nguồn nghe.', answer: 'I change my listening source every week.', why: 'Cách chống lệ thuộc vào một giọng duy nhất.' },
    ],
  },
  {
    lessonId: 'sp3-5',
    items: [
      { kind: 'choice', q: 'Phép kiểm QUAN TRỌNG NHẤT của chặng 3 là gì?', options: ['Có ít nhất 10 bài Writing đã được CHẤM và viết lại phần sai', 'Đọc được 40/40', 'Thuộc 4.000 từ', 'Nói được 3 phút'], answer: 'Có ít nhất 10 bài Writing đã được CHẤM và viết lại phần sai', why: 'Writing không được chấm là nguyên nhân số một khiến người học kẹt ở chặng này.' },
      { kind: 'choice', q: 'Vì sao KHÔNG nên sang chặng 4 khi Writing chưa từng được chấm?', options: ['Chặng 4 là chặng GIẢM LỖI — không biết sai gì thì không giảm được gì', 'Vì chặng 4 quá khó', 'Vì chưa đủ từ vựng', 'Vì chưa thi thử'], answer: 'Chặng 4 là chặng GIẢM LỖI — không biết sai gì thì không giảm được gì', why: 'Sẽ dậm chân ở chặng 4 y như đã dậm chân ở chặng 3.' },
      { kind: 'choice', q: 'Mốc từ vựng của chặng 3?', options: ['~4.000 từ, dùng được collocation đúng ngữ cảnh', '~1.500 từ', '~2.500 từ', '~6.000 từ'], answer: '~4.000 từ, dùng được collocation đúng ngữ cảnh', why: '1.500 là chặng 1, 2.500 là chặng 2, 6.000 là chặng 4.' },
      { kind: 'choice', q: 'Đạt bao nhiêu trên 6 phép kiểm thì sang chặng 4?', options: ['Từ 5/6', 'Từ 3/6', 'Đủ 6/6', 'Từ 2/6'], answer: 'Từ 5/6', why: 'Chưa đạt thì quay lại đúng chủ điểm yếu, không học lại từ đầu.' },
      { kind: 'translate', q: 'Dịch sang tiếng Anh:', hint: 'Tôi đã nhờ chấm mười bài luận và sửa lại tất cả.', answer: 'I have had ten essays marked and rewritten them all.', alt: ['I have had ten essays corrected and rewritten all of them.'], why: 'Cấu trúc "have something done" — nhờ ai đó làm gì.' },
    ],
  },
];
