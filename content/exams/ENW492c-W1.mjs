// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — WRITE PE đầu tiên của
// ENW492c, dùng để TEST luồng submit-write → gradeWrite trước khi làm hàng
// loạt các đề Writing khác của môn này (đề gốc: `Kì 7/ENW492c/ENW492c - C1 -
// FA 2024 - W - FE`, paper.pdf 1 trang, đề luận 350-400 từ).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stated explicitly and maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Both sides of the argument are weighed with specific reasoning/evidence before the writer\'s own position is justified.|||Cả hai phía của lập luận được cân nhắc bằng lý lẽ/bằng chứng cụ thể trước khi lập trường của người viết được biện minh.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-thân-kết), chuyển ý mạch lạc giữa các luận điểm.',
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
      code: 'W1',
      source: 'REAL',
      title: 'ENW492c — Writing FE (Prisons: Rehabilitation or Punishment?)|||ENW492c — Viết luận FE (Prisons: Rehabilitation or Punishment?)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt. Compose a 350–400 word argumentative essay weighing both sides, then present your own position. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật. Viết một bài luận thuyết phục 350–400 từ, cân nhắc cả hai phía rồi nêu lập trường của bạn. AI chấm theo tiêu chí.</p></div>',
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
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Compose an argumentative essay of 350–400 words answering the following question:</p><p>"<b>Prisons: Rehabilitation or Punishment?</b>"</p><p>In your essay, weigh both sides of the argument and clearly present your own position.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục 350–400 từ trả lời câu hỏi sau:</p><p>"<b>Nhà tù: Cải tạo hay Trừng phạt?</b>"</p><p>Trong bài luận, hãy cân nhắc cả hai phía của lập luận và nêu rõ lập trường của riêng bạn.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
