/**
 * My Language · EN — Bài đọc song ngữ (graded readers) cho người mất gốc.
 * Seed bởi scripts/my-language-en-seed.mjs (find-before-create theo title).
 *
 * Mỗi bài:
 *   level        'A1' | 'A2' | ...   → hiện chip lọc theo cấp
 *   title        tiêu đề (khoá nhận diện idempotent)
 *   content      HTML string  <p>…</p>  (tiếng Anh — bản render)
 *   translation  HTML string  <p>…</p>  (bản dịch tiếng Việt, hiện khi bấm)
 *   questions    ReadingQuestion[]  — 'mc' (trắc nghiệm) | 'open' (tự luận có mẫu)
 *
 * Viết cho người mới: câu ngắn, thì hiện tại đơn (A1) → thêm quá khứ + liên từ
 * (A2). Câu hỏi cuối luôn có 1 câu "viết về chính bạn" để bắc cầu sang kỹ năng Viết.
 */
export default [
  {
    level: 'A1',
    title: 'My Family',
    content: `<p>Hello! My name is Mai. I am twelve years old. I live in Hanoi with my family. My family is not big. There are four people in my family: my father, my mother, my brother, and me.</p><p>My father is a teacher. He is tall and kind. He likes to read books and drink coffee. My mother is a nurse. She works at a hospital. She is very busy, but she always smiles. She cooks great food.</p><p>My brother is nine years old. His name is Nam. He is short and funny. He loves football and video games. We often play together after school. Sometimes we argue, but we love each other.</p><p>We also have a small dog. Her name is Lucky. She is white and very friendly. Every evening, my family eats dinner together. This is my favorite time of the day. I love my family very much.</p>`,
    translation: `<p>Xin chào! Tên tôi là Mai. Tôi mười hai tuổi. Tôi sống ở Hà Nội cùng gia đình. Gia đình tôi không lớn. Nhà tôi có bốn người: bố, mẹ, em trai và tôi.</p><p>Bố tôi là giáo viên. Bố cao và tốt bụng. Bố thích đọc sách và uống cà phê. Mẹ tôi là y tá. Mẹ làm việc ở bệnh viện. Mẹ rất bận, nhưng lúc nào cũng mỉm cười. Mẹ nấu ăn rất ngon.</p><p>Em trai tôi chín tuổi. Tên nó là Nam. Nó thấp và vui tính. Nó mê bóng đá và trò chơi điện tử. Chúng tôi hay chơi cùng nhau sau giờ học. Thỉnh thoảng cãi nhau, nhưng chúng tôi rất thương nhau.</p><p>Nhà tôi còn nuôi một chú chó nhỏ. Tên nó là Lucky. Nó màu trắng và rất thân thiện. Mỗi tối, cả nhà tôi ăn cơm cùng nhau. Đây là khoảng thời gian tôi thích nhất trong ngày. Tôi rất yêu gia đình mình.</p>`,
    questions: [
      { id: 'q1', kind: 'mc', prompt: 'How many people are there in Mai’s family?', options: ['Three', 'Four', 'Five', 'Six'], correctIndex: 1, explanation: 'There are four: her father, mother, brother, and Mai herself.' },
      { id: 'q2', kind: 'mc', prompt: 'What is Mai’s mother’s job?', options: ['A teacher', 'A doctor', 'A nurse', 'A cook'], correctIndex: 2, explanation: '“My mother is a nurse. She works at a hospital.”' },
      { id: 'q3', kind: 'mc', prompt: 'What is the name of the dog?', options: ['Nam', 'Mai', 'Lucky', 'Hanoi'], correctIndex: 2, explanation: '“Her name is Lucky. She is white and very friendly.”' },
      { id: 'q4', kind: 'open', prompt: 'What does Mai’s family do every evening?', sampleAnswer: 'They eat dinner together.', explanation: 'It is Mai’s favorite time of the day.' },
      { id: 'q5', kind: 'open', prompt: 'Now write 2–3 sentences about YOUR family. (Viết 2–3 câu về gia đình bạn.)', sampleAnswer: 'There are five people in my family: my parents, my two sisters, and me. My father is an engineer. I love my family.', explanation: 'Dùng mẫu: There are … people in my family. My … is a/an …' },
    ],
  },
  {
    level: 'A2',
    title: 'A Busy Monday',
    content: `<p>Monday is always a busy day for Linh. She works as a junior developer at a small software company in Da Nang. Her alarm rings at six o’clock, but she usually snoozes it once before she gets up.</p><p>After a quick shower, she makes a cup of coffee and checks her email. This morning, she had three new messages from her team. One of them was about a bug on the payment page. “I will fix it today,” she thought.</p><p>Linh left home at seven thirty and rode her motorbike to the office. The traffic was heavy, so the trip took almost forty minutes. When she arrived, her teammates were already there. They had a short meeting to plan the day.</p><p>In the afternoon, Linh finally found the bug. A small mistake in the code made the whole page crash. She fixed it, tested it twice, and asked a colleague to review her work. “Nice job,” he said. Linh felt tired but happy.</p><p>She got home at six in the evening. She cooked dinner, called her parents, and watched one episode of her favorite show. Before bed, she wrote a short plan for Tuesday. It was a long day, but a good one.</p>`,
    translation: `<p>Thứ Hai luôn là một ngày bận rộn với Linh. Cô làm lập trình viên mới vào nghề tại một công ty phần mềm nhỏ ở Đà Nẵng. Chuông báo thức reo lúc sáu giờ, nhưng cô thường tắt tạm một lần rồi mới chịu dậy.</p><p>Sau khi tắm nhanh, cô pha một tách cà phê và kiểm tra email. Sáng nay cô có ba tin nhắn mới từ nhóm. Một tin nói về một lỗi ở trang thanh toán. “Hôm nay mình sẽ sửa nó,” cô nghĩ.</p><p>Linh rời nhà lúc bảy giờ rưỡi và chạy xe máy tới văn phòng. Đường đông nên đi mất gần bốn mươi phút. Khi cô đến nơi, đồng nghiệp đã có mặt. Cả nhóm họp nhanh để lên kế hoạch cho ngày làm việc.</p><p>Buổi chiều, Linh cuối cùng cũng tìm ra lỗi. Một sai sót nhỏ trong mã khiến cả trang bị sập. Cô sửa nó, kiểm tra lại hai lần, rồi nhờ một đồng nghiệp xem lại. “Làm tốt lắm,” anh ấy nói. Linh thấy mệt nhưng vui.</p><p>Cô về đến nhà lúc sáu giờ tối. Cô nấu bữa tối, gọi điện cho bố mẹ, và xem một tập phim yêu thích. Trước khi ngủ, cô viết một kế hoạch ngắn cho thứ Ba. Một ngày dài, nhưng là một ngày tốt lành.</p>`,
    questions: [
      { id: 'q1', kind: 'mc', prompt: 'What is Linh’s job?', options: ['A teacher', 'A junior developer', 'A nurse', 'A student'], correctIndex: 1, explanation: '“She works as a junior developer at a small software company.”' },
      { id: 'q2', kind: 'mc', prompt: 'How did Linh go to the office?', options: ['By bus', 'By car', 'By motorbike', 'On foot'], correctIndex: 2, explanation: '“… rode her motorbike to the office.”' },
      { id: 'q3', kind: 'mc', prompt: 'What problem did Linh fix?', options: ['A bug on the payment page', 'A broken motorbike', 'A wrong email address', 'A late meeting'], correctIndex: 0, explanation: 'A small mistake in the code made the payment page crash.' },
      { id: 'q4', kind: 'open', prompt: 'Why did the trip take almost forty minutes?', sampleAnswer: 'Because the traffic was heavy.', explanation: 'Cấu trúc trả lời lý do: Because + mệnh đề.' },
      { id: 'q5', kind: 'open', prompt: 'Write about your last busy day. What did you do? (Viết về một ngày bận của bạn — bạn đã làm gì?)', sampleAnswer: 'Last Friday was very busy. I woke up early, went to work, and finished a big report. In the evening, I met my friends.', explanation: 'Dùng thì quá khứ: woke, went, finished, met …' },
    ],
  },
];
