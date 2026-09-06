// Đề gốc: `Kì 7/ENW492c/ENW492c - SP26 - FEHCM - W`, paper.pdf 1 trang, đề
// luận agree/disagree 350-400 từ, 60 phút, về quyền của phụ huynh giám sát
// việc dùng mạng xã hội của con cái tuổi teen.
const RUBRIC = [
  {
    id: 'thesis', maxScore: 3, weight: 3,
    criterion: 'Clear position stating the extent to which the writer agrees or disagrees that parents have the right to monitor their teenagers\' social media use, stated explicitly and maintained throughout the essay.|||Lập trường rõ ràng nêu mức độ đồng ý hay không đồng ý rằng phụ huynh có quyền giám sát việc dùng mạng xã hội của con cái tuổi teen, nêu tường minh và giữ nhất quán xuyên suốt bài.',
  },
  {
    id: 'development', maxScore: 3, weight: 3,
    criterion: 'Both sides of the argument (parental monitoring as protecting teenagers from online risks vs. as violating their privacy and autonomy) are weighed with specific reasoning/evidence before the writer\'s own position is justified.|||Cả hai phía của lập luận (giám sát của phụ huynh nhằm bảo vệ con cái khỏi rủi ro trên mạng so với việc xâm phạm quyền riêng tư và sự tự chủ của con cái) được cân nhắc bằng lý lẽ/bằng chứng cụ thể trước khi lập trường của người viết được biện minh.',
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
      code: 'W23',
      source: 'REAL',
      title: 'ENW492c — Writing FE HCM (Parents Monitoring Teenagers\' Social Media)|||ENW492c — Viết luận FE HCM (Phụ huynh Giám sát Mạng xã hội Con cái)',
      description:
        '<div class="ml-en"><p>Real writing final-exam prompt (SP26, FE HCM campus). Compose a 350–400 word agree/disagree essay on whether parents have the right to monitor their teenagers\' social media use. AI grades against the rubric.</p></div>' +
        '<div class="ml-vi"><p>Đề viết luận thi cuối kỳ thật (SP26, cơ sở FE HCM). Viết một bài luận đồng ý/không đồng ý 350–400 từ về việc phụ huynh có quyền giám sát mạng xã hội của con cái tuổi teen hay không. AI chấm theo tiêu chí.</p></div>',
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
          imageUrl: 'https://media.cuongthai.com/images/exam-questions/ENW492c/W23/q1.png',
          prompt:
            '<div class="ml-en"><p><b>Writing question — Time: 60 minutes.</b></p><p>Compose an essay of 350–400 words responding to the question below:</p><p>With the rise of social media, parents are increasingly concerned about their teenagers\' online activities. Some believe that parents have the right to monitor their children\'s social media use.</p><p><b>To what extent do you agree or disagree with the above viewpoint?</b></p></div>' +
            '<div class="ml-vi"><p><b>Câu hỏi viết luận — Thời gian: 60 phút.</b></p><p>Viết một bài luận 350–400 từ trả lời câu hỏi dưới đây:</p><p>Với sự phát triển của mạng xã hội, phụ huynh ngày càng lo ngại về các hoạt động trực tuyến của con cái tuổi teen. Một số người cho rằng phụ huynh có quyền giám sát việc dùng mạng xã hội của con cái mình.</p><p><b>Bạn đồng ý hay không đồng ý với quan điểm trên ở mức độ nào?</b></p></div>',
          rubric: RUBRIC,
        },
      ],
    },
  ],
};
