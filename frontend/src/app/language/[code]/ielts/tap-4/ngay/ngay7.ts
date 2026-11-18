/**
 * IELTS Tập 4 — Ngày 7 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, câu trả lời mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Câu chẻ (It-cleft · Wh-cleft · All / The reason… is) + do nhấn mạnh + đảo ngữ (trạng từ phủ định ·
 *                     Only… · Not only… · Should / Were / Had · So / Such… that)                              [G36 G37, ôn G11]
 *                     — nối Tập 3 Ngày 23 (What we need is… / It is + adj + that), Tập 3 Ngày 15 (điều kiện 2 · 3),
 *                       Tập 2 Ngày 3 · Tập 3 Ngày 9 (giới từ phụ thuộc: It is ON this that… depends)
 *   Bài 2 (reading)   Multiple choice Passage 3: một đáp án (6 kiểu câu hỏi band 7) + Choose TWO; bài đọc lập luận ~900 từ,
 *                     14 câu (27–40)                                                                           [R10 R11]
 *                     — nối Tập 2 Ngày 10, Tập 3 Ngày 11 · 13
 *   Bài 3 (speaking)  Part 3 dự đoán tương lai có hedging (thang độ chắc, khung 4 bước, band 6 vs band 7)       [S06 G39]
 *                     — nối Tập 3 Ngày 5 (mục 7) · Ngày 15 (mức chắc chắn) · 🔊 nối âm /j/ /w/                  [S14]
 *   Bài tập Ngày 7    49 câu có đáp án + 1 lượt nói
 * Mọi id bắt đầu `t4d7-`.
 */
import type { Lesson } from '../data';

