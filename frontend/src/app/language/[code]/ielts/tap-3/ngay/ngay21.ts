/**
 * IELTS Tập 3 — Ngày 21 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Nhượng bộ / đối lập (although · even though · despite · in spite of · whereas · while · however ·
 *                     nevertheless) + nguyên nhân – kết quả (because of · due to · owing to · as a result · lead to ·
 *                     result in · result from)                                                          [G29, ôn G18 VD6]
 *                     — nối Tập 2 Ngày 17 (từ nối cấp câu & cấp đoạn), Tập 3 Ngày 10 (nhượng bộ khi nói)
 *   Bài 2 (reading)   Matching features 2 — nối nhận định với nhà nghiên cứu; bài đọc ~840 từ, 13 câu           [R04]
 *                     — nối Tập 1 Ngày 10 (Matching features nhập môn)
 *   Bài 3 (listening) Đề Listening đủ 40 câu lần 1 của Tập 3, đúng giờ (Part 1–4)                              [L03–L06]
 *                     — nối Tập 2 Ngày 23 (đề 40 câu đầu tiên) · 🔊 /ð/ trong although / whereas
 *   Bài tập Ngày 21   41 câu có đáp án
 * Mọi id bắt đầu `t3d21-`.
 */
import type { Lesson } from '../data';

