/**
 * IELTS Tập 2 — Ngày 13 (tự soạn 12/11/2026, không chụp sách; mọi câu ví dụ, kịch bản nghe, câu bài tập VIẾT MỚI):
 *   Bài 1 · Grammar   — Câu điều kiện loại 0 & 1 · unless · when / as soon as / until / before / after + hiện tại đơn [G16]
 *   Bài 2 · Listening — Listening Part 3: MCQ · chọn TWO · Flow-chart · Matching người – ý kiến [L05 L09 L11 L12]
 *   Bài 3 · Speaking  — Part 3 nhập môn: Ý kiến → Lý do → Ví dụ → Nhượng bộ; xin nhắc lại / giải thích câu hỏi [S06 X05]
 *                        🔊 trọng âm từ 3 âm tiết [S12]
 *   Bài tập           — 40 câu: chia động từ, chọn, sửa lỗi, dịch 💡, đọc thoại Part 3, trọng âm + 3 câu nói Part 3.
 * Nối: Tập 1 Ngày 11 (Listening Part 3 lần đầu) · Tập 1 Ngày 12/14 (khung O–R–E) · Tập 1 Ngày 13 (Could you repeat…?).
 * Bài nghe Part 3 dùng chính câu điều kiện của bài 1 (If you test three changes…, Unless people see…).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D13_GRAMMAR: Lesson = {
  id: "t2d13-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Câu điều kiện loại 0 & 1 · unless · when / as soon as / until",
  goal: "Viết và nói đúng câu điều kiện loại 0 (sự thật, quy luật) và loại 1 (khả năng có thật ở tương lai), dùng unless và các mệnh đề thời gian when / as soon as / until / before / after mà không đặt will sai chỗ — câu phức chắc ăn nhất để đạt GRA band 5 ở Writing Task 2 và Speaking Part 3.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Câu điều kiện** (conditional sentence) có hai vế: **mệnh đề if** (điều kiện — “nếu…”) và **mệnh đề chính** (kết quả). Hôm nay học hai loại nói về chuyện **có thật / có thể xảy ra**: ==loại 0== và ==loại 1==.",
        "**Loại 0**: If + hiện tại đơn, **hiện tại đơn** — sự thật, quy luật, thói quen (if gần nghĩa when). **Loại 1**: If + hiện tại đơn, **will + V** — việc có thể xảy ra ở tương lai.",
        "Lỗi số 1 của người Việt: **không đặt will sau if** (~~If it will rain…~~). Luật này áp cả cho **when / as soon as / until / before / after** khi nói về tương lai.",
        "**unless** = if … not (“trừ khi”) → **không** thêm not lần nữa (~~Unless you don't hurry~~).",
        "Đẩy band: **Grammatical Range & Accuracy (GRA) band 5** ở Writing và Speaking — mô tả band 5 ghi “có thử câu phức nhưng sai nhiều”. Một câu điều kiện **đúng** là câu phức an toàn nhất để nêu **hệ quả của giải pháp** (Task 2) và **dự đoán** (Part 3).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Câu điều kiện là gì? Hai mệnh đề và một dấu phẩy" },
    {
      t: "p",
      text: "**Mệnh đề** (clause) là một cụm có **chủ ngữ + động từ** của riêng nó. Câu điều kiện ghép hai mệnh đề: **mệnh đề if** nêu **điều kiện** (nếu điều này xảy ra…) và **mệnh đề chính** nêu **kết quả** (…thì điều kia xảy ra). Ví dụ: **If it rains, we stay at home.** — “Nếu trời mưa (điều kiện), chúng tôi ở nhà (kết quả).”",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một câu điều kiện = điều kiện → kết quả",
      caption: "Hai vế đổi chỗ được mà nghĩa không đổi. Chỉ khác ở dấu phẩy: if đứng ĐẦU câu thì có phẩy; if đứng GIỮA câu thì không.",
      steps: [
        { label: "Mệnh đề **if** (điều kiện)", sub: "If you heat ice" },
        { label: "dấu phẩy", sub: "chỉ khi if đứng đầu câu" },
        { label: "Mệnh đề **chính** (kết quả)", sub: "it melts." },
      ],
    },
    {
      t: "table",
      caption: "Hai cách xếp — cùng một nghĩa",
      head: ["Vị trí của if", "Ví dụ", "Dấu phẩy"],
      rows: [
        ["If đứng **đầu** câu", "**If** you heat ice**,** it melts.", "**Có** phẩy sau mệnh đề if"],
        ["If đứng **giữa** câu", "Ice melts **if** you heat it.", "**Không** phẩy"],
        ["Câu hỏi", "What **will** you do **if** you fail the test?", "Không phẩy; mệnh đề chính là câu hỏi"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai: “nếu… thì…” không phải “if… so…”",
      items: [
        "Tiếng Việt nói “**nếu** trời mưa **thì** chúng tôi ở nhà”, nên người học hay thêm chữ “thì” vào tiếng Anh: ~~If it rains, so we stay at home.~~ → **If it rains, we stay at home.** Dấu phẩy đã làm việc của chữ “thì”.",
        "Cũng đừng ghép **because / but** vào giữa: ~~If you study hard, because you will pass.~~",
        "**then** có thể đứng sau dấu phẩy (If it rains, **then** we stay at home) nhưng hiếm khi cần — bài thi band 5 không cần dùng.",
        "Thiếu dấu phẩy khi if đứng đầu là lỗi **dấu câu** trong Writing — mất điểm nhỏ nhưng lặp nhiều lần thì giám khảo thấy.",
      ],
    },
    {
      t: "rule",
      formula: "If + mệnh đề điều kiện, mệnh đề kết quả · Mệnh đề kết quả + if + mệnh đề điều kiện",
      vi: "if đứng đầu câu → có phẩy; if đứng giữa → không phẩy. Không thêm so / because để dịch chữ “thì”.",
    },
    {
      t: "quiz",
      id: "t2d13-cau-truc-dich",
      title: "Dịch sang tiếng Anh — hai cách xếp câu điều kiện (3 câu)",
      kind: "translate",
      grammar: "If + S + V, S + V (có phẩy) · S + V + if + S + V (không phẩy) · không dùng so để dịch “thì”.",
      items: [
        {
          q: "Nếu trời mưa thì chúng tôi ở nhà.",
          hint: "If it rains, we stay (at) home — không thêm so",
          answers: ["If it rains, we stay at home.", "If it rains, we stay home.", "We stay at home if it rains.", "We stay home if it rains.", "If it rains, we will stay at home.", "If it rains, we will stay home.", "We will stay at home if it rains.", "We will stay home if it rains."],
        },
        {
          q: "Tôi đi bộ đi làm nếu thời tiết đẹp.",
          hint: "I walk to work, if, the weather is nice / good — if đứng giữa câu, không phẩy",
          answers: ["I walk to work if the weather is nice.", "I walk to work if the weather is good.", "If the weather is nice, I walk to work.", "If the weather is good, I walk to work.", "I walk to work if the weather is fine.", "If the weather is fine, I walk to work."],
        },
        {
          q: "Nếu bạn cần giúp đỡ thì gọi cho tôi nhé.",
          hint: "If you need help, call me — mệnh lệnh ở mệnh đề chính",
          answers: ["If you need help, call me.", "If you need help, please call me.", "Call me if you need help.", "Please call me if you need help.", "If you need any help, call me.", "If you need any help, please call me.", "If you need help, give me a call.", "If you need help, phone me."],
        },
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Câu điều kiện loại 0: sự thật, quy luật, thói quen" },
    {
      t: "p",
      text: "Loại 0 nói về điều **luôn đúng** mỗi khi điều kiện xảy ra: sự thật khoa học, quy luật xã hội, thói quen của bạn. Vì “**lần nào cũng vậy**”, chữ **if** ở đây gần như bằng **when** (khi) hay **whenever** (mỗi khi). **Cả hai vế đều chia hiện tại đơn.**",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "If + S + V(s/es), S + V(s/es)",
          vi: "Loại 0 — hai vế đều hiện tại đơn; if ≈ when.",
          examples: [
            { en: "If you heat water to 100°C, it boils.", vi: "Nếu đun nước tới 100 độ C, nước sôi." },
            { en: "If I have a lot of homework, I study in the library.", vi: "Hễ có nhiều bài tập là tôi học ở thư viện." },
          ],
        },
        {
          formula: "If + S + don't / doesn't + V, S + V(s/es)",
          vi: "Phủ định ở vế điều kiện — vẫn hiện tại đơn.",
          examples: [
            { en: "If plants don't get enough light, they turn yellow.", vi: "Nếu cây không đủ ánh sáng, lá chuyển vàng." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Loại 0 dùng khi nào",
      head: ["Dùng cho", "Ví dụ", "Dịch"],
      rows: [
        ["Sự thật khoa học", "If you mix blue and yellow, you get green.", "Nếu trộn xanh dương với vàng, bạn được màu xanh lá."],
        ["Quy luật về con người, xã hội (rất hợp Task 2)", "If cities have cheap public transport, fewer people drive.", "Nếu thành phố có giao thông công cộng rẻ, ít người lái xe hơn."],
        ["Thói quen của bạn (Speaking Part 1)", "If I feel stressed, I go for a long walk.", "Hễ thấy căng thẳng là tôi đi bộ một vòng dài."],
        ["Kết quả luôn xảy ra với một người", "My sister gets a headache if she doesn't drink enough water.", "Em gái tôi bị đau đầu nếu không uống đủ nước."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với loại 0",
      items: [
        "Vế kết quả **không** dùng will khi bạn nói điều **luôn luôn** đúng: If you heat ice, it **melts** (không cần ~~will melt~~ — viết will melt cũng không sai hẳn, nhưng nghe như nói về một lần cụ thể).",
        "Nhớ **-s/-es** ở cả hai vế khi chủ ngữ là ngôi thứ ba số ít: If **she misses** breakfast, **she feels** tired by ten o'clock.",
        "Thói quen trong **quá khứ** thì cả hai vế chia quá khứ đơn: When I was a child, if it **rained**, we **played** cards. (Tập 2 Ngày 21 học thêm used to / would.)",
      ],
    },
    {
      t: "rule",
      formula: "If + S + V(s/es), S + V(s/es)",
      vi: "Loại 0: điều luôn đúng mỗi khi điều kiện xảy ra — thay if bằng when mà nghĩa không đổi thì đó là loại 0.",
    },
    {
      t: "quiz",
      id: "t2d13-loai0-dich",
      title: "Dịch sang tiếng Anh — câu điều kiện loại 0 (4 câu)",
      kind: "translate",
      grammar: "If / When + S + V(s/es), S + V(s/es) — cả hai vế hiện tại đơn.",
      items: [
        {
          q: "Nếu bạn đun nước tới 100 độ C, nó sôi.",
          hint: "If you heat water to 100 degrees, it boils",
          answers: ["If you heat water to 100 degrees, it boils.", "If you heat water to 100°C, it boils.", "If you heat water to 100 degrees Celsius, it boils.", "Water boils if you heat it to 100 degrees.", "Water boils if you heat it to 100°C.", "Water boils if you heat it to 100 degrees Celsius.", "If you heat water to one hundred degrees, it boils."],
        },
        {
          q: "Nếu tôi uống cà phê buổi tối, tôi không ngủ được.",
          hint: "If I drink coffee in the evening, I can't sleep",
          answers: ["If I drink coffee in the evening, I can't sleep.", "If I drink coffee in the evening, I cannot sleep.", "If I drink coffee at night, I can't sleep.", "If I drink coffee at night, I cannot sleep.", "I can't sleep if I drink coffee in the evening.", "I can't sleep if I drink coffee at night.", "If I have coffee in the evening, I can't sleep.", "If I have coffee at night, I can't sleep."],
        },
        {
          q: "Nếu người ta không ngủ đủ, họ khó tập trung.",
          hint: "If people don't sleep enough / get enough sleep, they find it hard to concentrate",
          answers: ["If people don't sleep enough, they find it hard to concentrate.", "If people don't get enough sleep, they find it hard to concentrate.", "If people don't sleep enough, they find it difficult to concentrate.", "If people don't get enough sleep, they find it difficult to concentrate.", "If people don't sleep enough, it is hard for them to concentrate.", "If people don't get enough sleep, it is hard for them to concentrate.", "If people don't sleep enough, it is difficult for them to concentrate.", "People find it hard to concentrate if they don't sleep enough.", "People find it hard to concentrate if they don't get enough sleep."],
        },
        {
          q: "Khi trời lạnh, ông tôi ở trong nhà.",
          hint: "If / When it is cold, my grandfather stays indoors",
          answers: ["When it is cold, my grandfather stays indoors.", "If it is cold, my grandfather stays indoors.", "When it is cold, my grandfather stays inside.", "If it is cold, my grandfather stays inside.", "When it is cold, my grandfather stays at home.", "If it is cold, my grandfather stays at home.", "My grandfather stays indoors when it is cold.", "My grandfather stays indoors if it is cold.", "My grandfather stays inside when it is cold.", "When it's cold, my grandfather stays indoors.", "When it's cold, my grandpa stays indoors."],
        },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Câu điều kiện loại 1: khả năng có thật ở tương lai" },
    {
      t: "p",
      text: "Loại 1 nói về một việc **có thể xảy ra** trong tương lai (chưa biết chắc) và **kết quả** nếu nó xảy ra. Điều kỳ lạ với người Việt: dù cả hai việc đều ở **tương lai**, vế **if** vẫn chia **hiện tại đơn** — chỉ vế kết quả mới có **will**.",
    },
    {
      t: "sodo",
      kind: "timeline",
      title: "Loại 1: cả hai việc ở tương lai, nhưng chỉ vế kết quả có will",
      caption: "Mốc 0 = bây giờ. Điều kiện (if it rains tomorrow) nằm ở tương lai nhưng vẫn viết hiện tại đơn; kết quả (we will stay at home) viết will + V.",
      marks: [
        { from: 0, label: "Bây giờ: chưa biết ngày mai có mưa không", kieu: "diem", mau: 1 },
        { from: 3, label: "**If** it **rains** tomorrow… (điều kiện — hiện tại đơn)", kieu: "diem", mau: 2 },
        { from: 4, to: 8, label: "…we **will stay** at home (kết quả — will + V)", kieu: "doan", mau: 3 },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "If + S + V(s/es), S + will + V",
          vi: "Loại 1 — khẳng định. will có thể viết tắt 'll.",
          examples: [
            { en: "If it rains tomorrow, we will stay at home.", vi: "Nếu mai trời mưa, chúng tôi sẽ ở nhà." },
            { en: "If you practise every day, your speaking will improve quickly.", vi: "Nếu bạn luyện mỗi ngày, kỹ năng nói sẽ tiến bộ nhanh." },
          ],
        },
        {
          formula: "If + S + don't / doesn't + V, S + won't + V",
          vi: "Phủ định — vế if mượn don't / doesn't; vế kết quả dùng won't (= will not).",
          examples: [
            { en: "If she doesn't leave now, she won't catch the train.", vi: "Nếu cô ấy không đi ngay, cô ấy sẽ không kịp tàu." },
          ],
        },
        {
          formula: "What will + S + V + if + S + V(s/es)?",
          vi: "Câu hỏi — đảo will ở mệnh đề chính; vế if giữ nguyên hiện tại đơn.",
          examples: [
            { en: "What will you do if you don't get the scholarship?", vi: "Bạn sẽ làm gì nếu không được học bổng?" },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Loại 0 hay loại 1?",
      caption: "Hỏi: “Lần nào cũng thế?” → loại 0. “Một lần cụ thể, có thể xảy ra trong tương lai?” → loại 1.",
      cols: [
        {
          title: "**Loại 0** — luôn đúng",
          anh: "ice",
          items: ["If + hiện tại đơn, **hiện tại đơn**", "If you heat ice, it **melts**.", "If I'm tired, I **go** to bed early.", "if ≈ when / whenever"],
        },
        {
          title: "**Loại 1** — có thể xảy ra",
          anh: "umbrella-with-rain-drops",
          items: ["If + hiện tại đơn, **will + V**", "If it rains tomorrow, we **will stay** in.", "If I'm tired tonight, I**'ll go** to bed early.", "một tình huống cụ thể ở tương lai"],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với loại 1",
      items: [
        "**Đặt will sau if**: ~~If it will rain tomorrow, we will stay at home.~~ → **If it rains** tomorrow, we will stay at home. Đây là lỗi giám khảo gặp nhiều nhất ở band 4–5.",
        "**Đặt will ở cả hai vế** hoặc **bỏ will ở cả hai**: ~~If you will study hard, you pass.~~ → **If you study hard, you will pass.**",
        "**Quên -s** ở vế if vì nghĩ “đây là tương lai”: ~~If he come late~~ → **If he comes late**, we'll start without him.",
        "Sách ngữ pháp nâng cao có trường hợp hiếm “If you **will** wait here, …” (will = sẵn lòng, rất lịch sự). Band 5 không cần dùng — cứ nhớ chắc: **không will sau if**.",
      ],
    },
    {
      t: "rule",
      formula: "If + S + V(s/es), S + will / won't + V",
      vi: "Loại 1: việc có thể xảy ra ở tương lai — vế if hiện tại đơn, vế kết quả will + V. Không bao giờ will sau if.",
    },
    {
      t: "quiz",
      id: "t2d13-loai1-dich",
      title: "Dịch sang tiếng Anh — câu điều kiện loại 1 (5 câu)",
      kind: "translate",
      grammar: "If + S + V(s/es), S + will / won't + V — vế if KHÔNG có will.",
      items: [
        {
          q: "Nếu ngày mai trời mưa, chúng tôi sẽ hoãn chuyến đi.",
          hint: "If it rains tomorrow, we will postpone / put off the trip",
          answers: ["If it rains tomorrow, we will postpone the trip.", "If it rains tomorrow, we will put off the trip.", "If it rains tomorrow, we will delay the trip.", "We will postpone the trip if it rains tomorrow.", "We will put off the trip if it rains tomorrow.", "If it rains tomorrow, we will postpone our trip.", "If it rains tomorrow, we will put the trip off."],
        },
        {
          q: "Nếu bạn học chăm, bạn sẽ đậu kỳ thi.",
          hint: "If you study hard, you will pass the exam",
          answers: ["If you study hard, you will pass the exam.", "If you study hard, you will pass the test.", "You will pass the exam if you study hard.", "You will pass the test if you study hard.", "If you study hard, you will pass your exam."],
        },
        {
          q: "Nếu cô ấy không đến sớm, cô ấy sẽ lỡ xe buýt.",
          hint: "If she doesn't come / arrive early, she will miss the bus",
          answers: ["If she doesn't come early, she will miss the bus.", "If she doesn't arrive early, she will miss the bus.", "If she does not come early, she will miss the bus.", "She will miss the bus if she doesn't come early.", "She will miss the bus if she doesn't arrive early.", "If she doesn't get there early, she will miss the bus."],
        },
        {
          q: "Nếu giá xăng tăng, nhiều người sẽ đi xe buýt.",
          hint: "If petrol prices rise / go up, many people will take the bus",
          answers: ["If petrol prices rise, many people will take the bus.", "If petrol prices go up, many people will take the bus.", "If petrol prices increase, many people will take the bus.", "If petrol prices rise, many people will go by bus.", "If the price of petrol rises, many people will take the bus.", "If the price of petrol goes up, many people will take the bus.", "If fuel prices rise, many people will take the bus.", "If petrol prices rise, a lot of people will take the bus.", "If petrol prices rise, many people will use the bus.", "Many people will take the bus if petrol prices rise."],
        },
        {
          q: "Họ sẽ không đến nếu bạn không mời họ.",
          hint: "They won't come, if you don't invite them",
          answers: ["They won't come if you don't invite them.", "They will not come if you do not invite them.", "They will not come if you don't invite them.", "If you don't invite them, they won't come.", "If you do not invite them, they will not come.", "They won't come unless you invite them.", "Unless you invite them, they won't come."],
        },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Loại 1 mở rộng: can / may / might / should / must và câu mệnh lệnh" },
    {
      t: "p",
      text: "Vế kết quả của loại 1 **không bắt buộc** là will. Bạn thay will bằng một **động từ khuyết thiếu** (modal — đã học Tập 1 Ngày 13) để đổi sắc thái, hoặc dùng **câu mệnh lệnh** để khuyên, dặn. **Vế if vẫn giữ nguyên hiện tại đơn.**",
    },
    {
      t: "table",
      head: ["Vế kết quả", "Nghĩa", "Ví dụ", "Dịch"],
      rows: [
        ["**will** + V", "chắc chắn (theo người nói)", "If you leave now, you **will** be on time.", "Nếu đi ngay, bạn sẽ kịp giờ."],
        ["**may / might** + V", "có thể (kém chắc hơn will)", "If it gets colder, we **might** cancel the trip.", "Nếu trời lạnh hơn, có lẽ chúng tôi sẽ huỷ chuyến đi."],
        ["**can** + V", "được phép / có khả năng", "If you finish early, you **can** go home.", "Nếu xong sớm, bạn có thể về."],
        ["**should** + V", "lời khuyên", "If you feel stressed, you **should** talk to someone.", "Nếu thấy căng thẳng, bạn nên nói chuyện với ai đó."],
        ["**must** + V", "bắt buộc", "If you want to pass, you **must** practise every day.", "Muốn đậu thì bạn phải luyện mỗi ngày."],
        ["**Câu mệnh lệnh** (V nguyên mẫu)", "dặn, hướng dẫn", "If you have any questions, **email** me.", "Có câu hỏi gì thì gửi email cho tôi."],
        ["**be going to** + V (thêm)", "kế hoạch / dự đoán có dấu hiệu", "If prices keep rising, we**'re going to** move.", "Nếu giá cứ tăng, chúng tôi sẽ chuyển nhà."],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Độ chắc chắn ở vế kết quả",
      caption: "Trong Task 2, dùng may / might / can khi bạn không chắc 100% — câu vừa đúng ngữ pháp vừa “mềm” hơn, đúng văn phong học thuật.",
      steps: [
        { label: "**will**", sub: "gần như chắc chắn" },
        { label: "**may**", sub: "khá có thể" },
        { label: "**might / could**", sub: "có thể, chưa chắc" },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "Sau modal là **V nguyên mẫu**: ~~If you finish early, you can to go home.~~ → you can **go** home.",
        "Không dùng **would** cho loại 1: ~~If you study hard, you would pass.~~ (would thuộc câu điều kiện loại 2 — Tập 3 Ngày 15). Muốn nói “sẽ” cho chuyện có thật → **will**.",
        "Câu mệnh lệnh không có chủ ngữ: If you see Tom, **tell** him to call me. (~~you tell him~~ nghe như kể chuyện, không phải dặn.)",
      ],
    },
    {
      t: "rule",
      formula: "If + S + V(s/es), S + can / may / might / should / must + V · If + S + V(s/es), V (mệnh lệnh)!",
      vi: "Thay will bằng modal để đổi sắc thái (có thể, nên, phải) hoặc dùng mệnh lệnh để dặn — vế if vẫn hiện tại đơn.",
    },
    {
      t: "quiz",
      id: "t2d13-bien-the-dich",
      title: "Dịch sang tiếng Anh — loại 1 với modal và mệnh lệnh (4 câu)",
      kind: "translate",
      grammar: "If + S + V(s/es), S + should / can / might + V · If + S + V(s/es), V (mệnh lệnh).",
      items: [
        {
          q: "Nếu bạn thấy căng thẳng, bạn nên nói chuyện với ai đó.",
          hint: "If you feel stressed, you should talk to someone",
          answers: ["If you feel stressed, you should talk to someone.", "If you feel stressed, you should talk to somebody.", "If you feel stressed, you should speak to someone.", "If you are stressed, you should talk to someone.", "You should talk to someone if you feel stressed.", "If you feel stressed, you should talk with someone."],
        },
        {
          q: "Nếu xong sớm, bạn có thể về nhà.",
          hint: "If you finish early, you can go home",
          answers: ["If you finish early, you can go home.", "You can go home if you finish early.", "If you finish early, you may go home.", "If you are done early, you can go home."],
        },
        {
          q: "Nếu trời lạnh hơn, có lẽ chúng tôi sẽ huỷ chuyến cắm trại.",
          hint: "If it gets colder, we might cancel the camping trip",
          answers: ["If it gets colder, we might cancel the camping trip.", "If it gets colder, we may cancel the camping trip.", "If it becomes colder, we might cancel the camping trip.", "If it gets colder, we might cancel our camping trip.", "We might cancel the camping trip if it gets colder.", "If the weather gets colder, we might cancel the camping trip."],
        },
        {
          q: "Nếu bạn có câu hỏi nào, hãy gửi email cho tôi.",
          hint: "If you have any questions, email me / send me an email",
          answers: ["If you have any questions, email me.", "If you have any questions, please email me.", "If you have any questions, send me an email.", "If you have any questions, please send me an email.", "Email me if you have any questions.", "Send me an email if you have any questions.", "If you have any questions, e-mail me."],
        },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. unless = if … not (“trừ khi”, “nếu không”)" },
    {
      t: "p",
      text: "**unless** /ənˈles/ gói sẵn nghĩa **phủ định**: unless you hurry = **if you don't** hurry. Vì nghĩa “không” đã nằm trong unless, vế sau unless viết **khẳng định**. unless hay dùng cho **lời cảnh báo** và **điều kiện duy nhất** (chỉ có một cách để tránh kết quả).",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai câu — một nghĩa",
      caption: "Đổi if … not sang unless: bỏ don't / doesn't, giữ động từ ở dạng khẳng định.",
      cols: [
        { title: "**If** … **not**", items: ["**If** you **don't** hurry, you'll miss the train.", "**If** she **doesn't** apply today, she won't get a place."] },
        { title: "**Unless** … (khẳng định)", items: ["**Unless** you **hurry**, you'll miss the train.", "**Unless** she **applies** today, she won't get a place."] },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Unless + S + V(s/es), S + will / can't / won't + V",
          vi: "unless + mệnh đề KHẲNG ĐỊNH; vế kết quả theo loại 0 hoặc loại 1.",
          examples: [
            { en: "Unless you show your passport, you can't board the plane.", vi: "Trừ khi trình hộ chiếu, bạn không thể lên máy bay." },
            { en: "The problem will get worse unless governments act now.", vi: "Vấn đề sẽ tệ hơn trừ khi chính phủ hành động ngay." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với unless",
      items: [
        "**Phủ định kép**: ~~Unless you don't hurry, you'll miss the train.~~ (= “nếu bạn không không vội” — sai nghĩa). Viết **Unless you hurry**.",
        "**Will sau unless** — cùng luật với if: ~~Unless it will rain~~ → **Unless it rains**, the match will go ahead.",
        "**unless ≠ until**: unless = trừ khi (điều kiện); until = cho đến khi (thời gian) — xem mục 6.",
        "Khi “nếu không” chỉ là **một cảm xúc**, không phải điều kiện duy nhất, dùng if … not tự nhiên hơn: I'll be happy **if** it **doesn't** rain. (~~I'll be happy unless it rains~~ nghe lạ.)",
      ],
    },
    {
      t: "rule",
      formula: "Unless + S + V(s/es) = If + S + don't / doesn't + V",
      vi: "unless đã mang nghĩa phủ định — vế sau unless luôn khẳng định, không có will.",
    },
    {
      t: "quiz",
      id: "t2d13-unless-dich",
      title: "Dịch sang tiếng Anh — unless (4 câu)",
      kind: "translate",
      grammar: "Unless + S + V(s/es) (khẳng định), S + will / can't + V · S + will + V + unless + S + V(s/es).",
      items: [
        {
          q: "Trừ khi bạn nhanh lên, bạn sẽ lỡ tàu.",
          hint: "Unless you hurry (up), you will miss the train",
          answers: ["Unless you hurry, you will miss the train.", "Unless you hurry up, you will miss the train.", "You will miss the train unless you hurry.", "You will miss the train unless you hurry up.", "Unless you are quick, you will miss the train."],
        },
        {
          q: "Bạn không thể vào phòng thi trừ khi bạn mang hộ chiếu.",
          hint: "You can't enter the exam room unless you bring your passport",
          answers: ["You can't enter the exam room unless you bring your passport.", "You cannot enter the exam room unless you bring your passport.", "You can't enter the exam room unless you have your passport.", "You can't go into the exam room unless you bring your passport.", "Unless you bring your passport, you can't enter the exam room.", "You can't enter the exam room unless you bring your passport with you.", "You can't enter the test room unless you bring your passport."],
        },
        {
          q: "Cái cây sẽ chết trừ khi bạn tưới nó mỗi ngày.",
          hint: "The plant will die unless you water it every day",
          answers: ["The plant will die unless you water it every day.", "Unless you water it every day, the plant will die.", "The plant will die unless you water it daily.", "The plants will die unless you water them every day.", "This plant will die unless you water it every day."],
        },
        {
          q: "Tôi sẽ không mua nó trừ khi nó được giảm giá.",
          hint: "I won't buy it unless it is on sale / discounted",
          answers: ["I won't buy it unless it is on sale.", "I will not buy it unless it is on sale.", "I won't buy it unless it is discounted.", "I won't buy it unless it's cheaper.", "I won't buy it unless the price goes down.", "Unless it is on sale, I won't buy it.", "I won't buy it unless there is a discount.", "I won't buy it unless it is reduced.", "I won't buy it unless it is on offer.", "I won't buy it unless it is in the sale."],
        },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. when / as soon as / until / before / after + hiện tại đơn (nói về tương lai)" },
    {
      t: "p",
      text: "Luật “không will sau if” áp luôn cho **mệnh đề thời gian** (time clause — mệnh đề bắt đầu bằng when, as soon as, until, before, after) khi nói về **tương lai**: vế thời gian chia **hiện tại đơn**, vế chính mới có will (hoặc mệnh lệnh, modal).",
    },
    {
      t: "table",
      head: ["Liên từ", "Nghĩa", "Ví dụ", "Dịch"],
      rows: [
        ["**when**", "khi", "I'll call you **when** I **get** home.", "Tôi sẽ gọi bạn khi về đến nhà."],
        ["**as soon as**", "ngay khi", "**As soon as** the results **come** out, I'll tell you.", "Ngay khi có kết quả, tôi sẽ báo bạn."],
        ["**until**", "cho đến khi", "We'll wait here **until** the rain **stops**.", "Chúng ta sẽ đợi ở đây cho đến khi tạnh mưa."],
        ["**before**", "trước khi", "Turn off the lights **before** you **leave**.", "Tắt đèn trước khi ra về."],
        ["**after**", "sau khi", "**After** I **finish** this course, I'll take the IELTS test.", "Học xong khoá này, tôi sẽ thi IELTS."],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "if hay when?",
      caption: "if = CHƯA CHẮC việc đó có xảy ra không. when = CHẮC CHẮN sẽ xảy ra, chỉ chờ đến lúc. Chọn sai là đổi nghĩa câu.",
      cols: [
        { title: "**if** — có thể xảy ra", anh: "thinking-face", items: ["**If** I see Lan, I'll give her the book.", "(Có thể gặp, có thể không.)", "**If** I pass, I'll study abroad.", "(Chưa biết có đậu không.)"] },
        { title: "**when** — chắc chắn xảy ra", anh: "alarm-clock", items: ["**When** I see Lan tonight, I'll give her the book.", "(Tối nay chắc chắn gặp.)", "**When** I finish university, I'll look for a job.", "(Chắc chắn sẽ tốt nghiệp.)"] },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: when trong câu hỏi khác when nối hai mệnh đề",
      items: [
        "~~As soon as I will arrive, I'll text you.~~ → **As soon as I arrive**, I'll text you.",
        "**When** là **từ để hỏi** thì vẫn dùng will bình thường: **When will** the results come out? (đúng). Còn **when** nối hai mệnh đề thì không: I'll tell you **when** the results **come** out.",
        "**until** + mệnh đề **khẳng định**: ~~We'll wait until he doesn't come.~~ → We'll wait **until** he **comes**. (Ngược với tiếng Việt “đợi đến khi nào anh ấy đến”.)",
        "**Phân biệt**: **unless** = trừ khi (điều kiện) · **until** = cho đến khi (thời gian). You can't leave **until** the test **ends** (chờ đến lúc hết giờ) ≠ You can't leave **unless** you **finish** (chỉ được về nếu làm xong).",
      ],
    },
    {
      t: "rule",
      formula: "S + will + V + when / as soon as / until / before / after + S + V(s/es)",
      vi: "Mệnh đề thời gian nói về tương lai: chia hiện tại đơn, giống vế if — will chỉ ở vế chính.",
    },
    {
      t: "quiz",
      id: "t2d13-thoi-gian-dich",
      title: "Dịch sang tiếng Anh — mệnh đề thời gian tương lai (5 câu)",
      kind: "translate",
      grammar: "S + will + V + when / as soon as / until / before / after + S + V(s/es) · mệnh lệnh + before / after + S + V.",
      items: [
        {
          q: "Tôi sẽ gọi cho bạn khi tôi về đến nhà.",
          hint: "I will call you, when, I get home",
          answers: ["I will call you when I get home.", "I will phone you when I get home.", "I will call you when I arrive home.", "I will call you when I get back home.", "When I get home, I will call you.", "When I get home, I will phone you.", "I will ring you when I get home."],
        },
        {
          q: "Ngay khi có kết quả, tôi sẽ báo cho bạn.",
          hint: "As soon as the results come out / I get the results, I will tell you / let you know",
          answers: ["As soon as the results come out, I will tell you.", "As soon as the results come out, I will let you know.", "As soon as I get the results, I will tell you.", "As soon as I get the results, I will let you know.", "As soon as the results are out, I will tell you.", "As soon as the results are out, I will let you know.", "I will tell you as soon as the results come out.", "I will let you know as soon as the results come out.", "I will tell you as soon as I get the results.", "I will let you know as soon as I get the results."],
        },
        {
          q: "Chúng ta sẽ đợi ở đây cho đến khi tạnh mưa.",
          hint: "We will wait here until the rain stops / it stops raining",
          answers: ["We will wait here until the rain stops.", "We will wait here until it stops raining.", "We'll wait here until the rain stops.", "We will stay here until the rain stops.", "We will stay here until it stops raining."],
        },
        {
          q: "Hãy tắt đèn trước khi bạn ra ngoài.",
          hint: "Turn off the lights, before you go out / leave",
          answers: ["Turn off the lights before you go out.", "Please turn off the lights before you go out.", "Turn off the lights before you leave.", "Please turn off the lights before you leave.", "Switch off the lights before you go out.", "Switch off the lights before you leave.", "Turn off the light before you go out.", "Turn the lights off before you go out.", "Before you go out, turn off the lights."],
        },
        {
          q: "Sau khi học xong khoá này, tôi sẽ thi IELTS.",
          hint: "After I finish this course, I will take the IELTS test",
          answers: ["After I finish this course, I will take the IELTS test.", "After I finish this course, I will take the IELTS exam.", "After I finish this course, I will take IELTS.", "After I finish this course, I will do the IELTS test.", "After I finish this course, I will sit the IELTS test.", "I will take the IELTS test after I finish this course.", "After finishing this course, I will take the IELTS test.", "After I complete this course, I will take the IELTS test.", "When I finish this course, I will take the IELTS test."],
        },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Áp vào bài thi: Task 2, Speaking Part 3, Listening" },
    {
      t: "table",
      head: ["Phần thi", "Câu mẫu", "Vì sao ăn điểm"],
      rows: [
        ["**Writing Task 2** — nêu hệ quả của giải pháp (problem / solution, Ngày 14)", "**If** governments **invest** in cycle lanes, fewer people **will drive** to work.", "Một câu phức đúng, nối giải pháp với kết quả — đúng thứ giám khảo tìm ở TR + GRA."],
        ["**Writing Task 2** — cảnh báo", "**Unless** action **is taken** now, the problem **will become** more serious.", "unless + bị động (Tập 1 Ngày 15) = câu phức “đắt” mà vẫn an toàn."],
        ["**Speaking Part 3** — dự đoán", "**If** house prices **keep** rising, many young people **won't be able to** buy a home.", "Part 3 hay hỏi “What will happen if…?” — trả lời bằng đúng cấu trúc đó."],
        ["**Speaking Part 1** — thói quen (loại 0)", "**If** I **have** free time in the evening, I usually **watch** a documentary.", "Câu trả lời dài hơn một mệnh đề mà không phải nghĩ nhiều."],
        ["**Listening** — bẫy điều kiện", "“The trip is on **Saturday** — **unless** it rains, in which case we'll move it to Sunday.”", "Câu hỏi “The trip will be on ___” → **Saturday** (kế hoạch chính). Sunday chỉ đúng **nếu** mưa — đó là bẫy."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "If + S + V(s/es) + giải pháp, S + will / can + V + kết quả tốt",
          vi: "Khung câu hệ quả cho thân bài Task 2 (sau câu nêu giải pháp).",
          examples: [
            { en: "If schools teach basic cooking, students will make healthier choices as adults.", vi: "Nếu trường dạy nấu ăn cơ bản, học sinh sẽ lựa chọn lành mạnh hơn khi lớn." },
          ],
        },
        {
          formula: "Unless + S + V(s/es), S + will + V + kết quả xấu",
          vi: "Khung câu cảnh báo — hợp với câu cuối đoạn hoặc kết bài.",
          examples: [
            { en: "Unless young people learn to manage money, many of them will get into debt.", vi: "Trừ khi người trẻ học cách quản lý tiền, nhiều người sẽ rơi vào nợ nần." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Mẹo: đừng biến cả bài thành câu điều kiện",
      items: [
        "Một đoạn thân bài Task 2 chỉ cần **1–2** câu điều kiện đặt đúng chỗ (sau câu giải pháp, hoặc ở câu ví dụ). Năm câu if liền nhau nghe máy móc — mất điểm Coherence.",
        "Trước khi nộp bài: tìm mọi chữ **if / unless / when / as soon as / until** trong bài, kiểm tra **ngay sau nó không có will**. Đây là bước tự soát nhanh nhất cho GRA.",
      ],
    },
    {
      t: "rule",
      formula: "Task 2: If + giải pháp (hiện tại đơn), kết quả (will / can + V) · Unless + điều kiện, kết quả xấu (will + V)",
      vi: "Hai khung câu phức an toàn cho bài problem / solution — dùng 1–2 lần mỗi đoạn.",
    },
    {
      t: "mcq",
      id: "t2d13-np-tong-hop",
      title: "Kiểm tra nhanh cả bài (8 câu)",
      items: [
        { q: "If you ___ ice, it melts.", options: ["heat", "will heat", "heated"], correct: 0, why: "Sự thật khoa học → **loại 0**: hai vế hiện tại đơn (heat … melts). will heat sai vì có will sau if; heated là quá khứ." },
        { q: "If it ___ tomorrow, we'll play indoors.", options: ["will rain", "rains", "rained"], correct: 1, why: "**Loại 1** (tomorrow, will play): vế if **hiện tại đơn** rains. ~~will rain~~ là lỗi số 1; rained (quá khứ) không hợp với tomorrow." },
        { q: "___ you leave now, you'll miss the train.", options: ["If", "Unless", "When"], correct: 1, why: "Nghĩa đúng: “**Nếu không** đi ngay thì lỡ tàu” → **Unless** you leave now = If you don't leave now. “If you leave now, you'll miss the train” và “When you leave now…” vô lý." },
        { q: "I'll text you as soon as I ___ at the airport.", options: ["arrived", "will arrive", "arrive"], correct: 2, why: "**as soon as** + tương lai → **hiện tại đơn**: as soon as I arrive. ~~will arrive~~ sai luật mệnh đề thời gian; arrived là quá khứ." },
        { q: "If you have a fever, you ___ see a doctor.", options: ["would", "will to", "should"], correct: 2, why: "Lời khuyên trong loại 1 → **should + V**. would thuộc loại 2 (chưa học, sai thì); ~~will to~~ sai vì sau modal không có to." },
        { q: "We'll wait here ___ the rain stops.", options: ["as soon as", "before", "until"], correct: 2, why: "“Đợi **cho đến khi** tạnh mưa” → **until**. “wait here as soon as the rain stops / before the rain stops” không hợp nghĩa (đợi để làm gì sau khi tạnh?)." },
        { q: "Choose the correct sentence.", options: ["If people recycle more, there will be less waste.", "If people will recycle more, there will be less waste.", "If people recycle more, so there will be less waste."], correct: 0, why: "Loại 1 chuẩn: **If + hiện tại đơn, will + V**. Câu B có will sau if; câu C thêm **so** để dịch chữ “thì” — sai." },
        { q: "Unless you ___ your passport, you can't board the plane.", options: ["show", "don't show", "won't show"], correct: 0, why: "**Unless** đã mang nghĩa phủ định → vế sau **khẳng định**: unless you show. ~~don't show~~ = phủ định kép; ~~won't show~~ có will." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Nghe ─────────────────────────── */

