// Đề gốc: `Kì 7/ENW492c/ENW492c - SP26 - RE - W`, paper.pdf 1 trang, đề luận
// nhân-quả (cause-and-effect) 350-400 từ, 60 phút, về ô nhiễm không khí —
// yêu cầu BA phần bắt buộc: nguyên nhân, tác động tới cuộc sống hằng ngày
// của dân cư đô thị, và đề xuất giải pháp giảm thiểu tác hại. Khác cấu trúc
// với các đề agree/disagree hay weigh-both-sides khác trong môn, nên rubric
// tổ chức phải kiểm đúng ba phần này, không phải mở-thân-kết chung chung.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear introductory statement of focus establishing that the essay will identify the causes of air pollution, its effects on urban populations\' daily lives, and solutions to reduce its detrimental effects — maintained throughout the essay.|||Câu mở đầu nêu rõ trọng tâm rằng bài luận sẽ trình bày nguyên nhân của ô nhiễm không khí, tác động của nó tới cuộc sống hằng ngày của dân cư đô thị, và giải pháp để giảm thiểu tác hại — giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific causes of air pollution are identified, AND their effects on urban populations\' daily lives are explained with concrete detail, AND practical suggestions to reduce the detrimental effects are proposed — all three parts substantiated with reasoning/evidence.|||Các nguyên nhân cụ thể của ô nhiễm không khí được nêu rõ, VÀ tác động của chúng tới cuộc sống hằng ngày của dân cư đô thị được giải thích với chi tiết cụ thể, VÀ các đề xuất khả thi để giảm thiểu tác hại được đưa ra — cả ba phần đều được lập luận/dẫn chứng đầy đủ.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'The essay follows the required cause → effect → solution structure with a distinct section for causes, a distinct section for effects on urban daily life, and a distinct section for solutions, with logical transitions between them.|||Bài luận theo đúng cấu trúc bắt buộc nguyên nhân → tác động → giải pháp, có đoạn riêng cho nguyên nhân, đoạn riêng cho tác động tới đời sống đô thị, và đoạn riêng cho giải pháp, chuyển ý mạch lạc giữa các phần.',
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
      code: 'W24',
      source: 'REAL',
      title: 'ENW492c — Writing RE SP26 (Causes and Effects of Air Pollution)|||ENW492c — Viết luận RE SP26 (Nguyên nhân và Tác động của Ô nhiễm Không khí)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (SP26, RE). Compose a 350–400 word cause-and-effect essay on air pollution: its causes, its effects on urban populations\' daily lives, and solutions to reduce the harm. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (SP26, RE). Viết một bài luận nhân-quả 350–400 từ về ô nhiễm không khí: nguyên nhân, tác động tới cuộc sống hằng ngày của dân cư đô thị, và giải pháp giảm thiểu tác hại. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W24/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Essay — Time: 60 minutes.</b></p><p>Compose a cause-and-effect essay of 350–400 words on the following prompt:</p><p>Describe the causes of air pollution and how air pollution affects people\'s daily lives, with specific reference to urban populations.</p><p>Suggest how the detrimental effects of air pollution may be reduced.</p></div>' +
            '<div class="ml-vi"><p><b>Bài luận — Thời gian: 60 phút.</b></p><p>Viết một bài luận nhân-quả 350–400 từ theo đề bài sau:</p><p>Mô tả các nguyên nhân của ô nhiễm không khí và cách ô nhiễm không khí ảnh hưởng đến cuộc sống hằng ngày của con người, với dẫn chứng cụ thể về dân cư đô thị.</p><p>Đề xuất cách giảm thiểu tác hại của ô nhiễm không khí.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
