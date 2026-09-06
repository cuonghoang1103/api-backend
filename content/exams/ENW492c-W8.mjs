// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE thứ hai của
// ENW492c (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - FA 2024 - W - FE`, paper.pdf 1
// trang, đề luận problem-solution 450 từ về cyberbullying — chủ đề trùng với
// bài đọc FE5/FE6 "Cyberbullying: Addressing the Problem" nhưng đây là đề VIẾT
// nên không phải trùng lặp thật).
const RUBRIC = [
  {
    id: 'problem', maxScore: 3, weight: 3,
    criterion: 'Clearly identifies and explains the problem (how cyberbullying impacts teenage internet users), stating a thesis that frames the problem-solution structure.|||Nhận diện và giải thích rõ vấn đề (cyberbullying tác động thế nào đến người dùng internet tuổi teen), nêu luận điểm định hình cấu trúc vấn đề-giải pháp.',
  },
  {
    id: 'solution', maxScore: 3, weight: 3,
    criterion: 'Proposes specific, well-reasoned solutions directly addressing the impacts described, supported by examples or evidence.|||Đề xuất các giải pháp cụ thể, có lý lẽ, giải quyết trực tiếp những tác động đã nêu, có ví dụ/bằng chứng hỗ trợ.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear problem-solution paragraph structure (intro/problem/solution/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng theo mô hình vấn đề-giải pháp (mở-vấn đề-giải pháp-kết), chuyển ý mạch lạc.',
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
      code: 'W8',
      source: 'REAL',
      title: 'ENW492c — Writing FE FA2024 (Cyberbullying: Problem-Solution)|||ENW492c — Viết luận FE FA2024 (Cyberbullying: Vấn đề-Giải pháp)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (FA2024). Compose a 450-word problem-solution essay on how cyberbullying impacts teenage internet users. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (FA2024). Viết một bài luận vấn đề-giải pháp 450 từ về tác động của cyberbullying đối với người dùng internet tuổi teen. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W8/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>"<b>How does cyberbullying impact teenage internet users?</b>"</p><p>Compose a problem-solution essay of 450 words on cyberbullying.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>"<b>Cyberbullying tác động thế nào đến người dùng internet ở tuổi teen?</b>"</p><p>Viết một bài luận vấn đề-giải pháp 450 từ về cyberbullying.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
