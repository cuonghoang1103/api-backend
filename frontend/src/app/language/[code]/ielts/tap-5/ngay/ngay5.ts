/**
 * IELTS Tập 5 — Ngày 5 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Câu phức nhiều tầng không lỗi: mệnh đề phân từ + quan hệ + danh ngữ trong MỘT câu      [G26 G30 G35 · G43]
 *                     — nối Tập 3 Ngày 17 (quan hệ) · Tập 3 Ngày 23 (danh ngữ) · Tập 4 Ngày 5 (phân từ, câu xếp chồng) · Tập 4 Ngày 11
 *   Bài 2 (reading)   Matching headings 4 — bài trừu tượng ~1.000 từ, tiêu đề nói CHỨC NĂNG LẬP LUẬN của đoạn (8 headings +
 *                     Summary 4 + MCQ 1 = 13 câu / 18 phút)                                                  [R12 R19 R21]
 *                     — nối Tập 2 Ngày 12 · Tập 3 Ngày 5 · Tập 4 Ngày 3 (tiêu đề ý ẩn)
 *   Bài 3 (listening) Part 4 bài giảng chuyên sâu ~8 phút (~1.350 từ, ~175 từ/phút), giọng Úc, Note completion 10 câu  [L06 L07]
 *                     — nối Tập 4 Ngày 8 (Part 4 band 7) · Tập 4 Ngày 7 (nối âm /j/ /w/)   🔊 nối âm chuỗi [S14]
 *   Bài tập Ngày 5    42 câu có đáp án + 1 đoạn viết
 * Mọi id bắt đầu `t5d5-`. Dữ kiện có thật: Wittgenstein (Philosophical Investigations, 1953), Eleanor Rosch (thập niên 1970),
 * vụ Nix v. Hedden (Toà Tối cao Mỹ, 1893), định nghĩa “planet” của IAU (8/2006); cáp điện báo xuyên Đại Tây Dương 1858 / 1866,
 * cáp quang TAT-8 (1988), động đất ngoài khơi nam Đài Loan 12/2006. Số liệu chi tiết đã làm tròn / làm mờ; các tên riêng trong
 * bài tập (Tarn Valley, Dr Okafor…) là hư cấu.
 */
import type { Lesson } from '../data';

