// AUTO-GENERATED bằng tay theo mẫu build-fe-exam.mjs — Writing PE của ENW492c
// (đề gốc: `Kì 7/ENW492c/ENW492c - C2 - SU 2024 - W1`, paper.pdf 1 trang, đề
// luận so sánh 350-400 từ giữa viết văn phổ thông và viết học thuật đại học —
// gần chủ đề bài đọc FE4 "Compulsory First-Year Academic Writing Courses"
// nhưng là đề VIẾT với câu hỏi khác, không phải trùng).
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear thesis identifying the key differences between secondary-school writing and academic writing, and naming which are most challenging for first-year students.|||Luận điểm rõ ràng xác định những khác biệt chính giữa viết văn ở phổ thông và viết học thuật đại học, đồng thời nêu rõ khác biệt nào khó khăn nhất với sinh viên năm nhất.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Specific points of comparison (e.g. structure, sourcing/citation, critical analysis, independence) are developed with reasoning or examples, and the evaluation of "most challenging" is justified.|||Các điểm so sánh cụ thể (VD: cấu trúc, trích dẫn nguồn, phân tích phản biện, tính tự chủ) được phát triển bằng lý lẽ hoặc ví dụ, và phần đánh giá "khó khăn nhất" được lý giải thuyết phục.',
  },
  {
    id: 'organization', maxScore: 2, weight: 2,
    criterion: 'Consistent comparison structure (point-by-point or block method) leading into the evaluative conclusion, clear paragraphing and transitions.|||Cấu trúc so sánh nhất quán (theo từng điểm hoặc theo khối) dẫn đến phần đánh giá kết luận, phân đoạn rõ ràng, chuyển ý mạch lạc.',
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
      code: 'W12',
      source: 'REAL',
      title: 'ENW492c — Writing SU2024 W1 (Secondary vs Academic Writing)|||ENW492c — Viết luận SU2024 Bài 1 (Viết Phổ thông so với Viết Học thuật)',
      description:
        '<div class="ml-en"><p>Real writing exam prompt (SU2024, W1 version). Compose a 350-400 word comparative essay on how secondary-school writing differs from academic writing in higher education, and which differences are most challenging for first-year students. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thật (SU2024, phiên bản Bài 1). Viết một bài luận so sánh 350-400 từ về cách viết văn ở phổ thông khác với viết học thuật ở đại học ra sao, và khác biệt nào khó khăn nhất với sinh viên năm nhất. AI chấm theo tiêu chí.</p></div>',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p><b>How to take this exam.</b> Write your essay directly in the text box below. You have 60 minutes and a 350-400 word target. When you submit, AI grades your essay against the rubric and gives feedback.</p></div>' +
        '<div class="ml-vi"><p><b>Cách làm bài.</b> Viết bài luận trực tiếp vào ô chữ bên dưới. Bạn có 60 phút, mục tiêu 350-400 từ. Khi nộp bài, AI sẽ chấm theo tiêu chí và cho nhận xét.</p></div>',
      questions: [
        {
          kind: 'WRITE',
          points: 10,
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W12/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Time: 60 minutes.</b></p><p>Write a comparative essay of 350-400 words answering the question below:</p><p>"<b>In what ways does writing in secondary school differ from academic writing in higher education, and which of these differences are the most challenging for students during their first year of college or university?</b>"</p></div>' +
            '<div class="ml-vi"><p><b>Thời gian: 60 phút.</b></p><p>Viết một bài luận so sánh 350-400 từ trả lời câu hỏi sau:</p><p>"<b>Viết văn ở bậc phổ thông khác với viết học thuật ở bậc đại học như thế nào, và khác biệt nào trong số đó khó khăn nhất đối với sinh viên trong năm đầu tiên ở cao đẳng/đại học?</b>"</p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
