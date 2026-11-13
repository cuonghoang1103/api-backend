/**
 * IELTS Tập 2 — Ngày 17 (tự soạn 12/11/2026, không chụp sách; mọi câu ví dụ, kịch bản nghe, câu bài tập VIẾT MỚI):
 *   Bài 1 · Ngữ pháp: Từ nối cấp câu & cấp đoạn — đúng vai, không lạm dụng            [G18 VD6 W16]
 *   Bài 2 · Nghe: Cuộc họp công việc (dạng Listening Part 3) — ngôn ngữ họp           [L18 E04 · L05 L11 L12 L07]
 *   Bài 3 · Nói: Trọng âm câu & nhịp — nêu ý kiến trong họp và ở Part 3               [S13 S16 · S06]
 *   Bài tập Ngày 17: 34 câu + 1 đoạn viết.
 * Phát âm (khối `phatam` duy nhất của ngày, ở bài Nói): từ nội dung vs từ chức năng (trọng âm câu).
 * Nguồn đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng 17; quy ước: ../../SOAN-BAI.md mục "Soạn Tập 2".
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const T2D17_GRAMMAR: Lesson = {
  id: "t2d17-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Từ nối cấp câu & cấp đoạn — đúng vai, không lạm dụng",
  goal: "Phân biệt liên từ (nối hai mệnh đề trong một câu) với trạng từ liên kết (nối câu với câu, đoạn với đoạn), chọn từ nối theo đúng chức năng, đặt dấu câu đúng và không lạm dụng — viết các vế nối nhau cùng dạng (cấu trúc song song), sửa được câu dính và câu lê thê — để Writing tiêu chí Mạch lạc & Liên kết (CC) và Ngữ pháp (GRA) lên band 5–5.5.",
  minutes: 95,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Từ nối có **hai tầng**: ==liên từ== (and, but, so, because, although…) nối hai mệnh đề **trong một câu**; ==trạng từ liên kết== (However, Therefore, In addition…) đứng **đầu câu mới**, nối câu với câu, đoạn với đoạn.",
        "Chọn từ nối theo **chức năng**: thêm ý · đối lập · nguyên nhân · kết quả · ví dụ · trình tự · kết luận. Sai chức năng là sai nghĩa cả câu.",
        "Dấu câu: **However, S + V.** hoặc **S + V; however, S + V.** — không nối hai câu bằng dấu phẩy. **Although… , …** không kèm **but**; **Because… , …** không kèm **so**.",
        "Band descriptor ghi rõ: band 5 = **lạm dụng** từ nối hoặc dùng sai; band 6 = đủ loại, dùng đúng dù còn máy móc. Quy tắc nhanh: **khoảng 1 trạng từ liên kết đầu câu cho 2–3 câu**.",
        "Gắn kết không chỉ nhờ từ nối: **this / these + danh từ** và **lặp từ khoá có chủ ý** cũng nối ý (bước đầu của tiêu chí CC).",
        "Lỗi cấp câu: **cấu trúc song song** (A and B cùng dạng; both… and, not only… but also) · **câu dính** và **câu lê thê** (quá 2 and / so trong một câu) · **And / But / So** không mở câu trong bài viết.",
        "Bài này đẩy **Writing CC + GRA từ 4.5 lên 5.0–5.5** và giúp **Speaking FC** (nói có mạch, không lặp \"and… and… and\").",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Từ nối là gì? Hai tầng: trong câu và giữa các câu" },
    {
      t: "p",
      text: "**Từ nối** (linking words, còn gọi connectors) là những từ cho người đọc biết **ý sau liên quan thế nào với ý trước**: thêm vào, trái lại, là nguyên nhân, là kết quả… Ở Tập 1 bạn đã dùng and, but, because, Firstly, In conclusion trong bài luận. Hôm nay ta **hệ thống lại**: mỗi từ nối thuộc **tầng nào** (nối trong câu hay giữa câu) và làm **chức năng gì**. Hai câu hỏi này quyết định bạn đặt nó ở đâu và dùng dấu câu gì.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai tầng từ nối",
      caption: "Cùng nghĩa \"nhưng\": but nối TRONG một câu (dấu phẩy); However mở đầu CÂU MỚI (dấu chấm trước, dấu phẩy sau).",
      cols: [
        {
          title: "**Liên từ** (conjunction) — nối 2 mệnh đề trong **một câu**",
          anh: "link",
          items: [
            "and · but · or · so",
            "because · although / though · while / whereas",
            "I was tired, **but** I finished the report.",
            "Đứng **giữa** hai mệnh đề (because / although còn đứng được đầu câu)",
          ],
        },
        {
          title: "**Trạng từ liên kết** (linking adverb) — nối **câu với câu, đoạn với đoạn**",
          anh: "chains",
          items: [
            "However · Therefore · In addition · Moreover",
            "For example · As a result · In contrast · Finally · In conclusion",
            "I was tired. **However,** I finished the report.",
            "Đứng **đầu câu mới**, theo sau là **dấu phẩy**",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Ba nhóm từ nối và tên gọi đúng",
      head: ["Nhóm", "Thành viên hay gặp", "Vị trí", "Ví dụ"],
      rows: [
        ["**Liên từ kết hợp** (coordinating conjunction)", "and, but, or, so", "giữa hai mệnh đề ngang hàng", "The bus was late, **so** I took a taxi."],
        ["**Liên từ phụ thuộc** (subordinating conjunction)", "because, although, though, while, whereas, when, if", "đầu mệnh đề phụ; mệnh đề phụ đứng trước hoặc sau mệnh đề chính", "**Although** the bus was late, I arrived on time."],
        ["**Trạng từ / cụm trạng ngữ liên kết** (linking adverbial)", "However, Therefore, Moreover, In addition, For example, As a result, On the other hand", "đầu câu mới (đôi khi giữa câu, giữa hai dấu phẩy)", "The bus was late. **Therefore,** I took a taxi."],
      ],
    },
    {
      t: "note",
      title: "Ghi nhớ: vì sao phải biết \"tầng\"?",
      items: [
        "Liên từ **nối** hai mệnh đề thành một câu. Trạng từ liên kết **không nối được** — nó chỉ \"chỉ đường\" ở đầu câu mới. Vì vậy ~~The bus was late, however I took a taxi.~~ là lỗi: hai câu bị dán bằng một dấu phẩy.",
        "Một câu có **hai mệnh đề** thì cần **đúng một** liên từ: ~~Because it rained, so we stayed home.~~ (hai liên từ cho một chỗ nối) → **Because it rained, we stayed home.** hoặc **It rained, so we stayed home.**",
        "Mệnh đề (clause) = một cụm có **chủ ngữ + động từ chia** (it rained, we stayed home). Không có động từ chia thì không phải mệnh đề — xem because / because of ở mục 3.",
      ],
    },
    {
      t: "rule",
      formula: "Liên từ: S + V, but / so / and + S + V (một câu) · Trạng từ liên kết: S + V. However, + S + V (hai câu)",
      vi: "Liên từ nối trong câu; trạng từ liên kết mở đầu câu mới, có dấu phẩy theo sau.",
    },
    {
      t: "quiz",
      id: "t2d17-tang-dich",
      title: "Dịch sang tiếng Anh — hai tầng từ nối (3 câu)",
      kind: "translate",
      grammar: "S + V, but + S + V (một câu) · S + V. However, S + V (hai câu)",
      items: [
        { q: "Căn hộ nhỏ nhưng rất sạch. (một câu, dùng but)", hint: "The flat, small, but, very clean", answers: ["The flat is small, but it is very clean.", "The flat is small but it is very clean.", "The flat is small, but it's very clean.", "The apartment is small, but it is very clean.", "The apartment is small, but it's very clean.", "The flat is small but very clean.", "The apartment is small but very clean."] },
        { q: "Căn hộ nhỏ. Tuy nhiên, nó rất sạch. (hai câu, dùng However)", hint: "The flat is small. However, it…", answers: ["The flat is small. However, it is very clean.", "The flat is small. However, it's very clean.", "The apartment is small. However, it is very clean.", "The apartment is small. However, it's very clean."] },
        { q: "Trời mưa nên chúng tôi ở nhà. (một câu, KHÔNG dùng hai liên từ)", hint: "It rained, so…  (hoặc Because it rained, …)", answers: ["It rained, so we stayed at home.", "It rained, so we stayed home.", "It rained so we stayed at home.", "Because it rained, we stayed at home.", "Because it rained, we stayed home.", "We stayed at home because it rained.", "We stayed home because it rained.", "It was raining, so we stayed at home.", "It was raining, so we stayed home."] },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. and · but · or · so — nối hai ý ngang hàng" },
    {
      t: "p",
      text: "Bốn liên từ kết hợp này nối hai mệnh đề **quan trọng ngang nhau**. Mỗi từ một chức năng: **and** = thêm ý cùng hướng · **but** = trái ý · **or** = lựa chọn · **so** = kết quả (\"vì thế\"). Khi hai mệnh đề dài, đặt **dấu phẩy trước** but / so / or; với and và hai mệnh đề ngắn thì không cần.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V, and + S + V",
          vi: "Thêm một ý cùng hướng.",
          examples: [
            { en: "The library is quiet, and it has fast Wi-Fi.", vi: "Thư viện yên tĩnh, và có Wi-Fi nhanh." },
          ],
        },
        {
          formula: "S + V, but + S + V",
          vi: "Ý sau trái với điều người nghe chờ đợi từ ý trước.",
          examples: [
            { en: "Online meetings save time, but they can feel less personal.", vi: "Họp trực tuyến tiết kiệm thời gian, nhưng có thể kém gần gũi." },
          ],
        },
        {
          formula: "S + V, or + S + V",
          vi: "Hai khả năng, chọn một.",
          examples: [
            { en: "We can meet on Monday, or we can wait until Friday.", vi: "Chúng ta có thể họp thứ Hai, hoặc đợi đến thứ Sáu." },
          ],
        },
        {
          formula: "S + V, so + S + V",
          vi: "Ý sau là KẾT QUẢ của ý trước (\"nên, vì thế\").",
          examples: [
            { en: "The printer was broken, so we sent the report by email.", vi: "Máy in hỏng nên chúng tôi gửi báo cáo qua email." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với and / but / so",
      items: [
        "**\"Vì… nên…\" → chỉ MỘT từ nối.** ~~Because the price is high, so few people buy it.~~ → **Because the price is high, few people buy it.** / **The price is high, so few people buy it.**",
        "**\"Tuy… nhưng…\" → chỉ MỘT từ nối.** ~~Although she was tired, but she kept working.~~ → **Although she was tired, she kept working.** / **She was tired, but she kept working.**",
        "**Chuỗi \"and… and… and\"** khi nói: I woke up and I had breakfast and I went to work and… — nghe như kể lể, giám khảo chấm FC thấp. Chia câu, đổi từ nối (Then, After that, so, because).",
        "**But / And đứng đầu câu**: không sai ngữ pháp, rất hay gặp khi **nói** và trong báo chí. Nhưng trong **bài viết học thuật** (Writing Task 1, Task 2) nên dùng **However,** / **In addition,** — trông trang trọng hơn và không ai trừ điểm.",
      ],
    },
    {
      t: "rule",
      formula: "S + V, and / but / or / so + S + V",
      vi: "and = thêm · but = trái ý · or = lựa chọn · so = kết quả. Một chỗ nối chỉ cần một từ nối.",
    },
    {
      t: "quiz",
      id: "t2d17-lien-tu-dich",
      title: "Dịch sang tiếng Anh — and / but / or / so (4 câu)",
      kind: "translate",
      grammar: "S + V, and / but / or / so + S + V (dấu phẩy trước but / so / or)",
      items: [
        { q: "Nhà hàng này rẻ, nhưng đồ ăn không ngon lắm.", hint: "This restaurant, cheap, but, the food, not very good", answers: ["This restaurant is cheap, but the food is not very good.", "This restaurant is cheap, but the food isn't very good.", "This restaurant is cheap but the food is not very good.", "This restaurant is cheap, but the food is not very tasty.", "This restaurant is cheap, but the food isn't very tasty."] },
        { q: "Cuộc họp bị hoãn nên tôi về nhà sớm.", hint: "The meeting, was postponed / was cancelled, so, went home early", answers: ["The meeting was postponed, so I went home early.", "The meeting was cancelled, so I went home early.", "The meeting was put off, so I went home early.", "The meeting was postponed so I went home early.", "The meeting was delayed, so I went home early."] },
        { q: "Bạn có thể gọi điện cho tôi, hoặc bạn có thể gửi tin nhắn.", hint: "You can call me, or, you can send a message", answers: ["You can call me, or you can send a message.", "You can call me, or you can send me a message.", "You can phone me, or you can send a message.", "You can phone me, or you can send me a message.", "You can call me or you can send me a message.", "You can call me, or you can text me."] },
        { q: "Anh ấy học chăm chỉ và anh ấy đã đỗ kỳ thi.", hint: "He studied hard, and, passed the exam", answers: ["He studied hard, and he passed the exam.", "He studied hard and he passed the exam.", "He studied hard and passed the exam.", "He studied hard, and he passed the test.", "He studied hard, so he passed the exam.", "He studied hard so he passed the exam."] },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. because · although · while / whereas — mệnh đề phụ (và because of, so that)" },
    {
      t: "p",
      text: "Liên từ phụ thuộc mở đầu một **mệnh đề phụ** — mệnh đề không đứng một mình được (~~Because it rained.~~ là câu cụt). Ưu điểm: mệnh đề phụ đứng **trước** hoặc **sau** mệnh đề chính đều được. Đứng trước thì **có dấu phẩy** ngăn hai mệnh đề; đứng sau thì thường **không** cần.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V because + S + V · Because + S + V, S + V",
          vi: "Nêu NGUYÊN NHÂN (vì). because trả lời câu hỏi \"Why?\".",
          examples: [
            { en: "Many people work from home because it saves travel time.", vi: "Nhiều người làm việc ở nhà vì tiết kiệm thời gian đi lại." },
            { en: "Because the room was too small, we moved the meeting to the hall.", vi: "Vì phòng quá nhỏ, chúng tôi chuyển cuộc họp ra hội trường." },
          ],
        },
        {
          formula: "Although / Though + S + V, S + V",
          vi: "NHƯỢNG BỘ: dù… (vẫn). Ý chính nằm ở mệnh đề KHÔNG có although.",
          examples: [
            { en: "Although the course was expensive, it was worth every penny.", vi: "Dù khoá học đắt, nó đáng từng đồng." },
          ],
        },
        {
          formula: "S + V, while / whereas + S + V",
          vi: "ĐỐI LẬP hai sự việc / hai nhóm (trong khi…). whereas trang trọng hơn — rất hợp Task 1 so sánh số liệu.",
          examples: [
            { en: "Young staff prefer messaging apps, whereas older staff prefer email.", vi: "Nhân viên trẻ thích ứng dụng nhắn tin, trong khi nhân viên lớn tuổi thích email." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Ba cặp hay nhầm — nhìn thứ đứng SAU từ nối",
      head: ["Cặp", "Theo sau là", "Đúng", "Sai"],
      rows: [
        ["**because** / **because of**", "because + **mệnh đề** (S + V) · because of + **danh từ / V-ing**", "We stayed in **because of the rain**. / We stayed in **because it rained**.", "~~We stayed in because the rain.~~ · ~~because of it rained~~"],
        ["**so** / **so that**", "so = **vì thế** (kết quả) · so that = **để mà** (mục đích) + S + can / could / will", "She saved money, **so** she was able to travel. (kết quả: đã đi được) · She saved money **so that** she could travel. (mục đích: để có thể đi)", "~~She saved money so that she was rich.~~ (giàu là kết quả, không phải mục đích)"],
        ["**although** / **but**", "although mở mệnh đề phụ · but nối hai mệnh đề ngang hàng — **không dùng cùng nhau**", "**Although** it was late, she kept working.", "~~Although it was late, but she kept working.~~"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "**though** = although nhưng thân mật hơn; khi **nói** nó còn đứng **cuối câu** với nghĩa \"dù vậy\": The hotel was old. I liked it, **though**. Trong bài viết, dùng **although** ở đầu mệnh đề cho chắc.",
        "**while** có hai nghĩa: **trong khi** (đối lập — Young people…, while older people…) và **trong lúc** (thời gian — I read **while** I was waiting). Nhìn ngữ cảnh để hiểu.",
        "**despite / in spite of** (dù… + danh từ) cũng nói nhượng bộ, nhưng cách dùng khác hẳn although — học kỹ ở **Tập 3 Ngày 21**. Hôm nay chỉ cần nhớ: ~~despite of~~ luôn sai.",
        "Không viết một mệnh đề phụ đứng riêng làm câu: ~~I chose this job. Because it is interesting.~~ → **I chose this job because it is interesting.** (Khi **nói** trả lời ngắn \"Because it's interesting.\" thì vẫn tự nhiên.)",
        "**since / as** cũng nghĩa là **vì**, hay đứng **đầu câu** khi lý do là điều người đọc đã biết, giọng trang trọng hơn: **Since / As** most students live far from campus, the university runs free buses. Trong bài viết, **because** thường đứng **giữa câu**; muốn mở câu bằng lý do thì since / as nghe tự nhiên hơn.",
        "Khi **nói**, lỗi \"tuy… nhưng\" còn hay hơn khi viết: ~~Although it was raining, but we still went out.~~ Chọn **một**: **Although** it was raining, we still went out. / It was raining, **but** we still went out.",
      ],
    },
    {
      t: "rule",
      formula: "Because / Although + S + V, S + V · S + V because / although + S + V · because of + N · so that + S + can / could + V",
      vi: "Mệnh đề phụ đứng trước → có dấu phẩy. Không ghép although với but, because với so.",
    },
    {
      t: "quiz",
      id: "t2d17-phu-thuoc-dich",
      title: "Dịch sang tiếng Anh — because / although / whereas / because of / so that (5 câu)",
      kind: "translate",
      grammar: "Because / Although + S + V, S + V · S + V, whereas + S + V · because of + N · S + V so that + S + can / could + V",
      items: [
        { q: "Mặc dù công việc vất vả, cô ấy rất thích nó.", hint: "Although, the job, hard / demanding, she, really likes / loves it", answers: ["Although the job is hard, she really likes it.", "Although the job is hard, she really enjoys it.", "Although the job is demanding, she really likes it.", "Although the job is demanding, she really enjoys it.", "Although the job is hard, she loves it.", "Although her job is hard, she really likes it.", "She really likes the job although it is hard.", "She really likes her job although it is hard.", "Though the job is hard, she really likes it."] },
        { q: "Chuyến bay bị hoãn vì thời tiết xấu. (dùng because of)", hint: "The flight, was delayed, because of, bad weather", answers: ["The flight was delayed because of bad weather.", "The flight was delayed because of the bad weather.", "Because of bad weather, the flight was delayed.", "Because of the bad weather, the flight was delayed."] },
        { q: "Tôi đi làm bằng xe đạp vì nó rẻ và tốt cho sức khoẻ.", hint: "I cycle to work / go to work by bike, because, it is cheap and healthy", answers: ["I cycle to work because it is cheap and healthy.", "I cycle to work because it's cheap and healthy.", "I go to work by bike because it is cheap and healthy.", "I go to work by bike because it's cheap and healthy.", "I cycle to work because it is cheap and good for my health.", "I go to work by bicycle because it is cheap and healthy.", "Because it is cheap and healthy, I cycle to work."] },
        { q: "Ở thành phố người ta đi xe buýt, trong khi ở nông thôn người ta đi xe máy.", hint: "In cities people take the bus, whereas / while, in the countryside people ride motorbikes", answers: ["In cities, people take the bus, whereas in the countryside, people ride motorbikes.", "In cities, people take the bus, while in the countryside, people ride motorbikes.", "In cities people take the bus, whereas in the countryside people ride motorbikes.", "In cities people take the bus, while in the countryside people ride motorbikes.", "In the city, people take the bus, whereas in the countryside, people ride motorbikes.", "In the city, people take the bus, while in the countryside, people ride motorbikes.", "People in cities take the bus, whereas people in the countryside ride motorbikes.", "People in cities take the bus, while people in the countryside ride motorbikes."] },
        { q: "Cô ấy dậy sớm để có thể tập thể dục trước khi đi làm.", hint: "She gets up early, so that, she can exercise, before work", answers: ["She gets up early so that she can exercise before work.", "She gets up early so that she can do exercise before work.", "She gets up early so that she can exercise before going to work.", "She gets up early so that she can work out before work.", "She gets up early so she can exercise before work.", "She wakes up early so that she can exercise before work."] },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Trạng từ liên kết đầu câu và dấu câu: However, … · ; however, …" },
    {
      t: "p",
      text: "**However, Therefore, Moreover, In addition, As a result, For example…** đứng **đầu câu mới** và có **dấu phẩy** ngay sau. Chúng làm câu văn trang trọng hơn — vì thế là \"đồ nghề\" chính của Writing. Điều quan trọng nhất: chúng **không nối hai mệnh đề** như but hay so. Muốn nối trong một câu thì phải dùng **dấu chấm phẩy (;)** trước nó.",
    },
    {
      t: "table",
      caption: "Năm cách đặt However / Therefore — ba cách đúng, hai cách sai",
      head: ["Cách viết", "Đúng / sai", "Ví dụ"],
      rows: [
        ["Câu. **However,** câu.", "✅ chuẩn nhất — dùng cách này", "Public transport is cheap. **However,** it is often crowded."],
        ["Câu**; however,** câu.", "✅ đúng (trang trọng; ít dùng hơn)", "Public transport is cheap**; however,** it is often crowded."],
        ["Câu**, however** câu.", "❌ dán hai câu bằng dấu phẩy (comma splice)", "~~Public transport is cheap, however it is often crowded.~~"],
        ["**However** câu (thiếu dấu phẩy)", "⚠️ thiếu dấu phẩy — dễ bị coi là lỗi dấu câu", "~~However it is often crowded.~~ → **However,** it is often crowded."],
        ["S**, however,** V (giữa câu — thêm)", "✅ đúng, trang trọng", "Public transport, **however,** is often crowded."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "but hay However?",
      caption: "Cùng nghĩa \"nhưng / tuy nhiên\", khác tầng: but ở GIỮA một câu, However ở ĐẦU câu mới.",
      cols: [
        { title: "**but** (liên từ)", items: ["Câu dài, hai ý gần nhau", "It is cheap**, but** it is slow.", "Dấu phẩy TRƯỚC but", "Hợp cả nói lẫn viết"] },
        { title: "**However** (trạng từ liên kết)", items: ["Hai câu riêng, ý đối lập mạnh hơn", "It is cheap**. However,** it is slow.", "Dấu chấm TRƯỚC, dấu phẩy SAU", "Hợp bài viết; khi nói nghe hơi \"đọc bài\""] },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với However / Therefore",
      items: [
        "Dùng **However** như **although**: ~~However it is cheap, it is slow.~~ → **Although** it is cheap, it is slow. (However không mở mệnh đề phụ.)",
        "Dán bằng dấu phẩy: ~~Prices rose, therefore people bought less.~~ → Prices rose**. Therefore,** people bought less. / Prices rose**, so** people bought less.",
        "**Therefore** ≠ **so** về tầng: so là liên từ (nối trong câu), therefore là trạng từ liên kết (đầu câu mới hoặc sau \";\").",
        "Viết thường ~~however~~ ở đầu câu, hoặc viết hoa giữa câu ~~; However,~~ — sau dấu chấm phẩy viết **thường**: **; however,**",
      ],
    },
    {
      t: "rule",
      formula: "S + V. However, / Therefore, / In addition, + S + V · S + V; however, + S + V",
      vi: "Trạng từ liên kết đứng đầu câu mới + dấu phẩy. Không bao giờ dán hai câu bằng dấu phẩy.",
    },
    {
      t: "quiz",
      id: "t2d17-trang-tu-dich",
      title: "Dịch sang tiếng Anh — However, / Therefore, / In addition, (4 câu, viết thành HAI câu)",
      kind: "translate",
      grammar: "Câu 1. However, / Therefore, / In addition, / As a result, + câu 2.",
      items: [
        { q: "Làm việc ở nhà rất linh hoạt. Tuy nhiên, nó có thể khiến người ta cô đơn.", hint: "Working from home, flexible. However, it can make people…, lonely", answers: ["Working from home is very flexible. However, it can make people lonely.", "Working from home is very flexible. However, it can make people feel lonely.", "Working from home is flexible. However, it can make people lonely.", "Working from home is flexible. However, it can make people feel lonely.", "Working at home is very flexible. However, it can make people feel lonely."] },
        { q: "Giá xăng tăng mạnh. Vì vậy, nhiều người chuyển sang đi xe buýt.", hint: "Petrol prices rose sharply. Therefore, / As a result, many people switched to…", answers: ["Petrol prices rose sharply. Therefore, many people switched to buses.", "Petrol prices rose sharply. Therefore, many people switched to the bus.", "Petrol prices rose sharply. As a result, many people switched to buses.", "Petrol prices rose sharply. As a result, many people switched to the bus.", "Petrol prices increased sharply. Therefore, many people switched to buses.", "Petrol prices increased sharply. As a result, many people switched to buses.", "Petrol prices rose sharply. Therefore, many people started taking the bus.", "Petrol prices rose sharply. As a result, many people started taking the bus."] },
        { q: "Khoá học này miễn phí. Ngoài ra, bạn có thể học bất cứ lúc nào.", hint: "This course is free. In addition, / Moreover, you can study at any time", answers: ["This course is free. In addition, you can study at any time.", "This course is free. In addition, you can study any time.", "This course is free. Moreover, you can study at any time.", "This course is free. Moreover, you can study any time.", "This course is free. Furthermore, you can study at any time.", "This course is free. Also, you can study at any time.", "This course is free. In addition, you can study whenever you want."] },
        { q: "Thành phố đã xây thêm làn xe đạp. Kết quả là ít tai nạn hơn.", hint: "The city built more cycle lanes. As a result, there were fewer accidents", answers: ["The city built more cycle lanes. As a result, there were fewer accidents.", "The city built more bike lanes. As a result, there were fewer accidents.", "The city has built more cycle lanes. As a result, there are fewer accidents.", "The city has built more bike lanes. As a result, there are fewer accidents.", "The city built more cycle lanes. As a result, there have been fewer accidents.", "The city built more cycle lanes. Therefore, there were fewer accidents."] },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Chọn từ nối theo CHỨC NĂNG — bảng 7 nhóm" },
    {
      t: "p",
      text: "Đừng học từ nối như một danh sách dài rồi \"rải\" vào bài. Hãy hỏi: **ý sau làm gì với ý trước?** — thêm vào, trái lại, giải thích nguyên nhân, nêu kết quả, đưa ví dụ, xếp thứ tự, hay chốt lại? Mỗi chức năng có **từ trong câu** và **từ đầu câu** riêng.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "7 chức năng của từ nối",
      caption: "Trước khi viết từ nối, gọi tên chức năng. Gọi không ra → câu đó có lẽ không cần từ nối.",
      center: "**Ý sau làm gì với ý trước?**",
      branches: [
        { label: "Thêm ý", items: ["and · also", "In addition, · Moreover, · Furthermore,"], anh: "plus" },
        { label: "Đối lập", items: ["but · although · while / whereas", "However, · In contrast, · On the other hand,"], anh: "left-right-arrow" },
        { label: "Nguyên nhân", items: ["because · because of + N", "The main reason is that…"], anh: "magnifying-glass-tilted-left" },
        { label: "Kết quả", items: ["so", "Therefore, · As a result,"], anh: "chart-increasing" },
        { label: "Ví dụ", items: ["such as + N", "For example, · For instance,"], anh: "light-bulb" },
        { label: "Trình tự", items: ["then · and then", "Firstly, · Secondly, · Finally,"], anh: "keycap-1" },
        { label: "Kết luận / tổng quan", items: ["In conclusion, (Task 2)", "Overall, (Task 1) · To sum up, (nói)"], anh: "check-mark-button" },
      ],
    },
    {
      t: "table",
      caption: "Bảng tra theo chức năng",
      head: ["Chức năng", "Trong câu (liên từ và từ nối khác)", "Đầu câu / đầu đoạn", "Ví dụ"],
      rows: [
        ["Thêm ý", "and, also (đứng trước động từ thường)", "In addition, · Moreover, · Furthermore,", "Cycling is cheap. **In addition,** it keeps you fit."],
        ["Đối lập", "but · although · while / whereas", "However, · In contrast, · On the other hand,", "Buses are cheap. **However,** they are slow."],
        ["Nguyên nhân", "because + S + V · because of + N", "(dùng câu) The main reason is that…", "Sales fell **because of** high prices."],
        ["Kết quả", "so", "Therefore, · As a result,", "Rents rose. **As a result,** many students moved out."],
        ["Ví dụ", "such as + danh từ", "For example, · For instance,", "Many apps, **such as** Duolingo, are free. / **For example,** Duolingo is free."],
        ["Trình tự", "then", "Firstly, · Secondly, · Finally,", "**Firstly,** cars pollute the air."],
        ["Kết luận / tổng quan", "—", "In conclusion, (Task 2) · Overall, (Task 1)", "**In conclusion,** both views have merit."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: ba cặp hay dùng lẫn",
      items: [
        "**In contrast** = so sánh **hai đối tượng khác nhau** (City A… In contrast, City B…). **On the other hand** = **mặt thứ hai** của **cùng một** vấn đề (On the one hand, cars are convenient. On the other hand, they are expensive.). Không có \"mặt thứ hai\" thì đừng dùng On the other hand.",
        "**On the contrary** KHÔNG đồng nghĩa với On the other hand: nó **bác bỏ** điều vừa nói (\"ngược lại mới đúng\"), thường sau câu phủ định: The course isn't easy. **On the contrary,** it is very demanding. Muốn nêu mặt thứ hai → On the other hand; muốn so sánh hai đối tượng → In contrast.",
        "**such as** + **danh từ** nằm **trong** câu: fruits **such as** mangoes and bananas. **For example,** + **cả một câu**: **For example,** mangoes are cheap in summer. ~~For example mangoes and bananas.~~ (thiếu động từ).",
        "**Moreover / Furthermore** = thêm một ý **cùng hướng và mạnh hơn** (\"hơn nữa\"). Ý thêm vào bình thường → **In addition, / Also,** là đủ.",
        "**Overall** mở đoạn tổng quan **Task 1**; **In conclusion** mở kết bài **Task 2**. Đừng viết ~~In conclusion~~ cho Task 1.",
      ],
    },
    {
      t: "rule",
      formula: "Thêm: In addition, · Đối lập: However, · Kết quả: Therefore, / As a result, · Ví dụ: For example, · such as + N · Kết luận: In conclusion,",
      vi: "Gọi tên chức năng trước, rồi mới chọn từ nối.",
    },
    {
      t: "quiz",
      id: "t2d17-chuc-nang-dich",
      title: "Dịch sang tiếng Anh — chọn từ nối theo chức năng (5 câu)",
      kind: "translate",
      grammar: "For example, + câu · such as + N · In contrast, (hai đối tượng) · On the one hand… On the other hand… (hai mặt) · Overall, (Task 1)",
      items: [
        { q: "Nhiều môn thể thao, chẳng hạn như bơi lội và chạy bộ, không tốn nhiều tiền.", hint: "Many sports, such as swimming and running, do not cost much (money)", answers: ["Many sports, such as swimming and running, do not cost much money.", "Many sports, such as swimming and running, don't cost much money.", "Many sports, such as swimming and running, do not cost much.", "Many sports, such as swimming and running, don't cost much.", "Many sports, such as swimming and running, are not expensive.", "Many sports such as swimming and running do not cost much money."] },
        { q: "Ví dụ, ở Hà Nội có hơn sáu triệu xe máy.", hint: "For example, there are, more than six million motorbikes, in Hanoi", answers: ["For example, there are more than six million motorbikes in Hanoi.", "For example, there are over six million motorbikes in Hanoi.", "For example, Hanoi has more than six million motorbikes.", "For example, Hanoi has over six million motorbikes.", "For instance, there are more than six million motorbikes in Hanoi.", "For instance, Hanoi has more than six million motorbikes.", "For example, in Hanoi there are more than six million motorbikes."] },
        { q: "Ở Tokyo, đa số người dân đi làm bằng tàu. Ngược lại, ở Los Angeles, đa số người dân lái xe hơi.", hint: "In Tokyo, most people take the train to work. In contrast, in Los Angeles, most people drive", answers: ["In Tokyo, most people take the train to work. In contrast, in Los Angeles, most people drive.", "In Tokyo, most people take the train to work. In contrast, most people in Los Angeles drive.", "In Tokyo, most people go to work by train. In contrast, in Los Angeles, most people drive.", "In Tokyo, most people travel to work by train. In contrast, in Los Angeles, most people drive.", "In Tokyo, most people commute by train. In contrast, in Los Angeles, most people drive.", "In Tokyo, most people take the train to work. In contrast, in Los Angeles, most people drive cars.", "In Tokyo, most people go to work by train. In contrast, in Los Angeles, most people drive cars.", "In Tokyo, most people take the train to work. In contrast, in Los Angeles, most people drive a car.", "In Tokyo, most people take the train to work. In contrast, in LA, most people drive.", "In Tokyo, most people go to work by train. In contrast, most people in Los Angeles drive."] },
        { q: "Một mặt, mạng xã hội giúp chúng ta giữ liên lạc. Mặt khác, nó lấy mất nhiều thời gian.", hint: "On the one hand, social media helps us keep in touch. On the other hand, it takes up a lot of time", answers: ["On the one hand, social media helps us keep in touch. On the other hand, it takes up a lot of time.", "On the one hand, social media helps us stay in touch. On the other hand, it takes up a lot of time.", "On the one hand, social media helps us keep in touch. On the other hand, it takes a lot of time.", "On the one hand, social media helps us stay in touch. On the other hand, it takes a lot of time.", "On the one hand, social media helps us to keep in touch. On the other hand, it takes up a lot of time.", "On the one hand, social media helps us keep in contact. On the other hand, it takes up a lot of time.", "On the one hand, social media helps us stay in contact. On the other hand, it wastes a lot of time."] },
        { q: "Nhìn chung, số người dùng xe đạp đã tăng trong giai đoạn này. (câu tổng quan Task 1)", hint: "Overall, the number of cyclists / people who cycled, increased / rose, over the period", answers: ["Overall, the number of cyclists increased over the period.", "Overall, the number of cyclists rose over the period.", "Overall, the number of cyclists increased during the period.", "Overall, the number of cyclists rose during the period.", "Overall, the number of people who cycled increased over the period.", "Overall, the number of bicycle users increased over the period.", "Overall, the number of cyclists grew over the period."] },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Lạm dụng từ nối — lỗi đặc trưng của band 5" },
    {
      t: "p",
      text: "Bảng tiêu chí chấm Writing ghi ở **band 5** cho Mạch lạc & Liên kết (CC): dùng từ nối **chưa đủ, chưa chính xác hoặc lạm dụng** (overuse). Nghĩa là: thêm thật nhiều Moreover, Furthermore, In addition **không** làm bài lên điểm — thường còn làm bài **xuống** điểm. Giám khảo muốn thấy từ nối **đúng chức năng** và **vừa đủ**.",
    },
    {
      t: "p",
      text: "**Bản lạm dụng** (6 câu, 6 từ nối đầu câu): ~~Firstly, cars are convenient. Moreover, they are fast. Furthermore, they are comfortable. However, they cause pollution. Therefore, governments should limit cars. In addition, they should build more bus lanes.~~ — câu nào cũng mở bằng một từ nối, đọc như danh sách; \"However\" lại đổi hướng đột ngột; \"In addition\" ở câu cuối nối với gì cũng không rõ.",
    },
    {
      t: "p",
      text: "**Bản sửa** (5 câu, chỉ 2 từ nối đầu câu): Cars are convenient **because** they take people from door to door quickly and comfortably. **However,** this convenience has a cost. Cars are one of the main sources of air pollution in cities, **and** they make streets noisy and dangerous. **Therefore,** governments should limit car use in city centres. **This policy** would also make room for more bus lanes. — các ý được **gộp** (fast, comfortable → quickly and comfortably), liên từ **because / and** nối trong câu, **This policy** nối câu mà không cần từ nối, và mỗi từ nối đầu câu đúng một chức năng (đối lập · kết quả).",
    },
    {
      t: "table",
      caption: "9 lỗi lạm dụng / dùng sai hay gặp ở band 4.5–5",
      head: ["Lỗi", "Sai", "Sửa"],
      rows: [
        ["Câu nào cũng mở bằng từ nối", "~~Firstly… Moreover… Furthermore… In addition…~~", "Khoảng **1 từ nối đầu câu / 2–3 câu**; còn lại dùng and / because / this + N"],
        ["Moreover cho ý không cùng hướng", "~~Cars are fast. Moreover, they are expensive.~~", "Cars are fast. **However,** they are expensive."],
        ["On the other hand khi không có hai mặt", "~~Cars pollute the air. On the other hand, they cause traffic jams.~~ (hai ý cùng xấu)", "Cars pollute the air. **In addition,** they cause traffic jams."],
        ["Sai cụm cố định", "~~In the other hand~~ · ~~On the other side~~", "**On the other hand,**"],
        ["besides / beside", "~~Beside, it is cheap.~~ (beside = bên cạnh)", "**Besides,** it is cheap. (= ngoài ra — thân mật; bài viết dùng **In addition,**)"],
        ["Firstly of all · Lastly but not least", "~~Firstly of all~~ · ~~Lastly but not least~~ (sai cụm) · Last but not least (đúng nhưng sáo rỗng)", "**Firstly,** / **First of all,** · **Finally,**"],
        ["Chồng hai từ cùng chức năng", "~~In conclusion, to sum up,~~ · ~~But however~~", "Chỉ một: **In conclusion,** / **However,**"],
        ["Mở bài sáo rỗng", "~~Nowadays, this is a controversial issue.~~", "Nói thẳng chủ đề: **Many cities are now banning cars from their centres.**"],
        ["**And / But / So** mở đầu câu trong bài viết", "~~Cars are fast. But they are expensive.~~ · ~~So governments should act.~~", "Cars are fast. **However,** they are expensive. · **Therefore,** governments should act. (And → **In addition,** · So → **Therefore, / As a result,**) — hoặc nối luôn vào câu trước: Cars are fast**, but** they are expensive."],
      ],
    },
    {
      t: "note",
      title: "Mẹo: kiểm từ nối trong 1 phút",
      items: [
        "Gạch dưới mọi từ nối đầu câu trong đoạn. Nhiều hơn **một nửa số câu** có từ nối đầu câu → bỏ bớt, gộp câu.",
        "Với mỗi từ nối, nói to chức năng của nó (\"đối lập\", \"kết quả\"…). Không nói được → xoá.",
        "Không lặp cùng một từ nối trong một đoạn (hai lần However liền nhau → đổi một cái thành but / although).",
      ],
    },
    {
      t: "rule",
      formula: "≈ 1 trạng từ liên kết đầu câu / 2–3 câu · đúng chức năng · không chồng hai từ cùng chức năng",
      vi: "Ít mà đúng > nhiều mà máy móc. Band 5 bị trừ không chỉ vì thiếu mà còn vì lạm dụng hoặc dùng sai.",
    },
    {
      t: "mcq",
      id: "t2d17-lam-dung-chon",
      title: "Chọn cách viết đúng nhất (6 câu)",
      items: [
        { q: "Rents in the city centre are very high. ___, many young workers live in the suburbs.", options: ["On the other hand", "Moreover", "As a result"], correct: 2, why: "Ý sau là **kết quả** của ý trước (giá thuê cao → sống ở ngoại ô) → **As a result**. Moreover = thêm ý cùng hướng; On the other hand = mặt thứ hai của vấn đề — đều sai chức năng." },
        { q: "Choose the correctly punctuated sentence.", options: ["The bus is cheap, however it is slow.", "The bus is cheap. However, it is slow.", "However the bus is cheap, it is slow."], correct: 1, why: "However đứng **đầu câu mới** + dấu phẩy. A dán hai câu bằng dấu phẩy (comma splice). C dùng However như although — sai; phải là **Although** the bus is cheap, it is slow." },
        { q: "Online courses are cheap. ___, they let students study at their own pace.", options: ["In addition", "Therefore", "However"], correct: 0, why: "Hai ý **cùng hướng** (đều là ưu điểm) → **In addition** (thêm ý). However = đối lập; Therefore = kết quả — ý thứ hai không phải kết quả của việc rẻ." },
        { q: "Which sentence is correct?", options: ["Although the hotel was old, but it was clean.", "Because the hotel was old, so it was cheap.", "Although the hotel was old, it was clean."], correct: 2, why: "Một chỗ nối chỉ cần **một** từ nối. A ghép although + but; B ghép because + so — cả hai là lỗi dịch \"tuy… nhưng\", \"vì… nên\"." },
        { q: "Many teenagers spend hours online. ___, they have less time for sport.", options: ["Because of this", "In contrast", "For instance"], correct: 0, why: "Ý sau là **hệ quả** của ý trước → **Because of this** (vì điều này) — đúng chức năng, và **this** nối lại cả câu trước. In contrast cần hai đối tượng đem so sánh; For instance cần một ví dụ cụ thể." },
        { q: "The meeting was useful. ___, it finished on time.", options: ["On the other hand", "Also", "In contrast"], correct: 1, why: "Hai ý **tốt cùng hướng** → **Also** (cũng / ngoài ra). On the other hand và In contrast đều báo **đối lập**, trong khi \"hữu ích\" và \"đúng giờ\" không trái nhau." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Gắn kết không chỉ bằng từ nối: this / these + danh từ, lặp từ khoá có chủ ý" },
    {
      t: "p",
      text: "Một đoạn văn mạch lạc không cần từ nối ở mọi câu. Có ba cách nối ý **không dùng từ nối** mà người viết band 6 trở lên dùng thường xuyên. Hôm nay làm quen; Tập 4 sẽ học hệ thống (referencing: the former, the latter, such, one, do so…).",
    },
    {
      t: "table",
      head: ["Cách", "Làm thế nào", "Ví dụ"],
      rows: [
        ["**this / these + danh từ**", "Tóm cả ý câu trước vào một danh từ ở đầu câu sau", "Many cities have built bike-sharing schemes. **These schemes** are cheap and popular."],
        ["**this + danh từ tóm ý**", "Dùng danh từ \"gói\" cả sự việc: this change, this problem, this trend, this decision", "Rents doubled in five years. **This increase** forced many families to move."],
        ["**Đại từ** it / they / them", "Thay danh từ vừa nhắc (chỉ khi KHÔNG thể hiểu nhầm)", "The council opened a new library. **It** is open until 10 p.m."],
        ["**Lặp từ khoá có chủ ý**", "Lặp lại từ khoá của đề ở đầu đoạn / câu chủ đề để người đọc không lạc", "**Public transport** is cheap… **Public transport** also reduces traffic."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với this đứng một mình",
      items: [
        "~~This is bad for the environment.~~ sau một câu có nhiều ý → người đọc không biết \"this\" là gì. Thêm danh từ: **This habit / This kind of waste** is bad for the environment.",
        "**this** (số ít) + danh từ số ít · **these** (số nhiều) + danh từ số nhiều: ~~this problems~~ → **these problems**.",
        "Lặp từ khoá **có chủ ý** ở chỗ quan trọng thì tốt; lặp một từ ở **mọi** câu thì bị trừ Từ vựng (LR) — dùng it / they hoặc từ đồng nghĩa xen kẽ.",
      ],
    },
    {
      t: "rule",
      formula: "Câu 1. This / These + N (change, problem, trend, decision…) + V…",
      vi: "Nối câu bằng danh từ tóm ý — vừa mạch lạc vừa đỡ phải dùng từ nối.",
    },
    {
      t: "quiz",
      id: "t2d17-gan-ket-dich",
      title: "Dịch sang tiếng Anh — nối câu bằng this / these + danh từ (3 câu)",
      kind: "translate",
      grammar: "Câu 1. This + N số ít / These + N số nhiều + V…",
      items: [
        { q: "Nhiều công ty cho nhân viên làm việc ở nhà. Sự thay đổi này giúp họ tiết kiệm tiền thuê văn phòng.", hint: "Many companies let staff work from home. This change helps them save (money) on office rent", answers: ["Many companies let staff work from home. This change helps them save money on office rent.", "Many companies let their staff work from home. This change helps them save money on office rent.", "Many companies let employees work from home. This change helps them save money on office rent.", "Many companies allow staff to work from home. This change helps them save money on office rent.", "Many companies allow employees to work from home. This change helps them save money on office rent.", "Many companies let staff work from home. This change helps them save on office rent.", "Many companies allow their employees to work from home. This change helps them save money on office rent."] },
        { q: "Giá nhà tăng gấp đôi. Xu hướng này khiến giới trẻ khó mua nhà.", hint: "House prices doubled. This trend makes it hard for young people to buy a home", answers: ["House prices doubled. This trend makes it hard for young people to buy a home.", "House prices doubled. This trend makes it difficult for young people to buy a home.", "House prices have doubled. This trend makes it hard for young people to buy a home.", "House prices have doubled. This trend makes it difficult for young people to buy a home.", "House prices doubled. This trend makes it hard for young people to buy a house.", "House prices doubled. This trend makes it difficult for young people to buy a house.", "House prices have doubled. This trend makes it hard for young people to buy a house."] },
        { q: "Một số trường đã cấm điện thoại. Những quy định này giúp học sinh tập trung hơn.", hint: "Some schools have banned phones. These rules help students (to) concentrate / focus better", answers: ["Some schools have banned phones. These rules help students concentrate better.", "Some schools have banned phones. These rules help students focus better.", "Some schools have banned phones. These rules help students to concentrate better.", "Some schools have banned phones. These rules help students to focus better.", "Some schools have banned mobile phones. These rules help students concentrate better.", "Some schools banned phones. These rules help students concentrate better.", "Some schools have banned phones. These rules help students concentrate more."] },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Cấu trúc song song: hai vế nối nhau phải cùng dạng" },
    {
      t: "p",
      text: "**Cấu trúc song song** (parallel structure) = các vế được nối bằng **and / or / but** (hoặc cặp **both… and, either… or, neither… nor, not only… but also**) phải có **cùng dạng ngữ pháp**: danh từ đi với danh từ, V-ing đi với V-ing, to V đi với to V, mệnh đề đi với mệnh đề. Lệch dạng là lỗi Ngữ pháp (GRA) mà máy kiểm chính tả không bắt được — người Việt mắc rất nhiều vì tiếng Việt không đổi dạng từ.",
    },
    {
      t: "table",
      caption: "Nhìn vế ĐẦU tiên để biết các vế sau phải ở dạng nào",
      head: ["Dạng", "Sai (lệch)", "Đúng (song song)"],
      rows: [
        ["N **and** N", "~~Cycling improves health and saving money.~~", "Cycling improves **health** and **fitness**. / Cycling **improves** health **and saves** money."],
        ["V-ing **and** V-ing", "~~I enjoy reading, swimming and to cook.~~", "I enjoy **reading**, **swimming** and **cooking**."],
        ["to V **or** to V", "~~Students can choose to study online or going to class.~~", "Students can choose **to study** online or **(to) go** to class."],
        ["adj **and** adj", "~~The job is tiring and a lot of stress.~~", "The job is **tiring** and **stressful**."],
        ["giới từ + V-ing **and** V-ing", "~~by walking more and eat less sugar~~", "**by walking** more and **eating** less sugar"],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "both A and B · either A or B · neither A nor B · not only A but also B",
          vi: "Cặp liên từ: A và B phải CÙNG DẠNG, và đặt ngay trước đúng phần được so.",
          examples: [
            { en: "Public transport is both cheap and reliable.", vi: "Giao thông công cộng vừa rẻ vừa đáng tin cậy. (adj – adj)" },
            { en: "Exercise not only improves your health but also reduces stress.", vi: "Tập thể dục không chỉ cải thiện sức khoẻ mà còn giảm căng thẳng. (V – V)" },
            { en: "You can either take the train or fly.", vi: "Bạn có thể hoặc đi tàu hoặc đi máy bay. (V – V)" },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với cấu trúc song song",
      items: [
        "Đặt cặp liên từ **lệch chỗ**: ~~Not only it is cheap but also fast.~~ → It is **not only cheap but also fast**. (Đặt **not only** ngay trước tính từ cheap; đảo ngữ \"Not only is it…\" học ở Tập 4.)",
        "Liệt kê ba thứ: dùng **A, B and C** (dấu phẩy giữa, **and** trước thứ cuối), cả ba cùng dạng. Đừng viết ~~etc.~~ trong bài thi — nêu đủ 2–3 ví dụ là đủ.",
        "Sau giới từ (by, for, of, without…) mọi vế đều là **V-ing**: ~~without paying or to wait~~ → without **paying** or **waiting**.",
      ],
    },
    {
      t: "rule",
      formula: "A and / or / but B: A, B cùng dạng (N–N · V-ing–V-ing · to V–to V · adj–adj) · not only A but also B",
      vi: "Nhìn vế đầu tiên, viết các vế sau theo đúng dạng ấy.",
    },
    {
      t: "quiz",
      id: "t2d17-song-song-dich",
      title: "Song song — viết lại cho đúng / dịch (5 câu)",
      kind: "translate",
      grammar: "Các vế nối bằng and / or / both… and / not only… but also phải cùng dạng.",
      items: [
        { q: "Sửa lỗi: My hobbies are reading books and to play football.", hint: "reading … and playing …", answers: ["My hobbies are reading books and playing football.", "My hobbies are reading and playing football."] },
        { q: "Sửa lỗi: The new park is quiet, clean and has a lot of space.", hint: "quiet, clean and spacious (adj, adj, adj)", answers: ["The new park is quiet, clean and spacious.", "The new park is quiet, clean, and spacious.", "The new park is quiet and clean and has a lot of space.", "The new park is quiet and clean, and it has a lot of space."] },
        { q: "Bạn có thể tiết kiệm tiền bằng cách nấu ăn ở nhà và đi bộ đi làm.", hint: "You can save money by cooking at home and walking to work", answers: ["You can save money by cooking at home and walking to work.", "You can save money by cooking at home and by walking to work.", "You can save money by cooking at home and going to work on foot.", "We can save money by cooking at home and walking to work."] },
        { q: "Học online vừa rẻ vừa linh hoạt.", hint: "Online learning is both cheap and flexible", answers: ["Online learning is both cheap and flexible.", "Studying online is both cheap and flexible.", "Learning online is both cheap and flexible.", "Online study is both cheap and flexible.", "Online learning is both inexpensive and flexible."] },
        { q: "Tập thể dục không chỉ tốt cho cơ thể mà còn tốt cho tinh thần.", hint: "Exercise is not only good for the body but also good for the mind", answers: ["Exercise is not only good for the body but also good for the mind.", "Exercise is good not only for the body but also for the mind.", "Exercising is not only good for the body but also good for the mind.", "Exercise is good not only for your body but also for your mind.", "Exercise is not only good for your body but also good for your mind."] },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Câu dính (run-on) và câu lê thê nhiều and / so" },
    {
      t: "p",
      text: "Mục 4 đã nói về **dán hai câu bằng dấu phẩy**. Còn hai lỗi cùng họ: **câu dính** (run-on) — hai câu đứng liền nhau **không có dấu câu và không có từ nối**; và **câu lê thê** (stringy sentence) — một câu nối 3–4 mệnh đề bằng **and… so… and…**, đọc như kể lể, không rõ ý nào chính. Cả hai đều làm giám khảo khó theo dõi (CC) và bị coi là kiểm soát câu kém (GRA).",
    },
    {
      t: "table",
      caption: "Ba cách sửa câu dính / câu lê thê",
      head: ["Lỗi", "Câu gốc", "Sửa"],
      rows: [
        ["Câu dính", "~~Many students work part-time they have less time to study.~~", "Tách: …part-time**. They** have… · Nối: …part-time**, so** they have… · Phụ thuộc: **Because** many students work part-time, they have…"],
        ["Câu lê thê", "~~I went to the city and I found a job and it was hard so I moved back home and now I work on a farm.~~", "**When** I moved to the city, I found a job, **but** it was so hard **that** I moved back home. Now I work on a farm."],
        ["Câu lê thê", "~~Cars are convenient and they are fast so many people use them and the air is polluted.~~", "Cars are convenient and fast, **which is why** many people use them. **As a result,** the air is polluted."],
      ],
    },
    {
      t: "note",
      title: "Mẹo tự soát câu dài",
      items: [
        "Đếm **and / but / so** trong một câu: **quá 2** → tách câu hoặc đổi một vế thành mệnh đề phụ (**because, although, when, while, which**).",
        "Câu trong bài viết nên khoảng **dưới 30 từ**, thường **2 mệnh đề** (một chính, một phụ). Dài hơn thì đọc to: hết hơi giữa câu → câu quá dài.",
        "Câu có chủ ngữ dài nhớ **tìm động từ chính**: ~~People who live in big cities and work long hours.~~ (chưa có động từ chính → câu què) → People who live in big cities and work long hours **often feel stressed**.",
      ],
    },
    {
      t: "rule",
      formula: "Câu. Câu. · Câu, so / but + câu. · Because / Although / When + S + V, S + V · ≤ 2 and / so trong một câu",
      vi: "Hai mệnh đề cần dấu chấm hoặc một từ nối; nhiều mệnh đề thì đổi bớt thành mệnh đề phụ.",
    },
    {
      t: "quiz",
      id: "t2d17-run-on-dich",
      title: "Sửa câu dính / câu lê thê (3 câu — viết lại thành câu đúng)",
      kind: "translate",
      grammar: "Thêm dấu chấm, hoặc so / but, hoặc because / although / which để gom câu.",
      items: [
        { q: "Sửa: The bus was late I missed the exam.", hint: "…was late, so I missed… / Because the bus was late, …", answers: ["The bus was late, so I missed the exam.", "The bus was late. I missed the exam.", "Because the bus was late, I missed the exam.", "I missed the exam because the bus was late.", "The bus was late, and I missed the exam.", "The bus was late; I missed the exam.", "As the bus was late, I missed the exam."] },
        { q: "Sửa (gom còn 1 câu, ≤ 2 từ nối): Fast food is cheap and it is quick and so young people eat it a lot and they gain weight.", hint: "Because fast food is cheap and quick, young people eat it a lot, so they… / …, which…", answers: ["Because fast food is cheap and quick, young people eat it a lot, so they gain weight.", "Because fast food is cheap and quick, young people eat a lot of it, so they gain weight.", "Fast food is cheap and quick, so young people eat it a lot, which makes them gain weight.", "Because fast food is cheap and quick, young people eat it a lot and gain weight.", "Since fast food is cheap and quick, young people eat it a lot, so they gain weight.", "As fast food is cheap and quick, young people eat it a lot, so they gain weight."] },
        { q: "Sửa (câu què): Students who spend hours on social media every night.", hint: "Students who spend hours on social media every night + often sleep badly / get lower marks…", answers: ["Students who spend hours on social media every night often sleep badly.", "Students who spend hours on social media every night often sleep poorly.", "Students who spend hours on social media every night often get lower marks.", "Students who spend hours on social media every night often feel tired.", "Students who spend hours on social media every night often feel tired at school.", "Students who spend hours on social media every night usually sleep badly.", "Students who spend hours on social media every night often get lower grades."] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án",
      items: [
        "**Câu 1**: hai mệnh đề (The bus was late / I missed the exam) đứng liền không dấu → thêm **so**, hoặc tách bằng dấu chấm, hoặc biến một vế thành mệnh đề phụ với **because / as**.",
        "**Câu 2**: bốn mệnh đề nối bằng and… and so… and → gộp hai tính từ (**cheap and quick**), đổi vế nguyên nhân thành **Because…**, giữ một **so** cho kết quả. Đáp án \"…, which makes them gain weight\" cũng đúng.",
        "**Câu 3**: \"who spend hours…\" chỉ là mệnh đề quan hệ bổ nghĩa cho Students; câu còn **thiếu động từ chính** → thêm \"often sleep badly / get lower marks…\". Chấp nhận mọi động từ hợp nghĩa.",
      ],
    },

    /* ── 10 ── */
    { t: "h", text: "10. Áp vào bài thi: một đoạn thân bài Task 2 và từ nối khi nói" },
    {
      t: "p",
      text: "Đề: **Some people believe that employees work better in teams, while others think they work better alone. Discuss both views and give your opinion.** Dưới đây là một đoạn thân bài band khoảng 5.5 — đếm xem có mấy từ nối và mỗi cái làm chức năng gì.",
    },
    {
      t: "p",
      text: "Working in a team has clear benefits for employees. **Firstly**, team members can share ideas and solve problems faster. **For example**, when my cousin's company designed a new website, five people suggested different layouts in one meeting, **and** the best parts of each were combined. **This process** would take much longer for one person working alone. **However**, teamwork only works when everyone contributes, **because** one unmotivated member can slow the whole group down. Managers should **therefore** give each person a clear role.",
    },
    {
      t: "table",
      caption: "Mổ xẻ đoạn văn — 6 câu, 3 trạng từ liên kết đầu câu (Firstly · For example · However)",
      head: ["Từ nối / cách nối", "Tầng", "Chức năng"],
      rows: [
        ["Firstly,", "đầu câu", "trình tự — ý thứ nhất"],
        ["For example,", "đầu câu", "ví dụ cụ thể (công ty của anh họ)"],
        ["and", "trong câu", "thêm ý"],
        ["This process", "this + danh từ", "tóm cả câu trước, không cần từ nối"],
        ["However,", "đầu câu", "đối lập — điều kiện để làm nhóm hiệu quả"],
        ["because", "trong câu", "nguyên nhân"],
        ["therefore (giữa câu)", "giữa câu", "kết quả — đặt giữa câu để đổi nhịp, tránh thêm một từ nối đầu câu"],
      ],
    },
    {
      t: "table",
      caption: "Khi NÓI (Speaking) — từ nối khác khi VIẾT",
      head: ["Chức năng", "Viết (Task 2)", "Nói (Part 1, 3)"],
      rows: [
        ["Thêm ý", "In addition, / Moreover,", "Also, … · And another thing is…"],
        ["Đối lập", "However, / In contrast,", "But… · Then again, … · Having said that, …"],
        ["Kết quả", "Therefore, / As a result,", "So… · That's why…"],
        ["Ví dụ", "For example, / For instance,", "For example, … · Like, … (thân mật) · Take my sister, for example…"],
        ["Kết luận", "In conclusion,", "So, overall, I'd say… · So basically…"],
      ],
    },
    {
      t: "note",
      title: "Mẹo Speaking",
      items: [
        "Nói \"**Moreover, … Furthermore, …**\" ở Part 1 nghe như đọc bài văn — không sai, nhưng mất tự nhiên (tiêu chí FC). Dùng **Also, So, But, Actually, I mean**.",
        "Ở Part 3 (câu hỏi trừu tượng), **Having said that, …** (dù vậy) và **That's why…** (đó là lý do) giúp câu trả lời dài và có mạch — rất hợp khung Ý kiến → Lý do → Ví dụ → Nhượng bộ.",
      ],
    },
    {
      t: "quiz",
      id: "t2d17-doan-dien",
      title: "Điền từ nối vào đoạn thân bài (6 chỗ trống — chức năng ghi trong ngoặc)",
      kind: "fill",
      items: [
        { q: "Public transport has several advantages for city residents. (1) ___, it is much cheaper than driving. (trình tự — ý thứ nhất)", answers: ["Firstly", "First", "First of all", "To begin with"] },
        { q: "A monthly bus pass in my city costs about 200,000 dong, (2) ___ a motorbike owner spends more than that on petrol alone. (đối lập hai đối tượng — trong câu)", answers: ["whereas", "while", "but"] },
        { q: "(3) ___, buses and trains reduce traffic jams. (thêm ý — đầu câu, hai từ)", answers: ["In addition", "Also", "Moreover", "Furthermore", "Additionally", "Secondly", "Second"] },
        { q: "One bus can carry fifty passengers, (4) ___ fifty motorbikes take up far more space on the road. (đối lập — liên từ ngắn nhất)", answers: ["but", "whereas", "while"] },
        { q: "(5) ___, many people still avoid buses… (đối lập — đầu câu, sau dấu chấm)", answers: ["However", "Nevertheless", "Nonetheless"] },
        { q: "…many people still avoid buses (6) ___ they are often late. (nguyên nhân + mệnh đề S + V)", answers: ["because", "as", "since"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án",
      items: [
        "**(1) Firstly / First of all** — mở ý thứ nhất trong đoạn (trình tự).",
        "**(2) whereas / while** — so sánh hai đối tượng (người đi xe buýt ↔ người đi xe máy) trong **một câu**; **but** cũng chấp nhận được nhưng kém chính xác hơn.",
        "**(3) In addition / Moreover** — thêm một ưu điểm cùng hướng. Không dùng ~~On the other hand~~ (không có mặt thứ hai).",
        "**(4) but / whereas / while** — liên từ nối hai mệnh đề trong câu. Không dùng ~~However~~ (sau dấu phẩy là comma splice).",
        "**(5) However** — đổi hướng sang nhược điểm, đầu câu + dấu phẩy. **(6) because** (+ mệnh đề they are often late). Không dùng ~~because of~~ vì phía sau là S + V.",
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */

const T2D17_LISTENING: Lesson = {
  id: "t2d17-nghe",
  kind: "listening",
  title: "Nghe: Cuộc họp công việc (dạng Listening Part 3) — nêu ý kiến, đồng ý / phản đối, chốt việc",
  goal: "Nghe hiểu một cuộc họp 4 người: nhận ra ai đề xuất, ai phản đối, ai nhận việc gì và quyết định cuối cùng; làm đúng MCQ, Matching và Note completion của Listening Part 3 (câu 21–30) — bước để Listening đạt 16/40 (band 5.0) và dùng được tiếng Anh trong họp thật.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Listening Part 3** = hội thoại 2–4 người trong bối cảnh học tập / công việc: bàn kế hoạch, góp ý, **đồng ý – phản đối**, rồi **chốt**. Cuộc họp công việc là bối cảnh y hệt.",
        "Học **ngôn ngữ họp theo chức năng**: nêu ý kiến (I'd suggest…), đồng ý (Fair point), phản đối lịch sự (I see your point, but…), ngắt lời (Sorry to interrupt…), tóm tắt (So, to sum up…), giao việc (Could you…?).",
        "Ba bẫy của Part 3: **đề xuất ≠ đồng ý** (người nói \"Exactly\" không phải người đề xuất) · **ý bị bác bỏ** (được nhắc nhưng không chọn) · **đổi ý** (Actually, no…).",
        "Bài nghe chính: **10 câu (21–30)** — MCQ · Matching ai nhận việc gì · Note completion ONE WORD AND/OR A NUMBER.",
        "Bài này đẩy **Listening Part 3 từ 3–4/10 lên 5–6/10** (cần cho band 5.0) và luyện **E04 — tiếng Anh trong họp** dùng ở chỗ làm.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Cuộc họp và Listening Part 3 giống nhau thế nào?" },
    {
      t: "p",
      text: "Ở Tập 1 Ngày 11 bạn đã nghe Part 3 về một bài khảo sát của sinh viên. Hôm nay bối cảnh chuyển sang **văn phòng**: một nhóm đồng nghiệp lên kế hoạch cho một sự kiện. Cấu trúc gần như không đổi — vì một cuộc họp nào cũng đi qua cùng những bước, và đề thi hỏi đúng vào **chỗ chuyển bước**.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một cuộc họp đi qua 6 bước — đề Part 3 hỏi ở mỗi bước",
      caption: "Nghe được \"đang ở bước nào\" là biết câu hỏi tiếp theo sắp tới.",
      steps: [
        { label: "Mở đầu & chương trình", sub: "Shall we get started? · There are three things on the agenda." },
        { label: "Nêu vấn đề / ý kiến", sub: "I think we should… · In my view…" },
        { label: "Phản hồi", sub: "Fair point. · I'm not sure about that…" },
        { label: "Đề xuất", sub: "I'd suggest… · What about…? · We could…" },
        { label: "Quyết định & giao việc", sub: "Let's go with… · Could you…? · I'll…" },
        { label: "Tóm tắt & hẹn lần sau", sub: "So, to sum up… · Shall we meet again on…?" },
      ],
    },
    {
      t: "table",
      caption: "Part 3 trong đề thi",
      head: ["Đặc điểm", "Cụ thể"],
      rows: [
        ["Số người nói", "2–4 (thường 3): sinh viên + giảng viên, hoặc đồng nghiệp"],
        ["Số câu", "10 câu, đánh số **21–30**"],
        ["Dạng câu hay gặp", "MCQ một đáp án · chọn TWO · Matching (người ↔ ý kiến / việc) · Note / Flow-chart completion"],
        ["Điều khó", "Phân biệt **giọng** và **tên** người nói; phương án sai thường **được nhắc tới** nhưng bị bác bỏ"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Ngôn ngữ họp theo chức năng" },
    {
      t: "p",
      text: "Học theo **chức năng** chứ không học từng câu rời. Khi nghe, bạn chỉ cần nhận ra **câu này đang làm gì** (đề xuất? phản đối? nhận việc?) là trả lời được nửa số câu hỏi Part 3.",
    },
    {
      t: "table",
      head: ["Chức năng", "Câu hay dùng", "Nghĩa"],
      rows: [
        ["Mở họp", "Shall we get started? · Let's begin. · The first item on the agenda is…", "Ta bắt đầu nhé? · Mục đầu tiên là…"],
        ["Nêu ý kiến", "I think we should… · In my view, … · Personally, I'd prefer…", "Tôi nghĩ ta nên… · Theo tôi…"],
        ["Đề xuất", "I'd suggest + V-ing / that… · What about + V-ing? · We could + V · Why don't we + V?", "Tôi đề nghị… · Hay là…?"],
        ["Đồng ý", "Exactly. · Fair point. · I agree with Tom there. · That makes sense. · Fine by me.", "Chính xác · Có lý · Tôi đồng ý…"],
        ["Phản đối lịch sự", "I see your point, but… · I'm not sure about that. · I'm not sure that's the best idea. · That might be difficult because…", "Tôi hiểu ý anh, nhưng… · Tôi không chắc…"],
        ["Ngắt lời", "Sorry to interrupt, but… · Can I just say something?", "Xin lỗi cắt ngang…"],
        ["Hỏi lại cho rõ", "Sorry, do you mean…? · What exactly do you mean by…?", "Ý anh là…?"],
        ["Giao / nhận việc", "Could you…? · Can you take care of…? — I'll do it. · Happy to. · Leave it with me.", "Anh làm… được không? — Để tôi."],
        ["Tóm tắt & kết", "So, to sum up, … · Let's leave it there. · Shall we meet again on…?", "Tóm lại… · Dừng ở đây nhé."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi họp bằng tiếng Anh",
      items: [
        "Phản đối **quá thẳng**: ~~You are wrong.~~ / ~~I disagree with you.~~ nghe gay gắt. Mềm hoá: **I see your point, but…** / **I'm not sure that's the best option, because…**",
        "Đề xuất bằng \"must\": ~~We must book the hotel.~~ nghe như ra lệnh. Dùng **I'd suggest booking…** / **We could book…** (sau suggest dùng **V-ing**, ~~suggest to book~~).",
        "Im lặng khi không hiểu — người bản xứ coi là đồng ý. Hỏi lại: **Sorry, do you mean the Friday meeting?**",
        "Nhận việc chỉ bằng \"OK\". Nói rõ **I'll do it today. / I'll send it by Friday.** — người nghe (và đề thi) dựa vào câu \"I'll…\" để biết ai làm gì.",
      ],
    },
    {
      t: "rule",
      formula: "Đề xuất: I'd suggest + V-ing · Phản đối: I see your point, but + S + V · Nhận việc: I'll + V",
      vi: "Ba câu khung quan trọng nhất — vừa để nghe ra trong đề, vừa để nói trong họp thật.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Từ vựng hữu ích: cuộc họp" },
    {
      t: "vocab",
      items: [
        { w: "agenda", pos: "n", ipa: "/əˈdʒendə/", vi: "chương trình họp, danh sách việc cần bàn", ex: "There are three items on today's agenda.", exVi: "Chương trình họp hôm nay có ba mục.", more: "**on the** agenda · **set / draw up** an agenda · the next **item on** the agenda. Trọng âm: a-**GEN**-da.", anh: "clipboard" },
        { w: "chair", pos: "v", ipa: "/tʃeə(r)/", vi: "chủ trì (cuộc họp)", ex: "Our manager usually chairs the Monday meeting.", exVi: "Quản lý của chúng tôi thường chủ trì cuộc họp thứ Hai.", more: "Danh từ người: **chair / chairperson** (chủ toạ). ~~chair at the meeting~~ → **chair the meeting** (không giới từ)." },
        { w: "action point", pos: "n", ipa: "/ˈækʃn pɔɪnt/", vi: "việc cần làm (được giao sau cuộc họp)", ex: "The minutes list four action points and who is responsible for each.", exVi: "Biên bản liệt kê bốn việc cần làm và ai phụ trách mỗi việc.", more: "Đồng nghĩa: **action item**. Hay đi với: **agree on / follow up on** action points." },
        { w: "consensus", pos: "n", ipa: "/kənˈsensəs/", vi: "sự đồng thuận (đa số cùng đồng ý)", ex: "After a long discussion, the team reached a consensus.", exVi: "Sau một hồi thảo luận dài, cả nhóm đã đạt được đồng thuận.", more: "**reach / come to** a consensus (~~reach to~~) · a consensus **on** + N. Viết **-sus**, không phải ~~concensus~~." },
        { w: "propose", pos: "v", ipa: "/prəˈpəʊz/", vi: "đề xuất (một kế hoạch, ý tưởng)", ex: "Maya proposed holding the event on a Saturday.", exVi: "Maya đề xuất tổ chức sự kiện vào thứ Bảy.", more: "propose **+ V-ing** / propose **that** + S + (should) V · danh từ: **proposal** /prəˈpəʊzl/ (make / reject a proposal)." },
        { w: "objection", pos: "n", ipa: "/əbˈdʒekʃn/", vi: "ý phản đối", ex: "Does anyone have any objections to the new schedule?", exVi: "Có ai phản đối lịch mới không?", more: "an objection **to** + N / V-ing · động từ: **object to** + V-ing (~~object to do~~). Câu chủ toạ hay hỏi: **Any objections?**" },
        { w: "follow up", pos: "phr v", ipa: "/ˌfɒləʊ ˈʌp/", vi: "theo dõi tiếp, liên hệ lại (sau một việc)", ex: "I'll follow up with the hotel tomorrow and confirm the price.", exVi: "Mai tôi sẽ liên hệ lại với khách sạn và xác nhận giá.", more: "follow up **on** sth / **with** sb · danh từ **follow-up** /ˈfɒləʊ ʌp/ (a follow-up email, a follow-up meeting)." },
        { w: "postpone", pos: "v", ipa: "/pəˈspəʊn/", vi: "hoãn (sang thời điểm sau)", ex: "We had to postpone the launch until April.", exVi: "Chúng tôi phải hoãn buổi ra mắt sang tháng Tư.", more: "= **put off** (thân mật) · postpone **+ V-ing** (postpone making a decision) · **cancel** = huỷ hẳn, khác postpone.", anh: "spiral-calendar" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Nghe ngôn ngữ họp trong một đoạn ngắn" },
    {
      t: "canh",
      anh: ["woman-office-worker", "man-office-worker", "office-worker", "laptop"],
      caption: "Ba đồng nghiệp ở một công ty du lịch bàn chuyện **đổi giờ họp hằng tuần**. Nghe và để ý mỗi câu làm **chức năng** gì.",
    },
    {
      t: "dialogue",
      title: "Moving the weekly meeting",
      lines: [
        { who: "Anna", role: "a", text: "Shall we get started? The first item on the agenda is our weekly meeting. A few people have asked to move it.", vi: "Ta bắt đầu nhé? Mục đầu tiên là cuộc họp hằng tuần. Vài người đã đề nghị đổi giờ." },
        { who: "Ben", role: "b", text: "Yes. Monday at nine is difficult, because half the team is still answering weekend emails. I'd suggest moving it to Tuesday morning.", vi: "Vâng. Chín giờ thứ Hai khó lắm, vì nửa nhóm còn đang trả lời email cuối tuần. Tôi đề nghị dời sang sáng thứ Ba." },
        { who: "Chris", role: "c", text: "I see your point, but on Tuesdays I visit clients. What about Tuesday afternoon instead?", vi: "Tôi hiểu ý anh, nhưng thứ Ba tôi đi gặp khách. Hay là chiều thứ Ba?" },
        { who: "Ben", role: "b", text: "Fair point. Tuesday afternoon is fine by me.", vi: "Có lý. Chiều thứ Ba thì tôi được." },
        { who: "Anna", role: "a", text: "Sorry, Chris, do you mean straight after lunch, or later?", vi: "Xin lỗi Chris, ý anh là ngay sau bữa trưa, hay muộn hơn?" },
        { who: "Chris", role: "c", text: "Two o'clock would be ideal.", vi: "Hai giờ là lý tưởng." },
        { who: "Anna", role: "a", text: "OK. So, to sum up, we're moving the weekly meeting to Tuesday at two. Ben, could you send everyone a new invitation?", vi: "Được. Tóm lại, ta dời cuộc họp hằng tuần sang hai giờ thứ Ba. Ben, anh gửi lời mời mới cho mọi người được không?" },
        { who: "Ben", role: "b", text: "Sure, I'll do it this afternoon.", vi: "Được, chiều nay tôi làm." },
      ],
    },
    {
      t: "mcq",
      id: "t2d17-nghe-chuc-nang",
      title: "Câu này làm chức năng gì? (6 câu)",
      items: [
        { q: "\"I'd suggest moving it to Tuesday morning.\"", options: ["agreeing", "making a suggestion", "summarising"], correct: 1, why: "**I'd suggest + V-ing** = đề xuất. Ben là người đầu tiên đưa ra phương án (sáng thứ Ba)." },
        { q: "\"I see your point, but on Tuesdays I visit clients.\"", options: ["disagreeing politely", "agreeing completely", "asking for clarification"], correct: 0, why: "**I see your point, but…** = thừa nhận ý người kia rồi **phản đối nhẹ nhàng**. Chữ \"but\" mới là thông điệp chính." },
        { q: "\"Sorry, Chris, do you mean straight after lunch, or later?\"", options: ["interrupting", "assigning a task", "asking for clarification"], correct: 2, why: "**Do you mean…?** = hỏi lại cho rõ. Anna không ngắt lời ai (Chris đã nói xong) và không giao việc." },
        { q: "\"Fair point. Tuesday afternoon is fine by me.\"", options: ["agreeing", "making a suggestion", "disagreeing politely"], correct: 0, why: "**Fair point** + **fine by me** = đồng ý. Bẫy Part 3: Ben **đồng ý** với chiều thứ Ba, nhưng người **đề xuất** chiều thứ Ba là **Chris**." },
        { q: "\"So, to sum up, we're moving the weekly meeting to Tuesday at two.\"", options: ["opening the meeting", "asking for an opinion", "summarising a decision"], correct: 2, why: "**So, to sum up, …** = tóm tắt quyết định cuối cùng. Câu tóm tắt thường chứa đáp án Note completion (Tuesday · two)." },
        { q: "\"Ben, could you send everyone a new invitation?\" — \"Sure, I'll do it this afternoon.\"", options: ["Ben refuses a task.", "Ben accepts a task.", "Anna will send the invitation."], correct: 1, why: "**Could you…?** = Anna **giao** việc; **Sure, I'll…** = Ben **nhận** việc. Người làm là **Ben**, không phải người hỏi." },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Chiến thuật: ba bẫy của Part 3 trong cuộc họp" },
    {
      t: "table",
      head: ["Bẫy", "Nghe thấy gì", "Cách xử lý"],
      rows: [
        ["**Đề xuất ≠ đồng ý**", "A: \"What about Tuesday afternoon?\" — B: \"Exactly, good idea.\"", "Câu hỏi \"Who suggested…?\" → người **nói ra ý trước** (A). \"Exactly / Fair point / Good idea\" chỉ là đồng ý."],
        ["**Ý bị bác bỏ**", "\"The hotel has a big room, **but** it's quite expensive… **Then** the library makes more sense.\"", "Phương án sai thường **được nhắc** trước. Chờ câu **chốt** (Then… / Let's go with… / OK, so…)."],
        ["**Đổi ý**", "\"We'd have to borrow tablets.\" — \"**Actually, no** — they can use their phones.\"", "Sau **Actually / Sorry, I mean / On second thoughts** là thông tin thật."],
        ["**Ai nhận việc**", "\"Daniel, could you book the room?\" — \"Sure, I'll book it today.\"", "Người **được hỏi** \"Could you…?\" và **trả lời đồng ý** là người làm; \"I'll…\" = tự nhận."],
      ],
    },
    {
      t: "note",
      title: "Mẹo làm bài 21–30",
      items: [
        "Trước khi nghe: đọc **tên** người nói ở câu Matching, đọc lướt **mọi** phương án MCQ và gạch từ khoá (thường là danh từ: venue, cost, audience).",
        "MCQ: cả ba phương án hay được **nhắc** trong bài. Câu hỏi hỏi **lý do** (Why…?) thì nghe **because / the problem is / it cost…**.",
        "Matching ai làm gì: ghi tắt chữ cái (H, D, M, C) cạnh từng việc ngay khi nghe \"I'll…\" hoặc \"Could you…? — Sure\".",
        "Note completion: đáp án thường nằm trong câu **tóm tắt** hoặc câu chốt; kiểm **số ít / số nhiều** và **giới hạn từ**.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài nghe chính — Planning a product launch (Questions 21–30)" },
    {
      t: "canh",
      anh: ["woman-office-worker", "man-office-worker", "laptop", "spiral-calendar"],
      caption: "Nhóm marketing của một công ty phần mềm nhỏ họp để lên kế hoạch **ra mắt ứng dụng học ngoại ngữ WordWise**. Có bốn người: **Helen** (quản lý, chủ trì), **Daniel**, **Maya** và **Carlos**.",
    },
    {
      t: "p",
      text: "Đọc trước **cả 10 câu hỏi** ở ba khối dưới (khoảng 1 phút), gạch từ khoá. Câu 24–27 hỏi **ai sẽ làm việc gì** — ghi tắt **H / D / M / C** khi nghe.",
    },
    {
      t: "listen",
      id: "t2d17-nghe-bai",
      title: "Planning a product launch",
      dan: { so: "Day 17, Practice (Listening Part 3)", boiCanh: "a meeting of four colleagues, Helen, Daniel, Maya and Carlos, who are planning the launch of a new language-learning app.", cau: [21, 30] },
      note: "Khoảng 3 phút rưỡi, bốn giọng: Helen (Anh, nữ), Daniel (Anh, nam), Maya (Mỹ, nữ), Carlos (Mỹ, nam). Nghe tối đa 2 lần; chưa mở lời thoại cho tới khi làm xong cả 10 câu.",
      lines: [
        { who: "Helen", voice: "uk-nu", text: "Right, shall we get started? Thanks for coming, everyone. As you know, our new app, WordWise, goes live on the twelfth of March, and today we need to decide how to launch it. There are three things on the agenda: the type of event, the venue, and who's doing what.", vi: "Nào, ta bắt đầu nhé? Cảm ơn mọi người đã đến. Như mọi người biết, ứng dụng mới WordWise sẽ chạy chính thức ngày 12 tháng Ba, và hôm nay ta cần quyết định cách ra mắt. Có ba mục: loại sự kiện, địa điểm, và ai làm việc gì." },
        { who: "Daniel", voice: "uk-nam", text: "Can I just say something first? I think we should keep it small this time. Last year's launch was a big party, and it cost a fortune.", vi: "Cho tôi nói một chút trước nhé? Tôi nghĩ lần này ta nên làm nhỏ thôi. Buổi ra mắt năm ngoái là một bữa tiệc lớn, và tốn cả gia tài." },
        { who: "Helen", voice: "uk-nu", text: "That's a fair point, Daniel. What did everyone else think of last year's party?", vi: "Có lý đấy, Daniel. Mọi người thấy bữa tiệc năm ngoái thế nào?" },
        { who: "Maya", voice: "us-nu", text: "Honestly, people enjoyed it. But most of the guests were our own friends and staff, and very few of them actually downloaded the product afterwards.", vi: "Thật lòng thì mọi người thích lắm. Nhưng phần lớn khách là bạn bè và nhân viên của mình, và rất ít người thực sự tải sản phẩm về sau đó." },
        { who: "Carlos", voice: "us-nam", text: "So the problem wasn't really the size. It was the audience.", vi: "Vậy vấn đề không hẳn là quy mô. Mà là đối tượng khách." },
        { who: "Helen", voice: "uk-nu", text: "Exactly. So who do we want this time?", vi: "Chính xác. Vậy lần này ta muốn mời ai?" },
        { who: "Maya", voice: "us-nu", text: "Teachers. The app is for language learners, and teachers are the people who recommend apps to their students. If twenty teachers like it, that's hundreds of users.", vi: "Giáo viên. Ứng dụng dành cho người học ngoại ngữ, và giáo viên là người giới thiệu ứng dụng cho học sinh. Hai mươi giáo viên thích nó là có hàng trăm người dùng." },
        { who: "Daniel", voice: "uk-nam", text: "I'm not sure about that. Teachers are very busy in March. It's exam season.", vi: "Tôi không chắc lắm. Tháng Ba giáo viên rất bận. Đang mùa thi." },
        { who: "Maya", voice: "us-nu", text: "I see your point, but we could hold it on a Saturday morning.", vi: "Tôi hiểu ý anh, nhưng ta có thể tổ chức vào sáng thứ Bảy." },
        { who: "Helen", voice: "uk-nu", text: "I like that. A Saturday morning workshop for teachers, rather than a party. Is everyone happy with that?", vi: "Tôi thích ý đó. Một buổi workshop sáng thứ Bảy cho giáo viên, thay vì tiệc. Mọi người đồng ý chứ?" },
        { who: "Daniel", voice: "uk-nam", text: "Yes. If it's small, I'm happy.", vi: "Vâng. Nhỏ thì tôi đồng ý." },
        { who: "Carlos", voice: "us-nam", text: "Fine by me.", vi: "Tôi được." },
        { who: "Helen", voice: "uk-nu", text: "Great. Now, the venue. Daniel, you looked at some options.", vi: "Tốt. Giờ đến địa điểm. Daniel, anh đã xem vài chỗ rồi." },
        { who: "Daniel", voice: "uk-nam", text: "I did. The hotel near the station has a conference room for sixty people, but it's quite expensive: about nine hundred pounds for the morning. The city library has a room for forty, and it's only two hundred and fifty.", vi: "Vâng. Khách sạn gần nhà ga có phòng hội nghị sáu mươi chỗ, nhưng khá đắt: khoảng chín trăm bảng cho một buổi sáng. Thư viện thành phố có phòng bốn mươi chỗ, và chỉ hai trăm năm mươi." },
        { who: "Carlos", voice: "us-nam", text: "Forty sounds a bit small.", vi: "Bốn mươi nghe hơi nhỏ." },
        { who: "Daniel", voice: "uk-nam", text: "Well, realistically, I don't think more than thirty teachers will come on a Saturday.", vi: "Thì, nói thực tế, tôi không nghĩ quá ba mươi giáo viên sẽ đến vào thứ Bảy." },
        { who: "Helen", voice: "uk-nu", text: "Then the library makes more sense. And it's the kind of place teachers like. Daniel, could you book the library room?", vi: "Vậy thư viện hợp lý hơn. Mà đó cũng là kiểu nơi giáo viên thích. Daniel, anh đặt phòng ở thư viện được không?" },
        { who: "Daniel", voice: "uk-nam", text: "Sure, I'll book it today.", vi: "Được, hôm nay tôi đặt." },
        { who: "Helen", voice: "uk-nu", text: "Thanks. Next, how do we get teachers to come? Maya?", vi: "Cảm ơn. Tiếp theo, làm sao để giáo viên đến? Maya?" },
        { who: "Maya", voice: "us-nu", text: "I'd suggest contacting the English teachers' association. They send a newsletter to about two thousand members every month. I know the editor, so I can write to her.", vi: "Tôi đề nghị liên hệ hội giáo viên tiếng Anh. Họ gửi bản tin cho khoảng hai nghìn hội viên mỗi tháng. Tôi quen người biên tập, nên tôi có thể viết thư cho chị ấy." },
        { who: "Helen", voice: "uk-nu", text: "Perfect. Maya, you'll handle the association, then. What about social media?", vi: "Tuyệt. Vậy Maya lo phần hội giáo viên nhé. Còn mạng xã hội thì sao?" },
        { who: "Carlos", voice: "us-nam", text: "Sorry to interrupt, but before we talk about social media, what are the teachers actually going to do at the workshop? If they just watch a presentation, they'll leave after ten minutes.", vi: "Xin lỗi cắt ngang, nhưng trước khi nói về mạng xã hội: giáo viên thực sự sẽ làm gì ở buổi workshop? Nếu họ chỉ ngồi xem thuyết trình, mười phút là họ về." },
        { who: "Helen", voice: "uk-nu", text: "Good question. What do you suggest?", vi: "Câu hỏi hay. Anh đề xuất gì?" },
        { who: "Carlos", voice: "us-nam", text: "Let them try the app themselves. We could put them in small groups and give each group a lesson plan to test.", vi: "Để họ tự dùng thử ứng dụng. Ta có thể chia họ thành nhóm nhỏ và đưa mỗi nhóm một giáo án để thử." },
        { who: "Helen", voice: "uk-nu", text: "I like that. Carlos, can you prepare the lesson plans for the groups?", vi: "Tôi thích ý đó. Carlos, anh chuẩn bị giáo án cho các nhóm được không?" },
        { who: "Carlos", voice: "us-nam", text: "Happy to. I'll write three, one for each level.", vi: "Sẵn lòng. Tôi sẽ viết ba cái, mỗi trình độ một cái." },
        { who: "Helen", voice: "uk-nu", text: "And I'll write the invitation email myself, because it should come from the manager.", vi: "Còn thư mời thì tôi tự viết, vì nó nên đến từ quản lý." },
        { who: "Daniel", voice: "uk-nam", text: "Just one thing about the group activity. Will they test the app on tablets? We'd have to borrow at least fifteen.", vi: "Một điều về hoạt động nhóm. Họ sẽ thử ứng dụng trên máy tính bảng à? Ta sẽ phải mượn ít nhất mười lăm cái." },
        { who: "Carlos", voice: "us-nam", text: "Actually, no. Most teachers have smartphones, so they can download the app on their own phones. That's better anyway, because then the app stays with them.", vi: "Thật ra là không. Hầu hết giáo viên có điện thoại thông minh, nên họ có thể tải ứng dụng về điện thoại của mình. Như thế còn tốt hơn, vì ứng dụng sẽ ở lại với họ." },
        { who: "Helen", voice: "uk-nu", text: "That's clever. OK, social media. Maya?", vi: "Hay đấy. Được rồi, mạng xã hội. Maya?" },
        { who: "Maya", voice: "us-nu", text: "To be honest, I don't think we need much. Teachers mostly hear about events by email, not on social media. Maybe one post the week before.", vi: "Nói thật thì tôi nghĩ không cần nhiều. Giáo viên chủ yếu biết sự kiện qua email, không qua mạng xã hội. Có lẽ một bài đăng vào tuần trước đó." },
        { who: "Helen", voice: "uk-nu", text: "Agreed. Let's not spend too much time on it. So, to sum up: a Saturday morning workshop for teachers at the city library. Daniel's booking the room, Maya is contacting the teachers' association, Carlos is preparing the lesson plans, and I'm writing the invitation. Anything else?", vi: "Đồng ý. Đừng tốn nhiều thời gian cho nó. Tóm lại: một buổi workshop sáng thứ Bảy cho giáo viên ở thư viện thành phố. Daniel đặt phòng, Maya liên hệ hội giáo viên, Carlos chuẩn bị giáo án, còn tôi viết thư mời. Còn gì nữa không?" },
        { who: "Daniel", voice: "uk-nam", text: "Just the date. The twelfth of March is a Thursday. Shall we say the fourteenth?", vi: "Chỉ còn ngày. Mười hai tháng Ba là thứ Năm. Ta chọn ngày mười bốn nhé?" },
        { who: "Helen", voice: "uk-nu", text: "The fourteenth, yes. Let's meet again next Tuesday to check our progress. Thanks, everyone.", vi: "Ngày mười bốn, được. Thứ Ba tới ta họp lại để kiểm tra tiến độ. Cảm ơn mọi người." },
      ],
    },
    {
      t: "p",
      text: "**Questions 21–23.** Choose the correct letter, **A, B or C**. — **Chọn đáp án đúng A, B hoặc C.**",
    },
    {
      t: "mcq",
      id: "t2d17-nghe-chon",
      title: "Questions 21–23 — Multiple choice",
      items: [
        {
          q: "(21) Why does Daniel want a smaller launch this year?",
          options: ["A Last year's launch was very expensive.", "B Most guests did not enjoy last year's launch.", "C The app will not be ready in March."],
          correct: 0,
          why: "Daniel: \"Last year's launch was a big party, and **it cost a fortune**.\" cost a fortune = **very expensive**. B ngược lại lời Maya (\"people **enjoyed** it\"); C không được nhắc — app vẫn ra ngày 12/3.",
        },
        {
          q: "(22) What was the main problem with last year's launch, according to Maya and Carlos?",
          options: ["A It was too long.", "B The wrong people attended.", "C It was held at the wrong time of year."],
          correct: 1,
          why: "Maya: \"most of the guests were **our own friends and staff**… very few of them actually downloaded the product\"; Carlos chốt: \"**It was the audience**.\" = sai đối tượng khách. A, C không được nhắc. Bẫy: Carlos nói rõ vấn đề **không phải** quy mô (\"wasn't really the size\").",
        },
        {
          q: "(23) Why does the team choose the library?",
          options: ["A It can hold more people than the hotel.", "B It is closer to the station.", "C It is cheaper and big enough."],
          correct: 2,
          why: "Library: phòng 40 chỗ, **only two hundred and fifty** (rẻ hơn khách sạn 900); Daniel: \"I don't think **more than thirty** teachers will come\" ⇒ 40 chỗ là **đủ**. Helen: \"**Then the library makes more sense**.\" A sai (khách sạn 60 > thư viện 40); B — nhà ga là vị trí của **khách sạn**.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 24–27.** Who will do each of the following tasks? Choose the correct answer, **A, B, C or D**. — **Ai sẽ làm mỗi việc sau? A Helen · B Daniel · C Maya · D Carlos.**",
    },
    {
      t: "mcq",
      id: "t2d17-nghe-ai",
      title: "Questions 24–27 — Matching (A Helen · B Daniel · C Maya · D Carlos)",
      items: [
        { q: "(24) book the venue", options: ["A Helen", "B Daniel", "C Maya", "D Carlos"], correct: 1, why: "Helen: \"Daniel, could you book the library room?\" — Daniel: \"Sure, **I'll book it today**.\" Người được nhờ + đồng ý = người làm." },
        { q: "(25) contact a teachers' organisation", options: ["A Helen", "B Daniel", "C Maya", "D Carlos"], correct: 2, why: "Maya đề xuất \"contacting the English **teachers' association**… I can write to her\"; Helen chốt: \"**Maya, you'll handle the association**\". association = **organisation**." },
        { q: "(26) prepare materials for group activities", options: ["A Helen", "B Daniel", "C Maya", "D Carlos"], correct: 3, why: "Helen: \"Carlos, can you prepare the **lesson plans** for the groups?\" — Carlos: \"Happy to. I'll write three\". lesson plans = **materials for group activities**." },
        { q: "(27) write the invitation", options: ["A Helen", "B Daniel", "C Maya", "D Carlos"], correct: 0, why: "Helen: \"And **I'll write the invitation email myself**, because it should come from the manager.\" Câu tóm tắt nhắc lại: \"I'm writing the invitation\"." },
      ],
    },
    {
      t: "p",
      text: "**Questions 28–30.** Complete the notes below. Write **ONE WORD AND/OR A NUMBER** for each answer. — **Hoàn thành ghi chú. Viết MỘT TỪ VÀ/HOẶC MỘT CON SỐ.**",
    },
    {
      t: "table",
      caption: "WordWise launch — notes",
      head: ["", "Note"],
      rows: [
        ["28", "At the workshop, teachers will test the app on their own **(28) ______**"],
        ["29", "Social media: only one **(29) ______**, the week before the event"],
        ["30", "Date of the workshop: Saturday **(30) ______** March"],
      ],
    },
    {
      t: "quiz",
      id: "t2d17-nghe-dien",
      title: "Questions 28–30 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(28) At the workshop, teachers will test the app on their own ___", answers: ["phones", "smartphones"] },
        { q: "(29) Social media: only one ___, the week before the event", answers: ["post"] },
        { q: "(30) Date of the workshop: Saturday ___ March", answers: ["14th", "14", "fourteenth"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 28–30",
      items: [
        "**(28) phones / smartphones** — bẫy **đổi ý**: Daniel hỏi \"Will they test the app on **tablets**? We'd have to borrow at least fifteen\" → Carlos: \"**Actually, no**… they can download the app on their own **phones**.\" Viết số nhiều (-s) vì \"their own\" của nhiều giáo viên.",
        "**(29) post** — Maya: \"Maybe one **post** the week before.\" Không viết ~~posts~~ (\"only one\").",
        "**(30) 14th / fourteenth** — bẫy **hai ngày**: app chạy ngày **twelfth** (thứ Năm) nhưng workshop phải vào thứ Bảy → Daniel: \"Shall we say the **fourteenth**?\" — Helen: \"The fourteenth, yes.\" Viết **14**, **14th** hoặc **fourteenth** (MỘT từ / số). ~~the fourteenth~~ là hai từ — vượt ONE WORD AND/OR A NUMBER, và \"Saturday\" đã in sẵn trên đề.",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Sau khi nghe: lấy ngôn ngữ họp dùng cho mình" },
    {
      t: "note",
      title: "Cách học lại bài nghe",
      items: [
        "Mở lời thoại, tô **mọi câu chức năng**: Can I just say something first? · That's a fair point · I'm not sure about that · I see your point, but… · I'd suggest contacting… · Sorry to interrupt, but… · Actually, no · So, to sum up…",
        "Đọc nhại (shadowing) phần tóm tắt của Helen — một câu dài có bốn người và bốn việc: luyện cả nghe lẫn nói.",
        "Tự đóng vai: một người đề xuất, một người phản đối lịch sự, một người chốt. Dùng ba câu khung ở mục 2.",
      ],
    },
    {
      t: "rule",
      formula: "Who suggested…? → người NÓI RA ý đầu tiên · Who will…? → người trả lời \"I'll…\" / \"Sure\" · Đáp án thật → sau Actually / but / Then…",
      vi: "Ba câu hỏi tự đặt cho mình mỗi khi nghe một cuộc họp trong đề Part 3.",
    },
  ],
};

/* ─────────────────────────── Nói ─────────────────────────── */

const T2D17_SPEAKING: Lesson = {
  id: "t2d17-noi",
  kind: "speaking",
  title: "Nói: Trọng âm câu & nhịp — nêu ý kiến trong họp và ở Part 3",
  goal: "Nhấn đúng từ nội dung, đọc lướt từ chức năng để nói có nhịp tiếng Anh; dùng trọng âm để nhấn ý; nêu ý kiến 3 bước và phản hồi lịch sự trong họp và ở Speaking Part 3 — trả lời câu “Do you agree…?” theo đúng mức đồng ý — đẩy tiêu chí Phát âm (P) và Trôi chảy (FC) lên band 5–5.5.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Trọng âm câu** (sentence stress): trong một câu, **từ nội dung** (danh từ, động từ chính, tính từ, trạng từ, từ phủ định, từ để hỏi) được **nhấn**; **từ chức năng** (mạo từ, giới từ, trợ động từ, đại từ, liên từ) đọc **nhẹ, nhanh** — thường thành âm yếu /ə/ đã học ở Ngày 15.",
        "**Nhịp** tiếng Anh đi theo **trọng âm**, không theo từng chữ như tiếng Việt: \"Cats eat fish\" và \"The cats have eaten the fish\" dài gần bằng nhau.",
        "**Nhấn để đổi nghĩa**: nhấn từ nào là người nghe hiểu bạn đang **so sánh / sửa** điều gì (I booked the **library**, not the hotel).",
        "**Nêu ý kiến trong họp** 3 bước: Ý kiến → Lý do → Đề xuất / ví dụ; phản hồi lịch sự: Fair point · I see your point, but… — dùng y hệt ở **Part 3**.",
        "Part 3 **“Do you agree…?”**: chọn đúng **mức** — đồng ý hoàn toàn · phần lớn · **một phần** (I agree up to a point, but…) · phản đối mềm (That's one way to look at it, but…) · phản đối rõ.",
        "Bài này đẩy **Speaking P (Phát âm)** từ \"đọc đều từng chữ\" (band 4) lên \"trọng âm đúng, có nhịp\" (band 5–6) và **FC** nhờ khung câu ý kiến.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Trọng âm câu: từ nội dung và từ chức năng" },
    {
      t: "p",
      text: "Bạn đã học **trọng âm từ** (âm tiết nào trong một từ được nhấn — Ngày 11 và Ngày 13). **Trọng âm câu** ở tầng lớn hơn: trong cả câu, **từ nào** được nhấn. Quy tắc gốc rất đơn giản: từ **mang nghĩa** thì nhấn, từ **làm khung ngữ pháp** thì đọc nhẹ. Người nghe bản xứ chủ yếu nghe **các từ được nhấn** để hiểu câu — giống như đọc một bức điện tín: \"NEED — BOOK — ROOM — FRIDAY\".",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Từ nội dung vs từ chức năng",
      caption: "Ví dụ: We **need** to **book** the **room** by **Friday**. — bốn từ được nhấn mang trọn nghĩa câu.",
      cols: [
        {
          title: "**Từ nội dung** (content words) — NHẤN",
          items: [
            "Danh từ: room, meeting, price",
            "Động từ chính: book, need, finish",
            "Tính từ, trạng từ: cheap, quickly, really",
            "Từ phủ định: not, can't, don't, never",
            "Từ để hỏi: what, where, why, how",
            "this / that khi chỉ trỏ",
          ],
        },
        {
          title: "**Từ chức năng** (function words) — NHẸ",
          items: [
            "Mạo từ: a, an, the",
            "Giới từ: to, for, of, at, from",
            "Trợ động từ: can, do, does, have, was, are",
            "Đại từ: I, you, we, them, it",
            "Liên từ: and, but, or, that",
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Dạng yếu của từ chức năng hay gặp (ôn Ngày 15 — âm yếu /ə/)",
      head: ["Từ", "Dạng yếu (trong câu)", "Ví dụ"],
      rows: [
        ["a · the", "/ə/ · /ðə/ (trước nguyên âm: /ði/)", "a **cup** of **tea** · the **plan** · the **event** /ði/"],
        ["to · for · of", "/tə/ · /fə/ · /əv/", "I **want** to **go** · **thanks** for **coming** · a **lot** of **work**"],
        ["and · but · or", "/ən/ · /bət/ · /ə/", "**fish** and **chips** · **cheap** but **slow**"],
        ["can · do · are · was", "/kən/ · /də/ · /ə/ · /wəz/", "I can **swim** /kən/ · **Where** do you **work**? /də/"],
        ["you · your · them", "/jə/ · /jə/ · /ðəm/", "**See** you **later** /jə/ · **Tell** them /ðəm/"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "**Nhấn cả từ chức năng**: \"I — WANT — TO — GO — TO — THE — PARK\" mỗi chữ một nhịp. Nghe như robot, và giám khảo chấm P thấp dù từng âm đều đúng.",
        "**Nuốt mất từ chức năng**: đọc yếu **không phải** bỏ đi. \"I want go park\" là mất từ — vừa sai ngữ pháp vừa sai phát âm. Phải còn /tə/, /ðə/, chỉ là nhẹ và nhanh.",
        "**Không nhấn từ phủ định**: \"I **can't** come\" mà đọc can't nhẹ như can thì người nghe hiểu thành \"I can come\" — ngược nghĩa! Từ phủ định **luôn** nhấn; **can't** giữ nguyên âm đủ /kɑːnt/ (Anh-Anh; Mỹ /kænt/), không bao giờ yếu thành /kənt/.",
      ],
    },
    {
      t: "rule",
      formula: "Nhấn: N · V chính · adj · adv · not / can't · Wh- · Đọc nhẹ: a / the · to / for / of · can / do / are · I / you · and / but",
      vi: "Từ mang nghĩa → nhấn; từ làm khung → nhẹ (thường /ə/) nhưng KHÔNG bỏ.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Nhịp tiếng Anh: đi theo trọng âm, không theo từng chữ" },
    {
      t: "p",
      text: "Tiếng Việt **mỗi chữ một nhịp, dài bằng nhau** (nhịp theo âm tiết — syllable-timed). Tiếng Anh thì **các trọng âm cách nhau gần đều**, còn những âm tiết nhẹ ở giữa được **nén lại** cho vừa nhịp (nhịp theo trọng âm — stress-timed). Đây là **xu hướng** chứ không đều tuyệt đối như máy đếm nhịp, nhưng đủ rõ để tạo ra \"nhịp tiếng Anh\". Thử gõ bàn đều tay, mỗi tiếng gõ đúng một từ in đậm:",
    },
    {
      t: "table",
      caption: "Ba câu, cùng 3 nhịp gõ — câu dài hơn chỉ phải nói các từ nhẹ nhanh hơn",
      head: ["Câu", "Số nhịp (trọng âm)", "Số âm tiết"],
      rows: [
        ["**Cats** **eat** **fish**.", "3", "3"],
        ["The **cats** will **eat** the **fish**.", "3", "6"],
        ["The **cats** have been **eating** the **fish**.", "3", "8"],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "We **need** to **book** the **room**.", vi: "Chúng ta cần đặt phòng. — 3 nhịp: NEED · BOOK · ROOM; \"to\" và \"the\" nén vào giữa." },
        { en: "I'd **like** a **cup** of **tea**, **please**.", vi: "Cho tôi một tách trà. — 4 nhịp; \"a\" và \"of\" thành /ə/ /əv/." },
        { en: "**What** do you **think** of the **plan**?", vi: "Bạn nghĩ sao về kế hoạch? — \"do you\" đọc nhanh /də jə/." },
      ],
    },
    {
      t: "note",
      title: "Mẹo luyện nhịp",
      items: [
        "**Gõ nhịp**: gõ tay xuống bàn ở mỗi từ in đậm, giữ khoảng cách giữa các tiếng gõ **đều**. Từ nhẹ phải \"chui\" vào giữa hai tiếng gõ.",
        "**Đọc kiểu điện tín trước**: \"NEED — BOOK — ROOM\" rồi mới thêm \"We… to… the…\" thật nhẹ vào giữa.",
        "**Shadowing** (đọc nhại) 1–2 câu trong bài nghe họp (bài Nghe hôm nay) — chép đúng chỗ người nói lên giọng, kéo dài.",
      ],
    },
    {
      t: "rule",
      formula: "Trọng âm cách nhau gần đều · âm tiết nhẹ nén lại giữa hai trọng âm",
      vi: "Đừng nói đều từng chữ như tiếng Việt — gõ nhịp ở từ nội dung.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Khi nào từ chức năng đọc MẠNH? (thêm)" },
    {
      t: "p",
      text: "Phần này bổ sung để tránh hiểu sai quy tắc: từ chức năng **không phải lúc nào** cũng yếu. Có ba chỗ nó trở về **dạng mạnh** (đọc đủ nguyên âm).",
    },
    {
      t: "table",
      head: ["Chỗ", "Ví dụ", "Đọc"],
      rows: [
        ["**Cuối câu**", "What are you **looking at**? · Where are you **from**?", "at /æt/ · from /frɒm/ (không /ət/, /frəm/)"],
        ["**Câu trả lời ngắn**", "Can you swim? — Yes, I **can**.", "can /kæn/ (khác \"I can swim\" /kən/)"],
        ["**Nhấn để đối lập**", "It's not **for** you, it's **from** you.", "for /fɔː/ · from /frɒm/"],
      ],
    },
    {
      t: "rule",
      formula: "Từ chức năng: yếu trong câu · MẠNH ở cuối câu, trong câu trả lời ngắn, khi nhấn đối lập",
      vi: "Yes, I can /kæn/ — nhưng I can swim /kən/.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Nhấn để đổi nghĩa (nhập môn)" },
    {
      t: "p",
      text: "Đôi khi ta **cố ý** dời trọng âm sang một từ để **sửa** hoặc **so sánh** — gọi là trọng âm đối lập (contrastive stress). Cùng một câu, nhấn khác chỗ thì nghĩa ngầm khác. Ở mức Tập 2 bạn chỉ cần **nghe ra** và dùng trong tình huống sửa thông tin (rất hay gặp trong họp và trong Listening — bẫy đổi ý).",
    },
    {
      t: "table",
      caption: "Một câu, năm nghĩa ngầm",
      head: ["Câu (từ in đậm = nhấn)", "Nghĩa ngầm"],
      rows: [
        ["**I** didn't say he took the money.", "Người khác nói, không phải tôi."],
        ["I **didn't** say he took the money.", "Tôi khẳng định là tôi KHÔNG nói vậy."],
        ["I didn't **say** he took the money.", "Tôi không nói ra — có thể tôi chỉ ám chỉ."],
        ["I didn't say **he** took the money.", "Tôi không nói là ANH ẤY — có thể người khác lấy."],
        ["I didn't say he took the **money**.", "Anh ấy lấy thứ khác, không phải tiền."],
      ],
    },
    {
      t: "examples",
      items: [
        { en: "I said **Tuesday**, not Thursday.", vi: "Tôi nói thứ Ba, không phải thứ Năm. — sửa thông tin." },
        { en: "We booked the **library**, not the hotel.", vi: "Chúng tôi đặt thư viện, không phải khách sạn." },
        { en: "The meeting is at **two**, not at ten.", vi: "Cuộc họp lúc hai giờ, không phải mười giờ." },
      ],
    },
    {
      t: "rule",
      formula: "Sửa / so sánh → nhấn MẠNH từ mang thông tin mới: I said Tuesday, not Thursday",
      vi: "Trong họp và ở Listening, từ được nhấn mạnh thường chính là đáp án đã được sửa.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Nêu ý kiến trong họp: 3 bước + phản hồi lịch sự" },
    {
      t: "sodo",
      kind: "flow",
      title: "Nêu ý kiến trong họp — 3 bước",
      caption: "Ba bước này cũng chính là khung trả lời Speaking Part 3 (Ngày 13: ý kiến + lý do + ví dụ).",
      steps: [
        { label: "1. Ý kiến", sub: "I think we should… · In my view, … · I'd suggest + V-ing" },
        { label: "2. Lý do", sub: "because… · The main reason is that…" },
        { label: "3. Đề xuất cụ thể / ví dụ", sub: "For example, … · We could… · What about…?" },
      ],
    },
    {
      t: "table",
      caption: "Phản hồi ý kiến người khác — từ đồng ý hẳn đến phản đối lịch sự",
      head: ["Mức độ", "Câu nói", "Nhấn ở đâu"],
      rows: [
        ["Đồng ý hẳn", "**Exactly.** · I **completely** agree. · That's a **great** idea.", "exactly · completely · great"],
        ["Đồng ý một phần", "**Fair** point, but… · I **partly** agree. · That's **true**, but…", "fair · partly · true — rồi \"but\" nhẹ"],
        ["Phản đối lịch sự", "I **see** your **point**, but… · I'm **not** sure about **that**. · That might be **difficult**, because…", "see · point · not · difficult"],
        ["Đề xuất thay thế", "**What** about…? · **Why** don't we…? · We could **try**…", "what · why · động từ chính sau could (could đọc nhẹ /kəd/)"],
      ],
    },
    {
      t: "canh",
      anh: ["busts-in-silhouette", "speech-balloon", "light-bulb", "handshake"],
      caption: "Ba giáo viên ở một trung tâm ngoại ngữ họp về **lớp học mùa hè**: học trực tuyến hay học ở trung tâm? Từ in đậm là từ được **nhấn**.",
    },
    {
      t: "dialogue",
      title: "Summer classes — online or here?",
      lines: [
        { who: "Linh", role: "a", text: "I **think** we should **move** the **summer** classes **online**, because **many** students go **back** to their **hometowns** in **July**.", vi: "Tôi nghĩ ta nên chuyển các lớp hè sang trực tuyến, vì nhiều học viên về quê vào tháng Bảy." },
        { who: "Mark", role: "b", text: "I **see** your **point**, but **some** **parents** **don't** **trust** online classes. **Why** don't we **offer** **both**?", vi: "Tôi hiểu ý chị, nhưng một số phụ huynh không tin lớp trực tuyến. Sao ta không mở cả hai?" },
        { who: "Hoa", role: "c", text: "That's a **good** **idea**. We could **run** the **morning** classes **online** and the **evening** classes **here**.", vi: "Ý hay đấy. Ta có thể dạy lớp buổi sáng trực tuyến và lớp buổi tối ở đây." },
        { who: "Linh", role: "a", text: "I'm **not** **sure** about the **evenings**. **Most** **teachers** want to **finish** **early** in **summer**.", vi: "Tôi không chắc về buổi tối. Hầu hết giáo viên muốn xong sớm vào mùa hè." },
        { who: "Mark", role: "b", text: "**Fair** point. So, let's **offer** online classes in the **morning**, and **only** **two** evening classes **here**.", vi: "Có lý. Vậy ta mở lớp trực tuyến buổi sáng, và chỉ hai lớp buổi tối ở đây." },
        { who: "Hoa", role: "c", text: "**Fine** by me. I'll **ask** the **teachers** this **week**.", vi: "Tôi đồng ý. Tuần này tôi sẽ hỏi các giáo viên." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: phản đối mà vẫn lịch sự",
      items: [
        "Nhấn **see** và **point** trong \"I see your point\" để tỏ ra thật sự lắng nghe; **but** đọc nhẹ /bət/ rồi mới đến ý của mình.",
        "Đừng nhấn **you** khi phản đối: \"**You** are wrong\" nghe như công kích cá nhân. Nhấn vào **vấn đề**: \"That might be **difficult** because…\"",
        "Ở Part 3 có thể dùng đúng các câu này khi \"phản biện\" một ý phổ biến: Some people say… **I see** their **point**, but **personally** I think…",
      ],
    },
    {
      t: "rule",
      formula: "I think we should + V, because + S + V. For example / We could + V · I see your point, but + S + V",
      vi: "Ý kiến → lý do → đề xuất; phản đối bắt đầu bằng thừa nhận ý người kia.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Áp vào Speaking Part 3: làm việc nhóm và họp" },
    {
      t: "p",
      text: "Part 3 hay hỏi về **công việc, làm việc nhóm, người lãnh đạo**. Trả lời theo 3 bước ở mục 5, thêm một câu **nhượng bộ** (Having said that, … / Of course, …) như đã học ở Ngày 13 — và nhấn đúng từ nội dung. Câu trả lời mẫu dưới đây ở mức **band 5.5–6** (từ in đậm = nhấn).",
    },
    {
      t: "dialogue",
      title: "Part 3 — Teamwork and meetings (band 5.5–6)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think it's better to work in a team or alone?" },
        { who: "Candidate", role: "candidate", text: "I'd **say** it **depends** on the **task**. For **creative** work, like **planning** an **event**, a **team** is **better**, because **different** people bring **different** ideas. For **example**, in my **last** project, a **classmate** suggested a **survey** that I would **never** have **thought** of. **Having** said **that**, for **detailed** work like **checking** numbers, I **prefer** working **alone**, because it's **quieter**.", vi: "Tôi cho là còn tuỳ việc. Với việc sáng tạo, như lên kế hoạch sự kiện, làm nhóm tốt hơn, vì mỗi người mang đến ý khác nhau. Ví dụ, trong dự án gần nhất, một bạn cùng lớp đề xuất làm khảo sát mà tôi sẽ không bao giờ nghĩ ra. Dù vậy, với việc tỉ mỉ như kiểm tra số liệu, tôi thích làm một mình hơn, vì yên tĩnh hơn." },
        { who: "Examiner", role: "examiner", text: "Why do some meetings waste time?" },
        { who: "Candidate", role: "candidate", text: "I **think** the **main** reason is that there's **no** clear **plan**. People **start** talking about **one** thing and **end** up **somewhere** **else**. **Also**, **sometimes** **one** person talks for **too** long, so **others** **don't** get a **chance** to **speak**. That's **why** I think **every** meeting should have a **short** **agenda**.", vi: "Tôi nghĩ lý do chính là không có kế hoạch rõ ràng. Người ta bắt đầu bàn một chuyện rồi lan sang chuyện khác. Ngoài ra, đôi khi một người nói quá lâu, nên những người khác không có cơ hội nói. Vì thế tôi nghĩ cuộc họp nào cũng nên có một chương trình ngắn." },
        { who: "Examiner", role: "examiner", text: "How can a manager make meetings more useful?" },
        { who: "Candidate", role: "candidate", text: "**Well**, I'd **suggest** **three** things. **First**, send the **agenda** **before** the meeting, so people can **prepare**. **Second**, **give** **everyone** a **chance** to **speak**, **especially** **quiet** people. And **finally**, **end** with a **summary** of **who** is **doing** **what**. My **aunt** is a **manager**, and she **always** does **this**. Her **meetings** **rarely** take **more** than **thirty** **minutes**.", vi: "À, tôi đề xuất ba điều. Thứ nhất, gửi chương trình họp trước, để mọi người chuẩn bị. Thứ hai, cho mọi người cơ hội nói, nhất là người ít nói. Và cuối cùng, kết thúc bằng phần tóm tắt ai làm việc gì. Dì tôi là quản lý, và dì luôn làm vậy. Các cuộc họp của dì hiếm khi quá ba mươi phút." },
      ],
    },
    {
      t: "note",
      title: "Vì sao câu trả lời này ở band 5.5–6",
      items: [
        "**FC**: câu nào cũng có khung rõ (I'd say it depends… / The main reason is that… / I'd suggest three things. First… Second… finally…), từ nối **của văn nói** (Also, That's why, Having said that) — không \"Moreover\".",
        "**LR**: dùng được từ của bài Nghe hôm nay (agenda, summary, suggest) và cụm tự nhiên (end up, get a chance to).",
        "**GRA**: có câu phức (because, so, that I would never have thought of — mệnh đề quan hệ của Ngày 15).",
        "**P**: nếu đọc đúng chỗ in đậm, nhịp đều và từ chức năng nhẹ, người nghe theo dõi dễ — đó là đặc trưng band 6 của tiêu chí Phát âm.",
      ],
    },
    {
      t: "p",
      text: "Part 3 hay hỏi dạng **“Some people say…. Do you agree?”** hoặc **“Do you agree that…?”**. Câu trả lời tệ nhất là “Yes.” / “No.” rồi dừng; câu trả lời “an toàn” nhất thường là **đồng ý một phần** — vì nó cho bạn nói **cả hai mặt** (đúng khung 4 bước Ngày 13). Bảng dưới xếp cụm theo **mức độ**, chọn mức đúng với ý mình thật sự nghĩ.",
    },
    {
      t: "table",
      caption: "Trả lời “Do you agree…?” — năm mức từ đồng ý hẳn đến phản đối rõ",
      head: ["Mức", "Cụm mở đầu", "Nói tiếp gì"],
      rows: [
        ["Đồng ý hoàn toàn", "**Absolutely.** · I **completely** agree. · I couldn't agree **more**.", "lý do + ví dụ"],
        ["Đồng ý phần lớn", "**Generally**, yes. · On the **whole**, I'd agree.", "lý do + một ngoại lệ nhỏ"],
        ["Đồng ý một phần", "I agree **up to a point**, but… · That's **partly** true, but… · To **some** extent, yes.", "mặt đúng → **but** → mặt chưa đúng"],
        ["Phản đối mềm", "That's **one** way to look at it, but… · I **see** why people say that, but… · I'm not **so** sure.", "thừa nhận lý lẽ của họ → ý của mình"],
        ["Phản đối rõ", "I **don't** really agree. · **Actually**, I think it's the **opposite**.", "lý do mạnh + ví dụ"],
      ],
    },
    {
      t: "dialogue",
      title: "Part 3 — Do you agree…? (band 5.5 ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Some people say that working from home makes people lazy. Do you agree?" },
        { who: "Candidate", role: "candidate", text: "I agree up to a point. Some people do find it hard to concentrate at home, especially if they live with small children. But I don't think it makes people lazy. In fact, my sister works more hours at home, because she doesn't waste time in traffic. So overall, I'd say it depends on the person, not the place.", vi: "Tôi đồng ý ở một mức nào đó. Một số người thấy khó tập trung ở nhà, nhất là khi sống cùng con nhỏ. Nhưng tôi không nghĩ nó làm người ta lười. Thực tế, chị tôi làm việc nhiều giờ hơn khi ở nhà, vì chị không mất thời gian kẹt xe. Nên nhìn chung, tôi cho là tuỳ người, không phải tuỳ nơi." },
        { who: "Examiner", role: "examiner", text: "Do you agree that the best leaders are the ones who talk the most?" },
        { who: "Candidate", role: "candidate", text: "That's one way to look at it, but I'm not so sure. Of course, a leader needs to explain things clearly. However, I think good leaders listen more than they talk. For example, my football coach always asks the players what they think before he decides anything. That's why the team trusts him.", vi: "Đó là một cách nhìn, nhưng tôi không chắc lắm. Tất nhiên lãnh đạo cần giải thích rõ ràng. Tuy nhiên, tôi nghĩ lãnh đạo giỏi nghe nhiều hơn nói. Ví dụ, huấn luyện viên bóng đá của tôi luôn hỏi ý cầu thủ trước khi quyết định điều gì. Vì thế cả đội tin ông ấy." },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận khi nói đồng ý / phản đối",
      items: [
        "~~I'm agree~~ → **I agree** (agree là động từ, không có am). ~~I'm not agree~~ → **I don't agree**.",
        "Đồng ý một phần thì **phải** nói cả phần “but…” — nói “I partly agree” rồi chỉ kể mặt đúng thì nghe như đồng ý hoàn toàn.",
        "Đề có chữ tuyệt đối (**always, the best, everyone, only**) là chỗ dễ **đồng ý một phần** nhất: “It's true **in many cases**, but not **always**.”",
      ],
    },
    {
      t: "mcq",
      id: "t2d17-noi-nhan",
      title: "Trọng âm câu — chọn đáp án đúng (5 câu)",
      items: [
        { q: "\"I'd like a cup of tea.\" Which words are stressed?", options: ["I'd, a, of", "like, cup, tea", "a, cup, of"], correct: 1, why: "like (động từ), cup (danh từ), tea (danh từ) là **từ nội dung** → nhấn. I'd, a, of là từ chức năng → đọc nhẹ (/ə/, /əv/)." },
        { q: "\"We need to book the room.\" Which word is NOT stressed?", options: ["need", "book", "the"], correct: 2, why: "**the** là mạo từ (từ chức năng) → /ðə/ nhẹ. need, book (động từ) và room (danh từ) được nhấn." },
        { q: "\"I didn't book the hotel. I booked the library.\" In the second sentence, which word carries the strongest stress?", options: ["library", "I", "booked"], correct: 0, why: "Câu thứ hai **sửa thông tin** (hotel → library) → nhấn mạnh từ mang thông tin mới: **library** (trọng âm đối lập, mục 4)." },
        { q: "\"Can you help me?\" — \"Yes, I can.\" How is \"can\" pronounced in the answer?", options: ["/kən/", "/kæn/", "it is not pronounced"], correct: 1, why: "Ở **câu trả lời ngắn / cuối câu**, từ chức năng về **dạng mạnh**: /kæn/. Dạng yếu /kən/ chỉ dùng giữa câu (I can **help**)." },
        { q: "Which sentence takes about the same time to say as \"Cats eat fish\"?", options: ["The cats will eat the fish.", "Cats, dogs and birds eat fish and meat every day.", "Fish."], correct: 0, why: "\"The **cats** will **eat** the **fish**\" vẫn có **3 trọng âm** như \"Cats eat fish\" → gần cùng độ dài (các từ nhẹ được nén). Câu B có nhiều trọng âm hơn hẳn; C chỉ có 1." },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện phát âm: từ nội dung vs từ chức năng" },
    {
      t: "p",
      text: "Đọc từng câu: **nhấn** từ ghi chữ HOA ở dòng nghĩa (to hơn, dài hơn, cao giọng hơn), đọc **lướt** các từ còn lại — nhưng không bỏ âm nào. Gõ tay nhịp ở mỗi từ nhấn.",
    },
    {
      t: "phatam",
      id: "t2d17-phat-am",
      title: "Luyện phát âm — trọng âm câu: nhấn từ nội dung, đọc yếu từ chức năng",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Từ chức năng đọc dạng yếu (a /ə/, the /ðə/, to /tə/, of /əv/, and /ənd/, do you /də ju/) nhưng vẫn phải nghe thấy. Từ phủ định (not, don't) luôn nhấn.",
      items: [
        { text: "I'd suggest a meeting on Friday.", ipa: "aɪd sədʒest ə miːtɪŋ ɒn fraɪdeɪ", vi: "I'd sug-GEST a MEET-ing on FRI-day" },
        { text: "I see your point, but I'm not sure.", ipa: "aɪ siː jə pɔɪnt bət aɪm nɒt ʃɔː", vi: "I SEE your POINT, but I'm NOT SURE — your /jə/, but /bət/" },
        { text: "We need to cut the cost of the event.", ipa: "wi niːd tə kʌt ðə kɒst əv ði ɪvent", vi: "We NEED to CUT the COST of the e-VENT — the trước nguyên âm /ði/" },
        { text: "Could you send me the figures by Tuesday?", ipa: "kəd ju send mi ðə fɪɡəz baɪ tjuːzdeɪ", vi: "Could you SEND me the FIG-ures by TUES-day?" },
        { text: "That's a good idea, and it's cheaper.", ipa: "ðæts ə ɡʊd aɪdɪə ənd ɪts tʃiːpə", vi: "That's a GOOD i-DEA, and it's CHEAP-er" },
        { text: "I don't think it's the right time.", ipa: "aɪ dəʊnt θɪŋk ɪts ðə raɪt taɪm", vi: "I DON'T THINK it's the RIGHT TIME — phủ định luôn nhấn" },
        { text: "What do you think of the plan?", ipa: "wɒt də ju θɪŋk əv ðə plæn", vi: "WHAT do you THINK of the PLAN? — do you /də ju/ đọc nhanh" },
        { text: "So, to sum up, we're going to book the library.", ipa: "səʊ tə sʌm ʌp wə ɡəʊɪŋ tə bʊk ðə laɪbrəri", vi: "So, to SUM UP, we're GO-ing to BOOK the LI-brary" },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện nói" },
    {
      t: "p",
      text: "**Part 3:** mỗi câu trả lời 4–6 câu theo khung Ý kiến → Lý do → Ví dụ (→ Nhượng bộ). Ghi âm, nghe lại và tự hỏi: mình có **nhấn** từ nội dung không, có đọc **đều từng chữ** không? **Tình huống họp:** trả lời như đang nói trong cuộc họp thật — dùng câu khung của mục 5.",
    },
    {
      t: "speak",
      id: "t2d17-noi-p3",
      part: "3",
      questions: [
        "Do you prefer working in a team or on your own? Why?",
        "What makes a good team leader?",
        "Why do some people find it difficult to give their opinion in meetings?",
        "Do you think online meetings will replace face-to-face meetings in the future?",
        "How can young people learn to work well in a team?",
      ],
    },
    {
      t: "speak",
      id: "t2d17-noi-hop",
      part: "3",
      questions: [
        "In a meeting, your manager suggests holding this year's company party at an expensive hotel. Give your opinion, one reason, and suggest an alternative.",
        "A colleague says: \"We should stop all online meetings.\" Disagree politely and explain why.",
        "At the end of a meeting, summarise the decision: the team will meet again on Thursday at three o'clock, and you will book the room.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D17_HOMEWORK: Lesson = {
  id: "t2d17-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 17",
  goal: "Ôn trọn Ngày 17: chọn và điền từ nối theo chức năng, sửa lỗi dấu câu và lạm dụng, nối câu, đọc một biên bản họp, nhận ra trọng âm câu, và viết một đoạn thân bài Task 2 dùng từ nối vừa đủ — để Writing CC đạt band 5.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (34 câu + 1 đoạn viết)",
      items: [
        "**I. Chọn từ nối theo chức năng** (8 câu).",
        "**II. Điền từ nối vào đoạn thân bài** (6 chỗ trống).",
        "**III. Chọn câu đúng — dấu câu & lạm dụng** (6 câu).",
        "**IV. Dịch / nối câu Việt → Anh** (6 câu, có 💡).",
        "**V. Đọc biên bản họp** (4 câu) · **VI. Trọng âm câu** (4 câu) · **VII. Viết** một đoạn thân bài (100–130 từ).",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 17 trước khi làm bài",
      caption: "Mỗi nhánh là điều dễ quên nhất.",
      center: "**Ngày 17**",
      branches: [
        { label: "Từ nối — tầng", items: ["but / so: trong câu", "However, / Therefore,: đầu câu mới", "không dán 2 câu bằng dấu phẩy"], anh: "link" },
        { label: "Từ nối — chức năng", items: ["thêm · đối lập · nguyên nhân", "kết quả · ví dụ · trình tự · kết luận", "≈ 1 từ đầu câu / 2–3 câu"], anh: "memo" },
        { label: "Nghe họp", items: ["đề xuất ≠ đồng ý", "Actually, no → đổi ý", "Could you…? — I'll… = ai làm"], anh: "headphone" },
        { label: "Trọng âm câu", items: ["nhấn từ nội dung", "từ chức năng nhẹ /ə/", "phủ định luôn nhấn"], anh: "speech-balloon" },
      ],
    },

    /* I */
    { t: "h", text: "I. Chọn từ nối theo chức năng (8 câu)" },
    {
      t: "mcq",
      id: "t2d17-bt-chon",
      title: "I. Chọn từ nối đúng (8 câu)",
      items: [
        { q: "The hotel was full, ___ we stayed with friends.", options: ["because", "so", "although"], correct: 1, why: "Ở với bạn là **kết quả** của việc khách sạn kín phòng → **so**. because sẽ đảo quan hệ nhân quả; although là nhượng bộ." },
        { q: "___ the weather was terrible, the match went ahead.", options: ["Because", "So", "Although"], correct: 2, why: "Thời tiết xấu **nhưng** trận đấu vẫn diễn ra → nhượng bộ: **Although**. So không mở đầu mệnh đề phụ kiểu này; Because sai nghĩa." },
        { q: "Smartphones are useful for students. ___, they can be a distraction in class.", options: ["However", "For example", "Therefore"], correct: 0, why: "Ý sau **đối lập** với ý trước (hữu ích ↔ gây xao nhãng), đứng đầu câu mới → **However,**." },
        { q: "Many cities, ___ Singapore and Seoul, have excellent public transport.", options: ["such as", "in addition", "because of"], correct: 0, why: "Theo sau chỉ là **danh từ** (Singapore and Seoul) nằm trong câu, làm ví dụ cho \"many cities\" → **such as**. in addition là thêm ý (đầu câu mới); because of nêu nguyên nhân — sai nghĩa." },
        { q: "Rents have risen sharply. ___, many young people still live with their parents.", options: ["In contrast", "For instance", "As a result"], correct: 2, why: "Sống với bố mẹ là **kết quả** của giá thuê tăng → **As a result,**. In contrast cần hai đối tượng để so sánh." },
        { q: "The flight was cancelled ___ a storm.", options: ["because", "because of", "so that"], correct: 1, why: "Phía sau là **danh từ** (a storm), không có động từ → **because of**. because cần mệnh đề (because there was a storm)." },
        { q: "Group A spent £20 a week on snacks, ___ Group B spent only £5.", options: ["so", "therefore", "whereas"], correct: 2, why: "So sánh **hai nhóm** trong một câu → **whereas** (trong khi). therefore / so là kết quả — không hợp nghĩa." },
        { q: "She took an evening course ___ she could get a better job.", options: ["so that", "because of", "although"], correct: 0, why: "Đi học **để** có việc tốt hơn (mục đích) + S + could → **so that**. because of cần danh từ; although là nhượng bộ." },
      ],
    },

    /* II */
    { t: "h", text: "II. Điền từ nối vào đoạn thân bài (6 chỗ trống)" },
    {
      t: "p",
      text: "Đề: **Should university students have part-time jobs?** Điền **một từ nối** (một từ hoặc một cụm cố định) vào mỗi chỗ trống. Chức năng ghi trong ngoặc. Viết hoa chữ đầu nếu đứng đầu câu (máy chấm không phân biệt hoa/thường).",
    },
    {
      t: "quiz",
      id: "t2d17-bt-dien",
      title: "II. Điền từ nối (6 chỗ trống)",
      kind: "fill",
      items: [
        { q: "Part-time jobs can be very useful for university students. (1) ___, they give students money for rent and food. (trình tự — ý thứ nhất)", answers: ["Firstly", "First", "First of all", "To begin with"] },
        { q: "(2) ___, my friend Lan works in a café at weekends and pays for her own books. (ví dụ — đầu câu)", answers: ["For example", "For instance"] },
        { q: "(3) ___, these jobs teach young people how to manage their time. (thêm ý — đầu câu)", answers: ["In addition", "Moreover", "Furthermore", "Also", "Besides", "Additionally", "Secondly", "Second"] },
        { q: "(4) ___, students who work too many hours often get lower marks… (đối lập — đầu câu)", answers: ["However", "On the other hand", "Nevertheless", "Nonetheless"] },
        { q: "…students who work too many hours often get lower marks (5) ___ tiredness. (nguyên nhân + DANH TỪ)", answers: ["because of", "due to", "owing to", "as a result of"] },
        { q: "(6) ___, universities should advise students to work no more than fifteen hours a week. (kết quả / kết luận của lập luận — đầu câu)", answers: ["Therefore", "As a result", "Consequently", "For this reason", "Because of this", "Thus", "Hence"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án II",
      items: [
        "**(1) Firstly / First of all** — mở lợi ích thứ nhất. **(2) For example** — sau là cả một câu (my friend Lan works…), nên không dùng ~~such as~~.",
        "**(3) In addition / Moreover** — thêm lợi ích cùng hướng. ~~On the other hand~~ sai vì chưa có mặt đối lập.",
        "**(4) However** — chuyển sang mặt hại. Nếu muốn dùng but thì phải nối vào câu trước bằng dấu phẩy, không đứng đầu câu trong bài viết.",
        "**(5) because of / due to** — theo sau là **danh từ** tiredness. ~~because tiredness~~ thiếu động từ.",
        "**(6) Therefore / For this reason** — câu đề xuất được rút ra từ ý trước. Đoạn có 6 câu mà 5 câu mở bằng từ nối là đã **hơi nhiều** — bài thật nên gộp bớt (xem phần VII).",
      ],
    },

    /* III */
    { t: "h", text: "III. Chọn câu đúng — dấu câu & lạm dụng (6 câu)" },
    {
      t: "mcq",
      id: "t2d17-bt-sua",
      title: "III. Chọn câu / cách viết đúng (6 câu)",
      items: [
        { q: "Choose the correct sentence.", options: ["Although it was raining, but we went out.", "Although it was raining, we went out.", "Although it was raining. We went out."], correct: 1, why: "Một chỗ nối, một từ nối: **Although…, …**. A thừa but; C tách mệnh đề phụ thành câu cụt." },
        { q: "Choose the correctly punctuated sentence.", options: ["The museum is free, however it is closed on Mondays.", "The museum is free however, it is closed on Mondays.", "The museum is free. However, it is closed on Mondays."], correct: 2, why: "**However** mở câu mới: dấu chấm trước, dấu phẩy sau. A là comma splice; B đặt dấu phẩy sai chỗ." },
        { q: "Choose the correct sentence.", options: ["She was late because the traffic was heavy.", "She was late because of the traffic was heavy.", "She was late because of the traffic heavy."], correct: 0, why: "Sau là **mệnh đề** (the traffic was heavy) → **because**. Muốn dùng because of thì phải là danh từ: because of the heavy traffic." },
        { q: "\"Cars are convenient. ___\" Choose the best second sentence.", options: ["Moreover, they are expensive to run.", "However, they are expensive to run.", "On the other hand, they are also convenient."], correct: 1, why: "Tiện lợi (tốt) ↔ tốn kém (xấu) là **đối lập** → However. Moreover chỉ dùng cho ý **cùng hướng**; C lặp lại ý và dùng sai On the other hand." },
        { q: "\"Cars pollute the air. ___ they cause noise.\" Choose the best linker.", options: ["In addition,", "On the other hand,", "In contrast,"], correct: 0, why: "Hai tác hại **cùng hướng** → **In addition,**. On the other hand / In contrast báo đối lập — không có gì đối lập ở đây." },
        { q: "Choose the correct sentence.", options: ["Beside, the course is cheap.", "In the other hand, the course is cheap.", "Besides, the course is cheap."], correct: 2, why: "**Besides** (có -s) = ngoài ra. **beside** = bên cạnh (giới từ chỉ vị trí). Cụm đúng là **On** the other hand, không phải ~~In the other hand~~." },
      ],
    },

    /* IV */
    { t: "h", text: "IV. Dịch / nối câu Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d17-bt-dich",
      title: "IV. Dịch sang tiếng Anh — dùng đúng từ nối được gợi ý (6 câu)",
      kind: "translate",
      grammar: "S + V, but + S + V · Because + S + V, S + V · Câu. In addition, + câu · Although + S + V, S + V · because of + N · These + N + V",
      items: [
        { q: "Tôi thích nấu ăn, nhưng tôi không có thời gian.", hint: "I like cooking, but, I don't have time", answers: ["I like cooking, but I don't have time.", "I like cooking, but I do not have time.", "I like cooking, but I don't have the time.", "I like to cook, but I don't have time.", "I love cooking, but I don't have time.", "I enjoy cooking, but I don't have time.", "I like cooking but I don't have time.", "I like cooking, but I have no time.", "I like cooking, but I don't have enough time."] },
        { q: "Vì học phí tăng, nhiều sinh viên phải đi làm thêm.", hint: "Because tuition fees have risen / rose, many students have to work part-time", answers: ["Because tuition fees have risen, many students have to work part-time.", "Because tuition fees rose, many students have to work part-time.", "Because tuition fees have increased, many students have to work part-time.", "Because tuition fees increased, many students have to work part-time.", "Because tuition fees have gone up, many students have to work part-time.", "Because tuition fees have risen, many students have to get part-time jobs.", "Because tuition fees have risen, many students have to work part time.", "Many students have to work part-time because tuition fees have risen."] },
        { q: "Thành phố có nhiều công viên. Ngoài ra, hệ thống xe buýt rất tốt.", hint: "The city has many parks. In addition, the bus system is very good", answers: ["The city has many parks. In addition, the bus system is very good.", "The city has a lot of parks. In addition, the bus system is very good.", "The city has many parks. In addition, its bus system is very good.", "The city has many parks. Moreover, the bus system is very good.", "The city has many parks. Also, the bus system is very good.", "The city has many parks. In addition, the bus service is very good.", "The city has many parks. In addition, the bus system is excellent."] },
        { q: "Dù trời lạnh, họ vẫn đi bơi.", hint: "Although it was cold, they still went swimming", answers: ["Although it was cold, they still went swimming.", "Although it was cold, they went swimming.", "Although it was cold, they still went for a swim.", "Although the weather was cold, they still went swimming.", "Though it was cold, they still went swimming.", "They still went swimming although it was cold.", "Although it is cold, they still go swimming."] },
        { q: "Cửa hàng đóng cửa vì kỳ nghỉ lễ.", hint: "The shop is closed / was closed, because of, the holiday", answers: ["The shop is closed because of the holiday.", "The shop was closed because of the holiday.", "The shop is closed because of the public holiday.", "The shop was closed because of the public holiday.", "The store is closed because of the holiday.", "The store was closed because of the holiday.", "The shop is closed due to the holiday.", "The shop was closed due to the holiday."] },
        { q: "Nhiều công ty đã chuyển sang họp trực tuyến. Những thay đổi này giúp nhân viên tiết kiệm thời gian.", hint: "Many companies have switched / moved to online meetings. These changes help staff / employees save time", answers: ["Many companies have switched to online meetings. These changes help staff save time.", "Many companies have switched to online meetings. These changes help employees save time.", "Many companies have moved to online meetings. These changes help staff save time.", "Many companies have moved to online meetings. These changes help employees save time.", "Many companies switched to online meetings. These changes help staff save time.", "Many companies have switched to online meetings. These changes help staff to save time.", "Many companies have switched to online meetings. These changes help employees to save time.", "Many companies have changed to online meetings. These changes help employees save time."] },
      ],
    },

    /* V */
    { t: "h", text: "V. Đọc biên bản họp (4 câu)" },
    {
      t: "passage",
      title: "Minutes — Staff meeting, 3 May",
      intro: "Biên bản (minutes) ghi lại quyết định của một cuộc họp. Đọc rồi làm 4 câu bên dưới.",
      paras: [
        { text: "**Present:** Ms Tran (chair), Mr Ali, Ms Rossi, Mr Park." },
        { label: "1", text: "**Office move.** Mr Ali proposed moving to the new building in June. Ms Rossi raised an objection: the internet connection there will not be ready until August. After some discussion, the team reached a consensus to postpone the move until September." },
        { label: "2", text: "**Training.** Ms Tran suggested a one-day course on writing reports, and everyone agreed. Mr Park will contact three training companies and report back by 20 May. Mr Ali offered to find a room for the course." },
        { label: "3", text: "**Next meeting:** 17 May, 10 a.m., meeting room B." },
      ],
    },
    {
      t: "mcq",
      id: "t2d17-bt-doc-chon",
      title: "V. Câu 1–2 — Choose the correct letter, A, B or C",
      items: [
        { q: "(1) Why was the office move postponed?", options: ["The new building is too small.", "The internet will not be ready in June.", "Mr Ali changed his mind."], correct: 1, why: "Mục 1: \"the internet connection there **will not be ready until August**\" → chuyển vào tháng Sáu thì chưa có internet. A không được nhắc; C — Mr Ali là người **đề xuất**, không có chuyện đổi ý." },
        { q: "(2) Who will contact the training companies?", options: ["Ms Tran", "Mr Ali", "Mr Park"], correct: 2, why: "Mục 2: \"**Mr Park will contact** three training companies\". Ms Tran **đề xuất** khoá học; Mr Ali nhận việc **tìm phòng** — bẫy \"đề xuất ≠ người làm\"." },
      ],
    },
    {
      t: "quiz",
      id: "t2d17-bt-doc-dien",
      title: "V. Câu 3–4 — Write ONE WORD AND/OR A NUMBER from the minutes",
      kind: "fill",
      items: [
        { q: "(3) The office will move in ___.", answers: ["September"] },
        { q: "(4) Mr Park must report back by ___ May.", answers: ["20", "20th"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án V (3–4)",
      items: [
        "**(3) September** — bẫy ba tháng: June (đề xuất ban đầu, bị bác), August (internet sẵn sàng), **September** (quyết định cuối: \"postpone the move until September\").",
        "**(4) 20 / 20th** — \"report back by **20 May**\". Đừng nhầm với **17 May** (ngày họp tiếp theo).",
      ],
    },

    /* VI */
    { t: "h", text: "VI. Trọng âm câu (4 câu)" },
    {
      t: "mcq",
      id: "t2d17-bt-nhan",
      title: "VI. Trọng âm câu — chọn đáp án đúng (4 câu)",
      items: [
        { q: "\"We need to finish the report by Friday.\" Which group of words is stressed?", options: ["need, finish, report, Friday", "We, to, the, by", "need, the, by"], correct: 0, why: "need, finish (động từ chính), report, Friday (danh từ) = **từ nội dung**. We, to, the, by là từ chức năng → đọc nhẹ." },
        { q: "How is \"to\" usually pronounced in \"I want to go\"?", options: ["/tuː/", "/tə/", "it is silent"], correct: 1, why: "Giữa câu, \"to\" là từ chức năng → dạng yếu **/tə/**. Không đọc /tuː/ như số two, và cũng **không bỏ** hẳn." },
        { q: "\"I didn't say the price was high.\" (the speaker stresses PRICE) What does the speaker mean?", options: ["Someone else said it.", "The price was low.", "Something else was high, not the price."], correct: 2, why: "Nhấn **price** → đối lập với một thứ khác: \"không phải giá cao, mà là thứ khác cao\" (ví dụ chi phí vận chuyển). Muốn nói \"người khác nói\" thì nhấn **I**." },
        { q: "In which sentence is \"for\" pronounced in its STRONG form /fɔː/?", options: ["This present is for you.", "What is it for?", "Thanks for coming."], correct: 1, why: "\"for\" đứng **cuối câu** → dạng mạnh /fɔː/. Ở A và C nó nằm giữa câu → dạng yếu /fə/." },
      ],
    },

    /* VII */
    { t: "h", text: "VII. Viết một đoạn thân bài (100–130 từ)" },
    {
      t: "essay",
      id: "t2d17-bt-viet",
      task: "Task 2",
      prompt: "Write ONE body paragraph (100–130 words) for this question: \"Some people think that all work meetings should be held online. To what extent do you agree or disagree?\" Your paragraph should give ONE main idea, a reason and an example. Use no more than THREE linking adverbials at the start of sentences (However, In addition, For example…), and use at least one \"this / these + noun\".",
      minWords: 100,
      tips: [
        "Câu chủ đề nêu **một** ý chính: Online meetings save a great deal of time for employees. (hoặc ý ngược lại: Face-to-face meetings build stronger relationships.)",
        "Giải thích bằng **because / so** trong câu, không cần trạng từ liên kết ở mọi câu.",
        "Ví dụ: **For example,** + một tình huống cụ thể (một công ty, một con số, một người).",
        "Nối câu bằng **This + danh từ**: This saving… / These meetings… / This problem…",
        "Soát cuối: gạch dưới từ nối đầu câu — tối đa 3; không có ~~, however~~ giữa hai câu; không ~~Although… but~~.",
      ],
    },
  ],
};

export const NGAY_17: Lesson[] = [T2D17_GRAMMAR, T2D17_LISTENING, T2D17_SPEAKING, T2D17_HOMEWORK];
