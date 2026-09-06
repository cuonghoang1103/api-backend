// Đề gốc: `Kì 7/ENW492c/ENW492c - FA25 - FE - Writing`, paper.pdf 1 trang, đề
// luận giải pháp (problem-solution essay) 450 từ, 60 phút.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis stating the writer\'s overall stance on how technology can be effectively used in the classroom, maintained throughout the essay.|||Luận điểm rõ ràng nêu lập trường tổng quát của người viết về cách sử dụng công nghệ hiệu quả trong lớp học, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Concrete, practical solutions for effective classroom technology use are proposed and supported with specific evidence/examples, acknowledging the concern that devices can cause more harm than good.|||Đề xuất các giải pháp cụ thể, khả thi cho việc dùng công nghệ hiệu quả trong lớp học, có bằng chứng/ví dụ cụ thể, đồng thời ghi nhận lo ngại rằng thiết bị có thể gây hại nhiều hơn lợi.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body solutions/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-các giải pháp-kết), chuyển ý mạch lạc giữa các luận điểm.',
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
      code: 'W16',
      source: 'REAL',
      title: 'ENW492c — Writing FE (Effective Use of Technology in the Classroom)|||ENW492c — Viết luận FE (Sử dụng Công nghệ Hiệu quả trong Lớp học)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (FA25). Compose a 450-word argumentative essay presenting solutions for the effective use of technology among younger learners, backed by evidence. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (FA25). Viết một bài luận thuyết phục 450 từ trình bày các giải pháp sử dụng công nghệ hiệu quả cho học sinh nhỏ tuổi, có bằng chứng hỗ trợ. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W16/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write an argumentative essay of approximately 450 words on the topic below.</p>' +
            '<p>Many people believe that high school and younger students should be allowed to use devices, e.g., phones, iPads, and computers, to assist learning in class. Others, however, maintain that they are still too young to control the devices they use, so there might be more harm than good. But like it or not, technology has increasingly become an integral part of education.</p>' +
            '<p>How can technology be effectively used in the classroom?</p>' +
            '<p>Write an essay presenting some solutions for the effective use of technology among younger learners. Support your essay with evidence.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận thuyết phục khoảng 450 từ về chủ đề dưới đây.</p>' +
            '<p>Nhiều người tin rằng học sinh trung học và nhỏ tuổi hơn nên được phép sử dụng thiết bị, ví dụ điện thoại, iPad và máy tính, để hỗ trợ việc học trên lớp. Tuy nhiên, số khác cho rằng các em vẫn còn quá nhỏ để kiểm soát thiết bị mình dùng, nên có thể gây hại nhiều hơn lợi. Nhưng dù muốn hay không, công nghệ ngày càng trở thành một phần không thể thiếu của giáo dục.</p>' +
            '<p>Làm thế nào để sử dụng công nghệ hiệu quả trong lớp học?</p>' +
            '<p>Viết một bài luận trình bày một số giải pháp để sử dụng công nghệ hiệu quả ở học sinh nhỏ tuổi hơn. Hỗ trợ bài luận của bạn bằng bằng chứng.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
