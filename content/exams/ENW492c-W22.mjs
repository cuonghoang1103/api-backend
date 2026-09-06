// Đề gốc: `Kì 7/ENW492c/ENW492c - SP26 - FE - W`, paper.pdf 1 trang, đề luận
// tranh luận (argumentative) 350-400 từ, 60 phút. CÙNG câu hỏi hệt như
// W5 (`ENW492c-W5.mjs`, nguồn C1-SU2024-W1) — "Should first-year academic
// writing courses be compulsory for all students...?" — nhưng là một lượt
// thi khác (SP26 FE), nên vẫn build làm đề riêng theo đúng quy tắc: đề thi
// lại/lượt khác của cùng câu hỏi là đề hợp lệ, không phải trùng lặp.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stating a position on whether first-year academic writing courses should be compulsory for all students, stated explicitly and maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu lập trường về việc có nên bắt buộc mọi sinh viên học môn viết học thuật năm nhất hay không, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Both sides of the issue (making the course compulsory for everyone vs. limiting it to international/non-native-English students) are weighed with specific reasoning/evidence before the writer\'s own position is justified.|||Cả hai phía của vấn đề (bắt buộc môn học cho tất cả mọi người so với chỉ giới hạn cho sinh viên quốc tế/không phải tiếng Anh bản ngữ) được cân nhắc bằng lý lẽ/bằng chứng cụ thể trước khi lập trường của người viết được biện minh.',
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
      code: 'W22',
      source: 'REAL',
      title: 'ENW492c — Writing FE SP26 (Should First-Year Writing Courses Be Compulsory?)|||ENW492c — Viết luận FE SP26 (Có nên bắt buộc học viết năm nhất?)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SP26, FE). Compose a 350–400 word argumentative essay weighing both sides on whether first-year academic writing courses should be compulsory for all students. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SP26, FE). Viết một bài luận thuyết phục 350–400 từ, cân nhắc cả hai phía về việc có nên bắt buộc mọi sinh viên học môn viết học thuật năm nhất hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W22/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Essay — Time: 60 minutes.</b></p><p>Compose an argumentative essay of 350–400 words on the following question: Should first-year academic writing courses be compulsory for all students—not just for international students or those whose first language is not English?</p><p>In your essay, weigh both sides of the issue and clearly present your own position.</p></div>' +
            '<div class="ml-vi"><p><b>Bài luận — Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục 350–400 từ trả lời câu hỏi sau: Có nên bắt buộc mọi sinh viên học môn viết học thuật năm nhất—không chỉ riêng sinh viên quốc tế hay những người có tiếng mẹ đẻ không phải tiếng Anh?</p><p>Trong bài luận, hãy cân nhắc cả hai phía của vấn đề và nêu rõ lập trường của riêng bạn.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
