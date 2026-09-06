// AUTO-GENERATED bằng tay theo mẫu W1.mjs — nguồn `Kì 7/ENW492c/ENW492c - C1
// - FE - FA 2023 - W`, paper.pdf 1 trang, đề luận nguyên nhân-kết quả 450 từ.
// Cùng chủ đề với đề đọc hiểu FE3 ("Causes and Effects of Climate Change")
// nhưng là kỹ năng viết, đề gốc khác — vẫn build bình thường.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis statement identifies climate change as the focus and previews that the essay will discuss both its causes and its effects.|||Câu chủ đề rõ ràng xác định biến đổi khí hậu là trọng tâm và báo trước bài luận sẽ bàn cả nguyên nhân lẫn hậu quả.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Causes and effects are each explained with specific, accurate reasoning and concrete examples, not merely listed.|||Nguyên nhân và hậu quả đều được giải thích bằng lý lẽ cụ thể, chính xác và ví dụ rõ ràng, không chỉ liệt kê suông.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Distinct, logically ordered sections for causes and for effects (or clear cause-to-effect chains), with smooth transitions between them.|||Có phần riêng biệt, sắp xếp hợp lý cho nguyên nhân và cho hậu quả (hoặc chuỗi nhân-quả rõ ràng), chuyển ý mượt mà giữa các phần.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, varied sentence structure, correct grammar/mechanics, essay length close to the 450-word target.|||Văn phong học thuật, câu văn đa dạng, ngữ pháp/chính tả đúng, độ dài bài viết gần với mục tiêu 450 từ.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W3',
      source: 'REAL',
      title: 'ENW492c — Writing FE (Causes and Effects of Climate Change)|||ENW492c — Viết luận FE (Causes and Effects of Climate Change)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (FE, FA2023 retake set). Compose a 450-word essay discussing the causes and effects of climate change. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (FE, bộ đề FA2023 thi lại). Viết một bài luận 450 từ bàn về nguyên nhân và hậu quả của biến đổi khí hậu. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W3/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Task 1 — Time: 60 minutes.</b></p><p>Compose a 450-word essay discussing the causes and effects of climate change.</p></div>' +
            '<div class="ml-vi"><p><b>Bài 1 — Thời gian: 60 phút.</b></p><p>Viết một bài luận 450 từ bàn về nguyên nhân và hậu quả của biến đổi khí hậu.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
