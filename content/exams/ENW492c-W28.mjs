// Đề gốc: `Kì 7/ENW492c/ENW492c - SU26 - FE - W` (chỉ có ảnh chụp đề
// 001.webp, không có paper.pdf), đề luận nguyên nhân-giải pháp
// (cause-solution essay) 350-400 từ về stress ở người trẻ và vai trò của cơ
// sở giáo dục trong việc giảm stress — chỉ CẦN nguyên nhân + giải pháp,
// KHÔNG yêu cầu bàn hậu quả riêng.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis identifying the essay will address the main causes of stress among young adults and how educational institutions can help reduce it, maintained throughout the essay.|||Luận điểm rõ ràng, xác định bài luận sẽ bàn về nguyên nhân chính gây stress ở người trẻ và cách các cơ sở giáo dục có thể giúp giảm stress, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'BOTH required parts — the main causes of stress among young adults AND concrete ways educational institutions can help reduce it — are each developed with specific reasoning/examples (not merged or one part skipped).|||CẢ HAI phần bắt buộc — nguyên nhân chính gây stress ở người trẻ VÀ các cách cụ thể mà cơ sở giáo dục có thể giúp giảm stress — đều được triển khai riêng biệt với lý lẽ/ví dụ cụ thể (không gộp lẫn hay bỏ sót phần nào).',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure with causes and institutional solutions organized into distinct, logically ordered paragraphs; smooth transitions between them.|||Cấu trúc đoạn rõ ràng, nguyên nhân và giải pháp từ cơ sở giáo dục được tổ chức thành các đoạn riêng biệt, trình bày theo trình tự hợp lý; chuyển ý mượt mà giữa các đoạn.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, varied sentence structure, correct grammar/mechanics, word count within 350-400.|||Văn phong học thuật, câu văn đa dạng, ngữ pháp/chính tả đúng, đủ số từ 350-400.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W28',
      source: 'REAL',
      title: 'ENW492c — Writing FE SU2026 (Stress in Young Adults: Causes and Institutional Solutions)|||ENW492c — Viết luận FE SU2026 (Stress ở Người trẻ: Nguyên nhân và Giải pháp từ Nhà trường)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SU2026). Compose a 350–400 word cause-solution essay on the main causes of stress among young adults and how educational institutions can help reduce it. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SU2026). Viết một bài luận nguyên nhân-giải pháp 350–400 từ về nguyên nhân chính gây stress ở người trẻ và cách các cơ sở giáo dục có thể giúp giảm stress. AI chấm theo tiêu chí.</p></div>',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p><b>How to take this exam.</b> Write your essay directly in the text box below. You have 60 minutes and a 350–400 word target. When you submit, AI grades your essay against the rubric and gives feedback.</p></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài.</b> Viết bài luận trực tiếp vào ô chữ bên dưới. Bạn có 60 phút, mục tiêu 350–400 từ. Khi nộp bài, AI sẽ chấm theo tiêu chí và cho nhận xét.</p></div>',
      questions: [
        {
          kind: 'WRITE',
          points: 10,
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W28/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write an essay of 350–400 words to answer the following question:</p><p>"<b>In recent years, there has been growing concern about young people\'s stress levels. What are the main causes of stress among young adults, and how can educational institutions help reduce it?</b>"</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận 350–400 từ trả lời câu hỏi sau:</p><p>"<b>Những năm gần đây, mối lo ngại về mức độ stress của người trẻ ngày càng tăng. Đâu là nguyên nhân chính gây stress ở người trẻ, và các cơ sở giáo dục có thể giúp giảm stress bằng cách nào?</b>"</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
