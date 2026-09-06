// Đề gốc: `Kì 7/ENW492c/ENW492c - SP 2025 - W - RE`, paper.pdf 1 trang, đề
// luận khảo sát (examine) 350-400 từ về xếp hạng đại học — KHÔNG phải dạng
// agree/disagree một lập trường, mà là bài phân tích hai vế: (1) xếp hạng
// ảnh hưởng thế nào tới quyết định của sinh viên, (2) xếp hạng có đáng tin
// cậy như một thước đo chất lượng học thuật hay không. PDF không ghi thời
// gian rõ, dùng mặc định 60 phút như mọi đề Writing khác trong môn.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear central claim addressing BOTH required components — how university rankings affect student decision-making, and whether they are a dependable measure of academic quality — stated explicitly and maintained throughout.|||Luận điểm trung tâm rõ ràng đề cập CẢ HAI yêu cầu: xếp hạng đại học ảnh hưởng thế nào đến quyết định của sinh viên, và liệu chúng có phải thước đo đáng tin cậy về chất lượng học thuật hay không, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific reasoning/evidence exploring (a) the influence of rankings on where students choose to apply and enroll, and (b) the reliability and limitations of rankings as an indicator of academic quality — both parts substantively developed.|||Lý lẽ/bằng chứng cụ thể khảo sát (a) ảnh hưởng của xếp hạng đến việc sinh viên chọn nộp đơn và nhập học ở đâu, và (b) độ tin cậy và giới hạn của xếp hạng như một chỉ báo chất lượng học thuật — cả hai phần được triển khai đầy đủ.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure covering both required components (influence on decision-making; dependability as a quality measure) with logical transitions between ideas.|||Cấu trúc đoạn rõ ràng bao quát cả hai yêu cầu (ảnh hưởng tới quyết định; độ tin cậy như thước đo chất lượng), chuyển ý mạch lạc giữa các luận điểm.',
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
      code: 'W21',
      source: 'REAL',
      title: 'ENW492c — Writing RE (University Rankings and Academic Quality)|||ENW492c — Viết luận RE (Xếp hạng Đại học và Chất lượng Học thuật)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (SP2025). Compose a 350–400 word essay examining how university rankings affect student decision-making and whether they are a dependable measure of academic quality. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (SP2025). Viết một bài luận 350–400 từ khảo sát việc xếp hạng đại học ảnh hưởng thế nào tới quyết định của sinh viên và liệu chúng có đáng tin cậy như thước đo chất lượng học thuật hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W21/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Question 1 — Writing topic. Time: 60 minutes.</b></p><p>University rankings often shape where students decide to apply and enroll. Even so, they are not always the most accurate measure of academic quality.</p><p>Write an essay of 350–400 words examining how university rankings affect student decision-making and whether they can be considered a dependable measure of academic quality.</p></div>' +
            '<div class="ml-vi"><p><b>Câu 1 — Chủ đề bài viết. Thời gian: 60 phút.</b></p><p>Xếp hạng đại học thường định hình việc sinh viên quyết định nộp đơn và nhập học ở đâu. Dù vậy, chúng không phải lúc nào cũng là thước đo chính xác nhất về chất lượng học thuật.</p><p>Viết một bài luận 350–400 từ khảo sát việc xếp hạng đại học ảnh hưởng thế nào đến quyết định của sinh viên và liệu chúng có thể được xem là thước đo đáng tin cậy về chất lượng học thuật hay không.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
