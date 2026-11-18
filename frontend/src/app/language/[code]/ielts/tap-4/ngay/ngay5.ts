/**
 * IELTS Tập 4 — Ngày 5 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Participle clauses (V-ing · V3 · Having V3) · liên từ + phân từ · dangling participle · absolute clause
 *                     · bị động + quan hệ rút gọn xếp chồng trong câu học thuật                              [G35, ôn G24 G26]
 *                     — nối Tập 3 Ngày 13 (bị động mọi thì) · Tập 3 Ngày 17 (rút gọn mệnh đề quan hệ V-ing / V3)
 *   Bài 2 (reading)   TFNG / YNNG bẫy band 7: “đúng một nửa”, so sánh ngầm, số đổi; passage lập luận ~900 từ, 13 câu [R05 R15 R19]
 *                     — nối Tập 2 Ngày 6 (5 bẫy cơ bản) · Tập 3 Ngày 3 (TFNG 3) · Tập 3 Ngày 23 (YNNG 2, từ cực đoan)
 *   Bài 3 (listening) Part 3 — bốn người nói, Matching ý kiến, ~165 wpm                                         [L05 L12]
 *                     — nối Tập 2 Ngày 13 · Tập 3 Ngày 8 (ba người nói) · 🔊 nuốt /t/ /d/ giữa phụ âm [S14]
 *   Bài tập Ngày 5    41 câu có đáp án
 * Mọi id bắt đầu `t4d5-`.
 */
import type { Lesson } from '../data';

