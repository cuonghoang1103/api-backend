/**
 * Lộ trình IELTS 0 → 8.0, chia 5 chặng theo band.
 *
 * Nguyên tắc khi soạn: mỗi chặng phải trả lời được ba câu người học thật sự
 * hỏi — "tôi đang ở đâu", "mỗi ngày làm gì", "khi nào thì được lên chặng
 * sau". Lộ trình chỉ ghi mục tiêu chung chung là vô dụng.
 *
 * Mốc thời gian lấy theo mức học ~2 giờ/ngày, đều đặn. Học ít hơn thì kéo
 * dài ra chứ thứ tự không đổi.
 */

export interface SkillPlan {
  skill: 'Nghe' | 'Đọc' | 'Viết' | 'Nói';
  icon: string;
  /** Việc làm mỗi ngày ở chặng này. */
  daily: string;
  /** Cột mốc phải đạt trước khi lên chặng sau. */
  target: string;
  /** Sai lầm phổ biến ở đúng chặng này. */
  trap: string;
}

export interface BandStage {
  id: string;
  from: string;
  to: string;
  title: string;
  icon: string;
  /** Bao lâu, với mức ~2 giờ/ngày. */
  duration: string;
  /** Mô tả người học ở chặng này đang như thế nào. */
  youAre: string;
  /** Việc quan trọng nhất của cả chặng — làm sai cái này là mất hàng tháng. */
  keyFocus: string;
  skills: SkillPlan[];
  /** Tiêu chí kiểm tra để biết đã qua chặng. */
  checkpoints: string[];
}