export const NGAY_21: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t3d21-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Nhượng bộ / đối lập + nguyên nhân – kết quả — although, despite, whereas, due to, lead to",
    goal: "Viết và nói đúng câu nhượng bộ (although / even though + mệnh đề; despite / in spite of + danh từ / V-ing), câu đối lập (whereas / while; however / nevertheless đúng dấu câu) và câu nhân quả (because of / due to / owing to + danh từ; as a result / therefore; lead to / result in / result from đúng chiều), đổi qua lại giữa mệnh đề và cụm danh từ — đẩy GRA band 6 (trộn câu đơn + câu phức) và CC (từ nối đủ loại, không lặp but / because / so) cho Task 1, Task 2 và Part 3.",
    minutes: 95,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Nhượng bộ** (concession) = “mặc dù A, vẫn B”. Hai họ: ==although / even though / though + mệnh đề== và ==despite / in spite of + danh từ / V-ing==. Lỗi số 1 của người Việt: ~~Although…, but…~~ và ~~despite of~~.",
          "**Đối lập** (contrast) = đặt hai thứ khác nhau cạnh nhau: ==whereas / while== (trong một câu) · ==In contrast, / By contrast, / However,== (giữa hai câu). Đây là công cụ so sánh chính của **Task 1**.",
          "**Nguyên nhân**: because / since / as + mệnh đề ↔ ==because of / due to / owing to / as a result of + danh từ==. **Kết quả**: so · Therefore, · As a result, · Consequently, · …, which means that…",
          "**Động từ nhân quả** có CHIỀU: nguyên nhân ==leads to / results in / causes== kết quả; kết quả ==results from / stems from / is caused by== nguyên nhân. Sai giới từ là đảo ngược nghĩa.",
          "Kỹ năng band 6: **đổi cấu trúc** cùng một ý — Although it rained → Despite the rain. Đây cũng là kiểu paraphrase đề Reading hay dùng (bài 2 hôm nay).",
          "Tập 2 Ngày 17 đã dạy and / but / so / because / although / However ở mức nhận ra và dùng đúng vai. Hôm nay mở rộng đủ cả họ và dùng trong đoạn văn. Tiêu chí được đẩy: **GRA + CC** (Writing), **GRA + FC** (Speaking).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 17: bốn quan hệ, hai tầng nối" },
      {
        t: "p",
        text: "Từ nối cho biết **quan hệ** giữa hai ý. Hôm nay ta làm việc với bốn quan hệ: **nhượng bộ** (A không ngăn được B), **đối lập** (A khác B), **nguyên nhân** (vì A) và **kết quả** (nên B). Mỗi quan hệ có thể nối ở **hai tầng**: trong MỘT câu (liên từ, giới từ) hoặc giữa HAI câu (trạng từ liên kết đứng đầu câu, sau có dấu phẩy). Tập 2 dạy mỗi quan hệ một – hai từ; band 6 cần biết cả họ để không lặp.",
      },
      {
        t: "table",
        head: ["Quan hệ", "Band 5 (Tập 2)", "Thêm hôm nay — band 6"],
        rows: [
          ["Nhượng bộ", "but · although", "even though · though · while · despite · in spite of · nevertheless · even so"],
          ["Đối lập", "but · However,", "whereas · while · In contrast, · By contrast, · On the other hand,"],
          ["Nguyên nhân", "because · because of", "since · as · due to · owing to · as a result of · result from · stem from"],
          ["Kết quả", "so · Therefore,", "As a result, · Consequently, · …, which means that · lead to · result in · …, leading to"],
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Ba loại từ nối — ba kiểu dấu câu",
        cols: [
          { title: "Liên từ + MỆNH ĐỀ", items: ["although · even though · whereas · while · because · since · as", "Sau nó phải có **S + V**", "**Although it is** expensive, many people buy it.", "Mệnh đề phụ đứng đầu ⇒ có dấu phẩy"] },
          { title: "Giới từ + DANH TỪ / V-ing", items: ["despite · in spite of · because of · due to · owing to", "Sau nó KHÔNG có S + V", "**Despite its** high price, many people buy it.", "Cụm đứng đầu ⇒ có dấu phẩy"] },
          { title: "Trạng từ nối HAI CÂU", items: ["However, · Nevertheless, · In contrast, · Therefore, · As a result,", "Đứng sau dấu chấm hoặc chấm phẩy", "It is expensive**. However,** many people buy it.", "Luôn có dấu phẩy ngay sau"] },
        ],
        caption: "Trước khi viết một từ nối, tự hỏi: sau nó là mệnh đề, cụm danh từ, hay một câu mới?",
      },
      {
        t: "quiz",
        id: "t3d21-on-tu-noi",
        kind: "fill",
        title: "Kiểm tra đầu bài — điền but · although · because · so · however · because of (6 câu, mỗi từ một lần)",
        items: [
          { q: "1. The flat is small, ___ it is close to the university.", answers: ["but"] },
          { q: "2. ___ the flat is small, the rent is quite high.", answers: ["although"] },
          { q: "3. Many students choose it ___ it is near the campus.", answers: ["because"] },
          { q: "4. The rent went up last year, ___ two tenants moved out.", answers: ["so"] },
          { q: "5. The flat is small. ___, it has a large balcony.", answers: ["however"] },
          { q: "6. Two tenants moved out ___ the higher rent.", answers: ["because of"] },
        ],
      },
      { t: "rule", formula: "liên từ + S + V  ·  giới từ + N / V-ing  ·  Trạng từ nối, + câu mới", vi: "Chọn từ nối theo thứ đứng SAU nó, không chỉ theo nghĩa." },

      /* ── 2 ── */
      { t: "h", text: "2. Nhượng bộ với mệnh đề: although · even though · though · while" },
      {
        t: "p",
        text: "Câu nhượng bộ nói: có một điều (A) khiến ta **tưởng** kết quả sẽ khác, nhưng điều ngược lại (B) vẫn xảy ra. Ý chính của câu luôn nằm ở mệnh đề **không** có although. **even though** mạnh hơn although (nhấn sự ngạc nhiên). **though** thân mật hơn, hay dùng khi nói, và có thể đứng **cuối câu** với nghĩa “nhưng mà”. **while** đứng đầu câu cũng mang nghĩa nhượng bộ (While I agree that…, I think…) — rất hợp cho mở bài và Part 3.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Although / Even though + S + V, S + V",
            vi: "Mặc dù A, (vẫn) B — mệnh đề phụ đứng đầu, có dấu phẩy",
            examples: [
              { en: "Although electric cars are becoming cheaper, most families still cannot afford one.", vi: "Mặc dù xe điện đang rẻ dần, phần lớn gia đình vẫn chưa mua nổi." },
              { en: "Even though the project had been planned for years, it failed within months.", vi: "Dù dự án đã được lên kế hoạch nhiều năm, nó vẫn thất bại trong vài tháng." },
            ],
          },
          {
            formula: "S + V + although / even though + S + V",
            vi: "Mệnh đề phụ đứng sau — thường không cần dấu phẩy",
            examples: [{ en: "Sales continued to rise even though prices had increased.", vi: "Doanh số tiếp tục tăng dù giá đã lên." }],
          },
          {
            formula: "While + S + V, S + V",
            vi: "Tuy A (tôi công nhận), nhưng B (ý của tôi) — hay dùng với agree / accept / it is true that",
            examples: [{ en: "While I accept that zoos educate children, I do not think that this justifies keeping large animals in cages.", vi: "Tuy tôi công nhận sở thú giáo dục trẻ em, tôi không cho rằng điều đó biện minh cho việc nhốt thú lớn trong chuồng." }],
          },
          {
            formula: "S + V. S + V, though.",
            vi: "though cuối câu (khi nói) = “nhưng mà…”",
            examples: [{ en: "I'd love to live abroad. I'd miss my family, though.", vi: "Tôi rất muốn sống ở nước ngoài. Nhưng mà tôi sẽ nhớ gia đình." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với although",
        items: [
          "~~Although it was raining, but we went out.~~ ⇒ Tiếng Việt nói “mặc dù… nhưng…”, tiếng Anh chỉ dùng MỘT trong hai: **Although it was raining, we went out.** hoặc **It was raining, but we went out.**",
          "~~Although the high cost, people buy it.~~ ⇒ although cần mệnh đề: **Although the cost is high,…** (muốn dùng danh từ thì đổi sang despite — mục 3).",
          "~~Although, the cost is high.~~ ⇒ although KHÔNG đứng một mình rồi dấu phẩy như However. Câu chỉ có mệnh đề although là câu cụt (fragment).",
          "~~Even it was late, he kept working.~~ ⇒ even không phải liên từ. Phải là **even though** (sự thật) hoặc **even if** (giả định: Even if it rains tomorrow, we will go).",
          "Ý chính đặt SAI chỗ: “Although I think zoos are cruel, they educate children” ⇒ người đọc hiểu bạn **ủng hộ** sở thú. Ý của bạn phải nằm ở mệnh đề chính.",
        ],
      },
      { t: "rule", formula: "Although / Even though / While + S + V, S + V", vi: "Một câu chỉ có although HOẶC but. Ý mình muốn nhấn đặt ở mệnh đề chính." },
      {
        t: "quiz",
        id: "t3d21-although-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — nhượng bộ với mệnh đề (4 câu)",
        grammar: "Although / Even though / While + S + V, S + V",
        items: [
          { q: "Mặc dù thành phố có nhiều công viên, chất lượng không khí vẫn kém.", answers: ["Although the city has many parks, the air quality is still poor.", "Although the city has a lot of parks, the air quality is still poor.", "Even though the city has many parks, the air quality is still poor.", "Although the city has many parks, air quality is still poor."], hint: "although · air quality · poor" },
          { q: "Anh ấy được nhận việc dù không có kinh nghiệm.", answers: ["He got the job even though he had no experience.", "He got the job although he had no experience.", "He got the job even though he did not have any experience.", "He got the job even though he didn't have any experience."], hint: "even though · got the job · experience" },
          { q: "Tuy tôi đồng ý rằng công nghệ tiết kiệm thời gian, tôi nghĩ nó cũng khiến chúng ta lười hơn.", answers: ["While I agree that technology saves time, I think it also makes us lazier.", "While I agree that technology saves time, I think that it also makes us lazier.", "Although I agree that technology saves time, I think it also makes us lazier."], hint: "While I agree that · save time · lazier" },
          { q: "Số người đi xe buýt giảm mặc dù giá vé đã được giảm.", answers: ["The number of bus passengers fell although fares had been reduced.", "The number of bus passengers fell even though fares had been reduced.", "The number of bus users fell although fares had been reduced.", "The number of people using buses fell although fares had been reduced.", "The number of bus passengers fell although the fares had been reduced.", "The number of bus passengers decreased although fares had been reduced."], hint: "the number of bus passengers · fall · fares · had been reduced" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Nhượng bộ với cụm danh từ: despite · in spite of" },
      {
        t: "p",
        text: "**despite** và **in spite of** cùng nghĩa với although nhưng là **giới từ**: sau chúng là danh từ, đại từ hoặc **V-ing**, không bao giờ là S + V. Hai từ này làm câu gọn và “học thuật” hơn, nên rất được việc trong Task 1 (Despite a fall in 2015, …) và Task 2. Nếu vẫn muốn giữ nguyên một mệnh đề, thêm cầu nối **the fact that**.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Despite / In spite of + N, S + V",
            vi: "Mặc dù / bất chấp + danh từ",
            examples: [
              { en: "Despite the heavy rain, the match went ahead.", vi: "Bất chấp mưa to, trận đấu vẫn diễn ra." },
              { en: "In spite of a brief fall in 2015, car sales doubled over the period.", vi: "Mặc dù giảm nhẹ năm 2015, doanh số ô tô tăng gấp đôi trong cả giai đoạn." },
            ],
          },
          {
            formula: "Despite / In spite of + V-ing, S + V",
            vi: "Hai vế CÙNG chủ ngữ ⇒ dùng V-ing (phủ định: not + V-ing)",
            examples: [
              { en: "Despite working long hours, nurses are paid relatively little.", vi: "Dù làm việc nhiều giờ, y tá được trả lương khá thấp." },
              { en: "In spite of not having a degree, she became a successful engineer.", vi: "Dù không có bằng đại học, cô ấy trở thành một kỹ sư thành công." },
            ],
          },
          {
            formula: "Despite / In spite of + the fact that + S + V, S + V",
            vi: "Giữ nguyên mệnh đề — trang trọng, hơi dài; đừng lạm dụng",
            examples: [{ en: "Despite the fact that smoking is banned in public places, many people still smoke outside offices.", vi: "Mặc dù hút thuốc bị cấm ở nơi công cộng, nhiều người vẫn hút ngoài văn phòng." }],
          },
        ],
      },
      {
        t: "table",
        head: ["Mệnh đề (although)", "Cụm danh từ (despite)", "Cách đổi"],
        rows: [
          ["Although **it rained heavily**, …", "Despite **the heavy rain**, …", "động từ → danh từ; trạng từ → tính từ"],
          ["Although **prices rose**, …", "Despite **the rise in prices** / **rising prices**, …", "rise (v) → a rise in (n)"],
          ["Although **she was ill**, …", "Despite **her illness** / **being ill**, …", "be + adj → danh từ hoặc being + adj"],
          ["Although **he is young**, …", "Despite **his age** / **his youth**, …", "tính từ → danh từ + sở hữu"],
          ["Although **they tried hard**, …", "Despite **trying hard** / **their efforts**, …", "cùng chủ ngữ → V-ing"],
        ],
        caption: "Đổi mệnh đề thành cụm danh từ là kiểu paraphrase “đổi cấu trúc” — đề Reading và Listening dùng suốt.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với despite / in spite of",
        items: [
          "~~Despite of the rain~~ ⇒ **Despite the rain** hoặc **In spite of the rain**. despite KHÔNG có of; in spite luôn CÓ of. Mẹo: hai cụm có tổng cộng một chữ “of”.",
          "~~Despite it rained, we went out.~~ ⇒ sau despite không có S + V. Sửa: **Despite the rain,…** hoặc **Although it rained,…**",
          "~~Despite the rain, but we went out.~~ ⇒ giống although: không thêm but.",
          "~~Despite the weather was bad~~ ⇒ **Despite the bad weather** (tính từ đứng TRƯỚC danh từ).",
          "V-ing chỉ đúng khi hai vế cùng chủ ngữ: ~~Despite raining, we went out~~ (“chúng tôi” không mưa) ⇒ **Despite the rain, we went out.**",
        ],
      },
      { t: "rule", formula: "Despite / In spite of + N / V-ing / the fact that + S + V, S + V", vi: "despite không of · không S + V ngay sau · không kèm but." },
      {
        t: "quiz",
        id: "t3d21-despite-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng despite / in spite of (5 câu)",
        grammar: "Despite / In spite of + N / V-ing, S + V",
        items: [
          { q: "Bất chấp chi phí cao, nhiều sinh viên vẫn chọn du học.", answers: ["Despite the high cost, many students still choose to study abroad.", "In spite of the high cost, many students still choose to study abroad.", "Despite the high costs, many students still choose to study abroad.", "Despite the high cost, many students choose to study abroad."], hint: "despite · the high cost · study abroad" },
          { q: "Dù sống gần biển, anh ấy không biết bơi.", answers: ["Despite living near the sea, he cannot swim.", "In spite of living near the sea, he cannot swim.", "Despite living near the sea, he can't swim.", "In spite of living near the sea, he can't swim.", "Despite living by the sea, he cannot swim."], hint: "despite + V-ing · near the sea · cannot swim" },
          { q: "Mặc dù doanh số giảm, công ty vẫn có lãi.", answers: ["Despite the fall in sales, the company still made a profit.", "Despite the fall in sales, the company still makes a profit.", "In spite of the fall in sales, the company still made a profit.", "Despite the drop in sales, the company still made a profit.", "Despite the decline in sales, the company still made a profit.", "Despite falling sales, the company still made a profit."], hint: "despite · the fall in sales · make a profit" },
          { q: "Dù không nói được tiếng địa phương, cô ấy kết bạn rất nhanh.", answers: ["Despite not speaking the local language, she made friends quickly.", "In spite of not speaking the local language, she made friends quickly.", "Despite not speaking the local language, she made friends very quickly.", "Despite not being able to speak the local language, she made friends quickly."], hint: "despite not + V-ing · the local language · make friends" },
          { q: "Mặc dù thực tế là thành phố đã xây thêm đường, giao thông vẫn tệ hơn.", answers: ["Despite the fact that the city has built more roads, traffic has got worse.", "Despite the fact that the city has built more roads, traffic has become worse.", "In spite of the fact that the city has built more roads, traffic has got worse.", "Despite the fact that the city has built more roads, the traffic has got worse.", "Despite the fact that the city has built more roads, traffic is still worse.", "Despite the fact that the city built more roads, traffic got worse."], hint: "despite the fact that · has built more roads · traffic · get worse" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Đối lập trực tiếp: whereas · while · In contrast · On the other hand" },
      {
        t: "p",
        text: "Nhượng bộ và đối lập **khác nhau**. Nhượng bộ: cùng MỘT đối tượng, kết quả trái với mong đợi (Although he is rich, he is unhappy). Đối lập: HAI đối tượng khác nhau được đặt cạnh nhau, không có gì bất ngờ (He is rich, **whereas** his brother is poor). **whereas** chỉ dùng cho đối lập; **while** dùng được cho cả hai. Trong **Task 1**, whereas / while là cách gọn nhất để so hai nhóm số liệu trong một câu.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S1 + V, whereas / while + S2 + V",
            vi: "A thế này, còn B thế kia — có dấu phẩy trước whereas / while",
            examples: [
              { en: "Spending on housing rose to 35%, whereas the figure for food fell to 18%.", vi: "Chi cho nhà ở tăng lên 35 %, trong khi con số cho thực phẩm giảm còn 18 %." },
              { en: "Younger people tend to read the news online, while older adults still prefer television.", vi: "Người trẻ thường đọc tin trên mạng, còn người lớn tuổi vẫn thích tivi hơn." },
            ],
          },
          {
            formula: "Whereas / While + S1 + V, S2 + V",
            vi: "Đặt whereas đầu câu để nhấn vế thứ hai",
            examples: [{ en: "Whereas the north of the country is largely industrial, the south depends on farming.", vi: "Trong khi miền bắc chủ yếu là công nghiệp, miền nam sống nhờ nông nghiệp." }],
          },
          {
            formula: "S1 + V. In contrast, / By contrast, + S2 + V",
            vi: "Đối lập giữa hai câu — hai đối tượng khác nhau",
            examples: [{ en: "Car ownership in the city doubled. In contrast, the number of bicycles remained stable.", vi: "Số người có ô tô ở thành phố tăng gấp đôi. Ngược lại, số xe đạp giữ ổn định." }],
          },
          {
            formula: "On the one hand, S + V. On the other hand, S + V",
            vi: "Hai mặt của CÙNG một vấn đề (ưu – nhược) — dùng trong Task 2 / Part 3",
            examples: [{ en: "On the one hand, tourism creates jobs. On the other hand, it puts pressure on local wildlife.", vi: "Một mặt, du lịch tạo việc làm. Mặt khác, nó gây áp lực lên động vật hoang dã địa phương." }],
          },
        ],
      },
      {
        t: "table",
        head: ["Cụm", "Dùng khi", "Ví dụ", "Lỗi hay gặp"],
        rows: [
          ["whereas / while", "so hai đối tượng trong MỘT câu", "Men spent 3 hours, whereas women spent 2.", "viết thành hai câu: ~~Whereas women spent 2.~~ (câu cụt)"],
          ["In contrast, / By contrast,", "so hai đối tượng ở HAI câu", "In contrast, women spent only 2 hours.", "~~In contrast of~~ / ~~On the contrast~~"],
          ["On the other hand,", "mặt còn lại của cùng một vấn đề", "On the other hand, it is expensive.", "~~In the other hand~~ / ~~On the other side~~"],
          ["On the contrary,", "**bác bỏ** ý vừa nêu: “không, ngược lại là đằng khác”", "The scheme was not a failure. On the contrary, it saved millions.", "dùng thay In contrast ⇒ sai nghĩa"],
          ["unlike + N", "giới từ: khác với…", "Unlike its neighbours, the country has no coast.", "~~Unlike with~~ / ~~Different with~~"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: On the contrary KHÔNG phải “ngược lại” để so sánh",
        items: [
          "**In contrast / By contrast** = so sánh hai thứ khác nhau: Japan imports most of its energy. **In contrast**, Norway exports it.",
          "**On the contrary** = phủ nhận điều vừa nói (thường sau một câu phủ định): Working from home does not reduce productivity. **On the contrary**, many workers get more done.",
          "Trong Task 1 gần như KHÔNG BAO GIỜ dùng On the contrary — biểu đồ không tranh cãi với ai.",
          "whereas phải nối HAI mệnh đề trong một câu. Nếu muốn mở câu mới, dùng In contrast, / However,.",
        ],
      },
      { t: "rule", formula: "S1 + V, whereas / while + S2 + V  ·  S1 + V. In contrast, + S2 + V", vi: "Hai đối tượng khác nhau ⇒ whereas / In contrast. Cùng đối tượng, kết quả bất ngờ ⇒ although / despite." },
      {
        t: "mcq",
        id: "t3d21-doi-lap",
        title: "Nhượng bộ hay đối lập? Chọn từ đúng (6 câu)",
        items: [
          { q: "In 2010, 60% of students lived at home, ___ only 25% rented a flat.", options: ["despite", "whereas", "although of", "on the contrary"], correct: 1, why: "Hai nhóm khác nhau (ở nhà / thuê căn hộ) trong một câu ⇒ whereas. despite cần danh từ; on the contrary dùng để bác bỏ." },
          { q: "___ the factory closed in 2018, unemployment in the town did not rise.", options: ["Whereas", "In contrast", "Although", "Despite"], correct: 2, why: "Cùng một thị trấn, kết quả trái mong đợi ⇒ nhượng bộ; sau chỗ trống là mệnh đề (the factory closed) ⇒ Although. Despite không đi với S + V." },
          { q: "The new road has not reduced traffic. ___, journeys now take longer than before.", options: ["On the contrary", "Whereas", "In contrast of", "Despite"], correct: 0, why: "Câu trước phủ định, câu sau nói điều ngược hẳn ⇒ On the contrary (“trái lại là đằng khác”)." },
          { q: "___ its small population, the country wins many Olympic medals.", options: ["Although", "While", "However", "Despite"], correct: 3, why: "Sau chỗ trống là cụm danh từ (its small population) ⇒ giới từ Despite." },
          { q: "Exports of rice grew steadily. ___, exports of coffee fell every year.", options: ["Whereas", "By contrast", "Even though", "Unlike"], correct: 1, why: "Hai câu riêng, hai mặt hàng khác nhau ⇒ By contrast, (trạng từ nối câu). Whereas / Even though không mở câu độc lập." },
          { q: "___ I understand why people keep exotic pets, I believe the trade should be banned.", options: ["Despite", "In spite", "While", "Whereas of"], correct: 2, why: "Sau chỗ trống là mệnh đề (I understand…) và ý là “tuy tôi hiểu… nhưng” ⇒ While (nhượng bộ)." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Trạng từ nhượng bộ giữa hai câu: However · Nevertheless · Even so · yet" },
      {
        t: "p",
        text: "Khi hai ý dài, đừng nhét vào một câu although — tách thành hai câu và nối bằng trạng từ. **However** là từ trung tính nhất. **Nevertheless / Nonetheless** trang trọng hơn và mang nghĩa nhượng bộ rõ (“dù vậy… vẫn”). **Even so** và **Still** tự nhiên khi nói. **yet** là liên từ như but nhưng trang trọng hơn (…, yet…). Cả nhóm này phạm một lỗi dấu câu giống nhau: dùng dấu phẩy để nối hai câu (comma splice — lỗi “câu dính” đã gặp ở Tập 2 Ngày 17).",
      },
      {
        t: "table",
        head: ["Cách viết", "Đúng / sai", "Vì sao"],
        rows: [
          ["The plan was expensive. **However,** it was approved.", "✅", "dấu chấm + However + dấu phẩy"],
          ["The plan was expensive**; however,** it was approved.", "✅", "chấm phẩy + however + dấu phẩy (hai ý gắn chặt)"],
          ["The plan was expensive. It was**, however,** approved.", "✅", "however chen giữa câu, hai dấu phẩy hai bên — văn phong band 7"],
          ["~~The plan was expensive, however it was approved.~~", "❌", "dấu phẩy không nối được hai câu độc lập (comma splice)"],
          ["The plan was expensive, **yet** it was approved.", "✅", "yet là liên từ như but ⇒ dấu phẩy là đủ"],
          ["The plan was expensive. **Nevertheless,** it was approved.", "✅", "trang trọng; nghĩa “dù vậy vẫn”"],
          ["The plan was expensive. **Even so,** most people liked it.", "✅", "tự nhiên khi nói (Part 3)"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Hai lỗi band 5 với However",
        items: [
          "**Lạm dụng**: mở ba câu liền bằng However / Moreover / Therefore ⇒ giám khảo ghi “mechanical” (máy móc — đúng chữ trong mô tả band 6 của CC). Mỗi đoạn thân bài 1–2 trạng từ nối là đủ; chỗ còn lại dùng although / despite / whereas trong câu.",
          "**However + mệnh đề phụ**: ~~However the plan was expensive, it was approved.~~ ⇒ However không phải although. Sửa: Although the plan was expensive, it was approved.",
          "~~But, the plan was approved.~~ ⇒ trong văn viết học thuật không mở câu bằng But + dấu phẩy; dùng However,.",
        ],
      },
      { t: "rule", formula: "S + V. However, / Nevertheless, / Even so, + S + V  ·  S + V; however, + S + V  ·  S + V, yet + S + V", vi: "Trạng từ nối đứng sau dấu chấm hoặc chấm phẩy, không sau dấu phẩy." },
      {
        t: "quiz",
        id: "t3d21-however",
        kind: "fill",
        title: "Điền MỘT từ: however · nevertheless · although · despite · yet · whereas (6 câu, mỗi từ một lần; không phân biệt hoa thường)",
        items: [
          { q: "1. The medicine is cheap and safe, ___ few doctors recommend it.", answers: ["yet"] },
          { q: "2. ___ strong opposition from residents, the airport was expanded.", answers: ["despite"] },
          { q: "3. The results were disappointing; ___, the team decided to repeat the study.", answers: ["however", "nevertheless"] },
          { q: "4. City schools are well funded, ___ rural schools often lack basic equipment.", answers: ["whereas"] },
          { q: "5. ___ the evidence is limited, the theory is widely accepted.", answers: ["although"] },
          { q: "6. The climb was dangerous and the weather was poor. ___, all twelve climbers reached the top. (trang trọng, “dù vậy vẫn”)", answers: ["nevertheless", "however"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Nguyên nhân: because · since · as ↔ because of · due to · owing to" },
      {
        t: "p",
        text: "Cũng như nhượng bộ, nguyên nhân có hai họ. **Liên từ + mệnh đề**: because (mạnh nhất, trả lời “why”), **since** và **as** (nguyên nhân người đọc đã biết, thường đứng đầu câu). **Giới từ + danh từ**: because of (trung tính), **due to** và **owing to** (trang trọng hơn), **as a result of**, **on account of**, **thanks to** (chỉ cho nguyên nhân TỐT).",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V + because / since / as + S + V",
            vi: "… vì + mệnh đề",
            examples: [
              { en: "Many species are disappearing because their habitats are being destroyed.", vi: "Nhiều loài đang biến mất vì môi trường sống của chúng đang bị phá huỷ." },
              { en: "Since most people now shop online, many high-street stores have closed.", vi: "Vì giờ phần lớn mọi người mua hàng trên mạng, nhiều cửa hàng trên phố đã đóng cửa." },
            ],
          },
          {
            formula: "S + V + because of / due to / owing to / as a result of + N",
            vi: "… vì / do + danh từ hoặc V-ing",
            examples: [
              { en: "The flight was cancelled due to bad weather.", vi: "Chuyến bay bị huỷ do thời tiết xấu." },
              { en: "Owing to a shortage of teachers, class sizes have grown.", vi: "Do thiếu giáo viên, sĩ số lớp đã tăng." },
              { en: "Thousands lost their jobs as a result of the factory closing.", vi: "Hàng nghìn người mất việc do nhà máy đóng cửa." },
            ],
          },
          {
            formula: "S + be + (largely / partly / mainly) + due to + N",
            vi: "… (phần lớn / một phần) là do… — khung rất hợp Task 1 và Task 2",
            examples: [{ en: "The rise in obesity is partly due to a lack of exercise.", vi: "Sự gia tăng béo phì một phần là do thiếu vận động." }],
          },
          {
            formula: "S + V + due to / owing to + the fact that + S + V",
            vi: "Giữ mệnh đề sau giới từ — trang trọng",
            examples: [{ en: "Rents are high owing to the fact that few new homes are being built.", vi: "Tiền thuê cao do thực tế là ít nhà mới được xây." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi nói nguyên nhân",
        items: [
          "~~Because of the weather was bad~~ ⇒ because of + **danh từ**: because of the bad weather. Muốn mệnh đề thì bỏ of: because the weather was bad.",
          "~~Because it rained. We stayed at home.~~ ⇒ mệnh đề because đứng một mình là câu cụt. Khi nói thì được (trả lời Why…?), khi viết thì KHÔNG.",
          "~~Because it rained, so we stayed at home.~~ ⇒ tiếng Việt “vì… nên…”, tiếng Anh chỉ because HOẶC so.",
          "~~Due to it rained~~ ⇒ due to + danh từ: due to the rain / due to the fact that it rained.",
          "~~Thanks to the storm, 200 houses were destroyed.~~ ⇒ thanks to chỉ dùng cho kết quả tốt (trừ khi mỉa mai). Dùng because of / due to.",
          "**as** và **since** có nghĩa khác (khi / từ khi). Nếu câu có thể hiểu hai cách, dùng because cho chắc.",
        ],
      },
      { t: "rule", formula: "because / since / as + S + V  ·  because of / due to / owing to / as a result of + N", vi: "Mệnh đề ⇒ because. Danh từ ⇒ because of / due to. Không because… so…" },
      {
        t: "quiz",
        id: "t3d21-nguyen-nhan-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — nguyên nhân (5 câu)",
        grammar: "because + S + V · because of / due to / owing to + N",
        items: [
          { q: "Trận đấu bị hoãn do mưa to.", answers: ["The match was postponed due to heavy rain.", "The match was postponed because of heavy rain.", "The match was postponed owing to heavy rain.", "The match was postponed due to the heavy rain.", "The match was postponed because of the heavy rain."], hint: "be postponed · due to · heavy rain" },
          { q: "Vì chi phí sinh hoạt đang tăng, nhiều người trẻ sống với bố mẹ lâu hơn.", answers: ["Since the cost of living is rising, many young people live with their parents for longer.", "Because the cost of living is rising, many young people live with their parents for longer.", "As the cost of living is rising, many young people live with their parents for longer.", "Since the cost of living is rising, many young people live with their parents longer.", "Because the cost of living is rising, many young people live with their parents longer.", "Since living costs are rising, many young people live with their parents for longer."], hint: "since · the cost of living · rise · for longer" },
          { q: "Sự sụt giảm doanh số chủ yếu là do giá cao hơn.", answers: ["The fall in sales was mainly due to higher prices.", "The fall in sales is mainly due to higher prices.", "The drop in sales was mainly due to higher prices.", "The decline in sales was mainly due to higher prices.", "The fall in sales was largely due to higher prices.", "The decrease in sales was mainly due to higher prices."], hint: "the fall in sales · be mainly due to · higher prices" },
          { q: "Do thiếu kinh phí, dự án đã bị huỷ.", answers: ["Owing to a lack of funding, the project was cancelled.", "Due to a lack of funding, the project was cancelled.", "Because of a lack of funding, the project was cancelled.", "Owing to a lack of funds, the project was cancelled.", "Owing to a lack of funding, the project has been cancelled.", "Due to a lack of funding, the project has been cancelled.", "Owing to a lack of money, the project was cancelled."], hint: "owing to · a lack of funding · be cancelled" },
          { q: "Nhờ có internet, sinh viên có thể học ở bất cứ đâu.", answers: ["Thanks to the internet, students can study anywhere.", "Thanks to the internet, students can learn anywhere.", "Thanks to the Internet, students can study anywhere.", "Thanks to the internet, students are able to study anywhere."], hint: "thanks to · the internet · anywhere" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Kết quả: so · Therefore · As a result · Consequently · which means that · , leading to" },
      {
        t: "p",
        text: "Kết quả cũng nối được ở hai tầng. Trong một câu: **so** (thân mật), **so … that / such … that** (Tập 2 Ngày 23), **, which means that…** và **, V-ing** (mệnh đề kết quả rút gọn — rất “band 6+” mà dễ dùng). Giữa hai câu: **Therefore, / As a result, / Consequently, / For this reason,**; **Thus / Hence** trang trọng, hợp bài viết khoa học hơn bài IELTS.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + V. As a result, / Therefore, / Consequently, + S + V",
            vi: "Câu 1 = nguyên nhân. Câu 2 = kết quả",
            examples: [
              { en: "Forests are being cleared for farmland. As a result, many animals have lost their homes.", vi: "Rừng đang bị phá để lấy đất canh tác. Kết quả là nhiều loài vật mất nơi ở." },
              { en: "The survey covered only one city. Therefore, the findings cannot be applied to the whole country.", vi: "Khảo sát chỉ làm ở một thành phố. Vì vậy, kết quả không thể áp dụng cho cả nước." },
            ],
          },
          {
            formula: "S + V, which means (that) + S + V",
            vi: "…, điều đó có nghĩa là… (which thay cho cả mệnh đề trước)",
            examples: [{ en: "Most buses stop running at 10 p.m., which means that night-shift workers have to drive.", vi: "Phần lớn xe buýt ngừng chạy lúc 10 giờ tối, nghĩa là người làm ca đêm phải lái xe." }],
          },
          {
            formula: "S + V, V-ing + O",
            vi: "…, (từ đó) dẫn tới / gây ra / khiến… — leading to · causing · resulting in · making · forcing",
            examples: [
              { en: "The river burst its banks, forcing hundreds of families to leave their homes.", vi: "Sông vỡ bờ, buộc hàng trăm gia đình rời nhà." },
              { en: "Factories moved abroad, leading to a sharp rise in unemployment.", vi: "Các nhà máy chuyển ra nước ngoài, dẫn tới thất nghiệp tăng mạnh." },
            ],
          },
          {
            formula: "S + V + so + adj / adv + that + S + V",
            vi: "… đến mức… (ôn Tập 2 Ngày 23)",
            examples: [{ en: "House prices have risen so quickly that most young couples can no longer afford to buy.", vi: "Giá nhà tăng nhanh đến mức phần lớn vợ chồng trẻ không còn mua nổi." }],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với từ nối kết quả",
        items: [
          "~~The survey covered one city, therefore the findings are limited.~~ ⇒ comma splice. Sửa: dấu chấm / chấm phẩy trước therefore, hoặc dùng **, so**.",
          "~~As a result of~~ và **As a result,** khác nhau: As a result **of** the storm (+ danh từ = nguyên nhân) ↔ There was a storm. **As a result,** roads were closed (+ câu = kết quả).",
          "~~So, the government should act.~~ ở đầu câu văn viết học thuật ⇒ đổi thành Therefore, / For this reason,. Khi NÓI thì So,… hoàn toàn tự nhiên.",
          "**, V-ing** chỉ đúng khi “cả sự việc ở vế trước” gây ra kết quả. Đừng dùng khi hai vế không có quan hệ nhân quả.",
        ],
      },
      { t: "rule", formula: "S + V. As a result, / Therefore, + S + V  ·  S + V, which means that + S + V  ·  S + V, leading to + N", vi: "Hai câu ⇒ trạng từ + dấu phẩy. Một câu ⇒ so / which means that / , V-ing." },
      {
        t: "quiz",
        id: "t3d21-ket-qua-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — kết quả (4 câu)",
        grammar: "As a result, … · , which means that … · , leading to + N",
        items: [
          { q: "Nhiều người trẻ rời làng quê. Kết quả là các trường học ở nông thôn đang đóng cửa.", answers: ["Many young people leave their villages. As a result, rural schools are closing.", "Many young people are leaving their villages. As a result, rural schools are closing.", "Many young people leave the countryside. As a result, rural schools are closing.", "Many young people are leaving the countryside. As a result, rural schools are closing.", "Many young people leave their villages. As a result, schools in rural areas are closing."], hint: "leave their villages · As a result, · rural schools · close" },
          { q: "Vé tàu rất đắt, điều đó có nghĩa là nhiều người vẫn lái xe.", answers: ["Train tickets are very expensive, which means that many people still drive.", "Train tickets are very expensive, which means many people still drive.", "Train fares are very expensive, which means that many people still drive.", "Train fares are very high, which means that many people still drive."], hint: "train tickets · , which means that · still drive" },
          { q: "Giá dầu tăng, dẫn tới chi phí vận tải cao hơn.", answers: ["Oil prices rose, leading to higher transport costs.", "Oil prices increased, leading to higher transport costs.", "The price of oil rose, leading to higher transport costs.", "Oil prices rose, resulting in higher transport costs.", "Oil prices went up, leading to higher transport costs."], hint: "oil prices · rise · , leading to · transport costs" },
          { q: "Mẫu khảo sát quá nhỏ. Vì vậy, kết quả không đáng tin cậy.", answers: ["The sample was too small. Therefore, the results are not reliable.", "The sample was too small. Therefore, the results were not reliable.", "The sample was too small. Therefore, the results are unreliable.", "The sample was too small. Therefore, the findings are not reliable.", "The sample was too small. Consequently, the results are not reliable."], hint: "the sample · too small · Therefore, · reliable" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Động từ và danh từ nhân quả — nhớ CHIỀU mũi tên" },
      {
        t: "p",
        text: "Thay vì nối hai mệnh đề, tiếng Anh học thuật hay gói nguyên nhân và kết quả thành hai **cụm danh từ** rồi đặt một **động từ nhân quả** ở giữa. Câu ngắn hơn, “đặc” hơn, và ghi điểm LR. Điều duy nhất phải nhớ: mũi tên đi chiều nào.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Chiều mũi tên của động từ nhân quả",
        cols: [
          { title: "NGUYÊN NHÂN → kết quả", items: ["**cause** + N", "**lead to** + N / V-ing", "**result in** + N / V-ing", "**bring about** + N (một thay đổi)", "**contribute to** + N (góp một phần)", "**give rise to** + N (trang trọng)", "Heavy rain **led to** flooding."] },
          { title: "KẾT QUẢ ← nguyên nhân", items: ["**result from** + N", "**stem from** + N", "**arise from** + N", "**be caused by** + N", "**be due to** + N", "**be the result of** + N", "The flooding **resulted from** heavy rain."] },
        ],
        caption: "result IN + kết quả · result FROM + nguyên nhân. Đổi giới từ = đảo ngược nghĩa.",
      },
      {
        t: "table",
        head: ["Danh từ", "Giới từ đi kèm", "Ví dụ"],
        rows: [
          ["cause", "the cause **of** + kết quả", "The main cause **of** traffic congestion is poor public transport."],
          ["reason", "the reason **for** + kết quả · the reason **why** + S + V", "There are two reasons **for** this trend."],
          ["effect / impact", "an effect / impact **on** + đối tượng chịu", "Tourism has a negative impact **on** wildlife."],
          ["result / consequence", "a result / consequence **of** + nguyên nhân", "Soil erosion is a direct consequence **of** deforestation."],
          ["factor", "a factor **in** + kết quả", "Stress is a major factor **in** heart disease."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với động từ nhân quả",
        items: [
          "~~Smoking leads to people have cancer.~~ ⇒ lead **to** — to ở đây là giới từ, sau nó là danh từ / V-ing: Smoking leads to **cancer** / leads to people **developing** cancer.",
          "~~Pollution causes to many diseases.~~ ⇒ cause + tân ngữ trực tiếp, KHÔNG có to: Pollution **causes** many diseases. (cause + O + **to V**: The delay caused us **to miss** the train.)",
          "~~The accident was resulted from…~~ / ~~is led to~~ ⇒ result from / in và lead to KHÔNG có bị động kiểu này. The accident **resulted from** careless driving.",
          "~~affect on~~ ⇒ động từ **affect** + O (không giới từ); danh từ **effect / impact on**. It **affects** wildlife = It has an **effect on** wildlife.",
          "~~The reason is because…~~ / ~~The reason of~~ ⇒ The reason **for** this **is that**…",
          "**contribute to** = góp phần (một trong nhiều nguyên nhân) — an toàn hơn cause khi bạn không chắc đó là nguyên nhân duy nhất. Dùng nó là có “mức độ”, đúng tinh thần band 6.",
        ],
      },
      { t: "rule", formula: "Nguyên nhân + cause / lead to / result in + kết quả  ·  Kết quả + result from / stem from / be due to + nguyên nhân", vi: "IN → kết quả; FROM → nguyên nhân. lead to + N / V-ing (không to V)." },
      {
        t: "quiz",
        id: "t3d21-chieu-nhan-qua",
        kind: "fill",
        title: "Điền MỘT giới từ: in · from · to · of · on · for (8 câu)",
        items: [
          { q: "1. A poor diet can lead ___ serious health problems.", answers: ["to"] },
          { q: "2. Most road accidents result ___ human error. (tai nạn ← lỗi con người)", answers: ["from"] },
          { q: "3. The new law resulted ___ a 20% drop in plastic waste. (luật → giảm rác)", answers: ["in"] },
          { q: "4. Social media has had a huge impact ___ the way we communicate.", answers: ["on"] },
          { q: "5. What was the main cause ___ the fire?", answers: ["of"] },
          { q: "6. There are several reasons ___ the decline in bee numbers.", answers: ["for"] },
          { q: "7. Lack of sleep contributes ___ poor exam results.", answers: ["to"] },
          { q: "8. Many of the company's problems stem ___ bad management.", answers: ["from"] },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Đổi cấu trúc: một ý — bốn cách viết" },
      {
        t: "p",
        text: "Band 6 Writing yêu cầu “trộn câu đơn và câu phức”; band 6 Reading yêu cầu nhận ra paraphrase **đổi cấu trúc** (Tập 3 Ngày 3). Hai yêu cầu này luyện cùng một lúc: lấy một cặp nguyên nhân – kết quả (hoặc nhượng bộ) rồi viết lại bằng nhiều cấu trúc. Trong bài thi, bạn chỉ cần mỗi đoạn dùng 2–3 cấu trúc KHÁC nhau là đủ.",
      },
      {
        t: "table",
        head: ["Cấu trúc", "Nhân quả: mưa lớn → lũ", "Nhượng bộ: giá cao, vẫn bán chạy"],
        rows: [
          ["Liên từ + mệnh đề", "The town was flooded **because** it rained heavily.", "**Although** the price was high, the phone sold well."],
          ["Giới từ + danh từ", "The town was flooded **due to** heavy rain.", "**Despite** its high price, the phone sold well."],
          ["Trạng từ nối hai câu", "It rained heavily. **As a result,** the town was flooded.", "The price was high. **Nevertheless,** the phone sold well."],
          ["Động từ nhân quả / , V-ing", "Heavy rain **led to** flooding in the town. · It rained heavily, **causing** flooding.", "(không có động từ nhượng bộ — dùng ba cách trên)"],
        ],
      },
      {
        t: "quiz",
        id: "t3d21-doi-cau-truc",
        kind: "fill",
        title: "Viết lại — điền phần còn thiếu sao cho nghĩa không đổi (6 câu; gõ đúng các từ còn thiếu)",
        items: [
          { q: "1. Although the weather was bad, the festival was a success. → Despite ___ ___ ___, the festival was a success. (3 từ)", answers: ["the bad weather"] },
          { q: "2. The road was closed because there was an accident. → The road was closed because ___ ___ ___. (3 từ)", answers: ["of an accident", "of the accident"] },
          { q: "3. Despite being tired, she finished the report. → Although ___ ___ ___, she finished the report. (3 từ)", answers: ["she was tired"] },
          { q: "4. Prices rose sharply, so demand fell. → The sharp rise in prices led ___ ___ ___ ___ demand. (4 từ)", answers: ["to a fall in", "to a drop in", "to a decline in", "to a decrease in"] },
          { q: "5. The delays were caused by a computer fault. → The delays resulted ___ ___ ___ ___. (4 từ)", answers: ["from a computer fault"] },
          { q: "6. In spite of his age, he still runs marathons. → ___ ___ he is old, he still runs marathons. (2 từ)", answers: ["even though"] },
        ],
      },
      { t: "rule", formula: "Although + S + V  ⇄  Despite + N / V-ing  ·  because + S + V  ⇄  due to + N  ⇄  N + lead to + N", vi: "Một đoạn văn band 6: cùng một quan hệ, 2–3 cấu trúc khác nhau." },

      /* ── 10 ── */
      { t: "h", text: "10. Dùng ở đâu trong bài thi IELTS" },
      {
        t: "table",
        head: ["Phần thi", "Dùng để", "Câu khung"],
        rows: [
          ["Writing Task 1", "so hai nhóm trong một câu; nêu ngoại lệ của xu hướng", "The figure for A rose to 40%, **whereas** that for B fell to 15%. · **Despite** a dip in 2012, sales grew overall."],
          ["Writing Task 2 — mở bài", "nêu lập trường có nhượng bộ", "**While** I accept that …, I believe that …"],
          ["Task 2 — cause / effect", "nêu nguyên nhân, chuỗi hệ quả (nối Ngày 18)", "This is **largely due to** … · This **leads to** …, **which in turn means that** …"],
          ["Task 2 — phản đề", "thừa nhận ý đối lập rồi bác", "Some argue that … . **Nevertheless,** …"],
          ["Speaking Part 3", "đồng ý một phần (nối Ngày 10), giải thích lý do", "It's convenient. **Even so,** I think … · That's mainly **because of** …"],
          ["Reading / Listening", "nhận ra đáp án nằm SAU từ nhượng bộ; nhận paraphrase due to ↔ because", "Although X was expected, **Y** happened. ⇒ đáp án là Y"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "[Task 2 — một đoạn thân bài mẫu] The main reason why so many species are disappearing is the loss of their natural habitat. As cities expand, forests are cleared for housing and farmland, which means that animals have nowhere to live or feed. Although some governments have created national parks, these areas are often too small to support large animals. As a result, even protected species continue to decline.", vi: "Đếm công cụ: The main reason why… is (danh từ nhân quả) · As… (nguyên nhân) · , which means that (kết quả) · Although (nhượng bộ) · As a result, (kết quả giữa hai câu). Năm chỗ nối — năm cấu trúc khác nhau, không lặp because / so." },
        ],
      },
      { t: "rule", formula: "While I accept that + S + V, I believe that + S + V  ·  This is largely due to + N  ·  A rose, whereas B fell", vi: "Ba câu khung dùng được ở hầu hết bài Task 2 và Task 1." },

      /* ── 11 ── */
      { t: "h", text: "11. Kiểm tra cuối bài (10 câu)" },
      {
        t: "mcq",
        id: "t3d21-np-tong-hop",
        title: "Chọn đáp án đúng (10 câu)",
        items: [
          { q: "___ the high cost of living, the city attracts thousands of new residents every year.", options: ["Although", "Despite of", "In spite of", "Even though"], correct: 2, why: "Sau chỗ trống là cụm danh từ ⇒ giới từ. “Despite of” sai; In spite of đúng." },
          { q: "The bridge was closed for a month, ___ long delays for commuters.", options: ["causing", "caused", "which causing", "it caused"], correct: 0, why: "Mệnh đề kết quả rút gọn: , V-ing. “it caused” sau dấu phẩy là comma splice; “which causing” thiếu động từ chia." },
          { q: "Unemployment among graduates is low. ___, many of them are working in jobs unrelated to their degree.", options: ["Whereas", "Although", "Despite", "However"], correct: 3, why: "Mở một câu mới và có dấu phẩy theo sau ⇒ trạng từ nối However. Ba từ kia không mở được câu độc lập." },
          { q: "The increase in asthma cases ___ poor air quality in the city centre.", options: ["resulted in", "resulted from", "led to", "was resulted from"], correct: 1, why: "Hen suyễn tăng ← không khí kém: kết quả + result FROM + nguyên nhân. result from không có bị động." },
          { q: "Which sentence is correct?", options: ["Although the train was late, but I arrived on time.", "Despite the train was late, I arrived on time.", "Although the train was late, I arrived on time.", "Despite of the late train, I arrived on time."], correct: 2, why: "Chỉ câu C đúng: although + mệnh đề, không but. A thừa but; B despite + S V; D despite of." },
          { q: "In 2020, Country A spent 9% of its budget on defence, ___ the figure for Country B was only 3%.", options: ["whereas", "despite", "on the contrary", "however"], correct: 0, why: "Hai nước, một câu ⇒ whereas. however sau dấu phẩy là comma splice." },
          { q: "The scheme failed ___ a lack of public support.", options: ["because", "since", "as", "owing to"], correct: 3, why: "Sau chỗ trống là danh từ (a lack of…) ⇒ giới từ owing to. because / since / as cần mệnh đề." },
          { q: "Fast food is cheap and convenient, ___ means that many families eat it several times a week.", options: ["what", "that", "which", "it"], correct: 2, why: ", which means that — which thay cho cả mệnh đề trước. that không đứng sau dấu phẩy; it tạo comma splice." },
          { q: "Online courses are not replacing universities. ___, more people than ever are applying for a place.", options: ["In contrast of", "On the contrary", "Whereas", "Despite"], correct: 1, why: "Câu trước phủ định; câu sau khẳng định điều ngược hẳn ⇒ On the contrary." },
          { q: "Lack of exercise is one factor that ___ obesity, but it is not the only cause.", options: ["contributes to", "contributes", "results from", "is due"], correct: 0, why: "“một yếu tố… không phải nguyên nhân duy nhất” ⇒ contribute TO (góp phần gây ra)." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t3d21-doc",
    kind: "reading",
    title: "Đọc: Matching features 2 — nối nhận định với nhà nghiên cứu",
    goal: "Làm trọn 13 câu trên một bài đọc khoảng 840 từ trong 20 phút: 8 câu Matching features (nối nhận định với đúng nhà nghiên cứu, một tên có thể dùng nhiều lần) + 5 câu Sentence completion; biết khoanh tên, đọc trọn “vùng” của từng người, nhận paraphrase đổi cấu trúc và tránh bẫy “đúng chủ đề, sai người” — đẩy Reading lên mốc band 6 (23/40).",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Matching features** = đề cho một danh sách **đặc điểm / nhận định** (câu 1, 2, 3…) và một danh sách **đối tượng** (A, B, C… — thường là nhà nghiên cứu, cũng có thể là quốc gia, thời kỳ, loài vật). Việc của bạn: nhận định nào thuộc về ai.",
          "Tập 1 Ngày 10 đã học dạng này trên bài ngắn, mỗi người một đoạn. Band 6 khó hơn ở ba chỗ: bài dài 800–900 từ · một người có thể **xuất hiện ở hai nơi** hoặc được nhắc bằng **she / the economist** · một chữ cái có thể **dùng nhiều lần** (NB) hoặc **không dùng**.",
          "Câu hỏi **KHÔNG theo thứ tự bài đọc**. Vì thế quét theo TÊN (viết hoa, dễ thấy), không quét theo câu hỏi.",
          "Bẫy chính: hai người cùng nói về MỘT chủ đề (hôm nay: “chỉ trồng một loài cây”) nhưng nói hai điều khác nhau. Chọn theo **ý**, không theo từ khoá.",
          "Nhận định trong đề luôn là paraphrase. Ngữ pháp bài 1 giúp trực tiếp: bài viết “owing to a lack of watering”, đề viết “because nobody looks after them”.",
          "Mục tiêu: ≥ 9/13 trong 20 phút. Đi kèm 5 câu **Sentence completion** (ôn Ngày 19) — dạng này THEO thứ tự bài.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 1 Ngày 10 — và band 6 khác ở đâu" },
      {
        t: "table",
        head: ["", "Tập 1 Ngày 10 (band 4)", "Hôm nay (band 6)"],
        rows: [
          ["Độ dài bài", "300–400 từ", "800–900 từ"],
          ["Vị trí từng người", "mỗi người gói trong một đoạn", "một người có thể ở 2 đoạn; có đoạn không có ai"],
          ["Cách gọi tên", "đủ họ tên mỗi lần", "lần đầu đủ tên, sau đó chỉ họ, **she / he**, **the economist**, **her team**"],
          ["Số lần dùng chữ cái", "mỗi chữ một lần", "**NB You may use any letter more than once** — có chữ dùng 2–3 lần, có chữ không dùng"],
          ["Paraphrase", "đồng nghĩa một từ", "đổi loại từ + đổi cấu trúc (despite ↔ although, due to ↔ because)"],
          ["Bẫy", "ít", "hai người cùng chủ đề · ý kiến người này **thuật lại** ý người khác · ý của tác giả (không của ai)"],
        ],
      },
      {
        t: "note",
        title: "📌 Đọc kỹ câu lệnh — ba biến thể",
        items: [
          "**“You may use any letter more than once”** ⇒ đừng gạch tên đã dùng. Thường số câu hỏi NHIỀU hơn số người (8 câu, 5 người).",
          "**Không có dòng NB** và số người = số câu ⇒ mỗi người đúng một lần; làm xong câu dễ, câu khó còn ít lựa chọn.",
          "Danh sách người **nhiều hơn** số câu ⇒ có người thừa, chỉ để gây nhiễu.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Quy trình 5 bước — quét theo TÊN" },
      {
        t: "sodo",
        kind: "flow",
        title: "Matching features — 5 bước (≈ 10–11 phút cho 8 câu)",
        steps: [
          { label: "1. Đọc câu lệnh + danh sách tên", sub: "Có NB không? Bao nhiêu người, bao nhiêu câu? (15 giây)" },
          { label: "2. Quét bài, khoanh MỌI chỗ có tên", sub: "Kể cả lần nhắc lại chỉ bằng họ. Ghi chữ cái A, B, C… ngoài lề (1 phút)" },
          { label: "3. Đọc các nhận định, gạch chân ý chính", sub: "Mỗi nhận định tóm thành 3–4 chữ: “bất bình đẳng”, “cây non chết”… (1 phút)" },
          { label: "4. Đọc trọn VÙNG của từng người", sub: "Đọc xong người A ⇒ nhìn lại cả 8 nhận định, cái nào của A thì điền ngay. Rồi sang B…" },
          { label: "5. Soát câu còn trống và câu “hai người cùng chủ đề”", sub: "Đọc lại đúng câu chứa ý; so từng vế của nhận định" },
        ],
        caption: "Mẹo then chốt là bước 4: đi theo NGƯỜI (5 lượt đọc) chứ không theo CÂU (8 lượt tìm khắp bài).",
      },
      {
        t: "p",
        text: "**“Vùng” của một người** bắt đầu từ chỗ tên xuất hiện và kéo tới khi có tên người khác hoặc hết đoạn. Trong vùng đó, chú ý **động từ tường thuật** (Ngày 19): argues, claims, found, warns, points out, is cautious about, disagrees with — sau các động từ này là ý của người đó. Câu không có tên ai và không có động từ tường thuật thường là lời **tác giả**, không gán cho ai.",
      },
      { t: "rule", formula: "Khoanh tên → đọc trọn vùng của MỘT người → soát cả danh sách nhận định → điền → người kế tiếp", vi: "Đi theo người, không đi theo câu hỏi." },

      /* ── 3 ── */
      { t: "h", text: "3. Bốn bẫy của dạng này ở band 6" },
      {
        t: "table",
        head: ["Bẫy", "Trông thế nào", "Cách gỡ"],
        rows: [
          ["**Cùng chủ đề, khác ý**", "Hai người đều nhắc “một loài cây”: người này nói về bệnh dịch, người kia nói về phấn hoa", "So TOÀN BỘ nhận định, nhất là phần cuối câu (hại **sức khoẻ cư dân** hay hại **cả đàn cây**?)"],
          ["**Từ khoá y hệt**", "Nhận định chứa đúng một từ có trong vùng của người X — nhưng X nói ngược lại hoặc nói chuyện khác", "Từ trùng 100 % với bài thường là mồi. Đáp án thật là paraphrase"],
          ["**Ý được thuật lại**", "“Unlike Smith, Jones believes…” — ý sau believes là của Jones, không phải Smith", "Hỏi: chủ ngữ của động từ tường thuật là ai?"],
          ["**Đại từ và chức danh**", "“The economist warns…”, “She is cautious…”", "Lần lại tên gần nhất phía trước; ghi chữ cái ngay cạnh đại từ"],
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở Matching features",
        items: [
          "Làm theo thứ tự câu 1 → 8, mỗi câu lại quét cả bài ⇒ hết 20 phút cho riêng dạng này. Quy trình đúng mất 10–11 phút.",
          "Gạch tên sau khi dùng một lần dù đề có NB ⇒ mất 2–3 câu.",
          "Thấy từ khoá trùng là điền, không đọc hết câu chứa nó.",
          "Bỏ qua mức độ: bài viết “**may** not be one of cause and effect” mà gán cho người khẳng định chắc chắn. Chú ý may / might / is cautious / not always (Ngày 19 — modal suy đoán).",
          "Để trống. Dạng này không trừ điểm; câu không tìm ra thì đoán chữ cái ÍT được dùng nhất (khi có NB, không ai bị loại).",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Khởi động — 4 câu trên một đoạn ngắn" },
      {
        t: "p",
        text: "Làm đúng 5 bước trên đoạn khoảng 130 từ dưới đây (3 phút). Chú ý: có một người được nhắc **hai lần**, và có hai người cùng nhắc tới chuyện đi học chuyên cần (attendance) nhưng ý khác nhau. Bài tự soạn; tên nhà nghiên cứu là hư cấu.",
      },
      {
        t: "passage",
        title: "The Four-Day School Week",
        paras: [
          { text: "When a group of rural primary schools replaced their five-day week with four longer school days, three researchers studied the results. **Priya Nair** found that teachers took fewer days off sick and that test scores in reading improved slightly. **Tom Whitfield** was less impressed. Although attendance rose, he pointed out that the rise came almost entirely in the first few weeks and had largely disappeared by the end of the first term. **Laura Chen**, who interviewed parents, reported a different problem: because lessons now finished at 4.30, after-school sports clubs lost almost half their members. Nair accepts Whitfield's point about attendance; nevertheless, she argues that the change is worth keeping, since pupils who travel to school one day less each week spend far less time on dangerous country roads." },
        ],
      },
      {
        t: "table",
        head: ["Chữ", "Nhà nghiên cứu"],
        rows: [["A", "Priya Nair"], ["B", "Tom Whitfield"], ["C", "Laura Chen"]],
        caption: "NB You may use any letter more than once.",
      },
      {
        t: "quiz",
        id: "t3d21-doc-khoi-dong",
        kind: "fill",
        title: "Khởi động — gõ A, B hoặc C (4 câu)",
        items: [
          { q: "1. The change had a negative effect on activities outside lessons.", answers: ["C"] },
          { q: "2. The benefit of the new timetable did not last.", answers: ["B"] },
          { q: "3. The new timetable may make pupils' journeys safer.", answers: ["A"] },
          { q: "4. Results in one subject got a little better.", answers: ["A"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích khởi động",
        items: [
          "**1 — C.** Chen: “after-school sports clubs lost almost half their members” = negative effect on activities outside lessons. Nguyên nhân nằm sau **because** (lessons finished at 4.30).",
          "**2 — B.** Whitfield: “the rise… had largely disappeared by the end of the first term” = did not last. Bẫy: Nair cũng nhắc attendance (“accepts Whitfield's point about attendance”) — nhưng đó chỉ là phần nhượng bộ trước **nevertheless**; ý của bà ở vế sau. Cùng chủ đề, khác ý.",
          "**3 — A.** Lần nhắc thứ HAI của Nair, cuối đoạn: “pupils who travel to school one day less each week spend far less time on dangerous country roads” ⇒ ít thời gian trên đường nguy hiểm thì đi lại an toàn hơn (may ↔ suy luận có rào đón). Ai chỉ đọc lần nhắc đầu sẽ không thấy ý này.",
          "**4 — A.** “test scores in reading improved slightly” = results in one subject got a little better (đổi loại từ: improved slightly → a little better). A dùng hai lần — đề có NB.",
          "Nhìn từ nối: **Although** attendance rose, he pointed out… ⇒ ý của Whitfield nằm ở mệnh đề chính (sau dấu phẩy), không phải “attendance rose”.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Luyện trọn bài — Questions 1–13 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ **20 phút** cho 13 câu. Gợi ý chia giờ: 2 phút quét tên + đọc nhận định · 9 phút cho câu 1–8 · 6 phút cho câu 9–13 · 3 phút soát. Bài đọc tự soạn để luyện dạng bài: **tên các nhà nghiên cứu và số liệu là hư cấu**.",
      },
      {
        t: "passage",
        title: "What Is a Street Tree Worth?",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "For most of the twentieth century, the engineers who ran the world's cities regarded street trees as decoration at best and as a nuisance at worst. Roots lifted pavements, fallen leaves blocked drains, and branches brought down power lines in every storm. Over the last two decades, however, researchers from several different fields have tried to measure what trees actually do for a city. Their results have encouraged many councils to announce ambitious planting programmes — yet the researchers themselves do not always agree about what should be planted, where, or even whether planting is the right priority." },
          { label: "B", text: "The best-known argument for urban trees concerns heat. The climate scientist Helena Brandt measured surface temperatures in forty streets over three summers and found that asphalt shaded by trees could be up to twelve degrees cooler than asphalt in full sun, while the air beneath the branches was one to two degrees cooler. The benefit, however, depended almost entirely on the size of the tree. Large trees with wide, dense branches made a clear difference, whereas young trees with narrow crowns had hardly any effect at all. “A city that plants ten thousand saplings and declares the problem solved will be disappointed,” Brandt says. Because real cooling arrives only fifteen to twenty years after planting, she believes that keeping existing mature trees alive deserves far more attention than putting new ones in the ground." },
          { label: "C", text: "Trees also appear to be good for business. The economist Marcus Oyelaran compared thousands of house sales and found that homes on tree-lined streets sold for around seven per cent more than similar homes a few streets away. In shopping streets with shade, customers stayed longer and spent more. Oyelaran is not simply an enthusiast, though. Owing to decades of unequal investment, wealthy districts already have far more trees than poor ones, and new planting tends to follow complaints from well-organised residents. As a result, he warns, a planting programme can actually widen the gap between rich and poor neighbourhoods. His advice is that councils should begin by drawing up a map of canopy cover — the proportion of the ground shaded by branches — and plant first where the figure is lowest." },
          { label: "D", text: "Sofia Lindqvist, who works in public health, followed three thousand older residents for six years. Those who lived on streets with trees walked more often and reported lower levels of stress, even after differences in income had been taken into account. Lindqvist is careful about what this proves. It is possible, she admits, that healthier people simply choose to live in greener streets, in which case the trees are not responsible for the difference. Despite this uncertainty, she considers the evidence strong enough for governments to act on. She has also recorded one clearly harmful effect. Certain trees release enormous quantities of pollen, and in districts where a single such species lines every street, hospital admissions for asthma rise sharply each spring." },
          { label: "E", text: "The most sceptical voice belongs to Daniel Reyes, a civil engineer who spent twenty years working for a city council. Reyes is not against trees; his objection is to the way their value is calculated. Reports that put a price on shade and cleaner air, he argues, rarely include the bill for pruning, for repairing damaged pavements, or for the insurance claims that follow every storm, leading councils to plant more trees than they can afford to look after. The consequences are easy to see. In the cities he has studied, up to a third of newly planted street trees were dead within five years, most of them from a simple lack of watering. Reyes would rather see fewer trees planted in larger soil pits, each with a budget for ten years of care." },
          { label: "F", text: "For the ecologist Aiko Tanabe, the central question is not how many trees but which ones. Many cities have filled their streets with just one or two species because these were cheap and grew quickly. Consequently, a single disease or insect pest can destroy whole avenues within a few years, as happened to the elms of Europe and North America in the last century. Tanabe recommends that no species should make up more than 10% of a city's trees. She also questions the popular belief that native species are always the best choice. While native trees support more insects and birds, some of them cannot tolerate the heat and polluted air of a modern street, and rising temperatures will make matters worse. In her view, the safest stock is a mixture of native trees and carefully selected species from elsewhere." },
          { label: "G", text: "What these researchers share is more striking than what divides them. All five regard the number of trees planted as a poor measure of success. Whether the benefit is counted in degrees, in money or in visits to the doctor, it comes from large, healthy trees growing in the right places — and that depends less on planting day than on the unglamorous decades of care that follow it." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–8** — Look at the following statements (Questions 1–8) and the list of researchers below. Match each statement with the correct researcher, **A–E**. **NB** You may use any letter more than once.",
      },
      {
        t: "table",
        head: ["Chữ", "List of researchers"],
        rows: [["A", "Helena Brandt"], ["B", "Marcus Oyelaran"], ["C", "Sofia Lindqvist"], ["D", "Daniel Reyes"], ["E", "Aiko Tanabe"]],
      },
      {
        t: "quiz",
        id: "t3d21-doc-noi",
        kind: "fill",
        title: "Questions 1–8 — gõ MỘT chữ cái A–E",
        items: [
          { q: "1. Tree-planting schemes may increase inequality between different parts of a city.", answers: ["B"] },
          { q: "2. Protecting old trees is more useful than planting young ones.", answers: ["A"] },
          { q: "3. People who live near trees may be healthier for reasons that have nothing to do with the trees.", answers: ["C"] },
          { q: "4. Many young trees fail to survive because nobody looks after them.", answers: ["D"] },
          { q: "5. Trees brought in from other regions can sometimes be a better choice than local ones.", answers: ["E"] },
          { q: "6. Planting the same kind of tree throughout an area can make some residents ill.", answers: ["C"] },
          { q: "7. Estimates of what trees are worth often leave out the costs.", answers: ["D"] },
          { q: "8. Depending on very few kinds of tree puts a city's whole tree population in danger.", answers: ["E"] },
        ],
      },
      {
        t: "p",
        text: "**Questions 9–13** — Complete the sentences below. Choose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.",
      },
      {
        t: "quiz",
        id: "t3d21-doc-cau",
        kind: "fill",
        title: "Questions 9–13 — Sentence completion (NO MORE THAN TWO WORDS AND/OR A NUMBER)",
        items: [
          { q: "9. In the past, city engineers thought of street trees either as ___ or as a source of trouble.", answers: ["decoration"] },
          { q: "10. Brandt found that young trees which had ___ made almost no difference to temperatures.", answers: ["narrow crowns"] },
          { q: "11. Oyelaran suggests that the first step for a council is to make a map showing ___ .", answers: ["canopy cover"] },
          { q: "12. Reyes believes new trees should be given bigger ___ and long-term funding.", answers: ["soil pits"] },
          { q: "13. Tanabe advises that one species should account for no more than ___ of all the trees in a city.", answers: ["10%", "10 %", "10 per cent", "10 percent", "ten per cent", "ten percent"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 1–4",
        items: [
          "**1 — B (Oyelaran, đoạn C).** “a planting programme can actually **widen the gap between rich and poor neighbourhoods**” = increase inequality between different parts of a city. Nguyên nhân đứng sau **Owing to**; kết quả đứng sau **As a result** — đúng hai công cụ của bài 1.",
          "**2 — A (Brandt, đoạn B).** “keeping existing mature trees alive **deserves far more attention than** putting new ones in the ground” = protecting old trees is more useful than planting young ones (mature → old; putting in the ground → planting).",
          "**3 — C (Lindqvist, đoạn D).** “It is possible… that healthier people simply choose to live in greener streets, in which case the trees are not responsible for the difference.” Chú ý mức độ: **may** trong đề ↔ **It is possible** trong bài.",
          "**4 — D (Reyes, đoạn E).** “up to a third of newly planted street trees were dead within five years, most of them from a simple **lack of watering**” = fail to survive because nobody looks after them (danh từ → mệnh đề because). Bẫy: Brandt (A) cũng nói về cây non (saplings) nhưng ý của bà là cây non **không làm mát**, không phải cây non chết.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 5–8",
        items: [
          "**5 — E (Tanabe, đoạn F).** “She also questions the popular belief that native species are always the best choice… the safest stock is a mixture of native trees and carefully selected **species from elsewhere**.” native → local; from elsewhere → brought in from other regions.",
          "**6 — C (Lindqvist, đoạn D)** — câu bẫy chính của bài. “in districts where **a single such species** lines every street, hospital admissions for **asthma** rise sharply” = same kind of tree… make residents ill. Tanabe (E) cũng nói “one or two species”, nhưng hậu quả bà nêu là cây bị **bệnh / sâu** phá, không phải người bị ốm.",
          "**7 — D (Reyes, đoạn E).** “Reports that put a price on shade and cleaner air… **rarely include the bill** for pruning, for repairing damaged pavements, or for the insurance claims” = estimates… often leave out the costs (rarely include → often leave out: đổi phủ định ↔ khẳng định).",
          "**8 — E (Tanabe, đoạn F).** “Many cities have filled their streets with just one or two species… **Consequently**, a single disease or insect pest can destroy whole avenues.” = depending on very few kinds… puts the whole tree population in danger.",
          "Thống kê: A một lần · B một lần · C hai lần · D hai lần · E hai lần. Nếu bạn gạch tên sau lần dùng đầu, bạn mất chắc 3 câu.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 9–13",
        items: [
          "**9 — decoration.** Đoạn A: “regarded street trees as **decoration** at best and as a nuisance at worst”. a nuisance → a source of trouble; chỗ trống cần danh từ song song với “a source of trouble”.",
          "**10 — narrow crowns.** Đoạn B: “whereas young trees with **narrow crowns** had hardly any effect at all”. had hardly any effect → made almost no difference. Đáp án nằm ngay SAU whereas — từ đối lập báo ý ngược với câu trước.",
          "**11 — canopy cover.** Đoạn C: “councils should begin by drawing up a map of **canopy cover**”. begin by → the first step; drawing up a map of → make a map showing.",
          "**12 — soil pits.** Đoạn E: “fewer trees planted in larger **soil pits**, each with a budget for ten years of care”. larger → bigger; a budget for ten years → long-term funding.",
          "**13 — 10%.** Đoạn F: “no species should make up more than **10%** of a city's trees”. make up → account for. Bẫy số: seven per cent (giá nhà), a third (cây chết) — đúng dạng số nhưng sai người, sai ý.",
        ],
      },
      {
        t: "table",
        head: ["Số câu đúng / 13", "Ước tính", "Việc nên làm"],
        rows: [
          ["11–13", "vững mức band 6.5+ ở dạng này", "Lần sau ép giờ xuống 17 phút"],
          ["9–10", "đạt mục tiêu band 6", "Xem lại câu sai thuộc bẫy nào ở mục 3"],
          ["6–8", "khoảng band 5–5.5", "Làm lại bước 2 và 4: khoanh tên, đọc trọn vùng từng người"],
          ["≤ 5", "chưa nắm quy trình", "Ôn Tập 1 Ngày 10 rồi làm lại bài khởi động mục 4"],
        ],
        caption: "Band ghi ở đây là ước tính cho riêng bài này, không phải điểm thi.",
      },

      /* ── 6 ── */
      { t: "h", text: "6. Soi lại bài đọc: nhượng bộ và nhân quả trong văn bản thật" },
      {
        t: "p",
        text: "Bài đọc dùng gần như mọi công cụ của bài Ngữ pháp hôm nay. Trong Reading, các từ này là **biển chỉ đường**: sau however / whereas / despite là ý ĐỔI HƯỚNG — và đề rất hay hỏi vào đúng chỗ đổi hướng đó (câu 1, 3, 10 ở trên). Điền lại từ nối vào các câu lấy từ bài (không nhìn bài).",
      },
      {
        t: "quiz",
        id: "t3d21-doc-tu-noi",
        kind: "fill",
        title: "Điền từ nối đúng như trong bài: whereas · owing to · as a result · despite · consequently · while · because (7 câu, mỗi từ một lần)",
        items: [
          { q: "1. Large trees made a clear difference, ___ young trees with narrow crowns had hardly any effect.", answers: ["whereas"] },
          { q: "2. ___ real cooling arrives only fifteen to twenty years after planting, she believes that existing trees deserve more attention.", answers: ["because"] },
          { q: "3. ___ decades of unequal investment, wealthy districts already have far more trees than poor ones.", answers: ["owing to"] },
          { q: "4. New planting tends to follow complaints from well-organised residents. ___, a planting programme can widen the gap.", answers: ["as a result"] },
          { q: "5. ___ this uncertainty, she considers the evidence strong enough for governments to act on.", answers: ["despite"] },
          { q: "6. Many cities have planted just one or two species. ___, a single disease can destroy whole avenues.", answers: ["consequently"] },
          { q: "7. ___ native trees support more insects and birds, some of them cannot tolerate polluted air.", answers: ["while"] },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "nuisance", pos: "n", ipa: "/ˈnjuːsns/", vi: "điều phiền toái", ex: "For engineers, fallen leaves were simply a nuisance.", exVi: "Với kỹ sư, lá rụng chỉ là thứ phiền toái.", more: "a public nuisance · cause a nuisance" },
          { w: "mature", pos: "adj", ipa: "/məˈtʃʊə/", vi: "trưởng thành, đã lớn hẳn (cây, người)", ex: "A mature tree gives far more shade than a young one.", exVi: "Cây trưởng thành cho bóng mát nhiều hơn hẳn cây non.", more: "trái nghĩa: young / immature · danh từ: maturity · mature student = sinh viên lớn tuổi" },
          { w: "sapling", pos: "n", ipa: "/ˈsæplɪŋ/", vi: "cây non (mới trồng)", ex: "Half of the saplings died during the dry summer.", exVi: "Một nửa số cây non chết trong mùa hè khô hạn.", more: "plant a sapling" },
          { w: "unequal", pos: "adj", ipa: "/ʌnˈiːkwəl/", vi: "không đồng đều, bất bình đẳng", ex: "Unequal investment has left poor districts with few parks.", exVi: "Đầu tư không đồng đều khiến các quận nghèo có ít công viên.", more: "danh từ: inequality · widen / narrow the gap between rich and poor" },
          { w: "sceptical", pos: "adj", ipa: "/ˈskeptɪkl/", vi: "hoài nghi", ex: "Many residents are sceptical about the council's promises.", exVi: "Nhiều cư dân hoài nghi về lời hứa của hội đồng thành phố.", more: "be sceptical **about / of** · danh từ: a sceptic · Anh-Mỹ viết skeptical" },
          { w: "maintenance", pos: "n", ipa: "/ˈmeɪntənəns/", vi: "sự bảo dưỡng, chăm sóc định kỳ", ex: "The budget does not cover the maintenance of older buildings.", exVi: "Ngân sách không bao gồm việc bảo dưỡng các toà nhà cũ.", more: "động từ: maintain · maintenance costs · lỗi chính tả hay gặp: ~~maintainance~~" },
          { w: "tolerate", pos: "v", ipa: "/ˈtɒləreɪt/", vi: "chịu được, chịu đựng", ex: "Few plants can tolerate such dry conditions.", exVi: "Ít loài cây chịu được điều kiện khô như vậy.", more: "danh từ: tolerance · tính từ: tolerant **of**" },
          { w: "take into account", pos: "phr", ipa: "/teɪk ˈɪntə əˈkaʊnt/", vi: "tính đến, xét đến", ex: "The study took differences in income into account.", exVi: "Nghiên cứu đã tính đến khác biệt về thu nhập.", more: "= take account of · consider · rất hay gặp trong bài đọc về nghiên cứu" },
        ],
      },
      {
        t: "note",
        title: "💡 Nhìn lại cả bài — rút kinh nghiệm",
        items: [
          "Bạn mất bao nhiêu phút cho câu 1–8? Trên 11 phút ⇒ lần sau bắt buộc đi theo NGƯỜI (bước 4).",
          "Câu 6 sai ⇒ bạn dính bẫy “cùng chủ đề, khác ý”. Tập thói quen đọc hết nhận định tới chữ cuối.",
          "Câu 3 sai ⇒ luyện lại ngôn ngữ mức độ: may · might · it is possible that · is careful about.",
          "Chép 3 cặp paraphrase bạn thấy khó nhất vào sổ lỗi (mục Sổ lỗi của khoá): cột trái = bài viết, cột phải = đề viết.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t3d21-nghe",
    kind: "listening",
    title: "Nghe: Đề Listening đủ 40 câu lần 1 của Tập 3 — Part 1–4, đúng giờ",
    goal: "Làm trọn một đề Listening 40 câu theo đúng trình tự IELTS (Part 1 Form · Part 2 MCQ + Matching · Part 3 MCQ + Matching · Part 4 Note completion), mỗi băng nghe MỘT lần, tự chấm, đổi điểm thô ra band ước tính và lập bảng lỗi theo Part để biết ôn ngày nào — mục tiêu chặng này ≥ 20/40, cuối Tập 3 ≥ 23/40 (band 6.0).",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này làm gì · đo band nào",
        items: [
          "Đây là **đề Listening đủ 40 câu đầu tiên của Tập 3** (Tập 2 Ngày 23 là đề đầu tiên của cả khoá). Hôm nay không học dạng mới — hôm nay **đo**: sau 20 ngày, bạn đang ở đâu so với mốc 23/40.",
          "Bốn Part, độ khó tăng dần: **Part 1** hội thoại đặt dịch vụ (điền phiếu) · **Part 2** một người nói về đời sống (trắc nghiệm + nối) · **Part 3** thảo luận học thuật ba người (trắc nghiệm + nối) · **Part 4** bài giảng (điền ghi chú).",
          "Luật thi: mỗi băng nghe **MỘT lần**. Trước mỗi Part tự cho mình **30–40 giây đọc câu hỏi**. Không mở lời thoại cho tới khi chấm xong cả 40 câu.",
          "Giọng trộn: Anh · Úc · Canada · Mỹ — như đề thật (các giọng đã làm quen ở Ngày 1, 4, 12).",
          "Sau khi chấm: đổi điểm ra band (bảng mục “Chấm điểm”) và điền **bảng lỗi theo Part** — mỗi dạng sai chỉ thẳng về một Ngày để ôn.",
          "Cuối bài có phần phát âm /ð/ trong **although · whereas · nevertheless** — đúng các từ của bài Ngữ pháp hôm nay, và cũng là các từ báo “đổi ý” bạn cần NGHE ra trong băng.",
        ],
      },

      { t: "h", text: "Trước khi bắt đầu" },
      {
        t: "table",
        head: ["Part", "Câu", "Nội dung", "Dạng câu hỏi", "Giọng", "Mục tiêu band 6"],
        rows: [
          ["1", "1–10", "Đặt dịch vụ chuyển nhà", "Form completion", "Anh (nữ) · Úc (nam)", "≥ 8/10"],
          ["2", "11–20", "Buổi hướng dẫn tình nguyện viên liên hoan phim", "MCQ (3 lựa chọn) · Matching", "Canada (nữ)", "≥ 6/10"],
          ["3", "21–30", "Hai sinh viên và giảng viên bàn về báo cáo", "MCQ (3 lựa chọn) · Matching", "Mỹ (nữ) · Anh (nam, nữ)", "≥ 5/10"],
          ["4", "31–40", "Bài giảng: lịch sử chuỗi lạnh", "Note completion", "Mỹ (nam)", "≥ 5/10"],
        ],
        caption: "Tổng mục tiêu: 24/40 ≈ band 6.0. Hôm nay đạt 20/40 là đúng tiến độ.",
      },
      {
        t: "note",
        title: "📌 Luật chơi — làm đúng như thi thật",
        items: [
          "Chuẩn bị giấy nháp. Làm một mạch cả 4 Part (khoảng 25–30 phút), không dừng giữa chừng để tra từ.",
          "Mỗi Part: đọc câu hỏi 30–40 giây → bấm nghe MỘT lần → điền ngay → chuyển Part kế. Lỡ một câu thì **bỏ**, nhìn câu tiếp theo (Tập 2 Ngày 19).",
          "Đáp án điền: đúng **giới hạn số từ** in HOA trong câu lệnh; sai chính tả = sai; số viết bằng chữ số cho nhanh.",
          "Xong cả 40 câu, dành **2 phút kiểm** (bản thi máy không có 10 phút chép đáp án): chính tả, số ít / số nhiều, câu còn trống thì đoán.",
          "Chỉ sau đó mới bấm chấm và đọc phần giải thích.",
        ],
      },

      /* ── PART 1 ── */
      { t: "h", text: "PART 1 — Questions 1–10: Booking a removal van" },
      {
        t: "p",
        text: "**Questions 1–10** — Complete the form below. Write **ONE WORD AND/OR A NUMBER** for each answer. Đọc phiếu 30 giây: đoán loại từ cho từng chỗ trống (tên riêng sẽ được đánh vần; số; danh từ).",
      },
      {
        t: "note",
        title: "HARTLEY REMOVALS — Customer booking form",
        items: [
          "Customer's name: Liam (1) ___",
          "Moving from: 27 (2) ___ Street — flat on the (3) ___ floor (no lift)",
          "Moving to: 5 Canal Row (ground floor)",
          "Date of move: (4) ___ March",
          "Van size: (5) ___",
          "Special item: a (6) ___ (needs two extra staff)",
          "Number of boxes to be delivered in advance: (7) ___",
          "Insurance: premium cover — up to £ (8) ___ per item",
          "Total price quoted: £ (9) ___",
          "Customer must arrange: a parking (10) ___ for the van",
        ],
      },
      {
        t: "listen",
        id: "t3d21-nghe-p1",
        title: "Part 1 — Booking a removal van",
        dan: { so: "Day 21, Part 1", boiCanh: "a telephone conversation between a woman who works for a removal company and a man who is moving to a new flat.", cau: [1, 10] },
        note: "Khoảng 3,5 phút. Giọng Anh (nữ) và giọng Úc (nam). ONE WORD AND/OR A NUMBER.",
        lines: [
          { who: "Agent", voice: "uk-nu", text: "Good morning, Hartley Removals. Grace speaking. How can I help?", vi: "Chào buổi sáng, Hartley Removals. Grace xin nghe. Tôi giúp gì được ạ?" },
          { who: "Liam", voice: "au-nam", text: "Hi. I'm moving flat next month and I'd like to get a quote, please.", vi: "Chào chị. Tháng sau tôi chuyển căn hộ và muốn xin báo giá." },
          { who: "Agent", voice: "uk-nu", text: "Of course. Let me take a few details. Can I have your name?", vi: "Vâng. Cho tôi xin vài thông tin. Anh tên gì ạ?" },
          { who: "Liam", voice: "au-nam", text: "It's Liam Keogh. That's K-E-O-G-H.", vi: "Liam Keogh. K-E-O-G-H." },
          { who: "Agent", voice: "uk-nu", text: "K-E-O-G-H. Thank you. And where are you moving from?", vi: "K-E-O-G-H. Cảm ơn anh. Anh chuyển từ đâu?" },
          { who: "Liam", voice: "au-nam", text: "Twenty-seven Arden Street. Arden is A-R-D-E-N. It's a flat, and I should warn you, it's on the third floor and there's no lift.", vi: "Số 27 phố Arden. A-R-D-E-N. Là căn hộ, và tôi phải báo trước là nó ở tầng ba, không có thang máy." },
          { who: "Agent", voice: "uk-nu", text: "Third floor, no lift. Right, I'll come back to that. And the new address?", vi: "Tầng ba, không thang máy. Được, lát tôi quay lại chuyện đó. Còn địa chỉ mới?" },
          { who: "Liam", voice: "au-nam", text: "Five Canal Row. That one's on the ground floor, thankfully.", vi: "Số 5 Canal Row. Chỗ đó ở tầng trệt, may quá." },
          { who: "Agent", voice: "uk-nu", text: "Good. When were you hoping to move?", vi: "Tốt. Anh định chuyển khi nào?" },
          { who: "Liam", voice: "au-nam", text: "Ideally Saturday the sixteenth of March.", vi: "Lý tưởng là thứ Bảy ngày 16 tháng Ba." },
          { who: "Agent", voice: "uk-nu", text: "Let me check… I'm afraid we're fully booked on the sixteenth. I could do the Friday before, the fifteenth, or the following Saturday, the twenty-third.", vi: "Để tôi xem… Tiếc là ngày 16 chúng tôi kín lịch. Tôi xếp được thứ Sáu trước đó, ngày 15, hoặc thứ Bảy tuần sau, ngày 23." },
          { who: "Liam", voice: "au-nam", text: "I can't take the Friday off work, so it'll have to be the twenty-third.", vi: "Thứ Sáu tôi không nghỉ làm được, nên đành ngày 23." },
          { who: "Agent", voice: "uk-nu", text: "The twenty-third it is. Now, how much are you moving? Is it a one-bedroom flat?", vi: "Vậy ngày 23. Anh chuyển nhiều đồ không? Căn hộ một phòng ngủ à?" },
          { who: "Liam", voice: "au-nam", text: "Yes, one bedroom. I assumed a small van would be enough.", vi: "Vâng, một phòng ngủ. Tôi nghĩ xe nhỏ là đủ." },
          { who: "Agent", voice: "uk-nu", text: "It usually is. Do you have any large items — a wardrobe, a big sofa?", vi: "Thường là đủ. Anh có món nào lớn không — tủ quần áo, sofa to?" },
          { who: "Liam", voice: "au-nam", text: "The wardrobe's built in, so that's staying. But I do have a piano. It was my grandmother's.", vi: "Tủ quần áo gắn tường nên để lại. Nhưng tôi có một cây đàn piano. Của bà tôi để lại." },
          { who: "Agent", voice: "uk-nu", text: "Ah. In that case the small van won't do — a piano has to stand upright, so you'll need the medium one. And we send two extra staff for a piano, especially with those stairs.", vi: "À. Vậy thì xe nhỏ không được — piano phải để đứng, nên anh cần xe cỡ trung. Và có piano thì chúng tôi cử thêm hai nhân viên, nhất là với cầu thang như thế." },
          { who: "Liam", voice: "au-nam", text: "Fair enough. Medium, then.", vi: "Cũng hợp lý. Vậy cỡ trung." },
          { who: "Agent", voice: "uk-nu", text: "Would you like us to deliver boxes beforehand? Most people in a one-bedroom flat take twenty.", vi: "Anh có muốn chúng tôi giao thùng trước không? Phần lớn người ở căn một phòng ngủ lấy 20 thùng." },
          { who: "Liam", voice: "au-nam", text: "I've got a lot of books, actually. Could you make it thirty?", vi: "Thật ra tôi có nhiều sách lắm. Chị cho 30 thùng được không?" },
          { who: "Agent", voice: "uk-nu", text: "Thirty, no problem. Now, insurance. Our standard cover is included and pays up to two thousand pounds per item. With a piano, though, I'd recommend premium cover, which goes up to five thousand.", vi: "30 thùng, không vấn đề. Giờ đến bảo hiểm. Gói tiêu chuẩn đã gồm trong giá, chi trả tối đa 2.000 bảng mỗi món. Nhưng có piano thì tôi khuyên gói cao cấp, lên tới 5.000 bảng." },
          { who: "Liam", voice: "au-nam", text: "Yes, I'll take the premium, please.", vi: "Vâng, tôi lấy gói cao cấp." },
          { who: "Agent", voice: "uk-nu", text: "Right. So the basic price for a medium van is three hundred and forty pounds. There's a forty-five pound charge for the stairs, which brings the total to three hundred and eighty-five.", vi: "Được. Giá cơ bản cho xe cỡ trung là 340 bảng. Có phụ phí cầu thang 45 bảng, tổng cộng là 385 bảng." },
          { who: "Liam", voice: "au-nam", text: "Three eighty-five. OK, that's less than I expected.", vi: "385. Được, ít hơn tôi nghĩ." },
          { who: "Agent", voice: "uk-nu", text: "One last thing. Arden Street is residents' parking only, isn't it? You'll need to get a permit from the council so we can park the van outside. We can't arrange that for you, I'm afraid.", vi: "Điều cuối. Phố Arden chỉ cho cư dân đỗ xe đúng không? Anh cần xin giấy phép của hội đồng thành phố để chúng tôi đỗ xe tải bên ngoài. Việc đó chúng tôi không làm thay anh được." },
          { who: "Liam", voice: "au-nam", text: "A permit. Sure, I'll sort that out this week.", vi: "Giấy phép. Được, tuần này tôi sẽ lo." },
        ],
      },
      {
        t: "quiz",
        id: "t3d21-nghe-p1-dien",
        kind: "fill",
        title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Customer's name: Liam ___", answers: ["Keogh"] },
          { q: "2. Moving from: 27 ___ Street", answers: ["Arden"] },
          { q: "3. flat on the ___ floor", answers: ["third", "3rd", "3"] },
          { q: "4. Date of move: ___ March", answers: ["23", "23rd", "twenty-third"] },
          { q: "5. Van size: ___", answers: ["medium"] },
          { q: "6. Special item: a ___", answers: ["piano"] },
          { q: "7. Number of boxes: ___", answers: ["30", "thirty"] },
          { q: "8. Premium cover — up to £ ___ per item", answers: ["5000", "5,000", "five thousand"] },
          { q: "9. Total price quoted: £ ___", answers: ["385"] },
          { q: "10. a parking ___ for the van", answers: ["permit"] },
        ],
      },

      /* ── PART 2 ── */
      { t: "h", text: "PART 2 — Questions 11–20: Volunteering at the Lakeshore Film Festival" },
      {
        t: "p",
        text: "**Questions 11–15** — Choose the correct letter, **A, B or C**. **Questions 16–20** — What is the main requirement for each volunteer role? Choose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 16–20. Đọc 40 giây: gạch chân từ khoá trong thân câu 11–15, đọc lướt 7 yêu cầu A–G.",
      },
      {
        t: "table",
        head: ["Chữ", "Requirements (Questions 16–20)"],
        rows: [
          ["A", "a driving licence"],
          ["B", "experience of handling money"],
          ["C", "a second language"],
          ["D", "the ability to stand for long periods"],
          ["E", "good knowledge of the town"],
          ["F", "availability in the evenings"],
          ["G", "confidence with computers"],
        ],
        caption: "Roles: 16 Ticket desk · 17 Ushers · 18 Information point · 19 Guest escorts · 20 Festival shop",
      },
      {
        t: "listen",
        id: "t3d21-nghe-p2",
        title: "Part 2 — Volunteering at the Lakeshore Film Festival",
        dan: { so: "Day 21, Part 2", boiCanh: "a volunteer coordinator talking to a group of new volunteers at a film festival.", cau: [11, 20] },
        note: "Khoảng 4 phút. Giọng Canada (nữ). Một người nói.",
        lines: [
          { who: "Coordinator", voice: "ca-nu", text: "Good evening, everybody, and thank you for signing up as volunteers for the Lakeshore Film Festival. My name's Danielle, and I coordinate the volunteer team. Some of you helped out last year, so let me start with what's changed. The main venue is still the Regent Cinema on Bridge Street. We tried outdoor screenings in Harbour Park last summer, but half of them were rained off, so we won't be repeating that. What is new is the length: the festival now runs for twelve days instead of ten, because we simply had too many good films to fit in.", vi: "Chào buổi tối mọi người, cảm ơn các bạn đã đăng ký làm tình nguyện viên cho Liên hoan phim Lakeshore. Tôi là Danielle, điều phối đội tình nguyện. Một số bạn đã giúp năm ngoái, nên tôi bắt đầu bằng những gì thay đổi. Địa điểm chính vẫn là rạp Regent trên phố Bridge. Hè năm ngoái chúng tôi thử chiếu ngoài trời ở công viên Harbour, nhưng một nửa số buổi bị huỷ vì mưa, nên sẽ không lặp lại. Điểm mới là thời lượng: liên hoan giờ kéo dài 12 ngày thay vì 10, vì đơn giản là có quá nhiều phim hay." },
          { who: "Coordinator", voice: "ca-nu", text: "A longer festival means we need more of your time. Last year we asked everyone for at least four shifts, and to be honest, we were short of people by the final weekend. So this year the minimum is six shifts across the twelve days. If you can do more, wonderful, but six is what we need from each of you.", vi: "Liên hoan dài hơn nghĩa là chúng tôi cần nhiều thời gian của các bạn hơn. Năm ngoái chúng tôi đề nghị mỗi người ít nhất bốn ca, và thật lòng mà nói, tới cuối tuần cuối cùng thì thiếu người. Nên năm nay tối thiểu là sáu ca trong 12 ngày. Làm nhiều hơn thì tuyệt, nhưng mỗi bạn cần sáu ca." },
          { who: "Coordinator", voice: "ca-nu", text: "Now, what do you get in return? People always ask about free films. You'll each receive two tickets, which you can use for any screening that isn't sold out — so not a ticket for every film, I'm afraid. You'll be given a festival T-shirt to wear on duty, but we do ask for those back at the end. What everybody gets, on every shift, however short, is a voucher for a hot meal at the Regent café.", vi: "Vậy các bạn nhận lại gì? Ai cũng hỏi về xem phim miễn phí. Mỗi bạn nhận hai vé, dùng cho bất cứ suất nào chưa bán hết — tức là không phải vé cho mọi phim, tiếc vậy. Các bạn được phát áo phông liên hoan để mặc khi làm, nhưng cuối đợt chúng tôi xin lại. Thứ mà ai cũng có, ở mọi ca, dù ngắn đến đâu, là một phiếu ăn nóng ở quán cà phê của rạp Regent." },
          { who: "Coordinator", voice: "ca-nu", text: "Before the festival opens, you'll all need to do a training session. We'd planned to hold it at the Regent, but the main hall is being repainted that week, and the meeting room at the town library was already booked. So we've decided to run it as a video call next Thursday at seven. You'll get the link by email.", vi: "Trước khi liên hoan khai mạc, tất cả các bạn cần dự một buổi tập huấn. Chúng tôi định tổ chức ở rạp Regent, nhưng sảnh chính đang được sơn lại tuần đó, còn phòng họp của thư viện thị trấn thì đã có người đặt. Nên chúng tôi quyết định làm qua cuộc gọi video vào thứ Năm tuần sau lúc bảy giờ. Các bạn sẽ nhận đường link qua email." },
          { who: "Coordinator", voice: "ca-nu", text: "One more general point. If you find you can't make a shift, please don't try to swap with a friend — we lose track of who's where. And the volunteer website can't process changes yet, although we hope it will next year. So the rule is: call me, at least twenty-four hours ahead, and I'll find a replacement.", vi: "Thêm một điểm chung. Nếu bạn không đi được một ca, xin đừng tự đổi với bạn bè — chúng tôi sẽ không theo dõi được ai ở đâu. Và trang web tình nguyện chưa xử lý được việc đổi ca, dù chúng tôi hy vọng năm sau sẽ được. Nên quy tắc là: gọi điện cho tôi, trước ít nhất 24 giờ, tôi sẽ tìm người thay." },
          { who: "Coordinator", voice: "ca-nu", text: "Right, let me go through the roles, so you can tell me tonight which one suits you. First, the ticket desk. People assume you need to be good with money, but in fact the desk stopped taking cash two years ago. Everything goes through our booking software, so what matters is that you're comfortable using a computer and can learn a new system quickly.", vi: "Giờ tôi điểm qua các vị trí, để tối nay các bạn cho tôi biết vị trí nào hợp. Đầu tiên, quầy vé. Mọi người tưởng phải giỏi tiền nong, nhưng thật ra quầy đã ngừng nhận tiền mặt hai năm nay. Mọi thứ qua phần mềm đặt vé, nên điều quan trọng là bạn thoải mái dùng máy tính và học hệ thống mới nhanh." },
          { who: "Coordinator", voice: "ca-nu", text: "Ushers show people to their seats and check tickets at the door. Don't worry about being on your feet all night — there are seats for ushers at the back of each hall. The thing is, nearly all our screenings start after six, so there's no point choosing this role unless you're free in the evenings.", vi: "Người soát vé dẫn khách vào chỗ và kiểm vé ở cửa. Đừng lo phải đứng cả tối — cuối mỗi phòng chiếu có ghế cho người soát vé. Vấn đề là gần như mọi suất chiếu bắt đầu sau sáu giờ, nên chọn vị trí này chẳng ích gì trừ khi bạn rảnh buổi tối." },
          { who: "Coordinator", voice: "ca-nu", text: "The information point is in the cinema entrance. You might think you'd have to know every street in town, but we give you maps and a list of answers to the usual questions. What we can't give you is languages. A third of our visitors come from abroad, so for this role we're looking for people who can speak a language other than English.", vi: "Điểm thông tin đặt ở lối vào rạp. Bạn có thể nghĩ phải thuộc mọi con phố trong thị trấn, nhưng chúng tôi phát bản đồ và danh sách trả lời cho các câu hỏi thường gặp. Thứ chúng tôi không phát được là ngoại ngữ. Một phần ba khách đến từ nước ngoài, nên vị trí này chúng tôi tìm người nói được một thứ tiếng ngoài tiếng Anh." },
          { who: "Coordinator", voice: "ca-nu", text: "Guest escorts look after the directors and actors who visit. You won't be driving anyone — we hire professional drivers for that — so a licence isn't necessary. Your job is to walk guests between the hotel, the cinema and the restaurants, without getting lost, so you really do need to know your way around town.", vi: "Người hộ tống khách chăm sóc các đạo diễn và diễn viên đến dự. Bạn sẽ không lái xe chở ai — việc đó chúng tôi thuê tài xế chuyên nghiệp — nên không cần bằng lái. Việc của bạn là đi bộ đưa khách giữa khách sạn, rạp và nhà hàng mà không lạc, nên bạn thật sự cần thông thuộc đường trong thị trấn." },
          { who: "Coordinator", voice: "ca-nu", text: "And finally, the festival shop, which sells posters, bags and so on. Unlike the ticket desk, the shop still takes cash as well as cards, and at the end of each day the till has to be counted. So here we do want someone who has worked with money before, in a shop or a café, for example.", vi: "Và cuối cùng, cửa hàng liên hoan, bán áp phích, túi và các thứ khác. Khác với quầy vé, cửa hàng vẫn nhận tiền mặt lẫn thẻ, và cuối mỗi ngày phải đếm két. Nên ở đây chúng tôi cần người từng làm việc với tiền, ở cửa hàng hay quán cà phê chẳng hạn." },
        ],
      },
      {
        t: "mcq",
        id: "t3d21-nghe-p2-chon",
        title: "Questions 11–15 — Choose the correct letter, A, B or C",
        items: [
          { q: "11. What is different about the festival this year?", options: ["A. It lasts longer.", "B. It has a new main venue.", "C. It includes outdoor screenings."], correct: 0, why: "“What is new is the length: the festival now runs for twelve days instead of ten.” B sai: “The main venue is still the Regent”. C sai: chiếu ngoài trời là chuyện năm NGOÁI và “we won't be repeating that”." },
          { q: "12. Volunteers must work a minimum of", options: ["A. four shifts.", "B. ten shifts.", "C. six shifts."], correct: 2, why: "“this year the minimum is six shifts”. Four là con số năm ngoái (bẫy thời gian). Ten / twelve là số ngày, không phải số ca." },
          { q: "13. What does every volunteer receive?", options: ["A. a ticket for every film", "B. a meal on each shift", "C. a T-shirt to keep"], correct: 1, why: "“What everybody gets, on every shift… is a voucher for a hot meal”. A sai: chỉ hai vé (“not a ticket for every film”). C sai: áo phải trả lại (“we do ask for those back”)." },
          { q: "14. The training session will take place", options: ["A. at the Regent Cinema.", "B. in the town library.", "C. online."], correct: 2, why: "“we've decided to run it as a video call” = online. Regent đang sơn lại; phòng thư viện đã có người đặt — hai phương án bị loại trước khi đáp án xuất hiện." },
          { q: "15. Volunteers who cannot attend a shift should", options: ["A. find another volunteer to replace them.", "B. telephone the coordinator.", "C. change the shift on the website."], correct: 1, why: "“the rule is: call me, at least twenty-four hours ahead”. A sai: “please don't try to swap with a friend”. C sai: “the volunteer website can't process changes yet, although we hope it will next year” — although báo điều chưa xảy ra." },
        ],
      },
      {
        t: "quiz",
        id: "t3d21-nghe-p2-noi",
        kind: "fill",
        title: "Questions 16–20 — gõ MỘT chữ cái A–G",
        items: [
          { q: "16. Ticket desk", answers: ["G"] },
          { q: "17. Ushers", answers: ["F"] },
          { q: "18. Information point", answers: ["C"] },
          { q: "19. Guest escorts", answers: ["E"] },
          { q: "20. Festival shop", answers: ["B"] },
        ],
      },

      /* ── PART 3 ── */
      { t: "h", text: "PART 3 — Questions 21–30: A report on food waste in the university canteen" },
      {
        t: "p",
        text: "**Questions 21–26** — Choose the correct letter, **A, B or C**. **Questions 27–30** — What do the students decide to do about each section of their report? Choose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 27–30. Ba người nói: **Maya** (giọng Mỹ), **Ben** (giọng Anh) và giảng viên **Dr Okafor** (giọng Anh, nữ). Đọc 40 giây.",
      },
      {
        t: "table",
        head: ["Chữ", "Decisions (Questions 27–30)"],
        rows: [
          ["A", "make it shorter"],
          ["B", "rewrite it completely"],
          ["C", "move it to the appendix"],
          ["D", "leave it as it is"],
          ["E", "add more data"],
          ["F", "delete it"],
        ],
        caption: "Sections: 27 Introduction · 28 Method · 29 Results · 30 Recommendations",
      },
      {
        t: "listen",
        id: "t3d21-nghe-p3",
        title: "Part 3 — A report on food waste in the university canteen",
        dan: { so: "Day 21, Part 3", boiCanh: "two students, Maya and Ben, talking to their tutor, Dr Okafor, about the first draft of a report.", cau: [21, 30] },
        note: "Khoảng 4,5 phút. Maya: giọng Mỹ · Ben: giọng Anh · Dr Okafor: giọng Anh (nữ).",
        lines: [
          { who: "Dr Okafor", voice: "uk-nu", text: "Come in, both of you. I've read your draft on food waste in the canteen. Before we go through it, remind me how you ended up with this topic. It wasn't on the list I gave out, was it?", vi: "Mời hai em vào. Cô đã đọc bản nháp về lãng phí thực phẩm ở căng tin. Trước khi xem kỹ, nhắc cô xem sao các em chọn đề tài này. Nó không có trong danh sách cô phát đúng không?" },
          { who: "Ben", voice: "uk-nam", text: "No, it wasn't. It came from me, really. I worked in the canteen kitchen part-time last year, and I couldn't believe how much went in the bins every evening.", vi: "Dạ không. Thật ra là từ em. Năm ngoái em làm thêm trong bếp căng tin, và em không tin nổi lượng đồ ăn đổ vào thùng rác mỗi tối." },
          { who: "Maya", voice: "us-nu", text: "And I was happy to go along with it. We did check whether anyone had looked at it before. There was a student project five years ago, so it's not completely new, but the canteen has changed a lot since then.", vi: "Và em vui vẻ làm theo. Tụi em có kiểm tra xem đã ai nghiên cứu chưa. Có một dự án sinh viên năm năm trước, nên không hẳn là mới, nhưng căng tin đã thay đổi nhiều từ đó." },
          { who: "Dr Okafor", voice: "uk-nu", text: "Fine. Now, your main finding. You weighed the waste for two weeks. Was there anything you didn't expect?", vi: "Được. Giờ đến phát hiện chính. Các em cân rác trong hai tuần. Có điều gì các em không ngờ tới không?" },
          { who: "Maya", voice: "us-nu", text: "Definitely. We'd assumed the big problem would be what students leave on their plates. In fact, more than half of the total came from the kitchen itself — food that was cooked and never served.", vi: "Chắc chắn có ạ. Tụi em tưởng vấn đề lớn là phần sinh viên bỏ thừa trên đĩa. Thực tế, hơn một nửa tổng lượng đến từ chính nhà bếp — đồ đã nấu mà không bao giờ được phục vụ." },
          { who: "Ben", voice: "uk-nam", text: "Yes, and it was fairly constant through the week. We thought Mondays might be worse, but they weren't.", vi: "Vâng, và nó khá đều suốt tuần. Tụi em nghĩ thứ Hai có thể tệ hơn, nhưng không phải." },
          { who: "Dr Okafor", voice: "uk-nu", text: "That's a strong result. Let's talk about the survey, though, because I have some doubts there.", vi: "Đó là một kết quả mạnh. Nhưng nói về khảo sát đi, vì ở đó cô có vài băn khoăn." },
          { who: "Ben", voice: "uk-nam", text: "Is it the number of responses? We got two hundred and ten.", vi: "Có phải là số phiếu trả lời không ạ? Tụi em có 210 phiếu." },
          { who: "Dr Okafor", voice: "uk-nu", text: "No, that's plenty, and the questions themselves are clear — I can see you tested them first. My concern is the timing. You handed it out in exam week, when the canteen is half empty and people eat in a hurry. I'm not sure those answers tell us about a normal week.", vi: "Không, thế là nhiều rồi, và bản thân câu hỏi cũng rõ — cô thấy các em đã thử trước. Cô lo về thời điểm. Các em phát phiếu vào tuần thi, khi căng tin vắng một nửa và mọi người ăn vội. Cô không chắc những câu trả lời đó nói lên điều gì về một tuần bình thường." },
          { who: "Maya", voice: "us-nu", text: "That's fair. We'll have to say so in the limitations.", vi: "Đúng ạ. Tụi em sẽ phải nêu điều đó trong phần hạn chế." },
          { who: "Dr Okafor", voice: "uk-nu", text: "The staff interviews, on the other hand, are excellent. You only did four, and I know you were worried that wasn't enough, but what the cooks told you about ordering is the most useful material in the whole report. I'd make more of it.", vi: "Ngược lại, các cuộc phỏng vấn nhân viên thì xuất sắc. Các em chỉ làm bốn cuộc, cô biết các em lo là chưa đủ, nhưng điều các đầu bếp kể về việc đặt hàng là tư liệu hữu ích nhất trong cả báo cáo. Cô sẽ khai thác nó nhiều hơn." },
          { who: "Ben", voice: "uk-nam", text: "Good. Can we ask about the recommendations? Maya and I don't completely agree. We both think the canteen should offer a smaller portion at a lower price, and we both want to get rid of trays, since people take less when they have to carry it.", vi: "Tốt quá. Tụi em hỏi về phần khuyến nghị được không ạ? Maya và em chưa hoàn toàn thống nhất. Cả hai đều nghĩ căng tin nên có suất nhỏ hơn với giá thấp hơn, và cả hai đều muốn bỏ khay, vì người ta lấy ít hơn khi phải tự bê." },
          { who: "Maya", voice: "us-nu", text: "Where we differ is charging by weight. Ben thinks it would work. I think students would hate standing in line while every plate is weighed, and the canteen would lose customers.", vi: "Chỗ tụi em khác nhau là tính tiền theo cân. Ben nghĩ sẽ hiệu quả. Em nghĩ sinh viên sẽ ghét phải xếp hàng chờ cân từng đĩa, và căng tin sẽ mất khách." },
          { who: "Dr Okafor", voice: "uk-nu", text: "Then present it as an option and give both sides. You don't have to agree. What would help is something to compare your figures with. Ben, I know you'd like to weigh the waste for another week…", vi: "Vậy thì trình bày nó như một phương án và nêu cả hai phía. Các em không cần phải đồng ý với nhau. Điều sẽ giúp ích là có thứ để so sánh số liệu của các em. Ben, cô biết em muốn cân rác thêm một tuần…" },
          { who: "Ben", voice: "uk-nam", text: "I would, but there isn't time before the deadline.", vi: "Em muốn, nhưng không kịp trước hạn nộp." },
          { who: "Dr Okafor", voice: "uk-nu", text: "No. But Northfield University published figures for its canteens last year. Set your results beside theirs before we meet again.", vi: "Đúng. Nhưng Đại học Northfield đã công bố số liệu về căng tin của họ năm ngoái. Trước buổi gặp tới, hãy đặt kết quả của các em cạnh số của họ." },
          { who: "Maya", voice: "us-nu", text: "We can do that. Could we go through the sections quickly? The introduction first.", vi: "Tụi em làm được ạ. Mình đi nhanh qua các phần được không cô? Phần mở đầu trước." },
          { who: "Dr Okafor", voice: "uk-nu", text: "It's well written, but two pages on global food waste is too much for a report about one canteen. Cut it down to half a page.", vi: "Viết tốt, nhưng hai trang về lãng phí thực phẩm toàn cầu là quá nhiều cho một báo cáo về một căng tin. Cắt xuống nửa trang." },
          { who: "Ben", voice: "uk-nam", text: "OK, we'll cut it. And the method? I wondered whether the questionnaire should go in an appendix.", vi: "Vâng, tụi em sẽ cắt. Còn phần phương pháp? Em tự hỏi có nên đưa bảng hỏi vào phụ lục không." },
          { who: "Dr Okafor", voice: "uk-nu", text: "It's already there, isn't it? No, the method section is clear and complete. I wouldn't touch it.", vi: "Nó đã ở đó rồi mà? Không, phần phương pháp rõ ràng và đầy đủ. Cô sẽ không động vào." },
          { who: "Maya", voice: "us-nu", text: "And the results? I wasn't happy with our charts.", vi: "Còn phần kết quả? Em chưa hài lòng với biểu đồ của tụi em." },
          { who: "Dr Okafor", voice: "uk-nu", text: "The charts are fine as far as they go, but they only show totals for the fortnight. You have the daily figures, so put them in — a table for each day would do.", vi: "Biểu đồ thì ổn trong phạm vi của nó, nhưng chỉ cho thấy tổng của hai tuần. Các em có số liệu từng ngày, vậy đưa vào — mỗi ngày một bảng là được." },
          { who: "Ben", voice: "uk-nam", text: "So more figures in the results. And the recommendations, apart from the weighing question?", vi: "Vậy là thêm số liệu ở phần kết quả. Còn phần khuyến nghị, ngoài chuyện cân đĩa?" },
          { who: "Dr Okafor", voice: "uk-nu", text: "I'm afraid that section needs the most work. At the moment it's a list of general ideas that could apply to any canteen anywhere. None of them is linked to what you actually found. I wouldn't try to repair it. Start that section again from your findings.", vi: "Cô e là phần đó cần sửa nhiều nhất. Hiện giờ nó là một danh sách ý chung chung, áp cho căng tin nào ở đâu cũng được. Không ý nào gắn với điều các em thực sự tìm ra. Cô sẽ không cố vá nó. Hãy viết lại phần đó từ đầu, dựa trên các phát hiện." },
          { who: "Maya", voice: "us-nu", text: "From scratch. Right. We'll get started this weekend.", vi: "Từ đầu. Vâng. Cuối tuần này tụi em bắt tay vào." },
        ],
      },
      {
        t: "mcq",
        id: "t3d21-nghe-p3-chon",
        title: "Questions 21–26 — Choose the correct letter, A, B or C",
        items: [
          { q: "21. Why did Maya and Ben choose food waste as their topic?", options: ["A. It was suggested by their tutor.", "B. It had never been studied at the university.", "C. One of them had worked in the canteen."], correct: 2, why: "Ben: “I worked in the canteen kitchen part-time last year”. A sai: đề tài không có trong danh sách của giảng viên. B sai: đã có một dự án năm năm trước (“it's not completely new”)." },
          { q: "22. What surprised the students about the waste?", options: ["A. Most of it came from the kitchen.", "B. Most of it was left on plates.", "C. There was more of it on Mondays."], correct: 0, why: "Maya: “more than half of the total came from the kitchen itself”. B là điều họ TƯỞNG (“We'd assumed…”) — bẫy quá khứ hoàn thành. C: “We thought Mondays might be worse, but they weren't.”" },
          { q: "23. What problem does Dr Okafor see with the survey?", options: ["A. Too few students answered it.", "B. Some questions were unclear.", "C. It was done at an unsuitable time."], correct: 2, why: "“My concern is the timing. You handed it out in exam week”. A: 210 phiếu “that's plenty”. B: “the questions themselves are clear”." },
          { q: "24. What does Dr Okafor say about the interviews with staff?", options: ["A. There should have been more of them.", "B. They are the most valuable part of the report.", "C. They ought to have been recorded."], correct: 1, why: "“what the cooks told you… is the most useful material in the whole report”. A là nỗi lo của SINH VIÊN (“you were worried that wasn't enough”), không phải ý của cô. C không được nhắc." },
          { q: "25. Maya and Ben disagree about", options: ["A. offering smaller portions.", "B. charging for food by weight.", "C. removing trays."], correct: 1, why: "Maya: “Where we differ is charging by weight.” Với suất nhỏ và bỏ khay, Ben nói rõ “We both think… we both want…”." },
          { q: "26. What will the students do before the next meeting?", options: ["A. weigh the waste for another week", "B. interview the canteen manager", "C. compare their results with another university's"], correct: 2, why: "Dr Okafor: “Set your results beside theirs (Northfield University) before we meet again.” A: Ben muốn nhưng “there isn't time”. B không được nhắc." },
        ],
      },
      {
        t: "quiz",
        id: "t3d21-nghe-p3-noi",
        kind: "fill",
        title: "Questions 27–30 — gõ MỘT chữ cái A–F",
        items: [
          { q: "27. Introduction", answers: ["A"] },
          { q: "28. Method", answers: ["D"] },
          { q: "29. Results", answers: ["E"] },
          { q: "30. Recommendations", answers: ["B"] },
        ],
      },

      /* ── PART 4 ── */
      { t: "h", text: "PART 4 — Questions 31–40: Keeping things cold — a short history of the cold chain" },
      {
        t: "p",
        text: "**Questions 31–40** — Complete the notes below. Write **ONE WORD ONLY** for each answer. Đọc trang ghi chú 45 giây: ba tiêu đề nhỏ là ba chặng của bài giảng — nghe ra câu chuyển chặng thì biết mình đang ở đâu (Ngày 13).",
      },
      {
        t: "note",
        title: "THE COLD CHAIN — lecture notes (Questions 31–40)",
        items: [
          "**Before refrigeration** — food was dried, smoked or preserved with (31) ___",
          "natural ice was cut from lakes; ice houses were insulated with (32) ___",
          "by the 1830s, American ice was being shipped as far as (33) ___",
          "**Mechanical refrigeration** — the first companies to buy the machines produced (34) ___",
          "from about 1880, ships carried frozen (35) ___ from the southern hemisphere to Europe",
          "result: people in cities had a more varied (36) ___",
          "**In the home** — the gases in early refrigerators were (37) ___",
          "the safer gases introduced in the 1930s were later found to damage the ozone (38) ___",
          "**Today** — the cold chain is essential for (39) ___ as well as food",
          "in poorer countries, a lot of food is lost between the farm and the (40) ___",
        ],
      },
      {
        t: "listen",
        id: "t3d21-nghe-p4",
        title: "Part 4 — Keeping things cold",
        dan: { so: "Day 21, Part 4", boiCanh: "part of a lecture on the history of technology, about refrigeration and the cold chain.", cau: [31, 40] },
        note: "Khoảng 5 phút. Giọng Mỹ (nam). Một người nói, không có quãng nghỉ giữa bài. ONE WORD ONLY.",
        lines: [
          { who: "Lecturer", voice: "us-nam", text: "Good afternoon. Today I'd like to talk about a technology that most of us never think about, although our whole food system depends on it: refrigeration. More precisely, I want to look at what is called the cold chain — the unbroken series of cold spaces that carries food from the place where it is produced to the place where it is eaten. I'll start with the world before refrigeration, then look at the machines themselves, then the home, and finish with the situation today.", vi: "Chào buổi chiều. Hôm nay tôi muốn nói về một công nghệ mà phần lớn chúng ta không bao giờ nghĩ tới, dù cả hệ thống thực phẩm phụ thuộc vào nó: làm lạnh. Chính xác hơn, tôi muốn xem xét thứ gọi là chuỗi lạnh — chuỗi không gian lạnh liên tục đưa thực phẩm từ nơi sản xuất tới nơi tiêu thụ. Tôi sẽ bắt đầu với thế giới trước khi có máy lạnh, rồi tới bản thân máy móc, rồi gia đình, và kết bằng tình hình hôm nay." },
          { who: "Lecturer", voice: "us-nam", text: "For most of history, people had very few ways to stop food from going bad. Fish and fruit were dried in the sun. Meat was hung in smoke. But the most important method by far was salt, which was so valuable that in some places it was used as money. The trouble with all of these methods is that they change the taste of the food. Nobody could eat fresh meat in a city in summer.", vi: "Trong phần lớn lịch sử, con người có rất ít cách để giữ thực phẩm khỏi hỏng. Cá và trái cây được phơi nắng. Thịt được treo trong khói. Nhưng phương pháp quan trọng hơn hẳn là muối, thứ quý đến mức ở một số nơi được dùng làm tiền. Vấn đề của mọi phương pháp này là chúng làm đổi vị thức ăn. Không ai ăn được thịt tươi ở thành phố vào mùa hè." },
          { who: "Lecturer", voice: "us-nam", text: "The first real alternative was natural ice. In cold regions, blocks of ice were cut from frozen lakes in winter and stored in buildings called ice houses. You might expect the walls to have been packed with straw, and straw was certainly tried, but what worked best, and what became standard, was sawdust — a waste product that timber mills were happy to give away. Packed in sawdust, ice could survive a whole summer. In the United States this became a serious industry. By the eighteen-thirties, ice from New England was being sold not only in the Caribbean but as far away as India, a voyage of four months, and despite the heat more than half of the first cargo arrived unmelted.", vi: "Giải pháp thay thế thực sự đầu tiên là băng tự nhiên. Ở vùng lạnh, các khối băng được cắt từ hồ đóng băng vào mùa đông và trữ trong những toà nhà gọi là nhà băng. Bạn có thể nghĩ tường được nhồi rơm, và rơm quả có được thử, nhưng thứ hiệu quả nhất, và trở thành tiêu chuẩn, là mùn cưa — một phế phẩm mà các xưởng gỗ sẵn lòng cho không. Nhồi trong mùn cưa, băng có thể tồn tại cả mùa hè. Ở Mỹ, việc này thành một ngành nghiêm túc. Tới thập niên 1830, băng từ New England được bán không chỉ ở vùng Caribe mà xa tới tận Ấn Độ, một chuyến đi bốn tháng, và bất chấp cái nóng, hơn một nửa chuyến hàng đầu tiên tới nơi mà chưa tan." },
          { who: "Lecturer", voice: "us-nam", text: "Let's move on to the machines. Mechanical refrigeration was developed in the middle of the nineteenth century, and it's interesting to ask who the first customers were. Not butchers, and not dairies, as you might guess. The first businesses to invest in these large and expensive machines were the makers of beer, because certain kinds of beer can only be produced at low temperatures, and natural ice was unreliable in a warm winter.", vi: "Chuyển sang máy móc. Làm lạnh cơ học được phát triển vào giữa thế kỷ 19, và thật thú vị khi hỏi ai là khách hàng đầu tiên. Không phải hàng thịt, cũng không phải xưởng sữa như bạn có thể đoán. Những doanh nghiệp đầu tiên đầu tư vào các cỗ máy to và đắt này là các nhà làm bia, vì một số loại bia chỉ sản xuất được ở nhiệt độ thấp, mà băng tự nhiên thì không đáng tin vào mùa đông ấm." },
          { who: "Lecturer", voice: "us-nam", text: "The step that really changed the world came around eighteen-eighty, when refrigeration was put on ships. Australia, New Zealand and Argentina had millions of sheep and cattle, which up to then had been kept mainly for wool and leather, because there was no way of selling what else they produced to distant customers. Refrigerated ships made it possible to send frozen meat to Europe, twelve thousand miles away. Butter and fruit followed some years later. As a result, the price of food in European cities fell, and, just as importantly, ordinary families began to enjoy a far more varied diet than their grandparents had known.", vi: "Bước thật sự thay đổi thế giới đến vào khoảng năm 1880, khi máy lạnh được đưa lên tàu. Úc, New Zealand và Argentina có hàng triệu cừu và bò, mà cho tới lúc đó chủ yếu được nuôi lấy len và da, vì không có cách nào bán những thứ khác chúng tạo ra cho khách ở xa. Tàu lạnh giúp gửi thịt đông lạnh tới châu Âu, cách mười hai nghìn dặm. Bơ và trái cây theo sau vài năm. Kết quả là giá thực phẩm ở các thành phố châu Âu giảm, và quan trọng không kém, các gia đình bình thường bắt đầu có chế độ ăn đa dạng hơn hẳn thời ông bà họ." },
          { who: "Lecturer", voice: "us-nam", text: "Now, the home. Domestic refrigerators went on sale in the nineteen-tens, but they spread slowly, and not only because of the price. The gases that these early machines used were toxic, and when a pipe leaked, as pipes sometimes did, whole families were taken to hospital. In the nineteen-thirties, chemists introduced a new group of gases which did not burn and did not harm people, and sales rose quickly. It took more than forty years to discover that those same gases were damaging the ozone layer high above the earth, which led to an international agreement to replace them.", vi: "Giờ đến gia đình. Tủ lạnh gia dụng bắt đầu được bán vào thập niên 1910, nhưng phổ biến chậm, và không chỉ vì giá. Các loại khí mà những máy đời đầu dùng rất độc, và khi một ống bị rò, như đôi khi vẫn xảy ra, cả gia đình phải vào viện. Vào thập niên 1930, các nhà hoá học đưa ra một nhóm khí mới không cháy và không hại người, và doanh số tăng nhanh. Phải hơn bốn mươi năm sau mới phát hiện chính những khí đó đang phá tầng ozone cao phía trên trái đất, điều dẫn tới một thoả thuận quốc tế để thay thế chúng." },
          { who: "Lecturer", voice: "us-nam", text: "Finally, where are we today? The cold chain is no longer just a question of food. Modern health care depends on it too. Most vaccines have to be kept between two and eight degrees from the factory to the patient, and if the chain is broken for a few hours, they are useless. And the chain is far from complete. In wealthy countries, food is mostly wasted by shops and consumers. In poorer countries, by contrast, the loss happens much earlier: owing to a lack of cold storage and refrigerated trucks, a large share of fruit, vegetables and fish is spoiled somewhere between the farm and the market. Next week, we'll look at some low-cost solutions to that problem.", vi: "Cuối cùng, hôm nay ta đang ở đâu? Chuỗi lạnh không còn chỉ là chuyện thực phẩm. Y tế hiện đại cũng phụ thuộc vào nó. Phần lớn vắc-xin phải được giữ ở 2 đến 8 độ từ nhà máy tới bệnh nhân, và nếu chuỗi bị đứt vài giờ, chúng vô dụng. Và chuỗi còn lâu mới hoàn chỉnh. Ở nước giàu, thực phẩm chủ yếu bị lãng phí bởi cửa hàng và người tiêu dùng. Ngược lại, ở nước nghèo, thất thoát xảy ra sớm hơn nhiều: do thiếu kho lạnh và xe tải lạnh, một phần lớn trái cây, rau và cá bị hỏng đâu đó giữa nông trại và chợ. Tuần sau, ta sẽ xem một số giải pháp chi phí thấp cho vấn đề đó." },
        ],
      },
      {
        t: "quiz",
        id: "t3d21-nghe-p4-dien",
        kind: "fill",
        title: "Questions 31–40 — ONE WORD ONLY",
        items: [
          { q: "31. food was dried, smoked or preserved with ___", answers: ["salt"] },
          { q: "32. ice houses were insulated with ___", answers: ["sawdust"] },
          { q: "33. American ice was being shipped as far as ___", answers: ["India"] },
          { q: "34. the first companies to buy the machines produced ___", answers: ["beer"] },
          { q: "35. ships carried frozen ___ to Europe", answers: ["meat"] },
          { q: "36. people in cities had a more varied ___", answers: ["diet"] },
          { q: "37. the gases in early refrigerators were ___", answers: ["toxic", "poisonous"] },
          { q: "38. later found to damage the ozone ___", answers: ["layer"] },
          { q: "39. essential for ___ as well as food", answers: ["vaccines"] },
          { q: "40. food is lost between the farm and the ___", answers: ["market"] },
        ],
      },

      /* ── CHẤM ── */
      { t: "h", text: "Chấm điểm và đổi ra band" },
      {
        t: "table",
        head: ["Số câu đúng / 40", "Band ước tính", "So với mục tiêu Tập 3"],
        rows: [
          ["30 trở lên", "7.0+", "Vượt xa — chuyển trọng tâm sang Writing / Speaking"],
          ["26–29", "6.5", "Vượt mục tiêu"],
          ["23–25", "6.0", "Đạt mục tiêu cuối Tập 3"],
          ["18–22", "5.5", "Đúng tiến độ ở Ngày 21 — còn 9 ngày để lấy thêm 2–4 câu"],
          ["16–17", "5.0", "Chậm một nhịp — làm kỹ bảng lỗi bên dưới"],
          ["13–15", "4.5", "Ôn lại các Ngày nghe của Tập 2 trước khi đi tiếp"],
        ],
        caption: "Bảng quy đổi phổ biến của Listening; band ở đây là ƯỚC TÍNH từ một đề tự soạn.",
      },
      {
        t: "note",
        title: "Giải thích Part 1 — bẫy nằm ở đâu",
        items: [
          "**1 Keogh · 2 Arden** — tên riêng luôn được đánh vần; viết từng chữ cái ngay khi nghe.",
          "**3 third** — “it's on the third floor”. Bẫy: “ground floor” là của địa chỉ MỚI.",
          "**4 23** — ba ngày được nhắc: 16 (kín lịch), 15 (anh ấy không nghỉ làm được), 23 (“it'll have to be the twenty-third”). Đáp án là ngày được CHỐT.",
          "**5 medium** — Liam nghĩ “a small van would be enough”; nhân viên sửa: “the small van won't do… you'll need the medium one”.",
          "**6 piano** — wardrobe “is staying” (không chuyển) ⇒ không phải đáp án.",
          "**7 30** — “Most people… take twenty” rồi “Could you make it thirty?”. Cặp twenty / thirty: nghe nguyên âm đầu.",
          "**8 5000** — two thousand là gói tiêu chuẩn; phiếu hỏi gói **premium**.",
          "**9 385** — 340 là giá cơ bản; cộng 45 phụ phí cầu thang. Phiếu hỏi **Total**.",
          "**10 permit** — “You'll need to get a permit from the council”.",
        ],
      },
      {
        t: "note",
        title: "Giải thích Part 2, câu 16–20 — mỗi vị trí có một phương án bị BÁC trước",
        items: [
          "**16 G** — “what matters is that you're comfortable using a computer”. Bị bác: B (“the desk stopped taking cash two years ago”).",
          "**17 F** — “no point choosing this role unless you're free in the evenings”. Bị bác: D (“Don't worry about being on your feet all night”).",
          "**18 C** — “people who can speak a language other than English”. Bị bác: E (“we give you maps”).",
          "**19 E** — “you really do need to know your way around town”. Bị bác: A (“You won't be driving anyone… a licence isn't necessary”).",
          "**20 B** — “someone who has worked with money before”. Chú ý **Unlike the ticket desk** — từ đối lập của bài Ngữ pháp báo trước điều ngược lại.",
          "Mẫu chung của Matching Part 2 ở band 6: người nói nêu điều bạn **tưởng** cần (People assume… / You might think… / Don't worry about…) rồi mới nêu điều THẬT cần. Đáp án luôn ở vế sau but / in fact / the thing is.",
        ],
      },
      {
        t: "note",
        title: "Giải thích Part 3, câu 27–30",
        items: [
          "**27 A** — “two pages… is too much… Cut it down to half a page” = make it shorter.",
          "**28 D** — “the method section is clear and complete. I wouldn't touch it” = leave it as it is. Bẫy C: Ben hỏi về appendix, nhưng bảng hỏi “is already there”.",
          "**29 E** — “they only show totals… You have the daily figures, so put them in” = add more data. Bẫy: Maya “wasn't happy with our charts” nghe như phải làm lại, nhưng cô nói “The charts are fine”.",
          "**30 B** — “I wouldn't try to repair it. Start that section again from your findings” = rewrite it completely. Maya xác nhận: “From scratch.”",
          "Phương án thừa: C (move to appendix), F (delete).",
        ],
      },
      {
        t: "note",
        title: "Giải thích Part 4",
        items: [
          "**31 salt** — “the most important method by far was salt”. dried / smoked đã có sẵn trong ghi chú.",
          "**32 sawdust** — bẫy: “You might expect… straw, and straw was certainly tried, **but** what worked best… was sawdust”.",
          "**33 India** — “not only in the Caribbean but as far away as India”. Ghi chú viết “as far as” ⇒ nơi XA NHẤT.",
          "**34 beer** — “Not butchers, and not dairies… The first businesses… were the makers of beer”.",
          "**35 meat** — wool và leather là thứ đã bán TỪ TRƯỚC; butter và fruit “followed some years later”.",
          "**36 diet** — “a far more varied diet”. Chú ý “the price of food… fell” là kết quả khác, không khớp chỗ trống (a more varied ___).",
          "**37 toxic** — “The gases that these early machines used were toxic”.",
          "**38 layer** — “damaging the ozone layer”.",
          "**39 vaccines** — “Modern health care depends on it too. Most vaccines have to be kept between two and eight degrees”.",
          "**40 market** — “spoiled somewhere between the farm and the market”. Nghe ra **by contrast** và **owing to** — hai từ của bài Ngữ pháp — là biết câu trả lời sắp tới.",
        ],
      },
      {
        t: "table",
        head: ["Bạn sai nhiều ở", "Nguyên nhân thường gặp", "Ôn lại"],
        rows: [
          ["Part 1 (câu 1–10) — sai ≥ 3", "bẫy đổi ý, số, chính tả", "Tập 3 Ngày 1 (Part 1 giọng trộn) · Ngày 5 (số liệu) · Ngày 16"],
          ["Part 2 MCQ (11–15)", "chọn phương án nghe thấy đầu tiên", "Tập 3 Ngày 4 · Ngày 12"],
          ["Matching (16–20, 27–30)", "không theo kịp thứ tự; bị phương án “bị bác” lừa", "Tập 3 Ngày 8 · Ngày 20"],
          ["Part 3 MCQ (21–26)", "nhầm ai nói ý nào; nhầm điều “tưởng” với điều thật", "Tập 3 Ngày 8 · Ngày 17 · Tập 2 Ngày 13"],
          ["Part 4 (31–40)", "lạc chặng; không đoán trước loại từ", "Tập 3 Ngày 13 (note completion) · Tập 2 Ngày 19"],
          ["Sai rải rác vì giọng Canada / Úc", "chưa quen nguyên âm", "Tập 3 Ngày 12 (CA) · Tập 2 Ngày 15 (AU)"],
        ],
        caption: "Ghi số câu đúng từng Part vào Sổ lỗi. Đề 40 câu lần 2 của Tập 3 ở Ngày 29 — khi đó so lại.",
      },
      {
        t: "note",
        title: "💡 Mẹo: nghe lại đúng cách sau khi chấm",
        items: [
          "Lượt 2: nghe lại từng Part, KHÔNG nhìn lời thoại, chỉ để tìm câu chứa đáp án bạn đã sai.",
          "Lượt 3: mở lời thoại, gạch chân từ báo đổi ý (but · in fact · actually · though · however · whereas · unlike). Đếm xem bao nhiêu đáp án nằm ngay SAU các từ đó — bạn sẽ thấy đó là phần lớn các câu mình sai.",
          "Chọn 5 câu trong lời thoại để **nói đuổi** (shadowing): nghe một câu, dừng, nhắc lại đúng nhịp.",
        ],
      },

      /* ── PHÁT ÂM ── */
      { t: "h", text: "Phát âm: /ð/ trong although · whereas · nevertheless · the other" },
      {
        t: "p",
        text: "Các từ nhượng bộ – đối lập hôm nay đầy âm **/ð/**: al**th**ough /ɔːlˈðəʊ/, **th**ough /ðəʊ/, never**th**eless /ˌnevəðəˈles/, on **th**e o**th**er hand, ra**th**er **th**an, nei**th**er, whe**th**er. (whereas /weərˈæz/ không có /ð/ nhưng luôn đi cùng **the**: whereas **th**e…). Người Việt hay đọc /ð/ thành /d/ hoặc /z/ (~~ôn-đâu~~, ~~ôn-zâu~~). Cách đặt: đầu lưỡi **chạm nhẹ mặt sau răng trên** (hoặc thò ra giữa hai răng một chút), **rung dây thanh**, hơi lùa qua khe. Tập 1 Ngày 3 và Tập 2 Ngày 3 đã học âm này ở từ đơn; hôm nay luyện trong **từ nối** — đọc nhẹ, nhanh, không nhấn.",
      },
      {
        t: "table",
        head: ["Từ", "IPA (Anh-Anh)", "Hay đọc sai thành", "Lưu ý"],
        rows: [
          ["although", "/ɔːlˈðəʊ/", "~~/ɔːlˈdəʊ/~~ · ~~/ɔːnˈzəʊ/~~", "nhấn âm tiết 2; /l/ rõ rồi mới /ð/"],
          ["even though", "/ˈiːvn ðəʊ/", "~~/ˈiːvən təʊ/~~", "/n/ nối thẳng sang /ð/"],
          ["nevertheless", "/ˌnevəðəˈles/", "~~/ˌnevətəˈles/~~", "nhấn âm cuối; -the- đọc /ðə/ rất nhẹ"],
          ["on the other hand", "/ɒn ði ˈʌðə hænd/", "~~/ɒn də ˈʌdə/~~", "the trước nguyên âm đọc /ði/; hai âm /ð/ liền nhau"],
          ["rather than", "/ˈrɑːðə ðən/", "~~/ˈrɑːdə den/~~", "than đọc yếu /ðən/"],
          ["whether · weather", "/ˈweðə/", "~~/ˈwedə/~~", "hai từ đọc GIỐNG nhau"],
          ["method · think (để so)", "/ˈmeθəd/ · /θɪŋk/", "", "/θ/ KHÔNG rung — đặt tay lên cổ để phân biệt với /ð/"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo tập /ð/ trong từ nối",
        items: [
          "Đặt hai ngón tay lên cổ họng: /ð/ phải thấy **rung**; /θ/ thì không.",
          "Tập chuỗi: /z/ kéo dài “zzzz” → đưa đầu lưỡi lên chạm răng trên, vẫn giữ tiếng rung → thành /ðððð/.",
          "Trong câu, từ nối đọc **nhanh và nhẹ**; ý chính phía sau mới nhấn: although the WEAther was BAD…",
          "Nghe: khi băng có “though / although / whereas the…”, đó là tín hiệu ý sắp đổi — tai nhận ra /ð/ thì bắt bẫy nhanh hơn.",
        ],
      },
      { t: "rule", formula: "/ð/ = đầu lưỡi chạm răng trên + rung  ·  although /ɔːlˈðəʊ/ · though /ðəʊ/ · nevertheless /ˌnevəðəˈles/ · the other /ði ˈʌðə/", vi: "Không đọc thành /d/ hay /z/. Từ nối đọc nhẹ, ý chính mới nhấn." },
      {
        t: "phatam",
        id: "t3d21-phat-am",
        title: "Luyện phát âm — /ð/ trong câu nhượng bộ và đối lập",
        note: "Đọc tự nhiên, không nhấn từ nối. Azure chấm từng âm — nhìn điểm của các âm /ð/.",
        items: [
          { text: "Although the weather was bad, they went there.", ipa: "ɔːlðəʊ ðə weðə wɒz bæd ðeɪ went ðeə", vi: "Mặc dù thời tiết xấu, họ vẫn đến đó." },
          { text: "Even though they tried, neither of them passed.", ipa: "iːvn ðəʊ ðeɪ traɪd naɪðə əv ðəm pɑːst", vi: "Dù họ đã cố, không ai trong hai người đỗ." },
          { text: "Whereas the others stayed, their brother left.", ipa: "weəræz ði ʌðəz steɪd ðeə brʌðə left", vi: "Trong khi những người khác ở lại, anh trai họ rời đi." },
          { text: "Nevertheless, the method worked.", ipa: "nevəðəles ðə meθəd wɜːkt", vi: "Dù vậy, phương pháp vẫn hiệu quả." },
          { text: "On the other hand, there are further costs.", ipa: "ɒn ði ʌðə hænd ðeər ɑː fɜːðə kɒsts", vi: "Mặt khác, có thêm những chi phí nữa." },
          { text: "I would rather walk than take the bus.", ipa: "aɪ wʊd rɑːðə wɔːk ðən teɪk ðə bʌs", vi: "Tôi thà đi bộ còn hơn đi xe buýt." },
          { text: "I think that the weather is getting worse, though.", ipa: "aɪ θɪŋk ðæt ðə weðə ɪz ɡetɪŋ wɜːs ðəʊ", vi: "Nhưng mà tôi nghĩ thời tiết đang xấu đi." },
          { text: "They breathe more easily without the smoke.", ipa: "ðeɪ briːð mɔː iːzəli wɪðaʊt ðə sməʊk", vi: "Họ thở dễ hơn khi không có khói." },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d21-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 21",
    goal: "Ôn trọn Ngày 21: chọn đúng từ nhượng bộ / đối lập / nguyên nhân / kết quả theo thứ đứng sau nó, đổi cấu trúc mệnh đề ↔ cụm danh từ, dùng đúng chiều động từ nhân quả, nối nhận định với nhà nghiên cứu trên một đoạn đọc mới, nghe một thông báo ngắn có bẫy đổi ý và phân biệt /ð/ – /θ/.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (41 câu)",
        items: [
          "**I–IV (27 câu)** — ngữ pháp: điền từ nối, trắc nghiệm, dịch, viết lại câu.",
          "**V (5 câu)** — đọc: Matching features trên đoạn khoảng 160 từ, có NB.",
          "**VI (5 câu)** — nghe: một thông báo ngắn, giọng Úc.",
          "**VII (4 câu)** — phát âm /ð/ và /θ/.",
          "Đạt: ≥ 29/41. Sai phần nào, quay lại đúng mục ghi ở tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 21 trước khi làm bài",
        center: "Bốn quan hệ",
        branches: [
          { label: "Nhượng bộ", items: ["although / even though + S V", "despite / in spite of + N / V-ing", "However, / Nevertheless,"] },
          { label: "Đối lập", items: ["…, whereas / while + S V", "In contrast, / By contrast,", "On the contrary = bác bỏ"] },
          { label: "Nguyên nhân", items: ["because / since / as + S V", "because of / due to / owing to + N", "result from · stem from"] },
          { label: "Kết quả", items: ["As a result, / Therefore,", ", which means that…", "lead to · result in · , causing…"] },
        ],
      },

      { t: "h", text: "I. Điền từ nối (8 câu) — ôn Ngữ pháp mục 2–7" },
      {
        t: "quiz",
        id: "t3d21-bt-dien",
        kind: "fill",
        title: "I. Điền: although · despite · whereas · however · because of · since · as a result · which (mỗi từ / cụm một lần)",
        items: [
          { q: "1. ___ living in London for ten years, he has never visited the British Museum.", answers: ["despite"] },
          { q: "2. The north of the island is dry and rocky, ___ the south is covered in forest.", answers: ["whereas"] },
          { q: "3. ___ the test was difficult, most of the class passed.", answers: ["although"] },
          { q: "4. Several flights were delayed ___ fog at the airport.", answers: ["because of"] },
          { q: "5. The company cut its prices by 20%. ___, sales doubled within a year.", answers: ["as a result"] },
          { q: "6. ___ everyone already knows the rules, we can start the game immediately.", answers: ["since"] },
          { q: "7. The new library is beautiful. It is, ___, far too small for the number of students.", answers: ["however"] },
          { q: "8. Most shops close at five, ___ means that office workers have to shop at weekends.", answers: ["which"] },
        ],
      },

      { t: "h", text: "II. Chọn đáp án đúng (8 câu) — ôn Ngữ pháp mục 3–8" },
      {
        t: "mcq",
        id: "t3d21-bt-chon",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "___ of the bad reviews, the film made a huge profit.", options: ["Despite", "In spite", "Although", "Even"], correct: 1, why: "Sau chỗ trống có “of” ⇒ In spite of. Despite không đi với of." },
          { q: "The rise in house prices has ___ many young people leaving the capital.", options: ["resulted from", "been due", "caused to", "led to"], correct: 3, why: "Giá nhà tăng → người trẻ rời đi: nguyên nhân + lead to + N / V-ing. cause không có to trước tân ngữ." },
          { q: "Her success ___ years of hard work rather than luck.", options: ["stems from", "results in", "leads to", "causes"], correct: 0, why: "Thành công ← nhiều năm làm việc: kết quả + stem FROM + nguyên nhân." },
          { q: "The café was losing money. ___, the owner refused to close it.", options: ["Whereas", "Despite", "Nevertheless", "Although"], correct: 2, why: "Mở câu mới, có dấu phẩy theo sau, nghĩa “dù vậy vẫn” ⇒ Nevertheless." },
          { q: "Which sentence is correct?", options: ["Because of the roads were icy, schools closed.", "The roads were icy, therefore schools closed.", "Because the roads were icy, so schools closed.", "Owing to the icy roads, schools closed."], correct: 3, why: "D: owing to + cụm danh từ. A: because of + mệnh đề (sai). B: comma splice. C: because… so… (thừa)." },
          { q: "Advertising has a powerful effect ___ children's eating habits.", options: ["to", "on", "for", "in"], correct: 1, why: "an effect / impact ON + đối tượng chịu ảnh hưởng." },
          { q: "Women in the survey read an average of 11 books a year. ___, men read only six.", options: ["By contrast", "On the contrary", "Even though", "Whereas"], correct: 0, why: "Hai câu, hai nhóm khác nhau ⇒ By contrast,. On the contrary dùng để bác bỏ; whereas / even though không mở câu độc lập." },
          { q: "The dam was built in 1995, ___ thousands of villagers to move to the city.", options: ["forced", "it forced", "forcing", "which forcing"], correct: 2, why: "Mệnh đề kết quả rút gọn: , V-ing." },
        ],
      },

      { t: "h", text: "III. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d21-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng cấu trúc gợi ý",
        grammar: "although / despite / whereas / due to / lead to / As a result,",
        items: [
          { q: "Mặc dù lương thấp, cô ấy yêu công việc của mình. (despite)", answers: ["Despite the low salary, she loves her job.", "Despite her low salary, she loves her job.", "Despite the low pay, she loves her job.", "Despite the low wages, she loves her job."], hint: "despite · the low salary · love her job" },
          { q: "Người thành phố thường đi làm bằng phương tiện công cộng, trong khi người nông thôn phụ thuộc vào ô tô. (whereas)", answers: ["City people usually travel to work by public transport, whereas rural people depend on cars.", "People in cities usually travel to work by public transport, whereas people in rural areas depend on cars.", "City people usually go to work by public transport, whereas rural people depend on cars.", "People in cities usually go to work by public transport, whereas people in the countryside depend on cars.", "People in cities usually commute by public transport, whereas people in rural areas depend on cars."], hint: "travel to work by public transport · whereas · rural · depend on cars" },
          { q: "Việc hồ bị ô nhiễm chủ yếu là do rác thải từ các nhà máy. (be mainly due to)", answers: ["The pollution of the lake is mainly due to waste from factories.", "The pollution of the lake is mainly due to factory waste.", "The pollution in the lake is mainly due to waste from factories.", "The lake's pollution is mainly due to waste from factories."], hint: "the pollution of the lake · be mainly due to · waste from factories" },
          { q: "Thiếu ngủ có thể dẫn tới những vấn đề sức khoẻ nghiêm trọng. (lead to)", answers: ["A lack of sleep can lead to serious health problems.", "Lack of sleep can lead to serious health problems.", "Not getting enough sleep can lead to serious health problems."], hint: "a lack of sleep · lead to · serious health problems" },
          { q: "Mặc dù tôi hiểu quan điểm này, tôi không đồng ý với nó. (although)", answers: ["Although I understand this view, I do not agree with it.", "Although I understand this view, I don't agree with it.", "Although I understand this view, I disagree with it.", "Although I understand this point of view, I do not agree with it.", "Although I understand this opinion, I do not agree with it."], hint: "although · understand this view · agree with" },
          { q: "Nhà máy đóng cửa. Kết quả là 300 người mất việc. (As a result,)", answers: ["The factory closed. As a result, 300 people lost their jobs.", "The factory closed down. As a result, 300 people lost their jobs.", "The factory was closed. As a result, 300 people lost their jobs.", "The factory closed. As a result, three hundred people lost their jobs."], hint: "the factory closed · As a result, · lose their jobs" },
        ],
      },

      { t: "h", text: "IV. Viết lại câu (5 câu) — ôn Ngữ pháp mục 9" },
      {
        t: "quiz",
        id: "t3d21-bt-viet-lai",
        kind: "fill",
        title: "IV. Điền các từ còn thiếu sao cho nghĩa không đổi",
        items: [
          { q: "1. Although he was injured, he finished the race. → In spite of ___ ___, he finished the race. (2 từ)", answers: ["his injury", "being injured"] },
          { q: "2. The match was cancelled because it snowed heavily. → The match was cancelled due to ___ ___. (2 từ)", answers: ["heavy snow"] },
          { q: "3. Poor planning caused the delay. → The delay resulted ___ ___ ___. (3 từ)", answers: ["from poor planning"] },
          { q: "4. Despite the high unemployment rate, wages are rising. → Although the unemployment rate ___ ___, wages are rising. (2 từ)", answers: ["is high"] },
          { q: "5. The town has no cinema, so teenagers go to the next city. → The town has no cinema, ___ ___ that teenagers go to the next city. (2 từ)", answers: ["which means"] },
        ],
      },

      { t: "h", text: "V. Đọc — Matching features (5 câu) — ôn bài Đọc mục 2–3" },
      {
        t: "passage",
        title: "Working from Home: Three Studies",
        paras: [
          { text: "Since large numbers of office staff began working from home, researchers have tried to find out what the change means for companies and employees. **Carla Mendes** tracked 800 software engineers and found that those at home completed slightly more tasks per week; she warns, however, that younger staff learned new skills more slowly because they could no longer watch experienced colleagues at work. **James Okoro** is more positive. Despite accepting that some training is lost, he argues that the hours saved on commuting lead to better sleep and lower stress, which in turn reduces the number of sick days. **Ingrid Halvorsen** studied promotions rather than productivity. Although home workers in her sample performed just as well as office workers, they were far less likely to be promoted, owing to the simple fact that managers saw them less often. Mendes has since repeated her study and reports that the gap in learning disappears when junior staff come into the office two days a week." },
        ],
      },
      {
        t: "table",
        head: ["Chữ", "Researcher"],
        rows: [["A", "Carla Mendes"], ["B", "James Okoro"], ["C", "Ingrid Halvorsen"]],
        caption: "NB You may use any letter more than once.",
      },
      {
        t: "quiz",
        id: "t3d21-bt-doc",
        kind: "fill",
        title: "V. Gõ A, B hoặc C",
        items: [
          { q: "1. Working from home can damage a person's career prospects.", answers: ["C"] },
          { q: "2. Employees who do not travel to work take less time off for illness.", answers: ["B"] },
          { q: "3. New employees pick up skills less quickly when they are not in the office.", answers: ["A"] },
          { q: "4. A mixture of home and office working can solve one of the problems.", answers: ["A"] },
          { q: "5. People are judged partly on how visible they are to their bosses.", answers: ["C"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án V",
        items: [
          "**1 — C.** Halvorsen: “they were far less likely to be promoted” = damage career prospects.",
          "**2 — B.** Okoro: “hours saved on commuting lead to better sleep and lower stress, which in turn reduces the number of sick days”. Chuỗi hệ quả: lead to → which in turn.",
          "**3 — A.** Mendes: “younger staff learned new skills more slowly”. Bẫy: Okoro cũng nhắc “some training is lost”, nhưng đó là điều ông **thừa nhận** sau Despite — ý chính của ông ở vế sau.",
          "**4 — A.** Lần nhắc thứ hai của Mendes (câu cuối): “the gap in learning disappears when junior staff come into the office two days a week”.",
          "**5 — C.** Halvorsen: “owing to the simple fact that managers saw them less often”. Nguyên nhân đứng sau owing to.",
        ],
      },

      { t: "h", text: "VI. Nghe — một thông báo ngắn (5 câu) — ôn bài Nghe" },
      {
        t: "note",
        title: "Riverside Sports Centre — changes (Questions 1–5) · ONE WORD AND/OR A NUMBER",
        items: [
          "The swimming pool will be closed for (1) ___ weeks.",
          "Reason for closure: a problem with the (2) ___",
          "During the closure, members can swim free at the (3) ___ pool.",
          "The gym will now open at (4) ___ a.m. on weekdays.",
          "Yoga classes are moving to the (5) ___ on the first floor.",
        ],
      },
      {
        t: "listen",
        id: "t3d21-bt-nghe",
        title: "Changes at Riverside Sports Centre",
        dan: { so: "Day 21, Homework recording", boiCanh: "a recorded message for members of a sports centre.", cau: [1, 5] },
        note: "Khoảng 1 phút 15 giây. Giọng Úc (nữ). Nghe MỘT lần.",
        lines: [
          { who: "Manager", voice: "au-nu", text: "Hello, and thank you for calling Riverside Sports Centre. This is a message for all members about some changes over the coming month. First, the swimming pool. We had hoped to keep it open through the spring. However, the engineers have found a fault in the heating, and as a result the pool will have to close from Monday. We were originally told the work would take six weeks, but the company now says it can be done in four.", vi: "Xin chào, cảm ơn bạn đã gọi tới Trung tâm thể thao Riverside. Đây là thông báo cho mọi hội viên về một số thay đổi trong tháng tới. Đầu tiên, bể bơi. Chúng tôi đã hy vọng giữ bể mở suốt mùa xuân. Tuy nhiên, kỹ sư phát hiện một lỗi ở hệ thống sưởi, và do đó bể sẽ phải đóng từ thứ Hai. Ban đầu chúng tôi được báo công việc mất sáu tuần, nhưng công ty giờ nói có thể xong trong bốn tuần." },
          { who: "Manager", voice: "au-nu", text: "While the pool is closed, your membership card will let you swim at no charge at the university pool on Station Road. Please note that it doesn't cover the city pool, which is run by a different organisation.", vi: "Trong lúc bể đóng, thẻ hội viên cho phép bạn bơi miễn phí ở bể của trường đại học trên đường Station. Xin lưu ý thẻ không dùng được ở bể thành phố, do một tổ chức khác quản lý." },
          { who: "Manager", voice: "au-nu", text: "There is some good news, though. Owing to demand from early risers, the gym will open at six a.m. on weekdays instead of seven. And finally, yoga. Despite what it says on the timetable, classes will no longer be held in the main hall. From next week they'll take place in the studio on the first floor, which is quieter and warmer.", vi: "Nhưng cũng có tin vui. Do nhu cầu của những người dậy sớm, phòng gym sẽ mở lúc sáu giờ sáng các ngày trong tuần thay vì bảy giờ. Và cuối cùng, yoga. Bất chấp những gì ghi trên thời khoá biểu, lớp sẽ không còn tổ chức ở sảnh chính. Từ tuần sau lớp sẽ diễn ra ở phòng studio trên tầng một, yên tĩnh và ấm hơn." },
        ],
      },
      {
        t: "quiz",
        id: "t3d21-bt-nghe-dien",
        kind: "fill",
        title: "VI. Complete the notes — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. closed for ___ weeks", answers: ["4", "four"] },
          { q: "2. a problem with the ___", answers: ["heating"] },
          { q: "3. swim free at the ___ pool", answers: ["university"] },
          { q: "4. the gym will open at ___ a.m.", answers: ["6", "six", "6.00", "6:00"] },
          { q: "5. moving to the ___ on the first floor", answers: ["studio"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án VI",
        items: [
          "**1 — four.** “originally… six weeks, **but**… it can be done in four”. Bẫy đổi ý sau but.",
          "**2 — heating.** “**However**, the engineers have found a fault in the heating, and **as a result** the pool will have to close”. fault → problem.",
          "**3 — university.** “at no charge at the university pool” (at no charge → free). City pool bị loại: “it doesn't cover the city pool”.",
          "**4 — six.** “open at six a.m.… **instead of** seven”.",
          "**5 — studio.** “**Despite** what it says on the timetable… no longer in the main hall… in the studio on the first floor”.",
        ],
      },

      { t: "h", text: "VII. Phát âm: /ð/ hay /θ/? (4 câu) — ôn bài Nghe, mục Phát âm" },
      {
        t: "mcq",
        id: "t3d21-bt-phat-am",
        title: "VII. Phần in HOA đọc là âm gì?",
        items: [
          { q: "alTHough", options: ["/θ/", "/ð/", "/d/", "/t/"], correct: 1, why: "although /ɔːlˈðəʊ/ — /ð/ rung." },
          { q: "meTHod", options: ["/ð/", "/t/", "/θ/", "/d/"], correct: 2, why: "method /ˈmeθəd/ — /θ/ không rung." },
          { q: "neverTHeless", options: ["/ð/", "/θ/", "/t/", "/z/"], correct: 0, why: "nevertheless /ˌnevəðəˈles/ — có “the” ở giữa, đọc /ðə/." },
          { q: "Từ nào có âm KHÁC ba từ còn lại?", options: ["whether", "rather", "other", "growth"], correct: 3, why: "growth /ɡrəʊθ/ có /θ/; whether, rather, other đều có /ð/." },
        ],
      },
    ],
  },
];
