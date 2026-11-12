/**
 * Đề 2 — Academic Writing, sau TẬP 2 NGÀY 12 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 12/11/2026.
 * Task 1: bar chart 5 nhóm × 2 năm (T2 N8 — bar chart + ngôn ngữ so sánh; N9 so sánh hơn/nhất) ·
 * Task 2: Discussion essay "Discuss both views and give your own opinion" (T2 N6) — chủ đề thức ăn / trường học (T2 N4, N12).
 * Số liệu TỰ ĐẶT (không phải thống kê thật). Người làm Đề 2 nhắm band 4.5 ⇒ bài mẫu ở mức band 5.0–5.5 = ĐÍCH KẾ TIẾP vừa tầm:
 * đủ bố cục, đủ số từ, có overview / có quan điểm, câu đơn giản. Để nhãn band TRUNG THỰC, mỗi bài mẫu CỐ Ý GIỮ 3 lỗi nhỏ
 * điển hình của band 5 (số nhiều, hoà hợp chủ–vị, mạo từ, "will" trong mệnh đề if…) — mục "🔎 Soi lỗi" trong `phanTich` chỉ
 * rõ từng lỗi + cách sửa. KHÔNG phải lỗi soạn thảo: đừng "sửa giúp" các câu đó mà không sửa luôn phần phân tích.
 * `moTaSo` gửi kèm cho AI chấm để đối chiếu từng con số.
 */
import type { DeViet } from './types';

