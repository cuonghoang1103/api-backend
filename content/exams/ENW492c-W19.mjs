// Đề gốc: `Kì 7/ENW492c/ENW492c - RE - SU 2023 - W`, paper.pdf 1 trang, đề
// luận nguyên nhân-hệ quả-giải pháp (causes/effects/solutions essay) 400-450
// từ, 60 phút, yêu cầu cấu trúc cố định: mở bài (luận điểm), 3 đoạn thân bài
// (nguyên nhân, hệ quả, giải pháp), kết bài.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear argument/thesis statement in the introduction giving an opinion on whether performance-enhancing drugs should be banned in sport, maintained throughout the essay.|||Luận điểm rõ ràng ở mở bài nêu quan điểm về việc có nên cấm thuốc tăng cường thành tích trong thể thao hay không, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'The three required body paragraphs (causes, effects, and solutions of drug use to boost athletic performance) are each developed with specific, relevant supporting details.|||Ba đoạn thân bài bắt buộc (nguyên nhân, hệ quả, và giải pháp của việc dùng thuốc để tăng thành tích thể thao) đều được triển khai bằng chi tiết hỗ trợ cụ thể, liên quan.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Essay follows the required structure exactly (intro with thesis → causes paragraph → effects paragraph → solutions paragraph → concluding paragraph), with logical transitions.|||Bài luận tuân thủ đúng cấu trúc yêu cầu (mở bài có luận điểm → đoạn nguyên nhân → đoạn hệ quả → đoạn giải pháp → kết bài), chuyển ý mạch lạc.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, varied sentence structure, correct grammar/mechanics, word count within 400-450.|||Văn phong học thuật, câu văn đa dạng, ngữ pháp/chính tả đúng, đủ số từ 400-450.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W19',
      source: 'REAL',
      title: 'ENW492c — Writing RE (Performance-Enhancing Drugs in Sport)|||ENW492c — Viết luận RE (Thuốc Tăng cường Thành tích trong Thể thao)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (SU2023). Compose a 400-450 word essay organized into an introduction with thesis, three body paragraphs (causes, effects, solutions), and a conclusion, on whether performance-enhancing drugs should be banned in sport. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (SU2023). Viết một bài luận 400-450 từ theo cấu trúc mở bài có luận điểm, ba đoạn thân bài (nguyên nhân, hệ quả, giải pháp), và kết bài, về việc có nên cấm thuốc tăng cường thành tích trong thể thao hay không. AI chấm theo tiêu chí.</p></div>',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p><b>How to take this exam.</b> Write your essay directly in the text box below. You have 60 minutes and a 400-450 word target. When you submit, AI grades your essay against the rubric and gives feedback.</p></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài.</b> Viết bài luận trực tiếp vào ô chữ bên dưới. Bạn có 60 phút, mục tiêu 400-450 từ. Khi nộp bài, AI sẽ chấm theo tiêu chí và cho nhận xét.</p></div>',
      questions: [
        {
          kind: 'WRITE',
          points: 10,
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W19/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Compose an essay on the topic given below.</p>' +
            '<p>"<b>Many believe that using performance-enhancing drugs should be banned in sport. What is your opinion?</b>"</p>' +
            '<p>Produce a 400-450 word essay organized into multiple paragraphs. State your argument or thesis statement in the introduction. In the body of the essay, write three paragraphs, with each one covering the causes, effects, and solutions of using drugs to boost performance among athletes. End your essay with a concluding paragraph.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận về chủ đề dưới đây.</p>' +
            '<p>"<b>Nhiều người tin rằng việc sử dụng thuốc tăng cường thành tích nên bị cấm trong thể thao. Quan điểm của bạn là gì?</b>"</p>' +
            '<p>Viết một bài luận 400-450 từ được tổ chức thành nhiều đoạn. Nêu luận điểm hoặc quan điểm của bạn ở mở bài. Trong thân bài, viết ba đoạn, mỗi đoạn lần lượt trình bày nguyên nhân, hệ quả, và giải pháp của việc dùng thuốc để tăng thành tích ở vận động viên. Kết thúc bài luận bằng một đoạn kết.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
