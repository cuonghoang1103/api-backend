/**
 * Cẩm nang kỳ thi IELTS.
 *
 * Đặt ở chặng 1 dù còn lâu mới thi, vì một lý do: biết mình sẽ bị chấm theo
 * TIÊU CHÍ NÀO thì học đỡ lan man hẳn. Rất nhiều người luyện cả năm mà không
 * biết Writing chấm theo bốn tiêu chí, nên dồn hết sức vào từ vựng hoa mỹ
 * trong khi mất điểm ở chỗ khác.
 *
 * Về số liệu quy đổi điểm: bảng dưới đây là mức THAM KHẢO được công bố rộng
 * rãi, mỗi đề thi thật xê dịch một chút tuỳ độ khó. Đã ghi rõ điều đó trong
 * phần cảnh báo để người học không coi nó là con số tuyệt đối.
 */
import type { ExamBlock } from '../types';

export const EXAM: ExamBlock[] = [
  {
    id: 'structure',
    title: 'Bài thi gồm những gì',
    icon: '🗂️',
    body:
      'Bốn phần thi trong cùng một ngày (Nghe, Đọc, Viết liền nhau, không nghỉ giữa chừng). Riêng phần '
      + 'Nói có thể xếp trước hoặc sau đó vài ngày. Tổng thời gian làm bài khoảng 2 giờ 45 phút.',
    rows: [
      { k: 'Nghe (Listening)', v: '4 phần · 40 câu · ~30 phút. Bản thi giấy có thêm 10 phút chép đáp án sang phiếu; bản thi máy chỉ có 2 phút.' },
      { k: 'Đọc (Reading)', v: '3 bài · 40 câu · 60 phút. KHÔNG có thời gian chép thêm — phải viết đáp án vào phiếu ngay khi làm.' },
      { k: 'Viết (Writing)', v: '2 bài · 60 phút. Task 1 tối thiểu 150 từ (~20 phút), Task 2 tối thiểu 250 từ (~40 phút).' },
      { k: 'Nói (Speaking)', v: '11–14 phút, nói trực tiếp với giám khảo. Part 1 (4–5 phút), Part 2 (1 phút chuẩn bị + 1–2 phút nói), Part 3 (4–5 phút).' },
    ],
    bullets: [
      'Listening và Speaking giống hệt nhau ở cả hai bản Academic và General Training.',
      'Reading và Writing thì KHÁC nhau giữa hai bản — chọn đúng bản trước khi luyện.',
      'Thi trên máy hay trên giấy đều cùng nội dung và cùng thang điểm; chỉ khác cách làm bài.',
    ],
    warn:
      'Reading KHÔNG có thời gian chép đáp án riêng như Listening. Rất nhiều người mất điểm vì để dành '
      + 'việc chép lại tới cuối rồi hết giờ.',
  },

  {
    id: 'academic-general',
    title: 'Academic hay General Training?',
    icon: '🔀',
    body:
      'Chọn sai bản là hỏng cả kỳ thi, mà đây lại là câu người mới hay hỏi nhất. Quy tắc đơn giản: đi HỌC '
      + 'thì chọn Academic, đi ĐỊNH CƯ hoặc đi làm thì thường là General Training. Vẫn phải kiểm lại yêu cầu '
      + 'cụ thể của trường hoặc cơ quan bạn nộp hồ sơ.',
    rows: [
      { k: 'Academic — Reading', v: 'Ba bài đọc học thuật dài, lấy từ sách báo khoa học.' },
      { k: 'Academic — Writing Task 1', v: 'Mô tả biểu đồ, bảng số liệu, bản đồ hoặc quy trình.' },
      { k: 'General — Reading', v: 'Bài đọc đời thường: thông báo, quảng cáo, hướng dẫn, rồi mới tới bài dài hơn.' },
      { k: 'General — Writing Task 1', v: 'Viết một lá thư (trang trọng, bán trang trọng hoặc thân mật).' },
      { k: 'Giống nhau', v: 'Listening, Speaking, và Writing Task 2 (bài luận) — hai bản như nhau.' },
    ],
    bullets: [
      'Cùng một số câu đúng, Academic Reading thường quy ra band cao hơn General một chút, vì bài khó hơn.',
      'Ở chặng 1 bạn chưa cần quyết ngay, nhưng nên biết để chọn đúng tài liệu khi lên chặng 2.',
      'Đề viết thư của General là dạng DỄ nhất trong mọi dạng Writing — khoá này đã có một đề ở tab Viết.',
    ],
  },

  {
    id: 'scoring',
    title: 'Điểm được tính thế nào',
    icon: '🧮',
    body:
      'Mỗi kỹ năng được một band từ 0 đến 9. Điểm tổng là TRUNG BÌNH CỘNG của bốn kỹ năng, làm tròn về mức '
      + '0,5 gần nhất: phần lẻ 0,25 làm tròn LÊN 0,5; phần lẻ 0,75 làm tròn LÊN 1,0.',
    rows: [
      { k: 'Ví dụ 1', v: 'L 6.5 · R 6.5 · W 5.0 · S 7.0 → trung bình 6,25 → tổng 6.5' },
      { k: 'Ví dụ 2', v: 'L 6.5 · R 6.0 · W 5.5 · S 6.0 → trung bình 6,0 → tổng 6.0' },
      { k: 'Ví dụ 3', v: 'L 7.0 · R 7.0 · W 6.5 · S 7.0 → trung bình 6,875 → tổng 7.0' },
      { k: 'Listening & Reading', v: 'Chấm bằng máy theo số câu đúng. Không trừ điểm câu sai — nên phải điền HẾT, đừng bỏ trống câu nào.' },
      { k: 'Writing & Speaking', v: 'Giám khảo chấm theo 4 tiêu chí, mỗi tiêu chí 25%.' },
    ],
    bullets: [
      'Vì không trừ điểm câu sai, câu nào không biết cũng phải đoán. Bỏ trống là chắc chắn mất điểm.',
      'Task 2 có trọng số GẤP ĐÔI Task 1 trong điểm Writing — nếu thiếu thời gian, hãy hy sinh Task 1.',
      'Nhiều trường yêu cầu cả điểm tổng LẪN điểm sàn từng kỹ năng (ví dụ tổng 6.5 và không kỹ năng nào dưới 6.0).',
    ],
  },

  {
    id: 'band-table',
    title: 'Bảng quy đổi số câu đúng → band',
    icon: '📊',
    body:
      'Dùng để tự chấm khi luyện đề. Đây là mức THAM KHẢO — mỗi đề thật xê dịch một chút tuỳ độ khó, nên '
      + 'đừng bám vào từng câu một. Ở chặng 1, mục tiêu của bạn là quanh mốc 4.0.',
    rows: [
      { k: 'Nghe — 4.0 / 4.5 / 5.0', v: '11–12 câu / 13–15 câu / 16–17 câu' },
      { k: 'Nghe — 5.5 / 6.0 / 6.5', v: '18–22 câu / 23–25 câu / 26–29 câu' },
      { k: 'Nghe — 7.0 / 7.5 / 8.0', v: '30–31 câu / 32–34 câu / 35–36 câu' },
      { k: 'Đọc Academic — 4.0 / 4.5 / 5.0', v: '10–12 câu / 13–14 câu / 15–18 câu' },
      { k: 'Đọc Academic — 5.5 / 6.0 / 6.5', v: '19–22 câu / 23–26 câu / 27–29 câu' },
      { k: 'Đọc Academic — 7.0 / 7.5 / 8.0', v: '30–32 câu / 33–34 câu / 35–36 câu' },
    ],
    warn:
      'Bảng này chỉ để ước lượng khi tự luyện. Con số chính thức do đơn vị tổ chức thi quyết định và có '
      + 'thể khác đôi chút ở từng đề.',
  },

  {
    id: 'writing-criteria',
    title: 'Writing chấm theo 4 tiêu chí nào',
    icon: '✍️',
    body:
      'Đây là phần đáng đọc nhất của cả cẩm nang. Bốn tiêu chí, mỗi cái chiếm 25%. Biết bốn cái này thì '
      + 'bạn hiểu ngay vì sao viết hay mà vẫn 5.5 — thường là do mất điểm ở tiêu chí bạn không để ý.',
    rows: [
      {
        k: '1. Task Response (trả lời đúng đề)',
        v: 'Có trả lời ĐỦ mọi câu hỏi của đề không? Có đủ số từ không? Ý có được triển khai bằng ví dụ không? — Đây là chỗ mất điểm oan nhất: đề hỏi hai ý mà chỉ trả lời một.',
      },
      {
        k: '2. Coherence & Cohesion (mạch lạc)',
        v: 'Có chia đoạn rõ không? Mỗi đoạn có câu chủ đề không? Từ nối dùng có đúng chỗ không? — Viết một khối chữ không xuống dòng là mất điểm ngay.',
      },
      {
        k: '3. Lexical Resource (từ vựng)',
        v: 'Từ có đa dạng và ĐÚNG NGỮ CẢNH không? — Lặp "very", "good", "important" nhiều lần bị trừ; nhưng dùng từ hiếm sai ngữ cảnh còn bị trừ nặng hơn.',
      },
      {
        k: '4. Grammatical Range & Accuracy (ngữ pháp)',
        v: 'Có dùng được câu phức không, VÀ có dùng đúng không? — Toàn câu đơn đúng hết vẫn bị hạn chế điểm; nhưng câu phức sai nhiều thì còn tệ hơn.',
      },
    ],
    bullets: [
      'Hai tiêu chí đầu (đúng đề, mạch lạc) là chỗ NÂNG ĐIỂM NHANH NHẤT vì chúng thuộc về cách trình bày, không đòi vốn từ.',
      'Ở chặng 1, hãy dồn sức vào tiêu chí 1 và 4: trả lời đúng đề và viết câu KHÔNG SAI.',
      'Đọc kỹ hai bài mẫu "đạt" và "kém" trong tab Viết — mỗi lỗi ở bài kém đều tương ứng với một tiêu chí ở đây.',
    ],
  },

  {
    id: 'speaking-criteria',
    title: 'Speaking chấm theo 4 tiêu chí nào',
    icon: '🎤',
    body:
      'Cũng bốn tiêu chí, mỗi cái 25%. Điểm quan trọng cần hiểu: giám khảo KHÔNG chấm nội dung câu trả lời '
      + 'đúng hay sai, không chấm bạn có thú vị hay không. Bạn bịa hoàn toàn cũng được điểm như thường.',
    rows: [
      {
        k: '1. Fluency & Coherence (trôi chảy)',
        v: 'Nói có liền mạch không, có ngập ngừng lâu không, ý có nối nhau không. — Dừng lâu vì đang dịch trong đầu là mất điểm ở đây.',
      },
      {
        k: '2. Lexical Resource (từ vựng)',
        v: 'Diễn đạt được ý mình muốn không, có nói vòng được khi thiếu từ không. — Biết nói vòng (paraphrase) ăn điểm hơn im lặng.',
      },
      {
        k: '3. Grammatical Range & Accuracy (ngữ pháp)',
        v: 'Có dùng được nhiều loại câu không và có đúng không. Giống Writing.',
      },
      {
        k: '4. Pronunciation (phát âm)',
        v: 'Người nghe có hiểu được không, có ngữ điệu lên xuống không. — KHÔNG cần giọng Anh hay giọng Mỹ. Giọng Việt vẫn được điểm cao nếu rõ ràng.',
      },
    ],
    bullets: [
      'Nội dung không bị chấm đúng/sai — nên đừng dừng lại vì "không biết trả lời thế nào". Cứ nói.',
      'Im lặng bị trừ nhiều hơn nói sai. Học sẵn các cụm câu giờ: "That is a good question…", "Well, let me think…".',
      'Phát âm chấm ở mức HIỂU ĐƯỢC, không chấm giống người bản xứ. Đừng tốn công bắt chước giọng.',
    ],
  },

  {
    id: 'exam-day',
    title: 'Ngày thi: mang gì, làm gì',
    icon: '📋',
    body:
      'Chuẩn bị trước để hôm thi không mất sức vào những chuyện ngoài chuyên môn. Rất nhiều người bị loại '
      + 'chỉ vì mang sai giấy tờ.',
    bullets: [
      'Mang ĐÚNG giấy tờ tuỳ thân đã dùng khi đăng ký (thường là hộ chiếu hoặc CCCD). Sai giấy tờ là không được vào thi.',
      'Tới sớm ít nhất 30 phút. Thủ tục kiểm tra và chụp ảnh mất thời gian hơn bạn nghĩ.',
      'Điện thoại, đồng hồ, giấy tờ riêng phải gửi ngoài. Trong phòng thi thường chỉ được mang bút chì, tẩy và chai nước bóc nhãn.',
      'Phần Nghe chỉ phát MỘT LẦN. Lỡ câu nào thì bỏ luôn câu đó và bám theo bài — tiếc một câu là mất cả cụm.',
      'Tranh thủ đọc trước câu hỏi trong lúc băng đọc phần hướng dẫn. Phần hướng dẫn luôn giống nhau, không cần nghe.',
      'Phần Viết: làm Task 2 TRƯỚC nếu bạn hay thiếu giờ, vì nó chiếm gấp đôi điểm.',
      'Phần Nói: đến đúng giờ hẹn, ăn mặc bình thường. Giám khảo bấm giờ nên đừng lo bị cắt lời — đó là quy trình.',
    ],
    warn:
      'Đề thi có bản quyền: không được chụp ảnh, chép lại hay mang đề ra ngoài. Vi phạm là bị huỷ kết quả.',
  },

  {
    id: 'common-losses',
    title: '12 lỗi làm mất điểm oan',
    icon: '⚠️',
    body:
      'Những lỗi dưới đây KHÔNG phải do trình độ mà do bất cẩn. Nghĩa là sửa được ngay hôm nay, không cần '
      + 'học thêm gì. Đây là cách nâng nửa band rẻ nhất.',
    bullets: [
      '1. Viết quá số từ giới hạn ở dạng điền từ. Đề ghi "NO MORE THAN TWO WORDS" mà viết ba từ là 0 điểm, dù ý đúng.',
      '2. Sai chính tả ở đáp án điền từ. Nghe đúng nhưng viết sai chính tả vẫn bị tính sai.',
      '3. Sai số ít / số nhiều khi điền. "book" và "books" là hai đáp án khác nhau.',
      '4. Bỏ trống câu không biết. Không trừ điểm câu sai — bỏ trống là tự bỏ cơ hội.',
      '5. Viết thiếu số từ ở Writing (dưới 150 hoặc 250 từ). Bị trừ nặng và không cứu được.',
      '6. Trả lời thiếu một vế của đề Writing. Đề hỏi hai câu mà chỉ trả lời một là mất điểm Task Response.',
      '7. Chép nguyên đề bài làm câu mở. Phần chép không được tính vào số từ.',
      '8. Nêu ý kiến cá nhân trong Task 1 (Academic). Task 1 chỉ mô tả dữ liệu, không bình luận.',
      '9. Không chia đoạn trong bài viết. Một khối chữ liền là mất điểm mạch lạc ngay lập tức.',
      '10. Học thuộc bài mẫu rồi nhét vào mọi đề. Giám khảo nhận ra rất nhanh và trừ điểm.',
      '11. Trả lời Speaking Part 1 cụt một câu. Phải có: trả lời → lý do → ví dụ.',
      '12. Ở Reading để dành việc chép đáp án tới cuối. Reading KHÔNG có thời gian chép riêng như Listening.',
    ],
  },

  {
    id: 'weekly-plan',
    title: 'Lịch luyện mẫu một tuần (chặng 1)',
    icon: '📅',
    body:
      'Khoảng 2 giờ mỗi ngày. Điểm mấu chốt không phải học nhiều mà là học ĐỀU — 1 giờ mỗi ngày ăn đứt '
      + '7 giờ dồn vào Chủ nhật, vì trí nhớ cần lặp lại cách quãng.',
    rows: [
      { k: 'Thứ Hai', v: '2 bài học mới + bài tập của bài đó · 20 phút từ vựng (lật thẻ) · 15 phút nhại theo (shadowing)' },
      { k: 'Thứ Ba', v: '1 bài nghe (chấm điểm rồi chép chính tả) · 20 phút từ vựng · 10 câu Luyện mỗi ngày' },
      { k: 'Thứ Tư', v: '2 bài học mới + bài tập · 1 bài đọc có bấm giờ · 20 phút từ vựng' },
      { k: 'Thứ Năm', v: '1 tình huống Đời sống (học thuộc hội thoại, nói to) · 1 bài nghe · 20 phút từ vựng' },
      { k: 'Thứ Sáu', v: '1 đề viết (tự viết rồi mới mở bài mẫu) · tự soát theo bảng 8 điểm · 20 phút từ vựng' },
      { k: 'Thứ Bảy', v: '1 chủ đề Nói: thu âm, nghe lại, đếm số lần dừng · 1 bài đọc · Luyện mỗi ngày' },
      { k: 'Chủ nhật', v: 'ÔN LẠI: làm lại các câu đã sai trong tuần. Không học bài mới.' },
    ],
    bullets: [
      'Chủ nhật KHÔNG học bài mới. Ngày ôn lại chỗ sai quan trọng hơn ngày học thêm cái mới.',
      'Từ vựng xuất hiện MỖI NGÀY trong lịch — vì đây là mốc quyết định của chặng 1 (1.500 từ).',
      'Bận quá thì cắt bớt, nhưng đừng bỏ hẳn một ngày. 15 phút vẫn hơn 0 phút vì nó giữ được thói quen.',
    ],
  },
];
