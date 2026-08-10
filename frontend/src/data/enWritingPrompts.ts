/**
 * Kho bài Viết có hướng dẫn — Tiếng Anh (My Language /language/en/writing).
 * Dữ liệu TĨNH (không cần DB/migration): mỗi đề có dàn ý + mẫu câu + bài mẫu.
 * Học viên bấm "Dùng đề này" → đề vào ô prompt → viết → bấm "Chấm bài" (AI chấm).
 *
 * Cấp: A1 (câu → đoạn ngắn, hiện tại đơn) → A2 (đoạn, quá khứ, email) →
 *      B1 (đoạn ý kiến, email trang trọng, essay ngắn).
 */
export interface WritingLesson {
  level: 'A1' | 'A2' | 'B1' | 'B2';
  title: string;      // tiêu đề tiếng Việt
  prompt: string;     // đề bài tiếng Anh (đưa vào ô "Đề bài")
  guide: string[];    // dàn ý / gợi ý (tiếng Việt)
  phrases: string[];  // mẫu câu / cụm từ hữu ích (tiếng Anh)
  model: string;      // bài mẫu (tiếng Anh)
}

export const EN_WRITING_LESSONS: WritingLesson[] = [
  // ─────────── A1 ───────────
  {
    level: 'A1',
    title: 'Giới thiệu bản thân',
    prompt: 'Introduce yourself in 4–6 sentences: your name, your age, where you live, your job or study, and one hobby.',
    guide: [
      'Câu 1: Chào + tên — Hi, my name is …',
      'Câu 2: Tuổi — I am … years old.',
      'Câu 3: Nơi sống — I live in …',
      'Câu 4: Học/làm gì — I am a student / I work as a …',
      'Câu 5–6: Sở thích — In my free time, I like …',
    ],
    phrases: ['My name is …', 'I am … years old', 'I live in …', 'I work as a … / I am a student', 'In my free time, I like + V-ing'],
    model: `Hi, my name is Minh. I am twenty-two years old. I live in Ho Chi Minh City with my family. I am a student, and I study information technology. In my free time, I like playing football and reading books. Nice to meet you!`,
  },
  {
    level: 'A1',
    title: 'Gia đình của bạn',
    prompt: 'Write about your family in 4–6 sentences: how many people are in it, who they are, and one thing about each person.',
    guide: [
      'Câu mở: There are … people in my family.',
      'Liệt kê: my father, my mother, my (older/younger) brother/sister…',
      'Mỗi người một câu: nghề nghiệp hoặc tính cách hoặc sở thích',
      'Câu kết: I love my family.',
    ],
    phrases: ['There are … people in my family', 'My father is a … / My mother works as a …', 'My older/younger brother/sister …', 'He/She likes …', 'I love my family'],
    model: `There are four people in my family: my father, my mother, my younger sister, and me. My father is a teacher and he is very kind. My mother works as a nurse at a hospital. My sister is ten years old and she loves drawing. We often have dinner together in the evening. I love my family very much.`,
  },
  {
    level: 'A1',
    title: 'Một ngày của bạn',
    prompt: 'Describe your daily routine in 5–7 sentences. Use the present simple and time words (in the morning, then, after that, in the evening).',
    guide: [
      'Buổi sáng: I get up at … / I have breakfast.',
      'Đi học/làm: I go to school/work at …',
      'Dùng từ nối thời gian: First, Then, After that, In the evening',
      'Buổi tối + đi ngủ: I go to bed at …',
    ],
    phrases: ['I get up at …', 'I have breakfast / lunch / dinner', 'I go to work/school at …', 'After that, I …', 'In the evening, I …', 'I go to bed at …'],
    model: `I get up at six o'clock every morning. First, I wash my face and have breakfast. Then I go to work at half past seven. I work in an office until five in the afternoon. After that, I go home and cook dinner. In the evening, I watch TV or study English for one hour. I usually go to bed at eleven o'clock.`,
  },
  // ─────────── A2 ───────────
  {
    level: 'A2',
    title: 'Email cho một người bạn (kể cuối tuần)',
    prompt: "Write a short email (60–80 words) to a friend about your last weekend. Begin with 'Hi [name],' and end with 'Best, [your name]'. Use the past simple.",
    guide: [
      'Mở đầu: Hi Lan, / How are you?',
      'Thân bài: kể việc đã làm cuối tuần (quá khứ): went, met, ate, watched…',
      'Cảm xúc: It was fun / I was tired but happy.',
      'Kết: Hỏi lại bạn + Best, [tên].',
    ],
    phrases: ['How are you?', 'Last weekend, I …', 'On Saturday, I went to …', 'We had a great time', 'What about you?', 'Best, / Take care,'],
    model: `Hi Lan,

How are you? Last weekend was really fun. On Saturday, I went to the cinema with my brother and we watched an action movie. After that, we ate pizza at a small restaurant. On Sunday, I stayed home and cleaned my room. In the evening, I called my parents. It was a relaxing weekend. What about you? What did you do?

Best,
Minh`,
  },
  {
    level: 'A2',
    title: 'Mô tả nơi bạn thích',
    prompt: 'Describe your favorite place (a café, your room, your hometown, a park) in 6–8 sentences. Say what it looks like and why you like it.',
    guide: [
      'Giới thiệu nơi đó: My favorite place is …',
      'Mô tả: nó trông thế nào (nhỏ/rộng, màu sắc, có gì)',
      'Bạn làm gì ở đó',
      'Vì sao bạn thích (because it is …)',
    ],
    phrases: ['My favorite place is …', 'It is not big, but it is very …', 'There is / There are …', 'I usually go there to …', 'I like it because …'],
    model: `My favorite place is a small café near my house. It is not big, but it is quiet and comfortable. There are many green plants and soft lights inside. The chairs are made of wood, and there is gentle music. I usually go there on weekends to read books and drink coffee. Sometimes I meet my friends there too. I like it because it helps me relax after a busy week.`,
  },
  {
    level: 'A2',
    title: 'Kể về một trải nghiệm đã qua',
    prompt: 'Write about something you did last week (6–8 sentences). Where did you go? Who were you with? What happened? How did you feel? Use the past simple.',
    guide: [
      'Mở: Last week, I …',
      'Ở đâu, với ai: I went to … with …',
      'Chuyện gì xảy ra (theo thứ tự): First… Then… Finally…',
      'Cảm xúc kết: I felt … It was a … day.',
    ],
    phrases: ['Last week, I …', 'I went there with …', 'First … Then … Finally …', 'It was … (fun / tiring / interesting)', 'I felt happy / excited / tired'],
    model: `Last week, I went to the countryside with my family. We left home early in the morning and drove for two hours. First, we visited my grandparents and had lunch together. Then we walked around the rice fields and took many photos. In the afternoon, my cousins and I played football. Finally, we came back home late in the evening. I was tired, but I felt very happy. It was a wonderful day.`,
  },
  // ─────────── B1 ───────────
  {
    level: 'B1',
    title: 'Nêu ý kiến: làm ở nhà hay ở văn phòng?',
    prompt: 'Do you prefer working (or studying) from home or in an office/school? Write a paragraph of 100–120 words. Give at least two reasons and one example.',
    guide: [
      'Câu chủ đề: nêu rõ bạn thích cái nào (I prefer … because …).',
      'Lý do 1 + giải thích.',
      'Lý do 2 + ví dụ (For example, …).',
      'Câu kết: nhắc lại quan điểm (In conclusion, …).',
    ],
    phrases: ['In my opinion, … / I prefer …', 'The main reason is that …', 'Another advantage is …', 'For example, …', 'On the other hand, …', 'In conclusion, …'],
    model: `In my opinion, I prefer working from home. The main reason is that I can save a lot of time. Instead of spending two hours in traffic every day, I can use that time to work or rest. Another advantage is comfort: I can create my own quiet space and focus better. For example, last month I finished a difficult project faster at home than I usually do at the office. Of course, working from home requires discipline, and sometimes I miss talking to my colleagues. However, for me, the freedom and the time I save are more important. In conclusion, working from home suits me best.`,
  },
  {
    level: 'B1',
    title: 'Email trang trọng: xin nghỉ phép',
    prompt: 'Write a formal email (80–100 words) to your manager to ask for one day off next week. Be polite, give a clear reason, and offer to prepare your work.',
    guide: [
      'Chào trang trọng: Dear Mr./Ms. [tên],',
      'Nêu mục đích ngay: I am writing to ask for …',
      'Lý do ngắn gọn, lịch sự.',
      'Đề nghị bàn giao công việc.',
      'Kết trang trọng: Best regards, [tên đầy đủ].',
    ],
    phrases: ['Dear Mr./Ms. …,', 'I am writing to request …', 'I would be grateful if …', 'I will make sure that …', 'Thank you for your understanding.', 'Best regards, …'],
    model: `Dear Mr. Nam,

I am writing to request one day off next Thursday, June 12th. I need to take care of a personal family matter that day. I would be grateful if you could approve my request.

To make sure my work is not affected, I will finish the weekly report in advance and ask Linh to handle any urgent tasks while I am away.

Thank you for your understanding.

Best regards,
Tran Van Minh`,
  },
  {
    level: 'B1',
    title: 'Bài luận ngắn: điện thoại & sự kết nối',
    prompt: 'Some people say that smartphones make us less social. Do you agree or disagree? Write 120–150 words. Give reasons and examples to support your opinion.',
    guide: [
      'Mở bài: giới thiệu chủ đề + nêu quan điểm.',
      'Thân bài 1: một mặt (đồng ý một phần) + ví dụ.',
      'Thân bài 2: mặt còn lại (phản biện) + ví dụ.',
      'Kết bài: khẳng định lại quan điểm cân bằng.',
    ],
    phrases: ['Nowadays, …', 'On the one hand, … On the other hand, …', 'It is true that …, but …', 'For instance, …', 'To sum up, / Overall, …'],
    model: `Nowadays, smartphones are part of our daily lives, and many people worry that they make us less social. In my opinion, the answer is not simple. On the one hand, it is true that some people spend too much time looking at their screens. For instance, at family dinners, everyone may check social media instead of talking to each other. This can weaken real relationships. On the other hand, smartphones also help us stay connected. Thanks to video calls and messages, I can talk to my friends who live far away every day. The problem, therefore, is not the phone itself but how we use it. To sum up, smartphones can make us less social only if we let them. Used wisely, they bring people closer together.`,
  },
  // ─────────── A2 (thêm) ───────────
  {
    level: 'A2',
    title: 'Mô tả người bạn thân nhất',
    prompt: 'Describe your best friend in 6–8 sentences. What is his/her name and appearance? What is his/her personality? What do you do together, and why do you like him/her?',
    guide: [
      'Giới thiệu: My best friend is … / His/Her name is …',
      'Ngoại hình: tall/short, ...',
      'Tính cách: kind, funny, honest …',
      'Cùng làm gì + vì sao quý (because …).',
    ],
    phrases: ['My best friend is …', 'He/She is … (tall, funny, kind)', 'We often … together', 'He/She always …', 'I like him/her because …'],
    model: `My best friend is Linh. We have known each other for ten years. She is tall and has long black hair. Linh is very kind and funny, and she always listens to me when I have a problem. We often go shopping and drink milk tea together on weekends. She also helps me study English. I like her because she is honest and I can trust her with anything. I am lucky to have such a good friend.`,
  },
  // ─────────── B1 (thêm) ───────────
  {
    level: 'B1',
    title: 'Email phàn nàn (sản phẩm/dịch vụ)',
    prompt: 'Write a polite complaint email (90–110 words) to an online shop. You bought a product that arrived broken. Explain the problem clearly and say what you want them to do.',
    guide: [
      'Chào + nêu lý do viết: I am writing to complain about …',
      'Mô tả vấn đề rõ ràng (đơn hàng, tình trạng).',
      'Nêu mong muốn: I would like a refund / replacement.',
      'Kết lịch sự: I look forward to your reply. Best regards, …',
    ],
    phrases: ['I am writing to complain about …', 'Unfortunately, …', 'When it arrived, …', 'I would like a refund / a replacement.', 'I look forward to hearing from you.', 'Best regards, …'],
    model: `Dear Customer Service,

I am writing to complain about a product I bought from your website on June 3rd (order #A1234). It was a Bluetooth speaker. Unfortunately, when the package arrived, the speaker was broken and it does not turn on.

I have been a customer for a long time, and I was very disappointed. I would like a replacement or a full refund as soon as possible. I have attached photos of the damaged item.

I look forward to hearing from you.

Best regards,
Pham Thu Ha`,
  },
  // ─────────── B2 ───────────
  {
    level: 'B2',
    title: 'Essay: lợi & hại của làm việc từ xa',
    prompt: 'Write a for-and-against essay (180–220 words) about remote work. Discuss the advantages and disadvantages, and give your own opinion in the conclusion.',
    guide: [
      'Mở bài: giới thiệu chủ đề + nói bài sẽ bàn cả hai mặt.',
      'Đoạn 2: lợi ích (2 ý + ví dụ).',
      'Đoạn 3: bất lợi (2 ý + ví dụ).',
      'Kết bài: quan điểm cân bằng của bạn (In my view, …).',
    ],
    phrases: ['There are both advantages and disadvantages to …', 'On the positive side, …', 'A major benefit is that …', 'However, there are also drawbacks.', 'Another disadvantage is that …', 'In my view, … / All things considered, …'],
    model: `Remote work has become common in recent years, and it brings both advantages and disadvantages.

On the positive side, working from home saves a lot of time and money because employees do not have to commute. It also offers flexibility: people can organize their day around their own needs, which often improves their work-life balance. For example, a parent can be at home when their children return from school.

However, there are also drawbacks. Working alone can feel isolating, and some people find it hard to separate work from personal life. Communication may become slower, and new employees can struggle without face-to-face support from their colleagues.

In my view, remote work is a valuable option, but it is not perfect for everyone. A hybrid model — a few days at home and a few in the office — probably offers the best balance between flexibility and teamwork. Companies should let employees choose what suits them, as long as the work gets done well.`,
  },
  {
    level: 'B2',
    title: 'Thư xin việc ngắn (cover letter)',
    prompt: 'Write a short cover letter (150–180 words) for a junior developer job. Say why you are interested, mention your main skills, and explain why you would be a good fit.',
    guide: [
      'Chào + vị trí ứng tuyển: I am writing to apply for …',
      'Vì sao quan tâm công ty/vị trí.',
      'Kỹ năng chính + 1 ví dụ/dự án.',
      'Vì sao phù hợp + lời cảm ơn + kết trang trọng.',
    ],
    phrases: ['I am writing to apply for the position of …', 'I am particularly interested in … because …', 'I have experience in …', 'In my last project, I …', 'I am confident that I would be a good fit …', 'Thank you for considering my application.'],
    model: `Dear Hiring Manager,

I am writing to apply for the Junior Developer position at your company, which I saw on your website. I have always admired your products, and I am excited about the chance to grow as part of your team.

I recently completed a degree in information technology, and I have solid skills in JavaScript, React, and Node.js. In my final project, I built a small e-commerce website from start to finish, which taught me how to solve real problems and work under deadlines. I also enjoy learning new tools quickly.

I am hard-working, curious, and I communicate well with teammates. I am confident that I would be a good fit for your team, and I am eager to contribute and keep learning.

Thank you for considering my application. I look forward to the opportunity to discuss my qualifications with you.

Best regards,
Le Van An`,
  },
];