export const NGAY_5: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d5-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu phức nhiều tầng không lỗi — mệnh đề phân từ + quan hệ + danh ngữ trong một câu",
    goal: "Viết được câu học thuật 30–40 từ gồm hai, ba tầng mệnh đề (phân từ, quan hệ, danh ngữ) mà vẫn đúng chủ – vị, không chủ ngữ treo, không which mơ hồ; biết dựng câu từ “xương sống” ra và biết khi nào phải tách — đúng mô tả GRA band 8: nhiều loại cấu trúc, đa số câu không lỗi.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA Writing 7 → 8** và **GRA Speaking**: band 7 đã viết được từng loại mệnh đề riêng lẻ; band 8 ==xếp hai, ba loại vào một câu mà không sai==.",
          "Ba “tầng” hôm nay đều đã học: **quan hệ** (Tập 3 Ngày 17), **danh ngữ** (Tập 3 Ngày 23 · Tập 4 Ngày 11), **phân từ** (Tập 4 Ngày 5). Hôm nay không có cấu trúc mới — chỉ có ==cách ghép và cách soát==.",
          "Luật số 1: viết **xương sống** (S + V + O) trước, gắn tầng sau. Câu dài sai gần như luôn vì mất xương sống.",
          "Luật số 2: **tối đa một tầng đứng trước động từ chính**; tầng nặng dồn về cuối câu.",
          "Năm lỗi của câu nhiều tầng: thiếu động từ chính · chủ – vị xa nhau · chủ ngữ treo · which mơ hồ · that… and that… lệch.",
          "Band 8 là **rõ**, không phải dài: mỗi đoạn 1–2 câu ba tầng là đủ; câu nào đọc hai lần mới hiểu thì tách.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. “Câu dài” và “câu nhiều tầng” — band 7 và band 8 khác nhau ở đâu" },
      {
        t: "p",
        text: "Người band 6.5–7 kéo dài câu bằng cách ==nối ngang==: and, but, so, because, lặp lại ba bốn lần. Câu dài ra nhưng mọi ý vẫn ngang hàng nhau. Người band 8 kéo dài câu bằng cách ==lồng dọc==: một ý chính, các ý phụ treo vào nó ở những tầng khác nhau. Người đọc nhìn cấu trúc là biết ý nào chính, ý nào phụ.",
      },
      {
        t: "table",
        head: ["", "Band 7 (ước tính)", "Band 8 (ước tính)"],
        rows: [
          ["Cách kéo dài", "nối ngang: and · but · so · because", "lồng dọc: phân từ · quan hệ · danh ngữ"],
          ["Ví dụ", "Many cities have introduced bike lanes **and** this has reduced car use, **but** some drivers complain **because** the roads are narrower.", "Many cities have introduced bike lanes, **reducing** car use, although drivers **who** now face narrower roads complain **that** the change was imposed without consultation."],
          ["Số tầng", "1 (bốn mệnh đề ngang hàng)", "3 (phân từ → quan hệ → danh ngữ)"],
          ["Lỗi", "ít, vì cấu trúc đơn giản", "vẫn 0 — đây mới là chỗ khó"],
          ["Tần suất", "câu nào cũng dài như nhau", "1–2 câu nhiều tầng mỗi đoạn, xen câu ngắn"],
        ],
        caption: "Cùng một nội dung — nối ngang và lồng dọc",
      },
      {
        t: "quiz",
        id: "t5d5-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 3 Ngày 17 · Tập 4 Ngày 5 · Ngày 11 (6 câu)",
        items: [
          { q: "(Face) ___ with rising costs, the firm cut its training budget.", answers: ["Faced"], hint: "Công ty BỊ đặt trước chi phí tăng → nghĩa bị động → V3. Tập 4 Ngày 5 mục 4." },
          { q: "The survey, ___ results were published last week, covered forty cities.", answers: ["whose"], hint: "results của survey → sở hữu → whose (dùng được cho vật)." },
          { q: "(Finish) ___ the pilot study, the team applied for further funding.", answers: ["Having finished"], hint: "Việc xong TRƯỚC việc chính → Having + V3. Tập 4 Ngày 5 mục 5." },
          { q: "It is unclear ___ the policy will survive a change of government. (một từ)", answers: ["whether", "if"], hint: "Mệnh đề danh ngữ “có … hay không” → whether (văn viết chuộng whether hơn if)." },
          { q: "People (live) ___ near the airport were offered compensation.", answers: ["living"], hint: "who live → rút gọn chủ động → living. Động từ chính của câu là were offered." },
          { q: "The fact ___ prices have fallen does not mean that demand has recovered. (một từ)", answers: ["that"], hint: "the fact + that + mệnh đề đủ S – V: mệnh đề đồng vị, không dùng which." },
        ],
      },
      { t: "p", text: "Đúng 5–6 câu: đi tiếp. Sai từ 2 câu trở lên ở cùng một loại: mở lại đúng bài đã ghi trong gợi ý trước khi học mục 2." },
      { t: "rule", formula: "band 7: S + V, and S + V, but S + V   →   band 8: S + V + O, V-ing …, although N who … V that …", vi: "Kéo dài bằng cách lồng tầng, không phải bằng cách nối thêm and / but / so." },

      /* ── 2 ── */
      { t: "h", text: "2. Xương sống trước, tầng sau — cách dựng một câu ba tầng" },
      {
        t: "p",
        text: "Mọi câu, dù dài tới đâu, chỉ có **một** xương sống: chủ ngữ chính + động từ chính (+ tân ngữ / bổ ngữ). Mọi thứ khác là tầng treo vào. Khi viết, làm đúng thứ tự: ==viết xương sống thành một câu ngắn đứng được một mình==, rồi mới hỏi “chỗ nào cần nói rõ thêm?”.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Dựng câu ba tầng — bốn bước",
        steps: [
          { label: "① Xương sống", sub: "The committee rejected the proposal." },
          { label: "② Tầng quan hệ — nói rõ DANH TỪ nào", sub: "The committee rejected the proposal, **which had been drafted in a week**." },
          { label: "③ Tầng danh ngữ — nói rõ NỘI DUNG (nghĩ / nói / lý do)", sub: "The committee rejected the proposal, which had been drafted in a week, **arguing that it ignored the cost of maintenance**." },
          { label: "④ Soát ngược", sub: "Che mọi tầng → còn lại câu ①? Động từ chính vẫn là rejected? Ai arguing? — the committee ✓" },
        ],
      },
      {
        t: "table",
        head: ["Tầng", "Trả lời câu hỏi", "Treo vào", "Dấu hiệu"],
        rows: [
          ["**Quan hệ**", "cái nào? người nào?", "một DANH TỪ", "who · which · that · whose · where · V-ing / V3 ngay sau danh từ"],
          ["**Phân từ**", "khi nào? vì sao? kết quả gì?", "cả MỆNH ĐỀ chính (chung chủ ngữ)", "V-ing / V3 / Having V3 ở đầu hoặc cuối câu, có dấu phẩy"],
          ["**Danh ngữ**", "(nghĩ / nói / biết) cái gì?", "một ĐỘNG TỪ, TÍNH TỪ hoặc DANH TỪ trừu tượng", "that · whether · what · how · why + S + V"],
        ],
        caption: "Ba tầng — mỗi tầng treo vào một thứ khác nhau",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — phép thử “che tầng”",
        items: [
          "Viết xong câu dài, lấy tay che mọi mệnh đề phụ. Phần còn lại ==phải là một câu hoàn chỉnh==.",
          "~~The proposal, which was drafted in a week and ignoring maintenance costs.~~ Che tầng → còn “The proposal.” — không có động từ chính. Đây là mảnh câu (fragment).",
          "The proposal, which was drafted in a week, **ignored** maintenance costs. Che tầng → “The proposal ignored maintenance costs.” ✓",
        ],
      },
      { t: "rule", formula: "S + V + O   →   + tầng quan hệ (sau N)   →   + tầng phân từ / danh ngữ (cuối câu)   →   che tầng, soát lại S + V", vi: "Luôn viết câu ngắn đứng được một mình trước; tầng gắn sau, soát bằng cách che." },
      {
        t: "quiz",
        id: "t5d5-xuong-song-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dựng từ xương sống (4 câu)",
        grammar: "S + V + O, + which / who … , + V-ing … that …",
        items: [
          { q: "Chính quyền đã đóng cửa cây cầu, vốn được xây năm 1960, với lý do rằng nó không còn an toàn.", answers: ["The authorities closed the bridge, which was built in 1960, arguing that it was no longer safe.", "The authorities closed the bridge, which had been built in 1960, arguing that it was no longer safe.", "The authorities closed the bridge, built in 1960, arguing that it was no longer safe."], hint: "close · which was built · arguing that · no longer safe" },
          { q: "Những sinh viên làm thêm hơn 20 giờ một tuần thường cho biết rằng họ không có thời gian để ngủ đủ.", answers: ["Students who work more than 20 hours a week often report that they do not have time to sleep enough.", "Students working more than 20 hours a week often report that they do not have enough time to sleep.", "Students who work more than twenty hours a week often say that they do not have enough time to sleep."], hint: "students who work / working · report that" },
          { q: "Khi được hỏi vì sao họ rời nông thôn, phần lớn người tham gia nói rằng ở đó không có việc làm.", answers: ["Asked why they had left the countryside, most participants said that there were no jobs there.", "When asked why they had left the countryside, most participants said that there were no jobs there.", "When asked why they left the countryside, most participants said there were no jobs there."], hint: "(When) asked why they had left · most participants said that" },
          { q: "Nghiên cứu, theo dõi 3.000 trẻ em trong mười năm, cho thấy những gì trẻ đọc quan trọng hơn việc chúng đọc bao nhiêu.", answers: ["The study, which followed 3,000 children for ten years, shows that what children read matters more than how much they read.", "The study, which followed 3,000 children for ten years, showed that what children read matters more than how much they read.", "The study, which followed 3,000 children over ten years, found that what children read is more important than how much they read."], hint: "which followed · shows that · what children read · how much they read" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Tầng quan hệ — bốn chỗ người band 7 vẫn trượt" },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V + O, which + V(s/es) …  (which = cả mệnh đề trước)",
            vi: "① which bình luận CẢ Ý phía trước — luôn có dấu phẩy, động từ luôn số ít",
            examples: [
              { en: "Enrolment fell for the third year running, which suggests that the fee increase was a mistake.", vi: "Số sinh viên nhập học giảm năm thứ ba liên tiếp, điều này cho thấy việc tăng học phí là một sai lầm." },
              { en: "Half of the respondents did not finish the survey, which makes the results hard to interpret.", vi: "Một nửa số người trả lời không làm hết khảo sát, điều đó khiến kết quả khó diễn giải." },
            ],
          },
          {
            formula: "N + giới từ + which / whom + S + V",
            vi: "② giới từ đứng TRƯỚC which / whom — văn viết band 8; không dùng that sau giới từ",
            examples: [
              { en: "The extent to which a policy succeeds depends on how it is enforced.", vi: "Mức độ thành công của một chính sách phụ thuộc vào cách nó được thực thi." },
              { en: "The study recruited 400 adults, most of whom had never voted.", vi: "Nghiên cứu tuyển 400 người lớn, phần lớn trong số họ chưa từng đi bầu." },
              { en: "There are several ways in which cities can reduce noise.", vi: "Có vài cách để thành phố giảm tiếng ồn." },
            ],
          },
          {
            formula: "N + V-ing …  (chủ động)   ·   N + V3 …  (bị động)",
            vi: "③ rút gọn — chỉ khi đại từ quan hệ là CHỦ NGỮ của mệnh đề quan hệ",
            examples: [
              { en: "Workers earning below the minimum wage are entitled to support. (= who earn)", vi: "Người lao động có thu nhập dưới mức lương tối thiểu được quyền nhận hỗ trợ." },
              { en: "The measures introduced last year have had little effect. (= which were introduced)", vi: "Các biện pháp được đưa ra năm ngoái hầu như không có tác dụng." },
            ],
          },
          {
            formula: "N, which … ,  (thêm thông tin)   ≠   N that …  (xác định cái nào)",
            vi: "④ dấu phẩy đổi nghĩa: có phẩy = tất cả; không phẩy = chỉ nhóm đó",
            examples: [
              { en: "The students, who had revised, passed. (tất cả sinh viên đều đã ôn và đều đỗ)", vi: "Các sinh viên, vốn đã ôn bài, đều đỗ." },
              { en: "The students who had revised passed. (chỉ những bạn đã ôn mới đỗ)", vi: "Những sinh viên đã ôn bài thì đỗ." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi hay sai ở tầng quan hệ",
        items: [
          "~~The extent that parents are involved…~~ → The extent **to which** parents are involved… (extent / degree / way / reason đi với giới từ + which: the degree **to which**, the way **in which**, the reason **for which** / why).",
          "~~most of them had never voted~~ sau dấu phẩy là comma splice → most **of whom** had never voted.",
          "~~The policy the government introduced it last year~~ — thừa it: đại từ quan hệ (dù ẩn) đã là tân ngữ.",
          "Không rút gọn được khi đại từ quan hệ là TÂN NGỮ: the report **that the committee wrote** ✓ · ~~the report the committee writing~~ ✗.",
          "which bình luận cả ý → động từ **số ít**: …, which **suggest** ✗ → which **suggests** ✓.",
        ],
      },
      { t: "rule", formula: "…, which + V(s/es)   ·   the extent to which + S + V   ·   N, most of whom + V   ·   N + V-ing / V3", vi: "Bốn mẫu quan hệ của band 8: bình luận cả ý · giới từ + which · of whom · rút gọn khi đại từ là chủ ngữ." },
      {
        t: "quiz",
        id: "t5d5-quan-he-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — tầng quan hệ (4 câu)",
        grammar: "the extent to which · , most of whom · , which + V(s/es)",
        items: [
          { q: "Mức độ mà phụ huynh tham gia ảnh hưởng mạnh đến kết quả học tập.", answers: ["The extent to which parents are involved strongly affects academic results.", "The extent to which parents are involved strongly influences academic results.", "The extent to which parents are involved has a strong effect on academic results."], hint: "the extent to which · be involved" },
          { q: "Công ty sa thải 200 nhân viên, phần lớn trong số họ đã làm ở đó hơn mười năm.", answers: ["The company dismissed 200 employees, most of whom had worked there for more than ten years.", "The company laid off 200 employees, most of whom had worked there for over ten years.", "The company laid off 200 workers, most of whom had worked there for more than ten years."], hint: "most of whom · had worked" },
          { q: "Giá thuê nhà đã tăng gấp đôi trong năm năm, điều này giải thích vì sao nhiều người trẻ rời thành phố.", answers: ["Rents have doubled in five years, which explains why many young people are leaving the city.", "Rents have doubled in five years, which explains why many young people leave the city.", "Rents have doubled over five years, which explains why many young people are leaving the city."], hint: ", which explains why" },
          { q: "Các biện pháp được đưa ra sau khủng hoảng đã thay đổi cách thức các ngân hàng cho vay.", answers: ["The measures introduced after the crisis changed the way in which banks lend.", "The measures introduced after the crisis have changed the way in which banks lend.", "The measures introduced after the crisis have changed the way banks lend."], hint: "measures introduced · the way in which" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Tầng phân từ — ba vị trí, một luật chủ ngữ" },
      {
        t: "p",
        text: "Mệnh đề phân từ không có chủ ngữ riêng: nó ==mượn chủ ngữ của mệnh đề chính==. Đó là luật duy nhất, và là nguồn của lỗi nặng nhất (chủ ngữ treo — Tập 4 Ngày 5 mục 7). Ở band 8, bạn dùng nó ở ba vị trí với ba việc khác nhau.",
      },
      {
        t: "table",
        head: ["Vị trí", "Việc nó làm", "Ví dụ"],
        rows: [
          ["**Đầu câu**", "bối cảnh: lý do, thời gian, điều kiện", "**Having lost** public support, the scheme was abandoned within a year."],
          ["**Cuối câu**", "kết quả hoặc diễn giải", "The factory closed in 2019, **leaving** 800 people out of work."],
          ["**Cuối câu + thereby / thus**", "kết quả có chủ đích, rất trang trọng", "The tax was cut, **thereby encouraging** firms to invest."],
          ["**Giữa câu** (sau chủ ngữ)", "chêm thông tin về chủ ngữ", "The council, **faced with** a budget shortfall, postponed the project."],
          ["**Liên từ + phân từ**", "nói rõ quan hệ", "**When asked** about pay, most staff declined to comment. · **If left** untreated, the condition worsens."],
        ],
        caption: "Phân từ: ba vị trí và năm việc",
      },
      {
        t: "examples",
        items: [
          { en: "~~Having analysed the data, the results were surprising.~~ → Having analysed the data, **the researchers** found the results surprising.", vi: "“results” không phân tích dữ liệu → chủ ngữ treo. Chủ ngữ mệnh đề chính phải là người làm việc analyse." },
          { en: "~~Walking through the old town, the buildings look neglected.~~ → Walking through the old town, **visitors** notice how neglected the buildings look.", vi: "Toà nhà không đi bộ." },
          { en: "Prices rose sharply, **forcing** many families to cut back. (chủ ngữ ngầm của forcing = cả sự việc “prices rose”)", vi: "Phân từ cuối câu chỉ kết quả được phép lấy cả mệnh đề trước làm chủ ngữ ngầm — đây là ngoại lệ duy nhất, và rất hay dùng trong Task 1." },
          { en: "**Having been warned** twice, the company could not claim ignorance.", vi: "Bị động + xong trước → Having been + V3." },
        ],
      },
      { t: "rule", formula: "V-ing / V3 / Having V3 … , S + V   (S làm cả hai việc)   ·   S + V … , V-ing …  (kết quả)", vi: "Phân từ đầu câu: chủ ngữ ngay sau dấu phẩy phải là người / vật thực hiện phân từ. Phân từ cuối câu: nêu kết quả của cả ý trước." },
      {
        t: "quiz",
        id: "t5d5-phan-tu-dien",
        kind: "fill",
        title: "Viết dạng đúng của động từ trong ngoặc (7 câu)",
        items: [
          { q: "(Build) ___ in the 1920s, the stadium no longer meets safety standards.", answers: ["Built"], hint: "Sân vận động ĐƯỢC xây → V3." },
          { q: "The river burst its banks, (flood) ___ more than 300 homes.", answers: ["flooding"], hint: "Kết quả của cả ý trước → V-ing cuối câu." },
          { q: "(Not know) ___ the local language, many migrants rely on their children to translate.", answers: ["Not knowing"], hint: "Lý do, chủ động; phủ định đặt not trước V-ing." },
          { q: "(Reject) ___ by three publishers, the author decided to print the book herself.", answers: ["Having been rejected", "Rejected"], hint: "Bị từ chối, xong trước việc chính → Having been rejected (Rejected cũng đúng)." },
          { q: "The government raised the school-leaving age, thereby (reduce) ___ youth unemployment figures.", answers: ["reducing"], hint: "thereby + V-ing." },
          { q: "When (compare) ___ with rail, air travel produces far more emissions per passenger.", answers: ["compared"], hint: "air travel ĐƯỢC đem so → When compared with." },
          { q: "(Spend) ___ a year abroad, she found it hard to settle back into her old job.", answers: ["Having spent"], hint: "Xong trước → Having spent." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Tầng danh ngữ — cả một mệnh đề đứng ở chỗ của danh từ" },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V + that + S + V   ·   S + V + whether / wh- + S + V",
            vi: "① làm tân ngữ: sau động từ nghĩ / nói / cho thấy. Trật tự câu KỂ, không đảo",
            examples: [
              { en: "The findings indicate that early intervention is cheaper than treatment.", vi: "Kết quả cho thấy can thiệp sớm rẻ hơn điều trị." },
              { en: "Few studies have examined how these habits are formed.", vi: "Ít nghiên cứu xem xét các thói quen này được hình thành thế nào." },
            ],
          },
          {
            formula: "What + S + V + is / was …   ·   Whether + S + V + V(s/es) …",
            vi: "② làm chủ ngữ: động từ chính SỐ ÍT",
            examples: [
              { en: "What most employees want is flexibility, not higher pay.", vi: "Điều phần lớn nhân viên muốn là sự linh hoạt chứ không phải lương cao hơn." },
              { en: "Whether the scheme will be extended depends on this year's results.", vi: "Việc chương trình có được kéo dài hay không phụ thuộc vào kết quả năm nay." },
            ],
          },
          {
            formula: "the fact / claim / idea / belief / evidence + that + S + V",
            vi: "③ đồng vị: nói NỘI DUNG của danh từ trừu tượng. Mệnh đề sau that đủ S – V – O",
            examples: [
              { en: "The claim that screens damage eyesight is not supported by the evidence.", vi: "Nhận định rằng màn hình làm hỏng thị lực không được bằng chứng ủng hộ." },
              { en: "Despite the fact that funding has doubled, waiting times have not fallen.", vi: "Mặc dù kinh phí đã tăng gấp đôi, thời gian chờ vẫn không giảm." },
            ],
          },
          {
            formula: "It is + adj + that …   ·   It remains unclear whether …",
            vi: "④ chủ ngữ giả it: đẩy mệnh đề danh ngữ nặng về cuối câu",
            examples: [
              { en: "It is striking that so few of the participants had heard of the scheme.", vi: "Đáng chú ý là rất ít người tham gia từng nghe về chương trình." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Nhìn giống nhau", "Đồng vị (danh ngữ)", "Quan hệ"],
        rows: [
          ["Ví dụ", "the claim **that** prices will fall", "the claim **that** the minister made"],
          ["Sau that", "mệnh đề ĐỦ thành phần (prices will fall)", "mệnh đề THIẾU một thành phần (the minister made ▢)"],
          ["Thay that bằng which?", "không", "được"],
          ["Bỏ that?", "không nên trong văn viết", "được (khi là tân ngữ)"],
        ],
        caption: "that đồng vị và that quan hệ — phép thử: mệnh đề sau that có thiếu gì không?",
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi danh ngữ của người Việt",
        items: [
          "~~The reason is because wages are low.~~ → The reason is **that** wages are low.",
          "~~Nobody knows why did the project fail.~~ → Nobody knows why the project **failed**. (trật tự câu kể)",
          "~~Despite that funding has doubled…~~ → **Despite the fact that** funding has doubled… / **Although** funding has doubled…",
          "~~What the residents want are more buses.~~ → What the residents want **is** more buses. (What-clause làm chủ ngữ → số ít)",
        ],
      },
      { t: "rule", formula: "S + V + that / whether / wh- + S + V   ·   What + S + V + is …   ·   the fact that + S + V   ·   It is + adj + that …", vi: "Mệnh đề danh ngữ luôn theo trật tự câu kể; làm chủ ngữ thì động từ chính số ít; đồng vị thì mệnh đề sau that phải đủ thành phần." },
      {
        t: "quiz",
        id: "t5d5-danh-ngu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — tầng danh ngữ (4 câu)",
        grammar: "What + S + V + is … · the fact that · whether … depends on · why + S + V",
        items: [
          { q: "Điều các nhà tuyển dụng coi trọng nhất là khả năng học nhanh.", answers: ["What employers value most is the ability to learn quickly.", "What employers value the most is the ability to learn quickly."], hint: "What employers value most is" },
          { q: "Việc một thành phố có đáng sống hay không phụ thuộc vào cách nó được quy hoạch.", answers: ["Whether a city is liveable depends on how it is planned.", "Whether a city is worth living in depends on how it is planned.", "Whether or not a city is liveable depends on how it is planned."], hint: "Whether … depends on how" },
          { q: "Mặc dù số người đi xe buýt đã tăng, tắc đường vẫn không giảm.", answers: ["Despite the fact that the number of bus passengers has risen, congestion has not fallen.", "Despite the fact that bus use has increased, congestion has not fallen.", "Although the number of bus passengers has risen, congestion has not fallen."], hint: "Despite the fact that · has risen · congestion" },
          { q: "Vẫn chưa rõ vì sao tỉ lệ sinh giảm nhanh như vậy.", answers: ["It remains unclear why the birth rate fell so quickly.", "It remains unclear why the birth rate has fallen so quickly.", "It is still unclear why the birth rate has fallen so quickly."], hint: "It remains unclear why + S + V" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Xếp ba tầng — đặt tầng nào ở đâu để câu vẫn dễ đọc" },
      {
        t: "p",
        text: "Người đọc phải ==giữ chủ ngữ trong đầu== cho tới khi gặp động từ chính. Chủ ngữ và động từ càng xa nhau, câu càng nặng — và bạn càng dễ chia sai. Vì vậy tiếng Anh học thuật có một thói quen: **phần nặng dồn về cuối câu** (end-weight).",
      },
      {
        t: "table",
        head: ["Cách xếp", "Câu", "Nhận xét"],
        rows: [
          ["✗ Dồn về giữa", "The proposal **that** the committee **which** the minister appointed **after** the report **that** criticised the previous scheme was published drafted was rejected.", "Ba tầng chen giữa chủ ngữ và động từ: không ai đọc nổi, dù đúng ngữ pháp."],
          ["△ Một tầng dài trước động từ", "The proposal drafted by the committee that the minister had appointed after the critical report was published **was rejected**.", "Đúng, nhưng 17 từ mới tới động từ chính."],
          ["✓ Dồn về cuối", "The minister **rejected** the proposal drafted by the committee, which he had appointed after a report criticising the previous scheme was published.", "Xương sống xong sau 5 từ; các tầng nối đuôi nhau, mỗi tầng treo vào danh từ đứng ngay trước nó."],
        ],
        caption: "Cùng thông tin — ba cách xếp",
      },
      {
        t: "note",
        title: "💡 Ba mẹo xếp tầng của band 8",
        items: [
          "**Tối đa một tầng** giữa chủ ngữ và động từ chính, và tầng đó ngắn (dưới ~10 từ).",
          "Chủ ngữ quá nặng → đổi sang **bị động / chủ động** hoặc dùng **It is … that** để đẩy phần nặng ra sau.",
          "Mỗi tầng treo vào ==danh từ đứng sát ngay trước nó==. Nếu giữa which và danh từ nó chỉ có một danh từ khác chen vào → viết lại.",
        ],
      },
      {
        t: "examples",
        items: [
          { en: "~~The fact that the number of people who cycle to work in cities where separate lanes have been built has risen suggests…~~", vi: "Chủ ngữ 21 từ. Người đọc quên mất “The fact” khi tới “suggests”." },
          { en: "→ In cities where separate lanes have been built, more people now cycle to work, which suggests that infrastructure, not attitude, is what holds cycling back.", vi: "Đưa bối cảnh ra đầu, xương sống ngắn, bình luận bằng which + danh ngữ ở cuối." },
        ],
      },
      { t: "rule", formula: "[bối cảnh ngắn,]  S + V + O  + tầng 1 + tầng 2 + tầng 3   (≤ 1 tầng ngắn trước V)", vi: "Xương sống sớm, tầng nặng về cuối; mỗi tầng dính vào danh từ sát trước nó." },
      {
        t: "quiz",
        id: "t5d5-xep-tang-dien",
        kind: "fill",
        title: "Điền MỘT từ vào mỗi chỗ trống (8 câu)",
        items: [
          { q: "The report, ___ was commissioned by the ministry, concluded that the scheme had failed.", answers: ["which"], hint: "Mệnh đề không xác định (có phẩy) → which, không dùng that." },
          { q: "Researchers interviewed 60 nurses, many of ___ said that they had considered leaving the profession.", answers: ["whom"], hint: "many of + whom (người)." },
          { q: "___ surprised the team was not the size of the effect but how long it lasted.", answers: ["What"], hint: "What-clause làm chủ ngữ." },
          { q: "The findings challenge the assumption ___ higher pay always leads to higher productivity.", answers: ["that"], hint: "assumption + that + mệnh đề đủ → đồng vị." },
          { q: "Several firms moved their offices out of the centre, ___ reducing their rent by half.", answers: ["thereby", "thus"], hint: "thereby / thus + V-ing: kết quả." },
          { q: "It is not yet known ___ the vaccine offers lasting protection or wears off within a year.", answers: ["whether"], hint: "whether … or …" },
          { q: "The degree to ___ children benefit from homework varies with age.", answers: ["which"], hint: "the degree to which." },
          { q: "Sales fell by a third, ___ explains why the company closed two of its stores.", answers: ["which"], hint: ", which + V số ít: bình luận cả ý trước." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Năm lỗi của câu nhiều tầng — bảng soát" },
      {
        t: "table",
        head: ["Lỗi", "Câu sai", "Câu đúng", "Cách soát"],
        rows: [
          ["① Thiếu động từ chính", "~~The policy, which was introduced in 2020 and affecting small firms.~~", "The policy, which was introduced in 2020, **affects** small firms.", "che tầng"],
          ["② Chủ – vị xa nhau", "~~The number of students who take part in exchange programmes **have** risen.~~", "The number of students who take part in exchange programmes **has** risen.", "tìm danh từ chính (Ngày 3 mục 2)"],
          ["③ Chủ ngữ treo", "~~Having reviewed the evidence, the conclusion was clear.~~", "Having reviewed the evidence, **the panel** reached a clear conclusion.", "hỏi “ai làm phân từ?”"],
          ["④ which mơ hồ", "~~The council closed the library near the school, which angered parents.~~ (thư viện? trường? hay việc đóng cửa?)", "The council's **decision to close** the library near the school angered parents.", "which chỉ danh từ sát trước hay cả ý?"],
          ["⑤ that… and that… lệch", "~~The study shows that sleep improves memory and people who sleep less making more errors.~~", "The study shows **that** sleep improves memory **and that** people who sleep less make more errors.", "sau and lặp lại that + S + V"],
        ],
        caption: "Năm lỗi — đọc lại mỗi câu dài với năm câu hỏi này",
      },
      {
        t: "mcq",
        id: "t5d5-nam-loi",
        title: "Câu nào KHÔNG có lỗi? (6 câu)",
        items: [
          { q: "1.", options: ["Having compared the two methods, the cheaper one was chosen.", "Having compared the two methods, the team chose the cheaper one.", "Having compared the two methods, it was decided to choose the cheaper one.", "Comparing the two methods, the cheaper one was the choice."], correct: 1, why: "Người so sánh là the team → chủ ngữ mệnh đề chính phải là the team. Ba câu còn lại treo chủ ngữ (the cheaper one / it không so sánh gì cả)." },
          { q: "2.", options: ["The list of measures that the government has announced are long.", "The list of measures which the government has announced them is long.", "The list of measures that the government has announced is long.", "The list of measures the government has announcing is long."], correct: 2, why: "Danh từ chính là list (số ít) → is. B thừa them. D rút gọn sai (đại từ quan hệ là tân ngữ, không rút được thành V-ing)." },
          { q: "3.", options: ["What the survey reveals are that trust has fallen.", "What the survey reveals is that trust has fallen.", "What does the survey reveal is that trust has fallen.", "What the survey reveals that trust has fallen."], correct: 1, why: "What-clause làm chủ ngữ → is; trật tự câu kể (không does); cần đủ is + that." },
          { q: "4.", options: ["The extent which technology replaces workers is disputed.", "The extent that technology replaces workers is disputed.", "The extent to that technology replaces workers is disputed.", "The extent to which technology replaces workers is disputed."], correct: 3, why: "the extent to which. Sau giới từ không dùng that." },
          { q: "5.", options: ["The report argues that cities should invest in trams and that fares should be capped.", "The report argues that cities should invest in trams and fares being capped.", "The report argues that cities should invest in trams and to cap fares.", "The report argues cities should invest in trams, and capping fares."], correct: 0, why: "Song song: that + S + V … and that + S + V. Ba câu kia ghép hai dạng khác nhau sau and." },
          { q: "6.", options: ["The scheme, launching in 2018 and has since been copied elsewhere.", "The scheme, which launched in 2018, and has since been copied elsewhere.", "The scheme, launched in 2018, has since been copied elsewhere.", "The scheme which launched in 2018, has since been copied elsewhere."], correct: 2, why: "Che tầng: “The scheme has since been copied elsewhere.” ✓. A và B không có động từ chính; D thiếu một dấu phẩy (không xác định cần hai phẩy, xác định thì không phẩy nào)." },
        ],
      },
      { t: "rule", formula: "Soát câu dài: ① che tầng còn S + V?  ② N chính số ít / nhiều?  ③ ai làm V-ing?  ④ which chỉ gì?  ⑤ that … and that …", vi: "Năm câu hỏi, mỗi câu dài tốn 10 giây — đây là lượt soát “câu phức” trong bảng tự soát 6 lượt." },

      /* ── 8 ── */
      { t: "h", text: "8. Khi nào tách — một đoạn band 7 và chính nó ở band 8" },
      {
        t: "p",
        text: "Cùng một nội dung, hai bản. Đọc bản band 7 trước, tự gạch chỗ thấy “nối ngang”, rồi mới đọc bản band 8.",
      },
      {
        t: "passage",
        title: "Đoạn band 7 (ước tính) — 87 từ",
        paras: [
          { text: "Many governments now pay parents to keep their children in school and this policy is popular, but it has some problems. Some families take the money and their children still miss lessons because nobody checks attendance. Also, the payments are quite small, so they do not replace the money that a child can earn, and for this reason poor families which live in rural areas often ignore the scheme. I think the scheme can work, but the government must check attendance and it must increase the payments." },
        ],
      },
      {
        t: "passage",
        title: "Đoạn band 8 (ước tính) — 93 từ",
        paras: [
          { text: "Paying parents to keep their children in school, a policy now adopted by many governments, is popular but flawed. Where attendance is not monitored, families can accept the money while their children continue to miss lessons. A deeper problem is that the payments, being small, rarely match what a working child would earn, which explains why the rural poor, who depend most on that income, tend to ignore the scheme. It can work. What it requires is that attendance be checked and that the sum offered reflect what a family actually gives up." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bản band 7", "Bản band 8"],
        rows: [
          ["**TR**", "nêu vấn đề, giải pháp chung chung (“increase the payments”)", "nói rõ cơ chế: tiền hỗ trợ thấp hơn thu nhập của trẻ đi làm; giải pháp gắn đúng cơ chế đó"],
          ["**CC**", "and · but · because · also · so · for this reason — 10 lần nối ngang trong 4 câu", "liên kết bằng cấu trúc: A deeper problem is that… · which explains why… · It can work."],
          ["**LR**", "has some problems · quite small · check", "flawed · monitored · match · depend on that income · gives up"],
          ["**GRA**", "4 câu dài đều nhau, toàn mệnh đề ngang hàng; 1 lỗi nhỏ: families **which** (→ who / that)", "5 câu: 1 câu ba tầng (danh ngữ + phân từ + which + who), 1 câu bốn chữ, subjunctive (be checked · reflect); 0 lỗi"],
        ],
        caption: "Bốn tiêu chí — vì sao bản dưới cao hơn một band",
      },
      {
        t: "note",
        title: "💡 Ba điều rút ra",
        items: [
          "Bản band 8 chỉ có **một** câu ba tầng. Câu “It can work.” dài ba từ — ==câu ngắn sau câu dài== là nhịp của người viết giỏi.",
          "Câu ba tầng được dùng ở chỗ ý **thật sự có tầng**: vấn đề → lý do → hệ quả → nhóm chịu ảnh hưởng. Đừng lồng tầng cho ý đơn giản.",
          "Phép thử tách: đọc to một hơi. Hết hơi trước khi tới dấu chấm, hoặc phải đọc lại mới hiểu → tách làm hai.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (14 câu)" },
      {
        t: "mcq",
        id: "t5d5-np-chon",
        title: "Chọn phương án đúng (8 câu)",
        items: [
          { q: "1. The city centre has been closed to cars, ___ has cut noise levels by half.", options: ["what", "that", "which", "it"], correct: 2, why: "Bình luận cả ý trước, có phẩy → which. that không đứng sau dấu phẩy; it tạo comma splice." },
          { q: "2. ___ in three languages, the leaflet reached almost every household.", options: ["Printing", "Printed", "Having printed", "To print"], correct: 1, why: "Tờ rơi ĐƯỢC in → V3." },
          { q: "3. The belief ___ talent is fixed at birth has been widely challenged.", options: ["which", "what", "that", "whether"], correct: 2, why: "belief + that + mệnh đề đủ (talent is fixed at birth) → đồng vị. which không dùng được." },
          { q: "4. The trial involved 900 patients, a third of ___ received a placebo.", options: ["them", "which", "who", "whom"], correct: 3, why: "of + whom. them tạo comma splice." },
          { q: "5. ___ the programme succeeds will depend largely on local teachers.", options: ["If", "Whether", "That", "What"], correct: 1, why: "Mệnh đề danh ngữ làm chủ ngữ với nghĩa “có … hay không” → Whether (If không đứng đầu làm chủ ngữ)." },
          { q: "6. Unemployment rose to 12%, ___ the government to extend benefits.", options: ["prompted", "prompting", "which prompting", "and prompting"], correct: 1, why: "Kết quả → V-ing cuối câu. (which prompted cũng đúng nhưng không có trong lựa chọn.)" },
          { q: "7. Nobody could explain why ___ so sharply.", options: ["did sales fall", "sales did fall", "sales had fallen", "had sales fallen"], correct: 2, why: "Trật tự câu kể sau why: S + V." },
          { q: "8. The buildings ___ after the earthquake were designed to stricter standards.", options: ["constructing", "which constructed", "constructed", "were constructed"], correct: 2, why: "which were constructed → rút gọn bị động → constructed. Động từ chính là were designed." },
        ],
      },
      {
        t: "quiz",
        id: "t5d5-np-sua",
        kind: "fill",
        title: "Mỗi câu một lỗi — gõ lại phần [trong ngoặc] cho đúng (6 câu)",
        items: [
          { q: "The reason for the delay [is because] the funding was approved late.", answers: ["is that"], hint: "The reason is that…" },
          { q: "Having interviewed forty residents, [the results showed] strong opposition to the plan.", answers: ["the researchers found", "the team found", "the researchers recorded", "the researchers discovered"], hint: "Ai phỏng vấn? — người nghiên cứu, không phải results." },
          { q: "What matters most to voters [are] jobs and housing.", answers: ["is"], hint: "What-clause làm chủ ngữ → số ít." },
          { q: "The firm recruited fifty graduates, [most of them] left within a year.", answers: ["most of whom"], hint: "Hai mệnh đề nối bằng dấu phẩy → cần đại từ quan hệ." },
          { q: "[Despite that] the law was changed in 2015, little has improved.", answers: ["Despite the fact that", "Although", "Even though", "Though"], hint: "despite + N / the fact that; hoặc although + mệnh đề." },
          { q: "The number of households that own two or more cars [have doubled] since 2000.", answers: ["has doubled"], hint: "Danh từ chính: The number → số ít." },
        ],
      },
      {
        t: "note",
        title: "Sau bài này — việc phải làm với Sổ lỗi",
        items: [
          "Mở bài Task 2 gần nhất của bạn. Tìm **3 câu nối ngang** dài nhất (and / but / so từ hai lần trở lên) và viết lại mỗi câu thành câu hai tầng.",
          "Đọc năm câu hỏi của mục 7 cho từng câu dài trong bài. Lỗi nào xuất hiện từ hai lần → ghi vào Sổ lỗi thành “quy tắc của tôi” (Ngày 3 mục 7).",
          "Bài tập Ngày 5 phần IX: viết một thân bài có đúng **hai** câu ba tầng — không hơn.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d5-doc",
    kind: "reading",
    title: "Đọc: Matching headings 4 — bài trừu tượng, tiêu đề nói chức năng lập luận của đoạn",
    goal: "Ghép đúng 7–8/8 tiêu đề cho một bài lập luận trừu tượng khoảng 1.000 từ trong 10 phút, khi tiêu đề không tả NỘI DUNG mà tả VIỆC đoạn văn làm trong lập luận (đề xuất, phản bác, bằng chứng, nhượng bộ, hệ quả); làm trọn 13 câu trong 18 phút.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Reading 7.5 → 8**: Matching headings ở Passage 3 là dạng người band 7 hay mất 2–3 câu nhất — đủ để rơi từ 36 xuống 33.",
          "Nối **Tập 4 Ngày 3** (tiêu đề nói bằng ý ẩn). Hôm nay thêm một bậc: tiêu đề nói ==chức năng lập luận== — “A defence of…, with one condition”, “Experimental support for…”.",
          "Bài trừu tượng không có nhân vật, không có trình tự thời gian để bám. Thứ để bám là **đường đi của lập luận**: ai nói gì → ai phản bác → bằng chứng → hệ quả → kết.",
          "Cách làm: đọc **một lượt**, ghi ở lề mỗi đoạn hai thứ — ==đoạn nói về gì== và ==đoạn làm việc gì== — rồi mới nhìn danh sách tiêu đề.",
          "Ba bẫy band 8: tiêu đề đúng **một nửa** · tiêu đề đúng cho **một câu** trong đoạn · tiêu đề nói **ngược hướng** kết luận của đoạn.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Headings band 8 khác band 7 ở đâu" },
      {
        t: "table",
        head: ["", "Tập 4 Ngày 3 (band 7)", "Hôm nay (band 8)"],
        rows: [
          ["Tiêu đề tả gì", "nội dung của đoạn, bằng từ khác (ý ẩn)", "VIỆC đoạn làm trong lập luận + nội dung, bằng từ trừu tượng"],
          ["Ví dụ", "“A feeling once treated as an illness”", "“Experimental support for an idea first reached by reflection”"],
          ["Bài đọc", "có mốc thời gian, tên người để bám", "khái niệm; ví dụ chỉ là minh hoạ, không phải ý chính"],
          ["Bẫy chính", "tiêu đề lặp một từ của đoạn", "tiêu đề đúng với ví dụ nhưng sai với điều ví dụ chứng minh"],
          ["Thời gian", "8 câu / 12 phút", "8 câu / 10 phút, đọc một lượt"],
        ],
        caption: "Matching headings — từ band 7 lên band 8",
      },
      {
        t: "table",
        head: ["Từ trong tiêu đề", "Đoạn đó đang làm gì", "Tín hiệu trong đoạn"],
        rows: [
          ["a proposal / suggestion / claim that…", "đưa ra một ý mới", "It was X who suggested… · on this view…"],
          ["an objection to / a challenge to…", "phản bác ý trước", "Yet… · however · rested on a mistake"],
          ["support / evidence for…", "đưa bằng chứng", "set out to test · found · the results…"],
          ["a defence of…, with a condition / reservation", "bênh vực nhưng có giới hạn", "It would be a mistake to conclude… · The error lies not in… but in…"],
          ["an application / a consequence of…", "đem ý ra thực tế", "None of this would matter if… · In practice…"],
          ["a more realistic / modest aim", "kết: hạ kỳ vọng, đề xuất cách làm", "The practical lesson… · It is more productive to…"],
        ],
        caption: "Sáu “động từ lập luận” hay gặp trong tiêu đề band 8",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Quy trình — ghi lề hai thứ rồi mới nhìn tiêu đề" },
      {
        t: "sodo",
        kind: "flow",
        title: "Matching headings band 8 — 10 phút",
        steps: [
          { label: "30 giây", sub: "Lướt danh sách tiêu đề một lần để biết bài bàn về gì. CHƯA ghép." },
          { label: "6 phút — đọc một lượt", sub: "Sau mỗi đoạn, ghi lề: “nói về gì” (2–3 chữ) + “làm gì” (đề xuất / phản bác / bằng chứng / áp dụng / nhượng bộ / kết)." },
          { label: "2,5 phút — ghép", sub: "Ghép theo ghi chú lề. Đoạn nào có hai ứng viên: đọc lại CÂU CUỐI của đoạn — hướng kết luận quyết định." },
          { label: "1 phút — soát", sub: "Mỗi tiêu đề dùng một lần. Tiêu đề thừa có “bẫy” cho đoạn nào? Nói được thì yên tâm." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận — ba bẫy của tiêu đề band 8",
        items: [
          "**Đúng một nửa**: “How new evidence finally settled a scientific question” — đoạn có new evidence, có scientific question, nhưng không có settled. Một chữ sai là cả tiêu đề sai.",
          "**Đúng cho một câu**: đoạn mở bằng một ví dụ sinh động (con gà bị vặt lông, quả cà chua). Tiêu đề về ví dụ đó gần như luôn là bẫy; tiêu đề đúng nói điều ví dụ ==chứng minh==.",
          "**Ngược hướng**: đoạn mở “It would be a mistake to conclude that X” → tiêu đề nói X là bẫy; đoạn đang bác X.",
        ],
      },
      { t: "rule", formula: "ghi lề = nói về gì + làm gì   →   ghép theo lề   →   hai ứng viên thì đọc câu cuối đoạn", vi: "Tiêu đề band 8 = chức năng lập luận + nội dung. Thiếu một trong hai là bẫy." },

      /* ── 3 ── */
      { t: "h", text: "3. Khởi động — ba đoạn ngắn, tiêu đề chức năng" },
      {
        t: "mcq",
        id: "t5d5-doc-khoi-dong",
        title: "Chọn tiêu đề đúng cho mỗi đoạn (3 câu · 3 phút)",
        items: [
          {
            q: "1. “It is tempting to treat a map as a small copy of the land. Yet a copy that left nothing out would be as large as the territory and exactly as hard to use. What makes a map valuable is precisely what it omits: the decision that, for this traveller and this journey, most of the world can safely be ignored.”",
            options: ["A  How maps have become more accurate over time", "B  An apparent weakness reinterpreted as a strength", "C  The difficulty of making a complete map", "D  Why travellers should not rely on maps"],
            correct: 1,
            why: "Đoạn làm việc “đảo lại”: bỏ sót (tưởng là điểm yếu) hoá ra là giá trị (What makes a map valuable is precisely what it omits). C chỉ đúng cho câu thứ hai. A, D không có trong đoạn.",
          },
          {
            q: "2. “Critics of standardised testing point out, correctly, that a single score cannot capture what a child knows. But the alternative usually proposed, the judgement of the class teacher, has been shown to vary with the child's manners, handwriting and family background. The test is a crude instrument; it is not obvious that its replacements are finer ones.”",
            options: ["A  A criticism accepted, but its usual remedy questioned", "B  The case for abolishing standardised tests", "C  Evidence that teachers are biased against poorer pupils", "D  Why test scores are more accurate than critics claim"],
            correct: 0,
            why: "Câu 1 nhận lời phê bình (correctly); câu 2–3 nghi ngờ giải pháp thay thế. B ngược hướng. C đúng một nửa và chỉ cho một câu (bài không nói biased against poorer). D sai: tác giả gọi test là crude.",
          },
          {
            q: "3. “For most of the last century, economists assumed that people given more information would choose better. Studies of pension plans suggest otherwise: employees offered dozens of funds were less likely to join any scheme at all than those offered a handful. The assumption survives in policy long after the evidence turned against it.”",
            options: ["A  The benefits of offering employees more choice", "B  How pension schemes were reformed", "C  A long-held assumption that findings have undermined but not removed", "D  New evidence that has changed government policy"],
            correct: 2,
            why: "assumed → suggest otherwise → the assumption survives. C phủ đủ ba bước. D ngược hướng câu cuối (chính sách CHƯA đổi). A ngược với bằng chứng.",
          },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — 18 phút, Questions 1–13" },
      {
        t: "p",
        text: "Bấm giờ **18 phút** cho cả 13 câu (10 phút cho Questions 1–8). Đọc **một lượt**, ghi lề hai thứ cho mỗi đoạn. Không tra từ.",
      },
      {
        t: "passage",
        title: "The Trouble with Definitions",
        paras: [
          { label: "A", text: "Ask a room of educated adults whether they know what a game is and every hand will go up. Ask them to say what a game is, in a form of words that takes in chess, hide-and-seek, solitaire and the Olympic marathon while leaving out a job interview or a military exercise, and the hands come down again. The difficulty is not ignorance: nobody in the room would hesitate over a particular case. It is that the ability to use a word correctly and the ability to state the rule one is following turn out to be quite separate accomplishments, and the second is far rarer than we tend to suppose." },
          { label: "B", text: "The assumption that the two must go together is very old. In the dialogues of Plato, Socrates repeatedly asks his companions what courage, or justice, or piety is, and rejects every answer that merely lists examples. What he wants is the single feature that all instances share and that nothing else possesses. The companions invariably fail, and the conversations tend to break off without a result. A story preserved by a much later writer has the philosopher Diogenes responding to one proposed definition of a human being, a featherless creature that walks on two legs, by producing a plucked chicken. Whether or not the incident took place, it captures the pattern exactly: a definition is offered, a counter-example is found, a clause is added to exclude it, and the whole business begins again." },
          { label: "C", text: "For some two thousand years this was regarded as a temporary embarrassment; sooner or later, with enough care, the right formula would be found. It was Ludwig Wittgenstein, in a work published in 1953, two years after his death, who suggested that the search itself rested on a mistake. Consider, he invited his readers, the activities we call games. Some involve competition, but not all; some demand skill, others only luck; some are amusing, while others are played in grim earnest. Look closely and one finds no thread running through the whole, only a web of overlapping likenesses of the kind that links the members of a family, where a nose is shared by some, a way of walking by others, and no single trait by all. A category, on this view, can be perfectly usable without having edges." },
          { label: "D", text: "What Wittgenstein asserted from the armchair, the psychologist Eleanor Rosch set out to test in the 1970s. If categories were governed by definitions, everything that satisfied the definition ought to belong equally: a penguin is no less a bird than a robin. Yet when Rosch asked people to rate how good an example of a category various items were, their judgements were remarkably consistent and anything but level. Robins were rated excellent birds; penguins and ostriches poor ones. More tellingly, the ratings predicted behaviour: asked to confirm that a statement such as ‘A robin is a bird’ was true, participants in experiments of this kind answered measurably faster than they did for the less typical cases. Categories, Rosch concluded, are organised around a prototype, a kind of best example, and membership is a matter of how closely a thing resembles it." },
          { label: "E", text: "None of this would matter much if definitions were needed only in seminar rooms. But law, taxation and administration cannot operate with blurred edges; they must sort every case into one box or another, and they must do so in advance. The results can be instructive. In 1893 the Supreme Court of the United States was asked to decide whether the tomato was a fruit or a vegetable, the answer determining whether an importer owed a tariff that applied to vegetables alone. The court accepted that botanists class the tomato as a fruit, and then ruled that for the purposes of the tariff it was a vegetable, since that is how those who buy, sell and cook it ordinarily speak. The judgement is sometimes mocked, but it was arguably wiser than its critics: it recognised that the question of what a tomato is has no answer until one asks what the classification is for." },
          { label: "F", text: "Science might be expected to do better, yet its categories turn out to be negotiated in much the same way. When, in August 2006, the International Astronomical Union voted on a formal definition of ‘planet’, it did so not because some observation had revealed what planets really are, but because the detection of at least one distant body rivalling Pluto in size had made the old, undefined usage unworkable: either the list of planets would grow, perhaps without limit, or a line would have to be drawn. The definition adopted required, among other things, that a planet have cleared the neighbourhood of its orbit of other objects, a criterion which Pluto fails and which a number of astronomers continue to regard as vague. What was announced as a finding about the solar system was, more accurately, a decision about how a word would henceforth be used." },
          { label: "G", text: "It would be a mistake, however, to conclude from such cases that definitions are arbitrary or that the demand for them is naive. A stipulated definition, one that announces how a term will be used instead of claiming to report what it has always meant, is an indispensable instrument. A clinical trial cannot proceed until ‘recovery’ has been fixed; a contract is worthless if ‘delivery’ is left to intuition. The error lies not in drawing lines but in forgetting that they were drawn, and so mistaking a convenient boundary for a feature of the world. Many disputes that present themselves as disagreements about facts, such as whether a virus is alive or whether a particular object is art, dissolve, or at least change character, once the parties notice that they are using one word under two different rules." },
          { label: "H", text: "The practical lesson is a modest one. When asked to define a term, it is rarely useful to hunt for the formula that will survive every counter-example; the history of the attempt suggests there may be none. It is more productive to ask what work the definition is required to do, to settle the central cases, and to state openly how the doubtful ones will be treated and why. That is less satisfying than the answer Socrates wanted. It has the advantage of being achievable, and of making the raised hands with which we began look less like a failure of knowledge than like evidence of a different kind of knowing." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–8** — The passage has eight paragraphs, **A–H**. Choose the correct heading for each paragraph from the list of headings below. Write the correct number, **i–xi**.",
      },
      {
        t: "table",
        head: ["", "List of Headings"],
        rows: [
          ["i", "The case for abandoning definitions altogether"],
          ["ii", "An unending cycle of proposal and objection"],
          ["iii", "A ruling that put purpose before scientific accuracy"],
          ["iv", "How new evidence finally settled a scientific question"],
          ["v", "A gap between using a word and explaining it"],
          ["vi", "Experimental support for an idea first reached by reflection"],
          ["vii", "The suggestion that no shared essence need exist"],
          ["viii", "Classification as a choice presented as a discovery"],
          ["ix", "A defence of drawing boundaries, with one condition"],
          ["x", "Why experts define terms better than the public"],
          ["xi", "A more realistic aim for those who must define"],
        ],
      },
      {
        t: "quiz",
        id: "t5d5-doc-tieu-de",
        kind: "fill",
        title: "Questions 1–8 — ghi số La Mã (i–xi)",
        items: [
          { q: "1. Paragraph A", answers: ["v"], hint: "“the ability to use a word correctly and the ability to state the rule… quite separate accomplishments” → a gap between using and explaining." },
          { q: "2. Paragraph B", answers: ["ii"], hint: "Câu cuối: “a definition is offered, a counter-example is found, a clause is added… and the whole business begins again” → unending cycle of proposal and objection." },
          { q: "3. Paragraph C", answers: ["vii"], hint: "“the search itself rested on a mistake… no thread running through the whole… usable without having edges” → no shared essence need exist. suggested = The suggestion." },
          { q: "4. Paragraph D", answers: ["vi"], hint: "“What Wittgenstein asserted from the armchair (= by reflection), … Rosch set out to test” → experimental support." },
          { q: "5. Paragraph E", answers: ["iii"], hint: "Toà nhận botanists nói fruit, vẫn xử là vegetable “for the purposes of the tariff” → purpose before scientific accuracy. x là bẫy: bài không nói ai định nghĩa giỏi hơn." },
          { q: "6. Paragraph F", answers: ["viii"], hint: "Câu cuối: “What was announced as a finding… was, more accurately, a decision” → a choice presented as a discovery. iv là bẫy đúng một nửa: không có gì được “settled”, tiêu chí vẫn bị coi là vague." },
          { q: "7. Paragraph G", answers: ["ix"], hint: "“It would be a mistake to conclude… definitions are arbitrary” (bênh vực) + “The error lies not in drawing lines but in forgetting that they were drawn” (điều kiện). i ngược hướng." },
          { q: "8. Paragraph H", answers: ["xi"], hint: "“The practical lesson is a modest one… It is more productive to ask what work the definition is required to do… achievable” → a more realistic aim." },
        ],
      },
      {
        t: "p",
        text: "**Questions 9–12** — Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer.",
      },
      {
        t: "note",
        title: "Testing the classical view of categories",
        items: [
          "If a category were fixed by a definition, every item meeting that definition should belong to it **9** ___ .",
          "When Rosch asked people to judge examples, however, their ratings turned out to be highly **10** ___ , and far from level.",
          "In related experiments, people confirmed statements about typical examples **11** ___ than statements about unusual ones.",
          "Rosch therefore proposed that each category is built around a **12** ___ , which other members resemble to a greater or lesser degree.",
        ],
      },
      {
        t: "quiz",
        id: "t5d5-doc-tom-tat",
        kind: "fill",
        title: "Questions 9–12 — ONE WORD ONLY from the passage",
        items: [
          { q: "9", answers: ["equally"], hint: "D: “everything that satisfied the definition ought to belong equally”." },
          { q: "10", answers: ["consistent"], hint: "D: “their judgements were remarkably consistent and anything but level”. highly ≈ remarkably." },
          { q: "11", answers: ["faster"], hint: "D: “answered measurably faster than they did for the less typical cases”." },
          { q: "12", answers: ["prototype"], hint: "D: “organised around a prototype, a kind of best example”. Chỉ MỘT từ: không viết “best example”." },
        ],
      },
      { t: "p", text: "**Question 13** — Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t5d5-doc-chon",
        title: "Question 13 — Multiple choice",
        items: [
          {
            q: "13. Which of the following best expresses the writer's overall view?",
            options: [
              "A  Because no definition is ever complete, defining terms is a waste of effort.",
              "B  Scientists and judges should leave definitions to philosophers.",
              "C  Definitions are useful tools provided that their purpose and their limits are kept in view.",
              "D  Modern psychology has finally found the formula that Socrates was looking for.",
            ],
            correct: 2,
            why: "G: “an indispensable instrument… The error lies not in drawing lines but in forgetting that they were drawn”; H: “ask what work the definition is required to do… state openly how the doubtful ones will be treated”. A ngược với G. B không có. D ngược: “there may be none”.",
          },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Chấm điểm và mổ lại — mỗi đoạn làm việc gì" },
      {
        t: "table",
        head: ["Đoạn", "Nói về gì", "Làm gì", "Tiêu đề", "Bẫy"],
        rows: [
          ["A", "game — dùng được, không định nghĩa được", "nêu vấn đề", "v", "—"],
          ["B", "Socrates · Diogenes", "cho thấy cách cũ luôn thất bại theo một vòng lặp", "ii", "tiêu đề về con gà / Plato sẽ là “đúng một câu”"],
          ["C", "Wittgenstein · family resemblance", "đề xuất: việc tìm kiếm tự nó sai", "vii", "—"],
          ["D", "Rosch · robin / penguin", "bằng chứng thực nghiệm cho ý ở C", "vi", "x (experts) — Rosch là chuyên gia nhưng đoạn không so ai với ai"],
          ["E", "tomato · Supreme Court 1893", "áp dụng: luật buộc phải kẻ ranh", "iii", "x — toà theo cách nói của người thường, ngược với x"],
          ["F", "planet · IAU 2006", "khoa học cũng thương lượng như vậy", "viii", "iv — có new evidence nhưng không “settled”"],
          ["G", "stipulated definition", "nhượng bộ: định nghĩa vẫn cần, miễn là nhớ mình đã kẻ ranh", "ix", "i — ngược hướng"],
          ["H", "practical lesson", "kết: mục tiêu khiêm tốn hơn", "xi", "i — “there may be none” nói về công thức hoàn hảo, không phải bỏ định nghĩa"],
        ],
        caption: "Bản đồ lập luận của bài — so với ghi chú lề của bạn",
      },
      {
        t: "table",
        head: ["Tiêu đề", "Trong bài", "Mức paraphrase"],
        rows: [
          ["first reached by reflection", "asserted from the armchair", "4 — ẩn dụ: ngồi ghế bành = suy nghĩ, không làm thí nghiệm"],
          ["no shared essence", "no thread running through the whole", "4 — ẩn dụ"],
          ["put purpose before scientific accuracy", "accepted that botanists class… and then ruled that for the purposes of the tariff…", "3 — đổi cấu trúc"],
          ["a choice presented as a discovery", "What was announced as a finding… was… a decision", "2–3 — đồng nghĩa + đổi loại từ"],
          ["with one condition", "The error lies not in… but in forgetting that they were drawn", "4 — ý ẩn: điều kiện không được gọi tên"],
          ["A more realistic aim", "a modest one… achievable", "2 — đồng nghĩa"],
        ],
        caption: "Bảng paraphrase — sáu chỗ khó nhất",
      },
      {
        t: "note",
        title: "📌 Thang điểm của bài này",
        items: [
          "**12–13/13 trong 18 phút**: đúng nhịp band 8.",
          "**10–11**: xem bạn sai ở tiêu đề hay ở tóm tắt. Sai iv / viii hoặc i / ix → bạn đang ghép theo NỘI DUNG, chưa theo HƯỚNG kết luận: luyện lại mục 2.",
          "**Dưới 10** hoặc quá 20 phút: làm lại bài Tập 4 Ngày 3 trước, rồi quay lại sau hai ngày.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Soi lại bài đọc bằng ngữ pháp Bài 1" },
      {
        t: "p",
        text: "Bài đọc dùng đúng ba tầng bạn vừa học. Gập bài lại, điền từ còn thiếu — rồi mở bài kiểm tra.",
      },
      {
        t: "quiz",
        id: "t5d5-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "(D) ___ Wittgenstein asserted from the armchair, the psychologist Eleanor Rosch set out to test in the 1970s.", answers: ["What"], hint: "What-clause làm TÂN NGỮ được đưa lên đầu câu (fronting) để nối với đoạn trước." },
          { q: "(F) …a criterion ___ Pluto fails and which a number of astronomers continue to regard as vague.", answers: ["which"], hint: "Hai mệnh đề quan hệ song song: which … and which …" },
          { q: "(E) …whether the tomato was a fruit or a vegetable, the answer ___ whether an importer owed a tariff… (dạng của determine)", answers: ["determining"], hint: "Absolute clause: danh từ riêng (the answer) + V-ing. Tập 4 Ngày 5 mục 8." },
          { q: "(B) ___ or not the incident took place, it captures the pattern exactly.", answers: ["Whether"], hint: "Whether or not… = dù có hay không." },
          { q: "(C) It was Ludwig Wittgenstein… ___ suggested that the search itself rested on a mistake.", answers: ["who"], hint: "Câu chẻ: It was X who… (Tập 4 Ngày 7)." },
          { q: "(F) The definition adopted required… that a planet ___ cleared the neighbourhood of its orbit. (một từ)", answers: ["have"], hint: "Subjunctive sau required that: động từ nguyên mẫu — have, không phải has." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "counter-example", pos: "n", ipa: "/ˈkaʊntər ɪɡˌzɑːmpl/", vi: "phản ví dụ", ex: "One counter-example is enough to defeat a universal claim.", exVi: "Một phản ví dụ là đủ để bác một nhận định phổ quát.", more: "find / offer / survive a counter-example" },
          { w: "accomplishment", pos: "n", ipa: "/əˈkʌmplɪʃmənt/", vi: "việc làm được, thành tựu; kỹ năng đã thành thạo", ex: "Speaking a language and explaining its grammar are separate accomplishments.", exVi: "Nói được một ngôn ngữ và giải thích ngữ pháp của nó là hai năng lực khác nhau.", more: "no small accomplishment · accomplish (v) · accomplished (adj): điêu luyện" },
          { w: "likeness", pos: "n", ipa: "/ˈlaɪknəs/", vi: "nét giống nhau, sự giống", ex: "There is a strong family likeness between the two proposals.", exVi: "Hai đề xuất giống nhau như người một nhà.", more: "a family likeness · bear a likeness to · trong bài: a web of overlapping likenesses (đoạn C)" },
          { w: "from the armchair", pos: "phr", ipa: "/frəm ði ˈɑːmtʃeə/", vi: "(suy luận) tại chỗ, không qua thực nghiệm", ex: "The theory was developed from the armchair and never tested.", exVi: "Lý thuyết được nghĩ ra tại bàn giấy và chưa bao giờ được kiểm chứng.", more: "armchair critic / armchair theorising — hàm ý hơi chê" },
          { w: "tellingly", pos: "adv", ipa: "/ˈtelɪŋli/", vi: "đáng nói là (chi tiết này tiết lộ nhiều)", ex: "Tellingly, none of the directors use the product themselves.", exVi: "Đáng nói là không giám đốc nào tự dùng sản phẩm.", more: "More tellingly, … · a telling detail" },
          { w: "unworkable", pos: "adj", ipa: "/ʌnˈwɜːkəbl/", vi: "không thể thực hiện / vận hành được", ex: "Critics dismissed the plan as unworkable.", exVi: "Giới phê bình gạt kế hoạch đi vì cho là không khả thi.", more: "prove / become unworkable · trái nghĩa: workable (a workable solution)" },
          { w: "stipulate", pos: "v", ipa: "/ˈstɪpjuleɪt/", vi: "quy định rõ, đặt ra (điều kiện, cách hiểu)", ex: "The contract stipulates that payment be made within thirty days.", exVi: "Hợp đồng quy định việc thanh toán phải thực hiện trong ba mươi ngày.", more: "stipulate that + subjunctive · a stipulated definition · stipulation (n)" },
          { w: "satisfy", pos: "v", ipa: "/ˈsætɪsfaɪ/", vi: "(học thuật) đáp ứng, thoả (một điều kiện, tiêu chí)", ex: "Only three of the applicants satisfied all the criteria.", exVi: "Chỉ ba ứng viên đáp ứng đủ mọi tiêu chí.", more: "satisfy a condition / a requirement / the definition · trong bài: everything that satisfied the definition (đoạn D) · ⚠️ không chỉ là “làm hài lòng”" },
          { w: "henceforth", pos: "adv", ipa: "/ˌhensˈfɔːθ/", vi: "từ nay về sau (rất trang trọng)", ex: "The body will henceforth be known as the Regional Health Board.", exVi: "Cơ quan này từ nay sẽ được gọi là Ban Y tế Vùng.", more: "chỉ dùng trong văn bản pháp lý / học thuật; khi nói dùng from now on" },
          { w: "blurred", pos: "adj", ipa: "/blɜːd/", vi: "mờ, nhoè; (ranh giới) không rõ ràng", ex: "The line between work and home has become blurred for many remote workers.", exVi: "Ranh giới giữa công việc và nhà đã trở nên mờ nhoè với nhiều người làm từ xa.", more: "blurred edges / boundaries / distinctions · blur the line between A and B · trong bài: cannot operate with blurred edges (đoạn E)" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d5-nghe",
    kind: "listening",
    title: "Nghe Part 4: bài giảng chuyên sâu 8 phút (giọng Úc) — Note completion 10/10; nối âm chuỗi",
    goal: "Theo trọn một bài giảng Part 4 dài khoảng 8 phút ở tốc độ thật (~175 từ/phút) mà không lạc khỏi dàn ý, điền đúng 9–10/10 câu Note completion dù mỗi đáp án đều có một thông tin nhiễu đứng cạnh; nghe ra các chuỗi nối âm 3–5 từ để không “mất” từ chức năng.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **Listening 35+/40**: Part 4 là 10 câu cuối, không có khoảng nghỉ giữa bài. Người band 7.5 thường mất 2–3 câu ở đây vì ==lạc dàn ý một lần là mất luôn hai câu==.",
          "Nối **Tập 4 Ngày 8** (Part 4 band 7, 6 phút). Hôm nay: **8 phút**, khoảng 1.350 từ, giọng Úc, mật độ thông tin cao hơn.",
          "Kỹ thuật chính: ==đi theo dàn ý của phiếu ghi== — tiêu đề nhỏ trong phiếu là biển báo; người nói đổi phần bằng những câu rất rõ (Right, what goes wrong? · And so to repairs…).",
          "Bẫy band 8 của Part 4: con số bị “đoán hộ” rồi sửa (sixteen minutes → hours), thứ **mọi người tưởng** (sharks, rubber, sound) đứng ngay trước đáp án thật.",
          "🔊 **Nối âm chuỗi**: ba đến năm từ dính liền (a lot of it is ≈ “əlɒtəvɪtɪz”). Không nghe ra chuỗi thì mất từ đứng ngay sau nó — thường chính là đáp án.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao 8 phút khó hơn 6 phút nhiều hơn 2 phút" },
      {
        t: "table",
        head: ["", "Tập 4 Ngày 8 (band 7)", "Hôm nay (band 8)"],
        rows: [
          ["Độ dài · tốc độ", "~6 phút · ~165 từ/phút", "~8 phút · ~175 từ/phút"],
          ["Khoảng cách giữa hai đáp án", "30–40 giây, khá đều", "có chỗ 15 giây, có chỗ 60 giây"],
          ["Thông tin nhiễu", "một nửa số câu có", "câu nào cũng có, thường là “điều mọi người tưởng”"],
          ["Từ trên phiếu", "gần với lời nói", "paraphrase: what is now Malaysia → South-East Asia"],
          ["Chính tả", "từ thường gặp", "có từ dễ viết sai: strait · trench · latex"],
        ],
        caption: "Part 4 — từ band 7 lên band 8",
      },
      {
        t: "note",
        title: "💡 Ba thói quen của người 10/10",
        items: [
          "**45 giây đọc phiếu**: gạch tiêu đề nhỏ, đoán loại từ cho từng chỗ trống (số? danh từ số nhiều? tính từ so sánh?). Chỗ có “than” đứng sau → chắc chắn là so sánh hơn.",
          "**Mắt đi trước tai một câu**: trong lúc nghe câu 34, mắt đã ở câu 35. Nghe thấy từ khoá của 36 mà chưa điền 35 → bỏ 35, không ngoái lại.",
          "**Khoảng lặng 60 giây không có đáp án** là lúc dễ lạc nhất. Giữ ngón tay ở tiêu đề nhỏ đang nghe; người nói đổi phần thì chuyển ngón tay.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Biển báo của bài giảng — nghe ra lúc người nói đổi phần" },
      {
        t: "table",
        head: ["Việc", "Câu báo hiệu hay gặp ở band 8", "Bạn làm gì"],
        rows: [
          ["Mở · nêu dàn ý", "I'll take you through where…, how…, what… and how…", "đối chiếu với các tiêu đề nhỏ trên phiếu"],
          ["Sang phần mới", "Now, jump forward a century. · Right, what goes wrong? · And so to repairs…", "chuyển mắt xuống tiêu đề kế"],
          ["Bác điều tưởng nhầm", "People imagine… In fact… · Whenever I ask a class…, somebody says… But…", "đáp án đứng SAU In fact / But"],
          ["Nhấn chi tiết", "Here's a detail that surprises people: · Here's the catch:", "chuẩn bị viết — đáp án sắp tới"],
          ["Sửa con số", "you might guess… By most accounts it took…", "bỏ số đầu, lấy số sau"],
          ["Hệ quả", "One consequence… is that… · which is why…", "thường là câu cuối của một phần"],
        ],
        caption: "Sáu loại biển báo — không lần nào là “Firstly… Secondly…”",
      },
      { t: "rule", formula: "People imagine / somebody says / you might guess  X   →   In fact / But / By most accounts  Y   ⇒   viết Y", vi: "Ở Part 4 band 8, thứ được nói TRƯỚC thường là điều tưởng nhầm; đáp án đứng sau từ đảo hướng." },

      /* ── 3 ── */
      { t: "h", text: "3. 🔊 Nối âm chuỗi — ba đến năm từ dính liền" },
      {
        t: "p",
        text: "Tập 3 Ngày 3 và Tập 4 Ngày 7 đã dạy từng kiểu nối riêng: phụ âm + nguyên âm, chèn /j/ /w/, /r/ nối. Ở tốc độ thật, các kiểu này ==xảy ra liên tiếp== trong một cụm, và từ chức năng (of, it, is, at, a) co lại thành âm yếu. Kết quả là một “từ dài” mà chính tả không hề có.",
      },
      {
        t: "table",
        head: ["Viết", "Nghe như", "Các mối nối"],
        rows: [
          ["a lot of it is", "ə-lɒ-tə-vɪ-tɪz", "t+o · v+i · t+i (ba lần phụ âm + nguyên âm)"],
          ["not at all", "nɒ-tə-tɔːl", "t+a · t+a"],
          ["go out and do it all again", "gəʊ-waʊ-tən-duː-wɪ-tɔː-lə-gen", "chèn /w/ hai lần · t+a · l+a"],
          ["far out in the ocean", "fɑː-raʊ-tɪn-ði-jəʊ-ʃn", "/r/ nối · t+i · chèn /j/"],
          ["three of us saw it", "θriː-jə-vəs-sɔː-rɪt", "chèn /j/ · v+u · /r/ chêm (saw it) — giọng Anh, Úc, New Zealand"],
        ],
        caption: "Năm chuỗi mẫu — đọc cột giữa thành một hơi",
      },
      {
        t: "phatam",
        id: "t5d5-phat-am",
        title: "Luyện phát âm — nối âm chuỗi: nói liền một hơi, không ngắt giữa các từ",
        note: "Đọc chậm một lần để thấy các mối nối, rồi đọc ở tốc độ nói thường. Máy chấm từng âm; phần nối bạn tự nghe lại bản ghi của mình.",
        items: [
          { text: "It's almost entirely wrong.", ipa: "ɪts ɔːlməʊst ɪntaɪəli rɒŋ", vi: "Điều đó gần như sai hoàn toàn. (almost‿entirely: t + i)" },
          { text: "A lot of it is out of our hands.", ipa: "ə lɒt əv ɪt ɪz aʊt əv aʊə hændz", vi: "Phần lớn chuyện đó nằm ngoài tầm tay ta. (năm mối nối liên tiếp)" },
          { text: "Soften it in hot water.", ipa: "sɒfn ɪt ɪn hɒt wɔːtə", vi: "Làm mềm nó trong nước nóng. (soften‿it‿in)" },
          { text: "It isn't laid on the bottom at all.", ipa: "ɪt ɪznt leɪd ɒn ðə bɒtəm ət ɔːl", vi: "Nó hoàn toàn không được đặt trên đáy. (laid‿on · bottom‿at‿all)" },
          { text: "Bring one end up and attach it to a buoy.", ipa: "brɪŋ wʌn end ʌp ənd ətætʃ ɪt tu ə bɔɪ", vi: "Kéo một đầu lên rồi buộc nó vào phao. (end‿up‿and‿attach‿it)" },
          { text: "Far out in the ocean there are other issues.", ipa: "fɑːr aʊt ɪn ði əʊʃn ðeər ɑːr ʌðər ɪʃuːz", vi: "Xa ngoài đại dương còn những vấn đề khác. (/r/ nối bốn lần)" },
          { text: "Go out and do it all again.", ipa: "ɡəʊ aʊt ənd duː ɪt ɔːl əɡen", vi: "Ra ngoài và làm lại tất cả. (go‿/w/‿out · do‿/w/‿it)" },
          { text: "Three of us saw it in a week or so.", ipa: "θriː əv ʌs sɔː ɪt ɪn ə wiːk ɔː səʊ", vi: "Ba người chúng tôi thấy nó trong khoảng một tuần. (three‿/j/‿of · saw‿/r/‿it)" },
        ],
      },
      {
        t: "mcq",
        id: "t5d5-nghe-noi-am",
        title: "Nối âm chuỗi — chọn phương án đúng (4 câu)",
        items: [
          { q: "1. Bạn nghe “ə-lɒ-tə-vɪm”. Người nói đã nói:", options: ["a lot of him", "a lot of them", "allotted him", "a lot have him"], correct: 0, why: "of + him: /h/ của him rơi ở tốc độ thật → “əvɪm”. them giữ /ð/ nên nghe “əvðəm”." },
          { q: "2. Trong “do it all again”, giữa do và it người nói chèn âm:", options: ["/j/", "/w/", "/r/", "không chèn gì"], correct: 1, why: "do kết thúc bằng /uː/ (môi tròn) + nguyên âm → chèn /w/. Sau /iː/, /eɪ/, /aɪ/ mới chèn /j/." },
          { q: "3. Giọng Úc đọc “saw it” nghe như “sɔːrɪt”. Điều đó có nghĩa là:", options: ["Người nói đã nói “sore it”", "Chính tả có chữ r bị bạn bỏ sót", "/r/ được chêm vào giữa hai nguyên âm — vẫn là saw it", "Người nói phát âm sai"], correct: 2, why: "/r/ chêm (intrusive r) sau /ɔː/, /ə/, /ɑː/ trước nguyên âm: law‿/r/‿and order, the idea‿/r/‿of. Không viết r." },
          { q: "4. Trên phiếu: “laid on the ___ at all times”. Bạn nghe “bɒ-tə-mə-tɔːl”. Từ cần điền là:", options: ["bottle", "bottom", "button", "bought"], correct: 1, why: "bottom‿at‿all: /m/ nối sang at. Tách chuỗi ở chỗ từ chức năng (at, all) là ra từ nội dung." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động — Practice 1: một đoạn mở bài giảng (giọng Mỹ)" },
      { t: "p", text: "Đọc bốn câu trong **15 giây**, rồi nghe **một lần**. Mỗi đáp án đều có một thứ “mọi người tưởng” đứng trước." },
      {
        t: "listen",
        id: "t5d5-nghe-ngan",
        title: "Practice 1 — The opening of a lecture on a natural resource",
        dan: { so: "Day 5, Recording 1", boiCanh: "the opening of a lecture about a natural resource.", cau: [1, 4] },
        note: "Khoảng 50 giây. Giọng Mỹ (nữ).",
        lines: [
          { who: "Lecturer", voice: "us-nu", text: "Before we get to today's topic, a quick puzzle. What's the natural resource that humans use more of than any other, apart from water? Most people say oil, or maybe timber. It's actually sand. Every pane of glass, every computer chip and, above all, every tonne of concrete starts out as sand." },
          { who: "Lecturer", voice: "us-nu", text: "Now, you'd think that's no problem. Just look at the Sahara. But here's the catch: desert sand is no use to a builder. The wind has rolled those grains around for so long that they're too smooth, and they simply won't lock together. What the construction industry wants is the rough, angular sand you get where water has done the work." },
          { who: "Lecturer", voice: "us-nu", text: "So it isn't dug out of deserts, and less and less of it comes from beaches. Most of it is dredged from rivers, which is why a city built in the middle of a desert may end up importing its sand by ship." },
        ],
      },
      {
        t: "quiz",
        id: "t5d5-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Questions 1–4. ONE WORD ONLY",
        items: [
          { q: "1. The only natural resource used in greater quantities than sand is ___ .", answers: ["water"], hint: "“more of than any other, apart from water”. oil, timber là điều most people say." },
          { q: "2. The most important product made from sand is ___ .", answers: ["concrete"], hint: "“and, above all, every tonne of concrete” — above all = most important. glass, chip được kể trước." },
          { q: "3. Grains of desert sand cannot be used because they are too ___ .", answers: ["smooth"], hint: "“they're too smooth”. rough, angular là loại cát người ta CẦN." },
          { q: "4. Most sand for building is now taken from ___ .", answers: ["rivers"], hint: "“isn't dug out of deserts, and less and less… from beaches. Most of it is dredged from rivers”. Số nhiều." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Part 4, Questions 31–40" },
      {
        t: "p",
        text: "Bạn sẽ nghe một bài giảng về cáp ngầm dưới biển. Có **45 giây** đọc phiếu. Nghe **một lần**, không dừng — khoảng 8 phút. Giảng viên nói giọng Úc.",
      },
      { t: "p", text: "**Questions 31–40:** Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer." },
      {
        t: "table",
        head: ["Cables under the sea"],
        rows: [
          ["**Early cables**"],
          ["• 1858: first transatlantic telegraph cable — one 98-word message took about **31** ___ hours to send"],
          ["• it failed within a month because the **32** ___ applied to it was too high"],
          ["• insulation: gutta-percha, a natural **33** ___ from trees in South-East Asia"],
          ["**Modern cables**"],
          ["• 1988: first transatlantic cable to use optical fibre"],
          ["• in deep water: about as thick as a garden **34** ___"],
          ["• near the coast: steel armour; laid in a **35** ___ made by a plough"],
          ["• repeaters about every 70 km — no batteries: **36** ___ comes from the shore"],
          ["**Faults**"],
          ["• 150–200 a year; about two in three caused by fishing gear and ships' **37** ___"],
          ["• 2006 earthquake near Taiwan — lesson: too many cables ran through one narrow **38** ___"],
          ["**Repairs**"],
          ["• fault located by sending a pulse of **39** ___ along the cable and timing the reflection"],
          ["• both ends raised separately; new section joined in"],
          ["• after a repair the cable is slightly **40** ___ than it was before"],
        ],
      },
      {
        t: "listen",
        id: "t5d5-nghe-bai",
        title: "Part 4 — Lecture: cables under the sea",
        dan: { so: "Day 5, Recording 2", boiCanh: "part of a lecture about the cables that carry communications under the sea.", cau: [31, 40] },
        note: "Khoảng 8 phút, ~175 từ/phút. Giảng viên: giọng Úc (nữ).",
        lines: [
          { who: "Lecturer", voice: "au-nu", text: "Good afternoon, everyone. Last week we looked at satellites, and I suspect most of you left with the impression that when you send a message to a friend overseas, it goes up into space and comes down again. Today I want to correct that impression, because it's almost entirely wrong. Well over ninety per cent of the data that crosses an ocean does so along the sea floor, through cables. So this afternoon I'll take you through where those cables came from, how a modern one is built, what goes wrong with them, and how on earth you fix something lying four kilometres under water." },
          { who: "Lecturer", voice: "au-nu", text: "Let's start in the nineteenth century. The first cable across the Atlantic was completed in August 1858, running from the west of Ireland to Newfoundland. It was a telegraph cable, of course, carrying nothing but pulses of electric current, and it was painfully slow. The first official message, a greeting from Queen Victoria to the American president, was ninety-eight words long. Now, you might guess that took sixteen minutes to transmit. By most accounts it took something like sixteen hours. Even so, the alternative was a ship, which needed around ten days, so the cable was greeted as a miracle." },
          { who: "Lecturer", voice: "au-nu", text: "The miracle lasted less than a month. The signal grew weaker and weaker, and the engineer in charge decided the answer was to push harder, to raise the voltage. That was a serious misjudgement. The insulation broke down and the line went dead. For years people blamed the quality of the copper, or the way the cable had been stored before it was laid, but the inquiry that followed pointed firmly at the voltage. It took until 1866, and a far heavier cable laid by the largest ship then afloat, the Great Eastern, before a lasting connection was made." },
          { who: "Lecturer", voice: "au-nu", text: "What made any of this possible was a material most of you won't have heard of. Ordinary rubber, which was the obvious choice, perishes in sea water. What the early engineers used instead was gutta-percha, a natural latex tapped from trees in what is now Malaysia. Soften it in hot water and you can mould it round a wire; in the cold of the deep sea it sets hard and stays waterproof for decades. Demand for it was so great that the trees came close to being wiped out, which is a reminder that the environmental cost of communication is not a new story." },
          { who: "Lecturer", voice: "au-nu", text: "Now, jump forward a century. Telephone cables replaced telegraph cables in the nineteen-fifties, and then in 1988 came the real revolution: the first transatlantic cable to use optical fibre, strands of glass carrying pulses of light instead of electricity. That single cable could handle about forty thousand telephone calls at once, many times what its copper predecessor had managed. Today there are several hundred fibre cables in service around the world, and a single modern one carries more than the entire network of 1988 could have dreamed of." },
          { who: "Lecturer", voice: "au-nu", text: "So what does one of these cables actually look like? People imagine something enormous, as thick as a tree trunk. In fact, out in the deep ocean, a cable is roughly as thick as a garden hose. At its heart are a few pairs of glass fibres, each no wider than a human hair. Around them you have a copper tube, some steel wire for strength, and a plastic coat. That's it. In deep water nothing more is needed, because nothing much disturbs it." },
          { who: "Lecturer", voice: "au-nu", text: "Closer to land it's a different matter. On the continental shelf the cable has to share the sea bed with fishing boats and shipping, so it's wrapped in extra layers of steel armour, which makes it several times thicker. And wherever the sea floor allows, it isn't laid on the bottom at all. A plough, towed behind the ship, cuts a trench about a metre deep, drops the cable into it, and lets the sediment close over the top. That's done out to depths of a thousand metres or so." },
          { who: "Lecturer", voice: "au-nu", text: "There's one more component I must mention. Light fades as it travels through glass, so every seventy kilometres or so the cable passes through a repeater, which is essentially an amplifier in a pressure-proof case. And here's a detail that surprises people: the repeaters have no batteries. They get their power from the shore. It's fed along that copper tube from the landing stations at each end, at several thousand volts. So although we say the cable carries light, it's also one of the longest power lines on the planet." },
          { who: "Lecturer", voice: "au-nu", text: "Right, what goes wrong? Worldwide there are somewhere between a hundred and fifty and two hundred faults a year, so roughly one every couple of days. Whenever I ask a class what causes them, somebody says sharks. And it's true that in the nineteen-eighties shark bites were found on a few cables. But fish of all kinds account for well under one per cent of faults. Earthquakes and undersea landslides do more damage, though still only a small share. The great majority, roughly two faults in every three, are caused by people: by fishing gear dragged along the bottom, and by ships' anchors. That's precisely why the shallow sections are buried." },
          { who: "Lecturer", voice: "au-nu", text: "Natural events matter less often, but when they strike they strike hard, because they can cut many cables at once. The classic case is December 2006, when an earthquake off the south of Taiwan set off undersea landslides that broke several cables within hours. Internet and telephone traffic across much of East Asia slowed to a crawl, banks and stock markets were affected, and putting things right required eleven ships and took about seven weeks. The lesson the industry drew was about geography: too many cables had been routed through the same narrow strait." },
          { who: "Lecturer", voice: "au-nu", text: "And so to repairs, which I find the most impressive part of the whole business. First you have to find the break. Engineers at the landing station send a pulse of light, not sound, as many people assume, down the fibre, and time how long its reflection takes to come back from the damaged end. That tells them where the fault is to within a few metres. A repair ship then sails to the spot and lowers a hook to drag along the sea bed until it catches the cable. In shallow water a diving robot can do the job, but in the deep ocean the hook is still the standard tool." },
          { who: "Lecturer", voice: "au-nu", text: "Here's the difficulty. A cable lying four kilometres down has no slack in it, so you can't just lift the broken part to the surface. Instead the crew cut it, bring one end up, seal it and attach it to a buoy, then go back for the other end. A fresh length of cable is joined in between, and the joining is done fibre by fibre, in a clean room on the ship, which can take the best part of a day. One consequence, which is obvious once you think about it, is that the repaired cable is always slightly longer than the original, so it's laid back on the bottom in a wide loop. A cable that has been repaired many times wanders across the sea floor like a piece of dropped string." },
          { who: "Lecturer", voice: "au-nu", text: "Let me finish with a question for next week's seminar. For most of their history these cables were owned by groups of telephone companies. In the last ten years or so, a growing share has been paid for by a handful of very large technology firms. I'd like you to think about what that means: for prices, for smaller countries, and for who decides where the next cable comes ashore. Thanks very much." },
        ],
      },
      {
        t: "quiz",
        id: "t5d5-nghe-ghi-chu",
        kind: "fill",
        title: "Questions 31–40 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "31", answers: ["16", "sixteen"], hint: "“you might guess… sixteen minutes… By most accounts it took something like sixteen hours.” 98 là số từ; ten days là tàu thuỷ." },
          { q: "32", answers: ["voltage"], hint: "“to raise the voltage. That was a serious misjudgement… the inquiry… pointed firmly at the voltage.” copper và cách bảo quản là điều people blamed." },
          { q: "33", answers: ["latex"], hint: "“Ordinary rubber… perishes in sea water… gutta-percha, a natural latex tapped from trees in what is now Malaysia” (= South-East Asia)." },
          { q: "34", answers: ["hose"], hint: "“People imagine… as thick as a tree trunk. In fact… roughly as thick as a garden hose.” human hair là sợi quang bên trong." },
          { q: "35", answers: ["trench"], hint: "“A plough… cuts a trench about a metre deep, drops the cable into it”." },
          { q: "36", answers: ["power"], hint: "“the repeaters have no batteries. They get their power from the shore.”" },
          { q: "37", answers: ["anchors"], hint: "“somebody says sharks… But… well under one per cent… by fishing gear dragged along the bottom, and by ships' anchors.” Số nhiều." },
          { q: "38", answers: ["strait"], hint: "“too many cables had been routed through the same narrow strait.” Chính tả: strait (eo biển), không phải straight." },
          { q: "39", answers: ["light"], hint: "“send a pulse of light, not sound, as many people assume, down the fibre”." },
          { q: "40", answers: ["longer"], hint: "“the repaired cable is always slightly longer than the original”. Trên phiếu có than → so sánh hơn." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sau khi nghe — đáp án nằm sau biển báo nào" },
      {
        t: "table",
        head: ["Câu", "Biển báo", "Thông tin nhiễu", "Kiểu bẫy"],
        rows: [
          ["31", "you might guess… By most accounts…", "sixteen minutes · 98 · ten days", "con số được đoán hộ rồi sửa đơn vị"],
          ["32", "That was a serious misjudgement", "copper · stored", "điều người ta đổ lỗi suốt nhiều năm"],
          ["33", "What the early engineers used instead was…", "rubber", "lựa chọn hiển nhiên bị loại"],
          ["34", "People imagine… In fact…", "tree trunk · human hair", "điều tưởng nhầm + chi tiết bên trong"],
          ["35", "it isn't laid on the bottom at all", "—", "nối âm chuỗi che từ trench"],
          ["36", "here's a detail that surprises people:", "batteries", "phủ định trước, đáp án sau"],
          ["37", "somebody says… But…", "sharks · earthquakes", "hai nguyên nhân phụ nói trước nguyên nhân chính"],
          ["38", "The lesson the industry drew was…", "eleven ships · seven weeks", "số liệu hấp dẫn nhưng phiếu hỏi bài học"],
          ["39", "First you have to find the break.", "sound", "chêm “not sound” ngay giữa câu"],
          ["40", "One consequence… is that…", "wide loop", "hệ quả ở cuối phần"],
        ],
        caption: "Mười câu, mười biển báo — nghe lại lần hai và dừng ở từng biển báo",
      },
      {
        t: "note",
        title: "📌 Hai phút kiểm — bản band 8",
        items: [
          "**Chính tả**: voltage · latex · trench · strait · anchors. Sai một chữ là mất câu.",
          "**Số nhiều**: câu 37 có ships' đứng trước → danh từ số nhiều.",
          "**Ngữ pháp của phiếu**: câu 40 có than → longer, không phải long.",
          "9–10/10: đạt. 7–8: nghe lại lần hai, lần này chỉ đánh dấu các biển báo. Dưới 7: làm lại bài Tập 4 Ngày 8 rồi quay lại.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài nghe" },
      {
        t: "vocab",
        items: [
          { w: "greet sth as", pos: "v phr", ipa: "/ɡriːt … æz/", vi: "đón nhận (cái gì) như là…", ex: "The new vaccine was greeted as a breakthrough.", exVi: "Vắc-xin mới được đón nhận như một bước đột phá.", more: "be greeted with enthusiasm / suspicion · trong bài nghe: the cable was greeted as a miracle" },
          { w: "perish", pos: "v", ipa: "/ˈperɪʃ/", vi: "(cao su, vật liệu) mục, hỏng; (người) thiệt mạng", ex: "Rubber seals perish after a few years in sunlight.", exVi: "Gioăng cao su bị mục sau vài năm dưới nắng.", more: "perishable goods: hàng dễ hỏng" },
          { w: "misjudgement", pos: "n", ipa: "/ˌmɪsˈdʒʌdʒmənt/", vi: "sự đánh giá sai", ex: "Cutting the budget proved to be a serious misjudgement.", exVi: "Cắt ngân sách hoá ra là một đánh giá sai nghiêm trọng.", more: "a serious / costly misjudgement · misjudge (v)" },
          { w: "wipe out", pos: "phr v", ipa: "/waɪp aʊt/", vi: "xoá sổ, tiêu diệt hoàn toàn", ex: "Overfishing almost wiped out the local cod population.", exVi: "Đánh bắt quá mức suýt xoá sổ đàn cá tuyết ở địa phương.", more: "be wiped out (bị động) · come close to being wiped out · trong bài nghe: the trees came close to being wiped out" },
          { w: "sediment", pos: "n", ipa: "/ˈsedɪmənt/", vi: "trầm tích, cặn lắng", ex: "The river carries sediment down to the coast.", exVi: "Dòng sông mang trầm tích xuống bờ biển.", more: "sedimentary rock: đá trầm tích — hay gặp ở Part 4 địa chất" },
          { w: "slack", pos: "n / adj", ipa: "/slæk/", vi: "độ chùng; (adj) chùng, lỏng lẻo", ex: "There is very little slack in the hospital's budget.", exVi: "Ngân sách của bệnh viện gần như không còn chỗ co giãn.", more: "take up the slack · slack regulation (quy định lỏng lẻo)" },
          { w: "slow to a crawl", pos: "phr", ipa: "/sləʊ tu ə krɔːl/", vi: "chậm lại như bò", ex: "Traffic slowed to a crawl after the accident.", exVi: "Giao thông chậm lại như bò sau vụ tai nạn.", more: "grind to a halt: dừng hẳn — mạnh hơn một bậc" },
          { w: "the best part of", pos: "phr", ipa: "/ðə best pɑːt əv/", vi: "gần trọn (một khoảng thời gian)", ex: "The repair took the best part of a week.", exVi: "Việc sửa chữa mất gần trọn một tuần.", more: "= most of; hay bị nghe nhầm thành “phần tốt nhất”" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 5 ═══════════════════════════ */
  {
    id: "t5d5-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 5 — câu ba tầng · năm lỗi câu dài · tiêu đề chức năng · bài giảng giọng New Zealand · nối âm chuỗi",
    goal: "Ôn trọn Ngày 5: ghép và sửa câu nhiều tầng không lỗi, dịch năm câu dùng đủ ba tầng, ghép tiêu đề chức năng cho một bài ngắn, nghe một đoạn bài giảng giọng New Zealand và viết một thân bài có đúng hai câu ba tầng.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay",
        items: [
          "**42 câu** có đáp án + 1 đoạn viết AI chấm. Làm một mạch khoảng 60 phút.",
          "Phần I–IV ôn Bài 1 · Phần V ôn Bài 2 · Phần VI–VII ôn Bài 3 · Phần VIII từ vựng của ngày.",
          "Sai từ 3 câu trở lên ở một phần → mở lại đúng mục ghi trong tiêu đề phần đó.",
        ],
      },

      { t: "h", text: "I. Ghép hai câu thành một — điền MỘT từ (8 câu) — ôn Bài 1 mục 3–5" },
      {
        t: "quiz",
        id: "t5d5-bt-ghep",
        kind: "fill",
        title: "I. Điền MỘT từ",
        items: [
          { q: "The city has 40 libraries. Most of them were built before 1950. → The city has 40 libraries, most of ___ were built before 1950.", answers: ["which"], hint: "vật → of which." },
          { q: "The firm lost its biggest client. As a result it had to close. → The firm lost its biggest client, ___ meant that it had to close.", answers: ["which"], hint: ", which + V: bình luận cả ý." },
          { q: "She had worked abroad. So she adapted quickly. → ___ worked abroad, she adapted quickly.", answers: ["Having"], hint: "Having + V3." },
          { q: "People need something. It is affordable housing. → ___ people need is affordable housing.", answers: ["What"], hint: "What-clause làm chủ ngữ." },
          { q: "Wages have risen. Even so, living standards have fallen. → Despite the ___ that wages have risen, living standards have fallen.", answers: ["fact"], hint: "despite the fact that." },
          { q: "Will the tax work? Nobody knows. → Nobody knows ___ the tax will work.", answers: ["whether", "if"], hint: "whether / if + S + V." },
          { q: "The dam was completed in 1975. It supplies a third of the region's power. → ___ in 1975, the dam supplies a third of the region's power.", answers: ["Completed"], hint: "Bị động → V3." },
          { q: "Parents are involved to some degree. This degree matters. → The degree to ___ parents are involved matters.", answers: ["which"], hint: "the degree to which." },
        ],
      },

      { t: "h", text: "II. Chọn câu đúng (6 câu) — ôn Bài 1 mục 6–7" },
      {
        t: "mcq",
        id: "t5d5-bt-chon",
        title: "II. Chọn phương án đúng",
        items: [
          { q: "1. ___ by the committee, the plan was sent back for revision.", options: ["Rejecting", "Having rejected", "Having been rejected", "To reject"], correct: 2, why: "Kế hoạch BỊ bác, xong trước → Having been rejected." },
          { q: "2. The idea ___ machines will replace teachers is exaggerated.", options: ["which", "that", "what", "of"], correct: 1, why: "idea + that + mệnh đề đủ → đồng vị." },
          { q: "3. Câu nào dễ đọc nhất (xương sống sớm, tầng nặng về cuối)?", options: ["That the scheme which the council that was elected last year introduced has failed is clear.", "The scheme the council elected last year introduced that has failed is clear.", "It is clear that the scheme introduced by the council elected last year has failed.", "Clear is that the scheme, the council, elected last year, introduced, has failed."], correct: 2, why: "It is clear that… đẩy mệnh đề danh ngữ nặng về cuối; hai mệnh đề quan hệ rút gọn nối đuôi nhau." },
          { q: "4. The number of adults who say they read for pleasure ___ over the decade.", options: ["have fallen", "has fallen", "are falling", "were fallen"], correct: 1, why: "Danh từ chính The number → số ít." },
          { q: "5. Walking into the exam hall, ___ .", options: ["my phone rang", "there was a phone ringing", "I heard my phone ring", "the phone was heard ringing"], correct: 2, why: "Người walking là I → chủ ngữ mệnh đề chính phải là I." },
          { q: "6. The survey shows that most users trust the app and ___ .", options: ["that few read its terms", "few reading its terms", "to read its terms rarely", "few of them reading its terms"], correct: 0, why: "that … and that …: song song." },
        ],
      },

      { t: "h", text: "III. Sửa lỗi — gõ lại phần [trong ngoặc] (6 câu) — ôn Bài 1 mục 7" },
      {
        t: "quiz",
        id: "t5d5-bt-sua",
        kind: "fill",
        title: "III. Mỗi câu một lỗi",
        items: [
          { q: "The extent [that] social media shapes opinion is hard to measure.", answers: ["to which"], hint: "the extent to which." },
          { q: "Nobody could say when [would the road reopen].", answers: ["the road would reopen"], hint: "Trật tự câu kể." },
          { q: "The proposal, which was first made in 2019 and [rejecting] twice, has now been approved.", answers: ["rejected", "was rejected"], hint: "Song song trong mệnh đề quan hệ bị động: was made… and (was) rejected." },
          { q: "What surprised the researchers most [were] the speed of the change.", answers: ["was"], hint: "What-clause → số ít." },
          { q: "Half the staff work from home, [that] has reduced office costs.", answers: ["which"], hint: "Sau dấu phẩy, bình luận cả ý → which." },
          { q: "Having grown up in a village, [city life seemed overwhelming to him].", answers: ["he found city life overwhelming", "he found life in the city overwhelming"], hint: "Người lớn lên ở làng là he → he phải làm chủ ngữ." },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu) — mỗi câu dùng ít nhất hai tầng" },
      {
        t: "quiz",
        id: "t5d5-bt-dich",
        kind: "translate",
        title: "IV. Dịch — dùng từ trong gợi ý",
        grammar: "phân từ + quan hệ + danh ngữ trong một câu",
        items: [
          { q: "Đối mặt với dân số già, nhiều nước đang nâng tuổi nghỉ hưu, điều này khiến người lao động trẻ lo rằng họ sẽ phải làm việc lâu hơn.", answers: ["Faced with an ageing population, many countries are raising the retirement age, which makes young workers worry that they will have to work longer.", "Faced with an ageing population, many countries are raising the retirement age, which leads younger workers to fear that they will have to work longer."], hint: "Faced with · , which makes · worry that" },
          { q: "Điều khiến các nhà nghiên cứu ngạc nhiên là những học sinh ngủ ít hơn lại không nhận ra rằng trí nhớ của mình kém đi.", answers: ["What surprised the researchers was that students who slept less did not realise that their memory was getting worse.", "What surprised the researchers was that the students who slept less did not notice that their memory had got worse."], hint: "What surprised… was that · students who slept less · realise that" },
          { q: "Bản báo cáo, được công bố tuần trước, lập luận rằng mức độ mà trẻ em được lợi phụ thuộc vào thu nhập gia đình.", answers: ["The report, published last week, argues that the extent to which children benefit depends on family income.", "The report, which was published last week, argues that the extent to which children benefit depends on family income."], hint: "published last week · argues that · the extent to which" },
          { q: "Sau khi mất việc, anh ấy chuyển về quê, nơi bố mẹ anh có một trang trại nhỏ.", answers: ["Having lost his job, he moved back to his hometown, where his parents had a small farm.", "Having lost his job, he moved back to his hometown, where his parents have a small farm.", "Having lost his job, he moved back to his home town, where his parents owned a small farm."], hint: "Having lost · , where" },
          { q: "Vẫn chưa rõ liệu các biện pháp được đưa ra năm ngoái có làm giảm số vụ tai nạn hay không.", answers: ["It remains unclear whether the measures introduced last year have reduced the number of accidents.", "It is still unclear whether the measures introduced last year have reduced the number of accidents.", "It remains unclear whether the measures introduced last year reduced the number of accidents."], hint: "It remains unclear whether · measures introduced last year" },
        ],
      },

      { t: "h", text: "V. Đọc — ghép tiêu đề chức năng (4 câu · 5 phút) — ôn Bài 2 mục 1–2" },
      {
        t: "passage",
        title: "What Is a Weed?",
        paras: [
          { label: "A", text: "Gardeners speak of weeds as though they were a kind of plant, yet no botanist could pick one out by examining it. The dandelion that is dug out of a lawn in one street is grown as a salad crop a few kilometres away. Nothing in the plant has changed between the two places." },
          { label: "B", text: "The usual answer, that a weed is a plant growing where it is not wanted, moves the question along without settling it. Not wanted by whom? A field scattered with poppies delights the walker on the footpath and costs the farmer part of the harvest." },
          { label: "C", text: "This might seem a harmless habit of speech, but it has effects. Several countries have laws obliging landowners to destroy the plants named on an official list, and such lists were often drawn up when farming was the only interest considered. Plants now valued because they feed insects can still be found on them." },
          { label: "D", text: "None of this means the word should be given up. A farmer needs a name for whatever threatens a crop. It means only that a list of weeds ought to say whose purposes it serves, and ought to be revised when those purposes change." },
        ],
      },
      {
        t: "table",
        head: ["", "List of Headings"],
        rows: [
          ["i", "A term worth keeping, on certain terms"],
          ["ii", "How weeds spread from one country to another"],
          ["iii", "A category with no basis in the plant itself"],
          ["iv", "The case for banning the destruction of wild plants"],
          ["v", "A definition that depends on who is asked"],
          ["vi", "Real-world effects of an out-of-date classification"],
        ],
      },
      {
        t: "mcq",
        id: "t5d5-bt-tieu-de",
        title: "V. Chọn tiêu đề cho từng đoạn",
        items: [
          { q: "1. Paragraph A", options: ["i", "ii", "iii", "v"], correct: 2, why: "“no botanist could pick one out by examining it… Nothing in the plant has changed” → no basis in the plant itself." },
          { q: "2. Paragraph B", options: ["iii", "iv", "v", "vi"], correct: 2, why: "“Not wanted by whom?” — người đi bộ thích, nông dân thiệt → depends on who is asked." },
          { q: "3. Paragraph C", options: ["ii", "iv", "v", "vi"], correct: 3, why: "“it has effects… laws… lists… drawn up when farming was the only interest” → real-world effects of an out-of-date classification. iv là bẫy: đoạn không kêu gọi cấm." },
          { q: "4. Paragraph D", options: ["i", "iii", "iv", "vi"], correct: 0, why: "“None of this means the word should be given up… It means only that…” → worth keeping, on certain terms (= với điều kiện)." },
        ],
      },

      { t: "h", text: "VI. Nghe — một đoạn bài giảng giọng New Zealand (5 câu) — ôn Bài 3 mục 2" },
      {
        t: "listen",
        id: "t5d5-bt-nghe",
        title: "A lecture extract — the ship that laid the cable",
        dan: { so: "Day 5, Recording 3", boiCanh: "an extract from a lecture about a nineteenth-century ship.", cau: [1, 5] },
        note: "Khoảng 1 phút. Giọng New Zealand (nam).",
        lines: [
          { who: "Lecturer", voice: "nz-nam", text: "The ship that laid the 1866 cable deserves a few minutes of its own. The Great Eastern was designed by Brunel in the eighteen-fifties for one purpose: to carry four thousand passengers all the way to Australia without stopping for coal. At over two hundred metres she was by far the longest ship in the world, and would remain so for four decades." },
          { who: "Lecturer", voice: "nz-nam", text: "As a passenger liner, though, she was a commercial failure. There simply weren't four thousand people who wanted to go, and she never once sailed to Australia. What saved her reputation was an accident of size. A transatlantic cable weighed thousands of tonnes, and earlier attempts had needed two ships, meeting in mid-ocean and joining their halves. The Great Eastern was the only vessel afloat that could take the whole cable in her tanks." },
          { who: "Lecturer", voice: "nz-nam", text: "After that, her career went downhill again. She ended her days moored at Liverpool as a floating advertisement for a department store, and was broken up around 1890." },
        ],
      },
      {
        t: "quiz",
        id: "t5d5-bt-nghe-dien",
        kind: "fill",
        title: "VI. Questions 1–5 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. The ship was built to sail to ___ without taking on more coal.", answers: ["Australia"], hint: "“all the way to Australia without stopping for coal”." },
          { q: "2. It was designed to carry ___ passengers.", answers: ["4000", "4,000", "four thousand"], hint: "“four thousand passengers”. two hundred là chiều dài (mét); four decades là thời gian giữ kỷ lục." },
          { q: "3. As a passenger ship it proved to be a commercial ___ .", answers: ["failure"], hint: "“As a passenger liner, though, she was a commercial failure.”" },
          { q: "4. It was the only ship able to hold the whole ___ .", answers: ["cable"], hint: "“the only vessel afloat that could take the whole cable in her tanks”. two ships là cách làm cũ." },
          { q: "5. At the end of its life it was used as a floating ___ .", answers: ["advertisement", "advert"], hint: "“a floating advertisement for a department store”." },
        ],
      },

      { t: "h", text: "VII. Nối âm chuỗi (4 câu) — ôn Bài 3 mục 3" },
      {
        t: "mcq",
        id: "t5d5-bt-noi-am",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. Trong “the idea of it”, giọng Anh – Úc thường chêm âm nào giữa idea và of?", options: ["/j/", "/w/", "/r/", "/h/"], correct: 2, why: "/r/ chêm sau /ə/ trước nguyên âm: idea‿/r/‿of." },
          { q: "2. Bạn nghe “wɒ-tə-vɪ-tɪz”. Chuỗi đó là:", options: ["what a visit is", "what of it is", "water fit is", "what have it is"], correct: 1, why: "what‿of‿it‿is: ba mối phụ âm + nguyên âm; of yếu thành /əv/." },
          { q: "3. “She ended her days” nói nhanh nghe “ʃiː-jen-dɪ-də-deɪz”. Âm /j/ ở đâu ra?", options: ["Từ chữ h của her", "Chèn giữa she và ended", "Từ chữ y của days", "Người nói nói sai"], correct: 1, why: "she /iː/ + nguyên âm → chèn /j/. /h/ của her rơi nên ended‿her nghe “endɪdə”." },
          { q: "4. Cách tốt nhất để tách một chuỗi nối âm khi nghe là:", options: ["Chờ người nói nhắc lại", "Tìm từ chức năng quen (of, it, at, a) rồi suy ra từ nội dung hai bên", "Viết lại đúng âm nghe được", "Bỏ qua và nghe câu sau"], correct: 1, why: "Từ chức năng là mốc: nhận ra “əv”, “ɪt”, “ət” thì phần còn lại là từ nội dung." },
        ],
      },

      { t: "h", text: "VIII. Từ vựng của ngày (4 câu) — ôn Bài 2 mục 7 · Bài 3 mục 7" },
      {
        t: "quiz",
        id: "t5d5-bt-tu-vung",
        kind: "fill",
        title: "VIII. Điền MỘT từ (chữ đầu cho sẵn)",
        items: [
          { q: "Only one of the twelve sites s___ every condition set by the council. (đáp ứng — quá khứ)", answers: ["satisfied"], hint: "satisfy a condition / a requirement = đáp ứng một điều kiện." },
          { q: "The contract s___ that the work be finished by June. (quy định rõ)", answers: ["stipulates"], hint: "stipulate that + subjunctive; chủ ngữ số ít → stipulates." },
          { q: "Closing the only bus route proved to be a costly m___ . (đánh giá sai)", answers: ["misjudgement", "misjudgment"], hint: "a costly misjudgement." },
          { q: "After the storm, the whole rail network slowed to a c___ .", answers: ["crawl"], hint: "slow to a crawl." },
        ],
      },

      { t: "h", text: "IX. Viết một thân bài có đúng HAI câu ba tầng (110–140 từ) — AI chấm" },
      {
        t: "essay",
        id: "t5d5-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: Some people believe that universities should accept students mainly on the basis of interviews rather than examination results. Write ONE body paragraph (110–140 words) that evaluates this view. Your paragraph must contain exactly TWO sentences with three layers of subordinate clause (participle + relative + noun clause), at least one short sentence of fewer than eight words, and no sentence in which the main verb comes more than ten words after its subject.",
        minWords: 110,
        tips: [
          "Viết xương sống của từng câu trước, gắn tầng sau.",
          "Sau khi viết: che tầng từng câu dài — còn lại một câu đứng được không?",
          "Năm câu hỏi của mục 7: động từ chính · danh từ chính · ai làm V-ing · which chỉ gì · that… and that…",
          "Đếm: mấy câu? mấy câu sạch lỗi? Ghi tỉ lệ vào Sổ lỗi như Ngày 1.",
        ],
      },
    ],
  },
];
