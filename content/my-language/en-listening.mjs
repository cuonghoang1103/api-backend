/**
 * My Language · EN — Bài nghe (Listening) cho người mất gốc.
 *
 * QUY TRÌNH 2 PHA (giống thẻ feed):
 *   1. scripts/en-listening-audio.mjs  (LOCAL) — sinh MP3 từ `transcript` bằng
 *      TTS (Google en-US) rồi upload R2 tại key `audio/my-language/en/<slug>.mp3`.
 *   2. scripts/my-language-en-seed.mjs (deploy) — tạo LangListeningItem trỏ tới
 *      URL R2 đó (sourceType UPLOAD). KHÔNG sinh audio ở pha này.
 *
 * ⚠ `transcript` = ĐÚNG văn bản đưa vào TTS → audio khớp transcript 100%. Dùng
 * dạng độc thoại (không nhãn "A:"/"B:") để giọng đọc tự nhiên, không đọc nhãn.
 *
 * Mỗi item:
 *   slug         khoá file audio (ổn định, không đổi để né tạo lại/cache)
 *   level        'A1' | 'A2' | …
 *   title        tiêu đề (khoá nhận diện idempotent)
 *   transcript   văn bản tiếng Anh (dùng cho cả TTS lẫn hiển thị)
 *   translation  bản dịch tiếng Việt
 *   questions    [{ question, answer }]  — câu hỏi nghe hiểu
 */
export default [
  {
    slug: 'en-a1-introducing-myself',
    level: 'A1',
    title: 'Introducing Myself',
    transcript: `Hi! My name is Mai. I am from Vietnam. I live in Hanoi. I am a student. I am twelve years old. I have one younger brother. His name is Nam. I like reading books and playing badminton. My favorite subject is English. On weekends, I help my mother and play with my dog. Nice to meet you!`,
    translation: `Chào! Tên tôi là Mai. Tôi đến từ Việt Nam. Tôi sống ở Hà Nội. Tôi là học sinh. Tôi mười hai tuổi. Tôi có một em trai. Tên nó là Nam. Tôi thích đọc sách và chơi cầu lông. Môn học tôi thích nhất là tiếng Anh. Vào cuối tuần, tôi giúp mẹ và chơi với chú chó của mình. Rất vui được gặp bạn!`,
    questions: [
      { question: 'Where is Mai from?', answer: 'She is from Vietnam. (Cô ấy đến từ Việt Nam.)' },
      { question: 'How old is Mai?', answer: 'She is twelve years old. (Cô ấy mười hai tuổi.)' },
      { question: 'What does Mai like doing?', answer: 'She likes reading books and playing badminton.' },
      { question: 'What is Mai’s favorite subject?', answer: 'English. (Tiếng Anh.)' },
    ],
  },
  {
    slug: 'en-a1-my-daily-routine',
    level: 'A1',
    title: 'My Daily Routine',
    transcript: `I get up at six o’clock every morning. First, I brush my teeth and wash my face. Then I have breakfast with my family. I usually eat bread and drink milk. I go to school at seven o’clock. I study many subjects, like math, English, and science. After school, I do my homework and help my mother. In the evening, I watch TV or read a book. I go to bed at ten o’clock. I sleep well every night.`,
    translation: `Tôi thức dậy lúc sáu giờ mỗi sáng. Đầu tiên, tôi đánh răng và rửa mặt. Sau đó, tôi ăn sáng cùng gia đình. Tôi thường ăn bánh mì và uống sữa. Tôi đi học lúc bảy giờ. Tôi học nhiều môn, như toán, tiếng Anh và khoa học. Sau giờ học, tôi làm bài tập và giúp mẹ. Buổi tối, tôi xem tivi hoặc đọc sách. Tôi đi ngủ lúc mười giờ. Đêm nào tôi cũng ngủ ngon.`,
    questions: [
      { question: 'What time does the speaker get up?', answer: 'At six o’clock. (Lúc sáu giờ.)' },
      { question: 'What does the speaker eat for breakfast?', answer: 'Bread, and drinks milk. (Bánh mì và sữa.)' },
      { question: 'What does the speaker do after school?', answer: 'Homework, and helps their mother.' },
      { question: 'What time does the speaker go to bed?', answer: 'At ten o’clock. (Lúc mười giờ.)' },
    ],
  },
];
