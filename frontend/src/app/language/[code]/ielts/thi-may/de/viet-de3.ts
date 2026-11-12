/**
 * Đề 3 — Academic Writing, THI CUỐI TẬP 2 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Ngày 24). TỰ SOẠN 12/11/2026.
 * Task 1: HAI pie chart (2005 và 2025) — T2 N12 (pie 1 và 2 hình), chủ đề truyền thông (T2 N18) ·
 * Task 2: Advantages / disadvantages (T2 N10), chủ đề du lịch (T2 N14).
 * Số liệu TỰ ĐẶT (không phải thống kê thật); mỗi hình cộng đủ 100%. Người làm Đề 3 nhắm band 5.0 ⇒ bài mẫu ở mức band 5.5–6.0 =
 * đích kế tiếp: overview rõ, số liệu chọn lọc và có so sánh, quan điểm rõ; còn vài chỗ dùng từ / ngữ pháp chưa chuẩn. Để nhãn band
 * TRUNG THỰC, mỗi bài CỐ Ý GIỮ 3 chỗ chưa chuẩn (kiểu lỗi band 5.5–6: kết hợp từ, đại từ thay thế, hoà hợp chủ–vị) — mục
 * "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải lỗi soạn thảo: sửa câu thì phải sửa luôn phần phân tích.
 * `figure` = năm 2005, `figure2` = năm 2025 (FigureView vẽ hai hình tròn cạnh nhau). `moTaSo` gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE3: DeViet = {
  id: 'viet-de3',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 3 (thi cuối Tập 2)',
  boDe: 'Đề 3',
  capDo: 'Band 5.0',
  moTa: 'Task 1: main source of news for adults in 2005 and 2025 (two pie charts) · Task 2: large numbers of tourists — advantages and disadvantages for local people',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The pie charts below show the main source of news for adults in one country in 2005 and 2025.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'pie',
        title: 'Main source of news for adults, 2005',
        unit: '% of adults',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của quốc gia nào.',
        slices: [
          { label: 'Television', value: 45 },
          { label: 'Newspapers', value: 28 },
          { label: 'Radio', value: 15 },
          { label: 'News websites', value: 10 },
          { label: 'Social media', value: 2 },
        ],
      },
      figure2: {
        kind: 'pie',
        title: 'Main source of news for adults, 2025',
        unit: '% of adults',
        note: 'Số liệu tự đặt cho bài thi thử, không phải thống kê thật của quốc gia nào.',
        slices: [
          { label: 'Television', value: 24 },
          { label: 'Newspapers', value: 8 },
          { label: 'Radio', value: 10 },
          { label: 'News websites', value: 20 },
          { label: 'Social media', value: 38 },
        ],
      },
      moTaSo: 'Two pie charts, PERCENTAGE of adults in one country naming each medium as their MAIN source of news; each chart totals 100%. 2005: television 45; newspapers 28; radio 15; news websites 10; social media 2. 2025: television 24; newspapers 8; radio 10; news websites 20; social media 38. Main features: traditional media fell (television 45 to 24, down 21 points, almost half; newspapers 28 to 8, down 20 points — the steepest fall in relative terms — and the smallest slice in 2025; radio 15 to 10, a small fall); online sources rose (news websites doubled from 10 to 20; social media rose from 2 to 38, the largest change, from the smallest slice in 2005 to the largest in 2025). Largest slice: television in 2005, social media in 2025. Television + newspapers = 73% in 2005; social media + news websites = 58% in 2025.',
      goiY: [
        'Mở bài (1 câu): viết lại đề — "The two pie charts compare where adults in one country mainly got their news in 2005 and in 2025." KHÔNG chép nguyên câu đề.',
        'Overview (BẮT BUỘC, 1–2 câu, KHÔNG số): báo chí truyền thống (TV, báo giấy, radio) GIẢM, nguồn trực tuyến TĂNG; nguồn lớn nhất đổi từ television sang social media.',
        'Thân bài 1 — năm 2005: xếp từ lớn đến nhỏ (TV 45% → báo giấy 28% → radio 15% → website 10% → mạng xã hội 2%).',
        'Thân bài 2 — năm 2025 và SỰ THAY ĐỔI: social media 2% → 38% (lớn nhất), websites gấp đôi (10% → 20%); TV giảm gần một nửa (45% → 24%), báo giấy 28% → 8% (nhỏ nhất), radio giảm nhẹ.',
        'Ngôn ngữ pie chart (T2 N12): accounted for / made up 45% · a quarter (25%) · just under half · one in ten (10%) · the largest / smallest share · doubled · fell by almost half. Thì QUÁ KHỨ ĐƠN (2025 đã qua).',
        'Chủ ngữ phải đúng: "The proportion of adults who chose television fell" (✗ "Television fell" — tivi không giảm, TỈ LỆ người chọn tivi giảm).',
        'Không giải thích nguyên nhân ("because of smartphones"), không nêu ý kiến. 20 phút: 3′ đọc hai hình · 14′ viết · 3′ soát (%, thì, chủ ngữ).',
      ],
      mau: {
        band: 'Band 5.5–6.0 (đích kế tiếp của người đang ở 5.0 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'The two pie charts compare the main sources of news for adults in one country in 2005 and 2025.\n\nOverall, traditional media such as television and newspapers became much less important over the twenty years, while online sources, especially social media, became the most popular way to get news.\n\nIn 2005, television was the main source of news for 45% of adults, and newspapers were second with 28%. Radio was used by 15% of people. In contrast, only 10% of adults read news websites, and social media was the smallest part of the chart, at just 2%.\n\nBy 2025, the picture was very different. The figure for social media rose sharply to 38%, and it became the largest source. News websites also doubled, from 10% to 20%. On the other hand, the percentage of television fell by almost half, to 24%. Newspapers showed the sharpest fall in relative terms, from 28% to only 8%, which made it the least popular source in 2025. The figure for radio also decreased, but only slightly, to 10%.',
        phanTich: [
          '**Task Achievement (6)**: overview rõ, không số, nêu đúng HAI xu hướng ngược nhau (truyền thống giảm – trực tuyến tăng) và sự đổi ngôi. Đủ số của cả 5 nguồn ở cả hai năm, có chọn điểm nổi bật ("doubled", "fell by almost half", "the least popular source"). Chú ý câu về báo giấy: tính theo ĐIỂM PHẦN TRĂM thì tivi giảm nhiều hơn (−21 so với −20), nên bài viết "the sharpest fall **in relative terms**" (báo giấy mất hơn 2/3, tivi mất gần 1/2) — viết "the biggest fall" trống không là SAI số liệu, bị trừ ở Task Achievement.',
          '**Coherence & Cohesion (6)**: 4 đoạn theo logic thời gian (2005 → 2025 + thay đổi); "Overall", "In contrast", "By 2025", "On the other hand", "also" dùng đúng việc; câu "By 2025, the picture was very different" chuyển đoạn tự nhiên.',
          '**Lexical Resource (5.5)**: có từ đúng dạng bài: "traditional media", "online sources", "rose sharply", "doubled", "only slightly". Nhưng còn kết hợp từ chưa chuẩn (xem Soi lỗi) và chưa dùng phân số ("almost a quarter", "just over a third").',
          '**Grammar (5.5–6)**: quá khứ đơn nhất quán; có câu phức với "while", bị động "was used by", mệnh đề quan hệ "which made…". Còn lỗi đại từ và chủ ngữ chưa chính xác.',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "News websites also doubled" → "The figure for news websites also doubled" (thứ tăng gấp đôi là TỈ LỆ, không phải các trang web); (2) ✗ "the percentage of television fell" → "the percentage of adults who chose television fell" ("percentage of" phải đi với nhóm người/vật được đếm); (3) ✗ "which made it the least popular source" → "which made **them**…" (thay cho "newspapers" — số nhiều).',
          '**Muốn lên band 6.5–7**: (1) thêm phân số / so sánh bội: "almost half of adults (45%)", "nearly twenty times higher"; (2) gộp nhóm: "Together, television and newspapers accounted for 73% in 2005, whereas the two online sources made up 58% in 2025."; (3) đa dạng chủ ngữ: "the share of…", "the proportion of adults relying on…".',
          '**Lỗi band 5 cần tránh**: tả lần lượt từng hình mà không so sánh hai năm; viết đủ 10 con số theo thứ tự in trên hình; thiếu overview; dùng "increase/decrease" cho pie chart chỉ có MỘT năm (một hình tròn đơn lẻ không có xu hướng).',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'Many towns and cities now receive large numbers of tourists every year.\n\nWhat are the advantages and disadvantages of this for the people who live there?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Advantages / disadvantages essay about large numbers of tourists, from the point of view of LOCAL RESIDENTS. Expected: an introduction that restates the topic; one body paragraph of advantages and one of disadvantages (two developed points each, with explanation and at least one example); a conclusion that summarises. The question does NOT ask "do the advantages outweigh the disadvantages", so a personal opinion is optional — if given, it must be consistent. Points about tourists themselves (not residents) are off-topic. No data to check.',
      goiY: [
        'Dạng Advantages / disadvantages (T2 N10): đề hỏi "What are the advantages and disadvantages" ⇒ nêu ĐỦ hai phía, cân đối; KHÔNG bắt buộc nêu ý kiến. (Nếu đề hỏi "Do the advantages outweigh the disadvantages?" thì mới BẮT BUỘC chọn bên.)',
        'Đọc kỹ: lợi / hại "for the people who live there" — cho NGƯỜI DÂN địa phương, không phải cho du khách hay cho cả nước.',
        'Bố cục 4 đoạn: Mở bài (viết lại đề + câu báo bài sẽ bàn cả hai phía) → Thân bài 1: 2 lợi ích → Thân bài 2: 2 bất lợi → Kết bài (tóm tắt, có thể thêm 1 câu ý kiến).',
        'Mỗi ý theo P-E-E: Point → Explain → Example. Lợi: việc làm + thu nhập, hạ tầng tốt hơn, gìn giữ di tích. Hại: giá cả tăng, đông đúc – ồn – kẹt xe, rác thải, phong tục bị thương mại hoá.',
        'Từ vựng nên dùng (T2 N14): tourism industry, local residents, the high season, souvenir shops, the cost of living, facilities, overcrowded, traditional customs.',
        'Cấu trúc nên có: "The main advantage of… is that…", "Another benefit is…", "However, there are also some drawbacks.", "As a result, …". 40 phút: 5′ dàn ý · 30′ viết · 5′ soát. Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 5.5–6.0 (đích kế tiếp của người đang ở 5.0 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'In recent years, tourism has grown very quickly, and many towns and cities now welcome thousands of visitors every year. This situation has both advantages and disadvantages for local people, and this essay will discuss them.\n\nThe main advantage of tourism is that it brings money and jobs. Tourists need hotels, restaurants, taxis and souvenirs, so local people can open small businesses or find work easily. For example, in my hometown, Hoi An, many families used to be fishermen or farmers, but now they earn much more money by running homestays and tailor shops. Another advantage is that the government usually improves roads, airports and public places in tourist areas. These things are built for visitors, but local people can use them too.\n\nHowever, there are also some disadvantages. The first one is that prices go up. When many tourists come, the cost of food and houses increases, and this makes life more difficult for local people who do not work in tourism. In addition, popular places become crowded and noisy, especially in the high season. Traffic jams are common, and there are more rubbish on the streets and beaches. As a result, residents sometimes feel that their town does not belong to them anymore. Some traditional customs may also change, because people start to do them only for showing tourists.\n\nIn conclusion, tourism gives local people more jobs and better facilities, but it also causes higher prices, crowds and pollution. In my opinion, the advantages are bigger than the disadvantages if the local government controls the number of visitors carefully.',
        phanTich: [
          '**Task Response (6)**: trả lời đúng câu hỏi và đúng đối tượng (người dân địa phương): hai lợi ích (việc làm – thu nhập; hạ tầng) và ba bất lợi (giá cả; đông đúc – rác; phong tục thay đổi), có ví dụ cụ thể (Hội An). Kết bài tóm tắt cả hai phía và thêm ý kiến có điều kiện ("if the local government controls…"). Chưa lên 7 vì ý thứ hai của mỗi đoạn phát triển mỏng (hạ tầng: 2 câu; phong tục: 1 câu).',
          '**Coherence & Cohesion (6)**: bố cục 4 đoạn chuẩn, câu chủ đề rõ ("The main advantage of tourism is that…", "However, there are also some disadvantages."); từ nối đa dạng vừa đủ: "For example", "Another advantage", "In addition", "As a result". Tham chiếu tốt: "These things", "this makes life more difficult".',
          '**Lexical Resource (5.5–6)**: từ chủ đề khá: "small businesses", "homestays", "tourist areas", "the high season", "traffic jams", "residents", "traditional customs", "facilities". Còn chỗ chọn từ chưa tự nhiên (xem Soi lỗi) và lặp "local people" 5 lần — thay bớt bằng "residents", "locals", "the community".',
          '**Grammar (5.5–6)**: trộn câu đơn và câu phức (so, but, when, because, if); "used to be" (Tập 2 Ngày 21); mệnh đề quan hệ "local people who do not work in tourism"; bị động "are built for visitors". Còn lỗi hoà hợp và dạng động từ.',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "there are more rubbish" → "there **is** more rubbish" ("rubbish" không đếm được ⇒ động từ số ít); (2) ✗ "only for showing tourists" → "only **to show** tourists" / "only as a show for tourists" (chỉ MỤC ĐÍCH dùng "to + V"); (3) ✗ "the advantages are bigger than the disadvantages" → "the advantages **outweigh** the disadvantages" / "are greater than" ("advantages" không đi với "bigger" — "outweigh" là kết hợp từ chuẩn của dạng bài này).',
          '**Muốn lên band 6.5–7**: (1) phát triển đủ P-E-E cho ý thứ hai của mỗi đoạn; (2) thêm câu nhượng bộ: "Although tourism creates jobs, many of them are seasonal and badly paid."; (3) dùng từ chính xác hơn: "the cost of living", "overcrowded", "commercialised"; (4) kết bài không chỉ liệt kê lại mà nêu điều kiện rõ: "provided that visitor numbers are limited".',
          '**Cách tự chấm bài của bạn**: (1) Có đoạn riêng cho LỢI và đoạn riêng cho HẠI không? (2) Mọi ý có nói về NGƯỜI DÂN (không phải du khách) không? (3) Mỗi ý có giải thích hoặc ví dụ không? (4) Kết bài có nhắc cả hai phía không? (5) Đủ 250 từ chưa?',
        ],
      },
    },
  ],
};
