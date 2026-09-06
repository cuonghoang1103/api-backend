// Đề gốc: `Kì 7/ENW492c/ENW492c - SU 2023 - W - 4`, paper.pdf 1 trang, đề luận
// nguyên nhân-hậu quả-giải pháp (cause-effect-solution essay) 350-400 từ về
// việc dùng AI (ChatGPT) gian lận thi cử — bắt buộc bàn CẢ BA phần: nguyên
// nhân, hậu quả tiêu cực, và giải pháp.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis statement identifying that the essay will address the causes, negative effects, and solutions of AI misuse (e.g. ChatGPT) in exams, maintained throughout the essay.|||Luận điểm rõ ràng, xác định bài luận sẽ bàn về nguyên nhân, hậu quả tiêu cực và giải pháp của việc lạm dụng AI (như ChatGPT) trong thi cử, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'ALL THREE required parts — causes, negative effects, AND possible solutions — are each developed with specific, distinct reasoning/examples (not merged or one part skipped).|||CẢ BA phần bắt buộc — nguyên nhân, hậu quả tiêu cực, VÀ giải pháp khả thi — đều được triển khai riêng biệt với lý lẽ/ví dụ cụ thể (không gộp lẫn hay bỏ sót phần nào).',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure with causes, effects, and solutions organized into distinct, logically ordered paragraphs; smooth transitions between them.|||Cấu trúc đoạn rõ ràng, nguyên nhân, hậu quả và giải pháp được tổ chức thành các đoạn riêng biệt, trình bày theo trình tự hợp lý; chuyển ý mượt mà giữa các đoạn.',
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
      code: 'W25',
      source: 'REAL',
      title: 'ENW492c — Writing SU2023 (AI Misuse in Exams: Causes, Effects, Solutions)|||ENW492c — Viết luận SU2023 (Lạm dụng AI trong Thi cử: Nguyên nhân, Hậu quả, Giải pháp)',
      description:
        '<div class="ml-en"><p>Real writing exam prompt (SU2023, paper #4). Compose a 350–400 word cause-effect-solution essay on AI misuse (e.g. ChatGPT) violating academic integrity in exams. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi thật (SU2023, đề số 4). Viết một bài luận nguyên nhân-hậu quả-giải pháp 350–400 từ về việc lạm dụng AI (như ChatGPT) vi phạm liêm chính học thuật trong thi cử. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W25/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Compose a well-organized essay of 350–400 words on the topic below:</p><p>"<b>An artificial intelligence (AI) content generator like ChatGPT has been abused by some students in the exams, which violates academic integrity in their university.</b>"</p><p>In your essay, discuss the main causes, negative effects, and possible solutions to this problem.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận có tổ chức tốt 350–400 từ về chủ đề dưới đây:</p><p>"<b>Một công cụ AI tạo nội dung như ChatGPT đã bị một số sinh viên lạm dụng trong các kỳ thi, vi phạm liêm chính học thuật tại trường đại học của họ.</b>"</p><p>Trong bài luận, hãy bàn về nguyên nhân chính, hậu quả tiêu cực, và các giải pháp khả thi cho vấn đề này.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
