/**
 * Đề 5 — Academic Writing, THI CUỐI TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 30). TỰ SOẠN 18/11/2026.
 * Task 1: PROCESS (quy trình 9 bước làm dầu ô-liu — T3 N28 "process + map band 6", ngôn ngữ quy trình T3 N17, bị động T3 N13) ·
 * Task 2: TWO-PART QUESTION (T3 N22) dạng "Why…? Is this a positive or a negative development?" (lập trường: T3 N14),
 * chủ đề vứt đồ hỏng mua đồ mới thay vì sửa.
 * Quy trình TỰ DỰNG theo hiểu biết phổ thông về ép dầu ô-liu (thu hoạch cuối năm, nghiền cả hạt, khuấy, ly tâm, lọc, trữ bồn
 * thép, đóng chai sẫm màu) — con số (24 giờ, 30–40 phút) đặt cho bài thi thử, không phải tiêu chuẩn của nhà máy nào.
 * Người làm Đề 5 nhắm band 6.0 ⇒ bài mẫu ở mức band 6.5–7.0 = đích kế tiếp. Để nhãn band TRUNG THỰC, mỗi bài CỐ Ý GIỮ 3 chỗ
 * chưa chuẩn (giới từ, thì, hoà hợp chủ–vị, kết hợp từ) — mục "🔎 Soi lỗi" trong `phanTich` chỉ rõ + cách sửa. KHÔNG phải lỗi
 * soạn thảo: sửa câu thì phải sửa luôn phần phân tích.
 * `figure.kind = 'process'`: `steps` = các bước theo thứ tự (label + note). `moTaSo` gửi kèm cho AI chấm.
 */
import type { DeViet } from './types';

