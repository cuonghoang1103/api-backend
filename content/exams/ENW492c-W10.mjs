// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE của ENW492c
// (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - FE - FA 2023 - W`, paper.pdf 1 trang,
// đề luận so sánh 450 từ giữa năng lượng thay thế và nhiên liệu hoá thạch).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis identifying the basis of comparison between alternative energy (wind/solar) and fossil fuels, maintained throughout the essay.|||Luận điểm rõ ràng xác định cơ sở so sánh giữa năng lượng thay thế (gió/mặt trời) và nhiên liệu hoá thạch, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific points of similarity and/or difference (e.g. cost, environmental impact, reliability) are developed with reasoning, examples, or evidence.|||Các điểm giống/khác cụ thể (VD: chi phí, tác động môi trường, độ ổn định) được phát triển bằng lý lẽ, ví dụ hoặc bằng chứng.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Consistent comparison structure (point-by-point or block method), clear paragraphing, logical transitions between points.|||Cấu trúc so sánh nhất quán (theo từng điểm hoặc theo khối), phân đoạn rõ ràng, chuyển ý mạch lạc giữa các điểm.',
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
      code: 'W10',
      source: 'REAL',
      title: 'ENW492c — Writing FE FA2023 (Alternative Energy vs Fossil Fuels)|||ENW492c — Viết luận FE FA2023 (Năng lượng Thay thế so với Nhiên liệu Hoá thạch)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (FA2023). Compose a 450-word essay comparing alternative energy sources (wind and solar power) with fossil fuels. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (FA2023). Viết một bài luận 450 từ so sánh các nguồn năng lượng thay thế (gió, mặt trời) với nhiên liệu hoá thạch. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W10/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Task 1. Time: 60 minutes.</b></p><p>Compose a 450-word essay comparing the use of alternative energy sources, including wind and solar power, with fossil fuels.</p></div>' +
            '<div class="ml-vi"><p><b>Bài 1. Thời gian: 60 phút.</b></p><p>Viết một bài luận 450 từ so sánh việc sử dụng các nguồn năng lượng thay thế, bao gồm điện gió và điện mặt trời, với nhiên liệu hoá thạch.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
