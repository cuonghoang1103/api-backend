// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE của ENW492c
// (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - FA 2024 - WRE`, paper.pdf 1 trang, đề
// luận effects 450 từ về khan hiếm nước — chủ đề gần với bài đọc FE1 "Better
// Water Conservation" nhưng đây là đề VIẾT khác câu hỏi nên không phải trùng).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis identifying the range of effects water shortage has on people and their lives, maintained throughout the essay.|||Luận điểm rõ ràng xác định phạm vi các tác động của khan hiếm nước đối với con người và cuộc sống, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Multiple specific effects (e.g. health, economic, social) are explained with reasoning, examples, or evidence rather than vague generalizations.|||Nhiều tác động cụ thể (VD: sức khoẻ, kinh tế, xã hội) được giải thích bằng lý lẽ, ví dụ hoặc bằng chứng thay vì khái quát mơ hồ.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Effects are organized logically (e.g. by category or order of importance), with clear paragraph structure and transitions.|||Các tác động được sắp xếp mạch lạc (VD: theo nhóm hoặc mức độ quan trọng), cấu trúc đoạn rõ ràng, chuyển ý hợp lý.',
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
      code: 'W9',
      source: 'REAL',
      title: 'ENW492c — Writing WRE FA2024 (Effects of Water Shortage)|||ENW492c — Viết luận WRE FA2024 (Tác động của Khan hiếm nước)',
      description:
        '<div class="ml-en"><p>Real writing exam prompt (FA2024, retake/WRE version). Compose a 450-word essay discussing the effects water shortage may have on people and their lives. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thật (FA2024, phiên bản WRE/thi lại). Viết một bài luận 450 từ bàn về những tác động mà khan hiếm nước có thể gây ra cho con người và cuộc sống của họ. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W9/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Part 2: Writing Task. Time: 60 minutes.</b></p><p>In certain parts of Vietnam, as in many countries around the world, people are facing water shortage.</p><p>Write an essay of about 450 words discussing the effects water shortage may have on people and their lives.</p></div>' +
            '<div class="ml-vi"><p><b>Phần 2: Bài viết. Thời gian: 60 phút.</b></p><p>Ở một số vùng của Việt Nam, cũng như nhiều quốc gia trên thế giới, người dân đang phải đối mặt với tình trạng khan hiếm nước.</p><p>Viết một bài luận khoảng 450 từ bàn về những tác động mà khan hiếm nước có thể gây ra cho con người và cuộc sống của họ.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