export const VIET_DE5: DeViet = {
  id: 'viet-de5',
  kyNang: 'viet',
  ten: 'Academic Writing — Đề 5 (thi cuối Tập 3)',
  boDe: 'Đề 5',
  capDo: 'Band 6.0',
  moTa: 'Task 1: how olive oil is produced (process diagram) · Task 2: throwing things away instead of repairing them — why, and is it a positive or negative development? (two-part question)',
  phut: 60,
  task: [
    {
      so: 1,
      phut: 20,
      minTu: 150,
      de: 'The diagram below shows how olive oil is produced.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
      figure: {
        kind: 'process',
        title: 'The production of olive oil',
        note: 'Sơ đồ tự dựng cho bài thi thử; các con số (24 giờ, 30–40 phút) không phải tiêu chuẩn của nhà máy nào.',
        steps: [
          { label: '1. Harvesting', note: 'October–December: olives shaken from the trees onto nets' },
          { label: '2. Transport', note: 'taken to the mill within 24 hours' },
          { label: '3. Cleaning', note: 'leaves removed; olives washed in cold water' },
          { label: '4. Crushing', note: 'whole olives (with stones) crushed into a thick paste' },
          { label: '5. Mixing', note: 'paste stirred slowly for 30–40 minutes' },
          { label: '6. Separating', note: 'centrifuge: oil separated from water and solids; solid waste dried and burned as fuel' },
          { label: '7. Filtering', note: 'oil passed through a filter to remove small particles' },
          { label: '8. Storage', note: 'kept in steel tanks, away from light' },
          { label: '9. Bottling', note: 'dark glass bottles; delivered to shops' },
        ],
      },
      moTaSo: 'Process diagram: the production of olive oil in NINE stages, in a fixed linear order. (1) Harvesting, October–December: olives are shaken from the trees onto nets. (2) Transport: taken to the mill within 24 hours. (3) Cleaning: leaves removed, olives washed in cold water. (4) Crushing: whole olives, including stones, crushed into a thick paste. (5) Mixing: paste stirred slowly for 30–40 minutes. (6) Separating: a centrifuge separates the oil from water and solids; the solid waste is dried and burned as fuel. (7) Filtering: oil passed through a filter to remove small particles. (8) Storage: kept in steel tanks, away from light. (9) Bottling: dark glass bottles, delivered to shops. Main features for the overview: nine stages from picking the fruit to delivery to shops; a mechanical process (crushing, mixing, spinning, filtering); the only by-product, solid waste, is reused as fuel. Every stage should be mentioned and the order must be correct; the only figures are 24 hours and 30–40 minutes (and the months). No opinion or explanation from outside the diagram.',
      goiY: [
        'Mở bài (1 câu): viết lại đề bằng từ khác — "The diagram illustrates the stages by which olives are turned into bottled olive oil." KHÔNG chép nguyên câu đề.',
        'Overview (BẮT BUỘC, không chi tiết): quy trình có BAO NHIÊU bước, bắt đầu bằng gì, kết thúc bằng gì + một nhận xét chung (vd. phần bã được dùng lại làm nhiên liệu). Bài process không có "xu hướng" — overview là bức tranh toàn cảnh của quy trình.',
        'Tả ĐỦ cả 9 bước, đúng thứ tự — bỏ sót một bước là mất điểm Task Achievement. Chia 2 thân bài theo logic: Thân 1 = từ thu hoạch tới khi thành bột nhão (bước 1–5) · Thân 2 = tách dầu tới khi ra cửa hàng (bước 6–9).',
        'BỊ ĐỘNG là ngữ pháp chính (Tập 3 Ngày 13): "the olives ARE SHAKEN…", "the paste IS STIRRED…", "the oil IS STORED…". Thì HIỆN TẠI ĐƠN cho cả bài (quy trình luôn đúng). Sơ đồ ghi cụm danh từ ("Cleaning: leaves removed") — bạn phải viết thành câu đủ chủ–vị.',
        'Từ nối trình tự (Tập 3 Ngày 17), đừng lặp "then" suốt bài: "In the first stage", "Once the leaves have been removed", "After that", "In the following stage", "while", "Finally", "before being poured…".',
        'Dùng các chi tiết in trên sơ đồ: "between October and December", "within 24 hours", "for 30 to 40 minutes", "including their stones", "away from light". KHÔNG thêm kiến thức ngoài sơ đồ (dầu ô-liu tốt cho sức khoẻ…), không nêu ý kiến.',
        '20 phút: 3′ đọc sơ đồ + đếm bước + gạch chỗ chia thân bài · 14′ viết · 3′ soát (bị động có đủ "be" + V3 chưa, danh từ số ít / số nhiều, giới từ).',
      ],
      mau: {
        band: 'Band 6.5–7.0 (đích kế tiếp của người đang ở 6.0 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'The diagram illustrates the stages by which olives are turned into bottled olive oil.\n\nOverall, the process consists of nine steps, beginning with the harvesting of the fruit and ending with the delivery of the finished product to shops. It is noticeable that the fruit is processed soon after it is picked and that the solid waste is not thrown away but reused.\n\nIn the first stage, between October and December, the olives are shaken from the trees and collected on nets. They are then transported to a mill, where they must arrive within 24 hours. Once the leaves have been removed, the fruit is washed in cold water. After that, the whole olives, including their stones, are crushed until they will form a thick paste, which is stirred slowly during 30 to 40 minutes.\n\nIn the following stage, the paste is spun in a centrifuge so that the oil separates from the water and the solids. The solid waste is dried and burned as fuel, while the oil is passed through a filter in order to remove any small particles. Finally, the oil is stored in steel tanks, which protect it of light, before being poured into dark glass bottles and delivered to shops.',
        phanTich: [
          '**Task Achievement (7)**: overview rõ, đứng riêng một đoạn: số bước, điểm đầu, điểm cuối + hai nhận xét khái quát (xử lý sớm sau khi hái; bã được dùng lại). ĐỦ cả 9 bước, đúng thứ tự, có đủ chi tiết thời gian in trên sơ đồ (October–December, 24 hours, 30 to 40 minutes). Không thêm ý kiến hay kiến thức ngoài sơ đồ.',
          '**Coherence & Cohesion (7)**: 4 đoạn; thân bài chia đúng chỗ "gãy" của quy trình (trước / sau khi tách dầu). Từ nối trình tự đa dạng: "In the first stage", "then", "Once the leaves have been removed", "After that", "In the following stage", "while", "Finally", "before being poured". Tham chiếu gọn: "They", "the fruit", "the paste", "which".',
          '**Lexical Resource (6.5)**: động từ quy trình chính xác thay cho từ trên sơ đồ: Harvesting → "are shaken… and collected", Transport → "are transported", Separating → "is spun… so that the oil separates", Bottling → "being poured into… bottles". Cụm tốt: "consists of nine steps", "the finished product", "in order to remove any small particles". Còn hai chỗ giới từ sai (xem Soi lỗi).',
          '**Grammar (6.5–7)**: bị động hiện tại đơn nhất quán (Tập 3 Ngày 13); bị động hoàn thành trong mệnh đề thời gian "Once the leaves have been removed"; mệnh đề quan hệ không xác định (Ngày 17): "a mill, where they must arrive…", "a thick paste, which is stirred…", "steel tanks, which protect it…"; mệnh đề mục đích "so that…", "in order to…"; "before being poured" (giới từ + V-ing bị động). Lỗi còn sót ít và không cản trở hiểu.',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "crushed until they **will form** a thick paste" → "until they **form** a thick paste" (sau until / when / once / before KHÔNG dùng "will"); (2) ✗ "stirred slowly **during** 30 to 40 minutes" → "**for** 30 to 40 minutes" (for + khoảng thời gian; during + danh từ chỉ sự kiện: during the harvest); (3) ✗ "protect it **of** light" → "protect it **from** light" (protect sb/sth FROM sth).',
          '**Muốn lên band 7.5**: (1) gộp hai bước ngắn bằng phân từ: "Having been washed in cold water, the olives are crushed…"; (2) thay "It is noticeable that…" bằng nhận xét cô hơn: "Notably, the only by-product, solid waste, is recycled as fuel."; (3) dùng danh hoá (Ngày 25): "After the removal of the leaves…".',
          '**Lỗi band 5 cần tránh**: chép nguyên nhãn sơ đồ thành câu thiếu động từ ("Cleaning: leaves removed"); viết chủ động với chủ ngữ "people / workers" suốt bài; lặp "and then… and then…"; bỏ overview; thêm ý kiến ("this is a good way to make oil"); sót bước 7 hoặc 8.',
        ],
      },
    },
    {
      so: 2,
      phut: 40,
      minTu: 250,
      de: 'In many countries today, people throw away damaged or old things and buy new ones instead of repairing them.\n\nWhy do you think this is happening? Is this a positive or a negative development?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
      moTaSo: 'Two-part question about people replacing damaged or old things instead of repairing them. Expected: an introduction that restates the trend and signals BOTH parts (ideally with the writer\'s position on the second question); one body paragraph answering WHY (two developed reasons with explanation / example — e.g. new goods are cheap because of mass production, repair costs more than replacement, products are not designed to be repaired, spare parts are hard to find, advertising and fashion, lack of time or skills); one body paragraph answering whether it is POSITIVE OR NEGATIVE with a clear position and support (e.g. negative: waste, pollution from electronic waste, use of raw materials and energy, loss of repair skills and small repair businesses; positive: convenience, newer and safer or more efficient products, jobs in manufacturing); a conclusion that answers both questions briefly. The position must be consistent from introduction to conclusion. An essay that answers only one of the two questions cannot score above band 5 for Task Response. No data to check.',
      goiY: [
        'Dạng Two-part question (Tập 3 Ngày 22): đề có HAI câu hỏi KHÁC LOẠI — (1) WHY = nguyên nhân, (2) POSITIVE or NEGATIVE = đánh giá. Trả lời cả hai, mỗi câu MỘT thân bài; thiếu một câu thì Task Response không quá band 5.',
        'Bố cục 4 đoạn: Mở bài (viết lại xu hướng + câu báo: "I will explain why… and argue that it is mainly a negative development") → Thân 1: 2 nguyên nhân → Thân 2: lập trường + 2–3 lý do → Kết bài trả lời gọn CẢ HAI câu.',
        'Câu 1 — nguyên nhân: chọn 2 ý và phát triển đủ, vd. đồ mới rẻ nhờ sản xuất hàng loạt (sửa đắt hơn mua); sản phẩm không được thiết kế để sửa (dán keo, thiếu linh kiện); quảng cáo và mốt. Mỗi ý theo P-E-E: Point → Explain → Example.',
        'Câu 2 — đánh giá (Tập 3 Ngày 14): chọn MỘT lập trường rõ (positive / negative / "mainly negative") và giữ nhất quán. Bài band 6.5+ thừa nhận mặt ngược lại bằng 1 câu nhượng bộ rồi bác: "It is true that…, However, …".',
        'Ngôn ngữ nên có: nguyên nhân — "The first reason is…", "Because…", "which means that…"; đánh giá — "the disadvantages are much more serious than the benefits", "the environmental cost", "There is also a social cost"; nhượng bộ (Ngày 21) — "Although this is convenient…".',
        'Đừng lạc đề sang "giải pháp" quá dài — đề không hỏi "What can be done?". Một câu khuyến nghị ở kết bài là đủ. 40 phút: 5′ dàn ý (2 nguyên nhân + lập trường + 2 lý do) · 30′ viết · 5′ soát. Dưới 250 từ bị trừ điểm.',
      ],
      mau: {
        band: 'Band 6.5–7.0 (đích kế tiếp của người đang ở 6.0 — cố ý giữ 3 chỗ chưa chuẩn để bạn tập soi)',
        s: 'In many countries, when a phone, a pair of shoes or a kitchen machine stops working, people simply throw it away and buy another one. In this essay, I will explain why this habit has become so common and argue that it is mainly a negative development.\n\nThere are two main reasons for this trend. The first is cost. Because most goods are now produced in huge quantities in factories abroad, a new product is often cheaper than a repair. For example, when my printer broke last year, the repair shop asked for more money than the price of a new model, so I had no real choice. The second reason is the way modern products are designed. Many devices are glued together rather than screwed, and spare parts are difficult to be found, which means that even a skilled person cannot fix them easily. In addition, advertising persuades us that anything older than two years are out of fashion.\n\nIn my opinion, the disadvantages of this situation are much more serious than the benefits. It is true that replacing things is convenient and that it keeps factories busy, which creates jobs. However, the environmental cost is enormous. Every product that is thrown away becomes waste, and electronic waste in particular contains dangerous chemicals that can pollute soil and water. Moreover, making a new product uses energy and raw materials that the planet cannot provide forever. There is also a social cost: traditional skills such as mending clothes or repairing shoes are disappearing, and the small businesses that offered these services are closing.\n\nIn conclusion, people replace rather than repair mainly because new goods are cheap and are not designed to be fixed. Although this is convenient for consumers, I believe it is a negative development because of the damage it makes to the environment, and governments should encourage companies to make products that last longer.',
        phanTich: [
          '**Task Response (7)**: trả lời đủ CẢ HAI câu hỏi, mỗi câu một thân bài. Câu 1: hai nguyên nhân chính (giá — sản xuất hàng loạt; thiết kế — dán keo, thiếu linh kiện) đều có giải thích, một ví dụ cá nhân cụ thể (chiếc máy in), thêm ý phụ về quảng cáo. Câu 2: lập trường rõ từ mở bài ("mainly a negative development"), giữ nhất quán tới kết bài; có nhượng bộ ("It is true that…") rồi bác bằng ba lý do (rác thải, tài nguyên, mất nghề sửa chữa). Chưa lên 7.5 vì ý quảng cáo chỉ có một câu, chưa phát triển.',
          '**Coherence & Cohesion (7)**: bố cục 4 đoạn chuẩn two-part; câu chủ đề báo đúng nội dung từng thân bài ("There are two main reasons for this trend", "the disadvantages… are much more serious than the benefits"). Liên kết tự nhiên: "The first is cost… The second reason is…", "In addition", "It is true that… However", "Moreover", "There is also a social cost:". Kết bài trả lời gọn cả hai câu hỏi trong hai câu.',
          '**Lexical Resource (6.5–7)**: từ chủ đề chính xác: "in huge quantities", "spare parts", "a skilled person", "out of fashion", "the environmental cost", "electronic waste", "raw materials", "mending clothes". Kết hợp từ tốt: "had no real choice", "keeps factories busy", "pollute soil and water". Còn một chỗ kết hợp từ sai (xem Soi lỗi).',
          '**Grammar (6.5)**: nhiều cấu trúc phức và phần lớn đúng: mệnh đề nguyên nhân "Because most goods are now produced…"; bị động "are glued together rather than screwed"; mệnh đề quan hệ "chemicals that can pollute…", "businesses that offered…", ", which creates jobs"; mệnh đề danh ngữ "It is true that…" (Tập 3 Ngày 23); nhượng bộ "Although this is convenient…" (Ngày 21). Hai lỗi ngữ pháp còn sót (xem dưới).',
          '🔎 **Soi lỗi — 3 chỗ CỐ Ý giữ lại (hãy tự tìm trước khi đọc tiếp)**: (1) ✗ "spare parts are difficult **to be found**" → "difficult **to find**" (sau tính từ difficult / easy / hard dùng to-V CHỦ ĐỘNG dù nghĩa bị động); (2) ✗ "anything older than two years **are** out of fashion" → "**is** out of fashion" (anything / everything / something luôn đi với động từ số ít — đừng để "two years" đánh lừa); (3) ✗ "the damage it **makes** to the environment" → "the damage it **does** to the environment" (do damage / cause damage, không "make damage").',
          '**Muốn lên band 7.5**: (1) phát triển hoặc bỏ ý quảng cáo — mỗi ý nêu ra phải được giải thích; (2) thêm từ chính xác hơn: "a throwaway culture", "planned obsolescence" (cố ý làm sản phẩm mau hỏng), "landfill", "the right to repair"; (3) thêm một câu điều kiện loại 2: "If products were designed to be opened easily, far fewer of them would end up as waste."',
          '**Cách tự chấm bài của bạn**: (1) Có MỘT thân bài cho "why" và MỘT thân bài cho "positive or negative" không? (2) Lập trường ở mở bài, thân bài 2 và kết bài có GIỐNG nhau không? (3) Mỗi nguyên nhân có giải thích + ví dụ chưa? (4) Có câu nhượng bộ thừa nhận mặt ngược lại không? (5) Đủ 250 từ chưa?',
        ],
      },
    },
  ],
};