export const BAND_STAGES: BandStage[] = [
  /* ══════════════ CHẶNG 1 ══════════════ */
  {
    id: 'foundation',
    from: '0',
    to: '4.0',
    title: 'Xây nền — chưa vội đụng đề thi',
    icon: '🧱',
    duration: '3–4 tháng',
    youAre:
      'Bạn đọc được vài từ quen, nhưng nghe người bản xứ nói thì không bắt kịp và viết một câu '
      + 'hoàn chỉnh vẫn phải nghĩ lâu.',
    keyFocus:
      'ĐỪNG luyện đề IELTS ở chặng này. Làm đề khi chưa đủ 1.500 từ vựng chỉ khiến bạn nản và '
      + 'học thuộc đáp án thay vì hiểu. Việc duy nhất đáng làm là: từ vựng nền + phát âm + ngữ pháp cơ bản.',
    skills: [
      {
        skill: 'Nghe',
        icon: '🎧',
        daily: '20 phút nghe chậm có phụ đề (BBC Learning English mức A2–B1), nghe 2 lần: lần đầu không phụ đề, lần sau có.',
        target: 'Nghe hiểu ý chính một đoạn hội thoại đời thường 2 phút nói ở tốc độ chậm.',
        trap: 'Nghe nhạc/phim rồi tưởng là đang luyện. Phải nghe CHỦ ĐỘNG: dừng lại, chép lại, tra từ.',
      },
      {
        skill: 'Đọc',
        icon: '📖',
        daily: '1 bài đọc ngắn 300 từ mức A2–B1, gạch chân mọi từ chưa biết rồi đưa vào bộ thẻ.',
        target: 'Đọc hiểu đoạn 300 từ mà không cần tra quá 5 từ.',
        trap: 'Tra từng từ một khi đang đọc → mất mạch. Đọc hết đoạn đoán nghĩa trước, tra sau.',
      },
      {
        skill: 'Viết',
        icon: '✍️',
        daily: '5 câu đơn về ngày hôm nay, dùng đúng thì hiện tại đơn và quá khứ đơn.',
        target: 'Viết một đoạn 80 từ không sai thì và không thiếu mạo từ.',
        trap: 'Viết câu dài dòng cho "sang". Ở chặng này câu ĐÚNG quan trọng hơn câu hay.',
      },
      {
        skill: 'Nói',
        icon: '🗣️',
        daily: '15 phút nhại theo (shadowing) một đoạn hội thoại, thu âm rồi nghe lại.',
        target: 'Tự giới thiệu và kể một ngày của mình trong 1 phút, không ngập ngừng quá 3 lần.',
        trap: 'Học ngữ pháp mà không mở miệng. Phải nói THÀNH TIẾNG mỗi ngày.',
      },
    ],
    checkpoints: [
      'Thuộc chắc 1.500 từ vựng cơ bản (kiểm bằng cách: cho nghĩa tiếng Việt, tự bật ra từ tiếng Anh).',
      'Phát âm đúng 20 âm khó với người Việt, nhất là /θ/ /ð/ /v/ /w/ /s/ cuối từ.',
      'Nắm 6 thì cơ bản và dùng đúng khi viết.',
      'Nói được 1 phút liên tục về bản thân mà không dịch trong đầu.',
    ],
  },

  /* ══════════════ CHẶNG 2 ══════════════ */
  {
    id: 'basic',
    from: '4.0',
    to: '5.5',
    title: 'Làm quen dạng đề — bắt đầu vào IELTS thật',
    icon: '📋',
    duration: '3–4 tháng',
    youAre:
      'Bạn hiểu được câu đơn giản và viết được đoạn ngắn, nhưng gặp đề IELTS thì hoảng vì tốc độ '
      + 'nghe nhanh và bài đọc quá dài.',
    keyFocus:
      'Học DẠNG câu hỏi trước khi luyện tốc độ. Mỗi dạng (True/False/Not Given, Matching Headings, '
      + 'Map Labelling…) có mẹo riêng; không biết dạng thì làm bao nhiêu đề cũng sai y như cũ.',
    skills: [
      {
        skill: 'Nghe',
        icon: '🎧',
        daily: '1 section Listening + chép chính tả (dictation) 5 phút. Chép chính tả là bài tập hiệu quả nhất ở chặng này.',
        target: 'Section 1 và 2 đúng 7/10. Bắt được số, ngày tháng, tên riêng đánh vần.',
        trap: 'Mải viết đáp án câu trước nên trôi mất câu sau. Phải tập bỏ câu đã lỡ và bám theo bài.',
      },
      {
        skill: 'Đọc',
        icon: '📖',
        daily: '1 passage + học kỹ MỘT dạng câu hỏi mỗi tuần.',
        target: 'Passage 1 đúng 9/13 trong 20 phút.',
        trap: 'Đọc hết bài rồi mới làm câu hỏi → hết giờ. Phải đọc câu hỏi trước, quét tìm từ khoá.',
      },
      {
        skill: 'Viết',
        icon: '✍️',
        daily: 'Task 1 hai ngày một bài, Task 2 hai ngày một bài. Học thuộc bộ câu mô tả xu hướng.',
        target: 'Viết đủ 150 từ (Task 1) và 250 từ (Task 2) trong thời gian quy định.',
        trap: 'Viết thiếu số từ bị trừ điểm nặng. Đếm trước xem 150 từ của bạn dài bao nhiêu dòng.',
      },
      {
        skill: 'Nói',
        icon: '🗣️',
        daily: 'Trả lời 5 câu Part 1 và 1 đề Part 2, luôn thu âm.',
        target: 'Nói Part 2 đủ 2 phút không dừng quá 5 giây.',
        trap: 'Trả lời Part 1 cụt lủn 1 câu. Phải theo công thức: trả lời → lý do → ví dụ.',
      },
    ],
    checkpoints: [
      'Biết tên và cách làm của tất cả các dạng câu hỏi Listening và Reading.',
      'Vốn từ ~2.500, bắt đầu có từ học thuật.',
      'Viết được Task 2 đúng cấu trúc 4 đoạn, dù ý còn đơn giản.',
      'Thi thử được 5.0–5.5 tổng.',
    ],
  },

  /* ══════════════ CHẶNG 3 ══════════════ */
  {
    id: 'intermediate',
    from: '5.5',
    to: '6.5',
    title: 'Lên chuẩn đại học — chặng đông người mắc kẹt nhất',
    icon: '🎯',
    duration: '4–5 tháng',
    youAre:
      'Bạn làm được đề nhưng điểm dao động thất thường, và Writing mãi 5.5–6.0 dù đã viết rất nhiều bài.',
    keyFocus:
      'Đây là chặng người học kẹt lâu nhất, gần như luôn vì Writing. Nguyên nhân thật: viết nhiều '
      + 'mà KHÔNG ai sửa, nên sai gì thì lặp lại mãi. Bắt buộc phải có người/công cụ chấm và chỉ ra lỗi.',
    skills: [
      {
        skill: 'Nghe',
        icon: '🎧',
        daily: '1 test đầy đủ 3 ngày/lần + nghe TED hoặc podcast học thuật 20 phút, không phụ đề.',
        target: '30/40 trở lên. Section 3 và 4 không còn rớt quá 4 câu.',
        trap: 'Không bắt được từ nối đảo hướng (however, although, actually) → chọn đúng bẫy đánh lạc hướng.',
      },
      {
        skill: 'Đọc',
        icon: '📖',
        daily: '2 passage/ngày có bấm giờ 20 phút mỗi bài.',
        target: '30/40 trong đúng 60 phút.',
        trap: 'Not Given và False bị lẫn. Quy tắc: False = bài nói NGƯỢC lại; Not Given = bài KHÔNG nhắc tới.',
      },
      {
        skill: 'Viết',
        icon: '✍️',
        daily: '1 bài Task 2 mỗi 2 ngày, và BẮT BUỘC nhờ chấm — không chấm thì đừng viết thêm.',
        target: 'Task 2 ổn định 6.0–6.5; ý được triển khai bằng ví dụ cụ thể.',
        trap: 'Học thuộc câu mẫu rồi nhét vào mọi đề → giám khảo nhận ra ngay và trừ Coherence.',
      },
      {
        skill: 'Nói',
        icon: '🗣️',
        daily: '1 buổi nói 15 phút với bạn học hoặc gia sư; ghi âm và tự đếm lỗi lặp từ.',
        target: 'Part 3 giữ được mạch lập luận, biết dùng "It depends on…" để mở rộng.',
        trap: 'Dùng đi dùng lại "I think" và "very". Thay bằng "In my view", "I\'d argue", và tính từ mạnh.',
      },
    ],
    checkpoints: [
      'Vốn từ ~4.000, dùng được collocation học thuật đúng ngữ cảnh.',
      'Writing Task 2 được người khác chấm ít nhất 10 bài và đã sửa lỗi lặp.',
      'Listening và Reading ổn định 30+/40 qua 3 đề liên tiếp.',
      'Thi thử 6.0–6.5 tổng, không kỹ năng nào dưới 5.5.',
    ],
  },

  /* ══════════════ CHẶNG 4 ══════════════ */
  {
    id: 'advanced',
    from: '6.5',
    to: '7.5',
    title: 'Chạm 7.5 — ăn nhau ở độ chính xác',
    icon: '🏆',
    duration: '4–6 tháng',
    youAre:
      'Bạn hiểu gần hết bài nghe và bài đọc, viết trôi chảy, nhưng vẫn mất điểm ở những lỗi nhỏ '
      + 'và cách diễn đạt chưa đủ tự nhiên.',
    keyFocus:
      'Từ 6.5 lên 7.5 không phải học thêm kiến thức mới, mà là GIẢM LỖI. Một lỗi ngữ pháp nhỏ lặp '
      + 'lại vài lần đủ kéo Writing từ 7.0 xuống 6.5. Hãy lập danh sách lỗi của riêng bạn và diệt từng lỗi.',
    skills: [
      {
        skill: 'Nghe',
        icon: '🎧',
        daily: '1 test đầy đủ + nghe chép chính tả phần bị sai. Nghe thêm giọng Úc và Scotland.',
        target: '35/40 trở lên, ổn định.',
        trap: 'Sai chính tả hoặc sai số nhiều/số ít khi điền → đáp án đúng vẫn bị tính sai.',
      },
      {
        skill: 'Đọc',
        icon: '📖',
        daily: '1 test đầy đủ có bấm giờ; phân tích kỹ MỌI câu sai, viết ra vì sao sai.',
        target: '35/40 trong 60 phút.',
        trap: 'Đọc quá kỹ passage 3 nên hết giờ. Phân bổ 17–20–23 phút cho ba bài.',
      },
      {
        skill: 'Viết',
        icon: '✍️',
        daily: '1 bài Task 2 mỗi 2 ngày + viết lại bài cũ theo góp ý (viết lại quan trọng hơn viết mới).',
        target: 'Task Response đủ sâu, mỗi ý có ví dụ; ngữ pháp phức hợp dùng chính xác chứ không gượng.',
        trap: 'Cố nhồi câu phức và từ hiếm → sai ngữ cảnh, mất điểm nhiều hơn được. Chính xác trước, phức tạp sau.',
      },
      {
        skill: 'Nói',
        icon: '🗣️',
        daily: '2 buổi nói/tuần với người bản xứ hoặc gia sư; tập trung vào nối âm và ngữ điệu.',
        target: 'Part 3 tranh luận được hai chiều, dùng thành ngữ tự nhiên đúng chỗ.',
        trap: 'Nói trôi chảy nhưng đều đều một nhịp → mất điểm Pronunciation. Phải có lên xuống giọng.',
      },
    ],
    checkpoints: [
      'Vốn từ ~6.000, dùng được từ học thuật mà không gượng.',
      'Có danh sách lỗi cá nhân và đã diệt được phần lớn.',
      'Thi thử 7.0–7.5, không kỹ năng nào dưới 6.5.',
      'Viết Task 2 xong trong 38 phút mà vẫn còn thời gian đọc soát.',
    ],
  },

  /* ══════════════ CHẶNG 5 ══════════════ */
  {
    id: 'mastery',
    from: '7.5',
    to: '8.0',
    title: 'Chặng không có sách — bỏ lỗi, không học thêm',
    icon: '🎯',
    duration: '3–6 tháng',
    youAre:
      'Bạn viết được bài không ai chê được điểm nào cụ thể, nói trôi chảy về mọi chủ đề, '
      + 'và vẫn nhận 7.0–7.5 hết lần này tới lần khác mà không hiểu thiếu gì.',
    keyFocus:
      'KHÔNG có tài liệu riêng cho chặng này, và đó là điều quan trọng nhất cần biết trước khi đi tìm. '
      + 'Chỉ còn bốn việc: (1) đọc band descriptors tới mức thuộc — tài liệu miễn phí trên ielts.org; '
      + '(2) có người chấm bài viết hàng tuần; (3) nghe/đọc nguồn KHÓ HƠN đề thi mỗi ngày; '
      + '(4) nhật ký lỗi để diệt lỗi lặp. Ai tìm “sách 8.0” ở đây là đang tìm thứ không tồn tại.',
    skills: [
      {
        skill: 'Nghe',
        icon: '🎧',
        daily: '15 phút nguồn ngoài đề không phụ đề (BBC Radio 4, podcast học thuật), tóm tắt bằng lời mình rồi mới xem transcript. Mỗi tuần MỘT đề để đo.',
        target: '35/40 trở thành SÀN chứ không phải trần, kể cả với giọng Úc và Scotland.',
        trap: 'Bẫy đính chính giữa câu (“sorry, I should say…”). Đáp án luôn nằm ở vế SAU, nhưng tay đã kịp viết vế trước.',
      },
      {
        skill: 'Đọc',
        icon: '📖',
        daily: '1 bài ngoài đề 900–1.200 từ có bấm giờ (The Economist, Nature news, Aeon), tự tóm tắt lập luận trong 3 câu.',
        target: '130–150 từ/phút CÓ HIỂU; xong 3 passage trước 55 phút để còn thời gian dò lại.',
        trap: 'Phân bổ đều 20–20–20 phút. Passage 3 khó nhất nên phải được 23 phút — chia đều là lý do phổ biến nhất khiến hết giờ.',
      },
      {
        skill: 'Viết',
        icon: '✍️',
        daily: '2 bài mới + 1 bài VIẾT LẠI mỗi tuần, đúng 40 phút theo quy trình 5–30–5. Mỗi bài xong là chép lỗi vào nhật ký có nhãn.',
        target: 'Tỷ lệ câu không lỗi trên 80% (band 7 chỉ cần “frequent”, band 8 cần “majority”) và lập trường nhất quán từ mở tới kết.',
        trap: 'Nhồi từ hiếm để “nâng band”. Descriptor nói “SKILFULLY uses uncommon lexical items” — dùng vụng là bị trừ ở đúng chỗ tưởng được điểm.',
      },
      {
        skill: 'Nói',
        icon: '🗣️',
        daily: '2–3 buổi/tuần với người thật về chủ đề KHÔNG chuẩn bị trước; thu âm và nghe lại, đánh dấu mọi chỗ dừng.',
        target: 'Mọi chỗ ngập ngừng là vì NỘI DUNG, không vì tìm từ — đúng chữ “hesitation is content-related”.',
        trap: 'Học thuộc câu trả lời để nói liền mạch. Nhịp đều và ngữ điệu phẳng làm giám khảo nhận ra ngay, và Fluency bị trừ.',
      },
    ],
    checkpoints: [
      'Đã đọc hết band descriptors bản public và tự chấm được bài mình theo từng tiêu chí.',
      'Nhật ký lỗi có nhãn cố định, và danh sách đang NGẮN DẦN qua từng tháng.',
      'Tỷ lệ câu không lỗi trên 80% ở ba bài viết liên tiếp.',
      'Ít nhất 10 bài Task 2 được người có chuyên môn chấm, và đã viết lại ít nhất 5 trong số đó.',
      'Thi thử 8.0 tổng, không kỹ năng nào dưới 7.0.',
    ],
  },
];

/** Vài con số hiện ở đầu trang — tính từ dữ liệu nên không lệch. */
export const IELTS_STATS = {
  stages: BAND_STAGES.length,
  skills: BAND_STAGES.reduce((s, b) => s + b.skills.length, 0),
  checkpoints: BAND_STAGES.reduce((s, b) => s + b.checkpoints.length, 0),
};
