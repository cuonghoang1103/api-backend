// Đề gốc: `Kì 7/ENW492c/ENW492c - FA 2024 - W - RE`, paper.pdf 1 trang, đề
// luận so sánh (comparison essay) 450 từ, 60 phút.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear comparative thesis stating the overall relationship (advantages/disadvantages) between alternative energy and fossil fuels, maintained throughout the essay.|||Luận điểm so sánh rõ ràng nêu mối quan hệ tổng quát (ưu/nhược điểm) giữa năng lượng thay thế và nhiên liệu hoá thạch, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific points of comparison (e.g. cost, environmental impact, reliability, availability) are developed with concrete details/evidence for both wind/solar power and fossil fuels.|||Các điểm so sánh cụ thể (chi phí, tác động môi trường, độ tin cậy, tính sẵn có...) được triển khai bằng chi tiết/bằng chứng cụ thể cho cả năng lượng gió/mặt trời lẫn nhiên liệu hoá thạch.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear comparison structure (point-by-point or block method), logical transitions between ideas, intro/conclusion frame the comparison.|||Cấu trúc so sánh rõ ràng (theo từng điểm hoặc theo khối), chuyển ý mạch lạc, mở-kết bài đóng khung được phần so sánh.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, comparative/contrastive language (whereas, in contrast, similarly), correct grammar/mechanics, word count around 450.|||Văn phong học thuật, dùng từ nối so sánh/tương phản (whereas, in contrast, similarly...), ngữ pháp/chính tả đúng, đủ số từ khoảng 450.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W15',
      source: 'REAL',
      title: 'ENW492c — Writing RE (Alternative Energy vs. Fossil Fuels)|||ENW492c — Viết luận RE (Năng lượng thay thế và Nhiên liệu hoá thạch)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (FA 2024). Compose a 450-word comparison essay weighing the use of alternative energy sources against fossil fuels. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (FA 2024). Viết một bài luận so sánh 450 từ đối chiếu việc sử dụng năng lượng thay thế với nhiên liệu hoá thạch. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W15/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write a 450-word essay comparing the use of alternative sources of energy, such as wind and solar power, with fossil fuels.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận 450 từ so sánh việc sử dụng các nguồn năng lượng thay thế, như năng lượng gió và mặt trời, với nhiên liệu hoá thạch.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
