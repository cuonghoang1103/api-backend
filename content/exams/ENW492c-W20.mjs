// Đề gốc: `Kì 7/ENW492c/ENW492c - SP 2025 - W - FE`, paper.pdf 1 trang, đề
// luận agree/disagree 350-400 từ, 60 phút, về việc sản xuất thực phẩm công
// nghiệp có cần thiết hay không dù có hại cho sức khoẻ/môi trường.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear position stating the extent to which the writer agrees or disagrees that industrial food production is essential despite its harmful effects, stated explicitly and maintained throughout the essay.|||Lập trường rõ ràng nêu mức độ đồng ý hay không đồng ý rằng sản xuất thực phẩm công nghiệp là cần thiết dù có tác hại, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific reasoning/evidence addressing BOTH the necessity of industrial food production for feeding a growing population AND its harmful effects on health and the environment, with the writer\'s stance justified against this trade-off.|||Lý lẽ/bằng chứng cụ thể đề cập CẢ HAI mặt: sự cần thiết của sản xuất thực phẩm công nghiệp để nuôi sống dân số ngày càng tăng VÀ tác hại của nó đối với sức khoẻ và môi trường, với lập trường của người viết được biện minh dựa trên sự đánh đổi này.',
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
      code: 'W20',
      source: 'REAL',
      title: 'ENW492c — Writing FE (Is Industrial Food Production Essential?)|||ENW492c — Viết luận FE (Sản xuất Thực phẩm Công nghiệp có Cần thiết?)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SP2025). Compose a 350–400 word agree/disagree essay on whether industrial food production is essential despite its harmful effects. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SP2025). Viết một bài luận đồng ý/không đồng ý 350–400 từ về việc sản xuất thực phẩm công nghiệp có cần thiết hay không dù có tác hại. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W20/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Question 1 — Writing. Time: 60 minutes.</b></p><p>As the world\'s population continues to grow, some people argue that industrial food production is essential even though it has harmful effects on health and the environment.</p><p><b>To what extent do you agree or disagree?</b></p><p>Write an essay of 350–400 words.</p></div>' +
            '<div class="ml-vi"><p><b>Câu 1 — Viết luận. Thời gian: 60 phút.</b></p><p>Khi dân số thế giới tiếp tục tăng, một số người cho rằng sản xuất thực phẩm công nghiệp là cần thiết dù nó gây hại cho sức khoẻ và môi trường.</p><p><b>Bạn đồng ý hay không đồng ý ở mức độ nào?</b></p><p>Viết một bài luận 350–400 từ.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
