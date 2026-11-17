/**
 * IELTS Tập 3 — Ngày 25 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Cụm danh từ phức (bổ nghĩa trước / sau, chia động từ theo danh từ chính) + danh hoá mức 1
 *                     + giới từ sau danh từ; ôn câu hỏi gián tiếp – câu hỏi đuôi                       [G31, ôn G19]
 *                     — nối Tập 2 Ngày 19 (câu hỏi), Tập 3 Ngày 9 (giới từ phụ thuộc) · 17 (rút gọn) · 23 (that-clause)
 *   Bài 2 (reading)   Summary completion (từ trong bài) 2 + Sentence completion — “A Penny for Any Distance” (cải cách bưu chính 1840)
 *                     (~750 từ, 13 câu)                                                                [R07 R01]
 *                     — nối Tập 2 Ngày 2 (Summary), Tập 3 Ngày 9 (Sentence completion), Tập 2 Ngày 8 (paraphrase 3 cách) · Tập 3 Ngày 3 (8 phép)
 *   Bài 3 (listening) Đề nhỏ Part 3 + Part 4, 20 câu + năm loại bẫy; giọng UK · US · AU · CA          [L05 L06 L15]
 *                     🔊 trọng âm cụm danh từ
 *   Bài tập Ngày 25   42 câu có đáp án + 1 đoạn Task 1
 * Mọi id bắt đầu `t3d25-`.
 */
import type { Lesson } from '../data';

