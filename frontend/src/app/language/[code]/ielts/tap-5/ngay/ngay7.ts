/**
 * IELTS Tập 5 — Ngày 7 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, bài mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)  Bị động + rút gọn trong Task 1 process (vòng 3 của G24 · G26 · G35) + Academic Phrasebank cho Task 1 [VD9]
 *                    — nối Tập 3 Ngày 13 (bị động mọi thì) · Tập 3 Ngày 17 (rút gọn mệnh đề quan hệ) · Tập 4 Ngày 5 (participle
 *                    clauses) · Tập 2 Ngày 20 / Tập 3 Ngày 28 (process) · Tập 4 Ngày 6 · 21 (Phrasebank). Có mục "dùng cho map"
 *                    để chuẩn bị Đề 9 (Ngày 8) — ví dụ KHÁC đề.
 *   Bài 2 (reading)  Short answer + Sentence completion ở Passage 3 [R09 R01] — bài đọc ~980 từ "The Rising Curve" (hiệu ứng
 *                    Flynn: điểm IQ tăng suốt thế kỷ 20), 13 câu — nối Tập 2 Ngày 8 · Tập 3 Ngày 7 · 15 (short answer).
 *                    Dữ kiện thật: Flynn 1984 (≈ 14 điểm, 1932–1978, ~3 điểm/thập kỷ) · 1987 (14 nước) · Tuddenham 1948 ·
 *                    Raven's Progressive Matrices · Lynn (dinh dưỡng, chiều cao) · Luria (Trung Á, thập niên 1930) ·
 *                    Bratsberg & Rogeberg 2018 (Na Uy, hơn 730.000 kết quả, so anh em trai). Lời văn tự viết.
 *   Bài 3 (speaking) Part 2 band 8 — người / nơi với chi tiết cảm quan [S05] · 🔊 giọng kể — nối Tập 4 Ngày 6 (người / nơi có
 *                    câu chuyện nhỏ) · Tập 3 Ngày 7 · 14. Thẻ đề mới (không trùng thẻ đã dùng ở Tập 3–5 và Đề 9–12).
 *   Bài tập Ngày 7   42 câu có đáp án
 * Mọi id bắt đầu `t5d7-`.
 */
import type { Lesson } from '../data';

