/**
 * IELTS Tập 5 — Ngày 1 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Ngữ pháp band 8: lộ trình Tập 5 (4 đề: Đề 9 · 10 · 11 · 12) · kiểm soát thì tuyệt đối · hedging đúng liều ·
 *                     danh hoá có chọn lọc · “nhiều cấu trúc, đa số câu không lỗi”                    [G22 G39 G41 · W01 X07]
 *                     — nối Tập 4 Ngày 3 (thì trong văn học thuật) · Ngày 13 (hedging) · Ngày 21 (danh hoá mức 2)
 *   Bài 2 (reading)   Reading band 8: một passage lập luận ~1.000 từ, 14 câu, 15 phút, ĐỌC MỘT LẦN (MCQ · YNNG · Summary) [R20]
 *                     — nối Tập 4 Ngày 1 (bản đồ lập luận, paraphrase mức 3–4) · Ngày 13 · 21 · 27 (nhịp 17 – 20 – 23)
 *   Bài 3 (listening) Part 1 tốc độ thật (~175 từ/phút), giọng trộn New Zealand + Canada, Form completion 10 câu  [L03 L17]
 *                     — nối Tập 4 Ngày 1 (Part 1 “quá dễ để sai”) · Tập 2 Ngày 7 (flap /t/ giọng Mỹ) · Tập 3 Ngày 24 (giọng NZ)
 *                     🔊 flap /t/ và glottal stop — nhận biết
 *   Bài tập Ngày 1    45 câu có đáp án + 1 đoạn viết
 * Mọi id bắt đầu `t5d1-`. Dữ kiện trong bài đọc (Rozenblit & Keil 2002; Lawson 2006; Fernbach và cộng sự 2013; Sloman & Fernbach)
 * là nghiên cứu có thật, số liệu chi tiết đã làm mờ; hội thoại, tên cửa hàng, địa chỉ là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_1: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d1-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp band 8: kiểm soát thì tuyệt đối, hedging đúng liều, danh hoá có chọn lọc — “nhiều cấu trúc, đa số câu không lỗi”",
    goal: "Biết Tập 5 đi qua 4 đề (Đề 9 → Đề 12) thế nào; viết được một đoạn học thuật 6–8 câu mà mọi lần đổi thì đều có lý do, mỗi nhận định chỉ rào đón một lần và đúng mức, danh hoá chỉ ở chỗ giúp mạch văn — tức đúng mô tả GRA band 8: nhiều loại cấu trúc, đa số câu không có lỗi.",
    minutes: 105,
    blocks: [
      {
        t: "recap",
        items: [
          "Tập 5 = **30 ngày, 4 đề đủ 4 kỹ năng** ở Online Test: ==Đề 9 (Ngày 8) → Đề 10 (Ngày 16) → Đề 11 (Ngày 24) → Đề 12 “Final” (Ngày 30)==. Ngày sau mỗi đề là ngày **mổ đề**.",
          "Band 7 → 8 ở ngữ pháp **không** cần cấu trúc mới. Mô tả band 8 là: ==dùng nhiều loại cấu trúc; đa số câu không lỗi; chỉ thỉnh thoảng sai lặt vặt==. Việc của hôm nay là **sạch lỗi** ở ba chỗ người band 7 còn trượt.",
          "**Thì**: mỗi lần đổi thì trong một đoạn phải trả lời được “vì sao đổi”. Bốn bẫy: since / in recent years · mệnh đề thời gian tương lai · By + mốc · động từ trạng thái.",
          "**Hedging**: một nhận định — một lần rào đón — đúng mức bằng chứng. Thesis (ý kiến của bạn) thì **không** rào.",
          "**Danh hoá**: nén khi nó ==nối lại câu trước== (This decline…) hoặc khi tác nhân không quan trọng; trả về động từ khi thấy chuỗi of… of… of….",
          "Cuối bài bạn tự đếm **tỉ lệ câu sạch** trong một đoạn của chính mình — con số theo bạn suốt Tập 5.",
        ],
      },

      /* ── 0 ── */
      { t: "h", text: "0. Tập 5 đi thế nào — 30 ngày, 4 đề, 5 ngày mổ đề" },
      {
        t: "p",
        text: "Tập 4 đưa bạn tới band 7: ý kiến rõ suốt bài, nói dài không gắng sức, làm được Passage 3 và Part 4. Tập 5 không dạy thêm nhiều kiến thức. Nó làm một việc: ==đo — mổ — sửa==, lặp bốn vòng. Mỗi vòng kết thúc bằng một đề đủ 4 kỹ năng, khó hơn đề trước.",
      },
      {
        t: "table",
        head: ["Đề", "Làm ở", "Mức", "Mổ đề ở", "Mục tiêu Nghe · Đọc"],
        rows: [
          ["**Đề 9**", "Ngày 8", "band 7.0–7.5", "Ngày 9 (Đọc + Nghe) · Ngày 10 (Viết + Nói)", "32/40 · 32/40"],
          ["**Đề 10**", "Ngày 16", "band 7.5", "Ngày 17 (Đọc) · Ngày 22 (Nói)", "33/40 · 33/40"],
          ["**Đề 11**", "Ngày 24", "band 8.0", "Ngày 25 (Đọc + Nghe)", "35/40 · 35/40"],
          ["**Đề 12 “Final”**", "Ngày 30", "band 8.0", "tự mổ theo mẫu Ngày 25", "35/40 · 35/40"],
        ],
        caption: "Bốn đề của Tập 5 — làm ở Online Test (/language/en/ielts/thi-may), đúng giờ, một mạch",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Một vòng của Tập 5 (lặp 4 lần)",
        steps: [
          { label: "Học 6–7 ngày", sub: "mỗi ngày 3 bài + bài tập; kiểm tra chặng ở Ngày 6 · 12 · 18 · 24 · 30" },
          { label: "Làm đề", sub: "đúng giờ, không tra từ, không dừng băng" },
          { label: "Mổ đề", sub: "mỗi câu sai: vì paraphrase, bẫy, chính tả hay hết giờ?" },
          { label: "Ghi Sổ lỗi", sub: "lỗi nào lặp 2 lần = lỗi dai dẳng → ôn đúng Ngày đã dạy" },
          { label: "Viết lại · nói lại", sub: "tới khi bài Viết còn 0–1 lỗi" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học Tập 5 — bốn thói quen khác Tập 4",
        items: [
          "**Đếm, đừng cảm.** Mỗi bài Viết: đếm số câu, số câu sạch lỗi. Mỗi bài Đọc / Nghe: ghi điểm thô và giờ thực tế. Không có số thì không biết mình tiến hay lùi.",
          "**Đọc một lần, nghe một lần.** Từ hôm nay, bài đọc 900–1.000 từ làm trong 15 phút; bài nghe không tua lại trước khi chấm.",
          "**Mẫu band 7 và band 8 đặt cạnh nhau** ở mọi bài Viết / Nói. Việc của bạn là chỉ ra được ==chỗ khác==, rồi mới viết.",
          "**Từ vựng**: tiếp tục **Lộ trình từ vựng theo ngày** trong app (chặng C1–C2) và các bộ Flashcards “Từ của khoá — Tập 2 · 3 · 4” (nơi chứa trọn AWL). Ngày mai (Ngày 2) là buổi kiểm tra trọn 570 họ từ.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Band 7 và band 8 khác nhau ở chữ nào (tiêu chí GRA)" },
      {
        t: "table",
        head: ["", "Band 7", "Band 8"],
        rows: [
          ["Phạm vi cấu trúc", "nhiều cấu trúc phức", "**phạm vi rộng** — dùng linh hoạt, đúng chỗ"],
          ["Độ chính xác", "câu không lỗi xuất hiện **thường xuyên**", "**đa số** câu không lỗi"],
          ["Lỗi còn lại", "vẫn còn **một số** lỗi ngữ pháp, dấu câu", "chỉ **rất thỉnh thoảng** sai lặt vặt"],
          ["Nói (Speaking)", "thường không lỗi; còn vài lỗi **dai dẳng**", "đa số câu không lỗi; sai vặt rất hiếm"],
        ],
        caption: "Diễn đạt lại từ bảng mô tả band công khai của IELTS",
      },
      {
        t: "p",
        text: "Hai chữ đổi: **thường xuyên → đa số**, và **một số lỗi → rất thỉnh thoảng**. Khoá dùng một thước đo dễ làm: ==tỉ lệ câu sạch== = số câu không có lỗi nào ÷ tổng số câu. Một bài Task 2 có khoảng 12–14 câu. Ở band 7, thường 8–9 câu sạch. Muốn chạm band 8, cần khoảng 11–12 câu sạch, và lỗi còn lại phải là lỗi nhỏ (một mạo từ, một dấu phẩy), không phải lỗi thì hay lỗi cấu trúc. Đây là ước lượng của khoá để bạn tự theo dõi, không phải công thức chấm chính thức.",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: “nhiều cấu trúc” KHÔNG có nghĩa là nhồi cấu trúc",
        items: [
          "Giám khảo đọc **phạm vi** qua cả bài: có mệnh đề quan hệ, phân từ, điều kiện, bị động, danh ngữ… dùng tự nhiên. Không ai đếm số câu đảo ngữ.",
          "Một cấu trúc hiếm dùng **sai chỗ** (đảo ngữ cho một ý tầm thường) làm bài nghe gượng, kéo cả CC lẫn GRA xuống.",
          "Thứ tự ưu tiên ở Tập 5: ==đúng → rõ → đa dạng==. Câu đúng và rõ đã là câu band 8; đa dạng đến sau.",
        ],
      },
      {
        t: "quiz",
        id: "t5d1-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 4 Ngày 3 · 13 · 21 (6 câu)",
        items: [
          { q: "The number of people living alone ___ (rise) steadily since the 1970s.", answers: ["has risen", "has been rising"], hint: "since + mốc → hiện tại hoàn thành (Tập 4 Ngày 3 · mục 2)." },
          { q: "By 2015, the proportion ___ (already / double).", answers: ["had already doubled"], hint: "By + mốc QUÁ KHỨ → quá khứ hoàn thành (Tập 4 Ngày 3 · mục 5)." },
          { q: "Viết lại bằng MỘT động từ rào đón: Older people are always against change. → Older people ___ to resist change.", answers: ["tend"], hint: "tend to + V = thường có xu hướng (Tập 4 Ngày 13 · mục 2)." },
          { q: "It is widely believed ___ sugar causes hyperactivity. (MỘT từ)", answers: ["that"], hint: "It is believed that + mệnh đề (Tập 4 Ngày 13 · mục 4)." },
          { q: "Danh hoá: Prices rose sharply. → There was a sharp ___ in prices.", answers: ["rise", "increase"], hint: "động từ → danh từ; trạng từ → tính từ (Tập 4 Ngày 21 · mục 1)." },
          { q: "Điền giới từ: our growing reliance ___ imported energy", answers: ["on"], hint: "rely on → reliance on. Giới từ đi theo từ gốc." },
        ],
      },
      { t: "rule", formula: "band 8 GRA  =  phạm vi rộng  +  đa số câu sạch lỗi  +  lỗi còn lại rất nhỏ, rất hiếm", vi: "Tự đo bằng tỉ lệ câu sạch: mục tiêu 11–12 câu sạch trong một bài Task 2 khoảng 13 câu." },

      /* ── 2 ── */
      { t: "h", text: "2. Kiểm soát thì ① — bản đồ thì của một bài viết" },
      {
        t: "p",
        text: "Ở band 7 bạn đã biết từng thì. Lỗi còn lại không nằm ở kiến thức mà ở chỗ ==trượt tay khi câu dài==. Cách chữa: trước khi viết, biết trước mỗi loại câu trong bài dùng thì gì. Đây là bản đồ đó.",
      },
      {
        t: "table",
        head: ["Loại câu", "Thì", "Ví dụ"],
        rows: [
          ["Sự thật chung, lập luận (Task 2)", "hiện tại đơn", "Public transport **reduces** congestion only if it **is** reliable."],
          ["Xu hướng kéo tới bây giờ", "hiện tại hoàn thành", "Online shopping **has become** the norm in many cities."],
          ["Ví dụ đã xong, có mốc", "quá khứ đơn", "When Sweden **introduced** the tax in 1991, emissions **fell**."],
          ["Việc xong TRƯỚC một mốc quá khứ", "quá khứ hoàn thành", "By 2010, the figure **had** already **halved**."],
          ["Hệ quả giả định", "would / could + V", "A total ban **would** simply **push** the trade underground."],
          ["Dự đoán", "will · be likely to + V", "Demand **is likely to grow** as the population ages."],
          ["Dự báo trong Task 1", "be projected / expected to + V", "Sales **are projected to reach** 5 million by 2040."],
          ["Dẫn một nghiên cứu", "phát hiện: quá khứ · ý rút ra: hiện tại", "A 2019 survey **found** that most commuters **prefer** flexible hours."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + has / have + V3 + over the past … / in recent years / since …",
            vi: "Xu hướng bắt đầu trong quá khứ và còn liên quan tới bây giờ.",
            examples: [
              { en: "Over the past two decades, universities have come to depend heavily on tuition fees.", vi: "Trong hai thập kỷ qua, các trường đại học đã dần phụ thuộc nặng vào học phí." },
            ],
          },
          {
            formula: "When / After + S + V2 (mốc), S + V2",
            vi: "Một ví dụ có mốc thời gian rõ: cả hai vế quá khứ đơn. Không dùng hiện tại hoàn thành.",
            examples: [
              { en: "When the city pedestrianised its centre in 2012, shop rents rose within two years.", vi: "Khi thành phố biến khu trung tâm thành phố đi bộ năm 2012, tiền thuê cửa hàng tăng trong vòng hai năm." },
            ],
          },
          {
            formula: "S + V2 + that + S + V(s/es)",
            vi: "Phát hiện xảy ra trong quá khứ (found), nhưng điều phát hiện vẫn đúng nên giữ hiện tại.",
            examples: [
              { en: "The study found that children who read for pleasure perform better in every subject.", vi: "Nghiên cứu phát hiện rằng trẻ đọc sách vì thích học tốt hơn ở mọi môn." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai — vì tiếng Việt không chia thì",
        items: [
          "~~In recent years, the number of cars increased.~~ → **has increased**. “In recent years” kéo tới bây giờ.",
          "~~Online shopping has started in the 1990s.~~ → **started**. Có mốc đã qua (in the 1990s) thì không dùng hiện tại hoàn thành.",
          "~~A 2019 survey finds that…~~ khi kể một khảo sát cụ thể có năm → **found**. (Hiện tại “finds / shows” chỉ dùng khi nhắc tới nghiên cứu như một nguồn chung: Research shows that…)",
          "~~If the government bans cars, people will angry.~~ — lỗi này hiếm ở band 7, nhưng ~~people would be angry~~ lẫn với ~~will be~~ trong cùng một đoạn thì còn nhiều: đã chọn giả định (would) thì giữ **would** tới hết ý.",
          "Task 1 không có năm → hiện tại đơn suốt bài. Có năm quá khứ → quá khứ đơn suốt bài. Đừng trộn.",
        ],
      },
      { t: "rule", formula: "sự thật = V(s/es)  ·  xu hướng tới nay = have/has + V3  ·  ví dụ có mốc = V2  ·  trước mốc đó = had + V3  ·  giả định = would + V", vi: "Trước khi viết mỗi câu, hỏi: câu này thuộc loại nào trong bản đồ?" },
      {
        t: "quiz",
        id: "t5d1-ban-do-thi-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bản đồ thì (5 câu)",
        grammar: "has/have + V3 (xu hướng) · V2 (mốc quá khứ) · found that + hiện tại · would + V",
        items: [
          { q: "Trong những năm gần đây, làm việc từ xa đã trở nên phổ biến hơn nhiều.", answers: ["In recent years, remote work has become far more common.", "In recent years, working remotely has become much more common.", "In recent years, remote working has become much more common."], hint: "in recent years · remote work · far more common" },
          { q: "Khi thành phố mở tuyến tàu điện ngầm đầu tiên vào năm 2021, lượng xe máy trên đường giảm.", answers: ["When the city opened its first metro line in 2021, the number of motorbikes on the roads fell.", "When the city opened its first metro line in 2021, the number of motorbikes on the road fell."], hint: "open · metro line · the number of · fall" },
          { q: "Một khảo sát năm 2022 phát hiện rằng phần lớn sinh viên thích học trực tiếp hơn.", answers: ["A 2022 survey found that most students prefer face-to-face learning.", "A 2022 survey found that the majority of students prefer face-to-face classes.", "A 2022 survey found that most students prefer learning in person."], hint: "survey · found that · prefer · face-to-face" },
          { q: "Đến năm 2015, số người hút thuốc đã giảm một nửa.", answers: ["By 2015, the number of smokers had halved.", "By 2015, the number of smokers had fallen by half."], hint: "By 2015 · had + V3 · halve" },
          { q: "Một lệnh cấm hoàn toàn sẽ chỉ đẩy việc buôn bán này vào bí mật.", answers: ["A total ban would simply push the trade underground.", "A complete ban would simply drive the trade underground.", "A total ban would only push this trade underground."], hint: "a total ban · would · push … underground" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Kiểm soát thì ② — bốn chỗ người band 7 vẫn trượt" },
      {
        t: "table",
        head: ["Bẫy", "Sai", "Đúng", "Vì sao"],
        rows: [
          ["① Mệnh đề thời gian nói về tương lai", "~~Once the law **will come** into force, prices will rise.~~", "Once the law **comes** into force, prices will rise.", "Sau when / once / until / as soon as / by the time / before / after: **hiện tại**, không will."],
          ["② By + mốc tương lai", "~~By 2050, the population **will double**.~~", "By 2050, the population **will have doubled**.", "By = “tính tới lúc đó đã xong” → will have + V3. (will double chỉ đúng với **in** 2050 / **over** the next 30 years.)"],
          ["③ By the time + quá khứ", "~~By the time help arrived, the fire **destroyed** the roof.~~", "By the time help arrived, the fire **had destroyed** the roof.", "Việc xảy ra trước một mốc quá khứ → had + V3."],
          ["④ Động từ trạng thái", "~~More people **are believing** / the board **is consisting of**…~~", "More people **believe** / the board **consists of**…", "believe, know, own, belong, consist, contain, depend, seem, involve (= bao gồm): không dùng tiếp diễn."],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "By + mốc tương lai, S + will have + V3",
            vi: "Câu dự báo ăn điểm trong Task 1 có số liệu dự báo.",
            examples: [
              { en: "By 2040, wind power will have overtaken gas as the main source of electricity.", vi: "Đến năm 2040, điện gió sẽ đã vượt khí đốt để thành nguồn điện chính." },
              { en: "The share of over-65s is projected to have doubled by the middle of the century.", vi: "Tỉ lệ người trên 65 tuổi được dự báo sẽ tăng gấp đôi vào giữa thế kỷ." },
            ],
          },
          {
            formula: "Once / Until / As soon as + S + V(s/es) hoặc has + V3, S + will + V",
            vi: "Muốn nhấn “xong hẳn rồi mới…” thì dùng hiện tại hoàn thành trong mệnh đề thời gian.",
            examples: [
              { en: "Until cheaper batteries are available, electric cars will remain a minority choice.", vi: "Chừng nào chưa có pin rẻ hơn, xe điện vẫn sẽ là lựa chọn của số ít." },
              { en: "Once the bridge has been completed, journey times will fall by half.", vi: "Một khi cây cầu được xây xong, thời gian đi lại sẽ giảm một nửa." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh ở band 7.5",
        items: [
          "**since** có hai nghĩa. since 2010 (từ khi) → hiện tại hoàn thành. Since prices are high (bởi vì) → thì nào cũng được. Đừng thấy since là chia hoàn thành.",
          "**It is the first time** + hiện tại hoàn thành: This is the first time the party **has lost** the capital — không phải ~~loses~~.",
          "**have + V3** với mốc đã qua vẫn là lỗi dai dẳng nhất: ~~has risen in 2015~~, ~~have built last year~~. Soát riêng một lượt chỉ để tìm lỗi này.",
          "Động từ trạng thái dùng tiếp diễn được khi đổi nghĩa: I **am thinking of** moving (đang cân nhắc) — nhưng I **think** that… (cho rằng).",
        ],
      },
      { t: "rule", formula: "when / once / until + S + V(s/es)  ·  By + mốc tương lai → will have + V3  ·  By the time + V2 → had + V3", vi: "Sau từ nối thời gian không có will; By luôn đi với thì hoàn thành." },
      {
        t: "quiz",
        id: "t5d1-bon-bay",
        kind: "fill",
        title: "Chia động từ trong ngoặc (8 câu)",
        items: [
          { q: "As soon as the new line ___ (open), commuting times will fall.", answers: ["opens", "has opened"], hint: "Mệnh đề thời gian tương lai → hiện tại, không will." },
          { q: "By the end of this decade, the company ___ (replace) its entire fleet with electric vans.", answers: ["will have replaced"], hint: "By + mốc tương lai → will have + V3." },
          { q: "By the time the report was published, the minister ___ (already / resign).", answers: ["had already resigned"], hint: "By the time + quá khứ → had + V3." },
          { q: "The committee ___ (consist) of twelve members, four of whom are elected.", answers: ["consists"], hint: "consist: động từ trạng thái, không tiếp diễn; committee số ít." },
          { q: "Since the charge was introduced, traffic in the centre ___ (fall) by a fifth.", answers: ["has fallen"], hint: "since + mốc → hiện tại hoàn thành." },
          { q: "This is the first time the city ___ (host) an international event of this size.", answers: ["has hosted"], hint: "It / This is the first time + hiện tại hoàn thành." },
          { q: "Unemployment ___ (peak) in 2009 and has been falling ever since.", answers: ["peaked"], hint: "in 2009: mốc đã qua → quá khứ đơn." },
          { q: "We will not know the full cost until the audit ___ (be) complete.", answers: ["is"], hint: "until + hiện tại." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Giữ thì trong MỘT đoạn — mỗi lần đổi phải có lý do" },
      {
        t: "p",
        text: "Đoạn dưới có **6 động từ đánh số**, mỗi chỗ một lỗi thì. Đọc cả đoạn trước, tìm mốc thời gian của từng câu, rồi mới sửa. Đây đúng là thao tác bạn làm ở lượt soát “thì” khi còn 5 phút cuối bài Writing.",
      },
      {
        t: "passage",
        title: "Đoạn cần soát — 6 lỗi thì",
        paras: [
          { text: "Over the last two decades, remote work (1) became far more common. Before 2020, only a small minority of employees (2) have worked from home; by the end of that year, however, the proportion (3) already tripled in many countries. Surveys consistently (4) are showing that most staff value this flexibility. Once offices (5) will reopen fully, some firms may ask everyone to return, but those that do so (6) risked losing their most experienced workers." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-soat-doan",
        kind: "fill",
        title: "Gõ dạng đúng của động từ ở mỗi số (6 câu)",
        items: [
          { q: "(1) became →", answers: ["has become"], hint: "Over the last two decades = kéo tới bây giờ → hiện tại hoàn thành." },
          { q: "(2) have worked →", answers: ["worked", "had worked"], hint: "Before 2020 = mốc đã qua → quá khứ đơn (hoặc quá khứ hoàn thành)." },
          { q: "(3) already tripled →", answers: ["had already tripled"], hint: "by the end of that year → had + V3." },
          { q: "(4) are showing →", answers: ["show"], hint: "consistently = sự thật lặp lại → hiện tại đơn." },
          { q: "(5) will reopen →", answers: ["reopen", "have reopened"], hint: "Once + hiện tại." },
          { q: "(6) risked →", answers: ["risk", "will risk"], hint: "Đang nói về tương lai / sự thật chung, không có lý do lùi về quá khứ." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hedging band 8 — đúng liều: một nhận định, một lần rào đón" },
      {
        t: "p",
        text: "Tập 4 Ngày 13 dạy bốn nhóm công cụ rào đón. Người vừa học xong thường mắc lỗi ngược lại: ==rào đón quá tay==. Câu nào cũng may, perhaps, to some extent — bài nghe như không dám nói gì. Band 8 TR đòi lập trường **rõ** và ý **được chống đỡ**. Hedging đúng là nói đúng mức mình có bằng chứng, không hơn không kém.",
      },
      {
        t: "table",
        head: ["Lỗi liều lượng", "Câu sai liều", "Câu band 8"],
        rows: [
          ["Rào chồng (2–3 lớp)", "~~It **may possibly** be the case that this **could perhaps** lead to…~~", "This **may** lead to…"],
          ["Rào cả thesis", "~~I think it **might be somewhat** true that cities **could** consider charging drivers.~~", "I **am convinced** that cities **should** charge drivers."],
          ["Không rào chỗ cần rào", "~~Social media **makes** teenagers depressed. This **proves** that…~~", "Heavy use of social media **appears to be linked to** low mood in **some** teenagers. This **suggests** that…"],
          ["Rào điều ai cũng biết", "~~It could be argued that pollution may be harmful to health.~~", "Air pollution **damages** health."],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Thang chắc chắn — chọn bậc theo bằng chứng bạn có",
        cols: [
          { title: "Chắc (sự thật, số liệu đã nêu)", items: ["**is / does** — không rào", "**clearly · undoubtedly** — dùng 1 lần / bài", "The figures **show** that…"] },
          { title: "Khá chắc (xu hướng chung)", items: ["**tend to · generally · in most cases**", "**is likely to · in all likelihood**", "The evidence **suggests** that…"] },
          { title: "Có thể (suy đoán có cơ sở)", items: ["**may · can · appear to · seem to**", "**arguably · presumably**", "There is **some evidence** that…"] },
          { title: "Ít khả năng / giới hạn", items: ["**is unlikely to · tend not to**", "**not necessarily · by no means**", "There is **little evidence** that…"] },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "There is + some / little / growing / no clear + evidence + (to suggest) that + S + V",
            vi: "Rào đón bằng cách nói thẳng lượng bằng chứng — chính xác hơn may / might.",
            examples: [
              { en: "There is growing evidence that shorter working weeks do not reduce output.", vi: "Ngày càng có nhiều bằng chứng cho thấy tuần làm việc ngắn hơn không làm giảm sản lượng." },
              { en: "There is little evidence to suggest that harsher sentences deter crime.", vi: "Có rất ít bằng chứng cho thấy án nặng hơn ngăn được tội phạm." },
            ],
          },
          {
            formula: "This is not to say that + S + V   ·   It would be an oversimplification to + V",
            vi: "Giới hạn chính nhận định của mình — động tác “biết điểm dừng” của band 8.",
            examples: [
              { en: "This is not to say that technology is harmless; it is to say that the harm has been exaggerated.", vi: "Nói vậy không có nghĩa công nghệ vô hại; ý là tác hại đã bị nói quá." },
              { en: "It would be an oversimplification to blame rising rents on tourism alone.", vi: "Đổ lỗi tiền thuê nhà tăng chỉ cho du lịch thì là đơn giản hoá quá mức." },
            ],
          },
          {
            formula: "S + is by no means + adj / N   ·   S + do not necessarily + V",
            vi: "Phủ định có mức độ: “hoàn toàn không hề” và “không nhất thiết”.",
            examples: [
              { en: "A university degree is by no means a guarantee of employment.", vi: "Bằng đại học hoàn toàn không phải là bảo đảm có việc làm." },
              { en: "Higher spending does not necessarily produce better schools.", vi: "Chi nhiều hơn không nhất thiết tạo ra trường tốt hơn." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với hedging",
        items: [
          "~~It may be possible that~~ / ~~can be able to~~ / ~~maybe it might~~: hai từ cùng nghĩa “có thể” đứng cạnh nhau. Giữ **một**.",
          "~~tend to not~~ → **tend not to** (văn viết) hoặc do not tend to.",
          "~~There are little evidences~~ → There **is** little **evidence**. evidence không đếm được.",
          "~~By no mean~~ → **by no means** (luôn có s). Đứng đầu câu thì đảo ngữ: By no means **is this** a new problem.",
          "~~It is likely that it will probably~~ → It is likely that it **will**…",
          "Thesis và kết bài: **I would argue / I am convinced / In my view** + should / is. Không viết ~~it may be somewhat better~~ cho ý kiến của chính mình.",
        ],
      },
      { t: "rule", formula: "nhận định về thế giới: 1 hedge đúng bậc  ·  ý kiến của mình: không hedge  ·  sự thật hiển nhiên: không hedge", vi: "Đọc lại mỗi câu: có hai từ “có thể” không? Thesis có bị làm mềm không?" },
      {
        t: "quiz",
        id: "t5d1-hedge-viet-lai",
        kind: "fill",
        title: "Sửa liều lượng — gõ lại phần [trong ngoặc] (6 câu)",
        items: [
          { q: "This [may possibly] explain the fall in sales.", answers: ["may", "might", "could"], hint: "Rào chồng → giữ một modal." },
          { q: "Older voters [tend to not] trust online news.", answers: ["tend not to", "do not tend to", "don't tend to"], hint: "tend not to + V." },
          { q: "There [are little evidences] that homework improves results in primary school.", answers: ["is little evidence"], hint: "evidence không đếm được → is little evidence." },
          { q: "A high salary is [by no mean] the only reason people change jobs.", answers: ["by no means"], hint: "by no means — luôn có s." },
          { q: "One study of 40 students [proves] that music helps concentration.", answers: ["suggests", "indicates", "appears to show", "seems to show"], hint: "Một nghiên cứu nhỏ không “chứng minh” — suggests / indicates." },
          { q: "In conclusion, I think it [might perhaps be better if governments could] invest in rail.", answers: ["would be better if governments invested", "is better for governments to", "would be better for governments to"], hint: "Kết bài là ý kiến của bạn → bỏ hedge: it would be better if governments invested in rail." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-hedge-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — hedging band 8 (4 câu)",
        grammar: "There is growing / little evidence that… · not necessarily · by no means · This is not to say that…",
        items: [
          { q: "Ngày càng có nhiều bằng chứng cho thấy thiếu ngủ ảnh hưởng tới trí nhớ.", answers: ["There is growing evidence that a lack of sleep affects memory.", "There is growing evidence that lack of sleep affects memory.", "There is growing evidence to suggest that a lack of sleep affects memory."], hint: "growing evidence · a lack of sleep · affect · memory" },
          { q: "Lương cao hơn không nhất thiết làm nhân viên hạnh phúc hơn.", answers: ["Higher pay does not necessarily make employees happier.", "A higher salary does not necessarily make employees happier.", "Higher salaries do not necessarily make employees happier."], hint: "not necessarily · make … happier" },
          { q: "Năng lượng tái tạo hoàn toàn không phải là một giải pháp hoàn hảo.", answers: ["Renewable energy is by no means a perfect solution."], hint: "by no means · a perfect solution" },
          { q: "Nói vậy không có nghĩa là kỳ thi vô ích.", answers: ["This is not to say that exams are useless.", "This is not to say that examinations are useless."], hint: "This is not to say that · useless" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Danh hoá có chọn lọc — nén khi giúp mạch văn, trả về động từ khi cần rõ" },
      {
        t: "p",
        text: "**Danh hoá** (nominalisation) = đổi động từ / tính từ thành danh từ: decline → a decline, aware → awareness. Tập 4 Ngày 21 dạy nén cả mệnh đề thành cụm danh từ. Người band 7 hay nén ==quá tay==: ba bốn danh từ trừu tượng nối bằng of. Câu nghe “học thuật” nhưng người đọc phải đọc hai lần — band 8 CC không chấp nhận điều đó.",
      },
      {
        t: "table",
        head: ["Tình huống", "Làm gì", "Ví dụ"],
        rows: [
          ["Cần ==chỉ lại ý câu trước== để nói tiếp", "**Danh hoá** + this / such", "Birth rates fell sharply. **This decline** has alarmed economists."],
          ["Tác nhân không quan trọng / ai cũng biết", "**Danh hoá**", "**The introduction of** the smoking ban reduced hospital admissions."],
          ["Gọi tên một khái niệm", "**Danh hoá**", "**Urbanisation** places pressure on housing."],
          ["Tác nhân quan trọng (ai làm?)", "**Giữ động từ**", "~~The implementation of cuts happened.~~ → **The council cut** library budgets."],
          ["Thấy 3 danh từ trừu tượng nối bằng of", "**Trả về động từ**", "~~the improvement of the reduction of the level of congestion~~ → congestion **fell**"],
          ["Cần quan hệ nhân – quả thật rõ", "**Giữ động từ + because / so**", "Rents rose **because** supply failed to keep up."],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "Band 7 (nén quá tay): The government's implementation of the introduction of a restriction on car usage led to an improvement in the reduction of congestion.", vi: "Một câu, năm danh từ trừu tượng. Đúng ngữ pháp nhưng phải đọc hai lần." },
          { en: "Band 8: When the government restricted car use, congestion fell markedly. This fall, however, proved short-lived.", vi: "Câu 1 dùng động từ cho rõ ai làm gì. Câu 2 danh hoá (This fall) để nối và nói tiếp. Đó là “có chọn lọc”." },
        ],
      },
      {
        t: "table",
        head: ["Giới từ", "Danh từ đi kèm", "Ví dụ"],
        rows: [
          ["**in**", "a rise · an increase · a fall · a decline · a reduction · investment · a change", "a sharp rise **in** youth unemployment"],
          ["**for**", "demand · the need · support · responsibility · a reason · respect", "growing demand **for** affordable housing"],
          ["**on**", "reliance · dependence · emphasis · an impact · an effect · a ban · a restriction · pressure", "our reliance **on** fossil fuels"],
          ["**to**", "access · an alternative · a solution · a threat · damage · a contribution · resistance", "equal access **to** education"],
          ["**of**", "a lack · a shortage · awareness · the likelihood · the introduction · the loss", "a lack **of** investment"],
          ["**between**", "a link · a gap · a distinction · the relationship", "the gap **between** rich and poor"],
        ],
        caption: "Giới từ sau danh từ danh hoá — chỗ mất điểm số 1 khi danh hoá",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi danh hoá",
        items: [
          "Giới từ theo **từ gốc**: depend on → dependence **on**; respond to → a response **to**; invest in → investment **in**. Riêng **demand**: người ta demand something, nhưng danh từ là demand **for**.",
          "~~an increase of unemployment~~ → an increase **in** unemployment. (**of** chỉ đi với con số: an increase **of** 5%.)",
          "~~effect to / impact to / influence to~~ → **on**.",
          "Danh từ không đếm được: ~~researches, evidences, informations, an advice, a progress~~. Viết research, evidence, **a piece of** advice, progress.",
          "Danh hoá xong phải chia động từ theo **danh từ chính**: The **rise** in house prices **has** (không phải have) priced out young buyers. (Ôn Tập 4 Ngày 1 · mục 4.)",
        ],
      },
      { t: "rule", formula: "This / Such + N danh hoá + V …  (nối câu trước)    ·    thấy N of N of N → trả về S + V + O", vi: "Danh hoá để nối và gọi tên; động từ để nói ai làm gì." },
      {
        t: "quiz",
        id: "t5d1-danh-hoa-gioi-tu",
        kind: "fill",
        title: "Điền MỘT giới từ (6 câu)",
        items: [
          { q: "There has been a marked decline ___ the number of independent bookshops.", answers: ["in"], hint: "a decline in + thứ giảm." },
          { q: "The city's dependence ___ tourism makes it vulnerable.", answers: ["on", "upon"], hint: "depend on → dependence on." },
          { q: "Rising demand ___ lithium has pushed up prices.", answers: ["for"], hint: "demand for." },
          { q: "Nuclear power is often presented as an alternative ___ coal.", answers: ["to"], hint: "an alternative to." },
          { q: "The scheme failed owing to a lack ___ funding.", answers: ["of"], hint: "a lack of." },
          { q: "Wages rose, with an increase ___ 4% over the year.", answers: ["of"], hint: "an increase OF + con số; an increase IN + thứ tăng." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-danh-hoa-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — danh hoá để nối câu (4 câu)",
        grammar: "This + N danh hoá + V… · the introduction of… · a lack of… · N + in / on / for",
        items: [
          { q: "Sự sụt giảm này đã làm các nhà kinh tế lo ngại.", answers: ["This decline has alarmed economists.", "This fall has alarmed economists.", "This decline has worried economists."], hint: "This decline · alarm · economists" },
          { q: "Việc đưa vào áp dụng lệnh cấm hút thuốc đã làm giảm số ca nhập viện.", answers: ["The introduction of the smoking ban reduced hospital admissions.", "The introduction of the smoking ban has reduced hospital admissions.", "The introduction of a smoking ban reduced hospital admissions."], hint: "the introduction of · smoking ban · hospital admissions" },
          { q: "Việc thiếu đầu tư vào giao thông công cộng đã làm tình trạng tắc đường tệ hơn.", answers: ["A lack of investment in public transport has made congestion worse.", "The lack of investment in public transport has made congestion worse.", "A lack of investment in public transport has worsened congestion."], hint: "a lack of investment in · make … worse · congestion" },
          { q: "Khoảng cách giữa người giàu và người nghèo đã nới rộng từ năm 2000.", answers: ["The gap between rich and poor has widened since 2000.", "The gap between the rich and the poor has widened since 2000."], hint: "the gap between · widen · since 2000" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. “Phạm vi rộng” gồm những gì — tám cấu trúc đã học, mỗi bài dùng ba bốn cái" },
      {
        t: "table",
        head: ["Cấu trúc", "Đã học ở", "Dùng đúng chỗ khi"],
        rows: [
          ["Mệnh đề quan hệ rút gọn (V-ing / V3)", "Tập 3 Ngày 17", "thêm thông tin cho danh từ mà không mở câu mới"],
          ["Mệnh đề phân từ", "Tập 4 Ngày 5", "hai việc cùng chủ ngữ: Faced with…, governments…"],
          ["Câu chẻ · đảo ngữ", "Tập 4 Ngày 7", "nhấn ĐÚNG MỘT ý quan trọng nhất của bài"],
          ["Mệnh đề danh ngữ", "Tập 4 Ngày 11", "What matters is… / the fact that…"],
          ["Hedging · bị động vô nhân xưng", "Tập 4 Ngày 13", "nhận định về thế giới, thuật ý kiến chung"],
          ["Điều kiện hỗn hợp", "Tập 4 Ngày 19", "quá khứ giả định → hệ quả bây giờ"],
          ["Danh hoá", "Tập 4 Ngày 21", "nối câu trước, gọi tên khái niệm"],
          ["Giả định (subjunctive) · fronting", "Tập 4 Ngày 27", "đề xuất trang trọng: It is essential that… be…"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: đếm phạm vi trong bài của bạn",
        items: [
          "Sau khi viết, tô ba màu: câu đơn · câu ghép (and / but / so) · câu phức (mệnh đề phụ, phân từ, quan hệ). Bài band 8 thường có ==khoảng một nửa là câu phức==, xen câu ngắn để nghỉ.",
          "Trong các câu phức, đếm **loại** khác nhau. Có 4 loại trở lên trong một bài 280 từ là đủ “phạm vi rộng”. Không cần cả tám.",
          "Mỗi cấu trúc “hiếm” (đảo ngữ, câu chẻ, giả định) dùng **tối đa một lần** mỗi bài.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Ghép lại: một đoạn band 7 và chính nó ở band 8" },
      {
        t: "p",
        text: "Đề: “Cities should charge drivers a fee to enter the city centre.” Hai đoạn thân bài dưới đây cùng ý, cùng ví dụ. Đọc đoạn band 7 và tự tìm bốn lỗi trước khi xem bảng.",
      },
      {
        t: "examples",
        items: [
          { en: "Band 7 (ước tính): Congestion charges are becoming popular in the recent years. When London introduced its charge in 2003, traffic entering the zone was falling by almost a fifth, and this proves that charging always works. However, it may possibly be the case that the implementation of the introduction of such charges could perhaps cause a reduction in the number of shoppers. In my view, it might be somewhat better to charge drivers.", vi: "5 câu — 1 câu sạch. Lỗi: thì (are becoming… in the recent years; was falling), không rào chỗ cần rào (proves… always), rào chồng + danh hoá chồng (câu 3), thesis bị làm mềm (câu 4)." },
          { en: "Band 8 (ước tính): Congestion charging has become increasingly common in recent years, and the evidence from early adopters is broadly encouraging. When London introduced its charge in 2003, traffic entering the zone fell by almost a fifth within a year. This reduction does not prove that charging would succeed everywhere — much depends on whether public transport can absorb the displaced drivers — but it does suggest that price is a more effective lever than appeals to conscience. Critics object that such schemes may deter shoppers; where the revenue has been reinvested in buses and cycle lanes, however, city-centre trade has tended to recover. On balance, I am convinced that the gains outweigh the costs.", vi: "5 câu — 5 câu sạch. Thì đổi 3 lần, lần nào cũng có lý do; mỗi nhận định một hedge (may deter · has tended to); This reduction nối câu trước; thesis chắc (I am convinced)." },
        ],
      },
      {
        t: "table",
        head: ["Chỗ", "Đoạn band 7", "Đoạn band 8", "Mục"],
        rows: [
          ["Xu hướng tới nay", "are becoming … in the recent years", "has become … in recent years", "2"],
          ["Ví dụ có mốc 2003", "was falling", "fell … within a year", "2"],
          ["Rút kết luận từ một ví dụ", "this proves that charging always works", "does not prove… but it does suggest that…", "5"],
          ["Ý phản đối", "may possibly… could perhaps + 3 danh từ chồng", "Critics object that such schemes may deter shoppers", "5 · 6"],
          ["Nối câu", "(không có)", "This reduction… / such schemes", "6"],
          ["Ý kiến của người viết", "it might be somewhat better", "I am convinced that the gains outweigh the costs", "5"],
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ khi Đọc và Nghe",
        items: [
          "Trong Reading, hedging là chỗ ra câu **YES / NO / NOT GIVEN**: bài viết may / tends to, câu hỏi viết always / proves → NO. Bài 2 hôm nay có ba câu như vậy.",
          "Danh hoá là cách đề **paraphrase**: bài viết “people rated their understanding lower”, câu hỏi viết “a fall in self-assessed understanding”. Gặp cụm danh từ dài trong câu hỏi → tìm một **mệnh đề** cùng nghĩa trong bài.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (18 câu)" },
      {
        t: "mcq",
        id: "t5d1-np-chon",
        title: "Chọn phương án đúng (10 câu)",
        items: [
          { q: "Since the turn of the century, life expectancy in the region ___ by almost six years.", options: ["rose", "has risen", "had risen", "is rising"], correct: 1, why: "Since + mốc, kéo tới bây giờ → hiện tại hoàn thành." },
          { q: "By 2060, a third of the population ___ the age of 65.", options: ["will pass", "will have passed", "passes", "has passed"], correct: 1, why: "By + mốc tương lai → will have + V3." },
          { q: "Until the results ___, the ministry will make no comment.", options: ["will be published", "would be published", "are published", "were published"], correct: 2, why: "until + hiện tại (bị động): are published." },
          { q: "The 2018 trial ___ that the drug ___ most effective in younger patients.", options: ["finds / was", "found / is", "has found / was", "found / has been"], correct: 1, why: "Phát hiện có năm → found; điều phát hiện vẫn đúng → is." },
          { q: "Câu nào rào đón đúng liều?", options: ["It may possibly be that prices could perhaps rise.", "Prices will definitely always rise.", "Prices are likely to rise.", "It is likely that prices will probably rise."], correct: 2, why: "Một nhận định — một hedge. A và D rào chồng; B tuyệt đối hoá." },
          { q: "Câu nào hợp làm thesis của bài Opinion?", options: ["It might perhaps be argued that zoos could be somewhat useful.", "I would argue that zoos still have a valuable role.", "Zoos may possibly be good.", "To some extent it seems that zoos might be acceptable."], correct: 1, why: "Thesis là ý kiến của bạn → nói chắc: I would argue that…" },
          { q: "There is ___ to suggest that class size affects results at university level.", options: ["a little evidences", "little evidence", "few evidence", "little evidences"], correct: 1, why: "evidence không đếm được; little = hầu như không có." },
          { q: "Birth rates have halved. ___ has serious implications for pensions.", options: ["This decline", "This declining", "These decline", "It declines"], correct: 0, why: "This + danh từ tóm tắt để nối câu trước." },
          { q: "the growing emphasis ___ exam results", options: ["in", "to", "on", "for"], correct: 2, why: "emphasis on." },
          { q: "Câu nào nên trả về động từ?", options: ["Urbanisation places pressure on housing.", "This decline has alarmed economists.", "The occurrence of the improvement of the situation of traffic took place.", "The introduction of the ban cut admissions."], correct: 2, why: "Ba danh từ trừu tượng nối bằng of + động từ rỗng (took place) → viết: Traffic improved." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-np-dien",
        kind: "fill",
        title: "Điền MỘT từ vào mỗi chỗ trống (8 câu)",
        items: [
          { q: "A degree is by no ___ a guarantee of a job.", answers: ["means"], hint: "by no means." },
          { q: "This is not to ___ that the policy has failed.", answers: ["say"], hint: "This is not to say that…" },
          { q: "Higher taxes do not ___ lead to better services.", answers: ["necessarily"], hint: "not necessarily." },
          { q: "There is growing ___ that screen time affects sleep.", answers: ["evidence"], hint: "growing evidence that…" },
          { q: "Once the tunnel ___ been completed, the ferry will close.", answers: ["has"], hint: "Once + hiện tại hoàn thành (bị động): has been completed." },
          { q: "By the time the vaccine arrived, the virus ___ already spread to twelve countries.", answers: ["had"], hint: "By the time + quá khứ → had + V3." },
          { q: "The rise in rents ___ forced many families out of the centre. (have / has)", answers: ["has"], hint: "Danh từ chính: rise (số ít)." },
          { q: "The link ___ diet and heart disease is well established.", answers: ["between"], hint: "a link between A and B." },
        ],
      },
      {
        t: "note",
        title: "📌 Việc sau bài này",
        items: [
          "Mở bài Task 2 gần nhất của bạn (Đề 8 hoặc Tập 4 Ngày 30). Đếm: tổng số câu · số câu sạch · số lỗi thì · số chỗ rào chồng · số chuỗi N of N of N. Ghi bốn con số vào **Sổ lỗi**.",
          "Ngày 3 sẽ truy tiếp ba lỗi dai dẳng: hoà hợp chủ – vị, mạo từ, giới từ.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d1-doc",
    kind: "reading",
    title: "Đọc: Reading band 8 — 1.000 từ trong 15 phút, đọc một lần (MCQ · YES / NO / NOT GIVEN · Summary)",
    goal: "Làm trọn một passage lập luận khoảng 1.000 từ với 14 câu hỏi trong 15 phút bằng cách đọc MỘT lượt có ghi dấu ở lề, đạt ít nhất 12/14; nhận ra paraphrase mức 4 (ý ẩn) và bẫy mức chắc chắn trong câu YES / NO / NOT GIVEN — nhịp cần có để cả bài Reading còn 55 phút và đạt 35/40.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "Band 8 Reading ≈ **35/40**: mỗi passage chỉ được sai 1–2 câu. Không còn chỗ cho việc “hết giờ ở Passage 3”.",
          "Nhịp mới của Tập 5: ==15 – 18 – 22 phút== (tổng 55) + 5 phút soát. Hôm nay tập nhịp 15 phút trên một bài ở mức Passage 3.",
          "**Đọc một lần** = đọc trọn bài 6–7 phút, ghi 3–5 chữ ở lề mỗi đoạn; lúc trả lời chỉ quay lại **đúng đoạn** theo ghi chú, không đọc lại cả bài.",
          "Paraphrase mức 4: câu hỏi không dùng lại chữ nào của bài, và ý đúng phải **suy ra** từ hai câu đứng cạnh nhau.",
          "Bài hôm nay dùng đúng ba thứ của Bài 1: thì kể nghiên cứu, hedging, danh hoá.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ngân sách thời gian ở band 8" },
      {
        t: "table",
        head: ["", "Tập 4 (band 7)", "Tập 5 (band 8)"],
        rows: [
          ["Passage 1", "17 phút · 12/13", "**15 phút** · 13/13"],
          ["Passage 2", "20 phút · 10/13", "**18 phút** · 11–12/13"],
          ["Passage 3", "23 phút · 8–9/14", "**22 phút** · 11/14"],
          ["Soát cuối", "(nằm trong 23 phút)", "**5 phút riêng**"],
          ["Tổng", "30/40", "**35/40**"],
        ],
      },
      {
        t: "p",
        text: "Vì sao phải nhanh hơn khi đã đủ 60 phút? Vì ở band 8 bạn không được phép sai do vội. Năm phút soát cuối là lúc bắt lại lỗi chính tả, câu chép nhầm, câu NOT GIVEN chọn theo cảm giác. Người đạt 35+ gần như luôn còn thời gian thừa.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đọc một lần — đọc có ghi dấu" },
      {
        t: "sodo",
        kind: "flow",
        title: "15 phút cho một passage 1.000 từ",
        steps: [
          { label: "1 phút", sub: "đọc tiêu đề + lướt các nhóm câu hỏi: dạng gì, hỏi đoạn nào trước" },
          { label: "6–7 phút", sub: "đọc trọn bài MỘT lượt; mỗi đoạn ghi 3–5 chữ ở lề" },
          { label: "6 phút", sub: "trả lời; quay lại đúng đoạn theo ghi chú lề" },
          { label: "1 phút", sub: "soát: không bỏ trống, đúng giới hạn từ, chính tả" },
        ],
      },
      {
        t: "table",
        head: ["Ghi gì ở lề", "Ví dụ", "Để làm gì"],
        rows: [
          ["Vai trò của đoạn", "định nghĩa · thí nghiệm · lý do · phản biện · kết", "biết câu hỏi nào nằm ở đâu"],
          ["Tên riêng + năm", "R&K 2002 · Lawson 06", "câu hỏi luôn bám tên riêng"],
          ["Chỗ đổi hướng", "BUT → tốn kém khi…", "ý của tác giả thường nằm sau but / however / yet"],
          ["Thái độ tác giả", "✓ đồng ý · ? nghi ngờ", "trả lời YNNG và câu hỏi “the writer suggests…”"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Ba thói quen band 7 phải bỏ",
        items: [
          "**Đọc câu hỏi trước rồi đi tìm từng câu.** Với bài lập luận, cách này làm bạn đọc mỗi đoạn 3–4 lần. Đọc trọn một lượt rồi trả lời nhanh hơn.",
          "**Đọc lại cả bài khi gặp câu khó.** Chỉ quay lại một đoạn. Nếu 40 giây chưa ra: chọn đáp án hợp nhất, đánh dấu, đi tiếp.",
          "**Gạch dưới quá nhiều.** Gạch tên riêng, số, và từ đổi hướng. Gạch cả câu thì bằng không gạch.",
        ],
      },
      { t: "rule", formula: "1 phút lướt câu hỏi → đọc trọn 1 lượt + ghi lề → trả lời theo ghi chú → 1 phút soát", vi: "Mỗi đoạn chỉ được đọc kỹ tối đa hai lần: lượt đầu, và một lần quay lại." },

      /* ── 3 ── */
      { t: "h", text: "3. Paraphrase mức 4 — ý ẩn" },
      {
        t: "p",
        text: "Tập 4 Ngày 1 chia paraphrase thành bốn mức. Passage 3 ở band 7 chủ yếu dùng mức 3. Ở band 8, khoảng một nửa số câu dùng ==mức 4==: câu hỏi nêu một kết luận mà bài không viết ra, bạn phải ghép hai dữ kiện lại.",
      },
      {
        t: "table",
        head: ["Mức", "Cách đổi", "Bài viết", "Câu hỏi viết"],
        rows: [
          ["1", "đồng nghĩa", "ratings were **lower**", "ratings **fell**"],
          ["2", "đổi loại từ", "people are **surprised**", "they expressed **surprise**"],
          ["3", "đổi cấu trúc", "No feedback had been given.", "Participants were told nothing about their performance."],
          ["4", "==ý ẩn==", "Many expressed surprise, which suggests the first ratings had been made in good faith.", "Participants had **not been trying to exaggerate** what they knew."],
        ],
      },
      {
        t: "mcq",
        id: "t5d1-doc-khoi-dong",
        title: "Khởi động — câu 40 từ, tìm ý ẩn (3 câu · 2 phút)",
        items: [
          { q: "“The scheme, which had been expected to pay for itself within five years, was quietly shelved in its third, by which point costs had risen to twice the original estimate.” — Câu nào đúng?", options: ["The scheme paid for itself in three years.", "The scheme was abandoned before it could recover its costs.", "The scheme cost half as much as predicted.", "The scheme ran for five years."], correct: 1, why: "shelved in its third (year) = bỏ ở năm thứ ba, trước mốc 5 năm hoàn vốn → chưa thu hồi được chi phí. Đây là ý ẩn: bài không viết “did not recover its costs”." },
          { q: "“Few of the volunteers who dropped out cited the workload; most simply said that nobody had ever thanked them.” — Người viết ngụ ý điều gì?", options: ["The workload was too heavy.", "Volunteers left mainly because they felt unappreciated.", "Most volunteers stayed.", "The organisers thanked volunteers regularly."], correct: 1, why: "nobody had ever thanked them → cảm thấy không được ghi nhận (unappreciated). Few cited the workload → A sai." },
          { q: "“It would be rash to conclude from a single mild winter that the long-term trend has reversed.” — Người viết cho rằng:", options: ["the trend has clearly reversed.", "one mild winter is not sufficient evidence of a change.", "winters are getting milder.", "long-term trends cannot be measured."], correct: 1, why: "It would be rash to conclude = kết luận vậy là vội → một mùa đông chưa đủ bằng chứng. Đây là hedging mục 5 của Bài 1." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — 15 phút, Questions 1–14" },
      {
        t: "p",
        text: "Đặt đồng hồ **15:00**. Đọc một lượt, ghi lề. Không tra từ. Hết giờ thì dừng, ghi lại số câu đã làm. Bài ở mức Passage 3 của một đề band 7.5–8.",
      },
      {
        t: "passage",
        title: "Knowing Less Than We Think",
        intro: "You should spend about 15 minutes on Questions 1–14, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "Ask a friend whether she understands how a zip fastener works, and she will almost certainly say yes. Ask her to explain, step by step, how the slider forces two rows of teeth to interlock, and the confidence tends to evaporate within a sentence or two. This gap between the understanding people believe they have and the understanding they can actually produce was given a name in 2002 by two psychologists at Yale University, Leonid Rozenblit and Frank Keil: the illusion of explanatory depth. Their claim was not the familiar one that people are ignorant. It was that people are systematically mistaken about how much they know, and mistaken in one direction." },
          { label: "B", text: "The procedure that Rozenblit and Keil devised was simple. Volunteers were shown a list of everyday devices, among them a flush toilet, a cylinder lock and a helicopter, and asked to rate, on a seven-point scale, how well they understood the workings of each. They were then required to write out a detailed causal explanation of several items and, having done so, to rate their understanding again. The second set of ratings was consistently lower than the first. Nothing had been taught and no feedback had been given; the attempt to explain had by itself been enough to expose how thin the participants' knowledge was. Tellingly, many expressed surprise, which suggests that the first ratings had been made in good faith rather than out of a wish to impress." },
          { label: "C", text: "What makes the finding more than a curiosity is that the effect proved selective. When the same procedure was applied to knowledge of facts, such as the capital cities of various countries, to procedures, such as following a familiar recipe, or to the plots of well-known films, the initial ratings turned out to be far better calibrated: people who said they knew generally did, and their estimates barely moved after they had been tested. The overconfidence, in other words, was not a general vanity about one's own mind. It attached specifically to explanations of how things work." },
          { label: "D", text: "Several reasons have been proposed for this. One is that mechanical devices are, in a sense, too easy to look at. Because the parts of a bicycle or a lock are visible, people confuse the vivid picture they can summon with an understanding of what each part does. In a study published in 2006, the British psychologist Rebecca Lawson asked several hundred people to add the pedals, chain and missing sections of frame to an outline drawing of a bicycle. A considerable proportion of them, including some regular cyclists, produced machines that could not have been ridden. A second reason is that explanations, unlike facts, have no obvious end point. One either knows a capital city or does not, whereas an account of how a toilet flushes can be given at many levels of detail, and a person who possesses only the shallowest of these may take it for the whole. A third is simply lack of practice: we are seldom asked to explain how anything works, and so seldom discover that we cannot." },
          { label: "E", text: "It would be easy to treat all this as a failing, but a more persuasive reading is that the illusion is the by-product of an arrangement that serves human beings rather well. No individual understands more than a sliver of the technology on which daily life depends; what each of us has instead is reliable access to people and objects that do. The cognitive scientists Steven Sloman and Philip Fernbach describe this as a community of knowledge, and argue that the mind draws no sharp line between what is stored inside one's own head and what is merely within reach. On this view, the feeling of understanding is less a report on the contents of memory than a judgement that the knowledge is available somewhere nearby, a judgement that is usually correct. The error lies only in locating that knowledge in oneself." },
          { label: "F", text: "The arrangement becomes costly, however, when confidence borrowed from the community is spent on questions the community has not settled. In a set of experiments reported in 2013, Fernbach and his colleagues asked American adults to state their position on policies such as a national flat tax or a cap-and-trade scheme for carbon emissions. Some participants were then asked to explain, mechanically, how the policy in question would produce its effects; others were asked instead to list their reasons for supporting or opposing it. Those who had attempted the explanation subsequently rated their own understanding lower and moved towards more moderate positions. Those who had merely listed reasons did neither. In a follow-up, people who had been made to explain were also less willing to donate money to an advocacy group that shared their view." },
          { label: "G", text: "These results have been welcomed, perhaps too eagerly, as a remedy for political polarisation. The enthusiasm needs qualifying on at least two counts. First, the policies chosen were ones on which most participants held opinions for practical reasons, namely what the consequences would be, and not for moral ones; there is little reason to suppose that asking someone to explain the mechanics would soften a conviction rooted in values. Second, later attempts to reproduce the moderating effect have met with mixed success, although the drop in self-rated understanding itself appears robust. What can be said with some confidence is the narrower point: a request for reasons invites people to rehearse what they already believe, whereas a request for a mechanism confronts them with what they do not know." },
          { label: "H", text: "If the illusion cannot be abolished, it can at least be managed. Its most practical lesson concerns not how much we know but how we find out. The reliable test of understanding is not the feeling of familiarity that comes from having read or heard about something, but the attempt to produce an explanation, in order, for someone who can ask what happens next. Teachers have long suspected as much. What the research adds is a reason for humility that does not require anyone to feel foolish: knowing less than we think is the ordinary condition of people who live among things made by others, and the sensible response is not to pretend otherwise but to know whom, and what, to consult." },
        ],
      },
      { t: "p", text: "**Questions 1–5** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t5d1-doc-chon",
        title: "Questions 1–5 — Multiple choice",
        items: [
          { q: "1. According to paragraph A, what was distinctive about Rozenblit and Keil's claim?", options: ["A  It showed that ignorance is more widespread than previously thought.", "B  It concerned a consistent tendency to overestimate one's own understanding.", "C  It applied only to people with no technical training.", "D  It suggested that people are reluctant to admit what they do not know."], correct: 1, why: "“Their claim was not the familiar one that people are ignorant. It was that people are systematically mistaken about how much they know, and mistaken in one direction.” — systematically + in one direction = consistent tendency to overestimate. A là “the familiar one” mà bài phủ định. D: bài nói họ ngạc nhiên, tức không biết chứ không phải ngại nhận." },
          { q: "2. The writer mentions the participants' surprise in paragraph B in order to show that", options: ["A  the procedure had been explained to them badly.", "B  they had expected to be given feedback.", "C  their original ratings had been honest.", "D  they found the devices harder than the researchers intended."], correct: 2, why: "“many expressed surprise, which suggests that the first ratings had been made in good faith rather than out of a wish to impress” — in good faith = thật lòng → honest. Paraphrase mức 4." },
          { q: "3. What is the significance of the results described in paragraph C?", options: ["A  They show that people are overconfident about all types of knowledge.", "B  They prove that facts are easier to remember than explanations.", "C  They indicate that the illusion is restricted to a particular kind of knowledge.", "D  They suggest that the original experiment was poorly designed."], correct: 2, why: "“the effect proved selective … It attached specifically to explanations of how things work.” — selective / specifically = restricted to a particular kind. A ngược với “not a general vanity”. B: bài không so độ dễ nhớ." },
          { q: "4. Lawson's bicycle study is referred to in paragraph D as evidence that", options: ["A  regular cyclists understand bicycles better than other people.", "B  drawing is an unreliable way of testing knowledge.", "C  bicycles are more complicated than they appear.", "D  being able to picture an object can be mistaken for knowing how it works."], correct: 3, why: "Nghiên cứu được dẫn ngay sau câu “people confuse the vivid picture they can summon with an understanding of what each part does” — nó là ví dụ cho lý do thứ nhất. A sai: “including some regular cyclists” cũng vẽ sai." },
          { q: "5. What is the writer's main point in paragraph E?", options: ["A  The illusion arises from a way of sharing knowledge that generally works well.", "B  Human memory is less reliable than people assume.", "C  The illusion could be removed through better technical education.", "D  People should rely less on others for their knowledge."], correct: 0, why: "“the illusion is the by-product of an arrangement that serves human beings rather well” — arrangement = community of knowledge. D ngược ý: tác giả coi việc dựa vào người khác là hợp lý." },
        ],
      },
      {
        t: "p",
        text: "**Questions 6–10** — Do the following statements agree with the claims of the writer in the passage? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t5d1-doc-ynng",
        title: "Questions 6–10 — YES / NO / NOT GIVEN",
        items: [
          { q: "6. In the 2013 experiments, participants' views became less extreme after they had justified their opinions with reasons.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: người **giải thích cơ chế** mới dịu quan điểm; “Those who had merely listed reasons did neither.” Câu hỏi gán kết quả cho nhóm nêu lý do → NO. Bẫy: đổi nhóm." },
          { q: "7. Explaining how a policy worked made people less inclined to give financial support to a group that agreed with them.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn F, câu cuối: “less willing to donate money to an advocacy group that shared their view”. give financial support = donate money; agreed with them = shared their view." },
          { q: "8. The 2013 findings received more attention in the United States than in other countries.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói người tham gia là “American adults” và kết quả “have been welcomed”. Không so sánh mức chú ý giữa các nước → NOT GIVEN." },
          { q: "9. Asking people to explain a policy would probably be just as effective for opinions based on moral beliefs.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn G: “there is little reason to suppose that asking someone to explain the mechanics would soften a conviction rooted in values.” little reason to suppose = tác giả cho là khó có → NO." },
          { q: "10. The finding that explaining reduces people's estimate of their own understanding seems to be reliable.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn G: “the drop in self-rated understanding itself appears robust.” appears robust = seems reliable. Chú ý: cái “mixed success” là hiệu ứng **dịu quan điểm**, không phải cái này." },
        ],
      },
      {
        t: "p",
        text: "**Questions 11–14** — Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer. — **Why the illusion arises, and how to test understanding** — One explanation is that people mistake a clear mental **11** ___ of a device for knowledge of what its parts do. Another is that an explanation, unlike a fact, can be offered at different levels of **12** ___ , so a very shallow version may seem complete. A third is that people get little **13** ___ at explaining things. The writer concludes that a sense of **14** ___ with a subject is a poor guide to whether it has really been understood.",
      },
      {
        t: "quiz",
        id: "t5d1-doc-tom-tat",
        kind: "fill",
        title: "Questions 11–14 — ONE WORD ONLY from the passage",
        items: [
          { q: "11", answers: ["picture"], hint: "Đoạn D: “people confuse the vivid picture they can summon with an understanding of what each part does”. clear mental … = vivid picture. (image không có trong bài.)" },
          { q: "12", answers: ["detail"], hint: "Đoạn D: “can be given at many levels of detail”. offered at different levels = given at many levels." },
          { q: "13", answers: ["practice"], hint: "Đoạn D: “A third is simply lack of practice”. get little practice = lack of practice. Danh từ: practice (không phải practise)." },
          { q: "14", answers: ["familiarity"], hint: "Đoạn H: “The reliable test of understanding is not the feeling of familiarity…”. a sense of = the feeling of; a poor guide = not the reliable test." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Chấm điểm và bảng paraphrase của cả bài" },
      {
        t: "table",
        head: ["Đúng / 14", "Giờ làm", "Đánh giá", "Việc cần làm"],
        rows: [
          ["13–14", "≤ 15 phút", "nhịp band 8", "giữ cách đọc này cho mọi bài của Tập 5"],
          ["11–12", "≤ 15 phút", "band 7.5", "xem lại câu sai: thuộc mức paraphrase nào? ghi Sổ lỗi"],
          ["11–14", "> 17 phút", "đúng nhưng chậm", "bạn đang đọc lại; tập ghi lề ở Ngày 3 · 5"],
          ["≤ 10", "bất kỳ", "chưa vững mức Passage 3", "ôn Tập 4 Ngày 1 (bản đồ lập luận) · Ngày 5 (bẫy YNNG) rồi làm lại sau 3 ngày"],
        ],
      },
      {
        t: "table",
        head: ["Câu", "Trong bài", "Trong câu hỏi", "Mức"],
        rows: [
          ["1", "systematically mistaken … in one direction", "a consistent tendency to overestimate", "3"],
          ["2", "made in good faith rather than out of a wish to impress", "their original ratings had been honest", "4"],
          ["3", "the effect proved selective", "restricted to a particular kind of knowledge", "3"],
          ["4", "confuse the vivid picture … with an understanding", "being able to picture an object can be mistaken for knowing how it works", "3"],
          ["5", "the by-product of an arrangement that serves human beings rather well", "arises from a way of sharing knowledge that generally works well", "4"],
          ["7", "less willing to donate money", "less inclined to give financial support", "1–2"],
          ["9", "little reason to suppose … would soften a conviction rooted in values", "would probably be just as effective for … moral beliefs → NO", "4"],
          ["10", "appears robust", "seems to be reliable", "1"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: ba kiểu bẫy của bài hôm nay",
        items: [
          "**Đổi nhóm** (câu 6): bài có hai nhóm làm hai việc khác nhau; câu hỏi lấy kết quả của nhóm này gán cho nhóm kia. Khi bài có “Some… others…”, ghi ở lề nhóm nào ra kết quả nào.",
          "**Hai kết quả, hai mức chắc chắn** (câu 9–10): hiệu ứng dịu quan điểm = mixed success; mức tự đánh giá giảm = robust. Câu hỏi hỏi đúng cái nào thì trả lời theo cái đó.",
          "**Thông tin có nhưng không có phép so sánh** (câu 8): bài nhắc American adults → dễ tưởng là có thông tin về nước Mỹ. Câu hỏi cần một phép so sánh mà bài không làm → NOT GIVEN.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bản đồ lập luận của bài — so với ghi chú lề của bạn" },
      {
        t: "table",
        head: ["Đoạn", "Vai trò", "Ghi lề mẫu (3–5 chữ)"],
        rows: [
          ["A", "nêu hiện tượng + đặt tên", "IOED · R&K 2002 · sai 1 chiều"],
          ["B", "thí nghiệm gốc", "chấm → giải thích → chấm lại ↓"],
          ["C", "giới hạn phạm vi", "chỉ “how things work”"],
          ["D", "ba lý do", "nhìn thấy · không điểm dừng · ít tập"],
          ["E", "diễn giải lại: không hẳn là lỗi", "✓ cộng đồng tri thức"],
          ["F", "BUT: khi nào tốn kém", "2013 chính sách · giải thích vs lý do"],
          ["G", "tác giả dè dặt", "? 2 giới hạn · ý hẹp vẫn đúng"],
          ["H", "kết: bài học thực tế", "thử = tự giải thích"],
        ],
      },
      {
        t: "p",
        text: "Khung của bài: ==hiện tượng → bằng chứng → giới hạn → nguyên nhân → diễn giải lại → hệ quả → dè dặt → bài học==. Đây là khung phổ biến nhất của Passage 3 khoa học xã hội. Ý kiến của tác giả tập trung ở E, G, H — đúng nơi ra câu 5, 9, 10, 14.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Soi lại bài đọc bằng ngữ pháp Bài 1" },
      {
        t: "p",
        text: "Bài đọc dùng đúng ba công cụ của Bài 1. Tìm lại trong bài và điền **MỘT từ** đúng như bài viết.",
      },
      {
        t: "quiz",
        id: "t5d1-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "Đoạn A (hedging): the confidence ___ to evaporate within a sentence or two.", answers: ["tends"], hint: "tend to + V — không phải lúc nào cũng vậy." },
          { q: "Đoạn B (thì): Nothing ___ been taught and no feedback had been given.", answers: ["had"], hint: "Quá khứ hoàn thành: việc xảy ra trước lần chấm thứ hai." },
          { q: "Đoạn E (hedging): a judgement that is ___ correct.", answers: ["usually"], hint: "usually — rào một lần, đúng mức." },
          { q: "Đoạn G (hedging): the drop in self-rated understanding itself ___ robust.", answers: ["appears"], hint: "appears + adj = có vẻ." },
          { q: "Đoạn G (danh hoá): the ___ in self-rated understanding (= people rated their understanding lower).", answers: ["drop"], hint: "Một mệnh đề ở đoạn F được nén thành cụm danh từ ở đoạn G để nối." },
          { q: "Đoạn G (hedging): there is ___ reason to suppose that…", answers: ["little"], hint: "there is little reason to suppose = khó mà cho rằng." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "systematically", pos: "adv", ipa: "/ˌsɪstəˈmætɪkli/", vi: "một cách có hệ thống; lặp lại theo cùng một kiểu", ex: "The survey systematically underestimated the number of young voters.", exVi: "Cuộc khảo sát luôn ước lượng thấp số cử tri trẻ.", more: "systematic error / bias · khác **systemic** (thuộc về cả hệ thống): systemic failure" },
          { w: "interlock", pos: "v", ipa: "/ˌɪntəˈlɒk/", vi: "khớp vào nhau, cài khít vào nhau", ex: "The two systems interlock, so a delay in one soon spreads to the other.", exVi: "Hai hệ thống ăn khớp với nhau, nên chậm trễ ở bên này chẳng mấy chốc lan sang bên kia.", more: "interlocking (adj): interlocking problems = những vấn đề đan cài · trong bài: two rows of teeth… interlock (đoạn A)" },
          { w: "in good faith", pos: "phrase", ipa: "/ɪn ɡʊd feɪθ/", vi: "một cách thật lòng, không có ý lừa dối", ex: "The estimate was given in good faith, but it turned out to be far too low.", exVi: "Con số ước tính được đưa ra thật lòng, nhưng hoá ra quá thấp.", more: "act / negotiate in good faith · trái nghĩa: in bad faith" },
          { w: "calibrated", pos: "adj", ipa: "/ˈkælɪbreɪtɪd/", vi: "được cân chỉnh; (đánh giá) khớp với thực tế", ex: "Experienced forecasters are better calibrated than beginners.", exVi: "Người dự báo có kinh nghiệm đánh giá sát thực tế hơn người mới.", more: "well / poorly calibrated · calibrate an instrument" },
          { w: "summon", pos: "v", ipa: "/ˈsʌmən/", vi: "gợi ra, huy động (hình ảnh, can đảm); triệu tập", ex: "She could not summon the energy to argue.", exVi: "Cô ấy không còn đủ sức để tranh luận.", more: "summon up a picture / the courage · summon a witness" },
          { w: "qualify", pos: "v", ipa: "/ˈkwɒlɪfaɪ/", vi: "(một nhận định) giới hạn lại, thêm điều kiện cho bớt tuyệt đối", ex: "I would qualify that claim: it holds for large cities, not for rural areas.", exVi: "Tôi sẽ giới hạn nhận định đó lại: nó đúng với các thành phố lớn, không đúng với nông thôn.", more: "trong bài: The enthusiasm needs qualifying (đoạn G) · a qualified yes = đồng ý có điều kiện · ⚠️ khác nghĩa “đủ tiêu chuẩn” (qualify for a grant)" },
          { w: "sliver", pos: "n", ipa: "/ˈslɪvə/", vi: "mảnh rất nhỏ, phần rất nhỏ", ex: "Only a sliver of the budget goes to research.", exVi: "Chỉ một phần rất nhỏ ngân sách dành cho nghiên cứu.", more: "a sliver **of** glass / hope / the market" },
          { w: "advocacy", pos: "n", ipa: "/ˈædvəkəsi/", vi: "sự vận động, ủng hộ công khai (cho một chính sách)", ex: "She works for an advocacy group that campaigns on housing.", exVi: "Cô ấy làm cho một nhóm vận động về vấn đề nhà ở.", more: "advocacy group · advocate (v) **for** · advocate (n) **of** — AWL sublist 7" },
          { w: "polarisation", pos: "n", ipa: "/ˌpəʊləraɪˈzeɪʃn/", vi: "sự phân cực (quan điểm chia thành hai phe đối nghịch)", ex: "Social media is often blamed for political polarisation.", exVi: "Mạng xã hội thường bị đổ lỗi cho sự phân cực chính trị.", more: "polarise opinion · a polarised debate · deeply polarised" },
          { w: "conviction", pos: "n", ipa: "/kənˈvɪkʃn/", vi: "niềm tin vững chắc; (luật) bản án kết tội", ex: "He spoke with real conviction about the need for reform.", exVi: "Anh ấy nói với niềm tin thật sự về sự cần thiết của cải cách.", more: "a deeply held conviction · have the courage of your convictions" },
          { w: "robust", pos: "adj", ipa: "/rəʊˈbʌst/", vi: "vững chắc, đáng tin (kết quả, hệ thống); khoẻ mạnh", ex: "The link between exercise and mood is one of the most robust findings in the field.", exVi: "Mối liên hệ giữa tập thể dục và tâm trạng là một trong những phát hiện vững nhất của ngành.", more: "a robust finding / economy / defence" },
          { w: "rehearse", pos: "v", ipa: "/rɪˈhɜːs/", vi: "nhắc lại, ôn lại (lập luận đã quen); diễn tập", ex: "The article simply rehearses the familiar arguments against nuclear power.", exVi: "Bài báo chỉ nhắc lại những lập luận quen thuộc chống điện hạt nhân.", more: "rehearse an argument / a speech · rehearsal (n)" },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Ghi vào Sổ lỗi: điểm ___/14 · giờ làm ___ phút · số đoạn phải đọc lại quá hai lần ___.",
          "Thử ngay bài học của bài đọc: chọn một thứ bạn “biết rõ” trong ngành IT (DNS, HTTPS, garbage collection…) và giải thích bằng tiếng Anh trong 90 giây, không nhìn tài liệu. Đó cũng là bài tập Speaking Part 3 tốt nhất.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d1-nghe",
    kind: "listening",
    title: "Nghe Part 1 tốc độ thật, giọng trộn (New Zealand + Canada) — Form completion 10/10; nhận biết flap /t/ và glottal stop",
    goal: "Làm đúng 10/10 câu Form completion của một hội thoại Part 1 dài khoảng 4 phút, nói ở tốc độ tự nhiên (~175 từ/phút) bằng hai giọng khác nhau (New Zealand và Canada), không sập bẫy sửa lời, đổi góc nhìn và thirty / thirteen; nhận ra /t/ bị “vỗ” thành âm gần /d/ (flap) và /t/ bị nuốt thành tiếng ngắt (glottal stop) để không nghe nhầm từ.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "Ở band 8, Part 1 phải **10/10**. Mất 1 câu ở đây nghĩa là Part 3–4 chỉ còn được sai 4 câu để đạt 35/40.",
          "Khác Tập 4: tốc độ từ ~165 lên ==~175 từ/phút==, và **hai người nói hai giọng khác nhau** trong cùng một hội thoại, như ngoài đời.",
          "**Flap /t/**: giọng Mỹ, Canada, Úc, New Zealand đọc /t/ giữa hai nguyên âm thành âm vỗ nhanh, nghe gần /d/ — water ≈ “wader”, thirty ≈ “thirdy”.",
          "**Glottal stop**: nhiều giọng Anh thay /t/ bằng một tiếng ngắt ở cổ họng — button ≈ “bu’n”, not now ≈ “no’ now”.",
          "Bạn chỉ cần ==nhận ra==. Khi nói, cứ đọc /t/ rõ: giám khảo chấm độ dễ hiểu, không chấm giọng.",
          "Bài hôm nay có 3 bẫy band 8: tên có chữ dễ thêm thừa, đổi góc nhìn trái – phải, và hai con số đều “đúng” nhưng chỉ một con hợp ô.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao người band 7.5 vẫn mất 1–2 câu ở Part 1" },
      {
        t: "table",
        head: ["", "Tập 4 (Ngày 1)", "Tập 5 (hôm nay)"],
        rows: [
          ["Tốc độ", "~160–165 từ/phút", "**~175 từ/phút**, không quãng nghỉ sau đáp án"],
          ["Giọng", "một cặp Anh – Mỹ", "**New Zealand + Canada** — hai hệ nguyên âm khác nhau"],
          ["Sửa lời", "số sai → số đúng trong 1 câu", "thông tin sai nằm cách đáp án **2–3 lượt lời**"],
          ["Paraphrase", "nhãn trên phiếu ≈ lời nói", "nhãn trên phiếu là **cách nói khác** (Time needed ↔ how long will you have it)"],
          ["Mục tiêu", "10/10 + 2 phút kiểm", "10/10, và biết chắc câu nào mình không chắc"],
        ],
      },
      {
        t: "note",
        title: "📌 Ba việc làm trong 30 giây đọc phiếu",
        items: [
          "Đoán **loại** cho từng ô: tên riêng (sẽ đánh vần) · số · danh từ vật liệu · tính từ vị trí · ngày.",
          "Khoanh nhãn nào có ghi chú trong ngoặc — ví dụ (seen from the front). Ngoặc luôn là chỗ đặt bẫy.",
          "Ô số: nghĩ trước các cặp dễ nhầm sẽ xuất hiện — 13 / 30, 14 / 40, 15 / 50.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Flap /t/ và glottal stop — nhận biết" },
      {
        t: "p",
        text: "Tập 2 Ngày 7 đã giới thiệu flap /t/ của giọng Mỹ. Hôm nay học trọn: ==khi nào /t/ đổi, đổi thành gì, và từ nào dễ nghe nhầm==. Ký hiệu [ɾ] là âm vỗ (lưỡi chạm lợi một cái rất nhanh), [ʔ] là tiếng ngắt ở cổ họng.",
      },
      {
        t: "table",
        head: ["Hiện tượng", "Xảy ra khi", "Giọng", "Ví dụ — nghe như"],
        rows: [
          ["**Flap** [ɾ]", "/t/ giữa hai nguyên âm, âm tiết sau không nhấn", "Mỹ · Canada · rất hay gặp ở Úc · New Zealand", "water ≈ “wader” · city ≈ “cidy” · better · a lot of ≈ “a lodda”"],
          ["Flap qua ranh giới từ", "từ kết thúc bằng /t/ + từ bắt đầu bằng nguyên âm", "như trên", "get it ≈ “geddit” · what about ≈ “wuddabout” · put it on"],
          ["**/nt/ → /n/**", "/nt/ giữa hai nguyên âm", "Mỹ · Canada", "twenty ≈ “twenny” · internet ≈ “innernet” · wanted ≈ “wanned”"],
          ["**Glottal** [ʔ] cuối âm tiết", "/t/ trước phụ âm hoặc cuối câu", "phần lớn giọng Anh; cả Mỹ", "not now · football · what? ≈ “wha’”"],
          ["Glottal trước /n/", "-tton, -tain, -ten", "Anh và Mỹ", "button ≈ “bu’n” · certain · mountain · written"],
          ["Glottal giữa hai nguyên âm", "chỗ giọng Mỹ dùng flap", "London, nhiều vùng nước Anh", "water ≈ “wa’er” · better ≈ “be’er” · a lot of ≈ “a lo’ of”"],
        ],
      },
      {
        t: "table",
        head: ["Cặp dễ nhầm", "Vì sao", "Phân biệt bằng"],
        rows: [
          ["thirty — thirteen", "thirty có flap, nghe như “thirdy”", "**trọng âm**: THIRty / thirTEEN; -teen có /n/ cuối và nguyên âm dài"],
          ["forty — fourteen", "như trên", "như trên; nếu nghi ngờ, chờ lời xác nhận (four-oh / one-four)"],
          ["writer — rider", "flap làm /t/ và /d/ gần giống nhau", "**ngữ cảnh** (for a magazine → writer)"],
          ["metal — medal · latter — ladder", "như trên", "ngữ cảnh; loại từ"],
          ["can — can’t (giọng Mỹ)", "/t/ cuối không bật", "can thường yếu /kən/; **can’t** có nguyên âm rõ /kænt/ và được nhấn"],
        ],
      },
      {
        t: "note",
        title: "💡 Nhắc lại hai giọng của bài hôm nay",
        items: [
          "**New Zealand** (ôn Tập 3 Ngày 24): nguyên âm /e/ đọc cao lên, nghe gần /ɪ/ — ten ≈ “tin”, check ≈ “chick”, twelfth ≈ “twilfth”; còn /ɪ/ lùi về giữa — six ≈ “sux”. Số và ngày tháng là chỗ dễ trượt nhất.",
          "**Canada** (ôn Tập 3 Ngày 12): rất gần giọng Mỹ — có /r/ cuối, có flap. Điểm riêng: about nghe gần “a-boat”, sorry ≈ “sore-y”.",
          "Giọng máy Anh của khoá đọc /t/ khá chuẩn, nên bạn sẽ nghe ít glottal hơn người thật. Hãy nghe thêm podcast, phỏng vấn của người Anh để quen.",
        ],
      },
      { t: "rule", formula: "nguyên âm + t + nguyên âm (không nhấn) → [ɾ] ≈ /d/ (Mỹ, Canada, Úc, NZ)   ·   t + phụ âm / cuối câu / -tton → [ʔ]", vi: "Nghe thấy “d” ở chỗ chính tả phải là t — đừng viết d." },
      {
        t: "phatam",
        id: "t5d1-phat-am",
        title: "Luyện phát âm — /t/ giữa hai nguyên âm: bạn nói rõ /t/, nhưng nhớ người khác có thể vỗ hoặc nuốt",
        note: "Đọc bằng /t/ rõ (kiểu chuẩn Anh – Anh). Sau mỗi câu, tự nói lại một lần kiểu Mỹ (t → gần d) để tai quen. Máy chấm theo bản /t/ rõ.",
        items: [
          { text: "The water was better in the city.", ipa: "ðə wɔːtə wɒz betər ɪn ðə sɪti", vi: "Nước ở thành phố tốt hơn. (water · better · city: ba chỗ giọng Mỹ vỗ /t/)" },
          { text: "Thirty people waited at gate thirteen.", ipa: "θɜːti piːpl weɪtɪd ət ɡeɪt θɜːtiːn", vi: "Ba mươi người chờ ở cổng mười ba. (THIRty — thirTEEN: nhấn khác chỗ)" },
          { text: "I bought a lot of butter and a little water.", ipa: "aɪ bɔːt ə lɒt əv bʌtər ənd ə lɪtl wɔːtə", vi: "Tôi mua nhiều bơ và một ít nước. (a lot of ≈ “a lodda” ở giọng Mỹ)" },
          { text: "The writer got it right in a matter of minutes.", ipa: "ðə raɪtə ɡɒt ɪt raɪt ɪn ə mætər əv mɪnɪts", vi: "Người viết làm đúng chỉ trong vài phút. (writer ≈ rider · got it ≈ “goddit”)" },
          { text: "Forty students attended the later meeting.", ipa: "fɔːti stjuːdnts ətendɪd ðə leɪtə miːtɪŋ", vi: "Bốn mươi sinh viên dự cuộc họp sau. (forty · later · meeting)" },
          { text: "It's a metal button, not a cotton one.", ipa: "ɪts ə metl bʌtn nɒt ə kɒtn wʌn", vi: "Đó là cúc kim loại, không phải cúc vải. (button · cotton: nhiều người nuốt /t/ thành tiếng ngắt)" },
          { text: "What a pity the computer needed updating.", ipa: "wɒt ə pɪti ðə kəmpjuːtə niːdɪd ʌpdeɪtɪŋ", vi: "Tiếc là máy tính cần cập nhật. (what a ≈ “wudda” · pity · computer · updating)" },
          { text: "Put it in the bottom drawer, not the top.", ipa: "pʊt ɪt ɪn ðə bɒtəm drɔː nɒt ðə tɒp", vi: "Để nó vào ngăn kéo dưới cùng, không phải ngăn trên. (put it in ≈ “pudidin” · bottom)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d1-nghe-flap",
        title: "Flap và glottal — chọn phương án đúng (5 câu)",
        items: [
          { q: "Một người Canada nói: “She's a /ˈraɪɾər/ for a cycling magazine.” Từ đó là:", options: ["rider", "writer", "không thể biết"], correct: 1, why: "Flap làm writer và rider nghe gần giống nhau; “for a magazine” → writer. Ngữ cảnh quyết định." },
          { q: "Phân biệt thirty và thirteen ở giọng Mỹ, dấu hiệu đáng tin nhất là:", options: ["âm /t/ có rõ hay không", "trọng âm và âm /n/ cuối", "độ to của giọng"], correct: 1, why: "thirty bị flap nên /t/ không còn đáng tin; THIRty nhấn đầu, thirTEEN nhấn cuối và kết thúc bằng /n/." },
          { q: "Người Mỹ nói “twenny dollars”. Bạn viết:", options: ["20", "21", "12"], correct: 0, why: "/nt/ giữa hai nguyên âm rút thành /n/: twenty ≈ “twenny”." },
          { q: "Người London nói “a bo’le of wa’er”. Đó là:", options: ["a bowl of wear", "a bottle of water", "a battle of waiter"], correct: 1, why: "Glottal stop thay /t/ giữa hai nguyên âm: bottle, water." },
          { q: "Giọng Mỹ: “I /kænt/ make it on Friday” với /kænt/ được nhấn, nguyên âm rõ. Người nói:", options: ["đến được thứ Sáu", "không đến được thứ Sáu", "chưa quyết định"], correct: 1, why: "can khẳng định thường yếu /kən/; nguyên âm rõ + nhấn = can't, dù /t/ cuối không bật." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Khởi động — Practice 1: sáu câu ngắn, sáu giọng" },
      {
        t: "p",
        text: "Mỗi người nói một câu. Viết **ONE WORD OR A NUMBER** cho mỗi câu. Nghe một lần.",
      },
      {
        t: "table",
        head: ["Câu", "Ghi chú cần điền"],
        rows: [
          ["1", "Price of the large size: $ ___"],
          ["2", "Meeting point: the ___ garden"],
          ["3", "Her job: ___ (for a magazine)"],
          ["4", "Event at eight o'clock: the ___ ceremony"],
          ["5", "Distance: ___ kilometres"],
          ["6", "Check-in closes at ___"],
        ],
      },
      {
        t: "listen",
        id: "t5d1-nghe-ngan",
        title: "Practice 1 — Six short extracts (mixed accents)",
        dan: { so: "Day 1, Recording 1", boiCanh: "six people each giving one piece of information.", cau: [1, 6] },
        note: "Khoảng 1 phút. Thứ tự giọng: Mỹ · Úc · Canada · Mỹ · Úc · New Zealand.",
        lines: [
          { who: "Speaker 1", voice: "us-nu", text: "The large one comes to thirty dollars even — that's three-zero. The thirteen-dollar one is the small size, and we're all out of those." },
          { who: "Speaker 2", voice: "au-nam", text: "We'd planned to meet at the rose garden, but it's closed for replanting, so head to the water garden instead. It's right beside the gate." },
          { who: "Speaker 3", voice: "ca-nu", text: "People always assume I race, because of the jacket. I'm actually a writer — I write for a cycling magazine. I hardly ever get on a bike." },
          { who: "Speaker 4", voice: "us-nam", text: "The metal workshop is cancelled tonight, I'm afraid. The only thing still on at eight is the medal ceremony, in the main hall." },
          { who: "Speaker 5", voice: "au-nu", text: "It's a bit further than it looks on the map. Forty kilometres — four-oh — so I'd allow a good hour." },
          { who: "Speaker 6", voice: "nz-nam", text: "Boarding starts at ten, and check-in closes at ten past ten, so don't leave it till the last minute." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Questions 1–6. ONE WORD OR A NUMBER",
        items: [
          { q: "1", answers: ["30", "thirty"], hint: "“thirty dollars even — that's three-zero”. thirteen là giá cỡ nhỏ." },
          { q: "2", answers: ["water"], hint: "“head to the water garden instead” — rose garden đã đóng. water ở giọng Úc có flap." },
          { q: "3", answers: ["writer"], hint: "“I'm actually a writer — I write for a cycling magazine.” Flap làm nó nghe gần “rider”; câu sau xác nhận." },
          { q: "4", answers: ["medal"], hint: "“The metal workshop is cancelled… still on at eight is the medal ceremony”. Hai từ gần như đồng âm ở giọng Mỹ; ceremony chỉ đi với medal." },
          { q: "5", answers: ["40", "forty"], hint: "“Forty kilometres — four-oh”." },
          { q: "6", answers: ["10.10", "10:10", "ten past ten", "10 past 10"], hint: "Giọng New Zealand: ten nghe gần “tin”. Boarding starts at ten là thông tin khác." },
        ],
      },
      {
        t: "note",
        title: "📌 Rút ra từ Practice 1",
        items: [
          "Cả sáu câu đều có **một từ gần giống đáp án** đứng ngay cạnh (thirteen, rose, race / rider, metal, —, ten). Đề band 8 hiếm khi cho đáp án đứng một mình.",
          "Người nói thật thường **tự xác nhận** số dễ nhầm (three-zero, four-oh). Nghe thấy lời xác nhận thì tin nó hơn tin tai.",
          "Khi âm không phân biệt được (metal / medal), ==từ đứng sau== quyết định.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — Part 1, Questions 1–10" },
      {
        t: "p",
        text: "Bạn sẽ nghe một khách hàng gọi điện cho xưởng bọc ghế để xin báo giá. Có **30 giây** đọc phiếu. Nghe **một lần**, không dừng. Người nhận điện thoại nói giọng New Zealand, khách nói giọng Canada.",
      },
      { t: "p", text: "**Questions 1–10:** Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "table",
        head: ["Hartley & Dunn Upholstery — Quotation Request", ""],
        rows: [
          ["Customer name", "Marcus **1** ___"],
          ["Address", "**2** ___ Quarry Terrace"],
          ["Item", "one armchair; frame made of **3** ___"],
          ["Main problem", "seat — damaged **4** ___"],
          ["Other damage", "tear on the **5** ___ arm (seen from the front)"],
          ["New covering", "**6** ___ blend"],
          ["Colour", "**7** ___"],
          ["Quotation", "£ **8** ___ (collection not included)"],
          ["Collection date", "Thursday **9** ___"],
          ["Time needed", "about **10** ___ weeks"],
        ],
      },
      {
        t: "listen",
        id: "t5d1-nghe-bai",
        title: "Part 1 — A quotation for restoring an armchair",
        dan: { so: "Day 1, Recording 2", boiCanh: "a telephone conversation between a member of staff at an upholstery workshop and a customer who wants an armchair restored.", cau: [1, 10] },
        note: "Khoảng 4 phút, ~175 từ/phút. Kiri: giọng New Zealand (nữ). Marcus: giọng Canada (nam).",
        lines: [
          { who: "Kiri", voice: "nz-nu", text: "Good morning, Hartley and Dunn Upholstery, Kiri speaking. How can I help?" },
          { who: "Marcus", voice: "ca-nam", text: "Hi there. I've got an old armchair that needs some serious work, and a friend told me you do restoration as well as re-covering. Is that right?" },
          { who: "Kiri", voice: "nz-nu", text: "We do, yes. Restoration's most of what we do these days, actually. If I can take a few details, I'll put a quotation together for you. Can I start with your name?" },
          { who: "Marcus", voice: "ca-nam", text: "Sure. It's Marcus Brathwaite." },
          { who: "Kiri", voice: "nz-nu", text: "Is that B-R-A-I-T-H?" },
          { who: "Marcus", voice: "ca-nam", text: "Almost. Everyone puts that extra I in. It's B-R-A-T-H-W-A-I-T-E. So just the one I, near the end." },
          { who: "Kiri", voice: "nz-nu", text: "B-R-A-T-H, W-A-I-T-E. Got it. And the address, in case we need to collect?" },
          { who: "Marcus", voice: "ca-nam", text: "Thirty Quarry Terrace." },
          { who: "Kiri", voice: "nz-nu", text: "Sorry, was that one-three?" },
          { who: "Marcus", voice: "ca-nam", text: "No, three-zero. Thirty. It's the house on the corner, with the blue gate." },
          { who: "Kiri", voice: "nz-nu", text: "Lovely. And we're talking about just the one chair?" },
          { who: "Marcus", voice: "ca-nam", text: "Just the one. It was my great-aunt's. I'd always assumed it was oak, to be honest, because the wood's so dark. But I found the original receipt in a drawer last week, dated nineteen thirty-eight, and it says the frame's walnut." },
          { who: "Kiri", voice: "nz-nu", text: "That's good news, actually. Walnut frames from that period tend to be very well made. So what's wrong with it?" },
          { who: "Marcus", voice: "ca-nam", text: "Well, the main thing is the seat. When you sit down, you sort of sink right through. I thought the webbing underneath had torn, but I turned the chair over and that looks fine. It's the springs. A couple of them have come loose, and one's snapped completely." },
          { who: "Kiri", voice: "nz-nu", text: "Right, so springs rather than webbing. That's a bigger job, but it's very fixable. Anything else?" },
          { who: "Marcus", voice: "ca-nam", text: "There's a tear in the fabric on one of the arms. The left one. Well, left when you're sitting in it." },
          { who: "Kiri", voice: "nz-nu", text: "OK. We always record it as you look at the chair from the front, so the workshop doesn't get confused. So if it's on your left when you're sitting down…" },
          { who: "Marcus", voice: "ca-nam", text: "Then from the front it's on the right. Yes, put right." },
          { who: "Kiri", voice: "nz-nu", text: "Will do. Now, the tear doesn't matter too much if you're having the whole thing re-covered anyway. Had you thought about fabric?" },
          { who: "Marcus", voice: "ca-nam", text: "I had. Originally I wanted leather, but I looked at your website and it's way out of my budget. My partner's really keen on velvet." },
          { who: "Kiri", voice: "nz-nu", text: "Velvet's beautiful. I should say, though, it does mark quite easily. Do you have any pets?" },
          { who: "Marcus", voice: "ca-nam", text: "A cat. Who thinks the chair is hers." },
          { who: "Kiri", voice: "nz-nu", text: "Then honestly, I'd steer you away from velvet. A wool blend would stand up to claws far better, and it's only slightly dearer than the linen." },
          { who: "Marcus", voice: "ca-nam", text: "That's what I'd half decided already. Let's say wool." },
          { who: "Kiri", voice: "nz-nu", text: "Good choice. And colour? In the wool we've got Slate, which is a blue-grey, Moss, which is a dark green, and Rust." },
          { who: "Marcus", voice: "ca-nam", text: "The room's mostly grey already, so not Slate. I think Moss. Is that M-O-S-S, like the plant?" },
          { who: "Kiri", voice: "nz-nu", text: "That's the one. Right, let me work this out for you. Labour for re-springing and re-covering an armchair that size starts at three hundred and ninety pounds. With the wool, which'll be about three and a half metres, the total comes to four hundred and eighty-five." },
          { who: "Marcus", voice: "ca-nam", text: "Four eighty-five. And does that include picking it up?" },
          { who: "Kiri", voice: "nz-nu", text: "Collection and delivery's a flat forty pounds on top, unless you can drop it off yourself." },
          { who: "Marcus", voice: "ca-nam", text: "It won't fit in my car, so I'll need collection. When could you come?" },
          { who: "Kiri", voice: "nz-nu", text: "The van's out your way on Tuesdays and Thursdays. I could do Tuesday the twelfth of March." },
          { who: "Marcus", voice: "ca-nam", text: "I'm away for work until the Wednesday, unfortunately. Is the Thursday possible?" },
          { who: "Kiri", voice: "nz-nu", text: "Thursday the fourteenth. Yes, there's a morning slot. Shall I put you down for that?" },
          { who: "Marcus", voice: "ca-nam", text: "Please. And how long will you have it?" },
          { who: "Kiri", voice: "nz-nu", text: "Normally I'd say four weeks. But we're waiting on a delivery of that wool at the moment, so realistically you should allow six." },
          { who: "Marcus", voice: "ca-nam", text: "Six weeks is fine. There's no rush. It's waited long enough." },
          { who: "Kiri", voice: "nz-nu", text: "Great. I'll email the quotation this afternoon. If you could send us a couple of photos, particularly of the underside, that'd really help the workshop." },
          { who: "Marcus", voice: "ca-nam", text: "No problem. Thanks very much for your help." },
          { who: "Kiri", voice: "nz-nu", text: "You're welcome, Marcus. Bye now." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-nghe-phieu",
        kind: "fill",
        title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1", answers: ["Brathwaite"], hint: "Kiri đoán B-R-A-I-T-H; Marcus sửa: “B-R-A-T-H-W-A-I-T-E… just the one I, near the end”. Viết Braithwaite là sai." },
          { q: "2", answers: ["30", "thirty"], hint: "“Thirty Quarry Terrace” — có flap nên Kiri hỏi lại “one-three?” → “No, three-zero.”" },
          { q: "3", answers: ["walnut"], hint: "“I'd always assumed it was oak… but… the receipt… says the frame's walnut.” oak là điều tưởng nhầm." },
          { q: "4", answers: ["springs"], hint: "“I thought the webbing underneath had torn, but… that looks fine. It's the springs.” Số nhiều: a couple of them." },
          { q: "5", answers: ["right"], hint: "Marcus nói left (khi ngồi). Phiếu ghi “seen from the front” → “from the front it's on the right. Yes, put right.”" },
          { q: "6", answers: ["wool"], hint: "leather (quá đắt) → velvet (dễ bẩn, nhà có mèo) → “Let's say wool.” linen chỉ được nhắc để so giá." },
          { q: "7", answers: ["Moss", "moss"], hint: "“not Slate. I think Moss… M-O-S-S, like the plant”." },
          { q: "8", answers: ["485"], hint: "390 là riêng tiền công; “the total comes to four hundred and eighty-five”. 40 là phí lấy hàng — phiếu ghi collection not included." },
          { q: "9", answers: ["14 March", "14th March", "March 14", "March 14th", "14"], hint: "Tuesday the twelfth → khách đi vắng → “Thursday the fourteenth”. Giọng New Zealand: twelfth nghe gần “twilfth”." },
          { q: "10", answers: ["six", "6"], hint: "“Normally… four weeks. But… realistically you should allow six.”" },
        ],
      },
      {
        t: "table",
        head: ["Câu", "Trên phiếu", "Thông tin nhiễu", "Kiểu bẫy"],
        rows: [
          ["1", "Marcus ___", "B-R-A-I-T-H (người nghe đoán sai)", "đánh vần bị sửa — chữ thừa"],
          ["2", "___ Quarry Terrace", "one-three", "flap: thirty / thirteen"],
          ["3", "frame made of ___", "oak", "điều tưởng nhầm nói trước"],
          ["4", "damaged ___", "webbing", "nghi ngờ rồi loại; đáp án số nhiều"],
          ["5", "___ arm (seen from the front)", "left", "==đổi góc nhìn== — bẫy mới ở band 8"],
          ["6", "___ blend", "leather · velvet · linen", "ba phương án bị loại lần lượt"],
          ["8", "£ ___", "390 · 40", "hai con số đều thật, chỉ một con là tổng"],
          ["9", "Thursday ___", "Tuesday the twelfth", "đề nghị đầu bị từ chối"],
          ["10", "about ___ weeks", "four", "normally… but realistically…"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Bẫy đổi góc nhìn (câu 5) — cẩn thận",
        items: [
          "Người nói đưa thông tin theo góc của **họ** (left when you're sitting in it). Phiếu yêu cầu theo góc **khác** (seen from the front). Đáp án là từ ngược lại.",
          "Cùng họ bẫy này: giá **chưa** thuế ↔ **gồm** thuế; số người **lớn** ↔ **tổng** số người; giờ **khởi hành** ↔ giờ **có mặt**.",
          "Cách chống: trong 30 giây đọc phiếu, khoanh mọi ghi chú trong ngoặc và mọi từ hạn định (total, per person, including, from the front).",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hai phút kiểm — bản band 8" },
      {
        t: "table",
        head: ["#", "Soát gì", "Ví dụ từ bài hôm nay"],
        rows: [
          ["1", "Tên riêng: đúng từng chữ đã đánh vần, viết hoa chữ đầu", "Brathwaite — không thêm i"],
          ["2", "Số: có đơn vị trên phiếu rồi thì không chép lại", "485, không viết £485 pounds"],
          ["3", "Số nhiều: nhìn từ đứng trước ô", "damaged springs"],
          ["4", "Giới hạn từ: ONE WORD AND/OR A NUMBER", "14 March ✓ · the 14th of March ✗"],
          ["5", "Ô có ngoặc: đã đổi góc nhìn chưa?", "right, không phải left"],
          ["6", "Câu không chắc: đánh dấu ?, vẫn điền", "không bao giờ để trống"],
        ],
      },
      {
        t: "table",
        head: ["Đúng / 10", "Đánh giá", "Việc cần làm"],
        rows: [
          ["10", "đúng nhịp band 8", "giữ; sang Ngày 4 (Part 2 + 3, bốn người nói)"],
          ["8–9", "band 7–7.5", "câu sai thuộc bẫy nào trong bảng trên? Ghi Sổ lỗi theo tên bẫy"],
          ["≤ 7", "tốc độ / giọng còn là vấn đề", "nghe lại có kịch bản; ôn Tập 4 Ngày 1 · Ngày 21 và Tập 3 Ngày 24 (giọng NZ)"],
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "upholstery", pos: "n", ipa: "/ʌpˈhəʊlstəri/", vi: "nghề / việc bọc ghế; lớp vải nệm bọc ghế", ex: "The upholstery on the sofa was badly worn.", exVi: "Lớp vải bọc chiếc sofa đã sờn nhiều.", more: "upholster (v) · upholsterer (thợ bọc ghế) · re-cover a chair" },
          { w: "quotation", pos: "n", ipa: "/kwəʊˈteɪʃn/", vi: "bảng báo giá (trang trọng); lời trích dẫn", ex: "We asked three firms for a written quotation.", exVi: "Chúng tôi xin báo giá bằng văn bản của ba công ty.", more: "văn nói: **a quote** · ⚠️ khác **estimate** (ước tính, có thể đổi) — quotation là giá chốt" },
          { w: "come loose", pos: "phr v", ipa: "/kʌm luːs/", vi: "bị lỏng ra, bung ra", ex: "One of the wheels had come loose, so we pulled over.", exVi: "Một bánh xe bị lỏng ra nên chúng tôi tấp vào lề.", more: "trong bài nghe: A couple of them have come loose · gần nghĩa: work loose · trái nghĩa: tighten" },
          { w: "steer someone away from", pos: "phrase", ipa: "/stɪə ˈsʌmwʌn əˈweɪ frɒm/", vi: "khéo khuyên ai tránh (một lựa chọn)", ex: "The adviser steered me away from the most expensive course.", exVi: "Người tư vấn khéo khuyên tôi tránh khoá đắt nhất.", more: "trái nghĩa: steer someone **towards** · dùng tốt trong Speaking Part 2 về lời khuyên" },
          { w: "stand up to", pos: "phr v", ipa: "/stænd ʌp tuː/", vi: "chịu được (sự mài mòn, sự kiểm tra kỹ)", ex: "The theory does not stand up to close examination.", exVi: "Lý thuyết đó không đứng vững khi xem xét kỹ.", more: "stand up to wear / scrutiny · ⚠️ stand up **for** = bênh vực" },
          { w: "dear", pos: "adj", ipa: "/dɪə/", vi: "(Anh, Úc, NZ; văn nói) đắt", ex: "It's a bit dearer than the other one, but it'll last longer.", exVi: "Nó đắt hơn cái kia một chút nhưng sẽ bền hơn.", more: "Trong Listening: dearer = more expensive. Không dùng trong Writing." },
          { w: "a flat fee", pos: "n phr", ipa: "/ə flæt fiː/", vi: "phí cố định (không đổi theo số lượng)", ex: "Delivery is a flat fee of forty pounds anywhere in the city.", exVi: "Phí giao hàng cố định bốn mươi bảng ở bất cứ đâu trong thành phố.", more: "a flat rate · a flat forty pounds (văn nói)" },
          { w: "realistically", pos: "adv", ipa: "/ˌrɪəˈlɪstɪkli/", vi: "nói cho thực tế thì", ex: "Realistically, the project will not be finished before June.", exVi: "Nói cho thực tế thì dự án sẽ không xong trước tháng Sáu.", more: "Tín hiệu Listening: “Normally X, but **realistically** Y” → Y là đáp án." },
        ],
      },
      {
        t: "note",
        title: "📌 Sau bài này",
        items: [
          "Nghe lại bài chính **có kịch bản**, đánh dấu mọi chữ t bạn nghe thành d (thirty, water…) hoặc không nghe thấy. Đếm xem có bao nhiêu chỗ.",
          "Từ nay tới Ngày 8 (Đề 9), mỗi ngày nghe 10 phút một nguồn không phải giọng Anh – Mỹ chuẩn: tin tức New Zealand, Úc, Ireland hoặc Canada.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d1-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 1 — kiểm soát thì · hedging đúng liều · danh hoá và giới từ · đọc mức chắc chắn · Part 1 giọng Ireland · flap / glottal",
    goal: "Ôn trọn Ngày 1: chia đúng thì ở bốn bẫy band 7.5, chọn đúng liều hedging, điền đúng giới từ sau danh từ danh hoá, sửa sáu lỗi tinh, dịch năm câu học thuật, đọc một đoạn lập luận ngắn và trả lời câu YES / NO / NOT GIVEN có bẫy mức chắc chắn, nghe một tin nhắn thoại giọng Ireland có lời sửa — 45 câu có đáp án và một đoạn viết AI chấm.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        items: [
          "45 câu, làm một mạch khoảng 50 phút. Mỗi phần ghi rõ ôn mục nào của bài nào — sai phần nào thì quay lại đúng mục đó.",
          "Mục tiêu band 8: **≥ 40/45**. Dưới 36: làm lại Bài 1 mục 3 và mục 5 trước khi sang Ngày 2.",
          "Phần IX (viết đoạn) không tính vào 45 câu — nhưng là phần quan trọng nhất: bạn tự đếm **tỉ lệ câu sạch** lần đầu.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 1 trong một hình",
        center: "Band 8 = sạch lỗi + đúng mức",
        branches: [
          { label: "Thì", items: ["bản đồ thì", "once / until + hiện tại", "By → hoàn thành", "động từ trạng thái"] },
          { label: "Hedging", items: ["1 nhận định = 1 hedge", "thesis không hedge", "little / growing evidence", "by no means · not necessarily"] },
          { label: "Danh hoá", items: ["This + N nối câu trước", "N of N of N → động từ", "giới từ theo từ gốc"] },
          { label: "Đọc", items: ["15 phút / passage", "đọc 1 lượt + ghi lề", "paraphrase mức 4"] },
          { label: "Nghe", items: ["flap: t ≈ d", "glottal: t = tiếng ngắt", "đổi góc nhìn"] },
        ],
      },

      { t: "h", text: "I. Chia động từ trong ngoặc (8 câu) — ôn Bài 1 mục 2–3" },
      {
        t: "quiz",
        id: "t5d1-bt-thi",
        kind: "fill",
        title: "I. Chia động từ",
        items: [
          { q: "Over the past thirty years, the average size of a new home ___ (shrink) considerably.", answers: ["has shrunk"], hint: "Over the past… → hiện tại hoàn thành. shrink – shrank – shrunk." },
          { q: "When the factory ___ (close) in 1998, a third of the town lost their jobs.", answers: ["closed"], hint: "Mốc 1998 → quá khứ đơn." },
          { q: "By the middle of this century, sea levels ___ (rise) by at least 20 centimetres.", answers: ["will have risen"], hint: "By + mốc tương lai → will have + V3." },
          { q: "Farmers will not switch crops until they ___ (be) sure of a market.", answers: ["are"], hint: "until + hiện tại." },
          { q: "A 2020 review ___ (conclude) that the programme works best with younger children.", answers: ["concluded"], hint: "Nghiên cứu có năm → quá khứ đơn; điều rút ra (works) giữ hiện tại." },
          { q: "The region ___ (contain) more than half of the country's forests.", answers: ["contains"], hint: "contain: động từ trạng thái." },
          { q: "By the time the alarm was raised, the thieves ___ (leave) the building.", answers: ["had left"], hint: "By the time + quá khứ → had + V3." },
          { q: "This is the third time this year that the bank ___ (raise) interest rates.", answers: ["has raised"], hint: "It is the first / third time + hiện tại hoàn thành." },
        ],
      },

      { t: "h", text: "II. Hedging đúng liều (6 câu) — ôn Bài 1 mục 5" },
      {
        t: "mcq",
        id: "t5d1-bt-hedge",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "Children who read every day ___ do better at school.", options: ["always", "tend to", "may possibly perhaps", "are proved to"], correct: 1, why: "Xu hướng chung → tend to. always quá tuyệt đối; C rào chồng." },
          { q: "Câu nào mắc lỗi rào chồng?", options: ["This may explain the trend.", "This appears to explain the trend.", "This could possibly perhaps explain the trend.", "This partly explains the trend."], correct: 2, why: "could + possibly + perhaps = ba lớp cho một nhận định." },
          { q: "There is ___ evidence that the policy has reduced crime; most studies find no effect.", options: ["growing", "strong", "little", "clear"], correct: 2, why: "Vế sau “most studies find no effect” → little evidence." },
          { q: "A higher minimum wage does not ___ lead to job losses.", options: ["necessary", "necessarily", "by no means", "tend"], correct: 1, why: "does not necessarily + V." },
          { q: "Câu nào KHÔNG nên rào đón?", options: ["Smoking damages the lungs.", "Video games make children violent.", "Tourism destroys local culture.", "Remote work reduces productivity."], correct: 0, why: "Sự thật đã được xác lập thì nói thẳng. Ba câu còn lại là nhận định gây tranh cãi → cần hedge." },
          { q: "Chọn câu kết bài tốt nhất:", options: ["In conclusion, it may perhaps be somewhat true that cars could be limited.", "In conclusion, I am convinced that city centres should be closed to private cars.", "In conclusion, cars are maybe bad.", "In conclusion, it seems that possibly I agree."], correct: 1, why: "Kết bài nêu ý kiến của bạn → chắc, không hedge." },
        ],
      },

      { t: "h", text: "III. Danh hoá và giới từ (6 câu) — ôn Bài 1 mục 6" },
      {
        t: "quiz",
        id: "t5d1-bt-danh-hoa",
        kind: "fill",
        title: "III. Điền MỘT từ",
        items: [
          { q: "House prices doubled. This ___ has made it harder for young people to buy. (danh từ)", answers: ["rise", "increase", "growth", "surge", "doubling"], hint: "This + danh từ tóm tắt ý câu trước." },
          { q: "There is a clear link ___ poverty and poor health.", answers: ["between"], hint: "a link between A and B." },
          { q: "The report highlights the impact of tourism ___ small island communities.", answers: ["on", "upon"], hint: "impact on." },
          { q: "The government has announced a 3% increase ___ public-sector pay.", answers: ["in"], hint: "increase IN + thứ tăng (3% đứng trước làm tính từ)." },
          { q: "Public support ___ the scheme has fallen since last year.", answers: ["for"], hint: "support for." },
          { q: "The ___ of free bus travel for students cut car journeys by a tenth. (introduce)", answers: ["introduction"], hint: "introduce → the introduction of." },
        ],
      },

      { t: "h", text: "IV. Sửa lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu) — ôn các ô ⚠️ của Bài 1" },
      {
        t: "quiz",
        id: "t5d1-bt-sua-loi",
        kind: "fill",
        title: "IV. Mỗi câu một lỗi",
        items: [
          { q: "In recent years, the cost of solar panels [fell] dramatically.", answers: ["has fallen"], hint: "In recent years → hiện tại hoàn thành." },
          { q: "Once the new rules [will take] effect, landlords will have to register.", answers: ["take", "have taken"], hint: "Once + hiện tại." },
          { q: "More and more parents [are believing] that homework is unnecessary.", answers: ["believe"], hint: "believe: động từ trạng thái." },
          { q: "Many [researches have] shown the benefits of bilingual education.", answers: ["studies have", "pieces of research have"], hint: "research không đếm được → studies have / a great deal of research has." },
          { q: "The growth in online sales [have] hurt high-street shops.", answers: ["has"], hint: "Danh từ chính: growth (số ít)." },
          { q: "Teenagers [tend to not] read newspapers.", answers: ["tend not to", "do not tend to", "don't tend to"], hint: "tend not to + V." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 2 · 5 · 6" },
      {
        t: "quiz",
        id: "t5d1-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng từ trong gợi ý",
        grammar: "has + V3 · will have + V3 · There is little evidence that… · This + N · by no means",
        items: [
          { q: "Kể từ năm 2010, số sinh viên quốc tế đã tăng gấp đôi.", answers: ["Since 2010, the number of international students has doubled.", "The number of international students has doubled since 2010."], hint: "since 2010 · the number of · double" },
          { q: "Đến năm 2050, dân số thế giới sẽ đạt mười tỉ người.", answers: ["By 2050, the world's population will have reached ten billion.", "By 2050, the world population will have reached ten billion.", "By 2050, the world's population will have reached 10 billion."], hint: "By 2050 · will have reached · ten billion" },
          { q: "Có rất ít bằng chứng cho thấy đồng phục cải thiện kết quả học tập.", answers: ["There is little evidence that school uniforms improve academic results.", "There is little evidence that uniforms improve academic results.", "There is little evidence to suggest that school uniforms improve academic results.", "There is little evidence that school uniforms improve academic performance."], hint: "little evidence · school uniforms · improve · academic results" },
          { q: "Giá thuê nhà đã tăng mạnh. Sự gia tăng này đã buộc nhiều gia đình rời khỏi trung tâm.", answers: ["Rents have risen sharply. This rise has forced many families to leave the centre.", "Rents have risen sharply. This increase has forced many families to leave the centre.", "Rents have risen sharply. This increase has forced many families out of the centre.", "Rents have risen sharply. This rise has forced many families out of the centre."], hint: "rents · rise sharply · This rise / increase · force … to leave" },
          { q: "Công nghệ hoàn toàn không phải là giải pháp duy nhất.", answers: ["Technology is by no means the only solution."], hint: "by no means · the only solution" },
        ],
      },

      { t: "h", text: "VI. Đọc — mức chắc chắn của người viết (5 câu · 6 phút) — ôn Bài 2 mục 3 · câu 6–10" },
      {
        t: "passage",
        title: "The Curse of Knowledge",
        paras: [
          { label: "A", text: "In 1990 a graduate student at Stanford University, Elizabeth Newton, divided volunteers into ‘tappers’ and ‘listeners’. Each tapper chose a well-known tune, such as ‘Happy Birthday’, and tapped out its rhythm on a table; the listener's task was to name the song. Before hearing the answers, tappers were asked to predict how often their partners would succeed. They guessed about half the time. In fact, of the 120 tunes tapped, listeners identified just three." },
          { label: "B", text: "The gap is usually explained by what economists had already begun to call the curse of knowledge. A tapper cannot help hearing the melody in her head as she taps, and finds it almost impossible to imagine the experience of someone who hears only knocking. Once we know something, in other words, we tend to lose the ability to see the world as it looks to a person who does not." },
          { label: "C", text: "The implications reach well beyond party games. Experts who write instructions, teachers who introduce a new topic and engineers who design software are all, in a sense, tapping. This is not to say that expertise makes people poor communicators; it is to say that good explanation requires a deliberate effort to recover the beginner's point of view, and that confidence in one's own clarity is, by itself, no evidence of it." },
        ],
      },
      {
        t: "mcq",
        id: "t5d1-bt-doc",
        title: "VI. Do the statements agree with the claims of the writer? YES / NO / NOT GIVEN",
        items: [
          { q: "1. The tappers greatly overestimated how successful the listeners would be.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoán “about half the time”; thực tế 3 trên 120 → đoán cao hơn rất nhiều." },
          { q: "2. Listeners did better when the tune was one they had heard recently.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài không nói gì về việc bài hát được nghe gần đây hay không." },
          { q: "3. The expression ‘the curse of knowledge’ was first used by Newton.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“what economists had **already** begun to call…” — quá khứ hoàn thành + already: thuật ngữ có trước, do các nhà kinh tế dùng." },
          { q: "4. The writer believes that experts are generally bad at explaining things.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“This is not to say that expertise makes people poor communicators” — tác giả tự giới hạn nhận định (Bài 1 mục 5)." },
          { q: "5. Explaining well involves consciously trying to see things as a beginner would.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "“good explanation requires a deliberate effort to recover the beginner's point of view” — deliberate effort = consciously trying." },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: ba chỗ ngữ pháp Bài 1 quyết định đáp án",
        items: [
          "Câu 3: **had already begun** — một thì quá khứ hoàn thành đủ để trả lời NO.",
          "Câu 4: **This is not to say that…** — khung giới hạn nhận định; thấy nó là biết tác giả KHÔNG nói điều đứng sau.",
          "Đoạn B: **we tend to lose** — tác giả rào một lần, nên câu hỏi kiểu “people always lose…” sẽ là NO.",
        ],
      },

      { t: "h", text: "VII. Nghe — một tin nhắn thoại giọng Ireland (5 câu) — ôn Bài 3 mục 4" },
      {
        t: "p",
        text: "Một thợ sửa đồng hồ để lại lời nhắn cho khách. Đọc ghi chú trong 15 giây rồi nghe **một lần**. Write **ONE WORD OR A NUMBER** for each answer.",
      },
      {
        t: "table",
        head: ["Corrib Clock Repairs — message", ""],
        rows: [
          ["Part that needs fixing", "the **1** ___"],
          ["Cost", "€ **2** ___"],
          ["Ready on", "**3** ___"],
          ["Shop closed for lunch", "from one until **4** ___"],
          ["Customer must bring", "the **5** ___"],
        ],
      },
      {
        t: "listen",
        id: "t5d1-bt-nghe",
        title: "A voicemail from Corrib Clock Repairs",
        dan: { so: "Day 1, Recording 3", boiCanh: "a voicemail message from a repair shop.", cau: [1, 5] },
        note: "Khoảng 50 giây, giọng Ireland (nam). Có ba chỗ sửa lời.",
        lines: [
          { who: "Declan", voice: "ie-nam", text: "Hello, this is a message for Ms Okafor. It's Declan at Corrib Clock Repairs. We've had a good look at your wall clock, and it's better news than I expected. I'd thought the spring was broken, but it turns out it's only the pendulum that's come off its hook and got bent." },
          { who: "Declan", voice: "ie-nam", text: "So the cost will be forty-five euro, rather than the ninety I mentioned on Saturday. It'll be ready on Thursday, not Tuesday as I said, because I want to run it for a couple of days to be sure it's keeping time." },
          { who: "Declan", voice: "ie-nam", text: "We're open till half five, but we do close for lunch between one and two. And when you come, could you bring the key? The small brass one. I'll need it to test the chime. Thanks a million. Bye." },
        ],
      },
      {
        t: "quiz",
        id: "t5d1-bt-nghe-dien",
        kind: "fill",
        title: "VII. Questions 1–5 — ONE WORD OR A NUMBER",
        items: [
          { q: "1", answers: ["pendulum"], hint: "“I'd thought the spring was broken, but… it's only the pendulum”. spring là điều tưởng nhầm." },
          { q: "2", answers: ["45", "forty-five", "forty five"], hint: "“forty-five euro, rather than the ninety I mentioned”." },
          { q: "3", answers: ["Thursday"], hint: "“ready on Thursday, not Tuesday as I said”." },
          { q: "4", answers: ["two", "2", "2.00", "2 o'clock"], hint: "“close for lunch between one and two”. half five là giờ đóng cửa buổi chiều." },
          { q: "5", answers: ["key"], hint: "“could you bring the key? The small brass one.”" },
        ],
      },

      { t: "h", text: "VIII. Flap /t/ và glottal stop (4 câu) — ôn Bài 3 mục 2" },
      {
        t: "mcq",
        id: "t5d1-bt-flap",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "Ở giọng Mỹ, từ nào KHÔNG có flap?", options: ["city", "better", "attend", "water"], correct: 2, why: "attend: /t/ đứng đầu âm tiết ĐƯỢC NHẤN (aTTEND) → /t/ rõ. Flap chỉ xảy ra khi âm tiết sau không nhấn." },
          { q: "Người Úc nói “I'll gedda lodda wader”. Câu đó là:", options: ["I'll get a lot of water.", "I'll give a lot away.", "I'll get a ladder."], correct: 0, why: "get a ≈ “gedda”, lot of ≈ “lodda”, water ≈ “wader” — ba flap liền nhau." },
          { q: "Nghe “fourdy” với trọng âm ở âm tiết đầu, không có /n/ cuối. Bạn viết:", options: ["14", "40", "44"], correct: 1, why: "Nhấn đầu + không /n/ cuối = forty." },
          { q: "Khi NÓI trong phòng thi, bạn nên:", options: ["cố bắt chước flap cho giống người Mỹ", "nuốt /t/ cho giống người London", "đọc /t/ rõ, đều, nhất quán", "tránh mọi từ có chữ t"], correct: 2, why: "Tiêu chí Pronunciation chấm độ dễ hiểu và sự nhất quán, không chấm giọng vùng nào." },
        ],
      },

      { t: "h", text: "IX. Viết một thân bài 6–7 câu rồi tự đếm câu sạch (110–140 từ) — AI chấm" },
      {
        t: "p",
        text: "Viết **một** thân bài cho đề dưới. Bắt buộc: (1) một câu xu hướng ở hiện tại hoàn thành; (2) một ví dụ có mốc ở quá khứ đơn; (3) đúng **hai** chỗ hedging, mỗi nhận định một hedge; (4) một câu mở bằng **This + danh từ**; (5) câu cuối là ý kiến của bạn, không hedge. Viết xong, đếm: tổng số câu ___ · số câu sạch ___ — rồi mới bấm chấm.",
      },
      {
        t: "essay",
        id: "t5d1-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Some people believe that the best way to reduce traffic in cities is to make public transport free. Write ONE body paragraph (110–140 words) that evaluates this idea. Include: one trend in the present perfect, one dated example in the past simple, exactly two hedged claims, one sentence beginning with This + noun, and a final sentence that states your own view without hedging.",
        minWords: 110,
        tips: [
          "Xu hướng: Fare-free schemes have attracted growing interest in recent years.",
          "Ví dụ có mốc (có thể hư cấu, nhưng thì phải đúng): When one city scrapped fares in 2019, bus use rose…",
          "Hedge 1: Free travel may attract people who would otherwise have walked. Hedge 2: …is unlikely to persuade drivers…",
          "This + N: This shift, however, … / This finding suggests that…",
          "Câu cuối: I would therefore argue that reliability, not price, is what gets drivers out of their cars.",
        ],
      },
      {
        t: "note",
        title: "📌 Một thân bài mẫu để so sau khi đã viết (band 8, ước tính) — 7 câu, 7 câu sạch",
        items: [
          "Fare-free public transport has attracted growing interest in recent years, and its appeal is easy to understand. When Tallinn abolished fares for residents in 2013, bus and tram use rose, though by less than its supporters had hoped. This modest increase points to a difficulty: many of the new passengers appear to have been people who had previously walked or cycled, not former drivers. Price, in other words, is by no means the only reason people choose the car. A commuter who needs to arrive on time is unlikely to abandon driving for a bus that is free but slow and overcrowded. Removing fares also deprives operators of the income they need to improve the service. I would therefore argue that reliability and frequency, not price, are what get drivers out of their cars.",
          "Soi: xu hướng (has attracted) · ví dụ có mốc (abolished… rose… had hoped) · hai hedge (appear to have been · is unlikely to) · This modest increase · câu cuối không hedge. Tallinn bỏ vé cho cư dân từ năm 2013 là dữ kiện thật; mức tăng cụ thể được nói mờ có chủ ý.",
        ],
      },
    ],
  },
];