export const NGAY_25: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t3d25-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Cụm danh từ phức + danh hoá mức 1 (ôn câu hỏi gián tiếp)",
    goal: "Dựng được cụm danh từ dài mà vẫn đúng (bổ nghĩa trước + danh từ chính + bổ nghĩa sau), chia động từ theo đúng danh từ chính, và đổi động từ / tính từ thành danh từ (a sharp rise in… · the introduction of…) để viết câu Task 1, Task 2 gọn và học thuật ở mức band 6.",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Ôn từ Tập 2 Ngày 19**: câu hỏi gián tiếp (Could you tell me where **the station is**?) và câu hỏi đuôi — 60 giây, rồi nối sang bài mới: mệnh đề wh- và cụm danh từ làm **cùng một việc** trong câu.",
          "**Cụm danh từ phức** (complex noun phrase) = ==từ đứng trước + DANH TỪ CHÍNH + phần đứng sau==: a **sharp** rise **in fuel prices** · the **only** way **to solve the problem**.",
          "**Chia động từ theo danh từ chính**, không theo danh từ đứng gần nhất: The **number** of cars **has** risen. Đây là lỗi GRA phổ biến nhất của người Việt ở band 5.",
          "**Danh hoá** (nominalisation) mức 1 = đổi động từ / tính từ thành danh từ: prices **rose sharply** → **a sharp rise in** prices; the government **introduced** a law → **the introduction of** a law.",
          "Danh hoá kéo theo **giới từ riêng**: a rise **in** · demand **for** · access **to** · an impact **on** · a lack **of**. Sai giới từ là mất điểm LR.",
          "Đẩy **GRA + LR** Writing lên band 6, và giúp **Reading**: câu dài trong bài đọc thường chỉ là MỘT cụm danh từ rất dài + một động từ — tìm ra danh từ chính là hiểu câu.",
        ],
      },

      /* ── 1. Ôn G19 ── */
      { t: "h", text: "1. Ôn 60 giây: câu hỏi gián tiếp và câu hỏi đuôi (Tập 2 Ngày 19)" },
      {
        t: "table",
        head: ["Loại", "Công thức", "Ví dụ đúng", "Lỗi hay gặp"],
        rows: [
          ["Câu hỏi trực tiếp", "Wh- + trợ động từ + S + V?", "Why **did** the number **fall**?", "~~Why the number fell?~~"],
          ["Hỏi chủ ngữ", "Who / What + V? (không mượn do)", "What **caused** the fall?", "~~What did cause the fall?~~"],
          ["Câu hỏi gián tiếp", "Could you tell me / I wonder + wh- / if + **S + V**", "Could you tell me why the number **fell**?", "~~…why did the number fall?~~"],
          ["Câu hỏi đuôi", "câu (+) → đuôi (−); đúng trợ động từ", "Prices have risen, **haven't they**?", "~~Prices have risen, isn't it?~~"],
        ],
      },
      {
        t: "p",
        text: "Ở band 6 bạn cần câu hỏi gián tiếp trong **hai** chỗ. Một: Speaking, khi hỏi lại giám khảo (Could you explain **what you mean** by “heritage”?). Hai: Writing, khi mệnh đề wh- làm **tân ngữ** (It is unclear **why sales fell**). Và đây là cầu nối sang bài hôm nay: mệnh đề wh- có thể đổi thành một **cụm danh từ** — ngắn hơn, học thuật hơn.",
      },
      {
        t: "table",
        head: ["Mệnh đề wh- (đúng, hơi dài)", "Cụm danh từ (gọn, học thuật)"],
        rows: [
          ["Nobody knows **why sales fell**.", "Nobody knows **the reason for the fall in sales**."],
          ["The report explains **how the system works**.", "The report explains **the operation of the system**."],
          ["It depends on **how much the ticket costs**.", "It depends on **the cost of the ticket**."],
          ["We measured **how long each journey took**.", "We measured **the length of each journey**."],
        ],
        caption: "Cả hai cột đều đúng. Cột phải là thứ bạn học hôm nay.",
      },
      {
        t: "mcq",
        id: "t3d25-on-cau-hoi",
        title: "Ôn nhanh — câu hỏi nào ĐÚNG? (5 câu)",
        items: [
          { q: "Could you tell me ______?", options: ["where is the ticket office", "where the ticket office is", "where does the ticket office", "the ticket office where is"], correct: 1, why: "Câu hỏi gián tiếp: sau từ để hỏi là thứ tự câu kể S + V (the ticket office is), không đảo." },
          { q: "I wonder ______ the museum opens on Mondays.", options: ["does", "that", "whether", "what"], correct: 2, why: "Câu hỏi Yes/No đổi sang gián tiếp dùng if / whether." },
          { q: "______ the sharp fall in visitor numbers?", options: ["What caused", "What did cause", "What did caused", "What was cause"], correct: 0, why: "Hỏi chủ ngữ (cái gì gây ra) ⇒ không mượn do / did: What caused…?" },
          { q: "The figures have doubled since 2010, ______?", options: ["isn't it", "don't they", "didn't they", "haven't they"], correct: 3, why: "Câu dùng have doubled ⇒ đuôi lặp lại have, đổi dấu: haven't they?" },
          { q: "Do you know how long ______?", options: ["does the flight take", "takes the flight", "the flight takes", "the flight does take"], correct: 2, why: "Sau Do you know + how long là S + V thường: the flight takes." },
        ],
      },

      /* ── 2. Cụm danh từ là gì ── */
      { t: "h", text: "2. Cụm danh từ phức: một danh từ chính và những gì bám quanh nó" },
      {
        t: "p",
        text: "**Cụm danh từ** (noun phrase) là một nhóm từ xoay quanh **một danh từ chính** (head noun) và làm việc như một danh từ: làm chủ ngữ, tân ngữ, hoặc đứng sau giới từ. Tiếng Việt đặt gần như mọi thứ **sau** danh từ (ngôi nhà gỗ nhỏ cũ của ông tôi). Tiếng Anh chia hai phía: từ ngắn đứng **trước**, cụm dài đứng **sau**. Người Việt hay sai vì xếp theo thứ tự tiếng Việt.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Năm ô của một cụm danh từ",
        caption: "Ví dụ: the | two main | government | POLICIES | on public transport. Động từ của câu chia theo ô số 4.",
        steps: [
          { label: "① Từ hạn định", sub: "a · the · this · some · many · two · their" },
          { label: "② Tính từ", sub: "sharp · main · long-term · well-paid" },
          { label: "③ Danh từ bổ nghĩa", sub: "government · fuel · city · traffic" },
          { label: "④ DANH TỪ CHÍNH", sub: "policies · rise · problem" },
          { label: "⑤ Phần đứng sau", sub: "giới từ + N · mệnh đề quan hệ · V-ing / V3 · to V · that…" },
        ],
      },
      {
        t: "table",
        head: ["Cụm danh từ", "① ② ③ (trước)", "④ Danh từ chính", "⑤ (sau)"],
        rows: [
          ["a sharp rise in fuel prices", "a · sharp", "**rise**", "in fuel prices"],
          ["the main cause of air pollution in big cities", "the · main", "**cause**", "of air pollution in big cities"],
          ["many young people living in rural areas", "many · young", "**people**", "living in rural areas"],
          ["the best way to reduce traffic congestion", "the · best", "**way**", "to reduce traffic congestion"],
          ["a five-year government plan that was approved in 2020", "a · five-year · government", "**plan**", "that was approved in 2020"],
        ],
      },
      {
        t: "note",
        title: "Cách học: tìm danh từ chính trong 3 giây",
        items: [
          "Bỏ hết phần sau **giới từ đầu tiên** (of, in, for, on…) và phần sau **who / which / that / V-ing / V3 / to V**. Danh từ **cuối cùng còn lại** chính là danh từ chính.",
          "the number **of** students → danh từ chính là **number** (số ít). · students **who** live abroad → danh từ chính là **students** (số nhiều).",
          "Khi ĐỌC: gặp câu dài, gạch dưới danh từ chính của chủ ngữ rồi nhảy thẳng tới động từ. Phần ở giữa chỉ là thông tin thêm.",
        ],
      },
      { t: "rule", formula: "từ hạn định + adj + N bổ nghĩa + DANH TỪ CHÍNH + (giới từ + N · who / which… · V-ing / V3 · to V)", vi: "Từ ngắn đứng trước, cụm dài đứng sau; động từ chia theo danh từ chính." },

      /* ── 3. Bổ nghĩa trước ── */
      { t: "h", text: "3. Bổ nghĩa TRƯỚC danh từ: tính từ, danh từ làm tính từ, tính từ ghép" },
      {
        t: "patterns",
        rows: [
          {
            formula: "adj + N",
            vi: "Tính từ đứng trước danh từ. Nhiều tính từ: ý kiến → kích cỡ → tuổi → màu → nguồn gốc → chất liệu.",
            examples: [
              { en: "a significant increase · a beautiful old wooden bridge", vi: "một mức tăng đáng kể · một cây cầu gỗ cũ rất đẹp" },
              { en: "There has been a dramatic change in working patterns.", vi: "Đã có một thay đổi mạnh trong cách thức làm việc." },
            ],
          },
          {
            formula: "N + N (danh từ thứ nhất làm tính từ — luôn SỐ ÍT)",
            vi: "Danh từ đứng trước nói rõ loại / lĩnh vực của danh từ sau. Danh từ đứng trước không thêm -s.",
            examples: [
              { en: "government policy · car ownership · energy consumption · a university student", vi: "chính sách của chính phủ · việc sở hữu ô tô · mức tiêu thụ năng lượng · một sinh viên đại học" },
              { en: "Car ownership has doubled over the past decade.", vi: "Tỉ lệ sở hữu ô tô đã tăng gấp đôi trong thập kỷ qua." },
            ],
          },
          {
            formula: "số + gạch nối + N số ít + N",
            vi: "Cụm số đo làm tính từ: có gạch nối và KHÔNG thêm -s.",
            examples: [
              { en: "a five-year plan · a 20-storey building · a two-hour delay · a 10-per-cent rise", vi: "kế hoạch 5 năm · toà nhà 20 tầng · chậm 2 tiếng · mức tăng 10%" },
              { en: "The city has announced a ten-year housing programme.", vi: "Thành phố đã công bố một chương trình nhà ở 10 năm." },
            ],
          },
          {
            formula: "tính từ ghép: adv / adj / N + gạch nối + V-ing / V3 / adj",
            vi: "Một tính từ ghép thay cho cả một mệnh đề quan hệ.",
            examples: [
              { en: "a well-paid job · a fast-growing city · long-term effects · an environmentally friendly product", vi: "công việc lương cao · thành phố phát triển nhanh · ảnh hưởng dài hạn · sản phẩm thân thiện môi trường" },
              { en: "Low-income families are hit hardest by rising rents.", vi: "Các gia đình thu nhập thấp bị ảnh hưởng nặng nhất khi tiền thuê nhà tăng." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Mệnh đề dài", "Cụm bổ nghĩa trước (gọn)"],
        rows: [
          ["a plan which lasts five years", "a **five-year** plan"],
          ["a city which is growing fast", "a **fast-growing** city"],
          ["workers who are highly skilled", "**highly skilled** workers"],
          ["problems which are related to health", "**health-related** problems"],
          ["the policy of the government on energy", "the **government's energy** policy"],
          ["countries where incomes are low", "**low-income** countries"],
        ],
        caption: "Trạng từ đuôi -ly + tính từ (highly skilled, densely populated) KHÔNG cần gạch nối.",
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi người Việt hay sai với phần đứng trước",
        items: [
          "Thêm -s cho danh từ làm tính từ: ~~a five-years plan~~ → a five-**year** plan · ~~cars ownership~~ → **car** ownership · ~~a shoes shop~~ → a **shoe** shop.",
          "Xếp theo thứ tự tiếng Việt: ~~a policy government~~ → a **government policy** · ~~problems environment~~ → **environmental problems**.",
          "Sở hữu của NGƯỜI dùng 's, không ghép trơn: ~~children education~~ → **children's** education · ~~women rights~~ → **women's** rights. (Vật / tổ chức thì ghép trơn được: car prices, company profits.)",
          "Chồng quá 2 danh từ bổ nghĩa làm câu khó đọc: ~~the city centre traffic congestion reduction plan~~ → the plan **to reduce traffic congestion in the city centre**. Quá 2 danh từ ⇒ đẩy bớt ra phía sau.",
        ],
      },
      { t: "rule", formula: "a / the + (số-N số ít) + adj + N số ít + N chính", vi: "Mọi thứ đứng trước danh từ chính đều không thêm -s: a five-year government plan." },
      {
        t: "quiz",
        id: "t3d25-truoc-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bổ nghĩa trước danh từ (5 câu)",
        grammar: "số-N số ít + adj + N + N chính",
        items: [
          { q: "Chính phủ đã công bố một kế hoạch năng lượng 10 năm.", answers: ["The government has announced a ten-year energy plan.", "The government has announced a 10-year energy plan.", "The government announced a ten-year energy plan.", "The government announced a 10-year energy plan."], hint: "a ten-year energy plan (không thêm -s)" },
          { q: "Tỉ lệ sở hữu ô tô đang tăng ở các thành phố phát triển nhanh.", answers: ["Car ownership is rising in fast-growing cities.", "Car ownership is increasing in fast-growing cities.", "Car ownership is growing in fast-growing cities."], hint: "car ownership · fast-growing cities" },
          { q: "Các gia đình thu nhập thấp cần nhà ở giá phải chăng.", answers: ["Low-income families need affordable housing.", "Low-income families need affordable houses.", "Low-income households need affordable housing."], hint: "low-income families · affordable housing" },
          { q: "Giáo dục của trẻ em là một khoản đầu tư dài hạn.", answers: ["Children's education is a long-term investment."], hint: "children's education · a long-term investment" },
          { q: "Cô ấy có một công việc lương cao ở một công ty phần mềm.", answers: ["She has a well-paid job at a software company.", "She has a well-paid job in a software company.", "She has a well-paid job with a software company.", "She has got a well-paid job at a software company."], hint: "a well-paid job · a software company" },
        ],
      },

      /* ── 4. Bổ nghĩa sau ── */
      { t: "h", text: "4. Bổ nghĩa SAU danh từ: năm kiểu" },
      {
        t: "p",
        text: "Thông tin dài phải đứng **sau** danh từ chính. Có năm kiểu. Ba kiểu bạn đã học (mệnh đề quan hệ — Tập 2 Ngày 15 và Tập 3 Ngày 17; rút gọn V-ing / V3 — Tập 3 Ngày 17; mệnh đề that — Tập 3 Ngày 23). Hôm nay gom cả năm vào một bảng và học kỹ hai kiểu còn lại: **giới từ + danh từ** và **to V**.",
      },
      {
        t: "table",
        head: ["Kiểu", "Công thức", "Ví dụ", "Đã học ở"],
        rows: [
          ["① Cụm giới từ", "N + giới từ + N", "the rise **in unemployment** · people **on low incomes**", "hôm nay"],
          ["② Mệnh đề quan hệ", "N + who / which / that + V", "students **who study abroad**", "Tập 2 Ngày 15 · Tập 3 Ngày 17"],
          ["③ V-ing / V3 rút gọn", "N + V-ing (chủ động) · N + V3 (bị động)", "people **living in cities** · goods **made in China**", "Tập 3 Ngày 17"],
          ["④ to V", "N + to V", "the ability **to adapt** · a decision **to raise taxes**", "hôm nay"],
          ["⑤ that + mệnh đề (đồng vị)", "the fact / idea / belief + that + S + V", "the fact **that prices are rising**", "Tập 3 Ngày 23"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "N + of + N",
            vi: "Kiểu phổ biến nhất: “của”, hoặc nối danh từ danh hoá với tân ngữ của nó.",
            examples: [
              { en: "the cost of living · the quality of public services · the development of new technology", vi: "chi phí sinh hoạt · chất lượng dịch vụ công · sự phát triển của công nghệ mới" },
            ],
          },
          {
            formula: "N + in / on / for / to / with / between + N",
            vi: "Giới từ khác “of” do danh từ chính quyết định (xem mục 6).",
            examples: [
              { en: "a decline in sales · a ban on smoking · the need for change · a solution to the problem · the gap between rich and poor", vi: "sự sụt giảm doanh số · lệnh cấm hút thuốc · nhu cầu thay đổi · giải pháp cho vấn đề · khoảng cách giàu nghèo" },
            ],
          },
          {
            formula: "N + to V",
            vi: "Sau các danh từ chỉ khả năng, quyết định, cơ hội, cách thức, nỗ lực: ability · chance · opportunity · decision · attempt · effort · way · right · need · plan · failure.",
            examples: [
              { en: "Young people have more opportunities to travel than their parents did.", vi: "Giới trẻ có nhiều cơ hội đi du lịch hơn cha mẹ họ ngày trước." },
              { en: "The government's failure to act has made the problem worse.", vi: "Việc chính phủ không hành động đã làm vấn đề tệ hơn." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Chủ ngữ (danh từ chính in đậm)", "Động từ", "Vì sao"],
        rows: [
          ["The **number** of cars on the roads", "**has** increased.", "number = số ít"],
          ["The **quality** of the products sold online", "**is** often poor.", "quality = số ít"],
          ["The **people** who live in this area", "**are** mostly retired.", "people = số nhiều"],
          ["One of the main **reasons** for the decline", "**is** cost.", "chủ ngữ thật là **One**"],
          ["The **prices** of houses in the capital", "**have** doubled.", "prices = số nhiều"],
          ["A **number** of studies", "**show** this.", "a number of = many ⇒ động từ số nhiều"],
        ],
        caption: "Động từ chia theo danh từ chính — không theo danh từ đứng sát nó.",
      },
      {
        t: "note",
        title: "⚠️ Hay sai: chia động từ theo danh từ đứng gần",
        items: [
          "~~The number of tourists have risen.~~ → The **number** of tourists **has** risen. (the number of + N số nhiều + V **số ít**)",
          "~~A number of tourists has complained.~~ → A number of tourists **have** complained. (a number of = nhiều ⇒ V **số nhiều**)",
          "~~The quality of the roads are bad.~~ → The **quality** of the roads **is** bad.",
          "~~The ability of adapt~~ · ~~the ability adapting~~ → the ability **to adapt**. Sau ability / chance / decision / way là **to V**, không phải of + V hay V-ing. (Riêng: the idea **of** V-ing · the possibility **of** V-ing · the risk **of** V-ing · the cost **of** V-ing.)",
        ],
      },
      { t: "rule", formula: "The + N chính (số ít) + of + N số nhiều + V(s/es)", vi: "Gạch bỏ mọi thứ sau giới từ đầu tiên; động từ chia theo danh từ còn lại. The number of… + V số ít · A number of… + V số nhiều." },
      {
        t: "quiz",
        id: "t3d25-sau-dien",
        kind: "fill",
        title: "Chia động từ trong ngoặc ở HIỆN TẠI (đơn hoặc hoàn thành) theo danh từ chính (6 câu)",
        items: [
          { q: "The number of people working from home ______ (have) risen sharply since 2020.", answers: ["has"], hint: "danh từ chính: number" },
          { q: "The effects of climate change on agriculture ______ (be) already visible.", answers: ["are"], hint: "danh từ chính: effects" },
          { q: "One of the biggest problems facing young graduates ______ (be) the cost of housing.", answers: ["is"], hint: "chủ ngữ thật: One" },
          { q: "A number of recent studies ______ (suggest) that sleep affects memory.", answers: ["suggest"], hint: "a number of = many" },
          { q: "The quality of the meals served in schools ______ (have) improved.", answers: ["has"], hint: "danh từ chính: quality" },
          { q: "The decision to close the two libraries ______ (be) unpopular with residents.", answers: ["is"], hint: "danh từ chính: decision" },
        ],
      },

      /* ── 5. Danh hoá ── */
      { t: "h", text: "5. Danh hoá mức 1: đổi động từ / tính từ thành danh từ" },
      {
        t: "p",
        text: "**Danh hoá** (nominalisation) là biến một **hành động** (động từ) hoặc một **tính chất** (tính từ) thành **danh từ**. Văn nói kể chuyện bằng động từ: “Prices rose, so people complained.” Văn viết học thuật gói hành động vào danh từ: “**The rise in prices** led to **complaints**.” Câu thứ hai không khó hơn — chỉ cần biết ba bước đổi.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Ba bước danh hoá một câu",
        caption: "Prices rose sharply. → a sharp rise in prices",
        steps: [
          { label: "① Động từ → danh từ", sub: "rose → a rise" },
          { label: "② Trạng từ → tính từ", sub: "sharply → sharp" },
          { label: "③ Chủ ngữ / tân ngữ cũ → sau giới từ", sub: "prices → in prices" },
          { label: "④ Thêm động từ mới cho câu", sub: "There was… · … led to … · … was seen" },
        ],
      },
      {
        t: "table",
        head: ["Hậu tố", "Động từ → danh từ", "Hậu tố", "Tính từ → danh từ"],
        rows: [
          ["-tion / -sion", "introduce → introduction · reduce → reduction · expand → expansion · decide → decision", "-ity", "popular → popularity · able → ability · available → availability · equal → equality"],
          ["-ment", "develop → development · invest → investment · improve → improvement · employ → employment", "-ness", "aware → awareness · ill → illness · happy → happiness · weak → weakness"],
          ["-ance / -ence", "perform → performance · attend → attendance · exist → existence · depend → dependence", "-ence / -ance", "important → importance · different → difference · absent → absence · relevant → relevance"],
          ["-al / -ure / -y", "arrive → arrival · remove → removal · fail → failure · recover → recovery", "-cy / -th", "efficient → efficiency · accurate → accuracy · long → length · strong → strength"],
          ["không đổi / đổi nhẹ", "không đổi: rise · fall · increase · decrease · change — đổi nhẹ: growth (grow) · loss (lose) · choice (choose)", "đặc biệt", "poor → poverty · safe → safety · high → height · proud → pride"],
        ],
        caption: "Danh từ từ động từ không đổi dạng: trọng âm có thể đổi — to inCREASE (v) · an INcrease (n).",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "There + be + a / an + adj + N + in + N",
            vi: "Câu Task 1 kinh điển: gói “tăng / giảm thế nào” vào cụm danh từ.",
            examples: [
              { en: "Sales rose sharply in 2020. → There was a sharp rise in sales in 2020.", vi: "Doanh số tăng mạnh năm 2020. → Có một mức tăng mạnh về doanh số năm 2020." },
              { en: "The birth rate has fallen gradually. → There has been a gradual fall in the birth rate.", vi: "Tỉ lệ sinh đã giảm dần. → Đã có sự sụt giảm dần của tỉ lệ sinh." },
            ],
          },
          {
            formula: "S + saw / experienced / witnessed + a / an + adj + N + in + N",
            vi: "Chủ ngữ là nơi chốn hoặc thời gian (the city, the 1990s, the period).",
            examples: [
              { en: "The country saw a steady increase in exports.", vi: "Nước này chứng kiến xuất khẩu tăng đều." },
              { en: "The following decade witnessed a dramatic decline in coal use.", vi: "Thập kỷ sau đó chứng kiến việc dùng than giảm mạnh." },
            ],
          },
          {
            formula: "The + N (danh hoá) + of + tân ngữ cũ + V …",
            vi: "Câu Task 2: cả một hành động làm chủ ngữ — nối ý với câu trước rất mượt.",
            examples: [
              { en: "If the government introduces stricter laws, pollution will fall. → The introduction of stricter laws would reduce pollution.", vi: "Việc ban hành luật nghiêm hơn sẽ giảm ô nhiễm." },
              { en: "Cities are expanding rapidly, and this causes traffic problems. → The rapid expansion of cities causes traffic problems.", vi: "Sự mở rộng nhanh của các thành phố gây ra vấn đề giao thông." },
            ],
          },
          {
            formula: "This / Such + N (danh hoá) + V …",
            vi: "Dùng danh từ tóm lại cả câu trước — công cụ liên kết (CC) band 6, thay cho lặp “This”.",
            examples: [
              { en: "Many factories have closed. This decline has left thousands without work.", vi: "Nhiều nhà máy đã đóng cửa. Sự suy giảm này khiến hàng nghìn người mất việc." },
              { en: "People now shop online. This change has hurt small shops.", vi: "Giờ mọi người mua sắm trên mạng. Thay đổi này đã làm các cửa hàng nhỏ khó khăn." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Động từ + trạng từ", "Tính từ + danh từ", "Nghĩa"],
        rows: [
          ["rise sharply / dramatically", "a sharp / dramatic rise", "tăng mạnh"],
          ["fall slightly", "a slight fall", "giảm nhẹ"],
          ["grow steadily", "steady growth (không “a”)", "tăng trưởng đều"],
          ["decline gradually", "a gradual decline", "giảm dần"],
          ["change significantly", "a significant change", "thay đổi đáng kể"],
          ["fluctuate widely", "wide fluctuations", "dao động mạnh"],
          ["improve considerably", "a considerable improvement", "cải thiện đáng kể"],
        ],
        caption: "Đổi động từ thành danh từ thì PHẢI đổi trạng từ thành tính từ.",
      },
      {
        t: "note",
        title: "⚠️ Bốn lỗi người Việt hay sai khi danh hoá",
        items: [
          "Giữ nguyên trạng từ: ~~a sharply rise~~ → a **sharp** rise · ~~a dramatically change~~ → a **dramatic** change.",
          "Quên mạo từ: ~~There was sharp rise~~ → There was **a** sharp rise. Danh từ đếm được số ít luôn cần a / an / the. (growth, progress, employment, pollution không đếm được ⇒ không “a”.)",
          "Dùng V-ing thay cho danh từ đã có sẵn: ~~the developing of technology~~ → the **development** of technology · ~~the increasing of prices~~ → the **increase in** prices. Có danh từ riêng thì dùng danh từ riêng.",
          "Danh hoá xong lại thiếu động từ chính: ~~The introduction of new laws in 2020.~~ (chưa thành câu) → The introduction of new laws in 2020 **reduced** pollution.",
        ],
      },
      { t: "rule", formula: "S + V + adv  →  (There + be) a / an + adj + N + in / of + N", vi: "Động từ thành danh từ, trạng từ thành tính từ, chủ ngữ cũ lùi ra sau giới từ — rồi cho câu một động từ mới." },
      {
        t: "quiz",
        id: "t3d25-danh-hoa-dich",
        kind: "translate",
        title: "Viết lại bằng cụm danh từ — bắt đầu bằng từ cho sẵn (5 câu)",
        grammar: "There + be + a / an + adj + N + in + N · The + N + of + N + V",
        items: [
          { q: "The number of visitors fell sharply in 2020. → There was …", answers: ["There was a sharp fall in the number of visitors in 2020.", "There was a sharp fall in visitor numbers in 2020.", "There was a sharp decline in the number of visitors in 2020.", "There was a sharp drop in the number of visitors in 2020."], hint: "a sharp fall in + the number of visitors" },
          { q: "House prices have risen steadily. → There has been …", answers: ["There has been a steady rise in house prices.", "There has been a steady increase in house prices."], hint: "a steady rise in" },
          { q: "The city built a new airport, and this created 5,000 jobs. → The construction …", answers: ["The construction of a new airport created 5,000 jobs.", "The construction of the new airport created 5,000 jobs."], hint: "The construction of a new airport + created" },
          { q: "Unemployment increased significantly in the 1980s. → The 1980s saw …", answers: ["The 1980s saw a significant increase in unemployment.", "The 1980s saw a significant rise in unemployment."], hint: "saw a significant increase in" },
          { q: "If we reduce working hours, people will be happier. → A reduction …", answers: ["A reduction in working hours would make people happier.", "A reduction in working hours will make people happier.", "A reduction of working hours would make people happier."], hint: "A reduction in working hours + would make" },
        ],
      },

      /* ── 6. Giới từ sau danh từ ── */
      { t: "h", text: "6. Giới từ đi sau danh từ danh hoá" },
      {
        t: "p",
        text: "Ngày 9 (mục 4) bạn đã gặp 16 cụm **danh từ + giới từ**. Hôm nay gom chúng theo từng giới từ, thêm những danh từ vừa danh hoá — và nhớ rằng ==giới từ của danh từ không phải lúc nào cũng giống giới từ của động từ==: to **affect** something (không giới từ) nhưng an **effect on** something; to **solve** a problem nhưng a **solution to** a problem.",
      },
      {
        t: "table",
        head: ["Giới từ", "Danh từ", "Ví dụ"],
        rows: [
          ["**in** (thay đổi về lượng)", "rise · increase · fall · decrease · decline · drop · growth · reduction · change · improvement · investment", "a 10% increase **in** rents · investment **in** public transport"],
          ["**of** (mức / lượng cụ thể, hoặc tân ngữ)", "a rise **of** 10% · the introduction / development / construction / use / loss / lack **of**", "a rise **of** 5 million · the lack **of** affordable housing"],
          ["**for**", "demand · need · reason · responsibility · support · respect", "growing demand **for** electric cars · the reason **for** the delay"],
          ["**to**", "solution · access · damage · threat · alternative · approach · response · contribution", "a solution **to** the crisis · access **to** clean water · damage **to** the environment"],
          ["**on**", "effect · impact · influence · ban · tax · pressure · emphasis · dependence · research", "a negative impact **on** health · a ban **on** plastic bags"],
          ["**between**", "difference · gap · link · relationship · balance · comparison", "the gap **between** rich and poor · a link **between** diet and disease"],
          ["**with / towards**", "problem **with** · contact **with** · attitude **towards / to**", "the problem **with** this idea · attitudes **towards** work"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Hay nhầm: in hay of sau từ chỉ tăng – giảm",
        items: [
          "**in** + thứ thay đổi: an increase **in** prices. · **of** + con số thay đổi: an increase **of** 20%. Ghép cả hai: an increase **of** 20% **in** prices.",
          "~~the reason of~~ → the reason **for** · ~~a solution for~~ (hay gặp nhưng kém chuẩn) → a solution **to** · ~~the effect to~~ → the effect **on** · ~~demand of~~ → demand **for**.",
          "Động từ KHÔNG giới từ, danh từ CÓ: discuss a problem → a discussion **about / of** a problem · lack money → a lack **of** money · influence children → an influence **on** children.",
        ],
      },
      { t: "rule", formula: "a / an + adj + N (tăng – giảm) + of + con số + in + thứ thay đổi", vi: "of đi với con số, in đi với thứ thay đổi: a rise of 12% in exports." },
      {
        t: "quiz",
        id: "t3d25-gioi-tu-dien",
        kind: "fill",
        title: "Điền giới từ đúng sau danh từ (8 câu)",
        items: [
          { q: "There has been a sharp increase ______ the number of electric cars.", answers: ["in"], hint: "increase + thứ thay đổi" },
          { q: "The city reported a fall ______ 15% in crime.", answers: ["of"], hint: "fall + con số" },
          { q: "Nobody could explain the reason ______ the sudden decline.", answers: ["for"] },
          { q: "Tourism can have a damaging effect ______ local wildlife.", answers: ["on"] },
          { q: "Cycle lanes are only a partial solution ______ traffic congestion.", answers: ["to"] },
          { q: "Demand ______ rental housing has outstripped supply.", answers: ["for"] },
          { q: "Millions of people still have no access ______ the internet.", answers: ["to"] },
          { q: "The gap ______ urban and rural incomes continues to widen.", answers: ["between"] },
        ],
      },

      /* ── 7. Dùng trong bài thi ── */
      { t: "h", text: "7. Dùng trong bài thi: band 5 → band 6" },
      {
        t: "table",
        head: ["Ở đâu", "Band 5 — chuỗi câu đơn, toàn động từ", "Band 6 — cụm danh từ gói thông tin"],
        rows: [
          ["Task 1", "Car sales increased. They increased a lot in 2015.", "There was **a dramatic increase in car sales** in 2015."],
          ["Task 1", "The number of students went down slowly and then it went up fast.", "**A gradual decline in student numbers** was followed by **a rapid rise**."],
          ["Task 2", "People use private cars too much. It makes pollution. It is a big problem.", "**The overuse of private cars** is **a major cause of pollution** in cities."],
          ["Task 2", "If governments invest in public transport, it will be good.", "**Greater investment in public transport** would bring **long-term benefits**."],
          ["Task 2 (liên kết)", "Many young people move to cities. This makes villages empty.", "Many young people move to cities. **This migration** leaves villages empty."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: đừng danh hoá quá đà",
        items: [
          "Mỗi câu **một hoặc hai** cụm danh hoá là đủ. ~~The implementation of the reduction of the consumption of energy…~~ — ba “of” liền nhau là câu chết. Đổi một cụm về động từ: Implementing plans **to reduce energy consumption**…",
          "**Speaking**: người thật nói bằng động từ. Trong Part 1 – 2 nói “prices went up a lot”, đừng nói “there was a significant increase in prices”. Part 3 dùng được một – hai cụm khi nói về xã hội: “the **rise in** house prices”, “a **lack of** jobs”.",
          "Trộn cả hai kiểu trong một bài Task 1: một câu “There was a sharp rise in…”, câu sau “The figure then fell slightly…”. Band 6 cần **trộn** cấu trúc, không cần câu nào cũng danh hoá.",
        ],
      },
      { t: "rule", formula: "The + adj + N + of / in + N + V + a / an + adj + N + of / in + N", vi: "Khung câu Task 2 band 6: một cụm danh từ làm chủ ngữ, một cụm danh từ làm tân ngữ, giữa là động từ nguyên nhân – kết quả (causes · leads to · results in · contributes to)." },

      /* ── 8. Luyện tổng hợp ── */
      { t: "h", text: "8. Luyện tổng hợp" },
      {
        t: "quiz",
        id: "t3d25-ho-tu-dien",
        kind: "fill",
        title: "Viết dạng DANH TỪ của từ trong ngoặc (8 câu)",
        items: [
          { q: "The ______ (introduce) of a congestion charge reduced traffic by a fifth.", answers: ["introduction"] },
          { q: "There has been a marked ______ (improve) in air quality.", answers: ["improvement"] },
          { q: "The ______ (popular) of online courses has grown since 2020.", answers: ["popularity"] },
          { q: "The ______ (fail) of the project cost the company millions.", answers: ["failure"] },
          { q: "Public ______ (aware) of the problem is still low.", answers: ["awareness"] },
          { q: "The ______ (expand) of the airport was opposed by local residents.", answers: ["expansion"] },
          { q: "Economic ______ (grow) slowed to 2% last year.", answers: ["growth"] },
          { q: "The ______ (available) of cheap flights has changed the way people travel.", answers: ["availability"] },
        ],
      },
      {
        t: "mcq",
        id: "t3d25-np-chon",
        title: "Chọn cụm đúng (8 câu)",
        items: [
          { q: "The council has approved ______.", options: ["a three-years building programme", "a three-year building programme", "a three-year programme building", "a programme three-year building"], correct: 1, why: "Cụm số đo làm tính từ: gạch nối, danh từ số ít (three-year); danh từ bổ nghĩa (building) đứng trước danh từ chính (programme)." },
          { q: "The number of overseas students ______ over the last five years.", options: ["have doubled", "are doubled", "has doubled", "doubling"], correct: 2, why: "Danh từ chính là number (số ít) ⇒ has doubled." },
          { q: "There was ______ in oil prices in 2008.", options: ["a dramatic rise", "a dramatically rise", "dramatic rise", "a rise dramatic"], correct: 0, why: "Danh từ rise cần tính từ (dramatic) đứng trước và mạo từ a." },
          { q: "Many people lack the ability ______ to new technology.", options: ["of adapt", "adapting", "for adapt", "to adapt"], correct: 3, why: "ability + to V: the ability to adapt." },
          { q: "______ is one of the main causes of obesity.", options: ["The lack exercise", "Lacking of exercise", "A lack of exercise", "Lack for exercise"], correct: 2, why: "Danh từ lack đi với of: a lack of exercise. (Động từ lack thì không có giới từ.)" },
          { q: "The new road had a serious impact ______ nearby villages.", options: ["to", "on", "for", "with"], correct: 1, why: "impact / effect / influence + on." },
          { q: "A number of residents ______ about the noise.", options: ["have complained", "has complained", "is complaining", "complains"], correct: 0, why: "a number of = many ⇒ động từ số nhiều: have complained." },
          { q: "The report recommends ______.", options: ["an investment greater in railways", "greater invest in railways", "greater investment for railways", "greater investment in railways"], correct: 3, why: "investment (danh từ) + in; tính từ greater đứng trước danh từ." },
        ],
      },
      {
        t: "quiz",
        id: "t3d25-tong-hop-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng cụm danh từ theo gợi ý (5 câu)",
        grammar: "cụm danh từ làm chủ ngữ + V chia theo danh từ chính",
        items: [
          { q: "Việc thiếu nhà ở giá rẻ là một vấn đề nghiêm trọng ở các thành phố lớn.", answers: ["The lack of affordable housing is a serious problem in big cities.", "The lack of cheap housing is a serious problem in big cities.", "A lack of affordable housing is a serious problem in big cities.", "The lack of affordable housing is a serious problem in large cities."], hint: "The lack of affordable housing + is" },
          { q: "Số lượng khách du lịch đến thị trấn này đã tăng gấp đôi.", answers: ["The number of tourists visiting this town has doubled.", "The number of tourists who visit this town has doubled.", "The number of visitors to this town has doubled.", "The number of tourists coming to this town has doubled."], hint: "The number of tourists visiting… + has doubled" },
          { q: "Đã có một sự cải thiện đáng kể về giao thông công cộng.", answers: ["There has been a significant improvement in public transport.", "There has been a considerable improvement in public transport.", "There has been a marked improvement in public transport."], hint: "There has been a significant improvement in" },
          { q: "Quyết định tăng học phí đã dẫn đến các cuộc biểu tình.", answers: ["The decision to raise tuition fees led to protests.", "The decision to increase tuition fees led to protests.", "The decision to raise tuition fees has led to protests.", "The decision to increase tuition fees has led to protests."], hint: "The decision to raise tuition fees + led to" },
          { q: "Nhu cầu về xe điện đang tăng nhanh.", answers: ["Demand for electric cars is growing rapidly.", "The demand for electric cars is growing rapidly.", "Demand for electric cars is rising rapidly.", "Demand for electric cars is increasing rapidly.", "Demand for electric vehicles is growing rapidly.", "The demand for electric cars is increasing rapidly.", "Demand for electric cars is growing fast."], hint: "Demand for electric cars + is growing" },
        ],
      },
      {
        t: "note",
        title: "Mẹo dùng trong bài thi",
        items: [
          "**Task 1**: viết xong, đếm xem có ít nhất **2 câu** dạng “There was a + adj + N + in…” hoặc “… saw a + adj + N”. Có là đủ đa dạng cấu trúc cho band 6.",
          "**Task 2**: mở mỗi thân bài bằng một cụm danh từ làm chủ ngữ (The main cause of… is… · One major benefit of… is…). Câu chủ đề rõ ngay.",
          "**Soát bài**: gạch dưới danh từ chính của mọi chủ ngữ dài rồi nhìn động từ — bắt lỗi -s nhanh nhất.",
          "**Reading**: bài Đọc ngay sau đây có nhiều chủ ngữ dài 10–15 từ. Tìm danh từ chính trước.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t3d25-doc",
    kind: "reading",
    title: "Đọc: Summary completion (từ trong bài) 2 + Sentence completion",
    goal: "Làm đúng hai dạng điền từ lấy nguyên văn trong bài ở mức band 6 — Summary completion không có hộp từ và Sentence completion — khi câu hỏi đã đổi loại từ, đổi cấu trúc (động từ ↔ cụm danh từ) chứ không chỉ thay từ đồng nghĩa; 13 câu trong 20 phút, đúng ≥ 9.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì",
        items: [
          "**Ôn từ Tập 2 Ngày 2**: Summary completion lấy từ trong bài — 6 bước: tiêu đề + giới hạn từ → đọc lướt cả tóm tắt → đoán loại từ → khoanh vùng → tìm từ khớp → soát. Khi đó bài 500 từ, bản tóm tắt bám sát từng câu.",
          "**Ôn từ Ngày 9 (Tập 3)**: Sentence completion band 6 — nhìn giới từ quanh chỗ trống để đoán loại từ.",
          "Mới ở band 6: bản tóm tắt ==gói 2–3 đoạn vào 5–6 câu==, đảo thứ tự ý trong câu, và **đổi động từ thành cụm danh từ** (bài: “persuaded an MP… **to sign** the cover” → tóm tắt: “a politician's **signature** on the letter's ______”; bài: “**handling** them” → tóm tắt: “the ______ **of** letters”). Bài ngữ pháp sáng nay chính là chìa khoá.",
          "Bẫy lớn nhất: bài có **hai từ cùng loại** đứng gần nhau (sender / recipient · red / black ink). Chỉ một từ vừa nghĩa của câu hỏi.",
          "Luôn kiểm ba thứ trước khi sang câu khác: ==đúng giới hạn từ · đúng chính tả như trong bài · đọc lại cả câu thấy đúng ngữ pháp==.",
          "Bài đọc tự soạn: **A Penny for Any Distance** (lịch sử – xã hội: cải cách bưu chính Anh năm 1840, ~740 từ, đoạn A–G) — 7 câu Summary + 6 câu Sentence completion.",
        ],
      },

      { t: "h", text: "1. Hai dạng — giống gì, khác gì" },
      {
        t: "table",
        head: ["", "Summary completion (từ trong bài)", "Sentence completion"],
        rows: [
          ["Hình thức", "Một đoạn tóm tắt 80–120 từ có 5–8 chỗ trống, thường có **tiêu đề**", "5–7 câu rời, mỗi câu một chỗ trống"],
          ["Phủ phần nào của bài", "Thường **một phần** bài (2–3 đoạn liền nhau); đôi khi cả bài", "Rải khắp bài hoặc phần còn lại"],
          ["Thứ tự", "Thường theo thứ tự bài — nhưng trong MỘT câu tóm tắt, ý có thể đảo", "**Luôn** theo thứ tự bài"],
          ["Đáp án", "Từ **nguyên văn** trong bài, đúng giới hạn từ", "Từ **nguyên văn** trong bài, đúng giới hạn từ"],
          ["Khó ở đâu", "Phải tìm đúng **vùng** bài; tóm tắt nén nhiều câu thành một", "Mỗi câu ở một chỗ khác; phải định vị 6 lần"],
          ["Mẹo riêng", "Đọc **tiêu đề + cả đoạn tóm tắt** trước để biết nó nói về phần nào", "Câu sau luôn nằm sau câu trước ⇒ không đọc ngược lại"],
        ],
      },
      {
        t: "note",
        title: "Giới hạn từ — đọc kỹ từng chữ",
        items: [
          "**ONE WORD ONLY**: đúng một từ. Viết hai từ là sai, dù đúng nghĩa.",
          "**NO MORE THAN TWO WORDS AND/OR A NUMBER**: tối đa hai từ, có thể kèm một con số: “letter boxes” ✓ · “1874” ✓ · “single postal territory” ✗ (ba từ).",
          "Số viết bằng chữ số hay bằng chữ đều được (40 = forty) và tính là **một số**. Từ có gạch nối (thirty-five) tính là **một từ**.",
          "Không được **đổi dạng** từ: bài viết “sheets” mà bạn ghi “sheet” là sai nếu câu cần số nhiều. Chép y nguyên.",
        ],
      },

      { t: "h", text: "2. Quy trình 6 bước — bản band 6" },
      {
        t: "sodo",
        kind: "flow",
        title: "Sáu bước cho mọi câu điền từ lấy trong bài",
        caption: "Bước ③ và ⑤ là hai bước band 5 hay bỏ.",
        steps: [
          { label: "① Giới hạn từ", sub: "khoanh ONE WORD / TWO WORDS / NUMBER" },
          { label: "② Đọc tiêu đề + cả đoạn tóm tắt", sub: "nó nói về phần nào của bài?" },
          { label: "③ Đoán loại từ + nghĩa", sub: "by ___ → danh từ; a ___ company → tính từ / danh từ" },
          { label: "④ Định vị bằng từ khó đổi", sub: "tên riêng, số, năm, thuật ngữ" },
          { label: "⑤ Tìm câu CÙNG Ý", sub: "đổi loại từ? đổi chủ động – bị động? đảo vế?" },
          { label: "⑥ Chép nguyên văn + đọc lại", sub: "chính tả, số ít – nhiều, đủ giới hạn" },
        ],
      },
      {
        t: "table",
        head: ["Nhìn quanh chỗ trống", "Suy ra", "Ví dụ"],
        rows: [
          ["a / an / the / this + ___ (+ động từ)", "danh từ đếm được số ít", "it was the ___, not the sender, who paid → một NGƯỜI"],
          ["by / of / in / to + ___ (cuối câu)", "danh từ (thường không đếm được hoặc số nhiều)", "priced according to their ___ · the ___ of letters"],
          ["a ___ + danh từ", "tính từ hoặc danh từ làm tính từ", "a ___ penny rate → tính từ (uniform)"],
          ["số + ___ · the number of + ___", "danh từ số nhiều / đơn vị", "the number of ___ used → sheets"],
          ["___ or + N / N and ___", "cùng loại với từ bên kia “and / or”", "Switzerland and ___ → một tên nước"],
          ["only a ___ of + N", "danh từ chỉ lượng / phần", "a tiny fraction · a small proportion"],
        ],
      },
      { t: "rule", formula: "Giới hạn từ → đọc cả tóm tắt → loại từ → từ khó đổi → câu CÙNG Ý (đổi loại từ / đảo vế) → chép nguyên văn → đọc lại", vi: "Từ quanh chỗ trống thường KHÁC bài; riêng đáp án thì luôn là chữ nguyên văn của bài." },

      { t: "h", text: "3. Band 6: câu hỏi đổi CẤU TRÚC, không chỉ đổi từ" },
      {
        t: "p",
        text: "Ở Tập 2, câu tóm tắt thường chỉ thay một – hai từ đồng nghĩa. Ở band 6 người ra đề dùng đúng ba cách paraphrase bạn học ở Tập 2 Ngày 8 (Tập 3 Ngày 3 chia nhỏ thành 8 phép): ==đồng nghĩa · đổi loại từ · đổi cấu trúc==. Hãy tập nhận ra cả ba — cộng thêm hai kiểu hay gặp ở band 6: đảo vế nguyên nhân – kết quả và gói câu thành cụm danh từ.",
      },
      {
        t: "table",
        head: ["Kiểu đổi", "Trong bài", "Trong câu hỏi", "Đáp án"],
        rows: [
          ["Đồng nghĩa", "a **coded** message", "a **secret** ______", "message"],
          ["Đổi loại từ (động từ → danh từ)", "persuaded a Member of Parliament… **to sign** the cover", "obtained a politician's **signature** on the letter's ______", "cover"],
          ["Đổi cấu trúc (bị động ↔ chủ động)", "Payment **was** normally **made** not by the sender but **by the recipient**", "it was the ______, not the sender, who **paid**", "recipient"],
          ["Đảo vế nguyên nhân – kết quả", "**Because** letters were now prepaid, postmen no longer needed to wait at each door, so… householders began to fit letter boxes", "**As** postmen no longer waited at each house, many homes installed ______", "letter boxes"],
          ["Gói câu thành một cụm danh từ", "The real expense… lay not in carrying letters but **in handling them**", "the main cost came from **the ______ of letters**", "handling"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Năm bẫy và cách tránh",
        items: [
          "**Hai từ cùng loại nằm sát nhau**: “not by the **sender** but by the **recipient**” · “printed in **red** and cancelled in **black ink**”. Câu hỏi “it was the ______, not the sender, who paid” cần NGƯỜI TRẢ (recipient); câu hỏi về dấu huỷ tem từ năm 1841 cần “black ink”, không phải “red”. Đọc lại cả câu hỏi với từng từ.",
          "**Chép thừa từ**: bài viết “a single postal territory”, giới hạn hai từ ⇒ bỏ từ câu hỏi đã nói (one = single): “postal territory”.",
          "**Từ của câu hỏi đã có sẵn**: câu hỏi “…the ______ of letters, not from transporting them”, bài “not in **carrying** letters but in **handling** them” ⇒ transporting = carrying đã nằm trong câu hỏi; đáp án là vế CÒN LẠI (handling).",
          "**Lấy con số sai**: bài có 1837, 1840, 1841, 1847, 1874 và 76 million, 169 million. Câu hỏi “in the first year of the reform” ⇒ 169 million (năm 1840), không phải 76 million (năm 1839, TRƯỚC cải cách).",
          "**Tự đổi dạng từ cho hợp ngữ pháp**: nếu phải đổi dạng mới vừa câu thì bạn đang chọn sai từ. Đáp án đúng luôn vừa khít mà không cần sửa.",
        ],
      },

      { t: "h", text: "4. Khởi động — đoạn ngắn, 4 câu (4 phút)" },
      {
        t: "passage",
        title: "The barcode",
        intro: "Đọc đoạn văn rồi làm Questions 1–4.",
        paras: [
          { text: "The barcode was first used in a shop in 1974, when a packet of chewing gum was scanned at a supermarket in the American state of Ohio. The technology itself was much older: two graduate students had designed a pattern of lines in the late 1940s, but at that time no reliable device existed to read it. Only when cheap lasers appeared did scanning become practical. Supermarkets adopted barcodes quickly because they shortened queues at the checkout. A less obvious benefit emerged later. Since every sale was recorded automatically, managers knew exactly how much stock remained on the shelves, and orders to suppliers could be placed with far greater accuracy." },
        ],
      },
      {
        t: "quiz",
        id: "t3d25-doc-khoi-dong",
        kind: "fill",
        title: "Questions 1–4 — ONE WORD ONLY (từ lấy trong đoạn văn)",
        items: [
          { q: "1. Summary: The first product sold with a barcode was some ______, bought in Ohio in 1974.", answers: ["gum"], hint: "danh từ — một món hàng" },
          { q: "2. Summary: The idea dated from the 1940s, but could not be used until inexpensive ______ became available.", answers: ["lasers"], hint: "danh từ số nhiều" },
          { q: "3. Sentence: Shops liked barcodes at first because of the reduction in the length of ______.", answers: ["queues"], hint: "danh từ số nhiều" },
          { q: "4. Sentence: Automatic records of sales allowed managers to order goods with more ______.", answers: ["accuracy"], hint: "danh từ không đếm được" },
        ],
      },
      {
        t: "note",
        title: "Giải thích phần khởi động",
        items: [
          "**1 gum** — “a packet of chewing gum was scanned”. Câu hỏi đổi “scanned” thành “sold with a barcode”. Giới hạn một từ ⇒ “gum”, không phải “chewing gum”.",
          "**2 lasers** — “Only when cheap lasers appeared did scanning become practical.” inexpensive = cheap; became available = appeared. Chép số nhiều “lasers”.",
          "**3 queues** — “they shortened queues at the checkout”. Động từ **shortened** → cụm danh từ **the reduction in the length of** (đổi loại từ — đúng bài ngữ pháp hôm nay).",
          "**4 accuracy** — “orders… could be placed with far greater accuracy”. with more = with far greater. Không phải “stock”: stock là thứ họ BIẾT, không phải cách họ đặt hàng.",
        ],
      },

      { t: "h", text: "5. Bài đọc luyện tập — Questions 1–13 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ **20 phút**. Đọc lướt tiêu đề và câu đầu mỗi đoạn trong 2 phút để biết đoạn nào nói gì, rồi đọc câu hỏi. Questions 1–7 là một bản tóm tắt có tiêu đề — tiêu đề cho biết nó phủ phần nào của bài. Questions 8–13 đi tiếp theo thứ tự bài. Không dùng từ điển; từ lạ thì đoán từ ngữ cảnh (Ngày 9).",
      },
      {
        t: "passage",
        title: "A Penny for Any Distance",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "Until 1840, sending a letter in Britain was an expensive and complicated business. The charge depended on two things: the distance the letter travelled and the number of sheets of paper it contained. A single letter from London to Edinburgh could cost more than a shilling, a large sum for a working family. Payment was normally made not by the sender but by the recipient, so postmen had to collect money at every door, and clerks kept long accounts of what was owed. Every letter was therefore examined, measured and recorded at several points on its journey. Not surprisingly, many people found ways to avoid paying. Some wrote a coded message on the outside of the folded sheet, read it when the postman arrived, and then refused to accept the letter. Others persuaded a Member of Parliament, who was entitled to send post free, to sign the cover for them." },
          { label: "B", text: "The man who proposed a solution was not a postal official but a former schoolmaster with an interest in social reform, Rowland Hill. In 1837 he published a pamphlet arguing that the whole system rested on a mistaken idea. Using the Post Office's own figures, he calculated that carrying a letter from London to Edinburgh cost the service only a tiny fraction of a penny. The real expense, he insisted, lay not in carrying letters but in handling them at each end of their journey." },
          { label: "C", text: "His remedy was simple. Letters should be charged by weight rather than by distance, at a single low rate of one penny for anything up to half an ounce, and the charge should be paid in advance by the sender. To show that payment had been made, Hill suggested a small printed label with a sticky back, which customers could buy at the post office and attach to the letter. The uniform penny rate came into force on 10 January 1840, and in May of that year the first such label, printed in black and showing the head of the young Queen Victoria, went on sale. It became known as the Penny Black." },
          { label: "D", text: "The reform did not succeed without a struggle. Senior officials at the Post Office regarded the plan as reckless. Their main fear was financial: if the price of a letter fell so dramatically, they argued, the service would lose a great deal of money. In the short term they were right. Although the number of letters more than doubled in the first year, from about 76 million in 1839 to about 169 million in 1840, the Post Office's profits fell sharply and took many years to recover. There were technical problems, too. The red mark used to cancel the first stamps could be cleaned off, which allowed dishonest customers to use a stamp twice. In 1841 the colours were reversed: stamps were printed in red and cancelled in black ink." },
          { label: "E", text: "The social effects were far-reaching. For the first time, ordinary working people could afford to write regularly to relatives who had moved to industrial towns or emigrated overseas. Because letters were now prepaid, postmen no longer needed to wait at each door, so deliveries became much faster, and householders began to fit letter boxes in their front doors. Cheap post also encouraged the use of envelopes, which had rarely been used before because an envelope counted as an extra sheet and doubled the price." },
          { label: "F", text: "Other countries watched the experiment closely. Within a few years, parts of Switzerland and Brazil had issued stamps of their own, and the United States followed in 1847. Sending a letter abroad, however, remained confusing, because every pair of countries negotiated its own rates. The solution came in 1874, when representatives of more than twenty states met in the Swiss capital, Bern, and created the organisation later known as the Universal Postal Union. Its members agreed to treat the world as a single postal territory, with standard international rates." },
          { label: "G", text: "Historians still debate how much of the change should be attributed to Hill himself. Several earlier writers had suggested prepayment, and others claimed to have thought of the adhesive stamp first, so his achievement may have lain less in inventing anything new than in collecting the evidence and persuading Parliament. Today, letter volumes are falling in most countries as people turn to email and messaging apps. Yet the principle that Hill established, a low fixed price paid in advance regardless of distance, still shapes the way many services are sold." },
        ],
      },
      { t: "p", text: "**Questions 1–7.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer." },
      {
        t: "quiz",
        id: "t3d25-doc-summary",
        kind: "fill",
        title: "Questions 1–7 — Summary: “Postage before and after Hill's reform” (ONE WORD ONLY)",
        items: [
          { q: "1. Before 1840, the cost of a letter was calculated from the distance it travelled and the number of ______ used.", answers: ["sheets"], hint: "the number of + danh từ số nhiều" },
          { q: "2. Normally it was the ______, not the sender, who paid the charge.", answers: ["recipient"], hint: "danh từ chỉ người" },
          { q: "3. Some people avoided payment by reading a secret ______ written on the outside and then refusing the letter.", answers: ["message"], hint: "danh từ — đồng nghĩa" },
          { q: "4. Others obtained a politician's signature on the letter's ______, because such people could send mail free of charge.", answers: ["cover"], hint: "danh từ — đổi loại từ" },
          { q: "5. The reformer, Rowland Hill, had once worked as a ______ rather than in the postal service.", answers: ["schoolmaster"], hint: "a + danh từ chỉ nghề" },
          { q: "6. Hill argued that the main cost of the service came from the ______ of letters, not from transporting them.", answers: ["handling"], hint: "the + danh từ + of" },
          { q: "7. He proposed that letters should be priced according to their ______ and paid for in advance by the sender.", answers: ["weight"], hint: "danh từ không đếm được" },
        ],
      },
      { t: "p", text: "**Questions 8–13.** Complete the sentences below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer." },
      {
        t: "quiz",
        id: "t3d25-doc-sentence",
        kind: "fill",
        title: "Questions 8–13 — Sentence completion (NO MORE THAN TWO WORDS AND/OR A NUMBER)",
        items: [
          { q: "8. Senior Post Office officials objected to the plan mainly for ______ reasons.", answers: ["financial"], hint: "tính từ đứng trước reasons" },
          { q: "9. In the first year of the reform, the number of letters rose to about ______.", answers: ["169 million", "169,000,000", "169000000", "one hundred and sixty-nine million"], hint: "một con số (+ million)" },
          { q: "10. From 1841, used stamps were cancelled with ______ instead of a red mark.", answers: ["black ink"], hint: "tối đa hai từ — màu + chất liệu" },
          { q: "11. As postmen no longer waited at each house, many homes installed ______.", answers: ["letter boxes", "letterboxes"], hint: "danh từ số nhiều" },
          { q: "12. Members of the Universal Postal Union agreed to regard the world as one ______.", answers: ["postal territory"], hint: "tối đa hai từ — one đã có trong câu" },
          { q: "13. Some historians think Hill's real achievement was gathering ______ and convincing Parliament.", answers: ["evidence", "the evidence"], hint: "danh từ không đếm được" },
        ],
      },
      {
        t: "note",
        title: "Chấm xong — quy điểm",
        items: [
          "**11–13 đúng**: bạn đang ở mức band 6.5+ cho hai dạng này. Lần sau rút xuống 17 phút.",
          "**9–10 đúng**: đạt đích band 6. Xem bảng dưới để biết câu sai thuộc kiểu paraphrase nào.",
          "**≤ 8 đúng**: đọc lại mục 3 (kiểu đổi cấu trúc) và làm lại bài Tập 2 Ngày 2 một lượt trước khi sang bài Nghe.",
        ],
      },

      { t: "h", text: "6. Phân tích sau khi làm: đáp án nằm ở câu nào, đổi kiểu gì" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu trong bài (đoạn)", "Kiểu paraphrase · bẫy"],
        rows: [
          ["1", "sheets", "(A) the distance the letter travelled and the number of **sheets** of paper it contained", "The charge depended on = the cost was calculated from; contained → used. Chép số nhiều “sheets”"],
          ["2", "recipient", "(A) Payment was normally made not by the sender but by the **recipient**", "Bị động → chủ động: payment was made by X → it was X who paid. Bẫy: “sender” đã có trong câu hỏi"],
          ["3", "message", "(A) Some wrote a coded **message** on the outside of the folded sheet, read it…", "secret = coded; avoided payment = found ways to avoid paying; refusing = refused to accept"],
          ["4", "cover", "(A) persuaded a Member of Parliament, who was entitled to send post free, to sign the **cover**", "Đổi loại từ: to sign → signature; a Member of Parliament → a politician; send post free = send mail free of charge"],
          ["5", "schoolmaster", "(B) not a postal official but a former **schoolmaster**", "had once worked as = former; rather than in the postal service = not a postal official. Bẫy: “official”"],
          ["6", "handling", "(B) lay not in carrying letters but in **handling** them at each end", "Gói câu thành cụm danh từ: handling them → the handling of letters; transporting = carrying (vế đã có trong câu hỏi)"],
          ["7", "weight", "(C) Letters should be charged by **weight** rather than by distance", "priced according to = charged by; paid in advance by the sender ở câu sau. Bẫy: “distance” là cách TÍNH CŨ"],
          ["8", "financial", "(D) Their main fear was **financial**", "objected to = regarded as reckless / fear; for financial reasons = the fear was financial (đổi cấu trúc)"],
          ["9", "169 million", "(D) from about 76 million in 1839 to about **169 million** in 1840", "the first year of the reform = 1840. Bẫy số: 76 million là năm 1839, TRƯỚC cải cách"],
          ["10", "black ink", "(D) stamps were printed in red and cancelled in **black ink**", "From 1841 = In 1841; instead of a red mark = the colours were reversed (dấu đỏ cũ tẩy được). Bẫy: “red” — từ 1841 là màu của TEM, không phải dấu huỷ"],
          ["11", "letter boxes", "(E) householders began to fit **letter boxes** in their front doors", "Đảo vế: Because letters were prepaid, postmen no longer needed to wait → As postmen no longer waited; installed = began to fit; homes = householders"],
          ["12", "postal territory", "(F) to treat the world as a single **postal territory**", "regard … as = treat … as; one = single (đã có trong câu ⇒ không chép “single”)"],
          ["13", "evidence", "(G) in collecting the **evidence** and persuading Parliament", "gathering = collecting; convincing = persuading; Some historians think = Historians still debate… may have"],
        ],
      },
      {
        t: "note",
        title: "Soi ngữ pháp bài 1 trong bài đọc — tìm danh từ chính",
        items: [
          "“**The man** who proposed a solution **was** not a postal official…” — danh từ chính: **man**; phần “who proposed a solution” là mệnh đề quan hệ. Bỏ đi còn: The man was not a postal official.",
          "“**The red mark** used to cancel the first stamps **could** be cleaned off” — danh từ chính: **mark**; “used to cancel…” là V3 rút gọn (Ngày 17), KHÔNG phải “used to” chỉ thói quen.",
          "“Although **the number** of letters more than **doubled**…” — danh từ chính: **number**; letters chỉ là phần đứng sau of.",
          "“**The uniform penny rate** came into force…” — ba từ đứng trước danh từ chính **rate**: tính từ (uniform) + danh từ làm tính từ (penny, số ít).",
          "“…how much of **the change** should be attributed to Hill himself” — danh hoá: things changed → the change; câu hỏi 13 lại đổi “collecting the evidence” thành “gathering evidence”.",
          "“the real expense… lay not in **carrying** letters but in **handling** them” — câu hỏi 6 gói “handling them” thành cụm danh từ **the handling of letters**: đúng phép danh hoá V-ing + of của bài ngữ pháp.",
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "recipient", pos: "n", ipa: "/rɪˈsɪpiənt/", vi: "người nhận", ex: "The recipient had to pay before the letter was handed over.", exVi: "Người nhận phải trả tiền thì thư mới được trao.", more: "the recipient of a letter / an award / a grant · ↔ sender" },
          { w: "be entitled to", pos: "phr", ipa: "/bi ɪnˈtaɪtld tə/", vi: "có quyền (được làm / được hưởng)", ex: "Full-time staff are entitled to 20 days' paid leave.", exVi: "Nhân viên toàn thời gian được hưởng 20 ngày nghỉ có lương.", more: "be entitled to + N / to V · entitlement (n) — quyền lợi" },
          { w: "pamphlet", pos: "n", ipa: "/ˈpæmflət/", vi: "cuốn sách mỏng, tập tài liệu nhỏ (thường để tuyên truyền một ý kiến)", ex: "He set out his ideas in a short pamphlet.", exVi: "Ông trình bày ý tưởng trong một cuốn sách mỏng.", more: "publish / distribute a pamphlet · ≈ leaflet (tờ rơi, ngắn hơn)" },
          { w: "remedy", pos: "n", ipa: "/ˈremədi/", vi: "cách khắc phục, giải pháp", ex: "There is no simple remedy for traffic congestion.", exVi: "Không có cách khắc phục đơn giản cho tắc đường.", more: "a remedy **for** + N (giới từ for, không “to”) · a home remedy — bài thuốc dân gian" },
          { w: "come into force", pos: "phr", ipa: "/kʌm ˈɪntə fɔːs/", vi: "(luật, quy định) bắt đầu có hiệu lực", ex: "The new speed limit comes into force next month.", exVi: "Giới hạn tốc độ mới có hiệu lực từ tháng sau.", more: "= take effect · danh hoá: the introduction of a law" },
          { w: "far-reaching", pos: "adj", ipa: "/ˌfɑːˈriːtʃɪŋ/", vi: "sâu rộng, ảnh hưởng lớn", ex: "The internet has had far-reaching effects on education.", exVi: "Internet đã có ảnh hưởng sâu rộng tới giáo dục.", more: "far-reaching effects / consequences / changes — tính từ ghép (Ngữ pháp mục 3)" },
          { w: "attribute … to", pos: "v", ipa: "/əˈtrɪbjuːt tə/", vi: "cho rằng… là do / là công của", ex: "The rise in sales was attributed to lower prices.", exVi: "Doanh số tăng được cho là nhờ giá thấp hơn.", more: "be attributed to + N — cụm bị động rất hay gặp trong Reading và dùng được ở Task 2" },
          { w: "uniform", pos: "adj", ipa: "/ˈjuːnɪfɔːm/", vi: "đồng nhất, như nhau ở mọi nơi", ex: "A uniform rate was charged for every letter.", exVi: "Mọi lá thư đều tính một mức giá như nhau.", more: "a uniform rate / standard · uniformity (n) · nghĩa danh từ: đồng phục" },
        ],
      },
      {
        t: "note",
        title: "Mẹo nhớ cho ngày thi",
        items: [
          "Câu hỏi có **danh từ trừu tượng** (the reduction in… · the cost of… · the arrival of…) ⇒ trong bài rất có thể là một **động từ** (shortened · cost · arrived). Tìm động từ, đừng chỉ dò danh từ.",
          "Điền xong mỗi câu, **đọc thầm cả câu** một lần. Nghe trúc trắc ngữ pháp là dấu hiệu chọn sai từ.",
          "Hết giờ mà còn câu trống: điền một danh từ nằm gần vùng định vị. Bỏ trống thì chắc chắn 0 điểm.",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t3d25-nghe",
    kind: "listening",
    title: "Nghe: Đề nhỏ Part 3 + Part 4 — 20 câu và năm loại bẫy",
    goal: "Làm liền một mạch 20 câu Listening (Part 3: trắc nghiệm + matching; Part 4: note completion) ở tốc độ tự nhiên, nhận ra năm loại bẫy — nhắc rồi bác, đổi ý, số gây nhiễu, phủ định, từ quen dùng sai chỗ — và đạt ≥ 13/20.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì",
        items: [
          "Hôm nay là **đề nhỏ**: Part 3 (Questions 21–30) + Part 4 (Questions 31–40), làm liền, mỗi băng nghe **một lần** — đúng nửa sau của bài thi thật, cũng là nửa khó.",
          "**Part 3** (ôn từ Ngày 8 · 17 · 20): 2–3 người bàn việc học. Đáp án nằm ở chỗ họ **chốt**, không ở chỗ họ **nhắc tới**.",
          "**Part 4** (ôn từ Ngày 13 · 24): một người giảng, không có quãng nghỉ giữa bài. Ghi chú đi theo **tiêu đề mục** — nghe từ chuyển mục để không lạc.",
          "**Năm loại bẫy** (L15): ① nhắc rồi bác · ② đổi ý giữa chừng · ③ số / tên gây nhiễu · ④ phủ định và “nghĩ là… hoá ra…” · ⑤ từ của đề xuất hiện nhưng nói về việc khác.",
          "Đích band 6 của cả bài thi là 23/40. Hai Part khó này cần ==≥ 13/20==; Part 1 – 2 gánh phần còn lại.",
          "🔊 **Trọng âm cụm danh từ**: danh từ ghép nhấn từ ĐẦU (**FOOD** waste), tính từ + danh từ nhấn DANH TỪ (a sharp **RISE**) — nghe đúng trọng âm là bắt đúng từ khoá.",
        ],
      },

      { t: "h", text: "1. Năm loại bẫy — nghe tín hiệu nào để thoát" },
      {
        t: "table",
        head: ["Bẫy", "Băng nói thế nào", "Tín hiệu báo bẫy", "Cách xử lý"],
        rows: [
          ["① Nhắc rồi bác", "Một người đề xuất, người kia từ chối", "but · actually · I'm not sure · I wouldn't · that's not necessary", "Chưa ghi khi nghe đề xuất; chờ câu trả lời của người kia"],
          ["② Đổi ý", "Cùng một người nói A rồi sửa thành B", "originally · we'd planned to · at first · in the end · we actually…", "Đáp án là thứ đứng SAU in the end / actually"],
          ["③ Số, tên gây nhiễu", "Hai – ba con số cùng loại đứng gần nhau", "not… but · up to · around · rather than", "Ghi nháp cả hai, gạch số bị phủ nhận"],
          ["④ Phủ định · tưởng vậy mà không", "“You might think… In fact…”", "you might think · people assume · I'd expected · in fact · the main reason", "Đáp án đứng sau in fact / the main reason"],
          ["⑤ Từ của đề, ý khác", "Băng lặp đúng từ trong phương án sai", "phương án nào nghe **giống hệt chữ** trong băng", "Phương án đúng thường được **paraphrase**; giống y chữ thì nghi ngờ"],
        ],
      },
      {
        t: "note",
        title: "30 giây đọc đề — làm gì trước",
        items: [
          "**Trắc nghiệm**: gạch dưới từ khoá của CÂU HỎI (why · how · both students · tutor's opinion · before the next meeting). Chưa cần đọc kỹ ba phương án — chỉ cần biết câu hỏi hỏi **về ai** và **về điều gì**.",
          "**Matching**: đọc danh sách bên trái (thứ băng sẽ nói THEO THỨ TỰ) và học thuộc nhanh 6–7 phương án bên phải bằng từ khoá một chữ: shorten · chart · appendix · rewrite · check · no change · sources.",
          "**Note completion**: đọc các TIÊU ĐỀ MỤC trước, rồi đoán loại từ từng chỗ trống (danh từ? động từ? tên nước?).",
        ],
      },
      { t: "rule", formula: "Nghe đề xuất → CHỜ phản hồi (but / actually / in the end / in fact) → mới ghi", vi: "Trong Part 3, thứ được nói đầu tiên hiếm khi là đáp án; đáp án là thứ được chốt." },

      { t: "h", text: "2. Khởi động: ba cái bẫy trong 45 giây" },
      {
        t: "p",
        text: "Nghe **một lần** và trả lời 3 câu. Mỗi câu cài một loại bẫy ở bảng trên. Nghe xong hãy tự gọi tên loại bẫy trước khi xem giải thích.",
      },
      {
        t: "listen",
        id: "t3d25-nghe-khoi-dong",
        title: "Planning a field trip",
        dan: { so: "Day 25, Recording 1", boiCanh: "two students, Lucy and Mark, planning a geography field trip.", cau: [1, 3] },
        note: "Khoảng 45 giây. Hai giọng: Anh (nữ) và Mỹ (nam).",
        lines: [
          { who: "Lucy", voice: "uk-nu", text: "So, the field trip. We originally said the fourteenth, didn't we?", vi: "Vậy, chuyến thực địa. Ban đầu mình nói ngày mười bốn, đúng không?" },
          { who: "Mark", voice: "us-nam", text: "We did, but the coach company can't do the fourteenth. They offered the sixteenth or the nineteenth, and the nineteenth is in exam week, so I booked the sixteenth.", vi: "Đúng, nhưng hãng xe không chạy được ngày mười bốn. Họ đề nghị ngày mười sáu hoặc mười chín, mà ngày mười chín rơi vào tuần thi, nên mình đặt ngày mười sáu." },
          { who: "Lucy", voice: "uk-nu", text: "Fine. And are we going to the river or the coast? I'd assumed the river, because it's closer.", vi: "Được. Mình đi sông hay ra bờ biển? Mình cứ tưởng là sông, vì gần hơn." },
          { who: "Mark", voice: "us-nam", text: "It is closer, but Dr Evans says the water level is too high at the moment. So it'll have to be the coast.", vi: "Đúng là gần hơn, nhưng thầy Evans nói lúc này mực nước cao quá. Nên phải ra bờ biển thôi." },
          { who: "Lucy", voice: "uk-nu", text: "OK. Should everyone bring a camera?", vi: "OK. Mọi người có nên mang máy ảnh không?" },
          { who: "Mark", voice: "us-nam", text: "Phones are fine for photos. What people keep forgetting is waterproof boots. Those really are essential.", vi: "Chụp bằng điện thoại là được. Thứ mọi người hay quên là ủng chống nước. Cái đó mới thật sự cần." },
        ],
      },
      {
        t: "mcq",
        id: "t3d25-nghe-khoi-dong-cau",
        title: "Questions 1–3 — Choose the correct letter, A, B or C",
        items: [
          { q: "1. The field trip will take place on the", options: ["14th.", "16th.", "19th."], correct: 1, why: "Bẫy ② đổi ý + ③ số nhiễu: “originally… the fourteenth” (bỏ), “the nineteenth is in exam week” (loại), “so I booked the sixteenth” (chốt)." },
          { q: "2. The students will go to", options: ["the coast.", "the river.", "a lake."], correct: 0, why: "Bẫy ④ tưởng vậy mà không: “I'd assumed the river” → “the water level is too high… So it'll have to be the coast.”" },
          { q: "3. What must every student bring?", options: ["a camera", "a phone", "waterproof boots"], correct: 2, why: "Bẫy ① nhắc rồi bác: camera bị gạt (“Phones are fine”), phone không phải thứ BẮT BUỘC; “waterproof boots… really are essential”." },
        ],
      },

      { t: "h", text: "3. Đề nhỏ — Part 3: Questions 21–30" },
      {
        t: "p",
        text: "Bạn sẽ nghe hai sinh viên, **Maya** và **Daniel**, nói chuyện với giảng viên hướng dẫn, **Dr Reid**, về bản nháp báo cáo dự án. Dành **30 giây** đọc Questions 21–25 và 26–30 bên dưới rồi mới bấm nghe. Nghe **một lần**. Trả lời ngay trong lúc nghe.",
      },
      {
        t: "table",
        head: ["Questions 26–30", "Phương án A–G"],
        rows: [
          ["**What do they decide to do about each section of the report?**", "**A** make it shorter"],
          ["26 Introduction", "**B** add a chart"],
          ["27 Literature review", "**C** move part of it to an appendix"],
          ["28 Methods", "**D** rewrite it completely"],
          ["29 Results", "**E** check the figures again"],
          ["30 Recommendations", "**F** make no changes"],
          ["", "**G** include more sources"],
        ],
        caption: "Có 7 phương án cho 5 câu — hai phương án không dùng. Mỗi phương án dùng tối đa một lần.",
      },
      {
        t: "listen",
        id: "t3d25-nghe-p3",
        title: "Part 3 — A report on food waste in the university canteen",
        dan: { so: "Day 25, Recording 2 (Listening Part 3)", boiCanh: "two students, Maya and Daniel, talking to their tutor, Dr Reid, about the draft of a project report on food waste.", cau: [21, 30] },
        note: "Khoảng 4 phút rưỡi, tốc độ tự nhiên. Ba giọng: Anh (nữ, giảng viên), Mỹ (nữ), Úc (nam).",
        lines: [
          { who: "Dr Reid", voice: "uk-nu", text: "Come in, both of you. Now, you've sent me the draft of your report on food waste in the university canteen. Before we go through it, remind me how the project came about." },
          { who: "Maya", voice: "us-nu", text: "Well, originally we were going to look at plastic packaging on campus — that was Daniel's idea. But when we spoke to the canteen manager, she mentioned that nobody had ever measured how much food was thrown away there. So we thought that would be more original." },
          { who: "Daniel", voice: "au-nam", text: "Yes, I was quite happy to drop the packaging idea. There are dozens of studies on that already." },
          { who: "Dr Reid", voice: "uk-nu", text: "Good. And how did you collect your data in the end? I remember you talking about a questionnaire." },
          { who: "Maya", voice: "us-nu", text: "We'd planned to give students a questionnaire about what they left on their plates, but people aren't very honest about that sort of thing. So in the end we actually weighed the leftovers ourselves, at the tray-return point, every lunchtime for two weeks." },
          { who: "Daniel", voice: "au-nam", text: "We did think about filming the trays as well, but the canteen staff weren't comfortable with a camera, so that never happened." },
          { who: "Dr Reid", voice: "uk-nu", text: "Sensible. And was there anything in the results that you hadn't expected?" },
          { who: "Daniel", voice: "au-nam", text: "I'd assumed most of the waste would be salad and vegetables, and there was quite a lot. But the biggest category by far was rice and pasta — which makes sense, I suppose, because the portions are huge." },
          { who: "Maya", voice: "us-nu", text: "The thing that really surprised me, though, wasn't the type of food. It was the day. Waste was almost double on Fridays." },
          { who: "Daniel", voice: "au-nam", text: "That's true. Neither of us saw that coming. That was the one finding we couldn't explain at first." },
          { who: "Dr Reid", voice: "uk-nu", text: "And your explanation now is that students go home early on Fridays, so the kitchen cooks more than it sells?" },
          { who: "Maya", voice: "us-nu", text: "Yes, that's what we wrote." },
          { who: "Dr Reid", voice: "uk-nu", text: "It's a reasonable idea, and it may well be right. But at the moment there's nothing in the report to back it up. You'd need something to support it." },
          { who: "Daniel", voice: "au-nam", text: "Should we repeat the weighing for another week, then?" },
          { who: "Dr Reid", voice: "uk-nu", text: "I don't think that's necessary. Two weeks is fine for a project of this size. What I would do is ask the manager for the number of meals sold each day." },
          { who: "Maya", voice: "us-nu", text: "I'll email her this afternoon. We were also thinking of interviewing some students." },
          { who: "Dr Reid", voice: "uk-nu", text: "Leave that for now. You can mention it as an idea for further research. Right, let's go through the report itself, section by section. The introduction first. It's nearly two pages." },
          { who: "Maya", voice: "us-nu", text: "I know. I did wonder about cutting it down." },
          { who: "Dr Reid", voice: "uk-nu", text: "Actually, I wouldn't. The background is clear and everything in it is relevant. I'd leave it exactly as it stands." },
          { who: "Daniel", voice: "au-nam", text: "I'm less happy with the literature review. I think we should start that one again." },
          { who: "Dr Reid", voice: "uk-nu", text: "The writing is fine, Daniel. The problem is that you've relied on only three articles, and two of them are by the same author. Find four or five more studies, recent ones if you can, and work them in." },
          { who: "Daniel", voice: "au-nam", text: "OK, that's less work than I feared." },
          { who: "Dr Reid", voice: "uk-nu", text: "Now, the methods section is too long. You describe the weighing procedure in a paragraph, and then you describe it again in a table." },
          { who: "Maya", voice: "us-nu", text: "Should we take the table out and put it in an appendix?" },
          { who: "Dr Reid", voice: "uk-nu", text: "No, keep the table where it is. It's the paragraph above it that repeats everything. Reduce that to three or four sentences." },
          { who: "Maya", voice: "us-nu", text: "Got it. And the results?" },
          { who: "Dr Reid", voice: "uk-nu", text: "The numbers look right — I checked a couple of the totals myself. But it's four paragraphs of figures, and it's hard to follow." },
          { who: "Daniel", voice: "au-nam", text: "We could put in a bar chart showing the waste for each day of the week." },
          { who: "Dr Reid", voice: "uk-nu", text: "That's exactly what it needs." },
          { who: "Maya", voice: "us-nu", text: "And the recommendations? We suggested smaller portions and a discount on Fridays." },
          { who: "Dr Reid", voice: "uk-nu", text: "They're good ideas, but they don't follow from your results. You recommend changing the portion size, yet you never measured portions. I'm afraid this section has to be started again from scratch, based on what your data actually shows." },
          { who: "Daniel", voice: "au-nam", text: "So not just adding a few sentences." },
          { who: "Dr Reid", voice: "uk-nu", text: "No, I'm afraid not." },
        ],
      },
      {
        t: "mcq",
        id: "t3d25-nghe-p3-mcq",
        title: "Questions 21–25 — Choose the correct letter, A, B or C",
        items: [
          { q: "21. Why did the students choose to study food waste?", options: ["It had not been measured in the canteen before.", "Their tutor recommended the topic.", "They had already collected data on packaging."], correct: 0, why: "“nobody had ever measured how much food was thrown away there… more original”. Không ai nói giảng viên gợi ý; đề tài bao bì bị BỎ chứ chưa thu dữ liệu." },
          { q: "22. How did the students collect their data?", options: ["by giving students a questionnaire", "by filming the trays", "by weighing the food that was left"], correct: 2, why: "Bẫy đổi ý: “We'd planned to give… a questionnaire, but… in the end we actually weighed the leftovers”. Quay phim “never happened”." },
          { q: "23. What surprised both students most?", options: ["the amount of salad that was wasted", "the fact that rice and pasta were wasted most", "the difference between days of the week"], correct: 2, why: "Maya: “wasn't the type of food. It was the day.” Daniel: “Neither of us saw that coming.” Cơm – mì thì Daniel thấy “makes sense”. Từ khoá của đề là BOTH." },
          { q: "24. What does Dr Reid say about their explanation for the Friday figures?", options: ["It is probably wrong.", "It needs evidence to support it.", "It has been confirmed by other studies."], correct: 1, why: "“it may well be right. But… there's nothing in the report to back it up. You'd need something to support it.” back up = support with evidence." },
          { q: "25. What will the students do before the next meeting?", options: ["request sales figures from the manager", "collect data for another week", "interview some students"], correct: 0, why: "Bẫy nhắc rồi bác: cân thêm một tuần — “I don't think that's necessary”; phỏng vấn — “Leave that for now”. Chốt: “ask the manager for the number of meals sold” ⇒ Maya “I'll email her”." },
        ],
      },
      {
        t: "quiz",
        id: "t3d25-nghe-p3-match",
        kind: "fill",
        title: "Questions 26–30 — ghi MỘT chữ cái A–G cho mỗi phần của báo cáo",
        items: [
          { q: "26. Introduction", answers: ["F"], hint: "Maya định làm gì? Dr Reid trả lời sao?" },
          { q: "27. Literature review", answers: ["G"], hint: "Daniel đề xuất gì? Vấn đề thật là gì?" },
          { q: "28. Methods", answers: ["A"], hint: "Cái bảng ở lại hay đi?" },
          { q: "29. Results", answers: ["B"], hint: "Số liệu đã được kiểm chưa?" },
          { q: "30. Recommendations", answers: ["D"], hint: "from scratch nghĩa là gì?" },
        ],
      },

      { t: "h", text: "4. Đề nhỏ — Part 4: Questions 31–40" },
      {
        t: "p",
        text: "Bạn sẽ nghe một phần bài giảng về kiến trúc bền vững. Dành **45 giây** đọc bản ghi chú. Chú ý các tiêu đề mục: Thick walls → The courtyard → Wind towers. Viết **ONE WORD ONLY** cho mỗi chỗ trống. Nghe **một lần**.",
      },
      {
        t: "table",
        head: ["Keeping buildings cool without electricity — lecture notes"],
        rows: [
          ["**Thick walls**"],
          ["• built of mud brick or **31** ______"],
          ["• what matters is the **32** ______ of 8–12 hours before heat gets through"],
          ["• small windows placed high so that hot air could **33** ______"],
          ["**The courtyard**"],
          ["• cool air sinks into the courtyard at **34** ______"],
          ["• a pool or fountain cools the air through **35** ______"],
          ["• trees were chosen mainly for their **36** ______"],
          ["**Wind towers**"],
          ["• particularly common in **37** ______"],
          ["• the openings face the usual direction of the **38** ______"],
          ["• in some towns, linked to an underground water **39** ______"],
          ["• ice could be kept through the summer, mainly to preserve **40** ______"],
        ],
      },
      {
        t: "listen",
        id: "t3d25-nghe-p4",
        title: "Part 4 — Keeping buildings cool without electricity",
        dan: { so: "Day 25, Recording 3 (Listening Part 4)", boiCanh: "part of a lecture on sustainable architecture, about traditional ways of keeping buildings cool.", cau: [31, 40] },
        note: "Khoảng 4 phút, tốc độ tự nhiên, giọng Canada (nam). Một người nói, không có quãng nghỉ giữa bài. ONE WORD ONLY.",
        lines: [
          { who: "Lecturer", voice: "ca-nam", text: "Good afternoon. Today's lecture continues our series on sustainable architecture, and I want to look at how people kept their buildings cool long before air conditioning was invented. This matters because cooling already accounts for a significant share of the electricity used around the world, and that demand is expected to rise sharply as cities in hot regions grow. So engineers are looking again at some very old ideas. I'll take three of them in turn." },
          { who: "Lecturer", voice: "ca-nam", text: "Let me start with the simplest idea of all: thick walls. In hot, dry regions, houses were traditionally built of mud brick or stone, and the walls could be up to a metre thick. A wall like that absorbs heat very slowly during the day, so the inside of the house stays cool. Then it releases that heat at night, when the desert air is cold and the warmth is actually welcome. The important point here is not the thickness itself but the delay. It can take somewhere between eight and twelve hours for the heat to pass through. Windows in these houses were small, and they were placed high up on the wall rather than at eye level. You might think that was for privacy, and partly it was. But the main reason was to let hot air escape, since hot air rises." },
          { who: "Lecturer", voice: "ca-nam", text: "The second idea is the courtyard. Many traditional houses in the Middle East, North Africa and southern Spain are built around an open space in the centre. During the day the courtyard is in shade for most of the time, because the walls around it are tall. But it does its real work at night, when cool air sinks into the courtyard and flows from there into the surrounding rooms. Very often there was a fountain or a pool in the middle. Now, people tend to assume that the water was simply decoration. In fact, its purpose was evaporation: as water evaporates, it takes heat out of the air. Trees helped as well, although they were chosen less for their fruit than for their shade." },
          { who: "Lecturer", voice: "ca-nam", text: "The third idea, and the most impressive, is the wind tower, sometimes called a wind catcher. You can find them in several countries around the Gulf, but they are especially associated with Iran, where some are several hundred years old. A wind tower looks rather like a tall chimney on the roof, with openings near the top. Those openings face the direction that the wind normally comes from, so the tower catches the breeze and sends it down into the house. And when there is no breeze at all, the system works in reverse: warm air inside the house rises and leaves through the tower, pulling cooler air in behind it." },
          { who: "Lecturer", voice: "ca-nam", text: "In some desert towns, the builders went one step further and connected the tower to an underground channel carrying water from the mountains. The air passed over this cold water before it entered the living rooms. With a system like that, it was even possible to store ice right through the summer. And that wasn't just a luxury for the rich — the ice was used mainly to preserve food. So, what can modern architects learn from all this? Well, several recent office buildings use exactly the same principles, and they need only a fraction of the energy of a conventional air-conditioned block. We'll look at two of those next week." },
        ],
      },
      {
        t: "quiz",
        id: "t3d25-nghe-p4-note",
        kind: "fill",
        title: "Questions 31–40 — Note completion (ONE WORD ONLY)",
        items: [
          { q: "31. built of mud brick or ______", answers: ["stone"] },
          { q: "32. what matters is the ______ of 8–12 hours before heat gets through", answers: ["delay"] },
          { q: "33. small windows placed high so that hot air could ______", answers: ["escape"] },
          { q: "34. cool air sinks into the courtyard at ______", answers: ["night"] },
          { q: "35. a pool or fountain cools the air through ______", answers: ["evaporation"] },
          { q: "36. trees were chosen mainly for their ______", answers: ["shade"] },
          { q: "37. particularly common in ______", answers: ["Iran"] },
          { q: "38. the openings face the usual direction of the ______", answers: ["wind", "breeze"] },
          { q: "39. in some towns, linked to an underground water ______", answers: ["channel"] },
          { q: "40. ice could be kept through the summer, mainly to preserve ______", answers: ["food"] },
        ],
      },
      {
        t: "note",
        title: "Chấm điểm 20 câu",
        items: [
          "**16–20**: vượt đích. Hai Part khó mà đúng 80% thì cả bài 40 câu của bạn đang ở vùng band 6.5–7.",
          "**13–15**: đạt đích band 6. Xem bảng dưới: câu sai thuộc loại bẫy nào thì ghi vào sổ lỗi đúng tên loại đó.",
          "**≤ 12**: nghe lại Part 3 với lời thoại mở, dừng ở mỗi chữ but / actually / in the end và tự hỏi “cái gì vừa bị bác?”. Rồi làm lại bài Nghe Ngày 17 và Ngày 20.",
          "Sai chính tả (evaporation, channel) cũng là sai. Đọc lại mục bẫy chính tả của bài Nghe Tập 2 Ngày 19.",
        ],
      },

      { t: "h", text: "5. Sau khi nghe — đáp án nằm ở câu nào, bẫy loại gì" },
      {
        t: "table",
        head: ["Câu", "Đáp án", "Câu trong băng", "Bẫy"],
        rows: [
          ["21", "A", "nobody had ever measured how much food was thrown away there", "⑤ “packaging” được nhắc hai lần nhưng là đề tài bị bỏ"],
          ["22", "C", "in the end we actually weighed the leftovers ourselves", "② đổi ý: questionnaire → weighed; ① filming bị bác"],
          ["23", "C", "It was the day… Neither of us saw that coming.", "④ Daniel “I'd assumed… salad”; câu hỏi có BOTH"],
          ["24", "B", "there's nothing in the report to back it up", "⑤ “may well be right” dễ làm chọn nhầm sang ý “đã được xác nhận”"],
          ["25", "A", "ask the manager for the number of meals sold each day", "① hai đề xuất bị bác: another week · interviewing"],
          ["26", "F", "I'd leave it exactly as it stands.", "① Maya: “cutting it down” → “Actually, I wouldn't.”"],
          ["27", "G", "Find four or five more studies… and work them in.", "① Daniel: “start that one again” → “The writing is fine.”"],
          ["28", "A", "Reduce that to three or four sentences.", "① appendix bị bác: “No, keep the table where it is.”"],
          ["29", "B", "We could put in a bar chart… — That's exactly what it needs.", "⑤ “I checked a couple of the totals” — việc kiểm ĐÃ làm, không phải việc sẽ làm"],
          ["30", "D", "has to be started again from scratch", "paraphrase: from scratch = completely"],
          ["31", "stone", "built of mud brick or stone", "không bẫy — câu dễ lấy điểm, đừng lỡ vì chưa kịp vào nhịp"],
          ["32", "delay", "not the thickness itself but the delay", "③ / ④ not… but…: thickness bị gạt"],
          ["33", "escape", "the main reason was to let hot air escape", "④ “You might think… privacy… But the main reason…”"],
          ["34", "night", "it does its real work at night, when cool air sinks into the courtyard", "③ “During the day… in shade” đứng ngay trước"],
          ["35", "evaporation", "In fact, its purpose was evaporation", "④ “people tend to assume… decoration. In fact…”"],
          ["36", "shade", "chosen less for their fruit than for their shade", "③ less A than B ⇒ đáp án là B"],
          ["37", "Iran", "especially associated with Iran", "③ “several countries around the Gulf” là ý chung, không điền được một từ"],
          ["38", "wind", "the direction that the wind normally comes from", "usual = normally"],
          ["39", "channel", "an underground channel carrying water", "đổi trật tự: channel carrying water → water channel"],
          ["40", "food", "the ice was used mainly to preserve food", "④ “wasn't just a luxury for the rich”"],
        ],
      },
      {
        t: "note",
        title: "Cụm danh từ trong băng — nối với bài ngữ pháp sáng nay",
        items: [
          "Câu hỏi 32 dùng danh hoá: “the **delay** of 8–12 hours before heat gets through” — băng nói bằng động từ: “It can **take** between eight and twelve hours for the heat to pass through.”",
          "Câu 35: “cools the air **through evaporation**” — băng: “as water **evaporates**, it takes heat out of the air.” Bản ghi chú luôn ưa danh từ; người nói luôn ưa động từ.",
          "Câu 39: băng “an underground channel carrying water” (bổ nghĩa SAU bằng V-ing) → ghi chú “an underground water channel” (bổ nghĩa TRƯỚC bằng danh từ). Cùng một ý, hai phía của danh từ chính.",
        ],
      },

      { t: "h", text: "6. Phát âm: trọng âm trong cụm danh từ" },
      {
        t: "p",
        text: "Trong băng, từ được **nhấn** là từ mang thông tin — thường chính là đáp án. Cụm danh từ có hai kiểu nhấn. **Danh từ ghép** (N + N: hai từ gộp thành một khái niệm) nhấn từ **thứ nhất**: **FOOD** waste, **BAR** chart, **WIND** tower. **Tính từ + danh từ** nhấn **danh từ**: a sharp **RISE**, thick **WALLS**, hot **AIR**. Người Việt hay nhấn đều mọi từ, hoặc nhấn từ cuối của danh từ ghép (food **WASTE**) — nghe thành hai ý rời nhau.",
      },
      {
        t: "table",
        head: ["Kiểu", "Nhấn ở đâu", "Ví dụ (chữ HOA = nhấn)"],
        rows: [
          ["Danh từ ghép (N + N)", "từ thứ nhất", "FOOD waste · BAR chart · WIND tower · COURTyard · SALES figures · POST office"],
          ["Tính từ + danh từ", "danh từ", "a sharp RISE · thick WALLS · cool AIR · a gradual deCLINE · further reSEARCH"],
          ["Danh từ + of / in + danh từ", "danh từ SAU giới từ (từ mới)", "the cost of LIVing · a rise in PRICes · the number of MEALS"],
          ["So sánh nghĩa", "khác nhấn ⇒ khác nghĩa", "a GREENhouse (nhà kính) ≠ a green HOUSE (ngôi nhà màu xanh)"],
        ],
      },
      {
        t: "phatam",
        id: "t3d25-phat-am",
        title: "Luyện phát âm — trọng âm cụm danh từ",
        note: "Câu 1–3: danh từ ghép, nhấn từ thứ nhất. Câu 4–6: tính từ + danh từ, nhấn danh từ. Câu 7–8: trộn cả hai. Giới từ of / in / a / the đọc yếu thành /əv/ /ɪn/ /ə/ /ðə/.",
        items: [
          { text: "Food waste is a growing problem.", ipa: "fuːd weɪst ɪz ə ɡrəʊɪŋ prɒbləm", vi: "Lãng phí thực phẩm là một vấn đề ngày càng lớn." },
          { text: "The bar chart shows the sales figures.", ipa: "ðə bɑː tʃɑːt ʃəʊz ðə seɪlz fɪɡəz", vi: "Biểu đồ cột cho thấy số liệu bán hàng." },
          { text: "A wind tower stands above the courtyard.", ipa: "ə wɪnd taʊə stændz əbʌv ðə kɔːtjɑːd", vi: "Một tháp gió đứng phía trên sân trong." },
          { text: "There was a sharp rise in fuel prices.", ipa: "ðeə wəz ə ʃɑːp raɪz ɪn fjuːəl praɪsɪz", vi: "Có một mức tăng mạnh về giá nhiên liệu." },
          { text: "Thick walls keep the hot air out.", ipa: "θɪk wɔːlz kiːp ðə hɒt eə aʊt", vi: "Tường dày giữ không khí nóng ở ngoài." },
          { text: "We saw a gradual decline in visitor numbers.", ipa: "wi sɔː ə ɡrædʒuəl dɪklaɪn ɪn vɪzɪtə nʌmbəz", vi: "Chúng tôi thấy lượng khách giảm dần." },
          { text: "The cost of living affects low-income families.", ipa: "ðə kɒst əv lɪvɪŋ əfekts ləʊ ɪnkʌm fæməliz", vi: "Chi phí sinh hoạt ảnh hưởng tới các gia đình thu nhập thấp." },
          { text: "The government announced a five-year energy plan.", ipa: "ðə ɡʌvənmənt ənaʊnst ə faɪv jɪə enədʒi plæn", vi: "Chính phủ công bố một kế hoạch năng lượng 5 năm." },
        ],
      },
      {
        t: "note",
        title: "Mẹo luyện 5 phút mỗi ngày",
        items: [
          "Mở lại lời thoại Part 4, gạch dưới 10 cụm danh từ, đánh dấu từ nhấn rồi đọc to theo băng (shadowing) từng câu.",
          "Gõ tay xuống bàn ở từ nhấn. Nếu tay gõ đều từng từ thì bạn đang đọc kiểu tiếng Việt.",
          "Khi nghe đề: từ nào người nói **kéo dài và lên cao** hơn hẳn — khoanh ngay, đó thường là đáp án hoặc từ báo bẫy (ACtually, in FACT).",
        ],
      },
    ],
  },
  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d25-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 25",
    goal: "Củng cố cụm danh từ phức, chia động từ theo danh từ chính, danh hoá và giới từ sau danh từ; làm thêm một bài Summary + Sentence completion ngắn và nhận diện bẫy khi nghe.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Trước khi làm",
        items: [
          "42 câu có đáp án, chia 7 phần. Làm một mạch, không mở lại bài học; sai phần nào thì quay lại đúng mục đó.",
          "Phần I–IV: ngữ pháp bài 1. Phần V: đọc. Phần VI: bẫy khi nghe. Phần VII: câu hỏi gián tiếp (ôn).",
          "Cuối bài có một đoạn viết ngắn (AI chấm) để bạn dùng danh hoá trong bài Task 1 thật.",
        ],
      },
      { t: "h", text: "Phần I — Chọn cụm danh từ đúng (8 câu)" },
      {
        t: "mcq",
        id: "t3d25-bt-chon",
        title: "I. Chọn phương án đúng",
        items: [
          { q: "The company offers ______ to all new staff.", options: ["a two-weeks training course", "a training two-week course", "a two-week training course", "a course training two-week"], correct: 2, why: "Số-N số ít có gạch nối (two-week) + N bổ nghĩa (training) + N chính (course)." },
          { q: "______ has risen by 30% since 2015.", options: ["The price of train tickets", "The prices of train ticket", "The price of trains tickets", "Train tickets price"], correct: 0, why: "Danh từ chính price (số ít) khớp với has; tickets đứng sau of, số nhiều bình thường." },
          { q: "The effects of air pollution on children's health ______ well documented.", options: ["is", "has", "was", "are"], correct: 3, why: "Danh từ chính là effects (số nhiều) ⇒ are." },
          { q: "Many graduates struggle to find ______.", options: ["a job well-paying", "a well-paid job", "a well-pay job", "a job well-paid"], correct: 1, why: "Tính từ ghép well-paid đứng TRƯỚC danh từ." },
          { q: "The council rejected the plan ______ a car park on the playing field.", options: ["of build", "building", "to build", "for build"], correct: 2, why: "plan / decision / attempt + to V." },
          { q: "There has been ______ in the use of cash.", options: ["a steady decline", "a steadily decline", "steady a decline", "a decline steadily"], correct: 0, why: "a + tính từ (steady) + danh từ (decline)." },
          { q: "One of the main reasons for the delays ______ a shortage of drivers.", options: ["are", "is", "were", "have been"], correct: 1, why: "Chủ ngữ thật là One ⇒ is." },
          { q: "______ is a growing concern for city planners.", options: ["Housing young people", "Young people housing lack", "The lack housing for young people", "The lack of housing for young people"], correct: 3, why: "lack + of + N; cụm giới từ for young people bổ nghĩa sau." },
        ],
      },
      { t: "h", text: "Phần II — Viết dạng danh từ (6 câu)" },
      {
        t: "quiz",
        id: "t3d25-bt-ho-tu",
        kind: "fill",
        title: "II. Viết dạng DANH TỪ của từ trong ngoặc",
        items: [
          { q: "The ______ (develop) of renewable energy requires heavy investment.", answers: ["development"] },
          { q: "There was a slight ______ (reduce) in the number of accidents.", answers: ["reduction"] },
          { q: "The ______ (efficient) of the new engines surprised the engineers.", answers: ["efficiency"] },
          { q: "School ______ (attend) fell during the winter months.", answers: ["attendance"] },
          { q: "The ______ (remove) of trade barriers led to lower prices.", answers: ["removal"] },
          { q: "Rural ______ (poor) remains a serious challenge.", answers: ["poverty"] },
        ],
      },
      { t: "h", text: "Phần III — Giới từ sau danh từ (6 câu)" },
      {
        t: "quiz",
        id: "t3d25-bt-gioi-tu",
        kind: "fill",
        title: "III. Điền MỘT giới từ",
        items: [
          { q: "The ban ______ single-use plastic came into force last year.", answers: ["on"] },
          { q: "There is a clear link ______ poor diet and heart disease.", answers: ["between"] },
          { q: "Exports saw an increase ______ 8% last quarter.", answers: ["of"], hint: "sau là con số" },
          { q: "Scientists are searching for an alternative ______ fossil fuels.", answers: ["to"] },
          { q: "The need ______ skilled workers has never been greater.", answers: ["for"] },
          { q: "Heavy investment ______ railways reduced journey times.", answers: ["in"] },
        ],
      },
      { t: "h", text: "Phần IV — Viết lại bằng cụm danh từ (6 câu)" },
      {
        t: "quiz",
        id: "t3d25-bt-dich",
        kind: "translate",
        title: "IV. Viết lại câu, bắt đầu bằng từ cho sẵn",
        grammar: "V + adv → a / an + adj + N + in / of + N",
        items: [
          { q: "The population grew rapidly in the 1990s. → There was …", answers: ["There was rapid growth in the population in the 1990s.", "There was a rapid growth in the population in the 1990s.", "There was rapid population growth in the 1990s.", "There was a rapid increase in the population in the 1990s.", "There was a rapid rise in the population in the 1990s."], hint: "rapid growth in the population" },
          { q: "Coal production declined dramatically. → There was …", answers: ["There was a dramatic decline in coal production.", "There was a dramatic fall in coal production.", "There was a dramatic drop in coal production.", "There was a dramatic decrease in coal production."], hint: "a dramatic decline in" },
          { q: "The government decided to raise taxes, and this was unpopular. → The government's decision …", answers: ["The government's decision to raise taxes was unpopular.", "The government's decision to increase taxes was unpopular.", "The government's decision to raise taxes proved unpopular."], hint: "decision to raise taxes + was" },
          { q: "Because people are aware of the problem, they recycle more. → Public awareness …", answers: ["Public awareness of the problem has increased recycling.", "Public awareness of the problem has led to more recycling.", "Public awareness of the problem leads to more recycling.", "Public awareness of the problem led to more recycling.", "Public awareness of the problem has resulted in more recycling.", "Public awareness of the problem has led to an increase in recycling."], hint: "awareness of the problem + has led to more recycling" },
          { q: "Tourist numbers rose slightly in 2023. → 2023 saw …", answers: ["2023 saw a slight rise in tourist numbers.", "2023 saw a slight increase in tourist numbers.", "2023 saw a slight rise in the number of tourists.", "2023 saw a slight increase in the number of tourists."], hint: "saw a slight rise in" },
          { q: "The city expanded quickly, which put pressure on schools. → The rapid …", answers: ["The rapid expansion of the city put pressure on schools.", "The rapid growth of the city put pressure on schools."], hint: "The rapid expansion of the city + put pressure on" },
        ],
      },
      { t: "h", text: "Phần V — Đọc: Summary + Sentence completion (6 câu)" },
      {
        t: "passage",
        title: "The paper clip",
        intro: "Đọc đoạn văn rồi làm Questions 1–6. Từ lấy nguyên văn trong bài.",
        paras: [
          { text: "Few objects are as familiar as the paper clip, yet its origins are surprisingly unclear. Before it appeared, loose sheets were usually fastened with a straight pin, which left holes in the paper and occasionally in the fingers of clerks. In the 1890s several inventors experimented with bent wire, but the design we recognise today, with its double loop, was never actually patented. It is generally linked to a British firm, the Gem Manufacturing Company, although no drawing of the clip survives in the company's records. Its success owed less to clever engineering than to the arrival of cheap steel wire and of machines capable of bending it at speed. A century later the shape has hardly changed, mainly because any alteration that makes the clip grip more firmly also makes it harder to slide on." },
        ],
      },
      {
        t: "quiz",
        id: "t3d25-bt-doc",
        kind: "fill",
        title: "V. Questions 1–3: Summary (ONE WORD ONLY) · Questions 4–6: Sentences (NO MORE THAN TWO WORDS)",
        items: [
          { q: "1. Summary: Before the paper clip, people joined loose pages with a ______, …", answers: ["pin"], hint: "ONE WORD" },
          { q: "2. …which damaged the paper by making ______ in it.", answers: ["holes"] },
          { q: "3. The well-known design has a double ______.", answers: ["loop"] },
          { q: "4. No ______ of the clip can be found in the records of the Gem company.", answers: ["drawing"] },
          { q: "5. The clip succeeded mainly because of inexpensive ______ and fast machines.", answers: ["steel wire", "wire"] },
          { q: "6. Changes to the design that improve the clip's grip make it more difficult to ______.", answers: ["slide on", "slide"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích phần V",
        items: [
          "**1 pin** — “fastened with a straight pin”; joined = fastened; ONE WORD ⇒ pin. **2 holes** — “left holes in the paper”: left → making (đổi động từ).",
          "**3 loop** — “with its double loop”. **4 drawing** — “no drawing of the clip survives in the company's records”: survives → can be found.",
          "**5 steel wire** — “the arrival of cheap steel wire”: inexpensive = cheap (đã có trong câu hỏi ⇒ không chép lại “cheap”). **6 slide on** — “harder to slide on”: more difficult = harder.",
        ],
      },
      { t: "h", text: "Phần VI — Nhận diện bẫy khi nghe (5 câu)" },
      {
        t: "mcq",
        id: "t3d25-bt-bay",
        title: "VI. Đọc đoạn thoại ngắn — đáp án ĐÚNG là gì?",
        items: [
          { q: "“We were going to present on Tuesday, but the room's booked, so it's Thursday now.” — The presentation is on", options: ["Tuesday.", "Wednesday.", "Thursday.", "Friday."], correct: 2, why: "Bẫy đổi ý: “were going to… but… so it's Thursday now”." },
          { q: "“Shall we add a map? — I'd rather not; a table would be clearer.” — They will add", options: ["a table.", "a map.", "both.", "neither."], correct: 0, why: "Bẫy nhắc rồi bác: “I'd rather not” gạt map; chốt table." },
          { q: "“You might think the bridge was closed for safety reasons. In fact, it was simply too expensive to repair.” — The bridge closed because of", options: ["safety.", "cost.", "traffic.", "weather."], correct: 1, why: "Đáp án đứng sau In fact: too expensive to repair = cost (đổi tính từ thành danh từ)." },
          { q: "“The survey had 250 questions — sorry, 250 participants and 15 questions.” — How many people took part?", options: ["15", "25", "215", "250"], correct: 3, why: "Tự sửa: 250 participants; 15 là số câu hỏi." },
          { q: "“The trees were planted less for decoration than to block the wind.” — The main purpose of the trees was", options: ["decoration.", "shade.", "to stop the wind.", "to produce fruit."], correct: 2, why: "less A than B ⇒ B là ý chính: to block the wind." },
        ],
      },
      { t: "h", text: "Phần VII — Ôn câu hỏi gián tiếp (5 câu)" },
      {
        t: "quiz",
        id: "t3d25-bt-gian-tiep",
        kind: "translate",
        title: "VII. Đổi sang câu hỏi gián tiếp, bắt đầu bằng từ cho sẵn",
        grammar: "Could you tell me / Do you know / I wonder + wh- / if + S + V",
        items: [
          { q: "Where is the nearest station? → Could you tell me …", answers: ["Could you tell me where the nearest station is?", "Could you tell me where the nearest station is"], hint: "where + S + is" },
          { q: "Why did the figures fall? → Do you know …", answers: ["Do you know why the figures fell?", "Do you know why the figures fell"], hint: "why + S + V2" },
          { q: "Does the museum open on Sundays? → I wonder …", answers: ["I wonder if the museum opens on Sundays.", "I wonder whether the museum opens on Sundays.", "I wonder if the museum opens on Sundays", "I wonder whether the museum opens on Sundays"], hint: "if / whether + S + V(s)" },
          { q: "How much does the ticket cost? → Could you tell me …", answers: ["Could you tell me how much the ticket costs?", "Could you tell me how much the ticket costs"], hint: "how much + S + costs" },
          { q: "What do you mean by “sustainable”? → Could you explain …", answers: ["Could you explain what you mean by “sustainable”?", "Could you explain what you mean by sustainable?", "Could you explain what you mean by \"sustainable\"?", "Could you explain what you mean by 'sustainable'?"], hint: "what + you mean" },
        ],
      },
      { t: "h", text: "Viết thêm — một đoạn Task 1 có danh hoá (AI chấm)" },
      {
        t: "chart",
        kind: "line",
        title: "Average monthly visitors to a city museum, 2019–2024 (thousands)",
        unit: "thousand visitors",
        labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
        series: [
          { name: "Local residents", values: [42, 18, 25, 38, 45, 47] },
          { name: "Tourists", values: [60, 8, 15, 44, 66, 78] },
        ],
      },
      {
        t: "essay",
        id: "t3d25-bt-viet",
        task: "Task 1",
        prompt: "The line graph shows the average number of visitors per month (in thousands) to a city museum between 2019 and 2024, divided into local residents and tourists. Local residents: 42, 18, 25, 38, 45, 47. Tourists: 60, 8, 15, 44, 66, 78. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Dùng ít nhất 3 cụm danh hoá: There was a dramatic fall in… · … saw a steady recovery · a rise of … in ….",
          "Overview 2 ý: cả hai nhóm lao dốc năm 2020 rồi hồi phục vượt mức cũ; khách du lịch dao động mạnh hơn và kết thúc cao hơn hẳn.",
          "Trộn cấu trúc: một câu danh hoá, một câu động từ thường. Soát danh từ chính ↔ động từ trước khi nộp.",
        ],
      },
    ],
  },
];
