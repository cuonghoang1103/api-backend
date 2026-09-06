// Đề gốc: `Kì 7/ENW492c/ENW492c - SU25 - RE - Writing`, paper.pdf 1 trang, đề
// luận đồng ý/không đồng ý (agree/disagree essay) 350-400 từ về việc các
// phẩm chất thành công (sáng tạo, thích nghi, lãnh đạo) có học được ở đại
// học hay không.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis stating the writer\'s degree of agreement or disagreement with the view that qualities such as creativity, adaptability, and leadership cannot be learned at university, maintained throughout the essay.|||Luận điểm rõ ràng, nêu mức độ đồng ý hay không đồng ý với quan điểm rằng các phẩm chất như sáng tạo, khả năng thích nghi và lãnh đạo không thể học được ở đại học, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'The position is supported with specific reasoning/evidence about how such qualities are (or are not) developed through academic institutions vs. other means (e.g. work, life experience); the opposing view is acknowledged and addressed.|||Lập trường được hỗ trợ bằng lý lẽ/bằng chứng cụ thể về việc các phẩm chất này được (hoặc không được) hình thành qua môi trường học thuật so với các con đường khác (như công việc, trải nghiệm sống); quan điểm đối lập được thừa nhận và giải quyết.',
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
      code: 'W27',
      source: 'REAL',
      title: 'ENW492c — Writing RE SU2025 (Can Success Qualities Be Learned at University?)|||ENW492c — Viết luận RE SU2025 (Phẩm chất Thành công có Học được ở Đại học?)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (SU2025). Compose a 350–400 word agree/disagree essay on whether qualities needed for success (creativity, adaptability, leadership) can be learned at university. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (SU2025). Viết một bài luận đồng ý/không đồng ý 350–400 từ về việc các phẩm chất cần để thành công (sáng tạo, thích nghi, lãnh đạo) có thể học được ở đại học hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W27/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Compose an essay of 350–400 words responding to the question below:</p><p>"<b>Some people believe that the qualities (e.g., creativity, adaptability, leadership) needed to become successful in today\'s world cannot be learned at a university or other academic institutions.</b>"</p><p>Do you agree or disagree with this viewpoint?</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận 350–400 từ trả lời câu hỏi sau:</p><p>"<b>Một số người cho rằng các phẩm chất (ví dụ: sáng tạo, khả năng thích nghi, lãnh đạo) cần thiết để thành công trong thế giới ngày nay không thể học được ở đại học hay các cơ sở học thuật khác.</b>"</p><p>Bạn có đồng ý hay không đồng ý với quan điểm này?</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
