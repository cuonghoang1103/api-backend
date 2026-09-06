// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE của ENW492c
// (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - RE - FA 2023 - W`, paper.pdf 1 trang,
// đề luận thuyết phục 450 từ về chi tiêu thám hiểm không gian — cùng kỳ FA2023
// với W10 nhưng là đề thi lại (RE) với câu hỏi HOÀN TOÀN khác, không trùng).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stated explicitly on whether space exploration spending is justified, maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu tường minh về việc chi tiêu cho thám hiểm không gian có hợp lý hay không, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Both views (space exploration spending is a waste vs. it is worthwhile) are weighed with specific reasoning/evidence before the writer\'s own position is justified.|||Cả hai quan điểm (chi tiêu cho không gian là lãng phí so với xứng đáng) được cân nhắc bằng lý lẽ/bằng chứng cụ thể trước khi lập trường của người viết được biện minh.',
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
      code: 'W11',
      source: 'REAL',
      title: 'ENW492c — Writing RE FA2023 (Space Exploration Spending)|||ENW492c — Viết luận RE FA2023 (Chi tiêu Thám hiểm Không gian)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (FA2023, RE version). Compose a 450-word argumentative essay weighing both views on government space exploration spending, then present your own position. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (FA2023, phiên bản RE). Viết một bài luận thuyết phục 450 từ cân nhắc cả hai quan điểm về chi tiêu của chính phủ cho thám hiểm không gian, rồi nêu lập trường của bạn. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W11/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Part 2: Writing Task. Time: 60 minutes.</b></p><p>Compose an argumentative essay of about 450 words on the topic below.</p><p>"<b>Governments around the world are investing heavily in space exploration missions. Some people believe that such spending is a waste of money and that these funds would be better used to address more pressing problems on Earth. Discuss both views and give your own opinion.</b>"</p></div>' +
            '<div class="ml-vi"><p><b>Phần 2: Bài viết. Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục khoảng 450 từ về chủ đề dưới đây.</p><p>"<b>Các chính phủ trên thế giới đang đầu tư mạnh vào các sứ mệnh thám hiểm không gian. Một số người cho rằng khoản chi này là lãng phí và số tiền đó nên được dùng để giải quyết những vấn đề cấp bách hơn trên Trái Đất. Hãy bàn luận cả hai quan điểm và nêu ý kiến riêng của bạn.</b>"</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
