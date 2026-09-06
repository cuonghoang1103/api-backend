// Đề gốc: `Kì 7/ENW492c/ENW492c - C2 - WFESP24`, paper.pdf 1 trang, đề luận
// 450 từ. LƯU Ý: cùng chủ đề với W1 (Prisons: Rehabilitation or Punishment?)
// nhưng là biến thể "C2" khác kỳ thi (450 từ thay vì 350-400) — giữ lại theo
// đúng quy tắc build (retake cùng đề vẫn là đề riêng hợp lệ trong dataset này).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stated explicitly and maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific reasoning/evidence supports the writer\'s position on punishment vs. rehabilitation; counterpoints are acknowledged where relevant.|||Lý lẽ/bằng chứng cụ thể ủng hộ lập trường của người viết về trừng phạt hay cải tạo; có ghi nhận quan điểm trái chiều khi phù hợp.',
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
      code: 'W14',
      source: 'REAL',
      title: 'ENW492c — Writing C2 (Prisons: Punishment or Rehabilitation?)|||ENW492c — Viết luận C2 (Nhà tù: Trừng phạt hay Cải tạo?)',
      description:
        '<div class="ml-en"><p>Real writing exam prompt (C2 variant). Compose a 450-word argumentative essay presenting your opinion on whether prisons should mainly focus on punishment or rehabilitation. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi thật (biến thể C2). Viết một bài luận thuyết phục 450 từ nêu quan điểm của bạn về việc nhà tù nên tập trung chủ yếu vào trừng phạt hay cải tạo. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W14/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Compose a 450-word argumentative essay presenting your opinion on whether prisons should mainly focus on punishment or rehabilitation.</p><p>(Essay / writing task — no multiple-choice options.)</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục 450 từ nêu quan điểm của bạn về việc nhà tù nên tập trung chủ yếu vào trừng phạt hay cải tạo.</p><p>(Bài luận viết — không có lựa chọn trắc nghiệm.)</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
