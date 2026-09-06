// Đề gốc: `Kì 7/ENW492c/ENW492c - SU25 - FE - Writing`, paper.pdf 1 trang, đề
// luận đồng ý/không đồng ý (agree/disagree essay) 350-400 từ về việc sinh
// viên nên sống ở nước ngoài một thời gian để học ngôn ngữ/văn hoá.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis stating the writer\'s degree of agreement or disagreement (fully agree, partly agree, disagree, etc.) with the view that students should live abroad as part of their education, maintained throughout the essay.|||Luận điểm rõ ràng, nêu mức độ đồng ý hay không đồng ý (hoàn toàn đồng ý, đồng ý một phần, không đồng ý, v.v.) với quan điểm sinh viên nên sống ở nước ngoài như một phần của việc học, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'The position is supported with specific reasoning/evidence tied to living abroad for language and culture learning; the opposing view is acknowledged and addressed, not ignored.|||Lập trường được hỗ trợ bằng lý lẽ/bằng chứng cụ thể gắn với việc sống ở nước ngoài để học ngôn ngữ và văn hoá; quan điểm đối lập được thừa nhận và giải quyết, không bị bỏ qua.',
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
      code: 'W26',
      source: 'REAL',
      title: 'ENW492c — Writing FE SU2025 (Living Abroad as Part of Education)|||ENW492c — Viết luận FE SU2025 (Sống ở Nước ngoài như một phần của Việc học)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SU2025). Compose a 350–400 word agree/disagree essay on whether students should spend time living in a foreign country as part of their education. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SU2025). Viết một bài luận đồng ý/không đồng ý 350–400 từ về việc sinh viên có nên dành thời gian sống ở nước ngoài như một phần của việc học hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W26/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write an essay of 350–400 words responding to the question below:</p><p>"<b>As part of their education, students should spend a period of time living in a foreign country to learn its language and culture.</b>"</p><p>To what extent do you agree or disagree with this viewpoint?</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận 350–400 từ trả lời câu hỏi sau:</p><p>"<b>Là một phần của việc học, sinh viên nên dành một khoảng thời gian sống ở nước ngoài để học ngôn ngữ và văn hoá của nước đó.</b>"</p><p>Bạn đồng ý hay không đồng ý với quan điểm này ở mức độ nào?</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
