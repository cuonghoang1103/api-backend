// Đề gốc: `Kì 7/ENW492c/ENW492c - W - RESP24`, paper.pdf 1 trang, Part 2:
// Writing Task — đề luận HẬU QUẢ (effect essay) ~450 từ về ảnh hưởng của
// việc trẻ em tiếp xúc nhiều với tài liệu số (e-book, audiobook, website,
// game...) đối với việc học — CHỈ bàn hậu quả, không yêu cầu nguyên nhân
// hay giải pháp; bắt buộc có chi tiết/ví dụ hỗ trợ.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis stating the overall nature of the effects (positive, negative, or mixed) that increasing exposure to digital materials has on children\'s learning, maintained throughout the essay.|||Luận điểm rõ ràng, nêu tính chất tổng quát của các hậu quả (tích cực, tiêu cực, hay hỗn hợp) mà việc tiếp xúc ngày càng nhiều với tài liệu số gây ra cho việc học của trẻ em, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Multiple distinct effects on children\'s learning are identified and each is supported with specific supporting details and examples, as required by the prompt (not vague assertions).|||Nhiều hậu quả riêng biệt đối với việc học của trẻ em được nêu ra, mỗi hậu quả được hỗ trợ bằng chi tiết và ví dụ cụ thể theo đúng yêu cầu của đề (không phải khẳng định chung chung, mơ hồ).',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body with one effect per paragraph/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-thân với mỗi đoạn một hậu quả-kết), chuyển ý mạch lạc giữa các luận điểm.',
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
      code: 'W29',
      source: 'REAL',
      title: 'ENW492c — Writing RESP24 (Effects of Digital Materials on Children\'s Learning)|||ENW492c — Viết luận RESP24 (Ảnh hưởng của Tài liệu số đến Việc học của Trẻ em)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (RESP24, Part 2). Compose a 450-word effect essay on how increasing exposure to digital materials might affect children\'s learning, with supporting details and examples. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (RESP24, Phần 2). Viết một bài luận hậu quả khoảng 450 từ về việc trẻ em ngày càng tiếp xúc với tài liệu số có thể ảnh hưởng thế nào đến việc học, kèm chi tiết và ví dụ hỗ trợ. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W29/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Part 2: Writing Task. Time: 60 minutes.</b></p><p>Children are now increasingly exposed to digital materials, e.g., e-books, audio books, interactive books, websites, blogs, video games, etc. What effects might this exposure have on children\'s learning?</p><p>Write an <b>effect essay</b> of around <b>450 words</b>. Support your essay with supporting details and examples.</p></div>' +
            '<div class="ml-vi"><p><b>Phần 2: Bài viết. Thời gian: 60 phút.</b></p><p>Trẻ em ngày nay ngày càng tiếp xúc nhiều với tài liệu số, ví dụ: sách điện tử, sách nói, sách tương tác, trang web, blog, trò chơi điện tử, v.v. Việc tiếp xúc này có thể ảnh hưởng thế nào đến việc học của trẻ em?</p><p>Viết một <b>bài luận hậu quả</b> khoảng <b>450 từ</b>. Hỗ trợ bài luận bằng các chi tiết và ví dụ cụ thể.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
