// Đề gốc: `Kì 7/ENW492c/ENW492c - FE - SU 2023 - W`, paper.pdf 1 trang, đề
// luận đồng ý/không đồng ý (agree/disagree essay) 400-450 từ, 60 phút.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear position stated (agree/disagree, or a qualified stance) on whether community gardens would bring many benefits to FPT University, maintained throughout the essay.|||Nêu rõ lập trường (đồng ý/không đồng ý, hoặc quan điểm có điều kiện) về việc vườn cộng đồng có mang lại nhiều lợi ích cho Đại học FPT hay không, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific reasons and evidence back up the opinion (e.g. concrete benefits or drawbacks of a community garden at FPT University), with plausible counterpoints acknowledged.|||Lý do và bằng chứng cụ thể ủng hộ quan điểm (ví dụ lợi ích hoặc bất lợi cụ thể của vườn cộng đồng tại Đại học FPT), có ghi nhận quan điểm trái chiều hợp lý.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-thân-kết), chuyển ý mạch lạc giữa các luận điểm.',
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
      code: 'W18',
      source: 'REAL',
      title: 'ENW492c — Writing FE (Community Gardens at FPT University)|||ENW492c — Viết luận FE (Vườn Cộng đồng tại Đại học FPT)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SU2023). Compose a 400-450 word argumentative essay backing up your opinion on whether community gardens would bring many benefits to FPT University. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SU2023). Viết một bài luận thuyết phục 400-450 từ bảo vệ quan điểm của bạn về việc vườn cộng đồng có mang lại nhiều lợi ích cho Đại học FPT hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W18/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write an essay about the topic given below.</p>' +
            '<p>"<b>Community gardens would bring many benefits to FPT University. Do you agree?</b>"</p>' +
            '<p>Compose an argumentative essay of 400-450 words to back up your opinion.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận về chủ đề dưới đây.</p>' +
            '<p>"<b>Vườn cộng đồng sẽ mang lại nhiều lợi ích cho Đại học FPT. Bạn có đồng ý không?</b>"</p>' +
            '<p>Viết một bài luận thuyết phục 400-450 từ để bảo vệ quan điểm của bạn.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
