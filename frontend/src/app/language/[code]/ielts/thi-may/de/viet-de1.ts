/**
 * Đề 1 — Academic Writing, THI CUỐI TẬP 1 (docs/ielts-lo-trinh-0-8.md mục 4.2 · Ngày 15). TỰ SOẠN 12/11/2026.
 * Task 1: line graph 3 đường × 6 mốc (ôn W08 — Ngày 11 từ vựng xu hướng, Ngày 12 viết trọn bài line) ·
 * Task 2: Opinion essay (Ngày 6 mở bài · Ngày 8 thân bài · Ngày 10 kết bài) về chủ đề giáo dục quen thuộc.
 * Số liệu TỰ ĐẶT (không phải thống kê thật). Người học Tập 1 nhắm band 3.5–4.5 ⇒ bài mẫu viết ở mức band 6: CHỈ dùng cấu
 * trúc và từ vựng Tập 1 đã dạy, để người học thấy "mình viết được như thế này" — phân tích nói rõ vì sao được 6 và thiếu gì để lên 7.
 * `moTaSo` gửi kèm cho AI chấm để đối chiếu từng con số.
 */
import type { DeViet } from './types';

export const VIET_DE1: DeViet = {
  id: 'viet-de1',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 1 (thi cuối Tập 1)',
  boDe: 'Đề 1',
  capDo: 'Band 3.5 → 4.5',
  moTa: 'Task 1: visitors to three city attractions, 2014–2024 (line graph) · Task 2: should students be allowed to bring mobile phones to school? (opinion)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The graph below shows the number of visitors to three attractions in one city between 2014 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'line',
        title: 'Visitors to three attractions in one city, 2014–2024',
        unit: 'thousand visitors per year',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của thành phố nào.',
        categories: ['2014', '2016', '2018', '2020', '2022', '2024'],
        series: [
          { name: 'Museum', values: [300, 320, 350, 330, 400, 450] },
          { name: 'Zoo', values: [500, 480, 450, 400, 380, 350] },
          { name: 'Aquarium', values: [100, 150, 250, 300, 380, 420] },
        ],
      },
      moTaSo: 'Line graph, visitors per year in THOUSANDS, one city, measured every two years. Museum: 2014 300; 2016 320; 2018 350; 2020 330; 2022 400; 2024 450. Zoo: 2014 500; 2016 480; 2018 450; 2020 400; 2022 380; 2024 350. Aquarium: 2014 100; 2016 150; 2018 250; 2020 300; 2022 380; 2024 420. Main features: the zoo fell in every period, from the highest figure on the graph in 2014 (500) to the lowest of the three in 2024 (350); the museum rose overall (300 to 450) with one small dip in 2020 (350 to 330) and was the highest in 2024; the aquarium rose in every period from 100 to 420 (more than four times). In 2022 the aquarium and the zoo were equal at 380; the museum (400) was already above the zoo in 2022. Ranking in 2014: zoo > museum > aquarium. Ranking in 2024: museum > aquarium > zoo.',
      goiY: [
        'Mở bài (1 câu): viết lại đề bằng lời của mình — "The line graph shows how many people visited three places in one city (a museum, a zoo and an aquarium) from 2014 to 2024." KHÔNG chép nguyên câu đề.',
        'Overview (BẮT BUỘC, 1–2 câu, KHÔNG số): hai nơi TĂNG (museum, aquarium), một nơi GIẢM (zoo); zoo từ nhiều khách nhất thành ít khách nhất. Bắt đầu bằng "Overall, …".',
        'Thân bài 1 — đường đi XUỐNG (zoo): số đầu, số cuối, cách giảm (fell steadily from 500,000 to 350,000).',
        'Thân bài 2 — hai đường đi LÊN: museum (tăng chậm, giảm nhẹ năm 2020, rồi tăng mạnh đến 450,000) và aquarium (tăng liên tục từ 100,000, nhanh nhất 2016–2018; năm 2022 BẰNG zoo ở 380,000).',
        'Từ vựng xu hướng Ngày 11: rise / increase / grow · fall / decrease / drop · steadily / slowly / sharply / quickly · reach · the highest / the lowest figure. Thì QUÁ KHỨ ĐƠN cho mọi con số (2014–2024 đã qua).',
        'Đơn vị là NGHÌN lượt khách: 500 trên trục = 500,000 visitors (viết "500,000" hoặc "half a million", đừng viết "500 visitors").',
        'Không giải thích nguyên nhân, không nêu ý kiến. 20 phút: 3′ đọc biểu đồ · 14′ viết · 3′ soát (thì, số, đơn vị).',
      ],
      mau: {
        band: 'Band 6 (bài mẫu tự viết — chỉ dùng cấu trúc Tập 1 đã dạy)',
        s: 'The line graph shows how many people visited three attractions in one city, a museum, a zoo and an aquarium, every two years from 2014 to 2024.\n\nOverall, the number of visitors to the museum and the aquarium went up over the period, while the number for the zoo went down. The zoo was the most popular place at the beginning, but it was the least popular at the end.\n\nIn 2014, the zoo had 500,000 visitors, which was the highest figure in the graph. After that, the number fell steadily to 400,000 in 2020 and to 350,000 in 2024.\n\nIn contrast, the museum started at 300,000 visitors in 2014 and rose slowly to 350,000 in 2018. There was a small fall to 330,000 in 2020, but then the figure increased sharply and reached 450,000 in 2024, which was the highest number in that year. The aquarium had only 100,000 visitors in 2014. However, this number grew in every two-year period, especially between 2016 and 2018, and in 2022 it was the same as the figure for the zoo, at 380,000. By 2024, it had risen to 420,000, which was more than four times the figure for 2014.',
        phanTich: [
          '**Đạt band 6 vì (Task Achievement)**: có đoạn Overview riêng nói XU HƯỚNG chung (hai nơi tăng, một nơi giảm; zoo từ đầu bảng xuống cuối bảng) và KHÔNG có số trong overview; thân bài có số đầu – số cuối của cả ba đường và hai điểm đáng chú ý (museum giảm nhẹ năm 2020; aquarium bằng zoo năm 2022 ở 380,000).',
          '**Coherence & Cohesion**: 4 đoạn rõ (mở bài · overview · đường giảm · hai đường tăng); từ nối đúng việc: "Overall", "After that", "In contrast", "However", "By 2024". Nhóm số liệu theo XU HƯỚNG chứ không kể lần lượt từng năm — đây là điểm phân biệt band 6 với band 5.',
          '**Lexical Resource**: dùng đúng nhóm từ Ngày 11 — went up / went down, fell steadily, rose slowly, increased sharply, grew, reached, the highest figure. Chưa có cụm danh từ ("a steady decline", "a sharp rise") nên dừng ở 6.',
          '**Grammar**: quá khứ đơn nhất quán; có mệnh đề quan hệ "which was the highest figure", câu ghép với "while" / "but", và một câu quá khứ hoàn thành "By 2024, it had risen to…". Không lỗi làm khó hiểu.',
          '**Số liệu đúng đơn vị**: viết "500,000 visitors" (trục ghi nghìn). Viết "500 visitors" là sai dữ liệu ⇒ Task Achievement tụt xuống 5.',
          '**Muốn lên band 7**: (1) đổi động từ thành cụm danh từ ở 1–2 câu ("There was a steady decline in visitors to the zoo, from… to…"); (2) thêm so sánh chéo ("the museum overtook the zoo between 2020 and 2022"); (3) bớt lặp "the number / the figure" bằng "visitor numbers", "attendance".',
          '**Lỗi band 4 hay gặp cần tránh**: thiếu overview; dùng hiện tại đơn ("the zoo falls"); chép nguyên câu đề; giải thích lý do ("because people like fish") — đề không yêu cầu và biểu đồ không cho biết.',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people think that students should not be allowed to bring mobile phones to school.\n\nTo what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Opinion essay (agree/disagree) about banning mobile phones at school. Expected: a clear position in the introduction, kept to the end; two developed reasons, each with an explanation and a specific example; a conclusion that repeats the position. Agree, disagree or partly agree are all acceptable if the position is clear and consistent. No data to check.',
      goiY: [
        'Dạng Opinion ("To what extent do you agree or disagree?") — Ngày 6: mở bài 2 câu = 1 câu viết lại đề + 1 câu thesis nêu RÕ quan điểm (I agree / I disagree / I partly agree … because …).',
        'Thân bài — Ngày 8: mỗi đoạn MỘT lý do theo khung câu chủ đề → giải thích → ví dụ cụ thể (một người, một trường, một tình huống thật).',
        'Kết bài — Ngày 10: 1–2 câu, nhắc lại quan điểm bằng lời khác, KHÔNG thêm ý mới. Bắt đầu bằng "In conclusion, …".',
        'Ý có thể dùng — đồng ý cấm: mất tập trung (check messages, play games), bắt nạt qua mạng, mất cắp. Không đồng ý: liên lạc với bố mẹ khi khẩn cấp, tra từ điển / tài liệu, học cách tự quản lý.',
        'Từ vựng Tập 1 nên dùng: concentrate, pay attention, social media, distract, face to face, ban, allow, in an emergency.',
        'Giữ MỘT quan điểm từ đầu đến cuối. 40 phút: 5′ dàn ý · 30′ viết · 5′ soát (động từ số ít thêm -s, a/an/the, số nhiều, chính tả). Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 6 (bài mẫu tự viết — chỉ dùng cấu trúc Tập 1 đã dạy)',
        s: 'Nowadays, almost every teenager has a mobile phone, and many of them take it to school. Some people think that students should not be allowed to do this. I agree with this opinion because phones stop students from concentrating and they can cause problems between classmates.\n\nThe first reason is that mobile phones make it difficult for students to pay attention. When a phone is in a student\'s pocket or bag, it is very easy to check messages or play a game during the lesson. As a result, the student does not listen to the teacher and may miss important information. For example, my younger brother\'s marks in maths went down last year because he often watched short videos in class. After his school banned phones, his results improved again.\n\nThe second reason is that phones can create problems between students. Some students use social media to post unkind comments or embarrassing photos of their classmates during the school day. This can make other students feel sad or afraid to come to school. In addition, expensive phones are sometimes stolen, and this causes arguments. If phones stay at home, students will talk to each other face to face at break time, and they will make friends more easily.\n\nSome parents say that their children need a phone in an emergency. However, I think this is not a strong reason, because every school has an office, and parents can call the office at any time.\n\nIn conclusion, I believe that students should not bring mobile phones to school. Without phones, they can concentrate better in lessons and have better relationships with their classmates.',
        phanTich: [
          '**Task Response (6)**: quan điểm rõ ngay câu thesis ("I agree with this opinion because… and…") và nhắc lại ở kết bài; hai lý do đều có giải thích + ví dụ (em trai bị tụt điểm toán; bình luận ác ý trên mạng xã hội). Có một đoạn ngắn trả lời ý kiến ngược lại (phụ huynh cần liên lạc) — điểm cộng, nhưng đoạn này còn mỏng nên chưa lên 7.',
          '**Coherence & Cohesion (6)**: khung Ngày 6–8–10 đầy đủ: mở bài 3 câu → "The first reason is that…" → "The second reason is that…" → phản biện → "In conclusion". Từ nối đúng chức năng ("As a result", "For example", "In addition", "However"). Còn hơi máy móc — band 7 dùng tham chiếu ("this problem", "such behaviour") nhiều hơn.',
          '**Lexical Resource (6)**: từ chủ đề đúng và tự nhiên: "pay attention", "check messages", "miss important information", "unkind comments", "face to face", "in an emergency". Chưa có từ ít gặp ("distraction", "cyberbullying", "confiscate") — thêm 3–4 từ như vậy là lên 6.5–7.',
          '**Grammar (6)**: trộn câu đơn với câu phức (because, when, if, after); câu điều kiện loại 1 "If phones stay at home, students will talk…"; bị động "should not be allowed", "are sometimes stolen" (Ngày 15); modal "can", "may", "should" (Ngày 13). Gần như không lỗi, nhưng ít cấu trúc nâng cao.',
          '**Vì sao KHÔNG phải band 7**: ví dụ mang tính cá nhân, chưa khái quát; đoạn phản biện chỉ 2 câu; kết bài lặp gần nguyên ý thesis. **Vì sao hơn band 5**: không lạc đề, không đổi quan điểm giữa bài, mỗi đoạn một ý, đủ 250 từ.',
          '**Cách tự chấm bài của bạn**: (1) Câu thesis có chữ "I agree / I disagree" không? (2) Mỗi thân bài có đủ câu chủ đề → giải thích → ví dụ không? (3) Kết bài có lặp lại đúng quan điểm ở mở bài không? Thiếu một trong ba ⇒ chưa qua band 5.',
        ],
      },
    },
  ],
};