export const NGAY_7: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d7-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Bị động + rút gọn trong Task 1 process (vòng 3) + Academic Phrasebank",
    goal: "Viết một thân bài Task 1 process ở mức band 8: chọn đúng bị động hay chủ động cho từng bước, gộp 2–3 bước vào một câu bằng mệnh đề rút gọn (Once filtered… · …, leaving… · the sap collected…) mà không sai chủ ngữ, và nối các bước bằng 12 cụm Phrasebank thay cho Then… Next… After that….",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA + Coherence của Writing Task 1 từ 7 lên 8**: band 7 viết đúng bị động từng câu; band 8 **gộp bước** bằng cấu trúc rút gọn, câu dài mà vẫn sạch lỗi.",
          "**Vòng 3** của ba điểm đã học: bị động (Tập 3 Ngày 13), mệnh đề quan hệ rút gọn (Tập 3 Ngày 17), participle clause (Tập 4 Ngày 5). Hôm nay không học lại định nghĩa — học **khi nào chọn cái nào** trong một bài process.",
          "Ba quyết định cho mỗi bước: (1) **bị động hay chủ động?** (2) **câu riêng hay gộp vào câu trước?** (3) **nối bằng gì?**",
          "Thêm **12 cụm Academic Phrasebank** cho Task 1 (This is followed by… · , after which… · , at which point… · The process culminates in…).",
          "Cuối bài có mục **dùng cho map**: ngày mai (Ngày 8) bạn làm **Đề 9**, Task 1 là bản đồ hai mốc — cùng bộ công cụ này.",
        ],
      },

      { t: "h", text: "1. Vòng 3 — band 7 và band 8 khác nhau ở đâu" },
      { t: "p", text: "Ở Tập 3 bạn học **công thức** bị động. Ở Tập 4 bạn học **rút gọn** mệnh đề. Cả hai lần, bài tập đều cho sẵn cấu trúc cần dùng. Trong phòng thi không ai cho sẵn: bạn nhìn 8–10 ô của một sơ đồ và phải tự quyết định. Người viết band 7 thường chọn an toàn: mỗi ô một câu bị động. Bài đúng, nhưng giám khảo thấy một dãy câu giống hệt nhau." },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Bị động", "Đúng dạng; dùng cho mọi bước, kể cả bước tự xảy ra", "Bị động cho bước **có người làm**; chủ động cho bước **tự xảy ra** (the sap flows · the water evaporates)"],
          ["Độ dài câu", "Mỗi bước một câu, 10–12 từ", "2–3 bước một câu, 20–28 từ, đọc một lần vẫn hiểu"],
          ["Rút gọn", "Thỉnh thoảng một mệnh đề V3 sau danh từ", "Dùng có chủ ý: trước động từ chính (Once filtered,) · sau danh từ (the sap collected) · cuối câu (, leaving…)"],
          ["Từ nối", "First · Then · Next · After that · Finally", "Phrasebank: Following this, · , after which · , at which point · This is followed by"],
          ["Lỗi", "1–2 lỗi nhỏ về thì hoặc chủ ngữ treo", "0–1 lỗi cả bài"],
        ],
      },
      { t: "p", text: "Làm bài chẩn đoán trước khi học. Câu nào sai, ghi số câu lại: đó là mục bạn cần đọc chậm." },
      {
        t: "quiz", id: "t5d7-chan-doan", title: "Chẩn đoán đầu bài — viết dạng đúng của động từ trong ngoặc (8 câu)", kind: "fill",
        items: [
          { q: "First, the olives ___ (wash) in cold water.", answers: ["are washed"], hint: "Có người / máy làm ⇒ bị động, hiện tại đơn." },
          { q: "As the mixture cools, the fat ___ (rise) to the surface.", answers: ["rises"], hint: "rise là nội động từ ⇒ không có bị động." },
          { q: "The whole cycle ___ (take place) over about six weeks.", answers: ["takes place"], hint: "take place không bao giờ ở bị động." },
          { q: "The bottles are then left ___ (cool) overnight.", answers: ["to cool"], hint: "be left + to V." },
          { q: "After ___ (heat) to 80°C, the milk is cooled rapidly.", answers: ["being heated"], hint: "Sau giới từ + V-ing; sữa BỊ đun ⇒ being + V3." },
          { q: "Once ___ (dry), the leaves are sorted by size.", answers: ["dried"], hint: "Once + V3 = Once they have been dried." },
          { q: "The grapes are crushed, ___ (release) the juice.", answers: ["releasing"], hint: "Kết quả của hành động trước ⇒ , V-ing." },
          { q: "The final product ___ (consist) of 66 per cent sugar.", answers: ["consists"], hint: "consist of: chủ động, không tiếp diễn." },
        ],
      },

      { t: "h", text: "2. Quyết định ① — bị động hay chủ động?" },
      { t: "p", text: "Quy tắc Tập 2 dạy: “process ⇒ bị động”. Quy tắc đó đúng khoảng 70 %. Phần còn lại là những bước **không ai làm cả**: nước bốc hơi, nhựa cây chảy, hỗn hợp đặc lại. Tiếng Anh dùng **chủ động** cho những bước này. Hỏi một câu duy nhất: **“Có ai (người, máy) tác động lên vật này không?”**" },
      {
        t: "patterns", rows: [
          { formula: "S (vật) + am / is / are + V3  — có người / máy làm", vi: "Bước nhân tạo. Không cần by + người làm (ai cũng hiểu là công nhân, máy).", examples: [
            { en: "The trees are tapped in late winter.", vi: "Cây được khoan lấy nhựa vào cuối mùa đông." },
            { en: "The syrup is filtered and then graded by colour.", vi: "Xi-rô được lọc rồi phân hạng theo màu." },
          ] },
          { formula: "S (vật) + V(s/es)  — bước tự xảy ra", vi: "Động từ “tự đổi trạng thái”: evaporate, melt, freeze, harden, thicken, dissolve, cool, flow, sink, settle, expand, condense.", examples: [
            { en: "As the sap boils, most of the water evaporates.", vi: "Khi nhựa cây sôi, phần lớn nước bốc hơi." },
            { en: "The liquid gradually thickens and darkens.", vi: "Chất lỏng đặc dần và sẫm màu dần." },
          ] },
          { formula: "S + V(s/es)  — nội động từ: KHÔNG BAO GIỜ bị động", vi: "occur, happen, take place, emerge, appear, arrive, remain, rise, fall, last, consist of, result in / from.", examples: [
            { en: "Fermentation takes place in sealed tanks.", vi: "Quá trình lên men diễn ra trong các bồn kín." },
            { en: "What remains is a thick, dark paste.", vi: "Thứ còn lại là một lớp bột nhão đặc, sẫm màu." },
          ] },
        ],
      },
      {
        t: "table", caption: "Cùng một động từ — hai nghĩa khác nhau", head: ["Chủ động (tự nó)", "Bị động (có người làm)", "Chọn theo"],
        rows: [
          ["The water **evaporates** in the sun.", "The water **is evaporated** in a heated pan.", "Sơ đồ có vẽ thiết bị làm việc đó không?"],
          ["The chocolate **melts** at 34°C.", "The chocolate **is melted** over hot water.", "Có ô “heater / oven / boiler” ⇒ bị động"],
          ["The clay **dries** slowly in the air.", "The clay **is dried** in a kiln.", "Có ghi nơi / máy ⇒ bị động"],
          ["The mixture **cools** to room temperature.", "The mixture **is cooled** rapidly.", "Có trạng từ chỉ cách làm (rapidly, by fans) ⇒ bị động"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở bước tự xảy ra",
        items: [
          "~~The fermentation is happened in large tanks.~~ → Fermentation **takes place** in large tanks. (Tiếng Việt “được diễn ra” kéo theo be + V3.)",
          "~~The syrup is consisted of sugar and water.~~ → The syrup **consists of** sugar and water.",
          "~~Only the seeds are remained.~~ → Only the seeds **remain**. / Only the seeds **are left**.",
          "~~The temperature is risen to 100°C.~~ → The temperature **rises** to 100°C. / The temperature **is raised** to 100°C. (rise tự lên · raise ai đó nâng lên)",
          "Ngược lại, đừng bỏ bị động ở bước có người làm: ~~The beans roast for 20 minutes~~ nghe như hạt tự rang. Viết: The beans **are roasted** for 20 minutes.",
        ],
      },
      { t: "rule", formula: "Có người / máy tác động ⇒ S + is / are + V3  ·  tự xảy ra ⇒ S + V(s/es)  ·  occur / take place / remain / consist of ⇒ luôn chủ động", vi: "Hỏi “có ai làm không?” cho từng ô của sơ đồ trước khi viết." },
      {
        t: "quiz", id: "t5d7-chu-bi-dich", title: "Dịch sang tiếng Anh — bị động hay chủ động? (5 câu)", kind: "translate",
        grammar: "Có người làm ⇒ is / are + V3 · tự xảy ra ⇒ V(s/es)",
        items: [
          { q: "Hạt cà phê được rang ở 200°C trong mười lăm phút.", answers: ["The coffee beans are roasted at 200°C for fifteen minutes.", "The coffee beans are roasted at 200°C for 15 minutes.", "Coffee beans are roasted at 200°C for fifteen minutes."], hint: "roast · at 200°C · for fifteen minutes" },
          { q: "Khi hỗn hợp nguội đi, nó cứng lại.", answers: ["As the mixture cools, it hardens.", "When the mixture cools, it hardens.", "As the mixture cools it hardens."], hint: "as · cool · harden — cả hai đều tự xảy ra" },
          { q: "Quá trình lên men diễn ra trong các bồn bằng thép.", answers: ["Fermentation takes place in steel tanks.", "The fermentation takes place in steel tanks.", "Fermentation occurs in steel tanks."], hint: "fermentation · take place · steel tanks" },
          { q: "Nước được loại bỏ, và chỉ còn lại muối.", answers: ["The water is removed, and only the salt remains.", "The water is removed and only the salt remains.", "The water is removed, and only salt remains.", "The water is removed and only salt remains."], hint: "remove (có người làm) · remain (tự nó)" },
          { q: "Sản phẩm cuối cùng gồm 66 % đường.", answers: ["The final product consists of 66% sugar.", "The final product consists of 66 per cent sugar.", "The final product consists of 66 percent sugar.", "The end product consists of 66% sugar."], hint: "the final product · consist of" },
        ],
      },
      {
        t: "mcq", id: "t5d7-chu-bi-chon", title: "Chọn câu ĐÚNG (6 câu)",
        items: [
          { q: "Bước: nhựa cây chảy qua ống xuống bồn chứa.", options: ["The sap is flowed through tubes to a storage tank.", "The sap flows through tubes to a storage tank.", "The sap is flowing through tubes to a storage tank."], correct: 1, why: "flow là nội động từ ⇒ không có bị động; process dùng hiện tại đơn, không dùng tiếp diễn." },
          { q: "Bước: công nhân nâng nhiệt độ lên 120°C.", options: ["The temperature is raised to 120°C.", "The temperature is risen to 120°C.", "The temperature raises to 120°C."], correct: 0, why: "raise (ngoại động từ) → is raised. rise không có bị động; raise không dùng chủ động với chủ ngữ là vật bị nâng." },
          { q: "Bước: một lớp vỏ cứng xuất hiện trên bề mặt.", options: ["A hard crust is appeared on the surface.", "A hard crust is formed by the surface.", "A hard crust appears on the surface."], correct: 2, why: "appear không bị động. “formed by the surface” sai nghĩa (bề mặt không phải tác nhân)." },
          { q: "Bước: máy nghiền hạt thành bột mịn.", options: ["The seeds grind into a fine powder.", "The seeds are ground into a fine powder.", "The seeds are grinded into a fine powder."], correct: 1, why: "Có máy làm ⇒ bị động. grind – ground – ground (bất quy tắc)." },
          { q: "Bước: giai đoạn này kéo dài khoảng ba tháng.", options: ["This stage is lasted for about three months.", "This stage lasts about three months.", "This stage is lasting about three months."], correct: 1, why: "last là nội động từ ⇒ chủ động, hiện tại đơn." },
          { q: "Bước: muối tan trong nước ấm.", options: ["The salt dissolves in the warm water.", "The salt is dissolving by the warm water.", "The salt dissolved in the warm water."], correct: 0, why: "Tự xảy ra ⇒ chủ động; quy trình lặp lại ⇒ hiện tại đơn, không dùng quá khứ." },
        ],
      },

      { t: "h", text: "3. Bị động ngoài công thức cơ bản — bốn dạng tạo ra khác biệt" },
      { t: "p", text: "Bài band 7 chỉ có **is / are + V3**. Bốn dạng dưới đây vẫn là bị động, nhưng mỗi dạng nói thêm được một thông tin: thứ tự, thời gian chờ, sự cần thiết, hoặc khả năng." },
      {
        t: "patterns", rows: [
          { formula: "S + is / are + left / allowed + to V", vi: "Bước “để yên cho tự xảy ra”: nguội, khô, lên men, lắng. Nối một bước nhân tạo với một bước tự nhiên.", examples: [
            { en: "The mixture is left to ferment for six months.", vi: "Hỗn hợp được để lên men sáu tháng." },
            { en: "The bricks are allowed to dry before being fired.", vi: "Gạch được để khô trước khi đem nung." },
          ] },
          { formula: "before / after / on / without + being + V3", vi: "Sau giới từ dùng V-ing; vật BỊ tác động ⇒ being + V3. Gộp hai bước mà không cần câu mới.", examples: [
            { en: "After being pressed, the sheets are hung up to dry.", vi: "Sau khi được ép, các tấm được treo lên cho khô." },
            { en: "The fruit is washed before being sliced.", vi: "Trái cây được rửa trước khi được thái lát." },
          ] },
          { formula: "S + has / have + been + V3  ·  Once S + has / have + been + V3,", vi: "Nhấn bước này XONG HẲN rồi mới tới bước sau.", examples: [
            { en: "Once the sap has been collected, it is taken to the sugarhouse.", vi: "Khi nhựa cây đã được thu xong, nó được đưa về nhà nấu đường." },
          ] },
          { formula: "S + must / can / may + be + V3  ·  S + needs to be + V3  ·  ready to be + V3", vi: "Điều kiện, khả năng, lựa chọn. Chỉ dùng khi sơ đồ có ghi (optional, if necessary, max. 4°C).", examples: [
            { en: "The syrup must be bottled while it is still hot.", vi: "Xi-rô phải được đóng chai khi còn nóng." },
            { en: "At this stage the paper is ready to be cut.", vi: "Tới bước này giấy đã sẵn sàng để cắt." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba lỗi ở các dạng bị động này",
        items: [
          "~~After pressed, the sheets are dried.~~ Sau **after / before** phải là **being + V3** (hoặc một mệnh đề đủ). Chỉ **once / when / if / until** mới đi thẳng với V3: Once pressed, …",
          "~~The mixture is left fermenting for six months.~~ không sai hẳn nhưng lệch nghĩa (bỏ mặc đang lên men). Dạng chuẩn của process: **is left to ferment**.",
          "Đừng đổi thì giữa bài: quy trình lặp lại ⇒ **hiện tại**. Hiện tại hoàn thành chỉ để nói “xong rồi mới…”, không thay cho hiện tại đơn ở mọi câu.",
        ],
      },
      { t: "rule", formula: "is / are left to V  ·  after / before being V3  ·  Once S has been V3,  ·  must / can be V3", vi: "Bốn dạng bị động “có thêm nghĩa” — mỗi bài process band 8 dùng 2–3 dạng, mỗi dạng một lần." },
      {
        t: "quiz", id: "t5d7-bi-dong-dich", title: "Dịch sang tiếng Anh — bị động nâng cao (4 câu)", kind: "translate",
        grammar: "is left to V · after / before being V3 · Once S has been V3 · must be V3",
        items: [
          { q: "Bột nhào được để nở trong hai giờ.", answers: ["The dough is left to rise for two hours.", "The dough is allowed to rise for two hours."], hint: "dough · be left to · rise" },
          { q: "Sau khi được rửa, chai được kiểm tra bằng tay.", answers: ["After being washed, the bottles are checked by hand.", "After being washed, the bottles are inspected by hand.", "After being washed the bottles are checked by hand."], hint: "after being + V3 · check · by hand" },
          { q: "Khi lá đã được phơi khô, chúng được cuộn bằng máy.", answers: ["Once the leaves have been dried, they are rolled by machine.", "When the leaves have been dried, they are rolled by machine.", "Once the leaves have been dried they are rolled by machine."], hint: "once + has / have been V3 · roll · by machine" },
          { q: "Sữa phải được giữ ở dưới 4°C trước khi được giao.", answers: ["The milk must be kept below 4°C before being delivered.", "The milk has to be kept below 4°C before being delivered.", "Milk must be kept below 4°C before being delivered."], hint: "must be kept · below · before being + V3" },
        ],
      },

      { t: "h", text: "4. Quyết định ② — gộp bước bằng mệnh đề rút gọn SAU danh từ" },
      { t: "p", text: "Ôn Tập 3 Ngày 17: mệnh đề quan hệ **which is / are + V3** rút thành **V3**; **which + V** (chủ động) rút thành **V-ing**. Trong process, cấu trúc này cho phép **nhắc lại bước trước bằng ba từ** thay vì viết lại cả câu." },
      {
        t: "patterns", rows: [
          { formula: "N + V3 (+ nơi / cách)  = N which is / was + V3", vi: "Danh từ đã BỊ xử lý ở bước trước. Dùng để mở câu cho bước sau.", examples: [
            { en: "The sap collected in this way contains only about 2 per cent sugar.", vi: "Nhựa cây thu được theo cách này chỉ chứa khoảng 2 % đường." },
            { en: "The pulp produced at this stage is still grey.", vi: "Bột giấy tạo ra ở bước này vẫn còn màu xám." },
          ] },
          { formula: "N + V-ing  = N which + V (chủ động)", vi: "Danh từ đang TỰ làm gì đó. Hay gặp: remaining, resulting, containing, leading to, rising.", examples: [
            { en: "The water remaining in the tank is pumped back to the start.", vi: "Nước còn lại trong bồn được bơm ngược về đầu quy trình." },
            { en: "A pipe leading to the storage tank carries the liquid downhill.", vi: "Một đường ống dẫn tới bồn chứa đưa chất lỏng xuống dốc." },
          ] },
          { formula: "N, + cụm danh từ / tính từ, + V  (mệnh đề không động từ)", vi: "Thêm thông tin phụ giữa hai dấu phẩy: = which is… Bỏ which is. Rất hợp để nêu tên gọi, trạng thái.", examples: [
            { en: "The liquid, now a deep amber colour, is passed through a filter.", vi: "Chất lỏng, lúc này đã có màu hổ phách sẫm, được cho qua bộ lọc." },
            { en: "The resulting paste, known as moromi, is left to mature.", vi: "Lớp bột nhão tạo thành, gọi là moromi, được để cho chín." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Hai lỗi band 7 hay gặp khi rút gọn sau danh từ",
        items: [
          "Nhầm V3 với V-ing: ~~the sap collecting from the trees~~ (nhựa cây không tự thu) → the sap **collected** from the trees. ~~the water remained in the tank~~ (remain không bị động) → the water **remaining** in the tank.",
          "Rút gọn rồi quên động từ chính: ~~The sap collected in buckets and taken to the sugarhouse.~~ Câu này chưa có động từ chia thì. → The sap collected in buckets **is taken** to the sugarhouse.",
        ],
      },
      { t: "rule", formula: "N + V3 (bị xử lý) · N + V-ing (tự làm) · N, now + adj / N, + V chính", vi: "Sau khi rút gọn, đếm lại: mỗi câu vẫn phải còn MỘT động từ chia thì." },

      { t: "h", text: "5. Quyết định ② (tiếp) — rút gọn ở ĐẦU và CUỐI câu" },
      { t: "p", text: "Ôn Tập 4 Ngày 5 (participle clauses). Trong process có đúng ba chỗ dùng: **đầu câu** để nói bước trước đã xong, **cuối câu** để nói kết quả của bước vừa làm, và **cuối câu với with** để nói điều xảy ra song song." },
      {
        t: "patterns", rows: [
          { formula: "Once / When / After being + V3, S + V", vi: "= Once it has been V3. Chủ ngữ ngầm của V3 PHẢI là chủ ngữ S của mệnh đề chính.", examples: [
            { en: "Once filtered, the syrup is graded by colour.", vi: "Sau khi được lọc, xi-rô được phân hạng theo màu." },
            { en: "When heated, the resin becomes soft enough to shape.", vi: "Khi được nung nóng, nhựa mềm đủ để tạo hình." },
          ] },
          { formula: "Having been + V3, S + V", vi: "Trang trọng hơn, nhấn “đã xong hẳn”. Dùng nhiều nhất MỘT lần mỗi bài.", examples: [
            { en: "Having been boiled for several hours, the sap is reduced to a fraction of its original volume.", vi: "Sau khi được đun nhiều giờ, nhựa cây cô lại chỉ còn một phần nhỏ thể tích ban đầu." },
          ] },
          { formula: "S + V, + V-ing …  (kết quả)", vi: "V-ing cuối câu = and this + V. Động từ hay dùng: leaving, producing, forming, releasing, creating, turning … into, causing … to V.", examples: [
            { en: "The water evaporates, leaving a layer of salt crystals.", vi: "Nước bốc hơi, để lại một lớp tinh thể muối." },
            { en: "The beans are crushed, releasing their oil.", vi: "Hạt được nghiền, làm dầu thoát ra." },
          ] },
          { formula: "S + V, thereby + V-ing  ·  S + V, with + N + V-ing / V3", vi: "thereby = bằng cách đó (kết quả có chủ đích). with + N + V-ing = trong khi… (việc song song).", examples: [
            { en: "The jars are sealed while hot, thereby preventing air from entering.", vi: "Hũ được đậy kín khi còn nóng, nhờ đó không khí không lọt vào." },
            { en: "The sap is boiled in an open pan, with steam escaping through a vent in the roof.", vi: "Nhựa cây được đun trong chảo hở, hơi nước thoát ra qua một lỗ thông trên mái." },
          ] },
        ],
      },
      {
        t: "note", title: "⚠️ Chủ ngữ treo — lỗi làm rớt câu band 8 xuống band 6",
        items: [
          "~~Once filtered, workers pour the syrup into bottles.~~ Ai được lọc? Theo ngữ pháp là **workers**. → Once filtered, **the syrup** is poured into bottles.",
          "~~Having been boiled, the next stage is filtering.~~ “the next stage” không được đun. → Having been boiled, **the sap** is filtered.",
          "Phép thử 3 giây: lấy chủ ngữ của mệnh đề chính, đặt trước V3 / V-ing. Đọc lên có nghĩa không? (The syrup is filtered ✓ · Workers are filtered ✗.) Ngày 9 sẽ học kỹ lỗi này (dangling modifiers).",
          "Đừng rút gọn mọi câu. **Hai câu rút gọn liền nhau** đã là nhiều; xen một câu bị động thường vào giữa.",
        ],
      },
      { t: "rule", formula: "Once + V3, S + V  ·  S + V, + V-ing (kết quả)  ·  S + V, with + N + V-ing", vi: "Ba vị trí rút gọn của process: đầu câu = bước trước đã xong; cuối câu = kết quả; with = việc song song. Chủ ngữ ngầm = chủ ngữ chính." },
      {
        t: "quiz", id: "t5d7-rut-gon-dich", title: "Dịch sang tiếng Anh — dùng cấu trúc rút gọn (5 câu)", kind: "translate",
        grammar: "N + V3 / V-ing · Once + V3, S + V · S + V, V-ing",
        items: [
          { q: "Sau khi được làm nguội, hỗn hợp được đổ vào khuôn. (Once…)", answers: ["Once cooled, the mixture is poured into moulds.", "Once cooled, the mixture is poured into molds.", "Once cooled, the mixture is poured into a mould."], hint: "Once + V3 · pour into · moulds" },
          { q: "Nước ép thu được ở bước này được lọc hai lần.", answers: ["The juice obtained at this stage is filtered twice.", "The juice collected at this stage is filtered twice.", "The juice produced at this stage is filtered twice."], hint: "the juice + V3 + at this stage · filter · twice" },
          { q: "Nước bốc hơi, để lại muối.", answers: ["The water evaporates, leaving the salt.", "The water evaporates, leaving the salt behind.", "The water evaporates, leaving salt behind.", "The water evaporates, leaving salt."], hint: "evaporate · , leaving" },
          { q: "Phần chất lỏng còn lại trong bồn được dùng lại.", answers: ["The liquid remaining in the tank is reused.", "The liquid remaining in the tank is used again.", "The liquid left in the tank is reused.", "The liquid left in the tank is used again."], hint: "the liquid + remaining · reuse" },
          { q: "Khi được nung nóng, thuỷ tinh trở nên mềm.", answers: ["When heated, the glass becomes soft.", "When heated, glass becomes soft.", "Once heated, the glass becomes soft."], hint: "When + V3 · glass · become soft" },
        ],
      },
      {
        t: "mcq", id: "t5d7-rut-gon-chon", title: "Câu nào KHÔNG có lỗi? (6 câu)",
        items: [
          { q: "Chọn câu đúng.", options: ["Once harvested, farmers take the beans to the factory.", "Once harvested, the beans are taken to the factory.", "Once harvesting, the beans are taken to the factory."], correct: 1, why: "Chủ ngữ ngầm của harvested phải là the beans. Câu A: farmers được thu hoạch ✗. Câu C: hạt không tự thu hoạch." },
          { q: "Chọn câu đúng.", options: ["The oil extracted in this way is stored in steel tanks.", "The oil extracting in this way is stored in steel tanks.", "The oil extracted in this way and stored in steel tanks."], correct: 0, why: "Dầu BỊ chiết ⇒ V3. Câu C không có động từ chia thì." },
          { q: "Chọn câu đúng.", options: ["After dried, the bricks are fired in a kiln.", "After being dried, the bricks are fired in a kiln.", "After be dried, the bricks are fired in a kiln."], correct: 1, why: "after là giới từ ⇒ being + V3. (Once dried cũng đúng, nhưng After dried thì sai.)" },
          { q: "Chọn câu đúng.", options: ["The mixture is heated, is causing the sugar to dissolve.", "The mixture is heated, caused the sugar to dissolve.", "The mixture is heated, causing the sugar to dissolve."], correct: 2, why: "Kết quả của hành động trước ⇒ , V-ing." },
          { q: "Chọn câu đúng.", options: ["Only a thin layer of salt is remained on the ground.", "Only a thin layer of salt remaining on the ground.", "Only a thin layer of salt remains on the ground."], correct: 2, why: "remain không có bị động; câu B thiếu động từ chia thì." },
          { q: "Chọn câu đúng.", options: ["The paste, known as koji, is mixed with salt water.", "The paste, knowing as koji, is mixed with salt water.", "The paste known as koji, is mixed with salt water."], correct: 0, why: "known as = which is known as. Thông tin phụ ⇒ hai dấu phẩy, đủ cả cặp." },
        ],
      },

      { t: "h", text: "6. Quyết định ③ — nối bằng gì? 12 cụm Academic Phrasebank cho Task 1" },
      { t: "p", text: "Tập 4 Ngày 6 và Ngày 21 đã giới thiệu **Academic Phrasebank**: kho cụm cố định mà người viết học thuật dùng lại, nhóm theo **việc cần làm** chứ không theo chủ đề. Hôm nay lấy riêng nhóm **mô tả trình tự**. Mỗi cụm thay được cho một chữ Then, và kéo theo một cấu trúc ngữ pháp cố định — học cả cụm lẫn cấu trúc." },
      {
        t: "vocab", items: [
          { w: "The process begins with", pos: "cụm mở đầu", ipa: "/ðə ˈprəʊses bɪˈɡɪnz wɪð/", vi: "quy trình bắt đầu bằng (+ danh từ / V-ing)", ex: "The process begins with the tapping of the trees in late winter.", exVi: "Quy trình bắt đầu bằng việc khoan cây lấy nhựa vào cuối mùa đông.", more: "Sau **with** là danh từ: the collection of… · the tapping of…. Muốn dùng mệnh đề: The process begins **when** the trees are tapped." },
          { w: "In the initial stage", pos: "cụm trạng ngữ", ipa: "/ɪn ði ɪˈnɪʃl steɪdʒ/", vi: "ở giai đoạn đầu", ex: "In the initial stage, the raw materials are sorted by hand.", exVi: "Ở giai đoạn đầu, nguyên liệu thô được phân loại bằng tay.", more: "Cùng nhóm: **In the subsequent stage** · **In the final stage**. Có **the**; stage, không dùng step cho giai đoạn lớn." },
          { w: "Following this", pos: "từ nối", ipa: "/ˈfɒləʊɪŋ ðɪs/", vi: "sau bước này", ex: "Following this, the mixture is transferred to a second tank.", exVi: "Sau bước này, hỗn hợp được chuyển sang bồn thứ hai.", more: "Đứng đầu câu, có dấu phẩy. Biến thể: **Following + N**, … (Following filtration, …)." },
          { w: "This is followed by", pos: "cụm động từ", ipa: "/ðɪs ɪz ˈfɒləʊd baɪ/", vi: "tiếp theo là (+ danh từ)", ex: "This is followed by a period of fermentation lasting six months.", exVi: "Tiếp theo là một thời kỳ lên men kéo dài sáu tháng.", more: "Sau **by** là danh từ, nên phải **danh hoá** bước đó: ferment → fermentation, filter → filtration, evaporate → evaporation." },
          { w: ", after which", pos: "mệnh đề quan hệ", ipa: "/ˈɑːftə wɪtʃ/", vi: "sau đó thì (nối hai bước trong một câu)", ex: "The sap is boiled for several hours, after which it is filtered.", exVi: "Nhựa cây được đun nhiều giờ, sau đó được lọc.", more: "Luôn có dấu phẩy trước; sau **which** là một mệnh đề đủ chủ – vị." },
          { w: ", at which point", pos: "mệnh đề quan hệ", ipa: "/ət wɪtʃ pɔɪnt/", vi: "đúng lúc đó thì (mốc chuyển giai đoạn)", ex: "The liquid reaches 104°C, at which point it is drawn off.", exVi: "Chất lỏng đạt 104°C, đúng lúc đó nó được rút ra.", more: "Dùng khi có một **ngưỡng**: nhiệt độ, nồng độ, thời gian. Đừng dùng cho hai bước bình thường." },
          { w: "Meanwhile", pos: "từ nối", ipa: "/ˈmiːnwaɪl/", vi: "trong khi đó (hai nhánh song song)", ex: "Meanwhile, the wheat is roasted and crushed.", exVi: "Trong khi đó, lúa mì được rang và nghiền.", more: "Chỉ dùng khi sơ đồ có **hai nhánh** chạy cùng lúc. Cùng nghĩa: **At the same time,** · **In a parallel step,**." },
          { w: "prior to", pos: "giới từ", ipa: "/ˈpraɪə tə/", vi: "trước khi (trang trọng hơn before)", ex: "The bottles are sterilised prior to being filled.", exVi: "Chai được tiệt trùng trước khi rót.", more: "**to** ở đây là giới từ ⇒ + danh từ / V-ing: prior to **being** filled · prior to delivery." },
          { w: "so as to", pos: "cụm chỉ mục đích", ipa: "/səʊ əz tə/", vi: "để (+ V nguyên mẫu)", ex: "The sap is filtered so as to remove any solid particles.", exVi: "Nhựa cây được lọc để loại mọi hạt rắn.", more: "Cùng nhóm: **in order to** + V · **so that** + mệnh đề · **to ensure that** + mệnh đề. Phủ định: so as **not** to + V." },
          { w: "resulting in", pos: "cụm phân từ", ipa: "/rɪˈzʌltɪŋ ɪn/", vi: "dẫn tới, cho ra (+ danh từ)", ex: "Most of the water is driven off, resulting in a much thicker liquid.", exVi: "Phần lớn nước bị đuổi đi, cho ra một chất lỏng đặc hơn nhiều.", more: "result **in** + kết quả · result **from** + nguyên nhân. Tính từ: the **resulting** liquid." },
          { w: "The process culminates in", pos: "cụm kết thúc", ipa: "/ˈkʌlmɪneɪts ɪn/", vi: "quy trình kết thúc bằng (bước cuối, quan trọng nhất)", ex: "The process culminates in the bottling of the finished syrup.", exVi: "Quy trình kết thúc bằng việc đóng chai xi-rô thành phẩm.", more: "culminate **in** + danh từ / V-ing. Mỗi bài dùng một lần, ở câu cuối." },
          { w: "The end product", pos: "cụm danh từ", ipa: "/ði end ˈprɒdʌkt/", vi: "sản phẩm cuối cùng, thành phẩm", ex: "The end product is then distributed to shops.", exVi: "Thành phẩm sau đó được phân phối tới cửa hàng.", more: "Cùng nghĩa: the finished product · the final product. Nguyên liệu đầu vào: **raw materials**." },
        ],
      },
      {
        t: "table", caption: "Mỗi cụm kéo theo một cấu trúc — sai cấu trúc là mất điểm GRA", head: ["Cụm", "Theo sau là", "Lỗi hay gặp"],
        rows: [
          ["The process begins with · This is followed by · culminates in", "**danh từ / V-ing**", "~~This is followed by the mixture is heated~~"],
          [", after which · , at which point", "**mệnh đề đủ S + V**", "~~, after which filtered~~"],
          ["Following this, · Meanwhile, · In the initial stage,", "**dấu phẩy + câu đủ**", "quên dấu phẩy"],
          ["prior to · after · before", "**danh từ / being + V3**", "~~prior to be filled~~"],
          ["so as to · in order to", "**V nguyên mẫu**", "~~so as to removing~~"],
          ["resulting in · leaving · producing", "**danh từ** (cuối câu, sau dấu phẩy)", "~~, resulted in~~"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo danh hoá bước — để dùng được “begins with / followed by / culminates in”",
        items: [
          "Đuôi **-tion / -ation**: collect → collection · filter → filtration · evaporate → evaporation · ferment → fermentation · distribute → distribution · extract → extraction.",
          "Đuôi **-ing** khi không có danh từ riêng: tap → the tapping of the trees · bottle → the bottling of the syrup · grade → the grading of the syrup. Nhớ **the … of**.",
          "Một bài 170 từ dùng **4–5 cụm** là đủ. Dùng cả 12 cụm thì bài đọc như bài tập điền từ.",
        ],
      },
      { t: "rule", formula: "begins with + N · , after which + S + V · This is followed by + N · , resulting in + N · culminates in + N", vi: "Khung nối của một bài process band 8. Xen với First / Finally cho tự nhiên — không cần bỏ hẳn từ nối đơn giản." },
      {
        t: "quiz", id: "t5d7-phrasebank-dien", title: "Điền MỘT từ để hoàn thành cụm Phrasebank (8 câu)", kind: "fill",
        items: [
          { q: "The process begins ___ the collection of waste glass.", answers: ["with"], hint: "begin + giới từ + danh từ" },
          { q: "The glass is melted in a furnace, after ___ it is poured into moulds.", answers: ["which"], hint: ", after ___ + mệnh đề" },
          { q: "This is ___ by a period of slow cooling.", answers: ["followed"], hint: "This is ___ by + danh từ" },
          { q: "The temperature reaches 1,500°C, at which ___ the sand begins to melt.", answers: ["point"], hint: ", at which ___" },
          { q: "The jars are sterilised prior ___ being filled.", answers: ["to"], hint: "prior + giới từ" },
          { q: "The leaves are rolled so ___ to release their natural oils.", answers: ["as"], hint: "so ___ to + V" },
          { q: "The water is driven off, resulting ___ a thick paste.", answers: ["in"], hint: "result + giới từ + kết quả" },
          { q: "The process culminates ___ the packaging of the finished tea.", answers: ["in"], hint: "culminate + giới từ" },
        ],
      },

      { t: "h", text: "7. Áp dụng — một sơ đồ, hai thân bài: band 7 và band 8" },
      { t: "p", text: "**Đề (tự soạn):** The diagram below shows how maple syrup is produced. Hai đoạn dưới đây cùng tả **bước 3 đến bước 8**. Đọc đoạn band 7 trước và đếm: có bao nhiêu câu? bao nhiêu chữ then / next / after that? có bước nào đáng lẽ phải chủ động?" },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How maple syrup is produced",
          note: "Quy trình tự đặt cho bài luyện (giản lược từ quy trình thật).",
          steps: [
            { label: "Maple trees tapped", note: "late winter · small hole drilled, spout inserted" },
            { label: "Sap runs out", note: "about 2% sugar · clear, like water" },
            { label: "Sap carried to sugarhouse", note: "plastic tubing · storage tank" },
            { label: "Boiled in evaporator", note: "several hours · steam leaves through roof vent" },
            { label: "Liquid thickens and darkens", note: "104°C = 66% sugar · drawn off" },
            { label: "Filtered", note: "cloth filter · gritty particles removed" },
            { label: "Graded by colour", note: "golden · amber · dark" },
            { label: "Bottled hot and sealed", note: "ready for sale · 40 litres sap → 1 litre syrup" },
          ],
        },
      },
      {
        t: "passage", title: "Thân bài band 7 (ước tính) — 89 từ",
        paras: [
          { text: "Next, the sap is carried to the sugarhouse through plastic tubing and it is stored in a tank. Then it is boiled in an evaporator for several hours. After that, the liquid is thickened and it is darkened. When the temperature is 104°C, the liquid is drawn off. Next, it is filtered through a cloth filter and the gritty particles are removed. After that, the syrup is graded by colour. Finally, it is bottled and sealed. About 40 litres of sap are needed to make one litre of syrup." },
        ],
      },
      {
        t: "passage", title: "Thân bài band 8 (ước tính) — 118 từ",
        paras: [
          { text: "The sap collected in this way is carried through plastic tubing to a storage tank in the sugarhouse. Following this, it is boiled in an evaporator for several hours, with steam escaping through a vent in the roof. As the water is driven off, the liquid gradually thickens and darkens until it reaches 104°C, at which point it contains 66 per cent sugar and is drawn off. Once filtered through cloth so as to remove any gritty particles, the syrup is graded by colour as golden, amber or dark. The process culminates in the bottling of the syrup, which is sealed while still hot. In all, some 40 litres of sap are required to produce a single litre." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Đoạn band 7", "Đoạn band 8", "Bài học"],
        rows: [
          ["Task Achievement", "Đủ bước, đủ số; không nêu được quan hệ giữa các bước", "Đủ bước; nêu được **vì sao** (so as to remove), **khi nào** (at which point), con số 40 : 1 đặt làm câu chốt", "Chú thích nhỏ trong sơ đồ thành mệnh đề mục đích / mốc"],
          ["Coherence & Cohesion", "Next · Then · After that ×2 · Next · Finally — máy móc", "The sap collected in this way (móc nối đoạn trước) · Following this · at which point · Once filtered · culminates in", "Nối bằng **ngữ pháp**, không chỉ bằng từ nối"],
          ["Lexical Resource", "is 104°C · make", "driven off · gradually · gritty particles · are required to produce", "Động từ chính xác thay cho be / make"],
          ["Grammar", "9 câu, toàn bị động đơn; ~~is thickened and it is darkened~~ (bước tự xảy ra)", "6 câu; chủ động cho thickens / darkens; 5 kiểu rút gọn, mỗi kiểu một lần; 0 lỗi", "Chọn chủ động / bị động theo nghĩa; không lặp cùng một kiểu rút gọn"],
        ],
      },
      {
        t: "quiz", id: "t5d7-ap-dung", title: "Viết lại bước 1–2 của sơ đồ — điền MỘT từ mỗi chỗ (6 câu)", kind: "fill",
        items: [
          { q: "The process ___ with the tapping of the maple trees in late winter.", answers: ["begins", "starts"], hint: "động từ mở quy trình" },
          { q: "A small hole is drilled in each trunk and a spout is ___ .", answers: ["inserted"], hint: "V3 của insert" },
          { q: "The sap is a clear liquid ___ only about 2 per cent sugar. (which contains → ?)", answers: ["containing"], hint: "rút gọn: which contains → ?" },
          { q: "The sap then ___ out of the tree. (run — bị động hay chủ động?)", answers: ["runs"], hint: "tự chảy ⇒ chủ động" },
          { q: "Overall, the process ___ of eight stages, from tapping to bottling.", answers: ["consists"], hint: "consist of — chủ động" },
          { q: "Water is removed at the boiling stage, ___ a liquid that is two-thirds sugar.", answers: ["leaving", "producing"], hint: ", V-ing chỉ kết quả" },
        ],
      },

      { t: "h", text: "8. Cùng bộ công cụ cho MAP — chuẩn bị Đề 9" },
      { t: "p", text: "Task 1 của **Đề 9** (Ngày 8) là hai bản đồ: một mốc quá khứ, một mốc hiện nay. Bản đồ cũng là chuỗi “việc đã được làm” nên dùng lại đúng những gì vừa học, chỉ đổi **thì**. Ví dụ dưới đây về một khuôn viên trường hư cấu, không liên quan đề." },
      {
        t: "table", head: ["Việc cần nói", "Cấu trúc", "Ví dụ"],
        rows: [
          ["Thay đổi kéo tới hiện tại", "has / have + been + V3", "The old gym **has been converted** into a library."],
          ["Tình trạng ở mốc quá khứ", "was / were + V3 · stood · lay", "In 2000, the western half **was occupied** by playing fields."],
          ["Nhắc cái cũ bằng mệnh đề rút gọn", "N + that once + V-ed · the former + N", "The fields **that once covered** the west have made way for student housing."],
          ["Nêu công năng mới giữa hai dấu phẩy", "N, now + cụm danh từ,", "The car park, **now a paved square**, is closed to vehicles."],
          ["Kết quả của một thay đổi", ", V-ing · , with + N + V-ing", "The road has been rerouted, **leaving** the centre free of traffic."],
          ["Cái không đổi", "remain + adj · be retained", "Only the main hall **remains** unchanged."],
        ],
      },
      {
        t: "note", title: "⚠️ Bản đồ: ba chỗ người Việt hay sai",
        items: [
          "Mốc là **today / now** ⇒ **hiện tại hoàn thành** (has been built). Mốc là **2020** (đã qua) ⇒ **quá khứ đơn** (was built). Không trộn trong cùng một cặp bản đồ.",
          "~~The trees have been disappeared.~~ disappear là nội động từ → The trees **have disappeared** / **have been cut down**.",
          "~~A new hotel has been appeared / has been located~~ → A new hotel **has been built** / **now stands** in the north-east.",
        ],
      },
      { t: "rule", formula: "has / have been + V3 (mốc: nay) · was / were + V3 (mốc: năm đã qua) · N, now + N, · N that once + V-ed", vi: "Map = process đổi thì. Ngày 18 học trọn map band 8 có mốc tương lai." },
      {
        t: "quiz", id: "t5d7-map-dich", title: "Dịch sang tiếng Anh — câu cho bản đồ (4 câu)", kind: "translate",
        grammar: "has been + V3 · N, now + N, · N that once + V-ed · remain",
        items: [
          { q: "Nhà máy cũ đã được chuyển thành một trung tâm nghệ thuật.", answers: ["The old factory has been converted into an arts centre.", "The old factory has been turned into an arts centre.", "The old factory has been converted into an art centre.", "The old factory has been converted into an arts center."], hint: "convert into · an arts centre" },
          { q: "Bãi đỗ xe, nay là một công viên nhỏ, nằm cạnh sông.", answers: ["The car park, now a small park, lies beside the river.", "The car park, now a small park, is beside the river.", "The car park, now a small park, stands beside the river.", "The car park, now a small park, lies next to the river."], hint: "N, now + N, · lie beside" },
          { q: "Những cánh đồng từng bao quanh ngôi làng đã được thay bằng nhà ở.", answers: ["The fields that once surrounded the village have been replaced by housing.", "The fields that once surrounded the village have been replaced with housing.", "The fields which once surrounded the village have been replaced by housing.", "The fields that once surrounded the village have been replaced by houses."], hint: "that once + V-ed · replace by · housing" },
          { q: "Chỉ có nhà thờ là còn nguyên không đổi.", answers: ["Only the church remains unchanged.", "Only the church has remained unchanged."], hint: "remain + unchanged" },
        ],
      },
      {
        t: "note", title: "📌 Mang gì sang các bài sau",
        items: [
          "**Ngày 8 — Đề 9 Task 1:** trước khi viết, đánh dấu mỗi thay đổi là “bị làm” (bị động) hay “tự còn lại / biến mất” (chủ động); dùng ít nhất một câu **N, now + N,**.",
          "**Ngày 9:** chủ ngữ treo và cấu trúc song song — phần mở rộng của mục 5.",
          "**Ngày 12:** process band 8 hai giai đoạn + “describe how something works” — viết trọn bài với bộ công cụ hôm nay.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d7-doc",
    kind: "reading",
    title: "Đọc: Short answer + Sentence completion ở Passage 3 — chép đúng từ, khớp đúng ngữ pháp",
    goal: "Làm đúng 12–13/13 câu Short answer và Sentence completion của một Passage 3 gần 1.000 từ trong 20 phút: đổi câu hỏi thành “loại từ cần tìm”, dò theo thứ tự bài, nhận ra paraphrase mức 3–4 và chép nguyên văn không vượt giới hạn số từ.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy band nào",
        items: [
          "Đẩy **Reading từ 33 lên 35+ / 40**: hai dạng điền từ này được coi là “dễ”, nên ở band 8 mỗi câu sai là **mất điểm oan** — sai vì chép thừa từ, sai số ít / số nhiều, hoặc lấy nhầm từ đứng cạnh đáp án.",
          "**Short answer** (trả lời ngắn câu hỏi Wh-) và **Sentence completion** (hoàn thành câu) — cả hai đều lấy từ **nguyên văn trong bài** và đi **theo thứ tự bài**.",
          "Ở Passage 3, câu hỏi không lặp lại từ của bài: nó **đổi cấu trúc** (chủ động ↔ bị động, động từ ↔ danh từ) hoặc hỏi một **ý ẩn**. Việc của bạn là tìm đúng câu trong bài, rồi mới tìm từ.",
          "Bài đọc hôm nay ~980 từ về **hiệu ứng Flynn** (điểm IQ tăng suốt thế kỷ 20) — thể loại tâm lý học lập luận, 13 câu, 20 phút.",
          "Nối lại: Tập 2 Ngày 8 và Tập 3 Ngày 7 · 15 (Short answer cơ bản), Tập 5 Ngày 1 (đọc một lần 900 từ / 15 phút).",
        ],
      },

      { t: "h", text: "1. Hai dạng “dễ” — vì sao band 7 vẫn mất 1–2 câu" },
      {
        t: "table", head: ["", "Tập 2–3 (band 5–6)", "Passage 3 band 8 (hôm nay)"],
        rows: [
          ["Từ khoá của câu hỏi", "Xuất hiện gần nguyên trong bài", "Bị đổi hẳn: every ten years ↔ per decade · bring together ↔ assemble"],
          ["Đáp án", "Danh từ cụ thể, số, tên", "Có cả **danh từ trừu tượng, tính từ** (evidence, uneven)"],
          ["Nhiễu", "Hiếm", "Cùng đoạn có **hai con số / hai danh từ** hợp loại từ; chỉ một cái khớp nghĩa"],
          ["Ngữ pháp câu hỏi", "Giống câu trong bài", "Đảo lại: bài viết chủ động, câu hỏi viết bị động — từ đúng nhưng **dạng từ** phải kiểm"],
          ["Thời gian", "1,5–2 phút / câu", "≈ 1,5 phút / câu, **gồm cả** thời gian đọc bài"],
        ],
      },
      {
        t: "note", title: "⚠️ Bốn kiểu mất điểm oan — người Việt hay dính",
        items: [
          "**Thừa từ.** Đề ghi NO MORE THAN TWO WORDS mà viết “the technical manuals” (3 từ) ⇒ sai, dù đúng ý. Mạo từ cũng tính là một từ.",
          "**Tự đổi dạng từ.** Bài viết “brothers”, bạn viết “brother” ⇒ sai. Hai dạng này chỉ được **chép**, không được sửa.",
          "**Lấy từ đứng gần.** Thấy đúng câu rồi vội lấy danh từ đầu tiên. Luôn đọc lại câu hỏi cùng đáp án xem có **trả lời đúng điều được hỏi** không.",
          "**Viết ý của mình.** Short answer không hỏi ý kiến và không cho điểm từ đồng nghĩa: “IQ books” thay cho “technical manuals” là sai.",
        ],
      },

      { t: "h", text: "2. Short answer — đổi câu hỏi thành “loại đáp án”" },
      { t: "p", text: "Mỗi từ hỏi báo trước **loại** đáp án. Làm việc này trong 3 giây trước khi quay lại bài: bạn sẽ biết mình đang tìm một con số, một nhóm người hay một danh từ trừu tượng." },
      {
        t: "table", head: ["Câu hỏi bắt đầu bằng", "Đáp án là", "Ví dụ"],
        rows: [
          ["Who / Which group / Which family members", "người, nhóm người (thường số nhiều)", "brothers · farmers"],
          ["How many / By how much / In how many", "**số** (viết số hay chữ đều được)", "fourteen = 14"],
          ["What kind of / What type of", "tính từ + danh từ, hoặc danh từ ghép", "office work"],
          ["Which measurement / What characteristic", "danh từ trừu tượng, không mạo từ", "height"],
          ["What was X doing / reading / using", "danh từ chỉ vật", "technical manuals"],
          ["When / In which year / decade", "năm, thập kỷ", "1984 · the 1990s"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Short answer + Sentence completion — 5 bước cho mỗi câu",
        steps: [
          { label: "Đọc giới hạn từ", sub: "ONE WORD · TWO WORDS AND/OR A NUMBER — khoanh lại" },
          { label: "Đoán loại đáp án", sub: "từ hỏi (short answer) · từ đứng trước / sau chỗ trống (sentence)" },
          { label: "Chọn 1 từ neo", sub: "tên riêng, năm, thuật ngữ — thứ khó bị paraphrase" },
          { label: "Tìm CÂU, rồi mới tìm TỪ", sub: "đáp án nằm sau câu trả lời trước — không quay ngược" },
          { label: "Thử lại", sub: "đặt từ vào câu hỏi: đúng nghĩa? đúng ngữ pháp? đúng số từ?" },
        ],
      },
      { t: "rule", formula: "Wh- ⇒ loại đáp án · tìm câu theo thứ tự · chép nguyên văn ≤ giới hạn từ", vi: "Short answer: không viết câu, không thêm mạo từ nếu không cần, không đổi dạng từ." },

      { t: "h", text: "3. Sentence completion — chỗ trống phải khớp ngữ pháp" },
      { t: "p", text: "Câu hoàn thành là **một câu paraphrase** của một câu trong bài, khoét đi một từ. Vì vậy có hai phép kiểm: **nghĩa** (đúng điều bài nói) và **ngữ pháp** (câu sau khi điền phải đọc được). Phép kiểm thứ hai loại được khoảng một nửa số phương án nhiễu." },
      {
        t: "table", head: ["Dấu quanh chỗ trống", "Suy ra", "Ví dụ"],
        rows: [
          ["a ______ that…", "danh từ đếm được **số ít**, bắt đầu bằng phụ âm", "a **yardstick** that…"],
          ["so much ______", "danh từ **không đếm được**", "so much **evidence**"],
          ["was so ______ .", "**tính từ**", "was so **uneven**"],
          ["______ cannot have been…", "danh từ làm chủ ngữ; động từ không chia số ⇒ số ít hay nhiều đều được ⇒ kiểm theo **nghĩa**", "**genes** cannot have been…"],
          ["require ______ in everyday life", "danh từ không đếm được hoặc số nhiều (không có a / an)", "require **help**"],
          ["the cause … is ______ .", "tính từ hoặc danh từ ⇒ kiểm theo bài", "is **environmental**"],
        ],
      },
      {
        t: "table", caption: "Thang paraphrase (ôn Tập 3 Ngày 1) — Passage 3 dùng mức 3 và 4", head: ["Mức", "Cách đổi", "Bài viết", "Câu hỏi viết"],
        rows: [
          ["1", "đồng nghĩa", "roughly three per decade", "about three every ten years"],
          ["2", "đổi loại từ", "scores had climbed", "the increase in scores"],
          ["3", "đổi cấu trúc", "Genes could be ruled out", "______ cannot have been responsible"],
          ["4", "ý ẩn / gộp hai câu", "Brothers share parents. Whatever is pulling the scores down must therefore be…", "The finding within families indicates that the cause is ______"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo: khi hai từ trong cùng câu đều hợp ngữ pháp",
        items: [
          "Đọc **cả mệnh đề** chứa mỗi từ trong bài rồi hỏi: câu hỏi đang paraphrase mệnh đề nào?",
          "Từ nằm trong mệnh đề **phủ định / bị gạt đi** (not… · rather than… · it disposes of the suggestion that…) thường là nhiễu.",
          "Nếu vẫn phân vân, chọn từ làm câu hoàn thành **nói đúng điều bài khẳng định**, không phải điều bài nhắc tới.",
        ],
      },
      { t: "rule", formula: "Chỗ trống = loại từ + số ít / nhiều (ngữ pháp) → câu trong bài (nghĩa) → chép 1 từ", vi: "Sentence completion: điền xong đọc lại cả câu; câu phải đúng ngữ pháp VÀ đúng với bài." },

      { t: "h", text: "4. Khởi động — một đoạn ngắn, bốn câu, 4 phút" },
      { t: "p", text: "Đoạn dưới đây tự soạn; thư viện và con số là **hư cấu**. — **The Marlow reading room.** When the university library at Marlow reopened after its refit, the librarians had quietly removed two-thirds of the desktop computers from the main reading room. They had expected complaints. What they received instead was a rise in visits, most noticeable among first-year students, who said that a room without screens made it easier to settle to an hour of unbroken reading. Loans of printed books, which had been falling for a decade, went up by a fifth in the first term. The one group that objected were postgraduates in the sciences, whose journals had long since ceased to exist on paper." },
      {
        t: "quiz", id: "t5d7-doc-khoi-dong", title: "Khởi động — câu 1–2: NO MORE THAN TWO WORDS · câu 3–4: ONE WORD ONLY", kind: "fill",
        items: [
          { q: "1. What did the librarians take out of the main reading room?", answers: ["desktop computers", "computers"], hint: "What ⇒ danh từ chỉ vật; bài: removed two-thirds of the…" },
          { q: "2. Which students visited the room noticeably more often?", answers: ["first-year students", "first-year"], hint: "Which students ⇒ một nhóm người; bài: most noticeable among…" },
          { q: "3. The librarians had assumed that the change would lead to ______ .", answers: ["complaints"], hint: "expected ↔ had assumed… would lead to; danh từ số nhiều" },
          { q: "4. Science postgraduates disliked the change because their ______ were no longer printed.", answers: ["journals"], hint: "ceased to exist on paper ↔ were no longer printed" },
        ],
      },

      { t: "h", text: "5. Bài đọc chính — 20 phút, Questions 1–13" },
      { t: "p", text: "Bài đọc soạn riêng cho khoá, khoảng **980 từ**, **8 đoạn A–H**. Các dữ kiện (năm, con số, tên người) là thật; lời văn tự viết. Làm như thi: **đọc câu hỏi 1–13 trong 1 phút**, đọc bài **một lần** và trả lời khi gặp, không tra từ." },
      {
        t: "passage", title: "The Rising Curve",
        intro: "Why did scores on intelligence tests climb for most of a century — and what, exactly, was rising?",
        paras: [
          { label: "A", text: "In the early 1980s James Flynn, a political scientist at the University of Otago in New Zealand, was reading through the technical manuals that publishers issue with intelligence tests when he noticed something the testing industry had been hiding in plain sight. Every couple of decades a test is “re-normed”: a fresh sample of the population sits it, and the scoring is reset so that the typical result is once again 100. The manuals showed that whenever a group of people took an outgoing version of a test alongside its replacement, they did better on the older one. The implication was awkward. If the yardstick had to be shortened in every generation simply to keep the middle of the scale where it was, then each generation must have been outscoring the one before." },
          { label: "B", text: "In a paper published in 1984 he put a figure on the trend. Between 1932 and 1978 Americans had gained almost fourteen points, or roughly three per decade. Three years later he showed that the same pattern held in fourteen industrialised nations, from Japan to the Netherlands. He was not the first to glimpse it: as early as 1948 an American psychologist had reported that soldiers drafted in the Second World War comfortably outscored those of the First, and Flynn never claimed otherwise. It was other writers, in the 1990s, who attached his name to the phenomenon. What he had done was to assemble the evidence on a scale that made it impossible to dismiss." },
          { label: "C", text: "Taken at face value, the numbers are absurd. Scored against the norms of a century later, a person of average ability in 1900 would have an IQ somewhere between 50 and 70 — a range in which someone today would be judged to need help with the ordinary business of living. Yet the men and women of 1900 ran farms, kept accounts and raised families perfectly competently. The puzzle, then, was not only why scores had climbed but what sort of thing could climb so fast without anybody noticing the difference in daily life. Genes could be ruled out at once: a population’s genetic make-up does not shift appreciably in three or four generations." },
          { label: "D", text: "A clue lay in where the gains were concentrated. An IQ test is really a bundle of smaller tests, and these had not risen together. Scores on vocabulary, arithmetic and general knowledge had barely moved. The dramatic rises came on tasks such as Raven’s Progressive Matrices, in which the candidate must work out which shape completes a pattern, and on “similarities” items, which ask what two things have in common. There is an irony here. Tests of this kind were designed to capture pure reasoning, untouched by anything a child might pick up in the classroom, and for that reason were long described as “culture-free”. They turned out to be the most sensitive of all to the passing of time." },
          { label: "E", text: "Several explanations compete. The British psychologist Richard Lynn pointed to nutrition, noting that the rise in scores had been accompanied by a comparable increase in height over the same period; better-fed children, he argued, grow larger brains as well as longer legs. Others have credited schooling, which now lasts far longer and relies less on memorising; smaller families, in which each child receives a larger share of adult attention; and a growing familiarity with timed tests. Each of these may account for part of the rise. None comfortably explains why it was so uneven, since a better diet ought to lift every ability at once." },
          { label: "F", text: "Flynn’s own answer drew on interviews that the Soviet psychologist Alexander Luria conducted in the 1930s with unschooled farmers in Central Asia, who consistently reasoned from practical experience and declined to play with categories or hypothetical cases. His favourite illustration was a question of the kind the “similarities” items contain: what do a dog and a rabbit have in common? The answer the test rewards is that both are mammals. A person raised in an earlier world, Flynn suggested, would be more likely to reply that you use a dog to hunt rabbits — and would regard this as the more intelligent answer, since it is the one that matters. Over the twentieth century, he argued, people learned to wear “scientific spectacles”: to sort the world into abstract classes and to take the hypothetical seriously, habits demanded first by longer schooling and then by office work. On this view the tests were not recording a growth in raw brainpower at all, but a change in the kind of thinking people practised every day." },
          { label: "G", text: "The story has since acquired a twist. In Norway and Denmark, where almost all young men used to be tested on entering military service, scores levelled off in the 1990s and then began to fall. In 2018 two researchers in Oslo analysed more than 730,000 of these results and found that the decline appears inside families: younger brothers now tend to score lower than their older brothers did. This matters because it disposes of the suggestion that the fall merely reflects a change in who is having children or who is arriving in the country. Brothers share parents. Whatever is pulling the scores down must therefore be environmental — something in the way children are now taught, entertained or occupied — just as whatever pushed them up was." },
          { label: "H", text: "What, in the end, does the rising curve tell us? Not, Flynn insisted, that our great-grandparents were dull, nor that we are geniuses. An IQ score is not a fixed quantity like weight; it places a person relative to others who have grown up facing the same mental demands. Used to rank people within one generation, it does roughly what it promises. Used to compare one generation with another, it mostly measures how far the demands themselves have changed. The curve rose, in other words, because the twentieth century kept setting a new kind of problem, and people — sensibly enough — got better at the problems they were set." },
        ],
      },
      { t: "p", text: "**Questions 1–6.** Answer the questions below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "quiz", id: "t5d7-doc-tra-loi-ngan", title: "Questions 1–6 — Short answer (NO MORE THAN TWO WORDS AND/OR A NUMBER)", kind: "fill",
        items: [
          { q: "1. What was Flynn reading when he first noticed the trend?", answers: ["technical manuals", "manuals"], hint: "Đoạn A — danh từ chỉ vật; không chép “the” (thành 3 từ)." },
          { q: "2. By roughly how many points did American scores rise every ten years?", answers: ["three", "3"], hint: "Đoạn B — every ten years ↔ per decade." },
          { q: "3. In how many countries did Flynn’s second study find the same trend?", answers: ["fourteen", "14"], hint: "Đoạn B — countries ↔ nations; cẩn thận hai chữ fourteen." },
          { q: "4. Which physical measurement did Lynn say had risen together with test scores?", answers: ["height"], hint: "Đoạn E — accompanied by ↔ risen together with." },
          { q: "5. Besides longer schooling, what required people to adopt abstract habits of thought?", answers: ["office work"], hint: "Đoạn F — habits demanded first by… and then by…" },
          { q: "6. Which family members did the 2018 study compare?", answers: ["brothers"], hint: "Đoạn G — chép đúng số nhiều." },
        ],
      },
      { t: "p", text: "**Questions 7–13.** Complete the sentences below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "quiz", id: "t5d7-doc-hoan-thanh", title: "Questions 7–13 — Sentence completion (ONE WORD ONLY)", kind: "fill",
        items: [
          { q: "7. The writer likens an intelligence test to a ______ that has repeatedly had to be made shorter.", answers: ["yardstick"], hint: "Đoạn A — a + danh từ số ít." },
          { q: "8. Flynn’s achievement was to bring together so much ______ that the trend could no longer be ignored.", answers: ["evidence"], hint: "Đoạn B — bring together ↔ assemble; ignored ↔ dismiss." },
          { q: "9. By today’s standards, an average adult of 1900 would seem to require ______ in everyday life.", answers: ["help"], hint: "Đoạn C — require ↔ need." },
          { q: "10. The speed of the increase means that ______ cannot have been responsible for it.", answers: ["genes"], hint: "Đoạn C — ruled out ↔ cannot have been responsible." },
          { q: "11. Raven’s Progressive Matrices was intended to measure ______ that owed nothing to schooling.", answers: ["reasoning"], hint: "Đoạn D — designed to capture ↔ intended to measure." },
          { q: "12. The nutrition theory struggles to explain why the increase in scores was so ______ .", answers: ["uneven"], hint: "Đoạn E — so + tính từ." },
          { q: "13. The finding within families indicates that the cause of the recent fall is ______ .", answers: ["environmental"], hint: "Đoạn G — ý gộp từ hai câu." },
        ],
      },

      { t: "h", text: "6. Mổ lại — đáp án nằm ở đâu, bẫy ở đâu" },
      {
        t: "table", head: ["Câu", "Đáp án", "Chữ trong bài", "Mức paraphrase · bẫy"],
        rows: [
          ["1", "technical manuals", "“reading through the technical manuals that publishers issue”", "Mức 1. Bẫy **số từ**: chép cả “the” là 3 từ. “intelligence tests” hợp loại từ nhưng trả lời câu khác (ông đọc sách hướng dẫn, không đọc bài test)."],
          ["2", "three / 3", "“roughly three per decade”", "Mức 1: every ten years = per decade. Bẫy: **fourteen** (tổng mức tăng 46 năm) đứng ngay trước."],
          ["3", "fourteen / 14", "“the same pattern held in fourteen industrialised nations”", "Mức 1: countries = nations. Hai chữ fourteen cùng đoạn — phải đọc danh từ đi sau: points hay nations."],
          ["4", "height", "“accompanied by a comparable increase in height”", "Mức 2. “nutrition” là **lời giải thích** của Lynn, không phải thứ đo được tăng lên; “brains / legs” là hệ quả ông suy ra."],
          ["5", "office work", "“habits demanded first by longer schooling and then by office work”", "Mức 3: bị động rút gọn (demanded by) ↔ câu hỏi chủ động (what required…). “Besides longer schooling” loại sẵn schooling."],
          ["6", "brothers", "“younger brothers now tend to score lower than their older brothers did”", "Mức 1. Bẫy **dạng từ**: viết brother là sai. “families” trả lời ở đâu, không trả lời ai."],
          ["7", "yardstick", "“If the yardstick had to be shortened in every generation”", "Mức 3: shortened ↔ made shorter; ẩn dụ không báo trước bằng like / as."],
          ["8", "evidence", "“assemble the evidence on a scale that made it impossible to dismiss”", "Mức 3. so much ⇒ không đếm được ⇒ loại figure, pattern."],
          ["9", "help", "“would be judged to need help with the ordinary business of living”", "Mức 2: the ordinary business of living ↔ everyday life."],
          ["10", "genes", "“Genes could be ruled out at once”", "Mức 3. Bẫy: nutrition, schooling cũng là “nguyên nhân” nhưng ở đoạn sau và không bị loại vì tốc độ."],
          ["11", "reasoning", "“designed to capture pure reasoning, untouched by anything a child might pick up in the classroom”", "Mức 3–4: untouched by… the classroom ↔ owed nothing to schooling. Bẫy: culture (từ “culture-free” ngay sau)."],
          ["12", "uneven", "“None comfortably explains why it was so uneven”", "Mức 2. Câu trong bài nói về MỌI giả thuyết; câu hỏi chỉ lấy giả thuyết dinh dưỡng (câu kế: a better diet ought to lift every ability)."],
          ["13", "environmental", "“Brothers share parents. Whatever is pulling the scores down must therefore be environmental”", "Mức 4: gộp phát hiện (đoạn G câu 3) với kết luận (câu 6). Bẫy: genetic không có trong đoạn; inside là giới từ."],
        ],
      },
      {
        t: "table", head: ["Đúng / 13", "Mức ước tính cho hai dạng này", "Việc cần làm"],
        rows: [
          ["12–13", "band 8+", "Giữ nhịp: lần sau làm trong 18 phút."],
          ["10–11", "band 7–7.5", "Xem cột 4: sai vì số từ / dạng từ hay vì paraphrase? Ghi vào Sổ lỗi theo loại."],
          ["≤ 9", "dưới band 7", "Ôn Tập 3 Ngày 7 · 15, rồi làm lại bài này sau 3 ngày."],
        ],
      },
      {
        t: "note", title: "💡 Ba điều rút ra cho lần sau",
        items: [
          "Trong 13 câu, **không câu nào** lặp lại động từ của bài. Tìm bằng **từ neo** (Lynn, 2018, Raven’s) chứ không bằng động từ.",
          "Bốn câu có nhiễu **cùng loại từ trong cùng đoạn** (2, 3, 4, 11). Đây là kiểu bẫy chính của hai dạng này ở Passage 3.",
          "Đáp án là từ **của bài**. Nếu bạn phải đổi dạng từ mới điền vừa, bạn đang ở sai câu.",
        ],
      },

      { t: "h", text: "7. Ngữ pháp bài 1 trong bài đọc" },
      { t: "p", text: "Bài đọc có nhiều cấu trúc rút gọn của bài 1. Sáu câu dưới đây lấy từ bài — điền **dạng đúng của động từ trong ngoặc** mà không nhìn lại." },
      {
        t: "quiz", id: "t5d7-doc-ngu-phap", title: "Điền dạng đúng của động từ trong ngoặc (6 câu)", kind: "fill",
        items: [
          { q: "___ (take) at face value, the numbers are absurd.", answers: ["Taken", "taken"], hint: "Con số BỊ hiểu theo nghĩa đen ⇒ V3 đầu câu." },
          { q: "___ (score) against the norms of a century later, a person of average ability in 1900 would have an IQ between 50 and 70.", answers: ["Scored", "scored"], hint: "Người đó BỊ chấm ⇒ V3." },
          { q: "Soldiers ___ (draft) in the Second World War outscored those of the First.", answers: ["drafted"], hint: "= who were drafted." },
          { q: "A person ___ (raise) in an earlier world would give a different answer.", answers: ["raised"], hint: "= who was raised; raise (nuôi lớn) ≠ rise." },
          { q: "Tests of this kind were designed to capture pure reasoning, ___ (untouch) by the classroom.", answers: ["untouched"], hint: "Tính từ dạng V3 sau dấu phẩy." },
          { q: "___ (use) to rank people within one generation, an IQ score does roughly what it promises.", answers: ["Used", "used"], hint: "Chủ ngữ ngầm = an IQ score; nó ĐƯỢC dùng." },
        ],
      },

      { t: "h", text: "8. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab", items: [
          { w: "yardstick", pos: "n", ipa: "/ˈjɑːdstɪk/", vi: "thước đo, chuẩn để so sánh", ex: "Exam results are a poor yardstick of a school’s quality.", exVi: "Kết quả thi là một thước đo kém cho chất lượng của trường.", more: "a yardstick **of / for** sth · measure sth against a yardstick. Hợp Task 2 khi bàn “đo thành công bằng gì”." },
          { w: "outscore", pos: "v", ipa: "/ˌaʊtˈskɔː/", vi: "đạt điểm cao hơn", ex: "Girls now outscore boys in most reading tests.", exVi: "Nay nữ sinh đạt điểm cao hơn nam sinh ở đa số bài kiểm tra đọc.", more: "Tiền tố **out-** + V = làm hơn: outperform · outnumber · outlive · outweigh." },
          { w: "in plain sight", pos: "phrase", ipa: "/ɪn pleɪn saɪt/", vi: "ngay trước mắt (mà không ai để ý)", ex: "The answer had been in plain sight all along, in the company's own figures.", exVi: "Câu trả lời đã nằm ngay trước mắt từ đầu, trong chính số liệu của công ty.", more: "hide in plain sight · trong bài: hiding in plain sight (đoạn A)" },
          { w: "glimpse", pos: "v / n", ipa: "/ɡlɪmps/", vi: "thoáng thấy; cái nhìn thoáng qua", ex: "Earlier researchers had glimpsed the pattern but never measured it.", exVi: "Các nhà nghiên cứu trước đó đã thoáng thấy quy luật nhưng chưa từng đo nó.", more: "catch a glimpse of · a glimpse into (a world) · trong bài: He was not the first to glimpse it (đoạn B)" },
          { w: "appreciably", pos: "adv", ipa: "/əˈpriːʃəbli/", vi: "một cách đáng kể, đủ để nhận thấy", ex: "Prices have not changed appreciably since last year.", exVi: "Giá không đổi đáng kể từ năm ngoái.", more: "Tính từ: an **appreciable** difference. Dùng trong Task 1 thay significantly khi mức thay đổi vừa phải." },
          { w: "make-up", pos: "n", ipa: "/ˈmeɪk ʌp/", vi: "thành phần, cấu tạo (của một nhóm, một chất)", ex: "The make-up of the committee has changed: half its members are now under forty.", exVi: "Thành phần uỷ ban đã đổi: một nửa thành viên giờ dưới bốn mươi tuổi.", more: "genetic / social / ethnic make-up · trong bài: a population's genetic make-up (đoạn C) · ⚠️ khác make-up = đồ trang điểm" },
          { w: "irony", pos: "n", ipa: "/ˈaɪrəni/", vi: "sự trớ trêu", ex: "The irony is that the safest drivers pay the highest insurance in some cities.", exVi: "Trớ trêu là ở vài thành phố, người lái an toàn nhất lại trả phí bảo hiểm cao nhất.", more: "There is an irony here (đoạn D) · ironically (adv) · ⚠️ irony không đồng nghĩa sarcasm (nói mỉa)" },
          { w: "hypothetical", pos: "adj / n", ipa: "/ˌhaɪpəˈθetɪkl/", vi: "giả định, không có thật", ex: "Examiners sometimes ask about a hypothetical situation.", exVi: "Giám khảo đôi khi hỏi về một tình huống giả định.", more: "a hypothetical question / case. Danh từ gốc: hypothesis (số nhiều hypotheses). Trọng âm rơi vào **-thet-**." },
          { w: "twist", pos: "n", ipa: "/twɪst/", vi: "bước ngoặt bất ngờ (của câu chuyện, sự việc)", ex: "In a strange twist, the scheme ended up costing more than it saved.", exVi: "Trớ trêu thay, chương trình rốt cuộc tốn nhiều hơn số tiền nó tiết kiệm.", more: "a twist in the tale · take an unexpected twist · trong bài: The story has since acquired a twist (đoạn G)" },
          { w: "dispose of", pos: "phr v", ipa: "/dɪˈspəʊz ɒv/", vi: "bác bỏ dứt điểm (một lập luận); vứt bỏ", ex: "This evidence disposes of the idea that the change was genetic.", exVi: "Bằng chứng này bác bỏ dứt điểm ý cho rằng thay đổi là do di truyền.", more: "Nghĩa quen hơn: dispose of waste (vứt rác). Nghĩa lập luận trang trọng — hợp bài phản biện." },
        ],
      },
      {
        t: "note", title: "📌 Sau bài này",
        items: [
          "Ghi vào **Sổ lỗi** mỗi câu sai kèm loại: số từ · dạng từ · lấy từ gần · paraphrase.",
          "**Đề 9** (Ngày 8, phần Reading làm ở Online Test) có dạng Sentence completion — áp đúng 5 bước của mục 2; Short answer sẽ gặp lại ở các đề sau và ở phần Listening.",
          "Đọc lại đoạn F và G thành tiếng một lần: hai đoạn có 6 cấu trúc rút gọn của bài 1.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d7-noi",
    kind: "speaking",
    title: "Nói Part 2 band 8: tả người / nơi bằng chi tiết cảm quan — và giọng kể",
    goal: "Nói trọn 2 phút Part 2 về một người hoặc một nơi ở mức band 8: thay tính từ chung chung bằng 4–5 chi tiết nghe – nhìn – ngửi – chạm, đi theo khung “một cảnh → một chuyện → một nhận xét”, và đổi nhịp giọng khi kể (chậm lại, ngừng trước chi tiết đắt, hạ giọng ở lời bình).",
    minutes: 75,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Lexical Resource + Fluency & Coherence của Speaking từ 7 lên 8**: band 8 “dùng từ ít gặp một cách khéo léo” và “phát triển chủ đề mạch lạc, phù hợp” — trong Part 2, cách dễ nhất để có cả hai là **tả cho người nghe thấy được**.",
          "**Chi tiết cảm quan** = thứ người nghe có thể nhìn, nghe, ngửi, chạm. “He is very skilful” là nhận xét; “he found the thorn with his eyes half closed” là chi tiết.",
          "Khung 2 phút: **một cảnh** (30 giây) → **quen thế nào** (20 giây) → **cận cảnh có 4–5 chi tiết** (40 giây) → **một chuyện nhỏ + nhận xét** (30 giây).",
          "12 từ cảm quan (a whiff of · musty · muffled · clatter · calloused…) và 4 khung câu kể (He’d… · What struck me was… · You’d hear…).",
          "🔊 **Giọng kể**: chậm lại ở cận cảnh, ngừng nửa giây trước chi tiết đắt, hạ giọng ở lời bình.",
          "Nối lại: Tập 4 Ngày 6 (người / nơi có câu chuyện nhỏ), Tập 3 Ngày 7 · 14 (ngân hàng tính cách, công trình và vùng đất).",
        ],
      },

      { t: "h", text: "1. Part 2 tả người / nơi — band 7 dừng ở đâu" },
      {
        t: "table", head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["Fluency & Coherence", "Nói đủ 2 phút, theo thứ tự 4 gợi ý của thẻ", "Nói đủ 2 phút; các ý **dẫn sang nhau** như một câu chuyện, ngập ngừng chỉ để nghĩ ý"],
          ["Lexical Resource", "Tính từ đánh giá: skilful, hard-working, peaceful, beautiful", "Từ **cụ thể**: calloused, murky, the hiss of the pump; collocation tự nhiên"],
          ["Grammar", "Quá khứ đơn đúng; vài câu phức", "would / ’d + V cho thói quen, câu chẻ What struck me was…, quá khứ hoàn thành — đa số câu sạch lỗi"],
          ["Pronunciation", "Rõ, đều", "**Đổi nhịp** theo nội dung: nhanh ở bối cảnh, chậm ở chi tiết"],
          ["Nội dung", "Người đó TỐT thế nào", "Người đó TRÔNG, NGHE, LÀM thế nào — người nghe tự rút ra là tốt"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba thói quen giữ người Việt ở band 7 trong Part 2",
        items: [
          "**Xếp chồng tính từ**: “He is kind, friendly, helpful and hard-working.” Bốn tính từ không cho giám khảo thấy gì. Một hành động cụ thể đáng giá hơn.",
          "**Trả lời từng gạch đầu dòng như bốn câu hỏi rời**: “Who he is… What he does… How I know him…”. Thẻ đề là gợi ý, không phải bảng hỏi.",
          "**Kết bằng bài học đạo đức chung**: “We should respect manual workers because they are important for society.” Kết bằng điều **riêng bạn** rút ra.",
        ],
      },

      { t: "h", text: "2. Chi tiết cảm quan — đổi nhận xét thành thứ thấy được" },
      { t: "p", text: "Quy tắc của người viết truyện: **show, don’t tell** (cho thấy, đừng kể lể). Mỗi khi định nói một tính từ đánh giá, hỏi: **“Tôi đã THẤY gì mà nghĩ vậy?”** — rồi nói cái đã thấy." },
      {
        t: "table", head: ["Nhận xét (band 7)", "Hỏi lại", "Chi tiết (band 8)"],
        rows: [
          ["He is very experienced.", "Nhìn đâu mà biết?", "He’d find the puncture with his eyes half closed."],
          ["She is hard-working.", "Bà ấy làm gì, lúc mấy giờ?", "By the time I got up, her shutters had been open for two hours."],
          ["The café is cosy.", "Ấm cúng ở cái gì?", "There’s one lamp per table and the windows are always steamed up."],
          ["The market is noisy and lively.", "Nghe thấy những gì?", "You get the clatter of metal trays and somebody shouting prices over a radio."],
          ["It is a peaceful place.", "Yên tới mức nào?", "It’s so hushed you can hear the lift cables moving."],
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Năm cửa lấy chi tiết — mỗi bài chọn 3 cửa, mỗi cửa 1–2 chi tiết",
        center: "một người / một nơi",
        branches: [
          { label: "👀 Nhìn", items: ["ánh sáng: glare, dim, dappled", "bàn tay, dáng đi", "một đồ vật đã cũ"] },
          { label: "👂 Nghe", items: ["tiếng nền: hum, murmur", "tiếng bật lên: clatter, hiss, creak", "sự im lặng: hushed, muffled"] },
          { label: "👃 Ngửi", items: ["a whiff of…", "smell of + 2 danh từ", "musty, pungent"] },
          { label: "✋ Chạm", items: ["nhiệt: warm concrete, clammy", "bề mặt: rough, calloused"] },
          { label: "🏃 Chuyển động", items: ["thói quen: he’d…", "nhịp: never rushed", "một cử chỉ: held up fingers"] },
        ],
      },
      { t: "p", text: "Mười hai từ dưới đây là từ **ít gặp nhưng người bản ngữ dùng hằng ngày** — đúng loại band 8 cần. Không cần cả 12: chọn 5–6 từ hợp với người và nơi **của bạn**." },
      {
        t: "vocab", items: [
          { w: "a whiff of", pos: "cụm danh từ", ipa: "/ə wɪf əv/", vi: "một thoáng mùi (thoảng qua)", ex: "There was a whiff of petrol every time he opened the door.", exVi: "Mỗi lần ông mở cửa lại thoảng một mùi xăng.", more: "catch / get a whiff of sth. Mùi nhẹ, thoáng qua; mùi nồng dùng **reek of**." },
          { w: "musty", pos: "adj", ipa: "/ˈmʌsti/", vi: "(mùi) ẩm mốc, cũ kỹ", ex: "The shop had the musty smell of old paper.", exVi: "Cửa hiệu có mùi ẩm mốc của giấy cũ.", more: "a musty smell / room / book. Không hẳn chê: gợi nơi lâu đời." },
          { w: "pungent", pos: "adj", ipa: "/ˈpʌndʒənt/", vi: "(mùi, vị) hăng, nồng", ex: "The pungent smell of fish sauce drifted up from the kitchen.", exVi: "Mùi nước mắm nồng bay lên từ bếp.", more: "pungent smell / aroma / spices. Trung tính, không phải “hôi”." },
          { w: "the hum of", pos: "cụm danh từ", ipa: "/ðə hʌm əv/", vi: "tiếng ù ù, rì rì đều đều của", ex: "All you could hear was the hum of the water tanks.", exVi: "Chỉ nghe được tiếng rì rì của mấy bồn nước.", more: "the hum of traffic / a fridge / conversation. Tiếng nền liên tục; động từ: The machines hummed." },
          { w: "clatter", pos: "n / v", ipa: "/ˈklætə/", vi: "tiếng lách cách, loảng xoảng (vật cứng va nhau)", ex: "I woke to the clatter of metal shutters going up.", exVi: "Tôi tỉnh giấc vì tiếng cửa cuốn sắt kéo lên loảng xoảng.", more: "the clatter of plates / hooves / trays. Cùng họ tiếng động: **clink** (leng keng, nhẹ) · **hiss** (xì) · **thud** (thịch)." },
          { w: "muffled", pos: "adj", ipa: "/ˈmʌfld/", vi: "(tiếng) bị nghẹt, nghe không rõ vì bị chắn", ex: "From the roof, the traffic was just a muffled roar.", exVi: "Từ trên mái, tiếng xe cộ chỉ còn là tiếng ầm ì bị nghẹt lại.", more: "muffled voices / footsteps / laughter. Khác **hushed** (người ta cố ý nói khẽ)." },
          { w: "creak", pos: "v / n", ipa: "/kriːk/", vi: "kêu cót két", ex: "The third stair always creaked, so everyone knew when I came home late.", exVi: "Bậc thang thứ ba luôn kêu cót két nên ai cũng biết tôi về muộn.", more: "a creaking door / floorboard / chair. Tính từ: creaky." },
          { w: "hushed", pos: "adj", ipa: "/hʌʃt/", vi: "im ắng, (giọng) thì thầm vì kính nể", ex: "People spoke in hushed voices, as if they were in a library.", exVi: "Người ta nói thì thầm như đang ở trong thư viện.", more: "a hushed room / in hushed tones. Sự im lặng có **người** tạo ra." },
          { w: "murky", pos: "adj", ipa: "/ˈmɜːki/", vi: "đục, tối, lờ mờ (nước, ánh sáng); (nghĩa bóng) mờ ám", ex: "He found the puncture by pushing the tyre into a basin of murky water.", exVi: "Ông tìm chỗ thủng bằng cách nhấn lốp vào chậu nước đục.", more: "murky water / light · the murky world of… (nghĩa bóng) · trong bài mẫu band 8: a basin of murky water" },
          { w: "calloused", pos: "adj", ipa: "/ˈkæləst/", vi: "(tay, chân) chai sần", ex: "Her fingers were calloused from forty years of cutting cloth.", exVi: "Ngón tay bà chai sần sau bốn mươi năm cắt vải.", more: "calloused hands / palms. Danh từ: a callus. Một chi tiết = cả một đời lao động." },
          { w: "clammy", pos: "adj", ipa: "/ˈklæmi/", vi: "ẩm lạnh, nhớp (da, không khí)", ex: "The air in the stairwell was clammy even in summer.", exVi: "Không khí ở cầu thang ẩm lạnh ngay cả vào mùa hè.", more: "clammy hands (vì hồi hộp) / clammy air. Khó chịu nhẹ." },
          { w: "glare", pos: "n / v", ipa: "/ɡleə/", vi: "ánh chói gắt; nhìn trừng trừng", ex: "We sat under a faded umbrella, out of the glare of the afternoon sun.", exVi: "Chúng tôi ngồi dưới chiếc ô bạc màu, tránh cái chói gắt của nắng chiều.", more: "the glare of the sun / headlights / a screen. Trái nghĩa nhẹ: **dim** light, a soft **glow**." },
        ],
      },
      {
        t: "note", title: "⚠️ Dùng chi tiết cảm quan sao cho không thành “văn mẫu”",
        items: [
          "**Ba đến năm chi tiết cho cả bài** là đủ. Câu nào cũng có hai tính từ lạ thì nghe như học thuộc — band 8 ghi “skilfully”, không ghi “nhiều”.",
          "Chi tiết phải **có thật với bạn**. Bạn nói về bà bán xôi thì mùi là lá chuối và hành phi, không phải “the aroma of freshly baked bread”.",
          "Đặt chi tiết **sau một câu thường**: câu thường mở, câu chi tiết đóng. “He didn’t have a shop as such — just a faded umbrella and a basin of murky water.”",
          "~~The atmosphere was very sensory.~~ Không gọi tên kỹ thuật; cứ tả.",
        ],
      },
      {
        t: "mcq", id: "t5d7-noi-chi-tiet", title: "Câu nào là CHI TIẾT (thấy được), không phải nhận xét? (6 câu)",
        items: [
          { q: "Tả một cô giáo dạy nhạc.", options: ["She was a very dedicated and patient teacher.", "She’d tap the rhythm on the lid of the piano with one ring until we got it.", "She had a great passion for music education."], correct: 1, why: "B cho thấy một hành động lặp lại, nghe được (tap), nhìn được (one ring). A và C là nhận xét." },
          { q: "Tả một quán cà phê.", options: ["The seats by the window have gone shiny where people lean back.", "The café has a very relaxing and comfortable atmosphere.", "It is an ideal place for students to study."], correct: 0, why: "A là dấu vết nhìn thấy được, lại ngầm nói quán đông khách lâu năm." },
          { q: "Tả một người bán hàng rong.", options: ["She is one of the most hard-working people I know.", "Her job is very difficult but she never complains.", "You hear her before you see her — two bamboo sticks knocked together, always three times."], correct: 2, why: "C dùng âm thanh + con số cụ thể. A và B kể lể." },
          { q: "Tả một thư viện cũ.", options: ["It has a long history and many valuable books.", "There’s a musty smell on the top floor, and the floorboards creak if you walk too fast.", "It is a quiet and peaceful place to read."], correct: 1, why: "Mùi (musty) + tiếng (creak) — hai giác quan trong một câu." },
          { q: "Chọn câu dùng từ cảm quan ĐÚNG.", options: ["The room was full of a whiff of noise.", "I caught a whiff of incense as we walked past the temple.", "He whiffed very loudly at the customers."], correct: 1, why: "a whiff of + mùi; catch a whiff of. Không dùng cho tiếng động." },
          { q: "Chọn câu dùng từ cảm quan ĐÚNG.", options: ["His muffled hands showed how hard he had worked.", "From inside the car, the music outside was muffled.", "The muffled smell of coffee filled the room."], correct: 1, why: "muffled dùng cho ÂM THANH bị chắn. Tay chai: calloused; mùi: faint." },
        ],
      },

      { t: "h", text: "3. Khung 2 phút — một cảnh, một chuyện, một nhận xét" },
      {
        t: "sodo", kind: "flow", title: "Part 2 tả người / nơi ở band 8",
        steps: [
          { label: "① Một cảnh (≈ 30 giây)", sub: "Ai / ở đâu + hình ảnh đầu tiên hiện ra trong đầu bạn" },
          { label: "② Quen thế nào (≈ 20 giây)", sub: "Một lần cụ thể: When I was about ten…" },
          { label: "③ Cận cảnh (≈ 40 giây)", sub: "4–5 chi tiết từ 3 cửa giác quan; dùng he’d / you’d" },
          { label: "④ Một chuyện nhỏ (≈ 20 giây)", sub: "Once… — một việc xảy ra MỘT lần" },
          { label: "⑤ Nhận xét riêng (≈ 10 giây)", sub: "Điều bạn mang theo tới bây giờ" },
        ],
      },
      {
        t: "patterns", rows: [
          { formula: "S + would / ’d + V  — thói quen trong quá khứ", vi: "Việc lặp đi lặp lại. Dùng cho phần cận cảnh; xen với quá khứ đơn. Không dùng cho trạng thái (~~he’d be old~~).", examples: [
            { en: "He’d run his thumb along the inside of the tyre, and then stop.", vi: "Ông thường miết ngón cái dọc mặt trong lốp xe, rồi dừng lại." },
            { en: "She’d never write anything down; she’d just nod.", vi: "Bà không bao giờ ghi lại gì; bà chỉ gật đầu." },
          ] },
          { formula: "What struck me (most) was + N / how + adj / that + S + V", vi: "Câu chẻ để đưa chi tiết đắt nhất lên. Cả bài dùng MỘT lần.", examples: [
            { en: "What struck me was how little he seemed to look at what he was doing.", vi: "Điều làm tôi chú ý là ông dường như chẳng mấy khi nhìn vào việc mình đang làm." },
          ] },
          { formula: "You’d hear / see / get + N  ·  There’s always + N + V-ing", vi: "“You” chung chung kéo người nghe vào cảnh. Hợp cho âm thanh và mùi.", examples: [
            { en: "You’d hear the hiss of the pump, then the clink of a spanner.", vi: "Bạn sẽ nghe tiếng bơm xì, rồi tiếng cờ-lê leng keng." },
            { en: "There’s always somebody’s washing snapping in the wind.", vi: "Lúc nào cũng có quần áo nhà ai đó phần phật trong gió." },
          ] },
          { formula: "It’s not (really) + N1 — it’s + N2 / that + S + V", vi: "Nhận xét tinh: gạt điều hiển nhiên, nêu điều riêng. Đây là chỗ thể hiện “phát triển ý” của band 8.", examples: [
            { en: "It isn’t really the skill itself — it’s that he never rushed.", vi: "Thật ra không hẳn là tay nghề — mà là ông không bao giờ vội." },
          ] },
        ],
      },
      {
        t: "table", caption: "Ghi chú 1 phút — viết TỪ KHOÁ, không viết câu (ví dụ cho bài mẫu ở mục 4)", head: ["Ô", "Ghi gì", "Ví dụ"],
        rows: [
          ["Cảnh", "2 đồ vật", "umbrella · basin"],
          ["Quen", "tuổi + lý do", "10 · chain"],
          ["Cận cảnh", "3 giác quan", "thumb / eyes closed · glue + dust · hiss, clink"],
          ["Chuyện", "1 động từ", "brake → one screw"],
          ["Nhận xét", "1 cụm", "how little to do"],
        ],
      },
      { t: "rule", formula: "một cảnh → quen thế nào → S + ’d + V × 3 chi tiết → Once… → It’s not N1 — it’s N2", vi: "Khung Part 2 tả người / nơi ở band 8. Bốn gợi ý trên thẻ đều được trả lời, nhưng theo trật tự của câu chuyện." },

      { t: "h", text: "4. Band 7 và band 8 đặt cạnh nhau — cùng một thẻ đề, cùng một người" },
      { t: "p", text: "**Thẻ đề:** Describe a person you know who is very skilled at making or repairing things by hand. You should say: who this person is · what they make or repair · how you came to see them at work · and explain what impresses you about the way they work. — Đọc bản band 7 trước. Bản này **không có lỗi đáng kể**. Hãy gạch dưới mọi tính từ đánh giá và đếm." },
      {
        t: "passage", title: "Bản band 7 (ước tính) — 207 từ, khoảng 1 phút 35 giây",
        paras: [
          { text: "I’m going to talk about Mr Tu, who is a bicycle repairman near my grandparents’ house. He is about seventy years old and he has worked on that street for a very long time. He repairs bicycles, and sometimes he also repairs motorbikes." },
          { text: "I first met him when I was a child, because my bicycle was often broken and my grandfather told me to take it to him. After that I went there many times and I liked watching him work." },
          { text: "Mr Tu is very skilful and experienced. He can find the problem very quickly and he always fixes it carefully. His workplace is very simple. He only has an umbrella and a box of tools, but he can repair almost everything. He is also a quiet person and he doesn’t talk much with his customers." },
          { text: "What impresses me most is his professional attitude. He never hurries and he always focuses on his work. He is also very honest, because sometimes he doesn’t take money for a small repair. In my opinion, he is a good example for young people, and I have learned a lot from him. I think we should respect people who work with their hands, because their jobs are very important for society." },
        ],
      },
      {
        t: "passage", title: "Bản band 8 (ước tính) — 287 từ, khoảng 2 phút",
        paras: [
          { text: "I’d like to talk about a man called Mr Tu, who mends bicycles on the corner of the street where my grandparents live. He must be in his seventies now. He doesn’t have a shop as such — just a faded umbrella, a wooden box of tools and a basin of murky water that he uses to find punctures." },
          { text: "I first got to know him when I was about ten and my chain kept coming off. My grandfather sent me round the corner with a few coins, and I ended up going back most afternoons that summer, mainly to watch." },
          { text: "What struck me was how little he seemed to look at what he was doing. He’d run his thumb slowly along the inside of a tyre with his eyes half closed, and then stop, and that was where the thorn was. His hands were permanently black in the creases, and everything around him smelled of rubber glue and hot dust. You’d hear the hiss of the pump, then the clink of a spanner dropped back in the box, and he hardly ever said a word. If you asked how much, he’d just hold up fingers." },
          { text: "The thing that impresses me, looking back, isn’t really the skill itself — plenty of people can patch a tyre. It’s that he never rushed, even with three people waiting, and he never did more than was needed. Once I asked him to replace a brake cable, and he tightened one screw, handed the bike back and waved my money away. I think that’s what real expertise looks like: knowing exactly how little to do. I’ve tried to carry that into my own work as a programmer — not very successfully, I have to admit." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bản band 7", "Bản band 8", "Bài học"],
        rows: [
          ["Fluency & Coherence", "Bốn đoạn = bốn gạch đầu dòng; nối bằng also, after that", "Một mạch: cảnh → mùa hè năm mười tuổi → cận cảnh → một lần → điều mang theo. “looking back” báo chuyển sang nhận xét", "Thẻ đề là gợi ý; trật tự là của câu chuyện"],
          ["Lexical Resource", "9 tính từ đánh giá: skilful, experienced, simple, quiet, professional, honest, good, important…", "mends · a shop as such · murky · in the creases · the hiss of the pump · the clink of a spanner · patch a tyre · waved my money away", "Động từ và danh từ **cụ thể** thay cho tính từ"],
          ["Grammar", "Hiện tại đơn + quá khứ đơn; câu ngắn, đúng", "must be in his seventies · kept coming off · he’d run / he’d hold up · What struck me was how… · a spanner dropped back · knowing exactly how little to do", "would cho thói quen, V3 rút gọn (bài 1), câu chẻ — mỗi thứ một lần"],
          ["Pronunciation", "Đều một tốc độ", "Có chỗ để đổi nhịp: “and then stop —” · “one screw”", "Chi tiết tạo ra chỗ ngừng tự nhiên"],
          ["Kết bài", "Bài học chung cho “young people” và “society”", "Một nhận định riêng (how little to do) + tự giễu nhẹ", "Kết bằng “tôi”, không bằng “chúng ta nên”"],
        ],
      },
      {
        t: "note", title: "💡 Cách tự nâng một bài Part 2 từ 7 lên 8 — làm với bài của chính bạn",
        items: [
          "Ghi âm bài 2 phút. Nghe lại, **gạch mọi tính từ đánh giá**. Với 3 tính từ đầu tiên, hỏi “tôi đã thấy gì?” và nói lại bằng cái đã thấy.",
          "Thêm **một** câu He’d / She’d / You’d và **một** câu Once….",
          "Đổi câu kết “We should…” thành “I’ve tried to… / I still… / That’s why I…”.",
          "Ghi âm lần hai. Bài sẽ dài hơn 20–30 giây mà không cần thêm ý nào.",
        ],
      },

      { t: "h", text: "5. Tả NƠI — cùng kỹ thuật, đổi cửa giác quan" },
      { t: "p", text: "Với nơi chốn, người Việt hay liệt kê: ở đâu, to hay nhỏ, có những gì. Band 8 chọn **một thời điểm** trong ngày và tả nơi đó **đúng lúc ấy**. Đoạn mẫu dưới đây là phần “cận cảnh” (≈ 40 giây) cho thẻ: Describe a place near your home where you go when you want to be on your own." },
      {
        t: "passage", title: "Đoạn cận cảnh band 8 (ước tính) — 119 từ",
        paras: [
          { text: "It’s the roof of my apartment block, which nobody is really supposed to use. I tend to go up around six, when the concrete’s still warm from the afternoon but the glare has gone. There’s always somebody’s washing snapping in the wind, and behind that, the hum of the water tanks. Eleven floors down you can still hear the traffic, but it’s muffled, like a television in another room. Depending on the time, you get a whiff of whatever the fourth floor is cooking — fried garlic, usually. I don’t do anything up there. I just lean on the wall until the street lights come on, and by then whatever was bothering me has generally shrunk to a manageable size." },
        ],
      },
      {
        t: "table", head: ["Cửa", "Chi tiết trong đoạn", "Để ý"],
        rows: [
          ["Chạm", "the concrete’s still warm", "Nhiệt độ cho biết giờ trong ngày"],
          ["Nhìn", "the glare has gone · until the street lights come on", "Ánh sáng làm mốc thời gian mở và đóng đoạn"],
          ["Nghe", "washing snapping · the hum of the water tanks · muffled… like a television in another room", "Ba lớp: gần – nền – xa; một so sánh đời thường"],
          ["Ngửi", "a whiff of… fried garlic, usually", "Chữ “usually” làm chi tiết có thật"],
          ["Nhận xét", "shrunk to a manageable size", "Không nói “I feel relaxed” — nói điều xảy ra với nỗi lo"],
        ],
      },

      { t: "h", text: "6. 🔊 Phát âm — giọng kể: đổi nhịp theo nội dung" },
      { t: "p", text: "Tập 4 Ngày 6 đã luyện **ngữ điệu kể chuyện** (lên ở chỗ chưa xong, xuống ở chỗ chốt). Hôm nay thêm **nhịp**: người kể giỏi không nói đều. Họ đi nhanh qua bối cảnh, **chậm hẳn** ở chi tiết, và **ngừng nửa giây** ngay trước từ đắt nhất. Người Việt thường làm ngược: gặp từ khó thì nói nhanh cho qua." },
      {
        t: "table", head: ["Chỗ trong bài", "Tốc độ", "Cao độ", "Ví dụ ( | = ngừng ngắn)"],
        rows: [
          ["Bối cảnh, quen thế nào", "nhanh, liền hơi", "bình thường", "I first got to know him when I was about ten and my chain kept coming off."],
          ["Chi tiết cảm quan", "chậm lại ~20 %", "nhấn danh từ cảm quan", "everything around him smelled of | **rubber glue** | and **hot dust**."],
          ["Ngay trước từ đắt", "ngừng nửa giây", "giữ lơ lửng ↗", "and then stop ↗ | and **that** was where the thorn was ↘"],
          ["Lời bình, lời tự giễu", "nhanh hơn, nhẹ", "**hạ thấp** cả cụm", "— not very successfully, I have to admit."],
          ["Chuỗi ba hành động", "đều, mỗi động từ một nhịp", "↗ ↗ ↘", "tightened one screw ↗ | handed the bike back ↗ | and waved my money away ↘"],
        ],
      },
      {
        t: "phatam", id: "t5d7-phat-am", title: "Luyện giọng kể — chậm ở chi tiết, ngừng trước từ đắt",
        note: "Mỗi câu đọc ba lần: lần 1 đều giọng (để thấy nó phẳng thế nào), lần 2 chậm lại ở danh từ cảm quan, lần 3 thêm chỗ ngừng nửa giây ở dấu phẩy. Máy chấm từng âm; nhịp thì bạn tự nghe lại bản ghi.",
        items: [
          { text: "He'd run his thumb slowly along the inside of the tyre.", ipa: "hiːd rʌn hɪz θʌm sləʊli əlɒŋ ði ɪnsaɪd əv ðə taɪə", vi: "Chậm ở “slowly” — nói đúng như nghĩa của nó." },
          { text: "And then he'd stop, and that was where the thorn was.", ipa: "ənd ðen hiːd stɒp ənd ðæt wəz weə ðə θɔːn wɒz", vi: "Ngừng sau “stop”; nhấn “that”." },
          { text: "Everything around him smelled of rubber glue and hot dust.", ipa: "evriθɪŋ əraʊnd hɪm smeld əv rʌbə ɡluː ənd hɒt dʌst", vi: "Hai cụm mùi: mỗi cụm một nhịp riêng." },
          { text: "You'd hear the hiss of the pump, then the clink of a spanner.", ipa: "juːd hɪə ðə hɪs əv ðə pʌmp ðen ðə klɪŋk əv ə spænə", vi: "Giữ đủ âm cuối /s/ của hiss, /ŋk/ của clink." },
          { text: "He hardly ever said a word.", ipa: "hi hɑːdli evə sed ə wɜːd", vi: "Câu ngắn sau câu dài — nói chậm, hạ giọng ở “word”." },
          { text: "He tightened one screw, handed the bike back and waved my money away.", ipa: "hi taɪtnd wʌn skruː hændɪd ðə baɪk bæk ənd weɪvd maɪ mʌni əweɪ", vi: "Chuỗi ba hành động: lên – lên – xuống." },
          { text: "It's muffled, like a television in another room.", ipa: "ɪts mʌfld laɪk ə telɪvɪʒn ɪn ənʌðə ruːm", vi: "Ngừng sau “muffled”; phần so sánh nói nhẹ hơn." },
          { text: "Not very successfully, I have to admit.", ipa: "nɒt veri səksesfəli aɪ hæv tu ədmɪt", vi: "Lời tự giễu: hạ thấp cả câu, nhanh hơn một chút." },
        ],
      },

      { t: "h", text: "7. Đến lượt bạn — hai thẻ Part 2" },
      { t: "p", text: "Làm bài hoàn thành câu để nạp lại từ và khung. Sau đó với mỗi thẻ: **1 phút ghi chú** theo bảng năm ô ở mục 3 (chỉ từ khoá), rồi nói **đủ 2 phút**. Câu cuối của mỗi lượt là câu nối của giám khảo — trả lời 2–3 câu." },
      {
        t: "quiz", id: "t5d7-noi-hoan-thanh", title: "Hoàn thành câu — mỗi chỗ MỘT từ (8 câu)", kind: "fill",
        items: [
          { q: "As we passed the bakery I caught a ___ of cinnamon.", answers: ["whiff"], hint: "một thoáng mùi" },
          { q: "The storeroom had the ___ smell of books nobody had opened for years.", answers: ["musty"], hint: "ẩm mốc, cũ" },
          { q: "At night the only sound was the ___ of the fridge.", answers: ["hum"], hint: "tiếng rì rì đều đều" },
          { q: "Her hands were ___ from decades of gardening.", answers: ["calloused"], hint: "chai sần" },
          { q: "Through the wall we could hear ___ voices, but not the words.", answers: ["muffled"], hint: "bị chắn, nghe không rõ" },
          { q: "What ___ me most was how calm she stayed.", answers: ["struck"], hint: "What ___ me was… (quá khứ của strike)" },
          { q: "Every morning he ___ open the shop at six and sweep the pavement. (thói quen trong quá khứ)", answers: ["would", "'d", "’d"], hint: "would / ’d + V" },
          { q: "It isn’t really the food — ___ that the owner remembers everyone’s name.", answers: ["it's", "it’s", "it is"], hint: "It’s not N1 — ___ that…" },
        ],
      },
      {
        t: "speak", id: "t5d7-noi-nguoi", part: "2",
        questions: [
          "Describe a person you have watched doing their job with great skill. You should say: who this person is; what their job is; where and when you watched them; and explain what you noticed about the way they work.",
          "Do you think you could learn to do that job yourself?",
        ],
      },
      {
        t: "speak", id: "t5d7-noi-noi-chon", part: "2",
        questions: [
          "Describe a place near your home where you go when you want to be on your own. You should say: where it is; when you usually go there; what you can see and hear there; and explain why this place suits you.",
          "Do other people use this place in the same way?",
        ],
      },
      {
        t: "note", title: "Sau khi AI chấm — tự soát năm câu hỏi của band 8",
        items: [
          "Tôi có **ít nhất ba chi tiết** thuộc **hai giác quan** trở lên không? Chi tiết nào tôi tự hào nhất?",
          "Tôi còn mấy tính từ đánh giá (nice, good, hard-working, peaceful)? Giữ tối đa hai.",
          "Có câu **’d + V** và một câu **Once…** không? Có nhầm ’d cho trạng thái không?",
          "Nghe lại bản ghi: có chỗ nào tôi **chậm lại** rõ ràng không, hay cả bài một tốc độ?",
          "Câu kết nói về **tôi** hay về “xã hội”? Nếu là xã hội, nói lại.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d7-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 7 — bị động / chủ động · rút gọn · Phrasebank · process · Short answer + Sentence completion · chi tiết cảm quan",
    goal: "Tự kiểm cả ngày: chọn đúng bị động hay chủ động cho từng bước, rút gọn không treo chủ ngữ, dùng đúng cấu trúc sau mỗi cụm Phrasebank, đọc một sơ đồ quy trình hai nhánh, trả lời ngắn và hoàn thành câu đúng giới hạn từ, và dùng đúng 12 từ cảm quan.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay (42 câu)",
        items: [
          "**I–IV (25 câu)** — ngữ pháp bài 1: bị động / chủ động, rút gọn, Phrasebank, dịch.",
          "**V (5 câu)** — đọc một sơ đồ quy trình hai nhánh và chọn câu viết band 8.",
          "**VI (6 câu)** — bài đọc ngắn: 3 câu Short answer + 3 câu Sentence completion.",
          "**VII (6 câu)** — từ cảm quan của bài Nói.",
          "Làm một mạch khoảng 50 phút, không nhìn lại bài học. Sai phần nào, dòng cuối chỉ mục cần ôn.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ôn nhanh Ngày 7 trước khi làm bài",
        center: "Ngày 7",
        branches: [
          { label: "Bị động hay chủ động", items: ["có người / máy làm ⇒ is + V3", "tự xảy ra ⇒ V(s/es)", "take place · remain · consist of"] },
          { label: "Rút gọn", items: ["N + V3 / V-ing", "Once + V3, S + V", "S + V, V-ing (kết quả)"] },
          { label: "Phrasebank", items: ["begins with + N", ", after which + S V", "culminates in + N"] },
          { label: "Đọc", items: ["Wh- ⇒ loại đáp án", "chép nguyên văn", "đếm số từ"] },
          { label: "Nói Part 2", items: ["cho thấy, đừng kể", "’d + V · Once…", "chậm ở chi tiết"] },
        ],
      },

      { t: "h", text: "I. Bị động hay chủ động? (8 câu) — ôn bài Ngữ pháp mục 2–3" },
      {
        t: "quiz", id: "t5d7-bt-bi-dong", title: "I. Viết dạng đúng của động từ trong ngoặc (hiện tại)", kind: "fill",
        items: [
          { q: "The clay ___ (dig) out of the ground by machine.", answers: ["is dug"], hint: "dig – dug – dug; có máy làm" },
          { q: "When the water ___ (freeze), it expands.", answers: ["freezes"], hint: "tự xảy ra" },
          { q: "The second stage ___ (last) for about ten days.", answers: ["lasts"], hint: "nội động từ" },
          { q: "The fibres ___ (spin) into thread.", answers: ["are spun"], hint: "spin – spun – spun" },
          { q: "A thin skin ___ (form) on the surface as the paint dries.", answers: ["forms"], hint: "tự hình thành" },
          { q: "The loaves are left ___ (cool) on wire racks.", answers: ["to cool"], hint: "be left + ?" },
          { q: "The cloth is rinsed before ___ (dye).", answers: ["being dyed"], hint: "before + being + V3" },
          { q: "Once the tanks ___ (empty), they are cleaned with steam.", answers: ["have been emptied", "are emptied"], hint: "Once + hiện tại hoàn thành bị động" },
        ],
      },

      { t: "h", text: "II. Rút gọn — chọn phương án đúng (6 câu) — ôn mục 4–5" },
      {
        t: "mcq", id: "t5d7-bt-rut-gon", title: "II. Chọn phương án đúng",
        items: [
          { q: "The bottles ___ at this stage are sent back to be melted down.", options: ["rejecting", "rejected", "are rejected"], correct: 1, why: "Chai BỊ loại ⇒ V3; câu đã có động từ chính “are sent”." },
          { q: "___ , the planks are stacked in a drying shed.", options: ["Once cut", "Once cutting", "After cut"], correct: 0, why: "Once + V3. After phải + being cut." },
          { q: "The mixture is stirred continuously, ___ lumps from forming.", options: ["prevented", "which prevent", "preventing"], correct: 2, why: "Kết quả / mục đích của hành động trước ⇒ , V-ing." },
          { q: "A pipe ___ to the main tank carries the liquid away.", options: ["led", "leading", "is leading"], correct: 1, why: "= which leads (chủ động) ⇒ V-ing; câu đã có động từ chính “carries”." },
          { q: "Having been washed, ___ .", options: ["the next step is to peel the potatoes", "workers peel the potatoes", "the potatoes are peeled"], correct: 2, why: "Chủ ngữ ngầm của Having been washed phải là the potatoes." },
          { q: "The resulting liquid, ___ as brine, is pumped into shallow ponds.", options: ["knowing", "known", "is known"], correct: 1, why: "known as = which is known as." },
        ],
      },

      { t: "h", text: "III. Phrasebank — điền MỘT từ (6 câu) — ôn mục 6" },
      {
        t: "quiz", id: "t5d7-bt-phrasebank", title: "III. Điền MỘT từ", kind: "fill",
        items: [
          { q: "___ this, the leather is stretched on wooden frames. (Sau bước này)", answers: ["Following", "following"], hint: "___ this," },
          { q: "The dough is kneaded for ten minutes, ___ which it is left to rise.", answers: ["after"], hint: ", ___ which + mệnh đề" },
          { q: "This is followed by the ___ of the liquid through a paper filter. (filter → danh từ)", answers: ["filtration", "filtering"], hint: "danh hoá: filter → ?" },
          { q: "The pulp is bleached so as ___ remove any remaining ink.", answers: ["to"], hint: "so as ___ + V" },
          { q: "___ , in a separate building, the labels are printed. (Trong khi đó)", answers: ["Meanwhile", "meanwhile"], hint: "hai nhánh song song" },
          { q: "The process ___ in the delivery of the finished cars to showrooms.", answers: ["culminates"], hint: "___ in + danh từ (bước cuối)" },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu)" },
      {
        t: "quiz", id: "t5d7-bt-dich", title: "IV. Dịch — dùng cấu trúc trong gợi ý", kind: "translate",
        grammar: "is / are + V3 · V(s/es) · Once + V3 · , V-ing · has been + V3",
        items: [
          { q: "Quy trình bắt đầu bằng việc thu hoạch lá chè.", answers: ["The process begins with the harvesting of the tea leaves.", "The process begins with the harvesting of tea leaves.", "The process begins with the picking of the tea leaves.", "The process starts with the harvesting of the tea leaves."], hint: "begins with + the harvesting of" },
          { q: "Sau khi được phơi khô, lá được cuộn bằng tay. (Once…)", answers: ["Once dried, the leaves are rolled by hand."], hint: "Once + V3 · roll · by hand" },
          { q: "Hơi nước bốc lên rồi ngưng tụ trên nắp.", answers: ["The steam rises and condenses on the lid.", "The steam rises and then condenses on the lid.", "Steam rises and condenses on the lid."], hint: "rise · condense — đều tự xảy ra" },
          { q: "Hạt được ép, làm dầu thoát ra.", answers: ["The seeds are pressed, releasing the oil.", "The seeds are pressed, releasing their oil.", "The seeds are crushed, releasing the oil.", "The seeds are crushed, releasing their oil."], hint: "press · , releasing" },
          { q: "Nhà kho cũ đã được chuyển thành căn hộ.", answers: ["The old warehouse has been converted into flats.", "The old warehouse has been converted into apartments.", "The old warehouse has been turned into flats.", "The old warehouse has been turned into apartments."], hint: "has been converted into" },
        ],
      },

      { t: "h", text: "V. Đọc sơ đồ quy trình hai nhánh (5 câu) — ôn mục 2–7" },
      { t: "p", text: "Sơ đồ dưới đây có **hai nguyên liệu được xử lý song song** (bước 1 và bước 2) rồi mới trộn. Đọc sơ đồ 1 phút rồi chọn câu viết tốt nhất cho từng bước." },
      {
        t: "figure",
        fig: {
          kind: "process",
          title: "How soy sauce is brewed",
          note: "Quy trình tự đặt cho bài luyện (giản lược từ cách ủ truyền thống).",
          steps: [
            { label: "Soybeans soaked, then steamed", note: "several hours · until soft" },
            { label: "Wheat roasted and crushed", note: "at the same time as step 1" },
            { label: "Beans + wheat mixed with mould culture", note: "warm room · about 3 days" },
            { label: "Salt water added", note: "thick mash, called moromi" },
            { label: "Mash ferments in tanks", note: "6 months or more · colour darkens" },
            { label: "Pressed through cloth", note: "liquid separated from solids" },
            { label: "Liquid heated", note: "stops fermentation" },
            { label: "Bottled", note: "ready for sale" },
          ],
        },
      },
      {
        t: "mcq", id: "t5d7-bt-quy-trinh", title: "V. Chọn câu tốt nhất",
        items: [
          { q: "Bước 1 + 2 (hai nhánh song song).", options: ["First, the soybeans are soaked and steamed until soft. Then the wheat is roasted and crushed.", "The soybeans are soaked and then steamed until soft; meanwhile, the wheat is roasted and crushed.", "The soybeans soak and steam until soft, and the wheat roasts and crushes."], correct: 1, why: "Sơ đồ ghi “at the same time” ⇒ meanwhile. Câu A biến hai nhánh thành nối tiếp; câu C dùng chủ động cho bước có người làm." },
          { q: "Bước 4 (thêm nước muối).", options: ["Salt water is then added, producing a thick mash known as moromi.", "Salt water is then added, produced a thick mash knowing as moromi.", "Then salt water adds and a thick mash is called moromi."], correct: 0, why: ", producing (kết quả) + known as (rút gọn bị động)." },
          { q: "Bước 5 (lên men).", options: ["The mash is fermented by tanks for six months and the colour is darkened.", "The mash is left to ferment in tanks for at least six months, during which time it darkens.", "The mash is happened to ferment in tanks for six months."], correct: 1, why: "be left to + V cho bước “để yên”; darken tự xảy ra ⇒ chủ động; “6 months or more” = at least six months." },
          { q: "Bước 6 + 7.", options: ["Once pressed through cloth, workers heat the liquid.", "After pressed through cloth, the liquid is heated to stop fermentation.", "The mash is then pressed through cloth, and the liquid separated in this way is heated so as to stop fermentation."], correct: 2, why: "A: chủ ngữ treo (workers bị ép). B: after + V3 sai. C: N + V3 + so as to." },
          { q: "Câu overview.", options: ["Overall, soy sauce is made of eight steps and it takes a long time.", "Overall, the process is consisted of eight stages, and fermentation is the longest.", "Overall, the process consists of eight stages, beginning with the preparation of two raw materials and culminating in bottling, with fermentation taking by far the longest."], correct: 2, why: "consist of chủ động; overview nêu điểm đầu, điểm cuối và đặc điểm nổi bật (bước dài nhất)." },
        ],
      },

      { t: "h", text: "VI. Đọc — Short answer + Sentence completion (6 câu) — ôn bài Đọc mục 2–3" },
      { t: "p", text: "Thí nghiệm trong đoạn là thật (công bố năm 2006); lời văn tự viết. Làm trong 7 phút. **Câu 1–3:** NO MORE THAN TWO WORDS AND/OR A NUMBER. **Câu 4–6:** ONE WORD ONLY." },
      {
        t: "passage", title: "Practice That Feels Like Failure",
        paras: [
          { text: "Ask students how they revise and most will describe reading their notes again, often with a highlighter in hand. The method is popular because it feels productive: by the third reading the page seems familiar, and familiarity is easily mistaken for knowledge. In a well-known experiment published in 2006, two American psychologists asked students to study a short text. One group read it several times; the other read it once and then wrote down everything they could remember. Tested five minutes later, the rereaders did slightly better. Tested a week later, the picture was reversed: those who had practised recalling the text remembered considerably more of it." },
          { text: "The explanation usually offered is that pulling information out of memory strengthens the route to it in a way that putting information in does not. The drawback is motivation. Retrieval is effortful and exposes gaps, so learners who try it tend to rate it as less effective than rereading, even when their own results show the opposite. Teachers who want the technique adopted may therefore need to present low-stakes quizzes not as assessment but as a form of study." },
        ],
      },
      {
        t: "quiz", id: "t5d7-bt-doc", title: "VI. Questions 1–6", kind: "fill",
        items: [
          { q: "1. What do many students hold while going over their notes?", answers: ["a highlighter", "highlighter"], hint: "What ⇒ vật; “in hand” ↔ hold" },
          { q: "2. How long after studying did the rereading group do better?", answers: ["five minutes", "5 minutes"], hint: "How long ⇒ số + đơn vị; cẩn thận “a week”" },
          { q: "3. Which method do learners judge to be more effective than retrieval?", answers: ["rereading"], hint: "rate it as less effective than… — đảo chiều so sánh" },
          { q: "4. Students tend to confuse ______ with real knowledge.", answers: ["familiarity"], hint: "is mistaken for ↔ confuse… with" },
          { q: "5. Retrieval practice is unpopular because it takes effort and reveals ______ .", answers: ["gaps"], hint: "exposes ↔ reveals" },
          { q: "6. The writer suggests that quizzes should be presented as a kind of ______ .", answers: ["study"], hint: "not as assessment but as a form of…" },
        ],
      },

      { t: "h", text: "VII. Từ cảm quan (6 câu) — ôn bài Nói mục 2" },
      {
        t: "quiz", id: "t5d7-bt-cam-quan", title: "VII. Điền MỘT từ (chữ cái đầu cho sẵn)", kind: "fill",
        items: [
          { q: "The p___ smell of dried shrimp hung over the whole market.", answers: ["pungent"], hint: "hăng, nồng" },
          { q: "We were woken by the c___ of plates from the kitchen downstairs.", answers: ["clatter"], hint: "loảng xoảng" },
          { q: "The gate c___ every time the wind caught it.", answers: ["creaked", "creaks"], hint: "kêu cót két" },
          { q: "The pond behind the factory was so m___ that you couldn't see the bottom.", answers: ["murky"], hint: "đục, tối" },
          { q: "Inside the temple, visitors spoke in h___ voices.", answers: ["hushed"], hint: "thì thầm vì kính nể" },
          { q: "My hands were c___ with nerves before the interview.", answers: ["clammy"], hint: "ẩm lạnh, nhớp" },
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "**I–II sai ≥ 4 câu:** đọc lại bài Ngữ pháp mục 2 (bảng “cùng một động từ — hai nghĩa”) và mục 5 (chủ ngữ treo).",
          "**III–V sai ≥ 4 câu:** chép tay bảng “mỗi cụm kéo theo một cấu trúc” ở mục 6, rồi viết lại bước 3–8 của sơ đồ nước tương thành một đoạn 90 từ.",
          "**VI sai ≥ 2 câu:** xem mình sai vì số từ, dạng từ hay paraphrase — ghi vào Sổ lỗi theo loại; ôn bài Đọc mục 3.",
          "**VII sai ≥ 2 câu:** mở Flashcards bộ “Từ của khoá — Tập 5”, lọc Ngày 7.",
        ],
      },
    ],
  },
];
