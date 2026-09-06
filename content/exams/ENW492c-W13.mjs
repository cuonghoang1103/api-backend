// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE của ENW492c
// (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - SU 2024 - W2`, paper.pdf 1 trang, đề
// luận thuyết phục 450 từ về nhà tù: trừng phạt hay cải tạo — CÙNG CHỦ ĐỀ với
// W1 (đề gốc FA2024-FE), nhưng đây là kỳ thi SU2024 khác nên vẫn là đề hợp lệ
// riêng biệt theo quy tắc "thi lại/kỳ khác cùng chủ đề" của dự án).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stated explicitly on whether the main focus of prisons should be punishment or rehabilitation, maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu tường minh về việc trọng tâm của nhà tù nên là trừng phạt hay cải tạo, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'The writer\'s position is justified with specific reasoning and evidence, while acknowledging and responding to the opposing view.|||Lập trường của người viết được biện minh bằng lý lẽ và bằng chứng cụ thể, đồng thời có ghi nhận và phản hồi quan điểm đối lập.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-thân-kết), chuyển ý mạch lạc giữa các luận điểm.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, varied sentence structure, correct grammar/mechanics, word count around 450.|||Văn phong học thuật, câu văn đa dạng, ngữ pháp/chính tả đúng, đủ số từ khoảng 450.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W13',
      source: 'REAL',
      title: 'ENW492c — Writing SU2024 W2 (Prisons: Punishment or Rehabilitation?)|||ENW492c — Viết luận SU2024 Bài 2 (Nhà tù: Trừng phạt hay Cải tạo?)',
      description:
        '<div class="ml-en"><p>Real writing exam prompt (SU2024, W2 version). Compose a 450-word argumentative essay presenting your position on whether the main focus of prisons should be punishment or rehabilitation. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thật (SU2024, phiên bản Bài 2). Viết một bài luận thuyết phục 450 từ trình bày lập trường của bạn về việc trọng tâm của nhà tù nên là trừng phạt hay cải tạo. AI chấm theo tiêu chí.</p></div>',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p><b>How to take this exam.</b> Write your essay directly in the text box below. You have 60 minutes and a 450-word target. When you submit, AI grades your essay against the rubric and gives feedback.</p></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài.</b> Viết bài luận trực tiếp vào ô chữ bên dưới. Bạn có 60 phút, mục tiêu 450 từ. Khi nộp bài, AI sẽ chấm theo tiêu chí và cho nhận xét.</p></div>',
      questions: [
        {
          kind: 'WRITE',
          points: 10,
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W13/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Task 1. Time: 60 minutes.</b></p><p>Write a 450-word argumentative essay presenting your position on whether the main focus of prisons should be punishment or rehabilitation.</p></div>' +
            '<div class="ml-vi"><p><b>Bài 1. Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục 450 từ trình bày lập trường của bạn về việc trọng tâm của nhà tù nên là trừng phạt hay cải tạo.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