export const NGAY_5: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d5-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Participle clauses · bị động và quan hệ rút gọn trong câu học thuật",
    goal: "Viết đúng mệnh đề phân từ (Facing…, Faced with…, Having analysed…, …, leading to…), không còn để chủ ngữ treo (dangling participle), dùng được absolute clause (with the figure reaching…) và đọc – viết được câu học thuật xếp chồng bị động + quan hệ rút gọn — đẩy GRA band 7 (đa dạng câu phức, phần lớn câu không lỗi).",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Participle clause** (mệnh đề phân từ) = một mệnh đề trạng ngữ đã **bỏ liên từ và chủ ngữ**, chỉ còn phân từ: **Facing** rising costs, the firm cut 200 jobs. Nó nén hai câu thành một — đúng thứ band 7 cần ở tiêu chí **GRA**.",
          "Ba dạng: ==V-ing== (nghĩa chủ động) · ==V3== (nghĩa bị động) · ==Having + V3== (việc xong **trước** việc ở mệnh đề chính).",
          "Luật sống còn: chủ ngữ ngầm của phân từ **phải là chủ ngữ của mệnh đề chính**. Sai luật này là **dangling participle** — lỗi rất hay gặp ở bài band 6.5.",
          "**Absolute clause**: phân từ có chủ ngữ riêng — **with** sales **falling** by 10% · the figure **reaching** 40%. Rất hợp Task 1.",
          "Nối **Tập 3 Ngày 13** (bị động) và **Tập 3 Ngày 17** (rút gọn mệnh đề quan hệ): hôm nay xếp chồng chúng trong câu học thuật dài, và học cách tìm **động từ chính** khi đọc Passage 3.",
          "Tiêu chí được đẩy: **GRA** (Writing + Speaking), kéo theo **CC** (câu gọn, ý dính nhau) và tốc độ đọc câu dài ở **Reading**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn 90 giây — bị động (Tập 3 Ngày 13) và rút gọn mệnh đề quan hệ (Tập 3 Ngày 17)" },
      {
        t: "p",
        text: "Hai thứ bạn đã có: (1) **bị động** = ==be + V3==, thì nằm ở be (The data **was collected** in 2019); (2) **rút gọn mệnh đề quan hệ**: bỏ who / which + be, giữ ==V-ing== nếu nghĩa chủ động, ==V3== nếu nghĩa bị động (people **living** in cities · the data **collected** in 2019). Hôm nay ta dùng đúng hai phân từ đó, nhưng ở một vị trí mới: **đứng thay cho cả một mệnh đề trạng ngữ**.",
      },
      {
        t: "table",
        head: ["Loại", "Câu đầy đủ", "Rút gọn", "Phân từ bổ nghĩa cho"],
        rows: [
          ["Quan hệ rút gọn (Tập 3 N17)", "Students **who live** on campus spend less on transport.", "Students **living** on campus spend less on transport.", "một **danh từ** (students)"],
          ["Quan hệ rút gọn bị động (Tập 3 N17)", "The survey **which was carried out** in May had 900 replies.", "The survey **carried out** in May had 900 replies.", "một **danh từ** (the survey)"],
          ["Participle clause (hôm nay)", "**Because they live** on campus, these students spend less.", "**Living** on campus, these students spend less.", "**cả mệnh đề chính** (nêu lý do)"],
          ["Participle clause bị động (hôm nay)", "**When it is seen** from above, the city looks like a grid.", "**Seen** from above, the city looks like a grid.", "**cả mệnh đề chính** (nêu điều kiện)"],
        ],
        caption: "Dấu hiệu nhận ra: quan hệ rút gọn dính liền sau danh từ, không có dấu phẩy; participle clause thường tách bằng dấu phẩy và đứng đầu hoặc cuối câu.",
      },
      {
        t: "quiz",
        id: "t4d5-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — V-ing hay V3? (6 câu ôn Tập 3 Ngày 13 · 17)",
        items: [
          { q: "The samples ___ (take) from the river were sent to a laboratory.", answers: ["taken"] },
          { q: "Anyone ___ (apply) for the grant must submit a budget.", answers: ["applying"] },
          { q: "By 2015 most of the old terraces had ___ (demolish).", answers: ["been demolished"] },
          { q: "The method ___ (describe) in Chapter 2 was first used in the 1960s.", answers: ["described"] },
          { q: "There has been a rise in the number of people ___ (work) past the age of 65.", answers: ["working"] },
          { q: "A new ring road is currently ___ (build) to the north of the town.", answers: ["being built"] },
        ],
      },
      { t: "rule", formula: "N + V-ing (chủ động) · N + V3 (bị động) = mệnh đề quan hệ rút gọn — bổ nghĩa cho DANH TỪ", vi: "Sai 2 câu trở lên ⇒ xem lại Tập 3 Ngày 17 mục 6–7 trước khi học tiếp." },

      /* ── 2 ── */
      { t: "h", text: "2. Participle clause là gì — ba dạng, một luật" },
      {
        t: "p",
        text: "Lấy hai câu: **The company faced rising costs. It cut 200 jobs.** Band 6 nối bằng because / so. Band 7 có thêm một lựa chọn: bỏ chủ ngữ lặp và liên từ, đổi động từ thành phân từ — **Facing rising costs, the company cut 200 jobs.** Người đọc tự hiểu quan hệ (ở đây là nguyên nhân). Mệnh đề phân từ **không có thì**: thì của cả câu nằm ở động từ chính (cut).",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Rút gọn mệnh đề trạng ngữ thành participle clause — 4 bước",
        steps: [
          { label: "1. Hai mệnh đề CÙNG chủ ngữ?", sub: "Because **the company** faced rising costs, **it** cut 200 jobs. ✔ cùng chủ ngữ" },
          { label: "2. Bỏ liên từ + chủ ngữ ở mệnh đề phụ", sub: "~~Because the company~~ faced rising costs, …" },
          { label: "3. Chủ động → V-ing · bị động → V3 · xong trước → Having V3", sub: "**Facing** rising costs, …" },
          { label: "4. Đặt chủ ngữ thật ngay sau dấu phẩy", sub: "Facing rising costs, **the company** cut 200 jobs." },
        ],
        caption: "Bước 1 không qua ⇒ không được rút gọn (xem mục 7 — dangling participle).",
      },
      {
        t: "table",
        head: ["Dạng", "Nghĩa", "Ví dụ", "Câu đầy đủ tương ứng"],
        rows: [
          ["**V-ing**", "chủ động; cùng lúc hoặc là lý do", "**Living** far from the centre, many workers spend two hours a day commuting.", "Because they live far from the centre, …"],
          ["**V3**", "bị động", "**Built** in 1890, the station is the oldest in the country.", "The station was built in 1890. It is…"],
          ["**Having + V3**", "chủ động; xong **trước** việc chính", "**Having collected** the data, the team began the analysis.", "After they had collected the data, …"],
          ["**Having been + V3**", "bị động; xong trước việc chính", "**Having been rejected** twice, the proposal was finally approved in 2022.", "After it had been rejected twice, …"],
          ["**Not + phân từ**", "phủ định", "**Not knowing** the local language, new arrivals often feel isolated.", "Because they do not know…"],
        ],
        caption: "Phủ định: not đứng TRƯỚC phân từ (Not having seen… · Not wanting to…), không viết ~~Having not seen~~ trong văn trang trọng.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai: để nguyên động từ chia thì sau khi bỏ liên từ",
        items: [
          "~~Faced rising costs, the company cut 200 jobs.~~ → **Facing** rising costs (công ty **đối mặt** = chủ động) hoặc **Faced with** rising costs (cụm bị động cố định: be faced with).",
          "~~The company faced rising costs, cut 200 jobs.~~ — hai động từ chia thì nối bằng dấu phẩy là **comma splice** (lỗi dấu câu, mất điểm GRA). Sửa: **Facing** rising costs, the company cut… / The company faced rising costs **and** cut…",
          "~~Because facing rising costs, the company…~~ — **because** không đi với phân từ. Chỉ một số liên từ giữ lại được (mục 6).",
        ],
      },
      { t: "rule", formula: "V-ing / V3 / Having V3 + … , S + V (chủ ngữ ngầm của phân từ = S)", vi: "Phân từ không mang thì; chủ động dùng V-ing, bị động dùng V3, việc xong trước dùng Having V3." },
      {
        t: "quiz",
        id: "t4d5-ba-dang-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — mở đầu bằng phân từ (4 câu)",
        grammar: "V-ing / V3 / Having V3 + …, S + V",
        items: [
          { q: "Sống xa trung tâm, nhiều công nhân tốn hai tiếng mỗi ngày để đi lại.", answers: ["Living far from the centre, many workers spend two hours a day commuting.", "Living far from the center, many workers spend two hours a day commuting.", "Living far from the centre, many workers spend two hours commuting every day."], hint: "Living far from… · spend … commuting" },
          { q: "Được xây năm 1890, nhà ga này là nhà ga cổ nhất cả nước.", answers: ["Built in 1890, the station is the oldest in the country.", "Built in 1890, this station is the oldest in the country.", "Built in 1890, this station is the oldest one in the country."], hint: "Built in… · the oldest" },
          { q: "Sau khi thu thập xong dữ liệu, nhóm nghiên cứu bắt đầu phân tích.", answers: ["Having collected the data, the team began the analysis.", "Having collected the data, the research team began the analysis.", "Having collected the data, the research team began to analyse it.", "Having collected the data, the team started the analysis."], hint: "Having collected · the team · began" },
          { q: "Vì không biết tiếng địa phương, người mới đến thường cảm thấy bị cô lập.", answers: ["Not knowing the local language, new arrivals often feel isolated.", "Not knowing the local language, newcomers often feel isolated."], hint: "Not knowing · new arrivals · isolated" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. V-ing clause — cùng lúc, lý do, và KẾT QUẢ (…, leading to…)" },
      {
        t: "p",
        text: "V-ing clause có ba việc. Hai việc đầu đứng **đầu câu**: cùng lúc (**Walking** through the old town, visitors pass six temples) và lý do (**Being** a small country, Singapore imports most of its food). Việc thứ ba đứng **cuối câu, sau dấu phẩy**, và là thứ đáng tiền nhất cho bài viết: nêu ==kết quả== của cả mệnh đề trước.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V … , V-ing … (kết quả)",
            vi: "Mệnh đề trước gây ra điều ở sau. Thay cho “, which leads to / and this means”.",
            examples: [
              { en: "Rents have doubled in ten years, forcing many young people to move back in with their parents.", vi: "Tiền thuê nhà đã tăng gấp đôi trong mười năm, buộc nhiều người trẻ phải dọn về ở với bố mẹ." },
              { en: "The factory closed in 2015, leaving 3,000 people without work.", vi: "Nhà máy đóng cửa năm 2015, khiến 3.000 người mất việc." },
              { en: "More people now work from home, thereby reducing pressure on public transport.", vi: "Hiện có nhiều người làm việc ở nhà hơn, nhờ đó giảm áp lực lên giao thông công cộng." },
            ],
          },
          {
            formula: "S + V … , V-ing … (số liệu Task 1)",
            vi: "Thêm chi tiết số cho động từ chính: reaching · peaking at · accounting for · making it…",
            examples: [
              { en: "Sales rose steadily throughout the period, reaching 4 million units in 2020.", vi: "Doanh số tăng đều suốt giai đoạn, đạt 4 triệu chiếc vào năm 2020." },
              { en: "Coal provided 60% of the country's electricity, making it by far the most important source.", vi: "Than cung cấp 60% điện của cả nước, khiến nó trở thành nguồn quan trọng nhất, bỏ xa các nguồn khác." },
            ],
          },
          {
            formula: "V-ing … , S + V (lý do / cùng lúc)",
            vi: "Đứng đầu câu. Being + adj / N = “vì là…”.",
            examples: [
              { en: "Being relatively cheap to install, solar panels have spread quickly in rural areas.", vi: "Vì lắp đặt tương đối rẻ, pin mặt trời đã lan nhanh ở vùng nông thôn." },
              { en: "Recognising the scale of the problem, the council doubled its housing budget.", vi: "Nhận ra quy mô của vấn đề, hội đồng thành phố đã tăng gấp đôi ngân sách nhà ở." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Động từ kết quả", "Theo sau là", "Ví dụ"],
        rows: [
          ["leading to / resulting in / causing", "danh từ (cụm danh từ)", "…, **leading to** a sharp fall in bus use."],
          ["forcing / allowing / enabling / encouraging / prompting", "sb / sth + **to V**", "…, **prompting** the government **to** raise taxes."],
          ["making", "it + adj + to V · sth + adj / N", "…, **making it** difficult **to** recruit teachers."],
          ["leaving", "sb / sth + adj / without…", "…, **leaving** many families **homeless**."],
          ["meaning (that)", "mệnh đề", "…, **meaning that** fewer staff are needed."],
          ["thus / thereby + V-ing", "(trang trọng — chỉ dùng khi viết)", "…, **thereby creating** new jobs."],
        ],
        caption: "Chủ ngữ ngầm của V-ing kết quả là CẢ sự việc ở mệnh đề trước — đây là trường hợp duy nhất tiếng Anh chuẩn chấp nhận như vậy.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận hai lỗi ở V-ing kết quả",
        items: [
          "Thiếu dấu phẩy: ~~Rents have doubled forcing many people to move.~~ → phải có **dấu phẩy** trước forcing, nếu không người đọc hiểu forcing bổ nghĩa cho rents.",
          "Dùng **lead to + V nguyên mẫu**: ~~leading to increase prices~~ → to ở đây là **giới từ**: leading to **an increase in** prices / leading to prices **increasing**.",
          "Lạm dụng: một đoạn 5 câu có 4 câu kết bằng “, leading to…” là máy móc (CC band 6). Mỗi đoạn thân bài **một lần** là đủ.",
        ],
      },
      { t: "rule", formula: "S + V … , V-ing + O (leading to · resulting in · forcing sb to V · making it adj to V)", vi: "V-ing cuối câu sau dấu phẩy = kết quả của cả mệnh đề trước; trong Task 1: “, reaching / peaking at + số”." },
      {
        t: "quiz",
        id: "t4d5-ket-qua-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — kết câu bằng V-ing chỉ kết quả (4 câu)",
        grammar: "S + V …, V-ing … (kết quả)",
        items: [
          { q: "Giá nhà đã tăng mạnh, buộc nhiều người trẻ phải thuê nhà lâu hơn.", answers: ["House prices have risen sharply, forcing many young people to rent for longer.", "House prices have increased sharply, forcing many young people to rent for longer.", "Housing prices have risen sharply, forcing many young people to rent for longer."], hint: "have risen sharply · forcing … to rent for longer" },
          { q: "Nhà máy đóng cửa năm 2018, dẫn đến tỉ lệ thất nghiệp tăng mạnh.", answers: ["The factory closed in 2018, leading to a sharp rise in unemployment.", "The factory closed in 2018, resulting in a sharp rise in unemployment.", "The factory closed in 2018, leading to a sharp increase in unemployment.", "The factory closed in 2018, resulting in a sharp increase in unemployment."], hint: "leading to / resulting in · a sharp rise in" },
          { q: "Con số này tăng đều, đạt 45% vào năm 2020.", answers: ["The figure rose steadily, reaching 45% in 2020.", "This figure rose steadily, reaching 45% in 2020.", "The figure increased steadily, reaching 45% in 2020.", "This figure increased steadily, reaching 45% in 2020."], hint: "rose steadily · reaching" },
          { q: "Nhiều giáo viên đã rời vùng nông thôn, khiến việc tuyển người thay thế trở nên khó khăn.", answers: ["Many teachers have left rural areas, making it difficult to recruit replacements.", "Many teachers have left rural areas, making it hard to recruit replacements.", "Many teachers have left the countryside, making it difficult to recruit replacements."], hint: "making it difficult to + V · recruit replacements" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. V3 clause — nghĩa bị động: Faced with…, Compared with…, Given…" },
      {
        t: "p",
        text: "Khi chủ ngữ **chịu** hành động, dùng ==V3== (không cần being): **Founded** in 1968, the university now has 30,000 students = The university **was founded** in 1968. Cách thử nhanh: lắp chủ ngữ của mệnh đề chính vào trước phân từ, thêm be — nếu thành một câu bị động có nghĩa thì V3 đúng.",
      },
      {
        t: "table",
        head: ["Cụm V3 hay gặp trong bài học thuật", "Nghĩa", "Ví dụ"],
        rows: [
          ["**Faced with** + N", "khi đối mặt với", "**Faced with** falling birth rates, several governments now pay families to have children."],
          ["**Compared with / to** + N", "so với", "**Compared with** their parents, today's graduates change jobs far more often."],
          ["**Given** + N", "nếu được cho / xét đến", "**Given** the choice, most employees would work from home two days a week."],
          ["**Based on** + N", "dựa trên", "**Based on** interviews with 400 farmers, the report challenges the official figures."],
          ["**Seen / Viewed from** + N", "nhìn từ góc độ", "**Viewed from** an economic perspective, the policy has been a success."],
          ["**Used / Taken / Applied** + adv", "nếu được dùng…", "**Used** carefully, social media can strengthen local communities."],
          ["**Located / Situated** + nơi", "nằm ở", "**Located** on a major trade route, the town grew rapidly in the 1700s."],
          ["**Driven / Encouraged / Supported by** + N", "do… thúc đẩy", "**Driven by** cheap credit, house prices rose by a third in five years."],
        ],
        caption: "So sánh: Compared with / to đều đúng; ~~Comparing with last year, sales rose~~ là SAI — doanh số không tự đi so sánh, nó ĐƯỢC so sánh ⇒ Compared with.",
      },
      {
        t: "note",
        title: "⚠️ Hay nhầm: V-ing hay V3 ở đầu câu?",
        items: [
          "Hỏi: chủ ngữ của mệnh đề chính **làm** hay **bị**? **Seeing** the results, the minister resigned (bộ trưởng **nhìn thấy**). **Seen** from space, the river looks like a thin thread (dòng sông **được nhìn**).",
          "~~Comparing with 2010, the figure was twice as high.~~ → **Compared with** 2010, …",
          "~~Basing on the survey, most people agree.~~ → **Based on** the survey, … (không có cụm ~~basing on~~).",
          "~~Being built in 1890, the station is the oldest.~~ → việc xây đã xong ⇒ **Built** in 1890. Being + V3 chỉ dùng khi việc **đang** diễn ra hoặc để nêu lý do: **Being made** of wood, the houses burn easily.",
        ],
      },
      { t: "rule", formula: "V3 + (by / with / in / from…) … , S + V (S chịu hành động của V3)", vi: "Thử: S + be + V3 có nghĩa ⇒ dùng V3. Compared with / Based on / Faced with / Given là bốn cụm phải thuộc." },
      {
        t: "quiz",
        id: "t4d5-v3-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — mở đầu bằng V3 (4 câu)",
        grammar: "V3 + …, S + V",
        items: [
          { q: "So với năm 2010, con số này cao gấp đôi.", answers: ["Compared with 2010, the figure was twice as high.", "Compared to 2010, the figure was twice as high.", "Compared with 2010, this figure was twice as high.", "Compared to 2010, this figure was twice as high.", "Compared with 2010, the figure is twice as high.", "Compared to 2010, the figure is twice as high."], hint: "Compared with · twice as high" },
          { q: "Đối mặt với chi phí tăng, nhiều doanh nghiệp nhỏ đã đóng cửa.", answers: ["Faced with rising costs, many small businesses have closed.", "Faced with rising costs, many small businesses closed.", "Faced with rising costs, many small businesses have closed down.", "Faced with increasing costs, many small businesses have closed."], hint: "Faced with · rising costs" },
          { q: "Nếu được dùng cẩn thận, công nghệ này có thể cứu nhiều mạng người.", answers: ["Used carefully, this technology can save many lives.", "Used carefully, this technology could save many lives.", "If used carefully, this technology can save many lives.", "If used carefully, this technology could save many lives."], hint: "Used carefully · save lives" },
          { q: "Dựa trên dữ liệu từ 40 quốc gia, báo cáo kết luận rằng bất bình đẳng đang gia tăng.", answers: ["Based on data from 40 countries, the report concludes that inequality is rising.", "Based on data from 40 countries, the report concludes that inequality is increasing.", "Based on data from 40 countries, the report concludes that inequality is growing."], hint: "Based on · concludes that · inequality" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Having + V3 — việc xong TRƯỚC việc chính" },
      {
        t: "p",
        text: "V-ing thường cho biết hai việc **cùng lúc** hoặc liền nhau. Khi muốn nói rõ việc ở mệnh đề phụ đã **hoàn tất trước**, và thường là **lý do** cho việc sau, dùng ==Having + V3==: **Having lived** abroad for ten years, she found it hard to settle back home. Dạng bị động: ==Having been + V3==.",
      },
      {
        t: "sodo",
        kind: "timeline",
        title: "Having V3 đứng trước việc chính trên trục thời gian",
        marks: [
          { from: -8, to: -4, label: "Having spent two years collecting data (xong trước)", kieu: "doan", mau: 3 },
          { from: -3, label: "the team published its findings (việc chính — quá khứ đơn)", kieu: "diem", mau: 1 },
          { from: 0, label: "bây giờ", kieu: "diem", mau: 2 },
        ],
        caption: "Having V3 = After + S + had V3 / Because + S + had V3. Thì của câu vẫn do động từ chính quyết định.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Having + V3 … , S + V",
            vi: "Sau khi / vì đã làm xong việc A, chủ ngữ làm việc B.",
            examples: [
              { en: "Having failed to attract private investment, the city turned to the national government for funding.", vi: "Vì không thu hút được đầu tư tư nhân, thành phố quay sang xin kinh phí của chính phủ trung ương." },
              { en: "Having grown up in a small village, I still find big cities rather overwhelming.", vi: "Vì lớn lên ở một ngôi làng nhỏ, tôi vẫn thấy các thành phố lớn khá ngợp. (dùng được trong Speaking Part 1 · 2)" },
            ],
          },
          {
            formula: "Having been + V3 … , S + V",
            vi: "Sau khi / vì đã bị – được làm gì.",
            examples: [
              { en: "Having been warned about the risks, the company nevertheless went ahead with the project.", vi: "Dù đã được cảnh báo về rủi ro, công ty vẫn tiến hành dự án." },
            ],
          },
          {
            formula: "After / Before / Since + V-ing … , S + V",
            vi: "Giữ giới từ thời gian thì chỉ cần V-ing, không cần Having.",
            examples: [
              { en: "After finishing school, around a third of students take a gap year.", vi: "Sau khi học xong phổ thông, khoảng một phần ba học sinh nghỉ một năm trước khi học tiếp." },
              { en: "Since opening in 2019, the museum has attracted two million visitors.", vi: "Từ khi mở cửa năm 2019, bảo tàng đã thu hút hai triệu lượt khách." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Dễ sai: After having / Having + V-ing",
        items: [
          "~~Having finishing the survey~~ → Having + **V3**: Having **finished** the survey.",
          "After **having finished** không sai nhưng thừa; viết **After finishing** hoặc **Having finished**.",
          "Hai việc gần như cùng lúc thì KHÔNG cần Having: **Opening** the report, she noticed an error (mở ra là thấy). Having opened… nghe như mở xong đã lâu.",
        ],
      },
      { t: "rule", formula: "Having + V3 … , S + V · Having been + V3 … , S + V", vi: "Chỉ dùng khi việc ở mệnh đề phân từ xong TRƯỚC và giải thích cho việc chính." },
      {
        t: "quiz",
        id: "t4d5-having-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — Having + V3 / After + V-ing (3 câu)",
        grammar: "Having + V3 …, S + V",
        items: [
          { q: "Vì đã sống ở nước ngoài mười năm, cô ấy thấy khó hoà nhập lại ở quê nhà.", answers: ["Having lived abroad for ten years, she found it hard to settle back home.", "Having lived abroad for ten years, she found it difficult to settle back home.", "Having lived abroad for ten years, she found it hard to settle back in her home country."], hint: "Having lived abroad · found it hard to settle back" },
          { q: "Sau khi bị từ chối hai lần, đề xuất cuối cùng đã được thông qua.", answers: ["Having been rejected twice, the proposal was finally approved.", "Having been rejected twice, the proposal was eventually approved.", "After being rejected twice, the proposal was finally approved."], hint: "Having been rejected twice · was finally approved" },
          { q: "Từ khi mở cửa năm 2019, thư viện đã thu hút hơn một triệu lượt khách.", answers: ["Since opening in 2019, the library has attracted more than a million visitors.", "Since opening in 2019, the library has attracted over a million visitors.", "Since opening in 2019, the library has attracted more than one million visitors.", "Since opening in 2019, the library has attracted over one million visitors."], hint: "Since opening · has attracted" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Liên từ + phân từ: when asked · if left untreated · although designed for…" },
      {
        t: "p",
        text: "Participle clause trần đôi khi mơ hồ (lý do? thời gian? điều kiện?). Văn học thuật hay **giữ lại liên từ** để rõ nghĩa, chỉ bỏ chủ ngữ + be. Chỉ một nhóm liên từ làm được việc này: ==when · while · once · until · if · unless · although · though · as==. **Because, since (= vì), as (= vì), so that** thì KHÔNG.",
      },
      {
        t: "table",
        head: ["Liên từ + phân từ", "Câu đầy đủ", "Ví dụ rút gọn"],
        rows: [
          ["**When / While + V-ing**", "when they choose…", "**When choosing** a university, students rarely look at teaching quality."],
          ["**When / If / Once + V3**", "when they were asked…", "**When asked** about their plans, 60% of respondents said they intended to move."],
          ["**If / Unless + V3**", "if it is left…", "**If left untreated**, the condition can cause permanent damage."],
          ["**Although / Though + V3 / adj**", "although it was designed…", "**Although designed** for 500 pupils, the school now teaches almost 900."],
          ["**As + V3**", "as it is shown…", "**As shown** in the table, exports fell in every year but one."],
          ["**Unless otherwise stated**", "unless it is stated otherwise", "All figures are in US dollars **unless otherwise stated**."],
          ["**Where / If / When + adj**", "where it is possible", "Patients should, **where possible**, be treated at home."],
        ],
        caption: "As shown in / As can be seen from / As mentioned above — ba cụm mở câu chuẩn cho Task 1 và báo cáo.",
      },
      {
        t: "note",
        title: "⚠️ Sai hay gặp với As… trong Task 1",
        items: [
          "~~As can be seen from the chart that sales rose.~~ → bỏ **that**: As can be seen from the chart, sales rose.",
          "~~As the chart shown, …~~ → **As shown in** the chart, … / **As the chart shows**, …",
          "~~When asking about their plans, 60% said…~~ → người trả lời **được hỏi** ⇒ When **asked**.",
          "~~Because of facing…~~ / ~~Because being poor~~ → viết đủ: **Because they are** poor / **Being** poor.",
        ],
      },
      { t: "rule", formula: "when / while / if / unless / once / although + V-ing (chủ động) / V3 (bị động) … , S + V", vi: "Giữ liên từ cho rõ nghĩa; because / since / so that không rút gọn kiểu này." },

      /* ── 7 ── */
      { t: "h", text: "7. Dangling participle — lỗi “chủ ngữ treo” của band 6.5" },
      {
        t: "p",
        text: "Luật ở mục 2: người / vật làm hành động của phân từ **phải là chủ ngữ của mệnh đề chính**. Khi viết nhanh, ta nghĩ tới “tôi / chúng ta / các nhà nghiên cứu” nhưng lại đặt một danh từ khác sau dấu phẩy. Câu vẫn “hiểu được”, nên rất khó tự thấy — nhưng giám khảo đếm nó là **lỗi ngữ pháp**, và nhiều lỗi kiểu này là thứ giữ GRA ở 6.",
      },
      {
        t: "table",
        head: ["Câu sai (chủ ngữ treo)", "Vì sao sai", "Sửa"],
        rows: [
          ["~~Walking to school, the rain started.~~", "Mưa không đi bộ tới trường.", "**Walking** to school, **I** got caught in the rain. / **While I was walking** to school, the rain started."],
          ["~~Having analysed the data, the conclusion was clear.~~", "Kết luận không phân tích dữ liệu.", "**Having analysed** the data, **the researchers** reached a clear conclusion."],
          ["~~Looking at the chart, car ownership rose sharply.~~", "Việc sở hữu xe không nhìn biểu đồ.", "**As the chart shows**, car ownership rose sharply."],
          ["~~Being a developing country, people in Vietnam work long hours.~~", "Người dân không phải là một quốc gia.", "**Because Vietnam is** a developing country, people there work long hours."],
          ["~~Built in 1890, thousands of passengers use the station daily.~~", "Hành khách không được xây năm 1890.", "**Built** in 1890, **the station** is used by thousands of passengers daily."],
          ["~~To improve health, more sports centres should build.~~", "(cùng họ lỗi với to V) Trung tâm thể thao không tự xây.", "To improve health, **governments should build** more sports centres."],
        ],
        caption: "Cách tự soát 10 giây: khoanh phân từ đầu câu → nhìn từ ĐẦU TIÊN sau dấu phẩy → hỏi “cái này có làm (bị) việc đó không?”.",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: nhóm ngoại lệ được chấp nhận (không coi là treo)",
        items: [
          "Cụm bình luận của người viết: **Generally speaking**, · **Broadly speaking**, · **Strictly speaking**, · **Judging by / from**… · **Considering**… · **Taking everything into account**, · **Assuming (that)**…",
          "Cụm đã thành giới từ / liên từ: **given (that)** · **provided (that)** · **regarding** · **concerning** · **following** (= sau) · **including** · **owing to** · **depending on**.",
          "Ví dụ: **Generally speaking**, older employees are more loyal. — không ai hỏi “nhân viên có đang nói không”.",
          "**Based on** đứng đầu câu với chủ ngữ là người (Based on the data, we concluded…) vẫn bị một số người soát bài coi là treo. An toàn: **On the basis of** the data, we concluded… / Based on the data, **the report** concludes…",
        ],
      },
      {
        t: "mcq",
        id: "t4d5-dangling",
        title: "Câu nào KHÔNG có chủ ngữ treo? (6 câu)",
        items: [
          { q: "1. Chọn câu đúng.", options: ["Having studied abroad, my English improved a lot.", "Having studied abroad, I found that my English had improved a lot.", "Having studied abroad, there was a big improvement in my English.", "Having studied abroad, it was easy to improve my English."], correct: 1, why: "Người đi du học là **I** ⇒ I phải đứng ngay sau dấu phẩy. Ba câu kia đặt my English / there / it sau dấu phẩy ⇒ treo." },
          { q: "2. Chọn câu đúng.", options: ["Compared with rural areas, cities offer far more job opportunities.", "Comparing with rural areas, cities offer far more job opportunities.", "Compared with rural areas, there are more jobs to find.", "Comparing rural areas, more job opportunities are in cities."], correct: 0, why: "Cities **được so sánh** với rural areas ⇒ Compared with…, cities… B sai dạng (Comparing); C có there; D chủ ngữ là opportunities, không ai “so sánh”." },
          { q: "3. Chọn câu đúng.", options: ["Looking at the graph, the number of visitors doubled.", "By looking at the graph, visitor numbers doubled.", "As the graph shows, the number of visitors doubled.", "Looked at the graph, the number of visitors doubled."], correct: 2, why: "Số du khách không “nhìn biểu đồ”. Cách chuẩn của Task 1: **As the graph shows** / As can be seen from the graph." },
          { q: "4. Chọn câu đúng.", options: ["Located near the coast, tourists visit the town all year.", "Locating near the coast, the town attracts tourists all year.", "Located near the coast, there are tourists all year.", "Located near the coast, the town attracts tourists all year."], correct: 3, why: "Thị trấn **được đặt** gần biển ⇒ Located…, **the town**… A: tourists không “located”; B sai dạng; C: there." },
          { q: "5. Chọn câu đúng.", options: ["Generally speaking, graduates earn more than non-graduates.", "Speaking to 300 graduates, higher salaries were reported.", "Being graduates, higher salaries are earned.", "Earning more, a degree is useful for graduates."], correct: 0, why: "**Generally speaking** là cụm bình luận cố định — ngoại lệ được chấp nhận. B: salaries không nói chuyện; C, D: chủ ngữ sai." },
          { q: "6. Chọn câu đúng.", options: ["When asked about salaries, the survey showed dissatisfaction.", "When asked about salaries, dissatisfaction was shown.", "When asked about salaries, most nurses expressed dissatisfaction.", "When asking about salaries, most nurses were dissatisfied by the survey."], correct: 2, why: "Người **được hỏi** là nurses ⇒ When asked…, most nurses… A, B: survey / dissatisfaction không được hỏi; D: asking sai dạng (y tá không đi hỏi)." },
        ],
      },
      { t: "rule", formula: "Phân từ … , S (chính là người / vật làm – chịu hành động của phân từ) + V", vi: "Từ đầu tiên sau dấu phẩy phải trả lời được câu hỏi “ai / cái gì làm việc đó?”. Không được ⇒ viết lại bằng mệnh đề đủ chủ ngữ." },

      /* ── 8 ── */
      { t: "h", text: "8. Absolute clause — phân từ có chủ ngữ RIÊNG: with + N + V-ing / V3" },
      {
        t: "p",
        text: "Muốn mệnh đề phân từ có chủ ngữ **khác** chủ ngữ chính mà không treo? Hãy **viết chủ ngữ đó ra**. Cấu trúc này gọi là **absolute clause** (mệnh đề độc lập). Dạng dễ dùng và an toàn nhất mở bằng ==with==: with + danh từ + V-ing (chủ động) / V3 (bị động). Trong Task 1 nó là cách gọn nhất để gắn số liệu thứ hai vào câu.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V … , with + N + V-ing …",
            vi: "…, trong đó / với việc N đang (làm gì). Gắn chi tiết, số liệu phụ.",
            examples: [
              { en: "Car sales fell in all four countries, with Italy recording the steepest decline.", vi: "Doanh số ô tô giảm ở cả bốn nước, trong đó Ý ghi nhận mức giảm mạnh nhất." },
              { en: "The three rural lines saw little change, with passenger numbers remaining below 2 million throughout.", vi: "Ba tuyến nông thôn hầu như không đổi, lượng khách luôn ở dưới 2 triệu suốt giai đoạn." },
            ],
          },
          {
            formula: "With + N + V-ing / V3 … , S + V",
            vi: "Vì / khi N (đang) …, đứng đầu câu nêu bối cảnh hoặc lý do.",
            examples: [
              { en: "With the population ageing rapidly, spending on pensions is set to double.", vi: "Khi dân số già đi nhanh, chi tiêu cho lương hưu sắp tăng gấp đôi." },
              { en: "With so much work now done online, the traditional office may soon disappear.", vi: "Khi quá nhiều việc giờ được làm trực tuyến, văn phòng truyền thống có thể sớm biến mất." },
            ],
          },
          {
            formula: "N + V-ing / V3 … , S + V (không with — rất trang trọng)",
            vi: "Chủ yếu để NHẬN RA khi đọc; khi viết chỉ dùng vài cụm cố định.",
            examples: [
              { en: "All things considered, the scheme has been a success.", vi: "Xét mọi mặt, chương trình này đã thành công." },
              { en: "Other things being equal, a shorter commute makes people happier.", vi: "Nếu các yếu tố khác như nhau, quãng đường đi làm ngắn hơn khiến người ta hạnh phúc hơn." },
              { en: "The talks having failed, both sides prepared for a strike.", vi: "Vì đàm phán đã thất bại, hai bên chuẩn bị cho đình công." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Sai hay gặp với “with + N + V-ing” trong Task 1",
        items: [
          "Chia động từ sau with: ~~with Italy recorded the steepest decline~~ → sau with **không có động từ chia thì**: with Italy **recording**…",
          "Dùng V3 khi nghĩa chủ động: ~~with the figure reached 40%~~ → with the figure **reaching** 40%.",
          "Nhầm V-ing / V3: with 3,000 homes **built** each year (nhà **được xây**) · with prices **rising** (giá **tự tăng** — rise không có bị động, xem Tập 3 Ngày 13 mục 7).",
          "Một bài Task 1 dùng **một – hai lần** là đẹp; câu nào cũng “, with…” thì thành công thức.",
        ],
      },
      { t: "rule", formula: "S + V … , with + N + V-ing (chủ động) / V3 (bị động)", vi: "Phân từ cần chủ ngữ khác chủ ngữ chính ⇒ viết chủ ngữ đó ra sau with. Task 1: “…, with A recording / accounting for / reaching + số”." },
      {
        t: "quiz",
        id: "t4d5-with-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — with + N + V-ing / V3 (4 câu)",
        grammar: "S + V …, with + N + V-ing / V3",
        items: [
          { q: "Chi tiêu tăng ở cả ba nước, trong đó Nhật Bản ghi nhận mức tăng lớn nhất.", answers: ["Spending rose in all three countries, with Japan recording the largest increase.", "Spending increased in all three countries, with Japan recording the largest increase.", "Spending rose in all three countries, with Japan recording the biggest increase.", "Spending rose in all three countries, with Japan recording the largest rise."], hint: "with Japan recording · the largest increase" },
          { q: "Khi dân số già đi nhanh, nhu cầu chăm sóc sức khoẻ sẽ tăng.", answers: ["With the population ageing rapidly, demand for health care will rise.", "With the population ageing rapidly, the demand for health care will rise.", "With the population ageing rapidly, demand for healthcare will rise.", "With the population ageing rapidly, demand for health care will increase.", "With the population aging rapidly, demand for health care will rise."], hint: "With the population ageing · demand for health care" },
          { q: "Xét mọi mặt, chính sách này đã thành công.", answers: ["All things considered, the policy has been a success.", "All things considered, this policy has been a success.", "All things considered, the policy has been successful.", "All things considered, this policy has been successful."], hint: "All things considered" },
          { q: "Doanh số giảm trong năm 2020, với chỉ 1,2 triệu chiếc được bán ra.", answers: ["Sales fell in 2020, with only 1.2 million units sold.", "Sales fell in 2020, with only 1.2 million units being sold.", "Sales dropped in 2020, with only 1.2 million units sold.", "Sales declined in 2020, with only 1.2 million units sold."], hint: "with only … units sold (bị động ⇒ V3)" },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Câu học thuật xếp chồng: bị động + quan hệ rút gọn — tìm ĐỘNG TỪ CHÍNH" },
      {
        t: "p",
        text: "Passage 3 và bài viết band 7 thích kiểu câu này: **The samples collected by the team were analysed using software developed at the university.** Một câu, bốn phân từ. Người đọc band 6 vấp vì thấy collected là tưởng động từ chính. Mẹo: động từ chính là động từ **có thì** (có be / have / do / modal đứng trước, hoặc chia -s / -ed mà **có tân ngữ riêng**). V3 đứng ngay sau danh từ mà theo sau là by / in / at / from… thì gần như chắc chắn là **quan hệ rút gọn**.",
      },
      {
        t: "table",
        head: ["Mảnh câu", "Vai trò", "Dạng đầy đủ"],
        rows: [
          ["The samples", "chủ ngữ", "—"],
          ["**collected** by the team", "quan hệ rút gọn (bị động) — bổ nghĩa cho samples", "which **were collected** by the team"],
          ["**were analysed**", "==động từ chính== (bị động, quá khứ đơn)", "—"],
          ["**using** software", "V-ing chỉ cách thức", "by using software"],
          ["**developed** at the university", "quan hệ rút gọn (bị động) — bổ nghĩa cho software", "which **was developed** at the university"],
        ],
        caption: "Mỗi câu chỉ có MỘT động từ chính cho mỗi mệnh đề. Tìm ra nó là hiểu được khung câu: The samples … were analysed.",
      },
      {
        t: "table",
        head: ["Kiểu rút gọn sau danh từ", "Ví dụ", "Đầy đủ"],
        rows: [
          ["N + **V-ing** (chủ động)", "countries **relying** on oil exports", "countries which rely on…"],
          ["N + **V3** (bị động, đã xong / nói chung)", "the methods **used** in the study", "the methods which were used…"],
          ["N + **being + V3** (bị động, đang diễn ra)", "the bridge **being built** across the bay", "the bridge which is being built…"],
          ["N + **to be + V3** (sẽ / cần được)", "the issues **to be discussed** next week", "the issues which are to be discussed…"],
          ["the first / only / last + N + **to V**", "the first country **to ban** smoking indoors", "the first country which banned…"],
          ["N + **adj + cụm** (bỏ which is)", "a problem **common to** all large cities", "a problem which is common to…"],
        ],
        caption: "Nối Tập 3 Ngày 17 mục 6–8: ba dòng cuối ở Tập 3 chỉ cần nhận ra; ở band 7 bạn nên DÙNG được ít nhất being V3 và to be V3.",
      },
      {
        t: "note",
        title: "⚠️ Hai lỗi khi tự viết câu xếp chồng",
        items: [
          "Thừa động từ chia thì: ~~The data collected in 2019 was showed that…~~ / ~~The people who interviewed were agreed…~~ → The data **collected** in 2019 **showed** that… · The people **interviewed** **agreed**…",
          "Rút gọn mệnh đề có chủ ngữ riêng: the book **which I bought** không rút thành ~~the book bought I~~ / ~~the book buying~~. Chỉ rút gọn được khi đại từ quan hệ là **chủ ngữ** của mệnh đề quan hệ; còn ở đây chỉ bỏ được which: the book **I bought**.",
          "Dài quá ba tầng thì tách câu. Band 7 là “đa dạng **và đúng**”, không phải “dài nhất có thể”.",
        ],
      },
      {
        t: "mcq",
        id: "t4d5-dong-tu-chinh",
        title: "Tìm động từ chính của câu (5 câu — kỹ năng đọc Passage 3)",
        items: [
          { q: "1. The theory proposed by Hallam in 1987 and later adopted by most economists rests on a single assumption.", options: ["proposed", "adopted", "rests", "không có động từ chính"], correct: 2, why: "proposed / adopted đều là V3 rút gọn (which was proposed… and adopted…). Động từ có thì, hợp với chủ ngữ The theory, là **rests**." },
          { q: "2. Children raised in bilingual homes and tested at the age of seven outperformed their peers on memory tasks.", options: ["outperformed", "raised", "tested", "raised và tested"], correct: 0, why: "raised in… và tested at… là hai quan hệ rút gọn bị động. Chỉ **outperformed** có tân ngữ riêng (their peers) ⇒ động từ chính." },
          { q: "3. Many of the buildings damaged in the earthquake are still being repaired using materials donated by local firms.", options: ["damaged", "are being repaired", "using", "donated"], correct: 1, why: "Có be (are) đứng trước ⇒ **are still being repaired** là động từ chính (bị động tiếp diễn). damaged, donated: rút gọn; using: cách thức." },
          { q: "4. The first study to examine the long-term effects, published in 2004, followed 2,000 workers made redundant during the 1990s.", options: ["examine", "published", "made", "followed"], correct: 3, why: "to examine (first + to V), published (rút gọn), made redundant (rút gọn: who were made redundant). **followed** + tân ngữ 2,000 workers ⇒ động từ chính." },
          { q: "5. Asked why they had left, most of the teachers interviewed blamed the workload imposed by the new curriculum.", options: ["Asked", "interviewed", "blamed", "imposed"], correct: 2, why: "Asked… = participle clause (When they were asked); interviewed, imposed = quan hệ rút gọn. **blamed** + the workload ⇒ động từ chính." },
        ],
      },
      { t: "rule", formula: "S + [V3 / V-ing rút gọn] + V chính (có thì) + O + [V3 / V-ing rút gọn]", vi: "Đọc: tìm động từ có thì trước. Viết: mỗi mệnh đề một động từ chia thì, phần còn lại là phân từ." },

      /* ── 10 ── */
      { t: "h", text: "10. Dùng trong bài thi: từ band 6 lên band 7" },
      {
        t: "table",
        head: ["Ở đâu", "Band 6 (đúng nhưng rời)", "Band 7 (nén bằng phân từ)"],
        rows: [
          ["Task 1 — số liệu", "Sales rose steadily. They reached 4 million in 2020.", "Sales rose steadily, **reaching** 4 million in 2020."],
          ["Task 1 — so sánh", "Sales fell in all countries. Italy had the biggest fall.", "Sales fell in all countries, **with Italy recording** the steepest decline."],
          ["Task 2 — nguyên nhân", "Governments face ageing populations, so they are raising the retirement age.", "**Faced with** ageing populations, governments are raising the retirement age."],
          ["Task 2 — kết quả", "Cities are growing fast and this puts pressure on housing.", "Cities are growing fast, **putting** pressure on housing."],
          ["Task 2 — nhượng bộ", "Although this policy is expensive, it works.", "**Although expensive**, this policy works."],
          ["Speaking Part 2", "I grew up in the countryside, so I love open spaces.", "**Having grown up** in the countryside, I've always loved open spaces."],
          ["Speaking Part 3", "If you compare them with my parents' generation, young people travel more.", "**Compared with** my parents' generation, young people travel far more."],
        ],
        caption: "Khi nói, chỉ dùng loại ngắn và tự nhiên: Having grown up… · Compared with… · Generally speaking… · …, which means… Đừng cố nói “Other things being equal”.",
      },
      {
        t: "quiz",
        id: "t4d5-noi-cau",
        kind: "fill",
        title: "Nối hai câu thành một — điền MỘT hoặc HAI từ (8 câu)",
        items: [
          { q: "The city was founded by traders. It still has a large port. → ___ by traders, the city still has a large port.", answers: ["Founded"] },
          { q: "House prices rose by 40%. This made it impossible for many to buy. → House prices rose by 40%, ___ it impossible for many to buy.", answers: ["making"] },
          { q: "The team had tested 300 samples. Then it published the results. → ___ ___ 300 samples, the team published the results.", answers: ["Having tested"] },
          { q: "Exports grew in every region. Asia showed the fastest growth. → Exports grew in every region, ___ Asia showing the fastest growth.", answers: ["with"] },
          { q: "When residents were asked about noise, most of them complained. → When ___ about noise, most residents complained.", answers: ["asked"] },
          { q: "They did not want to lose customers, so the banks cut their fees. → ___ ___ to lose customers, the banks cut their fees.", answers: ["Not wanting"] },
          { q: "The dam is being built on the river. It will supply two cities. → The dam ___ ___ on the river will supply two cities.", answers: ["being built"] },
          { q: "If the forest is left alone, it will recover within decades. → If ___ alone, the forest will recover within decades.", answers: ["left"] },
        ],
      },

      /* ── 11 ── */
      { t: "h", text: "11. Luyện tổng hợp" },
      {
        t: "mcq",
        id: "t4d5-np-chon",
        title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "1. ___ with a shortage of nurses, the hospital began recruiting overseas.", options: ["Facing", "Faced", "Having faced", "To face"], correct: 1, why: "Cụm cố định **be faced with** ⇒ Faced with. Facing không đi với with (Facing a shortage… thì đúng)." },
          { q: "2. The number of cyclists doubled, ___ the council to build more bike lanes.", options: ["prompted", "which prompting", "prompting", "to prompt"], correct: 2, why: "Sau dấu phẩy, nêu kết quả ⇒ V-ing: **prompting** sb to V. prompted sẽ thành comma splice thiếu chủ ngữ." },
          { q: "3. ___ in 1995, the law has been revised only once.", options: ["Passed", "Passing", "Having passed", "Being passing"], correct: 0, why: "Luật **được thông qua** ⇒ V3: Passed in 1995. Having passed = luật tự thông qua cái gì đó (sai nghĩa)." },
          { q: "4. Unemployment fell in all five regions, ___ the north-east seeing the largest drop.", options: ["which", "while", "and", "with"], correct: 3, why: "Sau chỗ trống là N + V-ing (the north-east **seeing**) ⇒ absolute clause mở bằng **with**. while / and cần động từ chia thì." },
          { q: "5. ___ the report twice, I still could not understand the main argument.", options: ["Reading", "Having read", "Read", "Being read"], correct: 1, why: "Đọc xong hai lần **trước**, rồi vẫn không hiểu ⇒ Having + V3." },
          { q: "6. If ___ properly, wind farms cause little harm to wildlife.", options: ["siting", "sited", "they sited", "to site"], correct: 1, why: "Trang trại gió **được đặt** (bị động) ⇒ If + V3: If sited properly. (site = đặt ở một vị trí.)" },
          { q: "7. The techniques ___ in this chapter were first developed for the aircraft industry.", options: ["describing", "are described", "described", "which describes"], correct: 2, why: "Câu đã có động từ chính (were developed). Chỗ trống là quan hệ rút gọn bị động: the techniques (which are) **described**." },
          { q: "8. ___ speaking, people in the north of the country earn less.", options: ["General", "In general", "Generally", "Generalising"], correct: 2, why: "Cụm cố định **Generally speaking**. In general đứng một mình, không có speaking." },
          { q: "9. With oil prices ___ rapidly, many airlines raised their fares.", options: ["rose", "risen", "raised", "rising"], correct: 3, why: "with + N + V-ing; rise là nội động từ (giá tự tăng) ⇒ **rising**. Sau with không có động từ chia thì (rose)." },
          { q: "10. Although ___ for 500 pupils, the school now has nearly 900.", options: ["designed", "designing", "it designed", "was designed"], correct: 0, why: "although + V3 (bỏ it was): Although **designed** for 500 pupils. D thiếu chủ ngữ." },
        ],
      },
      {
        t: "quiz",
        id: "t4d5-np-dien",
        kind: "fill",
        title: "Viết dạng đúng của động từ trong ngoặc — một đến ba từ (8 câu)",
        items: [
          { q: "___ (raise) by her grandparents, she speaks the local dialect fluently.", answers: ["Raised", "Having been raised"] },
          { q: "The river burst its banks, ___ (flood) hundreds of homes.", answers: ["flooding"] },
          { q: "___ (not / have) access to clean water, many villagers fall ill every year.", answers: ["Not having"] },
          { q: "___ (complete) her degree, she moved to Singapore to look for work.", answers: ["Having completed", "After completing"] },
          { q: "As ___ (show) in Figure 2, spending peaked in 2015.", answers: ["shown"] },
          { q: "The villages ___ (affect) by the flood received emergency aid within days.", answers: ["affected"] },
          { q: "Tourist numbers fell sharply, with only 2 million visitors ___ (record) in 2021.", answers: ["recorded", "being recorded"] },
          { q: "The questions ___ (discuss) at tomorrow's meeting have already been sent to members. (sẽ được thảo luận)", answers: ["to be discussed"] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d5-doc",
    kind: "reading",
    title: "Đọc: True / False / Not Given · Yes / No / Not Given — ba bẫy band 7",
    goal: "Tách một câu hỏi TFNG / YNNG thành từng vế và không còn mất điểm vì ba bẫy band 7 — câu “đúng một nửa”, so sánh ngầm (bài không hề so sánh) và con số bị đổi — để đạt ít nhất 10/13 ở một bài Passage 3 lập luận dài 900 từ trong 20 phút.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Bạn đã học TFNG / YNNG bốn lần: Tập 1 Ngày 12, **Tập 2 Ngày 6** (5 bẫy cơ bản), **Tập 3 Ngày 3** (paraphrase hệ thống) và **Tập 3 Ngày 23** (ý của ai, từ cực đoan, giọng điệu). Hôm nay là vòng band 7.",
          "Ở Passage 3, câu hỏi dài hơn và thường có **hai vế**. Người ra đề cho một vế khớp bài rất rõ để bạn yên tâm chọn TRUE / YES — vế còn lại mới là chỗ quyết định. Đó là bẫy ==đúng một nửa==.",
          "Bẫy ==so sánh ngầm==: câu hỏi so A với B (more than, the most, unlike), nhưng bài chỉ nói về A, hoặc nói về A và B mà **không so** ⇒ NOT GIVEN.",
          "Bẫy ==số đổi==: almost a third ↔ more than a third · doubled **to** 22% ↔ rose **by** 22 points · seven out of ten ↔ 70%. Phải đọc cả **con số, giới từ và từ rào** đi kèm.",
          "Mục tiêu đo được: Passage 3 ≥ 9/13 (band 7 Reading cần 30/40). Dạng TFNG / YNNG chiếm 5–9 câu ở gần như mọi đề.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn 2 phút: ba đáp án, hai dạng (nối Tập 2 Ngày 6 · Tập 3 Ngày 3 · Tập 3 Ngày 23)" },
      {
        t: "table",
        head: ["Đáp án", "Nghĩa", "Phép thử"],
        rows: [
          ["**TRUE / YES**", "Bài nói **đúng ý đó** (bằng lời khác).", "Chỉ được ra câu chứa đáp án và mọi vế của câu hỏi đều khớp."],
          ["**FALSE / NO**", "Bài nói **ngược lại**, hoặc nói điều khiến câu hỏi không thể đúng.", "Chỉ được ra câu trong bài; sửa câu hỏi cho đúng được bằng thông tin của bài."],
          ["**NOT GIVEN**", "Bài **không cho đủ thông tin** để biết đúng hay sai.", "Không chỉ ra được câu nào; muốn trả lời phải tự suy thêm ngoài bài."],
        ],
        caption: "TFNG hỏi về THÔNG TIN (facts) trong bài; YNNG hỏi về QUAN ĐIỂM / NHẬN ĐỊNH của tác giả (views / claims of the writer). Cách làm giống nhau; ở YNNG phải hỏi thêm “ý này của AI?” (Tập 3 Ngày 23 mục 2).",
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: 5 bẫy cơ bản đã học — vẫn xuất hiện ở band 7",
        items: [
          "Từ cực đoan (all · only · never · always) đối với từ rào (some · often · tend to · may).",
          "Cùng từ khoá nhưng điểm bị hỏi không có trong bài ⇒ NOT GIVEN.",
          "Ý của người được thuật lại bị gán cho tác giả.",
          "Đổi thì: was ↔ is · will ↔ has.",
          "Đổi nguyên nhân: A xảy ra **cùng lúc** B ↔ A **gây ra** B.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Bẫy band 7 số 1 — câu “đúng một nửa”" },
      {
        t: "p",
        text: "Câu hỏi band 7 hay có dạng **X, and / because / which Y**. Bạn tìm thấy X trong bài, mừng quá, chọn TRUE. Nhưng đáp án phụ thuộc vào **vế yếu nhất**: một vế sai ⇒ cả câu **FALSE / NO**; một vế đúng, vế kia bài không nói ⇒ cả câu **NOT GIVEN**. Chỉ khi **mọi vế** đều khớp mới là TRUE / YES.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Tách vế — 4 bước cho mỗi câu hỏi",
        steps: [
          { label: "1. Gạch chéo câu hỏi thành các vế", sub: "The scheme was launched in 2010 / and / cut waste by half." },
          { label: "2. Kiểm vế 1 trong bài", sub: "launched in 2010 ✔" },
          { label: "3. Kiểm TỪNG vế còn lại — riêng rẽ", sub: "by half? Bài: “by a quarter” ✘" },
          { label: "4. Kết luận theo vế yếu nhất", sub: "✔ + ✘ ⇒ FALSE · ✔ + không nói ⇒ NOT GIVEN · ✔ + ✔ ⇒ TRUE" },
        ],
        caption: "Từ nối vế cũng là một vế: because / so / in order to / as a result — bài có nói đúng quan hệ nhân quả đó không?",
      },
      {
        t: "table",
        head: ["Bài viết", "Câu hỏi", "Đáp án · vì sao"],
        rows: [
          ["The museum reopened in 2018 after a two-year closure. Visitor numbers have since risen by 15%.", "The museum reopened in 2018, **and** visitor numbers have doubled since then.", "**FALSE** — vế 1 đúng; vế 2: tăng 15%, không phải gấp đôi."],
          ["The museum reopened in 2018 after a two-year closure. Visitor numbers have since risen by 15%.", "The museum reopened in 2018 **with a new entrance fee**.", "**NOT GIVEN** — vế 1 đúng; bài không nói gì về vé vào cửa."],
          ["The museum reopened in 2018 after a two-year closure. Visitor numbers have since risen by 15%.", "Visitor numbers rose **because** the museum had been modernised.", "**NOT GIVEN** — có tăng, nhưng bài không nêu lý do; “modernised” cũng không có."],
          ["The museum reopened in 2018 after a two-year closure. Visitor numbers have since risen by 15%.", "The museum was closed for two years **before** it reopened in 2018.", "**TRUE** — cả hai vế khớp (a two-year closure = closed for two years)."],
        ],
        caption: "Cùng một đoạn bài, bốn câu hỏi hai vế, ba đáp án khác nhau.",
      },

      /* ── 3 ── */
      { t: "h", text: "3. Bẫy band 7 số 2 — so sánh ngầm" },
      {
        t: "p",
        text: "Câu hỏi có **more / less / -er than, the most, as … as, unlike, compared with, the first, the only** là câu hỏi so sánh. Hãy hỏi ngay: **bài có so hai thứ này với nhau không?** Có ba tình huống.",
      },
      {
        t: "table",
        head: ["Tình huống trong bài", "Ví dụ bài", "Câu hỏi", "Đáp án"],
        rows: [
          ["Bài chỉ nói về **A**", "In Venning the average journey took 34 minutes.", "Journeys in Venning took longer than in Harlow.", "**NOT GIVEN** — không có số của Harlow."],
          ["Bài nói về A **và** B nhưng không cùng thước đo", "Harlow has a tram network. Venning's roads are congested.", "Public transport is better in Harlow than in Venning.", "**NOT GIVEN** — có tram ≠ tốt hơn; không có phép so."],
          ["Bài **so sánh thật**, bằng lời khác", "A higher proportion walked in Castra than in either of the other cities.", "Walking to work was most common in Castra.", "**TRUE** — higher than either of the other two = the most."],
          ["Bài so sánh **ngược chiều**", "Journeys took four minutes longer than in 2012.", "Journey times in Venning have fallen since 2012.", "**FALSE** — longer ≠ fallen."],
        ],
        caption: "Phép so sánh có thể ẩn trong một từ: overtake · outperform · exceed · lag behind · unlike · no longer · the leading… Hãy đọc chậm quanh những từ đó.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: so sánh với QUÁ KHỨ cũng là so sánh",
        items: [
          "Câu hỏi: “X is **more** popular **than it used to be**.” ⇒ bài phải cho biết cả trước đây lẫn bây giờ (hoặc dùng từ chỉ thay đổi: has grown, increasingly, no longer).",
          "Bài chỉ nói “X is very popular today” ⇒ **NOT GIVEN** — không biết trước đây thế nào.",
          "Từ dễ lọt: **still** (ngầm nói trước cũng vậy) · **now** / **today** (thường ngầm nói trước thì khác — nhưng phải có chữ xác nhận) · **remain** (không đổi).",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bẫy band 7 số 3 — con số bị đổi" },
      {
        t: "p",
        text: "Người ra đề hiếm khi đổi 48% thành 84% — quá lộ. Họ đổi **cách diễn đạt con số** và chờ bạn tính nhầm, hoặc giữ nguyên con số nhưng đổi **giới từ / từ rào / thứ được đo**.",
      },
      {
        t: "table",
        head: ["Kiểu đổi", "Bài viết", "Câu hỏi", "Đáp án"],
        rows: [
          ["Phân số ↔ phần trăm (khớp)", "seven out of ten commuters drove", "70% of commuters travelled by car", "TRUE"],
          ["Từ rào quanh con số", "**almost** a third", "**more than** a third", "FALSE — almost = chưa tới"],
          ["Từ rào quanh con số", "**just over** half", "**a majority**", "TRUE — trên 50% là đa số"],
          ["to ↔ by", "the share doubled **to** 22%", "the share rose **by** 22 percentage points", "FALSE — từ 11% lên 22% là tăng 11 điểm"],
          ["Mức tăng ↔ mức cuối", "prices rose **by** a fifth", "prices reached a fifth of their earlier level", "FALSE"],
          ["Bội số", "three times as many", "an increase of 300%", "FALSE — gấp ba = tăng 200%"],
          ["Thứ được đo", "81% **of respondents in Castra** were satisfied", "81% **of all respondents** were satisfied", "FALSE / NOT GIVEN tuỳ bài — sai mẫu số"],
          ["Mốc thời gian", "banned **since** 2015", "banned **until** 2015", "FALSE"],
          ["Số ↔ xếp hạng", "the second-largest exporter", "exports more than any other country", "FALSE"],
        ],
        caption: "Gặp số trong câu hỏi: khoanh CẢ CỤM (từ rào + số + đơn vị + giới từ + của cái gì), rồi tìm cả cụm đó trong bài.",
      },
      {
        t: "table",
        head: ["Từ rào quanh số", "Nghĩa", "Khớp với"],
        rows: [
          ["almost · nearly · just under · close to · approaching", "chưa tới, sát nút", "slightly fewer / less than"],
          ["just over · slightly more than · a little above", "vừa qua", "more than (một chút)"],
          ["around · roughly · approximately · some 40%", "khoảng", "about"],
          ["at least · no fewer than · a minimum of", "tối thiểu", "… or more"],
          ["up to · as many as · a maximum of · no more than", "tối đa", "… or fewer"],
          ["well over · far more than", "vượt xa", "considerably more than"],
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Khởi động — đoạn khoảng 180 từ, 6 câu TFNG (6 phút)" },
      { t: "p", text: "Đây là đoạn **thông tin** (facts) ⇒ dạng **True / False / Not Given**. Với mỗi câu: gạch vế, khoanh cụm số, tìm từ so sánh. Làm xong mới xem giải thích." },
      {
        t: "passage",
        title: "Getting to Work in Three Cities",
        paras: [
          { text: "A transport survey carried out in 2022 questioned 6,000 commuters in three cities: Harlow, Venning and Castra. In Harlow, 48 per cent of respondents travelled to work by car, down from 61 per cent a decade earlier, while the share using the tram had doubled to 22 per cent. Cycling accounted for 9 per cent of journeys, although three-quarters of cyclists said they rode to work only between April and September." },
          { text: "Venning, a smaller city without a tram network, remained dependent on the car: seven out of ten commuters drove, and the average journey took 34 minutes, four minutes longer than in 2012. Castra presented a different picture. Just under a third of its commuters walked to work, a higher proportion than in either of the other cities, largely because most offices are concentrated in a compact historic centre from which private cars have been banned since 2015 — the only part of the city where such a ban applies. The survey's authors noted that satisfaction was highest in Castra, where 81 per cent of respondents described their commute as ‘pleasant’ or ‘very pleasant’. Respondents were not asked how much they spent on travel." },
        ],
      },
      {
        t: "mcq",
        id: "t4d5-doc-khoi-dong",
        title: "Do the following statements agree with the information in the text? (6 câu)",
        items: [
          { q: "1. Fewer than half of Harlow's commuters drove to work in 2022.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“48 per cent of respondents travelled to work by car” — 48% < 50% ⇒ TRUE. Số đổi cách nói nhưng khớp." },
          { q: "2. Tram use in Harlow rose by 22 percentage points over ten years.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“the share using the tram had doubled **to** 22 per cent” ⇒ từ 11% lên 22%, tức tăng **11** điểm. Bẫy số đổi: to ↔ by." },
          { q: "3. Most people who cycle to work in Harlow do so all year round.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“three-quarters of cyclists said they rode to work only between April and September” ⇒ đa số chỉ đạp nửa năm ⇒ FALSE." },
          { q: "4. The average car journey to work took longer in Venning than in Harlow.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ cho thời gian ở Venning (34 phút) và so với **năm 2012**, không có số của Harlow ⇒ NOT GIVEN. Bẫy so sánh ngầm." },
          { q: "5. About a third of commuters in Castra walk to work because cars are banned throughout the city.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Vế 1 đúng (just under a third ≈ about a third). Vế 2 sai: xe hơi chỉ bị cấm ở “a compact historic centre” — bài nói rõ “**the only part of the city** where such a ban applies”, không phải cả thành phố ⇒ FALSE. Bẫy đúng một nửa." },
          { q: "6. Commuters in Castra spent less on travel than those in the other two cities.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "“Respondents were not asked how much they spent on travel.” Không có dữ liệu chi phí ⇒ NOT GIVEN. Đi bộ nhiều KHÔNG cho phép tự suy ra tốn ít tiền." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chiến thuật 6 bước cho Passage 3 (≈ 12 phút cho 9 câu)" },
      {
        t: "sodo",
        kind: "flow",
        title: "TFNG / YNNG band 7",
        steps: [
          { label: "1. Đọc hướng dẫn", sub: "information ⇒ TRUE/FALSE · views / claims of the writer ⇒ YES/NO" },
          { label: "2. Đọc cả cụm câu hỏi", sub: "Câu hỏi đi THEO THỨ TỰ bài ⇒ câu 3 nằm giữa chỗ của câu 2 và câu 4." },
          { label: "3. Gạch vế + khoanh 3 thứ", sub: "số (cả cụm) · từ so sánh · từ mức độ / nhân quả" },
          { label: "4. Tìm chỗ bằng danh từ riêng / số / thuật ngữ", sub: "Castell · surgeons · staff-to-student ratio" },
          { label: "5. Đọc 2–3 câu quanh đó, kiểm từng vế", sub: "YNNG: ý của ai? tác giả đồng tình đến mức nào?" },
          { label: "6. Không thấy sau 90 giây ⇒ NOT GIVEN, đi tiếp", sub: "Đừng đọc lại cả bài để “tìm cho ra”." },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo phân biệt NO và NOT GIVEN ở band 7",
        items: [
          "**NO / FALSE**: bạn **sửa được** câu hỏi bằng chữ của bài. (“more than a third” → bài: almost a third.)",
          "**NOT GIVEN**: bạn muốn sửa nhưng **không có gì để sửa** — bài im lặng về đúng điểm đó.",
          "Tác giả nói “**it is difficult to establish whether**…” = tác giả **không khẳng định** ⇒ câu hỏi khẳng định điều đó thường là NOT GIVEN, trừ khi tác giả nói rõ là không đúng.",
          "Đừng dùng kiến thức ngoài bài. “Ai cũng biết đi bộ thì rẻ” không phải là thông tin trong bài.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện trọn bài — Questions 1–13 (20 phút)" },
      { t: "p", text: "Bài lập luận mức **Passage 3** (~900 từ): tác giả nêu quan điểm, thuật lại ý người khác rồi đánh giá. Bấm giờ **20 phút**. Đọc câu 1–9 trước (gạch vế, khoanh số và từ so sánh), skim bài 2 phút, rồi làm. Đừng xem giải thích trước khi xong cả 13 câu." },
      {
        t: "passage",
        title: "When the Measure Becomes the Target",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "Thirty years ago, a hospital that wished to know whether it was doing well had little to rely on beyond the judgement of its senior doctors. Today it can consult a league table. The change has been remarkably rapid, and it has reached almost every public service. Schools, universities, police forces and even individual surgeons are now ranked against one another according to a handful of published numbers. The appeal is obvious: a single figure seems more objective than a professional's opinion, and it allows a parent or a patient to compare institutions at a glance. I do not dispute that some measurement of this kind is necessary. My concern is with what happens to a number once people's careers begin to depend on it." },
          { label: "B", text: "In the 1970s the economist Charles Goodhart observed that a statistic tends to lose its value as an indicator once it is used to control behaviour, a principle now known as Goodhart's law. The mechanism is simple. A measure is chosen because it normally accompanies the thing we care about: pupils who have learned a great deal usually score well in examinations. But the relationship holds only while nobody is trying to manipulate it. Once teachers are rewarded for scores rather than for learning, the cheapest way to raise the number is rarely to improve the underlying reality. It is to teach the test. Pupils are drilled in the precise form of last year's questions, lessons on anything that will not be examined are quietly dropped, and the scores climb while understanding stands still." },
          { label: "C", text: "The evidence that this happens is by now considerable. In a study of 140 secondary schools, the education researcher Miriam Castell found that average examination results rose by 12 per cent in the five years after rankings were introduced. Over the same period, however, the time devoted to subjects that did not count towards the ranking — music, art and physical education — fell by almost a third, and scores on an independent test of reasoning, for which the schools had no incentive to prepare, did not change at all. Supporters of the tables pointed to the first figure; they seldom mentioned the other two. Castell herself was careful not to claim that pupils had learned nothing extra. Her conclusion was narrower: the published results had stopped telling us how much they had learned." },
          { label: "D", text: "Health care offers a starker illustration. When one health authority began publishing the death rates of individual heart surgeons, the rates duly improved. Yet a later review suggested that part of the improvement had come about because some surgeons had grown reluctant to operate on the sickest patients, whose chances of survival were poor and who would therefore have damaged their record. Nobody had cheated; no figure had been falsified. Each surgeon had simply responded rationally to the incentive placed in front of him or her. This, to my mind, is the most troubling feature of target culture: it does not require dishonest people in order to produce dishonest numbers." },
          { label: "E", text: "Defenders of league tables make two replies, and both deserve to be taken seriously. The first is that the alternative is worse. Before performance data were published, a weak institution could shelter for decades behind a good reputation, and it was the poorest families who were least able to discover the truth. I accept this entirely. Publication has exposed failures that would otherwise have continued unnoticed, and no serious critic wishes to return to an age of comfortable secrecy. The second reply is that gaming can be defeated by better design: if one indicator is being manipulated, add another. Here I am less persuaded. Every new indicator creates a new opportunity for manipulation, and an organisation that is tracking forty targets is, in practice, tracking none; its staff merely learn which three the managers actually look at." },
          { label: "F", text: "University rankings show how far the process can go. Several of the best-known international tables give weight to the ratio of staff to students, a figure intended to capture the quality of teaching. It has been reported that some institutions responded by reclassifying researchers who never enter a lecture hall as teaching staff. Others have turned away more applicants — not in order to raise standards, but because a low acceptance rate is itself rewarded as a sign of prestige. Whether such tactics are widespread is difficult to establish, since no university has an interest in admitting to them. What is clear is that the tables cannot distinguish an institution that has improved from one that has merely learned to look as if it has." },
          { label: "G", text: "None of this is an argument for abandoning measurement. It is an argument for changing who uses the numbers, and for what. Figures that are collected in order to help professionals understand their own work tend to remain honest, because nobody gains by distorting them. The trouble begins when the same figures are used to reward and to punish. A modest proposal follows: publish the data, by all means, but stop compressing them into a single rank, and never tie an individual's pay to one indicator. Such a system would be less tidy than a league table. It would probably also be less popular with newspapers, which are fond of lists. But it would have the considerable merit of measuring something real." },
        ],
      },
      { t: "p", text: "**Questions 1–9.** Do the following statements agree with the claims of the writer in the reading passage? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this." },
      {
        t: "mcq",
        id: "t4d5-doc-ynng",
        title: "Questions 1–9 — Yes / No / Not Given",
        items: [
          { q: "1. Some measurement of the performance of public institutions is needed.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn A: “I do not dispute that some measurement of this kind is necessary.” do not dispute → đồng ý; necessary → needed ⇒ YES." },
          { q: "2. League tables first became popular because they were inexpensive to produce.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn A nêu sức hấp dẫn: có vẻ khách quan + so sánh nhanh. Không chữ nào về chi phí làm bảng ⇒ NOT GIVEN. Bẫy: câu hỏi có vế “because…” — lý do này bài không nêu." },
          { q: "3. An indicator stays reliable only for as long as people do not attempt to influence it.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “the relationship holds only while nobody is trying to manipulate it.” holds → stays reliable; manipulate → influence ⇒ YES." },
          { q: "4. In the schools Castell studied, the time given to subjects outside the rankings fell by more than a third.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: “fell by **almost** a third”. almost = chưa tới; câu hỏi: more than ⇒ NO. Bẫy số đổi — con số giống, từ rào khác." },
          { q: "5. Examination results improved most in the schools that had previously been the weakest.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ cho mức tăng trung bình 12% của cả 140 trường; không so trường yếu với trường mạnh ⇒ NOT GIVEN. Bẫy so sánh ngầm (most … the weakest)." },
          { q: "6. The fall in surgeons' published death rates was partly achieved by falsifying records.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn D: tỉ lệ có cải thiện (vế 1 đúng), nhưng “Nobody had cheated; **no figure had been falsified**.” ⇒ vế 2 trái bài ⇒ NO. Bẫy đúng một nửa." },
          { q: "7. Misleading statistics can be produced even when everyone involved behaves honestly.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “it does not require dishonest people in order to produce dishonest numbers.” dishonest numbers → misleading statistics ⇒ YES." },
          { q: "8. Both of the replies offered by defenders of league tables are convincing.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn E: lời đáp 1 — “I accept this entirely”; lời đáp 2 — “Here I am less persuaded.” Một được, một không ⇒ “both … convincing” là NO. Bẫy đúng một nửa. (“both deserve to be taken seriously” ≠ cả hai thuyết phục.)" },
          { q: "9. International university rankings are easier to manipulate than national school tables.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn F chỉ nói bảng xếp hạng đại học cho thấy quá trình “can go” xa tới đâu; không hề so độ dễ thao túng với bảng xếp hạng trường phổ thông ⇒ NOT GIVEN. Bẫy so sánh ngầm." },
        ],
      },
      { t: "p", text: "**Questions 10–13.** Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t4d5-doc-mcq",
        title: "Questions 10–13 — Multiple choice (mục đích · thái độ · lập trường)",
        items: [
          { q: "10. The writer mentions the independent test of reasoning in paragraph C in order to", options: ["A show that pupils had become less able after rankings were introduced.", "B suggest that real learning had not risen in line with the published results.", "C prove that teachers in the 140 schools had cheated.", "D argue that such tests should replace public examinations."], correct: 1, why: "Điểm thi tăng 12% nhưng bài kiểm tra độc lập “did not change at all” ⇒ kết quả công bố không còn phản ánh việc học thật (kết luận của Castell). A sai: không đổi ≠ kém đi. C: bài không nói gian lận. D: không có." },
          { q: "11. What does the writer find most troubling about the case of the heart surgeons?", options: ["A Patients died who could have been saved.", "B The review was carried out too late.", "C Surgeons were paid according to their results.", "D The distortion arose from rational behaviour rather than from cheating."], correct: 3, why: "Đoạn D: “Each surgeon had simply responded rationally… This, to my mind, is the most troubling feature…: it does not require dishonest people…” ⇒ D. A, B, C không được nêu." },
          { q: "12. In paragraph F, the writer's attitude to the claim that universities manipulate their rankings is", options: ["A cautious about how common it is, but confident about the weakness it exposes.", "B certain that most universities are guilty of it.", "C dismissive, since no university has admitted it.", "D convinced that only the most prestigious institutions do it."], correct: 0, why: "“It has been reported that…”, “Whether such tactics are widespread is difficult to establish” (thận trọng về mức phổ biến) + “What is clear is that the tables cannot distinguish…” (chắc về điểm yếu) ⇒ A." },
          { q: "13. Which of the following best summarises the writer's overall position?", options: ["A League tables should be abolished and measurement abandoned.", "B Performance data should be collected but kept from the public.", "C Data should be published, but not reduced to a single rank or linked to individual pay.", "D More indicators should be added so that manipulation becomes impossible."], correct: 2, why: "Đoạn G: “publish the data, by all means, but stop compressing them into a single rank, and never tie an individual's pay to one indicator.” A trái câu đầu đoạn G; B trái “publish”; D là ý tác giả bác ở đoạn E." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Phân tích sau khi làm — câu nào chứa đáp án, bẫy kiểu gì" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu trong bài", "Kiểu paraphrase / bẫy"],
        rows: [
          ["1", "YES", "A: I do not dispute that some measurement… is necessary", "phủ định kép → khẳng định (mức 3: đổi cấu trúc)"],
          ["2", "NG", "A: The appeal is obvious: …", "vế “because” không có trong bài"],
          ["3", "YES", "B: the relationship holds only while nobody is trying to manipulate it", "đổi cả cụm: holds ↔ stays reliable (mức 3)"],
          ["4", "NO", "C: fell by almost a third", "==số đổi==: almost ↔ more than"],
          ["5", "NG", "C: average… rose by 12 per cent", "==so sánh ngầm==: bài không chia nhóm trường"],
          ["6", "NO", "D: no figure had been falsified", "==đúng một nửa==: vế 2 trái bài"],
          ["7", "YES", "D: it does not require dishonest people…", "danh từ ↔ mệnh đề (mức 4: đổi cả cách nhìn)"],
          ["8", "NO", "E: I accept this entirely… Here I am less persuaded", "==đúng một nửa==: both ↔ một trong hai"],
          ["9", "NG", "F: University rankings show how far the process can go", "==so sánh ngầm==: không có phép so"],
        ],
        caption: "Sai câu 4–6–8 ⇒ đọc lại mục 2 và 4. Sai câu 2–5–9 ⇒ đọc lại mục 3 và mẹo phân biệt NO / NOT GIVEN.",
      },
      {
        t: "p",
        text: "**Soi ngữ pháp của bài 1 trong bài đọc.** Đoạn C: “scores on an independent test of reasoning, **for which** the schools had no incentive to prepare, **did not change**” — động từ chính là did not change. Đoạn F: “a figure **intended** to capture the quality of teaching” = a figure **which is intended**… (quan hệ rút gọn bị động). Đoạn G: “Figures that are collected… tend to remain honest” — động từ chính là **tend**. Đọc Passage 3 nhanh hơn hẳn khi bạn tìm ra động từ chính trước.",
      },

      /* ── 9 ── */
      { t: "h", text: "9. Từ vựng hữu ích từ bài đọc (10 từ)" },
      {
        t: "vocab",
        items: [
          { w: "league table", pos: "n", ipa: "/ˈliːɡ ˌteɪbl/", vi: "bảng xếp hạng (trường, bệnh viện…)", ex: "The school rose twenty places in the national league table.", exVi: "Ngôi trường tăng hai mươi bậc trên bảng xếp hạng quốc gia.", more: "**top / come bottom of** the league table · = ranking (n) · Mỹ thường dùng **rankings**" },
          { w: "indicator", pos: "n", ipa: "/ˈɪndɪkeɪtə/", vi: "chỉ số, chỉ báo", ex: "Life expectancy is a useful indicator of a country's health.", exVi: "Tuổi thọ là một chỉ số hữu ích về sức khoẻ của một quốc gia.", more: "a reliable / key / economic **indicator of** · họ từ: indicate (v) · indication (n) · indicative (adj)" },
          { w: "compress", pos: "v", ipa: "/kəmˈpres/", vi: "nén, thu gọn (nhiều thông tin vào ít chỗ)", ex: "The report compresses ten years of data into a single chart.", exVi: "Bản báo cáo nén dữ liệu mười năm vào một biểu đồ duy nhất.", more: "compress A **into** B · compression (n) · bài đọc đoạn G: stop **compressing** them into a single rank" },
          { w: "manipulate", pos: "v", ipa: "/məˈnɪpjuleɪt/", vi: "thao túng, nắn chỉnh (số liệu, người)", ex: "Some firms manipulate their figures to please investors.", exVi: "Một số công ty nắn số liệu để làm hài lòng nhà đầu tư.", more: "manipulate **data / figures / public opinion** · manipulation (n) · manipulative (adj — chỉ người)" },
          { w: "distort", pos: "v", ipa: "/dɪˈstɔːt/", vi: "bóp méo, làm sai lệch", ex: "A few extreme cases can distort the average.", exVi: "Một vài trường hợp cực đoan có thể làm sai lệch con số trung bình.", more: "distort **the truth / the facts / the market** · distortion (n) · a distorted picture of" },
          { w: "falsify", pos: "v", ipa: "/ˈfɔːlsɪfaɪ/", vi: "làm giả (hồ sơ, số liệu)", ex: "The manager was dismissed for falsifying the safety records.", exVi: "Người quản lý bị sa thải vì làm giả hồ sơ an toàn.", more: "falsify **records / data / documents** · mạnh hơn distort: cố ý ghi sai · falsification (n)" },
          { w: "underlying", pos: "adj", ipa: "/ˌʌndəˈlaɪɪŋ/", vi: "nằm bên dưới, căn bản (nguyên nhân, thực tế)", ex: "The policy treats the symptoms, not the underlying causes.", exVi: "Chính sách này chữa triệu chứng chứ không chữa nguyên nhân gốc rễ.", more: "the underlying **cause / problem / assumption / trend** · luôn đứng trước danh từ" },
          { w: "reluctant", pos: "adj", ipa: "/rɪˈlʌktənt/", vi: "ngần ngại, miễn cưỡng", ex: "Many employers are reluctant to hire people without experience.", exVi: "Nhiều chủ lao động ngần ngại thuê người chưa có kinh nghiệm.", more: "be reluctant **to + V** · reluctance (n) · reluctantly (adv) · ≠ willing" },
          { w: "prestige", pos: "n", ipa: "/preˈstiːʒ/", vi: "uy tín, danh giá", ex: "A degree from that university still carries great prestige.", exVi: "Tấm bằng của trường đó vẫn rất danh giá.", more: "không đếm được · **enjoy / carry** prestige · prestigious (adj) /preˈstɪdʒəs/ — a prestigious university" },
          { w: "stark (starker)", pos: "adj", ipa: "/stɑːk/", vi: "rõ rệt đến gay gắt (sự tương phản, minh hoạ, lựa chọn)", ex: "There is a stark contrast between the two neighbourhoods.", exVi: "Có một sự tương phản rõ rệt giữa hai khu dân cư.", more: "a stark **contrast / choice / reminder / warning** · in stark contrast to — dùng tốt trong Task 1 và Task 2" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t4d5-nghe",
    kind: "listening",
    title: "Nghe: Part 3 — bốn người nói, Matching ý kiến",
    goal: "Theo được một buổi thảo luận Part 3 có bốn giọng ở tốc độ khoảng 165 từ / phút, biết ai tán thành – ai chỉ đồng ý một phần – ai bác, và làm đúng ít nhất 8/10 câu Matching ý kiến + trắc nghiệm; nhận ra cụm từ bị nuốt /t/ /d/ (next week → /neks wiːk/).",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Part 3 bạn đã làm với hai người (Tập 2 Ngày 13) và ba người (**Tập 3 Ngày 8**). Band 7 thêm người thứ tư và tăng tốc lên ~165 từ / phút: một giảng viên + ba sinh viên.",
          "Dạng hôm nay: **Matching ý kiến** — ghép 6 nguồn dữ liệu với nhận xét mà nhóm **chốt** về từng nguồn (hộp A–H, thừa 2), rồi 4 câu trắc nghiệm.",
          "Khó ở band 7 không phải từ vựng mà là ==ý kiến bị rút lại==: một người nêu nhận xét, người khác bác bằng một thông tin mới, và đáp án là nhận xét **còn đứng được sau cùng**.",
          "Ngôn ngữ phải nghe ra: đồng ý **một phần** (I take your point, but… · up to a point) khác đồng ý hẳn (Exactly · I'd go along with that).",
          "🔊 Phát âm: **nuốt /t/ /d/ giữa hai phụ âm** — nex(t) week, las(t) year, ol(d) names. Không biết hiện tượng này thì nghe “next week” thành một từ lạ.",
          "Mục tiêu đo được: Part 3 + Part 4 ≥ 14/20 để Listening đạt 30/40 (band 7).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Bốn người nói — giữ được ai là ai" },
      {
        t: "p",
        text: "Trước khi băng chạy bạn có khoảng 30 giây đọc câu hỏi. Dành 5 giây đầu cho **lời dẫn**: nó luôn đọc tên theo thứ tự (“three students, Mia, Callum and Niamh, talking to their tutor, Dr Okafor”). Ghi ngay bốn chữ cái **M · C · N · Dr** ra nháp. Trong 20 giây đầu của bài, mỗi người thường được **gọi tên** một lần — đó là lúc bạn khớp giọng với tên.",
      },
      {
        t: "table",
        head: ["Manh mối", "Cách dùng"],
        rows: [
          ["**Giới + giọng vùng**", "Bài hôm nay: thầy — nam, giọng Anh · Mia — nữ, giọng Mỹ · Callum — nam, giọng Úc · Niamh /niːv/ — nữ, giọng Ireland. Hai nam, hai nữ, bốn giọng khác nhau."],
          ["**Gọi tên nhau**", "“That's exactly my worry, **Mia**.” ⇒ người đang nói KHÔNG phải Mia; câu trước đó là của Mia."],
          ["**Vai**", "Giảng viên hỏi, đánh giá, giao việc (“What you haven't done is…”); sinh viên đề xuất, phân vân, nhận việc."],
          ["**Lập trường nhất quán**", "Người đã bênh một phương án thường tiếp tục bênh — cho tới khi nói rõ là đổi ý (“OK, I'm coming round to it”)."],
        ],
        caption: "Tên Ireland viết Niamh nhưng đọc /niːv/ — giống “Neeve”. Đề thật cũng có tên lạ; lời dẫn sẽ đọc cho bạn nghe.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ngôn ngữ ý kiến band 7 — đồng ý hẳn, đồng ý một phần, bác" },
      {
        t: "table",
        head: ["Mức", "Nghe thấy", "Nghĩa thật"],
        rows: [
          ["Đồng ý hẳn", "Exactly. · Absolutely. · I'd go along with that. · You've convinced me. · That settles it.", "Ý vừa nêu được **chốt** — thường là đáp án."],
          ["Đồng ý một phần", "I take your point, but… · Up to a point. · That's true as far as it goes. · I wouldn't go that far. · Fair enough, though…", "Phần sau **but / though** mới là ý của người nói."],
          ["Bác lịch sự", "I'm not convinced (that)… · I'm not sure that follows. · Do they, though? · That wasn't my impression.", "Ý vừa nêu **bị loại** — phương án đó là bẫy."],
          ["Bác bằng thông tin mới", "Actually, … · As it happens, … · In fact, … · Not any more — …", "Lo ngại ban đầu **không còn đúng** ⇒ loại nhận xét đó."],
          ["Đổi ý", "I'm coming round to it. · On reflection, … · I hadn't thought of that. · I stand corrected.", "Người nói **bỏ** ý cũ của chính mình."],
          ["Rút lại ý của mình", "I assumed… but… · I'd have said…, only… · My first thought was…", "Nửa đầu là điều KHÔNG còn đúng."],
        ],
        caption: "Mở rộng bảng tín hiệu của Tập 3 Ngày 8 mục 5 và Tập 3 Ngày 9 (bẫy đổi ý).",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: nhận xét được NÓI RA chưa chắc là nhận xét được CHỐT",
        items: [
          "Với mỗi mục cần ghép, băng thường nhắc **hai** nhận xét trong hộp: một cái bị bác, một cái đứng được.",
          "Mẫu hay gặp: A lo ngại X → B: “Actually, …” (xoá X) → B hoặc C nêu Y → A: “Fair enough.” ⇒ đáp án là **Y**.",
          "Đừng viết đáp án ngay khi nghe thấy từ khoá. Chờ tới khi nhóm **chuyển sang mục kế** (“What about…?”, “And the…?”) rồi mới chốt.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Khởi động — ai nói ý nào? (5 câu)" },
      { t: "p", text: "Nghe **một lần**. Ghi chữ cái của người nói: **A** Mia · **B** Callum · **C** Niamh · **D** Dr Okafor. Một người có thể được chọn hơn một lần." },
      {
        t: "listen",
        id: "t4d5-nghe-khoi-dong",
        title: "Choosing a project topic",
        dan: { so: "Day 5, Warm-up (Listening Part 3)", boiCanh: "three linguistics students, Mia, Callum and Niamh, choosing a project topic with their tutor, Dr Okafor.", cau: [1, 5] },
        note: "Khoảng 1 phút 20 giây, bốn giọng: Dr Okafor (Anh, nam) · Mia (Mỹ, nữ) · Callum (Úc, nam) · Niamh (Ireland, nữ).",
        lines: [
          { who: "Dr Okafor", voice: "uk-nam", text: "Right, you three need to settle on a topic today. What's on the table?", vi: "Nào, ba em cần chốt đề tài trong hôm nay. Đang có những phương án nào?" },
          { who: "Mia", voice: "us-nu", text: "I'd still go for slang — how teenagers' slang spreads online. It's current, and there's loads written about it.", vi: "Em vẫn chọn tiếng lóng — tiếng lóng của tuổi teen lan trên mạng thế nào. Nó thời sự, và có rất nhiều tài liệu viết về nó." },
          { who: "Callum", voice: "au-nam", text: "That's exactly my worry, Mia. Half the year group did slang last year. I can't see us saying anything new.", vi: "Đó chính là điều mình lo đấy, Mia. Nửa khoá đã làm tiếng lóng năm ngoái rồi. Mình không thấy bọn mình nói được gì mới." },
          { who: "Niamh", voice: "ie-nu", text: "I take your point about it being overdone, Callum, but I wouldn't rule it out altogether — it depends on the angle. My real concern is different: where would we get reliable examples? You can't just copy posts off social media.", vi: "Mình hiểu ý bạn là nó bị làm quá nhiều rồi, Callum, nhưng mình sẽ không loại hẳn — còn tuỳ góc nhìn. Điều mình thật sự lo là chuyện khác: bọn mình lấy ví dụ đáng tin ở đâu? Đâu thể cứ chép bài đăng trên mạng xã hội." },
          { who: "Mia", voice: "us-nu", text: "Hmm, I hadn't thought of that.", vi: "Ừm, mình chưa nghĩ tới chuyện đó." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Niamh's right to raise it. You'd need permission from every user you quote, and that can take weeks.", vi: "Niamh nêu ra là đúng. Các em sẽ cần xin phép từng người dùng mà mình trích, và việc đó có thể mất hàng tuần." },
          { who: "Callum", voice: "au-nam", text: "What about first names instead? I read a piece about names that have nearly died out.", vi: "Thế còn tên riêng thì sao? Mình đọc một bài về những cái tên gần như đã biến mất." },
          { who: "Mia", voice: "us-nu", text: "Names? I'm not convinced that's really linguistics.", vi: "Tên á? Mình không chắc đó thật sự là ngôn ngữ học." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Oh, it certainly is. Naming is a well-established field.", vi: "Ồ, chắc chắn là có. Nghiên cứu về cách đặt tên là một lĩnh vực đã có nền tảng vững." },
          { who: "Niamh", voice: "ie-nu", text: "And the birth records are open to anyone, aren't they? That solves the data problem.", vi: "Và hồ sơ khai sinh thì ai cũng xem được, đúng không ạ? Thế là giải quyết được vấn đề dữ liệu." },
          { who: "Mia", voice: "us-nu", text: "OK, I'm coming round to it.", vi: "Được, mình bắt đầu thấy xuôi rồi." },
        ],
      },
      {
        t: "mcq",
        id: "t4d5-nghe-kd-cau",
        title: "Questions 1–5 — Which speaker…? (A Mia · B Callum · C Niamh · D Dr Okafor)",
        items: [
          { q: "1. thinks the slang topic has been chosen too often?", options: ["A Mia", "B Callum", "C Niamh", "D Dr Okafor"], correct: 1, why: "Callum: “Half the year group did slang last year. I can't see us saying anything new.” Câu mở “That's exactly my worry, **Mia**” cho biết người nói không phải Mia." },
          { q: "2. accepts a criticism of the slang topic but does not reject the topic completely?", options: ["A Mia", "B Callum", "C Niamh", "D Dr Okafor"], correct: 2, why: "Niamh: “I take your point…, **but I wouldn't rule it out altogether**.” — đồng ý một phần." },
          { q: "3. says that getting permission would be slow?", options: ["A Mia", "B Callum", "C Niamh", "D Dr Okafor"], correct: 3, why: "Dr Okafor: “You'd need permission from every user you quote, and **that can take weeks**.” Niamh chỉ hỏi lấy ví dụ ở đâu, không nói về thời gian." },
          { q: "4. doubts that names are part of the subject they study?", options: ["A Mia", "B Callum", "C Niamh", "D Dr Okafor"], correct: 0, why: "Mia: “**I'm not convinced** that's really linguistics.” — bác lịch sự." },
          { q: "5. points out that the necessary data are publicly available?", options: ["A Mia", "B Callum", "C Niamh", "D Dr Okafor"], correct: 2, why: "Niamh: “the birth records are **open to anyone**, aren't they?” open to anyone → publicly available." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Matching ý kiến — 5 bước (nối Tập 3 Ngày 8 mục 3)" },
      {
        t: "sodo",
        kind: "flow",
        title: "5 bước làm Matching ở band 7",
        steps: [
          { label: "1. Đọc danh sách đánh số (21–26)", sub: "Băng nói theo ĐÚNG thứ tự này — đây là bản đồ của bạn." },
          { label: "2. Đọc hộp A–H, gạch chân 1–2 từ lõi mỗi dòng", sub: "too long · short period · wealthier · why · payment · most complete · legal · unrepresentative" },
          { label: "3. Đoán trước paraphrase", sub: "payment → subscription, fee, charge · legal → permission, data protection" },
          { label: "4. Mỗi mục: ghi nháp CẢ hai chữ cái nghe được", sub: "vd “21: A? F” — rồi gạch cái bị bác." },
          { label: "5. Chốt khi nhóm sang mục kế", sub: "“Right, school lists?” ⇒ mục 21 đã xong." },
        ],
        caption: "Hộp có 8 nhận xét cho 6 mục ⇒ 2 nhận xét không dùng, nhưng vẫn được NHẮC trong băng làm bẫy.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bài chính — Questions 21–30" },
      { t: "p", text: "Đọc câu hỏi trong **40 giây**, rồi nghe **một lần duy nhất** như thi thật. **Questions 21–26.** What comment do the students finally agree on about each of the following sources of data? Choose **SIX** answers from the box and write the correct letter, **A–H**, next to Questions 21–26." },
      {
        t: "table",
        caption: "Comments",
        head: ["Chữ", "Comment"],
        rows: [
          ["**A**", "It would take too long to process."],
          ["**B**", "It covers too short a period."],
          ["**C**", "It over-represents better-off families."],
          ["**D**", "It reveals why names were chosen."],
          ["**E**", "It cannot be used without payment."],
          ["**F**", "It is the most complete record available."],
          ["**G**", "It may not be permitted on privacy grounds."],
          ["**H**", "It reflects the views of an untypical group."],
        ],
      },
      {
        t: "listen",
        id: "t4d5-nghe-bai",
        title: "Names in and out of fashion — a project meeting",
        dan: { so: "Day 5, Practice (Listening Part 3)", boiCanh: "three linguistics students, Mia, Callum and Niamh, discussing their project on first names with their tutor, Dr Okafor.", cau: [21, 30] },
        note: "Khoảng 5 phút, ~165 từ / phút, bốn giọng: Dr Okafor (Anh, nam) · Mia (Mỹ, nữ) · Callum (Úc, nam) · Niamh (Ireland, nữ).",
        lines: [
          { who: "Dr Okafor", voice: "uk-nam", text: "Come in, sit down. So — first names, and how they go in and out of fashion. Before we get to your sources, remind me how you ended up with this topic.", vi: "Vào đi, ngồi xuống nào. Vậy là — tên riêng, và chuyện chúng thịnh rồi suy thế nào. Trước khi nói tới nguồn dữ liệu, nhắc lại cho thầy vì sao các em đi đến đề tài này." },
          { who: "Niamh", voice: "ie-nu", text: "Well, I'd written an essay on Irish surnames last year, so everyone assumes it was my idea, but it wasn't.", vi: "Dạ, năm ngoái em có viết một bài luận về họ của người Ireland, nên ai cũng tưởng đó là ý của em, nhưng không phải." },
          { who: "Callum", voice: "au-nam", text: "It was mine, really. There was an article in the weekend paper about a name that hadn't been given to a single baby in ten years, and I couldn't stop thinking about it.", vi: "Thật ra là của em. Có một bài trên báo cuối tuần nói về một cái tên suốt mười năm không được đặt cho đứa bé nào, và em cứ nghĩ mãi về nó." },
          { who: "Dr Okafor", voice: "uk-nam", text: "I did wonder, because I'd suggested something on place names. Never mind. Let's go through the sources. The national birth register first.", vi: "Thầy cũng thắc mắc, vì thầy đã gợi ý một đề tài về địa danh. Thôi không sao. Ta đi qua các nguồn nhé. Sổ đăng ký khai sinh quốc gia trước." },
          { who: "Callum", voice: "au-nam", text: "My first thought was that it'd take us months to get through. It's every birth since eighteen eighty.", vi: "Ý đầu tiên của em là bọn em sẽ mất hàng tháng mới xử lý hết. Nó ghi mọi ca sinh từ năm 1880." },
          { who: "Niamh", voice: "ie-nu", text: "Actually, that's not a problem any more. The statistics office put the whole thing online as a spreadsheet — you can sort it by year in seconds.", vi: "Thật ra chuyện đó không còn là vấn đề nữa. Cơ quan thống kê đã đưa toàn bộ lên mạng dưới dạng bảng tính — sắp xếp theo năm chỉ mất vài giây." },
          { who: "Mia", voice: "us-nu", text: "And nothing else comes close in terms of coverage. Every child has to be registered by law, so there are no gaps.", vi: "Và xét về độ bao phủ thì không nguồn nào sánh kịp. Theo luật mọi đứa trẻ đều phải được đăng ký, nên không có chỗ hổng nào." },
          { who: "Callum", voice: "au-nam", text: "Fair enough. I stand corrected.", vi: "Hợp lý. Em nhận là mình sai." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Good. School class lists?", vi: "Tốt. Danh sách lớp ở trường học?" },
          { who: "Mia", voice: "us-nu", text: "I liked this one. My old primary school has kept its lists since nineteen fifty, so the time span is fine.", vi: "Em thích nguồn này. Trường tiểu học cũ của em giữ danh sách từ năm 1950, nên khoảng thời gian thì ổn." },
          { who: "Niamh", voice: "ie-nu", text: "The trouble is those are real children, with surnames and addresses. I can't see the ethics committee letting us near them — there are data protection rules.", vi: "Vấn đề là đó là những đứa trẻ có thật, có họ và địa chỉ. Em không nghĩ hội đồng đạo đức sẽ cho bọn em đụng tới — có các quy định bảo vệ dữ liệu." },
          { who: "Mia", voice: "us-nu", text: "Even for the old ones?", vi: "Kể cả danh sách cũ ạ?" },
          { who: "Dr Okafor", voice: "uk-nam", text: "Even for those, I'm afraid. Niamh's right — I doubt you'd be allowed.", vi: "Thầy e là kể cả những cái đó. Niamh nói đúng — thầy ngờ là các em sẽ không được phép." },
          { who: "Mia", voice: "us-nu", text: "OK, so that one's risky. What about the online forums where parents discuss baby names? At least there people explain their thinking.", vi: "Vâng, vậy nguồn đó rủi ro. Còn các diễn đàn trên mạng nơi phụ huynh bàn chuyện đặt tên con thì sao? Ít ra ở đó người ta giải thích suy nghĩ của mình." },
          { who: "Callum", voice: "au-nam", text: "Do they, though? I read about two hundred posts and it's mostly lists — ‘here are my top five’ — with hardly a word about why.", vi: "Có thật thế không? Mình đọc khoảng hai trăm bài và phần lớn là danh sách — “đây là năm cái tên mình thích nhất” — gần như không có chữ nào về lý do." },
          { who: "Niamh", voice: "ie-nu", text: "And think about who posts. It's people who find names fascinating enough to argue about them with strangers. Most parents just pick one and get on with it.", vi: "Và nghĩ xem ai là người đăng bài. Đó là những người thấy tên gọi hấp dẫn đến mức đi tranh luận với người lạ. Hầu hết bố mẹ chỉ chọn một cái tên rồi thôi." },
          { who: "Mia", voice: "us-nu", text: "So we'd be hearing from enthusiasts, not ordinary families. Yeah, I see that.", vi: "Vậy là bọn mình sẽ nghe từ những người đam mê chứ không phải các gia đình bình thường. Ừ, mình hiểu." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Useful as background, then, but no more. Now, you mentioned interviewing grandparents.", vi: "Vậy thì hữu ích làm nền, không hơn. Giờ, các em có nhắc tới việc phỏng vấn ông bà." },
          { who: "Callum", voice: "au-nam", text: "I'm in two minds. Typing up recordings takes forever.", vi: "Em đang phân vân. Gõ lại băng ghi âm thì mất thời gian vô cùng." },
          { who: "Mia", voice: "us-nu", text: "For fifty interviews, sure. We only need six, and they're short — that's a weekend's work between the three of us.", vi: "Với năm mươi cuộc phỏng vấn thì đúng. Bọn mình chỉ cần sáu cuộc, lại ngắn — ba đứa làm trong một cuối tuần là xong." },
          { who: "Niamh", voice: "ie-nu", text: "And it's the one place we'd get the stories. The register tells you that a name was popular in nineteen sixty; it can't tell you it was because of a film star, or a saint, or a great-aunt who'd just died.", vi: "Và đó là nơi duy nhất bọn mình có được những câu chuyện. Sổ đăng ký cho biết một cái tên phổ biến năm 1960; nó không thể cho biết đó là vì một ngôi sao điện ảnh, một vị thánh, hay một bà cô vừa mất." },
          { who: "Callum", voice: "au-nam", text: "True. The motives are what's missing everywhere else. All right, I'm persuaded.", vi: "Đúng. Động cơ là thứ mọi nguồn khác đều thiếu. Được rồi, em bị thuyết phục rồi." },
          { who: "Dr Okafor", voice: "uk-nam", text: "And the birth announcements in the local newspaper?", vi: "Còn các mẩu báo tin sinh con trên báo địa phương?" },
          { who: "Niamh", voice: "ie-nu", text: "They go back to nineteen hundred, so I'd assumed they'd be nearly as good as the register.", vi: "Chúng có từ năm 1900, nên em cứ tưởng chúng sẽ tốt gần bằng sổ đăng ký." },
          { who: "Callum", voice: "au-nam", text: "Only you had to pay the paper to print one. In the nineteen twenties that was about a day's wages, so a labourer's family simply wouldn't have appeared.", vi: "Có điều là phải trả tiền cho toà báo để in một mẩu tin. Vào thập niên 1920 khoản đó bằng khoảng một ngày công, nên gia đình một người lao động đơn giản là sẽ không xuất hiện." },
          { who: "Niamh", voice: "ie-nu", text: "I hadn't thought of that. So what we'd actually be measuring is the taste of people with money to spare.", vi: "Em chưa nghĩ tới điều đó. Vậy thứ bọn mình thật sự đo là thị hiếu của những người dư dả tiền bạc." },
          { who: "Mia", voice: "us-nu", text: "Which is interesting, but it isn't the whole population.", vi: "Điều đó cũng thú vị, nhưng không phải toàn bộ dân số." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Quite. And lastly the commercial database — NameTrack, is it?", vi: "Đúng vậy. Và cuối cùng là cơ sở dữ liệu thương mại — NameTrack phải không?" },
          { who: "Mia", voice: "us-nu", text: "Yes. I'd assumed we'd have to pay for it, but as it happens the university library already has a subscription.", vi: "Vâng. Em cứ tưởng bọn em phải trả tiền, nhưng hoá ra thư viện trường đã có sẵn gói thuê bao." },
          { who: "Callum", voice: "au-nam", text: "It's beautifully organised, too. The drawback is it only starts in two thousand and five. You can't talk about fashion over a century with less than twenty years of data.", vi: "Nó cũng được tổ chức rất đẹp. Điểm yếu là nó chỉ bắt đầu từ năm 2005. Không thể nói về trào lưu qua một thế kỷ với chưa tới hai mươi năm dữ liệu." },
          { who: "Niamh", voice: "ie-nu", text: "No. It's fine for checking recent years and nothing else.", vi: "Không thể. Nó ổn để kiểm lại những năm gần đây, ngoài ra thì không." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Good, that's a sensible set of judgements. Now, your research question: ‘How do first names come into and go out of fashion?’", vi: "Tốt, đó là một bộ nhận định hợp lý. Giờ tới câu hỏi nghiên cứu của các em: “Tên riêng trở nên thịnh hành rồi lỗi thời như thế nào?”" },
          { who: "Mia", voice: "us-nu", text: "Is it too wide? And hasn't it been done before?", vi: "Nó có rộng quá không ạ? Và chẳng phải đã có người làm rồi sao?" },
          { who: "Dr Okafor", voice: "uk-nam", text: "The scope is manageable if you keep to one region, and yes, people have studied it elsewhere, but not here, so I wouldn't worry on either count. What you haven't done is tell me what ‘in fashion’ means. In the top ten? The top hundred? Until you've pinned that down, you can't measure anything.", vi: "Phạm vi là vừa sức nếu các em giữ ở một vùng, và đúng, người ta đã nghiên cứu ở nơi khác, nhưng chưa ở đây, nên thầy không lo về cả hai điểm đó. Điều các em chưa làm là cho thầy biết “thịnh hành” nghĩa là gì. Trong tốp mười? Tốp một trăm? Chưa chốt được điều đó thì các em không đo được gì cả." },
          { who: "Niamh", voice: "ie-nu", text: "We've had a first look at the register, though. The thing that struck me was the hundred-year cycle — names coming back once the generation that had them has gone.", vi: "Nhưng bọn em đã xem qua sổ đăng ký rồi ạ. Điều làm em chú ý là chu kỳ một trăm năm — những cái tên quay lại khi thế hệ mang tên đó đã qua đời." },
          { who: "Callum", voice: "au-nam", text: "I'd read about that already, so it didn't surprise me. What I really didn't expect was how little boys' names move compared with girls'. The girls' top ten changes almost completely every decade.", vi: "Mình đã đọc về chuyện đó rồi nên không bất ngờ. Điều mình thật sự không ngờ là tên con trai thay đổi ít thế nào so với tên con gái. Tốp mười tên con gái gần như đổi hoàn toàn sau mỗi thập kỷ." },
          { who: "Mia", voice: "us-nu", text: "Same here. That was the real eye-opener for me.", vi: "Mình cũng vậy. Đó mới là điều thật sự mở mắt cho mình." },
          { who: "Niamh", voice: "ie-nu", text: "OK, I'd go along with that. It is the stranger result.", vi: "Được, mình đồng ý. Đúng là kết quả đó lạ hơn." },
          { who: "Mia", voice: "us-nu", text: "For next week, I was going to make a start on the interview questions.", vi: "Tuần tới em định bắt đầu soạn câu hỏi phỏng vấn." },
          { who: "Dr Okafor", voice: "uk-nam", text: "Leave those for now, and the questionnaire can wait as well. Before you write a single question, split the register data into decades, so that we can all see the overall shape. Bring that next Thursday.", vi: "Tạm để đó đã, và bảng hỏi cũng có thể chờ. Trước khi viết bất kỳ câu hỏi nào, hãy chia dữ liệu sổ đăng ký theo từng thập kỷ, để tất cả chúng ta thấy được hình dạng tổng thể. Thứ Năm tuần sau mang tới." },
          { who: "Callum", voice: "au-nam", text: "Will do.", vi: "Vâng ạ." },
        ],
      },
      {
        t: "quiz",
        id: "t4d5-nghe-ghep",
        title: "Questions 21–26 — viết chữ cái A–H",
        kind: "fill",
        items: [
          { q: "(21) the national birth register ___", answers: ["F"] },
          { q: "(22) school class lists ___", answers: ["G"] },
          { q: "(23) online baby-name forums ___", answers: ["H"] },
          { q: "(24) interviews with grandparents ___", answers: ["D"] },
          { q: "(25) newspaper birth announcements ___", answers: ["C"] },
          { q: "(26) the commercial names database ___", answers: ["B"] },
        ],
      },
      { t: "p", text: "**Questions 27–30.** Choose the correct letter, **A, B or C**." },
      {
        t: "mcq",
        id: "t4d5-nghe-mcq",
        title: "Questions 27–30",
        items: [
          { q: "(27) The idea for the project came from", options: ["A an essay Niamh had written.", "B a suggestion made by Dr Okafor.", "C a newspaper article Callum had read."], correct: 2, why: "Niamh: “everyone assumes it was my idea, but it wasn't.” Callum: “It was mine… There was **an article in the weekend paper**…”. Dr Okafor đã gợi ý **place names** — đề tài khác." },
          { q: "(28) What does Dr Okafor say about the research question?", options: ["A A key term in it needs to be defined.", "B It covers too wide an area.", "C It has already been answered by other researchers."], correct: 0, why: "“The scope is manageable… people have studied it elsewhere, but not here, so I wouldn't worry on either count. **What you haven't done is tell me what ‘in fashion’ means**.” B và C là hai lo ngại của Mia, thầy bác cả hai." },
          { q: "(29) Which finding do all three students agree is the most surprising?", options: ["A Old names return after about a hundred years.", "B Boys' names change far less than girls' names.", "C Names taken from films quickly disappear."], correct: 1, why: "Niamh nêu chu kỳ 100 năm; Callum: “it didn't surprise me. What I really didn't expect was **how little boys' names move** compared with girls'.” Mia: “Same here.” Niamh: “**I'd go along with that**.” ⇒ cả ba chốt B." },
          { q: "(30) What must the students do before the next meeting?", options: ["A write the interview questions", "B design a questionnaire", "C divide the register data by decade"], correct: 2, why: "Mia định làm câu hỏi phỏng vấn; thầy: “**Leave those for now**, and the questionnaire can wait as well… **split the register data into decades**.”" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sau khi nghe — đáp án nằm ở câu nào, bẫy ở đâu" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Lời chốt trong băng", "Nhận xét bẫy (đã bị bác)"],
        rows: [
          ["21", "F", "Mia: nothing else comes close in terms of **coverage**… no gaps", "A — Callum: “it'd take us months” → Niamh: “**Actually**, that's not a problem any more”"],
          ["22", "G", "Niamh: **data protection rules** · thầy: I doubt you'd be allowed", "B — Mia: “since 1950, so the time span is **fine**” (khẳng định ngược lại)"],
          ["23", "H", "Niamh: people who find names fascinating… · Mia: **enthusiasts, not ordinary families**", "D — Mia: “people explain their thinking” → Callum: “**Do they, though?** … hardly a word about why”"],
          ["24", "D", "Niamh: the one place we'd get **the stories**… · Callum: **the motives**", "A — Callum: “takes forever” → Mia: “We only need six… a weekend's work”"],
          ["25", "C", "Callum: you had to pay… a labourer's family wouldn't have appeared · Niamh: **people with money to spare**", "F — Niamh: “I'd assumed they'd be nearly as good as the register” (I'd assumed = ý bị rút lại)"],
          ["26", "B", "Callum: it only starts in 2005… **less than twenty years of data**", "E — Mia: “I'd assumed we'd have to pay” → “**as it happens** the library already has a subscription”"],
        ],
        caption: "Cả 6 mục đều có một nhận xét bị bác trước khi nhận xét đúng được chốt. Tín hiệu bác: Actually · Do they, though? · I'd assumed… but / only · as it happens.",
      },
      {
        t: "note",
        title: "💡 Mẹo: paraphrase từ hộp sang băng trong bài này",
        items: [
          "**most complete record** → nothing else comes close in terms of coverage · no gaps",
          "**not permitted on privacy grounds** → the ethics committee · data protection rules · I doubt you'd be allowed",
          "**an untypical group** → enthusiasts, not ordinary families",
          "**why names were chosen** → the stories · because of a film star… · the motives",
          "**better-off families** → people with money to spare (ngược với a labourer's family)",
          "**too short a period** → only starts in 2005 · less than twenty years of data",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: nuốt /t/ và /d/ giữa hai phụ âm (elision)" },
      {
        t: "p",
        text: "Khi /t/ hoặc /d/ bị **kẹp giữa hai phụ âm** (cuối từ này + đầu từ sau, hoặc ngay trong một từ), người bản ngữ nói nhanh thường **bỏ hẳn** nó: nex**t** week → /neks wiːk/, las**t** year → /lɑːs jɪə/, ol**d** names → /əʊl neɪmz/. Trong băng hôm nay có: last year · next week · next Thursday · first thought · most parents · weekend paper · grandparents. Đây không phải nói ẩu — đó là tiếng Anh tự nhiên, và giám khảo coi là đặc trưng phát âm band 7.",
      },
      {
        t: "table",
        head: ["Luật", "Ví dụ", "Nghe như"],
        rows: [
          ["phụ âm + **t** + phụ âm ⇒ bỏ /t/", "next week · last month · most people · just one · first names", "/neks wiːk/ · /lɑːs mʌnθ/ · /məʊs piːpl/ · /dʒʌs wʌn/ · /fɜːs neɪmz/"],
          ["phụ âm + **d** + phụ âm ⇒ bỏ /d/", "old names · weekend paper · and then · hand-written", "/əʊl neɪmz/ · /wiːken peɪpə/ · /ən ðen/ · /hæn rɪtn/"],
          ["Trong một từ", "grandparents · exactly · facts · friends · postman", "/ɡrænpeərənts/ · /ɪɡzækli/ · /fæks/ · /frenz/ · /pəʊsmən/"],
          ["Đuôi -ed kẹp giữa phụ âm", "asked them · stopped working · changed completely", "/ɑːs ðəm/ · /stɒp wɜːkɪŋ/ · /tʃeɪndʒ kəmpliːtli/"],
          ["KHÔNG nuốt: sau đó là nguyên âm ⇒ **nối**", "last hour · first of all · old enough", "/lɑːs‿taʊə/ · /fɜːs‿təv ɔːl/ · /əʊl‿dɪnʌf/"],
        ],
        caption: "Hệ quả khi nghe: “asked them” và “ask them” nghe gần như nhau ⇒ thì quá khứ phải đoán từ ngữ cảnh (last year, in 2019), không trông vào đuôi -ed.",
      },
      {
        t: "phatam",
        id: "t4d5-phat-am",
        title: "Luyện phát âm — nuốt /t/ /d/ giữa phụ âm",
        note: "Bấm “Nghe mẫu” rồi “Đọc & chấm”. Đọc liền hơi, đừng cố bật rõ /t/ /d/ ở chỗ bị kẹp. Dòng 9–10 là câu dài: đọc đúng nhịp, không ngắt giữa cụm.",
        items: [
          { text: "next week", ipa: "neks wiːk", vi: "tuần tới — bỏ /t/" },
          { text: "last year", ipa: "lɑːs jɪə", vi: "năm ngoái — bỏ /t/" },
          { text: "most people", ipa: "məʊs piːpl", vi: "hầu hết mọi người — bỏ /t/" },
          { text: "first names", ipa: "fɜːs neɪmz", vi: "tên riêng — bỏ /t/" },
          { text: "old names", ipa: "əʊl neɪmz", vi: "những cái tên cũ — bỏ /d/" },
          { text: "the weekend paper", ipa: "ðə wiːken peɪpə", vi: "tờ báo cuối tuần — bỏ /d/" },
          { text: "grandparents", ipa: "ɡrænpeərənts", vi: "ông bà — bỏ /d/ trong từ" },
          { text: "last hour, first of all", ipa: "lɑːs taʊə fɜːs təv ɔːl", vi: "KHÔNG nuốt — /t/ nối sang nguyên âm" },
          { text: "Most parents just pick one.", ipa: "məʊs peərənts dʒʌs pɪk wʌn", vi: "Hầu hết bố mẹ chỉ chọn một cái." },
          { text: "We asked them last month and they changed their minds.", ipa: "wi ɑːs ðəm lɑːs mʌnθ ən ðeɪ tʃeɪndʒ ðeə maɪnz", vi: "Tháng trước chúng tôi hỏi họ và họ đã đổi ý." },
        ],
      },
      {
        t: "mcq",
        id: "t4d5-nghe-nuot-am",
        title: "Ở cụm nào /t/ hoặc /d/ bị nuốt khi nói nhanh? (5 câu)",
        items: [
          { q: "1. Cụm nào có /t/ bị nuốt?", options: ["last hour", "last August", "last night", "last of all"], correct: 2, why: "last **n**ight: /t/ kẹp giữa /s/ và /n/ ⇒ /lɑːs naɪt/. Ba cụm kia sau /t/ là nguyên âm ⇒ nối, không nuốt." },
          { q: "2. Cụm nào có /d/ bị nuốt?", options: ["hand luggage", "hand in", "hand over", "hand it back"], correct: 0, why: "han**d l**uggage: /d/ giữa /n/ và /l/ ⇒ /hæn lʌɡɪdʒ/. Các cụm còn lại /d/ đứng trước nguyên âm." },
          { q: "3. “I must go now” nghe gần nhất với", options: ["/aɪ mʌst ɡəʊ naʊ/ — /t/ bật rõ", "/aɪ mʌs ɡəʊ naʊ/", "/aɪ mʌ ɡəʊ naʊ/", "/aɪ mʌst tə ɡəʊ naʊ/"], correct: 1, why: "mus**t g**o: /t/ giữa /s/ và /ɡ/ ⇒ rơi: /mʌs ɡəʊ/. /s/ vẫn giữ." },
          { q: "4. Nghe /ðeɪ ɑːs mi/ trong câu có “last week”. Người nói đã nói", options: ["they ask me", "they asked me", "they are asking me", "they will ask me"], correct: 1, why: "aske**d m**e: /t/ của -ed kẹp giữa phụ âm ⇒ rơi, nghe giống hệt “ask me”. Có last week ⇒ quá khứ: asked me. Đuôi -ed gần như không nghe thấy — phải dựa ngữ cảnh." },
          { q: "5. Từ nào thường KHÔNG mất /t/ hay /d/?", options: ["postman", "handsome", "friendship", "editor"], correct: 3, why: "e**d**itor: /d/ nằm giữa hai nguyên âm ⇒ giữ. postman /pəʊsmən/, handsome /hænsəm/, friendship /frenʃɪp/ đều rơi âm bị kẹp giữa phụ âm." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 5 ═══════════════════════════ */
  {
    id: "t4d5-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 5 — participle clauses · chủ ngữ treo · TFNG bẫy band 7 · Part 3 bốn người nói",
    goal: "Tự kiểm lại cả ngày: chọn và viết đúng mệnh đề phân từ, sửa chủ ngữ treo, làm TFNG có câu hai vế và con số bị đổi, nghe một đoạn Part 3 bốn giọng — 41 câu có đáp án.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài tập hôm nay",
        items: [
          "Làm **không mở lại bài học**. Xong từng phần mới xem đáp án.",
          "Phần I–IV ôn **bài 1** (ngữ pháp) · Phần V–VI ôn **bài 2** (đọc) · Phần VII ôn **bài 3** (nghe).",
          "Sai từ 3 câu trở lên ở một phần ⇒ đọc lại đúng mục ghi ở tiêu đề phần đó rồi làm lại vào hôm sau.",
          "Chép mọi câu sai vào **sổ lỗi**, ghi kèm luật bị vi phạm (vd “chủ ngữ treo: Looking at the chart, sales…”).",
        ],
      },

      { t: "h", text: "Phần I — Chọn dạng phân từ đúng (8 câu · ôn bài 1 mục 2–6, 8)" },
      {
        t: "mcq",
        id: "t4d5-bt-chon",
        title: "I. Chọn đáp án đúng",
        items: [
          { q: "1. ___ on a hill above the harbour, the castle can be seen from every part of the town.", options: ["Standing", "Stood up", "Having been stood", "To stand"], correct: 0, why: "stand ở đây là nội động từ (lâu đài **đứng** trên đồi) ⇒ chủ động ⇒ V-ing: Standing on a hill." },
          { q: "2. The motorway was closed for six hours, ___ long delays across the region.", options: ["caused", "causing", "to cause", "which causing"], correct: 1, why: "Sau dấu phẩy, nêu kết quả của cả mệnh đề trước ⇒ V-ing: causing." },
          { q: "3. ___ by local farmers for centuries, the technique is now attracting scientific interest.", options: ["Using", "Having used", "Used", "To be using"], correct: 2, why: "Kỹ thuật **được dùng** ⇒ V3: Used by local farmers." },
          { q: "4. ___ the application form, she realised she had forgotten to attach her certificate.", options: ["Sent", "Being sent", "To send", "Having sent"], correct: 3, why: "Gửi xong **trước**, rồi mới nhận ra ⇒ Having + V3. Chủ ngữ she là người gửi ⇒ chủ động." },
          { q: "5. When ___ to choose, two-thirds of the participants preferred the cheaper option.", options: ["asked", "asking", "they asked", "to ask"], correct: 0, why: "Người tham gia **được yêu cầu** chọn ⇒ When + V3: When asked." },
          { q: "6. Imports rose in every category, with electronics ___ for almost half of the increase.", options: ["accounted", "accounting", "accounts", "to account"], correct: 1, why: "with + N + V-ing (chủ động): with electronics **accounting** for… Sau with không có động từ chia thì." },
          { q: "7. ___ much experience, most graduates accept a lower starting salary.", options: ["Not have", "Having not", "No having", "Not having"], correct: 3, why: "Phủ định của participle clause: **Not** + V-ing ⇒ Not having much experience." },
          { q: "8. ___ with the previous decade, the 2010s saw far fewer strikes.", options: ["Comparing", "To compare", "Compared", "Being comparing"], correct: 2, why: "Thập niên 2010 **được so sánh** ⇒ Compared with…" },
        ],
      },

      { t: "h", text: "Phần II — Nén hai câu thành một (8 câu · ôn bài 1 mục 3–5, 8, 10)" },
      {
        t: "quiz",
        id: "t4d5-bt-nen",
        kind: "fill",
        title: "II. Điền MỘT hoặc HAI từ để câu thứ hai có nghĩa như cặp câu gốc",
        items: [
          { q: "The council banned cars from the centre. This led to a fall in pollution. → The council banned cars from the centre, ___ to a fall in pollution.", answers: ["leading"] },
          { q: "The bridge was designed by a local engineer. It opened in 1932. → ___ by a local engineer, the bridge opened in 1932.", answers: ["Designed"] },
          { q: "She had worked in three countries, so she adapted quickly. → ___ ___ in three countries, she adapted quickly.", answers: ["Having worked"] },
          { q: "Prices rose in all five cities. Sydney recorded the sharpest rise. → Prices rose in all five cities, ___ Sydney recording the sharpest rise.", answers: ["with"] },
          { q: "The birth rate is falling, so many schools are closing. → With the birth rate ___, many schools are closing.", answers: ["falling"] },
          { q: "Although the scheme is popular, it is expensive to run. → Although ___, the scheme is expensive to run.", answers: ["popular"] },
          { q: "The pupils who were tested in 2019 scored higher than expected. → The pupils ___ in 2019 scored higher than expected.", answers: ["tested"] },
          { q: "Output rose steadily and reached 5 million tonnes in 2020. → Output rose steadily, ___ 5 million tonnes in 2020.", answers: ["reaching"] },
        ],
      },

      { t: "h", text: "Phần III — Dịch Việt → Anh (5 câu · ôn bài 1)" },
      {
        t: "quiz",
        id: "t4d5-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — bắt buộc dùng cấu trúc trong gợi ý",
        grammar: "participle clause · with + N + V-ing",
        items: [
          { q: "Đối mặt với dân số già đi, chính phủ đã nâng tuổi nghỉ hưu.", answers: ["Faced with an ageing population, the government raised the retirement age.", "Faced with an ageing population, the government has raised the retirement age.", "Faced with an aging population, the government raised the retirement age.", "Faced with an aging population, the government has raised the retirement age."], hint: "Faced with · an ageing population · raise the retirement age" },
          { q: "Nhiều nhà máy đã chuyển ra nước ngoài, khiến hàng nghìn công nhân mất việc.", answers: ["Many factories have moved abroad, leaving thousands of workers without jobs.", "Many factories have moved overseas, leaving thousands of workers without jobs.", "Many factories have moved abroad, leaving thousands of workers unemployed.", "Many factories have moved abroad, leaving thousands of workers jobless.", "Many factories have moved abroad, leaving thousands of workers without work."], hint: "…, leaving … without jobs" },
          { q: "Như được thể hiện trong bảng, xuất khẩu giảm ở mọi năm.", answers: ["As shown in the table, exports fell in every year.", "As shown in the table, exports fell every year.", "As shown in the table, exports decreased in every year.", "As shown in the table, exports declined every year."], hint: "As shown in the table" },
          { q: "Vì lớn lên ở nông thôn, tôi luôn yêu những không gian rộng mở.", answers: ["Having grown up in the countryside, I have always loved open spaces.", "Having grown up in the countryside, I've always loved open spaces.", "Having grown up in the country, I have always loved open spaces."], hint: "Having grown up · open spaces" },
          { q: "Lượng khách tăng ở cả bốn bảo tàng, trong đó Bảo tàng Khoa học thu hút nhiều khách nhất.", answers: ["Visitor numbers rose at all four museums, with the Science Museum attracting the most visitors.", "Visitor numbers increased at all four museums, with the Science Museum attracting the most visitors.", "Visitor numbers rose in all four museums, with the Science Museum attracting the most visitors.", "The number of visitors rose at all four museums, with the Science Museum attracting the most visitors."], hint: "with the Science Museum attracting the most visitors" },
        ],
      },

      { t: "h", text: "Phần IV — Chủ ngữ treo: chọn câu sửa đúng (5 câu · ôn bài 1 mục 7)" },
      {
        t: "mcq",
        id: "t4d5-bt-treo",
        title: "IV. Mỗi câu gốc có chủ ngữ treo. Chọn cách sửa ĐÚNG.",
        items: [
          { q: "1. ~~Having finished the experiment, the results were sent to the journal.~~", options: ["Having finished the experiment, the journal received the results.", "Having finished the experiment, the scientists sent the results to the journal.", "Having been finished the experiment, the results were sent to the journal.", "Finishing the experiment, the results were sent to the journal."], correct: 1, why: "Người hoàn thành thí nghiệm là **the scientists** ⇒ phải đứng ngay sau dấu phẩy." },
          { q: "2. ~~Being a tourist city, prices in Hoi An are high.~~", options: ["Being a tourist city, Hoi An has high prices.", "Being a tourist city, high prices are in Hoi An.", "Being a tourist city, there are high prices in Hoi An.", "Been a tourist city, prices in Hoi An are high."], correct: 0, why: "Thứ “là thành phố du lịch” là **Hoi An**, không phải prices ⇒ Hoi An làm chủ ngữ." },
          { q: "3. ~~Looking at the table, the largest group was students.~~", options: ["Looked at the table, the largest group was students.", "By looking at the table, students were the largest group.", "Looking at the table, students were the largest group.", "As the table shows, the largest group was students."], correct: 3, why: "Không nhóm nào “nhìn vào bảng”. Task 1 dùng: **As the table shows**, / As can be seen from the table, …" },
          { q: "4. ~~Driven by cheap loans, many families bought houses they could not afford.~~ — câu này", options: ["sai: phải là Driving by cheap loans.", "sai: families không thể bị thúc đẩy.", "đúng: families chính là đối tượng bị thúc đẩy bởi khoản vay rẻ.", "sai: phải thêm chủ ngữ it sau dấu phẩy."], correct: 2, why: "Many families **were driven** by cheap loans ⇒ chủ ngữ ngầm khớp với chủ ngữ chính ⇒ câu ĐÚNG, không treo. Không phải câu nào mở bằng V3 cũng sai — luôn làm phép thử." },
          { q: "5. ~~After interviewing 200 residents, a clear pattern emerged.~~", options: ["After interviewing 200 residents, the researchers saw a clear pattern.", "After interviewed 200 residents, a clear pattern emerged.", "After interviewing 200 residents, there emerged a clear pattern.", "After being interviewing 200 residents, a pattern emerged."], correct: 0, why: "Người phỏng vấn là **the researchers**. (Hoặc viết đủ: After the researchers had interviewed…, a clear pattern emerged.)" },
        ],
      },

      { t: "h", text: "Phần V — True / False / Not Given: đoạn mới (7 câu · ôn bài 2 mục 2–4)" },
      { t: "p", text: "Đọc đoạn văn rồi làm 7 câu trong **7 phút**. Nhớ gạch vế và khoanh cả cụm số." },
      {
        t: "passage",
        title: "The Night Market of Port Selby",
        paras: [
          { text: "Port Selby's night market began in 1998 with about forty stalls on a single car park. By 2023 it had spread to three sites and almost 400 stalls, and the city council estimates that it now attracts some 25,000 visitors on a typical Saturday, roughly a quarter of whom are tourists. Food accounts for just over half of all stalls; clothing, once the largest category, has fallen to under a fifth." },
          { text: "Stallholders pay a fee of 30 dollars a night, a figure that has not changed since 2015, although from next year those selling hot food will be charged an additional 10 dollars for waste collection. A council survey found that nine out of ten visitors rated the market as ‘good’ or ‘excellent’, but residents of the neighbouring streets were less enthusiastic: 62 per cent of them complained about noise after midnight. The survey did not ask traders for their views." },
        ],
      },
      {
        t: "mcq",
        id: "t4d5-bt-tfng",
        title: "V. Do the following statements agree with the information in the text?",
        items: [
          { q: "1. The market has grown to more than 400 stalls.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“**almost** 400 stalls” — chưa tới 400 ⇒ FALSE. Bẫy số đổi (almost ↔ more than)." },
          { q: "2. About three-quarters of the people who visit on a typical Saturday are not tourists.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“roughly a quarter of whom are tourists” ⇒ khoảng ba phần tư không phải du khách ⇒ TRUE. Số đổi cách nói nhưng khớp." },
          { q: "3. Most stalls sell food, and clothing is now the second-largest category.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Vế 1 đúng (just over half). Vế 2: bài chỉ nói clothing “has fallen to under a fifth”, không nói nó đứng thứ mấy ⇒ NOT GIVEN. Bẫy đúng một nửa." },
          { q: "4. The nightly fee paid by stallholders has gone up since 2015.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“a figure that has not changed since 2015” ⇒ FALSE." },
          { q: "5. From next year, every stallholder will pay 40 dollars a night.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Chỉ “**those selling hot food**” mới trả thêm 10 đô ⇒ không phải mọi chủ sạp ⇒ FALSE. Bẫy phạm vi (some ↔ every)." },
          { q: "6. Visitors were more satisfied with the market than traders were.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "“The survey did not ask traders for their views.” Không có số liệu về người bán ⇒ không so được ⇒ NOT GIVEN. Bẫy so sánh ngầm." },
          { q: "7. Fewer than two-thirds of nearby residents complained about late-night noise.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "62% < 66,7% (hai phần ba) ⇒ TRUE. after midnight → late-night." },
        ],
      },

      { t: "h", text: "Phần VI — Con số có khớp không? (4 câu · ôn bài 2 mục 4)" },
      {
        t: "mcq",
        id: "t4d5-bt-so",
        title: "VI. Câu B có cùng nghĩa với câu A không?",
        items: [
          { q: "1. A: Sales tripled between 2010 and 2020. — B: Sales increased by 300% between 2010 and 2020.", options: ["Cùng nghĩa", "Khác nghĩa"], correct: 1, why: "Gấp ba = tăng **200%** (từ 100 lên 300). Tăng 300% là gấp bốn." },
          { q: "2. A: Just under a fifth of adults smoke. — B: Slightly fewer than 20% of adults smoke.", options: ["Cùng nghĩa", "Khác nghĩa"], correct: 0, why: "a fifth = 20%; just under = slightly fewer than ⇒ cùng nghĩa." },
          { q: "3. A: The unemployment rate fell to 4%. — B: The unemployment rate fell by 4 percentage points.", options: ["Cùng nghĩa", "Khác nghĩa"], correct: 1, why: "fell **to** 4% = mức cuối là 4%; fell **by** 4 points = mức giảm là 4 điểm. Hai thông tin khác nhau." },
          { q: "4. A: No fewer than 60 firms took part. — B: At least 60 firms took part.", options: ["Cùng nghĩa", "Khác nghĩa"], correct: 0, why: "no fewer than = at least (tối thiểu 60)." },
        ],
      },

      { t: "h", text: "Phần VII — Nghe: bốn người nhận xét buổi tập thuyết trình (4 câu · ôn bài 3)" },
      { t: "p", text: "Nghe **một lần**. Chú ý ý nào bị bác và ý nào được chốt sau cùng." },
      {
        t: "listen",
        id: "t4d5-bt-nghe",
        title: "Feedback on a practice presentation",
        dan: { so: "Day 5, Homework (Listening Part 3)", boiCanh: "three students, Tariq, Bridget and Owen, getting feedback on a practice presentation from their tutor, Professor Lindqvist.", cau: [1, 4] },
        note: "Khoảng 1 phút 20 giây, bốn giọng: Professor Lindqvist (Anh, nữ) · Tariq (Mỹ, nam) · Bridget (Ireland, nữ) · Owen (Úc, nam).",
        lines: [
          { who: "Professor Lindqvist", voice: "uk-nu", text: "Thanks, all three of you. That was the practice run for your talk on shift work and sleep. Let's hear your own reactions before mine. Tariq?", vi: "Cảm ơn cả ba em. Đó là buổi chạy thử cho bài nói về làm ca và giấc ngủ. Hãy nghe phản ứng của chính các em trước khi tới ý của cô. Tariq?" },
          { who: "Tariq", voice: "us-nam", text: "I thought the opening dragged. We spent two minutes on definitions before saying anything interesting.", vi: "Em thấy phần mở đầu lê thê. Bọn em mất hai phút cho định nghĩa rồi mới nói được điều gì thú vị." },
          { who: "Bridget", voice: "ie-nu", text: "I'd go along with that. And the slides were crowded — nobody can read a table with twelve rows from the back of the room.", vi: "Mình đồng ý. Và slide thì chật chội — không ai đọc nổi một cái bảng mười hai dòng từ cuối phòng." },
          { who: "Owen", voice: "au-nam", text: "I'm not sure I'd go that far, Bridget. The table's the heart of our argument. Couldn't we just highlight the three rows that matter?", vi: "Mình không chắc là tới mức đó đâu, Bridget. Cái bảng là trung tâm lập luận của bọn mình. Sao không chỉ tô nổi ba dòng quan trọng thôi?" },
          { who: "Bridget", voice: "ie-nu", text: "Fair enough — highlighting would do it. I'd assumed we'd have to cut it, but that's better.", vi: "Hợp lý — tô nổi là được. Mình cứ tưởng phải cắt nó, nhưng cách đó hay hơn." },
          { who: "Professor Lindqvist", voice: "uk-nu", text: "I agree about the table. On the opening, though, I'd disagree with you, Tariq: an audience of non-specialists needs those definitions. What you could do is shorten them to thirty seconds. My main criticism is something none of you mentioned — you ran four minutes over. On the day, you'll simply be stopped.", vi: "Cô đồng ý về cái bảng. Nhưng về phần mở đầu thì cô không đồng ý với em, Tariq: khán giả không chuyên cần những định nghĩa đó. Điều các em có thể làm là rút chúng xuống còn ba mươi giây. Lời phê bình chính của cô là điều không ai trong các em nhắc tới — các em nói quá bốn phút. Hôm thật, các em sẽ bị cắt ngang." },
          { who: "Owen", voice: "au-nam", text: "Then the case study has to go.", vi: "Vậy thì phải bỏ phần tình huống minh hoạ." },
          { who: "Tariq", voice: "us-nam", text: "Not the case study — that's what people remember. I'd rather lose the section on the history of shift work.", vi: "Đừng bỏ phần tình huống — đó là thứ người ta nhớ. Mình thà bỏ phần lịch sử của việc làm ca." },
          { who: "Owen", voice: "au-nam", text: "Hmm. Up to a point — but I can live with that.", vi: "Ừm. Đúng một phần thôi — nhưng mình chấp nhận được." },
          { who: "Professor Lindqvist", voice: "uk-nu", text: "Good. Cut the history, and time yourselves again on Friday.", vi: "Tốt. Cắt phần lịch sử, và thứ Sáu bấm giờ lại." },
        ],
      },
      {
        t: "mcq",
        id: "t4d5-bt-nghe-cau",
        title: "VII. Questions 1–4 — Choose the correct letter, A, B or C",
        items: [
          { q: "1. What do the students decide to do about the table?", options: ["A remove it from the slides", "B highlight the most important rows", "C give it to the audience on paper"], correct: 1, why: "Owen: “Couldn't we just highlight the three rows that matter?” Bridget: “Fair enough — highlighting would do it. I'd assumed we'd have to cut it, but…” ⇒ B. A là ý Bridget đã rút lại." },
          { q: "2. What is Professor Lindqvist's opinion of the definitions?", options: ["A They are needed but should be shorter.", "B They are unnecessary for this audience.", "C They should come later in the talk."], correct: 0, why: "“an audience of non-specialists **needs** those definitions… **shorten them** to thirty seconds.” B là ý ngầm của Tariq, bị cô bác." },
          { q: "3. What is the Professor's main criticism?", options: ["A The slides were hard to read.", "B The opening was too slow.", "C The talk was too long."], correct: 2, why: "“My main criticism is something none of you mentioned — you ran four minutes over.” A và B là ý của sinh viên." },
          { q: "4. Which part of the talk will be cut?", options: ["A the history of shift work", "B the case study", "C the definitions"], correct: 0, why: "Owen đề nghị bỏ case study; Tariq phản đối, muốn bỏ history; Owen: “I can live with that”; cô: “Cut the history.”" },
        ],
      },
    ],
  },
];