const T2D13_LISTENING: Lesson = {
  id: "t2d13-nghe",
  kind: "listening",
  title: "Nghe: Listening Part 3 — MCQ, chọn hai đáp án, Flow-chart, Matching người – ý kiến",
  goal: "Làm được trọn Questions 21–30 của Listening Part 3 với bốn dạng hay gặp nhất (trắc nghiệm một đáp án, chọn TWO, hoàn thành sơ đồ quy trình, nối người với ý kiến), nhận ra ai đồng ý – ai phản đối – ai đề xuất — bước cần để Listening từ 13 lên 16/40 (band 4.5 → 5.0).",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Part 3** = hội thoại **học thuật** của 2–4 người (thường là sinh viên + giảng viên) bàn về một bài tập, dự án, nghiên cứu. Câu hỏi **21–30**. Tập 1 Ngày 11 bạn đã làm quen; hôm nay luyện **đủ bốn dạng** của nó.",
        "Bốn dạng: ==MCQ một đáp án== · ==chọn TWO trong năm== · ==Flow-chart completion== (điền vào sơ đồ các bước) · ==Matching người – ý kiến== (ai nói ý nào).",
        "Bẫy lớn nhất của Part 3: **cả ba phương án đều được nhắc**, nhưng chỉ một cái là điều người nói **khẳng định cuối cùng**; và người **đồng ý** với một ý ≠ người **đề xuất** ý đó.",
        "Kỹ năng then chốt: nghe **tín hiệu** đồng ý (Exactly. / That makes sense.), phản đối (I'm not so sure… / I see what you mean, but…) và đề xuất (Why don't we…? / How about…?).",
        "Đẩy band: Listening band 5.0 cần **16/40**; Part 1–2 đã cho bạn phần lớn số đó — mỗi câu đúng ở Part 3 là phần “vượt” lên 5.0. Mục tiêu hôm nay: **≥ 6/10** ở bài 21–30.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Part 3 trông như thế nào?" },
    {
      t: "table",
      head: ["Đặc điểm", "Part 3"],
      rows: [
        ["Số người nói", "2–4 người; thường 2 sinh viên + 1 giảng viên (tutor)"],
        ["Bối cảnh", "Học thuật: chọn đề tài, báo cáo kết quả khảo sát, lên kế hoạch thuyết trình, nhận xét bài làm"],
        ["Câu hỏi", "**21–30** (10 câu), thường chia hai nhóm: ví dụ 21–25 rồi 26–30 — giữa hai nhóm có ~30 giây đọc câu hỏi"],
        ["Dạng hay gặp", "MCQ · chọn TWO / THREE · Matching (người, ý kiến, đặc điểm) · Flow-chart · Note / Table completion"],
        ["Vì sao khó hơn Part 1–2", "Nhiều giọng, nói chen nhau, **đổi ý**, đồng ý – phản đối, từ học thuật (method, data, findings, limitation)"],
      ],
    },
    {
      t: "note",
      title: "Nối với Tập 1",
      items: [
        "Tập 1 Ngày 11 (bài khảo sát giấc ngủ của Lucy và Tom) đã giới thiệu Part 3 với MCQ, nối người với đề xuất và điền ghi chú. Hôm nay thêm **chọn TWO** và **Flow-chart**, và luyện kỹ phần **nghe ý kiến**.",
        "Từ hôm nay đến Ngày 21 (Đề nhỏ Part 3+4) bạn gặp Part 3 thêm hai lần nữa: Ngày 17 (họp công việc) và chính Ngày 21.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Chiến thuật chung trước khi nghe" },
    {
      t: "sodo",
      kind: "flow",
      title: "30 giây đọc câu hỏi — dùng thế nào",
      caption: "Ở Part 3 bạn được khoảng 30 giây trước mỗi nhóm câu. Đọc LỜI DẪN trước (dạng gì, giới hạn từ), rồi mới đọc câu hỏi.",
      steps: [
        { label: "Đọc lời dẫn", sub: "Dạng gì? Giới hạn từ? Chọn mấy chữ cái?" },
        { label: "Gạch từ khoá", sub: "Ai? Việc gì? Danh từ / con số trong câu hỏi" },
        { label: "Đoán", sub: "Loại từ cần điền; phương án nào dễ là bẫy" },
        { label: "Nghe tín hiệu", sub: "So, the next thing… / What about…? = sang câu mới" },
        { label: "Ghi tắt", sub: "Chữ cái, L / M / H cho tên người, số" },
      ],
    },
    {
      t: "note",
      title: "Mẹo: câu hỏi đi theo thứ tự lời thoại",
      items: [
        "Câu 21 được nói trước câu 22, câu 22 trước câu 23… (riêng chọn TWO thì hai đáp án có thể đến theo bất kỳ thứ tự nào trong đoạn đó). Lỡ một câu thì **bỏ qua ngay**, theo dõi câu tiếp — đừng ngồi tiếc.",
        "Giảng viên thường dẫn sang câu mới bằng một câu hỏi: **Now, what about…? / So, how are you going to…? / And what did you find?** — nghe được câu này là biết đã sang câu kế.",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Dạng 1 — Multiple choice (một đáp án)" },
    {
      t: "p",
      text: "Lời dẫn: **Choose the correct letter, A, B or C.** — Chọn đúng một chữ cái. Câu hỏi có thể là một câu hỏi đầy đủ (Why did…?) hoặc **nửa câu** cần nối tiếp (The students changed their topic because…). Ba phương án thường **đều được nhắc** trong lời thoại — chỉ một cái khớp với điều người nói **khẳng định**.",
    },
    {
      t: "table",
      caption: "Ba bẫy kinh điển của MCQ Part 3",
      head: ["Bẫy", "Lời thoại", "Cách thoát"],
      rows: [
        ["**Đúng ý nhưng sai người**", "Câu hỏi: What does **the tutor** say…? — Sinh viên nói “It's much worse than I expected.”", "Gạch tên người trong câu hỏi; chỉ tính lời **người đó** nói."],
        ["**Được nhắc nhưng bị loại**", "“We thought staff might refuse, **but actually** they're all happy to.”", "Sau **but / actually / in fact** là thông tin thật — ý trước đó bị loại."],
        ["**Đổi ý**", "“Five days? — **Make it ten.**”", "Lấy quyết định **cuối cùng**, không lấy con số nghe đầu tiên."],
      ],
    },
    {
      t: "rule",
      formula: "Đúng người + đúng ý cuối cùng + paraphrase của phương án",
      vi: "Đáp án MCQ hiếm khi lặp nguyên văn lời thoại — nó diễn đạt lại (couldn't give us the data until next term → would not be ready in time).",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Dạng 2 — Chọn TWO trong năm phương án" },
    {
      t: "p",
      text: "Lời dẫn: **Questions 23 and 24. Choose TWO letters, A–E.** — Câu hỏi chỉ có **một**, nhưng chiếm **hai số câu** (23 và 24) vì bạn phải chọn **hai** chữ cái. Mỗi chữ đúng được **1 điểm**; **thứ tự không quan trọng** (B rồi D hay D rồi B đều đúng).",
    },
    {
      t: "note",
      title: "Cẩn thận với chọn TWO",
      items: [
        "Năm phương án thường **đều được nhắc**: hai cái được **khẳng định**, ba cái bị **phủ nhận** (“hardly anyone mentioned…”, “not at all”) hoặc chỉ là ý của người hỏi.",
        "Nghe đủ cả đoạn rồi mới chốt: hai đáp án có thể nằm cách xa nhau, và một phương án nghe như đúng ở đầu đoạn có thể bị phủ nhận ở cuối.",
        "**Không được** ghi ba chữ cái để “cầu may” — bài thi thật chấm sai luôn ô đó.",
        "Bản thi giấy: viết **một chữ cái mỗi ô** (ô 23 và ô 24). Bản thi máy: **tích hai ô**. Trên trang này: gõ **hai chữ cái** vào cùng một ô (vd **B D**) — máy chấm cả cặp; nếu máy báo sai mà bạn đúng một chữ, **tự tính 1 điểm**.",
      ],
    },
    {
      t: "rule",
      formula: "Choose TWO letters = 2 câu = 2 điểm · thứ tự tự do · loại 3 phương án bị phủ nhận",
      vi: "Nghe hết đoạn, đánh dấu ✓ cho ý được khẳng định và ✗ cho ý bị phủ nhận; chỉ chọn hai dấu ✓.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Dạng 3 — Flow-chart completion (sơ đồ các bước)" },
    {
      t: "p",
      text: "**Flow-chart** là chuỗi ô nối bằng mũi tên ↓, tả **các bước** của một kế hoạch hay quy trình. Lời dẫn: **Complete the flow-chart below. Write ONE WORD AND/OR A NUMBER for each answer.** Trong Part 3, flow-chart thường là **kế hoạch dự án** mà sinh viên và giảng viên chốt ở cuối cuộc nói chuyện.",
    },
    {
      t: "table",
      head: ["Bước", "Bạn làm gì"],
      rows: [
        ["Trước khi nghe", "Đọc **mọi ô**, kể cả ô không có chỗ trống — chúng cho biết người nói đang ở bước nào. Đoán **loại từ** (số? danh từ số ít / nhiều? động từ?)."],
        ["Trong khi nghe", "Các bước đi **đúng thứ tự** mũi tên. Nghe từ nối thời gian: **First… Then… After that… Finally…**"],
        ["Khi điền", "Chép **nguyên từ** nghe được, đúng chính tả, đúng số ít / nhiều; không vượt giới hạn từ (ONE WORD = một từ)."],
        ["Bẫy", "Hai phương án bị cân nhắc (presentation hay report?) — lấy cái được **chốt**."],
      ],
    },
    {
      t: "rule",
      formula: "Đọc cả sơ đồ → đoán loại từ → nghe First / Then / Finally → chép đúng từ được CHỐT",
      vi: "Flow-chart luôn theo thứ tự lời thoại; ô có sẵn chữ là “cột mốc” để bạn biết mình đang ở đâu.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Dạng 4 — Matching: ai nói ý nào?" },
    {
      t: "p",
      text: "Lời dẫn: **Who expresses each of the following opinions? Choose the correct letter, A, B or C.** (A, B, C là tên người nói). Đôi khi có thêm **NB You may use any letter more than once** — một người có thể đúng ở nhiều câu. Câu hỏi đã **paraphrase** ý kiến, nên bạn nghe **ý**, không chờ đúng từ.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Người nói ra ý ≠ người đồng ý",
      caption: "Ý kiến thuộc về người NÓI RA nó lần đầu (hoặc người khẳng định nó). Người chỉ đáp “Exactly.” / “Good idea.” là đồng ý, không phải chủ của ý.",
      cols: [
        { title: "Chủ của ý kiến", anh: "speaking-head", items: ["“I really think a discount is the answer.”", "“Unless people see the waste, nothing will change.”", "→ chọn người này"] },
        { title: "Chỉ phản hồi", anh: "ear", items: ["“Exactly.” · “That's a good idea.”", "“I'm not so sure.” (phản đối)", "→ KHÔNG chọn người này cho ý đó"] },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở Matching người – ý kiến",
      items: [
        "Chọn người nói **sau cùng** vì nghe rõ nhất — trong khi người đó chỉ **nhắc lại** hoặc **phản đối** ý của người trước.",
        "Nhầm giọng: trước khi nghe, nhớ **mỗi tên đi với giọng nào** từ những câu chào đầu bài (giảng viên giọng Anh nam, sinh viên nữ giọng Anh, sinh viên nam giọng Mỹ…).",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Tín hiệu đồng ý · phản đối · đề xuất" },
    {
      t: "table",
      head: ["Chức năng", "Cụm hay nghe", "Nghĩa"],
      rows: [
        ["**Đồng ý**", "Exactly. · Absolutely. · That makes sense. · Good point. · I agree with you there.", "Đúng vậy / Có lý"],
        ["**Đồng ý một phần**", "Fair point, but… · You're right to some extent, but…", "Có lý, nhưng…"],
        ["**Phản đối lịch sự**", "I'm not so sure. · I see what you mean, but… · I'm not convinced. · Hmm, I doubt that…", "Tôi không chắc / Tôi chưa bị thuyết phục"],
        ["**Đề xuất**", "Why don't we…? · How about + V-ing…? · What if we…? · I'd suggest + V-ing… · Let's go with…", "Sao ta không…? / Hay là…"],
        ["**Chốt quyết định**", "Then let's go with… · OK, so we'll… · Make it… · Fine.", "Vậy chốt…"],
      ],
    },
    {
      t: "rule",
      formula: "Exactly / That makes sense = đồng ý · I'm not so sure / I see what you mean, but = phản đối · Why don't we / How about = đề xuất mới",
      vi: "Nghe tín hiệu trước, nội dung sau: tín hiệu cho biết câu kế tiếp sẽ đồng ý, bác bỏ hay đưa ý mới.",
    },
    {
      t: "p",
      text: "**Luyện nhanh (6 đoạn ngắn).** Mỗi đoạn: người thứ nhất nêu một ý, người thứ hai đáp lại. Nghe rồi chọn: người thứ hai **đồng ý**, **phản đối**, hay **đề xuất một ý khác**?",
    },
    {
      t: "listen",
      id: "t2d13-nghe-tin-hieu",
      title: "Agree, disagree or suggest?",
      dan: { so: "Day 13, Practice 1", boiCanh: "six short exchanges between students working on group projects." },
      note: "Khoảng 1 phút, bốn giọng (Anh và Mỹ). Mỗi đoạn hai câu. Nghe tối đa 2 lần.",
      lines: [
        { who: "Anna", voice: "uk-nu", text: "One. I think we should interview the lecturers first.", vi: "Một. Tớ nghĩ mình nên phỏng vấn các giảng viên trước." },
        { who: "Ben", voice: "us-nam", text: "That makes sense. They're the hardest people to get hold of.", vi: "Hợp lý đấy. Họ là những người khó gặp nhất." },
        { who: "Carla", voice: "us-nu", text: "Two. Let's do the whole survey online.", vi: "Hai. Mình làm cả khảo sát trực tuyến đi." },
        { who: "David", voice: "uk-nam", text: "I see what you mean, but last time only ten people replied online.", vi: "Tớ hiểu ý cậu, nhưng lần trước chỉ có mười người trả lời trên mạng." },
        { who: "Anna", voice: "uk-nu", text: "Three. We could show the results in a table.", vi: "Ba. Mình có thể trình bày kết quả bằng một cái bảng." },
        { who: "Ben", voice: "us-nam", text: "Or how about a short video? People would remember it better.", vi: "Hay là làm một video ngắn? Mọi người sẽ nhớ lâu hơn." },
        { who: "Carla", voice: "us-nu", text: "Four. I'd put the conclusion at the very start.", vi: "Bốn. Tớ sẽ đặt phần kết luận ngay đầu." },
        { who: "David", voice: "uk-nam", text: "Hmm, I'm not convinced. The examiners expect it at the end.", vi: "Hừm, tớ chưa bị thuyết phục. Giám khảo chờ nó ở cuối." },
        { who: "Anna", voice: "uk-nu", text: "Five. Two weeks isn't enough to collect the data.", vi: "Năm. Hai tuần không đủ để thu thập số liệu." },
        { who: "Ben", voice: "us-nam", text: "Absolutely. We need at least a month.", vi: "Hoàn toàn đúng. Mình cần ít nhất một tháng." },
        { who: "Carla", voice: "us-nu", text: "Six. Shall we meet on Friday to finish the slides?", vi: "Sáu. Thứ Sáu mình gặp nhau để làm xong slide nhé?" },
        { who: "David", voice: "uk-nam", text: "Why don't we meet on Thursday instead? The library's closed on Friday.", vi: "Sao mình không gặp vào thứ Năm? Thứ Sáu thư viện đóng cửa." },
      ],
    },
    {
      t: "mcq",
      id: "t2d13-nghe-tin-hieu-chon",
      title: "Người thứ hai đồng ý, phản đối hay đề xuất ý khác? (6 đoạn)",
      items: [
        { q: "Đoạn 1 — Ben", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 0, why: "“**That makes sense.**” = tín hiệu đồng ý, rồi Ben đưa thêm lý do ủng hộ (họ khó gặp nhất)." },
        { q: "Đoạn 2 — David", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 1, why: "“**I see what you mean, but…**” = phản đối lịch sự; lý do: lần trước chỉ mười người trả lời online. David không đưa ra cách khác." },
        { q: "Đoạn 3 — Ben", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 2, why: "“**Or how about** a short video?” = đề xuất một hình thức khác thay cho cái bảng." },
        { q: "Đoạn 4 — David", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 1, why: "“**I'm not convinced.**” = phản đối, kèm lý do (giám khảo chờ kết luận ở cuối)." },
        { q: "Đoạn 5 — Ben", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 0, why: "“**Absolutely.**” = đồng ý hoàn toàn; “We need at least a month” củng cố ý hai tuần là không đủ." },
        { q: "Đoạn 6 — David", options: ["A agrees", "B disagrees", "C suggests something different"], correct: 2, why: "“**Why don't we** meet on Thursday **instead**?” = đề xuất một ngày khác (instead = thay vào đó)." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Luyện trọn Part 3 — Questions 21–30" },
    {
      t: "canh",
      anh: ["woman-student", "man-student", "man-teacher", "wastebasket"],
      caption: "Hai sinh viên **Lena** (giọng Anh) và **Marcus** (giọng Mỹ) gặp giảng viên hướng dẫn **Dr Hughes** để bàn dự án về **cốc nhựa bỏ đi ở quán cà phê của trường**.",
    },
    {
      t: "p",
      text: "Đọc trước **mọi câu hỏi** bên dưới (khoảng 1 phút): 21–22 trắc nghiệm · 23–24 chọn TWO · 25–27 ai nói ý nào · 28–30 sơ đồ kế hoạch. Gạch từ khoá, đoán loại từ cho 28–30 (28 là **con số**). Rồi mới bấm Nghe. Nghe tối đa **2 lần**; chưa mở lời thoại cho tới khi làm xong cả 10 câu.",
    },
    {
      t: "listen",
      id: "t2d13-nghe-bai",
      title: "A project on plastic cups in the student café",
      dan: { so: "Day 13, Practice 2 (Listening Part 3)", boiCanh: "a conversation between two students, Lena and Marcus, and their tutor, Dr Hughes, about a project on plastic waste in the student café.", cau: [21, 30] },
      note: "Khoảng 3 phút rưỡi, ba giọng: Dr Hughes (Anh, nam), Lena (Anh, nữ), Marcus (Mỹ, nam).",
      lines: [
        { who: "Dr Hughes", voice: "uk-nam", text: "Come in, Lena, Marcus. Take a seat. So, your project is now about plastic cups in the student café. Last time you were going to look at energy use in the halls of residence. What happened?", vi: "Mời vào, Lena, Marcus. Ngồi đi. Vậy là dự án của các em giờ về cốc nhựa ở quán cà phê sinh viên. Lần trước các em định nghiên cứu điện năng tiêu thụ ở ký túc xá. Có chuyện gì vậy?" },
        { who: "Lena", voice: "uk-nu", text: "We really wanted to do energy, but the university couldn't give us the electricity data until next term, and our project is due in six weeks. So we had to find something else.", vi: "Bọn em rất muốn làm đề tài năng lượng, nhưng trường không thể đưa số liệu điện cho tới học kỳ sau, mà dự án phải nộp trong sáu tuần. Nên bọn em phải tìm đề tài khác." },
        { who: "Dr Hughes", voice: "uk-nam", text: "That's a pity, because I thought energy use was a really good topic. But these things happen. So why cups?", vi: "Tiếc thật, vì thầy thấy điện năng là đề tài rất hay. Nhưng chuyện này vẫn xảy ra. Vậy sao lại là cốc?" },
        { who: "Marcus", voice: "us-nam", text: "Well, one afternoon after lunch I counted the cups in just one bin outside the café, and there were over three hundred. Honestly, it was much worse than I'd expected.", vi: "Dạ, một buổi chiều sau giờ ăn trưa, em đếm cốc trong đúng một thùng rác trước quán, và có hơn ba trăm cái. Thật lòng mà nói, tệ hơn em tưởng nhiều." },
        { who: "Dr Hughes", voice: "uk-nam", text: "Three hundred is a striking number. But one bin on one afternoon won't convince anyone. On its own, it isn't evidence. You'll need to count properly over a longer period.", vi: "Ba trăm là con số gây ấn tượng. Nhưng một thùng rác trong một buổi chiều sẽ không thuyết phục được ai. Riêng nó thì chưa phải bằng chứng. Các em cần đếm cẩn thận trong một khoảng thời gian dài hơn." },
        { who: "Lena", voice: "uk-nu", text: "We could ask the café for their sales figures as well.", vi: "Bọn em cũng có thể xin quán số liệu bán hàng." },
        { who: "Dr Hughes", voice: "uk-nam", text: "You could try, but I doubt they record sales by cup. Counting is more reliable. Now, you said you'd done a small pilot survey?", vi: "Có thể thử, nhưng thầy nghi là họ không ghi doanh số theo từng cốc. Đếm thì đáng tin hơn. Giờ, các em nói đã làm một khảo sát thử nhỏ?" },
        { who: "Marcus", voice: "us-nam", text: "Yes, we asked forty students why they don't use reusable cups. The most common answer by far was simply that they forget to bring one.", vi: "Vâng, bọn em hỏi bốn mươi sinh viên vì sao họ không dùng cốc tái sử dụng. Câu trả lời phổ biến nhất, bỏ xa các câu khác, đơn giản là họ quên mang theo." },
        { who: "Lena", voice: "uk-nu", text: "And quite a few said there's nowhere on campus to wash them between classes, so they'd have to carry a dirty cup around all day.", vi: "Và khá nhiều bạn nói trong trường không có chỗ nào để rửa cốc giữa các tiết, nên họ sẽ phải mang một cái cốc bẩn theo cả ngày." },
        { who: "Dr Hughes", voice: "uk-nam", text: "What about cost? Reusable cups aren't cheap.", vi: "Còn giá cả thì sao? Cốc tái sử dụng đâu có rẻ." },
        { who: "Marcus", voice: "us-nam", text: "That's what we expected, but hardly anyone mentioned money. The café sells them for two pounds.", vi: "Bọn em cũng nghĩ vậy, nhưng gần như không ai nhắc tới tiền. Quán bán chúng giá hai bảng." },
        { who: "Dr Hughes", voice: "uk-nam", text: "And hygiene? People sometimes worry about that.", vi: "Còn vệ sinh? Đôi khi người ta lo chuyện đó." },
        { who: "Lena", voice: "uk-nu", text: "Not at all, which surprised us. We also thought the staff might refuse to fill them, but every member of staff said they're happy to.", vi: "Hoàn toàn không, điều đó làm bọn em bất ngờ. Bọn em cũng tưởng nhân viên có thể từ chối rót đồ uống vào cốc riêng, nhưng mọi nhân viên đều nói họ sẵn lòng." },
        { who: "Dr Hughes", voice: "uk-nam", text: "Good. So, what are you going to suggest?", vi: "Tốt. Vậy các em định đề xuất gì?" },
        { who: "Marcus", voice: "us-nam", text: "I really think a discount is the answer. If the café gives ten pence off for a reusable cup, people will switch almost immediately.", vi: "Em thật sự nghĩ giảm giá là lời giải. Nếu quán giảm mười xu cho ai mang cốc tái sử dụng, mọi người sẽ đổi gần như ngay lập tức." },
        { who: "Lena", voice: "uk-nu", text: "I'm not so sure. Ten pence isn't much. Unless people actually see the waste, nothing will change. I'd like to put a clear bin next to the till, so everyone can see the cups pile up.", vi: "Tớ không chắc lắm. Mười xu chẳng đáng là bao. Trừ khi người ta tận mắt thấy rác thải, sẽ chẳng có gì thay đổi. Tớ muốn đặt một thùng rác trong suốt cạnh quầy tính tiền, để ai cũng thấy cốc chất đống lên." },
        { who: "Dr Hughes", voice: "uk-nam", text: "Both are interesting ideas. But my advice is: don't try to test everything at once. If you test three changes at the same time, you won't know which one worked. Pick one, and do it properly.", vi: "Cả hai đều là ý hay. Nhưng lời khuyên của thầy là: đừng thử mọi thứ cùng lúc. Nếu các em thử ba thay đổi cùng một lúc, các em sẽ không biết cái nào có tác dụng. Chọn một, và làm cho đến nơi đến chốn." },
        { who: "Marcus", voice: "us-nam", text: "Then let's go with the discount. The manager has already agreed to it.", vi: "Vậy mình chốt giảm giá đi. Quản lý quán đã đồng ý rồi." },
        { who: "Lena", voice: "uk-nu", text: "Fine. The clear bin can wait for another project.", vi: "Được thôi. Thùng rác trong suốt để dành cho dự án khác." },
        { who: "Dr Hughes", voice: "uk-nam", text: "Right, so walk me through your plan.", vi: "Được, vậy trình bày kế hoạch cho thầy nghe." },
        { who: "Lena", voice: "uk-nu", text: "First, we count the cups in the bins every day before we change anything. We were thinking five days?", vi: "Đầu tiên, bọn em đếm cốc trong các thùng rác mỗi ngày trước khi thay đổi gì. Bọn em đang tính năm ngày?" },
        { who: "Dr Hughes", voice: "uk-nam", text: "Make it ten. Then you cover two full weeks, and one unusual day won't spoil your results.", vi: "Làm mười ngày đi. Như vậy các em phủ trọn hai tuần học, và một ngày bất thường sẽ không làm hỏng kết quả." },
        { who: "Marcus", voice: "us-nam", text: "Ten days, OK. Then the café starts the discount, and we count again for another ten days.", vi: "Mười ngày, vâng. Sau đó quán bắt đầu giảm giá, và bọn em đếm lại thêm mười ngày nữa." },
        { who: "Dr Hughes", voice: "uk-nam", text: "And at the end?", vi: "Còn cuối cùng?" },
        { who: "Lena", voice: "uk-nu", text: "We were going to give a presentation to the café staff.", vi: "Bọn em định làm một bài thuyết trình cho nhân viên quán." },
        { who: "Dr Hughes", voice: "uk-nam", text: "The manager won't have time for a presentation. Write her a short report instead, two pages, with a graph. If the discount works, she'll show it to the other cafés on campus.", vi: "Quản lý sẽ không có thời gian nghe thuyết trình. Thay vào đó hãy viết cho cô ấy một bản báo cáo ngắn, hai trang, có một biểu đồ. Nếu giảm giá có tác dụng, cô ấy sẽ đưa nó cho các quán khác trong trường xem." },
        { who: "Marcus", voice: "us-nam", text: "A report. Got it. Thanks, Dr Hughes.", vi: "Một bản báo cáo. Em hiểu rồi. Cảm ơn thầy Hughes." },
      ],
    },
    {
      t: "p",
      text: "**Questions 21–22.** Choose the correct letter, **A, B or C**. — Chọn đúng một chữ cái.",
    },
    {
      t: "mcq",
      id: "t2d13-nghe-chon",
      title: "Questions 21–22 — Multiple choice",
      items: [
        {
          q: "(21) The students changed their original topic because",
          options: ["A the data they needed would not be ready in time.", "B their tutor thought the topic was unsuitable.", "C they found that cups were a more serious problem."],
          correct: 0,
          why: "Lena: “the university **couldn't give us the electricity data until next term**, and our project is due in six weeks.” = số liệu không có kịp → **A**. B sai: Dr Hughes nói ngược lại (“I thought energy use was a really good topic”). C: không ai **so sánh** cốc với năng lượng; chuyện cốc đến **sau** khi đã phải bỏ đề tài cũ.",
        },
        {
          q: "(22) What does Dr Hughes say about the number of cups Marcus counted?",
          options: ["A It proves the problem is worse than people think.", "B It is not enough evidence on its own.", "C It should be compared with the café's sales records."],
          correct: 1,
          why: "Dr Hughes: “one bin on one afternoon won't convince anyone. **On its own, it isn't evidence.**” → **B**. A là ý của **Marcus** (“much worse than I'd expected”) — bẫy **đúng ý sai người**. C là gợi ý của **Lena**; Dr Hughes còn nghi ngờ nó (“I doubt they record sales by cup”).",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 23 and 24.** Choose **TWO** letters, **A–E**. **Which TWO reasons did students in the pilot survey give for not using reusable cups?** — Gõ hai chữ cái vào ô (vd **A C**), thứ tự nào cũng được.",
    },
    {
      t: "table",
      head: ["", "Reason"],
      rows: [
        ["**A**", "They cost too much."],
        ["**B**", "They forget to bring them."],
        ["**C**", "Café staff will not fill them."],
        ["**D**", "There is nowhere to wash them."],
        ["**E**", "They are worried about hygiene."],
      ],
    },
    {
      t: "quiz",
      id: "t2d13-nghe-hai",
      title: "Questions 23–24 — Choose TWO letters, A–E (gõ hai chữ cái)",
      kind: "fill",
      items: [
        { q: "(23–24) Two reasons: ___", answers: ["B D", "D B", "BD", "DB", "B and D", "D and B", "B & D", "D & B"] },
      ],
    },
    {
      t: "p",
      text: "**Questions 25–27.** Who expresses each of the following opinions? Choose the correct letter, **A, B or C**. — **A** Lena · **B** Marcus · **C** Dr Hughes.",
    },
    {
      t: "mcq",
      id: "t2d13-nghe-noi",
      title: "Questions 25–27 — Matching (A Lena · B Marcus · C Dr Hughes)",
      items: [
        {
          q: "(25) A small price reduction would quickly change students' behaviour.",
          options: ["A Lena", "B Marcus", "C Dr Hughes"],
          correct: 1,
          why: "Marcus: “If the café gives **ten pence off**…, people will switch **almost immediately**.” ten pence off = small price reduction; almost immediately = quickly. Lena nhắc lại “Ten pence” nhưng để **phản đối** (“I'm not so sure”).",
        },
        {
          q: "(26) People need to see the waste before they will change.",
          options: ["A Lena", "B Marcus", "C Dr Hughes"],
          correct: 0,
          why: "Lena: “**Unless people actually see the waste, nothing will change.**” — câu unless của bài ngữ pháp hôm nay! Unless… nothing will change = phải thấy thì mới đổi.",
        },
        {
          q: "(27) Testing several changes together would make the results unclear.",
          options: ["A Lena", "B Marcus", "C Dr Hughes"],
          correct: 2,
          why: "Dr Hughes: “If you test three changes at the same time, **you won't know which one worked**.” = kết quả không rõ ràng. Marcus đáp “Then let's go with the discount” — đó là **chốt quyết định** theo lời khuyên, không phải chủ của ý.",
        },
      ],
    },
    {
      t: "p",
      text: "**Questions 28–30.** Complete the flow-chart below. Write **ONE WORD AND/OR A NUMBER** for each answer. — Hoàn thành sơ đồ, mỗi chỗ trống **một từ và/hoặc một con số**.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Project plan",
      steps: [
        { label: "Count the cups in the bins every day for **(28) ______** days" },
        { label: "The café introduces a **(29) ______** for customers with reusable cups" },
        { label: "Count the cups again for the same period" },
        { label: "Write a short **(30) ______** with a graph for the café manager" },
      ],
    },
    {
      t: "quiz",
      id: "t2d13-nghe-so-do",
      title: "Questions 28–30 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(28) Count the cups in the bins every day for ___ days", answers: ["10", "ten"] },
        { q: "(29) The café introduces a ___ for customers with reusable cups", answers: ["discount"] },
        { q: "(30) Write a short ___ with a graph for the café manager", answers: ["report"] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án 23–30",
      items: [
        "**(23–24) B, D** — Marcus: “The most common answer by far was simply that they **forget to bring one**” (B). Lena: “there's **nowhere on campus to wash them**” (D). Ba phương án còn lại đều **bị phủ nhận**: tiền — “**hardly anyone** mentioned money” (A); nhân viên — “every member of staff said they're **happy to**” (C); vệ sinh — “**Not at all**” (E).",
        "**(28) 10 / ten** — bẫy **đổi ý**: Lena đề nghị “five days?”, Dr Hughes chốt “**Make it ten**”, Marcus nhắc lại “Ten days, OK”.",
        "**(29) discount** — bẫy **hai phương án**: thùng rác trong suốt (clear bin) và giảm giá; nhóm **chốt** “let's go with the **discount**”, và clear bin “can wait for another project”.",
        "**(30) report** — bẫy **được nhắc nhưng bị loại**: Lena định làm **presentation**, Dr Hughes bảo “Write her a short **report instead**”. Chữ **instead** (thay vào đó) báo hiệu đáp án đổi.",
        "Thứ tự: 21 (đề tài cũ) → 22 (con số 300) → 23–24 (khảo sát thử) → 25–27 (giải pháp) → 28–30 (kế hoạch) — đúng thứ tự câu hỏi. Đếm điểm: **≥ 6/10** là đạt mục tiêu hôm nay; 8/10 trở lên là bạn đã sẵn sàng cho Part 3 ở mức band 5.5.",
      ],
    },
    {
      t: "note",
      title: "Cách học sau khi làm xong",
      items: [
        "Mở lời thoại, tô mọi **tín hiệu**: I'm not so sure · Both are interesting ideas, but… · Then let's go with… · Make it ten · instead. Đây là “xương sống” của mọi bài Part 3.",
        "Tìm **bốn câu điều kiện** trong lời thoại (If the café gives…, people will… · Unless people actually see… · If you test three changes…, you won't… · If the discount works, she'll…) — chép ra, đọc to. Ngữ pháp bài 1 chính là ngôn ngữ của Part 3.",
        "Nghe lại lần ba, **bóng nói** (shadowing — đọc đuổi theo băng) năm câu của Dr Hughes: giọng giảng viên Anh là giọng bạn gặp nhiều nhất ở Part 3 và Part 4.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Nói ─────────────────────────── */

const T2D13_SPEAKING: Lesson = {
  id: "t2d13-noi",
  kind: "speaking",
  title: "Nói: Part 3 nhập môn — ý kiến + lý do + ví dụ; xin nhắc lại câu hỏi",
  goal: "Trả lời một câu hỏi Speaking Part 3 trong 3–5 câu theo khung Ý kiến → Lý do → Ví dụ → Nhượng bộ, nói về “con người, xã hội” chứ không chỉ về bản thân, dùng câu điều kiện loại 1 để dự đoán, biết xin nhắc lại / giải thích câu hỏi đúng cách và đọc đúng trọng âm từ 3 âm tiết — đẩy Fluency & Coherence và Pronunciation từ band 4.5 lên 5.0–5.5.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "**Part 3** (4–5 phút, ngay sau Part 2): giám khảo hỏi những câu **chung, trừu tượng** về chủ đề của Part 2 — không còn hỏi “bạn thích gì” mà hỏi “**người ta / xã hội** thì sao, vì sao, sẽ ra sao”.",
        "Nhận diện **5 loại câu hỏi**: ý kiến · lý do · dự đoán · giải pháp · so sánh — mỗi loại có một câu mở đầu sẵn.",
        "Khung trả lời 4 bước (nâng từ O–R–E của Tập 1 Ngày 12): ==Ý kiến → Lý do → Ví dụ → Nhượng bộ / chốt==, 3–5 câu, khoảng 30–45 giây.",
        "Dùng **câu điều kiện loại 1** (bài 1 hôm nay) để dự đoán: If…, people will… · Unless…, … will… Khi không nghe rõ: **Sorry, could you repeat the question?**; không hiểu từ: **What do you mean by…?**",
        "Đẩy band: **Fluency & Coherence 5 → 6** (mô tả band 6: “sẵn lòng nói dài”; band 5: “giữ được mạch nhưng phải lặp, nói chậm”) và **Pronunciation** — trọng âm từ đúng là một đặc điểm band 6 mà người band 5 “có một phần”.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Part 3 khác Part 1 thế nào?" },
    {
      t: "table",
      head: ["", "Part 1", "Part 3"],
      rows: [
        ["Thời gian", "4–5 phút", "4–5 phút (sau Part 2)"],
        ["Chủ đề", "Bản thân: học, nhà, sở thích, thói quen", "Xã hội: cùng chủ đề Part 2 nhưng rộng hơn"],
        ["Câu hỏi", "Do **you** like…? · How often do **you**…?", "Do you think **people**…? · Why do **many young people**…? · What will happen if…?"],
        ["Đại từ chính khi trả lời", "**I**, my", "**people**, many / most…, young people, the government, in my country"],
        ["Độ dài câu trả lời", "2–3 câu (~20 giây)", "3–5 câu (~30–45 giây)"],
        ["Giám khảo làm gì", "Đọc câu hỏi theo kịch bản; không giải thích từ", "Hỏi nối tiếp theo câu trả lời của bạn; có thể **diễn đạt lại** câu hỏi nếu bạn chưa hiểu"],
      ],
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng chủ đề “mua sắm” — hai Part, hai cách hỏi",
      caption: "Part 3 vẫn cho phép ví dụ về bản thân, nhưng ví dụ là để CHỨNG MINH một ý chung, không phải câu trả lời chính.",
      cols: [
        { title: "Part 1 — nói về mình", anh: "bust-in-silhouette", items: ["Do **you** like shopping?", "→ Yes, I do. I usually go to the market with my mum on Sundays…"] },
        { title: "Part 3 — nói về xã hội", anh: "busts-in-silhouette", items: ["Why do **people** buy things they don't need?", "→ I think the main reason is advertising. Many people…"] },
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai khi vào Part 3",
      items: [
        "Trả lời như Part 1: “Why do people buy things they don't need?” → ~~I don't buy things I don't need.~~ (trả lời về bản thân, **lạc câu hỏi**). Phải nói về **people**.",
        "Trả lời một câu rồi dừng, nhìn giám khảo: band 4–5. Part 3 đo khả năng **phát triển ý** — câu trả lời phải có lý do và ví dụ.",
        "Học thuộc một bài nói dài cho mọi câu: giám khảo được huấn luyện để nhận ra câu học thuộc (memorised) và có thể hạ điểm.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Năm loại câu hỏi Part 3 — nhận ra để mở đầu đúng" },
    {
      t: "table",
      head: ["Loại", "Câu hỏi thường gặp", "Câu mở đầu gợi ý"],
      rows: [
        ["**Ý kiến / đánh giá**", "Do you think…? · Is it a good thing that…? · Should…?", "Yes, I'd say so, because… · To some extent, yes. · Not really. I think…"],
        ["**Lý do**", "Why do…? · What are the reasons…?", "I think the main reason is that… · There are probably two reasons…"],
        ["**Dự đoán**", "Will… in the future? · How will… change? · What will happen if…?", "I imagine that… · If…, … will probably… · It's hard to say, but…"],
        ["**Giải pháp**", "What can be done to…? · How can… encourage…? · What should the government do…?", "One thing that could help is… · If…, … will… · I think schools should…"],
        ["**So sánh**", "Is A better than B? · How is A different from B? · Are people today… than in the past?", "I'd say A is…er than B, mainly because… (so sánh quá khứ – hiện tại: Tập 2 Ngày 21)"],
      ],
    },
    {
      t: "note",
      title: "Mẹo: nghe động từ chính của câu hỏi",
      items: [
        "Câu bắt đầu bằng **Do you think…** chưa chắc là câu ý kiến: “Do you think people **will** still read paper books in twenty years?” là câu **dự đoán** (có will + mốc tương lai).",
        "**What will happen if…?** đã đưa sẵn cấu trúc trả lời: **If** + hiện tại đơn, … **will** + V. Dùng ngay câu điều kiện loại 1.",
      ],
    },
    {
      t: "mcq",
      id: "t2d13-noi-loai",
      title: "Câu hỏi này thuộc loại nào? (10 câu)",
      items: [
        { q: "What will happen to small shops if online shopping keeps growing?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 2, why: "**What will happen if…?** = dự đoán hệ quả → trả lời bằng If…, … will probably…" },
        { q: "Do you think children spend too much time on screens?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 0, why: "Hỏi bạn **có đồng ý** rằng trẻ dùng màn hình quá nhiều không → ý kiến. Mở: Yes, I'd say so, because…" },
        { q: "How can cities encourage people to cycle more?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 3, why: "**How can… encourage…?** = hỏi cách làm → giải pháp. Mở: One thing that could help is…" },
        { q: "Why do many young people move to big cities?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 1, why: "**Why** → lý do. Mở: I think the main reason is that…" },
        { q: "Is learning online as effective as learning in a classroom?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 4, why: "**as effective as** = đặt hai thứ cạnh nhau → so sánh. Mở: I'd say classroom learning is more effective for…, mainly because…" },
        { q: "Is it a good thing that people can work from home?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 0, why: "**Is it a good thing that…?** = đánh giá tốt / xấu → ý kiến. Thường nên trả lời có mức độ: On the whole, yes, but…" },
        { q: "Why do people enjoy watching sport?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 1, why: "**Why** → lý do. Có thể đưa hai lý do: There are probably two reasons…" },
        { q: "What should be done to reduce traffic jams?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 3, why: "**What should be done to…?** = giải pháp. Nói ai nên làm gì + kết quả (If…, … will…)." },
        { q: "Do you think people will still read paper books in twenty years?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 2, why: "Bẫy: mở bằng **Do you think** nhưng có **will** + **in twenty years** → dự đoán. Mở: I imagine that…" },
        { q: "Are people today busier than people in the past?", options: ["A Ý kiến / đánh giá", "B Lý do", "C Dự đoán", "D Giải pháp", "E So sánh"], correct: 4, why: "**busier than… in the past** → so sánh hiện tại – quá khứ (học sâu ở Ngày 21)." },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Khung trả lời 4 bước: Ý kiến → Lý do → Ví dụ → Nhượng bộ" },
    {
      t: "p",
      text: "Tập 1 (Ngày 12, 14) bạn đã có khung **O–R–E** (Opinion – Reason – Example). Part 3 band 5–6 cần thêm **bước 4**: một câu **nhượng bộ** (thừa nhận mặt kia) hoặc một câu **chốt** quay về ý chính. Bước này cho giám khảo thấy bạn **nghĩ hai chiều** — đúng “chất” của Part 3.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Một câu trả lời Part 3 (30–45 giây)",
      caption: "Bước 2 và 3 là phần dài nhất. Bước 4 ngắn — một câu là đủ.",
      steps: [
        { label: "1. Ý kiến", sub: "Trả lời thẳng câu hỏi (1 câu)" },
        { label: "2. Lý do", sub: "The main reason is that… (1–2 câu)" },
        { label: "3. Ví dụ", sub: "For example, in my city… (1–2 câu)" },
        { label: "4. Nhượng bộ / chốt", sub: "Having said that, … / So overall, … (1 câu)" },
      ],
    },
    {
      t: "table",
      head: ["Bước", "Cụm mở đầu", "Ví dụ (câu hỏi: Should children learn to cook at school?)"],
      rows: [
        ["1. Ý kiến", "Yes, I'd say so. · I don't really think so. · To some extent, yes.", "**Yes, I'd say so.**"],
        ["2. Lý do", "The main reason is that… · This is because…", "**The main reason is that** many parents work long hours, so children rarely learn to cook at home."],
        ["3. Ví dụ", "For example, … · For instance, in my country, …", "**For example**, several of my classmates couldn't even boil an egg when they started university."],
        ["4. Nhượng bộ / chốt", "Having said that, … · Of course, … · So overall, …", "**Having said that**, schools are already very busy, so maybe one short course a year would be enough."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Ý kiến + The main reason is that + S + V + For example, … + Having said that, …",
          vi: "Khung 4 bước — đủ dài cho Part 3 band 5–6 mà vẫn dễ nhớ.",
          examples: [
            { en: "I don't really think so. The main reason is that public transport here is still quite slow. For example, my bus to university takes an hour. Having said that, the new metro line might change that.", vi: "Tôi không nghĩ vậy. Lý do chính là giao thông công cộng ở đây vẫn khá chậm. Ví dụ, chuyến xe buýt đến trường của tôi mất một tiếng. Dù vậy, tuyến metro mới có thể làm thay đổi điều đó." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "Ý kiến → The main reason is that… → For example, … → Having said that, … / So overall, …",
      vi: "3–5 câu, khoảng 30–45 giây; bước 4 cho thấy bạn nhìn được cả hai mặt.",
    },

    /* ── 4 ── */
    { t: "h", text: "4. Nói về “con người, xã hội”, không chỉ về “tôi”" },
    {
      t: "table",
      caption: "Biến câu kiểu Part 1 thành câu kiểu Part 3",
      head: ["Kiểu Part 1 (về mình)", "Kiểu Part 3 (nói chung)"],
      rows: [
        ["I like shopping online.", "**Many people, especially young people,** prefer shopping online."],
        ["I don't have time to cook.", "**People who work long hours tend to** cook less at home."],
        ["My family eats together every evening.", "**In my country, most families** still try to eat together in the evening."],
        ["I think my phone is useful.", "**Generally speaking,** smartphones make **people's** lives more convenient."],
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Generally speaking / In general, + many / most + N + V",
          vi: "Mở đầu một nhận định chung.",
          examples: [
            { en: "Generally speaking, most students prefer studying in groups.", vi: "Nói chung, phần lớn sinh viên thích học nhóm." },
          ],
        },
        {
          formula: "S + tend to + V",
          vi: "“có xu hướng…” — nói chung mà không tuyệt đối hoá (không phải ai cũng vậy).",
          examples: [
            { en: "Older people tend to save more money than young people.", vi: "Người lớn tuổi có xu hướng tiết kiệm nhiều hơn người trẻ." },
          ],
        },
        {
          formula: "People who + V…, + V · In my country / In big cities, …",
          vi: "Thu hẹp nhóm người hoặc nơi chốn cho ý kiến chính xác hơn.",
          examples: [
            { en: "In big cities, people who live far from work often spend two hours a day in traffic.", vi: "Ở thành phố lớn, người sống xa chỗ làm thường mất hai tiếng mỗi ngày trên đường." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận",
      items: [
        "**people** là danh từ **số nhiều**: ~~People is busy~~ → People **are** busy · People **have**… (~~has~~).",
        "Đừng tuyệt đối hoá: ~~All people / Everyone uses social media.~~ → **Most people / Many people** use social media. Câu tuyệt đối dễ sai sự thật — giám khảo hỏi lại là bí.",
        "Ví dụ về bản thân vẫn được dùng ở **bước 3**: “For example, **in my family**, …” — nó chứng minh ý chung, không thay cho ý chung.",
      ],
    },
    {
      t: "rule",
      formula: "Generally speaking, many / most + N + V · S + tend to + V · People who + V… · In my country, …",
      vi: "Part 3: chủ ngữ là people / nhóm người / xã hội; “I” chỉ xuất hiện ở ý kiến (I think…) và ví dụ.",
    },
    {
      t: "quiz",
      id: "t2d13-noi-dich",
      title: "Dịch sang tiếng Anh — câu trả lời Part 3 (5 câu)",
      kind: "translate",
      grammar: "Generally speaking, many / most + N + V · S + tend to + V · The main reason is that + S + V · If…, … will… · Having said that, …",
      items: [
        {
          q: "Nói chung, nhiều người trẻ thích sống ở thành phố hơn.",
          hint: "Generally speaking, many young people, prefer to live / living in cities",
          answers: ["Generally speaking, many young people prefer to live in cities.", "Generally speaking, many young people prefer living in cities.", "In general, many young people prefer to live in cities.", "In general, many young people prefer living in cities.", "Generally speaking, many young people prefer to live in the city.", "Generally speaking, many young people prefer living in the city.", "Generally speaking, a lot of young people prefer to live in cities.", "Generally, many young people prefer to live in cities."],
        },
        {
          q: "Người lớn tuổi có xu hướng tiết kiệm tiền nhiều hơn.",
          hint: "Older people, tend to, save more money",
          answers: ["Older people tend to save more money.", "Older people tend to save more.", "Elderly people tend to save more money.", "Old people tend to save more money.", "Older people tend to save more money than young people.", "Older people tend to save more money than younger people.", "The elderly tend to save more money."],
        },
        {
          q: "Lý do chính là thành phố có nhiều cơ hội việc làm hơn.",
          hint: "The main reason is that, cities have / offer more job opportunities",
          answers: ["The main reason is that cities have more job opportunities.", "The main reason is that cities offer more job opportunities.", "The main reason is that there are more job opportunities in cities.", "The main reason is cities have more job opportunities.", "The main reason is that cities have more employment opportunities.", "The main reason is that cities offer more employment opportunities.", "The main reason is that there are more jobs in cities.", "The main reason is that cities have more jobs."],
        },
        {
          q: "Nếu chính phủ không hành động, vấn đề sẽ tệ hơn.",
          hint: "If the government doesn't act / take action, the problem will get worse",
          answers: ["If the government doesn't act, the problem will get worse.", "If the government does not act, the problem will get worse.", "If the government doesn't take action, the problem will get worse.", "If the government doesn't act, the problem will become worse.", "If governments don't act, the problem will get worse.", "If governments don't take action, the problem will get worse.", "Unless the government acts, the problem will get worse.", "Unless the government takes action, the problem will get worse.", "If the government doesn't do anything, the problem will get worse."],
        },
        {
          q: "Dù vậy, tôi nghĩ tình hình đang dần thay đổi.",
          hint: "Having said that, I think, the situation is slowly / gradually changing",
          answers: ["Having said that, I think the situation is slowly changing.", "Having said that, I think the situation is gradually changing.", "Having said that, I think the situation is changing slowly.", "Having said that, I think the situation is changing gradually.", "That said, I think the situation is slowly changing.", "That said, I think the situation is gradually changing.", "However, I think the situation is slowly changing.", "However, I think the situation is gradually changing.", "Even so, I think the situation is slowly changing.", "Even so, I think the situation is gradually changing."],
        },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Dự đoán và nói hệ quả bằng câu điều kiện" },
    {
      t: "p",
      text: "Câu hỏi dự đoán và giải pháp là chỗ **dùng ngay** ngữ pháp bài 1. Thêm **probably / might** để câu dự đoán không quá chắc — người bản xứ hiếm khi nói về tương lai của xã hội bằng giọng 100 %.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "If + S + V(s/es), S + will probably / might + V",
          vi: "Dự đoán hệ quả — trả lời “What will happen if…?”.",
          examples: [
            { en: "If more people work from home, city centres will probably become quieter.", vi: "Nếu nhiều người làm việc ở nhà hơn, trung tâm thành phố có lẽ sẽ yên tĩnh hơn." },
          ],
        },
        {
          formula: "Unless + S + V(s/es), S + will + V",
          vi: "Cảnh báo — hợp với câu hỏi giải pháp: chỉ ra điều sẽ xảy ra nếu không làm gì.",
          examples: [
            { en: "Unless parents limit screen time, children will find it harder to concentrate at school.", vi: "Trừ khi cha mẹ giới hạn thời gian dùng màn hình, trẻ sẽ khó tập trung ở trường hơn." },
          ],
        },
        {
          formula: "One thing that could help is + N / V-ing. If…, … will…",
          vi: "Giải pháp + hệ quả: nêu cách làm rồi nói kết quả bằng câu điều kiện.",
          examples: [
            { en: "One thing that could help is cheaper bus tickets. If buses are cheaper, fewer people will drive into the city.", vi: "Một điều có thể giúp là vé xe buýt rẻ hơn. Nếu xe buýt rẻ hơn, ít người lái xe vào thành phố hơn." },
          ],
        },
      ],
    },
    {
      t: "rule",
      formula: "If + S + V(s/es), S + will probably / might + V · Unless + S + V(s/es), S + will + V",
      vi: "Câu hỏi dự đoán / giải pháp ở Part 3: một câu điều kiện đúng = một điểm cộng cho GRA.",
    },

    /* ── 6 ── */
    { t: "h", text: "6. Khi không nghe rõ, không hiểu từ, hoặc cần vài giây" },
    {
      t: "p",
      text: "Tập 1 Ngày 13 bạn đã học “**Could you repeat the question, please?**”. Ở Part 3, câu hỏi dài và khó hơn, nên cần thêm vài câu nữa. Xin nhắc lại **một lần** không bị trừ điểm; im lặng lâu hoặc nói lạc đề vì hiểu sai câu hỏi mới bị trừ.",
    },
    {
      t: "table",
      head: ["Tình huống", "Câu nên nói", "Không nên"],
      rows: [
        ["Không nghe rõ", "Sorry, **could you repeat the question**, please? · Sorry, **I didn't quite catch that**.", "~~What?~~ · ~~Again?~~ · ~~Repeat.~~"],
        ["Không hiểu một từ", "Sorry, **what do you mean by** “consumerism”? · **Could you explain what** “sustainable” **means**?", "Đoán bừa rồi trả lời lạc đề"],
        ["Muốn chắc mình hiểu đúng", "**Do you mean** … ? · **So you're asking whether** …?", "Hỏi lại toàn bộ câu"],
        ["Cần vài giây suy nghĩ", "**That's an interesting question.** I've never really thought about it, but **I suppose** … · **Let me think** … Well, …", "Im lặng > 3 giây · “Ummmm…” kéo dài · ~~I don't know.~~ rồi dừng"],
        ["Không có ý tưởng", "**I'm not really sure, but I imagine** that … · I don't know much about this, but **my guess is that** …", "~~I have no idea.~~ (rồi dừng)"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận: Part 1 và Part 3 khác nhau ở chỗ này",
      items: [
        "**Part 1**: giám khảo chỉ được **nhắc lại** câu hỏi, **không giải thích** từ. Không hiểu một từ thì trả lời theo phần mình hiểu.",
        "**Part 3**: giám khảo **có thể diễn đạt lại** câu hỏi bằng cách khác khi bạn hỏi nghĩa — tận dụng điều này.",
        "Câu kéo giờ phải **dẫn vào ý**: “That's an interesting question… I suppose the main reason is…”. Dùng cùng một câu kéo giờ cho **mọi** câu hỏi thì nghe như học thuộc — Fluency không tăng mà còn giảm.",
      ],
    },
    {
      t: "rule",
      formula: "Sorry, could you repeat the question? · What do you mean by …? · That's an interesting question. I suppose …",
      vi: "Hỏi lại một lần là bình thường; câu kéo giờ phải nối ngay vào câu trả lời.",
    },

    /* ── 7 ── */
    { t: "h", text: "7. Nghe hai câu trả lời mẫu: band 5 và band 6" },
    {
      t: "p",
      text: "Cùng hai câu hỏi Part 3 về chủ đề **rác thải** (nối với bài nghe hôm nay). Nghe câu trả lời band 5 trước, rồi band 6, sau đó đọc bảng so sánh — để thấy chính xác **điều gì** kéo điểm lên.",
    },
    {
      t: "dialogue",
      title: "Câu trả lời band 5 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think people today throw away too many things?" },
        { who: "Candidate", role: "candidate", text: "Yes, I think so. People buy many things and they throw away. For example, plastic bag. I think it is not good for environment.", vi: "Vâng, tôi nghĩ vậy. Người ta mua nhiều thứ và họ vứt đi. Ví dụ, túi nhựa. Tôi nghĩ nó không tốt cho môi trường." },
        { who: "Examiner", role: "examiner", text: "What will happen if people don't change their habits?" },
        { who: "Candidate", role: "candidate", text: "If people don't change, I think environment will more dirty. And many animal will die. So it is very dangerous.", vi: "Nếu người ta không thay đổi, tôi nghĩ môi trường sẽ bẩn hơn. Và nhiều con vật sẽ chết. Nên nó rất nguy hiểm." },
      ],
    },
    {
      t: "dialogue",
      title: "Câu trả lời band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think people today throw away too many things?" },
        { who: "Candidate", role: "candidate", text: "Yes, I'd say most people do, especially in big cities. The main reason is that things are so cheap now that it's easier to buy a new one than to repair the old one. For example, in my neighbourhood, people often throw out fans or kettles that only need a small repair. Having said that, I think young people are becoming more aware of the problem, so things may be slowly changing.", vi: "Vâng, tôi cho là phần lớn mọi người như vậy, nhất là ở thành phố lớn. Lý do chính là đồ đạc giờ rẻ đến mức mua cái mới dễ hơn sửa cái cũ. Ví dụ, ở khu tôi ở, người ta hay vứt quạt hay ấm đun nước chỉ cần sửa một chút. Dù vậy, tôi nghĩ người trẻ đang ý thức hơn về vấn đề này, nên mọi thứ có thể đang dần thay đổi." },
        { who: "Examiner", role: "examiner", text: "What will happen if people don't change their habits?" },
        { who: "Candidate", role: "candidate", text: "Well, if people don't change their habits, our landfills will simply run out of space, and more plastic will end up in the sea. In Vietnam, for instance, some rivers are already full of rubbish after heavy rain. So unless governments and ordinary people both take action, I'm afraid the situation will get worse quite quickly.", vi: "Chà, nếu người ta không đổi thói quen, các bãi rác sẽ hết chỗ, và nhiều nhựa hơn sẽ trôi ra biển. Ví dụ ở Việt Nam, vài con sông đã đầy rác sau mưa lớn. Nên trừ khi cả chính phủ lẫn người dân đều hành động, tôi e là tình hình sẽ tệ đi khá nhanh." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao câu trả lời thứ hai được điểm cao hơn",
      head: ["Tiêu chí", "Band 5", "Band 6"],
      rows: [
        ["**Fluency & Coherence**", "2–3 câu ngắn rồi dừng; ý không phát triển; nối bằng and / so", "Đủ 4 bước (ý kiến → lý do → ví dụ → nhượng bộ); nối bằng **The main reason is that · For example · Having said that · So unless…**"],
        ["**Lexical Resource**", "Từ cơ bản, lặp đi lặp lại (throw away ×2, many ×3); thiếu từ chủ đề cụ thể và collocation — chỉ dùng được từ quen thuộc nhất", "**throw out · repair · landfills · run out of space · end up in the sea · take action · aware of**"],
        ["**Grammatical Range & Accuracy**", "Lỗi: ~~they throw away~~ (thiếu them) · ~~plastic bag~~ (thiếu số nhiều) · ~~for environment~~ (thiếu the) · ~~will more dirty~~", "Câu điều kiện **loại 1** và **unless** đúng; so sánh **easier… than**; **so… that** — câu phức đa dạng, gần như không lỗi"],
        ["**Pronunciation**", "Đọc đều mọi âm tiết: ~~en-vi-ron-MENT~~", "Trọng âm đúng: en-**VI**-ron-ment, **GOV**-ern-ments, **NEIGH**-bour-hood — xem mục 8"],
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Phát âm: trọng âm từ 3 âm tiết (nhập môn)" },
    {
      t: "p",
      text: "**Trọng âm từ** (word stress) = âm tiết được đọc **to hơn, dài hơn, cao hơn** các âm tiết khác trong một từ. Tập 2 Ngày 11 đã học từ **2 âm tiết** (REcord / reCORD). Từ **3 âm tiết** khó hơn vì có hai âm tiết **không nhấn** — chúng thường **yếu đi**, nhiều khi thành âm /ə/. Người Việt đọc mỗi âm tiết như một chữ có thanh, đều nhau → nghe “máy”, có khi sai luôn từ.",
    },
    {
      t: "table",
      caption: "Năm xu hướng hay gặp (có ngoại lệ — gặp từ mới thì tra từ điển, dấu ˈ đứng TRƯỚC âm tiết nhấn)",
      head: ["Xu hướng", "Ví dụ", "Phiên âm"],
      rows: [
        ["Danh từ & tính từ 3 âm tiết: thường nhấn **âm 1**", "**FA**-mi-ly · **HOL**-i-day · **GOV**-ern-ment · **EN**-er-gy · **BEAU**-ti-ful · **DIF**-fi-cult · **POS**-i-tive", "/ˈfæməli/ · /ˈhɒlədeɪ/ · /ˈɡʌvənmənt/ · /ˈenədʒi/ · /ˈbjuːtɪfl/ · /ˈdɪfɪkəlt/ · /ˈpɒzətɪv/"],
        ["Đuôi **-tion / -sion / -ic**: nhấn âm **ngay trước** đuôi", "de-**CI**-sion · pol-**LU**-tion · so-**LU**-tion · fan-**TAS**-tic", "/dɪˈsɪʒn/ · /pəˈluːʃn/ · /səˈluːʃn/ · /fænˈtæstɪk/"],
        ["Động từ 3 âm tiết có tiền tố (de-, re-, con-…): thường nhấn **âm 2**", "de-**VEL**-op · re-**MEM**-ber · con-**SID**-er", "/dɪˈveləp/ · /rɪˈmembə(r)/ · /kənˈsɪdə(r)/"],
        ["Động từ đuôi **-ise / -ate** (3 âm tiết): thường nhấn **âm 1** — kể cả khi có tiền tố (**CON**-cen-trate)", "**OR**-gan-ise · **ED**-u-cate · **CON**-cen-trate", "/ˈɔːɡənaɪz/ · /ˈedʒukeɪt/ · /ˈkɒnsntreɪt/"],
        ["Đuôi **-ee / -eer**: nhấn **âm cuối** (thêm)", "vol-un-**TEER** · en-gi-**NEER** · ref-u-**GEE**", "/ˌvɒlənˈtɪə(r)/ · /ˌendʒɪˈnɪə(r)/ · /ˌrefjuˈdʒiː/"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai với trọng âm 3 âm tiết",
      items: [
        "Nhấn âm **cuối** theo thói quen: ~~fa-mi-LY~~, ~~gov-ern-MENT~~, ~~en-er-GY~~ → **FA**-mi-ly, **GOV**-ern-ment, **EN**-er-gy.",
        "Đọc âm tiết không nhấn **rõ như âm nhấn**: govern-ment phải nghe gần như /ˈɡʌv-ən-mənt/ — hai âm sau rất nhẹ.",
        "Một số tính từ **ngoại lệ** nhấn âm 2 vì bắt đầu bằng tiền tố: im-**POR**-tant /ɪmˈpɔːtnt/, ex-**PEN**-sive /ɪkˈspensɪv/. Đây là hai từ bạn dùng rất nhiều ở Part 3 — học thuộc riêng.",
        "Quy tắc hậu tố đầy đủ (-ity, -ical, -ology…) học hệ thống ở **Tập 3 Ngày 7**; hôm nay chỉ cần đọc đúng các từ hay gặp trong Part 3.",
      ],
    },
    {
      t: "phatam",
      id: "t2d13-phat-am",
      title: "Luyện phát âm — trọng âm từ 3 âm tiết",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Âm tiết VIẾT HOA ở dòng gợi ý là âm nhấn: đọc to, dài, cao hơn; hai âm tiết còn lại nhẹ và ngắn. Ba dòng cuối đọc cả câu Part 3 — giữ trọng âm đúng cả khi nói nhanh.",
      items: [
        { text: "family, holiday, government", ipa: "fæməli hɒlədeɪ ɡʌvənmənt", vi: "FA-mi-ly · HOL-i-day · GOV-ern-ment — nhấn âm 1" },
        { text: "beautiful, difficult, positive", ipa: "bjuːtɪfl dɪfɪkəlt pɒzətɪv", vi: "BEAU-ti-ful · DIF-fi-cult · POS-i-tive — nhấn âm 1" },
        { text: "decision, pollution, solution", ipa: "dɪsɪʒn pəluːʃn səluːʃn", vi: "de-CI-sion · pol-LU-tion · so-LU-tion — nhấn ngay trước -sion / -tion" },
        { text: "develop, remember, consider", ipa: "dɪveləp rɪmembə kənsɪdə", vi: "de-VEL-op · re-MEM-ber · con-SID-er — động từ có tiền tố: nhấn âm 2" },
        { text: "important, expensive, fantastic", ipa: "ɪmpɔːtnt ɪkspensɪv fæntæstɪk", vi: "im-POR-tant · ex-PEN-sive · fan-TAS-tic — nhấn âm 2" },
        { text: "The government should make a decision about pollution.", ipa: "ðə ɡʌvənmənt ʃʊd meɪk ə dɪsɪʒn əbaʊt pəluːʃn", vi: "GOV-ern-ment · de-CI-sion · pol-LU-tion" },
        { text: "If families spend holidays together, children will remember them.", ipa: "ɪf fæməliz spend hɒlədeɪz təɡeðə tʃɪldrən wɪl rɪmembə ðəm", vi: "FA-mi-lies · HOL-i-days · re-MEM-ber — và một câu điều kiện loại 1" },
        { text: "I think it's important to consider the positive side.", ipa: "aɪ θɪŋk ɪts ɪmpɔːtnt tə kənsɪdə ðə pɒzətɪv saɪd", vi: "im-POR-tant · con-SID-er · POS-i-tive" },
      ],
    },

    /* ── 9 ── */
    { t: "h", text: "9. Luyện nói Part 3" },
    {
      t: "p",
      text: "Mỗi câu: 3–5 giây nghĩ (dùng câu kéo giờ ở mục 6 nếu cần) → trả lời theo **4 bước** khoảng **30–45 giây**. Nghe lại bản ghi và tự kiểm: có **lý do**? có **ví dụ**? có câu **nhượng bộ / chốt**? chủ ngữ có phải **people / nhóm người** không? có ít nhất **một câu điều kiện** đúng ở câu dự đoán / giải pháp không?",
    },
    {
      t: "speak",
      id: "t2d13-noi-p3-moi-truong",
      part: "3",
      questions: [
        "Do you think people today throw away too many things? Why?",
        "What will happen if people don't change their shopping habits?",
        "What can schools do to help children waste less?",
        "Is reducing waste mainly the government's job or the job of individuals?",
      ],
    },
    {
      t: "speak",
      id: "t2d13-noi-p3-gia-dinh",
      part: "3",
      questions: [
        "Do families in your country spend enough time together?",
        "Why do some parents work very long hours?",
        "How do you think family life will change in the future?",
        "Is it better for children to have hobbies at home or outside the home?",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D13_HOMEWORK: Lesson = {
  id: "t2d13-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 13",
  goal: "Ôn trọn Ngày 13: chia động từ và chọn đúng trong câu điều kiện loại 0 / 1, unless và mệnh đề thời gian; sửa lỗi will sau if; dịch câu có 💡; đọc một đoạn thoại kiểu Part 3 rồi trả lời MCQ + nối người – ý kiến; nhận ra trọng âm từ 3 âm tiết; ghi âm 3 câu trả lời Part 3.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (40 câu + 3 câu nói)",
      items: [
        "**I. Chia động từ** (10 câu) — loại 0, loại 1, unless, as soon as / when / until.",
        "**II. Chọn đáp án** (8 câu) — if / unless / until, thì động từ, câu trả lời Part 3.",
        "**III. Sửa lỗi** (5 câu) — viết lại cả câu cho đúng.",
        "**IV. Dịch Việt → Anh** (6 câu, có 💡).",
        "**V. Đọc thoại kiểu Listening Part 3** (5 câu) — MCQ + ai nói ý nào. **VI. Trọng âm** (6 câu). **VII. Nói** — 3 câu Part 3 (ghi âm, AI chấm).",
        "Mục tiêu: **≥ 32/40** (80 %). Dưới 28 thì đọc lại bài Ngữ pháp mục 3, 5, 6 trước khi sang Ngày 14.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ôn nhanh Ngày 13 trước khi làm bài",
      caption: "Mỗi nhánh là điều dễ quên nhất của từng bài hôm nay.",
      center: "**Ngày 13**",
      branches: [
        { label: "Câu điều kiện", items: ["Loại 0: If + HTĐ, HTĐ", "Loại 1: If + HTĐ, will + V", "KHÔNG will sau if / when / as soon as / until", "unless = if … not"], anh: "memo" },
        { label: "Listening Part 3", items: ["MCQ: đúng người, ý cuối", "TWO: 2 câu, thứ tự tự do", "Flow-chart: theo thứ tự", "Đồng ý ≠ đề xuất"], anh: "headphone" },
        { label: "Speaking Part 3", items: ["Ý kiến → Lý do → Ví dụ → Nhượng bộ", "nói về people, không chỉ I", "If…, … will probably…", "Could you repeat the question?"], anh: "speaking-head" },
        { label: "Trọng âm 3 âm tiết", items: ["FA-mi-ly · GOV-ern-ment", "de-CI-sion (-tion / -sion)", "re-MEM-ber (động từ)", "vol-un-TEER (-eer)"], anh: "microphone" },
      ],
    },

    /* ── I ── */
    { t: "h", text: "I. Chia động từ trong ngoặc (10 câu)" },
    {
      t: "p",
      text: "Viết **dạng đúng** của động từ trong ngoặc (có thể là một hoặc hai từ, vd **doesn't rain**, **will call**). Nhớ: vế if / unless / when / as soon as / until chia **hiện tại đơn**; vế kết quả loại 0 chia hiện tại đơn, loại 1 dùng **will**.",
    },
    {
      t: "quiz",
      id: "t2d13-bt-chia",
      title: "I. Chia động từ (10 câu)",
      kind: "fill",
      items: [
        { q: "If you ___ (mix) red and white paint, you get pink.", answers: ["mix"] },
        { q: "If it ___ (not rain) tomorrow, we'll have a picnic in the park.", answers: ["doesn't rain", "does not rain"] },
        { q: "I ___ (call) you as soon as my plane lands.", answers: ["will call", "'ll call"] },
        { q: "If Minh ___ (miss) the 7 o'clock bus, he'll be late for class.", answers: ["misses"] },
        { q: "Unless you ___ (book) now, there won't be any seats left.", answers: ["book"] },
        { q: "We'll start the meeting when everyone ___ (arrive).", answers: ["arrives"] },
        { q: "If plants ___ (not get) enough light, their leaves turn yellow.", answers: ["don't get", "do not get"] },
        { q: "She ___ (not pass) the speaking test unless she practises more.", answers: ["won't pass", "will not pass"] },
        { q: "Don't open the test booklet until the examiner ___ (tell) you to.", answers: ["tells"] },
        { q: "If the café ___ (offer) a discount, more students will bring their own cups.", answers: ["offers"] },
      ],
    },

    /* ── II ── */
    { t: "h", text: "II. Chọn đáp án đúng (8 câu)" },
    {
      t: "mcq",
      id: "t2d13-bt-chon",
      title: "II. Chọn đáp án đúng (8 câu)",
      items: [
        { q: "If you ___ the green button, the machine starts.", options: ["pressed", "press", "will press"], correct: 1, why: "Hướng dẫn luôn đúng (máy lần nào cũng chạy) → **loại 0**: If + **hiện tại đơn**, hiện tại đơn. ~~will press~~ sai vì will sau if; pressed là quá khứ." },
        { q: "I'll lend you my notes ___ you promise to give them back on Monday.", options: ["if", "unless", "until"], correct: 0, why: "Cho mượn **với điều kiện** bạn hứa trả → **if**. “unless you promise” = cho mượn nếu bạn KHÔNG hứa — vô lý; until (cho đến khi) không hợp nghĩa." },
        { q: "You won't improve ___ you practise every day.", options: ["if", "when", "unless"], correct: 2, why: "“Sẽ không tiến bộ **trừ khi** luyện mỗi ngày” → **unless** (= if you don't practise). “won't improve if you practise” ngược nghĩa." },
        { q: "After she ___ university, she'll work in her parents' company.", options: ["will finish", "finished", "finishes"], correct: 2, why: "**after** + tương lai → **hiện tại đơn**: after she finishes. ~~will finish~~ sai luật mệnh đề thời gian; finished là quá khứ." },
        { q: "If the weather is bad, the school trip ___ cancelled.", options: ["will be", "is being", "would be"], correct: 0, why: "Loại 1: If + hiện tại đơn (is), **will + V** (will be cancelled — bị động tương lai). would be thuộc loại 2; is being cancelled là tiếp diễn, không hợp." },
        { q: "Which sentence is correct?", options: ["If you will need help, ask me.", "If you need help, ask me.", "If you needed help, ask me."], correct: 1, why: "Vế if hiện tại đơn + **câu mệnh lệnh**: If you need help, ask me. A có will sau if; C trộn quá khứ (needed) với mệnh lệnh — sai thì." },
        { q: "Which sentence means “If we don't leave now, we'll be late”?", options: ["Unless we don't leave now, we'll be late.", "When we leave now, we'll be late.", "Unless we leave now, we'll be late."], correct: 2, why: "**Unless** + khẳng định = if … not → Unless we **leave** now. A là phủ định kép; B đổi nghĩa hoàn toàn (đi bây giờ thì sẽ muộn?)." },
        { q: "Examiner (Part 3): “What will happen if more people work from home?” — Which answer is the best start?", options: ["If more people work from home, cities will probably have less traffic.", "Yes, I work from home sometimes.", "If more people will work from home, there is less traffic."], correct: 0, why: "Câu hỏi **dự đoán** → If + hiện tại đơn, will **probably** + V, nói về **cities / people**. B trả lời về bản thân (kiểu Part 1, lạc câu hỏi); C có will sau if và vế kết quả sai thì." },
      ],
    },

    /* ── III ── */
    { t: "h", text: "III. Sửa lỗi — viết lại cả câu cho đúng (5 câu)" },
    {
      t: "p",
      text: "Mỗi câu có **một** lỗi. Viết lại **cả câu** đã sửa (giữ nguyên các từ khác).",
    },
    {
      t: "quiz",
      id: "t2d13-bt-sua",
      title: "III. Sửa lỗi (5 câu)",
      kind: "fill",
      items: [
        { q: "If it will be sunny tomorrow, we'll go to the beach.", answers: ["If it is sunny tomorrow, we'll go to the beach.", "If it's sunny tomorrow, we'll go to the beach.", "If it is sunny tomorrow, we will go to the beach.", "If it's sunny tomorrow, we will go to the beach."] },
        { q: "Unless you don't wear a helmet, you can't ride the motorbike.", answers: ["Unless you wear a helmet, you can't ride the motorbike.", "Unless you wear a helmet, you cannot ride the motorbike.", "If you don't wear a helmet, you can't ride the motorbike.", "If you do not wear a helmet, you cannot ride the motorbike."] },
        { q: "I'll tell her the news as soon as she will come back.", answers: ["I'll tell her the news as soon as she comes back.", "I will tell her the news as soon as she comes back."] },
        { q: "If he study harder, he will get a scholarship.", answers: ["If he studies harder, he will get a scholarship.", "If he studies harder, he'll get a scholarship."] },
        { q: "If you finish early, so you can leave.", answers: ["If you finish early, you can leave.", "You can leave if you finish early."] },
      ],
    },
    {
      t: "note",
      title: "Giải thích đáp án I và III",
      items: [
        "**I.1 mix** — sự thật (pha màu) → loại 0. **I.7 don't get** — quy luật về cây → loại 0, vế kết quả “turn” cũng hiện tại đơn.",
        "**I.2 doesn't rain · I.4 misses · I.10 offers** — vế **if** của loại 1 → hiện tại đơn, nhớ **-s/-es** với it / Minh / the café (miss → miss**es**).",
        "**I.3 will call · I.8 won't pass** — đây là **vế kết quả** (vế còn lại có as soon as / unless) → will / won't + V.",
        "**I.5 book · I.6 arrives · I.9 tells** — sau **unless / when / until** chia hiện tại đơn. everyone là **số ít** → arrive**s**; the examiner → tell**s**.",
        "**III.1** bỏ **will** sau if (will be → **is**). **III.2** phủ định kép: unless + **khẳng định** (hoặc đổi sang If you don't…). **III.3** bỏ will sau as soon as (**comes**). **III.4** thiếu -es (study → **studies**). **III.5** bỏ **so** — dấu phẩy đã thay chữ “thì”.",
      ],
    },

    /* ── IV ── */
    { t: "h", text: "IV. Dịch sang tiếng Anh (6 câu)" },
    {
      t: "quiz",
      id: "t2d13-bt-dich",
      title: "IV. Dịch Việt → Anh (6 câu)",
      kind: "translate",
      grammar: "Loại 0: If / When + HTĐ, HTĐ · Loại 1: If + HTĐ, will + V · Unless + HTĐ (khẳng định) · until / as soon as + HTĐ.",
      items: [
        {
          q: "Nếu bạn không ăn sáng, bạn sẽ thấy mệt vào buổi trưa.",
          hint: "If you don't eat / have breakfast, you will feel tired, at noon / by lunchtime",
          answers: ["If you don't eat breakfast, you will feel tired at noon.", "If you don't have breakfast, you will feel tired at noon.", "If you don't eat breakfast, you will feel tired by noon.", "If you don't have breakfast, you will feel tired by noon.", "If you don't eat breakfast, you will feel tired at lunchtime.", "If you don't have breakfast, you will feel tired at lunchtime.", "If you don't eat breakfast, you will feel tired by lunchtime.", "If you don't have breakfast, you will feel tired by lunchtime.", "If you skip breakfast, you will feel tired at noon.", "You will feel tired at noon if you don't eat breakfast.", "You will feel tired at noon if you don't have breakfast."],
        },
        {
          q: "Tôi sẽ đợi cho đến khi bạn làm xong.",
          hint: "I will wait, until, you finish / are done",
          answers: ["I will wait until you finish.", "I will wait until you are done.", "I will wait until you have finished.", "I will wait until you finish your work.", "I will wait until you are finished.", "I will wait for you until you finish.", "I will wait till you finish.", "I will wait till you are done.", "I will wait till you have finished."],
        },
        {
          q: "Trừ khi trời mưa, trận đấu sẽ diễn ra vào thứ Bảy.",
          hint: "Unless it rains, the match will take place / be played, on Saturday",
          answers: ["Unless it rains, the match will take place on Saturday.", "Unless it rains, the match will be on Saturday.", "Unless it rains, the match will be played on Saturday.", "Unless it rains, the match will go ahead on Saturday.", "The match will take place on Saturday unless it rains.", "The match will be on Saturday unless it rains.", "The match will be played on Saturday unless it rains.", "Unless it rains, the game will take place on Saturday."],
        },
        {
          q: "Nếu chính phủ xây thêm làn đường cho xe đạp, sẽ có ít người lái ô tô hơn.",
          hint: "If the government builds more cycle lanes, fewer people will drive (cars)",
          answers: ["If the government builds more cycle lanes, fewer people will drive cars.", "If the government builds more cycle lanes, fewer people will drive.", "If the government builds more bike lanes, fewer people will drive cars.", "If the government builds more bike lanes, fewer people will drive.", "If governments build more cycle lanes, fewer people will drive.", "If governments build more cycle lanes, fewer people will drive cars.", "If the government builds more cycle lanes, fewer people will use cars.", "If the government builds more bicycle lanes, fewer people will drive cars.", "If the government builds more cycle lanes, there will be fewer people driving cars."],
        },
        {
          q: "Ngay khi về đến khách sạn, tôi sẽ nhắn tin cho bạn.",
          hint: "As soon as I get to / arrive at the hotel, I will text you / send you a message",
          answers: ["As soon as I get to the hotel, I will text you.", "As soon as I get to the hotel, I will send you a message.", "As soon as I arrive at the hotel, I will text you.", "As soon as I arrive at the hotel, I will send you a message.", "I will text you as soon as I get to the hotel.", "I will send you a message as soon as I get to the hotel.", "I will text you as soon as I arrive at the hotel.", "As soon as I reach the hotel, I will text you.", "As soon as I get back to the hotel, I will text you."],
        },
        {
          q: "Khi nước đóng băng, nó nở ra.",
          hint: "When / If water freezes, it expands — loại 0",
          answers: ["When water freezes, it expands.", "If water freezes, it expands.", "Water expands when it freezes.", "Water expands if it freezes.", "When water freezes, it gets bigger."],
        },
      ],
    },

    /* ── V ── */
    { t: "h", text: "V. Đọc đoạn thoại kiểu Listening Part 3 (5 câu)" },
    {
      t: "p",
      text: "Đọc đoạn thoại (hoặc bấm nghe từng câu) giữa hai sinh viên **Sophie** và **Nam** và giảng viên **Dr Clarke** về một khảo sát ở phòng tập thể dục của trường. Rồi làm câu 1–2 (chọn A, B hoặc C) và câu 3–5 (ai nói ý nào). Luyện đúng kỹ năng bài Nghe: **đúng người · ý cuối cùng · đồng ý ≠ đề xuất**.",
    },
    {
      t: "dialogue",
      title: "The gym survey",
      lines: [
        { who: "Dr Clarke", role: "c", text: "So, how is the gym survey going?", vi: "Vậy khảo sát về phòng tập đến đâu rồi?" },
        { who: "Sophie", role: "a", text: "Not very well. We put the questionnaire on the student website, but only twenty people filled it in.", vi: "Không ổn lắm ạ. Bọn em đưa bảng hỏi lên trang web sinh viên, nhưng chỉ hai mươi người điền." },
        { who: "Nam", role: "b", text: "I think the problem is the timing. We sent it out during the exam period, so everyone was too busy.", vi: "Em nghĩ vấn đề là thời điểm. Bọn em gửi đi giữa mùa thi nên ai cũng quá bận." },
        { who: "Dr Clarke", role: "c", text: "That's probably part of it. But a website link is easy to ignore. If you stand outside the gym and ask people face to face, you'll get far more answers.", vi: "Có lẽ đó là một phần lý do. Nhưng đường link trên web thì dễ bị bỏ qua. Nếu các em đứng trước phòng tập và hỏi trực tiếp, các em sẽ có nhiều câu trả lời hơn hẳn." },
        { who: "Sophie", role: "a", text: "That makes sense. We could go at lunchtime, when the gym is busiest.", vi: "Hợp lý ạ. Bọn em có thể đi vào giờ trưa, lúc phòng tập đông nhất." },
        { who: "Nam", role: "b", text: "I'm not so sure about lunchtime. People are in a hurry then. How about the evening? Students stay longer after six.", vi: "Tớ không chắc về giờ trưa. Lúc đó mọi người vội lắm. Hay là buổi tối? Sau sáu giờ sinh viên ở lại lâu hơn." },
        { who: "Dr Clarke", role: "c", text: "Try both, and compare. And keep the questionnaire short. Unless it takes less than three minutes, people won't finish it.", vi: "Thử cả hai rồi so sánh. Và giữ bảng hỏi thật ngắn. Trừ khi nó mất dưới ba phút, người ta sẽ không làm hết." },
        { who: "Sophie", role: "a", text: "Then let's cut it to eight questions.", vi: "Vậy mình rút xuống còn tám câu đi." },
        { who: "Nam", role: "b", text: "Fine. I'll print the new version as soon as we agree on the questions.", vi: "Được. Tớ sẽ in bản mới ngay khi bọn mình thống nhất các câu hỏi." },
      ],
    },
    {
      t: "mcq",
      id: "t2d13-bt-thoai",
      title: "V. Câu 1–2: chọn A, B hoặc C · Câu 3–5: A Sophie · B Nam · C Dr Clarke",
      items: [
        { q: "(1) According to Nam, why did so few people answer the first questionnaire?", options: ["A It was too long.", "B It was sent during the exam period.", "C The website link did not work."], correct: 1, why: "Nam: “We sent it out **during the exam period**, so everyone was too busy.” A: độ dài là chuyện Dr Clarke nói **sau** (keep it short), không phải lý do Nam nêu. C: link “easy to ignore” (dễ bị bỏ qua) ≠ không hoạt động." },
        { q: "(2) What does Dr Clarke recommend?", options: ["A asking students in person", "B putting the link on the website again", "C waiting until the exams finish"], correct: 0, why: "Dr Clarke: “If you stand outside the gym and **ask people face to face**, you'll get far more answers.” face to face = **in person**. B và C không ai đề xuất." },
        { q: "(3) The evening would be a better time to ask students.", options: ["A Sophie", "B Nam", "C Dr Clarke"], correct: 1, why: "Nam: “**How about the evening?** Students stay longer after six.” Dr Clarke chỉ bảo “Try both” — không nói buổi tối tốt hơn." },
        { q: "(4) A long questionnaire will not be completed.", options: ["A Sophie", "B Nam", "C Dr Clarke"], correct: 2, why: "Dr Clarke: “**Unless it takes less than three minutes, people won't finish it.**” Sophie chỉ **chốt hành động** (cut it to eight questions) theo lời khuyên đó." },
        { q: "(5) Lunchtime is a good time because the gym is busy.", options: ["A Sophie", "B Nam", "C Dr Clarke"], correct: 0, why: "Sophie: “We could go **at lunchtime, when the gym is busiest**.” Nam nhắc lunchtime nhưng để **phản đối** (“I'm not so sure about lunchtime”)." },
      ],
    },

    /* ── VI ── */
    { t: "h", text: "VI. Trọng âm từ 3 âm tiết (6 câu)" },
    {
      t: "p",
      text: "Đọc to từng từ, rồi chọn **âm tiết được nhấn**. Kiểm lại bằng bảng ở bài Nói mục 8.",
    },
    {
      t: "mcq",
      id: "t2d13-bt-trong-am",
      title: "VI. Âm tiết nào được nhấn? (6 câu)",
      items: [
        { q: "family", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 0, why: "/ˈfæməli/ — **FA**-mi-ly. Danh từ 3 âm tiết thường nhấn âm 1." },
        { q: "decision", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 1, why: "/dɪˈsɪʒn/ — de-**CI**-sion. Đuôi **-sion**: nhấn âm ngay trước nó." },
        { q: "volunteer", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 2, why: "/ˌvɒlənˈtɪə(r)/ — vol-un-**TEER**. Đuôi **-eer** nhận trọng âm chính." },
        { q: "remember", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 1, why: "/rɪˈmembə(r)/ — re-**MEM**-ber. Động từ có tiền tố re-: nhấn âm 2." },
        { q: "energy", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 0, why: "/ˈenədʒi/ — **EN**-er-gy. Người Việt hay đọc ~~en-er-GY~~ (nhấn cuối)." },
        { q: "engineer", options: ["A 1st syllable", "B 2nd syllable", "C 3rd syllable"], correct: 2, why: "/ˌendʒɪˈnɪə(r)/ — en-gi-**NEER**. Giống volunteer: đuôi -eer nhấn cuối." },
      ],
    },

    /* ── VII ── */
    { t: "h", text: "VII. Nói — 3 câu Part 3 (ghi âm, AI chấm)" },
    {
      t: "p",
      text: "Trả lời mỗi câu **30–45 giây** theo 4 bước. Câu 2 là câu **dự đoán** — dùng **If…, … will probably…**; câu 3 là câu **giải pháp** — nêu một cách làm rồi nói hệ quả.",
    },
    {
      t: "speak",
      id: "t2d13-bt-noi",
      part: "3",
      questions: [
        "Why do many students find it hard to manage their time?",
        "What will happen if universities move most of their classes online?",
        "What can young people do to save money?",
      ],
    },
  ],
};

export const NGAY_13: Lesson[] = [T2D13_GRAMMAR, T2D13_LISTENING, T2D13_SPEAKING, T2D13_HOMEWORK];
