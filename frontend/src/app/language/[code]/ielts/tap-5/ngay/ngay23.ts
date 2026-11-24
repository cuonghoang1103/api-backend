/**
 * IELTS Tập 5 — Ngày 23 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, đoạn soát lỗi, hội thoại, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Bảng tự soát 6 lượt — LẦN 3 (band 8): giữ đúng 6 lượt của Tập 3 Ngày 27 (lần 1) và Tập 4 Ngày 21 (lần 2), mỗi
 *                     lượt thêm những lỗi “biết mà vẫn sót” của người band 7.5 — động từ tường thuật + từ định lượng · danh từ trừu
 *                     tượng + danh hoá quá đà + which chỉ cả mệnh đề · so sánh thiếu vế + vị trí only + song song · tham chiếu mơ hồ
 *                     + rào đón quá liều · 18 từ hay sai chính tả. Bản 4 phút trong phòng thi (“3 + 2”, lượt của tôi lấy từ sổ lỗi
 *                     Đề 9 · Đề 10 · kiểm tra chặng 3), đoạn band 7.5 có đúng 10 lỗi, và tự sửa khi NÓI.                   [G43]
 *                     — nối Tập 3 Ngày 27 · Tập 4 Ngày 21 · Tập 5 Ngày 1 (hedging) · 3 · 9 · 13 · 15 · 17 · 19
 *   Bài 2 (reading)   Suy luận band 8 & bẫy cuối [R19 R05]: thang năm mức “nói thẳng → buộc phải suy ra → chỉ có thể đúng → kiến
 *                     thức ngoài”, năm dạng câu suy luận, TÁM bẫy cuối; khởi động 6 câu; bài chính “Phantom Entries” (~960 từ) —
 *                     YNNG 1–5 · MCQ 6–9 · Sentence endings 10–13, chấm bằng số bẫy.
 *                     — nối Tập 5 Ngày 3 (TFNG band 8, chẻ vế) · Ngày 9 (YNNG) · Ngày 17 (mổ Đề 10, thang 4 mức paraphrase) · Ngày 19
 *   Bài 3 (speaking)  Part 3 phản biện giám khảo khéo [S06]: phần BA của chuỗi phản biện (Ngày 6 = khi giám khảo đẩy ngược; Ngày 18 = đẩy
 *                     hai lần, diễn giải sai). Hôm nay: khi CHÍNH CÂU HỎI có cài bẫy — tiền đề ngầm, hai lựa chọn giả, khái quát quá
 *                     rộng, câu hỏi giá trị, ca cực đoan — năm nước đi, và luật “một câu gỡ, rồi PHẢI trả lời”. 🔊 nối âm chuỗi band 8
 *                     trong cụm phản biện (C + V, nuốt t/d, r / w / j chen).
 *   Bài tập Ngày 23   32 câu có đáp án + 1 đoạn viết tự soát + 3 câu nói
 * Mọi id bắt đầu `t5d23-`. Đã grep tap-3…5/ngay + thi-may/de: trap street / Agloe / Mountweazel / fictitious entry / phone directory
 * = 0 kết quả (lighthouse đã dùng nhiều nơi ⇒ KHÔNG dùng). Dữ kiện có thật trong bài đọc (soạn theo trí nhớ, làm tròn / làm mờ):
 * Agloe — thị trấn ma trên bản đồ bang New York thập niên 1930 của General Drafting, tên ghép từ chữ cái đầu tên hai người làm bản đồ;
 * sau đó có cửa hàng lấy tên Agloe ở đúng chỗ ấy; mục từ Lillian Virginia Mountweazel trong New Columbia Encyclopedia (1975); từ
 * “esquivalience” trong một từ điển Mỹ (2005) bị phát hiện năm đó; vụ Feist kiện Rural (Toà án Tối cao Mỹ, 1991): danh bạ có mục giả
 * vẫn thua vì danh sách tên – số không đủ tính sáng tạo để được bảo hộ. Chỗ không chắc viết dạng “in the 1930s / reportedly”.
 * Nhân vật trong đoạn soát lỗi, hội thoại và bài tập là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_23: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d23-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Bảng tự soát 6 lượt — lần 3 (band 8): từ “ít lỗi” đến “lỗi 0–1 mỗi bài”",
    goal: "Soát một bài Task 2 theo đúng 6 lượt đã học với những lỗi tinh mà người band 7.5 vẫn sót (động từ sau từ định lượng, danh từ trừu tượng, so sánh thiếu vế, tham chiếu mơ hồ, rào đón quá liều, chính tả), dựng được bản soát 4 phút “3 + 2” của riêng mình từ sổ lỗi, và tự sửa khi nói một lần, gọn, không làm đứt mạch.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA 7 → 8**. Bảng mô tả band 8: ==đa số câu không lỗi, chỉ thỉnh thoảng sai nhỏ==. Đếm thực tế: một bài 280 từ có từ 3 lỗi trở lên là đã tụt về 7. Đích của Tập 5: **0–1 lỗi mỗi bài**.",
          "Lỗi của người band 7.5 không còn là lỗi **không biết** mà là lỗi **biết nhưng sót** — bạn biết the number of đi với is, nhưng đến câu thứ 11 thì quên. Lỗi kiểu này chỉ bắt được bằng soát có hệ thống.",
          "**6 lượt giữ nguyên thứ tự** của Tập 3 Ngày 27 (lần 1) và Tập 4 Ngày 21 (lần 2): Động từ → Danh từ → Ranh giới câu → Song song + từ loại → Liên kết → Chính tả + đề. Lần 3 thêm vào mỗi lượt những lỗi tinh của band 7.5.",
          "Phòng thi không có 15 phút: bản **“3 + 2” trong 4 phút** — ba lượt chung + hai **lượt của tôi** lấy từ sổ lỗi Đề 9, Đề 10 và bài kiểm tra chặng 3.",
          "Cuối bài: một đoạn band 7.5 có ==đúng 10 lỗi== để luyện, và cách **tự sửa khi nói** mà không mất điểm FC.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Kiểm tra đầu bài — ôn Tập 5 Ngày 9 · 17 · 19 (6 câu)" },
      { t: "p", text: "Ba phút, không mở lại bài cũ. Sai câu nào thì đọc lại đúng mục ghi trong 💡 — bài hôm nay dựng trên những mục ấy." },
      {
        t: "quiz",
        id: "t5d23-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — điền MỘT từ hoặc gõ lại phần [trong ngoặc] (6 câu)",
        items: [
          { q: "1. [An evidence] from several countries suggests that the policy has worked. — gõ lại phần trong ngoặc", answers: ["Evidence"], hint: "evidence không đếm được ⇒ không a / an, không -s; nói chung ⇒ không the (Tập 5 Ngày 17 mục 2–3)." },
          { q: "2. There has been a sharp rise [of] the number of applications.", answers: ["in"], hint: "a rise IN + chỉ số (Tập 5 Ngày 3 mục 5 · Ngày 17 mục 4)." },
          { q: "3. The report recommends that every hospital [publishes] its waiting times.", answers: ["publish", "should publish"], hint: "Thức giả định sau recommend that: động từ nguyên mẫu trần (Tập 5 Ngày 19 mục 4)." },
          { q: "4. [Walking through the old town, the cathedral] comes into view. — viết lại phần đầu câu để không còn chủ ngữ treo, bắt đầu bằng “As you walk through the old town,”", answers: ["As you walk through the old town, the cathedral", "As you walk through the old town, the cathedral comes into view"], hint: "Chủ ngữ treo — cụm V-ing phải có chủ ngữ là người làm (Tập 5 Ngày 9)." },
          { q: "5. The plan is cheap; [however] it is unpopular. — gõ lại cả cụm có dấu câu đúng", answers: ["however,"], hint: "; however, — phẩy SAU however (Tập 5 Ngày 19 mục 5)." },
          { q: "6. The scheme aims to help people who are long term unemployed. — tính từ ghép đứng trước danh từ: “the ___ unemployed”", answers: ["long-term"], hint: "Tính từ ghép đứng trước danh từ có gạch nối (Tập 4 Ngày 21 · Tập 5 Ngày 19 mục 5)." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Lần 3 khác gì — sáu lượt cũ, mỗi lượt thêm một tầng" },
      {
        t: "p",
        text: "Hai lần trước bạn đã có bảng 6 lượt. Lần 1 bắt lỗi **cơ bản** (thì, số nhiều, câu cụt). Lần 2 thêm lỗi của **band 7** (giới từ sau danh từ, collocation, register). Lần 3 không thêm lượt mới — thêm vào ==mỗi lượt những lỗi mà chính người viết khá vẫn để lọt==. Lý do đơn giản: ở band 8, giám khảo không tìm lỗi lớn nữa, vì không còn; họ đếm lỗi nhỏ.",
      },
      {
        t: "table",
        head: ["Lượt", "Lần 1–2 đã có", "Thêm ở lần 3 (band 8)", "Ôn ở"],
        rows: [
          ["1 · ĐỘNG TỪ", "thì nhất quán · chủ – vị · bị động · động từ theo danh từ đầu của cụm danh hoá", "động từ **tường thuật** đúng thì · động từ sau **từ định lượng** (each of, a number of, the majority of, one in five) · thì trong câu giả định và điều kiện ngầm", "mục 2 · T5 N19"],
          ["2 · DANH TỪ", "mạo từ · số nhiều · giới từ sau danh từ", "danh từ **trừu tượng** chung chung không có the · danh hoá **quá đà** (> 2 cụm / câu)", "mục 3 · T5 N17"],
          ["3 · RANH GIỚI CÂU", "comma splice · ; however, · : sau câu đủ · its / it's", "**which** chỉ cả mệnh đề cần phẩy · không phẩy giữa chủ ngữ dài và động từ", "mục 3 · T5 N19"],
          ["4 · SONG SONG + TỪ LOẠI", "and / or / than cùng dạng · collocation · dangling", "**so sánh thiếu vế** (than **that of**) · vị trí của **only** · not only… but also / both… and song song", "mục 4 · T5 N9"],
          ["5 · LIÊN KẾT", "từ nối đúng vai · register · rào đón", "**tham chiếu mơ hồ** (this trơ, it / they chỉ hai thứ, his cho người chung chung) · rào đón **quá liều** · cấu trúc nhấn quá 4 cái", "mục 5 · T5 N1 · N13 · N15"],
          ["6 · CHÍNH TẢ + ĐỀ", "từ hay sai · đủ từ · đủ vế đề · lập trường giữ suốt bài", "**18 từ** người band 7.5 hay sai · Anh – Anh hay Anh – Mỹ **thống nhất** · câu cuối có còn trả lời đúng câu hỏi?", "mục 6 · T5 N4"],
        ],
        caption: "Bảng tự soát 6 lượt — lần 3",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ — vì sao vẫn phải tách lượt",
        items: [
          "Đọc lại một lần “xem có gì sai không” thì não đọc **ý**, không đọc **chữ** — và nó tự sửa lỗi của bạn trong đầu mà không sửa trên giấy.",
          "Mỗi lượt mắt chỉ tìm **một loại** dấu hiệu: lượt 1 chỉ nhìn động từ, lượt 3 chỉ nhìn dấu câu. Nhanh hơn đọc tổng, và bắt được nhiều hơn.",
          "Lỗi bạn hay mắc **nhất** không nằm ở lượt nào cố định — nó là “lượt của tôi” (mục 7).",
        ],
      },
      { t: "rule", formula: "Động từ → Danh từ → Ranh giới câu → Song song + từ loại → Liên kết → Chính tả + đề", vi: "Thứ tự không đổi qua ba lần; lần 3 chỉ thêm vào mỗi lượt những lỗi tinh của band 7.5." },

      /* ── 2 ── */
      { t: "h", text: "2. Lượt 1 band 8 — động từ tường thuật và động từ sau từ định lượng" },
      {
        t: "p",
        text: "Hai chỗ động từ hay sai nhất ở bài band 7.5: **động từ tường thuật** (study, research, report) chia sai thì, và **động từ sau từ định lượng** chia theo danh từ gần nhất thay vì theo đúng quy tắc của từ định lượng.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "A study / The 2019 survey + V-ed (found / showed)", vi: "Một nghiên cứu CỤ THỂ, đã xong ⇒ quá khứ.", examples: [{ en: "A large survey in 2019 found that most commuters would cycle if the roads felt safer.", vi: "Một khảo sát lớn năm 2019 cho thấy đa số người đi làm sẽ đạp xe nếu đường thấy an toàn hơn." }] },
          { formula: "Research / Studies + have / has V3 (have shown)", vi: "Cả một khối nghiên cứu tích luỹ tới nay ⇒ hiện tại hoàn thành.", examples: [{ en: "Research has repeatedly shown that sleep affects how well we learn.", vi: "Nghiên cứu nhiều lần cho thấy giấc ngủ ảnh hưởng đến việc ta học tốt đến đâu." }] },
          { formula: "Some economists argue / The report suggests + that S V", vi: "Một lập luận còn đứng trên giấy ⇒ hiện tại đơn (thì của văn học thuật).", examples: [{ en: "Some economists argue that the tax hurts small firms most.", vi: "Một số nhà kinh tế cho rằng loại thuế này gây hại cho doanh nghiệp nhỏ nhất." }] },
          { formula: "Each of / Every one of / Neither of + N số nhiều + V số ít", vi: "Chủ ngữ thật là each / one / neither.", examples: [{ en: "Each of the proposals has its merits, but neither of them addresses the cost.", vi: "Mỗi đề xuất đều có cái hay, nhưng không đề xuất nào giải quyết chi phí." }] },
          { formula: "The majority of / Most of / Half of + N số nhiều → V số nhiều · + N không đếm được → V số ít", vi: "Động từ theo danh từ sau of.", examples: [{ en: "The majority of the funding goes to cities, while the majority of residents live outside them.", vi: "Phần lớn kinh phí đổ về thành phố, trong khi phần lớn cư dân sống ngoài thành phố." }] },
        ],
      },
      {
        t: "table",
        head: ["Từ định lượng", "Động từ", "Ví dụ đúng"],
        rows: [
          ["each of · every one of · neither of · either of · one of", "số ít", "One of the main problems **is** cost."],
          ["a number of + N số nhiều", "số nhiều", "A number of schools **have** closed."],
          ["the number of + N số nhiều", "số ít", "The number of schools **has** fallen."],
          ["the majority of · most of · half of · a third of + N số nhiều", "số nhiều", "Half of the students **work** part-time."],
          ["the same + N không đếm được", "số ít", "Half of the land **is** unused."],
          ["one in five · one in ten + N số nhiều", "số ít (an toàn nhất trong bài viết)", "One in five adults **reads** no books a year."],
          ["a lot of / plenty of", "theo danh từ sau of — nhưng KHÔNG dùng trong Task 2", "→ many / much / a large proportion of"],
        ],
        caption: "Động từ sau từ định lượng — tra nhanh",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn lỗi động từ band 7.5 vẫn mắc",
        items: [
          "~~A 2020 study has found that…~~ — nghiên cứu có năm cụ thể ⇒ **found**. Hiện tại hoàn thành chỉ cho khối nghiên cứu chung (research has found).",
          "~~Every one of these measures are expensive.~~ → **is**. Mắt bị danh từ số nhiều đứng sát động từ (measures) đánh lừa.",
          "~~The number of cars on the roads have doubled.~~ → **has**. Lần 1 đã học, lần 3 vẫn sót — vì giữa number và động từ có năm chữ.",
          "Đổi thì giữa đoạn không có lý do: đoạn đang ở hiện tại (Many people believe…) bỗng sang quá khứ (…and this caused…). Nếu là quá khứ thật, có mốc thời gian đi kèm.",
        ],
      },
      { t: "rule", formula: "nghiên cứu cụ thể → V-ed · khối nghiên cứu → has / have V3 · lập luận → V hiện tại  ·  each / one / neither / the number of → V số ít", vi: "Lượt 1 lần 3: khoanh mọi động từ tường thuật và mọi từ định lượng, kiểm riêng hai nhóm này." },
      {
        t: "quiz",
        id: "t5d23-luot-1",
        kind: "fill",
        title: "Lượt 1 — viết dạng đúng của động từ trong ngoặc (6 câu)",
        items: [
          { q: "1. A survey carried out in 2021 ___ (show) that most teenagers sleep less than eight hours.", answers: ["showed"], hint: "Nghiên cứu có năm cụ thể ⇒ quá khứ." },
          { q: "2. Over the past decade, research ___ (consistently / suggest) that green space reduces stress. — gõ cả trạng từ", answers: ["has consistently suggested"], hint: "Khối nghiên cứu tới nay ⇒ has + trạng từ + V3." },
          { q: "3. Neither of the two candidates ___ (have) any experience in government.", answers: ["has"], hint: "neither of + N số nhiều ⇒ V số ít." },
          { q: "4. The majority of the waste ___ (end) up in landfill.", answers: ["ends"], hint: "waste không đếm được ⇒ V số ít." },
          { q: "5. A number of residents ___ (complain) about the noise since the airport expanded.", answers: ["have complained"], hint: "a number of + N số nhiều ⇒ V số nhiều; since ⇒ hiện tại hoàn thành." },
          { q: "6. Some critics ___ (argue) that the museum should charge for entry.", answers: ["argue"], hint: "Lập luận còn đứng trên giấy ⇒ hiện tại đơn." },
        ],
      },
      {
        t: "quiz",
        id: "t5d23-luot-1-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — lượt 1 (4 câu)",
        grammar: "found / has shown / argue · each of / the number of / one in five + V số ít",
        items: [
          { q: "Một nghiên cứu năm 2018 cho thấy học sinh nhớ bài tốt hơn sau khi ngủ đủ giấc.", answers: ["A 2018 study found that students remember lessons better after a good night's sleep.", "A study in 2018 found that students remember lessons better after sleeping well.", "A 2018 study showed that students remember lessons better after a good night's sleep.", "A 2018 study found that students remembered lessons better after a good night's sleep."], hint: "a 2018 study · found" },
          { q: "Mỗi phương án trong số này đều có rủi ro.", answers: ["Each of these options carries risks.", "Each of these options has risks.", "Each of these options carries a risk.", "Each of these options involves risks.", "Each of these options has its risks."], hint: "each of + N số nhiều + V số ít" },
          { q: "Số người làm việc tại nhà đã tăng gấp ba kể từ năm 2019.", answers: ["The number of people working from home has tripled since 2019.", "The number of people who work from home has tripled since 2019.", "The number of people working from home has trebled since 2019."], hint: "the number of · has tripled" },
          { q: "Cứ năm người trưởng thành thì có một người không có tài khoản ngân hàng.", answers: ["One in five adults does not have a bank account.", "One in five adults has no bank account.", "One in five adults doesn't have a bank account.", "One in every five adults does not have a bank account."], hint: "one in five + V số ít" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Lượt 2 + 3 band 8 — danh từ trừu tượng, danh hoá quá đà, which chỉ cả mệnh đề" },
      {
        t: "p",
        text: "Tập 5 Ngày 17 đã đóng chuỗi lỗi mạo từ – số nhiều – giới từ – dấu phẩy, Ngày 19 đã đóng tám quy tắc dấu câu. Mục này chỉ thêm ==ba lỗi tinh mà hai ngày ấy chưa đóng== — cả ba đều là lỗi của người viết TỐT, vì người viết yếu chưa dùng tới những cấu trúc này.",
      },
      {
        t: "table",
        head: ["Lỗi tinh", "Sai", "Đúng", "Vì sao"],
        rows: [
          ["Danh từ trừu tượng nói CHUNG có the", "~~The technology has changed the society.~~", "Technology has changed society.", "Nói về công nghệ / xã hội nói chung ⇒ không mạo từ. Có the khi đã thu hẹp: **the technology used in hospitals** · **the society of the 1950s**."],
          ["Danh hoá quá đà", "~~The implementation of the reduction of emissions requires the cooperation of governments.~~", "Reducing emissions requires governments to cooperate.", "Quá hai cụm danh từ “the… of…” trong một câu ⇒ đổi một cụm về động từ. Band 8 = danh hoá **có chọn lọc** (Tập 4 Ngày 28)."],
          ["which chỉ CẢ mệnh đề không có phẩy", "~~Fares rose by 20% which reduced demand.~~", "Fares rose by 20%, which reduced demand.", "which chỉ cả việc “giá tăng” ⇒ bắt buộc phẩy. Không phẩy ⇒ đọc thành which chỉ “20%”."],
          ["which mơ hồ", "~~Car use fell in the city centre, which surprised planners.~~ (cái gì làm ngạc nhiên?)", "Car use fell in the city centre — **a change that** surprised planners.", "Khi which có thể chỉ hai thứ, thay bằng **a + danh từ tóm + that**."],
          ["Phẩy giữa chủ ngữ dài và động từ", "~~Students who work more than twenty hours a week, tend to get lower marks.~~", "Students who work more than twenty hours a week tend to get lower marks.", "Chủ ngữ dài đến đâu cũng không có phẩy trước động từ chính (Ngày 19 mục 5, quy tắc 1)."],
        ],
        caption: "Ba lỗi tinh của lượt 2 và lượt 3",
      },
      {
        t: "mcq",
        id: "t5d23-luot-23",
        title: "Lượt 2 + 3 — chọn câu đúng (6 câu)",
        items: [
          { q: "1. Câu nào đúng?", options: ["A  The education is the key to reducing the poverty.", "B  Education is the key to reducing poverty.", "C  Education is the key to reducing the poverty."], correct: 1, why: "Hai danh từ trừu tượng nói chung ⇒ không the." },
          { q: "2. Câu nào đúng?", options: ["A  The education of girls in rural areas has improved sharply.", "B  Education of the girls in rural areas has improved sharply.", "C  The education of the girls in the rural areas has improved sharply."], correct: 0, why: "the education OF girls — đã thu hẹp bằng of ⇒ có the. girls / rural areas vẫn là nói chung ⇒ không the." },
          { q: "3. Câu nào hợp với band 8 nhất?", options: ["A  The introduction of the restriction of the use of cars led to the improvement of air quality.", "B  Restricting car use led to an improvement in air quality.", "C  Restricting of car use led to improve air quality."], correct: 1, why: "A có năm cụm the… of… — quá đà. C sai từ loại. B: một danh động từ + một danh hoá." },
          { q: "4. Câu nào đúng?", options: ["A  The library extended its opening hours which pleased students.", "B  The library extended its opening hours, which pleased students.", "C  The library extended, its opening hours which pleased students."], correct: 1, why: "which chỉ cả việc “kéo dài giờ mở cửa” ⇒ có phẩy." },
          { q: "5. “Prices fell in the shops near the station, which delighted residents.” Cách viết lại rõ nghĩa nhất:", options: ["A  Prices fell in the shops near the station — a change that delighted residents.", "B  Prices fell in the shops near the station which delighted residents.", "C  Prices fell, in the shops near the station, which delighted residents."], correct: 0, why: "which có thể chỉ “cửa hàng” hoặc “việc giá giảm” ⇒ thay bằng a change that." },
          { q: "6. Câu nào đúng?", options: ["A  People who live more than an hour from a hospital, are less likely to be screened.", "B  People who live more than an hour from a hospital are less likely to be screened.", "C  People, who live more than an hour from a hospital are less likely to be screened."], correct: 1, why: "Không phẩy giữa chủ ngữ dài và động từ; mệnh đề xác định (who live…) cũng không có phẩy." },
        ],
      },
      { t: "rule", formula: "N trừu tượng nói chung → không the · ≤ 2 cụm “the… of…” / câu · , which = cả mệnh đề · which mơ hồ → a change that…", vi: "Lượt 2 và lượt 3 lần 3: ba lỗi của người viết tốt." },
      {
        t: "quiz",
        id: "t5d23-luot-23-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — lượt 2 + 3 (3 câu)",
        grammar: "danh từ trừu tượng không the · , which · a + N tóm + that",
        items: [
          { q: "Công nghệ đã làm thay đổi cách con người làm việc.", answers: ["Technology has changed the way people work.", "Technology has changed how people work.", "Technology has transformed the way people work.", "Technology has changed the way that people work."], hint: "technology (không the) · the way people work" },
          { q: "Thành phố cấm xe tải vào trung tâm, điều này làm giảm tiếng ồn rõ rệt.", answers: ["The city banned lorries from the centre, which reduced noise significantly.", "The city banned lorries from the centre, which significantly reduced noise.", "The city banned trucks from the centre, which reduced noise significantly.", "The city banned lorries from the centre, which reduced noise considerably.", "The city banned trucks from the center, which significantly reduced noise."], hint: ", which + V (chỉ cả mệnh đề)" },
          { q: "Lượng khách du lịch giảm một nửa — một thay đổi mà ít ai dự đoán được.", answers: ["Tourist numbers fell by half — a change that few people had predicted.", "Tourist numbers halved — a change that few people had predicted.", "Tourist numbers fell by half, a change that few people had predicted.", "The number of tourists fell by half — a change that few people had predicted.", "Tourist numbers fell by half — a change few people had predicted."], hint: "— a change that…" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Lượt 4 band 8 — so sánh đủ vế, vị trí của only, song song kép" },
      {
        t: "p",
        text: "Lượt 4 kiểm hai bên của một phép so sánh hoặc một cặp liên từ có **cùng loại**. Ba lỗi hay lọt ở band 7.5: ==so sánh hai thứ không cùng loại== (giá nhà ở A so với… thành phố B), ==only đặt sai chỗ== làm đổi nghĩa, và ==not only… but also / both… and== hai vế lệch dạng.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "N1 of A + V + comparative + than that of B (số ít) / those of B (số nhiều)", vi: "So sánh N1 của A với N1 của B — that / those thay cho N1.", examples: [{ en: "The cost of housing in the capital is far higher than that in other cities.", vi: "Chi phí nhà ở thủ đô cao hơn nhiều so với (chi phí nhà ở) các thành phố khác." }, { en: "The salaries of nurses have risen more slowly than those of doctors.", vi: "Lương y tá tăng chậm hơn lương bác sĩ." }] },
          { formula: "S + only + V + O → S + V + only + O (đặt only sát chữ nó giới hạn)", vi: "Trong bài viết, only đứng ngay trước từ / cụm bị giới hạn.", examples: [{ en: "The grant covers only tuition fees, not living costs.", vi: "Khoản trợ cấp chỉ chi trả học phí, không chi trả sinh hoạt phí." }] },
          { formula: "Not only does S V…, but S also V… / S not only V1 but also V2", vi: "Hai vế cùng dạng. Đảo ngữ khi Not only đứng đầu câu.", examples: [{ en: "The scheme not only cuts costs but also shortens waiting times.", vi: "Chương trình không chỉ giảm chi phí mà còn rút ngắn thời gian chờ." }] },
          { formula: "both A and B · either A or B · neither A nor B — A và B cùng từ loại", vi: "Song song kép.", examples: [{ en: "The policy is both expensive to run and difficult to enforce.", vi: "Chính sách vừa tốn kém để vận hành vừa khó thực thi." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — năm câu “gần đúng” của lượt 4",
        items: [
          "~~The cost of housing in the capital is higher than other cities.~~ → than **that in** other cities. Câu sai đem chi phí so với thành phố.",
          "~~Young people's spending on entertainment is higher than older people.~~ → than **that of** older people / than **older people's**.",
          "~~The grant only covers tuition fees.~~ — khi nói thì ổn; trong bài viết, câu có “not living costs” phía sau ⇒ đưa only về sát tuition fees.",
          "~~Not only it reduces costs, but also improves safety.~~ → **Not only does it reduce** costs, **but it also improves** safety.",
          "~~The policy is both expensive and it is hard to enforce.~~ → both **expensive** and **hard** to enforce (hai tính từ).",
        ],
      },
      { t: "rule", formula: "than that of / those of · only + từ bị giới hạn · not only V1 but also V2 · both adj and adj", vi: "Lượt 4 lần 3: kiểm hai bên của mọi than, only, not only, both, either." },
      {
        t: "quiz",
        id: "t5d23-luot-4-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — lượt 4 (4 câu)",
        grammar: "than that of / those of · only đúng chỗ · not only… but also · both… and",
        items: [
          { q: "Tỉ lệ thất nghiệp ở miền Bắc cao gấp đôi so với miền Nam.", answers: ["The unemployment rate in the north is twice as high as that in the south.", "The unemployment rate in the North is twice as high as that in the South.", "The rate of unemployment in the north is twice as high as that in the south.", "Unemployment in the north is twice as high as that in the south.", "The unemployment rate in the north is double that in the south."], hint: "twice as high as that in…" },
          { q: "Lương của giáo viên tăng chậm hơn lương của y tá.", answers: ["Teachers' salaries have risen more slowly than those of nurses.", "The salaries of teachers have risen more slowly than those of nurses.", "Teachers' salaries have increased more slowly than those of nurses.", "Teachers' salaries have risen more slowly than nurses' salaries.", "Teachers' salaries rose more slowly than those of nurses."], hint: "than those of nurses" },
          { q: "Vé giảm giá chỉ áp dụng cho sinh viên, không áp dụng cho giáo viên.", answers: ["The discount applies only to students, not to teachers.", "The discounted ticket applies only to students, not to teachers.", "Discounted tickets are available only to students, not to teachers.", "The discount applies only to students, not teachers."], hint: "only to students, not to teachers" },
          { q: "Kế hoạch này không chỉ tiết kiệm tiền mà còn giảm ô nhiễm.", answers: ["This plan not only saves money but also reduces pollution.", "Not only does this plan save money, but it also reduces pollution.", "The plan not only saves money but also reduces pollution.", "Not only does the plan save money, but it also reduces pollution."], hint: "not only V1 but also V2 / Not only does S V, but S also V" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Lượt 5 band 8 — tham chiếu mơ hồ và “liều” của rào đón, từ nối, cấu trúc nhấn" },
      {
        t: "p",
        text: "Lượt 5 ở lần 3 hỏi hai câu: ==mỗi this / it / they / their chỉ đúng MỘT thứ chưa?== và ==mỗi công cụ (rào đón, từ nối, cấu trúc nhấn) có đang dùng quá liều không?== Band 8 Coherence: “sequences information and ideas logically; manages all aspects of cohesion well”. Quá liều chính là quản lý kém.",
      },
      {
        t: "table",
        head: ["Vấn đề", "Quá liều / mơ hồ", "Vừa đủ (band 8)"],
        rows: [
          ["this trơ", "Many firms now let staff work from home. **This** has advantages.", "**This shift** has clear advantages. (this + danh từ tóm — Tập 5 Ngày 13)"],
          ["it / they chỉ hai thứ", "Parents often blame schools, but **they** are rarely consulted.", "…but **parents** are rarely consulted. (lặp danh từ, đừng sợ lặp)"],
          ["his cho người chung chung", "A student should be able to choose **his** subjects.", "Students should be able to choose **their** subjects."],
          ["rào đón chồng rào đón", "It **could perhaps possibly** be argued that this **may** help.", "It could be argued that this **would help** — một chỗ rào cho một nhận định (Tập 5 Ngày 1)."],
          ["từ nối đầu ba câu liền", "**Moreover**, … **Furthermore**, … **In addition**, …", "Một từ nối + nối bằng ý: **This cost**, in turn, … (Tập 4 Ngày 13)"],
          ["cấu trúc nhấn quá dày", "câu chẻ · đảo ngữ · What… is… trong ba câu liên tiếp", "≤ 4 cấu trúc nổi cả bài, rải ra (Tập 5 Ngày 13)"],
          ["register trượt", "**a lot of** · **kids** · **get** better", "a large number of · children · improve (Tập 5 Ngày 15)"],
        ],
        caption: "Lượt 5 lần 3 — rõ và đúng liều",
      },
      {
        t: "note",
        title: "💡 Mẹo — soát tham chiếu bằng ngón tay",
        items: [
          "Mỗi lần gặp this / that / it / they / their / which: đặt ngón tay lên nó, mắt chạy NGƯỢC lên tìm thứ nó chỉ. Tìm được **hai** ứng viên ⇒ sửa.",
          "Ở bài thi trên máy: bôi đen từ đó rồi nhìn lên câu trước — cùng động tác, không cần ngón tay.",
          "Đếm rào đón: mỗi câu tối đa **một** từ rào (may / tend to / arguably / it seems). Hai từ trong một câu ⇒ xoá một.",
        ],
      },
      { t: "rule", formula: "this + N tóm · lặp danh từ khi it / they có thể chỉ hai thứ · their cho người chung chung · một câu, một chỗ rào", vi: "Lượt 5 lần 3: mỗi đại từ chỉ đúng một thứ; mỗi công cụ đúng liều." },
      {
        t: "quiz",
        id: "t5d23-luot-5-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — lượt 5 (3 câu)",
        grammar: "this + danh từ tóm · their · một chỗ rào đón",
        items: [
          { q: "Nhiều trường đã bỏ bài kiểm tra cuối kỳ. Sự thay đổi này khiến một số phụ huynh lo lắng.", answers: ["Many schools have abolished final exams. This change has worried some parents.", "Many schools have dropped end-of-term tests. This change has worried some parents.", "Many schools have abolished final examinations. This change has worried some parents.", "Many schools have scrapped final exams. This change has worried some parents.", "Many schools have abolished final exams. This change has made some parents anxious."], hint: "This change (không dùng This trơ)" },
          { q: "Mỗi bệnh nhân nên được xem hồ sơ của chính mình.", answers: ["Patients should be able to see their own records.", "Every patient should be able to see their own records.", "Each patient should be allowed to see their own records.", "Patients should be allowed to see their own records.", "Every patient should be allowed to see their own records."], hint: "their own records" },
          { q: "Có thể lập luận rằng một khoản thuế như vậy sẽ gây hại cho người nghèo nhiều nhất.", answers: ["It could be argued that such a tax would hurt the poor most.", "It could be argued that such a tax would harm the poor most.", "It could be argued that such a tax would hit the poor hardest.", "It could be argued that such a tax would hurt poor people most.", "It could be argued that such a tax would harm the poorest most."], hint: "It could be argued that… would… (một chỗ rào)" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Lượt 6 band 8 — 18 từ hay sai chính tả và câu cuối có còn trả lời đề" },
      {
        t: "table",
        head: ["Từ", "Chỗ hay sai", "Cách nhớ"],
        rows: [
          ["accommodation", "cc · mm", "chỗ ở đủ rộng cho **hai c và hai m**"],
          ["acknowledge", "dg", "know + ledge"],
          ["argument", "không có e", "argue **bỏ e** rồi + ment"],
          ["commitment · committee", "commitment một t ở giữa · committee mm tt ee", "committee: **ba cặp đôi**"],
          ["conscientious", "sci", "con + science + tious"],
          ["definitely", "ite, không ate", "chứa chữ **finite**"],
          ["environment · government", "n trước m", "environ + ment · govern + ment"],
          ["maintenance", "ten, không tain", "maintain → main**ten**ance"],
          ["necessary · unnecessary", "1 c · 2 s", "một **c**ollar, hai **s**leeves"],
          ["occurrence", "cc · rr · ence", "occur gấp đôi r khi thêm đuôi"],
          ["privilege", "không có d", "privi + lege"],
          ["questionnaire", "nn", "question + **n** + aire"],
          ["recommend", "1 c · 2 m", "re + commend"],
          ["separate", "par", "có **a par**t ở giữa"],
          ["threshold", "một h ở giữa", "thres + hold, không ~~threshhold~~"],
        ],
        caption: "18 từ (tính cả các cặp) — mỗi bài Task 2 band 7.5 thường có 1–2 từ trong danh sách này",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ — phần “đề” của lượt 6 ở band 8",
        items: [
          "**Anh – Anh hay Anh – Mỹ, chọn một và giữ:** organise / organize, centre / center, programme / program. Trộn hai kiểu không bị trừ như lỗi chính tả nặng, nhưng là dấu hiệu thiếu kiểm soát.",
          "**Câu cuối còn trả lời đúng câu hỏi?** Đọc lại câu hỏi đề rồi đọc câu cuối kết bài. Đề hỏi “to what extent” thì kết bài phải có MỨC (largely / only partly).",
          "**Lập trường giữ suốt bài?** Thesis nói “largely agree” mà thân bài 2 nghiêng sang phản đối ⇒ sửa thesis hoặc thêm một câu nhượng bộ rõ.",
        ],
      },
      {
        t: "quiz",
        id: "t5d23-chinh-ta",
        kind: "fill",
        title: "Lượt 6 — gõ đúng chính tả (6 câu)",
        items: [
          { q: "1. Students often struggle to find affordable a___ in the city centre. (chỗ ở)", answers: ["accommodation"], hint: "cc · mm" },
          { q: "2. A committee was set up to examine the o___ of flooding in coastal towns. (sự xảy ra)", answers: ["occurrence"], hint: "cc · rr · ence" },
          { q: "3. The council has made a long-term c___ to cycling. (cam kết)", answers: ["commitment"], hint: "một t ở giữa" },
          { q: "4. Respondents completed an online q___. (bảng hỏi)", answers: ["questionnaire"], hint: "nn" },
          { q: "5. The roads need regular m___. (bảo dưỡng)", answers: ["maintenance"], hint: "main-ten-ance" },
          { q: "6. Incomes have now fallen below the poverty t___. (ngưỡng)", answers: ["threshold"], hint: "một h ở giữa" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phòng thi — bản 4 phút “3 + 2” và lượt của tôi" },
      {
        t: "p",
        text: "Trong 60 phút Writing, bạn có thật sự chỉ **3–4 phút** để soát (Ngày 24 sẽ phân giờ chi tiết cho Đề 11). Sáu lượt đầy đủ cần 12–15 phút — dùng ở nhà. Ở phòng thi dùng bản rút gọn: ==ba lượt ai cũng cần + hai lượt của riêng bạn==.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Soát 4 phút trong phòng thi — “3 + 2”",
        steps: [
          { label: "Lượt 1 · Động từ", sub: "60 giây — mọi động từ chính + từ định lượng + động từ tường thuật" },
          { label: "Lượt 3 · Ranh giới câu", sub: "60 giây — dấu câu quanh however / which / chủ ngữ dài" },
          { label: "Lượt của tôi #1", sub: "45 giây — lỗi dai dẳng số 1 trong sổ lỗi" },
          { label: "Lượt của tôi #2", sub: "45 giây — lỗi dai dẳng số 2" },
          { label: "Lượt 6 · Đề + chính tả", sub: "30 giây — câu cuối trả lời đúng đề? đọc NGƯỢC tìm từ sai" },
        ],
      },
      {
        t: "table",
        head: ["Lấy từ đâu", "Đếm gì", "Ví dụ “lượt của tôi”"],
        rows: [
          ["Sổ lỗi Đề 9 (Ngày 9 · 10 mổ đề)", "lỗi Writing xuất hiện ≥ 2 lần", "“Danh từ đếm được số ít không có mạo từ”"],
          ["Sổ lỗi Đề 10 (Ngày 17)", "lỗi lặp lại so với Đề 9", "“so sánh thiếu that of”"],
          ["Bài kiểm tra chặng 3 (Ngày 18)", "phần 1 + phần 6 — câu sai", "“động từ sau the majority of”"],
          ["Bài AI chấm của Ngày 19 · 20 (đoạn đề xuất, đoạn giải pháp)", "lỗi AI gạch chân", "“dấu phẩy giữa chủ ngữ dài và động từ”"],
        ],
        caption: "Chọn đúng HAI lỗi lặp nhiều nhất — không phải hai lỗi nặng nhất",
      },
      {
        t: "note",
        title: "💡 Mẹo — ba thói quen soát của người đạt 8",
        items: [
          "Viết xong thân bài 2 thì **dừng 20 giây** soát riêng câu dài nhất của đoạn — câu dài nhất chứa gần một nửa số lỗi.",
          "Lượt 6 đọc **ngược từ câu cuối lên** — não không đoán trước được chữ, nên thấy chữ sai.",
          "Không sửa ý ở phút cuối. Soát chỉ để sửa **lỗi**; viết lại cả câu lúc này dễ sinh lỗi mới.",
        ],
      },
      { t: "rule", formula: "Lượt 1 (60 s) → Lượt 3 (60 s) → Lượt của tôi #1 (45 s) → #2 (45 s) → Lượt 6 ngược (30 s)", vi: "Bốn phút cuối của Task 2 — hai lượt riêng lấy từ sổ lỗi, đổi lại sau mỗi đề." },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện tổng hợp — một đoạn band 7.5 có đúng 10 lỗi" },
      { t: "p", text: "Đoạn dưới đây trả lời đề “Universities should stop recording lectures because recordings discourage attendance. To what extent do you agree?” Ý tốt, liên kết tốt — nhưng có ==đúng 10 lỗi==: lượt 1 có 2 · lượt 2 có 1 · lượt 3 có 2 · lượt 4 có 2 · lượt 5 có 2 · lượt 6 có 1. Soát theo 6 lượt (12 phút) rồi mới làm bài điền." },
      {
        t: "passage",
        title: "Đoạn cần soát — 10 lỗi",
        intro: "Đoạn tự soạn, cố ý cài lỗi. Các câu được đánh số.",
        paras: [
          { text: "(1) In recent years, a growing number of universities has begun to record every lecture and to make the recordings available online. (2) Supporters argue that this gives students the flexibility to learn at their own pace, which is particularly valuable for those who work part-time. (3) Critics, however, claim that recordings encourage students to skip classes, and the research has found that attendance falls by around a fifth once lectures are posted online." },
          { text: "(4) This is not, in itself, a reason to stop recording, attendance is a means, not an end. (5) What matters is whether students learn as much, and the evidence on this point is mixed. (6) Even so, the marks of students who rely mainly on recordings are lower than students who attend, although the gap is smaller than critics suggest. (7) Having watched a lecture at double speed, very little is usually remembered." },
          { text: "(8) It could perhaps possibly be argued that universities should therefore make recordings available only to students who attend. (9) However, this would penalise the very students for whom recordings were introduced. (10) A better approach would be to keep recording lectures while redesigning them, so that they includes short tasks which can only be completed in the room. (11) Such tasks would give students a reason to attend without punishing those who cannot, and they would make the recordings more useful for revision, as a student could see which points his classmates had found difficult. (12) In short, the problem is not the recordings themselves but the way lectures are designed, and its this that universities should adress." },
        ],
      },
      {
        t: "quiz",
        id: "t5d23-doan-10-loi",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho đúng (10 câu)",
        items: [
          { q: "Câu 1 · lượt 1 — a growing number of universities [has begun]", answers: ["have begun"], hint: "a number of + N số nhiều ⇒ V số nhiều (mục 2)." },
          { q: "Câu 3 · lượt 2 — and [the research has found] that attendance falls", answers: ["research has found"], hint: "Khối nghiên cứu nói chung ⇒ không the (mục 3)." },
          { q: "Câu 4 · lượt 3 — a reason to stop recording[, attendance] is a means — gõ lại phần trong ngoặc, dùng dấu HAI CHẤM hoặc dấu CHẤM", answers: [": attendance", ". Attendance"], hint: "Hai câu đủ nối bằng phẩy = comma splice. Sửa bằng dấu hai chấm (vế sau giải thích vế trước) hoặc dấu chấm. Chấm phẩy cũng đúng ngữ pháp, nhưng ở đây hai chấm rõ quan hệ hơn." },
          { q: "Câu 6 · lượt 4 — are lower than [students who attend]", answers: ["those of students who attend"], hint: "So marks với marks ⇒ than those of… (mục 4)." },
          { q: "Câu 7 · lượt 4 — viết lại cả câu, bắt đầu bằng “Having watched a lecture at double speed, students”", answers: ["Having watched a lecture at double speed, students usually remember very little.", "Having watched a lecture at double speed, students usually remember very little", "Having watched a lecture at double speed, students tend to remember very little.", "Having watched a lecture at double speed, students remember very little."], hint: "Chủ ngữ treo — người xem là students (Tập 5 Ngày 9)." },
          { q: "Câu 8 · lượt 5 — [It could perhaps possibly be argued]", answers: ["It could be argued", "It could perhaps be argued", "It might be argued", "It may be argued"], hint: "Một chỗ rào cho một nhận định (mục 5)." },
          { q: "Câu 10 · lượt 1 — so that they [includes] short tasks", answers: ["include"], hint: "they ⇒ include." },
          { q: "Câu 11 · lượt 5 — as a student could see which points [his] classmates had found difficult", answers: ["their"], hint: "Người chung chung ⇒ their (hoặc đổi sang students… their)." },
          { q: "Câu 12 · lượt 3 — and [its] this that universities should…", answers: ["it is", "it's"], hint: "its = của nó; it's = it is. Câu chẻ: it is this that…" },
          { q: "Câu 12 · lượt 6 — universities should [adress]", answers: ["address"], hint: "dd · ss" },
        ],
      },
      {
        t: "note",
        title: "📌 Soi lại — vì sao đoạn này vẫn chỉ band 7.5 dù ý rất tốt",
        items: [
          "TR và CC của đoạn đạt band 8: lập trường rõ (không bỏ ghi hình, đổi cách thiết kế bài giảng), có nhượng bộ thật (câu 3, 6), giải pháp gắn đúng nguyên nhân (câu 10–11).",
          "GRA bị kéo xuống vì **10 lỗi trong 230 từ** — cứ hai câu một lỗi. Không lỗi nào nặng; cộng lại thì nặng.",
          "Bốn trong mười lỗi nằm ở **câu dài nhất** của mỗi khổ (câu 3, 10, 11, 12) — đúng như mẹo ở mục 7.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Lỗi 0–1 khi NÓI — tự sửa một lần, gọn, không quay đầu" },
      {
        t: "p",
        text: "Speaking không có lượt soát, nhưng có ==tự sửa== (self-correction). Band 8 GRA nói “the majority of sentences are error-free”; tự sửa nhanh một lỗi vừa nói **không bị trừ** — nó cho giám khảo thấy bạn kiểm soát được. Cái bị trừ là sửa **chậm**, sửa **nhiều lần**, hoặc quay lại nói lại cả câu (FC giảm).",
      },
      {
        t: "table",
        head: ["Cách sửa", "Ví dụ", "Kết quả"],
        rows: [
          ["Sửa ngay từ sai, đi tiếp", "“…the number of tourists **have** — **has** gone up a lot since then.”", "✅ band 8: gọn, không mất mạch"],
          ["Sửa bằng cụm đệm ngắn", "“…when I **was** — **I mean, when I've been** abroad, I always…”", "✅ tự nhiên nếu chỉ một lần"],
          ["Bỏ qua lỗi nhỏ không đổi nghĩa", "“…a informations” → đã lỡ nói, ý vẫn rõ", "✅ chấp nhận được; đừng dừng cả câu để sửa"],
          ["Dừng, xin lỗi, nói lại cả câu", "“Sorry, sorry — let me start again. When I was…”", "❌ FC giảm; lặp hai lần là dấu hiệu band 6–7"],
          ["Sửa đi sửa lại một chỗ", "“…they was — were — are — were…”", "❌ cho thấy không chắc, mất điểm cả GRA lẫn FC"],
        ],
        caption: "Tự sửa — chỗ khác nhau giữa band 7 và band 8",
      },
      {
        t: "mcq",
        id: "t5d23-tu-sua",
        title: "Tự sửa khi nói — chọn cách hợp band 8 nhất (3 câu)",
        items: [
          { q: "1. Bạn vừa nói: “Each of my friends have a different opinion…”", options: ["A  Dừng, nói “Sorry” và bắt đầu lại cả câu.", "B  “…have — has a different opinion, actually,” rồi nói tiếp.", "C  Không sửa, và cố nói thêm câu dài hơn để che."], correct: 1, why: "Sửa đúng một từ, ngay lập tức, rồi đi tiếp — gọn và cho thấy kiểm soát." },
          { q: "2. Khi nào nên BỎ QUA một lỗi vừa nói?", options: ["A  Khi lỗi nhỏ, không đổi nghĩa, và bạn đã nói qua nó vài từ.", "B  Không bao giờ — mọi lỗi đều phải sửa.", "C  Khi giám khảo đang nhìn đồng hồ."], correct: 0, why: "Quay lại sửa một lỗi nhỏ đã qua làm đứt mạch (FC) nhiều hơn là lỗi đó làm hại GRA." },
          { q: "3. Cách nào cho thấy rõ nhất là bạn KHÔNG chắc ngữ pháp?", options: ["A  Sửa một lần, nhanh.", "B  Sửa ba lần cùng một động từ.", "C  Dùng cụm đệm “I mean” rồi nói lại cụm đúng."], correct: 1, why: "Sửa đi sửa lại = đoán mò. Một lần sửa = biết mình sai và biết cái đúng." },
        ],
      },
      { t: "rule", formula: "nói sai → sửa ngay MỘT từ → đi tiếp  ·  lỗi nhỏ đã qua → bỏ qua", vi: "Lỗi 0–1 khi nói không có nghĩa là không bao giờ sai, mà là sửa đúng cách." },

      /* ── 10 ── */
      { t: "h", text: "10. Kiểm tra cuối bài (12 câu)" },
      {
        t: "mcq",
        id: "t5d23-kt-chon",
        title: "Lỗi này bắt ở lượt nào? (6 câu)",
        items: [
          { q: "1. “Each of the solutions require funding.”", options: ["Lượt 1 · Động từ", "Lượt 4 · Song song", "Lượt 6 · Chính tả"], correct: 0, why: "each of ⇒ requires. Động từ sau từ định lượng." },
          { q: "2. “Crime in cities is higher than villages.”", options: ["Lượt 2 · Danh từ", "Lượt 4 · Song song + so sánh", "Lượt 5 · Liên kết"], correct: 1, why: "So crime với villages ⇒ than that in villages / than in villages." },
          { q: "3. “Many towns banned cars from their centres. This has benefits.”", options: ["Lượt 3 · Ranh giới câu", "Lượt 5 · Liên kết (this trơ)", "Lượt 1 · Động từ"], correct: 1, why: "This trơ ⇒ This policy / This ban has clear benefits." },
          { q: "4. “The unemployment rose sharply in 2009.”", options: ["Lượt 2 · Danh từ", "Lượt 3 · Ranh giới câu", "Lượt 6 · Đề"], correct: 0, why: "Thất nghiệp nói chung ⇒ không the: Unemployment rose sharply…" },
          { q: "5. “Bus fares were cut which increased passenger numbers.”", options: ["Lượt 3 · Ranh giới câu", "Lượt 4 · Song song", "Lượt 1 · Động từ"], correct: 0, why: "which chỉ cả mệnh đề ⇒ phẩy trước which." },
          { q: "6. Đề hỏi “To what extent do you agree?”, kết bài viết “There are both advantages and disadvantages.”", options: ["Lượt 5 · Liên kết", "Lượt 6 · Đề", "Lượt 2 · Danh từ"], correct: 1, why: "Kết bài không trả lời MỨC đồng ý ⇒ lỗi đề (TR), bắt ở lượt 6." },
        ],
      },
      {
        t: "quiz",
        id: "t5d23-kt-dien",
        kind: "fill",
        title: "Gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "1. One in four households [own] a dog.", answers: ["owns"], hint: "one in four + V số ít (an toàn nhất)." },
          { q: "2. The 2017 report [has shown] that rents had doubled.", answers: ["showed"], hint: "Báo cáo có năm ⇒ quá khứ." },
          { q: "3. The scheme [only helps] families, not single people. — đặt only đúng chỗ, gõ lại 3 từ", answers: ["helps only families"], hint: "only sát từ bị giới hạn." },
          { q: "4. Not only [it saves] energy, but it also cuts bills.", answers: ["does it save"], hint: "Not only đầu câu ⇒ đảo ngữ." },
          { q: "5. The government should [definately] act now.", answers: ["definitely"], hint: "chứa chữ finite." },
          { q: "6. Every citizen should be able to vote for [his] representatives.", answers: ["their"], hint: "Người chung chung ⇒ their." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d23-doc",
    kind: "reading",
    title: "Đọc: Suy luận band 8 & bẫy cuối — câu hỏi “ngụ ý”, YNNG phải nối hai câu, và tám bẫy còn sót ở người 7.5",
    goal: "Phân biệt được điều bài BUỘC phải đúng với điều chỉ CÓ THỂ đúng, nhận ra năm dạng câu hỏi suy luận và tám bẫy cuối của Reading band 8, rồi làm một Passage 3 ~940 từ (YNNG · MCQ · Sentence endings) trong 20 phút, chấm và gắn số bẫy cho mọi câu sai.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy điểm nào",
        items: [
          "Người band 7.5 Reading sai 5–7 câu mỗi đề. Mổ Đề 9 (Ngày 9) và Đề 10 (Ngày 17) cho thấy ==hơn một nửa số câu sai còn lại là câu SUY LUẬN==: đáp án không nằm trong một câu mà phải nối hai câu, hoặc phải hiểu điều tác giả ngụ ý.",
          "Hôm nay: **thang năm mức** của một nhận định — nói thẳng · nói lại · buộc phải suy ra · chỉ có thể đúng · kiến thức ngoài. IELTS chấm ĐÚNG chỉ ở ba mức đầu.",
          "**Năm dạng** câu suy luận và **tám bẫy cuối** — mỗi bẫy có tên và số, để chấm xong bạn ghi “sai câu 7, bẫy ⑧” chứ không ghi “sai vì ẩu”.",
          "Bài chính: Passage 3 về **mục từ giả** trong bản đồ và từ điển (~940 từ), 13 câu, 20 phút — đúng nhịp Passage 3 của đề thật.",
          "Ngày 24 có **Đề 11**: Reading làm trong Online Test. Bài hôm nay là lượt luyện cuối cho kiểu câu khó nhất của nó.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Suy luận trong IELTS là gì — và KHÔNG là gì" },
      {
        t: "p",
        text: "Trong đời thường, “suy luận” là đoán khôn. Trong IELTS, suy luận hẹp hơn nhiều: ==điều mà người đọc nào hiểu đúng bài cũng BUỘC phải rút ra==. Cái “có lẽ đúng”, “nghe hợp lý”, “ai cũng biết” đều không phải suy luận — đó là chỗ người giỏi mất điểm, vì người giỏi đoán khôn hơn người yếu.",
      },
      {
        t: "table",
        head: ["Mức", "Bài nói gì", "Câu hỏi nói gì", "Chấm"],
        rows: [
          ["① Nói thẳng", "The store closed in 1960.", "The store closed in 1960.", "TRUE / YES"],
          ["② Nói lại (paraphrase)", "The store closed in 1960.", "The shop stopped trading in the mid-twentieth century.", "TRUE / YES"],
          ["③ Buộc phải suy ra", "Only residents may park here. Ms Lee parks here every day.", "Ms Lee is a resident (nếu bài coi như cô tuân luật).", "TRUE / YES — hai câu cộng lại không còn cách hiểu khác"],
          ["④ Chỉ có thể đúng", "The library was funded by a mill owner who had left school at twelve.", "He funded it because he regretted his lack of education.", "NOT GIVEN — nghe hợp lý, nhưng bài không nói vì sao"],
          ["⑤ Kiến thức ngoài", "The bridge opened in 1890.", "The bridge was built of steel.", "NOT GIVEN — có thể đúng ngoài đời, bài không nói"],
        ],
        caption: "Thang năm mức — ranh giới ĐÚNG / NOT GIVEN nằm giữa mức ③ và ④",
      },
      { t: "rule", formula: "Câu hỏi đúng ⇔ bài nói thẳng / nói lại / BUỘC phải suy ra · “có lẽ”, “hợp lý”, “ai cũng biết” → NOT GIVEN", vi: "Câu hỏi kiểm tra: “Có cách đọc nào của bài mà câu này SAI không?” Có ⇒ chưa phải suy luận." },

      /* ── 2 ── */
      { t: "h", text: "2. Năm dạng câu suy luận — nhận ra ngay từ câu hỏi" },
      {
        t: "table",
        head: ["Dạng", "Câu hỏi trông thế nào", "Đáp án nằm ở"],
        rows: [
          ["① Ngụ ý", "The writer **implies / suggests** that… · What can be **inferred**…", "hai câu cạnh nhau, hoặc một câu điều kiện / so sánh"],
          ["② Mục đích", "**Why** does the writer **mention** X? · The writer refers to X **in order to**…", "câu NGAY TRƯỚC và NGAY SAU X — X là ví dụ cho ý nào"],
          ["③ Thái độ", "What is the writer's **attitude** to…? · The writer is **sceptical / qualified / dismissive**…", "từ đánh giá: I suspect · less sure · tempting · fairest"],
          ["④ YNNG / TFNG nối câu", "câu hỏi gộp hai ý mà bài tách ở hai câu (có khi hai đoạn)", "tìm CẢ HAI ý; thiếu một ⇒ NOT GIVEN"],
          ["⑤ Kết câu / tóm tắt nhân quả", "Sentence endings · Summary có because / so / when", "từ nối nhân quả và thời gian trong bài"],
        ],
        caption: "Ba dạng đầu luôn là MCQ; hai dạng sau trộn trong YNNG, TFNG, Sentence endings, Summary",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Quy trình 4 bước cho một câu suy luận — 90 giây",
        steps: [
          { label: "Khoanh vùng", sub: "tên riêng, con số, từ hiếm trong câu hỏi → đoạn nào" },
          { label: "Đọc rộng hơn một câu", sub: "câu trước + câu chứa + câu sau — suy luận hiếm khi nằm gọn trong một câu" },
          { label: "Hỏi “có BUỘC không?”", sub: "có cách hiểu nào làm phương án này sai?" },
          { label: "Loại theo bẫy", sub: "phương án còn lại dính bẫy nào trong tám bẫy ở mục 3?" },
        ],
      },
      { t: "rule", formula: "khoanh vùng → đọc câu trước + câu chứa + câu sau → “có buộc không?” → loại theo bẫy", vi: "90 giây một câu; quá 2 phút thì đoán, đánh dấu, đi tiếp." },

      /* ── 3 ── */
      { t: "h", text: "3. Tám bẫy cuối — mỗi bẫy một số" },
      {
        t: "p",
        text: "Đây là danh sách chấm cho cả Ngày 23 và các ngày mổ đề sau (Ngày 25 mổ Reading Đề 11). Ghi số bẫy vào sổ lỗi: sau ba đề, bạn sẽ thấy mình rơi vào **hai bẫy** nhiều nhất — đó là hai thứ cần nhìn trước tiên trong phòng thi.",
      },
      {
        t: "table",
        head: ["Bẫy", "Trông thế nào", "Cách gỡ"],
        rows: [
          ["① Suy quá đà", "phương án nghe hợp lý, thêm lý do / động cơ bài không nêu", "tìm CHỮ nói lý do (because, so as to, in order to) — không có ⇒ NG"],
          ["② Đảo nhân quả / đảo chiều so sánh", "bài: A dẫn tới B · câu hỏi: B dẫn tới A; bài: ít hơn · câu hỏi: nhiều hơn", "vẽ mũi tên A → B trên nháp"],
          ["③ So sánh bài không làm", "câu hỏi so A với B, bài chỉ nói A", "bài phải nói CẢ hai vế của so sánh"],
          ["④ Lệch thời gian", "used to · initially · until · no longer · by then · now", "gạch chân mốc thời gian ở cả bài lẫn câu hỏi"],
          ["⑤ Ý người khác ≠ ý tác giả", "Some argue… · It is often said… · Critics claim… rồi tác giả phản bác", "YNNG hỏi TÁC GIẢ: tìm I think / seems to me / I am less sure"],
          ["⑥ Phủ định ẩn", "far from · hardly · fail to · few · it is doubtful · less than", "đọc lại câu với nghĩa phủ định rõ: far from = KHÔNG"],
          ["⑦ Giả định / điều kiện", "would have · had it not been · if… were · might well have been", "điều giả định KHÔNG xảy ra — Had X happened ⇒ X không xảy ra (Ngày 19)"],
          ["⑧ Từ trùng mồi", "phương án lặp đúng chữ trong bài nhưng nghĩa khác", "chữ trùng là dấu hiệu SAI nhiều hơn dấu hiệu đúng ở band 8"],
        ],
        caption: "Tám bẫy cuối của Reading band 8",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba thói quen của người 7.5 làm bẫy hiệu quả hơn",
        items: [
          "Dừng ở câu đầu tiên có chữ khớp. Câu chứa đáp án thường là câu **thứ hai** — câu đầu chỉ có chữ trùng (bẫy ⑧).",
          "Đọc câu hỏi YNNG như đọc tin tức: “ý này có trong bài không?”. Phải hỏi: “**tác giả** có nói thế không?” (bẫy ⑤).",
          "Gặp câu dài có had / would thì đọc lướt. Câu điều kiện ngược thực tế là chỗ đề hay đặt đáp án NO / FALSE nhất (bẫy ⑦).",
        ],
      },
      { t: "rule", formula: "① quá đà · ② đảo chiều · ③ so sánh thiếu vế · ④ thời gian · ⑤ người khác · ⑥ phủ định ẩn · ⑦ giả định · ⑧ chữ trùng", vi: "Mỗi câu sai gắn đúng một số bẫy." },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động — sáu đoạn ngắn, sáu bẫy (6 phút)" },
      {
        t: "mcq",
        id: "t5d23-doc-khoi-dong",
        title: "Khởi động — mỗi câu một đoạn ngắn (6 câu)",
        items: [
          { q: "1. “The town's first public library opened in 1892. It was paid for by a local mill owner who had himself left school at the age of twelve.” — Statement: **The mill owner paid for the library because he regretted leaving school early.**", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bẫy ① suy quá đà: nghe rất hợp lý, nhưng bài không nói lý do ông bỏ tiền." },
          { q: "2. “Cities with more cycle lanes have more cyclists. Planners long assumed that the lanes produced the riders; a recent analysis suggests the arrow often points the other way, since lanes tend to be built where people already cycle.” — According to the analysis:", options: ["A  Cycle lanes are the main reason people start cycling.", "B  Existing levels of cycling often determine where lanes are built.", "C  Cyclists avoid cities that have few lanes."], correct: 1, why: "Bẫy ② đảo nhân quả: A là niềm tin CŨ của các nhà quy hoạch. “the arrow points the other way” = người đạp xe → làn đường." },
          { q: "3. “Until the 1970s, most of the island's electricity came from diesel generators; today, wind turbines supply roughly half of it.” — Statement: **Diesel generators provide most of the island's electricity.**", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Bẫy ④ thời gian: “Until the 1970s” — điều đó KHÔNG còn đúng. Câu hỏi ở hiện tại. Nếu nửa còn lại vẫn là diesel thì diesel cũng chỉ là khoảng một nửa, không phải “most” ⇒ FALSE." },
          { q: "4. “Some historians have called the reform a failure. That verdict seems to me premature: its effects on literacy took a generation to appear.” — Statement (YNNG): **The reform was a failure.**", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Bẫy ⑤: “a failure” là ý của some historians; tác giả gọi đó là premature và đưa lý do ⇒ NO." },
          { q: "5. “The new drug is far from the cure its manufacturers promised, although it does reduce symptoms in a minority of patients.” — The writer says the drug:", options: ["A  lives up to its manufacturers' claims.", "B  helps some patients but much less than was claimed.", "C  has no measurable effect on symptoms."], correct: 1, why: "Bẫy ⑥ phủ định ẩn: far from the cure = KHÔNG phải thuốc chữa khỏi; “does reduce symptoms in a minority” ⇒ C sai." },
          { q: "6. “Had the bridge been built a decade earlier, the port might have survived the arrival of the railway.” — Statement: **The port survived the arrival of the railway.**", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Bẫy ⑦ giả định: Had… been built… might have survived ⇒ cây cầu không xây kịp và cảng đã KHÔNG trụ được. (Ngày 19 mục 2–3)" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Passage 3, Questions 1–13 (20 phút)" },
      { t: "p", text: "Bấm giờ 20 phút. Đọc lướt toàn bài 3 phút, rồi làm theo thứ tự câu hỏi. Không quay lại đoạn đã làm xong trừ khi còn thời gian ở cuối (chiến thuật đọc một lần của Ngày 21)." },
      {
        t: "passage",
        title: "Phantom Entries",
        intro: "Bài tự soạn. Các sự kiện về Agloe, mục từ Mountweazel, từ “esquivalience” và vụ kiện danh bạ điện thoại năm 1991 là chuyện có thật, kể gọn và làm tròn chi tiết; nhận định trong bài là của người viết.",
        paras: [
          { label: "A", text: "In the 1930s, a small company that produced road maps of New York State placed on one of them a hamlet called Agloe, at a quiet junction of two dirt roads in the Catskill Mountains. There was no such place. Its name was reportedly formed from the initials of the two men who drew the map, and it was not a hoax in the ordinary sense: nobody was meant to laugh. It was a decoy. If Agloe ever appeared on a rival's map, the rival had copied. Inventions of this kind, usually called trap streets by cartographers and fictitious entries by everyone else, have been planted in maps, dictionaries, encyclopedias and telephone directories, and they reveal something odd about what we think we are protecting when we claim to own information." },
          { label: "B", text: "Some years later, Agloe did turn up on a rival map. The rival, however, had an answer that its accusers had not foreseen. A small general store had been built at the junction and named after the place on the map, apparently because its owners had seen the name and assumed it was real. Agloe now existed, and its appearance on the second map was no longer a telltale sign of copying but an accurate record. It is tempting to treat the episode as a curiosity. I think it illustrates something more general: a map does not merely describe the world; occasionally, and without anyone intending it, it alters the world it describes." },
          { label: "C", text: "The habit was not confined to cartography. A one-volume encyclopedia published in 1975 included a short biography of an American photographer, Lillian Virginia Mountweazel, who was said to have died in an explosion while on assignment for a magazine called Combustibles. Thirty years later, a journalist found that a newly published American dictionary contained the word “esquivalience”, defined as the wilful avoidance of one's official responsibilities; the editors eventually admitted that they had invented it in order to catch copyists. What strikes me about both inventions is that they are slightly too good. A photographer killed while working for a magazine called Combustibles is a joke that an attentive reader might well catch. The editors, it seems, were confident that those who copied their work would read it less carefully than those who bought it." },
          { label: "D", text: "Whether such traps actually work is less obvious than their makers assume. A fictitious entry proves copying only if nobody could have arrived at it independently. A misspelt street name on a map may have been copied from a rival, but it may equally have been repeated by two surveyors who relied on the same faulty council record. The designer of a trap must therefore make it implausible enough to be unique, yet plausible enough to pass unnoticed by an editor tidying the next edition. Too strange, and it is deleted as an error; too ordinary, and someone else may produce exactly the same invention. This is a narrow target, and I suspect it is hit far less often than the people who aim at it believe." },
          { label: "E", text: "The most famous test of a fictitious entry came in 1991, when the United States Supreme Court decided a dispute between two publishers of telephone directories. The smaller company had inserted a handful of invented listings into its directory, and when those listings reappeared in its rival's much larger book, the fact of copying was beyond dispute. Yet the smaller company lost. The court held that the names, towns and numbers in a telephone book are facts, and that facts cannot be owned, however much labour has gone into collecting them. What copyright protects is the originality with which material is selected or arranged, and an alphabetical list of every subscriber in a district displayed none. Had the directory reflected any real judgement about what to include, the outcome might well have been different. As it was, the trap had worked perfectly and proved nothing that mattered." },
          { label: "F", text: "It is here, I think, that the story becomes more than a legal footnote. The compilers of directories believed that the value of their work lay in the information; the court said that, in law, it lay only in the creative choices. The fictitious entry sits awkwardly between the two views. It is the one part of a directory that is genuinely invented, and therefore the one part that is in any sense original, yet its only function is to be false. In order to protect their work, compilers were obliged to make it very slightly worse. Some cartographers argue that this does no harm, since nobody sets out to visit a hamlet that does not exist. I am less sure. Once maps began to feed the navigation software in cars and delivery vans, an invented street was no longer a private joke on paper; it could direct a driver, or an ambulance, into a dead end." },
          { label: "G", text: "Digital databases now rely on other defences: records of who downloaded what, watermarks hidden in the data, and tiny variations in the coordinates supplied to each customer, so that a leaked copy can be traced to its source. These make deliberate falsehood less necessary, but they do not remove the underlying tension. Whoever collects facts would like to own them, and the law, on the whole, says that they cannot. Agloe may be the most fitting emblem of that tension: a place invented to defend a map that ended up, for a while, appearing on it honestly. The store is said to have closed long ago, and the name has disappeared from most modern maps, which may be the fairest ending available to a fiction that briefly became true." },
        ],
      },
      { t: "p", text: "**Questions 1–5** — Do the following statements agree with the claims of the writer? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this." },
      {
        t: "mcq",
        id: "t5d23-doc-ynng",
        title: "Questions 1–5 — YES / NO / NOT GIVEN",
        items: [
          { q: "1. The Agloe episode shows that maps can change the places they represent.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “a map does not merely describe the world; occasionally… it alters the world it describes.” Mức ② nói lại: change = alters, the places they represent = the world it describes." },
          { q: "2. The publishers of the 1975 encyclopedia were criticised when the Mountweazel entry came to light.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bẫy ①: đoạn C kể mục từ có tồn tại, không nói ai phê bình ai. “Chắc là bị chê” = suy quá đà." },
          { q: "3. Fictitious entries prove copying more often than the people who create them believe.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Bẫy ② đảo chiều: đoạn D “hit far LESS often than the people who aim at it believe” — câu hỏi nói MORE often ⇒ NO." },
          { q: "4. If the smaller company's directory had shown more editorial judgement, it might have won its case.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Bẫy ⑦ (theo chiều ngược — ở đây giả định là đáp án): đoạn E “Had the directory reflected any real judgement about what to include, the outcome might well have been different.” Thua ⇒ “khác đi” = thắng." },
          { q: "5. Cartographers are right to claim that fictitious entries do no harm.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Bẫy ⑤: “do no harm” là ý của some cartographers; tác giả “I am less sure” rồi đưa ví dụ xe cứu thương ⇒ tác giả không đồng ý ⇒ NO." },
        ],
      },
      { t: "p", text: "**Questions 6–9** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t5d23-doc-mcq",
        title: "Questions 6–9 — Multiple choice",
        items: [
          { q: "6. The writer describes the two inventions in paragraph C as “slightly too good” in order to suggest that their creators", options: ["A  had a better sense of humour than most editors.", "B  expected copyists to read less attentively than ordinary readers.", "C  wanted the inventions to be discovered quickly.", "D  did not take the problem of copying seriously."], correct: 1, why: "Dạng ② mục đích: hai câu SAU cụm này giải thích nó — “an attentive reader might well catch” + “those who copied… would read it less carefully than those who bought it”. A là bẫy ⑧ (joke ≠ sense of humour); D ngược với việc họ cố bẫy kẻ chép." },
          { q: "7. What does the writer imply about the evidence of copying in the 1991 case?", options: ["A  It was too weak to persuade the court.", "B  It was conclusive but irrelevant to the court's decision.", "C  It was later shown to be unreliable.", "D  It led the court to change the law on directories."], correct: 1, why: "Dạng ① ngụ ý: “the fact of copying was beyond dispute” + “the trap had worked perfectly and proved nothing that mattered” ⇒ chứng minh được việc chép, nhưng không quyết định kết quả. A ngược “beyond dispute”." },
          { q: "8. According to paragraph F, what is paradoxical about a fictitious entry?", options: ["A  It is the most original part of a work, yet it exists only to be untrue.", "B  It is protected by law even though it is false.", "C  It is more valuable than the information around it.", "D  It is easier to invent than to detect."], correct: 0, why: "“the one part that is in any sense original, yet its only function is to be false”. B: bài không nói mục từ giả được luật bảo hộ — bẫy ①." },
          { q: "9. What is the writer's attitude to the digital defences described in paragraph G?", options: ["A  enthusiastic — they have solved the problem completely", "B  dismissive — they are no improvement on fictitious entries", "C  qualified — they reduce the need for false data but leave the basic conflict", "D  uncertain — it is unclear whether they are legal"], correct: 2, why: "Dạng ③ thái độ: “These make deliberate falsehood less necessary, but they do not remove the underlying tension.” — khen có giới hạn = qualified." },
        ],
      },
      {
        t: "p",
        text: "**Questions 10–13** — Complete each sentence with the correct ending, **A–G**. **A** plausible enough to resemble a genuine entry. · **B** rely on the same inaccurate record. · **C** consists of facts arranged without creative choices. · **D** maps started to be used by navigation systems. · **E** is copied by a rival publisher. · **F** too unusual to have been invented twice. · **G** drivers try to visit places that do not exist.",
      },
      {
        t: "quiz",
        id: "t5d23-doc-ket-cau",
        kind: "fill",
        title: "Questions 10–13 — gõ chữ cái A–G",
        items: [
          { q: "10. A trap is likely to survive into the next edition of a map if it is…", answers: ["A"], hint: "Đoạn D: “plausible enough to pass unnoticed by an editor tidying the next edition”. F là vế còn lại (unique) — nó giải thích vì sao trap chứng minh được việc chép, không giải thích vì sao nó sống sót." },
          { q: "11. Two surveyors might make the same mistake if they…", answers: ["B"], hint: "Đoạn D: “two surveyors who relied on the same faulty council record” — faulty = inaccurate." },
          { q: "12. According to the court, copyright does not protect material that…", answers: ["C"], hint: "Đoạn E: facts cannot be owned; copyright protects originality in selection / arrangement. E là bẫy ⑧ (copy có trong bài nhưng không phải lý do)." },
          { q: "13. The writer believes invented streets became potentially dangerous when…", answers: ["D"], hint: "Đoạn F: “Once maps began to feed the navigation software…”. G là ý của cartographers (nobody sets out to visit…) — bẫy ⑤." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chấm 13 câu — và gắn số bẫy cho mọi câu sai" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Dạng / bẫy", "Bằng chứng (đoạn)"],
        rows: [
          ["1", "YES", "nói lại mức ②", "B — alters the world it describes"],
          ["2", "NOT GIVEN", "bẫy ① suy quá đà", "C — không ai phê bình"],
          ["3", "NO", "bẫy ② đảo chiều so sánh", "D — far less often than… believe"],
          ["4", "YES", "giả định ⑦ (đáp án nằm TRONG câu giả định)", "E — Had the directory reflected…"],
          ["5", "NO", "bẫy ⑤ ý người khác", "F — Some cartographers argue… I am less sure"],
          ["6", "B", "mục đích — đọc câu sau", "C — read it less carefully than those who bought it"],
          ["7", "B", "ngụ ý — nối hai câu xa", "E — beyond dispute … proved nothing that mattered"],
          ["8", "A", "ngụ ý — chữ yet", "F — original, yet its only function is to be false"],
          ["9", "C", "thái độ — less necessary, but…", "G — do not remove the underlying tension"],
          ["10", "A", "kết câu — F là vế còn lại của cùng câu", "D — plausible enough to pass unnoticed"],
          ["11", "B", "kết câu — paraphrase faulty → inaccurate", "D"],
          ["12", "C", "kết câu — E là bẫy ⑧", "E"],
          ["13", "D", "kết câu — G là bẫy ⑤", "F — Once maps began to feed…"],
        ],
        caption: "Mục tiêu band 8: ≥ 11/13 trong 20 phút",
      },
      {
        t: "note",
        title: "📌 Sau khi chấm — ghi vào sổ lỗi",
        items: [
          "Mỗi câu sai một dòng: **câu · dạng · số bẫy · chữ quyết định trong bài**. Ví dụ: “Câu 3 · YNNG · ② · far LESS often”.",
          "Đếm số bẫy của hôm nay cộng với sổ lỗi Đề 9 + Đề 10. Hai số bẫy nhiều nhất ⇒ ghi lên đầu trang nháp khi làm Reading Đề 11 (Ngày 24).",
          "Câu 4 là câu nhiều người sai nhất: thấy Had… might have rồi chọn NO theo phản xạ “giả định = không xảy ra”. Đúng là không xảy ra — nhưng câu hỏi CŨNG là giả định (If… had shown…, might have won). Hai giả định khớp nhau ⇒ YES.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "fictitious", pos: "adj", ipa: "/fɪkˈtɪʃəs/", vi: "hư cấu, bịa ra (không có thật)", ex: "The map included a fictitious village to catch copyists.", exVi: "Tấm bản đồ có một ngôi làng bịa ra để bắt kẻ sao chép.", more: "fictitious ≠ fictional: fictional = thuộc truyện hư cấu (a fictional detective); fictitious = giả, dựng lên để đánh lừa (a fictitious name)." },
          { w: "decoy", pos: "n", ipa: "/ˈdiːkɔɪ/", vi: "mồi nhử, vật đánh lạc hướng", ex: "The invented entry served as a decoy rather than a joke.", exVi: "Mục từ bịa ra đóng vai mồi nhử chứ không phải trò đùa.", more: "act as / serve as a decoy · a decoy email account" },
          { w: "hoax", pos: "n", ipa: "/həʊks/", vi: "trò lừa bịp, tin giả cố ý", ex: "The report turned out to be an elaborate hoax.", exVi: "Bản tin hoá ra là một trò lừa công phu.", more: "an elaborate / a cruel hoax · fall for a hoax · a hoax call" },
          { w: "telltale", pos: "adj", ipa: "/ˈtelteɪl/", vi: "để lộ, tố cáo (dấu hiệu)", ex: "Repeated spelling errors are a telltale sign of copying.", exVi: "Lỗi chính tả lặp lại là dấu hiệu để lộ việc sao chép.", more: "a telltale sign / mark / smell — chỉ đứng trước danh từ" },
          { w: "copyist", pos: "n", ipa: "/ˈkɒpiɪst/", vi: "kẻ sao chép (tác phẩm, dữ liệu)", ex: "The editors assumed that copyists would not read carefully.", exVi: "Các biên tập viên cho rằng kẻ sao chép sẽ không đọc kỹ.", more: "ngày xưa còn nghĩa “người chép tay sách”" },
          { w: "compiler", pos: "n", ipa: "/kəmˈpaɪlə/", vi: "người biên soạn (từ điển, danh bạ, tuyển tập)", ex: "The compilers of the dictionary spent ten years on it.", exVi: "Những người biên soạn từ điển mất mười năm cho nó.", more: "compile a list / a report / data · compilation (n) — với dân IT: compiler còn là trình biên dịch" },
          { w: "beyond dispute", pos: "phr", ipa: "/bɪˌjɒnd dɪˈspjuːt/", vi: "không thể bàn cãi", ex: "The fact of copying was beyond dispute, yet the case was lost.", exVi: "Việc sao chép là không thể bàn cãi, thế mà vẫn thua kiện.", more: "beyond doubt (Ngày 19) · beyond question — dùng được trong Task 2 để nói điều đã có bằng chứng chắc" },
          { w: "pass unnoticed", pos: "phr", ipa: "/pɑːs ʌnˈnəʊtɪst/", vi: "trôi qua mà không ai để ý", ex: "Small errors in a long report often pass unnoticed.", exVi: "Lỗi nhỏ trong một báo cáo dài thường trôi qua mà không ai để ý.", more: "go unnoticed (tương đương) · go unpunished / unchallenged — cùng khuôn go / pass + un-V3" },
          { w: "implausible", pos: "adj", ipa: "/ɪmˈplɔːzəbl/", vi: "khó tin, không hợp lý", ex: "The explanation sounded implausible to most of the committee.", exVi: "Lời giải thích nghe khó tin với phần lớn hội đồng.", more: "trái nghĩa plausible · a highly implausible claim · implausibly (adv)" },
          { w: "dead end", pos: "n phr", ipa: "/ˌded ˈend/", vi: "ngõ cụt; (nghĩa bóng) bế tắc", ex: "The talks reached a dead end after two days.", exVi: "Cuộc đàm phán đi vào bế tắc sau hai ngày.", more: "a dead-end job (công việc không có lối thăng tiến — có gạch nối khi đứng trước danh từ)" },
          { w: "emblem", pos: "n", ipa: "/ˈembləm/", vi: "biểu tượng (tiêu biểu cho một ý / một thời)", ex: "The empty stadium became an emblem of wasteful spending.", exVi: "Sân vận động bỏ trống trở thành biểu tượng của chi tiêu lãng phí.", more: "an emblem of N · emblematic of (adj, trang trọng) — gần với symbol nhưng thiên về “điển hình cho”" },
          { w: "premature", pos: "adj", ipa: "/ˈpremətʃə/", vi: "quá sớm, vội vàng (kết luận)", ex: "It would be premature to call the policy a failure.", exVi: "Gọi chính sách là thất bại lúc này thì quá vội.", more: "a premature conclusion / judgement · rất hợp để phản biện ở Part 3 và Task 2" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d23-noi",
    kind: "speaking",
    title: "Nói: Part 3 — phản biện giám khảo khéo khi chính câu hỏi có cài bẫy (band 8) + 🔊 nối âm chuỗi band 8",
    goal: "Nhận ra năm kiểu câu hỏi Part 3 có cài sẵn bẫy (tiền đề ngầm, hai lựa chọn giả, khái quát quá rộng, câu hỏi giá trị, ca cực đoan), gỡ bẫy bằng một câu lịch sự rồi trả lời đầy đủ theo một trong năm nước đi band 8, và nói các cụm phản biện ấy liền một hơi với nối âm chuỗi tự nhiên.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **FC + LR 7 → 8** ở Part 3. Band 8 FC: ==phát triển chủ đề mạch lạc và phù hợp==; câu trả lời đi thẳng vào một tiền đề sai mà không nhận ra thì “phù hợp” nhưng nông.",
          "Đây là phần BA của chuỗi phản biện: Ngày 6 — khi giám khảo **đẩy ngược** ý bạn; Ngày 18 — khi giám khảo đẩy **hai lần** hoặc **diễn giải sai**. Hôm nay — khi **chính câu hỏi** đã cài sẵn một giả định.",
          "**Năm kiểu** câu hỏi có bẫy và **năm nước đi** tương ứng — mỗi nước đi có một khung câu.",
          "Luật vàng: ==một câu gỡ bẫy, rồi PHẢI trả lời==. Gỡ xong mà không trả lời = né câu hỏi, FC tụt.",
          "🔊 **Nối âm chuỗi band 8** đúng trong các cụm phản biện (C + V, nuốt t / d, r · w · j chen) — để lời phản biện nghe nhẹ nhàng chứ không gắt.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Chuỗi phản biện — hai phần trước đã cho bạn gì" },
      {
        t: "table",
        head: ["Ngày", "Tình huống", "Công cụ chính"],
        rows: [
          ["Tập 5 Ngày 6", "giám khảo đẩy ngược: “But isn't that unrealistic?”", "nhượng bộ thật ba bậc · phản biện lịch sự · rào dữ kiện, không rào ý kiến"],
          ["Tập 5 Ngày 13 · 19", "câu hỏi trừu tượng, triết lý", "ba động tác: tóm – phản hồi có giới hạn – giả định"],
          ["Tập 5 Ngày 18", "giám khảo đẩy HAI lần · diễn giải sai ý bạn", "giữ lập trường mà không lặp lại · sửa cách diễn giải: “That's not quite what I meant…”"],
          ["**Hôm nay**", "chính câu hỏi có cài sẵn một giả định", "nhận ra kiểu bẫy → một câu gỡ → trả lời đầy đủ"],
        ],
        caption: "Cùng một kỹ năng, ba tầng",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Năm kiểu câu hỏi có bẫy" },
      {
        t: "p",
        text: "Giám khảo Part 3 hay đặt câu hỏi có sẵn một giả định — không phải để gài bạn, mà vì đó là cách người ta nói chuyện thật. Người band 7 trả lời **trong** giả định ấy. Người band 8 ==nhìn thấy giả định, nói ra trong một câu, rồi trả lời== — đó chính là “developing the topic” ở mức cao nhất.",
      },
      {
        t: "table",
        head: ["Kiểu bẫy", "Câu hỏi ví dụ", "Nhận ra bằng"],
        rows: [
          ["① Tiền đề ngầm", "Why has social media made people **lonelier**?", "Why / How + một nhận định chưa được chứng minh"],
          ["② Hai lựa chọn giả", "Should **parents or schools** be responsible for teaching manners?", "A or B — như thể chỉ có hai cửa, không giao nhau"],
          ["③ Khái quát quá rộng", "Are **young people** less polite **nowadays**?", "nhóm người cả trăm triệu + một tính từ"],
          ["④ Câu hỏi giá trị", "Is it **fair** that footballers earn more than nurses?", "fair · right · acceptable · should — từ phán xét"],
          ["⑤ Ca cực đoan", "But what about people who **can't** afford it **at all**?", "But what about… / Even if… — một ngoại lệ cực đoan"],
        ],
        caption: "Gạch chân chữ in đậm khi nghe — đó là chỗ có bẫy",
      },

      /* ── 3 ── */
      { t: "h", text: "3. Năm nước đi band 8 — một câu gỡ, rồi trả lời" },
      {
        t: "patterns",
        rows: [
          { formula: "① I'm not sure I'd accept the premise entirely — + điều đúng hơn. That said, + trả lời.", vi: "Tách tiền đề: nói nhẹ điều bạn nghi ngờ, rồi vẫn trả lời phần có lý của câu hỏi.", examples: [{ en: "I'm not sure social media has made everyone lonelier — for some people it's a lifeline. That said, I think it can make loneliness worse for people who use it instead of seeing friends, because…", vi: "Tôi không chắc mạng xã hội làm mọi người cô đơn hơn — với một số người nó là phao cứu sinh. Dù vậy, tôi nghĩ nó có thể làm nỗi cô đơn tệ hơn với những người dùng nó thay cho việc gặp bạn bè, bởi vì…" }] },
          { formula: "② I don't think it has to be one or the other. + vai của A + vai của B + cái gì nối hai bên.", vi: "Mở rộng lựa chọn: chia việc, chia giai đoạn, hoặc chỉ ra chỗ hai bên phải hợp tác.", examples: [{ en: "I don't think it has to be one or the other. Parents set the example at home, but schools are where children practise manners with people who aren't family.", vi: "Tôi không nghĩ phải chọn một trong hai. Cha mẹ làm gương ở nhà, còn trường học là nơi trẻ thực hành phép lịch sự với những người không phải người nhà." }] },
          { formula: "③ It depends which N we're talking about. + nhóm này… + nhóm kia…", vi: "Thu hẹp phạm vi: chia nhóm theo tuổi, nơi sống, hoàn cảnh (Tập 3 Ngày 6 — bảng trục chia nhóm).", examples: [{ en: "It depends which young people we're talking about. Teenagers in big cities may seem abrupt, but that's often just a different style of politeness, not a lack of it.", vi: "Còn tuỳ ta đang nói nhóm người trẻ nào. Thiếu niên ở thành phố lớn có thể trông cộc lốc, nhưng thường đó chỉ là một kiểu lịch sự khác, không phải thiếu lịch sự." }] },
          { formula: "④ Fair to whom, though? / In principle…, but in practice… + tiêu chí bạn dùng để phán xét.", vi: "Phân biệt: công bằng theo tiêu chí nào — đóng góp, rủi ro, thị trường, nhu cầu.", examples: [{ en: "Fair to whom, though? In terms of what they contribute to society, clearly not. But in market terms, a footballer earns a club far more money than one nurse earns a hospital.", vi: "Công bằng với ai đã? Xét theo đóng góp cho xã hội thì rõ là không. Nhưng xét theo thị trường, một cầu thủ đem về cho câu lạc bộ nhiều tiền hơn một y tá đem về cho bệnh viện rất nhiều." }] },
          { formula: "⑤ That's a fair exception, but it doesn't follow that + quy tắc chung sai. + cách xử lý ngoại lệ.", vi: "Nhận ca cực đoan nhưng giữ quy tắc: ngoại lệ cần một biện pháp riêng, không cần bỏ quy tắc.", examples: [{ en: "That's a fair exception, but it doesn't follow that the charge is wrong. It just means there should be a discount for people on low incomes.", vi: "Đó là một ngoại lệ hợp lý, nhưng không vì thế mà khoản phí là sai. Nó chỉ có nghĩa là nên có mức giảm cho người thu nhập thấp." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — bốn cách phản biện làm mất điểm",
        items: [
          "Gỡ bẫy rồi dừng: “I don't think that's true.” — hết. Giám khảo phải hỏi lại ⇒ FC tụt. Luật: **một câu gỡ, ba – bốn câu trả lời**.",
          "Gay gắt: ~~Your question is wrong.~~ · ~~That's a stupid assumption.~~ Dùng **I'm not sure I'd accept…** · **I'd question that slightly…**",
          "Gỡ MỌI câu hỏi. Năm câu Part 3 thì gỡ nhiều nhất **hai** — câu nào cũng phản biện nghe như né.",
          "Đổi sang trả lời một câu hỏi khác dễ hơn. Câu gỡ phải dẫn về đúng chủ đề giám khảo hỏi.",
        ],
      },
      { t: "rule", formula: "nghe chữ bẫy → MỘT câu gỡ (premise / one or the other / depends which / fair to whom / fair exception) → trả lời 3–4 câu → chốt", vi: "Phản biện câu hỏi là mở đầu, không phải câu trả lời." },

      /* ── 4 ── */
      { t: "h", text: "4. Cùng một câu hỏi — band 7 và band 8 đặt cạnh nhau" },
      {
        t: "dialogue",
        title: "Câu hỏi có tiền đề ngầm (kiểu ①)",
        lines: [
          { who: "Examiner", role: "examiner", text: "Why do people read so much less than they used to?", vi: "Vì sao ngày nay người ta đọc ít hơn trước nhiều như vậy?" },
          { who: "Candidate (band 7)", role: "a", text: "I think the main reason is technology. Nowadays people have smartphones and they prefer watching videos to reading books. Also, people are very busy with their work, so they don't have time to read. In my opinion, this is a big problem, because reading is very important for our knowledge.", vi: "Tôi nghĩ lý do chính là công nghệ. Ngày nay ai cũng có điện thoại và thích xem video hơn đọc sách. Ngoài ra mọi người bận việc nên không có thời gian đọc. Theo tôi đây là vấn đề lớn vì đọc rất quan trọng với kiến thức." },
          { who: "Candidate (band 8)", role: "candidate", text: "I'd question that slightly, actually. People may be reading fewer novels, but I suspect they read more words a day than ever — it's just messages, articles and subtitles rather than books. So the real change is in the kind of reading. What's probably been lost is the long, uninterrupted sort, where you follow one argument for two hundred pages, and I think that's largely because our phones train us to expect a new thing every few seconds. If you've ever tried to read a chapter with your phone on the table, you'll know what I mean.", vi: "Thật ra tôi hơi nghi ngờ điều đó. Người ta có thể đọc ít tiểu thuyết hơn, nhưng tôi ngờ rằng mỗi ngày họ đọc nhiều chữ hơn bao giờ hết — chỉ là tin nhắn, bài báo và phụ đề thay vì sách. Vậy thay đổi thật là ở KIỂU đọc. Cái có lẽ đã mất là kiểu đọc dài, liền mạch, theo một lập luận suốt hai trăm trang, và tôi nghĩ phần lớn là vì điện thoại dạy ta chờ một thứ mới sau vài giây. Nếu bạn từng cố đọc một chương sách với điện thoại đặt trên bàn thì bạn sẽ hiểu ý tôi." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC", "trả lời trong giả định; ba ý rời (technology · busy · important)", "một câu gỡ → phân biệt LOẠI đọc → nguyên nhân → ví dụ người nghe tự thấy; một mạch"],
          ["LR", "technology · very busy · big problem · very important", "question that slightly · uninterrupted · follow one argument · train us to expect"],
          ["GRA", "câu đơn + because / so", "may… but I suspect · What's probably been lost is… (câu chẻ) · If you've ever…, you'll know…"],
          ["P", "đều đều", "nhấn tương phản: fewer NOVELS — more WORDS · nối âm: question_that · read_a chapter"],
        ],
        caption: "Câu trả lời band 8 không dài hơn nhiều — nó đi sâu hơn vì không chấp nhận tiền đề",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hội thoại mẫu — bốn câu hỏi, ba kiểu bẫy" },
      { t: "p", text: "Chủ đề: **giao thông và thành phố**. Nghe cả bài một lượt, rồi nghe lại từng câu trả lời và gọi tên nước đi (①–⑤) trước khi đọc phần soi bên dưới." },
      {
        t: "dialogue",
        title: "Part 3 — Cities and transport",
        lines: [
          { who: "Examiner", role: "examiner", text: "Should cities spend money on roads or on public transport?", vi: "Thành phố nên chi tiền cho đường sá hay cho giao thông công cộng?" },
          { who: "Candidate", role: "candidate", text: "I don't think it really has to be one or the other, because a lot of public transport runs on roads. Buses are the obvious example. So I'd say the question is less about roads versus transport and more about who the road space is for. Personally, I'd give buses their own lanes before building anything new — it's cheap, and it makes the bus faster than the car, which is the only thing that really changes people's habits.", vi: "Tôi không nghĩ nhất thiết phải chọn một trong hai, vì rất nhiều phương tiện công cộng chạy trên đường. Xe buýt là ví dụ rõ nhất. Nên tôi cho rằng câu hỏi không hẳn là đường hay phương tiện công cộng, mà là không gian đường dành cho ai. Riêng tôi thì sẽ cho xe buýt làn riêng trước khi xây thêm gì — rẻ, và nó làm xe buýt nhanh hơn ô tô, điều duy nhất thật sự thay đổi thói quen người ta." },
          { who: "Examiner", role: "examiner", text: "But what about people in the countryside who have no bus at all?", vi: "Nhưng còn những người ở nông thôn hoàn toàn không có xe buýt thì sao?" },
          { who: "Candidate", role: "candidate", text: "That's a fair exception, and it's a big one in a country like mine. But it doesn't follow that cities should keep building roads. Rural areas need a different solution — demand-responsive minibuses, maybe, which you book the day before. What works in a dense city simply doesn't work where the nearest neighbour is two kilometres away.", vi: "Đó là một ngoại lệ hợp lý, và là ngoại lệ lớn ở một nước như nước tôi. Nhưng không vì thế mà các thành phố nên tiếp tục xây đường. Nông thôn cần một giải pháp khác — có lẽ là xe buýt nhỏ chạy theo nhu cầu, đặt trước một ngày. Cái chạy được ở thành phố đông đúc đơn giản là không chạy được ở nơi hàng xóm gần nhất cách hai cây số." },
          { who: "Examiner", role: "examiner", text: "Is it fair to charge drivers extra for entering the city centre?", vi: "Thu thêm phí của người lái xe vào trung tâm có công bằng không?" },
          { who: "Candidate", role: "candidate", text: "Fair to whom, though? For the person who has to drive in, it feels like a punishment. But for the people who live in the centre and breathe the fumes, it's arguably the first fair thing that's happened. I'd say it's fair in principle, provided the money goes back into the buses rather than disappearing into the general budget.", vi: "Công bằng với ai đã? Với người buộc phải lái xe vào, nó giống một hình phạt. Nhưng với những người sống ở trung tâm và hít khói xe, có thể nói đó là điều công bằng đầu tiên xảy ra. Tôi cho là về nguyên tắc thì công bằng, với điều kiện tiền thu được quay lại đầu tư cho xe buýt chứ không biến vào ngân sách chung." },
          { who: "Examiner", role: "examiner", text: "So you think people should simply give up their cars?", vi: "Vậy bạn nghĩ người ta nên bỏ hẳn xe hơi?" },
          { who: "Candidate", role: "candidate", text: "Not quite — that's further than I'd go. I'm saying they should have a realistic choice. If the bus is quicker and cheaper for most journeys, people will use the car less without anyone telling them to, and the car becomes something you use for the trips that genuinely need it.", vi: "Không hẳn — tôi không đi xa đến thế. Tôi chỉ nói họ nên có một lựa chọn thực tế. Nếu xe buýt nhanh hơn và rẻ hơn cho phần lớn chuyến đi, người ta sẽ dùng xe hơi ít đi mà không cần ai bảo, và xe hơi trở thành thứ dùng cho những chuyến thật sự cần đến nó." },
        ],
      },
      {
        t: "note",
        title: "📌 Soi lại — nước đi nào ở câu nào",
        items: [
          "**Câu 1 (kiểu ②):** “doesn't really have to be one or the other” → chỉ ra chỗ hai lựa chọn giao nhau (xe buýt chạy trên đường) → đổi câu hỏi thành “đường dành cho ai” → trả lời cụ thể (làn xe buýt).",
          "**Câu 2 (kiểu ⑤):** “That's a fair exception… But it doesn't follow that…” → nhận ngoại lệ, giữ quy tắc, đề xuất cách xử lý riêng cho ngoại lệ.",
          "**Câu 3 (kiểu ④):** “Fair to whom, though?” → hai nhóm, hai câu trả lời → chốt **fair in principle, provided…** (một câu điều kiện của Ngày 19).",
          "**Câu 4:** không có bẫy kiểu mới — đây là diễn giải sai của Ngày 18 (“Not quite — that's further than I'd go”). Thí sinh không phản biện thêm lần nữa: nói lại lập trường gọn, có một câu điều kiện.",
          "Đếm: bốn câu hỏi, chỉ **ba** câu có câu gỡ, và cả ba đều có câu trả lời đầy đủ sau câu gỡ.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. 🔊 Phát âm: nối âm chuỗi band 8 trong cụm phản biện" },
      {
        t: "p",
        text: "Ngày 5 đã luyện nối 3–5 từ thành một chuỗi. Band 8 P: ==dùng các đặc điểm phát âm một cách linh hoạt, dễ hiểu suốt bài==. Cụm phản biện là chỗ cần nối âm nhất: nói rời từng chữ “I – am – not – sure” nghe cứng và gắt; nói liền “I'm not sure I'd…” nghe mềm và tự tin.",
      },
      {
        t: "table",
        head: ["Hiện tượng", "Ví dụ", "Nghe như"],
        rows: [
          ["Phụ âm + nguyên âm nối liền", "that's_a fair point · but_it · as_an exception", "/ðætsə/ · /bətɪt/ · /əzənɪk-/"],
          ["t / d giữa hai phụ âm gần như mất", "doesn't follow · I'd question that slightly · accept that", "/dʌzn fɒləʊ/ · /əksep ðæt/"],
          ["r chen (giọng Anh): nguyên âm + nguyên âm", "the idea of · sure I'd · law and order", "/aɪdɪər əv/ · /ʃɔːr aɪd/"],
          ["w chen: /uː, əʊ/ + nguyên âm", "true in principle · go along with · do it", "/truːwɪn/ · /ɡəʊwəlɒŋ/"],
          ["j chen: /iː, aɪ, eɪ/ + nguyên âm", "I agree · the other · say it", "/aɪjəɡriː/ · /ðijʌðə/ · /seɪjɪt/"],
          ["hai phụ âm giống nhau gộp một", "that time · fair rule · not to", "/ðætaɪm/ (giữ hơi lâu hơn)"],
        ],
        caption: "Sáu hiện tượng trong một câu phản biện 6–8 từ",
      },
      {
        t: "phatam",
        id: "t5d23-phat-am",
        title: "Luyện phát âm — tám cụm phản biện, nói liền một hơi",
        note: "Mỗi câu đọc hai lần: lần một chậm, đánh dấu bằng mắt các chỗ nối trong bảng trên; lần hai ở tốc độ nói, một hơi, không ngắt giữa câu. Máy chấm từng âm — nếu chỗ nối bị chấm thiếu âm, đọc chậm lại một nhịp nhưng vẫn liền.",
        items: [
          { text: "That's a fair point, but it doesn't follow.", ipa: "ðæts ə feə pɔɪnt bət ɪt dʌznt fɒləʊ", vi: "Ý đó hợp lý, nhưng không vì thế mà suy ra được." },
          { text: "I'm not sure I'd accept the premise.", ipa: "aɪm nɒt ʃɔː aɪd əksept ðə premɪs", vi: "Tôi không chắc mình chấp nhận tiền đề ấy. (sure_r_I'd)" },
          { text: "It depends which group we're talking about.", ipa: "ɪt dɪpendz wɪtʃ ɡruːp wɪə tɔːkɪŋ əbaʊt", vi: "Còn tuỳ ta đang nói về nhóm nào." },
          { text: "I don't think it has to be one or the other.", ipa: "aɪ dəʊnt θɪŋk ɪt hæz tə biː wʌn ɔː ði ʌðə", vi: "Tôi không nghĩ phải chọn một trong hai. (the_j_other)" },
          { text: "It's true in principle, but not in practice.", ipa: "ɪts truː ɪn prɪnsəpl bət nɒt ɪn præktɪs", vi: "Về nguyên tắc thì đúng, nhưng thực tế thì không. (true_w_in)" },
          { text: "Fair to whom, though?", ipa: "feə tə huːm ðəʊ", vi: "Công bằng với ai đã?" },
          { text: "I'd accept that as an exception.", ipa: "aɪd əksept ðæt əz ən ɪksepʃn", vi: "Tôi chấp nhận đó là một ngoại lệ. (accep(t) that_as_an)" },
          { text: "The idea of a ban isn't new.", ipa: "ði aɪdɪə əv ə bæn ɪznt njuː", vi: "Ý tưởng cấm không phải mới. (idea_r_of)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d23-noi-noi-am",
        title: "Nối âm chuỗi — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Ở tốc độ nói thường, chữ t trong “doesn't follow” thường:", options: ["A  gần như mất — /dʌzn fɒləʊ/", "B  bật hơi rất rõ", "C  đọc thành /d/"], correct: 0, why: "t kẹp giữa n và f ⇒ gần như mất. Bật rõ t ở đây nghe như đang cãi nhau." },
          { q: "2. Giọng Anh chuẩn nói “the idea of” tự nhiên nhất là:", options: ["A  /ði aɪdɪə ʔ əv/ — ngắt giữa idea và of", "B  /ði aɪdɪər əv/ — chen /r/", "C  /ðə aɪdɪə əv/"], correct: 1, why: "Nguyên âm + nguyên âm ⇒ r chen (intrusive r) ở giọng Anh. Và the trước nguyên âm đọc /ði/." },
          { q: "3. “I agree” nối tự nhiên là:", options: ["A  /aɪ jəɡriː/", "B  /aɪ wəɡriː/", "C  /aɪ rəɡriː/"], correct: 0, why: "/aɪ/ kết bằng âm i ⇒ chen /j/." },
          { q: "4. Vì sao nên nói liền các cụm phản biện?", options: ["A  Để nói nhanh hơn giám khảo.", "B  Để lời phản biện nghe mềm, tự tin, không gắt — và P được chấm cao hơn.", "C  Vì giám khảo không chấm phần nội dung."], correct: 1, why: "Ngắt từng chữ “I – am – not – sure” làm câu phản biện nghe căng thẳng; nối liền nghe thân thiện và chủ động." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Kiểm tra — chọn câu mở đầu hợp nhất (6 câu)" },
      {
        t: "mcq",
        id: "t5d23-noi-kiem-tra",
        title: "Câu hỏi nào, nước đi nào",
        items: [
          { q: "1. “Why are people so much more selfish than in the past?”", options: ["A  “Because of money. People only care about money now.”", "B  “I'd question that slightly — I'm not sure people are more selfish, but I think we see selfish behaviour more because it's filmed and shared.”", "C  “Your question is not correct.”"], correct: 1, why: "Kiểu ① tiền đề ngầm ⇒ gỡ nhẹ + chuyển sang điều có lý hơn + sẽ trả lời tiếp. C gay gắt và dừng." },
          { q: "2. “Should old buildings be preserved or replaced with modern housing?”", options: ["A  “I don't think it has to be one or the other — a lot of old buildings can be turned into flats.”", "B  “Preserved, definitely, because history is important.”", "C  “It depends which group we're talking about.”"], correct: 0, why: "Kiểu ② hai lựa chọn giả ⇒ chỉ ra chỗ giao nhau. C là nước đi của kiểu ③ — không khớp câu hỏi." },
          { q: "3. “Are elderly people less able to use technology?”", options: ["A  “Yes, because they are old.”", "B  “It depends which elderly people we're talking about — a retired engineer and someone who never used a computer at work are very different cases.”", "C  “Fair to whom, though?”"], correct: 1, why: "Kiểu ③ khái quát quá rộng ⇒ chia nhóm." },
          { q: "4. “Is it right that parents can choose which school their child attends?”", options: ["A  “Right in what sense, though? For the family it's natural, but if everyone chooses the same few schools, the others are left with fewer resources.”", "B  “Yes, it's right.”", "C  “I'm not sure I'd accept the premise.”"], correct: 0, why: "Kiểu ④ câu hỏi giá trị ⇒ hỏi lại tiêu chí (right in what sense / fair to whom) rồi xét hai phía." },
          { q: "5. Giám khảo: “But what about people who work night shifts?” (bạn vừa ủng hộ cấm ồn sau 11 giờ đêm)", options: ["A  “Then the ban is a bad idea.”", "B  “That's a fair exception, but it doesn't follow that the rule is wrong — it just needs some flexibility, like quiet hours in the daytime in some buildings.”", "C  “They should change their job.”"], correct: 1, why: "Kiểu ⑤ ca cực đoan ⇒ nhận ngoại lệ, giữ quy tắc, xử lý ngoại lệ riêng. A bỏ lập trường quá dễ." },
          { q: "6. Bạn đã gỡ bẫy ở câu 1 và câu 2. Câu 3 không có bẫy rõ. Bạn nên:", options: ["A  Vẫn gỡ, để giữ phong cách.", "B  Trả lời thẳng theo khung bốn bước của Ngày 6.", "C  Hỏi giám khảo câu hỏi có bẫy không."], correct: 1, why: "Gỡ nhiều nhất hai câu; câu nào cũng phản biện thì nghe như né câu hỏi." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện",
        items: [
          "Trước khi bấm ghi: đọc câu hỏi, **gọi tên kiểu bẫy** (①–⑤) trong 3 giây. Câu nào không có bẫy thì trả lời thẳng.",
          "Mỗi câu 40–55 giây: một câu gỡ (nếu có) → 3–4 câu trả lời có lý do hoặc ví dụ → một câu chốt.",
          "Nghe lại: câu gỡ có nối âm liền không? Có câu nào gỡ xong mà quên trả lời?",
        ],
      },
      {
        t: "speak",
        id: "t5d23-noi-p3",
        part: "3",
        questions: [
          "Why has technology made people less patient?",
          "Should the main responsibility for children's diet lie with parents or with schools?",
          "Are people today less interested in politics than they used to be?",
          "Is it fair that famous entertainers earn far more than teachers?",
          "But what about people who genuinely cannot afford healthy food?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 23 ═══════════════════════════ */
  {
    id: "t5d23-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 23 — soát 6 lượt lần 3, tám bẫy suy luận, phản biện câu hỏi có bẫy (32 câu + 1 đoạn viết + 3 câu nói)",
    goal: "Tự kiểm lại cả ba bài của Ngày 23 bằng câu MỚI: bắt lỗi theo từng lượt soát, gọi tên bẫy trong một bài đọc ngắn, nhận ra kiểu bẫy của câu hỏi Part 3 — và tự soát một đoạn văn của chính mình trước khi nộp cho AI chấm.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Làm bài tập thế nào",
        items: [
          "Làm theo thứ tự I → IX; phần I–VII có đáp án tự chấm, phần VIII–IX do AI chấm.",
          "Mỗi câu sai: ghi vào sổ lỗi kèm **số lượt** (1–6) hoặc **số bẫy** (①–⑧). Cuối buổi đếm: lượt / bẫy nào xuất hiện nhiều nhất?",
          "Phần VIII bắt buộc soát 6 lượt TRƯỚC khi bấm chấm — rồi so: AI có tìm ra lỗi nào bạn bỏ sót không? Lỗi đó thuộc lượt nào?",
          "Ngày mai làm **Đề 11**: kết quả bài tập hôm nay quyết định hai “lượt của tôi” bạn mang vào phòng thi.",
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Ngày 23 trong một dòng",
        steps: [
          { label: "Viết", sub: "soát 6 lượt · bản 4 phút “3 + 2”" },
          { label: "Đọc", sub: "buộc phải suy ra ≠ có thể đúng · 8 bẫy" },
          { label: "Nói", sub: "một câu gỡ bẫy, rồi trả lời" },
          { label: "Ngày 24", sub: "Đề 11 — mang theo hai lượt và hai bẫy của bạn" },
        ],
      },

      { t: "h", text: "I. Lượt 1 — viết dạng đúng của động từ trong ngoặc (6 câu) — ôn Bài 1 mục 2" },
      {
        t: "quiz",
        id: "t5d23-bt-luot-1",
        kind: "fill",
        title: "Động từ tường thuật và động từ sau từ định lượng",
        items: [
          { q: "1. Every one of the new stations ___ (have) step-free access.", answers: ["has"], hint: "every one of ⇒ V số ít." },
          { q: "2. A study published last year ___ (find) that rents rose faster than wages.", answers: ["found"], hint: "Một nghiên cứu cụ thể, đã xong ⇒ quá khứ." },
          { q: "3. Half of the city's water ___ (come) from a single reservoir.", answers: ["comes"], hint: "half of + N không đếm được ⇒ V số ít." },
          { q: "4. Half of the city's residents ___ (live) within a kilometre of a park.", answers: ["live"], hint: "half of + N số nhiều ⇒ V số nhiều." },
          { q: "5. Since the 1990s, the number of independent bookshops ___ (fall) by a third.", answers: ["has fallen"], hint: "the number of ⇒ V số ít; since ⇒ hiện tại hoàn thành." },
          { q: "6. Some sociologists ___ (claim) that loneliness is a public-health problem.", answers: ["claim"], hint: "Lập luận còn đứng trên giấy ⇒ hiện tại đơn." },
        ],
      },

      { t: "h", text: "II. Lượt 2 – 4 — chọn câu đúng (6 câu) — ôn Bài 1 mục 3–4" },
      {
        t: "mcq",
        id: "t5d23-bt-luot-24",
        title: "Danh từ, ranh giới câu, so sánh",
        items: [
          { q: "1. Câu nào đúng?", options: ["A  The globalisation has made the travel cheaper.", "B  Globalisation has made travel cheaper.", "C  The globalisation has made travel cheaper."], correct: 1, why: "Hai danh từ trừu tượng nói chung ⇒ không the (lượt 2)." },
          { q: "2. Câu nào đúng?", options: ["A  The council cut the speed limit to 20 mph, which reduced accidents.", "B  The council cut the speed limit to 20 mph which reduced accidents.", "C  The council cut, the speed limit to 20 mph which reduced accidents."], correct: 0, why: "which chỉ cả việc giảm tốc độ ⇒ có phẩy (lượt 3)." },
          { q: "3. Câu nào đúng?", options: ["A  The population of Lagos is larger than London.", "B  The population of Lagos is larger than that of London.", "C  The population of Lagos is larger than those of London."], correct: 1, why: "population (số ít) ⇒ than that of (lượt 4)." },
          { q: "4. Câu nào đúng?", options: ["A  The exam results of girls were better than boys.", "B  The exam results of girls were better than those of boys.", "C  The exam results of girls were better than that of boys."], correct: 1, why: "results (số nhiều) ⇒ those of." },
          { q: "5. Câu nào hợp band 8 nhất?", options: ["A  The improvement of the provision of the training of teachers is necessary.", "B  Teacher training needs to be improved.", "C  Teacher training is needing improve."], correct: 1, why: "A: danh hoá quá đà (ba cụm the… of…). C sai động từ." },
          { q: "6. Câu nào đúng?", options: ["A  The plan is both popular with residents and it is affordable.", "B  The plan is both popular with residents and affordable.", "C  The plan both is popular with residents and affordable."], correct: 1, why: "both + adj and + adj — song song kép (lượt 4)." },
        ],
      },

      { t: "h", text: "III. Lượt 5 — gõ lại phần [trong ngoặc] cho rõ và đúng liều (4 câu) — ôn Bài 1 mục 5" },
      {
        t: "quiz",
        id: "t5d23-bt-luot-5",
        kind: "fill",
        title: "Tham chiếu và liều",
        items: [
          { q: "1. Several countries now tax sugary drinks. [This] has reduced consumption. — gõ lại: This + MỘT danh từ tóm", answers: ["This tax", "This policy", "This measure", "This levy"], hint: "this trơ ⇒ this + danh từ tóm." },
          { q: "2. A worker should be paid for [his] overtime.", answers: ["their"], hint: "Người chung chung ⇒ their." },
          { q: "3. [It might perhaps be possible that] the scheme will fail. — gõ lại MỘT cụm rào gọn, 3–4 từ", answers: ["It is possible that", "It may be that", "Possibly,", "It is likely that", "It might be that", "Perhaps"], hint: "Một chỗ rào cho một nhận định." },
          { q: "4. Teachers often criticise parents, but [they] are seldom asked for their views. (ý: phụ huynh ít được hỏi)", answers: ["parents"], hint: "they có thể chỉ teachers hoặc parents ⇒ lặp danh từ." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (4 câu) — ôn Bài 1 mục 2–5" },
      {
        t: "quiz",
        id: "t5d23-bt-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu đã qua 6 lượt",
        grammar: "từ định lượng + V · than that of · , which · this + N",
        items: [
          { q: "Phần lớn số tiền được chi cho các bệnh viện lớn.", answers: ["Most of the money is spent on large hospitals.", "The majority of the money is spent on large hospitals.", "Most of the money goes to large hospitals.", "Most of the money is spent on big hospitals.", "The bulk of the money is spent on large hospitals."], hint: "most of / the majority of + N không đếm được + V số ít" },
          { q: "Giá điện ở Đức cao hơn giá điện ở Pháp.", answers: ["The price of electricity in Germany is higher than that in France.", "Electricity prices in Germany are higher than those in France.", "The price of electricity in Germany is higher than in France.", "Electricity in Germany is more expensive than in France.", "The cost of electricity in Germany is higher than that in France."], hint: "than that in / those in" },
          { q: "Chính phủ tăng học phí, điều này khiến số sinh viên đăng ký giảm.", answers: ["The government raised tuition fees, which led to a fall in applications.", "The government increased tuition fees, which reduced the number of applications.", "The government raised tuition fees, which caused applications to fall.", "The government raised tuition fees, which led to a drop in student applications.", "The government increased tuition fees, which led to a decline in applications."], hint: ", which + V" },
          { q: "Nhiều công ty cho nhân viên làm bốn ngày một tuần. Cách làm này vẫn còn gây tranh cãi.", answers: ["Many companies let their staff work four days a week. This practice is still controversial.", "Many companies allow employees to work four days a week. This practice remains controversial.", "Many firms let staff work four days a week. This arrangement is still controversial.", "Many companies allow their employees to work a four-day week. This practice remains controversial.", "Many companies let employees work four days a week. This approach is still controversial."], hint: "This practice / arrangement + V" },
        ],
      },

      { t: "h", text: "V. Đọc — một bài ngắn, năm bẫy (5 câu · 7 phút) — ôn Bài 2 mục 3" },
      {
        t: "passage",
        title: "Louder, Higher, Later",
        intro: "Bài tự soạn. Hai nghiên cứu được nhắc tới là có thật, kể gọn, không nêu tên tác giả; nhận định là của người viết.",
        paras: [
          { label: "A", text: "For a songbird, a song is both an advertisement and a warning: it attracts a mate and keeps rivals away. In the early 2000s, researchers recording great tits in a Dutch city noticed that birds in the noisiest districts sang at a higher pitch than those in quieter ones. The obvious explanation was that low notes were being drowned out by traffic, whose rumble occupies the lower frequencies." },
          { label: "B", text: "It is tempting to call this an adaptation, and many popular accounts do. I would be more cautious. A bird that changes its song within a single season is adjusting, not evolving, and we do not yet know whether higher songs are as attractive to females as lower ones. Some evidence suggests that they are not: in at least one species, females have been found to prefer the deeper songs that urban males find hardest to make heard. If that is generally true, city birds may be paying a price simply to be heard at all." },
          { label: "C", text: "A second response is to change the time of singing. A study in an English city found robins singing at night in places that were noisy during the day — a habit that had once been blamed on street lighting. Light, it turned out, explained far less of the pattern than daytime noise did." },
          { label: "D", text: "None of this means that cities are simply bad for birds; some species do remarkably well in them. But a bird that sings louder, higher or later is not necessarily a bird that is thriving. It may be a bird that is coping." },
        ],
      },
      {
        t: "mcq",
        id: "t5d23-bt-doc",
        title: "Questions 1–5 — gọi tên bẫy sau khi chấm",
        items: [
          { q: "1. (TFNG) Great tits in the noisiest districts sang at a lower pitch than those in quieter areas.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Bẫy ② đảo chiều so sánh: bài nói HIGHER pitch." },
          { q: "2. (YNNG) The change in the great tits' songs is an example of evolution.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Bẫy ⑤: “many popular accounts” gọi là adaptation; tác giả: “adjusting, not evolving” ⇒ NO." },
          { q: "3. What does the writer suggest in paragraph B?", options: ["A  Urban females prefer higher songs.", "B  Singing higher may make urban males less attractive to females.", "C  Urban males cannot sing low notes at all.", "D  Higher songs are louder than lower ones."], correct: 1, why: "Bẫy ⑦: “If that is generally true, city birds may be paying a price” — một giả định có điều kiện, đúng mức “may”. A đảo ngược; C quá mạnh (hardest to make heard ≠ cannot sing)." },
          { q: "4. (TFNG) Street lighting was the main reason robins sang at night.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Bẫy ④: “had once been blamed on street lighting” — niềm tin CŨ; “Light… explained far less… than daytime noise” ⇒ FALSE." },
          { q: "5. The writer's main point in paragraph D is that", options: ["A  cities are harmful to all bird species.", "B  a change in song shows that a bird is doing well.", "C  changes in song may be a sign of struggling rather than success.", "D  most birds eventually leave cities."], correct: 2, why: "“not necessarily a bird that is thriving. It may be a bird that is coping.” A dính bẫy ⑥ (None of this means… = KHÔNG có nghĩa là có hại cho mọi loài)." },
        ],
      },

      { t: "h", text: "VI. Câu hỏi Part 3 này có bẫy kiểu nào? (5 câu) — ôn Bài 3 mục 2–3" },
      {
        t: "mcq",
        id: "t5d23-bt-kieu-bay",
        title: "Gọi tên kiểu bẫy",
        items: [
          { q: "1. “Why do young people no longer respect the elderly?”", options: ["① Tiền đề ngầm", "② Hai lựa chọn giả", "④ Câu hỏi giá trị"], correct: 0, why: "Why + một nhận định chưa được chứng minh (young people no longer respect…)." },
          { q: "2. “Is it acceptable for companies to read their employees' emails?”", options: ["③ Khái quát quá rộng", "④ Câu hỏi giá trị", "⑤ Ca cực đoan"], correct: 1, why: "acceptable = từ phán xét ⇒ hỏi lại tiêu chí: acceptable in what circumstances / to whom." },
          { q: "3. “Should children learn practical skills at home or at school?”", options: ["② Hai lựa chọn giả", "① Tiền đề ngầm", "⑤ Ca cực đoan"], correct: 0, why: "A or B ⇒ “I don't think it has to be one or the other”." },
          { q: "4. “But what about people who have to work three jobs?” (bạn vừa nói ai cũng nên tập thể dục mỗi ngày)", options: ["③ Khái quát quá rộng", "⑤ Ca cực đoan", "② Hai lựa chọn giả"], correct: 1, why: "But what about… + một ngoại lệ cực đoan ⇒ fair exception, but it doesn't follow that…" },
          { q: "5. “Do people in cities care less about their neighbours?”", options: ["③ Khái quát quá rộng", "④ Câu hỏi giá trị", "② Hai lựa chọn giả"], correct: 0, why: "people in cities = cả trăm triệu người ⇒ “It depends which people / which cities…”" },
        ],
      },

      { t: "h", text: "VII. Nối âm (2 câu) — ôn Bài 3 mục 6" },
      {
        t: "mcq",
        id: "t5d23-bt-noi-am",
        title: "Nối âm chuỗi",
        items: [
          { q: "1. Trong “go along with it”, giữa go và along chen âm:", options: ["A  /w/", "B  /j/", "C  /r/"], correct: 0, why: "/əʊ/ kết bằng âm u ⇒ chen /w/: /ɡəʊwəlɒŋ/." },
          { q: "2. “I'd accept that as an exception” nói liền tự nhiên nhất:", options: ["A  /aɪd əksept ðæt əz ən ɪksepʃn/ — bật đủ mọi t, ngắt giữa các từ", "B  /aɪdəksep ðætəzənɪksepʃn/ — t của accept gần như mất, that_as_an nối liền", "C  /aɪ əksep ðæ əz ə ɪksepʃn/ — bỏ hết phụ âm cuối"], correct: 1, why: "t giữa hai phụ âm (accept that) gần như mất; phụ âm + nguyên âm (that_as_an_exception) nối liền. C bỏ quá đà, mất d và n." },
        ],
      },

      { t: "h", text: "VIII. Viết — một khổ thân bài Task 2 (150–180 từ), tự soát 6 lượt trước khi nộp — ôn Bài 1" },
      {
        t: "note",
        title: "💡 Quy trình",
        items: [
          "Viết 15 phút, không dừng sửa.",
          "Soát 6 lượt đầy đủ (8 phút) — mỗi lỗi tự tìm thấy, ghi số lượt bên lề nháp.",
          "Rồi mới bấm chấm. Lỗi AI tìm ra mà bạn không thấy = ứng viên cho “lượt của tôi”.",
        ],
      },
      {
        t: "essay",
        id: "t5d23-bt-viet",
        task: "Task 2",
        minWords: 150,
        prompt: "Write ONE body paragraph (150–180 words) for this essay question: “Some people think that cities should make public transport free for everyone. To what extent do you agree or disagree?” Your paragraph should contain at least one comparison (than that of / those of), one sentence with “, which” referring to a whole clause, and one “this + noun”. Before submitting, check it using the six passes from Day 23.",
        tips: [
          "Lượt 1: động từ sau the number of / the majority of / each of.",
          "Lượt 4: mọi than đều so hai thứ cùng loại.",
          "Lượt 5: this + danh từ tóm; một câu, một chỗ rào.",
          "Lượt 6: đọc ngược từ câu cuối lên tìm chính tả.",
        ],
      },

      { t: "h", text: "IX. Nói 3 câu Part 3 — ghi âm, AI chấm — ôn Bài 3" },
      {
        t: "speak",
        id: "t5d23-bt-noi",
        part: "3",
        questions: [
          "Why are people so much less healthy than previous generations?",
          "Should governments or individuals pay for the cost of retraining older workers?",
          "Is it right for schools to ban mobile phones completely?",
        ],
      },
    ],
  },
];
