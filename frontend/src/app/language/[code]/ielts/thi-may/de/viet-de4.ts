/**
 * Đề 4 — Academic Writing, GIỮA TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 15). TỰ SOẠN 18/11/2026.
 * Task 1: TABLE (bảng 5 hàng × 3 năm, một đơn vị %) — áp overview "chọn 2 điểm" + nhóm số liệu (T3 N4) và ngôn ngữ so sánh
 * (T3 N11) · Task 2: Problem–solution (khuôn Tập 2; T3 N18 sẽ nâng lên band 6), chủ đề nông thôn – thành thị.
 * Số liệu TỰ ĐẶT (không phải thống kê thật); mỗi cột cộng đủ 100%. Người làm Đề 4 nhắm band 5.5 ⇒ bài mẫu ở mức band 6.0–6.5 =
 * đích kế tiếp. Để nhãn band TRUNG THỰC, mỗi bài CỐ Ý GIỮ 3 chỗ chưa chuẩn (kiểu lỗi band 6: giới từ, mạo từ, kết hợp từ) — mục
 * "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích.
 * `figure.kind = 'table'`: `categories` = cột (năm), `series` = hàng (phương tiện). `moTaSo` gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE4: DeViet = {
  id: 'viet-de4',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 4 (giữa Tập 3)',
  boDe: 'Đề 4',
  capDo: 'Band 5.5',
  moTa: 'Task 1: how people travelled to work in one city in 2004, 2014 and 2024 (table) · Task 2: young people leaving the countryside — problems and solutions',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The table below shows the percentage of journeys to work made by five different means of transport in one city in 2004, 2014 and 2024.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'table',
        title: 'Journeys to work by means of transport, 2004–2024 (% of all journeys)',
        unit: '%',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của thành phố nào. Mỗi cột cộng đủ 100%.',
        categories: ['2004', '2014', '2024'],
        series: [
          { name: 'Car', values: [58, 49, 38] },
          { name: 'Bus', values: [22, 20, 21] },
          { name: 'Train / metro', values: [9, 15, 22] },
          { name: 'Bicycle', values: [4, 8, 12] },
          { name: 'On foot', values: [7, 8, 7] },
        ],
      },
      moTaSo: 'Table: PERCENTAGE of all journeys to work in one city made by each of five means of transport, in three years; each column totals 100%. Car: 58 (2004), 49 (2014), 38 (2024). Bus: 22, 20, 21. Train / metro: 9, 15, 22. Bicycle: 4, 8, 12. On foot: 7, 8, 7. Main features: the car was the most common means in all three years but its share fell steadily by 20 points (58 to 38); train / metro more than doubled (9 to 22) and overtook the bus (21) to become second in 2024; cycling tripled (4 to 12) but from a low base; bus and walking were almost unchanged (bus 20–22, on foot 7–8). The gap between car and the second most common means narrowed from 36 points (58 vs 22) to 16 points (38 vs 22). In 2004 walking (7) was more common than cycling (4); by 2024 this was reversed (12 vs 7).',
      goiY: [
        'Mở bài (1 câu): viết lại đề bằng từ khác — "The table compares how people in one city travelled to work in three years: 2004, 2014 and 2024." KHÔNG chép nguyên câu đề.',
        'Overview (BẮT BUỘC, 2 ý, KHÔNG số — Tập 3 Ngày 4): (1) ô tô luôn phổ biến nhất nhưng giảm mạnh; (2) tàu / metro và xe đạp tăng, còn xe buýt và đi bộ gần như không đổi.',
        'NHÓM số liệu thay vì tả từng hàng: Thân bài 1 = thứ THAY ĐỔI nhiều (car ↓, train / metro ↑, bicycle ↑) · Thân bài 2 = thứ ỔN ĐỊNH (bus, on foot). 15 con số — chỉ cần dùng khoảng 9–10.',
        'So sánh (Tập 3 Ngày 11): "more than doubled", "three times as high as", "by far the most common", "overtook the bus", "the gap narrowed". Nói mức thay đổi bằng điểm phần trăm: "fell by 20 percentage points".',
        'Chủ ngữ phải đúng: "The proportion of journeys made by car fell" (✗ "Cars fell"). Bảng nói về CHUYẾN ĐI (journeys), không phải số người hay số xe.',
        'Thì QUÁ KHỨ ĐƠN cho cả ba năm (2024 đã qua). Giới từ số liệu: rose FROM 9% TO 22% · fell BY 20 points · stood AT 21% · a fall OF 9 points.',
        'Không giải thích nguyên nhân ("because the city built a metro"), không nêu ý kiến. 20 phút: 3′ đọc bảng + khoanh số lớn nhất / thay đổi nhiều nhất · 14′ viết · 3′ soát (số, thì, giới từ).',
      ],
      mau: {
        band: 'Band 6.0–6.5 (đích kế tiếp của người đang ở 5.5 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'The table compares the proportion of journeys to work that were made by five means of transport in one city in 2004, 2014 and 2024.\n\nOverall, the car was by far the most common way of travelling to work in all three years, although its share fell considerably. In contrast, train or metro journeys and cycling became more popular, while the figures for buses and walking hardly changed.\n\nIn 2004, well over half of all journeys to work (58%) were made by car. This figure dropped to 49% in 2014 and then to 38% in 2024, a fall of 20 percentage points over the period. The opposite trend can be seen for rail travel. Only 9% of journeys were made by train or metro in 2004, but this proportion more than doubled to 22% in 2024, when it overtook the bus as the second most common means of transport. Cycling also grew steadily, from 4% to 12%, which was three times as high as the first year.\n\nThe other two means of transport were much more stable. The percentage of bus journeys stayed in about 20% throughout the period, and walking accounted for 7% or 8% of journeys in each year. As a result, the difference between the car and second most popular means of transport narrowed from 36 points in 2004 to only 16 points in 2024.',
        phanTich: [
          '**Task Achievement (6.5)**: overview rõ, không số, nêu đúng HAI điểm chính (ô tô dẫn đầu nhưng giảm; đường sắt + xe đạp tăng, xe buýt + đi bộ đứng yên). Số liệu được CHỌN (10/15 con số) và có so sánh: "more than doubled", "overtook the bus", "three times as high", khoảng cách 36 → 16 điểm. Mọi con số đều khớp bảng. Chưa lên 7 vì đoạn cuối chỉ lướt qua xe buýt (không nêu 22 → 20 → 21) và chưa nêu chi tiết đi bộ – xe đạp đổi thứ hạng.',
          '**Coherence & Cohesion (6.5)**: 4 đoạn, chia thân bài theo LOGIC (nhóm thay đổi / nhóm ổn định) chứ không theo thứ tự hàng trong bảng — đây là điểm khác bài band 5. Từ nối đúng việc: "Overall", "In contrast", "The opposite trend can be seen for…", "As a result". Tham chiếu: "This figure", "this proportion", "The other two means of transport".',
          '**Lexical Resource (6)**: từ đúng dạng bài: "by far the most common", "its share", "fell considerably", "percentage points", "accounted for", "narrowed", "stable". Paraphrase "train / metro" → "rail travel". Còn một chỗ giới từ sai và một so sánh thiếu vế (xem Soi lỗi).',
          '**Grammar (6–6.5)**: quá khứ đơn nhất quán; mệnh đề nhượng bộ "although its share fell"; mệnh đề quan hệ "when it overtook…", "which was three times as high…"; bị động "were made by car"; cụm đồng vị "a fall of 20 percentage points". Lỗi nhỏ về mạo từ và giới từ — đúng mức band 6 ("some errors, but they rarely reduce communication").',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "stayed **in** about 20%" → "stayed **at** about 20%" (số liệu đứng yên ở một mức: stay / remain / stand AT); (2) ✗ "three times as high as the first year" → "three times as high as **in** the first year" / "as the figure for 2004" (phải so TỈ LỆ với TỈ LỆ, không so tỉ lệ với một năm); (3) ✗ "the car and second most popular means" → "the car and **the** second most popular means" (so sánh nhất + số thứ tự luôn có "the").',
          '**Muốn lên band 7**: (1) thêm chi tiết đổi thứ hạng: "Walking was more common than cycling in 2004 (7% against 4%), but the reverse was true by 2024."; (2) dùng phân số / ước lượng: "almost three in five journeys", "just over a fifth"; (3) đa dạng chủ ngữ: "Car use…", "The share of commuters travelling by rail…".',
          '**Lỗi band 5 cần tránh**: tả lần lượt từng hàng với đủ 15 con số; không có overview hoặc overview có số; viết "the number of cars" trong khi bảng cho TỈ LỆ chuyến đi; trộn thì hiện tại với quá khứ; giải thích nguyên nhân.',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'In many countries, more and more young people are leaving the countryside to live and work in cities.\n\nWhat problems does this cause for rural areas? What solutions can you suggest?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Problem–solution essay about young people moving from the countryside to cities. Expected: an introduction that restates the trend and signals both parts; one body paragraph on the PROBLEMS FOR RURAL AREAS (two developed problems with explanation / example — e.g. ageing population, shortage of farm workers, closure of schools and shops, separated families); one body paragraph on SOLUTIONS, each clearly linked to one of the problems named (e.g. investment in rural jobs and internet, better schools and hospitals, support for young farmers); a conclusion that summarises. Problems for CITIES (overcrowding, housing) are off-topic unless clearly secondary. Both questions must be answered; an essay that only lists problems cannot score above band 5 for Task Response. No data to check.',
      goiY: [
        'Dạng Problem–solution: đề có HAI câu hỏi ⇒ phải trả lời CẢ HAI. Chỉ nêu vấn đề mà thiếu giải pháp (hoặc ngược lại) thì Task Response không quá band 5.',
        'Đọc kỹ phạm vi: "problems… for RURAL AREAS" — vấn đề cho NÔNG THÔN (làng thiếu người trẻ, thiếu lao động, trường lớp đóng cửa), không phải cho thành phố (kẹt xe, giá nhà).',
        'Bố cục 4 đoạn: Mở bài (viết lại xu hướng + câu báo bài sẽ bàn vấn đề và giải pháp) → Thân bài 1: 2 vấn đề → Thân bài 2: 2 giải pháp → Kết bài.',
        'Mỗi GIẢI PHÁP phải gắn với một VẤN ĐỀ đã nêu: thiếu việc làm ⇒ đầu tư nhà máy chế biến, du lịch nông thôn, internet để làm việc từ xa; dịch vụ kém ⇒ nâng cấp trường, bệnh viện. Nêu rõ AI làm (the government, local councils, companies).',
        'Mỗi ý theo P-E-E: Point → Explain → Example. Ngôn ngữ nên có: "One major problem is that…", "As a result, …", "This leads to…", "One possible solution is to…", "Governments should / could…", "This would encourage…".',
        'Dùng điều kiện loại 2 cho giải pháp (Tập 3 Ngày 15): "If rural areas had better-paid jobs, fewer young people would leave." 40 phút: 5′ dàn ý · 30′ viết · 5′ soát. Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 6.0–6.5 (đích kế tiếp của người đang ở 5.5 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'In many parts of the world, young people are moving away from villages and small towns in order to study or find work in big cities. This trend causes serious problems for the countryside, but I believe there are several ways to deal with them.\n\nThe most obvious problem is that rural areas lose their workforce. When most people in their twenties and thirties leave, there are not enough workers for farms and local businesses, and the population that remains is mainly elderly. In my home province in central Vietnam, for example, many rice fields are now empty because the old farmers cannot manage them alone. A second problem is that public services slowly disappear. If there are only a few children in a village, the school may be closed, and shops and clinics also shut because they have too little customers. As a result, life becomes even more difficult for the people who stay, and more of them decide to leave.\n\nTo solve these problems, governments need to make rural life more attractive. One possible solution is to create more jobs outside the cities. For instance, the government could offer lower taxes to companies that open factories or offices in small towns, and it could invest on fast internet so that young people are able to work online from their villages. Another solution is to improve schools, hospitals and roads in the countryside. If rural areas had the same quality of services as cities, fewer families would feel that they must move. In addition, young farmers should be given cheap loans to buy modern machines, which would make farming more profitable job.\n\nIn conclusion, the movement of young people to cities leaves rural areas with too few workers and poorer services. However, if governments invest in jobs and services outside the big cities, I think many young people would be happy to build their future in the place where they were born.',
        phanTich: [
          '**Task Response (6.5)**: trả lời đủ CẢ HAI câu hỏi và đúng phạm vi (vấn đề cho NÔNG THÔN): hai vấn đề (mất lao động – dân số già; dịch vụ công biến mất) đều có giải thích, một ví dụ cụ thể; ba giải pháp (việc làm – thuế – internet; nâng cấp dịch vụ; vay vốn cho nông dân trẻ) và giải pháp GẮN đúng vấn đề đã nêu. Chưa lên 7 vì giải pháp thứ ba chỉ có một câu và chưa bàn giải pháp có khả thi hay không.',
          '**Coherence & Cohesion (6.5)**: bố cục 4 đoạn chuẩn problem–solution; câu chủ đề rõ ("The most obvious problem is that…", "To solve these problems, governments need to…"); chuỗi nhân quả mạch lạc: "When… → there are not enough… → As a result… → more of them decide to leave" (vòng luẩn quẩn). Từ nối đa dạng vừa đủ: "for example", "A second problem", "For instance", "In addition", "However".',
          '**Lexical Resource (6)**: từ chủ đề tốt: "workforce", "elderly", "public services", "clinics", "lower taxes", "invest", "cheap loans", "profitable". Kết hợp từ đúng: "deal with them", "make rural life more attractive", "build their future". Còn hai chỗ kết hợp từ / giới từ sai (xem Soi lỗi).',
          '**Grammar (6–6.5)**: trộn câu đơn – phức tự nhiên: mệnh đề thời gian "When most people… leave", điều kiện loại 1 "If there are only a few children…, the school may be closed", điều kiện loại 2 "If rural areas had…, fewer families would feel…" (Tập 3 Ngày 15), bị động "should be given", mệnh đề quan hệ "companies that open…", "which would make…". Lỗi mạo từ và lượng từ còn sót.',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "too **little** customers" → "too **few** customers" ("customers" đếm được ⇒ few; "little" đi với danh từ không đếm được); (2) ✗ "invest **on** fast internet" → "invest **in** fast internet" (invest luôn đi với "in" — cuối bài viết đúng: "invest in jobs"); (3) ✗ "make farming more profitable job" → "make farming **a** more profitable job" (danh từ đếm được số ít cần mạo từ).',
          '**Muốn lên band 7**: (1) phát triển giải pháp thứ ba thành P-E-E đủ, hoặc bỏ để hai giải pháp đầu sâu hơn; (2) thêm câu đánh giá: "Although these measures are expensive, the cost of empty villages would be far higher."; (3) dùng từ chính xác hơn: "an ageing population", "rural depopulation", "remote working", "tax incentives".',
          '**Cách tự chấm bài của bạn**: (1) Có đoạn riêng cho VẤN ĐỀ và đoạn riêng cho GIẢI PHÁP không? (2) Vấn đề có phải của NÔNG THÔN không? (3) Mỗi giải pháp có nói rõ AI làm và giải quyết vấn đề NÀO không? (4) Có ít nhất một ví dụ cụ thể không? (5) Đủ 250 từ chưa?',
        ],
      },
    },
  ],
};