export const VIET_DE2: DeViet = {
  id: 'viet-de2',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 2 (Tập 2 · Ngày 12)',
  boDe: 'Đề 2',
  capDo: 'Band 4.5',
  moTa: 'Task 1: weekly consumption of five foods in 2000 and 2020 (bar chart) · Task 2: should schools teach children to cook? (discuss both views)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The chart below shows the average amount of five types of food eaten per person per week in one country in 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'bar',
        title: 'Average weekly consumption of five foods per person, 2000 and 2020',
        unit: 'grams per person per week',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của quốc gia nào.',
        categories: ['Vegetables', 'Fruit', 'Red meat', 'Chicken', 'Fish'],
        series: [
          { name: '2000', values: [1100, 800, 450, 250, 200] },
          { name: '2020', values: [1250, 1000, 300, 400, 180] },
        ],
      },
      moTaSo: 'Bar chart, GRAMS per person per week, one country, two years. Vegetables: 2000 1,100; 2020 1,250. Fruit: 2000 800; 2020 1,000. Red meat: 2000 450; 2020 300. Chicken: 2000 250; 2020 400. Fish: 2000 200; 2020 180. Main features: vegetables were the highest figure in both years, followed by fruit; three foods rose (vegetables +150, fruit +200, chicken +150) and two fell (red meat -150, fish -20); chicken overtook red meat (2000: red meat 450 > chicken 250; 2020: chicken 400 > red meat 300); fish was the lowest in both years and changed very little. Largest rise in grams: fruit (+200). Largest proportional rise: chicken (250 to 400, +60%).',
      goiY: [
        'Mở bài (1 câu): viết lại đề bằng lời của mình — "The bar chart compares how much of five kinds of food people in one country ate each week in 2000 and in 2020." KHÔNG chép nguyên câu đề.',
        'Overview (BẮT BUỘC, 1–2 câu, KHÔNG số): ba loại TĂNG (vegetables, fruit, chicken), hai loại GIẢM (red meat, fish); vegetables cao nhất ở cả hai năm. Bắt đầu bằng "Overall, …".',
        'Thân bài 1 — ba loại TĂNG: nêu số 2000 → 2020 của từng loại; so sánh: rau luôn nhiều nhất, trái cây tăng nhiều gam nhất (+200).',
        'Thân bài 2 — hai loại GIẢM + điểm đáng chú ý: red meat 450 → 300, trong khi chicken 250 → 400 ⇒ năm 2020 người ta ăn thịt gà NHIỀU HƠN thịt đỏ; fish gần như không đổi và thấp nhất.',
        'Ngôn ngữ so sánh (T2 N8–N9): more … than · less … than · the most / the least · twice as much as · while / whereas · compared with. Thì QUÁ KHỨ ĐƠN cho cả hai năm.',
        'Bar chart KHÔNG có trục thời gian liên tục ⇒ đừng viết "rose steadily" (không biết giữa hai năm diễn ra thế nào); viết "was higher in 2020 than in 2000" hoặc "increased from … to …".',
        'Không giải thích nguyên nhân ("because chicken is cheaper"), không viết "In conclusion" — Task 1 chỉ cần overview. 20 phút: 3′ đọc biểu đồ · 14′ viết · 3′ soát (đơn vị grams, thì, số nhiều).',
      ],
      mau: {
        band: 'Band 5.0–5.5 (đích kế tiếp của người đang ở 4.5 — cố ý giữ 3 lỗi nhỏ để bạn tập soi)',
        s: 'The bar chart shows how much of five kind of food a person in one country ate each week in 2000 and in 2020. The unit is grams.\n\nOverall, people ate more vegetables, fruit and chicken in 2020 than in 2000, but they ate less red meat and fish. Vegetables were the most popular food in both years.\n\nIn 2000, a person ate 1,100 grams of vegetables per week. This number increased to 1,250 grams in 2020. Fruit also increased, from 800 grams to 1,000 grams. The amount of chicken were 250 grams in 2000 and it went up to 400 grams in 2020. This was a big increase.\n\nOn the other hand, the amount of red meat decreased. In 2000, people ate 450 grams of red meat, but in 2020 they ate only 300 grams, so chicken became more popular than the red meat. Fish was the least popular food. It was 200 grams in 2000 and 180 grams in 2020, so it did not change much.\n\nIn conclusion, people in this country ate more vegetables, fruit and chicken and less red meat in 2020.',
        phanTich: [
          '**Task Achievement (5.5)**: có đoạn Overview riêng, KHÔNG có số, nói đúng hai nhóm tăng / giảm và loại cao nhất — đây là thứ kéo bài lên khỏi band 5. Đủ số của cả 5 loại, đúng đơn vị. Điểm yếu: liệt kê lần lượt từng loại "… was … in 2000 and … in 2020" (kể số một cách máy móc), chỉ có MỘT so sánh chéo (thịt gà vượt thịt đỏ); đoạn "In conclusion" lặp lại overview — Task 1 không cần và không được cộng điểm.',
          '**Coherence & Cohesion (5.5)**: 5 đoạn rõ, nhóm đúng (loại tăng / loại giảm), có "Overall", "also", "On the other hand", "so". Nhưng từ nối ít và lặp ("so" hai lần trong một đoạn), tham chiếu còn đơn điệu ("This number", "It was").',
          '**Lexical Resource (5)**: đủ dùng nhưng lặp nhiều: "ate" 7 lần, "increased / went up", "the amount of". Dùng "popular" để chỉ LƯỢNG ăn là chưa chính xác (popular = được ưa chuộng) — band 6 viết "the most consumed food" hoặc "the highest figure". Chưa có ngôn ngữ so sánh mức độ ("slightly", "by 150 grams", "twice as much").',
          '**Grammar (5)**: quá khứ đơn nhất quán — tốt. Phần lớn là câu đơn và câu ghép với "and / but / so"; gần như không có câu phức (chưa có "while", "which", "compared with"). Còn lỗi cơ bản — xem mục Soi lỗi.',
          '🔎 **Soi lỗi — 3 lỗi CỐ Ý giữ lại trong bài (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "five kind of food" → "five **kinds** of food" (sau số đếm > 1 phải số nhiều); (2) ✗ "The amount of chicken were" → "The amount of chicken **was**" (chủ ngữ là "the amount" — số ít); (3) ✗ "more popular than the red meat" → "than red meat" (danh từ không đếm được nói chung KHÔNG dùng "the" — mạo từ, Tập 2 Ngày 1).',
          '**Muốn lên band 6**: (1) gộp số bằng so sánh thay vì kể từng loại: "Vegetables were eaten most in both years, at 1,100 grams in 2000 and 1,250 grams in 2020, while fish remained the lowest at about 200 grams."; (2) thêm mức thay đổi: "Fruit showed the largest rise, of 200 grams."; (3) bỏ "In conclusion"; (4) thay "popular" bằng "consumption of chicken was higher than that of red meat".',
          '**Lỗi band 4 cần tránh**: thiếu overview; dùng hiện tại đơn ("people eat"); chép nguyên câu đề; viết "rose steadily between 2000 and 2020" (biểu đồ chỉ có HAI năm, không biết ở giữa thế nào); giải thích nguyên nhân.',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Some people think that schools should teach children how to cook. Others believe that cooking lessons are a waste of school time.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Discussion essay (discuss both views + own opinion) about cooking lessons at school. Expected: an introduction that restates the two views (the writer\'s opinion may be stated here or after the two body paragraphs); one body paragraph for EACH view, with reasons and at least one example; a clearly stated own opinion; a conclusion consistent with that opinion. Either side (or a balanced position) is acceptable. An essay that discusses only one view, or gives no personal opinion, cannot reach band 6 for Task Response. No data to check.',
      goiY: [
        'Dạng Discussion (T2 N6) = 3 việc phải làm ĐỦ: bàn quan điểm 1 · bàn quan điểm 2 · nêu ý kiến của mình. Thiếu một trong ba ⇒ Task Response không quá 5.',
        'Bố cục 4–5 đoạn: Mở bài (viết lại hai quan điểm + câu "This essay will discuss both views and give my opinion") → Thân bài 1 "On the one hand, …" → Thân bài 2 "On the other hand, …" → Ý kiến "In my opinion, …" (đoạn riêng hoặc gộp vào kết bài) → Kết bài.',
        'Mỗi thân bài theo khung P-E-E (T2 N2): Point (câu chủ đề) → Explain (vì sao) → Example (ví dụ cụ thể).',
        'Ý ủng hộ dạy nấu ăn: sức khoẻ (ít fast food), kỹ năng sống khi ra ở riêng, bố mẹ bận không dạy được, hiểu về thực phẩm. Ý phản đối: thiếu giờ cho môn thi, tốn tiền bếp + nguyên liệu, có thể học ở nhà / xem video.',
        'Từ vựng nên dùng (T2 N4, N12): a healthy diet, fast food, ingredients, a balanced meal, a life skill, the school timetable, core subjects, equipment.',
        'Viết hai quan điểm bằng ngôi thứ ba ("Some people believe…", "Others argue…"); chỉ dùng "I" ở câu nêu ý kiến. 40 phút: 5′ dàn ý · 30′ viết · 5′ soát. Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 5.0–5.5 (đích kế tiếp của người đang ở 4.5 — cố ý giữ 3 lỗi nhỏ để bạn tập soi)',
        s: 'Nowadays, many young people cannot cook a simple meal. Some people think that schools should teach children how to cook. Other people think that this is a waste of school time. This essay will discuss both views and give my opinion.\n\nOn the one hand, some people believe that cooking lessons at school are useful. The first reason is health. Many children eat a lot of fast food because they do not know how to make healthy food. If they will learn to cook at school, they can make a simple meal with vegetables at home. Another reason is that many parents are very busy. They work all day, so they have no time to teach their children. For example, my cousin is fifteen years old, but she can only cook instant noodles because her parents always come home late.\n\nOn the other hand, other people think that school time is for important subjects such as maths, science and English. Students need these subjects to pass exams and get good job. If the school adds cooking lessons, students will have less time for studying. In addition, cooking lessons are expensive, because the school has to buy cookers, pans and food. Some schools do not have enough money for this.\n\nIn my opinion, schools should teach cooking, but only one lesson a week. I think health is more important than exam results. A student who eats well can also study better. Moreover, cooking is a skill for the whole life, and everybody needs it.\n\nIn conclusion, there are two different views about cooking lessons. I believe that children should learn to cook at school because it is good for their health and their future.',
        phanTich: [
          '**Task Response (5.5)**: làm ĐỦ ba việc của dạng Discussion — một đoạn cho mỗi quan điểm và một đoạn ý kiến riêng ("In my opinion, schools should teach cooking, but only one lesson a week"), kết bài nhất quán. Điểm yếu: ý còn chung chung và phát triển mỏng (đoạn ý kiến chỉ 4 câu ngắn, lý do "health is more important than exam results" chưa được giải thích); chỉ có một ví dụ cá nhân.',
          '**Coherence & Cohesion (5.5)**: bố cục chuẩn, mỗi đoạn một việc; dùng đúng cặp "On the one hand / On the other hand", "The first reason… Another reason…", "In addition", "Moreover", "In conclusion". Nhưng từ nối đặt máy móc ở đầu câu, và câu "This essay will discuss both views…" là câu thuộc lòng — không sai, nhưng không ghi điểm.',
          '**Lexical Resource (5)**: từ đúng chủ đề nhưng cơ bản: "fast food", "healthy food", "a simple meal", "instant noodles", "pass exams". Lặp "cook / cooking" và "think" rất nhiều; chưa có "a balanced diet", "a life skill", "core subjects", "the timetable".',
          '**Grammar (5)**: có câu phức với "because", "so", "but", câu điều kiện loại 1 đúng ở đoạn 3 ("If the school adds cooking lessons, students will have less time") và một mệnh đề quan hệ ("A student who eats well…"). Nhưng câu ngắn, cùng một kiểu, và còn lỗi cơ bản — xem mục Soi lỗi.',
          '🔎 **Soi lỗi — 3 lỗi CỐ Ý giữ lại trong bài (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "If they will learn to cook at school" → "If they **learn** to cook at school, they can…" (mệnh đề "if" của câu điều kiện loại 1 dùng HIỆN TẠI ĐƠN, không dùng "will" — sẽ học kỹ ở Tập 2 Ngày 13; chính bài này viết đúng ở đoạn 3); (2) ✗ "get good job" → "get **a** good job" (danh từ đếm được số ít cần mạo từ — Tập 2 Ngày 1); (3) ✗ "a skill for the whole life" → "a skill **for life**" / "a lifelong skill" (dịch từng chữ từ "kỹ năng cho cả đời").',
          '**Muốn lên band 6**: (1) mỗi thân bài thêm một câu Explain trả lời "vì sao" ("…because children who can cook depend less on processed food"); (2) nêu ý kiến ngay ở mở bài để cả bài có hướng; (3) đổi 2–3 từ nối đầu câu thành tham chiếu ("This skill…", "Such lessons…"); (4) thêm một câu nhượng bộ: "Although cooking lessons take time away from other subjects, …".',
          '**Cách tự chấm bài của bạn**: (1) Có đủ một đoạn cho MỖI quan điểm không? (2) Có câu "In my opinion / I believe…" nói rõ bạn nghiêng về bên nào không? (3) Kết bài có khớp với ý kiến đó không? (4) Đủ 250 từ chưa? Thiếu (1) hoặc (2) là lỗi nặng nhất của dạng này.',
        ],
      },
    },
  ],
};
