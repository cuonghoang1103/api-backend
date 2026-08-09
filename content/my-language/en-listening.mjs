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
  {
    slug: 'en-a2-a-trip-to-the-market',
    level: 'A2',
    title: 'A Trip to the Market',
    transcript: `Every Sunday morning, I go to the local market with my mother. The market is always busy and full of colors. We buy fresh vegetables, fruit, and fish. My mother likes to talk to the sellers and ask about the prices. Sometimes she asks for a lower price, and the seller agrees with a smile. I usually carry the heavy bags. My favorite part is buying fruit, because we can taste it first. After shopping, we stop at a small shop and eat a bowl of noodles. I really enjoy these Sunday mornings with my mother.`,
    translation: `Mỗi sáng Chủ nhật, tôi đi chợ gần nhà cùng mẹ. Chợ lúc nào cũng đông và đầy màu sắc. Chúng tôi mua rau tươi, trái cây và cá. Mẹ tôi thích trò chuyện với người bán và hỏi giá. Thỉnh thoảng mẹ trả giá thấp hơn, và người bán vui vẻ đồng ý. Tôi thường là người xách mấy túi nặng. Phần tôi thích nhất là mua trái cây, vì được nếm thử trước. Sau khi mua sắm, chúng tôi ghé một quán nhỏ ăn một tô mì. Tôi thật sự thích những sáng Chủ nhật như thế bên mẹ.`,
    questions: [
      { question: 'When does the speaker go to the market?', answer: 'Every Sunday morning. (Mỗi sáng Chủ nhật.)' },
      { question: 'Who does the speaker go with?', answer: 'Their mother. (Với mẹ.)' },
      { question: 'What is the speaker’s favorite part?', answer: 'Buying fruit, because they can taste it first.' },
      { question: 'What do they do after shopping?', answer: 'They eat a bowl of noodles at a small shop.' },
    ],
  },
  {
    slug: 'en-b1-how-i-learn-english',
    level: 'B1',
    title: 'How I Learn English',
    transcript: `People often ask me how I learn English, so let me share a few things that work for me. First, I listen every day, even for just ten minutes. I listen to podcasts and songs, and I try to repeat what I hear out loud. Second, I don't try to be perfect. I make many mistakes, but mistakes help me learn faster. Third, I learn new words in real sentences, not alone, because it is easier to remember them that way. Finally, I use English in my daily life. I changed my phone to English, I write short notes, and sometimes I talk to myself in the mirror. Learning a language takes time, but if you practice a little every day, you will improve. So be patient, and don't give up.`,
    translation: `Mọi người hay hỏi tôi học tiếng Anh thế nào, nên tôi xin chia sẻ vài điều hiệu quả với tôi. Thứ nhất, tôi nghe mỗi ngày, dù chỉ mười phút. Tôi nghe podcast và bài hát, rồi cố nói to lặp lại những gì nghe được. Thứ hai, tôi không cố hoàn hảo. Tôi mắc nhiều lỗi, nhưng lỗi giúp tôi học nhanh hơn. Thứ ba, tôi học từ mới trong câu thật, không học từ lẻ, vì như vậy dễ nhớ hơn. Cuối cùng, tôi dùng tiếng Anh trong đời sống hằng ngày. Tôi đổi điện thoại sang tiếng Anh, viết những ghi chú ngắn, và thỉnh thoảng tự nói chuyện trước gương. Học một ngôn ngữ cần thời gian, nhưng nếu bạn luyện một chút mỗi ngày, bạn sẽ tiến bộ. Vậy nên hãy kiên nhẫn, và đừng bỏ cuộc.`,
    questions: [
      { question: 'How much does the speaker listen each day?', answer: 'At least ten minutes every day. (Ít nhất mười phút mỗi ngày.)' },
      { question: 'Why does the speaker not try to be perfect?', answer: 'Because mistakes help them learn faster.' },
      { question: 'How does the speaker learn new words?', answer: 'In real sentences, not alone.' },
      { question: 'Name one way the speaker uses English daily.', answer: 'Changing the phone to English / writing short notes / talking to themselves in the mirror.' },
    ],
  },

  // ─── Nghe B1+ giọng thật (YouTube tuyển, đã kiểm oEmbed = BBC Learning English) ───
  // KHÔNG bịa transcript video thật (để null như item Podcast). Câu hỏi là gợi ý
  // NGHE CHỦ ĐỘNG, dùng được cho mọi tập 6 Minute English.
  {
    youtubeUrl: 'https://www.youtube.com/watch?v=fcN0BXzK8bg',
    level: 'B1-B2',
    title: 'BBC 6 Minute English — All About Language',
    transcript: null,
    translation: null,
    questions: [
      { question: 'What is the main topic the hosts introduce at the beginning?', answer: 'Listen for the topic in the first minute. (Nghe chủ đề trong phút đầu.)' },
      { question: 'The hosts ask a quiz question near the start — what is your guess?', answer: 'Guess first, then check the answer near the end. (Đoán trước, kiểm lại ở cuối.)' },
      { question: 'Write down 3 new words or phrases you hear, with meanings.', answer: 'No fixed answer — the goal is to collect new vocabulary. (Không có đáp án cố định — gom từ mới.)' },
      { question: 'Summarize the episode in 2–3 sentences in your own words.', answer: 'Say the main idea in your own words. (Tự tóm tắt ý chính.)' },
    ],
  },
  {
    youtubeUrl: 'https://www.youtube.com/watch?v=gEdPVA-6rVs',
    level: 'B1-B2',
    title: 'BBC 6 Minute English — Food & Drink',
    transcript: null,
    translation: null,
    questions: [
      { question: 'What is the main topic the hosts introduce at the beginning?', answer: 'Listen for the topic in the first minute. (Nghe chủ đề trong phút đầu.)' },
      { question: 'The hosts ask a quiz question near the start — what is your guess?', answer: 'Guess first, then check the answer near the end. (Đoán trước, kiểm lại ở cuối.)' },
      { question: 'Write down 3 food-related words or phrases you hear, with meanings.', answer: 'No fixed answer — collect the new vocabulary. (Gom từ mới về đồ ăn.)' },
      { question: 'Summarize the episode in 2–3 sentences in your own words.', answer: 'Say the main idea in your own words. (Tự tóm tắt ý chính.)' },
    ],
  },
  {
    youtubeUrl: 'https://www.youtube.com/watch?v=xnnTR_T7SQ4',
    level: 'B1-B2',
    title: 'BBC 6 Minute English — Psychology',
    transcript: null,
    translation: null,
    questions: [
      { question: 'What is the main topic the hosts introduce at the beginning?', answer: 'Listen for the topic in the first minute. (Nghe chủ đề trong phút đầu.)' },
      { question: 'The hosts ask a quiz question near the start — what is your guess?', answer: 'Guess first, then check the answer near the end. (Đoán trước, kiểm lại ở cuối.)' },
      { question: 'Write down 3 new words or phrases you hear, with meanings.', answer: 'No fixed answer — collect the new vocabulary. (Gom từ mới.)' },
      { question: 'Summarize the episode in 2–3 sentences in your own words.', answer: 'Say the main idea in your own words. (Tự tóm tắt ý chính.)' },
    ],
  },
];
