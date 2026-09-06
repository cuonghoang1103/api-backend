// Đề gốc: `Kì 7/ENW492c/ENW492c - FA25 - RE - W`, paper.pdf 1 trang, đề luận
// tranh luận (argumentative essay) 400-450 từ, 60 phút, bắt buộc có
// counterargument.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear, arguable thesis stating an opinion on whether students still need to learn writing given AI/NLP tools like ChatGPT, maintained throughout the essay.|||Luận điểm rõ ràng, có thể tranh luận, nêu quan điểm về việc học sinh có còn cần học viết hay không khi có công cụ AI/NLP như ChatGPT, giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'The viewpoint is backed up with relevant supporting ideas, details, and examples from various contexts (personal experience, academic settings, current events), AND the essay includes a genuine counterargument that is addressed.|||Quan điểm được hỗ trợ bằng ý tưởng, chi tiết và ví dụ liên quan từ nhiều bối cảnh (trải nghiệm cá nhân, học thuật, sự kiện thời sự), VÀ bài luận có một phản luận thực sự được giải quyết.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Clear paragraph structure (intro/body/counterargument/conclusion), logical transitions between ideas.|||Cấu trúc đoạn rõ ràng (mở-thân-phản luận-kết), chuyển ý mạch lạc giữa các luận điểm.',
  },
  {
    id: 'language', maxScore: 2, weight: 2,
    criterion: 'Academic tone, varied sentence structure, correct grammar/mechanics, word count within 400-450.|||Văn phong học thuật, câu văn đa dạng, ngữ pháp/chính tả đúng, đủ số từ 400-450.',
  },
];

export default {
  course: { courseCode: 'ENW492c' },
  exams: [
    {
      kind: 'PE',
      peType: 'WRITE',
      code: 'W17',
      source: 'REAL',
      title: 'ENW492c — Writing RE (Do Students Still Need to Learn Writing in the AI Era?)|||ENW492c — Viết luận RE (Học sinh có còn cần học viết trong thời đại AI?)',
      description:
        '<div class="ml-en"><p>Real writing retake-exam prompt (FA25). Compose a 400-450 word argumentative essay on whether students still need to learn writing given AI writing tools, with a required counterargument. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi lại thật (FA25). Viết một bài luận thuyết phục 400-450 từ về việc học sinh có còn cần học viết hay không khi có công cụ AI viết văn, bắt buộc có phản luận. AI chấm theo tiêu chí.</p></div>',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p><b>How to take this exam.</b> Write your essay directly in the text box below. You have 60 minutes and a 400-450 word target. When you submit, AI grades your essay against the rubric and gives feedback.</p></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài.</b> Viết bài luận trực tiếp vào ô chữ bên dưới. Bạn có 60 phút, mục tiêu 400-450 từ. Khi nộp bài, AI sẽ chấm theo tiêu chí và cho nhận xét.</p></div>',
      questions: [
        {
          kind: 'WRITE',
          points: 10,
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W17/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p><b>Reading passage:</b> Given the recent rapid progress in technology, especially generative systems powered by Artificial Intelligence (AI), many people question whether students still need to learn writing or could simply hand over their writing assignments to natural language processing (NLP) models that are capable of producing human-like text, such as ChatGPT.</p>' +
            '<p><b>Writing task:</b> Write an argumentative essay of approximately 400-450 words presenting your opinion on this issue. Back up your viewpoint with relevant supporting ideas, details, and examples drawn from various contexts, such as personal experiences, academic settings, or current events. The essay should also include a counterargument.</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p><b>Đoạn dẫn:</b> Trước sự phát triển nhanh chóng gần đây của công nghệ, đặc biệt là các hệ thống sinh (generative) chạy bằng Trí tuệ Nhân tạo (AI), nhiều người đặt câu hỏi liệu học sinh có còn cần học viết hay không, hay có thể đơn giản giao bài viết cho các mô hình xử lý ngôn ngữ tự nhiên (NLP) có khả năng tạo văn bản giống người, như ChatGPT.</p>' +
            '<p><b>Yêu cầu viết:</b> Viết một bài luận thuyết phục khoảng 400-450 từ nêu quan điểm của bạn về vấn đề này. Hỗ trợ quan điểm bằng ý tưởng, chi tiết và ví dụ liên quan từ nhiều bối cảnh khác nhau, như trải nghiệm cá nhân, môi trường học thuật, hoặc sự kiện thời sự. Bài luận cũng cần có một phản luận.</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