export const NGAY_7: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d7-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Câu chẻ (cleft) và đảo ngữ — nhấn đúng chỗ, đúng liều",
    goal: "Viết và nói đúng câu chẻ (It is X that… · What… is… · All… is… · The reason… is that…), do / does / did nhấn mạnh, và sáu nhóm đảo ngữ (Never / Rarely / Not until / Only when / Not only… · Should / Were / Had… · So / Such… that) — không còn lỗi quên đảo trợ động từ hay đảo nhầm mệnh đề — để có “nhiều cấu trúc phức, phần lớn câu không lỗi” của GRA band 7 trong Task 2 và Part 3.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Câu chẻ** (cleft sentence) = “chẻ” một câu thường thành hai phần để ==rọi đèn vào một thông tin==: Cost stops people. → **It is cost that** stops people. / **What stops people is** cost. Tập 3 Ngày 23 đã gặp “What we need is more time” ở dạng mệnh đề danh ngữ; hôm nay học trọn cả họ.",
          "**Đảo ngữ** (inversion) = đưa trợ động từ lên **trước chủ ngữ** như trong câu hỏi, sau một cụm phủ định / giới hạn đứng đầu câu: **Rarely do** governments admit… ; hoặc thay if: **Had** the law **been** passed earlier, … (nối Tập 3 Ngày 15).",
          "Cả hai là công cụ **nhấn mạnh** — cùng một ý, nhưng người đọc biết ngay đâu là điểm chính. Band 7 GRA đòi “a variety of complex structures” và “frequent error-free sentences”: một câu chẻ + một câu đảo ngữ **đúng** trong bài là đủ; ba bốn câu là thừa.",
          "Ôn kèm **giới từ phụ thuộc** (depend on, result in, contribute to — Tập 2 Ngày 3, Tập 3 Ngày 9): khi chẻ câu, giới từ phải đi theo — It is **on** public funding **that** these schools depend.",
          "Lỗi band 6.5 hay gặp nhất: ~~Not only it reduces costs~~ (quên đảo) · ~~Only when did the war end, people returned~~ (đảo nhầm mệnh đề) · ~~What we need are more time~~ · ~~The reason is because~~.",
          "Tiêu chí được đẩy: **GRA** (Writing + Speaking) và **CC** — câu chẻ còn là cách chuyển ý tự nhiên khi nói: What worries me most is…",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao phải “nhấn”? — một ý, năm cách viết" },
      {
        t: "p",
        text: "Trong tiếng Anh, thông tin **mới và quan trọng nhất** thường nằm ở **cuối câu** (nguyên tắc end-focus). Khi nói, ta nhấn bằng giọng. Khi viết thì không có giọng — muốn người đọc thấy đúng điểm chính, ta phải đổi **cấu trúc**. Xem cùng một ý “Thiếu thời gian (chứ không phải thiếu tiền) khiến người ta bỏ tập thể dục” được viết năm cách:",
      },
      {
        t: "table",
        head: ["Cách viết", "Câu", "Nhấn vào"],
        rows: [
          ["Câu thường", "A lack of time prevents people from exercising.", "Không nhấn gì đặc biệt"],
          ["It-cleft", "**It is** a lack of time, not a lack of money, **that** prevents people from exercising.", "Một thành phần, thường để **đối chiếu / sửa lại**"],
          ["Wh-cleft", "**What** prevents people from exercising **is** a lack of time.", "Phần sau is — dồn về cuối câu"],
          ["do nhấn mạnh", "A lack of time **does** prevent people from exercising.", "Khẳng định lại: việc này **có thật**"],
          ["Đảo ngữ", "**Not only does** a lack of time prevent exercise, **but** it **also** leads to poor diets.", "Ý thứ hai — “không chỉ… mà còn”"],
        ],
        caption: "Câu thường vẫn là nền của bài viết. Bốn cách còn lại là gia vị: dùng khi thật sự cần đối chiếu, sửa một quan niệm, hoặc chốt luận điểm.",
      },
      {
        t: "quiz",
        id: "t4d7-on-dau-bai",
        kind: "fill",
        title: "Kiểm tra đầu bài — ôn Tập 3 Ngày 15 · 23 và giới từ phụ thuộc (6 câu)",
        items: [
          { q: "What we need ___ (be) more time, not more meetings.", answers: ["is"] },
          { q: "If the law ___ (pass) earlier, fewer people would have been affected.", answers: ["had been passed"] },
          { q: "It is essential ___ governments invest in primary education. (một từ)", answers: ["that"] },
          { q: "The success of the scheme depends ___ public support. (giới từ)", answers: ["on", "upon"] },
          { q: "Poor planning resulted ___ serious delays. (giới từ)", answers: ["in"] },
          { q: "If I ___ (be) the mayor, I would ban cars from the centre.", answers: ["were", "was"] },
        ],
      },
      { t: "rule", formula: "Thông tin mới → cuối câu (end-focus) · muốn nhấn chỗ khác → đổi cấu trúc: It is X that… / What… is X / do + V / đảo ngữ", vi: "Nhấn bằng cấu trúc, không nhấn bằng very, really hay dấu chấm than." },

      /* ── 2 ── */
      { t: "h", text: "2. It-cleft: It is / was + X + that… — rọi đèn vào một thành phần" },
      {
        t: "p",
        text: "Lấy một câu thường, chọn **một thành phần** muốn nhấn (chủ ngữ, tân ngữ, trạng ngữ thời gian / nơi chốn / lý do), đặt nó sau ==It is / It was==, phần còn lại đi sau ==that==. Câu chẻ này ngầm nói: “**chính** X, **chứ không phải** cái khác”. Vì thế nó rất hợp để **bác một quan niệm** trong Task 2 (nối kỹ thuật “nêu rồi bác” của Ngày 2).",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Chẻ câu bằng It — 3 bước",
        steps: [
          { label: "1. Câu gốc", sub: "The printing press changed Europe **in the fifteenth century**." },
          { label: "2. Chọn phần cần nhấn → sau It is / was", sub: "It was ==the printing press==…" },
          { label: "3. Phần còn lại → sau that", sub: "…**that** changed Europe in the fifteenth century." },
          { label: "Nhấn phần khác?", sub: "It was ==in the fifteenth century== **that** the printing press changed Europe." },
        ],
        caption: "be chia theo thì của câu gốc: việc quá khứ ⇒ It was; sự thật chung ⇒ It is.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "It is / was + S (người, vật) + that / who + V…",
            vi: "Nhấn chủ ngữ. Người: who hoặc that; vật: that. Động từ sau that chia theo danh từ được nhấn.",
            examples: [
              { en: "It is parents, rather than teachers, who have the greatest influence on a child's values.", vi: "Chính cha mẹ, chứ không phải giáo viên, mới có ảnh hưởng lớn nhất tới giá trị sống của trẻ." },
              { en: "It was the invention of the container that made global trade cheap.", vi: "Chính phát minh ra công-ten-nơ đã làm thương mại toàn cầu rẻ đi." },
            ],
          },
          {
            formula: "It is / was + O + that + S + V…",
            vi: "Nhấn tân ngữ.",
            examples: [
              { en: "It is practical skills that employers value most, not certificates.", vi: "Thứ nhà tuyển dụng coi trọng nhất chính là kỹ năng thực hành, không phải bằng cấp." },
            ],
          },
          {
            formula: "It is / was + trạng ngữ (in…, because…, by + V-ing, only when…) + that + S + V…",
            vi: "Nhấn thời gian, nơi chốn, lý do, cách thức. LUÔN dùng that — không dùng when / where.",
            examples: [
              { en: "It is in the first five years of life that the brain develops most rapidly.", vi: "Chính trong năm năm đầu đời não bộ phát triển nhanh nhất." },
              { en: "It is because public transport is unreliable that so many commuters still drive.", vi: "Chính vì giao thông công cộng không đáng tin cậy mà nhiều người đi làm vẫn lái xe." },
              { en: "It is only by investing in prevention that governments can control health costs.", vi: "Chỉ bằng cách đầu tư vào phòng bệnh thì chính phủ mới kiểm soát được chi phí y tế." },
            ],
          },
          {
            formula: "It was not until + mốc / mệnh đề + that + S + V (khẳng định)",
            vi: "“Mãi tới… thì mới…”. Phủ định nằm ở not until; mệnh đề sau that để khẳng định.",
            examples: [
              { en: "It was not until the 1990s that the internet became available to ordinary households.", vi: "Mãi tới thập niên 1990 internet mới đến được với các hộ gia đình bình thường." },
              { en: "It was not until the factory closed that residents realised how much they depended on it.", vi: "Mãi tới khi nhà máy đóng cửa người dân mới nhận ra họ phụ thuộc vào nó đến mức nào." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với It-cleft",
        items: [
          "~~It is in cities where most jobs are created.~~ → It is in cities **that** most jobs are created. Sau trạng ngữ được nhấn luôn là **that**.",
          "~~It is teachers that has the hardest job.~~ → …that **have**… Động từ chia theo danh từ được nhấn (teachers), không theo It.",
          "~~It was not until 2010 that the law did not change.~~ → …that the law **changed**. Đã có not until thì vế sau **khẳng định**.",
          "~~It is the government should act.~~ → It is the government **that** should act. Trong văn viết không bỏ that / who khi nhấn chủ ngữ.",
          "Nhầm với “It is + adj + that” (Tập 3 Ngày 23): It is **clear** that… (nêu nhận định, sau It is là **tính từ**) ≠ It is **cost** that… (câu chẻ, sau It is là **danh từ / trạng ngữ**). Cách thử: bỏ “It is… that” đi mà phần còn lại vẫn ghép được thành một câu ⇒ câu chẻ.",
        ],
      },
      { t: "rule", formula: "It is / was + [phần cần nhấn] + that / who + phần còn lại", vi: "Dùng để đối chiếu (chính X chứ không phải Y). Trạng ngữ luôn đi với that. It was not until… that + khẳng định." },
      {
        t: "quiz",
        id: "t4d7-it-cleft-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — It-cleft (5 câu)",
        grammar: "It is / was + [phần nhấn] + that / who + …",
        items: [
          { q: "Chính sự bất bình đẳng, chứ không phải sự nghèo đói, mới gây ra tội phạm.", answers: ["It is inequality, not poverty, that causes crime.", "It is inequality, rather than poverty, that causes crime.", "It is inequality rather than poverty that causes crime.", "It is inequality, not poverty, that leads to crime."], hint: "It is inequality, not poverty, that…" },
          { q: "Chính ở trường tiểu học trẻ em học cách làm việc với người khác.", answers: ["It is at primary school that children learn to work with others.", "It is in primary school that children learn to work with others.", "It is at primary school that children learn how to work with others.", "It is in primary school that children learn how to work with others."], hint: "It is at primary school that…" },
          { q: "Mãi tới năm 2015 thành phố mới bắt đầu xây tuyến tàu điện ngầm.", answers: ["It was not until 2015 that the city started to build the metro line.", "It was not until 2015 that the city began to build the metro line.", "It was not until 2015 that the city started building the metro line.", "It was not until 2015 that the city began building the metro line.", "It was not until 2015 that the city started to build a metro line.", "It was not until 2015 that the city began to build a metro line."], hint: "It was not until 2015 that… (vế sau khẳng định)" },
          { q: "Chính vì nhà quá đắt mà nhiều người trẻ vẫn sống với bố mẹ.", answers: ["It is because housing is so expensive that many young people still live with their parents.", "It is because housing is too expensive that many young people still live with their parents.", "It is because houses are so expensive that many young people still live with their parents.", "It is because housing is so expensive that many young adults still live with their parents."], hint: "It is because… that…" },
          { q: "Chính người tiêu dùng, chứ không phải các công ty, là người trả chi phí này.", answers: ["It is consumers, not companies, who pay this cost.", "It is consumers, not companies, that pay this cost.", "It is consumers, rather than companies, who pay this cost.", "It is consumers, rather than companies, that pay this cost.", "It is consumers rather than companies who pay this cost.", "It is consumers rather than companies that pay this cost."], hint: "It is consumers, not companies, who…" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Wh-cleft: What… is… · All… is… · The reason… is that…" },
      {
        t: "p",
        text: "It-cleft đưa phần nhấn lên **đầu**. **Wh-cleft** (còn gọi pseudo-cleft) làm ngược lại: dùng một mệnh đề ==What…== làm chủ ngữ để “dọn đường”, rồi đặt phần nhấn ở **cuối câu** sau ==is / was==. Người nghe được báo trước “sắp tới điểm chính đây” — vì vậy đây là cấu trúc **số một của Speaking Part 3** và là câu chủ đề rất gọn trong Task 2.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "What + S + V + is / was + N / mệnh đề that",
            vi: "Nhấn một danh từ hoặc cả một mệnh đề. be chia số ÍT.",
            examples: [
              { en: "What cities need is affordable housing, not more luxury flats.", vi: "Thứ các thành phố cần là nhà ở vừa túi tiền, không phải thêm căn hộ hạng sang." },
              { en: "What worries me most is that children rarely play outdoors any more.", vi: "Điều làm tôi lo nhất là trẻ em hầu như không còn chơi ngoài trời nữa." },
              { en: "What this figure suggests is that the policy has had little effect.", vi: "Điều con số này cho thấy là chính sách hầu như không có tác dụng." },
            ],
          },
          {
            formula: "What + S + do / does / did + is / was + (to) V",
            vi: "Nhấn HÀNH ĐỘNG. Mệnh đề What phải có do; sau is là động từ nguyên mẫu (có hoặc không to).",
            examples: [
              { en: "What the government did was (to) raise the tax on sugary drinks.", vi: "Việc chính phủ đã làm là tăng thuế đồ uống có đường." },
              { en: "What schools should do is teach students how to assess information.", vi: "Việc nhà trường nên làm là dạy học sinh cách đánh giá thông tin." },
            ],
          },
          {
            formula: "What happened / happens + is / was + (that) + S + V",
            vi: "Nhấn cả một sự việc — hay dùng khi kể, khi giải thích hệ quả.",
            examples: [
              { en: "What happened was that rents rose faster than wages.", vi: "Điều đã xảy ra là tiền thuê nhà tăng nhanh hơn lương." },
            ],
          },
          {
            formula: "All (that) + S + V + is / was + N / (to) V",
            vi: "All = “thứ duy nhất” (= the only thing). Không phải “tất cả”.",
            examples: [
              { en: "All (that) most commuters want is a train that arrives on time.", vi: "Thứ duy nhất phần lớn người đi làm muốn là một chuyến tàu đến đúng giờ." },
              { en: "All the scheme did was move the problem to another district.", vi: "Tất cả những gì kế hoạch đó làm được chỉ là đẩy vấn đề sang quận khác." },
            ],
          },
          {
            formula: "The reason (why) + S + V + is that + S + V  ·  The place where… is…  ·  The thing that… is…",
            vi: "Chẻ bằng danh từ chung: reason / place / thing / person / time.",
            examples: [
              { en: "The reason why birth rates are falling is that raising a child has become so expensive.", vi: "Lý do tỉ lệ sinh giảm là vì nuôi một đứa trẻ đã trở nên quá đắt đỏ." },
              { en: "The thing that surprised researchers was how quickly habits changed.", vi: "Điều làm các nhà nghiên cứu ngạc nhiên là thói quen thay đổi nhanh đến thế." },
            ],
          },
          {
            formula: "N / This + is / was + what / why / where / how + S + V   (cleft đảo)",
            vi: "Đưa phần nhấn lên đầu, mệnh đề Wh- ra sau — rất hay để CHỐT đoạn.",
            examples: [
              { en: "Affordable childcare is what working parents need most.", vi: "Dịch vụ trông trẻ vừa túi tiền là thứ cha mẹ đi làm cần nhất." },
              { en: "This is why prevention is cheaper than cure.", vi: "Đó là lý do phòng bệnh rẻ hơn chữa bệnh." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với Wh-cleft",
        items: [
          "~~What we need are more time.~~ → What we need **is** more time. Mệnh đề What làm chủ ngữ ⇒ động từ **số ít** (Tập 3 Ngày 23). Khi danh từ sau là số nhiều (What we need **is / are** more teachers), cả hai đều gặp; trong bài thi chọn **is** cho an toàn.",
          "~~The reason is because prices rose.~~ → The reason is **that** prices rose. Đã có reason thì không thêm because (thừa nghĩa). Hoặc bỏ reason: **This is because** prices rose.",
          "~~What the council did was built a new road.~~ → …was **build** / **to build**… Sau is / was là **nguyên mẫu**, không chia thì lần nữa.",
          "What happened was the price increased sharply — bỏ that thì chấp nhận được khi nói; khi viết thêm **that** cho rõ: What happened was **that** the price…",
          "~~All what we need is money.~~ → **All (that)** we need… hoặc **What** we need… Không ghép all + what.",
          "~~What I want to say is about pollution.~~ → What I want to **talk about** is pollution. Giới từ ở lại với động từ của nó (xem mục 5).",
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "It-cleft hay Wh-cleft?",
        cols: [
          { title: "It is X that…", items: ["Phần nhấn ở **đầu**", "Nghĩa ngầm: chính X, **không phải Y**", "Hợp: bác quan niệm, sửa lại, đối chiếu hai nguyên nhân", "It is **cost**, not distance, that keeps students away."] },
          { title: "What… is X", items: ["Phần nhấn ở **cuối**", "Nghĩa ngầm: “điểm chính là…”", "Hợp: câu chủ đề, mở câu trả lời Part 3, đề xuất giải pháp", "What keeps students away is **cost**."] },
          { title: "X is what…", items: ["Phần nhấn ở đầu, nhẹ hơn It-cleft", "Hợp: câu **chốt** đoạn, nối với ý vừa nói", "**This** is what makes the policy unfair."] },
        ],
      },
      { t: "rule", formula: "What + S + V + is + N / that-clause  ·  What + S + do + is + (to) V  ·  All (that) + S + V + is…  ·  The reason (why)… is that…", vi: "Mệnh đề What / All / The reason làm chủ ngữ ⇒ is / was số ít; sau The reason is dùng that, không dùng because." },
      {
        t: "quiz",
        id: "t4d7-wh-cleft-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — Wh-cleft (5 câu)",
        grammar: "What + S + V + is… · What + S + do + is + (to) V · The reason why… is that…",
        items: [
          { q: "Thứ người trẻ cần là kinh nghiệm, không phải thêm một tấm bằng nữa.", answers: ["What young people need is experience, not another degree.", "What young people need is experience, not one more degree.", "What young people need is experience rather than another degree.", "What young people need is experience, rather than another degree."], hint: "What young people need is…" },
          { q: "Việc công ty đã làm là cắt giảm lương thay vì cắt giảm việc làm.", answers: ["What the company did was cut wages instead of cutting jobs.", "What the company did was to cut wages instead of cutting jobs.", "What the company did was cut salaries instead of cutting jobs.", "What the company did was cut wages rather than cut jobs.", "What the company did was cut wages rather than jobs.", "What the company did was to cut wages rather than jobs.", "What the company did was cut wages instead of jobs."], hint: "What the company did was (to) cut…" },
          { q: "Lý do nhiều người rời nông thôn là vì ở đó có ít việc làm.", answers: ["The reason why many people leave the countryside is that there are few jobs there.", "The reason many people leave the countryside is that there are few jobs there.", "The reason why many people leave rural areas is that there are few jobs there.", "The reason many people leave rural areas is that there are few jobs there.", "The reason why many people leave the countryside is that few jobs are available there."], hint: "The reason why… is that… (không because)" },
          { q: "Điều làm tôi ngạc nhiên là rất ít người phàn nàn.", answers: ["What surprised me was that very few people complained.", "What surprised me was that so few people complained.", "What surprised me is that very few people complained.", "What surprised me was how few people complained.", "The thing that surprised me was that very few people complained."], hint: "What surprised me was that…" },
          { q: "Thứ duy nhất chính sách này làm được là làm giá tăng.", answers: ["All this policy did was raise prices.", "All that this policy did was raise prices.", "All this policy did was to raise prices.", "All this policy did was increase prices.", "All this policy did was push up prices.", "All this policy has done is raise prices.", "All this policy has done is increase prices."], hint: "All (that) this policy did was + V" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. do / does / did nhấn mạnh — “quả thật là có”" },
      {
        t: "p",
        text: "Trong câu **khẳng định**, thêm ==do / does / did== trước động từ nguyên mẫu để nhấn rằng điều đó **có thật** — thường là sau khi vừa nhượng bộ hoặc khi phản bác người cho là không. Khi nói, **do** được đọc mạnh. Chỉ dùng với hiện tại đơn và quá khứ đơn; các thì khác đã có trợ động từ (is, has, will) — ta chỉ cần nhấn giọng vào trợ động từ đó.",
      },
      {
        t: "examples",
        items: [
          { en: "Critics claim that advertising has no effect on children. However, research suggests that it does influence what they ask their parents to buy.", vi: "Người phê phán cho rằng quảng cáo không ảnh hưởng tới trẻ em. Tuy nhiên, nghiên cứu cho thấy nó quả thật có ảnh hưởng tới những thứ trẻ đòi bố mẹ mua." },
          { en: "Although remote work saves time, it does have a cost: new employees learn more slowly.", vi: "Dù làm từ xa tiết kiệm thời gian, nó quả là có cái giá: nhân viên mới học chậm hơn." },
          { en: "The scheme did reduce traffic in the centre, but only for the first two years.", vi: "Kế hoạch đó đúng là có giảm xe cộ ở trung tâm, nhưng chỉ trong hai năm đầu." },
          { en: "I do think universities should be free — I just don't think it's realistic at the moment.", vi: "Tôi thật sự nghĩ đại học nên miễn phí — chỉ là tôi không cho rằng điều đó khả thi lúc này." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với do nhấn mạnh",
        items: [
          "Sau do / does / did là **nguyên mẫu**: ~~it does has a cost~~ → it does **have** · ~~the scheme did reduced~~ → did **reduce**.",
          "Không dùng với be và modal: ~~it does is expensive~~, ~~it does can help~~.",
          "Không rải khắp bài. Chỗ hợp nhất: **câu sau nhượng bộ** (Although…, it does…) hoặc câu **bác** một ý kiến vừa nêu.",
          "Khi nói: I **do** think / I **did** enjoy it — nghe tự nhiên, không cần really.",
        ],
      },
      { t: "rule", formula: "S + do / does / did + V (nguyên mẫu) — chỉ trong câu khẳng định, hiện tại đơn / quá khứ đơn", vi: "Nhấn rằng điều đó có thật, thường sau nhượng bộ hoặc để phản bác." },
      {
        t: "quiz",
        id: "t4d7-do-nhan",
        kind: "fill",
        title: "Viết lại phần trong ngoặc với do / does / did nhấn mạnh (5 câu)",
        items: [
          { q: "Although the tax is unpopular, it (raises) ___ money for public transport.", answers: ["does raise"] },
          { q: "Some people doubt it, but exercise (improves) ___ concentration.", answers: ["does improve"] },
          { q: "The first campaign failed. The second one, however, (changed) ___ public attitudes.", answers: ["did change"] },
          { q: "Online courses are convenient, but they (require) ___ a great deal of self-discipline.", answers: ["do require"] },
          { q: "The company denied it for years, but it (knew) ___ about the risks.", answers: ["did know"] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Ôn giới từ phụ thuộc — khi chẻ câu, giới từ đi theo" },
      {
        t: "p",
        text: "Tập 2 Ngày 3 và Tập 3 Ngày 9 đã học **giới từ phụ thuộc** (dependent preposition): mỗi động từ / tính từ / danh từ “đòi” một giới từ riêng — depend **on**, result **in**, contribute **to**. Ở band 7, lỗi giới từ không còn nằm ở câu đơn mà ở **câu chẻ, câu quan hệ, câu bị động**, nơi giới từ bị tách xa khỏi từ của nó. Hai cách đặt đều đúng: đưa giới từ **lên trước** phần nhấn (trang trọng — hợp Writing) hoặc **để lại cuối** (tự nhiên — hợp Speaking).",
      },
      {
        t: "table",
        head: ["Câu gốc", "Trang trọng (Writing)", "Tự nhiên (Speaking)"],
        rows: [
          ["These schools depend **on** public funding.", "It is **on** public funding **that** these schools depend.", "What these schools depend **on** is public funding."],
          ["The report focuses **on** young drivers.", "It is **on** young drivers **that** the report focuses.", "What the report focuses **on** is young drivers."],
          ["Parents are responsible **for** this.", "It is parents **who** are responsible **for** this.", "This is what parents are responsible **for**."],
          ["Obesity results **from** a poor diet.", "It is **from** a poor diet **that** obesity results.", "What obesity results **from** is a poor diet."],
        ],
        caption: "Lỗi hay gặp: bỏ rơi giới từ — ~~What these schools depend is public funding~~ / ~~It is public funding that these schools depend~~.",
      },
      {
        t: "table",
        head: ["Động từ + giới từ", "Tính từ + giới từ", "Danh từ + giới từ"],
        rows: [
          ["contribute **to** · lead **to** · object **to** · adapt **to**", "responsible **for** · suitable **for** · grateful **for**", "an increase / a rise / a decline **in**"],
          ["result **in** (dẫn tới) · result **from** (do… mà ra) · invest **in** · succeed **in**", "aware **of** · capable **of** · typical **of** · short **of**", "a reason **for** · a demand **for** · a need **for**"],
          ["depend **on** · rely **on** · focus **on** · insist **on** · spend (money) **on**", "dependent **on** · keen **on** · based **on**", "an impact / an effect / an influence **on**"],
          ["benefit **from** · suffer **from** · prevent sb **from** · differ **from**", "different **from** · free **from** · absent **from**", "a solution **to** · an alternative **to** · access **to** · damage **to**"],
          ["cope **with** · deal **with** · provide sb **with** · comply **with**", "satisfied **with** · familiar **with** · associated **with**", "a relationship **with / between** · a connection **between**"],
          ["account **for** · apply **for** · compensate **for** · blame sb **for**", "similar **to** · related **to** · exposed **to** · committed **to** + V-ing", "an attitude **to / towards** · a threat **to**"],
        ],
        caption: "36 cụm hay gặp nhất trong Task 1 – Task 2. Chú ý: **to** trong contribute to / object to / committed to / an alternative to là GIỚI TỪ ⇒ theo sau là V-ing: contribute to **reducing** waste.",
      },
      {
        t: "note",
        title: "⚠️ Sáu lỗi giới từ còn sót ở band 6.5",
        items: [
          "~~discuss about / mention about / emphasise on / lack of (động từ) / contact with (động từ)~~ → **discuss** the issue · **mention** the cost · **emphasise** the need · the area **lacks** jobs · **contact** the office. (Danh từ thì có giới từ: a discussion **about**, an emphasis **on**, a lack **of**, contact **with**.)",
          "~~This leads to increase prices.~~ → leads to **an increase in** prices / leads to prices **increasing**. Sau giới từ to là danh từ hoặc V-ing.",
          "~~the reason of the decline~~ → the reason **for** the decline · ~~the solution for this problem~~ → the solution **to** this problem.",
          "~~an increase of crime~~ → an increase **in** crime (tăng **cái gì**: in) · an increase **of** 5% (tăng **bao nhiêu**: of).",
          "~~result to / result of (động từ)~~ → result **in** (hậu quả) / result **from** (nguyên nhân); danh từ: as a result **of**.",
          "~~different with / similar with~~ → different **from** · similar **to**.",
        ],
      },
      { t: "rule", formula: "It is + giới từ + N + that + S + V   /   What + S + V + giới từ + is + N", vi: "Chẻ câu thì giới từ phụ thuộc phải còn: hoặc lên trước phần nhấn (trang trọng), hoặc ở lại sau động từ (tự nhiên)." },
      {
        t: "quiz",
        id: "t4d7-gioi-tu",
        kind: "fill",
        title: "Điền giới từ còn thiếu (10 câu)",
        items: [
          { q: "It is ___ consumer spending that the whole economy depends.", answers: ["on", "upon"] },
          { q: "What the government should invest ___ is preventive healthcare.", answers: ["in"] },
          { q: "It is ___ long working hours that many family problems result.", answers: ["from"] },
          { q: "The new road has contributed ___ reducing journey times.", answers: ["to"] },
          { q: "What many graduates are not prepared ___ is the pressure of full-time work.", answers: ["for"] },
          { q: "There has been a sharp increase ___ the number of people living alone.", answers: ["in"] },
          { q: "It is young children who suffer most ___ air pollution.", answers: ["from"] },
          { q: "This is the problem that the committee failed to deal ___.", answers: ["with"] },
          { q: "Tourism accounts ___ almost a third of the island's income.", answers: ["for"] },
          { q: "What critics object ___ is the cost of the scheme, not its aims.", answers: ["to"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Đảo ngữ sau trạng từ phủ định / giới hạn đứng đầu câu" },
      {
        t: "p",
        text: "Khi một cụm mang nghĩa **phủ định** hoặc **giới hạn** (never, rarely, seldom, hardly, little, not until, only when, under no circumstances…) được đưa lên **đầu câu** để nhấn, phần sau phải theo **trật tự câu hỏi**: ==trợ động từ + S + V==. Không có trợ động từ thì mượn **do / does / did**. Đây là cấu trúc **trang trọng** — hợp Task 2, thuyết trình, bài diễn văn; trong hội thoại thường ngày nghe hơi “sách vở”.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đảo ngữ — 3 bước",
        steps: [
          { label: "1. Câu gốc", sub: "Governments **rarely** admit their mistakes." },
          { label: "2. Đưa cụm phủ định lên đầu", sub: "==Rarely== …" },
          { label: "3. Trật tự câu hỏi: trợ động từ + S + V", sub: "Rarely **do governments admit** their mistakes." },
          { label: "Có sẵn trợ động từ?", sub: "The problem **has never been** so serious. → Never **has the problem been** so serious." },
        ],
        caption: "Mẹo kiểm: bỏ cụm đầu câu, phần còn lại phải đọc lên giống một câu hỏi Yes/No (Do governments admit…? Has the problem been…?).",
      },
      {
        t: "table",
        head: ["Nhóm", "Cụm đứng đầu", "Ví dụ"],
        rows: [
          ["**Tần suất phủ định**", "Never (before) · Rarely · Seldom · Hardly ever", "**Never before have** so many people lived in cities. · **Seldom does** a single policy solve such a problem."],
          ["**Mức độ**", "Little", "**Little did** planners **realise** how quickly the city would grow."],
          ["**Vừa mới… thì…**", "Hardly / Scarcely… when · No sooner… than", "**No sooner had** the road **opened than** it was full of traffic. · **Hardly had** the scheme **begun when** funding was cut."],
          ["**Cấm / tuyệt đối không**", "Under no circumstances · On no account · At no time · In no way · Nowhere", "**Under no circumstances should** patient data **be sold**. · **At no time did** the company **inform** residents of the risk."],
          ["**Not + cụm**", "Not until + mốc / mệnh đề · Not once · Not a single + N", "**Not until** the 1960s **did** scientists **understand** the cause. · **Not once did** the minister **mention** the cost."],
          ["**Only + cụm**", "Only then · Only later · Only recently · Only in this way · Only by + V-ing · Only when / after / if + mệnh đề", "**Only by** reducing demand **can** cities **solve** congestion. · **Only when** the trial ended **did** the results **become** clear."],
          ["**Không chỉ… mà còn**", "Not only… but (S) also…", "**Not only does** cycling **reduce** pollution, **but** it **also improves** public health."],
        ],
        caption: "Bảy nhóm. Cột đầu chỉ là cách nhớ — quy tắc là một: cụm phủ định / giới hạn đứng đầu ⇒ đảo.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Not only + trợ động từ + S + V…, but + S + also + V…",
            vi: "Chỉ đảo ở vế Not only; vế but giữ trật tự thường. Có thể tách thành hai câu: Not only… . It also…",
            examples: [
              { en: "Not only do part-time jobs provide income, but they also teach students to manage their time.", vi: "Việc làm thêm không chỉ đem lại thu nhập mà còn dạy sinh viên quản lý thời gian." },
              { en: "Not only is the scheme expensive, but it has also failed to reduce crime.", vi: "Kế hoạch này không chỉ tốn kém mà còn không giảm được tội phạm." },
            ],
          },
          {
            formula: "Only when / after / if + S + V (thường), + trợ động từ + S + V (ĐẢO)",
            vi: "Mệnh đề ngay sau Only when KHÔNG đảo; đảo ở mệnh đề chính đi sau.",
            examples: [
              { en: "Only when wages rise will young people be able to afford their own homes.", vi: "Chỉ khi lương tăng thì người trẻ mới mua nổi nhà riêng." },
              { en: "Only after the data had been checked did the team publish its findings.", vi: "Chỉ sau khi dữ liệu được kiểm tra, nhóm mới công bố kết quả." },
            ],
          },
          {
            formula: "Not until + mốc / S + V (thường), + trợ động từ + S + V (ĐẢO)",
            vi: "Giống Only when. So với mục 2: It was not until… that + trật tự thường.",
            examples: [
              { en: "Not until the late twentieth century did women enter the profession in large numbers.", vi: "Mãi tới cuối thế kỷ 20 phụ nữ mới bước vào nghề này với số lượng lớn." },
              { en: "Not until people lose their health do they appreciate it.", vi: "Chỉ tới khi mất sức khoẻ người ta mới biết quý nó." },
            ],
          },
          {
            formula: "No sooner + had + S + V3 + than + S + V2   ·   Hardly / Scarcely + had + S + V3 + when + S + V2",
            vi: "“Vừa mới… thì đã…”. No sooner đi với THAN; Hardly / Scarcely đi với WHEN.",
            examples: [
              { en: "No sooner had the new tax been introduced than sales began to fall.", vi: "Thuế mới vừa được áp dụng thì doanh số đã bắt đầu giảm." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với đảo ngữ",
        items: [
          "**Quên đảo:** ~~Not only it reduces costs, but…~~ → Not only **does it reduce** costs… · ~~Rarely people read the terms.~~ → Rarely **do people read** the terms.",
          "**Đảo nhầm mệnh đề:** ~~Only when did the war end, people returned.~~ → Only when the war **ended did people return**. Đảo ở mệnh đề **chính**.",
          "**Chia động từ hai lần:** ~~Never did the city experienced…~~ → Never did the city **experience**… · ~~Not only does it reduces~~ → does it **reduce**.",
          "**Đảo cả vế sau:** ~~Not only does it save time, but also does it save money.~~ → …, but it **also saves** money.",
          "**Phủ định hai lần:** ~~Never have we not seen…~~, ~~Under no circumstances should not…~~ — cụm đầu câu đã phủ định rồi, động từ để **khẳng định**.",
          "**Đảo khi cụm không đứng đầu:** ~~People rarely do read the terms.~~ Chỉ đảo khi cụm phủ định **mở đầu câu**.",
          "**Only + chủ ngữ thì KHÔNG đảo:** Only **the government** can solve this. (Only bổ nghĩa cho chủ ngữ, không phải trạng ngữ.)",
          "**No sooner… when** ✗ → No sooner… **than**. **Hardly… than** ✗ → Hardly… **when**.",
        ],
      },
      { t: "rule", formula: "Cụm phủ định / Only + trạng ngữ (đầu câu) + trợ động từ (do / does / did / have / can / will…) + S + V", vi: "Trật tự như câu hỏi. Only when / Not until + mệnh đề: đảo ở mệnh đề chính. Not only… but… also: chỉ đảo vế đầu." },
      {
        t: "quiz",
        id: "t4d7-dao-ngu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — bắt đầu bằng cụm cho sẵn (5 câu)",
        grammar: "Cụm phủ định / Only… + trợ động từ + S + V",
        items: [
          { q: "(Rarely) Hiếm khi một giải pháp duy nhất giải quyết được một vấn đề phức tạp.", answers: ["Rarely does a single solution solve a complex problem.", "Rarely does one solution solve a complex problem.", "Rarely can a single solution solve a complex problem.", "Rarely does a single solution solve a complicated problem."], hint: "Rarely does a single solution solve…" },
          { q: "(Not only) Du lịch không chỉ tạo ra việc làm mà còn bảo vệ văn hoá địa phương.", answers: ["Not only does tourism create jobs, but it also protects local culture.", "Not only does tourism create jobs but it also protects local culture.", "Not only does tourism create jobs, but it also protects the local culture.", "Not only does tourism create jobs, it also protects local culture.", "Not only does tourism create jobs, but it also preserves local culture."], hint: "Not only does tourism create…, but it also…" },
          { q: "(Only by) Chỉ bằng cách giảm lượng xe hơi thì các thành phố mới cải thiện được chất lượng không khí.", answers: ["Only by reducing the number of cars can cities improve air quality.", "Only by reducing the number of cars will cities improve air quality.", "Only by reducing the number of cars can cities improve their air quality.", "Only by reducing the number of cars can cities improve the quality of the air.", "Only by reducing the number of cars can cities improve the air quality."], hint: "Only by reducing… can cities improve…" },
          { q: "(Never before) Chưa bao giờ thông tin lại dễ tìm đến thế.", answers: ["Never before has information been so easy to find.", "Never before has information been this easy to find.", "Never before has information been so easily available.", "Never before has information been so accessible.", "Never before has it been so easy to find information."], hint: "Never before has information been so…" },
          { q: "(Only when) Chỉ khi người dân tin tưởng chính quyền thì chính sách này mới có hiệu quả.", answers: ["Only when people trust the government will this policy be effective.", "Only when people trust the government will this policy work.", "Only when citizens trust the government will this policy be effective.", "Only when people trust the government can this policy be effective.", "Only when people trust the authorities will this policy be effective.", "Only when citizens trust the government will this policy work.", "Only when people trust the government can this policy work."], hint: "Only when people trust… will this policy…" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Đảo ngữ thay if: Should… · Were… · Had…" },
      {
        t: "p",
        text: "Tập 3 Ngày 15 đã học câu điều kiện loại 2 và 3. Trong văn trang trọng, có thể **bỏ if** và đưa ==should / were / had== lên trước chủ ngữ. Nghĩa không đổi — chỉ **trang trọng hơn** và gọn hơn. Ba từ này là ba từ **duy nhất** được đảo kiểu này.",
      },
      {
        t: "table",
        head: ["Loại", "Câu có if", "Câu đảo (bỏ if)"],
        rows: [
          ["**Loại 1** — có thể xảy ra", "If demand **should** fall, prices will drop. / If demand **falls**, …", "**Should** demand **fall**, prices will drop."],
          ["**Loại 2** — với be", "If public transport **were** free, more people would use it.", "**Were** public transport free, more people would use it."],
          ["**Loại 2** — động từ thường", "If the government **banned** / **were to ban** private cars, …", "**Were** the government **to ban** private cars, there would be protests."],
          ["**Loại 3** — quá khứ không thật", "If the warning **had been taken** seriously, the damage would have been smaller.", "**Had** the warning **been taken** seriously, the damage would have been smaller."],
          ["**Phủ định**", "If it **had not been** for public funding, the theatre would have closed.", "**Had it not been** for public funding, the theatre would have closed."],
        ],
        caption: "Should + S + V nguyên mẫu (mọi ngôi, không thêm s) · Were + S + (to V) · Had + S + V3.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Should + S + V, S + will / can / should + V",
            vi: "= If… (loại 1), sắc thái “nếu chẳng may / nếu có lúc nào”. Hay gặp trong email công việc và thông báo.",
            examples: [
              { en: "Should the trial prove successful, the scheme will be extended to other cities.", vi: "Nếu đợt thử nghiệm thành công, kế hoạch sẽ được mở rộng ra các thành phố khác." },
              { en: "Should you require any further information, please do not hesitate to contact me.", vi: "Nếu anh / chị cần thêm thông tin, xin đừng ngại liên hệ với tôi." },
            ],
          },
          {
            formula: "Were + S + adj / N / to V, S + would + V",
            vi: "= If… (loại 2). Với động từ thường phải có to: Were… TO ban.",
            examples: [
              { en: "Were tuition fees to be abolished, universities would need another source of income.", vi: "Giả sử học phí bị bãi bỏ, các trường đại học sẽ cần một nguồn thu khác." },
              { en: "Were I in charge of the budget, I would spend far more on prevention.", vi: "Nếu tôi phụ trách ngân sách, tôi sẽ chi nhiều hơn hẳn cho phòng bệnh." },
            ],
          },
          {
            formula: "Had + S + (not) + V3, S + would / could / might + have + V3",
            vi: "= If… had V3 (loại 3). Phủ định KHÔNG viết tắt: Had it not…, không Hadn't it…",
            examples: [
              { en: "Had the bridge been built ten years earlier, it would have cost half as much.", vi: "Nếu cây cầu được xây sớm hơn mười năm, chi phí hẳn chỉ bằng một nửa." },
              { en: "Had it not been for vaccination, millions more children would have died.", vi: "Nếu không nhờ tiêm chủng, hẳn đã có thêm hàng triệu trẻ em tử vong." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với Should / Were / Had",
        items: [
          "~~If had the law been passed…~~ / ~~Had if the law…~~ → đã đảo thì **bỏ if**.",
          "~~Hadn't the government acted, …~~ → **Had the government not acted**, … Dạng đảo không viết tắt not.",
          "~~Were the government ban cars, …~~ → Were the government **to ban** cars… · ~~Did the government ban cars, …~~ ✗ (did không đảo kiểu này).",
          "~~Should the price falls~~ → Should the price **fall** (nguyên mẫu).",
          "~~Had I known, I would tell you.~~ → …I **would have told** you. Vế chính vẫn theo đúng loại điều kiện.",
          "Register: ba dạng này **trang trọng**. Trong Speaking chỉ nên dùng Had I known… / Were I… vài lần; nói If là tự nhiên hơn.",
        ],
      },
      { t: "rule", formula: "Should + S + V…  ·  Were + S + (to V)…  ·  Had + S + (not) + V3…  = If… (bỏ if)", vi: "Chỉ should / were / had đảo được; phủ định không viết tắt; vế chính giữ nguyên như câu điều kiện thường." },
      {
        t: "quiz",
        id: "t4d7-dao-if-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — không dùng if (4 câu)",
        grammar: "Should / Were / Had + S + …",
        items: [
          { q: "(Had) Nếu chính phủ hành động sớm hơn, cuộc khủng hoảng lẽ ra đã tránh được.", answers: ["Had the government acted earlier, the crisis could have been avoided.", "Had the government acted earlier, the crisis would have been avoided.", "Had the government acted sooner, the crisis could have been avoided.", "Had the government acted sooner, the crisis would have been avoided.", "Had the government acted earlier, the crisis might have been avoided."], hint: "Had the government acted…, … could have been avoided" },
          { q: "(Were) Nếu giao thông công cộng miễn phí, sẽ có ít xe hơi trên đường hơn.", answers: ["Were public transport free, there would be fewer cars on the roads.", "Were public transport free, there would be fewer cars on the road.", "Were public transport to be free, there would be fewer cars on the roads.", "Were public transport free, fewer cars would be on the roads."], hint: "Were public transport free, there would be fewer…" },
          { q: "(Should) Nếu số ca bệnh tăng trở lại, các trường học sẽ bị đóng cửa.", answers: ["Should the number of cases rise again, schools will be closed.", "Should the number of cases increase again, schools will be closed.", "Should cases rise again, schools will be closed.", "Should the number of cases rise again, schools will close.", "Should the number of cases rise again, the schools will be closed."], hint: "Should the number of cases rise again, …" },
          { q: "(Had it not been for) Nếu không nhờ internet, nhiều doanh nghiệp nhỏ hẳn đã không sống sót.", answers: ["Had it not been for the internet, many small businesses would not have survived.", "Had it not been for the Internet, many small businesses would not have survived.", "Had it not been for the internet, many small businesses would have failed.", "Had it not been for the internet, a lot of small businesses would not have survived.", "Had it not been for the internet, many small businesses could not have survived."], hint: "Had it not been for + N, … would not have survived" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. So / Such… that đứng đầu câu · Nor / Neither / So + trợ động từ + S" },
      {
        t: "patterns",
        rows: [
          {
            formula: "So + adj / adv + trợ động từ / be + S + that + S + V",
            vi: "= S + be + so + adj + that… nhưng nhấn vào MỨC ĐỘ.",
            examples: [
              { en: "So rapid was the growth of the city that housing could not keep up.", vi: "Thành phố phát triển nhanh đến mức nhà ở không theo kịp." },
              { en: "So severely had the forest been damaged that it took decades to recover.", vi: "Khu rừng bị tàn phá nặng đến mức phải mất nhiều thập kỷ mới phục hồi." },
            ],
          },
          {
            formula: "Such + be + N + that + S + V",
            vi: "Such = so great. Rất trang trọng; hợp câu mở thân bài.",
            examples: [
              { en: "Such is the demand for places that some schools hold a lottery.", vi: "Nhu cầu chỗ học lớn đến mức một số trường phải bốc thăm." },
              { en: "Such was the public anger that the plan was dropped within a week.", vi: "Công chúng phẫn nộ đến mức kế hoạch bị huỷ chỉ trong một tuần." },
            ],
          },
          {
            formula: "S + V (phủ định) …, nor / neither + trợ động từ + S   ·   S + V (khẳng định) …, and so + trợ động từ + S",
            vi: "“…cũng không” / “…cũng vậy”. Nor đứng đầu mệnh đề thứ hai ⇒ đảo.",
            examples: [
              { en: "The scheme did not reduce costs, nor did it improve the quality of care.", vi: "Kế hoạch đó không giảm được chi phí, cũng không cải thiện chất lượng chăm sóc." },
              { en: "Rents have risen sharply, and so has the cost of food.", vi: "Tiền thuê nhà tăng mạnh, và giá thực phẩm cũng vậy." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với So / Such / Nor",
        items: [
          "~~So rapid the growth was that…~~ → So rapid **was the growth** that…",
          "~~…, nor it improved the quality.~~ → …, nor **did it improve** the quality. Sau nor đã phủ định, động từ **khẳng định**: ~~nor did it not improve~~.",
          "~~…, and so the cost of food has.~~ → …, and so **has** the cost of food. (So + trợ động từ + S = “cũng vậy”; so + S + trợ động từ = “đúng thế”.)",
          "Such… that đầu câu dùng **be**, không dùng động từ thường: ~~Such grew the demand that…~~",
        ],
      },
      { t: "rule", formula: "So + adj + be + S + that…  ·  Such + be + N + that…  ·  …, nor + trợ động từ + S + V", vi: "Đưa so / such lên đầu để nhấn mức độ; nor mở mệnh đề thứ hai thì đảo, động từ để khẳng định." },
      {
        t: "quiz",
        id: "t4d7-so-such",
        kind: "fill",
        title: "Viết lại — bắt đầu bằng từ cho sẵn; điền phần còn thiếu (5 câu)",
        items: [
          { q: "The damage was so great that the bridge had to be closed. → So great ___ that the bridge had to be closed.", answers: ["was the damage"] },
          { q: "The demand for tickets was so high that the website crashed. → Such ___ for tickets that the website crashed.", answers: ["was the demand"] },
          { q: "The policy did not create jobs, and it did not attract investment either. → The policy did not create jobs, nor ___ investment.", answers: ["did it attract"] },
          { q: "Wages have fallen, and living standards have fallen too. → Wages have fallen, and so ___.", answers: ["have living standards"] },
          { q: "The change was so gradual that few people noticed it. → So gradual ___ that few people noticed it.", answers: ["was the change"] },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Dùng ở đâu trong bài thi — và dùng bao nhiêu" },
      {
        t: "table",
        head: ["Chỗ dùng", "Cấu trúc hợp nhất", "Câu khung"],
        rows: [
          ["**Task 2 — mở bài / luận điểm**", "It-cleft, Wh-cleft", "While technology plays a part, **it is** the way it is used **that** determines whether it helps or harms."],
          ["**Task 2 — câu chủ đề thân bài**", "Wh-cleft, The reason… is that", "**What** makes this policy attractive **is** its low cost."],
          ["**Task 2 — bác ý đối lập**", "do nhấn mạnh, It-cleft", "Admittedly, such taxes are unpopular; they **do**, however, change behaviour."],
          ["**Task 2 — thêm ý thứ hai**", "Not only… but also", "**Not only does** this approach save money, **but** it **also** reduces waiting times."],
          ["**Task 2 — điều kiện / giải pháp**", "Only by / Only when / Were… to", "**Only by** addressing the causes **can** governments hope to reduce crime."],
          ["**Task 2 — kết bài**", "cleft đảo", "**This is why** I believe prevention deserves greater funding."],
          ["**Speaking Part 3**", "Wh-cleft, do nhấn mạnh, The thing is…", "**What I find** worrying **is** that… · I **do** think… · **The thing is**, …"],
          ["**Task 1**", "Hầu như không dùng", "Task 1 tả số liệu khách quan; đảo ngữ và cleft nghe như đang bình luận. Tối đa: **It was** in 2015 **that** the figure peaked."],
        ],
        caption: "Liều lượng band 7: mỗi bài Task 2 một câu chẻ + một câu đảo ngữ là đủ. Giám khảo trừ điểm khi cấu trúc “cao cấp” sai, không cộng điểm theo số lượng.",
      },
      {
        t: "note",
        title: "💡 Mẹo dùng đúng liều",
        items: [
          "Viết xong bài bằng câu thường. Lượt soát cuối mới chọn **một** câu chủ đề để chẻ và **một** câu để đảo — chọn câu mang luận điểm quan trọng nhất.",
          "Trước khi đảo, tự hỏi ba câu: (1) cụm đầu câu có phủ định / only không? (2) trợ động từ đã đứng trước chủ ngữ chưa? (3) động từ chính đã về nguyên mẫu / V3 chưa?",
          "Khi nói, ưu tiên **Wh-cleft** (What I mean is… / What tends to happen is…) — nó cho bạn nửa giây nghĩ và làm câu trả lời mạch lạc. Đảo ngữ kiểu Rarely do… để dành cho bài viết.",
          "Không chắc thì **đừng dùng**: một câu thường đúng luôn hơn một câu đảo ngữ sai.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Kiểm tra cuối bài (18 câu)" },
      {
        t: "mcq",
        id: "t4d7-np-chon",
        title: "Chọn câu đúng / phương án đúng (10 câu)",
        items: [
          { q: "___ that most accidents happen.", options: ["It is at night", "It is at night when", "At night it is", "It is the night"], correct: 0, why: "It is + trạng ngữ + that. Không dùng when sau trạng ngữ được nhấn." },
          { q: "What the report recommends ___ a complete ban on advertising to children.", options: ["are", "is", "being", "to be"], correct: 1, why: "Mệnh đề What làm chủ ngữ ⇒ động từ số ít: is." },
          { q: "Not only ___ the cost of living, but it also widens inequality.", options: ["inflation raises", "raises inflation", "does inflation raise", "does inflation raises"], correct: 2, why: "Not only đầu câu ⇒ does + S + V nguyên mẫu." },
          { q: "Only after the results had been published ___ how serious the problem was.", options: ["the public understood", "the public did understand", "understood the public", "did the public understand"], correct: 3, why: "Only after + mệnh đề (thường), đảo ở mệnh đề chính: did the public understand." },
          { q: "___ the committee known about the risks, it would have rejected the plan.", options: ["Had", "If", "Should", "Were"], correct: 0, why: "Vế chính would have rejected ⇒ điều kiện loại 3 ⇒ Had + S + V3." },
          { q: "The reason so few people cycle to work is ___ the roads are dangerous.", options: ["because", "that", "why", "due to"], correct: 1, why: "The reason… is that… (không because)." },
          { q: "Chọn câu ĐÚNG.", options: ["Rarely the two groups agree.", "Rarely the two groups do agree.", "Rarely do the two groups agree.", "Rarely do the two groups agreed."], correct: 2, why: "Rarely + do + S + V nguyên mẫu." },
          { q: "___ the price of oil to double, many airlines would go out of business.", options: ["Had", "Should", "Did", "Were"], correct: 3, why: "Were + S + to V = If the price doubled (loại 2). Did không đảo kiểu này." },
          { q: "No sooner had the shopping centre opened ___ nearby shops began to close.", options: ["than", "when", "then", "that"], correct: 0, why: "No sooner… than. (Hardly / Scarcely… when.)" },
          { q: "Although the drug is expensive, it ___ lives.", options: ["do save", "does save", "does saves", "did saved"], correct: 1, why: "do nhấn mạnh: does + V nguyên mẫu (chủ ngữ số ít, hiện tại)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d7-np-viet-lai",
        kind: "fill",
        title: "Viết lại câu — gõ CẢ câu, bắt đầu bằng từ cho sẵn (8 câu)",
        items: [
          { q: "Poor diet causes most of these diseases. → It is ___", answers: ["It is poor diet that causes most of these diseases.", "It is a poor diet that causes most of these diseases."] },
          { q: "Small businesses need lower taxes. → What ___", answers: ["What small businesses need is lower taxes.", "What small businesses need are lower taxes."] },
          { q: "The council closed the library. → What the council did ___", answers: ["What the council did was close the library.", "What the council did was to close the library."] },
          { q: "People seldom change their habits overnight. → Seldom ___", answers: ["Seldom do people change their habits overnight."] },
          { q: "We will solve the problem only if we work together. → Only if we work together ___", answers: ["Only if we work together will we solve the problem.", "Only if we work together can we solve the problem."] },
          { q: "If the funding had been approved, the centre would have opened. → Had ___", answers: ["Had the funding been approved, the centre would have opened."] },
          { q: "The city did not understand the scale of the problem until 2020. → Not until 2020 ___", answers: ["Not until 2020 did the city understand the scale of the problem."] },
          { q: "This approach is cheap and it is also effective. → Not only ___", answers: ["Not only is this approach cheap, but it is also effective.", "Not only is this approach cheap but it is also effective.", "Not only is this approach cheap, it is also effective.", "Not only is this approach cheap, but it is effective too.", "Not only is this approach cheap, but it is also effective too."] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d7-doc",
    kind: "reading",
    title: "Đọc: Multiple choice ở Passage 3 — một đáp án (6 kiểu câu hỏi) và Choose TWO",
    goal: "Làm đúng ít nhất 10/14 câu của một Passage 3 lập luận trong 20 phút: nhận ra 6 kiểu câu trắc nghiệm (chi tiết, suy luận, mục đích của ví dụ, quan điểm người viết, quan điểm người được dẫn, ý toàn bài), gạch được 7 loại phương án bẫy — nhất là “đúng trong bài nhưng không trả lời câu hỏi” — và xử lý câu Choose TWO như năm câu Đúng / Sai riêng rẽ.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Multiple choice** (trắc nghiệm) đã học ở Tập 2 Ngày 10 (bốn loại câu), Tập 3 Ngày 11 và Ngày 13 (Choose TWO / THREE, năm loại bẫy). Hôm nay đưa nó lên **Passage 3**: văn bản ==lập luận==, câu hỏi hỏi **ý** chứ không hỏi **chi tiết**.",
          "Ở Passage 3, phương án đúng gần như **không dùng lại từ nào** của bài (paraphrase mức 3–4: đổi cả cấu trúc, gộp hai câu thành một ý). Phương án sai lại hay **mượn nguyên từ** trong bài.",
          "Sáu kiểu câu hỏi phải nhận ra từ **thân câu hỏi**: chi tiết · suy luận (suggests / implies) · mục đích (in order to) · quan điểm người viết · quan điểm người được dẫn · ý toàn bài (best title / overall view).",
          "Bẫy số một ở band 7: phương án **đúng theo bài nhưng không trả lời câu được hỏi**. Luôn đọc lại thân câu hỏi trước khi chốt.",
          "**Choose TWO** = năm phương án, hai đúng, mỗi đáp án **một điểm**, thứ tự không quan trọng. Xử lý từng phương án như một câu Đúng / Sai / Không nhắc.",
          "Mục tiêu Tập 4: Passage 3 ≥ 9/13–14. Hôm nay: **≥ 10/14 trong 20 phút**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 10 · Tập 3 Ngày 11 · 13 — và Passage 3 khác gì" },
      {
        t: "table",
        head: ["", "Passage 1–2 (đã quen)", "Passage 3 (hôm nay)"],
        rows: [
          ["**Loại văn bản**", "Mô tả, kể: lịch sử một vật, một quy trình, một nghiên cứu", "**Lập luận**: người viết có quan điểm, dẫn ý người khác rồi đồng ý / bác bỏ"],
          ["**Câu hỏi hỏi gì**", "Chi tiết: ai, khi nào, vì sao, kết quả gì", "**Ý**: người viết ngụ ý gì, nhắc ví dụ để làm gì, thái độ ra sao, cả bài nói gì"],
          ["**Phương án đúng**", "Paraphrase từng từ (expensive → costly)", "Paraphrase **cả ý**: tóm hai ba câu thành một nhận định trừu tượng"],
          ["**Phương án sai**", "Sai chi tiết, trái nghĩa, không nhắc", "Thêm: **đúng nhưng lạc câu hỏi**, ý của **người khác** (không phải người viết), **quá mức** (all, never, most)"],
          ["**Vị trí thông tin**", "Một câu", "Thường **cả đoạn** — phải đọc hết đoạn rồi mới chọn"],
          ["**Thời gian**", "≈ 1 phút / câu", "≈ 1 phút 20 giây / câu; cả passage 20 phút, không vay của Passage 1–2 quá 2 phút"],
        ],
      },
      {
        t: "note",
        title: "📌 Ba điều vẫn đúng như Tập 3",
        items: [
          "Câu trắc nghiệm đi **theo thứ tự bài đọc** (trừ câu hỏi ý toàn bài — luôn nằm cuối nhóm).",
          "Đọc **thân câu hỏi** trước, chưa đọc phương án. Tự trả lời bằng lời của mình sau khi đọc đoạn văn, rồi mới tìm phương án khớp.",
          "Mỗi phương án bị loại phải có **lý do** (trái bài / không nhắc / lạc câu hỏi…). “Nghe có vẻ sai” không phải lý do.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Sáu kiểu câu hỏi trắc nghiệm ở Passage 3" },
      {
        t: "table",
        head: ["Kiểu", "Thân câu hỏi trông thế nào", "Cách trả lời"],
        rows: [
          ["**1. Chi tiết**", "According to the writer / paragraph C, … · What does the writer say about…?", "Tìm đúng câu; đối chiếu từng phần của phương án với câu đó."],
          ["**2. Suy luận**", "The writer **suggests / implies** that… · It can be inferred that…", "Đáp án **không được viết thẳng**. Tìm điều **buộc phải đúng** nếu câu trong bài đúng. Không suy xa hơn một bước."],
          ["**3. Mục đích**", "The writer **mentions / refers to** X **in order to**… · Why does the writer mention…?", "Không hỏi X là gì, mà hỏi X **chứng minh cho ý nào**. Đọc câu **ngay trước** ví dụ — ý cần chứng minh thường ở đó."],
          ["**4. Quan điểm người viết**", "What is the writer's **view / attitude** towards…? · The writer **believes**…", "Tìm từ đánh giá (appealing, a mistake, the merit of, far from harmless) và từ mức độ (largely, seriously, perhaps)."],
          ["**5. Quan điểm người được dẫn**", "According to **the team that reviewed the experiments**, … · Critics of X argue that…", "Tách rõ: ai nói? Người viết **thuật lại** hay **đồng ý**? Phương án bẫy gán ý của A cho B."],
          ["**6. Ý toàn bài**", "Which is the best **title**? · What is the writer's **overall** point / main purpose?", "Làm **cuối cùng**. Chọn phương án phủ được **mọi đoạn**; loại phương án chỉ đúng với một đoạn hoặc đi quá lập trường của người viết."],
        ],
        caption: "Gạch dưới động từ của thân câu hỏi (suggests / in order to / believes) trước khi đọc đoạn văn — nó cho biết phải tìm loại thông tin nào.",
      },
      {
        t: "note",
        title: "💡 Mẹo cho câu “in order to” — đọc ngược lên một câu",
        items: [
          "Ví dụ, con số, tên người trong văn lập luận **không tự đứng một mình**: nó đi sau một nhận định và phục vụ nhận định đó.",
          "Tín hiệu: for instance · such as · consider · take · as … shows · dấu hai chấm (:) · dấu chấm phẩy liệt kê.",
          "Phương án bẫy điển hình: **tả lại đúng ví dụ** (X xảy ra năm nào, ở đâu) — đúng với bài, nhưng không phải **mục đích**.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Quy trình 5 bước cho một câu trắc nghiệm Passage 3" },
      {
        t: "sodo",
        kind: "flow",
        title: "80 giây cho một câu",
        steps: [
          { label: "1. Đọc thân câu hỏi, gạch động từ + từ định vị", sub: "in paragraph D · Swedish pension scheme · “what point” ⇒ kiểu 4" },
          { label: "2. Đọc HẾT đoạn được chỉ (chưa nhìn phương án)", sub: "Chú ý however, yet, what… is…, it is… that — nơi người viết đặt điểm chính" },
          { label: "3. Tự trả lời bằng 5–7 từ của mình", sub: "“Thuỵ Điển = điểm đáng nói là quỹ mặc định, không phải số quỹ”" },
          { label: "4. Tìm phương án khớp ý đó; loại 3 phương án còn lại có LÝ DO", sub: "trái bài · không nhắc · lạc câu hỏi · của người khác · quá mức" },
          { label: "5. Đọc lại thân câu hỏi + phương án đã chọn như MỘT câu", sub: "Câu ghép lại có đúng với bài không?" },
        ],
        caption: "Bước 3 là bước người band 6 bỏ qua: nhảy thẳng vào bốn phương án thì ba phương án sai sẽ “dắt” bạn đi.",
      },
      { t: "rule", formula: "Thân câu hỏi → đọc hết đoạn → tự trả lời → khớp phương án → loại 3 cái còn lại có lý do", vi: "Không có lý do loại thì chưa được chọn." },

      /* ── 4 ── */
      { t: "h", text: "4. Bảy loại phương án bẫy ở band 7" },
      {
        t: "table",
        head: ["Bẫy", "Nó làm gì", "Cách nhận ra"],
        rows: [
          ["**1. Đúng nhưng lạc câu hỏi**", "Nói một điều **có trong bài**, nhưng trả lời câu hỏi **khác**", "Ghép với thân câu hỏi rồi đọc lại: “The writer mentions car showrooms in order to… [tả lại phòng trưng bày xe]” ⇒ không phải mục đích"],
          ["**2. Mượn từ**", "Dùng lại **nguyên cụm** của bài nhưng đổi quan hệ giữa các ý", "Càng nhiều từ giống bài càng phải nghi. Phương án đúng thường **đổi hết từ**"],
          ["**3. Đúng một nửa**", "Nửa đầu khớp bài, nửa sau thêm / đổi một chi tiết", "Kiểm **từng phần** của phương án, nhất là phần sau because / and / which"],
          ["**4. Quá mức**", "Bài nói some / often / largely; phương án nói all / always / most / the only", "Gạch từ lượng và từ mức độ ở cả hai phía (Tập 4 Ngày 5)"],
          ["**5. Trái bài**", "Nói ngược lại — thường dựa vào câu **trước** từ however / yet", "Đọc tiếp sau however; ý trước nó hay là ý bị bác"],
          ["**6. Sai chủ**", "Gán ý của **người được dẫn** cho người viết, hoặc ngược lại", "Hỏi: câu này trong bài bắt đầu bằng ai? (Some economists have proposed… / Their opponents reply…)"],
          ["**7. Không nhắc**", "Nghe hợp lý, đúng với kiến thức chung, nhưng **bài không nói**", "Không tìm được câu nào trong đoạn để chỉ tay vào ⇒ loại"],
        ],
        caption: "Tập 3 Ngày 13 đã học năm loại (2, 3, 4, 5, 7). Hai loại mới của Passage 3 là số 1 và số 6.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Khởi động — một đoạn, ba kiểu câu hỏi" },
      {
        t: "passage",
        title: "Self-service tills",
        intro: "Đoạn tự soạn cho phần khởi động (khoảng 160 từ). Đọc trong 1 phút rồi trả lời 3 câu.",
        paras: [
          { text: "When self-service tills spread through supermarkets at the start of this century, retailers promised that they would shorten queues and free staff to help customers on the shop floor. The second promise was rarely checked. When one chain at last recorded how its employees spent their time, it found that most of the staff released from the tills now stood beside the machines, clearing error messages and checking the age of customers buying alcohol. Shoppers watched by a machine that complains about ‘unexpected items’, it appears, protect themselves by calling for help at the first sign of trouble rather than solving the problem alone. None of this means that the old staffed tills were ideal; they were costly to run, and at busy times the queues were long. What the findings do suggest is that a machine cannot, by itself, produce efficiency. It is the way the work around it is organised, rather than the technology itself, that seems to matter." },
        ],
      },
      {
        t: "mcq",
        id: "t4d7-doc-khoi-dong",
        title: "Khởi động — chọn A, B, C hoặc D (3 câu)",
        items: [
          { q: "The writer mentions shoppers calling for help in order to", options: ["show that self-service tills are too difficult for older people.", "illustrate how customers respond to a machine that seems to find fault with them.", "explain why supermarkets everywhere have employed more staff.", "suggest that retailers should buy more reliable machines."], correct: 1, why: "Kiểu 3 (mục đích). Câu chứa ý này: khách bị một cái máy “complains about ‘unexpected items’” theo dõi thì “protect themselves by calling for help at the first sign of trouble” ⇒ minh hoạ cách khách phản ứng với cái máy như đang bắt lỗi mình. A: bài không nhắc người lớn tuổi (không nhắc). C: bài chỉ nói về một chuỗi siêu thị, không nói “everywhere”, cũng không nói tuyển thêm người (quá mức + không nhắc). D không nhắc." },
          { q: "What does the writer imply about the retailers' promise to free staff?", options: ["They deliberately misled their customers.", "They were mainly interested in cutting costs.", "They made the promise without having evidence for it.", "They later admitted that they had been wrong."], correct: 2, why: "Kiểu 2 (suy luận). “The second promise was rarely checked” + “When one chain at last recorded…” ⇒ lời hứa được đưa ra khi chưa có bằng chứng. A: không có ý cố tình lừa (quá mức). B: chi phí được nhắc cho quầy có thu ngân (costly to run), không phải động cơ của nhà bán lẻ (mượn từ). D không nhắc." },
          { q: "Which statement best expresses the writer's view?", options: ["Results depend on how staff duties are arranged around the machines.", "Supermarkets should return to staffed tills.", "Self-service tills reduce the cost of running a shop.", "Shop staff prefer working beside the machines."], correct: 0, why: "Kiểu 4. Câu cuối là câu chẻ: “It is the way the work around it is organised, rather than the technology itself, that seems to matter.” B trái bài: “None of this means that the old staffed tills were ideal”. C: mượn từ costly nhưng bài không nói máy làm giảm chi phí. D không nhắc." },
        ],
      },
      {
        t: "note",
        title: "📌 Rút ra từ ba câu khởi động",
        items: [
          "Người viết đặt quan điểm của mình vào **câu chẻ** (What the findings do suggest is… / It is… that…) — đúng cấu trúc của bài Ngữ pháp hôm nay. Thấy câu chẻ trong Passage 3 là thấy **điểm chính**.",
          "“None of this means that…” = người viết **chặn trước** một kết luận sai. Phương án nào nói đúng kết luận đó là phương án **trái bài**.",
          "Cả ba phương án đúng đều **không lặp** từ khoá của bài: respond to a machine that seems to find fault with them ↔ watched by a machine that complains · without having evidence ↔ rarely checked · how staff duties are arranged ↔ the way the work around it is organised.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Choose TWO ở Passage 3 — năm câu Đúng / Sai trong một câu hỏi" },
      {
        t: "p",
        text: "Tập 3 Ngày 13 đã dạy quy trình 6 bước cho câu chọn TWO / THREE. Ở Passage 3, điều khác là câu hỏi thường có dạng **“Which TWO claims / points does the writer make about…?”** — năm phương án là năm **nhận định**, không phải năm **vật**. Hãy coi mỗi phương án là một câu Yes / No / Not Given (Tập 4 Ngày 5) và ghi ký hiệu bên cạnh: ✓ (bài nói thế) · ✗ (bài nói ngược) · ? (không nhắc).",
      },
      {
        t: "note",
        title: "💡 Bốn điều phải nhớ với Choose TWO",
        items: [
          "Hai đáp án = **hai câu, hai điểm**. Đúng một trong hai vẫn được một điểm ⇒ không bao giờ bỏ trống.",
          "Trên máy: bấm chọn đủ **hai** ô; trên giấy: viết mỗi chữ cái vào một ô, thứ tự nào cũng được.",
          "Thường có **đúng hai** dấu ✓. Nếu bạn có ba ✓, một trong ba là bẫy “sai chủ” (ý của người được dẫn) hoặc “quá mức” — đọc lại từ lượng.",
          "Thông tin cho năm phương án nằm trong **một đoạn** và **không theo thứ tự** A → E. Đọc đoạn một lượt, đánh dấu từng nhận định gặp được.",
        ],
      },
      { t: "rule", formula: "Choose TWO = 5 nhận định → ghi ✓ / ✗ / ? cho từng cái → chọn hai dấu ✓", vi: "Ba dấu ✓ ⇒ soát lại “ai nói” và từ mức độ." },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện trọn bài — Reading Passage 3, Questions 27–40 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ **20 phút**. 2 phút đầu: đọc tiêu đề, đoạn A và **câu đầu** các đoạn B–G để nắm đường đi của lập luận (ai bị bác, ai được ủng hộ). Thứ tự làm: Questions 27–31 (theo thứ tự bài) → 33–36 → 37–40 → **32 làm cuối** (ý toàn bài). Chưa xem giải thích cho tới khi xong cả 14 câu.",
      },
      {
        t: "passage",
        title: "Can There Be Too Much Choice?",
        intro: "You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.",
        paras: [
          { label: "A", text: "Few beliefs about modern life are repeated as confidently as the claim that we now have too much choice. Streaming services offer more films than anyone could watch in a lifetime, and the shopper frozen in front of a wall of almost identical toothpastes has become a familiar figure of fun. The idea that abundance leaves us anxious rather than free is an appealing one, not least because it allows a complaint about plenty to sound like hard-won wisdom rather than ingratitude. Yet a growing number of researchers argue that the evidence for it is considerably weaker than its popularity suggests, and that the conclusions drawn from it are far from harmless." },
          { label: "B", text: "The best-known evidence for the idea comes from a supermarket in California in the mid-1990s, where two psychologists set up a tasting stall that offered, at some times, twenty-four varieties of jam and, at others, only six. The larger display attracted more passing shoppers, but those who stopped at the smaller one were roughly ten times as likely to buy a jar. The finding was striking, easy to explain and easy to remember, and over the following decade it was cited in popular books, business courses and government reports as proof that more options produce fewer decisions. Were the effect as general as these citations implied, it ought to appear wherever large ranges are on offer — in bookshops, restaurants and car showrooms alike." },
          { label: "C", text: "When one team of researchers gathered the results of some fifty experiments on the subject in 2010, however, the expected pattern largely failed to appear. In some studies larger ranges discouraged people from choosing; in others they encouraged it; and on average the effect was close to zero. The team did not conclude that choice never overwhelms anyone. Their view, which later reviews have broadly supported, was that overload is real but conditional: it tends to occur when the options are difficult to compare, when the chooser has no clear preference to begin with, and when a decision must be made in a hurry. On this account, a wide range resembles less a burden than a tool whose value depends on the person using it; had the shoppers in California known exactly which flavour they wanted, the size of the display would scarcely have mattered." },
          { label: "D", text: "It would be a mistake, however, to conclude that the way options are presented does not matter at all, and the more careful critics of the overload thesis do not claim this. What presentation determines, they suggest, is not whether people are able to choose but where they end up when they hesitate. When Sweden reformed its pension system in 2000, savers were invited to build their own portfolios from more than 450 funds, and many of them did so. What distinguished the scheme, however, was that it also offered a carefully designed default fund for anyone who made no active choice; according to economists who later studied the results, those who stayed in it did better, at least in the early years, than the average saver who had chosen alone. Since people are notoriously reluctant to revisit a financial decision once it has been made, the design of that first, unchosen option may shape their savings for decades." },
          { label: "E", text: "If the evidence is so mixed, it is reasonable to ask why the idea has proved so durable. Part of the answer lies in the way it flatters its audience: it is more comfortable to believe that one's indecision is caused by the world than by oneself. Part of it is commercial. Authors of popular psychology need findings that can be summed up in a sentence; and a single striking experiment is far more likely to be reported in newspapers than a careful review that finds no consistent effect. None of this requires any deliberate dishonesty. It is simply that almost everyone who repeats the story has a reason to prefer the vivid version to the accurate one." },
          { label: "F", text: "The consequences are most visible in regulation. In Britain, for example, energy suppliers were for a few years limited to a small number of tariffs, on the reasoning that customers confused by complicated price lists would stay on expensive deals instead of switching. Rules of this kind rest on a simple justification: a shorter list protects consumers from mistakes they would otherwise make. Some economists have gone further and proposed that certain decisions — the choice of a pension fund, for instance — should be taken away from individuals altogether and left to experts. Their opponents reply that a wide range is precisely what forces suppliers to compete, and that shortening it would raise prices for everyone. The dispute is unlikely to be settled soon, since nobody can observe how the same market would have developed under the opposite rule." },
          { label: "G", text: "There is, finally, a quieter cost. People who are told that choice is a burden may reasonably conclude that their difficulty in deciding is a feature of the world rather than a skill they could improve, and that the sensible response to a crowded shelf is to wait for someone else to narrow it for them. An account that emphasises preparation — knowing in advance what one wants, learning how to compare, setting a limit on the time to be spent — is less dramatic, but it has the merit of being both more accurate and more useful. This is not to say that every range is sensibly designed, or that companies should be free to multiply options without limit. It is to say that the difficulty of choosing is better understood as a matter of skill and circumstance than as an unavoidable consequence of large numbers." },
        ],
      },
      { t: "p", text: "**Questions 27–32.** Choose the correct letter, **A, B, C or D**." },
      {
        t: "mcq",
        id: "t4d7-doc-mot",
        title: "Questions 27–32 — Choose the correct letter, A, B, C or D",
        items: [
          { q: "27. In paragraph A, the writer suggests that the belief in too much choice is attractive because", options: ["it rests on a large body of reliable evidence.", "it makes dissatisfaction with plenty seem wise rather than ungrateful.", "it explains why shops have begun to reduce their ranges.", "it has been shown to do no harm."], correct: 1, why: "Câu 3 đoạn A: “an appealing one, not least because it allows a complaint about plenty to sound like hard-won wisdom rather than ingratitude”. attractive = appealing; dissatisfaction with plenty = a complaint about plenty; seem wise = sound like hard-won wisdom (đổi hết từ). A trái bài: “the evidence for it is considerably weaker than its popularity suggests”. C không nhắc. D trái bài: “far from harmless”." },
          { q: "28. The writer mentions bookshops, restaurants and car showrooms in order to", options: ["indicate where the effect should be found if it were really widespread.", "show that the jam study was repeated in several kinds of shop.", "suggest that expensive products are harder to choose than cheap ones.", "explain why business courses became interested in the research."], correct: 0, why: "Kiểu mục đích: đọc chính câu chứa ví dụ — câu đảo ngữ “Were the effect as general as these citations implied, it ought to appear wherever large ranges are on offer — in bookshops, restaurants and car showrooms alike”. Ba nơi này là chỗ hiệu ứng LẼ RA phải xuất hiện nếu nó phổ quát. B: bài không nói thí nghiệm được lặp lại ở các cửa hàng đó (mượn từ + không nhắc). C không nhắc. D: business courses có ở câu trước, nhưng bài không giải thích vì sao họ quan tâm." },
          { q: "29. According to the team that reviewed the experiments, choice overload is likely to happen when", options: ["a large display attracts more people than a small one.", "the products on offer are more expensive than usual.", "people are unsure what they want and the options are hard to compare.", "shoppers have already been shown a smaller range."], correct: 2, why: "Đoạn C: “it tends to occur when the options are difficult to compare, when the chooser has no clear preference to begin with, and when a decision must be made in a hurry”. unsure what they want = no clear preference; hard to compare = difficult to compare. A là bẫy “đúng nhưng lạc câu hỏi”: “The larger display attracted more passing shoppers” có trong bài (đoạn B), nhưng đó là kết quả của thí nghiệm mứt, không phải điều kiện nhóm nghiên cứu nêu. B, D không nhắc." },
          { q: "30. What point does the writer make about the Swedish pension scheme in paragraph D?", options: ["It offered savers too few funds to choose from.", "Few savers were prepared to select their own funds.", "Savers who chose for themselves did better than those who did not.", "Its most important feature was what it provided for people who did not choose."], correct: 3, why: "Câu chẻ: “What distinguished the scheme, however, was that it also offered a carefully designed default fund for anyone who made no active choice”. most important feature = what distinguished; people who did not choose = anyone who made no active choice. A trái bài: “more than 450 funds”. B trái bài: “many of them did so”. C trái bài: người ở lại quỹ mặc định “did better… than the average saver who had chosen alone”." },
          { q: "31. In paragraph E, the writer says that the idea of choice overload has lasted mainly because", options: ["researchers have intentionally exaggerated their results.", "it is reassuring to believe and useful to those who spread it.", "newspapers are unable to report statistical reviews.", "the original researchers have defended it in public."], correct: 1, why: "“Part of the answer lies in the way it flatters its audience: it is more comfortable to believe…” + “Part of it is commercial” (tác giả sách cần kết luận gọn một câu, báo chí thích thí nghiệm gây ấn tượng) ⇒ hai nguyên nhân: dễ chịu khi tin + có lợi cho người lan truyền. A trái bài: “None of this requires any deliberate dishonesty”. C: bài chỉ nói báo “far more likely to” đưa tin thí nghiệm hơn bài tổng quan, không nói họ không thể (quá mức). D không nhắc." },
          { q: "32. Which of the following best summarises the writer's overall view?", options: ["Large ranges of products are almost always harmful to consumers.", "Governments should remove all limits on consumer choice.", "Choice overload occurs only in certain conditions, and choosing well is a skill that can be developed.", "The jam study should no longer be cited because it was badly designed."], correct: 2, why: "Ý toàn bài: đoạn C (quá tải có thật nhưng có điều kiện) + đoạn D (cách trình bày lựa chọn vẫn quan trọng) + đoạn G (“a matter of skill and circumstance”). A trái đoạn C: “on average the effect was close to zero”. B: là ý của “their opponents” ở đoạn F, và người viết không chọn phe (sai chủ + quá mức). D: bài không hề nói thí nghiệm thiết kế kém (không nhắc) — người viết chỉ phê phán cách người ta khái quát hoá nó." },
        ],
      },
      { t: "p", text: "**Questions 33 and 34.** Choose **TWO** letters, **A–E**. **Which TWO of the following statements about rules that limit choice are made in paragraph F?**" },
      {
        t: "table",
        head: ["", "Statement"],
        rows: [
          ["**A**", "Most economists now believe that individuals should not choose their own pensions."],
          ["**B**", "The case for limiting options is that people would otherwise choose badly."],
          ["**C**", "Pension funds are currently selected by experts rather than by savers."],
          ["**D**", "Experience in Britain shows that having fewer tariffs led to higher prices."],
          ["**E**", "Critics of these rules argue that variety keeps suppliers under competitive pressure."],
        ],
      },
      {
        t: "quiz",
        id: "t4d7-doc-hai-1",
        kind: "fill",
        title: "Questions 33–34 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(33–34) Two statements about rules that limit choice: ___", answers: ["B E", "BE", "B and E", "B & E", "B/E", "B + E", "B-E", "B, E", "E B", "EB", "E and B", "E & B", "E/B", "E + B", "E-B", "E, B"] }],
      },
      { t: "p", text: "**Questions 35 and 36.** Choose **TWO** letters, **A–E**. **Which TWO points does the writer make in paragraph G?**" },
      {
        t: "table",
        head: ["", "Point"],
        rows: [
          ["**A**", "All product ranges are designed with the customer's needs in mind."],
          ["**B**", "Belief in choice overload may discourage people from improving the way they decide."],
          ["**C**", "Companies should be allowed to offer as many options as they like."],
          ["**D**", "An account based on preparation is closer to the truth than the overload account."],
          ["**E**", "An account based on preparation makes a more exciting story."],
        ],
      },
      {
        t: "quiz",
        id: "t4d7-doc-hai-2",
        kind: "fill",
        title: "Questions 35–36 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(35–36) Two points in paragraph G: ___", answers: ["B D", "BD", "B and D", "B & D", "B/D", "B + D", "B-D", "B, D", "D B", "DB", "D and B", "D & B", "D/B", "D + B", "D-B", "D, B"] }],
      },
      {
        t: "p",
        text: "**Questions 37–40.** Do the following statements agree with the claims of the writer in Reading Passage 3? Write **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "quiz",
        id: "t4d7-doc-ynng",
        kind: "fill",
        title: "Questions 37–40 — YES / NO / NOT GIVEN",
        items: [
          { q: "37. The jam study attracted little attention outside academic journals. ___", answers: ["NO", "N"] },
          { q: "38. If the shoppers in the original study had known which jam they wanted, the number of varieties on display would have made a considerable difference. ___", answers: ["NO", "N"] },
          { q: "39. People tend to avoid reconsidering financial decisions they have already made. ___", answers: ["YES", "Y"] },
          { q: "40. The limit on energy tariffs in Britain reduced the prices that customers paid. ___", answers: ["NOT GIVEN", "NG", "NOTGIVEN"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 33–36 — ghi ✓ / ✗ / ? cho từng phương án",
        items: [
          "**33–34: B, E.** **B ✓** — “Rules of this kind rest on a simple justification: a shorter list protects consumers from mistakes they would otherwise make” (the case for limiting options… people would otherwise choose badly). **E ✓** — “Their opponents reply that a wide range is precisely what forces suppliers to compete” (critics = opponents; variety = a wide range; keeps suppliers under competitive pressure = forces suppliers to compete).",
          "**A ✗ / quá mức** — bài: “**Some** economists have… proposed”, và chỉ với **một số** quyết định (certain decisions); some ≠ most.",
          "**C ✗** — “**should be** taken away from individuals… and left to experts” là **đề xuất**, chưa phải hiện trạng (currently). Bẫy đổi thì / đổi tình thái: should be ≠ are.",
          "**D ✗** — trái bài: “**nobody can observe** how the same market would have developed under the opposite rule” ⇒ không có kinh nghiệm nào “cho thấy” như thế.",
          "**35–36: B, D.** **B ✓** — “People who are told that choice is a burden may reasonably conclude that their difficulty in deciding is a feature of the world rather than a skill they could improve”. **D ✓** — “it has the merit of being both **more accurate** and more useful” (closer to the truth).",
          "**A ✗** — “This is **not** to say that every range is sensibly designed”. **C ✗** — “…or that companies should be free to multiply options without limit”. Cả hai là điều người viết **chặn trước**. **E ✗** — “less dramatic” (kém kịch tính hơn); bẫy mượn ý “more useful” rồi đổi thành “more exciting”.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 37–40 — YES / NO / NOT GIVEN",
        items: [
          "**37 NO** — đoạn B: “it was cited in **popular books, business courses and government reports**”. little attention outside academic journals ↔ được trích dẫn rộng rãi ngoài giới học thuật.",
          "**38 NO** — đoạn C: “had the shoppers in California known exactly which flavour they wanted, the size of the display **would scarcely have mattered**”. Câu đảo ngữ Had… (bài Ngữ pháp mục 7) = If the shoppers had known… made a considerable difference ↔ would scarcely have mattered.",
          "**39 YES** — đoạn D: “people are **notoriously reluctant to revisit** a financial decision once it has been made”. tend to avoid reconsidering = are reluctant to revisit; decisions they have already made = once it has been made.",
          "**40 NOT GIVEN** — đoạn F chỉ nêu **lý do** của quy định (khách bối rối sẽ ở lại gói đắt) và hai phía tranh luận, rồi nói không ai quan sát được thị trường sẽ ra sao theo luật ngược lại. Không có câu nào nói giá điện ở Anh **đã giảm** nhờ quy định này.",
        ],
      },
      {
        t: "table",
        head: ["Đúng / 14", "Mức ước tính cho Passage 3", "Việc cần làm"],
        rows: [
          ["12–14", "Band 8 trở lên", "Xem lại thời gian: có dưới 20 phút không? Làm tiếp phần 8."],
          ["10–11", "Band 7 — đạt mục tiêu hôm nay", "Với mỗi câu sai, ghi vào Sổ lỗi **tên loại bẫy** (mục 4) đã lừa bạn."],
          ["7–9", "Band 6–6.5", "Làm lại 27–32 theo đúng 5 bước, **viết ra** câu tự trả lời ở bước 3 trước khi nhìn phương án."],
          ["0–6", "Chưa vững", "Ôn Tập 3 Ngày 13 (Choose TWO, năm loại bẫy) và Tập 4 Ngày 5 (YNNG), rồi làm lại bài này sau 3 ngày."],
        ],
        caption: "Band ghi ở đây là ước tính cho riêng Passage 3; band Reading thật tính trên 40 câu.",
      },

      /* ── 8 ── */
      { t: "h", text: "8. Soi lại bài đọc: câu chẻ và đảo ngữ báo “điểm chính ở đây”" },
      {
        t: "p",
        text: "Người viết học thuật dùng đúng những cấu trúc của bài Ngữ pháp hôm nay để **đánh dấu luận điểm**. Tìm trong bài đọc và điền từ còn thiếu — rồi để ý: đáp án của câu 28, câu 30, câu 38, phương án E của câu 33–34 và câu 32 nằm ngay trong những câu này.",
      },
      {
        t: "quiz",
        id: "t4d7-doc-soi",
        kind: "fill",
        title: "Điền MỘT từ lấy từ bài đọc (6 câu)",
        items: [
          { q: "Đoạn B (đảo ngữ thay if): “___ the effect as general as these citations implied, it ought to appear wherever large ranges are on offer.”", answers: ["Were"] },
          { q: "Đoạn C (đảo ngữ thay if): “___ the shoppers in California known exactly which flavour they wanted, the size of the display would scarcely have mattered.”", answers: ["had", "Had"] },
          { q: "Đoạn D (Wh-cleft): “___ presentation determines, they suggest, is not whether people are able to choose but where they end up when they hesitate.”", answers: ["What"] },
          { q: "Đoạn D (Wh-cleft): “What distinguished the scheme, however, ___ that it also offered a carefully designed default fund.”", answers: ["was"] },
          { q: "Đoạn F (cleft đảo): “a wide range is precisely ___ forces suppliers to compete.”", answers: ["what"] },
          { q: "Đoạn G (It is… to say that): “___ is to say that the difficulty of choosing is better understood as a matter of skill and circumstance.”", answers: ["It"] },
        ],
      },
      {
        t: "note",
        title: "💡 Cách dùng điều này khi đọc Passage 3",
        items: [
          "Khi đọc lướt 2 phút đầu, **khoanh** mọi câu bắt đầu bằng What… is / It is… that / Were… / Had… / Not only… / however, yet. Đó là bản đồ luận điểm của bài.",
          "Câu hỏi quan điểm người viết (kiểu 4) và ý toàn bài (kiểu 6) gần như luôn trả lời được từ các câu đã khoanh.",
          "Cặp “not X but Y” (not whether people are able to choose **but** where they end up when they hesitate): phương án đúng nói **Y**; phương án bẫy nói **X**.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "abundance", pos: "n", ipa: "/əˈbʌndəns/", vi: "sự dồi dào, sự thừa thãi", ex: "An abundance of information does not guarantee better decisions.", exVi: "Thông tin dồi dào không bảo đảm quyết định tốt hơn.", more: "**an abundance of** + N · **in abundance** (dồi dào) · abundant (adj) · ≠ scarcity (sự khan hiếm)" },
          { w: "striking", pos: "adj", ipa: "/ˈstraɪkɪŋ/", vi: "nổi bật, gây ấn tượng mạnh", ex: "The most striking feature of the data is the gap between the two regions.", exVi: "Điểm nổi bật nhất của số liệu là khoảng cách giữa hai vùng.", more: "a **striking** contrast / difference / similarity / finding · **strikingly** similar (adv) — rất hợp Task 1" },
          { w: "cite", pos: "v", ipa: "/saɪt/", vi: "trích dẫn, viện dẫn (làm bằng chứng)", ex: "The study is often cited as evidence that smaller classes help weaker students.", exVi: "Nghiên cứu này thường được viện dẫn làm bằng chứng rằng lớp nhỏ giúp học sinh yếu.", more: "**cite** sth **as** evidence / an example · **be widely cited** · citation (n) · đồng âm với site, sight" },
          { w: "overwhelm", pos: "v", ipa: "/ˌəʊvəˈwelm/", vi: "áp đảo, làm choáng ngợp, quá tải", ex: "Hospitals were overwhelmed by the number of patients.", exVi: "Các bệnh viện bị quá tải vì số bệnh nhân.", more: "**be overwhelmed by / with** sth · **overwhelming** evidence / majority / support (adj — “áp đảo”)" },
          { w: "conditional", pos: "adj", ipa: "/kənˈdɪʃənl/", vi: "có điều kiện, phụ thuộc vào điều kiện", ex: "The loan is conditional on the company meeting its targets.", exVi: "Khoản vay phụ thuộc vào việc công ty đạt chỉ tiêu.", more: "**conditional on / upon** + N / V-ing · a **conditional** offer · ≠ unconditional (vô điều kiện)" },
          { w: "default", pos: "n, adj", ipa: "/dɪˈfɔːlt/", vi: "(lựa chọn) mặc định", ex: "Most users never change the default settings.", exVi: "Phần lớn người dùng không bao giờ đổi cài đặt mặc định.", more: "the **default** option / setting · **by default** (mặc nhiên, khi không ai chọn) · cũng đọc /ˈdiːfɔːlt/" },
          { w: "notoriously", pos: "adv", ipa: "/nəʊˈtɔːriəsli/", vi: "ai cũng biết là (thường về điều xấu / khó)", ex: "Long-term forecasts are notoriously unreliable.", exVi: "Dự báo dài hạn nổi tiếng là không đáng tin.", more: "**notoriously** difficult / unreliable / slow · notorious **for** + N (adj) — nghĩa tiêu cực, ≠ famous" },
          { w: "durable", pos: "adj", ipa: "/ˈdjʊərəbl/", vi: "bền, tồn tại lâu", ex: "The belief has proved remarkably durable.", exVi: "Niềm tin đó hoá ra bền bỉ đáng kinh ngạc.", more: "prove **durable** · **durable** goods / materials · durability (n)" },
          { w: "flatter", pos: "v", ipa: "/ˈflætə/", vi: "tâng bốc; làm (ai) thấy dễ chịu về bản thân", ex: "The survey results flatter the government, but they hide the regional gaps.", exVi: "Kết quả khảo sát làm chính phủ trông đẹp, nhưng che mất khoảng cách giữa các vùng.", more: "**flatter** sb · **be flattered** (thấy được tâng bốc) · flattering (adj) · flattery (n)" },
          { w: "justification", pos: "n", ipa: "/ˌdʒʌstɪfɪˈkeɪʃn/", vi: "lý lẽ biện minh, cơ sở chính đáng", ex: "There is little justification for raising fares again.", exVi: "Hầu như không có cơ sở chính đáng để tăng giá vé lần nữa.", more: "**justification for** + N / V-ing · **provide / offer** a justification · justify (v) · justifiable (adj)" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d7-noi",
    kind: "speaking",
    title: "Nói Part 3: Dự đoán tương lai có hedging — nói đúng mức chắc chắn",
    goal: "Trả lời câu hỏi dự đoán của Part 3 (How will… change? · Do you think… will…?) trong 40–50 giây theo khung 4 bước, chọn đúng mức chắc chắn trên thang 7 bậc (is bound to · will almost certainly · is likely to · may well · might · is unlikely to · I doubt whether), có căn cứ và có điều kiện, dùng câu chẻ để mở ý — và nối âm /j/ /w/ giữa hai nguyên âm — đẩy FC, LR, GRA và P lên band 7.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Câu hỏi **dự đoán** là một trong bốn kiểu chính của Part 3 (so sánh quá khứ – hiện tại · dự đoán · giả định · đánh giá). Tập 3 Ngày 5 (mục 7) đã dạy trả lời “How will… change in the future?” bằng will / will be V-ing / will have V3; Tập 3 Ngày 15 dạy **mức chắc chắn** cho câu giả định.",
          "Band 6 nói: “In the future people **will** work at home.” — mọi thứ đều **will**, chắc như đinh. Band 7 nói đúng **mức mình tin**: will almost certainly… / may well… / I doubt whether… Kỹ thuật này gọi là ==hedging== (rào đón: nói có mức độ, không khẳng định quá tay).",
          "Hôm nay: **thang 7 bậc** chắc chắn · 12 cụm rào đón tự nhiên · **khung 4 bước** (mở có mức độ → dự đoán + căn cứ → tách thời gian / nhóm người → điều kiện, chốt).",
          "Nối bài Ngữ pháp: mở ý bằng câu chẻ — **What I think will happen is**… · **What I'm less sure about is**…",
          "🔊 **Nối âm /j/ và /w/**: giữa hai nguyên âm người bản ngữ chêm một âm lướt — I‿(j)agree · go‿(w)on. Không nối thì câu bị ngắt vụn, mất điểm P.",
          "Tiêu chí được đẩy: **LR** (từ chỉ mức độ chính xác) · **GRA** (tương lai tiếp diễn / hoàn thành, modal, câu chẻ) · **FC** (trả lời dài có cấu trúc) · **P** (nối âm).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 3 Ngày 5 · 15 — nhận ra câu hỏi dự đoán" },
      {
        t: "table",
        head: ["Dạng câu hỏi", "Ví dụ", "Giám khảo muốn nghe"],
        rows: [
          ["**How will… change?**", "How do you think shopping will change in the next few decades?", "Hướng thay đổi + căn cứ + mức chắc"],
          ["**Do you think… will…?**", "Do you think printed books will disappear one day?", "Có / không **theo mức độ** + lý do; không chỉ Yes / No"],
          ["**What will… be like?**", "What will cities be like in fifty years' time?", "2 đặc điểm, mỗi cái một mức chắc khác nhau"],
          ["**Is it likely that…?**", "Is it likely that people will work fewer hours in the future?", "Đánh giá khả năng + điều kiện để nó xảy ra"],
          ["**Will… ever…?**", "Will machines ever replace teachers?", "Phân biệt **phần nào** có thể, phần nào không"],
        ],
        caption: "Thấy will / in the future / in … years' time / one day / ever ⇒ câu dự đoán ⇒ bật khung 4 bước ở mục 4.",
      },
      {
        t: "note",
        title: "📌 Ôn 60 giây: ba dạng tương lai band 6 đã học (Tập 3 Ngày 5)",
        items: [
          "**will + V** — dự đoán theo ý kiến: Prices **will rise**.",
          "**will be + V-ing** — việc đang diễn ra tại một thời điểm tương lai / xu hướng: In ten years most people **will be working** from home at least part of the week.",
          "**will have + V3** — việc đã xong trước một mốc tương lai: By 2050 many of today's jobs **will have disappeared**.",
          "Hôm nay thêm lớp thứ hai: **mức chắc chắn** đặt lên trên các dạng này — will **probably** be working · **may well** have disappeared.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Thang 7 bậc chắc chắn — chọn đúng bậc mình tin" },
      {
        t: "table",
        head: ["Bậc", "Cách nói", "Ví dụ"],
        rows: [
          ["**7 — chắc chắn (≈ 100 %)**", "is bound to · is certain to · will definitely · there's no doubt (that)", "Online shopping **is bound to** keep growing."],
          ["**6 — gần như chắc (≈ 90 %)**", "will almost certainly · is highly likely to · in all likelihood · I'm fairly confident (that)", "Cash **will almost certainly** be used far less."],
          ["**5 — nhiều khả năng (≈ 70 %)**", "is likely to · will probably · the chances are (that) · I'd expect … to", "Small shops **are likely to** struggle."],
          ["**4 — có thể lắm (≈ 50–60 %)**", "may well · could well · there's a good chance (that)", "Some high streets **may well** turn into housing."],
          ["**3 — có thể (≈ 30–40 %)**", "may · might · could · it's possible (that) · perhaps", "We **might** see drone deliveries in big cities."],
          ["**2 — khó xảy ra (≈ 10–20 %)**", "is unlikely to · probably won't · I doubt whether / if · I can't see … V-ing", "Physical shops **are unlikely to** disappear completely."],
          ["**1 — gần như không**", "is highly unlikely to · will almost certainly not · there's little chance (that / of)", "**There's little chance of** people giving up shopping in person altogether."],
        ],
        caption: "Phần trăm chỉ để dễ hình dung. Một câu trả lời band 7 thường dùng 2–3 bậc KHÁC nhau cho các ý khác nhau.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + will + probably / almost certainly / definitely + V   ·   S + probably / almost certainly / definitely + won't + V",
            vi: "Trạng từ đứng SAU will ở câu khẳng định, TRƯỚC won't ở câu phủ định.",
            examples: [
              { en: "Electric cars will probably become cheaper than petrol ones.", vi: "Xe điện có lẽ sẽ rẻ hơn xe xăng." },
              { en: "Most people probably won't give up their cars, though.", vi: "Dù vậy, phần lớn mọi người có lẽ sẽ không bỏ xe hơi." },
            ],
          },
          {
            formula: "S + be + (highly) likely / unlikely / bound / certain + to V",
            vi: "Chủ ngữ là NGƯỜI / VẬT, không phải it. Thì tương lai nằm sẵn trong likely.",
            examples: [
              { en: "Young people are likely to change careers several times.", vi: "Người trẻ nhiều khả năng sẽ đổi nghề vài lần." },
              { en: "Demand for care workers is bound to increase as the population ages.", vi: "Nhu cầu người chăm sóc chắc chắn sẽ tăng khi dân số già đi." },
            ],
          },
          {
            formula: "It is (highly) likely / unlikely / possible + that + S + will + V   ·   There's a good chance (that) + S + will + V",
            vi: "Chủ ngữ giả It / There + mệnh đề.",
            examples: [
              { en: "It's highly unlikely that robots will replace nurses.", vi: "Rất khó có chuyện rô-bốt thay thế điều dưỡng." },
              { en: "There's a good chance that remote work will stay.", vi: "Nhiều khả năng làm việc từ xa sẽ ở lại." },
            ],
          },
          {
            formula: "S + may / might / could + well + V   ·   S + may / might + have + V3 + by + mốc",
            vi: "may well = “rất có thể” (mạnh hơn may). Kết hợp được với tương lai hoàn thành.",
            examples: [
              { en: "Traditional lectures may well be replaced by online courses.", vi: "Bài giảng truyền thống rất có thể bị thay bằng khoá học trực tuyến." },
              { en: "By 2040 petrol stations might have disappeared from city centres.", vi: "Tới 2040 trạm xăng có thể đã biến mất khỏi trung tâm thành phố." },
            ],
          },
          {
            formula: "I doubt whether / if + S + will + V   ·   I can't see + N + V-ing",
            vi: "Nói “tôi không tin là…” một cách tự nhiên, lịch sự.",
            examples: [
              { en: "I doubt whether people will ever stop reading on paper.", vi: "Tôi không tin là người ta sẽ có lúc thôi đọc trên giấy." },
              { en: "I can't see governments banning private cars any time soon.", vi: "Tôi không hình dung được chính phủ sẽ cấm xe cá nhân trong tương lai gần." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với từ chỉ khả năng",
        items: [
          "~~It is likely to rain / people is likely…~~ lẫn hai khung: **People are likely to** move. / **It is likely that** people **will** move. Không nói ~~It is likely people to move~~.",
          "~~Maybe people will… Maybe robots will… Maybe…~~ — lặp maybe là dấu hiệu band 6. Đổi: **may well**, **I'd imagine**, **the chances are**. Và ~~may be~~ (động từ) ≠ **maybe** (trạng từ): It **may be** true. / **Maybe** it's true.",
          "~~will can~~ → **will be able to** · ~~will must~~ → **will have to**.",
          "~~I'm sure it probably will…~~ — trộn hai bậc trái nhau. Chọn **một** bậc cho mỗi ý.",
          "~~People will not probably stop~~ → People **probably won't** stop. (Trạng từ đứng trước won't.)",
          "~~In the future, there will have more robots.~~ → there **will be** more robots (Tập 2 Ngày 7).",
          "~~I doubt that people will not read~~ — doubt đã phủ định; mệnh đề sau để **khẳng định**: I doubt whether people **will** stop reading.",
        ],
      },
      { t: "rule", formula: "will + almost certainly / probably + V  ·  be (highly) likely / unlikely / bound + to V  ·  may / could well + V  ·  I doubt whether + S + will + V", vi: "Mỗi ý một bậc chắc chắn; trạng từ sau will, trước won't." },
      {
        t: "quiz",
        id: "t4d7-noi-thang-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng cụm cho trong gợi ý (5 câu)",
        grammar: "be likely to V · will almost certainly V · may well V · I doubt whether… · be bound to V",
        items: [
          { q: "Giá nhà nhiều khả năng sẽ tiếp tục tăng. (likely)", answers: ["House prices are likely to continue to rise.", "House prices are likely to keep rising.", "House prices are likely to continue rising.", "Housing prices are likely to keep rising.", "House prices are likely to go on rising.", "House prices are likely to keep increasing.", "Housing prices are likely to continue to rise."], hint: "House prices are likely to…" },
          { q: "Tiền mặt gần như chắc chắn sẽ được dùng ít hơn. (almost certainly)", answers: ["Cash will almost certainly be used less.", "Cash will almost certainly be used less often.", "Cash will almost certainly be used far less."], hint: "Cash will almost certainly be used…" },
          { q: "Nhiều việc lặp đi lặp lại rất có thể sẽ do máy móc làm. (may well)", answers: ["Many repetitive jobs may well be done by machines.", "Many routine jobs may well be done by machines.", "Many repetitive tasks may well be done by machines.", "A lot of repetitive jobs may well be done by machines.", "Many routine tasks may well be done by machines."], hint: "Many repetitive jobs may well be done by…" },
          { q: "Tôi không tin là sách giấy sẽ biến mất. (doubt whether)", answers: ["I doubt whether printed books will disappear.", "I doubt whether paper books will disappear.", "I doubt whether printed books will ever disappear.", "I doubt whether paper books will ever disappear."], hint: "I doubt whether printed books will…" },
          { q: "Dân số già đi chắc chắn sẽ gây áp lực lên bệnh viện. (bound)", answers: ["An ageing population is bound to put pressure on hospitals.", "The ageing population is bound to put pressure on hospitals.", "An aging population is bound to put pressure on hospitals.", "An ageing population is bound to put pressure on the hospitals."], hint: "An ageing population is bound to put pressure on…" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mười hai cụm rào đón tự nhiên — mở câu, đặt căn cứ, giữ đường lui" },
      {
        t: "p",
        text: "**Hedging** không phải là nói mơ hồ. Đó là nói **đúng mức bằng chứng mình có**. Người bản ngữ có học thức gần như không bao giờ nói “X will happen” về tương lai xa mà không kèm một cụm giảm mức. Ngày 13 sẽ học trọn hedging cho văn viết (it is widely believed that…, tend to, arguably); hôm nay lấy nhóm cụm dùng khi **nói**.",
      },
      {
        t: "table",
        head: ["Việc cần làm", "Cụm", "Ví dụ"],
        rows: [
          ["**Mở — thừa nhận khó đoán**", "It's hard to say for sure, but… · It's difficult to predict, but… · Nobody can know for certain, but…", "**It's hard to say for sure, but** I'd imagine most payments will be digital."],
          ["**Mở — đưa phỏng đoán của mình**", "I'd say… · I'd imagine… · I suspect… · My guess is that… · I'd expect … to…", "**I suspect** the change will be slower than people think."],
          ["**Đặt căn cứ**", "Judging by… · Given that… · If current trends continue, … · Looking at what's happened in…", "**Judging by** the last ten years, prices are only going to go up."],
          ["**Nói xu hướng (không tuyệt đối)**", "tend to · be inclined to · more often than not · on the whole · to some extent", "Older people **tend to** be slower to adopt new technology."],
          ["**Tách thời gian**", "in the short term… / in the long run… · for the time being · at least not in the next … years · sooner or later", "**In the short term** very little will change; **in the long run** it's a different story."],
          ["**Giữ đường lui / nêu điều kiện**", "That said, … · Having said that, … · It (all) depends on whether… · unless… · provided (that)… · It remains to be seen whether…", "**That said, a lot depends on whether** governments are willing to pay for it."],
        ],
        caption: "Chọn mỗi hàng MỘT cụm bạn thấy hợp miệng và học thuộc — sáu cụm là đủ dùng cho mọi câu dự đoán.",
      },
      {
        t: "note",
        title: "⚠️ Rào đón quá tay cũng mất điểm",
        items: [
          "~~I think maybe it might possibly be perhaps…~~ — chồng ba bốn từ giảm mức lên một ý nghe như không có ý kiến. **Một ý — một cụm**.",
          "Rào đón ở **dự đoán**, không rào đón ở **ý kiến của chính mình**: I **do** think this is a good thing (rõ ràng) + it **will probably** happen slowly (có mức độ).",
          "Không dùng cụm văn viết khi nói: ~~It is widely believed that~~ → **A lot of people think** / **Most experts seem to think**.",
          "Sau khi rào đón vẫn phải **có dự đoán**. “It depends” rồi dừng = chưa trả lời. Nói tiếp: It depends on whether X. **If X, then… ; if not, …**",
        ],
      },
      { t: "rule", formula: "It's hard to say for sure, but I'd imagine + S + will + V… · Judging by + N, S + be likely to + V… · That said, it depends on whether + S + V", vi: "Mở có mức độ → căn cứ → đường lui. Một ý chỉ một cụm rào đón." },

      /* ── 4 ── */
      { t: "h", text: "4. Khung 4 bước cho một câu trả lời dự đoán (40–50 giây)" },
      {
        t: "sodo",
        kind: "flow",
        title: "Dự đoán band 7 — 4 bước",
        steps: [
          { label: "1. Mở có mức độ (1 câu)", sub: "It's hard to say for sure, but **what I think will happen is**…" },
          { label: "2. Dự đoán chính + CĂN CỨ (2 câu)", sub: "…**is likely to**… **Judging by**… / **Given that**…" },
          { label: "3. Tách: thời gian hoặc nhóm người (2 câu)", sub: "**In the short term**… **whereas in the long run**… / For office workers… but for…" },
          { label: "4. Điều kiện + chốt (1 câu)", sub: "**That said, a lot depends on whether**… / …**unless**…" },
        ],
        caption: "Bước 3 là bước tạo ra band 7: nó buộc bạn dùng hai mức chắc chắn khác nhau và một từ nối tương phản.",
      },
      {
        t: "table",
        head: ["Trục tách", "Câu khung", "Ví dụ ý"],
        rows: [
          ["**Thời gian**", "In the short term… / In the long run… · Over the next few years… / By the middle of the century…", "Ngắn hạn: vẫn đi làm ở văn phòng vài ngày; dài hạn: văn phòng có thể thu nhỏ hẳn"],
          ["**Nhóm người** (Tập 3 Ngày 6)", "For younger people… whereas older people… · In big cities… but in rural areas…", "Thành phố: giao hàng nhanh; nông thôn: cửa hàng nhỏ vẫn cần"],
          ["**Phần nào đổi, phần nào không**", "What will change is… What I can't see changing is…", "Đổi: cách thanh toán; không đổi: thích đi mua cùng bạn bè"],
          ["**Điều kiện**", "If… continues, … · Unless…, … · Provided (that)…, …", "Nếu giá pin tiếp tục giảm ⇒ xe điện phổ biến; không thì chậm"],
        ],
        caption: "Chọn MỘT trục cho mỗi câu trả lời. Bảng trục chia nhóm (tuổi, thu nhập, vùng) đã học ở Tập 3 Ngày 6.",
      },
      {
        t: "note",
        title: "💡 Mở ý bằng câu chẻ — nối bài Ngữ pháp hôm nay",
        items: [
          "**What I think will happen is that** + S + will + V… — báo trước dự đoán chính.",
          "**What's more likely is that** + S + will + V… — sửa lại một dự đoán quá tay trong câu hỏi.",
          "**What I'm less sure about is** + N / whether… — chuyển sang ý có mức chắc thấp hơn.",
          "**What I can't see changing is** + N… — nêu phần sẽ không đổi.",
          "**It's** younger people **who** will feel this most. — It-cleft để chỉ đúng nhóm chịu tác động.",
          "**The thing is**, + S + V… — đưa ra căn cứ một cách tự nhiên.",
        ],
      },
      { t: "rule", formula: "Mở có mức độ → What I think will happen is that… + căn cứ → In the short term…, whereas in the long run… → That said, it depends on whether…", vi: "Một câu trả lời = một dự đoán chính + hai mức chắc chắn + một điều kiện." },

      /* ── 5 ── */
      { t: "h", text: "5. Nghe và so: band 6 và band 7 cho cùng một câu hỏi" },
      {
        t: "p",
        text: "Câu hỏi: **How do you think the way people work will change in the next twenty years?** Nghe câu trả lời band 6 trước và đếm số lần **will** và **maybe**. Rồi nghe band 7, đánh dấu: (1) các cụm chỉ **mức chắc chắn**, (2) **căn cứ**, (3) chỗ **tách ngắn hạn – dài hạn**, (4) **điều kiện** ở câu cuối.",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 25 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How do you think the way people work will change in the next twenty years?", vi: "Bạn nghĩ cách con người làm việc sẽ thay đổi ra sao trong hai mươi năm tới?" },
          { who: "Candidate", role: "candidate", text: "I think in the future people will work at home more, because technology is developing very fast, so people don't need to go to the office. And robots will do many jobs, so many people will lose their jobs. Maybe people will work less hours, maybe four days a week. So I think the work will change a lot in the future.", vi: "Tôi nghĩ trong tương lai mọi người sẽ làm ở nhà nhiều hơn, vì công nghệ phát triển rất nhanh nên người ta không cần tới văn phòng. Và rô-bốt sẽ làm nhiều việc, nên nhiều người sẽ mất việc. Có lẽ người ta sẽ làm ít giờ hơn, có lẽ bốn ngày một tuần. Nên tôi nghĩ công việc sẽ thay đổi nhiều trong tương lai." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 7 (ước tính) — khoảng 50 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "How do you think the way people work will change in the next twenty years?", vi: "Bạn nghĩ cách con người làm việc sẽ thay đổi ra sao trong hai mươi năm tới?" },
          { who: "Candidate", role: "candidate", text: "It's hard to say for sure, but I'd say the biggest change is likely to be where people work rather than how much.", vi: "Khó nói chắc, nhưng tôi cho rằng thay đổi lớn nhất nhiều khả năng là nơi người ta làm việc, chứ không phải làm bao nhiêu." },
          { who: "Candidate", role: "candidate", text: "Judging by what's happened over the last few years, hybrid working will almost certainly become the norm for office jobs — a lot of companies have already given up part of their office space.", vi: "Nhìn vào những gì diễn ra vài năm qua, làm việc kết hợp gần như chắc chắn sẽ thành chuẩn với việc văn phòng — nhiều công ty đã trả bớt mặt bằng." },
          { who: "Candidate", role: "candidate", text: "What I'm less sure about is automation. Routine tasks like data entry may well be taken over by software, but I doubt whether machines will replace jobs that depend on dealing with people, at least not in the next twenty years.", vi: "Điều tôi ít chắc hơn là tự động hoá. Việc lặp lại như nhập liệu rất có thể sẽ do phần mềm đảm nhận, nhưng tôi không tin máy móc sẽ thay được những việc cần tiếp xúc với con người, ít nhất không phải trong hai mươi năm tới." },
          { who: "Candidate", role: "candidate", text: "So in the short term I'd expect most people to be doing the same jobs with different tools, whereas in the long run we might see some professions disappear altogether.", vi: "Nên trong ngắn hạn tôi nghĩ phần lớn mọi người sẽ vẫn làm công việc cũ với công cụ khác, còn về lâu dài ta có thể thấy vài nghề biến mất hẳn." },
          { who: "Candidate", role: "candidate", text: "That said, a lot depends on how quickly companies are willing to invest.", vi: "Dù vậy, nhiều thứ còn tuỳ vào việc các công ty sẵn sàng đầu tư nhanh tới đâu." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Câu trả lời band 6", "Câu trả lời band 7", "Bài học"],
        rows: [
          ["**FC**", "~25 giây; bốn ý xếp hàng bằng and / so; câu kết lặp lại câu hỏi", "~50 giây; đi đủ 4 bước; discourse markers: It's hard to say for sure, but · What I'm less sure about is · So · That said", "Ít ý hơn (2), mỗi ý có **căn cứ** và **mức chắc**"],
          ["**LR**", "work at home · many jobs · lose their jobs · change a lot", "hybrid working · become the norm · routine tasks · be taken over by · professions · disappear altogether", "Học **cụm** theo chủ đề, mỗi câu trả lời 3–4 cụm ít gặp"],
          ["**GRA**", "Toàn will + V; lỗi: less hours (→ fewer), the work (→ work)", "is likely to be · will almost certainly become · may well be taken over (bị động + modal) · I'd expect… to be doing · might see… disappear; hai câu chẻ What…", "**Ba mức chắc khác nhau** = ba cấu trúc khác nhau"],
          ["**P**", "Đều đều, ngắt sau mỗi từ nối", "Nhấn từ mang mức độ: **al**most **cer**tainly · **doubt**; nối âm: to‿invest, do‿ing", "Luyện mục 7: nối /j/ /w/"],
        ],
        caption: "Ý của hai câu trả lời gần như giống nhau (làm ở nhà, tự động hoá). Khác biệt nằm ở mức chắc chắn, căn cứ và cách tách thời gian.",
      },
      {
        t: "mcq",
        id: "t4d7-noi-chon",
        title: "Kiểm tra — dự đoán có mức độ (6 câu)",
        items: [
          { q: "Chọn câu ĐÚNG.", options: ["People will not probably stop using cash.", "It is likely people to stop using cash.", "People probably won't stop using cash.", "People are likely stop using cash."], correct: 2, why: "probably đứng trước won't. be likely TO V; It is likely THAT + mệnh đề." },
          { q: "Bạn tin khoảng 90 % rằng học trực tuyến sẽ phổ biến hơn. Chọn cách nói hợp nhất.", options: ["Online learning might become more common.", "Online learning will almost certainly become more common.", "I doubt whether online learning will become more common.", "Online learning could possibly become more common."], correct: 1, why: "≈ 90 % = bậc 6: will almost certainly. might / could possibly là bậc 3; I doubt là bậc 2." },
          { q: "“___ what's happened in other countries, the birth rate is only going to fall further.”", options: ["Judging by", "It depends on", "That said,", "Unless"], correct: 0, why: "Judging by + N = dựa vào… để đoán (đặt căn cứ)." },
          { q: "Câu nào rào đón QUÁ TAY?", options: ["I'd imagine cities will get more crowded.", "Cities are likely to get more crowded.", "It's hard to say, but cities may well get more crowded.", "I think maybe cities might possibly perhaps get more crowded."], correct: 3, why: "Bốn từ giảm mức cho một ý ⇒ nghe như không có ý kiến. Một ý — một cụm." },
          { q: "Giám khảo hỏi: “Will robots ever replace doctors?” Câu mở nào đạt band 7?", options: ["Yes, I think so.", "No. Robots can't replace doctors.", "I can't see that happening completely, although some parts of the job may well be automated.", "It depends."], correct: 2, why: "Tách “phần nào có thể, phần nào không” + hai mức chắc (can't see… / may well). A, B chỉ là Yes / No; D chưa trả lời." },
          { q: "“In the short term prices will stay high, ___ in the long run they are bound to fall.”", options: ["because", "whereas", "so", "unless"], correct: 1, why: "Tương phản hai mốc thời gian ⇒ whereas (hoặc but / while)." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Kho ý cho bốn chủ đề dự đoán hay gặp" },
      {
        t: "table",
        head: ["Chủ đề", "Gần như chắc (bậc 6–7)", "Có thể (bậc 3–4)", "Khó xảy ra (bậc 1–2)"],
        rows: [
          ["**Work**", "hybrid working becomes the norm · people retire later", "a four-day week in some industries · some professions disappear", "offices vanish completely · machines replace carers and teachers"],
          ["**Cities**", "more people live in cities · housing gets denser", "private cars are banned from centres · more green roofs", "big cities empty out as people move to the countryside"],
          ["**Education**", "more learning happens online · people retrain several times", "degrees get shorter · exams are replaced by project work", "schools and classrooms disappear"],
          ["**Shopping & money**", "cash is used far less · delivery gets faster", "high streets turn into housing and leisure space", "physical shops disappear altogether"],
        ],
        caption: "Đây là ý để NÓI, không phải sự thật để thuộc. Giám khảo chấm cách bạn diễn đạt mức độ, không chấm dự đoán đúng hay sai.",
      },
      {
        t: "examples",
        items: [
          { en: "I can't see classrooms disappearing, to be honest. What's more likely is that a lot of the content will be delivered online, while class time is used for discussion. That said, it depends on whether schools can afford the technology.", vi: "Thật lòng tôi không hình dung được lớp học sẽ biến mất. Khả năng cao hơn là phần lớn nội dung sẽ được truyền tải trực tuyến, còn giờ trên lớp dùng để thảo luận. Dù vậy, còn tuỳ vào việc trường có đủ tiền cho công nghệ hay không." },
          { en: "Given that land in the centre is so expensive, housing is bound to get denser. In the long run we may well see far fewer private cars as well, provided that public transport improves.", vi: "Vì đất ở trung tâm quá đắt, nhà ở chắc chắn sẽ dày đặc hơn. Về lâu dài rất có thể ta cũng sẽ thấy ít xe cá nhân hơn hẳn, miễn là giao thông công cộng được cải thiện." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: nối âm /j/ và /w/ giữa hai nguyên âm" },
      {
        t: "p",
        text: "Tập 2 Ngày 23 và Tập 3 Ngày 22 đã luyện nối **phụ âm → nguyên âm** (picked‿up). Còn khi một từ **kết thúc bằng nguyên âm** và từ sau **bắt đầu bằng nguyên âm** thì sao? Tiếng Anh không ngắt hơi ở giữa — miệng tự lướt qua một âm nhỏ: ==/j/== (như chữ y trong **yes**) hoặc ==/w/== (như **we**). Âm lướt này rất nhẹ; bạn không “thêm” nó vào, chỉ cần **không dừng** giữa hai từ là nó tự xuất hiện.",
      },
      {
        t: "table",
        head: ["Từ trước kết thúc bằng", "Âm lướt", "Ví dụ", "Nghe như"],
        rows: [
          ["/iː/ /ɪ/ /eɪ/ /aɪ/ /ɔɪ/ (môi **dẹt**)", "**/j/**", "I‿agree · the‿end · may‿actually · say‿it · very‿often · they‿are · be‿able", "ai-**y**ơ-gri · dhi-**y**end · mây-**y**ac-chu-ơ-li"],
          ["/uː/ /ʊ/ /əʊ/ /aʊ/ (môi **tròn**)", "**/w/**", "go‿on · do‿it · who‿is · how‿often · so‿in · to‿improve · knew‿anything", "gâu-**w**on · đu-**w**it · hu-**w**iz"],
          ["/ə/ /ɔː/ /ɑː/ + chữ **r** trong chính tả", "**/r/** (linking r — đã học ở Tập 3)", "far‿away · for‿example · more‿of · there‿is", "fa-**r**ơ-wây · fơ-**r**ig-zam-pl"],
        ],
        caption: "Quy tắc nhớ: môi đang dẹt (như cười) ⇒ lướt /j/; môi đang tròn ⇒ lướt /w/.",
      },
      {
        t: "note",
        title: "💡 Mẹo luyện nối /j/ /w/",
        items: [
          "**the** trước nguyên âm đọc **/ði/** (the‿end, the‿economy) ⇒ luôn nối /j/. **to** trước nguyên âm đọc **/tu/** (to‿adapt, to‿improve) ⇒ nối /w/.",
          "Tập với ba cặp trước: **I‿am** /aɪjæm/ · **do‿it** /duːwɪt/ · **go‿out** /ɡəʊwaʊt/. Đọc chậm rồi nhanh dần; không chêm khoảng lặng.",
          "Không đọc âm lướt **mạnh** như một phụ âm thật (~~I yagree~~). Nó chỉ là đường lướt của lưỡi và môi.",
          "Người Việt hay **ngắt tắc thanh hầu** giữa hai nguyên âm (I | agree). Ghi âm, nghe lại: nếu nghe thấy “khựng” là chưa nối.",
          "Trong chính các cụm hedging hôm nay: I‿(j)expect · may‿(j)actually · so‿(w)in the long run · who‿(w)are likely to.",
        ],
      },
      { t: "rule", formula: "…/iː ɪ eɪ aɪ ɔɪ/ + nguyên âm ⇒ lướt /j/: I‿agree · the‿end   |   …/uː ʊ əʊ aʊ/ + nguyên âm ⇒ lướt /w/: go‿on · do‿it", vi: "Không dừng giữa hai nguyên âm; môi dẹt lướt /j/, môi tròn lướt /w/." },
      {
        t: "phatam",
        id: "t4d7-phat-am",
        title: "Luyện phát âm — nối âm /j/ và /w/",
        note: "Câu 1–3: nối /j/. Câu 4–6: nối /w/. Câu 7–8: trộn cả hai. Đọc liền một hơi; máy chấm từng từ — nếu từ thứ hai bị điểm thấp, thường là do bạn ngắt trước nó.",
        items: [
          { text: "I agree that the answer is unclear.", ipa: "aɪ əɡriː ðət ði ɑːnsər ɪz ʌnklɪə", vi: "Tôi đồng ý rằng câu trả lời chưa rõ. (I‿agree · the‿answer)" },
          { text: "It may actually be easier in the end.", ipa: "ɪt meɪ æktʃuəli bi iːziər ɪn ði end", vi: "Rốt cuộc việc đó có khi lại dễ hơn. (may‿actually · be‿easier · the‿end)" },
          { text: "They are very often the only option.", ipa: "ðeɪ ə veri ɒfn ði əʊnli ɒpʃn", vi: "Chúng rất thường là lựa chọn duy nhất. (They‿are · very‿often · the‿only · only‿option)" },
          { text: "Who is going to pay for it?", ipa: "huː ɪz ɡəʊɪŋ tə peɪ fər ɪt", vi: "Ai sẽ trả tiền cho việc đó? (Who‿is · go‿ing)" },
          { text: "How often do we go out?", ipa: "haʊ ɒfn du wi ɡəʊ aʊt", vi: "Chúng ta ra ngoài thường xuyên cỡ nào? (How‿often · go‿out)" },
          { text: "So in the long run, nobody knew anything.", ipa: "səʊ ɪn ðə lɒŋ rʌn nəʊbədi njuː eniθɪŋ", vi: "Vậy nên về lâu dài, chẳng ai biết gì cả. (So‿in · knew‿anything)" },
          { text: "I expect the economy to improve.", ipa: "aɪ ɪkspekt ði ɪkɒnəmi tu ɪmpruːv", vi: "Tôi cho rằng nền kinh tế sẽ khá lên. (I‿expect · the‿economy · to‿improve)" },
          { text: "Very few of us can say exactly how it will end.", ipa: "veri fjuː əv əs kən seɪ ɪɡzæktli haʊ ɪt wɪl end", vi: "Rất ít người trong chúng ta nói được chính xác nó sẽ kết thúc ra sao. (few‿of · say‿exactly · how‿it)" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói Part 3 — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu **40–50 giây**, theo khung 4 bước. Trước khi bấm ghi, viết ra giấy ba chữ: **dự đoán chính** · **trục tách** (thời gian / nhóm / phần đổi – phần không) · **điều kiện**. Nghe lại bản ghi và đếm: bao nhiêu **bậc chắc chắn khác nhau** (mục tiêu ≥ 2), có **căn cứ** không, có câu **That said / It depends on whether** không.",
      },
      {
        t: "speak",
        id: "t4d7-noi-p3",
        part: "3",
        questions: [
          "How do you think the way people work will change in the next twenty years?",
          "Do you think printed books will disappear one day?",
          "What will cities be like in fifty years' time?",
          "Is it likely that people will work fewer hours in the future?",
        ],
      },
      {
        t: "speak",
        id: "t4d7-noi-p3-2",
        part: "3",
        questions: [
          "Will machines ever replace teachers?",
          "How will the way people shop change over the next few decades?",
          "Do you think people will live longer in the future, and will that be a good thing?",
          "Is the gap between rich and poor countries likely to get smaller?",
        ],
      },
      {
        t: "note",
        title: "💡 Ghi vào Sổ Speaking sau khi luyện",
        items: [
          "Chép lại **một** câu trả lời của bạn; gạch dưới mọi **will**. Đổi ít nhất hai cái thành bậc khác (is likely to / may well / I doubt whether).",
          "Ghi sáu cụm rào đón bạn chọn ở mục 3 (mỗi hàng một cụm) lên đầu trang — đó là “bộ đồ nghề” dự đoán của bạn.",
          "Ngày mai tự hỏi lại câu 3 của khối thứ hai và trả lời **không nhìn ghi chú**; kiểm: có tách thời gian / nhóm không?",
          "Sai phần này ở bài kiểm tra chặng (Ngày 12) ⇒ quay lại mục 2 và mục 4 của bài này.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t4d7-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 7 — câu chẻ · đảo ngữ · giới từ phụ thuộc · trắc nghiệm Passage 3 · dự đoán có mức độ · nối âm /j/ /w/",
    goal: "Ôn trọn Ngày 7: viết lại câu bằng It-cleft / Wh-cleft và sáu nhóm đảo ngữ không lỗi, điền đúng giới từ phụ thuộc trong câu chẻ, làm một bài đọc ngắn có câu hỏi mục đích – quan điểm – Choose TWO, chọn đúng bậc chắc chắn cho câu dự đoán, nhận ra chỗ nối /j/ /w/, rồi ghi âm hai câu Part 3.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (49 câu + 1 lượt nói)",
        items: [
          "**I–IV (26 câu)** — ngữ pháp: câu chẻ, đảo ngữ, chọn câu đúng, giới từ phụ thuộc.",
          "**V (5 câu)** — dịch Việt → Anh câu Task 2 có cleft / đảo ngữ.",
          "**VI (4 câu, 5 điểm)** — đọc: mục đích · chi tiết · quan điểm · Choose TWO.",
          "**VII (10 câu)** — dự đoán có mức độ: điền cụm + chọn cách nói.",
          "**VIII (4 câu)** — nối âm /j/ /w/.",
          "**IX** — ghi âm hai câu Part 3 dự đoán, AI chấm. Mục tiêu cả bài: ≥ 39/49 (80 %).",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 7 trong một hình",
        center: "Nhấn đúng chỗ · nói đúng mức",
        branches: [
          { label: "Câu chẻ", items: ["It is X that…", "What… is…", "All… is… / The reason… is that…"] },
          { label: "Đảo ngữ", items: ["Rarely / Never / Not until / Only when…", "Not only… but… also", "Should / Were / Had…"] },
          { label: "Đọc Passage 3", items: ["6 kiểu câu hỏi", "7 loại bẫy", "Choose TWO = 5 câu ✓ ✗ ?"] },
          { label: "Dự đoán", items: ["Thang 7 bậc", "Khung 4 bước", "That said, it depends on whether…"] },
          { label: "Phát âm", items: ["I‿(j)agree", "go‿(w)on"] },
        ],
      },

      { t: "h", text: "I. Viết lại bằng câu chẻ (6 câu) — ôn Ngữ pháp mục 2–3" },
      {
        t: "quiz",
        id: "t4d7-bt-che",
        kind: "fill",
        title: "I. Gõ CẢ câu, bắt đầu bằng từ cho sẵn",
        items: [
          { q: "Advertising persuades children to want unhealthy food. → It is ___", answers: ["It is advertising that persuades children to want unhealthy food."] },
          { q: "The city needs a reliable bus network. → What ___", answers: ["What the city needs is a reliable bus network."] },
          { q: "The university raised its fees. → What the university did ___", answers: ["What the university did was raise its fees.", "What the university did was to raise its fees."] },
          { q: "The town's first railway station opened in 1830. → It was in ___", answers: ["It was in 1830 that the town's first railway station opened."] },
          { q: "People move to cities because wages are higher there. → The reason why ___", answers: ["The reason why people move to cities is that wages are higher there."] },
          { q: "Residents only want a quiet street. → All ___", answers: ["All residents want is a quiet street.", "All that residents want is a quiet street.", "All the residents want is a quiet street.", "All that the residents want is a quiet street."] },
        ],
      },

      { t: "h", text: "II. Đảo ngữ — điền phần còn thiếu (8 câu) — ôn Ngữ pháp mục 6–8" },
      {
        t: "quiz",
        id: "t4d7-bt-dao",
        kind: "fill",
        title: "II. Điền 2–4 từ để câu thứ hai cùng nghĩa với câu thứ nhất",
        items: [
          { q: "Politicians rarely keep all their promises. → Rarely ___ all their promises.", answers: ["do politicians keep"] },
          { q: "The scheme saves money and it also creates jobs. → Not only ___ money, but it also creates jobs.", answers: ["does the scheme save"] },
          { q: "The public learned the truth only when the report was published. → Only when the report was published ___ the truth.", answers: ["did the public learn"] },
          { q: "If the company had listened to its staff, the strike would not have happened. → ___ to its staff, the strike would not have happened.", answers: ["Had the company listened"] },
          { q: "Unemployment has never been so low. → Never ___ so low.", answers: ["has unemployment been"] },
          { q: "If the rent increased again, many shops would close. → ___ increase again, many shops would close.", answers: ["Were the rent to"] },
          { q: "You must not share your password in any circumstances. → Under no circumstances ___ your password.", answers: ["should you share", "must you share"] },
          { q: "As soon as the law had been passed, companies found ways around it. → No sooner ___ passed than companies found ways around it.", answers: ["had the law been"] },
        ],
      },

      { t: "h", text: "III. Chọn câu đúng (6 câu) — ôn các khung ⚠️" },
      {
        t: "mcq",
        id: "t4d7-bt-chon",
        title: "III. Chọn phương án đúng",
        items: [
          { q: "Chọn câu ĐÚNG.", options: ["It is in childhood where habits are formed.", "It is in childhood that habits are formed.", "It is childhood that habits are formed.", "It is in childhood which habits are formed."], correct: 1, why: "It is + trạng ngữ (in childhood) + that. Không dùng where / which." },
          { q: "What the government did ___ the minimum wage.", options: ["was raised", "was raising", "raised", "was raise"], correct: 3, why: "What + S + did + was + V nguyên mẫu (hoặc to raise)." },
          { q: "Not until the 1950s ___ common in ordinary homes.", options: ["did television become", "television became", "became television", "did television became"], correct: 0, why: "Not until + mốc ở đầu câu ⇒ did + S + V nguyên mẫu." },
          { q: "Chọn câu ĐÚNG.", options: ["Only when prices fell, people started buying.", "Only when did prices fall, people started buying.", "Only when prices fell did people start buying.", "Only when prices fell did people started buying."], correct: 2, why: "Mệnh đề sau Only when giữ trật tự thường; đảo ở mệnh đề chính với did + V nguyên mẫu." },
          { q: "The reform did not lower prices, ___ competition.", options: ["nor it increased", "nor did it increase", "neither it increased", "nor did it not increase"], correct: 1, why: "nor + trợ động từ + S + V (khẳng định)." },
          { q: "___ you have any questions, please contact the course office.", options: ["Had", "Were", "Did", "Should"], correct: 3, why: "Should + S + V = If you (should) have… (loại 1, trang trọng — email, thông báo)." },
        ],
      },

      { t: "h", text: "IV. Giới từ phụ thuộc (6 câu) — ôn Ngữ pháp mục 5" },
      {
        t: "quiz",
        id: "t4d7-bt-gioi-tu",
        kind: "fill",
        title: "IV. Điền MỘT giới từ",
        items: [
          { q: "It is ___ the quality of teachers that a school's results depend.", answers: ["on", "upon"] },
          { q: "What the charity focuses ___ is early education.", answers: ["on"] },
          { q: "Cheap flights have contributed ___ the growth of mass tourism.", answers: ["to"] },
          { q: "There is no simple solution ___ the housing shortage.", answers: ["to"] },
          { q: "The main reason ___ the decline was a fall in demand.", answers: ["for"] },
          { q: "What many families cannot cope ___ is the rising cost of childcare.", answers: ["with"] },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d7-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng cấu trúc cho trong ngoặc",
        grammar: "It is… that · What… is · Not only… but also · Only by… · Had…",
        items: [
          { q: "(It is… that) Chính giáo dục, chứ không phải hình phạt, mới giảm được tội phạm.", answers: ["It is education, not punishment, that reduces crime.", "It is education, rather than punishment, that reduces crime.", "It is education rather than punishment that reduces crime.", "It is education, not punishment, that can reduce crime."], hint: "It is education, not punishment, that…" },
          { q: "(What… is) Điều người lao động muốn là giờ làm linh hoạt.", answers: ["What workers want is flexible working hours.", "What employees want is flexible working hours.", "What workers want is flexible hours.", "What employees want is flexible hours.", "What workers want are flexible working hours."], hint: "What workers want is…" },
          { q: "(Not only) Ô nhiễm không khí không chỉ hại sức khoẻ mà còn làm giảm năng suất.", answers: ["Not only does air pollution harm health, but it also reduces productivity.", "Not only does air pollution harm health but it also reduces productivity.", "Not only does air pollution damage health, but it also reduces productivity.", "Not only does air pollution harm people's health, but it also reduces productivity.", "Not only does air pollution harm health, it also reduces productivity."], hint: "Not only does air pollution harm…, but it also reduces…" },
          { q: "(Only by) Chỉ bằng cách hợp tác thì các nước mới giải quyết được biến đổi khí hậu.", answers: ["Only by cooperating can countries solve climate change.", "Only by working together can countries solve climate change.", "Only by cooperating can countries tackle climate change.", "Only by working together can countries tackle climate change.", "Only by cooperating can nations solve climate change.", "Only by working together can nations tackle climate change."], hint: "Only by working together can countries…" },
          { q: "(Had) Nếu con đường được xây sớm hơn, thị trấn hẳn đã phát triển nhanh hơn.", answers: ["Had the road been built earlier, the town would have developed faster.", "Had the road been built earlier, the town would have grown faster.", "Had the road been built sooner, the town would have developed faster.", "Had the road been built earlier, the town would have developed more quickly.", "Had the road been built sooner, the town would have grown faster."], hint: "Had the road been built earlier, the town would have…" },
        ],
      },

      { t: "h", text: "VI. Đọc — mục đích · chi tiết · quan điểm · Choose TWO (4 câu, 5 điểm) — ôn bài Đọc mục 2–6" },
      {
        t: "passage",
        title: "Why Confident Forecasts Fail",
        intro: "Bài tự soạn (khoảng 230 từ). Làm trong 6 phút.",
        paras: [
          { text: "For twenty years, one long-running study collected predictions from several hundred political and economic commentators — more than eighty thousand forecasts in all — and then waited to see what actually happened. The results were not flattering. On average, the specialists did little better than someone choosing at random, and those who appeared most often in the media performed worst of all. It was not knowledge that separated good forecasters from bad ones, since all of them were well informed. What mattered was their style of thinking. The poorest forecasters explained everything by means of one big idea and were seldom troubled by doubt; the best drew on many sources, spoke in terms of probabilities and, crucially, changed their minds when the evidence changed." },
          { text: "Why, then, do confident voices dominate television? The researcher's answer was that a cautious forecast makes dull viewing. An audience wants to be told what will happen, not that an outcome is ‘sixty per cent likely’. Not only does this reward overconfidence, but it also means that the public rarely hears from the people most worth listening to. None of this shows that prediction is pointless. Short-range forecasts, particularly when they are checked against results and corrected, can be surprisingly reliable. It does suggest, however, that the certainty with which a prediction is delivered tells us nothing about whether it is right." },
        ],
      },
      {
        t: "mcq",
        id: "t4d7-bt-doc-mot",
        title: "VI. Questions 1–3 — Choose the correct letter, A, B, C or D",
        items: [
          { q: "1. According to the passage, the best forecasters differed from the worst in", options: ["the amount they knew about their subject.", "how frequently they appeared in the media.", "the way in which they reasoned.", "the topics they chose to make predictions about."], correct: 2, why: "“It was not knowledge that separated good forecasters from bad ones… What mattered was their style of thinking.” the way they reasoned = style of thinking. A trái bài (câu chẻ phủ định: It was NOT knowledge). B: xuất hiện nhiều trên truyền thông gắn với người dự đoán KÉM, và không phải điều tạo ra khác biệt. D không nhắc." },
          { q: "2. The writer mentions the phrase ‘sixty per cent likely’ in order to", options: ["show that most forecasts turn out to be accurate.", "give an example of the kind of statement audiences find unappealing.", "explain how forecasters calculate probabilities.", "criticise the methods used in the study."], correct: 1, why: "Đọc ngược lên: “a cautious forecast makes dull viewing. An audience wants to be told what will happen, not that…” ⇒ ví dụ cho kiểu phát biểu thận trọng mà khán giả không thích. A trái bài. C, D không nhắc." },
          { q: "3. Which statement best expresses the writer's view of prediction?", options: ["It can be useful, but a forecaster's confidence is no guide to accuracy.", "It is a waste of time because experts do no better than chance.", "It should be left to commentators who appear in the media.", "It is only reliable when it concerns the distant future."], correct: 0, why: "“None of this shows that prediction is pointless” + “Short-range forecasts… can be surprisingly reliable” + câu cuối “the certainty… tells us nothing about whether it is right”. B: nửa sau có trong bài nhưng kết luận “waste of time” bị người viết chặn trước (đúng một nửa). C trái bài. D trái bài: short-range mới đáng tin." },
        ],
      },
      { t: "p", text: "**Questions 4 and 5.** Choose **TWO** letters, **A–E**. **Which TWO characteristics of the best forecasters are mentioned?** — **A** They relied on a single powerful theory. **B** They used information from a variety of places. **C** They appeared frequently in the media. **D** They were willing to revise their opinions. **E** They knew more than other forecasters." },
      {
        t: "quiz",
        id: "t4d7-bt-doc-hai",
        kind: "fill",
        title: "VI. Questions 4–5 — Choose TWO letters, A–E (gõ hai chữ cái)",
        items: [{ q: "(4–5) Two characteristics: ___", answers: ["B D", "BD", "B and D", "B & D", "B/D", "B + D", "B-D", "B, D", "D B", "DB", "D and B", "D & B", "D/B", "D + B", "D-B", "D, B"] }],
      },
      {
        t: "note",
        title: "Giải thích câu 4–5",
        items: [
          "**B ✓** — “the best **drew on many sources**” (used information from a variety of places).",
          "**D ✓** — “**changed their minds when the evidence changed**” (were willing to revise their opinions).",
          "**A ✗** — “one big idea” là đặc điểm của người dự đoán **kém nhất** (sai chủ). **C ✗** — người xuất hiện nhiều trên truyền thông “performed worst of all”. **E ✗** — “all of them were well informed” ⇒ không ai biết nhiều hơn ai.",
        ],
      },

      { t: "h", text: "VII. Dự đoán có mức độ (10 câu) — ôn bài Nói mục 2–4" },
      {
        t: "quiz",
        id: "t4d7-bt-hedge",
        kind: "fill",
        title: "VII-a. Điền MỘT từ vào mỗi chỗ trống (6 câu)",
        items: [
          { q: "With so many people shopping online, small shops are ___ to struggle. (≈ 70 %, bắt đầu bằng l)", answers: ["likely"] },
          { q: "Some town centres may ___ be turned into housing. (“rất có thể”)", answers: ["well"] },
          { q: "I ___ whether people will ever give up their cars completely. (“tôi không tin là”)", answers: ["doubt"] },
          { q: "As the population ages, health spending is ___ to rise. (≈ 100 %, bắt đầu bằng b)", answers: ["bound"] },
          { q: "___ by what has happened in Japan, robots will be used more and more in care homes. (đặt căn cứ)", answers: ["Judging"] },
          { q: "That said, it all depends on ___ governments are prepared to pay for it. (“liệu… hay không”)", answers: ["whether", "if"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d7-bt-hedge-chon",
        title: "VII-b. Chọn cách nói hợp nhất (4 câu)",
        items: [
          { q: "Bạn tin khoảng 15 % rằng trường học sẽ biến mất. Chọn câu hợp nhất.", options: ["Schools are bound to disappear.", "Schools may well disappear.", "Schools will probably disappear.", "Schools are unlikely to disappear."], correct: 3, why: "≈ 15 % = bậc 2: be unlikely to. bound (bậc 7), may well (bậc 4), will probably (bậc 5) đều quá cao." },
          { q: "Chọn câu ĐÚNG.", options: ["It's likely that more people will live alone.", "It's likely more people to live alone.", "More people is likely to live alone.", "More people are likely live alone."], correct: 0, why: "It is likely THAT + S + will + V / S + are likely TO + V." },
          { q: "Câu nào tách thời gian đúng kiểu band 7?", options: ["In the future it will change a lot.", "In the short term little will change, whereas in the long run most payments will probably be digital.", "Now it is like this and the future it is like that.", "Maybe it changes, maybe not."], correct: 1, why: "Hai mốc (short term / long run) + từ nối tương phản + hai mức chắc khác nhau." },
          { q: "“___ is that most people will keep their jobs but use different tools.”", options: ["What I think will happen", "It depends", "Judging by", "I doubt whether"], correct: 0, why: "Wh-cleft mở dự đoán chính: What I think will happen is that + mệnh đề." },
        ],
      },

      { t: "h", text: "VIII. Nối âm /j/ hay /w/? (4 câu) — ôn bài Nói mục 7" },
      {
        t: "mcq",
        id: "t4d7-bt-noi-am",
        title: "VIII. Giữa hai từ in đậm, miệng lướt qua âm nào?",
        items: [
          { q: "**go on** — “Prices will go on rising.”", options: ["/j/", "/w/", "/r/", "không nối"], correct: 1, why: "go kết thúc bằng /əʊ/ (môi tròn) + nguyên âm ⇒ lướt /w/: go‿(w)on." },
          { q: "**the end** — “in the end”", options: ["/j/", "/w/", "/r/", "không nối"], correct: 0, why: "the trước nguyên âm đọc /ði/ (môi dẹt) ⇒ lướt /j/: the‿(j)end." },
          { q: "**may actually** — “It may actually help.”", options: ["/w/", "/r/", "/j/", "không nối"], correct: 2, why: "may kết thúc bằng /eɪ/ ⇒ lướt /j/: may‿(j)actually." },
          { q: "**to improve** — “likely to improve”", options: ["/j/", "/r/", "không nối", "/w/"], correct: 3, why: "to trước nguyên âm đọc /tu/ (môi tròn) ⇒ lướt /w/: to‿(w)improve." },
        ],
      },

      { t: "h", text: "IX. Nói 2 câu Part 3 dự đoán — ghi âm, AI chấm" },
      {
        t: "p",
        text: "Mỗi câu 40–50 giây, đủ 4 bước: mở có mức độ → dự đoán + căn cứ → tách thời gian / nhóm → điều kiện. Dùng ít nhất **một câu chẻ** (What I think will happen is… / What I'm less sure about is…) và **hai bậc chắc chắn** khác nhau.",
      },
      {
        t: "speak",
        id: "t4d7-bt-noi",
        part: "3",
        questions: [
          "Do you think people will still go to cinemas in thirty years' time?",
          "How is the way children learn likely to change in the future?",
        ],
      },
      {
        t: "note",
        title: "💡 Chấm xong thì làm gì",
        items: [
          "Sai ≥ 3 câu ở phần I–III ⇒ đọc lại các khung ⚠️ ở Ngữ pháp mục 2, 3, 6 và làm lại bài viết lại câu ở mục 10.",
          "Sai ≥ 2 điểm ở phần VI ⇒ đọc lại bảng 7 loại bẫy (bài Đọc mục 4) và ghi tên bẫy đã lừa bạn vào Sổ lỗi.",
          "Sai ≥ 3 câu ở phần VII ⇒ chép lại thang 7 bậc (bài Nói mục 2) và đặt một câu của riêng bạn cho mỗi bậc.",
          "Ghi năm câu sai còn lại vào **Sổ lỗi** — bài kiểm tra chặng Ngày 12 sẽ hỏi lại cleft, đảo ngữ và dự đoán có mức độ.",
        ],
      },
    ],
  },
];
