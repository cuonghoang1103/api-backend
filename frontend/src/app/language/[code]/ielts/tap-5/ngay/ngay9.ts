/**
 * IELTS Tập 5 — Ngày 9 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 * NGÀY MỔ ĐỀ 9 (nửa đầu: Reading + Listening; Writing + Speaking mổ ở Ngày 10).
 *   Bài 1 (grammar)   Song song (parallelism) · chủ ngữ treo band 8 (7 kiểu mở đầu câu) · bổ ngữ đặt sai chỗ · câu dài vẫn rõ +
 *                     dấu câu                                                                             [G43 G32]
 *                     — nối Tập 3 Ngày 27 (song song nhập), Tập 4 Ngày 5 (dangling participle), Tập 4 Ngày 21 (dấu câu band 7),
 *                       Tập 5 Ngày 3 (lỗi dai dẳng), Ngày 5 (câu phức nhiều tầng)
 *   Bài 2 (reading)   Mổ Reading Đề 9 (YNNG 31–36 · TFNG 1–6 · Headings 14–20 · các câu bẫy 10, 13, 21, 23, 28, 30, 38, 40) rồi
 *                     luyện lại bằng bài MỚI “In Praise of Slack” (~930 từ, 7 đoạn): Headings i–x + YNNG, 14 câu      [R15 R12]
 *                     — nối Tập 4 Ngày 3 (headings ý ẩn) · Ngày 5 (YNNG ba bẫy) · Tập 5 Ngày 3 (TFNG band 8) · Ngày 5 (headings 4)
 *   Bài 3 (listening) Mổ Listening Đề 9: năm loại lỗi, từng câu dễ sai của 4 Part, câu tín hiệu “bác rồi mới nói”, rồi luyện lại
 *                     bằng 3 bài MỚI (Part 1 giọng Ireland + Úc · Part 3 ba giọng NZ + Canada + Anh · Part 4 giọng Mỹ)  [L16]
 *                     — nối Tập 4 Ngày 28 (bẫy đổi ý), Tập 5 Ngày 1 (Part 1 tốc độ thật), Ngày 4 (Part 2 + 3), Ngày 5 (Part 4)
 *                     🔊 trọng âm tương phản khi người nói SỬA thông tin
 *   Bài tập Ngày 9    42 câu có đáp án + trang sổ lỗi
 * Mọi id bắt đầu `t5d9-`. KHÔNG chép lại đề: chỉ trích ngắn chỗ cần mổ; bài luyện là bài mới, đề tài chưa dùng ở Tập 3–5 và Đề 0–12
 * (đã grep: slack / just-in-time / tree surgeon / fog = 0 hoặc không phải đề tài chính). Dữ kiện bài đọc: quan hệ phi tuyến giữa mức
 * sử dụng và thời gian chờ (lý thuyết hàng đợi), sản xuất “đúng lúc” của các hãng xe Nhật sau Thế chiến II, hệ số an toàn của cầu —
 * kiến thức phổ thông, cố ý không nêu số liệu / tên hãng. Bài nghe Part 4 (lưới hứng sương): hiện tượng có thật (Chile, Ma-rốc…),
 * chi tiết về làng và con số là MINH HOẠ, không gắn với một dự án cụ thể. Mọi nhân vật, công ty trong bài nghe là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_9: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d9-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Song song (parallelism), chủ ngữ treo (dangling modifiers), bổ ngữ đặt sai chỗ — câu dài vẫn rõ",
    goal: "Viết được câu 30–40 từ mà người đọc không phải đọc lại: các vế nối bằng and / or / but, cặp not only… but also, either… or và phép so sánh đều cùng dạng; mọi cụm mở đầu câu (V-ing, V3, To V, As a…, Unlike…) có đúng chủ ngữ; only / almost và mệnh đề quan hệ đứng sát từ chúng bổ nghĩa; dấu chấm phẩy và hai chấm đặt đúng — và dùng chính các luật này để ĐỌC nhanh câu dài trong Passage 3.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Hôm qua bạn làm **Đề 9**. Hôm nay và Ngày 10 là hai ngày **mổ đề**. Bài 1 học ngữ pháp trước, vì hai lỗi của hôm nay lộ ra đúng ở chỗ band 8 đòi: ==câu dài==.",
          "**Song song** (parallelism) = các vế nối với nhau phải ==cùng dạng==: danh từ với danh từ, V-ing với V-ing, mệnh đề với mệnh đề. Bốn chỗ hay gãy: danh sách · cặp liên từ (not only… but also) · so sánh (than, as) · từ nhỏ bị bỏ quên (that, to, giới từ).",
          "**Chủ ngữ treo** (dangling modifier) = cụm mở đầu câu không có chủ ngữ riêng, nên nó ==mượn chủ ngữ của mệnh đề chính==. Mượn nhầm là sai. Tập 4 Ngày 5 dạy với V-ing / V3; hôm nay thêm To V, As a…, Unlike…, At the age of…, Compared with….",
          "**Bổ ngữ đặt sai chỗ**: only, almost, even và mệnh đề quan hệ phải đứng ==sát== từ chúng bổ nghĩa.",
          "**Câu dài vẫn rõ**: bốn phép thử (chủ ngữ gần động từ · một cụm mở đầu · tối đa hai tầng phụ · ý mới ở cuối) + ba dấu câu (, ; :).",
          "Các luật này cũng là công cụ ĐỌC: gặp câu 40 từ trong Passage 3, tìm các vế song song là thấy ngay bộ khung.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — ôn Tập 3 Ngày 27 và Tập 4 Ngày 5 (5 câu)" },
      {
        t: "mcq",
        id: "t5d9-on-dau-bai",
        title: "Chọn câu ĐÚNG ngữ pháp (5 câu)",
        items: [
          { q: "1.", options: ["The course teaches students to plan, drafting and how to edit.", "The course teaches students to plan, to draft and to edit.", "The course teaches students planning, to draft and edit.", "The course teaches students to plan, draft and editing."], correct: 1, why: "Ba vế nối bằng and phải cùng dạng: to plan, to draft and to edit (hoặc to plan, draft and edit). Tập 3 Ngày 27." },
          { q: "2.", options: ["Having finished the survey, the results were sent to the council.", "Having finished the survey, the council received the results.", "Having finished the survey, the students sent the results to the council.", "Having finished the survey, there was a report for the council."], correct: 2, why: "Người “finish the survey” là the students ⇒ chủ ngữ mệnh đề chính phải là the students. Ba câu kia để chủ ngữ treo. Tập 4 Ngày 5." },
          { q: "3.", options: ["Located near the river, floods often damage the village.", "Located near the river, the village is often damaged by floods.", "Located near the river, people in the village often suffer floods.", "Located near the river, there are often floods in the village."], correct: 1, why: "Cái “located near the river” là the village ⇒ the village làm chủ ngữ chính." },
          { q: "4.", options: ["She is not only a good programmer but also explains things clearly.", "She not only is a good programmer but also a clear explainer.", "She is not only a good programmer but also a clear explainer.", "Not only she is a good programmer but also a clear explainer."], correct: 2, why: "Sau not only là cụm danh từ ⇒ sau but also cũng phải là cụm danh từ. Câu cuối sai vì Not only đứng đầu câu phải đảo ngữ (Not only is she…)." },
          { q: "5.", options: ["The climate of Hue is wetter than Da Lat.", "The climate of Hue is wetter than that of Da Lat.", "The climate of Hue is wetter than Da Lat's one.", "The climate of Hue is more wet than Da Lat."], correct: 1, why: "So khí hậu với khí hậu, không so khí hậu với thành phố ⇒ than that of Da Lat. Mục 4 hôm nay dạy kỹ." },
        ],
      },
      {
        t: "note",
        title: "📌 Đọc điểm",
        items: [
          "**5/5**: bạn nắm luật. Hôm nay học các trường hợp tinh hơn — chỗ người band 7.5 vẫn trượt khi câu dài.",
          "**3–4/5**: đọc kỹ mục 2 và mục 6, làm đủ bài dịch.",
          "**≤ 2/5**: ôn Tập 4 Ngày 5 mục 7 (dangling participle) trước khi học tiếp.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao hai lỗi này quyết định band 8" },
      {
        t: "p",
        text: "Mô tả band 8 của tiêu chí ngữ pháp: ==nhiều loại cấu trúc, đa số câu không lỗi==. Người band 7 viết câu 15 từ gần như không sai. Lỗi xuất hiện khi họ cố viết câu 30 từ: vế thứ ba của danh sách đổi dạng, cụm mở đầu câu mất chủ ngữ, chữ only trôi lên trước động từ. Giám khảo không cần tìm — câu đọc lên là thấy vấp.",
      },
      {
        t: "table",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Câu dài", "có, nhưng người đọc đôi khi phải đọc lại", "đọc một lần là hiểu"],
          ["Song song", "đúng ở danh sách ngắn; gãy ở cặp not only… but also, ở phép so sánh", "đúng cả khi mỗi vế dài 8–10 từ"],
          ["Cụm mở đầu câu", "thỉnh thoảng treo (As a student, the library…)", "luôn có đúng chủ ngữ"],
          ["Dấu câu", "nối hai câu bằng dấu phẩy (comma splice)", "dùng ; : — có chủ ý"],
        ],
      },
      { t: "rule", formula: "câu dài band 8  =  các vế cùng dạng  +  cụm mở đầu có đúng chủ ngữ  +  bổ ngữ đứng sát từ nó bổ nghĩa", vi: "Ba luật của hôm nay. Thứ tự ưu tiên vẫn như Ngày 1: đúng → rõ → đa dạng." },

      /* ── 2 ── */
      { t: "h", text: "2. Song song ① — danh sách và cặp nối bằng and / or / but" },
      {
        t: "p",
        text: "Luật: những gì đứng hai bên **and / or / but** phải ==cùng loại từ và cùng dạng==. Cách kiểm nhanh: ghép phần đứng trước danh sách với TỪNG vế. Vế nào ghép vào không thành câu thì vế đó gãy.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V + N, N and N",
            vi: "Ba danh từ / cụm danh từ.",
            examples: [
              { en: "The scheme requires funding, trained staff and public support.", vi: "Chương trình cần kinh phí, nhân viên được đào tạo và sự ủng hộ của công chúng." },
            ],
          },
          {
            formula: "S + V + by + V-ing, V-ing and V-ing",
            vi: "Ba V-ing sau một giới từ.",
            examples: [
              { en: "Cities can cut emissions by taxing fuel, expanding rail and restricting parking.", vi: "Các thành phố có thể cắt giảm khí thải bằng cách đánh thuế nhiên liệu, mở rộng đường sắt và hạn chế chỗ đỗ xe." },
            ],
          },
          {
            formula: "S + V + that + S + V and that + S + V",
            vi: "Hai mệnh đề that — nhắc lại that khi vế dài.",
            examples: [
              { en: "Critics argue that the tax is unfair and that it will be difficult to collect.", vi: "Những người phê bình cho rằng thuế này không công bằng và sẽ khó thu." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Sai", "Đúng", "Vì sao"],
        rows: [
          ["~~Remote work saves time, reduces stress and employees are more productive.~~", "Remote work saves time, reduces stress and **raises productivity**.", "hai vế đầu là động từ + tân ngữ; vế ba đổi thành cả một mệnh đề"],
          ["~~The city is crowded, noisy and has a lot of pollution.~~", "The city is crowded, noisy and **heavily polluted**.", "tính từ, tính từ ⇒ tính từ"],
          ["~~Young people move to cities for jobs, education and to enjoy a modern lifestyle.~~", "…for jobs, education and **a modern lifestyle**.", "sau for là danh từ ⇒ ba danh từ"],
          ["~~The report examines how the virus spreads and its treatment.~~", "The report examines how the virus spreads and **how it can be treated**.", "mệnh đề how ⇒ mệnh đề how"],
          ["~~Parents should either limit screen time or children will sleep badly.~~", "Parents should limit screen time; **otherwise**, children will sleep badly.", "hai ý không cùng loại ⇒ đừng ép vào một cặp song song"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — vì tiếng Việt không đổi dạng từ",
        items: [
          "Tiếng Việt nói “tiết kiệm thời gian, giảm căng thẳng và nhân viên làm việc hiệu quả hơn” nghe hoàn toàn tự nhiên, vì từ không biến hình. Sang tiếng Anh, vế ba lộ ra ngay.",
          "Lỗi thường nằm ở ==vế cuối== của danh sách ba: hai vế đầu viết theo quán tính, đến vế ba thì nghĩ sang ý mới và đổi cấu trúc. Khi soát, chỉ cần nhìn vế đứng sau **and**.",
          "Trộn tính từ với danh từ: ~~The job is stressful and low salary.~~ → The job is stressful and **badly paid**.",
        ],
      },
      { t: "rule", formula: "A, B and C  →  cùng loại từ, cùng dạng   ·   kiểm: [phần đứng trước] + từng vế phải thành câu", vi: "Lỗi hay nằm ở vế đứng ngay sau and." },
      {
        t: "quiz",
        id: "t5d9-song-song-1-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — danh sách song song (4 câu)",
        grammar: "A, B and C cùng dạng",
        items: [
          { q: "Công việc này đòi hỏi sự kiên nhẫn, kỹ năng giao tiếp tốt và khả năng làm việc dưới áp lực.", answers: ["This job requires patience, good communication skills and the ability to work under pressure.", "The job requires patience, good communication skills and the ability to work under pressure.", "This job demands patience, good communication skills and the ability to work under pressure."], hint: "require · patience · communication skills · the ability to work under pressure" },
          { q: "Chính phủ có thể giảm ùn tắc bằng cách tăng phí đỗ xe, cải thiện xe buýt và xây làn xe đạp.", answers: ["The government can reduce congestion by raising parking fees, improving buses and building cycle lanes.", "The government can reduce congestion by increasing parking fees, improving buses and building cycle lanes.", "The government can reduce congestion by raising parking charges, improving buses and building cycle lanes."], hint: "by + V-ing × 3 · parking fees · cycle lanes" },
          { q: "Báo cáo cho rằng chương trình tốn kém và rằng nó đã không đạt mục tiêu.", answers: ["The report argues that the programme is expensive and that it has failed to meet its targets.", "The report argues that the scheme is expensive and that it has failed to meet its targets.", "The report claims that the programme is expensive and that it has failed to meet its targets.", "The report argues that the programme is costly and that it has failed to meet its targets."], hint: "argue that… and that… · fail to meet its targets" },
          { q: "Khu phố cũ yên tĩnh, rợp bóng cây và được bảo tồn tốt.", answers: ["The old quarter is quiet, shady and well preserved.", "The old quarter is quiet, leafy and well preserved.", "The old quarter is quiet, shady and well-preserved.", "The old quarter is quiet, leafy and well-preserved."], hint: "ba tính từ: quiet · leafy / shady · well preserved" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Song song ② — cặp liên từ: nhìn chữ đứng NGAY SAU mỗi nửa" },
      {
        t: "p",
        text: "Cặp liên từ tương quan (correlative conjunctions) gồm hai nửa. Luật: ==cái đứng ngay sau nửa thứ nhất phải cùng dạng với cái đứng ngay sau nửa thứ hai==. Lỗi gần như luôn là đặt nửa thứ nhất sai chỗ — sớm quá hoặc muộn quá một từ.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "not only + X + but also + X",
            vi: "X = cùng dạng (hai động từ, hai danh từ, hai cụm giới từ…).",
            examples: [
              { en: "The policy not only reduces costs but also improves safety.", vi: "Chính sách không chỉ giảm chi phí mà còn cải thiện an toàn. (động từ — động từ)" },
              { en: "The policy benefits not only employers but also their staff.", vi: "Chính sách có lợi không chỉ cho chủ mà cả cho nhân viên. (danh từ — danh từ)" },
            ],
          },
          {
            formula: "either + X + or + X   ·   neither + X + nor + X   ·   both + X + and + X",
            vi: "Giới từ nằm NGOÀI cặp thì dùng chung; nằm TRONG thì phải nhắc lại.",
            examples: [
              { en: "The deficit can be reduced either by raising taxes or by cutting spending.", vi: "Thâm hụt có thể giảm bằng cách tăng thuế hoặc cắt chi tiêu. (by nằm trong ⇒ nhắc lại)" },
              { en: "The deficit can be reduced by either raising taxes or cutting spending.", vi: "(by nằm ngoài ⇒ dùng chung) — cả hai câu đều đúng." },
            ],
          },
          {
            formula: "not + X + but + X   ·   X + rather than + X   ·   whether + X + or + X",
            vi: "Ba cặp dùng để sửa, để chọn, để nêu hai khả năng.",
            examples: [
              { en: "The problem lies not in the law itself but in the way it is enforced.", vi: "Vấn đề không nằm ở bản thân luật mà ở cách nó được thực thi." },
              { en: "Many graduates choose to rent rather than (to) buy.", vi: "Nhiều người mới tốt nghiệp chọn thuê thay vì mua." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Sai", "Đúng", "Lỗi ở đâu"],
        rows: [
          ["~~Tourism not only creates jobs but also it protects old buildings.~~", "Tourism not only creates jobs but also **protects** old buildings.", "sau but also thừa chủ ngữ it"],
          ["~~The scheme not only helps students but also teachers.~~", "The scheme helps **not only students but also teachers**.", "not only đứng trước động từ, but also đứng trước danh từ"],
          ["~~You can either pay by card or cash.~~", "You can pay **either by card or by cash** / pay by **either card or cash**.", "either đứng trước động từ pay"],
          ["~~Both in cities and rural areas, rents have risen.~~", "**In both cities and rural areas** / Both in cities and **in** rural areas, rents have risen.", "giới từ in chỉ có ở một nửa"],
          ["~~Neither the price nor how long delivery takes was mentioned.~~", "Neither the price nor **the delivery time** was mentioned.", "danh từ — mệnh đề how ⇒ đổi vế hai thành cụm danh từ"],
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: song song về CHỨC NĂNG — một ngoại lệ có trong bài mẫu Đề 9",
        items: [
          "Bài mẫu Task 2 của Đề 9 viết: các dự án bị chậm **“not for want of money, but because there is nobody to carry them out”**. Sau not là cụm giới từ, sau but là mệnh đề because — khác dạng.",
          "Câu vẫn đúng và tự nhiên, vì hai vế ==cùng chức năng==: cả hai là trạng ngữ chỉ nguyên nhân, cùng trả lời câu hỏi “vì sao chậm?”. Người viết giỏi dùng kiểu này có chủ ý.",
          "Với bạn: giữ luật “cùng dạng” làm mặc định. Chỉ phá khi hai vế rõ ràng cùng trả lời một câu hỏi (vì sao / ở đâu / khi nào) và câu đọc lên trơn.",
          "**Not only** đứng đầu câu ⇒ đảo ngữ (ôn Tập 4 Ngày 7): Not only **does the policy** reduce costs, but it also improves safety.",
        ],
      },
      { t: "rule", formula: "not only X but also X   ·   either X or X   ·   both X and X   ·   not X but X   →   X cùng dạng; giới từ: ngoài cặp thì chung, trong cặp thì nhắc lại", vi: "Soát: che phần giữa, đọc chữ ngay sau mỗi nửa của cặp." },
      {
        t: "quiz",
        id: "t5d9-song-song-2",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho song song (6 câu)",
        items: [
          { q: "Volunteering not only helps the community but also [it builds] confidence.", answers: ["builds"], hint: "Sau not only là động từ helps ⇒ sau but also là động từ, không có chủ ngữ." },
          { q: "The museum is funded both by the state and [private donors].", answers: ["by private donors"], hint: "both by… and by… — by nằm trong cặp nên phải nhắc lại." },
          { q: "Applicants can submit the form either online or [by going to the office in person].", answers: ["in person"], hint: "online là trạng từ ⇒ vế sau cũng là cụm trạng ngữ ngắn." },
          { q: "The delay was caused not by the weather but [the airline made an error].", answers: ["by an error made by the airline", "by the airline's error", "by an airline error", "by an error by the airline"], hint: "not by + N but by + N." },
          { q: "Residents were asked whether they supported the plan or [their opposition to it].", answers: ["opposed it", "they opposed it"], hint: "whether they supported… or opposed…" },
          { q: "He would rather resign than [to accept] the new conditions.", answers: ["accept"], hint: "would rather + V… than + V (nguyên mẫu không to ở cả hai vế)." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Song song ③ — so sánh: so cái gì với cái gì" },
      {
        t: "p",
        text: "Phép so sánh cũng là một cặp. Hai thứ đặt hai bên **than / as / compared with / unlike** phải ==cùng loại==: dân số với dân số, giá với giá, hành động với hành động. Đây là lỗi số một ở Task 1 band 7.",
      },
      {
        t: "table",
        head: ["Sai", "Đúng", "Vì sao"],
        rows: [
          ["~~The population of Japan is older than Vietnam.~~", "The population of Japan is older than **that of** Vietnam.", "dân số ↔ dân số; that = the population"],
          ["~~Salaries in banking are higher than teaching.~~", "Salaries in banking are higher than **those in** teaching.", "số nhiều ⇒ those"],
          ["~~Spending on rent was twice as high as food.~~", "Spending on rent was twice as high as **spending on** food / as **that on** food.", "chi tiêu ↔ chi tiêu"],
          ["~~Studying in a group is more effective than to study alone.~~", "Studying in a group is more effective than **studying** alone.", "V-ing ↔ V-ing"],
          ["~~Compared with 2010, sales were 20% higher.~~", "Compared with **the 2010 figure**, sales were 20% higher. / Sales were 20% higher **than in 2010**.", "doanh số ↔ con số, không phải doanh số ↔ một năm"],
          ["~~Unlike France, the birth rate in Italy fell.~~", "Unlike **that of** France, the birth rate in Italy fell. / Unlike France, **Italy saw** its birth rate fall.", "Unlike + cùng loại với chủ ngữ chính"],
        ],
        caption: "Sáu câu sai hay gặp nhất ở Task 1 — sửa bằng that of / those in, hoặc đổi chủ ngữ",
      },
      {
        t: "note",
        title: "💡 Mẹo: khi nào được bỏ that of",
        items: [
          "Khi so hai nơi / hai nhóm bằng cụm giới từ ở cuối câu: Rents are higher **in Hanoi than in Hue**. (in ↔ in — đã song song, không cần that.)",
          "Khi chủ ngữ là chính nơi / nhóm đó: **Hanoi** has higher rents than **Hue**. Đây là cách sửa gọn nhất khi nói.",
          "Đừng viết ~~than Hue's~~ trong văn viết Task 1: đúng ngữ pháp nhưng nghe khẩu ngữ. Dùng that of Hue.",
        ],
      },
      { t: "rule", formula: "N of A + be + adj-er than + that / those of B   ·   V-ing … than + V-ing   ·   A + V + more … in X than in Y", vi: "Hai bên than / as phải là hai thứ cùng loại." },
      {
        t: "quiz",
        id: "t5d9-so-sanh-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — so sánh song song (4 câu)",
        grammar: "than that of / than those in / V-ing… than V-ing",
        items: [
          { q: "Tỉ lệ thất nghiệp của miền Bắc cao hơn của miền Nam.", answers: ["The unemployment rate in the north is higher than that in the south.", "The unemployment rate of the north is higher than that of the south.", "The unemployment rate in the North is higher than that in the South.", "Unemployment in the north is higher than in the south.", "The north has a higher unemployment rate than the south."], hint: "the unemployment rate · higher than that in / of" },
          { q: "Giá nhà ở thủ đô cao gấp ba lần giá ở các thành phố nhỏ.", answers: ["House prices in the capital are three times as high as those in small cities.", "House prices in the capital are three times higher than those in small cities.", "House prices in the capital are three times as high as those in smaller cities.", "Housing prices in the capital are three times as high as those in small cities."], hint: "house prices · three times as high as those in" },
          { q: "Sửa một chiếc điện thoại cũ thường rẻ hơn mua một chiếc mới.", answers: ["Repairing an old phone is usually cheaper than buying a new one.", "Repairing an old phone is often cheaper than buying a new one.", "Fixing an old phone is usually cheaper than buying a new one."], hint: "V-ing… than V-ing · a new one" },
          { q: "Khác với Hàn Quốc, Việt Nam có dân số trẻ.", answers: ["Unlike South Korea, Vietnam has a young population.", "Unlike Korea, Vietnam has a young population.", "Unlike that of South Korea, the population of Vietnam is young.", "Unlike that of Korea, the population of Vietnam is young."], hint: "Unlike + nước, nước + has…  hoặc  Unlike that of…, the population of…" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Song song ④ — từ nhỏ giữ khung câu dài: that, to, giới từ, mạo từ" },
      {
        t: "p",
        text: "Khi hai vế ngắn và đứng sát nhau, tiếng Anh cho phép lược từ lặp: to read and (to) write. Khi vế dài, từ nhỏ được ==nhắc lại== để người đọc biết vế mới bắt đầu ở đâu. Band 8 nhắc lại có chủ ý; band 7 bỏ theo thói quen rồi câu thành mơ hồ.",
      },
      {
        t: "table",
        head: ["Từ nhỏ", "Câu mơ hồ / sai", "Câu rõ"],
        rows: [
          ["**that**", "The minister said that taxes would fall and spending on schools would rise. (vế hai là lời bộ trưởng hay lời người viết?)", "The minister said that taxes would fall **and that** spending on schools would rise."],
          ["**to**", "The aim is to cut the time patients spend waiting for a diagnosis and improve survival rates.", "The aim is to cut the time patients spend waiting for a diagnosis **and to** improve survival rates."],
          ["**giới từ**", "~~She is interested and good at statistics.~~ (interested AT?)", "She is interested **in** and good **at** statistics."],
          ["**mạo từ**", "I met the director and producer. (một người hay hai?)", "I met the director **and the** producer. (hai người)"],
          ["**trợ động từ**", "~~The road has been widened and the lights replaced last year.~~", "The road has been widened, and the lights **were** replaced last year. (hai thì khác nhau ⇒ không lược được)"],
        ],
      },
      {
        t: "note",
        title: "📌 Dùng song song để ĐỌC — một câu của Passage 3 Đề 9",
        items: [
          "Passage 3 mở bằng câu: **“Judges must decide what may be taught in science lessons, governments which research to pay for, and patients which treatments to trust…”** Vế hai và vế ba ==không có động từ==.",
          "Đây là phép lược có song song (gapping): ba vế cùng khung **[ai] must decide [cái gì]**, nên must decide chỉ viết một lần. Khi đọc, bạn tự điền lại: governments (must decide) which research…, patients (must decide) which treatments….",
          "Câu 31 của đề (hệ quả thực tế — YES) nằm đúng ở câu này. Người đọc không thấy khung song song sẽ tưởng “governments which research” là một cụm danh từ lạ và bỏ qua.",
          "Khi VIẾT, bạn chưa cần dùng gapping. Khi ĐỌC, bạn phải nhận ra nó.",
        ],
      },
      { t: "rule", formula: "vế ngắn, sát nhau → lược được   ·   vế dài / dễ hiểu nhầm → nhắc lại that · to · giới từ · mạo từ", vi: "Mỗi động từ / tính từ trong cặp phải có đúng giới từ của nó." },
      {
        t: "quiz",
        id: "t5d9-tu-nho",
        kind: "fill",
        title: "Điền MỘT từ còn thiếu (5 câu)",
        items: [
          { q: "The study found that children who read daily scored higher and ___ the effect lasted into adulthood.", answers: ["that"], hint: "found that… and that…" },
          { q: "Many employees are aware ___ but indifferent to the new policy.", answers: ["of"], hint: "aware of · indifferent to — mỗi tính từ một giới từ." },
          { q: "The aim is to shorten the time that patients in remote areas have to wait for a diagnosis and ___ reduce the cost of each test.", answers: ["to"], hint: "Vế hai đứng xa to thứ nhất ⇒ nhắc lại to, kẻo người đọc ghép reduce với wait." },
          { q: "Applicants must have a degree in ___ experience of software engineering. (bằng cấp VỀ hoặc kinh nghiệm VỀ)", answers: ["or"], hint: "a degree in or experience of + N — hai giới từ khác nhau cùng chung một danh từ." },
          { q: "The old bridge was closed in 2019, and a new one ___ since been built beside it.", answers: ["has"], hint: "Hai thì khác nhau ⇒ phải viết đủ trợ động từ: has since been built." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chủ ngữ treo band 8 — bảy kiểu mở đầu câu" },
      {
        t: "p",
        text: "Nhắc lại luật của Tập 4 Ngày 5: cụm mở đầu câu không có chủ ngữ riêng ⇒ người đọc tự hiểu chủ ngữ của nó là ==chủ ngữ của mệnh đề chính==. Tập 4 chỉ dạy với V-ing và V3. Ở band 8, lỗi còn sót nằm ở năm kiểu mở đầu khác — vì chúng không trông giống phân từ.",
      },
      {
        t: "table",
        head: ["Kiểu mở đầu", "Sai (treo)", "Sửa"],
        rows: [
          ["① **V-ing**", "~~Walking through the old quarter, the houses seemed smaller than I remembered.~~ (nhà đi bộ?)", "Walking through the old quarter, **I found** the houses smaller than I remembered."],
          ["② **V3**", "~~Opened in 1902, thousands of tourists cross the bridge every day.~~", "Opened in 1902, **the bridge** is crossed by thousands of tourists every day."],
          ["③ **To + V** (mục đích)", "~~To get a high band score, grammar must be accurate.~~ (ngữ pháp muốn điểm cao?)", "To get a high band score, **candidates** must use accurate grammar."],
          ["④ **As + N** (vai trò)", "~~As a final-year student, the library is my second home.~~", "As a final-year student, **I** treat the library as my second home."],
          ["⑤ **When / While / After / Before + V-ing**", "~~After finishing the interviews, the data were analysed.~~", "After finishing the interviews, **we** analysed the data. / After **the interviews were finished**, the data were analysed."],
          ["⑥ **Unlike / Like + N**", "~~Unlike most cities, the centre of Hoi An has no tall buildings.~~ (so thành phố với trung tâm)", "Unlike most cities, **Hoi An** has no tall buildings in its centre."],
          ["⑦ **At the age of… / As a child**", "~~At the age of six, my family moved to Da Nang.~~ (gia đình sáu tuổi?)", "**When I was six**, my family moved to Da Nang."],
        ],
        caption: "Câu hỏi kiểm cho mọi kiểu: AI / CÁI GÌ làm việc ở cụm mở đầu? Đó có phải chủ ngữ đứng ngay sau dấu phẩy không?",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — ba nguồn gốc",
        items: [
          "Tiếng Việt lược chủ ngữ rất tự do: “Khi còn nhỏ, gia đình tôi chuyển vào Đà Nẵng” hoàn toàn đúng. Dịch từng chữ ⇒ ~~As a child, my family moved…~~",
          "Câu bị động ở mệnh đề chính: người làm hành động biến mất, cụm mở đầu mất chủ. ~~Using this method, the results were obtained faster.~~ → Using this method, **the team obtained** the results faster. / **With** this method, the results were obtained faster.",
          "Chủ ngữ giả **it / there**: ~~Looking at the chart, it is clear that…~~ là câu rất nhiều người học thuộc cho Task 1. It không “look at” gì cả. → **The chart shows** that… / **As the chart shows**, …",
          "Sở hữu cách che chủ ngữ thật: ~~Having worked there for ten years, her salary was still low.~~ (chủ ngữ là her salary, không phải she) → Having worked there for ten years, **she** was still poorly paid.",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: nhóm được chấp nhận (không coi là treo)",
        items: [
          "Các cụm đã thành ==trạng ngữ cố định==, nói về thái độ người viết chứ không về chủ ngữ: **Generally speaking**, **Strictly speaking**, **Considering…**, **Given…**, **Assuming…**, **Judging by…**, **Taking everything into account**, **To be fair**, **To sum up**.",
          "Ví dụ đúng: Given the cost, the plan is unlikely to go ahead. · Judging by the figures, demand is falling. · To be fair, the scheme has only just begun.",
          "To + V mục đích với câu bị động (To reduce congestion, a charge was introduced.) xuất hiện nhiều trong văn học thuật và ít khi bị bắt lỗi. Nhưng khi chủ ngữ chính là thứ không thể có mục đích (grammar, the results), câu nghe sai ngay. Cách an toàn: để ==người làm== làm chủ ngữ.",
        ],
      },
      { t: "rule", formula: "[V-ing / V3 / To V / As a N / After V-ing / Unlike N / At the age of…] ,  + S (= người / vật làm việc ở cụm mở đầu) + V", vi: "Chủ ngữ ngay sau dấu phẩy phải trả lời đúng câu hỏi “ai làm việc ở cụm mở đầu?”. Không được thì thêm chủ ngữ cho cụm mở đầu (When I was…, After the interviews were…)." },
      {
        t: "mcq",
        id: "t5d9-treo",
        title: "Câu nào KHÔNG có chủ ngữ treo? (6 câu)",
        items: [
          { q: "1.", options: ["To attract more visitors, the opening hours were extended by the museum's own staff's decision.", "To attract more visitors, the museum extended its opening hours.", "To attract more visitors, longer opening hours are necessary.", "To attract more visitors, there are longer opening hours now."], correct: 1, why: "Người muốn “attract more visitors” là the museum ⇒ the museum làm chủ ngữ." },
          { q: "2.", options: ["As the eldest child, a lot was expected of me.", "As the eldest child, my parents expected a lot of me.", "As the eldest child, I was expected to set an example.", "As the eldest child, there was a lot of pressure."], correct: 2, why: "“the eldest child” = I ⇒ chủ ngữ chính phải là I." },
          { q: "3.", options: ["While waiting for the bus, my phone rang.", "While waiting for the bus, I got a call from my manager.", "While waiting for the bus, it started to rain.", "While waiting for the bus, a stranger's umbrella hit me."], correct: 1, why: "Người đợi xe là I. Ba câu kia: điện thoại, trời, cái ô đang “đợi xe”." },
          { q: "4.", options: ["Unlike its neighbours, tourism plays a small part in the country's economy.", "Unlike its neighbours, the economy of the country depends little on tourism.", "Unlike its neighbours, the country depends little on tourism.", "Unlike its neighbours, there is little tourism in the country."], correct: 2, why: "So nước với các nước láng giềng ⇒ chủ ngữ là the country." },
          { q: "5.", options: ["Compared with those of 2015, the 2025 figures are far higher.", "Compared with 2015, the figures of 2025 are far higher.", "Comparing with 2015, the 2025 figures are far higher.", "Compared with 2015, there are far higher figures in 2025."], correct: 0, why: "So số liệu với số liệu: those of 2015 ↔ the 2025 figures. “Comparing with” còn sai dạng (số liệu không tự so)." },
          { q: "6.", options: ["Judging by the queue outside, the new café is doing well.", "Seeing the queue outside, the new café is doing well.", "Having seen the queue outside, the new café must be good.", "Looking at the queue outside, it seems the café is popular."], correct: 0, why: "Judging by… thuộc nhóm trạng ngữ cố định được chấp nhận. Seeing / Having seen / Looking at đòi một người nhìn làm chủ ngữ." },
        ],
      },
      {
        t: "quiz",
        id: "t5d9-treo-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — cụm mở đầu có đúng chủ ngữ (4 câu)",
        grammar: "cụm mở đầu, + chủ ngữ là người / vật làm việc đó",
        items: [
          { q: "Là sinh viên năm nhất, tôi thấy thư viện rất đáng sợ.", answers: ["As a first-year student, I found the library intimidating.", "As a first-year student, I found the library very intimidating.", "As a first-year student, I found the library frightening.", "As a first-year student, I found the library scary."], hint: "As a first-year student, I found… intimidating" },
          { q: "Để giảm rác thải, thành phố đã cấm túi ni-lông dùng một lần.", answers: ["To reduce waste, the city has banned single-use plastic bags.", "To reduce waste, the city banned single-use plastic bags.", "To cut waste, the city has banned single-use plastic bags.", "In order to reduce waste, the city has banned single-use plastic bags."], hint: "To reduce waste, the city… · single-use plastic bags" },
          { q: "Sau khi phỏng vấn 40 cư dân, các nhà nghiên cứu kết luận rằng kế hoạch không được ủng hộ.", answers: ["After interviewing 40 residents, the researchers concluded that the plan was unpopular.", "After interviewing forty residents, the researchers concluded that the plan was unpopular.", "Having interviewed 40 residents, the researchers concluded that the plan was unpopular.", "After interviewing 40 residents, the researchers concluded that the plan was not popular."], hint: "After interviewing…, the researchers concluded that… · unpopular" },
          { q: "Khi tôi mười tuổi, bố mẹ tôi mở một quán cà phê nhỏ.", answers: ["When I was ten, my parents opened a small café.", "When I was ten, my parents opened a small cafe.", "When I was ten years old, my parents opened a small café.", "When I was 10, my parents opened a small café."], hint: "KHÔNG viết At the age of ten, my parents… → When I was ten, …" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Bổ ngữ đặt sai chỗ — only, almost, even và mệnh đề quan hệ" },
      {
        t: "p",
        text: "Chủ ngữ treo là bổ ngữ ==không có== chỗ bám. Bổ ngữ đặt sai chỗ là bổ ngữ bám ==nhầm chỗ==. Trong văn nói, ngữ điệu cứu câu. Trong văn viết, vị trí là tất cả.",
      },
      {
        t: "table",
        head: ["Câu", "Người đọc hiểu", "Nếu ý bạn khác thì viết"],
        rows: [
          ["The government **only** funds schools in large cities.", "chỉ cấp tiền (chứ không quản lý)? hay chỉ trường ở thành phố lớn?", "The government funds schools **only in large cities**."],
          ["He **almost** failed every exam.", "môn nào cũng suýt trượt (nhưng đều qua)", "He failed **almost every** exam. (trượt gần hết)"],
          ["The team **nearly** spent £2 million on the app.", "suýt tiêu (rồi không tiêu)", "The team spent **nearly £2 million** on the app."],
          ["She emailed the report on the factory **that was published in May**.", "nhà máy được “published”?", "She emailed the report, **published in May**, on the factory. / the **May** report on the factory"],
          ["Students who revise **often** get better marks.", "ôn thường xuyên? hay thường được điểm cao?", "Students who **often revise** get better marks. / Students who revise **tend to** get better marks."],
          ["We discussed the plan to close the library **at the meeting**.", "đóng thư viện ngay tại cuộc họp?", "**At the meeting**, we discussed the plan to close the library."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với which sau dấu phẩy",
        items: [
          "**, which** có thể chỉ danh từ đứng ngay trước HOẶC cả mệnh đề trước. Khi hai cách hiểu cho hai nghĩa khác nhau, câu mơ hồ.",
          "~~The council cut funding for the youth club, which angered many parents.~~ Cái làm phụ huynh giận là việc cắt tiền — nhưng which đứng sát the youth club.",
          "Sửa bằng danh từ gói (ôn Ngày 1 mục 6): The council cut funding for the youth club, **a decision that** angered many parents.",
        ],
      },
      { t: "rule", formula: "only / almost / nearly / even  +  ngay trước từ được giới hạn   ·   mệnh đề quan hệ  +  ngay sau danh từ nó tả   ·   , which mơ hồ → , a decision / a change / a trend that …", vi: "Văn viết không có ngữ điệu: vị trí quyết định nghĩa." },
      {
        t: "mcq",
        id: "t5d9-dat-sai-cho",
        title: "Câu nào nói đúng ý trong ngoặc? (4 câu)",
        items: [
          { q: "1. (Ý: trong cả tuần, chỉ thứ Hai là thư viện mở muộn.)", options: ["The library only opens late on Mondays.", "The library opens late only on Mondays.", "Only the library opens late on Mondays.", "The library opens only late on Mondays."], correct: 1, why: "only đứng ngay trước on Mondays — phần được giới hạn." },
          { q: "2. (Ý: gần hết số người tham gia đều hoàn thành khoá học.)", options: ["Almost the participants all completed the course.", "The participants almost all completed the course, nearly.", "Almost all of the participants completed the course.", "All of the participants almost completed the course."], correct: 2, why: "almost bổ nghĩa cho all. “All… almost completed” = ai cũng suýt hoàn thành (tức chưa ai xong)." },
          { q: "3. (Ý: bài báo được viết bởi một sinh viên; bài báo nói về ô nhiễm sông.)", options: ["The article about river pollution written by a student won a prize.", "The article written by a student about river pollution won a prize.", "The article about river pollution, written by a student, won a prize.", "The article won a prize about river pollution written by a student."], correct: 2, why: "Hai dấu phẩy tách cụm written by a student khỏi pollution ⇒ không ai hiểu “ô nhiễm do sinh viên viết”. Phương án 2 lại thành “sinh viên về ô nhiễm sông”." },
          { q: "4. (Ý: việc đóng cửa nhà máy khiến thị trấn mất 300 việc làm.)", options: ["The factory closed in the town, which cost 300 jobs.", "The factory in the town closed, a blow that cost 300 jobs.", "The factory closed, which the town cost 300 jobs.", "The town's factory which cost 300 jobs closed."], correct: 1, why: "Danh từ gói a blow chỉ rõ cả sự việc đóng cửa. Phương án 1: which đứng sát the town." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Câu dài vẫn rõ — bốn phép thử và ba dấu câu" },
      {
        t: "table",
        head: ["Phép thử", "Hỏi", "Nếu trượt"],
        rows: [
          ["① Chủ ngữ gần động từ", "Giữa chủ ngữ chính và động từ chính có quá 10–12 từ không?", "chuyển phần chen giữa ra đầu hoặc cuối câu, hoặc tách thành hai câu"],
          ["② Một cụm mở đầu", "Trước chủ ngữ chính có hơn một cụm trạng ngữ không?", "giữ một cụm, đưa cụm kia ra sau động từ"],
          ["③ Hai tầng phụ", "Có mệnh đề phụ nằm trong mệnh đề phụ nằm trong mệnh đề phụ không?", "cắt ở tầng thứ ba, mở câu mới bằng This / Such + N"],
          ["④ Ý mới ở cuối", "Thông tin quan trọng nhất có nằm ở cuối câu không?", "đảo trật tự: cái đã biết trước, cái mới sau"],
        ],
        caption: "Bốn phép thử cho mọi câu trên 30 từ — nối Tập 5 Ngày 5 (câu phức nhiều tầng)",
      },
      {
        t: "examples",
        items: [
          { en: "Band 7: The decision of the local government, which was taken last year after a long public consultation in which more than two thousand residents who live near the river took part, to build a flood barrier has been criticised.", vi: "Đúng ngữ pháp nhưng chủ ngữ (The decision) cách động từ (has been criticised) 34 từ; ba tầng mệnh đề quan hệ. Người đọc phải đọc lại." },
          { en: "Band 8: Last year, after a public consultation involving more than two thousand riverside residents, the local government decided to build a flood barrier. That decision has since been criticised.", vi: "Một cụm mở đầu; phân từ involving thay hai mệnh đề quan hệ; riverside residents thay who live near the river; ý mới (bị chỉ trích) đứng riêng một câu, mở bằng That decision." },
        ],
      },
      {
        t: "table",
        head: ["Dấu", "Dùng khi", "Sai", "Đúng"],
        rows: [
          ["**,** + and / but / so", "nối hai mệnh đề độc lập", "~~Rents are rising, many young people cannot afford to move out.~~ (comma splice)", "Rents are rising, **and** many young people cannot afford to move out."],
          ["**;**", "hai mệnh đề độc lập có quan hệ chặt; trước however, therefore", "~~The plan is popular, however, it is expensive.~~", "The plan is popular**;** however, it is expensive."],
          ["**;** song song", "hai vế cùng khung, đặt cạnh nhau để đối chiếu", "—", "Where failure is merely irritating, a narrow margin is reasonable**;** where it is catastrophic, it is a gamble."],
          ["**:**", "vế sau giải thích / liệt kê cho vế trước (vế trước phải là câu hoàn chỉnh)", "~~The reasons are: cost, time and risk.~~", "There are three reasons**:** cost, time and risk."],
        ],
        caption: "Ôn Tập 4 Ngày 21 — bản rút gọn cho câu dài",
      },
      {
        t: "note",
        title: "💡 Mẹo: chấm phẩy + song song = câu band 8 dễ viết nhất",
        items: [
          "Hai vế cùng khung, đối nghĩa, nối bằng chấm phẩy: **In theory, the scheme is voluntary; in practice, few employees feel able to refuse.**",
          "Bài đọc hôm nay (Bài 2) và Đề 9 đều dùng kiểu này để chốt ý. Passage 2 của Đề 9, đoạn G: “…the two sides do not disagree about the facts; they disagree about what the term ought to cover.”",
          "Mỗi bài Task 2 dùng **một lần**, ở câu chốt đoạn hoặc ở kết bài. Dùng ba lần thành kiểu cách.",
        ],
      },
      { t: "rule", formula: "S gần V  ·  1 cụm mở đầu  ·  ≤ 2 tầng phụ  ·  ý mới ở cuối   +   [câu] ; [câu]   ·   [câu] : [giải thích / danh sách]", vi: "Câu trên 35 từ mà trượt một phép thử ⇒ tách làm hai, nối bằng This / That / Such + danh từ." },
      {
        t: "quiz",
        id: "t5d9-dau-cau",
        kind: "fill",
        title: "Điền MỘT dấu câu hoặc MỘT từ (5 câu)",
        items: [
          { q: "The trial was a success ___ however, it involved only thirty patients. (gõ dấu câu)", answers: [";"], hint: "Hai mệnh đề độc lập trước however ⇒ chấm phẩy." },
          { q: "The city faces three problems ___ congestion, air pollution and a shortage of housing. (gõ dấu câu)", answers: [":"], hint: "Vế trước là câu hoàn chỉnh, vế sau liệt kê ⇒ hai chấm." },
          { q: "Prices rose sharply, ___ wages stayed the same. (một liên từ chỉ sự đối lập)", answers: ["but", "yet", "while", "whereas"], hint: "Dấu phẩy không tự nối được hai câu — cần liên từ." },
          { q: "In summer, the reservoir is almost empty ___ in winter, it overflows. (gõ dấu câu)", answers: [";"], hint: "Hai vế cùng khung, đối nghĩa ⇒ chấm phẩy." },
          { q: "The council cut the bus service, a ___ that left two villages without public transport. (một danh từ gói)", answers: ["decision", "move", "change", "measure", "step"], hint: ", a decision / a move that… thay cho , which mơ hồ." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (16 câu)" },
      {
        t: "mcq",
        id: "t5d9-np-chon",
        title: "Chọn câu đúng và rõ nhất (10 câu)",
        items: [
          { q: "1.", options: ["The app helps users to track spending, setting budgets and they can save more.", "The app helps users to track spending, set budgets and save more.", "The app helps users tracking spending, to set budgets and saving more.", "The app helps users to track spending, set budgets and more savings."], correct: 1, why: "to track, (to) set and (to) save — ba động từ nguyên mẫu." },
          { q: "2.", options: ["The new law affects not only landlords but also tenants.", "The new law not only affects landlords but also tenants.", "The new law affects not only landlords but it also affects tenants.", "Not only the new law affects landlords but also tenants."], correct: 0, why: "not only + N, but also + N." },
          { q: "3.", options: ["Life expectancy in Japan is higher than Brazil.", "Life expectancy in Japan is higher than that Brazil.", "Life expectancy in Japan is higher than in Brazil.", "Life expectancy in Japan is higher than Brazil's one."], correct: 2, why: "in Japan ↔ in Brazil — hai cụm giới từ đã song song, không cần that." },
          { q: "4.", options: ["Looking at the two maps, it is clear that the harbour has changed completely.", "Looking at the two maps, the harbour has changed completely.", "The two maps show that the harbour has changed completely.", "Looking at the two maps, there are many changes to the harbour."], correct: 2, why: "Chỉ câu 3 không treo: it / the harbour / there không “look at the maps”. Đây là câu mở Task 1 nhiều người học thuộc sai." },
          { q: "5.", options: ["Raised in a fishing village, the sea was always part of her life.", "Raised in a fishing village, her life was always tied to the sea.", "Raised in a fishing village, she had always lived close to the sea.", "Raised in a fishing village, there was always the sea in her life."], correct: 2, why: "Người “raised” là she. Câu 2 treo kín: chủ ngữ là her life." },
          { q: "6.", options: ["The company either must raise prices or cut staff.", "The company must either raise prices or cut staff.", "The company must raise either prices or cut staff.", "Either the company must raise prices or cut staff."], correct: 1, why: "either + V… or + V — either đứng ngay trước raise." },
          { q: "7.", options: ["The survey showed that most residents supported the plan and that almost none opposed it outright.", "The survey showed that most residents supported the plan and almost none opposing it outright.", "The survey showed most residents to support the plan and that almost none opposed it.", "The survey showed that most residents supported the plan, almost none opposed it outright."], correct: 0, why: "that… and that… Câu cuối là comma splice." },
          { q: "8.", options: ["The trial was small, therefore its results should be treated with caution.", "The trial was small; therefore, its results should be treated with caution.", "The trial was small: therefore its results, should be treated with caution.", "The trial was small therefore, its results should be treated with caution."], correct: 1, why: "Hai mệnh đề độc lập trước therefore ⇒ chấm phẩy + dấu phẩy sau therefore." },
          { q: "9. (Ý: công ty đã tiêu gần 5 triệu đô.)", options: ["The company nearly spent $5 million on advertising.", "The company spent nearly $5 million on advertising.", "Nearly the company spent $5 million on advertising.", "The company spent $5 million nearly on advertising."], correct: 1, why: "nearly đứng ngay trước con số. “nearly spent” = suýt tiêu." },
          { q: "10.", options: ["To be fair, the scheme has been running for only six months.", "Being fair, the scheme has been running for only six months.", "To be fair, only the scheme has been running for six months.", "To be fair, the scheme only has been running for six months."], correct: 0, why: "To be fair thuộc nhóm trạng ngữ cố định; only đứng ngay trước six months." },
        ],
      },
      {
        t: "quiz",
        id: "t5d9-np-sua",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "The new manager is experienced, patient and [she communicates well].", answers: ["a good communicator", "communicative", "articulate", "a clear communicator"], hint: "tính từ, tính từ và… (tính từ hoặc cụm danh từ sau be)." },
          { q: "The cost of living in Singapore is far higher than [Vietnam].", answers: ["that in Vietnam", "that of Vietnam", "in Vietnam"], hint: "chi phí ↔ chi phí." },
          { q: "[At the age of twelve, my father] taught me how to repair a bicycle.", answers: ["When I was twelve, my father", "When I was 12, my father", "When I was twelve years old, my father"], hint: "Ai mười hai tuổi?" },
          { q: "The programme aims both to reduce truancy and [improving] exam results.", answers: ["to improve"], hint: "both to V and to V." },
          { q: "Sales fell in the first quarter[, they] recovered strongly in the second.", answers: [", but they", "; they", "; however, they", ", yet they", "but they", ", but", "but"], hint: "Dấu phẩy một mình không nối được hai câu: thêm but / yet, hoặc đổi thành chấm phẩy." },
          { q: "After [reviewing the evidence, the proposal was rejected by the committee].", answers: ["reviewing the evidence, the committee rejected the proposal"], hint: "Ai review? Đưa người đó lên làm chủ ngữ." },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau bài này",
        items: [
          "Mở bài Task 2 bạn viết cho **Đề 9** hôm qua. Tìm mọi chữ **and / or / but / than / not only** và kiểm vế đứng sau. Tìm mọi câu mở bằng cụm có dấu phẩy và hỏi “ai làm?”. Ghi số lỗi vào Sổ lỗi — Ngày 10 sẽ dùng lại bài này.",
          "Thêm hai dòng vào ==bảng tự soát 6 lượt== của bạn (Tập 4 Ngày 21): lượt “song song” và lượt “chủ ngữ sau dấu phẩy đầu câu”.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d9-doc",
    kind: "reading",
    title: "Đọc: Mổ Reading Đề 9 — Yes / No / Not Given + Matching headings band 8, rồi luyện lại bằng bài mới",
    goal: "Phân loại được từng câu sai của Reading Đề 9 theo nguyên nhân, hiểu vì sao các câu YNNG 31–36 và Headings 14–20 có đáp án như vậy (bẫy paraphrase nằm ở chữ nào), rồi làm một bài lập luận mới ~930 từ với 7 tiêu đề trừu tượng và 7 câu YNNG trong 18 phút, đúng ít nhất 12/14.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        items: [
          "Mở trang kết quả **Đề 9 — Reading** ở Online Test trước khi học. Bài này không chép lại đề; nó chỉ trích vài chữ ở chỗ cần mổ.",
          "Việc đầu tiên không phải xem đáp án. Việc đầu tiên là ==gắn nhãn nguyên nhân== cho từng câu sai: không tìm ra chỗ · hiểu sai paraphrase · rơi bẫy “có nhắc” · tự suy thêm · hết giờ.",
          "**YNNG band 8**: tách ==người viết nghĩ gì== khỏi ==người viết kể ai nghĩ gì==. Bốn chỗ quyết định: more X than Y · phủ định kép · chuỗi suy luận dừng ở đâu · kiến thức ngoài bài.",
          "**Headings band 8**: tiêu đề không trùng chữ nào với đoạn. Nó gọi tên ==vai trò== của đoạn (một tranh cãi, một phép thử, một nhượng bộ). Tự đặt tiêu đề của mình trước khi nhìn danh sách.",
          "Sau phần mổ: bài mới **In Praise of Slack**, 14 câu, 18 phút. Mục tiêu ≥ 12/14.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chấm Đề 9 theo nhóm câu — và gắn nhãn nguyên nhân" },
      {
        t: "table",
        head: ["Câu", "Passage", "Dạng", "Đã học ở", "Bạn đúng"],
        rows: [
          ["1–6", "1 · The Foxes of Novosibirsk", "True / False / Not Given", "Tập 5 Ngày 3", "… / 6"],
          ["7–10", "1", "Flow-chart", "Tập 4 Ngày 17", "… / 4"],
          ["11–13", "1", "Sentence completion", "Tập 5 Ngày 7", "… / 3"],
          ["14–20", "2 · Silver, Ships and Sweet Potatoes", "Matching headings", "Tập 4 Ngày 3 · Tập 5 Ngày 5 · **hôm nay**", "… / 7"],
          ["21–24", "2", "Matching features", "Tập 4 Ngày 23", "… / 4"],
          ["25–26", "2", "Choose TWO", "Tập 4 Ngày 7", "… / 2"],
          ["27–30", "3 · Drawing the Line", "Multiple choice", "Tập 4 Ngày 7", "… / 4"],
          ["31–36", "3", "Yes / No / Not Given", "Tập 4 Ngày 5 · **hôm nay**", "… / 6"],
          ["37–40", "3", "Sentence endings", "Tập 4 Ngày 15", "… / 4"],
        ],
        caption: "Chép bảng này vào Sổ lỗi, điền cột cuối. Mục tiêu Đề 9: 32/40 (band 7.5). Nhóm nào mất từ 2 câu trở lên là nhóm phải ôn.",
      },
      {
        t: "table",
        head: ["Nhãn", "Nguyên nhân", "Dấu hiệu", "Chữa bằng"],
        rows: [
          ["**R1**", "Không tìm ra chỗ trong bài", "bạn đoán, hoặc bỏ trống", "ghi lề khi đọc (Ngày 1 mục 2); tìm theo tên riêng, con số, thứ tự đoạn"],
          ["**R2**", "Tìm đúng chỗ, hiểu sai paraphrase", "bạn đã gạch đúng câu nhưng chọn sai", "viết lại cặp “bài viết ↔ câu hỏi” vào sổ; học cấu trúc gây hiểu nhầm (more X than Y, absurd to…)"],
          ["**R3**", "Rơi bẫy “có nhắc nhưng không phải đáp án”", "phương án bạn chọn có chữ trùng với bài", "luôn hỏi: chữ này trong bài thuộc về AI, CÁI GÌ?"],
          ["**R4**", "Tự suy thêm / dùng kiến thức ngoài", "bạn chọn TRUE / YES / FALSE cho câu NOT GIVEN", "chỉ vào đúng một câu trong bài; không chỉ được ⇒ NOT GIVEN"],
          ["**R5**", "Hết giờ, chép sai, sai chính tả, sai giới hạn từ", "câu cuối Passage 3 bỏ trống; viết hormone thay hormones", "nhịp 17 – 20 – 23 phút; 2 phút cuối soát số ít / số nhiều"],
        ],
        caption: "Năm nhãn nguyên nhân cho Reading (R1–R5) — dùng lại ở Ngày 17 và Ngày 25. Listening có bộ nhãn riêng A–E từ Ngày 8 (Bài 3).",
      },
      {
        t: "note",
        title: "💡 Cách học: mổ trước, đọc giải thích sau",
        items: [
          "Với mỗi câu sai: mở lại passage, tự tìm câu chứa đáp án, gắn nhãn R1–R5. Sau đó mới đọc phần giải thích trong trang kết quả.",
          "Câu ĐÚNG nhưng bạn đoán cũng tính là sai. Đánh dấu ? bên cạnh và mổ như câu sai.",
          "Nhãn nào xuất hiện nhiều nhất là việc của bạn trong 7 ngày tới. Người band 7 thường dính nhãn **R2** và **R4** ở Passage 3.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mổ Yes / No / Not Given — câu 31–36 (Passage 3)" },
      {
        t: "p",
        text: "Passage 3 của Đề 9 khó ở một điểm: tác giả viết ở ngôi thứ nhất và đi qua bốn người (Popper, Kuhn, Lakatos, Laudan) trước khi nêu ý mình. YNNG hỏi ==the claims of the writer==. Vậy mỗi câu phải trả lời hai tầng: (1) ý này của ai? (2) nếu của tác giả, nó khớp hay trái?",
      },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Chữ quyết định trong bài", "Vì sao · bẫy ở đâu"],
        rows: [
          ["31", "YES", "“Nor is it of interest to philosophers alone.”", "Câu hỏi nói “practical consequences”. Bài không dùng chữ nào như vậy; nó liệt kê ba người phải quyết định (thẩm phán, chính phủ, bệnh nhân). Paraphrase mức 4: ==ví dụ → khái niệm==. Ai không đọc ra khung song song của câu (Bài 1 mục 5) sẽ không thấy đây là ba ví dụ."],
          ["32", "NO", "“owes more to its convenience than to its accuracy”", "Câu hỏi và bài cùng có chữ accurate / accuracy ⇒ dễ chọn YES. Cấu trúc **more to X than to Y** = chủ yếu vì X, ==không phải== vì Y. Lỗi nhãn R2 điển hình: thấy từ trùng, không đọc hết khung."],
          ["33", "NOT GIVEN", "“listed it among the essential characteristics of science”", "Chuỗi suy luận hấp dẫn: tác giả chê tiêu chí ⇒ thẩm phán dùng tiêu chí ⇒ phán quyết sai. Bài dừng ở mắt xích thứ hai. Tác giả không nói phán quyết là gì, càng không khen chê. Nhãn R4."],
          ["34", "NO", "“it would have been absurd to do so”", "Phủ định kép qua hai câu: không ai kết luận Newton bị bác + kết luận thế thì vô lý ⇒ giữ Newton là hợp lý. Câu hỏi nói “unreasonable… to keep” ⇒ trái. “do so” chỉ việc BÁC, không chỉ việc GIỮ — đọc nhầm tham chiếu là đảo đáp án."],
          ["35", "NOT GIVEN", "“whose study of scientific change appeared in 1962”", "Bài chỉ nói Kuhn có một công trình. Không có phép so sánh nào với Popper. Nếu bạn chọn YES vì “biết” Kuhn là nhà sử học khoa học ⇒ nhãn R4 (kiến thức ngoài)."],
          ["36", "YES", "“That no sharp boundary exists does not mean that there is no difference”", "Câu hỏi khái quát hoá (two things) điều tác giả nói về khoa học và nguỵ khoa học. Chủ ngữ của câu gốc là cả một mệnh đề That… — đọc chậm lại ở đây. Ví dụ ngày và đêm ngay sau xác nhận nghĩa."],
        ],
      },
      {
        t: "table",
        head: ["Dấu hiệu", "Của ai", "Ví dụ trong Passage 3"],
        rows: [
          ["I suspect · I do not think · to my mind · I think", "**tác giả**", "“I suspect, though, that its popularity…” (câu 32)"],
          ["Tính từ / trạng từ đánh giá không gắn tên ai: absurd, a real improvement, of little use", "**tác giả**", "“it would have been absurd to do so” (câu 34)"],
          ["Tên riêng + động từ thuật: concluded, reasoned, added, proposed, conceded, argued", "người được thuật — CHƯA phải tác giả", "“Popper concluded…”, “Laudan… argued…”"],
          ["Câu trần thuật sự kiện: năm, nơi, ai làm gì", "sự kiện — không phải quan điểm", "“in 1982 an American judge… listed it…” (câu 33)"],
        ],
        caption: "Tách “ai nói” — kỹ năng nền của YNNG ở bài lập luận ngôi thứ nhất",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở YNNG band 8",
        items: [
          "**Dịch more… than thành “hơn” rồi dừng.** “owes more to A than to B” không phải “nhờ cả hai, A nhiều hơn một chút”. Trong văn lập luận, nó gần với “nhờ A chứ không phải B”. Tương tự: less a question of X than of Y · not so much X as Y.",
          "**Gặp phủ định kép thì đếm thiếu.** absurd to reject / hard to deny / it would be wrong to ignore / no one doubts ⇒ viết ra giấy: hai dấu trừ thành cộng.",
          "**Cho rằng tác giả chê một ý ⇒ tác giả chê mọi thứ dính tới ý đó.** Đó là bạn suy, không phải tác giả viết. Chuỗi suy luận dừng ở đâu trong bài, đáp án dừng ở đó.",
          "**Chọn NO cho câu mà tác giả chỉ THUẬT lại ý người khác.** Nếu tác giả thuật ý của Laudan rồi không bình luận, câu hỏi về ý đó là NOT GIVEN. (Ở Đề 9, tác giả có bình luận: “I do not think that we should accept it.”)",
          "**Dùng điều mình biết.** Sinh viên IT hay biết về Popper, Kuhn. Trong phòng thi, coi như chưa từng nghe tên họ.",
        ],
      },
      { t: "rule", formula: "YNNG:  ① ý này của AI?  →  ② chỉ được một câu của tác giả không?  →  ③ khớp = YES · trái = NO · chỉ là thuật / phải suy thêm một bước = NOT GIVEN", vi: "Nếu phải nối hai câu của bài bằng một chữ “vậy thì” do bạn tự thêm ⇒ NOT GIVEN." },
      {
        t: "mcq",
        id: "t5d9-doc-ynng-khoi-dong",
        title: "Luyện ngay — bốn đoạn ngắn MỚI, cùng bốn kiểu bẫy (4 câu · 3 phút)",
        items: [
          {
            q: "1. Bài viết: “Electric scooters have been blamed for a rise in accidents on pavements. The blame, I think, belongs less to the machines than to the cities that gave them nowhere else to go.” — Statement: The writer holds scooters chiefly responsible for accidents on pavements.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 1,
            why: "less to the machines than to the cities = lỗi chủ yếu ở thành phố, không phải ở xe ⇒ trái với “chiefly responsible” ⇒ NO. Cùng kiểu câu 32 của Đề 9.",
          },
          {
            q: "2. Bài viết: “Several analysts predict that meat grown in laboratories will replace farmed meat within a generation. Whether they are right is not something I am in a position to judge.” — Statement: The writer expects laboratory-grown meat to replace farmed meat.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 2,
            why: "Dự đoán là của several analysts. Tác giả nói rõ mình không đánh giá được ⇒ không biết tác giả nghĩ gì ⇒ NOT GIVEN (không phải NO: tác giả không bác).",
          },
          {
            q: "3. Bài viết: “It would be perverse to deny that zoos have kept a handful of species from disappearing altogether.” — Statement: Zoos have helped to prevent the extinction of certain animals.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 0,
            why: "perverse to deny = phủ định kép ⇒ tác giả khẳng định. a handful of species = certain animals; disappearing altogether = extinction ⇒ YES. Cùng kiểu câu 34.",
          },
          {
            q: "4. Bài viết: “The town introduced a tax on plastic bags in 2019. One councillor, who had opposed it, later described the measure as the most effective the council had ever passed.” — Statement: The tax on plastic bags was a mistake.",
            options: ["YES", "NO", "NOT GIVEN"],
            correct: 2,
            why: "Đây là sự kiện + ý của một ủy viên. Tác giả không nêu đánh giá của mình ⇒ NOT GIVEN. Chọn NO là lấy ý người được thuật làm ý tác giả — cùng kiểu câu 33 và 35.",
          },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ True / False / Not Given — câu 1, 3, 4, 6 (Passage 1)" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Chữ quyết định", "Bẫy · kỹ năng"],
        rows: [
          ["1", "FALSE", "“had been unable to account for it”", "Tên Darwin + noticed the pattern khiến người đọc lướt chọn TRUE. Câu có hai động từ: noticed (có) và account for (không). Câu hỏi hỏi về động từ thứ hai. ==Đọc hết câu có and.=="],
          ["3", "TRUE", "“presented his project to the authorities as a study of animal physiology”", "Bài không có chữ hide / conceal / secret. Bạn phải suy từ **present A as B** (trình bày A như thể là B) + “though not, at that time, openly”. Đây là suy luận ==được phép==: nó chỉ đổi cách nói, không thêm thông tin."],
          ["4", "NOT GIVEN", "“From farms in Estonia…”", "Bài nói nơi lấy cáo, không so tính khí với cáo trại khác. Người chọn TRUE đã tự hỏi “sao lại chọn Estonia?” rồi tự trả lời. Câu hỏi có ==phép so sánh== (calmer than) ⇒ bài phải có phép so sánh thì mới TRUE / FALSE."],
          ["6", "NOT GIVEN", "“sold abroad as pets”", "Chữ American đứng ngay câu sau, nhưng nó thuộc về một tạp chí. Nhãn R3: chữ có trong bài, nhưng thuộc về thứ khác. Hỏi: American bổ nghĩa cho danh từ nào?"],
        ],
      },
      {
        t: "note",
        title: "📌 Suy luận được phép và suy luận không được phép",
        items: [
          "**Được phép**: đổi cách nói mà không thêm thông tin. present A as B ⇒ không nói thật A là gì. began… then… eventually ⇒ cái đầu tiên là cái sớm nhất (câu 11).",
          "**Không được phép**: thêm lý do, thêm phép so sánh, thêm nơi chốn, thêm hệ quả mà bài không viết. “Lấy cáo ở Estonia” ⇏ “cáo Estonia hiền hơn”. “Bán ra nước ngoài” ⇏ “bán sang Mỹ”.",
          "Phép thử: nếu câu hỏi đúng, bài có phải viết thêm một câu nữa không? Có ⇒ NOT GIVEN.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mổ Matching headings — câu 14–20 (Passage 2)" },
      {
        t: "p",
        text: "Bảy tiêu đề đúng của Passage 2 không trùng một chữ nội dung nào với đoạn của nó. Ba tiêu đề thừa thì ngược lại: mỗi cái bám vào một chữ có thật trong bài. Đây là thiết kế chuẩn của headings band 8: ==tiêu đề đúng trùng ý, tiêu đề sai trùng chữ==.",
      },
      {
        t: "table",
        head: ["Đoạn", "Tiêu đề đúng nói gì", "Câu bản lề của đoạn", "Tiêu đề bẫy · vì sao sai"],
        rows: [
          ["A", "một câu trả lời chính xác lạ thường cho một câu hỏi mở", "“not merely to a century but to a single year”", "Không có bẫy trùng chữ; khó vì cả tiêu đề là ==mô tả vai trò==. Đoạn mở bằng các câu trả lời mơ hồ rồi chốt bằng một năm cụ thể."],
          ["B", "mắt xích cuối của một chuỗi", "“What was missing was… Manila supplied it.”", "**ix** (tiến bộ giúp đi xa hơn): đoạn có tàu galleon, có hải trình. Nhưng đoạn không nói về kỹ thuật đóng tàu hay hàng hải — sai ở chữ advances."],
          ["C", "vì sao một kim loại đi xa đến thế", "“The cargo was silver because of circumstances at the two ends of the route.”", "**x** (chính phủ hạn chế buôn bán): đoạn có “the government insisted that taxes be paid in silver”. Chính phủ ở đây ==tạo ra== nhu cầu, không hạn chế — sai ở chữ limit."],
          ["D", "những người gánh cái giá", "“…and to forget who made it possible.”", "Câu đầu có prices and tonnages — chính là thứ đoạn bảo đừng chỉ nhìn. cost trong tiêu đề là nghĩa bóng (mạng người)."],
          ["E", "hàng hoá sống và hệ quả lâu dài", "“the transfer of plants, animals and diseases”", "living cargo là ẩn dụ gom cả ba (cây, con, bệnh). Không có chữ living hay cargo trong đoạn."],
          ["F", "một phép thử chặt hơn mà thời kỳ đầu không qua", "“they found no such convergence before the 1820s”", "**iii** (đế quốc thương mại suy tàn): đoạn có monopolies, có buôn bán. Không có gì suy tàn cả."],
          ["G", "một tranh cãi xoay quanh định nghĩa", "“they disagree about what the term ought to cover”", "turn on = phụ thuộc vào. Người không biết cụm này thường để đoạn G lại cuối và chọn theo phép loại trừ — cách đó vẫn ổn nếu sáu đoạn kia chắc."],
        ],
      },
      {
        t: "table",
        head: ["Kiểu tiêu đề trừu tượng", "Ví dụ ở Đề 9", "Cách đọc"],
        rows: [
          ["**Gọi tên vai trò của đoạn**", "An unusually exact answer to an open question · A dispute that turns on a definition · A stricter test, which the early period fails", "hỏi: đoạn này LÀM gì trong lập luận? (trả lời · tranh cãi · phép thử · nhượng bộ · ví dụ)"],
          ["**Ẩn dụ gom nhiều chi tiết**", "The last link in a chain · Living cargo and its lasting consequences", "dịch ẩn dụ ra nghĩa đen: chain = các tuyến đã có; link = tuyến còn thiếu"],
          ["**Đánh giá / góc nhìn**", "Those who bore the cost", "tìm câu đổi góc nhìn trong đoạn (It is easy to… and to forget…)"],
        ],
        caption: "Ba kiểu tiêu đề của Passage 2 — bài luyện ở mục 6 dùng lại cả ba",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Headings band 8 — năm bước (nâng từ sáu bước của Tập 4 Ngày 3)",
        steps: [
          { label: "Đọc đoạn TRƯỚC, chưa nhìn danh sách", sub: "câu đầu + câu cuối + chỗ đổi hướng (but, yet, however, in fact)" },
          { label: "Tự đặt tiêu đề 4–6 chữ", sub: "bằng tiếng Việt cũng được: “Manila = mảnh ghép cuối”" },
          { label: "Tìm tiêu đề cùng Ý với tiêu đề của bạn", sub: "không tìm tiêu đề cùng CHỮ với đoạn" },
          { label: "Thử sai-một-chữ với tiêu đề còn lại", sub: "advances? limit? decline? — chữ nào đoạn không có ý tương ứng thì loại" },
          { label: "Đoạn khó nhất để cuối", sub: "còn 4 tiêu đề cho 1 đoạn là đủ dễ" },
        ],
      },
      {
        t: "mcq",
        id: "t5d9-doc-heading-khoi-dong",
        title: "Luyện ngay — hai đoạn MỚI, tiêu đề trừu tượng (2 câu · 3 phút)",
        items: [
          {
            q: "1. “When a new road is built to relieve congestion, traffic at first flows freely. Within a few years, however, the road is as crowded as the one it replaced, because drivers who had previously avoided the journey now make it. It is for this reason that the cities which have spent most on roads are seldom those in which it is easiest to drive.” — Choose the best heading.",
            options: ["The rising cost of building roads", "A remedy that recreates the problem", "How drivers choose their routes", "Cities that have solved congestion"],
            correct: 1,
            why: "Đoạn: xây đường để chữa tắc ⇒ vài năm sau lại tắc như cũ. remedy = đường mới; recreates the problem = lại đông như đường cũ. “cost” (spent most) và “cities” có chữ trong đoạn nhưng không phải ý chính — tiêu đề sai trùng chữ.",
          },
          {
            q: "2. “Every language has words that its speakers believe cannot be translated. Lists of them circulate widely, and are nearly always wrong: the word in question can be translated perfectly well, only not by a single word. What the lists reveal is not a gap in other languages but an assumption in our own, namely that a meaning deserves respect only if it comes in one piece.” — Choose the best heading.",
            options: ["Words that have no equivalent elsewhere", "How translators handle difficult terms", "A popular belief and the prejudice behind it", "The spread of interest in foreign languages"],
            correct: 2,
            why: "Đoạn nêu một niềm tin phổ biến (có từ không dịch được), bác nó, rồi chỉ ra giả định đứng sau. Phương án 1 trùng chữ nhất nhưng nói đúng điều đoạn văn BÁC. Để ý cặp song song not a gap in… but an assumption in… (Bài 1 mục 3).",
          },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mổ nhanh tám câu bẫy còn lại" },
      {
        t: "table",
        head: ["Câu", "Dạng", "Đáp án", "Điều cần rút ra"],
        rows: [
          ["10", "Flow-chart", "mothers", "Ô trống cần thứ được ĐỔI CON (“between tame and ordinary ___”). parents và females ở câu sau nói về kết quả. Đọc ngữ pháp quanh ô trống trước khi dò bài."],
          ["13", "Sentence", "Canada", "Hai tên nước trong bài: Estonia (nơi lấy cáo) và Canada (nơi tổ tiên chúng được nuôi). Câu hỏi có ancestors + long before ⇒ dò theo ==quan hệ==, không theo loại từ."],
          ["21", "Features", "B · Crosby", "Hai người cùng đoạn E cùng nói về hệ sinh thái. Chỉ Crosby “complained” rằng chuyện này bị coi như chú thích. Mann mô tả, không phàn nàn. Hỏi: ai nói ĐÚNG ý này?"],
          ["23", "Features", "A · Flynn và Giráldez", "Khoai lang xuất hiện ở đoạn E (gần Crosby) và đoạn G. Người DÙNG nó làm bằng chứng cho toàn cầu hoá sớm ở đoạn G. Một ý có thể nằm xa tên người đầu tiên bạn thấy."],
          ["28", "MCQ mục đích", "B", "“in order to show that” hỏi VÌ SAO tác giả kể chuyện Vulcan. Đáp án nằm ở câu chốt đoạn (cùng một nước cờ, lần thắng lần thua), không nằm trong chi tiết câu chuyện."],
          ["30", "MCQ", "A", "“though not for the reason usually given” báo trước: lý do quen thuộc (không kiểm chứng được) sẽ bị bác. Phương án B chép đúng lý do bị bác đó."],
          ["38", "Endings", "D", "“without saying what” = không cho biết giả định nào sai. Phương án C (bị bỏ ngay) nói điều mà cả đoạn 4 chứng minh là không xảy ra."],
          ["40", "Endings", "F", "in decline = degenerating; may… become successful again = might one day recover. Phương án E là ý Laudan phủ nhận ở đoạn sau."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba bẫy lặp lại của Reading Đề 9 — cẩn thận ở Đề 10",
        items: [
          "**Hai cái tên, một ý**: Crosby / Mann · Estonia / Canada · parents / mothers. Đề đặt hai ứng viên cùng loại cạnh nhau; chỉ một cái có đúng QUAN HỆ mà câu hỏi nêu.",
          "**Lý do bị bác đứng trước lý do thật**: “not for the reason usually given”, “On a strict reading… No astronomer drew that conclusion”. Phương án sai thường chép lại vế bị bác.",
          "**Từ trùng ở cả hai phía**: accuracy / accurately. Thấy trùng chữ ở Passage 3 thì đọc chậm lại, không đọc nhanh hơn.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Luyện lại — bài mới, 18 phút, Questions 1–14" },
      {
        t: "p",
        text: "Đặt đồng hồ **18:00**. Đọc một lượt, ghi lề 3–5 chữ cho mỗi đoạn (đó cũng là bước 2 của headings). Không tra từ. Bài viết ở ngôi thứ nhất như Passage 3 của Đề 9: để ý chỗ nào tác giả nói ý mình, chỗ nào thuật lại.",
      },
      {
        t: "passage",
        title: "In Praise of Slack",
        intro: "Why a system with nothing to spare may be less efficient than it looks",
        paras: [
          { label: "A", text: "For the better part of a century, efficiency has enjoyed the status of a virtue that needs no defence. To call a hospital, a railway or a government department inefficient is to condemn it; to call it lean is to pay it a compliment. The reasoning seems unanswerable: any resource that stands idle, whether a machine, a bed or an employee, represents money that could have been spent elsewhere. I want to suggest that this reasoning, though sound within its limits, has been carried well beyond them, and that some of what we are in the habit of calling waste would be better described as insurance." },
          { label: "B", text: "The limits can be stated with some precision. Engineers who study queues have long known that the relationship between how busy a system is and how long its users wait is not a steady one. A clinic whose doctors are occupied for seven hours in every ten will keep its patients waiting only briefly. Raise the figure to nine in ten, and the wait does not lengthen by a little; it multiplies several times over, because arrivals are irregular, and a system with no spare capacity has no means of absorbing a sudden cluster of them. The idle hour that a manager is tempted to eliminate is, in other words, the very thing that keeps the remaining hours running smoothly. None of this is controversial among specialists. It is merely inconvenient, for the spare capacity appears in the accounts every month, whereas the delays it prevents appear nowhere." },
          { label: "C", text: "Manufacturing supplies the best-known illustration. In the decades after the Second World War, Japanese car makers developed a method of production in which components were delivered to the assembly line only hours before they were needed, so that almost nothing was held in store. The savings were real, and the method was imitated across the world, although, it should be said, rather selectively. Its originators had taken care to keep their suppliers close at hand and to maintain long relationships with them; many imitators kept the empty warehouses and dispensed with the precautions. The consequences became visible only when something went wrong. A fire in a single factory, or a blocked shipping lane, could bring assembly lines to a standstill on the other side of the world within days. The method had not failed. It had been asked to work in conditions for which nobody had designed it." },
          { label: "D", text: "It is instructive to compare the way in which engineers, and for that matter evolution, treat the same problem. A bridge is routinely built to bear several times the heaviest load it is ever expected to carry, and nobody regards the extra steel as extravagant. The human body is more generous still: most of us could lose one kidney and scarcely notice. An accountant inspecting either would find a great deal to cut. Yet in both cases the surplus exists precisely because the future cannot be known in detail, and because the cost of being wrong is out of all proportion to the cost of being prepared. Where failure is merely irritating, a narrow margin is reasonable; where it is catastrophic, a narrow margin is a gamble, however impressive it looks on paper." },
          { label: "E", text: "The argument applies with equal force to people, though here it is less often heard. An employee whose every hour is accounted for has no time to notice that a procedure has become pointless, to help a colleague who is struggling, or to pursue an idea that may come to nothing. Organisations that pride themselves on full timetables are, I suspect, quietly giving up their capacity to improve, since improvement is seldom anybody's scheduled task. It is sometimes claimed that the most inventive firms deliberately set aside a fixed share of the working week for unplanned projects. Whether such schemes achieve what is claimed for them is uncertain, and I would not rest the case on them. The more modest point is enough: people who are permanently busy will go on doing efficiently whatever they happen to be doing already." },
          { label: "F", text: "None of this amounts to a defence of idleness, and it would be dishonest to pretend that the objection has no force. Spare capacity costs money, and the money has to be found from somewhere; a public service that kept half its staff in reserve would rightly be accused of squandering other people's taxes. Nor is all slack useful. A warehouse full of parts that no longer fit any product protects nobody. The difficulty is that the useful and the useless kinds look identical in a spreadsheet, and that the person best placed to tell them apart is usually the one closest to the work rather than the one holding the budget. Any serious attempt to cut waste therefore has to begin by asking what a given margin is for, and that is a question which a percentage cannot answer." },
          { label: "G", text: "Why, then, does the pressure run so consistently in one direction? Partly, I think, because the two kinds of error are not punished equally. The manager who removes a margin is rewarded at once, in a year when nothing happens to go wrong, while the disaster, if it comes, arrives later and is commonly blamed on bad luck. The manager who preserves a margin can point to nothing, since a crisis that was avoided leaves no trace. Until institutions learn to give credit for events that did not occur, they will continue to mistake fragility for discipline. Efficiency remains a virtue. It is simply not the only one, and a system designed as though it were will perform admirably right up to the moment at which it is needed most." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–7.** The passage has seven paragraphs, **A–G**. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i–x**. Có **ba** tiêu đề thừa.",
      },
      {
        t: "table",
        caption: "List of Headings",
        head: ["Số", "Heading"],
        rows: [
          ["i", "A good idea copied without its safeguards"],
          ["ii", "Why unequal rewards push decisions one way"],
          ["iii", "The rising cost of keeping goods in store"],
          ["iv", "A principle accepted without argument, and a reservation"],
          ["v", "Where wide margins go unquestioned"],
          ["vi", "Proof that free time makes firms inventive"],
          ["vii", "A relationship that defies ordinary expectation"],
          ["viii", "What is lost when every hour is filled"],
          ["ix", "How accounting methods have improved"],
          ["x", "Conceding a point, then drawing a line"],
        ],
      },
      {
        t: "quiz",
        id: "t5d9-doc-heading",
        kind: "fill",
        title: "Questions 1–7 — gõ số La Mã (i–x)",
        items: [
          { q: "1. Paragraph A", answers: ["iv"], hint: "Đoạn A nêu điều ai cũng tin (efficiency… needs no defence) rồi tác giả dè dặt: “though sound within its limits, has been carried well beyond them” ⇒ iv. principle accepted without argument = a virtue that needs no defence; reservation = I want to suggest…" },
          { q: "2. Paragraph B", answers: ["vii"], hint: "“the relationship… is not a steady one”: bận từ 70% lên 90% thì thời gian chờ không tăng một chút mà tăng gấp nhiều lần ⇒ vii. Bẫy ix: có chữ accounts, nhưng đoạn không nói kế toán đã tiến bộ." },
          { q: "3. Paragraph C", answers: ["i"], hint: "“imitated… rather selectively… kept the empty warehouses and dispensed with the precautions” ⇒ i (safeguards = precautions). Bẫy iii: có held in store, warehouses — nhưng không nói chi phí lưu kho tăng." },
          { q: "4. Paragraph D", answers: ["v"], hint: "Cầu chịu tải gấp nhiều lần, cơ thể có hai quả thận — “nobody regards the extra steel as extravagant” ⇒ v (go unquestioned = nobody regards… as extravagant)." },
          { q: "5. Paragraph E", answers: ["viii"], hint: "“An employee whose every hour is accounted for has no time to notice…, to help…, or to pursue…” ⇒ viii. Bẫy vi: tác giả nói kết quả của các chương trình ấy “is uncertain” — ngược với proof." },
          { q: "6. Paragraph F", answers: ["x"], hint: "“it would be dishonest to pretend that the objection has no force” (nhượng bộ) rồi tách slack có ích khỏi slack vô ích (vạch ranh giới) ⇒ x." },
          { q: "7. Paragraph G", answers: ["ii"], hint: "“the two kinds of error are not punished equally”: bỏ biên độ được thưởng ngay, giữ biên độ không ai ghi nhận ⇒ ii." },
        ],
      },
      {
        t: "p",
        text: "**Questions 8–14.** Do the following statements agree with the claims of the writer in the passage? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, or **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t5d9-doc-ynng",
        title: "Questions 8–14 — YES / NO / NOT GIVEN",
        items: [
          { q: "8. The usual case for efficiency is unsound even in the situations to which it properly applies.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: lập luận ấy “though sound within its limits, has been carried well beyond them” ⇒ trong phạm vi của nó thì ĐÚNG; sai là ở chỗ bị đẩy quá xa ⇒ trái với câu hỏi ⇒ NO. Bẫy: người đọc biết cả bài chê efficiency nên chọn YES." },
          { q: "9. Those who specialise in the study of queues accept that running a system close to full capacity causes delays out of proportion to the extra work.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: chờ đợi “multiplies several times over” và “None of this is controversial among specialists” ⇒ giới chuyên môn đồng ý ⇒ YES. accept = not controversial; out of proportion = does not lengthen by a little; it multiplies." },
          { q: "10. Car makers in Japan suffered fewer interruptions to production than the foreign firms that copied them.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C nói người sáng tạo ra phương pháp cẩn thận hơn người bắt chước, và dây chuyền có thể đứng lại. Bài KHÔNG so số lần gián đoạn giữa hai nhóm. Suy “cẩn thận hơn ⇒ ít gián đoạn hơn” là thêm một mắt xích ⇒ NOT GIVEN (cùng kiểu câu 33 Đề 9)." },
          { q: "11. How wide a safety margin ought to be depends on how serious the consequences of failure would be.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D, câu cuối: thất bại chỉ gây khó chịu ⇒ biên hẹp là hợp lý; thất bại là thảm hoạ ⇒ biên hẹp là canh bạc ⇒ YES. Hai vế song song nối bằng chấm phẩy (Bài 1 mục 8)." },
          { q: "12. It has been firmly established that reserving unscheduled time makes companies more inventive.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn E: “It is sometimes claimed…” (người khác nói) rồi tác giả: “Whether such schemes achieve what is claimed for them is uncertain” ⇒ tác giả coi là CHƯA chắc ⇒ trái với firmly established ⇒ NO. Không phải NOT GIVEN: tác giả có nêu ý mình về độ chắc chắn." },
          { q: "13. The people who control an organisation's budget are the best judges of which reserves are worth keeping.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: người phân biệt tốt nhất là “the one closest to the work rather than the one holding the budget” ⇒ NO. Cấu trúc X rather than Y — đọc hết cặp." },
          { q: "14. Institutions will eventually learn to reward managers for the crises they prevent.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn G: “Until institutions learn to give credit…, they will continue…” — nêu điều sẽ tiếp diễn CHO TỚI KHI họ học được; không nói họ sẽ học được hay không ⇒ NOT GIVEN. until ≠ when." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Chấm điểm và bảng paraphrase" },
      {
        t: "table",
        head: ["Đúng / 14", "Đánh giá", "Việc cần làm"],
        rows: [
          ["13–14", "mức band 8 cho hai dạng này", "ghi lại câu bạn còn lưỡng lự; sang Bài 3"],
          ["11–12", "band 7.5", "gắn nhãn R1–R5 cho câu sai; nếu sai ở câu 10 hoặc 14 ⇒ đọc lại ô “suy luận được phép” ở mục 3"],
          ["≤ 10", "chưa vững", "làm lại mục 2 và mục 4; ôn Tập 4 Ngày 3 và Ngày 5; làm lại bài này sau 3 ngày"],
        ],
      },
      {
        t: "table",
        head: ["Câu", "Trong bài", "Trong câu hỏi / tiêu đề", "Kiểu đổi"],
        rows: [
          ["1", "a virtue that needs no defence", "a principle accepted without argument", "đổi từ + đổi góc nhìn"],
          ["2", "is not a steady one", "defies ordinary expectation", "ý ẩn: không đều ⇒ trái trực giác"],
          ["3", "dispensed with the precautions", "copied without its safeguards", "đồng nghĩa mức 3"],
          ["4", "nobody regards the extra steel as extravagant", "go unquestioned", "phủ định ⇒ khẳng định"],
          ["6", "it would be dishonest to pretend that the objection has no force", "conceding a point", "phủ định kép ⇒ một động từ"],
          ["9", "None of this is controversial among specialists", "those who specialise… accept", "phủ định ⇒ khẳng định"],
          ["11", "merely irritating… / catastrophic…", "how serious the consequences of failure would be", "hai cực ⇒ một thang đo"],
          ["13", "the one closest to the work rather than the one holding the budget", "the people who control… budget are the best judges", "đảo vế của rather than"],
        ],
        caption: "Tám cặp paraphrase mức 3–4 của bài — chép ba cặp bạn thấy khó nhất vào sổ",
      },
      {
        t: "note",
        title: "💡 Mẹo: ba chỗ tác giả lộ ý — giống hệt Passage 3 Đề 9",
        items: [
          "**I want to suggest that… / I suspect / I think / I would not rest the case on them** — bốn chỗ ngôi thứ nhất, bốn chỗ ra câu hỏi (8, 12, và tiêu đề đoạn A, G).",
          "**It is sometimes claimed that…** — tín hiệu ý của người khác; ngay sau đó tác giả mới cho biết mình tin đến đâu (câu 12).",
          "**Tính từ đánh giá**: unanswerable (đoạn A — “seems unanswerable”, tức là chỉ có vẻ thôi), instructive, dishonest, rightly. Mỗi tính từ là một lá phiếu của tác giả.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Soi lại bài đọc bằng ngữ pháp Bài 1" },
      {
        t: "p",
        text: "Bài đọc dùng đúng các kiểu song song của Bài 1 để giữ câu dài cho rõ. Tìm lại trong bài và điền **MỘT từ** đúng như bài viết.",
      },
      {
        t: "quiz",
        id: "t5d9-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "Đoạn A: To call a hospital… inefficient is to condemn it; to call it lean is to ___ it a compliment.", answers: ["pay"], hint: "Hai vế to call… is to V…; nối bằng chấm phẩy. pay someone a compliment = khen." },
          { q: "Đoạn A: any resource that stands idle, whether a machine, a bed or an ___", answers: ["employee"], hint: "whether A, B or C — ba danh từ số ít có mạo từ." },
          { q: "Đoạn D: the surplus exists precisely because the future cannot be known in detail, and ___ the cost of being wrong is out of all proportion…", answers: ["because"], hint: "because… and because… — nhắc lại từ nhỏ khi vế dài (Bài 1 mục 5)." },
          { q: "Đoạn E: no time to notice that a procedure has become pointless, to help a colleague who is struggling, or ___ pursue an idea…", answers: ["to"], hint: "to notice…, to help…, or to pursue… — nhắc lại to ở cả ba vế." },
          { q: "Đoạn F: the person best placed to tell them apart is usually the one closest to the work rather ___ the one holding the budget.", answers: ["than"], hint: "the one + cụm… rather than the one + cụm…" },
          { q: "Đoạn G: The manager who removes a margin is rewarded at once… The manager who ___ a margin can point to nothing.", answers: ["preserves"], hint: "Hai câu cùng khung The manager who + V + a margin… — song song qua hai câu." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "unanswerable", pos: "adj", ipa: "/ʌnˈɑːnsərəbl/", vi: "không thể bác được (lập luận); không trả lời được (câu hỏi)", ex: "The case for clean water is unanswerable; the only question is who should pay.", exVi: "Lý lẽ ủng hộ nước sạch là không thể bác; câu hỏi duy nhất là ai trả tiền.", more: "trong bài: “The reasoning SEEMS unanswerable” — seems báo trước tác giả sắp bác · tiêu đề bài dùng slack (độ chùng) — từ đã học ở Ngày 5" },
          { w: "lean", pos: "adj", ipa: "/liːn/", vi: "tinh gọn (không thừa nhân lực, chi phí)", ex: "The firm prides itself on being lean, with only twelve office staff.", exVi: "Công ty tự hào là tinh gọn, chỉ có mười hai nhân viên văn phòng.", more: "lean production · a lean organisation — khen; trái nghĩa chê: bloated" },
          { w: "idle", pos: "adj", ipa: "/ˈaɪdl/", vi: "để không, không hoạt động", ex: "Half the machines stood idle during the strike.", exVi: "Một nửa số máy để không trong thời gian đình công.", more: "stand / lie / sit idle · idleness (n) — với người: lười nhác (sắc thái chê)" },
          { w: "spare capacity", pos: "n", ipa: "/speə kəˈpæsəti/", vi: "công suất dự phòng", ex: "The hospital had no spare capacity when the flu season began.", exVi: "Bệnh viện không còn công suất dự phòng khi mùa cúm bắt đầu.", more: "operate at / near full capacity · excess capacity (thừa, sắc thái chê)" },
          { w: "gamble", pos: "n / v", ipa: "/ˈɡæmbl/", vi: "canh bạc, việc liều; đánh cược", ex: "Building the stadium before finding a tenant was a gamble that failed.", exVi: "Xây sân vận động trước khi tìm được đơn vị thuê là một canh bạc thất bại.", more: "a gamble that pays off · gamble on sth · trong bài: a narrow margin is a gamble (đoạn D)" },
          { w: "dispense with", pos: "phr v", ipa: "/dɪˈspens wɪð/", vi: "bỏ đi, không dùng nữa (thứ trước đây được coi là cần)", ex: "The new system dispenses with paper forms altogether.", exVi: "Hệ thống mới bỏ hẳn biểu mẫu giấy.", more: "trang trọng hơn do without / get rid of" },
          { w: "bring something to a standstill", pos: "idiom", ipa: "/ˈstændstɪl/", vi: "làm cho đứng lại hoàn toàn", ex: "The snow brought the whole rail network to a standstill.", exVi: "Tuyết làm cả mạng lưới đường sắt tê liệt.", more: "come to a standstill · be at a standstill" },
          { w: "margin", pos: "n", ipa: "/ˈmɑːdʒɪn/", vi: "biên độ, khoảng dư (an toàn, sai số)", ex: "Engineers always leave a wide margin of safety.", exVi: "Kỹ sư luôn để một biên độ an toàn rộng.", more: "a margin of safety / error · a narrow / wide margin · by a narrow margin (thắng sát nút)" },
          { w: "out of all proportion to", pos: "phr", ipa: "/prəˈpɔːʃn/", vi: "hoàn toàn không tương xứng với (lớn hơn rất nhiều)", ex: "The fine was out of all proportion to the offence.", exVi: "Mức phạt hoàn toàn không tương xứng với lỗi vi phạm.", more: "in proportion to · a sense of proportion" },
          { w: "squander", pos: "v", ipa: "/ˈskwɒndə/", vi: "phung phí (tiền, cơ hội)", ex: "Critics accused the council of squandering public money.", exVi: "Những người phê bình cáo buộc hội đồng phung phí tiền công.", more: "squander money / an opportunity / a lead — mạnh hơn waste" },
          { w: "fragility", pos: "n", ipa: "/frəˈdʒɪləti/", vi: "sự mong manh, dễ vỡ", ex: "The crisis exposed the fragility of global supply chains.", exVi: "Cuộc khủng hoảng làm lộ ra sự mong manh của chuỗi cung ứng toàn cầu.", more: "fragile (adj) · trái nghĩa: resilience / robustness" },
          { w: "rest the case on", pos: "phr", ipa: "/rest ðə keɪs ɒn/", vi: "dựa lập luận vào", ex: "I would not rest the case on a single survey.", exVi: "Tôi sẽ không dựa cả lập luận vào một cuộc khảo sát duy nhất.", more: "the case for / against · make a case for — dùng được trong Task 2" },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Sổ lỗi Reading Đề 9: mỗi câu sai một dòng — **câu · nhãn R1–R5 · cặp “bài viết ↔ câu hỏi” · một câu rút ra**. Ví dụ: “32 · R2 · owes more to convenience than to accuracy ↔ mainly because accurate · more X than Y = không phải Y”.",
          "Sau 7 ngày, che cột đáp án và làm lại đúng các câu đã sai của Đề 9 ở Online Test.",
          "Ngày 17 sẽ mổ Reading Đề 10 theo đúng năm nhãn này. So số nhãn R2 và R4 của hai đề.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d9-nghe",
    kind: "listening",
    title: "Nghe: Mổ Listening Đề 9 — từng câu sai vào sổ lỗi, rồi luyện lại ba kiểu bẫy bằng bài mới (giọng Ireland · Úc · New Zealand · Canada · Anh · Mỹ)",
    goal: "Gắn được nhãn nguyên nhân cho từng câu sai của Listening Đề 9, nghe ra câu tín hiệu “bác rồi mới nói” (that's not why… · what decided it was… · what we do suggest is…), biết ý kiến trong Part 3 là của ai, và làm lại ba bài ngắn mới cùng kỹ năng đạt ít nhất 16/18.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "Mở trang kết quả **Đề 9 — Listening** và bật **bản lời thoại** (transcript). Hôm nay là lần duy nhất bạn được nghe lại đề nhiều lần — mục đích là tìm ra ==vì sao== lỡ, không phải để thuộc đáp án.",
          "Đề 9 có một thiết kế xuyên suốt: ==đáp án đứng sau ít nhất một phương án bị bác==. Người nói nêu cái sai trước (kèm lý do nghe rất hợp lý), rồi mới nói cái đúng.",
          "Ngày 8 bạn đã tự xếp từng câu sai vào năm loại **A–E** (không nghe ra âm · nghe ra, viết sai · dính bẫy · lạc chỗ · đọc đề không kịp). Hôm nay có lời thoại nên đối chiếu được loại bạn ĐOÁN với loại THẬT — và tách loại **C** (dính bẫy), loại đông nhất ở Đề 9, thành ba: **C1** viết phương án bị bác · **C2** nhầm người nói / nhầm thì · **C3** không nối được lời nói với phương án (paraphrase).",
          "Bốn kiểu câu tín hiệu báo “đáp án sắp tới”: phủ định lý do · câu chẻ What… was… · do / does / did nhấn mạnh · not X, it's Y.",
          "Sau phần mổ: ba bài MỚI (18 câu) — Part 1 giọng Ireland + Úc, Part 3 ba người ba giọng, Part 4 giọng Mỹ. 🔊 Phát âm: trọng âm tương phản khi sửa thông tin.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chấm theo Part — đối chiếu loại lỗi đã đoán ở Ngày 8" },
      {
        t: "table",
        head: ["Part", "Bối cảnh · giọng", "Dạng", "Mục tiêu band 7.5", "Bạn đúng"],
        rows: [
          ["1", "gửi chó ở trại trông thú · Canada + Anh", "Form 1–6 · Note 7–10", "9–10", "… / 10"],
          ["2", "đón thành viên mới khu vườn thuê · Úc", "MCQ 11–15 · Matching 16–20", "8", "… / 10"],
          ["3", "báo cáo thực địa sau khi dỡ đập · Mỹ + Anh + Ireland", "MCQ 21–24 · Choose TWO 25–26 · Flow-chart 27–30", "7–8", "… / 10"],
          ["4", "bài giảng khoa học công dân · New Zealand", "Note 31–36 · Sentence 37–40", "8", "… / 10"],
        ],
        caption: "Mục tiêu Đề 9: 32/40. Mất quá 1 câu ở Part 1 là mất điểm “không được phép mất”.",
      },
      {
        t: "table",
        head: ["Nhãn", "Chuyện gì đã xảy ra", "Dấu hiệu", "Chữa bằng"],
        rows: [
          ["**A · Không nghe ra âm**", "nghe thành một chuỗi không tách được từ (giọng lạ, chỗ nói nhanh)", "bật lời thoại lên mới biết đó là từ quen", "nghe lại đúng câu đó 5 lần, nói theo (shadowing); Ngày 8 mục 5"],
          ["**B · Nghe ra, viết sai**", "nghe đúng, viết sai", "Tibo, citys, contribute, spread sheet", "2 phút kiểm cuối: chính tả · số ít / nhiều · loại từ · giới hạn từ"],
          ["**C1 · Dính bẫy: phương án bị bác**", "nghe rõ từ, nhưng đó là cái bị bác", "bạn viết eight, 29, bath, photo, card, length", "chỉ chốt khi nghe câu xác nhận; học bốn kiểu câu tín hiệu ở mục 6"],
          ["**C2 · Dính bẫy: nhầm người / nhầm thì**", "ý đúng nhưng của người khác, hoặc là quy định cũ", "sai câu 13, 23", "đọc chủ ngữ câu hỏi; ghi chữ cái đầu tên người bên lề"],
          ["**C3 · Dính bẫy: paraphrase**", "nghe hiểu nhưng không thấy phương án nào “giống”", "sai câu 14, 22, 24", "trước khi nghe, tự nói lại mỗi phương án bằng từ khác"],
          ["**D · Lạc chỗ**", "còn nghĩ câu cũ, lỡ luôn câu kế", "hai ô trống liền nhau", "bỏ câu đã lỡ trong vài giây; mắt nhảy xuống từ khoá câu sau (Tập 4 Ngày 28)"],
          ["**E · Đọc đề không kịp**", "băng chạy rồi mà chưa đọc xong câu hỏi / hộp lựa chọn", "sai dồn ở đầu mỗi nhóm câu", "việc trong giờ đọc trước (Ngày 8 mục 2); Part 4: đọc cả hai nhóm câu"],
        ],
        caption: "Bộ nhãn A–E của Ngày 8, loại C tách ba — dùng lại ở Ngày 25 (mổ Listening Đề 11)",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mổ Part 1 — “con số đúng thường là con số thứ ba”" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Cái được nói TRƯỚC", "Câu chốt (trích ngắn)", "Rút ra"],
        rows: [
          ["1", "Thibault", "—", "“T, H, I, B, A, U, L, T”", "Tên gốc Pháp: âm nghe được (gần “ti-bô”) không giúp gì cho chính tả. Chép theo chữ cái; lần đọc lại của nhân viên là cơ hội kiểm. Sai ở đây là loại B."],
          ["2", "6", "eight (vợ đoán, có lý do: lông mặt bạc)", "“the vet's records say six”", "Phiếu in sẵn “age on vet's records” — đọc phiếu kỹ thì biết trước sẽ có hai con số từ hai nguồn."],
          ["3", "17", "the eighteenth (ngày bay)", "“Friday the seventeenth”", "Phiếu in “Friday” ⇒ 18 (thứ Bảy) bị loại ngay trên giấy. “the day before” là phép trừ bạn phải tự làm nếu nhân viên không nhắc lại."],
          ["5", "26", "24 (loại thường) → 29 (giá gốc) + phép nhẩm 29 × 16", "“long-stay rate… £26 a night”", "Ba con số. Phép nhẩm của khách là để bạn tin 29 đã chốt. Chỉ chốt khi nghe người BÁN nói giá cuối."],
          ["6", "12", "two weeks", "“within the past twelve months”", "Hai con số đều đúng, đi với hai đơn vị. Ô trống đứng trước months."],
          ["9", "grooming", "a bath", "“We don't do a bath by itself, but… grooming”", "Khách xin một thứ, nhân viên đổi sang thứ khác. Từ khoá trên phiếu (booked, £15) chỉ khớp với lời nhân viên."],
          ["10", "video", "a photo every day (các trại KHÁC)", "“what we do is send a short video”", "Câu chẻ what we do is… = tín hiệu chốt. every three days in sẵn trên phiếu loại photo."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Part 1 tốc độ thật",
        items: [
          "**Viết ngay con số đầu tiên rồi thôi nghe.** Ở Đề 9, mọi con số đầu tiên đều sai. Giữ bút, chờ câu xác nhận (I'll put six · Friday the seventeenth · I'll take that).",
          "**Nghe đánh vần bằng tai tiếng Việt.** A /eɪ/ ↔ E /iː/ ↔ I /aɪ/; H /eɪtʃ/; U /juː/. Tên có H câm (Thibault) hay P câm bắt buộc phải chép từng chữ.",
          "**-teen và -ty.** seventeenth có nhấn ở -TEENTH và /n/ rõ; seventieth là ba âm tiết nhẹ dần. Khi không chắc, dùng thông tin trên phiếu (Friday, July) để loại.",
          "**Không đọc đơn vị in sẵn.** months, nights, £, kennel — chữ đứng sau ô trống cho biết loại thông tin và loại được nửa số bẫy.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ Part 2 — phương án “có thật nhưng không phải lý do”" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Phương án có thật nhưng sai", "Câu chốt", "Rút ra"],
        rows: [
          ["11", "B", "A: danh sách chờ (“it has helped”) · C: hội đồng (“would probably have asked us”)", "“But that's not what was behind it.”", "Câu hỏi là WHY. Hai phương án sai đều là SỰ THẬT. Người nói thừa nhận chúng rồi gạt đi. Đáp án đến sau câu gạt."],
          ["12", "A", "C: buổi cho người mới (có thật, nhưng “entirely up to you”)", "“a quarter of the plot should have something growing in it”", "must trong câu hỏi ⇒ tìm chữ nghĩa vụ trong lời nói: The rule is… Lời khuyên (I'd recommend) không phải nghĩa vụ."],
          ["13", "C", "B: “any evening you liked” (quy định CŨ) · A: “came very close to banning” (suýt)", "“from the start of November to the end of February, and at no other time”", "Câu hỏi có current. Ba phương án = quá khứ · suýt xảy ra · hiện tại. Loại C2 (nhầm thì)."],
          ["14", "A", "B: salad (sên ăn) · C: raspberries, strawberries (chờ hai năm)", "“My advice is boring: put in potatoes.”", "soft fruit không được nói ra. Bạn phải tự gom raspberries + strawberries thành một loại. Loại C3."],
          ["16", "B", "F: “there's nothing to pay” + ten-pound deposit", "“you'll need to get a key from me”", "deposit (đặt cọc, được trả lại) ≠ charge each time (phí mỗi lần). Một con số tiền không tự động là “a charge”."],
          ["19", "C", "G: “run entirely by volunteers”", "“only open on Saturday and Sunday mornings”", "volunteers có thật; nhưng “I'm not asking any of you to volunteer” loại G. Nghe hết câu sau chữ khoá."],
        ],
      },
      {
        t: "note",
        title: "📌 Ba câu hỏi phải tự hỏi với mỗi phương án MCQ",
        items: [
          "**Có được nói không?** Ở Đề 9 gần như phương án nào cũng được nói — câu hỏi này không còn đủ để loại.",
          "**Nó trả lời đúng CÂU HỎI không?** why ⇒ lý do chính · must ⇒ nghĩa vụ · current ⇒ bây giờ · not expect ⇒ điều bất ngờ.",
          "**Người nói có gạt nó đi không?** but that's not… · that's up to you · we came close to… · nobody's asking you to….",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mổ Part 3 — ý của AI, và đề xuất nào được DUYỆT" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Ai nói gì", "Rút ra"],
        rows: [
          ["21", "B", "Callum: lớn lên gần đó, “but… that's not why we picked it” · Priya: “What decided it was the data.” · Callum: tin tức đến sau", "Ba lý do, ba mốc thời gian. Câu chẻ What decided it was… là câu chốt."],
          ["22", "C", "Priya: sỏi trở lại — “exactly what we found” · Callum: cá tăng — “what the textbooks tell you” · Callum: “The thing that did take us by surprise…”", "not expect ⇒ bỏ mọi thứ đi kèm exactly / as predicted. eaten away (lời nói) = worn away (phương án): loại C3."],
          ["23", "A", "Priya lo câu hỏi dẫn dắt · Dr Brennan: “I thought the wording was fair… My concern is different.” · Callum: làm trực tuyến? — “not the issue now”", "Câu hỏi hỏi ý của Dr Brennan. Nỗi lo của Priya được nói trước và rõ hơn. Loại C2. Đáp án nằm ở “can't generalise” — không có chữ few nào."],
          ["24", "B", "Callum: drone — Priya bác · Callum: ảnh — Dr Brennan bác (“I wouldn't rely on them”) · Priya: hai mặt cắt — Dr Brennan: “That's the one.”", "decide ⇒ tìm câu DUYỆT của người có quyền. Hai đề xuất đầu đều của cùng một người và đều bị bác."],
          ["25–26", "B, E", "Callum: đo thêm — “Leave it.” · Priya: gặp lại tổ chức — “wouldn't add much” · tài liệu tham khảo — “is fine” · Dr Brennan: “What I do want is…” + “The other thing is…”", "Hai đáp án đều do Dr Brennan tự nêu, đánh dấu bằng do nhấn mạnh và The other thing. Ba phương án sai đều là đề xuất của sinh viên bị từ chối."],
          ["28", "width", "Callum: đo bằng ruler; ngày đầu đo sai chiều dài", "“it's not the length you want, it's the width” — not X, it's Y. ruler không hợp ngữ pháp với “the ___ of each stone”."],
          ["29", "coin", "Priya: đáng lẽ dùng scale card, quên ở phòng thí nghiệm", "“so we used a coin instead” — instead là tín hiệu thay thế."],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo Part 3 ba người: ghi chữ cái đầu bên lề",
        items: [
          "Trong 40 giây đọc đề, khoanh tên người trong câu hỏi: **Dr Brennan's** criticism · Dr Brennan **tell** · **they** decide. Mỗi câu hỏi thuộc về một người hoặc cả nhóm.",
          "Khi nghe, ghi **P / C / B** cạnh phương án ngay khi có người nhắc tới nó. Phương án có chữ C (Callum) ở câu hỏi về ý của B (Brennan) là phương án bẫy.",
          "Giảng viên trong IELTS gần như luôn là người chốt. Câu duyệt của họ ngắn: That's the one. · Good. · Leave it. · I wouldn't.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Mổ Part 4 — mười câu không nghỉ" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Bẫy", "Rút ra"],
        rows: [
          ["31", "hunt", "đáp án nằm trong câu bốn chữ “It was simply a hunt.”", "Câu ngắn giữa hai câu dài dễ trôi qua. alternative to trên ghi chú = instead trong lời nói — nghe instead thì nhìn lại câu ngay trước."],
          ["33", "shape", "spiral", "Ghi chú cần TIÊU CHÍ phân loại (by ___); spiral là một giá trị của tiêu chí. Hỏi: ô trống cần loại thông tin gì?"],
          ["34", "teacher", "research student (người làm 50.000 ảnh)", "Hai người, hai việc. from the Netherlands trên ghi chú = Dutch trong lời nói."],
          ["35", "contribution", "games; viết contribute", "“You might guess… But when…” — phương án bị bác rồi tới đáp án. Sau make a phải là danh từ: loại B."],
          ["36", "cities", "viết city / citys", "near ___ and roads: roads số nhiều ⇒ danh từ song song cũng số nhiều (Bài 1 mục 2 — song song giúp cả lúc NGHE)."],
          ["37", "time", "everything", "“and, crucially, to state how much time…” — crucially báo ý quan trọng. how much + danh từ không đếm được."],
          ["39", "collectors", "developers, farmers", "“The threat wasn't from developers or farmers, it was from collectors.” — not X, it was Y, hai danh từ bị bác đứng sát đáp án."],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao Part 4 Đề 9 mệt hơn Đề 8",
        items: [
          "Không có đoạn nghỉ giữa: hai nhóm câu (31–36, 37–40) đi liền. Dùng 45 giây đầu đọc CẢ HAI nhóm.",
          "Tiêu đề ## trong ghi chú (The Christmas Bird Count · Galaxy Zoo · Problems) là biển báo. Nghe thấy “The second example…” / “Now, the problems.” thì mắt phải nhảy xuống tiêu đề kế, dù câu trước còn trống.",
          "Câu 40 nằm ở câu gần cuối bài giảng. Nghe “Finally” không có nghĩa là hết câu hỏi.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bốn kiểu câu tín hiệu “bác rồi mới nói”" },
      {
        t: "table",
        head: ["Kiểu", "Khung", "Trong Đề 9", "Nghĩa là"],
        rows: [
          ["① Phủ định lý do", "that's not why / what… · that's not the issue", "“But that's not what was behind it.” (11) · “that's not why we picked it” (21)", "mọi thứ vừa nghe là phương án sai; đáp án ở câu KẾ"],
          ["② Câu chẻ", "What + V + was / is… · The thing that… was…", "“What decided it was the data.” (21) · “what we do is send…” (10)", "đáp án nằm SAU was / is"],
          ["③ do / does / did nhấn mạnh", "What we do suggest is… · What I do want is… · you do have to…", "câu 7, 20, 25", "đối lập với điều vừa bị gạt; trợ động từ được nhấn mạnh và kéo dài"],
          ["④ not X, it's Y", "it's not the X, it's the Y · wasn't from X, it was from Y · X instead", "câu 28, 29, 39", "X là bẫy, Y là đáp án, hai từ sát nhau"],
        ],
        caption: "Về ngữ pháp, cả bốn là họ hàng của cặp not X but Y ở Bài 1 mục 3",
      },
      { t: "rule", formula: "nghe  not / but / actually / in fact / instead / What … is  →  bỏ điều vừa nghe  →  đáp án ở vế SAU", vi: "Ở tốc độ thật bạn không kịp phân tích; chỉ cần phản xạ: tín hiệu vang lên thì chưa viết, hoặc gạch cái vừa viết." },
      {
        t: "phatam",
        id: "t5d9-phat-am",
        title: "Luyện phát âm — trọng âm tương phản khi SỬA thông tin: hạ từ sai, đẩy từ đúng",
        note: "Mỗi câu có một cặp đối. Nói từ bị bác thấp và nhanh; từ đúng cao, to, dài hơn (CHỮ HOA trong phần dịch). Luyện nói để tai quen NGHE: ở Đề 9, từ được đẩy lên gần như luôn là đáp án.",
        items: [
          { text: "It's not the fourteenth, it's the fortieth.", ipa: "ɪts nɒt ðə fɔːtiːnθ ɪts ðə fɔːtiəθ", vi: "Không phải thứ mười bốn, mà là thứ bốn mươi. (not the fourTEENTH ↘ thấp | it's the FORtieth ↗↘)" },
          { text: "The report says fifteen, not twenty.", ipa: "ðə rɪpɔːt sez fɪftiːn nɒt twenti", vi: "Báo cáo ghi mười lăm, không phải hai mươi. (says fifTEEN | not TWENty)" },
          { text: "That's not why we chose it.", ipa: "ðæts nɒt waɪ wi tʃəʊz ɪt", vi: "Đó không phải lý do chúng tôi chọn nó. (nhấn NOT và WHY — lý do thật ở câu sau)" },
          { text: "What decided it was the cost.", ipa: "wɒt dɪsaɪdɪd ɪt wɒz ðə kɒst", vi: "Điều quyết định là chi phí. (What deCIded it ↗ | was the COST ↘)" },
          { text: "We don't post the results; we email them.", ipa: "wi dəʊnt pəʊst ðə rɪzʌlts wi iːmeɪl ðəm", vi: "Chúng tôi không gửi kết quả qua bưu điện; chúng tôi gửi email. (don't POST | we Email them)" },
          { text: "What I do want is a shorter introduction.", ipa: "wɒt aɪ duː wɒnt ɪz ə ʃɔːtə ɪntrədʌkʃn", vi: "Cái tôi thật sự muốn là một phần mở bài ngắn hơn. (nhấn DO — trợ động từ nhấn mạnh)" },
          { text: "The problem wasn't money; it was maintenance.", ipa: "ðə prɒbləm wɒznt mʌni ɪt wɒz meɪntənəns", vi: "Vấn đề không phải tiền; mà là bảo trì. (wasn't MOney | it was MAINtenance)" },
          { text: "I asked for a coarse mesh, not a fine one.", ipa: "aɪ ɑːskt fə ə kɔːs meʃ nɒt ə faɪn wʌn", vi: "Tôi yêu cầu lưới thưa, không phải lưới mịn. (a COARSE mesh | not a FINE one)" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện lại ① — Part 1 mới: con số thứ ba, tên phải đánh vần (Questions 1–6)" },
      {
        t: "p",
        text: "Một người gọi tới công ty cắt tỉa cây. Bạn có **20 giây** đọc phiếu. Nghe **một lần**. Write **ONE WORD AND/OR A NUMBER** for each answer. Trước khi nghe, đoán: ô nào sẽ có hai ba con số? Ô nào có phương án bị bác?",
      },
      {
        t: "table",
        head: ["Kilbride Tree Care — Enquiry Form", ""],
        rows: [
          ["Customer's surname", "**1** ……………"],
          ["Tree", "ash — height on surveyor's report: **2** …………… metres"],
          ["Work required", "crown **3** ……………"],
          ["Site visit", "Friday **4** …………… May, 8 a.m."],
          ["Price", "€ **5** ……………"],
          ["Wood", "to be left as **6** ……………"],
        ],
      },
      {
        t: "listen",
        id: "t5d9-nghe-p1",
        title: "Practice 1 — Booking a tree surgeon",
        dan: { so: "Day 9, Recording 1", boiCanh: "a man telephoning a tree care company about a tree in his garden.", cau: [1, 6] },
        note: "Khoảng 2 phút 20 giây, ~170 từ/phút. Niamh: giọng Ireland (nữ). Dale: giọng Úc (nam).",
        lines: [
          { who: "Niamh", voice: "ie-nu", text: "Kilbride Tree Care, Niamh speaking." },
          { who: "Dale", voice: "au-nam", text: "G'day. I've got a big ash tree in the back garden that's hanging right over next door's roof, and I'd like someone to come and look at it." },
          { who: "Niamh", voice: "ie-nu", text: "No problem at all. Can I take your surname first?" },
          { who: "Dale", voice: "au-nam", text: "It's Pfeiffer. That's P, F, E, I, double F, E, R. The P's silent, so nobody ever gets it." },
          { who: "Niamh", voice: "ie-nu", text: "P, F, E, I, double F, E, R. Grand. And how tall is the tree, roughly?" },
          { who: "Dale", voice: "au-nam", text: "Well, my neighbour reckons it's twenty metres, but he's the one complaining, so he would say that. When we bought the place, the surveyor's report had it at fifteen." },
          { who: "Niamh", voice: "ie-nu", text: "I'll go with the report, so. Now, what are you hoping we'll do? A lot of people in your position want the tree taken down altogether." },
          { who: "Dale", voice: "au-nam", text: "No, no, I like the tree. My wife thought it just needed the dead wood taken out, but it's the live branches over the roof that worry me." },
          { who: "Niamh", voice: "ie-nu", text: "Then taking out dead wood won't solve it. What you want is what we call a crown reduction. We shorten the branches all the way round, by about a quarter, so the tree keeps its shape." },
          { who: "Dale", voice: "au-nam", text: "A reduction. Right, that sounds like it." },
          { who: "Niamh", voice: "ie-nu", text: "Before we can quote properly, someone has to see it. Our surveyor's out your way on Thursday the ninth of May." },
          { who: "Dale", voice: "au-nam", text: "Thursday's no good, I'm away for work. Could he do the day after?" },
          { who: "Niamh", voice: "ie-nu", text: "Let me see. Yes, he could call at eight on the Friday, before his first job." },
          { who: "Dale", voice: "au-nam", text: "Perfect. And roughly what am I looking at? A mate of mine paid about six hundred for something similar." },
          { who: "Niamh", voice: "ie-nu", text: "For a tree that size, it's normally seven hundred and fifty euro. Can I ask, is there a way in for the truck, or would everything have to be carried through the house?" },
          { who: "Dale", voice: "au-nam", text: "There's a side gate. You'd get a truck through, easy." },
          { who: "Niamh", voice: "ie-nu", text: "Then it's the lower rate, which is six hundred and eighty. And the last thing: the wood. Do you want it taken away?" },
          { who: "Dale", voice: "au-nam", text: "I just assumed you'd take the lot." },
          { who: "Niamh", voice: "ie-nu", text: "We can, but there's a charge for that. Most people have us chip it for the garden. Otherwise we cut it into logs and stack them for you." },
          { who: "Dale", voice: "au-nam", text: "We've got a stove, so I don't want chippings. Leave me the logs." },
          { who: "Niamh", voice: "ie-nu", text: "Logs it is. I'll put you down for Friday, so." },
        ],
      },
      {
        t: "quiz",
        id: "t5d9-nghe-p1-dien",
        kind: "fill",
        title: "Questions 1–6 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Customer's surname", answers: ["Pfeiffer"], hint: "“P, F, E, I, double F, E, R” — P câm, “double F” = FF. Nghe như “fai-fơ”: không chép theo chữ cái thì không viết được. Cùng kiểu câu 1 Đề 9." },
          { q: "2. Height on surveyor's report (metres)", answers: ["15", "fifteen"], hint: "Hàng xóm: twenty (bị bác: “he would say that”). “the surveyor's report had it at fifteen” — phiếu in sẵn surveyor's report. Cùng kiểu câu 2 Đề 9 (hai nguồn, hai con số)." },
          { q: "3. Work required: crown ___", answers: ["reduction"], hint: "Chặt hẳn (bị bác: “I like the tree”) → gỡ cành khô (ý của vợ, Niamh bác) → “What you want is… a crown reduction”. Câu chẻ = tín hiệu chốt." },
          { q: "4. Site visit: Friday ___ May", answers: ["10", "10th", "tenth"], hint: "“Thursday the ninth” bị từ chối; “the day after” = thứ Sáu mùng 10. Niamh KHÔNG nhắc lại con số — bạn phải tự cộng. Cùng kiểu câu 3 Đề 9." },
          { q: "5. Price (€)", answers: ["680"], hint: "600 (bạn của Dale) → 750 (giá thường) → có cổng bên cho xe vào ⇒ “the lower rate, which is six hundred and eighty”. Con số thứ ba." },
          { q: "6. Wood: to be left as ___", answers: ["logs"], hint: "Chở đi hết (mất phí) → băm dăm (“I don't want chippings”) → “Leave me the logs.” Số nhiều." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện lại ② — Part 3 mới: ý của ai, đề xuất nào được duyệt (Questions 7–12)" },
      {
        t: "p",
        text: "Hai sinh viên, **Mere** và **Ethan**, bàn bản nháp báo cáo với giảng viên **Dr Hale**. Đề tài: vì sao sinh viên bỏ câu lạc bộ thể thao sau học kỳ đầu. Bạn có **30 giây** đọc câu hỏi — khoanh tên người trong từng câu. Nghe **một lần**.",
      },
      {
        t: "listen",
        id: "t5d9-nghe-p3",
        title: "Practice 2 — A report on why students leave sports clubs",
        dan: { so: "Day 9, Recording 2", boiCanh: "two students, Mere and Ethan, discussing the draft of their research report with their tutor, Dr Hale.", cau: [7, 12] },
        note: "Khoảng 2 phút 40 giây, ~170 từ/phút. Dr Hale: giọng Anh (nữ). Mere: giọng New Zealand (nữ). Ethan: giọng Canada (nam).",
        lines: [
          { who: "Dr Hale", voice: "uk-nu", text: "Right, I've read the draft. Before the detail, tell me why you went for sports clubs in particular. You could have looked at student societies in general." },
          { who: "Ethan", voice: "ca-nam", text: "Well, Mere's on the committee of the rowing club, so we had a way in. But that's not really what settled it." },
          { who: "Mere", voice: "nz-nu", text: "No. The thing is, sports clubs take a register every session, so we could actually see the week when people stopped coming. With a debating society, nobody writes anything down." },
          { who: "Ethan", voice: "ca-nam", text: "And the students' union did ask for a copy later on, but we were well under way by then." },
          { who: "Dr Hale", voice: "uk-nu", text: "Good, say that in your method section. Now, was there anything in the results that you hadn't seen coming?" },
          { who: "Mere", voice: "nz-nu", text: "Not the timing. Everything we'd read said most people go in the first six weeks, and that's what the registers showed." },
          { who: "Ethan", voice: "ca-nam", text: "And lots of them blamed clashes with lectures, which again we expected. What we didn't expect was how many said they left because they never got to know anyone. In a team sport! You'd think that's the one place you would." },
          { who: "Dr Hale", voice: "uk-nu", text: "That's your headline, then. Now, the interviews. Ethan, you've written a note here saying you're not happy with them." },
          { who: "Ethan", voice: "ca-nam", text: "Yeah, I felt they were too short. Ten minutes each isn't much." },
          { who: "Dr Hale", voice: "uk-nu", text: "For this kind of question, ten minutes is plenty, so I wouldn't worry about that. What bothers me is who you spoke to. All twelve are still members, as far as I can tell. You're asking the people who stayed why other people left." },
          { who: "Mere", voice: "nz-nu", text: "We did try the ones who'd left. Hardly any of them replied." },
          { who: "Dr Hale", voice: "uk-nu", text: "I'm sure. But then you have to say so, plainly. Now, how are you going to show that six-week pattern?" },
          { who: "Ethan", voice: "ca-nam", text: "I'd thought a pie chart for the reasons people gave." },
          { who: "Mere", voice: "nz-nu", text: "With eleven slices? Nobody could read it. I'd rather put three or four of the quotations up on a slide." },
          { who: "Dr Hale", voice: "uk-nu", text: "The quotations are lovely, but they're illustration, not evidence. What about a single line showing attendance week by week? The drop after week six would speak for itself." },
          { who: "Mere", voice: "nz-nu", text: "Yes. OK, let's do that." },
          { who: "Dr Hale", voice: "uk-nu", text: "Two things before you hand it in. There's nothing at all on consent. How people agreed to take part, what you told them. You do need a short section on that." },
          { who: "Ethan", voice: "ca-nam", text: "Should we send the questionnaire out again, to get the numbers up?" },
          { who: "Dr Hale", voice: "uk-nu", text: "There isn't time, and your figures are sound as they are, so there's no need to have anyone check them either. The other thing is the order. Your recommendations are buried on the last page. Move them to the front, straight after the summary. That's what the union will read." },
          { who: "Mere", voice: "nz-nu", text: "Front of the report. Got it." },
        ],
      },
      {
        t: "mcq",
        id: "t5d9-nghe-p3-chon",
        title: "Questions 7–10 — Choose the correct letter, A, B or C",
        items: [
          { q: "7. Why did the students decide to study sports clubs?", options: ["A One of them already had a connection with a club.", "B Attendance records made it possible to see when members left.", "C The students' union had requested the research."], correct: 1, why: "Ethan: Mere ở ban điều hành — “But that's not really what settled it” (A có thật, bị gạt). Mere: câu lạc bộ thể thao “take a register every session” ⇒ B. Hội sinh viên xin bản sao “later on… we were well under way by then” (C đến sau). Cùng kiểu câu 21 Đề 9." },
          { q: "8. Which finding surprised the students?", options: ["A Most members left within the first six weeks.", "B Many members blamed their lecture timetable.", "C Many members felt they had not made friends."], correct: 2, why: "Sáu tuần đầu: “that's what the registers showed” (đúng dự đoán). Trùng lịch học: “again we expected”. “What we didn't expect was how many… never got to know anyone” ⇒ C. never got to know anyone = had not made friends (paraphrase). Cùng kiểu câu 22." },
          { q: "9. What is Dr Hale's concern about the interviews?", options: ["A They were not long enough.", "B They were carried out with the wrong group of people.", "C Too few people agreed to be interviewed."], correct: 1, why: "“too short” là nỗi lo của ETHAN; Dr Hale: “ten minutes is plenty”. “What bothers me is who you spoke to. All twelve are still members.” ⇒ B. C: Mere nói người đã bỏ hầu như không trả lời — đó là lời giải thích của Mere, không phải điều Dr Hale chê. Cùng kiểu câu 23." },
          { q: "10. How do they decide to present the main pattern in their results?", options: ["A in a pie chart of the reasons given", "B with quotations from the interviews", "C with a graph of weekly attendance"], correct: 2, why: "Pie chart (Ethan) — Mere bác: mười một lát. Trích dẫn (Mere) — Dr Hale: “illustration, not evidence”. “a single line showing attendance week by week” — Mere: “let's do that” ⇒ C. Cùng kiểu câu 24: hai đề xuất bị bác, cái thứ ba được duyệt." },
        ],
      },
      {
        t: "p",
        text: "**Questions 11–12.** Choose **TWO** letters, **A–E**. Which TWO things does Dr Hale tell the students to do before they submit the report? — **A** send out the questionnaire a second time · **B** add a section on how participants gave consent · **C** ask someone to check the statistics · **D** interview more former members · **E** put the recommendations nearer the beginning",
      },
      {
        t: "quiz",
        id: "t5d9-nghe-p3-hai",
        kind: "fill",
        title: "Questions 11–12 — gõ hai chữ cái (thứ tự nào cũng được), ví dụ: A C",
        items: [
          { q: "11–12. Two letters", answers: ["B E", "E B", "BE", "EB", "B, E", "E, B", "B and E", "E and B", "B,E", "E,B"], hint: "“You do need a short section on that [consent]” ⇒ B (do nhấn mạnh). “The other thing is the order… Move them to the front” ⇒ E. A: “There isn't time”. C: “no need to have anyone check them”. D: không ai đề xuất phỏng vấn thêm — Mere chỉ kể đã thử. Cùng kiểu câu 25–26 Đề 9." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện lại ③ — Part 4 mới: ghi chú một từ, hai danh từ bị bác đứng sát đáp án (Questions 13–18)" },
      {
        t: "p",
        text: "Một đoạn bài giảng về việc hứng nước từ sương mù. Bạn có **20 giây** đọc ghi chú. Nghe **một lần**. Write **ONE WORD ONLY** for each answer.",
      },
      {
        t: "table",
        head: ["Collecting water from fog — notes"],
        rows: [
          ["• the engineers' design copies the way a **13** …………… collects fog"],
          ["• the mesh must be **14** …………… so that wind can pass through it"],
          ["• water reaches the village through a pipe, moved by **15** ……………"],
          ["• main advantage in remote places: needs no **16** ……………"],
          ["• several early projects were given up because of poor **17** ……………"],
          ["• later projects began by setting up a local **18** ……………"],
        ],
      },
      {
        t: "listen",
        id: "t5d9-nghe-p4",
        title: "Practice 3 — Lecture extract: harvesting water from fog",
        dan: { so: "Day 9, Recording 3", boiCanh: "part of a lecture about collecting drinking water from fog.", cau: [13, 18] },
        note: "Khoảng 2 phút, ~175 từ/phút. Giảng viên: giọng Mỹ (nam). Không có đoạn nghỉ.",
        lines: [
          { who: "Lecturer", voice: "us-nam", text: "I want to turn now to a technology that sounds almost too simple to take seriously: collecting drinking water from fog. Along certain coasts, especially where a cold ocean current runs beside a desert, there may be no rain for years. And yet, most mornings, a thick fog rolls in off the sea." },
          { who: "Lecturer", voice: "us-nam", text: "The idea of harvesting it usually gets credited to modern engineers. In fact, people living in those places had always known that on a foggy hillside, water drips from the leaves. What the engineers contributed, really, was a cheap imitation of a tree." },
          { who: "Lecturer", voice: "us-nam", text: "The device is just a large sheet of plastic mesh stretched between two poles. Now, you might expect the mesh to be very fine, like cloth, to catch as much as possible. It isn't. A fine mesh blocks the wind, and the fog simply flows around it. The mesh has to be coarse, open enough that the air goes straight through and leaves the droplets behind on the threads." },
          { who: "Lecturer", voice: "us-nam", text: "The droplets run down into a gutter, and from there a pipe carries the water down to the village. There's no pump. Because the nets are always up on the ridge, gravity does the work. And notice what that means: nothing in the system needs electricity. That, rather than the low price of the materials, is the reason it appeals to communities a long way from anywhere." },
          { who: "Lecturer", voice: "us-nam", text: "So much for the good news. The first projects were a technical success, and several of them were abandoned inside ten years all the same. When researchers went back to find out why, the nets hadn't worn out, and it wasn't that the money had dried up. It was maintenance. A storm would tear the mesh, and nobody in the village had been given the job of mending it." },
          { who: "Lecturer", voice: "us-nam", text: "The schemes that came later learned from that. They didn't start with the engineering at all. They started by setting up a local committee, with people named and trained to look after the nets, and only then did anyone put a pole in the ground." },
        ],
      },
      {
        t: "quiz",
        id: "t5d9-nghe-p4-dien",
        kind: "fill",
        title: "Questions 13–18 — ONE WORD ONLY",
        items: [
          { q: "13. the design copies the way a ___ collects fog", answers: ["tree"], hint: "“a cheap imitation of a tree” — copies = imitation (đổi loại từ). Câu chẻ: “What the engineers contributed… was…”." },
          { q: "14. the mesh must be ___", answers: ["coarse"], hint: "“you might expect the mesh to be very fine… It isn't… The mesh has to be coarse” — fine bị bác trước. Chính tả: coarse (thô, thưa), không phải course (khoá học) — hai từ đồng âm." },
          { q: "15. moved by ___", answers: ["gravity"], hint: "“There's no pump… gravity does the work.” pump là thứ KHÔNG có." },
          { q: "16. needs no ___", answers: ["electricity"], hint: "“nothing in the system needs electricity. That, rather than the low price of the materials, is the reason…” — X rather than Y: giá rẻ là phương án bị gạt. needs no = nothing… needs." },
          { q: "17. given up because of poor ___", answers: ["maintenance"], hint: "“the nets hadn't worn out, and it wasn't that the money had dried up. It was maintenance.” — hai lý do bị bác đứng ngay trước đáp án (cùng kiểu câu 39 Đề 9). given up = abandoned. Chính tả: maint**e**nance." },
          { q: "18. setting up a local ___", answers: ["committee"], hint: "“They didn't start with the engineering… They started by setting up a local committee.” Chính tả: co**mm**i**tt**ee (hai m, hai t, hai e)." },
        ],
      },
      {
        t: "table",
        head: ["Đúng / 18", "Đánh giá", "Việc cần làm"],
        rows: [
          ["17–18", "bạn đã có phản xạ với câu tín hiệu", "sang Bài tập; Ngày 15 học bẫy số liệu và phủ định kép"],
          ["14–16", "band 7.5", "nghe lại, bật lời thoại, gạch dưới mọi câu thuộc bốn kiểu ở mục 6"],
          ["≤ 13", "chưa vững", "nghe lại Part 2 và Part 3 của Đề 9 với lời thoại; đọc to câu tín hiệu theo người nói (shadowing) 10 phút"],
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Hai phút kiểm — bản dành cho Đề 9" },
      {
        t: "table",
        head: ["#", "Soát gì", "Ví dụ từ Đề 9 và bài hôm nay"],
        rows: [
          ["1", "Tên riêng: đủ chữ cái, viết hoa", "Thibault · Pfeiffer"],
          ["2", "Số: đúng đơn vị in sẵn; không kèm ký hiệu đã in", "26 (không viết £26 nếu £ đã in) · 12 months"],
          ["3", "Số ít / số nhiều theo ngữ pháp quanh ô", "cities · collectors · mothers · logs"],
          ["4", "Loại từ sau mạo từ / giới từ", "make a contribution · by gravity"],
          ["5", "Từ đồng âm, chính tả khó", "coarse · maintenance · committee · spreadsheet (viết liền)"],
          ["6", "Giới hạn từ", "ONE WORD ONLY ⇒ không viết “scale card”"],
        ],
      },

      /* ── 11 ── */
      { t: "h", text: "11. Từ vựng hữu ích từ ba bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "reckon", pos: "v", ipa: "/ˈrekən/", vi: "cho rằng, đoán (văn nói — Anh, Úc, NZ)", ex: "My neighbour reckons the tree is twenty metres tall.", exVi: "Hàng xóm tôi cho rằng cái cây cao hai mươi mét.", more: "I reckon… = I think… — tự nhiên trong Speaking; không dùng trong Writing" },
          { w: "coarse", pos: "adj", ipa: "/kɔːs/", vi: "thô, to sợi / to hạt (không mịn)", ex: "Use coarse sand for concrete and fine sand for plaster.", exVi: "Dùng cát hạt to cho bê tông, cát mịn cho vữa trát.", more: "coarse ↔ fine · ⚠️ đồng âm với course /kɔːs/ — khi nghe phải dựa vào ngữ cảnh (The mesh has to be coarse)" },
          { w: "settle", pos: "v", ipa: "/ˈsetl/", vi: "quyết định dứt khoát (một lựa chọn)", ex: "That's not what settled it; the data did.", exVi: "Đó không phải điều quyết định; dữ liệu mới là thứ quyết định.", more: "That settles it. = Thế là xong. · settle on sth = chốt chọn" },
          { w: "speak for itself", pos: "phrase", ipa: "/spiːk fər ɪtˈself/", vi: "tự nó đã nói lên tất cả, không cần giải thích", ex: "The drop in complaints speaks for itself.", exVi: "Số lời phàn nàn giảm đã tự nói lên tất cả.", more: "the figures / results speak for themselves · trong bài nghe: The drop after week six would speak for itself" },
          { w: "a way in", pos: "phrase", ipa: "/ə weɪ ɪn/", vi: "đường vào, mối quen để tiếp cận (một nhóm, một nơi)", ex: "My cousin works at the hospital, so we had a way in for the interviews.", exVi: "Anh họ tôi làm ở bệnh viện nên chúng tôi có đường vào để phỏng vấn.", more: "trong bài nghe: Mere's on the committee of the rowing club, so we had a way in · nghĩa đen: lối vào" },
          { w: "mesh", pos: "n", ipa: "/meʃ/", vi: "lưới (mắt lưới đan)", ex: "A coarse mesh lets the wind through.", exVi: "Lưới thưa cho gió đi qua.", more: "fine mesh ↔ coarse mesh · wire mesh" },
          { w: "gutter", pos: "n", ipa: "/ˈɡʌtə/", vi: "máng hứng nước", ex: "The droplets run down into a gutter.", exVi: "Các giọt nước chảy xuống máng.", more: "ở Mỹ nói flap: nghe gần “gudder” (Ngày 1)" },
          { w: "dry up", pos: "phr v", ipa: "/draɪ ʌp/", vi: "cạn (tiền, nguồn cung)", ex: "The project ended when the funding dried up.", exVi: "Dự án kết thúc khi nguồn tiền cạn.", more: "funding / supplies / work dried up" },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Sổ lỗi Listening Đề 9: mỗi câu sai một dòng — **câu · loại bạn đoán ở Ngày 8 · loại thật (A · B · C1 · C2 · C3 · D · E) · cái bạn viết · câu chốt trong lời thoại · câu tín hiệu đứng trước nó**.",
          "Nghe lại Part 3 của Đề 9 một lần KHÔNG nhìn câu hỏi, chỉ làm một việc: mỗi lần Dr Brennan bác hoặc duyệt một ý, gõ nhẹ xuống bàn. Bạn sẽ đếm được khoảng mười lần.",
          "Mổ Writing và Speaking Đề 9: **Ngày 10**.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 9 ═══════════════════════════ */
  {
    id: "t5d9-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 9 — song song · chủ ngữ treo · so sánh Task 1 · dấu câu · headings + YNNG · nghe câu tín hiệu · trang sổ lỗi Đề 9",
    goal: "Ôn trọn Ngày 9: sửa được câu gãy song song và câu có chủ ngữ treo, viết đúng phép so sánh Task 1, đặt đúng chấm phẩy và hai chấm, làm một bài đọc ngắn có tiêu đề trừu tượng và YNNG, nghe một tin nhắn thoại có năm lần sửa thông tin, và hoàn thành trang sổ lỗi Reading + Listening của Đề 9.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        items: [
          "44 câu, khoảng 45 phút. Mục tiêu band 8: **≥ 39/44**.",
          "Phần I–V ôn Bài 1; phần VI ôn Bài 2; phần VII–VIII ôn Bài 3. Sai phần nào, quay lại đúng mục ghi ở tiêu đề phần đó.",
          "Phần IX không chấm điểm nhưng là phần quan trọng nhất của ngày mổ đề: **trang sổ lỗi Đề 9**.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 9 trong một hình",
        center: "Mổ Đề 9 ①",
        branches: [
          { label: "Song song", items: ["A, B and C", "not only X but also X", "than that of / those in", "nhắc lại that · to · giới từ"] },
          { label: "Chủ ngữ treo", items: ["V-ing · V3 · To V", "As a… · Unlike…", "At the age of… → When I was…"] },
          { label: "Reading", items: ["5 nhãn R1–R5", "YNNG: ý của ai?", "Headings: vai trò của đoạn"] },
          { label: "Listening", items: ["loại A–E, C tách ba", "bác rồi mới nói", "ai nói · thì nào"] },
        ],
      },

      { t: "h", text: "I. Song song — gõ lại phần [trong ngoặc] (8 câu) — ôn Bài 1 mục 2 · 3 · 5" },
      {
        t: "quiz",
        id: "t5d9-bt-song-song",
        kind: "fill",
        title: "I. Sửa cho song song",
        items: [
          { q: "The internship taught me to write clear emails, to manage my time and [working] in a team.", answers: ["to work", "work"], hint: "to write, to manage and to work." },
          { q: "The new stadium is expensive, badly located and [nobody needs it].", answers: ["unnecessary", "unneeded", "unwanted"], hint: "ba tính từ." },
          { q: "The charity not only provides meals but also [it offers] legal advice.", answers: ["offers"], hint: "not only V but also V — bỏ chủ ngữ." },
          { q: "Customers can complain either by phone or [they can write an email].", answers: ["by email", "by e-mail"], hint: "either by… or by…" },
          { q: "The success of the scheme depends not on money but [how well it is managed].", answers: ["on how well it is managed", "on management", "on good management"], hint: "not on X but on Y." },
          { q: "The manager explained that sales had fallen and [the shop would close] in June.", answers: ["that the shop would close"], hint: "that… and that…" },
          { q: "Most residents are opposed [and worried about] the new road.", answers: ["to and worried about"], hint: "opposed TO · worried ABOUT — mỗi tính từ một giới từ." },
          { q: "She would rather rent a small flat in the centre than [buying] a large house in the suburbs.", answers: ["buy"], hint: "would rather V than V." },
        ],
      },

      { t: "h", text: "II. Chủ ngữ treo và bổ ngữ đặt sai chỗ (6 câu) — ôn Bài 1 mục 6 · 7" },
      {
        t: "mcq",
        id: "t5d9-bt-treo",
        title: "II. Chọn câu ĐÚNG và rõ",
        items: [
          { q: "1.", options: ["Having grown up in the countryside, city traffic terrified me.", "Having grown up in the countryside, I was terrified by city traffic.", "Having grown up in the countryside, there was terror in city traffic.", "Having grown up in the countryside, my fear of city traffic was great."], correct: 1, why: "Người lớn lên ở quê là I. Câu 4 treo kín: chủ ngữ là my fear." },
          { q: "2.", options: ["To qualify for the grant, an application must be received by 1 May.", "To qualify for the grant, the form has a deadline of 1 May.", "To qualify for the grant, applicants must apply by 1 May.", "To qualify for the grant, 1 May is the deadline."], correct: 2, why: "Người “qualify” là applicants ⇒ để applicants làm chủ ngữ." },
          { q: "3.", options: ["As a child, summers seemed endless.", "As a child, my summers seemed endless to me.", "As a child, I thought summers would never end.", "As a child, there were endless summers."], correct: 2, why: "As a child = I." },
          { q: "4.", options: ["Unlike the previous survey, the response rate was high this time.", "Unlike the previous survey, this one had a high response rate.", "Unlike the previous survey, many people responded this time.", "Unlike the previous survey, there was a high response rate."], correct: 1, why: "So khảo sát với khảo sát: the previous survey ↔ this one." },
          { q: "5. (Ý: chỉ sinh viên năm cuối mới được mượn laptop.)", options: ["Final-year students can only borrow laptops.", "Final-year students only can borrow laptops.", "Only final-year students can borrow laptops.", "Final-year students can borrow only laptops."], correct: 2, why: "Only đứng ngay trước final-year students. Câu 1 và 4 = chỉ mượn được laptop (không mượn được thứ khác)." },
          { q: "6. (Ý: việc tăng giá vé làm hành khách tức giận.)", options: ["The company raised fares on the airport line, which angered passengers.", "The company raised fares on the airport line, a move that angered passengers.", "The company which angered passengers raised fares on the airport line.", "The company raised fares, which is on the airport line, angering."], correct: 1, why: "a move that… chỉ rõ cả việc tăng giá. Câu 1: which đứng sát the airport line." },
        ],
      },

      { t: "h", text: "III. So sánh trong Task 1 — điền cụm còn thiếu (5 câu) — ôn Bài 1 mục 4" },
      {
        t: "quiz",
        id: "t5d9-bt-so-sanh",
        kind: "fill",
        title: "III. Gõ lại phần [trong ngoặc] cho đúng",
        items: [
          { q: "The birth rate of Country A was twice as high as [Country B].", answers: ["that of Country B", "that in Country B"], hint: "tỉ lệ ↔ tỉ lệ." },
          { q: "Wages in the capital were considerably higher than [rural areas].", answers: ["those in rural areas", "in rural areas"], hint: "số nhiều ⇒ those in; hoặc in ↔ in." },
          { q: "[Compared with 2000], car ownership had doubled by 2020.", answers: ["Compared with the 2000 figure", "Compared with the figure for 2000", "Compared with its 2000 level", "Compared with its level in 2000"], hint: "So tỉ lệ sở hữu xe với một con số, không phải với một năm." },
          { q: "Travelling by train is slower but far cheaper than [to fly].", answers: ["flying"], hint: "V-ing ↔ V-ing." },
          { q: "Unlike [the north], the population of the south grew steadily.", answers: ["that of the north"], hint: "Unlike that of…, the population of…" },
        ],
      },

      { t: "h", text: "IV. Dấu câu cho câu dài (4 câu) — ôn Bài 1 mục 8" },
      {
        t: "mcq",
        id: "t5d9-bt-dau-cau",
        title: "IV. Chọn cách chấm câu đúng",
        items: [
          { q: "1.", options: ["The scheme was popular, it was also expensive.", "The scheme was popular; it was also expensive.", "The scheme was popular: it, was also expensive.", "The scheme was popular it was also expensive."], correct: 1, why: "Hai mệnh đề độc lập, quan hệ chặt ⇒ chấm phẩy. Câu 1 là comma splice." },
          { q: "2.", options: ["Three factors explain the delay; funding, staffing and weather.", "Three factors explain the delay, funding, staffing and weather.", "Three factors explain the delay: funding, staffing and weather.", "Three factors explain: the delay funding, staffing and weather."], correct: 2, why: "Câu hoàn chỉnh + hai chấm + danh sách." },
          { q: "3.", options: ["The results were encouraging, nevertheless, the sample was small.", "The results were encouraging; nevertheless, the sample was small.", "The results were encouraging nevertheless; the sample was small.", "The results were encouraging: nevertheless the sample, was small."], correct: 1, why: "Chấm phẩy trước nevertheless, dấu phẩy sau." },
          { q: "4.", options: ["In the north, incomes rose; in the south, they fell.", "In the north, incomes rose, in the south, they fell.", "In the north; incomes rose, in the south; they fell.", "In the north incomes rose: in the south, they fell."], correct: 0, why: "Hai vế cùng khung, đối nghĩa ⇒ chấm phẩy ở giữa." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2–6" },
      {
        t: "quiz",
        id: "t5d9-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng từ trong gợi ý",
        grammar: "song song + cụm mở đầu có đúng chủ ngữ",
        items: [
          { q: "Làm việc từ xa không chỉ tiết kiệm thời gian mà còn giảm chi phí đi lại.", answers: ["Working remotely not only saves time but also reduces travel costs.", "Remote work not only saves time but also reduces travel costs.", "Working from home not only saves time but also reduces travel costs.", "Remote working not only saves time but also reduces travel costs."], hint: "not only + V… but also + V… · travel costs" },
          { q: "Chi phí sinh hoạt ở Singapore cao hơn nhiều so với ở Việt Nam.", answers: ["The cost of living in Singapore is much higher than that in Vietnam.", "The cost of living in Singapore is far higher than that in Vietnam.", "The cost of living in Singapore is much higher than in Vietnam.", "The cost of living in Singapore is far higher than in Vietnam.", "The cost of living in Singapore is much higher than that of Vietnam."], hint: "the cost of living · much / far higher than that in" },
          { q: "Là con cả, tôi phải trông các em sau giờ học.", answers: ["As the eldest child, I had to look after my siblings after school.", "As the eldest child, I had to look after my younger siblings after school.", "As the eldest child, I had to take care of my siblings after school.", "As the oldest child, I had to look after my siblings after school.", "As the eldest child, I had to look after my younger brothers and sisters after school."], hint: "As the eldest child, I… · look after · siblings" },
          { q: "Vấn đề không nằm ở công nghệ mà ở cách chúng ta dùng nó.", answers: ["The problem lies not in the technology but in the way we use it.", "The problem lies not in technology but in the way we use it.", "The problem lies not in the technology but in how we use it.", "The problem lies not in technology but in how we use it."], hint: "lie not in… but in…" },
          { q: "Kế hoạch này tốn kém; tuy nhiên, nó sẽ tạo ra hàng nghìn việc làm.", answers: ["The plan is expensive; however, it will create thousands of jobs.", "This plan is expensive; however, it will create thousands of jobs.", "The plan is costly; however, it will create thousands of jobs.", "This plan is costly; however, it will create thousands of jobs."], hint: "; however, · create thousands of jobs" },
        ],
      },

      { t: "h", text: "VI. Đọc — tiêu đề trừu tượng + YES / NO / NOT GIVEN (7 câu · 8 phút) — ôn Bài 2 mục 2 · 4" },
      {
        t: "passage",
        title: "The Humble Checklist",
        paras: [
          { label: "A", text: "In 1935, a new American bomber crashed during a demonstration flight, killing two of the men on board. Nothing was wrong with the aircraft: its pilot, one of the most experienced in the service, had simply forgotten to release a lock on the controls. The machine, one newspaper concluded, was too much aeroplane for one man to fly. The response of the test pilots was not to demand longer training. It was to write a list, short enough to fit on a card, of the steps that nobody could afford to forget." },
          { label: "B", text: "The checklist has since spread to operating theatres and building sites, and its record there is, by most accounts, a good one. What interests me is the resistance that it still meets. Experts, I suspect, object less to the minutes it takes than to what it implies: that memory and skill, of which they are justly proud, are not enough. To be handed a list is to be told that one might forget." },
          { label: "C", text: "The objection deserves a hearing, for a list can certainly be misused. One that grows to several pages will be ticked without being read, and one that is imposed by people who have never done the job will be quietly ignored. But these are arguments against bad lists, not against lists. A good one does not replace judgement; it protects judgement from the kind of error that judgement cannot detect in itself." },
        ],
      },
      {
        t: "table",
        caption: "List of Headings (hai tiêu đề thừa)",
        head: ["Số", "Heading"],
        rows: [
          ["i", "Why the skilled are reluctant"],
          ["ii", "How training took the place of the list"],
          ["iii", "A modest answer to a fatal lapse"],
          ["iv", "Limits that leave the case intact"],
          ["v", "The growing length of modern checklists"],
        ],
      },
      {
        t: "mcq",
        id: "t5d9-bt-doc",
        title: "VI. Questions 1–3: choose the heading · Questions 4–7: YES / NO / NOT GIVEN (claims of the writer)",
        items: [
          { q: "1. Paragraph A", options: ["i", "ii", "iii", "iv", "v"], correct: 2, why: "Tai nạn chết người do quên một thao tác (a fatal lapse) ⇒ câu trả lời khiêm tốn: một danh sách vừa một tấm thẻ (a modest answer). Bẫy ii: có chữ training, nhưng các phi công KHÔNG đòi huấn luyện thêm." },
          { q: "2. Paragraph B", options: ["i", "ii", "iii", "iv", "v"], correct: 0, why: "“the resistance that it still meets… Experts… object…” ⇒ vì sao người giỏi miễn cưỡng. the skilled = experts; reluctant = resistance." },
          { q: "3. Paragraph C", options: ["i", "ii", "iii", "iv", "v"], correct: 3, why: "Thừa nhận danh sách có thể bị dùng sai (limits) nhưng “these are arguments against bad lists, not against lists” (the case intact). Bẫy v: “grows to several pages” là một chi tiết, không phải ý cả đoạn." },
          { q: "4. The 1935 crash resulted from a human mistake rather than a mechanical fault.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“Nothing was wrong with the aircraft: its pilot… had simply forgotten…” ⇒ YES." },
          { q: "5. Experts dislike checklists chiefly because of the time they take.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“object less to the minutes it takes than to what it implies” ⇒ thời gian KHÔNG phải lý do chính ⇒ NO. Cấu trúc less to X than to Y (Bài 2 mục 2)." },
          { q: "6. The use of checklists in hospitals has reduced deaths during surgery by a large amount.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói thành tích “by most accounts, a good one” — không nói về số ca tử vong, không có con số. Kiến thức ngoài bài không được dùng ⇒ NOT GIVEN." },
          { q: "7. A well-designed checklist leaves professional judgement in place.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“A good one does not replace judgement; it protects judgement…” ⇒ YES. Hai vế nối bằng chấm phẩy." },
        ],
      },

      { t: "h", text: "VII. Nghe — một tin nhắn thoại có năm lần sửa thông tin (5 câu) — ôn Bài 3 mục 2 · 6" },
      {
        t: "p",
        text: "Một nhân viên trung tâm ngoại ngữ để lại lời nhắn. Đọc ghi chú trong 15 giây rồi nghe **một lần**. Write **ONE WORD OR A NUMBER** for each answer.",
      },
      {
        t: "table",
        head: ["Lakeview Language Centre — message", ""],
        rows: [
          ["Evening Spanish class — day", "**1** ……………"],
          ["Starts on", "**2** …………… March"],
          ["Fee", "$ **3** ……………"],
          ["Placement test", "a short **4** …………… by phone"],
          ["Classes held in", "the **5** ……………"],
        ],
      },
      {
        t: "listen",
        id: "t5d9-bt-nghe",
        title: "A voicemail from Lakeview Language Centre",
        dan: { so: "Day 9, Recording 4", boiCanh: "a voicemail message from a member of staff at a language centre.", cau: [1, 5] },
        note: "Khoảng 55 giây, ~170 từ/phút. Giọng Mỹ (nữ).",
        lines: [
          { who: "Carla", voice: "us-nu", text: "Hi, this is Carla from Lakeview Language Centre, returning your call about the evening Spanish course. You asked about the Tuesday class. That one's actually full now, but there's space in the Wednesday group, which is the same level." },
          { who: "Carla", voice: "us-nu", text: "It starts on the twelfth of March, not the fifth as it says on the website. We had to push it back a week." },
          { who: "Carla", voice: "us-nu", text: "The fee is two hundred and forty dollars. I know the leaflet says two sixty, but that included the textbook, and this term you buy the book yourself." },
          { who: "Carla", voice: "us-nu", text: "Before the first class, you'll need to do a placement test. People tend to assume that's a written paper. It isn't. It's a ten-minute interview, and we do it by phone." },
          { who: "Carla", voice: "us-nu", text: "Oh, and one more thing. We're not in the main building this term. We're in the annex, across the parking lot. OK, call me back if any of that's a problem. Bye now." },
        ],
      },
      {
        t: "quiz",
        id: "t5d9-bt-nghe-dien",
        kind: "fill",
        title: "VII. Questions 1–5 — ONE WORD OR A NUMBER",
        items: [
          { q: "1. Day of the class", answers: ["Wednesday"], hint: "Tuesday “is actually full now” ⇒ “the Wednesday group”. Viết hoa, chính tả: We**dn**esday." },
          { q: "2. Starts on ___ March", answers: ["12", "12th", "twelfth"], hint: "“the twelfth of March, not the fifth as it says on the website” — not X đứng SAU đáp án lần này." },
          { q: "3. Fee ($)", answers: ["240"], hint: "“two hundred and forty… the leaflet says two sixty” — 260 gồm cả sách." },
          { q: "4. a short ___ by phone", answers: ["interview"], hint: "“People tend to assume that's a written paper. It isn't. It's a ten-minute interview” — kiểu ① ở Bài 3 mục 6." },
          { q: "5. Classes held in the ___", answers: ["annex", "annexe"], hint: "“We're not in the main building… We're in the annex” — Mỹ: annex; Anh: annexe (cả hai được chấp nhận)." },
        ],
      },

      { t: "h", text: "VIII. Gắn nhãn lỗi (4 câu) — ôn Bài 2 mục 1 · Bài 3 mục 1" },
      {
        t: "mcq",
        id: "t5d9-bt-nhan",
        title: "VIII. Mỗi tình huống thuộc nhãn nào?",
        items: [
          { q: "1. Reading: bạn gạch đúng câu “owes more to its convenience than to its accuracy” nhưng chọn YES.", options: ["R1 — không tìm ra chỗ", "R2 — tìm đúng chỗ, hiểu sai paraphrase", "R4 — tự suy thêm", "R5 — hết giờ"], correct: 1, why: "Đúng chỗ, sai nghĩa của cấu trúc more X than Y ⇒ nhãn R2." },
          { q: "2. Reading: bạn chọn YES cho “Kuhn had studied the history of science in greater depth than Popper” vì từng đọc về Kuhn.", options: ["R1 — không tìm ra chỗ", "R2 — hiểu sai paraphrase", "R3 — rơi bẫy trùng chữ", "R4 — dùng kiến thức ngoài bài"], correct: 3, why: "Bài không so sánh hai người; bạn dùng điều mình biết ⇒ nhãn R4." },
          { q: "3. Listening: bạn viết “29” cho giá một đêm vì nghe khách nhẩm “twenty-nine times sixteen”.", options: ["D — lạc chỗ", "C1 — viết phương án bị bác", "C2 — nhầm người nói", "B — nghe ra, viết sai"], correct: 1, why: "Nghe rõ, nhưng đó là con số chưa chốt ⇒ loại C1." },
          { q: "4. Listening: bạn nghe đúng nhưng viết “contribute” vào ô “make a ___ to research”.", options: ["C1 — phương án bị bác", "C2 — nhầm thì", "B — nghe ra, viết sai (dạng từ)", "C3 — paraphrase"], correct: 2, why: "Sau make a cần danh từ: contribution ⇒ loại B. Hai phút kiểm cuối sinh ra để bắt lỗi này." },
        ],
      },

      { t: "h", text: "IX. Trang sổ lỗi Đề 9 — Reading + Listening (không chấm điểm, bắt buộc làm)" },
      {
        t: "table",
        head: ["Câu", "Nhãn", "Bạn chọn / viết", "Chữ quyết định trong bài / lời thoại", "Rút ra (một dòng)"],
        rows: [
          ["R32", "R2", "YES", "owes more to its convenience than to its accuracy", "more X than Y = không phải Y"],
          ["L5", "C1", "29", "long-stay rate… £26 a night", "chờ người bán nói giá cuối"],
          ["…", "…", "…", "…", "…"],
        ],
        caption: "Mẫu — kẻ bảng này vào vở hoặc mục Sổ lỗi; mỗi câu sai (và mỗi câu đúng nhờ đoán) một dòng",
      },
      {
        t: "note",
        title: "📌 Ba con số cần ghi ở cuối trang",
        items: [
          "Reading: nhãn nào nhiều nhất (R1–R5)? Listening: loại nào nhiều nhất (A · B · C1 · C2 · C3 · D · E) — có khớp với loại bạn đoán ở Ngày 8 không?",
          "Số câu sai ở Part 1 Listening và Passage 1 Reading — hai phần “không được phép mất”. Mục tiêu Đề 10: tổng hai phần này ≤ 2.",
          "Ngày bạn sẽ làm lại các câu sai (sau 7 ngày) — ghi ngày cụ thể.",
        ],
      },
    ],
  },
];
